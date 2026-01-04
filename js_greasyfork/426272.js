// ==UserScript==
// @name        Strava :: Give Kudos to Everyone
// @description Give kudos to everyone automatically
// @namespace   https://georgejames.com
// @match       https://www.strava.com/dashboard
// @match       https://www.strava.com/dashboard/*
// @match       https://www.strava.com/dashboard?*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js
// @version     4
// @downloadURL https://update.greasyfork.org/scripts/426272/Strava%20%3A%3A%20Give%20Kudos%20to%20Everyone.user.js
// @updateURL https://update.greasyfork.org/scripts/426272/Strava%20%3A%3A%20Give%20Kudos%20to%20Everyone.meta.js
// ==/UserScript==


//Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true)

$(document).ready(function() {

  $(".user-nav").prepend('<li class="nav-item gjAutoKudos" style="padding-right: 10px"><a class="btn btn-primary" href="javascript:void(0);">Give Kudos to Everyone</a></li>')

  // Click on any btn-kudo buttons that we see
	$(".gjAutoKudos").click(function(element) {

    var count = 0
    $("button[data-testid='kudos_button']").each(function (index) {
      if ($(this).prop('title') !== 'View all kudos') {
	    	$(this).click()
        count++
        }
	  })
    $(".gjAutoKudos").prop("title", count + " kudos given" )
  })

})