// ==UserScript==
// @name         YannDaiWeeb Extractor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Yann
// @match        https://www.daiweeb.org/terakoya/*
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374679/YannDaiWeeb%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/374679/YannDaiWeeb%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var id= document.URL.substr(document.URL.lastIndexOf("/") +1)
    var url = "https://www.daiweeb.org/api/" + id;
    // this part converts the VTT format (Web Video Text Tracks Format) into SRT
    // and converts ruby into anki's furigana syntax
    var timing_reg = /(\d{2}:\d{2}:\d{2})\.(\d{3})/g
    var timing_rep = "$1,$2"

    var ruby_reg = /<ruby><rb>([^<>]+)<\/rb><rt>([^<>]+)<\/rt><\/ruby>/g
    var ruby_rep = " $1[$2]"

    function to_srt(data) {
        var lines = []
        for(const [index, value] of data.entries()){
            lines.push('');
            lines.push(index+1);
            lines.push(value['timing'].replace(timing_reg,timing_rep));
            lines.push((value['text']).replace(ruby_reg,ruby_rep).replace("\n","").trim())
        }
        return lines.join("\n");
    }

    // shit that decrypt the vtt file and the useless url of the video
    function pass1(e, t) {
        var n = "";
        for (var o = 0; o < e.length; o += t.length)
            for (var i = 0; i < t.length && o + i < e.length; i++)
                n += String.fromCharCode(
                    pass2(e[o + i].charCodeAt(0).toString(10),
                          t[i].charCodeAt(0).toString(10)));
        return n
    }

    function pass2(e, t) {
        return (e | t) & (~e | ~t)
    }

    function decrypt_subs(e) {
        e = decodeURIComponent(e);
        var o = parseInt(e.substr(100, 4))
        var i = parseInt(e.substr(200, 4));
        var n = e.substring(o, i);
        var r = e.substr(1024);
        return pass1(r, n)
    }


    function func_a(e) {
        return func_s(e)
    }

	function func_s(e) {
        var t = decodeURIComponent(e);
        return func_u(t)
    }

	function func_u(e) {
        for (var t = e.length, n = "", r = 0; r < e.length; r++) {
            var o = e.charCodeAt(r)
              , i = o ^ t;
            n += String.fromCharCode(i)
        }
        return n
    }



    const decrypt_url = function(e) {
        var w = decodeURIComponent(decodeURIComponent(e));
        for (var t = e.length, n = "", r = 0; r < e.length; r++) {
            var o = e.charCodeAt(r)
            , i = o ^ t;
            n += String.fromCharCode(i)
        }
        return n
}

    $.ajax({
        url: url
    }).done(function(obj, status) {
        var jumbled_subs = obj.episode.cues;
        var jumbled_vid_url  = obj.episode.video_url_720p;
        var name = obj.episode.main_text_eng;
        console.log("name: ",name);
        var decrypted_vid_url = func_a(decodeURIComponent(jumbled_vid_url));
        console.log("vid:", decrypted_vid_url);
        var decrypted_subs = decrypt_subs(jumbled_subs.replace("data:image/jpeg;base64,", ""))
        var vtt = JSON.parse(decrypted_subs);
        var srt = to_srt(vtt);
        createLink(name+ ".srt", srt)
        createdownload(decrypted_vid_url)
    });

    function createLink(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.text = "Download Subs"
        element.style.color = "white"

        document.body.appendChild(element);
        jQuery(".tk-search-bar-spacer ").after(element)
    }

    function createdownload(src) {
        var element = document.createElement('a');
        element.setAttribute('href', src);
        element.text = "Download Video"
        element.style.color = "white"
        element.style.marginRight = "10px"

        document.body.appendChild(element);
        jQuery(".tk-search-bar-spacer ").after(element)
    }


    // Your code here...
})();