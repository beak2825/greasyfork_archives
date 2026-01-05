// ==UserScript==
// @name         Hide unwanted posters from Warriorsworld Privates
// @namespace    hide_unwanted_posters
// @include      http://forums.warriorsworld.net/private/*
// @include      https://forums.warriorsworld.net/private/*
// @author       Originally designed by Jim Barnett (The fake one). Modified by Retired Season Ticket Holder  11-19-15.
// @description  Improve the quality of your life and save time by hiding all posts written by unwanted posters on warriorsworld.net.
// @version 0.0.1.20151121200508
// @downloadURL https://update.greasyfork.org/scripts/14064/Hide%20unwanted%20posters%20from%20Warriorsworld%20Privates.user.js
// @updateURL https://update.greasyfork.org/scripts/14064/Hide%20unwanted%20posters%20from%20Warriorsworld%20Privates.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  
	var e = $('span:contains(stexen24)');
        var e2 = $('span:contains(Alonzo)');
        $.merge( e, e2 ); 
        

	var li = e.closest('div.msg').parent('li').remove();

	var post = $('a:contains(Post New Thread)');

	if (post != null){
		var message = 'You have been saved from <span style="font-weight: bold;">' + e.length + '</span> annoying posts';
		post_parent = post.closest('a.blue');
		post_parent.after('<br><span>' + message + '</span>');
	}
    
   // flashfire's dark theme
  var body = $('body, #forumnavbar, #forum_contents, #forumnavbar, #forumpost .form_wrap');
  body.css('background', '#000');
  body.css('color','#fff');
  body.css('font-color','#fff');
  var message = $('.message');
  message.css('color', '#dedede');
  var link = $('a:link');
  link.css('color', '#00ccff');
  var row0 = $('.threads').children('div.row0');;
  row0.css('background', '#000');
  var row1 = $('.threads').children('div.row1');;
  row1.css('background', '#111');
  var grey_stuff = $('.messageinfo, .username, .threadinfo');
  grey_stuff.css('color','#545454');

}

// load jQuery and execute the main function
addJQuery(main);