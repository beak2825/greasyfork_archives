// ==UserScript==
	// @name        TSL Chat Board Enhancements
	// @namespace   TSLChatEnhancement
	// @description Techsideline.com Chat board enhancement script adds preview button next to threads as well as basketball/football schedules to the right column. Press escape or click preview window to close.
	// @metadata    TechSideline,TSL
	// @include     http://chat.virginiatech.sportswar.com/message_board/*
	// @require		http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
	// @require     http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
	// @version     2.2.4
// @downloadURL https://update.greasyfork.org/scripts/14696/TSL%20Chat%20Board%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/14696/TSL%20Chat%20Board%20Enhancements.meta.js
	// ==/UserScript==

		$(document).ready(function()
		{
			  var oldSrc = 'http://virginiatech.sportswar.com/wp-content/uploads/sites/15/2014/01/lvl0.gif';
			  var inThreadSrc = 'http://virginiatech.sportswar.com/wp-content/uploads/sites/15/2014/01/lvl1.gif';
			  var Expand = "http://findicons.com/files/icons/1156/fugue/16/toggle_expand.png";
			  var Collapse = 'http://findicons.com/files/icons/1156/fugue/16/toggle.png';
			  var Search = "<img src='http://png-5.findicons.com/files/icons/117/radium/16/search.png'/>";
				var currentURL = window.location.href;
			  $('body').append("<div id='NWTempHolder' style='display:none;'></div><div style='position:relative;' id='NWbottomWrapper'><div id='NWbottomRight' style='position:absolute;background-color:#fff;border:8px solid #E87511;padding:10px;'></div></div>");
			if (currentURL.indexOf('vtbasketball')>0){
					var URLsearch = "http://virginiatech.sportswar.com/vt-basketball/2015-16-virginia-tech-basketball-schedule-phone/";
					var tableID = '#tablepress-194';
			} else if (currentURL.indexOf('vtfootball')>0){
					var URLsearch = "http://virginiatech.sportswar.com/vt-football/2015-virginia-tech-football-schedule/";
					var tableID = '#tablepress-175';	
			}
			$.getJSON("http://alloworigin.com/get?url=" + encodeURIComponent(URLsearch) + "&callback=?", function(data){
					var live_str = $('<div>',{html:data.contents});

					var schedule = live_str.find(tableID).parent().html();
					$(".ads").append(schedule);

			});
            /* Remove the following 2 lines to default to Expanded view */
			//$('.children').hide();
			//$('img[src="' + Collapse + '"]').attr('src', Expand);  

			$('.subject').each(function( index ) {				  
			  var getLink = $(this).attr('href');
			  var SearchLink = "<a href='"+getLink+"' class='NWPreview'>"+Search+"</a>";
			  $(this).prepend(SearchLink);
			});		
			
			$('.post').on('click', '.expand', function (){
				  var CurrentIMG = $(this).attr('src');
				  var SubjectContent = $(this).parent().html();

				  if (CurrentIMG == Expand)
				  {
					  $(this).attr('src',Collapse);
					  while( $(this).parent().next().attr('class') == '.HasChildren'){
              
            }
            find('.HasChildren').show();
					  
					  // var MainSubject = $(this).parent().parent().html();
					  // MainSubject = MainSubject.replace(SubjectContent,"");
					  // MainSubject = MainSubject.replace("display:none","");
					  
					  // $(this).parent().parent().html(MainSubject);

				  } else {
					  $(this).attr('src',Expand);
					  var MainSubject = $(this).parent().html();
					  MainSubject = "<div class='MainSubject'>" + MainSubject + "</div>";
					  var ThreadContent = $(this).parent().parent().html();
					  ThreadContent = MainSubject + "<div style='display:none' class='collapsedContent'>" + ThreadContent + "</div>";
					  $(this).parent().parent().html(ThreadContent);
				  }
			});
				$(document).keyup(function(e) {
           if (e.keyCode == 27) { // escape key maps to keycode `27`
              $("#NWbottomRight").hide();
          }
      });
			$(document).on('click','.NWPreview',function(e) {
					   e.preventDefault();
					   var pageURL = $(this).attr('href');
						$('#NWbottomRight').load(pageURL + ' .message-content').show().offset({top:e.pageY,left:e.pageX+20});
			});

			$(document).on('click','#NWClosePreview',function(e) {
				   e.preventDefault();    
				   $('#NWbottomRight').hide();
			});
			
			$(document).on('mouseout','.NWPreview',function(e) {
				   e.preventDefault();    
				   //$('#NWbottomRight').hide();
			});
            
            $(document).on('click','#NWbottomRight',function(e) {
      				e.preventDefault();    
				 	$(this).hide();      
            });
						   
		});