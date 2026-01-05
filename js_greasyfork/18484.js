// ==UserScript==
// @name         ao3 menu items
// @version      0.3.1
// @description  add more options to dropdown
// @include      /https?://archiveofourown\.org/*/
// @grant        none
// @namespace https://greasyfork.org/users/36620
// @downloadURL https://update.greasyfork.org/scripts/18484/ao3%20menu%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/18484/ao3%20menu%20items.meta.js
// ==/UserScript==

var greeting, username, menu;

greeting = document.getElementById('greeting');

username = greeting.querySelector('a').href;
username = username.slice(username.lastIndexOf('/')+1);

menu = greeting.querySelector('li').querySelector('ul');

var menuItems = '';
var menuArr = [{name:'Dashboard', url:''}, {name:'Profile', url:'/profile'}, {name:'Pseuds', url:'/pseuds'}, {name:'Preferences', url:'/preferences'}, {name:'Skins', url:'/skins'},
                 {name:'Works', url:'/works'}, {name:'Drafts', url:'/works/drafts'}, {name:'Series', url:'/series'}, {name:'Bookmarks', url:'/bookmarks'}, {name:'Collections', url:'/collections'},
                 {name:'Inbox', url:'/inbox'}, {name:'Statistics', url:'/stats'}, {name:'History', url:'/readings'}, {name:'Subscriptions', url:'/subscriptions'},
                 {name:'Sign-ups', url:'/signups'}, {name:'Assignments', url:'/assignments'}, {name:'Claims', url:'/claims'}, {name:'Related Works', url:'/related_works'}, {name:'Gifts', url:'/gifts'}];

for (i=0; i<menuArr.length; i++) {
    menuItems = menuItems+'<li><a href="/users/'+username+menuArr[i].url+'">'+menuArr[i].name+'</a></li>';
    }

menu.innerHTML = menuItems;