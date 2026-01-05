// ==UserScript==
// @name RaaW2
// @version 2.5.6
// @namespace RaaW2
// @description Reddit as a Weapon script. Parts and idea by /u/noeatnosleep, enhanced by /u/enim, /u/creesch, and /u/djimbob. RaaW adds links for page-wide voting and reporting. It adds a 'report to /r/spam' link, an 'analyze user submission domains' link, and a 'report to /r/botwatchman' link to userpages. RaaW disables the np. domain. RaaW Adds a 'show source' button for comments.  DISCLIAMER: Use this at your own risk. If the report button is misued, you could be shadowbanned.
// @include http://www.reddit.com/user/*
// @include http://www.reddit.com/r/*
// @include http://*reddit.com/*
// @include https://www.reddit.com/user/*
// @include https://www.reddit.com/r/*
// @include https://*reddit.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var currentPage = document.URL;
var parsedPage = currentPage.split('/');
var modHash = null;
var currentUser = null;
var subreddit = null;
var commentIDs = [];
var topicIDs = [];
var subredditList = [];
var reportID = [];

var commentPage;	
commentPage = document.getElementsByClassName('comment');

function getHash(callback) {
    var query = new XMLHttpRequest();
    query.onreadystatechange = function () {
        if (query.readyState == 4) {
            var info = JSON.parse(query.responseText);
            modHash = info.data.modhash;
            callback();
        }
    }
    query.open('GET', 'http://www.reddit.com/api/me.json', true);
    query.send(null);
}

function generateToolbar () {
	$(document).find('#header')[0].style.paddingTop='18px';
    var newToolbar = document.createElement("div");
	newToolbar.id = "newToolbar";
	document.body.insertBefore(newToolbar,document.body.firstChild);
	var subredditbar = document.getElementById('sr-header-area');
	newToolbar.style.cssText="color:black;background-color:'#f0f0f0';border-bottom:1px black solid;font-family:verdana, arial, helvetica, sans-serif;font-size:90%;height:12px;padding:3px 0px 3px 6px;text-transform:uppercase;width:100%;z-index:+999999;position:fixed;top:0;";
	newToolbar.style.backgroundColor='#f0f0f0';
	newToolbar.style.paddingLeft = '6px';
    newToolbar.style.paddingTop = '3px';
    newToolbar.style.paddingBottom = '3px';
    newToolbar.style.top='0px';
    newToolbar.innerHTML += 
	if (parsedPage[3] == 'user'){
		newToolbar.innerHTML += "<a id=reportComment style='color:black;' href='#'> | REPORT ALL</a> <a id='botwatchmanSend' style='color:black;' href='#'> | /R/BOTWATCHMAN </a> <a id='analyzeSend' style='color:black;' href='#'> | ANALYZE </a> <a id='reportUserToSpam' style='color:black;' href='#'> | /R/SPAM </a> <a id='reportUserToAdmin' style='color:black;' href='#'> | ADMIN </a>";
	}
	else {
		newToolbar.innerHTML += "<a id='downvoteComment' style='color:black;' href='#'> DOWNVOTE ALL</a> <a id='upvoteComment' style='color:black;' href='#'> | UPVOTE ALL</a> "; <a id='composeNew' style='color:black;' href='#'> | COMPOSE </a>";	
	}
	

}


function doStuff() {
    $('#reportComment').on('click',function(e) {
       for(var i = 0; i < reportID.length; i++) {reportItem(i, 3);}
    alert('All items on this page were reported.');
    });   
    $('#downvoteComment').on('click',function(e){
    	theDownvoter();
    });
    $('#upvoteComment').on('click',function(e){
    	theUpvoter();
    });
    $('#reportUserToSpam').on('click',function(e){
    	reportToSpam();
    });
    $('#analyzeSend').on('click',function(e){
    	analyzeSend();
    });
    $('#botwatchmanSend').on('click',function(e){
    	botwatchmanSend();
    });
    $('#composeNew').on('click',function(e){
    	composeNew();
    });
    $('#reportUserToAdmin').on('click',function(e){
    	reportToAdmin();
    });

	
}

function buildReportArray() {
	if (commentPage.length == 0) {
		var threads;
		threads = $('#siteTable').find('.thing');
		for (i = 0; i < threads.length; i++) {
			 reportID.push(threads[i].getAttribute('data-fullname'));
		}
	}
	else if (commentPage.length != 0) {
		var threads;
		threads = $('.commentarea').find('.thing');
		for (i = 0; i < threads.length; i++) {
			 reportID.push(threads[i].getAttribute('data-fullname'));
		}
	}
}

function reportItem(index, num) {
  if(num == 3) {var fullname = topicIDs[index];}
  else{var fullname = commentIDs[index];}
  $.post('http://www.reddit.com/api/report', {'id': fullname, 'uh': modHash});
}


