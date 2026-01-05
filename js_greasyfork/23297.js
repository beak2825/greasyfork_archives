// ==UserScript==
// @name         Perfect shot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  arrow keys to corner shot
// @author       Stranger3003
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23297/Perfect%20shot.user.js
// @updateURL https://update.greasyfork.org/scripts/23297/Perfect%20shot.meta.js
// ==/UserScript==

$("#cvs").keydown(function(c){103==c.which&&(target.f=.5)}),$("#cvs").keydown(function(c){38==c.which&&(target.f=1.57)}),$("#cvs").keydown(function(c){105==c.which&&(target.f=2.4)}),$("#cvs").keydown(function(c){39==c.which&&(target.f=3.14)}),$("#cvs").keydown(function(c){99==c.which&&(target.f=3.9)}),$("#cvs").keydown(function(c){40==c.which&&(target.f=-1.57)}),$("#cvs").keydown(function(c){97==c.which&&(target.f=-.65)}),$("#cvs").keydown(function(c){37==c.which&&(target.f=0)}),$("#cvs").keydown(function(c){96==c.which&&shootBullet(player)}),$("#cvs").keydown(function(c){38==c.which&&(target.f=1.57)}),$("#cvs").keydown(function(c){39==c.which&&(target.f=3.14)}),$("#cvs").keydown(function(c){40==c.which&&(target.f=-1.57)}),$("#cvs").keydown(function(c){37==c.which&&(target.f=0)}),$("#cvs").keydown(function(c){37==c.which&&shootBullet(player)}),$("#cvs").keydown(function(c){38==c.which&&shootBullet(player)}),$("#cvs").keydown(function(c){39==c.which&&shootBullet(player)}),$("#cvs").keydown(function(c){40==c.which&&shootBullet(player)});