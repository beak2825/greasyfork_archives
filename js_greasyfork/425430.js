  // ==UserScript==
  // @name         remark-it
  // @namespace    http://tampermonkey.net/
  // @version      0.8
  // @description  View markdown as a slideshow（support remark & takahashi mode）
  // @author       knightli
  // @match        *://*/*.md
  // @match        *://*.yuque.com/*
  // @match        *://yuque.alibaba-inc.com/*
  // @icon         https://lh3.googleusercontent.com/RKFIo2vVoizHD-ZCk4rSktbo62iOrB1LSpkOnxolwN4_uv2X4n9gRxV3HMxKTc12yQDtTVYdFiv7vC_dQMf5CkS8=s256-rw
  // @grant        GM_registerMenuCommand
  // @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/425430/remark-it.user.js
// @updateURL https://update.greasyfork.org/scripts/425430/remark-it.meta.js
  // ==/UserScript==

  (function() {
    'use strict';
    var __url;
    var CDN_ROOT = "https://g.alicdn.com/assets-group/remark-it-assets/0.0.2/";
    var matchHtmlRegExp = /["'&<>]/
    function escapeHtml (string) {
        var str = '' + string
        var match = matchHtmlRegExp.exec(str)

        if (!match) {
            return str
        }

        var escape
        var html = ''
        var index = 0
        var lastIndex = 0

        for (index = match.index; index < str.length; index++) {
            switch (str.charCodeAt(index)) {
                case 34: // "
                    escape = '&quot;'
                    break;
                case 38: // &
                    escape = '&amp;'
                    break;
                case 39: // '
                    escape = '&#39;'
                    break;
                case 60: // <
                    escape = '&lt;'
                    break;
                case 62: // >
                    escape = '&gt;'
                    break;
                default:
                    continue;
            }

            if (lastIndex !== index) {
                html += str.substring(lastIndex, index)
            }

            lastIndex = index + 1
            html += escape
        }

        return lastIndex !== index ? (html + str.substring(lastIndex, index)) : html;
    }
    function urlFormat(url) {
        if(url){
            return url.includes("yuque") ? url.replace("/edit", "") : url;
        }
        return url;
    }
    function yuqueMarkdownMode() {
        var url = window.location.href;
        url = urlFormat(url);
        url += "/markdown?plain=true&linebreak=false&anchor=false";
        window.open(url, "_blank");
    }
    function getMarkdown(){
        // Chrome wraps raw text content in a pre
        var pre = document.querySelector('pre');

        if (pre) {
            var url = document.location.href.split(/[\#\?]/, 2)[0];
            var fileName = url.split('/').slice(-1)[0];
            //, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=' + (screen.width) + ', height=' + (screen.height) + ', top=0, left=0'

            var str = pre.innerHTML;
            str = str.trim();

            //语雀中有可能markdown 代码块是套在 block 内的，需要提取一下
            if( str.startsWith('```') && str.endsWith('```')) {
                var r = /(^```.*\n)/g.exec(str);
                if(r) {
                    str = str.slice(r[0].length, -3);
                }
            }
            return str;
        }
    }

    function getFileName() {
        var url = document.location.href.split(/[\#\?]/, 2)[0];
        return url.split('/').slice(-1)[0];
    }

    function getURL(url) {
        return CDN_ROOT + url;
    }

    function remarkIt(markdown, fileName) {

        if(!markdown) markdown = getMarkdown();
        if(!fileName) fileName = getFileName();
        console.log(markdown);
        console.log(markdown.length);

        if(markdown) {

            var win = window.open('', fileName, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=' + (screen.width) + ', height=' + (screen.height) + ', top=0, left=0');

            // @ts-ignore
            win.document.write('<!doctype html>' +
                              '<head><title>' + fileName + '</title></head><body>' +
                              '<link rel="stylesheet" href="' + getURL('vendor/remark/remark.css') + '">' +
                              '<pre id="source">' + markdown + '</pre>' +
                              '<script src="' + getURL('vendor/remark/remark.js') + '"></script>' +
                              '<script src="' + getURL('vendor/remark/init.js') + '"></script>' +
                              '</body></html>');
        }
    }

    function takahashiIt(markdown, fileName) {

        if(!markdown) markdown = getMarkdown();
        if(!fileName) fileName = getFileName();

        if(markdown) {

            var win = window.open('', fileName, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=' + (screen.width) + ', height=' + (screen.height) + ', top=0, left=0');

            // @ts-ignore
            win.document.write('<!doctype html>' +
                              '<head><title>' + fileName + '</title>' +
                              '<link rel="stylesheet" href="' + getURL('vendor/takahashi/common.css') + '">' +
                              '<link rel="stylesheet" title=light href="' + getURL('vendor/takahashi/light.css') + '">' +
                              '<link rel="alternate stylesheet" title=dark href="' + getURL('vendor/takahashi/dark.css') + '">' +
                              '<link rel="alternate stylesheet" title=EVA href="' + getURL('vendor/takahashi/eva.css') + '">' +
                              '<link rel="alternate stylesheet" title=debug href="' + getURL('vendor/takahashi/debug.css') + '">' +
                              '<link rel="stylesheet" title=light href="' + getURL('vendor/takahashi/prismjs/themes/prism.css') + '">' +
                              '<link rel="alternate stylesheet" title=dark href="' + getURL('vendor/takahashi/prismjs/themes/prism-twilight.css') + '">' +
                              '<link rel="alternate stylesheet" title=EVA href="' + getURL('vendor/takahashi/prismjs/themes/prism-tomorrow.css') + '">' +
                              '</head><body>' +
                              '<pre id="source">' + markdown + '</pre>' +
                              '<script src="' + getURL('vendor/takahashi/prismjs/prism-core.min.js') + '"></script>' +
                              '<script src="' + getURL('vendor/takahashi/prismjs/prism-autoloader.min.js') + '"></script>' +
                              '<script src="' + getURL('vendor/takahashi/prism-file-highlight.js') + '"></script>' +
                              '<script src="' + getURL('vendor/takahashi/takahashi.js') + '"></script>' +
                              '<script src="' + getURL('vendor/takahashi/init.js') + '"></script>' +
                              '</body></html>');
        }
    }
    if(window.location.href.indexOf('.md') > 0 || window.location.href.indexOf('/markdown?plain=true&linebreak=false&anchor=false') > 0) {
        GM_registerMenuCommand("takahashi演示", function() {
            takahashiIt();
        });
        GM_registerMenuCommand("remark演示", function() {
            remarkIt();
        });
    }
    else if((window.location.href.indexOf('//yuque.alibaba-inc.com/')>=0) || (window.location.href.indexOf('//www.yuque.com/')>=0)) {
        GM_registerMenuCommand("markdown纯文本", function() {
            yuqueMarkdownMode();
        });
    }
    function addSlideBtn(card, name, slideType) {
        var cardRoot = card.cardRoot[0];
        var markdown = card.value.code;

        var toolBarGroup = cardRoot.getElementsByClassName("lake-embed-toolbar-group");
        if(!cardRoot || !toolBarGroup) return;

        markdown = escapeHtml(markdown);

        toolBarGroup = toolBarGroup[0];

        var icons = {
            "remark": "lake-icon-doc-embed",
            "takahashi": "lake-icon-preview"
        };
        var iconClassName = icons[slideType] || "lake-icon-preview";

        var newToolBarItem = document.createElement("span");
        newToolBarItem.classList = "lake-embed-toolbar-item lake-embed-toolbar-item-preview";
        var newToolBarBtn = document.createElement("a");
        newToolBarBtn.setAttribute("title",slideType);
        newToolBarBtn.classList = "lake-embed-toolbar-btn";
        var newToolBarIcon = document.createElement("span");
        newToolBarIcon.classList = "lake-icon " + iconClassName;
        newToolBarBtn.appendChild(newToolBarIcon);
        newToolBarItem.appendChild(newToolBarBtn);
        toolBarGroup.appendChild(newToolBarItem);

        newToolBarBtn.addEventListener("click", function(){
            if(slideType==="remark") {
                remarkIt(markdown, name);
            }
            else if(slideType==="takahashi") {
                takahashiIt(markdown, name);
            }
        });

        return newToolBarBtn;
    }
    function injectPage() {
        Object.keys(unsafeWindow.__engine.card.idCache).forEach(function(key){
            console.log(key);
            var card = unsafeWindow.__engine.card.idCache[key].component;
            if(card.mode == "markdown") {
                addSlideBtn(card, key, "takahashi");
                addSlideBtn(card, key, "remark");
            }
        });
    }
    function waitForJSFinish(){
        var jsInitChecktimer = setInterval(function() {
            if(unsafeWindow.__engine) {
                clearInterval(jsInitChecktimer);
                setTimeout(injectPage,200);
                detectLocationChange(injectPage);
            }
        }, 200);
    }
    function detectLocationChange(fn) {
        var currLocation = unsafeWindow.location.href + "";
        console.log(currLocation);
        var jsDetectLocationTimer = setInterval(function() {
            var nowLocation = unsafeWindow.location.href + "";
            console.log(nowLocation);
            if(nowLocation!=currLocation) {
                currLocation = nowLocation;
                setTimeout(fn, 1000);
            }
        }, 200);
    }
    window.addEventListener ("load", waitForJSFinish, false);
  })();