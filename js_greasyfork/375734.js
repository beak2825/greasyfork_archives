// ==UserScript==
// @name        gw mod helper
// @namespace   gwmodhelper
// @description a gw mod helper script

// @license MIT 

// @include     http://reddit.com/*
// @include     http://www.reddit.com/*
// @include     https://reddit.com/*
// @include     https://www.reddit.com/*

// @include     http://reddit.com/r/gonewild/*
// @include     http://www.reddit.com/r/gonewild/*
// @include     https://reddit.com/r/gonewild/*
// @include     https://www.reddit.com/r/gonewild/*
// @include     https://pay.reddit.com/r/gonewild/*

// @include     http://reddit.com/r/treesgonewild/*
// @include     http://www.reddit.com/r/treesgonewild/*
// @include     https://reddit.com/r/treesgonewild/*
// @include     https://www.reddit.com/r/treesgonewild/*
// @include     https://pay.reddit.com/r/treesgonewild/*

// @include     http://reddit.com/r/gwcouples/*
// @include     http://www.reddit.com/r/gwcouples/*
// @include     https://reddit.com/r/gwcouples/*
// @include     https://www.reddit.com/r/gwcouples/*
// @include     https://pay.reddit.com/r/gwcouples/*

// @include     http://reddit.com/r/bondage/*
// @include     http://www.reddit.com/r/bondage/*
// @include     https://reddit.com/r/bondage/*
// @include     https://www.reddit.com/r/bondage/*
// @include     https://pay.reddit.com/r/bondage/*

// @include     http://reddit.com/*
// @include     http://old.reddit.com/*
// @include     http://www.reddit.com/*
// @include     http://mod.reddit.com/*
// @include     https://reddit.com/*
// @include     https://old.reddit.com/*
// @include     https://www.reddit.com/*
// @include     https://mod.reddit.com/*
// @include     https://pay.reddit.com/*

// @include     http://www.reddit.com/r/bendergw_DearDiary/*
// @include     https://www.reddit.com/r/bendergw_DearDiary/*

// @include     http://www.reddit.com/message/*
// @include     https://www.reddit.com/message/*
// @include     https://pay.reddit.com/message/*

// @version     0.0.50
// @downloadURL https://update.greasyfork.org/scripts/375734/gw%20mod%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/375734/gw%20mod%20helper.meta.js
// ==/UserScript==

