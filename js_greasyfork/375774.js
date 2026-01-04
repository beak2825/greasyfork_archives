// ==UserScript==
// @name         99shou auto-test
// @namespace    http://tampermonkey.net/
// @version      1.24
// @description  99收 抢话费
// @author       You
// @include      http*://99shou.cn/charge/phone/table?type=doing*
// @include      http*://99shou.cn/charge/phone/wopay/table?type=doing*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375774/99shou%20auto-test.user.js
// @updateURL https://update.greasyfork.org/scripts/375774/99shou%20auto-test.meta.js
// ==/UserScript==
//update https://greasyfork.org/zh-CN/scripts/375774

~function (global) {
   //style
   var buttonmain = document.createElement("input"); //创建一个input对象（提示框按钮）
    buttonmain.setAttribute("type", "button");
    buttonmain.setAttribute("value", "快速获取订单");
    buttonmain.setAttribute("class", "layui-btn layui-btn-lg layui-btn-normal");
    var button10 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button10.setAttribute("type", "button");
    button10.setAttribute("value", "快速获取10元订单");
    button10.setAttribute("class", "layui-btn layui-btn-lg layui-btn-normal");
    //button.setAttributeNode("value","1")
    //button.setAttribute("onclick", "load_test()");
    //button1.setAttribute("onclick","setInterval('fastReceive(10);',150);");
    var button20 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button20.setAttribute("type", "button");
    button20.setAttribute("value", "快速获取20元");
    button20.setAttribute("class", "layui-btn layui-btn-lg layui-btn-normal");
    var button30 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button30.setAttribute("type", "button");
    button30.setAttribute("value", "快速获取30元");
    button30.setAttribute("class", "layui-btn layui-btn-lg layui-btn-normal");
    var button50 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button50.setAttribute("type", "button");
    button50.setAttribute("value", "快速获取50元");
    button50.setAttribute("class", "layui-btn layui-btn-lg layui-btn-normal");
    var button100 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button100.setAttribute("type", "button");
    button100.setAttribute("value", "快速获取100元");
    button100.setAttribute("class", "layui-btn layui-btn-lg layui-btn-normal");
    var button200 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button200.setAttribute("type", "button");
    button200.setAttribute("value", "快速获取200元");
    button200.setAttribute("class", "layui-btn layui-btn-lg layui-btn-normal");
    var button300 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button300.setAttribute("type", "button");
    button300.setAttribute("value", "快速获取300元");
    button300.setAttribute("class", "layui-btn layui-btn-lg layui-btn-normal");
    var button500 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button500.setAttribute("type", "button");
    button500.setAttribute("value", "快速获取500元");
    button500.setAttribute("class", "layui-btn layui-btn-lg layui-btn-normal");



    var web_sitename=location.href;
    if(web_sitename.indexOf("wopay")>0){
         var scriptContent2 = "function test_phone2(facevalue) {  \
            ajaxPostAsync('/charge/phone/wopay/receive/info', 'facevalue=' + facevalue + '&channel=2',function(data){ \
                parent.layer.msg('接单成功!', {icon: 1});  \
                parent.location.reload();    \
            },function(msg){   \
                    parent.layer.msg('接单失败!' + msg, {icon: 2});  \
            })   \
        };"

        jQuery('<script type="text/javascript" />').append(scriptContent2).appendTo($('body'));


        button100.setAttribute("onclick","setInterval('test_phone2(100);',150);");
        button200.setAttribute("onclick","setInterval('test_phone2(200);',150);");
        button300.setAttribute("onclick","setInterval('test_phone2(300);',150);");
        button500.setAttribute("onclick","setInterval('test_phone2(500);',150);");
        var x = document.getElementById("layuibody"); //layuibody  phoneOrderInfoListView
        x.appendChild(button100);
        x.appendChild(button200);
        x.appendChild(button300);
        x.appendChild(button500);

    }


    else
    {

    buttonmain.setAttribute("onclick","setInterval('fastReceive(10);',150);");
    button10.setAttribute("onclick","setInterval('fastReceive(10);',150);");
    button20.setAttribute("onclick","setInterval('fastReceive(20);',10);");
    button30.setAttribute("onclick","setInterval('fastReceive(30);',10);");
    button50.setAttribute("onclick","setInterval('fastReceive(50);',10);");
    button100.setAttribute("onclick","setInterval('fastReceive(100);',10);");
    button200.setAttribute("onclick","load_test(200);");

    // add button  window.localStorage['phone.fastreceive.facevalue']=30;
 


    var x = document.getElementsByName("blink"); //layuibody  phoneOrderInfoListView
    x[0].appendChild(buttonmain);
/** x[0].appendChild(button10);
    x[0].appendChild(button20);
    x[0].appendChild(button30);
    x[0].appendChild(button50);
    x[0].appendChild(button100);
    x[0].appendChild(button200);
    **/
    //layui-btn

    'use strict';

 // load_test(200);


  var scriptContent = "function load_test(value_input)                                                                                                                                             \
    {                                                                                                                                                                                              \
        //var value=30;                                                                                                                                                                            \
        var request_Num=1;                                                                                                                                                                         \
        localStorage.setItem('isdone',0); //初始化本地变量，设置为0 失败                                                                                                                           \
                                                                                                                                                                                                   \
        window.localStorage['phone.fastreceive.facevalue']=value_input;                                                                                                                            \
        window.localStorage['phone.fastreceive.receiveNum']=request_Num;                                                                                                                           \
                                                                                                                                                                                                   \
        for (var fail_num=0;fail_num<2000;fail_num++) {                                                                                                                                            \
                                                                                                                                                                                                   \
          // fastReceive2(fail_num);   //测试                                                                                                                                                      \
           fastReceive3(value_input);                                                                                                                                                              \
           //sleep(200);  //正式                                                                                                                                                                   \
                                                                                                                                                                                                   \
                                                                                                                                                                                                   \
            //alert(window.localStorage['isdone']);                                                                                                                                                \
            if (window.localStorage['isdone']==3) { break;}                                                                                                                                        \
                                                                                                                                                                                                   \
            /**   window.setTimeout(function(){fastReceive2(fail_num);                                                                                                                             \
                                  //alert(window.localStorage['isdone']);                                                                                                                          \
                                 // if (window.localStorage['isdone']==3){ return ok;}                                                                                                             \
                                 },1000*fail_num);  **/                                                                                                                                            \
            //var a=fastReceive2(fail_num);                                                                                                                                                        \
                                                                                                                                                                                                   \
            // if (window.localStorage['isdone']==3){ break;}                                                                                                                                      \
        }                                                                                                                                                                                          \
    }                                                                                                                                                                                              \
                                                                                                                                                                                                   \
    function fastReceive2(a)                                                                                                                                                                       \
    {  alert( window.localStorage['phone.fastreceive.facevalue']);                                                                                                                                 \
     window.localStorage['isdone']=5;                                                                                                                                                              \
     if (a==3){ window.localStorage['isdone']=3;}                                                                                                                                                  \
    }                                                                                                                                                                                              \
                                                                                                                                                                                                   \
    function fastReceive3(value_input_1) {                                                                                                                                                         \
        var parentLoadIndex = layui.layer.load(1);//加载层                                                                                                                                         \
                                                                                                                                                                                                   \
        ajaxPostAsync('/charge/phone/receive/info', 'facevalue='+value_input_1+'&receiveNum=1&channel[0]=1&channel[1]=2&channel[2]=3', function (data) {                                           \
            layui.layer.close(parentLoadIndex);//关闭加载层                                                                                                                                        \
                                                                                                                                                                                                   \
            layui.layer.msg('接单成功!', {icon: 1});                                                                                                                                               \
            window.localStorage['isdone']=3;                                                                                                                                                       \
            alert('成功');                                                                                                                                                                         \
          //  window.location.reload();//重新加载                                                                                                                                                  \
        }, function (msg) {                                                                                                                                                                        \
            layui.layer.close(parentLoadIndex);//关闭加载层                                                                                                                                        \
                                                                                                                                                                                                   \
            if (msg == '微信未绑定') {                                                                                                                                                             \
                layui.layer.open({                                                                                                                                                                 \
                    title: '请关注并绑定微信公众号'                                                                                                                                                \
                    ,                                                                                                                                                                              \
                    content: '<img src='http://99shou.cn/img/qr_jiujiushou.jpg' width='200px'><p style='color: red'>为尽可能的避免反撸，做单前请先绑定微信，以便能及时通知到您最新的订单状态！</p>'\
                });                                                                                                                                                                                \
            } else if (msg == '未进行实名认证，无法接单！') {                                                                                                                                      \
                layui.layer.confirm('未进行实名认证，无法接单！是否进行实名认证？', {                                                                                                              \
                    btn: ['前往实名', '取消'] //按钮                                                                                                                                               \
                }, function () {                                                                                                                                                                   \
                    top.window.location.href = '/user/balance_realname.jsp';                                                                                                                       \
                }, function () {                                                                                                                                                                   \
                });                                                                                                                                                                                \
            } else if (msg.indexOf('高级认证解除限制') != -1) {                                                                                                                                    \
                layui.layer.confirm(msg + '是否进行高级实名认证，解除大额做单单数限制？', {                                                                                                        \
                    btn: ['前往高级实名认证', '取消'] //按钮                                                                                                                                       \
                }, function () {                                                                                                                                                                   \
                    top.window.location.href = '/user/account/account_realnameidcard.jsp';                                                                                                         \
                }, function () {                                                                                                                                                                   \
                });                                                                                                                                                                                \
            }                                                                                                                                                                                      \
            else if (msg.indexOf('高级实名认证提高额度') != -1) {                                                                                                                                  \
                layui.layer.confirm(msg + '是否进行高级实名认证，增加每日做单金额？', {                                                                                                            \
                    btn: ['前往高级实名认证', '取消'] //按钮                                                                                                                                       \
                }, function () {                                                                                                                                                                   \
                    top.window.location.href = '/user/account/account_realnameidcard.jsp';                                                                                                         \
                }, function () {                                                                                                                                                                   \
                });                                                                                                                                                                                \
            } else {                                                                                                                                                                               \
                // fail_num=fail_num-1;  //fastReceive2();                                                                                                                                         \
                //  alert(msg);                                                                                                                                                                    \
                //window.localStorage['isdone']=5;                                                                                                                                                 \
                //layui.layer.msg('接单失败!' + msg, {icon: 2});                                                                                                                                   \
            }                                                                                                                                                                                      \
        });                                                                                                                                                                                        \
    }                                                                                                                                                                                              \                                                                                                                                                                       \
    function sleep(numberMillis) {                                                                                                                                                                 \
        var now = new Date();                                                                                                                                                                      \
        var exitTime = now.getTime() + numberMillis;                                                                                                                                               \
        while (true) {                                                                                                                                                                             \
            now = new Date();                                                                                                                                                                      \
            if (now.getTime() > exitTime)                                                                                                                                                          \
                return;                                                                                                                                                                            \
        }                                                                                                                                                                                          \
    }                                                                                                                                                                                              \
";

  //加入function
/**  var scriptE = document.createElement("script");
scriptE.setAttribute("type","text/javascript");
scriptE.innerHTML = scriptContent;
document.getElementById("toolbar").appendChild(scriptE);



var aa="function (){ alert('test');}";
  var scriptA = document.createElement("script");
scriptA.setAttribute("type","text/javascript");
scriptA.innerHTML = aa;
document.body.appendChild(scriptA);
**/

 }



var scriptB = document.createElement("script");
scriptB.setAttribute("type","text/javascript");
scriptB.innerHTML = scriptContent2;
//document.getElementById("toolbar").appendChild(scriptB);


}(window);

