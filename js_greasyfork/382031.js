// ==UserScript==
// @name         NicoLiveCleaner
// @namespace    https://greasyfork.org/ja/users/292779-kinako
// @version      1.37
// @description  ニコニコ生放送上の特定生主やゲームなどのアイテム欄をワンクリックで非表示にし、クリーンなニコ生を目指すスクリプト。NGワード(正規表現)でも可能。
// @author       kinako
// @include      http*://live.nicovideo.jp/*
// @include      http*://live2.nicovideo.jp/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @run-at       document-start
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/382031/NicoLiveCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/382031/NicoLiveCleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
　　　　　　汚 (　ヾﾊﾊﾍ
　　　　　　物 (　 |Ｗ/ﾍﾍ
　　　　　　は (　 |‖//ﾍﾍ
　　　　　　消 (　 ﾊ‖ｲ///彡
　　　　　　毒 (　/丶／￣＼ﾐ
　　　　　　だ ( /ヘ　／￣‖ﾐ
　　　　　　｜ ( ﾚ= ￣ =､ ‖ﾐﾐ
　　　　　　｜ ( Y三八三＞=ﾍﾐﾐ
　　　　　　!! (〈　L_ｿ　〉ﾉミﾐ､
　　　　　　⌒⌒　Y 戸弌 i｜＼ﾐﾐ
　　　　　　　＿＿i kｪｪﾉ ／ ／／
　　　　　　／　 /`ー―イ ／／
　　　　　　ﾋ_(王)二二二二(王)ノ
　　　　　　L_|_‖　　/　 | ‖￣
　　　　　　彡彡＼＼ ｜　 |o‖
　　　　　　彡彡彡L｜｜　 |o‖
　　　　　　彡彡／／ｰ仝ー-ヽ／￣
　　　　　　|ｲ二‾＼＿＿＿＿/　／
　　　　　　|i二　｜　　　｜ ｜.
　　　　　　丶て＿ム＿＿＿｜ ｜.
　　*/

    class Controller
    {
        constructor(model)
        {
            this._model = model;
            GM_registerMenuCommand('設定', this._model.settings.bind(model));
        }

        router(flag = null, data = null)
        {
            switch (flag)
            {
                case 'add_number':
                    this._model.setData('ng_numbers', data);
                    break;
                case 'delete_number':
                    this._model.deleteData('ng_numbers', data);
                    break;

                case 'update_ngkeywords':
                    this._model.setRegData('ng_keywords', data);
                    break;

                case 'update_ngitems':
                    this._model.setRegData('ng_items', data);
                    break;
                case 'add_ngitem':
                    this._model.setData('ng_items', data);
                    break;

                case 'update_settings':
                    this._model.setObjData('settings_data', data);
                    break;

                case 'display_modal':
                    this._model.settings();
                    break;

                default:
                    this.pageManeger()
                    break;
            }
        }

        pageManeger()
        {
            // トップページ
            if (location.href.match(/http(s)*:\/\/live\.nicovideo\.jp(\/\?header|\/)$/))
            {
                this._model.topPage();
                // 注目番組一覧ページ
            } else if(location.href.match(/http(s)*:\/\/live2\.nicovideo\.jp\/focus$/)) {
                this._model.focusPage();
                // 番組一覧ページ
            } else if (location.href.match(/http(s)*:\/\/live\.nicovideo\.jp\/recent\?.*/)) {
                this._model.listPage();
                // 検索ページ
            } else if (location.href.match(/http(s)*:\/\/live\.nicovideo\.jp\/search\?.*/)) {
                this._model.searchPage();
                // 旧ライブページ＆放送終了後ページ
            //} else if (location.href.match(/http(s)*:\/\/live\.nicovideo\.jp\/(watch|gate)\/lv.*/)) {
            //    this._model.liveEndPage();
                // ニコ生html5ライブページ
            } else if (location.href.match(/http(s)*:\/\/live\.nicovideo\.jp\/watch\/lv.*/)) {
                this._model.livePage();
                // ニコ生ランキングページ
            } else if (location.href.match(/http(s)*:\/\/live\.nicovideo\.jp\/ranking.*/)) {
                this._model.rankingPage();
                // ニコ生番組表ページ
            } else if (location.href.match(/http(s)*:\/\/live\.nicovideo\.jp\/timetable.*/)) {
                this._model.timeTablePage();
            }
        }
    }


    class Model
    {
        constructor()
        {
            this.ng_keywords = null;
            this.ng_numbers = null;
            this.ng_items = null;
            this.settings_data = {debug:false};

            this.initializePattern('ng_keywords',null,null,null,null);
            GM_addValueChangeListener('ng_keywords', this.initializePattern.bind(this));

            this.initializePattern('ng_numbers',null,null,null,null);
            GM_addValueChangeListener('ng_numbers', this.initializePattern.bind(this));

            this.initializePattern('ng_items',null,null,null,null);
            GM_addValueChangeListener('ng_items', this.initializePattern.bind(this));

            this.initializePattern('settings_data',null,null,null,null);
            GM_addValueChangeListener('settings_data', this.initializePattern.bind(this));
        }

        initializePattern(name, old_val, new_val, remote)
        {
            const ls = this.getLocalStorage(name);
            if (ls && (ls.length > 0 || Object.keys(ls).length > 0))
            {
                const pattern = function(ls){
                    return (ls.length == 0)? null: new RegExp(ls.filter((str)=>{return (str !== '')}).join('|'));
                };
                switch (name)
                {
                    case 'ng_keywords':
                        this.ng_keywords = pattern(ls);
                        break;
                    case 'ng_items':
                        this.ng_items = pattern(ls);
                        break;
                    case 'ng_numbers':
                        this.ng_numbers = new RegExp(
                            ls.filter((str)=>{
                                return (str !== '')
                            }).map((str)=>{
                                return '/'+ str + '(\\.|"|\\/)'
                            }).join('|')
                        );
                        break;
                    case 'settings_data':
                        this.settings_data = ls;
                        break;
                }
            }
        }

        convertPattern(name)
        {
            const ls = this.getLocalStorage(name);
            if (ls)
            {
                return ls.join('\n');
            } else {
                return '';
            }
        }

        setData(key, data)
        {
            let ls = this.getLocalStorage(key);
            if (ls) {
                if (!ls.includes(data))
                {
                    ls.push(data);
                    this.setLocalStorage(key, ls);
                }
            } else {
                this.setLocalStorage(key, [data]);
            }
        }

        setObjData(key, obj)
        {
            let ls = this.getLocalStorage(key);
            const obj_key = (Object.keys(obj).length == 1)? Object.keys(obj)[0]: null;
            if (obj_key)
            {
                if (ls)
                {
                    ls[obj_key] = obj[obj_key];
                    this.setLocalStorage(key, ls);
                } else {
                    this.setLocalStorage(key, obj);
                }
            }
        }

        setRegData(key, data)
        {
            data = data.trim().split('\n');
            data = data.filter(function(str) {
                if (str !== "" || str !== undefined) return str;
            });
            this.setLocalStorage(key, data);
        }

        deleteData(key, data)
        {
            let ls = this.getLocalStorage(key);
            if (ls)
            {
                let newArray = ls.filter(n => n !== data);
                this.setLocalStorage(key, newArray);
            }

        }

        clearData(key){ GM_deleteValue(key); }

        getLocalStorage(key)
        {
            let ls = GM_getValue(key);
            if (ls)
            {
                //return (!Array.isArray(ls))? JSON.parse(ls): ls;
                return this.checkArray(ls);
            }
            return null;
        }

        checkArray(data)
        {
            if (
                (!Array.isArray(data) && Object.prototype.toString.call(data) !== '[object Object]')
               || (Object.prototype.toString.call(data) == '[object String]' && /\[.*\]/.test(data))
            )
            {
                return this.checkArray(JSON.parse(data));
            } else {
                return data;
            }
        }

        setLocalStorage(key,data){
            GM_setValue(key, JSON.stringify(data));
        }

        ngRegEx(target)
        {
            return (this.numbersRegEx(target))? true: this.keywordsRegEx(target);
        }

        numbersRegEx(target)
        {
            if(this.ng_numbers && this.ng_numbers.test(target.outerHTML))
            {
                return true;
            }
            return false;
        }

        keywordsRegEx(target)
        {
            if(this.ng_keywords && this.ng_keywords.test(target.outerHTML))
            {
                return true;
            }
            return false;
        }

        itemsRegEx(target)
        {
            if(this.ng_items && this.ng_items.test(target.outerHTML))
            {
                return true;
            }
            return false;
        }

        dispatchEvent(eventType, target, regArray=[])
        {
            if (target)
            {
                let result = false;
                for (const reg of regArray)
                {
                    switch (reg) {
                        case 'number':
                            result = (this.numbersRegEx(target))? true: false;
                            break;
                        case 'keyword':
                            result = (this.keywordsRegEx(target))? true: false;
                            break;
                        case 'item':
                            result = (this.itemsRegEx(target))? true: false;
                            break;
                    }
                    if (result) break;
                }
                //if (this.ngRegEx(target) || regArray.includes(true))
                if (result)
                {
                    eventType += 'FilterMatched';
                }
                if (this.settings_data.debug)
                {
                     eventType += 'Debug';
                }
                //console.log(eventType, target)
                target.dispatchEvent(new Event(eventType, {"bubbles":true}));
            }
        }

        settings()
        {
            const ng_numbers = document.createTextNode( JSON.stringify(this.getLocalStorage('ng_numbers')) );
            const ng_keywords = document.createTextNode( JSON.stringify(this.convertPattern('ng_keywords')) );
            const ng_items = document.createTextNode( JSON.stringify(this.convertPattern('ng_items')) );
            const others = document.createTextNode( JSON.stringify(this.settings_data) );

            document.body.appendChild(ng_numbers);
            ng_numbers.dispatchEvent(new Event('ngNumbersSettingLoaded', {"bubbles":true}));

            document.body.appendChild(ng_keywords);
            ng_keywords.dispatchEvent(new Event('ngKeywordsSettingLoaded', {"bubbles":true}));

            document.body.appendChild(ng_items);
            ng_items.dispatchEvent(new Event('ngItemsSettingLoaded', {"bubbles":true}));

            document.body.appendChild(others);
            others.dispatchEvent(new Event('othersSettingLoaded', {"bubbles":true}));

            document.body.dispatchEvent(new Event('settings', {"bubbles":true}));
        }

        topPage()
        {
            const mo_option = {childList: true, subtree: true};

            const mo = new MutationObserver(function(mr, mo){
                //console.log('mr',mr);
                const items = document.querySelectorAll('li[class^="___item___"]:not([loaded])');
                for(const item of items)
                {
                    if (!item.querySelector('div[class^="___program-card___"]')) continue;
                    mo.disconnect();
                    item.setAttribute('loaded', '');
                    this.dispatchEvent('topPage', item, ['number', 'keyword']);
                    mo.observe(document, mo_option);
                }

                for (const r of mr)
                {
                    switch(r.target.localName)
                    {
                        case 'div':
                            if (r.target.className && /^___program\-card___/.test(r.target.className)
                                && r.removedNodes.length == 1 && /\-btn\-container/.test(r.removedNodes[0].className))
                            {
                                mo.disconnect();
                                this.dispatchEvent('topPage', r.target.parentNode, ['number', 'keyword']);
                                mo.observe(document, mo_option);
                            }
                            break;
                    }
                }

            }.bind(this));
            mo.observe(document, mo_option);
        }

        focusPage()
        {
            const mo_option = {childList: true, subtree: true};

            const mo = new MutationObserver(function(mr, mo){
                //console.log('mr',mr);
                const items = document.querySelectorAll('li[class^="___item___"]:not([loaded])');
                for(const item of items)
                {
                    mo.disconnect();
                    item.setAttribute('loaded', '');
                    this.dispatchEvent('focusPage', item, ['number', 'keyword']);
                    mo.observe(document, mo_option);
                }

                for (const r of mr)
                {
                    switch(r.target.localName)
                    {
                        case 'div':
                            if (r.target.className && /^___program\-card___/.test(r.target.className)
                                && r.removedNodes.length == 1 && /\-btn\-container/.test(r.removedNodes[0].className))
                            {
                                mo.disconnect();
                                this.dispatchEvent('focusPage', r.target.parentNode, ['number', 'keyword']);
                                mo.observe(document, mo_option);
                            }
                            break;
                    }
                }
            }.bind(this));
            mo.observe(document, mo_option);
        }

        listPage()
        {
            const mo_option = {childList: true, subtree: true};
/*
            Array.from(document.querySelectorAll('[class^="___program-card-list___"] li[class^="___item___"]')).map((node)=>{
                if (node.querySelector('[class^="___name-label___"]') && !node.hasAttribute('loaded'))
                {
                    node.setAttribute('loaded','');
                    this.dispatchEvent('listPagePrograms', node, ['number', 'keyword']);
                }
            });
*/
            function getParent(node)
            {
                if (node == null || node.nodeName =='body') {
                    return false;
                }
                else if (node.nodeName == 'LI' && /^___item___/.test(node.className))
                {
                    return node;
                }
                else
                {
                    return getParent(node.parentNode);
                }
            };

            const mo = new MutationObserver((mr, mo)=>{
                //console.log('mr',mr);
                for (const r of mr)
                {
                    switch (r.target.nodeName)
                    {
                        case 'A':
                            if ( /^___name-label___/.test(r.target.className)) {
                                const parent = getParent(r.target);
                                if (parent && !parent.hasAttribute('loaded'))
                                {
                                    mo.disconnect();
                                    parent.setAttribute('loaded','');
                                    this.dispatchEvent('listPagePrograms', parent, ['number', 'keyword']);
                                    mo.observe(document, mo_option);
                                }
                            }
                            break;

                        case 'DIV': // 削除対策
                            if (/^___program-card___/.test(r.target.className)
                                && r.removedNodes.length > 0 && r.removedNodes[0].className == 'nlc-proglist-btn-container') {
                                const parent = getParent(r.target);
                                mo.disconnect();
                                parent.setAttribute('loaded','');
                                this.dispatchEvent('listPagePrograms', parent, ['number', 'keyword']);
                                mo.observe(document, mo_option);
                            }
                            break;

                        case 'UL': // デフォルト＆もっと見る
                            if (/^___program-card-list___/.test(r.target.className)
                                && r.addedNodes.length && /^___item___/.test(r.addedNodes[0].className))
                            {
                                if(r.addedNodes[0].querySelector('[class^="___name-label___"]'))
                                {
                                    mo.disconnect();
                                    const parent = getParent(r.addedNodes[0]);
                                    if (parent && !parent.hasAttribute('loaded'))
                                    {
                                        mo.disconnect();
                                        parent.setAttribute('loaded','');
                                        this.dispatchEvent('listPagePrograms', parent, ['number', 'keyword']);
                                        mo.observe(document, mo_option);
                                    }
                                    mo.observe(document, mo_option);
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }

            });
            mo.observe(document, mo_option);
        }

        searchPage()
        {
            const mo_option = {childList: true, subtree: true};

            const mo = new MutationObserver(function(mr, mo){
                //console.log('mr',mr);
                const items = document.querySelectorAll('li[class="searchPage-ProgramList_Item"]:not([loaded])');
                for(const item of items)
                {
                    mo.disconnect();
                    item.setAttribute('loaded', '');
                    this.dispatchEvent('searchPage', item, ['number', 'keyword']);
                    mo.observe(document, mo_option);
                }

                const comm = document.querySelectorAll('li[class="recommend-community-item"]:not([loaded])');
                for(const item of comm)
                {
                    if (item.querySelector('.description').textContent.length > 0)
                    {
                        mo.disconnect();
                        item.setAttribute('loaded', '');
                        this.dispatchEvent('searchPageComm', item, ['number', 'keyword']);
                        mo.observe(document, mo_option);
                    }
                }

            }.bind(this));
            mo.observe(document, mo_option);
        }

        livePage()
        {
            const mo_option = {childList: true, subtree: true};

            document.addEventListener("DOMContentLoaded", function(e){
                const comm = document.querySelector('div[class^="___social-group-information___"] div[class^="___header-area___"]');
                if (comm) this.dispatchEvent('livePageComm', comm, ['number']);

                const user = document.querySelector('div[class^="___user-information-area___"]');
                if (user) this.dispatchEvent('livePageUser', user, ['number']);

                //document.querySelector('button[class^="___comment-button___"]').click();
            }.bind(this));

            const mo = new MutationObserver((mr, mo)=>{
                //console.log(mr);
                for (const r of mr)
                {
                    if (r.target.localName == 'div')
                    {
                        // ザッピング番組
                        if (/^___zapping-list-group___/.test(r.target.className) && r.addedNodes.length ==1 &&
                            /^___zapping-list___/.test(r.addedNodes[0].className))
                        {
                            for (const item of r.addedNodes[0].children)
                            {
                                mo.disconnect();
                                this.dispatchEvent('livePageZapp', item, ['number', 'keyword']);
                                mo.observe(document, mo_option);
                            }
                        }

                        // アイテム
                        else if (/^___queue-item-area___/.test(r.target.className)&& r.addedNodes.length == 1 &&
                                 /^___item___/.test(r.addedNodes[0].className)
                                )
                        {
                            mo.disconnect();
                            this.dispatchEvent('livePageItem', r.addedNodes[0], ['item']);
                            mo.observe(document, mo_option);
                        }
                    }
                }
            });
            mo.observe(document, mo_option);
        }

        liveEndPage()
        {
            const mo_option = {childList: true, subtree: true};
            const mo = new MutationObserver(function(mr, mo){
                const items = document.querySelectorAll('li[class="gyokuon_list_item"]:not([loaded])');
                 if (items)
                {
                    mo.disconnect();
                    for(const item of items)
                    {
                        item.setAttribute('loaded', '');
                        this.dispatchEvent('liveEndPage', item, ['number', 'keyword']);
                    }
                    mo.observe(document, mo_option);
                }
            }.bind(this));
            mo.observe(document, mo_option);
        }

        rankingPage()
        {
            const mo_option = {childList: true, subtree: true};
            const mo = new MutationObserver(function(mr, mo){
                const items = document.querySelectorAll('div[class^="___rk-program-card___"]:not([loaded])');
                if (items)
                {
                    mo.disconnect();
                    for(const item of items)
                    {
                        item.setAttribute('loaded', '');
                        this.dispatchEvent('rankingPage', item, ['number', 'keyword']);
                    }
                    mo.observe(document, mo_option);
                }
            }.bind(this));
            mo.observe(document, mo_option);
        }

        timeTablePage()
        {
            const mo_option = {childList: true, subtree: true};
            const mo = new MutationObserver(function(mr, mo){
                const items = document.querySelectorAll('tr[id^="stream_"]:not([loaded])');
                if (items)
                {
                    mo.disconnect();
                    for(const item of items)
                    {
                        item.setAttribute('loaded', '');
                        this.dispatchEvent('timeTablePage', item, ['number', 'keyword']);
                    }
                    mo.observe(document, mo_option);
                }
            }.bind(this));
            mo.observe(document, mo_option);
        }
    }


    class View
    {
        constructor(controller)
        {
            this._controller = controller;
            this.css_prefix = 'nlc';

            this.setStyle();
            this.settings();
            //this.insertMenu();
            this.debug();

            this.topPage();
            this.focusPage();
            this.listPage();
            this.searchPage();
            this.livePage();
            this.liveEndPage();
            this.rankingPage();
            this.timeTablePage();
        }

        // スタイルシート設定
        setStyle()
        {
            let css = document.createElement('style')
            let rule = document.createTextNode(`
/* 削除ボタン */
button.${this.css_prefix}-btn {
  font-size: 12px;
  color: #fff;
  padding: 0 3px;
  border-radius: 4px;
  opacity: 0.05;
  background-color: #404040;
  border: none;
}
/* 削除ボタンホバー時 */
button.${this.css_prefix}-btn:hover {
  border: none;
  opacity: 1;
}

/* ライブページ 削除ボタン */
button[id^="${this.css_prefix}-live-"] {
  opacity: 1;
}
/* ライブページ 削除ボタンホバー時 */
button[id^="${this.css_prefix}-live-"]:hover {
  border: none;
  opacity: 0.8;
}

/* ライブページ 状態コンテナ */
div[class^="${this.css_prefix}-livepagecomm-btn-container"],
span[id^="${this.css_prefix}-livepagecomm-commstate"] {
  margin-left: 1em;
}
/* ライブページ NG中状態 */
span[id^="${this.css_prefix}-livepagecomm-commstate"], span[id^="${this.css_prefix}-livepageuser-userstate"] {
  letter-spacing: 0.2em;
  width: 4em;
  text-align: center;
  color: #FF0066;
  background-color: #FFF;
  border: 1px solid #FF0066;
  padding: 0em 0.5em;
  border-radius: 4px;
}

/* ライブページ ユーザー状態コンテナ */
 div[class^="${this.css_prefix}-livepageuser-btn-container"], span[id^="${this.css_prefix}-livepageuser-userstate"] {
  margin-left:0.3em;
}
/* ライブページ ユーザーNG中状態 */
span[id^="${this.css_prefix}-livepageuser-userstate"] {
    padding: 0 0.2em;
    letter-spacing: 0;
    font-size: 11px;
}

/* ライブページザッピング 削除ボタン*/
button[id^="${this.css_prefix}-proguser"] {
  opacity: 0.1;
  z-index: 2;
}

/* ライブページザッピング 削除ボタンコンテナ */
div.${this.css_prefix}-zapp-btn-container {
  margin: -20px 0 0 0;
  width: 100%;
  text-align: right;
  position: absolute;
  z-index: 2;
}
/* ライブページザッピング 削除ボタン*/
button[id^="${this.css_prefix}-zapp"] {
  opacity: 0.1;
  z-index: 2;
}

/* 検索ページ 削除ボタン */
button[id^="${this.css_prefix}-search"] {
  height: 1.5em;
  opacity: 0.1;
}
/* 番組一覧 削除ボタン */
button[id^="${this.css_prefix}-proglist"] {
  padding: 0 3px;
}
/* 削除ボタン */
button[id^="${this.css_prefix}-top"],
button[id^="${this.css_prefix}-focus"]
{
  opacity: 0.5;
}
/* 番組表 削除ボタン */
button[id^="${this.css_prefix}-timetable"] {
  opacity: 0.8;
}
/* アイテム 削除ボタン */
button[id^="${this.css_prefix}-item"] {
  opacity: 0.8;
  position:absolute;
  z-index:10;
  visibility:hidden;
}
button[id^="${this.css_prefix}-item"]:hover {
  opacity: 0.5;
  background-color:red;
}
/* ボタンコンテナ */
div.${this.css_prefix}-proglist-btn-container,
div.${this.css_prefix}-ps4list-btn-container,
div.${this.css_prefix}-rankpic-btn-container,
div.${this.css_prefix}-channel-btn-container,
div.${this.css_prefix}-top-btn-container,
div.${this.css_prefix}-focus-btn-container,
div.${this.css_prefix}-search2-btn-container,
div.${this.css_prefix}-search3-btn-container,
span.${this.css_prefix}-modal-img-containner,
div.${this.css_prefix}-left-btn-container,
div.${this.css_prefix}-programComm-btn-container,
div.${this.css_prefix}-liveend-btn-container,
div.${this.css_prefix}-timetable-btn-container,
div.${this.css_prefix}-liveitem-btn-container
{
  margin: -1.5em 0 0 0;
  width : 100%;
  text-align: right;
  position: relative;
}
div.${this.css_prefix}-top-btn-container,
div.${this.css_prefix}-focus-btn-container
{
    margin: -2px 0 0 0;
    position: absolute;
    z-index: 1000;
}
div.${this.css_prefix}-search-btn-container {
    display:inline;
}
div.${this.css_prefix}-search3-btn-container {
  margin: 0 0 0 -1em;
  position: absolute;
}
span.${this.css_prefix}-modal-img-containner {
  margin:0em 0 0 0;
}
div.${this.css_prefix}-ranking-btn-container {
    margin-top: 1.8em;
}
div.${this.css_prefix}-liveitem-btn-container {
    width: 95%;
    margin: -25px 0 0 0;
}
div.${this.css_prefix}-timetable-btn-container {
    margin: unset;
    text-align: unset;
}


/* オーバーレイ */
div#${this.css_prefix}-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 10000;
}

/* モーダル */
div#${this.css_prefix}-modal-contents {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;/*auto*/
  text-align: left;
  padding: 2em;
  transform: translate(-50%, -50%);
  background: #fff;
  overflow-x: hidden;
 /* overflow-y: scroll;*/
  border-radius: 10px;
}
div#${this.css_prefix}-modal-contents h1{
  font-size: 18px;
  margin-bottom: 1em;
}
div#${this.css_prefix}-modal-contents h1,
div#${this.css_prefix}-modal-contents h2
{
  font-weight: bold;
}

#${this.css_prefix}-modal-contents > div:nth-child(2) {
  margin-bottom: 1em;
}

div#${this.css_prefix}-modal-contents a {text-decoration: none;}
div#${this.css_prefix}-modal-contents a:link,
div#${this.css_prefix}-modal-contents a:visited{
  color:#808080;
}
div#${this.css_prefix}-modal-contents a:hover{
  color:#A6A6A6;
}

div#${this.css_prefix}-modal-contents h2 {
  margin: 0 0 5px 0;
  font-size: 13px;
}
div#${this.css_prefix}-modal-contents img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
}
div#${this.css_prefix}-modal-contents textarea {
  width: 100%;
  height: 20em;
  padding : 0.5em 0 0.5em 0.3em;
}

