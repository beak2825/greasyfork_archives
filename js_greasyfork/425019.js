// ==UserScript==
// @name         云图书馆统一书号普通编目套录MARC信息脚本
// @namespace    aaatk
// @version      1.0.21
// @description  实现统一书号部分书籍的MARC快捷编目（普通编目）
// @author       赵巍
// @match        https://b.ytsg.com/*
// @run-at       document-end
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/425019/%E4%BA%91%E5%9B%BE%E4%B9%A6%E9%A6%86%E7%BB%9F%E4%B8%80%E4%B9%A6%E5%8F%B7%E6%99%AE%E9%80%9A%E7%BC%96%E7%9B%AE%E5%A5%97%E5%BD%95MARC%E4%BF%A1%E6%81%AF%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/425019/%E4%BA%91%E5%9B%BE%E4%B9%A6%E9%A6%86%E7%BB%9F%E4%B8%80%E4%B9%A6%E5%8F%B7%E6%99%AE%E9%80%9A%E7%BC%96%E7%9B%AE%E5%A5%97%E5%BD%95MARC%E4%BF%A1%E6%81%AF%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
//************************************
//更新日志
//20210416 v1.0.2 增加功能：在非标准图书编目界面，点击解析marc时，把文献类型默认值“其他”改为“图书”
//20210418 v1.0.3 修改：第一第二责任人注释掉替换“著”、“编著”等信息
//20210525 v1.0.15 修改：修复bug ；增加功能：书号查重（需要跨域权限）；应对ytsg改版修复字段绑定
//20210622 v1.0.20 解决云图书馆20210621更新后无法读取marc出版年bug
//************************************
//isbn号
//function str_010a(marc) {
//    var p1 = "010    |a";
//    var p2 = "|d";
//    var a = marc.indexOf(p1);
//    var b = marc.indexOf(p2, a);
//    var t = p1.length;
//    var c = marc.substring(a+t,b);
//    var d = marc.slice(a+t,b);
//    return d;
//    // 该函数返回isbn号
//}
//010定价
//function str_010d(marc) {
//    var p1 = "010    |a";
//    var p2 = " 1";
//    var a = marc.indexOf(p1);
//    var b = marc.indexOf(p2, a);
//    var t = p1.length;
//    var c = marc.substring(a+t,b);
//    var d = marc.slice(a+t,b);
//    //子marc
//    var p3 = "|d";
//    //var p4 = "";
//    var a1 = d.indexOf(p3);
//    //var b1 = d.indexOf(p4, a1);
//    var t1 = p3.length;

//    var c1 = d.substring(a1+t1);
//    //var d1 = d.slice(a1+t1,b1);
//    c1 = c1.replace('CNY', '')
//    return c1;
//    // 该函数返回010定价
//}
function showdate(){//当前日期函数
    var mydate = new Date();
    var year = mydate.getFullYear();
    var month = mydate.getMonth()+1;
    var date = mydate.getDate();
    var str = year+add0(month)+add0(date);
    return str;
}
function add0(m){//日期的月日补0
    return m<10?'0'+m:m
}
function marc_010(marc) {
    var p1 = "010    ";
    var p2 = "\n"
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a);
    var t = p1.length;
    var c = marc.substring(a+t,b)+"|";
    c = c.replace('￥', 'CNY')//整理010价格数据
    if (a<0){//如果没有找到010则返还空值
        c="";
    } else {return c;}
    // 该函数返回010
}
function marc_091(marc) {
    var p1 = "091    ";
    var p2 = "\n"
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a);
    var t = p1.length;
    var c = marc.substring(a+t,b)+"|";
    c = c.replace('￥', 'CNY')//整理091价格数据
    if (a<0){//如果没有找到091则返还空值
        c="";
    } else {return c;}

    // 该函数返回091
}
function marc_200(marc) {
    var p1 = "200 1  ";
    var p2 = "\n"
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a);
    var t = p1.length;
    var c = marc.substring(a+t,b)+"|";
    return c;
    // 该函数返回200
}
function marc_205(marc) {
    var p1 = "205    ";
    var p2 = "\n"
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a);
    var t = p1.length;
    var c = marc.substring(a+t,b)+"|";
    if (a<0||b<0){//如果没有找到225则返还空值
        c="";
    } else {return c;}
    // 该函数返回205
}
function marc_210(marc) {
    var p1 = "210    ";
    var p2 = "\n"
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a);
    var t = p1.length;
    var c = marc.substring(a+t,b)+"|";
    return c;
    // 该函数返回210
}
function marc_215(marc) {
    var p1 = "215    ";
    var p2 = "\n"
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a);
    var t = p1.length;
    var c = marc.substring(a+t,b)+"|";
    return c;
    // 该函数返回210
}
function marc_225(marc) {//丛书
    var p1 = "225 2  ";
    var p2 = "\n"
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a);
    var t = p1.length;
    var c = marc.slice(a+t,b)+"|";
    if (a<0||b<0){//如果没有找到225则返还空值
        c="";
    } else {return c;}
    // 该函数返回225
}
function marc_690a(marc) {
    var p1 = "690    |a";
    var p2 = "|v"
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a);
    var t = p1.length;
    var c = marc.substring(a+t,b);
    return c;
    // 该函数返回690a
}
//集体作者
function marc_711_02a(marc) {
    var p1 = "711 02 |a";
    var p2 = "|9"
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a);
    var t = p1.length;
    var c = marc.substring(a+t,b);
    if (a<0||b<0){//如果没有找到711_02a则返还空值
        c="";
    } else {return c;}
    // 该函数返回71102a
}

