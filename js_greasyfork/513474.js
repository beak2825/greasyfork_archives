/* eslint-disable no-multi-spaces */
 
// ==UserScript==
// @name               Greasyfork 快捷编辑收藏
// @name:zh-CN         Greasyfork 快捷编辑收藏
// @name:zh-TW         Greasyfork 快捷編輯收藏
// @name:en            Greasyfork script-set-edit button
// @name:en-US         Greasyfork script-set-edit button
// @name:fr            Greasyfork Set Edit+
// @namespace          Greasyfork-Favorite
// @version            0.2.2.2
// @description        在GF脚本页添加快速打开收藏集编辑页面功能
// @description:zh-CN  在GF脚本页添加快速打开收藏集编辑页面功能
// @description:zh-TW  在GF腳本頁添加快速打開收藏集編輯頁面功能
// @description:en     Add / Remove script into / from script set directly in GF script info page
// @description:en-US  Add / Remove script into / from script set directly in GF script info page
// @description:fr     Ajouter un script à un jeu de scripts / supprimer un script d'un jeu de scripts directement sur la page d'informations sur les scripts GF
// @author             PY-DNG
// @license            GPL-3
// @match              http*://*.greasyfork.org/*
// @match              http*://*.sleazyfork.org/*
// @match              http*://greasyfork.org/*
// @match              http*://sleazyfork.org/*
// @require            https://greasyfork.org/scripts/456034-basic-functions-for-userscripts/code/script.js?version=1226884
// @require            https://greasyfork.org/scripts/460385-gm-web-hooks/code/script.js?version=1221394
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAbBJREFUOE+Vk7GKGlEUhr8pAiKKDlqpCDpLUCzWBxCENBa+hBsL9wHsLWxXG4tNtcGH0MIiWopY7JSGEUWsbESwUDMw4Z7siLsZDbnlPff/7n/+e67G38sA6sAXIPVWXgA/gCdgfinRPuhfCoXCw3Q65XA4eLBl6zvw1S2eAZqmvTqOc5/NZhkMBqRSKWzbvgYxgbwquoAX4MGyLHK5HIlEgtFo9C+IOFEAo1gsWsvlUmyPx2MymYxAhsMh6XT6lpM7BXjWdf1xNpuRz+fl8GQywTAMGo0G1WpVnJxOJ692vinADPgcDAaZz+cCOR6PmKZJPB4XUb/fp1wuewF+KoBCf1JVBVE5dDodms3mWdDtdqlUKl6AX+8ALmS9XgtM0/5kvNlspKX9fv8RIgBp4bISCoXo9XqsVitKpRK6rrPb7STQ7XZ7eVRaeAYerz14OBxGOfL7/eIgmUwKzHEcJZEQ1eha1wBqPxqNihufzyeQWCzmtiPPqJYM0jWIyiISibBYLAgEAtTrdVqt1nmQXN0rcH/LicqmVqvRbrdN27bfjbKru+nk7ZD3Z7q4+b++82/YPKIrXsKZ3AAAAABJRU5ErkJggg==
// @grant              GM_xmlhttpRequest
// @grant              GM_setValue
// @grant              GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/513474/Greasyfork%20%E5%BF%AB%E6%8D%B7%E7%BC%96%E8%BE%91%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/513474/Greasyfork%20%E5%BF%AB%E6%8D%B7%E7%BC%96%E8%BE%91%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==
 
/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager */
/* global GMXHRHook GMDLHook */
 
