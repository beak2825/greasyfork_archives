// ==UserScript==
// @name         复制exhentai标题
// @namespace    http://tampermonkey.net/
// @version      1.17
// @description  用于复制exhentai标题
// @author       pllxy
// @match        *.e-hentai.org/g/*
// @match        *://e-hentai.org/g/*
// @match        *://www.e-hentai.org/g/*
// @match        *://exhentai.org/g/*
// @match        *://www.exhentai.org/g/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463676/%E5%A4%8D%E5%88%B6exhentai%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/463676/%E5%A4%8D%E5%88%B6exhentai%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
//===========================================================================================
// 获取磁力链接文本
// 通过onclick获取带有archiever的链接
function GetTorrentLink() {
  var gd5 = document.getElementById("gd5");
  var p = gd5.querySelector("p.g2");
  var torrentLinkElem = p.querySelector("a");
  var onclickAttribute = torrentLinkElem.getAttribute("onclick");
  var regex = /https:\/\/exhentai\.org\/archiver\.php\?gid=\d+&token=[a-z0-9]+/i;
  var match = onclickAttribute.match(regex);
  var torrentArchiverLink = match[0];
  // 匹配 gid 和 token，组成带有gallerytorrents的链接
  match = torrentArchiverLink.match(/gid=(\d+)&token=([a-z0-9]+)/i);

  if (match) {
    var gid = match[1];
    var token = match[2];

    // 构建 torrent link
    var torrentLink = 'https://exhentai.org/gallerytorrents.php?gid=' + gid + '&t=' + token;
    return torrentLink;

    console.log(torrentLink);
  } else {
    console.log('No match found');
  }
}
//==========================================================================================
//装填剪切板
function FillClipboard(data,popText) {
    //data.magnetLinks = magnetLinks;
    // 将数据转换为JSON字符串
    var jsonData = JSON.stringify(data);

    // 复制JSON字符串到剪贴板
    navigator.clipboard.writeText(jsonData).then(function () {
        // 文本复制成功，显示弹窗
        CreatePop(popText)
    }, function () {
        // 复制失败，显示弹窗
        CreatePop("磁链文本复制失败，请重试")
    });
}
//===========================================================================================
// 创建弹窗
function CreatePop(text) {
    var popup = document.createElement('div');

    // 添加弹窗文本
    popup.innerHTML = text;

    // 设置弹窗样式
    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.backgroundColor = "#fff";
    popup.style.color = "#000";
    popup.style.fontSize = "16px";
    popup.style.padding = "10px";
    popup.style.border = "1px solid #000";
    popup.style.borderRadius = "5px";
    popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)";
    popup.style.transition = "opacity 1s ease-in-out";

    // 将弹窗添加到body元素中
    document.body.appendChild(popup);

    // 设置一个定时器，在1秒后关闭弹窗
    setTimeout(function () {
        popup.style.opacity = "0";
        setTimeout(function () {
            document.body.removeChild(popup);
        }, 1000);
    }, 1000);
}

//===========================================================================================
//添加元素与监听事件
function AddElement() {
    // 获取id为"gd5"的<div>元素
    var targetDiv = document.getElementById('gd5');

    // 创建一个新的button元素
    var newButton = document.createElement('button');
    var img = document.createElement("img");
    img.src = "https://exhentai.org/img/mr.gif";

    // 将按钮添加到目标<div>元素中
    targetDiv.appendChild(newButton);
    targetDiv.insertBefore(img, newButton);

    // 添加按钮文本
    newButton.innerHTML = "复制标题";

    // 添加按钮点击事件处理程序
    newButton.addEventListener("click", function () {
        // 获取标题文本
        var h1_1 = document.querySelector("#gd2 #gn");
        var h1_2 = document.querySelector("#gd2 #gj");

        // 创建一个包含<h1>元素内容的对象
        const data = {
            "h1_1": h1_1.innerText,
            "h1_2": h1_2.innerText,
            "magnetLinks": []
        };
        FillClipboard(data,"标题文本已复制")
        // Create a new Promise object
        var torrentLink = GetTorrentLink();
        const fetchData = new Promise((resolve, reject) => {
            fetch(torrentLink)
                .then(response => response.text())
                .then(htmlString => {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(htmlString, 'text/html');
                    var torrentLinks = doc.querySelectorAll('tbody a[href*="/torrent/"]');
                    const magnetLinks = [];
                    torrentLinks.forEach(link => {
                        var torrentFileName = link.textContent;
                        magnetLinks.push(torrentFileName);
                    });
                    // Resolve the Promise with the magnetLinks array
                    resolve(magnetLinks);
                })
                .catch(error => reject(error));
        });

        // Call the fetchData Promise and wait for it to resolve
        fetchData.then(magnetLinks => {
            // Your code that uses the magnetLinks array goes here
            data.magnetLinks = magnetLinks;
            FillClipboard(data,"标题文本与磁链文本已复制")
        }, function () {
            FillClipboard(data,"磁链文本复制失败")
        }).catch(error => console.error(error));
        CreatePop("复制中，请稍等")
    });
}
//===========================================================================================
//执行
AddElement();
})();