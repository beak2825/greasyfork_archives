// ==UserScript==
// @name         eRepublik AutoShouter
// @namespace    https://www.erepublik.com/en/citizen/profile/2524994
// @version      0.8
// @description  Post in your friends feed automatically
// @author       El Bort
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @include      http://*.erepublik.com/*
// @include      https://*.erepublik.com/*
// @copyright    2017, ElBort (https://openuserjs.org/users/ElBort)
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/36290/eRepublik%20AutoShouter.user.js
// @updateURL https://update.greasyfork.org/scripts/36290/eRepublik%20AutoShouter.meta.js
// ==/UserScript==

if (localStorage.getItem('autoShout_minTime') === null) {
  localStorage.setItem('autoShout_minTime', 5);
  localStorage.setItem('autoShout_maxTime', 6);
}

var maxTime = localStorage.getItem('autoShout_maxTime');
var minTime = localStorage.getItem('autoShout_minTime');
var initial = randTime(Number(minTime), Number(maxTime));
var count = initial;
var counter;
var initialMillis;

$("#newPost").after("<a id=\"newPost\" name=\"autoShout\" data-fblog=\"feed_write\" href=\"javascript:\" class=\"std_global_btn greenColor tinySize noPadding floatRight newFeedPost\" trigger=\"new_autoshout\" original-title=\"\">                    <span trigger=\"new_autoshout\">                        <b trigger=\"new_autoshout\">AutoShout</b>                    </span>                    </a>");

function startAutoShouter() {
  var time = initial;
  var feedUrl;
  var feedActive;
  if($("#show_country_feed").hasClass("active")){ feedUrl = "country"; feedActive = "Country"; }
  else if($("#show_friends_feed").hasClass("active")){ feedUrl = "wall"; feedActive = "Friends";}
  else if($("#show_regiment_feed").hasClass("active")){ feedUrl = "group"; feedActive = "Military Unit";}
  else if($("#show_party_feed").hasClass("active")){ feedUrl = "party"; feedActive = "Party";}
  else{ feedUrl = "wall"; feedActive = "Friends";}
  var autoShout_message = localStorage.getItem('autoShout_message');
  var tab_autoshout = "<div class=\"facebook_friends\" id=\"invite_step1\" style=\"left: 50%; margin-left: -260px; z-index: 25004; position: absolute; top: 200px; margin-top: 0px; display: block;\">" +
    "<a href=\"javascript:;\" class=\"close\" title=\"Cerrar ventana\"><span>Cerrar</span></a>" +
    "<h2 class=\"autoshout_header\"><span>AutoShouter</span><span style=\"font-size:70%\"> by <a href=\"https://www.erepublik.com/en/citizen/profile/2524994\" target=\"_blank\">El Bort</a></span></h2>" +
    "<h4>AutoShouter in progress, do NOT close this tab.</h4>" +
    "<div class=\"listing\">" +
    "<span id=\"timer\"></span>" + "</br><span><a>Active feed: " + feedActive + "</a></span>" +
    "</div>" +
    "<div class=\"listing\"><p><strong>Shout message: </strong></br>" + autoShout_message.replace(/\n/g, "<br />") + "</p></div>" +
    "<div class=\"listing\">" + timeList() + "<a class=\"std_global_btn blueColor tinySize\" id=\"updateTime_autoshout\" original-title=\"\">Save</a> <a target=\"_blank\" href=\"https://www.erepublik.com/en/main/messages-compose/2524994\" class=\"std_global_btn redColor tinySize floatRight\" original-title=\"\">Bug Report</a>" +
    "<p id=\"timer_updated\"></p>" +
    "</div>" +
    "<a class=\"std_global_btn redColor mediumSize\" id=\"stop_autoshout\" original-title=\"\">Stop AutoShouter</a>" +
    "<a href=\"https://www.erepublik.com/en/economy/donate-money/2524994\" target=\"_blank\" class=\"std_global_btn greenColor mediumSize floatRight\" id=\"donate_autoshout\" original-title=\"\">Donate</a>" +
    "</div>" +
    "<div class=\"lb_overlay js_lb_overlay\" style=\"height: 2150px; position: absolute; width: 100%; top: 0px; left: 0px; right: 0px; bottom: 0px; z-index: 9000; background: black; opacity: 0.7;\"></div>";

  $("#homepage_feed").append(tab_autoshout);
  $(".autoshout_header").css("background-image", "url(https://dl.dropboxusercontent.com/s/j8qar3olx6gmwzp/h2_bg.png)");

  var token = $("input[id=award_token]").attr("value");
  var myShoutData = {
    _token: token,
    post_message: autoShout_message
  };
  var dataToBeSent = $.param(myShoutData, true);
  shout(dataToBeSent,feedUrl);

  displayCount(time);
  setInterval(function () {
    window.location.reload();
  }, time);

  $("#updateTime_autoshout").click(function () {
    if (Number($("#minTime_autoshout").attr("value")) >= Number($("#maxTime_autoshout").attr("value"))) {
      document.getElementById("timer_updated").innerHTML = "*<strong>Error:</strong> first number must be lower than second one.";
    }
    else {
      localStorage.setItem('autoShout_maxTime', Number($("#maxTime_autoshout").attr("value")));
      localStorage.setItem('autoShout_minTime', Number($("#minTime_autoshout").attr("value")));
      document.getElementById("timer_updated").innerHTML = "*<strong>Updated timer:</strong> next shout will be updated.";
    }
  });

  $("#stop_autoshout").click(function () {
    window.location.replace("https://www.erepublik.com");
  });
  $(".close").click(function () {
    window.location.replace("https://www.erepublik.com");
  });
}

