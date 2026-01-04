// ==UserScript==
// @name         search steam games name at bing(archive)
// @description  for Rewards
// @namespace    steam_name_bing
// @author       Covenant
// @version      1.0
// @license      MIT
// @homepage
// @match        https://store.steampowered.com/app/*
// @match        https://steamcommunity.com/app/*
// @match        https://store.steampowered.com/curator/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAZhSURBVHgBnVZdiFVVFF5rn3NH7EcdA0kknDJUIlKzsrdSEAoEx9deNAiih1Chnr1DRPikSBAExfhUvdR9MullpigFi8I3NdQbWghac8f5uedn77361t7nztwZ7/x5YN99zz57r+9b/5sJz9Hh8pT3csR5Xrt9E/O+nYacJ/JCND6V029Xha7drhFeiRmTENP8h8OI3wzJnq3Me7ZHOQ6CxiZzunCF6e9/8VEsibenP3937fH0/S/aR5zjo9YmXDqS3DJllmiqiAfvZ0STmaHpLIlAQpHIzFt44e4ZP1xCxnTJ1C6JrBNqtZmmIKcd5Ogxd/TImXuXU/Hp5gKgRamDqAzARAUElNWcYW16moVpFlw64NUrLMNSzbpYlEIW53OV4/COkRcMRYwYZjbYyZ43pxYbXEFcFHqI2JazqnXsrHvyTK3frfaMtvrOzDMWUCews/N9JFRCdlEAGQcS7EywM/U2AriovTg369+Oih7sLQiKzNV6jvb4xqYixfHM/CBRLLWwCYeivNQDWD8oY8wsrvtIRcQFK3WAZr9XnveV32XWCj0IYA0bRXF0axKsBguUnslxANGP4h88qGv4HsA5Mo9BEAkEYr5DqDsbeslR18AHEoTBAkrLuwSZIdCeexIgPVhGkwdsCdhcpaWCx+Bj6qQq95YjamUxiEDAYovnlJxrgRUclMLO+KKiKvLSxVzdxLNr0RXc9d45ZaoM8fMtANYeevsS5CDMIPUST8bbsgHpY4woNIJF38sH0QV6LsRMqUErIS6qd1ELddwYnPyAGHWzZSmt6AEjrmXID5vhen/TF/bFxOdnEymCqt7HLO+o4LRAZR61wNLUlKWJiZImMU9OlYxZ2m3Hee7ZFmriOIK/o94471FbPEXgHGlYDltndzVObmymCvD1yf4mpiODx8bqq1dLfaIthwtfq+quZojjLNOiJCFlPQRKjHvSopImiaQpIjpl6sPA/xDUpdXC4zAsZahIjz4CjW0xdP7Tjc1Zu/R4vvujPVA6V2eTHC5QzkZHLP38EyolKtnuLddoz7NX6blNt+ip9XeDrSemV9Ol69to5MpuunFvM/XVWN7YT/zSHqKxKaeleLh0fui9vf3NBx2zyPPVxbGBwpn6hV/s4bt/3qYPD35Lr267TpT2I4jWBN9Q1oxVSv+jmPx6czt9dO4devr5DbRjtxnGl57AyyLQeS6f++DUC5tvHaNHtxKt2oIViLWTSM1x4vYN2HoqgAuqD2vAWEf3WutPbzjwzfGlZC9JQC4PniCzqk6Pv0zU9wRCPQfIBMDvgMd9NI9WLKMKrHU81G38L9B2c6knb/4w9NAE5OLgAK3yN2ndK0LJGuzVYv5PHKLhjuz36LUa4QjU8B+9Xfu4zwz7DEdK2ls7dH50IQyzGAFKyy+p9iS0A5AdE5q+htFUn0sADH73HAo/qkzMPU1Djj0FhQdl/gQ9jAXk0v6dJH2/02PbYp3zbWhzJ9b5kJ9VDRTV2scCBguEqops8TkFK+A/6q7srb31/Y89dVyIAOVykBLcUjKY29QAMs4znZ8p3teCuhIbiFYvbeU2VEMQMaHJqTWo5EFsXhkBV/LrRrTc/BdBjYkGC92uaoki0RLaWYKb8KqlvmAlEq2BeIQVBhbCWdgCVruK9j0ApFX/DX2uarVhlmgJxwEcfQZuiuBKAmSUEHoI71wxAUEEO5RX4/R+JXqBQM9VZKnAOXRE8ZocHO8SNhCgLvAw2FJzxQQg5C+uMovhR07UHzAJm+gENb52PGgfbj+BREWkmAXXgW+thXAWTEOf86hGs0axVBEtuRYX+DjTpAiDsY90XWdEvoLLDAGdC3UkN1ZMICv6GhDacgAJAOiGvo3i0lYiXBUaE4iou7BWke0AV6M0XE72zoBFCfS/3WhRTkMRHMJzEzXPIqCPoKqtRO11LZCjzppqj+vFUH+90VwIZ8leMP3ZgRH4+zUx1d2/62i4WGoQSuV7jQXXFZCWbq450XhmMfkpLfHkWXqoZvwIQm+HZkGkIdWl1sTq61nzfYaAXt0wNz3LvqXkm6U29B9vtEpv9uL+d0ZN7ELwwdTxP8scl5gw4LrTflx2LWb6zrOs+0DnGftkcCDxcgIX60EYYV283sd6AAu04I4Grtpn+z9ujC5X5ooIzCFTH9yJVrsuvNSouRxtez3/A+QKgOHJJb6PAAAAAElFTkSuQmCC
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/461740/search%20steam%20games%20name%20at%20bing%28archive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461740/search%20steam%20games%20name%20at%20bing%28archive%29.meta.js
// ==/UserScript==
var btn_bing;
var btn_name_ja;
var input_word;
var name_en;
var name_ja;
var json_textarea;
var json=GM_getValue("steam_app_name_json", {"app_name":{}});
var is_show_link=GM_getValue("is_show_link",true);
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
const font_family_panel="font-family: 'Noto Sans Mono','Noto Mono','Cascadia Mono','Consolas','Liberation Mono','Monaco','Courier New','flag_patch','flag_white_patch','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','symbol_sans','symbol2_sans','color_emoji','emoji_back',monospace;";
const font_family_code="font-family: 'Firple Slim','Noto Sans Mono','Noto Mono','Cascadia Code','Consolas','Liberation Mono','Monaco','Courier New','flag_patch','flag_white_patch','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','symbol_sans','symbol2_sans','emoji_back',monospace;";
const font_family_steam="font-family: 'Motiva Sans',Arial, Helvetica,'flag_patch','flag_white_patch','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','symbol_sans','symbol2_sans','emoji_back',sans-serif;";
const font_face_default=`
@font-face{font-family: 'color_emoji';src: local('Twemoji Mozilla'),/*url('file:///C:/Program Files/Mozilla Firefox/fonts/TwemojiMozilla.ttf'),*/local('Noto Color Emoji'),local('Segoe UI Emoji'),local('Apple Color Emoji');}
@font-face{font-family: 'symbol_sans';src: local('Segoe UI Symbol'),local('NotoSansSymbols-Regular'),local('NotoSansSymbols-Regular-Subsetted'),local('Noto Sans Symbols')/*,local('Apple Symbols')*/;}
@font-face{font-family: 'symbol2_sans';src: local('NotoSansSymbols2-Regular'),local('NotoSansSymbols-Regular-Subsetted2'),local('Meiryo');}
@font-face{font-family: 'emoji_back';src: local('Noto Color Emoji'),local('Toss Face Font Web'),local('Segoe UI Emoji');}
`;
var style_font_face=create_style(font_face_default,"gm_font_face_steam_name_bing",["user_gm_css","css_steam_name_bing"]);
var style_user_css=create_style(".user_input_local_bing{width: 70%;min-width: 32em;"+font_family_steam+"font-weight: 100;font-size: 110%;}","gm_user_css_steam_name_bing",["user_gm_css","css_steam_name_bing"]);
style_user_css.textContent+=`
.user_btn_steam{`+font_family_steam+`}
.user_textarea_json_steam{`+font_family_code+`font-size: 0.75rem;}
.user_textarea_json_steam{background: #1B2838;color: #ACB2B8;}
.user_textarea_json_steam{padding: 0.25em;min-width: 95%;min-height: 10em;border-style: inset;border-width: 0.2rem;border-color: #707070;}\n`;
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
function create_input(placeholder,class_name,is_num,is_appendChild,node,refNode){
    let input=create_node("Input",class_name,is_appendChild,node,refNode);
    input.placeholder=placeholder;
    input.type="text";input.lang='ja';
    if(is_num)input.size="10";
    if(is_num)input.setAttribute("maxlength", "10");
    //if(is_num)input.setAttribute("oninput","this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*?)\\..*/g, '$1');");
    if(is_num){
        input.addEventListener("input", function (e) {
            this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        });
    }return input;
}
function create_textarea(placeholder,class_name,is_appendChild,node,refNode){
    let textarea=create_node("textarea",class_name,is_appendChild,node,refNode);
    textarea.placeholder=placeholder;
    textarea.lang='ja';
    return textarea;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    element.id="";
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
//console.log("break");
async function fn_re_steam_appdetails(response){
    let url=fn_url(response.url);
    let lang=url[1].get('l');
    if(response.status==200){
        let json=await response.json();
        let appid=steam_app_id(response.url);
        let data = json[appid];
        let { name, supported_languages, categories } = data.data;
        if(lang=="english"){
            name_en=name;
            input_word.value=name;
        }else if(lang=="japanese")name_ja=name;
    }else{
        if(lang=="english"){
            btn_bing.innerText+=" "+response.status;
        }
        //input_word.value=document.head.querySelectorAll('title')[0].innerText.replace(/ on Steam/i, '').replace(/Steam：/i, '').replace(/Steam - /i, '');
        console.log("appdetails response.status: "+response.status+response.responseHeaders);
    }
}
function fn_fetch(url,fn){
    fetch(url).then((response) => {
        console.log([
            "fetch",
            response.status,
            response.statusText,
            response.readyState,//
            response.responseHeaders,//
            response.ok,
            response.url].join("\n")
        );
        fn(response.clone());
        return response.json();
    }).then(data => {
        //console.log(data);
    }).catch(err => {
        console.log(err);
    });
}
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

function fn_btn_search(){
    window.open('https://www.bing.com/search?q='+encodeURIComponent(input_word.value), '_blank');
    //redirectWindow.location;
}
function fn_btn_name_ja(){
    //let text=navigator.clipboard.readText().then(clipText => {tmp=clipText});
    input_word.value=name_ja;
}
function fn_btn_name_save(){
    let appid=steam_app_id(document.location);
    let url=fn_url(document.location);
    if(url[0].host=="store.steampowered.com"&&url[0].pathname.search(/\/app\/\d+.+/i)==0){
        json["app_name"][appid]={};
        if(name_en!=undefined){
            json["app_name"][appid]["en"]=name_en;
        }
        if(name_ja!=undefined){
            if(name_ja!=name_en)json["app_name"][appid]["ja"]=name_ja;
        }
    }else if(url[0].host=="steamcommunity.com"&&url[0].pathname.search(/\/app\/\d+.+/i)==0){
        let div_apphub_AppName=document.querySelectorAll("div.apphub_AppName")[0].innerText;
        json["app_name"][appid]={};
        json["app_name"][appid]["delisted"]=div_apphub_AppName;
    }
    GM_setValue('steam_app_name_json',json);
    this.innerText="save name✔️";
    console.log(json);
}
function fn_btn_remove(){
    let appid=steam_app_id(document.location);
    delete json["app_name"][appid];
    GM_setValue('steam_app_name_json',json);
}
function fn_btn_json_copy(){
    fn_clipboard_w(json_textarea.value);
}
function fn_btn_json_save(){
    try{
        let json=JSON.parse(json_textarea.value);
        if(json["app_name"]==undefined){throw (new Error("Thrown if the string to parse is not valid JSON."));}
        GM_setValue('steam_app_name_json',json);
    }catch(e){
        alert(e.message);
    }finally{}
}

function main_01(){
    let title=document.querySelectorAll('div.apphub_HeaderStandardTop')[0];
    let game_meta_data=document.querySelectorAll('div.game_meta_data');
    let appid=steam_app_id(document.location);
    GM_registerMenuCommand("show link"+(is_show_link?"✔️":"❌"), () => {
        GM_setValue("is_show_link", !is_show_link);
        location.reload();
    });
    if(title!=undefined){//steam game page
        let div_print=create_div("user",true,title);
        input_word=create_input("game_name",["searchbox","user_input_local_bing"],false,true,div_print);
        fn_fetch("https://store.steampowered.com/api/appdetails?appids="+appid+"&l=english",fn_re_steam_appdetails);
        fn_fetch("https://store.steampowered.com/api/appdetails?appids="+appid+"&l=japanese",fn_re_steam_appdetails);
        btn_bing=create_btn("bingで検索",["btnv6_blue_hoverfade","user_btn_steam"],true,div_print);
        btn_bing.addEventListener('click',() => {fn_btn_search();});
        btn_name_ja=create_btn("name_ja",["btnv6_blue_hoverfade","user_btn_steam"],true,div_print);
        btn_name_ja.disabled=true;
        btn_name_ja.addEventListener('click',() => {fn_btn_name_ja();});
        let btn_name_save=create_btn("save name"+(json["app_name"][appid]!=undefined?"✔️":""),["btnv6_blue_hoverfade","user_btn_steam"],true,div_print);
        btn_name_save.disabled=true;
        btn_name_save.addEventListener('click',fn_btn_name_save);
        window.setTimeout(( () => {
            if(name_en==undefined&&name_ja==undefined){//429
                input_word.value=document.querySelectorAll('div#appHubAppName')[0].innerText;
            }else if(name_ja==name_en){
                btn_name_ja.style.setProperty("display", "none");
            }else{btn_name_ja.disabled=false;}
            btn_name_save.disabled=false;
        }),3000);
        window.setTimeout(( () => {
            if(is_show_link){
                let div_heading=create_div(['block',"heading","sans_steam"],true,game_meta_data[0]);
                div_heading.innerText="bingで検索";
                let div_json=create_div(['block',"user_div_steam_info"],true,game_meta_data[0]);
                for(let key_id in json["app_name"]){
                    for(let key_lang in json["app_name"][key_id]){
                        let str_name=json["app_name"][key_id][key_lang];
                        let link_bing=create_a(str_name,"https://www.bing.com/search?q="+encodeURIComponent(str_name),['linkbar',"external","sans_steam"],true,div_json);
                        link_bing.title=key_id;
                        //console.log(key_lang + ' - ' + json["app_name"][key_id][key_lang])
                    }
                }
                create_node("br",[],true,div_json);
                let btn_json_copy=create_btn("copy json",["btnv6_blue_hoverfade","user_btn_steam"],true,div_json);
                btn_json_copy.addEventListener('click',fn_btn_json_copy);
                let btn_json_save=create_btn("save bak json from text",["btnv6_blue_hoverfade","user_btn_steam"],true,div_json);
                btn_json_save.addEventListener('click',fn_btn_json_save);
                json_textarea=create_textarea("json={\"app_name\":{}}",["user_textarea_json_steam"],true,div_json);
                json_textarea.value=JSON.stringify(json,"1065970",2);
                let btn_remove=create_btn("remove: "+appid,["btnv6_blue_hoverfade","user_btn_steam"],true,div_json);
                btn_remove.addEventListener('click',fn_btn_remove);
            }
        }),1000);
    }
}
(function() {
    'use strict';
    let url=fn_url(document.location);
    window.onload = function(){
        if(url[0].host=="store.steampowered.com"){
            if(url[0].pathname.search(/\/app\/\d+.+/i)==0){
                main_01();//console.log("/\/app\/\d+.+/")
            }
        }else if(url[0].host=="steamcommunity.com"){
            if(url[0].pathname.search(/\/app\/\d+.+/i)==0){
                let div_apphub_AppDetails=document.querySelectorAll("div.apphub_AppDetails")[0];
                let btn_name_save=create_btn("save name",["btnv6_blue_hoverfade","user_btn_steam"],true,div_apphub_AppDetails);
                btn_name_save.addEventListener('click',fn_btn_name_save);
            }
        }
    };
})();