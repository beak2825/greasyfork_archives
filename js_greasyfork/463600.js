// ==UserScript==
// @name         YardHealth_Generator_2.0
// @namespace    *.amazon.*
// @version      2.09
// @description  YardHealth Report generation script
// @author       rzlotos
// @match        https://trans-logistics-eu.amazon.com/yms/shipclerk/*
// @match        http://127.0.0.1:8080/yms
// @match        http://127.0.0.1:5500/*
// @match        https://fc.tools.amazon.dev/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        unsafeWindow
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463600/YardHealth_Generator_20.user.js
// @updateURL https://update.greasyfork.org/scripts/463600/YardHealth_Generator_20.meta.js
// ==/UserScript==
const version = 2.09;

(async ()=>{
    'use strict';
    unsafeWindow.window.yh_report_present = true;
    unsafeWindow.window.yh_report_script_version = version;

    window.addEventListener("load", async (event) => { //Attach event
    if(/yms+/g.exec(window.location.pathname)){
        await GM.setValue('yh_request_data', JSON.stringify({ user_alias: unsafeWindow.window.TCPWidgetParams.split('::')[1], fc_code: unsafeWindow.window.TCPWidgetParams.split('::')[0], epoch: Date.now(), time: `${new Date().toDateString()} ${new Date().toTimeString()}`, t: unsafeWindow.window.ymsSecurityToken }));
        if(!document.body.contains(document.getElementById('YH_btn'))){
            document.getElementById("title-block").appendChild( Object.assign( document.createElement('div'),
            {
              id: 'YH_btn', style: 'position:absolute;left:20em;',
              onclick: ()=>{
                    if(!/s/g.exec(window.location.protocol)){ window.open(`${window.location.protocol}//${window.location.hostname}:5500?app=yard_health`, '_blank'); }
                    else window.open("https://fc.tools.amazon.dev?app=yard_health", '_blank');
              }, innerHTML: '<button id="YH_report" type="button" class="a-button a-button-thumbnail a-spacing-none a-button-base float-left start" style="position:absolute;padding:revert;font-size:12px;">YardHealth</button>'
            }))
        }
    }
    else if(/yard_health+/g.exec(window.location.pathname))
    {
      unsafeWindow.window.yh_request_data = JSON.parse(await GM.getValue('yh_request_data'));
      unsafeWindow.window.dispatchEvent(new Event('yh_script_ready'));
    }
    });
})();