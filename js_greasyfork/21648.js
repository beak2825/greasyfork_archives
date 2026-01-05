// ==UserScript==
// @name         douban marked
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  douban markdown
// @author       haidao
// @include      https://*.douban.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/markdown-it/7.0.0/markdown-it.min.js
// @require      https://greasyfork.org/scripts/21647-markdown-it-footnote/code/markdown-it-footnote.js?version=137863
// @downloadURL https://update.greasyfork.org/scripts/21648/douban%20marked.user.js
// @updateURL https://update.greasyfork.org/scripts/21648/douban%20marked.meta.js
// ==/UserScript==

(function() {
  // douban 会自动添加a标签，去掉
  $('#link-report span a').each(function(i, e){
    var c=$(e).text();
    $(e).replaceWith(c);
  });
  var content = $('#link-report span').html();
  // blockquote
  content = content.replace(/<br>/g,'\n').replace(/&gt;/g,'>');
  var mdf = window.markdownitFootnote;
  var md = window.markdownit().use(mdf);
  var marked_content = md.render(content);
  $('#link-report span').html(marked_content);

  // mathjax
  var head = document.getElementsByTagName("head")[0], script;
  script = document.createElement("script");
  script.type = "text/x-mathjax-config";
  script[(window.opera ? "innerHTML" : "text")] =
    "MathJax.Hub.Config({\n" +
    "  tex2jax: { inlineMath: [['$','$'], ['\\\\(','\\\\)']] }\n" +
    "});";
  head.appendChild(script);
  script = document.createElement("script");
  script.type = "text/javascript";
  script.src  = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
  head.appendChild(script);
})();

