// ==UserScript==
// @name                明星马赛克 Entertainment Mosaic
// @namespace           https://github.com/ztjryg4/EntertainmentMosaic
// @version             2.1.1
// @description:en      Let the names of entertainment stars you don't want to see permanently get out of your timeline.
// @description:zh-CN   让你不想看到的明星从你的时间线上滚蛋（以马赛克的方式）。
// @author              Tianjie Zhang
// @match               *://*/*
// @exclude             *://github.com/*
// @exclude             *://greasyfork.org/*
// @require             https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant               unsafeWindow
// @run-at              document-end
// @description Let the names of entertainment stars you don't want to see permanently get out of your timeline.
// @downloadURL https://update.greasyfork.org/scripts/408909/%E6%98%8E%E6%98%9F%E9%A9%AC%E8%B5%9B%E5%85%8B%20Entertainment%20Mosaic.user.js
// @updateURL https://update.greasyfork.org/scripts/408909/%E6%98%8E%E6%98%9F%E9%A9%AC%E8%B5%9B%E5%85%8B%20Entertainment%20Mosaic.meta.js
// ==/UserScript==

(function () {
    // 'use strict';

    try {
        var monitor = new MutationObserver(mutations => roundObverse());

        var monitorConfig = {
            childList: true,
            subtree: true,
            characterData: false,
            attributes: false
        }

        monitor.observe(document.body, monitorConfig)
    }
    catch (err) {
        console.log("Do not support MutationObserver!")
    }
    finally {
        addMosaicStyle();
        startProcess();
    }

    function roundObverse() {
        monitor.disconnect();
        startProcess();
        monitor.observe(document.body, monitorConfig)
    }


    function addMosaicStyle() {
        var mosaicStyle = document.createElement('style');
        mosaicStyle.innerHTML = "span.mosaic{color: transparent;text-shadow: 0 0 10px rgba(0,0,0,0.4);}"
        document.head.appendChild(mosaicStyle);
    };


    function startProcess() {
        var starList = ["肖戰", "肖战", "仝卓"];

        starList.sort(function (a, b) {
            return b.length - a.length;
        });

        for (var i = 0, len = starList.length; i < len; i++) {
            var curStarName = starList[i];
            console.log("Handling: ", curStarName);
            var curReg = eval("/" + curStarName + "/g");
            handleSpecialCase(curReg);
            // document.body.innerHTML = document.body.innerHTML.replace(curReg, "<span class='mosaic'>" + curStarName + "</span>");
            // $("body").html($("body").html().replace(curReg, "<span class='mosaic'>" + curStarName + "</span>"));
            const replaceOnDocument = ({ target = document.body } = {}) => {
                [
                    target,
                    ...target.querySelectorAll("*:not(script):not(noscript):not(style)")
                ].forEach(({ childNodes: [...nodes] }) => nodes
                    .filter(({ nodeType }) => nodeType === document.TEXT_NODE)
                    .forEach((textNode) => {
                        if (textNode.textContent.search(curReg) != -1) {
                            $(textNode).wrap("<span class='mosaic' />")
                        }
                    }));
            };
            replaceOnDocument();
        }
    };


    function handleSpecialCase(curReg) {
        var inputList = document.querySelectorAll("input");
        for (var i = 0, len = inputList.length; i < len; i++) {
            var curInput = inputList[i];
            curInput.setAttribute("value", curInput.value.replace(curReg, ""))
        }
    };

})();