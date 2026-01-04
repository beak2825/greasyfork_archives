// ==UserScript==
// @name         Unofficial Skunk Works for SG (USW-SG)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds links to posts where links to posts are missing
// @author       Geppa Dee
// @match        https://social.infogalactic.com/
// @match        https://social.infogalactic.com/*
// @grant        unsafeWindow
// @require 	 https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/414205/Unofficial%20Skunk%20Works%20for%20SG%20%28USW-SG%29.user.js
// @updateURL https://update.greasyfork.org/scripts/414205/Unofficial%20Skunk%20Works%20for%20SG%20%28USW-SG%29.meta.js
// ==/UserScript==

var esg;

function hook_history_mutators(){
	var evented = function(type) {
		var orig = history[type];
		return function() {
			var rv = orig.apply(this, arguments);
			var e = new Event(type);
			e.arguments = arguments;
			window.dispatchEvent(e);
			return rv;
		};
	};
	history.pushState = evented('pushState');
	history.replaceState = evented('replaceState');
}

function init(deb = 0){
	esg = {
		log_level: deb,
		log: console.log,
		feat_post_link: {
			state: {
				id: 0,
				loops: 0,
			}
		}
	}
	if (deb > 0) esg.log('[USW-SG] init');
	hook_history_mutators();
}

function make_post_link(id){
	// model: https://social.infogalactic.com/micropost/<id>
	return $('<a href="/micropost/' + id +'" style="margin-left: 1em;"><i class="fas fa-link" /></a>');
}

function decorate_posts(deb = 0){
    if (deb > 0) esg.log('[USW-SG] decorate_posts.enter');
    $('micropost > mat-card').each(function(index){
		var id = $(this).attr('id');
		if (deb > 1) esg.log('[USW-SG]  id:', id);
		var post_id;
		if (/micropost/.test(id)) post_id = id.replace(/micropost-/, '');
		if (/microquote/.test(id)) post_id = id.replace(/microquote-/, '');
		if (deb > 1) esg.log('[USW-SG]  post_id:', post_id);
		if (post_id){
            $('mat-card-actions', this).append(make_post_link(post_id));
        }
    })
}

function end_looper(){
	if (esg.feat_post_link.state.looper > 0){
		clearInterval(esg.feat_post_link.state.looper);
		esg.feat_post_link.state.looper = 0;
	};
}

function track_loading(deb = 0){
	if (deb > 0) esg.log('[USW-SG] track_loading.enter');
	var run = true;

	var test_string;
	if (window.location.pathname === '/' || /search/.test(window.location.pathname)){
		// "my feed" or "search/tag"
		if (deb > 1) esg.log('[USW-SG] detection: "my feed" or "search"');
		test_string = 'throbber > img.pl-3';
	} else if (/public_profile/.test(window.location.pathname)){
		// profile feed
		if (deb > 1) esg.log('[USW-SG] detection: "profile feed"');
		test_string = '.public-profile-loading';
	} else {
		run = false;
	}

	if (run){
		esg.feat_post_link.state.id = 1;
		esg.feat_post_link.state.loops = 0;
		end_looper();
		esg.feat_post_link.state.looper = setInterval(function(){

			var loading_el = $(test_string);

			switch(esg.feat_post_link.state.id){
				case 1:
					// looking for "loading" to appear
					if (loading_el.length > 0 || esg.feat_post_link.state.loops == 15){
						// either found or it could be a "back/popstate", which doesn't show "loading"
						esg.feat_post_link.state.id = 2;
						esg.feat_post_link.state.loops = 0;
					} else {
						esg.feat_post_link.state.loops++;
					}

					break;
				case 2:
					// looking for "loading" to go away
					if (loading_el.length == 0){
						esg.feat_post_link.state.id = 3;
						esg.feat_post_link.state.loops = 0;
						decorate_posts(deb);
					} else {
						esg.feat_post_link.state.loops++;
					}
					break;
				case 3:
					// done looping
					esg.feat_post_link.state.id = 0;
					esg.feat_post_link.state.loops = 0;
					end_looper();
					break;
			}
			if (deb > 1) esg.log('[USW-SG] tick:', esg.feat_post_link.state);
		}, 1000);
	}
}


(function() {
	'use strict';
	init(1);
	$(window).on('pushState replaceState popstate', function(){
		if (esg.log_level > 0) esg.log('[USW-SG] EV:*StateChange');
		track_loading(esg.log_level);
	});
})();