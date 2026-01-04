// ==UserScript==
// @name         Alis.io userscript
// @description  Add more stuff to alis like Background color changer, emojis to chat, fixed chatbox, ad removal, facebook name removal and more stuff.
// @namespace    http://tampermonkey.net/
// @version      2.1.6
// @author       Credits: Havoc, Sonic.EXE
// @match        http://alis.io/*
// @match        *://*.alis.io/*
// @run-at       document-end
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/371461/Alisio%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/371461/Alisio%20userscript.meta.js
// ==/UserScript==


// ==Chat resizing & Ads removal from razor's script & some css stuff==
$("#chatroom").css("height", "350px");
$("#chatroom").css("bottom", "30px");
$("#nick").css("border-radius", "5px");
$("#team_name").css("border-radius", "5px");
$("#chatroom").css("border-radius", "5px");
$("#hideui").css("width", "30px");
$("#input_box2").css("border-radius", "5px");
$("head").append('<style type="text/css"></style>');
$("#input_box2").css("width", "600px");
$("#input_box2").css("margin-left", "-100px");
$("div#coingrid").css("margin-top", "10px");
var newStyleElement = $("head").children(':last');
newStyleElement.html(".msg { color:#FFF; }");

$("div#ad_main").remove(); //Ad remover
$("h3.uk-card-title").remove(); //Privacy name (removing facebook name)
// ==/==


//==Swear word and emoji==
var replacement = {
    'fuck': 'fuсk',
	'shit': 'shіt',
	'cunt': 'сunt',
    'script': 'scr𝚒pt',
    'nosx': 'nоsx',
    'color': 'cоlоr',
    'troll': 'trоll',
    'gaver': 'g𝚊ver',
    'camp': 'cаmp',
    'alis': 'alіs',
    'team': 'teаm',
    '.io': '.іo',
    'bitch': 'bіtch',
    '/shrug': '¯\\_(ツ)_/¯',
    '/lenny': '( ͡° ͜ʖ ͡°)',
    '/love': '♥‿♥',
    '/dance': '~(˘▾˘~)',
    '/lol': '˙ ͜ʟ˙',
    '/nut': '█▀█ █▄█ ▀█▀',
    '/tableflip': '(╯°□°）╯︵ ┻━┻',
    '/dead': '(✖╭╮✖)',
    '/sweet': '^̮^',
    '/fight': '(ง •̀_•́)ง',
    '/totem': '◉_◉',
    ':smile': '😃',
    ':sad': '😦',
    ':happy': '😄',
    ':mad': '😠',
    ':angry': '😡',
    ':triumph': '😤',
    ':wow': '😯',
    ':cry': '😢',
    ':joy': '😂',
    ':thinking': '🤔',
    ':fku': '🖕',
    ':up': '👍',
    ':ok': '👌',
    ':smirk': '😏',
    ':heart': '💗',
    ':worried': '😟',
    ':pensive': '😔',
    ':sweat': '😓',
    ':sweatsmile': '😅',
    ':scream': '😱',
    ':cool': '😎',
    ':wink': '😉',
    ':eyes': '🙄',
    ':clap': '👏',
    ':wave': '👋',
    ':facepalm': '🤦',
    ':less': '😑',
    ':una': '😒',
    ':plsno': '😩',
    ':cafe': '☕',
    ':down': '👎',
    ':hand': '✋',
    ':fingers': '✌',
    ':moon': '🌑',
    ':wave': '🌊',
    ':earth': '🌍',
    ':flower': '🌼',
    ':hole': '🌌',
    ':sun': '🌞',
    ':lucky': '🍀',
    ':star': '⭐',
    ':rainbow': '🌈',
    ':prize': '🎁',
    ':play': '🎮',
    ':ice': '🍦',
    ':milk': '🥛',
    ':santa': '🎅',
    ':music': '🎵',
    ':cake': '🍰',
    ':sing': '🎤',
    ':bh': '💔',
    ':phone': '📞',
    ':tv': '📺',
    ':poop': '💩',
    ':water': '💦',
    ':locked': '🔐',
    ':money': '💲',
    ':unlocked': '🔓',
    ':nsfw': '🔞',
    ':wc': '🚾',
    ':car': '🚗',
    ':bath': '🛁',
    ':donthear': '🙉',
    ':donttalk': '🙉',
    ':dontsee': '🙈',
    ':internet': '🌐',
    ':glass': '🕶',
    ':toilet': '🚽',
    ':door': '🚪',
    ':boy': '🧑',
    ':girl': '👧',
    ':police': '👮‍♂️',
    ':baby': '👶',
    ':rockmusic': '🤟',
    ':anonymous': '👤',
    ':clock': '⌚️',
    ':gun': '🔫',
    ':mail': '📪',
    ':goback': '🔙',
    ':tm': '™️',
    ':copy': '©️ ',
    ':rainflag': '🏳️‍🌈',
    ':dead': '💀',
    ':flag': '🏳️',
    ':toxic': '☣️',
    ':100': '💯',
    ':bell': '🔔',
    ':wdym': '⁉️',
    ':?': '❓',
    ':!': '❗',
    ':vs': '🆚',
    ':(': '🙁',
    ':)': '😃',
    ':D': '😄',
    ';(': '😢',
    ';)': '😂',
    '<3': '💗',
    'D;': '😩',
    'D:': '😦',
    '-_-': '😑',
    '-,-': '😒',
    'B)': '😎',
    '>(': '😡',
    ':O': '😯',

};


