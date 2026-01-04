// ==UserScript==
// @name         社交网站会员登录功能破解
// @namespace    sunchaolive.github.io
// @version      0.1.1
// @description  破解付费功能
// @author       Chaochao
// @match        https://*.devcloudsoftware.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424884/%E7%A4%BE%E4%BA%A4%E7%BD%91%E7%AB%99%E4%BC%9A%E5%91%98%E7%99%BB%E5%BD%95%E5%8A%9F%E8%83%BD%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/424884/%E7%A4%BE%E4%BA%A4%E7%BD%91%E7%AB%99%E4%BC%9A%E5%91%98%E7%99%BB%E5%BD%95%E5%8A%9F%E8%83%BD%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

function crack(){
    var crackContents = getClass('dashboard','overlay');
    for(var i=0;i < crackContents.length; i++)
    {
       crackContents[i].remove();
    }
    var buttons=getClass('dashboard','btn-primary');
     for(var j=0;j < buttons.length; j++)
    {
       buttons[j].remove();
    }

}

function getClass(tagName,className) //获得标签名为tagName,类名className的元素
{
    if(document.getElementsByClassName) //支持这个函数
    {
        return document.getElementsByClassName(className);
    }
    else
    {
        var tags=document.getElementsById(tagName);//获取标签
        var tagArr=[];//用于返回类名为className的元素
        for(var i=0;i < tags.length; i++)
        {
            if(tags[i].class == className)
            {
                tagArr[tagArr.length] = tags[i];//保存满足条件的元素
            }
        }
        return tagArr;
    }

}
onload=crack();
onclick=crack();