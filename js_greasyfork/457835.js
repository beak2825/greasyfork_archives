// ==UserScript==
// @name         gtaf Quick Navigation
// @description  bring back Quick Navigation
// @namespace    gtaforums_Quick_Navigation
// @author       Covenant
// @version      1.0.2
// @license      MIT
// @homepage
// @match        https://gtaforums.com/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAMQOAADEDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAJIAAADKAAAAtwAAAH4AAAB7AAAAgAAAAEcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAmAAAAPkAAAD/AAAA/wAAADUAAAAAAAAABQAAACsAAACYAAAAnQAAAA0AAAAAAAAAAAAAAAAAAAAJAAAAtwAAAOQAAABBAAAAlwAAAOkAAAAOAAAAAAAAAAAAAAAAAAAAGgAAAP8AAAC9AAAADwAAAAAAAAAAAAAAlAAAAPQAAABiAAAACAAAAAMAAAAnAAAAAQAAAAAAAAAAAAAAAAAAADAAAAD/AAAA8wAAAIkAAAABAAAANAAAAP8AAAC3AAAADAAAAF8AAAApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzAAAA/QAAAGkAAACiAAAARwAAAJAAAAD/AAAA9AAAABoAAACBAAAAgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQAAADYAAAAaAAAA5gAAAJ0AAADKAAAA/wAAAO4AAAAtAAAA4QAAAPUAAAC3AAAAJQAAAAAAAAAAAAAADgAAACAAAABOAAAAzwAAAP8AAADNAAAA6AAAAP8AAADrAAAAqQAAAP8AAAD/AAAA/gAAAC8AAAACAAAAgAAAAOgAAAD2AAAA/wAAAP8AAAD/AAAA5gAAANgAAAD+AAAA/wAAAP8AAAD/AAAA/wAAAL4AAAAAAAAAAQAAAO4AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAOoAAACIAAAAngAAAN8AAAD/AAAA5gAAAMcAAAC9AAAAQwAAAFgAAAD1AAAA+wAAAOUAAADzAAAA9AAAANAAAAC6AAAAcQAAADoAAAC1AAAA7QAAANYAAABnAAAA7gAAAL0AAAD2AAAA4AAAAMEAAABrAAAA8wAAAM0AAAAZAAAAYQAAADkAAABfAAAACgAAAJEAAADHAAAANAAAAJ8AAAANAAAAYwAAANYAAABsAAAAAAAAANsAAACNAAAAUwAAADkAAAADAAAAcwAAACQAAABoAAAAsQAAABUAAAAhAAAAAAAAAAYAAABSAAAAKQAAAAcAAAB3AAAATQAAAHUAAAAEAAAAAAAAABMAAAB4AAAATwAAAC0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAKgAAAG8AAAAWAAAAAAAAAAAAAAAAAAAAEgAAAHYAAABfAAAAHwAAAAMAAAAAAAAAAAAAAAAAAAAbAAAAWwAAAHAAAAAWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAG0AAABtAAAAbAAAAHMAAABxAAAAbQAAAD8AAAACAAAAAAAAAAAAAAAA+N/pEuHnxuzJ86Pzn/GQBp/19AQT/CzgEfh0+AGAC6IBgJIIAYC1N8QTDnLls0bM9/9+9v//7VX//8pX//9sCA==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      gtaforums.com
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/457835/gtaf%20Quick%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/457835/gtaf%20Quick%20Navigation.meta.js
// ==/UserScript==
var output;
function create_div(class_name,is_appendChild,node,refNode){
    let div=document.createElement("div");
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){div.classList.add(class_name[i]);}
    }
    else if(typeof class_name==='string'){div.classList.add(class_name);}
    div.style.backgroundSize='contain';
    div.style.backgroundRepeat='no-repeat';
    div.lang='ja';
    if(is_appendChild){
        node.appendChild(div);
    }
    else{node.insertBefore(div, refNode);}
    return div;
}
function create_a(text,url,class_name,is_appendChild,node,refNode){
    let anchor=document.createElement("a");
    anchor.href=url;
    anchor.innerText=text;
    anchor.title=text;
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){anchor.classList.add(class_name[i]);}
    }
    else if(typeof class_name==='string'){anchor.classList.add(class_name);}
    anchor.target="_blank";
    if(is_appendChild){
        node.appendChild(anchor);
    }
    else{node.insertBefore(anchor, refNode);}
    return anchor;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }
    else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(is_appendChild){
        node.appendChild(element);
    }
    else{node.insertBefore(element, refNode);}
    return element;
}
function viewportToPixels(value){//questions/34166341/
    var parts = value.match(/([0-9\.]+)(vh|vw)/);
    var q = Number(parts[1]);
    var side = window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(parts[2])]];
    return side * (q/100);
}
function fn_url(url){
    var str_url=new URL(url);
    var params=new URLSearchParams(str_url.search);
    return [str_url,params];
}
//console.log("break");
function fn_re_main_page(response){
    let dom=document.createRange().createContextualFragment(response.responseText);
    if(response.status==200){
        var ipsDataItem_main=dom.querySelectorAll('li>div.ipsDataItem_main');
        for(let i=0; i < ipsDataItem_main.length; i++){//GTA Online
            var ipsDataItem_title=ipsDataItem_main[i].querySelectorAll('h4>a')[0];
            let li_nav=create_node("li",[],true,output);
            li_nav.style.setProperty("font-family","Oswald");
            li_nav.style.setProperty("font-size","1.01rem");
            create_a(ipsDataItem_title.innerText,ipsDataItem_title.href,[],true,li_nav);
            console.log(ipsDataItem_title.innerText);
            var ipsDataItem_subList=ipsDataItem_main[i].querySelectorAll('ul>li>a');
            for(let j=0; j < ipsDataItem_subList.length; j++){//Content Creator
                let li_nav=create_node("li",[],true,output);
                create_a("　"+ipsDataItem_subList[j].innerText,ipsDataItem_subList[j].href,[],true,li_nav);
                console.log('--'+ipsDataItem_subList[j].innerText);
            }
        }
    }
    else{//
        console.log("avatar response.status: "+response.status+response.responseHeaders);
    }
}
function fn_XMLHttpRequest(url,fn){
    const xhr=new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4 && xhr.status==200){
            console.log([
                "xmlhttpRequest",
                url,
                xhr.status,
                xhr.statusText,
                xhr.readyState,
                xhr.getResponseHeader("Content-Type"),
                //response.responseText,
                xhr.finalUrl].join("\n")
            );
            fn(xhr);
        }
    };
}//*/
(function() {
    'use strict';
    let url=window.location.host;
    let ipsLayout_body=document.querySelectorAll('main#ipsLayout_body')[0];
    let div_ipsLayout_contentArea=document.querySelectorAll('#ipsLayout_contentArea')[0];
    let gtaf_leftNav=create_div([],false,ipsLayout_body,div_ipsLayout_contentArea);
    gtaf_leftNav.id="gtaf_leftNav";
    gtaf_leftNav.style.setProperty("position","absolute");
    gtaf_leftNav.style.setProperty("max-width","10%");
    let gtaf_leftNav_inner=create_div([],true,gtaf_leftNav);
    gtaf_leftNav_inner.style.setProperty("padding-top","400px");
    gtaf_leftNav_inner.id="gtaf_leftNav_inner";
    let ul_nav=create_node("ul",[],true,gtaf_leftNav_inner);
    output=ul_nav;
    fn_XMLHttpRequest("https://"+url,fn_re_main_page);
    //
    //
    /*var div_quickNav=document.querySelectorAll('#gtaf-quickNav-container')[0];
    var ol_quickNav=div_quickNav.querySelectorAll('#gtaf-quickNav')[0];
    div_quickNav.id="nav1";
    ol_quickNav.id="nav2";
    div_quickNav.style="position: absolute;";
    //*/
    //let tmp=320/viewportToPixels('100vw');console.log(tmp);
    div_ipsLayout_contentArea.style="margin-left: 10%;";//210px
})();