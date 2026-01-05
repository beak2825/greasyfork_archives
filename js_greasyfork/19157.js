// ==UserScript==
// @name         Memrise - Extend use
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  Memrise extend use of 
// @author       Michal Metkowski
// @match        http://www.memrise.com/*
// @grant 	     GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant 	     unsafeWindow
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/19157/Memrise%20-%20Extend%20use.user.js
// @updateURL https://update.greasyfork.org/scripts/19157/Memrise%20-%20Extend%20use.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function ready(){
        GM_log('Memrise - Extend use - ready');
        if(document.location.pathname == "/mobile/"){
           document.location.href = "http://www.memrise.com/home/";
            return;
        }
        if(document.location.pathname.indexOf("/garden/") != -1){
            GM_log('Memrise Garden - STONA');
            $(document).on('click','.session-logo',function(){
               $('#left-area').css('display','none');
               $('#central-area').css('width','auto');
               $('#central-area .garden-box .ico-growth').css('right','70px');
               $('#central-area .garden-box .next-button').css('right','150px');
               $('li[data-choice-id]').css('width','100%');
               $('li[data-choice-id]').css('min-height','40px');
               $('li[data-choice-id]').css('float','left');
               $('li[data-choice-id]').css('padding','0');
               $('li[data-choice-id] .val').css('padding-left','42px');
               $('.garden-box .ico-growth.lev6.due-for-review').after('<div class=\'hhover\'><div style="display:block;height: 80px;width: 100px;">HOVER</div><audio src=""controls="" type="audio/mpeg" style="width: 80px;"></audio></div>');
               $('.garden-box .hhover').css({
                   'position':'absolute',
                   'top': '0px',
                   'right': '200px',
                   'width':'80px',
                   'cursor':'pointer',
                   'background-color': 'cyan'
               });
            });
            $(document).on('click','.garden-box .hhover div',function(e){
                $(this).text('123');
                //$('.garden-box .hhover audio')[0].pause();
                //$('.garden-box .hhover audio')[0].currentTime = 0;
                if($('#boxes li.active[data-choice-id]').length > 0){
                    var nextc = $('#boxes li.active[data-choice-id]').next();
                    $('#boxes li.active[data-choice-id]').removeClass('active');
                    if(nextc.length > 0){
                        nextc.addClass('active');
                    }
                    else
                    {
                       $('#boxes li[data-choice-id]').first().addClass('active');
                    }
                }
                else
                {
                  $('#boxes li[data-choice-id]').first().addClass('active');
                }
                $('.garden-box .hhover audio')
                    .attr('src',$('#boxes li.active[data-choice-id] a.audio-player')
                    .first()
                    .attr('href'));
                $('.garden-box .hhover audio')[0].play();
                
            });
        }
    }
    ready();
})();