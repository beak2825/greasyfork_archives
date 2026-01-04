// ==UserScript==
// @name        天天基金记录前10持仓
// @namespace   https://greasyfork.org/users/14059
// @description 天天基金记录前10持仓,记录标记需要在代码中设定,一般表示日期和类别,命令在油猴菜单中执行,用于天天基金的基金首页,如http://fund.eastmoney.com/005976.html.记录前最好先看看信息对不对,获取时可能出错!
// @include     http://fund.eastmoney.com/*
// @require     http://cdn.staticfile.org/jquery/3.1.1/jquery.min.js
// @author      setycyas
// @version     0.01
// @grant       GM_registerMenuCommand
// @grant       GM_listValues
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/436608/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E8%AE%B0%E5%BD%95%E5%89%8D10%E6%8C%81%E4%BB%93.user.js
// @updateURL https://update.greasyfork.org/scripts/436608/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E8%AE%B0%E5%BD%95%E5%89%8D10%E6%8C%81%E4%BB%93.meta.js
// ==/UserScript==

(function(){

  'use strict';
  console.log("天天基金记录前10持仓 is running!By setycyas!");

  /* ## 注册油猴菜单api ## */
  GM_registerMenuCommand('(测试用)显示当前页可记录信息',gm_showPageInfo);
  GM_registerMenuCommand('记录当前页信息',gm_savePageInfo);
  GM_registerMenuCommand('显示已记录信息',gm_showAllInfo);

  /****************************************
  ######## version 2021-12-06 0.01 ###########
  ######## 脚本正式开始 ###################
  ****************************************/

  /* ## Global Variables and consts ## */
  // 这里手动指定记录标记,一般表示日期和类别,如:2021-09-30(FOF)
  const TAG = '2021-09-30(FOF)-01';

  /* ## Functions ## */
  // 获取当前基金名称信息
  function getFund(){
    return document.title.split('基金净值')[0];
  }

  // 获取持仓前10信息列表
  function get10List(){
    let result = [];
    let links = jQuery('table.ui-table-hover td.alignLeft>a[title]');
    let codePatt = /(\d+)\.html/; // 代码的正则表达式
    for(let i = 0;i < 10;i++){
      let fundName = links[i]['title'];
      let fundCode = (links[i]['href'].match(codePatt))[1];
      result.push(fundName+'('+fundCode+')');
    }
    return result;
  }

  // 获取当前的油猴记录表并返回其json
  function getGMJson(){
    let text = GM_getValue(TAG, '{}');
    return JSON.parse(text);
  }

  // 写入新的json表到油猴记录
  function setGMJson(json){
    let text = JSON.stringify(json);
    GM_setValue(TAG, text);
  }

  /* ## 油猴菜单函数 ## */
  function gm_showPageInfo(){
    console.log("执行油猴菜单-(测试用)显示当前页可记录信息");
    let msg = getFund()+':\n';
    let ten = get10List();
    for(let i = 0;i < ten.length;i++){
      msg += ten[i]+'\n';
    }
    alert(msg);
  }

  function gm_savePageInfo(){
    console.log("执行油猴菜单-记录当前页信息");
    let json = getGMJson();
    let fund = getFund();
    let ten = get10List();
    if(!(fund in json)){
      json[fund] = ten;
      setGMJson(json);
      alert('记录成功!');
    }else{
      alert('已有该记录!');
    }

  }

  function gm_showAllInfo(){
    console.log("执行油猴菜单-显示已记录信息");
    let text = GM_getValue(TAG, '{}')
    console.log(text);
    alert(text);
  }

})();
/* ## Last updated @2021/12/06 ## */