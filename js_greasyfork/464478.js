// ==UserScript==
// @name         SD增强
// @namespace    cn.lukezh.sd.yd
// @version      1.23
// @description  增加stable diffusion webUI功能,如配置保存、中文自动翻译、手机端优化排版等
// @match        *://127.0.0.1:*/*
// @match        *://localhost:*/*
// @match        *://cloud.lukezh.cn:*/*
// @match        *://*.remote.moe/*
// @match        *://*.gradio.live/*
// @match        *://*.lhr.life /*
// @match        *://*.trycloudflare.com/*

// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/464478/SD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/464478/SD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var idsToHide = ['setting_CLIP_stop_at_last_layers', 'setting_sd_vae', 'refresh_sd_vae', 'txt2img_subseed_show', 'txt2img_styles_row', 'component-79', 'component-126', 'component-318', 'component-353', 'component-425', 'script_list', 'image_buttons_txt2img'];
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);

    var script2 = document.createElement('script');
    script2.src = 'https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/crypto-js.js';
    script2.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script2);

    var appKey = '425046ce9dbca9b8';
    var key = 'W5b98gmWez1nLYDbQ16YUGRM6K5x3MaX';//注意：暴露appSecret，有被盗用造成损失的风险
    run();
    function run() {
        var loadReady = document.querySelectorAll('[id$="_prompt"] textarea.scroll-hide.svelte-4xt1ch.autocomplete');
        if (loadReady.length > 0) {
            hideElementsOnSmallScreens();
            var documentsTool = document.querySelectorAll("[id$='_tools'] > :first-child");
            documentsTool.forEach(element=>{
                var buttonEN = document.createElement("button");
                buttonEN.className = "lg secondary gradio-button tool svelte-1ipelgc";
                buttonEN.addEventListener("click", translate);
                buttonEN.innerText = "en";
                var buttonSV = document.createElement("button");
                buttonSV.className = "lg secondary gradio-button tool svelte-1ipelgc";
                buttonSV.addEventListener("click", savePrompt);
                buttonSV.innerText = "sv";
                element.appendChild(buttonSV);
                element.appendChild(buttonEN);
            });
            getPrompt();
        } else {
            setTimeout(function() {
                run();
            }, 200);
        }
    }
    function truncate(q){
        var len = q.length;
        if(len<=20) return q;
        return q.substring(0, 10) + len + q.substring(len-10, len);
    }
    function translate(){
        var textareas = document.querySelectorAll('[id$="_prompt"] textarea.scroll-hide.svelte-4xt1ch.autocomplete');
        var fillTextareas = filterVisibleElements(Array.from(textareas));
        var query = '';
        var fillLen=fillTextareas.length;
        if (fillLen > 0) {
            for (var i = 0; i < fillTextareas.length; i++) {
                if(i == fillLen-1){
                    query += fillTextareas[i].value;
                } else {
                    query += fillTextareas[i].value + '000';
                }
            }
        }
        requestApi(query, fillTextareas);
    }
    function savePrompt() {
        var textareas = document.querySelectorAll('textarea');
        var len=textareas.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                if (isVisible(textareas[i])) localStorage.setItem("textareas" + i, textareas[i].value);
            }
        }
        var inputs = document.querySelectorAll('input[type="number"]');
        var lenInputs=inputs.length;
        if (lenInputs > 0) {
            for (var j = 0; j < lenInputs; j++) {
                if (isVisible(inputs[j])) localStorage.setItem('inputs' + j, inputs[j].value);
            }
        }
        var checks = document.querySelectorAll('input[type="checkbox"]');
        var lenChecks=checks.length;
        if (lenChecks > 0) {
            for (var j1 = 0; j1 < lenChecks; j1++) {
                if (isVisible(checks[j1])) localStorage.setItem('checks' + j1, checks[j1].checked == true ? 1 : 0 );
            }
        }
        var radios = document.querySelectorAll('input[type="radio"]');
        var lenRadios=radios.length;
        if (lenRadios > 0) {
            for (var j2 = 0; j2 < lenRadios; j2++) {
                if (isVisible(radios[j2])) localStorage.setItem('radios' + j2, radios[j2].checked  == true ? 1 : 0 );
            }
        }
    }
    function getPrompt() {
        var textareas = document.querySelectorAll('textarea');
        var len=textareas.length;
        if (len > 0) {
            for (var i = 0; i <len; i++) {
                if(localStorage.getItem("textareas" + i)) {
                    textareas[i].value = localStorage.getItem("textareas" + i);
                    var event = new Event('input');
                    textareas[i].dispatchEvent(event);
                }
            }
        }

        var inputs = document.querySelectorAll('input[type="number"]');
        var lenInputs=inputs.length;
        if (lenInputs > 0) {
            for (var j = 0; j < lenInputs; j++) {
                if(localStorage.getItem("inputs" + j)) {
                    inputs[j].value = localStorage.getItem("inputs" + j);
                    inputs[j].dispatchEvent(new Event('input'));
                }
            }
        }
        var checks = document.querySelectorAll('input[type="checkbox"]');
        var lenChecks=checks.length;
        if (lenChecks > 0) {
            for (var j1 = 0; j1 < lenChecks; j1++) {
                if(localStorage.getItem("checks" + j1)) {
                    checks[j1].checked = localStorage.getItem("checks" + j1) == '1' ? true : false;
                    checks[j1].dispatchEvent(new Event('change'));
                }
            }
        }
        var radios = document.querySelectorAll('input[type="radio"]');
        var lenRadios=radios.length;
        if (lenRadios > 0) {
            for (var j2 = 0; j2 < lenRadios; j2++) {
                if(localStorage.getItem("radios" + j2)) {
                    radios[j2].checked = localStorage.getItem("radios" + j2) == '1' ? true : false;
                    if (localStorage.getItem("radios" + j2) == '1') {
                        radios[j2].dispatchEvent(new Event('change'));
                    }
                }
            }
        }
    }
    function requestApi(query,textareas) {
        query = query.replace(/:|：/g,'111').replace(/\n/g,'222');
        var salt = (new Date).getTime();
        var curtime = Math.round(new Date().getTime()/1000);
        // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
        var from = 'zh-CHS';
        var to = 'en';
        var vocabId =  '';
        var str1 = appKey + truncate(query) + salt + curtime + key;
        var sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
        $.ajax({
            url: 'http://openapi.youdao.com/api',
            type: 'post',
            dataType: 'jsonp',
            data: {
                q: query,
                appKey: appKey,
                salt: salt,
                from: from,
                to: to,
                sign: sign,
                signType: "v3",
                curtime: curtime,
                vocabId: vocabId,
            },
            success: function (data) {
                translations = data.translation[0].replace(/!|!|（/g,'(').replace(/\?|？|）/g,':1.3)').replace(/111/g,':').replace(/222/g,'\n').replace(/,,/g,',').split("000");
                for (var i = 0; i < translations.length; i++) {
                    textareas[i].value = translations[i];
                    var event = new Event('input');
                    textareas[i].dispatchEvent(event);
                }
            }
        });
    }
    function filterVisibleElements(array) {
        return array.filter(function(element) {
            return isVisible(element);
        });
    }
    function isVisible(element) {
        return element.value.trim() != "" && (element.offsetWidth > 0 || element.offsetHeight > 0);
    }
    function hideElementsOnSmallScreens() {
        if (window.innerWidth < 768 ) {
            idsToHide.forEach(function(id) {
                var elementList = document.querySelectorAll("#" + id);
                elementList.forEach(function(element) {
                    element.style.display = 'none';
                });
            });
            var inputs = document.querySelectorAll('.svelte-jigama input, .svelte-1nnxs9b input, .svelte-a6vu2r input');
            inputs.forEach(function(input) {
                input.setAttribute('readonly', 'true');
            });
            // 获取指定 ID 的元素
            var parent = document.getElementById('txt2img_toprow');

            // 获取指定 ID 的元素
            var resultElement = document.getElementById('txt2img_results');

            // 将 resultElement 插入到 parent 元素的后面
            parent.after(resultElement);

            // 获取指定 ID 的元素
            var parent2 = document.getElementById('tabs');

            // 获取要移动的元素
            var tabNav = document.querySelector('.tab-nav');
            // 将 tabNav 元素插入到 parent 元素的最后一个子元素之后
            parent2.insertBefore(tabNav, parent2.lastElementChild.nextSibling);

            var quicksettings = document.getElementById('quicksettings');
            if (quicksettings) {
                quicksettings.style.flexWrap = 'nowrap';
            }
        }
    }
})();