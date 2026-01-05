// ==UserScript==
// @name         Ficbook Convert Pane
// @namespace    *
// @version      1.0.5
// @description  try to take over the world!
// @author       Dimava
// @match        https://ficbook.net/home/myfics/*/parts/*
// @match        https://ficbook.net/home/myfics/*/addpart*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/quill/0.20.1/quill.min.js
// @resource     https://cdnjs.cloudflare.com/ajax/libs/quill/0.20.1/quill.snow.min.css
// @downloadURL https://update.greasyfork.org/scripts/21737/Ficbook%20Convert%20Pane.user.js
// @updateURL https://update.greasyfork.org/scripts/21737/Ficbook%20Convert%20Pane.meta.js
// ==/UserScript==
// for userscript:
if (location.host != 'fiddle.jshell.net')
  $('<button/>').html('Панель вставки').addClass('gte btn btn-default').insertBefore($('#content')).click(function(e) {
    e.preventDefault();
  });
quill = null;
///////////////////////////////////////////////
function convertTextToHtml(s) {
  function r(g, p) {
    s = s.replace(g, p);
  }
  r(/<tab>/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
  r(/[ ]+/g, ' ');
  r(/(\n)?<center>([^^]*?)<\/center>/g, function(c, c1, c2) {
    return (c1 ? '</div>' : '') + '<div style="text-align: center;">' + c2.replace(/\n/g, '</div><div style="text-align: center;">');
  });
  r(/(\n)?<right>([^^]*?)<\/right>/g, function(c, c1, c2) {
    return (c1 ? '</div>' : '') + '<div style="text-align: right;">' + c2.replace(/\n/g, '</div><div style="text-align: right;">');
  });
  r(/\n/g, '</div>\n<div>');
  s = (s.substr(0, 4) == '<div' ? '' : '<div>') + s + '</div>';
  /*
  s=s.replace(//g,'');
  */
  return s;
} ///////////////////////////////////////////////

function convertHtmlToText(s) {
  function r(g, p) {
    s = s.replace(g, p);
  }
  if ($('#ch4').prop('checked')) {
    r(/&lt;(\/?(b|s|i|tab|center|right))&gt/g, '<$1>');
  }
  r(/<br>/g, '');
  r(/&nbsp;/g, ' ');
  r(/<div style="text-align: center;">\s*([^^]*?)<\/div>/g, '<div><center>$1</center></div>');
  r(/<div style="text-align: right;">\s*([^^]*?)<\/div>/g, '<div><right>$1</right></div>');
  r(/<\/div>\s*<div>/g, '\n');
  if (!$('#ch1').prop('checked'))
    r(/<\/center>\n<center>|<\/right>\n<right>/g, '\n');
  if (!$('#ch2').prop('checked')) {
    r(/<\/b>((\n|<\/?(?!b\W)[^>]*>)*)<b>/g, '$1');
    r(/<\/i>((\n|<\/?(?!i\W)[^>]*>)*)<i>/g, '$1');
    r(/<\/s>((\n|<\/?(?!s\W)[^>]*>)*)<s>/g, '$1');
  }
  r(/<(\/?[^\s>]*)[^>]*>/g, '<$1>');
  r(/ {4}/g, '<tab>');
  r(/ +/g, ' ');
  r(/<\/?(?!\/)(?!b>|i>|s>|center>|right>|tab>)[^>]*>/g, '');
  r(/&lt;/g, '<');
  r(/&gt;/g, '>');
  r(/&laquo;/g, '«');
  r(/&raquo;/g, '»');
  r(/\t/g, '<tab>');
  if ($('#ch3').prop('checked'))
    r(/(<center>[^^]*?<\/center>|<right>[^^]*?<\/right>)|(^|\n)(?!\n)(\s(?!\n))*(?=\S)(?!<center>|<right>)/g, function(s, s1, s2) {
      return s1 ? s1 : (s2 ? s2 : '') + '<tab>';
    });
  // r(//g,'');
  return s;
} ///////////////////////////////////////////////

function popupQuillPane() {
  d = $('<div id="quillPane">').css({
    position: 'fixed',
    top: '0',
    right: '-70%',
    height: '100vh',
    width: '70%',
    'background-color': '#E7D6B6',
    border: '3px solid #BAA47D',
    'border-right': 'none',
    'border-radius': '50px 0 0 50px',
    transition: 'right 2s',
    'z-index': 20
  }).appendTo($('body'));
  var sep = '<span class="ql-format-separator"></span>';
  d.html('<div id="toolbar" class="toolbar" style="text-align: right;white-space: nowrap;overflow-y: auto;">' +
    '   <span class="ql-format-group">' +
    '      <span title="Bold" class="ql-format-button ql-bold btn btn-default"></span>' +
    '      <span class="ql-format-separator"></span>' +
    '      <span title="Italic" class="ql-format-button ql-italic btn btn-default"></span>' +
    '      <span class="ql-format-separator"></span>' +
    '      <span title="Strikethrough" class="ql-format-button ql-strike btn btn-default"></span>' +
    '   </span><span class="ql-format-group">' +
    '      <select title="Text Alignment" class="ql-align">' +
    '         <option value="left" label="Left" selected=""></option>' +
    '         <option value="center" label="Center"></option>' +
    '         <option value="right" label="Right"></option>' +
    '      </select></span><span class="ql-format-group">' +
    '   </span>' +
    '   <button class="gtex btn btn-default">Настройки</button>' + sep +
    '   <button id="convertAndPaste" class="btn btn-default">Преобразовать и вставить</button> ' + sep +
    '   <button class="gte btn btn-default">X</button>' +

    '</div>' +
    '<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/quill/0.20.1/quill.snow.min.css">' +
    '<div id="editor" class="editor form-control" style="font-size: 16px;text-indent: 0.24pt;overflow: auto;font-family: Verdana,\'Open Sans\',sans-serif;margin: 10px;height: calc(100vh - 110px);margin: 10px 50px;width: calc(70vw - 100px);"></div>');
  quill = new Quill('#editor', {
    modules: {
      'toolbar': {
        container: '#toolbar'
      }
    },
    theme: 'snow'
  });

  function toggleQuillPane() {
    if (parseInt(d[0].style.right) === 0) {
      d.css({
        right: '-70%'
      });
      ex.css({
        right: '-700px'
      });
    } else d.css({
      right: 0
    });
  }
  $('.gte').click(toggleQuillPane);
  $('#convertAndPaste').click(function() {
    if ($('#ch5').prop('checked'))
      $('#content').val('');
    $('#content').val($('#content').val() + convertHtmlToText(quill.getHTML()));
    toggleQuillPane();
  });
  //   setTimeout(
  d.animate({
    right: 0
  });
  //     , 99); //;function(){d.css({right: 0});},9)
  ex = $('<div/>').css({
    position: 'fixed',
    top: '10vh',
    right: '-700px',
    height: '80vh',
    width: '600px',
    'background-color': '#D3BE97',
    border: '3px solid #A98D5B',
    'border-right': 'none',
    'border-radius': '40px 0 0 40px',
    transition: 'right 2s',
    'z-index': 30,
    'overflow-x': 'hidden',
    'overflow-y': 'auto',
    ' max-width': 'calc(100vw + 30px)'
  }).appendTo($('body'));
  ex.html('<table style="margin:50px;background: none;">' +
    '  <style>' + //.hoverdiv{height: 60;transition: height 0.4s;overflow-x:hidden;}' +
    //'    tr:hover>*>.hoverdiv{height: 60px;}'+
    'pri{font-family: Menlo,Monaco,Consolas,"Courier New",monospace;background: wheat;border-radius: 8px;}</style>' +
    '  <tbody>' +
    '    <tr><td>' +
    '        <input id="ch1" type="checkbox" ' +
    (localStorage.getItem('PastePaneOps1') ? 'checked' : '') + '>' +
    '      </td><td>' +
    '        <label for="ch1">Не минифизировать</label>' +
    '          <div class="hoverdiv">Писать теги <pri>&lt;center&gt;</pri> и <pri>&lt;right&gt;</pri> на каждой строке.</div>' +
    '    </td></tr><tr><td>' +
    '        <input id="ch2" type="checkbox" ' +
    (localStorage.getItem('PastePaneOps2') ? 'checked' : '') + '>' +
    '      </td>' +
    '      <td>' +
    '        <label for="ch2">Не распутывать теги выделения</label>' +
    '          <div class="hoverdiv">Не стирать идущте подряд закрытие и открытие<br>' +
    'одного и того же тега,<br>' +
    ' например: <pri><b>&lt;/b&gt;&lt;b&gt;</b></pri> , <pri><b>&lt;/b&gt;</b>&lt;i&gt;<b>&lt;b&gt;</b></pri> и т.д.</div>' +
    '    </td></tr><tr><td>' +
    '        <input id="ch3" type="checkbox" ' +
    (localStorage.getItem('PastePaneOps3') ? 'checked' : '') + '>' +
    '      </td><td>' +
    '        <label for="ch3">Расставлять отступы</label>' +
    '          <div class="hoverdiv">Расставлять отступы <pri>&lt;tab&gt;</pri> перед каждой непустой<br>' +
    ' строкой вне <pri>&lt;center&gt;</pri> и <pri>&lt;right&gt;</pri>, пробелы в начале<br>' +
    ' строки игнорируются.</div>' +
    '    </td></tr><tr><td>' +
    '        <input id="ch4" type="checkbox" ' +
    (localStorage.getItem('PastePaneOps4') ? 'checked' : '') + '>' +
    '      </td><td>' +
    '        <label for="ch4">Парсить теги в тексте</label>' +
    '          <div class="hoverdiv">Считать написанные в тексте <pri>&lt;tab&gt;</pri>, <pri>&lt;b&gt;</pri>, <pri>&lt;s&gt;</pri>, <pri>&lt;i&gt;</pri>,<br>' +
    '<pri>&lt;center&gt;</pri>, <pri>&lt;right&gt;</pri>, тегами, а не простым текстом.<br><small style="font-size:70%">Это, вроде как, вообще не должно ни на что влиять. Зачем я вообще его сделал?</small></div>' +
    '    </td></tr><tr><td>' +
    '        <input id="ch5" type="checkbox" ' +
    (localStorage.getItem('PastePaneOps5') ? 'checked' : '') + '>' +
    '      </td><td>' +
    '        <label for="ch5">Удалить содержимое <pri>textarea</pri></label>' +
    '          <div class="hoverdiv">Удалять содержимое <pri>textarea</pri> перед вставкой<br>преобразованного текста. По умолчанию,<br> содержимое остаётся, и текст приписывается в конец.</div>' +
    '    </td></tr><tr><td></td><td><br>' +
    '        <button id="pastepanesample" class="gtex btn btn-default">Вставить пример текста</button>' +
    '          <div class="hoverdiv ">Вставить в редактор текст со всеми работающими тегами.<br>Редактор должен быть пуст.</div>' +
    '    </td></tr><tr><td></td><td><br>' +
    '        <button id="convertBack" class="gtex btn btn-default">Конвертировать обратно</button>' +
    '          <div class="hoverdiv ">Вставить в редактор сконвертированный<br> обратно текст из <pri>textarea</pri> .</div>' +
    '    </td></tr><tr><td></td><td><br>' +
    '        <button id="savePaneSettings" class="btn btn-default">Сохранить настройки</button>' +
    '          <div class="hoverdiv ">Чтобы в следующий раз, когда вы откроете... Ммм... <br>В общем, откроете, настройки остались теми же.</div>' +
    '    </td></tr><tr><td></td><td><br>' +
    '        <button id="savePaneSettings" class="gtex btn btn-default">Настройки</button>' +
    '          <div class="hoverdiv ">Закрыть панель настройки.<br> Сверху такая же кнопочка есть.</div>' +
    '    </td></tr>' + // &lt;&gt;
    '  </tbody>' +
    '</table>');

  $('#convertBack').click(function() {
    quill.setHTML(convertTextToHtml($('#content').val()));
  });

  $('#savePaneSettings').click(function() {
    localStorage.setItem('PastePaneOps1', $('#ch1').prop('checked') || '');
    localStorage.setItem('PastePaneOps2', $('#ch2').prop('checked') || '');
    localStorage.setItem('PastePaneOps3', $('#ch3').prop('checked') || '');
    localStorage.setItem('PastePaneOps4', $('#ch4').prop('checked') || '');
    localStorage.setItem('PastePaneOps5', $('#ch5').prop('checked') || '');
    alert('Saved!');
  });

  function toggleExtraPane() {
    if (parseInt(ex[0].style.right) === 0) ex.css({
      right: '-700px'
    });
    else ex.css({
      right: 0
    });
  }
  $('.gtex').click(toggleExtraPane);
  $('#pastepanesample').click(function(e) {
    if (quill.getText().length < 2)
      quill.setHTML('<div>bb<b>bbii</b><i><b>iiss</b></i><s><i><b>ssSS</b></i></s><i><b>SSII</b></i><b>IIBB</b>BB</div><div>bb<b>bbii</b><i><b>iiss</b></i><s><i><b>ss</b></i></s></div><div><s><i><b>SS</b></i></s><i><b>SSII</b></i><b>IIBB</b>BB</div><div>Left</div><div>&nbsp;&nbsp;&nbsp;&nbsp;Tabbed</div><div>&nbsp;&nbsp;&nbsp;&nbsp;T a  b   b    e     d      T       E        X         T</div><div>Left</div><div style="text-align: center;">Center</div><div style="text-align: center;">Center</div><div style="text-align: right;">Right</div><div style="text-align: right;">Right</div><div>Tab(&nbsp;&nbsp;&nbsp;&nbsp;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</div><div>&lt;tab&gt;Tags:&lt;b&gt;bold&lt;/b&gt;</div><div>Newline(</div><div><br></div><div>,</div><div><br></div><div><br></div><div>)</div>');
  });
}
$('.gte').one('click', popupQuillPane);
$('<style/>').html('#editor:before {content:\'Вставьте текст сюда и нажмите [Преобразовать и вставить].\\aПреобразованный текст будет приписан в конец.\';color:grey;height:0;position: absolute;left:0;top:0;font-size:10px;}').appendTo($('head'));
///////////////////////////////////////////////
//s = '';
//$('#c1').click(() => s = convertHtmlToText(s));
//$('#c2').click(() => s = convertTextToHtml(s));
//
//
//$('#u1').click(() => s = $('#t1').val());
//$('#u2').click(() => s = editor.getHTML());
//$('#v1').click(() => $('#t1').val(s));
//$('#v2').click(() => editor.setHTML(s));
//$('.q').click(function() {
//  $(this).attr('act').split(' ').forEach(e => $('#' + e).click());
//})
/*l=editor.getSelection().start;editor.insertText(l,'\n***');editor.formatLine(l+1,l+4, 'align', 'center');*/
console.log('quilled!');
window.getQuill = function() {
  return quill;
};
