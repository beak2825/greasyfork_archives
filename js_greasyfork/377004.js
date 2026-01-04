// ==UserScript==
// @name         Wootalk 自動輔助腳本 v1.5
// @namespace    https://www.facebook.com/airlife917339
// @version      1.5
// @description  feel free to donate: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @match        https://wootalk.today/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377004/Wootalk%20%E8%87%AA%E5%8B%95%E8%BC%94%E5%8A%A9%E8%85%B3%E6%9C%AC%20v15.user.js
// @updateURL https://update.greasyfork.org/scripts/377004/Wootalk%20%E8%87%AA%E5%8B%95%E8%BC%94%E5%8A%A9%E8%85%B3%E6%9C%AC%20v15.meta.js
// ==/UserScript==

var auto_restart = 1        // 1=啟用自動開始, 0=關閉
var auto_reply = 1          // 1=啟用自動回復, 0=關閉
var auto_leave = 1          // 1=啟用自動離開, 0=關閉
var enable_expansion = 1    // 1=啟用自動離開, 0=關閉

var status_check;
var form;                   // 聊天訊息讀取
var n;
var warning_msg;            // 離開訊息判斷
var leave_num = 0;          // 離開人數
var cur_mid = -1;           // 對方當前訊息編號, 由0開始
var stranger_arr;           // 對方聊天訊息讀取
var mid;                    // 對方最新訊息編號
var e;
var row;                    // 第幾行
var str_msg;
var talk = 0;
var tmr_msg = '';           // 暫存訊息

var msg_array = [
    // 表明自己是男生
    '不是女生',
    '男',
    '南',
    '嗨男',
    '男生',
    '男兒',
    '男子',
    'boy',
    'Boy',
    'MAN',
    'Man',
    'man',
    '男性',
    '男人',
    '男孩',
    '男喔',
    '男哦',
    '男生喔',
    '是男',
    '是男的',
    '男♂',
    '男的',
    '我男',
    '我男的',
    '我男生',
    '我是男生',
    '我男的哦',
    '我是男生',
    '我是男生~',
    '我是男生喔',
    '男唷',
    '人魚線男孩',
    '女男',
    '三十熟男',

    // 身高男
    '190男找聊天',
    '181男',
    '179/71約女',

    // 打招呼男
    '早我男',
    '早哦男',
    '哈囉我男生',
    '哈囉早安我是男生',
    '你好男生',
    '男的請多多指教',
    '嗨我男',
    '你好我男哦',
    '嗨我男生',
    'Hi男',
    '嗨我是男生喔',
    'hi我男的噢',
    '嗨我男生妳呢',
    '嗨男生喔可以讓我為妳做什麼服務嗎😉',
    '嗨找女',
    '你好男',

    // 地區男
    // 北
    '台北男',
    '台北男喔',
    '台北大叔找女孩',
    '嗨台北男18273',
    '新北男',
    '新北熟男',
    '板橋男21',
    '嗨我是新北25歲男生',
    '桃園男',
    '桃園二男等一女',
    '21桃園男',
    '新竹男',
    '新竹男',
    '新竹男24找色女約',
    '嗨內壢找女',
    // 中
    '台中男',
    '台中24男',
    '彰化男',
    '雲林男',
    '嘉義男',
    '南投男',
    '彰化男生',
    // 南
    '台南男',
    '哈囉臺南男生21y',
    '高雄男',
    '高雄男約',
    'HIHI高雄男大生22Y',
    '屏東男',
    '嗨屏東男35',
    // 東
    '花蓮男',
    '宜蘭男',

    // 找女系列
    '找女',
    '找女孩',
    '找妹子',
    '找色女',
    '找奶妹💖',
    '找姐姐',
    '找淫女',
    '找色妹妹',
    '找肉肉女',
    '找女伴',
    '找母狗',
    '找壞姊姊',
    '找女炮友',
    '找女圖愛',
    '找dcard妹妹',
    '找新北女',
    '找女微信聊色',
    '找騷女入微信色群😈😈',
    '找妹看我視訊尻肉棒',
    '找色女視訊互看❤',
    '找女圖愛視訊',
    '尋找發情的小騷貨',
    '誠徵色女❤️',
    '誠徵色女❤️❤️',
    '尋找還沒睡的流浪貓',
    'Hi找色妞文愛',
    '找女文愛或圖愛',
    '找台中慾女',

    // 問女系列
    '女？',
    '女?',
    '女嗎',
    '女嗎',
    '女嘛',
    '女孩嗎',
    '嗨女孩嗎',
    '女生嗎',
    '色女孩嗎',
    '色女嗎',
    '大奶妹嗎',
    '嗨色女嗎',
    '是姐姐嗎😏',

    // 許願男
    '刷個高雄女孩兒',
    '來個女孩兒吧',
    '沒女生了啊',
    '希望妳是女孩',
    '有沒有一大早就想壞壞的女孩',
    '有新北女想約的嗎',
    '有高雄女生想聊色嗎',
    '想被姐姐玩',

    //約炮男
    '要棒棒嗎',
    '大屌',
    '17cm棒棒糖',
    '晨炮',
    '找女約炮',
    '小穴濕了嗎',
    '打炮嗎',
    '有棒棒',
    '想吃肉棒嗎？',
    '男178性慾強聊色圖愛',
    '尋找色女孩🌶',
    '聊色不約男',
    '18歲鮮肉有轎車有事業找姐姐調教',
    '台中有欠教訓的小騷貨嗎😈',
    '平常最喜歡什麼姿勢呢？',
    'hi男，找想刺激的熟女、少婦、女老師、女主管、女醫師、女警或女檢等高反差職業聊職場上的黑暗面淫色慾望。',

    // 髒話男
    '艸',
    '幹',
    '幹',
    '滾',
    '幹您娘',
];

