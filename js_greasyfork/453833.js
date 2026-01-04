// ==UserScript==
// @name         SaizX theme — Lite blue
// @namespace    https://bitbucket.org/
// @version      0.2
// @description  This is a theme for agenda.sime.md with an anime background image and light blue colors.
// @author       ezX && Sairos
// @match        https://agenda.sime.md/ords/f?p=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sime.md
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453833/SaizX%20theme%20%E2%80%94%20Lite%20blue.user.js
// @updateURL https://update.greasyfork.org/scripts/453833/SaizX%20theme%20%E2%80%94%20Lite%20blue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function average(elmt) {
        var sum = 0;
        for( var i = 0; i < elmt.length; i++ ){
            sum += parseInt( elmt[i], 10 );
        }

        var avg = sum/elmt.length;
        return avg;
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }


    $(document).keypress(function(e){
        if (e.which == 13){
            $("#B46325816630545644").click();
        }
    });

    try {
        $('button#t_Button_navControl').remove();
        $('a.t-Header-logo-link')[0].style.cssText = 'padding: 0px 0px';
        $('a.t-Header-logo-link')[0].href='#';
        $('div.t-Header-logo')[0].style.cssText = 'padding: 2px 4px';

        let avatar = $('div#dosarContent').children()[0];
        $(avatar).children()[0].src = 'https://avatars.mds.yandex.net/get-images-cbir/7638013/0Dk1XLzWDa3P47p1Q-GigQ2171/ocr';
        $(avatar).children()[0].style.cssText += 'filter: brightness(85%);'
    } catch {}

    document.body.style.cssText +=
        `background-image: url('https://catherineasquithgallery.com/uploads/posts/2021-12/1639711912_214-catherineasquithgallery-com-p-fon-anime-dlya-intro-rozovii-290.jpg');
        backdrop-filter: blur(5px);
        background-size: 100% 100%`;
    addGlobalStyle('#outer {background: none !important;} .a-Menu-labelContainer, .a-Menu-label {color: black !important} a, button, td, strong, h3, .t-Login-title, .apex-item-display-only { color: white !important;} .a-TreeView-label { font-size: 13px !important;} .a-TreeView-content {margin-top: 10px !important;} .t-Region-headerItems, .t-Report-colHead {color: #00c4ff !important; text-shadow: -0   -1px 0   #000000,0   -1px 0   #000000,-0    1px 0   #000000,0    1px 0   #000000,-1px -0   0   #000000,1px -0   0   #000000,-1px  0   0   #000000,1px  0   0   #000000,-1px -1px 0   #000000,1px -1px 0   #000000,-1px  1px 0   #000000,1px  1px 0   #000000,-1px -1px 0   #000000,1px -1px 0   #000000,-1px  1px 0   #000000,1px  1px 0   #000000;}');

    try {
        let avg_i = document.createElement('th');
        avg_i.className = 't-Report-colHead';
        avg_i.align = 'left';
        avg_i.innerHTML = 'Average';

        let avg = document.querySelectorAll('tr')[48];
        $(avg).append(avg_i);

        let lessons = document.querySelectorAll('tbody')[20].childNodes;
        for (let lesson of lessons) {
            if (lesson.nodeName == 'TR') {
                let note = document.createElement('td');
                note.className = 't-Report-cell';
                note.style.cssText = 'color: red !important; text-shadow: 1px 1px 1px #000';
                note.innerHTML = parseInt(average($(lesson).children()[1].innerHTML.split(', ')) * 100) / 100;

                $(lesson).append(note);
            }
        }
    } catch {}
})();