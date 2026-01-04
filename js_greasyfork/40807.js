// ==UserScript==
// @name         巴哈姆特哈啦區顯示板務名稱
// @namespace    巴哈姆特哈啦區顯示板務上線狀態
// @author       johnny860726
// @match        *forum.gamer.com.tw/*
// @run-at       document-end
// @description  在巴哈姆特哈啦區令板務列表顯示個別板務暱稱, 並可以按鈕切換顯示行為
// @version      20190606
// @downloadURL https://update.greasyfork.org/scripts/40807/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%E9%A1%AF%E7%A4%BA%E6%9D%BF%E5%8B%99%E5%90%8D%E7%A8%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/40807/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%E9%A1%AF%E7%A4%BA%E6%9D%BF%E5%8B%99%E5%90%8D%E7%A8%B1.meta.js
// ==/UserScript==

// 0: 顯示, 1: 折疊
var isOnOnly = 0;

// 自訂哈啦板編號, 與自訂哈啦板板務名單配合用, 不必修改
var bsn = 60076;

// 自訂哈啦板之板務名單
var list = 'yunski,a1998307,ab91516,DarkPerson,edfrmpc44ic,fired00002,johnny860726,oscar123400,peter8964,s1989122s,seanlau708,TofuTM,we1230332';

// 為防衝突需要, 不必修改
var s = 50;

// 以下為腳本

var i;
function add_area(id,od){

    // 人員個人區塊
    var area = document.createElement("div");
    if(isOnOnly){
        area.style = "display: none;";
    }
    area.className = "FM-rbox14-master " + id + '-is-on';
    outerArea.insertBefore(area, outerArea.childNodes[od+2]);

    // 頭像及連結
    var img_link = document.createElement("a");
    img_link.href = "https://home.gamer.com.tw/homeindex.php?owner=" + id;
    area.appendChild(img_link);
    var img = document.createElement("img");
    img.src = "https://avatar2.bahamut.com.tw/avataruserpic/" + id[0] + "/" + id[1] + "/" + id + "/" + id + "_s.png";
    img.style = "margin-left: 16px; border-radius: 50%;";
    img.setAttribute("data-gamercard-userid", id);
    img_link.appendChild(img);

    // 暱稱連結文字
    var link = document.createElement("a");
    link.className = id + "-nickname";
    link.href = "https://home.gamer.com.tw/homeindex.php?owner=" + id;
    link.style = "margin-left: 4px;";
    link.innerText = id;
    area.appendChild(link);

    // 在線狀態區塊
    var ison = document.createElement("span");
    ison.style = "margin-left: 4px;";
    ison.id = "BMW_" + (od+s);
    ison.className = "is-on-bmw";
    area.appendChild(ison);
}

function ajax_nickname(id){
    $.get("/ajax/gamercard.php","u="+id,function f(d){
        var jd = JSON.parse(d);
        var elems = document.getElementsByClassName(id + "-nickname");
        for(i=0; i<elems.length; i++){
            elems[i].innerText = jd.nickname;
        }
    });
}

// 調整在線標籤
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = '.FM-rbox14-master > span[id^="BMW_"] > a > img { width: 42px; height: 15px; margin-left: 4px;}';
document.body.appendChild(css);
var display = isOnOnly;

try{
    var org = document.getElementsByClassName("FM-rbox14-master")[0];
    var outerArea = org.parentNode;
    // 若非場外休憩區就從網頁上的板務人員名單讀取並覆蓋原先自定義的名單
    if(location.href.split("bsn=")[1].split("&")[0] != bsn){
        var ids = document.querySelectorAll(".FM-rbox14-master > a > img");
        list = "";
        for(i=0; i<ids.length; i++){
            list += ids[i].getAttribute("data-gamercard-userid");
            if(i != ids.length - 1){
                list += ",";
            }
        }
    }
    list = list.replace(" ", "").toLowerCase();

    if(list !== ""){
        // 讀取中
        if(isOnOnly){
            var area = document.createElement("div");
            area.className = "FM-rbox14-master is-on-loading";
            var ld_text = document.createElement("span");
            ld_text.style = "margin-left: 16px;";
            ld_text.innerText = "讀取中……";
            area.appendChild(ld_text);
            outerArea.insertBefore(area, outerArea.childNodes[1]);
        }

        // 產生個人區塊、刪除原版區塊
        var ls = list.split(',');
        for(i=0; i<ls.length; i++){
            add_area(ls[i],i);
        }
        outerArea.removeChild(org);

        // 板務人員標題區塊
        var title = document.createElement("div");
        title.setAttribute("class", "BH-rbox FM-rbox14 is-on-title");
        title.style = "margin-bottom: 0px;";
        var text = document.createElement("span");
        text.innerText = "板務人員";
        text.style = "margin-left: 4px; font-weight: bold;";
        title.appendChild(text);
        var bt = document.createElement("button");
        bt.className = "display-switch";
        if(isOnOnly){
            bt.innerText = "顯示全部";
        }else{
            bt.innerText = "顯示在線";
        }
        bt.style = "float: right; font-family: 微軟正黑體; margin-top: 3px; margin-right: 4px; opacity: 0.6; background-color: #0D6073; color: #FFFFFF; border: 1px; border-radius: 2px;";
        bt.onclick = function(){
            try{
                var o_elems = document.getElementsByClassName("is-off");
                for(i=0; i<o_elems.length; i++){
                    var mode;
                    if(o_elems[i].getAttribute("style").search("display: none;") != -1){
                        o_elems[i].style = "";
                        mode = 0;
                    }else{
                        o_elems[i].style = "display:none";
                        mode = 1;
                    }
                    if(mode === 0){
                        document.getElementsByClassName("display-switch")[0].innerText = "顯示在線";
                    }else{
                        document.getElementsByClassName("display-switch")[0].innerText = "顯示全部";
                    }
                }
            }catch (e){
                alert(e);
            }
        };
        title.appendChild(bt);
        outerArea.parentNode.insertBefore(title, outerArea);
        ls.forEach(function(e){
            ajax_nickname(e);
        });

        // 讀取在線狀態
        var sc = document.createElement("script");
        sc.src = "https://im.gamer.com.tw/bmw/jsIson.php?u=" + ','.repeat(s) + list;
        sc.async = false;
        outerArea.appendChild(sc);
        sc.onload = function() {
            var area = document.getElementsByClassName("is-on-bmw");
            var count = 0;
            for(i=0; i<area.length; i++){
                if(area[i].innerHTML.search('/on.gif') != -1){
                    area[i].parentNode.style = "";
                    count++;
                }else{
                    area[i].parentNode.className += ' is-off';
                    if(isOnOnly){
                        area[i].parentNode.style = "display: none";
                    }else{
                        area[i].parentNode.style = "";
                    }
                }
            }
            text.innerText = "板務人員 (" + count + "/" + ls.length + ")";
        };
        document.getElementsByClassName("is-on-loading")[0].style = "display: none;";
    }
}catch (err){
}