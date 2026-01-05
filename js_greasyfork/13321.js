// ==UserScript==
// @name        SteamGifts Mark Hidden
// @namespace   Alpe
// @include     http://www.steamgifts.com/
// @include     http://www.steamgifts.com/giveaways/search?*
// @include     http://www.steamgifts.com/giveaway/*
// @include     http://www.steamgifts.com/account/settings/giveaways/filters
// @include     http://www.steamgifts.com/account/settings/giveaways/filters/search?page=*
// @include     http://www.steamgifts.com/account/*
// @include     http://www.steamgifts.com/giveaways/wishlist
// @include     http://www.steamgifts.com/giveaways/wishlist/search?page=*
// @version     1.3.7
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant       none
// @run-at      document-end
// @description mark hidden games on GA page
// @downloadURL https://update.greasyfork.org/scripts/13321/SteamGifts%20Mark%20Hidden.user.js
// @updateURL https://update.greasyfork.org/scripts/13321/SteamGifts%20Mark%20Hidden.meta.js
// ==/UserScript==

var timer = false;

var hiddengames = [];
var hiddengamestime = [];
var wishlistgames = [];
var wishlistgamestime = [];
if (timer){ console.time('SG Mark Hidden'); }

function log(text) {
	if(window.console && console.log) {
		console.log("SG Mark Hidden: " + text);
	}
}

function saveData(mode) {
  if (mode === 1){
    localStorage['sgmh_hiddengames'] = JSON.stringify(hiddengames);
    localStorage['sgmh_hiddengamestime'] = JSON.stringify(hiddengamestime);
    localStorage['sgmh_lastscan'] = Date.now();
    log("Data saved 1");
  } else if (mode === 2){
    localStorage['sgmh_wishlistgames'] = JSON.stringify(wishlistgames);
    localStorage['sgmh_wishlistgamestime'] = JSON.stringify(wishlistgamestime);
    localStorage['sgmh_lastwscan'] = Date.now();
    log("Data saved 2");
  }
}

function loadData(mode) {
  if (mode === 1){
    hiddengames = JSON.parse(localStorage['sgmh_hiddengames']);
    hiddengamestime = JSON.parse(localStorage['sgmh_hiddengamestime']);
    log("Data loaded 1");
  } else if (mode === 2){
    wishlistgames = JSON.parse(localStorage['sgmh_wishlistgames']);
    wishlistgamestime = JSON.parse(localStorage['sgmh_wishlistgamestime']);
    log("Data loaded 2");
  }
}

