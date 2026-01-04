// ==UserScript==
// @name         百度脑图导入导出JSON格式
// @namespace    http://mind.clboy.cn/
// @version      0.1
// @description  百度脑图导入导出JSON格式数据，可以配合http://mind.clboy.cn使用
// @author       cloudlandboy
// @match        *://naotu.baidu.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/394815/%E7%99%BE%E5%BA%A6%E8%84%91%E5%9B%BE%E5%AF%BC%E5%85%A5%E5%AF%BC%E5%87%BAJSON%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/394815/%E7%99%BE%E5%BA%A6%E8%84%91%E5%9B%BE%E5%AF%BC%E5%85%A5%E5%AF%BC%E5%87%BAJSON%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var LINK=document.createElement('a');
    var LOCALFILE=document.createElement('input');
    LINK.style.display='none';
    LOCALFILE.style.display='none';
    LOCALFILE.type='file';
    LOCALFILE.onchange=function(){
        var file = this.files[0];
        var fileName = file.name.split('.').pop();
        if (!(fileName == 'json')) {
          alert('不是.json文件');
           return;
        }
        var fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = () => {
            try{
                var data = JSON.parse(fileReader.result);
                minder.importJson(data);
            }catch(e){
                alert('json文件解析失败！');
            }
        }
    };
    $('body').append(LINK)
    $('body').append(LOCALFILE)
    var elei=$('<div>导入JSON</div>');
    var eleo=$('<div>导出JSON</div>');
    var css={
        'height': '40px',
        'display': 'inline-block',
        'float': 'right',
        'padding': '0 5px',
        'user-select': 'none',
        'cursor':'pointer',
        'background-color':'red',
        'margin-right':'10px'
    };
    elei.css(css);
    eleo.css(css);
    elei.hover(function(){
        $(this).css("background-color","green");
    },function(){
        $(this).css("background-color","red");
    });
    eleo.hover(function(){
        $(this).css("background-color","green");
    },function(){
        $(this).css("background-color","red");
    });
    eleo.click(function(){
        var blob = new Blob([JSON.stringify(minder.exportJson())]);
        var fileName=minder.getRoot().data.text;
        LINK.download = fileName.replace(fileName[0], fileName[0].toLowerCase()) + ".json";
        LINK.href = URL.createObjectURL(blob);
        LINK.click();
    });
    elei.click(function(){
        LOCALFILE.click();
    });
    eleo.appendTo('header');
    elei.appendTo('header');
})();