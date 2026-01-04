// ==UserScript==
// @name         百度贴吧增强——【花生米】
// @namespace    http://www.popcat3.xyz/
// @version      1.0
// @description  百度贴吧增强；去广告、自动签到、免除重定向直接跳转到目标链接、搜索楼主全部贴子
// @author       HuaShengMi
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js

// @match        *://tieba.baidu.com/*

// @license    GPL-3.0-only
// @grant    GM_setClipboard
// @grant    GM_getValue
// @grant    GM_setValue
// @run-at       document-end
// @compatible	 Chrome
// @downloadURL https://update.greasyfork.org/scripts/471683/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%A2%9E%E5%BC%BA%E2%80%94%E2%80%94%E3%80%90%E8%8A%B1%E7%94%9F%E7%B1%B3%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/471683/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%A2%9E%E5%BC%BA%E2%80%94%E2%80%94%E3%80%90%E8%8A%B1%E7%94%9F%E7%B1%B3%E3%80%91.meta.js
// ==/UserScript==
/* eslint-disable no-redeclare */
/* eslint-disable no-undef */

(function() {
    'use strict';
    var titleStr='';

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

    var myVar = setInterval(function(){
        my_ads();
        $('#aside-ad').css('display','none');

        var obj9=document.querySelectorAll("div.clearfix");
        var i=0;
        if(obj9!=null && obj9.length>0)
        {
            for(i=0;i<obj9.length;i++)
                if(obj9[i].innerHTML.indexOf('j_click_close') != -1 && obj9[i].innerHTML.indexOf('j_click_stats') != -1)
                    obj9[i].style.display = "none";
        }

        var obj8=document.querySelectorAll("div");
        if(obj8!=null && obj8.length>0)
        {
            for(i=0;i<obj8.length;i++)
                if(obj8[i].id.indexOf('mediago-tb-frs-list-') != -1)
                    obj8[i].style.display = "none";

        }
        var obj3=document.querySelectorAll("a");
        if(obj3!=null && obj3.length>0)
        {
            for(i=0;i<obj3.length;i++)
            {
                if(obj3[i].href.indexOf('/safecheck/') != -1)
                    obj3[i].href=obj3[i].innerText;
                if(obj3[i].className.indexOf('card_title_fname') != -1)
                {
                    var str2=obj3[i].innerText;
                    titleStr=str2.substring(0,str2.length-1);
                    //console.log("****ttt***** [" + titleStr+"]");
                }
            }
        }

        //----------dialogJclose
        var var1=document.querySelectorAll("div.dialogJ.passportDialog.dialogJfix.dialogJshadow");
        if(var1!=null && var1.length>0)
        {
            var var2=var1[0].querySelector('a.dialogJclose');
            if(var2!=null)
            {
                var2.click();
            }
        }
        //----------


    }, 1000);

    setTimeout(function(){
        var obj6 = document.querySelector('a.focus_btn.cancel_focus');
        var obj5 = document.querySelector('a[title="签到完成"]');
        var obj7 = document.querySelector('a[title="签到"]');
        if(obj5==null && obj6!=null && obj7!=null)
        {
            obj7.click();
            setTimeout(() => {
                var obj4=document.querySelectorAll("div.j_succ_info.sign_succ1");
                if(obj4!=null && obj4.length>0)
                    obj4[0].style.display = "none";
            }, 1000);
        }
        var seastr='';
        var obj10 = document.querySelectorAll('div.d_author');
        if(obj10!=null && obj10.length>0)
        {
            for(var i=0;i<obj10.length;i++)
            {
                var obj11 = obj10[i].querySelectorAll('div.louzhubiaoshi_wrap');
                if(obj11==null || obj11.length==0)
                    continue;
                else
                {
                    var obj12 = obj10[i].querySelector('li.d_name');
                    if(obj12!=null)
                        seastr= obj12.innerText;
                }
            }
        }

        var obj1 = document.querySelector('ul.nav_list.j_nav_list');
        //console.log(obj1.innerText);
        if(document.location.href.indexOf('/p/') != -1 && obj1!=null && seastr.length>1 && titleStr.length>1)
        {
            const newLi = document.createElement('li');
            newLi.classList.add('j_tbnav_tab');
            const newLink = document.createElement('a');
            newLink.href = 'https://tieba.baidu.com/f/search/res?ie=utf-8&kw='+titleStr+'&qw='+seastr;
            newLink.textContent = '搜索楼主全部贴子';

            newLink.target = '_blank';
            newLi.appendChild(newLink);
            obj1.appendChild(newLi);
        }

    }, 1500);
})();