$("#input_box2").on("keyup", function() {
  var detected = $("#input_box2").val();
  for(var found in replacement){
    if(replacement.hasOwnProperty(found)){
      detected = detected.replace(found,replacement[found]);
    }
  }
  $(this).val(detected);
});
// ==/==


// ==Unicode emojis==
$(`
<div class="unicodeEmojiContainer" style="width: 100%;display:  inline;width: 560px; margin-left: -93px;background-color: rgba(0,0,0,0.3);padding: 5px 15px 5px 15px;margin-bottom: 5px;overflow: hidden;border-radius: 10px;">
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/b731b88b6459090c02b8d1e31a552c5a.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/f71a48ebe4ebb6c0fb771721248d7523.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/f0835a46b501ae0a182874b003fdbb65.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/65bd38c1796f4959df4028fdf06aaf8f.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/10d135bf11670b6db1db682a512da004.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/17ce9728ad8efb8ffe2fa41f60c169be.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/cad1882ca3eeb04e786bc5d63e44477d.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/add1f87676ce1d709db3efd005873142.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/2a6e66e7de157c4051fb7abf7d8b0063.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/cae9e3b02af6e987442df2953de026fc.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/53ef346458017da2062aca5c7955946b.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/1b6c783f128fe9fa93aee4d32a7013d6.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/6fc965fbef1b4aeb6167f652cd0544fc.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/b6f700d4bc253abdb5ad576917b756d8.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/2af915882260fdb89538d1610e1d9baa.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/76292b41a5fa5408d92f674ebf4b7326.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/209381ec0f39a61c1904269ed41c62eb.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/dcbf6274f0ce0f393d064a72db2c8913.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/468d61fd9fd55d3f5d905005d2180daa.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/f1f76882104c8724124954b6edfed6d4.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/0702847ec6fe5542f0829e09e0c5bb22.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/d56fc4f12b790c6cef7b08a515e4cce9.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/9bd8b85559466379744360f8c9841f39.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/d0df7bf4acd843defa4e417cf767a574.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/b277c5ffb43011a356200198cf76b22d.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/df108c82f499b630411d1fc6594f3717.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/79b9eb736bd31cd7d9ed23046929fda0.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/593c4a3437fbb5b89fbb148f7b96424d.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/07ede26f668b74a5fbeefff6eb35e15e.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/a2d0c0f7e2a7219cb5f9b951bba19437.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/9e1c3ddc9da7effefe8a370b7c33ed7b.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/2e1d6b723adec95eaa2a500141cf136d.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/69cc1b4583611ccc6a5652d1ddaee8fc.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/3b32193b9673582d2704e53ec1056b6e.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/0e2bb36113661c72bb9b3b4e5c834f97.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/6f1049fe11f5b6bc18d9227fb29d237b.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/8fee3f6705505729fea8c7379934d794.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/612f3fc9dedfd368820b55c4cf259c07.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/4691e32e64eb0d4c43f29252415cfd61.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/c0c3d14224896d2c097631cfb1f0a1d1.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/ced0c08553c2ade6cbeee29a40f4ac8c.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/7e4f6dcf32845bfa865cf17491faf867.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/2fe6cd31e65e7a614dce24755303878b.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/b78035b8e2a6a4885d4448198963a14e.svg"></div>
</div>
`).insertBefore("#input_box2");
$('<style>.unicodeemoji { float: left; width: 22px; padding: 1.5px; cursor: pointer; }</style>').appendTo('body');
$('#chatboxArea2').css({ "display": 'flex', "flex-direction": 'column'});

