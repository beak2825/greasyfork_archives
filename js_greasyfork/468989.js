// ==UserScript==
// @name         LogPathFix
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  fix log path
// @author       AniYo.Zhang
// @match        https://nothingtech.atlassian.net/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468989/LogPathFix.user.js
// @updateURL https://update.greasyfork.org/scripts/468989/LogPathFix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var elements
    var debug = false
    var all_log_path = []

    window.onload = function () {
        elements = document.querySelectorAll("[data-testid='issue.views.field.single-line-text.read-view.customfield_10057']")
        if (debug) console.log("aniyo: begin length ", elements.length)
        if (elements.length == 0) {
            if (debug) console.log("aniyo: parse delay 2s")
            setTimeout(parse, 2000)
        } else {
            if (debug) console.log("aniyo: go parse")
            parse()
        }
    }

    function parse() {
        if (elements.length == 0) {
            if (debug) console.log("aniyo parse: elements.length is 0, retry")
            elements = document.querySelectorAll("[data-testid='issue.views.field.single-line-text.read-view.customfield_10057']")
        }

        if (debug) console.log("aniyo parse: length ", elements.length)

        //查找Local Log Link 是否有log地址
        if (elements.length > 0) {
            fixLogPath(elements[0].textContent)
        }


        //查找评论中是否有版本地址
        var result = parseFromXpath("//p [@data-renderer-start-pos]");
        result.forEach(path => {
            fixLogPath(path)
        });

        if (all_log_path.length > 0) {
            var class_list = document.getElementsByClassName("_i2q7idpf _2d6bidpf _2i7kidpf")
            if (class_list != null) {
                var cc = class_list[class_list.length - 1];
                all_log_path.forEach(path => {
                    var para = document.createElement("p");
                    var node = document.createTextNode(path);
                    para.appendChild(node)
                    cc.appendChild(para)
                });
            }
        }
    }

    function fixLogPath(path) {
        var log_path = decodeURIComponent(path).replace(/\//g, "\\")
        if (debug) console.log("aniyo fixLogPath: ", log_path)
        if (log_path.includes("testlog")) {
            var index_path = log_path.indexOf("testlog\\")
            var str1 = '\\\\log.nothing.local\\'
            var str2 = log_path.substring(index_path)
            log_path = str1 + str2
            all_log_path.push(log_path)
        }
    }

    function parseFromXpath(XPATH) {
        var xresult = document.evaluate(XPATH, document, null, XPathResult.ANY_TYPE, null);
        var xnodes = [];
        var xres;
        while (xres = xresult.iterateNext()) {
            if (xres.textContent.includes("testlog")) {
                if (debug) console.log("aniyo parseFromXpath: ", xres.textContent)
                xnodes.push(xres.textContent);
            }
        }
        return xnodes;
    }
})();