function theDownvoter() {
	if (parsedPage[3] == 'user'){
		var items = $('#siteTable').find('.arrow.down');
		    Array.prototype.forEach.call(items, function(el, i){
		      setTimeout(function(){
		        el.click();
		      },100 + ( i * 400 ));
		    });
		    return false;
	}
	else {
		if (commentPage.length == 0) {
			var items = $('#siteTable').find('.arrow.down');
		    Array.prototype.forEach.call(items, function(el, i){
		      setTimeout(function(){
		        el.click();
		      },100 + ( i * 400 ));
		    });
		    return false;
	 	}
	 	else {
			var items = $('.commentarea').find('.arrow.down');
		    Array.prototype.forEach.call(items, function(el, i){
		      setTimeout(function(){
		        el.click();
		      },100 + ( i * 400 ));
		    });
		    return false;
	 	}
	}
}

function theUpvoter() {
	if (parsedPage[3] == 'user'){
		var items = $('#siteTable').find('.arrow.up');
		    Array.prototype.forEach.call(items, function(el, i){
		      setTimeout(function(){
		        el.click();
		      },100 + ( i * 400 ));
		    });
		    return false;
	}
	else {
		if (commentPage.length == 0) {
			var items = $('#siteTable').find('.arrow.up');
		    Array.prototype.forEach.call(items, function(el, i){
		      setTimeout(function(){
		        el.click();
		      },100 + ( i * 400 ));
		    });
		    return false;
	 	}
	 	else {
			var items = $('.commentarea').find('.arrow.up');
		    Array.prototype.forEach.call(items, function(el, i){
		      setTimeout(function(){
		        el.click();
		      },100 + ( i * 400 ));
		    });
		    return false;
	 	}
	}
}

		
function reportToSpam(){
	var username = $(document).find('.pagename.selected').text();
	window.open('http://www.reddit.com/r/spam/submit?title=overview for '+ username + '&resubmit=true&url=http://www.reddit.com/user/' + username + "?");
}

function analyzeSend(){
	var username = $(document).find('.pagename.selected').text();
	window.open('http://www.reddit.com/message/compose/?to=analyzereddit&subject=analyze&message='+ username);
}

function botwatchmanSend(){
	var username = $(document).find('.pagename.selected').text();
	window.open('http://www.reddit.com/r/botwatchman/submit?title=overview for '+ username + '&url=http://www.reddit.com/user/' + username);
}
function composeNew(){
	window.open('http://www.reddit.com/message/compose/');
}

if (document.documentElement.lang === 'np') {
    document.documentElement.lang = 'en-us';
}

function reportToAdmin(){
	var username = $(document).find('.pagename.selected').text();
	window.open('http://www.reddit.com/message/compose/?to=/r/reddit.com&message='+ username);
}

//disable .np

document.body.classList.add('subscriber');

delete_function = function(thread_root) {
    var elmnts = document.getElementsByClassName('id-'+thread_root)[0].querySelectorAll('form input[value="removed"]~span.option.error a.yes,a[onclick^="return big_mod_action($(this), -1)"]');
    for(var i=0; i < elmnts.length; i++) {
	setTimeout(
	    (function(_elmnt) {
		return function() {
		    var event = document.createEvent('UIEvents');
		    event.initUIEvent('click', true, true, window, 1);
		    _elmnt.dispatchEvent(event);
		}}
	    )(elmnts[i]), 1500*i); // 1.5s timeout prevents overloading reddit.
    };
}

//source reveal (creesch)

$('.comments-page .comment .flat-list.buttons').each(function () { // this targets each flat-list belonging to comments on a comment page. 
    $(this).append('<li><a class="view-source" href="javascript:void(0)">view source</a></li>'); // it then adds the view source button in the belonging function
});

$('body').on('click', '.view-source', function () { // On clicking of the view source button we do what we want to do. Note that we start with body since that is a constant dom element. If you try to target added dom elements directly it will not work. 
    var $this = $(this), // We posisbly want to reuse $(this), it is cleaner to define jquery objects you want to reuse. 
        $parentThing = $this.closest('.thing'),
        thingId = $parentThing.attr('data-fullname'); // we need an id to throw at the api, luckily it is is present in the html.
    
    if($parentThing.find('#box-' + thingId).length) { // Lets see if we already did do this before.
        $parentThing.find('#box-' + thingId).toggle(); // we did, toggle
    } else { // we did not, grab the info.
        $.getJSON('/api/info.json?id=' + thingId, function () { // lets do an ajax call to grab the info we need.
            console.log("success"); // you can remove this, basically lets you know a json call is done.
        })
            .done(function (data) { // by doing the stuff we need to do in .done we make sure we have the data needed since ajax is async.
            var commentBody = data.data.children[0].data.body; // json is basically an object. 
                var commentSourceBox = '<textarea style="display:block" rows="10" cols="50">'+ commentBody + '</textarea>'; // build the source box.
            $parentThing.find('.flat-list').first().before(commentSourceBox); // and add it to the .thing, note that I use .first() if I didn't do that it would add the source box for all child comments as well. 
        });
    }
});


