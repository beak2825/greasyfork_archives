
// ==UserScript==
// @name         New CZZ登录主菜单查询
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       zhurujin
// @match        https://rpt.interotc.com.cn/ReportSys/welcome*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379397/New%20CZZ%E7%99%BB%E5%BD%95%E4%B8%BB%E8%8F%9C%E5%8D%95%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/379397/New%20CZZ%E7%99%BB%E5%BD%95%E4%B8%BB%E8%8F%9C%E5%8D%95%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var mainUrl = 'https://10.2.86.31';
    var destUrl = "https://rpt.interotc.com.cn";
    $('body').append('<div id="dialog"></div>');
    $('#dialog').dialog({
        title: 'OTC科技金融组自动报备插件菜单',
        width: 450,
        height: 220,
        modal: false,
        collapsible:true,
        minimizable:true,
        closed: false,
        buttons: [
              /* {
                text: '双印',//需要重新上传双印版交易确认书
                handler: function () {
                   var cName = $('#corporate').combobox('getValue');
                    var protocals = $('#protocal').combobox('getValue');
                    var len = $('#product').combobox('getData').length;
                    var pLen = $('#protocal').combobox('getData').length;
                    if(pLen < 1){
                        alert("综合业务平台未找到对应的台帐数据，请确认。");
                        return;
                    }
                    if(!protocals){
                        alert("请选择需要报表的交易确认书信息。");
                        return;
                    }
                    if(len > 1){
                        if($('#product').combobox('getValue')===''){
                            alert("因该交易对手有多只产品，请选择报备的产品.");
                            return;
                        }
                    }
                    var prodName = $('#product').combobox('getValue');
                    //如果只有一个代码，默认直接帮助客户选择产品名称
                    if(!prodName){
                        prodName = $('#product').combobox('getData')[0].SIGNATURE_NAME;
                    }
                    //获得主协议信息
                    $.post("http://rpt.interotc.com.cn/web/do_list.ysp_bgxtjgd?prodType=9901",
                           {OPPONENT_NAME:cName},
                           function(res){
                               console.log(res);
                               res = JSON.parse(res);
                               var mainPros = '';
                               if(parseInt(res.total) < 1){
                                   alert('未找到该交易对手的主协议信息，请确认。');
                                   return;
                               }
                               else if(parseInt(res.total) == 1){
                                   mainPros = res.rows[0].DMAI_ID;
                                   alert(`现在进行报备为（数据只有一条）：\n交易对手为：${cName},\n产品代码：${res.rows[0].OPPO_PRODUCT_NAME}。\n如果不是请重新刷新页面。`);
                                   console.log(mainPros);
                               }else{
                                   for(var i = 0; i < res.rows.length;i++ ){
                                       if(res.rows[i].OPPO_PRODUCT_NAME == prodName){
                                            mainPros = res.rows[i].DMAI_ID;
                                            console.log(mainPros);
                                            alert(`现在进行报备为：\n交易对手为：${cName},\n产品代码：${res.rows[i].OPPO_PRODUCT_NAME}。\n如果不是请重新刷新页面。`);
                                            break;
                                       }
                                   }
                                   //避免前数据获取异常
                                   if(!mainPros || mainPros==""){
                                       for(let i = 0; i < res.rows.length;i++ ){
                                           if(res.rows[i].OPPONENT_NAME == cName){
                                               mainPros = res.rows[i].DMAI_ID;
                                               console.log(mainPros);
                                               alert(`现在进行报备为：\n交易对手为：${cName},\n产品代码：${res.rows[i].OPPO_PRODUCT_NAME}。\n如果不是请重新刷新页面。`);
                                               break;
                                           }
                                       }
                                   }
                                   if(!mainPros || mainPros==""){
                                       alert("无法确认唯一的主协议编号，请联系朱如锦。");
                                       return;
                                   }
                               }
                               //获得子协议信息
                               $.post('http://rpt.interotc.com.cn/web/do_list.ysp_bgxtjgd?prodType=9902',
                               {protocolId:mainPros},
                               function(res){
                                    console.log(res);
                                    var prosIds = '';
                                    var prodIds = '';
                                    res = JSON.parse(res);
                                    if(parseInt(res.total) < 1){
                                        alert('未找到该交易对手的子协议信息，请确认。');
                                        return;
                                    }
                                    else if(parseInt(res.total) == 1){
                                        prosIds =`${mainPros},${res.rows[0].DSUP_ID}`;
                                        //prodIds = `${res.rows[0].PRODUCT_ID},${res.rows[0].MAIN_PRODUCT_ID}`;
                                        prodIds = `${res.rows[0].MAIN_PRODUCT_ID},${res.rows[0].PRODUCT_ID}`;
                                    }

                                    else{
                                        prosIds =`${mainPros},${res.rows[0].DSUP_ID}`;
                                        prodIds = `${res.rows[0].MAIN_PRODUCT_ID},${res.rows[0].PRODUCT_ID}`;
                                    }
                                    var url = `http://rpt.interotc.com.cn:80/web/list_jgd_cxbg.ysp_bgxtjgd?prodType=9904&title=交易确认书&protocolIds=${prosIds}&proids=${prodIds}`;
                                    addTab('双印列表',url + '&cName='+escape(cName) + '&pName=' + escape(prodName) + '&protocal=' + escape(protocals));
                               }
                            );
                    });
                }
             },*/{
                text: '交易对手',
               // iconCls: 'icon-ok',
                handler: function () {
                    var cName = $('#corporate').combobox('getValue');
                    var pName = $('#product').combobox('getValue');
                    /*var len = $('#product').combobox('getData').length;
                    if(len > 1){
                        if($('#product').combobox('getValue')===''){
                            alert("因该交易对手有多只产品，请选择报备的产品.");
                            return;
                        }
                    }*/
                    if(!cName) return;
                    $('#tabs').tabs('close', "新增-主协议");
                    addTab('新增-主协议',destUrl + '/ReportSys/otcderivatives/addRiskWarn?type=0&tableId=dg&cName='+escape(cName) + '&pName=' + escape(pName));
                }
            }, {
                text: '确认书报备',
               // iconCls: 'icon-ok',
                handler: function () {
                    var cName = $('#corporate').combobox('getValue');
                    var protocals = $('#protocal').combobox('getValue');
                   // var len = $('#product').combobox('getData').length;
                    var pLen = $('#protocal').combobox('getData').length;
                    if(pLen < 1){
                        alert("综合业务平台未找到对应的台帐数据，请确认。");
                        return;
                    }
                    if(!protocals){
                        alert("请选择需要报表的交易确认书信息。");
                        return;
                    }
                    //产品名称可以为空
                    var prodName = $('#product').combobox('getValue');
                    /*if(len > 2){
                        if($('#product').combobox('getValue')===''){
                            alert("因该交易对手有多只产品，请选择报备的产品.");
                            return;
                        }
                    }*/
                    //如果只有一个代码，默认直接帮助客户选择产品名称
                    /*if(!prodName && prodName !=""){
                        prodName = $('#product').combobox('getData')[0].SIGNATURE_NAME;
                    }*/
                    //获得主协议信息
                    $.post(destUrl + "/ReportSys/otcderivatives/queryOtcderivatives",
                           {counterpartyName:cName},
                           function(res){
                               console.log(res);
                              //  res = JSON.parse(res);
                               var mainPros = '';
                               if(parseInt(res.total) < 1){
                                   alert('未找到该交易对手的主协议信息，请确认。');
                                   return;
                               }
                               else if(parseInt(res.total) == 1){
                                   mainPros = res.rows[0].masterProtocolNumber;
                                   alert(`现在进行报备为（数据只有一条）：\n交易对手为：${cName},\n主协议号：${mainPros}。\n如果不是请重新刷新页面。`);
                                   console.log(mainPros);
                               }
                               else{
                                   for(let i = 0;i < res.rows.length; i++){
                                       let prdName = res.rows[i].bSignedProductName;
                                       if(prdName === prodName){
                                           mainPros = res.rows[i].masterProtocolNumber;
                                           alert(`现在进行报备为（数据只有一条）：\n交易对手为：${cName},\n产品名称：${prdName}。\n如果不是请重新刷新页面。`);
                                           console.log(mainPros);
                                           break;
                                       }
                                   }
                                   //如果还是没有找到，匹配交易对手
                                   if(!mainPros || mainPros==""){
                                       let foundNum = 0;
                                       for(let i = 0;i < res.rows.length; i++){
                                           let ctpName = res.rows[i].counterpartyName;
                                           if(cName == ctpName){
                                               foundNum += 1;
                                               mainPros = res.rows[i].masterProtocolNumber;
                                           }
                                       }
                                       //只有唯一一条数据才有效
                                       if(foundNum == 1){
                                           alert(`现在进行报备为（数据只有一条）：\n交易对手为：${cName},\n主协议号：${mainPros}。\n如果不是请重新刷新页面。`);
                                           console.log(mainPros);
                                       }
                                       else{
                                           mainPros = "";
                                       }
                                   }
                                   //如果还是没有则继续匹配页面交易对手产品名称
                                   if(mainPros == ""){
                                       var func = [];
                                       for(let i = 0;i < res.rows.length; i++){
                                           let id =  res.rows[i].midNumber;
                                           let mpn = res.rows[i].masterProtocolNumber;
                                           let f = new Promise((resolve, reject)=>{
                                               ajaxGetProdName(id, mpn,resolve, reject);
                                           });
                                           func.push(f);
                                       }
                                       Promise.all(func)
                                       .then(resAll=>{
                                           console.log(resAll);
                                           for(let i = 0;i < resAll.length; i++)
                                           {
                                               let prdName = resAll[i]['prdName'];
                                               if(prdName == prodName){
                                                   mainPros = resAll[i]['mpn'];
                                                   alert(`现在进行报备为（数据只有一条）：\n交易对手为：${cName},\n产品名称：${prdName}。\n如果不是请重新刷新页面。`);
                                                   break;
                                               }
                                           }
                                           //还是依然无法获取数据
                                           if(mainPros==""){
                                               alert("无法确认唯一的主协议编号，请联系朱如锦。");
                                               return;
                                           }
                                           $.post(destUrl + '/ReportSys/otcderivatives/queryOtcderivativesBcxy',
                                           {midNumber:mainPros},
                                            function(res){
                                                console.log(res);
                                                let midNumber = '';
                                                let bcidNumber = '';
                                                let bcid = "";
                                                if(parseInt(res.total) < 1){
                                                    alert('未找到该交易对手的子协议信息，请确认。');
                                                    return;
                                                }
                                                else if(parseInt(res.total) == 1){
                                                    midNumber = res.rows[0].midNumber;
                                                    bcidNumber = res.rows[0].bcidNumber;
                                                    bcid = res.rows[0].bcid
                                                }
                                                else{
                                                    if($('#corporate').combobox('getValue') === "深圳市环通世纪投资有限公司"){
                                                        midNumber = "Z17050200144009440002"
                                                        bcidNumber = "B18082100144009440008";
                                                        bcid = "a3aa8b2e48334dc997e14230ab3a9336";
                                                    }else{
                                                        alert("该交易对手存在多个子协议，无法确认子协议信息，请联系朱如锦。");
                                                        return;
                                                    }
                                                }
                                                $('#tabs').tabs('close', "新增交易确认书");
                                                var url = `${destUrl}/ReportSys/otcderivatives/addRiskWarn?type=3&pid=${bcid}&tableId=ddv2-0&midNumber=${midNumber}&bcidNumber=${bcidNumber}&protocals=${protocals}`;
                                                addTab('新增交易确认书',url);
                                            }
                                           );
                                           return;
                                       })
                                       .catch(err=>{
                                           console.log("error");
                                           alert("无法确认唯一的主协议编号，请联系朱如锦。");
                                           return
                                       });
                                   }
                               }
                              if(!mainPros || mainPros==""){
                                  //alert("无法确认唯一的主协议编号，请联系朱如锦。");
                                  console.log("无法确认唯一的主协议编号，请联系朱如锦。");
                                  return;
                              }
                               //获得子协议信息
                               $.post(destUrl + '/ReportSys/otcderivatives/queryOtcderivativesBcxy',
                               {midNumber:mainPros},
                               function(res){
                                    console.log(res);
                                    let midNumber = '';
                                    let bcidNumber = '';
                                    let bcid = "";
                                    if(parseInt(res.total) < 1){
                                        alert('未找到该交易对手的子协议信息，请确认。');
                                        return;
                                    }
                                    else if(parseInt(res.total) == 1){
                                        midNumber = res.rows[0].midNumber;
                                        bcidNumber = res.rows[0].bcidNumber;
                                        bcid = res.rows[0].bcid
                                    }
                                    else{
                                        if($('#corporate').combobox('getValue') === "深圳市环通世纪投资有限公司"){
                                            midNumber = "Z17050200144009440002"
                                            bcidNumber = "B18082100144009440008";
                                            bcid = "a3aa8b2e48334dc997e14230ab3a9336";
                                        }else{
                                            alert("该交易对手存在多个子协议，无法确认子协议信息，请联系朱如锦。");
                                            return;
                                        }
                                    }
                                    $('#tabs').tabs('close', "新增交易确认书");
                                    var url = `${destUrl}/ReportSys/otcderivatives/addRiskWarn?type=3&pid=${bcid}&tableId=ddv2-0&midNumber=${midNumber}&bcidNumber=${bcidNumber}&protocals=${protocals}`;
                                    addTab('新增交易确认书',url);
                               }
                            );
                    });
                }
            },{
                text: '确认书回写',
                //iconCls: 'icon-ok',
                handler: function (){
                    //alert("正在开发中，尽请期待。。。");
                    var bcxyh,conNo,ostamp,tID,fileVal;
                    bcxyh = localStorage.getItem("tbcxyh");
                    conNo = localStorage.getItem("tconNo");
                    ostamp = localStorage.getItem("tstamp");
                    tID = localStorage.getItem("tID");
                    fileVal = localStorage.getItem("fileVal");
                    var now = new Date();
                    var tstamp = Number(now);

                    //如果存储的数据大于了5分钟
                   if(tstamp - Number(ostamp) > 300000){
                        localStorage.removeItem("tstamp");
                        localStorage.removeItem("tbcxyh");
                        localStorage.removeItem("tconNo");
                        localStorage.removeItem("tID");
                        localStorage.removeItem("fileVal");
                        alert("提交后缓存确认的数据超过了5分钟, 无法自动跟新，请手动更新");
                        return;
                    }
                    rewriteZHYProc(bcxyh,conNo,ostamp,tID,fileVal);
                }
            },{
                text: '终止',
               // iconCls: 'icon-ok',
                handler: function () {
                    var cName = $('#corporate').combobox('getValue');
                    var protocals = $('#protocal').combobox('getValue');
                    //var len = $('#product').combobox('getData').length;
                    var pLen = $('#protocal').combobox('getData').length;
                    if(pLen < 1){
                        alert("综合业务平台未找到对应的台帐数据，请确认。");
                        return;
                    }
                    if(!protocals){
                        alert("请选择需要终止的交易确认书信息。");
                        return;
                    }
                    var prodName = $('#product').combobox('getValue');
                    /*if(len > 1){
                        if($('#product').combobox('getValue')===''){
                            alert("因该交易对手有多只产品，请选择报备的产品.");
                            return;
                        }
                    }
                    //如果只有一个代码，默认直接帮助客户选择产品名称
                    if(!prodName){
                        prodName = $('#product').combobox('getData')[0].SIGNATURE_NAME;
                    }*/
                    //获得主协议信息
                    $.post(destUrl + "/ReportSys/otcderivatives/queryOtcderivatives",
                           {counterpartyName:cName},
                           function(res){
                               var mainPros = '';
                               console.log(res);
                               if(parseInt(res.total) < 1){
                                   alert('未找到该交易对手的主协议信息，请确认。');
                                   return;
                               }
                               else if(parseInt(res.total) == 1){
                                   mainPros = res.rows[0].masterProtocolNumber;
                                   alert(`现在进行报备为（数据只有一条）：\n交易对手为：${cName},\n主协议号：${mainPros}。\n如果不是请重新刷新页面。`);
                               }
                               else{
                                   for(let i = 0;i < res.rows.length; i++){
                                       let prdName = res.rows[i].bSignedProductName;
                                       if(prdName === prodName){
                                           mainPros = res.rows[i].masterProtocolNumber;
                                           alert(`现在进行报备为（数据只有一条）：\n交易对手为：${cName},\n产品名称：${prdName}。\n如果不是请重新刷新页面。`);
                                           console.log(mainPros);
                                           break;
                                       }
                                   }
                                   //如果还是没有找到，匹配交易对手
                                   if(!mainPros || mainPros==""){
                                       let foundNum = 0;
                                       for(let i = 0;i < res.rows.length; i++){
                                           let ctpName = res.rows[i].counterpartyName;
                                           if(cName == ctpName){
                                               foundNum += 1;
                                               mainPros = res.rows[i].masterProtocolNumber;
                                           }
                                       }
                                       //只有唯一一条数据才有效
                                       if(foundNum == 1){
                                           alert(`现在进行报备为（数据只有一条）：\n交易对手为：${cName},\n产品代码：${mainPros}。\n如果不是请重新刷新页面。`);
                                           console.log(mainPros);
                                       }
                                       else{
                                           mainPros = "";
                                       }
                                   }
                                   //如果还是没有则继续匹配页面交易对手产品名称
                                   if(mainPros == ""){
                                    var func = [];
                                     for(let i = 0;i < res.rows.length; i++){
                                         let id =  res.rows[i].midNumber;
                                         let mpn = res.rows[i].masterProtocolNumber;
                                         let f = new Promise((resolve, reject)=>{
                                             ajaxGetProdName(id, mpn,resolve, reject);
                                         });
                                         func.push(f);
                                     }
                                     Promise.all(func)
                                     .then(resAll=>{
                                         console.log(resAll);
                                         for(let i = 0;i < resAll.length; i++)
                                         {
                                             let prdName = resAll[i]['prdName'];
                                             if(prdName == prodName){
                                                 mainPros = resAll[i]['mpn'];
                                                 alert(`现在进行报备为（数据只有一条）：\n交易对手为：${cName},\n产品名称：${prdName}。\n如果不是请重新刷新页面。`);
                                                 break;
                                             }
                                         }
                                         if(mainPros!=""){
                                            //进行打开操作
                                            openTerminalProc(mainPros,protocals);
                                         }
                                         else{
                                            alert("无法确认唯一的主协议编号，请联系朱如锦。");
                                         }
                                         return;
                                     })
                                     .catch(err=>{
                                         console.log("error:" + err);
                                         alert("无法确认唯一的主协议编号，请联系朱如锦。");
                                         return
                                     });
                                 }
                               }
                               if(!mainPros || mainPros==""){
                                   //alert("无法确认唯一的主协议编号，请联系朱如锦。");
                                   return;
                               }
                               //进行打开操作
                               openTerminalProc(mainPros,protocals);
                    });
                }
            }]
    });
    var content = '<div  style="display:block;"> \
                      <div style="display:inline-flex;margin-top:10px;margin-left:10px"> \
                         <label style="font-size:11px;width:70px;">交易对手：</label> \
                         <select id="corporate" class="easyui-combobox" style="width:300px;"></select></div> \
                      <div style="display:inline-flex;margin-top:10px;margin-left:10px"> \
                         <label style="width:70px;font-size:11px;">报备产品：</label> \
                         <input id="product" style="width:300px;"></div> \
                      <div style="display:inline-flex;margin-top:10px;margin-left:10px"> \
                         <label style="width:70px;font-size:11px;">确认书：</label> \
                         <input id="protocal" style="width:300px;"></div> \
                      <div style="display:inline-flex;margin-top:10px;margin-left:10px"> \
                         <label style="font-size:11px;">是否需补充双印版交易确认书(点击【确认书回写】时进行操作):</label> \
                         <input style="display:inline;margin-left:8px;margin-top:4px" id="isDouble" type="checkbox"></div> \
                  </div>'

    $('.panel-title').css({
      'width': '200px'
    });
    $('.panel-tool div ').css({
      'width': '16px'
    });
    $('.dialog-content').append(content);

    // $("#dialog").window({
    //     onMinimize: function () {
    //         $("#dialog").window('move',{
    //             left: "68%",
    //             top: "92%"
    //         }).window('collapse').window('open');
    //     },
    //     onExpand:function(){
    //         console.log("展开");
    //          $("#dialog").window('move',{
    //             left: "42%",
    //             top: "30%"
    //         });
    //     }
    // });
    $('#corporate').combobox({
        valueField:'id',
        textField:'text',
        onSelect:function(params){
            var cName = params.text;
            //获得交易对手的产品信息
            $('#product').combobox('clear');
            $('#protocal').combobox('clear');
            $.ajax({
                url: mainUrl + '/api/otc_derivative_counterparty/otc_derivative_counterparty_query?cName='+ cName,
                type:'GET',
                dataType:'jsonp',
                success:function(data){
                    console.log('交易对手产品数据：');
                    console.log(data);
                    $('#product').combobox('loadData',data);
                }
            });
            //获得产品确认书的ID信息
            $.ajax({
                url: mainUrl + '/api/option_parameter/otc_derivative_protocal_query?cName='+ cName,
                type:'GET',
                dataType:'jsonp',
                success:function(data){
                    console.log('交易确认书：');
                    console.log(data);
                    $('#protocal').combobox('loadData',data);
                }
            });
        }
    });
    $('#product').combobox({
        valueField:'SIGNATURE_NAME',
        textField:'SIGNATURE_NAME',
        onChange:function(params){
            $('#protocal').combobox('clear');
            let prdName = params;
            if(!prdName || prdName == 'null'){
                prdName = '';
            }
            let clientName = $('#corporate').combobox('getValue');
            var url = mainUrl + '/api/option_parameter/otc_derivative_protocal_query?cName='+ clientName + "&pName=" + prdName;
            //获得产品确认书的ID信息
            $.ajax({
                url: url,
                type:'GET',
                dataType:'jsonp',
                success:function(data){
                    console.log('交易确认书：');
                    console.log(data);
                    $('#protocal').combobox('loadData',data);
                }
            });
        }
    });
    $('#protocal').combobox({
        valueField:'PROS',
        textField:'PROS',
    });

    $.ajax({
        url:mainUrl +'/api/otc_derivative_counterparty/otc_derivative_counterparty_name_query',
        type:'GET',
        dataType:'jsonp',
        success:function(data){
            $('#corporate').combobox('loadData',data);
        },
        error:function(err){
            console.log(err);
        }
    });

    //回写综合业务平台
    function rewriteZHYProc(bcxyh,conNo,ostamp,tID,fileVal){
        //获得必要参数
        var tbcxyh = bcxyh;
        var tconNo = conNo;
        var fileValue= fileVal;
        $.post(`${destUrl}/ReportSys/otcderivatives/queryOtcderivativesOption`,
        {bcidNumber: tbcxyh, numberAppment: tconNo, page: 1, rows: 10},
        function(res){
            console.log(res);
            var okFlag = false;
            var opid = ""
            for(var i =0; i< res.rows.length; i++){
                let cn = res.rows[i].opNumberAppment;
                let state = res.rows[i].state;
                if(cn == tconNo && (state == 'submit' || state == 'change')){
                    opid = res.rows[i].opNumber;
                    okFlag = true;
                    break;
                }
             }
             if(!okFlag){
                 alert("抱歉，没有找到对应的交易确认书信息:" + contractNo + "。请检查报备的合同编号是否与综合业务平台一致。");
                 return;
             }
            //下载附件
            let formData = new FormData();
            formData.append('fileDesc',fileValue);
            let url = destUrl+'/ReportSys/files/downloadFileInter';
            var oReq = new XMLHttpRequest();
            oReq.responseType = "blob";
            oReq.open("POST", url, true);
            oReq.onload = function(){
                let ret = this.response;
                let reader = new FileReader();
                reader.readAsDataURL(ret);
                reader.onload = function (e) {
                    let pdfData = e.target.result;
                    console.log(pdfData);
                    //let postUrl = mainUrl + '/manage/optionparameter/rewriteoptionparameter.do';
                    let postUrl = mainUrl + '/api/option_parameter/update_confirm_status';
                    let postParams = {
                        pdfData: pdfData,
                        ID:tID,
                        opid:opid
                    };
                    $.post(postUrl,postParams,function(res){
                        console.log(res);
                    });
                }
            }
            oReq.send(formData);
        });
    }
    //提交双印数据bcxyh,conNo
    function fillDoulePrint(bcxyh,conNo){
        //var bcxyh = "SUP1656.OLD";
        //var conNo = "SWHY2018029";
        var check = $('#isDouble')[0].checked;
        if(!check){
            console.log("不需要提交双印半申请，结束。");
            return;
        }
        console.log("开始进行申请修改，提交双印版本的合同");
        $.post("http://rpt.interotc.com.cn/web/do_list.ysp_bgxtjgd?prodType=9904&protocolId=" + bcxyh,{
            page: 1,
            rows: 5,
            sort: "SUBMIT_DATE",
            order: "desc"
        }, function(res){
            res = JSON.parse(res);
             for(var i = 0; i < res.rows.length;i++ ){
                if(conNo === res.rows[i].CONTRACT_NUMBER){
                    var pId = res.rows[i].PRODUCT_ID;
                    console.log("Product_id:" + pId);
                    addTab('变更申请-交易确认书',`http://rpt.interotc.com.cn/web/init.ysp_bgbgsq?xbrlid=${pId}&prodType=9904`);
                    break;
                }
            }
        });
    }
    //通过异步获得产品名称数据
    function ajaxGetProdName(id,mpn,resolve,reject){
        let url = `${destUrl}/ReportSys/otcderivatives/updateRiskWarn?id=${id}&type=0&check=1&tableId=dg&sh=undefined`;
        console.log(url);
        $.ajax({
              url: url,
              type:'GET',
              dataType:'JSONP',
              success:function(data){
                  console.log($(data).eq(-2)[0].innerHTML);
                  let strExe = $(data).eq(-2)[0].innerHTML;
                  let strMat = strExe.match(/SignedProductName\":\"(\S*)\",/);
                  let prdName = "";
                  if(!strMat){
                      prdName = "";
                  }
                  else{
                      prdName = strMat[1];
                  }
                  resolve({prdName:prdName, mpn:mpn});
              },
              error:function(err, status){
                  reject("error");
              }
         });
    }
    //获得主协议号后，执行后续代码
    function openTerminalProc(mainPros,protocals){
        $.post(destUrl + '/ReportSys/otcderivatives/queryOtcderivativesBcxy',
        {midNumber:mainPros},
        function(res){
            console.log(res);
            var midNumber = '';
            var bcidNumber = '';
            var bcid = "";
            if(parseInt(res.total) < 1){
                alert('未找到该交易对手的子协议信息，请确认。');
                return;
            }
            else if(parseInt(res.total) == 1){
                midNumber = res.rows[0].midNumber;
                bcidNumber = res.rows[0].bcidNumber;
                bcid = res.rows[0].bcid;
            }
            else{//多个子协议
                if($('#corporate').combobox('getValue') === "深圳市环通世纪投资有限公司"){
                    midNumber = "Z17050200144009440002"
                    bcidNumber = "B18082100144009440008";
                    bcid = "a3aa8b2e48334dc997e14230ab3a9336";
                }else{
                    alert("该交易对手存在多个子协议，无法确认子协议信息，请联系朱如锦。");
                    return;
                }
            }
            var contractNo = protocals.split('-')[0];
            $.post(`${destUrl}/ReportSys/otcderivatives/queryOtcderivativesOption`,
            {bcidNumber: bcidNumber,numberAppment: contractNo, page: 1, rows: 10},
            function(res){
                console.log(res);
                //var contractNo = protocals.split('-')[0];
                var okFlag = false;
                for(var i =0; i< res.rows.length; i++){
                    let cn = res.rows[i].opNumberAppment;
                    let state = res.rows[i].state;
                    if(cn == contractNo && (state == 'submit' || state == 'change')){
                        let midNumber = res.rows[i].midNumber;
                        let bcidNumber = res.rows[i].bcidNumber;
                        let opid = res.rows[i].opid;
                        let opn = res.rows[i].opNumber;
                        $('#tabs').tabs('close', "新增-交易终止");
                        let url = `${destUrl}/ReportSys/otcderivatives/addRiskWarn?type=5&pid=${opid}&tableId=ddv3-&midNumber=${midNumber}&bcidNumber=${bcidNumber}&jNumber=${opn}&contractNo=${contractNo}`;
                        addTab('新增-交易终止', url);
                        okFlag = true;
                        break;
                    }
                }
                if(!okFlag){
                    alert("抱歉，没有找到对应的交易确认书信息:" + contractNo+"。请检查报备的合同编号是否与综合业务平台一致。");
                }
            });
        });

    }
  })();