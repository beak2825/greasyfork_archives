// ==UserScript==
// @name         box3破解防沉迷
// @version      0.1
// @description  破解防沉迷
// @author       hackcloth
// @match        https://box3.codemao.cn/p/*
// @match        https://box3.fun/p/*
// @icon         https://static.box3.codemao.cn/img/QmUX51Fo1NTRP5H4cQa4UMcTCP7ZhyDwLvQsKM2zbStdMJ_520_216_cover.avif
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @license      GPL
// @namespace    https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/476652/box3%E7%A0%B4%E8%A7%A3%E9%98%B2%E6%B2%89%E8%BF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/476652/box3%E7%A0%B4%E8%A7%A3%E9%98%B2%E6%B2%89%E8%BF%B7.meta.js
// ==/UserScript==

(function () {
    function a() {
        try {
            var box3CoreElement = document.querySelector('#react-container');
            var reactNodeName = Object.keys(box3CoreElement).filter((v) =>
                v.includes('reactContain')
            )[0];
            var core =
                box3CoreElement[reactNodeName].updateQueue.baseState.element.props.children
                    .props.children.props;
            window.core = core;
            document.func = document.querySelector('.desktop')._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props.state;
            return true;
        } catch (e) {
            console.warn(e)
            return undefined;
        };
    };
    if(a()){
        a();
        core.start();
        console.log(`box3防沉迷运行成功！`)
    }
    else{
        console.log(`box3防沉迷未知错误。`)
    }
})()