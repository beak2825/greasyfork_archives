// ==UserScript==
// @name        jc_Page_Down
// @namespace   http://localhost/jc/
// @.require     https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js
// @.require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @.require     http://192.168.10.15/files/jquery-1.8.3.min.js
// @.require     http://192.168.10.15/files/jquery-1.11.0.min.js
// @include     http://*/forum.php?mod=viewthread*
// @include     http://*/forum/thread-*
// @include     http://*/*/viewthread.php*
// @include     http://*/*/forum*
// @include     http://weibo.com/*
// @include     http://www.flickr.com/*
// @include     http://www.google.co*/search?*
// @include     https://www.google.co*/search?*
// @include     http://www.upskirtcollection.com/*
// @include     http://www.akiba-online.com/*
// @include     http://*
// @include     https://*
// @exclude     https://*.pchome.com.tw/*
// @exclude     https://*.yahoo.com*
// @exclude     https://*.gohappy.com.tw/*
// @exclude     http://jsfiddle.net/*
// @exclude     http://localhost/*
// @exclude     http://localhost:*
// @exclude     http://*.tumblr.com/*
// @exclude     http://*.com/*mod=rss*
// @exclude     https://www.youtube.com/*
// @exclude     http://msdn.microsoft.com/*
// @exclude     http*://www.blogger.com/blogger.g?blogID*
// @exclude     http://www.google.com/reader/view/*
// @exclude     http://www.google.com.tw/reader/view/*
// @exclude     http://jsbin.com/*
// @exclude     http://*.gov.tw/*
// @exclude     https://*.gov.tw/*
// @exclude     http://*/feed/*
// @exclude     http://*shopping*
// @exclude     http://baike.baidu.com/picture/*
// @exclude     http://www.youtube.com/playlist?*
// @exclude     http://mall.cheerspoint.com.tw/*
// @exclude     http://writecodeonline.com/*
// @exclude     http://case.518.com.tw/*
// @exclude     http://www.104case.com.tw/*
// @exclude     http://yun.baidu.com/*
// @exclude     http://vimeo.com/*
// @exclude     http://*.html5rocks.com/*
// @exclude     http://www.dartlang.*
// @exclude     http://192.168.*
// @exclude     http://127.0.0.1*
// @exclude     https://*.taobao.com/*
// @exclude     http://*.taobao.com/*
// @exclude     http://*.360.cn/*
// @exclude     https://*.360.cn/*
// @exclude     https://*.google.co*/*edit
// @exclude     https://drive.google.co*/*
// @exclude     https://docs.google.com/*
// @exclude     http://open.163.com/*
// @exclude     https://mail.google.com/*
// @exclude     http://jshint.com/
// @exclude     https://jshint.com/
// @exclude     https://codecombat.com/*
// @exclude     http://*.org.tw/*
// @exclude     https://*.org.tw/*
// @exclude     https://www.google.com/*
// @exclude     https://*.google.com/*
// @exclude     https://www.google.com.tw/*
// @exclude     http://*.baidu.com/*
// @exclude     https://*.baidu.com/*
// @exclude     https://www.megabank.com.tw/*
// @exclude     http://earth.nullschool.net/*
// @exclude     https://*.google.co*
// @exclude     https://192.168.*
// @exclude     http://192.168.*
// @description Click to Next Scroll Page && Easy to View.
// @grant       GM_addStyle
// @grant       GM_log
// @version     0.5.6
// @modified     2015.02.24.00h
// @downloadURL https://update.greasyfork.org/scripts/4388/jc_Page_Down.user.js
// @updateURL https://update.greasyfork.org/scripts/4388/jc_Page_Down.meta.js
// ==/UserScript==

// https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js


