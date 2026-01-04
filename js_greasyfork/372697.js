// ==UserScript==
// @name        SPB finder
// @namespace   https://steamcommunity.com/id/vval1ant/
// @version     1.0.1
// @description Steam profile background finder
// @author       VAL1aNT
// @match        *://steamcommunity.com/profiles/*
// @match        *://steamcommunity.com/id/*
// @match        *://steamcommunity.com/market/search*
// @icon         https://steamcommunity.com/favicon.ico
// @connect      steamcommunity.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/372697/SPB%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/372697/SPB%20finder.meta.js
// ==/UserScript==

const THIS_URL = window.location.href;
var IMid = 'na';

if(/steamcommunity\.com\/profiles\/|steamcommunity\.com\/id\//.test(THIS_URL)) {
  console.log("[SPBf] Started");
  var Pmenu = document.getElementById('profile_action_dropdown');
  if(Pmenu) {
    //var Itg = document.getElementsByClassName('profile_background_image_content')[0];
    var Itg = document.getElementsByClassName('has_profile_background')[1];
    if(Itg) {
      var lng = navigator.language || navigator.userLanguage;
      var Txt = 'Найти фон профиля';
      if(lng != 'ru') Txt = 'Find background';
      var APid = Itg.getAttribute('style').replace(/.*items\/(\d+)\/.*/,'$1');
      IMid = Itg.getAttribute('style').replace(/.*items\/\d+\/(.*)\..*/,'$1');
      //console.log("[SPBf] APid:"+APid);
      //console.log("[SPBf] IMid:"+IMid);
      Pmenu = Pmenu.getElementsByClassName('popup_body')[0];
      createTag('popup_menu_item', '<img src="https://steamcommunity-a.akamaihd.net/economy/emoticon/:Teddy_Photo:"> '+Txt,
                'https://steamcommunity.com/market/search?category_753_Game[]=tag_app_'+APid+'&category_753_item_class[]=tag_item_class_3&appid=753&IMid='+IMid, Pmenu);
    }
  }
}

if(/steamcommunity\.com\/market\/search/.test(THIS_URL)) {
  if(/IMid/.test(THIS_URL)) {
    var n = 0;
    var RqTmr = 0;
    IMid = THIS_URL.replace(/.*IMid=(.*)/,'$1');
    //console.log("[SPBf] IMid:"+IMid);
    var BGlist = document.getElementsByClassName('market_listing_row_link');
    for (var i=0; i<BGlist.length; i++) {
      RqTmr = RqTmr + 205;
      //console.log("[SPBf] Url1:"+BGlist[i].getAttribute('href'));
      setTimeout(function(){BGrq(BGlist[n]); n++;}, RqTmr);
    }
  }
}

function BGrq(el) {
  var Url = el.getAttribute('href');
  //console.log("[SPBf] Url2:"+Url);
  GM_xmlhttpRequest({
	  method: "GET",
	  timeout: 10000,
	  url: Url,
	  onload: function(data) {
      var re = new RegExp(IMid);
      if(re.test(data.responseText)) el.getElementsByTagName('div')[0].setAttribute("style", "background-color:#305f30");
		},
		ontimeout: function(data) {
		  console.log("[SPBf] Request Timeout");
		}
	});
}

function createTag(_class, text, href, divTarget) {
	var tag = document.createElement("a");
	tag.setAttribute("target", "_blank");
	tag.setAttribute("class", _class);
	tag.setAttribute("href", href);
	tag.innerHTML = text;
  divTarget.appendChild(tag);
}
