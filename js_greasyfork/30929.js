// ==UserScript==
// @name         VoiceDeOChat
// @name:ja      ボイスでオガーチャット
// @namespace    VoiceDeOChat.v0
// @version      0.3.1
// @description  OGARio-chat with voice
// @description:ja    OGARio のチャットを音声入力で行えるようにします
// @author       tannichi
// @match        http://agar.io/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/30929/VoiceDeOChat.user.js
// @updateURL https://update.greasyfork.org/scripts/30929/VoiceDeOChat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function pre_loop(){
        // この時点では jQuery は使えない
        if(! document.getElementById("message-box")){
            setTimeout(pre_loop, 1000);
            console.log("VoiceDeOChat:wait for OGARio load");
            return;
        }
        return initialize();
    }
    return pre_loop();
    function initialize(){
        var lang_hash = { "default":"default", "ja":"日本語", "en-US":"English", "zh-CN":"简体中文", "zh-TW":"繁體中文", "ko":"한국어" };
        // 設定値
        //GM_deleteValue("lang");
        var cfg = {};
        cfg.prefix = GM_getValue("prefix", "?");
        cfg.lang = GM_getValue("lang", "default");
        cfg.unpause = GM_getValue("unpause", false);
        console.log("load prefix="+ cfg.prefix +" lang="+ cfg.lang +" unpause="+ cfg.unpause);
        // マウスクリックが "LMB-Mouse split" と干渉しないようにする
        $("#message-box").mousedown(function(){return false;});
        $(".team-top-menu").mousedown(function(){return false;});
        //$("#chat-box").mousedown(function(){return false;}); // ← 不十分
        // ボタンの追加
        $("#message-menu").append('<a href="#" class="chatbox-hide icon-close" style="float:right;">X</a>');
        $(".chatbox-hide").click(function(){
            $("#message-box").css("display", "none");
            if(cfg.unpause && $("#pause-hud").css("display") == "block"){
                var code = 82; // 'R'
                $(document).trigger(jQuery.Event('keydown',{ keyCode: code, which: code } ));
            }
        });
        $("#message-menu").append('<a href="#" class="chatbox-clear icon-clear" style="float:right;">C</a>');
        $(".chatbox-clear").click(function(){
            $("#message").val("");
        });
        // ボイスボタン
        window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
        var recognition = new window.SpeechRecognition();
        if(cfg.lang !== "default"){
            recognition.lang = cfg.lang;
        }
        console.log("cfg.lang/recognition.lang="+ cfg.lang +"/"+ recognition.lang);
        recognition.addEventListener('result', function(event){
            var text_to = event.results.item(0).item(0).transcript;
            var text_pre = $("#message").val();
            if(text_pre === ""){
                text_to = cfg.prefix + text_to;
            }else{
                text_to = text_pre + " " + text_to;
            }
            $("#message").val(text_to);
        }, false);
        recognition.addEventListener('end', function(event){
            fn_recognition_end();
        }, false);
        $("#message-menu").append('<a href="#" class="voice-start icon-mic" style="float:right;">?</a>');
        $(".voice-start").click(function(){
            fn_recognition_start();
        });
        function fn_recognition_start(){
            $("#voice-config").css("display", "none");
            $(".voice-start").css("background-color", "green");
            recognition.start();
        }
        function fn_recognition_end(){
            $(".voice-start").css("background-color", "");
        }
        // =====  設定画面  =====
        //var local_style = '';//'#voice-config *{-webkit-user-select:all!important; float:left;}';
        //local_style += '\n#voice-config {width:350px; height:auto; display:none; overflow:visible; position:fixed; left:50%; bottom:82px; transform:translate(-50%,0);}';
        //local_style += '\n#voice-config *{-webkit-user-select:all!important; display:initial; }';
        //local_style += '\n#chat-box *{-webkit-user-select:all!important; }';
        //$("head").append('<style>\n'+ local_style +'\n</style>');
        //$("#message-box").prepend('<div id="voice-config" style="display:none; width:100%; height:auto; background-color:rgba(0,0,0,0.4);"></div>');
        //$("body").append('<div id="voice-config"></div>');
        $("#og-options").append('<div id="voice-config" class="options-box voiceGroup"></div>');
        $("#voice-config").append('<h5 class="menu-main-color">Voice</h5>');
        $("#voice-config").append('<label>前置:<input type="text" id="voice-prefix" style="width:4em; float:none;" value="'+ cfg.prefix +'"/></label>');
        //$("#voice-prefix").get(0).setSelectionRange(cfg_prefix.length, cfg_prefix.length);
        //$("#voice-config").append('<label>前置?:<input type="checkbox" id="voice-prefix" style="float:left;"/></label>&nbsp;&nbsp;');
        function fn_lang_make(){
            $("#voice-config").append('<label>言語:<select id="voice-lang"/></select></label>');
            for(var code in lang_hash){
                var desc = lang_hash[code];
                var selected = (code === cfg.lang) ? ' selected' : '';
                //console.log("code/desc/selected="+ code +"/"+ desc +"/"+ selected);
                $("#voice-lang").append('<option value="'+ code +'"'+ selected +'>'+ desc +'</option>');
            }
            //$("#voice-lang").click(function(event){ event.target.focus(); });
        }
        fn_lang_make();
        $("#voice-config").append('<label title="ボタン X で入力域を閉じる時に、ポーズを解除します"><input type="checkbox" id="voice-unpause"'+ (cfg.unpause ? ' checked' : '') +'/>UnPause</label>');
        //$("#voice-prefix").mousedown(function(event){ event.target.focus(); console.log("focus in prefix"); });
        //$("#voice-config select").each(function(element){
        //    console.log("lookup select element");
        //    $(element).mouseover(function(event){ event.target.focus(); console.log("focus in select"); return true; });
        //});
        //$("#voice-lang").mouseover(function(event){ event.target.focus(); console.log("focus in lang"); });
        //$("#voice-lang").blur(function(event){ console.log("lost focus in lang"); });
        // SAVE
        //$("#voice-config").append('<a href="#" class="voice-save icon-save" style="float:right;">SAVE</a>');
        //$(".voice-start").dblclick(function(){
        //    //$("#message-box").css("display", "none");
        //    $("#voice-config").css("display", "block");
        //    $("#voice-prefix").prop('checked', (cfg_prefix ? true : false));
        //    //$("#voice-lang").val(cfg.lang);
        //    $('input[name=voice-lang]').val([cfg.lang]);
        //});
        // 設定の保存
        //$(".voice-save").click(function(){
        //    config_save();
        //});
        var observ_obj = $("#og-settings");
        var observ_cur = observ_obj.css("display");
        var observer = new MutationObserver(function(mutations){
            //   初期状態で display は設定されていない。最初に Settings 以外のタブが選択された場合、
            // 設定無しから、display:none に変化する。
            var observ_pre = observ_cur;
            var observ_new = observ_obj.css("display");
            observ_cur = observ_new;
            if(observ_new == "none" && observ_pre == "block"){
                //console.log("#og-settings hide");
                fn_config_save();
            }
        });
        observer.observe(observ_obj[0], { attributes: true, attributeFilter:['style'] });
        function fn_config_save(){
            //cfg.prefix =  $("#voice-prefix").prop('checked') ? "?" : "";
            cfg.prefix = $("#voice-prefix").val();
            GM_setValue("prefix", cfg.prefix);
            cfg.lang = $("#voice-lang").val();
            //cfg.lang = $('input[name=voice-lang]:checked').val();
            GM_setValue("lang", cfg.lang);
            if(cfg.lang !== "default"){
                recognition.lang = cfg.lang;
            }
            cfg.unpause =  $("#voice-unpause").prop('checked');
            GM_setValue("unpause", cfg.unpause);
            console.log("saved prefix="+ cfg.prefix +" lang="+ cfg.lang +" unpause="+ cfg.unpause);
            //$("#voice-config").css("display", "none");
            //$("#message").focus();
        }
     }
})();