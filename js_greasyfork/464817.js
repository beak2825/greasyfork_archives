// ==UserScript==
// @name         真实下载地址
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  真实下载地址；直接显示出下载网站的真实下载地址，避免陷入【安全下载】、【高速下载】以及各种【诱导下载】的陷阱。
// @author       HuaShengMi
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js

// @match        http://www.51xiazai.cn/soft/*.htm
// @match        https://mydown.yesky.com/pcsoft/*.html
// @match        https://www.onlinedown.net/soft/*.htm
// @match        http://www.downza.cn/soft/*.html
// @match        https://www.pcsoft.com.cn/soft/*.html
// @match        https://www.xitongzhijia.net/soft/*.html

// @match        https://www.jb51.net/softs/*.html
// @match        https://www.windowszj.net/pcsoft/*.html
// @match        http://www.winwin7.com/*.html
// @match        http://www.ddooo.com/softdown/*.htm

// @license    GPL-3.0-only
// @grant    GM_setClipboard
// @grant    GM_getValue
// @grant    GM_setValue
// @run-at       document-end
// @compatible	 Chrome
// @downloadURL https://update.greasyfork.org/scripts/464817/%E7%9C%9F%E5%AE%9E%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/464817/%E7%9C%9F%E5%AE%9E%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==
/* eslint-disable no-redeclare */
/* eslint-disable no-undef */

