// ==UserScript==
// @name         Hide gsw_hoops and underdog from Warriorsworld Politics
// @namespace    hide_gsw_hoops_and_underdog
// @include      http://forums.warriorsworld.net/politics/*
// @include      https://forums.warriorsworld.net/politics/*
// @author       Originally designed by Jim Barnett (The fake one). Modified by Retired Season Ticket Holder  11-19-15.
// @description  Improve the quality of your life and save time by hiding all posts written by unwanted posters on warriorsworld.net.
// @version 0.0.1.20151130012713
// @downloadURL https://update.greasyfork.org/scripts/1268/Hide%20gsw_hoops%20and%20underdog%20from%20Warriorsworld%20Politics.user.js
// @updateURL https://update.greasyfork.org/scripts/1268/Hide%20gsw_hoops%20and%20underdog%20from%20Warriorsworld%20Politics.meta.js
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
  
	var e = $('span:contains(gsw_hoops)');
        var e2 = $('span:contains(underdog)');
        $.merge( e, e2 ); 



	var li = e.closest('div.msg').parent('li').remove();

	var post = $('a:contains(Post New Thread)');

	if (post != null){
		var message = 'You have been saved from <span style="font-weight: bold;">' + e.length + '</span> annoying posts';
		post_parent = post.closest('a.blue');
		post_parent.after('<br><span>' + message + '</span>');
	}
   

}

// load jQuery and execute the main function
addJQuery(main);