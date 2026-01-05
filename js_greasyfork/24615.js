// ==UserScript==
// @name         WaniKani Just The Vocab (Skip Radicals and Kanji)
// @namespace    wkskipradicalsandkanji
// @version      0.4
// @include     http://www.wanikani.com/review*
// @include     https://www.wanikani.com/review*
// @include     http://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/review/session*
// @description Skips radicals and kanji by automatically and invisibly getting them right in your WaniKani reviews so that you only see vocabulary reviews. For those who feel that vocabulary is all that is necessary and just happen to like WaniKani's interface and word list better than other SRS programs. Or set some variables to skip only radicals if you prefer.
// @author      Eric P. Hutchins
// @grant       unsafeWindow
// @grant       GM_addStyle
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/24615/WaniKani%20Just%20The%20Vocab%20%28Skip%20Radicals%20and%20Kanji%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24615/WaniKani%20Just%20The%20Vocab%20%28Skip%20Radicals%20and%20Kanji%29.meta.js
// ==/UserScript==

skipRadicals = true; // Change to false to not skip radicals
skipKanji = true; // Change to false to not skip kanji

function skipRadKan() {
  if ((skipRadicals && $('#character').hasClass('radical'))
   || (skipKanji && $('#character').hasClass('kanji'))) {
    currentItem = $.jStorage.get('currentItem');
    questionType = $.jStorage.get('questionType');
    answer = '';
    if (questionType == 'meaning') {
      answer = currentItem.en[0];
    } else {
      if (currentItem.emph == 'onyomi') {
        answer = currentItem.on[0];
      } else {
        answer = currentItem.kun[0];
      }
    }
    $('#user-response')[0].value = answer;
    console.log('Skipping ' + $('#character').text().trim());
    setTimeout(function() { moveForward(); }, 100);
  } else {
    handleVocab();
    setTimeout(function () { skipRadKan(); }, 100);
  }
}

function updateCount() {
  rq = $.jStorage.get('reviewQueue');
  count = jQuery(rq).filter(function(i) { return rq[i].hasOwnProperty('voc'); }).length;
  $('#available-count').text(count);
  setTimeout(function () { updateCount(); }, 1000);
}

function handleVocab() {
  if ($('#answer-form fieldset').hasClass('WKO_ignored') && !$('#answer-form-fake fieldset').hasClass('WKO_ignored')) {
    $('#answer-form-fake fieldset').removeClass('incorrect');
    $('#answer-form-fake fieldset').addClass('WKO_ignored');
  }
  answered = $('#answer-form fieldset').hasClass('correct') || $('#answer-form fieldset').hasClass('incorrect');
  fakeIsBlank = $('#answer-form-fake input').attr('value') == '';
  newWordIsReady = $('#character').css('display') == 'none' && $('#answer-form input').attr('value') == '';
  if (answered && fakeIsBlank) {
    updateCount();
    replaceWithFake();
  } else if (newWordIsReady) {
    putBackRealStuff();
  }
}

function putBackRealStuff() {
  $('#question-type').css('display', 'block');
  $('#character').css('display', 'block');
  $('#answer-form').css('display', 'block');
  $('#question-type-fake').css('display', 'none');
  $('#character-fake').css('display', 'none');
  $('#answer-form-fake').css('display', 'none');
  $('#answer-form-fake input').attr('value', '');
  $('#answer-form-fake fieldset').removeClass('correct');
  $('#answer-form-fake fieldset').removeClass('incorrect');
  $('#answer-form-fake fieldset').removeClass('WKO_ignored');
  $('#answer-form input').focus();
}

