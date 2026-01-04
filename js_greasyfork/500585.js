// ==UserScript==
// @name         洛谷双击跳题
// @version      0.4
// @description  仿exlg双击跳题
// @match        https://www.luogu.com.cn*
// @match        https://www.luogu.com.cn/*
// @match        *://*.gdfzoj.com*/*
// @match        *://*
// @match        *://*/*
// @author       MlkMathew
// @license      MIT
// @grant        none
// @namespace    https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/500585/%E6%B4%9B%E8%B0%B7%E5%8F%8C%E5%87%BB%E8%B7%B3%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/500585/%E6%B4%9B%E8%B0%B7%E5%8F%8C%E5%87%BB%E8%B7%B3%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var web=location.href;
    function number(s){
        let res=0;
        for(let i=0;i<s.length;i++)
        {
            if(s[i]<'0'||s[i]>'9'){
                return -1;
            }
            res=res*10+(s[i]-'0');
        }
        return res;
    }
    function letter(c){
        if('a'<=c&&c<='z'){
            return String.fromCharCode(c.charCodeAt()-97+65);
        }
        return c;
    }
    function prefix(s,pre){
        if(s.length<pre.length){
            return false;
        }
        for(let i=0;i<pre.length;i++)
        {
            if(letter(s[i])!=pre[i]){
                return false;
            }
        }
        return true;
    }
    function check(s){
        if(prefix(s,"P")){
            return (number(s.substr(1,s.length-1))>=1000);
        }
        if(web.match("luogu.com.cn")&&prefix(s,"U")&&(!prefix(s,"UVA"))&&(!prefix(s,"UOJ"))){
            return (number(s.substr(1,s.length-1))>0);
        }
        if(web.match("luogu.com.cn")&&prefix(s,"T")){
            return (number(s.substr(1,s.length-1))>=100);
        }
        if(prefix(s,"B")){
            return (number(s.substr(1,s.length-1))>2000);
        }
        if(prefix(s,"CF")){
            if(('A'<=letter(s[s.length-2])&&letter(s[s.length-2])<='Z')&&(s[s.length-1]=='1'||s[s.length-1]=='2')){
                return (number(s.substr(2,s.length-4))>0);
            }
            if(('A'<=letter(s[s.length-1])&&letter(s[s.length-1])<='Z')){
                return (number(s.substr(2,s.length-3))>0);
            }
        }
        if(prefix(s,"AT")){
            return true;
        }
        if(prefix(s,"SP")){
            return (number(s.substr(2,s.length-2))>0);
        }
        if(prefix(s,"UVA")){
            return (number(s.substr(3,s.length-3))>=100);
        }
        if(prefix(s,"LOJ")){
            return (number(s.substr(3,s.length-3))>0);
        }
        if(prefix(s,"QOJ")){
            return (number(s.substr(3,s.length-3))>0);
        }
        if(prefix(s,"UOJ")){
            return (number(s.substr(3,s.length-3))>0);
        }
        if(prefix(s,"GYM")){
            return (number(s.substr(3,s.length-4))>0);
        }
        return false;
    }
    function dbclick()
    {
        let s="";
        if(window.getSelection){
            s=window.getSelection().toString();
        }
        else if(document.selection&&document.selection.createRange){
            s=document.selection.createRange().text;
        }
        while(s[s.length-1]==' ')
        {
            s=s.substr(0,s.length-1);
        }
        if(check(s)){
            if(prefix(s,"LOJ")){
                window.open("https://loj.ac/p/"+number(s.substr(3,s.length-3)));
            }
            else if(prefix(s,"QOJ")){
                window.open("https://qoj.ac/problem/"+number(s.substr(3,s.length-3)));
            }
            else if(prefix(s,"UOJ")){
                window.open("https://uoj.ac/problem/"+number(s.substr(3,s.length-3)));
            }
            else if(prefix(s,"GYM")){
                window.open("https://codeforces.com/gym/"+number(s.substr(3,s.length-4))+"/problem/"+s[s.length-1]);
            }
            else{
                window.open("https://www.luogu.com.cn/problem/"+s);
            }
        }
    }
    document.addEventListener('dblclick',dbclick);
})();