// ==UserScript==
// @name        Title tags
// @namespace   userscript
// @description Add author to page title
// @grant       none
// @license     MIT
// @author      copypastetada
// @version     1.0
// @include     *
// @exclude     javascript:*
// @exclude     *amazon*.com/*
// @exclude     *aliexpress.com/*
// @exclude     *bing.com/*
// @exclude     *adguard.com/*
// @exclude     *archive.org/*
// @exclude     *bitchute.com/*
// @exclude     *box.com*
// @exclude     *consultingbyrpm.com/*
// @exclude     *dailymotion.com/*
// @exclude     *deviantart.com/*
// @exclude     *disqus.com/*
// @exclude     *dropbox.com/*
// @exclude     *dropboxcaptcha.com/*
// @exclude     *ebay.com/*
// @exclude     *ebay*.com/*
// @exclude     *economicpolicyjournal.com/*
// @exclude     *facebook.com/*
// @exclude     *feedly.com/*
// @exclude     *feedspot.com/*
// @exclude     *getpocket.com/*
// @exclude     *github.com/*
// @exclude     *google.com/*
// @exclude     *googleapis.com/*
// @exclude     *rumble.com/*
// @exclude     *oath.com/*
// @exclude     *hckrnews.com/*
// @exclude     *imgur.com/*
// @exclude     *inoreader.com/*
// @exclude     *instagram.com/*
// @exclude     *jsfiddle.net/*
// @exclude     *jshell.net/*
// @exclude     *linhdinhphotos.blogspot.com/*
// @exclude     *live.com/*
// @exclude     *locals.com/*
// @exclude     *neowin.net/*
// @exclude		*newegg.com/*
// @exclude		*mega.io/*
// @exclude		*mega.nz/*
// @exclude		*multcloud.com/*
// @exclude     *odysee.com/*
// @exclude     *paypal.com/*
// @exclude		*raindrop.io/*
// @exclude     *reddit.com/*
// @exclude     *ronpaulforums.com/*
// @exclude     *saidit.net/*
// @exclude     *seedr.cc/*
// @exclude     *search.brave.com/*
// @exclude     *siftd.net/*
// @exclude     *slickdeals.net/*
// @exclude     *stackoverflow.com/*
// @exclude     *startpage.com/*
// @exclude     *targetliberty.com/*
// @exclude     *techeblog.com/*
// @exclude     *thelounge.chat/*
// @exclude     *twitter.com/*
// @exclude     *wheelsage.org*
// @exclude     *wikipedia.org/*
// @exclude     *winaero.com/*
// @exclude     *stipe.com/*
// @exclude     *stipe.network/*
// @exclude     *ycombinator.com/*
// @exclude     *youtube.com/*
// @exclude     *login.yahoo.*/*
// @exclude     *mail.yahoo.com/*
// @exclude     *vimeo.com/*
// @exclude     *wibbitz.com/*
// @exclude     *w3schools.com.com/*
// @exclude     *zerohedge.com/*
// @exclude     *about*blank*

// @downloadURL https://update.greasyfork.org/scripts/464262/Title%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/464262/Title%20tags.meta.js
// ==/UserScript==
// changelog   [ref010] setTimeout innerText [ref009] mises.org/wire aurthor countStop [ref008] author name in document title first [ref007] 12:42 AM 5/9/2019 [ref006] 2:05 AM 4/27/2019 [ref005] 2019/4/25 5:48 PM | [ref004] 4/23/2019 6:54 PM [ref003] 4/19/2019 11:28 PM [ref002] 2019/4/4 7:17 PM [ref001] created 4/2/2019 4:58 PM


var articleAuthor;

//ref006 added querySelector shortcut | 2:04 AM 4/27/2019
function $(e,n){ /*3:03 AM 4/27/2019 added n object passthrough*/
	if(n) {
		doc_query = n.querySelectorAll(e);
	} else {
		doc_query = document.querySelectorAll(e);
	}
	if (doc_query && doc_query.length != 0) {
	   return doc_query;
	} else {
	   return null;
	}
}

