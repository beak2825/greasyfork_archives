// ==UserScript==
// @name         配合“百度网盘视频播放尊享 VIP | 解锁视频倍数 | 解锁全部清晰度”（原作者为：Cangshi）使用
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  原脚本失效，原作者大大还未更新脚本，但原脚本在老地址可以正常运行，于是用此脚本进行暂时的维护。
// @author       Yangzh12
// @include      https://pan.baidu.com/play/video*
// @include      https://pan.baidu.com/pfile/*
// @include      https://pan.baidu.com/disk/main*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462988/%E9%85%8D%E5%90%88%E2%80%9C%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%B0%8A%E4%BA%AB%20VIP%20%7C%20%E8%A7%A3%E9%94%81%E8%A7%86%E9%A2%91%E5%80%8D%E6%95%B0%20%7C%20%E8%A7%A3%E9%94%81%E5%85%A8%E9%83%A8%E6%B8%85%E6%99%B0%E5%BA%A6%E2%80%9D%EF%BC%88%E5%8E%9F%E4%BD%9C%E8%80%85%E4%B8%BA%EF%BC%9ACangshi%EF%BC%89%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/462988/%E9%85%8D%E5%90%88%E2%80%9C%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%B0%8A%E4%BA%AB%20VIP%20%7C%20%E8%A7%A3%E9%94%81%E8%A7%86%E9%A2%91%E5%80%8D%E6%95%B0%20%7C%20%E8%A7%A3%E9%94%81%E5%85%A8%E9%83%A8%E6%B8%85%E6%99%B0%E5%BA%A6%E2%80%9D%EF%BC%88%E5%8E%9F%E4%BD%9C%E8%80%85%E4%B8%BA%EF%BC%9ACangshi%EF%BC%89%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==

var currentUrl = window.location.href;
if (currentUrl.includes(".doc") || currentUrl.includes(".pdf")) {
  // 如果当前地址包含".doc"或".pdf"，则不发生替换
  console.log("当前地址包含.doc或.pdf，无法替换");
} else {
  // 替换URL中的pfile为play/video#
  var newUrl = currentUrl.replace("pfile", "play/video#");

  // 跳转到替换后的页面
  window.location.href = newUrl;
}


// 创建跳转按钮元素，设置属性和样式
var button = document.createElement("button");
button.style.width = "3cm";
button.style.height = "3cm";
button.style.backgroundColor = "red";
button.style.position = "absolute";
button.style.left = "2cm";
button.style.top = "2cm";
button.innerText = "点击此跳转到超清画质，如果第一次使用本脚本，请自行点击创建组群，否则无法跳转";
// 添加点击事件
button.onclick = function() {
  // 执行代码
  document.querySelector("#video-toolbar > div.video-toolbar-buttonbox > a:nth-child(2) > span > span").click();
  setTimeout(function() {
    document.querySelector("#dialog1 > div.dialog-body > div > div.share-file-body__nav > div.share-file-body__tabs > div.share-file-body__tabs-item.is-friend").click();
    setTimeout(function() {
      document.querySelector("#dialog1 > div.dialog-body > div > div.share-file-body__content > div.share-file-body__friend > div > div.share-file__friend-body > div.share-file__friend-list-container.has-scroll > div.share-file__friend-list-wrapper.has-scroll > div.share-file__friend-list.is-group > div.share-file__friend-list-title").click()
      setTimeout(function() {
        // 选择器
const SELECTOR = '#dialog1 > div.dialog-body > div > div.share-file-body__content > div.share-file-body__friend > div > div.share-file__friend-body > div.share-file__friend-list-container.has-scroll > div.share-file__friend-list-wrapper.has-scroll > div.share-file__friend-list.is-group.is-expand > div.share-file__friend-list-body > div > div';

// 获取同级元素的集合
const siblingsCollection = document.querySelectorAll(SELECTOR);

// 创建包含数据的对象数组
const siblingsArray = Array.from(siblingsCollection).map((item) => ({
  name: item.querySelector('.share-file__friend-list-item-name').textContent,
  element: item,
}));

const container = document.createElement('div');
container.style.position = 'fixed';
container.style.top = '50%';
container.style.left = '0';
container.style.transform = 'translate(0, -50%)';
container.style.padding = '20px';
container.style.background = 'white';
container.style.zIndex = '999';
container.style.borderRadius = '5px';
container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
document.body.appendChild(container);

// 创建一个标题
const title = document.createElement('h2');
title.textContent = '你有三秒的时间选择，否则默认第一个或上一个组群';
container.appendChild(title);

// 创建项目列表和相应的复选框
const list = document.createElement('ul');
siblingsArray.forEach(({ name }) => {
  const listItem = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = name;
  listItem.appendChild(checkbox);
  listItem.appendChild(document.createTextNode(name));
  list.appendChild(listItem);
});
container.appendChild(list);



// 监听选择
const checkboxes = list.querySelectorAll('input[type="checkbox"]');
let timerId;
checkboxes.forEach((checkbox, index) => {
  checkbox.addEventListener('change', () => {
    clearTimeout(timerId); // 清除计时器
    if (checkbox.checked) {
      const selectedItem = siblingsArray.find(
        ({ name }) => checkbox.name === name
      ).element;
      selectedItem.click();

      // 保存选择到本地存储中
      localStorage.setItem('lastSelected', checkbox.name);
    }
  });
});

// 3秒内不选择自动点击获取到的第一个元素或上一次选择的元素
timerId = setTimeout(() => {
  let isAnyChecked = false;
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      isAnyChecked = true;
    }
  });
  if (!isAnyChecked) {
    const lastSelectedName = localStorage.getItem('lastSelected');
    const lastSelectedItem = siblingsArray.find(
      ({ name }) => name === lastSelectedName
    );
    if (lastSelectedItem) {
      lastSelectedItem.element.click();
    } else {
      const firstItem = siblingsArray[0].element;
      firstItem.click();
    }
  }
}, 3000);
        setTimeout(function() {
          document.querySelector("#dialog1 > div.dialog-body > div > div.share-file-body__content > div.share-file-body__friend > div > div.share-file__friend-actions > button > span").click()
          setTimeout(function() {
            document.querySelector("body > div.module-yun-tip > div > span.tip-msg > a").click()
          }, 1000);
        }, 5000);
      }, 500);
    }, 1000);
  }, 1000);
};

