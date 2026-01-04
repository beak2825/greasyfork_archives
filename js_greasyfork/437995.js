// ==UserScript==
// @name         IMDb - 1337x button 1.10
// @namespace    none
// @version      1.9
// @description  Inserts 1337x button and puts description to the right side
// @author       barn852
// @license      MIT
// @match        https://www.imdb.com/title/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end 
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/437995/IMDb%20-%201337x%20button%20110.user.js
// @updateURL https://update.greasyfork.org/scripts/437995/IMDb%20-%201337x%20button%20110.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function make_link(movie_title_year) {
        var movieTitle = encodeURIComponent(movie_title_year).replace('%C2%A0', ' ');
        var torrentLink = 'https://1337x.to/category-search/'+movieTitle+'/Movies/1/';
        var d = document.createElement('div');
        var a = document.createElement('a');

        a.innerHTML = '<pre>Search on 1337x</pre>'; // &nbsp;· &nbsp;
        a.href = torrentLink;
        a.style.textDecorationLine = 'none';
        a.style.color = 'inherit';
        a.target="_blank";

        d.appendChild(a);
        d.style.margin='0em';
        d.style.padding='0em';
        d.addEventListener("mouseover", function(){ d.style.textDecorationLine = "underline"; });
        d.addEventListener("mouseout", function(){ d.style.textDecorationLine = "none"; });

        return d;
    }

  function get_movie_title_year() {
        var h1 = document.querySelector('h1');
        console.log(h1);
        var movie_title = h1.innerText;
        var movie_year = h1.nextSibling.firstChild.firstChild.innerText;
        var movie_title_year = movie_title + ' '+movie_year; // var movie_title_year = movie_title + ' ('+movie_year+')';
        return movie_title_year;
  }

  var movie_title_year = get_movie_title_year();
  console.log(movie_title_year);

  function onload() {
    document.querySelector('div[data-testid="hero-subnav-bar-right-block"] > ul').appendChild(make_link(movie_title_year));
  }

  console.log('inserted');
  window.onload = onload;

})();


