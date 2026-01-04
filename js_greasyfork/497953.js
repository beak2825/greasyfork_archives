// ==UserScript==
// @name         Kursy TSO
// @namespace    http://tampermonkey.net/
// @version      2024-06-14
// @description  Kursy kursy tso
// @author       @nowaratn
// @match        https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497953/Kursy%20TSO.user.js
// @updateURL https://update.greasyfork.org/scripts/497953/Kursy%20TSO.meta.js
// ==/UserScript==

var tso_stages = [
    ["STAGE_POZ2","42bf33f3-0cff-846a-04e1-8fc4c2563f3a"],
    ["STAGE_FRA7","aac425b8-25ab-8d26-721e-bc08e16194b0"],
    ["STAGE_DUS4","eec42757-e54c-1e4b-3469-f35f32ca3326"],
    ["STAGE_BRE4","70c73889-b794-6790-6676-2bc707fe361f"],
    ["STAGE_NUE1","acc78e54-ba4e-04e2-263c-85337f06516c"],
]

var endToken = '0';
var temp_token;


setTimeout(function(){
    var div_info = document.createElement('div');

    div_info.innerHTML = `
    <span id='TSO_Loading' style='background-image:url("https://drive.corp.amazon.com/view/nowaratn@/loading.gif");background-size:contain;height:36px;width:36px;display:flex;transform:translate(100%);'></span><br>
    <table style="margin:auto; font-size:24px; border-collapse:collapse; text-align:center;">
        <tr>
            <th style="padding: 8px;">Lane</th>
            <th style="padding: 8px;">Count</th>
            <th style="padding: 8px;">Time 1AA</th>
            <th style="padding: 8px;">2 AAs</th>
            <th style="padding: 8px;">3 AAs</th>
        </tr>
        <tr>
            <td id="Lane_DUS4" style="padding: 8px;">DUS4</td>
            <td id="Count_DUS4" style="padding: 8px;"></td>
            <td id="Time_DUS4" style="padding: 8px;"></td>
            <td id="Time2_DUS4" style="padding: 8px;"></td>
            <td id="Time3_DUS4" style="padding: 8px;"></td>
        </tr>
        <tr>
            <td id="Lane_FRA7" style="padding: 8px;">FRA7</td>
            <td id="Count_FRA7" style="padding: 8px;"></td>
            <td id="Time_FRA7" style="padding: 8px;"></td>
            <td id="Time2_FRA7" style="padding: 8px;"></td>
            <td id="Time3_FRA7" style="padding: 8px;"></td>
        </tr>
        <tr>
            <td id="Lane_NUE1" style="padding: 8px;">NUE1</td>
            <td id="Count_NUE1" style="padding: 8px;"></td>
            <td id="Time_NUE1" style="padding: 8px;"></td>
            <td id="Time2_NUE1" style="padding: 8px;"></td>
            <td id="Time3_NUE1" style="padding: 8px;"></td>
        </tr>
        <tr>
            <td id="Lane_POZ2" style="padding: 8px;">POZ2</td>
            <td id="Count_POZ2" style="padding: 8px;"></td>
            <td id="Time_POZ2" style="padding: 8px;"></td>
            <td id="Time2_POZ2" style="padding: 8px;"></td>
            <td id="Time3_POZ2" style="padding: 8px;"></td>
        </tr>
        <tr>
            <td id="Lane_BRE4" style="padding: 8px;">BRE4</td>
            <td id="Count_BRE4" style="padding: 8px;"></td>
            <td id="Time_BRE4" style="padding: 8px;"></td>
            <td id="Time2_BRE4" style="padding: 8px;"></td>
            <td id="Time3_BRE4" style="padding: 8px;"></td>
        </tr>
    </table>
`;



    document.getElementsByClassName('css-10omwz')[0].appendChild(div_info);
    manual_ko_click();

},1000);


