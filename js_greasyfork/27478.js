// ==UserScript==
// @name        imdb.torrent.links
// @namespace   mikeos.imdb
// @description Provides links to popular torrent sites while Browsing IMDB movie\TV-show pages
// @include     *imdb.com/title/*
// @version     1.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27478/imdbtorrentlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/27478/imdbtorrentlinks.meta.js
// ==/UserScript==

var ratingWidget = document.getElementById("ratingWidget");
var title = ratingWidget.getElementsByTagName("strong")[0];
var overview = document.getElementById("title-overview-widget");
var div = document.createElement("div");
div.setAttribute("style"," background:#F8F8F8 url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAU5JREFUWIXt1b0uBFEYxvHfIhoNQTQKFY0rkEhUohJRK7dQKMRVKLkArmATSrQiCo0QBYkEUbAStlLIJhRjks3kzO7O7DLN/pOTzJx5n/M88/UeCqaUQ7OCqZRrFzjLnaZNjvCdMrazLtbX1Wg56AXoBegFSGtE06hgMHBtEkMpune8BearWEYtS7iy9IaTZXxhPotxI7tdCFDOaw79OOnAfLcT85gR3OUwP/69ga4wI/qA2jW/xXC3zGOWUG/D/OM3cNvUmoyrRO1WC/M6FhOamxYeTRd8CATeb1K/Gah/buYx0FBYxXVC/BJYcF30iOcS83vYCdSfYzwxN4vR+CROUwmI05jAU4P2VLhrpnEYa/PuBa+i1vqJR6yKOl5mBlqXpHKJNdwL9/8/DwAHHeqL3457ARq/gXEs/JPvWHxQEv2PhVH4Kyhho+gQhfID8/2rysJJu+YAAAAASUVORK5CYII=') 20px 50% no-repeat;padding:10px 0;border:solid 2px #999999;border-left:none;border-right:none");
overview.appendChild(div);

var link = document.createElement("a");link.innerHTML = "rutracker.org (original)";
link.setAttribute("style","float:right;margin:10px 30px;font-size:18px");
link.setAttribute("target","_blank");
link.setAttribute("href","http://rutracker.org/forum/tracker.php?nm=" + encodeURIComponent(title.textContent + " original"));
div.appendChild(link);

var link = document.createElement("a");link.innerHTML = "rutracker.org";
link.setAttribute("style","float:right;margin:10px 30px;font-size:18px");
link.setAttribute("target","_blank");
link.setAttribute("href","http://rutracker.org/forum/tracker.php?nm=" + encodeURIComponent(title.textContent));
div.appendChild(link);

var link = document.createElement("a");link.innerHTML = "thepiratebay.org";//title.textContent;
link.setAttribute("style","float:right;margin:10px 30px;font-size:18px");
link.setAttribute("target","_blank");
link.setAttribute("href","https://thepiratebay.org/search/" + encodeURIComponent(title.textContent));
div.appendChild(link);

var divclear = document.createElement("div");
divclear.setAttribute("style","clear:right");
div.appendChild(divclear);
var reviewBody = document.getElementById('titleUserReviewsTeaser').getElementsByTagName("p")[0];
if (reviewBody){
var description = document.createElement("div");description.innerHTML = '<hr><h4>User Review <small>[Click to expand]</small>:</h4><div onclick="this.style.height=\'\'" style="height:55px;cursor:pointer;overflow:hidden;">' + reviewBody.innerHTML + '</div><br><a style="position:relative;top:-12px" href="#titleUserReviewsTeaser">More reviews</a><hr>';
description.setAttribute("style","clear:right;padding:0 20px");
document.getElementById("title-overview-widget").appendChild(description);
}
