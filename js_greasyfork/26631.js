// ==UserScript==
// @name          敲起来([日语假名]按照标准键盘布局显示对应位置)
// @description   当你在敲击键盘的时候, 按照标准键盘布局的位置，出现对应键位的动画特效
// @version       0.5.0.3.4
// @author        胡朝旭
// @include       *
// @require       https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @grant         none
// @run-at        document-start
// @namespace         https://greasyfork.org/zh-CN/users/94864-%E8%83%A1%E6%9C%9D%E6%97%AD-rory
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/26631/%E6%95%B2%E8%B5%B7%E6%9D%A5%28%5B%E6%97%A5%E8%AF%AD%E5%81%87%E5%90%8D%5D%E6%8C%89%E7%85%A7%E6%A0%87%E5%87%86%E9%94%AE%E7%9B%98%E5%B8%83%E5%B1%80%E6%98%BE%E7%A4%BA%E5%AF%B9%E5%BA%94%E4%BD%8D%E7%BD%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/26631/%E6%95%B2%E8%B5%B7%E6%9D%A5%28%5B%E6%97%A5%E8%AF%AD%E5%81%87%E5%90%8D%5D%E6%8C%89%E7%85%A7%E6%A0%87%E5%87%86%E9%94%AE%E7%9B%98%E5%B8%83%E5%B1%80%E6%98%BE%E7%A4%BA%E5%AF%B9%E5%BA%94%E4%BD%8D%E7%BD%AE%29.meta.js
// ==/UserScript==

