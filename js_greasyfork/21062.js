// ==UserScript==
// @name        Tabun IMG'er
// @author   Йетанозер
// @namespace   localhaust
// @description I Want my <img> back!

// @include  http://tabun.everypony.ru/*
// @include  http://tabun.everypony.info/*
// @include  http://табун.всепони.рф/*

// @include  https://tabun.everypony.ru/*
// @include  https://tabun.everypony.info/*
// @include  https://табун.всепони.рф/*

// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js

// @grant none

// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/21062/Tabun%20IMG%27er.user.js
// @updateURL https://update.greasyfork.org/scripts/21062/Tabun%20IMG%27er.meta.js
// ==/UserScript==

$(window).load(function(){ //Да, это всё за чем нуже жикваери. Нет, я не смог заставить это работать иначе.
    function insertOverCaret(areaId, text, aftertext) {
        var txtarea = document.getElementById(areaId);
        var scrollPos = txtarea.scrollTop;
        var caretPos = txtarea.selectionStart;

        var front = (txtarea.value).substring(0, caretPos);
        var mid = (txtarea.value).substring(txtarea.selectionStart, txtarea.selectionEnd);
        var back = (txtarea.value).substring(txtarea.selectionEnd, txtarea.value.length);
        txtarea.value = front + text + mid + aftertext + back;
        caretPos = caretPos + text.length;
        txtarea.selectionStart = caretPos;
        txtarea.selectionEnd = caretPos;
        txtarea.focus();
        txtarea.scrollTop = scrollPos;
    }
    

        var newButt = document.createElement("li");
       newButt.classList.add('markItUpButton');
       newButt.classList.add('markItUpButton15');
       newButt.classList.add('edit-image');
    
       var newLink = document.createElement("a");
       newLink.href = '#';
       newLink.title = 'Добавить <img>';
       newLink.innerHTML = 'Добавить <img>';
    
       newLink.onclick = function(event){
           event.preventDefault();
           insertOverCaret('form_comment_text', '<img src = "', '"></img>');
       };
    
       newButt.appendChild(newLink);
       var header = document.getElementsByClassName("markItUpHeader");
        //alert(header.length);
        header.item(0).firstChild.appendChild(newButt);
}); 