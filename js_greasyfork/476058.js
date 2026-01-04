// ==UserScript==
// @name         洛谷练习情况搜索
// @description  搜索洛谷练习情况
// @match        https://www.luogu.com.cn/user/*
// @exclude      https://www.luogu.com.cn/user/notification
// @exclude      https://www.luogu.com.cn/user/notification*
// @version      0.3
// @author       MlkMathew
// @license      MIT
// @grant        none
// @namespace    https://greasyfork.org/users/1068192
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/476058/%E6%B4%9B%E8%B0%B7%E7%BB%83%E4%B9%A0%E6%83%85%E5%86%B5%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/476058/%E6%B4%9B%E8%B0%B7%E7%BB%83%E4%B9%A0%E6%83%85%E5%86%B5%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var gs = function(name,def='') {
        if(localStorage['lg-ac-comparator-s-'+name]) return localStorage['lg-ac-comparator-s-'+name];
        return def;
    }
    var currData = null;
    var myData = null;
    $.get('?_contentOnly=1',function(e){
        var button = document.createElement('div');
        button.style.backgroundColor = '#fff';
        button.style.boxShadow = '0 1px 3px rgba(26,26,26,.1)'
        button.style.padding = '1.3em'
        $('.side').append(button);
        ;var h3Text = document.createElement('h3');
        h3Text.style.fontWeight = 'normal'
        h3Text.style.fontSize = '1.125em'
        h3Text.style.marginTop = '0'
        h3Text.style.marginBottom = '.5em'
        h3Text.style.fontFamily = 'inherit'
        h3Text.style.lineHeight = '1.2'
        h3Text.innerText = '搜索用户练习情况'
        button.append(h3Text);
        var btn = document.createElement('button');
        btn.style = 'border-color: #3085d6;border-width: 1px;background-color: #3085d6;border-radius: 5px;color: white;box-shadow: none;';
        btn.innerText = '搜索';
        var inp=document.createElement('input');
        inp.placeholder='标题或题目编号';
        inp.type='text';
        button.appendChild(inp);
        button.appendChild(btn);
        var sub_txt=document.createElement('h3');
        sub_txt.className='lfe-h3';
        sub_txt.textContent='尝试过的题目';
        var acc_txt=document.createElement('h3');
        acc_txt.className='lfe-h3';
        acc_txt.textContent='已通过的题目';
        var br=document.createElement('br');
        btn.onclick = () => {
            var sub=document.querySelector('#app > div.main-container > main > div > div.full-container > section.main > div:nth-child(2) > div.problems');
            var acc=document.querySelector('#app > div.main-container > main > div > div.full-container > section.main > div:nth-child(3)');
            const ch=button.childNodes;
            for(let i=ch.length-1;i>=0;i--)
            {
                if(ch[i]!=inp&&ch[i]!=btn&&ch[i]!=h3Text){
                    ch[i].remove();
                }
            }
            var now=button.children[1].value;
            const s=document.querySelectorAll('a');
            var sub_flg=false,acc_flg=false;
            var Sub,Acc;
            for(let i=0;i<s.length;i++)
            {
                if(!s[i].href.match('problem')){
                    continue;
                }
                if(s[i].title.match(now)||s[i].textContent.match(now)){
                    var cpy=s[i].parentNode.cloneNode(true);
                    var Br=br.cloneNode(true);
                    if(s[i].parentNode.parentNode==sub){
                        if(!sub_flg){
                            sub_flg=true;
                            Sub=sub_txt.cloneNode(true);
                            button.appendChild(Sub);
                        }
                        else{
                            Sub.after(Br);
                            Sub=Br;
                        }
                        Sub.after(cpy);
                        Sub=cpy;
                    }
                    if(s[i].parentNode.parentNode.parentNode.parentNode==acc){
                        if(!acc_flg){
                            acc_flg=true;
                            Acc=acc_txt.cloneNode(true);
                            button.appendChild(Acc);
                        }
                        else{
                            Acc.after(Br);
                            Acc=Br;
                        }
                        Acc.after(cpy);
                        Acc=cpy;
                    }
                }
            }
        }
    })
})();