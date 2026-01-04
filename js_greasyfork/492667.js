// ==UserScript==
// @name         自如工具箱
// @namespace    http://tampermonkey.net/
// @version      0.6
// @license MIT
// @description  只为看着清爽点
// @author       ripple57
// @run-at       document-start
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @match       https://*.ziroom.com/*
// @match       https://ams.ziroom.com/*
// @match       https://zo.ziroom.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492667/%E8%87%AA%E5%A6%82%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/492667/%E8%87%AA%E5%A6%82%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var t;
    function perf_observer(list, observer){
        console.log("检测到网络请求"+new Date().toLocaleTimeString());
        clearInterval(t);
        t = setInterval(()=>{
            if(new Date().getHours()<22){
                if(window.location.href=="https://ams.ziroom.com/AMS/security/security!indexAMS.action"){
                    location.reload();
                    console.log("资产系统自动刷新" );
                }else if(window.location.href=="https://zo.ziroom.com/common/home.action"){
                    location.reload();
                    console.log("CRM自动刷新" );
                }

            }
        },1000*60*125);//25分钟后刷新

    }

    var observer = new PerformanceObserver(perf_observer);
    observer.observe({entryTypes:["resource"]});
    function getNetworkRequests(
    entries = performance.getEntriesByType('resource'),
     type =['document','xmlhttprequest']){
        return entries.filter(entry =>{
            return type.indexOf(entry.initiatorType)>-1;
        })
    }
    let hetonghao;
    $(function () {
        if (window.location.href.indexOf("ziroom.com") > -1) {
            console.log("自如脚本执行");
            //$('.mask_div').hide();
            GM_addStyle('.mask_div{display:none !important}');
            GM_addStyle('#fade{display:none !important}');
            GM_addStyle('#light{display:none !important}');

            if (window.location.href.indexOf("ams.ziroom.com/AMS/security/security!index.action") > -1) {
                console.log("资产管理系统自动跳过地区")
                $("#territoryId").find("option:contains('北京')").attr("selected",true);
                $('#selectCity').click();

            }else if(window.location.href.indexOf("zo.ziroom.com/common/toSelectCity.action") > -1){
                console.log("crm自动跳过地区")
                GM_addStyle('#layui-layer-shade1{display:none !important}');
                GM_addStyle('#layui-layer1{display:none !important}');
                $("#jobcode").find("option:contains('业主管家')").attr("selected",true);
                $("#cityCode").find("option:contains('北京')").attr("selected",true);
                $('#queryBusOppList').click()

            }else if(window.location.href.indexOf("?watermark/4/text/") > -1){//crm去水印
                $("body").before(
                    "<button id = 'btn1' >去水印</button>"
                );
                var href = window.location.href;
                var newhref =href.substring(0, href.indexOf('?watermark'));
                $("#btn1").click(function (e) {
                    window.location.href=newhref;
                });//
            }else if(window.location.href.indexOf("https://mona.ziroom.com/crm/") > -1){//资产管理系统去水印
                $("body").before(
                    "<button id = 'btn' >下载照片</button>"
                );

                var oldhref = window.location.href;
                var str = "https://zo.ziroom.com/110000/hireSupplyAgreement/downLoadPic.action?picUrl=http://intimage.ziroom.com/";
                var new_href =str+oldhref.slice(28, -16);//下载链接
                console.log("照片新窗口1")
                $("#btn").click(function (e) {
                    window.location.href=new_href;
                });
            }else if(window.location.href.indexOf("https://ams.ziroom.com/AMS/hirerenewal/hireRenewal!hireRenewalMatainFrame.action") > -1){
                var href1 = window.location.href;
                var token1 =href1.substring(href1.indexOf('token='),href1.indexOf('&isView='));
                var newhref1= "https://ams.ziroom.com/AMS/hire/hireContract!indexDetailHireContract.action?"+token1
                window.location.href=newhref1;

            }else if(window.location.href.indexOf("https://ams.ziroom.com/AMS/hire/hireContract!listHireContract.action") > -1){
                document.title="收房合同"
            }else if(window.location.href.indexOf("https://ams.ziroom.com/AMS/hirerenewal/hireRenewal!listHireRenewal.action") > -1){
                document.title="续约合同"
            }else if(window.location.href.indexOf("https://zo.ziroom.com/110000/hireNewSign/getHireContractInfoList") > -1){
                $('td:contains("app录入")').click(function (e) {
                    var  hetonghao = $(this).closest('tr').find('td a.hireContractInfo')[0].text;
                    console.log(hetonghao)
                    if(hetonghao.indexOf('-')>-1){//续约
                        window.open('https://zo.ziroom.com/110000/renewList/getRenewContractInfoList?'+hetonghao, '_blank');
                        //$('input[name="hireContractCode"]').val(hetonghao);
                    }else{//新收
                        window.open('https://zo.ziroom.com/110000/hireSign/getHireContractInfoList?'+hetonghao, '_blank');
                        //$('input[name="hireContractCode"]').val(hetonghao);
                    }
                });
            }else if(window.location.href.indexOf("https://zo.ziroom.com/110000/renewList/getRenewContractInfoList?") > -1){//续约
                $('input[name="hireContractCode"]').val(window.location.href.substring(64));
                document.title="续约合同"
                $('.btn.btn-primary.search').click();

            }else if(window.location.href.indexOf("https://zo.ziroom.com/110000/hireSign/getHireContractInfoList?") > -1){//收房
                $('input[name="hireContractCode"]').val(window.location.href.substring(62));
                document.title="收房合同"
                $('.btn.btn-primary.search').click();

            }
        }
    });

    // Your code here...
})();