// ==UserScript==
// @name         ClanSmithGuild
// @namespace    https://greasyfork.org/ru/scripts/407688-clansmithguild
// @version      0.4
// @description  try to take over the world!
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/clan_info.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/407688/ClanSmithGuild.user.js
// @updateURL https://update.greasyfork.org/scripts/407688/ClanSmithGuild.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }

    let clan_id = window.location.href.match(/\d{1,5}/)[0]
    let clanHeroesInfo;
    let clanSmiths = {};
    getClanSmiths();


    function getClanSmiths() {
        var ret = GM_xmlhttpRequest({
            method: "GET",
            url: "http://abouthwm.ru/players.php?perpage=200&ordtype=gkz&clan="+clan_id,
            overrideMimeType: "text/xml; charset=windows-1251",
            ignoreCache: true,
            redirectionLimit: 0, // this is equivalent to 'failOnRedirect: true'
            onload: function(res) {
                let doc = new DOMParser().parseFromString(res.responseText, "text/html");
                let stat = doc.querySelector("#report_1 > tbody");
                console.log(stat);
                clanHeroesInfo = stat.childNodes;
                retrieveSmithGuild()
            },
            onerror: function(res) {
                GM_log("Error!");
            }
        });
    }
    function retrieveSmithGuild(){
        for (let i = 0; i < clanHeroesInfo.length; i++) {
            clanSmiths[clanHeroesInfo[i].querySelector("td:nth-child(3) > a").href.match(/\d{1,10}/)[0]] = clanHeroesInfo[i].querySelector("td:nth-child(4)").textContent
        }
        setSmithGuild()
    }

    function setSmithGuild() {
        let tbody = document.querySelector("body > center > table > tbody > tr > td > table:nth-child(2) > tbody");
        if (!tbody) {
            tbody = document.querySelector("#android_container > table:nth-child(2) > tbody")
        }
        let heroesTrs = tbody.childNodes;
        let nodeList = [];
        for (let i = 0; i < heroesTrs.length; i++) {
            let hero_id = heroesTrs[i].getElementsByTagName('a')[0].href.match(/\d{1,10}/)[0];
            let hero_smith = clanSmiths.hasOwnProperty(hero_id)?clanSmiths[hero_id]:"0";
            heroesTrs[i].insertAdjacentHTML("beforeend", `<td class="wbwhite" width="10">${hero_smith}</td>`);
            nodeList.push(heroesTrs[i])
        }
        nodeList = nodeList.sort((a, b) =>
            (a.lastChild.textContent-0 < b.lastChild.textContent-0 ) ? 1 : -1);
        tbody.innerHTML = "";
        for (let i = 0; i < nodeList.length; i++) {
            tbody.insertAdjacentHTML('beforeend', nodeList[i].outerHTML)
        }
    }
})(window);