function main() {

	//alert('hi! ...');

	var mod_name = '';
    try {
        mod_name = $('.user a')[0].text;
        //alert("mod_name [" + mod_name + "]");
    } catch(e) {
    }
	
	var s = window.location.href;
	
	// alert(s + "\n\n" + s.indexOf("/r/dirtyr4r/new/"));
	
	if (s.indexOf("/banned?") > -1 ) {

		var just_unban = s.indexOf("&unban=now") > -1;
		var unban_and_reapprove = s.indexOf("&unban=reapprove") > -1;
		if (just_unban || unban_and_reapprove) {

			// get name!!!
			var o = document.getElementsByClassName('user');
			var name = o[1].innerText;
			try {
				name = name.split('(')[0];
			} catch {}
			try {
				name = name.trim();
			} catch {}

			o = document.getElementsByClassName('unfriend-button');
			o2 = o[0].getElementsByClassName("togglebutton");
			o2[0].click();

			var a = $(".active .yes");
			a[0].click();
				
			if (unban_and_reapprove) {
				setTimeout(function(){
					var url = 'https://old.reddit.com/user/' + name + "?autoapprove=1";
					window.location.href = url;
				}, 2000);
			}
		} else {
			s = s.replace("&", "?");
			var f = s.split("?");
			var who = f[1].substring(5);
			var link = f[2].substring(5);
			document.getElementById("name").value = who;
			document.getElementById("note").value = link;
			document.getElementById("note").focus();
			var notfounds = document.getElementsByClassName("notfound");
			if (notfounds.length == 1) {
				window.setTimeout(function() {
					if (confirm("ban them?")) {
						document.getElementsByClassName("btn")[0].click();
					}
				}, 200);
			}
			//alert( "HANDLE BAN PAGE! - ban [" + who + "]\n\nlink [" + link + "]" );
			//document.getElementById("banned").submit();
		}
		return 0;
	}
	if (s.indexOf("mod.reddit.com/mail/") > -1 /*&& (mod_name != 'qtx')*/) {
		window.setTimeout(function() {
			handleModMailActionLinks();
		}, 2000);
	}
	/*
	if (s.indexOf("r/gonewild/about/reports") > -1) {
		window.setTimeout(function() {
			//alert("add 'not visibily nude' option!!!");
			
			
			// go through and add 'not visible nude' links to each post on the page
			
		}, 500);
	}*/

	if (s.indexOf("/message/messages/") > -1) {
		window.setTimeout(function() {
			// look for data-event-action="remove"
			var remove = $("[data-event-action$=\'remove\']");
			if (remove.length > 0) {
				var reply = $("[data-event-action$=\'reply\']");
				reply[0].click();
				window.setTimeout(function() {
					txt = $('[name="text"]')
					txt[1].value = "done";
					
					$(".usertext-edit").append( "<br />" +
						"<a href='javascript:oldModMailReply(\"done\");'>done</a> &nbsp;&nbsp; " +
						"<a href='javascript:oldModMailReply(\"deleted\");'>deleted</a> &nbsp;&nbsp; " +
						"<a href='javascript:oldModMailReply(\"numeric date\");'>numeric</a> &nbsp;&nbsp; " +
						"<a href='javascript:oldModMailReply(\"missing shout-out\");'>shout-out</a> &nbsp;&nbsp; " +
						"<a href='javascript:oldModMailReply(\"needs more nudity\");'>nudity</a> &nbsp;&nbsp; " +
						"<a href='javascript:oldModMailReply(\"wrong name\");'>wrong-name</a> &nbsp;&nbsp;<br /><br /> " +
						"<a href='javascript:oldModMailReply(\"modmailing about OF\");'>modmailing-about-OF</a> &nbsp;&nbsp; " +
						""
						);

				}, 100);
			}
			
			/*
			window.setTimeout(function() {
				//var s = document.body.innerHTML;
				var s = $('body').text();
				//var toFind = "Poster: /u/";
				var toFind = "Post: /u/";
				var i = s.indexOf(toFind);
				//alert("i: " + i);
				//i = s.indexOf("Poster: /u/", i+100);
				//alert("i: " + i);
				if (i == -1) return;
				s = s.substr(i+toFind.length);
				i = s.indexOf('\n');
				s = s.substr(0,i);
				//alert("s [" + s + "]");
				var div = document.createElement("div");
				//div.innerHTML = "<iframe src=\'//www.onlyfans.com/" + s +"\' />";
				div.innerHTML = "<iframe src=\'//old.reddit.com/" + s +"\' width='100%' height='100%' />";
				document.body.insertBefore(div, document.body.firstChild);
			}, 200);
			*/
			/*
			var div = document.createElement("div");
			div.innerHTML = "<iframe src=\'//www.vidble.com/modreddit.aspx?from=" + from + "&action=nuke&what=" +url+"\' />";
			document.body.insertBefore(div, document.body.firstChild);
			*/
			
		}, 100);
	}
	
	if (s.indexOf("/message/compose/?to=") > -1) {
		// add links to auto-fill in from/title/message for
		// - not for $ onlyfans
		// - for $ onlyfans
	}

	//alert("mod_name: [" + mod_name + "]" );0
	var extra_features = mod_name == "m0nk_3y_gw";
	
	if (extra_features) {
        /* */
		//console.log("extra_features: " + extra_features);
		// remove the banner images, for modding in public
		var header = $('#header');
		//console.log("header length: " + header.length);
		header = header[0];
		//alert('header: ' + header);
		if (header) {
			//console.log(header.style);
			//console.log('header.style.background: ' + header.style.background );
			header.style.background = 'none';
		}
		
		header = $("#header-bottom-left")[0];
		if (header) {
			//console.log(header.style);
			//console.log('header.style.background: ' + header.style.background );
			header.style.background = 'none';
		}
                
        if (s.indexOf("/r/dirtyr4r/new/") > -1) {
            setTimeout(function(){dirtyr4r_new_queue();}, 2000);
		}

		/*
        if (s.indexOf("/r/politics") > -1) {
			window.location.href = "https://test.chronicdisorder.net/posts";
		}*/
		
		/* * /
        if (s.indexOf("/r/politics/") > -1) {
			setTimeout(function() {
				hide_elements(document.getElementsByName("text"));
				hide_elements(document.getElementsByClassName('reply-button'));
				hide_elements(document.getElementsByClassName('save'));
			}, 100);
		}/* */
		/* */
	}
		
	if (s.indexOf("/about/flair?name=") > -1) {
		if (s.indexOf("&now=1") > -1) {
			var name = document.getElementById('flair_jump_name').value;
			var o = document.getElementsByName('text');
			o[0].value = 'Verified';
			o = document.getElementsByName('css_class');
			o[0].value = 'ver';
			o[0].focus();
			setTimeout(function(){
				var buttons = document.querySelectorAll('button');
				for (var i=0, l=buttons.length; i<l; i++) {
				  if (buttons[i].firstChild.nodeValue == 'save')
					buttons[i].click();
				}
				var url = 'https://old.reddit.com/user/' + name + "?autoapprove=1";
				//console.log('navigating to ' + url);
				window.location.href = url;
			}, 200);
		}
	}

	//if (s.indexOf("reddit.com/user/") > -1) {
	{
		if (s.lastIndexOf("autoapprove=1") > -1) {
			window.setTimeout(function() {
				reddit_click_approve();
			}, 200);
		} else if (s.lastIndexOf("autoremove=1") > -1) {
			window.setTimeout(function() {
				reddit_click_remove();
			}, 200);
		} else if (s.lastIndexOf("autolock=1") > -1) {
			window.setTimeout(function() {
				reddit_click_lock_and_remove();
			}, 200);
		}
	}

	
	var functions_src =
	'function nuke_thread(url,from) {' +
		'if (confirm("nuke thread [" + url + "] ?")) {'+
			'var div = document.createElement("div");'+
			'div.innerHTML = "<iframe src=\'//www.vidble.com/modreddit.aspx?from=" + from + "&action=nuke&what=" +url+"\' />";'+
			'document.body.insertBefore(div, document.body.firstChild);'+
		'}'+
	'}'+
	'function sandbox(who,from,link) {'+
		'if (confirm("sandbox [" + who + "] ?\\n\\n(If yes, then also remove any reported comments on their first comment page that have been reported but not yet removed (bender-issue))")) {'+
			'var div = document.createElement("div");'+
			'div.innerHTML = "<iframe src=\'//www.vidble.com/modreddit.aspx?from=" + from + "&action=sandbox&what=" + who + "&reddit=" + link + "\' />";'+
			'document.body.insertBefore(div, document.body.firstChild);'+
		'}'+
	'}' +
	'function ban(who,from,link) {'+
		'if (confirm("ban [" + who + "] ?")) {'+
			'var div = document.createElement("div");'+
			'div.innerHTML = "<iframe src=\'//www.vidble.com/modreddit.aspx?from=" + from + "&action=ban&what=" +who + "&reddit=" + link + "\' />";'+
			'document.body.insertBefore(div, document.body.firstChild);'+
		'}'+
	'}' +
	'function ban_now(who,from,link) {'+
        'var s = ("" + window.location).split("/");' +
        'var u="";for(var i=6;i<s.length;i++){u+="../"};' +
        'window.location=u+"about/banned?user=" + who + "&link=" + window.location + "";' +
	'}' +
	'function auto_ban_for_pic(who,from,link) {'+
		'if (confirm("auto ban for this pic [" + link + "] in the future ?")) {'+
			'var div = document.createElement("div");'+
			'div.innerHTML = "<iframe src=\'//www.vidble.com/modreddit.aspx?from=" + from + "&action=autoban4pic&what=" + who + "&reddit=" + link + "\' />";'+
			'document.body.insertBefore(div, document.body.firstChild);'+
		'}'+
	'}' +
	'function clickByText(a, txt, i=0) {' + 
		'console.log("clickByText (" + txt + "): and a.length is " + a.length);' +
		'try{for(;i<a.length;i++) {' + 
		'if (a[i].innerHTML.indexOf(txt)> -1) {' + 
			'console.log(" -- found " + txt + " at " + i + "... clicking!");' +
			'a[i].click();' + 
			'break;}' + 
		'}}catch(e){ console.log("GOT EXCEPTION in clickByText!!!");}}'+
	'function click_flair_link(who,from,link,txt,i=0) {'+
		'document.getElementsByClassName("flairselectbtn")[i+1].click();' + 
		'window.setTimeout(function() {' + 
			'clickByText(document.getElementsByClassName("flairremove"), "remove flair");' + 
			'window.setTimeout(function() {' + 
				'clickByText(document.getElementsByClassName("linkflair-spam"), txt);' + 
				'window.setTimeout(function() {' + 
					'clickByText(document.getElementsByTagName("button"), "save", i);' + 
					'window.setTimeout(function() {' + 
						'clickByText(document.getElementsByTagName("a"), "remove", i);},500);},' + 
			'1500);},500);},500);' + 
	'}' +
	'function not_nude(who,from,link,i=0) {'+
		'click_flair_link(who,from,link,"Not visibly nude",i);' + 
		'window.setTimeout(function() {' + 
			'$(\'textarea\')[0].value = "This was spam filtered for user reports. Please include visible topless and/or bottomless nudity in gonewild posts.";' +
			'$(\'textarea\')[0].focus();},3000);' +
	'}' +
	'function missing_m_tag(who,from,link,i=0) {'+
		'click_flair_link(who,from,link,"Mistagged",i);' + 
		'$(\'textarea\')[0].value = "Mod feedback - this was spam filtered for user reports.  Rule 5.  You are encouraged to delete and resubmit with an [m] in the title so that it will be visible on /r/gonewild again.";' +
		'$(\'textarea\')[0].focus();' +
	'}' +
	'function soliciting_pms_or_chat(who,from,link) {' +
		//'alert(this.tagName);' +
		'click_flair_link(who,from,link,"Soliciting PMs");' + 
	'}' +
	'function mentioning_followers(who,from,link) {' +
		'click_flair_link(who,from,link,"Mentioning followers");' + 
	'}' +
	'function rnd(a) {'+
		'var i = Math.floor(Math.random()*a.length);' +
		//'console.log("  i: " + i + " and a.length: " + a.length);'+
		'return a[i];' +
	'}' +
	'function numeric_date() {' +
		'var today  = new Date();' +
		'var options = { year: \'numeric\', month: \'long\', day: \'numeric\' };' +
		'var m = \'Hi - please re-do with the month spelled-out -- "\' + today.toLocaleDateString("en-US", options).replace(",","") + \'\"\';' +
		'try {' + 
			'$(\'textarea\')[0].value = m;' +
			'$(\'textarea\')[2].value = m;' + 
		'} catch(e) {' + 
		'}' +
	'}' +
	'function verify(who,from,link) {'+
		'var be_more_enthused = confirm(\'use enthusiam in message?\');' +
		'var m1 = [\'Verified\', \'Great - verified\', \'Excellent - verified\', \'and... Verified\' ];' +
		'm1 = be_more_enthused ? (rnd(m1) + \'!\') : (m1[0] + \' -\');' +
		'var m2 = \'Please don\\\'t delete this post or your verification pics or you will lose the verified flair and have to re-do it. \'; ' +
		'var m3 = [\'Thank you!\', \' \', \'Thanks!\', \' \', \'Thx!\'];' +
		'm3 = rnd(m3); ' +
		'm1 += (Math.random(1) < 0.5) ? \'\\n\\n\' : \'  \';' +
		'm2 += (Math.random(1) < 0.5) ? \'\\n\\n\' : \'  \';' +
		'var m = m1 + m2 + m3;' +		
		'try {' + 
			'$(\'textarea\')[0].value = m;' +
			'$(\'textarea\')[2].value = m;' + 
		'} catch(e) {' + 
		'}' +
		'if (confirm("verify [" + who + "] ?")) {'+
			'var div = document.createElement("div");'+
			'div.innerHTML = "<iframe src=\'//www.vidble.com/modreddit.aspx?from=" + from + "&action=verify&what=" +who + "&reddit=" + link + "\' />";'+
			'document.body.insertBefore(div, document.body.firstChild);'+
			'setTimeout(function(){document.getElementsByClassName("arrow up login-required access-required")[0].click();},100);' +
			'setTimeout(function(){clickByText(document.getElementsByTagName("button"), "save");},1000);' +
			'setTimeout(function(){clickByText(document.getElementsByTagName("a"), "distinguish");},2000);' +
			'setTimeout(function(){clickByText(document.getElementsByTagName("a"), "sticky");},2500);' +
			'setTimeout(function(){clickByText(document.getElementsByTagName("a"), "VERIFY-NOW!");},3500);' +
		'}'+
	'}' +
	'function ask2verify(who,from,link) {'+
        //'alert(\'hi!\');' +
        //'console.log(\'ask2verify - welcome!\');' +
        'var poster = \'\';' +
        'try{var a = $(\'.tagline .author\');poster = \'/u/\' + a[1].innerText;} catch(e){}' +
        'var userreports = confirm(\'was this removed for user reports (not GIS hits)?\');' +
        'var someoneelse = confirm(\'were they posting someone else/a friend/gf?\');' +
        'if (confirm("flair them as askedtoverify [" + who + "] ?")) {'+
            'var div = document.createElement("div");'+
            'div.innerHTML = "<iframe src=\'//www.vidble.com/modreddit.aspx?from=" + from + "&action=asked2verify&what=" +who + "&reddit=" + link + "\' />";'+
            'document.body.insertBefore(div, document.body.firstChild);'+
        '}'+

        'var verified = document.getElementsByClassName("flair-ver").length > 0;' +

        'var reason = userreports ? \'generating user reports\' : \'posted before\';' +
        'var whoposts = someoneelse ? \'have her \' : \'\';' +
		'var whoconfirms = someoneelse ? \'they know and are cool with being posted here\' : \'this is you\';' +
		'var isGWcouples = window.location.href.indexOf("/GWCouples/") > -1;' +
		'var directions_url = isGWcouples ? "https://www.reddit.com/r/GWCouples/comments/9s7cgv/how_to_get_verified_on_rgwcouples/" : "https://www.reddit.com/r/gonewild/comments/5fr58x/rgonewild_faq_in_post_format_since_many_mobile/damceym/";' +
		'var msg2 = verified ? "you deleted your verification.  Please do a *new* verification" : "you do not have the ~verified~ flair.  Please " + whoposts + "do a verification";' +
		'if (isGWcouples) msg2 = "you do not have the ~verified~ flair.  Please do a COUPLES verification";' + 
		'var important_note = isGWcouples ? "/r/GWCouples is only for pictures of couples" : "/r/gonewild is for visible nudity";' +
        'var msg =\'Hi \' + poster + \' - mod here - this was auto spam filtered because it was \' + reason + \' and \' + msg2 + \' post to help confirm \' + whoconfirms + \'.\\n\\nDirections: \' + directions_url + \' \\n\\nNudetorial (w/ pictures!): https://imgur.com/a/mcGVb8N \\n\\n (If you have questions please use the message-the-moderators link in the sidebar, we do not always see comment responses in these cases) \\n\\n **important - \' + important_note + \'** \';' +
        //'console.log(\'ask2verify - sub-0\');' +
        '$(\'textarea\')[0].value = msg;' +
        '$(\'textarea\')[0].style.width = \'800px\';' +
        '$(\'textarea\')[0].style.height = \'300px\';' +
        '$(\'textarea\')[0].focus();' +
        //'console.log(\'ask2verify - sub-2\');' +
        //'$(\'textarea\')[2].value = msg;' +
        //'$(\'textarea\')[2].style.height = \'400px\';' +
        //'console.log(\'ask2verify - all done!\');' +            
	'}' + 
	'function reddit_click_yes() {' +
		'var a = $(".active .yes");' + 
		'var b = 3000;' + 
		'if (a.length>0){b = 1000; a[0].click();}' +
		// kill the fucking chat window pop-up
		'var o = document.getElementById("chat-app"); if (o) o.remove();' +
		'setTimeout("reddit_click_yes();", b);' +
	'}' +
	'function reddit_click_reports() {' +
		'var a = $(".reported-stamp");' + 
		'for(let i = 0; i < a.length; i++) {a[i].click();}' +
		//'if (window.location.href.indexOf("/about/reports") > -1){' +
		//	'a = $(".expando-button");' + 
		//	'for(let i = 0; i < a.length; i++) {a[i].click();}}' +
	'}' +
	'function reddit_remove_links() {' + 
		'document.getElementById("custom-links").innerHTML = "";' +
	'};' +
	
	'var modResponseUnbanned = "Great! - your auto-ban has been cleared.";' +
	'var modResponseUnbannedNowVerify = "Great! - your auto-ban has been cleared.\\n\\n' +
		'Please post this album in /r/gonewild as a \'link\' post, with \'verification\' (and correct gender tags) in the title.  ' +
		'Our modbot will see it and set up some testing links for mods.  A mod should reply on your post within a few hours ' +
		'(**important - wait to get your \'verified\' flair from a mod before doing additional posts - message us here if you don\'t ' +
		'get a mod comment within a few hours**)\\n\\n' +
		'If you are having trouble creating a \'link\' post, you can use this URL https://old.reddit.com/r/gonewild/submit";' +
	'var modResponsePostVerification = "Great! \\n\\n' +
		'Please post this album in /r/gonewild as a \'link\' post, with \'verification\' (and correct gender tags) in the title.  ' +
		'Our modbot will see it and set up some testing links for mods.  A mod should reply on your post within a few hours ' +
		'(**important - wait to get your \'verified\' flair from a mod before doing additional posts - message us here if you don\'t ' +
		'get a mod comment within a few hours**)\\n\\n' +
		'If you are having trouble creating a \'link\' post, you can use this URL https://old.reddit.com/r/gonewild/submit";' +
	'var modResponseDoublechecking = "Double-checking: You won\'t use this reddit account for\\n\\n' +
		'- off-reddit linking (posts/comments/bio with snap/kik/skype/etc name), or\\n\\n' +
		'- anything for-$/gain\\n\\n' +
		'on reddit in the future? (note: if you do, people will screenshot posts, comments, PMs, your bio, and forward to us)?";' +
	'function modMailReply(s, send=0) {' +
		'var o = document.getElementsByClassName("ThreadViewerReplyForm__replyText")[0];' +
		'o.value += "\\n\\n" + s;o.focus();o.select();' +
		'if (send) {' +
			'window.setTimeout(function(){' +
				'document.getElementsByClassName("ThreadViewerReplyForm__replyButton")[0].click();' +
			'}, 200);' +
			//'}, 1500);' +
		'}' +
	'};' +
	'function oldModMailReply(s, send=0) {' +
		'$(\'[name="text"]\')[1].value = s;' +
		'window.setTimeout(function(){' +
			'document.getElementsByClassName("save")[1].click();' +
			'reddit_click_remove();' +
		'}, 500);' +
	'};' +

	'function handleModMailActionLinks() {' +
		'var modmailFrom = document.getElementsByClassName("InfoBar__username");' +
		'if (modmailFrom.length > 0) {' +
			'window.setTimeout(function(){' +
				'modmailFrom = "" + modmailFrom[0];' +
				'var f = modmailFrom.split("/");' +
				'if (f.length > 1) {' +
					'modmailFrom = f[f.length-1];' +
				'}' +
				'var modControlLinks = document.getElementsByClassName("InfoBar");' +
				'if (modControlLinks.length > 0 && !document.getElementById("mod_action_links")) {' +
					'var o = document.getElementsByClassName("ThreadTitle__community")[0];' +
					'modControlLinks[0].innerHTML += "<br /><div id=\'mod_action_links\' style=\'background-color:#222;color:white;border-radius:4px;padding:1%;\'>" + ' + 
						'"<div class=\'InfoBar__controlText\'><a href=\'" + o + "/about/banned?user=" + modmailFrom + "\' target=\'_blank\' style=\'color:white;\'>Ban Page for " + modmailFrom + "</a></div><br /><br />" +' + 
						'"<div class=\'InfoBar__controlText\'><a href=\'javascript:modMailReply(modResponseUnbanned);\' style=\'color:white;\'>text: unbanned</a></div><br /><br />" + ' +
						'"<div class=\'InfoBar__controlText\'><a href=\'javascript:modMailReply(modResponsePostVerification,1);\' style=\'color:white;\'>text: go post verification</a></div><br /><br />" + ' +
						'"<div class=\'InfoBar__controlText\'><a href=\'javascript:modMailReply(modResponseDoublechecking,1);\' style=\'color:white;\'>text: double-checking</a></div><br /><br />" + ' +
						'"<div class=\'InfoBar__controlText\'><a href=\'" + o + "/about/banned?user=" + modmailFrom + "&unban=now\' target=\'_blank\' style=\'color:white;\'>Unban now " + modmailFrom + "</a></div><br /><br />" +' + 
						'"<div class=\'InfoBar__controlText\'><a href=\'" + o + "/about/banned?user=" + modmailFrom + "&unban=reapprove\' target=\'_blank\' style=\'color:white;\' onclick=\'javascript:modMailReply(modResponseUnbanned,1);\'>Unban + Reapprove " + modmailFrom + "</a></div><br /><br />" +' + 
						'"<div class=\'InfoBar__controlText\'><a href=\'" + o + "/about/banned?user=" + modmailFrom + "&unban=reapprove\' target=\'_blank\' style=\'color:white;\' onclick=\'javascript:modMailReply(modResponseUnbannedNowVerify,1);\'>Unban + post verification " + modmailFrom + "</a></div><br /><br />" +' + 
						'"<div class=\'InfoBar__controlText\'><a href=\'https://www.onlyfans.com/" + modmailFrom + "\' target=\'_blank\' style=\'color:white;\'>Onlyfans check " + modmailFrom + "</a></div><br /><br />" + ' +
						'"<div class=\'InfoBar__controlText\'><a href=\'" + o + "/about/flair?name=" + modmailFrom + "\' target=\'_blank\' style=\'color:white;\'>Flair for " + modmailFrom + "</a></div><br /><br />" + ' +
						'"<div class=\'InfoBar__controlText\'><a href=\'" + o + "/about/contributors?user=" + modmailFrom + "\' target=\'_blank\' style=\'color:white;\'>Contributor now: " + modmailFrom + "</a></div>" + ' +
					'"</div>";' +
				'}' + 
			'}, 1000);' +
		'}' +
		'window.setTimeout(function(){handleModMailActionLinks();},2000);' +
	'};' +	

	'function reddit_click_lock() {' + 
		//'console.log("reddit_click_remove: hi");' + 
		'var a = $("[data-event-action$=\'lock\']");' + 
		'var b = 0;' + 
		//'console.log("   a.length: " + a.length );' + 
		'for(let i = 0; i < a.length; i++) {a[i].click();}' + 
	'};' +
	'function reddit_click_unlock() {' +
		//'console.log("reddit_click_lock: hi");' +
		'var a = $("[data-event-action$=\'lock\']");' +
		'var b = 0;' +
		//'console.log("   a.length: " + a.length );' +
		'for(let i = 0; i < a.length; i++) {' +
			'if (a[i].text.indexOf("unlock") != -1) a[i].click();' +
			'}' +
	'}' +
	'function refresh_with_param(p) {' +
		'var s = window.location.href;' +
		'window.location = s + (s.indexOf("?") === -1 ? "?" : "&") + p;' +
	'}' +
	'function reddit_start_click_approve() {' +
		'reddit_click_approve();' +
		'if ($(".next-button a").length) setTimeout(function() {refresh_with_param("autoapprove=1");},4000); ' +
	'}' +
	'function reddit_start_click_remove() {' +
		'reddit_click_remove(1);' +
		'if ($(".save").length) setTimeout(function() {$(".save")[1].click();},100); ' +
		'if ($(".next-button a").length) setTimeout(function() {refresh_with_param("autoremove=1");},4000); ' +
	'}' +
	'function reddit_start_click_lock_and_remove() {' +
		'reddit_click_lock_and_remove(2);' +
		'if ($(".next-button a").length) setTimeout(function() {refresh_with_param("autolock=1");},4000); ' +
	'}' +
	'function reddit_click_approve() {' +
		'reddit_click_unlock();' +
		//'console.log("reddit_click_approve: hi");' +
		'var a = $(".positive");var b = 0;' +
		//'console.log("   a.length: " + a.length );' +
		//'for(let i = 0; i < a.length; i++) {setTimeout(function() {a[i].click();}, b);b += 1300;}' +
		'for(let i = 0; i < a.length; i++) {setTimeout(function() {a[i].click();}, b);b += 2000;}' +
		'if (a.length > 0) {setTimeout(function() {$(".next-button a")[0].click();},b);}' + 
	'}' +
	'function reddit_click_remove() {' +
		//'console.log("reddit_click_remove: hi");' +
		'var a = $("[data-event-action$=\'remove\']");' +
		'var b = 0;' + 
		//'console.log("   a.length: " + a.length );' +
		'for(let i = 0; i < a.length; i++) {a[i].click();}' +
		'if (a.length > 0) {setTimeout(function() {$(".next-button a")[0].click();},a.length*1500+2000);}' + 
		'}' +
	'function reddit_click_lock() {' +
		//'console.log("reddit_click_lock: hi");' +
		'var a = $("[data-event-action$=\'lock\']");var b = 0;' +
		//'console.log("   a.length: " + a.length );' +
		'for(let i = 0; i < a.length; i++) {' +
			'if (a[i].text.indexOf("unlock") === -1) a[i].click();' +
		'}' +
		//'if (a.length > 0) {setTimeout(function() {$(".next-button a")[0].click();},a.length*1500);}' + 
	'}' +
	'function reddit_click_lock_and_remove(x=1) {' +
		'reddit_click_lock(); console.log("reddit_click_remove: hi");' +
		'var a = $("[data-event-action$=\'remove\']");var b = 0;' +
		//'console.log("   a.length: " + a.length );' +
		'for(let i = 0; i < a.length; i++) {a[i].click();}' +
		'if (a.length > 0) {setTimeout(function() {$(".next-button a")[0].click();},a.length*1500*x+2000);}' + 
	'}' + 
	'function hide_elements(a) {' +
		//'console.log("hide_elements! " + a.length);' +
		'for(var i=0;i<a.length;i++) {' +
			'a[i].style.visibility="hidden";' +
			'a[i].style.height=0;' +
		'}' +
	'}';
	var script = document.createElement("script");
	script.textContent = functions_src;
	//alert('script is appended to body!');
	document.body.appendChild(script);

	var raw_comment_links = $('.comment ul');
	var comment_links = [];
	for(var k = 0; k < raw_comment_links.length; k++) {
		// if it has a 'reply' link then it is a valid/undeleted comment
		if (raw_comment_links[k].innerHTML.indexOf('return reply') != -1 ) {
			comment_links.push(raw_comment_links[k]);
		}
	}

	function poster_name() {
        try {
            a = $(".tagline .author");
            return "/u/" + a[1].innerText;
        } catch(e) {
        }
        return "";
    }
	
	var titles = $('.title a');
	var title = titles.length == 0 ? "" : titles[0].innerHTML.toLowerCase();
	title = title.replace(/[^a-zA-Z 0-9]+/g,'');
	title = title.replace(/\s/g,'');
	var verification_post = (title.indexOf("verif") != -1) || (title.indexOf("verf") != -1) || (title.indexOf("rification") != -1);

	function append_links(where, link, who, us, verify, i) {
		try {
			var s = "<br /><br />";
			if (who == "[deleted]") {
				s += " &nbsp; <b><a href='https://www.vidble.com/modreddit.aspx?action=whoposted&what=" + window.location + "' >find original poster</a></b>"; 
			} else {
				s += "<li>" + who + ":</li>" +
						"<li><a href='javascript:nuke_thread(\"" + link + "\", \"" + us + "\");'>NUKE</a></li>" +
						"<li><a href='javascript:sandbox(\"" + who + "\", \"" + us + "\", \"" + link + "\");'>SANDBOX</a></li>" +
						"<li><a href='javascript:ban(\"" + who + "\", \"" + us + "\", \"" + link  + "\");'>BAN</a></li>";
				if (verify) {
					if (1 /*extra_features*/) {
						s += "<li><a href='javascript:verify(\"" + who + "\", \"" + us + "\", \"" + link  + "\");'>BENDER-VERIFY</a></li>" + 
							"<li><a href='../../../about/flair?name=" + who + "' >VERIFY-MANUALLY</a></li>" + 
							"<li><a href='../../../about/flair?name=" + who + "&now=1' >VERIFY-NOW!</a></li>" +
							"<li><a href='javascript:numeric_date();' >NUMERIC-DATE</a></li>";
					} else {
						s += "<li><a href='../../../about/flair?name=" + who + "' >VERIFY</a></li>";
					}
				}
				s += "<li><a href='javascript:ask2verify(\"" + who + "\", \"" + us + "\", \"" + link  + "\");'>ask2verify</a></li>";
				s += "<li><a href='javascript:ban_now(\"" + who + "\", \"" + us + "\", \"" + link  + "\");'>BAN NOW!</a></li>";
				//s += " &nbsp; <li><a href='javascript:auto_ban_for_pic(\"" + who + "\", \"" + us + "\", \"" + link  + "\");'>[auto-ban-4-pic]</a></li>";
				s += " &nbsp; <li><a href='javascript:not_nude(\"" + who + "\", \"" + us + "\", \"" + link  + "\"," + i + ");'>[not nude]</a></li>";
				s += " &nbsp; <li><a href='javascript:soliciting_pms_or_chat(\"" + who + "\", \"" + us + "\", \"" + link  + "\");'>[PMs/chat]</a></li>";
				s += " &nbsp; <li><a href='javascript:mentioning_followers(\"" + who + "\", \"" + us + "\", \"" + link  + "\");'>[mentioning followers]</a></li>";
				s += " &nbsp; <li><a href='javascript:missing_m_tag(\"" + who + "\", \"" + us + "\", \"" + link  + "\");'>[m-tag]</a></li>";
			}
			where.innerHTML += s + "<br /><br />";
		} catch( Error ) {
			console.log("just caught exception in append_links()");
		}
	}
	function append_message_links(where) {
		try {
			//alert(where.innerHTML);
			//var s = " &nbsp; <a href='javascript:eroshare();' style='font-size:150%;'>eroshare-message</a> ";
			//where.innerHTML += s;
		} catch( Error ) {
			console.log("just caught exception in append_message_links()");
		}
	}
    
	setTimeout(function(){reddit_click_reports();}, 100);
	setTimeout(function(){reddit_click_yes();}, 100);
	
	//alert(window.location.href);

	var poster_links = $('.sitetable .entry ul');
	var post_links = $('.sitetable .author');
	var perma_links = $('.comment .first a');
	var post_perma_links = $('.entry .first a');
	var mod_mails = $('.message-parent');

	var url = window.location.href;
	
	if (url.indexOf("/message/") == -1 && /* url.indexOf('/about/reports') == -1 &&*/ url.indexOf('/about/spam') == -1 && url.indexOf('/about/flair') == -1) {
		var poster = $('.sitetable .tagline .author')[0].innerHTML;
		var us = $('.user a')[0].innerHTML;

		/*
		alert("poster_links.length: " + poster_links.length + 
			"\n post_perma_links.length: " + post_perma_links.length + 
			"\n post_links.length: " + post_links.length);*/
		//alert("poster_links.length: soon");

		for(i = 0; i < post_perma_links.length; i++) {
			append_links(poster_links[i*2], post_perma_links[i].href, post_links[i].innerHTML, us, verification_post, i);
		}

		//append_links(poster_links[0], window.location.href, poster, us, verification_post);

		/*
		if (poster_links.length == 1) {
			append_links(poster_links[0], window.location.href, poster, us, verification_post);
		} else {
			for(i = 0; i < poster_links.length; i++) {
				//append_links(poster_links[i], poster_links[i].href, post_links[i+1].innerHTML, us, false);
			}
		}*/
		for(i = 0, j = 0; i < comment_links.length; i++, j += 1 /*2*/) {
			append_links(comment_links[i], perma_links[i].href, post_links[j+1].innerHTML, us, false);
		}
        
        if (verification_post && extra_features) {
            //var o2 = $(".content");
			var o2 = $(".commentarea");
            //o2.css("height", "500px");
            //o2.append("<iframe src='https://www.reddit.com/r/gonewild/about/flair?name=" + poster + "' width='100%' height='500px'></iframe>");
            o2.css("height", "10500px");
            o2.append("<iframe src='https://vidble.com/VerificationPictureTest.aspx?post=" + window.location + "' width='100%' height='10000px'></iframe>");
        }
        
	} else {
		if ((url.indexOf("/compose") != -1) && (url.indexOf("?to=%2Fr%2Freddit.com") == -1)) {
			// we are composing a PM
			//alert(window.location.href + " COMPOSING A PM");
			append_message_links($("#compose-message")[0]);
		}
	}

}

