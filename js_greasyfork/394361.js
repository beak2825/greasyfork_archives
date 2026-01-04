// ==UserScript==
// @name         Open 2ch NG
// @namespace    https://greasyfork.org/ja/users/426180
// @version      1.0
// @description  「おーぷん2ちゃんねる」でNGネーム・アイコンに関連するレスを見えなくする
// @author       Coda2001
// @match        *://*.open2ch.net/test/read.cgi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394361/Open%202ch%20NG.user.js
// @updateURL https://update.greasyfork.org/scripts/394361/Open%202ch%20NG.meta.js
// ==/UserScript==

'use strict';

var ng_list = [];
var NGID = [];
var NGIDnum = 0;

//NGリスト取得関数
function getNGlist(){
    if(localStorage.NGlist === undefined){
        localStorage.NGlist = [""];
        return [""];
    }else{
        return localStorage.NGlist.split("\n");
    }
}

//親要素を取得するための関数
function getParentNodeByName(elem,name){
    var i = 0;
    var tgt = new Array;
    tgt[0] = elem;
    while(tgt[i].tagName !== "BODY"){
        if(tgt[i].tagName === name){
            return tgt[i];
        }
        tgt[i+1] = tgt[i].parentNode;
        i++;
    }
    return;
}

//コテNG
function thread(){
    document.querySelectorAll("a.num").forEach(function(elem){
        var got_name = elem.querySelector("font").innerHTML;
        const id = elem.getAttribute("val");
        if (got_name == null || got_name == undefined) {
            got_name = "";
        }
        for(let i = 0;i < ng_list.length;i++){
            const ngword = ng_list[i];
            if(ngword === ""){
                continue;
            }
            const index = got_name.includes(ngword);
            if(index === true){
                if(NGID.indexOf(id) === -1){
                    NGID[NGID.length] = id;
                }
                break;
            }
        }
        return;
    });
}

//アイコンNG
function icon(){
    document.querySelectorAll("div.faceicon").forEach(function(elem){
        const tgt = getParentNodeByName(elem,"DL");
        const id = tgt.querySelector("a.num").getAttribute("val");
        if(NGID.indexOf(id) === -1){
            NGID[NGID.length] = id;
        }
        return;
    });
}

//NGレスに安価飛ばすレスをNG
function ankNg(){
    const thr = document.querySelector("div.thread");
    thr.querySelectorAll("a._ank").forEach(function(elem){
        const tgt = getParentNodeByName(elem,"DL");
        const id = tgt.querySelector("a.num").getAttribute("val");
        const ankNum = elem.textContent.slice(2);
        if(NGID.indexOf(ankNum) !== -1){
            if(NGID.indexOf(id) === -1){
                NGID[NGID.length] = id;
            }
        }
        return;
    });
}

//安価逆参照の中のNGレス除去
function removeNG(elm){//安価逆参照要素の中のNGレスを取り除く関数
    var num = 0;
    elm.querySelectorAll("a.num").forEach(function(elem){
        const id = elem.getAttribute("val");
        if(NGID.indexOf(id) !== -1){
            const tgt_name = getParentNodeByName(elem,"DT");
            const tgt_comment = tgt_name.nextElementSibling;
            tgt_name.remove();
            tgt_comment.remove();
            num++;
        }
    });
    if(num > 0){
        addMassage("レスを"+num+"件除去しました.");
    }
}
function execute(event){//押した要素にだけremoveNGする関数
    const evpl = event.target;
    const tgt = getParentNodeByName(evpl,"DIV");
    setTimeout(function(){removeNG(tgt);},200);//要改善
}
function addNG(){//全ての安価逆参照要素にcheckNGを追加する関数
    document.querySelectorAll("div.aresdiv").forEach(function(elem){
        elem.addEventListener('click',execute);
    });
}

//NGレスを消す
function removeNg(){
    document.querySelectorAll("a.num").forEach(function(elem){
        const num = elem.getAttribute("val");
        if(NGID.indexOf(num) !== -1){
            const tgt = getParentNodeByName(elem,"DL");
            tgt.remove();
        }
    });
}

//ページを隠す・表示
function visible(val){
    document.querySelector("html").style.visibility = val;
}

