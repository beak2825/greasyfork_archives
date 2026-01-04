// ==UserScript==
// @name         Age downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  download video from agefans.cc
// @author       CodeHz
// @match        https://www.agefans.cc/*
// @match        https://www.agefans.vip/*
// @match        https://www.agefans.live/*
// @icon         https://www.google.com/s2/favicons?domain=agefans.cc
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/430006/Age%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/430006/Age%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function __getset_play(_in_id, cb_getplay_url, cb_cnt){
        const _url = window.location.href;
        const _rand = Math.random();
        const _getplay_url = cb_getplay_url();
        $.get(_getplay_url, function(_in_data, _in_status){
            if('err:timeout' == _in_data){
                if(cb_cnt > 0){
                    __getplay_pck();
                    __getplay_pck2();
                    return __getset_play(_in_id, cb_getplay_url, cb_cnt-1);
                }else {
                    return false;
                }
            }

            //
            if(__ipchk_getplay(_in_data)){
                return false;
            }

            //
            const _json_obj = JSON.parse(_in_data);
            const _purl = _json_obj['purl'];
            const _vurl = _json_obj['vurl'];
            const _play_ex = _json_obj['ex'];
            const vlt_lr = __get_vlt_lr(_play_ex);

            const durl = decodeURIComponent(_vurl);

            const url = JSON.stringify(durl);

            document.getElementById(_in_id).srcdoc = `<a href=${url}>下载地址${durl}</a>`


          return true;
            });
        //
        return false;
    }

    window.__yx_SetMainPlayIFrameSRC = function (_in_id, cb_getplay_url) {
        __getset_play(_in_id, cb_getplay_url, 3);
    }
})();