chat_expansion();   //  載入擴充功能

function check_status() {
    /**
     * check_status(狀態檢查): 0=開始頁面, 1=正在聊天, -1=已經離開
     * button_check(檢查按鈕): 0=正在聊天 or 已經離開, 1=開始頁面, ""=開始頁面(剛進入網頁)
     * leave_msg(離開檢查): >=0=已經離開, -1=開始頁面/正在聊天
     */
    var status_check;
    var button_check = document.getElementById("startButton").style.opacity;
    var leave_msg = document.getElementById("messages").innerHTML.indexOf("對方離開了，請按離開按鈕回到首頁");
    if(button_check == "") {        // 開始頁面(剛進入網頁)
        status_check = 0;
    } else if(button_check == 0) {  // 正在聊天 or 已經離開
        if(leave_msg >= 0) {
            status_check = -1;      // 已經離開
        } else {
            status_check = 1;       // 正在聊天
        }
    } else {                        // 開始頁面
        status_check = 0;
    }
    //console.log("status_check: " + status_check);
    return status_check;
}

function check_msg(str, i) {
    str = removeAllSpace(str);
    str = remove_signs(str);
    var result = false;
    switch(i) {
        case 0: // 部分符合
            msg_array.forEach(function(element, index, array) {
                if(str.indexOf(element) >= 0) {
                    result = true;        // 存在
                } else {
                    result = false;       // 不存在
                }
            });
            break;
        case 1: // 完整符合
            if (msg_array.indexOf(str) >= 0) {
                result = true;    // 存在
            } else {
                result = false;    // 不存在
            }
            break;
    }
    return result;
}

function chat_resize() {
    if (enable_expansion == 1) {
        document.getElementById("main").style.height="calc(100% - 90px)";   // 如果要使用新功能的話, 調整大小
    } else {
    }
}

function chat_expansion() {
    if (enable_expansion == 1) {
        // 加入icon css
        var head = document.head;
        var link = document.createElement('link');
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "https://use.fontawesome.com/releases/v5.5.0/css/all.css");
        head.appendChild(link);

        // 增加擴充功能欄位
        var div_expansion = document.createElement('div');
        var div_sendBox = document.getElementById('sendBox');
        div_sendBox.parentNode.insertBefore(div_expansion, div_sendBox);    // 在這個物件前增加
        div_expansion.setAttribute("id",    "chat_expansion");              // 建立id
        div_expansion.setAttribute("style", "height: 40px;");               // 建立id
        div_expansion.innerHTML = "<button><i></i></button><input id=\'upload_file\' type=\'file\' hidden/>";   // 增加按鈕
        var button_expansion = div_expansion.getElementsByTagName("button")[0];
        button_expansion.setAttribute("id",     "btn-upload");
        button_expansion.setAttribute("type",   "button");
        var button_style = "width: 30px;";
        button_style    += "height: 30px;";
        button_style    += "text-align: center;";
        button_style    += "padding: 6px 0;";
        button_style    += "font-size: 12px;";
        button_style    += "line-height: 1.42;";
        button_style    += "border-radius: 15px;";
        button_style    += "margin-top: 5px;";
        button_style    += "margin-bottom: 5px;";
        button_expansion.setAttribute("style", button_style);
        var i_expansion = button_expansion.getElementsByTagName("i")[0];
        i_expansion.setAttribute("class", "fa fa-upload");
        i_expansion.setAttribute("style", "color:#ff0000;");

        document.getElementById('btn-upload').addEventListener('click', upload_click);      // 按鈕被按就執行隱藏的input
        document.getElementById('upload_file').addEventListener('change', imgur_upload);    // 檔案狀態改變就上傳
    } else {
    }
}

