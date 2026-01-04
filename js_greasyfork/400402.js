// ==UserScript==
// @name         EHMassTorrent
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Mass mirror EH torrents
// @author       ez
// @match        https://e-hentai.org/?*f_search=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400402/EHMassTorrent.user.js
// @updateURL https://update.greasyfork.org/scripts/400402/EHMassTorrent.meta.js
// ==/UserScript==

(function() {
    var slack = 0.9;
    var seedtrump = 1.5;
    var minseeds = 2;
    var maxseeds = 15;
    function gid(n) {
        return document.getElementById(n);
    }
    function gcls(n) {
        return document.getElementsByClassName(n);
    }
    function fget(n, def) {
        var v = gid(n).value || sessionStorage.getItem(n) || def;
        if (def !== undefined) {
            gid(n).value = v;
        }
        sessionStorage.setItem(n, v);
        return v;
    }
    function fset(n, v) {
        if (v === undefined) {
            v = fget(n);
        }
        gid(n).value = v;
        sessionStorage.setItem(n,v);
    }
    document.getElementById('dms').insertAdjacentHTML('afterbegin',`
<table>
<tr>
<td>Next delay<td><input type=text id="nd" style="width: 30px;"></input>
<td>Num pages<td><input type=text id="np" style="width: 30px;"></input>
<td>Pos<td><input type=text id="pos" style="width: 30px;"></input>/<td id=pcnt></td>
<td><button id="mstart">Start</button>
<td id=stat>
</table>`);
    fget('nd', 8000);
    fget('np', 0);
    fget('pos', 0);
    var isRunning = false;
    var startPos = 0;
    gid('mstart').addEventListener('click', function() {
        if (!isRunning) {
            startRunning();
        } else {
            stopRunning();
        }
    });
    var children = gcls('gldown');
    gid('pcnt').innerText = children.length;
    var stat = gid('stat');
    var pos;
    var prev;
    function startRunning() {
        sessionStorage.setItem('forceStart', 0);
        pos = fget('pos', 0);
        function progress() {
            if (prev) {
                prev.style.backgroundColor = '';
            }
            if (!isRunning) {
                return;
            }
            var dl = children[pos];
            var np = fget('np')|0;
            // we're out. browse to next page, or stop if numpages goes to 0
            if (np <= 0 || dl === undefined) {
                var newLoc = document.getElementsByClassName('ptt')[0].firstChild.firstChild.lastChild.firstChild.href;
                if (np <= 1 || !newLoc) {
                    fset('np', 0);
                    fset('pos', 0);
                    stat.innerText = "No more pages requested, halted.";
                    stopRunning();
                    return;
                }
                stat.innerText = "About to jump to next next page...";
                setTimeout(function() {
                    fset('np', np-1);
                    fset('pos', 0);
                    sessionStorage.setItem('forceStart', 1);
                    document.location = newLoc;
                }, Math.random() * (fget('nd')|0) + (fget('nd')|0));
                return;
            }
            var parent = dl.parentNode.parentNode;
            prev = parent;
            parent.style.backgroundColor = '#886';
            var url = dl.firstChild.href;
            if (!url || localStorage.getItem(url)=="1") {
                console.log(url + " is already known or has no torrents; skipping");
                pos++;
                fset('pos',pos);
                setTimeout(progress, 0);
                return;
            }

            var iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.style.visibility = "hidden";
            iframe.style.width = 0;
            iframe.style.height = 0;
            iframe.style.border = "0 none";
            iframe.style.position = "absolute";
            iframe.onload = function() {
                stat.innerText = "Loaded iframe, fetching torrent";
                var forms = iframe.contentDocument.getElementsByTagName('form');
                var tuples = [];
                var best = -1;
                var bestseeds = 0;
                var i;
                for (i = 0; i < forms.length-1; i++) {
                    var td = forms[i].getElementsByTagName('td');
                    var dfunc = td[8].getElementsByTagName('a')[0].href;
                    var seeds = td[3].innerText.split(':')[1].substr(1)|0;
                    var size = eval(td[1].innerText.split(':')[1].replace('GB', '*1024*1024*1024').replace('MB', '*1024*1024').replace('KB','*1024').replace('B',''));
                    tuples.push([dfunc,seeds,size]);
                    // found larger torrent with some seeds
                    if (seeds >= minseeds && (best == -1 || size > tuples[best][2])) {
                        best = i;
                    }
                    if (tuples[bestseeds][1] < seeds) {
                        bestseeds = i;
                    }
                }
                // hm, the torrent is seed starved, so assign whatever we can have
                if (best == -1) {
                    best = bestseeds;
                }
                var best2 = best;
                if (best != -1) {
                    var bestt = tuples[best];
                    // do this only if we're short on seeds
                    if (bestt[1] < maxseeds) {
                        // now scan tuples again. if they're smaller by 'slack' (90%), but have more seeds 'seedtrump' (150%) of best torrent, choose that one instead
                        for (i = 0; i < tuples.length; i++) {
                            if (tuples[i][2] > bestt[2] * slack && tuples[i][1] > bestt[1] * seedtrump) {
                                // anything with most seeds fitting the base criteria above
                                if (tuples[i][1] > tuples[best2][1]) {
                                    console.log("TRUMP",best2,"=>",i);
                                    best2 = i;
                                }
                            }
                        }
                    }
                    // best2 is our final selection
                    localStorage.setItem(url, "1");
                    console.log("Downloading " + url + " torrent index " + best2);
                    var durl = tuples[best2][0];
                    document.location = durl;
                }
                document.body.removeChild(iframe);
                pos++;
                fset('pos',pos);
                setTimeout(progress, Math.random() * (fget('nd')|0) * 2 + 300);
            }
            stat.innerText = "Loading iframe for " + url;
            document.body.appendChild(iframe);
        };
        isRunning = true;
        gid('mstart').innerText = "Stop";
        progress();
    }
    function stopRunning() {
        sessionStorage.getItem('forceStart', 0)
        isRunning = false;
        gid('mstart').innerText = "Start";
    }

    // Triggered by our forced 'next' click
    if (sessionStorage.getItem('forceStart')==1) {
        startRunning();
    }
})();

