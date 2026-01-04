// ==UserScript==
// @name         贴吧清爽显示
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Yungs
// @match        *://tieba.baidu.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/31328/%E8%B4%B4%E5%90%A7%E6%B8%85%E7%88%BD%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/31328/%E8%B4%B4%E5%90%A7%E6%B8%85%E7%88%BD%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    var clickElementClassName = "";///鼠标点击的元素的Class名字
    var pageUrl = "tieba.baidu.com/f?kw";
    var currPageIndex="0";///当前是在第几页
    onmousedown = GetClickName;
    document.onload = Delay();
    function GetClickName(e)
    {
        if (e.button === 0)
        {
            var target = e.target;
            currPageIndex = document.getElementsByClassName("pagination-current pagination-item ")[0].innerText;
            if (target.toString().indexOf(pageUrl) > -1)
            {
                Delay();
            }
        }
    }
    function Delay()
    {
        setTimeout(removeContent,100);
    }
    function removeContent()
    {
        if (currPageIndex == document.getElementsByClassName("pagination-current pagination-item")[0].innerText)
        {
            Delay();
            return;
        }
        currPageIndex = document.getElementsByClassName("pagination-current pagination-item")[0].innerText;
        var classNames = document.getElementsByClassName("threadlist_detail clearfix");
        if(location.hostname.indexOf("tieba.baidu.com") > -1)
        {
            for(var i = 0;i < classNames.length;i++)
            {
                var p = classNames[i].parentNode.firstElementChild;
                //var con = p.firstElementChild.innerText;
                var cData = p.getElementsByClassName("pull-right is_show_create_time")[0].innerText;
                //p.firstElementChild.getElementsByClassName("j_th_tit")[0].innerText = "【" + cData + "】" + con.replace(" ","");
                var sp = document.createElement("span");
                sp.innerText="【" + cData + "】";
                if (cData.indexOf(":") > -1)
                {
                sp.style.color = "#FF33CC";
                }
                sp.style.fontWeight='bold';
                p.firstElementChild.insertBefore(sp,p.firstElementChild.firstElementChild);
                classNames[i].innerText = "";
            }
        }
    }
})();