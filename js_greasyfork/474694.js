// ==UserScript==
// @name         括号树图
// @description  支持括号格式思维导图
// @match        *://sketchviz.com/new
// @run-at document-body
// @grant unsafeWindow
// @version 0.0.1.20230906153610
// @namespace https://greasyfork.org/users/430517
// @downloadURL https://update.greasyfork.org/scripts/474694/%E6%8B%AC%E5%8F%B7%E6%A0%91%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/474694/%E6%8B%AC%E5%8F%B7%E6%A0%91%E5%9B%BE.meta.js
// ==/UserScript==

//onclick=()=>console.log(式=read(prompt('括号嵌套')||'1 (2 3) 4'),图(式))
const
read=cod=>{let tok=cod.split(/\s+|([()])/).filter(x=>!!x).values(),
par=s=>{let a=[],x;for(;(x=s())&&x!=')';)a.push(x=='('?par(s):x); return a}
return par(()=>tok.next().value)//^ 一般需配对。此省行数
},
图=t0=>{
  let sb=[],写=a=>{
    let x0=a[0],x; if(x0[0]!='_')for(x of a.slice(1))sb.push(`${x0}->${(x instanceof Array)?写(x):x}`)
    return x0
  };sb.push(写(t0));return sb.join('\n')
},
hook=(o,k,f)=>o[k]=f(o[k].bind(o));

let it=unsafeWindow, _1=1
hook(it,'fetch',f=>(url,c)=>(0>_1--)?0: (c=>{
  hook(editor.getSession().getDocument(),'getValue',f=>()=>`digraph G{${c[0]} ${图(read(f()))}[shape=${c[1]}}`); editor.setOptions({wrap:20,fontSize:20})
  hook(it,'updateGraph',f=>()=>c[2]?f() :0)
  it.onload=()=>it.$(".logo").removeAttr("href").click(ev=>ev.ctrlKey? (c[2]^=1) : c[3](prompt('Font,Node0')||'Sans,cds];rankdir=LR;') ); c[3]("Handlee,Mdiamond];")
})(["","",true, function(s){let[fnt,sty]=s.split(',',2);this[1]=sty;this[0]="graph,node,edge".split(',').map(k=>`${k} [fontname = ${fnt}]`).join('\n')}])
||f(url,c))