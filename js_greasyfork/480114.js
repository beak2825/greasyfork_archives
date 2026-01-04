// ==UserScript==
// @name         虎牙自动送包裹虎粮
// @namespace    http:sudao.com
// @version      1.0.1
// @description  用于虎牙自动送虎粮
// @author       sudao
// @license      AGPL-3.0-or-later
// @match        https://hd.huya.com/*
// @match        https://www.huya.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/480114/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E9%80%81%E5%8C%85%E8%A3%B9%E8%99%8E%E7%B2%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/480114/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E9%80%81%E5%8C%85%E8%A3%B9%E8%99%8E%E7%B2%AE.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let id = GM_registerMenuCommand("设置", function () {
    deleteduoyu();
    addsetstyle();
    set();
  });
  let json = "";

  if (!getValue("huyaindex")) {
    setValue("huyaindex", 1);
  }
  if (!getValue("huyadate")) {
    setValue("huyadate", "2023-11-11");
  }
  if (!getValue("huyastart")) {
    setValue("huyastart", "https://www.huya.com/g/lol");
  }
  if (getValue("set") && getValue("zhubos")) {

    json = JSON.parse(getValue("zhubos"));
  }
  else {
    alert("请先对脚本进行设置！打开油猴脚本扩展，在虎牙直播界面上点开油猴已启用脚本会看到设置菜单点开即可设置。");
    return;
  }

  for (let key in json) {
    let liveInfo = json[key];;
    console.log("ID:", key);
    console.log("名称:", liveInfo.name);
    console.log("链接:", liveInfo.url);
    console.log("数量:", liveInfo.count);
    console.log("------------------------");
  }
  console.log("index:" + getValue("huyaindex") + ",日期：" + getValue("huyadate"));


  if (!getDate().includes(getValue("huyadate"))) {
    if (json == "") {
      alert("未找到主播列表，请设置后刷新重试！");
      return;
    }
    let mainurl = window.location.href;
    if (mainurl.includes(getValue("huyastart"))) {
      window.location.href = json[1].url;
    }
    panduan();
  }
  //判断是直播窗口还是包裹窗口
  function panduan() {
    let url = window.location.href;
    let zhuchuang = "www.huya.com";
    let zichuang = "hd.huya.com";
    if (url.indexOf(zhuchuang) > -1) {
      setTimeout(openbaoguo, 5000);
    }
    if (url.indexOf(zichuang) > -1) {
      setTimeout(ziwin, 2000);
    }
  }
  //打开包裹
  function openbaoguo() {
    console.log("点击包裹");
    let btn = document.getElementById("player-package-btn");
    btn.click();
  }
  //把虎粮界面悬浮出来
  function ziwin() {

    console.log("子窗口开始");
    let parente = document.querySelector(".g-package-list");
    let huliang = parente.querySelector(".m-gift-item");
    if (huliang) {
      let hoverEvent = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true
      });
      huliang.dispatchEvent(hoverEvent);
      setTimeout(songhuliang, 1000);
    }
    else {
      alert("包裹中没有虎粮！");
      return;
    }


  }
  //送虎粮
  function songhuliang() {
    console.log("开始送礼");
    let index = getValue("huyaindex");
    let next = index + 1;
    if (json[next]) {
      setValue("huyaindex", next);
      songli(json[index].count, json[next].url);
    }
    else {
      setValue("huyaindex", 1);
      setValue("huyadate", getDate());
      let count = json[index].count;
      if (count == -1) {
        count = document.querySelector(".c-count").textContent;
      }
      let url = "https://www.huya.com/g/lol";
      songli(count, url);
    }

  }
  //送虎粮开始
  function songli(count, url) {
    let inputc = document.querySelector("input[type='number']");
    inputc.click();
    let setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
    setValue.call(inputc, count);
    let event = new Event('input', { bubbles: true })
    inputc.dispatchEvent(event);
    let send = document.querySelector(".c-send");
    send.click();
    console.log(url + "赠送成功！数量为：" + count);
    if (getDate().includes(getValue("huyadate"))) {
      return;
    }
    setTimeout(() => { window.parent.location.href = url }, 1000);
  }
  //获取当前日期
  function getDate() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    return year + "-" + month + "-" + day;
  }
  //加载设置界面
  function set() {
    console.log("-----------开始加载");
    let setdiv = document.createElement("div");
    setdiv.id = "setpage";
    let biaoti1 = document.createElement("h3");
    biaoti1.innerText = "基本设置：";
    setdiv.appendChild(biaoti1);
    let close = document.createElement("button");
    close.id = "close";
    close.innerText = "关闭";
    close.addEventListener("click", () => {
      document.body.removeChild(setdiv);
    });
    setdiv.appendChild(close);
    let label_start = document.createElement("label");
    label_start.innerText = "启动页:";
    setdiv.appendChild(label_start);
    console.log("-----------启动页标签");
    let input_start = document.createElement("input");
    input_start.id = "huyastart";
    input_start.value = "https://www.huya.com/g/lol";
    input_start.style.width = "220px";
    input_start.required = "required";
    setdiv.appendChild(input_start);
    console.log("-----------启动页输入");
    let btn = document.createElement("button");
    btn.innerText = "保存";
    btn.id = "jibenset";
    btn.addEventListener("click", () => {
      let start = input_start.value;
      setValue("huyastart", start);
      console.log(start);
    });
    setdiv.appendChild(btn);
    console.log("-----------加载基本设置完成");
    let biaoti2 = document.createElement("h3");
    biaoti2.innerText = "主播列表：";
    setdiv.appendChild(biaoti2);
    let label_name = document.createElement("label");
    label_name.style.marginLeft = "30px";
    label_name.innerText = "名字";
    setdiv.appendChild(label_name);
    let label_url = document.createElement("label");
    label_url.style.marginLeft = "150px";
    label_url.innerText = "网址";
    setdiv.appendChild(label_url);
    let label_count = document.createElement("label");
    label_count.style.marginLeft = "130px";
    label_count.innerText = "数量";
    setdiv.appendChild(label_count);
    let ol = document.createElement("ol");
    ol.id = "list";
    setdiv.appendChild(ol);
    ol.appendChild(addli());
    let btn_add = document.createElement("button");
    btn_add.innerText = "添加";
    btn_add.addEventListener("click", addli);
    setdiv.appendChild(btn_add);
    let btn_save = document.createElement("button");
    btn_save.innerText = "保存";
    btn_save.addEventListener("click", save);
    setdiv.appendChild(btn_save);
    let shuomingdiv = document.createElement("div");
    shuomingdiv.id = "shuoming";
    let text = `<h3>说明：</h3>
      <p>注意：请新打开一个虎牙直播界面获取订阅信息，本页面不要刷新。</p>
      <p>基本设置：</p>
      <p> 启动页：只有在启动页脚本才会执行。默认是lol版块时启动，可自行修改为其他版块。</p>
      <p> 保存：写好后记得保存。</p>
      <p> 主播列表：</p>
      <p> 用于添加要送礼物的主播。</p>
      <p> 名字：自己随便起，主要是为了看着方便知道是哪个主播。</p>
      <p> 地址：就是直播间网址，进入主播直播间复制地址栏即可。</p>
      <p> 数量：赠送虎粮的数量。自己分配即可。不要超过自己每天的免费虎粮总数。</p>
      <p> 特别说明：如果其他主播送一个维持基本亲密度，剩下的全给一个主播，那么把该主播放到最后一行，且把数量设置为-1即可。</p>
      <p> 添加：添加一行用于填写。</p>
      <p> 删除：删除某行。</p>
      <p> 保存：设置完后保存设置。</p>
      `;
    shuomingdiv.innerHTML = text;
    setdiv.appendChild(shuomingdiv);
    document.body.appendChild(setdiv);
    readset();
    console.log("添加完成");
  }
  function addli() {
    let ol = document.querySelector("#list");
    let li = document.createElement("li");
    let name_input = document.createElement("input");
    let url_input = document.createElement("input");
    let count_input = document.createElement("input");
    let btn = document.createElement("button");
    name_input.id = "name";
    name_input.required = "required";
    url_input.id = "url";
    url_input.type = "url";
    url_input.required = "required";
    count_input.id = "count";
    count_input.type = "number";
    count_input.required = "required";
    btn.addEventListener("click", deleteli);
    btn.innerText = "删除";
    li.appendChild(name_input);
    li.appendChild(url_input);
    li.appendChild(count_input);
    li.appendChild(btn);
    if (!ol) {
      return li;
    }
    ol.appendChild(li);
  }

  function deleteli() {
    let button = event.target;
    let li = button.paentNode;
    let ol = document.querySelector("#list");
    let bts = document.querySelectorAll("#list>li>button");
    for (let i = 0; i < bts.length; i++) {
      if (bts[i] == button) {
        console.log(i);
        ol.removeChild(ol.children[i]);
      }
    }
  }
  function save() {
    let lis = document.querySelectorAll("#list>li");
    let s = "{";
    for (let i = 0; i < lis.length; i++) {
      let li = lis[i];
      let name = li.querySelector("#name").value;
      let url = li.querySelector("#url").value;
      let count = li.querySelector("#count").value;
      if (isEmptyStr(url) || isEmptyStr(count)) {
        alert("网址或数量不能为空！请填写后重新保存！")
        return;
      }
      let index = i + 1;
      let ob = new Object();
      ob.name = name;
      ob.url = url;
      ob.count = count;
      if (i == lis.length - 1)
        s = s + "\"" + index + "\":" + JSON.stringify(ob);
      else
        s = s + "\"" + index + "\":" + JSON.stringify(ob) + ",";
      console.log(index, name, url, count);
    }
    s = s + "}";
    setValue("zhubos", s);
    setValue("set", true);
    console.log(s);
    alert("保存成功！");
  }
  function readset() {
    let json = JSON.parse(getValue("zhubos"));
    if (json != "") {
      for (let key in json) {
        addli();
      }
    }
    let lis = document.querySelectorAll("#list>li");
    let i = 0;
    if (json != "") {
      for (let key in json) {
        let infor = json[key];
        if (i < lis.length) {
          let li = lis[i];
          li.querySelector("#name").value = infor.name;
          li.querySelector("#url").value = infor.url;
          li.querySelector("#count").value = infor.count;
          i++;
        }
      }
    }
  }
  function deleteduoyu() {
    document.body.innerHTML = "";
  }
  function addsetstyle() {
    addStyle(`button {
        margin-left: 30px;
        font-size: 15px;
        width: 80px;
      }`);
    addStyle(`h3 {     
        font-size: 23px;
      }`);
    addStyle(`label {
        font-size: 20px;
        margin-left: 15px;
      }`);
    addStyle(`input {
        font-size: 15px;
      }`);
    addStyle(`#setpage {
        position: fixed;
        z-index: 100;   
        overflow-y: auto;
        margin-left: 200px;
        margin-top: 10px;
        width: 760px;
        height: 850px;
        padding-left: 10px;
        background: rgb(25, 155, 241);
      }`);
    addStyle(`#name {
        width: 100px;
      }`);
    addStyle(` #url {
        width: 280px;
      }`);
    addStyle(`#count {
        width: 50px;
      }`);
    addStyle(`#close {
        position: absolute;
        left: 640px;
        top: 5px;
      }`);
    addStyle(`p {
        font-size: 16px;
      }`);

  }
  function setValue(name, value) {

    GM_setValue(name, value);
  }
  function getValue(name) {
    return GM_getValue(name);
  }
  function addStyle(style) {
    GM_addStyle(style);
  }
  function isEmptyStr(s) {
    if (s == null || s === '') {
      return true
    }
    return false
  }

})();
