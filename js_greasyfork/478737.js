// ==UserScript==
// @name         gamer feature alpha
// @description  dev experimental feature
// @namespace    gamer_dev_alpha
// @author       Covenant
// @version      1.0
// @license      GNU
// @homepage
// @match        https://*.gamer.com.tw/*
// @match        https://gamer.com.tw
// @match        https://*.bahamut.com.tw/*
// @match        https://webcache.googleusercontent.com/search?q=cache:*https://*.gamer.com.tw*
// @match        https://web.archive.org/web/*/*.gamer.com.tw*
// @match        https://truth.bahamut.com.tw/*/*/*.*?w=*
// @exclude      https://m.gamer.com.tw/*
// @icon         data:image/svg+xml,<svg width='36' height='36' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid' class='uil-default'><path fill='none' class='bk' d='M0 0h100v100H0z'/><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='translate(0 -30)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(30 105.98 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.08333333333333333s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(60 75.98 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.16666666666666666s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(90 65 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.25s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(120 58.66 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.3333333333333333s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(150 54.02 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.4166666666666667s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(180 50 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(-150 45.98 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5833333333333334s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(-120 41.34 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.6666666666666666s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(-90 35 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.75s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(-60 24.02 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.8333333333333334s' repeatCount='indefinite'/></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='%23009499' transform='rotate(-30 -5.98 65)'><animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.9166666666666666s' repeatCount='indefinite'/></rect></svg>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/478737/gamer%20feature%20alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/478737/gamer%20feature%20alpha.meta.js
// ==/UserScript==
const isAppendChild=true;
const strIsNotFound=-1,strIsFoundFirst=0;
var baha_bg=GM_getValue('baha_bg', "2021");
function create_style(textContent,id,class_name){let style=create_style_iframes(textContent,id,class_name,document.body);return style;}
const str_font_serif_en="'Noto Serif','Times New Roman','Liberation Serif',";
const str_font_mono="'Menlo','Noto Mono','Cascadia Mono','Consolas','Droid Sans Mono','Liberation Mono','Monaco','NotoMono_CJK','Courier New',";
const str_font_code="'code_ligature','NotoMono_Slim','Menlo','Noto Mono','Cascadia Code','Consolas','Droid Sans Mono','Liberation Mono','Monaco','Courier New',";
const str_font_sans_ja="'IBM Plex Sans JP','Noto Sans CJK JP','Meiryo','Yu Gothic','IBM Plex Sans TC','Microsoft JhengHei','NotoMono_CJK',";
const str_font_sans_ja_MS_Gothic=str_font_sans_ja.replace(/'Meiryo',/i,"'MS Gothic','Meiryo',");
const str_font_serif_ja="'Noto Serif CJK JP','Yu Mincho','MS Mincho','MOESongUN','TW-Sung','TW-Sung-Ext-B','TW-Sung-Plus','SimSun','SimSun-ExtB',";
const str_font_kaishotai_ja="'HGSeikaishotaiPRO','manga_kana','TW-MOE-Std-Kai','TW-Kai','TW-Kai-Ext-B','TW-Kai-Plus','BiauKai','UD Digi Kyokasho NK-R','DFKai-SB','Yu Mincho','HiraMaruProN-W4',";
const str_font_emoji_end="'symbol_sans','emoji_back',",str_font_symbol_end="'symbol_sans','color_emoji','emoji_back',";
const str_font_sans_zh="'IBM Plex Sans TC','Noto Sans CJK JP','Microsoft JhengHei','NotoMono_CJK','Yu Gothic',";
const str_font_serif_zh="'Noto Serif CJK JP','MOESongUN','TW-Sung','TW-Sung-Ext-B','TW-Sung-Plus','PMingLiU','PMingLiU-ExtB','Yu Mincho','MS Mincho',";
const str_font_icon="'FontAwesome','Material Icons',";
const str_font_Iosevka_code="'Iosevka_Slab_code','Iosevka','Iosevka Curly','Firple Slim',";
const str_font_Iosevka_std="'Iosevka_code','Iosevka Fixed Slab','Iosevka Fixed Curly Slab','Iosevka Slab','Iosevka Curly Slab','Firple Slim',";
const font_family_code="font-family: 'emoji_patch',"+str_font_Iosevka_code+str_font_code+"'color_emoji',"+str_font_sans_ja+str_font_icon+str_font_emoji_end+"monospace;";//override Courier New
const font_family_bbcode="font-family: 'emoji_patch','Honk',"+str_font_Iosevka_code+str_font_code+"'color_emoji',"+str_font_sans_ja+str_font_emoji_end+"monospace;";
const font_family_serif_2="font-family: 'emoji_patch','sans_kana',"+str_font_serif_en+"'color_emoji',"+str_font_serif_ja+str_font_icon+str_font_emoji_end+"serif;";//MS Mincho
const font_family_submit="font-family: 'emoji_patch',"+str_font_Iosevka_std+str_font_mono+"'color_emoji',"+str_font_sans_ja_MS_Gothic+str_font_emoji_end+"monospace;";
const font_family_userid="font-family: 'manga_kana','kaiti_bpmf','emoji_patch',"+str_font_Iosevka_std+str_font_mono+"'color_emoji',"+str_font_sans_zh+str_font_emoji_end+"monospace;";
const font_family_txt="font-family: 'emoji_patch','kaiti_bpmf','manga_kana','Roboto','Arial','Segoe UI','Liberation Sans','color_emoji',"+str_font_sans_zh+str_font_emoji_end+"-apple-system,sans-serif;";
const font_family_serif_zh="font-family: 'emoji_patch','sans_bpmf','sans_kana',"+str_font_serif_en+"'color_emoji',"+str_font_serif_zh+str_font_emoji_end+"serif;";//新細明體
const font_family_mono_kaishotai="font-family: 'emoji_patch',"+str_font_mono+str_font_kaishotai_ja+str_font_symbol_end+"cursive;";//楷體
const str_font_console_std="'Noto Mono','Cascadia Mono','Consolas','Menlo','Droid Sans Mono','Liberation Mono','Monaco','Noto Sans Mono CJK JP',";
const str_font_console_monoserif="'Cutive Mono','FreeMono','Courier New','Liberation Mono',";
const str_font_console_emoji="'Twemoji Mozilla','Noto Color Emoji','Segoe UI Emoji',";
const str_font_console_sans_ja=str_font_sans_ja;
const str_font_console_kaishotai="'HGSeikaishotaiPRO','BiauKai','UD Digi Kyokasho NK-R','DFKai-SB','AR PL UKai TW','Yu Mincho',";
const css__mono_std="font-family: "+str_font_console_std+str_font_console_emoji+str_font_console_sans_ja+"sans-serif;font-weight: 100;";
const css__monoserif="font-family: "+str_font_console_monoserif+str_font_console_emoji+str_font_console_sans_ja+"sans-serif;font-weight: 100;";
const css__kaishotai="font-family: "+str_font_console_std+str_font_console_emoji+str_font_console_kaishotai+"sans-serif;font-weight: 100;";
const css_font_size_14px="font-size: 14px;",css_font_size_20px="font-size: 20px;",css_font_size_72px="font-size: 72px;";
const url_api_font_bbcode="https://fonts.googleapis.com/css2?family=Honk:SHLN@0&display=swap&text=%2F%3D";
var style_user_css=create_style("tr.clean_tag>td>input[type=\"text\"]{"+font_family_submit+"font-weight: 100;font-size: 0.75rem;}\n","gm_user_css_gamer_dev_alpha",["user_gm_css","css_gamer_dev_alpha"]);
style_user_css.textContent+=`tr.clean_tag>td>input[type="text"]{min-width: 95%;padding: 0.1rem;}
.overflow_y_scroll{overflow-y: scroll;}\n.max_height_128px{max-height: 128px;}
img.maxvh{max-height: 75vh;}\n.hash64{min-width: 32em;max-width: 64em;}
.font_for_white{text-shadow: -1px -1px #1E1E1E80, -1px 1px #1E1E1E80, 0px -1px #1E1E1E80, 0px 1px #1E1E1E80, 1px 0px #1E1E1E80, -1px 0px #1E1E1E80, 1px -1px #1E1E1E80, 1px 1px #1E1E1E80;}
.font_for_black{text-shadow: -1px -1px #FFFFFF, -1px 1px #FFFFFF, 0px -1px #FFFFFF, 0px 1px #FFFFFF, 1px 0px #FFFFFF, -1px 0px #FFFFFF, 1px -1px #FFFFFF, 1px 1px #FFFFFF;}
/*overwrite webcss*/
body,textarea,.c-section{`+font_family_txt+`}
.b-list__main__title,.HOME-mainbox1b.HOME-mainbox1b *,.GN-lbox2D.GN-lbox2D *,.GN-lbox3B,.GN-lbox3B *,.GU-gained.GU-gained *{`+font_family_txt.replace(/;/i," !important;")+`}
.userid,.b-list__count__user,.b-list__time__user,.user-info,.gamer_avatar-info,.usercard-label-id,.usercard-label-name,div.hint,.info-text,.article-intro,a.BH-talkman,#showdDetal,a[data-id="author"]{`+font_family_userid+`font-weight: 200;}
textarea#source#source{`+font_family_bbcode+`font-weight: 300;}
div.ML-lbox2,.popup-dailybox--width{`+font_family_code+`font-weight: 200;}
/*插入貼圖彈窗，把彈窗拉到最寬以顯示最多貼圖，但會影響GP投票用戶彈窗*/
div#tippy-190{width: 1280px;max-width: 80%;}\ndiv.tippy-box{max-width: 95% !important;}
div.sticker-wrapper{width: 100%;max-width: 100%;}\nul>div>div>div.slick-slide{max-width: 44px !important;}
ul>div>div>div.slick-slide:nth-child(6n+2){background-image: linear-gradient(45deg, #13AEAB 50%, #117E96 50%);}\nli.sticker-list__item{flex-basis: max-content;}
/*預覽被隱藏的右側NOW*/
div.chatroom{display: block !important;}
/*本板推薦/延伸閱讀*/
div.popular__item>a>div.img{text-align: center;}
div.popular__card-img>a>img,div.popular__item>a>div.img>img{background-image: repeating-conic-gradient(#13AEAB 0 5deg, #117E96 5deg 10deg);}
div.popular__card-img>a>img[src*='im.bahamut.com.tw/sticker/'].card__img,div.popular__item>a>div.img>img[src*='im.bahamut.com.tw/sticker/'],div.stickerdetail-img>img[src*='im.bahamut.com.tw/sticker/']
{object-fit: contain;background-image: linear-gradient(45deg, #13AEAB 50%, #117E96 50%);/*max-width: 128px;max-height: 128px;*/}
div.popular__card-img>a>img[src*='i.ytimg.com/vi/'].card__img,div.popular__card-img>a>img[src*='i1.ytimg.com/vi/'].card__img,
div.popular__item>a>div.img>img[src*='i.ytimg.com/vi/'],div.popular__item>a>div.img>img[src*='i1.ytimg.com/vi/']
{object-fit: contain;background-image: repeating-linear-gradient(-45deg,#13AEAB 0px 10px,#117E96 10px 20px);}
div.popular__item>a>div.img>img[src*='avatar2.bahamut.com.tw/avataruserpic/']{object-fit: contain;background-image: none;}
/*我的收藏排序本頁資料*/
#bookmarkSortEditor{font-size: 0.75rem;}\n#bookmarkSortEditor>tbody>tr>td{padding-block-start: 2px;padding-block-end: 2px;}
/*iframe[data-src*='www.youtube.com/embed/']{width: 640px;height: 240px;max-width: 95%;max-height: 44.5vw;}*/\n`;
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
function create_details(summary,class_name,is_appendChild,node,refNode){
    let details=create_node("details",class_name,is_appendChild,node,refNode);
    let node_summ=create_node_text("summary",summary,[],true,details);
    return [details,node_summ];
}
function create_link_stylesheet(url,class_name,is_appendChild,node,refNode){
    let link_stylesheet=create_node("link",class_name,is_appendChild,node,refNode);
    link_stylesheet.rel="stylesheet";
    link_stylesheet.href=url;
    return link_stylesheet;
}
function create_style_iframes(textContent,id,class_name,node){
    let style=create_node("style",class_name,isAppendChild,node);
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
//console.log("%cbreak",css__mono_std);
function fn_avatar_userpic(uid){
    let str_avataruserpic=("https://avatar2.bahamut.com.tw/avataruserpic/"+uid[0]+"/"+uid[1]+"/"+uid+"/"+uid+".png").toLowerCase();
    return [str_avataruserpic,str_avataruserpic.replaceAll(".png","_s.png")];
}
function fn_re_friendMore(response){//要跨站不能用這個
    let dom=document.createRange().createContextualFragment(response.responseText);
    let url=fn_url(response.responseURL);
    let output_div_BH_slave=document.querySelectorAll('div#BH-slave');
    if(output_div_BH_slave.length==0)return;
    output_div_BH_slave=output_div_BH_slave[0];
    //fn_output_text(BH_rbox_p,"Co: "+url[1].get('sn')+" "+new Date().toLocaleString(),true);
    if(response.status==200){//這裡全部每次都要按照各種目標網頁格式重寫
        let div_BH_lbox_MSG_box12=dom.querySelectorAll('div.BH-lbox.MSG-box12');
        if(div_BH_lbox_MSG_box12.length==0)return;
        div_BH_lbox_MSG_box12.forEach((fe_BH_lbox_MSG_box12,i) =>{
            fe_BH_lbox_MSG_box12.classList.add("overflow_y_scroll");fe_BH_lbox_MSG_box12.classList.add("max_height_128px");
            output_div_BH_slave.insertBefore(fe_BH_lbox_MSG_box12,output_div_BH_slave.firstChild);
            let str_friendMore_length=fe_BH_lbox_MSG_box12.querySelectorAll('a').length;
            let h5_friendMore=create_node_text("h5","",[],!isAppendChild,output_div_BH_slave);
            let a_dashboard_guest=create_a("今日訪客一覽","https://home.gamer.com.tw/creation/dashboard_guest.php",["sans"],isAppendChild,h5_friendMore);
            let a_friendMore=create_a("（"+str_friendMore_length+"）",response.responseURL,["code"],isAppendChild,h5_friendMore);
        });
        delete dom;
    }
    else{//429
        console.log("response.status: "+response.status+response.responseHeaders);
    }
}
function fn_create_c_post__header__tools(is_appendChild,node,refNode){
    let url=fn_url(document.location);
    let div_c_post__header__tools=create_div(["c-post__header__tools","sans"],is_appendChild,node,refNode);
    let btn_loadpic=create_btn("",["ef-btn","ef-bounce","btn-loadpic","tippy-title-icon","is-cancel"],isAppendChild,div_c_post__header__tools);
    btn_loadpic.title="關閉圖片影片（裝飾用）";btn_loadpic.type="button";
    let div_loadpic=create_div("ef-btn__effect",isAppendChild,btn_loadpic);
    create_i("圖",["icon-font","sans"],isAppendChild,div_loadpic);
    if(url[0].pathname.search(new RegExp("/Co.php", "i"))==strIsFoundFirst){
        let btn_jumptowhole=create_btn("",["ef-btn","ef-bounce","btn-loadpic","tippy-title-icon"],isAppendChild,div_c_post__header__tools);
        btn_jumptowhole.title="看整串主題（裝飾用）";btn_loadpic.type="button";
        let div_jumptowhole=create_div("ef-btn__effect",isAppendChild,btn_jumptowhole);
        create_i("串",["icon-font","sans"],isAppendChild,div_jumptowhole);
    }
}
function fn_setInterval_lzl(){
    let url=fn_url(document.location);
    let c_post=document.querySelectorAll('.c-post');
    for(let i=0; i<c_post.length; i++){
        let a_floor=c_post[i].querySelectorAll('a.floor')[0];
        let c_reply__item=c_post[i].querySelectorAll('div.c-reply__item');//留言
        for(let i=0; i<c_reply__item.length; i++){
            let content__user=c_reply__item[i].querySelectorAll('a.reply-content__user')[0].href;
            let name=content__user.replace(/https:\/\/home.gamer.com.tw\//i, '');
            let div_buttonbar=c_reply__item[i].querySelectorAll('div.buttonbar')[0];
            if(c_reply__item[i].querySelectorAll(".tag_lzl_link").length==0){
                let details_link=create_details("搜發表",["inline_block","user_details","f_s_0_75rem","tag_lzl_link"],isAppendChild,div_buttonbar);
                create_node("br",[],isAppendChild,details_link[0]);
                let a_tmp=create_a("\uF002 搜發表","https://forum.gamer.com.tw/search.php?bsn="+url[1].get('bsn')+"&q="+name+"&author="+name+"&sortType=mtime",["inline_block","user_a_panel_12px","user_a_panel_alpha"],isAppendChild,details_link[0]);
                a_tmp=create_a("站內發表","https://home.gamer.com.tw/bookmarkHistoryForum2.php?owner="+name+"&bsn="+url[1].get('bsn'),["inline_block","user_a_panel_12px","user_a_panel_alpha"],isAppendChild,details_link[0]);
                a_tmp.title="需登錄才能查看此頁面";
                a_tmp=create_a("舊版搜尋","https://forum.gamer.com.tw/Bo.php?bsn="+url[1].get('bsn')+"&qt=6&q="+name,["inline_block","user_a_panel_12px","user_a_panel_alpha"],isAppendChild,details_link[0]);
                a_tmp.title="能用多久我也不知道";
            }
        }
    }
}
function fn_setTimeout_water(){
    let url=fn_url(document.location);
    let water=document.querySelectorAll('div#BH-master>table tr');
    for(let n=0; n<water.length; n++){
        if(n==0)continue;
        let td=water[n].querySelectorAll('td');
        let uid=td[0].textContent;
        td[0].textContent="";
        create_a(uid,"https://forum.gamer.com.tw/search.php?bsn="+url[1].get('bsn')+"&q="+uid+"&author="+uid+"&sortType=mtime",["td_user"],isAppendChild,td[0]);
        let a_tmp=create_a("舊版搜尋","https://forum.gamer.com.tw/Bo.php?bsn="+url[1].get('bsn')+"&qt=6&q="+uid,["user_a_panel_12px"],isAppendChild,td[0]);
        a_tmp.title="能用多久我也不知道";
        let details_link=create_details("勇造圖片",["user_details","f_s_0_75rem"],isAppendChild,td[0]);
        create_img(fn_avatar_userpic(uid)[0],"avataruserpic",[],isAppendChild,details_link[0]);
    }
}
function fn_setInterval_homeCssUsedMore(){
    let div_themebox=document.querySelectorAll('div.themebox');
    div_themebox.forEach((fe_themebox,i) =>{
        if(fe_themebox.querySelectorAll('a.wallpaper_sample').length>0)return;
        let p_themeboxB=fe_themebox.querySelectorAll('p.themeboxB')[0];//這區塊css用了white-space: nowrap;所以會溢出去，按鈕不能放這
        let a_themeboxB=p_themeboxB.querySelectorAll('a');//從最近套用此佈景鏈接獲取佈景id
        a_themeboxB.forEach((fe_themeboxB_a,j) =>{
            let href_themeboxB=fn_url(fe_themeboxB_a.href);
            if(href_themeboxB[0].pathname=="/homeCssUsedMore.php"){
                let get_wsn=href_themeboxB[1].get('wsn');
                let p_output=create_node_text("p","",[],isAppendChild,fe_themebox);
                create_a("舊版主要頁面","https://home.gamer.com.tw/homeCssSampleA.php?wsn="+get_wsn+"&from=upload",["wallpaper_sample","user_a_panel_12px","sans"],isAppendChild,p_output);
                create_a("舊版次要頁面","https://home.gamer.com.tw/homeCssSampleB.php?wsn="+get_wsn+"&from=upload",["wallpaper_sample","user_a_panel_12px","sans"],isAppendChild,p_output);
                create_a("新版小屋預覽"+get_wsn,"https://home.gamer.com.tw/profile/wallpaper_old_view.php?wsn="+get_wsn,["wallpaper_sample","user_a_panel_12px","code"],isAppendChild,p_output);
            }
        });
    });
}
function fn_setInterval_scenery_main(){
    let div_scenery_lobby_card=document.querySelectorAll('div.scenery-lobby__page__warp__card');
    div_scenery_lobby_card.forEach((fe_scenery_lobby_card,i) =>{
        if(fe_scenery_lobby_card.querySelectorAll('a.wallpaper_post_view').length>0)return;
        let img_card__img=fe_scenery_lobby_card.querySelectorAll('img');//從圖片鏈接獲取佈景id
        img_card__img.forEach((fe_card__img,j) =>{
            let str_sn=fn_url(fe_card__img.src)[0].pathname.replaceAll("/HOME/wallpaper_new/P","").replaceAll("_cover.JPG","").replaceAll("_cover.PNG","").replaceAll("_cover.WEBP","");
            create_a("右鍵預覽"+str_sn,"https://home.gamer.com.tw/profile/wallpaper_post_view.php?sn="+str_sn,["wallpaper_post_view","user_a_panel_12px","sans"],isAppendChild,fe_scenery_lobby_card);
        });
    });
}
function fn_setTimeout_c_co_3000(){
    let c_post=document.querySelectorAll('.c-post');
    for(let i=0; i<c_post.length; i++){//樓層位置
        let a_edittime=c_post[i].querySelectorAll('a.edittime');
        a_edittime.forEach((fe_edittime,i) =>{//ip
            let hideip=fe_edittime.getAttribute("data-hideip");
            if(hideip.search(new RegExp("BAHAMUT", "i"))==-1){
                let c_post__header__info=c_post[i].querySelectorAll('.c-post__header__info')[0];
                let span_ip=create_node_text("span","",["hideip","span_title"],isAppendChild,c_post__header__info);
                create_a(hideip.replace(/xxx/i, '*'),"https://\u0069\u0070info.io/#"+hideip.replace(/xxx/i, '1'),[],isAppendChild,span_ip);
            }
        });
    }//*/
}
function fn_setTimeout_b_3000(){
    let url=fn_url(document.location);
    let a_list_user=Array.from(document.querySelectorAll('p.b-list__count__user>a'));
    a_list_user=a_list_user.concat(Array.from(document.querySelectorAll('p.b-list__time__user>a,div>a.card__text-author-a')));
    a_list_user.forEach((a_fe_list_user,i) =>{
        let uid=a_fe_list_user.href.replace(/https:\/\/home.gamer.com.tw\//i, "");
        a_fe_list_user.href="https://forum.gamer.com.tw/Bo.php?bsn="+url[1].get('bsn')+"&qt=6&q="+uid;
        a_fe_list_user.classList.add("outline");
    });
}
function fn_setTimeout_c_co_12000(){
    let url=fn_url(document.location);
    let div_ip_list_table=document.querySelectorAll('div.ip-list>table');
    div_ip_list_table.forEach((fe_ip_list_table,t) =>{//📦483109
        if(t%2==1){//偶數表格才是用戶
            let div_ip_list_tr=fe_ip_list_table.querySelectorAll('tr');
            if(div_ip_list_tr.length>1){
                for(let n=1; n<div_ip_list_tr.length; n++){//用戶列表
                    let td_ip_list=div_ip_list_tr[n].querySelectorAll('td')[0];
                    let a_ip_list=td_ip_list.querySelectorAll('a')[0];
                    let home=a_ip_list.href;
                    let uid=home.replace(/https:\/\/home.gamer.com.tw\//i, '');
                    uid=uid.replace("&","").replace(/profile\/index.php\?owner=/i, '');
                    let username=a_ip_list.innerText;
                    a_ip_list.classList.add("sans");
                    let p_search=create_node("p",[],isAppendChild,td_ip_list);
                    create_a(uid,"https://forum.gamer.com.tw/search.php?bsn="+url[1].get('bsn')+"&q="+uid+"&author="+uid+"&sortType=mtime",["code","f_s_0_75rem"],isAppendChild,p_search);
                    create_img(fn_avatar_userpic(uid)[1],uid,[],!isAppendChild,div_ip_list_tr[n].querySelectorAll('td')[2]);
                    create_a("舊版搜尋","https://forum.gamer.com.tw/Bo.php?bsn="+url[1].get('bsn')+"&qt=6&q="+uid,["user_a_panel_12px"],isAppendChild,p_search);
                    let details_link=create_details("勇造圖片",["inline_block","user_details","f_s_0_75rem"],isAppendChild,p_search);
                    create_img(fn_avatar_userpic(uid)[0],"avataruserpic",[],isAppendChild,details_link[0]);
                }
            }
        }
    });
}
function fn_create_css_animation_bg(){
    let BH_background=document.querySelectorAll('#BH-background,.creation-container,.wrapper');console.log("%cBH_background.length:"+BH_background.length,css__monoserif+css_font_size_14px);
    create_node("div",["pointer_events_none","time2023"],isAppendChild,document.body);
    create_node("div",["pointer_events_none","time2022"],isAppendChild,document.body);
    create_node("div",["pointer_events_none","firework2024_l"],isAppendChild,document.body);
    create_node("div",["pointer_events_none","firework2024_r"],isAppendChild,document.body);
    create_node("div",["pointer_events_none","firework2023"],isAppendChild,document.body);
    create_node("div",["pointer_events_none","firework2021"],isAppendChild,document.body);
    create_node("div",["pointer_events_none","firework2020"],isAppendChild,document.body);
    create_node("div",["pointer_events_none","BA_year_fw_2019"],isAppendChild,document.body);
    create_node("div",["pointer_events_none","festival_2018_fw1"],isAppendChild,document.body);
    create_node("div",["pointer_events_none","festival_2018_fw2"],isAppendChild,document.body);
    create_node("div",["pointer_events_none","festival_2018_fw3"],isAppendChild,document.body);
    if(BH_background.length>0){BH_background[0].classList.add("building_"+baha_bg);}
    else{document.body.classList.add("building_"+baha_bg);}
}
(function(){
    'use strict';
    if(document.body==null)return;
    let url=fn_url(document.location);
    let uid_login="";
    let topbar_member_home=document.querySelectorAll('a.topbar_member-home');
    let is_login=topbar_member_home.length==1?true:false;
    if(is_login){//添加右上角小屋鏈接的owner參數
        let ary_tmp=fn_url(topbar_member_home[0].querySelectorAll('img')[0].src)[0].pathname.split('/');
        uid_login=is_login?ary_tmp.pop().replace(/_s.png/i, ""):null;
        topbar_member_home[0].title=baha_bg;
        let link=create_link_stylesheet(url_api_font_bbcode,["user_gm_font_face","css_gamer_dev_alpha"],true,document.head);
    }
    if(url[0].host.search(new RegExp("forum.gamer.com.tw", "i"))==strIsFoundFirst){//📻哈啦區
        if(url[0].pathname.search(new RegExp("/C.php", "i"))==strIsFoundFirst||url[0].pathname.search(new RegExp("/Co.php", "i"))==strIsFoundFirst){//🛄哈啦區的文
            let c_section=document.querySelectorAll('section.c-section');//樓層位置
            for(let i=0;i<c_section.length;i++){
                if(c_section[i].id.search(/post_/i)==0){//確認是樓層
                    let userid=c_section[i].querySelectorAll('.userid')[0].innerText;//各樓層id
                    let c_post__header__info=c_section[i].querySelectorAll('.c-post__header__info')[0];//在各樓層添加搜索傳送門
                    let a_tmp=create_a("舊版搜尋","https://forum.gamer.com.tw/Bo.php?bsn="+url[1].get('bsn')+"&qt=6&q="+userid,["float_right","user_a_panel_12px","user_a_panel_alpha"],isAppendChild,c_post__header__info);
                    a_tmp.title="能用多久我也不知道";
                    a_tmp=create_a("站內發表","https://home.gamer.com.tw/bookmarkHistoryForum2.php?owner="+userid+"&bsn="+url[1].get('bsn'),["float_right","user_a_panel_12px","user_a_panel_alpha"],isAppendChild,c_post__header__info);
                    a_tmp.title="需登錄才能查看此頁面";
                    create_a("\uF002 搜發表","https://forum.gamer.com.tw/search.php?bsn="+url[1].get('bsn')+"&q="+userid+"&author="+userid+"&sortType=mtime&firstFloorOnly=0&advancedSearch=1",["float_right","user_a_panel_12px","user_a_panel_alpha"],true,c_post__header__info);
                    let c_post__header=c_section[i].querySelectorAll('div.c-post__header');//還原關閉圖片影片按鈕（裝飾用）
                    //c_post__header=c_post__header.length==1?c_post__header[0]:c_post__header;//投票會多出一個c-post__header
                    let h1_c_post__header__title=c_post__header[0].querySelectorAll('h1');
                    if(h1_c_post__header__title.length==1)fn_create_c_post__header__tools(!isAppendChild,c_post__header[0],h1_c_post__header__title[0]);
                    let str_home=c_section[i].querySelectorAll('a.userid')[0].href;//建立複製點擊區
                    let str_uid=str_home.replace(/https:\/\/home.gamer.com.tw\//i, "");
                    let div_postcount=c_section[i].querySelectorAll('div.postcount');
                    div_postcount.forEach((fe_postcount,i) =>{
                        fe_postcount.addEventListener('click',() => {fn_clipboard_w(str_uid);});
                        fe_postcount.classList.add("outline");fe_postcount.classList.add("cursor_copy");
                        fe_postcount.title="複製用戶id";
                    });
                }
            }
            let c_post=document.querySelectorAll('.c-post');
            for(let i=0;i<c_post.length;i++){
                if(i==0&&c_post[i].querySelectorAll('h1').length>0){//如果Co是首篇已刪則顯示標題
                    let str_c_post__header__title=c_post[i].querySelectorAll('h1')[0].textContent.trim();
                    let str_h1_scrolldown=document.querySelectorAll('div.c-menu__scrolldown>h1')[0].textContent.trim();
                    if(str_c_post__header__title.replace("RE:","")!=str_h1_scrolldown){//str_title.trim().search(str_c_post__header__title.trim())!=strIsNotFound
                        c_post[i].querySelectorAll('h1')[0].textContent=c_post[i].querySelectorAll('h1')[0].textContent+"："+str_h1_scrolldown;console.log("%c"+str_c_post__header__title+"="+str_h1_scrolldown,css__mono_std);
                        document.head.querySelectorAll('title')[0].textContent=str_h1_scrolldown+"（首篇已刪）"+document.head.querySelectorAll('title')[0].textContent;
                    }
                }
                let edittime=c_post[i].querySelectorAll('a.edittime');
                if(edittime.length==1){//
                    let hideip=edittime[0].getAttribute("data-hideip");
                    if(hideip.search(new RegExp("BAHAMUT", "i"))==-1){
                        let c_post__header__info=c_post[i].querySelectorAll('.c-post__header__info')[0];
                        let div_post__header__author=c_post[i].querySelectorAll('div.c-post__header__author')[0];
                        let span_ip_api=create_node_text("span","",["hideip","span_title"],isAppendChild,c_post__header__info);
                        create_a("ip-api","https://ip-api.com/#"+hideip.replace(/xxx/i, '1'),[],isAppendChild,span_ip_api);
                        let span_ipinfo=create_node_text("span","",["hideip","span_title"],isAppendChild,c_post__header__info);
                        create_a("ipinfo","https://ipinfo.io/"+hideip.replace(/xxx/i, '1'),[],isAppendChild,span_ipinfo);
                    }
                }
            }
            let div_c_disable=document.querySelectorAll('div.c-disable');
            for(let n=0; n<div_c_disable.length; n++){//樓層折疊/刪除
                if(n==0){//C.php首篇已刪
                    let h1_c_disable__title=div_c_disable[n].querySelectorAll('h1');
                    h1_c_disable__title.forEach((fe_c_disable__title,i) =>{
                        if(fe_c_disable__title.textContent=="首篇已刪"){
                            let str_h1_scrolldown=document.querySelectorAll('div.c-menu__scrolldown>h1')[0].textContent;
                            fe_c_disable__title.textContent=fe_c_disable__title.textContent+"："+str_h1_scrolldown;
                            document.head.querySelectorAll('title')[0].textContent=str_h1_scrolldown+"（首篇已刪）"+document.head.querySelectorAll('title')[0].textContent
                        }
                    });
                }
                let div_hint=div_c_disable[n].querySelectorAll('div.hint');
                div_hint.forEach((div_fe_hint,i) =>{
                    if(div_fe_hint.textContent.search("原作者")!=-1){//自刪的樓
                        let uid=div_fe_hint.textContent.slice(9).split(")")[0];
                        create_img(fn_avatar_userpic(uid)[1],uid,["img_middle"],!isAppendChild,div_fe_hint.parentNode,div_fe_hint);
                        let a_tmp=create_a("舊版搜尋","https://forum.gamer.com.tw/Bo.php?bsn="+url[1].get('bsn')+"&qt=6&q="+uid,["float_right","user_a_panel_12px","user_a_panel_alpha"],isAppendChild,div_c_disable[n]);
                        create_a("\uF002 搜發表","https://forum.gamer.com.tw/search.php?bsn="+url[1].get('bsn')+"&q="+uid+"&author="+uid+"&sortType=mtime&firstFloorOnly=0&advancedSearch=1",["float_right","user_a_panel_12px","user_a_panel_alpha"],true,div_c_disable[n]);
                        a_tmp=create_a("看他的文","https://forum.gamer.com.tw/C.php?bsn="+url[1].get('bsn')+"&snA="+url[1].get('snA')+"&s_author="+uid+"&last=1#down",["float_right","user_a_panel_12px","user_a_panel_alpha"],isAppendChild,div_c_disable[n]);
                        a_tmp.title="只看他在此串發的文";
                    }else if(div_fe_hint.textContent.search("勇者已被你黑名單")!=-1){//黑名單折疊樓
                        let str_co_id=div_c_disable[n].parentNode.id.replaceAll(/disable_/ig, "post_");
                        let section_disable=document.querySelectorAll('#'+str_co_id);
                        section_disable.forEach((section_fe_disable,i) =>{
                            let uid=section_fe_disable.querySelectorAll('a.userid')[0].textContent;
                            let str_username=section_fe_disable.querySelectorAll('a.username')[0].textContent;
                            div_fe_hint.textContent=div_fe_hint.textContent.replaceAll("勇者","勇者"+uid+"("+str_username+")");
                        });
                    }
                });
            }
            //window.setTimeout(( () => fn_setTimeout_c_co_3000() ), 3000);
            window.setTimeout(( () => fn_setTimeout_c_co_12000() ), 12000);
            let div_tag_category=document.querySelectorAll('div.tag-category');
            div_tag_category.forEach((fe_tag_category,i) =>{//子版名稱
                if(fe_tag_category.innerText==""){
                    fe_tag_category.innerText="";
                    let a_subbsn=create_a("","",["sans"],isAppendChild,fe_tag_category);
                    create_node_text("div","此討論串已被刪除",["tag-category_item"],isAppendChild,a_subbsn);
                }
                let div_toolbar=document.querySelectorAll('.c-menu__scrolldown>div.toolbar');
                if(div_toolbar.length==1)div_toolbar[0].appendChild(fe_tag_category.cloneNode(true));
            });
            let div_c_post__body__signature=document.querySelectorAll('div.c-post__body__signature');//簽名
            div_c_post__body__signature.forEach((fe_c_post__body__signature,i) =>{
                let iframe_sign=fe_c_post__body__signature.querySelectorAll('iframe');
                create_node("hr",[],isAppendChild,fe_c_post__body__signature);
                let str_sign_idx=iframe_sign[0].src.match(/\d\.html/g)[0];
                let int_sign_idx=parseInt(str_sign_idx[0]);
                for(let i=1;i<10;i++){
                    create_a(i,iframe_sign[0].src.replaceAll(str_sign_idx,""+i+".html"),[i==int_sign_idx?"span_title":"span_icon","mono"],isAppendChild,fe_c_post__body__signature);
                }
            });
            if(url[0].pathname.search(new RegExp("/C.php", "i"))==strIsFoundFirst){//🛄哈啦區的snA串
                let ary_bsn_snA=[["60076","6920535"],["60076","7933364"]];//格式為[["哈啦區編號bsn","文編號snA"],["哈啦區編號bsn","文編號snA"],["哈啦區編號bsn","文編號snA"]]
                for(let n=0;n<ary_bsn_snA.length;n++){
                    if(url[1].get('bsn')==ary_bsn_snA[n][0]&&url[1].get('snA')==ary_bsn_snA[n][1]){//確認此串的推特嵌入過多所以要移除所有嵌入
                        let bquote_twitter_tweet=document.querySelectorAll("blockquote.twitter-tweet");console.log("%cl"+bquote_twitter_tweet.length,css__mono_std);
                        let ary_delete=Array.from(bquote_twitter_tweet);
                        for(let i=0;i<bquote_twitter_tweet.length;i++){
                            bquote_twitter_tweet[i].parentNode.appendChild(bquote_twitter_tweet[i].firstChild);
                            bquote_twitter_tweet[i].parentNode.classList.add("mono");
                        }
                        for(let i=0;i<ary_delete.length;i++){ary_delete[i].remove();}
                        break;
                    }
                }
            }
        }else if(url[0].pathname.search(new RegExp("/B.php", "i"))==0){//🛄哈啦區文章列表
            let div_card__body=Array.from(document.querySelectorAll('div.card__body'));//本板推薦顯示uid
            div_card__body.forEach((fe_card__body,i) =>{
                let div_card__text_author=fe_card__body.querySelectorAll('div.card__text-author')[0];
                let uid=fe_card__body.querySelectorAll('a.card__text-author-a')[0].href.replace(/https:\/\/home.gamer.com.tw\//i, "");
                let str_username=div_card__text_author.textContent;
                div_card__text_author.textContent="";
                create_node_text("span",str_username,[],true,div_card__text_author);
                create_node_text("span","("+uid+")",["code"],true,div_card__text_author);
            });
            let meta_thumbnail=document.head.querySelectorAll('meta[property="og:image"]');//顯示進板圖
            meta_thumbnail.forEach((fe_thumbnail,i) =>{
                let div_BH_slave__div=document.querySelectorAll('#BH-slave>div')[0];
                create_img(fe_thumbnail.content,"thumbnail",["max_width_100"],!isAppendChild,div_BH_slave__div.parentNode,div_BH_slave__div);
            });
            if(url[1].get('bsn')=="60147"){//大數據查看今日訪客一覽
                let list=document.querySelectorAll('tr.b-list__row');
                for(let n=0; n<list.length; n++){
                    if(list[n].querySelectorAll('td').length<2||list[n].querySelectorAll('div.b-list__tile>a').length>0)continue;//排除廣告、置頂
                    let title=list[n].querySelectorAll('td>a.b-list__main__title,p.b-list__main__title')[0];//\uEAF3
                    let ary_str=title.innerText.split("→");
                    if(ary_str.length<2)continue;
                    if(!is_login&&title.innerText.search("永久禁貼")==strIsNotFound&&title.innerText.search("未進板")==strIsNotFound&&title.innerText.search("凍結帳號")==strIsNotFound){
                        let a__summary=list[n].querySelectorAll('p.b-list__summary__sort>a')[0];
                        a__summary.href="https://home.gamer.com.tw/friendMore.php?owner="+ary_str[1];
                        a__summary.classList.add("outline");
                    }
                }
            }
            window.setTimeout(( () => fn_setTimeout_b_3000() ), 3000);
        }else if(url[0].pathname.search(new RegExp("/water.php", "i"))==0){//🛄水桶
            window.setTimeout(( () => fn_setTimeout_water() ), 1000);
            let water=document.querySelectorAll('div#BH-master>table tr');
            for(let n=0;n<water.length;n++){
                if(n==0)continue;
                let td=water[n].querySelectorAll('td');
                let uid=td[0].textContent;
                create_img(fn_avatar_userpic(uid)[1],uid,[],!isAppendChild,td[2]);
                uid=td[4].textContent;create_img(fn_avatar_userpic(uid)[1],uid,[],!isAppendChild,td[3]);
            }
        }
        if(url[0].pathname.match(/B\.php/)||url[0].pathname.match(/C\.php/)||url[0].pathname.match(/Co\.php/)||url[0].pathname.match(/Bo\.php/)||url[0].pathname.match(/search\.php/)){
            console.log("%curl[0].pathname.match(/B\.php/)",css__mono_std);
        }
        let timeoutID_lzl=window.setInterval(( () => fn_setInterval_lzl() ), 5000);//留言
        window.setTimeout(( () => clearInterval(timeoutID_lzl) ),900000);
    }else if(url[0].host.search(new RegExp("home.gamer.com.tw", "i"))==strIsFoundFirst){//📻小屋和創作大廳
        GM_registerMenuCommand("bg 2021"+(baha_bg=="2021"?"✔️":""), () =>{
            GM_setValue('baha_bg',"2021");
            window.location.reload();
        });
        GM_registerMenuCommand("bg 2022"+(baha_bg=="2022"?"✔️":""), () =>{
            GM_setValue('baha_bg',"2022");
            window.location.reload();
        });
        GM_registerMenuCommand("bg 2023"+(baha_bg=="2023"?"✔️":""), () =>{
            GM_setValue('baha_bg',"2023");
            window.location.reload();
        });
        if(url[0].pathname.search(new RegExp("/homeindex.php", "i"))==strIsFoundFirst){//🛄舊版小屋
            if(url[1].get('owner')==uid_login||url[1].get('owner')==null){
                let p_BH_slave_btns=document.querySelectorAll('.BH-slave_btns');
                p_BH_slave_btns.forEach((fe_BH_slave_btns,i) =>{
                    let a_article_manage_forum=create_a("哈啦區文章作品管理","https://home.gamer.com.tw/creation/article_manage_forum.php",["BH-slave_btnA","sans"],isAppendChild,fe_BH_slave_btns);
                    a_article_manage_forum.title="只包含專版";
                });
            }
            if(url[1].get('owner')!=null){
                fn_XMLHttpRequest("https://home.gamer.com.tw/friendMore.php?owner="+url[1].get('owner'),fn_re_friendMore);
            }
        }else if(url[0].pathname.search(new RegExp("/artwork.php", "i"))==strIsFoundFirst){//🛄小屋創作
            let node_articlecontent=document.querySelectorAll('div#article_content *');
            node_articlecontent.forEach((fe_articlecontent,i) =>{
                if(fe_articlecontent.children.length==0){
                    fe_articlecontent.textContent.replaceAll("\u200B","\u{1F1F4}\u{1F1E7}").replaceAll("\u200C","\u{1F1F4}\u{1F1E8}").replaceAll("\u200D","\u{1F1F4}\u{1F1E9}")
                    fe_articlecontent.textContent.replaceAll("\u200E","\u{1F1F4}\u{1F1EA}").replaceAll("\u200F","\u{1F1F4}\u{1F1EB}").replaceAll("\uFEFF","\u{1F1EB}\u{1F1EB}")
                }
            });
        }else if(url[0].pathname.search(new RegExp("/bookmark.php", "i"))==strIsFoundFirst){//🛄收藏文章
            let tr_BH_table=document.querySelectorAll('table.BH-table>tbody>tr');
            let int_bsn,int_sn,int_default=60076;
            let ary_user_tag_bookmark=[];//let ary_user_tag_bookmark=[];//格式為["用戶uid",[哈啦區編號bsn,文編號sn],[省略到只有文編號sn],[哈啦區編號bsn,文編號sn]],["用戶uid",[省略到只有文編號sn]],["用戶uid",[省略到只有文編號sn]]]
            for(let n=3; n<tr_BH_table.length; n++){
                let a_bookmark=tr_BH_table[n].querySelectorAll('td>a');
                let a_href=decodeURIComponent(a_bookmark[0].href.replaceAll("https://ref.gamer.com.tw/redir.php?url=",""));
                for(let i=0; i<ary_user_tag_bookmark.length; i++){//標記陣列
                    for(let j=1; j<ary_user_tag_bookmark[i].length; j++){//bsn&sn
                        if(ary_user_tag_bookmark[i][j].length==1){
                            int_bsn=int_default;int_sn=ary_user_tag_bookmark[i][j][0];//[sn]
                        }else{int_bsn=ary_user_tag_bookmark[i][j][0];int_sn=ary_user_tag_bookmark[i][j][1];}//[bsn,sn]
                        let str_search="bsn="+int_bsn+"&sn="+int_sn;
                        if(a_href.search(str_search)!=strIsNotFound){
                            a_bookmark[1].textContent=ary_user_tag_bookmark[i][0];
                        }
                    }
                }
            }
        }else if(url[0].pathname.search(new RegExp("/indexWallpaperList.php", "i"))==strIsFoundFirst){//🛄舊版小屋佈景主題清單
            let ul_BH_menuE=document.querySelectorAll('ul.BH-menuE');
            ul_BH_menuE.forEach((fe_menuE,i) =>{
                let li_output=create_node_text("li","",[],isAppendChild,fe_menuE);
                let a_scenery_main=create_a("新版佈景大廳","/profile/scenery_main.php",["sans"],isAppendChild,li_output);
                a_scenery_main.title="舊版小屋用戶需要開其他瀏覽器不登入才能預覽";
            });
            fn_setInterval_homeCssUsedMore();
            let timeoutID = window.setInterval(( () =>{fn_setInterval_homeCssUsedMore();}), 30000);//嘗試兼容自動換頁工具
        }else if(url[0].pathname.search(new RegExp("/homeWallpaperPreview.php", "i"))==strIsFoundFirst){//🛄佈景預覽
            let get_wsn=url[1].get('wsn');
            create_a("新版小屋預覽","https://home.gamer.com.tw/profile/wallpaper_old_view.php?wsn="+get_wsn,["user_a_panel_12px","sans"],isAppendChild,document.body.querySelectorAll('div.top>p')[0]);
            create_a("舊版主要頁面","https://home.gamer.com.tw/homeCssSampleA.php?wsn="+get_wsn+"&from=upload",["user_a_panel_12px","sans"],isAppendChild,document.body.querySelectorAll('div.top>p')[0]);
            create_a("舊版次要頁面","https://home.gamer.com.tw/homeCssSampleB.php?wsn="+get_wsn+"&from=upload",["user_a_panel_12px","sans"],isAppendChild,document.body.querySelectorAll('div.top>p')[0]);
        }else if(url[0].pathname.search(new RegExp("/profile/scenery_main.php", "i"))==strIsFoundFirst){//🛄佈景大廳
            fn_setInterval_scenery_main();
            let timeoutID = window.setInterval(( () =>{fn_setInterval_scenery_main();}), 3000);
        }
        let div_frame=document.querySelectorAll('div.frame');
        div_frame.forEach((fe_frame,i) =>{//
            if(url[1].get('owner')!=null&&url[0].pathname.search(new RegExp("/bookmarkMsg.php", "i"))==strIsNotFound){
                let uid=url[1].get('owner');
                create_node_text("h3","訪問永A用戶其他可用頁面",["code"],isAppendChild,fe_frame);
                let ol=create_node("ol",["sans","fontawesome_4_3_0_star_wars"],isAppendChild,fe_frame);
                let li_showdress=create_node("li",[],isAppendChild,ol);
                create_a("勇者裝備一覽","https://avatar1.gamer.com.tw/showdress.php?uid="+uid,["sans"],isAppendChild,li_showdress);
                let li_friendList=create_node("li",[],isAppendChild,ol);
                create_a("好友頁面","https://home.gamer.com.tw/friendList.php?user="+uid+"&t=1",["sans"],isAppendChild,li_friendList);
                let li_friendMore=create_node("li",[],isAppendChild,ol);
                create_a("今日訪客一覽（然而不會顯示訪客）","https://home.gamer.com.tw/friendMore.php?owner="+uid,["sans"],isAppendChild,li_friendMore);
                let li_joinGuild=create_node("li",[],isAppendChild,ol);
                create_a("參加的公會社團","https://home.gamer.com.tw/joinGuild.php?owner="+uid,["sans"],isAppendChild,li_joinGuild);
                let li_acgbox=create_node("li",[],isAppendChild,ol);
                create_a("追蹤作品/遊戲動漫櫃","https://home.gamer.com.tw/acgbox.php?owner="+uid,["sans"],isAppendChild,li_acgbox);
                let li_block_list=create_node("li",[],isAppendChild,ol);
                create_a("API block_list.php","https://api.gamer.com.tw/home/v1/block_list.php?userid="+uid,["code"],isAppendChild,li_block_list);
                let li_userpic=create_node("li",[],isAppendChild,ol);
                create_img(fn_avatar_userpic(uid)[0],uid,["img_middle"],!isAppendChild,li_userpic);
                create_link_stylesheet("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css","gm_fontawesome_4_3_0",isAppendChild,document.head);
            }
        });
    }else if(url[0].host.search(new RegExp("avatar1.gamer.com.tw", "i"))==strIsFoundFirst){//📻勇造
    }else if(url[0].host.search(new RegExp("www.gamer.com.tw", "i"))==strIsFoundFirst){//📻首頁
        if(url[0].pathname.search(new RegExp("/missing.html", "i"))==strIsFoundFirst){//🛄找不到網頁，此頁面拿來做測試功能
            let div_gm=create_node_text("div","",[],isAppendChild,document.body);
            let div_box_gray=document.querySelectorAll('div.box_gray')[0];
            div_box_gray.classList.add("font_for_white");
            style_user_css.textContent+=`html{background-image: repeating-linear-gradient(-45deg,#13AEAB 0px 10px,#117E96 10px 20px);}\ndiv.box_gray{background-color: unset;}
textarea{min-width: 25%;max-width: 95%;min-height: 50vh;font-size: 100%;}.output{word-break: break-word;white-space: pre-wrap;/*font-variant-emoji: emoji;*/}`;
            let div_truth_img=create_node("div",[],isAppendChild,div_gm);
            let input_img_baha_file_name=create_node_text("input","",["mono","hash64"],isAppendChild,div_truth_img);
            let input_start_img_date=create_node_text("input","",["mono"],isAppendChild,div_truth_img);
            let input_end_img_date=create_node_text("input","",["mono"],isAppendChild,div_truth_img);
            let input_bsn=create_node_text("input","",["mono"],isAppendChild,div_truth_img);
            input_bsn.placeholder="bsn=60076";
            let btn_img=create_btn("產生圖片",["mono"],isAppendChild,div_truth_img);
            let p_output_img=create_node("p",[],isAppendChild,div_truth_img);
            btn_img.addEventListener('click',() =>{
                let int_start_year=parseInt(input_start_img_date.value.slice(0,4),10);
                let int_start_mouth=parseInt(input_start_img_date.value.slice(4,6),10);
                let int_end_year=parseInt(input_end_img_date.value.slice(0,4),10);
                let int_end_mouth=parseInt(input_end_img_date.value.slice(4,6),10);
                let str_img_baha_file_name=input_img_baha_file_name.value.replaceAll(".jpg",".JPG").replaceAll(".png",".PNG").replaceAll(".gif",".GIF").replaceAll(".webp",".WEBP");
                for(let i=int_start_year;i<=int_end_year;i++){
                    let j;
                    for(j=int_start_mouth;j<=12;j++){
                        if(i==int_end_year&&j>int_end_mouth)break;
                        let str_img_date=i.toString()+j.toString().padStart(2,"0");
                        if(input_bsn.value==""){
                            create_img("https://truth.bahamut.com.tw/s01/"+str_img_date+"/"+str_img_baha_file_name,str_img_date,["maxvh"],isAppendChild,p_output_img);
                        }else{
                            create_img("https://truth.bahamut.com.tw/s01/"+str_img_date+"/forum/"+input_bsn.value+"/"+str_img_baha_file_name,str_img_date,["maxvh"],isAppendChild,p_output_img);
                        }
                    }
                    if(i==int_end_year&&j>int_end_mouth)break;
                }
            });
            let div_str_sort=create_node("div",[],isAppendChild,div_gm);
            let txa_str_d=create_node("textarea",["mono"],isAppendChild,div_str_sort);
            let btn_str_sort=create_btn("str_sort",["mono"],isAppendChild,div_str_sort);
            let p_output_sort=create_node("p",["mono","output","font_for_black"],isAppendChild,div_str_sort);
            btn_str_sort.addEventListener('click',() =>{
                // 1️⃣ 先拆分成行並去除空白行
                const lines = txa_str_d.value.trim().split('\n').map(line => line.trim()).filter(Boolean);
                const countMap = {};// 2️⃣ 統計每個詞的出現次數
                for (const line of lines) {
                    countMap[line] = (countMap[line] || 0) + 1;
                }
                const sorted = Object.entries(countMap).sort((a, b) => b[1] - a[1]);// 3️⃣ 轉為可排序的陣列// 由多到少排序
                p_output_sort.textContent="=== 排序結果 ===\n";// 4️⃣ 輸出結果
                let str_tmp="";
                for (const [word, count] of sorted) {
                    str_tmp+=`${word}（${count}次）\n`;
                }
                p_output_sort.textContent=str_tmp;
            });
        }
    }else if(url[0].host.search(new RegExp("im.bahamut.com.tw", "i"))==strIsFoundFirst){//📻巴哈貼圖
        /*if(url[0].pathname.search(new RegExp("%2F", "i"))!=strIsNotFound){
            window.location.replace("https://"+url[0].host+decodeURIComponent(url[0].pathname));//跳轉有%2F的圖片
        }//*/
    }else if(url[0].host.search(new RegExp("haha.gamer.com.tw", "i"))==strIsFoundFirst){//📻哈哈姆特
        /*document.body.addEventListener("mouseup", (event) =>{//貼圖頁面已被移動，無效
            window.setTimeout(( () =>{
                url=fn_url(document.location);
                if(document.body.querySelectorAll("div.card-content.click").length>0){console.log("%creturn",css__mono_std);return;}
                let div_card_content=document.body.querySelectorAll("div.card-content");
                div_card_content.forEach((fe_card_content,x) =>{//複製所有貼圖鏈接並轉成bbcode
                    fe_card_content.classList.add("click");
                    let get_sticker_shop_detail=url[1].get('sticker_shop_detail');
                    let str_bbcode="[img]https://im.bahamut.com.tw/sticker/"+get_sticker_shop_detail+"/sticker_"+get_sticker_shop_detail+".png[/img]";
                    let img_sticker_img=fe_card_content.querySelectorAll(".sticker-img>img");
                    img_sticker_img.forEach((fe_sticker_img,i) =>{
                        str_bbcode+="[img]"+decodeURIComponent(fe_sticker_img.src).replaceAll("\\?alt=media","")+"[/img]";
                    });
                    let btn_copy=create_btn("\uE14Dcopy bbcode",["btn--sm","btn--normal","user_btn","sans_condensed","cursor_copy"],!isAppendChild,fe_card_content.parentNode,fe_card_content);
                    btn_copy.addEventListener('click',() =>{
                        GM_setClipboard(str_bbcode, "text");
                    });
                });
            }),1000);
        });//*/
    }else if(url[0].host.search(new RegExp("web.archive.org", "i"))==strIsFoundFirst){//📻快照字體
        style_user_css.textContent+=`body,textarea,.c-section{`+font_family_txt+`}
font[face=\"Courier New\"]{`+font_family_code+`}
font[face="微軟正黑體"]{`+font_family_txt+`}\nfont[face="新細明體"],font[face="細明體"]{`+font_family_serif_zh+`}
font[face="MS Mincho"]{`+font_family_serif_2+`}\nfont[face="標楷體"]{`+font_family_mono_kaishotai+`}`;
    }
    if(url[0].host.search(new RegExp("truth.bahamut.com.tw", "i"))==strIsFoundFirst){//📻哈啦區圖片
        let ary_str=url[0].pathname.split('/');
        let offset=3;
        if(ary_str[3]=="forum"){offset=5;}
        let new_str=String.fromCodePoint("0x"+ary_str[offset].slice(0,4),"0x"+ary_str[offset].slice(4,8),"0x"+ary_str[offset].slice(8,12),"0x"+ary_str[offset].slice(12,16),"0x"+ary_str[offset].slice(16,20),"0x"+ary_str[offset].slice(20,24),"0x"+ary_str[offset].slice(24,28),"0x"+ary_str[offset].slice(28,32));
        console.log("%c"+new_str,css__kaishotai+css_font_size_72px);
        GM_registerMenuCommand("copy: "+ary_str[2]+new_str, () =>{
            GM_setClipboard(ary_str[2]+new_str,"text");
        });
    }
    if(document.querySelectorAll('div.frame').length==1){fn_create_css_animation_bg();}//css背景
    switch(url[0].host){
        case "gnn.gamer.com.tw":
        case "avatar1.gamer.com.tw":
            if(url[0].pathname=="/showdress.php")break;//舊版勇者小屋勇者裝備一覽
        case "guild.gamer.com.tw":
        case "mailbox.gamer.com.tw":
            fn_create_css_animation_bg();
    }
    switch(url[0].host+url[0].pathname){
        case "home.gamer.com.tw/":
        case "home.gamer.com.tw/index.php":
        case "home.gamer.com.tw/indexWallpaperList.php":
        case "home.gamer.com.tw/artwork_edit.php":
        case "home.gamer.com.tw/artwork.php":
        case "forum.gamer.com.tw/A.php":
        case "forum.gamer.com.tw/Bo.php":
        case "forum.gamer.com.tw/G1.php":
            fn_create_css_animation_bg();
    }
    style_user_css.textContent+=`
.time2023:after{
    content: url('https://i2.bahamut.com.tw/index/2023-Newyear-time.png');
    display: inline-block;
    position: fixed;
    top: 10%;
    left: 5%;
    z-index: 256;
    -webkit-animation: witch_2023 4s infinite;
    animation-timing-function: ease-out;
}
@-webkit-keyframes witch_2023 {
  0%{
    content: url('https://i2.bahamut.com.tw/index/2023-Newyear-time.png');opacity: 0.8;
  }10% {
    content: url('https://i2.bahamut.com.tw/index/2023-Newyear-time.png');opacity: 0.8;
  }50% {
    content: url('https://i2.bahamut.com.tw/index/2023-Newyear-time_2.png');opacity: 0.8;
  }75%{
      content: url('https://i2.bahamut.com.tw/index/2023-Newyear-time_3.png');opacity: 0.9;
  }100%{
    content: url('https://i2.bahamut.com.tw/index/2023-Newyear-time_3.png');opacity: 0.9;
  }
}
.time2022:after{
    content: url('https://i2.bahamut.com.tw/index/2022-Newyear-time.png');
    display: inline-block;
    position: fixed;
    top: 10%;
    left: 85%;
    z-index: 256;
    -webkit-animation: witch_2022 4s infinite;
    animation-timing-function: ease-out;
}
@-webkit-keyframes witch_2022 {
  0%{
    content: url('https://i2.bahamut.com.tw/index/2022-Newyear-time.png');opacity: 0.8;
  }10% {
    content: url('https://i2.bahamut.com.tw/index/2022-Newyear-time.png');opacity: 0.8;
  }50% {
    content: url('https://i2.bahamut.com.tw/index/2022-Newyear-time_2.png');opacity: 0.8;
  }75%{
      content: url('https://i2.bahamut.com.tw/index/2022-Newyear-time_3.png');opacity: 0.9;
  }100%{
    content: url('https://i2.bahamut.com.tw/index/2022-Newyear-time_3.png');opacity: 0.9;
  }
}
.firework2024_l:after{
  content: "";
  position: fixed;
  left: 0%;
  bottom: 20%;
  background-image: url('https://i2.bahamut.com.tw/index/2024-NewYear-fireworks-l.svg') !important;
  background-size: cover;
  background: no-repeat;
  width: 300px;
  height: 541px;
  z-index: 255;
}

.firework2024_r:after{
  content: "";
  position: fixed;
  left: 85%;
  bottom: 20%;
  background-image: url('https://i2.bahamut.com.tw/index/2024-NewYear-fireworks-r.svg') !important;
  background-size: cover;
  background: no-repeat;
  width: 300px;
  height: 421px;
  z-index: 255;
}
.firework2023::after{
    content: "";
    display: block;
    position: fixed;
    left: 85%;
    bottom: 10%;
    width: 220px;
    height: 300px;
    background-image: url('https://i2.bahamut.com.tw/index/2023-firework.png');
    animation: play_firework2023 4s steps(10) infinite;
    z-index: 255;
    opacity: .8;
}
@keyframes play_firework2023 {
  0%   { background-position:    0px; }
  50%  { background-position: -2200px; }
  100% { background-position: -2200px; }
}
.firework2021::after{
  content: "";
  display: block;
  position: fixed;
  left: 0%;
  bottom: 0%;
  width: 110px;
  height: 150px;
  background-image: url('https://i2.bahamut.com.tw/index/2021-firework.png');
  animation: play_firework2019 3s steps(10) infinite;
  z-index: 255;
}
.firework2020::after{
  content: '';
  position: fixed;
  left: 0;
  bottom: 15%;
  width: 110px;
  height: 151px;
  background-image: url('https://i2.bahamut.com.tw/index/festival2020-fw1.png');
  animation: play_firework2019 3s steps(10) infinite;
  z-index: 255;
}
.BA_year_fw_2019{
  position: fixed;
  left: 10%;
  bottom: 0%;
  width: 110px;
  height: 151px;
  background-image: url("data:image/png;base64,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");
  animation: play_firework2019 2.5s steps(10) infinite;
  z-index: 255;
}
@keyframes play_firework2019{
  0%   { background-position:    0px; }
  50%  { background-position: -1100px; }
  100% { background-position: -1100px; }
}
.festival_2018_fw1::after{
  content: "";
  position: fixed;
  left: 1%;
  bottom: 66%;
  height: 150px;
  width: 107px;
  background: url('https://i2.bahamut.com.tw/index/festival-2018-fw1.png');
  animation: play3 3s steps(10) infinite;
  overflow: hidden;
  z-index: 255;
}
.festival_2018_fw2::after{
  content: "";
  position: fixed;
  left: 1%;
  bottom: 50%;
  height: 150px;
  width: 107px;
  background: url('https://i2.bahamut.com.tw/index/festival-2018-fw2.png');
  animation: play2 3s steps(10) infinite;
  overflow: hidden;
  z-index: 255;
}
.festival_2018_fw3::before{
  content: "";
  position: fixed;
  left: 1%;
  bottom: 33%;
  height: 150px;
  width: 107px;
  background: url('https://i2.bahamut.com.tw/index/festival-2018-fw3.png');
  animation: play 3s steps(10) infinite;
  overflow: hidden;
}
@keyframes play {
   0%   { background-position:    0px; }
   50%  { background-position: -1100px; }
   100% { background-position: -1100px; }
}@keyframes play2 {
   0%   { background-position:    0px; }
   20%  { background-position:    0px; }
   70%  { background-position: -1100px; }
   100% { background-position: -1100px; }
}@keyframes play3 {
   0%   { background-position:    0px; }
   40%  { background-position:    0px; }
   90%  { background-position: -1100px; }
   100% { background-position: -1100px; }
}/*https://i2.bahamut.com.tw/index/2024-NewYear-bg.jpg https://i2.bahamut.com.tw/index/2024-NewYear-text.svg*/
.building_2024{
  content: "";
  background: url('https://i2.bahamut.com.tw/index/2024-NewYear-btm.png') no-repeat bottom;
  background-size: contain;
  background-attachment: fixed;
  background-position-x: left;
  background-position-y: bottom;
  opacity: .8;
}
.building_2023{
    content: "";
    background: url(https://i2.bahamut.com.tw/index/2023-NewYear-background-building-off.png) center no-repeat, url(https://i2.bahamut.com.tw/index/2023-NewYear-background.jpg) center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed,fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
    animation: building_2023 3s infinite;
}
@keyframes building_2023 {
  0% {
    background: url(https://i2.bahamut.com.tw/index/2023-NewYear-background-building-off.png) center no-repeat, url(https://i2.bahamut.com.tw/index/2023-NewYear-background.jpg) center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }
  50% {
    background: url(https://i2.bahamut.com.tw/index/2023-NewYear-background-building-on.png) center no-repeat, url(https://i2.bahamut.com.tw/index/2023-NewYear-background.jpg) center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }
  100% {
    background: url(https://i2.bahamut.com.tw/index/2023-NewYear-background-building-off.png) center no-repeat, url(https://i2.bahamut.com.tw/index/2023-NewYear-background.jpg) center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }
}
.building_2022{
    content: "";
    background: url(https://i2.bahamut.com.tw/index/2022-NewYear-background-building-off.png) center no-repeat, url(https://i2.bahamut.com.tw/index/2022-NewYear-background.jpg) center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed,fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
    animation: building_2022 3s infinite;
}
@keyframes building_2022 {
  0% {
    background: url(https://i2.bahamut.com.tw/index/2022-NewYear-background-building-off.png) center no-repeat, url(https://i2.bahamut.com.tw/index/2022-NewYear-background.jpg) center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }
  50% {
    background: url(https://i2.bahamut.com.tw/index/2022-NewYear-background-building-on.png) center no-repeat, url(https://i2.bahamut.com.tw/index/2022-NewYear-background.jpg) center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }
  100% {
    background: url(https://i2.bahamut.com.tw/index/2022-NewYear-background-building-off.png) center no-repeat, url(https://i2.bahamut.com.tw/index/2022-NewYear-background.jpg) center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }
}
.building_2021{
    content: "";
    background: url('https://i2.bahamut.com.tw/index/2021-NewYear-background-building-off.png') center no-repeat, url('https://i2.bahamut.com.tw/index/2021-NewYear-background.jpg') center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed,fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
    animation: building_2021 3s infinite;
}
@keyframes building_2021{
  0% {
    background: url('https://i2.bahamut.com.tw/index/2021-NewYear-background-building-off.png') center no-repeat, url('https://i2.bahamut.com.tw/index/2021-NewYear-background.jpg') center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }50% {
    background: url('https://i2.bahamut.com.tw/index/2021-NewYear-background-building-on.png') center no-repeat, url('https://i2.bahamut.com.tw/index/2021-NewYear-background.jpg') center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }100% {
    background: url('https://i2.bahamut.com.tw/index/2021-NewYear-background-building-off.png') center no-repeat, url('https://i2.bahamut.com.tw/index/2021-NewYear-background.jpg') center no-repeat;
    background-size: contain, cover;
    background-attachment: fixed;
    background-position-x: left, 50%;
    background-position-y: bottom, 100%;
  }
}
@font-face{font-family: 'emoji_patch';src: local('Unicode BMP Fallback SIL');unicode-range: U+200B-200F,U+FEFF;}/*not work*/`;
    //end
})();