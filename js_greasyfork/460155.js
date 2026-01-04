// ==UserScript==
// @name         元素消除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  component remove
// @author       GulinCover
// @match        https://config.net.cn/tools/JsonFormat.html
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://www.baidu.com/*
// @include *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huift.com.cn
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/460155/%E5%85%83%E7%B4%A0%E6%B6%88%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/460155/%E5%85%83%E7%B4%A0%E6%B6%88%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectEle = {
        ins: null,
        display: null,
        border: null,
        borderRadius: null,
        isSelect: false
    };
    let stack = [];
    let body = document.querySelector('body');
    let mainWindow = document.createElement('div');
    mainWindow.style.position = 'fixed';
    mainWindow.style.zIndex = '999999';
    mainWindow.style.top = '16px';
    mainWindow.style.right = '16px';
    mainWindow.style.border = '1px solid gray';
    mainWindow.style.borderRadius = '8px';
    mainWindow.style.padding = '8px';
    mainWindow.style.backgroundColor = 'white';
    mainWindow.innerHTML = '<div>' +
        '<div id="close-btn"><button>关闭</button></div>' +
        '<div id="select-btn"><button>选择</button></div>' +
        '<div id="eliminate-btn"><button>消除</button></div>' +
        '<div id="revocation-btn"><button>撤销</button></div>' +
        '<div id="cancel-btn"><button>取消</button></div>' +
        '<div id="show-info"></div>' +
        '</div>';

    body.appendChild(mainWindow);
    body.addEventListener("click", e=>{
        if (selectEle.isSelect) {
            selectEle.ins = e.target;
            selectEle.display = e.target.style.display;
            selectEle.isSelect = false;
            selectEle.border = e.target.style.border;
            selectEle.borderRadius = e.target.style.borderRadius;
            e.target.style.border = '5px solid blue';
            e.target.style.borderRadius = '.375rem';
            showInfo.innerText = '已选择目标';
            e.stopPropagation();
            e.preventDefault();
        }
    });
    let showInfo = document.querySelector('#show-info');
    document.querySelector('#select-btn').addEventListener('click', e=>{
        selectEle.isSelect = true;
        showInfo.innerText = '请选择目标';
        e.stopPropagation();
    });

    document.querySelector('#close-btn').addEventListener('click', e=>{
        body.removeChild(mainWindow);
        e.stopPropagation();
    });

    document.querySelector('#cancel-btn').addEventListener('click', e=>{
        selectEle.ins.style.border = selectEle.border && selectEle.border.length > 0 ? selectEle.border : '';
        selectEle.ins.style.borderRadius = selectEle.borderRadius && selectEle.borderRadius.length > 0 ? selectEle.borderRadius : '';
        selectEle.isSelect = false;
        selectEle.ins = null;
        showInfo.innerText = '已取消';
        e.stopPropagation();
    });

    document.querySelector('#eliminate-btn').addEventListener('click', e=>{
        if (selectEle.ins) {
            stack.push(selectEle);
            selectEle.ins.style.display = 'none';
            showInfo.innerText = '已消除目标';
        }

        e.stopPropagation();
    });

    document.querySelector('#revocation-btn').addEventListener('click', e=>{
        if (stack.length > 0) {
            let pop = stack.pop();
            pop.ins.style.display = pop.display && pop.display.length > 0 ? pop.display : '';
            pop.ins.style.border = pop.border && pop.border.length > 0 ? pop.border : '';
            pop.ins.style.borderRadius = pop.borderRadius && pop.borderRadius.length > 0 ? pop.borderRadius : '';
            showInfo.innerText = '已撤销';
        }
        e.stopPropagation();
    });
})();