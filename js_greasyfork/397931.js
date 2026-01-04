// ==UserScript==
// @name         真白萌 土炮字体大小
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  土炮地替论坛新增字体大小选项
// @author       tony0815
// @match        *://masiro.moe/*
// @icon         https://i.loli.net/2019/11/27/fDjZnoEVxdWh2gP.jpg
// @namespace    https://greasyfork.org/users/239832
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397931/%E7%9C%9F%E7%99%BD%E8%90%8C%20%E5%9C%9F%E7%82%AE%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/397931/%E7%9C%9F%E7%99%BD%E8%90%8C%20%E5%9C%9F%E7%82%AE%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F.meta.js
// ==/UserScript==
function msr_fontsize_main(){
    //Extra CSS
    let style = document.createElement('style');
    style.innerHTML = `
    #threadstamp img {right: 255px;}
    .msr_fakebtn_font,.pi strong a.msr_fakebtn_font{border-color: #E6E6E6;cursor: pointer;}
    .msr_fakebtn_font:hover,.pi strong a.msr_fakebtn_font:hover{border-color: #B4B4B4;}
    .msr_fontsize_container{font-size: 16px;}
    .msr_fontsize_container>a{margin-right: 8px;}
    .msr_fontsize_big,
    .msr_fontsize_big .t_f,.msr_fontsize_big .t_f td,
    .plc .pi .message.msr_fontsize_big,.plc .pi .message.msr_fontsize_big .quote{font-size:22px;}
    .msr_fontsize_big font[size="7"]{font-size:70px;}
    .msr_fontsize_big font[size="6"]{font-size:46px;}
    .msr_fontsize_big font[size="5"]{font-size:35px;}
    .msr_fontsize_big font[size="4"]{font-size:26px;}
    .msr_fontsize_big font[size="3"]{font-size:23px;}
    .msr_fontsize_big font[size="2"]{font-size:19px;}
    .msr_fontsize_big font[size="1"]{font-size:14px;}
    .msr_fontsize_fat,
    .msr_fontsize_fat .t_f,.msr_fontsize_fat .t_f td,
    .plc .pi .message.msr_fontsize_fat,.plc .pi .message.msr_fontsize_fat .quote{font-size:30px;}
    .msr_fontsize_fat font[size="7"]{font-size:96px;}
    .msr_fontsize_fat font[size="6"]{font-size:64px;}
    .msr_fontsize_fat font[size="5"]{font-size:48px;}
    .msr_fontsize_fat font[size="4"]{font-size:36px;}
    .msr_fontsize_fat font[size="3"]{font-size:32px;}
    .msr_fontsize_fat font[size="2"]{font-size:26px;}
    .msr_fontsize_fat font[size="1"]{font-size:20px;}
    `;
    document.head.appendChild(style);
    function msr_fontsize_go(parent,typeclass){
        parent.classList.remove("msr_fontsize_","msr_fontsize_big","msr_fontsize_fat");
        parent.classList.add("msr_fontsize_"+typeclass);
        parent.querySelectorAll("font").forEach(inl_css => {
            if(inl_css.style.fontSize != ""){
                if(!inl_css.getAttribute("msr_font_base_size")){
                    inl_css.setAttribute("msr_font_base_size",inl_css.style.fontSize);
                }
                inl_css.style.fontSize = inl_css.getAttribute("msr_font_base_size").replace(/[\d\.]+/g,num=>{
                    if(typeclass == "") return num;
                    if(typeclass == "big") return parseInt(num)*1.5;
                    if(typeclass == "fat") return parseInt(num)*2;
                    return num;
                })
            }
        });
    }
    //main
    if (document.querySelector('td.plc>div.pi')){
        //PC
        document.querySelectorAll("td.plc>.pi>strong").forEach(item => {
            [{name:"肥",class:"fat"},{name:"大",class:"big"},{name:"一般",class:""}].forEach(type => {
                let obj = document.createElement("a");
                obj.setAttribute("class","msr_fakebtn_font");
                obj.appendChild( document.createTextNode(type.name) );
                obj.addEventListener('click',function(){
                    let body = this.parentNode.parentNode.parentNode.querySelector("div.pcb");
                    msr_fontsize_go(body,type.class);
                });
                item.appendChild(obj);
            });
        });
    }else if(document.querySelector('ul.authi')){
        //touch
        document.querySelectorAll("ul.authi").forEach(item => {
            let container = document.createElement("li");
            container.setAttribute("class","msr_fontsize_container");
            container.appendChild( document.createTextNode("字形大小：") );
            [{name:"一般",class:""},{name:"大",class:"big"},{name:"肥",class:"fat"}].forEach(type => {
                let obj = document.createElement("a");
                obj.setAttribute("class","msr_fakebtn_font blue");
                obj.appendChild( document.createTextNode(type.name) );
                obj.addEventListener('click',function(){
                    let body = this.parentNode.parentNode.parentNode.querySelector("div.message");
                    msr_fontsize_go(body,type.class);
                });
                container.appendChild(obj);
            });
            item.appendChild(container);
        });
    }else if(document.querySelector('div.bm_user')){
        //mobile
        document.querySelectorAll("div.pbody>div.mes").forEach(item => {
            let container = document.createElement("div");
            container.setAttribute("class","msr_fontsize_container bm_c");
            container.appendChild( document.createTextNode("字形大小：") );
            [{name:"一般",class:""},{name:"大",class:"big"},{name:"肥",class:"fat"}].forEach(type => {
                let obj = document.createElement("a");
                obj.setAttribute("class","msr_fakebtn_font blue");
                obj.appendChild( document.createTextNode(type.name) );
                obj.addEventListener('click',function(){
                    let body = this.parentNode.parentNode.querySelector("div.postmessage");
                    msr_fontsize_go(body,type.class);
                });
                container.appendChild(obj);
            });
            item.prepend( container );
        });
    }else{}
}
function msr_script_docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
msr_script_docReady(msr_fontsize_main());