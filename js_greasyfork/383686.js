// ==UserScript==
// @name         Google search box auto-focus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Always set input focus to the search textbox
// @author       Matt Blais
// @include     http*://www.google.*/*
// @exclude     http*://www.google.com/recaptcha/*
// @include     http*://www.google.co*.*/*
// @include     http*://news.google.*/*
// @include     http*://encrypted.google.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383686/Google%20search%20box%20auto-focus.user.js
// @updateURL https://update.greasyfork.org/scripts/383686/Google%20search%20box%20auto-focus.meta.js
// ==/UserScript==

// Focus the search box whenever the page becomes active/focused
(function() {
    'use strict'
	var fo = function ()
    {
		var inp = document.getElementsByTagName("input")
		if( inp && inp.length > 2 ) {
			inp[2].focus()
            // Select all text in box
            inp[2].select()
			// Collapse the search combobox
		    var cbdd = document.getElementsByClassName('UUbT9')
            if (cbdd.length) {
		    	window.setTimeout(function() { cbdd[0].style.display = 'none' }, 20)
            }
		}
	}

	window.addEventListener('focus', fo)
	fo()

}() )
