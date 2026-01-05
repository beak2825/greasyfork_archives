// ==UserScript==
// @name        Steamgifts Auto Entry
// @namespace   steamgifts_autoentry
// @description Automatically enters giveaways on steamgifts.com
// @include     http://www.steamgifts.com/
// @version     14.3.5.3
// @grant       GM_getValue
// @grant       GM_setValue
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @require     http://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/13339/Steamgifts%20Auto%20Entry.user.js
// @updateURL https://update.greasyfork.org/scripts/13339/Steamgifts%20Auto%20Entry.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

/* jQuery Storage API Plugin 1.7.4 https://github.com/julien-maurel/jQuery-Storage-API */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof exports?require("jquery"):jQuery)}(function(e){function t(t){var r,i,n,o=arguments.length,s=window[t],a=arguments,u=a[1];if(2>o)throw Error("Minimum 2 arguments must be given");if(e.isArray(u)){i={};for(var f in u){r=u[f];try{i[r]=JSON.parse(s.getItem(r))}catch(c){i[r]=s.getItem(r)}}return i}if(2!=o){try{i=JSON.parse(s.getItem(u))}catch(c){throw new ReferenceError(u+" is not defined in this storage")}for(var f=2;o-1>f;f++)if(i=i[a[f]],void 0===i)throw new ReferenceError([].slice.call(a,1,f+1).join(".")+" is not defined in this storage");if(e.isArray(a[f])){n=i,i={};for(var m in a[f])i[a[f][m]]=n[a[f][m]];return i}return i[a[f]]}try{return JSON.parse(s.getItem(u))}catch(c){return s.getItem(u)}}function r(t){var r,i,n=arguments.length,o=window[t],s=arguments,a=s[1],u=s[2],f={};if(2>n||!e.isPlainObject(a)&&3>n)throw Error("Minimum 3 arguments must be given or second parameter must be an object");if(e.isPlainObject(a)){for(var c in a)r=a[c],e.isPlainObject(r)?o.setItem(c,JSON.stringify(r)):o.setItem(c,r);return a}if(3==n)return"object"==typeof u?o.setItem(a,JSON.stringify(u)):o.setItem(a,u),u;try{i=o.getItem(a),null!=i&&(f=JSON.parse(i))}catch(m){}i=f;for(var c=2;n-2>c;c++)r=s[c],i[r]&&e.isPlainObject(i[r])||(i[r]={}),i=i[r];return i[s[c]]=s[c+1],o.setItem(a,JSON.stringify(f)),f}function i(t){var r,i,n=arguments.length,o=window[t],s=arguments,a=s[1];if(2>n)throw Error("Minimum 2 arguments must be given");if(e.isArray(a)){for(var u in a)o.removeItem(a[u]);return!0}if(2==n)return o.removeItem(a),!0;try{r=i=JSON.parse(o.getItem(a))}catch(f){throw new ReferenceError(a+" is not defined in this storage")}for(var u=2;n-1>u;u++)if(i=i[s[u]],void 0===i)throw new ReferenceError([].slice.call(s,1,u).join(".")+" is not defined in this storage");if(e.isArray(s[u]))for(var c in s[u])delete i[s[u][c]];else delete i[s[u]];return o.setItem(a,JSON.stringify(r)),!0}function n(t,r){var n=a(t);for(var o in n)i(t,n[o]);if(r)for(var o in e.namespaceStorages)u(o)}function o(r){var i=arguments.length,n=arguments,s=(window[r],n[1]);if(1==i)return 0==a(r).length;if(e.isArray(s)){for(var u=0;u<s.length;u++)if(!o(r,s[u]))return!1;return!0}try{var f=t.apply(this,arguments);e.isArray(n[i-1])||(f={totest:f});for(var u in f)if(!(e.isPlainObject(f[u])&&e.isEmptyObject(f[u])||e.isArray(f[u])&&!f[u].length)&&f[u])return!1;return!0}catch(c){return!0}}function s(r){var i=arguments.length,n=arguments,o=(window[r],n[1]);if(2>i)throw Error("Minimum 2 arguments must be given");if(e.isArray(o)){for(var a=0;a<o.length;a++)if(!s(r,o[a]))return!1;return!0}try{var u=t.apply(this,arguments);e.isArray(n[i-1])||(u={totest:u});for(var a in u)if(void 0===u[a]||null===u[a])return!1;return!0}catch(f){return!1}}function a(r){var i=arguments.length,n=window[r],o=arguments,s=(o[1],[]),a={};if(a=i>1?t.apply(this,o):n,a._cookie)for(var u in e.cookie())""!=u&&s.push(u.replace(a._prefix,""));else for(var f in a)s.push(f);return s}function u(t){if(!t||"string"!=typeof t)throw Error("First parameter must be a string");g?(window.localStorage.getItem(t)||window.localStorage.setItem(t,"{}"),window.sessionStorage.getItem(t)||window.sessionStorage.setItem(t,"{}")):(window.localCookieStorage.getItem(t)||window.localCookieStorage.setItem(t,"{}"),window.sessionCookieStorage.getItem(t)||window.sessionCookieStorage.setItem(t,"{}"));var r={localStorage:e.extend({},e.localStorage,{_ns:t}),sessionStorage:e.extend({},e.sessionStorage,{_ns:t})};return e.cookie&&(window.cookieStorage.getItem(t)||window.cookieStorage.setItem(t,"{}"),r.cookieStorage=e.extend({},e.cookieStorage,{_ns:t})),e.namespaceStorages[t]=r,r}function f(e){var t="jsapi";try{return window[e]?(window[e].setItem(t,t),window[e].removeItem(t),!0):!1}catch(r){return!1}}var c="ls_",m="ss_",g=f("localStorage"),l={_type:"",_ns:"",_callMethod:function(e,t){var r=[this._type],t=Array.prototype.slice.call(t),i=t[0];return this._ns&&r.push(this._ns),"string"==typeof i&&-1!==i.indexOf(".")&&(t.shift(),[].unshift.apply(t,i.split("."))),[].push.apply(r,t),e.apply(this,r)},get:function(){return this._callMethod(t,arguments)},set:function(){var t=arguments.length,i=arguments,n=i[0];if(1>t||!e.isPlainObject(n)&&2>t)throw Error("Minimum 2 arguments must be given or first parameter must be an object");if(e.isPlainObject(n)&&this._ns){for(var o in n)r(this._type,this._ns,o,n[o]);return n}var s=this._callMethod(r,i);return this._ns?s[n.split(".")[0]]:s},remove:function(){if(arguments.length<1)throw Error("Minimum 1 argument must be given");return this._callMethod(i,arguments)},removeAll:function(e){return this._ns?(r(this._type,this._ns,{}),!0):n(this._type,e)},isEmpty:function(){return this._callMethod(o,arguments)},isSet:function(){if(arguments.length<1)throw Error("Minimum 1 argument must be given");return this._callMethod(s,arguments)},keys:function(){return this._callMethod(a,arguments)}};if(e.cookie){window.name||(window.name=Math.floor(1e8*Math.random()));var h={_cookie:!0,_prefix:"",_expires:null,_path:null,_domain:null,setItem:function(t,r){e.cookie(this._prefix+t,r,{expires:this._expires,path:this._path,domain:this._domain})},getItem:function(t){return e.cookie(this._prefix+t)},removeItem:function(t){return e.removeCookie(this._prefix+t)},clear:function(){for(var t in e.cookie())""!=t&&(!this._prefix&&-1===t.indexOf(c)&&-1===t.indexOf(m)||this._prefix&&0===t.indexOf(this._prefix))&&e.removeCookie(t)},setExpires:function(e){return this._expires=e,this},setPath:function(e){return this._path=e,this},setDomain:function(e){return this._domain=e,this},setConf:function(e){return e.path&&(this._path=e.path),e.domain&&(this._domain=e.domain),e.expires&&(this._expires=e.expires),this},setDefaultConf:function(){this._path=this._domain=this._expires=null}};g||(window.localCookieStorage=e.extend({},h,{_prefix:c,_expires:3650}),window.sessionCookieStorage=e.extend({},h,{_prefix:m+window.name+"_"})),window.cookieStorage=e.extend({},h),e.cookieStorage=e.extend({},l,{_type:"cookieStorage",setExpires:function(e){return window.cookieStorage.setExpires(e),this},setPath:function(e){return window.cookieStorage.setPath(e),this},setDomain:function(e){return window.cookieStorage.setDomain(e),this},setConf:function(e){return window.cookieStorage.setConf(e),this},setDefaultConf:function(){return window.cookieStorage.setDefaultConf(),this}})}e.initNamespaceStorage=function(e){return u(e)},g?(e.localStorage=e.extend({},l,{_type:"localStorage"}),e.sessionStorage=e.extend({},l,{_type:"sessionStorage"})):(e.localStorage=e.extend({},l,{_type:"localCookieStorage"}),e.sessionStorage=e.extend({},l,{_type:"sessionCookieStorage"})),e.namespaceStorages={},e.removeAllStorages=function(t){e.localStorage.removeAll(t),e.sessionStorage.removeAll(t),e.cookieStorage&&e.cookieStorage.removeAll(t),t||(e.namespaceStorages={})}});

