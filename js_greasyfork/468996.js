// ==UserScript==
// @name        weekend一键打标
// @namespace   Violentmonkey Scripts
// @match       https://weekend.bytedance.net/service/tasks/special_test/bytestorm/detail
// @grant       none
// @version     1.5
// @author      -
// @description 通过快捷按钮为weekend执行报告批量打标
// @downloadURL https://update.greasyfork.org/scripts/468996/weekend%E4%B8%80%E9%94%AE%E6%89%93%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/468996/weekend%E4%B8%80%E9%94%AE%E6%89%93%E6%A0%87.meta.js
// ==/UserScript==


//页面加载完毕时，添加按钮
window.onload = function() {
  let pn = document.querySelectorAll('button>span')[0].parentNode.parentNode;

  let tagTestDataButton = document.createElement('button');
  tagTestDataButton.innerHTML = '打标为「测试数据问题」';
  tagTestDataButton.disabled = false;
  tagTestDataButton.addEventListener('click',function() {
    tagAllCases('测试数据问题');
  });
  pn.insertBefore(tagTestDataButton, document.querySelectorAll('button>span')[0].parentNode);

  let tagScriptButton = document.createElement('button');
  tagScriptButton.innerHTML = '打标为「自动化脚本问题」';
  tagScriptButton.disabled = false;
  tagScriptButton.addEventListener('click',function() {
    tagAllCases('自动化脚本问题');
  });
  pn.insertBefore(tagScriptButton, document.querySelectorAll('button>span')[0].parentNode);

  let tagBug = document.createElement('button');
  tagBug.innerHTML = '打标为「用例发现bug」';
  tagBug.disabled = false;
  tagBug.addEventListener('click',function() {
    tagAllCases('用例发现bug');
  });
  pn.insertBefore(tagBug, document.querySelectorAll('button>span')[0].parentNode);
}


//自动点击流程
const tagAllCases = async(tag_text) => {
  //点击「批量打标」
  document.querySelectorAll('button>span')[0].click();
  await delay(100);
  if(document.querySelectorAll('.semi-checkbox-inner')[0]!==undefined) { //能找到全选框时
    if(document.querySelectorAll('.semi-checkbox-checked')[0]===undefined) { //没有被选中的选择框时
      //点击全选
      document.querySelectorAll('.semi-checkbox-inner')[0].click();
      await delay(100);
    }
    //点击下一步
    document.querySelectorAll('.semi-button-content').item(document.querySelectorAll('.semi-button-content').length - 1).click();
    await delay(100);
  };
  //点击单选框
  document.querySelectorAll('.semi-select-content-wrapper')[0].click();
  await delay(100);
  //选择「用例发现bug」
  //document.querySelectorAll('.semi-select-option').item(document.querySelectorAll('.semi-select-option').length - 13).click();
  Array.from(document.querySelectorAll('.semi-select-option')).find(el => el.textContent === tag_text).click();
  await delay(100);
  //确定
  document.querySelectorAll('button>span').item(document.querySelectorAll('button>span').length - 1).click();
  await delay(500);
  //刷新页面
  //location.reload();
}

//等待X（毫秒）
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//为页面添加ctrl+A事件
window.onkeydown = function (event) {
  'use strict';
  //按ctrl+A 选择所有指标
  if(event.ctrlKey && event.keyCode === 65){
    tagAllCases('用例发现bug');
  }
}