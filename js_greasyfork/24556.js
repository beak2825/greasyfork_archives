// ==UserScript==
// @name         SpanishDict Quick Translatoin
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  When double click a word, show it's meanings
// @author       Andy
// @match        http://www.spanishdict.com/*
// @exclude        http://www.spanishdict.com/answers/*
// @downloadURL https://update.greasyfork.org/scripts/24556/SpanishDict%20Quick%20Translatoin.user.js
// @updateURL https://update.greasyfork.org/scripts/24556/SpanishDict%20Quick%20Translatoin.meta.js
// ==/UserScript==

(($) => {
    $(() => {
      $('span.icon-dash').text(' ');
    });
    const tipUrl = 'http://www.spanishdict.com/dictionary/quick_translation?word=';
    const dictUrl = 'http://www.spanishdict.com/translate/';
    const audioUrl = 'http://audio1.spanishdict.com/audio?lang=es&text=';
    let timeoutHandle;
    const playSound = (url) => {
        var audio = document.createElement('audio');
        audio.style.display = "none";
        audio.src = url;
        audio.autoplay = true;
        audio.onended = function(){
            audio.remove(); //Remove when played.
        };
        document.body.appendChild(audio);
    };
    const hideTip = () => {
        clearTimeout(timeoutHandle);
        $('body>.tooltip').remove();
    };
    const showTip = (source, tip, x, y) => {
        hideTip();
        playSound(audioUrl + source);
        if (tip.length === 0) {
            tip = 'no quick translation found';
        } else {
            tip = `<a style="color:#fff" target="spanishdict" href="${dictUrl + source}">${tip}</a>`;
        }
        const $tip = $(`<div class="tooltip fade top in" style="display: block;"><div class="tooltip-arrow"></div><div class="tooltip-inner">${tip}</div></div>`);
        $('body').append($tip);
        let width = $tip.outerWidth();
        let height = $tip.outerHeight();
        $tip.css({ left: x - width / 2, top: y - height - 5 });
        timeoutHandle = setTimeout(hideTip, 5000);
    };
    $('body').click(hideTip);
    $('.main-container').dblclick((e) => {
        const selected = window.getSelection().toString().trim();
        if (selected.length && selected.indexOf(' ') === -1) {
            fetch(tipUrl + selected)
            .then(res => res.text())
            .then(result => {
                result = result.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
                showTip(selected, result, e.pageX, e.pageY);
            });
        }
    });
})(jQuery);