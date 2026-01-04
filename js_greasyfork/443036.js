// ==UserScript==
// @name         spm_Track_Block_Tool
// @namespace    _s7util__
// @version      0.7.5
// @description:en Remove [spm] track paramter in URL
// @description  移除链接中的spm跟踪参数
// @author       shc0743
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-3.0
// @supportURL   https://github.com/shc0743/MyUtility/issues/new
// @run-at       document-start
// @match        http*://*.bilibili.com/*
// @match        http*://*.baidu.com/*
// @match        http*://*.cctv.com/*
// @match        http*://*.taobao.com/*
// @match        http*://*.alibaba.com/*
// @exclude      http*://*.paypal.com/*
// @exclude      http*://*.alipay.com/*
// @downloadURL https://update.greasyfork.org/scripts/443049/spm_Track_Block_Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/443049/spm_Track_Block_Tool.meta.js
// ==/UserScript==

/*
Description:
说明:

    This user script removes the spm paramter in <a href> elements.
    此脚本移除 <a href> 元素中的spm参数。

    If it doesn't work, try refreshing it a few times or wait a while.
    若无法生效,请尝试刷新几次或等一会。

    Examples:
    示例:

    https://www.bilibili.com/video/av170001?spm_id_from=114514
    -> https://www.bilibili.com/video/av170001

    https://www.bilibili.com/video/av170001?query1=arg2&spm_id_from=114514&query2=data3
    -> https://www.bilibili.com/video/av170001?query1=arg2&query2=data3

    https://www.bilibili.com/video/av170001?spm=114514.1919810#hash
    -> https://www.bilibili.com/video/av170001#hash

    https://www.bilibili.com/video/av170001?spm=114514.1919810&query2=data3#hash1
    -> https://www.bilibili.com/video/av170001?query2=data3#hash1
*/

