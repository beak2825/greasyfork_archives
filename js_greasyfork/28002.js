// ==UserScript==
// @name            Open WME in GM
// @description     Opens the current Waze Map Editor view in Google Map
// @namespace       vaindil
// @version         0.9.001
// @grant           none
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://beta.waze.com/editor/*
// @include         https://beta.waze.com/*/editor/*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @author          vaindil
// @downloadURL https://update.greasyfork.org/scripts/28002/Open%20WME%20in%20GM.user.js
// @updateURL https://update.greasyfork.org/scripts/28002/Open%20WME%20in%20GM.meta.js
// ==/UserScript==

console.log("WMEGM BEGINNING");

var icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAABfVBMVEXzplQ3uP/+wxN1zP7/3mOD0f3/66dhxv9bxP//yhBVwv//8MZuqcr/0Bb/7bNBu/9Jvf//3Vr/1THcQzFsyf+nIxb/21P/2UX/2kv8uib/5IL/43r/1Cv/yQf/4XPUMST/1jn+xgz/5or/0iHirQeTsJL/ygT/4Gr9vxtquOR7qq6hzLf9zzlhpMgstP+xtG3ipxXZeBP91EXekgvGNSX9x0XXWhP/ywLjsiTzvQjGulDhw4nXwkn9zCr31LbsuATitj++Kx7qwixoEgf80kpPoMpisNz0wAPynyv/zgz+02V/x+zKKgzZwDqzxoPWNSfwxh3/2D9xw/L5wwdbuu99z/5nx//PNRJOtvD/77xnw/jRRRLaQSffnhH2yRLjrzVPv/9kwPXI7P//55G+Wwv4sQ5HtfHSy1fXPSJ/vtH7yAP+2VrgpCn/89L/zAD/6ZvsqqPNIhnDCQbKGhPQKB3HEg3SLSH0zczcf2XXWVLNNTPSPjLZPS329PHXOSkSiDWQAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfgAgMSKDtBEX08AAABSElEQVQY02XPS0/CQBQF4MGWR6qt0helb9pa2GgMMekCFxhJSNlgFyWyMcQuyUyBPnRB+O3eNkYTnOWXc8+di9D5y4rdP0P7rDh8nmNe6eEMyx+9XK9TR8NyD+tsuKx1ekAcxyWqWSnGJ6vcZ9kEClop52hDLEcY7yQLopNiglCStDSTxorNu0dLyvde8dBHSNVSk+7iyNaFk5U/A45A0zRJHBWbpnBclsfpdrtYLBCiu46s9DBfoeD5r7ejPmQVRe1FNpaq5DwQV23m7RqhKNJsXv86SaUwD57EVYfZgPK8qbvu0iofvcA3xHaHuQF13aHLsi+5R4hvDKBgUynL0myIg/crEhiDizraQCgMuypWSRxD8g5wUyucjwmhKOoPQQmRg8D3RRE+VeN14x56fdk3qjXtXwQ1xup4PJvNms1mHFMUjDAf6BuAzE6GEzFfZgAAAABJRU5ErkJggg==';

function gen_url() {
    var projI=new OpenLayers.Projection("EPSG:900913");
    var projE=new OpenLayers.Projection("EPSG:4326");
    var center_lonlat=(new OpenLayers.LonLat(Waze.map.center.lon,Waze.map.center.lat)).transform(projI, projE);
    var topleft=(new OpenLayers.LonLat(Waze.map.getExtent().left,Waze.map.getExtent().top)).transform(projI, projE);
    var bottomright=(new OpenLayers.LonLat(Waze.map.getExtent().right,Waze.map.getExtent().bottom)).transform(projI, projE);
    lat=Math.round(center_lonlat.lat * 1000000)/1000000;
    lon=Math.round(center_lonlat.lon * 1000000)/1000000;
    spn=Math.abs(topleft.lat-bottomright.lat)+','+Math.abs(topleft.lon-bottomright.lon);
    return 'https://www.google.com/maps?ll='+lat+','+lon+'&spn='+spn+'&lyt=large_map_v3';
}

function init() {
    try {
        var element = $('.WazeControlPermalink');
        if ($(element).length) {
            $('.WazeControlPermalink').prepend('<img src="' + icon + '" id="WMEtoGM" alt="GMM" style="margin:0 5px 5px 0;cursor:pointer" />');
            $('#WMEtoGM').click(function() {
                window.open(gen_url(), '_blank');
            });
            console.log("WMEGM done");
        } else {
            setTimeout(init, 1000);
        }
    } catch (err) {
        console.log("WMEGM - " + err);
        setTimeout(init, 1000);
    }    
}

init();