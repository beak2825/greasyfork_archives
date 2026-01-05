// ==UserScript==
// @name           jc_FitImg
// @namespace      http://localhost/jc/
// @.require     http://192.168.10.15/files/jquery-1.7.2.min.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @include        http://tieba.baidu.com/f?kz=*
// @include        http://*/article/reader.php*
// @include        http://blog.*
// @include        http://*/html/*/*.html
// @include        http://*/html/book/*.shtml
// @include        http://*/*/*.html
// @include        http://*/viewthread*
// @include        http://*/discuz/thread*
// @include        http://*/thread-*
// @include        http://*/viewtopic.php*
// @include        http://www.cecet.cn/*
// @include        http://*.blogspot.com/*
// @exclude        http://tt.mop.com/*
// @exclude        http://www.piring.com/bbs/*
// @exclude        http://ck101.com/*
// @exclude        http://imagetwist.com/*/*.jpg.html
// @exclude        http://www.dlsite.com/*
// @description    將圖放大. 保護眼睛.
// @version	       2014.09.22.23h
// @grant           GM_addStyle
// @grant           GM_log
// @downloadURL https://update.greasyfork.org/scripts/5211/jc_FitImg.user.js
// @updateURL https://update.greasyfork.org/scripts/5211/jc_FitImg.meta.js
// ==/UserScript==



