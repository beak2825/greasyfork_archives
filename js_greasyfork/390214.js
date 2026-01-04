// ==UserScript==
// @name         ニコ生立ち見開放コメビュ
// @namespace    https://greasyfork.org/ja/users/292779-kinako
// @version      1.5
// @description  立ち見に飛ばされても気分はアリーナ。簡易的なNG機能あり。
// @author       kinako
// @match        https://live2.nicovideo.jp/watch/*
// @grant        none
// @run-at       document-start
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/390214/%E3%83%8B%E3%82%B3%E7%94%9F%E7%AB%8B%E3%81%A1%E8%A6%8B%E9%96%8B%E6%94%BE%E3%82%B3%E3%83%A1%E3%83%93%E3%83%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/390214/%E3%83%8B%E3%82%B3%E7%94%9F%E7%AB%8B%E3%81%A1%E8%A6%8B%E9%96%8B%E6%94%BE%E3%82%B3%E3%83%A1%E3%83%93%E3%83%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class Controller
    {
        constructor(model)
        {
            this._model = model;
        }

        router(flag = null, data = null)
        {
            switch (flag)
            {
                case 'comment_post':
                    this._model.postComment(data);
                    break;
                case 'ng_comment_user':
                    this._model.addNgUser(data);
                    break;
                default:
                    this._model.openSocket();
                    break;
            }
        }
    }


    class Model
    {
        constructor()
        {
            this.ng_comment_users = [];
            this.ng_comment_keyword = new RegExp(
                '[まマ].*[こコ古].*[じジ事].*[きキ記]|' +
                '[mMｍＭ].*[aAａＡ].*[kKｋＫcCｃＣ].*[oOｏＯ].*[jJｊＪ].*[iIｉＩ].*[kKｋＫ].*[iIｉＩ]');

            this.liveOpenTime = null;
            this.liveId = null;
            this.commentAPI = null;
            this.defaultComment = null;
            this.isHook = null;
        }

        dispatchEvent(eventType, target, regArray=[])
        {
            if (target)
            {
                let result = false;
                for (const reg of regArray)
                {
                    switch (reg) {
                        case 'comment_user':
                            result = this.commentUserRegEx(target);
                            break;
                        case 'comment_keyword':
                            result = this.commentKeywordRegEx(target);
                            break;
                    }
                    if (result) break;
                }
                if (result)
                {
                    eventType += 'FilterMatched';
                }
                target.dispatchEvent(new Event(eventType, {"bubbles":true}));
            }
        }

        commentUserRegEx(target)
        {
            const data = JSON.parse(target.getAttribute('data'));
            return (this.ng_comment_users.includes(data.user_id))? true: false;
        }

        commentKeywordRegEx(target)
        {
            const data = JSON.parse(target.getAttribute('data'));
            return (this.ng_comment_keyword.test(data.content))? true: false;
        }

        addNgUser(data)
        {
            if (/\w+/.test(data)) this.ng_comment_users.push(data);
        }

        openSocket()
        {
            const programId = /lv[0-9]+/.exec(location.href);
            if (programId)
            {
                const xhr = new XMLHttpRequest();

                xhr.onreadystatechange = (e)=> {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            const res = JSON.parse(xhr.responseText);
                            //console.log(res);
                            this.liveOpenTime = Date.parse(res.data.onAirTime.beginAt) / 1000;
                            this.liveId = programId;
                            this.commentAPI = {messageServer: res.data.messageServer,
                                               threads: res.data.threads};

                            if (res.data.liveCycle == 'on_air')
                            {
                                document.addEventListener("DOMContentLoaded", (e)=>{
                                    this.dispatchEvent('commentDefault', document);
                                });
                                this.initComment();
                                window.WebSocket = new Proxy(WebSocket, this.openSocketHandler());
                            }
                        } else {
                            console.log("status = " + xhr.status);
                        }
                    }
                };
                // 番組情報取得
                xhr.open("GET", `https://api.cas.nicovideo.jp/v1/services/live/programs/${programId}`);
                xhr.withCredentials = true;
                xhr.send();
            }
        }

        openSocketHandler()
        {
            return {
                construct: function(target, args) {

                    const ws = new target(...args);

                    ws.onmessage = (e)=>{

                        if (Object.prototype.toString.call(e.data) == '[object String]') {
                            const data = JSON.parse(e.data);

                            if (data.ping && data.ping.content == 'rf:0') {
                                ws.close();

                            } else if (data.thread){
                                if (data.thread.resultcode !== 0) this.dispatchEvent('openSocketError', document);

                            } else if (data.chat) {
                                this.chatEvent(data.chat);
                            }
                        }
                    };

                    ws.onclose = (e)=> {
                        window.WebSocket = new Proxy(WebSocket,this.commentApiHandler());
                    };

                    //ws.onerror = function(e) {console.log(e);};
                    return ws;
                }.bind(this)
            }
        }

        commentApiHandler()
        {
            return {
                construct: function(target, args)
                {
                    const ms = this.commentAPI.messageServer;
                    const td = this.commentAPI.threads;

                    if (!this.isHook) {
                        this.isHook = true;

                        args = [ms.wss, "msg.nicovideo.jp#json"];
                        const ws = new target(...args);

                        ws.onopen = (e) =>
                        {
                            const req = [{ thread: { version:ms.version, thread:td.chat, service:ms.service }},
                                         { thread: { version:ms.version, thread:td.store, service:ms.service }}];
                            ws.send(JSON.stringify(req));
                            setInterval((e)=>{ws.send('')}, 50000);
                        };

                        ws.onmessage = (e)=> {
                            if (Object.prototype.toString.call(e.data) == '[object String]') {
                                const data = JSON.parse(e.data);

                                if (data.length == 2 && data[0].thread){
                                    if (data[0].thread.resultcode !== 0) this.dispatchEvent('commentApiError', document);

                                } else if (data.chat) {
                                    this.chatEvent(data.chat);
                                }
                            }
                        };
                        //ws.onerror = function(e) {console.log('error', e);};
                        //ws.onclose = function(e) {console.log('close', e)};
                    }
                }.bind(this)
            };
        }

        chatEvent(data)
        {
            const chatData = {no:data.no, content:data.content,
                              user_id:data.user_id, premium:data.premium };
            const chatContainer = document.getElementById('commentdata');
            chatContainer.setAttribute('data', JSON.stringify(chatData));
            this.dispatchEvent('chat', chatContainer, ['comment_user', 'comment_keyword']);
        }

        initComment()
        {
            const mo_option = {childList: true, subtree: true},
                  mo = new MutationObserver((mr, mo)=>{
                // 通信エラーダイアログ
                const button = document.querySelector('div[class^="___dialog-layer-old___"] div[class^="___body___"] button');
                if (button){
                    mo.disconnect();
                    button.click();
                }
                // 部屋名
                const room = document.querySelector('p[class^="___room-name___"]:not([loaded])');
                if (room && !/\-|(co|ch)[0-9]+|アリーナ($|[\s　]?最前列)/.test(room.textContent)) {
                    room.setAttribute('loaded', '');
                    this.dispatchEvent('roomName', room);
                }
            });
            mo.observe(document, mo_option);

            let mo2 = new MutationObserver((mr2, mo2)=>{
                const parent = document.querySelector('div[id^="root"]');
                if (parent)
                {
                    mo2.disconnect();
                    mo2 = new MutationObserver((_mr, _mo)=>{
                        for (const r of _mr)
                        {
                            if (/^___leo-player___/.test(r.target.className) && r.addedNodes.length > 0
                                && /^___player-status___/.test(r.addedNodes[0].className))
                            {
                                this.dispatchEvent('chatVisibley', document);
                            }
                        }
                    });
                    mo2.observe(parent, mo_option);
                }
            });
            mo2.observe(document, mo_option);
        }

        postComment(data)
        {
            if (data.message)
            {
                let cmmd = (data.command.length== 0)? []: data.command.split(' ');
                if (data.anonymous) cmmd.unshift('184');
                cmmd = cmmd.join(' ');

                const vpos = (Math.floor(new Date().getTime() / 1000) - this.liveOpenTime) * 100;

                const xhr = new XMLHttpRequest();
                const req = {
                    message: data.message,
                    command: cmmd,
                    vpos: vpos
                };
                //console.log(req);

                xhr.open('POST', `https://api.cas.nicovideo.jp/v1/services/live/programs/${this.liveId}/comments`);
                xhr.withCredentials = true;
                xhr.setRequestHeader('Content-type', 'application/json');
                xhr.send(JSON.stringify(req));

                xhr.onreadystatechange = (e)=> {
                    if(xhr.readyState === 4 && xhr.status === 200)
                    {
                        this.dispatchEvent('commentPosted', document.querySelector('form[class^="___comment-post-form___"]'));

                    } else if(xhr.status !== 200){
                        console.log("status = " +xhr.status);
                    }
                }
            }
        }
    }


    class View
    {
        constructor(controller)
        {
            this._controller = controller;
            this.css_prefix = 'sacv';

            this.setStyle();
            this.comment();
        }

        setStyle()
        {
            let css = document.createElement('style')
            let rule = document.createTextNode(`
#show-all-comment-outer {
    height:100%;
    overflow-y: auto;
}
#show-all-comment-viewer {
    margin: 0px;
    padding: 0 0 0 1em;
    display: table;
    list-style: none;
}
#show-all-comment-viewer li {
    margin-top: 1em;
}
#show-all-comment-viewer .number {
    display: table-cell;
    vertical-align: middle;
    color: #b1b1b1;
    font-size: smaller;
}
#show-all-comment-viewer .content,
#show-all-comment-viewer .nh-content
{
    display: table-cell;
    padding-left:1em;
    word-break: break-all;
}
#show-all-comment-viewer .nh-content {
    padding-left:0em;
}

#show-all-comment-viewer span[class$="-icon"] {
    color: #fff;
    text-decoration: none;
    margin-right: 1em;
    border-radius: 4px;
    padding: 0 0.3em;
    font-size: 0.8em;
}
#show-all-comment-viewer .nicoad {
    color: #d0bda0;
}
#show-all-comment-viewer .nicoad-icon {
    background-color: #d0bda0;
    padding: 0 0.5em !important;
}
#show-all-comment-viewer .quote {
    color: #76a5ce;
}
#show-all-comment-viewer .quote-icon {
    background-color: #76a5ce;
}
#show-all-comment-viewer .cruise {
    color: #76a5ce;
}
#show-all-comment-viewer .cruise-icon {
    background-color: #76a5ce;
}
#show-all-comment-viewer .info {
    color: #96C79A;
}
#show-all-comment-viewer .info-icon {
    background-color: #96C79A;
}
#show-all-comment-viewer .spi {
    color: #002856;
}
#show-all-comment-viewer .spi-icon {
    background-color: #002856;
}

#show-all-comment-viewer .author {
    color: #e40074;
}
#show-all-comment-viewer .author-icon {
    background-color: #e40074;
}
#show-all-comment-viewer .gift {
    color: #002bff;
}
#show-all-comment-viewer .gift-icon {
    background-color: #002bff;
}

/* コメントリンク */
a.${this.css_prefix}-comment-url{
    background-color: #3194da;
    border-radius: 5px;
    color: #fff;
    width: 3em;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    margin-left: 0.5em;
}
a.${this.css_prefix}-comment-url:hover {
    background-color: #000;
}
#${this.css_prefix}-error {
    color: #fff;
    text-align: center;
    background-color: #a71846;
}
`);
            css.media = 'screen';
            css.type = 'text/css';
            if (css.styleSheet) {
                css.styleSheet.cssText = rule.nodeValue;
            } else {
                css.appendChild(rule);
            };
            document.getElementsByTagName('head')[0].appendChild(css);
        }

        comment()
        {
            document.addEventListener('roomName', (e)=>{
                e.target.textContent = `＼${e.target.textContent}開放中／`;
            });

            document.addEventListener('commentDefault', (e)=>{
                // 184状態
                let anonymousToggle = document.querySelector('div[class^="___anonymous-comment-post-toggle-button-field____"] button');
                let anonymous;
                if (!anonymousToggle)
                {
                    const setiingButton = document.querySelector('button[class^="___setting-button___"]');
                    setiingButton.click();
                    setiingButton.click();
                    anonymousToggle = document.querySelector('div[class^="___anonymous-comment-post-toggle-button-field____"] button');
                }

                // コメント投稿
                const commentButton = document.querySelector('form[class^="___comment-post-form___"] button');
                commentButton.addEventListener('click', (_e)=> {
                    const data = {command:_e.target.parentNode.querySelector('input[class^="___command-text-box___"]').value,
                                  message:_e.target.parentNode.querySelector('input[class^="___comment-text-box___"]').value,
                                  anonymous: (anonymousToggle.getAttribute('data-toggle-state') == 'true')? true: false
                                 };
                    this._controller.router('comment_post', data);
                });

                // リロードボタン
                const reloadButton = document.querySelector('button[class^="___reload-button___"]');
                reloadButton.addEventListener('click', (_e)=> {
                    location.reload();
                });

                // デフォルトコメント非表示
                const parent = document.querySelector('div[class^="___comment-data-grid___"]')
                parent.querySelector('div[class^="___body___"]').style.display = 'none';
                // 新規コメビュ用
                const outer = document.createElement('div');
                outer.id = 'show-all-comment-outer';
                const viewer = document.createElement('ul');
                viewer.id = 'show-all-comment-viewer';
                outer.appendChild(viewer);
                parent.appendChild(outer);

                const chat = document.createElement('script');
                chat.id = 'commentdata';
                document.body.appendChild(chat);

                // 詳細設定画面を表示時に退避
                const settingButton = document.querySelector('button[class^="___detail-setting-button___"]');
                settingButton.addEventListener('click', (e)=>{
                    outer.style.display = 'none';
                    document.body.appendChild(outer);
                });

                // フルスクリーン時に退避
                const fullScreenButton = document.querySelector('button[class^="___fullscreen-button___"]');
                fullScreenButton.addEventListener('click', (e)=>{
                    if (outer.parentNode.localName !== 'body')
                    {
                        outer.style.display = 'none';
                        document.body.appendChild(outer);
                    }
                });
            });

            document.addEventListener('commentPosted', (e)=>{
                e.target.parentNode.querySelector('input[class^="___command-text-box___"]').value = '';
                e.target.parentNode.querySelector('input[class^="___comment-text-box___"]').value = '';
            });

            document.addEventListener('chat', (e)=>{
                const data = JSON.parse(e.target.getAttribute('data'));

                if (this.ignoreCommand(data)) return;

                const parent = document.getElementById('show-all-comment-viewer'),
                      li = document.createElement('li'),
                      head = document.createElement('span'),
                      content = document.createElement('span');

                li.setAttribute('user', data.user_id);

                const uc = this.convertCommand(data);
                if(uc) {
                    head.setAttribute('class', uc.class+'-icon');
                    head.textContent = uc.icon;
                    content.setAttribute('class', uc.class);
                    content.textContent = uc.message;

                    li.appendChild(head);
                } else {
                    head.setAttribute('class', 'number');
                    head.textContent = data.no;
                    content.setAttribute('class', 'content');
                    content.textContent = data.content;

                    if (head.textContent !== '') {
                        this.setNgEvent(head);
                        li.appendChild(head);
                    } else {
                        content.setAttribute('class', 'nh-content');
                        this.setNgEvent(content);
                    }
                }
                this.link(content);
                li.appendChild(content);
                parent.appendChild(li);

                const limit = 50;
                if (parent.children.length > limit) {
                    const count = parent.children.length;
                    for (let i = 0; i < count-limit; i++)
                    {
                        parent.children[i].remove();
                    }
                }

                const root = parent.parentNode;
                const rCR = root.getBoundingClientRect();
                const over = parent.querySelector('span[over]');
                //最後の子要素の一つ手前
                if (parent.lastElementChild.previousElementSibling && !over)
                {
                    const lCR = parent.lastElementChild.previousElementSibling.getBoundingClientRect();
                    if(lCR.bottom < rCR.bottom) root.scrollTop =root.scrollHeight;
                }
            });

            document.addEventListener('chatFilterMatched', (e)=>{
            });

            document.addEventListener('chatVisibley', (e)=>{
                const parent = document.querySelector('div[class^="___comment-data-grid___"]');
                if (!parent.querySelector('#show-all-comment-outer'))
                {
                    parent.querySelector('div[class^="___body___"]').style.display = 'none';

                    const outer = document.getElementById('show-all-comment-outer');
                    outer.removeAttribute('style');
                    parent.appendChild(outer);
                    outer.scrollTop = outer.scrollHeight;
                }
            });

            document.addEventListener('openSocketError', (e)=>{
                const outer = document.getElementById('show-all-comment-outer'),
                      parent = document.querySelector('#show-all-comment-viewer'),
                      error = document.createElement('li');
                error.textContent = '⚠ 初期コメントサーバーエラー';
                error.id = `${this.css_prefix}-error`;
                parent.appendChild(error);
                outer.scrollTop = outer.scrollHeight;
            });

            document.addEventListener('commentApiError', (e)=>{
                const outer = document.getElementById('show-all-comment-outer'),
                      parent = document.querySelector('#show-all-comment-viewer'),
                      error = document.createElement('li');
                error.textContent = '⚠ コメントAPIサーバーエラー';
                error.id = `${this.css_prefix}-error`;
                parent.appendChild(error);
                outer.scrollTop = outer.scrollHeight;
            });
        }

        setNgEvent(node)
        {
            node.addEventListener('click', (e)=>{
                const user = e.target.parentNode.getAttribute('user');
                this._controller.router('ng_comment_user', user);

                const result = document.querySelectorAll(`#show-all-comment-viewer li[user="${user}"]`);
                for (const r of result) r.remove();
            });

            node.addEventListener('mouseover', (e)=>{
                e.target.setAttribute('over', '');
                const user = e.target.parentNode.getAttribute('user');
                const className = e.target.getAttribute('class');
                const result = document.querySelectorAll(`#show-all-comment-viewer li[user="${user}"] span[class="${className}"]`);
                for (const r of result)
                {
                    r.style.backgroundColor = '#B3B3B3';
                    r.style.borderRadius = '4px';
                    r.style.color = '#fff';
                }
            });

            node.addEventListener('mouseout', (e)=>{
                e.target.removeAttribute('over');
                const user = e.target.parentNode.getAttribute('user');
                const className = e.target.getAttribute('class');
                const result = document.querySelectorAll(`#show-all-comment-viewer li[user="${user}"] span[class="${className}"]`);
                for (const r of result) r.removeAttribute('style');
            });
        }

        ignoreCommand(data)
        {
            return (/^\/(uadpoint|hb|coe|clear)\s?/.test(data.content))? true: false;
        }

        convertCommand(data)
        {
            const text = data.content
            let match = /\/(nicoad|quote|cruise|info|spi|gift|perm) (.*)/.exec(text);
            const messageTrim = (str)=>{return str.replace(/^"|"$/g, '')};
            let result;
            if (match) {
                switch (match[1])
                {
                    case 'nicoad':
                        result = {class:'nicoad', message:JSON.parse(match[2]).message, icon:'広告'};
                        break;
                    case 'gift':
                        match = match[2].split(' ');
                        match = {name: messageTrim(match[2])+'さん',
                                 point: match[3]+'pt',
                                 gift: messageTrim(match[5])};
                        match = `${match.gift}(${match.point}) by${match.name}`;
                        result = {class:'gift', message:match, icon:'ギフト'};
                        break;
                    case 'quote':
                        match = messageTrim(match[2]).replace('（生放送クルーズさんの番組）', '');
                        result = {class:'quote', message:match, icon:'クルーズ'};
                        break;
                    case 'cruise':
                        result = {class:'cruise', message:messageTrim(match[2]), icon:'クルーズ'};
                        break;
                    case 'info':
                        result = {class:'info', message:match[2].replace(/[0-9]+ /, ''), icon:'運コメ'};
                        break;

                    case 'spi':
                        result = {class:'spi', message:messageTrim(match[2]), icon:'アイテム'};
                        break;

                    case 'perm':
                        result = {class:'author', message:match[2], icon:'主コメ'};
                        break;

                    default:
                        break;
                }
            } else if (data.premium == 3) {
                result = {class:'author', message:text, icon:'主コメ'};
            }
            return result;
        }

        link(node)
        {
            const pttn = /http(s)?:\/\/(([\w-]+\.)+)([\w-]+)(\/[\w-./?%&=#]*)?/;
            const link = pttn.exec(node.textContent);
            if (link)
            {
                node.innerHTML += `<a href="${new URL(link[0])}" target="_blank" class="${this.css_prefix}-comment-url">開く</a>`;
            }
        }
    }


    const model = new Model();
    const con = new Controller(model);
    const view = new View(con);
    con.router();


})();