(function() {
    'use strict';
    console.log('-----title-----'+ document.title);
    console.log('-----href-----'+ document.location.href);


    var top=150;
    var left=10;
    var strTip='<font  size="3" color="black">没有找到真实下载地址，<br>强烈建议换个网站下载。<a href="http://www.popcat3.xyz" target=_blank><br><br>by 三只小猫</a></font>';
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
    function floatTip(x,y,strText)
    {
        var str='<div style="background-color: #008ee0; color: #ffffff !important;opacity: 1; width: 250px;height: 25px;line-height: 25px; border: 1px solid #dbdbdc;text-align:center;"><font size="4">真实下载地址<p></font></div>';
        str = str + '<div style="padding:10px;min-height: 50px;"><font size="3">'+strText+'</font></div>';

        var obj0=document.getElementById('sg_tip_4982');
        //console.log(obj0);
        if(obj0==null)
        {
            console.log("floatTip left=" + String(left));
            var my = document.createElement("div");
            document.body.appendChild(my);
            my.setAttribute("style", "display: flex; flex-wrap: wrap; justify-content: space-between;background-color: #fefce0;opacity: 1; width: 250px; border: 1px solid #dbdbdc;lineHeight:normal;position:absolute;z-index: 9999;");
            my.style.top=String(y)+"px";
            if(x==10)
                my.style.right="10px";
            else
                my.style.left=String(x)+"px";

            my.innerHTML=str;
            my.id="sg_tip_482";
        }
        else
            obj0.innerHTML=str;
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

    if(document.location.href.indexOf('.51xiazai.') != -1)
    {
        var obj1=document.querySelector("#down_url");
        if(obj1!=null)
            strTip=obj1.innerHTML;
        var obj2=document.querySelectorAll("div.right.soft_rightA");
        if(obj2!=null && obj2.length>0)
        {
            top=getElementPageTop(obj2[0]);
            left=getElementPageLeft(obj2[0]);
        }
    }
    else if(document.location.href.indexOf('.yesky.') != -1)
    {
        var obj1=document.querySelectorAll("div.pull-left.download_list");
        if(obj1!=null && obj1.length>0)
        {
            strTip=obj1[0].innerHTML;
        }

        var obj2=document.querySelectorAll("div.layout.newdown.jins");
        if(obj2!=null && obj2.length>0)
        {
            top=getElementPageTop(obj2[0]);
            left=getElementPageLeft(obj2[0]);
        }
    }
    else if(document.location.href.indexOf('.onlinedown.') != -1)
    {
        var obj9=document.querySelectorAll("div.down-list");
        if(obj9!=null && obj9.length>0)
        {
            var obj1=obj9[0].querySelectorAll("p.ellipse");
            if(obj1!=null && obj1.length>0)
            {
                strTip=obj1[1].innerHTML;
                var newStr = strTip.replace(/span/g, "p");
                var newStr = strTip.replace(/tubiao/g, "ttt");
                strTip=newStr;
                //console.log(strTip);
            }
        }
        var obj2=document.querySelectorAll("div.relevant-sw");
        if(obj2!=null && obj2.length>0)
        {
            top=getElementPageTop(obj2[0]);
            left=getElementPageLeft(obj2[0]);
        }
    }
    else if(document.location.href.indexOf('.downza.') != -1)
    {
        var obj9=document.querySelectorAll("div.down-item");
        if(obj9!=null && obj9.length>0)
        {
            var obj1=obj9[0].querySelectorAll("p.con");
            if(obj1!=null && obj1.length>0)
            {
                strTip=obj1[0].innerHTML;
                var newStr = strTip.replace(/span/g, "p");
                var newStr = strTip.replace(/tubiao/g, "ttt");
                strTip=newStr;
                //console.log(strTip);
            }
        }
        var obj2=document.querySelectorAll("div.pull-left.guess_abs_box");
        if(obj2!=null && obj2.length>0)
        {
            top=getElementPageTop(obj2[0]);
            left=getElementPageLeft(obj2[0]);
        }

    }
    else if(document.location.href.indexOf('.pcsoft.') != -1)
    {
        var obj9=document.querySelectorAll("dl.clearfix.qrcode_show.download_n");
        if(obj9!=null && obj9.length>0)
        {
            var obj1=obj9[0].querySelectorAll("dd");
            if(obj1!=null && obj1.length>0)
            {
                strTip=obj1[0].innerHTML;
                var newStr = strTip.replace(/span/g, "p");
                var newStr = strTip.replace(/tubiao/g, "ttt");
                strTip=newStr;
                //console.log(strTip);
            }
        }
        var obj2=document.querySelectorAll("div.list_rg.list_ltbox.zjbb_lb");
        if(obj2!=null && obj2.length>0)
        {
            top=getElementPageTop(obj2[0]);
            left=getElementPageLeft(obj2[0]);
        }

    }
    else if(document.location.href.indexOf('.xitongzhijia.') != -1)
    {
        var obj9=document.querySelectorAll("ul.media.fix");
        if(obj9!=null && obj9.length>0)
        {
            strTip=obj9[0].innerHTML;
            strTip=strTip.replace(/href="javascript:;"\s*o_h/g, 'h');
            //console.log(strTip);
        }
        var obj2=document.querySelectorAll("div.m-related-list.fl");
        if(obj2!=null && obj2.length>0)
        {
            top=getElementPageTop(obj2[0]);
            left=getElementPageLeft(obj2[0]);
        }

    }
    else if(document.location.href.indexOf('.jb51.') != -1)
    {
        var obj9=document.querySelectorAll("ul.ul_Address");
        if(obj9!=null && obj9.length>0)
        {
            strTip=obj9[0].innerHTML;
            //console.log(strTip);
        }
        var obj2=document.querySelector("#samesoft");
        if(obj2!=null)
        {
            top=getElementPageTop(obj2);
            left=getElementPageLeft(obj2)+100;
        }
    }
    else if(document.location.href.indexOf('.windowszj.') != -1)
    {
        var obj9=document.querySelectorAll("ul.media.fix");
        if(obj9!=null && obj9.length>0)
        {
            strTip=obj9[0].innerHTML;
            strTip=strTip.replace(/href="javascript:;"\s*data-h/g, 'h');
            //console.log(strTip);
        }
        var obj2=document.querySelectorAll("div.guess_abs_box.fl");
        if(obj2!=null && obj2.length>0)
        {
            top=getElementPageTop(obj2[0]);
            left=getElementPageLeft(obj2[0]);
        }
    }
    else if(document.location.href.indexOf('.winwin7.') != -1)
    {
        var obj9=document.querySelectorAll("div.dl_list_info");
        if(obj9!=null && obj9.length>0)
        {
            var obj1=obj9[0].querySelectorAll("dd");
            if(obj1!=null && obj1.length>0)
            {
                strTip=obj1[0].innerHTML;
                strTip=strTip.replace(/<a/g, '&nbsp;&nbsp;<a');
                console.log(strTip);
            }

        }
        var obj2=document.querySelectorAll("div.acleft");
        if(obj2!=null && obj2.length>0)
        {
            top=getElementPageTop(obj2[0]);
            left=getElementPageLeft(obj2[0]);
        }
    }
    else if(document.location.href.indexOf('.ddooo.') != -1)
    {
        var obj9=document.querySelectorAll("ul.pt_list");
        if(obj9!=null && obj9.length>0)
        {
            strTip=obj9[0].innerHTML;
            strTip=strTip.replace(/本地下载地址:/g, '');
            console.log(strTip);
        }
        var obj2=document.querySelectorAll("div.right");
        if(obj2!=null && obj2.length>0)
        {
            top=getElementPageTop(obj2[0]);
            left=getElementPageLeft(obj2[0]);
        }
    }





    floatTip(left,top,strTip);
    var myVar = setTimeout(function(){
        my_ads();

    }, 1000);


})();