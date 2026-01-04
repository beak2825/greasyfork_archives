// ==UserScript==
// @name         巴哈姆特 - 本地用户標籤demo
// @description  RT
// @namespace    user_list_70c90
// @author       Covenant
// @version      1.0
// @license      MIT
// @homepage
// @match        https://*.gamer.com.tw/*
// @match        https://forum.gamer.com.tw/search.php?bsn=*
// @match        https://haha.gamer.com.tw/index2.php?room=*
// @match        https://forum.gamer.com.tw/A.php?bsn=*
// @icon         https://i2.bahamut.com.tw/icon/share-icon_bh.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/450993/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E6%9C%AC%E5%9C%B0%E7%94%A8%E6%88%B7%E6%A8%99%E7%B1%A4demo.user.js
// @updateURL https://update.greasyfork.org/scripts/450993/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E6%9C%AC%E5%9C%B0%E7%94%A8%E6%88%B7%E6%A8%99%E7%B1%A4demo.meta.js
// ==/UserScript==
var is_execute=true;
function create_style(textContent,id,class_name){let style=create_style_iframes(textContent,id,class_name,document.body);return style;}
const str_font_console_std="'Noto Mono','Cascadia Mono','Consolas','Menlo','Droid Sans Mono','Liberation Mono','Monaco','Noto Sans Mono CJK JP',";
const str_font_console_monoserif="'Cutive Mono','FreeMono','Courier New','Liberation Mono',";
const str_font_console_emoji="'Twemoji Mozilla','Apple Color Emoji','Noto Color Emoji','Segoe UI Emoji',";
const str_font_console_sans_ja="'IBM Plex Sans JP','Hiragino Kaku Gothic ProN','Noto Sans CJK JP','Meiryo','Yu Gothic','IBM Plex Sans TC','PingFang TC','Microsoft JhengHei',";
const str_font_console_kaishotai="'HGSeikaishotaiPRO','BiauKaiTC','BiauKai','YuKyokasho Yoko','UD Digi Kyokasho NK-R','DFKai-SB','AR PL UKai TW','Klee',";
const css__mono_std="font-family: "+str_font_console_std+str_font_console_emoji+str_font_console_sans_ja+"sans-serif;font-weight: 100;";
const css__monoserif="font-family: "+str_font_console_monoserif+str_font_console_emoji+str_font_console_sans_ja+"sans-serif;font-weight: 100;";
const css__kaishotai="font-family: "+str_font_console_std+str_font_console_emoji+str_font_console_kaishotai+"sans-serif;font-weight: 100;";
const css_font_size_14px="font-size: 14px;",css_font_size_20px="font-size: 20px;",css_font_size_72px="font-size: 72px;";
var style_user_css=create_style("","gm_user_css_user_list_70c90",["user_gm_css","css_user_list_70c90"]);
style_user_css.textContent+=`.user_btn_tag_ridge.user_btn_tag_ridge,.user_btn_tag_groove.user_btn_tag_groove{font-weight: 100;}\n.b-list__count{width: auto;}
.user_btn_tag_ridge,.user_btn_tag_groove{min-width: 5em; min-height: 1em;display: inline-block;}
.user_btn_tag_ridge,.user_btn_tag_groove{text-align: center;padding-top: 2px;padding-bottom: 2px;}
span.user_btn_tag_ridge.user_btn_tag_ridge,span.user_btn_tag_groove.user_btn_tag_groove{color: #F7F7F7;background: #303030;border-color: #707070;border-width: 0.25rem;border-radius: 4px;margin-right: 0px;}
.user_btn_tag_ridge{border-style: ridge;padding-left: 2px;padding-right: 3px;}\n.user_btn_tag_groove{border-style: groove;padding-right: 1px;}
a>.user_btn_tag_ridge,a>.user_btn_tag_groove,.bp_tag{min-width: 3em;}
a.user-info{height: auto;}
.BH-list4>a,.user-info>span{display: inline-block;}
.BH-list4>a{outline-style: dashed;outline-color: #707070;outline-width: 1px ;outline-offset: 2px;border-radius: 4px;}\n`;
const ary=[['🕷spider',''],
           ['gensh_t',''],
           ['\u{1FAB0}',''],
           ['權限狗',''],
           [CodePoint_demo("惭血",12),CodePoint_demo("col6608664",1)],[CodePoint_demo("万尊万",7),CodePoint_demo("amac984;",12)],[CodePoint_demo("煕群",25),CodePoint_demo("ii970332",1)]];
