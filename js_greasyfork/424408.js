// ==UserScript==
// @name         ???
// @namespace    http://dev.rsalazar.name/js
// @version      0.1.0 [230625]
// @description  ...
// @author       me
// @match        <$URL$>
// @icon         <$ICON$>
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424408/.user.js
// @updateURL https://update.greasyfork.org/scripts/424408/.meta.js
// ==/UserScript==
// +license      GNU GPLv3
// +match        *://*/*
// +require      https://code.jquery.com/jquery-3.6.3.slim.min.js
// revision      230319-0244

(function __script__( $$$ ) {
	'use strict';
	const  _info_ = GM_info.script,
	       _name_ = _info_.name +' v'+ _info_.version,
	       _abbr_ = _info_.name .trim() .split(/\s+/)[ 0 ];

	const  debug  = ( ...args ) => console.debug(_abbr_, ...args),
	       error  = ( ...args ) => console.error(_abbr_, ...args),
	       info   = ( ...args ) => console.info (_abbr_, ...args),
	       warn   = ( ...args ) => console.warn (_abbr_, ...args),
	       log    = ( ...args ) => console.log  (_abbr_, ...args);

	const  MS_SECOND = 1000,
	       MS_MINUTE = MS_SECOND * 60,
	       MS_HOUR   = MS_MINUTE * 60,
	       MS_DAY    = MS_HOUR   * 24,
	       MS_MONTH  = ~~(MS_DAY * 30.5),
	       MS_YEAR   = ~~(MS_DAY * 365.25);

	console.info(_name_, '>>> Starts\n'+ location.href);
	try {

		//on(window, 'DOMContentLoaded', _ => { });
		//on(window, 'hashchange', _ => { });
		//onTreeChange(document.body, _ => { });

	}
	catch( err ) {
		console.error(_name_, '*** Error:', err);
	}
	finally {
		console.info(_name_, '<<< Ends\n'+ location.href);
	}

	// ------------------------------------------------------------------------------------------------

	function hasOwn( obj, prop ) { return Object.hasOwnProperty(obj, prop); }
	function isarr ( expr ) { return Array.isArray(expr); }
	function isbool( expr ) { return ( 'boolean' === typeof expr ); }
	function isdefn( expr ) { return ( undefined !== expr && null !== expr ); }
	function isfn  ( expr ) { return ( 'function' === typeof expr ); }
	function isndef( expr ) { return ! isdef(expr); }
	function isnum ( expr ) { return ( 'number' === typeof expr ); }
	function isstr ( expr ) { return ( 'string' === typeof expr ); }
	function isprim( expr ) { return isdef(expr) && ( isbool(expr) || isnum(expr) || isstr(expr) ); }

	function chain( seed, ...funcs ) { return funcs.reduce( ( resl, fn ) => fn(resl), seed); }
	function ifndef( expr, other = null ) { return isdef(expr)  ? expr  : other; }
	function iif( expr, equals, then ) { return ( ( isfn(equals)  ? equals(expr)  : expr === equals )  ? then  : expr ); }
	function parseJson( text, other ) { try{ return JSON.parse(text); } catch{ return other; } }
	function loadLocal( initl = null, key = _abbr_ ) { return nobj(initl, parseJson(localStorage[ key ])); }
	function saveLocal( data, key = _abbr_ ) { return localStorage[ key ] = JSON.stringify(data), data; }
	function tostr( expr ) { return ( isdef(expr)  ? expr.toString()  : '' ); }

	function  $( sel, cont ) { return 'string' !== typeof sel  ? sel         : (cont || document).querySelector(sel); }
	function $$( sel, cont ) { return 'string' !== typeof sel  ? toarr(sel)  : Array.from((cont || document).querySelectorAll(sel)); }
	function  on( elem, type, fn, opts ) { return elem.   addEventListener(type, fn, opts); }
	function off( elem, type, fn, opts ) { return elem.removeEventListener(type, fn, opts); }


	function toarr( expr ) {
		return ( Array.isArray(expr)  ? expr
		       : isndef(expr)         ? null
		       : ! isNaN(expr.length) ? Array.from(expr)
		       : [ expr ] );
	}



	function call( sel,cont,fn ) {
		'function' === typeof cont && (fn = cont, cont = null);
		return  ($$(sel, cont) || [ ]) .map(fn);
	}



	function isempty( expr, extra ) {
		let  empty = ( ! isdef(expr) || extra && ( 0 == expr || '' === expr ) );

		if ( ! empty && extra && isobj(expr, true) ) {
			empty = true;

			for ( let  key in expr ) {
				empty = false;
				break;
			}
		}
		return  empty;
	}

	function isobj( expr, kind ) {
		return  ( 'object' === typeof expr && ( ! kind || null !== expr && (
			true === kind || expr.constructor === kind || expr.constructor?.name === kind
		) ) );
	}



	function assign( target, ...objs ) {
		if ( target && objs.length ) {
			for ( let  i = 0, n = objs.length;  i < n;  i ++ ) {
				const  obj = objs[ i ];

				for ( let  key in obj ) {
					if ( isobj(obj[ key ], true) && Object.hasOwn(target, key) && isobj(target[ key ], true) ) {
						target[ key ] = assign(target[ key ], obj[ key ]);
					}
					else {
						target[ key ] = obj[ key ];
					}
				}
			}
		}
		return  target;
	}

	function nObj( proto, props, ...assign ) {
		return  Object.assign( Object.create(proto || null, props || undefined), ...assign );
	}

	function nest( expr, path, val ) {
		// isstr(path) && (path = path.split('.'));
		return  ( ! expr || ! path?.length  ? expr
		        : path.length === 1  ? ( isfn(val)  ? val(expr, path.pop())  : (expr[ path.pop() ] = val) )
		        : (expr[ path[ 0 ] ] || (expr[ path[ 0 ] ] = { }),  nest(expr[ path.shift() ], path, val)) );
	}

//	function test( expr, path, actn ){ return empty(expr) ? expr : path && path.length ? test(expr[ path.shift() ], path, actn)
//	                                          : actn ? actn.call(this, expr) : expr; }
	function test( expr, path, acn ) {
		// isstr(path) && (path = path.split('.'));
		return  ( empty(expr)  ? expr
		        : path && path.length  ? test(expr[ path.shift() ], path, acn)
		        : acn  ? acn.call(this, expr)  : expr );
	}



	function matchesTarget( match, target ) {
		try {
			return  target && match && (
				match === 'document'  ? target === document
				: match === 'window'  ? target === window
				: isstr(match)  ? target.matches && target.matches(match)
				: match === target
			);
		}
		catch ( ex ) { 	// show once per 'match'
			const  cache = matchesTarget.__cache || (matchesTarget.__cache = { });
			match in cache || (cache[ match ] = true,  warn('matchesTarget ERROR:', ex));
		}
	}

	function matchesWildcard( expr, text ) {
		return  isstr(expr) && isstr(text) && expr.length > 2 && (
			expr.startsWith('*') && expr.endsWith('*') && text.includes(expr.slice(1,-1))
			|| expr.endsWith('*') && text.startsWith(expr.slice(0,-1))
			|| expr.startsWith('*') && text.endsWith(expr.slice(1))
		);
	}



	function attr( elem, name, value ) {
		if ( elem && name ) {
			if ( Array.isArray(elem) ) { //'object' === typeof elem && 'length' in elem ) {
				return  elem.map( el => attr(el, name, value) );
			}
			else if ( isobj(name, true) ) {
				Object.keys(name)
					.forEach( key => hasOwn(name, key) && attr(elem, key, name[ key ]) );
				return  elem;
			}
			else if ( arguments.length < 3 ) { //undefined === value ) {
				return  elem.getAttribute(name);
			}
			return  elem.setAttribute(name, value), elem;
		}
		return  elem;
	}

	function create( html, attrs, fn ) { //, containerType ) {
		'function' === typeof attrs && (fn = attrs, attrs = null);
		create._host || (create._host = document.createElement('template'));

		const  elems = (create._host.innerHTML = html, Array.from(create._host.content));

		return  attrs && attr(elems, attrs), ( fn ? fn(elems) : elems );
	}


	function onTreeChange( container, onAdded, onRemoved ) {
		'string'   === typeof container && (container = $(container));
		'function' === typeof container && (onRemoved = onAdded, onAdded = container, container = null);
		if ( ! onAdded && ! onRemoved )
			return null;

		const  observer = new MutationObserver( function _onChanged( muts, obs ) {
			for ( let  i = 0, n = muts.length;  i < n;  i ++ ) {
				const  m = muts[ i ],
				       r = onRemoved && Array.from(m.removedNodes) .filter( n => n.nodeType === 1 ),
				       a = onAdded   && Array.from(m.addedNodes  ) .filter( n => n.nodeType === 1 );

				if ( r && r.length > 0 )
					onRemoved(r, m, i, muts, obs);

				if ( a && a.length > 0 )
					onAdded(a, m, i, muts, obs);
			}
		} );
		return  setObserver(container || document.body, observer, true, true, false, false), observer;
	}

	function setObserver( target, observer, children, subtree, attribs, text ) {
		const  elem = $(target),
		       info = { childList: !! children, subtree: !! subtree, attributes: !! attribs, characterData: !! text };
		debug('- setting observer', observer, 'on', elem, ' ('+ target +') for:', info);

		return  observer  ? observer.observe(elem, info)
				: warn('* could not set observer', observer, 'on', elem, ' ('+ target +') for:', info);
	}

})( globalThis.jQuery );