//操作ボックス
function divCreate(){
    var win = document.createElement("div");
    var bod = document.createElement("div");
    var tab = document.createElement("div");
    var log_tab = document.createElement("div");
    var config_tab = document.createElement("div");
    var log_bod = document.createElement("div");
    var log = document.createElement("div");
    var run_btn = document.createElement("input");
    var config_bod = document.createElement("div");
    var config = document.createElement("textarea");
    var config_btn = document.createElement("div");
    var config_btn1 = document.createElement("input");
    var config_btn2 = document.createElement("input");
    win.id = "NGbox";
    win.style = "z-index:20;position:fixed;bottom:60px;right:0px;width:220px;font-size:9pt;";
    win.innerHTML = '<div style="border:1px solid;background:#030;"><div style="color:white;padding:3px;"> Open 2ch NG</div></div>';
    bod.style = "background:#ddffdd;border:1px solid;";
    tab.style = "display:flex;flex-direction:row;";
    log_tab.style = "text-align:center;width:50%;cursor:pointer;padding:3px;background:#ddffdd;font-size:9pt;";
    log_tab.innerHTML = "ＮＧログ";
    log_tab.addEventListener('click',()=>{
        log_bod.style.display = "";
        log_tab.style.background = "#ddffdd";
        config_bod.style.display = "none";
        config_tab.style.background = "#5ad25a";
    });
    config_tab.style = "text-align:center;width:50%;cursor:pointer;padding:3px;background:#5ad25a;font-size:9pt;";
    config_tab.innerHTML = "ＮＧリスト";
    config_tab.addEventListener('click',()=>{
        log_bod.style.display = "none";
        log_tab.style.background = "#5ad25a";
        config_bod.style.display = "";
        config_tab.style.background = "#ddffdd";
    });
    log_bod.style = "";
    log.id = "NGlog";
    log.innerHTML = "おーぷん2ちゃんねるNG機能";
    log.style = "background:white;overflow-y:scroll;margin:5px;height:80px;width:210px;";
    run_btn.setAttribute("type","button");
    run_btn.setAttribute("value","更新");
    run_btn.style = "cursor:pointer;display:block;margin:0px 5px 5px auto;"
    run_btn.addEventListener("click",() =>{
        doNg();
        massage();
    });
    config_bod.style = "display:none;";
    config.id = "NGlist";
    config.value = localStorage.NGlist;
    config.style = "background:white;overflow-y:scroll;margin:5px;height:80px;width:210px;border:none;resize:none;font-size:9pt;";
    config.placeholder = "1行に1つずつNGする名前を入力";
    config_btn.style = "text-align:right";
    config_btn1.setAttribute("type","button");
    config_btn1.setAttribute("value","設定");
    config_btn1.style = "cursor:pointer;displayinline-:block;margin:0px 5px 5px auto;"
    config_btn1.addEventListener("click",() =>{
        var gotList = document.getElementById("NGlist").value;
        while(gotList.startsWith("\n") === true){
            gotList = gotList.replace("\n","");
        }
        while(gotList.indexOf("\n\n") !== -1){
            gotList = gotList.replace("\n\n","\n");
        }
        localStorage.NGlist = gotList;
        ng_list = getNGlist();
        document.getElementById("NGlist").value = localStorage.NGlist;
    });
    config_btn2.setAttribute("type","button");
    config_btn2.setAttribute("value","リストの更新");
    config_btn2.style = "cursor:pointer;display:inline-block;margin:0px 5px 5px auto;"
    config_btn2.addEventListener("click",() =>{
        document.getElementById("NGlist").value = localStorage.NGlist;
    });
    win.appendChild(bod);
    bod.appendChild(tab);
    tab.appendChild(log_tab);
    tab.appendChild(config_tab);
    bod.appendChild(log_bod);
    log_bod.appendChild(log);
    log_bod.appendChild(run_btn);
    bod.appendChild(config_bod);
    config_bod.appendChild(config);
    config_bod.appendChild(config_btn);
    config_btn.appendChild(config_btn2);
    config_btn.appendChild(config_btn1);
    return win;
}
function addMassage(text){//NGログにメッセージを追加する
    const div = document.getElementById("NGlog");
    div.innerHTML = "▶" + text + "<br>" + div.innerHTML.replace("▶","");
}

//ページ読み込み時に実行
function main (){
    visible("hidden");
    const checkInterval = setInterval(()=>{
        if(document.readyState!=="loading"){
            clearInterval(checkInterval);
            document.body.appendChild(divCreate());
            doNg();
            massage();
            visible("");
        }
    },100);
}

//NG関数まとめ
function doNg(){
    ng_list = getNGlist();
    thread();
    icon();
    ankNg();
    addNG();
    removeNg();
}

//ページ読み込み時・手動更新時のメッセージ
function massage(){
    var num = NGID.length - NGIDnum;
    if(num !== 0){
        var str = "";
        for(let i = NGIDnum;i < NGID.length;i++){
            str = str + NGID[i] + ",";
        }
        addMassage("レスを"+num+"件削除しました.<br>▶"+str);
        NGIDnum = NGID.length;
    }else{
        addMassage("NGレスはありません.");
    }
}

//ページ読み込み時に実行
const url = window.location.href;
console.log("[Open_2ch_NG] run");
document.addEventListener('DOMContentloaded',main());

//新着時に実行
var flag = 0;
const target = document.querySelector("title");
const observer = new MutationObserver( function(mutations) {
    mutations.forEach(function(mutation) {
        if(flag%2 === 0){
            setTimeout(function(){
                doNg();
                var num = NGID.length - NGIDnum;
                if(num !== 0){
                    var str = "";
                    for(let i = NGIDnum;i < NGID.length;i++){
                        str = str + NGID[i] + ",";
                    }
                    addMassage("NGレスです.<br>▶"+str);
                    NGIDnum = NGID.length;
                }else{
                    addMassage("NGレスではありません.");
                }
            },300);
        }
        flag++;
    });
});
const config = {attributes: true, childList: true, characterData: true};
observer.observe(target, config);