//nuke (djimbob)
    
delete_function = function(thread_root) {
    var elmnts = document.getElementsByClassName('id-'+thread_root)[0].querySelectorAll('form input[value="removed"]~span.option.error a.yes,a[onclick^="return big_mod_action($(this), -1)"]');
    for(var i=0; i < elmnts.length; i++) {
    setTimeout(
    	(function(_elmnt) {
    	return function() {
    		var event = document.createEvent('UIEvents');
    		event.initUIEvent('click', true, true, window, 1);
    		_elmnt.dispatchEvent(event);
    	}}
    	)(elmnts[i]), 1500*i); // 1.5s timeout prevents overloading reddit.
    };
}
    
if(document.querySelector('body.moderator')){ // only execute if you are a moderator
    var nuke_button = new Array();
    var divels = document.querySelectorAll('div.noncollapsed');
    var comment_ids = new Array();
    var use_image = false;
    // create img DOM element to clone
    if(use_image) {
        try {
            var img_element =  document.createElement('img');
            img_element.setAttribute('alt', 'Nuke!');
            img_element.setAttribute('src', chrome.extension.getURL('nuke.png'));
        } catch(e) {
            use_image = false;
        }
    } 
    for (var i = 0; i < divels.length; i++) {
    var author_link = divels[i].querySelector('p.tagline>a.author,p.tagline>span.author,p.tagline>em');
    // p.tagline>a.author is normal comment;
    // some author deleted comments seem to have either
    // p.tagline>span.author or p.tagline>em 
    	
    comment_ids[i] = divels[i].getAttribute('data-fullname');
        // console.log(i + ':' + comment_ids); 	
    if(author_link) {
    	// create link DOM element with img inside link
    	nuke_button[i] = document.createElement('a')
    	nuke_button[i].setAttribute('href', 'javascript:void(0)');
    	nuke_button[i].setAttribute('title', 'Nuke!');
    	nuke_button[i].setAttribute('id', 'nuke_'+i);	    
            if(use_image) {
    	    nuke_button[i].appendChild(img_element.cloneNode(true));
            } else {
    	    nuke_button[i].innerHTML= "[Nuke]"; 
            }    
    	// append after the author's name
    	author_link.parentNode.insertBefore(nuke_button[i], author_link.nextSibling);
    
    	// Add listener for click; using IIFE to function with _i as value of i when created; not when click
    	nuke_button[i].addEventListener('click', 
                (function(_i) {
    		return function() {
    		var continue_thread = divels[_i].querySelectorAll('span.morecomments>a');
    		var comment_str = " comments?";
    		if(continue_thread.length > 0) {
    		    	comment_str = "+ comments (more after expanding collapsed threads; there will be a pause before the first deletion to retrieve more comments)?";
    		}
    		var delete_button = divels[_i].querySelectorAll('form input[value="removed"]~span.option.error a.yes,a[onclick^="return big_mod_action($(this), -1)"]');
    		// form input[value="removed"]~span.option.error a.yes -- finds the yes for normal deleting comments.
    		// a.pretty-button.neutral finds the 'remove' button for flagged comments
    		if (confirm("Are you sure you want to nuke the following " + delete_button.length + comment_str)) {
    		    	for (var indx=0; indx < continue_thread.length; indx++) {
    		    	var elmnt = continue_thread[indx];
    		    	setTimeout(
    		    		function() {
    		    		var event = document.createEvent('UIEvents');
    		    		event.initUIEvent('click', true, true, window, 1);
    		    		elmnt.dispatchEvent(event);
    		    		}, 2000*indx); // wait two seconds before each ajax call before clicking each "load more comments"
    		    	} 
    			if(indx > 0) {
    			setTimeout(function() {delete_function(comment_ids[_i])},
    					2000*(indx + 2)); // wait 4s after last ajax "load more comments"
    			} else {
    			delete_function(comment_ids[_i]); // call immediately if not "load more comments"
    			}
    		}
    		}
    	}
    	)(i)); // end of IIFE (immediately invoked function expression)
    }
    }
}

//linkswapping

document.addEventListener("DOMContentLoaded", replaceLinks, false );

if( document.readyState === "complete" ) {
    replaceLinks();
}

function replaceLinks() {
    Array.forEach( document.links, function(a) {
        a.href = a.href.replace( "https://i.imgur.com", "http://imgur.com");
        a.href = a.href.replace( "https://imgur.com", "http://imgur.com");
    });
}

generateToolbar(), getHash(),buildReportArray(), doStuff();