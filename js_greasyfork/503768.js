// ==UserScript==
// @name         Get Trivia ip locations in google maps
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2024-08-15
// @description  Requesting ip locations from wordpress quiz maker.
// @author       You
// @match        https://jwtrivia.com/wp-admin/admin.php?page=quiz-maker-results*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jwtrivia.com
// @grant        GM.setClipboard
// @grant        GM.setValue
// @grant        GM.getValue

// @downloadURL https://update.greasyfork.org/scripts/503768/Get%20Trivia%20ip%20locations%20in%20google%20maps.user.js
// @updateURL https://update.greasyfork.org/scripts/503768/Get%20Trivia%20ip%20locations%20in%20google%20maps.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    window.addEventListener('load', async function() {
        const ipMap = await loadLocalStorage();
        showLines(ipMap);
    }, false);

})();

function showLines(ipMap){
    const collection = document.getElementsByClassName("user_ip column-user_ip");
    var ips = [].slice.call(collection).map(element => element.innerText);

    var requestOptions = {
        method: 'GET',
    };

    const promises = ips
    .filter(ip => !(ip in ipMap))
    .map(ip =>
         fetch(`https://reallyfreegeoip.org/json/${ip}`, requestOptions)
         .then(response=>response.json())
         .catch(error => console.log('error', error))
    );

    Promise.all(promises).then(async responseData => {
        var lines = responseData.filter(data => data && data.longitude && data.latitude);
        lines.forEach(data => {data.location_display = [data.city, data.region_name, data.country_name].filter(loc => loc).join(",");});
        lines.forEach(data => {data.line = `"POINT (${data.longitude} ${data.latitude})","${data.location_display}"`;});
        ipMap = await saveNewIps(lines);
        var output = buildCsv(ipMap);
        console.log(output);
        GM.setClipboard(output, "text");
        alert(buildAlertMessage(ips,promises,ipMap,responseData))
    });
}

async function loadLocalStorage(){
    const ipMapStr = await GM.getValue("ipMap");
    if (ipMapStr){
        const ipMap = JSON.parse(ipMapStr);
        return ipMap;
    }
    else{
        GM.setValue("ipMap", "{}");
        return {};
    }
}

async function saveNewIps(ipData){
    var ipMap = await loadLocalStorage();
    ipData.forEach(data => {
        ipMap[data.ip] = data.line;
    });
    GM.setValue("ipMap", JSON.stringify(ipMap));
    return ipMap;
}
function buildCsv(ipMap){
    var output = "WKT,name\n";
    output += Object.entries(ipMap).map(([ip,line]) => line).join("\n");
    return output;
}

function buildAlertMessage(ips,promises,ipMap,responseData){
    const errors = promises.length - responseData.length;
    return `Ip locations in clipboard!
${ips.length} IPs in this page
${promises.length} new IP locations requested
${responseData.length} Sucessful requests
Total IPs stored:       ${Object.keys(ipMap).length}
${errors > 0 ? errors + " Errors! Please try again in couple of minutes, too many requests for ip locations at the same time can cause errors." : ""}
`;
}





