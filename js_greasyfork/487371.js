// ==UserScript==
// @name         Box3limit
// @namespace    https://box3.codemao.cn/
// @version      1.0
// @description  破解时间限制
// @author       普洱
// @license      MIT
// @run-at       document-end
// @match        https://box3.codemao.cn/p/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/487371/Box3limit.user.js
// @updateURL https://update.greasyfork.org/scripts/487371/Box3limit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert("limit Start");//key
    try{
        setTimeout(function () {
            
            const box3CoreElement = document.querySelector("#react-container");
            const reactNodeName=Object.keys(box3CoreElement).filter((v) =>v.includes('reactContain'))[0];
            const core=box3CoreElement[reactNodeName].updateQueue.baseState.element.props.children.props.children.props;
            window.core=core;
            core.state.box3.state.config.admin= true;
            core.state.box3.state.config.development= true;
            core.state.box3.state.config.netPaused= false;
            alert("limit Success");
            console.log(core);
        },0);
    }catch(e){
        alert(e.message);
    }
})();