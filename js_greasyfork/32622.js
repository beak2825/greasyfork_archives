// ==UserScript==
// @name          V509Code
// @namespace     //
// @description   //
// @author        V509Cassiopeiae
// @include       http://www.jeuxvideo.com/forums/*
// @run-at        document-start
// @version       1.2
// @downloadURL https://update.greasyfork.org/scripts/32622/V509Code.user.js
// @updateURL https://update.greasyfork.org/scripts/32622/V509Code.meta.js
// ==/UserScript==

setTimeout(function() {

    const msg = document.getElementById('message_topic'),
          post = document.querySelector('.btn-poster-msg'),
          img = document.getElementsByTagName('img'),
          length = img.length;

    var div = document.createElement('div'),
        button = document.createElement('button'),
        txt = document.createElement('p'),
        canPost = false,
        click = 0,
        parent, code, decode, _code, _decode;

    div.className = 'btn-group';
    button.className = 'xXx btn btn-jv-editor-toolbar';
    document.querySelector('.jv-editor-toolbar').appendChild(div);
    div.appendChild(button);
    button.innerHTML = 'Crypter';

    for (i = 0; i < length; i++) {
        if (img[i].alt.charAt(10) == "_") {
            parent = img[i].parentElement;
            txt.style.color = '#0011FF';
            parent.appendChild(txt);
            code = img[i].alt.substring(11, img[i].alt.length -2);
            decode = atob(code);
            txt.innerHTML = decode;
        }
    }

    button.addEventListener('click', function(ev) {
        ev.preventDefault();
        if (click == 0) {
            click++;
            msg.value += '<crypt></crypt>';
            msg.focus();
            msg.selectionEnd = msg.value.search('</crypt>');
        } else alert("Vous ne devez envoyer qu'un message codé par message");
    });

    post.addEventListener('click', function(e) {
        if (!canPost) e.preventDefault();
        if (msg.value.search('<crypt>') != -1 && msg.value.search('</crypt>') != -1) {
            _decode = msg.value.substring(msg.value.search('<crypt>') + 7, msg.value.search('</crypt>'));
            _code = btoa(_decode);
            msg.value = msg.value.replace(msg.value.substring(msg.value.search('<crypt>') + 7, msg.value.search('</crypt>')), "");
            msg.value = msg.value.replace('<crypt>', '[[sticker:_' + _code);
            msg.value = msg.value.replace('</crypt>', ']]');
        }
        canPost = true;
        post.click();
    });

}, 500);