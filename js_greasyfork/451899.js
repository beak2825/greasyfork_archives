// ==UserScript==
// @name         Steam - Intigrate HowLongToBeat
// @namespace    Threeskimo
// @author       Threeskimo
// @version      1.30
// @description  Adds a button that shows the completion time for the "Main Story" and links to HowLongToBeat.
// @icon         https://store.steampowered.com/favicon.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451899/Steam%20-%20Intigrate%20HowLongToBeat.user.js
// @updateURL https://update.greasyfork.org/scripts/451899/Steam%20-%20Intigrate%20HowLongToBeat.meta.js
// ==/UserScript==

// Changelog //////////////////////////////////////////////////////////////////////////////////
// 1.30 : - Fixed API call.
// 1.25 : - More robust api calls
// 1.17 : - Fixed button hyperlink not working.
// 1.16 : - Updated and improved search query parameters. Added some additional error handling.
// 1.15 : - Added some trickery to detect api changes. Let's see if this holds.
// 1.12 : - api call updated (again), as predicted.
// 1.11 : - api call updated. Call looks temporary so might break again.
// 1.10 : - Updated `htbUrl` to include `/locate` as well as updated `hltbQuery` request as it requires additional data to perform query
// 1.09 : - A few missed versions, but Fixed mobile loading (again). Should work now.
// 1.06 : - `pageTotal` no longer is null when no game is found, it returns 0 instead. Updated script to handle this change.
// 1.05 : - Updated to show "--" instead of "HLTB" on button when the GameName is found, but no data exists. (Will still show "HLTB" on the button if the game is not found at all.)
// 1.04 : - Added mobile integration (with loader).
// 1.03 : - Updated script to pull more accurate data by verifying game_name when possible.
// 1.02 : - HLTB updated to JSON responses. Updated script to account for this change.
// 1.01 : - Added "origin" and "referer" to GM_xmlhttpRequest headers as HLTB requires now.
// 1.0  : - Release.
///////////////////////////////////////////////////////////////////////////////////////////////