(function __MAIN__() {
    'use strict';
 
    const CONST = {
        Text: {
            'zh-CN': {
                FavEdit: '收藏集：',
                Add: '加入此集',
                Remove: '移出此集',
                Edit: '手动编辑',
                EditIframe: '页内编辑',
                CloseIframe: '关闭编辑',
                CopySID: '复制脚本ID',
                Working: ['工作中...', '就快好了...'],
                InSetStatus: ['[ ]', '[✔]'],
                Error: {
                    AlreadyExist: '脚本已经在此收藏集中了',
                    NotExist: '脚本不在此收藏集中',
                    Unknown: '未知错误'
                }
            },
            'zh-TW': {
                FavEdit: '收藏集：',
                Add: '加入此集',
                Remove: '移出此集',
                Edit: '手動編輯',
                EditIframe: '頁內編輯',
                CloseIframe: '關閉編輯',
                CopySID: '複製腳本ID',
                Working: ['工作中...', '就快好了...'],
                InSetStatus: ['[ ]', '[✔]'],
                Error: {
                    AlreadyExist: '腳本已經在此收藏集中了',
                    NotExist: '腳本不在此收藏集中',
                    Unknown: '未知錯誤'
                }
            },
            'en': {
                FavEdit: 'Add to/Remove from favorite list: ',
                Add: 'Add',
                Remove: 'Remove',
                Edit: 'Edit Manually',
                EditIframe: 'In-Page Edit',
                CloseIframe: 'Close Editor',
                CopySID: 'Copy Script-ID',
                Working: ['Working...', 'Just a moment...'],
                InSetStatus: ['[ ]', '[✔]'],
                Error: {
                    AlreadyExist: 'Script is already in set',
                    NotExist: 'Script is not in set yet',
                    Unknown: 'Unknown Error'
                }
            },
            'default': {
                FavEdit: 'Add to/Remove from favorite list: ',
                Add: 'Add',
                Remove: 'Remove',
                Edit: 'Edit Manually',
                EditIframe: 'In-Page Edit',
                CloseIframe: 'Close Editor',
                CopySID: 'Copy Script-ID',
                Working: ['Working...', 'Just a moment...'],
                InSetStatus: ['[ ]', '[✔]'],
                Error: {
                    AlreadyExist: 'Script is already in set',
                    NotExist: 'Script is not in set yet',
                    Unknown: 'Unknown Error'
                }
            },
        }
    }
 
    // Get i18n code
    let i18n = $('#language-selector-locale') ? $('#language-selector-locale').value : navigator.language;
    if (!Object.keys(CONST.Text).includes(i18n)) {i18n = 'default';}
 
    main()
    function main() {
        const HOST = getHost();
        const API = getAPI();
 
        // Common actions
        commons();
 
        // API-based actions
        switch(API[1]) {
            case "scripts":
                API[2] && centerScript(API);
                break;
            default:
                DoLog('API is {}'.replace('{}', API));
        }
    }
 
    function centerScript(API) {
        switch(API[3]) {
            case undefined:
                pageScript();
                break;
            case 'code':
                pageCode();
                break;
            case 'feedback':
                pageFeedback();
                break;
        }
    }
 
    function commons() {
        // Your common actions here...
        GMXHRHook(5);
    }
 
    function pageScript() {
        addFavPanel();
    }
 
    function pageCode() {
        addFavPanel();
    }
 
    function pageFeedback() {
        addFavPanel();
    }
 
    function addFavPanel() {
        if (!getUserpage()) {return false;}
        GUI();
 
        function GUI() {
            // Get elements
            const script_after = $('#script-feedback-suggestion+*') || $('#new-script-discussion');
            const script_parent = script_after.parentElement;
 
            // My elements
            const script_favorite = $CrE('div');
            script_favorite.id = 'script-favorite';
            script_favorite.style.margin = '0.75em 0';
            script_favorite.innerHTML = CONST.Text[i18n].FavEdit;
 
            const favorite_groups = $CrE('select');
            favorite_groups.id = 'favorite-groups';
 
            const stored_sets = GM_getValue('script-sets', {sets: []}).sets;
            for (const set of stored_sets) {
                // Make <option>
                const option = $CrE('option');
                option.innerText = set.name;
                option.value = set.linkedit;
                $APD(favorite_groups, option);
            }
            adjustWidth();
 
            refresh();
            favorite_groups.addEventListener('change', function(e) {
                favorite_edit.href = favorite_groups.value;
            });
 
            const favorite_add = $CrE('a');
            favorite_add.id = 'favorite-add';
            favorite_add.innerHTML = CONST.Text[i18n].Add;
            favorite_add.style.margin = favorite_add.style.margin = '0px 0.5em';
            favorite_add.href = 'javascript:void(0);'
            favorite_add.addEventListener('click', e => addFav());
 
            const favorite_remove = $CrE('a');
            favorite_remove.id = 'favorite-add';
            favorite_remove.innerHTML = CONST.Text[i18n].Remove;
            favorite_remove.style.margin = favorite_remove.style.margin = '0px 0.5em';
            favorite_remove.href = 'javascript:void(0);'
            favorite_remove.addEventListener('click', e => removeFav());
 
            const favorite_edit = $CrE('a');
            favorite_edit.id = 'favorite-edit';
            favorite_edit.innerHTML = CONST.Text[i18n].Edit;
            favorite_edit.style.margin = favorite_edit.style.margin = '0px 0.5em';
            favorite_edit.target = '_blank';
 
            const favorite_iframe = $CrE('a');
            favorite_iframe.id = 'favorite-edit-in-page';
            favorite_iframe.href = 'javascript: void(0);';
            favorite_iframe.innerHTML = CONST.Text[i18n].EditIframe;
            favorite_iframe.style.margin = favorite_iframe.style.margin = '0px 0.5em';
            favorite_iframe.target = '_blank';
            $AEL(favorite_iframe, 'click', editInPage);
 
            const favorite_copy = $CrE('a');
            favorite_copy.id = 'favorite-copy';
            favorite_copy.href = 'javascript: void(0);';
            favorite_copy.innerHTML = CONST.Text[i18n].CopySID;
            favorite_copy.addEventListener('click', function() {
                copyText(getStrSID());
            });
 
            // Append to document
            $APD(script_favorite, favorite_groups);
            script_parent.insertBefore(script_favorite, script_after);
            [favorite_add, favorite_remove, favorite_edit, favorite_iframe, favorite_copy].forEach(button => $APD(script_favorite, button));
 
            function refresh() {
                getScriptSets(function(sets) {
                    const old_value = favorite_groups.value;
                    clearChildnodes(favorite_groups);
 
                    for (const set of sets) {
                        // Make <option>
                        const option = set.elmOption = $CrE('option');
                        option.innerText = set.name;
                        option.value = set.linkedit;
                        $APD(favorite_groups, option);
                    }
                    adjustWidth();
 
                    // Recover selected <option>
                    const selected = [...favorite_groups.children].find(option => option.value === old_value);
                    selected && (selected.selected = true);
 
                    // Set edit-button.href
                    favorite_edit.href = favorite_groups.value;
 
                    // Check script in-set status
                    getInSets(sets, getStrSID(), inSets => {
                        sets.forEach(set => {
                            const inSet = inSets.includes(set);
                            set.elmOption.innerText = `${CONST.Text[i18n].InSetStatus[inSet+0]} ${set.name}`;
                        });
                        adjustWidth();
                    });
                })
            }
 
            function adjustWidth() {
                favorite_groups.style.width = Math.max.apply(null, Array.from(favorite_groups.children).map((o) => (o.innerText.length))).toString() + 'em';
                favorite_groups.style.maxWidth = '40vw';
            }
 
            function addFav() {
                const option = favorite_groups.selectedOptions[0];
                const set = GM_getValue('script-sets').sets.find(set => set.linkedit === option.value);
                const url = favorite_groups.value;
 
                displayNotice(CONST.Text[i18n].Working[0]);
                modifyFav(favorite_groups.value, oDom => {
                    const existingInput = [...$All(oDom, '#script-set-scripts>input[name="scripts-included[]"][type="hidden"]')].find(input => input.value === getStrSID());
                    if (existingInput) {
                        displayNotice(CONST.Text[i18n].Error.AlreadyExist);
                        option.innerText = `${CONST.Text[i18n].InSetStatus[1]} ${set.name}`;
                        return false;
                    }
 
                    const input = $CrE('input');
                    input.value = getStrSID();
                    input.name = 'scripts-included[]';
                    input.type = 'hidden';
                    $APD($(oDom, '#script-set-scripts'), input);
                    displayNotice(CONST.Text[i18n].Working[1]);
                }, oDom => {
                    const status = $(oDom, 'p.notice');
                    const status_text = status ? status.innerText : CONST.Text[i18n].Error.Unknown;
                    displayNotice(status_text);
                    option.innerText = `${CONST.Text[i18n].InSetStatus[1]} ${set.name}`;
                }, onerror);
            }
 
            function removeFav() {
                const option = favorite_groups.selectedOptions[0];
                const set = GM_getValue('script-sets').sets.find(set => set.linkedit === option.value);
                const url = favorite_groups.value;
 
                displayNotice(CONST.Text[i18n].Working[0]);
                modifyFav(favorite_groups.value, oDom => {
                    const existingInput = [...$All(oDom, '#script-set-scripts>input[name="scripts-included[]"][type="hidden"]')].find(input => input.value === getStrSID());
                    if (!existingInput) {
                        displayNotice(CONST.Text[i18n].Error.NotExist);
                        option.innerText = `${CONST.Text[i18n].InSetStatus[0]} ${set.name}`;
                        return false;
                    }
 
                    existingInput.remove();
                    displayNotice(CONST.Text[i18n].Working[1]);
                }, oDom => {
                    const status = $(oDom, 'p.notice');
                    const status_text = status ? status.innerText : CONST.Text[i18n].Error.Unknown;
                    displayNotice(status_text);
                    option.innerText = `${CONST.Text[i18n].InSetStatus[0]} ${set.name}`;
                }, onerror);
            }
 
            function modifyFav(url, editCallback, finishCallback, onerror) {
                getDocument(url, oDom => {
                    if (editCallback(oDom) === false) {
                        return false;
                    }
                    const form = $(oDom, '.change-script-set');
                    const data = new FormData(form);
                    data.append('save', '1');
 
                    // Use XMLHttpRequest insteadof GM_xmlhttpRequest before Tampermonkey 5.0.0 because of FormData posting issues
                    if (GM_info.scriptHandler === 'Tampermonkey' && parseInt(GM_info.version.split('.')[0], '10') < '5') {
                        DoLog('modifyFav: Using XMLHttpRequest');
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', toAbsoluteURL(form.getAttribute('action')));
                        xhr.responseType = 'blob';
                        xhr.onload = e => parseDocument(xhr.response, oDom => finishCallback(oDom));
                        xhr.onerror = onerror;
                        xhr.send(data);
                    } else {
                        DoLog('modifyFav: Using GM_xmlhttpRequest');
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: toAbsoluteURL(form.getAttribute('action')),
                            data,
                            responseType: 'blob',
                            onload: response => parseDocument(response.response, oDom => finishCallback(oDom)),
                            onerror
                        });
                    }
                });
            }
 
            function onerror() {
                displayNotice(CONST.Text[i18n].Error.Unknown);
            }
 
            function editInPage(e) {
                e.preventDefault();
 
                const _iframes = [...$All(script_favorite, '.script-edit-page')];
                if (_iframes.length) {
                    // Iframe exists, close iframe
                    favorite_iframe.innerText = CONST.Text[i18n].EditIframe;
                    _iframes.forEach(ifr => ifr.remove());
                } else {
                    // Iframe not exist, make iframe
                    favorite_iframe.innerText = CONST.Text[i18n].CloseIframe;
 
                    const iframe = $$CrE({
                        tagName: 'iframe',
                        props: {
                            src: favorite_groups.value
                        },
                        styles: {
                            width: '100%',
                            height: '60vh'
                        },
                        classes: ['script-edit-page'],
                        listeners: [['load', e => {
                            refresh();
                            //iframe.style.height = iframe.contentDocument.body.parentElement.offsetHeight + 'px';
                        }]]
                    });
                    script_favorite.appendChild(iframe);
                }
            }
 
            function displayNotice(text) {
                const notice = $CrE('p');
                notice.classList.add('notice');
                notice.id = 'fav-notice';
                notice.innerText = text;
                const old_notice = $('#fav-notice');
                old_notice && old_notice.parentElement.removeChild(old_notice);
                $('#script-content').insertAdjacentElement('afterbegin', notice);
            }
        }
    }
 
    function getScriptSets(callback, args=[]) {
        const userpage = getUserpage();
        getDocument(userpage, function(oDom) {
            /*
            const user_script_sets = oDom.querySelector('#user-script-sets');
            const script_sets = [];
 
            for (const li of user_script_sets.querySelectorAll('li')) {
                // Get fav info
                const name = li.childNodes[0].nodeValue.trimRight();
                const link = li.children[0].href;
                const linkedit = li.children[1] ? li.children[1].href : 'https://greasyfork.org/' + $('#language-selector-locale').value + '/users/' + $('#nav-user-info>.user-profile-link>a').href.match(/[a-zA-Z\-]+\/users\/([^\/]*)/)[1] + '/sets/' + li.children[0].href.match(/[\?&]set=(\d+)/)[1] + '/edit';
 
                // Append to script_sets
                script_sets.push({
                    name: name,
                    link: link,
                    linkedit: linkedit
                });
            }
            */
            const script_sets = Array.from($(oDom, 'ul#user-script-sets').children).map(li => {
                try {
                    return {
                        name: li.children[0].innerText,
                        link: li.children[0].href,
                        linkedit: li.children[1].href
                    }
                } catch(err) {
                    DoLog(LogLevel.Error, [li, err, li.children.length, li.children[0]?.innerHTML, li.children[1]?.innerHTML], 'error');
                    Err(err);
                }
            });
 
            // Save to GM_storage
            GM_setValue('script-sets', {
                sets: script_sets,
                time: (new Date()).getTime(),
                version: '0.2'
            });
 
            // callback
            callback.apply(null, [script_sets].concat(args));
        });
    }
 
    function getUserpage() {
        const a = $('#nav-user-info>.user-profile-link>a');
        return a ? a.href : null;
    }
 
    function getInSet(set, sid, callback) {
        sid = sid.toString();
        getDocument(set.linkedit, oDom => {
            const inSet = [...$(oDom, '#script-set-scripts').children].some(input => input.value === sid);
            callback(inSet);
        });
    }
 
    function getInSets(sets, sid, callback) {
        const AM = new AsyncManager();
        const inSets = [];
        for (const set of sets) {
            AM.add();
            getInSet(set, sid, inSet => {
                inSet && inSets.push(set);
                AM.finish();
            });
        }
        AM.onfinish = e => {
            callback(inSets);
        };
        AM.finishEvent = true;
    }
 
    function getStrSID(url=location.href) {
        const API = getAPI(url);
        const strSID = API[2].match(/\d+/)[0];
        return strSID;
    }
 
    function getSID(url=location.href) {
        return Number(getStrSID(url));
    }
    // Basic functions
    function $APD(a,b) {return a.appendChild(b);}
 
    // Remove all childnodes from an element
    function clearChildnodes(element) {
        const cns = []
        for (const cn of element.childNodes) {
            cns.push(cn);
        }
        for (const cn of cns) {
            element.removeChild(cn);
        }
    }
 
    function getDocumentXHR(url, callback, args=[]) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.onloadstart = e => DoLog(LogLevel.Info, 'getting document with normal xhr, url=\'' + url + '\'');
        xhr.onload = e => {
            const htmlblob = xhr.response;
            parseDocument(htmlblob, callback, args);
        };
        xhr.send();
    }
 
    // Download and parse a url page into a html document(dom).
    // when xhr onload: callback.apply([dom, args])
    function getDocument(url, callback, args=[], retry=5) {
        GM_xmlhttpRequest({
            method       : 'GET',
            url          : url,
            responseType : 'blob',
            onloadstart  : function() {
                DoLog(LogLevel.Info, 'getting document, url=\'' + url + '\'');
            },
            onload       : function(response) {
                if (response.status === 200) {
                    const htmlblob = response.response;
                    parseDocument(htmlblob, callback, args);
                } else {
                    re(response);
                }
            },
            onerror: err => re(err)
        });
 
        function re(err) {
            DoLog(`Get document failed, retrying: (${retry}) ${url}`);
            --retry > 0 ? getDocument(url, callback, args=[], retry) : DoLog(LogLevel.Warning, err);
        }
    }
 
    function parseDocument(htmlblob, callback, args=[]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const htmlText = reader.result;
            const dom = new DOMParser().parseFromString(htmlText, 'text/html');
            args = [dom].concat(args);
            callback.apply(null, args);
            //callback(dom, htmlText);
        }
        reader.readAsText(htmlblob, document.characterSet);
    }
 
    // Copy text to clipboard (needs to be called in an user event)
    function copyText(text) {
        // Create a new textarea for copying
        const newInput = document.createElement('textarea');
        document.body.appendChild(newInput);
        newInput.value = text;
        newInput.select();
        document.execCommand('copy');
        document.body.removeChild(newInput);
    }
 
    // get '/' splited API array from a url
    function getAPI(url=location.href) {
        return url.replace(/https?:\/\/(.*?\.){1,2}.*?\//, '').replace(/\?.*/, '').match(/[^\/]+?(?=(\/|$))/g);
    }
 
    // get host part from a url(includes '^https://', '/$')
    function getHost(url=location.href) {
        const match = location.href.match(/https?:\/\/[^\/]+\//);
        return match ? match[0] : match;
    }
 
    function toAbsoluteURL(relativeURL, base=`${location.protocol}//${location.host}/`) {
        return new URL(relativeURL, base).href;
    }
 
    function randint(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
})();