// ==UserScript==
// @name         Easy Voa Listen and write
// @namespace    http://fengwang.org.cn
// @version      0.4
// @description  voa enhance listen to write
// @author       wangfeng
// @require http://code.jquery.com/jquery-1.9.1.js
// @require https://cdn.jsdelivr.net/jsdiff/1.4.0/diff.min.js
// @match        http://www.easyvoa.com/*/*
// @match        http://www.51voa.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18152/Easy%20Voa%20Listen%20and%20write.user.js
// @updateURL https://update.greasyfork.org/scripts/18152/Easy%20Voa%20Listen%20and%20write.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

/*
shortcut:
ctrl+c : 播放/暂停
ctrl+m : 标记播放起始位置
ctrl+z : 退回起始位置重新播放
ctrl+< : 回退5秒
ctrl+> : 快进5秒
ctrl+; : 慢速30%
ctrl+' : 快速30%
*/
window.JsDiff = JsDiff;

function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}

function displayShortCuts(){
    var shortKeys = {
        "ctrl+c" : "播放/暂停",
        "ctrl+m" : "标记播放起始位置",
        "ctrl+z" : "退回起始位置重新播放",
        "ctrl+<" : "回退5秒",
        "ctrl+>" : "快进5秒",
        "ctrl+;" : "慢速30%",
        "ctrl+'" : "快速30%"
    };
    var lis = [];
    for(var k in shortKeys){
        lis.push('<li>'+k+':'+shortKeys[k]+'</li>');
    }
    var html = '<div class="shortcut-wrapper"><h3>快捷键:</h3><ul>'+lis.join("\n")+'</ul></div>';
    $('#playbar').after($(html));
}

function main(){
    var page = 'easyvoa';
    if(location.host == 'www.51voa.com'){
        page='51voa';
    }
    if(page == 'easyvoa'){
        var audioUrl = $('#playbar a').attr('href');
        var contentParas = $('#content_main p');
    }else if(page == '51voa'){
        var audioUrl = $('#mp3').attr('href');
        var contentParas = $('#content p');
    }
    
    if(!audioUrl) return;
    addGlobalStyle('del {       text-decoration: none;  color: #b30000; background: #fadad7;} ins {     background: #eaf2c2;    color: #406619; text-decoration: none;} .enhance-toolbar-wrapper{max-width:800px;}');
    $('#playbar').after($('<div class="enhance-toolbar-wrapper">'+
                          '<audio style="width:100%" controls="" src="'+audioUrl+'"></audio><textarea style="width:100%;height: 1000px;padding:12px;font-size:18px;"></textarea>'+
                          '<button id="btnTogglePara">查看原文</button></div>'+'<div class="diff-result" contenteditable="true" style="display:none;font-size:16px;line-height:1.5;white-space:pre-wrap;position:fixed;top:7px;right:7px;width:30%;background:white;height:100%;overflow-y:auto;"></div>'
                         ));
    displayShortCuts();
    contentParas.toggle();
    var audio=$('audio')[0];
    var textarea = $('textarea');
    var markTime = 0;
    var span = 5;
    var rateSpan = 0.3;
    $('#content_top_ad').remove();
    $("#btnTogglePara").click(function(){
        $('.diff-result').show().html(JsDiff.convertChangesToXML(JsDiff.diffWords(textarea.val(),contentParas.text())));
        contentParas.toggle();
    });
    $('body').keydown(function(e){
        if(e.ctrlKey && e.keyCode == 67){
            if(audio.paused){
                audio.play();
            }else{
                audio.pause();
            }
            return false;
        }else if(e.ctrlKey && e.keyCode == 77){
            markTime = audio.currentTime
            audio.pause();
            return false;
        }else if(e.ctrlKey && e.keyCode == 90){
            audio.currentTime = markTime
            audio.play();
            return false;
        }else if(e.ctrlKey && e.keyCode == 188){
            audio.currentTime -= span;
            audio.play();
            return false;
        }else if(e.ctrlKey && e.keyCode == 190){
            audio.currentTime += span;
            audio.play();
            return false;
        }else if(e.ctrlKey && e.keyCode == 186){
            audio.playbackRate  -= rateSpan;
            audio.play();
            return false;
        }else if(e.ctrlKey && e.keyCode == 222){
            audio.playbackRate  += rateSpan;
            audio.play();
            return false;
        }
    });
}

main();




