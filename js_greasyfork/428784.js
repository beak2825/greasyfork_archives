// ==UserScript==
// @name         USTB everywhere
// @namespace    ustb_vpn
// @version      1.0
// @description  访问你所想
// @author       Hunsh
// @match        https://n.ustb.edu.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428784/USTB%20everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/428784/USTB%20everywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.location.host === "n.ustb.edu.cn") {
        var a=document.createElement('div');
        a.className="portal-container first";
        a.innerHTML='<div class="go-input-box" style="margin-top:-30px;margin-bottom:25px;position: relative;"><div class="layui-input-inline" style=""><select id="protocolType" name="protocol" class="layui-wrd-select layui-input" style="padding: 0 16px;margin-right:-1px;height: 44px;font-size: 14px;"><option value="https" selected>https</option><option value="http">http</option><option value="ssh">ssh</option><option value="rdp">rdp</option><option value="telnet">telnet</option><option value="vnc">vnc</option></select></div><input name="goUrl" class="go-input layui-input" type="text" id="go_url" style="display: inline-block;width: 720px;box-sizing: border-box;padding: 20px;height: 44px;border-radius: 0;vertical-align: middle;"><button id="go" type="button" class="go-button layui-btn layui-btn-lg layui-btn-normal" style="width: 140px;">访问</button></div>'
        var b=document.querySelector('.vpn-content-block__title');
        b.parentElement.insertBefore(a, b);
        $("#go").click(function () {
            go(document.getElementById('go_url').value);
        });
    }
})();