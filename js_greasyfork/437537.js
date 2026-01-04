// ==UserScript==
// @name         kivy importer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  скрипт добавляет кнопку скопировать импорт
// @description:ru  скрипт добавляет кнопку скопировать импорт
// @author       You
// @match        https://kivymd.readthedocs.io/en/latest/*
// @license MIT
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://www.google.com/s2/favicons?domain=readthedocs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437537/kivy%20importer.user.js
// @updateURL https://update.greasyfork.org/scripts/437537/kivy%20importer.meta.js
// ==/UserScript==



window.onload = function() {
    var all_classes = $( '.sig.sig-object.py');
    var zNode       = document.createElement ('button');
    zNode.innerHTML = '<a class="headerlink" id="btn_text_import" title="copy import from class">copy</a>';
    all_classes.append(zNode);
    $(document).on('click', '#btn_text_import' , function() {
        var descclassname = $(this).parent().parent().find('.sig-prename.descclassname').text()
        var descname = $(this).parent().parent().find('.sig-name.descname').text()
        navigator.clipboard.writeText("from "+descclassname.slice(0,descclassname.length-1)+" import "+descname)
});
}