// jshint esversion: 6
// eslint-disable-next-line
// ==UserScript==
// @name         ball4phone
// @namespace    https://dniness.github.io/
// @name:zh-CN   红裤衩の悬浮球
// @version      2.30
// @description  一个用于手机浏览器<自定义函数>的悬浮球。💚点击:选择并运行自定义js函数。💙拖拽:forward前进。💜长按:选中页面dom并进行处理后回显
// @author       Dniness
// @match        *://*/*
// @icon         data:image/svg+xml,<svg width='64' height='64' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='32' cy='32' r='32' fill='darkslateblue'/></svg>
// @grant        none
// @run-at       document-body
// @license      MPL2.0
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/451848/ball4phone.user.js
// @updateURL https://update.greasyfork.org/scripts/451848/ball4phone.meta.js
// ==/UserScript==

'use strict';
(function($ball={
    // Your code here...
    Enter(){return this&&this.textContent},
    a(){alert('a')},
    A(){alert('a+shift')},
    $(){this.x$test.error},
    z(){this&&this.appendChild(this.firstElementChild)},
    w(x){return (x.pop().background='pink')&&'<a href="//Dniness.github.io/customization">a link test</a>'},
    ' '(){return `blank space

        // OR,you could set Dniness.ball while document-start`},
    //your code here end
    ready(){
        location.origin.startsWith('https://m.')&&
            (document.body.style.zoom=2.25)},
}) {
    customElements.define(this, class extends HTMLElement {
        constructor() {
            super();
            let pwd = document.createElement("div")
            Object.assign(pwd.$ball=$ball,(window.Dniness||'').ball);
            let shadow = this.attachShadow({mode: 'closed'});
            window.addEventListener("popstate",pwd.$p=$=>{
                $=$&&document.elementFromPoint(8,8);
                ($||'').Dniness$ball&&$.Run(null);
            },pwd.Dniness$ball=true);
            !(pwd.Run={
                _($,$_){
                    this.style = this.defaultStyle;
                    //this.style.opacity=1;
                    try{
                        $=($||0).nextSibling==this?null:$==this?this:
                        ($&&this.$ball[$]||this.$p).call(this.active,$_=[this.style]);
                    }catch(e){
                        $='[ERROR]:\r\r'+(e.message||e);
                        this.style.color=$_="darkred";
                    }
                    this.active = undefined;
                    this.textContent="\n";
                    (this.previousSibling||this).style.display=
                        this.style.display='block';
                    $_=($_||0).length?"innerText":"innerHTML";
                    if($===undefined){
                        this.focus();
                        this.style.display='none';
                    }else if($===null){
                        this.style.opacity=1/11;
                    }else if($===this){
                        this.style.opacity=0.2;
                        this.previousSibling.style.display='none';
                    }else{
                        this[$_]+="don't use back key:\n\n"+
                            $.toString().replace(/[\r\n]+/g,"\n");
                        ($_=this.style).opacity=$_.opacity<0.3?0.3:$_.opacity;
                    }
                },
                on:e=>{pwd['on'+e[0]]=new Function((e.pop()+'').slice(4,-1).replace(/\$/g,'this'))},
                $:e=>e[0].replace('$','-')+':'+e[1],
            })._.call(pwd,'ready');
            pwd.onmouseup = function(e){
                if(this.style.opacity==0.2){
                    this.Run(this);
                    this.style.display='none';
                    e=document.elementFromPoint(e.clientX,e.clientY);
                    if(e.tagName=='IFRAME'&&e.src){
                        this.Run(null);
                        location.replace(e.src);
                    }else{
                        this.Run(this.previousSibling);
                        while(!'BODY.DIV.CODE'.includes(e.tagName)||!e.childElementCount){
                            e=e.parentElement;
                        }
                        this.active=e;
                        this.previousSibling.focus();
                    }
                }else this.Run(null);
            };
            pwd.defaultStyle=Object.entries({
                top:0,
                left:0,
                width:'100%',
                height:'100%',
                position:'fixed',
                font$weight:'bold',
                font$size:'4vw',
                line$height:'4vw',
                white$space:'pre-wrap',
                word$wrap:'break-word',
                overflow:'auto',
                border:'none',
                text$align:'left',
                background:'darkslateblue',
                color:'white',
                caret$color:'transparent',
                position:'Fixed',
                z$index:9<<9,
                opacity:1
            }).map(pwd.Run.$).join(';');

            //main ball
            pwd = [shadow.appendChild(document.createElement("input")),shadow.appendChild(pwd)];
            pwd[0].Run = pwd.pop().Run;
            (pwd = pwd.pop()).style=
                Object.entries({
                bottom:'5%',
                right:'2%',
                width:'6vh',
                height:'6vh',
                border$radius:'50%',
                border:'none',
                text$align:'center',
                background:'darkslateblue',
                color:'white',
                caret$color:'transparent',
                position:'Fixed',
                z$index:(9<<9)+9,
                opacity:1/4,
                font:'bold 3vh SANS-SERIF'
            }).map(pwd.Run.$).join(';');

            Object.entries({
                focus:$=>{$.type='password';$.value=~8},
                blur:$=>{$.type='text';$.value='Ctrl'},
                keyup:$=>{$.Run($)($);$.blur()},
                keydown:$=>{$.value=1-$.value},
                mousedown:$=>{clearTimeout($.rto);$.asyncRun($.rto=0,$);},
                touchend:$=>{$.rto=$.rto||setTimeout($.forward,500,$)},
                contextmenu:$=>{$.asyncRun($,$.nextSibling);return false}
            }).forEach(pwd.Run.on);
            pwd.nextSibling.Run=pwd.Run._;
            pwd.Run=c=>c[c.value[1]?'asyncRun':'jumpTop'];//jumpTop = key(back)
            pwd.jumpTop=a=>{(a=a.style).bottom=(8+a.bottom).slice(~3-~a.bottom[1])};
            pwd.asyncRun=(e,x)=>(e||x).nextSibling.Run(x||e.value[2]||'Enter');
            pwd.forward=o=>{o.blur();history.forward();o.rto=0};
            shadow=pwd=$ball=!pwd.onblur();
        }
    });
    document.body.appendChild(document.createElement(this))
}).call('dniness-ball');
