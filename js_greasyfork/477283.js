// ==UserScript==
// @license MIT
// @name         👮思想犯封殺
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  把廢文製造機轟出去
// @author       You
// @match       https://ithelp.ithome.com.tw/articles*
// @match        https://ithelp.ithome.com.tw/users/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ithome.com.tw
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/477283/%F0%9F%91%AE%E6%80%9D%E6%83%B3%E7%8A%AF%E5%B0%81%E6%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/477283/%F0%9F%91%AE%E6%80%9D%E6%83%B3%E7%8A%AF%E5%B0%81%E6%AE%BA.meta.js
// ==/UserScript==

let URL = window.location.href;
let ArticleSite = "https://ithelp.ithome.com.tw/articles?tab=tech"
let UserSite = "https://ithelp.ithome.com.tw/users/"

// 判断URL的开头部分
if (URL.startsWith(ArticleSite)) {
    //文章頁執行清理垃圾程序
    CleanGarbage();
} else if (URL.startsWith(UserSite)) {
    UserCheck();
} else {
    console.log("這邊不執行腳本");
}


// 餅乾儲存的機制函數-------------------------------------------------
function setListInCookie(list) {
    document.cookie = 'myList=' + JSON.stringify(list) + '; expires=Wed, 31 Dec 2099 23:59:59 GMT;';
}

// 从 Cookie 中获取 list
function getListFromCookie() {
    var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)myList\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    return JSON.parse(cookieValue) || [];
}


function CleanGarbage(){

// 从本地存储中获取数据
var myListData = localStorage.getItem("myList");
// 解析数据到变量 list
var list = myListData ? JSON.parse(myListData) : [];


//list = getListFromCookie()||[]; // 儲存要刪除的字符串名單
// 找到所有CLASS是"qa-list__info-link"的<a>元素
var linkElements = document.querySelectorAll('.qa-list__info-link');
var removedCount = 0; // 初始化已清除的垃圾數量

for (var j = 0; j < list.length; j++) {

// 遍歷這些<a>元素，確保文本內容包含"伍貳捌"，然後刪除其父元素
for (var i = 0; i < linkElements.length; i++) {
    if (linkElements[i].textContent.includes(list[j])) {
        // 開始向上查找父元素
        var parentElement = linkElements[i].parentElement;

        while (parentElement) {
            // 如果找到具有"classname"為"qa-list"的<div>元素，則刪除它
            if (parentElement.classList.contains('qa-list')) {
                parentElement.remove();
                removedCount++; // 增加清除的數量
                console.warn('抓到"'+list[j]+'"這位思想犯');
                break; // 找到並刪除後，結束循環
            }

            parentElement = parentElement.parentElement;
        }
    }
}

    if (removedCount>0){
        // 顯示已清除的垃圾數量
        console.log('已清除他的 ' + removedCount + ' 篇垃圾');}
removedCount=0;
}
}
//-------------------------------------------------------
// 為了防止五百八改名，我們針對他的ID去ajax得到他最新的名稱
function FindBitch() {
  // 使用 Fetch API 获取指定 URL 的内容
  return fetch("https://ithelp.ithome.com.tw/users/20163468")
    .then(response => response.text())
    .then(data => {
      // 创建一个临时 div 元素以容纳页面内容
      var tempDiv = document.createElement("div");
      tempDiv.innerHTML = data;

      // 查找 class 为 "profile-header__name" 的元素
      var profileNameElement = tempDiv.querySelector(".profile-header__name");

      if (profileNameElement) {
        // 删除元素内的所有 <span> 元素
        var spanElements = profileNameElement.querySelectorAll("span");
        spanElements.forEach(function(span) {
          span.remove();
        });

        // 读取元素的文本内容，去掉前导和尾随空格
        var text = profileNameElement.textContent.trim();

        // 返回处理后的文本内容
        return text;
      } else {
        return "未找到元素";
      }
    })
    .catch(error => {
      console.error("发生错误: " + error);
      return "发生错误";
    });
}


//-------------------------------------------------------



