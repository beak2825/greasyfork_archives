// ==UserScript==
// @name         font-family beta demo🔧
// @description  Research font fallbacks, permutation of the font-family
// @namespace    font_family_demo
// @author       Covenant
// @version      1.0.9
// @license      MIT
// @homepage
// @match        *://*/*
// @exclude      https://fonts.google.com/*
// @exclude      https://steamdb.info/*
// @exclude      https://www.google.com/search?*&tbm=isch*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAABbCAQAAAC2PzESAAAACXBIWXMAAAsSAAALEgHS3X78AAAEjUlEQVR4nO3bbWhXVRzA8fvfps1ZziwHCrVstrKGJrUZRQhaWURoYr6pICwqC8JCigiz0DcVhtaLHhkh9SZHj6SINCR6NEKJSRbUxB5ojn1dZS439//1YrP/0733d859/tP4vdn+d+f8Ptydnfs755454lRjpA6YYGc/UgdMsKMLNlNXdWyWITxUZWwmcQjhGDOri/0ogiC8XkVsZvHXOHuUK6uH/eY4WhC+IFcVbK4pQgvCXVXApob9ZezfmZZ99toytCBsyTibGQy4sIeZl232Sy5oQdiTYTaXM+rBFm7NLvtTT7TQS30m2dzhgxaEjRlkcya/KewTNGeP/ayCFoSujLFpZdiALSzNFnuXEVo4GH7pEB16uSFaENZlhE09P1qwB2nKBnuDBVoQOjPA5nz+tmTn6UifvcMSLQhfhVk6RIFeEgAtCGtSZFNHT0B2H43psS/iqcDRnho7nVAuU6t1QAtzE4/z/EmtvKqy3w44ssPEBn/SLvJcpbCbGUoYfZh6P9BYlfE1NQp8U8Ls1T5ju6jKuEdhN/BzguhPxPFjF6qMo0xX4Lcnhh5loQ+7rMrYprBzfJ4Q+7WxjF6Q0ipjhDYF3k4+AfQfpwted0RlldHtzxaHNxJgrz+dzQ3gXmXcprAL+9lxxQ9M9mOvc210hAYF/njM7FsKuSqTNzHo0WyTwj6Dn2JE7y7OVZm807PhEHMU+MrY0CNc6sOmw3dGeE/9w+yOif1CaZ7SpDn2Kc2XKez5nIoBPcAMP/bdageHmKTAvXa3w8SD5VmKEzZy1KCL9Qr7XI5FjO6prPqLE24z6uRPZilw9wk0eFxXmaOQrI0Rw262K+w6vosQ/b5bjkIy8zkgz9UK/MbI0CeZ68NmtVVn36hLh48CQ6/w77mITQNHLDu/V2Gb7nWXh+uQ8GJvtu6+n7MV+PMB0PmxRYARmxb+CZDiRYVtNp2Wxjtm6DH2B4F+naeYr8Dvs77XC4zZ3BQILQh7fdHN1HDAqr8dpmhxHNpZETimeqLb+IVpLLa618rCr2yQxBF0I2wRhy5j9iiLUmaPPwWGmccFFntWB8zfoMWBLjwF9lhOrkqZFi+7GLqSqfxqzD5u+mo7evSFJU+BXqZwp8X9/jAtdvlTYCM5vrSAX58C2+UpcIJmFhnvWQ1oRUMMbCbzvQulSxy2G7Irll9JsB/zwCxlNscN0D2mU2CU6Nme22kHqeMJA/YNprmiZL/lA3qYenoVtOEsEimba31JgzSxyvcnhmlNnE2tWu11isNen+tWpzKjYj+gjts8HSzwPCPYb/ciOxr0Oa7HQ8tjHzle8bh2v13GaNgvG6AFYQ0zXbehv9XfNkfOZqHP8dDS6KORR1w+X2KbMzw6x2eGaEHYOv6PFsXxrn3W8Gyb+k4Y4TJuLvnkJC2JszlLPR5aHh+Lw86i758Jkjcs+zlLtCCs4pL/tkn7gh3+D4e+ONCW2WGmsHX8a+V9fjzs3QHQgvA00+lH2K9tgcbAZkVAtDDEHNYiLA6aO9TdDhPU8mTw1qmxw0XqgAl29iN1wP+K/S8PU4bqQuZ4nwAAAABJRU5ErkJggg==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/457256/font-family%20beta%20demo%F0%9F%94%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/457256/font-family%20beta%20demo%F0%9F%94%A7.meta.js
// ==/UserScript==
var div_fixed;
var input_word;
var input_num;
var input_lang;
var select_font;
var style_font_lab;
var p_console_log;
const url_api_noto_lang_default='https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Emoji:wght@300;400;500;600;700&family=Noto+Kufi+Arabic:wght@100;200;300;400;500;600;700;800;900&family=Noto+Music&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+Display:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Noto+Sans+HK:wght@100;300;400;500;700;900&family=Noto+Sans+JP:wght@100;300;400;500;700;900&family=Noto+Sans+KR:wght@100;300;400;500;700;900&family=Noto+Sans+Math&family=Noto+Sans+Mono:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+SC:wght@100;300;400;500;700;900&family=Noto+Sans+Symbols+2&family=Noto+Sans+Symbols:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+TC:wght@100;300;400;500;700;900&family=Noto+Sans+Tamil:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Noto+Serif+Devanagari:wght@100;200;300;400;500;600;700;800;900&family=Noto+Serif+Display:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Noto+Serif+HK:wght@200;300;400;500;600;700;800;900&family=Noto+Serif+JP:wght@200;300;400;500;600;700;900&family=Noto+Serif+KR:wght@200;300;400;500;600;700;900&family=Noto+Serif+SC:wght@200;300;400;500;600;700;900&family=Noto+Serif+TC:wght@200;300;400;500;600;700;900&family=Noto+Serif+Tamil:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap';
const url_api_noto_lang_all='https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Emoji:wght@300;400;500;600;700&family=Noto+Kufi+Arabic:wght@100;400&family=Noto+Music&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Nastaliq+Urdu&family=Noto+Rashi+Hebrew:wght@100;400&family=Noto+Sans+Adlam&family=Noto+Sans+Adlam+Unjoined&family=Noto+Sans+Anatolian+Hieroglyphs&family=Noto+Sans+Arabic:wght@100;400&family=Noto+Sans+Armenian:wght@100;400&family=Noto+Sans+Avestan&family=Noto+Sans+Balinese&family=Noto+Sans+Bamum&family=Noto+Sans+Bassa+Vah&family=Noto+Sans+Batak&family=Noto+Sans+Bengali:wght@100;400&family=Noto+Sans+Bhaiksuki&family=Noto+Sans+Brahmi&family=Noto+Sans+Buginese&family=Noto+Sans+Buhid&family=Noto+Sans+Canadian+Aboriginal:wght@100&family=Noto+Sans+Carian&family=Noto+Sans+Caucasian+Albanian&family=Noto+Sans+Chakma&family=Noto+Sans+Cham:wght@100&family=Noto+Sans+Cherokee:wght@100&family=Noto+Sans+Coptic&family=Noto+Sans+Cuneiform&family=Noto+Sans+Cypriot&family=Noto+Sans+Deseret&family=Noto+Sans+Devanagari:wght@100;400&family=Noto+Sans+Display:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Noto+Sans+Duployan&family=Noto+Sans+Egyptian+Hieroglyphs&family=Noto+Sans+Elbasan&family=Noto+Sans+Elymaic&family=Noto+Sans+Ethiopic:wght@100&family=Noto+Sans+Georgian:wght@100&family=Noto+Sans+Glagolitic&family=Noto+Sans+Gothic&family=Noto+Sans+Grantha&family=Noto+Sans+Gujarati:wght@100&family=Noto+Sans+Gunjala+Gondi&family=Noto+Sans+Gurmukhi:wght@100&family=Noto+Sans+HK:wght@100;400&family=Noto+Sans+Hanifi+Rohingya&family=Noto+Sans+Hanunoo&family=Noto+Sans+Hatran&family=Noto+Sans+Hebrew:wght@100;400&family=Noto+Sans+Imperial+Aramaic&family=Noto+Sans+Indic+Siyaq+Numbers&family=Noto+Sans+Inscriptional+Pahlavi&family=Noto+Sans+Inscriptional+Parthian&family=Noto+Sans+JP:wght@100;300;400;500;700;900&family=Noto+Sans+Javanese&family=Noto+Sans+KR:wght@100;400&family=Noto+Sans+Kaithi&family=Noto+Sans+Kannada:wght@100&family=Noto+Sans+Kayah+Li&family=Noto+Sans+Kharoshthi&family=Noto+Sans+Khmer:wght@100&family=Noto+Sans+Khojki&family=Noto+Sans+Khudawadi&family=Noto+Sans+Lao+Looped:wght@100&family=Noto+Sans+Lao:wght@100&family=Noto+Sans+Lepcha&family=Noto+Sans+Limbu&family=Noto+Sans+Linear+A&family=Noto+Sans+Linear+B&family=Noto+Sans+Lisu&family=Noto+Sans+Lycian&family=Noto+Sans+Lydian&family=Noto+Sans+Mahajani&family=Noto+Sans+Malayalam:wght@100&family=Noto+Sans+Mandaic&family=Noto+Sans+Manichaean&family=Noto+Sans+Marchen&family=Noto+Sans+Masaram+Gondi&family=Noto+Sans+Math&family=Noto+Sans+Mayan+Numerals&family=Noto+Sans+Medefaidrin&family=Noto+Sans+Meetei+Mayek:wght@100&family=Noto+Sans+Mende+Kikakui&family=Noto+Sans+Meroitic&family=Noto+Sans+Miao&family=Noto+Sans+Modi&family=Noto+Sans+Mongolian&family=Noto+Sans+Mono:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+Mro&family=Noto+Sans+Multani&family=Noto+Sans+Myanmar:wght@100&family=Noto+Sans+N+Ko&family=Noto+Sans+Nabataean&family=Noto+Sans+New+Tai+Lue&family=Noto+Sans+Newa&family=Noto+Sans+Nushu&family=Noto+Sans+Ogham&family=Noto+Sans+Ol+Chiki&family=Noto+Sans+Old+Hungarian&family=Noto+Sans+Old+Italic&family=Noto+Sans+Old+North+Arabian&family=Noto+Sans+Old+Permic&family=Noto+Sans+Old+Persian&family=Noto+Sans+Old+Sogdian&family=Noto+Sans+Old+South+Arabian&family=Noto+Sans+Old+Turkic&family=Noto+Sans+Oriya:wght@100&family=Noto+Sans+Osage&family=Noto+Sans+Osmanya&family=Noto+Sans+Pahawh+Hmong&family=Noto+Sans+Palmyrene&family=Noto+Sans+Pau+Cin+Hau&family=Noto+Sans+Phags+Pa&family=Noto+Sans+Phoenician&family=Noto+Sans+Psalter+Pahlavi&family=Noto+Sans+Rejang&family=Noto+Sans+Runic&family=Noto+Sans+SC:wght@100;400&family=Noto+Sans+Samaritan&family=Noto+Sans+Saurashtra&family=Noto+Sans+Sharada&family=Noto+Sans+Shavian&family=Noto+Sans+Siddham&family=Noto+Sans+Sinhala:wght@100&family=Noto+Sans+Sogdian&family=Noto+Sans+Sora+Sompeng&family=Noto+Sans+Soyombo&family=Noto+Sans+Sundanese&family=Noto+Sans+Syloti+Nagri&family=Noto+Sans+Symbols+2&family=Noto+Sans+Symbols:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+Syriac:wght@100&family=Noto+Sans+TC:wght@100;400&family=Noto+Sans+Tagalog&family=Noto+Sans+Tagbanwa&family=Noto+Sans+Tai+Le&family=Noto+Sans+Tai+Tham&family=Noto+Sans+Tai+Viet&family=Noto+Sans+Takri&family=Noto+Sans+Tamil+Supplement&family=Noto+Sans+Tamil:wght@100;400&family=Noto+Sans+Telugu:wght@100&family=Noto+Sans+Thaana:wght@100&family=Noto+Sans+Thai+Looped:wght@100;400&family=Noto+Sans+Thai:wght@100;400&family=Noto+Sans+Tifinagh&family=Noto+Sans+Tirhuta&family=Noto+Sans+Ugaritic&family=Noto+Sans+Vai&family=Noto+Sans+Wancho&family=Noto+Sans+Warang+Citi&family=Noto+Sans+Yi&family=Noto+Sans+Zanabazar+Square&family=Noto+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Noto+Serif+Ahom&family=Noto+Serif+Armenian:wght@100&family=Noto+Serif+Balinese&family=Noto+Serif+Bengali:wght@100&family=Noto+Serif+Devanagari:wght@100;400&family=Noto+Serif+Display:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Noto+Serif+Dogra&family=Noto+Serif+Ethiopic:wght@100&family=Noto+Serif+Georgian:wght@100&family=Noto+Serif+Grantha&family=Noto+Serif+Gujarati:wght@100&family=Noto+Serif+Gurmukhi:wght@100&family=Noto+Serif+HK:wght@200;400&family=Noto+Serif+Hebrew:wght@100;400&family=Noto+Serif+JP:wght@200;300;400;500;600;700;900&family=Noto+Serif+KR:wght@200;400&family=Noto+Serif+Kannada:wght@100&family=Noto+Serif+Khmer:wght@100&family=Noto+Serif+Khojki&family=Noto+Serif+Lao:wght@100&family=Noto+Serif+Malayalam:wght@100&family=Noto+Serif+Myanmar:wght@100&family=Noto+Serif+NP+Hmong&family=Noto+Serif+Nyiakeng+Puachue+Hmong&family=Noto+Serif+Oriya&family=Noto+Serif+SC:wght@200;400&family=Noto+Serif+Sinhala:wght@100&family=Noto+Serif+TC:wght@200;400&family=Noto+Serif+Tamil:ital,wght@0,100;0,400;1,100;1,400&family=Noto+Serif+Tangut&family=Noto+Serif+Telugu:wght@100&family=Noto+Serif+Thai:wght@100;400&family=Noto+Serif+Tibetan:wght@100&family=Noto+Serif+Yezidi&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Traditional+Nushu&display=swap';
//const url_api_noto_lang_full='';
var ary_font=['Segoe UI','Times New Roman','Cascadia Code','Cascadia Mono','Consolas','Courier New','Twemoji Mozilla','Segoe UI Emoji','Segoe UI Symbol','color_emoji','symbol_emoji'];
ary_font=ary_font.concat(['MS Gothic','Meiryo','Yu Gothic','MS Mincho','Yu Mincho','UD_Digi_Kyokasho','UD_Digi_Kyokasho_S','UD_Digi_Kyokasho_P','Microsoft JhengHei','Microsoft YaHei','Adobe_Blank']);
ary_font=ary_font.concat(['Noto Sans Mono','Noto Mono','Noto Sans','Noto Color Emoji','old_emoji','Noto Sans CJK JP']);
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
const font_family_panel_important="font-family: 'Noto Sans Mono','Noto Mono','Cascadia Mono','Consolas','DroidSans_Mono','Courier New','symbol_emoji','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','old_emoji',sans-serif !important;";
const font_face_default=`
@font-face{font-family: 'color_emoji';src: local('Twemoji Mozilla'),/*url('file:///C:/Program Files/Mozilla Firefox/fonts/TwemojiMozilla.ttf'),*/local('Noto Color Emoji'),local('Segoe UI Emoji'),local('Apple Color Emoji');}
@font-face{font-family: 'symbol_emoji';src: local('Segoe UI Symbol');}\n@font-face{font-family: 'old_emoji';src: local('Noto Color Emoji');}
@font-face{font-family: 'DroidSans_Mono';src: local('DroidSansMono');}\n@font-face{font-family: 'Cutive_Mono';src: local('Cutive Mono');}
@font-face{font-family: 'Roboto_2';src: local('Roboto');}\n@font-face{font-family: 'Noto_Serif';src: local('NotoSerif');}\n@font-face{font-family: 'Dancing_Script';src: local('DancingScript');}
@font-face{font-family: 'UD_Digi_Kyokasho';font-weight: 400;src: local('UD Digi Kyokasho N-R');}
@font-face{font-family: 'UD_Digi_Kyokasho';font-weight: 600;src: local('UD Digi Kyokasho N-B');}
@font-face{font-family: 'UD_Digi_Kyokasho_S';font-weight: 400;src: local('UD Digi Kyokasho NP-R');}
@font-face{font-family: 'UD_Digi_Kyokasho_S';font-weight: 600;src: local('UD Digi Kyokasho NP-B');}
@font-face{font-family: 'UD_Digi_Kyokasho_P';font-weight: 400;src: local('UD Digi Kyokasho NK-R');}
@font-face{font-family: 'UD_Digi_Kyokasho_P';font-weight: 600;src: local('UD Digi Kyokasho NK-B');}
@font-face{font-family: 'Adobe_Blank';src: url('data:application/octet-stream;base64,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');}
\n`;
var style_font_face=create_style(font_face_default,"gm_font_face_font_family",["user_gm_font_face","css_font_demo"]);
var style_user_css=create_style(".user_input_fixed_font,.user_btn_panel_fixed_font,.user_p_fixed_font,.user_select_fixed_font,.user_opt_fixed_font{"+font_family_panel_important+"font-weight: 300;}","gm_user_css_font_family",["user_gm_css","css_font_demo"]);
style_user_css.textContent+=`
input.user_input_fixed_font{width: auto;max-width: 95%;border-radius: 0.5rem; font-size: 110%;padding: 0.25em;}
.user_btn_panel_fixed_font{min-height: 1em;line-height: 1.5em;padding: 0.1rem 0.5rem;margin-top: 1px;margin-bottom: 1px;}
.user_select_fixed_font{font-size: 0.75rem;padding: 0.25rem;min-width: 7em;max-width: 12em;}
.user_btn_margin{margin-right: 2px;margin-left: 3px;margin-top: 1px;margin-bottom: 1px;padding: 0.1rem 0.5rem;}
.input_font_family{min-width: 90%;}\ndiv.div_br{width: 100%;}
.user_div_fixed_font{position:fixed !important;z-index: 65535;top: 60%;right: 0px;}
.user_div_fixed_font{background: #00000033;display: flex;justify-content: flex-end;flex-wrap: wrap;min-width: 100%;}\ndiv.div_br{width: 100%;}\n`;
window.onload = function(){
    //window.setInterval(( () => {
        if(style_user_css.parent==undefined){
            document.body.appendChild(style_user_css);
            document.body.appendChild(style_font_face);
        }
    //}), 3000);
};
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
    input.title=placeholder;
    if(is_num)input.size="10";
    if(is_num)input.setAttribute("maxlength", "10");
    if(is_num)input.setAttribute("oninput","this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*?)\\..*/g, '$1');");
    return input;
}
function create_btn(innerText,class_name,is_appendChild,node,refNode){
    let btn=create_node_text("button",innerText,class_name,is_appendChild,node,refNode);
    return btn;
}
function create_select(class_name,is_multiple,size,is_appendChild,node,refNode){
    let select=create_node("select",class_name,is_appendChild,node,refNode);
    if(is_multiple)select.setAttribute("multiple",true);
    select.setAttribute("size",size);
    return select;
}
function create_link_stylesheet(url,class_name,is_appendChild,node,refNode){
    let link_stylesheet=create_node("link",class_name,is_appendChild,node,refNode);
    link_stylesheet.rel="stylesheet";
    link_stylesheet.href=url;
    return link_stylesheet;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(is_appendChild){node.appendChild(element);}else{node.insertBefore(element, refNode);}
    return element;
}
function create_node_text(tagname,innerText,class_name,is_appendChild,node,refNode){
    let element = create_node(tagname,class_name,is_appendChild,node,refNode);
    element.innerText=innerText;
    element.lang='ja';
    return element;
}
function console_log(textContent){
    if(!textContent)p_console_log.textContent="";
    try{
        p_console_log.textContent+=textContent+"\\n ";
    }catch(e){
        console.log(e.message);
        console.log(textContent);
    }finally{}
}
function style_textContent(styleSheets){
    let str_css_rule="";
    for(let i=0; i<styleSheets.cssRules.length; i++){
        str_css_rule+=styleSheets.cssRules[i].cssText+"\n";
    }
    styleSheets.ownerNode.textContent=str_css_rule;
}
function change_css_style(id,selector,ary_setProperty){
    for(let n=0; n<document.styleSheets.length; n++){
        if(document.styleSheets[n].ownerNode.id==id){console.log("n="+n);
            let y=0;//questions/6620393
            while (y<document.styleSheets[n].cssRules.length){
                if (document.styleSheets[n].cssRules[y].selectorText==selector){
                    for(let i=0; i<ary_setProperty.length; i++){
                        if(Array.isArray(ary_setProperty[i])){
                            console_log(n);console_log(document.styleSheets[n].cssRules[y].style[ary_setProperty[i][0]]);
                            document.styleSheets[n].cssRules[y].style[ary_setProperty[i][0]]=ary_setProperty[i][1];
                        }else{
                            document.styleSheets[n].cssRules[y].style[ary_setProperty[0]]=ary_setProperty[1];
                        }
                    }
                    y = document.styleSheets[n].cssRules.length;
                }
                y++;
            }
            style_textContent(document.styleSheets[n]);
        }
    }
}
//console.log("break");
function css_update(){
    console_log(false);
    console.log(style_font_lab);
    change_css_style("gm_font_family_lab_textContent","[class~=\"user_font\"].user_font",[['font-family',input_word.value],['font-weight',input_num.value]]);
    //style.textContent='.user_font{font-family: '+input_word.value+';font-weight: '+input_num.value+'}';
    GM_setValue('fontFamily', input_word.value);
    GM_setValue('fontWeight', input_num.value);
}
function add_font_class(apply_all){
    let node=document.body.querySelectorAll('*');
    for(let n = 0; n < node.length; n++){
        if(!node[n].classList.contains('user_input_fixed_font')&&node[n].tagName!='style'){
            if(apply_all||node[n].style.fontFamily==''){
                node[n].classList.add("user_font");
            }
        }
        if(node[n].tagName!='IMG'&&input_lang.value!=""){
            if(node[n].lang==''){
                node[n].lang=input_lang.value;
            }else{
                node[n].setAttribute('lang_bak',node[n].lang);
                node[n].lang=input_lang.value;
            }
        }
    }
    console_log("font "+apply_all);
}
function rst(){
    let node=document.body.querySelectorAll('*');
    for(let n = 0; n < node.length; n++){
        if(node[n].classList.contains('user_font')){
            node[n].classList.remove('user_font');
        }
        if(node[n].tagName!='IMG'){
            if(node[n].getAttribute('lang_bak')!=null){
                node[n].lang=node[n].getAttribute('lang_bak');
            }else{node[n].lang="";}
        }
    }
    document.body.style.fontSize="";
    console_log("rst");
}
function main_01(){
    let panel=GM_getValue('panel', false);
    let position_fixed=GM_getValue('position_fixed', true);
    let api_noto_lang=GM_getValue('api_noto_lang', 0);
    let fontFamily=GM_getValue('fontFamily', "");
    let fontWeight=GM_getValue('fontWeight', 400);
    let ary_lang_type=["❌","✔️","all lang✔️","full lang font✔️"];
    //registerMenuCommand
    const id_input=GM_registerMenuCommand('💬font-family: input;', () => {
        panel=!panel;
        GM_setValue('panel', panel);
        if(panel){div_fixed.style.removeProperty("display");}else{div_fixed.style.display="none";}
        console.log("Hello");
    });
    GM_registerMenuCommand("▶"+(document.styleSheets.length==0?"document.styleSheets error⚠️":"overwrite font"), () => {
        css_update();
        add_font_class(false);
    });
    /*GM_registerMenuCommand('overwrite all font', () => {
        css_update();
        add_font_class(true);
    });//*/
    GM_registerMenuCommand('⬆️font-size: 200%;', () => {
        document.body.style.fontSize="200%";
    });
    GM_registerMenuCommand('🛑reset', () => {
        rst();
    });
    GM_registerMenuCommand('🔁noto fonts api: '+ary_lang_type[api_noto_lang], () => {
        api_noto_lang++;
        if(api_noto_lang>2)api_noto_lang=0;
        GM_setValue('api_noto_lang', api_noto_lang);
        location.reload();
    });
    GM_registerMenuCommand('🔁disable input css'+(position_fixed?"💤":"✔️"), () => {
        position_fixed=!position_fixed;
        GM_setValue('position_fixed', position_fixed);
        location.reload();
    });
    //add input
    div_fixed=create_div(["user_div_fixed_font"],false,document.body,document.body.firstChild);
    if(panel){div_fixed.style.removeProperty("display");}else{div_fixed.style.display="none";}
    input_word=create_input("font-family: !important",["user_input_fixed_font","input_font_family"],false,true,div_fixed);
    input_word.value=fontFamily;
    input_word.size="128";
    create_div("div_br",true,div_fixed);
    p_console_log=create_node_text("p",document.styleSheets.length==0?"error: document.styleSheets.length==0":"","user_p_fixed_font",true,div_fixed);
    select_font=create_select(["user_select_fixed_font"],false,"1",true,div_fixed);
    let btn_select_font=create_btn("add",["user_btn_panel_fixed_font","user_btn_margin"],true,div_fixed);
    let btn_remove_font=create_btn("remove",["user_btn_panel_fixed_font","user_btn_margin"],true,div_fixed);
    input_num=create_input("font-weight: !important","user_input_fixed_font",true,true,div_fixed);
    input_num.size="4";
    for (let i = 0; i < ary_font.length; i++) {
        let option=create_node("option",["user_opt_fixed_font"], true, select_font);
        option.value="'"+ary_font[i]+"'";
        option.innerText=option.value;
    }
    input_num.value=fontWeight;
    input_lang=create_input("en","user_input_fixed_font",false,true,div_fixed);
    input_lang.size="4";
    //
    btn_select_font.addEventListener("click", () => {
        let u2C=(input_word.value.slice(-1)==","||input_word.value.slice(-1)=="")?"":",";
        input_word.value+=u2C+select_font.value;
    });
    btn_remove_font.addEventListener("click", () => {
        let ary_tmp=input_word.value.split(',');
        if(ary_tmp.length>1){
            ary_tmp.pop();
            input_word.value=ary_tmp.join(',');
        }else{input_word.value="";}
    });
    //style css
    style_font_lab=create_style("[class~='user_font'].user_font{font-family: "+input_word.value+";font-weight: "+input_num.value+";}","gm_font_family_lab_textContent",["user_gm_css","css_font_demo"]);
    if(!position_fixed){
        //create_style('.user_input_fixed_font{all: revert !important;position:static !important;}','user_gm_css');
        //change_css_style("user_gm_css",".user_input_fix",['position','static'])
        div_fixed.classList.remove("user_div_fixed_font");
    }

    let link;
    if(api_noto_lang==1){
        link=create_link_stylesheet(url_api_noto_lang_default,"gm_noto_font",true,document.head);
    }else if(api_noto_lang==2){
        link=create_link_stylesheet(url_api_noto_lang_all,"gm_noto_font",true,document.head);
    }
    //window.location.host
    window.addEventListener("beforeunload", (event) => {
        // set a truthy value to property returnValue
        GM_setValue('fontFamily', input_word.value);
        GM_setValue('fontWeight', input_num.value);
        //event.returnValue = true;
    });
}

