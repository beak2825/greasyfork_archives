// ==UserScript==
// @name           osu!RX成绩显示
// @name:en        RelaxHelper
// @namespace      http://tampermonkey.net/
// @version        2.0.0
// @description    给基于Ripple的网页替换RX成绩的显示
// @description:en Add scores and pp table for osu!rx player
// @author         TROU2004
// @include        *osu.ppy.sb*
// @connect        osu.ppy.sb
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/399535/osu%21RX%E6%88%90%E7%BB%A9%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/399535/osu%21RX%E6%88%90%E7%BB%A9%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

const RIPPLE_API = "https://osu.ppy.sb/api/v1"
var curBPList
var nextPage = 1

document.addEventListener("DOMContentLoaded", function(){
    let mainInterval = setInterval(function () {
        let href = window.location.href
        if (href.indexOf("osu.ppy.sb/u/") != -1 && document.body.getAttribute("rxLoaded") != "true") {
            document.body.setAttribute("rxLoaded", "true")
            loadProfilePage(href.substring(href.indexOf("u/") + 2, href.indexOf("?mode=0")), true)
        }
    }, 500)
})

function pullRequestBP(userID) {
    console.log("request: " + userID)
    GM_xmlhttpRequest({
        method: "GET",
        url: RIPPLE_API + "/users/scores/rxbest?mode=0&p=" + nextPage + "&l=20&id=" + userID,
        timeout: 8000,
        onload: function (response) {
            curBPList = JSON.parse(response.responseText).scores
            nextPage++
        }
    });
}

function loadProfilePage(userID, tweakTable) {
    pullRequestBP(userID)
    let profileInterval = setInterval(function () {
        let curTable = document.querySelector("#scores-zone > div:nth-child(1) > div > div:nth-child(1) > table")
        var tBody = curTable.tBodies[0]
        if (tBody.firstChild != null && curBPList != null) {
            if (tweakTable) {
                tweakStackPanel(userID)
                tBody.innerHTML = ""
                curTable.setAttribute("data-type", "rxbp")
                var button = document.querySelector("#scores-zone > div:nth-child(1) > div > div:nth-child(1) > table > tfoot > tr > th > div > a")
                var span = document.createElement("span")
                span.appendChild(button.cloneNode(true))
                span.firstElementChild.setAttribute("class", "item load-more-button")
                span.firstElementChild.onclick = function () {
                    loadProfilePage(userID, false)
                }
                button.remove()
                document.querySelector("#scores-zone > div:nth-child(1) > div > div:nth-child(1) > table > tfoot > tr > th > div").appendChild(span)
            }
            for (let score of curBPList) {
                tBody.appendChild(createTrFromScore(score))
            }
            curBPList = null
            clearInterval(profileInterval)
            return
        }
    }, 200)
}

function tweakStackPanel(userID) {
    let element1 = document.querySelector("body > div.ui.full.height.main.wrapper > div.h-container > div:nth-child(2) > div:nth-child(4) > div > div > div:nth-child(3) > div:nth-child(1) > table > tbody")
    let element2 = document.querySelector("body > div.ui.full.height.main.wrapper > div.h-container > div:nth-child(2) > div:nth-child(5) > div > div > div:nth-child(3) > div:nth-child(1) > table > tbody")
    let parts = (element1 == null ? element2.children : element1.children)
    GM_xmlhttpRequest({
        method: "GET",
        url: RIPPLE_API + "/users/rxfull?id=" + userID,
        timeout: 4000,
        onload: function(response) {
            full = JSON.parse(response.responseText).std
            if (full == null) {
                return
            }
            document.querySelector("body > div.ui.full.height.main.wrapper > div.h-container > div:nth-child(2) > div.ui.top.attached.segment.overflow.auto > div.magic.table.floating.right > div > h1:nth-child(1)").innerHTML = "#" + full.global_leaderboard_rank
            parts[0].children[1].innerText = "#" + full.global_leaderboard_rank
            parts[1].children[1].innerText = "#" + full.country_leaderboard_rank
            parts[2].children[1].innerText = full.pp
            parts[3].children[1].innerText = full.ranked_score
            parts[4].children[1].innerText = full.total_score
            parts[5].children[1].innerText = full.playcount
            parts[7].children[1].innerText = full.replays_watched
            parts[9].children[1].innerText = full.accuracy.toFixed(2) + "%"
        }
    });
}