function UserCheck(){
  //轉換資料從餅乾到localstorage
                        var currentCookieValue = getCookie("myList");

                        // 2. 存储数据到本地存储
                        if (currentCookieValue) {
                            var list = JSON.parse(currentCookieValue);
                            // 存储到本地存储
                            localStorage.setItem("myList", JSON.stringify(list));
                        }else{

                            FindBitch()
                                .then(text => {
                                let FirstKill = [text];
                                setListInCookie(FirstKill);
                            })
                                .catch(error => {
                                console.error("找不到五百八:", error);
                            });


                        }



// 刪除不需要的ID
document.querySelector('.profile-header__account').remove();
//封殺按鈕-------------------------------------------------
// 找到具有class为"profile-header__right"的元素
var profileRightElement = document.querySelector('.profile-header__right');
var pullRightElement = profileRightElement.querySelector('.pull-right');

        // 创建一个新按钮元素
        var BlockBtn = document.createElement('button');
        BlockBtn.textContent = '封殺';
        // 添加样式和类名到按钮
        BlockBtn.style.marginTop = '10px';
        BlockBtn.style.width = '100%';
        BlockBtn.className = 'btn btn-trace trace_btn_border BlockBtn';

        // 将按钮元素添加到"pull-right"元素内部
        pullRightElement.appendChild(BlockBtn);

// 通緝犯名單的cookie------------------------------------------------

// 从 Cookie 中加载 list（例如，页面加载时）
list = getListFromCookie()||[];
let UserBlock = document.querySelector('.profile-header__name');
let text = UserBlock.textContent.trim();


 // 如果使用者已經在封殺名單內的判斷，已存在或不存在
                if (list.includes(text)) {
                        BlockStart(BlockBtn);
                    }
                    else
                    {
                    // 針對封殺按鈕進行監聽事件
                    BlockBtn.addEventListener('click', function() {
                    list.push(text);
                    setListInCookie(list);

                    //先加入到名單內，然後再執行封殺事件
                    BlockStart();
                    // 输出到控制台
                    console.log('黑名單新增:' + text);

                        //本地儲存機制-----------------------------
                        let currentCookieValue = getCookie("myList");
                        let list2 = JSON.parse(currentCookieValue);
                        // 存储到本地存储
                        localStorage.setItem("myList", JSON.stringify(list2));

        });
                    }
}

// ------------------------------------------------

//封殺事件的函數
function BlockStart(){
    let BlockBtn = document.querySelector('.BlockBtn');
                   BlockBtn.textContent = '已封殺';
                    BlockBtn.disabled = true;
                    BadText();
                    BadImg();
}

//封殺事件函數裡面的細項函數


function BadText(){
// 標記這傢伙是垃圾-------------------------------------------------
    let UserBlock = document.querySelector('.profile-header__name');
    let newHeading = document.createElement('h1');
    newHeading.textContent = '思想通緝犯';

    // 把思想通緝犯這幾個大字加上去
    UserBlock.parentElement.insertBefore(newHeading, UserBlock);
    UserBlock.style.textDecoration = "line-through";
    UserBlock.style.color = "red";

}


function BadImg(){
//圖片進行網點作業XD-------------------------------------------------
var originalImage = document.querySelector('.profile-header__avatar');

// 创建一个包含交叉红线的覆盖层 <div> 元素
var overlayDiv = document.createElement('div');
overlayDiv.style.position = 'absolute';
overlayDiv.style.width = '150px';
overlayDiv.style.height = '150px';
overlayDiv.style.background = 'linear-gradient(45deg, black 50%, transparent 50%), linear-gradient(-45deg, black 50%, transparent 50%)';
overlayDiv.style.backgroundSize = '5px 5px, 5px 5px';


overlayDiv.style.backgroundPosition = '0 0, 0 2px';

// 将覆盖层叠加到图片上
originalImage.parentNode.appendChild(overlayDiv);

// 设置覆盖层的位置，以与原始图像对齐
overlayDiv.style.top = originalImage.offsetTop + 'px';
overlayDiv.style.left = originalImage.offsetLeft + 'px';

// 设置覆盖层的z-index，以确保它在图片上方
overlayDiv.style.zIndex = '2';
}