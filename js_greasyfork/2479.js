// ==UserScript==
// @name           DeepWiki
// @namespace      psly4mne.kolwiki
// @description    Adds an inline display of actual effects to acquired effects in potion and item descriptions on KoL wiki pages.
// @include        http://kol.coldfront.net/thekolwiki*
// @grant          GM_log
// @grant          GM_xmlhttpRequest
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/2479/DeepWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/2479/DeepWiki.meta.js
// ==/UserScript==

// Version 1.0
//  - forked from http://userscripts.org/scripts/source/54462.user.js
//  - fixed regex, as wiki switched to <span> for effects

function findEffect(acq) {
    var ps = document.evaluate('//td[text()="You '+acq+' an effect: "]',document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    for (var i=ps.snapshotLength-1;i>=0;i--) {
        var p = ps.snapshotItem(i);
        var pps = document.evaluate('b/a[@title]',p,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
        for (var j=pps.snapshotLength-1;j>=0;j--) {
            var pp = pps.snapshotItem(j);
            var u = 'http://kol.coldfront.net'+pp.getAttribute('href');
            GM_log('found effect: '+(pp.innerHTML));
            getUrl(u,p.parentNode);
        }
    }
}

function getUrl(u,p) {
    GM_xmlhttpRequest({
            method: "GET",
                url: u,
                headers: {
                "User-Agent": "Mozilla/5.0",
                    "Accept": "text/xml"
                    },
                onload: function(response) {
                var m = response.responseText.replace(/\n/g,' ').match(/<span[\s]*style=\"[^\"\>]*color:blue;[\s]*font-weight:bold;\"\>.*/);
                if (m) {
                    var eff1 = m[0];
                    if (eff1) {
                        //GM_log('Effect1 is '+eff1);
                        var eff2 = eff1.match(/<\/span>.*/)[0];
                        if (eff2) {
                            eff1 = eff1.substr(0,eff1.length-eff2.length);
                            eff1 = eff1.match(/>.*/)[0].substr(1);
                            //GM_log("Effect is "+eff1);

                            var f = document.createElement('font');
                            f.setAttribute('size','1');
                            f.innerHTML='<p style="text-align:center;color:blue;font-weight:bold;line-height:12px;">'+eff1+'</p>'; 
                            //GM_log('creating font with innerHTML: '+f.innerHTML);
                            var tr = document.createElement('tr');
                            //var tr = tb.insertRow(-1);
                            var td = tr.insertCell(-1);
                            td.setAttribute('colspan','2');
                            td.appendChild(f);
                            if (p.nextSibling)
                                p.parentNode.insertBefore(tr,p.nextSibling);
                            else
                                p.parentNode.appendChild(tr);
                            
                            return eff1;
                        }
                    }
                }
            }
        });
}

findEffect('acquire');
findEffect('lose');
