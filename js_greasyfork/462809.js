// ==UserScript==
// @name         OA
// @namespace    http://tampermonkey.net/
// @version      0.15
// @license      MIT
// @description  OA辅助工具
// @author       LIUYONG
// @match        http://*/OADocument/document/incoming/*
// @match        http://*/OADocument/document/indoc/*
// @match        http://*/newWorkSheet/businesscontact/*
// @match        http://*/unionmessageweb/view/gotoMorePage/todoTypeOrder*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462809/OA.user.js
// @updateURL https://update.greasyfork.org/scripts/462809/OA.meta.js
// ==/UserScript==
var $ = window.jQuery;

var get = {
    byId: function(id) {
        return document.getElementById(id)
    },
    byClass: function(sClass, oParent) {
        if(oParent.getElementsByClass){
            return (oParent || document).getElementsByClass(sClass)
        }else{
            var aClass = [];
            var reClass = new RegExp("(^| )" + sClass + "( |$)");
            var aElem = this.byTagName("*", oParent);
            for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
            return aClass
        }
    },
    byTagName: function(elem, obj) {
        return (obj || document).getElementsByTagName(elem)
    }
};

(function() {
    'use strict';
    //判断文件类型
    var htm = window.location.href;
    var aSubNav;

    if(htm.indexOf("http://oaenter.js.cmcc/OADocument/document/incoming/")>=0)//公司来文
    {
        //添加一个按钮
        if(get.byId("companyForm")!=null)
        {
            aSubNav = get.byClass("toContent", companyForm);
            if(aSubNav.length==1){
                $(aSubNav).append('<a href="javascript:void(0);  onclick=incoming();">保存相关意见</a>     <a href="javascript:void(0);  onclick=light();">点亮关键词</a>');
            }
        }
        if(get.byId("draftForm")!=null)
        {
            //--公司实物收文
            aSubNav = get.byClass("toContent", draftForm);
            if(aSubNav.length==1){
                $(aSubNav).append('<a href="javascript:void(0);  onclick=entity(draftForm);">保存人员意见</a>');
            }
        }

    }
    if(htm.indexOf("http://oaenter.js.cmcc/OADocument/document/indoc/")>=0)//部门来文
    {
        //添加一个按钮
        if(get.byId("departmentForm")!=null)
        {
            if(document.body.textContent.includes("业 务 类 工 单"))
            {
                //--业务类办理单
                aSubNav = get.byClass("toContent", departmentForm);
                if(aSubNav.length==1){
                    $(aSubNav).append('<a href="javascript:void(0);  onclick=entity(departmentForm);">保存人员意见</a>');
                }
            }
            else
            {
                //--部门收文
                aSubNav = get.byClass("toContent", departmentForm);
                if(aSubNav.length==1){
                    $(aSubNav).append('<a href="javascript:void(0);  onclick=indoc();">保存部门人员意见</a>');
                }
            }
        }
        if(get.byId("draftForm")!=null)
        {
            //--实物收文
            aSubNav = get.byClass("toContent", draftForm);
            if(aSubNav.length==1){
                $(aSubNav).append('<a href="javascript:void(0);  onclick=entity(draftForm);">保存人员意见</a>');
            }
        }
    }
    if(htm.indexOf("http://oaenter.js.cmcc/newWorkSheet/businesscontact/")>=0)//业务联系单
    {
        aSubNav = get.byClass("js-content", businessContact);
        aSubNav = $(aSubNav).find('div').eq(1);
        if(aSubNav.length==1){
            $(aSubNav).append('<div> <a href="javascript:void(0);  onclick=businesscontact();">保存部门人员意见</a></div>');
        }
    }
    if(htm.indexOf("http://oaenter.js.cmcc/unionmessageweb/view/gotoMorePage/")>=0)//所有代办文件
    {
        aSubNav = document.querySelector('.locationTips');
        //aSubNav = $(aSubNav).find('div').eq(1);
        //if(aSubNav.length==1){
            $(aSubNav).append('<div> <a href="javascript:void(0);  onclick=openall();">批量打开文件</a></div>');
        //}
    }

    // Your code here...
})();

