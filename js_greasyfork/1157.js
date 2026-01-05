// ==UserScript==
// @name           Better ATND
// @namespace      http://efcl.info/
// @description    ATNDをより便利にする
// @include        http://atnd.org/events/*
// @include        https://atnd.org/events/*
// @version 0.2.0.20140518104253
// @grant GM_log
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/1157/Better%20ATND.user.js
// @updateURL https://update.greasyfork.org/scripts/1157/Better%20ATND.meta.js
// ==/UserScript==
/* TEST PAGE
 http://atnd.org/events/13389
 http://atnd.org/events/10996
 */
var DEBUG = false;
function log(m) {
    console.log(arguments);
}
var atndGM = {};
atndGM.eventID = window.location.pathname.split("/").pop();
(function () {
    // ATND APIからイベント情報取得
    function getEventJSON(eventID, callback) {
        if (typeof atndGM[atndGM.eventID] !== 'undefined') {
            callback(atndGM[atndGM.eventID]);
        } else {
            var endpoint = "http://api.atnd.org/events/?event_id=" + eventID + "&format=json";
            GM_xmlhttpRequest({
                method: "GET",
                url: endpoint,
                onload: function (res) {
                    var json = JSON.parse(res.responseText);
                    DEBUG && log(res.statusText, json);
                    atndGM[atndGM.eventID] = json;// キャッシュしておく
                    callback(json);
                },
                onerror: function (res) {
                    GM_log(res.statusText + " : " + res.responseText);
                }
            });
        }
    }

    // 緯度経度情報の取得
    function getGeoinfo(json) {
        var event = json.events[0].event;
        var lon = event.lon,
            lat = event.lat;
        DEBUG && log('lon' + lon, 'lat' + lat);
        if ((lon && lat)
            && (parseFloat(lon) != 0.0 && parseFloat(lat) != 0.0)) {
            // 緯度経度情報が取得できた場合は最寄り駅を取得する
            return {
                'lon': lon,
                'lat': lat
            };
        }
    }

    // 緯度経度から最寄り駅情報を取得
    function getNearsideStation(geo, callback) {
        var endpoint = "http://map.simpleapi.net/stationapi?x=" + String(geo.lon) + "&y=" + String(geo.lat) + "&output=json";
        var count = 0;
        GM_xmlhttpRequest({
            method: "GET",
            url: endpoint,
            onload: function (res) {
                var json = JSON.parse(res.responseText),
                    resultHTML = document.createDocumentFragment();
                var dl = document.createElement('dl');
                dl.setAttribute('class', "clearfix station-info");
                DEBUG && log("near Stations JSON", json);
                for (var i = 0, len = json.length; i < len; i++) {
                    var name = json[i].name;
                    var line = json[i].line;
                    var distance = json[i].distanceKm || json[i].distanceM;
                    var traveltime = json[i].traveltime;
                    var stationInfo = line + "/" + name + "/" + distance + "/" + traveltime;

                    var dt = document.createElement('dt');
                    dt.innerHTML = "最寄り駅 / ST:";
                    var dd = document.createElement('dd');
                    dd.appendChild(document.createTextNode(stationInfo));
                    dl.appendChild(dt);
                    dl.appendChild(dd);
                }
                resultHTML.appendChild(dl);
                DEBUG && log("resultHTML", resultHTML);
                callback(resultHTML);
            },
            onerror: function (res) {
                GM_log(res.statusText + " : " + res.responseText);
            }
        });

    }

    function getStationHTML(callback) {
        getEventJSON(atndGM.eventID, function (res) {
            atndGM.st.geo = getGeoinfo(res);
            if (atndGM.st.geo) {
                getNearsideStation(atndGM.st.geo, function (resHTML) {
                    DEBUG && log("getStationHTML", resHTML);
                    callback(resHTML);
                });
            } else {
                DEBUG && log("getStationHTML : GEO INFO doesn't exist");
                callback();
            }
        });
    }


    atndGM.st = {
        'getEventJSON': getEventJSON,
        'getNearsideStation': getNearsideStation,
        'getStationHTML': getStationHTML
    };
})();
(function gCal() {
    function formatToUTCDate(jstDateTime) {
        if (!jstDateTime) {
            return;
        }
        var dateTime = jstDateTime.replace(/[-,:]/g, "").replace(/.....$/, "");
        var jstDate = Number(dateTime.slice(0, 8));
        var jstTime = Number(dateTime.slice(9, 15));
        var utcDate;
        if (jstTime < 90000) {
            utcDate = jstDate - 1;
        } else {
            utcDate = jstDate;
        }
        var utcTime = String((jstTime + 240000 - 90000) % 240000);
        utcTime = utcTime.length == 6 ? utcTime : '0' + utcTime;
        return utcDate + 'T' + utcTime + 'Z';
    }

    function createCalendarLink(json) {
        json = json || atndGM[atndGM.eventID] || atndGM.st.getEventJSON(createCalendarLink);
        var event = json.events[0].event;// イベントの情報が入ってる
        var descrition = location.href + '\n_' + document.getElementById("post-body").textContent.trim();// API経由だと記法が入ってしまう
        if ("catch" in event) {
            descrition = event["catch"] + "\n" + descrition;// キャッチを追加する
        }
        var description = encodeURIComponent((descrition.length < 300) ? // 文字数が多いとRequest-URI Too Largeになる
                                             descrition : descrition.substring(0, 100) + '...');
        var title = encodeURIComponent(event.title),
            started_at = formatToUTCDate(event.started_at || ""),
            ended_at = formatToUTCDate(event.ended_at || ""),
            address = encodeURIComponent(event.address || "");

        var dates = "&dates=" + started_at + "/"
        if (ended_at) {
            dates += ended_at;
        } else {
            dates += started_at;// ないなら開始時間と同じ
        }
        // カレンダーリンクを生成
        var link = document.createElement('a');
        link.innerHTML = "<img src='http://www.google.com/calendar/images/ext/gc_button1_ja.gif' border=0></a>";
        link.setAttribute('href',
                'https://www.google.com/calendar/event?action=TEMPLATE&text=' + title
                + dates
                + "&details=" + description + "&location=" + address + "&trp=false&sprop=website:atnd.org&sprop;=name:ATND");
        return link;
    }

    atndGM.gCal = {
        'createCalendarLink': createCalendarLink
    }
})();
(function main() {
    var insertArea = document.querySelector('#events-show > div.main');
    var stationArea = insertArea.querySelector('div.events-show-info');
    var mapArea = insertArea.querySelector('div.events-show-map');
    atndGM.st.getStationHTML(function (stationHTML) {
        if (typeof stationHTML !== 'undefined') {
            stationArea.appendChild(stationHTML);
            var stationMapImg = document.createElement("img");
            stationMapImg.src = "http://map.simpleapi.net/stationmap?x=" + atndGM.st.geo.lon + "&y=" + atndGM.st.geo.lat;
            mapArea.appendChild(stationMapImg);
        }
        // Google Calendar
        var title_ul = document.querySelector('div.title-btn > ul');
        var link = atndGM.gCal.createCalendarLink();
        var li = document.createElement("li");
        li.appendChild(link);
        title_ul.appendChild(li);
    });

})();

