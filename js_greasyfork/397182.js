// ==UserScript==
// @name        kf复数引用脚本
// @namespace   https://greasyfork.org/users/14059
// @description 对kf的帖子进行复数引用
// @include     https://bbs.ikfol.com/read.php*
// @include     https://kf.miaola.info/read.php*
// @author      setycyas
// @icon        https://gitee.com/miaolapd/KF_Online_Assistant/raw/master/icon.png
// @version     0.05
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/397182/kf%E5%A4%8D%E6%95%B0%E5%BC%95%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/397182/kf%E5%A4%8D%E6%95%B0%E5%BC%95%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function(){
  /* 脚本正式开始 */

  'use strict';
  console.log("KF复数引用 is running!");

  /****************************************
  ######## 油猴API以及常用API示例 #########
  ****************************************/

  //数据读写api
  //GM_setValue(key,value);
  //GM_getValue(key);

  /****************************************
  ######## version 20200302 0.05 ###########
  ######## 脚本正式开始 ###################
  ****************************************/

  /* Global Variable & Const */
  const QUOTE_GM = 'quote_gm'; // 在油猴中记录引用资料的数据key
  const LAST_TID_GM = 'last_tid_gm'; // 在油猴中记录最近引用的帖子的tid的数据key
  var G_quotes = {}; // 引用字典,每一项的key为楼层(文本格式),value为二元组[id, text]
  var G_datas = {}; // 帖子内容表,每一项的key为楼层(文本格式),value为二元组[id, text]
  
  /* Functions */
  
  // 从一个url中获取帖子的tid,返回的是一个字符串而不是数字,获取失败返回字符串'0'
  function getTidFromUrl(url){
    let reg = /tid=(\d+)/;
    let matchs = url.match(reg);
    if(matchs)
      return matchs[1];
    else
      return '0';
  }

  // 从一个url获取帖子的页数,返回数字
  function getPageFromUrl(url){
    let reg = /&page=(\d+)/;
    let matchs = url.match(reg);
    if(matchs)
      return parseInt(matchs[1]);
    else
      return 1;
  }
  
  // 获取本页的帖子内容,制作公有变量G_datas
  function getG_datas(){
    let startFloor = (getPageFromUrl(window.location.href)-1)*10; // 开始楼层
    let $idA = $('.readidmsbottom a'); // 所有显示楼主名称的a标签,其innerText就是楼主名字
    let floorLength = $idA.length; // 当页总楼层
    let $textDiv = $('.readtext td > div'); // 所有楼层的文本内容
    for(let i = 0;i < floorLength;i++){
      G_datas[(i+startFloor)+''] = [$idA[i].innerText, $textDiv[i].innerText.replace(/[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*\n/, '')];
      //G_datas[(i+startFloor)+''] = [$idA[i].innerText, $($textDiv[i]).text()];
      // 把关键词,以往帖子的文本删除      
      let text = $textDiv[i].innerText.replace(/[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*\n/, '');
      let fieldsets = $textDiv[i].getElementsByTagName('fieldset');
      for(let j = 0;j < fieldsets.length;j++){
        text = text.replace(fieldsets[j].innerText, '');
      }
      G_datas[(i+startFloor)+''] = [$idA[i].innerText, text];    
    }
  }
  
  // 获取已记录的引用内容,若浏览帖子变更,则清空引用内容
  function getG_quotes(){
    let tid = getTidFromUrl(window.location.href); // 当前tid
    let lastTid = GM_getValue(LAST_TID_GM, '-1'); // 上次浏览的tid
    if(tid != lastTid){
      // 浏览tid改变,则清空引用
      GM_setValue(QUOTE_GM, '{}');
      G_quotes = {};
    }else{
      // 浏览tid不变,则获取引用
      G_quotes = JSON.parse(GM_getValue(QUOTE_GM, '{}'));
    }
  }
  
  // 增加一条引用,参数为引用楼层floor
  function addQuote(floor){
    if(floor in G_datas){
      G_quotes[floor] = G_datas[floor];
      GM_setValue(QUOTE_GM, JSON.stringify(G_quotes));
    }
  }
  
  // 使用所有引用
  function useQuote(){
    // 获取所有id,文本
    let idList = [];
    let textList = [];
    for (let floor in G_quotes){
      let id = G_quotes[floor][0];
      let text = G_quotes[floor][1];
      idList.push(id);
      text = ['[quote]引用', floor, '楼 ', id, '\n', text.trim(),'\n','[/quote]'].join('');
      textList.push(text);
    }
    // 写入所有id,文本
    let newIdList = []; // 排除重复用
    for(let i = 0;i < idList.length;i++){
      if($.inArray(idList[i], newIdList) < 0){
        newIdList.push(idList[i]);
      }
    }
    $('input.input').val(newIdList.join(','));
    //$('div.dcol textarea').val(textList.join('\n\n')).focus();
    $('div.drow textarea').val(textList.join('\n\n')).focus();
  }
  
  // 改变所有'引用'链接的点击行为
  function changeQuote(){
    // 查找相对复杂,先找到所有符合的a,然后匹配引用楼层
    //let $pagesA = $('div.readlou ul.pages>li>a');
    let $pagesA = $('a.readcza');
    let reg = /post.php\?action=quote.*article=(\d+)/;
    for(let i = 0;i < $pagesA.length;i++){
      let a = $pagesA[i];
      let matchs = a.href.match(reg);
      if(matchs){
        let floor = matchs[1];
        a.href = 'javascript:';
        $(a).click(function(){
          addQuote(floor);
          useQuote();        
        });
      }
    }
  }
  
  // 测试用
  function test(){
    console.log('tid = ',getTidFromUrl(window.location.href));
    console.log('page = ',getPageFromUrl(window.location.href));
    console.log('G_quotes = ',JSON.stringify(G_quotes));
  }
  /* Main Script */
  getG_datas(); // 获取帖子内容
  getG_quotes(); // 获取已记录的引用,没有则是空
  changeQuote(); // 改变'引用'链接的行为
  GM_setValue(LAST_TID_GM, getTidFromUrl(window.location.href)); // 记录最后访问的tid
  test(); // 测试显示用,可不要
  //2020-2-17自制的css,临时加上
  $('.readidms').css({"margin-top":"15px","margin-left":"-30px"});
  $('.readtext').css({"padding-left":"190px","width":"80%","float":"left"});

/* 脚本结束 */
})();
