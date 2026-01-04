// ==UserScript==
// @name        dAmn Autojoin
// @namespace   electricjonny
// @description This lets you autojoin a custom set of chat channels with an /autojoin command
// @include     http://chat.deviantart.com/chat/*
// @include     https://chat.deviantart.com/chat/*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/36510/dAmn%20Autojoin.user.js
// @updateURL https://update.greasyfork.org/scripts/36510/dAmn%20Autojoin.meta.js
// ==/UserScript==

autojoin_script = document.createElement('script');
autojoinScript = freeFunctionString((function(){

// easing plugin
jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

// migrate plugin
/*! jQuery Migrate v1.2.1 | (c) 2005, 2013 jQuery Foundation, Inc. and other contributors | jquery.org/license */
jQuery.migrateMute===void 0&&(jQuery.migrateMute=!0),function(e,t,n){function r(n){var r=t.console;i[n]||(i[n]=!0,e.migrateWarnings.push(n),r&&r.warn&&!e.migrateMute&&(r.warn("JQMIGRATE: "+n),e.migrateTrace&&r.trace&&r.trace()))}function a(t,a,i,o){if(Object.defineProperty)try{return Object.defineProperty(t,a,{configurable:!0,enumerable:!0,get:function(){return r(o),i},set:function(e){r(o),i=e}}),n}catch(s){}e._definePropertyBroken=!0,t[a]=i}var i={};e.migrateWarnings=[],!e.migrateMute&&t.console&&t.console.log&&t.console.log("JQMIGRATE: Logging is active"),e.migrateTrace===n&&(e.migrateTrace=!0),e.migrateReset=function(){i={},e.migrateWarnings.length=0},"BackCompat"===document.compatMode&&r("jQuery is not compatible with Quirks Mode");var o=e("<input/>",{size:1}).attr("size")&&e.attrFn,s=e.attr,u=e.attrHooks.value&&e.attrHooks.value.get||function(){return null},c=e.attrHooks.value&&e.attrHooks.value.set||function(){return n},l=/^(?:input|button)$/i,d=/^[238]$/,p=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,f=/^(?:checked|selected)$/i;a(e,"attrFn",o||{},"jQuery.attrFn is deprecated"),e.attr=function(t,a,i,u){var c=a.toLowerCase(),g=t&&t.nodeType;return u&&(4>s.length&&r("jQuery.fn.attr( props, pass ) is deprecated"),t&&!d.test(g)&&(o?a in o:e.isFunction(e.fn[a])))?e(t)[a](i):("type"===a&&i!==n&&l.test(t.nodeName)&&t.parentNode&&r("Can't change the 'type' of an input or button in IE 6/7/8"),!e.attrHooks[c]&&p.test(c)&&(e.attrHooks[c]={get:function(t,r){var a,i=e.prop(t,r);return i===!0||"boolean"!=typeof i&&(a=t.getAttributeNode(r))&&a.nodeValue!==!1?r.toLowerCase():n},set:function(t,n,r){var a;return n===!1?e.removeAttr(t,r):(a=e.propFix[r]||r,a in t&&(t[a]=!0),t.setAttribute(r,r.toLowerCase())),r}},f.test(c)&&r("jQuery.fn.attr('"+c+"') may use property instead of attribute")),s.call(e,t,a,i))},e.attrHooks.value={get:function(e,t){var n=(e.nodeName||"").toLowerCase();return"button"===n?u.apply(this,arguments):("input"!==n&&"option"!==n&&r("jQuery.fn.attr('value') no longer gets properties"),t in e?e.value:null)},set:function(e,t){var a=(e.nodeName||"").toLowerCase();return"button"===a?c.apply(this,arguments):("input"!==a&&"option"!==a&&r("jQuery.fn.attr('value', val) no longer sets properties"),e.value=t,n)}};var g,h,v=e.fn.init,m=e.parseJSON,y=/^([^<]*)(<[\w\W]+>)([^>]*)$/;e.fn.init=function(t,n,a){var i;return t&&"string"==typeof t&&!e.isPlainObject(n)&&(i=y.exec(e.trim(t)))&&i[0]&&("<"!==t.charAt(0)&&r("$(html) HTML strings must start with '<' character"),i[3]&&r("$(html) HTML text after last tag is ignored"),"#"===i[0].charAt(0)&&(r("HTML string cannot start with a '#' character"),e.error("JQMIGRATE: Invalid selector string (XSS)")),n&&n.context&&(n=n.context),e.parseHTML)?v.call(this,e.parseHTML(i[2],n,!0),n,a):v.apply(this,arguments)},e.fn.init.prototype=e.fn,e.parseJSON=function(e){return e||null===e?m.apply(this,arguments):(r("jQuery.parseJSON requires a valid JSON string"),null)},e.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||0>e.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e.browser||(g=e.uaMatch(navigator.userAgent),h={},g.browser&&(h[g.browser]=!0,h.version=g.version),h.chrome?h.webkit=!0:h.webkit&&(h.safari=!0),e.browser=h),a(e,"browser",e.browser,"jQuery.browser is deprecated"),e.sub=function(){function t(e,n){return new t.fn.init(e,n)}e.extend(!0,t,this),t.superclass=this,t.fn=t.prototype=this(),t.fn.constructor=t,t.sub=this.sub,t.fn.init=function(r,a){return a&&a instanceof e&&!(a instanceof t)&&(a=t(a)),e.fn.init.call(this,r,a,n)},t.fn.init.prototype=t.fn;var n=t(document);return r("jQuery.sub() is deprecated"),t},e.ajaxSetup({converters:{"text json":e.parseJSON}});var b=e.fn.data;e.fn.data=function(t){var a,i,o=this[0];return!o||"events"!==t||1!==arguments.length||(a=e.data(o,t),i=e._data(o,t),a!==n&&a!==i||i===n)?b.apply(this,arguments):(r("Use of jQuery.fn.data('events') is deprecated"),i)};var j=/\/(java|ecma)script/i,w=e.fn.andSelf||e.fn.addBack;e.fn.andSelf=function(){return r("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"),w.apply(this,arguments)},e.clean||(e.clean=function(t,a,i,o){a=a||document,a=!a.nodeType&&a[0]||a,a=a.ownerDocument||a,r("jQuery.clean() is deprecated");var s,u,c,l,d=[];if(e.merge(d,e.buildFragment(t,a).childNodes),i)for(c=function(e){return!e.type||j.test(e.type)?o?o.push(e.parentNode?e.parentNode.removeChild(e):e):i.appendChild(e):n},s=0;null!=(u=d[s]);s++)e.nodeName(u,"script")&&c(u)||(i.appendChild(u),u.getElementsByTagName!==n&&(l=e.grep(e.merge([],u.getElementsByTagName("script")),c),d.splice.apply(d,[s+1,0].concat(l)),s+=l.length));return d});var Q=e.event.add,x=e.event.remove,k=e.event.trigger,N=e.fn.toggle,T=e.fn.live,M=e.fn.die,S="ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",C=RegExp("\\b(?:"+S+")\\b"),H=/(?:^|\s)hover(\.\S+|)\b/,A=function(t){return"string"!=typeof t||e.event.special.hover?t:(H.test(t)&&r("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"),t&&t.replace(H,"mouseenter$1 mouseleave$1"))};e.event.props&&"attrChange"!==e.event.props[0]&&e.event.props.unshift("attrChange","attrName","relatedNode","srcElement"),e.event.dispatch&&a(e.event,"handle",e.event.dispatch,"jQuery.event.handle is undocumented and deprecated"),e.event.add=function(e,t,n,a,i){e!==document&&C.test(t)&&r("AJAX events should be attached to document: "+t),Q.call(this,e,A(t||""),n,a,i)},e.event.remove=function(e,t,n,r,a){x.call(this,e,A(t)||"",n,r,a)},e.fn.error=function(){var e=Array.prototype.slice.call(arguments,0);return r("jQuery.fn.error() is deprecated"),e.splice(0,0,"error"),arguments.length?this.bind.apply(this,e):(this.triggerHandler.apply(this,e),this)},e.fn.toggle=function(t,n){if(!e.isFunction(t)||!e.isFunction(n))return N.apply(this,arguments);r("jQuery.fn.toggle(handler, handler...) is deprecated");var a=arguments,i=t.guid||e.guid++,o=0,s=function(n){var r=(e._data(this,"lastToggle"+t.guid)||0)%o;return e._data(this,"lastToggle"+t.guid,r+1),n.preventDefault(),a[r].apply(this,arguments)||!1};for(s.guid=i;a.length>o;)a[o++].guid=i;return this.click(s)},e.fn.live=function(t,n,a){return r("jQuery.fn.live() is deprecated"),T?T.apply(this,arguments):(e(this.context).on(t,this.selector,n,a),this)},e.fn.die=function(t,n){return r("jQuery.fn.die() is deprecated"),M?M.apply(this,arguments):(e(this.context).off(t,this.selector||"**",n),this)},e.event.trigger=function(e,t,n,a){return n||C.test(e)||r("Global events are undocumented and deprecated"),k.call(this,e,t,n||document,a)},e.each(S.split("|"),function(t,n){e.event.special[n]={setup:function(){var t=this;return t!==document&&(e.event.add(document,n+"."+e.guid,function(){e.event.trigger(n,null,t,!0)}),e._data(this,n,e.guid++)),!1},teardown:function(){return this!==document&&e.event.remove(document,n+"."+e._data(this,n)),!1}}})}(jQuery,window);
// easing plugin
jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

DWait.ready(['jms/pages/chat07/chatpage.js', 'jms/pages/chat07/dAmn.js', 'jms/pages/chat07/dAmnChat.js'], function() {
var autojoinChanList = '';
var autojoinChanListJS = '';
var autojoinChanListHTML = '';

if (localStorage.autojoinAutomatic == null || localStorage.autojoinAutomatic == 'undefined' || typeof localStorage.autojoinAutomatic == 'undefined') {
	localStorage.autojoinAutomatic = 'automatic';
};

if (localStorage.autojoinAutomatic == 'automatic') {
	window.setTimeout(function() {
		autojoin();
	}, 8000);
};

	/* --------------------------------------------------------------------- */
	/* --- function to autojoin - open the config page if no rooms added --- */
	/* --------------------------------------------------------------------- */

function autojoin() {
	if (localStorage.autojoinList == null || localStorage.autojoinList == '' || typeof localStorage.autojoinList == 'undefined') {
		localStorage.autojoinList = '';
		autojoinConfig();
	} else {
		autojoinChanList = localStorage.autojoinList;

		autojoinChanList = autojoinChanList.replace(/<\/div>/g,',').replace(/(<([^>]+)>)/ig, '');
		autojoinChanList = autojoinChanList.split(',');

		var autojoinChanListJS = 'dAmn_Command("send", "join chat:'+autojoinChanList[0]+'\\n");';
		var autojoinChanListHTML = '<div class="chanName">'+autojoinChanList[0]+'</div>';

		for (var i=1; i<autojoinChanList.length; i++) {
			autojoinChanListHTML += '<div class="chanName">'+autojoinChanList[i]+'</div>'
			autojoinChanListJS += 'dAmn_Command("send", "join chat:'+autojoinChanList[i]+'\\n");';
		};

		eval(autojoinChanListJS);
	};
};



	/* ---------------------------------------- */
	/* --- function to open the config page --- */
	/* ---------------------------------------- */

function autojoinConfig() {
	removeAllRooms = false;
	automatic = true;

	if (localStorage.autojoinList == null || localStorage.autojoinList == '' || typeof localStorage.autojoinList == 'undefined') {
		localStorage.autojoinList = '';
	};

	if (localStorage.autojoinList != null || localStorage.autojoinList != '' || typeof localStorage.autojoinList !== 'undefined') {
		autojoinChanList = localStorage.autojoinList;

		autojoinChanList = autojoinChanList.replace(/<\/div>/g,',').replace(/(<([^>]+)>)/ig, '');
		autojoinChanList = autojoinChanList.split(',');

		var autojoinChanListJS = 'dAmn_Command("send", "join chat:'+autojoinChanList[0]+'\\n");';
		var autojoinChanListHTML = '<div class="chanName">'+autojoinChanList[0]+'</div>';

		for (var i=1; i<autojoinChanList.length; i++) {
			autojoinChanListHTML += '<div class="chanName">'+autojoinChanList[i]+'</div>'
			autojoinChanListJS += 'dAmn_Command("send", "join chat:'+autojoinChanList[i]+'\\n");';
		};

		if (autojoinChanListHTML == '<div class="chanName"></div>') {
			autojoinChanListHTML = '';
		};
	};


	/* ----------------------------------- */
	/* --- CSS and HTML for edit window ---*/
	/* ----------------------------------- */

	// CSS
	var autojoinEditModalCSS = '<style id="autojoinEditModalCSS" type="text/css">'+
								'#autojoinEdit {position:fixed;bottom:-450px;left:70px;width:230px;height:auto;padding:0px 0px 0px 0px;background:#DAE4D9;display:inline-block;'+
									'box-shadow:4px 4px 8px rgba(0,0,0,.6);border:1px solid #A6B2A6;border-radius:6px;z-index:200;}'+
								'#autojoinEdit .x.autojoin {position:relative;left:210px;}'+
								'#autojoinEdit h3.autojoin {background:linear-gradient(180deg, #ECF2EA, #D6DBD4);'+
									'margin-top:-17px;border-radius:6px 6px 0px 0px;border-bottom:1px solid #A6B2A6;text-align:center;box-shadow:0px 2px 5px 0px rgba(0,0,0,.15);padding:4px 0px 4px 0px;}'+
								'#autojoinRooms {float:left;margin:12px 0px 0px 12px;height:248px;width:200px;background:#E9EfE8;border:1px solid #A6B2A6;text-align:left;padding:4px 2px 4px 2px;overflow:auto;}'+
								'#autojoinEdit .autojoin.addrooms {position:relative;top:0px;left:15px;float:left;font-size:12pt;}'+
								'#autojoinRoomsAdd {position:relative;left:15px;top:0px;border:1px solid #A6B3A6;background:#F5F9F4;width:160px;}'+
								'#autojoinRoomsAddButton {position:relative;top:-18px;left:24px;background:#E6EDE4;border:1px solid #A6B2A6;border-radius:3px;padding:1px 3px 1px 3px;'+
									'cursor:pointer;box-shadow:1px 1px 3px rgba(0,0,0,.3), 2px 2px 8px -4px rgba(255,255,255,.8) inset;}'+
								'#autojoinRoomsAddButton:hover {background:#F4F9F2;}'+
								'#autojoinRoomsAddButton:active {background:#E2E5E0;}'+
								'#autojoinEdit .autojoin.bottombuttons {position:relative;top:8px;left:2px;float:left;}'+
								'#autojoinEdit .autojoin.editbuttons {position:relative;left:12px;top:4px;width:70px;height:20px;clear:left;margin:0px 0px 8px 0px;}'+
								'#autojoinEdit .autojoin.editbuttons img {padding:4px;border-radius:3px;border:1px solid #A6B2A6;background:#E6EDE4;box-shadow:1px 1px 3px rgba(0,0,0,.3), 2px 2px 8px -4px rgba(255,255,255,.8) inset;cursor:pointer;}'+
								'#autojoinEdit .autojoin.editbuttons img:hover {background:#F4F9F2;}'+
								'#autojoinEdit .autojoin.editbuttons img:active {background:#E2E5E0;}'+
								'#autojoinEdit .chanName {border:1px solid transparent;padding:0px 3px 0px 3px;margin:1px 0px 1px 0px;line-height:17px;cursor:pointer;display:table;}'+
								'#autojoinEdit .chanName:hover {border:1px solid rgba(190,204,190,.4);background:rgba(0,0,0,.01);border-radius:3px;}'+
								'#autojoinEdit .chanName.selected {border:1px solid #A6B2A6;background:rgba(0,0,0,.05);border-radius:3px;cursor:default;}'+
								'#autojoinEdit .disabled, #autojoinEdit .disabled:hover {cursor:default;opacity:.4;background:#E6EDE4;box-shadow:0px 0px 2px rgba(0,0,0,.2);-webkit-filter:grayscale(1);'+
									'filter:grayscale(1);filter:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgPGZpbHRlciBpZD0iZ3JleXNjYWxlIj4NCiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+DQogIDwvZmlsdGVyPg0KPC9zdmc+#greyscale");}'+
								'#autojoinRoomsSave {position:relative;float:left;left:12px;top:0px;background:#E6EDE4;color:#2A6D15;font-size:10pt;border:1px solid #A6B2A6;'+
									'border-radius:3px;padding:1px 3px 1px 3px;cursor:pointer;box-shadow:1px 1px 3px rgba(0,0,0,.3), 2px 2px 8px -4px rgba(255,255,255,.8) inset;}'+
								'#autojoinRoomsCancel {position:relative;float:left;left:16px;top:0px;background:#E6EDE4;color:#1B156D;font-size:10pt;border:1px solid #A6B2A6;'+
									'border-radius:3px;padding:1px 3px 1px 3px;cursor:pointer;box-shadow:1px 1px 3px rgba(0,0,0,.3), 2px 2px 8px -4px rgba(255,255,255,.8) inset;}'+
								'#autojoinRoomsRemoveall {position:relative;left:128px;top:-24px;width:70px;background:#E6EDE4;color:#6D1518;font-size:10pt;border:1px solid #A6B2A6;'+
									'border-radius:3px;padding:1px 3px 1px 3px;cursor:pointer;box-shadow:1px 1px 3px rgba(0,0,0,.3), 2px 2px 8px -4px rgba(255,255,255,.8) inset;}'+
								'#autojoinRoomsSave:hover {background:#F4F9F2;}'+
								'#autojoinRoomsCancel:hover {background:#F4F9F2;}'+
								'#autojoinRoomsRemoveall:hover {background:#F4F9F2;}'+
								'#autojoinRoomsSave:active {background:#E2E5E0;}'+
								'#autojoinRoomsCancel:active {background:#E2E5E0;}'+
								'#autojoinRoomsRemoveall:active {background:#E2E5E0;}'+
								'#automaticJoin {text-align:right;white-space:pre-wrap;width:100px;position:relative;top:-20px;right:-120px;}'+
								'</style>';
	$('head').append(autojoinEditModalCSS);

	// HTML
	var autojoinEditModal = '<div id="autojoinEdit">'+
								'<a class="x autojoin"></a>'+
								'<h3 class="autojoin">Autojoin Configuration</h3>'+
								'<div id="autojoinRooms">'+autojoinChanListHTML+'</div>'+
									'<div class="autojoin editbuttons">'+
										'<img src="data:image/gif;base64,R0lGODlhDAAMALMPAN5/f+yNjf/b29Jzc+OEhPWWlrFSUq1OTstsbMFiYv2env/U1Nh5eaVGRv///////yH5BAEAAA8ALAAAAAAMAAwAQARV8JnTqj3mtcDEQsgiDAOlBIIjpAIQTAoRcAxBMIXRFMiwOI5PAoCRAY4AxiBpMCgUhWhhNtVBVzbsq6EYMH7BASJA4aQWvw/jcAj0EIlEb5iZWC6ZCAA7" class="disabled" id="autojoinRoomsRemove"> '+
										'<img src="data:image/gif;base64,R0lGODlhCgALAKIHAJmZmZaglnJ8da+3rzdGRgAAAGZmZv///yH5BAEAAAcALAAAAAAKAAsAQAMjeHpmu2QI4pSJIctS765LAz4E9YQC93jBd5QwLABWqZKtqSQAOw==" class="moveUp disabled" id="autojoinRoomsMoveup"> '+
										'<img src="data:image/gif;base64,R0lGODlhCgALAKIHAJmZmZaglnJ8da+3rzdGRgAAAGZmZv///yH5BAEAAAcALAAAAAAKAAsAQAMleHpGtMoUMYiB0Vzc6GPTEIzVlmERIX6L5GyA4MwzSAUlJAlmAgA7" class="moveDown disabled" id="autojoinRoomsMovedown"> '+
										'<div id="autojoinRoomsRemoveall">Remove all</div>'+
									'</div>'+
									'<div class="autojoin addrooms">Add a room:</div>'+
									'<input id="autojoinRoomsAdd" type"text" spellcheck="false"></input><br>'+
									'<span id="autojoinRoomsAddButton" class="disabled">Add</span>'+
									'<small class="autojoin" style="float:left;padding:0px;margin:4px 0px 0px 15px;line-height:10px;color:#7A7F7A;">/autojoin - Autojoin rooms</small>'+
									'<small class="autojoin" style="float:left;padding:0px;margin:0px 0px 0px 15px;line-height:8px;color:#7A7F7A;">/autojoinEdit - This screen</small>'+
									'<div class="autojoin bottombuttons">'+
										'<div id="autojoinRoomsSave" class="disabled">Save</div>'+
										'<div id="autojoinRoomsCancel">Cancel</div>'+
										'<div id="automaticJoin" title="Join automatically on page load, or use the command /autojoin?"><input type="checkbox"></input>Automatic?</div>'+
									'</div>'+
								'</div>'+
							'</div>';

	// check if the window is on the page and add or remove it
	if (!document.getElementById('autojoinEdit')) {
		$('#output').append(autojoinEditModal);
		$('#autojoinEdit').animate({bottom:'70px'}, 400, 'easeOutQuad');
	} else {
		$('#autojoinEdit').animate({bottom:'-450px'}, 300, 'easeInQuad', function() {
			$('#autojoinEdit').remove();
		});
	};

	// check if room list is empty and if so .disable remove all button
	if ($('#autojoinRooms').html() == '') {
		$('#autojoinRoomsRemoveall').attr('class', 'disabled');
	};

	// check the automatic box based on setting
	if (localStorage.autojoinAutomatic == 'automatic') {
		$('#automaticJoin input').attr('checked', 'checked');
	} else if (localStorage.autojoinAutomatic == 'manual'){
		$('#automaticJoin input').removeAttr('checked');
	};


	/* -------------------- */
	/* --- adding rooms --- */
	/* -------------------- */

	// check to make sure the add buttons .disable's right and add rooms when pressing enter
	$('#autojoinRoomsAdd').keyup(function (e) {
		if ($(this).val() != '' && (!$(this).val().match(/[\!@#\$%\^&\*\(\)_\+\=`~\\\|\/\?\.,<> ]/) && !$(this).val().match(/^[-]/) && !$(this).val().match(/[-]$/))) {
			$('#autojoinRoomsAddButton').attr('class', '');
			$('#autojoinRoomsAdd').css('border', '1px solid #A6B3A6');
			if (e.which == 13) {
				var chanName = '<div class="chanName">' + $('#autojoinRoomsAdd').val() + '</div>';
				$('#autojoinRooms').html($('#autojoinRooms').html() + chanName);
				$('#autojoinRoomsAdd').val('');
				$('#autojoinRoomsAddButton').attr('class', 'disabled');
				$('#autojoinRoomsSave').removeAttr('class');
				$('#autojoinRoomsRemoveall').removeAttr('class');
				$('.chanName.selected').attr('class', 'chanName');
				$('.autojoin.editbuttons img').attr('class', 'disabled');
				if (removeAllRooms == true) {
					removeAllRooms = false;
				};
			};	
		} else {
			$('#autojoinRoomsAddButton').attr('class', 'disabled');
			$('#autojoinRoomsAdd').css('border', '1px solid #BF0000');
		};
	});


	// click the add button to add rooms to the list
	$('#autojoinRoomsAddButton').click(function () {
		if ($('#autojoinRoomsAdd').val() == '') {
			return;
		} else {
			var chanName = '<div class="chanName">' + $('#autojoinRoomsAdd').val() + '</div>'
			$('#autojoinRooms').html($('#autojoinRooms').html() + chanName);
			$('#autojoinRoomsAdd').val('');
			$('#autojoinRoomsAddButton').attr('class', 'disabled');
			$('#autojoinRoomsSave').removeAttr('class');
			$('#autojoinRoomsRemoveall').removeAttr('class');
			$('.chanName.selected').attr('class', 'chanName');
			$('.autojoin.editbuttons img').attr('class', 'disabled');
			if (removeAllRooms == true) {
				removeAllRooms = false;
			};
		};
	});


	/* ------------------------------------------------------------- */
	/* --- click rooms to edit them and .disable certain buttons --- */
	/* ------------------------------------------------------------- */

	$('.chanName').live('click', function() {
		$(this).attr('class', 'chanName selected');

		$('.autojoin.editbuttons img').removeAttr('class');

		if ($('.chanName.selected').is(':only-child')) {			
			$('#autojoinRoomsMoveup').attr('class', 'disabled');
			$('#autojoinRoomsMovedown').attr('class', 'disabled');
		} else if ($('.chanName.selected').is(':first-child')) {
			$('#autojoinRoomsMoveup').attr('class', 'disabled');
			$('#autojoinRoomsMovedown').removeAttr('class');
		} else if ($('.chanName.selected').is(':last-child')) {
			$('#autojoinRoomsMovedown').attr('class', 'disabled');
			$('#autojoinRoomsMoveup').removeAttr('class');
		} else {
			$('#autojoinRoomsMoveup').removeAttr('class');
			$('#autojoinRoomsMovedown').removeAttr('class');
		};

		$('.chanName.selected').not($(this)).each(function() {
			$(this).attr('class', 'chanName');
			$('.chanName.selected').remove();
		});
	});


	/* -------------------------------- */
	/* --- click remove room button --- */
	/* -------------------------------- */

	$('#autojoinRoomsRemove').live('click', function() {
		$('.chanName.selected').remove();
		$('#autojoinRoomsSave').removeAttr('class');
		if ($('#autojoinRooms').html() == '') {
			$('.autojoin.editbuttons img').removeAttr('class');
			$('#autojoinRoomsRemoveall').attr('class', 'disabled');
		};
		$('.autojoin.editbuttons img').attr('class', 'disabled');
		$('#autojoinRoomsAdd').focus();
	});


	/* ---------------------------- */
	/* --- click move up button --- */
	/* ---------------------------- */

	$('#autojoinRoomsMoveup:not(.disabled)').live('click', function() {
		$('.chanName.selected').insertBefore($('.chanName.selected').prev());
		$('#autojoinRoomsSave').removeAttr('class');
		if ($('.chanName.selected').is(':only-child')) {			
			$('#autojoinRoomsMoveup').attr('class', 'disabled');
			$('#autojoinRoomsMovedown').attr('class', 'disabled');
		} else if ($('.chanName.selected').is(':first-child')) {
			$('#autojoinRoomsMoveup').attr('class', 'disabled');
			$('#autojoinRoomsMovedown').removeAttr('class');
		} else if ($('.chanName.selected').is(':last-child')) {
			$('#autojoinRoomsMovedown').attr('class', 'disabled');
			$('#autojoinRoomsMoveup').removeAttr('class');
		} else {
			$('#autojoinRoomsMoveup').removeAttr('class');
			$('#autojoinRoomsMovedown').removeAttr('class');
		};
	});


	/* ------------------------------ */
	/* --- click move down button --- */
	/* ------------------------------ */

	$('#autojoinRoomsMovedown:not(.disabled)').live('click', function() {
		$('.chanName.selected').insertAfter($('.chanName.selected').next());
		$('#autojoinRoomsSave').removeAttr('class');
		if ($('.chanName.selected').is(':only-child')) {			
			$('#autojoinRoomsMoveup').attr('class', 'disabled');
			$('#autojoinRoomsMovedown').attr('class', 'disabled');
		} else if ($('.chanName.selected').is(':first-child')) {
			$('#autojoinRoomsMoveup').attr('class', 'disabled');
			$('#autojoinRoomsMovedown').removeAttr('class');
		} else if ($('.chanName.selected').is(':last-child')) {
			$('#autojoinRoomsMovedown').attr('class', 'disabled');
			$('#autojoinRoomsMoveup').removeAttr('class');
		} else {
			$('#autojoinRoomsMoveup').removeAttr('class');
			$('#autojoinRoomsMovedown').removeAttr('class');
		};
	});


	/* --------------------------------------------------------- */
	/* --- click outside of room list to deselect everything --- */
	/* --------------------------------------------------------- */

	$('#autojoinRooms').click(function() {
		$('.chanName.selected').each(function() {
			$(this).attr('class', 'chanName');
		});
		$('.autojoin.editbuttons img').attr('class', 'disabled');
	});


	/* ------------------------- */
	/* --- click save button --- */
	/* ------------------------- */

	$('#autojoinRoomsSave:not(.disabled)').live('click', function() {
		var autojoinChanList = $('#autojoinRooms').html();
		autojoinChanList = autojoinChanList.replace(/<\/div>/g,',').replace(/(<([^>]+)>)/ig, '');
		autojoinChanList = autojoinChanList.split(',');
		autojoinChanList.pop();

		var autojoinChanListJS = 'dAmn_Command("send", "join chat:'+autojoinChanList[0]+'\\n");';
		var autojoinChanListHTML = '<div class="chanName">'+autojoinChanList[0]+'</div>';

		for (var i=1; i<autojoinChanList.length; i++) {
			autojoinChanListHTML += '<div class="chanName">'+autojoinChanList[i]+'</div>'
			autojoinChanListJS += 'dAmn_Command("send", "join chat:'+autojoinChanList[i]+'\\n");';
		};

		localStorage.autojoinList = autojoinChanList;

		if (removeAllRooms == true) {
			localStorage.autojoinList = '';
		};

		$('#autojoinEdit').animate({bottom:'-450px'}, 300, 'easeInQuad', function() {
			$('#autojoinEdit').remove();
		});
		$('#autojoinRoomsMoveup:not(.disabled)').die();
		$('#autojoinRoomsMovedown:not(.disabled)').die();

		if (automatic == true) {
			localStorage.autojoinAutomatic = 'automatic';
		} else if (automatic == false) {
			localStorage.autojoinAutomatic = 'manual';
		};

		window.setTimeout(function() {
			$('[class="damncrc-input "] *').focus();
		}, 200);
	});


	/* --------------------------- */
	/* --- click cancel button --- */
	/* --------------------------- */

	$('#autojoinRoomsCancel, .x.autojoin').click(function() {
		$('#autojoinEdit').animate({bottom:'-450px'}, 300, 'easeInQuad', function() {
			$('#autojoinEdit').remove();
		});
		$('#autojoinRoomsMoveup:not(.disabled)').die();
		$('#autojoinRoomsMovedown:not(.disabled)').die();
		window.setTimeout(function() {
			$('[class="damncrc-input "] *').focus();
		}, 200);
	});


	/* ------------------------------------- */
	/* --- click remove all rooms button --- */
	/* ------------------------------------- */

	$('#autojoinRoomsRemoveall:not(.disabled)').live('click', function() {
		removeAllRooms = true;
		$('#autojoinRooms').html('');
		$('#autojoinRoomsSave').removeAttr('class');
		$('#autojoinRoomsRemoveall').attr('class', 'disabled');
		$('.autojoin.editbuttons img').attr('class', 'disabled');
		$('#autojoinRoomsAdd').focus();
	});


	/* -------------------------------------------------- */
	/* --- make clicking automatic join automatically --- */
	/* -------------------------------------------------- */

	$('#automaticJoin input').change(function() {
		if ($('#automaticJoin input').is(':checked')) {
			automatic = true;
		} else {
			automatic = false;
		};
		$('#autojoinRoomsSave').removeAttr('class');
	});

	/* -------------------------------- */
	/* --- focus room input on load --- */
	/* -------------------------------- */

	window.setTimeout(function() {
		$('#autojoinRoomsAdd').focus();
	}, 200);
};





	/* ---------------------------- */
	/* --- set up the /commands --- */
	/* ---------------------------- */

//register commands
dAmnChanChat.prototype.autojoinCommands_Init = dAmnChanChat.prototype.Init;
dAmnChanChat.prototype.Init = function(cr, name, parent_el) {
	this.autojoinCommands_Init(cr, name, parent_el);
	var cie = this.input;
	cie.cmds['autojoin']=[0],
	cie.cmds['autojoinEdit']=[0];
}

//more registering of commands
dAmnChatInput_onKey_autojoinCommands = dAmnChatInput_onKey;
dAmnChatInput_onKey = function(e, kc, force) {
	var el = this.chatinput_el;
	if (kc == 13 && (force || !this.multiline || e.shiftKey || e.ctrlKey)) {
		var input = el.value;
		var args = /^\/(\S*)\s*(.*)$/i.exec(input);
		if (args) {
			var cmd = args[1];
			var param = args[2];
			var did = false;
			if (cmd) {
				switch (cmd) {
					case 'autojoin':
						autojoin();
						did = true;
						break;
					case 'autojoinEdit':
						autojoinConfig();
						did = true;
						break;
				}
				if (did) {
					if (el.value) {
						el.value = '';
						el.focus();
					};
				};
			};
		};
	};
	if (!did) {
		return this.onKey_autojoinCommands(e, kc, force) ? true: false;
	} else {
		return false;
	};
};

//necessary prototyping
dAmnChatInput.prototype.onKey = dAmnChatInput_onKey;
dAmnChatInput.prototype.onKey_autojoinCommands = dAmnChatInput_onKey_autojoinCommands;
});
}).toString())

autojoin_script.appendChild(document.createTextNode(autojoinScript))

document.getElementsByTagName('head')[0].appendChild(autojoin_script);

// taken from electricnet's SuperdAmn
// Utility
function freeFunctionString(str){
	return str.replace(/^\s*function\s*\(\)\s*\{/, "").replace(/\}\s*$/, "")
}