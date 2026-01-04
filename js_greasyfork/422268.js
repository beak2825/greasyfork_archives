// ==UserScript==
// @name         convert2vmess
// @namespace    http://tampermonkey.net/
// @version      0.5
// @author       hello world
// @description  test
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.6.0/base64.min.js
// @match        https://cdn.jsdelivr.net/gh/Alvin9999/PAC@latest/guiNConfig.json
// @match        https://gitlab.com/free9999/ipupdate/-/raw/master/v2rayN/guiNConfig.json
// @match        https://gitlab.com/free9999/ipupdate/-/raw/master/v2rayN/2/guiNConfig.json
// @match        https://cdn.jsdelivr.net/gh/Alvin9999/PAC@latest/2/guiNConfig.json
// @downloadURL https://update.greasyfork.org/scripts/422268/convert2vmess.user.js
// @updateURL https://update.greasyfork.org/scripts/422268/convert2vmess.meta.js
// ==/UserScript==

(function (){
    'use strict';
    var origin_data = $.parseJSON(document.getElementsByTagName("pre")[0].innerHTML);
    var vmess_data = origin_data.vmess[0];
    var export_data = {};

    export_data.v = String(vmess_data.configVersion);
    export_data.ps = vmess_data.remarks;
    export_data.add = vmess_data.address;
    export_data.port = String(vmess_data.port);
    export_data.id = vmess_data.id;
    export_data.aid = String(vmess_data.alterId);
    export_data.net = vmess_data.network;
    export_data.type = vmess_data.headerType;
    export_data.host = vmess_data.requestHost;
    export_data.path = vmess_data.path;
    export_data.tls = vmess_data.streamSecurity;

    var vmess_base64 = "vmess://" + Base64.encode(JSON.stringify(export_data));
    
    var jqueryScriptBlock = document.createElement('a');
    jqueryScriptBlock.href = vmess_base64;
    jqueryScriptBlock.innerHTML = "vmess";
    $(document.body).append(jqueryScriptBlock)
})();