/////////////////////////////////////////////

//*题名
function str_200_1a(marc) {
    var p1 = "|a";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    return c;
    // 该函数返回题名
}
//*副题名
function str_200_1e(marc) {
    var p1 = "|e";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到200_1e则返还空值
        d="";
    } else {return d;}
    // 该函数返回副题名
}
//*并列题名
function str_200_1d(marc) {
    var p1 = "|d";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到200_1d则返还空值
        d="";
    } else {return d;}
    // 该函数返回并列题名
}
//*第二题名
function str_200_1c(marc) {
    var p1 = "|c";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到200_1d则返还空值
        d="";
    } else {return d;}
    // 该函数返回并列题名
}
//*丛编题名
function str_225_2a(marc) {
    if (marc==null){
        return "";
    }
    var p1 = "|a";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到225_2a则返还空值
        d="";
    } else {return d;}
    // 该函数返回丛编题名
}
//*丛编作者
function str_225_2f(marc) {
    if (marc==null){
        return "";
    }
    var p1 = "|f";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到225_2f则返还空值
        d="";
    } else {return d;}
    // 该函数返回丛编作者
}
//*第一责任者
function str_200_1f(marc) {
    var p1 = "|f";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    //d = d.replace('主编', '');
    //d = d.replace('编选', '');
    //d = d.replace('编', '');
    //d = d.replace('著', '');
    //d = d.replace('译', '');
    return d;
    // 该函数返回第一责任者
}
//*第二责任者
function str_200_1g(marc) {
    if (marc==null){
        return "";
    }
    var p1 = "|g";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    //d = d.replace('主编', '');
    //d = d.replace('编选', '');
    //d = d.replace('编', '');
    //d = d.replace('著', '');
    //d = d.replace('译', '');
    if (a<0||b<0){//如果没有找到200_1g则返还空值
        d="";
    } else {return d;}
    // 该函数返回第二责任者
}
//*分辑号
function str_200_1h(marc) {
    if (marc==null){
        return "";
    }
    var p1 = "|h";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到200_1h则返还空值
        d="";
    } else {return d;}
    // 该函数返回分辑号
}
//*分辑名
function str_200_1i(marc) {
    if (marc==null){
        return "";
    }
    var p1 = "|i";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到200_1i则返还空值
        d="";
    } else {return d;}
    // 该函数返回分辑名
}
//*出版社
function str_210c(marc) {
    var p1 = "|c";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到210c则返还空值
        d="";
    } else {return d;}
    // 该函数返回出版社
}
//*出版地
function str_210a(marc) {
    var p1 = "|a";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到210a则返还空值
        d="";
    } else {return d;}
    // 该函数返回出版地
}
//*出版年
function str_210d(marc) {
    var p1 = "|d";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到210d则返还空值
        d="";
    } else {return d;}
    // 该函数返回出版年
}
//*版次
function str_205a(marc) {
    if (marc==null){
        return "";
    }
    var p1 = "|a";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到210d则返还空值
        d="";
    } else {return d;}
    // 该函数返回版次
}
//*开本尺寸
function str_215d(marc) {
    var p1 = "|d";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到215d则返还空值
        d="";
    } else {return d;}
    // 该函数返回开本尺寸
}
//*页数
function str_215a(marc) {
    var p1 = "|a";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    if (a<0||b<0){//如果没有找到215d则返还空值
        d="";
    } else {return d;}
    // 该函数返回开本尺寸
}
//*091定价
function str_091d(marc) {
    if (marc==null){
        return "";
    }
    var p1 = "|d";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    d = d.replace('CNY', '')
    if (a<0||b<0){//如果没有找到091d则返还空值
        d="";
    } else {return d;}
    // 该函数返回091定价
}
//*091书号
function str_091a(marc) {
    if (marc==null){
        return "";
    }
    var p1 = "|a";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    d = d.replace('·', '.')
    if (a<0||b<0){//如果没有找到091a则返还空值
        d="";
    } else {return d;}
    // 该函数返回091书号
}
//*010定价
function str_010d(marc) {
    if (marc==null){
        return "";
    }
    var p1 = "|d";
    var t1 = p1.length;
    var p2 = "|";
    var t2 = p2.length;
    var a = marc.indexOf(p1);
    var b = marc.indexOf(p2, a+t1);
    var c = marc.substring(a+t1,b);
    var d = marc.slice(a+t1,b);
    d = d.replace('CNY', '')
    if (a<0||b<0){//如果没有找到010d则返还空值
        d="";
    } else {return d;}
    // 该函数返回010定价
}



