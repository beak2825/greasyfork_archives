// ==UserScript==
// @name         一键复制题目
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键复制题目1.0
// @author       anonymous
// @match        https://htedu.yunxuetang.cn/kng/#/course/*
// @match        https://htedu.yunxuetang.cn/kng/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545917/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E9%A2%98%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/545917/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E9%A2%98%E7%9B%AE.meta.js
// ==/UserScript==
(()=>{
let b=document.createElement('button');
b.innerHTML='复制题目';
b.style.cssText='position:fixed;top:10px;right:10px;z-index:9999;padding:8px;background:#007cff;color:white;border:none;border-radius:4px;cursor:pointer';
b.onclick=()=>{
let r=[],i=0,j=0;
[...document.querySelectorAll('#watermark div:nth-child(2) div.pb24.ph32>div')].forEach(d=>{let q=d.querySelector('span[data-rich-text="1"]'),o=[...d.querySelectorAll('label.yxtf-radio')].map(l=>l.querySelector('span.yxtulcdsdk-flex-shrink-0')?.textContent+l.querySelector('span[data-rich-text="1"]')?.innerHTML).filter(x=>x);q&&o.length&&r.push(`${++i}: ${q.innerHTML}\n${o.join('\n')}`)});
[...document.querySelectorAll('#watermark div:nth-child(3) div.pb24.ph32>div')].forEach(d=>{let q=d.querySelector('span[data-rich-text="1"]'),o=[...d.querySelectorAll('label.yxtf-radio .yxtf-radio__label')].map(l=>l.textContent.trim()).filter(x=>x);q&&o.length&&r.push(`${++j}: ${q.innerHTML}\n${o.join('/')}`)});
let t=r.join('\n\n')+'\n\n返回答案';
navigator.clipboard.writeText(t).catch(()=>{let ta=document.createElement('textarea');ta.value=t;document.body.append(ta);ta.select();document.execCommand('copy');ta.remove()});
b.innerHTML='已复制';setTimeout(()=>b.innerHTML='复制题目',1000);
};
document.body.append(b);
})()