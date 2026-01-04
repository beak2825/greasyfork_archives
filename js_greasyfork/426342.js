// ==UserScript==
// @name         Kolor Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  help you play the not-color-blind-friendly game. have fun!
// @author       arslan
// @match        https://kolor.moro.es/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426342/Kolor%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/426342/Kolor%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var answer = document.getElementById('kolor-kolor');
    if (answer){console.log('answer ready!')} else {console.log('answer not ready!')};

    function cheat(){
        var kolor = answer.style.backgroundColor;
        console.log(kolor);
        var smallTalk = [
            '这个 Kolor 估摸着是 ',
            '这个 Kolor 我看像 ',
            '这个 Kolor 大概是 ',
            '这个 Kolor 也许是 ',
            '这个 Kolor 可能是 ',
            '这个 Kolor 估计是 ',
            '这个 Kolor 瞅着应该是 ',
            '这个 Kolor 差不离是 ',
            '这个 Kolor 十有八九是 ',
            '这个 Kolor 绝对是 ',
            '这个 Kolor 必须是 ',
            '这个 Kolor 妥妥的是 ',
            '这个 Kolor 多半是 ',
            '这个 Kolor 这回怎么着得是 ',
            '这个 Kolor 得是 ',
            '这个 Kolor 巨像 ',
        ];
        var random = Math.floor(Math.random() * smallTalk.length);
        var sT = smallTalk[random];
        answer.textContent = sT + kolor;

        var options = document.getElementById('kolor-spin');

        function hexToRgb(hex) {
            return 'rgb(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5))
                + ',' + parseInt('0x' + hex.slice(5, 7)) + ')';
        };

        var result = [];
        for (var i=0;i<options.children.length;i++){
            result[i] = hexToRgb(options.children[i].getAttribute('fill'));
            console.log(result);
        };

        var optionsDisplay = document.getElementById('kolor-options');
        for (var j=0;j<optionsDisplay.children.length;j++){
            optionsDisplay.children[j].append(result[j]);
            console.log(optionsDisplay);
        };

    };
    answer.addEventListener('click', cheat);



})();