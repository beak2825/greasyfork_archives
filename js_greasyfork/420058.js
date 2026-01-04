// ==UserScript==
// @name         NGA Author Jump
// @namespace    Hieuzest
// @version      0.2
// @description  Help jump to original thread when use author-only mode
// @author       Hieuzest
// @match        *://nga.178.com/read.php*
// @match        *://nga.178.com/thread.php*
// @match        *://ngabbs.com/read.php*
// @match        *://ngabbs.com/thread.php*
// @match        *://bbs.nga.cn/read.php*
// @match        *://bbs.nga.cn/thread.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/420058/NGA%20Author%20Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/420058/NGA%20Author%20Jump.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    function setCookie(c_name, value, expiredays) {
        let exdate = new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ?
                                                          "" :
                                                          ";expires="+exdate.toUTCString());
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    */

    function save(key, value) {
        GM_setValue(key, value);
    }

    function load(key) {
        return GM_getValue(key);
    }

    class Dep {
        constructor(name){
            this.id = new Date()
            this.subs = []
        }
        defined(){
            Dep.watch.add(this);
        }
        notify() {
            this.subs.forEach((e, i) => {
                if(typeof e.update === 'function'){
                    try {
                        e.update.apply(e)
                    } catch(err){
                        console.warr(err)
                    }
                }
            })
        }
    }
    Dep.watch = null;
    class Watch {
        constructor(name, fn){
            this.name = name;
            this.id = new Date();
            this.callBack = fn;
        }
        add(dep) {
            dep.subs.push(this);
        }
        update() {
            var cb = this.callBack;
            cb(this.name);
        }
    }


    var addHistoryMethod = (function(){
        var historyDep = new Dep();
        return function(name) {
            if(name === 'historychange'){
                return function(name, fn){
                    var event = new Watch(name, fn)
                    Dep.watch = event;
                    historyDep.defined();
                    Dep.watch = null;
                }
            } else if(name === 'pushState' || name === 'replaceState') {
                var method = history[name];
                return function(){
                    method.apply(history, arguments);
                    historyDep.notify();
                }
            }
        }
    }())

    window.addHistoryListener = addHistoryMethod('historychange');
    history.pushState = addHistoryMethod('pushState');
    history.replaceState = addHistoryMethod('replaceState');


    function GetRequestParamValue(url, paras) {
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {}
        paraString.forEach(para => {
            paraObj[para.substring(0, para.indexOf("=")).toLowerCase()] = para.substring(para.indexOf("=") + 1, para.length);
        })
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof (returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    }


    function GetFirstThreadTimestampOfPage(doc) {
        let flt = doc.querySelectorAll('.postInfo')[0].children[0].textContent;
        let flts = Date.parse(flt);
        return flts;
    }

    async function GetThreadPageNum(tid) {
        let html = await fetch(`/read.php?tid=${tid}`).then(r => r.text());
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        let el = doc.querySelector('#pagebbtm script');
        let script = el.text;
        script = script.slice(script.indexOf('=') + 1, script.indexOf(';'));
        script = script.slice(script.indexOf(','));
        script = script.slice(script.indexOf(':') + 1);
        script = script.slice(0, script.indexOf(','));
        return parseInt(script);
    }

    async function main() {
        if (document.URL.indexOf('/read.php') === -1) return;

        let tid = GetRequestParamValue(document.URL, 'tid');
        let pageCurrent = GetRequestParamValue(document.URL, 'page');

        let pageMax = await GetThreadPageNum(tid);
        let pageStart = 1;
        let pageEnd = pageMax;
        let tsOfPages = new Array(pageMax + 1);
        tsOfPages[0] = 0;

        console.log('Initializing NGA Author Jump');
        await GetThreadPageNum(tid);

        let cached = false;

        /*if (getCookie(`_nga_jump_ts_pages_${tid}`)) {
            console.log('Loading cookie ...');
            tsOfPages = JSON.parse(unescape(getCookie(`_nga_jump_ts_pages_${tid}`)));
            cached = true;
        } else if (window._nga_tsOfPages !== undefined && window._nga_tid !== undefined && window._nga_tid === tid) {
            console.log('Loading cache ...');
            tsOfPages = window._nga_tsOfPages;
            cached = true;
        } else */
        if (load(`_nga_jump_ts_pages_${tid}`)) {
            console.log('Loading saved data ...');
            tsOfPages = JSON.parse(unescape(load(`_nga_jump_ts_pages_${tid}`)));
            cached = true;
        }
        console.log(tsOfPages);
        if (!cached || tsOfPages.length <= pageMax || !tsOfPages.slice(1).every(x => x)) {

            if (tsOfPages.length <= pageMax) pageStart = tsOfPages.length;

            console.log(`Process ${tid}:${pageCurrent}:${pageMax} through ${pageStart}:${pageEnd}`);

            while (tsOfPages.length <= pageMax) { tsOfPages.push(null); }

            let promises = [];

            for (let p = pageStart; p <= pageEnd; p++) {
                promises.push(fetch(`/read.php?tid=${tid}&page=${p}`)
                              .then(r => r.text())
                              .then(html => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, 'text/html');
                    let ts = GetFirstThreadTimestampOfPage(doc);
                    console.log(p, ts);
                    tsOfPages[p] = ts;
                }));
            }

            await Promise.all(promises);

            window._nga_tid = tid;
            window._nga_tsOfPages = tsOfPages;

            save(`_nga_jump_ts_pages_${tid}`, JSON.stringify(tsOfPages))
            console.log('Thread data saved.');
        }

        const JUMP_ID = 'jump_link';

        document.querySelectorAll('span[class^=posterinfo] span.right').forEach(el => {

            for (let child of el.children) {
                if (child.id === JUMP_ID) child.remove()
            }

            let index = parseInt(el.children[0].name.slice(1));
            let pidIndex = el.children[0].href.lastIndexOf('#');
            let pidString = pidIndex === -1 ? "" : el.children[0].href.slice(pidIndex);

            let elJump = document.createElement('a');
            elJump.id = JUMP_ID;
            elJump.className = el.children[0].className;
            elJump.text = "→";
            let ts = Date.parse(el.parentElement.parentElement.parentElement.parentElement.querySelector('span[id^=postdate]').textContent);
            let page = tsOfPages.findIndex(tsP => ts < tsP) - 1;
            if (page < 0) page = pageMax;
            elJump.href = `/read.php?tid=${tid}&page=${page}${pidString}`;
            el.appendChild(elJump);
        })

    }

    window.addHistoryListener('history', main);

    main();

})();