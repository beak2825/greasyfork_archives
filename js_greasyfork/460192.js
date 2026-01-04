// ==UserScript==
// @name              Luogu Helper
// @name:zh-CN        洛谷助手
// @description       Print elegantly | Show difficulty
// @description:zh-CN 优雅打印 | 显示难度
// @namespace         work.pythoner
// @match             *://*.luogu.com.cn/*
// @require           https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @run-at            document-end
// @grant             GM_registerMenuCommand
// @grant             GM_xmlhttpRequest
// @grant             GM_listValues
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_deleteValue
// @grant             GM_log
// @version           1.0
// @author            Hanson Hu
// @homepage          https://blog.pythoner.work
// @icon              https://blog.pythoner.work/favicon.ico
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/460192/Luogu%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/460192/Luogu%20Helper.meta.js
// ==/UserScript==

$.noConflict();
jQuery(document).ready(function() {

    function getToday() {
        // local tz
        let ret = new Date().toLocaleString('sv').slice(0, 10);
        return ret;
    }

    function getTail(str) {
        let index = str.lastIndexOf('\/');
        return str.substring(index + 1, str.length);
    }

    function getCache(key) {
        const value = GM_getValue(key);
        if (value === undefined) return false;
        const obj = JSON.parse(value);
        const curr = Date.now();
        if (curr - obj.time > CACHE_LIFESPAN) {
            GM_deleteValue(key);
            GM_log('Deleted key ' + key);
            return false;
        } else {
            return obj.data;
        }
    }

    function setCache(key, value) {
        const curr = Date.now();
        GM_setValue(key, JSON.stringify({data: value, time: curr}));
        GM_log('Added key ' + key);
    }

    function getCFDifficulty() {
        let ret = getCache(pnum);
        if (ret) return ret;
        const re = /CF(\d+)(\w+)/;
        let t1 = re.exec(pnum)[1],
            t2 = re.exec(pnum)[2];
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://codeforces.com/problemset/problem/' +
                 t1 + '/' + t2,
            // synchronous is not supported
            synchronous: true,
            timeout: 10000,
            onload: function(response) {
                const re = /<span.+? title="Difficulty">\s*([*0-9]+)\s*<\/span>/,
                      html = response.responseText;
                ret = re.exec(html)[1];
                setCache(pnum, ret);
            },
            onerror: function(e) {
                console.error('Access CodeForces error ', e);
            },
            ontimeout: function(e) {
                console.error('Access CodeForces timeout ', e);
            }
        });
        return ret;
    }

    function showDifficulty() {
        let cfd = getCFDifficulty();
        if (cfd && !flag) {
            difficulty = cfd + '/' + difficulty;
            flag = true;
            jQuery('.side a[href^="/problem/list?difficulty="] span').text(difficulty);
        }
    }

    function getDeferredValue() {
        pnum = getTail(window.location.href);
        title = jQuery('.header h1 span').prop('title').replace(pnum, '').trim();
        problem = jQuery('.main .problem-card div').eq(1).html().trim();
        difficulty = jQuery('.side a[href^="/problem/list?difficulty="] span').text().trim();
        if (pnum.startsWith('CF')) showDifficulty();
    }

    function onClickPrint() {
        jQuery('#app').remove();

        let elem = '<h1 class="lfe-h1"><span title="' + title +
                   '">LG' + pnum + '. ' + title +
                   '</span></h1>';
        jQuery('body').append(elem);

        elem = '<div><p>' + difficulty + '</p></div>';
        jQuery('body').append(elem);

        elem = problem.replaceAll(/\sdata-v-\w+=""/g, '');
        jQuery('body').append(elem);

        elem = '<div style="position: absolute; top: 2px; right: 2px; ' +
               'font-family: Bahnschrift, Trebuchet MS, sans-serif; ' +
               'font-weight: lighter; font-stretch: condensed; ' +
               'font-size: 20px;">' + getToday() + '</div>';
        jQuery('body').append(elem);

        jQuery('.lfe-h1').css({'font-size': '1.5em', 'font-weight': 'normal'});
        jQuery('.lfe-h2').css('margin-bottom', '0');
        jQuery('.lfe-h3').css('margin-bottom', '0');
        jQuery('.sample .input').css({'border': '1px solid #eee', 'margin': '0.25em 0', 'padding': '0.25em'});
        jQuery('.sample .output').css({'border': '1px solid #eee', 'margin': '0.25em 0', 'padding': '0.25em'});
        jQuery('.sample .copy-btn').css('display', 'none');
        jQuery('body').css({'zoom': '80%', 'padding': '2em 3em 2em 3em', 'font-size': '14px'});
    }

    function onClickPurgeCache() {
        const curr = Date().now();
        let arr = new Array();
        for (const key of GM_listValues()) {
            const obj = JSON.parse(GM_getValue(key));
            if (curr - obj.time > CACHE_LIFESPAN) arr.push(key);
        }
        for (const key of arr) {
            GM_deleteValue(key);
            GM_log('Deleted key ' + key);
        }
    }

    GM_registerMenuCommand('Prepare to print', onClickPrint);
    GM_registerMenuCommand('Purge cache', onClickPurgeCache);

    const CACHE_LIFESPAN = 30 * 86400 * 1000;
    let pnum, title, problem, difficulty, flag = false;
    // Luogu load content lazily
    setTimeout(getDeferredValue, 1000);
    // update asynchronous result
    setTimeout(showDifficulty, 4000);

});
