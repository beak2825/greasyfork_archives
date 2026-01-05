// ==UserScript==
// @name         Zeit Newsticker Autoupdate
// @namespace    http://tampermonkey.net/
// @version      1.1b
// @match        http://www.zeit.de/news/index*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @description Dieses Skript ist zum filtrieren und hervorheben von Schlagzeilen vom Zeit.de Newsticker (zeit.de/news/index)
// @downloadURL https://update.greasyfork.org/scripts/27523/Zeit%20Newsticker%20Autoupdate.user.js
// @updateURL https://update.greasyfork.org/scripts/27523/Zeit%20Newsticker%20Autoupdate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var filter = GM_getValue('zeit_filter', [
        "Sport",
        "sport",
        "Biathlon",
        "hockey",
        "ball",
        "Ski",
        "athletik",
        "Film",
        "Rodeln",
        "Golf",
        "Freizeit",
        "Tennis",
        "Champions League"
        ]);
    var highlight = GM_getValue('zeit_highlight', [
        'International',
        'Konflikte',
        'Regierung',
        'Ukraine',
        'ukraine',
        'UNO',
        'Verfassung',
        'USA',
        'Russland',
        'Frankreich',
        'Finanzen',
        'Europa',
        'Großbritanien',
        'Börsen',
        'Milit#r',
        ]);

    window.document.styleSheets[0].addRule('textarea::-webkit-scrollbar', 'display:none;', 0 ); //scrollbar wegmachen

    var articles = document.querySelectorAll('article');
    var kicker='';
    var intervall = 10; //minuten
    var zeile='';
    var header = document.querySelector('.centerpage-header');
    var title = document.querySelector('.centerpage-header__title');
    var textarea = document.createElement('textarea');

    textarea.style.display = 'none';
    textarea.style.backgroundColor = '#d4d4d4';
    textarea.style.top = '110px';
    textarea.style.height = '70%';
    textarea.style.width = '33%';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.position = 'absolute';
    textarea.style.opacity = '0';
    textarea.style.border = 'none';
    textarea.style.transition = 'opacity .5s ease';
    textarea.setAttribute('spellcheck','false');

    var filter_text = textarea.cloneNode();
    var highlight_text = textarea.cloneNode();
    filter_text.value = filter.join('\n');
    filter_text.style.left = '15%';
    highlight_text.style.backgroundColor = 'rgb(255, 255, 198)';
    highlight_text.value = highlight.join('\n');
    highlight_text.style.right = '15%';

    var show_textareas = function(){
        filter_text.style.display = 'inline-block',
        highlight_text.style.display = 'inline-block';
        setTimeout( function(){
            filter_text.style.opacity = '1';
            highlight_text.style.opacity = '1';
        }, 600 );
    };

    var hide_textareas = function(){
        filter_text.style.opacity = '0';
        filter_text.style.display = 'none';
        highlight_text.style.opacity = '0';
        highlight_text.style.display = 'none';
    };

    filter_text.onchange = function(){
        GM_setValue( 'zeit_filter',
            filter = filter_text.value.split('\n').filter(v=>v.length).map(v=>v.replace(/\s*$/,'')) );
        apply();
    };

    highlight_text.onchange = function(){
        GM_setValue( 'zeit_highlight',
            highlight = highlight_text.value.split('\n').filter(v=>v.length).map(v=>v.replace(/\s*$/,'')) );
        apply();
    };

    header.appendChild(filter_text);
    header.appendChild(highlight_text);
    header.style.height = '132px';
    header.style.transition = 'height 0.5s ease';
    title.onmouseover = (e)=>header.style.color = 'gray';
    title.onmouseleave = (e)=>header.style.color = 'black';
    title.innerText = 'Aktuelle Nachrichten ▼';
    title.onclick = function(){
        if( header.style.height == '500px' )
            header.style.height = '132px',  title.innerText = 'Aktuelle Nachrichten ▼', hide_textareas();
        else
            header.style.height = '500px', title.innerText = 'Aktuelle Nachrichten ▲', show_textareas();
    };

    var apply = function(){
        for(var x of articles){ console.log('apply');
            x.style.backgroundColor = ''; //reset
            x.style.display = ''; //reset

            kicker = x.querySelector('.newsteaser__kicker').innerText;
            zeile  = x.querySelector('.newsteaser__title').innerText;

            for(var y of highlight)
                if( kicker.includes(y) ){
                    x.style.backgroundColor = '#ffff8e';
                    break;
                }
            for(var y of filter)
                if( kicker.includes(y) ){
                    x.style.display = 'none';
                    break;
                }
        }
    };

    apply();
    setTimeout(function(){ location.reload(); },intervall*60*1000);
})();