(function() {
    'use strict';
    //
    //
    window.addEventListener('load',function(){
        //$(".footer").hide();//隐藏页脚div，厂家广告
        var jqueryScriptBlock = document.createElement('style');
        jqueryScriptBlock.type = 'text/css';
        jqueryScriptBlock.innerHTML = "#zixiao{position:fixed;top:37%;left:20px;border:1px solid gray;padding:3px;width:60px;font-size:12px;cursor:pointer;border-radius: 3px;}#chachong{position:fixed;top:29%;left:20px;border:1px solid gray;padding:3px;width:120px;font-size:12px;cursor:pointer;border-radius: 3px;}#readmarc{position:fixed;top:21%;left:20px;border:1px solid gray;padding:3px;width:120px;font-size:12px;cursor:pointer;border-radius: 3px;}#marc{position:fixed;top:14%;resize:none;left:20px;border:1px solid gray;padding:3px;width:120px;height:40px;font-size:14px;cursor:pointer;border-radius: 3px;}";
        document.getElementsByTagName('head')[0].appendChild(jqueryScriptBlock);
        console.log('我的脚本加载了');
        //<input id='marc' type='text' autocomplete='off' spellcheck='false' class='ime'>
        $(document.body).append("<textarea id='marc' rows='3' cols='20'></textarea>");
        $(document.body).append("<input id='readmarc' type='button' value='解析MARC' class='btn'>");
        $(document.body).append("<input id='chachong' type='button' value='书号查重' class='btn'>");
        $(document.body).append("<input id='zixiao' type='button' value='列表字小' class='btn'>");
        $('#zixiao').click(function () {
            //$("#page > div.footer > div > div.slide > li >div").remove();
            ////列表字体改小
            $("tr > td").css("font-size","14px");
            $("#page > div.contentWrapper > div.shit > div > div > div.v-contentBody > div.v-tableWrapper > div.v-tableHeader > table > tbody > tr > td.w-name-five").css("width","380px");//isbn
            $("#page > div.contentWrapper > div.shit > div > div > div.v-contentBody > div.v-tableWrapper > div.v-tableContent > table > thead > tr > th.w-name-five").css("width","380px");//isbn
            $("#page > div.contentWrapper > div.shit > div").css("width","80%");
            //$("#page > div.contentWrapper > div.shit > div > div > div.v-contentBody > div.v-tableWrapper > div.v-tableContent > table > thead > tr > th").css("white-space","nowrap");//isbn
            //$("#page > div.contentWrapper > div.shit > div > div > div.v-contentBody > div.v-tableWrapper > div.v-tableHeader > table > tbody > tr > td").css("white-space","nowrap");//isbn
        });
        $('#chachong').click(function () {
            //$("#page > div.footer > div > div.slide > li >div").remove();
            GM_setClipboard($(".ISBN input:first").val(), 'text');
            //$(".copyNo input:first").focus();//焦点切换到副本文本框上
            $("#page > div.footer > div").empty();
            //$("#page > div.footer > div > div.slide").load("https://www.ytsg.com/bookinfo/libraryresource?libCode=&isbn=1001%C2%B7267&hallCode=AAAKT");
            GM_xmlhttpRequest({
                method: "GET",
                //根据isbn号和图书馆号查询
                url: "https://www.ytsg.com/userApp/libraryBook/bookStayLibraryAllInfo?isLibCode=1&pageNo=1&pageCount=10&isbn=" + $(".ISBN input:first").val() + "&libCode=" + $("#page > div.contentWrapper > div.titleWrap > ul > li.titleInfo > div > span:nth-child(1)").text() +"",
                onload: function(res) {
                    if (res.status == 200) {
                        var text = res.responseText;
                        var sln = text.length;//不存在为187
                        if(sln<200){$(".ISBN input:first").focus();}else{$(".copyNo input:first").focus();};
                        var json = JSON.parse(text);
                        //alert(json.data.resultList[0].frameCode);
                        //alert(text);
                        console.log($(".ISBN input:first").val() + " "+ $("#page > div.contentWrapper > div.titleWrap > ul > li.titleInfo > div > span:nth-child(1)").text());
                        $("#page > div.footer > div ").html("");
                        $.each(json.data.resultList, function(index, item) {
                            $("#page > div.footer > div ").append(
                                "【" +index+":"+ item.barNumber +" "+ item.callNumber +" <b>"+ item.frameCode +"</b>】 ");
                        });
                    }
                }

            });
        });
        var marc
        $('#readmarc').click(function () {
            var mode=$(".ISBN dt:first").text();
            if (mode=="*书号" || $(".titleName").text()=="普通编目" || $(".titleName").text()=="典藏维护/普通") {//仅在非标准图书的普通编目开启&& ||非标准图书和中文图书的普通编目模式可用
                //触发文献类型，改为图书
                // $("#page > div.contentWrapper > div.shit > div > div > div > dl.classify > dd > div > div > div.keyWord").text("图书");$("#page > div.contentWrapper > div.shit > div > div > div > dl.classify > dd > div > div > div.keyWord")[0].dispatchEvent(new Event('change'));
                // $("#page > div.contentWrapper > div.shit > div > div > div > dl.classify > dd > div > div").attr("title","图书");$("#page > div.contentWrapper > div.shit > div > div > div > dl.classify > dd > div > div")[0].dispatchEvent(new Event('change'));
                //
                marc=document.getElementById("marc").value;
                //写入编目文本框
                //写入处理后的书号;触发v-mode更新
                //$(".ISBN input:first").val(str_091a(marc_091(marc)));$(".ISBN input:first")[0].dispatchEvent(new Event('input'));
                //替换isbn书号里面的点，书号不从marc中提取
                $(".ISBN input:first").val(function(i, v) { //index, current value
                    return v.replace(".","·");
                });$(".ISBN input:first")[0].dispatchEvent(new Event('input'));
                //制作日期;触发v-mode更新
                $(".date input:first").val(showdate());$(".date input:first")[0].dispatchEvent(new Event('input'));
                //题名;触发v-mode更新
                $(".zhengtiming input:first").val(str_200_1a(marc_200(marc)));$(".zhengtiming input:first")[0].dispatchEvent(new Event('input'));
                //副题名;触发v-mode更新
                $("#page > div.contentWrapper > div.shit > div > div > div > dl:nth-child(6) input:first").val(str_200_1e(marc_200(marc)));$("#page > div.contentWrapper > div.shit > div > div > div > dl:nth-child(6) input:first")[0].dispatchEvent(new Event('input'));
                //并列题名;触发v-mode更新
                $("#page > div.contentWrapper > div.shit > div > div > div > dl:nth-child(7) input:first").val(str_200_1d(marc_200(marc)));$("#page > div.contentWrapper > div.shit > div > div > div > dl:nth-child(7) input:first")[0].dispatchEvent(new Event('input'));
                //第二题名;触发v-mode更新
                $("#page > div.contentWrapper > div.shit > div > div > div > dl:nth-child(7) input:first").val(str_200_1c(marc_200(marc)));$("#page > div.contentWrapper > div.shit > div > div > div > dl:nth-child(7) input:first")[0].dispatchEvent(new Event('input'));
                //丛编题名;触发v-mode更新
                $(".conbiantiming input:first").val(str_225_2a(marc_225(marc)));$(".conbiantiming input:first")[0].dispatchEvent(new Event('input'));
                //第一责任者;触发v-mode更新
                $(".firstDuty input:first").val(str_200_1f(marc_200(marc)));$(".firstDuty input:first")[0].dispatchEvent(new Event('input'));
                //第二责任者;触发v-mode更新
                $(".secondDuty input:first").val(str_200_1g(marc_200(marc)));$(".secondDuty input:first")[0].dispatchEvent(new Event('input'));
                //集体作者;触发v-mode更新
                $(".allAuthor input:first").val(marc_711_02a(marc));$(".allAuthor input:first")[0].dispatchEvent(new Event('input'));
                //丛编作者;触发v-mode更新
                $(".author input:first").val(str_225_2f(marc_225(marc)));$(".author input:first")[0].dispatchEvent(new Event('input'));
                //分辑号;触发v-mode更新
                $(".sectionNo input:first").val(str_200_1h(marc_200(marc)));$(".sectionNo input:first")[0].dispatchEvent(new Event('input'));
                //分辑名;触发v-mode更新
                $(".sectionTitle input:first").val(str_200_1i(marc_200(marc)));$(".sectionTitle input:first")[0].dispatchEvent(new Event('input'));
                //出版社;触发v-mode更新
                $(".public input:first").val(str_210c(marc_210(marc)));$(".public input:first")[0].dispatchEvent(new Event('input'));
                //出版地;触发v-mode更新
                $(".publicArea input:first").val(str_210a(marc_210(marc)));$(".publicArea input:first")[0].dispatchEvent(new Event('input'));
                //出版年;触发v-mode更新
                //$(".year input:first").val(str_210d(marc_210(marc)));$(".year input:first")[0].dispatchEvent(new Event('input'));
                //解决20210621更新后无法读取marc出版年bug
                $(".anatsugi input:first").val(str_210d(marc_210(marc)));$(".anatsugi input:first")[0].dispatchEvent(new Event('input'));
                //版次;触发v-mode更新
                $(".publicNo input:first").val(str_205a(marc_205(marc)));$(".publicNo input:first")[0].dispatchEvent(new Event('input'));
                //开本尺寸;触发v-mode更新
                $(".size input:first").val(str_215d(marc_215(marc)));$(".size input:first")[0].dispatchEvent(new Event('input'));
                //页数;触发v-mode更新
                $(".pageSize input:first").val(str_215a(marc_215(marc)));$(".pageSize input:first")[0].dispatchEvent(new Event('input'));
                //分类号;触发v-mode更新
                $(".classifyNo input:first").val(marc_690a(marc));$(".classifyNo input:first")[0].dispatchEvent(new Event('input'));
                //排架号;触发v-mode更新
                $(".shelf input:first").val("");$(".shelf input:first")[0].dispatchEvent(new Event('input'));
                //书次号;触发v-mode更新
                $(".anatsugi:last input:first").val("");$(".anatsugi:last input:first")[0].dispatchEvent(new Event('input'));
                //定价;触发v-mode更新
                var s_price//定义定价，091和010都有可能有定价
                if (str_010d(marc_010(marc))==""){
                    s_price = str_091d(marc_091(marc));
                }else{
                    s_price = str_010d(marc_010(marc));
                }
                $(".price input:first").val(s_price);$(".price input:first")[0].dispatchEvent(new Event('input'));

                //清空marc文本框
                document.getElementById("marc").value="";
                $(".copyNo input:first").focus();//焦点切换到副本文本框上
                GM_setClipboard($(".ISBN input:first").val(), 'text');//解析结束后把isbn写入剪贴板
                //如果文献类型是“其他”会提示
                var wxlx=$("#page > div.contentWrapper > div.shit > div > div > div > dl.classify > dd > div > div > div.keyWord").text();
                if (wxlx=="其他"){
                    alert("请把【文献类型】改成【图书】");
                }
                //结束
            }else{//不是普通编目的非标准图书页面执行以下内容
                //
                //
                document.getElementById("marc").value="";
                alert("当前页面不是“普通编目-非标准图书”");
            };
            //解析marc按钮执行结束
        });
        //
        //

    })
    //documnet.addEventListener('DOMContentLoaded',function(){
    //});

    //执行时调试信息
    //console.log($(".titleName").text())
})();


