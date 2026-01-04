// ==UserScript==
// @name         Tilda.school course marker
// @namespace    https://tilda.school/
// @version      0.1.4
// @description  Отмечайте пройденные занятия в личном кабинете tilda.school
// @author       Tilda School
// @match        https://tildoshnaya.org/*
// @match        https://tilda.school/*
// @require      http://code.jquery.com/jquery-1.10.2.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/402485/Tildaschool%20course%20marker.user.js
// @updateURL https://update.greasyfork.org/scripts/402485/Tildaschool%20course%20marker.meta.js
// ==/UserScript==

(function() {
	'use strict';

	$(document).ready(function(){
		setTimeout(function(){
			if ($(".t688").length > 0) {
				var length = $(".t688 .t-col").length;
				$(".t688 .t-col").each(function(i){
					$(this).append("<input type='checkbox' id='lesson_" + (length - i) + "' class='tildoshnaya_course_checkbox'>");
				})
				
				for (var i = 1; i < length; i++) {
					if (localStorage.getItem("lesson_" + i ) == "true") {
						$("#lesson_" + i).prop("checked", true);
					}
				}

				$(".tildoshnaya_course_checkbox").css("position", "absolute");
				$(".tildoshnaya_course_checkbox").css("top", "0");
				$(".tildoshnaya_course_checkbox").css("right", "0");
				$(".tildoshnaya_course_checkbox").css("height", "16px");
				$(".tildoshnaya_course_checkbox").css("width", "16px");
				$(".t688 .t-col").css("position", "relative");

				$(".tildoshnaya_course_checkbox").click(function(){
					var id = $(this).attr("id");
					var checked = $(this).prop("checked");
					localStorage.setItem(id, checked);
				})
			}
		}, 1500)
	})
})();
