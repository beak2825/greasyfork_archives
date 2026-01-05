// ==UserScript==
// @name         YT DECRYPTER
// @namespace    YTDECRYPTER
// @version      1.0.0-RC1
// @description  Decrypt YT descriptions
// @author       JlXip
// @include https://www.youtube.com/*
// @require http://code.jquery.com/jquery-git.min.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @require https://greasyfork.org/scripts/130-portable-md5-function/code/Portable%20MD5%20Function.js?version=10066
// @require https://greasyfork.org/scripts/23618-jsaes/code/JSAES.js?version=150018
// @require https://greasyfork.org/scripts/23619-jsaes-wrapper/code/JSAES%20Wrapper.js?version=150219
// @license APACHE LICENSE 2.0
// @downloadURL https://update.greasyfork.org/scripts/23701/YT%20DECRYPTER.user.js
// @updateURL https://update.greasyfork.org/scripts/23701/YT%20DECRYPTER.meta.js
// ==/UserScript==


var YTD_key = null;
function YTD_setKey(plaintext_key) {
    YTD_key=AESW_init(hex_md5(plaintext_key));
}


function YTD_removeNullBytes(str) {	// Function that removes null bytes (0x00)
    return str.replace(/\0[\s\S]*$/g, '');
}


function YTD_decrypt(url) {
    var description = $('#eow-description').html();
    if(description.substr(0, 5) === "YTD: ") {
        var plaintext_key = prompt("An encrypted description of this video has been found.\nPassword required. Leave in blank for a regular use.");
        if(plaintext_key==="" || plaintext_key===null) { return; }
        YTD_setKey(plaintext_key);
        plaintext_key=null;

        var Bencrypted = description.substr(5, description.length);
        var NOBencrypted = atob(Bencrypted);
        var decrypted = AESW_decryptLongString(NOBencrypted, YTD_key);
        decrypted = YTD_removeNullBytes(decrypted);
        eval(decrypted);
    }
}


function YTD_encrypt(url) {
    var get_parameters = window.location.href.split('?')[1];

    var begin_key=get_parameters.split('key=')[1];
    var end_key=begin_key.split('&')[0];
    YTD_setKey(end_key);

    var begin_text=get_parameters.split('text=')[1];
    var end_text=begin_text.split('&')[0];

    var text = atob(end_text);
    var encrypted = btoa(AESW_encryptLongString(text, YTD_key));
    document.write("YTD: "+encrypted);
}


function YTD_start() {
    var url = window.location.href;
    if(url.substr(0, 36)==="https://www.youtube.com/user/EnCrypt") {
        YTD_encrypt(url);
    } else {
        YTD_decrypt(url);
    }
    stop();
}


(function() {
    waitForKeyElements('#eow-description', YTD_start);
})();