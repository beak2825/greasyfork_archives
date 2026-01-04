// ==UserScript==
// @name         关键字高亮
// @namespace    highlight
// @version      0.2
// @description  文档高亮
// @author       myxw94
// @include        *
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/376029/%E5%85%B3%E9%94%AE%E5%AD%97%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/376029/%E5%85%B3%E9%94%AE%E5%AD%97%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==
(function() {
/*

highlight v5

Highlights arbitrary terms.

<http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:jb@eaio.com>

*/

jQuery.fn.highlight = function(pat) {
 function innerHighlight(node, pat) {
  var skip = 0;
  if (node.nodeType == 3) {
   var pos = node.data.toUpperCase().indexOf(pat);
   pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
   if (pos >= 0) {
    var spannode = document.createElement('span');
    spannode.className = 'highlight';
    var middlebit = node.splitText(pos);
    var endbit = middlebit.splitText(pat.length);
    var middleclone = middlebit.cloneNode(true);
    spannode.appendChild(middleclone);
    middlebit.parentNode.replaceChild(spannode, middlebit);
    skip = 1;
   }
  }
  else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
   for (var i = 0; i < node.childNodes.length; ++i) {
    i += innerHighlight(node.childNodes[i], pat);
   }
  }
  return skip;
 }
 return this.length && pat && pat.length ? this.each(function() {
  innerHighlight(this, pat.toUpperCase());
 }) : this;
};

jQuery.fn.removeHighlight = function() {
 return this.find("span.highlight").each(function() {
  this.parentNode.firstChild.nodeName;
  with (this.parentNode) {
   replaceChild(this.firstChild, this);
   normalize();
  }
 }).end();
};



function getSelectText() {
    return window.getSelection ? window.getSelection().toString() :
    document.selection.createRange().text;
}

    document.onkeydown = function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 67) { // 按c
           // document.execCommand("Copy")//执行复制
           // $('body').highlight(getSelectText());
            $('body').removeHighlight().highlight(getSelectText());
            $(".highlight").css("background-color","yellow")//先设置高颜色
        }
        if (e && e.keyCode == 72) { // 按H的打开帮助
            alert("说明 \n C    选中后关键词并高亮关键词 \n X    取消高亮\n  H   打开帮助 \n  注意:输入文字时请调整汉字输入模式,否则会触发功能!");

        }
    };

})();