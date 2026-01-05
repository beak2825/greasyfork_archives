// ==UserScript==
// @name        巴哈姆特-場外休憩區--隱藏廢文
// @namespace   hbl917070
// @include     https://forum.gamer.com.tw/C.php?bsn=60076*
// @include     https://forum.gamer.com.tw/Co.php?bsn=60076*
// @include     https://forum.gamer.com.tw/C.php?page=*&bsn=60076*


// @version     1.41
// @grant       none
// @description         作者：hbl91707（深海異音）
// @description:zh-tw   作者：hbl91707（深海異音）
// @downloadURL https://update.greasyfork.org/scripts/20855/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9-%E5%A0%B4%E5%A4%96%E4%BC%91%E6%86%A9%E5%8D%80--%E9%9A%B1%E8%97%8F%E5%BB%A2%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/20855/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9-%E5%A0%B4%E5%A4%96%E4%BC%91%E6%86%A9%E5%8D%80--%E9%9A%B1%E8%97%8F%E5%BB%A2%E6%96%87.meta.js
// ==/UserScript==
//

/*

巴哈姆特-場外休憩區--隱藏廢文
更新日期：2018-04-13

說明：
  1.可設定【回文】小於幾個字就不顯示。
  2.可設定【留言】小於幾個字就不顯示。
  3.可設定特定的文字不顯示，例如回文or留言只有一個【卡】，就不顯示。
  4.網頁最上方會顯示隱藏的回文與留言數量。點擊後可以解除隱藏，並且會變成紅色背景以方便檢查。


作者小屋：
http://home.gamer.com.tw/homeindex.php?owner=hbl917070

*/

//-------------------------------------------------------------

//小於等於特定的字數就隱藏
var int_回文小於特定長度 = 0;
var int_留言小於特定長度 = 0;


//在判斷長度是否會被過濾之前，會先隱藏這裡的文字
//例如：【私私 推】雖然有4個字，但是實際上長度是0，因為【推】跟【私】跟【空白】會被無視
var s_過濾特定文字 = [
    /通知/g, /再說/g, /在說/g, /形狀/g, /老婆/g, /拜託/g, /總之/g, /化成/g, /留名/g,
    /對不起/g, /收到/g, /造福/g, /好奇/g, /自推/g, /再推/g, /再啦/g, /在啦/g, /好屌/g,
    /神串/g, /上香/g, /前排/g,  /神串/g, /不送/g, /慢走/g,

    /ㄅ/g, /ㄈ/g, /ㄍ/g, /ㄊ/g, /ㄌ/g, /ㄙ/g, /ㄏ/g, /ㄓ/g, /ㄛ/g,
    /bang/ig, /rip/ig, /car/ig,
    /c/ig, /a/ig, /r/ig, /g/ig, /i/ig, /n/ig, /d/ig, /e/ig, /x/ig, /d/ig, /w/ig,

    /私/g, /斯/g, /濕/g, /絲/g, /司/g, /禾/g, /厶/g, /死/g, /上/g, /我/g, /惹/g, /嘻/g,
    /車/g, /香/g, /先/g, /穴/g, /好/g, /啦/g, /拉/g, /斷/g, /火/g, /喔/g, /來/g, /吧/g,
    /啊/g, /阿/g, /的/g, /個/g, /求/g, /哦/g, /乃/g, /感/g, /恩/g, /謝/g, /蓋/g, /懂/g,
    /棒/g, /硬/g, /爆/g, /推/g, /卡/g, /看/g, /幹/g, /豪/g, /了/g, /甲/g, /大/g, /啪/g,
    /野/g, /狂/g, /笑/g, /真/g, /想/g, /舔/g, /噓/g, /分/g, /糞/g, /怕/g, /嗎/g, /射/g,
    /滑/g, /倒/g, /嗯/g, /首/g, /雷/g, /電/g, /郭/g, /嘓/g, /屌/g, /哇/g, /酷/g, /神/g,
    /猛/g, /屌/g, /太/g, /欸/g, /掰/g, /鬧/g, /挖/g,

    /8/g, /7/g, /1/g, /0/g,
    /^\s+|\s+$/g, /\r/g, /\n/g, /[.]/g, /[=]/g, /[?]/g, /[+]/g, /%/g, /[,]/g, /~/g, /!/g,
    /？/g, /％/g, /…/g, /。/g, /，/g, /！/g, /～/g, / /g , /\\/g , /\|/g , /\//g
];

//-------------------------------------------------------------


var int_留言 = 0;//記錄次數
var int_回文 = 0;


