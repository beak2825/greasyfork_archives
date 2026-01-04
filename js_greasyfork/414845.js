// ==UserScript==
// @name         [debug] listeners
// @namespace    http://dev.rsalazar.name/js
// @version      0.6.240.916.1205
// @description  Layer collecting event listeners (should be 1st script to execute)
// @author       rsalazar
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/414845/%5Bdebug%5D%20listeners.user.js
// @updateURL https://update.greasyfork.org/scripts/414845/%5Bdebug%5D%20listeners.meta.js
// ==/UserScript==

(function _listeners_( $$$ ) {
	'use strict';
	const  _info_ = GM_info.script,
	       _name_ = _info_.name +' v'+ _info_.version,
	       _abbr_ = '[listeners]';

	const  debug  = ( ...args ) => console.debug(_abbr_, ...args, '\n@', getStackFrame(), '\n\t'+ location.href),
	       error  = ( ...args ) => console.error(_abbr_, ...args, '\n@', getStackFrame(), '\n\t'+ location.href),
	       info   = ( ...args ) => console.info (_abbr_, ...args, '\n@', getStackFrame(), '\n\t'+ location.href),
	       warn   = ( ...args ) => console.warn (_abbr_, ...args, '\n@', getStackFrame(), '\n\t'+ location.href),
	       log    = ( ...args ) => console.log  (_abbr_, ...args, '\n@', getStackFrame(), '\n\t'+ location.href);
	// const  debug  = console.debug.bind(console),
	//        error  = console.error.bind(console),
	//        info   = console.info .bind(console),
	//        warn   = console.warn .bind(console),
	//        log    = console.log  .bind(console);

	const  EVENT = ':events:',
	       __add = EventTarget.prototype.addEventListener,
	       __rmv = EventTarget.prototype.removeEventListener,
	       __evs = Object.create(null);

	/**
	 * syntax: { event: filter }
	 * where: event  = string
	 *        filter = boolean | function | { target: boolean | function, ...}
	 */
	const  defaults = {
		events:  {
			'contextmenu':  false,
			'scroll':       true,
			'click':        { window: false, document: null },
	//		'mouse*':       false,
	//		'*wheel':       false,
			'touch*':       false,
			'pointer*':     false,
			'*unload':      false,
		},
		options: { capture: false, dups: false, discover: false, info: false, warn: false, debug: false }
	};
	let  settings = null;
	let  domain = null;
	let  API = null;

	console.info(_name_, '>>> Starts\n', location.href);
	try {
		// const  settings = iif(parse(localStorage[ EVENT ]), x => ! x && false !== x, { });
		settings = loadSettings();

		API = nObj(null, {
			settings: { get: _toString( () => settings ),  set: _toString( opts => saveSettings(settings = opts) ) },
			defaults: { value: _toString( () => defaults ) },
			reset:    { value: _toString( () => (deleteSettings(), settings = defaults) ) },
			update:   { value: _toString( opts => saveSettings(settings = assign(true, settings, opts)) ) },
			version:  { value: _info_.version },
			domain:   { get: _toString( () => domain ) },
			applyTo:  { value: _toString( ( level, opts ) => saveDomainLevelSettings(level, opts || settings) ) },
		});

		Object.defineProperties(unsafeWindow, {
			eventSettings: { value: API }
		});

		if ( false === settings ) {
			warn('*** Aborting - settings:', settings);
			return  true;
		}

		/**
		 * 1) Alter 'EventTarget' instances with custom methods
		 */
		EventTarget.prototype.addEventListener    = _toString(addEventListener);
		EventTarget.prototype.removeEventListener = _toString(removeEventListener);
		EventTarget.prototype.getListeners        = _toString(function( type = '' ) { return getEvents(this, type); });

		_toString(getEvents);

		/**
		 * 2) Set a special version of the custom 'getListeners()' on 'Window'
		 */
		// window.getListeners = ( target, type = '' ) => ( null !== target ? getEvents(target || window, type) : __evs );
		unsafeWindow.getListeners =
		window.getListeners       = _toString(( target, type = '' ) => ( target ? getEvents(target, type) : __evs ));

		info('> scope:', settings);
	}
	catch( err ) {
		console.error(_name_, '*** Error:', err);
	}
	finally {
		console.info(_name_, '<<< Ends');
	}


	function isDefault( settings ) {
		const  result = ! diffAny(defaults, settings);
		return  result;
	}

	function isSavable( settings ) {
		const  result = isdefn(settings) && ! isDefault(settings);
		return  result;
	}

	function loadSettings( settings = null, noSave = null ) {
		// let  domain = getDomain(),
		//      scope  = iif(parse(GM_getValue(domain?.value), null), x => ! x && false !== x, null);
		let  scope = null;
		domain = null;

		for ( let  lvl = 5;  isndef(scope) && lvl >= 2;  lvl -- ) {
			domain = getDomain(lvl);
			// scope  = domain?.value && iif(parse(GM_getValue(domain.value), null), x => ! x && false !== x, null);
			scope  = domain?.value && iif(GM_getValue(domain.value), x => ! x && false !== x, null);
			'string' === typeof scope && (scope = parse(scope, null));
			if ( domain?.level < lvl )
				lvl = domain?.level || lvl;
			// debug('-', lvl, '-nth domain:', domain, 'scope:', scope);
		}

		if ( null === noSave )
			noSave = ! isSavable(settings); //( ! scope && ! settings );
		debug('* loading (for:', domain.value, ') =', { will_save: ! noSave, scope, settings });

		if ( false === scope )  // should we consider 'settings'?
			settings = false;
		else {
			settings = assign(true, null, defaults, scope, settings);
			debug('settings:', settings, 'vs defaults:', defaults);
		}

		if ( ! noSave )
			saveSettings(settings, true);

		return  settings;
	}

	function saveSettings( settings, force = false ) {
		const  savable = force || isSavable(settings);
		debug('saving settings (for:', domain.value, ', savable:', savable, ', forced:', force, '):\n\tsettings:', settings);

		if ( savable )
			// GM_setValue(domain.value, JSON.stringify(settings));
			GM_setValue(domain.value, settings);
		else
			deleteSettings();

		return  settings;
	}

	function saveDomainLevelSettings( level, settings = null ) {
		// const  managed = settings?.events  || Object.create(null),
		//        Opts    = settings?.options || Object.create(null);
		domain = getDomain(level);
		// isndef(settings) && (settings = defaults);
		debug('saving '+ level +'-level domain settings (for:', domain?.value, '):\n\tsettings:', settings);

		if ( ! domain?.value ) {
			warn('Unable to save settings for a TLD (or ccTLD):', level, domain);
		}
		else if ( isSavable(settings) ) {
			// GM_setValue(domain.value, JSON.stringify(settings));
			GM_setValue(domain.value, settings);
			return  true;
		}
		else {
			GM_deleteValue(domain.value);
			warn('deleted (default?) settings for:', domain.value);
			return  true;
		}
		return  false;
	}

	function deleteSettings( ) {
		debug('deleting (default?) settings (for:', domain.value, ')');
		return  GM_deleteValue(domain.value);
	}


	function filterEvent( pack ) {
		const  managed = settings?.events  || Object.create(null),
		       Opts    = settings?.options || Object.create(null);

		if ( Opts.abort )
			return  pack;

		if ( pack.useCapture && false === Opts.capture ) {
			_forceEvOpts(pack) .options.useCapture = false;
			pack.useCapture = false;
		}

		if ( Opts.unsafe )
			_wrapCallback(pack);

		// debugging
		const  cache = filterEvent._cache || (filterEvent._cache = { }),
		       _type = _managed(pack.type);

		if ( _type ) {
			const  entry   = managed[ _type ],
			       targets = ( Array.isArray(entry) ? entry[ 0 ] : null ),
			       matches = ( targets  ? _indexMatchingTarget(targets, pack.target) + 1 && [ targets, 1 ]
				             : isbool(entry) || isfn(entry) || isnum(entry) || _keyMatchingTarget(entry, pack.target) );

			// debugging
			if ( ! (pack.type in cache) )
				Opts.info && debug('\tfiltering:', pack.type, cache[ pack.type ] = { matches, entry, targets, pack }, managed ,Opts.discover,Opts);// ,'\n\t'+location.href);

			if ( matches ) {
				const  action = ( true === matches ? entry : targets ? test(entry, matches) : entry[ matches ] );

				if ( false === action ) {	// banned event
					Opts.info && info('>', pack.type, 'listener filtered out:', pack);
					return  action;
				}
				else if ( true === action || isnum(action) ) {	// passive (delayed callback)
					Opts.info && info('>', pack.type, 'listener filter: delayed or passive:', action, pack ,Opts.info,Opts);// ,'\n\t'+location.href);
					pack = Object.create(pack);
					_makePassive(pack, action);
				}
				else if ( isfn(action) ) {	// custom logic
					Opts.info && info('>', pack.type, 'listener filter logic:', action, pack ,Opts.info,Opts);// ,'\n\t'+location.href);
					pack = Object.create(pack);
					return  action(pack);
				}
				else if ( null !== action ) {	// wt...?!  no idea; remove
					warn('>', pack.type, 'listener filter did not understand managed action for:', _type, action, entry ,Opts.warn,Opts);// ,'\n\t'+location.href);
					delete managed[ pack.type ];
				}
			}
		}
		// debugging
		else if ( ! (pack.type in cache) )
			Opts.discover && debug('\tno filter:', pack.type, cache[ pack.type ] = pack, managed ,Opts.discover,Opts);// ,'\n\t'+location.href);

		return  pack;
	}

	function addEventListener( ...args ) {
		const  Opts = settings?.options || Object.create(null);
		try {
			const  orig = _pack(this, ...args);

			const  pack = filterEvent(orig),
			       ev   = pack && findEvent(pack, true);

			if ( pack?.type ) { 	// omit bad inputs && empty types
				if ( Opts.dups || ! ev ) {
					pack._ = _apply(__add, pack);
					setEvent(pack);
				}
				else  Opts.info && info('>', pack.type, 'skipped duplicate:', pack ,Opts.info,Opts);// ,'\n\t'+location.href);

				return  pack._;
			}
			else  Opts.warn && warn('>', orig.type, 'listener prevented:', orig ,Opts.warn,Opts);// ,'\n\t'+location.href);
		}
		catch( ex ) {
			warn('addEventListener ERROR:', this, args, ex);
		}
	}

	function removeEventListener( ...args ) {
		try {
			const  pack = _pack(this, ...args),
			       evs  = getEvents(pack.target, pack.type),
			       at   = _eventIndex(evs, pack);
		//	debug('> removing:', pack, at, evs);

			if ( at >= 0 ) {
				pack._ = _apply(__rmv, pack); //.target, pack.arguments);
				evs.splice(at, 1);
				return  pack._;
			}
		}
		catch( ex ) {
			warn('removeEventListener ERROR:', this, args, ex);
		}
	}


// 	function removeFromElements( ) {
// 		for ( let  evn in settings ) {
// 			const  val = settings[ evn ];

// 		}

// 		function a( val ) {
// 			if ( 'string' === typeof val ) {
// 				const  obj   = matchesTarget(val, window) && window
// 				            || matchesTarget(val, document) && document;
// 				const  elems = $$(val) .concat(obj);

// 				return  elems;
// 			}
// 			if ( isobj(val) ) {
// 				const  elems = a(val);
// 				return  elems;
// 			}
// 			return  null;
// 		}
// 	}


	function getEvents( target, type = '', create = false ) {
		target || (target = window);
		try {
		//	const  all = target[ EVENT ] || create && (__evs[ target ] = Object.defineProperty(target, EVENT, { value: { }, configurable: true })[ EVENT ]),
			const  all = __evs[ target ] || create && (__evs[ target ] = Object.defineProperty(target, EVENT, { value: { } })[ EVENT ]),
			       evs = all && type && (all[ type ] || create && Object.defineProperty(all, type, { value:[ ] })[ type ]);
			return  ( type ? evs : all ) || null;
		}
		catch( ex ) {
			warn('getEvents ERROR:', this, arguments, ex);
		}
	}

	function setEvent( pack ) {
		const  evs = getEvents(pack.target, pack.type, true);
		return  evs && evs.push(pack);
	}

	function findEvent( pack, create = false ) {
		const  evs = getEvents(pack.target, pack.type, create),
		       ev  = evs && evs[ _eventIndex(evs, pack) ];
		return  ev;
	}


	function _apply( fn, pack ) {
		return  fn.apply(pack.target || unsafeWindow, pack.arguments);
	}

	function _eventIndex( evs, pack ) {
		const  at = evs?.length && evs.findIndex(
			ev => (ev._callback || ev.callback) === (pack._callback || pack.callback)
			      && ev.target === pack.target && ev.type === pack.type
		);
		return  at;
	}

	function _forceEvOpts( pack ) {
		if ( ! isobj(pack.options, true) ) {
			pack.arguments[ 2 ] =
			pack.options        = { useCapture: pack.options };
		}
		return  pack;
	}

	function _indexMatchingTarget( array, target ) {
		return  Array.isArray(array) && array.findIndex( t => matchesTarget(t, target) );
	}

	function _keyMatchingTarget( obj, target ) {
		return  isobj(obj, Object) && Object.keys(obj).find( t => matchesTarget(t, target) );
	}

	function _makePassive( pack, delay ) {
		_forceEvOpts(pack) .options .passive = true;

		if ( isnum(delay) && ! pack._callback ) {
			_wrapCallback(pack, function _delayed( ...args ) {
				setTimeout(pack._callback, delay, ...args);
			});
		}
		return  pack;
	}

	function _makeUnsafe( ev ) {
		return  ( ev.isTrusted ? ev : Object.create(ev, { isTrusted: { value: true, writable: true, enumerable: true } }) );
	}

	function _managed( type ) {
		const  managed = settings?.events || Object.create(null);

		return  type && managed && (
			type in managed  ? type  : Object.keys(managed).find( key => matchesWildcard(key, type) )
		);
	}

	function _pack( target, ...args ) {
		const  [ type, callback, options ] = args;
		return  {
			type,  target,  callback,  options,
			useCapture: ( options === true || options && 'object' === typeof options && !! options.useCapture ),
			arguments:  args,
			// remove:     function( ) { return target.removeEventListener(this.arguments); },
			remove:     () => target.removeEventListener(...args),
		};
	}

	function _toString( obj ) { return (obj.toString = function( ) { return '[ Native code? ]'; }, obj); }

	function _wrapCallback( pack, callback ) {
		if ( ! pack._callback ) {
			pack._callback      = pack.callback;
			pack.arguments[ 1 ] =
			pack.callback       = callback || function( ev, ...args ) {
				const  evX = ( ev.isTrusted ? ev : _makeUnsafe(ev) );
				ev !== evX && log('unsafe event', evX);
				return  pack._callback(evX, ...args);
			};
		}
		return  pack;
	}

	// ------------------------------------------------------------------------------------------------

	function hasOwn( obj, prop ) { return Object.hasOwnProperty(obj, prop); }
	function empty( expr, extend ){ return undefined === expr || expr === null || extend && 0 == expr; }
	function iif( expr, equals, then ){ return ( ( isfn(equals) ? equals(expr) : expr === equals ) ? then : expr ); }
	function isbool( expr ){ return ( 'boolean' === typeof expr ); }
	function isdefn( expr ) { return ( undefined !== expr && null !== expr ); }
	function isfn( expr ){ return ( 'function' === typeof expr ); }
	function isndef( expr ) { return ! isdefn(expr); }
	function isnum( expr ){ return ( 'number' === typeof expr ); }
	function isstr( expr ){ return ( 'string' === typeof expr ); }
	function parse( text, other ){ try{ return JSON.parse(text); } catch{ return other; } }
	function str( expr ){ return ( expr === undefined || null === expr ? '' : expr.toString() ); }
	function   endsWith( str, sub ) { return  str?.slice && sub?.length && str.length >= sub.length && sub === str.slice(-sub.length); }
	function startsWith( str, sub ) { return  str?.slice && sub?.length && str.length >= sub.length && sub === str.slice(0, sub.length); }

	function isobj( expr, kind ) {
		return  ( 'object' === typeof expr && ( ! kind || null !== expr && (
			true === kind || expr.constructor === kind || expr.constructor?.name === kind
		) ) );
	}


	function isAssignDepth( depth ) {
		return  [ 'boolean','number' ].includes(typeof(depth));
	}

	function assign( depth, target, ...objs ) {
		// const  Opts = settings?.options || Object.create(null);
		// debug('\t-> assign - depth:', depth, '\n\t\t- target (obj?', isobj(target), '):', JSON.stringify(target), '\n\t\t- objs(len?', objs.length, '):', objs?.map( o => JSON.stringify(o) ));
		// Opts.debug && debug('\t-> assign -', { depth,  target: JSON.stringify(target),  objs: objs?.map( o => JSON.stringify(o) ), });
		// if ( ! [ 'boolean','number' ].includes(typeof(depth)) ) {
		if ( ! isAssignDepth(depth) ) {
			// Opts.debug && debug('\t- assign (depth:'+ depth +') - missing `depth` argument:', depth);
			objs.shift(target);
			target = depth;
			depth  = false;
		}

		if ( objs.length ) {  //&& isobj(target) ) {
			if ( ! depth ) {
				// Opts.debug && debug('\t- assign (depth:'+ depth +') - empty `depth`:', depth);
				return  Object.assign(target, ...objs);
			}
			if ( ! target || ! isobj(target, true) ) {
				// Opts.debug && debug('\t- assign (depth:'+ depth +') - empty `target`:', target);
				target = Object.create(null);
			}

			'number' === typeof(depth) && depth --;

			for ( let  i = 0, n = objs.length;  i < n;  i ++ ) {
				const  obj = objs[ i ];
				// Opts.debug && debug('\t- assign (depth:'+ depth +') -\n\t\ttarget:', JSON.stringify(target), '\n\t\tsource:', JSON.stringify(obj));

				for ( let  key in obj ) {
					// Opts.debug && debug('\t\t- assign (depth:'+ depth +') - at `', key, '`:', target[ key ], '<-', obj[ key ]);

					if ( isobj(obj[ key ], true) ) { //&& Object.hasOwn(target, key) && isobj(target[ key ], true) ) {
						if ( key in target && ! isobj(target[ key ], true) )
							target[ key ] = null;

						// Opts.debug && debug('\t\t\t- assign (depth:'+ depth +') - ^ recursive call...');
						target[ key ] = assign(depth, target[ key ], obj[ key ]);
						// Opts.debug && debug('\t\t\t- ...end ^ recursive call');
					}
					else if ( undefined === obj[ key ] ) {
						// Opts.debug && debug('\t\t\t- assign (depth:'+ depth +') - removing undefined');
						delete target[ key ];
					}
					else {
						// Opts.debug && debug('\t\t\t- assign (depth:'+ depth +') - ^ direct assignment');
						target[ key ] = obj[ key ];
					}
				}
			}
		}
		// Opts.debug && debug('\t<- assign (depth:'+ depth +') =', JSON.stringify(target));
		return  target;
	}

	function nObj( proto, props, ...assign ) {
		let  obj = Object.create(proto || null, props || undefined);

		if ( assign?.length > 0 ) {
			if ( isAssignDepth(assign.at(0)) ) {
				const  depth = assign.unshift();

				obj = assign(depth, obj, ...assign);
			}
			else
				obj = Object.assign(obj, ...assign);
		}
		return  obj;
	}

	function test( expr, path, acn ) {
		// isstr(path) && (path = path.split('.'));
		return  ( empty(expr)  ? expr
		        : path && path.length  ? test(expr[ path.shift() ], path, acn)
		        : acn  ? acn.call(this, expr)  : expr );
	}

	function  $( sel,cont ){ return 'string' !== typeof sel  ? sel  : (cont || document).querySelector(sel); }
	function $$( sel,cont ){ return 'string' !== typeof sel  ? sel  : Array.from((cont || document).querySelectorAll(sel)); }
	function  on( elem,type,fn,opt ){ return elem.   addEventListener(type, fn, opt); }
	function off( elem,type,fn,opt ){ return elem.removeEventListener(type, fn, opt); }


	// educated guess on whether a Top-Level Domain (TLD) is a Country Code TLD (ccTLD)
	function isCcTld( tld ) {
		return  ( tld?.length === 2 && ! [ 'wl' ].includes(tld) );
	}

	// extracts a domain of the specified level (or similar) from the current location's hostname
	function getDomain( level = 2 ) {
		// const  Opts = settings?.options || Object.create(null);
		let  value = location.hostname,
		     nsegs = level,
		     ctry  = false,
		     min   = 0;

		if ( level != 0 ) {
			const  segs = value.split('.');
			ctry = isCcTld(segs.at(-1)),
			min  = ( ctry ? 3 : 2 );

			if ( level < 0 ) {
				nsegs = -level;
			}
			else {
				// account for country TLD
				if ( ctry )
					nsegs ++;

				nsegs = Math.min(nsegs, segs.length);

				// skip the 'www.' prefix
				if ( nsegs > min && segs.at(-nsegs) === 'www' )
					nsegs --;
			}

			if ( nsegs < min )
				nsegs = min;

			value = ( nsegs < min  ? ''  : segs.slice(-nsegs) .join('.') );
		}

		// Opts.debug && debug('* value:', value, 'for:', location.hostname);
		// return  { value,  level: nsegs,  min,  cctld: ctry };
		return  nObj(null, { value: { value: value },  level: { value: nsegs },  min: { value: min },  cctld: { value: ctry } });
	}


	// Not responsible for checking `diffTypes()`
	function diffAny( a, b, notifier ) {
		let  diff = ( a !== b );

		// continue if they're NOT identifical
		if ( diff ) {
			diff = diffTypes(a, b, notifier);

			// ...and their types are the same
			if ( ! diff ) {
				// compare as arrays
				if ( Array.isArray(a) )
					diff = diffArrays(a, b, notifier);
				// compare as objects
				else if ( isobj(a, true) )
					diff = diffObjects(a, b, notifier);
				// compare as scalars
				else if ( (diff = a != b) && notifier ) {
					let  newDiff = notifier(a, b, '==', a, b);

					if ( newDiff === false )
						diff = false;

					// debug('\t\tdiff value (', newDiff, '):', typeof a, a, 'vs', typeof b, b);
				}
			}
		}

		// // debug('\tdiffAny:', diff, 'between:\n\ta:', typeof a, a, '\n\tb:', typeof b, b);
		return  diff;
	}

	// Assumes the same data type: array; not responsible for checking `diffTypes()`
	function diffArrays( a, b, notifier ) {
		let  diff = ( a !== b ),
		     xa   = a,
		     xb   = b;

		// continue if they're NOT identifical
		if ( diff ) {
			const  la = xa = a?.length,
			       lb = xb = b?.length;
			diff = ( la !== lb );

			// continue if their lengths are the same
			if ( ! diff ) {
				for ( let  i = 0, n = la;  ! diff && i < n;  i ++ ) {
					const  va = xa = a[ i ],
					       vb = xb = b[ i ];

					// check if their (key) values differ
					diff = diffAny(va, vb, notifier);
				}
			}
			else if ( notifier ) {
				let  newDiff = notifier(la, lb, 'length', a, b);

				if ( newDiff === false )
					diff = false;

				// debug('\t\tdiff length (', newDiff, '):', xa, 'vs', xb);
			}
		}

		// // debug('\tdiffArrays:', diff, 'between:\n\ta:', typeof xa, xa, '\n\tb:', typeof xb, xb);
		return  diff;
	}

	// Assumes the same data type: array; not responsible for checking `diffTypes()`
	function diffObjects( a, b, notifier ) {
		let  diff = ( a !== b ),
		     xa   = a,
		     xb   = b;

		// continue if they're NOT identifical
		if ( diff ) {
			// check if their keys are the same
			let  _pv;
			const  ka = xa = Object.keys(a),
			       kb = xb = Object.keys(b),
			       kk = ka.concat(kb) .sort()
			       	.filter( n => ( n != _pv && (_pv = n, true) ) );

			diff = ! kk.every( k => k in a && k in b );

			// continue if their keys are the same
			if ( ! diff ) {  //(diff = diffArrays(ka, kb, notifier)) ) {
				for ( let  i = 0, n = ka.length;  ! diff && i < n;  i ++ ) {
					const  k  = ka[ i ],
					       va = xa = a[ k ],
						   vb = xb = b[ k ];

					// check if their (key) values differ
					diff = diffAny(va, vb, notifier);
				}
			}
			else if ( notifier ) {
				let  newDiff = notifier(xa, xb, 'keys', a, b);

				if ( newDiff === false )
					diff = false;

				// debug('\t\tdiff keys (', newDiff, '):', xa, 'vs', xb);
			}
			// else
			// 	debug('\t\tdiff keys:', xa, 'vs', xb);
		}

		// // debug('\tdiffObjects:', diff, 'between:\n\ta:', a, '\n\tb:', b);
		return  diff;
	}

	function diffTypes( a, b, notifier ) {
		let  diff = ( a !== b ),
		     xa   = a,
		     xb   = b;

		// continue if they're NOT identifical
		if ( diff ) {
			const  ta   = xa = typeof a,
			       tb   = xb = typeof b;
			diff = ( ta !== tb );

			if ( diff && notifier ) {
				let  newDiff = notifier(ta, tb, 'typeof', a, b);

				if ( newDiff === false )
					diff = false;

				// debug('\t\tdiff typeof (', newDiff, '):', xa, 'vs', xb);
			}
			// else if ( diff )
			// 	debug('\t\tdiff typeof:', xa, 'vs', xb);
		}

		// // debug('\tdiffTypes:', diff, 'between:\n\ta:', typeof xa, xa, '\n\tb:', typeof xb, xb);
		return  diff;
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
			endsWith(expr, '*') && startsWith(expr, '*') && text.includes(expr.slice(1,-1))
			|| endsWith(expr, '*') && startsWith(text, expr.slice(0,-1))
			|| startsWith(expr, '*') && endsWith(text, expr.slice(1))
		);
	}


	function getStack( plain = false,  from = NaN,  upto = NaN ) {
		let  stack = Error().stack .split(/\n    at /) .slice(1 + 1);

		if ( ! isNaN(from) || ! isNaN(upto) ) {
			isNaN(from) && (from = 0);
			isNaN(upto) && (upto = stack.length);
			stack = stack.slice(from, upto);
		}

		plain && (stack = stack.map( frm => ! frm.endsWith(')') ? frm : frm.replace(/\)$/,'').replace(/^.+\(/,'') ));

		return  stack;
	}

	function getStackFrame( index = 1,  plain = false ) {
		const  frame = ( isNaN(index) ? null : getStack(plain, ++ index, index + 1) );
		return  frame.at(0);
	}

})( globalThis.jQuery );