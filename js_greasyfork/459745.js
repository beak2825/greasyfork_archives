// ==UserScript==
// @name         highlight thread topic starter
// @description  highlight topic starter
// @namespace    gamer_lz
// @author       Covenant
// @version      1.0.1.9
// @license      MIT
// @homepage
// @match        https://*.gamer.com.tw/*
// @exclude      https://m.gamer.com.tw/*
// @icon         data:image/x-icon;base64,AAABAAIAICAAAAEACACoCAAAJgAAABAQAAABAAgAaAUAAM4IAAAoAAAAIAAAAEAAAAABAAgAAAAAAIAEAAAAAAAAAAAAAAABAAAAAAAA////APb29gDw8PAA4+PjAN3d3ADMzMwAxsbGALu7uwCysrIAqqqqAKOjowCZmZkAiIiIAHh4dgBvb28AZmZmAFhYWABSUlEASkpKAEFBQQAzMzMAJycoAAUFBQAAAAAAAgH+AFpNLABwaT8AkIAtAK6aLwCzokkAoJZjAMGzZQDPxpYA49y3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcMDBMMBxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIERAIFxcXBBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBERFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQDxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXEBIIFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBASFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIEBAXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEAkXFxcXFxcXFxcEFxcXFxcXFxcXFxcXFxcXFxcXFxAQDBcXFxcXFxcXFwwXFxcXFxcXFxcXFxcXFxcXFxcXCA4QCBcXFxcXFwkOFxcXFxcXFxcXFxcXFxcXFxcXFxcXCA8SEAwXFwwODBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBISEw4MDwgXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFw4QFxcXFxcXFxcXFxcXChEREQoXFxcJCQ4OEhIRERMXFw4QEQkXFxcXFxcXFxcXFxcKEREREREREwkXCQkJERAQCgoREBcXFxcXFxcXFxcXFxcXChcKFwoXFxcXFxcJChERERERDBcMCRcMEhcXFxcXFxcXFxcXFxcXFxcRFxcXCQoRERERDBMSEhEcFxcXFxcXFxcXFxcXFxcXFwoRCRcXAwoREREREBocFxcXFxcXFxcXFxcXCRECFxcXChMTEREREBERHBERCRcXFxcXFxcXFxcXFxcXChEJCQkREREREREREREcAgsPCRIXFxcXFxcXFxcXFxcXChERERERERERERERExwXFwwSCRIXFxcXFxcXFxcXFxcNERERERERERERERERHBcKEgoSFxcXFxcXFxcXFxcXChEREREREREREREREREUERcXFxcXFxcXFxcXFxcXCg0NERERERERERERERERDQ0cCBIXFxcXFxcXFwoKDRERERERERERERERERENDQ0cHBwdIRcXFwoTEhEQERESEhINDQ0NDQ0NDQ0NDQ0cHBwdFxcXFxcXFxcXFxcXFxchHBwcHBweHh4eHBwcHBwhFxcXFxcXFxcXFxcXFxchHBwcHBwcHBwcHBwcHCEXFxcXFxcXFxcXFx8fHhwcHBwcHBwcHBweHyEhFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf////////wf///w7///4////8f////H////j////4////+P////h/3//8f9///D8///4Mf///AP///8//BwBh/+AIAf/6vwCT//3AA//8YA//HAAf/4AAB//AAMP/wACH/4AAf/4AAB/gAAAcAAAA//wAA//wAB/8AAH///////ygAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAEAAAAAAAD///8A////APDw8ADj4+MA3d3cAMzMzADGxsYAu7u7ALKysgCqqqoAo6OjAJmZmQCIiIgAeHh2AG9vbwBmZmYAWFhYAFJSUQBKSkoAQUFBADMzMwAnJygABQUFAAAAAAACAf4AWk0sAHBpPwCQgC0ArpovALOiSQCglmMAwbNlAM/GlgDj3LcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXFxcXFxcGDAgIFxcXFxcXFxcXFxcEERcXFwgXFxcXFxcXFxcEEAUXFxcXFxcXFxcXFxcXCBAXFxcXFxcXFxcXFxcXFwgQFxcXFxcGFxcXFxcXFxcEEAwXFxcMFxcXFxcXFxcXFwgSDA8OBBcXFwwXFxcXFxcXCBAPFxcXBhcXCgwLDA0NDQoIEQ8IBQ0XFxcGFwkXFw0PDxEREwwXFxcXFxcXFwwKFw8RHBEJFxcXFxcXDAkXDxEREREXEgcSFxcXFxcMEREREREPFwgSFwYODRERERERDxwcHBwPFxcXFyEfHxwcHBwcICEXFxcXIRwcHBwcHCAhFxcXFxcXF/8P///+d////H////z////8+////Hf///4H//9/Hf//gAH//9YD///8g///8gj///gJ//8AA///wA///wB///8=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/459745/highlight%20thread%20topic%20starter.user.js
// @updateURL https://update.greasyfork.org/scripts/459745/highlight%20thread%20topic%20starter.meta.js
// ==/UserScript==
const isAppendChild=true,isLZ=true,isSide=true,isSenior=true;
const strIsNotFound=-1,strIsFoundFirst=0;
var intervalID_toast;
var style_font_face,style_user_css;
function create_style(textContent,id,class_name){let style=create_style_iframes(textContent,id,class_name,document.body);return style;}
const str_font_sans_en="BlinkMacSystemFont,'Helvetica Neue','Noto Sans','Roboto','Segoe UI','Liberation Sans','Arial',",str_font_serif_en="'Noto Serif','Times','Times New Roman','Liberation Serif',";
const str_font_mono="'Menlo','Noto Mono','Cascadia Mono','Consolas','Droid Sans Mono','Liberation Mono','Monaco','NotoMono_CJK','Courier New',";
const str_font_code="'code_ligature','NotoMono_Slim','Menlo','Noto Mono','Cascadia Code','Consolas','Droid Sans Mono','Liberation Mono','Monaco','Courier New',";
const str_font_narrow_sans="'sans-serif-condensed-light','Arial Narrow','Ubuntu Condensed','Nimbus Sans Narrow',";
const str_font_sans_ja="'IBM Plex Sans JP','Hiragino Kaku Gothic ProN','Noto Sans CJK JP','Meiryo','Yu Gothic','IBM Plex Sans TC','PingFang TC','Microsoft JhengHei','NotoMono_CJK',";
const str_font_sans_ja_Yu_Gothic=str_font_sans_ja.replace(/'Meiryo',/i,""),str_font_sans_ja_MS_Gothic=str_font_sans_ja.replace(/'Meiryo',/i,"'MS Gothic','Meiryo',");
const str_font_serif_ja="'Noto Serif CJK JP','Yu Mincho','MS Mincho','MOESongUN','TW-Sung','TW-Sung-Ext-B','TW-Sung-Plus','LiSong Pro','Songti TC','SimSun','SimSun-ExtB',";
const str_font_kaishotai_ja="'HGSeikaishotaiPRO','manga_kana','TW-MOE-Std-Kai','TW-Kai','TW-Kai-Ext-B','TW-Kai-Plus','BiauKaiTC','BiauKai','YuKyokasho Yoko','UD Digi Kyokasho NK-R','DFKai-SB','AR PL UKai TW','Klee','Hiragino Maru Gothic ProN',";
const str_font_emoji_end="'symbol_sans','emoji_back',",str_font_symbol_end="'symbol_sans','color_emoji','emoji_back',";
const str_font_sans_zh="'IBM Plex Sans TC','PingFang TC','Noto Sans CJK JP','Microsoft JhengHei','Hiragino Kaku Gothic ProN','Yu Gothic','NotoMono_CJK',";
const str_font_serif_zh="'Noto Serif CJK JP','MOESongUN','TW-Sung','TW-Sung-Ext-B','TW-Sung-Plus','LiSong Pro','Songti TC','PMingLiU','PMingLiU-ExtB','Yu Mincho','MS Mincho',";
const str_font_icon="'FontAwesome','Material Icons',";
const str_font_Iosevka_code="'Iosevka_Slab_code','Iosevka','Iosevka Curly','Firple Slim',";
const str_font_Iosevka_std="'Iosevka_code','Iosevka Fixed Slab','Iosevka Fixed Curly Slab','Iosevka Slab','Iosevka Curly Slab','Firple Slim',";
const font_family_default="font-family: 'emoji_patch','manga_kana','kaiti_bpmf',"+str_font_sans_en+"'color_emoji',"+str_font_sans_ja+str_font_icon+str_font_emoji_end+"-apple-system,sans-serif;";
const font_family_serif_2="font-family: 'emoji_patch','sans_kana',"+str_font_serif_en+"'color_emoji',"+str_font_serif_ja+str_font_icon+str_font_emoji_end+"serif;";
const font_family_sans="font-family: 'emoji_patch',"+str_font_sans_en+"'color_emoji',"+str_font_sans_ja+str_font_icon+str_font_emoji_end+"-apple-system,sans-serif;";
const font_family_serif="font-family: 'emoji_patch',"+str_font_serif_en+"'color_emoji',"+str_font_serif_ja+str_font_icon+str_font_emoji_end+"serif;";
const font_family_panel="font-family: 'manga_kana',"+str_font_mono+str_font_sans_ja+str_font_icon+str_font_symbol_end+"monospace;";
const font_family_code="font-family: 'emoji_patch',"+str_font_Iosevka_code+str_font_code+"'color_emoji',"+str_font_sans_ja+str_font_icon+str_font_emoji_end+"monospace;";
const font_family_submit="font-family: 'emoji_patch',"+str_font_Iosevka_std+str_font_mono+"'color_emoji',"+str_font_sans_ja_MS_Gothic+str_font_emoji_end+"monospace;";
const font_family_condensed="font-family: 'emoji_patch',"+str_font_narrow_sans+str_font_sans_en+"'color_emoji',"+str_font_sans_ja_Yu_Gothic+str_font_icon+str_font_emoji_end+"-apple-system,sans-serif;";
const font_family_panel_cond="font-family: "+str_font_Iosevka_std+str_font_mono+str_font_sans_ja+str_font_icon+str_font_symbol_end+"monospace;";
const font_family_txt="font-family: 'emoji_patch','kaiti_bpmf','manga_kana','Roboto','Arial','Segoe UI','Liberation Sans','color_emoji',"+str_font_sans_zh+str_font_emoji_end+"-apple-system,sans-serif;";
const font_family_monoserif="font-family: 'kaiti_bpmf','Cutive Mono','Courier New','Liberation Mono',"+str_font_sans_ja+str_font_icon+str_font_symbol_end+"monospace;";
const font_family_serif_zh="font-family: 'emoji_patch','sans_bpmf','sans_kana',"+str_font_serif_en+"'color_emoji',"+str_font_serif_zh+str_font_emoji_end+"serif;";
const font_family_mono_kaishotai="font-family: 'emoji_patch',"+str_font_mono+str_font_kaishotai_ja+str_font_symbol_end+"cursive;";
const u_r_emoji_patch="U+00A9,U+00AE,U+203C,U+2049,U+2122,U+2139,U+2328,U+23CF,U+25AA-25AB,U+2600-2604,U+260E,U+2618,U+2620,U+2622-2623,U+2660-2668,U+267B,U+267E,U+2692,U+2694-2697,U+2699,U+269B-269C,U+26A0,U+26B0-26B1,U+26BD-26BE,U+2702,U+2708-2709,U+270F,U+2712,U+2733-2734,U+2744,U+2747,U+2763-2764,U+3030,U+303D,U+1F191-1F19A;";
const u_r_kana="U+3041-3096,U+30A1-30FE,U+32D0-32FE,U+FF65-FF9F,U+3001-3002,U+3005-3006,U+3031-3035,U+3099-309F,U+31F0-31FF,U+3300-3357,U+FE11-FE12,U+FE45-FE46,U+FE51,U+FE61,U+FE64,U+1F200-1F202,U+1F213";
const u_r_bpmf="U+3105-3129,U+302D-302F,U+02C7,U+02C9-02CB,U+02D9,U+FF0C,U+3001-3002,U+FF0E,U+22EF,U+FF1A";
const u_r_iosevka_emoji_range="U+00A9,U+00AE,U+200D,U+203C,U+2049,U+2122,U+2139,U+2194-2199,U+21A9-21AA,U+231A-231B,U+2328,U+23CF,U+23E9-23F3,U+23F8-23FA,U+25AA-25AB,U+25B6,U+25C0,U+25FB-25FE,U+2600,U+2611,U+261D,U+2626,U+2639-263A,U+2640,U+2642,U+2699,U+269B,U+26A1,U+26AA-26AB,U+2714,U+2716,U+271D,U+2733-2734,U+274C,U+2764,U+27A1,U+2B05-2B07,U+2B1B-2B1C,U+2B50,U+2B55,U+FE0F,U+1F191-1F19A,U+1F311-1F318,U+1F514,U+1F550-1F567,U+1F610,U+1F636,U+1F641-1F643";
const str_font_console_std="'Noto Mono','Cascadia Mono','Consolas','Menlo','Droid Sans Mono','Liberation Mono','Monaco','Noto Sans Mono CJK JP',";
const str_font_console_monoserif="'Cutive Mono','FreeMono','Courier New','Liberation Mono',";
const str_font_console_emoji="'Twemoji Mozilla','Noto Color Emoji','Segoe UI Emoji',";
const str_font_console_sans_ja=str_font_sans_ja;
const str_font_console_kaishotai="'HGSeikaishotaiPRO','BiauKaiTC','BiauKai','YuKyokasho Yoko','UD Digi Kyokasho NK-R','DFKai-SB','AR PL UKai TW','Klee',";
const css__mono_std="font-family: "+str_font_console_std+str_font_console_emoji+str_font_console_sans_ja+"-apple-system,sans-serif;font-weight: 100;";
const css__monoserif="font-family: "+str_font_console_monoserif+str_font_console_emoji+str_font_console_sans_ja+"-apple-system,sans-serif;font-weight: 100;";
const css__kaishotai="font-family: "+str_font_console_std+str_font_console_emoji+str_font_console_kaishotai+"-apple-system,sans-serif;font-weight: 100;";
const css_font_size_14px="font-size: 14px;",css_font_size_20px="font-size: 20px;",css_font_size_72px="font-size: 72px;";
style_font_face=create_style("","gm_font_face_gamer_default",["user_gm_font_face","css_gamer_default"]);
style_user_css=create_style("button,.sans,.user_details,.span_title,.dropdown-group,.user_btn_tag_ridge,.user_btn_tag_groove{"+font_family_default+"font-weight: 100;}","gm_user_css_gamer_default",["user_gm_css","css_gamer_default"]);
fn_css();
function create_div(class_name,is_appendChild,node,refNode){
    let div=create_node("div",class_name,is_appendChild,node,refNode);
    div.style.backgroundSize='contain';
    div.style.backgroundRepeat='no-repeat';
    div.lang='ja';
    return div;
}
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
    return img;
}
function create_i(innerText,class_name,is_appendChild,node,refNode){
    var italic=create_node_text("i",innerText,class_name,is_appendChild,node,refNode);
    return italic;
}
function create_style_iframes(textContent,id,class_name,node){
    let style=create_node("style",class_name,isAppendChild,node);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
function create_link_stylesheet(url,class_name,is_appendChild,node,refNode){
    let link_stylesheet=create_node("link",class_name,is_appendChild,node,refNode);
    link_stylesheet.rel="stylesheet";
    link_stylesheet.href=url;
    return link_stylesheet;
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
async function fn_clipboard_w_baha(str,toast_pos){
    try{
        fn_setTimeout_toast("成功複製"+str,"info",toast_pos);
        await navigator.clipboard.writeText(str);
    }catch(e){alert(e.message);}
    finally{}
}
//console.log("%cbreak",css__mono_std);
function fn_create_b_mark(is_lz,is_side,is_senior,is_appendChild,node,refNode){//!isSenior red
    let ary_class_div=["b-mark","pointer_events_none"];//div背景顏色，在側邊，等級決定顏色，主文是樓主/吃樓決定顏色，主文會字體符號放大和位置修復
    ary_class_div=ary_class_div.concat(is_side?[is_senior?"b-mark--update":"b-mark--feature"]:[is_lz?"b-mark--update":"b-mark--feature","user_mark_fix","user_mark_1_5rem"]);
    let div_mark=create_div(ary_class_div,is_appendChild,node,refNode);
    div_mark.title=is_lz?"樓主":"吃樓";
    let ary_class_i=["material-icons","material_icons_100",is_lz?"feature":"raise"];
    if(!is_side)ary_class_i.push("user_mark_1_5rem");
    create_i(is_lz?"\uE029":"\uE5D8",ary_class_i,isAppendChild,div_mark);//Material Icons
}
function fn_create_BH_menu__switch_box(is_on,is_appendChild,node,refNode){
    let div_switch_box=create_div(["BH-menu__switch-box"],is_appendChild,node,refNode);
    if(is_on)div_switch_box.classList.add("is-on");
    let input_themeSwitch=create_node("input","BH-menu__switch-box__switch-input",isAppendChild,div_switch_box);
    input_themeSwitch.id="themeSwitch";input_themeSwitch.type="checkbox";
    let lbl_option=create_node("label","BH-menu__switch-box__option",isAppendChild,div_switch_box);
    lbl_option.setAttribute("for", "themeSwitch");
    create_node_text("span","ON",["BH-menu__switch-box__active-state","mono"],isAppendChild,lbl_option);
    create_div("BH-menu__switch-box__icon",isAppendChild,lbl_option);
    create_node_text("span","OFF",["BH-menu__switch-box__inactive-state","mono"],isAppendChild,lbl_option);
    return div_switch_box;
}
function fn_create_toast_info(innerText,toast_class,div_toast_container){
    let div_toast=create_node("div",["toast","toast-"+toast_class],isAppendChild,div_toast_container);
    let div_toast_message=create_node("div",["toast-message"],isAppendChild,div_toast);
    div_toast_message.innerText=innerText;
    return div_toast;
}
function fn_setTimeout_toast(innerText,toast_class,toast_pos){
    //toast_class: success/info/warning/error;toast_pos: toast-top-center/toast-top-left/toast-top-right/toast-bottom-center/toast-bottom-left/toast-bottom-right/
    let div_toast_container;
    if(document.querySelectorAll('.toast_container.'+toast_pos).length!=0){
        div_toast_container=document.querySelectorAll('.toast_container.'+toast_pos)[0];
    }else{
        div_toast_container=create_node("div",["toast_container",toast_pos,"code"],isAppendChild,document.body);
        div_toast_container.id="toast-container";
        intervalID_toast=window.setInterval(( ()=>{
            if(div_toast_container.children.length==0){
                div_toast_container.remove();clearInterval(intervalID_toast);
            }
        }),1000);
    }
    let div_toast=fn_create_toast_info(innerText,toast_class,div_toast_container);
    window.setTimeout(( ()=>{div_toast.remove();}), 5000);
}
function fn_setInterval_lzl_b_mark(lz){
    let lzl=document.querySelectorAll('div.c-reply__item');//留言裡標記樓主
    for(let n=0; n<lzl.length; n++){
        let div_reply_content=lzl[n].querySelectorAll('div>div.reply-content')[0];
        let content__user=div_reply_content.querySelectorAll('a.reply-content__user')[0].href;
        let name=content__user.replace(/https:\/\/home.gamer.com.tw\//i, '');
        if(name.toLowerCase()==lz){
            if(lzl[n].querySelectorAll(".b-mark").length>0)continue;
            fn_create_b_mark(isLZ,isSide,isSenior,isAppendChild,lzl[n]);
        }
    }
}
function fn_setInterval_iframe_editor(iframe){
    let url=fn_url(document.location);
    window.setInterval(( ()=>{
        let iframe_editor=iframe.contentWindow.document;
        if(url[0].pathname.search(new RegExp("/C.php", "i"))==strIsFoundFirst){//🛄哈啦區的文
            let a_is_active=document.querySelectorAll(".BH-menu-forumA-back>a")[0];
            let a_btn_primary=document.querySelectorAll(".toolbar>a.btn-primary")[0];
            if(iframe_editor.body.textContent!=""){//當編輯器有字的時候，在右上角的回覆文章按鈕做出警告
                a_is_active.classList.add("box_shadow_DarkRed");a_is_active.classList.add("outline");
                a_btn_primary.classList.add("box_shadow_DarkRed");a_btn_primary.classList.add("outline");
            }else{
                a_is_active.classList.remove("outline");
                a_btn_primary.classList.remove("outline");
            }
        }
        if(iframe_editor.querySelectorAll('.user_gm_css_iframes').length==0){//更改CSS字體和背景顏色
            let style_user_css=create_style_iframes("body{cursor: n-resize;background-color: unset;"+font_family_submit+"}","gm_user_css_gamer_iframes",["user_gm_css_iframes","css_iframes","css_gamer_default"],iframe_editor.head);
            style_user_css.textContent+=`hr,table{border-color: #000000;}\nbody{background-size: cover;background-repeat: no-repeat;}
body{background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAACXBIWXMAAAsSAAALEgHS3X78AAAAEklEQVR4nGOor6//j4wZSBcAADwPJ8HvrO2XAAAAAElFTkSuQmCC");}
@font-face{font-family: 'color_emoji';src: local('Twemoji Mozilla'),local('Noto Color Emoji'),local('Segoe UI Emoji'),local('Apple Color Emoji');}
@font-face{font-family: 'symbol_sans';src: local('Segoe UI Symbol'),local('NotoSansSymbols-Regular'),local('NotoSansSymbols-Regular-Subsetted'),local('Noto Sans Symbols'),local('Apple Symbols'),local('Meiryo');}
@font-face{font-family: 'symbol2_sans';src: local('NotoSansSymbols2-Regular'),local('NotoSansSymbols-Regular-Subsetted2'),local('Symbola');}
@font-face{font-family: 'emoji_patch';src: local('Apple Color Emoji'),local('Noto Color Emoji Compat'),local('Noto Color Emoji'),local('Segoe UI Emoji');unicode-range: `+u_r_iosevka_emoji_range+`;}
@font-face{font-family: 'Firple Slim';src: local('Firple Slim Regular');unicode-range: U+0020-007F;}\n`;
        }
    }), 3000);
}
function fn_setInterval_c_co_5000(){
    let c_post=document.querySelectorAll('.c-post');
    for(let i=0; i<c_post.length; i++){
        let a_floor=c_post[i].querySelectorAll('a.floor')[0];
        let c_reply__item=c_post[i].querySelectorAll('div.c-reply__item');//留言
        for(let i=0; i<c_reply__item.length; i++){
            let comment_floor=c_reply__item[i].querySelectorAll('div.edittime')[0];
            if(comment_floor.querySelectorAll('a').length==1)continue;
            let lzl_floor=comment_floor.innerText;
            comment_floor.innerText="";
            let floor_href=a_floor.href;
            let url_floor=fn_url(floor_href);
            url_floor[0].searchParams.delete('subbsn');
            url_floor[0].searchParams.delete('bPage');
            let Commendcontent=c_reply__item[i].id.replace(new RegExp("Commendcontent_", "i"), "comment");
            create_a(lzl_floor,url_floor[0].toString()+"#"+Commendcontent,[],isAppendChild,comment_floor);
        }
    }
    let btn_add_demonstratio_c=document.querySelectorAll('#add-demonstratio_c');
    btn_add_demonstratio_c.forEach((fe_add_demonstratio_c,i) =>{
        if(fe_add_demonstratio_c.title=="發文稱號"){
            fe_add_demonstratio_c.classList.add("alert");
        }else{fe_add_demonstratio_c.classList.remove("alert");}
    });
}
function fn_setTimeout_c_co_10000(){
    let btn_last_reply=document.querySelectorAll('button[last-reply]');
    if(btn_last_reply.length>0){
        btn_last_reply[0].classList.add("box_shadow_DarkRed");
    }
    let c_post=document.querySelectorAll('.c-post');
    for(let i=0; i<c_post.length; i++){//
        let div_ip_list_main_div=document.querySelectorAll('.ip-list-main-div');
        div_ip_list_main_div.forEach((fe_ip_list_main_div,i) =>{//📦
            let table_ip=fe_ip_list_main_div.querySelectorAll('.ip-list>table');
            let table_2_tr=table_ip[1].querySelectorAll('tbody>tr');
            if(table_2_tr.length>1){fe_ip_list_main_div.firstChild.classList.add("box_shadow_DarkRed");}
        });
    }//*/
}
(function(){
    'use strict';
    let url=fn_url(document.location);
    let is_dark=false;
    let userid_login="";
    if(document.documentElement.getAttribute("data-theme")!=null){
        if(document.documentElement.getAttribute("data-theme").search(new RegExp("dark", "i"))==0)is_dark=true;
    }
    let topbar_member_home=document.querySelectorAll('a.topbar_member-home');
    let is_login=topbar_member_home.length==1?true:false;
    if(is_login){//添加右上角小屋鏈接的owner參數
        let ary_tmp=fn_url(topbar_member_home[0].querySelectorAll('img')[0].src)[0].pathname.split('/');
        userid_login=is_login?ary_tmp.pop().replace(/_s.png/i, ""):null;
        topbar_member_home[0].href+="?owner="+userid_login;
    }
    if(url[0].host.search(new RegExp("forum.gamer.com.tw", "i"))==strIsFoundFirst){//📻哈啦區
        if(url[0].pathname.search(new RegExp("/C.php", "i"))==strIsFoundFirst||url[0].pathname.search(new RegExp("/Co.php", "i"))==strIsFoundFirst){//🛄哈啦區的文
            let c_post=document.querySelectorAll('.c-post');//樓層位置
            let c_section__side=document.querySelectorAll('.c-section__side');//用戶等級位置
            if(c_post.length>0&&url[0].pathname=="/C.php"&&(url[1].get('page')==null||url[1].get('page')=="1")&&url[1].get('s_author')==null){//🛄需要判斷是不是第一頁
                if(document.querySelectorAll('.c-disable__title.is-except').length==0){//沒有首篇已刪
                    let post__header__title=c_post[0].querySelectorAll('h1')[0].innerText;//標題
                    let lz=c_post[0].querySelectorAll('.userid')[0].innerText.toLowerCase();//樓主id
                    if(post__header__title.search("RE:")!=strIsFoundFirst){
                        for(let i=0; i<c_post.length; i++){
                            let userid=c_post[i].querySelectorAll('.userid')[0].innerText;//各樓層id
                            if(userid.toLowerCase()==lz){
                                let userlevel=c_post[i].parentNode.querySelectorAll('div.userlevel')[0];
                                if(userlevel.classList.contains('senior')||userlevel.classList.contains('master')){//紅色等級
                                    fn_create_b_mark(isLZ,!isSide,isSenior,isAppendChild,c_post[i]);
                                    fn_create_b_mark(isLZ,isSide,isSenior,isAppendChild,c_section__side[i]);
                                }else{
                                    fn_create_b_mark(isLZ,!isSide,!isSenior,isAppendChild,c_post[i]);
                                    fn_create_b_mark(isLZ,isSide,!isSenior,isAppendChild,c_section__side[i]);
                                }
                            }
                        }
                        let timeoutID_lzl_b_mark=window.setInterval(( () => {fn_setInterval_lzl_b_mark(lz);} ), 1000);
                        window.setTimeout(( () => clearInterval(timeoutID_lzl_b_mark) ),900000);
                    }else{//標題有"RE:"，視為吃樓
                        let floor=c_post[0].querySelectorAll('div>a.floor')[0].innerText;
                        if(floor=="樓主"){//在&last=1的情況下，需要檢測是不是第一頁
                            let userlevel=c_post[0].parentNode.querySelectorAll('div.userlevel')[0];
                            if(userlevel.classList.contains('senior')||userlevel.classList.contains('master')){//紅色等級
                                fn_create_b_mark(!isLZ,!isSide,isSenior,isAppendChild,c_post[0]);
                                fn_create_b_mark(!isLZ,isSide,isSenior,isAppendChild,c_section__side[0]);
                            }else{
                                fn_create_b_mark(!isLZ,!isSide,!isSenior,isAppendChild,c_post[0]);
                                fn_create_b_mark(!isLZ,isSide,!isSenior,isAppendChild,c_section__side[0]);
                            }
                        }
                    }
                }
            }
            let timeoutID_c_co_5000 = window.setInterval(( () => fn_setInterval_c_co_5000() ), 5000);//添加留言直達車傳送門的鏈接
            window.setTimeout(( () => clearInterval(timeoutID_c_co_5000) ),900000);
            window.setTimeout(( () => fn_setTimeout_c_co_10000() ), 10000);//標記完整編輯器按鈕
        }
        if(url[0].pathname.search(new RegExp("/C.php", "i"))==strIsFoundFirst){//🛄哈啦區的文，不包含co單樓層
            let div_jumpfloor=document.querySelectorAll('.jumpfloor');
            div_jumpfloor.forEach((fe_jumpfloor,i) =>{//
                if(url[1].get('s_author')==null){
                    window.setTimeout(( () =>{create_a("s_author","https://"+url[0].host+url[0].pathname+url[0].search+"&s_author="+userid_login,["usertitle","code"],!isAppendChild,fe_jumpfloor,fe_jumpfloor.firstChild);}),100);
                }
                if(url[1].get('last')==null){
                    window.setTimeout(( () =>{create_a("看最後一樓","https://"+url[0].host+url[0].pathname+url[0].search+"&last=1#down",["usertitle","code"],!isAppendChild,fe_jumpfloor,fe_jumpfloor.firstChild);}),100);
                }
            });
        }
        let li_dropList=document.querySelectorAll('.BH-menu-forumA-right.dropList');
        li_dropList.forEach((fe_dropList,i) =>{//添加回闇黑模式按鈕，因為沒登入就沒按鈕
            let dropList_dl=fe_dropList.querySelectorAll('dl');
            let dropList_dd=create_node("dd",["code"],isAppendChild,dropList_dl[0]);
            let a_dark=create_a("","javascript:Util.Theme.Dark.toggle();",[],isAppendChild,dropList_dd);
            create_node_text("span","闇黑模式\uE51C",[],isAppendChild,a_dark);
            fn_create_BH_menu__switch_box(is_dark,isAppendChild,a_dark);
        });
    }else if(url[0].host.search(new RegExp("home.gamer.com.tw","i"))==strIsFoundFirst){//📻小屋和創作大廳
        if(url[0].pathname.search(new RegExp("/homeindex.php","i"))==strIsFoundFirst&&url[1].get('owner')!=null){//🛄舊版小屋
            let p_BH_slave_btns=document.querySelectorAll('.BH-slave_btns');
            p_BH_slave_btns.forEach((fe_BH_slave_btns,i) =>{
                create_a("新版好友頁面","https://home.gamer.com.tw/profile/friend_list.php?owner="+url[1].get('owner')+"&t=1",["BH-slave_btnA","sans"],isAppendChild,fe_BH_slave_btns);
            });
        }else if(url[0].pathname.search(new RegExp("/profile/index.php","i"))==strIsFoundFirst){//🛄新版小屋
            let ul_main_nav=document.querySelectorAll('nav.main-nav>ul');
            ul_main_nav.forEach((fe_main_nav,i) =>{
                let li_friend_list=create_node("li",[],isAppendChild,fe_main_nav);
                let a_friend_list=create_a("好友","https://home.gamer.com.tw/profile/friend_list.php?owner="+url[1].get('owner')+"&t=1",["sans_condensed"],isAppendChild,li_friend_list);
                let li_showdress=create_node("li",[],isAppendChild,fe_main_nav);
                let a_showdress=create_a("査看勇者裝備一覽","https://avatar1.gamer.com.tw/showdress.php?uid="+url[1].get('owner'),["sans_condensed"],isAppendChild,li_showdress);
                a_showdress.title="不知道這個頁面什麼時候會被移除";
            });
        }else if(url[0].pathname.search(new RegExp("/setting/sticker_reorder.php","i"))==strIsFoundFirst){//🛄貼圖編輯排序
            window.setTimeout(( () =>{
                (function fn_setTimeout_sticker_reorder_1000(){
                    let tr_ui_sortable=document.querySelectorAll('tbody>tr');console.log("%c"+tr_ui_sortable.length,css__mono_std);
                    tr_ui_sortable.forEach((fe_ui_sortable,i) =>{
                        let td=fe_ui_sortable.querySelectorAll('td');
                        let sticker_id=fe_ui_sortable.dataset.id;console.log("%c"+sticker_id,css__mono_std);
                        create_img("https://im.bahamut.com.tw/sticker/"+sticker_id+"/sticker_"+sticker_id+".png",sticker_id,["max_width_44px","img_middle"],!isAppendChild,td[0],td[0].childNodes[1]);
                        create_node_text("p","id: "+sticker_id,["mono"],isAppendChild,td[1]);
                    });
                })();
            }),1000);
        }else if(url[0].pathname.search(new RegExp("/homeWallpaperPreview.php","i"))==strIsFoundFirst){//🛄佈景預覽
            let content_name=document.head.querySelectorAll('meta[property="og:title"]')[0].getAttribute("content");
            let get_wsn=url[1].get('wsn');
            document.head.querySelectorAll('title')[0].textContent=content_name;
            let img_cover=create_img("https://p2.bahamut.com.tw/HOME/wallpaper_new/"+get_wsn.padStart(7,"0")+"_cover.JPG","wallpaper_new",["wallpaper_new_cover"],!isAppendChild,document.body.querySelectorAll('div.top')[0]);
            img_cover.setAttribute("style", "background-image: url('https://p2.bahamut.com.tw/HOME/wallpaper_new/"+get_wsn.padStart(7,"0")+"_cover.PNG');min-width: 180px;min-height: 180px;");
            create_node_text("span",content_name,[],!isAppendChild,document.body.querySelectorAll('div.top')[0]);
            /*let button_default=document.querySelectorAll('button');
            for(let i=0; i<button_default.length; i++){//只有登入才有這些按鈕
                let str_onclick=button_default[i].getAttribute("onclick");
                if(str_onclick.search(/homeBookmarkNew/i)==strIsFoundFirst){
                    let str_homeWallpaper_name=str_onclick.split(",")[0].split("'")[1];
                    console.log("%c"+str_homeWallpaper_name,css__mono_std);
                }
            }//*/
        }
    }else if(url[0].host.search(new RegExp("mailbox.gamer.com.tw","i"))==strIsFoundFirst){//📻站內信
        if(url[0].pathname.search(new RegExp("/sentmail.php", "i"))==strIsNotFound){
            window.setTimeout(( () =>{
                let tr_readR=document.querySelectorAll('tr.readR');
                tr_readR.forEach((fe_readR,i) =>{
                    let a_mailTitle=fe_readR.querySelectorAll('a.mailTitle')[0];
                    let td_new=create_node("td",[],isAppendChild,fe_readR);
                    let a_article_manage_forum=create_a("read.php","https://mailbox.gamer.com.tw/read.php?sn="+a_mailTitle.dataset.sn,["keep_all","sans"],isAppendChild,td_new);
                });
            }),3000);
        }
    }
    window.setTimeout(( ()=>{//字體測試區
        if(document.querySelectorAll('.css_emoji_cdn_752e3').length!=0){
            style_user_css.textContent+=`div.content-edit{`+font_family_mono_kaishotai+`font-size: 1.5rem;}
body,textarea,.c-section{`+font_family_txt+`}
.b-list__main__title,.HOME-mainbox1b.HOME-mainbox1b *,.GN-lbox2D.GN-lbox2D *,.GN-lbox3B,.GN-lbox3B *,.GU-gained.GU-gained *{`+font_family_txt.replace(/;/i," !important;")+`}
font[face="Courier New"]{`+font_family_code+`}\n`;
            if(url[0].host.search(new RegExp("home.gamer.com.tw", "i"))==strIsFoundFirst&&(url[0].pathname!="/"&&url[0].pathname.search("/index.php")==strIsNotFound&&url[0].pathname.search("/artwork.php")==strIsNotFound)){
                style_user_css.textContent+="body,.c-section,.b-list__main__title{font-weight: 400;}";//排除掉創作大廳，剩下的都視為小屋（不准確但夠用）
            }else{style_user_css.textContent+="body,.c-section,.c-article,.b-list__main__title{font-weight: 100;}";}
            //iframe發文回文編輯器
            let iframe_editor=document.querySelectorAll('iframe#editor');
            iframe_editor.forEach((fe_editor,i) =>{
                fn_setInterval_iframe_editor(fe_editor);
            });
        }
    }),1000);
})();
function fn_css(){
    const font_face_default=`.fontawesome_4_3_0_star_wars>li{list-style-type: fontawesome_4_3_0_star_wars;}
@counter-style fontawesome_4_3_0_star_wars{system: cyclic;symbols: '\uF1D1' '\uF1D0';}
@counter-style fontawesome_4_3_0_flag{system: cyclic;symbols: '\uF11D' '\uF11E';}
@counter-style fontawesome_4_3_0_pc_std{system: cyclic;symbols: '\uF17A' '\uF17C';}
@counter-style fontawesome_4_3_0_phone_std{system: cyclic;symbols: '\uF179' '\uF17B';}
@counter-style fontawesome_4_3_0_barcode{system: cyclic;symbols: '\uF02A' '\uF029';}
@font-face{font-family: 'color_emoji';src: local('Segoe UI Emoji');}
@font-face{font-family: 'color_emoji';src: local('Noto Color Emoji');}
@font-face{font-family: 'color_emoji';src: local('Noto Color Emoji Compat');}
@font-face{font-family: 'color_emoji';src: local('Apple Color Emoji');}
@font-face{font-family: 'symbol_sans';src: local('Meiryo'),local('Apple Symbols');}
@font-face{font-family: 'symbol_sans';src: local('Segoe UI Symbol'),local('Symbola');}
@font-face{font-family: 'symbol_sans';src: local('NotoSansSymbols2-Regular'),local('Noto Sans Symbols2');}
@font-face{font-family: 'symbol_sans';src: local('NotoSansSymbols-Regular'),local('Noto Sans Symbols');}
@font-face{font-family: 'symbol_sans';src: local('NotoSansSymbols-Regular-Subsetted2'),local('Noto Sans Symbols');}
@font-face{font-family: 'symbol_sans';src: local('NotoSansSymbols-Regular-Subsetted'),local('Noto Sans Symbols');}
@font-face{font-family: 'emoji_back';src: local('Toss Face Font Web');}
@font-face{font-family: 'emoji_back';src: local('SamsungColorEmoji');}
@font-face{font-family: 'DroidSans_Mono';src: local('DroidSansMono');}\n@font-face{font-family: 'Cutive_Mono';src: local('Cutive Mono'),local('CutiveMono-Regular');}
@font-face{font-family: 'Roboto_Regular';src: local('Roboto');}\n@font-face{font-family: 'Noto_Serif';src: local('NotoSerif');}
@font-face{font-family: 'Dancing_Script';src: local('DancingScript'),local('DancingScript-Regular');}\n@font-face{font-family: 'Coming_Soon';src: local('ComingSoon'),local('ComingSoon-Regular');}
@font-face{font-family: 'Carrois_GothicSC';src: local('CarroisGothicSC-Regular');}\n@font-face{font-family: 'NotoMono_CJK';src: local('Noto Sans Mono CJK JP'),local('NotoSansMonoCJKjp-Regular');}
@font-face{font-family: 'manga_kana';src: local('Yu Mincho'),local('Yu Mincho Light'),local('MS Mincho'),local('Noto Serif CJK JP'),local('NotoSerifCJKjp-Regular'),local('HiraMinProN-W3'),local('PMingLiU'),local('SimSun');unicode-range: `+u_r_kana+`;}
@font-face{font-family: 'kaiti_bpmf';src: local('PMingLiU'),local('Noto Serif CJK JP'),local('NotoSerifCJKjp-Regular'),local('BiauKai'),local('LiSong Pro');unicode-range: `+u_r_bpmf+`;}
@font-face{font-family: 'Iosevka_code';src: local('Iosevka'),local('Iosevka Fixed'),local('Iosevka Curly'),local('Iosevka Fixed Curly');unicode-range: U+0020-007F;}
@font-face{font-family: 'Iosevka_Slab_code';src: local('Iosevka Slab'),local('Iosevka Fixed Slab'),local('Iosevka Curly Slab'),local('Iosevka Fixed Curly Slab');unicode-range: U+0020-007F;}
@font-face{font-family: 'emoji_patch';src: local('Apple Color Emoji'),local('Noto Color Emoji Compat'),local('Noto Color Emoji'),local('Segoe UI Emoji');unicode-range: `+u_r_emoji_patch+`;}
@font-face{font-family: 'emoji_patch';src: local('Apple Color Emoji'),local('Noto Color Emoji Compat'),local('Noto Color Emoji'),local('Segoe UI Emoji');unicode-range: `+u_r_iosevka_emoji_range+`;}
@font-face{font-family: 'Firple Slim';src: local('Firple Slim Regular');unicode-range: U+0020-007F;}\n`;
    style_font_face.textContent+=font_face_default;
    style_user_css.textContent+=`/*font*/
.mono.mono,.user_btn_panel,.user_btn_panel_12px,.user_a_panel_12px,div.post-info{`+font_family_panel+`font-weight: 100;}\n.code.code,textarea#source,span.hideip,.ip-list-main-div{`+font_family_code+`font-weight: 300;}
.sans_condensed{`+font_family_condensed+`font-weight: 400;font-stretch: ultra-condensed;}\n.submit{`+font_family_submit+`}\n.ip-list-main-div>button{`+font_family_panel.replace(/;/i,' !important;')+`}
/*for gm css*/
.user_btn_panel,.user_btn_panel_12px,a.user_a_panel_12px{color: #FFFFFF;background: #303030;border-color: #707070;border-width: 0.15rem;border-radius: 4px;border-style: outset;}
.user_btn_panel,.user_btn_panel_12px,.user_a_panel_12px{min-height: 1em;line-height: 1.5em;padding: 0.1rem 0.5rem;margin-top: 1px;margin-bottom: 1px;}
.user_btn_panel,.user_btn_panel_12px{padding-left: 5px;padding-right: 5px;margin-right: 2px;margin-left: 3px;}
.user_btn_panel_12px,.user_a_panel_12px{font-size: 0.75rem;}
.user_btn_panel{min-width: 7em;}\n.user_btn_panel_12px{min-width: 5em;}
.user_btn_panel:active,.user_btn_panel_12px:active{border-style: inset;}
.user_a_panel_12px{display: inline-block;text-align: center;min-width: 3em;}
a.user_a_panel_alpha{background: #30303080;}
.span_title{display: inline-block;min-width: 0.5em;min-height: 0.75em;padding: 4px 6px;border-radius: 3px;background: rgba(17,126,150,.1);color: #117E96;font-size: 0.75rem;}
.span_icon{display: inline-block;width: 18px;height: 18px;line-height: 18px;border: 2px solid #DDDDDD;border-radius: 4px;font-size: 12px;text-align: center;color: #DDDDDD;transform: scale(0.8);}
.span_ridge,.span_groove{font-weight: 100;background: #117E96;color: #FFFFFF;}
.span_ridge,.span_groove{min-width: 5em; min-height: 1em;display: inline-block;padding-top: 2px;padding-bottom: 2px;text-align: center;}
.span_ridge,.span_groove{border-color: #117E96;border-width: 0.15rem;border-radius: 4px;}
.span_ridge{border-style: ridge;padding-left: 2px;padding-right: 3px;}\n.span_groove{border-style: groove;padding-right: 1px;}
.user_details{border-style: dashed;border-color: #707070; border-width: 1px;border-radius: 4px;padding: 2px;box-shadow: 3px 3px 4px black;}
.user_details>div{box-shadow: 3px 3px 4px black;}
.user_details>summary{list-style-type: "📷";}
[open].user_details>summary{list-style-type: "📸";font-style: italic;max-width: 90%;}
[open].user_details>summary::marker{font-style: normal;}
details>summary{cursor: pointer;box-shadow: 3px 3px 4px black;}
.cursor_copy.cursor_copy{cursor: copy;}
.alert.alert.alert.alert.alert{color: DarkRed;}
.wallpaper_new_cover{right: 16px;}
/*default css class*/
.inline_block{display: inline-block;}
.position_fixed,.wallpaper_new_cover{position: fixed}
.text_align_l{text-align: left;}
.break_word{word-break: break-word;}
.keep_all{word-break: keep-all;}
.pointer_events_none{pointer-events: none;}
.f_s_0_75rem{font-size: 0.75rem;}
.f_s_1rem{font-size: 1rem;}
.max_width_100{max-width: 100%;}
/**/
.box_shadow_DarkRed,#anonymous_1{box-shadow: 0rem 0rem 0.5rem DarkRed;}
.toast_container{position: fixed;z-index: 999999;pointer-events: none;}
img.img_middle{vertical-align: middle;}
img.max_width_44px{max-width: 44px;}
.user_mark_fix{left: auto;}
div.user_mark_1_5rem{width: 60px;height: 60px;}\ndiv.user_mark_1_5rem::before{top: -40px;left: -40px;width: 80px;height: 80px;}
i.material-icons.user_mark_1_5rem{top: 4px;left: 4px;font-size: 1.5rem;}
.material_icons_100.material_icons_100{font-weight: 100;}

.cz_bo>a.reply-avatar{border: 2px solid #117E96;box-shadow: 0 0 5px #13AEAB;}/*c-reply__item--fuli-bo*/
.cz_bo::before{
  content: "✦";font-size: 14px;
  position: absolute;top: 2px;left: 76px;
  color: #117E96;text-shadow: 0 0 2px #13AEAB;
}
.cz_bo::after{
  content: "✦";font-size: 12px;
  position: absolute;bottom: 1px;left: 30px;
  color: #117E96;text-shadow: 0 0 2px #13AEAB;
}

/*overwrite webcss*/
.ip-list-main-div tr{border-style: solid;border-width: 1px;}
font[face="Courier New"]{`+font_family_monoserif+`}
font[face="微軟正黑體"]{`+font_family_txt+`}\nfont[face="新細明體"],font[face="細明體"]{`+font_family_serif_zh+`}
font[face="MS Mincho"]{`+font_family_serif_2+`}\nfont[face="標楷體"]{`+font_family_mono_kaishotai+`}
font[face="Arial"]{font-family: 'emoji_patch','Arial','color_emoji',`+str_font_sans_ja+str_font_icon+str_font_emoji_end+`-apple-system,sans-serif;}
font[face="Arial Black"]{font-family: 'emoji_patch','Arial Black','color_emoji',`+str_font_sans_ja+str_font_icon+str_font_emoji_end+`-apple-system,sans-serif;}
font[face="Times New Roman"]{font-family: 'emoji_patch','Times New Roman','color_emoji',`+str_font_serif_ja+str_font_icon+str_font_emoji_end+`-apple-system,sans-serif;}
font[face="Tahoma"]{font-family: 'emoji_patch','Tahoma',`+str_font_sans_en+`'color_emoji',`+str_font_sans_ja+str_font_icon+str_font_emoji_end+`-apple-system,sans-serif;}
font[face="Verdana"]{font-family: 'emoji_patch','Verdana',`+str_font_sans_en+`'color_emoji',`+str_font_sans_ja+str_font_icon+str_font_emoji_end+`-apple-system,sans-serif;}
font[face="Comic Sans MS"]{font-family: 'emoji_patch','Comic Sans MS',`+str_font_sans_en+`'color_emoji',`+str_font_sans_ja+str_font_icon+str_font_emoji_end+`-apple-system,sans-serif;}
input[type="text"]#shareurl,form input,form textarea,form div>p{`+font_family_code+`font-weight: 100;padding: 0.1rem;}\n#shareurl{font-size: 0.75rem;min-width: 32em;}
.option{position:relative;}/*基準設為relative，相對者設為absolute*/
P.user-id.user-id.user-id.user-id.user-id.user-id{text-overflow: clip;}
a.vote-result-more,a.edittime,.outline{outline-style: dashed;outline-color: #707070;outline-width: 1px ;outline-offset: 2px;border-radius: 4px;}
.search-result_article{margin-block-end: 10px;}\n.search-result_article>.row{margin-inline-start: 2rem;}
#anonymous_1:before{background-color: DarkRed;}
textarea[name="source"][name="source"]/*textarea#source*/{font-size: 0.75rem;background-color: #000000 !important;color: #FFFFFF;}\n`;
}
(function fn_is_full_win_emoji(str){
    let div_emoji_test=create_node_text("div","\u{1F6DC}",["div_emoji"]);
    let style_tmp1=create_node("link",[],true,div_emoji_test);
    style_tmp1.type="text/css";style_tmp1.rel="stylesheet";
    style_tmp1.href="https://fontlibrary.org/en/face/adobe-blank";
    let style_tmp2=create_node("style",[],true,div_emoji_test);
    style_tmp2.type="text/css";
    style_tmp2.textContent+="div.div_emoji{display: inline-block;font-family: 'Segoe UI Emoji','AdobeBlankRegular' !important;font-size: 12px;position: fixed;z-index: -255;pointer-events: none;}";
    window.setTimeout(( () =>{
        if(div_emoji_test.clientWidth<10){
            style_font_face.textContent+=`@font-face{font-family: 'color_emoji';src: local('Toss Face Font Web');unicode-range: U+1F1E6-1F1FF,U+1F3F3-1F3F4,U+E0061-E007A,U+E007F;
@font-face{font-family: 'color_emoji';src: local('Twemoji Mozilla');unicode-range: U+1F1E6-1F1FF,U+1F3F3-1F3F4,U+E0061-E007A,U+E007F;}`;
        }
        else{
            str="Windows 11";
            style_font_face.textContent+=`@font-face{font-family: 'color_emoji';src: local('Twemoji Mozilla');
unicode-range: U+1F1E6-1F1FF,U+1F3F3-1F3F4,U+E0061-E007A,U+E007F,U+A9,U+AE,U+203C,U+2049,U+2122,U+2139,U+2196,U+2197,U+2198,U+2199,U+21A9,U+21AA,U+231A,U+231B,U+2328,U+23CF,U+23E9,U+23EA,U+23EB,U+23EC,U+23ED,U+23EE,U+23EF,U+23F0,U+23F1,U+23F2,U+23F3,U+23F8,U+23F9,U+23FA,U+24C2,U+25AA,U+25AB,U+25B6,U+25C0,U+25FB,U+25FC,U+25FD,U+25FE,U+2600,U+2601,U+2602,U+2603,U+2604,U+260E,U+2611,U+2614,U+2615,U+2618,U+2622,U+2623,U+2626,U+262A,U+262E,U+262F,U+2638,U+2639,U+263A,U+2648,U+2649,U+264A,U+264B,U+264C,U+264D,U+264E,U+264F,U+2650,U+2651,U+2652,U+2653,U+265F,U+2660,U+2663,U+2665,U+2666,U+2668,U+267B,U+267E,U+267F,U+2692,U+2693,U+2694,U+2697,U+2699,U+269B,U+269C,U+26A0,U+26A1,U+26AA,U+26AB,U+26B0,U+26B1,U+26BD,U+26BE,U+26C4,U+26C5,U+26C8,U+26CE,U+26CF,U+26D1,U+26D4,U+26E9,U+26EA,U+26F0,U+26F1,U+26F2,U+26F3,U+26F4,U+26F5,U+26F7,U+26F8,U+26FA,U+26FD,U+2702,U+2705,U+2709,U+270F,U+2712,U+2714,U+2716,U+271D,U+2721,U+2728,U+2733,U+2734,U+2747,U+274C,U+274E,U+2753,U+2754,U+2755,U+2757,U+2763,U+2795,U+2796,U+2797,U+27B0,U+27BF,U+2934,U+2935,U+2B05,U+2B06,U+2B07,U+2B50,U+2B55,U+3030,U+303D,U+3297,U+3299,U+1F004,U+1F0CF,U+1F170,U+1F171,U+1F17E,U+1F17F,U+1F18E,U+1F191,U+1F192,U+1F193,U+1F194,U+1F195,U+1F196,U+1F197,U+1F198,U+1F199,U+1F19A,U+1F201,U+1F202,U+1F21A,U+1F22F,U+1F232,U+1F233,U+1F234,U+1F235,U+1F236,U+1F237,U+1F238,U+1F239,U+1F23A,U+1F250,U+1F251,U+1F300,U+1F301,U+1F302,U+1F303,U+1F304,U+1F305,U+1F306,U+1F307,U+1F309,U+1F30A,U+1F30B,U+1F30C,U+1F30D,U+1F30E,U+1F30F,U+1F310,U+1F311,U+1F312,U+1F313,U+1F314,U+1F315,U+1F316,U+1F317,U+1F318,U+1F319,U+1F31A,U+1F31B,U+1F31C,U+1F31D,U+1F31E,U+1F31F,U+1F320,U+1F321,U+1F324,U+1F325,U+1F326,U+1F327,U+1F328,U+1F329,U+1F32A,U+1F32C,U+1F32D,U+1F32E,U+1F32F,U+1F330,U+1F331,U+1F332,U+1F333,U+1F334,U+1F335,U+1F336,U+1F337,U+1F338,U+1F339,U+1F33A,U+1F33B,U+1F33C,U+1F33D,U+1F33F,U+1F340,U+1F341,U+1F342,U+1F343,U+1F345,U+1F346,U+1F347,U+1F348,U+1F349,U+1F34A,U+1F34C,U+1F34D,U+1F34E,U+1F34F,U+1F350,U+1F351,U+1F352,U+1F353,U+1F354,U+1F355,U+1F356,U+1F357,U+1F358,U+1F359,U+1F35A,U+1F35B,U+1F35C,U+1F35D,U+1F35E,U+1F35F,U+1F360,U+1F361,U+1F362,U+1F363,U+1F364,U+1F365,U+1F366,U+1F367,U+1F368,U+1F369,U+1F36A,U+1F36B,U+1F36C,U+1F36D,U+1F36E,U+1F36F,U+1F370,U+1F371,U+1F372,U+1F374,U+1F375,U+1F376,U+1F377,U+1F378,U+1F379,U+1F37A,U+1F37B,U+1F37D,U+1F37E,U+1F37F,U+1F380,U+1F381,U+1F382,U+1F383,U+1F386,U+1F387,U+1F388,U+1F389,U+1F38A,U+1F38B,U+1F38C,U+1F38D,U+1F38E,U+1F38F,U+1F390,U+1F391,U+1F392,U+1F396,U+1F397,U+1F399,U+1F39A,U+1F39B,U+1F39E,U+1F39F,U+1F3A0,U+1F3A1,U+1F3A2,U+1F3A3,U+1F3A5,U+1F3A6,U+1F3A7,U+1F3A9,U+1F3AA,U+1F3AB,U+1F3AC,U+1F3AD,U+1F3AE,U+1F3AF,U+1F3B0,U+1F3B1,U+1F3B2,U+1F3B3,U+1F3B4,U+1F3B5,U+1F3B6,U+1F3B7,U+1F3B8,U+1F3B9,U+1F3BA,U+1F3BB,U+1F3BC,U+1F3BD,U+1F3BE,U+1F3BF,U+1F3C0,U+1F3C1,U+1F3C5,U+1F3C6,U+1F3C8,U+1F3C9,U+1F3CD,U+1F3CE,U+1F3CF,U+1F3D0,U+1F3D1,U+1F3D2,U+1F3D3,U+1F3D4,U+1F3D5,U+1F3D6,U+1F3D7,U+1F3D8,U+1F3D9,U+1F3DA,U+1F3DB,U+1F3DC,U+1F3DD,U+1F3DE,U+1F3DF,U+1F3E0,U+1F3E1,U+1F3E2,U+1F3E3,U+1F3E4,U+1F3E5,U+1F3E6,U+1F3E7,U+1F3E8,U+1F3E9,U+1F3EA,U+1F3EC,U+1F3EE,U+1F3EF,U+1F3F0,U+1F3F5,U+1F3F7,U+1F3F8,U+1F3F9,U+1F3FA,U+1F400,U+1F401,U+1F402,U+1F403,U+1F404,U+1F405,U+1F406,U+1F407,U+1F409,U+1F40A,U+1F40B,U+1F40C,U+1F40D,U+1F40E,U+1F40F,U+1F410,U+1F411,U+1F412,U+1F413,U+1F414,U+1F416,U+1F417,U+1F418,U+1F419,U+1F41A,U+1F41B,U+1F41C,U+1F41D,U+1F41E,U+1F41F,U+1F420,U+1F421,U+1F422,U+1F423,U+1F424,U+1F425,U+1F427,U+1F428,U+1F429,U+1F42A,U+1F42B,U+1F42C,U+1F42D,U+1F42E,U+1F42F,U+1F430,U+1F431,U+1F432,U+1F433,U+1F434,U+1F435,U+1F436,U+1F437,U+1F438,U+1F439,U+1F43A,U+1F43C,U+1F43D,U+1F43E,U+1F43F,U+1F440,U+1F444,U+1F445,U+1F451,U+1F452,U+1F453,U+1F454,U+1F455,U+1F456,U+1F457,U+1F458,U+1F459,U+1F45A,U+1F45B,U+1F45C,U+1F45D,U+1F45E,U+1F45F,U+1F460,U+1F461,U+1F462,U+1F463,U+1F464,U+1F465,U+1F479,U+1F47A,U+1F47B,U+1F47D,U+1F47E,U+1F47F,U+1F480,U+1F484,U+1F488,U+1F489,U+1F48A,U+1F48C,U+1F48D,U+1F48E,U+1F490,U+1F492,U+1F493,U+1F494,U+1F495,U+1F496,U+1F497,U+1F498,U+1F499,U+1F49A,U+1F49B,U+1F49C,U+1F49D,U+1F49E,U+1F49F,U+1F4A0,U+1F4A1,U+1F4A2,U+1F4A3,U+1F4A4,U+1F4A6,U+1F4A7,U+1F4A9,U+1F4AC,U+1F4AD,U+1F4AE,U+1F4AF,U+1F4B0,U+1F4B1,U+1F4B2,U+1F4B3,U+1F4B4,U+1F4B5,U+1F4B6,U+1F4B7,U+1F4B8,U+1F4B9,U+1F4BA,U+1F4BD,U+1F4BE,U+1F4BF,U+1F4C0,U+1F4C1,U+1F4C2,U+1F4C3,U+1F4C4,U+1F4C5,U+1F4C6,U+1F4C7,U+1F4C8,U+1F4C9,U+1F4CA,U+1F4CB,U+1F4CC,U+1F4CD,U+1F4CE,U+1F4CF,U+1F4D0,U+1F4D1,U+1F4D2,U+1F4D3,U+1F4D4,U+1F4D5,U+1F4D6,U+1F4D7,U+1F4D8,U+1F4D9,U+1F4DA,U+1F4DB,U+1F4DC,U+1F4DD,U+1F4DE,U+1F4DF,U+1F4E0,U+1F4E1,U+1F4E2,U+1F4E3,U+1F4E4,U+1F4E5,U+1F4E6,U+1F4E7,U+1F4E8,U+1F4E9,U+1F4EA,U+1F4EB,U+1F4EC,U+1F4ED,U+1F4EE,U+1F4EF,U+1F4F0,U+1F4F1,U+1F4F2,U+1F4F3,U+1F4F4,U+1F4F5,U+1F4F6,U+1F4F7,U+1F4F8,U+1F4F9,U+1F4FA,U+1F4FB,U+1F4FC,U+1F4FD,U+1F4FF,U+1F500,U+1F501,U+1F502,U+1F503,U+1F504,U+1F505,U+1F506,U+1F507,U+1F508,U+1F509,U+1F50A,U+1F50B,U+1F50C,U+1F50D,U+1F50E,U+1F50F,U+1F510,U+1F511,U+1F512,U+1F513,U+1F514,U+1F515,U+1F516,U+1F517,U+1F518,U+1F519,U+1F51A,U+1F51B,U+1F51C,U+1F51D,U+1F51E,U+1F51F,U+1F520,U+1F521,U+1F522,U+1F523,U+1F524,U+1F526,U+1F528,U+1F529,U+1F52A,U+1F52B,U+1F52D,U+1F52E,U+1F52F,U+1F530,U+1F531,U+1F532,U+1F533,U+1F534,U+1F535,U+1F536,U+1F537,U+1F538,U+1F539,U+1F53A,U+1F53B,U+1F53C,U+1F53D,U+1F549,U+1F54A,U+1F54B,U+1F54C,U+1F54D,U+1F54E,U+1F550,U+1F551,U+1F552,U+1F553,U+1F554,U+1F555,U+1F556,U+1F557,U+1F558,U+1F559,U+1F55A,U+1F55B,U+1F55C,U+1F55D,U+1F55E,U+1F55F,U+1F560,U+1F561,U+1F562,U+1F563,U+1F564,U+1F565,U+1F566,U+1F567,U+1F56F,U+1F570,U+1F573,U+1F576,U+1F577,U+1F578,U+1F579,U+1F587,U+1F58A,U+1F58B,U+1F58C,U+1F58D,U+1F5A4,U+1F5A5,U+1F5A8,U+1F5B1,U+1F5B2,U+1F5BC,U+1F5C2,U+1F5C3,U+1F5C4,U+1F5D1,U+1F5D2,U+1F5D3,U+1F5DC,U+1F5DD,U+1F5DE,U+1F5E1,U+1F5E3,U+1F5EF,U+1F5F3,U+1F5FA,U+1F5FB,U+1F5FC,U+1F5FD,U+1F5FE,U+1F5FF,U+1F681,U+1F682,U+1F683,U+1F684,U+1F685,U+1F686,U+1F687,U+1F688,U+1F689,U+1F68A,U+1F68B,U+1F68C,U+1F68D,U+1F68E,U+1F68F,U+1F690,U+1F691,U+1F693,U+1F694,U+1F695,U+1F696,U+1F697,U+1F698,U+1F699,U+1F69A,U+1F69B,U+1F69C,U+1F69D,U+1F69E,U+1F69F,U+1F6A0,U+1F6A1,U+1F6A2,U+1F6A4,U+1F6A5,U+1F6A6,U+1F6A7,U+1F6A8,U+1F6A9,U+1F6AA,U+1F6AB,U+1F6AC,U+1F6AD,U+1F6AE,U+1F6AF,U+1F6B0,U+1F6B1,U+1F6B2,U+1F6B3,U+1F6B7,U+1F6B8,U+1F6B9,U+1F6BA,U+1F6BB,U+1F6BC,U+1F6BD,U+1F6BE,U+1F6BF,U+1F6C1,U+1F6C2,U+1F6C3,U+1F6C4,U+1F6C5,U+1F6CB,U+1F6CD,U+1F6CE,U+1F6CF,U+1F6D0,U+1F6D1,U+1F6D2,U+1F6D5,U+1F6D6,U+1F6D7,U+1F6DC,U+1F6DD,U+1F6DE,U+1F6DF,U+1F6E0,U+1F6E1,U+1F6E2,U+1F6E3,U+1F6E4,U+1F6E5,U+1F6E9,U+1F6EB,U+1F6EC,U+1F6F0,U+1F6F3,U+1F6F4,U+1F6F5,U+1F6F6,U+1F6F7,U+1F6F8,U+1F6F9,U+1F6FA,U+1F6FB,U+1F6FC,U+1F7F0,U+1F90D,U+1F90E,U+1F916,U+1F921,U+1F93A,U+1F93F,U+1F940,U+1F941,U+1F942,U+1F943,U+1F944,U+1F945,U+1F947,U+1F948,U+1F949,U+1F94A,U+1F94B,U+1F94C,U+1F94D,U+1F94E,U+1F94F,U+1F950,U+1F951,U+1F952,U+1F953,U+1F954,U+1F955,U+1F956,U+1F957,U+1F958,U+1F959,U+1F95A,U+1F95B,U+1F95C,U+1F95D,U+1F95E,U+1F95F,U+1F960,U+1F961,U+1F962,U+1F963,U+1F964,U+1F965,U+1F966,U+1F967,U+1F968,U+1F969,U+1F96A,U+1F96B,U+1F96C,U+1F96D,U+1F96E,U+1F96F,U+1F97B,U+1F97C,U+1F97D,U+1F97E,U+1F97F,U+1F980,U+1F981,U+1F982,U+1F983,U+1F984,U+1F985,U+1F986,U+1F987,U+1F988,U+1F989,U+1F98A,U+1F98B,U+1F98C,U+1F98D,U+1F98E,U+1F98F,U+1F990,U+1F991,U+1F992,U+1F993,U+1F994,U+1F995,U+1F996,U+1F997,U+1F998,U+1F999,U+1F99A,U+1F99B,U+1F99C,U+1F99D,U+1F99E,U+1F99F,U+1F9A0,U+1F9A1,U+1F9A2,U+1F9A3,U+1F9A4,U+1F9A5,U+1F9A6,U+1F9A7,U+1F9A8,U+1F9A9,U+1F9AA,U+1F9AB,U+1F9AC,U+1F9AD,U+1F9AE,U+1F9B4,U+1F9B7,U+1F9BE,U+1F9BF,U+1F9C0,U+1F9C1,U+1F9C2,U+1F9C3,U+1F9C4,U+1F9C5,U+1F9C6,U+1F9C7,U+1F9C8,U+1F9C9,U+1F9CA,U+1F9CB,U+1F9CC,U+1F9D0,U+1F9E0,U+1F9E1,U+1F9E2,U+1F9E3,U+1F9E4,U+1F9E5,U+1F9E6,U+1F9E7,U+1F9E8,U+1F9E9,U+1F9EA,U+1F9EB,U+1F9EC,U+1F9ED,U+1F9EE,U+1F9EF,U+1F9F0,U+1F9F1,U+1F9F2,U+1F9F3,U+1F9F4,U+1F9F5,U+1F9F6,U+1F9F7,U+1F9F8,U+1F9F9,U+1F9FA,U+1F9FB,U+1F9FC,U+1F9FD,U+1F9FE,U+1F9FF,U+1FA70,U+1FA71,U+1FA72,U+1FA73,U+1FA74,U+1FA75,U+1FA76,U+1FA77,U+1FA78,U+1FA7A,U+1FA7B,U+1FA7C,U+1FA80,U+1FA81,U+1FA82,U+1FA83,U+1FA84,U+1FA85,U+1FA86,U+1FA87,U+1FA88,U+1FA89,U+1FA8F,U+1FA90,U+1FA91,U+1FA92,U+1FA93,U+1FA94,U+1FA95,U+1FA96,U+1FA97,U+1FA98,U+1FA99,U+1FA9A,U+1FA9B,U+1FA9C,U+1FA9D,U+1FA9E,U+1FA9F,U+1FAA0,U+1FAA1,U+1FAA2,U+1FAA3,U+1FAA4,U+1FAA5,U+1FAA6,U+1FAA7,U+1FAA8,U+1FAA9,U+1FAAA,U+1FAAB,U+1FAAC,U+1FAAD,U+1FAAE,U+1FAAF,U+1FAB0,U+1FAB1,U+1FAB2,U+1FAB3,U+1FAB4,U+1FAB5,U+1FAB6,U+1FAB7,U+1FAB8,U+1FAB9,U+1FABA,U+1FABB,U+1FABC,U+1FABD,U+1FABE,U+1FABF,U+1FAC0,U+1FAC1,U+1FAC2,U+1FAC6,U+1FACE,U+1FACF,U+1FAD0,U+1FAD1,U+1FAD2,U+1FAD3,U+1FAD4,U+1FAD5,U+1FAD6,U+1FAD7,U+1FAD8,U+1FAD9,U+1FADA,U+1FADB,U+1FADC,U+1FADF,U+1FAE6,U+1FAE7;}`;
        }
    }),1000);
    return str;
})("");