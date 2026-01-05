// ==UserScript==
// @name        NeoNotifications
// @namespace   NPnotifier
// @description hi
// @include     *://www.neopets.com/*
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/27686/NeoNotifications.user.js
// @updateURL https://update.greasyfork.org/scripts/27686/NeoNotifications.meta.js
// ==/UserScript==

var originalPageTitle = "";
var isActive = false;
window.onfocus = function () {
  isActive = true;
}
window.onblur = function () {
  isActive = false;
}

$(document).ready(function() {  
  // if we're on the neoboards, we'll set a custom page title
  if (window.location.href.includes("/neoboards/boardlist.phtml")) {
    //alert("board list");
    var boardName = $('.content > strong > a[href*=\'boardlist.phtml?board=\']').text().trim();
    //$(document).find("title").text('Board: ' + boardName);
    $(document).find("title").text(boardName + ' - NeoBoards');
  } else if (window.location.href.includes("/neoboards/topic.phtml")) {
    //alert("topic list");
    //alert($('.content > strong > a[href*=\'boardlist.phtml?board=\']', $.parseHTML(data)).text().trim());
    //$(document).find("title").text('NeoBoards - ' + $('.content > strong > a[href*=\'boardlist.phtml?board=\']').text().trim());
    //alert('topic: ' + $('.content').clone().children().remove().end().text().trim());
    var topicName = $('.content').clone().children().remove().end().text().trim();
    var boardName = $('.content > b> a[href*=\'boardlist.phtml?board=\']').text().trim();
    //alert(boardName);
    //$(document).find("title").text('Topic: ' + topicName);
    $(document).find("title").text("'" + topicName + "' - " + boardName + ' - NeoBoards');
  }
  // end of custom page title
  originalPageTitle = $(document).find("title").text();
  $('#main').before("<style>#toastnotification{width:232px;height:147px;background:#F6F6F6;position:fixed;bottom:20px;right:20px;border-radius:7px;overflow:hidden;border:1px solid #747474;box-shadow:0px 3px 0px rgba(0, 0, 0, 0.27);z-index:2147483647;}#toastclose{background:rgba(0, 0, 0, 0.27);border-radius:50%;font-size:16px;height:25px;line-height:25px;overflow:hidden;position:absolute;right:16px;text-align:center;top:2px;width:25px;cursor:pointer;font-weight:bold;color:#FFFFFF;}#toastheader{width:232px;height:30px;position:absolute;top:0px;left:0px;background:#FFD026;line-height:30px;font-size:16px;text-align:left;padding:0px 7px;}#toastcontent{width:232px;height:88px;position:absolute;top:30px;left:0px;font-size:12px;font-weight:normal;}#toastmessage{text-align:left;margin:7px 0px 0px 7px;color:#000000;width:218px;}#toastdate{position:absolute;bottom:0px;right:0px;text-align:right;margin:0px 7px 7px 0px;color:#747474;}#toastseeallevents{width:232px;height:29px;line-height:29px;position:absolute;bottom:0px;left:0px;background:#C9C9C9;font-weight:normal;color:#000000;font-size:14px;text-align:left;padding-left:7px;}</style><div id='toastnotification'><div id='toastheader'><div id='toasttype'>Event type</div><div id='toastclose'>X</div></div><a href='' id='toastcontentlink'><div id='toastcontent'><p id='toastmessage'>Message content</p><p id='toastdate'>0:00 pm - 0/00</p></div></a><a href='/allevents.phtml'><div id='toastseeallevents'>See all events (0)</div></a></div>");
  closeNotification();
  if ($('#header .eventIcon').text().trim().length) {
    fetchNotificationContent();
  }
  $('#toastclose').click(function(){closeNotification();});
  //hideEvent();
  window.onfocus = function () { 
    isActive = true; 
  }; 

  window.onblur = function () { 
    isActive = false; 
  };
  setInterval(function(){if (isActive === true){fetchNotificationContent()}},60000);
  setInterval(function(){if (isActive === false){fetchNotificationContent()}},270000);
});

function fetchNotificationContent() {
    $.ajax("http://www.neopets.com/allevents.phtml", {
      success: function(data) {
        //alert(data);
        //console.log(data);
        console.log("fetching data @ " + Date($.now()) +"..");
        if (getData(data, "description")) {
          var date = getData(data, "date");
          var time = getData(data, "time");
          var description = getData(data, "description");
          var link = getData(data, "link");
          var type = getData(data, "type");
          var notifications = getData(data, "notifications");
          var event = getData(data, "event");
          //alert(event);
          console.log("Date: " + date + ", Time: " + time +
                      ", Description: " + description + ", Link: " + link +
                     ", Type: " + type + ", Notifications: " + notifications);
          setupNotifications(date, time, description, link, type, notifications);
          //console.log("Notifications received!");
          setEvent(event);
        } else {
          console.log("no data found");
          resetPageTitle();
          closeNotification();
          hideEvent();
          
        }
        //alert(getData(data, "date"));
        //$('body').replaceWith(data);
      },
      error: function() {
         //error
      }
   });
}

