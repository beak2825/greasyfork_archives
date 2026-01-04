// ==UserScript==
// @name              Practice:百度首页和搜索页面添加 Google 搜索框
// @name:en           Practice:add a google search button on the baidu's homepage and search result page
// @namespace         http://144.34.219.189/
// @version           0.1
// @description       在百度首页和搜索结果页面的百度一下按钮后面添加 Google 按钮，方便直接进行 Google 搜索
// @description:en    add a google search button behind the baidu search button on the baidu's homepage and search result page,making it convenient to search in google
// @author            tobe
// @create            2019-07-17
// @match             http*://www.baidu.com/
// @match             http*://www.baidu.com/s?*
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/387553/Practice%3A%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%92%8C%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%20Google%20%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/387553/Practice%3A%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%92%8C%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%20Google%20%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {
  "use strict";
  let baiduBtn = document.getElementById("su"), //input
    form = document.getElementById("form"),
    googleBtn = document.createElement("span"); //span

  baiduBtn.style.width = "80px";
  baiduBtn.value = "百度";

  googleBtn.className = baiduBtn.parentElement.className;
  googleBtn.innerHTML =
    '<input type="submit" id="_su" value="谷歌" class="bg s_btn" style = "width:80px;margin:0 0 0 2px">';
  form.style.width = "702px";
  console.log(form.style.width);

  form.appendChild(googleBtn);

  googleBtn.addEventListener("click", function() {
    var input = document.getElementById("kw"); // 获取百度输入框
    var keyword = input.value.replace(/(^\s*)|(\s*$)/g, ""); // 获取搜索内容（去空格）
    if (keyword != "") {
      // 如果搜索内容不为空，就调用 googleSearch() 方法进行搜索，需要传入的参数是搜索内容
      googleSearch(keyword);
    }
  });
  function googleSearch(keyword) {
    // Google 搜索方法
    var link = "https://www.google.com/search?q=" + encodeURIComponent(keyword); // 拼接好 Google 搜索的链接
    window.open(link); //新窗口打开链接
  }
})();