jQuery.fn.center = function () {
    this.css("position","fixed");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}

$.localStorage = new Object();
$.localStorage.isSet = function(a){return (!!GM_getValue(a,false))}
$.localStorage.get = function(a){return JSON.parse(GM_getValue(a,''));}
$.localStorage.set = function(a,b){GM_setValue(a, JSON.stringify(b));}

	

var lowlevel=[["Entered:"],["Too many entries for:"],["Low level to enter:"],[],[]];///////////////////////
var pages = 10;////////////////////////////
var pageslimited = true;
var pagelimittolerance = (200/300);//(5/3); // Keep searching while 300/PAGES*THIS < pointsavailable/pagenum. -1 = disabled // with 1, it would need 300 available point to reach PAGES // with 0.5, would need only 150 to reach PAGES // with 2, would need 600 to reach PAGES
var originalicon = $('*[rel="shortcut icon"')[0].href;
var wonicon = "http://hydra-media.cursecdn.com/lol.gamepedia.com/1/16/Trophy_icon_small.gif?version=94a3286bf5bef7e67faea7f1d2aff5e1";
var timeout=50*60*1000;//
var limitbox = 200; //Limit the number of lines on web console // 0 = no limit // -1 = no web console
var searchparam = '';
if ($('a.nav__button[href*="/account"]').length){ searchparam += '&level_max=' + parseInt($('a.nav__button[href*="/account"]')[0].children[1].title).toString(); }



var gamelist=[];
var minpoints=100;
var enterwishlist=false;
var entergroup=false;
var checktimer;
var sitepattern=new RegExp('https?://.*steamgifts.com');
var siteurl=sitepattern.exec(document.URL.toString());
var pointsavailable=0;
var possibleentries=[];
var enabled=false;

{
	var s=$.localStorage;
	if(s.isSet('games')) {
		gamelist=s.get('games');
	}
	
	for(var i=0; i<gamelist.length-10; i++) {
		gamelist[i].name=gamelist[i].name.trim();
		if(typeof(gamelist[i].maxentries)=="nothing" || $.isNumeric(gamelist[i].maxentries)==false) {
			gamelist[i].maxentries=-1;
		}
	}
	
	if(s.isSet('minpoints')) {
		minpoints=s.get('minpoints');
		if($.isNumeric(minpoints)==false) {
			minpoints=100;
		}
	}
	
	if(s.isSet('enterwishlist') && s.get('enterwishlist')!="undefined") {
		enterwishlist=s.get('enterwishlist');
	}
	
	if(s.isSet('entergroup') && s.get('entergroup')!="undefined") {
		entergroup=s.get('entergroup');
	}
	
}

