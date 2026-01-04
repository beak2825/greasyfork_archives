// ==UserScript==
// @name        優化動畫瘋彈幕
// @namespace   優化動畫瘋彈幕
// @include     https://ani.gamer.com.tw/animeVideo.php?sn=*
// @version     1.1.7
// @grant       none
// @description         作者：hbl91707（深海異音）
// @description:zh-tw   作者：hbl91707（深海異音）
// @downloadURL https://update.greasyfork.org/scripts/31468/%E5%84%AA%E5%8C%96%E5%8B%95%E7%95%AB%E7%98%8B%E5%BD%88%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/31468/%E5%84%AA%E5%8C%96%E5%8B%95%E7%95%AB%E7%98%8B%E5%BD%88%E5%B9%95.meta.js
// ==/UserScript==


/**
*
*   說明：1.將動畫瘋的彈幕改由canvas繪製，藉此降低記憶體與CPU的使用量
*        2.可設定簡易的彈幕過濾條件
*
*   作者：hbl917070（深海異音）
*   小屋：https://home.gamer.com.tw/homeindex.php?owner=hbl917070
*   mail：hbl917070@gmail.com
*
*   版本：1.1.7
*   最後編輯：2018/02/16
*
*   1.1.7：修正透明度失效的BUG
*   1.1.6：修正某些符號沒有轉換
*   1.1.4：修正【<ｂｒ>】沒有轉換的BUG
*   1.1.3：修正過濾彈幕前會閃爍的BUG
*
*
*/


//▼▼▼這裡的設定可以修改▼▼▼

var int_刷新頻率 = 30; //預設每30毫秒刷新一次彈幕界面（相當於1秒33幀

var int_彈幕陰影程度 = 4; //0~4。0=完全沒陰影、4=陰影全開（可能消耗一點點CPU運算）

var s_文字字體 = "微軟正黑體"; //文字的字體

var bool_過濾單一符號的彈幕 = 1; //1=啟動、0=關閉。例如【%%%%%】、【！！！】、【噓噓噓】就會被過濾

var int_過濾過短的彈幕 = 1; //【字數】小於等於 這個數字的彈幕就會被過濾。不想用的話就改成【0】

var ar_filter = new Array(); //過濾出現這些文字的彈幕，要新增就在下面多一行【ar_filter.push("你要的文字");】，英文不區分大小寫
ar_filter.push("簽");
ar_filter.push("劇透"); //例：可以不要那邊劇透嗎
ar_filter.push("據透");
ar_filter.push("猜"); //例：猜等一下***會死
ar_filter.push("檢舉"); //例：可以檢舉***嗎
ar_filter.push("朝聖");
ar_filter.push("每日");
ar_filter.push("報到");
ar_filter.push("留名");
ar_filter.push("刷");
ar_filter.push("進度");
ar_filter.push("彈幕"); //例：都被彈幕擋住了
ar_filter.push("留言");
ar_filter.push("GY"); //例：不爽看就不要看，不要那邊GGYY
ar_filter.push("不爽看");
ar_filter.push("不想看");
ar_filter.push("神作"); //例：在這裡摔下去就神作了
ar_filter.push("酸");
ar_filter.push("雷");
ar_filter.push("老婆");
ar_filter.push("我婆");
ar_filter.push("沙沙");
ar_filter.push("殺殺");
ar_filter.push("莎莎");
ar_filter.push("只有我覺得");
ar_filter.push("前方");
ar_filter.push("高能");
ar_filter.push("胃");
ar_filter.push("有人嗎");
ar_filter.push("神op");
ar_filter.push("不跳op");
ar_filter.push("FLAG");
ar_filter.push("旗子");
ar_filter.push("立旗");
ar_filter.push("插旗");
ar_filter.push("崩");

//▲▲▲這裡的設定可以修改▲▲▲



//----------------------------------

var obj_can;
var ctx;

fun_creat_canvas();



//判斷之前全部轉成大寫
for(var i = 0 ; i < ar_filter.length ; i++){
    ar_filter[i] = ar_filter[i].toLowerCase();
}



///
///判斷字串是否每一個字都相同
///
function fun_allSame(str) {
    if (str.length <= 1) {
        return false;
    }
    let ar_str = str.split("");//切割字串
    for (let i = 1; i < ar_str.length; i++) {
        if (ar_str[i] != ar_str[0]) {
            return false;
        }
    }
    return true;
}


///
///產生canvas
///
function fun_creat_canvas() {

    let vjs = document.getElementsByClassName("vjs-danmu")[0];

    //直到物件存在才開始執行
    if (vjs === undefined) {
        setTimeout(function () {
            fun_creat_canvas();
        }, 1000);
        return;
    }

    //產生canvas
    obj_can = document.createElement("canvas");
    obj_can.width = vjs.clientWidth;
    obj_can.height = vjs.clientHeight;
    ctx = obj_can.getContext("2d");//取得繪圖物件
    //obj_can.style.backgroundColor = "rgba(0,0,0,0.4)";
    obj_can.style.pointerEvents = "none";//禁止點擊
    obj_can.style.position = "absolute";//設定位置
    obj_can.style.left = "0px";
    obj_can.style.top = "0px";

    //產生style（避免原本的彈幕消耗記憶體，所以隱藏起來
    let obj_style = document.createElement("style");
    obj_style.innerHTML = ".cmt{position:static !important; display:inline!important; opacity:0!important;} .cmt_none{display:none!important;} ";

    //插入
    var ani_video = document.getElementById("ani_video");
    //var ani_video = document.getElementsByClassName("player")[0];
    ani_video.appendChild(obj_can);
    ani_video.appendChild(obj_style);

    fun_div_to_canvas();
    fun_auto_size();
}




