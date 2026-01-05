// ==UserScript==
// @name         Direct Google (modified by rickzabel)
// @namespace    https://greasyfork.org/en/scripts/14034-direct-google-modified-by-rickzabel
// @version      1.63
// @description  Removes Google ad links, redirects and exposes "Cached" links.
// @include      /^https?\:\/\/(www|news|maps|docs|cse|encrypted)\.google\./
// @author       rickzabel
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/14034/Direct%20Google%20%28modified%20by%20rickzabel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/14034/Direct%20Google%20%28modified%20by%20rickzabel%29.meta.js
// ==/UserScript==


//A modified version of "direct Google" by zanetu https://greasyfork.org/en/scripts/568-direct-google
//I added the ability to convert Google's ad link to normal links, I also change the ad text to 'Normalized by Zabel'

	var Version = GM_info.script.version;
	var ScriptName = GM_info.script.name;

	var UpdateMessage = "yes"; // yes alert the user, no has a silent update.
	var VersionUpdateNotes = ScriptName + " has been updated to v" + Version;
	//remove any lines >1 month old. dont leave \n on last line.
	VersionUpdateNotes = VersionUpdateNotes + "\n" +
	"Attempting to remove the tracking links from the shopping results that show up in searches. Changed normalized by zabel to -Ad";
	if (UpdateMessage === "yes") {
		var ScriptNameVersion = ScriptName.replace(/\s/g, "") + "Version"; //prepare the scripts name for
		if (localStorage.getItem(ScriptNameVersion) !== Version) {
			alert(VersionUpdateNotes);
			localStorage.setItem(ScriptNameVersion, Version);
		}
	}
	

//http://www.googleadservices.com/pagead/aclk?sa=L&ai=C_dPwZxM1V_CiA4_LhATlg50wuO7f0kTIwZPLmgOBnJUGCAAQASgEYMnO-Yfwo-wSoAGHupXLA8gBAaoEJE_QnDiOkILHWbMF85k_2W_yzLWmvPvDDGZ-usak9tehyXF1JIgGAYAHoO6gT4gHAZAHAqgHpr4b2AcB&ohost=www.google.com&cid=CAESIeD2gluQ0uPxBEhtEGTA5eX5OpXsU7okBiNyw0e7jXvEbg&sig=AOD64_3qJn56lwN6RGxZA-dPU0SzEGy7hg&clui=0&q=&ved=0ahUKEwjMxrb62dXMAhVB5CYKHW73AHcQ0QwIGg&adurl=http://tracker.marinsm.com/rd%3Fcid%3D901pdb6671%26mid%3D901n7v6848%26mkwid%3DsHbX3GEGS%26pcrid%3D110129574448%26pkw%3Dlaptops%26pmt%3De%26pdv%3Dc%26lp%3Dhttp://altfarm.mediaplex.com/ad/ck/12309-80731-2056-0%3FCID%3D290627%26LID%3D5569869%26st%3Dlaptops%26VEN1%3DsHbX3GEGS,110129574448,901n7v6848,c%26VEN2%3De,laptops%26DURL%3Dhttp%253A%252F%252Faltfarm.mediaplex.com%252Fad%252Fck%252F26965-198869-2056-1%253F


//http://www.googleadservices.com/pagead/aclk?sa=L&ai=CqisTZxM1V_CiA4_LhATlg50wuP6Oy0TSlIu5ngLahrn-lQQIBhABKAhgyc75h_Cj7BKgAY6z0csDyAEHqgQrT9CMUtORqsZZs03zMH89GQWV-6KwtnMTH9jnDzm-E_oDl5Iz0DZuLGtvCMAFBYgGAaAGJoAH2syuNIgHAZAHAqgHpr4b2AcB4BKCr4DBnrqB9pcB&ohost=www.google.com&cid=CAESIeD2gluQ0uPxBEhtEGTA5eX5OpXsU7okBiNyw0e7jXvEbg&sig=AOD64_1wfq1Ey0F6rJFnM2x3rwGHMt1l1A&ctype=5&clui=19&q=&ved=0ahUKEwjMxrb62dXMAhVB5CYKHW73AHcQuxcIyAE&adurl=http://clickserve.dartsearch.net/link/click%3Flid%3D92700008502620473%26ds_s_kwgid%3D58700000769771384%26ds_e_adid%3D76893776546%26ds_e_product_group_id%3D143341273946%26ds_e_product_id%3DASUS-Chromebook-flip-2gb%26ds_e_product_merchant_id%3D102760793%26ds_e_product_country%3DUS%26ds_e_product_language%3Den%26ds_e_product_channel%3Donline%26ds_e_product_store_id%3D%26ds_e_ad_type%3Dpla%26ds_s_inventory_feed_id%3D97700000001723538%26ds_url_v%3D2%26ds_dest_url%3Dhttps://store.google.com/product/asus_chromebook_flip%3Fsku%3D_asus_chromebook_flip_2gb%26utm_source%3Den-ha-na-us-sem%26utm_medium%3Ddesktop%26utm_content%3Dplas%26utm_campaign%3DAsusCB%26gl%3Dus