//ref004 functionize author lookup to avoid redundancy, improved regex
function lookupAuthorNodes(){
	var articleNode;
	//ref006 moved query author nodes to this lookupAuthorNodes() to consolidate 2:10 AM
	/*4/27/2019 3:02 AM add author in article check bc some site have dumb incorrect author nodes eg. https://wellnessmama.com/podcast/jeff-knight/ */
	if(articleNode = document.querySelector('article')) {
		console.log("<article> present");
		//site exception fixes 2022/2/1
		if(window.location.host.indexOf("libertarianinstitute")!=-1) { /*libinst 4:26 PM 2/1/2022*/
			articleNode = $('.et_pb_post_title')[0];
			if(!articleNode) alert('author query error')
		}
		/*byline-author slashfilm 8:51 PM 2/14/2022*/
		authorNode = $(".author",articleNode) || $('a[rel*="uthor"]',articleNode) || $(".authors",articleNode) || $(".byline-author",articleNode);
	} else {
		console.log("no <article>");
		/*2:XX AM 2019/4/27 added a[rel]
		 7:20 PM 5/6/2019 .attribution @lewrockwell
		 9:23 PM 2/23/2020 div[class*='uthor'] ncregister.com/hitchcock
		 3:09 PM 1/31/2022 propertyandfreedom.org $(".post_author") before .attribution
		 */
		authorNode = $(".author") ||  $('a[rel*="uthor"]') || $(".authors") || $(".post_author") || $(".attribution") || $("div[class*='uthor']");
		console.log('author class check__',authorNode);
	}
	//ref007 check for multiple author nodes, thus changed $ query from single to querySelectorAll ~ https://www.npr.org/2019/05/08/720728055/
	//[ref010] 3:34 PM 4/14/2020 added setTimeout to wait for el.innerText to load.
	//innerText take longer to load than textContent. But textContent has more garbage texts
	setTimeout(function(){
		countStop = 0;
		authorNode.forEach(function(el){
			/*2020-01-28 8:53pm [ref009 Temporary fix] added countStop to stop checking author nodes after two stop since it be enough.
				note1: this is fix for mises.org/wire where there are 3 .author nodes and the last one is not the real author.
				note2: this is kind of unnecessary, need redo, but not now..*/
			if (countStop <= 1) {
				var authorString = el.innerText.replace(/\s\s+/g,"");
				if (authorString && authorString.length >= 2) { /*added authorNode.textContent length check (https://www.npr.org/2019/05/01/718945707)*/
					//ref002 replace 'by:' https://hackaday.com/2019/04/17/the-drones-and-robots-that-helped-save-notre-dame/ | 4/17/2019 7:29 PM
					//replace with nothing and aded `by` to front, bc if text doesn't include by then it would have no `by` | 8:32 PM
					//articleAuthor0 = authorNode.textContent.replace(/\n/g,"").replace(/\s\s+$/g," "); /*combine line and remove multiple spaces | 10:22 PM 5/2/2019*/
					articleAuthor0 = authorString.replace(/(.+|)(\s+|)[Bb]y(\:|)(\s+|)/,"");
					//articleAuthor0 = articleAuthor0.replace(/\s\s+/g," "); /*remove any extra spaces left, 2nd method | 10:49 PM 5/2/2019*/
					if(articleAuthor0.indexOf("admin") == -1) { /*exclude author words | 11:01 PM 5/2/2019*/
						if(document.title.indexOf(articleAuthor0) == -1) { /*check if author name is already in document title | [ref00] 2:48 AM 6/12/2019*/
							articleAuthor = " ~by "+articleAuthor0;
						} else { console.log("author name already in title"); }
					}
				} else {
					console.log("no matched author, debug:",authorString);
				   }
			} countStop++;
		})
	},500)
}

//ref002 added meta content type check
//1:35 AM 5/10/2019 change selector $ to document.querySelector bc $ is set up for querySelectorAll for now.
var meta_type = document.querySelector('meta[property*=":type"]');
if(meta_type && meta_type.content.toLowerCase() == "article") { /*6:18 PM 4/25/2019 added toLowerCase() | zerohedge has uppercase `Article`*/
	console.log('meta article-type present');
	//ref002 get author from meta tag | https://blog.bradfieldcs.com/you-are-not-google-84912cf44afb#checktest 2019/4/4 7:17 PM
	//8:53 PM [name*="uthor"] using greedy* match bc case sensitivity | https://www.reuters.com/article/idUSKCN1RS2FV
	//5/9/2019 12:22 AM change selector $ to document.querySelector bc $ is set up for querySelectorAll for now.
	var get_metaAuthor = document.querySelector('meta[name*="uthor"]') || document.querySelector('meta[property*="uthor"]');
	if (get_metaAuthor && get_metaAuthor.content.length >= 2 && get_metaAuthor.content.indexOf('http') == -1) {
		if(document.title.indexOf(get_metaAuthor.content) == -1) { /*check if author name is already in document title | [ref00] 2:48 AM 6/12/2019*/
			articleAuthor =  " ~by- "+get_metaAuthor.content;
		}
	} else {
		lookupAuthorNodes();
	}
// ref003 find article author non meta tag. Check pathname for not root url directory.
} else if (meta_type == null && location.pathname.length != 1) {
	console.log("location path is not root");
	lookupAuthorNodes();
} else {
	console.log("not article")
}

//ref002 setTimeout incase some site change doc title | 8:09 PM
setTimeout(function(){
	if (articleAuthor) {
		//ref001
		//document.title += articleAuthor;
		//ref005 format title with site title split `|` at the end
		var title_split1 = document.title.split(' | ');
		var title_split2 = document.title.split(' - '); /*5:29 PM 4/27/2019*/
		var title_split3 = document.title.split(' – '); /*10:55 PM 5/2/2019*/
		var title_split4 = document.title.split(' : '); /*12:37 AM 5/9/2019*/
		if (title_split1.length == 2) {
			document.title = title_split1[0] + articleAuthor +" | "+ title_split1[1];
		} else if (title_split2.length == 2) {
			document.title = title_split2[0] + articleAuthor +" - "+ title_split2[1];
		} else if (title_split3.length == 2) {
			document.title = title_split3[0] + articleAuthor +" – "+ title_split3[1];
		} else if (title_split4.length == 2) {
			document.title = title_split4[0] + articleAuthor +" : "+ title_split4[1];
		} else {
			document.title += articleAuthor;
		}
		console.log('author:'+articleAuthor)
	}
},3000);



