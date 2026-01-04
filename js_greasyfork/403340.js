// ==UserScript==
// @name				IMDb QoL
// @namespace		http://tampermonkey.net/
// @version			0.1
// @description	QoL at IMDb
// @author			MrOne
// @include			https://www.imdb.com/title/*
// @grant       none
// @require     http://code.jquery.com/jquery-latest.min.js
// @icon        data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/403340/IMDb%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/403340/IMDb%20QoL.meta.js
// ==/UserScript==


(function() {
    'use strict';
  	var style = $(`
    	<style>
				#castImage {
					object-fit: cover;
					object-position: center;
					transition: 0.5s ease;
  			  transform-origin: left top;
  			  z-index: 1;
				}
				#castImage:hover {
					transform: scale(4);
  			  z-index: 1;
  			  align-left: 50;
				}
			</style>
		`);
		$('html > head').append(style);
    var w=64, h, w1=256, h1;
    h=Math.round(w*1.375);
  	h1=Math.round(w1*1.375);
    $(document).ready(function() {
        var $img = $('.cast_list .odd .primary_photo a img, .cast_list .even .primary_photo a img');
        $img.each(function(index){
        	$(this).attr({
            width:w,height:h
          });
        	if ($(this).attr('loadlate')) {
            $(this).attr('id', 'castImage');
            $(this).attr('loadlate',function(i,val){
              return val.replace('_UX32_','_UX'+w1+'_').replace('_UY44_','_UY'+h1+'_').replace(/(?:_CR)(.*)(?:_AL_)/,'')
            });
          }
        	else {
            $(this).attr('id', 'castImage');
            $(this).attr('src',function(i,val){
              return val.replace('_UX32_','_UX'+w1+'_').replace('_UY44_','_UY'+h1+'_').replace(/(?:_CR)(.*)(?:_AL_)/,'')
            });
          }
        });
    });
})();