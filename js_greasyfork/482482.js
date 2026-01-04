// ==UserScript==
// @name         巴哈姆特 - 讀取ary的上站日期
// @description  RT
// @namespace    homeindex_profile_login_date
// @author       Covenant
// @version      0.9.0.1
// @license      MIT
// @homepage
// @match        https://forum.gamer.com.tw/B.php?bsn=*
// @match        https://forum.gamer.com.tw/C.php?bsn=*
// @match        https://forum.gamer.com.tw/Co.php?bsn=*
// @icon         https://i2.bahamut.com.tw/icon/share-icon_bh.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      home.gamer.com.tw
// @connect      api.gamer.com.tw
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/482482/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E8%AE%80%E5%8F%96ary%E7%9A%84%E4%B8%8A%E7%AB%99%E6%97%A5%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/482482/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E8%AE%80%E5%8F%96ary%E7%9A%84%E4%B8%8A%E7%AB%99%E6%97%A5%E6%9C%9F.meta.js
// ==/UserScript==
const strIsNotFound=-1,strIsFoundFirst=0;
const ary=['copydog','qq45613a'];
const j_data="data",j_blocks="blocks",j_type="type",j_items="items",j_name="name",j_value="value";
function create_btn(innerText,class_name,is_appendChild,node,refNode){
    let btn=create_node_text("button",innerText,class_name,is_appendChild,node,refNode);
    return btn;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    element.id="";
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(node==undefined){node=document.body;}
    if(is_appendChild){node.appendChild(element);}
    else{
        if(refNode==undefined){node.insertBefore(element,node.firstChild);}else{node.insertBefore(element,refNode);}
    }return element;
}
function create_node_text(tagname,innerText,class_name,is_appendChild,node,refNode){
    let element=create_node(tagname,class_name,is_appendChild,node,refNode);
    element.innerText=innerText;
    element.lang='ja';
    return element;
}
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    return [obj_url,params];
}
function fn_gm_XMLHttpRequest(url,fn){
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers:{
            'content-type': 'text/html; charset=UTF-8',
            'user-agent':window.navigator.userAgent
        },
        onload: function (response){
            fn(response);
            /*console.log([
                "GM_xmlhttpRequest",
                response.status,
                response.statusText,
                response.readyState,
                response.responseHeaders,
                //response.responseText,
                response.finalUrl].join("\n")
            );//*/
        }
    });
}
function fn_XMLHttpRequest(url,fn){
    const xhr=new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4 && xhr.status==200){
            /*console.log([
                "xmlhttpRequest",
                url,
                xhr.status,
                xhr.statusText,
                xhr.readyState,
                xhr.getResponseHeader("Content-Type"),
                //response.responseText,
                xhr.responseURL].join("\n")
            );//*/
            fn(xhr);
        }
    };
}
//console.log("break");
function fn_output_text(node,text,is_addition_assignment){
    if(is_addition_assignment)node.innerText+=text;
    else{node.innerText=text;}
}
function fn_gm_re_homeindex(response){
    let dom=document.createRange().createContextualFragment(response.responseText);
    let url=fn_url(response.finalUrl);
    let output_FM_rbox14=document.querySelectorAll('div.FM-rbox14>p,div.FM-rbox14')[0];
    if(response.status==200){//這裡全部每次都要按照各種目標網頁格式重寫
        let str_userid=url[1].get('owner');
        let str_reg_date="";
        let str_login_date="";
        if(dom.querySelectorAll('div.frame').length==1){//div.frame訊息
            create_node('br',[],true,output_FM_rbox14);
            create_node_text("span",str_userid+"被永A，或是系統忙碌",["mono"],true,output_FM_rbox14);
            window.setTimeout(( ()=>{
                fn_gm_XMLHttpRequest("https://api.gamer.com.tw/home/v1/block_list.php?userid="+str_userid,fn_gm_re_api_block_list);
            }),250);
            return;
        }
        if(url[0].pathname=="/homeindex.php"){//舊版小屋
            let li_BH_list1=dom.querySelectorAll('div.BH-list1>ul>li');
            for(let i=0; i<li_BH_list1.length; i++){
                if(li_BH_list1[i].innerText.search("上站日期")==strIsFoundFirst){str_login_date=li_BH_list1[i].innerText;}
                if(li_BH_list1[i].innerText.search("註冊日期")==strIsFoundFirst){str_reg_date=li_BH_list1[i].innerText;}
            }
            create_node('br',[],true,output_FM_rbox14);
            if(str_reg_date!=""){
                let span_log=create_node_text("span",str_userid+": "+str_login_date,["code"],true,output_FM_rbox14);
                span_log.title=str_userid+str_reg_date;
            }else{
                create_node_text("span",str_userid+"隱藏了個人紀錄",["mono"],true,output_FM_rbox14);
            }
        }else if(url[0].pathname=="/profile/index.php"){//新版小屋
            create_node('br',[],true,output_FM_rbox14);
            let span_log=create_node_text("span",str_userid+": ",["code"],true,output_FM_rbox14);
            span_log.title="新版小屋";
            window.setTimeout(( ()=>{
                fn_gm_XMLHttpRequest("https://api.gamer.com.tw/home/v1/block_list.php?userid="+str_userid,fn_gm_re_api_block_list);
            }),250);
        }
    }else{//
        console.log("item response.status: "+response.status+response.responseHeaders);
    }
}
function fn_gm_re_api_block_list(response){
    let json=JSON.parse(response.responseText);
    let url=fn_url(response.finalUrl);
    let output_FM_rbox14=document.querySelectorAll('div.FM-rbox14>p,div.FM-rbox14')[0];
    if(response.status==200){//這裡全部每次都要按照各種目標網頁格式重寫
        let str_userid=url[1].get('userid');
        let json_block_list__blocks=json[j_data][j_blocks];
        if(json_block_list__blocks.length<2){
            let span_log=create_node_text("span","隱藏了個人紀錄",["mono"],true,output_FM_rbox14);
            span_log.title="此數據讀取了api block_list.php";
        }else{
            let str_reg_date="";
            let str_login_date="";
            for(let a=0; a<json_block_list__blocks.length; a++){
                if(json_block_list__blocks[a][j_type]=="user_info"){
                    let json_block_list__items=json_block_list__blocks[a][j_data][j_items];
                    for(let b=0; b<json_block_list__items.length; b++){
                        if(json_block_list__items[b][j_name]=="上站日期"){str_login_date=json_block_list__items[b][j_value];}
                        if(json_block_list__items[b][j_name]=="註冊日期"){str_reg_date=json_block_list__items[b][j_value];}
                    }
                }
            }
            let span_log=create_node_text("span",str_login_date,["code"],true,output_FM_rbox14);
            span_log.title=str_userid+"註冊日期﹕"+str_reg_date+"，此數據讀取了api block_list.php";
        }
    }else{//
        console.log("item response.status: "+response.status+response.responseHeaders);
    }
}
/*function fn_re_BH_rbox(response){//跨站不能用這個
    let dom=document.createRange().createContextualFragment(response.responseText);
    let url=fn_url(response.responseURL);
    let output_FM_rbox14=document.querySelectorAll('div.FM-rbox14>p,div.FM-rbox14')[0];
    //fn_output_text(BH_rbox_p,"Co: "+url[1].get('sn')+" "+new Date().toLocaleString(),true);
    if(response.status==200){//這裡全部每次都要按照各種目標網頁格式重寫
        let str_userid=url[1].get('owner');
        let str_reg="";
        let str_login_date="";
        if(url[0].pathname=="/homeindex.php"){
            let li_BH_list1=dom.querySelectorAll('div.BH-list1>ul>li');
            for(let i=0; i<li_BH_list1.length; i++){
                if(li_BH_list1[i].innerText.search("上站日期")==strIsFoundFirst){str_login_date=li_BH_list1[i].innerText;}
                if(li_BH_list1[i].innerText.search("註冊日期")==strIsFoundFirst){str_reg=li_BH_list1[i].innerText;}
            }
            create_node('br',[],true,output_FM_rbox14);
            if(str_reg!=""){
                let span_log=create_node_text("span",str_userid+": "+str_login_date,["code"],true,output_FM_rbox14);
                span_log.title=str_reg;
            }else{
                let span_log=create_node_text("span",str_userid+"隱藏了個人紀錄",["mono"],true,output_FM_rbox14);
            }
        }else if(url[0].pathname=="/profile/index.php"){
            create_node('br',[],true,output_FM_rbox14);
            let span_log=create_node_text("span",str_userid+"使用了新版小屋，腳本還在工事中",["mono"],true,output_FM_rbox14);
        }
    }
    else{//429
        console.log("response.status: "+response.status+response.responseHeaders);
    }
}//*/
(function() {
    'use strict';
    let ul_BH_menuE=document.querySelectorAll('ul.BH-menuE');
    if(ul_BH_menuE.length==0){return;}
    else if(ul_BH_menuE.length==1){
        ul_BH_menuE=ul_BH_menuE[0];
        let li_new=create_node("li",[],true,ul_BH_menuE);
        let btn_load=create_btn("加載名單上線時間",["user_btn_panel","code"],true,li_new);
        btn_load.addEventListener('click',()=>{
            for(let i=0; i<ary.length; i++){
                let random=Math.random();
                random=random>0.5?random:random*2;
                let delay=i*1000*1.5+Math.floor(i/5)*1000*5+Math.floor(i/7)*1000*7+Math.floor(i/10)*1000*10+Math.floor(i/20)*1000*20+Math.floor(i/25)*1000*25+Math.floor(i/50)*1000*50+Math.floor(i/100)*1000*50+parseInt(1000*random,10);
                window.setTimeout(( ()=>{
                    fn_gm_XMLHttpRequest("https://home.gamer.com.tw/homeindex.php?owner="+ary[i],fn_gm_re_homeindex);
                }),delay);
            }
        });
    }
})();