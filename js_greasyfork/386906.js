// ==UserScript==
// @name         WME to reporting tool
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Open Reporting tool for champs
// @author       Crotalo
// @match		 https://www.waze.com/editor*
// @match		 https://www.waze.com/*/editor*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/386906/WME%20to%20reporting%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/386906/WME%20to%20reporting%20tool.meta.js
// ==/UserScript==

console.log("WMEtoRT Start !");

var icon = 'data:image/png;base64,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';

function gen_url() {
    var projI=new OpenLayers.Projection("EPSG:900913");
    var projE=new OpenLayers.Projection("EPSG:4326");
    var center_lonlat=(new OpenLayers.LonLat(Waze.map.olMap.center.lon,Waze.map.olMap.center.lat)).transform(projI, projE);
    var lat=Math.round(center_lonlat.lat * 1000000)/1000000;
    var lon=Math.round(center_lonlat.lon * 1000000)/1000000;
    return 'https://www.waze.com/reporting?env=row&lon='+lon +'&lat='+lat +'&lon='+ '&zoom='+ 17;
    }


function init() {
    try {
        var element = $('.WazeControlPermalink');
        if ($(element).length) {
            var section = $("<div>", {style:"padding:8px 16px"});
            section.html([
                '<span id="LORT">',
                `<img src="${icon}" alt="waze" width="18" height="18" id="WMEtoRT" title="Open reporting tool" style="cursor:pointer; float: left; display:inline-block; margin: 2px 5px 0 3px;">`,
                '</span>',
            ].join(' '));

            $('.view-area.olMap >div > div > div.WazeControlPermalink>div').append(section.html());

            $('#WMEtoRT').click(function(){
                window.open(gen_url(), '_blank');
            });

            console.log("WMEtoRT done");
        } else {
            setTimeout(init, 1000);
        }
    } catch (err) {
        console.log("WMEtoRT - " + err);
        setTimeout(init, 1000);
    }
}

init();