(async function() {
//Setup loaders for mobile and desktop
$("#appHeaderGridContainer").append('<style type="text/css">@keyframes ldio-www0qkokjy{0%,25%{transform:translate(6px,0) scale(0)}50%{transform:translate(6px,0) scale(1)}75%{transform:translate(40px,0) scale(1)}100%{transform:translate(74px,0) scale(1)}}@keyframes ldio-www0qkokjy-r{0%{transform:translate(74px,0) scale(1) :}100%{transform:translate(74px,0) scale(0)}}@keyframes ldio-www0qkokjy-c{0%,100%{background:#0051a2}25%{background:#89bff8}50%{background:#408ee0}75%{background:#1b75be}}.ldio-www0qkokjy div{position:absolute;width:20px;height:20px;border-radius:50%;transform:translate(40px,0) scale(1);background:#0051a2;animation:2s cubic-bezier(0,.5,.5,1) infinite ldio-www0qkokjy;box-sizing:content-box}.ldio-www0qkokjy div:first-child{background:#1b75be;transform:translate(74px,0) scale(1);animation:.5s cubic-bezier(0,.5,.5,1) infinite ldio-www0qkokjy-r,2s step-start infinite ldio-www0qkokjy-c}.ldio-www0qkokjy div:nth-child(2){animation-delay:-.5s;background:#0051a2}.ldio-www0qkokjy div:nth-child(3){animation-delay:-1s;background:#1b75be}.ldio-www0qkokjy div:nth-child(4){animation-delay:-1.5s;background:#408ee0}.ldio-www0qkokjy div:nth-child(5){animation-delay:-2s;background:#89bff8}.loadingio-spinner-ellipsis-xiqce8pxsmm{width:44px;height:10px;display:inline-block;overflow:hidden;background:0 0}.ldio-www0qkokjy{width:100%;height:100%;position:relative;transform:translateZ(0) scale(.44);backface-visibility:hidden;transform-origin:0 0}</style><div class="grid_label grid_date">HLTB</div><div class="grid_content"> <div class="loadingio-spinner-ellipsis-xiqce8pxsmm"><div class="ldio-www0qkokjy"><div></div><div></div><div></div><div></div><div></div></div></div> </div>');
$(".apphub_OtherSiteInfo").prepend('<style type="text/css">@keyframes ldio-www0qkokjy{0%,25%{transform:translate(6px,0) scale(0)}50%{transform:translate(6px,0) scale(1)}75%{transform:translate(40px,0) scale(1)}100%{transform:translate(74px,0) scale(1)}}@keyframes ldio-www0qkokjy-r{0%{transform:translate(74px,0) scale(1) :}100%{transform:translate(74px,0) scale(0)}}@keyframes ldio-www0qkokjy-c{0%,100%{background:#0051a2}25%{background:#89bff8}50%{background:#408ee0}75%{background:#1b75be}}.ldio-www0qkokjy div{position:absolute;width:20px;height:20px;border-radius:50%;transform:translate(40px,0) scale(1);background:#0051a2;animation:2s cubic-bezier(0,.5,.5,1) infinite ldio-www0qkokjy;box-sizing:content-box}.ldio-www0qkokjy div:first-child{background:#1b75be;transform:translate(74px,0) scale(1);animation:.5s cubic-bezier(0,.5,.5,1) infinite ldio-www0qkokjy-r,2s step-start infinite ldio-www0qkokjy-c}.ldio-www0qkokjy div:nth-child(2){animation-delay:-.5s;background:#0051a2}.ldio-www0qkokjy div:nth-child(3){animation-delay:-1s;background:#1b75be}.ldio-www0qkokjy div:nth-child(4){animation-delay:-1.5s;background:#408ee0}.ldio-www0qkokjy div:nth-child(5){animation-delay:-2s;background:#89bff8}.loadingio-spinner-ellipsis-xiqce8pxsmm{width:44px;height:10px;display:inline-block;overflow:hidden;background:0 0}.ldio-www0qkokjy{width:100%;height:100%;position:relative;transform:translateZ(0) scale(.44);backface-visibility:hidden;transform-origin:0 0}</style> <div id="loader" style="float:left;padding-right:5px;padding-top:10px;"> <div class="loadingio-spinner-ellipsis-xiqce8pxsmm"><div class="ldio-www0qkokjy"><div></div><div></div><div></div><div></div><div></div></div></div> </div>');

// Grab Steam game name (and normalize weird letters, get rid of symbols, lowercase everything, and split up words)
let appNameString = document.getElementsByClassName("apphub_AppName")[0].textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace("’","'").replace(/[^a-z _0-9`~!@#$%^&*()_=+|\\\]}[{;:',<.>/?]/gi,'')
let appName = appNameString.toLowerCase().split(/\s+/).map(word => `"${word}"`).join(",");

// API url
let hltbUrl = 'https://howlongtobeat.com/api/search';

// Set POST data with correct query parameters and game name
let hltbQuery = '{"searchType":"games","searchTerms":['+appName+'],"searchPage":1,"size":20,"searchOptions":{"games":{"userId":0,"platform":"","sortCategory":"popular","rangeCategory":"main","rangeTime":{"min":null,"max":null},"gameplay":{"perspective":"","flow":"","genre":"","difficulty":""},"rangeYear":{"min":"","max":""},"modifier":""},"users":{"sortCategory":"postcount"},"lists":{"sortCategory":"follows"},"filter":"","sort":0,"randomizer":0},"useCache":true}';

// Fetch HLTB Token
let hltbToken = null;
try {
    const response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://howlongtobeat.com/api/search/init?t=",
            headers: {
                "Accept": "*/*",
                "User-Agent": navigator.userAgent,
                "Referer": "https://howlongtobeat.com/?q="
            },
            onload: function(res) {
                resolve(res);
            },
            onerror: function(err) {
                reject(err);
            }
        });
    });

    if (response.status === 200) {
        try {
            const data = JSON.parse(response.responseText);
            if (data && data.token) {
                hltbToken = data.token;
                console.log("%c[HLTB-Token]:%c " + hltbToken, 'color:#ff8c00; font-weight:bold;', '');
            } else {
                console.warn("%c[HLTB-Token]:%c No token found in response.", 'color:#ff8c00; font-weight:bold;', '');
            }
        } catch (e) {
            console.error("%c[HLTB-Token]:%c Failed to parse response.", 'color:#ff8c00; font-weight:bold;', e);
        }
    } else {
        console.warn("%c[HLTB-Token]:%c Request returned status " + response.status, 'color:#ff8c00; font-weight:bold;', '');
    }

} catch (error) {
    console.log('%c[HLTB-Key]:%c Request failed. Proceeding without token. This might fail. Error:', 'color:#ff8c00; font-weight:bold;', '', error.message);
}

// Perform HLTB search request
GM_xmlhttpRequest({
    method: "POST",
    url: hltbUrl,
    data: hltbQuery,
    headers: {
        "User-Agent": navigator.userAgent,
        "Content-Type": "application/json",
        "Origin": "https://howlongtobeat.com",
        "Referer": "https://howlongtobeat.com/",
        "x-auth-token": hltbToken
    },
    onload: function (response) {

        // Grab response
        //console.log(response.responseText);

        // Check if the response contains a 404 error in the title and update output
        if (response.responseText.includes("<title>HowLongToBeat - 404</title>")) {
            console.log( '%c[HLTB-Response]:%c 404 Not Found', 'color:#ff8c00; font-weight:bold;', '');
            $('#loader').remove();
            $(".apphub_OtherSiteInfo").prepend(' <div class="apphub_OtherSiteInfo" style="float:left;padding-right:5px;"><a class="btnv6_blue_hoverfade btn_medium" href="https://howlongtobeat.com/?q='+appNameString+'" target="_blank" style="background-color:#222222"><span style="color:white;">404</span></a></div>');
            return;
        }

        let hltb = JSON.parse(response.responseText);

        //Determine if data is present in response by checking the page count.  If no data, set to default HLTB button.
        let hltbPages = hltb['count'];

        if(hltbPages == 0) {
            hltbTime = "HLTB";
            bgcolor = "ff8c00";
            console.log( '%c[HLTB-Response]:%c <empty>', 'color:#ff8c00; font-weight:bold;', '');
        } else {

        //If data is present in response, let's rock!
        let hltbstring = JSON.stringify(hltb);
        //Show response in console for debugging purposes (or comment to hide)
        //console.log( '%c[HLTB-Response]:%c ' + hltbstring, 'color:#ff8c00; font-weight:bold;', '');

        //Make sure you have the right game_name (if possible, otherwise just use first result from response)
        let n = 0;
        let loop = hltb['count'];
        for (let i = 0; i < loop; i++) {
            let hltbName = hltb['data'][i]['game_name'];
            if (hltbName.toLowerCase() == appNameString.toLowerCase()) {
                n = i;
                break;
            }
        }
        console.log( '%c[HLTB-GameName]:%c ' + hltb["data"][n]["game_name"], 'color:#ff8c00; font-weight:bold;', '');

        // Extract time for "Main Story" and convert into hours
        hltbTime = hltb['data'][n]['comp_main'];
        hltbTime = hltbTime/60/60;                            // Convert to hours
        hltbTime = Math.round(hltbTime*2)/2;                  // Round to closes .5
        hltbTime = hltbTime.toString() .replace(".5","½");    // Convert .5 to ½ to be consistent with HLTB
        console.log( '%c[HLTB-MainTime]:%c ' + hltbTime, 'color:#ff8c00; font-weight:bold;', '');

        // Extract the Confidence level
        hltbConfidence = hltb['data'][n]['comp_main_count'];
        console.log( '%c[HLTB-Confidence]:%c ' + hltbConfidence, 'color:#ff8c00; font-weight:bold;', '');

        // If game exists but no time was returned ("--"), set button accordingly
        if (!hltbTime) {
            hltbTime = "HLTB";
            bgcolor = "ff8c00";
        } else if (hltbTime == 0) {
            hltbTime = "--";
            bgcolor = "222222";
        } else {
            // Append "Hour(s)" to the end of the time
            if (hltbTime == 1 ) { hltbTime = hltbTime + " Hour"; } else { hltbTime = hltbTime + " Hours"; }

            // Determine what color to make button (based on HLTB confidence level).  These might not reflect how HLTB calculates their confidence, this is just a guess.
            if (hltbConfidence < 5 ) {
                bgcolor = "FF3A3A";
            } else if (hltbConfidence < 10) {
                bgcolor = "cc3b51";
            } else if (hltbConfidence < 15) {
                bgcolor = "824985";
            } else if (hltbConfidence < 20) {
                bgcolor = "5650a1";
            } else if (hltbConfidence < 25) {
                bgcolor = "485cab";
            } else if (hltbConfidence < 30) {
                bgcolor = "3a6db5";
            } else if (hltbConfidence >= 30) {
                bgcolor = "287FC2";
            } else {
                bgcolor = ""
            }
        }
        }
        //Display HLTB button next to "Community Hub" button and remove loader
        $('#loader').remove();
        $(".apphub_OtherSiteInfo").prepend(' <div class="apphub_OtherSiteInfo" style="float:left;padding-right:5px;"><a class="btnv6_blue_hoverfade btn_medium" href="https://howlongtobeat.com/?q='+appNameString+'" target="_blank" style="background-color:#'+bgcolor+';"><span style="color:white;">'+hltbTime+'</span></a></div>');
        //Or if on mobile (<500), display under the "Release Date"
        if ($(window).width() < 500 ) {
            $("div:contains('HLTB')").next("div.grid_content").html('<a class="btnv6_blue_hoverfade btn_small" href="https://howlongtobeat.com/?q=' + appNameString + '" target="_blank" style="background-color:#' + bgcolor + ';"><span style="color:white;">' + hltbTime + '</span></a>');
        }

    },
    onerror: function (error) {
        // General network or request errors
        console.log( '%c[HLTB-Error]:%c Network Error.', 'color:#ff8c00; font-weight:bold;', '');
        $('#loader').remove();
        $(".apphub_OtherSiteInfo").prepend(' <div class="apphub_OtherSiteInfo" style="float:left;padding-right:5px;"><a class="btnv6_blue_hoverfade btn_medium" href="https://howlongtobeat.com/?q='+appNameString+'" target="_blank" style="background-color:#222222"><span style="color:white;">Error</span></a></div>');
    },
    ontimeout: function () {
        // Handle request timeout
        console.log( '%c[HLTB-Error]:%c Request timed out.', 'color:#ff8c00; font-weight:bold;', '');
        $('#loader').remove();
        $(".apphub_OtherSiteInfo").prepend(' <div class="apphub_OtherSiteInfo" style="float:left;padding-right:5px;"><a class="btnv6_blue_hoverfade btn_medium" href="https://howlongtobeat.com/?q='+appNameString+'" target="_blank" style="background-color:#222222"><span style="color:white;">Error</span></a></div>');
    },
    timeout: 10000 // Timeout after 10 seconds
});
})();