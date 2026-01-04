// ==UserScript==
// @name         GDFZOJ题目404修补
// @version      1.3
// @description  比赛题目404修补
// @author       MlkMathew
// @match        *://*.gdfzoj.com*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/474956/GDFZOJ%E9%A2%98%E7%9B%AE404%E4%BF%AE%E8%A1%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/474956/GDFZOJ%E9%A2%98%E7%9B%AE404%E4%BF%AE%E8%A1%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var webs=window.location.href,id='',str;
    function get(pid,tim){
        if(tim>5){
            return ;
        }
        $.get("http://www.gdfzoj.com:23380/contest/"+pid,function(res){
            console.clear();
            console.log('contest',pid,'success to catch data');
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
            console.log('contest',pid,'failed to catch data');
        });
    }
    function get_contest(num){
        console.log('catch data number:',num);
        for(let i=1;i<=num;i++)
        {
            get(i,0);
        }
    }
    function get_contest_num(){
        $.get("http://www.gdfzoj.com:23380/contests",function(res){
            for(let i=0;i+7<res.length;i++)
            {
                if(res.substr(i,7)=='data-id'){
                    var id='';
                    for(let j=i+9;j<res.length;j++)
                    {
                        if(res[j]=='"'){
                            break;
                        }
                        id+=res[j];
                    }
                    if(id==''){
                        continue;
                    }
                    get_contest(id);
                    return ;
                }
            }
            return ;
        }).fail(function () {
            get_contest_num();
        });
    }
    if(!webs.substr(7,webs.length-8).match('/')){
        let but=document.createElement("a");
        but.className="btn btn-primary btn";
        but.textContent="爬取比赛";
        but.style.color="rgb(255,255,255)";
        document.querySelector("#UOJnavbars > ul:nth-child(2) > li.nav-item.dropdown").insertAdjacentElement("beforebegin",but);
        but.onclick=function(){
            let txt=document.createElement("a");
            txt.textContent="正在爬取数据中...";
            but.insertAdjacentElement("afterend",txt);
            setTimeout(()=>{
                get_contest_num();
                console.clear();
                console.log("success to catch data");
                txt.remove();
            },100);
        }
        return ;
    }
    for(let i=webs.length-1;i>=0;i--)
    {
        if('0'<=webs[i]&&webs[i]<='9'){
            id=webs[i]+id;
        }
        else{
            break;
        }
    }
    for(let j=7,cnt=0;j<webs.length;j++)
    {
        if(webs[j]=='/'){
            str=webs.substr(0,j);
            break;
        }
    }
    if(window.location.href.match('contest/')){
        var flag=true;
        const HREF=window.location.href;
        for(let i=HREF.length-1;i>=0;i--)
        {
            if(HREF[i]=='/'){
                if(HREF[i-1]!='t'||HREF[i-2]!='s'||HREF[i-3]!='e'||HREF[i-4]!='t'||HREF[i-5]!='n'||HREF[i-6]!='o'||HREF[i-7]!='c'){//contest
                    flag=false;
                }
                break;
            }
            if(!('0'<=HREF[i]&&HREF[i]<='9')){
                flag=false;
                break;
            }
        }
        if(flag){
            const s=document.querySelectorAll('a');
            for(let i=0;i<s.length;i++)
            {
                if(s[i].href.match('problem/')){
                    var now=s[i].href,res='';
                    for(let j=now.length-1;j>=0;j--)
                    {
                        if('0'<=now[j]&&now[j]<='9'){
                            res=now[j]+res;
                        }
                        else{
                            break;
                        }
                    }
                    GM_setValue(res,id);
                }
            }
        }
        return ;
    }
    const s=document.querySelectorAll('div');
    var flg=false;
    for(let i=0;i<s.length;i++)
    {
        if(s[i].textContent=='404'){
            flg=true;
        }
    }
    if(!flg){
        return ;
    }
    var contid=GM_getValue(id);
    location.href=str+'/contest/'+contid+'/problem/'+id;
})();