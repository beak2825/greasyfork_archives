// ==UserScript==
// @name         洛谷主页任务计划难度显示
// @version      0.4
// @description  主页任务计划难度显示
// @match        https://www.luogu.com.cn$
// @author       MlkMathew
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/479451/%E6%B4%9B%E8%B0%B7%E4%B8%BB%E9%A1%B5%E4%BB%BB%E5%8A%A1%E8%AE%A1%E5%88%92%E9%9A%BE%E5%BA%A6%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/479451/%E6%B4%9B%E8%B0%B7%E4%B8%BB%E9%A1%B5%E4%BB%BB%E5%8A%A1%E8%AE%A1%E5%88%92%E9%9A%BE%E5%BA%A6%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var col=['rgb(191,191,191)','rgb(254,76,97)','rgb(243,156,17)','rgb(255,193,22)','rgb(82,196,26)','rgb(52,152,219)','rgb(157,61,207)','rgb(14,29,105)'];
    function Sleep(ms){
        const target=Date.now()+Number(ms);
        while(target>Date.now());
    }
    function topic_id(href){
        for(let i=0;i<href.length;i++)
        {
            if(href.substr(i,7)=='problem'){
                return href.substr(i+8);
            }
        }
    }
    const catch_data=(uid)=>{
        if(GM_getValue("catch"+uid)){
            console.log(uid,'已爬取数据');
            return ;
        }
        $.get("https://www.luogu.com.cn/user/"+uid+"?_contentOnly=1",function(res){
            const pb=res.currentData.passedProblems;
            for(let i=0;i<pb.length;i++)
            {
                GM_setValue(pb[i].pid,pb[i].difficulty+1);
            }
            GM_setValue("catch"+uid,true);
            Sleep(1000);
            console.log(uid,'爬取数据成功');
        }).fail(function () {
            Sleep(1000);
            console.log(uid,'爬取数据失败');
        });
        catch_data(uid);
    }
    const work=(x)=>{
        var id=topic_id(x.href);
        var dif=GM_getValue(id);
        if(dif){
            dif--;
            x.style.color=col[dif];
            return ;
        }
        else{
            console.log(id,' 获取数据中');
        }
        $.get(x.href+"?_contentOnly=1",function(res){
            console.log(res);
            for(let i=0;i<res.length;i++)
            {
                if(res.substr(i,10)=="difficulty"){
                    dif=res[i+12]-'0';
                    break;
                }
            }
            x.style.color=col[dif];
            GM_setValue(id,dif+1);
            Sleep(300);
            console.log(id,' 获取数据成功');
        }).fail(function () {
            work(x);
            Sleep(300);
            console.log(id,' 获取数据失败');
        });
    }
    const s=document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").childNodes;
    for(let i=0;i<s.length;i++)
    {
        if(s[i].className=='tasklist-item'){
            work(s[i].childNodes[1].lastChild);
        }
    }
})();