// ==UserScript==
// @name        BTN + Trakt.tv Calendar
// @description Searches for torrents on BTN from the calendar on Trakt.tv
// @namespace   BlackNullerNS
// @include     http*://trakt.tv/*
// @version     1.0.3
// @grant    GM_xmlhttpRequest
// @grant    GM_setValue
// @grant    GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/13240/BTN%20%2B%20Trakttv%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/13240/BTN%20%2B%20Trakttv%20Calendar.meta.js
// ==/UserScript==

var link, icon;

var style = document.createElement("style");
style.textContent = "#btn-results { color: #333; position:fixed; width:660px;top:100px;left:50%;margin-left:-330px;padding:30px;display:inline-block;border:1px solid #666;border-radius:6px;-moz-box-shadow: 0px 0px 7px #2e2e2e;-webkit-box-shadow: 0px 0px 7px #2e2e2e;box-shadow: 0px 0px 7px #2e2e2e;background:#fff;z-index:200;transition:all 0.5s;transition-delay:0s; } "
    + "#btn-results a { color: blue; font-size: 13px; } "
    + "#btn-results a:hover { color: red; } ";
document.head.appendChild(style);

var btnKey = GM_getValue("BTN_KEY", false);

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

var getApiKey = function(el){
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
                onClickHandler(el);
            } else {
                alert("Unable to retrieve BTN API key!");
            }
        }
    });
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

var onClickHandler = function(el){
    el = el.closest("div");

    if (!btnKey) {
        getApiKey(el);
        return;
    }

    var show = el.firstElementChild.nextElementSibling.textContent.trim();
    var ep = el.firstElementChild.firstElementChild.textContent.trim();

    if (/^\d{1,4}x\d{2}$/.test(ep)) {
        ep = "S" + (ep.split("x")[0].length === 1 ? "0" : "") + ep.replace("x", "E");
    }

    var data = {
        method: "getTorrents",
        params: [
            btnKey, {
                Series: show + "%",
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
        url: "http://api.btnapps.net/",
        headers: {
            'Content-Type': 'application/json'
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
                alert("Unexpected response from BTN");
                return;
            }

            if (!data.result || data.result.results == 0) {

                var season = ep.split("E")[0].slice(1);
                if (season[0] === "0") season = season[1];

                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://api.btnapps.net/",
                    headers: {
                        'Content-Type': 'application/json'
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
                            alert("Not found on BTN!");
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

/* gator v1.2.4 craig.is/riding/gators */
(function(){function t(a){return k?k:a.matches?k=a.matches:a.webkitMatchesSelector?k=a.webkitMatchesSelector:a.mozMatchesSelector?k=a.mozMatchesSelector:a.msMatchesSelector?k=a.msMatchesSelector:a.oMatchesSelector?k=a.oMatchesSelector:k=e.matchesSelector}function q(a,b,c){if("_root"==b)return c;if(a!==c){if(t(a).call(a,b))return a;if(a.parentNode)return m++,q(a.parentNode,b,c)}}function u(a,b,c,e){d[a.id]||(d[a.id]={});d[a.id][b]||(d[a.id][b]={});d[a.id][b][c]||(d[a.id][b][c]=[]);d[a.id][b][c].push(e)}
function v(a,b,c,e){if(d[a.id])if(!b)for(var f in d[a.id])d[a.id].hasOwnProperty(f)&&(d[a.id][f]={});else if(!e&&!c)d[a.id][b]={};else if(!e)delete d[a.id][b][c];else if(d[a.id][b][c])for(f=0;f<d[a.id][b][c].length;f++)if(d[a.id][b][c][f]===e){d[a.id][b][c].splice(f,1);break}}function w(a,b,c){if(d[a][c]){var k=b.target||b.srcElement,f,g,h={},n=g=0;m=0;for(f in d[a][c])d[a][c].hasOwnProperty(f)&&(g=q(k,f,l[a].element))&&e.matchesEvent(c,l[a].element,g,"_root"==f,b)&&(m++,d[a][c][f].match=g,h[m]=d[a][c][f]);
b.stopPropagation=function(){b.cancelBubble=!0};for(g=0;g<=m;g++)if(h[g])for(n=0;n<h[g].length;n++){if(!1===h[g][n].call(h[g].match,b)){e.cancel(b);return}if(b.cancelBubble)return}}}function r(a,b,c,k){function f(a){return function(b){w(g,b,a)}}if(this.element){a instanceof Array||(a=[a]);c||"function"!=typeof b||(c=b,b="_root");var g=this.id,h;for(h=0;h<a.length;h++)k?v(this,a[h],b,c):(d[g]&&d[g][a[h]]||e.addEvent(this,a[h],f(a[h])),u(this,a[h],b,c));return this}}function e(a,b){if(!(this instanceof
e)){for(var c in l)if(l[c].element===a)return l[c];p++;l[p]=new e(a,p);return l[p]}this.element=a;this.id=b}var k,m=0,p=0,d={},l={};e.prototype.on=function(a,b,c){return r.call(this,a,b,c)};e.prototype.off=function(a,b,c){return r.call(this,a,b,c,!0)};e.matchesSelector=function(){};e.cancel=function(a){a.preventDefault();a.stopPropagation()};e.addEvent=function(a,b,c){a.element.addEventListener(b,c,"blur"==b||"focus"==b)};e.matchesEvent=function(){return!0};"undefined"!==typeof module&&module.exports&&
(module.exports=e);window.Gator=e})();

Gator(document).on('click', '.titles', function(e) {
    e.preventDefault();
    e.stopPropagation();
    onClickHandler(e.target);
});