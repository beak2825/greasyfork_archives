// ==UserScript==
// @name           Перевод чата Twitch
// @version        0.1-BETA
// @description    Перевод сообщений в чате с любого языка на русский!
// @author         MjKey
// @match          *://*.twitch.tv/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @copyright      2022, MjKey | MjKey.ru
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @require        https://openuserjs.org/src/libs/sizzle/GM_config.js
// @license        MIT
// @namespace https://greasyfork.org/users/519758
// @downloadURL https://update.greasyfork.org/scripts/453018/%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20%D1%87%D0%B0%D1%82%D0%B0%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/453018/%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20%D1%87%D0%B0%D1%82%D0%B0%20Twitch.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author       MjKey
// ==/OpenUserJS==

/* global GM_config, GM_info, GM_registerMenuCommand */

(function() {
    'use strict';

    GM_config.init({
        id: 'ttconf',
        title: GM_info.script.name + ' • Настройки',
        fields: {
            AUTOTRANSLATE: {
                label: 'Кнопка перевода',
                type: 'checkbox',
                default: true,
                title: 'ВКЛ/ВЫКЛ кнопку'
            },
            FROMLANG: {
                label: 'На какой язык переводить (ru, nl, fr, ..)',
                type: 'text',
                default: "ru",
                title: 'В РАЗРАБОТКЕ'
            }
        }
    })

    GM_registerMenuCommand('Настройки', () => {
        GM_config.open('ttconf')
    })
    GM_registerMenuCommand('Поддержать автора', () => {
        window.open("https://mjkey.ru/#donate", '_blank').focus();
    })


    function httpPost(theUrl,theData, callback)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "POST", theUrl, true ); // false for synchronous request
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlHttp.send( theData );
        xmlHttp.onreadystatechange = function() {
            if (this.readyState != 4) return;
            callback(xmlHttp.responseText);
        }
    }
    function isEng(t){
        if(!t || 0 === t.length || t.startsWith('!'))return false;
        if(!/[А-я]+/.test(t))return true;
        return t.match(/[А-я]/g).length < (t.length * 0.1);
    }


    function TranslateTo(text,to, callback){
        httpPost('https://translate.googleapis.com/translate_a/single',
                 'client=gtx&sl=auto&tl='+to+'&dt=t&q='+encodeURIComponent(text),
                 (x)=>{
            var jsos = JSON.parse(x);
            callback({text:jsos[0][0][0],from:jsos[2]});
        },true);
    }
    var ChatLanguage = "en";
const chatObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type == 'childList'){
             if(mutation.target.matches('div.chat-scrollable-area__message-container')){
                mutation.addedNodes.forEach(n => {
                    var textns = n.querySelectorAll('span[class*="-fragment"]');
                    var textn = textns[0];
                    setTimeout(() => {
                        if(textn){
                            var text = '';
                            textns.forEach(element => {text += element.innerText;});
                            if(isEng(text.trim()) && text.length > 1 && !text.startsWith('!') && GM_config.get("AUTOTRANSLATE")){
                                setTimeout(() => {
                                    var xnewSpan = document.createElement('span');
                                        xnewSpan.classList.add("chat-line__message--deleted");
                                        xnewSpan.classList.add("twitchtoolbox-wronglayout");
                                        xnewSpan.style.cursor = 'pointer';
                                        xnewSpan.innerHTML = '<div class="tw-inline tw-relative tw-tooltip-wrapper" style="float:right;"><div class="tw-align-center tw-inline-block">&#xA0;⌈🌐⌋</div></div>';
                                        xnewSpan.title = text;
                                        xnewSpan.onclick = function(){
                                            var translatedText = '';
                                            var isChanged = false;
                                            textns.forEach(element => {
                                                element.alt = element.innerText;
                                                TranslateTo(element.innerText, GM_config.get("FROMLANG"),(x)=>{
                                                    translatedText += element.innerText = x.text || element.innerText;
                                                });
                                            });
                                        }
                                        textn.parentNode.prepend(xnewSpan);
                                }, 0);
                            }
                        }
                    });
                }, 0);
            }
        }
    })
})

chatObserver.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true
})
// Thanks ScriptedEngineer (aka. Siptrixed) <3
})();