// ==UserScript==
// @name         PinganGetData
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取业务数据
// @author       DuJian
// @license      GNU GPLv3
// @match        *://*.taobao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492214/PinganGetData.user.js
// @updateURL https://update.greasyfork.org/scripts/492214/PinganGetData.meta.js
// ==/UserScript==

(function () {
  // "use strict";
  //先导入jq
  var script = document.createElement("script");
  (script.src = "https://code.jquery.com/jquery-3.0.0.min.js"),
    document.head.appendChild(script);
  //画一个控制面板 里面加按钮
  var dataarr = [];
  var dataarr2 = [];
  drawdiv();
  drawinputbox();
  getDatabtn(); //获取数据的按钮
  addButton(); //发送请求的按钮
  turnpagebtn(); //发送请求的按钮

  var thehttpurl = window.location.href;
  var searchurlOff = false;
  if (thehttpurl.indexOf("s.taobao.com/search")) {
    //匹配s.taobao
    searchurlOff = true;
  }
  console.log(thehttpurl, "thehttpurl");
  //画控制面板
  function drawdiv() {
    var mydiv = document.createElement("div");
    // 设置属性
    mydiv.setAttribute("id", "myDiv");
    mydiv.setAttribute("class", "myClass");
    mydiv.setAttribute(
      "style",
      "width: 250px; min-height: 250px; background-color: gray;display:flex;flex-direction: column;justify-content:center;align-items:center;position:fixed;top:25%;right:8%;z-index:999999999"
    );
    document.body.appendChild(mydiv);
  }

  //画输入关键词
  function drawinputbox() {
    // 创建一个新的input元素作为搜索框
    var searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "请输入搜索内容...";
    searchInput.className = "search-input";
    searchInput.setAttribute(
      "style",
      "width: 100px;height: 25px;outline: none;"
    );

    // 创建一个新的button元素作为搜索按钮
    var searchButton = document.createElement("button");
    searchButton.textContent = "搜索";
    searchButton.className = "search-button";
    searchButton.setAttribute(
      "style",
      "width: 50px;height: 25px;outline: none;border: navajowhite;line-height: 25px;text-align: center;"
    );
    searchButton.addEventListener("click", function () {
      // 在这里处理搜索事件，比如发送请求到服务器
      var tbsinputbox = document.getElementById("J_Search");
      var tbsinput = tbsinputbox.getElementsByTagName("input")[0];
      var tbsbutton = tbsinputbox.getElementsByTagName("button")[0];
      console.log(tbsinput.value);
      tbsinput.value = searchInput.value;
      tbsbutton.click();
      // alert("搜索内容: " + searchInput.value);
    });

    // 创建一个包裹元素来容纳输入框和按钮
    var searchWrapper = document.createElement("div");
    searchWrapper.className = "search-wrapper";
    // 将搜索框和按钮添加到包裹元素中
    searchWrapper.appendChild(searchInput);
    searchWrapper.appendChild(searchButton);
    var Paneldiv = document.getElementById("myDiv");
    Paneldiv.appendChild(searchWrapper);
  }
  //发送请求的按钮
  function addButton() {
    var newButton1 = document.createElement("button");
    newButton1.setAttribute("id", "myButton");
    newButton1.innerHTML = "发送请求";
    // 可选：为按钮添加一些样式
    newButton1.style.cssText = "color: black; padding: 10px;margin-top:15px";
    var Paneldiv = document.getElementById("myDiv");

    // 将新创建的按钮添加到div中
    Paneldiv.appendChild(newButton1);
  }
  //获取数据的按钮
  function getDatabtn() {
    // 创建一个新的按钮元素
    var newButton2 = document.createElement("button");
    newButton2.setAttribute("id", "getdata");
    newButton2.innerHTML = "获取数据";
    newButton2.style.cssText = "color: black; padding: 10px;margin-top:15px";
    var Paneldiv = document.getElementById("myDiv");

    Paneldiv.appendChild(newButton2);
  }
  //自动翻页按钮?
  function turnpagebtn() {
    // 创建一个新的按钮元素
    var newButton3 = document.createElement("button");
    newButton3.setAttribute("id", "turnpage");
    newButton3.innerHTML = "自动翻页";
    newButton3.style.cssText = "color: black; padding: 10px;margin-top:15px";
    var Paneldiv = document.getElementById("myDiv");
    Paneldiv.appendChild(newButton3);
  }

  // 获取数据按钮元素
  var getdataButton = document.getElementById("getdata");
  getdataButton.addEventListener("click", function () {
    console.log("获取数据!");
    if (searchurlOff) {
      //s.taobao
      let searchDiv = document.getElementsByClassName(
        "Content--contentInner--QVTcU0M"
      )[0];
      console.log(searchDiv, "searchDiv");
      let selements = searchDiv.getElementsByTagName("div");
      console.log(selements);
      dataarr = selements;
      for (let index = 0; index < selements.length; index++) {
        const item = selements[index];
        let obj = {
          baseURI: item.baseURI,
          innerText: item.innerText,
          innerHTML: item.innerHTML,
        };
        dataarr2.push(obj);
      }
      console.log(dataarr2);
    } else {
      let elements = document.getElementsByClassName("pc-items-item");
      console.log(elements);
      dataarr = elements;
      for (let index = 0; index < elements.length; index++) {
        const item = elements[index];
        let obj = {
          baseURI: item.baseURI,
          innerText: item.innerText,
          innerHTML: item.innerHTML,
        };
        dataarr2.push(obj);
      }
      console.log(dataarr2);
    }
  });

  // 获取数据按钮元素
  var turnpageButton = document.getElementById("turnpage");
  turnpageButton.addEventListener("click", function () {
    autoturnpage();
  });

  //实现自动翻页 - 下一页
  //因为会出现验证码固定时间翻页-生成随机数 翻页
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let randomInt = getRandomInt(1500, 38000);
  console.log(randomInt, "randomInt");
  function autoturnpage() {
    console.log("启动自动翻页");
    if (searchurlOff) {
      var snextpagediv = document.getElementsByClassName(
        "next-pagination-pages"
      )[1];
      var nextpage = snextpagediv.getElementsByClassName("next-next");
      console.log(nextpage, "nextpage");
      if (nextpage) {
        setInterval(() => {
          nextpage[0].click();
          getdataButton.click();
          // setInterval(() => {
          //   // 滚动到指定位置
          //   window.scrollTo(100, randomInt * 10 + Math.floor(Math.random())); // 滚动到(x:100, y:500)位置
          // }, 7500);
        }, randomInt);
      }
    } else {
      var mynextpagediv = document.getElementById("J_pc-search-page-nav");
      var mynextpage = mynextpagediv.getElementsByTagName("span");
      if (mynextpage) {
        setInterval(() => {
          mynextpage[2].click();
          setInterval(() => {
            // 滚动到指定位置
            window.scrollTo(100, randomInt * 10 + 2); // 滚动到(x:100, y:500)位置
          }, 7500);
        }, randomInt);
      }
    }
  }
  // 获取请求按钮元素
  var myButton = document.getElementById("myButton");
  // 添加点击事件监听器
  myButton.onclick = function () {
    // alert("Hello, World!");
    // 准备要发送的数据
    // const data = new FormData();
    // data.append("username", username);
    // data.append("password", password);
    // 发送POST请求
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://znz.saicjg.com/api/auth/verifyCode", true);

    xhr.onload = function () {
      if (this.status === 200) {
        // 请求成功，处理响应数据
        console.log('响应成功：',this.responseText);
      } else {
        // 请求失败
        console.error("Request failed.  Returned status of " + this.status);
      }
    };

    xhr.onerror = function () {
      // 网络错误
      console.error("Network Error");
    };

    xhr.send();
    /* fetch(
      "https://znz.saicjg.com/api/auth/verifyCode",
      {
        method: "GET", // 指定请求方法为POST
        body: "", // 将表单数据作为请求体发送
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // 设置请求头，告诉服务器发送的是表单数据
        },
      }
    )
      .then((response) => {
        // 检查响应是否成功
        if (!response.ok) {
          throw new Error("网络响应不是ok");
        }
        // 处理响应数据，例如返回JSON格式的数据
        return response.json();
      })
      .then((data) => {
        // 在这里处理服务器返回的数据
        console.log("发送成功:", data);
        alert("请求成功！");
      })
      .catch((error) => {
        // 处理请求过程中出现的错误
        console.error("发送成功:", error);
        alert("请求失败，请稍后再试。");
      }); */
  };

  
})();