function upload_click() {
    document.getElementById('upload_file').click();
}

function imgur_upload() {
    /* Imgur Upload Script */
    var img = document.querySelector('[type=file]');    // 文件元素
    var img_form = new FormData();                      // 通過FormData將文件轉成二進制數據
    img_form.append('image', img.files[0]);             // 將文件轉二進制
    img_form.append('album', 'VsacScx');                // 有要指定的相簿就加這行

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.imgur.com/3/image",                 // 單張上傳
      "method": "POST",
      "headers": {
        //"Authorization": "Client-ID e64098e52eb13d3"
        "Authorization": "Bearer 86d4aa5a967cd0f51c54d8a96e38045dd762614b"  // 效期一個月11/22開始
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": img_form
    }

    $.ajax(settings).done(function (response) {
        //console.log(response);
        settings.list = JSON.parse(response);
        save_sendMessage(settings.list.data.link);                  // 送出訊息
    });
}

function save_sendMessage(str) {                                    // 保存訊息式傳送()
    var tmr_msg = document.getElementById("messageInput").value;    // 暫存輸入框訊息
    document.getElementById("messageInput").value = str;            // 取代輸入框訊息
    setInterval(sendMessage(),3000);                                // 送出訊息
    document.getElementById("messageInput").value = tmr_msg         // 取出暫存訊息
}

function match_leave(str) {
    if(check_msg(str, 1)) {            // 如果符合離開條件
        send_typing();              // 傳送打字中狀態
        //save_sendMessage('滾');
        //save_sendMessage('我都在這邊約炮聯誼, 你呢？ http://www.520cc.cc/forum.php?fromuid=314556');
        setInterval(leave(), 3000);
    }
}

function removeAllSpace(str) {
    return str.replace(/\s+/g, "");
}

function remove_signs(str) {
    return str=str.replace(/[\ |\~|\～|\`|\!|\！|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\，|\<|\.|\。|\>|\/|\?|\？]/g,"");
}

setInterval(function() {
    status_check = check_status();
    switch(status_check) {
        case 0:                         // 0=開始頁面
            clickStartChat();
            break;
        case 1:                         // 1=正在聊天
            chat_resize();              // 載入聊天時調整大小
            stranger_arr = document.querySelectorAll(".stranger.text"); // 讀取對方訊息陣列
            if(stranger_arr != 0) { // 如果對方在線才執行
                e = stranger_arr[stranger_arr.length-1]; // 對方訊息陣列的物件
                mid = parseInt(e.getAttribute('mid')) // 取得對方當前訊息的編號
                if(mid >= cur_mid) {
                    //document.querySelectorAll(".stranger.text")[document.querySelectorAll(".stranger.text").length-1].childNodes[1].textContent
                    row = mid+1;
                    str_msg = e.childNodes[1].textContent;
                    //console.log("陌生人: "+str_msg+"["+row+"]")
                    if(mid <= 4) {                      // 前5行句過濾條件, 如果是男生就直接離開
                        if(check_msg(str_msg, 1)) {        // 如果符合離開條件
                            match_leave(str_msg);
                        } else if (talk == 0) {
                            if( (str_msg == "嗨") || (str_msg == "嗨嗨") ) {
                                send_typing();
                                document.getElementById("messageInput").value =  "嗨";
                                setTimeout("sendMessage()", 800);
                                talk = 1;
                            } else if ( (str_msg == "Hi") || (str_msg == "hi") ) {
                                send_typing();
                                document.getElementById("messageInput").value =  "hi";
                                setTimeout("sendMessage()", 800);
                                talk = 1;
                            } else if ( (str_msg == "早") || (str_msg == "早安") || (str_msg == "早啊") || (str_msg == "早阿") ) {
                                send_typing();
                                document.getElementById("messageInput").value =  "早";
                                setTimeout("sendMessage()", 800);
                                talk = 1;
                            } else if ( (str_msg == "你好") || (str_msg == "妳好") || (str_msg == "你好阿") ) {
                                send_typing();
                                document.getElementById("messageInput").value =  "你好";
                                setTimeout("sendMessage()", 800);
                                talk = 1;
                            }
                        }
                    }
                    send_typing();            // 傳送正在輸入中
                } else {
                }
                cur_mid = mid;
                //console.clear();
                //console.log("陌生人: "+e.childNodes[1].textContent+"["+row+"]")
            }
            break;
        case -1:                    // -1=已經離開
            cur_mid = -1;
            leave_num++;
            //console.log("第"+leave_num+"位離開!");
            leave();
            talk = 0;
            break;
    }
}, 1000);