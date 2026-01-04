// ==UserScript==
// @name         JVCrypt
// @namespace    hello://astrolopitheque.fr
// @version      2.1
// @description  Envoyez vos messages sans risque de censure avec JVCrypt !
// @author       astrolopitheque
// @match        https://www.jeuxvideo.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406490/JVCrypt.user.js
// @updateURL https://update.greasyfork.org/scripts/406490/JVCrypt.meta.js
// ==/UserScript==

/*jshint esversion:6*/

/*global jQuery, $*/
/*eslint no-undef: "error"*/
/*eslint no-multi-str: 0*/
/*eslint no-multi-spaces: 0*/

//2.1 Correction de bugs et ajout d'une limite de caractères pour éviter le flood

(function() {
    const COURT     = '\u200c',
          LONG      = '\u200d',
          SEPARATOR = '\u200e',
          DELIMITER = '\u200f';

    const charset = {
        'a': '.-',    'b': '-...',  'c': '-.-.',  'd': '-..',
        'e': '.',     'f': '..-.',  'g': '--.',   'h': '....',
        'i': '..',    'j': '.---',  'k': '-.-',   'l': '.-..',
        'm': '--',    'n': '-.',    'o': '---',   'p': '.--.',
        'q': '--.-',  'r': '.-.',   's': '...',   't': '-',
        'u': '..-',   'v': '...-',  'w': '.--',   'x': '-..-',
        'y': '-.--',  'z': '--..',  ' ': '/',     '-': '-....-',
        '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..',
        '9': '----.', '0': '-----',
    }

    jQuery.fn.exists = function(){return this.length > 0;}

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    function encodeMorse(str) {
        let morse = [];
        for(const c of str) {
            morse.push(charset[c].replaceAll('.', COURT).replaceAll('-', LONG));
        }
        return morse.join(SEPARATOR);
    }

    function decodeMorse(morse) {
        morse = morse.replaceAll(COURT, '.').replaceAll(LONG, '-').split(SEPARATOR);
        let str = '';
        for(const c of morse) {
            str += getKeyByValue(charset, c);
        }
        return str;
    }

    function stylize(text) {
        return new Promise((resolve, reject) => {
            $.post({ url: 'https://www.jeuxvideo.com/jvcode/forums.php', contentType: 'application/x-www-form-urlencoded', data: {'texte': text} })
                .done(data => resolve(data));
        });
    }

    function postText(text) {
        return new Promise((resolve, reject) => {
            $.post({ url: 'https://jsonblob.com/api/jsonBlob/', contentType: 'application/json', data: '"' + encodeURI(text) + '"' })
                .done((data, textStatus, jqXHR) => resolve(jqXHR.getResponseHeader('location').split('/').pop()));
        });
    }

    function fetchText(id) {
        return new Promise((resolve, reject) => {
            $.get({ url: 'https://jsonblob.com/api/jsonBlob/' + id })
                .done(data => resolve(decodeURI(data)));
        });
    }

    function addTextArea() {
        $('.text-editor').append(`<textarea id="jvcrypt"
                                  style="color: #36a5d1; background-color: #2e2e2e; border: solid #36a5d1 2px; border-radius: 3px;
                                  box-shadow: inset 20px 15px 20px 1px black; margin: 5px;
                                  min-height: 50px; min-width: calc(100% - 11px); max-width: calc(100% - 11px);
                                  "placeholder="Écrivez ici le message que vous voulez cacher. (30.000 caractères max.)"
                                  maxlength="30000"></textarea>`);
    }

    function addEvents() {
        $('#message_topic, #message').val('');
        $('.btn-poster-msg').one('click', async e => {
            e.preventDefault();
            const hidden  = $('#jvcrypt').val(),
                  visible = $('#message_topic').val() || $('#message').val() || '';
            if(hidden) {
                const id = await postText(hidden);
                $('#message_topic, #message').val(DELIMITER+DELIMITER+DELIMITER+visible+DELIMITER+encodeMorse(id));
            }
            $('.btn-poster-msg').trigger('click');
        });
    }

    function decodeMessages() {
        $('.txt-msg > p').each(async (i,e) => {
            const post = $(e).html().trim();
            if(post.substring(3,0) === DELIMITER+DELIMITER+DELIMITER) {
                const [visible, id] = post.substring(3).split(DELIMITER);
                let newPost = (await fetchText(decodeMorse(id))).substring(0,30000).trim();
                newPost += '.....'.repeat(newPost.length == 30000);
                newPost = await stylize(newPost);
                $('.txt-msg > p').eq(i).html(visible + '<br><br><pre class="pre-jv" style="color: #36a5d1; background-color: #2e2e2e; border: solid #36a5d1 2px; border-radius: 3px; \
                                                      box-shadow: inset 20px 15px 20px 1px black; width: 100%; line-height: 0.8rem"><code class="code-jv">' + newPost + '</code></pre>');
            }
        });
    }

    function initJVCrypt() {
        if(!$('#jvcrypt').exists()) {
            addTextArea();
        }
        addEvents();
        decodeMessages();
    }

    initJVCrypt();
})();