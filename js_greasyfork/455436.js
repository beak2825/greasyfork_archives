// ==UserScript==
// @name         MEST Sidebar
// @namespace    joyings.com.cn
// @version      1.1.9
// @description  fast switch account cookies
// @author       zmz125000
// @match        http://*/mest/*
// @icon         http://www.google.com/s2/favicons?domain=openwrt.org
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/455436/MEST%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/455436/MEST%20Sidebar.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
  document.onkeydown = function (e) {
    if (e.ctrlKey && e.code == 'KeyF') {
      // ctrl+f
      e.preventDefault();
      document.querySelector("input.search-filter").select();
    }
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  window.mini = true

  async function insertDiv() {
    var div = document.createElement('div');
    div.id = "mySidebar";
    div.className = "sidebar";

    var radio = document.createElement('div');
    radio.innerHTML = `
                <div class="InputContainer">
                    <input placeholder="Search..." class ="search-filter"/>
                </div>
                <div id="sidebar-filter" class="radio filter">
                    <input label="全部" type="radio" name="materialType" data-filter="all">
                    <input label="原料" type="radio" name="materialType" data-filter="material">
                    <input label="包装物料" type="radio" name="materialType" data-filter="packaging">
                </div>
                `
    div.appendChild(radio)
    while (!$('#app')) {
      await sleep(200);
    }
    $('#app')[0].appendChild(div);

    // filter action
    var $filters = $('.filter [data-filter]');
    $filters.on('click', function (e) {
      $('.grid-container').removeClass("grid-expanded");
      var $this = $(this);
      var $item = $('.grid-container [data-type]');
      var $filterType = $this.attr('data-filter');

      if ($filterType == 'all') {
        $item.addClass('item');
        $item.removeClass('item-hidden');
      } else {
        $item.removeClass('item');
        $item.addClass('item-hidden');
        $item.filter('[data-type =' + $filterType + ']').addClass('item');
        $item.filter('[data-type =' + $filterType + ']').removeClass('item-hidden');
      }
    });

    // search action
    document.querySelector("input.search-filter").addEventListener("input", function () {
      if (this.value == '' && $('input[name="materialType"]').filter(':checked').length != 0) {
        $('input[name="materialType"]').filter(':checked').click();
      } else {
        var items = $('.grid-container [data-type]');
        for (let elm of items) {
          if (elm.innerHTML.toLowerCase().includes(this.value.toLowerCase())) {
            elm.classList.remove("item-hidden");
            elm.classList.add("item");
          } else {
            elm.classList.remove("item");
            elm.classList.add("item-hidden");
          }
        }
        $('.grid-container').addClass("grid-expanded");
      }
    })

    // load data
    var data = loadData();
    if (data && data['record']['orders']) {
      updateSidebar(data);
    }
    getLatestMat();
  }

  function getLatestMat() {
    fetch('https://api.jsonbin.io/v3/b/637eceb165b57a31e6c15f19/latest')
      .then((response) =>
        response.json()
      )
      .then((data) => {
        updateSidebar(data);
        saveData(data);
        return data;
      })
      .catch(console.error);
  }

  function updateSidebar(data) {
    if ($('ul', $('#mySidebar')[0])[0]) {
      $('#mySidebar')[0].removeChild($('ul', $('#mySidebar')[0])[0]);
    }
    var chkcount = 0;
    var topUL = document.createElement('ul');
    $('#mySidebar')[0].appendChild(topUL);
    var orderArray = data['record']['orders'];
    for (let order of orderArray) {
      let oElm = document.createElement('li');
      oElm.className = "order";
      topUL.appendChild(oElm);
      let ielm = document.createElement("input");
      ielm.className = "toggle";
      ielm.type = "radio";
      ielm.name = "order";
      ielm.id = "collapsible" + chkcount;
      oElm.appendChild(ielm);
      let lelm = document.createElement("label");
      lelm.htmlFor = "collapsible" + chkcount++;
      lelm.className = "lbl-toggle";
      lelm.innerText = order['order'];
      oElm.appendChild(lelm);
      // osElm customer 下的 orders
      let gElm = document.createElement('div');
      gElm.className = "grid-container";
      oElm.appendChild(gElm);
      for (let item of order['material']) {
        let iElm = document.createElement('div');
        iElm.className = 'item';
        gElm.appendChild(iElm);

        switch (item['type']) {
          case 'material':
            iElm.setAttribute('data-type', 'material');
            break;
          case 'packaging':
            iElm.setAttribute('data-type', 'packaging');
            break;
        }
        for (let property in item) {
          if (property != 'code' && property != 'type') {
            let selm = document.createElement('span');
            selm.setAttribute('data-code', item['code']);
            selm.innerText = item[property];
            iElm.appendChild(selm);
          }
        }
        iElm.onclick = function () {
          event.stopPropagation();
          if (document.querySelector('[placeholder*="订单号"]')) {
            document.querySelector('[placeholder*="订单号"]').value = order['order'];
            document.querySelector('[placeholder*="订单号"]').dispatchEvent(new Event('input', {
              bubbles: true
            }));
          }
          if (document.querySelector('[placeholder*="物料名称、编码、别名"]')) {
            document.querySelector('[placeholder*="物料名称、编码、别名"]').value = item['code'];
            document.querySelector('[placeholder*="物料名称、编码、别名"]').dispatchEvent(new Event('input', {
              bubbles: true
            }));
          }
          let sbtn = null;
          if ($('button:contains("查询")')[0]) {
            sbtn = $('button:contains("查询")')[0];
          } else if ($('button:contains("搜索")')[0]) {
            sbtn = $('button:contains("搜索")')[0];
          } else if ($('button:contains("搜 索")')[0]) {
            sbtn = $('button:contains("搜 索")')[0];
          }
          if (sbtn) {
            sbtn.click();
          }
        }
      }
    }
  }

  // 保存 读取 导入 切换 删除cookie
  // cookieData={ name:cookie,...}
  function loadData() {
    try {
      return JSON.parse(localStorage["matjson"]);
    } catch (e) {
      localStorage["matjson"] = null;
      return {};
    }
  }

  function saveData(data) {
    localStorage["matjson"] = JSON.stringify(data);
  }

  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
      return;
    }
    style = document.createElement('style');
    // style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  // init
  insertDiv();

  addGlobalStyle(`
        .sidebar {
            height: 100%;
            position: fixed;
            z-index: 5000;
            top: 0;
            right: 0;
            background-color: #111;
            max-width: 0px;
            transition: all 0.5s;
            overflow-x: hidden;
            white-space: nowrap;
            color: #ffffff;
            background: #009578;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.35);
            padding: 5px;
        }

        .search-filter::selection {
            background: #1e1f28;
            color: white;
        }

        #app .sidebar {
            position: absolute;
            top: 0;
            right: 0px;
        }

        .sidebar .grid-container {
            max-height: 0px;
            transition: all 0.3s ease-in-out;
        }

        .sidebar .grid-container div {
            margin: 7px;
            grid-template-columns: auto auto auto auto;
            grid-gap: 10px;
            background-color: #2196F3;
            padding: 8px;
            border-radius: 5px;
            color: aliceblue;
            box-shadow: 0 3px #999;
            cursor: pointer;
        }

        .sidebar .grid-container div:hover {
            background-color: rgb(0, 102, 255);
        }

        .sidebar .grid-container>div:active {
        background-color: #3b693d;
        box-shadow: 0 1px #666;
        transform: translateY(2px);
        }

        .sidebar .order {
            width: auto;
            background-color: azure;
            border-radius: 5px;
            color: #111;
            overflow-y: hidden;
            font-size: smaller;
        }

        .sidebar .order::-webkit-scrollbar {
            display: none;
        }

        .sidebar .orderNo {
            padding: 5px;
            font-size: larger;
        }

        .sidebar:hover, .sidebar:focus-within {
            max-width: 600px;
        }

        .sidebar .order:hover {
            background-color: beige;
        }

        .sidebar li {
            list-style: none;
            margin-left: 15px;
            margin-right: 15px;
            margin: 10px;
        }

        .sidebar ul {
            padding: 0;
            list-style-type: none;
        }

        .sidebar label {
            margin: 10px;
        }

        .sidebar span {
            margin-left: 2px;
        }
        
        .sidebar .item-hidden {
            display: none;
        }

        .sidebar .item {
            display: grid;
        }

        .sidebar::-webkit-scrollbar {
            display: none;
        }

        .sidebar .radio {
            margin: 10px;
            margin-left: 5px;
            padding: 0;
            position: relative;
        }

        .sidebar .radio input {
            width: auto;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            outline: none;
            cursor: pointer;
            border-radius: 5px;
            padding: 4px 8px;
            background: #1e1f28;
            color: white;
            font-size: 14px;
            transition: all 100ms linear;
        }

        .sidebar .radio input:checked {
            background-image: linear-gradient(180deg, #95d891, #74bbad);
            color: #fff;
            box-shadow: 0 1px 1px #0000002e;
            text-shadow: 0 1px 0px #79485f7a;
        }

        .sidebar .radio input:before {
            content: attr(label);
            display: inline-block;
            text-align: center;
            width: 100%;
        }

        .sidebar .InputContainer input {
            background-color: #e3edf7;
            padding: 8px 16px;
            border: none;
            display: block;
            font-family: 'Orbitron', sans-serif;
            font-weight: 600;
            color: #a9b8c9;
            transition: all 240ms ease-out;
            width: 100%;
        }

        .sidebar .InputContainer input::placeholder {
            color: #6d7f8f;
        }

        .sidebar .InputContainer input:focus {
            outline: none;
            color: #6d7f8f;
            background-color: #eff5fa;
        }

        .sidebar .InputContainer {
            margin: 5px;
            --top-shadow: inset 1px 1px 3px #c5d4e3, inset 2px 2px 6px #c5d4e3;
            --bottom-shadow: inset -2px -2px 4px rgba(255, 255, 255, 0.7);
            position: relative;
            border-radius: var(--border-radius);
            overflow: hidden;
        }

        .sidebar .InputContainer:before,
        .sidebar .InputContainer:after {
            pointer-events: none;
            width: 100%;
            height: 100%;
            position: absolute;
        }

        .sidebar .InputContainer:before {
            box-shadow: var(--bottom-shadow);
        }

        .sidebar .InputContainer:after {
            box-shadow: var(--top-shadow);
        }

        .sidebar .order input[type="radio"] {
            display: none;
        }

        .sidebar .lbl-toggle {
            display: block;
            cursor: pointer;
            font-size: larger;
        }

        .sidebar .grid-container.grid-expanded {
            max-height: 10000px;
        }

        .sidebar .toggle:checked+.lbl-toggle+.grid-container {
            max-height: 10000px;
        }
    `);
})();