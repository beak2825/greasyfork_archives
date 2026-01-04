// ==UserScript==
// @name         网赚网盘助手
// @namespace    http://tampermonkey.net/
// @version      1.3.8
// @description  网赚网盘助手；支持20多种常见网赚网盘；1.减少人工操作；2.过滤网盘大部分广告；3.快速跳过等待倒计时；4.不需要输入验证码（大部分网盘）；5.没有破解VIP，网站各种限制还在；
// @author       HuaShengMi
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js

// @match        http://www.xfpan.cc/*.html
// @match        https://www.520-vip.com/*.html

// @match        http://www.kufile.net/file/*.html
// @match        https://www.yifile.com/*
// @match        https://rosefile.net/*
// @match        https://dufile.com/*.html
// @match        https://koalaclouds.com/*
// @match        https://www.skyfileos.com/*
// @match        https://www.77file.com/*

// @match        https://www.iycdn.com/*.html
// @match        https://www.dudujb.com/*.html

// @match        https://katfile.com/*.html
// @match        http://www.expfile.com/*.html

// @match        http://www.xywpan.com/*
// @match        http://www.xywp1.com/*
// @match        http://www.rarclouds.com/*

// @match        https://www.567file.com/*.html
// @include      http://www.xunniu*.com/*.html

// @match        http://www.xueqiupan.com/*.html
// @match        http://www.46to.com/*.html
// @match        https://www.ayunpan.com/*.html
// @match        https://ownfile.net/*.html

// @license    GPL-3.0-only
// @grant    GM_setClipboard
// @grant    GM_getValue
// @grant    GM_setValue
// @run-at       document-end
// @compatible	 Chrome
// @downloadURL https://update.greasyfork.org/scripts/458992/%E7%BD%91%E8%B5%9A%E7%BD%91%E7%9B%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458992/%E7%BD%91%E8%B5%9A%E7%BD%91%E7%9B%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/* eslint-disable no-redeclare */
/* eslint-disable no-undef */

