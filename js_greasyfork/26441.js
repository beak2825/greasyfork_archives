// ==UserScript==
// @name         HKEPC+
// @namespace    http://www.hkepc.com/
// @version      0.3
// @description  Enhance HKEPC trading forum
// @author       lacek
// @match        *://www.hkepc.com/forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26441/HKEPC%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/26441/HKEPC%2B.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function() {
    var HKEPC = {

        init: function() {
            var page = this.determinePage();
            this.processPage(page);
        },

        determinePage: function() {
            var page = null;
            var url = window.location.href.toLowerCase();
            var file = url.substring(url.lastIndexOf('/') + 1);

            if (file === "index.php" || file === "") {
                page = 'index';
            }
            else if (file.indexOf("index.php?gid=") === 0) {
                page = 'group';
            }
            else if (file.indexOf("forumdisplay.php") === 0) {
                page = 'forum';
            }
            else if (file.indexOf("viewthread.php") === 0) {
                page = 'thread';
            }
            return page;
        },

        processPage: function(page) {
            if (page !== null) {
                if (typeof (this[page + "PageProcessor"]) == 'function') {
                    this[page + "PageProcessor"]();
                }
            }
        },

        indexPageProcessor: function() {
            //add '&orderby=dateline' to links to trading forums
            var searchStart = 150;		//((19*3-9)°Ï)*4+8
            var searchEnd = 250;
            var linksPerBlock = 2;
            var tradeLinks = ['?fid=14', '?fid=81', '?fid=119'];
            var aTag = document.getElementById('mainIndex').getElementsByTagName('a');
            var linksChanged = 0;

            for (var i = 0; i < tradeLinks.length; i++) {
                for (var j = searchStart; j < searchEnd; j++) {
                    if (aTag[j].href.indexOf(tradeLinks[i]) != -1) {
                        aTag[j].href += '&orderby=dateline';
                        linksChanged++;
                        if (linksChanged >= linksPerBlock) {
                            linksChanged = 0;
                            break;		//seach for next link
                        }
                    }
                }
            }
        },

        groupPageProcessor: function() {

        },

        forumPageProcessor: function() {
            this.patchForumPageHotkey();
            this.patchThreadLinks();
        },

        threadPageProcessor: function() {
            if(this.getQueryValue(window.location.href, "extra") !== "") this.patchThreadPageHotkey();
        },

        //patch arrow hotkey links that contains '&amp;'
        patchForumPageHotkey: function() {
            var oldScript = document.querySelector('#wrap > script[type="text/javascript"]');
            var newScript = document.createElement('script');
            newScript.innerHTML = oldScript.innerHTML.replace(/\amp;/g, "");
            oldScript.parentNode.appendChild(newScript);
            oldScript.parentNode.removeChild(oldScript);
        },

        //patch arrow hotkey link that misses parameters
        patchThreadPageHotkey: function() {
            var oldScript = document.getElementById('wrap').getElementsByTagName('script');
            var oldUrl = null;
            for (var i = 0; i < oldScript.length; i++) {
                if ((oldUrl = oldScript[i].innerHTML.match(/'viewthread.php\?tid=[0-9]+'/)) !== null) {
                    var newScript = document.createElement('script');
                    oldUrl = oldUrl[0].substring(1, oldUrl[0].length - 1);
                    var newUrl = oldUrl + "&extra=" + this.getQueryValue(window.location.href, 'extra');
                    newScript.innerHTML = oldScript[i].innerHTML.replace(oldUrl, newUrl);
                    oldScript[i].parentNode.appendChild(newScript);
                    oldScript[i].parentNode.removeChild(oldScript[i]);
                    break;
                }
            }
        },

        //patch forum incorrect links containing '&amp;'
        patchThreadLinks: function() {
            var spanTag = document.getElementById("threadlist").getElementsByTagName("span");
            var spanTagLen = spanTag.length;
            var aTag;
            for (var i = 0; i < spanTagLen; i++) {
                if (spanTag[i].id.indexOf('thread_') === 0) {
                    aTag = spanTag[i].getElementsByTagName("a")[0];
                    aTag.href = aTag.href.replace(/\amp%3B/g, "");
                }
            }
        },

        //Get the value of parameter from a URL
        getQueryValue: function(url, name) {
            name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regexS = "[\\?&]"+name+"=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(url);
            return (results === null) ? "" : results[1];
        }
    };

    HKEPC.init();
})();
