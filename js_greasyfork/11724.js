// ==UserScript==
// @name         vk_skipper
// @version      0.1
// @description  u can skip any shit from yr newsfeed
// @author       M0j K0t
// @license      MIT
// @include      *vk.com*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/14309
// @downloadURL https://update.greasyfork.org/scripts/11724/vk_skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/11724/vk_skipper.meta.js
// ==/UserScript==

function vanillafeed() 
{
    
    var global_words = "(Крым|медведев|путин|навальн|гитлер|ленин|сталин|ельцин|митинг|фальсификац|выборов|выборах|парламент|триумфальн|избирательн|оппозиц|госдум|единая\sросс|единую\sросс|голосовал|нашист|омон|национализм|\sедро|партии|партия|арест)'";
    
    var publics = {};
    
    publics["https://vk.com/proglib"] = [ "#weekly@proglib", "#cpp@proglib"];
    publics["https://vk.com/tproger"] = [ "#link@tproger", "#problems@tproger", "#solutions@tproger"];
    publics["https://vk.com/existentialdatings"] = [ "#еМосква", "#eМосква"];    
    
    var reverse = {};
    reverse["https://vk.com/proglib"] = true;
    reverse["https://vk.com/existentialdatings"] = true;
    
        
    var li = document.getElementsByClassName("wall_text");
			
    for (var i = 0; i < li.length; i++)
    {
               
        var public_href = li[i].getElementsByClassName("wall_text_name")[0].getElementsByClassName("author")[0].href;
        
        if (Array.isArray(publics[public_href]) )
        {
            var skipper = new RegExp("(" + publics[public_href].join('|') + ")");
            var glob = new RegExp(global_words);
            
            li[i].parentNode.setAttribute('vfx', 'true');	
            
            var rev_flag = false;
            if (reverse[public_href])
            {
                rev_flag = true;
            }

            if ( glob.test(li[i].innerHTML) == true ) 
            {
                li[i].parentNode.parentNode.parentNode.parentNode.setAttribute('style','display: none; height: 0;'); 
                var skipBtn = li[i].parentNode.parentNode.parentNode.parentNode.getElementsByClassName("post_delete_button fl_r")[0];
                var clickEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent ('click', true, true);               
                skipBtn.dispatchEvent (clickEvent);                
                return;
            }   
                              
            if ( rev_flag ? (skipper.test(li[i].innerHTML) !== true) : (skipper.test(li[i].innerHTML) == true) ) 
            {
                li[i].parentNode.parentNode.parentNode.parentNode.setAttribute('style','display: none; height: 0;'); 
                var skipBtn = li[i].parentNode.parentNode.parentNode.parentNode.getElementsByClassName("post_delete_button fl_r")[0];
                var clickEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent ('click', true, true);               
                skipBtn.dispatchEvent (clickEvent);                
            }                   
        }
	}
}
setInterval(vanillafeed, 1000);