(function() {
    'use strict';
    window.setTimeout(( () => main_01() ), 1000);
})();
/*
developers.google.com/fonts/docs/getting_started
CSS rules to specify families

font-family: 'Noto Color Emoji', sans-serif;
font-family: 'Noto Emoji', sans-serif;
font-family: 'Noto Kufi Arabic', sans-serif;
font-family: 'Noto Music', sans-serif;
font-family: 'Noto Naskh Arabic', serif;
font-family: 'Noto Nastaliq Urdu', serif;
font-family: 'Noto Rashi Hebrew', serif;
font-family: 'Noto Sans', sans-serif;
font-family: 'Noto Sans Adlam', sans-serif;
font-family: 'Noto Sans Adlam Unjoined', sans-serif;
font-family: 'Noto Sans Anatolian Hieroglyphs', sans-serif;
font-family: 'Noto Sans Arabic', sans-serif;
font-family: 'Noto Sans Armenian', sans-serif;
font-family: 'Noto Sans Avestan', sans-serif;
font-family: 'Noto Sans Balinese', sans-serif;
font-family: 'Noto Sans Bamum', sans-serif;
font-family: 'Noto Sans Bassa Vah', sans-serif;
font-family: 'Noto Sans Batak', sans-serif;
font-family: 'Noto Sans Bengali', sans-serif;
font-family: 'Noto Sans Bhaiksuki', sans-serif;
font-family: 'Noto Sans Brahmi', sans-serif;
font-family: 'Noto Sans Buginese', sans-serif;
font-family: 'Noto Sans Buhid', sans-serif;
font-family: 'Noto Sans Canadian Aboriginal', sans-serif;
font-family: 'Noto Sans Carian', sans-serif;
font-family: 'Noto Sans Caucasian Albanian', sans-serif;
font-family: 'Noto Sans Chakma', sans-serif;
font-family: 'Noto Sans Cham', sans-serif;
font-family: 'Noto Sans Cherokee', sans-serif;
font-family: 'Noto Sans Coptic', sans-serif;
font-family: 'Noto Sans Cuneiform', sans-serif;
font-family: 'Noto Sans Cypriot', sans-serif;
font-family: 'Noto Sans Deseret', sans-serif;
font-family: 'Noto Sans Devanagari', sans-serif;
font-family: 'Noto Sans Display', sans-serif;
font-family: 'Noto Sans Duployan', sans-serif;
font-family: 'Noto Sans Egyptian Hieroglyphs', sans-serif;
font-family: 'Noto Sans Elbasan', sans-serif;
font-family: 'Noto Sans Elymaic', sans-serif;
font-family: 'Noto Sans Ethiopic', sans-serif;
font-family: 'Noto Sans Georgian', sans-serif;
font-family: 'Noto Sans Glagolitic', sans-serif;
font-family: 'Noto Sans Gothic', sans-serif;
font-family: 'Noto Sans Grantha', sans-serif;
font-family: 'Noto Sans Gujarati', sans-serif;
font-family: 'Noto Sans Gunjala Gondi', sans-serif;
font-family: 'Noto Sans Gurmukhi', sans-serif;
font-family: 'Noto Sans Hanifi Rohingya', sans-serif;
font-family: 'Noto Sans Hanunoo', sans-serif;
font-family: 'Noto Sans Hatran', sans-serif;
font-family: 'Noto Sans Hebrew', sans-serif;
font-family: 'Noto Sans HK', sans-serif;
font-family: 'Noto Sans Imperial Aramaic', sans-serif;
font-family: 'Noto Sans Indic Siyaq Numbers', sans-serif;
font-family: 'Noto Sans Inscriptional Pahlavi', sans-serif;
font-family: 'Noto Sans Inscriptional Parthian', sans-serif;
font-family: 'Noto Sans Javanese', sans-serif;
font-family: 'Noto Sans JP', sans-serif;
font-family: 'Noto Sans Kaithi', sans-serif;
font-family: 'Noto Sans Kannada', sans-serif;
font-family: 'Noto Sans Kayah Li', sans-serif;
font-family: 'Noto Sans Kharoshthi', sans-serif;
font-family: 'Noto Sans Khmer', sans-serif;
font-family: 'Noto Sans Khojki', sans-serif;
font-family: 'Noto Sans Khudawadi', sans-serif;
font-family: 'Noto Sans KR', sans-serif;
font-family: 'Noto Sans Lao', sans-serif;
font-family: 'Noto Sans Lao Looped', sans-serif;
font-family: 'Noto Sans Lepcha', sans-serif;
font-family: 'Noto Sans Limbu', sans-serif;
font-family: 'Noto Sans Linear A', sans-serif;
font-family: 'Noto Sans Linear B', sans-serif;
font-family: 'Noto Sans Lisu', sans-serif;
font-family: 'Noto Sans Lycian', sans-serif;
font-family: 'Noto Sans Lydian', sans-serif;
font-family: 'Noto Sans Mahajani', sans-serif;
font-family: 'Noto Sans Malayalam', sans-serif;
font-family: 'Noto Sans Mandaic', sans-serif;
font-family: 'Noto Sans Manichaean', sans-serif;
font-family: 'Noto Sans Marchen', sans-serif;
font-family: 'Noto Sans Masaram Gondi', sans-serif;
font-family: 'Noto Sans Math', sans-serif;
font-family: 'Noto Sans Mayan Numerals', sans-serif;
font-family: 'Noto Sans Medefaidrin', sans-serif;
font-family: 'Noto Sans Meetei Mayek', sans-serif;
font-family: 'Noto Sans Mende Kikakui', sans-serif;
font-family: 'Noto Sans Meroitic', sans-serif;
font-family: 'Noto Sans Miao', sans-serif;
font-family: 'Noto Sans Modi', sans-serif;
font-family: 'Noto Sans Mongolian', sans-serif;
font-family: 'Noto Sans Mono', monospace;
font-family: 'Noto Sans Mro', sans-serif;
font-family: 'Noto Sans Multani', sans-serif;
font-family: 'Noto Sans Myanmar', sans-serif;
font-family: 'Noto Sans N Ko', sans-serif;
font-family: 'Noto Sans Nabataean', sans-serif;
font-family: 'Noto Sans New Tai Lue', sans-serif;
font-family: 'Noto Sans Newa', sans-serif;
font-family: 'Noto Sans Nushu', sans-serif;
font-family: 'Noto Sans Ogham', sans-serif;
font-family: 'Noto Sans Ol Chiki', sans-serif;
font-family: 'Noto Sans Old Hungarian', sans-serif;
font-family: 'Noto Sans Old Italic', sans-serif;
font-family: 'Noto Sans Old North Arabian', sans-serif;
font-family: 'Noto Sans Old Permic', sans-serif;
font-family: 'Noto Sans Old Persian', sans-serif;
font-family: 'Noto Sans Old Sogdian', sans-serif;
font-family: 'Noto Sans Old South Arabian', sans-serif;
font-family: 'Noto Sans Old Turkic', sans-serif;
font-family: 'Noto Sans Oriya', sans-serif;
font-family: 'Noto Sans Osage', sans-serif;
font-family: 'Noto Sans Osmanya', sans-serif;
font-family: 'Noto Sans Pahawh Hmong', sans-serif;
font-family: 'Noto Sans Palmyrene', sans-serif;
font-family: 'Noto Sans Pau Cin Hau', sans-serif;
font-family: 'Noto Sans Phags Pa', sans-serif;
font-family: 'Noto Sans Phoenician', sans-serif;
font-family: 'Noto Sans Psalter Pahlavi', sans-serif;
font-family: 'Noto Sans Rejang', sans-serif;
font-family: 'Noto Sans Runic', sans-serif;
font-family: 'Noto Sans Samaritan', sans-serif;
font-family: 'Noto Sans Saurashtra', sans-serif;
font-family: 'Noto Sans SC', sans-serif;
font-family: 'Noto Sans Sharada', sans-serif;
font-family: 'Noto Sans Shavian', sans-serif;
font-family: 'Noto Sans Siddham', sans-serif;
font-family: 'Noto Sans Sinhala', sans-serif;
font-family: 'Noto Sans Sogdian', sans-serif;
font-family: 'Noto Sans Sora Sompeng', sans-serif;
font-family: 'Noto Sans Soyombo', sans-serif;
font-family: 'Noto Sans Sundanese', sans-serif;
font-family: 'Noto Sans Syloti Nagri', sans-serif;
font-family: 'Noto Sans Symbols', sans-serif;
font-family: 'Noto Sans Symbols 2', sans-serif;
font-family: 'Noto Sans Syriac', sans-serif;
font-family: 'Noto Sans Tagalog', sans-serif;
font-family: 'Noto Sans Tagbanwa', sans-serif;
font-family: 'Noto Sans Tai Le', sans-serif;
font-family: 'Noto Sans Tai Tham', sans-serif;
font-family: 'Noto Sans Tai Viet', sans-serif;
font-family: 'Noto Sans Takri', sans-serif;
font-family: 'Noto Sans Tamil', sans-serif;
font-family: 'Noto Sans Tamil Supplement', sans-serif;
font-family: 'Noto Sans TC', sans-serif;
font-family: 'Noto Sans Telugu', sans-serif;
font-family: 'Noto Sans Thaana', sans-serif;
font-family: 'Noto Sans Thai', sans-serif;
font-family: 'Noto Sans Thai Looped', sans-serif;
font-family: 'Noto Sans Tifinagh', sans-serif;
font-family: 'Noto Sans Tirhuta', sans-serif;
font-family: 'Noto Sans Ugaritic', sans-serif;
font-family: 'Noto Sans Vai', sans-serif;
font-family: 'Noto Sans Wancho', sans-serif;
font-family: 'Noto Sans Warang Citi', sans-serif;
font-family: 'Noto Sans Yi', sans-serif;
font-family: 'Noto Sans Zanabazar Square', sans-serif;
font-family: 'Noto Serif', serif;
font-family: 'Noto Serif Ahom', serif;
font-family: 'Noto Serif Armenian', serif;
font-family: 'Noto Serif Balinese', serif;
font-family: 'Noto Serif Bengali', serif;
font-family: 'Noto Serif Devanagari', serif;
font-family: 'Noto Serif Display', serif;
font-family: 'Noto Serif Dogra', serif;
font-family: 'Noto Serif Ethiopic', serif;
font-family: 'Noto Serif Georgian', serif;
font-family: 'Noto Serif Grantha', serif;
font-family: 'Noto Serif Gujarati', serif;
font-family: 'Noto Serif Gurmukhi', serif;
font-family: 'Noto Serif Hebrew', serif;
font-family: 'Noto Serif HK', serif;
font-family: 'Noto Serif JP', serif;
font-family: 'Noto Serif Kannada', serif;
font-family: 'Noto Serif Khmer', serif;
font-family: 'Noto Serif Khojki', serif;
font-family: 'Noto Serif KR', serif;
font-family: 'Noto Serif Lao', serif;
font-family: 'Noto Serif Malayalam', serif;
font-family: 'Noto Serif Myanmar', serif;
font-family: 'Noto Serif NP Hmong', serif;
font-family: 'Noto Serif Nyiakeng Puachue Hmong', serif;
font-family: 'Noto Serif Oriya', serif;
font-family: 'Noto Serif SC', serif;
font-family: 'Noto Serif Sinhala', serif;
font-family: 'Noto Serif Tamil', serif;
font-family: 'Noto Serif Tangut', serif;
font-family: 'Noto Serif TC', serif;
font-family: 'Noto Serif Telugu', serif;
font-family: 'Noto Serif Thai', serif;
font-family: 'Noto Serif Tibetan', serif;
font-family: 'Noto Serif Yezidi', serif;
font-family: 'Noto Traditional Nushu', sans-serif;
*/