// ==UserScript==
// @name         pakku advanced filter
// @namespace    http://s.xmcp.ml/pakkujs/
// @version      0.3
// @description  弹幕屏蔽Pro+
// @author       xmcp
// @match        *://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/42635/pakku%20advanced%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/42635/pakku%20advanced%20filter.meta.js
// ==/UserScript==

// 请先安装 [pakku](http://s.xmcp.ml/pakkujs/)

const NEED_UID = true; // 是否需要使用 cracked_uid 属性（慢）

// 屏蔽规则写在这个函数里
function do_filter(D) {
    var ret = [];
    D.forEach((d) => {
        ret.push(d.ir_obj);
    });
    return ret;
}

(function() {
    'use strict';

    function comp_ver(ver1, ver2) {
        ver1 = ver1.split('.').map( s => s.padStart(10) ).join('.');
        ver2 = ver2.split('.').map( s => s.padStart(10) ).join('.');
        return ver1 < ver2;
    }
    function check_ver(ver) {
        if(comp_ver(ver, '10.0'))
            alert('此版本的 pakku advanced filter 用户脚本依赖于 pakku 10.0 或更高版本');
    }

    let COMPLETED_TIME=-10000;

    addEventListener('message', function(e) {
        if(e.data.type==='pakku_event_danmaku_loaded') {
            if((+new Date())-COMPLETED_TIME<5000) return;
            check_ver(e.data.pakku_version||'0');
            if(NEED_UID) {
                postMessage({type: 'pakku_get_danmaku_with_uid'},'*');
            } else {
                postMessage({type: 'pakku_get_danmaku'},'*');
            }
        } else if(e.data.type==='pakku_got_danmaku') {
            const D=do_filter(e.data.resp);
            console.log('pakku advanced filter: '+D.length+' danmakus left');
            COMPLETED_TIME=(+new Date());
            window.postMessage({type: 'pakku_set_danmaku_bounce', danmakus: D},'*');
        }
    });
})();