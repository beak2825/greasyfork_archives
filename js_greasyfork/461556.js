// ==UserScript==
// @name         巴哈 - 在舊版搜索作者的頁面預覽顯示回文內容
// @description  模仿貼吧搜索貼子的思路
// @namespace    show_article__content_in_Bo_php
// @author       Covenant
// @version      1.0
// @license      MIT
// @homepage
// @match        https://forum.gamer.com.tw/Bo.php*
// @icon         https://i2.bahamut.com.tw/icon/share-icon_bh.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/461556/%E5%B7%B4%E5%93%88%20-%20%E5%9C%A8%E8%88%8A%E7%89%88%E6%90%9C%E7%B4%A2%E4%BD%9C%E8%80%85%E7%9A%84%E9%A0%81%E9%9D%A2%E9%A0%90%E8%A6%BD%E9%A1%AF%E7%A4%BA%E5%9B%9E%E6%96%87%E5%85%A7%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/461556/%E5%B7%B4%E5%93%88%20-%20%E5%9C%A8%E8%88%8A%E7%89%88%E6%90%9C%E7%B4%A2%E4%BD%9C%E8%80%85%E7%9A%84%E9%A0%81%E9%9D%A2%E9%A0%90%E8%A6%BD%E9%A1%AF%E7%A4%BA%E5%9B%9E%E6%96%87%E5%85%A7%E5%AE%B9.meta.js
// ==/UserScript==
var output_state=document.querySelectorAll('ul.BH-menuE>li>a')[2];
const str_font_console_std="'Noto Sans Mono','Noto Mono','Cascadia Mono','Consolas','Droid Sans Mono','Liberation Mono','Monaco',";
const str_font_console_monoserif="'Cutive Mono','FreeMono','Courier New','Liberation Mono',";
const str_font_console_emoji="'Twemoji Mozilla','Noto Color Emoji','Segoe UI Emoji',";
const str_font_console_sans_ja="'Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei',";
const str_font_console_kaishotai="'HGSeikaishotaiPRO','BiauKai','UD Digi Kyokasho NK-R','DFKai-SB','AR PL UKai TW','AR PL UKai TW MBE','Yu Mincho',";
const css__mono_std="font-family: "+str_font_console_std+str_font_console_emoji+str_font_console_sans_ja+"sans-serif;font-weight: 100;";
const css__monoserif="font-family: "+str_font_console_monoserif+str_font_console_emoji+str_font_console_sans_ja+"sans-serif;font-weight: 100;";
const css__kaishotai="font-family: "+str_font_console_std+str_font_console_emoji+str_font_console_kaishotai+"sans-serif;font-weight: 100;";
const css_font_size_14px="font-size: 14px;",css_font_size_20px="font-size: 20px;",css_font_size_72px="font-size: 72px;";
function create_style(textContent,id,class_name){let style=create_style_iframes(textContent,id,class_name,document.body);return style;}
var style_user_css=create_style("","gm_user_css_show_article__content",["user_gm_css","css_show_article__content"]);
style_user_css.textContent+=`\n`;
function create_a(innerText,url,class_name,is_appendChild,node,refNode){
    let anchor=create_node_text("a",innerText,class_name,is_appendChild,node,refNode);
    anchor.href=url;
    anchor.title=innerText;
    if(url.search(new RegExp("javascript", "i"))!=0||url.indexOf(":")!=10)anchor.target="_blank";
    return anchor;
}
function create_btn(innerText,class_name,is_appendChild,node,refNode){
    let btn=create_node_text("button",innerText,class_name,is_appendChild,node,refNode);
    return btn;
}
function create_img(url,title,class_name,is_appendChild,node,refNode){
    let img=create_node("img",class_name,is_appendChild,node,refNode);
    img.src=url;
    img.title=title;
    img.alt=title;
    img.style.setProperty('max-height',"100px");
    return img;
}
function create_img_click(url,title,class_name,is_appendChild,node,refNode){
    let img=create_img(url,title,class_name,is_appendChild,node,refNode);
    img.addEventListener('click',() =>{
        let img_tmp=img.cloneNode(true);
        img_tmp.style.setProperty('position','fixed');
        img_tmp.style.setProperty('left',"50%");
        img_tmp.style.setProperty('top',"50%");
        img_tmp.style.setProperty('transform',"translate(-50%,-50%)");
        img_tmp.style.setProperty('max-height',"95%");
        img_tmp.style.setProperty('z-index','1000');
        img_tmp.removeAttribute('width');
        ////newmodal_background.style.removeProperty('display');
        document.body.appendChild(img_tmp);
        img.classList.add("pointer_events_none");
        img_tmp.addEventListener('click',() => {
            ////newmodal_background.style.setProperty('display','none');
            img.classList.remove("pointer_events_none");
            img_tmp.remove();
        });
        /*if(img.style.getPropertyValue('position')!="fixed"){
            img.style.setProperty('position','fixed');
            img.style.setProperty('left',"50%");
            img.style.setProperty('top',"50%");
            img.style.setProperty('transform',"translate(-50%,-50%)");
            img.style.setProperty('max-height',"95%");
            img.removeAttribute('width');
            newmodal_background.style.removeProperty('display');
        }
        else{
            img.style.removeProperty('position');
            img.style.removeProperty('left');
            img.style.removeProperty('top');
            img.style.removeProperty('transform');
            img.setAttribute('width', '54');
            newmodal_background.style.setProperty('display','none');
        }//*/
    });
    return img;
}
function create_style_iframes(textContent,id,class_name,node){
    let style=create_node("style",class_name,true,node);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
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
//console.log("%cbreak",css__mono_std);
function fn_output_text(node,text,is_addition_assignment){
    if(is_addition_assignment)node.innerText+=text;
    else{node.innerText=text;}
}
function fn_re_friendMore(response){//要跨站不能用這個
    let dom=document.createRange().createContextualFragment(response.responseText);
    let url=fn_url(response.responseURL);
    let output_BH_rbox_p=document.querySelectorAll('div.BH-rbox>p');//前置準備
    if(output_BH_rbox_p.length==0)return;
    output_BH_rbox_p=output_BH_rbox_p[0];
    create_node('br',[],true,output_BH_rbox_p);
    fn_output_text(output_BH_rbox_p,"Co: "+url[1].get('sn')+" "+new Date().toLocaleString(),true);
    let is_prohibit=dom.querySelectorAll('div.prohibit').length>0;
    if(is_prohibit){console.log("prohibit: 發生錯誤：未登入");return;}
    let output_p_sn=document.querySelectorAll('p.sn_'+url[1].get('sn'))[0];
    let output_p_ip=document.querySelectorAll('p.ip_'+url[1].get('sn'))[0];
    let output_p_bp=document.querySelectorAll('p.bp_'+url[1].get('sn'))[0];
    let word_num=200;
    if(response.status==200){//這裡全部每次都要按照各種目標網頁格式重寫
        let div_c_post__header=dom.querySelectorAll('div.c-post__header')[0];
        let div_content=dom.querySelectorAll('div.c-article__content')[0];
        let div_c_post__body__buttonbar=dom.querySelectorAll('div.c-post__body__buttonbar')[0];
        output_p_sn.innerText+=div_content.innerText.substring(0,word_num);//內文
        if(div_content.innerText.length>word_num){
            output_p_sn.innerText+=" \u232B";
        }
        let ary_img=div_content.querySelectorAll('img');//圖片
        for(let i=0; i<ary_img.length; i++){
            let str_src=ary_img[i].cloneNode(true).getAttribute("data-src");
            if(str_src==null){str_src=ary_img[i].cloneNode(true).getAttribute("src");}
            create_img_click(str_src,'',[],true,output_p_sn.parentNode);
            //console.log("%c"+ary_img[i].outerHTML,css__mono_std);
            if(i>5)break;
        }
        let ary_iframe=div_content.querySelectorAll('iframe');//影片
        for(let i=0; i<ary_iframe.length; i++){
            let url=fn_url(ary_iframe[i].getAttribute("data-src"));
            if(url[0].host.search(new RegExp("youtube.com", "i"))!=-1){
                output_p_sn.innerText+="[iframe:"+url[0].pathname+"]";
                create_img_click("https://i.ytimg.com/vi/"+url[0].pathname.replace(/\/embed\//i, "")+"/sddefault.jpg",'',[],true,output_p_sn.parentNode);
            }
            else{output_p_sn.innerText+="[iframe]";}
        }
        let a_more_reply=dom.querySelectorAll('a.more-reply');//留言數量檢測
        let is_more_reply=a_more_reply.length>0;
        if(is_more_reply){
            output_p_sn.innerText+="("+a_more_reply[0].querySelectorAll('span')[0].innerText+")";
        }else{
            let len_c_reply__item=dom.querySelectorAll('.c-reply__item').length;
            if(len_c_reply__item>0)output_p_sn.innerText+="{"+len_c_reply__item+"則留言}";
        }
        let a_edittime=div_c_post__header.querySelectorAll('.edittime');//ip
        for(let i=0; i<a_edittime.length; i++){//console.log(i)
            let hideip=a_edittime[i].getAttribute("data-hideip");
            if(hideip.search(new RegExp("BAHAMUT", "i"))==-1){
                let span_ip=create_node_text("span","",["hideip","span_title"],true,output_p_ip);
                create_a(hideip,"https://\u0069\u0070info.io/#"+hideip.replace(/xxx/i, '1'),[],true,span_ip);
            }
        }
        let i_mobile=div_c_post__header.querySelectorAll('.mobile>i');//mobile
        if(i_mobile.length>0){create_node_text("i","\uF10B",["material-icons","span_title","user_mark_1_5rem"],true,output_p_ip);}
        let a_bp=div_c_post__body__buttonbar.querySelectorAll('div.bp>a');//BP數量
        for(let i=0; i<a_bp.length; i++){
            if(a_bp[i].innerText!="-"){
                create_node_text("span","\uF088",["b-list__summary__gp","mono"],true,output_p_bp);
                create_node_text("span",a_bp[i].innerText,["b-list__summary__gp"],true,output_p_bp);
            }
        }
        let content__alert__icon=dom.querySelectorAll('img.content__alert__icon');//錯誤
        if(div_content==undefined)output_p_sn.innerText+="[發生錯誤]";
        if(content__alert__icon.length>0)output_p_sn.innerText+="img.content__alert__icon";
        fn_output_text(output_state,"delay",false);
    }
    else{//429
        console.log("response.status: "+response.status+response.responseHeaders);
    }
    delete dom;
}
function fn_btn_load_co(node){
    let ary_tr_b_list__main=node.querySelectorAll('tr.b-list__row>td.b-list__main');
    let ary_tr_b_list__summary=node.querySelectorAll('tr.b-list__row>td.b-list__summary');
    let ary_p_b_list__time__edittime=node.querySelectorAll('p.b-list__time__edittime');
    let ary_url=node.querySelectorAll('tr.b-list__row>td.b-list__main>a');
    for(let i=0; i<ary_url.length; i++){
        //console.log("href:"+ary_url[i].href)
        let url=fn_url(ary_url[i].href);
        let p_sn=create_node_text("p","",["sans","sn_"+url[1].get('sn')],true,ary_tr_b_list__main[i]);
        let p_ip=create_node_text("p","",["mono","ip_"+url[1].get('sn')],true,ary_tr_b_list__summary[i]);
        ary_p_b_list__time__edittime[i].classList.add("bp_"+url[1].get('sn'));
        let random=Math.random();
        random=random>0.5?random:random*2;
        let delay=i*1000*1.5+Math.floor(i/5)*1000*5+Math.floor(i/7)*1000*7+Math.floor(i/10)*1000*10+Math.floor(i/20)*1000*20+Math.floor(i/25)*1000*25+Math.floor(i/50)*1000*50+Math.floor(i/100)*1000*50+parseInt(1000*random,10);
        window.setTimeout(( () => {fn_output_text(output_state,"loading",false);fn_XMLHttpRequest(ary_url[i].href,fn_re_friendMore);} ), delay);
    }
}
function fn_setInterval_load_local_bo(){
    let div_BH_master=document.querySelectorAll('div#BH-master');
    for(let i=0; i<div_BH_master.length; i++){
        let className="block_"+i;
        if(!div_BH_master[i].classList.contains(className)){
            let btn_tmp=create_btn("button","user_btn_panel",false,div_BH_master[i],div_BH_master[i].firstChild);
            div_BH_master[i].classList.add(className);
            btn_tmp.addEventListener('click',(evt) => {
                console.log(evt);console.log(this);
                fn_btn_load_co(evt.target.parentNode);
            });
        }
    }
}
(function() {
    'use strict';
    fn_setInterval_load_local_bo();
    let timeoutID = window.setInterval(( () => fn_setInterval_load_local_bo() ), 5000);
    //
    let div_content=document.querySelectorAll('div#BH-master')[0].parentNode;
    let btn_tmp=create_btn("all","user_btn_panel",false,div_content,div_content.firstChild);
    btn_tmp.addEventListener('click',(evt) =>{
        console.log(evt);console.log(this);
        fn_btn_load_co(evt.target.parentNode);
    });
})();