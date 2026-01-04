// ==UserScript==
// @name         MCBBS 动态链接转伪静态 (支持吾爱破解)
// @namespace    https://github.com/404.html
// @version      0.4.4.8
// @license      AGPLv3 or later
// @description  将动态链接转为伪静态链接
// @author       axototl
// @match        *://*/forum.php
// @match        *://*/plugin.php
// @icon         https://www.mcbbs.net/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @run-at       document-body
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/456708/MCBBS%20%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5%E8%BD%AC%E4%BC%AA%E9%9D%99%E6%80%81%20%28%E6%94%AF%E6%8C%81%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456708/MCBBS%20%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5%E8%BD%AC%E4%BC%AA%E9%9D%99%E6%80%81%20%28%E6%94%AF%E6%8C%81%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%29.meta.js
// ==/UserScript==

'use strict';

let config = {
    get sethash() {
        let tmp = GM_getValue("sethash") ?? (GM_setValue("sethash", true), true);
        return tmp;
    },
    set sethash(val) {
        GM_setValue("sethash", val);
    }
};

(() => {
    const params = new URL(location.href).searchParams;
    if (params.get("goto") == "lastpost") return;
    if (params.get("mod") == "viewthread") {
        const tid = params.get("tid");
        if (!tid) return;
        const page = params.get("page") || 1;
        history.replaceState(null, "", `${location.protocol}//${location.host}/thread-${tid}-${page}-1.html${config.sethash ? location.hash : ""}`);
    } else if (params.get("id") == "link_redirect") // skip alert.
        location.assign(params.get("target"));
})();

(() => {
    const tips = ["×定位到原贴(点击以启用)", "√定位到原贴（点击以禁用）"];
    var srid = GM_registerMenuCommand(tips[config.sethash|0], changer);
    GM_addValueChangeListener("sethash", (_1, _2, nv, remote) => {
        if (!remote) return;
        GM_unregisterMenuCommand(srid);
        srid = GM_registerMenuCommand(tips[nv | 0], changer);
    });
    function changer(){
        let hash = config.sethash;
        config.sethash = hash = !hash;
        GM_unregisterMenuCommand(srid);
        srid = GM_registerMenuCommand(tips[hash | 0], changer);
    }
})();

// https://www.mcbbs.net/plugin.php?id=link_redirect&target=123