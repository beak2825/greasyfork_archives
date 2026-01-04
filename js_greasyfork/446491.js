// ==UserScript==
// @name         为炒饭增加 Latex 公式渲染
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add mathjax
// @author       You
// @match        http://47.96.98.153/*
// @match        http://chao.fan/*
// @match        http://chao.fun/*
// @exclude      http://47.96.98.153/modifyArticle/*
// @exclude      http://chao.fan/modifyArticle/*
// @exclude      http://chao.fun/modifyArticle/*
// @exclude      http://47.96.98.153/f/*/submit
// @exclude      http://chao.fan/f/*/submit
// @exclude      http://chao.fun/f/*/submit
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/446491/%E4%B8%BA%E7%82%92%E9%A5%AD%E5%A2%9E%E5%8A%A0%20Latex%20%E5%85%AC%E5%BC%8F%E6%B8%B2%E6%9F%93.user.js
// @updateURL https://update.greasyfork.org/scripts/446491/%E4%B8%BA%E7%82%92%E9%A5%AD%E5%A2%9E%E5%8A%A0%20Latex%20%E5%85%AC%E5%BC%8F%E6%B8%B2%E6%9F%93.meta.js
// ==/UserScript==

(function() {
    'use strict'

    let script = document.createElement('script');
    script.src = 'https://cdn.staticfile.org/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
    script.async = true;
    let config = `MathJax.Hub.Config({
    extensions: ["tex2jax.js"],
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
      inlineMath: [ ['$','$']],
      displayMath: [ ['$$','$$']],
      processEscapes: true
    },
    "HTML-CSS": { availableFonts: ["TeX"] }
  });`
    config += 'function reMathJax() {"use strict"; MathJax.Hub.Queue(["Typeset", MathJax.Hub]);}'
    config += 'var mathJaxIntervalId; window.onload = window.onfocus = function(){ mathJaxIntervalId = setTimeout(reMathJax, 700); };'
    script.text = config;
    document.head.appendChild(script);
})()
