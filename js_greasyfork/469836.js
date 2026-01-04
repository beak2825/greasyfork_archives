// ==UserScript==
// @name         联合奖惩查询
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  联合奖惩
// @author       大魔王
// @match        http://172.16.96.9/acdeal/default/windowAccept/insertPage/creditinfo.jsp?*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @require      https://www.layuicdn.com/layui/layui.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469836/%E8%81%94%E5%90%88%E5%A5%96%E6%83%A9%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/469836/%E8%81%94%E5%90%88%E5%A5%96%E6%83%A9%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){

        var max = 10000000;
        var delay = 300;
        var count = 1;
        test();
        function test(){
            if(count <= max){
                setTimeout(function(){
                    myLhjc();
                    myXyhc();
                    var str = "执行次数:" + count;
                    $("#ztmc").val(str);
                    console.log("运行次数：",count);
                    count++;
                    test();
                },delay);

            }
        }

        function myLhjc(){
            var json = {};
            json["ztlb"] = '2'
            json["ztmc"] = '苏楠';
            json["ztdm"] = '371312199610306988';
            json["matterCode"] = $("#matterCode").val();
            json["matterName"] = $("#matterName").val();
            json["powerMaterCode"] = "00169D6F6A2349689920E0C50C9A7BB0";
            json["sappid"] = "4f9cab73-6115-4b64-8512-c03af2cd16a2";
            json["mappid"] = "f5943022-ca2e-4724-8ae8-b43287d6fa28";
            console.log(json);
            var webRoot = 'http://172.16.96.9/'
            $.ajax({
                type: "POST",
                url: webRoot+ "/operations/infCallCount/add.do",
                data : {
                    nmLhjcSearch : 1,
                    nmXxhcSearch : 0,
                    nmLhjcfkSearch : 0
                },
                success : function(data) {
                    //console.log(data);


                },
                error : function() {
                    console.log("网络繁忙，请稍后重试！");
                }
            });
            $.ajax({
                type: "POST",
                dataType: "json",
                url: webRoot+ "/outerapi/CreditCheck/getLhjcInfo.do?",
                data : json,
                success : function(data) {
                    console.log(data);
                    if(data.errflag==0){
                        // $("#version").val(data.queryCode);
                        //  var html=getLhjcData(data.head,data.data);
                        //  $("#lhxydiv").html(html);
                    }else{
                        //console.log(data.errtext);
                    }
                },
                error : function() {
                    console.log("网络繁忙，请稍后重试！");
                }
            });
        }
        function myXyhc(){
           var json = {};
            json["orgName"] = '苏楠';
            json["creditCode"] = '371312199610306988';
            json["sappid"] = "4f9cab73-6115-4b64-8512-c03af2cd16a2";
            json["mappid"] = "8f6ee0a9-56c6-45a9-a8ff-696ae8b4ad50";
            console.log(json);
            $.ajax({
                type: "POST",
                dataType: "json",
                url:webRoot+ "/outerapi/CreditCheck/getXyhcInfo.do?",
                data : json,
                success : function(data) {

                    console.log(data);
                    if(data.errflag==0){
                        var url=data.data;
                        url=url.replace("/domain/","/59.206.216.10/");
                        //"http://domain/icp_es/jsp/credit/open/companyDocument.jsp?id=or_type%237950735FCBBD401E9725BA20F27EB84B"
                        $("#myTabContent").attr("src",url);
                    }else{
                        console.log(data.errtext);
                    }
                },
                error : function() {
                    console.log("网络繁忙，请稍后重试！");
                }
            });
            $.ajax({
                type: "POST",
                url: webRoot+ "/operations/infCallCount/add.do",
                data : {
                    nmLhjcSearch : 0,
                    nmXxhcSearch : 1,
                    nmLhjcfkSearch : 0
                },
                success : function(data) {
                    //console.log(data);
                },
                error : function() {
                    console.log("网络繁忙，请稍后重试！");
                }
            });


        }

    }

})();