// ==UserScript==
// @name         搜狗录音助手导出字幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将搜狗录音助手识别的内容导出为srt字幕文件。
// @author       Luka.
// @match        rec.sogou.com/transcription_edit/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421148/%E6%90%9C%E7%8B%97%E5%BD%95%E9%9F%B3%E5%8A%A9%E6%89%8B%E5%AF%BC%E5%87%BA%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/421148/%E6%90%9C%E7%8B%97%E5%BD%95%E9%9F%B3%E5%8A%A9%E6%89%8B%E5%AF%BC%E5%87%BA%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var parseTime = function(str){
        var st_raw = parseFloat(str.substring(0,str.length-1))
        var st_ms = Math.floor(st_raw*1000-Math.floor(st_raw)*1000).toString().padStart(3,"0")
        st_raw = Math.floor(st_raw)
        var st_s = Math.floor(st_raw%60).toString().padStart(2,"0")
        st_raw = (st_raw/60)
        var st_m = Math.floor(st_raw%60).toString().padStart(2,"0")
        st_raw = (st_raw/60)
        var st_h = Math.floor(st_raw%60).toString().padStart(2,"0")
        var st = `${st_h}:${st_m}:${st_s},${st_ms}`
         return st;
    }
    var exportTxt =$($("a:contains('导出文本')")[0])
    var link = $(exportTxt.clone())
    link.html("导出srt字幕")
    var raw_content = window.__INITIAL_STATE__.editResultData[1].content.sentences;
    raw_content = raw_content.map((i)=>{
        return i.id+'\n'+
            parseTime(i.start)+' --> '+parseTime(i.end)+'\n'+
            i.text+'\n\n'
    })
    var content = raw_content.join('')
    link.attr('download',window.__INITIAL_STATE__.recordData[1].record.title + ".srt")
    link.attr('href', URL.createObjectURL(new Blob([content], {type: 'text/srt'})));
    exportTxt.parent().append(link);
})();