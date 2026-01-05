// ==UserScript==
// @name        GetMovieDownloadLink(BETA)
// @description Searches BT links by movie original name(English)
// @namespace   https://greasyfork.org/users/50045
// @include     https://www.themoviedb.org/*
// @include     http://www.themoviedb.org/*
// @version     0.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21097/GetMovieDownloadLink%28BETA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/21097/GetMovieDownloadLink%28BETA%29.meta.js
// ==/UserScript==
var x = document.getElementsByClassName('facts left_column') [0];
var y = x.getElementsByClassName('wrap') [0];
var movie = y.innerHTML;
movie = movie.replace(/<strong>.*?<\/strong>/, '');
//console.log(movie);
y.appendChild(document.createElement('BR'));
y.appendChild(document.createElement('BR'));
var s;
s = document.createElement('A');
s.target = '_blank';
s.text = 'Search in moviemagnet';
s.href = 'https://moviemagnet.net/movies/search?utf8=%E2%9C%93&movie%5Btmdb_id%5D=&movie%5Boriginal_title%5D=' + movie;
y.appendChild(s);
y.appendChild(document.createElement('BR'));
y.appendChild(document.createElement('BR'));
s = document.createElement('A');
s.target = '_blank';
s.text = 'Search in kickasstorrent';
s.href = 'https://kat.cr/usearch/' + movie;
y.appendChild(s);
y.appendChild(document.createElement('BR'));
y.appendChild(document.createElement('BR'));
s = document.createElement('A');
s.target = '_blank';
s.text = 'Search in torrentz.eu';
s.href = 'https://www.torrentz.eu/search?q=' + movie;
y.appendChild(s);
