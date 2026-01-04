// ==UserScript==
// @name         JianShu Formatter 简书Markdown格式转换
// @namespace    http://tampermonkey.net/
// @namespace    https://www.jianshu.com/u/15893823363f
// @require https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @version      3.2
// @description  简书Markdown格式转换
// @author       Zszen
// @match        https://www.jianshu.com/writer
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380594/JianShu%20Formatter%20%E7%AE%80%E4%B9%A6Markdown%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/380594/JianShu%20Formatter%20%E7%AE%80%E4%B9%A6Markdown%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //var targetEditor = $("#arthur-editor");

initMe()

$("html").keypress(function(evt){
    if(evt.originalEvent.charCode==27){
        var bt_close_publish = $("div").filter(function(idx,el){return $(el).text()=='×'})
        bt_close_publish.click()
        initMe()
    }
});

function initMe(){
setTimeout(function(){
    var btUpdate = $("li");
    if(!btUpdate){
       initMe();
       return;
    }
	//
	//console.log( $("ul.clearfix"));
    if($(".bt1f").length>0){
        return
    }
    $("ul.clearfix").find('a').on('click',initMe);
    btUpdate.on('click',initMe);

    var addedBt = $('<li class="bt1f"><a class="fa format-code" data-action="">格</a></li>');
    $("ul.clearfix").append(addedBt);
    addedBt.on('click', formatInput)
    addedBt = $('<li class="bt1f"><a class="fa insert-title" data-action="">插</a></li>');
    $("ul.clearfix").append(addedBt);
    addedBt.on('click', addTitle)
},800)
}

function formatInput(){
    var txt = $("textarea");
    //console.log(txt.val());
    var str = txt.val();
    str = str.replace(/···/g,'```')
    str = str.replace(/·/g,'`')
    str = str.replace(/〈|《/g,'<')
    str = str.replace(/〉|》/g,'>')
    //str = str.replace(//g,'<')
    //str = str.replace(//g,'>')
    str = str.replace(/「|『/g,'{')
    str = str.replace(/』|」/g,'}')
    //console.log(str);
    txt.val(str)
}

function addTitle(){
    var txt = $("textarea");
    //var startPos = txt.selectionStart;
    //console.log(startPos)
	insertAtCursor(txt,"\n___\n####")
	setSelectionRange(txt,txt.value.length,txt.value.length);
}

function insertAtCursor(myField, myValue) {
    if (document.selection) {
        //IE support
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        // sel.select();
    } else if (myField.selectionStart || myField.selectionStart == '0') {
        //MOZILLA/NETSCAPE support
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        var beforeValue = myField.value.substring(0, startPos);
        var afterValue = myField.value.substring(endPos, myField.value.length);

        myField.value = beforeValue + myValue + afterValue;

        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
        // myField.focus();
    } else {
        //myField.value += myValue;
        myField.val(myField.val()+myValue)
        // myField.focus();
    }
}

function setSelectionRange(input, selectionStart, selectionEnd) {
	if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
	}else if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	}
}

})();