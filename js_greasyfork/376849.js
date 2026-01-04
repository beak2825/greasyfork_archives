// ==UserScript==
// @name 去掉开源中国左侧评论栏
// @namespace 7YUX84VtKczqahPFp2ZZ4sc4S3BmKVxE
// @description 去掉开源中国左侧评论栏，因为你并不一定会用得着，影响视野
// @author asmoker<blog.smoker.cc@gmail.com>
// @version 0.1
// @match https://my.oschina.net/*/blog/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/376849/%E5%8E%BB%E6%8E%89%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E5%B7%A6%E4%BE%A7%E8%AF%84%E8%AE%BA%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/376849/%E5%8E%BB%E6%8E%89%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E5%B7%A6%E4%BE%A7%E8%AF%84%E8%AE%BA%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("div.two.wide.computer.only.column").css('visibility', 'hidden');
})();