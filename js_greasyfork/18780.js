// ==UserScript==
// @name         Salesforce Live Search
// @namespace    Indow
// @version      0.198918
// @description  adds live search results to salesforce global search
// @author       mat
// @include      *.salesforce.com/001*
// @include      *.salesforce.com/002*
// @include      *.salesforce.com/003*
// @include      *.salesforce.com/006*
// @include      *.salesforce.com/007*
// @include      *.salesforce.com/500*
// @include      *.salesforce.com/00Q*
// @include      *.salesforce.com/00T*
// @include      *.salesforce.com/home*
// @include      *.salesforce.com/_ui*
// @include      *.salesforce.com/ui*
// @include      *.salesforce.com/a0W*
// @include      *.salesforce.com/a0t*
// @exclude      *.salesforce.com/01Z*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18780/Salesforce%20Live%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/18780/Salesforce%20Live%20Search.meta.js
// ==/UserScript==

(function() {
    
    'use strict';
if(window.location.pathname.substring(1, 4) == '001'){
$("#00N0L000006Wlcv_ileinner").css({'max-height':'5em','overflow':'auto'});
}

window.alltypes = [];
$("input[name=sen]").each(function(){alltypes.push($(this).attr('value')); });
	$('head').append('<style type="text/css">#floatingresultsfadeout .fadein, #floatingresultsfadeout .fadeout{z-index:2099!important}.fadein{-webkit-animation-name:blur;-webkit-animation-duration: .5s;-webkit-animation-iteration-count: 1} .fadeout2{-webkit-animation-name:blur;-webkit-animation-duration: .5s;-webkit-animation-iteration-count: 1;animation-direction: reverse;}@-webkit-keyframes blur {0%{-webkit-filter:blur(4px);}100% {-webkit-filter:blur(0px)}}@-webkit-keyframes fadeout {0%{opacity:1;}100% {opacity:0;}}</style>');
    // Your code here...
	
	function throttle(f, delay){
    var timer = null;
    return function(){
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = window.setTimeout(function(){
            f.apply(context, args);
        },
        delay || 1);
    };
}
	
if($("#00NE0000005HNTy_ileinner").text().indexOf('VIP') >= 0 || $("#CF00NE0000006Oc9a_ileinner").text().length > 1){console.log('VIP');
											
												  $("#section_header").css('text-align','center').append("<img src='http://www.indowwindows.com/wp-content/uploads/2016/07/vip.gif' alt='VIP'>");
												   
var colors = new Array(
  [62,35,255],
  [60,255,60],
  [255,35,98],
  [45,175,230],
  [255,0,255],
  [255,128,0]);

var step = 0;
//color table indices for: 
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0,1,2,3];

//transition speed
var gradientSpeed = 0.02;

function updateGradient()
{
  
  if ( $===undefined ) return;
  
var c0_0 = colors[colorIndices[0]];
var c0_1 = colors[colorIndices[1]];
var c1_0 = colors[colorIndices[2]];
var c1_1 = colors[colorIndices[3]];

var istep = 1 - step;
var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
var color1 = "rgb("+r1+","+g1+","+b1+")";

var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
var color2 = "rgb("+r2+","+g2+","+b2+")";

 $('#section_header').css({
   background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
    background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
  
  step += gradientSpeed;
  if ( step >= 1 )
  {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];
    
    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    
  }
}

setInterval(updateGradient,10);
												   
												   
	
												  }
window.lastomni = '';
					$("#phSearchContainer").css("z-index","999");
	
							$('<div/>', {   id: 'searchbackdrop',
    width: '100%',
    height: '100%',  
}).prependTo("body");
	$('#searchbackdrop').css({
	'display' : 'none',
        'position' : 'fixed',
'background' : 'black',
    'opacity': '.2',
        'z-index': '998',
	    'pointer-events' : 'none'
    });
	
		$( window ).resize(function() {
			$('#floatingresults').css({
		'margin-left' : function() {return -$(this).outerWidth()/2},
        'margin-top' : function() {return -$(this).outerHeight()/2}
    });		
		});
	
	
$(document).keyup(function(f) {
	if($("#floatingresults:visible").length >= 1){
if (f.keyCode === 27) $("#floatingresults, #searchbackdrop").fadeOut();
	}
  else if($("#floatingresults:visible").length == 0){ 
	  if($("#floatingresults > #searchResultsHolderDiv").length >= 1){
	  if (f.keyCode === 27) $("#floatingresults, #searchbackdrop").fadeIn(), $("#phSearchInput").focus();
	  }
		  if (f.keyCode === 192) $("#phSearchInput").focus();
	  if (f.keyCode === 27) $("#phSearchInput").focus();
	  
  }
	});
$(document).on('click', function (e) {
	if($("#floatingresults:visible").length >= 1){
		$("#floatingresults, #floatingresultsfadeout, #searchbackdrop").fadeOut();
	}
});
	
	$('#phSearchForm').on('click', function(e) {
    e.stopPropagation();
});
	
	$("#phSearchInput").focusout(function(){
		setTimeout(function(){
			if($("#phSearchInput_autoCompleteBoxId:visible").length >= 1){
			}
				else{
					 $("#searchbackdrop").fadeOut();
				}
			
							 },1);
	});

			
		  $("#phSearchInput").on('input', _.debounce(omnisearch, 200) );
												
												
	$("#phSearchInput").focusin(function(){
		if($("#searchResultsHolderDiv").length >= 1){
			$("#floatingresults, #searchbackdrop").fadeIn();
	}
	});

			function loadmore(){			
				
								$("a.nextArrow, a.prevArrow").each(function(){
var nexturl = $(this).attr('onclick');
var offset = nexturl.match(/offset=.*?offset=(.*?)&/);
var type = nexturl.match(/fen=(.*?)&/);
									var omni2 = $("#phSearchInput").val().trim();		
								//	var omni2 = encodeURIComponent(omni);
						$(this).attr('href','javascript:void(0);');
						

						$(this).on('click', function(event){
							 event.preventDefault();
	$(this).closest('.bRelatedList').load('/_ui/search/ui/UnifiedSearchResults?offset='+offset[1]+'&_dc=1455665821852&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&initialViewMode=detail&fen=' + type[1] + '&str=*' + omni2 + '* #singleEntitySearchResult > .bRelatedList', function(){
		$("#floatingresults").find("td.pbHelp").remove();	
		loadmore();
	});

	
});
									if($(this).hasClass("prevArrow")){
										$(this).next().attr('href','javascript:void(0);');
									   $(this).next().on('click', function(event){
										    event.preventDefault();
	$(this).closest('.bRelatedList').load('/_ui/search/ui/UnifiedSearchResults?offset='+offset[1]+'&_dc=1455665821852&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&initialViewMode=detail&fen=' + type[1] + '&str=*' + omni2 + '* #singleEntitySearchResult > .bRelatedList', function(event){
		 $("#floatingresults").find("td.pbHelp").remove();	
		loadmore();
	});
	
});
								}
																   else{
																	   $(this).prev().attr('href','javascript:void(0);');
						$(this).prev().on('click', function(event){
							 event.preventDefault();
	$(this).closest('.bRelatedList').load('/_ui/search/ui/UnifiedSearchResults?offset='+offset[1]+'&_dc=1455665821852&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&initialViewMode=detail&fen=' + type[1] + '&str=*' + omni2 + '* #singleEntitySearchResult > .bRelatedList', function(event){
		 $("#floatingresults").find("td.pbHelp").remove();	
		
		loadmore();
	});
						});
							
						
			}

});
			}	
	
window.lastomni = '';
					$("#phSearchContainer").css("z-index","999");
	 if(!$("#searchbackdrop")){
							$('<div/>', {   id: 'searchbackdrop',
    width: '100%',
    height: '100%',  
}).prependTo("body");
   
	$('#searchbackdrop').css({
	'display' : 'none',
        'position' : 'fixed',
'background' : 'black',
    'opacity': '.2',
        'z-index': '998',
	    'pointer-events' : 'none'
    });
}
		$( window ).resize(function() {
			$('#floatingresults').css({
		'margin-left' : function() {return -$(this).outerWidth()/2},
        'margin-top' : function() {return -$(this).outerHeight()/2}
    });		
		});
	
	
$(document).keyup(function(f) {
	if($("#floatingresults:visible").length >= 1){
if (f.keyCode === 27) $("#floatingresults, #searchbackdrop").fadeOut();
	}
  else if($("#floatingresults:visible").length == 0){ 
	  if($("#floatingresults > #searchResultsHolderDiv").length >= 1){
	  if (f.keyCode === 27) $("#floatingresults, #searchbackdrop").fadeIn(), $("#phSearchInput").focus();
	  }
		  if (f.keyCode === 192) $("#phSearchInput").focus();
	  if (f.keyCode === 27) $("#phSearchInput").focus();
	  
  }
	});
$(document).on('click', function (e) {
	if($("#floatingresults:visible").length >= 1){
		$("#floatingresults, #floatingresultsfadeout, #searchbackdrop").fadeOut();
	}
});
	
	$('#phSearchForm').on('click', function(e) {
    e.stopPropagation();
});
	
	$("#phSearchInput").focusout(function(){
		setTimeout(function(){
			if($("#phSearchInput_autoCompleteBoxId:visible").length >= 1){
			}
				else{
					// $("#searchbackdrop").fadeOut();
				}
			
							 },1)
	});

			
		  $("#phSearchInput").keyup( _.debounce(omnisearch, 200) );
												
												
	$("#phSearchInput").focusin(function(){
		if($("#searchResultsHolderDiv").length >= 1){
			$("#floatingresults, #searchbackdrop").fadeIn();
	}
	});

			function loadmore(){			
				
								$("a.nextArrow, a.prevArrow").each(function(){
var nexturl = $(this).attr('onclick');
var offset = nexturl.match(/offset=.*?offset=(.*?)&/);
var type = nexturl.match(/fen=(.*?)&/);
									var omni2 = $("#phSearchInput").val().trim();		
								//	var omni2 = encodeURIComponent(omni);
						$(this).attr('href','javascript:void(0);');
						

						$(this).on('click', function(event){
							 event.preventDefault();
	$(this).closest('.bRelatedList').load('/_ui/search/ui/UnifiedSearchResults?offset='+offset[1]+'&_dc=1455665821852&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&initialViewMode=detail&fen=' + type[1] + '&str=*' + omni2 + '* #singleEntitySearchResult > .bRelatedList', function(){
		$("#floatingresults").find("td.pbHelp").remove();	
		loadmore();
	});

	
});
									if($(this).hasClass("prevArrow")){
										$(this).next().attr('href','javascript:void(0);');
									   $(this).next().on('click', function(event){
										    event.preventDefault();
	$(this).closest('.bRelatedList').load('/_ui/search/ui/UnifiedSearchResults?offset='+offset[1]+'&_dc=1455665821852&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&initialViewMode=detail&fen=' + type[1] + '&str=*' + omni2 + '* #singleEntitySearchResult > .bRelatedList', function(event){
		 $("#floatingresults").find("td.pbHelp").remove();	
		loadmore();
	});
	
});
								}
																   else{
																	   $(this).prev().attr('href','javascript:void(0);');
						$(this).prev().on('click', function(event){
							 event.preventDefault();
	$(this).closest('.bRelatedList').load('/_ui/search/ui/UnifiedSearchResults?offset='+offset[1]+'&_dc=1455665821852&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&initialViewMode=detail&fen=' + type[1] + '&str=*' + omni2 + '* #singleEntitySearchResult > .bRelatedList', function(event){
		 $("#floatingresults").find("td.pbHelp").remove();	
		
		loadmore();
	});
						});
							
						
			}

});
			}
    window.resultsnumber = 1;
			  function omnisearch(){
              var omnival = $("#phSearchInput").val().trim();
                  
				  if(omnival == lastomni){
					   if($("#floatingresults:visible").length == 0){
					  $("#floatingresults, #searchbackdrop").fadeIn();
					   }
					  console.log('same');return false;console.log('same2');}
             if(omnival.length >= 2 ){
				 				 // var contentToRemove = document.querySelectorAll("#searchResultsHolderDiv");
//$(contentToRemove).remove(); 
				
				 // var omni = encodeURIComponent(omni);
				  var searchpath = "/_ui/search/ui/UnifiedSearchResults?searchType=2";
				  var searchtype = "&cmp=singleEntitySearchResult&initialViewMode=detail";
				  var recordtypes = ["006","00Q","001","003","500","a0t"];
				  if($.isNumeric(omnival)){ recordtypes.push("a0W", "a0V");
										  if(omnival.length == 5){
										  recordtypes = ["a0W", "a0V"]}
										  }
				 var omni = "&str=*"+omnival+"*";
				 if( $("#floatingresults").length >= 1 ){
				 $("#floatingresults").attr('id','floatingresultsfadeout');
					 
				 }
				 $('<div/>', {
    id: 'floatingresults',
    width: '50%',
}).appendTo("body");
	$('#floatingresults').css({
		'display': 'inline',
		'min-width': '50em',
        'position' : 'absolute',
        'left' : '50%',
        'top' : '1em',
        'z-index': '1999',
        'margin-left' : function() {return -$(this).outerWidth()/2},
        'margin-top' : function() {return -$(this).outerHeight()/2}
    });
				 $('#floatingresults').on('click', function(e) {
    e.stopPropagation();
});
				 
				 $.each(recordtypes, function(index, value){
				 var searchurl = searchpath+searchtype+"&fen="+value+omni;
					 
				 $.get( searchurl, function( data2 ) {
                  if($(data2).find(".noRowsHeader").text() == "No matches found"){
                     
                      
					  
					  return false;
                                                         }
                    else{
                        resultsnumber ++;
                            console.log(resultsnumber);
						//$("#phSearchInput_autoCompleteBoxId").css({"width":"auto", "border-top-right-radius":"11px"});
						var results = $(data2);
						//results.find(".pbInnerFooter").remove();

                     //    results.find(".pbInnerFooter").find("a").attr('href', 'javascript: $("#phSearchButton").click()');
					//	results.find("#searchResultsHolderDiv a.summaryShowMoreLink").each(function(){	
							//$(this).attr('href', 'javascript:void(0);');										 });
						if(results.find(".pbInnerFooter").length > 0){
var nexturl = results.find("a.nextArrow").attr('onclick');
var offset = nexturl.match(/offset=.*?offset=(.*?)&/);
var type = nexturl.match(/fen=(.*?)&/);
													results.find("a.nextArrow").on('click', function(event){
							 event.preventDefault();
	$(this).closest('.bRelatedList').load('/_ui/search/ui/UnifiedSearchResults?offset='+offset[1]+'&cmdType=cmp&cmp=singleEntitySearchResult&initialViewMode=detail&fen=' + type[1] + omni + ' #singleEntitySearchResult > .bRelatedList', function(){
		$("#phSearchInput_autoCompleteBoxId").find("td.pbHelp").remove();	
		loadmore();
	});
	
});
																		results.find("a.nextArrow").prev().on('click', function(event){
							 event.preventDefault();
	$(this).closest('.bRelatedList').load('/_ui/search/ui/UnifiedSearchResults?offset='+offset[1]+'&_dc=1455665821852&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&initialViewMode=detail&fen=' + type[1] + omni + ' #singleEntitySearchResult > .bRelatedList', function(){
		$("#floatingresults").find("td.pbHelp").remove();	
		loadmore();
	});
	
});
						}
				
				//		results.find("#searchResultsHolderDiv a.summaryShowMoreLink").on('click', function(){
				//			var type = $(this).attr('id').slice(-3);
				//			$(this).closest('.bRelatedList').load('/_ui/search/ui/UnifiedSearchResults?searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&initialViewMode=detail&fen=' + type + omni + '* #singleEntitySearchResult > .bRelatedList', function(){
								//$("#phSearchInput_autoCompleteBoxId").find("td.pbHelp").remove();	
// loadmore();
							//});
						//});
						results.find("script").remove();
						results.find("td.pbHelp").remove();
						results.find(".pbBody").css({"max-height":"15em","overflow-y":"auto","overflow-x":"hidden"});
						results.find(".relatedListsearchHeader").remove();
						results.find(".pbHeader").on('click', function(){
							$(this).next(".pbBody").slideToggle();			
						});
						results.find("#searchResultsHolderDiv").on('click', function(){
							$(this).find(".pbBody").css({"max-height":"100em"});
							

						});
						//results.find("#searchAllSummaryView").attr('href', 'javascript: $("#phSearchButton").click()');
						//results.find("#Lead").parent().appendTo( results.find("#Contact").parent() );
						 //results.find("#Opportunity").parent().appendTo( results.find("#Lead").parent() );
						//results.find("#Dealer_Zipcode__c").parent().appendTo( results.find("#searchResultsHolderDiv > div[class^='list']:last") );
						results.find("#searchResultsHolderDiv").css({"-webkit-box-shadow": "rgba(0, 0, 0, 0.74902) -15px 15px 18px -3px","opacity":"0"}).addClass("fadein").attr("type",value).appendTo("#floatingresults").velocity({opacity:1});
						//$("#floatingresultsfadeout").find(".fadein[type='" + value + "']").addClass("fadeout");
						//$("#phSearchInput_autoCompleteBoxId").append(results.find("#searchResultsHolderDiv"));
						
						if($("#searchbackdrop:visible").length == 0){
						$("#searchbackdrop").fadeIn();
						}
						
		
						
						
					}
                 
					 window.lastomni = omnival;
					 if($("#floatingresultsfadeout")){
									
									
										  setTimeout(function() {
											  
				$("#floatingresultsfadeout > .fadein").velocity({ opacity: 0 });
				 }, 200);
									
									setTimeout(function() {
var contentToRemove = document.querySelectorAll("#floatingresultsfadeout");
$(contentToRemove).remove(); 
					  }, 1000);
			  
				  
						
					}
					 
	
                                        });
               });
				 		   
                 

			  }
                   if (resultsnumber === 0){
                         $("#phSearchInput").velocity("stop");
                          $("#phSearchInput").velocity({backgroundColor:"#FFDADA"});
                      $("#phSearchInput").velocity({backgroundColor:"#fff"});
                     }
    
				 resultsnumber = 0;
			  }
})();