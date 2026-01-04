// ==UserScript==
// @name         div cursor demo🔧
// @description  div follow cursor demo
// @namespace    div_cursor
// @author       Covenant
// @version      1.0.6
// @license      MIT
// @homepage
// @match        *://*/*
// @exclude      file:///*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAOVBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADMzMwAAACmpqY6Ojq6urp9fX1QUFCUlJQbGxs9xjm/AAAACnRSTlMACqKHwVaUN/PaZCFdUwAAAXxJREFUWMPt2NuOgyAQBmBRhBHk+P4PuwJtNgrCYHeTXvBfNenkywBeDEzTyONwRkFeApTxPoWsm7zJtvZ0c8tECt3VCrIaQDa1pnLrtAjZY+JP7Wz6DyXx2I9NyhkKVqQAs7q4P0aIMiSEifuEOK+Lk0FJWlENWVGDhMW0FBvSdUiHmtYusWtDBSi2xBoQPWpcC3JHEW1AcF2Z2I1S5gyFtUEDCssXZ0gdOUMiVA3oq6H8+B9C+Qc5oK+HdHD0H0BBujgPoUIGNKABDej/oXw+KgQzH4VZdG9BO2IapZfhuBiDGP2WbBgtJAyjC2I89i3IIyZ2AtlYmyUMtUBaE/t8VKk6pI6SuX05kq2WHGbwf52bb+0QbTupJVs/Mom6jTJZ+5biJYthnIlsFSld+wgKel9Gb9cF6Gt2knx2ds73OW9JqhPllOx1fp8QvDVhONK7sb73+eC146z8eMDI1BtOc4by6Un4fHrbgPkZk14BFrodGmx0Wck08ll+AGC5Y59UZba/AAAAAElFTkSuQmCC
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/456340/div%20cursor%20demo%F0%9F%94%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/456340/div%20cursor%20demo%F0%9F%94%A7.meta.js
// ==/UserScript==
var style_div_cursor;
var ary_div=[];
var timeoutID_1;
var timeoutID_2;
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
if(document.body!=null){
    style_div_cursor=create_style("","gm_user_css_div_cursor",["user_gm_css","css_div_cursor"]);
    style_div_cursor.textContent+=`
.gm_cursor1, .gm_cursor2, .gm_cursor3{position:fixed;border-radius:50%;transform:translateX(-50%) translateY(-50%);pointer-events:none;left:-100px;top:50%;mix-blend-mode:difference;transition:all 300ms linear;z-index:9999999;cursor:pointer;color: #212529}
.gm_cursor1{background-color:#ffffff;height:0;width:0;z-index:9999999;border:8px solid;}
.gm_cursor2, .gm_cursor3{height:36px;width:36px;z-index:99998;transition:all .3s ease-out;}
.gm_cursor2.hover, .gm_cursor3.hover{transform:scale(2) translateX(-25%) translateY(-25%);border:none;}
.gm_cursor2{border:2px solid #ffffff;box-shadow:0 0 12px rgba(255,255,255,.2);}
.gm_cursor2.hover{background:white;box-shadow:0 0 0 rgba(255,255,255,.2);}\n`;
}
function create_div(class_name,is_appendChild,node,refNode){
    let div=create_node("div",class_name,is_appendChild,node,refNode);
    div.style.backgroundSize='contain';
    div.style.backgroundRepeat='no-repeat';
    div.lang='ja';
    return div;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    element.id="";
    /*if(Array.isArray(tagname)){
        element=document.createElement(tagname[0]);
        element.id=tagname[1];
    }else if(typeof tagname==='string'){element=document.createElement(tagname);}//*/
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(is_appendChild){node.appendChild(element);}else{node.insertBefore(element, refNode);}
    return element;
}
//console.log("break");
function main_01(){
    if(style_div_cursor.parentNode==undefined){
        console.log("style_div_cursor undefined");
        document.body.appendChild(style_div_cursor);
        document.body.appendChild(ary_div[0]);
        document.body.appendChild(ary_div[1]);
        document.body.appendChild(ary_div[2]);
        window.clearInterval(timeoutID_1);
    }
}
function main_02(){
    let anchor=document.querySelectorAll('a');
    let div_cursor=document.querySelectorAll('.hover-target');
    for(let i = 0; i < anchor.length; i++){
        for(let j = 0; j < div_cursor.length; j++){
            anchor[i].addEventListener('mouseenter', function(){div_cursor[j].classList.add('hover');});
            anchor[i].addEventListener('mouseleave', function(){div_cursor[j].classList.remove('hover');});
        }
    }
}
(function() {
    'use strict';
    if(document.body==null)return;
    if(document.querySelectorAll("#index_cursor1").length==0){
        ary_div[0]=create_div("gm_cursor1",true,document.body);
        ary_div[1]=create_div(["gm_cursor2","hover-target"],true,document.body);
        ary_div[2]=create_div(["gm_cursor3","hover-target"],true,document.body);
        let div_c1=ary_div[0];
        let div_c2=ary_div[1];
        let div_c3=ary_div[2];
        div_c1.id="gm_cursor1";
        div_c2.id="gm_cursor2";
        div_c3.id="gm_cursor3";
        timeoutID_1=window.setInterval(( () => main_01()), 1000);
        //move
        var x, y;
        // On mousemove use event.clientX and event.clientY to set the location of the div to the location of the cursor:
        window.addEventListener('mousemove', function(event){
            x = event.clientX;
            y = event.clientY;
            if ( typeof x !== 'undefined' ){
                div_c1.style.left=x+"px";div_c2.style.left=x+"px";div_c3.style.left=x+"px";
                div_c1.style.top=y+"px";div_c2.style.top=y+"px";div_c3.style.top=y+"px";
            }
        }, false);
        //anchor
        //document.addEventListener('DOMContentLoaded', function() {console.log("DOMContentLoaded div_cursor");main_02();});
        timeoutID_2=window.setInterval(( () => main_02() ), 1000);//bak
        window.setTimeout(( () => window.clearInterval(timeoutID_2) ), 30000);
    }
    /*jshint multistr: true */
})();
