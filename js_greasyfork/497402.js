// ==UserScript==
// @name         抖音直播辅助
// @namespace    Stuar
// @version      1.1
// @license      MIT
// @description  自动获取直播间发言，并读出来
// @author       St
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://code.jquery.com/ui/1.13.3/jquery-ui.min.js
// @match        https://live.douyin.com/*
// @match        https://*/*
// @icon         https://www.douyin.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/497402/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/497402/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    $(document).ready(function() {
        /*********外观************/
        $("head").append("<link>");var css = $("head").children(":last");css.attr({
            rel:  "stylesheet",
            type: "text/css",
            href: "https://code.jquery.com/ui/1.13.3/themes/base/jquery-ui.css"
        });
        let intervalId;
        let sum=0;
        let lasttext;
        let text_i=0;
        let ystext = "<div id='main_x' class='toggler' style='display: none;'>双击(显示/隐藏)\
<label for='checkbox-4'>推理</label>\
<input type='checkbox' name='checkbox-4' id='checkbox-4' class='input'>\
<div id='tldiv' style='display: none;'>\
<input id='save' class='ui-button ui-widget ui-corner-all' type='submit' value='保存位置' >\
<label for='checkbox-5''>字体颜色\
<input type='checkbox' name='checkbox-5' id='checkbox-5' class='input'></label>\
</div>\
<div id='body_x' style='display: none;'>\
<fieldset>\
<legend>字幕功能</legend>\
<label for='checkbox-1'>隐藏界面</label>\
<input type='checkbox' name='checkbox-1' id='checkbox-1' class='input'>\
<label for='checkbox-2'>获取聊天</label>\
<input type='checkbox' name='checkbox-2' id='checkbox-2' class='input'>\
<label for='checkbox-3'>语音播报</label>\
<input type='checkbox' name='checkbox-3' id='checkbox-3' class='input'>\
</fieldset>\
<div id='div'>\
<button id='btn'>阅读</button>\
<input type='text' id='text'  style='width: 30vh;' value='测试一下'></input>\
<span id='sp'></span>\
</div>\
<div>\
<select id='speech_voices'></select>\
<label for='rate'>语速:(1-30,10为正常语速)</label>\
<input type='text' id='rate' readonly='' style='border:0; color:#f6931f; font-weight:bold;'>\
<div id='slider-rate' style='width: auto;'>\
</div>\
<label for='pitch'>音高:</label>\
<input type='text' id='pitch' readonly='' style='border:0; color:#f6931f; font-weight:bold;'>\
<div id='slider-pitch' style='width: auto;'></div>\
<div id='mx'>\
<p id='lang'></p>\
<p id='name'></p>\
<p id='voiceURI'></p>\
</div>\
<div>\
</div>\
</div></div></div>\
<div id='tuilihead' class='tuilihead'><div id='tuili' class='tuili'></div></div>";
        $("body").prepend(ystext);
        $("#main_x").dblclick(function(event){
            if (event.target === this){
                $("#body_x").toggle();
            }
        });
        $("#main_x").css({"z-index":999,"font-size":"12px","width":"300px","height":"35px","background-color": "rgb(230, 230, 230,50%)","color":"#000","top":"10%","right":"15%","text-align": "left","position": "absolute"});
        $("#tldiv").css({"margin-top":"1.2vh"});
        $("#checkbox-4,checkbox-5").css({"height":"25px"});
        $("#body_x").css({"margin-top":"1.2vh","width":"400px","background-color":"#eee"});
        $("#div").css({"z-index":999});
        $("#speech_voices").css({"z-index":999});
        $("#tuilihead").css({"z-index":998,"position": "absolute","height":"2vh","display":"none","background-color":"rgba(255, 255, 0, 0.8)"});
        $("#tuili").css({"background-color":"rgba(255, 255, 255, 10%)","margin-top":"2vh","color":"#fff","flex-grow":"1"});
        GM_addStyle('#tuilihead {top: '+ GM_getValue("tl_top", "243") + 'px;left: '+ GM_getValue("tl_left", "243") + 'px;}');
        GM_addStyle('#tuili { width:'+GM_getValue("tuili_width","354")+'px;height:'+GM_getValue("tuili_width","354")+'px;}');
        $( "#main_x" ).draggable();
        $( "#main_x" ).toggle();

        $( "#body_x" ).resizable({
            maxHeight: 500,
            maxWidth: 700,
            minHeight: 200,
            minWidth: 350
        });
        $( "#tuilihead" ).draggable();
        let startX = 0;
        let endX = 0;
        let startY = 0;
        let endY = 0;
        let longPressTimer;
        // 触摸开始
        $("#main_x").on('touchstart', function(e){
            startX = e.targetTouches[0].pageX;
            startY = e.targetTouches[0].pageY;
            endX = 0;
            endY = 0;
        });
        // 触摸移动
        $("#main_x").on('touchmove', function(e){
            // 处理触摸移动的代码
            endX = e.targetTouches[0].pageX;
            endY = e.targetTouches[0].pageY;
        });
        // 触摸结束
        $("#main_x").on('touchend', function(e){
            // 处理触摸结束的代码
            if (event.target === this){
                if(endX>0){
                    let moveX = Math.max(endX-startX+$(this).offset().left,0);
                    let moveY = Math.max(endY-startY+$(this).offset().top,0);
                    if(moveX>=0){
                        $(this).css({
                            "left":moveX
                        });
                    }
                    if(moveY>=0){
                        $(this).css({
                            "top":moveY
                        });
                    }
                }
                if(longPressTimer == null && longPressTimer == undefined){
                    longPressTimer = setTimeout(function() {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                    },300);
                }else{
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                    $("#body_x").toggle();
                }
            }
        });

        // 触摸取消（可能由于系统中断或者触摸点变得不准确）
        $("#main_x").on('touchcancel', function(e){
            // 处理触摸取消的代码
            console.log('Touch cancelled');
        });


        $('#speech_voices').empty();
        let tts_Voices;
        setSpeech().then((voices) => {
            tts_Voices = voices;
            //console.log(tts_Voices);
            var i = 0;
            tts_Voices.forEach(function (element, index) {
                if ((element.lang).substring(0, 2) === "zh") {
                    $('#speech_voices').append($('<option></option>')
                                               .val(index)
                                               .text(index + "_" + element.lang)
                                              );
                }
            });
            $('#speech_voices option:eq(3)').prop('selected', true).trigger("change");
        });

        $(".input").checkboxradio({
            icon: false
        });
        $("#checkbox-1").on("change", function() {
            let hide = $(".sysj44K0,#island_da635,.khbqOfnm,.i4p_LDeX,.QCAc0UCH,.NeYeh54v,.lRFgiPdH");
            hide.toggle();
        });
        $("#checkbox-2").on("change", function() {
            if ($(this).is(":checked")) {
                intervalId = setInterval(() => {
                    var currentTime = new Date().toLocaleString();
                    //console.log("执行中");
                    go();
                },1000); // 每秒执行一次
            } else {
                clearInterval(intervalId);//停止
            }
        });
        $("#checkbox-3").on("change", function() {
            if (this.checked) {

            } else {
                window.speechSynthesis.cancel();
                text_i=0;
            }
        });
        $("#checkbox-4").change(function() {
            if (this.checked) {
                $('#tuili .tl').remove();
                for (var i = 0; i < 9; i++) {
                    var $row = $('<div>').addClass('row');
                    for (var j = 0; j < 9; j++) {
                        var bt = "r"+(i+1)+"c"+(j+1);
                        var $input = $("<input bt class='tl' id="+bt+">").attr({
                            type: 'text',
                            size: '2'
                        });
                        $row.append($input);
                    }
                    $('#tuili').append($row);
                }
                tlcss();
            }
            $('#tuilihead').toggle();
            $('#tldiv').toggle();
        });
        $( "#save" ).on( "click", function( event ) {
            event.preventDefault();
            //console.log($("#tuilihead").offset().top);
            GM_setValue("tl_top", $("#tuilihead").offset().top);
            GM_setValue("tl_left", $("#tuilihead").offset().left);
            GM_setValue("tuili_width", $("#tuili").width());
        } );

        $("#slider-rate").slider({
            range: "max",
            min: 1,
            max: 30,
            value: 10,
            slide: function (event, ui) {
                $("#rate").val(ui.value);
            }
        });
        $("#rate").val($("#slider-rate").slider("value"));

        $("#slider-pitch").slider({
            range: "max",
            min: 0,
            max: 20,
            value: 18,
            slide: function (event, ui) {
                $("#pitch").val((ui.value));
            }
        });
        $("#pitch").val($("#slider-pitch").slider("value"));

        $('#speech_voices').change(function (e) {
            var id = $(this).val();
            console.log(tts_Voices[id].lang);
            $("#lang").text(tts_Voices[id].lang);
            $("#name").text(tts_Voices[id].name);
            $("#voiceURI").text(tts_Voices[id].voiceURI);
        });

        $('#btn').click(function () {
            var text = $('#text').val();
            speek(guolv(text));
        });




        /******************************插入数独格********************************************************/

        function tlcss(){
            const $width = ($('#tuili').width()-1)/9;
            $(".tl").css({
                "flex-grow":"1",
                "display": "inline-flex", /* 或 block，取决于你的布局需求 */
                "width": $width,
                "height": $width,
                "box-sizing": "border-box", /* 确保边框和填充不会增加元素的总尺寸 */
                "text-align": "center", /* 可选：使文本在 input 中居中 */
                'font-size':'22px',
                'color':'#B15BFF',
                "padding": 0, /* 根据需要调整填充 */
                /* 其他样式，如边框、背景色等 */
                "background-color":"rgba(255, 255, 255, 10%)",//透明背景
                "border": "1px solid #eee"
            });
            $("#r1c1,#r1c2,#r1c3,#r1c4,#r1c5,#r1c6,#r1c7,#r1c8,#r1c9,#r4c1,#r4c2,#r4c3,#r4c4,#r4c5,#r4c6,#r4c7,#r4c8,#r4c9").css({
                //"background-color":"rgba(0, 0, 0, 15%)",
                "border-top": "2px solid #000"
            });
            $("#r6c1,#r6c2,#r6c3,#r6c4,#r6c5,#r6c6,#r6c7,#r6c8,#r6c9,#r9c1,#r9c2,#r9c3,#r9c4,#r9c5,#r9c6,#r9c7,#r9c8,#r9c9").css({
                //"background-color":"rgba(0, 0, 0, 15%)",
                "border-bottom": "2px solid #000"
            });
            $("#r1c1,#r2c1,#r3c1,#r4c1,#r5c1,#r6c1,#r7c1,#r8c1,#r9c1,#r1c4,#r2c4,#r3c4,#r4c4,#r5c4,#r6c4,#r7c4,#r8c4,#r9c4").css({
                //"background-color":"rgba(0, 0, 0, 15%)",
                "border-left": "2px solid #000"
            });
            $("#r1c6,#r2c6,#r3c6,#r4c6,#r5c6,#r6c6,#r7c6,#r8c6,#r9c6,#r1c9,#r2c9,#r3c9,#r4c9,#r5c9,#r6c9,#r7c9,#r8c9,#r9c9").css({
                //"background-color":"rgba(0, 0, 0, 15%)",
                "border-right": "2px solid #000"
            });
            $( "#tuili" ).resizable({
                aspectRatio:1 / 1,
                ghost: true,
                resize: function(event, ui) {
                    var fontSize = Math.max(26, Math.ceil((ui.size.width / 9/1.7 )));
                    //console.log(ui.size.width);
                    $(".tl").css({
                        'width': (ui.size.width-1) / 9,
                        'height': (ui.size.height-1) / 9,
                        'font-size':fontSize + 'px',
                    });
                }
            });
        }



        function setSpeech() {
            return new Promise(
                function (resolve, reject) {
                    let synth = window.speechSynthesis;
                    let id;
                    id = setInterval(() => {
                        if (synth.getVoices().length !== 0) {
                            resolve(synth.getVoices());
                            clearInterval(id);
                        }
                    }, 10);
                }
            )
        }

        function go(){
            var list = $('.webcast-chatroom___enter-done').children(".TNg5meqw");
            var count = list.length;
            //console.log(count);
            if (count > sum) {
                list.slice(sum).each(function(){
                    var name = $(this).children('.u2QdU6ht').text();//名字
                    var mesg = $(this).children('.WsJsvMP9').children('.webcast-chatroom___content-with-emoji-text').text();//发言
                    if(mesg != ""){//会捕捉到送礼物的数据，所以发言为空，暂时跳过
                        if ($("#checkbox-2").is(":checked")) {
                            //console.log(mesg);
                            speek(guolv(mesg));
                        }
                    }
                    sum++;
                });
            }
        }
        function guolv(guolvtext) {
            return guolvtext.replace(/(\d)(?=\d)/g, function(match, digit) {
                // 由于JavaScript的正则表达式不支持正向预查，我们使用捕获组和一个简单的检查
                // 检查下一个字符是否是数字，如果是，则返回原始数字后加上!
                var nextChar = guolvtext[guolvtext.indexOf(match) + match.length];
                if (!isNaN(nextChar)) {
                    return digit + ' ';
                }
                // 如果下一个字符不是数字，直接返回原始数字
                return digit;
            });
        }
        function speek(text){
            if(lasttext == text){
                text_i++;
            }else{
                text_i=0;
            }
            if(text_i>1){
                return;
            }
            lasttext=text;
            var speech = new SpeechSynthesisUtterance();
            speech.text = text;
            speech.lang = $("#lang").text();
            speech.name = $("#name").text();
            speech.rate = ($("#rate").val()/10);//语速，数值，默认值是1，范围是0.1到10，表示语速的倍数，例如2表示正常语速的两倍。
            speech.pitch = ($("#pitch").val()/10);;//表示说话的音高，数值，范围从0（最小）到2（最大）。默认值为1
            window.speechSynthesis.speak(speech);
        }



    });

    // Your code here...
})();