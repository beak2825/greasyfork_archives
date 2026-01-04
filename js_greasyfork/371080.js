// ==UserScript==
// @name         Better Dual-agar
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add more stuff to default dual agar!
// @author       Zimek
// @match        *://dual-agar.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371080/Better%20Dual-agar.user.js
// @updateURL https://update.greasyfork.org/scripts/371080/Better%20Dual-agar.meta.js
// ==/UserScript==

// == Script version and author == //
$(`
<div id="ver">
<h4>Better Dual-agar <b>0.4</b></h4>
<h5>by <b>Zimek</b></h5></br>
</div>
`).insertAfter("#BT_SPECTATE");
// ==  == //


// == Some css stuff == //
$("div#lb_caption.header").remove();
$("#nick").css("border-radius", "5px");
$("div.base").css("height", "530px");
$("#mainPanel").css("height", "542px");
$("div#profile-pic").css("height", "494px");
$("#div_lb").css("border-radius", "5px");
$("#team_name").css("border-radius", "5px");
$("#chatroom").css("border-radius", "15px");
$("#div_score").css("border-radius", "5px");
$("canvas#minimap").css("border-radius", "5px");
$("ul.nav nav-tabs").css("width", "310px");
$("#chatboxArea2").css("margin-bottom", "-40px");
$("div#pinfo").css("font color", "red");
$("#hideui").css("width", "30px");
$("#input_box2").css("border-radius", "20px");
$("#input_box2").css("width", "600px");
$("input#input_box2").css("margin-bottom", "10px");
$("head").append('<style type="text/css"></style>');
$("#server_instruction_text").remove();
$("#site_instruction_container").remove();
var newStyleElement = $("head").children(':last');
newStyleElement.html(".msg { color:#FFF; }");
// ==  == //

// == Chat emojis replacement == //
var replacement = {
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
    ':joy': '😂',
    ':think': '🤔',
    ':ok': '👌',
    ':facepalm': '🤦',
    ':up': '👍',
    ':fu': '🖕',
    ':clap': '👏',
    ':hey': '👋',
    ':(': '🙁',
    ':)': '😃',
    ':D': '😄',
    ';(': '😢',
    ';D': '😂',
    '<3': '❤️',
    'D;': '😩',
    'D:': '😦',
    '-_-': '😑',
    '-,-': '😒',
    'B)': '😎',
    '>(': '😡',
    ':O': '😯',

};
// ==  == //

// == Emojis == // Emojis script and working by Havoc
$("#input_box2").on("keyup", function() {
  var detected = $("#input_box2").val();
  for(var found in replacement){
    if(replacement.hasOwnProperty(found)){
      detected = detected.replace(found,replacement[found]);
    }
  }
  $(this).val(detected);
});

