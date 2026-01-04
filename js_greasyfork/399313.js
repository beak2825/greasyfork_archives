// ==UserScript==
// @name                划词翻译
// @namespace           alex23's
// @description         选中文字一会放开自动翻译
// @author              alex23
// @include             *
// @version             0.0.11
// @grant               GM_xmlhttpRequest
// @grant               GM_addStyle
// @require             https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/399313/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/399313/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {

    'use strict';

    var gv = {toLanguage:'zh-CN',isAutoCopy:false};

    if (/zh/i.test(navigator.language)) gv.toLanguage='zh-CN';
    else if (/ja/i.test(navigator.language)) gv.toLanguage='ja';
    else if (/en/i.test(navigator.language)) gv.toLanguage='en';

    function init() {
        $(document).ready(function() {
            var ctrlDown = false,
                altDown = false,
                ctrlKey = 17,
                cmdKey = 91,
                altKey = 18,
                vKey = 86,
                cKey = 67;

            $(document).keydown(function(e) {
                if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
                if (e.keyCode == altKey) altDown = true;
            }).keyup(function(e) {
                if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
                if (e.keyCode == altKey) altDown = false;
            });

            $(".no-copy-paste").keydown(function(e) {
                if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) return false;
            });

            $(document).keydown(function(e) {
                if (ctrlDown && (e.keyCode == cKey)) {gv.isAutoCopy = false};
                if (altDown && (e.keyCode == cKey)){gv.isAutoCopy = true};
                //if (ctrlDown && (e.keyCode == vKey)) console.log("Document catch Ctrl+V");
            });
        });

        document.addEventListener('mousedown', function(e){
            if (!$('#changetranslatebox') || $('#changetranslatebox').length == 0) {
                createDisplay();
                $('#changetranslatebox li').on('click', function(e){
                    gv.toLanguage = e.target.getAttribute('name')
                    $('.translatedropdown').css('display', '');
                    _translate();
                    $('.translatetext').text(e.target.innerText + ' SET SUCCESS!');
                    setTimeout(function() { $('.translatetext').empty();}, 1000);
                });
            }
            if ($('#changetranslatebox').css('display') == 'block' && !checkClick(e)) {
                $('#changetranslatebox').css('display', '');
                $('.translatedropdown').css('display', '');
                $('.translatetext').empty();
                $('.translateexplain').empty();
            }
            clearTimeout(gv.timer);
            gv.holdTime = false;
            gv.timer = setTimeout(function() { gv.holdTime = true; }, 1000);
            if (e.target.className == 'translateplaysound') {
                $('.translateplaysound').addClass('translateplaysoundClick');
                playSound();
            } else if (e.target.className == 'translatelanguageset') {
                $('.translatedropdown').css('display', 'block');
            }
        }, true);

        document.addEventListener('mouseup', function(e){
             if (gv.holdTime == true && window.getSelection().toString()) {
                e.preventDefault()
                e.stopPropagation();
                gv.holdTime = false;
                showBox(e.clientX, e.clientY);
                gv.selectText = window.getSelection().toString();
                gv.encodeText = encodeURIComponent(gv.selectText);
                _translate();
            }
            if ($('.translateplaysoundClick') && $('.translateplaysoundClick').length > 0) {
                $('.translateplaysound').removeClass('translateplaysoundClick');
            }
            clearTimeout(gv.timer);
        }, true);
    }

    function createDisplay() {
        setStyle(['#changetranslatebox * {margin:0;padding:0;box-sizing:border-box;}','#changetranslatebox {min-height:24px;min-width:100px;max-width:360px;font:normal 12px/24px Helvetica, Tahoma, Arial, sans-serif;text-align: left;position: absolute;z-index: 2147483647;top: 22px;left: -35px;background: #fff;border: 1px solid #dcdcdc;-webkit-transition: opacity .218s;transition: opacity .218s;box-shadow: 0 1px 4px rgba(0,0,0,.2);padding: 5px 0;display: none;font-size: 12px;line-height: 20px;border-radius:3px;}','#changetranslatebox .translatecontentbox {margin:0 8px;color:#333;}','#changetranslatebox .translatecontentbox .translatetextbox{line-height:16px;border-bottom: 1px solid #ccc;padding: 2px 18px 9px 0;height: 25px;}','#changetranslatebox .translatecontentbox .translatetextbox div{vertical-align: middle;margin-right: 4px;color:#333;font-weight: normal;font-size:12px;}','#changetranslatebox .translatecontentbox .translatetextbox .translatetext{display: inline-block;font-size:14px;font-weight: bold;color:#333;}','#changetranslatebox .translatecontentbox .translatetextbox .translateplaysound {margin-left: 1px;cursor:pointer;display: inline-block;vertical-align: middle;width: 14px;height: 11px;overflow: hidden;background: url("data:image/gif;base64,R0lGODlhDgAZAIAAABy3/f///yH5BAAAAAAALAAAAAAOABkAAAI1jA+nC7ncXmg0RlTvndnt7jlcxkmjqWzotLbui4qxqBpUmoDl2Nk5GOKRSsCfDyer7ZYMSQEAOw==") no-repeat;text-decoration: none;}','#changetranslatebox .translatecontentbox .translatetextbox .translateplaysound.translateplaysoundClick {background-position:0 -14px;}','#changetranslatebox .translatecontentbox .translateexplain{padding: 2px 0 0 0;font-weight: normal;font-size:12px;}','#changetranslatebox .translatetiparrow {width: 0;height: 0;font-size: 0;line-height: 0;display: block;position: absolute;top: -16px;left: 10px;}','#changetranslatebox .translatetiparrow em, #changetranslatebox .translatetiparrow ins {width: 0;height: 0;font-size: 0;line-height: 0;display: block;position: absolute;border: 8px solid transparent;border-style: dashed dashed solid;}','#changetranslatebox .translatetiparrow em {border-bottom-color: #d8d8d8;font-style: normal;color: #c00;}','#changetranslatebox .translatetiparrow ins {border-bottom-color: #fff;top: 2px;text-decoration: underline;background:none !important}','#changetranslatebox .translatelanguageset {position:absolute;top:9px;right:10px;cursor: pointer;width: 14px;height: 14px;background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAdVBMVEUAAAAwi/+Zxv9urv9oq/9pq/9Elv81jf89kv8wiv8+kv8wiv8xi/8wi/9/t/9+t/9co/9Zof9Hl/9Gl/9ClP9Bk/85j//k8f/Z6v+Fu//x+P/e7f/b6//G3/+/2/+w0/+q0P+52P+42P+Lvv+IvP9wr/9vr/864/KKAAAAF3RSTlMAR/7s7OK7l5VuTyMTC/z7y8ihnYSAQ/Vmp/0AAAB9SURBVAjXVY9HDsQwDAPpVKf32E7v/3/iGtJhk7kNIIgkLH0QA3EgQHTX7AnhzWdLKo9hMWYZdkmaFFpZdJ6QRo7afH9TTmSlqcy4hmkarqMpazxq0m4GZK6e1I37rQ/q8n9cNZ9XHJRzUMFBcucaB9doTy55dSAET+gB/ABPjgqB+Q/YPgAAAABJRU5ErkJggg==") no-repeat;text-decoration: none;}','#changetranslatebox .translatelanguageset .translatedropdown {margin:0;padding:0;display:none;top:13px;right:-60px;position: absolute;background-color: #ffffff;width: 68px;overflow: auto;z-index: 1;border: 1px solid rgba(0,0,0,.2);box-shadow: 0 2px 4px rgba(0,0,0,.2);}','#changetranslatebox .translatelanguageset .translatedropdown li {list-style-type:none; color: black;padding: 6px 8px;margin:0px;text-decoration: none;display: block;text-align:center;}','#changetranslatebox .translatelanguageset .translatedropdown li:hover { background-color: #f1f1f1;}']);
        $('<div id="changetranslatebox"><div class="translatecontentbox"><div class="translatetextbox"><div class="translatetext"></div><div class="translateplaysound"></div></div><div class="translateexplainbox"><div class="translateexplain"></div><div class="translateplaysound"></div></div></div><div class="translatetiparrow"><em></em><ins></ins></div><div class="translatelanguageset"><ul class="translatedropdown"><li name="zh-CN">中文</li><li name="ja">日本語</li><li name="ko">한국어</li><li name="ru">русский язык</li><li name="fr">Français</li><li name="en">English</li></ul></div></div>').appendTo($(document.body));
    }

    function showBox(mouseX, mouseY) {
        var changetranslatebox = document.getElementById('changetranslatebox');
        var selectedRect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (selectedRect.width) {if (getComputedStyle(document.body).position != 'static') {changetranslatebox.style.top = selectedRect.bottom - document.body.getBoundingClientRect().top + 8 + 'px';} else {changetranslatebox.style.top = selectedRect.bottom + scrollTop + 8 + 'px';}changetranslatebox.style.left = selectedRect.left + selectedRect.width / 2 - 18 + 'px';} else {changetranslatebox.style.top = mouseY - document.body.getBoundingClientRect().y + selectedRect.height + 8 + 'px';changetranslatebox.style.left = mouseX + selectedRect.width / 2 - 18 + 'px';}
        changetranslatebox.style.display = 'block';
    }

    function setStyle(css){
        if(typeof(css) == "string") GM_addStyle(css);
        else for(var i=0;i<css.length;i++){GM_addStyle(css[i]) }
    }

    function _translate() {
        googleTrans.Execute(gv.selectText, 'auto', gv.toLanguage, (ret)=>{
            parseResult(ret)
        })
    }

    function parseResult(result) {
        var explains = '';
        var obj = result;
        try{
            if( typeof(obj) == 'string') gv.explains = obj;
            else gv.explains = obj.join('\n');
            $('.translateexplain').text(gv.explains);
            if (navigator.clipboard && gv.isAutoCopy) {
                navigator.clipboard.writeText(gv.explains);
            }
        }catch(e){
            $('.translateexplain').text('翻译失败');
        }
    }

    function checkClick(e) {
        var path = e.path || e.composedPath();
        if (path.indexOf($('#changetranslatebox').get(0)) > -1) return true;
        else return false;
    }

    function playSound(arraybuffer) {
        if(!gv.explains){
            $('.translatetext').text('No statement');
            setTimeout(function() { $('.translatetext').empty(); }, 3000);
            return;
        }
        if(!gv.mSpeechSynthesisUtterance){
            gv.mSpeechSynthesisUtterance = new SpeechSynthesisUtterance();
            gv.mSpeechSynthesisUtterance.onstart = function(event) {
                $('.translatetext').text('playing');
                gv.playSourceStatus = 1;
            };
            gv.mSpeechSynthesisUtterance.onpause = function(event) {
                $('.translatetext').empty();
                gv.playSourceStatus = 0;
            };
            gv.mSpeechSynthesisUtterance.onresume = function(event) {
                $('.translatetext').empty();
                gv.playSourceStatus = 0;
            };
            gv.mSpeechSynthesisUtterance.onend = function(event) {
                $('.translatetext').empty();
                gv.playSourceStatus = 0;
            };
        }
        if(!gv.playSourceStatus){
            gv.playSourceStatus = 1;
            var toLanguage = gv.toLanguage;
            gv.mSpeechSynthesisUtterance.text = gv.explains;
            gv.mSpeechSynthesisUtterance.lang = toLanguage;
            window.speechSynthesis.speak(gv.mSpeechSynthesisUtterance);
        }
    }

    init();
    
    //谷歌翻译
    var googleTrans = {
        Execute: function (selectText, fromLanguage, toLanguage, h_onloadfn) {
            let url = 'https://translate.google.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&hl=zh-CN&sl='+fromLanguage;
            url += `&tk=${token(selectText)}`;
            url += `&tl=${toLanguage}&q=${encodeURIComponent(selectText)}`;

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Referer": `https://translate.google.com`,
                    "Cache-Control": "max-age=0",
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                },
                onload: function (r) {
                    setTimeout(function () {
                        try{
                            var resData=r.responseText;
                            console.log(JSON.parse(resData).sentences[0].trans)
                            var transTexts=[];
                            for(let sentence of JSON.parse(resData).sentences){
                                transTexts.push(sentence.trans)
                            }
                            h_onloadfn(transTexts);
                        }catch(e){
                            h_onloadfn("翻译失败");
                        }
                    }, 300);
                },
                onerror: function (e) {
                    h_onloadfn("无网络连接，翻译失败");
                    //console.error(e);
                }
            });

        },
    };

    /**
     * 谷歌翻译 token 计算
     *
     * function token(a), Copyright 2021 https://github.com/hujingshuang/MTrans.
     * “
     * 目前，本项目免费开源，开发者可基于此进行二次开发。
     * （English Translation: Currently, this project is free and open source, developers can be based on this project for secondary development.）
     * ”
     * */
    function token(a) {
        const b = 406644;
        const b1 = 3293161072;
        const jd = ".";
        const sb = "+-a^+6";
        const Zb = "+-3^+b+-f";
        let e = [];
        let f = 0;
        let g = 0;
        for (e = [], f = 0, g = 0; g < a.length; g++) {
            let m = a.charCodeAt(g);
            128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023), e[f++] = m >> 18 | 240, e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224, e[f++] = m >> 6 & 63 | 128), e[f++] = m & 63 | 128)
        }
        a = b;
        for (f = 0; f < e.length; f++) a += e[f],
            a = RL(a, sb);
        a = RL(a, Zb);
        a ^= b1 || 0;
        0 > a && (a = (a & 2147483647) + 2147483648);
        a %= 1E6;
        return a.toString() + jd + (a ^ b);
    }
    /**
     * 谷歌翻译 token 计算
     *
     * function RL(a, b), Copyright 2021 https://github.com/hujingshuang/MTrans.
     * “
     * 目前，本项目免费开源，开发者可基于此进行二次开发。
     * （English Translation: Currently, this project is free and open source, developers can be based on this project for secondary development.）
     * ”
     * */
    function RL(a, b) {
        const t = "a";
        const Yb = "+";
        for (let c = 0; c < b.length - 2; c += 3) {
            let d = b.charAt(c + 2);
            d = d >= t ? d.charCodeAt(0) - 87 : Number(d);
            d = b.charAt(c + 1) == Yb ? a >>> d : a << d;
            a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d;
        }
        return a;
    }
})();