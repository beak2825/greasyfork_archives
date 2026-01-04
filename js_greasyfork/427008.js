// ==UserScript==
// @name         Wasabi Bucket Usage
// @namespace    https://mcgown.dev
// @version      0.1
// @description  Inject Wasabi CSV utilisation stats into your dashboard
// @author       Stewart McGown <stewart@mcgown.dev>
// @match        https://console.wasabisys.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427008/Wasabi%20Bucket%20Usage.user.js
// @updateURL https://update.greasyfork.org/scripts/427008/Wasabi%20Bucket%20Usage.meta.js
// ==/UserScript==
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

let lastBuckets = [];

(async function() {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    while (true) {

        await sleep(200)

        const buckets = [...document.querySelectorAll('td:nth-child(2)')]

        console.log(buckets)
        if (!buckets.length || buckets.every((b, i) => lastBuckets[i] === b)) continue;
        const auth = JSON.parse(localStorage.getItem('ba-auth'));
        const authHeader = `${auth.accessKeyId}:${auth.secretAccessKey}`

   if (!lastBuckets.length) {
       const headerRow = document.querySelector('#storageTable > thead > tr');
       const elem = headerRow.querySelector('th:last-child').cloneNode()
       const elem2 = elem.cloneNode(), elem3 = elem2.cloneNode();
       elem.id = 'egress'
       elem.innerHTML = 'Egress (month)'
       elem2.innerHTML = 'Size'
       elem3.innerHTML = 'Objects'
       headerRow.appendChild(elem)
       headerRow.appendChild(elem2)
       headerRow.appendChild(elem3)
   }


        lastBuckets = buckets.slice()


        for (const bucket of buckets) {

            if (bucket.parentElement.querySelector('#egress')) continue;

            fetch(`https://billing-service.wasabisys.com/v1/bucket/by-name/${bucket.innerText}/utilization?csv=true`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "x-wasabi-authorization": authHeader
                },
                "referrer": "https://console.wasabisys.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "omit",
                "cache": "force-cache"
            }).then(r => r.text()).then(async (res) => {



                const csv = CSVToArray(res);


                const totalIdx = csv[0].indexOf('BillableActiveStorageBytes')
                const objectsIdx = csv[0].indexOf('NumBillableActiveStorageObjects')
                const egressIdx = csv[0].indexOf('EgressBytes')

                const totalStorage = +csv[1][totalIdx]
                const objects = +csv[1][objectsIdx]

                let egressBytes = 0;
                for (const row of csv.slice(1, 30)) {
                    const val = +row[egressIdx];
                    if (!Number.isNaN(val) && typeof val === 'number') {
                        egressBytes += val;
                    }

                }

                const elem = document.createElement('td')
                elem.id = 'egress'
                elem.innerHTML = `${formatBytes(egressBytes)}`
    bucket.parentElement.appendChild(elem)
      const elem2 = elem.cloneNode()
      elem2.innerHTML = `${formatBytes(totalStorage)}`
    bucket.parentElement.appendChild(elem2)
      const elem3 = elem.cloneNode()
      elem3.innerHTML = `${objects}`
    bucket.parentElement.appendChild(elem3)
  })

   }

    }

})();