$(`
<div id="emojis1">
<div class="unicodeEmojiContainer" style="width: 100%;display:  inline;width: 580px; margin-left: 10px;background-color: rgba(0,0,0,0.7);border: 1px solid #63f7ff;padding: 5px 15px 5px 15px;margin-bottom: 5px;overflow: hidden;border-radius: 10px;display:none;">
/shrug, /lenny, /love, /dance, /lol, /nut, /tableflip, /dead, /sweet, /fight
</div>
<div class="unicodeEmojiContainer" style="width: 100%;display:  inline;width: 580px; margin-left: 10px;background-color: rgba(0,0,0,0.7);border: 1px solid #63f7ff;padding: 5px 15px 5px 15px;margin-bottom: 5px;overflow: hidden;border-radius: 10px; display:none;">
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/b731b88b6459090c02b8d1e31a552c5a.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/f71a48ebe4ebb6c0fb771721248d7523.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/468d61fd9fd55d3f5d905005d2180daa.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/f0835a46b501ae0a182874b003fdbb65.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/65bd38c1796f4959df4028fdf06aaf8f.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/10d135bf11670b6db1db682a512da004.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/17ce9728ad8efb8ffe2fa41f60c169be.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/cad1882ca3eeb04e786bc5d63e44477d.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/b78035b8e2a6a4885d4448198963a14e.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/add1f87676ce1d709db3efd005873142.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/2a6e66e7de157c4051fb7abf7d8b0063.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/cae9e3b02af6e987442df2953de026fc.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/53ef346458017da2062aca5c7955946b.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/b277c5ffb43011a356200198cf76b22d.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/1b6c783f128fe9fa93aee4d32a7013d6.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/6fc965fbef1b4aeb6167f652cd0544fc.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/b6f700d4bc253abdb5ad576917b756d8.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/2af915882260fdb89538d1610e1d9baa.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/07ede26f668b74a5fbeefff6eb35e15e.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/76292b41a5fa5408d92f674ebf4b7326.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/209381ec0f39a61c1904269ed41c62eb.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/f1f76882104c8724124954b6edfed6d4.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/0702847ec6fe5542f0829e09e0c5bb22.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/d56fc4f12b790c6cef7b08a515e4cce9.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/9bd8b85559466379744360f8c9841f39.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/d0df7bf4acd843defa4e417cf767a574.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/a9257530099447e1e7846cf269d16948.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/2fe6cd31e65e7a614dce24755303878b.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/69cc1b4583611ccc6a5652d1ddaee8fc.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/df108c82f499b630411d1fc6594f3717.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/2e1d6b723adec95eaa2a500141cf136d.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/7e4f6dcf32845bfa865cf17491faf867.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/752d516f9363ed1a2ea60eace20ff801.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/79b9eb736bd31cd7d9ed23046929fda0.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/593c4a3437fbb5b89fbb148f7b96424d.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/dcbf6274f0ce0f393d064a72db2c8913.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/8fee3f6705505729fea8c7379934d794.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/a2d0c0f7e2a7219cb5f9b951bba19437.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/0e2bb36113661c72bb9b3b4e5c834f97.svg"></div>
    <div class="unicodeemoji"><img src="https://discordapp.com/assets/6f1049fe11f5b6bc18d9227fb29d237b.svg"></div>
</div>
</div>
`).insertBefore("#input_box2");
$('<style>.unicodeemoji { float: left; width: 27px; padding: 1.5px; cursor: pointer; }</style>').appendTo('body');
$('#chatboxArea2').css({ "display": 'flex', "flex-direction": 'column'});
var unicodeemojis = ['😃','😦','😟','😄','😠','😡','😤','😯','😕','😆','😢','😂','🤔','😉','😏','👉','👌','👍','😑','😒','🖕','😔','😓','😅','😱','😎','🤢','😣','😈','🙄','😩','😍','😘','👏','👋','❤️','💔','🤦','💪','💯',];
$(document).ready(function() {
  $('.unicodeemoji').click(function() {
      $('#input_box2').val($('#input_box2').val() + unicodeemojis[$(this).index()]);
      document.getElementById("input_box2").focus();
  });
});

$(`
<div id="emojis" style="margin-left: 50px;padding: 2px;"><button id="emojistoggle" style="height: 21px;width: 500px;border-radius: 40px;background-color: #96e1ff;border: 2px solid #75d7ff;"><font-size="10px>E M O J I S</font></button>
`).insertAfter("#emojis1");
// ==  == //


