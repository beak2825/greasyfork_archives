// ==UserScript==
// @id             Emp4
// @name           Empeopled Minor Enhancements
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant          GM_addStyle
// @version        1.1
// @namespace      
// @author         TrustyPatches
// @description    Provides minor enhancements for Empeopled.com
// @include        https://empeopled.com/*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/12140/Empeopled%20Minor%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/12140/Empeopled%20Minor%20Enhancements.meta.js
// ==/UserScript==

GM_addStyle('                              \
.OPmain{                                   \
            color: #FFF;                   \
            background-color: #2980B9;     \
            padding: 2px 0px 4px 3px;      \
            border-radius: 4px;            \
            margin-right: 2px;             \
            }                              \
.OPmain:hover{                             \
            color: #2980B9;                \
            background-color: #BDC3C7;     \
            }                              \
.OPmain:focus{                             \
            background-color: #BDC3C7;     \
            }                              \
.OPcom{                                    \
            color: #FFF;                   \
            background-color: #2980B9;     \
            padding: 8px 0px 11px 4px;     \
            border-radius: 4px;            \
            }                              \
.OPcom:hover{                              \
            color: #2980B9;                \
            background-color: #BDC3C7;     \
            }                              \
.OPcom:focus{                              \
            background-color: #BDC3C7;}    \
');

var OP = '', loc = '';
var comCount = 0, read_more = 0, x = 0, links_got = 0;
var supported = ['youtube.com', 'youtu.be', 'imgur.com'];
var comSec, links = [];
var q = 50;

checkPage();

function checkPage() {
	//note current page on first run
	if (loc.length < 1){
		loc = window.location.href;
	}
	//check if on same page as last check
	if (loc == window.location.href){
		//check if page is a post
		if (loc.indexOf('/p/') > -1 || loc.indexOf('/c/') > -1){
			//run getOP if not done already
			if (OP.length < 1){
				setTimeout(getOP, q);
			}
			//check comments if getOP already ran
			else {
				setTimeout(waitForComments, q);
			}
		}
		//if not a post, reinitialize variables and check page again
		else {
			OP = '';
			comCount = 0, read_more = 0, x = 0, links_got = 0;
			setTimeout(checkPage, q);
		}
	}
	//note page of current check and check page again
	else {
		loc = window.location.href;
		checkPage();
	}
}

function getOP() {
	//get main post
	var post = document.getElementsByClassName('discussion-content');
	//make sure main post has loaded
	if (post.length > 0){
		//find OP's name in post and highlight
		OP = post[0].getElementsByClassName('contextualinfo')[0].getElementsByTagName('a')[0];
		OP.className = 'OPmain';
		OP = OP.href.split('/u/')[1];
	}
    checkPage();
}

function waitForComments() {
	//get comments section
	comSec = document.getElementsByClassName('discussion-comments');
	//if comments section is not loaded, recheck page
	if (comSec.length < 1){
		checkPage();
	}
	//if comments section is loaded...
	else {
		checkComments();
		checkPage();
	}
}

function checkComments() {
	//get all comments' context info
	var comments = comSec[0].getElementsByClassName('contextualinfo');
	var temp = comSec[0].getElementsByTagName('a');
	var rm_check = 0;
	for (h = 0; temp.length > h; h++){
		if (temp[h].innerHTML.indexOf('read more') > -1){
			rm_check++;
		}
	}
	//if comments section is not empty and hasn't been checked or number of comments has changed
	if (comCount !== comments.length){
		getLinks();
		comCount = comments.length;
		//check for comments by OP and highlight
		for (i = 0; comments.length > i; i++){
			if (comments[i].getElementsByTagName('a')[0].href.split('/u/')[1] == OP){
				comments[i].getElementsByTagName('a')[0].className = 'OPcom';
			}
		}
	}
	else if (rm_check !== read_more){
		read_more = rm_check;
		getLinks();
	}
}

function getLinks() {
	//grab comments
	var comments = comSec[0].getElementsByClassName('comment-body');
	//run through all comments
	for (i = 0; comments.length > i; i++) {
		if (comments[i].getElementsByClassName('tog').length < 1){
			var comLinks = comments[i].getElementsByTagName('a');
			//if the comment has links
			if (comLinks.length > 0){
				//run through each link
				for (j = 0; comLinks.length > j; j++){
					if (links_got === 0 && comLinks[j].innerHTML.indexOf('read more') > -1){
						read_more++;
					}
					for (k = 0; supported.length > k; k++){
						//if link for supported site
						if (comLinks[j].href.indexOf(supported[k]) > -1){
							embed(k, comLinks[j]);
							x++;
						}
					}
				}
			}
		}
	}
	links_got = 1;
}

function embed(sup, clink) {
	var box = document.createElement('span');
	var toggle = document.createElement('button');
	//if youtube or youtu.be
	if (sup === 0 || sup === 1){
		//format youtube.com url
		if (clink.href.indexOf('youtube') > -1){
			links[x] = clink.href.split('v=')[1];
			links[x] = 'https://www.youtube.com/embed/' + links[x].split('&')[0];
		}
		//format youtu.be url
		else {
			links[x] = 'https://www.youtube.com/embed/' + clink.href.split('be/')[1];
		}
		toggle.style.cssText = 'margin: 0 3px 8px 5px; padding: 3px 10px; font-size: 0.7em; background-color: #C32023;';
		toggle.innerHTML = '&#9658;';
	}
	//format imgur url
	else if (sup === 2){
		links[x] = 'http://imgur.com/' + clink.href.split('com/')[1];
		toggle.style.cssText = 'margin: 0 3px 8px 5px; padding: 3px 10px; font-size: 0.7em; background-color: #222222; color: #60B101';
		toggle.innerHTML = '&#9635;';
	}
	//create container for embeded content and toggle button
	toggle.className = 'btn btn-primary tog lnk' + x;
	toggle.setAttribute('id', 'lnk' + x);
	clink.parentNode.insertBefore(toggle, clink.nextSibling);
	box.style.paddingTop = '10px';
	box.className = 'lnk' + x;
	box.innerHTML = '';
	box.style.display = 'none';
	toggle.parentNode.insertBefore(box, toggle.nextSibling);
	document.getElementById('lnk' + x).addEventListener('click', open, false);
}

//toggle for embed container
function open() {
	var max_width = $(window).width() * 0.75;
	var box = document.getElementsByClassName(this.id)[1];
	var link = links[this.id.split('lnk')[1]];
	//toggle open/closed
	if (box.innerHTML.length < 1){
		box.style.display = 'block';
		if (link.indexOf('youtube') > -1){
			box.innerHTML = '<iframe width="600" height="450" src="' + link + '" frameborder="0" allowfullscreen></iframe>'
		}
		else if (link.indexOf('imgur') > -1){
			box.innerHTML = '<img src="' + link + '">';
			setTimeout(function(){
				if ($(box.firstChild).width() > max_width){
					var ratio = $(box.firstChild).width() / $(box.firstChild).height();
					box.firstChild.width = max_width;
					box.firstChild.height = max_width / ratio;
				}
			}, 500);
		}
	}
	else {
		box.style.display = 'none';
		box.innerHTML = '';
	}
}