function create_div(class_name,is_appendChild,node,refNode){
    let div=create_node("div",class_name,is_appendChild,node,refNode);
    div.style.backgroundSize='contain';
    div.style.backgroundRepeat='no-repeat';
    div.lang='ja';
    return div;
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
function create_a(innerText,url,class_name,is_appendChild,node,refNode){
    let anchor=create_node_text("a",innerText,class_name,is_appendChild,node,refNode);
    anchor.href=url;
    anchor.title=innerText;
    if(url.search(new RegExp("javascript", "i"))!=0||url.indexOf(":")!=10)anchor.target="_blank";
    return anchor;
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
async function fn_clipboard_w(str){
    try{
        await navigator.clipboard.writeText(str);
    }catch(e){alert(e.message);}
    finally{}
}
//console.log("%cbreak",css__mono_std);
function fn_avataruserpic(uid){
    if(uid.constructor.name=="String"){uid="https://avatar2.bahamut.com.tw/avataruserpic/"+uid[0]+"/"+uid[1]+"/"+uid+"/"+uid+".png";}
    else{uid="https://i2.bahamut.com.tw/noface.png";}
    return uid.toLowerCase();
}
function CodePoint_demo(str,offset_xor){
    let tmp="";
    for(let i=0; i<str.length; i++){
        tmp+=String.fromCodePoint(str[i].codePointAt(0)^offset_xor);
    }
    return tmp;
}
function fn_array(array){
    for(let i=0; i<array.length; i++){
        for(let j=i+1; j<array.length; j++){
            if(array[i].toLowerCase()==array[j].toLowerCase()){
                console.log("%c"+array[i]+" duplicate found at "+j,css__mono_std);
            }
        }
    }
}
function fn_add_ary(ary_const,ary_uid,ary_output,ary_class){//
    if(ary_uid.length!=ary_output.length){console.log("%cfunction error",css__monoserif);return;}
    for(let i=0; i<ary_const.length; i++){//標記陣列
        for(let j=0; j<ary_const[i].length; j++){//人員陣列
            for(let u=0; u<ary_uid.length; u++){
                if(ary_uid[u].toLowerCase()==ary_const[i][j].toLowerCase()){//找到目標用戶
                    if(ary_output[u].querySelectorAll(".user_tag_"+i).length==0){//檢查class防止重複標記
                        let tag=create_node_text("span",ary_const[i][0],["user_tag_"+i].concat(ary_class),true,ary_output[u]);
                        tag.title=ary_const[i][0]+" ["+j+"]";
                    }
                }
            }//if(is_execute)console.log("%c腳本出錯錯誤查詢陣列"+i+" "+j,css__kaishotai+css_font_size_20px);//這行放在其他地方會有卡死bug
        }
    }is_execute=false;//console.log("%c自檢%c"+is_execute,css__kaishotai+css_font_size_20px,css__monoserif+css_font_size_14px);
}
function fn_setTimeout_10000(){
    let url=fn_url(document.location);
    let avatar_info_box=document.querySelectorAll('div.BH-lbox>a');
    for(let n=0; n<avatar_info_box.length; n++){//📦今日訪客一覽
        if(url[0].pathname.search(new RegExp("/friendMore.php", "i"))==0)return;
        let home=avatar_info_box[n].href;
        let uid=home.replace(/https:\/\/home.gamer.com.tw\//i,"");
        uid=uid.replace(/home.php\?owner=/i,"");
        fn_add_ary(ary,[uid],[avatar_info_box[n]],["user_btn_tag_groove"]);
    }
    let div_ip_list_table=document.querySelectorAll('div.ip-list>table');
    for(let t=1; t<div_ip_list_table.length; t+=2){//📦483109，偶數表格為用戶
        let div_ip_list_tr=div_ip_list_table[t].querySelectorAll('tr');
        if(div_ip_list_tr.length>1){
            for(let n = 1; n < div_ip_list_tr.length; n++){//用戶表格
                let td_ip_list=div_ip_list_tr[n].querySelectorAll('td')[0];
                let a_ip_list=td_ip_list.querySelectorAll('a')[0];
                let home=a_ip_list.href;
                let uid=home.replace(/https:\/\/home.gamer.com.tw\//i, '');
                uid=uid.replace("&","").replace(/profile\/index.php\?owner=/i, '');
                fn_add_ary(ary,[uid],[td_ip_list],["user_btn_tag_groove"]);
            }
        }
    }
}
function fn_setInterval_lzl(){
    let lzl=document.querySelectorAll('div.c-reply__item');
    for(let n=0; n<lzl.length; n++){//留言
        //let div_reply_content=lzl[n].querySelectorAll('div.reply-content')[0];
        let home=lzl[n].querySelectorAll('a.reply-content__user')[0].href;
        let uid=home.replace(/https:\/\/home.gamer.com.tw\//i, '');
        let div_reply_content__footer=lzl[n].querySelectorAll("div.reply-content__footer")[0];
        fn_add_ary(ary,[uid],[div_reply_content__footer],["user_btn_tag_ridge"]);
        let div_reply_disable=lzl[n].querySelectorAll('div.reply-disable');
        div_reply_disable.forEach((div_fe_reply_disable,i) =>{//折疊留言
            if(div_fe_reply_disable.querySelectorAll(".span_title").length==0){
                let span_tag=lzl[n].querySelectorAll('.user_btn_tag_ridge');
                for(let i=0; i<span_tag.length; i++){
                    let side_tag=span_tag[i].cloneNode(true);
                    side_tag.classList.replace("user_btn_tag_ridge","span_title");
                    div_fe_reply_disable.appendChild(side_tag);
                }
            }
        });
    }
    let gpbp=Array.from(document.querySelectorAll('div>div>div.tippy-content>div#gpbpList>a'));
    gpbp=gpbp.concat(Array.from(document.querySelectorAll('div.vote-user-list>a')));//投票tippy-box tippy-gpbp-count
    let str_list=[];
    for(let n=0; n<gpbp.length; n++){
        let home=gpbp[n].href;
        let uid=home.replace(/https:\/\/home.gamer.com.tw\//i, '');
        uid=uid.replace(/home.php\?owner=/i, '');
        str_list.push("'"+uid+"'");
        fn_add_ary(ary,[uid],[gpbp[n]],["user_btn_tag_groove"]);
    }
    if(gpbp.length>0&&document.querySelectorAll('div#gpbpList>.user_btn,div.vote-user-list>.user_btn').length==0){
        let output_btn=document.querySelectorAll('div#gpbpList,div.vote-user-list');
        if(output_btn.length==0){}
        let btn_copy=create_btn("\uE14Dcopy",["btn--sm","btn--normal","user_btn","code","cursor_copy"],true,output_btn[0]);
        btn_copy.title="這裡複製只有小寫id，無解";
        btn_copy.addEventListener('click',() =>{
            GM_setClipboard(str_list, "text");
        });
    }
}
function fn_setInterval_guild(){
    let url=fn_url(document.location);
    if(url[0].pathname.search(new RegExp("/member.php", "i"))==0){//🛄成員名單
        let div_gamer_avatar_info=document.querySelectorAll('div.gamer_avatar-info');
        for(let n=0; n<div_gamer_avatar_info.length; n++){
            let uid=div_gamer_avatar_info[n].querySelectorAll('p')[0].textContent;
            let div_no_flex=div_gamer_avatar_info[n].querySelectorAll(".no_flex").length==0?create_div(["no_flex"],true,div_gamer_avatar_info[n]):div_gamer_avatar_info[n].querySelectorAll(".no_flex")[0];
            fn_add_ary(ary,[uid],[div_no_flex],["user_btn_tag_ridge"]);
        }
    }else if(url[0].pathname.search(new RegExp("/guild.php", "i"))==0||url[0].pathname.search(new RegExp("/post_detail.php", "i"))==0){//🛄公會叭啦貼文
        let div_post_header=document.querySelectorAll('div.main-container_wall-post_header,div.webview_commendlist>div>div.c-reply__item');
        for(let n=0; n<div_post_header.length; n++){
            let div_post_header_name=div_post_header[n].querySelectorAll('div.post-header-name,div.reply-content')[0];
            let home=div_post_header_name.querySelectorAll('.post-header-name>a,a.reply-content__user')[0].href;
            let uid=home.replace(/https:\/\/home.gamer.com.tw\//i, '');
            for(let i=0; i<ary.length; i++){
                for(let j=1; j<ary[i].length; j++){
                    if(uid.toLowerCase()==ary[i][j].toLowerCase()){//找到目標用戶
                        if(div_post_header[n].querySelectorAll(".user_tag_"+i).length==0){
                            if(div_post_header_name.querySelectorAll('a.reply-content__user').length==1){
                                create_node_text("span",ary[i][0],["user_btn_tag_ridge","user_tag_"+i],false,div_post_header_name,div_post_header_name.children[1]);
                            }else create_node_text("span",ary[i][0],["user_btn_tag_ridge","user_tag_"+i],true,div_post_header_name);
                        }
                    }
                }
            }
        }
    }
}
function fn_setInterval_gnn_detail(){
    let div_GN_lbox6A=document.querySelectorAll('div.GN-lbox6A');
    div_GN_lbox6A.forEach((div_fe_GN_lbox6A,n) =>{
        let uid=div_fe_GN_lbox6A.querySelectorAll('p>a')[0].href.replace(/https:\/\/home.gamer.com.tw\//i, "");
        fn_add_ary(ary,[uid],[div_fe_GN_lbox6A],["user_btn_tag_ridge"]);
    });
}
/*function fn_setInterval_chatRoom(){//EY
    let div_message_holder=document.querySelectorAll('#chatRoom .message-holder,#im_msgbox>.msg-box');
    for(let n=0; n<div_message_holder.length; n++){
        if(div_message_holder[n].classList.contains("sys-msg")){continue;}
        let uid=div_message_holder[n].querySelectorAll('a')[0].href.replace(/https:\/\/home.gamer.com.tw\//i, "");
        let output=div_message_holder[n].querySelectorAll('.message-log__header,.msg-log__header');
        fn_add_ary(ary,[uid],[output[0]],["span_title","sans_condensed"]);
    }
}*/
function fn_setInterval_now_chatroom(){
    let div_msg_container=document.querySelectorAll('div.chatroom>div.msg_container');
    for(let n=0; n<div_msg_container.length; n++){
        //if(div_message_holder[n].classList.contains("sys-msg")){continue;}
        let uid=div_msg_container[n].dataset.uid;
        let output=div_msg_container[n].querySelectorAll('div.now_user-info');
        fn_add_ary(ary,[uid],[output[0]],["span_title","sans_condensed"]);
    }
}
(function(){
    'use strict';
    let url=fn_url(document.location);
    window.setTimeout(( () => fn_setTimeout_10000() ),10000);
    if(url[0].host=="forum.gamer.com.tw"){//📻哈啦區
        if(url[0].pathname.search(new RegExp("/C.php", "i"))==0||url[0].pathname.search(new RegExp("/Co.php", "i"))==0){//🛄文
            let div_post__header__author=document.querySelectorAll('div.c-post__header__author');
            let div_c_section__side=document.querySelectorAll('div.c-section__side');
            for(let n=0; n<div_post__header__author.length; n++){//各樓層
                let home=div_post__header__author[n].querySelectorAll('a.userid')[0].href;
                let uid=home.replace(/https:\/\/home.gamer.com.tw\//i, "");
                fn_add_ary(ary,[uid],[div_post__header__author[n]],["user_btn_tag_ridge"]);
                let span_tag=div_post__header__author[n].querySelectorAll('.user_btn_tag_ridge');//複製標籤到左邊的divc-section__side
                span_tag.forEach((span_fe_tag,i) =>{
                    let side_tag=span_fe_tag.cloneNode(true);
                    side_tag.classList.replace("user_btn_tag_ridge","span_title");side_tag.classList.add("box_shadow_DarkRed");
                    div_c_section__side[n].appendChild(side_tag);
                });
                let div_postcount=div_post__header__author[n].querySelectorAll('div.postcount');//建立複製點擊區
                div_postcount.forEach((div_fe_postcount,i) =>{
                    div_fe_postcount.addEventListener('click',() => {fn_clipboard_w(uid);});
                    div_fe_postcount.classList.add("outline");div_fe_postcount.classList.add("cursor_copy");
                    div_fe_postcount.title="複製用戶id";
                });
            }
            let div_c_disable=document.querySelectorAll('div.c-disable');
            for(let n=0; n<div_c_disable.length; n++){//樓層折疊/刪除
                let div_hint=div_c_disable[n].querySelectorAll('div.hint');
                div_hint.forEach((div_fe_hint,i) =>{
                    if(div_fe_hint.textContent.search("刪除")==-1){
                        let uid=div_fe_hint.textContent.slice(1).split(" ")[0];
                        fn_add_ary(ary,[uid],[div_c_disable[n]],["span_title"]);
                    }else if(div_fe_hint.textContent.search("原作者")!=-1){
                        let uid=div_fe_hint.textContent.slice(9).split(")")[0];
                        fn_add_ary(ary,[uid],[div_c_disable[n]],["span_title"]);
                    }
                });
            }
            fn_setInterval_lzl();//留言&投票
            let timeoutID=window.setInterval(( () => fn_setInterval_lzl() ),1000);
            //window.setTimeout(( () => fn_setTimeout_lzl() ), 5000);
        }else if(url[0].pathname.search(new RegExp("/B.php", "i"))==0){//🛄文章列表
            let list_user=Array.from(document.querySelectorAll('p.b-list__count__user'));
            list_user=list_user.concat(Array.from(document.querySelectorAll('p.b-list__time__user')));
            for(let n=0; n<list_user.length; n++){
                let uid=list_user[n].querySelectorAll('a')[0].href.replace(/https:\/\/home.gamer.com.tw\//i, "");
                fn_add_ary(ary,[uid],[list_user[n]],["user_btn_tag_ridge","sans_condensed"]);
            }
            let list=document.querySelectorAll('tr.b-list__row>td>a.b-list__main__title,p.b-list__main__title');//\uEAF3
            for(let n=0; n<list.length; n++){
                let ary_str=list[n].innerText.split("→");
                if(ary_str.length<2)continue;
                fn_add_ary(ary,[ary_str[1]],[list[n].parentElement],["user_btn_tag_ridge","sans_condensed"]);
            }
        }else if(url[0].pathname.search(new RegExp("/water.php", "i"))==0){//🛄小黑屋，這裡是表格，新增的node必須放隔壁不然id會讀錯
            let water=document.querySelectorAll('div#BH-master>table tr');
            for(let n=0; n<water.length; n++){
                let td=water[n].querySelectorAll('td');
                fn_add_ary(ary,[td[0].textContent,td[4].textContent],[td[1],td[3]],["user_btn_tag_groove","sans_condensed"]);
            }
        }else if(url[0].pathname.search(new RegExp("/Bo.php", "i"))==0){//🛄舊版搜用戶
            window.setTimeout(( ()=>{
                let div_BH_top_data=document.querySelectorAll('div#BH-top-data');
                div_BH_top_data.forEach((div_fe_BH_top_data,i) =>{//搜用戶頁面
                    let uid;
                    if(url[0].pathname.search(new RegExp("/Bo.php", "i"))==0){uid=url[1].get('q');}else if(url[0].pathname.search(new RegExp("/search.php", "i"))==0){uid=url[1].get('author');}
                    fn_add_ary(ary,[uid],[div_fe_BH_top_data],["user_btn_tag_ridge","float_left","sans_condensed"]);
                });
            }),3000);
        }else if(url[0].pathname.search(new RegExp("/search.php", "i"))==0){//🛄新版搜索
            let div_forum_textinfo=document.querySelectorAll('div.forum-textinfo');
            div_forum_textinfo.forEach((div_fe_forum_textinfo,i) =>{
                let uid=div_fe_forum_textinfo.querySelectorAll('a')[0].href.replace(/https:\/\/home.gamer.com.tw\//i, "");
                fn_add_ary(ary,[uid],[div_fe_forum_textinfo],["user_btn_tag_ridge"]);
            });
        }else if(url[0].pathname.search(new RegExp("/A.php", "i"))==0){//🛄在/A.php顯示所有記錄用戶
            let div_BH_lbox__FM_abox5=document.querySelectorAll('div.BH-lbox.FM-abox5')[0];if(div_BH_lbox__FM_abox5==undefined){console.log("%cerror: div.BH-lbox.FM-abox5",css__mono_std);return;}
            let output=create_div(["FM-abox5B"],true,div_BH_lbox__FM_abox5);
            let btn_list_Bo_link=create_btn("\uF022 產生所有名單舊版搜索按鈕","user_btn_panel",true,output);
            let btn_list_Bo_avataruserpic=create_btn("產生名單舊版搜索+勇造圖片","user_btn_panel",true,output);
            let btn_list_link=create_btn("\uF022 產生所有名單搜索按鈕","user_btn_panel",true,output);
            let btn_list_avataruserpic=create_btn("產生名單搜索+勇造圖片","user_btn_panel",true,output);
            let is_load_avataruserpic=false,is_Bo=true,link;
            btn_list_Bo_link.addEventListener('click',(evt) =>{fn_user_list();});
            btn_list_Bo_avataruserpic.addEventListener('click',(evt) =>{is_load_avataruserpic=true;fn_user_list();});
            btn_list_link.addEventListener('click',(evt) =>{is_Bo=false;fn_user_list();});
            btn_list_avataruserpic.addEventListener('click',(evt) =>{is_Bo=false;is_load_avataruserpic=true;fn_user_list();});
            function fn_user_list(){
                for(let i=0; i<ary.length; i++){
                    for(let j=0; j<ary[i].length; j++){
                        if(j==0){
                            create_node("hr",[],true,output);
                            create_node_text("h1",ary[i][j],["sans_condensed"],true,output);
                        }else{
                            if(is_Bo){link="https://forum.gamer.com.tw/Bo.php?bsn="+url[1].get('bsn')+"&qt=6&q="+ary[i][j];}
                            else{link="https://forum.gamer.com.tw/search.php?bsn="+url[1].get('bsn')+"&q="+ary[i][j]+"&author="+ary[i][j]+"&sortType=mtime&firstFloorOnly=0&advancedSearch=1";}
                            let a_user_search=create_a(ary[i][j],link,["inline_block","user_a_panel_12px","user_a_panel_alpha","userid"],true,output);
                            if(is_load_avataruserpic){
                                create_node("br",[],true,a_user_search);
                                let random=Math.random();
                                random=random>0.5?random:random*2;
                                let delay=j*1000+Math.floor(j/5)*500*5+Math.floor(j/10)*1000+parseInt(1000*random,10);
                                window.setTimeout(( () => {
                                    create_img(fn_avataruserpic(ary[i][j]),ary[i][j],[],true,a_user_search);
                                } ), delay);
                            }
                        }
                    }
                }
                btn_list_Bo_link.remove();
                btn_list_Bo_avataruserpic.remove();
                btn_list_link.remove();
                btn_list_avataruserpic.remove();
            }
        }
    }else if(url[0].host=="home.gamer.com.tw"){//📻小屋和創作大廳
        if(url[0].pathname.search(new RegExp("/artwork.php", "i"))==0){//🛄小屋創作
            let div_reply_box=document.querySelectorAll('div.reply-box');
            for(let n=0; n<div_reply_box.length; n++){//小屋創作留言
                let home=div_reply_box[n].querySelectorAll('a.user-avatar-img')[0].href;
                let uid=home.replace(/https:\/\/home.gamer.com.tw\//i, '');
                let div_reply_commtent=div_reply_box[n].querySelectorAll("div.reply-commtent")[0];
                fn_add_ary(ary,[uid],[div_reply_commtent],["user_btn_tag_ridge","sans_condensed"]);
            }
        }else if(url[0].pathname.search(new RegExp("/friendList.php", "i"))==0){//🛄舊版小屋好友圈，請右鍵開新分頁
            let str_list=[];
            //GM_registerMenuCommand("好友", () => {/*GM_openInTab("https://");*/});
            let div_user_name=document.querySelectorAll('div.user_name');
            for(let n=0; n<div_user_name.length; n++){
                let uid=div_user_name[n].querySelectorAll('.user_id')[0].textContent;
                str_list.push("'"+uid+"'");
                let div_no_flex=create_div(["no_flex"],true,div_user_name[n]);
                fn_add_ary(ary,[uid],[div_no_flex],["user_btn_tag_ridge"]);
            }
            let output_btn=document.querySelectorAll('.friend_menu_ul');
            if(output_btn.length==1){
                let btn_copy=create_btn("\uE14D複製此用戶所有好友列表",["btn--sm","btn--normal","user_btn","code","cursor_copy"],true,output_btn[0]);
                btn_copy.title="複製此用戶所有好友列表";
                btn_copy.addEventListener('click',() =>{
                    GM_setClipboard(str_list, "text");
                });
            }
        }
        let avatar_info_box=document.querySelectorAll('div.BH-list4>a,div.MSG-box12>a');//舊版小屋追蹤者
        if(avatar_info_box.length==0){avatar_info_box=document.querySelectorAll('div.BH-lbox>a');}//舊版小屋今日訪客
        if(avatar_info_box.length==0){avatar_info_box=document.querySelectorAll('div.avatar-info-box>a');}//新版小屋
        for(let n=0; n<avatar_info_box.length; n++){//小屋訪客之類的，鏈接繁雜
            let home=avatar_info_box[n].href;
            let uid=home.replace(/https:\/\/home.gamer.com.tw\//i,"");
            uid=uid.replace(/home.php\?owner=/i,"");
            fn_add_ary(ary,[uid],[avatar_info_box[n]],["user_btn_tag_groove","sans_condensed"]);
        }
    }else if(url[0].host=="guild.gamer.com.tw"){//📻公會
        let timeoutID=window.setInterval(( () => fn_setInterval_guild() ),3000);
    }else if(url[0].host=="gnn.gamer.com.tw"){//📻GNN
        if(url[0].pathname.search(new RegExp("/detail.php", "i"))==0){//🛄
            let timeoutID=window.setInterval(( () => fn_setInterval_gnn_detail() ),3000);
        }
    }else if(url[0].host=="user.gamer.com.tw"){//📻會員中心
        if(url[0].pathname.search(new RegExp("/help/abuse.php", "i"))==0){//🛄停權名單查詢
            let water=document.querySelectorAll('table>tbody>tr');
            for(let n=0; n<water.length; n++){
                let td=water[n].querySelectorAll('td');
                fn_add_ary(ary,[td[0].textContent],[td[1]],["user_btn_tag_groove","sans_condensed"]);
            }
        }
    }
    /*if(url[0].host=="haha.gamer.com.tw"&&url[0].pathname.search(new RegExp("/index2.php", "i"))==0){//📻舊版廣場聊天室index2.php?room=
        if(url[0].host=="forum.gamer.com.tw"){window.setTimeout(( () => fn_setInterval_chatRoom() ),3000);}
        let timeoutID=window.setInterval(( () => fn_setInterval_chatRoom() ),10000);
        window.setTimeout(( () => clearInterval(timeoutID) ),900000);
    }*/
    if(url[0].pathname.search(new RegExp("/B.php", "i"))==0||url[0].host=="now.gamer.com.tw"&&url[0].pathname.search(new RegExp("/chat.php", "i"))==0){//📻圖片上限回到300KB的NOW
        if(url[0].host=="now.gamer.com.tw"){window.setTimeout(( () => fn_setInterval_now_chatroom() ),5000);}
        let timeoutID=window.setInterval(( () => fn_setInterval_now_chatroom() ),15000);
        window.setTimeout(( () => clearInterval(timeoutID) ),900000);
    }
    for(let n=0; n<ary.length; n++){
        //console.log("%c自檢用戶列表%c"+n,css__kaishotai+css_font_size_20px,css__monoserif+css_font_size_14px);
        fn_array(ary[n]);
    }
})();