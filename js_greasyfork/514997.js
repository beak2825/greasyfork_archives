// ==UserScript==
// @name        印務局查看法例的好幫手(優化版)
// @namespace   asldufhiu32hr9283hf83123
// @include     http*://bo.io.gov.mo/bo/i*
// @require     https://code.jquery.com/jquery-3.3.1.slim.min.js
// @description 查看法例的好幫手
// @version     1.4
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514997/%E5%8D%B0%E5%8B%99%E5%B1%80%E6%9F%A5%E7%9C%8B%E6%B3%95%E4%BE%8B%E7%9A%84%E5%A5%BD%E5%B9%AB%E6%89%8B%28%E5%84%AA%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514997/%E5%8D%B0%E5%8B%99%E5%B1%80%E6%9F%A5%E7%9C%8B%E6%B3%95%E4%BE%8B%E7%9A%84%E5%A5%BD%E5%B9%AB%E6%89%8B%28%E5%84%AA%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

// 設定側邊欄的寬度
var W_PANE = 600;

// 創建側邊欄的HTML結構
var s = "<div id='div_pane_index' style='left:-" + W_PANE + "px; top:9%; width:" + W_PANE + "px; height:79%; position: fixed; background: #FFFFFF; border: 3px solid #2209e3; padding: 10px; overflow-x: hidden; overflow-y: hidden; font-size:13px; opacity:0.9; filter:alpha(opacity=90); transition: left 0.5s;'>";

// 獲取所有的h2和h3標題
var h = $('h2,h3');

// 遍歷所有標題
for (var i = 0; i < h.length; i++) {
    var I = i; // 保存當前索引
    h.eq(i).attr("anchor_index", i); // 為每個標題設置索引
    var text = h.eq(i).text(); // 獲取標題文本

    // 檢查標題是否以特定字符開頭
    if ((text.indexOf("第") == 0 || text.indexOf("附件") == 0 || text.indexOf("表") == 0
        || text.indexOf("Artigo ") == 0 || text.indexOf("CAPÍTULO ") == 0 || text.indexOf("SECÇÃO ") == 0)
        && i + 1 < h.length) {
        i++; // 移動到下一個標題
        text += "　<b>" + h.eq(i).text() + "</b>"; // 將下一個標題文本添加到當前標題文本中
    }

    // 檢查標題是否為「公告」、「通告」或「名單」
    var isImportantTitle = (text.includes("公告") || text.includes("通告") || text.includes("名單") || text.includes("公 告") || text.includes("通 告") || text.includes("名 單") || text.includes("節") ) ;
    var mainTitle = (text.includes("局") || text.includes("辦公室") || text.includes("辦 公 室") || text.includes("通告及公告") || text.includes("章") || text.includes("立法會"))

    // 添加標題到側邊欄，根據標題是否重要設置樣式
    s += "<span style='display:block; cursor: pointer; padding-left:50px;text-indent:-50px;margin-left:10px" +
         (isImportantTitle ? " font-weight:bold; font-size: 15px; color:blue; margin-top: 4px;" :"") +
         (mainTitle ? " font-weight:bold; font-size: 16px; color:red; text-decoration:underline; margin-top: 10px; " : "") +
         "' index='" + I + "'>" + text + "</span>";
}

// 結束側邊欄的HTML結構
s += "</div>";
$('body').append(s); // 將側邊欄添加到頁面中

// 設置點擊事件
$('#div_pane_index>span').click(function() {
    var t = $("[anchor_index=" + $(this).attr("index") + "]"); // 獲取對應的標題
    t[0].scrollIntoView(); // 滾動到該標題
    t.css({
        transition: '0s', // 設置過渡時間為0
        'background-color': '#ffe600', // 設置背景顏色
    });

    // 設置定時器，改變背景顏色回到原來的顏色
    setTimeout(function() {
        t.css({
            transition: "10s", // 設置過渡時間為10秒
            "background-color": "#ffe60000", // 輕微改變背景顏色
        });
    }, 1);
});

// 添加CSS樣式
$("<style type='text/css'> \
    #div_pane_index>span:hover{ background-color:#EEee77; } \
    #div_pane_index:hover{ left:0 !important; overflow-y: auto !important; } \
    #div_pane_index{ transition: left 0.5s; } \
    </style>").appendTo("head");

// 偵測鼠標進入和離開側邊欄
$('#div_pane_index').hover(
    function() {
        $(this).css('left', '0'); // 鼠標進入時，移動到中間
    },
    function() {
        $(this).css('left', '-' + W_PANE + 'px'); // 鼠標離開時，移回原位
    }
);