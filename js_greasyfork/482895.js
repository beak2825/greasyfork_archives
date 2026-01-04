// ==UserScript==
// @name         破解Box3代码岛防沉迷限制
// @namespace    https://viayoo.com/
// @version      3.0
// @description  3.0更新:增加获取全皮肤功能，10秒后自动换成无皮肤（透明），手机版增加成功率。弹出第一个弹窗关闭就行,第二个弹窗为success为成功(可能需要多次刷新)
// @author       Qih
// @license      MIT
// @run-at       document-end
// @match        https://box3.codemao.cn/p/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/482895/%E7%A0%B4%E8%A7%A3Box3%E4%BB%A3%E7%A0%81%E5%B2%9B%E9%98%B2%E6%B2%89%E8%BF%B7%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/482895/%E7%A0%B4%E8%A7%A3Box3%E4%BB%A3%E7%A0%81%E5%B2%9B%E9%98%B2%E6%B2%89%E8%BF%B7%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert("");//key
    try{
        setTimeout(function () {
            const box3CoreElement = document.querySelector("#react-container");
            const reactNodeName=Object.keys(box3CoreElement).filter((v) =>v.includes('reactContain'))[0];
            const core=box3CoreElement[reactNodeName].updateQueue.baseState.element.props.children.props.children.props;
            window.core=core;
            core.state.box3.state. config.admin= true;
            core.state.box3.state.config.development= true;
            core.state.box3.state.config.netPaused= true;
            alert("success");
            setTimeout(function(){
                core.state.brpc.skin.api.getAll().then((a)=>(core.state.box3.state.secret.availableSkin = a.map((o) => o.name)));
                setTimeout(function(){core.setSkin({
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
                  });alert("已更换透明皮肤");},10000);
            },1000);
        },0);
    }catch(e){
        alert(e.message);
    }
})();