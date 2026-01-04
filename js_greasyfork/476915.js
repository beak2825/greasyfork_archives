// ==UserScript==
// @name         待办公文提交
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  公文代办自动提交
// @author       Lee-7723
// @match        http://cmoait.hq.cmcc/flow-view-it/*
// @icon         http://172.21.166.47:18031/isearchOA/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476915/%E5%BE%85%E5%8A%9E%E5%85%AC%E6%96%87%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/476915/%E5%BE%85%E5%8A%9E%E5%85%AC%E6%96%87%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let button = "#app > div > div > div.jdf-process-form-template-oa.jdf-process-template > div.process-btns > div > div > div:nth-child(3) > button"
    let a = "#app > div > div > div.jdf-process-form-template-oa.jdf-process-template > div.el-dialog__wrapper > div > div.el-dialog__body > div > div.onekey-list.jdf-card-table > div.jdf-onekey-table-scrollbar.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div > div > div.jdf-card-table__cell.el-col.el-col-4 > div > a.el-tooltip.jdf-mr10.el-link.el-link--default"

    let first = setInterval(function(){
        if(document.querySelector(button)){
            document.querySelector(button).click()
            let second = setInterval(function(){
                if(document.querySelector(a)){
                    document.querySelector(a).click()
                    clearInterval(second)
                    clearInterval(first)
                }
            }, 1000)
        }
    }, 1000)

    // Your code here...
        } )();