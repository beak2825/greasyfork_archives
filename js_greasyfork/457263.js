// ==UserScript==
// @name         steam Community Items link beta
// @description  add Community Items link
// @namespace    steam_Community_Items_link
// @author       Covenant
// @version      1.0.2
// @license      MIT
// @homepage
// @match        https://store.steampowered.com/app/*
// @match        https://steamcommunity.com/market/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAEAAAAAAAB1c3QAm6yhAFFWUwDA1cgAtra2ALm/vACPlpEAfHx8AGtvbQCMjIwAXltdAMXKxwANCQwAHBsbAP///wAJBgcA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHw8PDw8PDw8PDw8PDw8PHw8PDwcLCwANDw8PDw8PDw8PDwoODQ0DAA8PDw8PDw8PDwoDCgQEDQMPDw8PDw8PDwEODg4ODg0ODw8PDw8PDw8ODg4ODg4NDgsNDw8PDw8PDg4ODg4NBQ4ODgAPDw8PDw4OAAAFDg4ODg4ODgYNDw8CDw8PDw0ODg4ODg4ODgoPDw8PDw8PCQ4OBAwMDAgODw8PDw8PDw8DDgwBDgENDgoPDw8PDw8PAg4MDg4ODA4KDw8PDw8PDw0ODAEOAQ0ODw8PDw8PDw8NCw4MDAwOCw8PDw8PDw8PDwILDg4OCwwPHw8PDw8PDw8PDQ0CDQ8PH4ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAAA=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      steamcommunity.com
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/457263/steam%20Community%20Items%20link%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/457263/steam%20Community%20Items%20link%20beta.meta.js
// ==/UserScript==
var is_Community_Items_Exist=true;
var is_avatar_Exist=true;
function create_div(class_name,appendChild,node,refNode){
    var div=document.createElement("div");
    div.classList.add('block');
    div.classList.add(class_name);
    div.style.fontFamily="Arial, Helvetica,'Segoe UI Emoji','Noto Color Emoji','Noto Sans Mono','Meiryo','Noto Sans JP','Microsoft JhengHei','Noto Sans TC','Noto Sans Symbols 2', sans-serif";
    div.style.fontWeight="100";
    div.style.backgroundSize='contain';
    div.style.backgroundRepeat='no-repeat';
    if(appendChild){
        node.appendChild(div);
    }
    else{node.insertBefore(div, refNode);}
    return div;
}
function create_a(text,url,class_name){
    var anchor=document.createElement("a");
    anchor.href=url;
    anchor.innerText=text;
    anchor.classList.add('linkbar')
    anchor.classList.add(class_name);
    anchor.style.fontWeight="100";
    anchor.target="_blank";
    return anchor;
}
function fn_re_market_check(response){
    let dom=document.createRange().createContextualFragment(response.responseText);
    if(response.status==200){
        if(dom.querySelectorAll('div.market_sortable_column').length==0)is_Community_Items_Exist=false;
        var anchor=document.querySelectorAll('a.anchor_Items');
        for(let i = 0; i < anchor.length; i++){
            if(is_Community_Items_Exist){
                anchor[i].parentNode.classList.add('link_item');
            }
            else{anchor[i].style.display="none";}
        }
        anchor[0].parentNode.classList.add('checked_item');
    }
    else{//451
        console.log("market response.status: "+response.status+response.responseHeaders);
    }
}
function fn_re_avatar_check(response){
    if(response.status==200){
        if(response.finalUrl.search(new RegExp("/Avatar/List", "i"))==-1)is_avatar_Exist=false;
        var anchor=document.querySelectorAll('a.anchor_avatar')[0];
        if(is_avatar_Exist){
            anchor.parentNode.classList.add('link_avatar');
        }
        else{anchor.style.display="none";}
        anchor.parentNode.classList.add('checked_avatar');
    }
    else{//
        console.log("avatar response.status: "+response.status+response.responseHeaders);
    }
}
function fn_XMLHttpRequest(url,fn){
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers:{
            'content-type': 'text/html; charset=UTF-8',
            'user-agent':window.navigator.userAgent
        },
        onload: function (response){
            fn(response);
            console.log([
                "GM_xmlhttpRequest",
                response.status,
                response.statusText,
                response.readyState,
                response.responseHeaders,
                //response.responseText,
                response.finalUrl].join("\n")
            );
        }
    });
}

(function() {
    'use strict';
    var Community_check=GM_getValue('Community_check', false)
    var url=new URL(document.location);
    var appid;
    GM_registerMenuCommand('🔁check Community Items'+(Community_check?"✔️":"❌"), () => {
        GM_setValue('Community_check', !Community_check);
        location.reload();
    });
    var game_meta_data=document.querySelectorAll('div.game_meta_data');//steam game page
    if(game_meta_data.length>0){
        var category_block=document.querySelectorAll('div#category_block')[0];
        var div_item=create_div("Community_Items",false,game_meta_data[0],category_block);

        appid=window.location.pathname.split('/')[2];
        var a_avatar=create_a("Avatar","https://steamcommunity.com/ogg/"+appid+"/Avatar/List","anchor_avatar")
        var a_market=create_a("Community Market","https://steamcommunity.com/market/search?appid=753&category_753_Game[]=tag_app_"+appid+"#p1_name_asc","anchor_Items")
        var a_points=create_a("Points Shop","https://store.steampowered.com/points/shop/app/"+appid,"anchor_Items")
        var a_steamcardexchange=create_a("steamcardexchange","https://www.steamcardexchange.net/index.php?gamepage-appid-"+appid,"anchor_Items")
        var a_steamdb=create_a("steamdb/communityitems","https://steamdb.info/app/"+appid+"/communityitems/","anchor_Items")
        div_item.appendChild(a_avatar);
        div_item.appendChild(a_market);
        div_item.appendChild(a_points);
        div_item.appendChild(a_steamcardexchange);
        div_item.appendChild(a_steamdb);
        div_item.style.backgroundImage="url('https://cdn.cloudflare.steamstatic.com/steam/apps/"+appid+"/page_bg_generated_v6b.jpg')";

        if(Community_check){
            fn_XMLHttpRequest("https://steamcommunity.com/market/search?appid=753&category_753_Game[]=tag_app_"+appid+"#p1_name_asc",fn_re_market_check);
            fn_XMLHttpRequest("https://steamcommunity.com/ogg/"+appid+"/Avatar/List",fn_re_avatar_check);
        }
    }
    var market_search_results_header=document.querySelectorAll('div.market_search_results_header');//steam market page
    if(market_search_results_header.length>0){
        appid=url.searchParams.get('category_753_Game[]').replace(/tag_app_/i, '');
        console.log(appid);
    }
})();