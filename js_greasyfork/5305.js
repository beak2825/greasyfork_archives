// ==UserScript==
// @name        Steamgifts Auto Entry
// @namespace   steamgifts_autoentry
// @description Automatically enters giveaways on steamgifts.com
// @include     /https?://www.steamgifts.com//
// @version     26
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @require     http://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @compatible  firefox
// @contributionURL bitcoin:1SGiftfrNtDfThSykhB8yDZYTJPHF59hH
// @downloadURL https://update.greasyfork.org/scripts/5305/Steamgifts%20Auto%20Entry.user.js
// @updateURL https://update.greasyfork.org/scripts/5305/Steamgifts%20Auto%20Entry.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

/*
 * JS Storage Plugin
 *
 * Copyright (c) 2016 Julien Maurel
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 * https://github.com/julien-maurel/js-storage
 *
 * Version: 1.0.2
 */
!function(e){var t=!1;if("function"==typeof define&&define.amd&&(define(e),t=!0),"object"==typeof exports&&(module.exports=e(),t=!0),!t){var r=window.Storages,o=window.Storages=e();o.noConflict=function(){return window.Storages=r,o}}}(function(){function e(){var e,t,r,o,n,i=this._type,s=arguments.length,a=window[i],f=arguments,c=f[0];if(1>s)throw new Error("Minimum 1 argument must be given");if(Array.isArray(c)){t={};for(o in c)if(c.hasOwnProperty(o)){e=c[o];try{t[e]=JSON.parse(a.getItem(e))}catch(h){t[e]=a.getItem(e)}}return t}if(1!=s){try{t=JSON.parse(a.getItem(c))}catch(h){throw new ReferenceError(c+" is not defined in this storage")}for(o=1;s-1>o;o++)if(t=t[f[o]],void 0===t)throw new ReferenceError([].slice.call(f,1,o+1).join(".")+" is not defined in this storage");if(Array.isArray(f[o])){r=t,t={};for(n in f[o])f[o].hasOwnProperty(n)&&(t[f[o][n]]=r[f[o][n]]);return t}return t[f[o]]}try{return JSON.parse(a.getItem(c))}catch(h){return a.getItem(c)}}function t(){var e,t,r,o,n=this._type,i=arguments.length,s=window[n],a=arguments,f=a[0],h=a[1],l=isNaN(h)?{}:[];if(1>i||!c(f)&&2>i)throw new Error("Minimum 2 arguments must be given or first parameter must be an object");if(c(f)){for(o in f)f.hasOwnProperty(o)&&(e=f[o],c(e)||this.alwaysUseJson?s.setItem(o,JSON.stringify(e)):s.setItem(o,e));return f}if(2==i)return"object"==typeof h||this.alwaysUseJson?s.setItem(f,JSON.stringify(h)):s.setItem(f,h),h;try{r=s.getItem(f),null!=r&&(l=JSON.parse(r))}catch(u){}for(r=l,o=1;i-2>o;o++)e=a[o],t=isNaN(a[o+1])?"object":"array",(!r[e]||"object"==t&&!c(r[e])||"array"==t&&!Array.isArray(r[e]))&&("array"==t?r[e]=[]:r[e]={}),r=r[e];return r[a[o]]=a[o+1],s.setItem(f,JSON.stringify(l)),l}function r(){var e,t,r,o,n=this._type,i=arguments.length,s=window[n],a=arguments,f=a[0];if(1>i)throw new Error("Minimum 1 argument must be given");if(Array.isArray(f)){for(r in f)f.hasOwnProperty(r)&&s.removeItem(f[r]);return!0}if(1==i)return s.removeItem(f),!0;try{e=t=JSON.parse(s.getItem(f))}catch(c){throw new ReferenceError(f+" is not defined in this storage")}for(r=1;i-1>r;r++)if(t=t[a[r]],void 0===t)throw new ReferenceError([].slice.call(a,1,r).join(".")+" is not defined in this storage");if(Array.isArray(a[r]))for(o in a[r])a[r].hasOwnProperty(o)&&delete t[a[r][o]];else delete t[a[r]];return s.setItem(f,JSON.stringify(e)),!0}function o(e){var t,o=s.call(this);for(t in o)o.hasOwnProperty(t)&&r.call(this,o[t]);if(e)for(t in d.namespaceStorages)d.namespaceStorages.hasOwnProperty(t)&&a(t)}function n(){var t,r=arguments.length,o=arguments,i=o[0];if(0==r)return 0==s.call(this).length;if(Array.isArray(i)){for(t=0;t<i.length;t++)if(!n.call(this,i[t]))return!1;return!0}try{var a=e.apply(this,arguments);Array.isArray(o[r-1])||(a={totest:a});for(t in a)if(a.hasOwnProperty(t)&&!(c(a[t])&&h(a[t])||Array.isArray(a[t])&&!a[t].length||"boolean"!=typeof a[t]&&!a[t]))return!1;return!0}catch(f){return!0}}function i(){var t,r=arguments.length,o=arguments,n=o[0];if(1>r)throw new Error("Minimum 1 argument must be given");if(Array.isArray(n)){for(t=0;t<n.length;t++)if(!i.call(this,n[t]))return!1;return!0}try{var s=e.apply(this,arguments);Array.isArray(o[r-1])||(s={totest:s});for(t in s)if(s.hasOwnProperty(t)&&(void 0===s[t]||null===s[t]))return!1;return!0}catch(a){return!1}}function s(){var t=this._type,r=arguments.length,o=window[t],n=[],i={};if(i=r>0?e.apply(this,arguments):o,i&&i._cookie){var s=Cookies.get();for(var a in s)s.hasOwnProperty(a)&&""!=a&&n.push(a.replace(i._prefix,""))}else for(var f in i)i.hasOwnProperty(f)&&n.push(f);return n}function a(e){if(!e||"string"!=typeof e)throw new Error("First parameter must be a string");v?(window.localStorage.getItem(e)||window.localStorage.setItem(e,"{}"),window.sessionStorage.getItem(e)||window.sessionStorage.setItem(e,"{}")):(window.localCookieStorage.getItem(e)||window.localCookieStorage.setItem(e,"{}"),window.sessionCookieStorage.getItem(e)||window.sessionCookieStorage.setItem(e,"{}"));var t={localStorage:l({},d.localStorage,{_ns:e}),sessionStorage:l({},d.sessionStorage,{_ns:e})};return"undefined"!=typeof Cookies&&(window.cookieStorage.getItem(e)||window.cookieStorage.setItem(e,"{}"),t.cookieStorage=l({},d.cookieStorage,{_ns:e})),d.namespaceStorages[e]=t,t}function f(e){var t="jsapi";try{return window[e]?(window[e].setItem(t,t),window[e].removeItem(t),!0):!1}catch(r){return!1}}function c(e){var t,r;return e&&"[object Object]"===g.call(e)?(t=y(e))?(r=w.call(t,"constructor")&&t.constructor,"function"==typeof r&&p.call(r)===m):!0:!1}function h(e){var t;for(t in e)return!1;return!0}function l(){for(var e=1,t=arguments[0];e<arguments.length;e++){var r=arguments[e];for(var o in r)r.hasOwnProperty(o)&&(t[o]=r[o])}return t}var u={},g=u.toString,w=u.hasOwnProperty,p=w.toString,m=p.call(Object),y=Object.getPrototypeOf,d={},S="ls_",_="ss_",v=f("localStorage"),k={_type:"",_ns:"",_callMethod:function(e,t){t=Array.prototype.slice.call(t);var r=[],o=t[0];return this._ns&&r.push(this._ns),"string"==typeof o&&-1!==o.indexOf(".")&&(t.shift(),[].unshift.apply(t,o.split("."))),[].push.apply(r,t),e.apply(this,r)},alwaysUseJson:!1,get:function(){return this._callMethod(e,arguments)},set:function(){var e=arguments.length,r=arguments,o=r[0];if(1>e||!c(o)&&2>e)throw new Error("Minimum 2 arguments must be given or first parameter must be an object");if(c(o)&&this._ns){for(var n in o)o.hasOwnProperty(n)&&this._callMethod(t,[n,o[n]]);return o}var i=this._callMethod(t,r);return this._ns?i[o.split(".")[0]]:i},remove:function(){if(arguments.length<1)throw new Error("Minimum 1 argument must be given");return this._callMethod(r,arguments)},removeAll:function(e){return this._ns?(this._callMethod(t,[{}]),!0):this._callMethod(o,[e])},isEmpty:function(){return this._callMethod(n,arguments)},isSet:function(){if(arguments.length<1)throw new Error("Minimum 1 argument must be given");return this._callMethod(i,arguments)},keys:function(){return this._callMethod(s,arguments)}};if("undefined"!=typeof Cookies){window.name||(window.name=Math.floor(1e8*Math.random()));var O={_cookie:!0,_prefix:"",_expires:null,_path:null,_domain:null,setItem:function(e,t){Cookies.set(this._prefix+e,t,{expires:this._expires,path:this._path,domain:this._domain})},getItem:function(e){return Cookies.get(this._prefix+e)},removeItem:function(e){return Cookies.remove(this._prefix+e,{path:this._path})},clear:function(){var e=Cookies.get();for(var t in e)e.hasOwnProperty(t)&&""!=t&&(!this._prefix&&-1===t.indexOf(S)&&-1===t.indexOf(_)||this._prefix&&0===t.indexOf(this._prefix))&&Cookies.remove(t)},setExpires:function(e){return this._expires=e,this},setPath:function(e){return this._path=e,this},setDomain:function(e){return this._domain=e,this},setConf:function(e){return e.path&&(this._path=e.path),e.domain&&(this._domain=e.domain),e.expires&&(this._expires=e.expires),this},setDefaultConf:function(){this._path=this._domain=this._expires=null}};v||(window.localCookieStorage=l({},O,{_prefix:S,_expires:3650}),window.sessionCookieStorage=l({},O,{_prefix:_+window.name+"_"})),window.cookieStorage=l({},O),d.cookieStorage=l({},k,{_type:"cookieStorage",setExpires:function(e){return window.cookieStorage.setExpires(e),this},setPath:function(e){return window.cookieStorage.setPath(e),this},setDomain:function(e){return window.cookieStorage.setDomain(e),this},setConf:function(e){return window.cookieStorage.setConf(e),this},setDefaultConf:function(){return window.cookieStorage.setDefaultConf(),this}})}return d.initNamespaceStorage=function(e){return a(e)},v?(d.localStorage=l({},k,{_type:"localStorage"}),d.sessionStorage=l({},k,{_type:"sessionStorage"})):(d.localStorage=l({},k,{_type:"localCookieStorage"}),d.sessionStorage=l({},k,{_type:"sessionCookieStorage"})),d.namespaceStorages={},d.removeAllStorages=function(e){d.localStorage.removeAll(e),d.sessionStorage.removeAll(e),d.cookieStorage&&d.cookieStorage.removeAll(e),e||(d.namespaceStorages={})},d.alwaysUseJsonInStorage=function(e){k.alwaysUseJson=e,d.localStorage.alwaysUseJson=e,d.sessionStorage.alwaysUseJson=e,d.cookieStorage&&(d.cookieStorage.alwaysUseJson=e)},d});

