// ==UserScript==
// @name        Facebook Auto "Most Recent" Stories
// @version     0.1559010793
// @author      Hélder Ferreira
// @namespace   https://greasyfork.org/users/89591
// @homepageURL https://greasyfork.org/en/scripts/382099-facebook-auto-most-recent-stories
// @description Change Facebook and groups feed to "Most Recent"
// @compatible  chrome
// @compatible  firefox
// @compatible  opera
// @compatible  safari
// @compatible  msedge
// @license     MIT
// @icon        https://en.facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png
// @match       https://*.facebook.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/382099/Facebook%20Auto%20%22Most%20Recent%22%20Stories.user.js
// @updateURL https://update.greasyfork.org/scripts/382099/Facebook%20Auto%20%22Most%20Recent%22%20Stories.meta.js
// ==/UserScript==
(function(){ var arr = [
    "",
    "// ### Global vars ###",
    "var cur = new URL(window.location.href), spurl = cur['href'].split('/'),",
    "",
    "// ### Feed vars ###",
    "fd = cur['origin'] + '?sk=h_chr', elm = document.querySelectorAll(\"[data-click='bluebar_logo'] > a, ._3qcu > a, #navItem_4748854339 > a\"), grp = document.querySelectorAll(\"[data-type='type_group'] > a\"),  idx = ['?sk=h_nor', '?ref=logo', '?sk=nf', '?ref=tn_tnmn'],",
    "",
    "// ### Groups vars ###",
    "grid = document.querySelectorAll(\"[property='al:android:url']\"), gdisc = document.querySelectorAll('._2yau'), gpop = ['CHRONOLOGICAL', 'RECENT_ACTIVITY'], gref = ['?ref=group_header', '?ref=bookmarks', '?ref=direct', '?fref=nf', '?ref=nf_target&fref=nf'];",
    "",
    "",
    "// ### For Feed ###",
    "if(cur['href'] === cur['origin'] + '/'){",
        "window.location.replace(fd);",
    "}",
    "idx.forEach((a) => {",
        "if(cur['search'].includes(a)){",
            "window.location.replace(fd);",
        "}",
    "});",
    "elm.forEach(elm => elm.addEventListener('click', () => {",
        "window.location.replace(fd);",
    "}), false);",
    "",
    "",
    "// ### For Groups ###",
    "grp.forEach(shc => shc.addEventListener('click', () => {",
        "shc = shc.getAttribute('href');",
        "window.location.replace(groupSec(shc, gpop[0]));",
    "}, false));",
    "",
    "if(cur['href'].includes('groups') && !cur['href'].includes('permalink') && !cur['href'].includes('comment_id')){",
        "if(spurl[5] === '' || spurl[5] === null || spurl[5] === gref[0] || spurl[5] === gref[1] || spurl[5] === gref[2] || spurl[5] === gref[3] || spurl[5] === gref[4] || spurl[5] !== '?sorting_setting=' + gpop[0]){",
            "window.location.replace(sortGrp(grid, 'content', gpop[0], cur['origin'] + '/'));",
        "}",
    "}",
    "",
    "// # Discussion link event #",
    "if(gdisc[1] !== undefined){",
        "var abpg = document.querySelectorAll('._2yaa');",
        "abpg = abpg[1].getAttribute('data-key');",
        "if(!abpg.includes('tab_about')){",
            "gdisc[1].addEventListener('click', () => { window.location.replace(sortGrp(grid, 'content', gpop[0], cur['origin'] + '/')) }, false);",
        "}",
    "}",
    "",
    "// # 'post time' & 'comment time' link event #",
    "var postime = document.querySelectorAll('._5pcq');",
    "postime.forEach(ptm => ptm.addEventListener('click', () => {",
        "ptm = ptm.getAttribute('href');",
        "window.location.replace(ptm);",
    "}, false));",
    "",
    "var comtime = document.querySelectorAll('._6qw7');",
    "comtime.forEach(cmt => cmt.addEventListener('click', () => {",
        "cmt = cmt.getAttribute('href');",
        "window.location.replace(cmt);",
    "}, false));",
    "",
    "",
    "// ### Required functions ###",
    "// # Arguments: a = element where group ID is located, b = atribute where group ID is, c = type of group disposition (CHRONOLOGICAL or RECENT_ACTIVITY), d = Facebook domain, rs = a resource variable #",
    "function sortGrp(a, b, c, d, rs){",
        "a = a[0].getAttribute(b);",
        "rs = a.split('/');",
        "return d + 'groups/' + rs[3] + '/?sorting_setting=' + c;",
    "}",
    "",
    "// # Arguments: a = href attribute, b = type of group disposition (CHRONOLOGICAL or RECENT_ACTIVITY), rs = a resource variable #",
    "function groupSec(a, b, rs){",
        "rs = a.toString().replace(/(.?)ref=bookmarks/gi, \"\");",
        "return rs + \"?sorting_setting=\" + b;",
    "}",
    "",
    ].join("\n");
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.appendChild(document.createTextNode(arr));
    document.querySelectorAll("head")[0].appendChild(js);
})();