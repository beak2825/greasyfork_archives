// ==UserScript==
// @name         快捷标注版谷米傻逼
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  快捷标注版谷米傻逼(bgm.tv、bangumi.tv、chii.in)
// @author       老悠
// @include      https://bgm.tv/*
// @include      https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480678/%E5%BF%AB%E6%8D%B7%E6%A0%87%E6%B3%A8%E7%89%88%E8%B0%B7%E7%B1%B3%E5%82%BB%E9%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/480678/%E5%BF%AB%E6%8D%B7%E6%A0%87%E6%B3%A8%E7%89%88%E8%B0%B7%E7%B1%B3%E5%82%BB%E9%80%BC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle('.dialog { width: 100%; height: 100vh; background-color: rgba(0, 0, 0, 0.5); position: absolute; top: 0; left: 0;line-height: 30px; display: none; } .dialog .container {width: 220px;height: 100px; background-color: #fff;margin: calc((100vh - 100px)/2) auto; position: relative;} .dialog .container .dialog_footer { position: absolute; bottom: 0; } .dialog .container .dialog_footer button {position: relative;left: 50px;display: inline-block;width: 50px;bottom: 10px;}')
    let modalHtml='<div id="markModal" class="dialog">'
    +' <div class="container">'
    +'  <div class="dialog_header">'
    +'  </div>'
    +'  <div class="dialog_center">'
    +'     &nbsp;&nbsp;&nbsp;&nbsp;颜色：<input id="markColor" type="text" list="colors">'
    +'<datalist id="colors">'
    +'<option value="red">'
    +'<option value="yellow">'
    +'<option value="blue">'
    +'<option value="green">'
    +'</datalist>'
    +'<br>'
    +'     &nbsp;&nbsp;&nbsp;&nbsp;备注：<input id="markMark" type="text" ><br>'
    +'  </div>'
    +'   <div style="justify-content: center;display: flex;margin-top:10px;">'
    +'     <button class="cancel">取消</button>'
    +'     <button class="submit">确定</button>'
    +'    </div>'
    +'   </div>'
    +' </div>';
    $('body').append(modalHtml);

    let marksModalHtml='<div id="marksModal" class="dialog">'
    +' <div class="container" style="height: 500px;width: 500px;margin: calc((100vh - 500px)/2) auto;">'
    +'  <div class="dialog_header">'
    +'  </div>'
    +'  <div class="dialog_center">'
    +'  <div style="justify-content: center;display: flex;">'
    +'  全量傻逼备注JSON：<br>'
    +'  </div>'
    +'  <div style="justify-content: center;display: flex;">'
    +'     <textarea id="userMark" type="text" style="width:90%;height:420px;"/><br>'
    +'  </div>'
    +'  </div>'
    +'   <div style="justify-content: center;display: flex;margin-top:10px;">'
    +'     <button class="cancel">取消</button>'
    +'     <button class="submit">确定</button>'
    +'    </div>'
    +'   </div>'
    +' </div>';
    $('body').append(marksModalHtml);

    $("#headerProfile").find("div.actions").append('<a id="addMark" href="javascript:void(0)" class="chiiBtn"  data-toggle="modal" data-target="#markModal"><span>添加/修改备注</span></a>'
                                                  +'<a id="addMarks" href="javascript:void(0)" class="chiiBtn"  data-toggle="modal" data-target="#marksModal"><span>批量添加/修改备注</span></a>');
    let id1=$("#headerProfile").find("div.name small.grey").text().replace("@","");


    let userMark=localStorage.getItem('userMark');

    if(!userMark){
        userMark={};
    }
    else{
        try{
            userMark=JSON.parse(userMark);
        } catch(e){
            userMark={};
        }
    }
    $("#addMark").click(function(){
        $('#markModal').show(1000);
    });

    $("#addMarks").click(function(){
        $("#userMark").val(JSON.stringify(userMark));
        $('#marksModal').show(1000);
    });


    // 确定按钮的操作
    $('#markModal .submit').click(function () {
        userMark[id1]={"color":$("#markColor").val(),"mark":$("#markMark").val()};
        let json=JSON.stringify(userMark);
        console.log(json)
        localStorage.setItem('userMark', json, { expires: 999999999 });
        $('#markModal').fadeToggle(1000);
        location.reload();
    });
    // 取消按钮的操作
    $('#markModal .cancel').click(function () {
        $('#markModal').hide(1000)
    });



    // 批量模态框确定按钮的操作
    $('#marksModal .submit').click(function () {

        let json=$("#userMark").val();
        console.log(json)
        localStorage.setItem('userMark', json, { expires: 999999999 });
        $('#marksModal').fadeToggle(1000);
        location.reload();
    });
    // 批量模态框取消按钮的操作
    $('#marksModal .cancel').click(function () {
        $('#marksModal').hide(1000)
    });


    $.each(userMark, function(index, value){
        let $user=$("a[href='/user/"+index+"']:not(.avatar,.focus)");
        if($user.length> 0){
            $user.css({"color":value.color});
            $user.after('<span style="color:'+value.color+'">['+value.mark+']</span>')
        }
    });
})();
