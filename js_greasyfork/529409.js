// ==UserScript==
// @name           Disney+ Subtitles Downloader (Enhanced)
// @name:fr        Disney+ Subtitles Downloader (Enhanced)
// @namespace      https://greasyfork.org/users/572942-stegner
// @homepage       https://greasyfork.org/scripts/404223-disney-subtitles-downloader
// @description    Download subtitles from Disney+ with a dedicated download button
// @description:fr Télécharger les sous-titres de Disney+ avec un bouton dédié
// @version        2.16
// @author         stegner
// @license        MIT; https://opensource.org/licenses/MIT
// @match          https://www.disneyplus.com/*
// @grant          none
// @require        https://cdn.jsdelivr.net/npm/jszip@3.5.0/dist/jszip.min.js
// @require        https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/529409/Disney%2B%20Subtitles%20Downloader%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529409/Disney%2B%20Subtitles%20Downloader%20%28Enhanced%29.meta.js
// ==/UserScript==

(function(open, send) {
    'use strict';
    var debug = (location.hash=="#debug");
    debuglog("Script loaded : Disney+ Subtitles Downloader (Enhanced)");

    // 用于存储我们自己创建的样式表引用
    var dsSheet;
    function createDownloadStyleSheet() {
        if (!dsSheet) {
            var styleElem = document.createElement("style");
            styleElem.type = "text/css";
            document.head.appendChild(styleElem);
            dsSheet = styleElem.sheet;
        }
    }
    // 在字幕选项上添加下载按钮的样式
    function addCustomStyles() {
        createDownloadStyleSheet();
        // 调整原有伪元素样式（如果需要保留图标效果，可调整）
        dsSheet.insertRule(".options-picker.subtitle-track-picker > div { position: relative; }", dsSheet.cssRules.length);
        // 样式定义：下载按钮（绝对定位在右上角的小按钮）
        dsSheet.insertRule(
            ".download-sub-btn { " +
                "position: absolute; top: 2px; right: 2px; " +
                "width: 20px; height: 20px; " +
                "background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAIGNIUk0AAHonAACAgwAA+mQAAIDSAAB2hgAA7OkAADmeAAAV/sZ+0zoAAAE4SURBVHja1JS7LkRRFIa/M6aYRCEuCUEUgihFBolGVGqiFY1ConfpNB7CiygUGm8hOiMukwiCCMl8mj2xc5yZM8M0/mTlrLP2v75zydo7UclRL3AGlIAl4L6ZuUC+5oEZYBoo55lbAdai/LPTwFongG3pfwI3gZ3ovhjlXVG+BWz/6FbjKPuto1CbjWoLobYf1RZjRho4pt5F5g11QK2F6FFXo/UXdbwZEHVQvY2aztWPECdR/TkNawREHUpB03pSJ7J6Cf9gL3xOvDiiXmfAHtSplLek7qorqI/BeJjxxFG1kgNDPQjrn4VoLPozRqgCzAGXwFXILzJ8w+H6XgRegW7grcGs3gCTOfP8UgfGg139wwapxrugDl0H+oCkTZjAcsiTxBaO7HZUBI6BtfCmv4Un4aw8/RoA7wq6AO4uOhAAAAAASUVORK5CYII=) no-repeat center center; " +
                "cursor: pointer; opacity: 0.8; transition: opacity 0.2s; }", dsSheet.cssRules.length);
        dsSheet.insertRule(".download-sub-btn:hover { opacity: 1; }", dsSheet.cssRules.length);
    }

    function debuglog(message){
        if(debug){
            console.log("%c [debug] " + message, 'background: #222; color: #bada55');
        }
    }

    // 初始化入口
    function init(){
        debuglog("Document state : " + document.readyState);
        if (document.readyState === "complete" || document.readyState === "loaded"){
            start();
            debuglog("Already loaded");
        } else {
            window.addEventListener("load", start, false);
            debuglog("Waiting for window load");
        }
        document.listen = true;
    }

    function start(){
        debuglog("start");
        if (typeof document.initaudio !== "undefined") {
            document.initaudio();
        }
        if (typeof document.initsub !== "undefined") {
            document.initsub();
        }
        listensend();
        // 每 100ms 处理按钮更新
        document.handleinterval = setInterval(buttonhandle, 100);
    }

    if (!document.listen){
        init();
    }

    // 重置字幕相关全局变量，并添加自定义样式
    document.initsub = function(){
        debuglog("initsub");
        document.langs = [];
        document.segments = "";
        document.wait = false;
        document.m3u8found = false;
        document.url = null;
        document.oldlocation = null;
        document.filename = "";
        document.episode = "";
        document.downloadall = false;
        document.downloadid = 0;
        document.waitsub = false;
        document.segid = 0;
        document.vttlist = [];
        addCustomStyles();
    };

    // 捕捉 M3U8 文件
    function listensend(){
        debuglog("listensend");
        var newOpen = function(...args) {
            if (!document.m3u8found && args.length >= 2) {
                if(args[1].indexOf(".m3u8") > 0 && document.url !== args[1]) {
                    debuglog("m3u8 found: " + args[1]);
                    document.url = args[1];
                    document.langs = [];
                    document.baseurl = document.url.substring(0, document.url.lastIndexOf('/') + 1);
                    document.m3u8found = true;
                    getpagecontent(m3u8loaded, document.url);
                }
            }
            open.call(this, ...args);
        };
        var newSend = function(...args) {
            if (args[0] && args[0].match && args[0].match(/globalization/)) {
                this.addEventListener('readystatechange', function(e) {
                    try {
                        document.globalization = JSON.parse(e.target.response).data.globalization;
                    } catch(e) {}
                }, false);
            }
            send.call(this, ...args);
        };
        if (typeof unsafeWindow !== "undefined") {
            debuglog("Window state: unsafe");
            Object.defineProperty(unsafeWindow.XMLHttpRequest.prototype, "open", {value: exportFunction(newOpen, window)});
            Object.defineProperty(unsafeWindow.XMLHttpRequest.prototype, "send", {value: exportFunction(newSend, window)});
        } else {
            debuglog("Window state: safe");
            XMLHttpRequest.prototype.open = newOpen;
            XMLHttpRequest.prototype.send = newSend;
        }
    }

    function m3u8loaded(response) {
        debuglog("m3u8loaded");
        if (typeof document.m3u8sub !== "undefined") {
            document.m3u8sub(response);
        }
        if (typeof document.m3u8audio !== "undefined") {
            document.m3u8audio(response);
        }
    }

    document.m3u8sub = function(response){
        var regexpm3u8 = /^#.{0,}GROUP-ID="sub-main".{0,}\.m3u8"$/gm;
        var regexpvtt = /^[\w-_\/]{0,}MAIN[\w-_\/]{0,}.vtt$/gm;
        var regexpvtt2 = /^[\w-_\/]{0,}.vtt$/gm;
        if(response.indexOf('#EXT-X-INDEPENDENT-SEGMENTS') > 0){
            var lines = response.match(regexpm3u8);
            lines.forEach(function(line) {
                var lang = linetoarray(line);
                lang.LOCALIZED = document.globalization.timedText.find(t => t.language === lang.LANGUAGE);
                document.langs.push(lang);
                debuglog("Sub found: " + lang.NAME);
            });
        } else if(response.indexOf('.vtt') > 0) {
            debuglog("vtt found");
            var lines = response.match(regexpvtt) || response.match(regexpvtt2);
            if(lines){
                lines.forEach(function(line) {
                    var url = document.baseurl;
                    var uri = document.langs[document.langid].URI;
                    url += uri.substring(0, 2);
                    if(line.indexOf("/") < 0){
                        url += uri.substring(2, uri.lastIndexOf("/") + 1);
                    }
                    url += line;
                    document.vttlist.push(url);
                });
            } else {
                alert("Unable to parse the m3u8 file, please report a bug for this video.");
            }
            if(document.vttlist.length > 0){
                getsegment();
            } else {
                alert("Unknown error, please report a bug for this video.");
            }
        }
    };

    function vttloaded(response) {
        debuglog("vttloaded");
        document.segments += response.substring(response.indexOf("-->") - 13);
        document.segid++;
        if(document.segid < document.vttlist.length){
            getsegment();
        } else if(document.segments.length > 0) {
            exportfile(vtttosrt(document.segments));
            document.segments = "";
            document.vttlist = [];
            document.segid = 0;
        } else {
            alert("Unknown error, please report a bug for this video.");
        }
    }

    function vtttosrt(vtt) {
        var lines = vtt.split(/\r\n|\r|\n/);
        var result = [];
        var subcount = 0;
        lines.forEach(function(line) {
            if(line.indexOf("-->") === 13) {
                subcount++;
                result.push(subcount);
                result.push(line.substring(0, 29).replace(/[.]/g, ','));
            } else if(subcount > 0) {
                result.push(line.replace(/<\/?c(\.\w{1,})?>/g, '').replace(/&amp;/g, '&'));
            }
        });
        return result.join('\r\n');
    }

    function linetoarray(line) {
        var result = [];
        var values = line.split(',');
        values.forEach(function(value) {
            var data = value.replace(/\r\n|\r|\n/g, '').split('=');
            if(data.length > 1) {
                var key = data[0];
                var content = data[1].replace(/"/g, '');
                result[key] = content;
            }
        });
        return result;
    }

    // 处理页面上其他元素（例如标题、集数等）
    function buttonhandle() {
        var buttons = document.getElementsByClassName("control-icon-btn");
        if(buttons.length > 0) {
            if (typeof document.clickhandlesub !== "undefined") {
                document.clickhandlesub();
            }
            if (typeof document.clickhandleaudio !== "undefined") {
                document.clickhandleaudio();
            }
            document.filename = document.getElementsByClassName("title-field")[0]?.innerText;
            if(document.getElementsByClassName("subtitle-field").length > 0) {
                document.episode = document.getElementsByClassName("subtitle-field")[0]?.innerText;
            }
        }
        if(document.oldlocation !== window.location.href && document.oldlocation !== null) {
            document.m3u8found = false;
            document.langs = [];
            document.audios = [];
        }
        document.oldlocation = window.location.href;
        // 每次检查时，重新为字幕选项添加下载按钮
        attachDownloadButtons();
    }

    // 为字幕选项添加下载按钮
    function attachDownloadButtons() {
        var picker = document.getElementsByClassName("options-picker subtitle-track-picker");
        if(picker && picker[0]) {
            // 遍历所有子元素（字幕选项）
            Array.from(picker[0].children).forEach(function(child) {
                // 如果该字幕选项内还未添加下载按钮，则创建
                if (!child.querySelector('.download-sub-btn')) {
                    var btn = document.createElement("span");
                    btn.className = "download-sub-btn";
                    // 使用 dataset 标记存储所属字幕名称（可根据实际 DOM 调整，此处假设语言名称在子节点中第二个元素中）
                    try {
                        btn.dataset.lang = child.childNodes[0].childNodes[1].innerHTML;
                    } catch(e) {
                        btn.dataset.lang = "";
                    }
                    btn.addEventListener("click", function(e) {
                        e.stopPropagation();
                        selectsubDownload(e, btn.dataset.lang);
                    }, false);
                    child.appendChild(btn);
                }
            });
        }
    }

    // 点击下载按钮后的处理函数
    function selectsubDownload(e, langName) {
        debuglog("selectsubDownload triggered for language: " + langName);
        if(langName === "Off") {
            // 如果选择的是“Off”，则下载所有字幕
            debuglog("Download all subs");
            document.zip = new JSZip();
            document.downloadall = true;
            document.downloadid = -1;
            downloadnext();
        } else {
            // 否则只下载当前选中的字幕
            document.downloadall = false;
            download(langName);
        }
        return false;
    }

    function downloadnext(){
        document.downloadid++;
        if(document.downloadid < document.langs.length){
            // 如果需要更新进度，可在此处调用 progress 更新函数
            download(document.langs[document.downloadid].NAME, false, false);
        } else {
            debuglog("Subs downloaded");
            clearInterval(document.downloadinterval);
            debuglog("Save zip");
            document.zip.generateAsync({type:"blob"}).then(function(content) {
                var output = document.filename;https://greasyfork.org/zh-CN/help/code-rules
                if(document.episode !== "") {
                    output += " - " + document.episode.replace(':','');
                }
                saveAs(content, output + ".zip");
            });
        }
    }

    function download(langname, withForced = true, localized = true) {
        if(!document.wait){
            debuglog("Download sub: " + langname);
            var language;
            var count = 0;
            document.forced = false;
            document.langs.forEach(function(lang) {
                if(lang.NAME === langname || (localized && lang.LOCALIZED && Object.values(lang.LOCALIZED.renditions).includes(langname) && lang.FORCED === "NO")) {
                    language = lang.LANGUAGE;
                    document.langid = count;
                    getpagecontent(m3u8loaded, document.baseurl + lang.URI);
                    document.wait = true;
                }
                count++;
            });
            if(withForced) {
                count = 0;
                document.langs.forEach(function(lang) {
                    if(lang.LANGUAGE === language && lang.NAME !== langname && lang.FORCED === "YES") {
                        document.waitsub = true;
                        document.waitInterval = setInterval(function () {
                            if(!document.wait) {
                                debuglog("Download forced: " + langname);
                                clearInterval(document.waitInterval);
                                document.langid = count;
                                getpagecontent(m3u8loaded, document.baseurl + lang.URI);
                                document.wait = true;
                            }
                        }, 10);
                    }
                    count++;
                });
            }
            if(count === 0){
                alert("An error has occurred, please reload the page.");
            }
        }
    }

    function getsegment() {
        debuglog("getsegment " + document.segid);
        getpagecontent(vttloaded, document.vttlist[document.segid]);
    }

    function exportfile(text) {
        debuglog("exportfile");
        var output = document.filename;
        if(document.episode !== "") {
            output += " - " + document.episode.replace(':','');
        }
        output += "." + document.langs[document.langid].LANGUAGE;
        if(document.langs[document.langid].FORCED === "YES") {
            output += ".forced";
            document.waitsub = false;
        }
        output += ".srt";
        if(document.downloadall){
            debuglog("Add to zip");
            document.zip.file(output, text);
            document.downloadinterval = setTimeout(function () {
                document.wait = false;
                if(!document.waitsub){
                    downloadnext();
                }
            },20);
        } else {
            debuglog("Save sub");
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:attachment/text,' + encodeURI(text).replace(/#/g, '%23');
            hiddenElement.target = '_blank';
            hiddenElement.download = output;
            hiddenElement.click();
            setTimeout(function () { document.wait = false; },50);
        }
    }

    function getpagecontent(callback, url) {
        debuglog("Downloading: " + url);
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.onloadend = function() {
            if(http.readyState === 4 && http.status === 200) {
                callback(http.responseText);
            } else if (http.status === 404) {
                debuglog("Not found");
                callback("");
            } else {
                debuglog("Unknown error, retrying");
                setTimeout(function () { getpagecontent(callback, url); }, 100);
            }
        };
        http.send();
    }

    String.prototype.lpad = function(padString, length) {
        var str = this;
        while (str.length < length) {
            str = padString + str;
        }
        return str;
    };
})(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);
