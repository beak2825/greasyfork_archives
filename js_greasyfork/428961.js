// ==UserScript==
// @name         青书学堂课程作业答题快捷搜索辅助
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  青书学堂课程作业快捷答题网络搜索辅助 | 作者 @lidppp 的青书学堂懒人考试脚本(无法搜索有图片的题目)优化版本
// @author       jliuchen
// @match        *://*.qingshuxuetang.com/*
// @icon         https://www.google.com/s2/favicons?domain=qingshuxuetang.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428961/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%AF%BE%E7%A8%8B%E4%BD%9C%E4%B8%9A%E7%AD%94%E9%A2%98%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/428961/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%AF%BE%E7%A8%8B%E4%BD%9C%E4%B8%9A%E7%AD%94%E9%A2%98%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

      if(location.href.toLowerCase().indexOf("exercisepaper") === -1){
        return;
      }
      window.onload = function () {
        let iframe;
        const otherATagSrcNum = 2;
        // window.timeSpend = 99999;
        // window.timeSpend = 99999;
        let parentBox = document.querySelector(".wrapper");
        let container = parentBox.querySelector(".container");
        parentBox.style.width = "48%";
        parentBox.style.margin = "0";
        container.style.width = "100%";
        const testList = container.querySelectorAll(".test-heading");
        for (let i = 0; i < testList.length; i++) {
          testList[i].style.position = "relative";
          let searchStr = testList[i].querySelector("h4").innerText;
          testList[i].addEventListener("click", function (e) {
            bindClick(testList[i].querySelector("h4"));
          });
          // 题目全称搜索（包含题号等括号）
          //createATag(testList[i], searchStr);
          // 题目仅名称搜索（不含题号与分值等括号）
          createATag(testList[i], searchStr.substring(searchStr.indexOf(')') + 1, searchStr.lastIndexOf('(')));
        }

        creatIframe(window, "");
        function bindClick(e) {
          if (iframe) {
            // 题目全称搜索（包含题号等括号）
            //iframe.src = creatBaiduSrc(e.innerText);
            // 题目仅名称搜索（不含题号与分值等括号）
            iframe.src = creatBaiduSrc(e.innerText.substring(e.innerText.indexOf(')') + 1, e.innerText.lastIndexOf('(')));
          }
        }

        function creatIframe(win, search, type) {
          let doc = win.document;
          let style = doc.createElement("style");
          style.innerText = `
          .search-baidu-iframe{
            position: fixed;
            right: 0;
            top: 0;
            width: 50%;
            height: 100%;
          }
          .searchBox{
            position: absolute;
            right: 0;
            bottom: -20px;
          }
          .searchBox a{
            margin-right: 5px;
          }
          .tips{
            position: fixed;
            right: 0;
            top: 0;
            color:red;
            z-index:10;
          }
          `;
          doc.body.appendChild(style);
          /*
          let div = doc.createElement("div")
          div.innerText="点击左侧题目可以在右侧自动搜索,\n两个链接直接跳转到对应搜题网站搜索结果,\n本提示一分钟后自动删除"
          div.classList.add("tips")
          doc.body.appendChild(div);
          setTimeout(()=>{
            div.parentNode.removeChild(div)
          },1000*60)
          */

          iframe = doc.createElement("iframe");
          iframe.src = creatBaiduSrc(search);
          iframe.classList.add("search-baidu-iframe");
          iframe.frameborder = 0;
          doc.body.appendChild(iframe);
        }
        function creatBaiduSrc(str) {
          if (!str) {
            return "https://www.baidu.com/";
          }
          return (
            "https://www.baidu.com/s?ie=UTF-8&wd=" + encodeURIComponent(str)
          );
        }

        function creatSrc(search, type) {
          switch (type) {
            case 0:
              return {
                src: `https://www.jiansouti.com/search.php?q=${encodeURI(
                  search
                )}&f=_all&m=yes&syn=yes&s=relevance`,
                text: "简搜题",
              };
            case 1:
              return {
                src: `https://www.xilvedu.cn/search.aspx?key=${escape(search)}`,
                text: "作业无忧",
              };
          }
        }

        function createATag(dom, text) {
          let div = document.createElement("div");
          div.classList.add("searchBox");
          for (let i = 0; i < otherATagSrcNum; i++) {
            let a = document.createElement("a");
            let src = creatSrc(text, i);
            a.href = src.src;
            a.innerText = src.text;
            a.target = "_blank";
            div.appendChild(a);
          }
          dom.appendChild(div);
        }
      };

      // 如果不需要锁死倒计时, 下方三行代码注释掉即可
      // 这里修改倒计时  单位是秒
      // 目前是 20分钟(60秒*20) + 不超过5分钟的随机数,需要的话自行修改, 因为我不确定每个考试是不是固定两个小时
      // let timeSpend = 60*20 + Math.floor(Math.random()*5)*60
      // setInterval(()=>{
      //   window.timeSpend = timeSpend;
      // },1000)
})();