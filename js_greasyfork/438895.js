// ==UserScript==
// @name         TCF 2022 Mods
// @namespace    http://tampermonkey.net/
// @version      0.1.44
// @description  Restore some links/looks from the old TCF
// @author       dswallow
// @include      https://www.tivocommunity.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438895/TCF%202022%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/438895/TCF%202022%20Mods.meta.js
// ==/UserScript==
(function() {

    'use strict';
    var $ = $ || window.$;
    var isTouchDevice = 'ontouchstart' in document.documentElement;
    
// .hScroller-scroll ==> following page
// .california-upper-page-nav ==> thead page
// .california-filter-container ==> forum page/thread list
    $('.hScroller-scroll').append(
//    $('.hScroller-scroll,.california-upper-page-nav').append(
                  '<a style=""  class="tabs-tab" href="/watched" rel="nofollow" qid="following-participated-discussions">Following</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                  '<a style="" class="tabs-tab" href="/account/alerts" rel="nofollow" qid="following-participated-discussions">Alerts</a>&nbsp;&nbsp;&nbsp;&nbsp;');

    $('.california-outer-upper-nav,.california-filter-container').append(
                  '&nbsp;&nbsp;<a style="" class="showunread tabs-tab">Hide Read Threads</a>&nbsp;&nbsp;');

    // add colored visited links
    $('head').append("<style>a.thread-title--gtm:visited, a.structItem-title:visited  { color:#8e44ad !important; }</style>");

	$('#footer').html(
		'&nbsp;&nbsp;<a style="" id="showignored" class="tabs-tab">Show Ignored Threads</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
		'<a style="" class="toggletooltips tabs-tab">Tooltip Previews</a>&nbsp;&nbsp;&nbsp;&nbsp;'
	).show();

    // add hover to user menu dropdown
    $('[qid="navbar-profile-button"]').hover(
         function() {$(this).trigger("click");},
         function() {} );  // leave this, it's required for hoverout to do nothing

    $('.menu-account--content').append('<hr class="menu-separator"><ul class="listPlain"><li><a id="OpenCustomizationDialog" href="#" class="OpenCustomizationDialog menu-linkRow" qid="customization-popup-item">Customization...</a></li></ul>');
    $('.menu-account--content').append('<hr class="menu-separator"><ul class="listPlain"><li><a id="OpenNewsFeed" href="/whats-new/news-feed" class="menu-linkRow" qid="news-feed-popup-item">News Feed</a></li></ul>');

    //move things around
    $('[qid="thread-position-footer"]').css("float","right");
    $('.california-lower-page-nav').css("float","left"); //bottom pagination
    $('[qid="action-bar-section"]').css("float","right");
    // hide recommended reading, footer
    $("#thread-recommended-reading").hide();

    // add 'follow' link to bottom of thread page
	$('[qid="thread-position-footer"]').prepend($(".button-group").html()+"&nbsp;&nbsp;&nbsp;");

    // color political forum threads with appropriate background color
    $.each( $('[itemprop="item"]'), function() {
        if ($(this).attr("href").indexOf("political-talk.63")>0 || $("title").text().indexOf("Political Talk")>0) {
            let bgc = window.getComputedStyle($('.has-js')[0],null).getPropertyValue("background-color");
//          console.log("color=" + bgc);

            var bgcolor;
            // Background color in light mode
            if (bgc == 'rgb(255, 255, 255)') {
                bgcolor = 'mistyrose';
            }
            // Background color in dark mode
            else {
                bgcolor = 'darkred';
            }

            $(".p-body").css("background", bgcolor);
            $.each( $(".message-cell--user,.message-inner"), function() {$(this).attr('style', 'background: '+bgcolor+' !important;')});
        }
    });

//    if ($("title").text().indexOf("Political Talk")!=-1) {
//        $(".p-body").attr("style","background: linear-gradient(79deg, #c10808, transparent);");
//    };

    // add location to user-bit area
    // dswallow bug fix
    // morac contribution to change userbit on orientation change on mobile
	$.each($(".userbit-info"), function(key, val) {
         if ($(val).children().length>3) {  
            var h=(val.children[3].attributes.title.nodeValue);
            if (h!="") val.children[2].innerHTML+="&nbsp;<span class='user-port'> "+h+"</span><span class='user-land'><br>"+h+"</span>";
         }
     });
    function addLocation(aEvent) {
        var landscape = aEvent ? (aEvent.orientation == "landscape") : window.matchMedia("(orientation: landscape)").matches;
		if (landscape) {$(".user-land").show();$(".user-port").hide();}
		else {$(".user-port").show();$(".user-land").hide();}
    };
	$(window).on("orientationchange",addLocation);
    addLocation();

    // add edit link to action bar after edit or new post
	$(document).on("click", '#edit-thread-save-button,[qid="quick-reply-post-submit"]', function(e) {
	    setTimeout(function () {
			movelinks();
        },2000);
	});

    // add link to user posts
    $.each($('[qid="message-number-of-posts"]'), function() {
        let x_member_a = $($(this).parent().parent()).find('.username');
        $(this).html('<a title="Latest Activity" target=_blank href="'+x_member_a.attr("href")+'#latest-activity">'+$(this).html()+'</a>');
    });
//    $(document).on("click", '[qid="message-number-of-posts"]', function(e) {
//		let x_member_a = $($(this).parent().parent()).find('.username');
//        window.open(x_member_a.attr("href") + '#latest-activity');
//	});

    // Force the page to reload if we return to it via navigation buttons in the browser
    window.addEventListener("pageshow", function(event) {
        var historyTraversal = event.persisted ||
            (typeof window.performance != "undefined" && window.performance.navigation.type === 2);
        if (historyTraversal) {
            // Handle page restore.
            window.location.reload();
        }
    });


function movelinks() {
    console.log('movelinks');
	var edits=$('[data-xf-click="quick-edit"]');
	$.each( edits, function( key, val ) {
		var editlnk=$(this);
		var id=editlnk.attr("href");
		var newid=id.replace("edit","bookmark");
		$(this).prepend("&#9998;");
		$('[href="'+newid+'"').parent().append(editlnk);
		$('.menu-linkRow').css("margin-top","3px");
	});
	$('[qid="action-bar-section"]').css("float","right");
}

    var ignorelist=[];
	var page= window.location.pathname;	
	if (page.search("threads")==-1) {
      	$.ajax({
	    type: 'post',
		    url: 'https://lexbrook.com/tcf/list.php',
		    dataType: 'json',
		    data: {
    			action: 'list',
			    user: $(".avatar--xxs").data("user-id")
		    },
		    complete:  function(response) {
    			ignorelist=response.responseJSON;
			    processthreads();
		    },
		    success: function (response) {},
		    error:function(XMLHttpRequest,status,error){ alert("AJAX error:"+error+" Ajax Status:"+status);	}
	    });
	}

	function processthreads() {
    // open threads in new window with infinitey icon
	 $.each( $('[qid="thread-item-title"]'), function() {
		$(this).parent().append('&nbsp;&nbsp;<a title="Open thread in new browser window" target=_blank href="'+$(this).attr("href")+'">&nbsp;&nbsp;&infin;&nbsp;&nbsp;</a>');
		var title=$(this).html();
		var cls=$(this).parent().parent().parent().attr('class');
		var pos=cls.search("js-threadListItem-");
		var id=parseInt(cls.substr(pos+18,7));
         if (ignorelist.indexOf(id)!=-1) {
			 $(this).parent().append('&nbsp;&nbsp;<a title="Unignore Thread" style="font-size: 8px;vertical-align: top;" class="ignore" data-action="unignore" data-threadid="'+id+'" data-title="'+title+'" >&nbsp;&nbsp;&#9989;&nbsp;&nbsp;</a>');
			 $(this).parent().parent().parent().addClass("ignored--thread").hide();
		} else {
			$(this).parent().append('&nbsp;&nbsp;<a title="Ignore Thread" style="font-size: 8px;vertical-align: top;" class="ignore" data-action="ignore" data-threadid='+id+' data-title="'+title+'" >&nbsp;&nbsp;&#10060;&nbsp;&nbsp;</a>');
			$(this).parent().parent().parent().removeClass("ignored--thread").show();

		}
	 });
	}

    var ignoretimout;
	$(document).on( "click", '.ignore', function(e) {
        var elm=$(this);
	  	$.ajax({
			type: 'post',
			url: 'https://lexbrook.com/tcf/save.php',
			dataType: 'json',
			data: {
				action: $(this).data("action"),
				id:$(this).data("threadid"),
				title:$(this).data("title"),
				user: $(".avatar--xxs").data("user-id")
			},
			complete:  function(response) {
				//var reply=response["responseJSON"];
				if (elm.data("action")=="ignore") {
					elm.html("Ignored").data("action","unignore");
					ignoretimout=setTimeout(function() {
							   elm.parent().parent().parent().addClass("ignored--thread").slideUp();
				},2000);
				} else {
					clearTimeout(ignoretimout);
					elm.html("Unignored");
				}
			},
			success: function (response) {},
			error:function(XMLHttpRequest,status,error){ alert("AJAX error:"+error+" Ajax Status:"+status);	}
		});
	});

	movelinks();

    //color read threads as reduced opacity
    $('.structItem--is-read').parent().parent().parent().css("font-weight","normal").css("opacity","0.55");
	// mark clicked on threads that open up in a new window as read
	$(document).on("click", '[qid="thread-item-title"]', function(e) {
		/*if (cook=="2")*/ $(this).parent().parent().parent().css("font-weight","normal").css("opacity","0.55");
	});

    //hide read threads if localstorage is set to 1 or undefined
    if (localStorage.showthreads=="hide" || localStorage.showthreads==undefined) {
       setTimeout(function () {
          $('.structItem--thread:not(".is-unread")').hide();
          $(".showunread").html("Show Read Threads");
		  localStorage.showthreads="hide";
      },500);  // hide all read threads after 100ms
    } else {$(".showunread").html("Hide Read Threads").data("unread",false);}


    $(".showunread").on('click', function() {
		if (localStorage.showthreads=="hide") {
            $(".showunread").html("Hide Read Threads");
			$('.structItem--thread:not(".ignored--thread")').slideDown();
			localStorage.showthreads="show";
        }
        else {
            $(".showunread").html("Show Read Threads");
            $('.structItem--thread:not(".is-unread")').slideUp();
			localStorage.showthreads="hide";
        }
    });


	if (localStorage.hidepreviews==1) {
		// thanks to laria for this...
		$('<style>').text('.memberTooltip,.tooltip.tooltip--preview { display: none !important; }').appendTo('head');
		$(".toggletooltips").html("Enable Tooltip Previews");
	}
	else {
		$(".toggletooltips").html("Disable Tooltip Previews");
	}

	$(".toggletooltips").on('click', function() {
		// for some reason I can't figure out, 'localStorage.hidepreviews=!localStorage.hidepreviews;' doesn't work
		// so I have to do it this kludged way. And yes, I tried all the true/false versions instead of 1/0. 
		if (localStorage.hidepreviews==1) {localStorage.hidepreviews=0;}
		else {localStorage.hidepreviews=1;}
		location.reload();
	});

	$("#showignored").on('click', function() {
		$('.ignored--thread').slideDown();
	});


    $(".OpenCustomizationDialog").on('click', function() {
            //$("#dialog").dialog({modal: true, height: 590, width: 1005 });
            var w = window.open("", "popupWindow", "width=600, height=400, scrollbars=yes, menubar=yes");
            var $h = $(w.document.head);
            $h.html(`
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Customizations</title>
  <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="/resources/demos/style.css">
  <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
  <script src="https://code.jquery.com/ui/1.13.0/jquery-ui.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.js"></script>
  <script>
  $( function() {
    var spinner = $( "#spinner" ).spinner();

    $( "#disable" ).on( "click", function() {
      if ( spinner.spinner( "option", "disabled" ) ) {
        spinner.spinner( "enable" );
      } else {
        spinner.spinner( "disable" );
      }
    });
    $( "#destroy" ).on( "click", function() {
      if ( spinner.spinner( "instance" ) ) {
        spinner.spinner( "destroy" );
      } else {
        spinner.spinner();
      }
    });
    $( "#getvalue" ).on( "click", function() {
      alert( spinner.spinner( "value" ) );
    });
    $( "#setvalue" ).on( "click", function() {
      spinner.spinner( "value", 5 );
    });

    $( "button" ).button();
  } );
  </script>
</head>
            `);

            var $w = $(w.document.body);
            $w.html(`
<!--<!doctype html>
<html lang="en">-->
<body>

<p>
  <label for="spinner">Select a value:</label>
  <input id="spinner" name="value">
</p>

<p>
  <button id="disable">Toggle disable/enable</button>
  <button id="destroy">Toggle widget</button>
</p>

<p>
  <button id="getvalue">Get value</button>
  <button id="setvalue">Set value to 5</button>
</p>


</body>
<!--</html>-->
                    `);
        });

})();
