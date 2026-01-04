// ==UserScript==
// @name         PTCGO Prices Enhance
// @version      1.21
// @description  增強搜尋列+標籤群組功能
// @author       烤魚
// @include      https://ptcgoprices.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace    https://greasyfork.org/users/302127
// @downloadURL https://update.greasyfork.org/scripts/398276/PTCGO%20Prices%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/398276/PTCGO%20Prices%20Enhance.meta.js
// ==/UserScript==

GM_addStyle(`
#search-criteria-modified {
    max-width: 75%;
    min-width: 300px;
    margin: auto;
    margin-right: 5px;
}
`);

var NUM, LIST=[], NAME=[];

function initial () {
  //如果數目的值不存在，初始化三個群組
  if (GM_getValue('數目')==null) {
    GM_setValue('數目', 3);

    GM_setValue('群組顏色1',"rgb(207, 226, 243)");
    GM_setValue('群組顏色2',"rgb(217, 234, 211)");
    GM_setValue('群組顏色3',"rgb(244, 204, 204)");

    GM_setValue('群組名稱1',"A");
    GM_setValue('群組名稱2',"B");
    GM_setValue('群組名稱3',"C");

    GM_setValue('群組1',"[]");
    GM_setValue('群組2',"[]");
    GM_setValue('群組3',"[]");
  }
  //設定全域變數
  NUM = GM_getValue('數目');
  for (var i=1; i<=NUM; i++) {
    NAME.push(GM_getValue('群組名稱'+i));
    LIST.push(JSON.parse(GM_getValue('群組'+i)));

    //CSS 標籤背景顏色設定
    let str = '{background-color: ' + GM_getValue('群組顏色'+i) + ' !important;}';
    GM_addStyle('#btn_' + i + str);
    GM_addStyle('#btn_' + i + '{margin-bottom: 15px;}');
    GM_addStyle('.grid-item[group="' + i + '"]>.name' + str );
  }
}


(function () {
  'use strict';

  //新搜尋列，只有在輸入Enter後才會更新
  var searchbar = document.createElement('input')
  searchbar.setAttribute('type', 'search')
  searchbar.setAttribute('id', 'search-criteria-modified')
  searchbar.setAttribute('placeholder', 'Search for card name, number or set')
  document.getElementById('search-criteria').replaceWith(searchbar);
  document.getElementById('search-criteria-modified').addEventListener('change', search, false);

  initial(); //初始化
  setTimeout(grouping, 1000); //上標籤，延遲1000ms

  document.getElementById('cdata').addEventListener('auxclick', toggle); //事件代理
  document.getElementById('cdata').addEventListener('contextmenu', e => {e.preventDefault();}); //取消contextmenu

  //加入群組按鈕
  var domString = "";
  for (let i=0; i<NUM; i++) domString += '<button id="btn_' + (i+1) + '">' + NAME[i] + ' (' + (LIST[i].length) +') </button>';
  document.getElementsByClassName('grid-container')[0].insertAdjacentHTML('beforebegin', domString);
  for (let i=0; i<NUM; i++) document.getElementById('btn_'+(i+1)).addEventListener("click", show);
}

)();


function grouping () {
  var t0 = performance.now();
  //依照儲存的群組設定group屬性
  var items = document.getElementsByClassName('grid-item');
  items.forEach(function (item) {
    var data = item.getAttribute('data-cid');
    var i=NUM-1;
    for (; i>=0; i--) {
      if (LIST[i].indexOf(data) != -1) break;
    }
    item.setAttribute('group', (i+1)); //{0,1~N}
  });
  var t1 = performance.now();
  console.log("PTCGO Enhance處理完成 - 項目 " + items.length + " 筆共花費 " + (t1 - t0) + " 毫秒");
}


function search () {
  var txt = document.getElementById('search-criteria-modified').value;
  txt = txt.toUpperCase();
  txt = txt.replaceAll(' AND ', ' & ');
  if (txt.endsWith(' GX')) txt = txt.substr(0, txt.length-3)+'-GX';
  if (txt.endsWith(' EX')) txt = txt.substr(0, txt.length-3)+'-EX';

  var items = document.getElementsByClassName('grid-item');
  items.forEach(function (item) {
    if (item.querySelector(".name .c").textContent.toUpperCase().includes(txt)) {
      item.style.display = "block";
    } else if (item.querySelector(".name .d")!=null && item.querySelector(".name .d").textContent.toUpperCase().includes(txt)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}


function toggle (e) {
  var event = e || window.event;
  var target = event.target;

  if (target.className === 'name') {
    var data = target.parentNode.getAttribute('data-cid');
    var i = parseInt(target.parentNode.getAttribute('group'));

    if (i > 0) {
      LIST[i-1].splice(LIST[i-1].indexOf(data), 1); //從舊群組中移除
      document.getElementById('btn_'+i).textContent = NAME[i-1] + ' (' + (LIST[i-1].length) +')';
      GM_setValue('群組'+i, JSON.stringify(LIST[i-1]));
    }
    i = i+1;
    if (i <= NUM) {
      LIST[i-1].push(data); //新增至新群組
      document.getElementById('btn_'+i).textContent = NAME[i-1] + ' (' + (LIST[i-1].length) +')';
      GM_setValue('群組'+i, JSON.stringify(LIST[i-1]));
      target.parentNode.setAttribute('group', i);
    }
    else {
      target.parentNode.setAttribute('group', 0);
    }
  }
}


function show (evt) {
  var i = evt.currentTarget.id.slice(-1);
  var items = document.getElementsByClassName('grid-item');
  items.forEach(function (item) {
    if (item.getAttribute('group') == i) item.style.display = "block";
    else item.style.display = "none";
  });
}