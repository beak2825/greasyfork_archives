// ==UserScript==
// @name         UU
// @namespace    Huang
// @version      2.4
// @description  try to take over the world!
// @author       You
// @match        *://www.youpin898.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youpin898.com
// @match       *://steamcommunity.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @connect      www.youpin898.com
// @connect      api.youpin898.com
// @downloadURL https://update.greasyfork.org/scripts/461461/UU.user.js
// @updateURL https://update.greasyfork.org/scripts/461461/UU.meta.js
// ==/UserScript==

(function() {
    'use strict';
               var reg_youpin = /youpin/
               var url = location.href;

        var order_arr = []
if(reg_youpin.test(url))
    {
        var ck = document.cookie
        ck = ck.split('; ')
        var Authorization = ""
        for(let i of ck){
            var arr = i.split('=')
            if(arr[0] == "token"){
                Authorization = arr[1]
            }
        }
       doSend(Authorization)
       setTimeout(function(){location.reload()},150000);


    }

if(regSteam(url))
    {
              // var reg_steam2 = new RegExp(reg_steam.exec(href[i]),"i");
                    //console.log(reg_steam2);
                    var content = document.getElementById("you_notready");        //steam部分---------接受报价
                   if(!content)
                   {
                       window.close();
                   }
                   content.click();
                 setTimeout(function(){var span = document.getElementsByClassName("btn_green_steamui btn_medium");            // ---------确认
                                       span[0].children[0].click();},50);
                 setTimeout(function(){ var accept = document.getElementById("trade_confirmbtn_text"); //   ---------接受交易
                                       accept.click();},50);
                 setTimeout(function(){window.close()},2000);

    }

  })();

function regSteam(url)
{
    let temp = url + ""
    temp = url.replace(/[^0-9]/ig,"")
    //console.log(temp)
    //console.log(GM_getValue("href"+temp))
    if(!GM_getValue("href"+temp)) return false
    var reg_Steam = new RegExp(temp,"i");
         if( reg_Steam.test(GM_getValue("href"+temp)))
             return true;
}

//获取订单列表,即获取订单ID
function getOrderList(Authorization){
    return new Promise(resolve =>{
       GM_xmlhttpRequest({
                                method: "POST",
                                url: "https://api.youpin898.com/api/youpin/bff/trade/todo/v1/orderTodo/list",
                                responseType: "json",
                                headers:{
                                    "Content-Type": "application/json",
                                    "Authorization":"Bearer "+ Authorization
                                },
                                data:JSON.stringify({
                                    "userId":"2624990",
                                    "pageIndex": "1",
                                    "pageSize": "100"

                                }),
                                timeout:10000,
                                onload: function(res1){
                                    var res = res1.response;
                                    console.log(res.data)
                                    resolve(res)

                                },
                                onerror:function(err){
                                    console.log(err.status);
                                }
                            });
    })
}
//多个订单合并的请求
function getOrderDetail(Authorization,orderId){
    return new Promise(resolve => {
        GM_xmlhttpRequest({
                                                    method: "GET",
                                                    url: "https://api.youpin898.com/api/trade/Order/OrderPagedDetail?OrderNo=" + orderId,
                                                    responseType: "json",
                                                    headers:{
                                                        //"Content-Type": "application/json",
                                                        "Authorization":"Bearer "+ Authorization,
                                                        "App-Version": "4.2.0",
                                                        "AppType":3

                                                    },
                                                    timeout:10000,
                                                    onload: function(res3){
                                                        let res_orderhref2 = res3.response
                                                        //console.log(res_orderhref2)
                                                        let offerid = res_orderhref2.Data.SteamOfferId
                                                        resolve(offerid)
                                                    },
                                                    onerror:function(err){
                                                        console.log(err.status);
                                                    }
                                                });
    })
}
//主动发送报价
function sendOffer(orderId,Authorization){

    GM_xmlhttpRequest({
                         method: "PUT",
                         url: "https://api.youpin898.com/api/youpin/bff/trade/v1/order/sell/delivery/send-offer",
                         responseType: "json",
                         headers:{
                                    "Content-Type": "application/json",
                                     "Authorization":"Bearer "+ Authorization,
                                     "App-Version": "4.2.0",
                                      "AppType":3

                                  },

                     timeout:10000,
                     data:JSON.stringify({"orderNo": orderId,"AppType":"3","Platform":"ios","Version":"4.2.0"}),
                     onload: function(res3){
                                                   //console.log(res3.response)
                                                    },
                                                    onerror:function(err){
                                                        console.log(err.status);
                                                    }
                                                })
}
//获得steam交易的offerid
function getOfferId(Authorization,orderId){
    return new Promise(resolve =>{
        GM_xmlhttpRequest({
                       method: "POST",
                       url: "https://api.youpin898.com/api/youpin/bff/trade/v1/order/query/detail",
                       responseType: "json",
                            headers:{
                           "Content-Type": "application/json",
                           "Authorization":"Bearer "+ Authorization,
                           "App-Version": "4.2.0"
                       },
                       data:JSON.stringify({
                           "userId":"2624990",
                           "orderNo": orderId,

                       }),
                       timeout:10000,
                       onload: function(res2){
                           var res_orderhref = res2.response;
                           //console.log(res_orderhref)
                           let offerid = res_orderhref.data.tradeOfferId
                           resolve(offerid)
                       },
                       onerror:function(err){
                           console.log(err.status);
                       }
   });
    })
}
async function queryDetailAndSend(Authorization,order_arr){
    let set = new Set();
    let offerId;
    let task = []
    for(let i = 0; i < order_arr.length; i ++){
        task.push(getOfferId(Authorization,order_arr[i]))
    }
    let offer_arr = await Promise.all(task)
    task = []
    for(let i = 0; i < offer_arr.length; i ++){
        if(!offer_arr[i])
            task.push(getOrderDetail(Authorization,order_arr[i]))
        else{
           set.add(offer_arr[i])
        }
    }
    offer_arr = await Promise.all(task)
    for(let offerId of offer_arr){
        if(offerId)
            set.add(offerId)
    }
    /*
    for(let orderId of order_arr){
        offerId = await getOfferId(Authorization,orderId)
        if(!offerId) offerId = await getOrderDetail(Authorization,orderId)
        //console.log(orderId + ":" + offerId)
        set.add(offerId)
    }*/
    for(let i of set){
        if(i){
            let href = "https://steamcommunity.com/tradeoffer/" + i;
            GM_setValue("href"+i,i);
            window.open(href);
        }
    }

}
async function doSend(Authorization){
    let order_arr = []
    let res = await getOrderList(Authorization)
    //console.log(res)
    for(let idx of res.data){
        //console.log(idx)
        if(idx.typeId != 25)
            order_arr.push(idx.orderNo)
        else
            sendOffer(idx.orderNo,Authorization)
    }
    queryDetailAndSend(Authorization,order_arr)


}