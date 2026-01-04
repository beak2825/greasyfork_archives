// ==UserScript==
// @name         百度去广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  简单的去下，根据广告字样判断
// @author       mfk
// @match        https://www.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/433534/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/433534/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeGg(){
        $("#content_left").children("div").each(function(){
            if(!$(this).attr("class")){
                if($(this).find('.ec-tuiguang').length>0)
                {
                   $(this).remove();
                }
				return;
            }
			var ggflag=false;
			$(this).find('a[target="_blank"]').each(function(){
				if($(this).text()=='广告')
				{
					ggflag=true;
					return;
				}

			})
			if(ggflag){

				$(this).remove();
			}

        });
    }
    
    setInterval(function(){
      removeGg()
    }, 800);
})();