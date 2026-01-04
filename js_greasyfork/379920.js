// ==UserScript==
// @name         manec_team_meeting
// @namespace    blabla
// @version      0.3
// @description  to print agenda
// @author       JK
// @match        https://git.uni-paderborn.de/Otree/team-meeting/boards
// @match        https://git.uni-paderborn.de/Otree/team-meeting/boards?scope=all&utf8=%E2%9C%93&state=opened
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/379920/manec_team_meeting.user.js
// @updateURL https://update.greasyfork.org/scripts/379920/manec_team_meeting.meta.js
// ==/UserScript==

$(document).ready(function(){

	var txt1 = "<button id='printing'style='color: #1aaa55;z-index: 9;margin: 0px 10px;padding: 5px;height: 34px;border: 1px #1aaa55 solid;border-radius: 3px;text-decoration: none; background-color: white;'>Print me</button>";

	$(".filter-dropdown-container").append(txt1);

	$("#printing").click(function(){

        document.querySelector('.boards-list').style.height = '1000px';
        document.querySelector('.board.is-draggable').style.width = '350px';
       // document.querySelector('.board-card').style.padding = '5px !important';
        var x = document.querySelectorAll('.board.is-expandable');
        x[0].style.display = 'none';
        x[1].style.display = 'none';
        var y = document.querySelectorAll('.board.is-draggable');
        y[2].style.display = 'none';
        document.querySelector('.navbar').style.display = 'none';
        document.querySelector('.breadcrumbs').style.display = 'none';
        document.querySelector('.nav-sidebar').style.display = 'none';
        document.querySelector('.filtered-search-block').style.display = 'none';
        $("<style type='text/css'> li{padding: 5px !important} </style>").appendTo("head");
    
        window.print();

    });
});
