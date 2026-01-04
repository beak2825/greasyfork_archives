// ==UserScript==
// @name         LOJ Super Copy for FPP
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  对于 FPP，实现 loj 题面的一键复制。注：需要手动填入测试点数量、tag
// @author       You
// @match        https://loj.ac/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=loj.ac
// @grant        none
// @license      GNU GPL v3
// @downloadURL https://update.greasyfork.org/scripts/490466/LOJ%20Super%20Copy%20for%20FPP.user.js
// @updateURL https://update.greasyfork.org/scripts/490466/LOJ%20Super%20Copy%20for%20FPP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function copy(text){
        let input = document.createElement('textarea');
        input.setAttribute('id', 'input_for_copyText');
        input.value = text;
        document.getElementsByTagName('body')[0].appendChild(input);
        document.getElementById('input_for_copyText').select();
        document.execCommand('copy');
        document.getElementById('input_for_copyText').remove();
    }
    function f(str, latex=1){
        if(latex == 1){
            for(let i=0; i<str.length; i++){
                if(str[i] == "\\"){
                    if(str.substr(i,9) == "\\leqslant") str = str.substr(0,i)+"≤"+str.substr(i+9);
                    else if(str.substr(i,4) == "\\leq") str = str.substr(0,i)+"≤"+str.substr(i+4);
                    else if(str.substr(i,4) == "\\sim") str = str.substr(0,i)+"~"+str.substr(i+4);
                    else if(str.substr(i,3) == "\\le") str = str.substr(0,i)+"≤"+str.substr(i+3);
                    else if(str.substr(i,3) == "\\ne") str = str.substr(0,i)+"≠"+str.substr(i+3);
                    else if(str.substr(i,2) == "\\%") str = str.substr(0,i)+"%"+str.substr(i+2);
                    else if(str.substr(i,6) == "\\times") str = str.substr(0,i)+"*"+str.substr(i+6);
                    else if(str.substr(i,6) == "\\lvert" || str.substr(i,6) == "\\rvert") str = str.substr(0,i)+"|"+str.substr(i+6);
                    else if(str.substr(i,6) == "\\cdots") str = str.substr(0,i)+"..."+str.substr(i+6);
                }
            }
        }
        let str2="";
        for(let i=0; i<str.length; i++){
            if(str[i] == "\n")str2 += "\\n\\r";
            else str2 += str[i];
        }
        return str2;
    }
    /*
struct node{
	std::string title,task,sample_in,sample_out,put,show;
	int Ti,Text;
	bool Spj;
	unsigned long long tag;
};
    */
    function copymain(node){ // 传入 _leftContainer_1rcs8_1 对象
        let s1="",s2="",s3=[],s4=[],s5="",s6=""; // fpp 1-6 项
        s1 = f(node.parentNode.parentNode.firstChild.firstChild.firstChild.firstChild.innerText); // 题目
        for(let i=1; i<node.children.length; i+=2){
            if(node.children[i].innerText == "题目描述"){
                s2 += f(node.children[i+1].innerText);
            }
            else if(node.children[i].innerText == "输入格式"){
                if(s5 != "") s5 += "\\n\\r";
                s5 += "输入："+f(node.children[i+1].innerText);
            }
            else if(node.children[i].innerText == "输出格式"){
                if(s5 != "") s5 += "\\n\\r";
                s5 += "输出："+f(node.children[i+1].innerText);
            }
            else if(node.children[i].innerText == "数据范围与提示"){
                s6 += f(node.children[i+1].innerText);
            }
            else {
                s3.push(f(node.children[i+1].firstChild.children[0].children[1].innerText, 0)); // 样例输入
                s4.push(f(node.children[i+1].firstChild.children[1].children[1].innerText, 0)); // 样例输出
            }
        }
        let tmp="";
        if(s3.length == 1){
            tmp = "\""+s3[0]+"\",\n\""+s4[0]+"\",\n";
        }else{
            tmp += "\"";
            for(let i=0; i<s3.length; i++){
                tmp += "样例"+(i+1)+"：\\n\\r"+s3[i];
            }
            tmp += "\",\n";
            tmp += "\"";
            for(let i=0; i<s4.length; i++){
                tmp += "样例"+(i+1)+"：\\n\\r"+s4[i];
            }
            tmp += "\",\n";
        }
        let timelim = document.getElementsByClassName("clock icon")[0].parentNode.childNodes[1].textContent;
        while(timelim[timelim.length-1] == 'm' || timelim[timelim.length-1] == 's' || timelim[timelim.length-1] == ' ') timelim = timelim.substr(0,timelim.length-1);
        let spj=0;
        if(document.getElementsByClassName("ui violet label").length == 1) spj=1;
        copy("{\n\""+s1+"\",\n\""+s2+"\",\n"+tmp+"\""+s5+"\",\n\""+s6+"\n"+timelim+",*,"+spj+",*\n}");
    }
    setInterval(function(){
        let a = document.getElementsByClassName("_leftContainer_1rcs8_1")[0];
        if(a.firstChild.tagName != "BUTTON"){
            let b = document.createElement("button");
            b.innerText = "复制";
            b.style.marginLeft = "20px";
            b.onclick = function(s){copymain(this.parentNode);}
            a.insertBefore(b,a.firstChild);
        }
    },100);
})();