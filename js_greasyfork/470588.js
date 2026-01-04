// ==UserScript==
// @name         GDFZOJ返回列表
// @version      1.3
// @description  增加返回列表按钮
// @author       MlkMathew
// @match        *://*.gdfzoj.com*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/470588/GDFZOJ%E8%BF%94%E5%9B%9E%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/470588/GDFZOJ%E8%BF%94%E5%9B%9E%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var webs=window.location.href,id='',str;
    function get_last_id(nam){
        var dig=1,res=0;
        for(let i=nam.length-1;i>=0;i--)
        {
            if(nam[i]=='/'){
                break;
            }
            res+=dig*(nam[i]-'0');
            dig*=10;
        }
        return res;
    }
    function get(pid,tim){
        if(tim>5){
            return ;
        }
        $.get("http://www.gdfzoj.com:23380/exercise/"+pid,function(res){
            console.clear();
            console.log('exercise',pid,'success to catch data');
            for(let i=0;i+6<res.length;i++)
            {
                if(res.substr(i,7)=='problem'){
                    var id='';
                    for(let j=i+8;j<res.length;j++)
                    {
                        if(res[j]=='"'){
                            break;
                        }
                        id+=res[j];
                    }
                    if(id==''){
                        continue;
                    }
                    GM_setValue(id,pid);
                }
            }
        }).fail(function () {
            get(pid,tim+1);
            console.clear();
            console.log('exercise',pid,'failed to catch data');
        });
    }
    function get_exercise(num){
        console.log('catch data number:',num);
        for(let i=1;i<=num;i++)
        {
            get(i,0);
        }
    }
    if(!webs.substr(7,webs.length-8).match('/')){
        let but=document.createElement("a");
        but.className="btn btn-primary btn";
        but.textContent="爬取题单";
        but.style.color="rgb(255,255,255)";
        document.querySelector("#UOJnavbars > ul:nth-child(2) > li.nav-item.dropdown").insertAdjacentElement("beforebegin",but);
        but.onclick=function(){
            let txt=document.createElement("a");
            txt.textContent="正在爬取数据中...";
            but.insertAdjacentElement("afterend",txt);
            setTimeout(()=>{
                get_exercise(500);
                console.clear();
                console.log("success to catch data");
                txt.remove();
            },100);
        }
        return ;
    }
    const s=document.querySelectorAll('a');
    if(webs.match('exercise')||webs.match('problems$')){
        for(let i=0;i<s.length;i++)
        {
            if(s[i].href.match('problem/')){
                GM_setValue(get_last_id(s[i].href),get_last_id(webs));
            }
        }
    }
    if(webs.match('problem/')&&(!webs.match('contest/'))){
        var x;
        const t=document.querySelectorAll('ul');
        for(let i=0;i<t.length;i++)
        {
            if(t[i].role=='tablist'){
                x=t[i];
            }
        }
        var add=document.createElement("li");
        add.className="nav-item";
        var y;
        for(let i=0;i<s.length;i++)
        {
            if(s[i].textContent==' 提交'){
                y=s[i].cloneNode(true);
            }
        }
        y.textContent=' 返回列表';
        y.dataset.toggle='';
        y.href="http://www.gdfzoj.com:23380/exercise/"+GM_getValue(get_last_id(webs)).toString();
        add.insertAdjacentElement("beforeend",y);
        x.insertAdjacentElement("beforeend",add);
    }
})();