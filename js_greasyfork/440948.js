// ==UserScript==
// @name         New1 usemyself
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @license MIT
// @description  try to take over the world!
// @author       You
// @match        
// @match        https://maoming.xueanquan.com/login.html
// @match        http://login.xueanquan.com/login*
// @match        http://login.xueanquan.com/login?type=codeLogin
// @match        https://login.xueanquan.com/login?type=codeLogin
// @match        https://maoming.xueanquan.com/MainPage.html#1
// @match       
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xueanquan.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440948/New1%20usemyself.user.js
// @updateURL https://update.greasyfork.org/scripts/440948/New1%20usemyself.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //============================================================================================================
    var sn="123456ABc78"//password
    var myCars=new Array("wangyanping479",
"weimingli192",
"dengjinhua4052",
"ganxiaoyou8812",
"ganjiayue4473",
"luxingjie5719",
"renqiaoxiang1610",
"zhuangshengjie553",
"liulanhua8346",
"limingkang8362",
"lishiqi6270552",
"lihengtao9569",
"limingshi8663",
"yangpeixin2539",
"wujinxing9872",
"hebingfu1911",
"zhangjinyu8007901",
"zhangkaixiang1670790",
"zhangjinhua362",
"zhangweilong8101790",
"zhangyingchan167",
"chenshiyu9380552",
"chenweilian5221",
"chenjianyong4958",
"linshanshan4956",
"linhailong0785",
"linchuxuan6881",
"zhoudonglai2831",
"zhouyantong6265",
"zhouzongqi0640",
"zhoujun8102337",
"zhoujunquan595",
"zhoujiaru0000",
"zhouzijun5660",
"zhoukaiwen533",
"gaoyeyu3138",
"gaozhenhui9133",
"huangzurong9871",
"huangganxiu",
"huangmei6119",
"huangmeiying1060",
"liangyuting455",
"liangjingwen4600",
"pengyongcai3736",
"xiezhenyu721",
"panwenying953",
"panshouhong799",
"panjiantao7782",
"panweihong3750",
"pankeheng345",
"panhaibin493",
"panliyin376",
"panxin1639",
"xuanxinyi328"

                        );//不要最后一个；ad
    //==============================================================================================================

    //---------------------------
    var addCookie = function (name, value, time) {
        var exp = new Date();
        var strSec = exp.getSeconds(time);

        exp.setTime(exp.getTime() + strSec * 1);
        //设置cookie的名称、值、失效时间
        document.cookie = name + "=" + value;
        //+ ";expires="+ exp.toGMTString();
    }

    var getCookie = function (name) {
        //获取当前所有cookie
        var strCookies = document.cookie;
        //截取变成cookie数组
        var array = strCookies.split(';');
        //循环每个cookie
        for (var i = 0; i < array.length; i++) {
            //将cookie截取成两部分
            // alert(array[i]);
            var item = array[i].split("=");
            //alert(array[i]);
            // alert(item[0]);
            //alert(item[1]);
            //判断cookie的name 是否相等
            if (item[0] == " "+name) {//多一个空格，是一个大坑呀！
                //alert(item[0]+"-:-"+item[1]);
                return item[1];
            }

        }
        return null;
    }

    //删除cookie
    var delCookie = function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        //获取cookie是否存在
        var value = getCookie(name);
        if (value != null) {
            document.cookie = name + "=" + value + ";expires="+ exp.toUTCString();
        }
    }

    //获取时间的秒数（参数：d，h,m,s） 12m
    var getSec = function(str){
        var str1 = str.substr(0, str.length - 1);//时间数值
        var str2 = str.substr(str.length-1, 1);//时间单位
        if (str2 == "s") {
            return str1 * 1000;
        }
        else if (str2 == "m") {
            return str1 * 60 * 1000;
        }
        else if (str2 == "h") {
            return str1 * 60 * 60 * 1000;
        }
        else if (str2 == "d") {
            return str1 * 24 * 60 * 60 * 1000;
        }
    }
    /*
    var name;
    var cookie_val;
    name="NUMBER1"
    //  delCookie(name);
    // var cooki=getCookie("nuber");
    var result = getCookie(name);

    if(result!=null){


        addCookie("NUMBER1",parseInt(result)+1,"1d");
    }else{

        document.cookie = "NUMBER1=1";

    }
*/
    // document.cookie = "NUMBER1=1";
    //--------------------------激活输入事件
    var event = document.createEvent('HTMLEvents');
    event.initEvent("input", true, true);
    event.eventType = 'message';
    //(inputobj).dispatchEvent(event);

    function demo (timeout,cb){
        setTimeout(function(){
            // console.log(character);
            cb?cb():null;
        },timeout);
    }//supop logint;
    var sleep = function(time) {
        var startTime = new Date().getTime() + parseInt(time, 10);
        while(new Date().getTime() < startTime) {}
    };//leattime






    window.onload = function(){









        //-----------------------
        var n;
        let name;
        name="NUMBER1"

        //document.cookie = "NUMBER1="+n;
        let result = getCookie(name);

        // alert("n="+result);
        if(result!=null){
            addCookie("NUMBER1",parseInt(result)+1,"60s");
            //alert(getCookie(name));
        }else{
            document.cookie = "NUMBER1=0";
        }
        if(parseInt(result)>myCars.length-2)
        {
            document.cookie = "NUMBER1=0" ;
        }
        // alert("n="+result);//--------------------------------------------------------------------------------
        demo(2000,function(){
            //  alert(myCars.length);
            let myinput;//document.querySelector("#app > div > div.codelogin > div.codelogin-bto")
            myinput=document.querySelector("#app > div > div.codelogin > div.codelogin-bto");//go input
            if(myinput!=null)
            {myinput.click();}//have an erro here
            demo(1000,function(){
                let inpupda;
                inpupda=document.querySelector("#app > div > div.accountlogin > div.acecountlogin-form > form > div:nth-child(1) > div > div > input");//goinpoutad
                if(inpupda!=null){
                inpupda.focus();
                n=getCookie(name);
                inpupda.setAttribute("value",myCars[n]);
                console.log("正在进行第"+n+"---"+n+"---"+n+"---"+n+"---"+n+"---"+n+"---"+n+"---"+n+"---"+n+"---"+n+"---"+n+"---"+n+"个--------------------------------------------------------------------");
                inpupda.dispatchEvent(event);//触发事件
                }
                demo(1000,function(){
                    let inpupdb;
                    inpupdb=document.querySelector("#app > div > div.accountlogin > div.acecountlogin-form > form > div:nth-child(2) > div > div > input");//gotnputsn
                   if(inpupdb!=null)
                   {
                   inpupdb.focus();
                    inpupdb.setAttribute("value",sn);
                    inpupdb.dispatchEvent(event);
                   }

                    demo(1000,function(){
                        let okclick;
                        okclick=document.querySelector("#app > div > div.accountlogin > div.acecountlogin-form > form > button > span");//clickok
                       if(okclick!=null){
                         okclick.click();
                       }

                        demo(5000,function(){
                            if(document.querySelector("#app > div > div > p:nth-child(4) > label > span.el-checkbox__label")!=null)
                            { document.querySelector("#app > div > div > p:nth-child(4) > label > span.el-checkbox__label").click();}

                            demo(5000,function(){
                                if(document.querySelector("#app > div > div > button")!=null)
                                { document.querySelector("#app > div > div > button").click();}
                                demo(5000,function(){
                                    location.reload();
                                    demo(1000,null);
                                });
                            });
                        });
                    })
                })
            })
        })

    }



    //out  location.reload([bForceGet])

    //----------------------
    //  var elment1= document.querySelector("body > div.nav.layui-layout-admin > div > ul.layui-nav.layui-layout-left > li:nth-child(6) > a");
    //  var para = document.createElement("a");
    //  para.href="javascript:window.opener=null;window.open('','_self');window.close();";
    //  para.innerText="关闭";
    // para.setAttribute("Id","closeself");
    //  elment1.parentElement.insertBefore(para,elment1);
    // document.getElementById("closeself").click();

    // setTimeout({},"5000");




    // Your code here...
})();