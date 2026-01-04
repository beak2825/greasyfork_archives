// ==UserScript==
// @name         试客巴信息强制修改
// @namespace    http://ziyuand.cn
// @version      0.1
// @description  信息强制修改
// @author       You
// @match        https://wx.shike8888.com/user/basicSet
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418161/%E8%AF%95%E5%AE%A2%E5%B7%B4%E4%BF%A1%E6%81%AF%E5%BC%BA%E5%88%B6%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/418161/%E8%AF%95%E5%AE%A2%E5%B7%B4%E4%BF%A1%E6%81%AF%E5%BC%BA%E5%88%B6%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
$('.change_information').append('<div class="setting_item login_pw personal_info" ><span style="color:red">强制修改</span><a id="xiugai" >修改</a></div>');
var xuanxian;
$('#xiugai').on("tap",function(event){
    leixin=prompt("请输入修改类型，淘宝ID：1，淘宝是否绑定：2，淘宝等级：3，手机号：4，手机是否绑定：5，用户名：6，性别：7，淘气值：8");
    if (leixin!==''){
        switch(leixin){
            case '1':
                // 淘宝ID
                //console.log("-----------------待领取-----------------");
                var tbid=prompt("请输入淘宝ID");
                if(tbid!==''){
                data = {taobao_id: tbid};
                jiaqian(data);
                }
                break;
            case '2':
                // 淘宝是否绑定
                //console.log("-----------------待领取-----------------");
                var tbbangding=prompt("设置淘宝ID绑定状态：已绑定1，未绑定0");
                 if(tbbangding!==''){
                data = {taobao_is_exchange: tbbangding};
                jiaqian(data);}
                break;
            case '3':
                // 淘宝等级
                //console.log("-----------------待领取-----------------");
                 var tblev=prompt("设置淘宝等级（默认2）");
                 if(tblev!==''){
                data = {taobao_status: tblev};
                jiaqian(data);}else{
                tblev=2;
                data = {taobao_status: tblev};
                jiaqian(data);
                }
                break;
            case '4':
                // 手机号
                //console.log("-----------------待领取-----------------");
                 var phone=prompt("请输入手机号");
                 if(phone!==''){
                data = {phone: phone};
                jiaqian(data);}
                break;
            case '5':
                // 手机号
                //console.log("-----------------待领取-----------------");
                 var isphone=prompt("手机号绑定状态：已绑定1，未绑定0");
                 if(isphone!==''){
                data = {tel_is_exchange: isphone};
                jiaqian(data);}
                break;
            case '6':
                // 用户名
                //console.log("-----------------待领取-----------------");
                 var user_name=prompt("输入用户名");
                 if(user_name!==''){
                data = {user_name: user_name};
                jiaqian(data);}
                break;
            case '7':
                // 性别
                //console.log("-----------------待领取-----------------");
                 var sex=prompt("输入性别，男1 女2");
                 if(sex!==''){
                data = {sex: sex};
                jiaqian(data);}
                break;
            case '8':
                // 淘气值
                //console.log("-----------------待领取-----------------");
                 var taoqi_value=prompt("输入淘气值");
                 if(taoqi_value!==''){
                data = {taoqi_value: taoqi_value};
                jiaqian(data);}
                break;

       }}
    });

function jiaqian(data){


mui.ajax('/newUserInfo/modifyUser', {
        dataType: 'json', //服务器返回json格式数据
        data:data,
        type: 'post', //HTTP请求类型
        success: function(ret) {
        	var data = ret.data;
        	if(ret.code == 1){
        		mui.alert('修改成功！',function(){
                    location.reload();
                          });
        	}else{

        		mui.alert(data.msg);
        	}

        }
    });

   location.reload();



}
    // Your code here...
})();
