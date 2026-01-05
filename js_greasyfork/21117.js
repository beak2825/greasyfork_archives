// ==UserScript==
// @name        Block-Adblocker-blocker
// @namespace   http://www.piyushsoni.com
// @description Blocks Anti-adblockers on several Indian News Sites
// @include     http://timesofindia.indiatimes.com/*
// @include     http://www.hindustantimes.com/*
// @include     http://*.ndtv.com/*
// @include     http://*.anandabazar.com/*
// @include     http://indianexpress.com/*
// @run-at      document-start
// @version     1.40
// @grant       none
// @author      Piyush Soni (irrationalapps+blockerblocker@gmail.com)
// @license     GNU LGPL v3 (https://www.gnu.org/licenses/lgpl-3.0.html)
// @downloadURL https://update.greasyfork.org/scripts/21117/Block-Adblocker-blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/21117/Block-Adblocker-blocker.meta.js
// ==/UserScript==

var url = window.location.href.toLowerCase();
var domain = new URL(url).hostname.replace("www.","");
var mapPagesBlockerBlockers = {};
var countStopped = 0;
var countToCheck = 0;
var arrPageBlockers;


//Add new blocker list here
///mapPagesBlockerBlockers['<domain>'] = ['<external script source match>','<inline script source match>', <stop any 1 r more(count)>]
mapPagesBlockerBlockers['indiatimes.com'] = [['detector', 'blocked.cms', 'opacity'], 1];
mapPagesBlockerBlockers['hindustantimes.com'] = [['BlockerScript', 'checkAdBlocker'], 2];
mapPagesBlockerBlockers['ndtv.com'] = [['canRunAds'], 1];
mapPagesBlockerBlockers['anandabazar.com'] = [['custom.js', 'checkAdBlock'], 2];
mapPagesBlockerBlockers['indianexpress.com'] = [['ie_block_redirect.js'], 1];


var arrDomain = domain.split('.');
if(arrDomain.length > 2)
	domain = arrDomain[arrDomain.length - 2] + "." + arrDomain[arrDomain.length - 1];

function scriptListener(e)
{
    let i = 0;
    let src = e.target.src;
    let html = e.target.innerHTML;
    for(i=0; i < arrPageBlockers.length; ++i)
    {
        let blocker = arrPageBlockers[i];
        if(blocker.length > 0 && ((typeof src != "undefined" && src && src.indexOf(blocker) >= 0) || (typeof html != "undefined" && html && html.indexOf(blocker) >= 0)))
		{
			//Stop this nonsense. 
			e.preventDefault();
			e.stopPropagation();
			
			console.log("Blocked an Anti-adblocker for " + domain);

			countStopped++;
			if(countStopped >= countToCheck)
			{
				//We're done, remove the event listener now
				window.removeEventListener(e.type, arguments.callee, true);
			}
		}
    }
}

if(domain in mapPagesBlockerBlockers)
{
	arrPageBlockers = mapPagesBlockerBlockers[domain][0];
	countToCheck = mapPagesBlockerBlockers[domain][1];
	window.addEventListener('beforescriptexecute', scriptListener, true);
}
