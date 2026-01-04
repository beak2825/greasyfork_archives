// ==UserScript==
// @name         快速打开tapd详情
// @namespace    l.r
// @version      0.0.1
// @description  帮助用户快速打开tapd详情
// @author       l.r
// @match        https://www.tapd.cn/*
// @match        http://www.tapd.cn/*
// @grant        none
// @license        GPLv3 License
// @downloadURL https://update.greasyfork.org/scripts/440525/%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80tapd%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/440525/%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80tapd%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.host !== 'www.tapd.cn') {
        return;
    }
    function dealTapdItem(mutationsList, observer) {
        observer.disconnect();
        const titleAndUrlDoms = document.querySelectorAll('.board-main .card-head');
        if (titleAndUrlDoms.length === 0) {
            return;
        }
        const pointDivStyle = {
            position: 'absolute',
            background: '#5d9bfc',
            height: '25px',
            width: '25px',
            borderRadius: '50%',
            bottom: '0',
            right: '-10px',
            textAlign: 'center',
            lineHeight: '23px',
            color: '#fff'
        };
        function renderPointDivStyle(dom, style) {
            for (const key in style) {
                dom.style[key] = style[key];
            }
        }
        function bindPointDivEvent(dom, eventType = 'click', handler) {
            dom.addEventListener(eventType, handler);
        }
        function addPointDiv(parentDom) {
            const urlReg = /(((ht|f)tps?):\/\/)+[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
            const urlRegResult = urlReg.exec(String(parentDom.innerText));
            if (!urlRegResult) {
                return;
            }
            const [url] = urlRegResult;
            parentDom.style.position = 'relative';
            const pointDiv = document.createElement('div');
            pointDiv.innerHTML = 'D';
            renderPointDivStyle(pointDiv, pointDivStyle);
            bindPointDivEvent(pointDiv, 'click', event => {
                event.stopPropagation();
                window.open(url);
            });
            parentDom.append(pointDiv);
        }
        for (const titleAndUrlDom of titleAndUrlDoms) {
            addPointDiv(titleAndUrlDom);
        }
    }

    const targetNode = document.querySelector('.board-main');
    const observerOptions = {
        childList: true,
        subtree: true
    };
    const observer = new MutationObserver(dealTapdItem);
    observer.observe(targetNode, observerOptions);
})();
