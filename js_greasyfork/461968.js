// ==UserScript==
// @name         巴哈 - 哈啦區搜作者不翻頁
// @description  Append the next page content to the bottom seamlessly
// @namespace    baha_Bo_70af4
// @author       Covenant
// @version      1.0.7
// @license      MIT
// @homepage
// @match        https://forum.gamer.com.tw/Bo.php*
// @match        https://forum.gamer.com.tw/search.php?*
// @match        https://forum.gamer.com.tw/C.php?*
// @match        https://forum.gamer.com.tw/Co.php?*
// @match        https://forum.gamer.com.tw/B.php*
// @match        https://forum.gamer.com.tw/water.php*
// @icon         https://i2.bahamut.com.tw/icon/share-icon_bh.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/461968/%E5%B7%B4%E5%93%88%20-%20%E5%93%88%E5%95%A6%E5%8D%80%E6%90%9C%E4%BD%9C%E8%80%85%E4%B8%8D%E7%BF%BB%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/461968/%E5%B7%B4%E5%93%88%20-%20%E5%93%88%E5%95%A6%E5%8D%80%E6%90%9C%E4%BD%9C%E8%80%85%E4%B8%8D%E7%BF%BB%E9%A0%81.meta.js
// ==/UserScript==
var output_state=document.querySelectorAll('ul.BH-menuE>li>a')[3];
var div_content;
function create_style(textContent,id,class_name){let style=create_style_iframes(textContent,id,class_name,document.body);return style;}
var style_user_css=create_style("","gm_user_css_baha_Bo_70af4",["user_gm_css","css_baha_Bo_70af4"]);
style_user_css.textContent+=`.float_left{float: left;}\n.float_right{float: right;}
\n`;
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
function fn_re_page(response){
    let dom=document.createRange().createContextualFragment(response.responseText);
    let BH_rbox_p=document.querySelectorAll('div.BH-rbox>p.p_Bo')[0];
    if(BH_rbox_p.length==0){console.log("%c錯誤：BH_rbox_p");return;}
    create_node('br',[],true,BH_rbox_p);
    fn_output_text(BH_rbox_p,"Bo: "+new Date().toLocaleString(),true);
    if(response.status==200){//這裡全部每次都要按照各種目標網頁格式重寫
        let div_BH_master=dom.querySelectorAll('div#BH-master');
        let div_footer=document.querySelectorAll('div#BH-footer')[0];
        div_content.insertBefore(div_BH_master[0].cloneNode(true),div_footer);
        //end
        fn_output_text(output_state,"delay",false);
    }else{//429
        fn_output_text(output_state,response.status,false);
        console.log("response.status: "+response.status+response.responseHeaders);
    }
    delete dom;
}
(function() {
    'use strict';
    let url=fn_url(document.location);
    let BH_top_data=document.querySelectorAll('div#BH-top-data')[0];
    let nav_member_imgbox=document.querySelectorAll('div.nav-member_imgbox');
    let is_login=nav_member_imgbox.length==1?true:false;
    let ary_tmp=fn_url(nav_member_imgbox[0].querySelectorAll('img')[0].src)[0].pathname.split('/');
    let userid_login=is_login?ary_tmp.pop().replace(/_s.png/i, ""):null;
    if(url[0].pathname.search(new RegExp("/Bo.php", "i"))==0){//🛄舊版搜索頁面
        create_node_text("p","",["p_Bo","code"],true,document.querySelectorAll('div.BH-rbox')[0]);
        let ary_tmp=document.querySelectorAll('div#BH-master');
        let BH_slave=document.querySelectorAll('div#BH-slave')[0];
        let page=document.querySelectorAll('p.BH-pagebtnA');
        let tmp=true;
        if(ary_tmp.length>0&&page.length>0){
            div_content=ary_tmp[0].parentNode;
            let ary_page=page[0].querySelectorAll('a');
            let page_len=parseInt(ary_page[ary_page.length-1].innerText,10);
            if(ary_page.length>0&&url[1].get('page')==null){
                GM_registerMenuCommand('load all page', () => {
                    for(let i=2; i<=page_len; i++){
                        let delay=i*1000*1.5+Math.floor(i/5)*1000*5+Math.floor(i/10)*1000*30+Math.floor(i/30)*1000*60;
                        window.setTimeout(( () => {fn_output_text(output_state,"loading",false);fn_XMLHttpRequest("https://"+url[0].host+url[0].pathname+url[0].search+"&page="+i,fn_re_page);} ), delay);
                    }
                });
            }
            GM_registerMenuCommand('load 10 page', () => {
                let pagenow=parseInt(page[0].querySelectorAll('a.pagenow')[0].innerText);
                for(let i=pagenow+1; i<=page_len; i++){
                    let x=i-pagenow;
                    if(x==10)break;
                    let delay=x*1000*1.5+Math.floor(x/5)*1000*5+Math.floor(x/10)*1000*30+Math.floor(x/30)*1000*60;
                    window.setTimeout(( () => {fn_output_text(output_state,"loading",false);fn_XMLHttpRequest("https://"+url[0].host+url[0].pathname+url[0].search+"&page="+i,fn_re_page);} ), delay);
                }
            });
            GM_registerMenuCommand('load 20 page', () => {
                let pagenow=parseInt(page[0].querySelectorAll('a.pagenow')[0].innerText);
                for(let i=pagenow+1; i<=page_len; i++){
                    let x=i-pagenow;
                    if(x==20)break;
                    let delay=x*1000*1.5+Math.floor(x/5)*1000*5+Math.floor(x/10)*1000*30+Math.floor(x/30)*1000*60;
                    window.setTimeout(( () => {fn_output_text(output_state,"loading",false);fn_XMLHttpRequest("https://"+url[0].host+url[0].pathname+url[0].search+"&page="+i,fn_re_page);} ), delay);
                }
            });
            GM_registerMenuCommand('show/hiden(slow)', () => {
                let row=document.querySelectorAll('tr.b-list__row');
                for(let i=0; i<row.length; i++){
                    var title=row[i].querySelectorAll('p.b-list__main__title')[0].innerText;
                    if(title.search(new RegExp("RE:", "i"))==0){
                        if(tmp){
                            row[i].style.display="none";
                        }else{row[i].style.display="";}
                    }
                }
                tmp=!tmp;
            });
        }
        let btn_title=create_btn("顯示所有發文在右側","user_btn_panel",false,BH_slave.querySelectorAll('div.search-suggest')[0],BH_slave.querySelectorAll('div.search-suggest')[0].firstChild);
        let btn_pos_fixed=create_btn("position:fixed","user_btn_panel",false,BH_slave.querySelectorAll('div.search-suggest')[0],BH_slave.querySelectorAll('div.search-suggest')[0].firstChild);
        BH_slave.setAttribute('style', "overflow-y: scroll;max-height: 3000px;");
        btn_pos_fixed.addEventListener('click',(evt) => {
            console.log(evt);console.log(this);
            if(BH_slave.style.getPropertyValue("position")!="fixed"){
                BH_slave.style.setProperty("position", "fixed");
                BH_slave.style.setProperty("width", "60rem");
                BH_slave.style.setProperty("height", "80vh");
                BH_slave.style.setProperty("max-height", "95%");
                BH_slave.style.setProperty("min-height", "90%");
            }else{
                BH_slave.style.setProperty("position", "static");
                BH_slave.style.setProperty("width", "300px");
                BH_slave.style.setProperty("height", "3000px;");
                BH_slave.style.setProperty("min-height", "2800px");
            }
        });
        btn_title.addEventListener('click',(evt) => {
            let row=document.querySelectorAll('tr.b-list__row');
            let search_suggest=document.querySelectorAll('div.search-suggest')[0];
            for(let i=0; i<row.length; i++){
                let title=row[i].querySelectorAll('p.b-list__main__title')[0].innerText;
                if(title.search(new RegExp("RE:", "i"))!=0){
                    let clone=row[i].cloneNode(true);
                    search_suggest.appendChild(clone);
                }
            }
        });
    }else if(url[0].pathname.search(new RegExp("/search.php", "i"))==0){//🛄新版搜索頁面
        style_user_css.textContent+=".search-result_article{margin-bottom: 10px;}\n";
        let div_search_result_header=document.querySelectorAll('div.search-result_header')[0];
        let ul_search_nav=document.querySelectorAll('ul.search_nav')[0];
        let SearchTypeahead_input=document.querySelectorAll('input.SearchTypeahead-input')[0];
        let author=url[1].get('author');
        let btn_search=create_btn(author==null?"只搜標題":"搜特定關鍵詞","user_btn_panel",false,div_search_result_header,ul_search_nav);
        if(author!=null){
            btn_search.addEventListener('click',() => {
                if(SearchTypeahead_input.value!=author){
                    window.location.assign("https://forum.gamer.com.tw/search.php?bsn="+url[1].get('bsn')+"&q="+SearchTypeahead_input.value+"&author="+author+"&sortType=mtime&firstFloorOnly=0&advancedSearch=1");
                }
            });
        }else{
            btn_search.addEventListener('click',() => {
                window.location.assign("https://forum.gamer.com.tw/search.php?bsn="+url[1].get('bsn')+"&q="+SearchTypeahead_input.value+"&field=title&sortType=mtime&firstFloorOnly=0&advancedSearch=1");
            });
        }
    }
    if(url[1].get('bsn')!=null){//頂部搜索區
        let bsn=url[1].get('bsn');
        let btn_search_title=create_btn("舊版搜標題",["float_left","user_btn_panel_12px"],true,BH_top_data);
        if(url[1].get('qt')==null){
            btn_search_title.title="gsc-i-id1";
        }else{
            btn_search_title.title="old_search_input";
        }
        btn_search_title.addEventListener('click',() => {
            let gsc_i_id1;
            if(url[1].get('qt')==null){
                gsc_i_id1=document.querySelectorAll('input#gsc-i-id1')[0];
            }else{
                gsc_i_id1=document.querySelectorAll('input#old_search_input')[0];
            }
            window.location.assign("https://forum.gamer.com.tw/B.php?bsn="+bsn+"&qt=1&q="+(gsc_i_id1.value.length==1?"\\":"")+gsc_i_id1.value);
        });
        if(is_login){
            let btn_search_user=create_btn("\uF0C1 搜自己發表",["float_left","user_btn_panel_12px"],true,BH_top_data);
            btn_search_user.addEventListener('click',() => {
                let gsc_i_id1;
                if(url[1].get('qt')==null){
                    gsc_i_id1=document.querySelectorAll('input#gsc-i-id1')[0];
                }else{
                    gsc_i_id1=document.querySelectorAll('input#old_search_input')[0];
                }
                window.open("https://forum.gamer.com.tw/search.php?bsn="+bsn+"&q="+(gsc_i_id1.value==""?userid_login:gsc_i_id1.value)+"&author="+userid_login+"&sortType=mtime&firstFloorOnly=0&advancedSearch=1",'_blank');
            });
            create_a("舊版搜尋自己","https://forum.gamer.com.tw/Bo.php?bsn="+bsn+"&qt=6&q="+userid_login,["user_a_panel_12px"],true,BH_top_data);
        }
    }
})();