// ==UserScript==
// @name          SCrypt
// @namespace     //
// @description   //
// @author        VjUwOUNhc3Npb3BlaWFl
// @include       http://www.jeuxvideo.com/forums/*
// @run-at        document-start
// @version       1.5
// @downloadURL https://update.greasyfork.org/scripts/32828/SCrypt.user.js
// @updateURL https://update.greasyfork.org/scripts/32828/SCrypt.meta.js
// ==/UserScript==

// ==UserScript==
// @name          SCrypt
// @namespace     //
// @description   //
// @author        VjUwOUNhc3Npb3BlaWFl
// @include       http://www.jeuxvideo.com/forums/*
// @run-at        document-start
// @version       1.2
// ==/UserScript==

setTimeout(function() {

    const msg = document.getElementById('message_topic'),
          post = document.querySelector('.btn-poster-msg'),
          img = document.getElementsByTagName('img'),
          length = img.length;

    var div = document.createElement('div'),
        button = document.createElement('button'),
        canPost = false,
        click = 0,
        _code, _decode;

    div.className = 'btn-group';
    button.className = 'xXx btn btn-jv-editor-toolbar';
    document.querySelector('.jv-editor-toolbar').appendChild(div);
    div.appendChild(button);
    button.innerHTML = 'Crypter';

    for (i = 0; i < length; i++) {
        if (img[i].alt.charAt(10) == "?") {
            var txt = document.createElement('p');
            var parent = img[i].parentElement;
            txt.style.color = '#0011FF';
            parent.appendChild(txt);
            var code = img[i].alt.substring(11, img[i].alt.length -2),
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
            msg.value = msg.value.replace('<crypt>', '[[sticker:?' + _code);
            msg.value = msg.value.replace('</crypt>', ']]');
        }
        canPost = true;
        post.click();
    });

}, 500);