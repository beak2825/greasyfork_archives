// ==UserScript==
// @namespace  better-trello
// @name       Better Trello
// @version    1.0
// @require    https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match      https://trello.com/b*
// @description Expands and adds things
// @downloadURL https://update.greasyfork.org/scripts/383535/Better%20Trello.user.js
// @updateURL https://update.greasyfork.org/scripts/383535/Better%20Trello.meta.js
// ==/UserScript==


$(document).ready(function() {
  // Custom CSS
  $('.list-wrapper').css('width', '310px');
  
  /*
  // Progression bar
  $('.js-list.list-wrapper').prepend(`
		<div style="
			padding: 8px;
			background-color: white;
			margin-bottom: 10px;
			border-radius: 4px;
		">

			<div style="
				background-color: #5bb85d;
				border-radius: 4px 0 0 4px;
				display: inline-block;
				width:27%;
				z-index: 10;
				height: 20px;
			">&nbsp;</div>

			<div style="
				background-color: #eeeeee;
				border-radius: 0 4px 4px 0;
				display: inline-block;
				width:73%;
				margin-left: -4px;
				box-shadow: inset 0px 0px 3px #999;
				z-index: 100;
				height: 20px;
			">&nbsp;
			
				<span style="font-size: 12px;">27%</span>
			
			</div>

		</div>
	`);
  	*/
  
  
});

