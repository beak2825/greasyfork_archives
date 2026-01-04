// ==UserScript==
// @name         @easyv-find events abnormal
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  easyv 查找事件异常组件
// @author       You
// @match        https://easyv.cloud/workspace/
// @icon         https://www.google.com/s2/favicons?domain=dtstack.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430149/%40easyv-find%20events%20abnormal.user.js
// @updateURL https://update.greasyfork.org/scripts/430149/%40easyv-find%20events%20abnormal.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    console.info('fetch loading....')
    const result = await fetch('https://easyv.cloud/api/easyv/v3/screen/export?id=356479').then(function(res){  return res.json() });
    console.log(result);
    main(result.data);
    // Your code here...
})();

async function main(data){
    data.componentsConfig && filterComponentsConfig(data.componentsConfig)

    if(data.panelConfig && data.panelConfig.length){
        data.panelConfig.forEach(d=>{
            d.stateConfig?.length && d.stateConfig.forEach(d=>{
                d && main(d);
            })
        })
    }
}



function filterComponentsConfig(componentsConfig){
    const events = componentsConfig.map(d=>{ return { events:JSON.parse(d.events),id:d.id } }).filter(d=>d.events.length);
    const actions = events.map(d=>{
        return {events:d.events.filter(d=> !d.id),id:d.id}
    }).flat(2).filter(d=>d.events.length);
    console.log(actions)
   // const actions
}