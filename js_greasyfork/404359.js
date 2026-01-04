// ==UserScript==
// @name         ourstory网站助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.uvtao.com/
// @include      *://*.uvtao.com/*
// @include      *://*.baidu.com/*
// @include      *://*
// @connect		 ypsuperkey.meek.com.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/404359/ourstory%E7%BD%91%E7%AB%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/404359/ourstory%E7%BD%91%E7%AB%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
    //获取网站网址
    var url = window.location.href;
    //var $ = unsafeWindow.jQuery;

    if (url.indexOf('uvtao.com') > -1) {
        //============================================================================================================================================== uvtao
        //如果是uvtao教程网站，自动打开百度网盘并输入密码
        if (document.getElementsByClassName('t_f')[0].getElementsByTagName('a')[0] != null) {
            var aa = document.getElementsByClassName('t_f')[0].getElementsByTagName('a')[document.getElementsByClassName('t_f')[0].getElementsByTagName

                                                                                         ('a').length - 1].href;
            console.log(aa);
            //alert(aa);
            if (aa.indexOf('pan.baidu.com') > -1) {
                var tiquma = document.getElementsByClassName('t_f')[0].getElementsByTagName('div')[document.getElementsByClassName('t_f')[0].getElementsByTagName

                                                                                                   ('div').length - 1].innerText;
                console.log(tiquma);
                tiquma = tiquma.replace('提取码：', "");
                //setCookie('tiquma',tiquma,30);
                //alert(getCookie('tiquma'));
                console.log(tiquma);
                GM_setValue('tiqumas', tiquma); //复制到jslocal
                window.location.href = aa;
            }
        }
        //接触不能复制
        document.onselectstart = function(){
            event.returnValue = true;
        }
        document.onkeydown = function(){
            event.returnValue = true;
        }
        // 或者直接返回整个事件
        //document.onselectstart = function(){
        //return false;
        //}
    } else if (url.indexOf('pan.baidu.com/share/init?surl') > -1) {
        //============================================================================================================================================== pan.baidu.com
        //如果是uvtao教程网站，自动打开百度网盘并输入密码
        var ma = GM_getValue('tiqumas');
        //alert(ma);
        if (ma != null) {
            document.getElementsByTagName('input')[0].value = ma;
            document.getElementsByClassName('g-button-right')[0].click();
            return;
        } else {
            //使用外部网站获取百度网盘密码
            var input = document.querySelector('.pickpw input[tabindex="1"], .access-box input#accessCode');
            var btn = document.querySelector('.pickpw a.g-button, .access-box a#getfileBtn');
            if (!input || !btn) {
                return;
            }
            var label = document.querySelector('.pickpw dt, .access-box label[for=accessCode]');
            var shareID = (location.href.match(/\/init\?(?:surl|shareid)=((?:\w|-)+)/) || location.href.match(/\/s\/1((?:\w|-)+)/))[1];
            label.style.margin = "-5px 0 10px";
            label.innerHTML += '<br>提取码自动填写：';
            var urls = 'https://ypsuperkey.meek.com.cn/api/items/BDY-' + shareID + '?access_key=4fxNbkKKJX2pAm3b8AEu2zT5d2MbqGbD&client_version=2018.8';
            //alert(url);
            GM_xmlhttpRequest({
                method: 'GET',
                url: urls,
                onload: function (xhr) {
                    var e = JSON.parse(xhr.responseText);
                    label.innerHTML += xhr.status == 200 ?
                        (e.access_code ? '提取码已获取'.fontcolor('blue') : '提取码未找到'.fontcolor('red')) :
                    '服务器出现异常'.fontcolor('red');
                    if (xhr.status == 200 && e.access_code) {
                        input.value = e.access_code; //填写密码
                        setTimeout(function () {
                            btn.click();
                        }, 1000);
                    }
                }
            });
        }

    } else if (url.indexOf('pan.baidu.com/s') > -1) {
        //============================================================================================================================================== pan.baidu.com
        //进入网盘，自动点击全选，点击保存，点击上次存储位置
        if (document.getElementsByClassName('share-list')[0] != null) {
            document.getElementsByClassName('share-list')[0].getElementsByTagName('li')[2].getElementsByTagName('span')[0].click(); //全选
        }
        document.getElementsByClassName('g-button-right')[0].click(); //保存
        setTimeout(function () {
            document.getElementsByClassName('save-chk-io')[0].click(); //常用
        }, 500);
    } else if (url.indexOf('taobao.com/category') > -1 || url.indexOf('taobao.com/search') > -1) {
        //============================================================================================================================================== taobao.com
        //进入淘宝分类页面，提取当页面所有商品链接
        //添加p标签
        var p = document.createElement('p');
        p.id = 'zj_showbox';
        document.body.appendChild(p);
        setTimeout(function () {
            var length = document.getElementsByClassName('shop-hesper-bd grid')[0].getElementsByClassName('item').length;
            for (var i = 0; i < length; i++) {
                var href_str = document.getElementsByClassName('shop-hesper-bd grid')[0].getElementsByClassName('item')[i].getElementsByClassName('J_TGoldData')

                [0].href
                p.innerHTML = p.innerHTML + '<br> ' + href_str;
            }
            GM_setClipboard(p.innerText);
        }, 3000);
    }
    else if (url.indexOf('item.taobao.com/item.htm') > -1) {
        //============================================================================================================================================== item.taobao.com
        //如果进入了宝贝详情页
        setTimeout(function () {
            var dt = g_config.idata.item.dbst;
            var updt = new Date(dt).toLocaleString();
            document.getElementsByClassName('tb-main-title')[0].innerText = document.getElementsByClassName('tb-main-title')[0].innerText + '上架时间:' + updt;
        }, 3000);
    }
    else if (url.indexOf('login.taobao.com') > -1) {
        //============================================================================================================================================== login.taobao.com
        //自动登录
        setTimeout(function () {
            $('#fm-login-id').val("迷你淘包铺");
            $('#fm-login-password').val("zj013368qw@");
            $('.fm-button').click();
            /*
            var username = document.getElementById('TPL_username_1');
            username.focus();
            //username.value = '迷你淘包铺';
            username.value = '生如夏花_小七';
            var password = document.getElementById('TPL_password_1');
            password.focus();
            password.value = 'qgr1989620!';
            var btns = document.getElementById('J_SubmitStatic');
            btns.focus();
            setTimeout(function () {
                //检测是否需要安全验证
                var noCaptcha = document.getElementById('nocaptcha');
                if (noCaptcha && noCaptcha.className == "nc-container tb-login" &&
                    noCaptcha.style.display != "block") {
                    var submitStatic = document.getElementById("J_SubmitStatic");
                    if (submitStatic) submitStatic.click();
                }
            }, 2000);*/
        }, 2000);
    }
    else if (url.indexOf('breakserver.hichina.com') > -1) {
        //============================================================================================================================================== hichina.com
        //自动登录OA
        var pwd = document.getElementById('password');
        pwd.focus();
        pwd.value = 'zhangjian';
        var vc = document.getElementById('verify_code');
        vc.focus();
    }
    else if(url.indexOf('tingshu') > -1)
    {
        //============================================================================================================================================== tingshu
        //听书网站去广告
        //document.getElementsByClassName("s-hl-content")[0].style='display:none';
        //document.getElementById('baybox').style='display:none';
        var weburl = window.location.host.replace('www.','').replace('.com','');
        setTimeout(function () { }, 3000);
        window.onload = function(){
            //删除flash广告
            $('object')[0].remove();
            //删除a标签广告
            var alist = $('a');
            for(var i =0; i< alist.length; i++)
            {
                if(alist[i].href.indexOf(weburl) == -1)
                {
                    alist[i].remove();
                }
            }
            //删除iframe
            var iflist = $('iframe');
            for(var j =0;j<iflist.length;j++)
            {
                iflist[j].remove();
            }
        }

    }
    else if(url.indexOf('DanHaoSearch.aspx') > -1)
    {
        //============================================================================================================================================== 空包网
        $("#moshisan").click();
        $("#MainC_tb_sendCity").val("高碑店");
    }
    else if(url.indexOf('baidu.com/s?') > -1)
    {
        //============================================================================================================================================== 百度搜索
        //去掉百度搜索广告
        setInterval(function(){
            // setTimeout(function () {
            try
            {

                $("#content_left").children().not(".c-container").remove();
                $(".ec_tuiguang_pplink").parents(".c-container").remove();
                $(".ec_tuiguang_container").parents(".c-container").remove();
                $(".ec_tuiguang_ppimlink").parents(".c-container").remove();
                $(".layout").remove();
                $("#content_right").remove();
                $("#foot").remove();
                $("#content_left").css("padding-left",(window.innerWidth-540)/2);
                $("#page").css("padding-left",(window.innerWidth-540)/2);
                $("#form").css("margin","11px 0 0 "+(window.innerWidth-800)/2+"px");
                $(".nums").css("margin","0 0 0 "+(window.innerWidth-538)/2+"px");
                $("#s_tab").css("padding","55px 0 0 "+(window.innerWidth-550)/2+"px");

                //$(".c-container").css("width","100%");
                //$(".c-span-last").css("width","100%");

                /*
                var item = $("#content_left").children().find("span");
$("#content_left").children().find("span").css("background-color","yellow");
                for(var i=0;i<item.length;i++)
                {
                    //item[i].innerText=item.length+i+"广告";
                   if(item[i].innerText.indexOf('广告')>-1)
                   {
                       //alert(i);
                       item[i].innerText=item.length+i+"广告";
                       item[i].parents(".c-container").css("background-color","yellow");
                   }
                }



                //setTimeout(function () {
                //window.onload = function(){
                try
                {
                    if(document.getElementsByClassName('ec_tuiguang_container').length!=0)
                    {return;
                        document.getElementsByClassName('ec_tuiguang_container')[0].parentElement.parentElement.parentElement.remove();
                    }
                }catch(err1){alert(err1)}
                try
                {
                    if(document.getElementsByClassName('ec_tuiguang_ppimlink').length!=0)
                    {
                        document.getElementsByClassName('ec_tuiguang_ppimlink')[0].parentElement.parentElement.parentElement.parentElement.remove();
                    }
                }catch(err2){alert(err2)}
                try
                {
                    for(var i=0;i<10;i++)
                    {
                        if(document.getElementsByClassName('ec_tuiguang_pplink').length!=0)
                        {
                            document.getElementsByClassName('ec_tuiguang_pplink')[0].parentElement.parentElement.remove();
                        }
                    }
                }catch(err3){alert(err3)}
                //}
                //},3000);
                */
            }catch(err)
            {}
        }, 50);
    }
    else if(url.indexOf("www.baidu.com") > -1)
    {
        //============================================================================================================================================== 百度首页
        $("#s_wrap").remove();
        $("#s-hotsearch-wrapper").remove();
        $("#s-top-left").remove();
        $("#bottom_layer").remove();
        $("#u1").remove();
    }
    else if(url.indexOf("pc.woozooo.com")>-1)
    {
        ////============================================================================================================================================== 蓝奏云
         setInterval(function(){
              try{
                  document.getElementById('f_sha1').addEventListener('click', function (){window.open(document.getElementById('f_sha1').innerText);})
              }catch(err){}
         },500);
    }
    else if(url.indexOf("zhimaruanjian.com")>-1)
    {
        ////============================================================================================================================================== 芝麻HTTP代理
        if(document.getElementsByClassName('name')[0].innerText.indexOf('zmhttp824734')==-1)
        {
            //$('.login')[1].click();
            $('#login_phone').val('15176238323');
            $('#login_password').val('zhangjian');
            $('#login').click();
        }
    }
    else if(url.indexOf("gaoding.com/design")>-1)
    {
        ////============================================================================================================================================== 蓝奏云
         setInterval(function(){
              try{
                  $(".remove-watermark").remove();
                  $(".editor-watermark").remove();
              }catch(err){}
         },500);
    }
    else if(url.indexOf("10000kb.cn")>-1)
    {
        ////============================================================================================================================================== 10000空包网
        $("#kcl3").click();
         setInterval(function(){
              try{
                  $("#goodName").val("女包");
                  $(".editor-watermark").remove();
              }catch(err){}
         },500);
    }
    else if(url.indexOf("note.youdao.com/web")>-1)
    {
        ////============================================================================================================================================== 有道云笔记
         setInterval(function(){
              try{
                  $(".sidebar-ft")[0].remove();
                  $(".top-banner")[0].remove();
                  document.getElementsByClassName("main-container")[0].style.top = 0;
                  document.getElementsByClassName("sidebar-content")[0].style.bottom = 0;


              }catch(err){}
         },3000);
    }




})();