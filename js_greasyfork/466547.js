// ==UserScript==
// @name         steam baddge instantsearch beta
// @description  show badge and emoticon
// @namespace    steam_search_show_badge
// @author       Covenant
// @version      0.9
// @license      MIT
// @homepage
// @match        https://steamdb.info/instantsearch/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjAgMTYiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMiI+CjxjaXJjbGUgc3Ryb2tlLXdpZHRoPSIxLjVweCIgY3k9IjQuNSIgY3g9IjE1LjUiIHI9IjMuNzUiIGNsYXNzPSJzdHJva2UiIHN0cm9rZT0iI0JCQkJCQiIgZmlsbD0ibm9uZSI+PC9jaXJjbGU+CjxjaXJjbGUgY3g9IjE1LjUiIGN5PSI0LjUiIHI9IjEuODU1IiBjbGFzcz0iZmlsbCIgZmlsbD0iI0JCQkJCQiI+PC9jaXJjbGU+CjxwYXRoIGQ9Ik0xMS42NTYgNC4yTDEyLjc1IDcuMTRsMi44NjUgMS4zODctNS4xMyAzLjg1My0uODY3LTIuMDktMS43NzMtLjk0MnoiIGNsYXNzPSJmaWxsIiBmaWxsPSIjQkJCQkJCIj48L3BhdGg+CjxjaXJjbGUgY3k9IjEyLjUiIGN4PSI3LjUiIHI9IjMiIGNsYXNzPSJzdHJva2UiIHN0cm9rZT0iI0JCQkJCQiIgZmlsbD0ibm9uZSI+PC9jaXJjbGU+CjxyZWN0IHRyYW5zZm9ybT0ibWF0cml4KC45MjQzMiAuMzgxNiAtLjM4NzI3IC45MjE5NiAwIDApIiByeT0iMS41MjYiIHdpZHRoPSI5LjQ3NyIgeT0iNy4xNTUiIHg9IjMuNzY3IiBoZWlnaHQ9IjMuMDUzIiBjbGFzcz0iZmlsbCIgZmlsbD0iI0JCQkJCQiI+PC9yZWN0Pgo8L3N2Zz4=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      www.steamcardexchange.net
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/466547/steam%20baddge%20instantsearch%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/466547/steam%20baddge%20instantsearch%20beta.meta.js
// ==/UserScript==
const akamaihd="steamcdn-a.akamaihd.net";
const steamstatic="cdn.cloudflare.steamstatic.com";
const steamcommunity="steamcommunity.com";
const profilebackground="/economy/profilebackground";
const public_images="/steamcommunity/public/images";
function create_img(url,title,class_name,is_appendChild,node,refNode){
    let img = document.createElement('img');
    img.src=url;
    img.title=title;
    img.alt=title;
    img.height=54;
    if(is_appendChild){node.appendChild(img);}else{node.insertBefore(img, refNode);}
    return img;
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
function fn_url(url){
    let obj_url=new URL(url);
    let params=new URLSearchParams(obj_url.search);
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
    }
    else if(url[0].host=="steamdb.info"){
        if(ary_pathname[1]=="app")return ary_pathname[2];
    }
    else if(url[0].host=="steamcommunity.com"){
        if(ary_pathname[1]=="app")return ary_pathname[2];
        if(ary_pathname[3]=="achievements"){//achievements
            if(!isNaN(ary_pathname[2])){return ary_pathname[2];}
            else{
                var gameLogo_a=document.querySelectorAll('div.gameLogo>a')[0];
                if(gameLogo_a!=undefined){return fn_url(gameLogo_a.href)[0].pathname.split('/')[2];}
                else{return null;}
            }
        }
        if(url[1].get('category_753_Game[]')!=null)return url[1].get('category_753_Game[]').replace(/tag_app_/i, '');//Community Market
        if(ary_pathname[3]=="753")return parseInt(ary_pathname[4],10);//Community Market item
        if(ary_pathname[3]=="gamecards")return parseInt(ary_pathname[4],10);//badge
    }
    return null;
}
function fn_re_appdb(response){
    let dom=document.createRange().createContextualFragment(response.responseText);
    let url=fn_url(response.finalUrl);
    let appid=url[0].search.replace(/\?gamepage-appid-/i, '');
    if(response.status==200){
        let list_anchor=document.querySelectorAll('li>a.app');
        for(let i = 0; i < list_anchor.length; i++){
            let output=list_anchor[i].parentNode;
            if(appid==list_anchor[i].getAttribute("data-appid")){//output
                output.classList.add('add');
                var badge=Array.from(dom.querySelectorAll('div.badge>div>img'));
                for(let j = 0; j < badge.length; j++){
                    //output.appendChild(badge[j]);//Refused to load the image
                    create_img(badge[j].src.replace(akamaihd, steamstatic),'','',true,output);
                }
                output.appendChild(document.createElement('br'));
                var ary_img=Array.from(dom.querySelectorAll('div.emoticon>div>img'));
                ary_img=ary_img.concat(Array.from(dom.querySelectorAll('div.background>div>a>img')));
                for(let j = 0; j < ary_img.length; j++){
                    if(ary_img[j].src.search(new RegExp("/economy/emoticon", "i"))==-1){
                        let img_url=ary_img[j].src.replace(akamaihd, steamstatic);
                        img_url=img_url.replace(steamcommunity, steamstatic);
                        img_url=img_url.replace(profilebackground, public_images);
                        create_img(img_url,'','',true,output);
                    }
                }
            }
        }
    }
    else{//
        console.log("response.status: "+response.status+response.responseHeaders);
    }
}
function main_steamdb_01(){
    let facet__selected=document.querySelectorAll('div.s-facet__selected>div>span.s-facet--name-text');
    let card=false;
    for(let i = 0; i < facet__selected.length; i++){
        if(facet__selected[i].innerText=="Steam Trading Cards"){
            card=true;
            break;
        }
    }
    if(card){
        let list_anchor=document.querySelectorAll('li>a.app');
        //fn_XMLHttpRequest(list[0].href,fn_re_appdb);
        for(let i = 0; i < list_anchor.length; i++){
            if(list_anchor[i].parentNode.classList.contains('add')){break;}
            let appid=list_anchor[i].getAttribute("data-appid");
            let random=Math.random();
            random=random>0.5?random:random*2;
            let delay=i*1000*0.5+Math.floor(i/10)*1000*5+Math.floor(i/20)*1000*5+parseInt(1000*random,10);console.log("break");
            window.setTimeout(( () => {fn_gm_XMLHttpRequest("https://www.steamcardexchange.net/index.php?gamepage-appid-"+appid,fn_re_appdb)} ), delay);
        }
    }
}
(function() {
    'use strict';
    let url=fn_url(document.location);
    if(url[0].host=="store.steampowered.com"){}
    else if(url[0].host=="steamdb.info"){
        let timeoutID = window.setInterval(( () => main_steamdb_01() ), 5000);
    }
})();