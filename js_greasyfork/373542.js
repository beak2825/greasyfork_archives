// ==UserScript==
// @name         AAU Campus Style
// @namespace    ckarisch
// @version      0.1
// @description  User Style for AAU Campus
// @author       Christof Karisch
// @match        https://campus.aau.at/*
// @run-at       document-start
// @grant        none
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/373542/AAU%20Campus%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/373542/AAU%20Campus%20Style.meta.js
// ==/UserScript==

(function(global) {
  'use strict';


  //========================================================================
  // Startup
  //-------------------------------------------------------------------
  function startup() {
    load_css("https://raw.githubusercontent.com/ckarisch/AAU-Campus-Styles/master/styles.css", false);
  }

    //########################################################################

	function split_list(str) {return str.replace(/^\s+|\s*(,)\s*|\s+$/g, '$1').split(',').filter(function(name) {return (name.length > 0);});}
	function promise(){var a,b,c=new Promise(function(d,e){a=d;b=e;});c.resolve=a;c.reject=b;return c;}
    //########################################################################

	//------------------------------
	// Load a file asynchronously, and pass the file as resolved Promise data.
	//------------------------------
	function load_file(url, use_cache) {
		var fetch_promise = promise();
		var no_cache = split_list(localStorage.getItem('wkof.load_file.nocache') || '');
		if (no_cache.indexOf(url) >= 0) use_cache = false;
		if (use_cache === true) {
			return file_cache_load(url, use_cache).catch(fetch_url);
		} else {
			return fetch_url();
		}

		// Retrieve file from server
		function fetch_url(){
			var request = new XMLHttpRequest();
			request.onreadystatechange = process_result;
			request.open('GET', url, true);
			request.send();
			return fetch_promise;
		}

		function process_result(event){
			if (event.target.readyState !== 4) return;
			if (event.target.status >= 400 || event.target.status === 0) return fetch_promise.reject(event.target.status);
			if (use_cache) {
				file_cache_save(url, event.target.response)
				.then(fetch_promise.resolve.bind(null,event.target.response));
			} else {
				fetch_promise.resolve(event.target.response);
			}
		}
	}

    //------------------------------
	// Load and install a specific file type into the DOM.
	//------------------------------
	function load_and_append(url, tag_name, location, use_cache) {
		url = url.replace(/"/g,'\'');
		if (document.querySelector(tag_name+'[uid="'+url+'"]') !== null) return Promise.resolve();
		return load_file(url, use_cache).then(append_to_tag);

		function append_to_tag(content) {
			var tag = document.createElement(tag_name);
			tag.innerHTML = content;
			tag.setAttribute('uid', url);
			document.querySelector(location).appendChild(tag);
			return url;
		}
	}

    //------------------------------
	// Load and install a CSS file.
	//------------------------------
	function load_css(url, use_cache) {
		return load_and_append(url, 'style', 'head', use_cache);
	}

	//------------------------------
	// Load and install Javascript.
	//------------------------------
	function load_script(url, use_cache) {
		return load_and_append(url, 'script', 'body', use_cache);
	}
	//########################################################################


startup();

})(window);