/* モーダルupdateボタン */
button.${this.css_prefix}-update, button.${this.css_prefix}-update-click{
  width: 8em;
  padding: 0 1em;
  background-color: #002863;
  border-radius: 3px;
  border: none;
  color: #FFF;
  opacity: 1;
  margin: 0 0 0 0;
  cursor: pointer;
}
/* モーダルupdateボタンclick */
button.${this.css_prefix}-update-click {
  background-color: #4CB5E8;
  color: #FFF;
  /*opacity: 0.2;*/
  transition: 0.3s;
}
button.${this.css_prefix}-update:hover { opacity: 0.5;}

/* モーダルNGコミュニティ削除ボタン */
button[id^="${this.css_prefix}-ngimg"] {
  margin: 0 0 0 -18px;
}
/* モーダルupdateボタン */
button#${this.css_prefix}-regb {
  padding: 0 1em;
  background-color: #0080FF;
  opacity: 1;
  margin: 1em 0 0 0;
}
button#${this.css_prefix}-regb:hover { opacity: 0.5;}

/* モーダルcloseボタン */
#${this.css_prefix}-close {
  text-align: center;
  width: 100%;
  margin-top: 2em;
  font-size: 15px;
}

* NGコミュ表示切替 */
#${this.css_prefix}-block-container-on {
  display: none;
}

