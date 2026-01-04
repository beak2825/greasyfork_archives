// ==UserScript==
// @name        干掉跳转警告
// @description 干掉各大博客平台的外链跳转警告
// @namespace   https://github.com/zhongbr
// @version     1.0.1
// @author      Zhongbr
// @include     *://blog.csdn.net/*
// @include     *://www.zhihu.com/*
// @include     *://www.jianshu.com/*
// @include     *://mail.qq.com/*
// @license     GPL License
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/419134/%E5%B9%B2%E6%8E%89%E8%B7%B3%E8%BD%AC%E8%AD%A6%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/419134/%E5%B9%B2%E6%8E%89%E8%B7%B3%E8%BD%AC%E8%AD%A6%E5%91%8A.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function log() {
      var _console;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console).log.apply(_console, ["[Site-Director ".concat(new Date().toLocaleTimeString(), "]")].concat(args));
    }

    /*
    * CSDN网站
    * */
    var CSDNDirector = {
      regexp: /^https?:\/\/blog.csdn.net/g,
      director: function director(document) {
        log('csdn site matched .');
        document.querySelector('#mainBox > main > div.blog-content-box > article').querySelectorAll('a:not([name])').forEach(function (e) {
          var a = document.createElement("a");
          a.innerHTML = "<span onclick=\"window.open('".concat(e.href, "')\">").concat(e.innerText, "</>");
          e.replaceWith(a);
        });
      }
    };

    /*
    * 知乎网站
    * */
    var zhihuDirector = {
      regexp: /zhihu/,
      director: function director(document) {
        log("zhihu site matched .");
        document.querySelectorAll("a").forEach(function (v) {
          var regexp = /https:\/\/link.zhihu.com\/\?target=(.*)/;

          if (v.href.match(regexp)) {
            v.href = v.href.replace(regexp, function ($0, $1) {
              return decodeURIComponent($1);
            });
          }
        });
      }
    };

    var JianShuDirector = {
      regexp: /^https?:\/\/www.jianshu.com/,
      director: function director(document) {
        document.querySelector("article").querySelectorAll("a").forEach(function (e) {
          var regexps = [/https:\/\/links.jianshu.com\/go\?to=(.*)/, /https?:\/\/links?.jianshu.com\/?\?t=(.*)/];
          regexps.forEach(function (regexp) {
            if (regexp.test(e.href)) {
              e.href = e.href.replace(regexp, function (_, target) {
                return decodeURIComponent(target);
              });
            }
          });
        });
      }
    };

    /*
    * QQ邮箱
    * */
    var QQMail = {
      regexp: /^https?:\/\/mail.qq.com/,
      director: function director(document) {
        document.querySelectorAll("a[data-targettype=webpage]").forEach(function (e) {
          var a = document.createElement("a");
          a.innerHTML = "<span onclick=\"window.open('".concat(e.href, "')\">").concat(e.innerText, "</>");
          e.replaceWith(a);
        });
      }
    };

    var websiteLocation = unsafeWindow.location.href;
    var siteDocument = unsafeWindow.document;
    var directors = [CSDNDirector, zhihuDirector, JianShuDirector, QQMail]; // 匹配网站开始替换

    for (var i = 0; i < directors.length; i++) {
      if (directors[i].regexp.test(websiteLocation)) {
        directors[i].director(siteDocument, unsafeWindow);
        break;
      }
    }

}());