$(document).ready(function () {
    ///alert(' in .ready()! ');
    var script = document.createElement("script");
    script.textContent = "(" + main.toString() + ")();";
    document.body.appendChild( script );
	//$(".entry").css('background-color', 'white');

	var mod_name = '';
    try {
        mod_name = $('.user a')[0].text;
        //alert("mod_name [" + mod_name + "]");
    } catch(e) {
    }

	if (1 /*mod_name != 'qtx'*/) {
		var loc = window.location.href;
		if (loc.indexOf('.com/mail/') == -1) {
			var div = document.createElement("div");
			var style = 'style="font-size:100%;border:10px;padding:5px;border-radius:3px;color:white;background-color:black;opacity:20%;"' + 
				'onMouseOver="this.style.opacity=\'100%\'" ' +
				'onMouseOut="this.style.opacity=\'20%\'" ';
			div.innerHTML = '<div id="custom-links" style="border:1px solid rgba(0,0,0,0.05);margin-bottom:5px;padding:0.5%;position:fixed;bottom:0;right:0;background-color:rgba(0,0,0,0.1);border-radius:4px;">' + 
				'<a href="javascript:reddit_remove_links();" ' + style + '>x</a>  ' +
				'<a href="javascript:reddit_start_click_remove();" ' + style + '>remove</a>  ' +
				'<a href="javascript:reddit_start_click_lock_and_remove();" ' + style + '>lock+remove</a>  ' +
				'<a href="javascript:reddit_start_click_approve();" ' + style + '>approve</a>  ' +
				'</div>';
			document.body.appendChild( div );
		}
	}
});

