// ==UserScript==
// @name        有赞插件 - 华正电商部
// @namespace   Violentmonkey Scripts
// @match       *://*.youzan.com/*
// @include     *://hznmfw.com/*
// @version     1.0.6.6
// @author      LEO WONG
// @grant       GM.xmlHttpRequest
// @connect     *
// @description 2023-06-19 18:22:30
// @license
// @downloadURL https://update.greasyfork.org/scripts/446963/%E6%9C%89%E8%B5%9E%E6%8F%92%E4%BB%B6%20-%20%E5%8D%8E%E6%AD%A3%E7%94%B5%E5%95%86%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/446963/%E6%9C%89%E8%B5%9E%E6%8F%92%E4%BB%B6%20-%20%E5%8D%8E%E6%AD%A3%E7%94%B5%E5%95%86%E9%83%A8.meta.js
// ==/UserScript==

document.onreadystatechange = function () {
   if(document.readyState=="complete") {
     try{
      document.querySelector('#app > div > div.account__container > div.account__container__left > div > div.login-qrcode__title > span.login-qrcode__title__right').click();
      document.querySelector('#app > div > div.account__container > div.account__container__left > div > div.login-container__header > span.js-tab-password-login').click();
      //document.querySelector('#app > div > div.account__container > div.account__container__left > div > form > div.login-container__auto > label > div').click();
      document.querySelector('#app > div > div.account__container > div.account__container__left > div > form > div.login-container__auto > label').className='zent-checkbox-wrap login-container__auto__check zent-checkbox-checked';
     } catch(err){}
     // Agreed the agreement
    try{
    document.querySelector("#app > div > div.account__container > div.account__container__left > div > form > div.login-container__auto > div:nth-child(2) > label").click();
    //document.querySelector("#app > div > div.account__container > div.account__container__left > div > form > div.login-container__auto > label").click();
    } catch(err){}
    try{
     var login = document.querySelector("#app > div > div.account__container > div.account__container__left > div > form > div.login-container__auto > button");
    login.className = "zent-btn-primary zent-btn-large zent-btn-block zent-btn-border-transparent zent-btn login-container__btn js-login-btn" ;
    } catch(err){}
      try{
    document.querySelector('#app-container .empty-30-search__btn button').click();
    } catch(err){}
    //add sid value in cookie to headerInfo
    try{
    var infoHeadArea = document.querySelector('#app-container .Sey4n');
    var sid = document.createElement("span");
    sid.innerHTML = '<span class="TAFr0 active"> SID: ' + getCookie('sid') + '</span>'
    infoHeadArea.appendChild(sid);
     } catch(err){}
   }
}


//Main code
var order_no = getQueryString("order_no"); //var order_no = getQueryVariable('order_no');
Check_coupon(order_no);
//Main code


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // 判断这个cookie的参数名是不是我们想要的
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return("");
}

//var tmp = getCookie('EasyAuth')
//console.log('EasyAuth:' + tmp)

function Http_Request(url){
  return new Promise(resolve => {
    GM.xmlHttpRequest({
      method: "GET",
      url,
      onload: resolve
    });
	})
}
//跨域 优惠码详情
function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    if(window.location.hash.indexOf("?") < 0){
            return null;
    }
    let r = window.location.hash.split("?")[1].match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

function Check_coupon(order_no){
    var coupon_id,coupon_name;

    (async () => { //在此函数内的请求全部改为同步
      //var response = await Http_Request('https://carmen.youzan.com/gw/web/youzan.retail.trademanager.pcorder/1.0.0/get?order_no=' + order_no)
        var response = await Http_Request('https://carmen.youzan.com/gw/web/youzan.retail.trademanager.pcorder/1.0.0/get?order_no=' + order_no)
        var json_data = JSON.parse(response.responseText);
        console.log(json_data);
        coupon_name = json_data.response.order_activities[0].activity_name ; //优惠码名
        coupon_id = json_data.response.item_info[0].goods_activities[0].id ; //优惠码ID
        console.log('订单:' + order_no + ' 优惠券/码 名:' + coupon_name + ' 优惠券/码 ID:' + coupon_id);
        //查找优惠码
        var pageNo = 1;
        var pageSize = 200;

        while (true){
          var res_coupon_id = await Http_Request('https://store.youzan.com/v4/ump/promocode/api/codes-list?activityId='+ coupon_id +'&pageNo=' + pageNo +'&pageSize='+ pageSize)
          var json_data = JSON.parse(res_coupon_id.responseText);
          var total = json_data.data.total;
          //console.log(total);
          total = Number(total);

          //当页查询数据大小
          var data_length = json_data.data.data.length;
          var found_code = 0; //修正重复查询
          for(var n = 1 ; n < data_length; n++){
            var usedInOrderNo = json_data.data.data[n].usedInOrderNo;
            var code = json_data.data.data[n].code;
            if (order_no == usedInOrderNo){
              console.log('已找到 优惠券/码:' + code)
              found_code = 1;
              //document.querySelector('#app-container > div li:nth-child(3) > p > span.text').innerText ='优惠码名称: ' + remark + ' 优惠码:' + code;
              //document.querySelector('#app-container > div li:nth-child(3) > p > span.text').innerText = '优惠码:' + code;
              break;
            }
          }
          if (found_code > 0){ break } //修正重复查询

          if( total - (pageNo * pageSize) > 0){
            //还有继续循环
            console.log('优惠券/码 还要再查询 ' + Math.ceil((total - (pageNo * pageSize)) / pageSize));
            pageNo = pageNo + 1 ;
          }else{
            //查询完毕, 跳出
            break;
          }

        }

      //查找remark;
      var pageNo = 1;
      var pageSize = 10;

      while (true){

        var res = await Http_Request('https://store.youzan.com/v4/ump/promocode/api/list?pageSize=' + pageSize + '&pageNo='+ pageNo +'&status=0&type=0')
        var json_data = JSON.parse(res.responseText);
        var total = json_data.data.total;
        console.log("查找remark结果:" + total);
        total = Number(total);

        //当页查询数据大小
        var data_length = json_data.data.items.length;
        var found_code = 0; //修正重复查询

        for(var n = 1 ; n < data_length; n++){
          var id = json_data.data.items[n].id;
          var remark = json_data.data.items[n].remark;

          if (coupon_id == id){
            console.log('优惠券/码 备注:' + remark)
            found_code = 1;//修正重复查询
            //document.querySelector('#app-container > div li:nth-child(3) > p > span.text').innerText ='优惠码名称: ' + remark + ' 优惠码:' + code;
            //document.querySelector('#app-container > div li:nth-child(3) > p > span.text').innerText = '优惠码:' + code;
            break;
          }else{
            var remark = '';
          }


        }

        if(total - (pageNo * pageSize) > 0 & remark == ''){
          //还有继续循环
          console.log('优惠券/码 备注 还要再查询 ' + Math.ceil((total - (pageNo * pageSize)) / pageSize));
          pageNo = pageNo + 1 ;
        }else{
          console.log('查询完毕，remark:' + remark)
          document.querySelector('#app-container > div li:nth-child(3) > p > span.text').innerText ='优惠券/码 值:  ' + code + '\r' +' 优惠券/码 名:  ' + remark;
          //查询完毕, 跳出
          break;
        }

      }
    //最终显示
    //  document.querySelector('#app-container > div li:nth-child(3) > p > span.text').innerText ='优惠码:' + code + '\r' +' 备注名:' + remark;

    })()
}
