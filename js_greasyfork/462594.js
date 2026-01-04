// ==UserScript==
// @name         Steam Review Edit-tools
// @namespace    https://github.com/sffxzzp
// @version      1.0
// @description  Add edit tools to steam review.
// @author       sffxzzp/修改
// @match        *://store.steampowered.com/app/*
// @match        *://steamcommunity.com/*/recommended/*
// @icon         https://store.steampowered.com/favicon.ico
// @connect      steamcommunity.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/462594/Steam%20Review%20Edit-tools.user.js
// @updateURL https://update.greasyfork.org/scripts/462594/Steam%20Review%20Edit-tools.meta.js
// ==/UserScript==

(function() {
    var util = (function () {
        function util() {}
        util.xhr = function (xhrData) {
            return new Promise(function(resolve, reject) {
                if (!xhrData.xhr) {
                    GM_xmlhttpRequest({
                        method: xhrData.method || "get",
                        url: xhrData.url,
                        data: xhrData.data,
                        headers: xhrData.headers || {},
                        responseType: xhrData.type || "",
                        timeout: 3e5,
                        onload: function onload(res) {
                            return resolve({ response: res, body: res.response });
                        },
                        onerror: reject,
                        ontimeout: reject
                    });
                } else {
                    var xhr = new XMLHttpRequest();
                    xhr.open(xhrData.method || "get", xhrData.url, true);
                    if (xhrData.method === "post") {xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded; charset=utf-8");}
                    if (xhrData.cookie) {xhr.withCredentials = true;}
                    xhr.responseType = xhrData.type || "";
                    xhr.timeout = 3e5;
                    if (xhrData.headers) {for (var k in xhrData.headers) {xhr.setRequestHeader(k, xhrData.headers[k]);}}
                    xhr.onload = function(ev) {
                        var evt = ev.target;
                        resolve({ response: evt, body: evt.response });
                    };
                    xhr.onerror = reject;
                    xhr.ontimeout = reject;
                    xhr.send(xhrData.data);
                }
            });
        };
        util.createElement = function (data) {
            var node;
            if (data.node) {
                node = document.createElement(data.node);
                if (data.content) {this.setElement({node: node, content: data.content});}
                if (data.html) {node.innerHTML = data.html;}
            }
            return node;
        };
        util.setElement = function (data) {
            if (data.node) {
                for (let name in data.content) {data.node.setAttribute(name, data.content[name]);}
                if (data.html!=undefined) {data.node.innerHTML = data.html;}
            }
        };
        return util;
    })();
    var sre = (function () {
        var sre = function () {};
        sre.prototype.run = async function () {
            if (location.href.match('steamcommunity.com')) {
                localStorage.setItem('sre_sessionID', unsafeWindow.g_sessionID);
                this.addButtons(true);
            }
            if (location.href.match('store.steampowered.com')) {
                var commPage = await util.xhr({url: 'https://steamcommunity.com/'});
                var commData = (new DOMParser()).parseFromString(commPage.body, 'text/html');
                var commSessionRegExp = /g_sessionID = "(.*?)";/g;
                var commSessionID = commSessionRegExp.exec(commData.querySelector('.responsive_page_content > script').innerHTML);
                if (commSessionID.length > 1) {
                    localStorage.setItem('sre_sessionID', commSessionID[1]);
                    this.addStyles();
                    this.addButtons(false);
                }
                else {
                    alert('未登录社区');
                }
            }
        };
        sre.prototype.addStyles = function () {
            GM_addStyle('#preview_body .bb_ul > li, #preview_body ol {list-style-position: inside}');
        };
        sre.prototype.wrapURL = function (inputBox, start, end) {
            this.wrapSelection(inputBox, start, end);
        };
        sre.prototype.wrapList = function (inputBox, start, end, item) {
            var txtStart = inputBox.value.substring(0, inputBox.selectionStart);
            var txtEnd = inputBox.value.substring(inputBox.selectionEnd, inputBox.value.length);
            var selText = inputBox.value.substring(inputBox.selectionStart, inputBox.selectionEnd);
            selText = '\n' + item + selText.split('\n').join('\n' + item) + '\n';
            inputBox.value = txtStart + start + selText + end + txtEnd;
        };
        sre.prototype.wrapSelection = function (inputBox, start, end) {
            var txtStart = inputBox.value.substring(0, inputBox.selectionStart);
            var txtEnd = inputBox.value.substring(inputBox.selectionEnd, inputBox.value.length);
            var selText = inputBox.value.substring(inputBox.selectionStart, inputBox.selectionEnd);
            inputBox.value = txtStart + start + selText + end + txtEnd;
        };
        sre.prototype.addButtons = function (community) {
            var _this = this;
            var target, inputBox, targetCtl, previewBox;
            if (community == true) {
                target = document.querySelector('#ReviewEdit');
                inputBox = target.querySelector('#ReviewEditTextArea');
                targetCtl = target.querySelector('.review_edit_received_compensation');
                previewBox = util.createElement({node: 'div', content: {id: 'preview_body', class: 'body_text', style: 'padding: 10px; background-color: #222b35;'}});
            }
            else {
                target = document.querySelector('#review_container .content');
                inputBox = target.querySelector('#game_recommendation');
                targetCtl = target.querySelector('.controls');
                previewBox = util.createElement({node: 'div', content: {id: 'preview_body', class: 'body_text', style: 'padding: 10px; background-color: #222b35; margin-right: 7px;'}});
            }
            target.insertBefore(previewBox, targetCtl);

            //粗体文本按钮
            var ctrlBar = util.createElement({node: 'div', content: {class: 'editGuideSubSectionControls', style: 'padding: 3px;'}});
            var boldBtn = util.createElement({node: 'a', content: {class: 'btn_grey_black btn_small_thin', style: 'margin: 1px;'}, html: '<span><img src="https://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_bold.png"></span>'});
            boldBtn.onclick = function () {
                _this.wrapSelection(inputBox, '[b]', '[/b]');
            };
            ctrlBar.appendChild(boldBtn);
            //下划线文本按钮
            var uLineBtn = util.createElement({node: 'a', content: {class: 'btn_grey_black btn_small_thin', style: 'margin: 1px;'}, html: '<span><img src="https://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_underline.png"></span>'});
            uLineBtn.onclick = function () {
                _this.wrapSelection(inputBox, '[u]', '[/u]');
            };
            ctrlBar.appendChild(uLineBtn);
            //斜体文本按钮
            var italicBtn = util.createElement({node: 'a', content: {class: 'btn_grey_black btn_small_thin', style: 'margin: 1px;'}, html: '<span><img src="https://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_italic.png"></span>'});
            italicBtn.onclick = function () {
                _this.wrapSelection(inputBox, '[i]', '[/i]');
            };
            ctrlBar.appendChild(italicBtn);
            //删除文本按钮
            var strikeBtn = util.createElement({node: 'a', content: {class: 'btn_grey_black btn_small_thin', style: 'margin: 1px;'}, html: '<span><img src="https://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_strike.png"></span>'});
            strikeBtn.onclick = function () {
                _this.wrapSelection(inputBox, '[strike]', '[/strike]');
            };
            ctrlBar.appendChild(strikeBtn);
            //网站链接按钮
            var urlBtn = util.createElement({node: 'a', content: {class: 'btn_grey_black btn_small_thin', style: 'margin: 1px;'}, html: '<span><img src="https://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_link.png"></span>'});
            urlBtn.onclick = function () {
                _this.wrapURL(inputBox, '[url=]', '[/url]');
            };
            ctrlBar.appendChild(urlBtn);
            //项目符号列表按钮
            var listBtn = util.createElement({node: 'a', content: {class: 'btn_grey_black btn_small_thin', style: 'margin: 1px;'}, html: '<span><img src="https://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_bullet.png"></span>'});
            listBtn.onclick = function () {
                _this.wrapList(inputBox, '[list]', '[/list]', '[*] ');
            };
            ctrlBar.appendChild(listBtn);
            //标题文字按钮
            var h1Btn = util.createElement({node: 'a', content: {class: 'btn_grey_black btn_small_thin', style: 'margin: 1px;'}, html: '<span><img src="https://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_header1.png"></span>'});
            h1Btn.onclick = function () {
                _this.wrapSelection(inputBox, '[h1]', '[/h1]');
            };
            ctrlBar.appendChild(h1Btn);
            //隐藏文本按钮
            var spoilerBtn = util.createElement({node: 'a', content: {class: 'btn_grey_black btn_small_thin', style: 'margin: 1px;'}, html: '<span><img Style="max-width: 16px;" src="https://keylol.com/static/image/common/bb_spoiler_v2.png"></span>'});
            spoilerBtn.onclick = function () {
                _this.wrapSelection(inputBox, '[spoiler]', '[/spoiler]');
            };
            ctrlBar.appendChild(spoilerBtn);
            //渲染水平分隔线按钮
            var horizontalruleBtn = util.createElement({node: 'a', content: {class: 'btn_grey_black btn_small_thin', style: 'margin: 1px;'}, html: '<span><img src="https://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_header1.png"></span>'});
            horizontalruleBtn.onclick = function () {
                _this.wrapSelection(inputBox, '[hr]', '[/hr]');
            };
            ctrlBar.appendChild(horizontalruleBtn);
            //鉴赏家按钮
            var curatorBtn = util.createElement({node: 'a', content: {class: 'btn_grey_black btn_small_thin', style: 'margin: 1px;'}, html: '<span><img Style="max-width: 16px;" src="https://avatars.akamai.steamstatic.com/ae9b2056b5e595e2c104de57d8c674d832a94b50_full.jpg"/></span>'});
            curatorBtn.onclick = function () {
                _this.wrapSelection(inputBox, '[quote=] [td][b]关注我们 [/b][url=https://store.steampowered.com/curator/30253125]甄游组[/url] [url=https://store.steampowered.com/curator/34433893]第一印象[/url] [url=https://store.steampowered.com/curator/40602490]免费游戏[/url][/td] ','[/quote]');
            };
            ctrlBar.appendChild(curatorBtn);

            var helpBtn = util.createElement({node: 'a', content: {class: 'btn_grey_black btn_small_thin', style: 'margin: 1px;', href: 'javascript:void(0);', onclick: `window.open( 'https://steamcommunity.com/comment/Recommendation/formattinghelp','formattinghelp','height=640,width=640,resize=yes,scrollbars=yes' );`}, html: '<span>格式帮助</span>'});
            ctrlBar.appendChild(helpBtn);
            var mright;
            if (community == true) { mright = ''; } else { mright = 'margin-right: 7px;'; }
            var previewBtn = util.createElement({node: 'a', content: {class: 'btn_grey_black btn_small_thin', style: `margin: 1px; ${mright} float: right;`}, html: '<span>预览</span>'});
            previewBtn.onclick = async function () {
                var commSessionID = localStorage.getItem('sre_sessionID');
                var previewData = await util.xhr({url: 'https://steamcommunity.com/groups/keylol-player-club/announcements/preview', method: 'post', type: 'json', data: `sessionID=${commSessionID}&action=preview&headline=&body=${inputBox.value}`, headers: {"content-type": "application/x-www-form-urlencoded; charset=utf-8"}});
                previewData = previewData.body.body;
                previewBox.innerHTML = previewData;
            };
            ctrlBar.appendChild(previewBtn);
            target.insertBefore(ctrlBar, inputBox);
        };
        return sre;
    })();
    var s = new sre();
    s.run();
})();