// 添加按钮元素到页面中
document.body.appendChild(button);

// 添加新的按钮元素到页面中
var currentUrl = window.location.href;
if (currentUrl == "https://pan.baidu.com/disk/main#/im/session?from=mbox") {
  // 在距离页面左上角2cm的位置添加一个长为3厘米，宽为2厘米的红色的元素按钮，按钮名字为“正在加载中，如果第一次使用本脚本，请自行点击创建组群”
  var element = document.createElement("button");
  element.style.width = "3cm";
  element.style.height = "2cm";
  element.style.backgroundColor = "red";
  element.innerHTML = "正在加载中";
  element.style.position = "absolute";
  element.style.top = "8cm";
  element.style.left = "4cm";
  document.body.appendChild(element);
}
// 定义一个检查元素是否存在的函数
function checkElement() {
var element = document.querySelector("body > div.nd-main-layout > div.nd-main-layout__wrapper > div.nd-main-layout__body > div > div.im-contain > div.im-contain__left > div > div.im-l-contain > div.im-l-contain__content > div > div > div > div:nth-child(1) > div:nth-child(2) > div > div.im-list-card__content > div > div.im-list-card__cov--top")
if (element) {
//获取需要点击的按钮元素
var button = document.getElementById("myButton");
    setTimeout(function() {
      element.click();
    }, 1000); // 如果元素出现，则延迟1秒钟后执行点击事件
    clearInterval(intervalId); // 如果元素出现，则清除定时器
  }
}

// 设置定时器每隔一段时间检查一次元素是否存在
var intervalId = setInterval(checkElement, 1000);

setTimeout(function(){
document.querySelector("body > div.nd-main-layout > div.nd-main-layout__wrapper > div.nd-main-layout__body > div > div.im-contain > div.im-contain__right > div > div > div > span > i").click()
}, 8000);

setTimeout(function(){
document.querySelector("body > div.nd-main-layout > div.nd-main-layout__wrapper > div.nd-main-layout__body > div > div.u-drawer__wrapper.is-doc > div > div > section > div.im-doclib > div.im-doc-lib > div.im-pan-list.im-pan-list-loading > div > div > div.im-pan-table__body.mouse-choose-list > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > a").click()
}, 9000);

// 获取上一次保存的URL地址
var lastUrl = localStorage.getItem("lastUrl");

// 获取当前URL地址
var currentUrl = window.location.href;

// 检查是否与上一次相同
if (currentUrl !== lastUrl) {
  // 如果不同，则保存当前URL地址，并创建一个跳转到上一次URL地址的按钮
  localStorage.setItem("lastUrl", currentUrl);

  var backButton = document.createElement("button");
  backButton.textContent = "跳转到上一次的URL地址";
  backButton.style.position = "fixed";
  backButton.style.top = "50%";
  backButton.style.right = "100px";
  backButton.style.transform = "translateY(-50%)";
  backButton.style.backgroundColor = "yellow";
  backButton.style.color = "black";
  backButton.style.borderRadius = "5px";
  backButton.style.zIndex = '999';
  backButton.style.padding = "10px";
  backButton.style.cursor = "pointer";

  backButton.addEventListener("click", function() {
    window.location.href = lastUrl;
  });

  document.body.appendChild(backButton);
}

// 创建设置主页和跳转主页的按钮
var setHomepageButton = document.createElement("button");
setHomepageButton.style.position = "fixed";
setHomepageButton.style.top = "50%";
setHomepageButton.style.left = "10px";
setHomepageButton.style.transform = "translateY(-50%)";
setHomepageButton.style.backgroundColor = "blue";
setHomepageButton.style.zIndex = '999';
setHomepageButton.style.color = "white";
setHomepageButton.innerHTML = "设置为主页";
document.body.appendChild(setHomepageButton);

var goToHomepageButton = document.createElement("button");
goToHomepageButton.style.position = "fixed";
goToHomepageButton.style.top = "60%";
goToHomepageButton.style.left = "10px";
goToHomepageButton.style.transform = "translateY(-50%)";
goToHomepageButton.style.backgroundColor = "blue";
setHomepageButton.style.zIndex = '999';
goToHomepageButton.style.color = "white";
goToHomepageButton.innerHTML = "跳转到主页";
document.body.appendChild(goToHomepageButton);

// 保存当前页面地址
function saveHomepage() {
  var currentUrl = window.location.href;
  localStorage.setItem("homepage", currentUrl);
}

// 获取保存的主页地址并跳转
function goToHomepage() {
  var homepageUrl = localStorage.getItem("homepage");
  if (homepageUrl !== null) {
    window.location = homepageUrl;
  }
}

// 添加设置主页和跳转主页的点击事件处理程序
setHomepageButton.onclick = saveHomepage;
goToHomepageButton.onclick = goToHomepage;