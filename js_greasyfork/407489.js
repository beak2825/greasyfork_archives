// ==UserScript==
// @name         Find_All_Links
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  Find and show all links on top, update every 10sec
// @author       x94fujo6
// @match        http://angusnicneven.com/*
// @match        https://angusnicneven.com/*
// @downloadURL https://update.greasyfork.org/scripts/407489/Find_All_Links.user.js
// @updateURL https://update.greasyfork.org/scripts/407489/Find_All_Links.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function timer() {
        var getshadow = document.getElementById("shadow");
        if (getshadow) { getshadow.remove(); }
        find_all_link();
        setInterval(main, 3000);
    }
    function main() {
        var old_links = document.getElementById("all_links");
        old_links.remove();
        find_all_link();
    }
    function endsWithAny(filterstr, string) {
        return filterstr.some(
            function (suffix) {
                return string.endsWith(suffix);
            }
        );
    }
    function find_all_link() {
        var mycss = "font-weight:bold;color:#ffffff;background-color:#000000;padding:10px;margin:0px;opacity:1;";
        var newdiv = document.createElement("div");
        newdiv.id = "all_links";

        var editbody = document.body;
        editbody.insertBefore(newdiv, editbody.firstChild);

        var newList = document.createElement("ul");
        newList.style.border = "1px solid #ffffff";
        newdiv.appendChild(newList);

        var urls = document.querySelectorAll("[href], a");
        var filterstr = [".css", ".json", ".js", ".png", ".mp3", ".gif"];

        for (var loop = 0; loop < urls.length; loop++) {
            var urltest = urls[loop].getAttribute("href");
            if (endsWithAny(filterstr, urltest)) { continue; }

            var newListItem = document.createElement('li');
            newListItem.style = mycss;
            newList.appendChild(newListItem);

            var link = document.createElement('a');
            link.href = link.text = urls[loop].href;
            newListItem.appendChild(link);
        }

        var linkcount = document.getElementById("all_links").getElementsByTagName("li").length;
        if (linkcount == 0) {
            var nolink = document.createElement('li');
            nolink.style = mycss;
            nolink.textContent = "No link found (Some links need decipher to get)";
            newList.appendChild(nolink);

            var goback = document.createElement('li');
            goback.style = mycss;
            newList.appendChild(goback);

            var gobackurl = document.createElement('a');
            gobackurl.text = "GoBack";
            gobackurl.href = "http://angusnicneven.com/";
            goback.appendChild(gobackurl);
        }
    }
})();