function log(text) {
	if(window.console && console.log) {
		if(!!text.match(/<\/span>$/)){ /////////////////////////
			console.log(text.split(' <span')[0])
		} else {
			console.log(text);
		}
	}
	if ($('#output').length !== 0 && typeof text === "string"){
		//if (text.match(/\b(X{0,1})(IX|IV|V?I{0,3})\b/gi).filter(Boolean)[0] !== undefined){ text = text.replace(text.match(/\b(X{0,1})(IX|IV|V?I{0,3})\b/gi).filter(Boolean)[0], text.match(/\b(X{0,1})(IX|IV|V?I{0,3})\b/gi).filter(Boolean)[0].toUpperCase()); } //Romanos em maiúsculo
		ltest = text.match(/\/giveaway\/.{5}\/[^\s]+/);
		if (!!ltest){
			text = text.replace(ltest[0], '<a href="http://www.steamgifts.com' + ltest[0].split('/groups')[0] + '" target="_blank" style="color: #0645AD; text-decoration: underline;">' + ltest[0].substring(16).replace(/-/g,' ').replace(/\b./g, function(m){ return m.toUpperCase(); }) + '</a>');
		}
		$('#output').prepend(Date().match(/..:..:../) + ' - ' + text + "<br>");
		if(!!text.match(/^(Entering giveaway|Update done)/)){
			$('#output2').prepend(Date().match(/..:..:../) + ' - ' + text + "<br>");
		}
		if(limitbox > 0){
			output = $('#output')[0].innerHTML;
			if (output.split('<br>').length > limitbox+1){
				$('#output')[0].innerHTML = output.substr(0,output.indexOf(output.split('<br>')[limitbox]));
				output2 = $('#output2')[0].innerHTML;
				if (output2.split('<br>').length > limitbox+1){ $('#output2')[0].innerHTML = output2.substr(0,output2.indexOf(output2.split('<br>')[limitbox])); }
			}
		}
	}//////////////////////////////////////////////////////////////////////
}

