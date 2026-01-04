// ==UserScript==
// @name         guangdong-MY
// @namespace    http://tampermonkey.net/
// @version      V0.1
// @description  get data from guangdong
// @author       wei
// @match        https://pm.gd.csg.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/537499/guangdong-MY.user.js
// @updateURL https://update.greasyfork.org/scripts/537499/guangdong-MY.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let _token = localStorage.getItem('pfxh-token')
    $.ajax({
        url: '/pfxh/qctc-pm-trade-market-out-plzx/PublishInfoCx/publishTermAll',
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${_token}`
        },
        data: {
            type: 'yc',
            pdate: '2025-05-13'
        },
        success: function(res) {
            console.log(res)
        },
        error: function(err) {
            console.log(err);
        }
    });
})