jQuery.noConflict();
(function($) {
    $(function() {
        
        
        
        //GM_addStyle("#jcBtnPageDown {z-index:99998; background: -moz-linear-gradient(#FFFFFF 0%, #CCCCCC 100%) repeat scroll 0 0 #E5E5E5; border: 1px solid #AAAAAA; border-radius: 4px 4px 4px 4px; box-shadow: 0 1px 0 rgba(255, 255, 255, 0.6); color: #555555; display:block; width:auto; padding:0px; color:black; }");
        //GM_addStyle("#jcBtnPageDown {z-index:99998; border: 1px solid #AAAAAA; border-radius: 4px 4px 4px 4px; color: #555555; display:block; width:auto; padding:0px; }");
        GM_addStyle("#jcBtnPageDown { font-size:120%; max-width:80px; z-index:99998; }");
        GM_addStyle("#jcBtnPageDown button {border: 1px solid #AAAAAA; border-radius: 4px 4px 4px 4px; color: #555555; display:inline-block; width:auto; padding:0px; font-size:13px; }");
        GM_addStyle("#jcBtnPageDown button.hideClass {min-width:15px;}");
        
        var gScrolled = false;	// 是否捲動
        //var gBtnTopDiffNum = 0;		// 按鈕與視窗 Top 差距多少.
        var jc_click_last_time = 0;	// last click time
        
        $(document).ready(function() {		// 動態載入，也會觸發 document ready 事件
            
            //console.log('document ready event!');
            
            jcAppendEvents();
            
        });
        
        function hasClickEvent( jqObj ) {
            var elem = jqObj.get(0);
            var rule1 = (!('undefined' == typeof $._data( elem, "events" )));
            var rule2 = jqObj.attr('onclick');
            rule2 = (!((typeof rule2 == 'undefined') || (rule2 == null) || (rule2 == false)));
            
            return (rule1 || rule2);
        }
        
        
        function jcAppendEvents() {
            //	事件附加區
            //
            
            // Page Scroll Down
            $('html,body').on('click' , function(e) {
                
                var runnext = true;
                var eTagName = e.target.tagName;
                
                if (0 == $('#jcBtnPageDown').length) {
					$('#jcBtnPageDown').hide();
				}
                
                if ('' != window.getSelection()) {
                    //return;
                    //e.preventDefault();
                    runnext = false;
                }
                
                if (self.location != top.location) {
                    //return;
                    //e.preventDefault();
                    runnext = false;
                }
                
                
                if ( ('DIV' == eTagName) && ($(e.target).attr('sap-media')) ) {
                    
                    runnext = false;
                }
                console.log('click element == ' + eTagName );
                if (runnext) {
                    if( ('A' == eTagName) || ('LINK' == eTagName) || ( "BLOCKQUOTE" == eTagName) || 
                       //("P" == eTagName) || 
                       ("TEXTAREA" == eTagName ) || ( "INPUT" == eTagName ) || 
                       ( "SELECT" == eTagName ) || ( "OPTION" == eTagName ) || 
                       //( "UL" == eTagName ) || ( "LI" == eTagName ) || 
                       ( "MAP" == eTagName ) || ( "AREA" == eTagName ) || 
                       ( "CANVAS" == eTagName ) || ( "SVG" == eTagName ) || ( "G" == eTagName ) || ( "LINE" == eTagName ) || ( "RECT" == eTagName ) || ( "TEXT" == eTagName ) || 
                       ('BUTTON' == eTagName) || ( "IMG" == eTagName ) || ("EMBED" == eTagName ) || ("OBJECT" == eTagName ) || ( "VIDEO" == eTagName ) ) {
                        
                        runnext = false;
                        
                    }
                }
                
                if (runnext) {
                    if (('HTML' != eTagName) && ($( e.target ).parents('a').length > 0)) {
                        
                        runnext = false;
                        
                    }
                }
                
                
                
                if (runnext) {
                    //if ( ($(e.target).width() < 45) || ($(e.target).height() < 45) ) {
                    if ( ($(e.target).width() < 60) || ($(e.target).height() < 30) ) {
                        //if ( ($(e.target).width() < 100) || ($(e.target).height() < 100) ) {
                        
                        console.log('false, because: H = ' + $(e.target).height() + ' W = ' + $(e.target).width() + ' < (60,30)' );
                        runnext = false;
                        
                    }
                }
                
                if (!runnext) {
                    if( ('TD' == eTagName) || ('TH' == eTagName) ) {
                        runnext = true;
                    }
                }
                
                
                if (runnext) {
                    // 如果有 handle event , 則放棄
                    if (('HTML' != eTagName) && hasClickEvent($(e.target))) {
                        runnext = false;
                    }
                }
                
                if (!runnext) {
                    if ('BODY' == eTagName) {
                        runnext = true;
                    }
                }
                
                
                if (runnext) {
                    if (0 == $('#jcBtnPageDown').length) {
                        var insHtml = 	'<div id="jcBtnPageDown" align="left" style="display:none;">' + 
                            '<button type="button" class="PageDownClass">Page Down</button>' + 
                            '<button type="button" class="ezViewClass">易讀</button>' + 
                            '<button type="button" class="hideClass">-</button>' + 
                            '</div>';
                        $('body').append(insHtml);
                        $('#jcBtnPageDown button.PageDownClass').css('max-width' ,  Math.max(80 ,	parseInt($('#jcBtnPageDown button.PageDownClass').width() , 10) ) + 'px');
                        $('#jcBtnPageDown button.PageDownClass').click(function(e) {
                            jcGetNextScrollTop(e);
                            //e.stopPropagation();
                            //e.preventDefault();
                        });
                        
                        $('#jcBtnPageDown button.ezViewClass').click(function(e) {
                            doJcEasyView();
                        });
                        
                        $('#jcBtnPageDown button.hideClass').click(function(e) {
                            //$('#jcBtnPageDown').hide();
                            $('#jcBtnPageDown').remove();
                        });
                    } 
                    
                    //var x = e.pageX - this.offsetLeft - parseInt($('#jcBtnPageDown').width() / 2);
                    //var y = e.pageY - this.offsetTop - $(window).scrollTop() - parseInt($('#jcBtnPageDown').height() / 2) - 5;
                    
                    // use position:fixed
                    var x = e.pageX - this.offsetLeft - 55;
                    var y = e.pageY - this.offsetTop - $(window).scrollTop() - 13;
                    
                    console.log( ' W = ' + $(e.target).width() + ' , H = ' + $(e.target).height() );
                    console.log('  x = ' + x + ' , y = ' + y );
                    
                    
                    
                    
                    window.setTimeout(function() {
                        $('#jcBtnPageDown').css('position' , 'fixed')
                            .css('left' , x + 'px')
                            .css('top' , y + 'px')
                            .show();
                    }, 500);
                    
                    
                    e.stopPropagation();
                    e.preventDefault();
                }
                
            });
            
            
            //
            
            
        }
        
        
        function jcGetNextScrollTop(e) {
            // 取得下一個 scroll down 
            //	如果有 jcTumblrClickToRemoveThisArticle ，則以其為準
            //	沒有則下捲 doc_top + win_h - 180
            
            var t = new Date;
            var click_time = t.getTime();
            if ((click_time - jc_click_last_time) < 200) { return; }
            jc_click_last_time = click_time;
            
            
            var docTop = $(window).scrollTop();	// document scroll top
            var winH = Math.min( $(window).height() , window.innerHeight );				// window hieght
            var docH = $(document).height();			// document hieght
            var liTop = docTop + winH - 180;
            
            if (docH > winH) {	// check window height is correct!?
                // 下捲
                $(window).scrollTop(liTop);
                
                //GM_log('PageDown: docTop ' + docTop + ' , winH ' + winH + ' , docH ' + docH + ' , liTop ' + liTop);
                
                /*
		var y = parseInt($('#jcBtnPageDown').attr('data-y') , 10);
		y = y + ($(window).scrollTop() - docTop);
		$('#jcBtnPageDown').css('top' , y + 'px')
												.attr('data-y' , y);
		*/
                
            }
            
            liTop = null;
            docTop = null;
            winH = null;
            docH = null;
            
        }
        
        function doJcEasyView() {
            // 易讀性
            doJcEasyView_v2();
        }
        
        function doJcEasyView_v1() {
            // 易讀性 v1
            (function(){
                var winW = Math.min(1700 , parseInt($(window).width() , 10) - 50);
                var newSS, styles='* {background:white !important; color:black !important; line-height: 180% !important; font-size: 0.85cm !important; width:auto !important; max-width:' + winW + 'px; margin: 0 0 0 0 !important; } ' + 
                    ':link, :link * { color: #0000EE !important;} ' + 
                    ':visited, :visited * { color: #551A8B !important;} ' + 
                    'body {position:static !important; max-width:' + winW + 'px !important;}'; 
                if(document.createStyleSheet) { 
                    document.createStyleSheet("javascript:'"+styles+"'"); 
                } else { 
                    newSS=document.createElement('link'); 
                    newSS.rel='stylesheet'; 
                    newSS.href='data:text/css,'+escape(styles); 
                    document.getElementsByTagName("head")[0].appendChild(newSS);
                }})();
            
            
            //$('#jcBtnPageDown').hide();
            $('#jcBtnPageDown').remove();
        }
        
        function doJcEasyView_v2() {
            // 易讀性 v2
            $('div').each(function() {
                if (($(this).width()<=280) && ($(this).height()<500)) {
                    $(this).remove();
                }
            });
            
            $('body').find('script').remove();
            
            
            $('body').find('*')
            .css('width','auto')
            .css('clear','both')
            .css('float','none')
            .css('position' , 'static')
            .css('border','0px solid black')
            .css('background-image','none')
            //.css('background-color','white')
            //.css('color','black')
            .css('background-color','')
            .css('color','')
            .css('font-size', '1cm')
            .css('line-height','1.2cm')
            .css('height','auto')
            .css('display','block')
            .attr('id','');
            
            $('textarea').css('font-size', '');
            
        }
        
        
        
        
        
    });
})(jQuery);
