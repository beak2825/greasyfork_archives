// ==UserScript==
// @name WebReg bot
// @namespace idkwhattoputhere
// @version 1.10
// @description Hello there
// @match *://*/*
// @author Streak324
// @downloadURL https://update.greasyfork.org/scripts/35904/WebReg%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/35904/WebReg%20bot.meta.js
// ==/UserScript==

var url_http_home = "http://reg.uci.edu";
var url_https_home = "https://reg.uci.edu/";
var url_schedule = "https://reg.uci.edu/perl/WebSoc";

var dept_name = "I&C SCI";
var course_name = "45C";

if(document.readyState == 'complete')
{

	if(document.URL == url_schedule)
	{
		console.log("I am in schedule of classes");
		var depts_html = document.querySelectorAll("select.dept");
		var input_field = document.querySelectorAll("input.CourseNum");
		depts_html[0].value = dept_name;
		input_field[0].value = course_name;

	}

	if(document.URL == url_http_home || document.URL == url_https_home)
	{
		console.log("Going to class schedules");
		window.location.replace(url_schedule);
	}
}