function createTrFromScore(score) {
    var curTr = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    td1.innerHTML = "<td><img src=\"" + getRankIcon(score.rank) + "\" class=\"score rank\" alt=\"" + score.rank + "\"> " + score.beatmap.song_name + " <b>" + getScoreMods(score.mods) + "</b> <i>(" + score.accuracy.toFixed(2) + "%" + ")</i><br><div class=\"subtitle\"><a>" + new Date(score.time).toLocaleString('chinese', { hour12: false }); + "</a></div></td>"
    td2.innerHTML = "<td><b>" + score.pp.toFixed(2) + "pp</b>" + "<br><a href=\"/web/replays/" + score.id + "\" class=\"downloadstar\"><i class=\"star icon\"></i>Download</a></td>"
    curTr.innerHTML = "<tr class=\"score-row\" data-scoreid=\"" + score.id + "\"></tr>"
    curTr.appendChild(td1)
    curTr.appendChild(td2)
    console.log(curTr)
    return curTr
}

function getRankIcon(grade) {
    var str = grade
    if (grade == "SH") {
        str = "SHD"
    }
    if (grade == "SSH") {
        str = "SSHD"
    }

    return "/static/ranking-icons/" + str + ".svg"
}

//Include from Akatsuki-web
//Source code: https://github.com/osuAkatsuki/old-frontend/blob/master/js/user.js
function getScoreMods(m) {
    var r = '';
    var hasNightcore = false;
    if (m & NoFail) {
        r += 'NF, ';
    }
    if (m & Easy) {
        r += 'EZ, ';
    }
    if (m & NoVideo) {
        r += 'NV, ';
    }
    if (m & Hidden) {
        r += 'HD, ';
    }
    if (m & HardRock) {
        r += 'HR, ';
    }
    if (m & SuddenDeath) {
        r += 'SD, ';
    }
    if (m & Nightcore) {
        r += 'NC, ';
        hasNightcore = true;
    }
    if (!hasNightcore && (m & DoubleTime)) {
        r += 'DT, ';
    }
    if (m & Relax) {
        r += 'RX, ';
    }
    if (m & HalfTime) {
        r += 'HT, ';
    }
    if (m & Flashlight) {
        r += 'FL, ';
    }
    if (m & Autoplay) {
        r += 'AP, ';
    }
    if (m & SpunOut) {
        r += 'SO, ';
    }
    if (m & Relax2) {
        r += 'AP, ';
    }
    if (m & Perfect) {
        r += 'PF, ';
    }
    if (m & Key4) {
        r += '4K, ';
    }
    if (m & Key5) {
        r += '5K, ';
    }
    if (m & Key6) {
        r += '6K, ';
    }
    if (m & Key7) {
        r += '7K, ';
    }
    if (m & Key8) {
        r += '8K, ';
    }
    if (m & keyMod) {
        r += '';
    }
    if (m & FadeIn) {
        r += 'FD, ';
    }
    if (m & Random) {
        r += 'RD, ';
    }
    if (m & LastMod) {
        r += 'CN, ';
    }
    if (m & Key9) {
        r += '9K, ';
    }
    if (m & Key10) {
        r += '10K, ';
    }
    if (m & Key1) {
        r += '1K, ';
    }
    if (m & Key3) {
        r += '3K, ';
    }
    if (m & Key2) {
        r += '2K, ';
    }
    if (r.length > 0) {
        return "+ " + r.slice(0, -2);
    } else {
        return '';
    }
}

var None = 0;
var NoFail = 1;
var Easy = 2;
var NoVideo = 4;
var Hidden = 8;
var HardRock = 16;
var SuddenDeath = 32;
var DoubleTime = 64;
var Relax = 128;
var HalfTime = 256;
var Nightcore = 512;
var Flashlight = 1024;
var Autoplay = 2048;
var SpunOut = 4096;
var Relax2 = 8192;
var Perfect = 16384;
var Key4 = 32768;
var Key5 = 65536;
var Key6 = 131072;
var Key7 = 262144;
var Key8 = 524288;
var keyMod = 1015808;
var FadeIn = 1048576;
var Random = 2097152;
var LastMod = 4194304;
var Key9 = 16777216;
var Key10 = 33554432;
var Key1 = 67108864;
var Key3 = 134217728;
var Key2 = 268435456;
