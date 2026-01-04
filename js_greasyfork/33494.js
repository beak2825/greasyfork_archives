// ==UserScript==
// @name          Stickers JVC
// @namespace     //
// @author        V509Cassiopeiae
// @include       http://www.jeuxvideo.com/forums/*
// @include       http://www.forumjv.com/*
// @run-at        document-start
// @version       1.11
// @description //
// @downloadURL https://update.greasyfork.org/scripts/33494/Stickers%20JVC.user.js
// @updateURL https://update.greasyfork.org/scripts/33494/Stickers%20JVC.meta.js
// ==/UserScript==

var Stickers = [
    ['lm9','lma','lmb','lmc','lmd','lme','lmf','lmg'],
    ['ljl','ljj','ljm','ljn','ljo','ljp', 'ljr', 'ljq', 'rzs', 'rzt', 'rzu', 'rzv', 'rzw'],
    ['jnd', 'jnc', 'jne', 'jnf', 'jng', 'jnh', 'jni', 'jnj'],
    ['kl6', 'kky', 'kl0', 'kl3', 'kl1', 'klb', 'kla', 'kl2', 'kkz', 'kl4', 'kl5', 'kl7', 'kl8', 'kl9'],
    ['nub', 'nu6', 'nu8', 'nu7', 'nua', 'nu9', 'lml', 'lmh', 'lmj', 'lmi', 'lmk', 'lmm', 'lmn', 'lmo', 'lmp', 'mqv', 'mqw', 'mqx', 'mqy', 'mqz', 'mr0', 'mr1'],
    ['kkh', 'kkg', 'kki', 'kkj', 'kkk', 'kkl', 'kkm', 'kkn'],
    ['kkr', 'kko', 'kkp', 'kkq', 'kks', 'kkt', 'kku', 'kkv'],
    ['kgu', 'kgw', 'kgv', 'kgz', 'kh0', 'kgx', 'kgy', 'kh1'],
    ['lgg', 'lgb', 'lga', 'lgc', 'lgd', 'lge', 'lgf', 'lgh']
], Popular = [0, 2, 3, 9, 13, 14, 22, 23, 24, 25, 28, 30, 34, 47, 50, 53, 63, 67, 72, 73, 77, 86, 93];

function Stk(from, to) {
    for (i = 0; i < document.getElementsByClassName('f-stkrs-w f-mid-fill-h')[0].children.length; i++)
        document.getElementsByClassName('f-stkrs-w f-mid-fill-h')[0].children[i].style.display = 'none';

    for (i = from; i < to + 1; i++) {
        document.getElementsByClassName('f-stkrs-w f-mid-fill-h')[0].children[i].style.display = 'initial';
    }
}

function Image(pack, tag) {
    var img = document.createElement('img');
    img.style.height = '45px';
    img.style.width = '45px';
    img.style.margin = '2px';
    img.style.display = 'none';
    img.tag = Stickers[pack][tag];
    img.src = 'http://jv.stkr.fr/p/1' + Stickers[pack][tag] + '?f-ed=1';
    img.onclick = function() {
        document.getElementById("message_topic").value += '[[sticker:p/1' + this.tag + ']]';
    };
    document.getElementsByClassName('f-stkrs-w f-mid-fill-h')[0].appendChild(img);
    img.addEventListener('mouseover', function() {
        this.style.cursor = 'pointer';
    });
}

function Ready() {
    document.getElementsByClassName('f-stkrs-w f-mid-fill-h')[0].removeChild(document.getElementsByClassName('f-stkrs-w f-mid-fill-h')[0].firstChild);
    document.getElementsByClassName('f-stkrs-w f-mid-fill-h')[0].removeChild(document.getElementsByClassName('f-stkrs f-cfx')[0]);
    function Start() {
        document.getElementsByClassName('f-tabs-l')[0].removeChild(document.getElementsByClassName('f-tabs-l')[0].firstChild);
        for (i = 0; i < Stickers.length + 1; i++) {
            var div = document.createElement('div');
            if (i == 0) {
                div.className = 'f-tab f-tab-popular f-h f-active';
                div.innerHTML = '$';
            }
            else if (i == 1) {
                div.className = 'f-tab f-tab-sticker-pack-c33 f-h';
                div.innerHTML = 'Ö';
                div.from = 0;
                div.to = 7;
            } else if (i == 2) {
                div.className = 'f-tab f-tab-sticker-pack-c43 f-h';
                div.innerHTML = 'Ó';
                div.from = 8;
                div.to = 20;
            } else if (i == 3) {
                div.className = 'f-tab f-tab-sticker-pack-c58 f-h';
                div.innerHTML = '¬';
                div.from = 21;
                div.to = 28;
            } else if (i == 4) {
            	div.className = 'f-tab f-tab-sticker-pack-c68 f-h';
                div.innerHTML = '»';
                div.from = 29;
                div.to = 42;
            } else if (i == 5) {
            	div.className = 'f-tab f-tab-sticker-pack-c84 f-h';
                div.innerHTML = '×';
                div.from = 43;
                div.to = 64;
            } else if (i == 6) {
            	div.className = 'f-tab f-tab-sticker-pack-c108 f-h';
                div.innerHTML = 'º';
                div.from = 65;
                div.to = 72;
            } else if (i == 7) {
            	div.className = 'f-tab f-tab-sticker-pack-c118 f-h';
                div.innerHTML = '¹';
                div.from = 73;
                div.to = 80;
            } else if (i == 8) {
            	div.className = 'f-tab f-tab-sticker-pack-c128 f-h';
                div.innerHTML = '²';
                div.from = 81;
                div.to = 88;
            } else if (i == 9) {
                div.className = 'f-tab f-tab-sticker-pack-c705 f-h';
                div.innerHTML = 'Ð';
                div.from = 89;
                div.to = 97;
            }
            div.style.height = '25px';
            div.style.height = '23px';
            div.style.lineHeight = '23x';
            div.style.fontSize = '14px';
            div.onclick = function() {
                Stk(this.from, this.to);
            };
            document.getElementsByClassName('f-tabs-l')[0].appendChild(div);
        }
    }

    Start();

    for (i = 0; i < Stickers.length; i++) {
        for (x = 0; x < Stickers[i].length; x++) {
            Image(i, x);
        }
    }

    for (i = 0; i < Popular.length; i++)
            document.getElementsByClassName('f-stkrs-w f-mid-fill-h')[0].children[Popular[i]].style.display = 'initial';

    document.getElementsByClassName('f-tab f-tab-popular f-h f-active')[0].addEventListener('click', function() {
        for (i = 0; i < document.getElementsByClassName('f-stkrs-w f-mid-fill-h')[0].children.length; i++)
            document.getElementsByClassName('f-stkrs-w f-mid-fill-h')[0].children[i].style.display = 'none';

        for (i = 0; i < Popular.length; i++)
            document.getElementsByClassName('f-stkrs-w f-mid-fill-h')[0].children[Popular[i]].style.display = 'initial';
    });

    window.addEventListener('resize', function() {
        setTimeout(Start, 500);
    });
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        setTimeout(Ready, 1250);
        setTimeout(Start, 1250);
    }
};