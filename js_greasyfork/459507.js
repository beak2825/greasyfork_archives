// ==UserScript==
// @name         steam show Community Items beta
// @description  add Community Items images
// @namespace    steam_Items_images
// @author       Covenant
// @version      1.0.7
// @license      MIT
// @homepage
// @match        https://store.steampowered.com/*
// @match        https://steamcommunity.com/*
// @match        https://steamdb.info/*
// @match        https://www.steamcardexchange.net/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjAgMTYiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMiI+CjxjaXJjbGUgc3Ryb2tlLXdpZHRoPSIxLjVweCIgY3k9IjQuNSIgY3g9IjE1LjUiIHI9IjMuNzUiIGNsYXNzPSJzdHJva2UiIHN0cm9rZT0iI0JCQkJCQiIgZmlsbD0ibm9uZSI+PC9jaXJjbGU+CjxjaXJjbGUgY3g9IjE1LjUiIGN5PSI0LjUiIHI9IjEuODU1IiBjbGFzcz0iZmlsbCIgZmlsbD0iI0JCQkJCQiI+PC9jaXJjbGU+CjxwYXRoIGQ9Ik0xMS42NTYgNC4yTDEyLjc1IDcuMTRsMi44NjUgMS4zODctNS4xMyAzLjg1My0uODY3LTIuMDktMS43NzMtLjk0MnoiIGNsYXNzPSJmaWxsIiBmaWxsPSIjQkJCQkJCIj48L3BhdGg+CjxjaXJjbGUgY3k9IjEyLjUiIGN4PSI3LjUiIHI9IjMiIGNsYXNzPSJzdHJva2UiIHN0cm9rZT0iI0JCQkJCQiIgZmlsbD0ibm9uZSI+PC9jaXJjbGU+CjxyZWN0IHRyYW5zZm9ybT0ibWF0cml4KC45MjQzMiAuMzgxNiAtLjM4NzI3IC45MjE5NiAwIDApIiByeT0iMS41MjYiIHdpZHRoPSI5LjQ3NyIgeT0iNy4xNTUiIHg9IjMuNzY3IiBoZWlnaHQ9IjMuMDUzIiBjbGFzcz0iZmlsbCIgZmlsbD0iI0JCQkJCQiI+PC9yZWN0Pgo8L3N2Zz4=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      www.steamcardexchange.net
// @connect      steamcommunity.com
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/459507/steam%20show%20Community%20Items%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/459507/steam%20show%20Community%20Items%20beta.meta.js
// ==/UserScript==
var timeoutID;
var is_Community_Items_Exist=true;
var is_avatar_Exist=true;
const ary_lang_steam=["english","japanese","latam","bulgarian","schinese","tchinese","czech","danish","dutch","finnish","french","german","greek","hungarian","italian","koreana","norwegian","polish","brazilian","portuguese","romanian","russian","spanish","swedish","thai","turkish","ukrainian","vietnamese"];
const ary_currency_steam=["USD","GBP","EUR","CHF","RUB","PLN","BRL","JPY","SEK","IDR","MYR","BWP","SGD","THB","VND","KRW","TRY","UAH","MXN","CAD","AUD","NZD","CNY","INR","CLP","PEN","COP","ZAR","HKD","TWD","SAR","AED"];
const akamaihd="steamcdn-a.akamaihd.net";
const steamstatic="cdn.cloudflare.steamstatic.com";
const steamcommunity="steamcommunity.com";
const profilebackground="/economy/profilebackground";
const public_images="/steamcommunity/public/images";
const priceoverview="https://steamcommunity.com/market/priceoverview/";
const s_normal_Cards="&category_753_cardborder[]=tag_cardborder_0#p1_name_asc";
const s_foil_cards="&category_753_cardborder[]=tag_cardborder_1#p1_name_asc";
const s_p_background="&category_753_item_class[]=tag_item_class_3#p1_name_asc";
const s_emotion="&category_753_item_class[]=tag_item_class_4#p1_name_asc";
const s_sale_items="&category_753_item_class[]=tag_item_class_10#p1_name_asc";
var gm_currency=GM_getValue('steam_currency', 1);
var gm_steamcommunity_item_json=GM_getValue('load_steamcommunity_item_json', false);
var url_steam_app;
var url_category_753_Game;
var url_avatar;
var url_points_shop;
var url_curatorsreviewing;
var url_cardexchange;
var url_steamdb_app;
var url_steamdb_communityitems;
var url_steamdb_achievements;
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
const font_family_steam_main="font-family: 'Motiva Sans','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','old_emoji',sans-serif;";
const font_family_steam_info="font-family: Arial, Helvetica,'color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','old_emoji',sans-serif;";
const font_face_lite=`
@font-face{font-family: 'color_emoji';src: local('Twemoji Mozilla'),/*url('file:///C:/Program Files/Mozilla Firefox/fonts/TwemojiMozilla.ttf'),local('SamsungColorEmoji'),*/local('Noto Color Emoji'),local('Segoe UI Emoji'),local('Apple Color Emoji');}
@font-face{font-family: 'symbol_emoji';src: local('Segoe UI Symbol'),local('NotoSansSymbols-Regular-Subsetted');}\n@font-face{font-family: 'old_emoji';src: local('Noto Color Emoji');}
@font-face{font-family: 'NotoSans_CJK';src: local('NotoSansCJKjp-Regular');}\n`;
var style_font_face=create_style(font_face_lite,"gm_font_face_Items",["user_gm_css","font_face","css_steam_Items_images"]);
var style_user_css=create_style(".user_div_steam_main{"+font_family_steam_main+"font-weight: 100;}\n","gm_user_css_Items",["user_gm_css","css_steam_Items_images"]);
style_user_css.textContent+=`.user_div_steam_info{`+font_family_steam_info+`font-weight: 100;}
.user_newmodal_background{position: fixed;z-index: 900;background: #000000;opacity: 0.8;top: 0;right: 0;bottom: 0;left: 0;}
.user_btn_steam{min-width: 2.5rem;margin-right: 2px;margin-left: 3px;margin-top: 1px;margin-bottom: 1px;padding-left: 5px;padding-right: 5px;}
a[class~='external'].external{background-position-x: right;background-position-y: center;background-repeat: no-repeat;background-size: 0.857em;padding-right: 1em;background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiPjxkZWZzPjxmaWx0ZXIgaWQ9ImRhcmtyZWFkZXItaW1hZ2UtZmlsdGVyIj48ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMC4yNDkgLTAuNjE0IC0wLjY3MiAwLjAwMCAxLjAzNSAtMC42NDYgMC4yODggLTAuNjY0IDAuMDAwIDEuMDIwIC0wLjYzNiAtMC42MDkgMC4yNTAgMC4wMDAgMC45OTQgMC4wMDAgMC4wMDAgMC4wMDAgMS4wMDAgMC4wMDAiIC8+PC9maWx0ZXI+PC9kZWZzPjxpbWFnZSB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbHRlcj0idXJsKCNkYXJrcmVhZGVyLWltYWdlLWZpbHRlcikiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCbGJtTnZaR2x1WnowaVZWUkdMVGdpUHo0S1BITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSGRwWkhSb1BTSXhNaUlnYUdWcFoyaDBQU0l4TWlJZ2RtbGxkMEp2ZUQwaU1DQXdJREV5SURFeUlqNEtDVHgwYVhSc1pUNEtDUWxsZUhSbGNtNWhiQ0JzYVc1ckNnazhMM1JwZEd4bFBnb0pQSEJoZEdnZ1ptbHNiRDBpSXpNMll5SWdaRDBpVFRZZ01XZzFkalZNT0M0NE5pQXpMamcxSURRdU55QTRJRFFnTnk0emJEUXVNVFV0TkM0eE5rdzJJREZhVFRJZ00yZ3lkakZJTW5ZMmFEWldPR2d4ZGpKaE1TQXhJREFnTUNBeExURWdNVWd5WVRFZ01TQXdJREFnTVMweExURldOR0V4SURFZ01DQXdJREVnTVMweFdpSXZQZ284TDNOMlp6NEsiIC8+PC9zdmc+);}\n`;
function create_div(class_name,is_appendChild,node,refNode){
    let div=create_node("div",class_name,is_appendChild,node,refNode);
    div.style.backgroundSize='contain';
    div.style.backgroundRepeat='no-repeat';
    div.lang='ja';
    return div;
}
var newmodal_background=create_div("user_newmodal_background",true,document.body);
newmodal_background.style.setProperty('display','none');
function create_a(text,url,class_name,is_appendChild,node,refNode){
    let anchor=create_node("a",class_name,is_appendChild,node,refNode);
    anchor.href=url;
    anchor.innerText=text;
    anchor.title=text;
    anchor.target="_blank";
    return anchor;
}
function create_img(url,title,class_name,is_appendChild,node,refNode){
    let img=create_node("img",class_name,is_appendChild,node,refNode);
    img.src=url;
    img.title=title;
    img.alt=title;
    return img;
}
function create_img_click(url,title,class_name,is_appendChild,node,refNode){
    let img=create_img(url,title,class_name,is_appendChild,node,refNode);
    img.width=54;
    img.addEventListener('click',() => {
        let img_tmp=img.cloneNode(true);
        img_tmp.style.setProperty('position','fixed');
        img_tmp.style.setProperty('left',"50%");
        img_tmp.style.setProperty('top',"50%");
        img_tmp.style.setProperty('transform',"translate(-50%,-50%)");
        img_tmp.style.setProperty('max-height',"95%");
        img_tmp.style.setProperty('z-index','1000');
        img_tmp.removeAttribute('width');
        newmodal_background.style.removeProperty('display');
        document.body.appendChild(img_tmp);
        img_tmp.addEventListener('click',() => {
            newmodal_background.style.setProperty('display','none');
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
        }else{
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
function create_btn(innerText,class_name,is_appendChild,node,refNode){
    let btn=create_node_text("button",innerText,class_name,is_appendChild,node,refNode);
    return btn;
}
function create_span(innerText,class_name,is_appendChild,node,refNode){
    let span=create_node_text("span",innerText,class_name,is_appendChild,node,refNode);
    return span;
}
function create_br(is_appendChild,node,refNode){
    let br=create_node("br",[],is_appendChild,node,refNode);
    return br;
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
    let element=create_node(tagname,class_name,is_appendChild,node,refNode);
    element.innerText=innerText;
    element.lang='ja';
    return element;
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
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    return [obj_url,params];
}
//console.log("break");
function steam_app_id(url){
    url=fn_url(url);
    let host=url[0].host;
    let pathname=url[0].pathname;
    let ary_pathname=pathname.split('/');
    if(url[0].host=="store.steampowered.com"){
        if(ary_pathname[1]=="app")return ary_pathname[2];
        else if(ary_pathname[1]=="api")return url[1].get('appids');
    }else if(url[0].host=="steamdb.info"){
        if(ary_pathname[1]=="app")return ary_pathname[2];
    }else if(url[0].host=="steamcommunity.com"){
        if(ary_pathname[1]=="app")return ary_pathname[2];
        if(ary_pathname[3]=="achievements"){//achievements
            if(!isNaN(ary_pathname[2])){return ary_pathname[2];}
            else{
                let gameLogo_a=document.querySelectorAll('div.gameLogo>a')[0];
                if(gameLogo_a!=undefined){return fn_url(gameLogo_a.href)[0].pathname.split('/')[2];}
                else{return null;}
            }
        }
        if(url[1].get('category_753_Game[]')!=null)return url[1].get('category_753_Game[]').replace(/tag_app_/i, '');//Community Market
        if(ary_pathname[3]=="753")return parseInt(ary_pathname[4],10);//Community Market item
        if(ary_pathname[3]=="gamecards")return parseInt(ary_pathname[4],10);//badge
    }else if(url[0].host=="www.steamcardexchange.net"){
        if(url[0].search.search(new RegExp("\\?gamepage-appid-", "i"))==0){
            return url[0].search.replace(/[^0-9.]/g, '').replace(/(\\..*?)\\..*/g, '$1');
        }
    }
    return null;
}
function fn_re_market_check(response){
    let dom=document.createRange().createContextualFragment(response.responseText);
    if(response.status==200){
        if(dom.querySelectorAll('div.market_sortable_column').length==0)is_Community_Items_Exist=false;
        let anchor=document.querySelectorAll('a.anchor_Items');
        for(let i = 0; i < anchor.length; i++){
            if(is_Community_Items_Exist){
                anchor[i].parentNode.classList.add('link_item');
            }else{anchor[i].style.display="none";}
        }
        anchor[0].parentNode.classList.add('checked_item');
    }else{//451
        console.log("market response.status: "+response.status+response.responseHeaders);
    }
}
function fn_re_avatar_check(response){
    if(response.status==200){
        if(response.finalUrl.search(new RegExp("/Avatar/List", "i"))==-1)is_avatar_Exist=false;
        let anchor=document.querySelectorAll('a.anchor_avatar')[0];
        if(is_avatar_Exist){
            anchor.parentNode.classList.add('link_avatar');
        }else{anchor.style.display="none";}
        anchor.parentNode.classList.add('checked_avatar');
    }else{//
        console.log("avatar response.status: "+response.status+response.responseHeaders);
    }
}
function fn_re_item(response){
    let dom=document.createRange().createContextualFragment(response.responseText);
    let url=fn_url(response.finalUrl);
    let appid=url[0].search.replace(/\?gamepage-appid-/i, '');
    if(response.status==200){
        let output=document.querySelectorAll('div.user_item')[0];
        //
        let dom_div=Array.from(dom.querySelectorAll('.container>div'));
        let count_card;
        let a_booster;
        for(let i=0; i<dom_div.length; i++){
            if(dom_div[i].classList.contains('items-center')){
                let div_span_a=dom_div[i].querySelectorAll('span>a').length>0?dom_div[i].querySelectorAll('span>a')[0].innerText:null;
                if(div_span_a==null)continue;
                if(div_span_a.search(/Trading Cards/i)==0){
                    count_card=dom_div[i+1].querySelectorAll('div>a>img').length;
                }
                if(div_span_a.search(/Booster Pack/i)==0){
                    let href_booster=dom_div[i+1].querySelectorAll('div>a')[0].href;
                    a_booster=create_a("booster "+6000/(count_card),href_booster,["linkbar","booster"],true,output);
                    let market_hash_name=href_booster.replace(new RegExp("https://steamcommunity.com/market/listings/753/", "i"), '');
                    if(gm_steamcommunity_item_json)fn_gm_XMLHttpRequest(priceoverview+"?appid=753&market_hash_name="+market_hash_name+"&currency="+gm_currency,fn_re_json_priceoverview);
                }
                if(div_span_a.search(/Badges/i)!=-1){
                    let ary_img=dom_div[i+1].querySelectorAll('div>img');
                    for(let j=0; j<ary_img.length; j++){
                        create_img_click(ary_img[j].src.replace(akamaihd, steamstatic),"Badges",[],true,output);
                    }
                    create_br(true,output);
                }
                if(div_span_a.search(/Emoticons/i)==0){
                    let ary_img=dom_div[i+1].querySelectorAll('div>img');
                    for(let j=0; j<ary_img.length; j++){
                        if(ary_img[j].src.search(new RegExp("/economy/emoticon", "i"))!=-1)continue;
                        create_img_click(ary_img[j].src.replace(akamaihd, steamstatic),"Emoticons",[],true,output);
                    }
                    create_br(true,output);
                }
                if(div_span_a.search(/Backgrounds/i)==0){
                    let ary_img=dom_div[i+1].querySelectorAll('div>a>img');
                    for(let j=0; j<ary_img.length; j++){
                        create_img_click(ary_img[j].src.replace(steamcommunity, steamstatic).replace(profilebackground, public_images),"Backgrounds",[],true,output);
                    }
                    create_br(true,output);
                }
                if(div_span_a.search(/Animated Stickers/i)==0){
                    let ary_img=dom_div[i+1].querySelectorAll('div>div.hover-toggle-secondary>img');
                    for(let j=0; j<ary_img.length; j++){
                        create_img_click(ary_img[j].src,"Animated Stickers",[],true,output);
                    }
                    create_br(true,output);
                }
                if(div_span_a.search(/Animated Backgrounds/i)==0){
                    let ary_img=dom_div[i+1].querySelectorAll('div>div.hover-toggle-primary>img');
                    for(let j=0; j<ary_img.length; j++){
                        create_img_click(ary_img[j].src.replace(steamcommunity, steamstatic).replace(profilebackground, public_images),"Animated Backgrounds",[],true,output);
                    }
                }
                if(div_span_a.search(/Animated Mini Backgrounds/i)==0){
                    let ary_img=dom_div[i+1].querySelectorAll('div>div.hover-toggle-primary>img');
                    for(let j=0; j<ary_img.length; j++){
                        create_img_click(ary_img[j].src,"Animated Mini Backgrounds",[],true,output);
                    }
                }
                if(div_span_a.search(/Avatar Frames/i)==0){
                    let ary_img=dom_div[i+1].querySelectorAll('div>div.hover-toggle-secondary>img');
                    for(let j=0; j<ary_img.length; j++){
                        create_img_click(ary_img[j].src,"Avatar Frames",[],true,output);
                    }
                    create_br(true,output);
                }
                if(div_span_a.search(/Animated Avatars/i)==0){
                    let ary_img=dom_div[i+1].querySelectorAll('div>div.hover-toggle-secondary>img');
                    for(let j=0; j<ary_img.length; j++){
                        create_img_click(ary_img[j].src,"Animated Avatars",[],true,output);
                    }
                    create_br(true,output);
                }
            }
        }
        if(dom_div.length>0){output.appendChild(a_booster);}
        else{
            create_span("fn_re_item querySelectorAll error",[],true,output);
        }
        console.log("fn_re_item 200");
    }else{//
        console.log("item response.status: "+response.status+response.responseHeaders);
    }
}
function fn_re_avatar(response){
    let dom=document.createRange().createContextualFragment(response.responseText);
    let url=fn_url(response.finalUrl);
    if(response.status==200){
        let output=document.querySelectorAll('div.user_item')[0];//console.log(response.responseText);
        let avatarBlockFull=Array.from(dom.querySelectorAll('div#avatarBlockFull>a>img'));
        for(let j=0; j<avatarBlockFull.length; j++){
            let img_url=avatarBlockFull[j].src;
            create_img_click(img_url,'',null,true,output);
        }
        create_br(true,output);
        console.log("fn_re_avatar 200");
    }else{//
        console.log("avatar response.status: "+response.status+response.responseHeaders);
    }
}
function fn_re_json_priceoverview(response){
    let output;
    if(document.location.host=="steamcommunity.com")output=document.querySelectorAll('div#largeiteminfo_item_type')[0];
    else if(document.location.host=="store.steampowered.com")output=document.querySelectorAll('a.booster')[0];
    else if(document.location.host=="www.steamcardexchange.net")output=document.querySelectorAll('.container>div>span.truncate')[1];
    if(response.status==200){
        let url=fn_url(response.finalUrl);
        let json=JSON.parse(response.responseText);
        let lowest_price=json['lowest_price'];
            output.innerText+=" "+lowest_price;

    }else{//
        console.log("json_render response.status: "+response.status+response.responseHeaders);
        create_span(" response_status: "+response.status,"response_status",true,output);
    }
}
function fn_re_json_render(response){
    let output;
    if(document.location.host=="steamcommunity.com")output=document.querySelectorAll('div#largeiteminfo_game_info')[0];
    else if(document.location.host=="store.steampowered.com")output=document.querySelectorAll('div.user_item')[0];
    else if(document.location.host=="www.steamcardexchange.net")output=document.querySelectorAll('div.game-title')[0];
    if(response.status==200){
        let url=fn_url(response.finalUrl);
        let json=JSON.parse(response.responseText);
        let text=json['results_html'];
        let results_html=document.createRange().createContextualFragment(text);
        let market_listing_price=results_html.querySelectorAll('span.market_listing_price');
        for(let i=0; i<market_listing_price.length; i++){
            output.appendChild(market_listing_price[i]);
        }
    }else{//
        console.log("json_render response.status: "+response.status+response.responseHeaders);
        create_span(" response_status: "+response.status,"response_status",true,output);
    }
}
function main_01(game_meta_data,appid){
    var tmp=document.querySelectorAll('div.Community_Items')[0];//old script
    if(tmp==undefined){
        var category_block=document.querySelectorAll('div#category_block')[0];
        var div_item_link=create_div(['block',"user_div_steam_info","Community_Items"],false,game_meta_data[0],category_block);
        var a_avatar=create_a("Avatar",url_avatar,['linkbar',"anchor_avatar"],true,div_item_link);
        var a_market=create_a("Community Market",url_category_753_Game,['linkbar',"anchor_Items"],true,div_item_link);
        var a_points=create_a("Points Shop",url_points_shop,['linkbar',"anchor_Items"],true,div_item_link);
        var a_steamcardexchange=create_a("steamcardexchange",url_cardexchange,['linkbar',"anchor_Items","external"],true,div_item_link);
        var a_steamdb=create_a("steamdb/communityitems",url_steamdb_communityitems,['linkbar',"anchor_Items","external"],true,div_item_link);
        div_item_link.style.backgroundImage="url('https://cdn.cloudflare.steamstatic.com/steam/apps/"+appid+"/page_bg_generated_v6b.jpg')";
        div_item_link.classList.add('link_dev');
        fn_gm_XMLHttpRequest(url_category_753_Game,fn_re_market_check);
        fn_gm_XMLHttpRequest(url_avatar,fn_re_avatar_check);
    }
}
function main_02(){
    let div_Community_item=document.querySelectorAll('div.Community_Items')[0];
    if(div_Community_item.classList.contains('checked_item')&&div_Community_item.classList.contains('checked_avatar')){
        window.clearInterval(timeoutID);
        if(div_Community_item.classList.contains('link_item'))fn_gm_XMLHttpRequest(url_cardexchange,fn_re_item);
        if(div_Community_item.classList.contains('link_avatar'))fn_gm_XMLHttpRequest(url_avatar,fn_re_avatar);//page dont load
    }
}
function main_inventory(){
    let url=fn_url(document.location);
    let econ_tag_filter_checkbox=document.querySelectorAll("input[type='checkbox'].econ_tag_filter_checkbox");
    for(let i=0; i<econ_tag_filter_checkbox.length; i++){
        let tag_name=econ_tag_filter_checkbox[i].getAttribute("tag_name");
        if(tag_name.search(/app_/i)==0&&!econ_tag_filter_checkbox[i].classList.contains('done')){
            let appid=tag_name.replace("app_","");
            create_a("Market","https://steamcommunity.com/market/search?appid=753&category_753_Game[]=tag_app_"+appid+"#p1_name_asc",["btn_green_white_innerfade","user_btn_steam"],true,econ_tag_filter_checkbox[i].parentNode);
            create_a("steamcardexchange","https://www.steamcardexchange.net/index.php?gamepage-appid-"+appid,["btnv6_blue_hoverfade","user_btn_steam","external"],true,econ_tag_filter_checkbox[i].parentNode);
            create_a("gamecards","https://"+url[0].host+url[0].pathname.replace("inventory","gamecards")+appid+url[0].search,["btn_grey_white_innerfade","user_btn_steam"],true,econ_tag_filter_checkbox[i].parentNode);
            econ_tag_filter_checkbox[i].classList.add("done");
        }
    }
}
function fn_steam_url(appid){
    url_steam_app="https://store.steampowered.com/app/"+appid;
    url_category_753_Game="https://steamcommunity.com/market/search?appid=753&category_753_Game[]=tag_app_"+appid+"#p1_name_asc";
    url_avatar="https://steamcommunity.com/ogg/"+appid+"/Avatar/List";
    url_points_shop="https://store.steampowered.com/points/shop/app/"+appid;
    url_curatorsreviewing="https://store.steampowered.com/curators/curatorsreviewing/?appid="+appid;
    url_cardexchange="https://www.steamcardexchange.net/index.php?gamepage-appid-"+appid;
    url_steamdb_app="https://steamdb.info/app/"+appid+"/";
    url_steamdb_communityitems="https://steamdb.info/app/"+appid+"/communityitems/";
    url_steamdb_achievements="https://steamdb.info/app/"+appid+"/stats/";
}
(function(){//main
    'use strict';
    let url=fn_url(document.location);
    let appid=steam_app_id(document.location);//document.location.host+document.location.pathname+document.location.search+document.location.hash
    fn_steam_url(appid);
    let lang=document.documentElement.lang;
    GM_registerMenuCommand("load json price"+(gm_steamcommunity_item_json?"✔️":"❌"), () => {
        GM_setValue('load_steamcommunity_item_json',!gm_steamcommunity_item_json);
    });
    console.log("steam: "+appid+" "+url[0].host);
    if(url[0].host=="store.steampowered.com"){
        let game_meta_data=document.querySelectorAll('div.game_meta_data');//steam game page
        if(game_meta_data.length>0){
            window.setTimeout(( () => main_01(game_meta_data,appid) ), 100);//old script
            let div_item_heading=create_node_text("div","community items",['block',"heading"],true,game_meta_data[0]);
            let div_item_main=create_div(['block',"user_div_steam_info","user_item"],true,game_meta_data[0]);
            timeoutID = window.setInterval(( () => main_02()), 1000);//show item image
            let div_curators=create_div(['block',"user_div_steam_info","user_curators"],true,game_meta_data[0]);
            create_a("curators",url_curatorsreviewing,"linkbar",true,div_curators);
        }
        if(url[0].pathname=="/curators/curatorsreviewing/"){//steam curatorsreviewing page
            let page_content=document.querySelectorAll('div.light_container>div.page_content');
            let div_lang=create_div(["breadcrumbs","user_div_steam_main"],false,page_content[0],page_content[0].firstChild);
            for(let i=0; i<ary_lang_steam.length; i++){
                let anchor_lang=create_a(ary_lang_steam[i],"#","lang",true,div_lang);
                anchor_lang.setAttribute("onclick","ChangeLanguage('"+ary_lang_steam[i]+"'); return false;");
                create_span(" / ","breadcrumb_separator",true,div_lang);
            }
        }
    }else if(url[0].host=="steamcommunity.com"&&document.querySelectorAll('div.error_ctn')[0]==undefined){
        let div_1=document.querySelectorAll('div.market_search_results_header>div')[0];//market/search
        if(div_1!=undefined){
            create_a(appid,url_steam_app,"market_searchedForTerm",true,div_1);
            create_a("steamdb",url_steamdb_communityitems,["market_searchedForTerm","external"],true,div_1);
            create_a("steamcardexchange",url_cardexchange,["market_searchedForTerm","external"],true,div_1);
            create_a("Normal Cards","https://"+url[0].host+url[0].pathname+url[0].search+s_normal_Cards,"market_searchedForTerm",true,div_1);
            create_a("Foil Cards","https://"+url[0].host+url[0].pathname+url[0].search+s_foil_cards,"market_searchedForTerm",true,div_1);
            create_a("Profile Background","https://"+url[0].host+url[0].pathname+url[0].search+s_p_background,"market_searchedForTerm",true,div_1);
            create_a("Emotion","https://"+url[0].host+url[0].pathname+url[0].search+s_emotion,"market_searchedForTerm",true,div_1);
            create_a("Sale Items","https://"+url[0].host+url[0].pathname+url[0].search+s_sale_items,"market_searchedForTerm",true,div_1);
        }
        if(url[0].pathname.search(new RegExp("/market/listings/", "i"))==0){//market/listings
            let div_2=document.querySelectorAll('div.market_listing_nav')[0];
            let div_3=document.querySelectorAll('div#mainContents')[0];
            let app_id=parseInt(url[0].pathname.replace(new RegExp("/market/listings/", "i"), ''));
            let market_hash_name=url[0].pathname.replace(new RegExp("/market/listings/"+app_id+"/", "i"), '');
            create_a(appid,url_steam_app,["btn_green_white_innerfade","user_btn_steam"],true,div_2);
            create_a("steamdb",url_steamdb_communityitems,["btn_grey_white_innerfade","user_btn_steam","external"],true,div_2);
            create_a("steamcardexchange",url_cardexchange,["btn_grey_white_innerfade","user_btn_steam","external"],true,div_2);
            create_a("priceoverview",priceoverview+"?appid="+app_id+"&market_hash_name="+market_hash_name+"&currency="+gm_currency,["btn_darkred_white_innerfade","user_btn_steam"],true,div_2);
            let a_render=create_a("render?currency="+gm_currency+"&format=json","https://"+url[0].host+url[0].pathname+"/render?start=0&count=10&currency="+gm_currency+"&language=english&format=json",["btn_darkred_white_innerfade","user_btn_steam"],true,div_2);
            a_render.title="You have made too many requests. Please wait and try your request again later.";
            if(gm_steamcommunity_item_json)fn_gm_XMLHttpRequest(priceoverview+"?appid="+app_id+"&market_hash_name="+market_hash_name+"&currency="+gm_currency,fn_re_json_priceoverview);
            let anchor=document.querySelectorAll('div.market_listing_nav>a');
            for(let i=0; i<anchor.length; i++){
                if(anchor[i].href.search(new RegExp("category_753_Game", "i"))!=-1){
                    anchor[i].href+="#p1_name_asc";
                    break;
                }
            }
            for(let i=0; i<ary_currency_steam.length; i++){//btn_currency
                let btn_currency=create_btn(ary_currency_steam[i],["btnv6_blue_hoverfade","user_btn_steam"],true,div_3);
                btn_currency.addEventListener('click',() => {
                    GM_setValue('steam_currency', i+1);
                });
            }
        }
        if(url[0].pathname.search(/\/stats\/\d+\/achievements/i)==0){//achievements /stats/\d+/achievements
            let div_tab=document.querySelectorAll('div#mainContents>div#tabs')[0];
            if(div_tab!=undefined){
                let div_achievements=create_div(["tabOff","user_div_steam_info"],true,div_tab);
                create_a("steamdb achievements",url_steamdb_achievements,["steamdb","external"],true,div_achievements);
            }
        }
        let div_profile_small_header_text=document.querySelectorAll('div.profile_small_header_text')[0];//profile game badge
        if(div_profile_small_header_text!=undefined){
            create_span("🛍️","profile_small_header_arrow",true,div_profile_small_header_text);
            create_a("Community Market",url_category_753_Game,"anchor",true,div_profile_small_header_text);
        }
        if(url[0].pathname.search(/\/profiles\/\d+\/gamecards/i)==0||url[0].pathname.search(/\/id\/.+\/gamecards/i)==0){//profiles/\d+/gamecards //id/.+/gamecards
            let gamecard=document.querySelectorAll('img.gamecard');
            if(gamecard.length>0)document.querySelectorAll('div.badge_title')[0].innerText+=" ["+6000/gamecard.length+"]";
        }
        if(url[0].pathname.search(/\/profiles\/\d+\/inventory/i)==0||url[0].pathname.search(/\/id\/.+\/inventory/i)==0){//profiles/\d+/inventory //id/.+/inventory
            window.setInterval(( () => main_inventory() ), 3000);
        }
    }else if(url[0].host=="steamdb.info"){
        if(appid!=null){
            let app_links=document.querySelectorAll('nav.app-links')[0];
            let tab_communityitems=document.querySelectorAll('a#tab-communityitems')[0];
            if(app_links!=undefined){
                if(tab_communityitems!=undefined)create_a("Community Market",url_category_753_Game,"linkbar",true,app_links);
                create_a("curators",url_curatorsreviewing,"linkbar",true,app_links);
            }
        }
    }else if(url[0].host=="www.steamcardexchange.net"){
        let container_div=document.querySelectorAll('.container>div');
        let count_card;
        for(let i=0; i<container_div.length; i++){
            if(container_div[i].classList.contains('items-center')){
                let div_span_a=container_div[i].querySelectorAll('span>a').length>0?container_div[i].querySelectorAll('span>a')[0].innerText:null;
                if(div_span_a!=null){
                    if(div_span_a.search(/Trading Cards/i)==0){
                        count_card=container_div[i+1].querySelectorAll('div>a>img').length;
                    }
                    if(div_span_a.search(/Booster Pack/i)==0){
                        let href_booster=container_div[i+1].querySelectorAll('div>a')[0].href;
                        let market_hash_name=href_booster.replace(new RegExp("https://steamcommunity.com/market/listings/753/", "i"), '');
                        if(gm_steamcommunity_item_json)fn_gm_XMLHttpRequest(priceoverview+"?appid=753&market_hash_name="+market_hash_name+"&currency="+gm_currency,fn_re_json_priceoverview);
                    }
                }
                if(container_div[i].classList.contains('lg\:flex-row')){//link
                    let btn_primary=container_div[i].querySelectorAll('div>a');
                    for(let i=0; i<btn_primary.length; i++){
                        if(btn_primary[i].innerText.search(new RegExp("STEAM MARKET", "i"))==0){
                            btn_primary[i].href+="#p1_name_asc";break;
                        }
                    }
                    create_a("steamdb",url_steamdb_app,["btn-primary","lg:w-min"],true,container_div[i]);
                }
            }
        }
        let game_name=document.querySelectorAll('.container>div>span.truncate').length>1?document.querySelectorAll('.container>div>span.truncate')[1]:null;
        if(game_name!=null){game_name.innerText+=" ["+6000/count_card+"]";}
        if(container_div.length==0)console.log("querySelectorAll error");
    }
})();
/*
btn_green_white_innerfade
btn_blue_white_innerfade
btn_darkblue_white_innerfade
btn_darkred_white_innerfade
btn_grey_white_innerfade
btn_grey_grey
btn_grey_grey_outer_bevel
btn_grey_black
btnv6_blue_hoverfade
btnv6_lightblue_blue
btnv6_blue_blue_innerfade
btnv6_green_white_innerfade
btnv6_grey_black
btnv6_white_transparent
btn_teal
btn_royal_blue
btn_plum
btn_green_steamui
btn_grey_steamui
btn_blue_steamui
//old
div.badge>div>img
div.emoticon>div>img
div.background>div>a>img
div.avataranimated>div>img.image-animated
div.sticker>div>img.image-animated
div.minibg>div>img
div.booster>div>div>a
div.card>div>a>img
*/