var unicodeemojis = ['😃', '😦','😄','😠','😡','😤','😯', '😆', '😢', '😂','🤔','😏','👉','👌','👍','😒','🖕','❤️','😟','😔','😓','😅','😱','😎','😉','🙄','👏','👋','😑','🤦','👎','😩','😈','🙁','💪','💯','💔','🎉','🌈','🌸','💩','😍','😣','😕']; //some little help xd Toxin & zyhn
$(document).ready(function() {
  $('.unicodeemoji').click(function() {
      $('#input_box2').val($('#input_box2').val() + unicodeemojis[$(this).index()]);
      document.getElementById("input_box2").focus();
  });
});
// ==/== background color changer

$(`

<div><input style="position: absolute;
        margin-left: 280px;
        border-radius: 3px;
        bottom: 310px;
        border: 0;
        padding: 0px;
        height: 35px;
        width: 60px;" id="hx-chnl" type="color" value="">
        <style> #hx-chnl2{width: 400px; height: 40px;border-radius: 5px;margin-left: 0px; padding: 10px;margin-top: 10px; font-size: 23px;} #color{padding: 5px;}</style>
        <div id="color"><input id="hx-chnl2" class="uk-input" placeholder="NameColorGame" maxlength="20"></div></div></br></br>
<div>

<h3>Alis.io userscript 2.1.6</h3>
<h6>Credits: Havoc, Zimek</h6>

</div></br>

<!-- <div id="to"><button id="timeco" class="uk-button uk-button-default uk-button-small" href="http://zimek.byethost24.com/scripts/alisskrypt.js">Time change</button></div>
 <td><input type=button class="uk-button uk-button-default uk-button-small" value="z+" onclick="timeco()"></td> -->

`).insertAfter("#profilec");
$(`
<div id="moreemojis" style="margin-left: -95px;font-size: 15px;">
<a href="http://zimek.byethost24.com/more-emojis/" target="_blank">More emojis</a>
</div>

`).insertAfter("input#input_box2");

$(`
<a>Name Hidden</a>
`).insertBefore("div#coingrid");
//var button = document.getElementById('timeco');

//button.onclick = (function timeco() {
//  'use strict'; sweetAlert("Loading...");var waitForFb=setInterval(()=>{"number"==typeof userid?($("#swal2-title").text(`User ID detected ${userid}...`),clearInterval(waitForFb),checkColorChangeTime()):$("#swal2-title").text("Waiting for your Facebook account to load in...")},100),checkColorChangeTime=()=>{$.getJSON(`http://api.alis.io/api/users/${userid}/upgrades`,e=>{$("#swal2-title").text(`Retrieving data from ${userid}...`),$("#swal2-title").css("white-space","pre-line");var t=new Date(e.upgrades[0].updated_at).getTime();console.log(e.upgrades[0].updated_at);var a=setInterval(()=>{var e=t-(new Date).getTime()+6048e5,r=parseInt(e/864e5),l=parseInt(e%864e5/36e5),s=parseInt(e%36e5/6e4),i=parseInt(e%6e4/1e3);$("#swal2-title").text(`You can change your color in:\n${r}d ${l}h ${s}m ${i}s`),e<=0&&($("#swal2-title").text("You can change your color now."),clearInterval(a),$("#swal2-title").removeAttr("style")),$(".swal2-buttonswrapper").children(":first").click(()=>{clearInterval(a),$("#swal2-title").removeAttr("style")})},1e3)})};
//})();

// ==/==
(function() {
    'use strict';

    var input = document.getElementById("hx-chnl");
    input.value = localStorage.getItem("cardcolorback") || "";

    var input2 = document.getElementById("hx-chnl2");
    input2.value = localStorage.getItem("cardcolorback2") || "";

    $("#hx-chnl, #hx-chnl2").on("input", function() {
        localStorage.setItem("cardcolorback", input.value);
        localStorage.setItem("cardcolorback2", input2.value);
    });

    $("#hx-chnl").on("input", function() {
        var regIs = $(this).val();
        $("html").css("background", regIs);
        $("#hx-chnl2").val(regIs);
    });
    $("#hx-chnl2").on("input", function() {
        var regI = $(this).val();
        $("html").css("background", regI);
        $("#hx-chnl").val(regI);
    });

    return $("#hx-chnl, #hx-chnl2").trigger("input");
})();
document.addEventListener('mouseup', mouseup);
// == W macro
setInterval(function(){
    $('img[src="/assets/img/adblocker.png"]').remove();
    $('#ad_bottom').remove();
    $('.content>.text-center>.tab-pane>div#ad_main').remove();
}, 500);
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 1; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { // key W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key W
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}