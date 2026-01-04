// ==UserScript==
// @name        kanshudo - check if primary is in srs
// @namespace   conquerist2@gmail.com
// @include     /^https://www.kanshudo.com/srs/review.*$/
// @include     /^https://www.kanshudo.com/srs/study.*$/
// @description kanshudo - notify if a card is only stored in a non-primary form
// @require  		http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require			https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @version     1.5
// @grant       GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/468933/kanshudo%20-%20check%20if%20primary%20is%20in%20srs.user.js
// @updateURL https://update.greasyfork.org/scripts/468933/kanshudo%20-%20check%20if%20primary%20is%20in%20srs.meta.js
// ==/UserScript==
// 2023 03 29 v0.1 - initial version
// 2023 06 18 v1.0 - first version on greasyfork
// 2023 06 18 v1.1 - wait for focus before opening tabs
// 2023 06 24 v1.2 - fixed popunder
// 2023 06 24 v1.3 - fixed popunder
// 2023 06 25 v1.4 - fixed popunder
// 2023 06 30 v1.5 - fixed popunder, changed flip mechanic (noflip class)

waitForKeyElements ("div.cvocab div#summary > div.jukugorow", actionFunction);

function actionFunction (jNode) {
  console.log('\n <--- actionfunction here');
  id = jNode.attr('id').match(/\d+/)[0];
  url = jNode.find('a.action:has(.ja-details)').attr('href');
  url_id = url.match(/\/(\d+)\?/)[1];
  url_text = url.match(/=(.*)/)[1];
  qs_url = jNode.find('a.action:has(.fa-search)').attr('href');
  ws_url = qs_url.replace(/searchq/,'searchw');
  text_and_id = url_text + '_' + url_id;
  
  ufn_node = jNode.find('div.ufn_container span');
  ufn = undefined;
  ufn_secondary = undefined;
  if(ufn_node.length) {
  	ufn = ufn_node.attr('class').match(/\d+/)[0];
  	ufn_secondary = ufn_node.hasClass('off');
  }
  
  jlpt_node = jNode.find('div.jlpt_container span');
  jlpt = undefined;
  jlpt_secondary = undefined;
  if(jlpt_node.length) {
    jlpt = jlpt_node.attr('class').match(/\d+/)[0];
  	jlpt_secondary = jlpt_node.hasClass('off');
  }
  
	console.log('id =       ' + id);
  console.log('url_id =   ' + url_id);
  console.log('url_text = ' + url_text);
  console.log('ufn =      ' + ufn);
  console.log('ufn_secondary =  ' + ufn_secondary);
  console.log('jlpt =     ' + jlpt);
  console.log('jlpt_secondary = ' + jlpt_secondary);
  console.log('text_and_id    = ' + text_and_id);
  
  // to find more test cases
  //if((ufn_secondary) || jlpt_secondary) {
  if((ufn_secondary && ufn <= 5) || jlpt_secondary) { 
  //if(true) {  
		console.log('!!!!!!!!!!!!!!!');
    console.log('!! secondary !!');
    console.log('!!!!!!!!!!!!!!!');
    knownWordsArray = localStorage['kanshudoWords'] ? JSON.parse(localStorage['kanshudoWords']) : [];
    console.log(knownWordsArray);
    
    $('<div/>', {
        class: 'secondary_container noflip',
        id: 'secondary_' + text_and_id,
        style: 'display: inline-block; margin-right: 4px; margin-top: 11px; height: 37px; text-align: center; cursor: pointer;'
      }).append($('<span/>')).insertBefore('.fav_container');
    
   
    if(knownWordsArray.includes(text_and_id)){
    	console.log(text_and_id + ' found in local storage');
      $('div.secondary_container span').text('✔\ufe0f');
      $('div.secondary_container span').on("click", {text_and_id: text_and_id}, removeFromLocalStorage);
    } else {
      console.log(text_and_id + ' not found in local storage'); 
      $('div.secondary_container span').text('❗\ufe0f');
      $('div.secondary_container span').on("click", {text_and_id: text_and_id}, popUnderHandler);
      $('div.secondary_container span').on("focus", {text_and_id: text_and_id}, popUnderHandler);
      popUnderfired = false;
      //$(document).focus(popUnderHandler);
      $(document).on("focus", {text_and_id: text_and_id}, popUnderHandler);
      if (!document.hidden) {
        console.log('popUnder fired via if(!document.hidden)')
        popUnder(text_and_id);
      }
      //$('div.secondary_container span').focus(popUnder);
      //popUnder(text_and_id);
    }

  }
  
  console.log('actionfunction end --->');
}

function popUnderHandler(event) {
  console.log('popUnder fired via popUnderHandler')
  text_and_id = event.data.text_and_id;
  popUnder(text_and_id);
}

function popUnder(text_and_id) {
  console.log('popUnder, text_and_id = ' + text_and_id);
  
  if(!popUnderfired) {
    popUnderfired = true;
    $('[id^=vdEntity_] a').each(function(i, obj) {
      tab_url = $(this).attr('href').replace(/searchq/,'searchw');
      console.log('entity = ' + i + ', tab_url = ' + tab_url);
      //window.open(tab_url);
      GM.openInTab(tab_url, true);
    });

    $('div.secondary_container span').text('⬜\ufe0f');
    $('div.secondary_container span').off("click");
    $('div.secondary_container span').on("click", {text_and_id: text_and_id}, addToLocalStorage);
  }
}

function addToLocalStorage(event) {
  text_and_id = event.data.text_and_id;
  console.log('addToLocalStorage, text_and_id = ' + text_and_id);
  
  $('div.secondary_container span').text('✔\ufe0f');
	$('div.secondary_container span').off("click");
  $('div.secondary_container span').on("click", {text_and_id: text_and_id}, removeFromLocalStorage);
  //$('div.secondary_container span').css('cursor', 'default');
  knownWordsArray = localStorage['kanshudoWords'] ? JSON.parse(localStorage['kanshudoWords']) : [];
  knownWordsArray.push(text_and_id);
  localStorage['kanshudoWords'] = JSON.stringify(knownWordsArray);
  console.log(knownWordsArray);
}

function removeFromLocalStorage(event) {
  text_and_id = event.data.text_and_id;
  console.log('removeFromLocalStorage, text_and_id = ' + text_and_id);
  
  $('div.secondary_container span').text('⬜\ufe0f');
	$('div.secondary_container span').off("click");
  $('div.secondary_container span').on("click", {text_and_id: text_and_id}, addToLocalStorage);
  //$('div.secondary_container span').css('cursor', 'pointer');
  knownWordsArray = localStorage['kanshudoWords'] ? JSON.parse(localStorage['kanshudoWords']) : [];
  knownWordsArray = knownWordsArray.filter(e => e !== text_and_id);
  localStorage['kanshudoWords'] = JSON.stringify(knownWordsArray);
  console.log(knownWordsArray);
}
