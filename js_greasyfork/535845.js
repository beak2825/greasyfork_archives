// ==UserScript==
// @name         wellos增强
// @namespace    http://tampermonkey.net/
// @version      2025-05-16
// @description  Enhance GitLab with additional features and better performance
// @author       wlzzld
// @match        https://wellos.westwell-lab.com/workbench/**
// @icon         https://wellos.westwell-lab.com/static/logo-white.f5b0f135.svg
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @resource css https://unpkg.com/layui@2.11.1/dist/css/layui.css
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://unpkg.com/layui@2.11.1/dist/layui.js
// @downloadURL https://update.greasyfork.org/scripts/535845/wellos%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/535845/wellos%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

function addStyle() {
    GM_addStyle(GM_getResourceText("css"));
}
var has_bind = {}

function addHtml(){
    // console.log("addHtml");
    var gongshi_html = "";
    gongshi_html += '<div class="ant-space-item" style="cursor: pointer;">';
    gongshi_html += '    <div class="view___3CJUF" title="工时" style="color: rgb(232, 255, 251); border-color: rgb(232, 255, 251); background: rgb(0, 154, 41); border-width: 0px;">工时</div>';
    gongshi_html += '</div>';
    $("tr[data-row-key]").each(function(i,o){
        var task_id = $(o).attr("data-row-key");
        if(!has_bind[task_id]){
            $(o).find('td:first').prepend(gongshi_html);
            $(o).find("div[title='工时']").parent().bind("click", function(){
                console.log(task_id);
                getManHourList(localStorage.token,task_id);
            });
            has_bind[task_id] = true;
        }
    })
}
var riliIndex;
function getManHourList(token,task_id){
    var loadIndex = layer.msg('获取工时，请稍候！', {
        icon: 16,
        shade: 0.01
    });
    var settings = {
        "url": "/api/entity/query/man_hour?token="+token+"&attr_model=man_hour&size=0&page=0&add_q=%257B%2522attr_code%2522%253A%2522work_task_id%2522%252C%2522attr_model%2522%253A%2522man_hour%2522%252C%2522data_type%2522%253A%2522link%2522%252C%2522op%2522%253A%2522in%2522%252C%2522val%2522%253A%255B%2522"+task_id+"%2522%255D%257D",
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function (response) {
        console.log(response.data.data_list);
        var marks = {};
        for(var i=0; i<response.data.data_list.length; i++){
            marks[response.data.data_list[i].occur_time] = "";
        }
        console.log(marks);
        var content_html ="";
        content_html += '<div class="layui-row">'
        content_html += '    <div class="layui-col-xs6">';
        content_html += '        <div class="layui-inline" id="laydate-static"></div>';
        content_html += '    </div>';
        content_html += '    <div class="layui-col-xs6" style="margin-top: 25px;margin-left: -15px;">';
        content_html += '            <div class="layui-form-item">';
        content_html += '                <label class="layui-form-label">日期</label>';
        content_html += '                <div class="layui-input-inline layui-input-wrap">';
        content_html += '                    <input type="text" id="spiking_occur_time" lay-verify="required" autocomplete="off" lay-affix="clear" class="layui-input">';
        content_html += '                </div>';
        content_html += '            </div>';
        content_html += '            <div class="layui-form-item">';
        content_html += '                <label class="layui-form-label">时长</label>';
        content_html += '                <div class="layui-input-inline layui-input-wrap">';
        content_html += '                    <input type="number" id="spiking_man_hour" placeholder="" class="layui-input" min="0" step="1">';
        content_html += '                </div>';
        content_html += '            </div>';
        content_html += '            <div class="layui-form-item">';
        content_html += '                <button type="button" id="spiking_submit" class="layui-btn layui-btn-radius layui-btn-fluid">提交工时</button>';
        content_html += '            </div>';
        content_html += '    </div>';
        content_html += '</div>';
        riliIndex = layer.open({
            type: 1, // page 层类型
            area: ['600px', '330px'],
            title: ['工时', 'font-size: 18px;text-align:center'],
            shade: 0.6, // 遮罩透明度
            shadeClose: true, // 点击遮罩区域，关闭弹层
            maxmin: false, // 允许全屏最小化
            anim: 0, // 0-6 的动画形式，-1 不开启
            content: content_html,
            success: function(layero, index, that){
                layer.close(loadIndex);
                $("#spiking_submit").hide();
            }
        });
        layui.use(function(){
            var laydate = layui.laydate;
            // 直接嵌套显示
            laydate.render({
                elem: '#laydate-static',
                mark:marks,
                showBottom: false,
                theme: 'molv',
                position: 'static',
                done: function(value, date){
                    console.log(value);
                    console.log(marks[value])
                    $("#spiking_occur_time").val(value);
                    $("#spiking_man_hour").val(8);
                    if(marks[value] == undefined){
                        $("#spiking_submit").show();
                    }else{
                        $("#spiking_submit").hide();
                    }
                }
            });
        });
        $("#spiking_submit").click(function() {
            addManHour(Number(task_id),Number($("#spiking_man_hour").val()),$("#spiking_occur_time").val())
        });
    });
}

function addManHour(task_id,man_hour,occur_time){
    var principal = user.uid;
    var params = {};
    params["attr_model"] = "man_hour";
    params["att"] = {};
    params["att"]["status"]= "pending_approve";
    params["att"]["work_task_id"]= task_id;
    params["att"]["man_hour_type"]= "r&b";
    params["att"]["man_hour"]= man_hour;
    params["att"]["principal"]= principal;
    params["att"]["occur_time"]= occur_time;
    console.log(params);
    console.log(JSON.stringify(params));
    var settings = {
        "url": "/api/entity/man_hour?token="+localStorage.token,
        "method": "POST",
        "contentType":"application/json",
        "dataType":"json",
        "data":JSON.stringify(params),
        "timeout": 0,
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
        alert(response.msg);
        layer.close(riliIndex,function(){
            getManHourList(localStorage.token,task_id);
        });
    });
}
var user = {};
function getUserInfo(){
    var settings = {
        "url": "/api/auth/check/user?token="+localStorage.token,
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function (response) {
        user = response.data;
        console.log(user);
    });
}
(function () {
    'use strict';

    addStyle();
    getUserInfo();
    setInterval(addHtml, 1000);
})();