//----------------------------------------公司收文部分
window.incoming = function (){
    console.log();
    //查找文件标题和文号
    var tb = get.byClass("table table-bordered js-table", companyForm);
    var file_name = $(tb).find('tr').eq(0).find('td').eq(1).text().trim();
    var file_no = $(tb).find('tr').eq(1).find('td').eq(1).text().trim();
    var file_date = $(tb).find('tr').eq(1).find('td').eq(3).text().trim();

    //-----------分析意见栏信息
    var div = get.byClass("ms-opinion center-block js-tableArea", companyForm);
    var tab = $(div).find('table').eq(0);
    var result = "";//返回结果
    for (var i=0;i<$(tab).find('tr').length;i++)
    {
        //-------意见信息
        var td_bm = $(tab).find('tr').eq(i).find('td').eq(1);
        var div_bm = $(td_bm).children().eq(0).children().eq(1);

        //--遍历领导意见
        var bm_ryrq;//人员日期，需要分离
        var bm_yj;//意见
        var bm_ry;//人员姓名
        var bm_rq;//批文日期
        $(td_bm).children().each(function(i){// 遍历 div
            if ($(this).children().length>0){
                bm_yj = $(this).children().eq(0).text();
                bm_ryrq = $(this).children().eq(1).text();
                //将人员姓名和批文日期分开
                var arr=bm_ryrq.split('）');
                bm_ry = arr[0];
                bm_rq = arr[arr.length-1].trim();
                var arr1=bm_ry.split('（');
                bm_ry = arr1[0].trim();
                if (/^(罗一民|周坤|刘勇|周宁阳|张琥|苏丙康|程凯)$/.test(bm_ry) && bm_yj.length>4){
                    result = result + bm_ry + ",";
                    //写入web api中
                    var contact = new Object();
                    contact.UserName = "公司来文";
                    contact.FileNo = file_no;
                    contact.FileDate = file_date;
                    contact.FileName = file_name;
                    contact.ReviewName = bm_ry;
                    contact.ReviewDate = bm_rq
                    contact.ReviewContent = bm_yj;
                    $.ajax({
                        url         : "http://36.137.221.221:8089/api/hello/5",
                        type        : "PUT",
                        data        : contact,
                        dataType    : "json",
                        //contentType : "application/json",
                        success     :function(json){
                            //alert("添加成功");
                        },
                        error: function (err) {
                            //alert("错误");
                        }
                    });
                }
            }
        });
    }
    alert("成功保存  "+result+"  的有效意见");
}

//-----------------------------点亮淮安
window.light = function (){
    console.log();
    //查找正文
    var div = get.byId("docContent");
    $(div).html($(div).html().replace(/淮安/g,'<font style="font-size:30px;color:red;background:yellow">淮安</font>'));
    $(div).html($(div).html().replace(/淮/g,'<font style="font-size:30px;color:red;background:yellow">淮</font>'));
    $(div).html($(div).html().replace(/上报/g,'<font style="font-size:30px;color:red;background:yellow">上报</font>'));
    $(div).html($(div).html().replace(/反馈/g,'<font style="font-size:30px;color:red;background:yellow">反馈</font>'));
}

