// ==UserScript==
// @name           jcNextPic
// @namespace      http://localhost/jc/
// @require	   https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.1.min.js
// @include        http://*/discuz/thread*
// @include        http://*/viewthread*
// @include        http://*/thread-*
// @include        http://blog.xuite.net/*
// @include        http://*/viewtopic.php*
// @include        http://www.cecet.cn/*
// @include        http://*.77tuba.com/*
// @include        http://77tuba.com/*
// @include        http://*.blogspot.com/*
// @include        http://www.mobile01.com/*
// @include        http://*/forum.php*viewthread*tid*
// @include        http://*.pixnet.net/*
// @include        http://*.mop.com/*
// @include        http://*.sina.com.cn/*
// @include        http://*/*/archives/*
// @include        http://*.stockstar.com/*html
// @include        http://*.soso.com/*
// @include        http://*.pixnet.net/blog/post/*
// @include        http://bbs.taobao.com/catalog/thread/*
// @include        http://mm.taobao.com/*
// @include        http://www.dong.tw/*
// @include        http://www.dongtw.com/*
// @include        http://*dong.tw/*
// @.downloadURL    https://userscripts.org/scripts/source/82324.user.js 
// @.updateURL      https://userscripts.org/scripts/source/82324.meta.js
// @copyright  	   2013+, JC
// @description    Arrangement Pictures and Click a button to view Next Pic. 排列圖片(由左而右、由上而下)，按一個按鈕便可依序往下的瀏覽圖片.
// @grant 				GM_log
// @grant 				GM_addStyle
// @version	       2014.09.10.22h.00m
// @downloadURL https://update.greasyfork.org/scripts/4008/jcNextPic.user.js
// @updateURL https://update.greasyfork.org/scripts/4008/jcNextPic.meta.js
// ==/UserScript==



