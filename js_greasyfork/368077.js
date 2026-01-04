// ==UserScript==
// @name        TVMaze: add BTN search to calendar
// @description Add BTN search to calendar at TVMaze
// @namespace   BlackNullerNS
// @include     http*://www.tvmaze.com/calendar*
// @version     1.1
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/368077/TVMaze%3A%20add%20BTN%20search%20to%20calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/368077/TVMaze%3A%20add%20BTN%20search%20to%20calendar.meta.js
// ==/UserScript==

var episodes = document.querySelectorAll(".entry:not(.watched)");
var userAgent = "[UserScript] BTN + TVMaze Calendar";
var btnKey = GM_getValue("BTN_KEY", false);

var style = document.createElement("style");
style.textContent = "#btn-results { color: #333; position:fixed; width: 750px; max-width:90%; top:100px; left:50%; margin-left:-375px; padding:30px;display:inline-block;border:1px solid #666;border-radius:6px;-moz-box-shadow: 0px 0px 7px #2e2e2e;-webkit-box-shadow: 0px 0px 7px #2e2e2e;box-shadow: 0px 0px 7px #2e2e2e;background:#fff;z-index:200;transition:all 0.5s;transition-delay:0s; } "
    + "#btn-results a { color: blue; font-size: 13px; } "
    + "#btn-results a:hover { color: red; } ";

document.head.appendChild(style);

var getPopup = function(){
    var div = document.getElementById("btn-results");
    if (!div) {
        div = document.createElement("div");
        div.id = "btn-results";
        document.body.appendChild(div);
    }

    div.textContent = "";

    return div;
};

function humanizeSize(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

var showResults = function(show, ep, torrents)
{
    torrents = Object.keys(torrents).map(function (key) {return torrents[key]});
    console.log(torrents);

    var div = getPopup();
    div.appendChild(document.createTextNode(show + " " + ep));
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    torrents.sort(function(a, b){
        if(a.Resolution > b.Resolution) return -1;
        if(a.Resolution < b.Resolution) return 1;
        return 0;
    });

    var torrent, item;

    for (var i = 0, l = torrents.length; i < l; i++) {
        item = torrents[i];

        torrent = document.createElement("a");
        torrent.setAttribute("href", item.DownloadURL);
        //torrent.textContent = [item.Container, item.Codec, item.Source, item.Resolution, item.Origin].join(" / ");
        torrent.textContent = item.ReleaseName + (item.Category === "Episode" ? "." + item.Container.toLowerCase() : "");

        if (item.Origin === "Internal") {
            torrent.style.color = "#339900";
        } else if (item.Origin === "Scene") {
            torrent.style.color = "grey";
        }

        div.appendChild(torrent);
        div.appendChild(document.createTextNode(" [" + item.Origin + "]"));
        div.appendChild(document.createTextNode(" [" + humanizeSize(item.Size) + "]"));
        div.appendChild(document.createElement("br"));
    }

    var close = document.createElement("a");
    close.onclick = function(){ div.parentNode.removeChild(div); return false; };
    close.textContent = "[Close]";
    close.style.cursor = "pointer";
    close.style.float = "right";

    var btnsearch = document.createElement("a");
    btnsearch.setAttribute("href", "https://broadcasthe.net/torrents.php?action=basic&searchstr=" + encodeURIComponent(show + " " + ep));
    btnsearch.setAttribute("target", "_blank");
    btnsearch.style.float = "left";
    btnsearch.textContent = "[Go to BTN]";

    div.appendChild(document.createElement("br"));
    div.appendChild(close);
    div.appendChild(btnsearch);
};

var getApiKey = function(e){
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://broadcasthe.net/user.php?action=edit",
        onerror: function(){
            alert("BTN request failed!");
        },
        timeout: 15000,
        ontimeout: function(){
            alert("BTN request timed out!");
        },
        onload: function(response){
            var key = response.responseText.split('id="apikey" value="')[1].split('"')[0];
            if (key.length === 32) {
                btnKey = key;
                GM_setValue("BTN_KEY", btnKey);
                searchBTNHandler(e);
            } else {
                alert("Unable to retrieve BTN API key!");
            }
        }
    });
};

var searchBTNHandler = function(e){
    if (!btnKey) {
        getApiKey(e);
        return;
    }

    var show = e.target.parentNode.querySelector('a[href*="shows/"]').textContent.trim();
    var ep = e.target.parentNode.querySelector('a[href*="episodes/"]').textContent.trim();

    if (/^\d{1,2}x\d{2}$/.test(ep)) {
        ep = "S" + (ep.split("x")[0].length === 1 ? "0" : "") + ep.replace("x", "E");
    }

    var data = {
        method: "getTorrents",
        params: [
            btnKey, {
                Series: (show.replace(/[']+/g, "%") + "%").replace(/[%]+/g, '%'),
                Category: "Episode",
                Name: ep + "%"
            },
            50
        ],
        id: Date.now()
    };

    console.log(data);

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://api.broadcasthe.net/",
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': userAgent
        },
        data: JSON.stringify(data),
        onerror: function(){
            alert("BTN request failed!");
        },
        timeout: 15000,
        ontimeout: function(){
            alert("BTN request timed out!");
        },
        onload: function(response){
            try {
                var data = JSON.parse(response.responseText);
            } catch (e) {
                console.log(response.responseText);
                alert("Unexpected response from BTN");
                return;
            }

            if (!data.result || data.result.results == 0) {

                var season = ep.split("E")[0].slice(1);
                if (season[0] === "0") season = season[1];

                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://api.broadcasthe.net/",
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': userAgent
                    },
                    data: JSON.stringify({
                        method: "getTorrents",
                        params: [
                            btnKey, {
                                Series: show + "%",
                                Category: "Season",
                                Name: "Season " + season
                            },
                            50
                        ],
                        id: Date.now()
                    }),
                    onerror: function(){
                        alert("BTN request failed!");
                    },
                    timeout: 15000,
                    ontimeout: function(){
                        alert("BTN request timed out!");
                    },
                    onload: function(response){
                        try {
                            var data = JSON.parse(response.responseText);
                        } catch (e) {
                            alert("Unexpected response from BTN");
                            return;
                        }

                        if (!data.result || data.result.results == 0) {
                            var div = document.createElement('div');
                            div.style.width = '100%';
                            div.style.top = 0;
                            div.style.left = 0;
                            div.style.right = 0;
                            div.style.position = 'fixed';
                            div.style.backgroundColor = '#c00';
                            div.style.color = '#fff';
                            div.style.padding = '18px';
                            div.style.textAlign = 'center';
                            div.textContent = 'Not found on BTN!';

                            document.body.appendChild(div);

                            setTimeout(function() {
                                div.remove();
                            }, 800);

                            return;
                        }

                        showResults(show, ep, data.result.torrents);
                    }
                });

                return;
            }

            showResults(show, ep, data.result.torrents);
        }
    });
};

(function () {
    var btn = document.createElement('button');
    btn.innerHTML = '&#128269;';
    btn.style.border = 0;
    btn.style.padding = '2px 4px';
    btn.style.background = 'transparent';
    btn.style.color = '#3C948B';
    btn.style.cursor = 'pointer';
    btn.setAttribute('title', 'Find on BTN');

    var cloned;

    for (var i = 0, l = episodes.length; i < l; i++) {
        cloned = btn.cloneNode(true);
        cloned.addEventListener('click', searchBTNHandler);
        episodes.item(i).firstElementChild.appendChild(cloned);
    }
})();
