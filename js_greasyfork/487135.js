

    // ==UserScript==
    // @name         Super Script
    // @namespace    http://tampermonkey.net/
    // @version      5.9
    // @description  A nice script for agma!
    // @author       Mhero, Dontriskityt, and samira
    // @match        https://agma.io/*
    // @match        https://cellcraft.io/*
    // @match        http://flowgame.io/*
    // @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487135/Super%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/487135/Super%20Script.meta.js
    // ==/UserScript==
    //fastsplit currently
    'esversion: 6';
    (function() {
        'use strict';

        var startMouseButton = null

        var startKeyCode = 17;
        var combine = true;

        console.log('Super script started');

        /**
         * Returns a random number between min (inclusive) and max (exclusive)
         * Source: MDN
         */
        var getRandomArbitrary = function(min, max) {
            return Math.random() * (max - min) + min;
        }

        var chatAnimate = function()
        {
            // The available commands
            var items = ['spin', 'flip', 'shake', 'jump'];

            // Choose randomly an item of the items array
            // Source: https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
            var item = items[Math.floor(Math.random()*items.length)];

            if (combine) {
                item = 'wacky' + item;
            }

            // Add text into the chatbox and focus it
            $('#chtbox').val('/' + item).focus();

            // Stop the event so that the pressed key won't be written into the chatbox!
            event.preventDefault();
        }

        window.addEventListener('mousedown', function(event)
        {
            if (event.button == startMouseButton) {
                chatAnimate();
            }
        });
        window.addEventListener('keydown', function(event)
        {
            if (event.keyCode == startKeyCode && ! event.shiftKey) {
                chatAnimate();
            }
        });
    var key = "=" // Normal
    var key2 = "T" // Double
    var key3 = "Q" // switch powers
    var key4 = "U" // triple
    var key5 = "Q" // hover

    var doubleSplitKey
    var freezeKey
    var letters = ['a','b','c','d','e','f','g', 'h', 'i', 'j', 'k', 'l', 'm','n','o','p','q','r','s','t','u','v','w','x','y','z']

    window.addEventListener('keydown', keydown);

    setTimeout(function() {
        key = key.charCodeAt(0)
        key2 = key2.charCodeAt(0)
        key4 = key4.charCodeAt(0)
        key5 = key5.charCodeAt(0)


        doubleSplitKey = document.getElementById("keyDoubleSplit").innerHTML.charCodeAt(0)
        freezeKey = document.getElementById("keyFreezeSelf").innerHTML.charCodeAt(0)
        console.log("Fastsplit Script active.")
    }, 5000)

    function oneSplit() {
        $("#canvas").trigger($.Event("keydown", { keyCode: 32}));
        $("#canvas").trigger($.Event("keyup", { keyCode: 32}));
    }

    function doubleSplit() {
        $("#canvas").trigger($.Event("keydown", { keyCode: doubleSplitKey}));
        $("#canvas").trigger($.Event("keyup", { keyCode: doubleSplitKey}));

    }
        function tripleSplit(){
        $("#canvas").trigger($.Event("keydown", { keyCode: 86}));
        $("#canvas").trigger($.Event("keyup", { keyCode: 86}));
    }

    function freeze() {
        $("#canvas").trigger($.Event("keydown", { keyCode: freezeKey}));
        $("#canvas").trigger($.Event("keyup", { keyCode: freezeKey}));
    }





    function keydown(event) {
        if (document.activeElement.type == 'text' || document.activeElement.type == 'password') {
            return;
        }
        if (event.keyCode == key) {
            oneSplit()
            setTimeout(freeze, 0)
            setTimeout(freeze, 50)

        }
        if (event.keyCode == key2) {
            doubleSplit()
            setTimeout(freeze, 45)
            setTimeout(freeze, 115)

        }
        if(event.keyCode == key4){
            tripleSplit()
            setTimeout(freeze, 130)
            setTimeout(freeze, 190)
        }
        if(event.keyCode == key5){
            setTimeout(freeze, 0)
            setTimeout(freeze, 70)
        }
        if(event.keyCode == key3){

        tripleSplit();
    }

        if(event.keyCode == 190){
        document.getElementById("cBubbleCells").dispatchEvent(new MouseEvent("click"));
        }
        if(event.keyCode == 188){
        document.getElementById('cVideoAds').dispatchEvent(new MouseEvent('click'))
    }



    }
        let $ = window.$;
        let random = window.random;


        const KEY_TABLE = { 0: "", 8: "BACKSPACE", 9: "TAB", 12: "CLEAR", 13: "ENTER", 16: "SHIFT", 17: "CTRL", 18: "ALT", 19: "PAUSE", 20: "CAPSLOCK", 27: "ESC", 32: "SPACE", 33: "PAGEUP", 34: "PAGEDOWN", 35: "END", 36: "HOME", 37: "LEFT", 38: "UP", 39: "RIGHT", 40: "DOWN", 44: "PRTSCN", 45: "INS", 46: "DEL", 65: "A", 66: "B", 67: "C", 68: "D", 69: "E", 70: "F", 71: "G", 72: "H", 73: "I", 74: "J", 75: "K", 76: "L", 77: "M", 78: "N", 79: "O", 80: "P", 81: "Q", 82: "R", 83: "S", 84: "T", 85: "U", 86: "V", 87: "W", 88: "X", 89: "Y", 90: "Z", 91: "WIN", 92: "WIN", 93: "CONTEXTMENU", 96: "NUM 0", 97: "NUM 1", 98: "NUM 2", 99: "NUM 3", 100: "NUM 4", 101: "NUM 5", 102: "NUM 6", 103: "NUM 7", 104: "NUM 8", 105: "NUM 9", 106: "NUM *", 107: "NUM +", 109: "NUM -", 110: "NUM .", 111: "NUM /", 144: "NUMLOCK", 145: "SCROLLLOCK" };





    // names of known key codes (0-255)

    var keyboardMap = [
      "", // [0]
      "", // [1]
      "", // [2]
      "CANCEL", // [3]
      "", // [4]
      "", // [5]
      "HELP", // [6]
      "", // [7]
      "BACK_SPACE", // [8]
      "TAB", // [9]
      "", // [10]
      "", // [11]
      "CLEAR", // [12]
      "ENTER", // [13]
      "ENTER_SPECIAL", // [14]
      "", // [15]
      "SHIFT", // [16]
      "CONTROL", // [17]
      "ALT", // [18]
      "PAUSE", // [19]
      "CAPS_LOCK", // [20]
      "KANA", // [21]
      "EISU", // [22]
      "JUNJA", // [23]
      "FINAL", // [24]
      "HANJA", // [25]
      "", // [26]
      "ESCAPE", // [27]
      "CONVERT", // [28]
      "NONCONVERT", // [29]
      "ACCEPT", // [30]
      "MODECHANGE", // [31]
      "SPACE", // [32]
      "PAGE_UP", // [33]
      "PAGE_DOWN", // [34]
      "END", // [35]
      "HOME", // [36]
      "LEFT", // [37]
      "UP", // [38]
      "RIGHT", // [39]
      "DOWN", // [40]
      "SELECT", // [41]
      "PRINT", // [42]
      "EXECUTE", // [43]
      "PRINTSCREEN", // [44]
      "INSERT", // [45]
      "DELETE", // [46]
      "", // [47]
      "0", // [48]
      "1", // [49]
      "2", // [50]
      "3", // [51]
      "4", // [52]
      "5", // [53]
      "6", // [54]
      "7", // [55]
      "8", // [56]
      "9", // [57]
      "COLON", // [58]
      "SEMICOLON", // [59]
      "LESS_THAN", // [60]
      "EQUALS", // [61]
      "GREATER_THAN", // [62]
      "QUESTION_MARK", // [63]
      "AT", // [64]
      "A", // [65]
      "B", // [66]
      "C", // [67]
      "D", // [68]
      "E", // [69]
      "F", // [70]
      "G", // [71]
      "H", // [72]
      "I", // [73]
      "J", // [74]
      "K", // [75]
      "L", // [76]
      "M", // [77]
      "N", // [78]
      "O", // [79]
      "P", // [80]
      "Q", // [81]
      "R", // [82]
      "S", // [83]
      "T", // [84]
      "U", // [85]
      "V", // [86]
      "W", // [87]
      "X", // [88]
      "Y", // [89]
      "Z", // [90]
      "OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
      "", // [92]
      "CONTEXT_MENU", // [93]
      "", // [94]
      "SLEEP", // [95]
      "NUMPAD0", // [96]
      "NUMPAD1", // [97]
      "NUMPAD2", // [98]
      "NUMPAD3", // [99]
      "NUMPAD4", // [100]
      "NUMPAD5", // [101]
      "NUMPAD6", // [102]
      "NUMPAD7", // [103]
      "NUMPAD8", // [104]
      "NUMPAD9", // [105]
      "MULTIPLY", // [106]
      "ADD", // [107]
      "SEPARATOR", // [108]
      "SUBTRACT", // [109]
      "DECIMAL", // [110]
      "DIVIDE", // [111]
      "F1", // [112]
      "F2", // [113]
      "F3", // [114]
      "F4", // [115]
      "F5", // [116]
      "F6", // [117]
      "F7", // [118]
      "F8", // [119]
      "F9", // [120]
      "F10", // [121]
      "F11", // [122]
      "F12", // [123]
      "F13", // [124]
      "F14", // [125]
      "F15", // [126]
      "F16", // [127]
      "F17", // [128]
      "F18", // [129]
      "F19", // [130]
      "F20", // [131]
      "F21", // [132]
      "F22", // [133]
      "F23", // [134]
      "F24", // [135]
      "", // [136]
      "", // [137]
      "", // [138]
      "", // [139]
      "", // [140]
      "", // [141]
      "", // [142]
      "", // [143]
      "NUM_LOCK", // [144]
      "SCROLL_LOCK", // [145]
      "WIN_OEM_FJ_JISHO", // [146]
      "WIN_OEM_FJ_MASSHOU", // [147]
      "WIN_OEM_FJ_TOUROKU", // [148]
      "WIN_OEM_FJ_LOYA", // [149]
      "WIN_OEM_FJ_ROYA", // [150]
      "", // [151]
      "", // [152]
      "", // [153]
      "", // [154]
      "", // [155]
      "", // [156]
      "", // [157]
      "", // [158]
      "", // [159]
      "CIRCUMFLEX", // [160]
      "EXCLAMATION", // [161]
      "DOUBLE_QUOTE", // [162]
      "HASH", // [163]
      "DOLLAR", // [164]
      "PERCENT", // [165]
      "AMPERSAND", // [166]
      "UNDERSCORE", // [167]
      "OPEN_PAREN", // [168]
      "CLOSE_PAREN", // [169]
      "ASTERISK", // [170]
      "PLUS", // [171]
      "PIPE", // [172]
      "HYPHEN_MINUS", // [173]
      "OPEN_CURLY_BRACKET", // [174]
      "CLOSE_CURLY_BRACKET", // [175]
      "TILDE", // [176]
      "", // [177]
      "", // [178]
      "", // [179]
      "", // [180]
      "VOLUME_MUTE", // [181]
      "VOLUME_DOWN", // [182]
      "VOLUME_UP", // [183]
      "", // [184]
      "", // [185]
      "SEMICOLON", // [186]
      "EQUALS", // [187]
      "COMMA", // [188]
      "MINUS", // [189]
      "PERIOD", // [190]
      "SLASH", // [191]
      "BACK_QUOTE", // [192]
      "", // [193]
      "", // [194]
      "", // [195]
      "", // [196]
      "", // [197]
      "", // [198]
      "", // [199]
      "", // [200]
      "", // [201]
      "", // [202]
      "", // [203]
      "", // [204]
      "", // [205]
      "", // [206]
      "", // [207]
      "", // [208]
      "", // [209]
      "", // [210]
      "", // [211]
      "", // [212]
      "", // [213]
      "", // [214]
      "", // [215]
      "", // [216]
      "", // [217]
      "", // [218]
      "OPEN_BRACKET", // [219]
      "BACK_SLASH", // [220]
      "CLOSE_BRACKET", // [221]
      "QUOTE", // [222]
      "", // [223]
      "META", // [224]
      "ALTGR", // [225]
      "", // [226]
      "WIN_ICO_HELP", // [227]
      "WIN_ICO_00", // [228]
      "", // [229]
      "WIN_ICO_CLEAR", // [230]
      "", // [231]
      "", // [232]
      "WIN_OEM_RESET", // [233]
      "WIN_OEM_JUMP", // [234]
      "WIN_OEM_PA1", // [235]
      "WIN_OEM_PA2", // [236]
      "WIN_OEM_PA3", // [237]
      "WIN_OEM_WSCTRL", // [238]
      "WIN_OEM_CUSEL", // [239]
      "WIN_OEM_ATTN", // [240]
      "WIN_OEM_FINISH", // [241]
      "WIN_OEM_COPY", // [242]
      "WIN_OEM_AUTO", // [243]
      "WIN_OEM_ENLW", // [244]
      "WIN_OEM_BACKTAB", // [245]
      "ATTN", // [246]
      "CRSEL", // [247]
      "EXSEL", // [248]
      "EREOF", // [249]
      "PLAY", // [250]
      "ZOOM", // [251]
      "", // [252]
      "PA1", // [253]
      "WIN_OEM_CLEAR", // [254]
      "" // [255]
    ];


        function settingsButton(num) {
      this.createButton = function(){
        $('button').push(num)
      }

    };
        let client = function(div){
            div.innerHTML=`
            <html>
            <head>
            </head
            <body>
            <ul>
            <li>agma.io</li>
            <li>browser</li>
            </ul>
            </body
            </html>
            `;
        };

        if ('button' < settingsButton) {
      var button = document.createElement('div').innerHTML=`<div><button>👩🏻‍🚒</button></div>`.setAttr(client(() =>{
    switch(client){
        case 1:
            setTimeout(settingsButton, 1000/5)
            break;
        case 2:
            setTimeout(settingsButton, 1500/7.5);
            break;
            default:
            setTimeout(settingsButton, 2000/15);
            break;
    }

      }));
    }







    function unclick(){
        $('click').splice('click')
    }


    function createSourceOfPowers(){
        $('body').trigger($.Event('keydown', {keyCode: 80}))
        $('body').trigger($.Event('keyup', {keyCode: 80}))
    }
    window.icon = {
        draw: function(){
            var image = CanvasRenderingContext2D.drawImage(' ');
            image += document.innerHTML = "<button onclick='change()'>📢</button>"
            if(image[0] < image.charCodeAt(5)) image[2] = image.CanvasRenderingContext2D.drawImage(image[5]);

        },
        placeAt: function(pos){
            this.pos = pos;
            pos = new Position(image, gssd984jklfjgsopqei);
            pos += image;
        }
    }






    })();