if (window.location.href.indexOf("?AutoShouter") >= 0) {
  startAutoShouter();
}

$("a[name=autoShout]").click(function () {
  var post_message = $("textarea[id=shout]").attr("value");

  if (post_message.length === 0) {
    $("#wallError").css("display", "block");
    $("#wallError").text("Your post was either empty or invalid");
  }
  else {
    localStorage.setItem('autoShout_message', post_message);
    var url = window.location.href + "?AutoShouter";
    window.location.replace(url);
  }
});

function shout(dataToBeSent,feedUrl) {
  $.post("https://www.erepublik.com/es/main/"+feedUrl+"-post/create/", dataToBeSent, function (data, textStatus) {
    if (textStatus == "error") {
      alert("AutoShout: error. Try again");
    }
    else if (data.message == 1) {
      $("#wall_post_list ul").before(data.success_message);
    }
    else if (data.message === 0) {
      $("#wallError").css("display", "block");
      $("#wallError").css("display", "block").text(data.error_message);
    }
    else {
      alert("AutoShout: error. Refresh please");
    }
  }, "json");
}

function timeList() {
  var list = "<strong>Setup timer:</strong></br>Shout between <select id=\"minTime_autoshout\">";
  for (var i = 5; i <= 29; i++) {
    if (localStorage.getItem('autoShout_minTime') == i) {
      list += "<option value=\"" + i + "\" selected>" + i + "</option>";
    }
    else {
      list += "<option value=\"" + i + "\">" + i + "</option>";
    }
  }
  list += "</select> and <select id=\"maxTime_autoshout\">";
  for (var m = 6; m <= 30; m++) {
    if (localStorage.getItem('autoShout_maxTime') == m) {
      list += "<option value=\"" + m + "\" selected>" + m + "</option>";
    }
    else {
      list += "<option value=\"" + m + "\">" + m + "</option>";
    }
  }
  list += "</select> minutes </br>";
  return list;
}

function randTime(minTime, maxTime) {
  var randTime = Math.floor(Math.random() * (maxTime * 60 * 1000 - minTime * 60 * 1000 + 1)) + minTime * 60 * 1000;
  return randTime;
}

function timer() {
  if (count <= 0) {
    clearInterval(counter);
    return;
  }
  var current = Date.now();

  count = count - (current - initialMillis);
  initialMillis = current;
  displayCount(count);
}

function displayCount(count) {
  var res = count / 1000;
  document.getElementById("timer").innerHTML = "Next shout will be post in... " + res.toPrecision(count.toString().length) + " seconds";
  clearInterval(counter);
  initialMillis = Date.now();
  counter = setInterval(timer, 1);
}