(function ($) {
    let cursor = {
        x: 0,
        y: 0
    };
    let bianju=40;jianju=20;KMMap="";
    //小于30可能因为字体不能再变小而造成排版混乱

    let keyboardMap = [
        //键位，x坐标，y坐标，高比例，宽比例
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["CANCEL",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["HELP",0,1,1,1],
        ["",0,1,1,1],
        ["BACK SPACE",5.5,0,1,2],
        ["TAB↹",-7.5,1,1,1.5],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["CLEAR",0,1,1,1],
        ["↲Enter",5.5,2,1,2],
        ["ENTER SPECIAL",0,1,1,1],
        ["",0,1,1,1],
        ["⇑Shft",-7.5,3,1,2],
        ["Ctrl",-7.5,4,1,1],
        ["Alt",-5,4,1,1],
        ["PAUSE",0,1,1,1],
        ["大/小 写",-7.5,2,1,1.8],
        ["KANA",0,1,1,1],
        ["EISU",0,1,1,1],
        ["JUNJA",0,1,1,1],
        ["FINAL",0,1,1,1],
        ["HANJA",0,1,1,1],
        ["",0,1,1,1],
        ["Esc",-8.5,0,1,1],
        ["CONVERT",0,1,1,1],
        ["NONCONVERT",0,1,1,1],
        ["ACCEPT",0,1,1,1],
        ["MODECHANGE",0,1,1,1],
        ["空格",-3.5,4,1,5.5],
        ["PAGE UP",10.5,0,1,1],
        ["PAGE DOWN",10.5,1,1,1],
        ["END",9.5,1,1,1],
        ["HOME",9.5,0,1,1],
        ["左",8.5,4,1,1],
        ["上",9.5,3,1,1],
        ["右",10.5,4,1,1],
        ["下",9.5,4,1,1],
        ["SELECT",0,1,1,1],
        ["PRINT",0,1,1,1],
        ["EXECUTE",0,1,1,1],
        ["PRINTSCREEN",0,1,1,1],
        ["INSERT",8.5,0,1,1],
        ["DELETE",8.5,1,1,1],
        ["",0,1,1,1],
        ["ｦ を ﾜ わ",2.5,0,1,1],
        ["ﾇ ぬ",-6.5,0,1,1],
        ["ﾌ ふ",-5.5,0,1,1],
        ["あ ｱ あ",-4.5,0,1,1],
        ["う ｳ う",-3.5,0,1,1],
        ["え ｴ え",-2.5,0,1,1],
        ["お ｵ お",-1.5,0,1,1],
        ["や ﾔ や",-0.5,0,1,1],
        ["ゆ ﾕ ゆ",0.5,0,1,1],
        ["よ ﾖ よ",1.5,0,1,1],
        ["COLON",0,1,1,1],
        ["SEMICOLON",0,1,1,1],
        ["LESS THAN",0,1,1,1],
        ["EQUALS",0,1,1,1],
        ["GREATER THAN",0,1,1,1],
        ["QUESTION MARK",0,1,1,1],
        ["AT",0,1,1,1],
        ["ﾁ ち",-5.7,2,1,1],
        ["ｺ こ",-1,3,1,1],
        ["ｿ そ",-3,3,1,1],
        ["ｼ し",-3.7,2,1,1],
        ["ｲ い",-4,1,1,1],
        ["ﾊ は",-2.7,2,1,1],
        ["ｷ き",-1.7,2,1,1],
        ["ｸ く",-0.7,2,1,1],
        ["ﾆ に",1,1,1,1],
        ["ﾏ ま",0.3,2,1,1],
        ["ﾉ の",1.3,2,1,1],
        ["ﾘ り",2.3,2,1,1],
        ["ﾓ も",1,3,1,1],
        ["ﾐ み",0,3,1,1],
        ["ﾗ ら",2,1,1,1],
        ["ｾ せ",3,1,1,1],
        ["ﾀ た",-6,1,1,1],
        ["ｽ す",-3,1,1,1],
        ["ﾄ と",-4.7,2,1,1],
        ["ｶ か",-2,1,1,1],
        ["ﾅ な",0,1,1,1],
        ["ﾋ ひ",-2,3,1,1],
        ["ﾃ て",-5,1,1,1],
        ["ｻ さ",-4,3,1,1],
        ["ﾝ ん",-1,1,1,1],
        ["ﾂ つ",-5,3,1,1],
        ["OS KEY",-6,4,1,1],
        ["",0,1,1,1],
        ["CONTEXT MENU",0,1,1,1],
        ["",0,1,1,1],
        ["SLEEP",0,1,1,1],
        ["NUM 0",12.5,4,1,2],
        ["NUM 1",12.5,3,1,1],
        ["NUM 2",13.5,3,1,1],
        ["NUM 3",14.5,3,1,1],
        ["NUM 4",12.5,2,1,1],
        ["NUM 5",13.5,2,1,1],
        ["NUM 6",14.5,2,1,1],
        ["NUM 7",12.5,1,1,1],
        ["NUM 8",13.5,1,1,1],
        ["NUM 9",14.5,1,1,1],
        ["×",14.5,0,1,1],
        ["+",15.5,1,2,1],
        ["SEPARATOR",0,1,1,1],
        ["-",15.5,0,1,1],
        [".",14.5,4,1,1],
        ["÷",13.5,0,1,1],
        ["F1",-10,1,1,1],
        ["F2",-9,1,1,1],
        ["F3",-8,1,1,1],
        ["F4",-7,1,1,1],
        ["F5",-5.5,1,1,1],
        ["F6",-4.5,1,1,1],
        ["F7",-3.5,1,1,1],
        ["F8",-1,1,1,1],
        ["F9",-1,1,1,1],
        ["F10",0,1,1,1],
        ["F11",4.5,0,1,1],
        ["F12",5.5,0,1,1],
        ["F13",0,1,1,1],
        ["F14",0,1,1,1],
        ["F15",0,1,1,1],
        ["F16",0,1,1,1],
        ["F17",0,1,1,1],
        ["F18",0,1,1,1],
        ["F19",0,1,1,1],
        ["F20",0,1,1,1],
        ["F21",0,1,1,1],
        ["F22",0,1,1,1],
        ["F23",0,1,1,1],
        ["F24",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["NUM LOCK",12.5,0,1,1],
        ["SCROLL LOCK",0,1,1,1],
        ["WIN OEM FJ JISHO",0,1,1,1],
        ["WIN OEM FJ MASSHOU",0,1,1,1],
        ["WIN OEM FJ TOUROKU",0,1,1,1],
        ["WIN OEM FJ LOYA",0,1,1,1],
        ["WIN OEM FJ ROYA",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["CIRCUMFLEX",0,1,1,1],
        ["EXCLAMATION",0,1,1,1],
        ["DOUBLE QUOTE",0,1,1,1],
        ["HASH",0,1,1,1],
        ["DOLLAR",0,1,1,1],
        ["PERCENT",0,1,1,1],
        ["AMPERSAND",0,1,1,1],
        ["UNDERSCORE",0,1,1,1],
        ["OPEN PAREN",0,1,1,1],
        ["CLOSE PAREN",0,1,1,1],
        ["ASTERISK",0,1,1,1],
        ["PLUS",0,1,1,1],
        ["PIPE",0,1,1,1],
        ["HYPHEN MINUS",0,1,1,1],
        ["OPEN CURLY BRACKET",0,1,1,1],
        ["CLOSE CURLY BRACKET",0,1,1,1],
        ["TILDE",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["VOLUME MUTE",0,1,1,1],
        ["VOLUME DOWN",0,1,1,1],
        ["VOLUME UP",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["ﾚ れ",3.3,2,1,1],
        ["ﾍ へ",4.5,0,1,1],
        ["、 ﾈ ね",2,3,1,1],
        ["ﾎ ほ",3.5,0,1,1],
        ["ｩ る。",3,3,1,1],
        ["・ ﾒ め",4,3,1,1],
        ["ﾛ ろ",-7.5,0,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["゛",4,1,1,1],
        ["ﾑ む",6,1,1,1.5],
        ["゜",5,1,1,1],
        ["ｹ け",4.3,2,1,1],
        ["",0,1,1,1],
        ["META",0,1,1,1],
        ["ALTGR",0,1,1,1],
        ["",0,1,1,1],
        ["WIN ICO HELP",0,1,1,1],
        ["WIN ICO 00",0,1,1,1],
        ["",0,1,1,1],
        ["WIN ICO CLEAR",0,1,1,1],
        ["",0,1,1,1],
        ["",0,1,1,1],
        ["WIN OEM RESET",0,1,1,1],
        ["WIN OEM JUMP",0,1,1,1],
        ["WIN OEM PA1",0,1,1,1],
        ["WIN OEM PA2",0,1,1,1],
        ["WIN OEM PA3",0,1,1,1],
        ["WIN OEM WSCTRL",0,1,1,1],
        ["WIN OEM CUSEL",0,1,1,1],
        ["WIN OEM ATTN",0,1,1,1],
        ["WIN OEM FINISH",0,1,1,1],
        ["WIN OEM COPY",0,1,1,1],
        ["WIN OEM AUTO",0,1,1,1],
        ["WIN OEM ENLW",0,1,1,1],
        ["WIN OEM BACKTAB",0,1,1,1],
        ["ATTN",0,1,1,1],
        ["CRSEL",0,1,1,1],
        ["EXSEL",0,1,1,1],
        ["EREOF",0,1,1,1],
        ["PLAY",0,1,1,1],
        ["ZOOM",0,1,1,1],
        ["",0,1,1,1],
        ["PA1",0,1,1,1],
        ["WIN OEM CLEAR",0,1,1,1],
        ["",0,1,1,1]
    ];

    let mouseMap = [
        ["左键",-1.5,-1,1],
        ["中键",-0.5,-1,1],
        ["右键",0.5,-1,1,1]
    ];

    function createEle() {
        let $span = $(`<span>${KMMap[0]}</span>`)
        .css({

            textAlign:"center",
            position: "absolute",
            zIndex: 999999999,
            top: cursor.y+KMMap[2]*(bianju+jianju),
            left: cursor.x+KMMap[1]*(bianju+jianju)+jianju/2-5,
            fontSize:"large",
            texttransform: "uppercase",
            textshadow: "red 5 5px 5",
            height:bianju*KMMap[3],
            width:bianju*KMMap[4],
            fontWeight:"bold",
            fontFamily:"microsoft yahei",
            color: "#"+ ("00000"+ (Math.random() * 0x1000000 << 0).toString(16)).substr(-6),
            //黑色按键
            //backgroundColor: "#070707",
            //border: "outset 5px #777",
            //textShadow: "2px 1px 2px #ddd",
            //白色按键
            backgroundColor: "#fcfcfc",
            border: "outset 5px #ccc",
            textShadow: "2px 2px 2px #000",

            borderRadius: "5px",
        }).appendTo(document.body);
        setTimeout(function () {
            $span.animate({
                opacity: 0,
                top: "-="+bianju/2
            }, 1500, function () {
                $span.remove();
                $span = null;
            })
        }, 700);
    }


    // 获取鼠标坐标
    $(window).on('mousemove', function (event) {
        event = event || window.event;
        cursor.x = event.pageX;
        cursor.y = event.pageY;
    });
    //键盘按键
    $(window).on('keyup', function (event) {
        KMMap=keyboardMap[event.keyCode];
        createEle();
    });


    //鼠标按键
    $(window).mousedown(function (event) {
        KMMap=mouseMap[event.which-1];
        createEle();
    });

})(window.jQuery.noConflict(true));