function doentry(resp) {
	var submitted=false;
	$('#hiddeniframe').unbind('load');
	if($('#hiddeniframe').contents().find('.sidebar .sidebar__error').length==0 && $('#hiddeniframe').contents().find('.sidebar form').length>0 && $('#hiddeniframe').contents().find('.sidebar form').html().indexOf('Enter Giveaway')>=0) {
		if ($('.page__description .markdown--resize-body', $('#hiddeniframe').contents()).length > 0){
			log('Entering giveaway ' + $('#hiddeniframe').contents().find('a[href^="/giveaway/"]').attr('href') + ' <span title="' + $('.page__description .markdown--resize-body', $('#hiddeniframe').contents())[0].innerHTML.replace(/<[^>]*>/g, "").replace(/^\s*[\r\n]/gm, '').replace(/"/g,"''") + '" style="background-color: yellow;">COMMENT</span>');/////////////////////////////
			lowlevel[0].push(["http://www.steamgifts.com" + $('#hiddeniframe').contents().find('a[href^="/giveaway/"]').attr('href'), $('.page__description .markdown--resize-body', $('#hiddeniframe').contents())[0].innerHTML.replace(/<[^>]*>/g, "")]);
		} else {
			log('Entering giveaway ' + $('#hiddeniframe').contents().find('a[href^="/giveaway/"]').attr('href'));/////////////////////////////
			lowlevel[0].push($('#hiddeniframe').contents().find('a[href^="/giveaway/"]').attr('href'));
		}
		$('#hiddeniframe').contents().find('.sidebar .sidebar__entry-insert').click();
		submitted=true;
	}

	if(submitted==true) {
		// 10 second delay to give .click() time to submit form
		setTimeout(startnextentry,10000);
	} else {
		if($('#hiddeniframe').contents().find('.nav__right-container').length>0) {
			var pointregex=new RegExp("Account(?:[^>]*?)>(\\d+)<","gm");
			var pointarr=pointregex.exec($('#hiddeniframe').contents().find('.nav__right-container').html());
			if(pointarr!=null && pointarr.length==2) {
				pointsavailable=pointarr[1];
			}
		}
		$('a.nav__button[href*="/account"]')[0].children[0].innerHTML = pointsavailable;////////////////////
		log('Unable to enter giveaway, pointsavailable='+pointsavailable);

		startnextentry();
	}
}

function startnextentry() {
	if(possibleentries.length>0) {
		for(var ei=0; ei<possibleentries.length; ei++) {
			if((possibleentries[ei].force==true) && (pointsavailable-possibleentries[ei].points)>=minpoints) {

				if($('#hiddeniframe').length==0) {
					$('.footer__outer-wrap').append('<iframe id="hiddeniframe"></iframe>');
				}
				$('#hiddeniframe').hide();
				$('#hiddeniframe').load(doentry);
				$('#hiddeniframe').attr('src',siteurl+possibleentries[ei].url);

				pointsavailable-=possibleentries[ei].points;
				$('a.nav__button[href*="/account"]')[0].children[0].innerHTML = pointsavailable;////////////////////
				possibleentries.splice(ei,1);
				return;
			}
		}
		for(var ti=0; ti<gamelist.length; ti++) {
			for(var ei=0; ei<possibleentries.length; ei++) {
				var rematch=new RegExp(gamelist[ti].name,"i").test(possibleentries[ei].name);
				if((gamelist[ti].name==possibleentries[ei].name || rematch==true) && (pointsavailable-possibleentries[ei].points)>=minpoints) {	

					if($('#hiddeniframe').length==0) {
						$('.footer__outer-wrap').append('<iframe id="hiddeniframe"></iframe>');
					}
					$('#hiddeniframe').hide();
					$('#hiddeniframe').load(doentry);
					$('#hiddeniframe').attr('src',siteurl+possibleentries[ei].url);

					pointsavailable-=possibleentries[ei].points;
					$('a.nav__button[href*="/account"]')[0].children[0].innerHTML = pointsavailable;////////////////////
					possibleentries.splice(ei,1);
					return;
				}
			}
		}
	}
	// done with this update
	// start the timer again for the next series of updates
	//if (timeout>600000 && (!pageslimited && pointsavailable >= 270) || (pageslimited && ((pagelimittolerance === -1 && pointsavailable >= 270) || (pagelimittolerance < 1 && pointsavailable>=Math.max(200,(300*pagelimittolerance))) || (pagelimittolerance >= 1 && pointsavailable >= 270)))){
	if (timeout>600000 && (!pageslimited && pointsavailable >= 250) || (pageslimited && ((pagelimittolerance === -1 && pointsavailable >= 250) || (pagelimittolerance < 1 && pointsavailable>=Math.max(250,(300*pagelimittolerance))) || (pagelimittolerance >= 1 && pointsavailable >= 250)))){
		console.log("Timer changed to 10m");
		checktimer=setTimeout(startupdate,600000);
		log('Update done (next in 10m)');
	} else {
		if (pointsavailable >= 200 && (timeout/60000) >= 50){ timeoutb = (timeout - ((timeout-600000)/2)); } else { timeoutb = timeout; } //////////////////////////////////////////////////
		checktimer=setTimeout(startupdate,timeoutb);
		log('Update done (next in ' + timeoutb/60000 + 'm)');
	}
	
	//console.log('Level not high enough:');///////////////////////////
	lowlevel[3] = $.unique(lowlevel[3].sort());
	lowlevel[3].unshift("Could enter:");
	lowlevel[4] = $.unique(lowlevel[4].sort())
	lowlevel[4].unshift("Can enter:");
	console.log(lowlevel);//////////////////////////////
	lowlevel[0] = ["Entered:"];/////////////////////////
	lowlevel[1] = ["Too many entries for:"];//////////////////////
	lowlevel[2] = ["Low level to enter:"];///////////////////////
	lowlevel[3] = [];/////////////////////
	lowlevel[4] = [];////////////////////
	//log('Update done');
	
}

function startpagerequest(pagenum) {
	log('Starting request for page '+pagenum.toString());
	var pageurl;
	if(pagenum=='wishlist' || pagenum=='group') {
		pageurl=siteurl+'/giveaways/search?type='+pagenum;
	} else {
		pageurl=siteurl+'/giveaways/search?page='+pagenum.toString()+'&status=open' + searchparam;
	}
	jQuery.ajax({method: "GET",
	url: pageurl,
	success: backgroundpageload(pagenum),
	error: loadfailure(pagenum)
	});
}

function backgroundpageload(pagenum) {
	return function(resp) {
		
		$('div.nav__right-container:first a.nav__button[href*="/giveaways/created"]:first')[0].innerHTML = $('div.nav__right-container:first a.nav__button[href*="/giveaways/created"]:first', resp)[0].innerHTML;
		$('div.nav__right-container:first a.nav__button[href*="/giveaways/won"]:first')[0].innerHTML = $('div.nav__right-container:first a.nav__button[href*="/giveaways/won"]:first', resp)[0].innerHTML;
		$('div.nav__right-container:first a.nav__button[href*="/messages"]:first')[0].innerHTML = $('div.nav__right-container:first a.nav__button[href*="/messages"]:first', resp)[0].innerHTML;
		$(".nav__points:first").text($(".nav__points:first",resp).text());
		//$('div.nav__right-container:first a.nav__button[href*="/account"]:first')[0].outerHTML = $('div.nav__right-container:first a.nav__button[href*="/account"]:first', $(resp))[0].outerHTML;
		//$('.nav__right-container')[0].innerHTML = $('.nav__right-container', $(resp))[0].innerHTML; ///////////////////////////////////////////////////////////////////////
		
		//////////////////////////////////////////////////////////////////////////////////////////////// ICON ////////		
		if(pagenum===1){
			if ($('.nav__button[title="Giveaways Won"]')[0].text !== ""){
				$('*[rel="shortcut icon"')[0].href = wonicon;
			} else {
				$('*[rel="shortcut icon"')[0].href = originalicon;
			}		
		} //////////////////////////////////////////////////////////////////////////////////////////////// ICON ////////

		entries=$(resp).find('.giveaway__row-outer-wrap');
		
		if(typeof(entries)!="undefined" && typeof(entries.length)!="undefined") {
			$(entries).each(function() {
				// skip class is-faded because we've already entered them
				if($(this).find('.giveaway__row-inner-wrap').hasClass('is-faded')==false) {
					var ok=true;
					var contrib=$(this).find('.contributor_only');
					if(contrib.length>0) {
						if($(contrib).hasClass('green')==false) {
							ok=false;
						}
					}
					var levelok=!($(this).find('.giveaway__column--contributor-level--negative').length>0);
					if(levelok==false) {
						//log('Level not high enough');
						if (gamelist.map(function(el) { return el.name; }).indexOf($(this).find('.giveaway__heading__name').text()) != -1){///////////////////////////
							log('Level not high enough for ' + $(this).find('a[href^="/giveaway/"]').attr('href') +' (' + $(this).find('.giveaway__column--contributor-level--negative')[0].textContent + ')');//////////////////
							lowlevel[2].push($(this).find('.giveaway__column--contributor-level--negative')[0].textContent + ': ' + $(this).find('.giveaway__heading__name').text());////////////////////////////////////
						} else lowlevel[3].push($(this).find('.giveaway__column--contributor-level--negative')[0].textContent + ': ' + $(this).find('.giveaway__heading__name').text());////////////////////////////////////
						ok=false;
					}
					//var name=$(this).find('.title').find('a[href^="/giveaway/"]').text();
					var name=$(this).find('.giveaway__heading__name').text();
					var nameonlink=$(this).find('.giveaway__heading__name')[0].href.split('/giveaway/')[1].substr(6).replace(/-/g,'');
					//var gameidx=gamelist.map(function(el) { if (el.name.slice(-1) !== "|"){ return el.name; } else return ""; }).indexOf(name);
					//var gameidx=gamelist.map(function(el) { return el.name; }).indexOf(name);
					var gameidx=-1;
					if(gameidx<0 && levelok==true) {
						for(var gi=0; gi<gamelist.length && gameidx<0; gi++) {
							var gamelistname = gamelist[gi].name;
							if(gamelistname.slice(-1) === '|'){////////////////////////////////////
								if(RegExp(gamelistname.slice(0,-1),"i").test(name)==true) {/////////////////////////////@
									gameidx=gi;
									log('Matched regex (' + gamelistname.slice(0,-1) + ')');
								} else if (RegExp(gamelistname.slice(0,-1).replace(/[^a-zA-Z0-9\^\$]/g, ''),"i").test(nameonlink)==true){
									gameidx=gi;
									log('Matched regex on link (' + gamelistname.slice(0,-1) + ')');
								}
							} else if(gamelistname == name){
								gameidx=gi;
							} else if (gamelistname.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() == nameonlink){
								gameidx=gi;
								log('Matched title on link (' + gamelistname + ')');
							} ///////////////////////////////////////
						}
						//for(var gi=0; gi<gamelist.length && gameidx<0; gi++) {
							//if(RegExp(gamelist[gi].name,"i").test(name)==true) {
								//gameidx=gi;
								//log('Matched regex');
							//}
						//}
						if(gameidx<0) {
							ok=false;
							if(levelok==true){/////////////////////
								if($(this).find('.giveaway__column--contributor-level--negative').length>0){ lvl = " (" + $(this).find('.giveaway__column--contributor-level--negative')[0].textContent + ")"; } else if ($(this).find('.giveaway__column--contributor-level--positive').length>0){ lvl = " (" + $(this).find('.giveaway__column--contributor-level--positive')[0].textContent + ")"; } else { lvl = ""; }/////////////
								lowlevel[4].push(name + lvl);////////////////////////////////////////////////
							}////////////////////
						}
					}
					var pointsregex=new RegExp("\\((\\d+)P\\)");
					var arr=pointsregex.exec($(this).find('.giveaway__heading').html());
					var entriesregex=new RegExp("(\\d+) entr");
					// remove , from string because it's used as a thousand separator
					var earr=entriesregex.exec($(this).find('.giveaway__links a').html().replace(',',''));
					
					//////////////////////////////////////////////////////////////////////////////////////////////////////////
					copiestest = $('.giveaway__heading__thin', $(this)).html().match("(\\d+) Copies");
					if(copiestest !== null){
						entriespercopy = parseInt(parseInt(earr[1])/parseInt(copiestest[1]));
					} else {
						entriespercopy = parseInt(earr[1]);
					}
					//////////////////////////////////////////////////////////////////////////////////////////////////////////
					
					if(ok==true && earr!=null && earr.length==2) {
						if(gamelist[gameidx].maxentries!="nothing" && gamelist[gameidx].maxentries!=-1 && parseInt(gamelist[gameidx].maxentries)<entriespercopy) {
							ok=false;
							text = gamelist[gameidx].maxentries;
							if (copiestest !== null){ text += "*" + parseInt(copiestest[1]); }
							log('Too many entries for '+$(this).find('a[href^="/giveaway/"]').attr('href') + ' (' + parseInt(earr[1]) + '/' + text + ')');////////////////////////////////
							lowlevel[1].push([$(this).find('.giveaway__heading__name').text() + " (" + entriespercopy + "/" + text + ")", "http://www.steamgifts.com" + $(this).find('a[href^="/giveaway/"]').attr('href')]);////////////////////////////////////////////////////////////////////////
						}
					}
					
					if(levelok==true && (ok==true || pagenum=='wishlist' || pagenum=='group')) {
						var thisurl=$(this).find('a[href^="/giveaway/"]').attr('href');
						var haveurl=false;
						for(var ei=0; ei<possibleentries.length; ei++) {
							if(possibleentries[ei].url==thisurl) {
								haveurl=true;
							}
						}
						if(haveurl==false) {
							possibleentries.length+=1;
							possibleentries[possibleentries.length-1]={};
							possibleentries[possibleentries.length-1].url=thisurl;
							possibleentries[possibleentries.length-1].name=name;
							possibleentries[possibleentries.length-1].points=arr[1];
							possibleentries[possibleentries.length-1].force=(pagenum=='wishlist' || pagenum=='group');
							log('Adding possible entry '+possibleentries[possibleentries.length-1].url+'  points='+possibleentries[possibleentries.length-1].points+'  '+possibleentries.length);
						}
					}
				}
			});
		}
		
		var pointregex=new RegExp("Account(?:[^>]*?)>(\\d+)<","gm");
		var pointarr=pointregex.exec(resp);
		if(pointarr!=null && pointarr.length==2) {
			pointsavailable=pointarr[1];
		}
		
		if(pagenum=='wishlist') {
			if(entergroup==true) {
				startpagerequest('group');
				return;
			}
			pagenum=0;
		}
		
		if(pagenum=='group') {
			pagenum=0;
		}

		if (pageslimited){
			if (timeout/1000/60 >= 1 &&  timeout/1000/60 <= 60){
				timeoflastga = $('span:last', $('div i.fa.fa-clock-o:last', $(resp)).parent(), $(resp)).last()[0].textContent;
				if (timeoflastga.split(' minutes').length === 2){
					if(timeout/1000/60 <= parseInt(timeoflastga.split(' minutes')[0])){
						if (pagelimittolerance === -1){ log('Page request ended ' + parseInt(timeoflastga.split(' minutes')[0]) + 'm>=' + (timeout/1000/60) + "m"); } else if (pagenum<pages){ if ((parseInt(pointsavailable)/(pagenum+1)).toFixed()>=(300/pages*pagelimittolerance)){ startpagerequest(pagenum+1); return; } else { log('Page request ended ' + parseInt(timeoflastga.split(' minutes')[0]) + 'm>=' + (timeout/1000/60) + "m " + (300/pages*pagelimittolerance) + ">=" + (parseInt(pointsavailable)/(pagenum+1)).toFixed()); } }
					} else if(pagenum<pages) { startpagerequest(pagenum+1); return; }
				} else if (pagelimittolerance === -1){ log('Page request ended ' + parseInt(timeoflastga.split(' minutes')[0])*60 + 'm>=' + (timeout/1000/60) + "m"); } else if (pagenum<pages){ if ((parseInt(pointsavailable)/(pagenum+1)).toFixed()>=(300/pages*pagelimittolerance)){ startpagerequest(pagenum+1); return; } else { log('Page request ended ' + parseInt(timeoflastga.split(' minutes')[0])*60 + 'm>=' + (timeout/1000/60) + "m " + (300/pages*pagelimittolerance) + ">=" + (parseInt(pointsavailable)/(pagenum+1)).toFixed()); } }
			} else if(pagenum<pages) { startpagerequest(pagenum+1); return; }
		} else if(pagenum<pages) { startpagerequest(pagenum+1); return; }
		
		log('Points Available='+pointsavailable);
		$('a.nav__button[href*="/account"]')[0].children[0].innerHTML = pointsavailable;/////////////////////////////
		startnextentry();
		
	}
}

function loadfailure(pagenum) {
	return function(resp) {
	
		if(pagenum=='wishlist') {
			if(entergroup==true) {
				startpagerequest('group');
				return;
			}
			pagenum=0;
		}
			
		if(pagenum=='group') {
			pagenum=0;
		}
		
		if(pagenum<pages) {
			startpagerequest(pagenum+1);
			return;
		}
		// done with this update
		// start the timer again for the next series of updates
		checktimer=setTimeout(startupdate,timeout);
	}
}

function startupdate() {
	pointsavailable=0;
	possibleentries=[];
	if(enterwishlist==true) {
		startpagerequest('wishlist');
	} else if(entergroup==true) {
		startpagerequest('group');
	} else {
		startpagerequest(1);
	}
}

function startautoentry(event) {
	if(typeof(checktimeout)!="undefined") {
		clearTimeout(checktimeout);
	}
	checktimer=setTimeout(startupdate,2000);
}

function stopautoentry(event) {
	clearTimeout(checktimer);
}

function getgameli(game) {
	var li=$('<li style="cursor:grab;"></li>');
	var span=$('<span class="gamename" style="display:inline-block;width:350px;text-overflow:ellipsis;margin-right:10px;"></span>');
	li.append(span);
	span.text(game.name);
	span=$('<span class="maxentries" style="display:inline-block;width:40px;margin-right:10px;"></span>');
	li.append(span);
	span.text(game.maxentries);
	
	var removelink=$('<a style="cursor:pointer;">Remove</a>');
	removelink.click(function() { $(this).parent().remove(); });
	li.append(removelink);
	return li;
}

function createsettingsdiv() {
	var outerdiv=$('<div id="autoentrysettingsdiv" style="position:absolute;width:500px;height:500px;background-color:#ffffff;display:none;border:1px solid;border-radius:4px;color:#6d7c87;font-size:11px;font-weight:bold;padding:5px 10px;"></div>');
	outerdiv.append('<h2 style="text-align:center;color:#4f565a;">Auto Entry Settings</h2>');
	outerdiv.append('<h3 style="color:#4f565a;">Games</h3><i>Reorder the list to have your most wanted games at the top</i>');
	outerdiv.append('<div id="gamelist" style="height:350px;overflow-y:scroll;"></div>');
	outerdiv.find('#gamelist').append('<span style="display:inline-block;width:350px;text-overflow:ellipsis;margin-right:10px;color:#4f565a;">Game</span>');
	outerdiv.find('#gamelist').append('<span style="display:inline-block;width:40px;text-overflow:ellipsis;margin-right:10px;color:#4f565a;">Max Entries</span>');
	var ul=$('<ul id="autoentrygameul"></ul>');
	outerdiv.find('#gamelist').append(ul);
	
	for(var i=0; i<gamelist.length; i++) {
		ul.append(getgameli(gamelist[i]));
	}
	ul.sortable();
	ul.disableSelection();
	var addgamediv=$('<div id="addgame"><input type="input" id="addgamename" style="width:350px;margin-right:6px;padding:0px;" title="The full name of the game as it appears on steamgifts.com"><input type="input" id="addgamemaxentries" style="width:40px;margin-right:6px;padding:0px;" title="Giveaways for this game will be entered as long as the number of existing entries is equal to or fewer than this.  Use -1 to always enter giveaways regardless of the number of entries."></div>');

	var addgamelink=$('<a style="cursor:pointer;">Add</a>');
	addgamelink.click(function() {
		var game={};
		game.name=$('#addgamename').val().trim();
		game.maxentries=$('#addgamemaxentries').val();
		
		if(game.name=='' || game.maxentries=='') {
			alert('You must enter a game name and maximum entries');
			return;
		}
		
		if($.isNumeric(game.maxentries)==false) {
			alert('Maximum entries must be a number');
			return;
		}

		var exists=false;
		var existingli=null;
		$('#gamelist ul li').each(function() {
			if($(this).find('.gamename').text()==game.name) {
				exists=true;
				existingli=$(this);
			}
		});
		
		if(exists==true) {
			$(existingli).find('.maxentries').text(game.maxentries);
			alert('This game was already in the list and was replaced with your new settings');
		}
		else {
			$('#gamelist').find('ul').append(getgameli(game));
		}
		$('#addgamename').val('');
		$('#addgamemaxentries').val('');
	});
	addgamediv.append(addgamelink);
	outerdiv.append(addgamediv);
	
	outerdiv.append('Min Points <input type="text" id="autoentryminpoints" pattern="\\d+" style="width:30px; padding:0px;" title="Giveaways will only be entered as long as your points available will remain at or above this number.  This allows you to have a spare pool of points to manually enter giveaways.">');
	outerdiv.append('<br />');	
	outerdiv.append('<input type="checkbox" name="autoentryenterwishlist" id="autoentryenterwishlist" style="width:15px;vertical-align:top;">Enter any wishlist giveaways<br />');
	outerdiv.append('<input type="checkbox" name="autoentryentergroup" id="autoentryentergroup" style="width:15px;vertical-align:top;">Enter any group giveaways<br />');
	var center=$('<center></center>');
	outerdiv.append(center);
	var savebutton=$('<button>Save</button>');
	center.append(savebutton);
	savebutton.click(function() { 
		$('#autoentrysettingsdiv').slideUp();
		var storage=$.localStorage;
		
		gamelist=[];
		$('#gamelist ul li').each(function() {
			gamelist.push({name:$(this).find('.gamename').text(),maxentries:$(this).find('.maxentries').text()});
		});
		
		storage.set('games',gamelist);
		if($.isNumeric($('#autoentryminpoints').val())==true) {
			minpoints=$('#autoentryminpoints').val();
			storage.set('minpoints',minpoints);
		}
		enterwishlist=$('#autoentryenterwishlist').prop("checked");
		storage.set('enterwishlist',enterwishlist);
		entergroup=$('#autoentryentergroup').prop("checked");
		storage.set('entergroup',entergroup);
	});
	
	var closebutton=$('<button>Close</button>');
	center.append(' ');
	center.append(closebutton);
	closebutton.click(function() {
		$('#autoentrysettingsdiv').slideUp();
	});
	
	return outerdiv;
}

function createhelpdiv() {
	var outerdiv=$('<div id="autoentryhelpdiv" style="position:absolute;width:650px;height:550px;background-color:#ffffff;display:none;border:1px solid;border-radius:4px;color:#6d7c87;font-size:11px;font-weight:bold;padding:5px 10px;"></div>');
	outerdiv.append('<h2 style="text-align:center;">Help</h2>');
	outerdiv.append('<br />');
	var innerdiv=$('<div style="line-height:1.3em;">');
	outerdiv.append(innerdiv);
	innerdiv.append('How to use the Auto Entry feature<br /><br />');
	innerdiv.append('You must be logged into steamgifts.com to use the Auto Entry feature.  All setup must be done on the Settings page under the Auto Entry menu<br /><br />');
	innerdiv.append('First add the games you want to automatically enter.  To do this you need to enter either the name of the game as it appears on steamgifts.com or a regular expression, as well as the maximum number of entries a giveaway can have before the auto entry will skip over it.  The maximum entries is only checked when entering giveaways.  Once you are entered in a giveaway it will not remove the entry if the number of entries goes over the maximum at a later time.  You can enter -1 here to always enter giveaways for that game.<br /><br />');
	innerdiv.append('As you add games they will show up in the list.  You can drag and drop games to rearrange them.  Games at the top of the list will be entered first and therefore use up points first, so keep your most wanted games at the top of the list.<br /><br />');
	innerdiv.append('If you select enter any wishlist giveaways the games on your wishlist will be entered first, before all other entries if points are available.  This is for ANY game in your wishlist, not just those games you\'ve added to the auto entry list.  Likewise if you select enter group giveaways, the giveaways for groups you are a member of will be entered second.  Only after these entries are made will entries for the games in your auto entry list be considered.<br /><br />');
	innerdiv.append('You must also enter the minimum number of points that the auto entry system will leave for you.  The auto entry system will not enter a giveaway if your points available would go below this number.  This will give you a pool of unused points so you can manually enter giveaways that you want.<br /><br />');
	innerdiv.append('After you have made any changes in the Settings page, you need to click the Save button to save those changes.<br /><br />');
	innerdiv.append('Enable the auto entry system by clicking the Disabled link under the Auto Entry menu.  When the auto entry system is running the link will change to Enabled.  Clicking it when Enabled will disable it.<br /><br />');
	innerdiv.append('When the auto entry system is enabled it will attempt to enter giveaways for games in your list every 10 minutes.  It will check for giveaways on the first 10 pages of games as listed on steamgifts.com.<br /><br />');
	innerdiv.append('Only enable the auto entry system in a single browser tab.  Once the system is enabled you should leave that browser tab alone and use another tab if you want to browse steamgifts.com.<br /><br />');
	innerdiv.append('Bitcoin Donations Appreciated : 1SGiftfrNtDfThSykhB8yDZYTJPHF59hH');
	var closebutton=$('<center><button>Close</button></center>');
	outerdiv.append(closebutton);
	closebutton.click(function() {
		$('#autoentryhelpdiv').slideUp();
	});
	
	return outerdiv;
}

function createbackuprestorediv() {
	var outerdiv=$('<div id="autoentrybackuprestorediv" style="position:absolute;width:500px;height:380px;background-color:#ffffff;display:none;border:1px solid;border-radius:4px;color:#6d7c87;font-size:11px;font-weight:bold;padding:5px 10px;"></div>');
	outerdiv.append('The settings for Auto Entry are saved in your browser\'s local storage.  This might get cleared periodically by the browser or addons, or when you manually clear your browser cache.  You can manually save and restore your settings below should the need arise.<br /><br />');
	outerdiv.append('Backup Settings - <i>Copy this text and save it.  You can use this text to restore your Auto Entry settings later should they become lost or to transfer them to another computer.</i>');
	outerdiv.append('<textarea id="autoentrybackupjson" readonly style="height:100px;max-height:100px;"></textarea>');
	outerdiv.append('<br /><br />');
	outerdiv.append('Restore Settings - <i>Paste settings that you\'ve previously saved to restore them.  This will overwrite any settings you currently have.</i>');
	outerdiv.append('<textarea id="autoentryrestorejson" style="height:100px;max-height:100px;"></textarea>');
	var restorebutton=$('<center><button>Restore</button></center>');
	outerdiv.append(restorebutton);
	restorebutton.click(function() {
		if($('#autoentryrestorejson').val()=='') {
			alert('You must paste your settings first');
		}
		var settingsobj={};
		try {
			settingsobj=JSON.parse($('#autoentryrestorejson').val());
		} catch(e) {
			alert('Invalid settings to restore.  '+e.message);
			return false;
		}
		if(settingsobj==null || typeof(settingsobj)=="undefined") {
			alert('Invalid settings to restore');
			return false;
		}
		
		if(typeof(settingsobj.version)=="undefined" || typeof(settingsobj.gamelist)=="undefined" || typeof(settingsobj.minpoints)=="undefined") {
			alert('The settings you are trying to restore are invalid');
			return false;
		} else if(settingsobj.version==2 && (typeof(settingsobj.enterwishlist)=="undefined" || typeof(settingsobj.entergroup)=="undefined")) {
			alert('The settings you are trying to restore are invalid');
			return false;
		}
		
		if(settingsobj.version>=1) {
			gamelist=settingsobj.gamelist;
			minpoints=settingsobj.minpoints;
		}
		if(settingsobj.version>=2) {
			enterwishlist=settingsobj.enterwishlist;
			entergroup=settingsobj.entergroup;
		}
		
		$('#autoentryrestorejson').val('');
		alert('Settings restored in memory.  Save the settings to permanently store them.');
	});
	outerdiv.append('<br />');
	var closebutton=$('<center><button>Close</button></center>');
	outerdiv.append(closebutton);
	closebutton.click(function() {
		$('#autoentrybackuprestorediv').slideUp();
	});
	
	return outerdiv
}

$(document).ready(function() {

	if($('.nav__left-container').length>0) {
		$('body').append(createsettingsdiv());
		$('body').append(createhelpdiv());
		$('body').append(createbackuprestorediv());

		// change to icon-green when enabled and icon-red when disabled
		// fa-toggle-off - fa-toggle-on
		
		var cont=$('nav .nav__left-container').append('\
		<div id="autoentrybuttoncontainer" class="nav__button-container">\
			<div class="nav__relative-dropdown is-hidden">\
				<div class="nav__absolute-dropdown">\
					<a class="nav__row" id="autoentryenabled" style="cursor:pointer;">\
						<i class="icon-red fa fa-fw fa-toggle-off"></i>\
						<div class="nav__row__summary">\
							<p class="nav__row__summary__name">Disabled</p>\
							<p class="nav__row__summary__description">Auto Entry currently disabled</p>\
						</div>\
					</a>\
					<a class="nav__row" id="autoentrysettings" style="cursor:pointer;">\
						<i class="icon-grey fa fa-fw fa-pencil-square-o"></i>\
						<div class="nav__row__summary">\
							<p class="nav__row__summary__name">Settings</p>\
							<p class="nav__row__summary__description">Auto Entry settings</p>\
						</div>\
					</a>\
					<a class="nav__row" id="autoentrybackuprestore" style="cursor:pointer;">\
						<i class="icon-grey fa fa-fw fa-save"></i>\
						<div class="nav__row_summary">\
							<p class="nav__row__summary__name">Backup/Restore</p>\
							<p class="nav__row__summary__description">Manually backup or restore settings</p>\
						</div>\
					</a>\
					<a class="nav__row" id="autoentryhelp" style="cursor:pointer;">\
						<i class="icon-grey fa fa-fw fa-question-circle"></i>\
						<div class="nav__row_summary">\
							<p class="nav__row__summary__name">Help</p>\
							<p class="nav__row__summary__description">Auto Entry help</p>\
						</div>\
					</a>\
				</div>\
			</div>\
			<span class="nav__button nav__button--is-dropdown" id="autoentrymainbutton">Auto Entry <i class="icon-red fa fa-fw fa-minus"></i></span>\
			<div class="nav__button nav__button--is-dropdown-arrow">\
				<i class="fa fa-angle-down"></i>\
			</div>\
		</div>');
		
		cont.find('#autoentrybuttoncontainer .nav__button--is-dropdown-arrow').click(function(e){
			var t=$(this).hasClass("is-selected");
			$("nav .nav__button").removeClass("is-selected");
			$("nav .nav__relative-dropdown").addClass("is-hidden");
			if(!t) {
				$(this).addClass("is-selected").siblings(".nav__relative-dropdown").removeClass("is-hidden");
			}
			e.stopPropagation();
			}
		);
		
		$('#autoentrymenu').click(function() {
			$(this).parent().siblings().removeClass('open');
			$(this).parent().siblings().children('.relative-dropdown').children('.absolute-dropdown').hide();
			$(this).parent().addClass('open');
			$(this).siblings('.relative-dropdown').children('.absolute-dropdown').show();
			return false;
		});
		$('#autoentryenabled, #autoentrymainbutton').click(function() {
			if(enabled==false) {
				$("#autoentryenabled i").removeClass("icon-red");
				$("#autoentryenabled i").addClass("icon-green");
				$("#autoentryenabled i").removeClass("fa-toggle-off");
				$("#autoentryenabled i").addClass("fa-toggle-on");
				$('#autoentryenabled .nav__row__summary__name').text('Enabled');
				$('#autoentryenabled .nav__row__summary__description').text('Auto Entry currently enabled');
				$('#autoentrymainbutton i').removeClass("icon-red");
				$('#autoentrymainbutton i').addClass("icon-green");
				$('#autoentrymainbutton i').removeClass("fa-minus");
				$('#autoentrymainbutton i').addClass("fa-check");
				if (limitbox !== -1 && $('#output').length === 0){ $('.featured__container')[0].remove(); $('.widget-container')[0].style.height = (window.innerHeight - 134) + "px"; $('.widget-container > div:not(:first-child)')[0].outerHTML = '<div style="background-color: rgb(255, 255, 255); overflow-y: auto;"><span id="output" style="height: auto;"></span></div><div style="background-color: rgb(255, 255, 255); overflow-y: auto;"><span id="output2" style="height: auto;"></span></div>'; } //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				startautoentry();
				enabled=true;
			}
			else {
				$("#autoentryenabled i").removeClass("icon-green");
				$("#autoentryenabled i").addClass("icon-red");
				$("#autoentryenabled i").removeClass("fa-toggle-on");
				$("#autoentryenabled i").addClass("fa-toggle-off");
				$('#autoentryenabled .nav__row__summary__name').text('Disabled');
				$('#autoentryenabled .nav__row__summary__description').text('Auto Entry currently disabled');
				$('#autoentrymainbutton i').removeClass("icon-green");
				$('#autoentrymainbutton i').addClass("icon-red");
				$('#autoentrymainbutton i').removeClass("fa-check");
				$('#autoentrymainbutton i').addClass("fa-minus");
				stopautoentry();
				enabled=false;
			}
			return false; 
		});
		$('#autoentrysettings').click(function() { 
			$("nav .nav__button").removeClass("is-selected");
			$("nav .nav__relative-dropdown").addClass("is-hidden");
			$('#autoentrysettingsdiv').center();
			$('#autoentrysettingsdiv').slideDown();
			
			var ul=$('#autoentrygameul');
			ul.empty();
			for(var i=0; i<gamelist.length; i++) {
				ul.append(getgameli(gamelist[i]));
			}
			ul.sortable();
			ul.disableSelection();
			$('#autoentryminpoints').val(minpoints);
			$('#autoentryenterwishlist').prop("checked",enterwishlist);
			$('#autoentryentergroup').prop("checked",entergroup);
			return false;
		});
		$('#autoentrybackuprestore').click(function() {
			$("nav .nav__button").removeClass("is-selected");
			$("nav .nav__relative-dropdown").addClass("is-hidden");
			$('#autoentrybackuprestorediv').center();
			$('#autoentrybackuprestorediv').slideDown();
			var savedsettings={};
			savedsettings.version=2;
			savedsettings.gamelist=gamelist;
			savedsettings.minpoints=minpoints;
			savedsettings.enterwishlist=enterwishlist;
			savedsettings.entergroup=entergroup;
			$('#autoentrybackupjson').val(JSON.stringify(savedsettings));
			return false;
		});
		$('#autoentryhelp').click(function() {
			$("nav .nav__button").removeClass("is-selected");
			$("nav .nav__relative-dropdown").addClass("is-hidden");
			$('#autoentryhelpdiv').center();
			$('#autoentryhelpdiv').slideDown();
			return false;
		});
	};

});
