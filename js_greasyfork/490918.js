// ==UserScript==
// @name         Controllable
// @namespace    https://box3.codemao.cn/
// @version      2.0
// @description  added Rein
// @author       Qih
// @license      MIT
// @run-at       document-end
// @match        https://box3.codemao.cn/p/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/490918/Controllable.user.js
// @updateURL https://update.greasyfork.org/scripts/490918/Controllable.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert("Rein");//key
    try{
        setTimeout(function () {
            const ok=prompt("ok");
            
            const box3CoreElement = document.querySelector("#react-container");
            const reactNodeName=Object.keys(box3CoreElement).filter((v) =>v.includes('reactContain'))[0];
            const core=box3CoreElement[reactNodeName].updateQueue.baseState.element.props.children.props.children.props;
            //core.state.box3.state.config.admin= true;
            //core.state.box3.state.config.development= true;
            //alert();
            window.core=core;setTimeout(function(){try{if(true){for(let aaaa=0;aaaa<ok;aaaa++){core.state.box3.net._protocol.server.message.join();}}}catch(e){alert(e.message);}},1000);//while true do
            
        },500);
    }catch(e){
        alert(e.message);
    }
})();