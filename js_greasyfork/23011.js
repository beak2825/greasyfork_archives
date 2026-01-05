// ==UserScript==
// @name          Facebook Reader
// @author        niqueish
// @description	  czyta posty z żydbuka
// @grant         none
// @version       1.0
// @include       *://*.facebook.com/*
// @require       http://code.jquery.com/jquery-2.2.1.min.js
// @require       https://greasyfork.org/scripts/21845-arrive-js/code/Arrivejs.js
// @namespace https://greasyfork.org/users/31125
// @downloadURL https://update.greasyfork.org/scripts/23011/Facebook%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/23011/Facebook%20Reader.meta.js
// ==/UserScript==


var active_color = "red"; //kolor aktywnego głośniczka

//GŁOSY - odkomentuj głos, którego chcesz używać

var TTS_BASE = 'https://tts.voicetech.yandex.net/tts?lang=pl_PL&format=mp3&quality=hi&text='; // oryginalny (Yandex, żeński)
//var TTS_BASE = 'http://api.ispeech.org/api/rest?apikey=d09fae94ffac75dc16fb8d23e3d562e8&deviceType=android&action=convert&voice=eurpolishfemale&text='; // (ispeech, żeński)

var audio_element;
var last_target;
var original_color;

function get_audio_url(text) {
    return TTS_BASE + encodeURIComponent(text);
}

function add_icon(post) {
 if (post.hasClass("readIcon"))return;
  $(post).find('.UFICommentActions').append('<span> · </span><a href="#" style="text-decoration: none;" class="readText" title="Czytaj komentarz">&#128266;</a>');
  post.addClass("readIcon");
}

function op_add_icon(post) {
 if (post.hasClass("readIcon"))return;
  $(post).find('a._5pcq').parent().append('<span> · </span><a href="#" style="text-decoration: none;" class="readText" title="Czytaj post">&#128266;</a>');
  post.addClass("readIcon");
}

$(document).on('click', 'a.readText' , function(e) {
   e.preventDefault();
    if (original_color === undefined){
        original_color = e.target.style.color;
    }
    if (last_target === e.target){
        if (audio_element.paused){
            audio_element.play();
            e.target.style.color = active_color;
        } else {
            audio_element.pause();
            audio_element.currentTime = 0;
            e.target.style.color = original_color;
        }
    } else {
        if (e.target.parentNode.parentNode.getElementsByClassName("UFICommentBody")[0]){
            clone = e.target.parentNode.parentNode.getElementsByClassName("UFICommentBody")[0].cloneNode(true);
        }
        else{
            //xD
            clone = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("userContent")[0].cloneNode(true);
        }
        links = clone.querySelectorAll('a:not(.profileLink)');
        for (i = 0; i<links.length; i++){
            links[i].parentNode.removeChild(links[i]);
        }
        text = clone.textContent.replace(/>/g, ";;");
        if(text){
        audio_url = get_audio_url(text);
        if (!audio_element) {
            audio_element = new Audio(audio_url);
            e.target.style.color = active_color;
            audio_element.addEventListener("ended", function() {last_target.style.color = original_color;});
        } else {
            audio_element.src = audio_url;
            last_target.style.color = original_color;
        }
        audio_element.play();
        e.target.style.color = active_color;
        last_target = e.target;
    }
    }
});

$("body").arrive(".UFICommentContentBlock:not(.readIcon)", {fireOnAttributesModification: true, existing: true}, function() { add_icon($(this));});
$("body").arrive("._4-u2.mbm._5v3q._4-u8:not(.readIcon)", {fireOnAttributesModification: true, existing: true}, function() { op_add_icon($(this));});