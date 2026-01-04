// ==UserScript==
// @name         TranslateFormulaOnPaste
// @namespace    http://excelworld.ru/
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @version      0.01
// @description  Перевод формулы с английского на русский при вставке из буфера обмена
// @author       krosav4ig
// @include *.excelworld.ru/*
// @downloadURL https://update.greasyfork.org/scripts/380785/TranslateFormulaOnPaste.user.js
// @updateURL https://update.greasyfork.org/scripts/380785/TranslateFormulaOnPaste.meta.js
// ==/UserScript==
var $=jQuery.noConflict();
$(window).bind("load",()=>{
    $('#message')[0].addEventListener(
        'paste',
        function (e){
            var clip=(e.originalEvent||e||window).clipboardData;
            var s=clip.getData('text/plain');
            if("="!=s.substring(0,1))return!1;
            s=(a=>r?a.replace(/,/g, ';').replace(/([0-9])\./g, '$1,'):s)(s.replace(/[A-Z0-9.$]+/g,(a)=>{return(entoru.hasOwnProperty(a)?((a)=>{return r=true, entoru[a]})(a):a)}));
            e.preventDefault();
            if ((this.selectionStart)||(this.selectionStart=='0')){
                this.value=this.value.substring(0,this.selectionStart)+s+
                    this.value.substring(this.selectionEnd,this.value.length);
            }
            if (document.selection){
                this.focus();
                var sel=document.selection.createRange();
                sel.text=s;
            }
        },
        false
    );
});