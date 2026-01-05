// ==UserScript==
// @name	WWT - Auto Reload with counter
// @namespace	Keka_Umans
// @description Reload pages every x minutes
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include *worldwidetorrents.eu*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22793/WWT%20-%20Auto%20Reload%20with%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/22793/WWT%20-%20Auto%20Reload%20with%20counter.meta.js
// ==/UserScript==

var numMinutes = 2; // number of minutes until reload

// --------- Do not edit below --------- //

$( document ).ready(function() {

  $('.myLink7').after('<input type="button" id="rNum" class="running" title="Click to pause" style="position:relative;top:2px;">');

  $('#rNum').click(function(){
    if($(this).attr("class") !== "paused"){
      $('#rNum').removeClass("running").addClass("paused");
      $('#rNum').attr('title','Click to resume');
      Clock.pause();
    }
    else{
      $('#rNum').removeClass("paused").addClass("running");
      $('#rNum').attr('title','Click to pause');
      Clock.resume();
    }
  });
          
});


var Clock = {
  totalSeconds: numMinutes*60,
  start: function () {
    var self = this;
    this.interval = setInterval(function () {
      self.totalSeconds -= 1;
      var min = Math.floor(self.totalSeconds / 60 % 60);
      if(min < 10){min = "0"+min;} // Leading zeros
      var sec = parseInt(self.totalSeconds % 60);
      if(sec < 10){sec = "0"+sec;} // Leading zeros
      document.getElementById('rNum').value = "Page Reload: "+min+":"+sec;
      if(self.totalSeconds <= 0){self.totalSeconds = numMinutes*60;location.reload(true);}
    }, 1000);
  },
  pause: function () {
    clearInterval(this.interval);
    delete this.interval;
  },
  resume: function () {
    if (!this.interval) this.start();
  }
};
Clock.start();