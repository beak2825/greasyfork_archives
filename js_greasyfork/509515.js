// ==UserScript==
// @name         即刻移动端自动跳转网页版
// @name:zh-CN   即刻移动端自动跳转网页版
// @name:en      Jike Mobile to Web Redirector
// @name:es      Redireccionador de Jike Móvil a Web
// @name:ja      JIKE モバイルからウェブ版への自動リダイレクト
// @name:ko      JIKE 모바일에서 웹으로 자동 리다이렉트
// @name:ru      Автоматическое перенаправление с мобильной версии Jike на веб
// @name:pt-BR   Redirecionador do Jike Mobile para Web
// @name:ar      محول جيكي من النسخة المحمولة إلى نسخة الويب

// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动将即刻移动端链接(m.okjike.com)重定向到网页版(web.okjike.com)，支持动态和用户主页链接转换
// @description:zh-CN  自动将即刻移动端链接(m.okjike.com)重定向到网页版(web.okjike.com)，支持动态和用户主页链接转换
// @description:en  Automatically redirects Jike mobile links (m.okjike.com) to web version (web.okjike.com), supporting both post and user profile URLs
// @description:es  Redirige automáticamente los enlaces móviles de Jike (m.okjike.com) a la versión web (web.okjike.com), compatible con URLs de publicaciones y perfiles
// @description:ja  JIKEモバイル版のリンク(m.okjike.com)を自動的にウェブ版(web.okjike.com)にリダイレクト。投稿とユーザープロフィールのURL変換に対応
// @description:ko  JIKE 모바일 링크(m.okjike.com)를 웹 버전(web.okjike.com)으로 자동 리다이렉트, 게시물 및 프로필 URL 지원
// @description:ru  Автоматически перенаправляет мобильные ссылки Jike (m.okjike.com) на веб-версию (web.okjike.com), поддерживает URL постов и профилей
// @description:pt-BR  Redireciona automaticamente links móveis do Jike (m.okjike.com) para versão web (web.okjike.com), suportando URLs de posts e perfis
// @description:ar  يقوم تلقائياً بتحويل روابط جيكي للجوال (m.okjike.com) إلى نسخة الويب (web.okjike.com)، يدعم روابط المنشورات والملفات الشخصية

// @author       Your Name
// @match        https://m.okjike.com/*
// @icon         https://web.okjike.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509515/%E5%8D%B3%E5%88%BB%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/509515/%E5%8D%B3%E5%88%BB%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前的URL
    let currentUrl = window.location.href;

    // 替换域名
    let newUrl = currentUrl.replace('m.okjike.com', 'web.okjike.com');

    // 处理路径中的特殊情况：originalPosts -> originalPost, users -> u
    newUrl = newUrl.replace('/originalPosts/', '/originalPost/').replace('/users/', '/u/');

    // 重定向到新的URL
    window.location.replace(newUrl);
})();