//----------------------------------------部门收文部分
window.indoc = function (){
    console.log();
    //查找文件标题和文号
    var tb = get.byClass("table table-bordered js-table", departmentForm);
    var file_name = $(tb).find('tr').eq(0).find('td').eq(1).text().trim();
    var file_no = $(tb).find('tr').eq(1).find('td').eq(1).text().trim();
    var file_date = $(tb).find('tr').eq(1).find('td').eq(3).text().trim();

    //-----------分析意见栏信息
    var div = get.byClass("ms-opinion center-block js-tableArea", departmentForm);
    var tab = $(div).find('table').eq(0);

    var result="";//返回结果
    for (var i=0;i<$(tab).find('tr').length;i++)
    {
        //-------部门意见信息
        var td_bm = $(tab).find('tr').eq(i).find('td').eq(1);
        var div_bm = $(td_bm).children().eq(0).children().eq(1);

        //--遍历部门领导意见
        var bm_ryrq;//人员日期，需要分离
        var bm_yj;//意见
        var bm_ry;//人员姓名
        var bm_rq;//批文日期
        $(td_bm).children().each(function(i){// 遍历 div
            if ($(this).children().length>0){
                bm_yj = $(this).children().eq(0).text();
                bm_ryrq = $(this).children().eq(1).text();
                //alert("人员："+bm_ry+"，意见："+bm_yj);
                if (bm_ryrq.indexOf("集团客户部")>=0 && bm_yj.length>4){
                    //将人员姓名和批文日期分开
                    var arr=bm_ryrq.split('）');
                    bm_ry = arr[0];
                    bm_rq = arr[arr.length-1].trim();
                    var arr1=bm_ry.split('（');
                    bm_ry = arr1[0].trim();
                    result = result + bm_ry + ",";
                    //写入web api中
                    var contact = new Object();
                    contact.UserName = "部门来文";
                    contact.FileNo = file_no;
                    contact.FileDate = file_date;
                    contact.FileName = file_name;
                    contact.ReviewName = bm_ry;
                    contact.ReviewDate = bm_rq
                    contact.ReviewContent = bm_yj;
                    $.ajax({
                        url         : "http://36.137.221.221:8089/api/hello/5",
                        type        : "PUT",
                        data        : contact,
                        dataType    : "json",
                        //contentType : "application/json",
                        success     :function(json){
                            //alert("添加成功");
                        },
                        error: function (err) {
                            //alert("错误");
                        }
                    });
                }
            }
        });
    }
    alert("成功保存  "+result+"  的有效意见");
}

//-----------------------------业务联系单
window.businesscontact = function (){
    console.log();
    //查找工单标题,发单部门,发文日期
    var tb = get.byClass("table table-bordered", businessContact);
    var file_name = $(tb).find('tr').eq(2).find('td').eq(1).text().trim();
    var file_no = $(tb).find('tr').eq(0).find('td').eq(1).text().trim();
    var file_date = $(tb).find('tr').eq(0).find('td').eq(3).text().trim();

    //-----------分析意见栏信息
    var div = get.byClass("ms-opinion center-block js-tableArea", businessContact);
    var tab = $(div).find('table').eq(0);

    //-----意见信息
    var result="";//返回结果
    for (var i=0;i<$(tab).find('tr').length;i++)
    {
        //-------部门意见信息
        var td_bm = $(tab).find('tr').eq(i).find('td').eq(1);
        var div_bm = $(td_bm).children().eq(0).children().eq(1);

        //--遍历部门领导意见
        var bm_ryrq;//人员日期，需要分离
        var bm_yj;//意见
        var bm_ry;//人员姓名
        var bm_rq;//批文日期
        $(td_bm).children().each(function(i){// 遍历 div
            if ($(this).children().length>0){
                bm_yj = $(this).children().eq(0).text();
                bm_ryrq = $(this).children().eq(1).text();
                //alert("人员："+bm_ry+"，意见："+bm_yj);
                if (bm_ryrq.indexOf("集团客户部")>=0 && bm_yj.length>4){
                    //将人员姓名和批文日期分开
                    var arr=bm_ryrq.split('）');
                    bm_ry = arr[0];
                    bm_rq = arr[arr.length-1].trim();
                    var arr1=bm_ry.split('（');
                    bm_ry = arr1[0].trim();
                    result = result + bm_ry + ",";
                    //写入web api中
                    var contact = new Object();
                    contact.UserName = "业务联系单";
                    contact.FileNo = file_no;
                    contact.FileDate = file_date;
                    contact.FileName = file_name;
                    contact.ReviewName = bm_ry;
                    contact.ReviewDate = bm_rq
                    contact.ReviewContent = bm_yj;
                    $.ajax({
                        url         : "http://36.137.221.221:8089/api/hello/5",
                        type        : "PUT",
                        data        : contact,
                        dataType    : "json",
                        //contentType : "application/json",
                        success     :function(json){
                            //alert("添加成功");
                        },
                        error: function (err) {
                            //alert("错误");
                        }
                    });
                }
            }
        });
    }
    alert("成功保存  "+result+"  的有效意见");
}

