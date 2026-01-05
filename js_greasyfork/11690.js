// ==UserScript==
// @name Todoist Plus
// @description Todoist.com adding right fixed panel for tasks multiselect
// @author DeTorres
// @version 0.1.2
// @date 2015-08-13
// @namespace https://todoist.com/app
// @match https://todoist.com/app*
// @license MIT License
// @downloadURL https://update.greasyfork.org/scripts/11690/Todoist%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/11690/Todoist%20Plus.meta.js
// ==/UserScript==

var script = document.createElement('script');

script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

script.addEventListener('load', function(){
	jQuery = unsafeWindow['jQuery'];
	jQuery.noConflict();
	jQuery(document).ready(function() {
		var newStyle = "<style>" +
				"#my_panel {height:180px; line-height:30px; position:fixed; width:100px; padding:10px; top:40px; right:25px;text-align:right; border: 1px dotted black; background-color:#f2f2f2; margin:10px 0;} " +
		"</style>";
	
		jQuery('html head').append(newStyle);
		
		jQuery("body").prepend("<div id='my_panel'>" + 
			"Выделить:<br />" + 
			"<label><span style='color:green'>все (all)</span><input id='my_all_checker' type='checkbox' value='1' /> </label><br />" + 
			"<label><span>прозрачные</span><input id='my_transparent_checker' type='checkbox' value='1' /></label><br />" +
			"<label><span style='color:#64a8d9'>голубые</span> <input id='my_light_blue_checker' type='checkbox' value='1' /></label><br />" +
			"<label><span style='color:#0063a6'>синие</span> <input id='my_blue_checker' type='checkbox' value='1' /></label><br />" +
			"<label><span style='color:#d24726'>красные</span> <input id='my_red_checker' type='checkbox' value='1' /></label>" +
		"</div>");
		
		var getTasksByPriority = function(priority){
			var priorities = ["", "priority_1", "priority_2", "priority_3", "priority_4" ];
			var tasksSelector = ".items li.task_item";
			if(priority){
				tasksSelector += "." + priorities[priority];
			}
			return jQuery(tasksSelector);
		}
		
		var selectTasksAndTriggerMousedown = function(tasks){
			if( tasks.size() ) {
				var shiftClick = jQuery.Event("mousedown");
				shiftClick.shiftKey = true;
				
				tasks.toggleClass('selected');
				
				var firstElem = tasks.get(0);
				jQuery(firstElem).toggleClass('selected').trigger(shiftClick);
			}
			
			return true;
		}
		
		
		jQuery('input#my_transparent_checker').on("click", function() {
			selectTasksAndTriggerMousedown( getTasksByPriority(1) );
		});
		
		jQuery('input#my_light_blue_checker').on("click", function() {
			selectTasksAndTriggerMousedown( getTasksByPriority(2) );
		});
		
		jQuery('input#my_blue_checker').on("click", function() {
			selectTasksAndTriggerMousedown( getTasksByPriority(3) );
		});
		
		jQuery('input#my_red_checker').on("click", function() {
			selectTasksAndTriggerMousedown( getTasksByPriority(4) );
		});
		
		jQuery('input#my_all_checker').on("click", function() {
			selectTasksAndTriggerMousedown( getTasksByPriority(0) );
		});
    });
}, false);

