// ==UserScript==
// @name         Mina Helper
// @namespace    PowerTalent
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://mina.mazii.net/*
// @require      https://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28563/Mina%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/28563/Mina%20Helper.meta.js
// ==/UserScript==

$(document).ready(function() {    
    $('.tab-header').append('<div id="talentToolDiv" class="item-header tabmina6"></div>');
    $('#talentToolDiv').append('<input type="button" id="japaneseBtn" class="btn btn-success" value="JAPANESE"/>');
    $('#talentToolDiv').append('<input type="button" class="btn btn-info" id="romanjiBtn" value="KANJI"/>');
    $('#talentToolDiv').append('<input type="button" id="vietnamBtn" class="btn btn-warning" value="VIETNAMESE" />');
    $('#talentToolDiv').append('<input type="button" id="exportNewWordHira" class="btn btn-primary" value="EXPORT HIRAGANA" />');
    $('#talentToolDiv').append('<input type="button" id="exportNewWordKanji" class="btn btn-primary" value="EXPORT KANJI" />');
    $('input[type="button"]').css('margin-right','5px');
    
    $('#romanjiBtn').click(function(){
        $('.item-roumaji').toggle();
    });
    
    $('#vietnamBtn').click(function(){
        $('.item-vietnamese').toggle();
    });
    
    $('#japaneseBtn').click(function(){
        $('.item-japanese').toggle();
    });
    
    $('#exportNewWordHira').click(function(){
        exportNewWordHira();
    });
    
    $('#exportNewWordKanji').click(function(){
        exportNewWordKanji();
    });
    
    function exportNewWordHira(){
        var listNewWord = '';
        $('.list-kotoba').each(function(){
            listNewWord += $(this).find('.item-japanese')[0].innerHTML;
            listNewWord += ',';
            listNewWord += $(this).find('.item-vietnamese')[0].innerHTML;            
            listNewWord += '\n';
        });
        
        listNewWord = listNewWord.replace(/。/g, '');
        listNewWord = listNewWord.replace(/～/g, '');
        listNewWord = listNewWord.replace(/？/g, '');
        copyToClipboard(listNewWord);
    }
    
    function exportNewWordKanji(){
        
        var listNewWord = '';
        $('.list-kotoba').each(function(){
            if (!!$(this).find('.item-roumaji')[0]){
                kanji = $(this).find('.item-roumaji')[0].innerHTML;
                kanji = kanji.replace(/\t/g,'');
                kanji = kanji.replace(/\n/g,'');
                kanji = kanji.substring(0,kanji.indexOf(" "));
                listNewWord += kanji;
            } else {
                return;
            }
            listNewWord += '(';
            listNewWord += $(this).find('.item-japanese')[0].innerHTML;
            listNewWord += ')';
            listNewWord += ',';
            listNewWord += $(this).find('.item-vietnamese')[0].innerHTML;            
            listNewWord += '\n';
        });
        
        listNewWord = listNewWord.replace(/。/g, '');
        listNewWord = listNewWord.replace(/～/g, '');
        listNewWord = listNewWord.replace(/？/g, '');
        copyToClipboard(listNewWord);
    }
    
    function copyToClipboard(val){
        
        new Clipboard('.btn', {
            text: function(trigger) {
                return val;
            }
        });
      
      alert('Copy success to Clipboard');
    }
});