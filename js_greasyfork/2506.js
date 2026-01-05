// ==UserScript==
// @name	Tumblr Multiline Asks
// @namespace	the.vindicar.scripts
// @description	Allows you to send multiline asks on Tumblr.
// @version	1.1.1
// @grant	none
// @include	http://www.tumblr.com/ask_form/*
// @include	https://www.tumblr.com/ask_form/*
// @downloadURL https://update.greasyfork.org/scripts/2506/Tumblr%20Multiline%20Asks.user.js
// @updateURL https://update.greasyfork.org/scripts/2506/Tumblr%20Multiline%20Asks.meta.js
// ==/UserScript==

(function(){
//We're on ask page, where code is old and ugly. We have to get our hands dirty...
// First of all, let's check if we have actual ask form here.
var ask_form = document.getElementById('ask_form');
if (!ask_form)
	//We're looking at some message, like "your question has been received" or "Wait for an hour before asking more questions". Nothing to do here
	return; 
//We have an actual ask form. Leeeeeeeets do eeeet!
// Begone, foul event handler that eats up our line breaks!
document.removeEventListener('keydown', linebreaks, false);
//There is a setInterval'd script that strips line breaks from the text.
// Little dirty hack: original script caches the references to used nodes. Thus, if we replace those with clones, the script will be checking unused nodes.
function replaceNode(nodeid) {
	var original = document.getElementById(nodeid);
	if (original) {
		var clone = original.cloneNode(true);
		original.parentNode.replaceChild(clone, original);
		original.setAttribute('id', 'former_'+nodeid);
		return clone;
	} else {
		return null;
	}
}
var q = replaceNode('question');
var ask_button = replaceNode('ask_button');
var characters_remaining = replaceNode('characters_remaining');
var character_counter = replaceNode('character_counter');
// Sadly, this trick also breaks useful parts. We need to recreate those manually. I've copied the code from Tumblr original JS.
// This script also does useful things, so I copied it from Tumblr JS, snipping out linebreak part.
setInterval(function() {
	// Character limit.
	if (q.value.length > 500) q.value = q.value.substring(0, 500);

	// Enable ask button.
	if(q.value.length > 0) {
		ask_button.disabled = false;
	} else {
		ask_button.disabled = true;
	}
	
	var remaining = 500 - q.value.length;
	characters_remaining.innerHTML = remaining;

	// Update character counter.
	if (remaining <= 120) {
		character_counter.style.display = 'block';
		if(remaining > 100) {
			character_counter.style.color = '#444';
		} else if (remaining > 80 && remaining <= 100) {
			character_counter.style.color = '#5f3b3e';
		} else if (remaining > 60 && remaining <= 80) {
			character_counter.style.color = '#7b3239';
		} else if (remaining > 40 && remaining <= 60) {
			character_counter.style.color = '#962a33';
		} else if (remaining > 20 && remaining <= 40) {
			character_counter.style.color = '#b2212e';
		} else {
			character_counter.style.color = '#cd1828';
		}
	} else {
		character_counter.style.display = 'none';
	}
}, 100);                
// old validation handler still remembers replaced nodes. We have to remove it first...
ask_form.removeEventListener('submit', validate, false);
//...then create our own, working with clones...
validate = function (e) {
	if (!q.value) { 
		alert('You need to enter a question!'); 
		stopEvent(e);
		return false; 
	}
	if (
		q.value.match(/http:\/\//i) ||
		q.value.match(/www\./i) ||
		q.value.match(/[a-zA-Z0-9]+(\.arpa|\.root|\.aero|\.biz|\.cat|\.com|\.coop|\.edu|\.gov|\.info|\.int|\.jobs|\.mil|\.mobi|\.museum|\.name|\.net|\.org|\.pro|\.travel|TLD|\.ac|\.ad|\.ae|\.af|\.ag|\.ai|\.al|\.am|\.an|\.ao|\.aq|\.ar|\.as|\.at|\.au|\.aw|\.ax|\.az|\.ba|\.bb|\.bd|\.be|\.bf|\.bg|\.bh|\.bi|\.bj|\.bm|\.bn|\.bo|\.br|\.bs|\.bt|\.bv|\.bw|\.by|\.bz|\.ca|\.cc|\.cd|\.cf|\.cg|\.ch|\.ci|\.ck|\.cl|\.cm|\.cn|\.co|\.cr|\.cu|\.cv|\.cx|\.cy|\.cz|\.de|\.dj|\.dk|\.dm|\.do|\.dz|\.ec|\.ee|\.eg|\.er|\.es|\.et|\.eu|\.fi|\.fj|\.fk|\.fm|\.fo|\.fr|\.ga|\.gb|\.gd|\.ge|\.gf|\.gg|\.gh|\.gi|\.gl|\.gm|\.gn|\.gp|\.gq|\.gr|\.gs|\.gt|\.gu|\.gw|\.gy|\.hk|\.hm|\.hn|\.hr|\.ht|\.hu|\.id|\.ie|\.il|\.im|\.in|\.io|\.iq|\.ir|\.is|\.it|\.je|\.jm|\.jo|\.jp|\.ke|\.kg|\.kh|\.ki|\.km|\.kn|\.kr|\.kw|\.ky|\.kz|\.la|\.lb|\.lc|\.li|\.lk|\.lr|\.ls|\.lt|\.lu|\.lv|\.ly|\.ma|\.mc|\.md|\.mg|\.mh|\.mk|\.ml|\.mm|\.mn|\.mo|\.mp|\.mq|\.mr|\.ms|\.mt|\.mu|\.mv|\.mw|\.mx|\.my|\.mz|\.na|\.nc|\.ne|\.nf|\.ng|\.ni|\.nl|\.no|\.np|\.nr|\.nu|\.nz|\.om|\.pa|\.pe|\.pf|\.pg|\.ph|\.pk|\.pl|\.pm|\.pn|\.pr|\.ps|\.pt|\.pw|\.py|\.qa|\.re|\.ro|\.ru|\.rw|\.sa|\.sb|\.sc|\.sd|\.se|\.sg|\.sh|\.si|\.sj|\.sk|\.sl|\.sm|\.sn|\.so|\.sr|\.st|\.su|\.sv|\.sy|\.sz|\.tc|\.td|\.tf|\.tg|\.th|\.tj|\.tk|\.tl|\.tm|\.tn|\.to|\.tp|\.tr|\.tt|\.tv|\.tw|\.tz|\.ua|\.ug|\.uk|\.um|\.us|\.uy|\.uz|\.va|\.vc|\.ve|\.vg|\.vi|\.vn|\.vu|\.wf|\.ws|\.ye|\.yt|\.yu|\.za|\.zm|\.zw)/i)
	) {
		alert('Sorry, but please don\'t include links in questions.');
		stopEvent(e);
		return false;
	}
	ask_button.disabled = true;
}
//...and set it in place
ask_form.addEventListener('submit', validate, false);
})();