// ==UserScript==
// @name         styl-lich
// @namespace    http://eldar.cz/myf/
// @author       myf
// @locale       en
// @description  loads external stylesheet on (all | given pages) and/or disables its initial ones
// @include      *
// @version      0.6.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13443/styl-lich.user.js
// @updateURL https://update.greasyfork.org/scripts/13443/styl-lich.meta.js
// ==/UserScript==
"use strict";

var Rules =
[	{	enabled: 0
	,	watchURLpattern: /http:\/\/example\.org\/(?!not here).*/
	,	cssUrl: 'http://some-server/inject.css'
	,	reladOnFocus: 1
	,	killer: 1
	,	toggleOnDblClick: 1
	,	haltInFrames: 1
	}
,	{	enabled: 0
	,	watchURLpattern: ['start of URL', /regex matching URL/, function(){return Math.random()>0.5}]
	,	cssUrl: 'http://localhost/inject.css'
	}
];


/**
 checks parameter whether matches actual URL
 @param something string, regexp, function or array
 @examples
 current_location_matches( ['http://', 'https://'] )
 current_location_matches( function(url){return url.length==12} )
 current_location_matches( 'http://example.org/' )
 current_location_matches( /https?:\/\/(www\.)?example\.org\.\/.*\.html/ )
*/
function current_location_matches( something )
{	if( !something ) return false
;	log('checking ', something)
;	var l = document.location.href
;	var f = 'function'
	// array extra
;	if(f==typeof something.some)     return something.some( current_location_matches )
	// string
;	if(f==typeof something.indexOf)  return 0 == l.indexOf(something)
	// regexp
;	if(f==typeof something.test)     return something.test(l)
	// function
;	if(f==typeof something)          return something(l)
	// lousy fallback
;	if(f==typeof something.toString) return 0 == l.indexOf(String(something))
	// finally
;	return false
}

var curr_styles = document.getElementsByTagName('style');

var timestamp = (new Date()).getTime()
,	i = -1
,	rule
;	while ( rule = Rules[++i] )
{	if( !rule.enabled ) continue
;	if( rule.haltInFrames && window !== window.top ) continue
;	var currentUrl = document.URL
;	var urlPattern = rule.watchURLpattern
;	if( !urlPattern ) continue
;	var matchResult = current_location_matches( urlPattern )
;	if( !matchResult ) continue
;	log('applying rule ', rule)
;	if( rule.killer )
	{	var j = -1
		,	_s
	;	while ( _s = document.styleSheets[++j] )
		{	if( 'yes it did' != _s['data-styl-lich-injected-this'] )
			{	_s.disabled = true
			;	log('disabled style', _s )
			} else 
			{	log('style is our', _s )
			}
		}
	}
;	if( rule.func )
		rule.func();
;	if( rule.cssUrl )
	{	var cssNode = document.createElement('link')
	;	cssNode.type = 'text/css'
	;	cssNode.rel = 'stylesheet'
	;	var cssUrl = rule.cssUrl
	;	var anticache_query = ( cssUrl.indexOf('?') == -1 ) ? '?' : '&'
	;	cssNode.href = cssUrl + anticache_query + timestamp
	;	cssNode.media = rule.media || 'screen'
	;	cssNode['data-styl-lich-injected-this'] = 'yes it did'
	;	(	curr_styles.length 
		?	curr_styles[curr_styles.length-1].parentNode
		:	document.head
		).appendChild(cssNode)
	;	log('added', cssNode)
	}
;	if ( rule.jsUrl )
	{	var script = document.createElement('script')
	;	script.type = 'text/javascript'
	;	script.src = rule.jsUrl + '?' + timestamp
	;	unsafeWindow.document.body.appendChild( script );
	}
;	if ( rule.reladOnFocus )
	{	unsafeWindow.addEventListener
		(	'focus'
		,	function()
			{	if( cssNode.disabled ) return false
			;	cssNode.href = cssNode.href.split(anticache_query)[0] + anticache_query + (new Date()).getTime()
			;	log('focus -> loading ', cssNode.href )
			}
		,	false
		)
	}
;	if ( rule.reloadPeriod )
	{	unsafeWindow.setInterval
		(	function()
			{	if( cssNode.disabled ) return false
			;	cssNode.href = cssNode.href.split(anticache_query)[0] + anticache_query + (new Date()).getTime()
			;	log('period -> loading', cssNode.href )
			}
		,	rule.reloadPeriod
		)
	}
;	if( rule.toggleOnDblClick )
	{	unsafeWindow.addEventListener
		(	'dblclick'
		,	function(e)
			{	cssNode.disabled = !cssNode.disabled
			;	log('dblclck', ( cssNode.disabled ? 'disabled' : 'enabled'), cssNode.href )
			;	e.preventDefault()
			;	return false
			}
		,	true
		)
	}
}

function log()
{	if(1)return
;	var args = Array.prototype.slice.call(arguments)
;	args.unshift('Styl-lich:')
;	console && console.info && console.info.apply(console,args)
};

// thx
// http://www.hunlock.com/blogs/Howto_Dynamically_Insert_Javascript_And_CSS