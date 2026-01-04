// ==UserScript==
// @name         旧版天眼（直梯监督检验）
// @namespace    http://tampermonkey.net/
// @version      0.115
// @description  The main function is to verify the correctness of the report, only to provide suggestions
// @author       You
// @match        http://111.51.123.233:8088/stj-web/index/inspect/report/toReportInput.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=123.233
// @require https://update.greasyfork.org/scripts/489285/1339465/ZhitiJ.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489287/%E6%97%A7%E7%89%88%E5%A4%A9%E7%9C%BC%EF%BC%88%E7%9B%B4%E6%A2%AF%E7%9B%91%E7%9D%A3%E6%A3%80%E9%AA%8C%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/489287/%E6%97%A7%E7%89%88%E5%A4%A9%E7%9C%BC%EF%BC%88%E7%9B%B4%E6%A2%AF%E7%9B%91%E7%9D%A3%E6%A3%80%E9%AA%8C%EF%BC%89.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
  var host = 'http://14.29.190.187:54223/',
        rate = GM_getValue('unrivalrate', '1'),
        ctUrl = 'https://cx.icodef.com/wyn-nb?v=4',
        getQueryVariable = (variable) => {
            let q = _l.search.substring(1),
                v = q.split("&"),
                r = false;
            for (let i = 0, l = v.length; i < l; i++) {
                let p = v[i].split("=");
                p[0] == variable && (r = p[1]);
            }
            return r;
        },
        getCookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift(),
        isCat = GM_info.scriptHandler == 'ScriptCat',
        _w = unsafeWindow,
        _d = _w.document,
        _l = _w.location,
        _p = _l.protocol,
        _h = _l.host,
        //isEdge = _w.navigator.userAgent.includes("Edg/"),
        isFf = _w.navigator.userAgent.includes("Firefox"),
        isMobile = _w.navigator.userAgent.includes("Android"),
        stop = false,
        handleImgs = (s) => {
            imgEs = s.match(/(<img([^>]*)>)/);
            if (imgEs) {
                for (let j = 0, k = imgEs.length; j < k; j++) {
                    let urls = imgEs[j].match(
                        /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/),
                        url;
                    if (urls) {
                        url = urls[0].replace(/http[s]?:\/\//, '');
                        s = s.replaceAll(imgEs[j], url);
                    }
                }
            }
            return s;
        },
        trim = (s) => {
            return handleImgs(s).replaceAll('javascript:void(0);', '').replaceAll("&nbsp;", '').replaceAll("，", ',').replaceAll(
                "。", '.').replaceAll("：", ':').replaceAll("；",
                    ';').replaceAll("？", '?').replaceAll("（", '(').replaceAll("）", ')').replaceAll("“", '"')
                .replaceAll("”", '"').replaceAll("！", '!').replaceAll("-", ' ').replace(/(<([^>]+)>)/ig, '')
                .replace(/^\s+/ig, '').replace(/\s+$/ig, '');
        },
        cVersion = 999,
        classId = getQueryVariable('clazzid') || getQueryVariable('clazzId') || getQueryVariable('classid') ||
            getQueryVariable('classId'),
        courseId = getQueryVariable('courseid') || getQueryVariable('courseId'),
        UID = getCookie('_uid') || getCookie('UID'),
        FID = getCookie('fid'),
        jq = _w.top.$ || _w.top.jQuery;
    _w.confirm = (msg) => {
        return true;
    }
})();