// ==UserScript==
// @name         osu! Direct Link
// @namespace    http://rix.li/
// @version      0.2.3
// @description  Add osu! direct download links without making remote requests
// @author       rix
// @match        *://osu.ppy.sh/b/*
// @match        *://osu.ppy.sh/s/*
// @match        *://osu.ppy.sh/forum/t/*
// @match        *://osu.ppy.sh/p/beatmaplist*
// @require      http://code.jquery.com/jquery-latest.js
// @require      http://libs.baidu.com/underscore/1.3.3/underscore-min.js
// @grant        GM_log
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/2792/osu%21%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/2792/osu%21%20Direct%20Link.meta.js
// ==/UserScript==

if (/^\/[sb]\/\d+$/.test(location.pathname)) {
    GM_addStyle('.osu-mirror-button {\r\n  outline: 0;\r\n  padding: 0 2rem;\r\n  text-transform: uppercase;\r\n  border: none;\r\n  border-radius: 2px;\r\n  text-decoration: none;\r\n  color: #fff;\r\n  height: 44px;\r\n  line-height: 46px;\r\n  text-align: center;\r\n  letter-spacing: 1px;\r\n  font-size: 14px;\r\n  cursor: pointer;\r\n  display: inline-block;\r\n  overflow: hidden;\r\n  -webkit-user-select: none;\r\n     -moz-user-select: none;\r\n      -ms-user-select: none;\r\n          user-select: none;\r\n  vertical-align: middle;\r\n  will-change: opacity, transform;\r\n  -webkit-transition: all .15s ease-out;\r\n          transition: all .15s ease-out;\r\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\r\n}\r\n.osu-mirror-button:hover, .osu-mirror-button:active {\r\n  outline: 0;\r\n  color: #FFF;\r\n  text-decoration: none;\r\n}\r\n.osu-mirror-button:hover {\r\n  background-color: #2bbbad;\r\n  box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);\r\n}\r\n.osu-mirror-button.bloodcat {\r\n  background-color: #DD3F41;\r\n}\r\n.osu-mirror-button.bloodcat:hover {\r\n  background-color: #df4c4e;\r\n}\r\n.osu-mirror-button.loli-al {\r\n  background-color: #ED8FE6;\r\n}\r\n.osu-mirror-button.loli-al:hover {\r\n  background-color: #ef9ce9;\r\n}\r\n.osu-mirror-button.rix-li {\r\n  background-color: #86C2F7;\r\n}\r\n.osu-mirror-button.rix-li:hover {\r\n  background-color: #94c9f8;\r\n}\r\n\r\nul.osu-mirror-list {\r\n  list-style-type: none;\r\n  text-align: right;\r\n  margin: 2px 15px 16px 0;\r\n}\r\nul.osu-mirror-list li {\r\n  display: inline;\r\n  margin: 5px;\r\n}');

    var sid = /playBeatmapPreview\((\d+)/.exec(document.body.innerHTML)[1],
        template = '<ul class=\"osu-mirror-list\">\r\n  <li>\r\n    <a class=\"osu-mirror-button bloodcat\" href="<%= bloodcat %>">Bloodcat<\/a>\r\n  <\/li>\r\n  <li>\r\n    <a class=\"osu-mirror-button loli-al\"  href="<%= lolial %>">loli.al<\/a>\r\n  <\/li>\r\n  <li>\r\n    <a class=\"osu-mirror-button rix-li\" href="<%= rixli %>">rix.li<\/a>\r\n  <\/li>\r\n <% if (typeof rixli_nv !== "undefined" && rixli_nv) { %> <li>\r\n    <a class=\"osu-mirror-button rix-li\" href="<%= rixli_nv %>">rix.li nv<\/a>\r\n  <\/li>\r\n <% } %><\/ul>',
        data = {
            "bloodcat": "http://bloodcat.com/osu/m/" + sid,
            "lolial": "http://loli.al/s/" + sid,
            "rixli": "http://osu.rix.li/d/" + sid
        };
    if ($('.beatmapDownloadButton').length === 3) {
        data.rixli_nv = "http://osu.rix.li/d/" + sid + 'n';
    }

    $('.content-with-bg h1').before(_.template(template, data));
}

$('a[href^="/d/"], a[href^="https://osu.ppy.sh/d/"], a[href^="http://osu.ppy.sh/d/"]').each(function() {
    this.href = this.href.replace(/^(https?:\/\/osu.ppy.sh)?(\/d\/\d+n?)/, 'http://osu.rix.li$2');
});
