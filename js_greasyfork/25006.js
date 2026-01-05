// ==UserScript==
// @name           Virtonomica: отображение сумм с разделителями в подсказке к полю ввода
// @version        1.1
// @include        http*://*virtonomic*.*/*
// @description    Добавляет в поля ввода всплывающую подсказку с форматированными числами
// @author         cobra3125
// @namespace      virtonomica
// @downloadURL https://update.greasyfork.org/scripts/25006/Virtonomica%3A%20%D0%BE%D1%82%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%83%D0%BC%D0%BC%20%D1%81%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B8%D1%82%D0%B5%D0%BB%D1%8F%D0%BC%D0%B8%20%D0%B2%20%D0%BF%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D0%B7%D0%BA%D0%B5%20%D0%BA%20%D0%BF%D0%BE%D0%BB%D1%8E%20%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/25006/Virtonomica%3A%20%D0%BE%D1%82%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%83%D0%BC%D0%BC%20%D1%81%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B8%D1%82%D0%B5%D0%BB%D1%8F%D0%BC%D0%B8%20%D0%B2%20%D0%BF%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D0%B7%D0%BA%D0%B5%20%D0%BA%20%D0%BF%D0%BE%D0%BB%D1%8E%20%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0.meta.js
// ==/UserScript==

var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  function updateTitle(editor){
    editor.attr('title', formatter.format(editor.val()));
  }

  $("input[name]").mouseenter(function(){
    var input = $(this);
    if(input.attr('name').toLowerCase().indexOf('price') >= 0 || input.attr('name').toLowerCase().indexOf('sum') >= 0){
      updateTitle($(this)); 
    }
  });
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}