//產生【顯示】的按鈕
var bu = document.createElement("div");
bu.id = "but_view";
bu.onclick = fun_顯示;
bu.style.display = "block";
bu.style.float = "left";
bu.style.margin = "5px";
//bu.style.position = "fixed";
//bu.style.left = "270px";
//bu.style.top = "10px";
bu.style.color = "rgb(255,150,150)";
bu.style.zIndex = "5000000";

bu.style.backgroundColor = "rgba(0,0,0,0.3)";
bu.style.padding = "0px";
bu.style.border = "#fff solid 0px";


var obj_搜尋框 = undefined;
try {
    obj_搜尋框 = document.getElementsByClassName("logo")[0].parentNode;
} catch (e) { }

if(obj_搜尋框 === undefined){
    obj_搜尋框 = document.body;
    bu.style.position = "fixed";
    bu.style.left = "0px";
    bu.style.top = "0px";
}
obj_搜尋框.appendChild(bu);



//隱藏回文
var obj_1 = document.getElementsByClassName("c-post");
for (var i = 0; i < obj_1.length; i++) {



    //檢查是否有展開留言的按鈕
    try {
        var obj_展開留言 = obj_1[i].getElementsByClassName("more-reply")[0];

        (function(){
           var ac = obj_展開留言.onclick;//複製原本展開留言的function
           obj_展開留言.onclick = function(){
               ac();
               setTimeout(function () {
                   fun_隱藏留言();
               }, 1800);

           };
        })()

    } catch (e) { }


    var s = obj_1[i].getElementsByClassName("c-article")[0].innerText;

    //刪除無意義的文字
    if (s.length < 50)
        for (var k = 0; k < s_過濾特定文字.length; k++) {
            if (s.length <= int_回文小於特定長度)
                break;
            s = s.replace(s_過濾特定文字[k], "");
        }

    //過濾過短的文字
    if (obj_1[i].getElementsByClassName("c-article")[0].getElementsByTagName("img")[0] === undefined)
        if (obj_1[i].getElementsByClassName("c-article")[0].getElementsByTagName("iframe")[0] === undefined)
            if (s.length <= int_回文小於特定長度) {
                fun_隱藏物件(obj_1[i].parentNode, "回文");
                continue;
            }

}


fun_隱藏留言();



function fun_隱藏留言() {

        var obj_1 = document.getElementsByClassName("c-reply__item");
        for (var i = 0; i < obj_1.length; i++) {

            //取得留言內容
            var s = obj_1[i].getElementsByClassName("c-article")[0].innerText;

            if (s.length < 20)
                for (var k = 0; k < s_過濾特定文字.length; k++) {
                    if (s.length <= int_留言小於特定長度)
                        break;
                    s = s.replace(s_過濾特定文字[k], "");
                }


            if (obj_1[i].getElementsByClassName("c-article")[0].getElementsByTagName("img")[0] === undefined)
                if (obj_1[i].getElementsByClassName("c-article")[0].getElementsByTagName("iframe")[0] === undefined)
                    if (s.length <= int_留言小於特定長度) {
                        fun_隱藏物件(obj_1[i], "留言");
                        continue;
                    }


    }//for

    fun_更新按鈕();


}






function fun_隱藏物件(obj, ss) {
    if (obj.style.display != "none") {

        obj.style.display = "none";
        obj.style.backgroundColor = "rgba(150,10,20,0.3)";

        if (ss == "留言") {
            int_留言++;
        } else {
            int_回文++;
        }
    }
}


function fun_更新按鈕() {

    if (int_留言 === 0 && int_回文 === 0) {
        document.getElementById("but_view").innerHTML = "";
    } else if (int_回文 === 0) {
        document.getElementById("but_view").innerHTML = "顯示：留言" + int_留言;
    } else if (int_留言 === 0) {
        document.getElementById("but_view").innerHTML = "顯示：回文" + int_回文;
    } else {
        document.getElementById("but_view").innerHTML = "顯示：留言" + int_留言 + "、回文" + int_回文;
    }

}






//hover
try{
    $("#but_view").hover(function(){
        $("#but_view").css("color","#117E96");
    },function(){
        $("#but_view").css("color","rgb(255,150,150)");
    });
}catch(e){}

fun_更新按鈕();


function fun_顯示() {

    //初始化
    document.getElementById("but_view").innerHTML = "";
    int_回文 = 0;
    int_留言 = 0;

    //回文
    var obj_1 = document.getElementsByClassName("c-post");
    for (var i = 0; i < obj_1.length; i++) {
        obj_1[i].parentNode.style.display = "block";
    }

    //留言
    obj_1 = document.getElementsByClassName("c-reply__item");
    for (i = 0; i < obj_1.length; i++) {
        obj_1[i].style.display = "block";
    }
}

