// ==UserScript==
// @name         HowHow Japanese Support
// @description  讓 How 哥講日語的懶人包，最好使用平假名，尚不支持漢字
// @namespace    http://tampermonkey.net/
// @require      https://unpkg.com/wanakana
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @version      0.11
// @description  try to take over the world!
// @author       You
// @match        https://howfun.futa.gg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405193/HowHow%20Japanese%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/405193/HowHow%20Japanese%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(() => {
        $('#play-video').parent('li').append('<input type="button" id="convert" value="日語轉換">')
        $('#convert').click(() => {
            const romaji = wanakana.toRomaji(`${$('#how-text-video').val()} `.replace(/ /g, '_').split("").join(" "), {
                customRomajiMapping: {
                    'い': 'yi',
                    'う': 'wu',
                    'え': 'fei',
                    'お': 'fo',
                    'き': 'ti',
                    'け': 'gei',
                    'こ': 'kou',
                    'ち': 'xi',
                    'つ': 'zhi',
                    'て': 'dei',
                    'と': 'dou',
                    'ね': 'nei',
                    'の': 'nou',
                    'ひ': 'ti',
                    'へ': 'hei',
                    'め': 'mei',
                    'ら': 'la',
                    'り': 'li',
                    'る': 'lu',
                    'れ': 'lei',
                    'ろ': 'luo',
                    'ん': 'mang',
                    'そ': 'sou',
                    'ど': 'dou',
                    'で': 'dei',
                    'ご': 'gou',
                }
            })
            console.log(romaji)
            $('#how-text-video').val(romaji.replace(/([^_][AZaz]*) /g, '$11 ').replace(/_/g, ''))
        })
    })
})();