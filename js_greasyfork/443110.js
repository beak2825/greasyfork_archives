// ==UserScript==
// @name         Translate_DB
// @namespace    https://zjzdmc.top
// @version      0.6.8
// @description  一个非常呆的翻译插件,点击百度翻译图标,输入内容,选择语言,翻译/需要开启跨域请求,请点击始终允许.
// @author       Datehoer
// @match        *://*/*
// @icon         https://zjzdmc.top/img/translate.png
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/443110/Translate_DB.user.js
// @updateURL https://update.greasyfork.org/scripts/443110/Translate_DB.meta.js
// ==/UserScript==

(function () {
    const body = document.querySelector('body');
    console.log("hello world");
    let translate_body = document.createElement("div");
    translate_body.className = "translate_body";
    translate_body.id = "translate_body"
    translate_body.setAttribute("style","background-image:url(https://zjzdmc.top/img/translate.png);background-repeat:no-repeat;background-size:100%;position:fixed;top:50px;right:50px;width:35px;height:35px;overflow:hidden;z-index:9999;cursor:pointer;");
    translate_body.title = "点击翻译";
    let translate_box = document.createElement("div");
    let translate_cover = document.createElement("div");
    translate_box.className = "translate_box";
    translate_cover.className = "translate_box";
    translate_cover.id = "translate_box";
    translate_box.setAttribute('style',"cursor:pointer;position:fixed;z-index:99999;top:100px;right:100px;width:400px;text-align: center;font-family: 'Arial','Microsoft YaHei','黑体','宋体',sans-serif;background-image:linear-gradient(-90deg, #29bdd9 0%, #276ace 100%);padding: 10px");
    translate_cover.setAttribute('style',"height:380px;width:400px;position:absolute;z-index:-1");
    let translate_box_input = document.createElement("textarea");
    let translate_box_change = document.createElement("input");
    let translate_box_close = document.createElement("input");
    let translate_box_show = document.createElement("textarea");
    let translate_box_input_language = document.createElement("input");
    let translate_box_show_language = document.createElement("input");
    translate_box_show.disabled = true;
    translate_box_close.type = "button";
    translate_box_close.value = "X";
    translate_box_close.setAttribute("style","background: #6cd735;border: 1px solid black;position: absolute;right: -16px;top: -16px;border-radius: 50%;width: 25px;height: 25px;color: white;")
    translate_box_input.placeholder = "请输入需要翻译的内容";
    translate_box_input.setAttribute('style','border: 0;border-radius: 5px;background-color: rgba(241, 241, 241, .98);width: 355px;height: 100px;padding: 10px;resize: none;');
    translate_box_show.setAttribute('style','border:1px solid #96c2f1;background:#eff7ff;width: 355px;height: 100px;padding: 10px;resize: none;border-radius: 5px;');
    translate_box_change.type = "button";
    translate_box_input_language.type = "text";
    translate_box_input_language.value = "auto";
    translate_box_show_language.type = "text";
    translate_box_show_language.value = "zh-CN";
    translate_box_change.value = "翻译";
    translate_box_change.setAttribute('style',"width: 250px;height: 50px;outline: none;border: 2px solid black;border-radius: 10px;background-color: white;font-size: 16px;cursor: pointer;margin: 10px;");
    translate_box_input_language.setAttribute('style',"color: #333;font-family: 'Microsoft YaHei', Tahoma, Verdana, SimSun;padding: 4px;font-size: 15px;outline-width: medium;outline-style: none;outline-color: invert;border-radius: 3px;text-shadow: 0px 1px 2px #fff;background-attachment: scroll;background-repeat: repeat-x;background-position-x: left;background-position-y: top;background-size: auto;background-origin: padding-box;background-clip: border-box;background-color: rgb(255, 255, 255);border: solid 1px #ccc;margin: 5px;");
    translate_box_show_language.setAttribute('style',"color: #333;font-family: 'Microsoft YaHei', Tahoma, Verdana, SimSun;padding: 4px;font-size: 15px;outline-width: medium;outline-style: none;outline-color: invert;border-radius: 3px;text-shadow: 0px 1px 2px #fff;background-attachment: scroll;background-repeat: repeat-x;background-position-x: left;background-position-y: top;background-size: auto;background-origin: padding-box;background-clip: border-box;background-color: rgb(255, 255, 255);border: solid 1px #ccc;margin: 5px;");
    translate_box.appendChild(translate_box_close)
    translate_box.appendChild(translate_cover)
    translate_box.appendChild(translate_box_input);
    translate_box.appendChild(translate_box_change);
    translate_box.appendChild(translate_box_input_language);
    translate_box.appendChild(translate_box_show_language);
    translate_box.appendChild(translate_box_show);
    body.appendChild(translate_box);
    body.appendChild(translate_body);
    if(location.origin == 'https://github.com'){
        translate_body.style.backgroundColor = "aqua";
    }
    let image_test = new Image();
    image_test.src = 'https://zjzdmc.top/img/translate.png';
    setTimeout(() => {
        if (image_test.width == 0) {
            translate_body.style.backgroundImage = "url(https://raw.githubusercontent.com/datehoer/translate_tampermonkey/main/translate.png)";
        }
    }, 1000)
    image_test.src = 'https://raw.githubusercontent.com/datehoer/translate_tampermonkey/main/translate.png';
    setTimeout(() => {
        if (image_test.width == 0) {
            translate_body.style.backgroundColor = "aqua";
        }
    }, 2000)
    $('.translate_box').hide()
    document.body.addEventListener('mousedown', () => {
        document.body.addEventListener('mouseup', () => {
            if (window.getSelection().toString().length > 0) {
                translate_box_input.value = window.getSelection().toString();
            }
        })
    })
    translate_body.addEventListener("click", () => {
        $('.translate_box').toggle();
        $('.translate_box').css("top", parseInt($('#translate_body').css('top'))+50+"px");
        $('.translate_box').css("left", parseInt($('#translate_body').css('left'))-450+"px");
    })
    translate_box_close.addEventListener("click", ()=>{
        $('.translate_box').hide()
    })
    translate_box_change.addEventListener("click", () => {
        let input_value = translate_box_input.value;
        let input_language = translate_box_input_language.value;
        let show_language = translate_box_show_language.value;
        let link = "https://translate.google.cn/m?sl=" + input_language + "&tl=" + show_language +
            "&hl=en&q=" + input_value;
        GM_xmlhttpRequest({
            method: "GET",
            url: link,
            onload: (res) => {
                let v = res.responseText;
                let pattern = /<div class="result-container">(.*?)<\/div>/;
                console.log(v.match(pattern)[1])
                translate_box_show.value = v.match(pattern)[1];
            }
        })
    })
    // 拖拽
    function dragFunc(id) {
        var Drag = document.getElementById(id);
        Drag.onmousedown = function(event) {
            var ev = event || window.event;
            event.stopPropagation();
            var disX = ev.clientX - Drag.offsetLeft;
            var disY = ev.clientY - Drag.offsetTop;
            document.onmousemove = function(event) {
                var ev = event || window.event;
                Drag.style.left = ev.clientX- disX+ "px";
                Drag.style.top = ev.clientY-disY + "px";
                Drag.style.cursor = "move";
            };
        };
        Drag.onmouseup = function() {
            document.onmousemove = null;
            Drag.style.cursor = "default";
        };
    }
    dragFunc("translate_box");
    dragFunc("translate_body")
})();