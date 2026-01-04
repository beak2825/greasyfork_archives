// ==UserScript==
// @name         [annoy] viva anuncios
// @namespace    http://dev.rsalazar.name/js
// @version      0.2.240.224
// @description  don't ask me!
// @author       me
// @match        https://www.vivanuncios.com.mx/*
// @icon         https://icons.duckduckgo.com/ip2/vivanuncios.com.mx.ico
// @run-at       document-idle
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/488277/%5Bannoy%5D%20viva%20anuncios.user.js
// @updateURL https://update.greasyfork.org/scripts/488277/%5Bannoy%5D%20viva%20anuncios.meta.js
// ==/UserScript==
// +match        *://*/*
// +require      https://code.jquery.com/jquery-3.6.0.slim.min.js

(function __script__( $$$ ) {
	'use strict';
	const  _info_ = GM_info.script,
	       _name_ = _info_.name +' v'+ _info_.version,
	       _abbr_ = '[viv-an]';

	const  debug  = ( ...args ) => console.debug(_abbr_, ...args),
	       error  = ( ...args ) => console.error(_abbr_, ...args),
	       info   = ( ...args ) => console.info (_abbr_, ...args),
	       warn   = ( ...args ) => console.warn (_abbr_, ...args),
	       log    = ( ...args ) => console.log  (_abbr_, ...args);
	console.info(_name_, '>>> Starts\n'+ location.href);

	const  HOUR = 60 * 60000,
	       DAY  = 24 * HOUR;
	const  now    = new Date( ),
	       isProp = ( 'undefined' !== typeof POSTING );
	try {
		isProp && location.search && (location.href = location.href.slice(0, -location.search.length));

		isProp && on(window, 'load', ev => {
			// set informative title
			const  post  = POSTING,
			       price = round2(POSTING.priceOperationTypes
			       	.find( t => t.operationType.name === 'venta' )
			       	?.prices[ 0 ].amount / 1000000),
			       props = Object.values(POSTING.mainFeatures)
			       	.reduce( ( o,p ) => (p.icon && (o[ p.icon ] = p.value), o), { }),
			       age   = extractDateV2(POSTING.createdDate),
			       place = extractLocationV2(POSTING.postingLocation),
			       data  = Object.assign({ price, age, place, post,
			       	//get place( ) { return $('.location-name', contn)?.textContent.trim(); },
			       	get title( ) {
						return  `${ this.price } - ${ this.stotal || this.scubierta || '???' } ${ this.dormitorio || '?' }`
						       +` / ${ +this.bano + (this.toilete ? .5 : 0) || '?' } / ${ this.cochera || '?' }`
						       +` (${ this.age || '-' }) - ${ this.place?.ciudad || this.place?.addr || '??' }`;
					},
			       }, props);
			Object.assign(window, { _data: data });
			debug('data:', data);

			document.title = data.title;
			document.body.dataset.from = age;

			const  days  = ~~((Date.now() - POSTING.createdDate) / DAY),
			       weeks = ~~(days / 7);
			document.body.dataset.days  = days;
			document.body.dataset.weeks = weeks;
			addCss({ days, weeks, hue: (182 - 7 * (26 - Math.max(26, weeks))) +'deg', }, 'js-');

			// convert to links 1...
			const  recommended = $('#react-recommended-item');
			recommendLinks(recommended);
			onTreeChange(recommended, ( add ) => recommendLinks(recommended) );

			// convert to links 2...
			onTreeChange($('#wrapper.wrap'), ( add, mut, i, muts, obs ) => {
				add.filter( el => el.matches('.srp-map-infowindow') )
					.flatMap( el => $$('[data-view-ad-url]', el) )
					.forEach( el => {
						const  lnk = create('<a></a>', { href: el.dataset.viewAdUrl }) .at(0);
						Array.from(el.children).map( ch => lnk.append(ch) );
						el.append(lnk);
					} );
			} );

			// set default messages
			let  timers = 9, timer =
			setInterval( _ => {
				document.title = data.title;
				$$('textarea[name="replyMessage"]')
					.forEach( ta => ta.value = 'Hola. ¿Aún está disponible esta propiedad?\nSi no, ¿podrían eliminar el anuncio, por favor?' );
				$$('textarea[name="comments"]')
					.forEach( ta => ta.value = 'Remate anunciado como venta. Filtren esa basura!\n\nAnuncio de 6+ meses' );
				-- timers || clearInterval(timer);
			}, 1250);
		} );

	}
	catch( err ) {
		console.error(_name_, '*** Error:', err);
	}
	finally {
		console.info(_name_, '<<< Ends');
	}


	function extractDateV2( stamp ) {
		if ( ! isNaN(stamp) ) {
			const  date  = new Date( stamp );
			return  [ date.getYear() % 100, date.getMonth() + 1, date.getDay() ]
				.map( n => padStr(n) ) .join('');
		}
		return  NaN;
	}

	function extractLocationV2( loc ) {
		let  n = 6,  info = { addr: loc.address?.name || '' };
		for ( loc = loc.location;  n -- && loc;  loc = loc.parent ) {
			loc.label && (info[ loc.label.toLowerCase() ] = loc.name);
		}
		info.ciudad && (info.ciudad = shortCity(info.ciudad));
		return  info;
	}


	function aton( text ) {
		text = text?.trim() || '';
		const  mxn = text && text.startsWith('MN ');
		return  Math.round(text.replace(/^MN |,/g,'') / 10000) / 100;
	}

	function extractData( obj, li ) {
		const  name = Array.from($('i[class]', li)?.classList || [ ])
			.find( cls => cls.startsWith('icon-') )?.slice(5);
		let  value = li?.textContent ?.replace(/\n+|\t+/g, ' ') .trim();
		value = value
			.replace(/m² \w+\.|rec\.|estac\.|(?:Ba|A)ños?/g, '')
			.replace(/\s+/, ' ');
		return  obj[ name ] = ( isNaN(value) ? value : +value ), obj;
	}

	function extractDate( el ) {
		const  text = el?.textContent ?.trim() .replace(/^Publicado hace |es(?:es)?\s*$|ías?\s*$|oras?\s*$/g, ''),
		       unit = text && text.slice(-2),
		       num  = text && +text.slice(0, -2);

		if ( unit && ! isNaN(num) ) {
			const  MONTH = 30.5 * DAY;
			const  diff = num * ( ' m' === unit  ? MONTH  : ' d' === unit  ? DAY  : ' h' === unit  ? HOUR   : NaN );

			if ( ! isNaN(diff) ) {
				const  date  = new Date( Date.now() - diff );
				return  [ date.getYear() % 100, date.getMonth() + 1, date.getDay() ]
					.map( n => padStr(n) ) .join('');
			}
		}
		return  text;
	}

	function extractLocation( el ) {
		let  addr = $('.section-location-property h4') ?.textContent,
		     arr  = addr ?.split(/,\s*/);
		arr?.length && (arr[ arr.length - 1 ] = shortCity(arr[ arr.length - 1 ]));
		return  { addr, area: arr }; //addr && { addr, area: arr } || null;
	}


	function recommendLinks( container ) {
		return  $$('[data-to-posting]:not(.js-moved)', container)
			.map( el => {
				const  link = create('<a href="" class="js-post">', { href: el.dataset.toPosting }, els => els?.at(0) );
				el.classList.add('js-moved');
				el.parentElement.insertBefore(link, el);
				link.append(el);
				return  link;
			} );
	}

	function shortCity( city ) {
		return  city && city
			.replace('Villa de Alvarez',      'VdA')
			.replace('Santa Catarina',        'SC')
			.replace('Monterrey',             'Mty')
			.replace('Zapopan',               'Zap')
			.replace('Guadalajara',           'Gdl')
			.replace('San Pedro Tlaquepaque', 'Tlaq')
		;
	}

	function addCss( vars, prefix = '' ) {
		const  id = 'js-vars',
		       el = vars && create(`<style type="text/css">
html body { border:   dotted .5rem hsl(var(--js-hue,240deg) 50% 50%); }
html body::before {
	pointer-events: none;
	content:  'xxx';
	position: absolute;
	bottom:   0;
	right:    0;
	left:     0;
	top:      0;
	border:   dotted .5rem hsl(var(--js-hue,240deg) 50% 50%);
}
</style>`, { id })[ 0 ];
			// el = vars && create('<style type="text/css">'
			// +( vars.hue && '\n\thtml body::before { content: ""; border: dotted .5rem hsl('+ (180 - vars.hue) +'deg 50% 50%); }' || '' )
			// +'\n</style>', { id })[ 0 ];
		$('#'+ id) ?.remove();

		if ( el ) {
			const  css = Object.keys(vars)
				.reduce( ( css,key ) => (css += `--${ prefix + key }: ${ vars[ key ] }; `), ' ');

			el.innerHTML = `:root {${ css }}`+ el.innerHTML;
			document.head.append(el);
		}
		return  el;
	}

	// ------------------------------------------------------------------------------------------------

	function padStr( val, length = 2, pad = '0' ) {
		if ( undefined !== val && null !== val && pad?.length > 0 ) {
			let  text = val?.toString();

			while ( text.length + pad.length <= length )
				text = pad + text;

			return  text;
		}
		return  '';
	}

	function empty( expr, extend ){ return undefined === expr || expr === null || extend && 0 == expr; }
	function isbool( expr ){ return ( 'boolean' === typeof expr ); }
	function isfn( expr ){ return ( 'function' === typeof expr ); }
	function isnum( expr ){ return ( 'number' === typeof expr ); }
	function isstr( expr ){ return ( 'string' === typeof expr ); }
	function parse( text, other ){ try{ return JSON.parse(text); } catch{ return other; } }
	function round2( num, dec = 2 ) { let p = Math.pow(10, dec);  return Math.round(p * num) / p; }
	function str( expr ){ return ( expr === undefined || null === expr ? '' : expr.toString() ); }

	function isobj( expr, kind ) {
		return  ( 'object' === typeof expr && ( ! kind || null !== expr && (
			true === kind || expr.constructor === kind || expr.constructor?.name === kind
		) ) );
	}

	function   $( sel,cont ){ return 'string' !== typeof sel ? sel : (cont || document).querySelector(sel); }
	function  $$( sel,cont ){ return 'string' !== typeof sel ? sel : Array.from((cont || document).querySelectorAll(sel)); }
	function  on( elem,type,fn,opt ){ return elem.   addEventListener(type, fn, opt); }
	function off( elem,type,fn,opt ){ return elem.removeEventListener(type, fn, opt); }

//	function test( expr, path, actn ){ return empty(expr) ? expr : path && path.length ? test(expr[ path.shift() ], path, actn)
//	                                          : actn ? actn.call(this, expr) : expr; }
	function test( expr, path, acn ) {
		// isstr(path) && (path = path.split('.'));
		return  ( empty(expr)  ? expr
		        : path && path.length  ? test(expr[ path.shift() ], path, acn)
		        : acn  ? acn.call(this, expr)  : expr );
	}
	function nest( expr, path, val ) {
		// isstr(path) && (path = path.split('.'));
		return  ( ! expr || ! path?.length  ? expr
		        : path.length === 1  ? ( isfn(val)  ? val(expr, path.pop())  : (expr[ path.pop() ] = val) )
		        : (expr[ path[ 0 ] ] || (expr[ path[ 0 ] ] = { }),  nest(expr[ path.shift() ], path, val)) );
	}

	function matchesTarget( match, target ) {
		try {
			return  target && match && (
				match === 'document' ? target === document
				: match === 'window' ? target === window
				: isstr(match) ? target.matches && target.matches(match)
				: match === target
			);
		}
		catch ( ex ) { 	// show once per 'match'
			const  cache = matchesTarget.__cache || (matchesTarget.__cache = { });
			match in cache || (cache[ match ] = true,  warn('matchesTarget ERROR:', ex));
		}
	}
	function matchesWildcard( expr, text ) {
		return  expr && text && (
			expr.startsWith('*') && text.endsWith(expr.slice(1))
			|| expr.endsWith('*') && text.startsWith(expr.slice(-1))
		);
	}


	function call( sel,cont,fn ) {
		'function' === typeof cont && (fn = cont, cont = null);
		return  ($$(sel, cont) || [ ]) .map(fn);
	}

	function create( html, attrs, fn ) { //, containerType ) {
		'function' === typeof attrs && (fn = attrs, attrs = null);
		create._host || (create._host = document.createElement('template'));
		const  elems = (create._host.innerHTML = html, Array.from(create._host.content.children));
		return  attrs && attr(elems, attrs), ( fn ? fn(elems) : elems );
	}

	function attr( elem, name, value ) {
		if ( elem && name ) {
			if ( Array.isArray(elem) ) { //'object' === typeof elem && 'length' in elem ) {
				return  elem.map( el => attr(el, name, value) );
			}
			else if ( name.constructor === Object ) {
				Object.keys(name)
					.forEach( key => name.hasOwnProperty(key) && attr(elem, key, name[ key ]) );
				return  elem;
			}
			else if ( arguments.length < 3 ) { //undefined === value ) {
				return  elem.getAttribute(name);
			}
			return  elem.setAttribute(name, value), elem;
		}
		return  elem;
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

		return  observer ? observer.observe(elem, info)
				: warn('* could not set observer', observer, 'on', elem, ' ('+ target +') for:', info);
	}

})( globalThis.jQuery );