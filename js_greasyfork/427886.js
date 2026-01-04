// ==UserScript==
// @name         yyfun助手
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  搜索yyfun001题目的一个小工具，文本框输入题号，点击搜索就能查找到答案（默认自动替换变量，如果有问题取消auto选中状态，可手动替换）
// @author       八七
// @match        http://www.yyfun001.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        unsafeWindow
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @downloadURL https://update.greasyfork.org/scripts/427886/yyfun%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427886/yyfun%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var code = '答案'
    var isauto = true
    var div = '<div style="float:left;"><input type="text" id="oldtEditerId"/><input type="checkbox" id="isauto"checked="checked" name="isauto"/>auto<button type="button" id="getid"style="margin-left:40px;">搜&nbsp索</button><br><textarea id="codetxt" style="width:300px;height:100px;float:left"></textarea></div>'
    $('div.righttitle').before(div)
    $('input#isauto').click(function(){
                    isauto = !isauto
             //alert(isauto)
        })
    $('button#getid').click(function(){
        $('button#getid').attr('disabled','disabled')
        var editid = $('input#oldtEditerId').val()
        String.prototype.replaceAll = function(s1, s2) {
            return this.replace(new RegExp(s1, "gm"), s2)
        }
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', 'http://www.yyfun001.com/lessonquestion/action.php?c=TEditerProxy&a=getServer&action=getTediterInfo&tEditerId='+editid+'&userId=12345&source=0&sourceId=502', true);
        httpRequest.send();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = httpRequest.responseText;
                var obj = JSON.parse(json);
                code = obj.question[0].code
                var ranval = JSON.parse(obj.question[0].randomNameValue)
                for(var key in ranval){
                   // alert(isauto)
                    if(isauto){
                    code = code.replaceAll(key,ranval[key])
                    }else{
                    var val=prompt("请输入"+key+"的值（根据题目要求输入）",ranval[key]);
                    if(val!=='-'){
                    code = code.replaceAll(key,val)
                    }
                    if(val==='+'){
                    code = code.replaceAll(key,ranval[key])
                    }
                    }}
                $('textarea#codetxt').val(code)
                $('textarea#codetxt').select()
                if(obj.question[0].code===null){
                for(var kny in obj.option){
                   if(obj.option[kny].isTrue===1){
                   code +="--" + obj.option[kny].orderBy + "\n"
                   }
                }
                    $('textarea#codetxt').val(code)
                }
            }
        }
        $('button#getid').removeAttr('disabled')
    })
    // Your code here...
})();