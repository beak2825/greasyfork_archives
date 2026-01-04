// ==UserScript==
// @name         顯示大秘寶
// @description  這不是我想要的
// @namespace    forum_trash
// @author       Covenant
// @version      1.0.0.2
// @license      MIT
// @homepage
// @match        https://forum.gamer.com.tw/B.php?bsn=*
// @exclude      https://forum.gamer.com.tw/B.php?bsn=*&subbsn=*
// @icon         data:image/x-icon;base64,AAABAAIAICAAAAEACACoCAAAJgAAABAQAAABAAgAaAUAAM4IAAAoAAAAIAAAAEAAAAABAAgAAAAAAIAEAAAAAAAAAAAAAAABAAAAAAAA////APb29gDw8PAA4+PjAN3d3ADMzMwAxsbGALu7uwCysrIAqqqqAKOjowCZmZkAiIiIAHh4dgBvb28AZmZmAFhYWABSUlEASkpKAEFBQQAzMzMAJycoAAUFBQAAAAAAAgH+AFpNLABwaT8AkIAtAK6aLwCzokkAoJZjAMGzZQDPxpYA49y3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcMDBMMBxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIERAIFxcXBBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBERFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQDxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXEBIIFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBASFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIEBAXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEAkXFxcXFxcXFxcEFxcXFxcXFxcXFxcXFxcXFxcXFxAQDBcXFxcXFxcXFwwXFxcXFxcXFxcXFxcXFxcXFxcXCA4QCBcXFxcXFwkOFxcXFxcXFxcXFxcXFxcXFxcXFxcXCA8SEAwXFwwODBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBISEw4MDwgXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFw4QFxcXFxcXFxcXFxcXChEREQoXFxcJCQ4OEhIRERMXFw4QEQkXFxcXFxcXFxcXFxcKEREREREREwkXCQkJERAQCgoREBcXFxcXFxcXFxcXFxcXChcKFwoXFxcXFxcJChERERERDBcMCRcMEhcXFxcXFxcXFxcXFxcXFxcRFxcXCQoRERERDBMSEhEcFxcXFxcXFxcXFxcXFxcXFwoRCRcXAwoREREREBocFxcXFxcXFxcXFxcXCRECFxcXChMTEREREBERHBERCRcXFxcXFxcXFxcXFxcXChEJCQkREREREREREREcAgsPCRIXFxcXFxcXFxcXFxcXChERERERERERERERExwXFwwSCRIXFxcXFxcXFxcXFxcNERERERERERERERERHBcKEgoSFxcXFxcXFxcXFxcXChEREREREREREREREREUERcXFxcXFxcXFxcXFxcXCg0NERERERERERERERERDQ0cCBIXFxcXFxcXFwoKDRERERERERERERERERENDQ0cHBwdIRcXFwoTEhEQERESEhINDQ0NDQ0NDQ0NDQ0cHBwdFxcXFxcXFxcXFxcXFxchHBwcHBweHh4eHBwcHBwhFxcXFxcXFxcXFxcXFxchHBwcHBwcHBwcHBwcHCEXFxcXFxcXFxcXFx8fHhwcHBwcHBwcHBweHyEhFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf////////wf///w7///4////8f////H////j////4////+P////h/3//8f9///D8///4Mf///AP///8//BwBh/+AIAf/6vwCT//3AA//8YA//HAAf/4AAB//AAMP/wACH/4AAf/4AAB/gAAAcAAAA//wAA//wAB/8AAH///////ygAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAEAAAAAAAD///8A////APDw8ADj4+MA3d3cAMzMzADGxsYAu7u7ALKysgCqqqoAo6OjAJmZmQCIiIgAeHh2AG9vbwBmZmYAWFhYAFJSUQBKSkoAQUFBADMzMwAnJygABQUFAAAAAAACAf4AWk0sAHBpPwCQgC0ArpovALOiSQCglmMAwbNlAM/GlgDj3LcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXFxcXFxcGDAgIFxcXFxcXFxcXFxcEERcXFwgXFxcXFxcXFxcEEAUXFxcXFxcXFxcXFxcXCBAXFxcXFxcXFxcXFxcXFwgQFxcXFxcGFxcXFxcXFxcEEAwXFxcMFxcXFxcXFxcXFwgSDA8OBBcXFwwXFxcXFxcXCBAPFxcXBhcXCgwLDA0NDQoIEQ8IBQ0XFxcGFwkXFw0PDxEREwwXFxcXFxcXFwwKFw8RHBEJFxcXFxcXDAkXDxEREREXEgcSFxcXFxcMEREREREPFwgSFwYODRERERERDxwcHBwPFxcXFyEfHxwcHBwcICEXFxcXIRwcHBwcHCAhFxcXFxcXF/8P///+d////H////z////8+////Hf///4H//9/Hf//gAH//9YD///8g///8gj///gJ//8AA///wA///wB///8=
// @grant        GM_xmlhttpRequest
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/452264/%E9%A1%AF%E7%A4%BA%E5%A4%A7%E7%A7%98%E5%AF%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/452264/%E9%A1%AF%E7%A4%BA%E5%A4%A7%E7%A7%98%E5%AF%B6.meta.js
// ==/UserScript==
var flag_debug=false;
var btn_print;
var doc;
var ary_forum=[['60076','2',30],//哈啦區id、回收區id、加載頁數

              ];