jQuery.fn.center = function () {
    this.css("position","fixed");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}

var gamelist=[];
var minpoints=100;
var maxpoints=280;
var maxpages=10;
var enterwishlist=false;
var entergroup=false;
var enterfeatured=false;
var entryordermethod=1;
var checktimer;
var watchdogtimer;
var autoentrylastrun=new Date();
var sitepattern=new RegExp('https?://.*steamgifts.com');
var siteurl=sitepattern.exec(document.URL.toString());
var pointsavailable=0;
var possibleentries=[];
var bestchanceentries=[];
var timeout=600000;
var enabled=false;

{
	var s=Storages.localStorage;
	if(s.isSet('games')) {
		gamelist=s.get('games');
	}
	
	for(var i=0; i<gamelist.length; i++) {
		gamelist[i].name=gamelist[i].name.trim();
		if(typeof(gamelist[i].maxentries)=="nothing" || $.isNumeric(gamelist[i].maxentries)==false) {
			gamelist[i].maxentries=-1;
		}
		if(typeof(gamelist[i].entergroup)=="nothing") {
			gamelist[i].entergroup=true;
		}
	}
	
	if(s.isSet('minpoints')) {
		minpoints=s.get('minpoints');
		if($.isNumeric(minpoints)==false) {
			minpoints=100;
		}
	}
	
	if(s.isSet('maxpoints')) {
		maxpoints=s.get('maxpoints');
		if($.isNumeric(maxpoints)==false) {
			maxpoints=280;
		}
	}
	
	if(s.isSet('maxpages')) {
		maxpages=s.get('maxpages');
		if($.isNumeric(maxpages)==false) {
			maxpages=10;
		}
	}
	
	if(s.isSet('entryordermethod')) {
		entryordermethod=s.get('entryordermethod');
		if($.isNumeric(entryordermethod)==false) {
			entryordermethod=1;
		}
	}
	if(entryordermethod<0 || entryordermethod>3) {
		entryordermethod=1;
	}
	
	if(s.isSet('enterwishlist') && s.get('enterwishlist')!="undefined") {
		enterwishlist=s.get('enterwishlist');
	}
	
	if(s.isSet('entergroup') && s.get('entergroup')!="undefined") {
		entergroup=s.get('entergroup');
	}
	
	if(s.isSet('enterfeatured') && s.get('enterfeatured')!="undefined") {
		enterfeatured=s.get('enterfeatured');
	}
	
}