// == W fast macro == //
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
    if (event.keyCode == 87) { // Macro W
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
// ==  == //

// == Custom leaderboard header == //
$(`
<input class="header" type="text" maxlength="11" style=";font-color:#ffa8e2; padding: 5px;margin-bottom: 5px; height: 30px;width: 190px;font-size: 25px;text-align:center;color:#ffa8e2;" value="LEADERBOARD"></input>
`).insertBefore("div#lb_detail");
// ==  == //


// == Some old stuff == //
//$(`
//<div id="moreemojis" style="margin-left: 5px;">
//<a href="http://zimek.byethost24.com/more-emojis/" target="_blank">More emojis</a>
//</div>
//`).insertAfter("input#input_box2");
// ==  == //

// == Show/hide gui in game buttons & script to work == //
$(`
<button id="toggleshit0" style="width: 35px; height: 35px;margin-top: 270px;margin-right: 10px;float: right;border-radius: 80px;background-color: transparent;border: none !important;"><img src="https://i.imgur.com/4C7SDok.png" width="28px" height="28px"/></button>
<button id="toggleshit1" style="width: 35px; height: 35px;margin-top: 310px;margin-right: -35px;float: right;border-radius: 80px;background-color: transparent;border: none !important;"><img src="https://i.imgur.com/MBcU6YJ.png" width="25px" height="25px"/></button>
<button id="toggleshit2" style="width: 35px; height: 35px;margin-top: 350px;margin-right: -35px;float: right;border-radius: 80px;background-color: transparent;border: none !important;"><img src="https://i.imgur.com/WlkPZlT.png" width="25px" height="25px"/></button>
`).insertAfter("div#div_lb");

//$('button#toggleshit').click(() => $("div#chatroom").remove()); //old stuff xd

//Toggle ALL
$(document).ready(function(){
    $("#toggleshit0").click(function(){
        $("div#chatroom").toggle();
        $("div#server_debug_status_texts_box").toggle();
        $("div#latency_box").toggle();
        $("div#pinfo").toggle();
        $("canvas#minimap").toggle();
        $("canvas#minimapNode").toggle();
        $("div#div_lb").toggle();
    });
});

//Toggle some

$(document).ready(function(){
    $("#toggleshit1").click(function(){
        $("div#chatroom").toggle();
        $("div#server_debug_status_texts_box").toggle();
        $("div#latency_box").toggle();
        $("div#pinfo").toggle();
    });
});

$(document).ready(function(){
    $("#emojistoggle").click(function(){
        $("div.unicodeEmojiContainer").toggle();
    });
});

//Reload ALL

$(document).ready(function(){
    $("#toggleshit2").click(function(){
        $("div#chatroom").show();
        $("div#server_debug_status_texts_box").show();
        $("div#latency_box").show();
        $("div#pinfo").show();
        $("canvas#minimap").show();
        $("canvas#minimapNode").show();
        $("div#div_lb").show();
    });
});
// ==  == //

// == Author youtube channel and discord == //
$(`
<img height="10px" width="100%" src="https://i.imgur.com/CAoDQyn.png"/>
<script src="https://apis.google.com/js/platform.js"></script>

</br><div class="g-ytsubscribe" data-channelid="UCzQLS2sTAPAYH7qyj0FXP3w" data-layout="full" data-count="default"></div></br><a href="https://discord.gg/UXtz2bW" target="_blank">Join my discord</a></br>
</div>
`).insertAfter("table");
// ==  == //

// == Skins button & page == //
$(`
<div id="imgurbutton" style="margin-left: 55px; margin-top: 20px;"><button id="imgurtoggle" style="height: 45px;width: 90px;border-radius: 5px;background-color: #01bf1e;border: 2px solid #01bf1e;">SKINS</button>
`).insertAfter("div#preview-img-area2");

$(`
<div id="imgurweb" style="display: none;" class="modal fade in" role="dialog">
<div id="imgurpanel" class="agario-panel" style="width: 94%; height: 90%; margin-left: 3%; margin-top: 2%; box-shadow: 2px 2px 8px 2px #000000;">

<button id="hideimgur" style="border-radius: 5px;background-color: #ff263f;border: 2px solid #ff263f; width: 60px; height:40px;float: right;"><img src="https://i.imgur.com/YogZIOH.png" width="35px" height="35px"/></button>

<div style="float: left; padding: 10px;"><a href="https://sniikz.com/skins/" target="skinspage"><font color="#89fffd" size="5px"><b>Sniikz skins</a></font></b></div>
<div style="float: left; padding: 10px;"><a href="http://www.agario-skins.top/exclusive-skins/" target="skinspage"><font color="#89fffd" size="5px"><b>Agar.io skins</a></font></b></div>
<div style="float: left; padding: 10px;"><a href="https://ogario.ovh/skins/" target="skinspage"><font color="#89fffd" size="5px"><b>Ogario skins</a></font></b></div>

<iframe id="skinspage" name="skinspage" src="https://sniikz.com/skins/" width="95%" height="93%" frameborder="0"></iframe>

</div>
</div>
`).insertAfter("div#hotkeys_setting");



//$(` `).insertAfter("div#hotkeys_setting"); //old shit lul

$(document).ready(function(){
    $("#imgurtoggle").click(function(){
        $("#imgurweb").show();
    });
});

$(document).ready(function(){
    $("#hideimgur").click(function(){
        $("#imgurweb").hide();
    });
});
// ==  == //

// == Nicks Button and page == //
$(`
<div id="nicksbutton" style="margin-left: 55px; margin-top: 100px;"><button id="nickstoggle" style="height: 45px;width: 90px;border-radius: 5px;background-color: #1198ff;border: 2px solid #1198ff;">NICKS</button>
`).insertAfter("div#preview-img-area2");

$(`
<div id="nicksweb" style="display: none;" class="modal fade in" role="dialog">
<div id="nickspanel" class="agario-panel" style="width: 94%; height: 90%; margin-left: 3%; margin-top: 2%; box-shadow: 2px 2px 8px 2px #000000;">

<button id="hidenicks" style="border-radius: 5px;background-color: #ff263f;border: 2px solid #ff263f; width: 60px; height:40px;float: right;"><img src="https://i.imgur.com/YogZIOH.png" width="35px" height="35px"/></button>

<!--<div style="float: left; padding: 10px;"><a href="http://fancytext.blogspot.com/" target="nickspage"><font color="#89fffd" size="5px"><b>Fancy nicks</a></font></b></div>
<div style="float: left; padding: 10px;"><a href="http://www.agario-skins.top/exclusive-skins/" target="nickspage"><font color="#89fffd" size="5px"><b>Agar.io skins</a></font></b></div>
<div style="float: left; padding: 10px;"><a href="http://copy.r74n.com/unicode/longest" target="nickspage"><font color="#89fffd" size="5px"><b>Longest symbols</a></font></b></div> -->

<iframe id="nickspage" name="nickspage" src="http://fancytext.blogspot.com/" width="95%" height="95%" frameborder="0"></iframe>

</div>
</div>
`).insertAfter("div#hotkeys_setting");



//$(` `).insertAfter("div#hotkeys_setting");

$(document).ready(function(){
    $("#nickstoggle").click(function(){
        $("#nicksweb").show();
    });
});

$(document).ready(function(){
    $("#hidenicks").click(function(){
        $("#nicksweb").hide();
    });
});
// ==  == //

// == Background changers buttons & script to work == //
$(`
<div id="bgchangers">
<div style="padding: 1%;margin-top: 10%;">
<button id="bgbutton1" style="height: 25px;width: 24%;border-radius: 2px;background-color: #003a99;border: 2px solid #003a99;float: left;margin-left: 1%;">BG1</button>
<button id="bgbutton2" style="height: 25px;width: 24%;border-radius: 2px;background-color: #003a99;border: 2px solid #003a99;float: left;margin-left: 1%;">BG2</button>
<button id="bgbutton3" style="height: 25px;width: 24%;border-radius: 2px;background-color: #003a99;border: 2px solid #003a99;float: left;margin-left: 1%;">BG3</button>
<button id="bgbutton4" style="height: 25px;width: 24%;border-radius: 2px;background-color: #003a99;border: 2px solid #003a99;float: left;margin-left: 1%;">BG4</button>
</div></br>
<div style="padding: 1%;margin-top: 1%;">
<button id="bgbutton5" style="height: 25px;width: 24%;border-radius: 2px;background-color: #c60009;border: 2px solid #c60009;float: left;margin-left: 1%;">BG5</button>
<button id="bgbutton6" style="height: 25px;width: 24%;border-radius: 2px;background-color: #c60009;border: 2px solid #c60009;float: left;margin-left: 1%;">BG6</button>
<button id="bgbutton7" style="height: 25px;width: 24%;border-radius: 2px;background-color: #00ba12;border: 2px solid #00ba12;float: left;margin-left: 1%;">BG7</button>
<button id="bgbutton8" style="height: 25px;width: 24%;border-radius: 2px;background-color: #eaeaea;border: 2px solid #eaeaea;float: left;margin-left: 1%;">BG8</button>
</div></br>
`).insertAfter("div#preview-img-area2");

$(document).ready(function(){
    $("#bgbutton1").click(function(){
        $("img#bgimg1").toggle();
        $("img#bgimg2").hide();
        $("img#bgimg3").hide();
        $("img#bgimg4").hide();
        $("img#bgimg5").hide();
        $("img#bgimg6").hide();
        $("img#bgimg7").hide();
        $("img#bgimg8").hide();
    });
});
$(document).ready(function(){
    $("#bgbutton2").click(function(){
        $("img#bgimg2").toggle();
        $("img#bgimg1").hide();
        $("img#bgimg3").hide();
        $("img#bgimg4").hide();
        $("img#bgimg5").hide();
        $("img#bgimg6").hide();
        $("img#bgimg7").hide();
        $("img#bgimg8").hide();
    });
});
$(document).ready(function(){
    $("#bgbutton3").click(function(){
        $("img#bgimg3").toggle();
        $("img#bgimg2").hide();
        $("img#bgimg1").hide();
        $("img#bgimg4").hide();
        $("img#bgimg5").hide();
        $("img#bgimg6").hide();
        $("img#bgimg7").hide();
        $("img#bgimg8").hide();
    });
});
$(document).ready(function(){
    $("#bgbutton4").click(function(){
        $("img#bgimg4").toggle();
        $("img#bgimg2").hide();
        $("img#bgimg3").hide();
        $("img#bgimg1").hide();
        $("img#bgimg5").hide();
        $("img#bgimg6").hide();
        $("img#bgimg7").hide();
        $("img#bgimg8").hide();
    });
});

$(document).ready(function(){
    $("#bgbutton5").click(function(){
        $("img#bgimg5").toggle();
        $("img#bgimg2").hide();
        $("img#bgimg3").hide();
        $("img#bgimg4").hide();
        $("img#bgimg1").hide();
        $("img#bgimg6").hide();
        $("img#bgimg7").hide();
        $("img#bgimg8").hide();
    });
});
$(document).ready(function(){
    $("#bgbutton6").click(function(){
        $("img#bgimg6").toggle();
        $("img#bgimg2").hide();
        $("img#bgimg3").hide();
        $("img#bgimg4").hide();
        $("img#bgimg5").hide();
        $("img#bgimg1").hide();
        $("img#bgimg7").hide();
        $("img#bgimg8").hide();
    });
});
$(document).ready(function(){
    $("#bgbutton7").click(function(){
        $("img#bgimg7").toggle();
        $("img#bgimg2").hide();
        $("img#bgimg3").hide();
        $("img#bgimg4").hide();
        $("img#bgimg5").hide();
        $("img#bgimg6").hide();
        $("img#bgimg1").hide();
        $("img#bgimg8").hide();
    });
});
$(document).ready(function(){
    $("#bgbutton8").click(function(){
        $("img#bgimg8").toggle();
        $("img#bgimg2").hide();
        $("img#bgimg3").hide();
        $("img#bgimg4").hide();
        $("img#bgimg5").hide();
        $("img#bgimg6").hide();
        $("img#bgimg7").hide();
        $("img#bgimg1").hide();
    });
});
$(`
<img id="bgimg1" name="bgimg1" style="display: none;" width="100%" height="100%" src="https://i.imgur.com/Lr6zwOD.png">
<img id="bgimg2" name="bgimg2" style="display: none;" width="100%" height="100%" src="https://i.imgur.com/KDF9WOo.png">
<img id="bgimg3" name="bgimg3" style="display: none;" width="100%" height="100%" src="https://i.imgur.com/i2Wj5N8.png">
<img id="bgimg4" name="bgimg4" style="display: none;" width="100%" height="100%" src="https://i.imgur.com/JyKjOuU.png">
<img id="bgimg5" name="bgimg5" style="display: none;" width="100%" height="100%" src="https://i.imgur.com/j79ybFh.png">
<img id="bgimg6" name="bgimg6" style="display: none;" width="100%" height="100%" src="https://i.imgur.com/2F6SWcR.png">
<img id="bgimg7" name="bgimg7" style="display: none;" width="100%" height="100%" src="https://i.imgur.com/JTctFQ5.png">
<img id="bgimg8" name="bgimg8" style="display: none;" width="100%" height="100%" src="https://i.imgur.com/OQ89sGG.png">
`).insertAfter("#overlays");
// ==  == //

// == Music player == // Wimpy music player

//$(`
//<div style="margin-left: -25px;"><iframe src="http://zimek.byethost24.com/music/" frameborder="0" scrolling="no" width="350px"></iframe></div>
//`).insertAfter("div#ver");

// ==  == //


// == X button for chat == //
//$(`
//<button id="removechat" style="width: 35px; height: 35px;float: left;margin-left: 410px;padding:5x;border-radius: 80px;background-color: transparent;border: none !important;"><img src="https://i.imgur.com/f5PSX48.png" width="20px" height="20px"/></button>
//`).insertAfter("div#div_score");

$(document).ready(function(){
    $("#removechat").click(function(){
        $("#chatroom").hide();
});
});
// ==  == //

// == Anti select == //
//$(`
//<script>
//  function disableselect(e){
//  return false
//  }
//  function reEnable(){
//  return true
//  }
//  document.onselectstart=new Function ("return false")
//  if (window.sidebar){
//  document.onmousedown=disableselect
//  document.onclick=reEnable
//  }
//</script>
//`).insertAfter("style");
// ==  == //