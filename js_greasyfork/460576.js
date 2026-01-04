// ==UserScript==
// @name        千川/本地一键勾选指标
// @namespace   Violentmonkey Scripts
// @match       *://qianchuan.jinritemai.com/*
// @match       *://localads.chengzijianzhan.cn/*
// @match       *://local-ads.bytedance.net/*
// @grant       none
// @version     1.3
// @author      wangzan.22
// @description 2023/11/16 19:38:28
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/460576/%E5%8D%83%E5%B7%9D%E6%9C%AC%E5%9C%B0%E4%B8%80%E9%94%AE%E5%8B%BE%E9%80%89%E6%8C%87%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/460576/%E5%8D%83%E5%B7%9D%E6%9C%AC%E5%9C%B0%E4%B8%80%E9%94%AE%E5%8B%BE%E9%80%89%E6%8C%87%E6%A0%87.meta.js
// ==/UserScript==

function selectAllMetrics(selection){
  let metrics_inputs = [];

  if (metrics_inputs.length == 0){
    metrics_inputs = document.querySelectorAll('#selectListContainer .checkbox-item input'); //本地推旧
  }
  if (metrics_inputs.length == 0){
    metrics_inputs = document.querySelectorAll('.selectListContainer .checkboxItem input'); //本地推受众
  }
  if (metrics_inputs.length == 0){
    metrics_inputs = document.querySelectorAll('.metric-select-area .ovui-checkbox__input'); //本地一致性组件
  }

  if (metrics_inputs.length == 0){
    metrics_inputs = document.querySelectorAll('.select-list-container .byted-checkbox input'); //千川旧组件
  }
  if (metrics_inputs.length == 0){
    metrics_inputs = document.querySelectorAll('.select-list-container .select-list input'); //千川竞价/全域推广v2
  }
  if (metrics_inputs.length == 0){
    metrics_inputs = document.querySelectorAll('.bui-modal-content .detail-chx input'); //千川品牌推广
  }

  //选择全部
  for(let i = 0; i < metrics_inputs.length; i++) {
    if(selection){
      if(!metrics_inputs[i].checked) {
        metrics_inputs[i].click();
      }
    }else {
      if(metrics_inputs[i].checked) {
        metrics_inputs[i].click();
      }
    }

  }
}

window.onkeydown = function (event) {
  'use strict';
  //按ctrl+A 选择所有指标
  if(event.ctrlKey && event.keyCode === 65){
    selectAllMetrics(true);
  }
  //按ctrl+S 取消选择所有指标
  if(event.ctrlKey && event.keyCode === 83){
    selectAllMetrics(false);
  }
}