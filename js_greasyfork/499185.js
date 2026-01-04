// ==UserScript==
// @name        从豆瓣影视直接跳转阿里搜
// @author      56
// @match       *://movie.douban.com/subject/*
// @version     0.1.0
// @namespace   https://movie.douban.com/subject
// @license     MIT
// @description 安装脚本后豆瓣电影标题旁会显示阿里云的logo，点击就可以跳转到阿里搜搜索影视资源了。
// @downloadURL https://update.greasyfork.org/scripts/499185/%E4%BB%8E%E8%B1%86%E7%93%A3%E5%BD%B1%E8%A7%86%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E9%98%BF%E9%87%8C%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/499185/%E4%BB%8E%E8%B1%86%E7%93%A3%E5%BD%B1%E8%A7%86%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E9%98%BF%E9%87%8C%E6%90%9C.meta.js
// ==/UserScript==

(function () {
  var host = location.hostname;
  if (host === 'movie.douban.com') {
    const title = encodeURIComponent(
      document
        .querySelector('title')
        .innerText.replace(/(^\s*)|(\s*$)/g, '')
        .replace(' (豆瓣)', '')
    );
    const subjectWrap = document.querySelector('h1');
    const subject = document.querySelector('.year');
    if (!subjectWrap || !subject) {
      return;
    }
    const span = document.createElement('span');
    subjectWrap.insertBefore(span, subject.nextSibling);
    span.insertAdjacentHTML(
      'beforebegin',
      `<style>.aliso{vertical-align: middle;}.aliso:hover{background: #fff!important;}</style>
          <a href="https://yunpan1.cc/?q=${title}" class="aliso" target="_blank"><img style="width:24px;height:24px" src="https://img.alicdn.com/imgextra/i2/O1CN011vHpiQ251TseXpbH7_!!6000000007466-2-tps-120-120.png" ></a>`
    );
  }
})();
