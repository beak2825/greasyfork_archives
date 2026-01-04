// ==UserScript==
// @name         word copy demo🔧
// @description  a private tool
// @namespace    word_copy_tool_demo
// @author       Covenant
// @version      1.0.4
// @license      MIT
// @homepage
// @match        *://*/*
// @exclude      https://codepen.io/*
// @exclude      file:///*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAMAAADypuvZAAAAPFBMVEUAAACvDwOyDwKyDwOvEACyDgOyDwKvDwKwDgCyDgKxDgOyDgKvDgKyDwKyDgOxDgKzDgKxDgKxEASyDwMgW5ZmAAAAE3RSTlMAQN+/EJDvMB9wYJ9Qz7CAf6CAtGoj/AAAAcFJREFUSMeVltu2gyAMRLlfBDxt+f9/PTq2VXSwmod2GdhkEoIiiPmYinK1VqXt4MUFk9bVxlTyvxBdienhNoJwoYMY+57hdMzBTA4v4/gRaykT1FuLNI0/j/1g3i2IJ8s9F+owNCx+2UlWQXbexQFjjTjN1/lGALS9xIm9QIXNOoowlFKrFssYTtmvuOXpp2HtT6lUE3f11bH1IQu9qbYUBEr7yq8zCxkWuva8+rtF4RrkP6ESxFPoj7rtW30+jI4UQlZuiejEwZ4cMg65RKjjUDz6NdwWvxw6nnLESEAl230O5cldUAdy8P44hJZTYh40DOIKzFw3QOI6hPk9aDiFHJc3nMirKERgEPd7FKKgiy5DEn3+5JsrAfHNtfjVRLucTPTaCA1rxFVz6AX8yYsIUlXoMqbPWFUeXF1Cyqz7Ej1PAXNBs1B1tsKWKpsX0yFhslTetL4mL8s4j2fyslTbjbT7Va2V7GCG5ukhftijXdsoQhGmzSI4QhHGhVufz4QJ/v6Hug6dK0EK3YuM8/3Lx5h3Z0STywe55oxRejM5Qo4aAtZ8eTBuWp6dl3IXgfnnLpyzBCFctHomnSopejLhH/3AMfEMndTJAAAAAElFTkSuQmCC
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_listValues
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/465667/word%20copy%20demo%F0%9F%94%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/465667/word%20copy%20demo%F0%9F%94%A7.meta.js
// ==/UserScript==
var style_font_face;
var style_user_css;
var div_fixed;
var input_word;
var select_idx;
var input_num;
var btn_copy;
var p_console_log;
var novel_text_raw="_null";
var object_URL;
var str_title;
const str_xhtml_epub3_start=`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title></title>
  <link href="../Styles/Style0001.css" type="text/css" rel="stylesheet"/>
</head>

<body>
`;
const str_xhtml_epub3_end=`</body>
</html>`;
if(document.body!=null&&document.head!=null){
    str_title="<h2>"+fn_slice(document.querySelectorAll("head>title")[0].innerText,GM_getValue('trim_title_head',0),GM_getValue('trim_title_end',0))+"</h2>\n";
}
function create_style(textContent,id,class_name){let style=create_style_iframes(textContent,id,class_name,document.body);return style;}
const str_font_mono="'Noto Sans Mono','Noto Mono','Cascadia Mono','Consolas','Droid Sans Mono','Liberation Mono','Monaco','Noto Sans Mono CJK JP','NotoMono_CJK','Courier New',";
const str_font_code="'code_ligature','NotoMono_Slim','Noto Sans Mono','Noto Mono','Cascadia Code','Consolas','Droid Sans Mono','Liberation Mono','Monaco','Courier New',";
const str_font_sans_ja="'Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei',";
const str_font_emoji_end="'symbol_sans','symbol2_sans','emoji_back',",str_font_symbol_end="'symbol_sans','symbol2_sans','color_emoji','emoji_back',";
const font_family_panel="font-family: 'manga_kana',"+str_font_mono+str_font_sans_ja+str_font_symbol_end+"monospace;";
const font_family_code="font-family: 'emoji_patch','Firple Slim',"+str_font_code+"'color_emoji',"+str_font_sans_ja+str_font_emoji_end+"monospace;";
const font_family_panel_important="font-family: 'Noto Sans Mono','Noto Mono','Cascadia Mono','Consolas','Liberation Mono','Monaco','Courier New','flag_patch','flag_white_patch','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','symbol_sans','symbol2_sans','color_emoji','emoji_back',monospace !important;";
const font_face_default=`
@font-face{font-family: 'color_emoji';src: local('Twemoji Mozilla'),local('Noto Color Emoji'),local('Segoe UI Emoji'),local('Apple Color Emoji');}
@font-face{font-family: 'symbol_sans';src: local('Segoe UI Symbol'),local('NotoSansSymbols-Regular'),local('NotoSansSymbols-Regular-Subsetted'),local('Noto Sans Symbols'),local('Apple Symbols'),local('Meiryo');}
@font-face{font-family: 'symbol2_sans';src: local('NotoSansSymbols2-Regular'),local('NotoSansSymbols-Regular-Subsetted2'),local('Symbola');}
@font-face{font-family: 'emoji_back';src: local('Noto Color Emoji'),local('Toss Face Font Web'),local('Segoe UI Emoji');}
@font-face{font-family: 'DroidSans_Mono';src: local('DroidSansMono');}\n@font-face{font-family: 'Cutive_Mono';src: local('Cutive Mono');}
@font-face{font-family: 'Roboto_Regular';src: local('Roboto');}\n@font-face{font-family: 'Noto_Serif';src: local('NotoSerif');}
@font-face{font-family: 'Dancing_Script';src: local('DancingScript'),local('DancingScript-Regular');}\n@font-face{font-family: 'Coming_Soon';src: local('ComingSoon'),local('ComingSoon-Regular');}
@font-face{font-family: 'Carrois_GothicSC';src: local('CarroisGothicSC-Regular');}\n@font-face{font-family: 'NotoMono_CJK';src: local('Noto Sans Mono CJK JP'),local('NotoSansMonoCJKjp-Regular');}\n`;
if(document.body!=null){
    style_font_face=create_style(font_face_default,"gm_font_face_word_copy_demo",["user_gm_css","css_word_copy_demo"]);
    style_user_css=create_style(".user_input_fixed_novel,.user_opt_fixed_novel,.p_console_log{"+font_family_panel_important+"font-weight: 300;}\n","gm_user_css_word_copy_demo",["user_gm_css","css_word_copy_demo"]);//questions/2570972/
    style_user_css.textContent+=`input.user_input_fixed_novel{width: auto;max-width: 95%;border-radius: 0.5rem; font-size: 110%;padding: 0.25em;max-height: 2em;}
.user_btn_panel_fixed_novel,.user_a_panel_fixed_novel{min-width: 5em;min-height: 1em;max-height: 2em;`+font_family_panel_important+`font-weight: 400;}
.user_a_panel_fixed_novel{display: inline-block;text-align: center;border-style: dashed;border-width: 1px;}
.user_select_fixed_novel{font-size: 0.75rem;padding: 0.25rem;min-width: 5em;max-width: 7em;}
.input_querySelectorAll_novel{min-width: 32rem;}\n.p_console_log{background: #00000080;}
input[type="checkbox"].user_checkbox~label{margin-right: 0.5em;cursor: pointer;}\ndiv.div_checkbox{min-width: 2em;background: #00000080;}\ndiv.user_checkbox_inline{display: inline-block;}
.user_btn_margin{margin-right: 2px;margin-left: 3px;margin-top: 1px;margin-bottom: 1px;padding: 0.1rem 0.5rem;}
.text_border{color: #000000;text-shadow: -1px -1px 0px #FFFFFF,0px -1px 0px #FFFFFF,1px -1px 0px #FFFFFF,-1px  0px 0px #FFFFFF,1px  0px 0px #FFFFFF,-1px  1px 0px #FFFFFF,0px  1px 0px #FFFFFF,1px  1px 0px #FFFFFF;}
.display_none{display: none;}
.inline_block{display: inline-block;}\ndiv.div_br{width: 100%;}
.user_div_fixed_novel{position:fixed !important;z-index: 65535;top: 40%;right: 0px;}
.user_div_fixed_novel{background: #00000033;min-width: 50%;max-width: 75vw;}
.user_div_fixed_novel *{direction: ltr;}
.rtl.rtl.rtl.rtl,.user_div_fixed_novel.user_div_fixed_novel.user_div_fixed_novel.user_div_fixed_novel{direction: rtl;}\n`;
}
function create_div(class_name,is_appendChild,node,refNode){
    let div=create_node("div",class_name,is_appendChild,node,refNode);
    div.style.backgroundSize='contain';
    div.style.backgroundRepeat='no-repeat';
    div.lang='ja';
    return div;
}
function create_input(placeholder,class_name,is_num,is_appendChild,node,refNode){
    let input=create_node("Input",class_name,is_appendChild,node,refNode);
    input.placeholder=placeholder;
    input.type="text";
    if(is_num)input.size="10";
    if(is_num)input.setAttribute("maxlength", "10");
    //if(is_num)input.setAttribute("oninput","this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*?)\\..*/g, '$1');");
    if(is_num){
        input.addEventListener("input", function (e){
            this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        });
        input.style.setProperty("text-align", "right");
    }return input;
}
function create_btn(innerText,class_name,is_appendChild,node,refNode){
    let btn=create_node_text("button",innerText,class_name,is_appendChild,node,refNode);
    return btn;
}
function create_a(innerText,url,class_name,is_appendChild,node,refNode){
    let anchor=create_node_text("a",innerText,class_name,is_appendChild,node,refNode);
    anchor.href=url;
    anchor.title=innerText;
    if(url.search(new RegExp("javascript", "i"))!=0||url.indexOf(":")!=10)anchor.target="_blank";
    return anchor;
}
function create_select(class_name,is_multiple,size,is_appendChild,node,refNode){
    let select=create_node("select",class_name,is_appendChild,node,refNode);
    select.setAttribute("multiple", is_multiple);
    select.setAttribute("size", size);
    return select;
}
function create_checkbox(innerText,id,is_block,is_checked,class_name,is_appendChild,node,refNode){
    const div_class=is_block?"div_checkbox":["div_checkbox","user_checkbox_inline"];
    let div=create_div(div_class,is_appendChild,node,refNode);
    let input=create_node("Input",class_name,true,div);
    input.type="checkbox";
    input.id="cb_"+id;
    input.value=id;
    if(is_checked==true)input.checked=true;
    let lbl=create_node_text("label",innerText,"user_lbl",true,div);
    lbl.htmlFor=input.id;
    return input;
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
function console_log(text,bool){
    let div_log=p_console_log;
    div_log.innerHTML+=text+" ";
    if(bool){div_log.innerHTML+="<br>";}
    else if(bool==undefined){div_log.innerHTML=text;}
}
function fn_remove_multiple_line_breaks(str){//questions/22962220
    return str.replace(/(\r\n|\r|\n){2}/g, '$1').replace(/(\r\n|\r|\n){3,}/g, '$1\n');
}
function fn_slice(str,head,end){
    str=parseInt(end)=="0"?str.slice(head):str.slice(head, parseInt(end)*(-1));
    return str;
}
//console.log("break");
function fn_str2xhtml_node(str){
    let ary_str=str.split('\n');
    let innerHTML="";
    for(let i=0; i<ary_str.length; i++){
        let element=document.createElement("p");
        element.textContent=ary_str[i];
        innerHTML+=element.outerHTML+"\n";
    }
    return innerHTML.replaceAll("&nbsp;","");
}
function fn_str2xhtml_full(str,title){
    title=(typeof title==='string')?title:"";
    return str_xhtml_epub3_start+title+fn_str2xhtml_node(str)+str_xhtml_epub3_end;
}
function fn_char2u(char){
    return "\\u"+("0000"+char.charCodeAt(0).toString(16)).slice(-4);
}
function fn_querySelectorAll(){
    try{
        let node=document.querySelectorAll(input_word.value);
        if(node.length>0){
            select_idx.innerText="";
            for(let i=0; i<node.length>0; i++){
                let count_img=node[i].querySelectorAll('img').length;
                let option=create_node("option",["user_opt_fixed_novel"],true,select_idx);
                option.value=i;
                option.innerText=option.value+(count_img>0?" img["+count_img+"]":"");
            }
        }else if(node.length==0){
            select_idx.innerText="";
            let option=create_node("option",["user_opt_fixed_novel"],true,select_idx);
            option.innerText="null";
            option.setAttribute("disabled", true);
        }
    }catch(e){
        console_log(e.message);
    }finally{}
}
function fn_select_idx(){
    input_num.value=select_idx.value;
}
function fn_btn_copy(){
    console_log("");
    try{
        console_log(fn_slice(document.querySelectorAll("head>title")[0].innerText,GM_getValue('trim_title_head',0),GM_getValue('trim_title_end',0)),true);
        let node=document.querySelectorAll(input_word.value);
        if(node.length>0){
            let index=input_num.value==""?0:parseInt(input_num.value);
            index=node.length>index?index:0;
            novel_text_raw=fn_remove_multiple_line_breaks(node[index].innerText);
            btn_copy.innerText="copy "+novel_text_raw.length+";";
            let str_debug=novel_text_raw.substring(0,7);
            for(let i=0; i<str_debug.length>0; i++){
                console_log(fn_char2u(str_debug[i]),false);
            }
        }else if(node.length==0){
            novel_text_raw="_null";
            btn_copy.innerText="copy null";
        }
        //navigator.clipboard.writeText(novel_text_raw);
        return novel_text_raw;
    }catch(e){
        console_log(e.message);
    }finally{}
}
(function() {
    'use strict';
    if(document.body==null)return;
    let panel=GM_getValue('panel', false);
    let epub=GM_getValue('epub', false);
    let is_add_title=GM_getValue('is_add_title', false);
    let selector=GM_getValue('selector', "");
    let trim_title_head=GM_getValue('trim_title_head', 0);
    let trim_title_end=GM_getValue('trim_title_end', 0);
    let idx_page=GM_getValue('idx_page', 1);
    GM_registerMenuCommand('💬input;', () => {
        panel=!panel;
        GM_setValue('panel', panel);
        if(panel){div_fixed.style.removeProperty("display");}else{div_fixed.style.display="none";}
    });
    GM_registerMenuCommand('⚠️epub tool panel beta', () => {
        epub=!epub;
        GM_setValue('epub', epub);
    });
    //div fixed ui
    div_fixed=create_div(["user_div_fixed_novel"],false,document.body,document.body.firstChild);
    if(panel){div_fixed.style.removeProperty("display");}else{div_fixed.style.display="none";}
    let div_g1=create_div(["inline_block"],true,div_fixed);
    input_word=create_input("querySelectorAll(selectors)",["user_input_fixed_novel","input_querySelectorAll_novel"],false,true,div_g1);
    create_div("div_br",true,div_fixed);
    let div_g2=create_div(["inline_block"],true,div_fixed);
    p_console_log=create_node("p",["p_console_log","inline_block"],true,div_g2);
    btn_copy=create_btn("copy",["user_btn_panel_fixed_novel","user_btn_margin"],true,div_g2);
    select_idx=create_select(["user_select_fixed_novel"],true,"5", true, div_g2);
    input_num=create_input("[index]",["user_input_fixed_novel"],true,true,div_g2);
    input_num.title="nodeList[index]";
    if(epub){
        create_div("div_br",true,div_fixed);
        let div_g3=create_div(["inline_block"],true,div_fixed);
        create_node_text("p","dev tool: ",["p_console_log","inline_block"],true,div_g3);
        let checkbox_add_title=create_checkbox("use title at full","",false,is_add_title,[],true,div_g3);
        checkbox_add_title.addEventListener('click',(evt)=> {
            is_add_title=checkbox_add_title.checked;
            GM_setValue('is_add_title', checkbox_add_title.checked);
        });
        let input_trim_title_head=create_input("0",["user_input_fixed_novel"],true,true,div_g3);
        input_trim_title_head.value=trim_title_head;
        input_trim_title_head.addEventListener('input',(evt)=> {
            GM_setValue('trim_title_head', parseInt(input_trim_title_head.value));
        });
        let input_trim_title_end=create_input("0",["user_input_fixed_novel"],true,true,div_g3);
        input_trim_title_end.value=trim_title_end;
        input_trim_title_end.addEventListener('input',(evt)=> {
            GM_setValue('trim_title_end', parseInt(input_trim_title_end.value));
        });
        let btn_xhtml_copy_node=create_btn("xhtml_copy_node",["user_btn_panel_fixed_novel","user_btn_margin","text_border"],true,div_g3);
        let btn_xhtml_copy_full=create_btn("xhtml_copy_full",["user_btn_panel_fixed_novel","user_btn_margin","text_border"],true,div_g3);
        create_div("div_br",true,div_fixed);
        //let btn_download_txt=create_btn("get xhtml",["user_btn_panel_fixed_novel","user_btn_margin","text_border"],true,div_fixed);
        let div_g4=create_div([],true,div_fixed);
        let input_idx_page=create_input("0",["user_input_fixed_novel"],true,true,div_g4);
        input_idx_page.value=idx_page;
        input_idx_page.addEventListener('input',(evt)=>{
            GM_setValue('idx_page', parseInt(input_idx_page.value));
        });
        let a_download=create_a("download xhtml","",["user_a_panel_fixed_novel","user_btn_margin","text_border"],true,div_g4);
        let btn_scroll_end=create_btn("scroll end",["user_btn_panel_fixed_novel","user_btn_margin"],true,div_g4);
        btn_scroll_end.addEventListener('click',() =>{
            window.scrollTo(0, document.body.scrollHeight);
        });
        btn_xhtml_copy_node.addEventListener('click',() =>{
            fn_btn_copy();
            let tmp=fn_str2xhtml_node(novel_text_raw);
            navigator.clipboard.writeText(tmp);
        });
        btn_xhtml_copy_full.addEventListener('click',() => {
            fn_btn_copy();
            let tmp=fn_str2xhtml_full(novel_text_raw,is_add_title?str_title:"");
            navigator.clipboard.writeText(tmp);
        });
        /*btn_download_txt.addEventListener('click',() => {
            let text = 'hello blob';
            let blob = new Blob([text], { type: 'text/plain' });
            let textFile = window.URL.createObjectURL(blob);
            let window2 = window.open(textFile, 'log.' + new Date() + '.txt');
            window2.onload = e => window.URL.revokeObjectURL(textFile);//*/
            /*var blob = new Blob(["abc"], {type:"text/plain"});
            var reader = new FileReader();
            reader.addEventListener("load", function(e) {
                // replace existing `MIME` type with `application/octet-stream`
                var file = "data:application/octet-stream;"
                + e.target.result.split(/;/)[1];
                var saveFile = window.open(file, "_self");
            });
            reader.readAsDataURL(blob)//*/
        /*});//*/
        a_download.addEventListener('mouseover',(event) => {
            window.URL.revokeObjectURL(object_URL);
            event.target.title=(new Date());
            fn_btn_copy();
            let tmp=fn_str2xhtml_full(novel_text_raw,is_add_title?str_title:"");
            idx_page=parseInt(input_idx_page.value);
            if(novel_text_raw=="_null"){
                event.target.href="#";
                event.target.target="_self";
            }else{
                event.target.target="_blank";
                let blob = new Blob([tmp], {type: "text/plain"});
                object_URL = window.URL.createObjectURL(blob);
                event.target.href = object_URL;
                event.target.download = "Section"+idx_page.toString().padStart(4,'0')+".xhtml";
            }
        });
        a_download.addEventListener('click',(event) => {
            idx_page++;
            input_idx_page.value=idx_page;
            GM_setValue('idx_page', parseInt(input_idx_page.value));
            event.target.innerText+="✔️";
        });
    }
    //
    input_word.value=selector;
    input_num.value=0;
    //console_log_tmp(GM_listValues()+" "+panel,true);
    //
    input_word.addEventListener("input", function (event) {fn_querySelectorAll();});
    fn_querySelectorAll();
    select_idx.addEventListener("input", fn_select_idx);
    btn_copy.addEventListener('click',() => {
        fn_btn_copy();
        navigator.clipboard.writeText(novel_text_raw);
    });
    /*input_word.addEventListener("keyup", function(e){
    });//*/
    window.addEventListener("beforeunload", (event) => {
        // set a truthy value to property returnValue
        GM_setValue('selector', input_word.value);
    });
})();
