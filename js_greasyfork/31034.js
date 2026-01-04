// ==UserScript==
// @name         Voz Calendar
// @namespace    http://tampermonkey.net/
// @version      1.0.1.0
// @description  Làm chức năng calendar trên thanh menu của voz hoạt động.
// @author       You
// @match        https://vozforums.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/fullcalendar.js
// @downloadURL https://update.greasyfork.org/scripts/31034/Voz%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/31034/Voz%20Calendar.meta.js
// ==/UserScript==
$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/fullcalendar.min.css">');
$('div[style="margin:0px 10px 0px 10px"]').append('<div class="vbmenu_popup" id="calendar" style="margin-top: 3px; position: absolute; z-index: 50; clip: rect(auto auto auto auto); left: 542px; top: 208px;width:300px;height:215px" align="left"></div>');
$('a[href="calendar.php"]').text('Calendar ').append('<img src="images/misc/menu_open.gif" border="0" title="" alt="">').attr('href','#').click(function(){$('#calendar').toggle();});
$('#calendar').fullCalendar().append('<style>#calendar{display: none}.fc-day-grid-container{height:initial!important}.fc-basic-view .fc-body .fc-row{min-height:initial;height:28px!important}.fc-scroller{overflow:hidden!important}.fc-row.fc-widget-header{border-right-width:0!important; margin-right:0!important;}.fc-header-toolbar h2{font-size:15px!important}.fc-header-toolbar{background:#5C7099 url(images/gradients/gradient_thead.gif) repeat-x top left;color:white;margin:0!important}.fc-left{margin:3px}.fc-content-skeleton{padding-bottom:0!important}.fc-view-container{background-color:#BBC7CE}.fc-unthemed .fc-content, .fc-unthemed .fc-divider, .fc-unthemed .fc-list-heading td, .fc-unthemed .fc-list-view, .fc-unthemed .fc-popover, .fc-unthemed .fc-row, .fc-unthemed tbody, .fc-unthemed td, .fc-unthemed th, .fc-unthemed thead{border-color:white!important}td.fc-day.fc-widget-content.fc-fri.fc-today.fc-state-highlight{background:#2964a5}</style>');