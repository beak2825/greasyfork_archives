// ==UserScript==
// @name         cncharity_tool
// @namespace    https://css.cncharity.com/
// @version      0.1.1
// @description  患者工作系统信息修改工具
// @author       You
// @match        https://css.cncharity.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437575/cncharity_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/437575/cncharity_tool.meta.js
// ==/UserScript==

// require      https://www.layuicdn.com/layui/layui.js
// resource css https://www.layuicdn.com/layui/css/layui.css
// GM_addStyle(GM_getResourceText("css"));

let cssScript = document.createElement('link');
cssScript.setAttribute('rel', 'stylesheet');
cssScript.setAttribute('type', 'text/css');
cssScript.href = "https://www.layuicdn.com/layui/css/layui.css";
document.documentElement.appendChild(cssScript);

let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://www.layuicdn.com/layui/layui.js";
document.documentElement.appendChild(script);

unsafeWindow.onload = function(){
    'use strict';

    document.styleSheets[0].insertRule('.info-right {text-align:right}');
    document.styleSheets[0].insertRule('.info-right .chat-item-text {width:auto; display:inline-block !important;display:inline;background-color:#92ce93;border-radius:10px;padding:5px}');
    document.styleSheets[0].insertRule('.pure-form {background-color: white;position:relative}');
    document.styleSheets[0].insertRule('.pure-control-group {margin: 5px}');
    document.styleSheets[0].insertRule('.closeBt {position:absolute;right:0;top:0;}');

    let vuex = JSON.parse(localStorage.vuex);
    let userInfo = vuex.user;

    layui.use(['layer', 'form', 'layedit'], function(){
        var $ = layui.jquery,
            layer = layui.layer,
            form = layui.form;

        $(document).on("click",".table-list .el-table__row .el-table_1_column_13", function(){
            let editLen = $(this).find('.el-popover__reference-wrapper').children().length;
            if (editLen > 0) { // 表示可编辑，可编辑的不处理
                return false;
            }
            let id = $(this).siblings(":first").children().text();
            // post请求数据
            let url = 'https://css.cncharity.com/server/css/0.1/seats/session/querySessionPage';
            let data = {
                "begDate": null,
                "endDate": null,
                "solveStatus": null,
                "tagsList": [],
                "status": null,
                "finishReason": null,
                "drugName": null,
                "accountId": parseInt(userInfo.userId),
                "satisfactionType": null,
                "complaintStatus": null,
                "pageSize": 10,
                "pageIndex": 1,
                "id": id,
                "realName": null
            };
            let retRes = sendData(url, data);
            if (retRes.code !== undefined &&
                retRes.code === 20000 &&
                retRes.data.records !== undefined) {
                // 关闭之前打开的弹窗
                layer.closeAll();
                renderForm($, layer, form, retRes.data.records[0]);
            } else {
                layer.msg(retRes.message, {icon: 2});
                console.log(userInfo);
                return false;
            }
        });
    });

    function renderForm($, layer, form, retData) {
        let formEl = getFormHtml(retData);
        //弹窗：捕获页
        layer.open({
            type: 1
            ,title: '修改会话信息'
            ,area: '640px'
            ,offset: 'auto' //具体配置参考：https://www.layui.site/doc/modules/layer.html#offset
            ,content: '<div style="padding: 20px;">'+ formEl +'</div>'
            ,shade: 0 //不显示遮罩
        });
        $('.layui-form-item').css('margin-bottom', '5px');
        form.render();

        // 表单提交
        form.on('submit(formDemo)', function(data){
            if (data.field.id == '') {
                delete data.field.id;
            }
            data.field.tags = [];
            $('.layui-form input[name=tags]').each(function () {
                if ($(this).prop('checked')) {
                    data.field.tags.push(this.value);
                }
            });
            data.field.tags = JSON.stringify(data.field.tags);
            // layer.alert(JSON.stringify(data.field), {
            //     title: '最终的提交信息'
            // });
            let url = 'https://css.cncharity.com/server/css/0.1/seats/session/addOrUpdateProperty';
            let retRes = sendData(url, data.field);
            if (retRes.code !== undefined &&
                retRes.code === 20000) {
                layer.msg(retRes.message, {icon: 1});
                layer.closeAll();
                $(".el-form-item__content:eq(11) button:eq(0)").click();
            } else {
                layer.msg(retRes.message, {icon: 2});
            }
            return false;
        });
    }

    function getFormHtml(data) {
        data.patientTags = data.patientTags !== undefined ? JSON.parse(data.patientTags) : [];
        data.propertyId = data.propertyId !== undefined ? data.propertyId : "";

        let allTags = ["{\"id\":0,\"title\":\"咨询类\",\"tags\":[\"驳回原因咨询\",\"备案医生/医院\",\"平台信息咨询\",\"申请流程/材料咨询\"]}","{\"id\":1,\"title\":\"查询类\",\"tags\":[\"筹集进度查询\",\"领药信息查询\",\"个人信息查询\",\"药房及药品信息查询\",\"物流相关查询\"]}","{\"id\":2,\"title\":\"操作类\",\"tags\":[\"领药信息修改\",\"个人信息修改\",\"特殊情况反馈\",\"患者要求驳回\",\"催审\",\"添加快递单号\",\"指导筹药操作\",\"回寄材料\"]}","{\"id\":3,\"title\":\"其他\",\"tags\":[\"优化建议\",\"AE/PC反馈\",\"产品/系统问题\",\"项目其他咨询\",\"补充材料\",\"补发短信\",\"无效会话\"]}"];
        let tagHtml = '<div style="border: 1px solid #eeeeee;margin-bottom: 5px">';
        allTags.forEach((v) => {
            v = JSON.parse(v);
            tagHtml += `<div class="layui-form-item" pane=""><label class="layui-form-label" style="width:90px">${v.title}</label><div class="layui-input-block">`
            v.tags.forEach((tV,k) => {
                tagHtml += `<input type="checkbox" lay-skin="primary" name="tags" value="${tV}" title="${tV}" ${data.patientTags.includes(tV) ? 'checked' : ''}>`;
            });
            tagHtml += '</div></div>';
        });
        tagHtml += '</div>';
        let formEl = '<form action="" class="layui-form" lay-filter="editSessionInfo">' +
            '<div class="layui-form-item">' +
            '<label class="layui-form-label" style="width:90px">属性ID</label>' +
            '<div class="layui-input-block">' +
            `<input autocomplete="off" class="layui-input" name="id" value="${data.propertyId}" placeholder="请输入属性ID" required disabled type="text">` +
            '</div></div><div class="layui-form-item">' +
            '<label class="layui-form-label" style="width:90px">流水号</label>' +
            '<div class="layui-input-block">' +
            `<input autocomplete="off" class="layui-input" lay-verify="required" name="seatsSessionId" value="${data.id}" placeholder="请输入流水号" disabled required type="text">` +
            '</div></div>' +
            tagHtml +
            '<div class="layui-form-item">' +
            '<label class="layui-form-label" style="width:90px">备注</label>' +
            '<div class="layui-input-block">' +
            `<input autocomplete="off" class="layui-input" name="solveReason" value="${data.solveReason}" placeholder="请输入备注" type="text">` +
            '</div></div><div class="layui-form-item">' +
            '<label class="layui-form-label" style="width:90px">是否解决</label>' +
            '<div class="layui-input-block">' +
            `<input name="solveStatus" title="未解决" type="radio" value="10" ${data.solveStatus == 10 ? 'checked' : ''}>` +
            `<input name="solveStatus" title="已解决" type="radio" value="20" ${data.solveStatus == 20 ? 'checked' : ''}></div></div>` +
            '<div class="layui-form-item">' +
            '<label class="layui-form-label" style="width:90px">投诉原因</label>' +
            '<div class="layui-input-block">' +
            `<input autocomplete="off" class="layui-input" name="complaintReason" value="${data.complaintReason}" placeholder="请输入投诉原因" type="text">` +
            '</div></div><div class="layui-form-item">' +
            '<label class="layui-form-label" style="width:90px">是否投诉</label>' +
            '<div class="layui-input-block">' +
            `<input name="complaintStatus" title="否" type="radio" value="10" ${data.complaintStatus == 10 ? 'checked' : ''}>` +
            `<input name="complaintStatus" title="是" type="radio" value="20" ${data.complaintStatus == 20 ? 'checked' : ''}>` +
            '</div></div><div class="layui-form-item"><div class="layui-input-block">' +
            '<button class="layui-btn" lay-filter="formDemo" lay-submit>提交</button>' +
            '<button class="layui-btn layui-btn-primary" type="reset">重置</button></div></div></form>';
        return formEl;
    }

    /**
     * @param url
     * @param data 参数：json对象
     * @param type 方法：get post
     * @param async 是否异步：true异步 false同步
     */
    function sendData(url, data, type = 'post', async = false) {
        let rData = {};
        $.ajax({
            url: url,
            type: type,
            dataType: 'json',
            async: async,
            data: JSON.stringify(data),
            headers: {
                'Authorization': userInfo.token,
                // 'Cookie': document.cookie,
                'Content-Type': 'application/json'
            },
            success: function(res){
                /** {"success":true,"code":20000,"message":"查询成功","data":{"records":[{"accountName":"邱甜","sessionStartTime":1639561788000,"complaintReason":"","finished":1,"patientTags":"[\"领药信息查询\",\"药房及药品信息查询\",\"领药信息修改\"]","satisfaction":"","skillGroupsId":36,"accountId":386,"realName":"游客","groupName":"金赛增","complaintStatus":10,"solveStatus":20,"createTime":1639561788000,"finishReason":"坐席主动关闭会话","drugName":"金赛增","id":1748123,"endTime":1639562180000,"propertyId":257412,"solveReason":"","status":"有效会话"},{"accountName":"邱甜","sessionStartTime":1639561788000,"complaintReason":"","finished":1,"patientTags":"[\"领药信息查询\",\"药房及药品信息查询\",\"领药信息修改\"]","satisfaction":"","skillGroupsId":36,"accountId":386,"realName":"卢伟琼","groupName":"金赛增","complaintStatus":10,"solveStatus":20,"createTime":1639561788000,"finishReason":"坐席主动关闭会话","drugName":"金赛增","id":1748123,"endTime":1639562180000,"propertyId":257455,"solveReason":"","status":"有效会话"},{"accountName":"邱甜","sessionStartTime":1639561788000,"complaintReason":"","finished":1,"patientTags":"[\"领药信息查询\",\"药房及药品信息查询\",\"领药信息修改\"]","satisfaction":"","skillGroupsId":36,"accountId":386,"realName":"卢伟琼","groupName":"金赛增","complaintStatus":10,"solveStatus":20,"createTime":1639561788000,"finishReason":"坐席主动关闭会话","drugName":"金赛增","id":1748123,"endTime":1639562180000,"propertyId":257456,"solveReason":"","status":"有效会话"},{"accountName":"邱甜","sessionStartTime":1639561788000,"complaintReason":"","finished":1,"patientTags":"[\"领药信息查询\",\"药房及药品信息查询\",\"个人信息修改\"]","satisfaction":"","skillGroupsId":36,"accountId":386,"realName":"卢伟琼","groupName":"金赛增","complaintStatus":10,"solveStatus":20,"createTime":1639561788000,"finishReason":"坐席主动关闭会话","drugName":"金赛增","id":1748123,"endTime":1639562180000,"propertyId":257457,"solveReason":"","status":"有效会话"},{"accountName":"邱甜","sessionStartTime":1639561788000,"complaintReason":"","finished":1,"patientTags":"[\"领药信息查询\",\"药房及药品信息查询\",\"领药信息修改\"]","satisfaction":"","skillGroupsId":36,"accountId":386,"realName":"卢伟琼","groupName":"金赛增","complaintStatus":10,"solveStatus":20,"createTime":1639561788000,"finishReason":"坐席主动关闭会话","drugName":"金赛增","id":1748123,"endTime":1639562180000,"propertyId":257459,"solveReason":"","status":"有效会话"},{"accountName":"邱甜","sessionStartTime":1639561639000,"complaintReason":"","finished":1,"patientTags":"[\"申请流程/材料咨询\",\"平台信息咨询\"]","satisfaction":"","skillGroupsId":24,"accountId":386,"realName":"方玲","groupName":"福可维","complaintStatus":10,"solveStatus":20,"createTime":1639561639000,"finishReason":"坐席主动关闭会话","drugName":"福可维","id":1748113,"endTime":1639562487000,"propertyId":257421,"solveReason":"","status":"有效会话"},{"accountName":"邱甜","sessionStartTime":1639561396000,"complaintReason":"","finished":1,"patientTags":"[\"无效会话\"]","satisfaction":"","skillGroupsId":36,"accountId":386,"realName":"褚仲丽","groupName":"金赛增","complaintStatus":10,"solveStatus":20,"createTime":1639561396000,"finishReason":"坐席主动关闭会话","drugName":"金赛增","id":1748087,"endTime":1639561489000,"propertyId":257380,"solveReason":"","status":"有效会话"},{"accountName":"邱甜","sessionStartTime":1639561222000,"complaintReason":"","finished":1,"patientTags":"[\"药房及药品信息查询\",\"领药信息修改\",\"领药信息查询\"]","satisfaction":"","skillGroupsId":36,"accountId":386,"realName":"李嘉娸","groupName":"金赛增","complaintStatus":10,"solveStatus":20,"createTime":1639561222000,"finishReason":"坐席主动关闭会话","drugName":"金赛增","id":1748058,"endTime":1639561611000,"propertyId":257378,"solveReason":"","status":"有效会话"},{"accountName":"邱甜","sessionStartTime":1639561149000,"complaintReason":"","finished":1,"patientTags":"[\"无效会话\"]","satisfaction":"","skillGroupsId":24,"accountId":386,"realName":"游客","groupName":"福可维","complaintStatus":10,"solveStatus":20,"createTime":1639561149000,"finishReason":"坐席主动关闭会话","drugName":"福可维","id":1748052,"endTime":1639561238000,"propertyId":257364,"solveReason":"","status":"有效会话"},{"accountName":"邱甜","sessionStartTime":1639561018000,"complaintReason":"","finished":1,"patientTags":"[\"无效会话\"]","satisfaction":"","skillGroupsId":36,"accountId":386,"realName":"游客","groupName":"金赛增","complaintStatus":10,"solveStatus":20,"createTime":1639561018000,"finishReason":"坐席主动关闭会话","drugName":"金赛增","id":1748042,"endTime":1639561106000,"propertyId":257354,"solveReason":"","status":"有效会话"}],"total":104,"size":10,"current":1,"searchCount":true,"pages":11}} */
                rData = res;
            },
            error: function(e) {
                console.log(e);
            }
        });
        return rData;
    }
}