(function () {
    'use strict';

    // Your code here...

    var track_args_list = [
        // 以下是本脚本检测的跟踪参数，检测到后自动去除
        // 格式：  { 'domain': '应用到哪个网站，只要填顶级域名即可，例如www.baidu.com只要写baidu.com', 'keyword': '跟踪参数的名称' }
        { 'domain': '*', 'keyword': 'spm' },
        { 'domain': '*', 'keyword': 'spm_id_from' },
        { 'domain': '*', 'keyword': 'from_source' },
        { 'domain': 'bilibili.com', 'keyword': 'from' },
        { 'domain': 'bilibili.com', 'keyword': 'seid' },
        { 'domain': 'bilibili.com', 'keyword': 'vd_source' },
        { 'domain': 'bilibili.com', 'keyword': 'search_source' },
        { 'domain': 'baike.baidu.com', 'keyword': 'fr' },
        { 'domain': 'alibaba.com', 'keyword': 'tracelog' },
    ];
    var unwritable_list = [
        //// https://greasyfork.org/zh-CN/scripts/443049/discussions/132536
        //{ object: window, key: 'goldlog' },
    ];
    try {
        for (let i of unwritable_list) {
            Object.defineProperty(i.object, i.key, {
                get() { return undefined },
                set(value) { return !void (value) },
                enumerable: false,
                configurable: true
            });
        }
    }
    catch (error) {
        console.warn(error);
    }

return (function (global) {

    //var expr = /\?[\s\S]*spm/i;

    /**
     * 检测域名是否匹配，支持域名层级
     * @param {String} pattern 主域名
     * @param {String} str 要检测的域名，可以和主域名一样，也可以是主域名的子域名
     * @returns 匹配则返回true，否则false
     * @example DomainCheck('baidu.com', 'yiyan.baidu.com') === true
     * 注意：请自行进行类型检查，如果参数不是String则行为未知
    */
    const DomainCheck = function (pattern, str) {
        if (str === pattern) return true;
        pattern = '.' + pattern;
        if (str.endsWith(pattern)) return true;
        return false;
    };

    /**
     * 去除字符串中的spm参数
     * @param {String} str URL to remove spm
     * @returns 去除spm后的结果
    */
    const remove_spm = function (str) {
        // 新版方案，使用 URL 相关api操作
        try {
            const url = new URL(str, globalThis.location.href); // 构造URL对象
            // 改用此法后，可轻松处理  //search.bilibili.com/  之类的不以http(s)开头的链接
            // 对于url构造失败的（无效url之类的），回退到旧版基于字符串的方案

            const hostname = url.hostname;
            for (const i of track_args_list) {
                if (!(i.domain === '*' || DomainCheck(i.domain, hostname))) continue;
                if (url.searchParams.has(i.keyword)) { // 存在track参数!!!
                    url.searchParams.delete(i.keyword); // 去掉
                }
            }
            return url.href; // 优雅

        } catch (error) {
            // 回退到旧版方案
            return OLD__remove_spm(str);
        }
    };
    // 以下是旧版方案
    // 古语云：代码能跑就不要删
    var OLD__remove_spm = function (str) {
        if (typeof (str) != 'string') return str;
        var newstr = '';
        var len = str.length;
        // 只去除查询参数部分,避免正常url被替换而导致404
        var hash_part_begin = str.indexOf('#');
        var query_part_begin = str.indexOf('?');
        if (query_part_begin == -1 ||
            (hash_part_begin != -1 && query_part_begin > hash_part_begin))
            { return str; } // 没有查询参数或?在#后面,直接返回
        newstr = str.substring(0, query_part_begin);
        var domain = '';
        {
            let index = str.indexOf('://');
            if (index + 1) {
                index = str.indexOf('/', index + 3);
                if (index + 1) {
                    domain = str.substring(0, index);
                }
            }
        }

        for (let i = query_part_begin, need_break; i < len; ++i) {
            for (let j = 0; j < track_args_list.length; ++j) {
                if (!(track_args_list[j].domain == '*' ||
                    domain.indexOf(track_args_list[j].domain) != -1)) {
                    need_break = false;
                    break;
                }
                need_break = true;
                if (track_args_list[j].keyword == str.substring(i,
                    i + track_args_list[j].keyword.length - 0)) {
                    // 检测到
                    while ((++i) < len) {
                        if (str[i] == '&') { // 不能单独保留一个 & 号
                            i++;
                            break; // 去掉
                        }
                        if (str[i] == '#') break; // 保留hash部分
                    }
                    if (i == len) break; // 越界,直接break,以免url出现undefined
                }
                need_break = false;
            }
            if (need_break) break;
            newstr += str[i];
        }

        var _lastchar;
        for (let i = 0; i < newstr.length; ++i) {
            _lastchar = newstr[newstr.length - 1];
            if (_lastchar == '?' || _lastchar == '&') { // 如果移除后只剩下 ? 或 &
                newstr = newstr.substring(0, newstr.length - 1); // 去掉
            } else break;
        }
        // Bug-Fix:
        // https://example.com/example?q1=arg&spm=123#hash1
        // -> https://example.com/example?q1=arg&#hash1
        //     Invalid URL syntax at            ^^
        newstr = newstr.replace(/\&\#/igm, '#');
        newstr = newstr.replace(/\?\#/igm, '#');
        return newstr;
    }
    var test_spm = function (str) {
        const currentDomain = window.location.hostname;
        for (let tracker of track_args_list) {
            if (currentDomain.endsWith(tracker.domain) && new RegExp(tracker.keyword, 'i').test(str)) {
                return true;
            }
        }
        return false;
    };
    var _realwindowopen = window.open;
    var _realhistorypushState = window.history.pushState;
    var _realhistoryreplaceState = window.history.replaceState;

    /*var _link_click_test = function (val) {
        if (/\#/.test(val)) return true;
        if (/javascript\:/i.test(val)) return true;
        return false;
    };
    var _link_click = function (event) {
        if (_link_click_test(this.href)) return;
        event.preventDefault();
        // 防止被再次加入spm
        this.href = remove_spm(this.href);
        _realwindowopen(this.href, this.target || '_self');
        return false;
    };*/
    var _link_mouseover = function () {
        if (test_spm(this.href)) this.href = remove_spm(this.href);
    };
    var link_clean_worker = function (el) {
        if (test_spm(el.href)) {
            // 链接已经被加入spm , 需要移除
            el.href = remove_spm(el.href);
        }
    }
    var linkclickhandlerinit = function () {
        var el = document.querySelectorAll('a[href]');
        for (let i = el.length - 1; i >= 0; --i) {
            link_clean_worker(el[i]);
        }
    };

    try {
        let wopen = function (url, target, features) {
            return _realwindowopen.call(window,
                remove_spm(url),
                target,
                features);
        };
        let hp = function (data, title, url) {
            return _realhistorypushState.call(
                window.history, data, title,
                (typeof url === 'string') ? remove_spm(url) : url);
        };
        let hr = function (data, title, url) {
            return _realhistoryreplaceState.call(
                window.history, data, title,
                (typeof url === 'string') ? remove_spm(url) : url);
        };
        wopen.toString =
        hp.toString =
        hr.toString =
        ({ toString() { return 'function () { [native code] }' } }.toString);
        // 必须定义成 writable 否则一些网站(例如B站收藏夹页面)会出错
        Object.defineProperty(window, 'open', {
            value: wopen,
            writable: true,
            enumerable: true,
            configurable: true
        }); // 重定义window.open 以阻止弹出窗口中的spm
        Object.defineProperty(window.history, 'pushState', {
            value: hp,
            writable: true,
            enumerable: true,
            configurable: true
        }); // 重定义history.pushState
        Object.defineProperty(window.history, 'replaceState', {
            value: hr,
            writable: true,
            enumerable: true,
            configurable: true
        }); // 重定义history.replaceState

    }
    catch (error) {
        console.warn("This browser doesn't support redefining" +
            " window.open , so [SpmBlockTool] cannot remove" +
            " spm in popup window.\nError:", error);
    }

    var DOM_observer;
    let DOM_observer_observe = function () {
        DOM_observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });
    };
    DOM_observer = new MutationObserver(function (args) {
        //debugger
        // console.log('DOM changed: ', args);
        DOM_observer.disconnect();
        for (let i of args) {
            if (i.type == 'attributes') {
                link_clean_worker(i.target);
            }
            else if (i.type == 'childList') {
                for (let j of i.addedNodes) {
                    link_clean_worker(j);
                }
            }
        }
        DOM_observer.takeRecords();
        DOM_observer_observe();
    });

    window.addEventListener('DOMContentLoaded', function () {
        // window.setInterval(linkclickhandlerinit, 5000);
        new Promise(o => { linkclickhandlerinit(); o() }); // 异步执行

        DOM_observer_observe();
    });

    // 移除当前页面的spm
    // 当然,实际上spm已经在userscript加载前被发送到服务器,
    // 所以该功能仅美化url.
    // 如果要禁用该功能，删除下面一行开头的斜杠。
    //if(0)
    // Remove spm from current page
    // Of course, in fact, spm has been sent to the server
    // before userscript is loaded, so this function only beautifies the URL.
    // If you want to disable this feature, remove the slash
    // at the beginning of the following line:
    //if(0)
    if (test_spm(location.href)) {
        _realhistoryreplaceState.call(window.history,
            {}, document.title,
            remove_spm(location.href));
    }

    // https://greasyfork.org/zh-CN/scripts/443049/discussions/156657
    // https://greasyfork.org/zh-CN/scripts/443049/discussions/132536
    setInterval(function () {
        // 确认过了，只是检查页面有没有跟踪参数，不进行大范围DOM访问，性能开销可以忽略
        if (test_spm(location.href)) {
            // 2023.12.31改：鬼知道test_spm里面是什么屎山代码，元旦有时间了重构一下才发现一堆问题，
            // 又不敢删，斟酌后决定把此处延时由800改为5000
            _realhistoryreplaceState.call(window.history,
                {}, document.title,
                remove_spm(location.href));
        }
    }, 5000);

  // 修复cctv等网站去除goldlog后部分功能异常的bug
  const fakeGoldlog = {
        afterRecord() { },
        afterSendPV() { },
        aplusBridgeName() { },
        aplus_pubsub: { handlers: [], pubs: {} },
        appendMetaInfo() { },
        beforeRecord() { },
        beforeSendPV() { },
        cdnPath: "//g.alicdn.com",
        cloneDeep() { },
        create() { },
        extend() { },
        getCdnPath() { },
        getCookie() { },
        getMetaInfo() { },
        getParam() { },
        getPvId() { },
        isInternational() { },
        launch() { },
        lver: "8.10.5",
        nameStorage: window.localStorage,
        on() { },
        pv_context: {},
        pvid: "ffffffffffffff",
        record() { },
        recordUdata() { },
        req: window.location.href,
        send() { },
        sendPV() { },
        setMetaInfo() { },
        setPageSPM() { },
        spm_ab: ['X12345', 'xxxxxxxxxxxx']
    };
    const proxiedFakeGoldlog = new Proxy(fakeGoldlog, {
        set(target, p, newValue, receiver) {
            console.warn(new TypeError('Fuck you, alicdn goldlog'));
            Reflect.set(target, p, newValue, receiver);
            return true;
        }
    });
  Object.defineProperty(globalThis, 'goldlog', {
      get() { return proxiedFakeGoldlog },
      set(value) { return true },
      enumerable: true,
      configurable: false
  })

    /*
    // 测试代码
    var test_urls = [
        'https://www.bilibili.com/video/BV18X4y1N7Yh',
        'https://www.bilibili.com/video/BV18X4y1N7Yh?spm_id_from=114514',
        'https://www.bilibili.com/video/BV18X4y1N7Yh?spm=114514.1919810',
        'https://www.bilibili.com/video/BV18X4y1N7Yh?spm_id_from=114514.123',

        'https://www.bilibili.com/video/av170001',
        'https://www.bilibili.com/video/av170001?spm_id_from=114514',
        'https://www.bilibili.com/video/av170001?spm=114514.1919810',
        'https://www.bilibili.com/video/av170001?spm_id_from=114514.123',

        'https://www.bilibili.com/video/av170001?query1=arg2&spm_id_from=114514',
        'https://www.bilibili.com/video/av170001?query1=arg2&spm=114514.1919810',
        'https://www.bilibili.com/video/av170001?query1=arg2&spm_id_from=114514.123',
        'https://www.bilibili.com/video/av170001?query1=arg2&spm_id_from=114514',
        'https://www.bilibili.com/video/av170001?query1=arg2&spm=114514.1919810',
        'https://www.bilibili.com/video/av170001?query1=arg2&spm_id_from=114514.123',

        'https://www.bilibili.com/video/av170001?query1=arg2&spm_id_from=114514&query2=data3',
        'https://www.bilibili.com/video/av170001?query1=arg2&spm=114514.1919810&query2=data3',

        'https://www.bilibili.com/video/av170001?spm_id_from=114514#hash',
        'https://www.bilibili.com/video/av170001?query1=arg2&spm_id_from=114514#hash1',
        'https://www.bilibili.com/video/av170001?query1=arg2&spm=114514.1919810#hash1',

        'https://www.bilibili.com/video/av170001?spm_id_from=114514&query2=data3#hash1',
        'https://www.bilibili.com/video/av170001?spm=114514.1919810&query2=data3#hash1',
    ];
    for(let i=0;i<test_urls.length;++i){
        let el=document.createElement('a');
        el.href=test_urls[i];
        el.innerHTML=i+1 + '';
        document.documentElement.appendChild(el);
    }
    for(let i=0;i<test_urls.length;++i){
        let el=document.createElement('a');
        el.href=test_urls[i];
        el.innerHTML=i+1 + ' blank';
        el.target='_blank';
        document.documentElement.appendChild(el);
    }
    */

})(window);

})();
