// ==UserScript==
// @name         河北省2023培训那个,自动批阅作业
// @namespace    http://tampermonkey.net/
// @version      2024-04-09
// @description  自动批阅
// @author       You
// @match        http://cas.study.yanxiu.jsyxsq.com/proj/counsellor/task/markNew*
// @match        http://cas.study.yanxiu.jsyxsq.com/proj/counsellor/task/mark_new.htm*
// @match        http://cas.study.yanxiu.jsyxsq.com/proj/counsellor/task/taskListNew*
// @match        http://cas.study.yanxiu.jsyxsq.com/proj/counsellor/task/detialNew*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jsyxsq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496230/%E6%B2%B3%E5%8C%97%E7%9C%812023%E5%9F%B9%E8%AE%AD%E9%82%A3%E4%B8%AA%2C%E8%87%AA%E5%8A%A8%E6%89%B9%E9%98%85%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/496230/%E6%B2%B3%E5%8C%97%E7%9C%812023%E5%9F%B9%E8%AE%AD%E9%82%A3%E4%B8%AA%2C%E8%87%AA%E5%8A%A8%E6%89%B9%E9%98%85%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //选择良好
    function pingfen() {
        // 要执行的代码
        document.querySelector("body > div.content.zbparDetail > div.right > div.main > div.zypy_box.bor.p20.mt10 > div:nth-child(1) > div > input[type=radio]:nth-child(5)").checked = true;

    }
    //提交评价
    function pingfen2() {
        // 要执行的代码
        let b= document.querySelector("#btn_mark");
        if(b)
        {
            b.click();
            return true;
        }
        return false;

    }
    //返回作业列表页
    function fanhui()
    {
        var prev = document.querySelector("li.last").previousElementSibling.querySelector("a");
        prev.click();
    }
    //点击去批阅
    function qupiyue()
    {
        document.querySelector("#hdjg_content > div.hdjg_list_warp.clear > div.hdjg_list_r.fr.clear > div.hdjq_xx_zt.fr > a").click();
    }
    //打开未批阅
    function dakaizuoye()
    {
        document.querySelector("body > div.content.zbparDetail > div.right > div.main > div.kcxx_list > div.sx_box > p:nth-child(1) > span:nth-child(4) > a").click();

    }
    //点击 批阅
    function dakaizuoye2()
    {
        var link = document.querySelector("#con_resault_link li.sx_boxTx > a");
        var title = link.textContent || link.innerText;
        if (title === "提醒") {
            window.location.reload();
        }
        else{
            link.click();
        }

    }
    if(location.href.indexOf("http://cas.study.yanxiu.jsyxsq.com/proj/counsellor/task/markNew")==0)
    {
        setTimeout(pingfen, 5000);
         setTimeout(pingfen2, 7000);


    }
    else if(location.href.indexOf("http://cas.study.yanxiu.jsyxsq.com/proj/counsellor/task/mark_new")==0)
    {
          setTimeout(pingfen, 5000);
         setTimeout(pingfen2, 7000);
       // setTimeout( fanhui , 5000);
    }
    else if(location.href.indexOf("http://cas.study.yanxiu.jsyxsq.com/proj/counsellor/task/taskListNew")==0)
    {
        setTimeout( qupiyue , 5000);
    }
    else if(location.href.indexOf("http://cas.study.yanxiu.jsyxsq.com/proj/counsellor/task/detialNew")==0)
    {
        setTimeout( dakaizuoye , 5000);
        setTimeout( dakaizuoye2 , 10000);
    }



    // Your code here...
})();