function replaceWithFake() {
  if($('#question-type').hasClass('reading')) {
    $('#question-type-fake').removeClass('meaning');
    $('#question-type-fake').addClass('reading');
  }
  if($('#question-type').hasClass('meaning')) {
    $('#question-type-fake').removeClass('reading');
    $('#question-type-fake').addClass('meaning');
  }
  $('#question-type-fake').html($('#question-type').html());

  $('#character-fake').html($('#character').html());

  if ($('#answer-form fieldset').hasClass('correct')) {
    $('#answer-form-fake fieldset').removeClass('incorrect');
    $('#answer-form-fake fieldset').addClass('correct');
  }
  if ($('#answer-form fieldset').hasClass('incorrect')) {
    $('#answer-form-fake fieldset').removeClass('correct');
    $('#answer-form-fake fieldset').addClass('incorrect');
  }
  $('#answer-form-fake input').attr('value', $('#answer-form input').attr('value'));
  $('#answer-form-fake input').attr('disabled', '');

  $('#question-type-fake').css('display', 'block');
  $('#character-fake').css('display', 'block');
  $('#answer-form-fake').css('display', 'block');

  $('#question-type').css('display', 'none');
  $('#character').css('display', 'none');
  $('#answer-form').css('display', 'none');
} 

function moveForward() {
  $('#answer-form button').click();
  correct = $('#answer-form fieldset').hasClass('correct');
  if (correct) {
    $('#answer-form button').click();
  }
  setTimeout(function () { skipRadKan(); }, 100);
}