var hostname = location.hostname;
var pathname = location.pathname;
var href = location.href;

String.prototype.contains = function(s) {
	return -1 !== this.indexOf(s);
};

String.prototype.startsWith = function(s) {
	return this.slice(0, s.length) == s;
};

function blockListeners(element, events) {
	function stopBubbling(event) {
		event.stopPropagation();
	}

	var eventList = events.split(' ');
	if(eventList) {
		var i, event;
		for(i = eventList.length - 1; i > -1; i--) {
			event = eventList[i].trim();
			if(event) {
				element.removeEventListener(event, stopBubbling, true);
				element.addEventListener(event, stopBubbling, true);
			}
		}
	}
}

function modifyGoogle() {
    var hostname = location.hostname;
	var pathname = location.pathname;
	var href = location.href;
	
/*	
	$('a[href^="http"]').each(function() {
			blockListeners(this, 'click contextmenu');
			//legacy
			console.log(this.href.contains('http://www.googleadservices.com'));
			if(this.href.contains('url?')) {
				var m = this.href.match(/(?:\&|\?)q\=(http.*?)(\&|$)/i);
				if(m && m[1]) {
					this.href = decodeURIComponent(m[1]);
				}
			}
		});
	*/
	
		
	
	$('a[href^="http"]').each(function() {
			
			if(this.href.contains('http://www.googleadservices.com')) {
		/*
	http://www.google.com%26cid%3Dcaesied2gluq0upxbehtegta5ex5opxsu7okbinyw0e7jxvebg%26sig%3Daod64_1wfq1ey0f6rjfnm2x3rwghmt1l1a%26ctype%3D5%26clui%3D19%26q%3D%26ved%3D0ahukewjmxrb62dxmahvb5cykhw73ahcquxciyae%26adurl%3Dhttp//clickserve.dartsearch.net/link/click?lid=92700008502620473&ds_s_kwgid=58700000769771384&ds_e_adid=76893776546&ds_e_product_group_id=143341273946&ds_e_product_id=ASUS-Chromebook-flip-2gb&ds_e_product_merchant_id=102760793&ds_e_product_country=US&ds_e_product_language=en&ds_e_product_channel=online&ds_e_product_store_id=&ds_e_ad_type=pla&ds_s_inventory_feed_id=97700000001723538&ds_url_v=2&ds_dest_url=https://store.google.com/product/asus_chromebook_flip?sku=_asus_chromebook_flip_2gb&utm_source=en-ha-na-us-sem&utm_medium=desktop&utm_content=plas&utm_campaign=AsusCB&gl=us
	http://www.googleadservices.com/pagead/aclk?sa=L&ai=CkN1J3DA1V_G8F8_LhAS69prYDe6w8vgFvobBp5oCruSL-N4CCAQQBSgFYMnO-Yfwo-wSoAG66b7dA8gBB6oEKU_QXN1xja42FXfXEH2R_VbzaLNtcAnU6Ayjofl7szadNDXN3bFFSCbaugUTCNqatob21cwCFUtLJgodG2kMUcAFBcoFAIgGAaAGJoAHrpbBIogHAZAHAqgHpr4b2AcB4BL0upmh5fPsnk0&ei=3DA1V9q8EsuWmQGb0rGIBQ&ohost=www.google.com&cid=CAESIeD2-hLO98-YFy5TC_5MC-rLmoFud9NJw4guftf5Gn0LoA&sig=AOD64_04yyOycji9jc0Sfusl3EeB5LEerQ&ctype=5&clui=11&q=&sqi=2&ved=0ahUKEwjamraG9tXMAhVLSyYKHRtpDFEQww8IQA&adurl=http://fasteddybearings.com/5x8x2-5-flanged-metal-shielded-bearing-mf85-zz/%3Futm_source%3Dgoogle%26utm_medium%3Dshopping%26utm_content%3D63%26utm_campaign%3DFastEddy%2520Bearings%26gdftrk%3DgdfV29274_a_7c2943_a_7c9328_a_7c63
	http://www.google.com%26cid%3Dcaesied2-hlo98-yfy5tc_5mc-rlmofud9njw4guftf5gn0loa%26sig%3Daod64_04yyoycji9jc0sfusl3eeb5leerq%26ctype%3D5%26clui%3D11%26q%3D%26sqi%3D2%26ved%3D0ahukewjamrag9txmahvlsyykhrtpdfeqvhciqg%26adurl%3Dhttp//fasteddybearings.com/5x8x2-5-flanged-metal-shielded-bearing-mf85-zz/?utm_source=google&utm_medium=shopping&utm_content=63&utm_campaign=FastEddy%20Bearings&gdftrk=gdfV29274_a_7c2943_a_7c9328_a_7c63
	
	*/
	//this.innerHTML='test';
				if(this.href.contains('https://store.google.com')) {
					var n = this.href.indexOf("https");
					//console.log(n);
					n = this.href.substring(n, this.href.length);
					//console.log(n);
					n = decodeURIComponent(n)
					this.href = n;

				} else if(this.href.contains('=http://')) {
					var n = this.href.lastIndexOf("http");
					//console.log(n);
					n = this.href.substring(n, this.href.length);
					//console.log(n);
					n = decodeURIComponent(n)
					this.href = n;
					
				} else {
					//console.log(this.href);
					var n = this.href.lastIndexOf("www");
					var n2 = this.href.substring(n, this.href.length);
					//console.log(n2);
					var n3 = decodeURIComponent(n2)
					var n3 = decodeURIComponent(n3)
					var n3 = decodeURIComponent(n3)
					console.log(n3);
					this.href = "http://" + n3;
					//console.log(n3);
					//console.log(" ");
				}
			}
		});
	
	
	
	
	
	
	
	
	
	
	
	//remove web/video search redirects
	$('a[onmousedown^="return rwt("]').removeAttr('onmousedown');

	//remove ads
	$('a[onmousedown^="return google.arwt("]').removeAttr('onmousedown');

	//change yellow ad alert text
	//$('._mB').html('Normalized by Zabel');
	$('._mB').html('-Ad');


	//remove custom search redirects
	$('.gsc-results a[href][data-cturl]').each(function() {
		blockListeners(this, 'mousedown');
	});
	//remove image search redirects
	$('a').filter('[class^="irc_"], [class*=" irc_"], [id^="irc_"]').each(function() {
		blockListeners(this, 'mousedown');
	});
	//remove news search redirects
	if(href.contains('tbm=nws') || hostname.startsWith('news.google.')) {
		$('a.article[href^="http"]').each(function() {
			blockListeners(this, 'click contextmenu mousedown mousemove');
		});
	} else if(href.contains('tbm=shop') || pathname.startsWith('/shopping/')) { //remove shopping search redirects
		$('a').filter('[href*="/aclk?"], [href*="/url?"]').each(function() {
			var m = this.href.match(/(?:\&adurl|\?q|\&url)\=(http.*?)(\&|$)/i);
			if(m && m[1]) {
				var link = decodeURIComponent(m[1]);
				link = link.replace('=http://clickserve.dartsearch.net/', '=');
				m = link.match(/\=(https?(\%3A\%2F\%2F|\:\/\/).*?)(\&|$)/i);
				if(m && m[1]) {
					link = decodeURIComponent(m[1]);
				}
				this.href = link;
			}
		});
	} else if(pathname.startsWith('/maps/') || '/maps' == pathname) { //remove map search redirects; does not remove redirects of advertisement
		$('a[href^="http"]').each(function() {
			blockListeners(this, 'click contextmenu');
			//legacy
			if(this.href.contains('url?')) {
				var m = this.href.match(/(?:\&|\?)q\=(http.*?)(\&|$)/i);
				if(m && m[1]) {
					this.href = decodeURIComponent(m[1]);
				}
			}
		});
	}
	//remove legacy search redirects and docs redirects
	//should be done last as shopping uses the same url pattern
	$('a[href*="/url?"]').each(function() {
		var m = this.href.match(/\/url\?(?:url|q)\=(http.*?)(\&|$)/i);
		console.log(m);
		if(m && m[1]) {
			this.href = decodeURIComponent(m[1]);
		}
	});
	//expose cached links
	$('div[role="menu"] ul li a[href^="http://webcache.googleusercontent."]').each(
		function() {
			this.style.display = 'inline';
			$(this).closest('div.action-menu.ab_ctl, div._nBb')
			.after(' <a href="https' + this.href.substring(4) + '">(https)</a> ')
			.after($(this));
		}
	);
}

//MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
if(window.MutationObserver || window.WebKitMutationObserver) {
	var observer = new MutationObserver(function(mutations) {
		modifyGoogle();
	});
	//tiny delay needed for firefox
	setTimeout(function() {
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
		modifyGoogle();
	}, 10);
}
//for chrome v18-, firefox v14-, internet explorer v11-, opera v15- and safari v6-
else {
	setInterval(function() {
		modifyGoogle();
	}, 10);
}
