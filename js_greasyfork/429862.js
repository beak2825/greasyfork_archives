// ==UserScript==
// @name         BiliBili-RandomPlayParts
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Random play parts within a bilibili video that has > 5 parts.
// @author       Ken Wang
// @match        https://www.bilibili.com/video/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js
// @require      https://cdn.jsdelivr.net/npm/weatherstar-switch@1.0.7/dist/switch.min.js
// @resource     switchCSS https://cdn.jsdelivr.net/npm/weatherstar-switch@1.0.7/dist/switch.css
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/429862/BiliBili-RandomPlayParts.user.js
// @updateURL https://update.greasyfork.org/scripts/429862/BiliBili-RandomPlayParts.meta.js
// ==/UserScript==
var newCSS = GM_getResourceText("switchCSS");
GM_addStyle(newCSS);


var total_parts = 0;

var current_part = 0;

var random_list = [];

var start_p = 0;

// Stores all part ref, can mock click it to route.
var parts_ref;

// Switch ref
var toggle_switch;

// Helper logger
function log(str) {
  console.log("[Random2PlayVList]: " + str);
}


function init() {
  // string in format of (xxx/yyy) where xxx is current part and yyy is total part
  total_parts = $("span.cur-page").text().replace(/\(|\)/g, '').split("/");
  if(total_parts.length < 2){
    log("Not a list video. No need to init random play.");
    return;
  }

  total_parts = parseInt(total_parts[1]);


  if(total_parts < 3){
    log("Num of video less than 3. No need to init random play.");
    return;
  }

  createRandomList();

  log("afterAjax Started.");
  initAfterAjax();
  initNextBtn();
  // Event bindings
  videoEventBinding('video');

  log("afterAjax Ended.");
}

function videoEventBinding(videoTag) {
  log("Current video Mode is: " + videoTag);
  setTimeout(function() {
    try {
      if($._data(document.getElementsByTagName(videoTag)[0], "events" ) == undefined ){
        $(videoTag).off("ended");
        $(videoTag).on("ended", onVideoEnded);
        log("event binded");
      } 
      else {
        log("event not binded");
        videoEventBinding();
      }
    } catch(err) {
      log(err);
      videoEventBinding();
    }
  },250);
}

function initNextBtn() {
  setTimeout(function () {
    if($(".bilibili-player-video-btn-next button").length != 0 ){
      $(".bilibili-player-video-btn-next button").off("click");
      $(".bilibili-player-video-btn-next button").click(function () {
        if (toggle_switch.getChecked()) {
          log("Next random triggered.");
          playNextRandomPart();
        } 
      })
      log("NextBtn Inited");
    }
    else{
      log("NextBtn Initing");
      initNextBtn();
    }
  }, 20);
}

// Wait for ajax data for detailed parts
function initAfterAjax() {
  setTimeout(function () {
    parts_ref = $("ul.list-box li a");
    if (parts_ref.length > 0) {
      log("Parts loaded: " + parts_ref.length);

      switcherShow();

    } else {
      initAfterAjax();
    }
  }, 250);
}

function onVideoEnded() {
  log("onVideoEnded triggered.");
  if (toggle_switch.getChecked())
    playNextRandomPart();
}

function Random(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

// Generates random part number and play accordingly.
function playNextRandomPart() {
  current_part = parseInt($("span.cur-page").text().replace(/\(|\)/g, '').split("/")[0]) - 1;

  let random_p = random_list.indexOf(current_part);

  random_p++;

  if (random_p == total_parts) {
    createRandomList();
    random_p = 1;
  }
  playPart(random_list[random_p]);

  //  // after in next part, video gets refreshed and we have to init btn again.
  initNextBtn();
}

// get random play list
function createRandomList() {
  random_list = [];
  let arr_1_to_total = Array.from({length: total_parts}, (x,i) => i);
  for (var i = 0; i < total_parts; i++){
    let temp = parseInt(Math.random()*(total_parts-i));
    random_list.push(arr_1_to_total[temp]);
    arr_1_to_total.splice(temp,1);
  }
  // move current_part to the start of random_list
  random_list.splice(random_list.indexOf(current_part));
  random_list.unshift(current_part);
}

function playPart(part) {
  parts_ref[part].firstElementChild.click();
}

function switcherShow() {
  // Switch component holder
  var switcher = $("<input type=\"checkbox\" class=\"switch-success\" />");
  switcher.insertBefore($(".range-box"));

  // From example in https://github.com/weatherstar/switch
  var el = document.querySelector('.switch-success');
  toggle_switch = new Switch(el,
    {
      size: 'small',
      offSwitchColor: '#ccc'
    });
  $(".switch-small").css({ 'margin-left': '0.5rem' });
  $("small").text("随");
  $("small").click(switchOnChange);
}

function switchOnChange() {
  log(toggle_switch.getChecked());

  // Disable default auto-play before switch on
  if (!toggle_switch.getChecked()) {
    if ($(".switch-button.on").length != 0) {
      alert("请先关闭自动连播.\n随机选项开了以后会自动禁用自动连播，关闭选项即可恢复。");
      toggle_switch.toggle(); // Hacking code to revert the upcoming switch-on
      return;
    }
    postCheckAutoPlay();
  }

  postCheckAutoPlay();
}

function postCheckAutoPlay() {
  if (!toggle_switch.getChecked())
    $(".next-button").css({ "pointer-events": "none" });
  else
    $(".next-button").css({ "pointer-events": "" });
}

(function () {
  "use strict";
  $('document').ready(function () {
    init();
  });
})();