/* NGコミュナビゲーション */
#${this.css_prefix}-navi { margin: 0.5em 0 2.5em 0; }
#${this.css_prefix}-navi a,
#${this.css_prefix}-navi-on{
  font-size: 12px;
  display: inline-block;
  width: 2em;
  border: 1px solid #0080FF;
  color: #0080FF;
  text-align: center;
  border-radius: 6px;
  background-color: #FFF;
  margin-right: 0.2em;
}
#${this.css_prefix}-navi-on {
  background-color:#0080FF !important;
  color: #FFF !important;
}

/* 設定画面メニュー */
div#${this.css_prefix}-modal-contents ul#menu {
    margin-bottom: 1em;
    /* background-color: #008be6; */
    padding: 4px 1em 2px;
    border-radius: 5px;
    color: #0080ff;
    font-size: 15px;
    border: 1px solid #008be6;
}
div#${this.css_prefix}-modal-contents ul#menu li{
  display: inline-block;
  font-size: 0.8em;
  margin-right: 1.5em;
  text-transform: capitalize;
  cursor: pointer;
}
div#${this.css_prefix}-modal-contents ul#menu li:hover{
  color:#E6E6E6;
}
div#${this.css_prefix}-modal-contents dl dt,
div#${this.css_prefix}-modal-contents dl dd{
  display: inline-block;
}
div#${this.css_prefix}-modal-contents dl dt{
  font-size: 13px;
  margin-right: 1em;
}
div#${this.css_prefix}-modal-contents dl dd{
  vertical-align: middle;
}
div#${this.css_prefix}-modal-contents dl dd input[type="checkbox"]{
  margin:0;
}
.${this.css_prefix}-hidden {
  display: none;
}
.${this.css_prefix}-visible {
  display: block;
}

}
`);
            css.media = 'screen';
            css.type = 'text/css';
            if (css.styleSheet) {
                css.styleSheet.cssText = rule.nodeValue;
            } else {
                css.appendChild(rule);
            };

            const mo_option = {childList: true, subtree: true};
            const mo = new MutationObserver((mr, mo)=>{
                if (document.getElementsByTagName('head')[0] !== undefined) {
                    //console.log('head');
                    mo.disconnect();
                    document.getElementsByTagName('head')[0].appendChild(css);
                }
            });
            mo.observe(document, mo_option);
        }
/*
        insertMenu()
        {
            if (!location.href.match(/http(s)*:\/\/live(2*)\.nicovideo\.jp\//)) return;

            window.addEventListener("DOMContentLoaded", function(e){
                // メニュー部分取得
                const menu = document.getElementById('siteHeaderRightMenuContainer');

                const li = document.createElement('li');
                const a = document.createElement('a');
                a.id = 'NicoLiveCleaner';
                a.textContent = 'NicoLiveCleaner';
                li.appendChild(a);

                // ログインアウトリンクの一つ手前に挿入
                menu.lastElementChild.parentNode.insertBefore(li, menu.lastElementChild);

                a.addEventListener('click', (e)=>{
                    //メニュー非表示に
                    //menu.style.marginRight = '-100em';
                    //this.displayModal(a.id);
                    this._controller.router('display_modal');
                });
            }.bind(this));

        }
 */
        createNgNumbers(data)
        {
            if(data.ngNumbers) {
            if (Object.prototype.toString.call(data.ngNumbers) == '[object String]')
            {
                data.ngNumbers = JSON.parse(data.ngNumbers);
            }
            data.ngNumbers.reverse();
            }
            const title = document.createElement('h2');
            title.textContent = 'NG生主＆チャンネル';
            const ngNumList = this.iniNgNumber(data, 50, 0);
            const ngNumNavi = this.iniNavi(data, 50, 0);

            const outer = document.createElement('div');
            outer.id = this.css_prefix+'-ngnumbers-container';
            outer.setAttribute('class', this.css_prefix + '-visible');

            const blockOuter = document.createElement('div');

            outer.appendChild(title);
            blockOuter.appendChild(ngNumList);
            outer.appendChild(blockOuter);
            outer.appendChild(ngNumNavi);
            return outer;
        }

        iniNgNumber(items, block, position = 0)
        {
            const outer = document.createElement('div');
            outer.id = this.css_prefix + '-ngnumbers';

            const start = block * position;
            const end = start + block;
            const block_items = (items.ngNumbers)? items.ngNumbers.slice(start, end): null;

            if (block_items)
            {
                for (let i = 0; i < block_items.length; i++)
                {
                    const item = this.convertImage(block_items[i]);
                    if (!item) continue;

                    const img = document.createElement('img');
                    img.onerror = function() {
                        img.src = 'https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/defaults/blank_s.jpg'; //代用
                    }
                    img.src = item.imgSrc;
                    img.alt = img.title = block_items[i];

                    const a = document.createElement('a');
                    a.href = item.link;
                    a.target = '_blank';

                    const inner = document.createElement('span');
                    inner.setAttribute('class', this.css_prefix + '-modal-img-container');

                    const b = this.iniButton(this.convertID('ngimg', block_items[i]), 'ｘ');

                    a.appendChild(img);
                    inner.appendChild(a);
                    inner.appendChild(b);
                    outer.appendChild(inner);

                    b.addEventListener('click', (e)=>{
                        e.stopPropagation();
                        inner.remove();
                        const index = items.ngNumbers.findIndex(num => num == block_items[i]);
                        if (index !== -1) items.ngNumbers[index] = null;
                        this._controller.router('delete_number', block_items[i]);
                    });
                }
            }
            return outer;
        }

        iniNavi(items, block, position)
        {

            const page = (items.ngNumbers)? Math.ceil(items.ngNumbers.length / block): -1;
            const navi = document.createElement('div');
            navi.id = this.css_prefix + '-navi'
            const navi_on = this.css_prefix + '-navi-on';
            const parent_id = this.css_prefix + '-ngnumbers';

            if (page > position){
                for (let i = 0; i < page; i++) {
                    const span = document.createElement('span');
                    const a = document.createElement('a');
                    if (i == position) a.id = navi_on;

                    a.addEventListener('click', function(e) {
                        // 現在地
                        for (let x = 0; x < navi.children.length; x++)
                        {
                            if (navi.children[x].id == navi_on) {
                                navi.children[x].removeAttribute('id');
                            } else if (x == i) {
                                navi.children[x].id = navi_on;
                            }
                        }
                        //表示アイテム切替
                        const base = document.getElementById(parent_id).parentNode;
                        document.getElementById(parent_id).remove();
                        base.appendChild(this.iniNgNumber(items, block, i));
                    }.bind(this));

                    span.textContent = i + 1;
                    a.appendChild(span);
                    navi.appendChild(a);
                }
            }
            return navi;
        }

        createTextArea(name, titele_str, data)
        {
            const outer = document.createElement('div');
            const title = document.createElement('h2');
            const ta = document.createElement('textarea');
            const update = document.createElement('button');
            ta.textContent = data;

            title.textContent = titele_str;
            outer.id = this.css_prefix+'-'+ name+'-container';
            outer.setAttribute('class', this.css_prefix + '-hidden');

            update.textContent = '更新';
            update.setAttribute('class', this.css_prefix + '-update');

            outer.appendChild(title);
            outer.appendChild(ta);
            outer.appendChild(update);

            update.addEventListener('mousedown', function(e){
                update.setAttribute('class', this.css_prefix + '-update-click');
                setTimeout(function() {
                    update.textContent = '完了';
                }, 200);
                this._controller.router('update_'+name, ta.value);
            }.bind(this));

            update.addEventListener('mouseout', function(e){
                setTimeout(function() {
                    update.setAttribute('class', this.css_prefix + '-update');
                    update.textContent = '更新';
                }.bind(this), 700);
            }.bind(this));

            return outer;
        }

        createOthers(data)
        {
            const others = document.createElement('div');
            others.id = this.css_prefix+'-others-container';
            others.setAttribute('class', this.css_prefix + '-hidden');
            const title = document.createElement('h2');
            title.textContent = 'その他';

            const dl = document.createElement('dl');
            const dt = document.createElement('dt');
            dt.textContent = 'デバッグモード';
            const dd = document.createElement('dd');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = (data.debug)? true: false;

            dl.appendChild(dt);
            dd.appendChild(checkbox);
            dl.appendChild(dd);

            others.appendChild(title);
            others.appendChild(dl);

            checkbox.addEventListener('change', function(e){
                //console.log('change', e.target.checked);
                this._controller.router('update_settings', {debug: e.target.checked});
            }.bind(this));
            return others;
        }

        settings()
        {
            const settingData = {};
            this.loadSettingData(settingData, 'ngNumbers');
            this.loadSettingData(settingData, 'ngKeywords');
            this.loadSettingData(settingData, 'ngItems');
            this.loadSettingData(settingData, 'others');

            document.addEventListener('settings', function(e){
                const title = document.createElement('h1');
                title.textContent = 'NicoLiveCleaner設定画面';
                // メニュー
                const settingMenu = this.createSttingMenu();
                // NG生主&ch
                const ngNumbers = this.createNgNumbers(settingData);
                // NGキーワード
                const ngKeywords = this.createTextArea('ngkeywords', 'NGキーワード(正規表現)', settingData.ngKeywords);
                // NGアイテム
                const ngItems = this.createTextArea('ngitems', 'NG市場＆アイテム(正規表現)', settingData.ngItems);
                // その他
                const others = this.createOthers(settingData.others);

                // オーバーレイ
                const overlay =document.createElement('div');
                overlay.setAttribute('id', this.css_prefix + '-overlay');
                // モーダルボックス
                const modal= document.createElement('div');
                modal.setAttribute('id', this.css_prefix + '-modal-contents');

                // クローズリンク
                const cp = document.createElement('div');
                cp.id = this.css_prefix + '-close';
                const close = document.createElement('a');
                close.setAttribute('id', 'close');
                close.setAttribute('href', '#');
                close.innerHTML = 'CLOSE';
                cp.appendChild(close);

                modal.appendChild(title);
                modal.appendChild(settingMenu);
                modal.appendChild(ngNumbers);
                modal.appendChild(ngKeywords);
                modal.appendChild(ngItems);
                modal.appendChild(others);
                modal.appendChild(cp);
                overlay.appendChild(modal);

               // コンテンツを表示
                document.body.appendChild(overlay);
                overlay.style.display = 'block';
                overlay.style.opacity = '1';

                //　モーダル親要素への伝播防止
                modal.addEventListener('click', function(e) {
                    e.stopPropagation();
                });

                // オーバーレイ削除
                overlay.addEventListener('click', function() {
                    this.style.opacity = '0';
                    setTimeout(function() {
                        this.remove();
                        location.reload();
                    }.bind(this), 300);
                });

                // クローズ経由でオーバーレイ削除
                close.addEventListener('click', function(e) {
                    e.preventDefault();
                    overlay.style.opacity = '0';
                    setTimeout(function() {
                        overlay.remove();
                        location.reload();
                    }, 300);
                });

            }.bind(this));
        }

        loadSettingData(obj, name)
        {
             document.addEventListener(name + 'SettingLoaded', function(e){
                obj[name] = JSON.parse(e.target.textContent);
                //console.log(name+'SettingLoaded', obj);
                e.target.remove();
            });
        }

        convertImage(item)
        {
            const result = /(co|ch|.*?)([0-9]+)/.exec(item);
            if (result)
            {
                const data = {};
                switch (result[1])
                {
                    case 'co':
                        data.imgSrc = 'https://secure-dcdn.cdn.nimg.jp/comch/community-icon/64x64/' + item + '.jpg';
                        data.link = 'https://com.nicovideo.jp/community/'+ item;
                        break;
                    case 'ch':
                        data.imgSrc = 'https://secure-dcdn.cdn.nimg.jp/comch/channel-icon/64x64/' + item + '.jpg';
                        data.link = 'https://ch.nicovideo.jp/channel/'+ item;
                        break;
                    case '':
                        data.imgSrc = 'https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/s/'
                            + item.substr(0, item.length-4) + '/' + item + '.jpg'
                        data.link = 'https://www.nicovideo.jp/user/'+ item;
                        break;
                }
                return data;
            }
            return null;
        }

        convertID(id, number)
        {
            return this.css_prefix +'-' + id + '-' + number;
        }

        iniNgRegEx(items)
        {
            let outer = document.createElement('div');
            let btn = this.iniButton(this.css_prefix+'-regb', 'UPDATE');

            let ta = document.createElement('textarea');

            if (Array.isArray(items))
            {
                ta.value = items.join('\n');
            }
            outer.appendChild(ta);
            outer.appendChild(btn);

            btn.addEventListener('mousedown', (e)=> {
                btn.style.opacity = '0.2';
                this.controller.receive('ngreg', ta.value);
            });
            return outer;
        }

        createSttingMenu()
        {
            const category = [
                {id:'ngnumbers', text:'生主＆CH'},
                {id:'ngkeywords', text:'キーワード'},
                {id:'ngitems', text:'アイテム'},
                {id:'others', text:'その他'}
                              ];
            const menu = document.createElement('ul');
            menu.id = 'menu';
            for (const c of category)
            {
                const li = document.createElement('li');
                li.id = c.id;
                li.textContent = c.text;
                menu.appendChild(li);

                li.addEventListener('click', function(e){
                    const id = this.css_prefix+'-'+ c.id +'-container';
                    const target = document.getElementById(id);
                    const visible = document.querySelectorAll(`div#${this.css_prefix}-modal-contents div.${this.css_prefix}-visible`);
                    for (const v of visible)
                    {
                        v.setAttribute('class', this.css_prefix + '-hidden');
                    }
                    target.setAttribute('class', this.css_prefix + '-visible');
                }.bind(this));
            }
            return menu;
        }

        iniButton(id, value)
        {
            let btn = document.createElement('button');
            btn.setAttribute('id', id);
            btn.setAttribute('class', this.css_prefix + '-btn');
            btn.setAttribute('type', 'button');
            btn.textContent = value;
            return btn;
        }

        parseNumber(target)
        {
            const nodes = target.querySelectorAll('img, a, div[class="js_like_dialog"]');
            let num;
            for (const node of nodes)
            {
                const result = /\/((co|ch)([0-9]+)\.?|(usericon)\/[0-9]+\/([0-9]+)\.|user\/([0-9]+))|data\-twitter\-tag="#nico(ch)([0-9]+)/.exec(node.outerHTML);

                if (result) {
                    // co&ch
                    if (result[2] && result[3]) {
                        num = result[2] + result[3];
                        break;
                    // user
                    } else if(result[4] && result[5]) {
                        num = result[5];
                        break;
                    } else if (result[6]) {
                        num = result[6];
                        break;
                    } else if (result[7] && result[8]) {
                        num = result[7] + result[8];
                        break;
                    }
                }
            }
            return num;
        }

        createDeleteButton(id, target, buttonTarget, debug=false)
        {
            if (target== null) return;

            const number = this.parseNumber(target);
            if (number)
            {
                const check = buttonTarget.querySelector('div[class$="-btn-container"]');
                if (check) check.remove();

                const outer = document.createElement('div');
                outer.setAttribute('class', this.css_prefix +'-'+id+ '-btn-container');
                const b = this.iniButton(this.convertID(id, number), 'ｘ');
                outer.appendChild(b);
                buttonTarget.appendChild(outer);

                b.addEventListener('click', (e)=>{
                    e.stopPropagation();
                    if (debug) {
                        const border = '1px solid red';
                        if (target.style.border == border)
                        {
                            this._controller.router('delete_number', number);
                            target.removeAttribute('style');
                        } else {
                            this._controller.router('add_number', number);
                            target.style.border = border;
                        }
                    } else {
                        this._controller.router('add_number', number);
                        target.remove();
                    }

                });
            }
        }

        createItemDeleteButton(target, debug=false)
        {
            const border = '1px solid red';
            const id = this.css_prefix + '-item-' + target.getAttribute('data-target-order');
            let button;

            target.addEventListener('mouseover', function(e){
                if (target.style.border == border) return;

                button = this.iniButton(id, 'x');
                document.body.appendChild(button);

                const clientRect = target.getBoundingClientRect() ;
                const x = clientRect.left ;
                const y = clientRect.top ;

                // 右端
                const _right = x + document.scrollingElement.scrollLeft
                    + Math.round(clientRect.width) - Math.round(button.getBoundingClientRect().width);
                // 上端
                const _top = y+document.scrollingElement.scrollTop;

                button.style.left = _right + 'px';
                button.style.top = _top + 'px';
                button.style.visibility = 'visible';

                button.setAttribute('data', target.getAttribute('aria-label'));


                button.addEventListener('mouseover', function(e){
                    e.target.style.visibility = "visible";
                    e.target.setAttribute('over', '');
                });

                button.addEventListener('mouseout', function(e){
                    e.target.remove();
                });
                button.addEventListener('click', function(e){
                    //console.log(e.target.getAttribute('data'));
                    e.stopPropagation();
                    if (e.target.hasAttribute('data'))
                    {
                        this._controller.router('add_ngitem', this.escapeRegEx(e.target.getAttribute('data')));
                        if (debug) {
                            target.style.border = border;
                        } else {
                            target.style.display = 'none';
                        }
                        e.target.remove();
                    }
                }.bind(this));
            }.bind(this));

            target.addEventListener('mouseout', function(e){
                setTimeout(function(){
                    if (button.style.visibility == 'visible' && !button.hasAttribute('over')) button.remove();
                },1);
            });
        }

        hidden(e)
        {
            e.target.style.display = 'none';
        }
        hiddenDebug(e)
        {
            console.log('debugFilterMatched',e.target.innerText);
            e.target.style.border = '1px solid red';
        }

        escapeRegEx(str)
        {
            return str.trim().replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
        }

        debug()
        {
            document.addEventListener('debug', function(e){
                console.log('debug',e.target.innerText);
                e.target.style.border = null;

                this.createDebugDeleteButton(e.target, 'top');
                //console.log('debug after', e.target.innerHTML);
            }.bind(this));

            document.addEventListener('debugFilterMatched', function(e){
                console.log('debugFilterMatched',e.target.innerText);
                e.target.style.border = '1px solid red';
                //e.target.style.visibility = 'hidden';
            });
        }

        topPage()
        {
            document.addEventListener('topPage', function(e) {
                this.createDeleteButton('top', e.target, e.target.querySelector('div[class^="___program-card___"]'));
            }.bind(this));

            document.addEventListener('topPageDebug', function(e) {
                this.createDeleteButton('top', e.target, e.target.querySelector('div[class^="___program-card___"]'), true);
            }.bind(this));

            document.addEventListener('topPageFilterMatched', this.hidden);
            //            document.addEventListener('topPageFilterMatched', (e)=>e.target.remove());
            //document.addEventListener('topPageFilterMatchedDebug', this.hiddenDebug);
            document.addEventListener('topPageFilterMatchedDebug', function(e){
                this.hiddenDebug(e);
                this.createDeleteButton('top', e.target, e.target.querySelector('div[class^="___program-card___"]'), true);
            }.bind(this));
        }

        focusPage()
        {
            document.addEventListener('focusPage', function(e) {
                this.createDeleteButton('focus', e.target, e.target.querySelector('div[class^="___program-card___"]'));
            }.bind(this));

            document.addEventListener('focusPageDebug', function(e) {
                this.createDeleteButton('focus', e.target, e.target.querySelector('div[class^="___program-card___"]'), true);
            }.bind(this));

            document.addEventListener('focusPageFilterMatched', this.hidden);
            document.addEventListener('focusPageFilterMatchedDebug', function(e){
                this.hiddenDebug(e);
                this.createDeleteButton('focus', e.target, e.target.querySelector('div[class^="___program-card___"]'), true);
            }.bind(this));
        }

        listPage()
        {
            // 番組一覧 --------------------------------------------------------------------------
            document.addEventListener('listPagePrograms', function(e) {
                const buttonParent = e.target.querySelector('div[class^="___program-card___"]');
                this.createDeleteButton('proglist', e.target, buttonParent);
            }.bind(this));
            document.addEventListener('listPageProgramsFilterMatched', (e)=>{
                e.target.style.display = 'none';
            });

            document.addEventListener('listPageProgramsDebug', function(e) {
                const buttonParent = e.target.querySelector('div[class^="___program-card___"]');
                this.createDeleteButton('proglist', e.target, buttonParent, true);
            }.bind(this));
            document.addEventListener('listPageProgramsFilterMatchedDebug', function(e){
                this.hiddenDebug(e);
                const buttonParent = e.target.querySelector('div[class^="___program-card___"]');
                this.createDeleteButton('proglist', e.target, buttonParent, true);
            }.bind(this));
        }

        searchPage()
        {
            // 検索結果 --------------------------------------------------------------------------
            document.addEventListener('searchPage', function(e) {
                const buttonTarget = e.target.querySelector('.searchPage-ProgramList_UserName');
                this.createDeleteButton('search', e.target, buttonTarget);
            }.bind(this));
            document.addEventListener('searchPageFilterMatched', this.hidden);

            document.addEventListener('searchPageDebug', function(e) {
                const buttonTarget = e.target.querySelector('.searchPage-ProgramList_UserName');
                this.createDeleteButton('search', e.target, buttonTarget, true);
            }.bind(this));
            document.addEventListener('searchPageFilterMatchedDebug', function(e){
                this.hiddenDebug(e);
                const buttonTarget = e.target.querySelector('.searchPage-ProgramList_UserName');
                this.createDeleteButton('search', e.target, buttonTarget, true);
            }.bind(this));

            // 関連コミュ --------------------------------------------------------------------------
            document.addEventListener('searchPageComm', function(e) {
                this.createDeleteButton('search3', e.target, e.target);
            }.bind(this));
            document.addEventListener('searchPageCommFilterMatched', this.hidden);

            document.addEventListener('searchPageCommDebug', function(e) {
                this.createDeleteButton('search3', e.target, e.target, true);
            }.bind(this));
            document.addEventListener('searchPageCommFilterMatchedDebug', function(e){
                this.hiddenDebug(e);
                this.createDeleteButton('search3', e.target, e.target, true);
            }.bind(this));

        }

        displayLivePageNgState(target, container_name, state_name)
        {
            let base = document.createElement('span');
            base.id = this.css_prefix + '-'+ container_name + '-container';

            let text = document.createElement('span');
            text.id = this.css_prefix + '-' + container_name +'-' +state_name;
            text.textContent = 'NG中';

            base.appendChild(text)
            target.appendChild(base);
        }

        livePage()
        {
            // コミュ --------------------------------------------------------------------------
            document.addEventListener('livePageComm', function(e) {
                this.createDeleteButton('livepagecom', e.target, e.target);
            }.bind(this));
            document.addEventListener('livePageCommFilterMatched', function(e){
                this.displayLivePageNgState(e.target, 'livepagecomm', 'commstate');
            }.bind(this));

            document.addEventListener('livePageCommDebug', function(e) {
                this.createDeleteButton('progcomm', e.target, e.target, true);
            }.bind(this));
            document.addEventListener('livePageCommFilterMatchedDebug', function(e){
                this.hiddenDebug(e);
                this.createDeleteButton('progcomm', e.target, e.target, true);
            }.bind(this));

            // ユーザー --------------------------------------------------------------------------
            document.addEventListener('livePageUser', function(e) {
                this.createDeleteButton('proguser', e.target, e.target);
            }.bind(this));
            document.addEventListener('livePageUserFilterMatched', function(e){
                this.displayLivePageNgState(e.target, 'livepageuser', 'userstate');
            }.bind(this));

            document.addEventListener('livePageUserDebug', function(e) {
                this.createDeleteButton('proguser', e.target, e.target, true);
            }.bind(this));
            document.addEventListener('livePageUserFilterMatchedDebug', function(e){
                this.hiddenDebug(e);
                this.createDeleteButton('proguser', e.target, e.target, true);
            }.bind(this));


            // ザッピング --------------------------------------------------------------------------
            document.addEventListener('livePageZapp', function(e) {
                this.createDeleteButton('zapp', e.target, e.target);
            }.bind(this));
            document.addEventListener('livePageZappFilterMatched', this.hidden);

            document.addEventListener('livePageZappDebug', function(e) {
                this.createDeleteButton('zapp', e.target, e.target, true);
            }.bind(this));
            document.addEventListener('livePageZappFilterMatchedDebug', function(e){
                this.hiddenDebug(e);
                this.createDeleteButton('zapp', e.target, e.target, true);
            }.bind(this));


            // アイテム --------------------------------------------------------------------------
            document.addEventListener('livePageItem', function(e) {
                this.createItemDeleteButton(event.target);
            }.bind(this));
            document.addEventListener('livePageItemFilterMatched', this.hidden);

            document.addEventListener('livePageItemDebug', function(event) {
                this.createItemDeleteButton(event.target, true);
            }.bind(this));

            document.addEventListener('livePageItemFilterMatchedDebug', this.hiddenDebug);
        }

        liveEndPage()
        {
            document.addEventListener('liveEndPage', function(e) {
                this.createDeleteButton('liveend', e.target, e.target);
            }.bind(this));
            document.addEventListener('liveEndPageFilterMatched', this.hidden);

            document.addEventListener('liveEndPageDebug', function(e) {
                this.createDeleteButton('liveend', e.target, e.target, true);
            }.bind(this));
            document.addEventListener('liveEndPageFilterMatchedDebug', function(e){
                this.hiddenDebug(e);
                this.createDeleteButton('liveend', e.target, e.target, true);
            }.bind(this));
        }

        rankingPage()
        {
            document.addEventListener('rankingPage', function(e) {
                this.createDeleteButton('ranking', e.target, e.target);
            }.bind(this));
            document.addEventListener('rankingPageFilterMatched', this.hidden);

            document.addEventListener('rankingPageDebug', function(e) {
                this.createDeleteButton('ranking', e.target, e.target, true);
            }.bind(this));
            document.addEventListener('rankingPageFilterMatchedDebug', function(e){
                this.hiddenDebug(e);
                this.createDeleteButton('ranking', e.target, e.target, true);
            }.bind(this));
        }

        timeTablePage()
        {
            document.addEventListener('timeTablePage', function(e) {
                const btnParent = e.target.querySelector('div[class="js_like_dialog"]');
                this.createDeleteButton('timetable', e.target, btnParent);
            }.bind(this));
            document.addEventListener('timeTablePageFilterMatched', this.hidden);

            document.addEventListener('timeTablePageDebug', function(e) {
                const btnParent = e.target.querySelector('div[class="js_like_dialog"]');
                this.createDeleteButton('timetable', e.target, btnParent, true);
            }.bind(this));
            document.addEventListener('timeTablePageFilterMatchedDebug', function(e){
                e.target.style.border = '2px solid red';
            });
        }
    }


    const model = new Model();
    const con = new Controller(model);
    const view = new View(con);
    con.router();
})();