var ary_id=[0];
function create_btn(new_name,top,right){
    if(top==undefined){top=0}
    if(typeof right=="undefined"){right=0}
    var btn = document.createElement("Button");
    btn.innerText = new_name;
    btn.style = "top:"+top+"px;right:"+right+"px;position:fixed;"
    //btn.type="submit";
    if(flag_debug)document.body.appendChild(btn);
    return btn;
}
function fn_btn_print(text){
    btn_print.innerHTML+=text
}
function fn_XMLHttpRequest(url){//讀取其他頁面，不能跨網域
    var r;fn_btn_print(url);
    const xhr=new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4 && xhr.status==200){
            var tmp=document.createElement('div')
            tmp.innerHTML=xhr.responseText;
            doc=tmp;
            fn_btn_print(1);

        }
    };
    fn_btn_print(2);
}
function main_01_01(text){
    fn_btn_print(typeof doc);
    var forum_table=document.querySelectorAll('table.b-list>tbody')[0];
    forum_table.appendChild(document.createElement("hr"))
    var forum_list=doc.querySelectorAll('tbody>tr.b-list__row');//
    fn_btn_print(forum_list[0].innerHTML);//debug
    for(let i = 0; i < forum_list.length; i++){
        if(forum_list[i].classList.contains("b-list__row--delete"))continue;
        //這裡用innerHTML會出錯，原因未知
        forum_table.appendChild(forum_list[i])
    }
    var summary=document.querySelectorAll('td.b-list__summary>p>a');
    for(let i = 0; i < summary.length; i++){
        if(summary[i].innerHTML=="回收專區")summary[i].innerHTML="👊"+summary[i].innerHTML+"♻"
    }
}
function main_01(){
    var url=window.location.pathname;
    var page=0;
    for(let i = 0; i < ary_forum.length; i++){//論壇id
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        if(urlParams.get('bsn')==ary_forum[i][0]){
            url=url+"?bsn="+ary_forum[i][0]+"&subbsn="+ary_forum[i][1];//產生url
            page=ary_forum[i][2];
            break;
        }
    }
    var list=document.querySelectorAll('tbody>tr.b-list__row')
    /*var insert_count=0
    for(let i = 0; i < list.length; i++){//棄用，本來想按照時間放置排序，但自己技術不達標，做不到
        if(list[i].children.length==1)continue;//廣告
        if(list[i].classList.contains("b-list__row--sticky"))continue;//置頂
        var str_time=list[i].querySelectorAll('td>p.b-list__time__edittime>a')[0].innerText.split(' ');
        var day=str_time[0];
        var time=str_time[1].split(':');
        var min=10000+parseInt(time[0])*60+parseInt(time[1]);
        if(day=="今日"){

        }
        else if(day=="昨日"){
            min=min-60*24;
        }
        else{
            min=100
        }
        list[i].querySelectorAll('td>p.b-list__summary__sort>a')[0].innerText+=min
        if(ary_id[0]!=min){
            ary_id[0]=min;
            insert_count++;//fn_btn_print(insert_count)
            ary_id[insert_count]=i
        }
    }//*/
    for(let i = 0; i < page; i++){
        window.setTimeout(( () => fn_XMLHttpRequest(url+"&page="+(i+1)) ), 2000*(i+1)-1000);
        window.setTimeout(( () => main_01_01(url+"&page="+(i+1)) ), 2000*(i+1));
    }
}
(function() {
    'use strict';
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    if(urlParams.get('debug')=='1')flag_debug=true;
    btn_print=create_btn("Print: ",75,0)
    main_01();
    // Your code here...
})();