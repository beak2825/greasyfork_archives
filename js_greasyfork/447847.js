// ==UserScript==
// @name         sfdc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fetch sfdc workflow rule information
// @author       You
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.10/dist/clipboard.min.js
// @match        https://www.tampermonkey.net/index.php?version=4.16.1&ext=iikm&updated=true
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447847/sfdc.user.js
// @updateURL https://update.greasyfork.org/scripts/447847/sfdc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //console.log("console log start")
    //console.log($('.expr').text())
    var data2Col = $('.data2Col')
    var ruleName =  '"' + $(data2Col[data2Col.length-1]).text().trim() + '"'
    //    var ruleName = $('.expr').text() + $('.data2Col').text()
    //for(typeCol in $('.typeCol')){
    //  console.log(typeCol.html())
    //}
    var typeCols = $('.typeCol')
    var typeColVal = [];
    for (let i = 0; i < typeCols.length; i++) {
        //    console.log(typeCols[i]);
        typeColVal.push($(typeCols[i]).text())
    }
    //    typeColVal = []
    //  console.log(typeColVal);

    var descCols = $('.descCol')
    var descColVal = [];
    for (let i = 0; i < descCols.length; i++) {
        //  console.log(descCols[i]);
        descColVal.push($(descCols[i]).text())
    }
    //    console.log(descColVal);
    var v =   ruleName + '\t"' + typeColVal.join('\n') + '"\t"' + descColVal.join('\n') + '"'
    console.log(v)
    //  if(!$("#ta_")){
    $(".pbHeader").append("<textarea id='ta_' name='ta_' value='test value'/>")
    $(".pbHeader").append('<button class="btn" data-clipboard-target="#ta_">COPY</button>')
    //}
    console.log(v)
    $("#ta_").val(v)
    console.log(ClipboardJS.isSupported())

    //    ClipboardJS.copy(v)
    var clipboard = new ClipboardJS('.btn');

    clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
    });

    clipboard.on('error', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
    });
    new ClipboardJS('.btn');

    //new Clipboard(v);

    //    copyToClipBoard(v)
    //    console.log($('.typeCol').html())
    //    console.log($('.descCol').html())

    //    alert ('start')
    //alert($)
    //alert("end")
    // Your code here...
})();

