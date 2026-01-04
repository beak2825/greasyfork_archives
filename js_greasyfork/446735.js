// ==UserScript==
// @name         银行作业提交(调查网)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动获取题库，自动选择，人工提交
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @author       吴大师(wxj)
// @match        https://ks.wjx.top/vm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wjx.top
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446735/%E9%93%B6%E8%A1%8C%E4%BD%9C%E4%B8%9A%E6%8F%90%E4%BA%A4%28%E8%B0%83%E6%9F%A5%E7%BD%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446735/%E9%93%B6%E8%A1%8C%E4%BD%9C%E4%B8%9A%E6%8F%90%E4%BA%A4%28%E8%B0%83%E6%9F%A5%E7%BD%91%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tflag=0;
    var tstr=0;
    var jdata=new Array();
    $(document).ready(function() {
        console.log("载入完毕");
        $.ajax({
            url: "https://raw.githubusercontents.com/wxjwolf/wxjwolf/main/fanjiatiku1.json",
            dataType: "json",
            success: function (odata) {
                // console.log(odata);
                for (var t = 0; t < odata.data.length ; t++) {
                    jdata[t]=odata.data[t];
                    //                             jdata[t]=odata.data[t];
                }
                var tishu=$(".field.ui-field-contain").length-1;
                // console.log(jdata.length);
                var tstring;
                if (jdata.length > 0 && tishu > 2){
                    var reg=/\s+/g;
                    // tstring=tstring.replace(reg,"");
                    // console.log(jdata.length);
                    for (var i = 0; i <= tishu; i++) {
                        // console.log($(".field.ui-field-contain:eq(" + i + ")").children(".field-label").text());
                        if ($(".field.ui-field-contain:eq(" + i + ")").children(".ui-controlgroup.column1").length>0){
                            tstring=$(".field.ui-field-contain:eq(" + i + ")").children(".field-label").text().replace(reg,"");
                            tstring=tstring.replace("【单选题】","");
                            tstring=tstring.replace("【多选题】","");
                            tstring=tstring.replace("【判断题】","");
                            tstring=tstring.replace("(单选题)","");
                            tstring=tstring.replace("(多选题)","");
                            tstring=tstring.replace("(判断题)","");
                            if (tstring.substr(tstring.length-1,tstring.length)=="*"){
                                tstring=tstring.substr(0,tstring.length -1)
                            }
                            tflag=tstring.indexOf(".")+1;
                            tstring=tstring.substr(tflag,tstring.length-tflag);
                            // console.log("卷面题目：" + tstring);
                            for (var i5 = 0;i5<jdata.length;i5++){
                                var qstr=jdata[i5].question;
                                qstr=qstr.replace(reg,"");
                                if ($.trim(qstr) == $.trim(tstring)) {
                                    // console.log("题库题目：" + qstr);
                                    tstr++;
                                    var daan=jdata[i5].answer;
                                    // console.log("答案：" + daan);
                                    $(".field.ui-field-contain:eq(" + i + ")").children(".field-label").append("<span style=\"color:red\">(正确答案：" + daan + ")</span>");
                                    for (var i1 = 0; i1 < daan.length; i1++) {
                                        var i2 = $.inArray(daan.substr(i1,1),["A", "B", "C", "D", "E", "F"]);
                                        //sel-item-box flex items-center justify-center mb-[24px] relative
                                        // var temp1= $(".field.ui-field-contain:eq(" + i + ")").children(".divui-controlgroup.column1eq").children('div:eq(' + i1 + ')').attr("class");
                                        // console.log(temp1);
                                        // $(".field.ui-field-contain:eq(" + i + ")").children(".divui-controlgroup.column1eq").children('div:eq(' + i1 + ')').attr("class",temp1 + " checked");//children('span:eq(0)').children('a:eq(0)').
                                        // console.log(i2 + $(".field.ui-field-contain:eq(" + i + ")").children(".ui-controlgroup.column1:eq(0)").children('div:eq(' + i2 + ')').text());
                                        setTimeout($(".field.ui-field-contain:eq(" + i + ")").children(".ui-controlgroup.column1:eq(0)").children('div:eq(' + i2 + ')').children('.label:eq(0)').click(),1000);
                                        // temp1= $(".field.ui-field-contain:eq(" + i + ")").children(".divui-controlgroup.column1eq").children('div:eq(' + i1 + ')').children('span:eq(0)').children('a:eq(0)').attr("class");
                                        // temp1= $(".field.ui-field-contain:eq(" + i + ")").children(".divui-controlgroup.column1eq").children('div:eq(' + i1 + ')').children('span:eq(0)').children('a:eq(0)').attr("class",temp1 + " checked");
                                        // // $('.sel-item-box')[i2].click();
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        });
        if (tstr==0){
            var jdata1=new Array();
            $.ajax({
                url: "https://raw.githubusercontents.com/wxjwolf/wxjwolf/main/ks.json",
                dataType: "json",
                success: function (odata) {
                    // console.log(odata);
                    for (var t = 0; t < odata.data.length ; t++) {
                        jdata1[t]=odata.data[t];
                        //                             jdata[t]=odata.data[t];
                    }
                    var tishu=$(".field.ui-field-contain").length-1;
                    // console.log(jdata.length);
                    var tstring;
                    if (jdata1.length > 0 && tishu > 2){
                        var reg=/\s+/g;
                        // tstring=tstring.replace(reg,"");
                        // console.log(jdata.length);
                        for (var i = 0; i <= tishu; i++) {
                            // console.log($(".field.ui-field-contain:eq(" + i + ")").children(".field-label").text());
                            if ($(".field.ui-field-contain:eq(" + i + ")").children(".ui-controlgroup.column1").length>0){
                                tstring=$(".field.ui-field-contain:eq(" + i + ")").children(".field-label").text().replace(reg,"");
                                tstring=tstring.replace("【单选题】","");
                                tstring=tstring.replace("【多选题】","");
                                tstring=tstring.replace("【判断题】","");
                                tstring=tstring.replace("(单选题)","");
                                tstring=tstring.replace("(多选题)","");
                                tstring=tstring.replace("(判断题)","");
                                if (tstring.substr(tstring.length-1,tstring.length)=="*"){
                                    tstring=tstring.substr(0,tstring.length -1)
                                }
                                tflag=tstring.indexOf(".")+1;
                                tstring=tstring.substr(tflag,tstring.length-tflag);
                                // console.log("卷面题目：" + tstring);
                                for (var i5 = 0;i5<jdata1.length;i5++){
                                    var qstr=jdata1[i5].question;
                                    qstr=qstr.replace(reg,"");
                                    if ($.trim(qstr) == $.trim(tstring)) {
                                        // console.log("题库题目：" + qstr);
                                        var daan=jdata1[i5].answer.replace("正确答案:","");
                                        daan=daan.replace(reg,"");
                                        // console.log("答案：" + daan);
                                        $(".field.ui-field-contain:eq(" + i + ")").children(".field-label").append("<span style=\"color:red\">(正确答案：" + daan + ")</span>");
                                        tstr=$(".field.ui-field-contain:eq(" + i + ")").children(".ui-controlgroup.column1:eq(0)").children("div").length;
                                        // console.log(tstr);
                                        for (var i1 = 0; i1 < tstr; i1++) {
                                            // var i2 = $.inArray(daan.substr(i1,1),["A", "B", "C", "D", "E", "F"]);
                                            // console.log($(".field.ui-field-contain:eq(" + i + ")").children(".ui-controlgroup.column1:eq(0)").children('div:eq(' + i1 + ')').text());
                                            qstr=$(".field.ui-field-contain:eq(" + i + ")").children(".ui-controlgroup.column1:eq(0)").children('div:eq(' + i1 + ')').text().replace(reg,"");
                                            // console.log(daan);
                                            // console.log(qstr);
                                            if (daan.indexOf(qstr) >= 0){
                                                // console.log(qstr);
                                                // console.log(qstr);
                                                $(".field.ui-field-contain:eq(" + i + ")").children(".ui-controlgroup.column1:eq(0)").children('div:eq(' + i1 + ')').click();
                                            }
                                            //sel-item-box flex items-center justify-center mb-[24px] relative
                                            // var temp1= $(".field.ui-field-contain:eq(" + i + ")").children(".divui-controlgroup.column1eq").children('div:eq(' + i1 + ')').attr("class");
                                            // console.log(temp1);
                                            // $(".field.ui-field-contain:eq(" + i + ")").children(".divui-controlgroup.column1:eq(0)").children('div:eq(' + i1 + ')').attr("class",temp1 + " checked");//children('span:eq(0)').children('a:eq(0)').
                                            // console.log(i2 + $(".field.ui-field-contain:eq(" + i + ")").children(".ui-controlgroup.column1:eq(0)").children('div:eq(' + i2 + ')').text());
                                            //setTimeout($(".field.ui-field-contain:eq(" + i + ")").children(".ui-controlgroup.column1:eq(0)").children('div:eq(' + i2 + ')').children('.label:eq(0)').click(),1000);
                                            // temp1= $(".field.ui-field-contain:eq(" + i + ")").children(".divui-controlgroup.column1eq").children('div:eq(' + i1 + ')').children('span:eq(0)').children('a:eq(0)').attr("class");
                                            // temp1= $(".field.ui-field-contain:eq(" + i + ")").children(".divui-controlgroup.column1eq").children('div:eq(' + i1 + ')').children('span:eq(0)').children('a:eq(0)').attr("class",temp1 + " checked");
                                            // // $('.sel-item-box')[i2].click();
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
        // while (tflag==0){
        //     tflag=jdata.length;
        // }
    });
    // Your code here...
})();