(function($) {



GM_addStyle("div#jcNextPic { position:fixed; cursor:pointer; top:10px; right:10px; border:1px solid #66CCFF; background-color:yellow; padding:2px; font-size:11px; z-index:100; }");
GM_addStyle("span.jcButton { cursor:pointer; border:1px solid #66CCFF; background-color:yellow; padding:2px; font-size:11px; z-index:10000; }");

var jc_nextpic_mark = 'NP';
var jc_click_last_time = 0;
var jc_support_link = true; // 支援 facebook , weibo 等連結
var created_array = false;
var array_imgs = [];
var imgs_count = 0;
var img_min_w = 150;

letsJQuery();


// All your GM code must be inside this function
function letsJQuery() {
    //alert($); // check if the dollar (jquery) function works
    //alert($().jquery); // check jQuery version
    
    if ( ($(document).width() >= 500) && ($(document).height() >= 300) && ($(window).width() >= 500) ) {
    	window.setTimeout(function() {
				doJCNextPic(); 
			} , 100);
    }
    
    
}


function create_img_array() {
	// create img array
	//$(document).scrollTop(0);
	if (!created_array) {
		$('img').each(function() {
			if ( ($(this).width() > 200) && ($(this).height() > 200) ) {
				array_imgs.push(this);
				imgs_count++;
			}
		});
		
    
    var includeSites = ["facebook.com", "weibo.com", "twitter.com", "instagram.com"];  // 需要的 KEY WORD
    var excludeSites = ["share", "ck101"];  // 不需要的 KEY WORD
    
    var ahref;
    var aSite = '';
    var aExcludeStr = '';
    var hasExcludeStr = false;
    $('a').each(function() {
      if ($(this).attr('href')) {
        ahref = $(this).attr('href');
        
        for (idx in includeSites) {
            aSite = includeSites[idx];
            if (-1!=ahref.indexOf(aSite)) { // 網址含有 includeSites 其中之一
              hasExcludeStr = false;
              for (idx2 in excludeSites) {
                aExcludeStr = excludeSites[idx2];
                hasExcludeStr = (-1!=ahref.indexOf(aExcludeStr));
                if (hasExcludeStr) { break; }
              } // for
              if (!hasExcludeStr) {   // 未含不需要的字串
                array_imgs.push(this);
                imgs_count++;
              }
            }
        } // for
        
      }
    });
		
    /*
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
    */    
		
		created_array = true;
		
	}
}

// All your GM code must be inside this function
function doJCNextPic() {
	
	var html = '';
	
	var link_id = 10000;
	
	var goto_top = false;

	// View Next Pic
	//next_pic_html = '<span id="jcNextPic" style="position:fixed; cursor:pointer; top:10px; right:10px; border:1px solid #66CCFF; background-color:yellow; padding:2px; font-size:11px; z-index:10;">Next Pic</span>';
	next_pic_html = '<div id="jcNextPic" class="jcArea">' + 
					'<input type="button" id="jcNextPicBtn" value="Next Pic" />' + 
					'<input type="button" id="jcNextPicHideBtn" value="-" title="Hide" /><br />' + 
					'<span id="jcAutoWidthBtn" class="jcButton">auto</span>' + 
					'<span id="jc100WidthBtn" class="jcButton">100%</span>' + 
					'<span id="jcCrossImagesBtn" class="jcButton">排</span>' + 
					'<span id="jcEasyViewBtn" class="jcButton">易讀</span>' + 
					'</div>';
	
	
	$('body').prepend( next_pic_html );
	
	//$(document).scroll(function() {		$('#jcNextPic').text( $(document).scrollTop() );	});
	
	$('#jcNextPicHideBtn').click(function() {
		// Hide All jc area
		//$('#jcNextPic').hide();
		$('.jcArea').hide();
	});
	
	$('#jcNextPicBtn').click(function() {
	
		var t = new Date;
		var click_time = t.getTime();
		
		if ((click_time - jc_click_last_time) < 200) { return; }
		jc_click_last_time = click_time;
		
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
          if ('a' == elm.tagName.toLowerCase()) {
            $(elm).css('border', '5px solid blue');
            setTimeout(function() {
              $(elm).css('border', '0px solid blue');
            }, 2000);
          }
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
		$('img').filter(function() {
        return (parseInt($(this).height()) >= img_min_w);
		}).each(function() {
        jcSetImageAutoWH($(this));
		});
	});
	
	$('#jc100WidthBtn').click(function() {
		$('img').filter(function() {
			return (parseInt($(this).height()) >= img_min_w);
		}).each(function() {
			$(this).css('width' , '100%')
					.css('height' , '100%');
		});
	});
	
	$('#jcCrossImagesBtn').on('click' , function() {
    $('#jcAutoWidthBtn').trigger('click');
		doJcNextPicCrossImages();
	});
	
	$('#jcEasyViewBtn').click(function() {
		doJcEasyView();
	});

	// 將 Lazy Image 顯示出來
	window.setTimeout(function() {
		doLoadLazyImgs();
	} , 3000);
  
	
}


function doJcNextPicCrossImages() {
	// 排列圖片
	var container = $('body:eq(0)'),
        cw = container.width(),
        container2 = $('<div></div>'),
        wh = $(window).height(),
        ih = 0,
        iw = 0;
	
	container.prepend(container2);
	
	$('body').find('img').each(function() {
		if ( ($(this).width() > 200) && ($(this).height() > 200) ) {
      ih = $(this).height();
      iw = $(this).width();
      if (ih > wh) {
        // 縮小圖片高度
        $(this).height(wh)
                  .width(iw*(wh/ih))
                  .css('border-right' , '1px solid yellow');
      }
			container2.append($(this));
			$(this).css('vertical-align' , 'top');
		}
	});
  
  // 點擊圖檔->原始大小
  $('img').on('click', function() {
      jcSetImageAutoWH($(this), true);
  });
  
}

function jcSetImageAutoWH(Qobj , showBorder = false) {
  // 設置圖檔寬高為 auto
  Qobj.css('width', 'auto')
                 .css('height', 'auto')
                 .removeAttr('height')
                 .removeAttr('width');
  if (showBorder) {
    Qobj.css('border', '1px solid blue');
  }
}

function doJcEasyView() {
	// 易讀性
	(function(){
		var newSS, styles='* {background:white !important; color:black !important; line-height: 180% !important; font-size: 0.85cm !important; width:auto !important; margin: 0 0 0 0 !important; position:static !important;} :link, :link * { color: #0000EE !important;} :visited, :visited * { color: #551A8B !important;}'; 
		if(document.createStyleSheet) { 
			document.createStyleSheet("javascript:'"+styles+"'"); 
		} else { 
			newSS=document.createElement('link'); 
			newSS.rel='stylesheet'; 
			newSS.href='data:text/css,'+escape(styles); 
			document.getElementsByTagName("head")[0].appendChild(newSS);
		}})();
}

function doLoadLazyImgs() {
	// 將 Lazy Image 顯示出來
	var flags   = '';
	var regex   = new RegExp('http(s|)://((.*?)(([^.]*?)\.([^.]*?)))/' , flags);
	var matches = regex.exec(location.href);
	globalHost    = matches[2];       // ex: www.wretch.cc
	globalDomain  = matches[4];   // ex: wretch.cc
		
		
	var arr1 = [ ['taobao.com' , 'data-ks-lazyload'] , 
											['mop.com' , 'data-original'] ,
                      ['dongtw.com' , 'data-original']  
										];
		
	for (var i = 0; i < arr1.length; i++) {
		var a = arr1[i][0];
		var b = arr1[i][1];
		if (a == globalDomain) {
			$('img').each(function() {
				if ($(this).attr(b)) {
					var imgsrc = $(this).attr(b);
          var src_def = '';
          if ($(this).attr('src')) {
            src_def = $(this).attr('src');
          }
          if (src_def != imgsrc) {
              $(this).attr('src' , imgsrc)
                         .removeAttr(b);
          }
				}
			});
		}
	} // for i
	/*
	if ('taobao.com' == globalDomain) {
		$('img').each(function() {
			if ($(this).attr('data-ks-lazyload')) {
				var imgsrc = $(this).attr('data-ks-lazyload');
				$(this).attr('src' , imgsrc)
							.removeAttr('data-ks-lazyload');
			}
		});
	} 
	*/
	
  
}


})(jQuery);