(function($) {

GM_addStyle("span#jcNextPic { position:fixed; cursor:pointer; top:10px; right:10px; border:1px solid #66CCFF; background-color:yellow; padding:2px; font-size:11px; z-index:100; }");
GM_addStyle("span.jcButton { cursor:pointer; border:1px solid #66CCFF; background-color:yellow; color:black; padding:2px; font-size:11px; z-index:100; }");

/*
// Add jQuery
function loadjQuery() {
	
	if('undefined' == typeof unsafeWindow.jQuery) { 
		if (!GM_JQ) {
			//alert('1apple:1');
			var GM_JQ = document.createElement('script');
			//GM_JQ.src = 'http://jqueryjs.googlecode.com/files/jquery-1.2.6.min.js';
			//GM_JQ.src = 'http://jqueryjs.googlecode.com/files/jquery-1.3.min.js';
			//GM_JQ.src = 'http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js';
			//GM_JQ.src = 'http://127.0.0.1:100/jquery-1.3.2.min.js';
			//GM_JQ.src = 'http://192.168.10.15/files/jquery-1.4.2.min.js';
			//GM_JQ.src = 'http://192.168.10.15/files/jquery-1.4.4.min.js';
			GM_JQ.src = 'http://192.168.10.15/files/jquery-1.7.2.min.js';
			//GM_JQ.src = 'http://code.jquery.com/jquery-1.4.4.min.js';
			//GM_JQ.src = 'http://192.168.10.15/files/jquery-1.6.4.min.js';
			//GM_JQ.src = 'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.4.min.js';
			GM_JQ.type = 'text/javascript';
			document.getElementsByTagName('head')[0].appendChild(GM_JQ);
			//alert('1apple:2');
		}
	}
}

if ( ( 'undefined' == typeof unsafeWindow.jQuery ) || ( 'undefined' == typeof unsafeWindow.jQuery.noConflict ) ) {
	loadjQuery();
}
*/

// Check if jQuery's loaded
/*
function GM_wait() {
	
	if('undefined' == typeof unsafeWindow.jQuery) { 
		window.setTimeout(GM_wait,100); 
	} else { 
		$ = unsafeWindow.jQuery;
		//var $ = unsafeWindow.jQuery.noConflict(true); 
		letsJQuery(); 
	}
}

GM_wait();

*/

letsJQuery(); 

var created_array = false;
var array_imgs = [];
var imgs_count = 0;

function create_img_array() {
	// create img array
	//$(document).scrollTop(0);
	if (!created_array) {
		
    var imgs = document.images.length;
    for(i = 0; i< imgs; i++) {
      objImg = $(document.images[i]);
      if ( (objImg.width() > 200) && (objImg.height() > 200) ) {
				array_imgs.push(this);
				imgs_count++;
			}
    } // for
    
		try {
			$('iframe').each(function() {
				
				var iframe_imgs = this.contentWindow.document.images;
				
				for (i = 0; i < iframe_imgs.length; i++) {
					if ( (iframe_imgs[i].width > 200) && (iframe_imgs[i].height > 200) ) {
						array_imgs.push(iframe_imgs[i]);
						imgs_count++;
					}
				}
				
			});
		} catch (e) {
		}		
		
		created_array = true;
		
	}
}

// All your GM code must be inside this function
function dojcResizeImage() {
	
	var html = '';
	
	var link_id = 10000;
	
	var goto_top = false;

	// View Next Pic
	//var next_pic_html = '<span id="jcNextPic" style="position:fixed; cursor:pointer; top:10px; right:10px; border:1px solid #66CCFF; background-color:yellow; padding:2px; font-size:11px; z-index:10;">Next Pic</span>';
	var next_pic_html = '<span id="jcNextPic"><input type="button" id="jcNextPicBtn" value="Next Pic" /><input type="button" id="jcNextPicHideBtn" value="-" title="Hide" /><br />' + 
									'<span id="jcAutoWidthBtn" class="jcButton">auto</span>' + 
									'<span id="jc100WidthBtn" class="jcButton">100%</span>' + 
                  '<span id="jcCrossImagesBtn" class="jcButton">排</span>' + 
									'</span>';
	
	
	$('body').prepend( next_pic_html );
	
	//$(document).scroll(function() {		$('#jcNextPic').text( $(document).scrollTop() );	});
	
	var imgCollection = $('img').filter(function(index) {
		return (($(this).width() > 100) && ($(this).height() > 100));
	});
	
	if (0 == imgCollection.length) {
		$('#jcNextPic').hide();
	} else {
		$('#jcNextPic').show();
	}
	
	$('#jcNextPicHideBtn').click(function() {
		$('#jcNextPic').hide();
	});
	
	$('#jcNextPicBtn').click(function() {
		
		create_img_array();
		
		if (goto_top) {
			$(document).scrollTop(0);
			//$('#jcNextPic').text('Next Pic');
			$('#jcNextPicBtn').val('Next Pic');
			goto_top = false;
		}
		
		var doc_top = $(document).scrollTop();
		var oked = false;
		var jump_nexted = true;
		
		$.map(array_imgs , function(elm , idx) {
			//$('body').append( idx + ': ' + $(document).scrollTop() + ' ;;; ' + doc_top + '<br />' );
			if (!oked) {
				elm.scrollIntoView();
				if ($(document).scrollTop() >= (doc_top+1)) {
					oked = true;
				}
			}
		});
		
		if (doc_top == $(document).scrollTop()) {
			jump_nexted = false;
		}
		
		if (!jump_nexted) {
			//$('#jcNextPic').text('Goto First');
			$('#jcNextPicBtn').val('Goto First');
			goto_top = true;
		}
		
	});
	
	
	$('#jcAutoWidthBtn').click(function() {
		var imgs = document.images.length;
    for(i = 0; i< imgs; i++) {
      objImg = $(document.images[i]);
			objImg.css('width' , 'auto')
                  .css('height' , 'auto');
		} // for
	});
	
	$('#jc100WidthBtn').click(function() {
		var imgs = document.images.length;
    for(i = 0; i< imgs; i++) {
      objImg = $(document.images[i]);
			
			if (objImg.width() > 300) {
				objImg.css('width' , '100%')
                    .css('height' , '100%');
			}
		} // for
	});
  
  // 排列圖片
  $('#jcCrossImagesBtn').click(function() {
      doJcCrossImages();
  });
	
	
}




//if (!$) {	GM_wait(); } 

// All your GM code must be inside this function
function restoreSourceImage() {

	doJcMainWork();
	
}


function doJcMainWork() {
	
	var doCount = 0;

	
	//GM_log('jc_fitimg START doJcMainWork().');	
	//GM_log('jc_fitimg IMG count = ' + $('img').length);	
	
	
	var imgs = document.images.length;
  for(i = 0; i< imgs; i++) {
		
		try {
      objImg = $(document.images[i]);
			var ImgWidth = objImg.width();
			var ImgHeight = objImg.height();
			
			if ( (ImgWidth > 250) && (ImgHeight > 500) && ("undefined" == typeof objImg.attr('jcFitImg')) ) {
				
				var InnerWidth = window.innerWidth;
				var InnerHeight = window.innerHeight;
				
				//if (InnerWidth > 1200) {				InnerWidth = 1200;			}
				
				
				if (true) {
					// 取得 Image 的 Left
					var elem = document.images[i];
					var xPos = elem.offsetLeft;
					var tempEl = elem.offsetParent;
			  		while (tempEl != null) {
			  			xPos += tempEl.offsetLeft;
				  		tempEl = tempEl.offsetParent;
			  		}
					var ImgLeft = xPos;
					// ...
					//var ratio = (InnerWidth - Math.min(ImgLeft,32)) / ImgWidth;
					var ratio = (InnerWidth - ImgLeft) / ImgWidth;
					
					var ImgNewWidth 	= ImgWidth * ratio - 52;
					var ImgNewHeight 	= ImgHeight * ratio - 32;
					
					var LimitWidth = 1200;
					if (ImgNewWidth > LimitWidth) {
						ImgNewHeight = ImgNewHeight * (LimitWidth/ImgNewWidth);
						ImgNewWidth = LimitWidth;
					} else {
						ImgNewWidth = LimitWidth;
						ImgNewHeight = ImgHeight * (ImgNewWidth/ImgWidth);
					}
			
					
					//GM_log('jc_fitimg IMG src = ' + $(this).attr('src') );
					//GM_log('jc_fitimg IMG ' + doCount + ' -> Old WH=' + ImgWidth + 'x' + ImgHeight );
					//GM_log('jc_fitimg IMG ' + doCount + ' -> New WH = ' + ImgNewWidth + 'x' + ImgNewHeight);
					
					
					doCount++;
					
					objImg.width(ImgNewWidth)
                  .height(ImgNewHeight)
                  .css('border' , '1px groove red')
                  .css('z-index' , '10')
                  .attr('jcFitImg' , true);
                  //.attr('title' , 'Left = ' + ImgLeft + ' :: Old = ' + ImgWidth + 'x' + ImgHeight + ' :: New = ' + ImgNewWidth + 'x' + ImgNewHeight);
				}
			}
		} catch(e) {
			GM_log('jc_fitimg EXCEPT in 255 line.');
		}
	}; // for
	
	
	
	if (doCount > 0) {
		//alert('jc Fit Images count = ' + doCount);
	}

	/*
	window.setTimeout( function() {
		doJcMainWork();
	} , 5000 );
	*/
	
	
}

function letsJQuery() {

	var url_self = window.location.href;
	try {
		var url_parent = window.parent.location.href;
	} catch(e) {
		var url_parent = '';
	}
	
	if ( url_self == url_parent ) {

		window.setTimeout(function() {
		
			if ( (typeof jc_nextpic_mark == 'undefined') || ('NP' != jc_nextpic_mark) ) {
				//alert($);
				window.setTimeout(function() {
					restoreSourceImage();
				} , 100);
				
				window.setInterval(function() {
					restoreSourceImage();
				} , 5000);
				
				window.setTimeout(dojcResizeImage , 100);
			}
		
		} , 3000);
    
    
    window.setTimeout(function() {
      
        /*
        var imgs = document.images.length;
        for(i = 0; i< imgs; i++) {
          $(document.images[i]).css('width', '1800px');
        }
        */
      
    }, 1000);
    
		
	}
	
}


function doJcCrossImages() {
	// 排列圖片
  console.log("exec doJcCrossImages()");
	var container = $('body');
	var cw = container.width();
	var container2 = $('<div id="divJcCrossImagesArea"></div>');
	
	container.prepend(container2);
	
	container.find('img').each(function() {
		if ( ($(this).width() > 200) && ($(this).height() > 200) ) {
      
      if ($(this).parent()[0].tagName == 'A') {
        container2.append('<span style="width:30px; height:30px;"><a href="' + $(this).parent().attr('href') + '" target="_blank">LINK</a></span>');
      }
      container2.append($(this));
      $(this).css('vertical-align' , 'top');
      
		}
	});
}



//GM_log('GM_run_jc_piring_add_url' + document.documentElement.innerHTML.match(re));

})(jQuery);

