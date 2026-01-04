// ==UserScript==
// @name     FailyV Streams
// @match 	 https://stream.failyv.com/*
// @version  1.1
// @grant    none
// @namespace faily
// @license cc-by-sa-4.0
// @description Affiche uniquement l'aperçu des streams et permet de sélectionner les streams à ouvrir sur MultiTwitch
// @require  https://code.jquery.com/jquery-3.6.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/464631/FailyV%20Streams.user.js
// @updateURL https://update.greasyfork.org/scripts/464631/FailyV%20Streams.meta.js
// ==/UserScript==


function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}


// addGlobalStyle('#featured { display: none !important; }');
$('#featured').remove();


$('#carousel').attr('class', '').attr('id', 'newcarousel');
$('#headcarousel').attr('class', '').attr('id', 'newheadcarousel');
addGlobalStyle('#newcarousel li { margin: 3px; position: relative !important; width: 400px !important; height: 240px !important; margin: 0 !important; padding: 0 !important; display: inline-block !important; font-size: 0; }');
addGlobalStyle('#newcarousel li img { width: 100% !important; height: 100% !important; font-size: 0 ! important; }');
addGlobalStyle('#newcarousel ul { margin: 0 !important; padding: 0 !important; font-size: 0 ! important;}');
addGlobalStyle('#newcarousel li .checkbox { position: absolute; top: 10px; right: 10px; }');
addGlobalStyle('.row { line-height: 0; font-size:0; margin: 0 !important; padding: 0; }');

$("#newcarousel li").unbind();

$("#newcarousel li").each(function(index) {
	$(this).children('#channelName').attr('class', 'newChannelName').attr('id', null);
  var streamerName = $(this).children('.newChannelName').html();
  $(this).append('<div class="checkbox"><input type="checkbox" style="width: 40px; height: 40px" name="streamer-' + streamerName + '" data-streamer="' + streamerName + '" /></div>');
});

addGlobalStyle('.newChannelName { text-align: center; position: absolute; top: none; bottom: 0px; left: 0px; width: 100%; height: 24px; font-size: 22px !important; background-color: rgba(0,0,0,0.5); line-height: 24px; margin:0; padding-left: 3px; }');
addGlobalStyle('.newChannelName:hover { cursor: pointer }');

$('.newChannelName').click(function() {
  window.open('https://www.twitch.tv/' + $(this).html(), "_blank");
});


$('body').append('<input type="text" id="multi" style="width: 100%;" value="Sélectionnez des streams..." /><input type="button" id="multibutton" style="width: 100%" value="Sélectionnez des streamers" />');
$('#multi').css('display', 'none');

$("#newcarousel .checkbox").click(function() {
	var streamersList = Array();
  
  $('#newcarousel .checkbox input').each(function(i, obj) {
    	if($(this).is(':checked')) {
	      streamersList.push($(this).attr('data-streamer'));
      }
  });

  $('#multi').val('https://www.multitwitch.tv/' + streamersList.join('/'));
  $('#multibutton').attr('value', 'Ouvrir MultiTwich x' + streamersList.length + ' (' + streamersList.join(' , ') + ')');
});


$('#multibutton').click(function() {
	window.open($('#multi').val(), "_blank");  
});