(function() {
    'use strict';
    console.log('-----title-----'+ document.title);
    console.log('-----href-----'+ document.location.href);

    var strTip='<font size="3" color="green">💫 收费网盘助手 💫<p><p>1.减少人工操作；<p>2.过滤网盘大部分广告<p>3.快速跳过等待倒计时<p>4.不需要输入验证码（部分网盘）<p>5.没有破解VIP，网站各种限制还在</font><p><a href="http://www.popcat3.xyz" target=_blank><font  size="3" color="blue">http://www.popcat3.xyz</font></a>';
    function findAinBbyC(strA,classB, tagC)
    {
        var obj9=null;
        var obj1=document.querySelector(classB);
        if(obj1!=null)
        {
            //console.log(obj1.innerHTML);
            var obj2 = obj1.getElementsByTagName(tagC);
            for (var i = 0; i < obj2.length; i++)
            {
                console.log(i);
                console.log(obj2[i].outerHTML);
                if(obj2[i].outerHTML.indexOf(strA) >= 0)
                    obj9=obj2[i];

            }
        }
        return obj9;
    }
    function findAinB(strA,SelectorB)
    {
        var obj9=null;
        var obj1=document.querySelectorAll(SelectorB);//"div.package-download"
        if(obj1!=null && obj1.length>0)
        {
            for(var i=0;i<obj1.length;i++)
            {
                //console.log(obj1[i].innerHTML);
                if(obj1[i].innerHTML.indexOf(strA)>=0)
                {
                    obj9=obj1[i];

                }
            }
        }
        return obj9;
    }

    function getInnerHtml(Selector)
    {
        var obj1=document.querySelector(Selector);
        if(obj1!=null)
        {
            console.log(obj1.innerHTML);
            return obj1.innerHTML;
        }
        else
            return '';
    }

    function getInnerText(Selector)
    {
        var obj1=document.querySelector(Selector);
        if(obj1!=null)
        {
            console.log(obj1.innerText);
            return obj1.innerText;
        }
        else
            return '';
    }

    function getSubStr(source,b,e)
    {
        var s1=source;
        var p1=s1.indexOf(b);
        if(p1>0)
        {
            var p2=s1.indexOf(e,p1);
            var l=b.length;
            var s2=s1.substring(p1+l,p2);
            return s2;
        }
        return '';
    }
    // 获取元素在页面上的绝对位置
    function getElementPageLeft(element){
        var actualLeft=element.offsetLeft;
        var parent=element.offsetParent;
        while(parent!=null){
            actualLeft+=parent.offsetLeft+(parent.offsetWidth-parent.clientWidth)/2;
            parent=parent.offsetParent;
        }
        return actualLeft;
    }

    function getElementPageTop(element){
        var actualTop=element.offsetTop;
        var parent=element.offsetParent;
        while(parent!=null){
            actualTop+=parent.offsetTop+(parent.offsetHeight-parent.clientHeight)/2;
            parent=parent.offsetParent;
        }
        return actualTop;
    }
    function floatTip(id,Selector,strText)
    {
        var str='<font size="4" color="green">💫 收费网盘助手 💫<p>1.减少人工操作<br>2.过滤网盘大部分广告<br>3.快速跳过等待倒计时<br>4.不需要输入验证码（部分网盘）<br>5.没有破解VIP，网站各种限制还在</font><p><a href="http://www.popcat3.xyz" target=_blank><font  size="3" color="blue">http://www.popcat3.xyz<p></font></a>';
        if(id==0)
            str = str + '<font size="4" color="darkcyan" id="a0b">请等待……</font>';
        else if(id==1)
            str = str + '<font size="4" color="red" id="a1b">请根据页面提示，完成验证；</font>';

        else if(id==2)
            str = str + '<font size="4" color="brown" id="a2b">点击[普通下载]按钮开始下载。</font>';
        else if(id==21)
            str = str + '<font size="4" color="brown" id="a2b">点击[免费下载]按钮开始下载。</font>';
        else if(id==22)
            str = str + '<font size="4" color="brown" id="a2b">点击[下载]按钮开始下载。</font>';

        else if(id==3)
            str = str + '<font size="4" color="darkred" id="a3b">点击[普通下载]按钮开始下载<br>不需要输入验证码！</font>';

        var top=150;
        var left=10;

        var obj1=document.querySelectorAll(Selector);//"div.pull-right"
        if(obj1!=null && obj1.length>0)
        {
            for(var i=0;i<obj1.length;i++)
            {
                if(obj1[i].innerHTML.indexOf(strText) > 0)
                {
                    top=getElementPageTop(obj1[i]);
                    left=getElementPageLeft(obj1[i]);
                    var lt=left+(obj1[i].clientWidth-300);
                    console.log(String(left)+","+String(lt));
                    left=lt;

                }
            }
        }

        var obj0=document.getElementById('sg_tip_482');
        //console.log(obj0);
        if(obj0==null)
        {
            console.log("floatTip left=" + String(left));
            var my = document.createElement("div");
            document.body.appendChild(my);
            my.style.backgroundColor="#fefcee";
            my.style.border="1px solid #dbdbdc"
            my.style.lineHeight= "normal";
            my.style.position="absolute";
            my.style.top=String(top)+"px";
            if(left==10)
                my.style.right="10px";
            else
                my.style.left=String(left)+"px";
            my.style.zIndex="999999999";
            my.style.padding="10px";
            my.innerHTML=str;
            my.id="sg_tip_482";
        }
        else
            obj0.innerHTML=str;
    }

    function inTip(id,Selector)
    {
        //console.log("inTip");
        var str='<font size="4" color="green">💫 收费网盘助手 💫<p>1.减少人工操作<br>2.过滤网盘大部分广告<br>3.快速跳过等待倒计时<br>4.不需要输入验证码（部分网盘）<br>5.没有破解VIP，网站各种限制还在</font><p><a href="http://www.popcat3.xyz" target=_blank><font  size="3" color="blue">http://www.popcat3.xyz<p></font></a>';
        if(id==0)
            str = str + '<font size="4" color="darkcyan" id="a0b">请等待……</font>';
        else if(id==1)
            str = str + '<font size="4" color="red" id="a1b">请根据页面提示，完成验证；</font>';

        else if(id==2)
            str = str + '<font size="4" color="brown" id="a2b">点击[普通下载]按钮开始下载。</font>';
        else if(id==21)
            str = str + '<font size="4" color="brown" id="a2b">点击[免费下载]按钮开始下载。</font>';
        else if(id==22)
            str = str + '<font size="4" color="brown" id="a2b">点击[下载]按钮开始下载。</font>';

        else if(id==3)
            str = str + '<font size="4" color="darkred" id="a3b">点击[普通下载]按钮开始下载<br>不需要输入验证码！</font>';
        else if(id==31)
            str = str + '<font size="4" color="darkred" id="a3b">点击[免费下载]按钮开始下载<br>不需要输入验证码！</font>';

        var obj1=document.querySelectorAll(Selector);//"div.package-download"
        if(obj1!=null && obj1.length>0)
        {
            for(var i=0;i<obj1.length;i++)
            {
                obj1[i].style.lineHeight= "normal";
                if((id==3 || id==31) && obj1[i].innerHTML.indexOf('a3b')<0)
                {
                    obj1[i].innerHTML=str;
                }
                if((id==2 || id==21 || id==22) && obj1[i].innerHTML.indexOf('a2b')<0)
                {
                    obj1[i].innerHTML=str;
                }

                if(id==1 && obj1[i].innerHTML.indexOf('a1b')<0)
                {
                    obj1[i].innerHTML=str;
                }
                if(id==0 && obj1[i].innerHTML.indexOf('a0b')<0)
                {
                    obj1[i].innerHTML=str;
                }
            }
        }
    }

    function setInnerHtml(Selector,html)
    {
        var obj1=document.querySelectorAll(Selector);//"div.package-download"
        if(obj1!=null && obj1.length>0)
        {
            for(var i=0;i<obj1.length;i++)
                obj1[i].innerHTML= '<font size="4" color="red">'+html+'</font>';
        }
    }

    function my_ads()
    {
        var k=0;
        var obj1=$('iframe');
        //console.log(obj1.length);
        var i=0;
        if(obj1 != null && obj1.length>0)
        {
            for(i=0;i<obj1.length;i++)
            {
                var str=obj1[i].getAttribute('src');
                //console.log(str);
                if(str != null && str.indexOf('/pagead/') != -1)
                {
                    obj1[i].removeAttribute('src');
                    obj1[i].setAttribute('display','none');
                    obj1[i].setAttribute('style','');
                    k++;
                    console.log("****ads***** " + k);
                }
            }
        }
        return k;
    }

    if(document.location.href.indexOf('xfpan') != -1 || document.location.href.indexOf('520-vip') != -1)
    {
        console.log("-----www.xfpan.cc-----");

        if(document.location.href.indexOf('/file') > 0)
        {
            $('#slow_button').click();
            clearInterval(timer1);
            redirectDownPage();
            inTip(0,"div.Dow_nr_r");
        }
        else if(document.location.href.indexOf('/down') > 0)
        {
            var myVar = setInterval(function(){
                var obj1=document.querySelector("#addr_list");
                if(obj1!=null)
                {
                    console.log(obj1.innerHTML.length);
                    console.log(obj1.innerHTML);
                    if(obj1.innerHTML.length<5)
                        inTip(1,"div.Dow_nr_r");
                    else
                    {
                        inTip(22,"div.Dow_nr_r");
                        inTip(22,"div.r336");
                        clearInterval(myVar);
                    }
                }

            }, 1000);
        }
    }
    else if(document.location.href.indexOf('xunniu') != -1 || document.location.href.indexOf('567file') != -1
            || document.location.href.indexOf('xueqiupan') != -1 || document.location.href.indexOf('46to') != -1
            || document.location.href.indexOf('ayunpan') != -1 || document.location.href.indexOf('ownfile') != -1)
    {
        if(document.location.href.indexOf('space_') >0)
           return;

        floatTip(0,"div.pull-right","icon-warning-sign");

        if(document.location.href.indexOf('/file-') > 0 || document.location.href.indexOf('/files/') > 0)
        {
            var myVar = setInterval(function(){
                var obj1=document.querySelector("#down_link");
                document.title=obj1.innerText.substring(7);
                console.log(obj1.innerHTML);
                if (obj1.innerHTML.indexOf('down') != -1)//下载页面
                {
                    var obj2=document.querySelector("#down_link > a");
                    obj2.removeAttribute('target');
                    obj2.click();
                    clearInterval(myVar);
                }
                else
                {
                    update_sec=null;
                    down_file_link();
                }
            }, 1000);
        }
        else if(document.location.href.indexOf('/down2-') > 0)
        {
            var myVar = setInterval(function(){
                var obj1=document.querySelector("#down_link > a");
                obj1.removeAttribute('target');
                console.log(obj1.innerText);
                obj1.click();
            }, 2000);
        }
        else if(document.location.href.indexOf('/down-') > 0 || document.location.href.indexOf('/down/') > 0)
        {
            var k=0;
            var myVar = setInterval(function(){
                //console.log("down_box");

                var obj0=document.getElementById('down_box');
                if(obj0!=null)
                {
                    var str3=obj0.getAttribute('style');
                    console.log(str3);
                    if(str3!=null && str3.indexOf('display') >= 0)
                        obj0.removeAttribute('style');
                }

                var obj9=null;
                var obj1=document.querySelector("#addr_list");
                if(obj1!=null)
                {
                    console.log(obj1.innerHTML);
                    if(obj1.innerHTML.indexOf('加载中') >= 0)
                    {
                        return;
                    }
                    var obj2 = obj1.getElementsByTagName('a');
                    console.log(obj2.length);
                    for (var i = 0; i < obj2.length; i++)
                    {
                        console.log(i);
                        var str1=obj2[i].getAttribute('onclick');
                        console.log(str1);
                        if(str1.indexOf('down_process') >= 0)
                            obj9=obj2[i];
                    }
                }
                else
                {
                    clearInterval(myVar);
                    setTimeout(alert("助手提示：\n发生错误，无法下载。"),200);
                    return;
                }

                if(obj9!=null)
                {
                    obj9.setAttribute('style','font-size:18px;color:#ff0000;');
                    var obj2=document.querySelector("body > div.navbar > div > div.container-fluid > a");
                    obj2.setAttribute('href',obj9.getAttribute('href'));
                    obj2.setAttribute('onclick',obj9.getAttribute('onclick'));

                    clearInterval(myVar);
                    //setTimeout(alert("助手提示：\n点击[普通下载]按钮开始下载。"),1000);
                    floatTip(3,"div.pull-right","icon-warning-sign");
                }
                else
                {
                    clearInterval(myVar);
                    setTimeout(alert("助手提示：\n发生错误，无法下载。"),1000);
                    return;
                }

            }, 1000);
        }
    }
    else if(document.location.href.indexOf('kufile') != -1)
    {
        console.log("-----www.kufile.net-----");

        inTip(1,"div.cright");

        var obj1=document.querySelector("#ptxz");
        if(obj1!=null)
        {
            var obj3=obj1.getAttribute('onclick');
            var p=obj3.indexOf('down');
            obj1.setAttribute('onclick','ck_code();'+obj3.substring(p));
            obj1.click();
        }

        var myVar = setInterval(function(){
            var obj1=document.querySelector("#ptxz");
            document.title=obj1.innerText;
        }, 1000);
    }
    else if(document.location.href.indexOf('yifile') > 0)
    {
        var b=0;
        var myVar = setInterval(function(){
            console.log(b);

            if(downtime>3)
            {
                inTip(0,"div.adfeed");
                downtime--;
            }
            var obj01=document.querySelector("#FVIEW > div.paylayer");
            obj01.setAttribute('style','display: none;');
            if(b==1)
            {
                var obj5=document.querySelector("#bootyz1");
                if(obj5!=null)
                {
                    var str1=obj5.getAttribute('style');
                    if(str1.indexOf('none')<0)
                    {
                        b=2;
                        //setTimeout(alert("助手提示：请输入验证码"),200);
                        inTip(1,"div.adfeed");
                    }
                }

            }
            var obj9=null;
            var obj1=document.querySelector("#FVIEW");
            if(obj1!=null)
            {
                //console.log(obj1.innerHTML);
                var obj2 = obj1.getElementsByTagName('a');
                for (var i = 0; i < obj2.length; i++)
                {
                    //console.log(i);
                    //console.log(obj2[i].innerHTML);
                    if(obj2[i].innerHTML.indexOf('普通下载') >= 0 && b==0)
                        obj9=obj2[i];
                    else if(obj2[i].innerHTML.indexOf('点击下载') >= 0 && b==2)
                        obj9=obj2[i];

                }
            }
            if(obj9!=null)
            {
                var obj3=obj9.getAttribute('onclick');
                var obj4=obj9.getAttribute('href');
                console.log(obj3);
                console.log(obj4);
                if(obj3 != null && obj3.indexOf('startWait')>=0 && b==0)
                {
                    b=1;
                    startWait();

                }
                else if(obj4 != null && obj4.indexOf('/file/')>=0 && b==2)
                {
                    b=3;
                    //obj9.click();
                    //self.location.href=obj4;
                    //$("#bootyz1").hide();
                    //$("#bootyz2").hide();
                    //$("#bootyz3").hide();
                    clearInterval(myVar);
                    setInnerHtml("div.adfeed","助手提示：<br>点击[点击下载]按钮开始下载<br>如果点击后没有开始下载，可以：<br>在按钮上点鼠标右键→[复制链接地址]，<br>然后到地址栏里点鼠标右键→[粘贴并转到]。");

                }

            }

        }, 1000);
    }
    else if(document.location.href.indexOf('rosefile') > 0)
    {
        var b=0;
        var myVar = setInterval(function(){
            console.log(b);
            var obj8=document.querySelector("#main > div:nth-child(1)");
            if(obj8!=null && obj8.innerHTML.length>1)
            {
                floatTip(0);
                obj8.innerHTML ="";
            }

            if(document.location.href.indexOf('/d/')<0)
            {
                var obj2=document.querySelector("#main > div:nth-child(2) > div:nth-child(4) > a > span");
                if(obj2!=null)
                {
                    if(obj2.innerHTML.length>10)
                        obj2.innerHTML = "请耐心等待";
                    else
                        obj2.innerHTML ="助手提示：正在进入下载页面";
                }
                if(b==0)
                {
                    console.log("******1****** startWait");
                    startWait();
                    b++;
                }
                else if(b==1)
                {
                    console.log("******2****** redirectDownPaeg");
                    redirectDownPage();
                    b++;
                }
            }
            else
            {
                if(b==0)
                {
                    console.log("******3****** check_code");
                    floatTip(1);
                    b++;
                }
                else
                {
                    var obj3=findAinBbyC("down_process","#addr_list","a");
                    if(obj3!=null)
                    {
                        console.log("******4******");
                        //setTimeout(alert("助手提示：\n点击[下载]按钮开始下载"),500);
                        floatTip(22);
                        clearInterval(myVar);

                        b=3;
                    }

                }
            }
        }, 500);
    }
    else if(document.location.href.indexOf('iycdn') > 0 || document.location.href.indexOf('dudujb') > 0)
    {
        var b=0;
        var myVar = setInterval(function(){
            console.log(b);
            inTip(0,"div.r");

            if(document.location.href.indexOf('file-')>0 && b==0)
            {
                update_sec=null;
                down_file_link();
                var obj2=document.querySelector("#down_link > a:nth-child(1)");
                obj2.removeAttribute('target');
                obj2.removeAttribute('onclick');
                obj2.click();
                b=1;
            }
            else if(document.location.href.indexOf('down-')>0 && b==1)
            {
                document.getElementById('down_box').style.display ='';
                document.getElementById('down_box2').style.display ='none';
                var str=getSubStr(document.location.href,'-','.html');
                console.log(str);
                load_down_addr2(str);
                b=2;
            }
            else if(document.location.href.indexOf('down-')>0 && b==2)
            {
                var obj2=document.querySelector("#down_box");
                console.log(obj2.innerHTML);
                if(obj2.innerHTML.indexOf('下载文件')>0)
                {
                    setTimeout(alert("助手提示：网页提示错误，等10分钟后再试。"),200);
                    clearInterval(myVar);
                }
                else if(obj2.innerHTML.indexOf('免费下载')>0)
                {
                    //setTimeout(alert("助手提示：\n点击[免费下载]按钮开始下载，不需要输入验证码。"),200);
                    inTip(31,"div.r");
                    clearInterval(myVar);
                }
            }
            else
                b++;
        }, 500);
    }
    else if(document.location.href.indexOf('dufile') > 0)
    {
        var b=0;
        var myVar = setInterval(function(){
            var obj1=document.querySelector("#interval_div");
            if(obj1!=null)
            {
                //console.log(obj1.innerHTML);
                if(obj1.innerHTML.indexOf('您已经达到时段内下载限制')>=0)
                {
                    console.log("******0******");
                    //console.log("助手提示：网页提示下载限制，等几分钟后再试。");
                    var obj4=document.querySelector("#right_prem");
                    if(obj4!=null)
                        obj4.innerHTML ="<div style='background: #fefcee !important;'><font size='4' color='green'>网页提示下载限制<br>请等几分钟后再试</font></div>";

                    return;
                }
            }
            console.log(b);
            if(document.location.href.indexOf('/file/')>0 && b<1)
            {
                inTip(0,"div.right_prem");
                console.log("******1******");
                updateTime=null;
                redirectDownPage();
                b=1;
            }
            else if(document.location.href.indexOf('/down/')>0 && b<2)
            {
                inTip(1,"div.bluebox");

                var obj2=document.querySelector("#downbtn");
                if(obj2!=null)
                {
                    var str1=obj2.getAttribute('style');
                    //console.log(obj2.innerHTML);
                    //console.log(str1);
                    if(str1.length<5)
                    {
                        console.log("******2******");
                        doDownload();
                        b=2;
                    }
                }

            }
            else if(document.location.href.indexOf('/down/')>0 && b<3)
            {
                console.log(b);
                var obj2=document.querySelector("#frmDialog");
                if(obj2!=null)
                {
                    console.log(obj2.innerHTML);
                    var obj3=document.querySelector("#show_down");//iframe
                    if(obj3!=null)
                    {
                        var obj4=obj3.contentWindow.document.getElementById('downs')
                        console.log(obj4.getAttribute('href'));
                        b=3;
                        var obj9=obj3.contentWindow.document.querySelectorAll("div.ggao");
                        if(obj9!=null && obj9.length>0)
                        {
                            console.log("******3******");
                            setTimeout(alert("助手提示：\n点击[普通下载]按钮开始下载"),200);
                            clearInterval(myVar);
                        }
                    }

                }
            }
        }, 1000);
    }
    else if(document.location.href.indexOf('77file') > 0)
    {
        var b=0;
        var myVar = setInterval(function(){
            console.log(b);
            if(document.location.href.indexOf('/s/')> 0 && b<1)
            {
                inTip(0,"div.fb_r");
                console.log("******1******");
                updateTime=null;
                redirectDownPage();
                b=1;
            }
            else if(document.location.href.indexOf('/down/')>0 && b<2)
            {
                inTip(1,"div.fb_r");
                var obj0=document.getElementById('s1');
                //console.log(obj0);
                if(obj0!=null)
                {
                    obj0.setAttribute('onclick','check_code();');
                }

                var obj2=document.querySelector("#addr_list");
                if(obj2!=null)
                {
                    var str1=obj2.innerHTML;
                    console.log(str1);
                    if(str1.indexOf('下载')>0)
                    {
                        console.log("******2******");
                        b=2;
                    }
                }

            }
            else if(document.location.href.indexOf('/down/')>0 && b<3)
            {
                var obj3=findAinBbyC("下载","#addr_list","a");
                if(obj3!=null)
                {
                    console.log("******3******");
                    inTip(22,"div.fb_r");
                    clearInterval(myVar);

                    b=3;
                }

            }
        }, 1000);
    }
    else if(document.location.href.indexOf('xywpan') > 0  || document.location.href.indexOf('xywp1') > 0 ||  document.location.href.indexOf('rarclouds') > 0)
    {
        var b=0;
        var myVar = setInterval(function(){
            console.log(b);
            inTip(0,"div.package-type");

            if(document.location.href.indexOf('/fs/')>0)
            {
                if(b<=0)
                    redirectDownPage();
                else if(b<=1)
                    window.location = $("#slow_button").data('href');
                b++;
            }
            else if(document.location.href.indexOf('/down/')>0)
            {
                var obj1=document.querySelectorAll("div.package-download");
                if(obj1!=null && obj1.length>0 && b<=2)
                {
                    for(var i=0;i<obj1.length;i++)
                    {
                        if(obj1[i].innerHTML.indexOf("举报")>0)
                        {
                            console.log(obj1[i].innerHTML);
                            var s1=obj1[i].innerHTML;
                            var p1=s1.indexOf('file_id=');
                            if(p1>0)
                            {
                                var p2=s1.indexOf("'",p1);
                                var s2=s1.substring(p1+8,p2);
                                console.log(s2);
                                load_down_addr5(s2);
                                b=3;
                            }
                        }
                    }
                }
                else if(b==3)
                {
                    clearInterval(myVar);
                    inTip(21,"div.package-type");
                }

            }

        }, 500);
    }
    else if(document.location.href.indexOf('katfile') > 0)
    {
        var b=0;
        var myVar = setInterval(function(){
            console.log(b);

            var obj1=document.querySelectorAll("div.alert.alert-danger");
            if(obj1!=null && obj1.length>0)
            {
                for(var i=0;i<obj1.length;i++)
                {
                    var str1=obj1[i].getAttribute('style');
                    console.log(str1);
                    if(str1.indexOf('block') > 0)
                    {
                        b=9;
                        clearInterval(myVar);
                        setTimeout(alert("助手提示：\n网页提示下载限制，等几分钟后再试。"),200);
                        return;
                    }
                }
            }
            if(b==0)
            {
                var obj1=document.querySelector("#freebtn");
                if(obj1!=null)
                {
                    obj1.click();
                    b=1;
                }
            }
            else if(b==1)
            {
                floatTip(0);

                b=2;
            }
            else if(b==2)
            {
                //setTimeout(alert("助手提示：\n请根据网页提示完成验证，验证完成点[传送]"),200);
                floatTip(1);
                b=3;
            }

            if(b==0)
            {
                var obj2=document.querySelector("#dlink");
                if(obj2!=null)
                {
                    var str2=obj2.getAttribute('href');
                    if(str2.length>10)
                    {
                        //setTimeout(alert("助手提示：\n点[下载]开始下载文件"),200);
                        floatTip(22);
                        b=4;
                        clearInterval(myVar);
                    }
                }
            }

        }, 500);
    }
    else if(document.location.href.indexOf('expfile') > 0)
    {
        var b=0;
        var myVar = setInterval(function(){
            console.log(b);

            var obj1=document.querySelectorAll("div.alert.alert-danger");
            if(obj1!=null && obj1.length>0)
            {
                for(var i=0;i<obj1.length;i++)
                {
                    var str1=obj1[i].getAttribute('style');
                    console.log(str1);
                    if(str1.indexOf('block') > 0)
                    {
                        b=9;
                        clearInterval(myVar);
                        setTimeout(alert("助手提示：\n网页提示下载限制，等几分钟后再试。"),200);
                        return;
                    }
                }
            }
            if(document.location.href.indexOf('/down2-')>0 && b==0)
            {
                var obj1=document.querySelector("#wait_span");
                if(obj1!=null)
                {
                    console.log(obj1.innerText);
                    b=1;
                    update_sec=null;
                    update_sec2=null;
                    down_file_link();
                }
            }
            else if(document.location.href.indexOf('/down-')>0 && b<3)
            {
                var obj2=document.querySelector("#addr_list");
                if(obj2!=null)
                    console.log(obj2);
                else
                    return;

                document.getElementById('down_box').style.display ='';
                document.getElementById('down_box2').style.display ='none';

                inTip(3,"#vipdownload");

                b++;
            }
            if(b>=3)
                clearInterval(myVar);

        }, 500);
    }
    else if(document.location.href.indexOf('koalaclouds') > 0)
    {
        inTip(0,"div.top-advert");
        var m=0;

        var myVar = setInterval(function(){
            if('undefined' == typeof(seconds)) return;
            if(seconds!=null)
            {
                //console.log(seconds);
                if(m==0)
                    m=seconds;
                if(m==seconds)
                {
                    triggerFreeDownload();
                }
                else if(seconds<0)
                {
                    setTimeout(alert("助手提示：\n点[立即下载]开始下载文件"),200);
                    clearInterval(myVar);
                }
            }
        }, 1000);
    }
    else if(document.location.href.indexOf('skyfileos') > 0)
    {
        var b=0;
        var myVar = setInterval(function(){
            console.log(b);
            var obj1=findAinB("慢速下载","table");
            if(obj1 != null)
            {
                floatTip(0,"div.download-page","你还需要 ");
                if(started == false)
                {
                    console.log("******1******");
                    triggerFreeDownload();
                }
                else if(seconds<=0)
                {
                    var obj2=findAinB("立即下载","a.btn");
                    if(obj2!=null)
                    {
                        console.log("******2******");
                        obj2.click();
                    }

                }
            }

            var obj1=findAinB("立即下载","a.btn.btn--primary");
            if(obj1 != null)
            {
                if(started == false)
                {
                    console.log("******3******");
                    obj1.click();
                }
            }

            if(b==0)
            {
                var obj1=document.querySelectorAll("div.input-group");
                if(obj1!=null && obj1.length>0)
                {
                    console.log("******4******");
                    b=1;
                    //setTimeout(alert("助手提示：\n请输入验证码，然后点[继续]开始下载文件"),200);
                    floatTip(1,"div.download-page","recaptcha");
                }
                var obj2=findAinB("下载","button");
                if(obj2!=null)
                {
                    console.log("******5******");
                    b=2;
                    //setTimeout(alert("助手提示：\n请点[下载]开始下载文件"),200);
                    floatTip(22,"div.advert-wrapper","");
                    var obj3=document.querySelectorAll("section");
                    if(obj3!=null && obj3.length>0)
                    {
                        for(var i=0;i<obj3.length;i++)
                            obj3[i].setAttribute('style','display: none;');
                    }
                }

            }


        }, 1000);
    }
    else if(document.location.href.indexOf('pan.baidu.com') > 0)
    {
        var str='<font size="3" color="green">💫 收费网盘助手 💫</font><p><br><p><font  size="2" color="green">百度网盘高速下载软件与教程<br>2023-3-31最新版</font><p><a href="http://www.xunniufile.com/space_popdog0_20031.html" target=_blank><font  size="2" color="blue">点击下载<p></font></a>';
        var obj0=document.getElementById('sg_tip_482');
        if(obj0==null)
        {
            var my = document.createElement("div");
            document.body.appendChild(my);
            my.style.backgroundColor="#fefcee";
            my.style.border="1px solid #dbdbdc"
            my.style.lineHeight= "normal";
            my.style.position="absolute";
            my.style.top="120px";
            my.style.right="20px";
            my.style.zIndex="999999999";
            my.style.padding="10px";
            my.innerHTML=str;
            my.id="sg_tip_482";
        }
        else
            obj0.innerHTML=str;
    }

    var myVar1 = setInterval(function(){if(my_ads()==0) clearInterval(myVar1);}, 1000);

})();