///
///定時調整canvas的大小與透明度
///
function fun_auto_size() {

    let vjs = document.getElementsByClassName("vjs-danmu")[0];

    if (obj_can.width != vjs.clientWidth) {
        obj_can.width = vjs.clientWidth;
        obj_can.height = vjs.clientHeight;
    }

    //根據動畫瘋本身的設定來調整透明度
    if (document.getElementById("DanmuOpacityNum") === undefined) {
        obj_can.style.opacity = 1;
    } else {
        obj_can.style.opacity = Number(document.getElementsByClassName("DanmuOpacityRange")[0].value) / 100;
    }

    setTimeout(function () {//1500毫秒後重新執行
        fun_auto_size();
    }, 1500);
}





///
///將DIV彈幕轉成canvas來繪製
///
function fun_div_to_canvas() {

    //document.getElementById().getAttribute()

    ctx.clearRect(0, 0, obj_can.width, obj_can.height);//清除上次的繪圖結果

    let ar_tt = document.getElementsByClassName("cmt");//取得所有彈幕

    for (let i = 0; i < ar_tt.length; i++) {


        ar_tt[i].className = "cmt_none cmt";//隱藏


        if (ar_tt[i].getAttribute("style").indexOf("opacity") > -1) {//如果opacity是0，就是在動畫瘋屬於隱藏的彈幕
            if (Number(ar_tt[i].style.opacity) === 0)
                continue;
        }

        let cmt_t = ar_tt[i].innerHTML.replace(/&gt;/g, ">").replace(/&lt;/g, "<")
                                      .replace(/&amp;/g, "&").replace(/&quot;/g, '"')
                                      .replace(/&apos;/g, "'").replace(/<br>/g, " ")
                                      .replace(/&nbsp;/g, " ");//文字內容

        if (ar_tt[i].getAttribute("text_allow") != "true") {//判斷過的句子就不再判斷第二次

            //過濾相同符號的留言（例如【！！！】、【%%%】
            if (bool_過濾單一符號的彈幕 > 0) {
                if (fun_allSame(cmt_t)) {
                    ar_tt[i].style.opacity = "0";//隱藏
                    ar_tt[i].innerHTML = "";
                    continue;
                }
            }

            //彈幕小於等於這個長度就會被過濾
            if (cmt_t.length <= int_過濾過短的彈幕) {
                ar_tt[i].style.opacity = "0";//隱藏
                ar_tt[i].innerHTML = "";
                continue;
            }

            //過濾包含特定關鍵字的彈幕
            let bool_delete = false;//避免閃爍
            for (let j = 0; j < ar_filter.length; j++) {
                if (cmt_t.toLowerCase().indexOf(ar_filter[j]) > -1) {
                    ar_tt[i].style.opacity = "0";//隱藏
                    ar_tt[i].innerHTML = "";
                    bool_delete = true;
                    break;
                }
            }
            if (bool_delete) {
                continue;
            }
            ar_tt[i].setAttribute("text_allow", "true");

        }//if



        let cmt_color = ar_tt[i].style.color;//文字顏色
        let cmt_fontSize = Number(ar_tt[i].style.fontSize.replace("px", ""));//文字size
        let cmt_x = Number(ar_tt[i].style.left.replace("px", ""));//left

        let cmt_y = 0;//top
        if (ar_tt[i].style.bottom.length > 1) {//【靠下】
            let cmt_bottom = Number(ar_tt[i].style.bottom.replace("px", ""));
            cmt_y = obj_can.height - cmt_bottom - 5;
        } else {//【滾動】或【靠上】
            cmt_y = Number(ar_tt[i].style.top.replace("px", "")) + cmt_fontSize;
        }

        ctx.font = "bold " + cmt_fontSize + "px " + s_文字字體;

        ctx.fillStyle = "#000000";//陰影顏色
        if (int_彈幕陰影程度 >= 1) {
            ctx.fillText(cmt_t, cmt_x + 1, cmt_y + 1);//先繪製陰影(右下)
        }
        if (int_彈幕陰影程度 >= 2) {
            ctx.fillText(cmt_t, cmt_x - 1, cmt_y - 1);//先繪製陰影（左上）
        }
        if (int_彈幕陰影程度 >= 3) {
            ctx.fillText(cmt_t, cmt_x + 1, cmt_y - 1);//先繪製陰影(右上)
        }
        if (int_彈幕陰影程度 >= 4) {
            ctx.fillText(cmt_t, cmt_x - 1, cmt_y + 1);//先繪製陰影（左下）
        }

        ctx.fillStyle = cmt_color;//文字顏色
        ctx.fillText(cmt_t, cmt_x, cmt_y);//繪製文字

    }



    setTimeout(function () {//30毫秒後重新執行
        fun_div_to_canvas();
    }, int_刷新頻率);

}