function autoentrycheck() {
  if (!!$('.featured__heading__small:first:contains("Copies")').length){ copies = parseInt($('.featured__heading__small:first:contains("Copies")')[0].innerHTML.match(/[0-9]+/)[0]); } else { copies = 1; }
  if (localStorage.games.match(/name":"[^"|]{1,}/gi).join('||').replace(/name":"/g,'').split('||').indexOf(document.title.split(' - Page')[0]) !== -1){
    maxentries = parseInt(localStorage.games.split(document.title.split(' - Page')[0])[1].split('"}')[0].split('maxentries":"')[1]);
    if (maxentries === -1 || parseInt($('.live__entry-count')[0].innerHTML.replace(',','').match(/[0-9]*/)[0]) < maxentries*copies){ text = '(Would'; } else { text = '(Wouldn\'t'; }
    text+= ' Enter [' + maxentries;
    if (copies>1){ text+= '*' + copies; }
    text+= '])';
    $('div.sidebar__entry-insert, div.sidebar__entry-delete, div.sidebar__error.is-disabled').append('<div class="sidebar__entry-insert2">'+ text + '</div>');
  } else if(localStorage.games.match(/name":"[^"]{1,}\|/i).length > 0){
    testregex = localStorage.games.match(/name":"[^"]{1,}\|/gi);
    for (var a=0; a<testregex.length; a++){
      if(!!RegExp(testregex[a].replace(/\|/g,'').replace(/name":"/g,''), "i").test(document.title.split(' - Page')[0])){
        maxentries = parseInt(localStorage.games.split(testregex[a])[1].split('"}')[0].split('maxentries":"')[1]);
        if (maxentries === -1 || parseInt($('.live__entry-count')[0].innerHTML.replace(',','').match(/[0-9]*/)[0]) < maxentries*copies){ text = '(Would'; } else { text = '(Wouldn\'t'; }
        text+= ' Enter [' + maxentries;
        if (copies>1){ text+= '*' + copies; }
        text+= '])';
        $('div.sidebar__entry-insert, div.sidebar__entry-delete, div.sidebar__error.is-disabled').append('<div class="sidebar__entry-delete2">' + text + '</div>');
        a = testregex.length;
      }
    }
  }
}

function mark(mode) {
  if (mode === 1){
    id = hiddengames.indexOf($('.featured__inner-wrap *[href*="http://store.steampowered.com/"]')[0].href.match(/(sub|app)\/[0-9]{2,6}/g)[0]);
    if (id !== -1){
      $('div.sidebar__entry-insert, div.sidebar__entry-delete, div.sidebar__error.is-disabled').append('<div class="sidebar__entry-delete2">'+"(Hidden " + hiddengamestime[id] + ')</div>');
      log("game hidden on (" + hiddengamestime[id] + ")");
    } else if (!!localStorage.games){
       autoentrycheck();
    }
  } else if (mode === 2){
    id = wishlistgames.indexOf($('.featured__inner-wrap *[href*="http://store.steampowered.com/"]')[0].href.match(/(sub|app)\/[0-9]{2,6}/g)[0]);
    if (id !== -1){
      $('div.sidebar__entry-insert, div.sidebar__entry-delete, div.sidebar__error.is-disabled').append('<div class="sidebar__entry-delete2">'+ "Wishlisted [#"+ (id+1) + "] " + wishlistgamestime[id] + '</div>');
      log("game wishlisted on (" + wishlistgamestime[id] + ")");
    }
  }
}

function getlist(page) {
    $.get( "http://www.steamgifts.com/account/settings/giveaways/filters/search?page="+page, function( data ) {
      log("Scanned list, page: "+page);
            
      $('.table__column__secondary-link[href*="http://store.steampowered.com/"]', $(data)).each(function() {
        hiddengames.push($(this).text().match(/(sub|app)\/[0-9]{2,6}/g)[0]);
      });
      
      $('.table__column--width-small span:not([class])', $(data)).each(function() {
        //hiddengamestime.push($(this).text());
        hiddengamestime.push($(this).attr('title'));
      });
       	var max = $('.pagination__results strong:nth-child(3)', $(data)).text();
        if((max-(page*25))/25 > 0) {
          getlist(parseInt(page)+1);
        }
        else {
          saveData(1);
          if (window.location.pathname.match(/^\/giveaway/)) {
            mark(1);
          }
        }
        
    });
}

function getwlist(page) {
    $.get( "http://www.steamgifts.com/account/steam/wishlist/search?page="+page, function( data ) {
      log("Scanned wlist, page: "+page);
      
      $('.table__column__secondary-link[href*="http://store.steampowered.com/"]', $(data)).each(function() {
        wishlistgames.push($(this).text().match(/(sub|app)\/[0-9]{2,6}/g)[0]);
      });
      
      $('.table__column--width-small span', $(data)).each(function() {
        wishlistgamestime.push($(this).attr('title'));
      });
      var max = $('.pagination__results strong:nth-child(3)', $(data)).text();
      if((max-(page*25))/25 > 0) {
        getwlist(parseInt(page)+1);
      }
      else {
        saveData(2);
        if (window.location.pathname.match(/^\/giveaway/)) {
          mark(2);
        }
      }
    });
}

function testwishlistgames() {
  if (!localStorage['sgmh_lastwscan'] || (!!localStorage['sgmh_wishlistgames'] && JSON.parse(localStorage['sgmh_wishlistgames']).length !== parseInt($('.sidebar__navigation__item__link[href="/account/steam/wishlist"]:first .sidebar__navigation__item__count:first')[0].textContent))){
    if (!!localStorage['sgmh_lastwscan']){ delete localStorage['sgmh_lastwscan']; }
    log("Need to rescan");
  } else log("No need to rescan");
}

if (window.location.pathname.match(/^\/giveaways\/wishlist/)){
  if (!!localStorage['sgmh_wishlistgames']){
    loadData(2);
    var element = $('div.table__column--width-fill');
    for (var i=1; i<element.length; i++){
      var id = wishlistgames.indexOf(element[i].children[1].children[0].href.match(/(sub|app)\/[0-9]{2,6}/g)[0]);
      if (id !== -1){
        element[i].children[0].innerHTML += ' <span style="color: #63a0f4;" title="' + wishlistgamestime[id] + '"><i class="fa fa-fw fa-heart"></i>(' + (id+1) + ')</span>'
      }
    }
  }
} else if (window.location.pathname.match(/^\/giveaways/) || window.location.pathname === "/" || window.location.pathname.length === 0){
  $('.giveaway__icon.giveaway__hide.trigger-popup.fa.fa-eye-slash').click(function() {
    delete localStorage['sgmh_lastscan'];
  });
} else if (window.location.pathname.match(/^\/giveaway/)) {
  if (!localStorage['sgmh_lastscan'] || Date.now()-24*60*60*1000 >= localStorage['sgmh_lastscan']) {    
    getlist(1);
  } else {
    loadData(1);
    mark(1);
  }
  if (!localStorage['sgmh_lastwscan'] || Date.now()-24*60*60*1000 >= localStorage['sgmh_lastwscan']) {    
    getwlist(1);
  } else {
    loadData(2);
    mark(2);
  }
} else if (window.location.pathname.match(/^\/account\/settings\/giveaways\/filters/)) {
  if (!!localStorage['sgmh_hiddengames'] && JSON.parse(localStorage['sgmh_hiddengames']).length !== parseInt($('.pagination__results strong:nth-child(3)').text())){
    if (!!localStorage['sgmh_lastscan']){ delete localStorage['sgmh_lastscan']; }
    log("Need to rescan");
  } else {
    $('.table__remove-default').click(function() {
      delete localStorage['sgmh_lastscan'];
    });
    log("No need to rescan");
  }
  testwishlistgames();
} else if (window.location.pathname === "/account/settings/giveaways" && !!localStorage['sgmh_hiddengames']){
  element = $('.form__row:last .form__row__indent:first .notification:first');
  if (!!element.length){
    element = element[0].textContent.match(/[0-9]{1,}/);
    if (!!element){
      if (JSON.parse(localStorage['sgmh_hiddengames']).length !== parseInt(element[0])){
        if (!!localStorage['sgmh_lastscan']){ delete localStorage['sgmh_lastscan']; }
        log("Need to rescan");
      } else log("No need to rescan");
    }
  }
  testwishlistgames();
} else if (window.location.pathname === "/account/profile/sync"){
  $('div.form__sync-default').click(function() {
    delete localStorage['sgmh_lastwscan'];
  });
  testwishlistgames();
} else if (window.location.pathname.match(/^\/account\//)){
  testwishlistgames();
}

if(timer){ console.timeEnd('SG Mark Hidden'); }

$.noConflict();