function main() {
  $( "#character" ).after( "<div id='character-fake' style='display: none;'></div>" );
  $( "#question-type" ).after( "<div id='question-type-fake' style='display: none;'></div>" );
  $( "#answer-form" ).after( "<div id='answer-form-fake' style='display: none;'><form><fieldset class=''><input autocapitalize='off' autocomplete='off' autocorrect='off' id='user-response-fake' name='user-response' placeholder='Your Response' type='text'><button onclick=\"jQuery('#answer-form button').click(); return false;\"><i class='icon-chevron-right'></i></button></fieldset></form></div>");
  GM_addStyle('#answer-form-fake fieldset.WKO_ignored input[type="text"]:-moz-placeholder, #answer-form-fake fieldset.WKO_ignored input[type="text"]:-moz-placeholder {color: #FFFFFF; font-family: "Source Sans Pro",sans-serif; font-weight: 300; text-shadow: none; transition: color 0.15s linear 0s; } #answer-form-fake fieldset.WKO_ignored button, #answer-form-fake fieldset.WKO_ignored input[type="text"], #answer-form-fake fieldset.WKO_ignored input[type="text"]:disabled { background-color: #FFCC00 !important; }');
  GM_addStyle('#answer-form-fake { z-index: 10;}');
  GM_addStyle('#answer-form-fake form { position: relative;}');
  GM_addStyle('#answer-form-fake fieldset { position: relative; margin: 0; padding: 10px; border: none;}');
  GM_addStyle('#answer-form-fake input[type=text] { -webkit-appearance: none; border-radius: 0; display: block; width: 100%; height: 3em; font-size: 1.5em; line-height: 1em; text-align: center; border: none; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; -webkit-box-shadow: 3px 3px 0 #e1e1e1; -moz-box-shadow: 3px 3px 0 #e1e1e1; box-shadow: 3px 3px 0 #e1e1e1;}');
  GM_addStyle('#answer-form-fake button { position: absolute; padding: 0 20px; top: 10px; right: 10px; height: 3em; background-color: #fff; font-size: 1.5em; line-height: 1em; border: none;}');
  GM_addStyle('#answer-form-fake input[type=text]::-moz-placeholder { color: #ccc; font-family: "Source Sans Pro",sans-serif; font-weight: 300; text-shadow: none; -webkit-transition: color 0.15s linear; -moz-transition: color 0.15s linear; -o-transition: color 0.15s linear; transition: color 0.15s linear;}');
  GM_addStyle('#answer-form-fake fieldset.correct input[type=text]::-moz-placeholder, #answer-form-fake fieldset.incorrect input[type=text]::-moz-placeholder { color: #fff; font-family: "Source Sans Pro",sans-serif; font-weight: 300; text-shadow: none; -webkit-transition: color 0.15s linear; -moz-transition: color 0.15s linear; -o-transition: color 0.15s linear; transition: color 0.15s linear;}');
  GM_addStyle('#answer-form-fake fieldset.correct button, #answer-form-fake fieldset.correct input[type="text"], #answer-form-fake fieldset.correct input[type="text"]:disabled, #answer-form-fake fieldset.incorrect button, #answer-form-fake fieldset.incorrect input[type="text"], #answer-form-fake fieldset.incorrect input[type="text"]:disabled { color: #fff; -webkit-text-fill-color: #fff; text-shadow: 2px 2px 0 rgba(0,0,0,0.2); -webkit-transition: background-color 0.1s ease-in; -moz-transition: background-color 0.1s ease-in; -o-transition: background-color 0.1s ease-in; transition: background-color 0.1s ease-in; opacity: 1 !important;}');
  GM_addStyle('#answer-form-fake fieldset.correct button, #answer-form-fake fieldset.correct input[type="text"], #answer-form-fake fieldset.correct input[type="text"]:disabled { background-color: #8c0 !important;}');
  GM_addStyle('#answer-form-fake fieldset.incorrect button, #answer-form-fake fieldset.incorrect input[type=text], #answer-form-fake fieldset.incorrect input[type=text]:disabled { background-color: #f03 !important;}');
  GM_addStyle('#question-type-fake h1 {font-weight: normal; letter-spacing: -1px; text-transform: capitalize;}');
  GM_addStyle('#question-type-fake.reading {color: #fff; text-shadow: -1px -1px 0 #000; border-top: 1px solid #555; border-bottom: 1px solid #000; background-color: #2e2e2e; background-image: -moz-linear-gradient(top, #3c3c3c, #1a1a1a); background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#3c3c3c), to(#1a1a1a)); background-image: -webkit-linear-gradient(top, #3c3c3c, #1a1a1a); background-image: -o-linear-gradient(top, #3c3c3c, #1a1a1a); background-image: linear-gradient(to bottom, #3c3c3c, #1a1a1a); background-repeat: repeat-x;}');
  GM_addStyle('#question-type-fake.meaning { color: #555; text-shadow: -1px -1px 0 rgba(255,255,255,0.1); border-top: 1px solid #d5d5d5; border-bottom: 1px solid #c8c8c8; background-color: #e9e9e9; background-image: -moz-linear-gradient(top, #eee, #e1e1e1); background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#eee), to(#e1e1e1)); background-image: -webkit-linear-gradient(top, #eee, #e1e1e1); background-image: -o-linear-gradient(top, #eee, #e1e1e1); background-image: linear-gradient(to bottom, #eee, #e1e1e1); background-repeat: repeat-x;}');
  GM_addStyle('#character-fake { position: relative; color: #fff; font-size: 12.25em; font-weight: normal; line-height: 1.6em; -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.25); -moz-box-shadow: inset 0 0 10px rgba(0,0,0,0.25); box-shadow: inset 0 0 10px rgba(0,0,0,0.25);}');
  GM_addStyle('#character-fake { font-size: 6.125em; line-height: 3.21em; background-color: #a100f1; background-image: -moz-linear-gradient(top, #a0f, #9300dd); background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#a0f), to(#9300dd)); background-image: -webkit-linear-gradient(top, #a0f, #9300dd); background-image: -o-linear-gradient(top, #a0f, #9300dd); background-image: linear-gradient(to bottom, #a0f, #9300dd); background-repeat: repeat-x;}');
  setTimeout(function () { skipRadKan(); }, 100);
  setTimeout(function () { updateCount(); }, 1000);
}

$ = unsafeWindow.$;

function updateNonSessionCount() {
  rq = $.jStorage.get('reviewQueue');
  $('#review-queue-count').text(jQuery(rq).filter(function(i){return rq[i].hasOwnProperty('voc');}).length);
  setTimeout(function() { updateNonSessionCount(); }, 1000);
}

if (window.location.pathname.includes('session')) {
  main();
} else {
  updateNonSessionCount();
}