async function manual_ko_click()
{
    // Pętla na Stage_TSO
    for await (const [nazwa, resource_id] of tso_stages) {
        do {
            const rawData = '{"query":"\\nquery ($queryInput: [SearchTermInput!]!, $startIndex: String) {\\n  searchEntities(searchTerms: $queryInput) {\\n    searchTerm {\\n      nodeId\\n      nodeTimezone\\n      searchId\\n      searchIdType\\n      resolvedIdType\\n    }\\n    contents(pageSize: 100, startIndex: $startIndex, forwardNavigate: true) {\\n      contents {\\n        containerId\\n        containerLabel\\n        containerType\\n        stackingFilter\\n        criticalPullTime\\n        isEmpty\\n        isClosed\\n        isForcedMove\\n        associationReason\\n        associatedUser\\n        timeOfAssociation\\n        cleanupAllowed\\n      }\\n      endToken\\n    }\\n  }\\n}\\n","variables":{"queryInput":[{"nodeId":"KTW1","searchId":"Stage_TSO","searchIdType":"UNKNOWN"}],"startIndex":"' + endToken + '"}}';
            await delay(400);
            postJsonAndGetContents(rawData).then(contents =>{

                console.log(contents);
                // console.log(contents);
                // console.log(contents.length);

                if(contents != null && contents.length != 0)
                {

                    var ile = 0;
                    ile = countMatchingElements(contents.contents, nazwa.substr(-4));

                    var ile_stage = parseInt(document.getElementById("Count_" + nazwa.substr(-4)).textContent);
                    if(!isNaN(ile_stage))
                    {
                        document.getElementById("Count_" + nazwa.substr(-4)).textContent = (ile_stage + ile).toString() + " pal";
                    }
                    else
                    {
                        document.getElementById("Count_" + nazwa.substr(-4)).textContent = ile.toString() + " pal";
                    }

                    temp_token = contents.endToken;

                    if(temp_token != null)
                    {
                        endToken = temp_token;
                    }
                    else
                    {
                        endToken = "0";
                    }
                }
            }).catch(error => console.error(error));
            await delay(400);


        } while (temp_token != null);

        await delay(400);
    }

    updateTime('Time_DUS4', 'Count_DUS4', 'Time2_DUS4', 'Time3_DUS4', 8);
    updateTime('Time_FRA7', 'Count_FRA7', 'Time2_FRA7', 'Time3_FRA7', 8);
    updateTime('Time_NUE1', 'Count_NUE1', 'Time2_NUE1', 'Time3_NUE1', 8);
    updateTime('Time_POZ2', 'Count_POZ2', 'Time2_POZ2', 'Time3_POZ2', 8);
    updateTime('Time_BRE4', 'Count_BRE4', 'Time2_BRE4', 'Time3_BRE4', 8);

    document.getElementById('TSO_Loading').style.backgroundImage = "";
}



function updateTime(elementId, countId, time2, time3, minTime) {
    var countElement = document.getElementById(countId);
    var timeElement = document.getElementById(elementId);
    var timeElement2 = document.getElementById(time2);
    var timeElement3 = document.getElementById(time3);

    if (countElement && timeElement && timeElement2 && timeElement3) {
        var count = parseInt(countElement.textContent);
        if (!isNaN(count)) {
            var time = Math.ceil(count / 4) * 8;
            if (time < minTime) time = minTime;
            timeElement.textContent = time + " min";
            timeElement2.textContent = Math.ceil(time / 2) < minTime ? minTime + " min" : Math.ceil(time / 2) + " min";
            timeElement3.textContent = Math.ceil(time / 3) < minTime ? minTime + " min" : Math.ceil(time / 3) + " min";
        }
    }
}



function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


function countMatchingElements(jsonArray, filterPart) {
    let count = 0; // Inicjalizacja licznika

    jsonArray.forEach(item => {
        const filter = item.stackingFilter;
        if (filter && filter.includes(filterPart)) { // Sprawdza, czy filter zawiera ciąg filterPart
            count++; // Inkrementacja licznika jeśli warunek jest spełniony
        }
    });

    return count; // Zwraca liczbę znalezionych wpisów
}


function findEndToken(obj) {
    var result = "0";

    function searchForEvents(o) {
        if (o !== null && typeof o === 'object') {
            // Jeśli klucz 'events' istnieje na tym poziomie, dodaj do wyników
            if (o.hasOwnProperty('endToken')) {
                result = o.endToken;
            }
            // Rekurencyjne przeszukanie każdej właściwości obiektu
            for (const key of Object.keys(o)) {
                searchForEvents(o[key]);
            }
        }
    }

    searchForEvents(obj);
    return result;
}


async function postJsonAndGetContents(rawData) {
    try {
        const jsonData = JSON.parse(rawData);
        const response = await fetch('https://trans-logistics-eu.amazon.com/sortcenter/tantei/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anti-csrftoken-a2z': document.querySelector("input[name='__token_']").value // Dodanie tokenu CSRF do nagłówków
            },
            body: JSON.stringify(jsonData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        //console.log(data.data.searchEntities[0].contents.contents);
        return data.data.searchEntities[0].contents ? data.data.searchEntities[0].contents : [];
    } catch (error) {
        console.error('Błąd przy żądaniu POST:', error);
        return []; // Zwraca pustą tablicę w przypadku błędu
    }
}