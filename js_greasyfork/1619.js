// ==UserScript==
// @name        Original Content
// @namespace   http://xmine128.tk/gm/original-content/
// @description Automatically redirect content stealing websites to their original counterparts
// @require     https://cdnjs.cloudflare.com/ajax/libs/xregexp/2.0.0/xregexp-min.js
// @license     GPL-3.0+
// @include     *://*.bigresource.com/*
// @include     *://*.techforumnetwork.com/*
// @include     *://techforumnetwork.com/*
// @include     *://*.linuxine.com/story/*
// @include     *://linuxine.com/story/*
// @include     *://*.forumsee.com/*
// @include     *://forumsee.com/*
// @include     *://*.bighow.net/*
// @include     *://bighow.net/*
// @include     *://*.techassistbox.com/*
// @include     *://techassistbox.com/*
// @include     *://*.youku.io/*
// @include     *://youku.io/*
// @icon        http://xmine128.tk/gm/original-content/icon.jpg
// @version     1.1.3
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/1619/Original%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/1619/Original%20Content.meta.js
// ==/UserScript==

'use strict';

/**
 * The icon has been released by the user "Nisha A" on Flickr under the CC-BY license
 * 
 * Image on Flickr: https://www.flickr.com/photos/samiksha/445070705/sizes/o/in/photostream/
 * Created by user: https://www.flickr.com/photos/samiksha/
 */
 
const URL = window.location.href;

/**
 * Call the given callback function at the given time during page load
 * 
 * Note: This function assumes that it is being called during "document-start"!
 * 
 * @param {Function} callback
 *        The function to call
 * @param {String}   run_at
 *        During what stage of the page load the function should be called ("document-start", "document-end" or "load")
 * @param {Object}   ...
 *        Additional parameters to pass to the callback function
 */
function _callback_run_at(callback, run_at)
{
	// Read the additonal parameters
	var params = Array.prototype.slice.call(arguments, 2);
	
	switch(run_at) {
		case 'document-start':
			Function.prototype.apply.call(callback, null, params);
		break;
		case 'load':
			window.addEventListener("load", function()
			{
				Function.prototype.apply.call(callback, null, params);
			}, false);
		break;
		default:
			document.addEventListener("DOMContentLoaded", function()
			{
				Function.prototype.apply.call(callback, null, params);
			}, false);
	}
}


/**
 * Process a single URL rewrite rule
 *
 * If `rewriter` is a function then it will receive the following parameters:
 *  - URL:    The URL of the current page
 *  - result: The result of the regular expression matching operation
 * 
 * @param {RegExp|String}   regexp
 *        The regular expression that must be match by the current page URL
 * @param {Function|String} rewriter
 *        A function or XRegExp rewrite string used for replacing the URL
 */
function rule_url(regexp, rewriter)
{
    var result = URL.match(regexp);
    if(result) {
        var href = null;
        if(typeof(rewriter) == 'function') {
            href = rewriter(URL, result);
        } else {
            // Rewrite URL using XRegExp :-)
            href = XRegExp.replace(URL, regexp, rewriter);
        }
        
        // Prevent page load
        //TODO: Get this to do anything more blanking the page
        var interval = window.setInterval(function()
		{
			document.documentElement.innerHTML = "";
		}, 1);
        document.addEventListener("DOMContentLoaded", function(event)
		{
			clearInterval(interval);
		});
        
        // Rewrite URL
        window.location.replace(href);
    }
}


/**
 * Follow a hyperlink on a page
 * 
 * @param {RegExp|String}   regexp
 *        The regular expression that must be match by the current page URL
 * @param {Function|String} selector
 *        A function or XRegExp rewrite string used to generated to selector of the element to click on
 * @param {String}         [run_at="document-end"]
 *        When to perform the action ("document-start", "document-end" or "load")
 */
function rule_link(regexp, selector, run_at)
{
	var result = URL.match(regexp);
	if(result) {
		if(typeof(selector) == 'function') {
			selector = selector(URL, result);
		} else {
			// Rewrite URL using XRegExp
			selector = XRegExp.replace(URL, regexp, selector);
		}
		
		// Click at the correct stage during page load
		_callback_run_at(function(selector)
		{
            window.location.replace(document.querySelector(selector).href);
		}, (run_at || "document-end"), selector);
	}
}


/**
 * Process a single URL action rule
 *
 * If `callback` is a function then it will receive the following parameters:
 *  - URL:    The URL of the current page
 *  - result: The result of the regular expression matching operation
 * If `callback` is a string then that string will be executed in the page's context
 * 
 * @param {RegExp|String}   regexp
 *        The regular expression that must be match by the current page URL
 * @param {Function|String} callback(URL)
 *        The function to call when the page URL matches the given regex
 * @param {String}         [run_at="document-end"]
 *        When to perform the action ("document-start", "document-end" or "load")
 */
function rule_action(regexp, callback, run_at)
{
	var result = URL.match(regexp);
    if(result) {
		// Create wrapper function for string callback
		if(typeof(callback) == "string") {
			var code = callback;
			
			callback = function()
			{
				window.location.href = "javascript:" + code;
			}
		}
		
		// Execute callback function at the correct stage during page load
		_callback_run_at(callback, (run_at || "document-end"), URL, result);
	}
}

rule_url(/^http[s]?:\/\/([^.]+)\.bigresource\.com\/(?:[^-]+[-])+[-]?([A-Za-z0-9]{9,})\.html$/i,     "http://$1.bigresource.com/Track/$2/");
rule_url(/^http[s]?:\/\/(?:[^.]+\.)*bighow\.net\/(\d+)-([^.]+)\.html$/i,                            "http://bighow.net/track/$1/$2");

rule_link(/^http[s]?:\/\/(?:[^.]+\.)*linuxine\.com\/story\/.+$/i, "a.pviewlink");
rule_link(/^http[s]?:\/\/(?:[^.]+\.)*forumsee\.com\/.+$/i,        "a.bigLink");
rule_link(/^http[s]?:\/\/(?:[^.]+\.)*youku\.io\/.+$/i,            "#a_text > .pub_info > a");

rule_action(/^http[s]?:\/\/(?:[^.]+\.)*techforumnetwork\.com\/techqns\/[a-z0-9-]+\/$/i, "readPost()", "document-end");
rule_action(/^http[s]?:\/\/(?:[^.]+\.)*techassistbox\.com\/[A-Za-z0-9-]+_\d+[.]html$/i, function()
{
	var id = document.querySelector("#answerQuestion > button").onclick.toString().match(/v_th\(['"]([A-Za-z0-9]+)['"]\)/i)[1];
	
	window.location.replace("http://www.techassistbox.com/goto/" + id + "/");
});