function log(text) {
	if(window.console && console.log) {
		console.log(Date().toLocaleString()+' : '+text);
	}
}

function entrysuccess(resp) {
	if(resp.hasOwnProperty('type')) {
    if(resp.type=='success') {
      log('Successfully entered giveaway');
    } else if(resp.type=='error') {
     	if(resp.hasOwnProperty('msg')) {
         log('Error entering giveaway.  Reason: '+resp.msg);
      } else {
        log('Unspecified error entering giveaway');
    	}
    }
  } else {
    log('Unknown result from entry');
  }
  if(resp.hasOwnProperty('points')) {
   	pointsavailable=resp.points;
  }
	log('Points available='+pointsavailable);
	setTimeout(startnextentry,5000);
}

function entryfail(xhr, textstatus, error) {
  log('Entry failed '+error);
	setTimeout(startnextentry,2000);
}

function startnextentry() {
  var coderegex=new RegExp('giveaway/([^/]*?)/.*');
  var xsrf='';
  var xsrfregex=new RegExp('name=\"xsrf_token\"[^>]*?value=\"([^>\"]*?)\"');
  var xsrfarr=xsrfregex.exec($("html").html());
  if(xsrfarr!=null && xsrfarr.length>1) {
		xsrf=xsrfarr[1];
  } else {
   	log('Unable to find xsrf token');
  }
  
  if(!enabled) {
    log('Auto Entry Disabled.  Stopping entries.');
		return;
  }
  
	if(possibleentries.length>0) {
		for(var ei=0; ei<possibleentries.length; ei++) {
			if((entryordermethod==3 || entryordermethod==2 || possibleentries[ei].force==true) && (pointsavailable-possibleentries[ei].points)>=minpoints) {

        var codearr=coderegex.exec(possibleentries[ei].url);
        if(codearr!=null && codearr.length>1) {
          $.ajax({
            type: "POST",
            url: siteurl+"/ajax.php",
            data: {xsrf_token: xsrf, do: "entry_insert", code: codearr[1]},
            success: entrysuccess,
            error: entryfail,
            dataType: 'json'
          });
        } else {
         	log('Unable to find game code in url');
        }

				possibleentries.splice(ei,1);
				return;
			}
		}
		for(var ti=0; ti<gamelist.length; ti++) {
			for(var ei=0; ei<possibleentries.length; ei++) {
				var rematch=false;
				try {
					rematch=new RegExp(gamelist[ti].name,"i").test(possibleentries[ei].name);
				} catch(e) {
				}
				if((gamelist[ti].name==possibleentries[ei].name || rematch==true) && (pointsavailable-possibleentries[ei].points)>=minpoints) {	

          var codearr=coderegex.exec(possibleentries[ei].url);
          if(codearr!=null && codearr.length>1) {
            $.ajax({
              type: "POST",
              url: siteurl+"/ajax.php",
              data: {xsrf_token: xsrf, do: "entry_insert", code: codearr[1]},
              success: entrysuccess,
              error: entryfail,
              dataType: 'json'
            });
          } else {
            log('Unable to find game code in url');
          }

					possibleentries.splice(ei,1);
					return;
				}
			}
		}
	}
	
	// We're done, but we have points available, enter next giveaway with the best chance of winning
	if(pointsavailable > maxpoints && bestchanceentries.length>0) {
		log(pointsavailable+' points available, attempting to enter giveaway with best chance of winning '+bestchanceentries[0].url+'   '+bestchanceentries.length+' other giveaways left');
		possibleentries.push(bestchanceentries[0]);
		bestchanceentries.shift();
		startnextentry();
		return;
	}
	
	// done with this update
	// start the timer again for the next series of updates
	checktimer=setTimeout(startupdate,timeout);
	
	log('Update done');
	
}

