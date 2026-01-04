// ==UserScript==
// @name         Box3allSkin
// @namespace    https://box3.codemao.cn/
// @version      2.0
// @description  获取所有皮肤
// @author       普洱
// @license      MIT
// @run-at       document-end
// @match        https://box3.codemao.cn/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/487374/Box3allSkin.user.js
// @updateURL https://update.greasyfork.org/scripts/487374/Box3allSkin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try{
        setTimeout(function () {
            
            const box3CoreElement = document.querySelector("#react-container");
            const reactNodeName=Object.keys(box3CoreElement).filter((v) =>v.includes('reactContain'))[0];
            const core=box3CoreElement[reactNodeName].updateQueue.baseState.element.props.children.props.children.props;
            window.core=core;
            core.state.brpc.skin.api.getAll().then((a)=>(core.state.box3.state.secret.availableSkin = a.map((o) => o.name)));
        },1000);
    }catch(e){
        alert(e.message);
    }
})();