//-----------------------------实物收文
window.entity = function (bz){
    console.log();
    //查找文件标题和文号
    var tb = get.byClass("table table-bordered js-table", bz);
    var file_name = $(tb).find('tr').eq(0).find('td').eq(1).text().trim();
    var file_no = $(tb).find('tr').eq(1).find('td').eq(1).text().trim();
    var file_date = $(tb).find('tr').eq(1).find('td').eq(3).text().trim();

    //-----------分析意见栏信息
    var div = get.byClass("ms-opinion center-block js-tableArea", bz);
    var tab = $(div).find('table').eq(0);

    var result="";//返回结果
    for (var i=0;i<$(tab).find('tr').length;i++)
    {
        //-------意见信息
        var td_bm = $(tab).find('tr').eq(i).find('td').eq(1);
        var div_bm = $(td_bm).children().eq(0).children().eq(1);

        //--遍历领导意见
        var bm_ryrq;//人员日期，需要分离
        var bm_yj;//意见
        var bm_ry;//人员姓名
        var bm_rq;//批文日期
        $(td_bm).children().each(function(i){// 遍历 div
            if ($(this).children().length>0){
                bm_yj = $(this).children().eq(0).text();
                bm_ryrq = $(this).children().eq(1).text();
                //将人员姓名和批文日期分开
                var arr=bm_ryrq.split('）');
                bm_ry = arr[0];
                bm_rq = arr[arr.length-1].trim();
                var arr1=bm_ry.split('（');
                bm_ry = arr1[0].trim();
                if (/^(罗一民|周坤|刘勇|周宁阳|张琥|苏丙康|程凯)$/.test(bm_ry) && bm_yj.length>4){
                    result = result + bm_ry + ",";
                    //写入web api中
                    var contact = new Object();
                    contact.UserName = "实物收文";
                    contact.FileNo = file_no;
                    contact.FileDate = file_date;
                    contact.FileName = file_name;
                    contact.ReviewName = bm_ry;
                    contact.ReviewDate = bm_rq
                    contact.ReviewContent = bm_yj;
                    $.ajax({
                        url         : "http://36.137.221.221:8089/api/hello/5",
                        type        : "PUT",
                        data        : contact,
                        dataType    : "json",
                        //contentType : "application/json",
                        success     :function(json){
                            //alert("添加成功");
                        },
                        error: function (err) {
                            //alert("错误");
                        }
                    });
                }
            }
        });
    }
    alert("成功保存  "+result+"  的有效意见");
}

//-----------------------------发送短信
window.send_sms = function (){
    console.log();
    alert("eeee");
    var trackPrevUrl = "http://oaenter.js.cmcc/mocha.component.sendaction.v5/";
    //调用短信发送方法
    $.ajax({
        type: "get",
        dataType: "json",
        url: trackPrevUrl + "sendaction/sms_alerts_uid",
        data: { uid: "liuyongha", sendInfo: "你好啊！" },
        success: function (r) {
            if (r.result) {
                alert("短信发送成功");
            } else {
                alert("短信发送失败？？？");
            }
        }
    });
}

//-----------------------------批量打开文件
window.openall = function (){
    // 获取表格
    const table = document.getElementById("todoMoreList1");
    // 获取表格中的<tbody>元素
    const tbody = table.getElementsByTagName("tbody")[0];
    // 获取所有的<tr>元素
    const rows = tbody.getElementsByTagName("tr");
    // 循环遍历每个<tr>元素
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        // 获取当前行中的第五个<td>元素
        const cell = row.getElementsByTagName("td")[4];
        // 获取<td>元素中的链接
        const link = cell.getElementsByTagName("a")[0].href;
        // 在新的浏览器标签页中打开链接
        window.open(link, "_blank");
}

}