// ==UserScript==
// @name         Shoutbox EveryWhere
// @namespace    null
// @version      1.3.1
// @description  Avoir la shoutbox sur tout le forum PCM
// @author       MarentDev
// @match        http://play-cid-modding.com/*
// @exclude http://play-cid-modding.com/
// @exclude http://play-cid-modding.com/taigachat/
// @grant        none
//Thx to the EvaChat Systeme Side !
// @downloadURL https://update.greasyfork.org/scripts/31749/Shoutbox%20EveryWhere.user.js
// @updateURL https://update.greasyfork.org/scripts/31749/Shoutbox%20EveryWhere.meta.js
// ==/UserScript==
$('body').addClass('Marent');
$('head').append('<link href="https://marent-dev.fr/realitygaming/realitygaming.css" rel="stylesheet" type="text/css">');
$('head').append('<link href="https://marent-dev.fr/realitygaming/realitygaming_taig.css" rel="stylesheet" type="text/css">');
$('head').append('<script src="https://marent-dev.fr/realitygaming/realitygaming.js"></script>');
$('body').prepend('<div id="evaChatMover"><div class="evaChatFlex"><ul></ul><ul class="navBottom"><li class="navTab evaToggleLock"><a onclick="Chatlock();" id="ChatLock" class=""></a></li><li class="navTab evaToggleChat"><a class="badge" onclick="chattoggle();" id="togglechat"></a></li>	</ul><ul></ul>	</div></div><div class="evaChatbox"><div class="section sectionMain nodeList taigachat_alt shoutbox_fullscreen  taigachat_normal" id="taigachat_full"><div class="nodeInfo categoryNodeInfo categoryStrip"><div class="categoryText"><h3 class="nodeTitle">Shoutbox (<span id="taigachat_count">0</span>)</h3></div></div><style>#taigachat_full #taigachat_box{background-image:url("styles/snk/overlays/overlay-bf1.png")!important;background-repeat:no-repeat!important;background-position:100% 100%!important;}</style><div class="section taigachat_normal" id="taigachat_full"><div><span class="taigachat_motd" id="taigachat_motd" style="text-align: center; display: block;"><div style="text-align: center"></div></span><div id="taigachat_controls"><div id="taigachat_input"><input type="submit" id="taigachat_send" value="" class="button primary"><div id="taigachat_message_holder"><input id="taigachat_message" class="textCtrl" type="text" maxlength="420" placeholder="Entrer un message..."></div></div><div id="taigachat_toolbar"><button id="taigachat_smiliepicker" class="button taigachat_bbcode xenForoSkin"><span class="taigachat_bbcode_smilie"></span></button></div></div><div id="taigachat_temp" style="display:none"></div><div id="taigachat_smilies_box"></div><div id="taigachat_box" class=""><ol></ol></div></div></div></div>');
$('body').prepend("<script> $(document).ready(function() {        var lock = $.getCookie('marent-locked');       var view = $.getCookie('marent-view');        if (lock == 'true'){         document.getElementById('ChatLock').click();   }    if(view == 'true'){ document.getElementById('togglechat').click();    }}); function Chatlock(){  var a = document.getElementsByTagName('body')[0].getAttribute('class');   if (a.indexOf('evaChatLock') != -1){  $.setCookie('marent-locked', false);     $('.evaToggleLock').removeClass('active'); 		 $('body').removeClass('evaChatLock');  document.getElementsByTagName('style')[0].remove(); }else { $('head').prepend('<style>a#togglechat:before{ display: none;}</style>');    $.setCookie('marent-locked', true);  $('.evaToggleLock').addClass('active');     $('body').addClass('evaChatLock');   }} function chattoggle() {var a = document.getElementsByTagName('body')[0].getAttribute('class');if (a.indexOf('evaChatActive') != -1){  $.setCookie('marent-view', false); $('.evaToggleChat').removeClass('active');$('body').removeClass('evaChatActive');}else { $.setCookie('marent-view', true); $('.evaToggleChat').addClass('active');$('body').addClass('evaChatActive');}}</script>");
