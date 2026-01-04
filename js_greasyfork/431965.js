// ==UserScript==
// @name         [annoy] inmuebles 24
// @namespace    http://dev.rsalazar.name/js
// @version      0.2.0
// @description  ...
// @author       rsalazar
// @match        https://www.inmuebles24.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431965/%5Bannoy%5D%20inmuebles%2024.user.js
// @updateURL https://update.greasyfork.org/scripts/431965/%5Bannoy%5D%20inmuebles%2024.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const  _name_ = GM_info.script.name,
	       debug  = console.debug.bind(console),
	       error  = console.error.bind(console),
	       info   = console.info.bind(console),
	       warn   = console.warn.bind(console),
	       log    = console.log.bind(console);

	console.log(`> User script [${_name_}]`);
	try {
		const  descr = $('#reactDescription');
		descr && onTreeChange(descr, nodes => {
			if ( descr.done )  return ;
			descr.done = true;

			$('.dVvLct.collapsed', descr) .style.maxHeight = 'none';

			$('button', descr) .remove();

			const  reportar = reportBtn( _ => {
				const  id  = ~~location.pathname.replace(/^.+-(\d+)\..+$/, '$1'),
				       msg = encodeURIComponent('Remate no marcado como tal');
				if ( ! id ) {
					alert('Failed to retrieve ID: '+ id);
					return  false;
				}

				let  hide = fetch(`https://www.inmuebles24.com/rp-api/user/posting/${ id }/discarded`, {
					'credentials': 'include',
					'headers': {
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:91.0) Gecko/20100101 Firefox/91.0',
						'Accept': '*/*',
						'Accept-Language': 'en-US,en;q=0.5',
						'X-Requested-With': 'XMLHttpRequest',
						'Sec-Fetch-Dest': 'empty',
						'Sec-Fetch-Mode': 'cors',
						'Sec-Fetch-Site': 'same-origin',
						'Sec-GPC': '1'
					},
					'referrer': location.href,
					'method': 'POST',
					'mode': 'cors'
				});
				let  send = fetch(`https://www.inmuebles24.com/aviso_reporte.ajax?idAviso=${ id }&idTipoReporte=9&mensaje=${ msg }`, {
					'credentials': 'include',
					'headers': {
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:91.0) Gecko/20100101 Firefox/91.0',
						'Accept': '*/*',
						'Accept-Language': 'en-US,en;q=0.5',
						'X-Requested-With': 'XMLHttpRequest',
						'Sec-Fetch-Dest': 'empty',
						'Sec-Fetch-Mode': 'cors',
						'Sec-Fetch-Site': 'same-origin',
						'Sec-GPC': '1'
					},
					'referrer': location.href,
					'method': 'GET',
					'mode': 'cors'
				});
				alert('Reportado!');
				return  true;
			} );
			if ( descr.textContent.toLowerCase().includes('remate') && confirm('Reportar "remate"?') )
				reportar.click();
		} );

	}
	catch( err ) {
		console.warn(`*** User script [${_name_}] error:`, err);
	}
	finally {
		console.log(`< User script [${_name_}]`);
	}


	function reportBtn( text, fn ) {
		'function' === typeof text && (fn = text, text = '');
		const  html =
`<div id="xj-remate-button">
	<div class="TooltipContainer-sc-5aozmg-0 lpmzKt">
		<div class="TooltipButton-sc-5aozmg-1 ckCYva">
			<button aria-label="Reportar remate" title="Reportar remate" class="StyledButton-sc-1b3blmr-0 kZLmuk sc-crrszt dTQxWW YDbLd" font-weight="bold"
			        style="height:40px; width:40px; margin:0 10px;">
				${ text || '!' }
			</button>
		</div>
	</div>
</div>`;
		const  bar = $('.price-container + .button-container'),
		       btn = bar && create(html, null, els => els[ 0 ]);
		return  btn && (btn.onclick = fn || (_ => alert('(clicked)')), append(btn, bar));
	}

	function  $( sel,cont ){ return 'string' !== typeof sel ? sel : (cont || document.body).querySelector(sel); }
	function $$( sel,cont ){ return 'string' !== typeof sel ? sel : Array.from((cont || document.body).querySelectorAll(sel)); }
	function empty( expr, extend ){ return undefined === expr || expr === null || extend && 0 == expr; }
	function test( expr, path, actn ){ return empty(expr) ? expr : path && path.length ? test(expr[ path.shift() ], path, actn)
	                                          : actn.call(this, expr); }

	function append( elem,cont ) {
		return  (cont || document.body).append(elem), elem;
	}

	function create( html, attrs, fn ) { //, containerType ) {
		'function' === typeof attrs && (fn = attrs, attrs = null);
		create._body || (create._body = document.createElement('body'));
		const  elems = (create._body.innerHTML = html, Array.from(create._body.children));
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

	function newObserver( callback, delay ) {
		let  _throttle = 0;
		const  observer = new MutationObserver( function _onChange( ) {
			if ( _throttle )  clearTimeout(_throttle);
			_throttle = setTimeout( _ => callback.apply(this, arguments), ~~delay || 48);
		} );

		return  observer;
	}
	function setObserver( target, observer, children, subtree, attribs, text ) {
		const  elem = $(target),
		       info = { childList: !! children, subtree: !! subtree, attributes: !! attribs, characterData: !! text };
		debug('- setting observer', observer, 'on', elem, ' ('+ target +') for:', info);

		return  observer ? observer.observe(elem, info)
				: warn('* could not set observer', observer, 'on', elem, ' ('+ target +') for:', info);
	}
	function onTreeChange( container, onAdded, onRemoved ) {
		'function' === typeof container && (onRemoved = onAdded, onAdded = container, container = null);
		if ( ! onAdded && ! onRemoved )
			return null;

		const  observer = newObserver(function _onChanged( muts, obs ) {
			for ( let  i = 0, n = muts.length;  i < n;  i ++ ) {
				const  m = muts[ i ],
				       r = onRemoved && Array.from(m.removedNodes) .filter( n => n.nodeType === 1 ),
				       a = onAdded   && Array.from(m.addedNodes  ) .filter( n => n.nodeType === 1 );

				if ( r && r.length > 0 )
					onRemoved(r, m, obs);

				if ( a && a.length > 0 )
					onAdded(a, m, obs);
			}
		});
		return  setObserver(container || document.body, observer, true, true, false, false);
	}

})();
