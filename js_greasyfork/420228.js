// ==UserScript==
// @name         爬取文件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  爬取
// @author       bob
// @match        https://www.txxxxxx.com/search*
// @requir       https://code.jquery.com/jquery-latest.js
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/420228/%E7%88%AC%E5%8F%96%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/420228/%E7%88%AC%E5%8F%96%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

 (function () {
      'use strict';
     var $ = $ || window.$;
     function sleep(numberMillis) {
         var now = new Date();
         var exitTime = now.getTime() + numberMillis;
         while (true) {
             now = new Date();
             if (now.getTime() > exitTime)
                 return;
         }
     }
     var enterpriseList = [ ];
     var dataList = [];
     var errorListIds = [];
     //获取企业列表
     GM_xmlhttpRequest({
        method: 'GET',
        url: "http://xxx.xxxxxx.com/yyyyyy/queryEnterpriseList?startID=44633&endID=45000",
        headers: {
                 "Content-Type": "application/json"
             },
        onload: function(response) {
            enterpriseList =  $.parseJSON( response.responseText );
            getData();
        },
    });

     //saveData(data);
     var count = 0;
     function saveData(data){
         GM_xmlhttpRequest({
             method: 'POST',
             data:JSON.stringify(data),
             url: "http://xxx.xxxxx.com/yyyyyy/saveDataList",
             dataType: "json",
             headers: {
                 "Content-Type": "application/json"
             },
             onload: function(response) {
                 
             },
         });
     }

   
     function getData(){
         for(var i=0;i<enterpriseList.length;i++){//
             var one = {};
             var url =  'https://www.uuuuuuuuu.com/search?key='+enterpriseList[i].enterpriseName.replace("（","(").replace("）",')');
             try{
                 var num=Math.floor(Math.random()*10+5);//随机等待几秒
                  sleep(num*1000);
                 $.ajax({url:url,
                         async:false,
                         // timeout:5000,
                         success:function(data){
                             var str = "index_verify?type=companysearch"
                             if(data.indexOf(str) != -1){
                                 i = enterpriseList.length;
                                 console.log('****************************************操作需要验证');
                             }

                             var el = $( '<div></div>' );
                             el.html(data);
                             var tda= $("div.content div.header a.name em", el)  ;
                             var detailUrl = $("div.content div.header a.name ", el)  ;

                             if(tda.length >0 && tda[0].innerText == enterpriseList[i].enterpriseName){
                                 $.ajax({url:detailUrl[0].href,
                                         async:false,
                                         // timeout:5000,
                                         success:function(data){
                                             var el = $( '<div></div>' );
                                             el.html(data);

                                             one.enterpriseName = enterpriseList[i].enterpriseName  ;//公司名称

                                             var tr = $("#_container_baseInfo table.table.-striped-col.-border-top-none tr", el);
                                             if(businessTerm.length>8){
                                                     if(businessTerm.substring(0,3) != '***'){
                                                         one.startTime = businessTerm.substring(0,9)  ;
                                                         if(businessTerm.substr(11) == '无固定期限'){
                                                             one.endTime = '2099-12-31';
                                                         }else{
                                                             one.endTime = businessTerm.substr(11);
                                                         }
                                             }else{
                                                         one.startTime = td[12].innerText.replace(/\s+/g,"").replace(/[\n\r]/g,'')  ;
                                                         if(businessTerm.substr(4) == '无固定期限'){
                                                             one.endTime = '2099-12-31';
                                                         }else{
                                                             one.endTime = businessTerm.substr(4);
                                                         }
                                                     }
                                             }
                                        }, error:function(data){}});
                             }else{
                one.qualificationNo = '--';
                 }
                 dataList.push(one);
                             if(dataList.length == 10){
                                   saveData(dataList);//保存数据
                                   dataList = [];
                                   count += 10;
                                   console.log('已保存数据:'+count);
                              }
                         }, error:function(data){ }});
             }catch(e){
             }
         }
     }
 })();