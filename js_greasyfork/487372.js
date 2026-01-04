// ==UserScript==
// @name         Box3transparentSkin
// @namespace    https://box3.codemao.cn/
// @version      1.0
// @description  10s后自动切换透明皮肤
// @author       普洱
// @license      MIT
// @run-at       document-end
// @match        https://box3.codemao.cn/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/487372/Box3transparentSkin.user.js
// @updateURL https://update.greasyfork.org/scripts/487372/Box3transparentSkin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try{
        setTimeout(function () {
            
            const box3CoreElement = document.querySelector("#react-container");
            const reactNodeName=Object.keys(box3CoreElement).filter((v) =>v.includes('reactContain'))[0];
            const core=box3CoreElement[reactNodeName].updateQueue.baseState.element.props.children.props.children.props;
            window.core=core;
            core.setSkin({
                head: "none",
                hips: "none",
                leftFoot: "none",
                leftHand: "none",
                leftLowerArm: "none",
                leftLowerLeg: "none",
                leftShoulder: "none",
                leftUpperArm: "none",
                leftUpperLeg: "none",
                neck: "none",
                rightFoot: "none",
                rightHand: "none",
                rightLowerArm: "none",
                rightLowerLeg: "none",
                rightShoulder: "none",
                rightUpperArm: "none",
                rightUpperLeg: "none",
                torso: "none",
            });
        },10000);
    }catch(e){
        alert(e.message);
    }
})();