function hideEvent() {
  $('#header .eventIcon').text("");
}

function setEvent(event) {
  $('#header .eventIcon').html(event);
}

function getData(data, attribute) {
  var output = "";
  if (attribute == "time") {
    //output = $($.parseHTML(data)).find('.content form[name=\'eventform\'] > table > tbody > tr:nth-of-type(2) > td:first-of-type > b').text();
    //output = $($.parseHTML(data)).filter('.content').text();
    datetime = $('.content form[name=\'eventform\'] > table > tbody > tr:nth-of-type(2) > td:first-of-type > b', $.parseHTML(data)).html().split("<br>");
    output = datetime[1].trim();
  } else if (attribute == "date") {
    datetime = $('.content form[name=\'eventform\'] > table > tbody > tr:nth-of-type(2) > td:first-of-type > b', $.parseHTML(data)).html().split("<br>");
    output = datetime[0].trim();
    //output = $('.content form[name=\'eventform\'] > table > tbody > tr:nth-of-type(2) > td:first-of-type > b', $.parseHTML(data)).html().trim();
  } else if (attribute == "description") {
    output = $('.content form[name=\'eventform\'] > table > tbody > tr:nth-of-type(2) > td:nth-of-type(3)', $.parseHTML(data)).text().trim();
  } else if (attribute == "type") {
    output = $('.content form[name=\'eventform\'] > table > tbody > tr:nth-of-type(2) > td:nth-of-type(2)', $.parseHTML(data)).text().trim();
  } else if (attribute == "link") {
    output = $('.content form[name=\'eventform\'] > table > tbody > tr:nth-of-type(2) > td:nth-of-type(2) > a', $.parseHTML(data)).attr('href');
  } else if (attribute == "notifications") {
    output = $('.content > div:nth-of-type(2) > b:nth-of-type(2)', $.parseHTML(data)).text().trim();
  } else if (attribute == "event") {
    output = $('#header .eventIcon', $.parseHTML(data)).html();
  }
  return output;
}

function setupNotifications(date, time, description, link, type, notifications) {
  $(document).prop('title', "(" + notifications + ") " + originalPageTitle);
  $('#toastseeallevents').text("See all events (" + notifications + ")");
  $('#toastmessage').text(description);
  //$('#toastdate').text(time + " - " + date);
  updateTime(time, date);
  setInterval(function(){updateTime(time, date)},60000);
  $('#toasttype').text(type);
  $('#toastcontentlink').attr("href", link);
  $('#toastnotification').show();
  $('#toastnotification').animate({bottom:'20px'},700);
}
//TODO: convert timestamp to X days/hours/minutes ago?
//      add a 'close' button
//      check for notifications every Y minutes

function resetPageTitle() {
  $(document).prop('title', originalPageTitle);
}

function closeNotification() {
  $('#toastnotification').hide();
  $('#toastnotification').css({bottom:'-250px'});
}

function updateTime(time, date) {
  //NST is 3 hours behind
  var timestamp = $.now() - 10800000;
  var dateObject = new Date(timestamp);
  var currentYear = dateObject.getFullYear();
  var splitTime1 = time.split(":");
  var splitTime2 = splitTime1[1].split(" ");
  var splitDate = date.split("/");
  if (splitTime2[1].trim() === 'am') {
    var notificationHour = splitTime1[0].trim();
  } else {
    var notificationHour = 12 + parseInt(splitTime1[0].trim());
  }
  var notificationMinute = splitTime2[0].trim();
  var notificationDay = splitDate[1].trim();
  var notificationMonth = splitDate[0].trim();
  var notificationDate = new Date(currentYear, notificationMonth - 1, notificationDay, notificationHour, notificationMinute, 0, 0);
  //var notificationTimestamp = ;
  var timeSince = Math.round((timestamp - notificationDate.getTime()) / 1000);
  var output = "";
  if (timeSince < 60) {
    //just now
    output = "Just now";
  } else if (timeSince >= 60 && timeSince < 3600) {
    //minutes
    var mins = Math.floor(timeSince / 60);
    output += mins;
    output += " minute";
    if (mins > 1)
      output += "s";
    output += " ago";
  } else if (timeSince >= 3600 && timeSince < 86400) {
    //hours
    var hours = Math.floor(timeSince / 3600);
    output += hours;
    output += " hour";
    if (hours > 1)
      output += "s";
    output += " ago";
  } else if (timeSince >= 86400) {
    //days
    var days = Math.floor(timeSince / 86400);
    output += days;
    output += " day";
    if (days > 1)
      output += "s";
    output += " ago";
  }
  //return output;
  $('#toastdate').text(output);
}