// ==UserScript==
// @name         BATO.TO Chapter Downloader
// @namespace    https://bblok.tech/
// @version      1.0
// @description  Download a chapter from bato.to into a .ZIP or .CBZ file!
// @author       Theblockbuster1
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://unpkg.com/jszip/dist/jszip.min.js
// @match        https://bato.to/chapter/*
// @match        http://bato.to/chapter/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/424210/BATOTO%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/424210/BATOTO%20Chapter%20Downloader.meta.js
// ==/UserScript==

function customBase64Encode(inputStr) { // https://stackoverflow.com/a/8781262/11037661
    var
        bbLen = 3,
        enCharLen = 4,
        inpLen = inputStr.length,
        inx = 0,
        jnx,
        keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                            + "0123456789+/=",
        output = "",
        paddingBytes = 0;
    var
        bytebuffer = new Array (bbLen),
        encodedCharIndexes = new Array (enCharLen);

    while (inx < inpLen) {
        for (jnx = 0; jnx < bbLen; ++jnx) {
            /*--- Throw away high-order byte, as documented at:
              https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
            */
            if (inx < inpLen)
                bytebuffer[jnx] = inputStr.charCodeAt (inx++) & 0xff;
            else
                bytebuffer[jnx] = 0;
        }

        /*--- Get each encoded character, 6 bits at a time.
            index 0: first  6 bits
            index 1: second 6 bits
                        (2 least significant bits from inputStr byte 1
                         + 4 most significant bits from byte 2)
            index 2: third  6 bits
                        (4 least significant bits from inputStr byte 2
                         + 2 most significant bits from byte 3)
            index 3: forth  6 bits (6 least significant bits from inputStr byte 3)
        */
        encodedCharIndexes[0] = bytebuffer[0] >> 2;
        encodedCharIndexes[1] = ( (bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
        encodedCharIndexes[2] = ( (bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6);
        encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

        //--- Determine whether padding happened, and adjust accordingly.
        paddingBytes = inx - (inpLen - 1);
        switch (paddingBytes) {
            case 1:
                // Set last character to padding char
                encodedCharIndexes[3] = 64;
                break;
            case 2:
                // Set last 2 characters to padding char
                encodedCharIndexes[3] = 64;
                encodedCharIndexes[2] = 64;
                break;
            default:
                break; // No padding - proceed
        }

        /*--- Now grab each appropriate character out of our keystring,
            based on our index array and append it to the output string.
        */
        for (jnx = 0; jnx < enCharLen; ++jnx)
            output += keyStr.charAt ( encodedCharIndexes[jnx] );
    }
    return output;
}

//console.log(getImageURLs());

function getImageURLs() {
    let imgs = [];
    $('.page-img').each(function() { imgs.push($(this).attr('src')) });
    return imgs;
}

function addZeros(number, length=2) {
    let rcount = length - number.toString().length;
    return '0'.repeat(rcount < 0 ? 0 : rcount) + number
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.setAttribute('download', name);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function download(urls, fileType='zip', mime='application/zip') {
   var zip = new JSZip();

   function request(url, i) {
     return new Promise(function(resolve) {
         GM_xmlhttpRequest({
             responseType: 'blob',
             method: "GET",
             url: url,
             onload: function(res) {
                 zip.file(`${addZeros(i, urls.length.toString().length)}.${url.match(/\.(\w{3,4})($|\?)/)[1]}`, customBase64Encode(res.responseText), { base64: true });
                 resolve()
             }
         });
     })
   }

   Promise.all(urls.map(function(url, i) {
       return request(url, i+1)
     }))
     .then(function() {
       zip.generateAsync({
           type: "base64"
         })
         .then(function(content) {
           console.log(`Downloading ${document.title}.${fileType}`);
           downloadURI(`data:${mime};base64,${content}`, `${document.title}.${fileType}`);
         });
     });
}

GM_registerMenuCommand('Download .ZIP', () => {
    download(getImageURLs(), 'zip', 'application/zip');
});

GM_registerMenuCommand('Download .CBZ', () => {
    download(getImageURLs(), 'cbz', 'application/vnd.comicbook+zip');
});