function startpagerequest(pagenum) {
	log('Starting request for page '+pagenum.toString());
	var pageurl;
	if(pagenum=='wishlist' || pagenum=='group') {
		pageurl=siteurl+'/giveaways/search?type='+pagenum;
	} else {
		pageurl=siteurl+'/giveaways/search?page='+pagenum.toString()+'&status=open';
	}
	jQuery.ajax({method: "GET",
	url: pageurl,
	success: backgroundpageload(pagenum),
	error: loadfailure(pagenum)
	});
}

function backgroundpageload(pagenum) {
	return function(resp) {

		entries=$(resp).find('.giveaway__row-outer-wrap');
		
		if(typeof(entries)!="undefined" && typeof(entries.length)!="undefined") {
			$(entries).each(function() {
				// skip class is-faded because we've already entered them
				if($(this).find('.giveaway__row-inner-wrap').hasClass('is-faded')==false) {
					var ok=true;
					var wantenter=true;
					var contrib=$(this).find('.contributor_only');
					if(contrib.length>0) {
						if($(contrib).hasClass('green')==false) {
							ok=false;
						}
					}
					var levelok=!($(this).find('.giveaway__column--contributor-level--negative').length>0);
					if(levelok==false) {
						log('Level not high enough');
						ok=false;
					}
					var isgroup=($(this).find('.giveaway__column--group').length>0);
					if(isgroup==true) {
						log('Group giveaway');
					}
					var isfeatured=($(this).parents('.pinned-giveaways__outer-wrap').length>0);
					//var name=$(this).find('.title').find('a[href^="/giveaway/"]').text();
					var name=$(this).find('.giveaway__heading__name').text();
					var isblacklisted=game_blacklisted(name);
					var gameidx=gamelist.map(function(el) { return el.name; }).indexOf(name);
					if(gameidx<0 && levelok==true) {
						for(var gi=0; gi<gamelist.length && gameidx<0; gi++) {
							try {
								if(RegExp(gamelist[gi].name,"i").test(name)==true) {
									log('Matched regex '+gamelist[gi].name+' for game '+name);
									gameidx=gi;
								}
							} catch(e) {
							}
						}
						if(gameidx<0) {
							ok=false;
						}
					}
					if(ok==true && isgroup==true && gamelist[gameidx].entergroup==false) {
						wantenter=false;
						log('Skipping entry of ignored group giveaway for '+gamelist[gameidx].name);
					}
					if(ok==false && isfeatured==true && enterfeatured==false) {
						wantenter=false;
						log('Skipping entry of featured giveaway for '+name);
					}
					if(ok==true && isblacklisted==true) {
						wantenter=false;
						log('Skipping entry of blacklisted giveaway for '+name);
					}
					var pointsregex=new RegExp("\\((\\d+)P\\)");
					var arr=pointsregex.exec($(this).find('.giveaway__heading').html());
					var entriesregex=new RegExp("(\\d+) entr");
					// remove , from string because it's used as a thousand separator
					var earr=entriesregex.exec($(this).find('.giveaway__links a').html().replace(',',''));
					var entries=0;
					
					if(earr && earr.length==2) {
						entries=parseInt(earr[1]);
					}

					if(ok==true) {
						if(gamelist[gameidx].maxentries!="nothing" && gamelist[gameidx].maxentries!=-1 && parseInt(gamelist[gameidx].maxentries)<entries) {
							ok=false;
							if(gamelist[gameidx].maxentries > 0) {
								log('Too many entries for '+$(this).find('a[href^="/giveaway/"]').attr('href'));
							}
						}
					}
					
					var copiesregex=new RegExp("\\((\\d+) Copies\\)");
					var carr=copiesregex.exec($(this).find('.giveaway__heading').html());
					var copies=1;
					if(carr && carr.length==2) {
						copies=parseInt(carr[1]);
					}
					
					if(isblacklisted==false && levelok==true && wantenter==true && (ok==true || pagenum=='wishlist' || pagenum=='group')) {
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
							possibleentries[possibleentries.length-1].isgroup=isgroup;
							possibleentries[possibleentries.length-1].entries=entries;
							possibleentries[possibleentries.length-1].copies=copies;
							log('Adding possible '+(pagenum=='wishlist' ? 'wishlist ' : (pagenum=='group' ? 'group ' : ''))+'entry '+possibleentries[possibleentries.length-1].url+'  points='+possibleentries[possibleentries.length-1].points+'  '+possibleentries.length);
						}
					}
					// we didn't explicitly enter for this giveaway, and it's not blacklisted and our level is ok, save it in the best chance giveaway list
					else if(maxpoints<300 && levelok==true && isblacklisted==false) {
						var thisurl=$(this).find('a[href^="/giveaway/"]').attr('href');
						var haveurl=false;
						for(var ei=0; ei<bestchanceentries.length; ei++) {
							if(bestchanceentries[ei].url==thisurl) {
								haveurl=true;
							}
						}
						if(haveurl==false) {
							bestchanceentries.length+=1;
							bestchanceentries[bestchanceentries.length-1]={};
							bestchanceentries[bestchanceentries.length-1].url=thisurl;
							bestchanceentries[bestchanceentries.length-1].name=name;
							bestchanceentries[bestchanceentries.length-1].points=arr[1];
							bestchanceentries[bestchanceentries.length-1].force=true;
							bestchanceentries[bestchanceentries.length-1].isgroup=isgroup;
							bestchanceentries[bestchanceentries.length-1].entries=entries;
							bestchanceentries[bestchanceentries.length-1].copies=copies;
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
		
		if(pagenum<maxpages) {
			startpagerequest(pagenum+1);
			return;
		}
		
		// sort best chance array so best is at the front
		if(maxpoints<300) {
			bestchanceentries.sort(sortentry);
		}
		
		// if we're entering giveaways with the best chance first, sort that list as well
		if(entryordermethod==2) {
			log('Sorting potential entries so best chance is tried first');
			possibleentries.sort(sortentry);
		}
		
		log('Points Available='+pointsavailable);
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
		
		if(pagenum<maxpages) {
			startpagerequest(pagenum+1);
			return;
		}
		// done with this update
		// start the timer again for the next series of updates
		checktimer=setTimeout(startupdate,timeout);
	}
}

function startupdate() {
	autoentrylastrun=new Date();
	pointsavailable=0;
	possibleentries=[];
	bestchanceentries=[];
	if(enterwishlist==true) {
		startpagerequest('wishlist');
	} else if(entergroup==true) {
		startpagerequest('group');
	} else {
		startpagerequest(1);
	}
}

function startautoentry(event) {
	if(typeof(checktimer)!="undefined") {
		clearTimeout(checktimer);
	}
	if(typeof(watchdogtimeout)!="undefined") {
		clearInterval(watchdogtimer);
	}
	autoentrylastrun=new Date();
	checktimer=setTimeout(startupdate,2000);
	watchdogtimer=setInterval(watchdogfunc,timeout*2);
}

function stopautoentry(event) {
	clearTimeout(checktimer);
	clearInterval(watchdogtimer);
}

function getgameli(game) {
	var li=$('<li style="cursor:grab;"></li>');
	var span=$('<span class="gamename" style="display:inline-block;width:350px;text-overflow:ellipsis;margin-right:10px;"></span>');
	li.append(span);
	span.text(game.name);
	span=$('<span class="maxentries" style="display:inline-block;width:40px;margin-right:10px;"></span>');
	li.append(span);
	span.text(game.maxentries);
	span=$('<span class="entergroup" style="display:inline-block;width:50px;margin-right:10px;"></span>');
	li.append(span);
	span.text((game.entergroup==true ? 'Yes' : 'No'));
	
	var removelink=$('<a style="cursor:pointer;">Remove</a>');
	removelink.click(function() { $(this).parent().remove(); });
	li.append(removelink);
	return li;
}

function game_blacklisted(name) {
	var gameidx=gamelist.map(function(el) { return {n:el.name,m:el.maxentries}; }).indexOf({n:name,m:0});
	if(gameidx<0) {
		for(var gi=0; gi<gamelist.length && gameidx<0; gi++) {
			try {
				if(gamelist[gi].maxentries==0 && RegExp(gamelist[gi].name,"i").test(name)==true) {
					gameidx=gi;
				}
			} catch(e) {
			}
		}
	}
	return (gameidx>0);
}

function sortentry(a,b) {
	if((a.entries/a.copies) < (b.entries/b.copies)) {
		return -1;
	}
	if((a.entries/a.copies) == (b.entries/b.copies)) {
		return 0;
	}
	return 1;
}

function watchdogfunc() {
	log('Watchdog timer');
	if(enabled==true) {
		var now=new Date();
		if((now-autoentrylastrun) > (timeout*2)) {
			log('Watchdog detected auto entry is hung.  Restarting auto entry.');
			stopautoentry();
			startautoentry();
		}
	}
}

function createsettingsdiv() {
	var outerdiv=$('<div id="autoentrysettingsdiv" style="position:absolute;width:550px;height:520px;background-color:#ffffff;display:none;border:1px solid;border-radius:4px;color:#6d7c87;font-size:11px;font-weight:bold;padding:5px 10px;"></div>');
	outerdiv.append('<h2 style="text-align:center;color:#4f565a;">Auto Entry Settings</h2>');
	outerdiv.append('<h3 style="color:#4f565a;">Games</h3><i>Reorder the list to have your most wanted games at the top</i>');
	outerdiv.append('<div id="gamelist" style="height:350px;overflow-y:scroll;"></div>');
	outerdiv.find('#gamelist').append('<span style="display:inline-block;width:350px;text-overflow:ellipsis;margin-right:10px;color:#4f565a;">Game</span>');
	outerdiv.find('#gamelist').append('<span style="display:inline-block;width:40px;text-overflow:ellipsis;margin-right:10px;color:#4f565a;">Max Entries</span>');
	outerdiv.find('#gamelist').append('<span style="display:inline-block;width:50px;text-overflow:ellipsis;margin-right:10px;color:#4f565a;">Enter Group</span>');
	var ul=$('<ul id="autoentrygameul"></ul>');
	outerdiv.find('#gamelist').append(ul);
	
	for(var i=0; i<gamelist.length; i++) {
		ul.append(getgameli(gamelist[i]));
	}
	ul.sortable();
	ul.disableSelection();
	var addgamediv=$('<div id="addgame"><input type="text" id="addgamename" style="width:350px;margin-right:6px;padding:0px;" title="The full name of the game as it appears on steamgifts.com, or a regular expression to match the name against"><input type="text" id="addgamemaxentries" style="width:40px;margin-right:6px;padding:0px;" title="Giveaways for this game will be entered as long as the number of existing entries is equal to or fewer than this.  Use -1 to always enter giveaways regardless of the number of entries.  Use 0 to not enter giveaways for this game."><input type="checkbox" id="addgameentergroup" style="width:50px;margin-right:18px;padding:0px;" title="Enter Group Giveaways for this game."></div>');

	var addgamelink=$('<a style="cursor:pointer;">Add</a>');
	addgamelink.click(function() {
		var game={};
		game.name=$('#addgamename').val().trim();
		game.maxentries=$('#addgamemaxentries').val();
		game.entergroup=$('#addgameentergroup').prop("checked");
		
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
			$(existingli).find('.entergroup').text(game.entergroup==true ? 'Yes' : 'No');
			alert('This game was already in the list and was replaced with your new settings');
		}
		else {
			$('#gamelist').find('ul').append(getgameli(game));
		}
		$('#addgamename').val('');
		$('#addgamemaxentries').val('');
		$('#addgameentergroup').prop('checked',false);
	});
	addgamediv.append(addgamelink);
	outerdiv.append(addgamediv);
	
	outerdiv.append('Min Points <input type="text" id="autoentryminpoints" pattern="\\d+" style="width:30px; padding:0px;" title="Giveaways will only be entered as long as your points available will remain at or above this number.  This allows you to have a spare pool of points to manually enter giveaways.">');
	outerdiv.append('<span style="padding-left:10px;">Max Points</span> <input type="text" id="autoentrymaxpoints" pattern="\\d+" style="width:30px; padding:0px;" title="After all your selected games have been entered, this will automatically enter any other games (that are not blacklisted) that have the best chance of winning until the points remaining is less than this value.">');
	outerdiv.append('<span style="padding-left:10px;">Max Pages</span> <input type="text" id="autoentrymaxpages" pattern="\\d+" style="width:30px; padding:0px;" title="The maximum number of pages of giveaways to retrieve.">');
	outerdiv.append('<br />');	
	outerdiv.append('Entry Order : <select id="autoentryordermethod" style="width:auto;padding:1px 1px;" title="The order in which to enter giveaways.  Wishlist and Group giveaways are entered as they are encountered regardless of this setting."><option value="1">Giveaways at top of my game list first</option><option value="2">Giveaways with best chance of winning</option><option value="3">Giveaways ending soonest</option></select>');
	outerdiv.append('<br />');
	outerdiv.append('<input type="checkbox" name="autoentryenterwishlist" id="autoentryenterwishlist" style="width:15px;vertical-align:top;">Enter any wishlist giveaways<br />');
	outerdiv.append('<input type="checkbox" name="autoentryentergroup" id="autoentryentergroup" style="width:15px;vertical-align:top;">Enter group giveaways<br />');
	outerdiv.append('<input type="checkbox" name="autoentryenterfeatured" id="autoentryenterfeatured" style="width:15px;vertical-align:top;" title="There are special giveaways that show up at the top of most pages on the site">Enter featured giveaways</br />');
	var center=$('<center></center>');
	outerdiv.append(center);
	var savebutton=$('<button>Save</button>');
	center.append(savebutton);
	savebutton.click(function() { 
		$('#autoentrysettingsdiv').slideUp();
		var storage=Storages.localStorage;
		
		gamelist=[];
		$('#gamelist ul li').each(function() {
			gamelist.push({
							name:$(this).find('.gamename').text(),
							maxentries:$(this).find('.maxentries').text(),
							entergroup:($(this).find('.entergroup').text()=='Yes' ? true : false)
						});
		});
		
		storage.set('games',gamelist);
		if($.isNumeric($('#autoentryminpoints').val())==true) {
			minpoints=$('#autoentryminpoints').val();
			storage.set('minpoints',minpoints);
		}
		if($.isNumeric($('#autoentrymaxpoints').val())==true) {
			maxpoints=$('#autoentrymaxpoints').val();
			storage.set('maxpoints',maxpoints);
		}
		if($.isNumeric($('#autoentrymaxpages').val())==true) {
			maxpages=$('#autoentrymaxpages').val();
			storage.set('maxpages',maxpages);
		}
		if($.isNumeric($('#autoentryordermethod option:selected').val())==true) {
			entryordermethod=$('#autoentryordermethod option:selected').val();
			storage.set('entryordermethod',entryordermethod);
		}
		enterwishlist=$('#autoentryenterwishlist').prop("checked");
		storage.set('enterwishlist',enterwishlist);
		entergroup=$('#autoentryentergroup').prop("checked");
		storage.set('entergroup',entergroup);
		enterfeatured=$('#autoentryenterfeatured').prop("checked");
		storage.set('enterfeatured',enterfeatured);
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
	var outerdiv=$('<div id="autoentryhelpdiv" style="position:absolute;width:740px;height:600px;background-color:#ffffff;display:none;border:1px solid;border-radius:4px;color:#6d7c87;font-size:11px;font-weight:bold;padding:5px 10px;overflow-y:scroll;"></div>');
	outerdiv.append('<h2 style="text-align:center;">Help</h2>');
	outerdiv.append('<br />');
	var innerdiv=$('<div style="line-height:1.3em;">');
	outerdiv.append(innerdiv);
	innerdiv.append('How to use the Auto Entry feature<br /><br />');
	innerdiv.append('You must be logged into steamgifts.com to use the Auto Entry feature.  All setup must be done on the Settings page under the Auto Entry menu<br /><br />');
	innerdiv.append('First add the games you want to automatically enter.  To do this you need to enter either the name of the game as it appears on steamgifts.com or a regular expression, the maximum number of entries a giveaway can have before the auto entry will skip over it, and if you want to enter group giveaways for the game.  The maximum entries is only checked when entering giveaways.  Once you are entered in a giveaway it will not remove the entry if the number of entries goes over the maximum at a later time.  You can enter -1 here to always enter giveaways for that game, or 0 to blacklist the game.<br /><br />');
	innerdiv.append('As you add games they will show up in the list.  You can drag and drop games to rearrange them.  Put your most wanted games at the top of the list.  There is a setting to determine which order to enter giveaways.  With the default setting, games at the top of the list will be entered first and therefore use up points first.  The other setting is to enter giveaways with the best chance of winning first.<br /><br />');
	innerdiv.append('If you select enter any wishlist giveaways the games on your wishlist will be entered first, before all other entries if points are available.  This is for ANY game in your wishlist, not just those games you\'ve added to the auto entry list.  Likewise if you select enter group giveaways, the giveaways for groups you are a member of will be entered second, unless you have excluded the game from group giveaways in your auto entry list.  Only after these entries are made will entries for the games in your auto entry list be considered.<br /><br />');
	innerdiv.append('You may also choose to enter any featured giveaways that show up at the top of some pages on the site.  If you don\'t select this option, games that are featured may still be entered if they are matched in your game list, otherwise they will be skipped.<br /><br />');
	innerdiv.append('In the settings page enter the minimum number of points that the auto entry system will leave for you.  The auto entry system will not enter a giveaway if your points available would go below this number.  This will give you a pool of unused points so you can manually enter giveaways that you want.<br /><br />');
	innerdiv.append('In the settings page also enter a value for the maximum number of points.  If the auto entry system goes through all your games and enters giveaways for everyting it can, and it still has more points left than this value, the system will automatically enter giveaways that have the highest chance of winning until the points fall below this value.  Enter 300 or more to disable this feature.<br /><br />');
	innerdiv.append('You should also configure the maximum number of pages to retrieve in the settings page.  The auto entry system will only look at giveaways on pages up to this number.  This is useful to reserve your points for giveaways ending the soonest in the first few pages of giveaways.<br /><br />');
	innerdiv.append('After you have made any changes in the Settings page, you need to click the Save button to save those changes.<br /><br />');
	innerdiv.append('Enable the auto entry system by clicking the Disabled link under the Auto Entry menu.  When the auto entry system is running the link will change to Enabled.  Clicking it when Enabled will disable it.<br /><br />');
	innerdiv.append('When the auto entry system is enabled it will attempt to enter giveaways for games in your list every 10 minutes.  It will check for giveaways on the configured number of pages of games as listed on steamgifts.com.<br /><br />');
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
		if(settingsobj.version>=3) {
			enterfeatured=settingsobj.enterfeatured;
		}
		if(settingsobj.version>=5) {
			maxpoints=settingsobj.maxpoints;
			maxpages=settingsobj.maxpages;
		}
		if(settingsobj.version>=6) {
			entryordermethod=settingsobj.entryordermethod;
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

		// needed for Tampermonkey - greasemonkey loads at interactive
		if(document.readyState=='complete')
		{
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
		}
		
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
			$('#autoentrymaxpoints').val(maxpoints);
			$('#autoentrymaxpages').val(maxpages);
			$('#autoentryordermethod option[value="'+entryordermethod+'"]').prop('selected',true);
			$('#autoentryenterwishlist').prop("checked",enterwishlist);
			$('#autoentryentergroup').prop("checked",entergroup);
			$('#autoentryenterfeatured').prop("checked",enterfeatured);
			return false;
		});
		$('#autoentrybackuprestore').click(function() {
			$("nav .nav__button").removeClass("is-selected");
			$("nav .nav__relative-dropdown").addClass("is-hidden");
			$('#autoentrybackuprestorediv').center();
			$('#autoentrybackuprestorediv').slideDown();
			var savedsettings={};
			savedsettings.version=6;
			savedsettings.gamelist=gamelist;
			savedsettings.minpoints=minpoints;
			savedsettings.maxpoints=maxpoints;
			savedsettings.maxpages=maxpages;
			savedsettings.entryordermethod=entryordermethod;
			savedsettings.enterwishlist=enterwishlist;
			savedsettings.entergroup=entergroup;
			savedsettings.enterfeatured=enterfeatured;
			$('#autoentrybackupjson').val(JSON.stringify(savedsettings,null,4));
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
