// ==UserScript==
// @name         WalletGO_Data
// @namespace    http://tampermonkey.net/
// @version      0.95
// @description  WalletGO GO GO!
// @author       eatpeach
// @email        eatpeachqq@gmail.com
// @match        *://adminweb.*/review/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/393116/WalletGO_Data.user.js
// @updateURL https://update.greasyfork.org/scripts/393116/WalletGO_Data.meta.js
// ==/UserScript==
console.log('start');
$(document).ready(function(){
    console.log('ready');
    function run(){
        var gongzhaiindex = 4;//共债数据显示在那一列（4）
        var paytimesindex = 6;//还清次数显示在那一列（6）
        var reqtimesindex = 8;//申请次数显示在那一列（8）
        $(".ant-table-thead tr th").eq(gongzhaiindex).html("共债");
        $(".ant-table-thead tr th").eq(paytimesindex).html("还清");
        $(".ant-table-thead tr th").eq(reqtimesindex).html("申请");
        //$(".ant-table-thead tr th").eq(isrejectindex).html("扑克牌");

        $(".ant-table-tbody tr").each(function(){
            var father =  $(this).find("td");
            var link = father.find("a").attr("href");
            if(link!=''){
                //取星探报告
                var arrUrl = link.split("&");
                var ccid = arrUrl[1];
                var url = "/api/api/review/risk_report?contractNo="+ccid+"&fromCache=false";
                $.getJSON(url,function(result){
                    var rs = JSON.stringify( result );
                    var sarr=JSON.parse( rs );
                    var gongzhai = '';
                    if(result!=''){
                        gongzhai = sarr[7]['reportResult'];
                    }else{
                        gongzhai = "error";
                    }

                    //星探报告返回失败，则从缓存中取
                    if(sarr['message']=='load risk report fialed '){
                        var url = "/api/api/review/risk_report?contractNo="+ccid+"&fromCache=true";
                        $.getJSON(url,function(result){
                            var rs = JSON.stringify( result );
                            var sarr=JSON.parse( rs );
                            var gongzhai = sarr[7]['reportResult'];
                        });
                    }

                    father.eq(gongzhaiindex).html(gongzhai);//共债数

                    var tempstr = "border:1px solid #4da9fe;color:#4da9fe;";

                    //取系统审核记录，判断是否机审拒绝
                    /*
                    var lurl = "/api/api/review/loanAppInfo?contractNo="+ccid;
                    var isreject = '';
                    $.getJSON(lurl,function(result){
                        isreject = result.sysrejectType;
                        if(isreject!="FIRST_REVIEW"){
                            //判断用户是否是被扑克牌两次通过（优质用户），优质用户需要退回人工核实，粉色标注loanid
                            var loanid = father.find("a").text();
                            var foreurl = "/api/api/review/loanAppReviewLog?loanAppId="+loanid;
                            if(loanid!==''){
                                $.getJSON(foreurl,function(data){
                                    var forcetimes = Object.keys(data).length;
                                    if(forcetimes==2){
                                         $.each(data, function(idx, obj) {
                                             console.log(idx);
                                             if(idx==1){
                                                if(obj.adminId=='100031'){
                                                 father.find("a").css("color","#e608d3");
                                                }
                                             }
                                         });
                                    }
                                })
                            }
                        }
                    });
                    */

                    //取申请次数
                    var paytimes = 0;
                    var furl = "/api/api/review/applyHistory?contractNo="+ccid;
                    $.getJSON(furl,function(result2){
                        $.each(result2, function(idx, obj) {
                            if(obj.status.key=='PAID_OFF'){
                                paytimes++;
                            }
                        });
                        var reqtimes = Object.keys(result2).length;
                        father.eq(reqtimesindex).html(reqtimes);
                        father.eq(paytimesindex).html(paytimes);
                    });

                    //取用户基础信息
                    var aurl = "/api/api/review/personalInfo?contractNo="+ccid;
                    $.getJSON(aurl,function(result){
                        var ktp = result.credentialNo;
                        var fullname = result.fullName;
                        var mobile = result.mobile;
                        var gongzhai = father.eq(gongzhaiindex).text();
                        if(gongzhai>8){
                            if(paytimes<=2){
                               tempstr = "border:1px solid red;color:red;";
                            }
                        }
                        var vtemp = "<a style='"+tempstr+"padding:4px 8px;' onclick=$(this).css('color','black');$(this).css('border-color','black'); target='_blank' href='#'>"+gongzhai+"</a>";
                        father.eq(gongzhaiindex).html(vtemp);

                    });

                });
            }
        });
    }
    console.log('add button');
    var btnSpider = document.createElement('div');
        btnSpider.id = 'wk_btn';
        btnSpider.style='display:block;z-index:999;position:fixed; right:10px;top:45%; width:70px; height:70px;padding-left:5px;padding-top:5px;line-height:30px; background-color:#f50;color:#fff;text-align:center;font-size:16px;font-family:"Microsoft YaHei","微软雅黑",STXihei,"华文细黑",Georgia,"Times New Roman",Arial,sans-serif;font-weight:bold;cursor:pointer';
        btnSpider.innerHTML='Update&nbsp;&nbsp;<br>Data';
        $('body').append(btnSpider);

        $('#wk_btn').on('click',function(){
            $('#wk_next').hide();
            run();
        });
    console.log('end');
});
console.log('complete');

