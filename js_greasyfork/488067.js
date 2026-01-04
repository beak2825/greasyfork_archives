// ==UserScript==
// @name         GDFZOJ比赛Rating变幅
// @version      1.6
// @description  增加比赛Rating变幅
// @author       MlkMathew
// @match        *://*.gdfzoj.com*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/488067/GDFZOJ%E6%AF%94%E8%B5%9BRating%E5%8F%98%E5%B9%85.user.js
// @updateURL https://update.greasyfork.org/scripts/488067/GDFZOJ%E6%AF%94%E8%B5%9BRating%E5%8F%98%E5%B9%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.ajaxSettings.async=false;
    var webs=window.location.href;
    function to_str(x){
        var rev="",res="";
        while(x)
        {
            rev+=(x%10);
            x=Math.floor(x/10);
        }
        for(let i=rev.length-1;i>=0;i--)
        {
            res+=rev[i];
        }
        return res;
    }
    function get(pid,tim){
        if(tim>5){
            return ;
        }
        $.get("http://www.gdfzoj.com:23380/user/profile/"+pid,function(res){
            GM_setValue(pid+"data",1);
            console.clear();
            console.log('user',pid,'success to catch data');
            for(let i=0;i<res.length;i++)
            {
                if(res.substr(i,11)=='rating_data'){
                    i+=16;
                    var lstr=1500;
                    while(true)
                    {
                        var cnum=0,rnum=0;
                        let j=i;
                        while(res[j]!=',')j++;j++;j++;
                        while(res[j]!=',')
                        {
                            rnum=rnum*10+(res[j]-'0');
                            j++;
                        }
                        j++;j++;
                        while(res[j]!=',')
                        {
                            cnum=cnum*10+(res[j]-'0');
                            j++;
                        }
                        if(!cnum){
                            break;
                        }
                        // console.log('contest',cnum,'  rating:',rnum-lstr);
                        GM_setValue(pid+'l'+cnum,lstr);
                        GM_setValue(pid+'r'+cnum,rnum);
                        lstr=rnum;
                        while(res[i]!='\'')i++;i++;
                        while(res[i]!='\'')i++;i++;
                        while(res[i]!=']')i++;
                        if(res[i+2]!='['){
                            break;
                        }
                        i+=2;
                    }
                    break;
                }
            }
        }).fail(function () {
            get(pid,tim+1);
            console.clear();
            console.log('user',pid,'failed to catch data');
        });
    }
    function Get_user(page,tim){
        if(tim>5){
            return ;
        }
        $.get("http://www.gdfzoj.com:23380/ranklist?page="+page,function(res){
            console.clear();
            console.log('user page',page,'success to catch data');
            for(let i=0;i<res.length;i++)
            {
                if(res.substr(i,13)=='data-username'){
                    var nam='';
                    for(let j=i+15;j<res.length;j++)
                    {
                        if(res[j]=='"'){
                            break;
                        }
                        nam+=res[j];
                    }
                    get(nam,1);
                }
            }
        }).fail(function () {
            get(page,tim+1);
            console.clear();
            console.log('user page',page,'failed to catch data');
        });
    }
    function get_user(){
        Get_user(1,1);
        Get_user(2,1);
        Get_user(3,1);
        Get_user(4,1);
        Get_user(5,1);
    }
    if(!webs.substr(7,webs.length-8).match('/')){
        let but=document.createElement("a");
        but.className="btn btn-primary btn";
        but.textContent="爬取Rating变幅";
        but.style.color="rgb(255,255,255)";
        document.querySelector("#UOJnavbars > ul:nth-child(2) > li.nav-item.dropdown").insertAdjacentElement("beforebegin",but);
        but.onclick=function(){
            let txt=document.createElement("a");
            txt.textContent="正在爬取数据中...";
            but.insertAdjacentElement("afterend",txt);
            setTimeout(()=>{
                get_user();
                console.clear();
                console.log("success to catch data");
                txt.remove();
            },100);
        }
        return ;
    }
    if(webs.match("contest")&&webs.match("standings")){
        var but=document.createElement("a");
        but.className="btn btn-primary btn-sm";
        but.textContent="爬取Rating变幅";
        but.style.color="rgb(255,255,255)";
        var butf=document.querySelector("body > div.container > div.uoj-content > div:nth-child(2) > div:nth-child(1) > div > div.mb-2.text-right");
        butf.appendChild(but);
        var cnum=0;
        for(let i=0;i<webs.length;i++)
        {
            if(webs.substr(i,7)=="contest"){
                i+=8;
                while('0'<=webs[i]&&webs[i]<='9')
                {
                    cnum=cnum*10+(webs[i]-'0');
                    i++;
                }
                break;
            }
        }
        var s=document.querySelector("#standings-table > thead > tr");
        var y=s.children[1].cloneNode(true);
        y.textContent="Rating变幅";
        s.children[1].insertAdjacentElement("afterend",y);
        var all=document.querySelector("#standings-table > tbody");
        const S=all.children;
        var Pid=[];
        for(let i=0;i<S.length;i++)
        {
            let nams=S[i].children[1].children[0].href;
            let pid="";
            for(let j=0;j<nams.length;j++)
            {
                if(nams.substr(j,7)=="profile"){
                    j+=8;
                    while(j<nams.length)
                    {
                        pid+=nams[j];
                        j++;
                    }
                    break;
                }
            }
            Pid.push(pid);
            if(GM_getValue(pid+"data")!=1){
                get(pid,1);
            }
        }
        function clear(){
            for(let i=0;i<S.length;i++)
            {
                S[i].children[2].remove();
            }
        }
        function display(){
            for(let i=0;i<S.length;i++)
            {
                let now=S[i].children[1].children[0].cloneNode(true);
                let nams=S[i].children[1].children[0].href;
                let pid="";
                let fat=S[i].children[0].cloneNode(true);
                fat.textContent="";
                for(let j=0;j<nams.length;j++)
                {
                    if(nams.substr(j,7)=="profile"){
                        j+=8;
                        while(j<nams.length)
                        {
                            pid+=nams[j];
                            j++;
                        }
                        break;
                    }
                }
                let l=GM_getValue(pid+'l'+cnum),r=GM_getValue(pid+'r'+cnum);
                if(l==r){
                    now.style.color="rgb(0,0,0)";
                    now.textContent="无变幅";
                    now.removeAttribute("href");
                    now.removeAttribute("class");
                    fat.appendChild(now);
                    S[i].children[1].insertAdjacentElement("afterend",fat);
                    continue;
                }
                let cl=now.cloneNode(true),cr=now.cloneNode(true),cmid=now.cloneNode(true),arr=now.cloneNode(true);
                cl.textContent=l;
                cr.textContent=r;
                if(l<r){
                    cmid.textContent=" (+"+to_str(r-l)+")";
                }
                else{
                    cmid.textContent=" (-"+to_str(l-r)+")";
                }
                // cmid.style.color="rgb(0,0,0)";
                // cmid.removeAttribute("class");
                arr.textContent=" -> ";
                arr.style.color="rgb(0,0,0)";
                arr.removeAttribute("href");
                arr.removeAttribute("class");
                cmid.style.color=getColOfScore(r-l+50);
                cl.style.color=getColOfRating(l);
                cr.style.color=getColOfRating(r);
                cl.removeAttribute("href");
                cr.removeAttribute("href");
                cmid.removeAttribute("href");
                fat.appendChild(cl);
                fat.appendChild(arr);
                fat.appendChild(cr);
                fat.appendChild(cmid);
                fat.style.width="200px";
                S[i].children[1].insertAdjacentElement("afterend",fat);
            }
        }
        console.clear();
        console.log("success to catch data");
        display();
        but.onclick=function(){
            let txt=document.createElement("a");
            txt.textContent="正在爬取数据中...";
            butf.appendChild(txt);
            setTimeout(()=>{
                for(let i=0;i<Pid.length;i++)
                {
                    let pid=Pid[i];
                    get(pid,1);
                }
                console.clear();
                console.log("success to catch data");
                txt.textContent="爬取数据完成!";
                clear();
                display();
                txt.remove();
            },100);
        }
    }
})();