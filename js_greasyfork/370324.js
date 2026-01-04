// ==UserScript==
// @name         [annoy] kalcho
// @namespace    http://dev.rsalazar.name/js/
// @version      0.6.1
// @description  ...
// @author       rsalazar
// @match        https://www.kalcho.com.mx/*
// @match        http://www.kalcho.com.mx/*
// @grant        none
// @run-at       document-end
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/370324/%5Bannoy%5D%20kalcho.user.js
// @updateURL https://update.greasyfork.org/scripts/370324/%5Bannoy%5D%20kalcho.meta.js
// ==/UserScript==
// +match        https://www.kalcho.com.mx/sfut/site/?id=350*

(function _init( $, undefined ) {
	'use strict';

	const  __name = '[annoy] Kalcho'
	      ,__mark = 'xnj-kalcho-done'
	      ,_abbr_ = '[kalcho]';
	console.info('>>>>> '+ __name +' Started >>>>>');

	const  debug  = ( ...args ) => console.debug(_abbr_, ...args),
	       error  = ( ...args ) => console.error(_abbr_, ...args),
	       info   = ( ...args ) => console.info (_abbr_, ...args),
	       warn   = ( ...args ) => console.warn (_abbr_, ...args),
	       log    = ( ...args ) => console.log  (_abbr_, ...args);

	if ( top !== window ) {
		console.warn('***', __name, 'Stopped because it is not in the top window');
		return ;
	}

	const  millis = ( from,to ) => (to || Date.now()) - from;
	const  hours  = ( from,to ) => millis(from, to) / 3600000;

	const  isarr  = expr => isobj(expr, Array);
	const  isbool = expr => ( 'boolean' === typeof expr );
	const  isnum  = expr => ( 'number' === typeof expr );
	const  isobj  = ( expr,type ) => ( 'object' === typeof expr && ( ! type || null !== expr && ( true === type ||
	                !! expr.constructor && type === ( isstr(type) ? expr.constructor.name : expr.constructor ) ) ) );
	const  isstr  = expr => ( 'string' === typeof expr );
	const  ndef   = expr => ( 'undefined' === typeof expr );

	console.log('* Using jQuery ver.', $.fn.jquery);

	// "Extensions"
	Array.prototype.remove = function( value ) {
		const  index = this.indexOf(value);
		return  ( index < 0 ? this : this.slice(0, index).concat(this.slice(index + 1)) );
	};
	$.fn.wraps = function( content ) {
		content.jquery && content.wrapAll(this) || $(content).wrapAll(this);
		return  this;
	};


	const  tabNames = [ 'positions','fixtures','scores' ];
	const  headers =  [
		null,
		{ Equipos: 'Local', Equipos_2: 'vs', Equipos_3: 'Visitante' },
		{ Equipo: 'Local', Equipo_2: 'Visitante', Goles: 'GL', Goles_2: 'GV' },
	];
	const  numerics = [
		[ 'Lugar','JJ','JG','JE','JP','GF','GC','DG','PTS' ],
		[ 'Campo' ],
		[ 'GL','GV' , 'Goles','Goles 2' ],
	];
	const  query  = queryValues();
	let  kalcho    = null,
	     league    = null,
	     scoreCols = false;

	try {
		kalcho = window.kalcho = extendKalcho(localJson('kalcho'));
		league = window.league = kalcho.league();
		console.log('* Retrieved Kalcho:', kalcho);

		const  searched = (query.search || '').toUpperCase().split(',');
		0 != searched && (league.favorites = searched || [ ], kalcho.save(false));

		addCSS();

		if ( location.pathname.startsWith('/sfut/site/') && location.search ) {
			if ( !! league && kalcho.loaded() && ! kalcho.isOld() ) {
				addSummary();
			} else {
				kalcho.clear()
					.crawl();
			}
		}

		document.body.parentElement.classList.add(__mark);
	} finally {
		console.info('<<<<< '+ __name +' Finished <<<<<');
	}


	function localJson( key, value ) {
		if ( !! key && isstr(key) ) {
			try {
				if ( ndef(value) ) {
					return  parseJson(localStorage[ key ]);
				} else if ( null === value ) {
					return  localStorage.removeItem(key);
				} else {
					return  localStorage[ key ] = JSON.stringify(value);
				}
			} catch ( error ) {
				console.warn('* localJson() error:', error, '\n\tfor:', key, value);
			}
		}
		return  null;
	}

	function parseJson( text, other = null ) {
		try {
			return  JSON.parse(text);
		}
		catch {
			return  other;
		}
	}

	function extendKalcho( kalcho ) {
		kalcho = $.extend(kalcho || { }, {
			get ID( ) { return ~~query.id; },
			league: function( id ){ return (this[ id || this.ID ]); },
			// clear:  function( id ){ return (id = id || this.ID, this[ id ] = $.extend(this[ id ], { positions: null, fixtures: null, scores: null }), this); },
			clear:  function( id ){ return (id = id || this.ID, this[ id ] = $.extend(this[ id ], tabNames.reduce( ( o,t ) => (o[ t ] = null, o), { })), this); },
			isOld:  function( id ){ return ( ! this[ id || this.ID ]?.lastUpdate || this.utils.hours(this[ id || this.ID ].lastUpdate) >= 4 ); },
			// loaded: function( id ){ return (id = id || this.ID, !! this[ id ]?.positions && !! this[ id ]?.fixtures && !! this[ id ]?.scores ); },
			loaded: function( id ){ return (id = id || this.ID, !! this[ id ] && tabNames.every( t => this[ id ][ t ] ) ); },
			reload: function( ){ return (kalcho = extendKalcho(localJson('kalcho'))); },
			save:   function( updated, id ) {
				updated && (this[ id || this.ID ].lastUpdate = Date.now());
				return  localJson('kalcho', this), this;
			},
			crawl:  function( id ) { return loadTabs.call(this, id); },
			utils: {
				millis: millis,
				hours:  hours,
			},
		});

		kalcho.league() || kalcho.clear();
		return  kalcho;
	}

	function loadTabs( id ) {
		id = id || this.ID;
		const  atTab = currentTab();

		tabNames.forEach( ( name,n ) => {
			if ( n === atTab ) {
				loadTables(n, $('table.table').get(), id);
			} else {
				retrieveTab(n, id);
			}
		} );
		return  this;
	}

	function currentTab( ) {
		let  temp = currentTab.result;
		if ( isNaN(temp) ) {
			const  tabs = $('ul.nav-tabs a').get().map( a => {
				const  val = (a.getAttribute('onclick') || '').slice(11, 13);
				return  ( ! val ? NaN : isNaN(val) ? 0 : parseInt(val) );
			} );
			temp = tabs[ 1 ];  tabs[ 1 ] = tabs[ 0 ];  tabs[ 0 ] = temp;
			currentTab.result =
			temp              = tabs.findIndex( t => isNaN(t) );
		}
		console.log('-> current tab:', temp);
		return  temp;
	}

	function retrieveTab( tab, id ) {
		$.ajax(location.href +'&hv='+ tab, {
			method:   'POST',
			data:     { 'hval1':( tab ? '0'+ tab : '' ) },
			complete: ( xhr, status ) => {
				if ( xhr && 'success' === status ) {
					const  html   = xhr.responseText,
					       $html  = $(html),
					       tables = $html.find('table.table') .get();
					loadTables(tab, tables, id);
				}
			}
		});
	}

	function loadTables( tab, tables, id ) {
		const  name = tabNames[ tab ];
		log('loading league:', id, 'tab:', tab, name, 'tables:', tables?.length);

		if ( tables?.length ) {
			league[ name ] = tables.map( ( tbl,i ) => readTable(tbl, tab) .at(0) ); // 1st (& only?) tbody
			log('->', name, league[ name ]);

			if ( kalcho.loaded(id) ) {
				kalcho.save(true, id);
				addSummary();
			}
		}
		else  warn('-> aborted; no tables');
	}

	function readTable( table, tab ) {
		const  thead  = table?.tHead,
		       trh    = thead && Array.from(thead.rows).at(-1),
		       labels = headers[ tab ],
		       fields = trh && Array.from(trh.cells)
		                	.map( cell => cell.textContent.trim() )
		                	.map( lbl => labels && labels[ lbl ] || lbl ),
		       data   = Array.from(table.tBodies)
		                	.map( body => readBody(body, fields, +tab) );
		return  data;

		function readBody( body, fields, tab ) {
			const  data = [ ];

			if ( fields?.length === 1 )
				fields = null;
			let  idx = null;

			for ( let  r = 0, nr = body.rows.length;  r < nr;  r ++ ) {
				const  row   = body.rows[ r ],
				       cells = Array.from(row.cells);

				cells.length === 1 && (idx = cells[ 0 ].textContent.trim(), fields = null); 	// cambio de "jornada"

				if ( fields )
					data.push(readCells(cells, fields, numerics[ tab ], { _group: idx }));
				else if ( cells.length > 1 )
					fields = cells.reduce( ( array,cell ) => {
							const  text = cell.textContent.trim();

							if ( cell.colSpan > 1 )
								createRange(1, cell.colSpan || 1)
									.forEach( n => array.push(text + (n > 1 ? '_'+ n : '')) );
							else
								array.push(text + (array.includes(text) ? '_2' : ''));
							return  array;
						}, [ ])
						.map( lbl => labels && labels[ lbl ] || lbl );
			}
			return  data;
		}

		function readCells( cells, fields, numerics, baseObj ) {
			return  cells.reduce( ( obj,cell,c ) => {
					const  field = fields[ c ],
					       value = cell.textContent.trim();

					return  obj[ field ] = ( value !== '' && numerics?.includes(field) ? +value : value ) ,obj;
				}, baseObj || { });
		}
	}

	function addSummary( ) {
		let  table, tab = currentTab(),
		     references = $('table.table').get();
		console.log('* Adding summary before/after:', references, tab);
		$('.xnj-table').get().forEach( tbl => tbl.remove() );

		for ( let  i = 0, n = references.length;  i < n;  i ++ ) {
			const  reference = references[ i ];

			if ( 0 === tab ) {
				table = createResults(i, true);
				!! table && $(table).insertAfter(reference);
				addLinksToWeeks(reference);
				addLinksToTeams(reference, table);
			} else {
				table = createPositions(i, true);
				!! table && $(table).insertBefore(reference);
			}
		}
	}

	function createResults( index, decorate, id ) {
		const  fixtures = league.fixtures[ index ],
		       scores   = league.scores  [ index ];

		if ( fixtures && scores && fixtures.length === scores.length ) {
			let  table   = newTable([ 'Fecha', 'Hora', '#', 'Local', 'Goles', 'Visitante' ], 'xnj-summary', 'Rol de Juegos'),
			     columns = [ 'Fecha', 'Hora', 'Campo', 'Local', 'Score', 'Visitante' ],
			     ng = 0, group, row, sc, week = 0, last = null, stats = { };

			for ( let  g = 0, i = 0, n = fixtures.length;  i < n;  i ++ ) {
				const  fx = fixtures[ i ],
				       sc = scores.find( sc => ! compStr(sc._group, fx._group) && ! compStr(sc.Local, fx.Local) );

				if ( compStr(fx._group, sc?._group) ) {
					const  msg = `createResults() error: Groups mismatch at row ${ i }: '${ fx._group }' vs '${ sc?._group }'`;
					throw  console.warn(msg +':', fx, '!=', sc), msg;
				}

				if ( compStr(group, fx._group) ) {
					group = fx._group;
					$('<th colspan="6"></th>') .attr('id', 'j'+ ++ g) .text(group)
						.wrapAll('<tr class="xnj-subtitle"></tr>')
						.appendTo(table.tbody);
				}

				if ( fx.Local !== sc.Local || fx.Visitante !== sc.Visitante ) {
					const  msg = `createResults() error: fixture and score do not match ${fx} != ${sc}`;
					throw  console.warn(msg +':', fx, '!=', sc), msg;
				}

				const  [ home,away ] = addStats(stats, sc);
				sc.Score = sc.GL +' - '+ sc.GV;

				row = newRow($.extend(fx, sc), columns);
				row.cells[ 0 ].title = fx.Día;
				row.cells[ 3 ].title = home.toString(true);
				row.cells[ 5 ].title = away.toString(true);

				scoreCols = [ 3, 5, 4 ];
				!! decorate && decorateGame(row, sc, league.favorites, scoreCols);
				table.tbody.append(row);
			}
			return  table;
		}
		return  null;
	}

	function createPositions( index, decorate, id ) {
		const  positions = league.positions[ index ];

		if ( positions?.length ) {
			var  fields = [ 'Lugar', 'Equipo', 'JJ', 'JG', 'JE', 'JP', 'GF', 'GC', 'DG', 'PTS' ],
				 table  = newTable(fields, 'xnj-positions', 'Posiciones en el Torneo');

			$(table.rows[ 0 ].cells[ 0 ]).text('#');

			positions.forEach( p => {
				const  row = newRow(p, fields);
				$(row).appendTo(table.tbody);
			} );
			return  table;
		}
		return  null;
	}

	function newTable( headers, id, caption ) {
		var  table = $('<table><thead></thead><tbody></tbody></table>') .get(0);
		table.thead = $('thead', table) .get(0);
		table.tbody = $('tbody', table) .get(0);

		if ( !! id ) {
			$(table).attr({ 'id':id, 'class':'xnj-table '+ id });
		} else {
			$(table).attr('class', 'xnj-table');
		}

		if ( isarr(headers) && headers.length ) {
			const  html = headers.map( ( hdr,i,a ) => {
				if ( null !== hdr ) {
					let  span = 1;
					while ( null === a[ ++ i ] )  span ++;
					return  ( span > 1 ? '<th colspan="'+ span +'">' : '<th>' ) + hdr +'</th>';
				}
				return  '';
			} ) .join('');

			$(table.thead).html('<tr>'+ html +'</tr>');
		}

		if ( !! caption ) {
			$('<caption></caption>').html(caption)
				.prependTo(table);
		}
		return  console.debug('- new table:', table), table;
	}

	function addStats( stats, score ) {
		const  homeAway = [ 'Local', 'Visitante' ],
		       records  = [ ];

		homeAway.forEach( ( current,n ) => {
			let  team  = score[ current ],
				 entry = stats[ team ];

			if ( ! entry ) {
				entry = stats[ team ] = new StatsEntry( team );
			}

			const  oponent = homeAway[ 1 - n ];
			const  gf = parseInt(score[ 'G'+ current[ 0 ] ]),
			       gc = parseInt(score[ 'G'+ oponent[ 0 ] ]);

			if ( ! isNaN(gf) && ! isNaN(gc) ) {
				entry.GF += gf;
				entry.GC += gc;
				if ( gf > gc ) {
					entry.Won ++;
				} else if ( gf === gc ) {
					entry.Draw ++;
				} else {
					entry.Lost ++;
				}
			}
			records.push(entry);
		} );
		return  records;
	}

	function newRow( data, columns, type, asHtml ) {
		if ( isobj(data, true) && isarr(columns) && columns.length ) {
			if ( isbool(type) && ndef(asHtml) ) {
				asHtml = type;
				type   = null;
			}
			type = type || 'td';

			const  open  = '<'+ type +'>',
			       close = '</'+ type +'>';
			let  html = columns.map( col => ( data.hasOwnProperty(col) ? data[ col ] : col ) )
			            	.join(close + open);
			html = '<tr>'+ open + html + close +'</tr>';
			return  ( asHtml ? html : $(html).get(0) );
		}
		return  null;
	}

	function decorateGame( row, score, favorites, homeAwayCols ) {
		let  first, second,
			 [ home, away, scr ] = homeAwayCols || [ ];
		const  pfx  = decorateGame.prefix   = decorateGame.prefix   || 'xnj-';
		const  fav  = decorateGame.favorite = decorateGame.favorite || 'fav';
		const  cols = decorateGame.columns  = decorateGame.columns  || [ 'date','time','fld','home','hg','vs','ag','away' ];
		const  rsls = decorateGame.results  = decorateGame.results  || [ 'draw','lost','won','draw','pending' ];
		home = $.makeArray(home).map( c => isnum(c) ? row.cells[ c ] : c ),
		away = $.makeArray(away).map( c => isnum(c) ? row.cells[ c ] : c );
		scr  = $.makeArray(scr ).map( c => isnum(c) ? row.cells[ c ] : c );

		if ( '' === score.GL || '' === score.GV ) {
			first = second = rsls[ 4 ];
		} else {
			const  order = ( score.GL === score.GV ? 0 : score.GL > score.GV ? 1 : 2 );
			first  = rsls[ 3 - order ];
			second = rsls[ order ];
		}
		$(home).addClass(pfx +'home '+ pfx + first);
		$(away).addClass(pfx +'away '+ pfx + second);
		!! scr && $(scr).addClass(pfx +'score '+ first.slice(0, 4));

		if ( isarr(favorites) && favorites.length ) {
			let  hasfav = false;
			home = home[ 0 ];
			away = away[ 0 ];

			if ( favorites.includes(score.Visitante) ) {
				$(away).addClass(pfx + fav);
				hasfav = true;
			}
			if ( favorites.includes(score.Local) ) {
				$(home).addClass(pfx + fav);
				hasfav = true;
			}
			if ( hasfav ) {
				$(row).addClass(pfx +'has-'+ fav);
			}
		}
	}

	function addLinksToWeeks( positions ) {
		const  numRows = positions.rows.length - 1;

		$.makeArray(positions.rows).forEach( ( row,r ) => {
			const  cell = row.cells[ 0 ],
			       num  = parseInt($(cell).text());

			if ( ! isNaN(num) && num < numRows ) {
				$('<a></a>').attr({ href:'#j'+ num, title:'Jornada '+ num })
					.wraps(cell.childNodes);
			}
		} );
	}

	function addLinksToTeams( positions, summary, cols, id ) {
		league.favorites || (league.favorites = [ ]);
		$(positions).on('click', 'a.fav', function( ev ) {
			const  td   = ev.target.parentElement,
			       tr   = td.parentElement,
			       team = td.textContent;
			td.dataset.fav = 1 - td.dataset.fav;
			~~td.dataset.fav && (tr.classList.add('xnj-has-fav'), league.favorites.push(team))
			|| (tr.classList.remove('xnj-has-fav'), league.favorites = league.favorites.remove(team));
			markFavTeams(summary);
			kalcho.save(false, id);
		})
		.find('> tbody td:nth-child(2)')
			.each( ( i,td ) => {
				const  tr   = td.parentElement,
				       team = td.textContent,
				       fav  = ( league.favorites?.includes(team) ? 1 : 0 );
				//console.debug(i, td, fav, team);
				td.dataset.fav = fav;
				~~td.dataset.fav && tr.classList.add('xnj-has-fav');
				$('<a href="javascript:void(0)" class="fav"></a>')
					.wraps(td.childNodes);
			} );
	}

	function markFavTeams( summary, id ) {
		league.favorites || (league.favorites = [ ]);
		//console.debug('- favorites:', league.favorites);
		$(summary).find('.xnj-home, .xnj-away')
			.filter( ( i,td ) => league.favorites.includes(td.textContent) || td.classList.contains('xnj-fav') )
			.each( ( i,td ) => {
				const  $td  = $(td),
				       $tr  = $td.parent(),
				       team = $td.text(),
				       fav  = league.favorites.includes(team);
				//console.debug(i, td, fav, team);
				$td.toggleClass('xnj-fav', fav);
				$tr.toggleClass('xnj-has-fav', !! $tr.children('.xnj-fav').length);
			} );
	}

	function queryValues( query ) {
		var  a, values = Object.create(null);
		(query || location.search).replace(/^\?/, '').split(/&/)
			.forEach( p => (a = p.split('='), Object.defineProperty(values, decodeURIComponent(a.shift()), {
				value:decodeURIComponent(a.join('=')), writable:false, configurable:false
			})) );
		return  values;
	}

	function createRange( from, to, incr = 1, _max = 10 ) {
		if ( _max < 1 )  throw `createRange() - infinite loop? (${ from }, ${ to }, ${ incr }, ${ _max })`;
		if ( ! incr || incr > 0 && from > to || incr < 0 && from < to )
			return [ ];
		return  [ from ].concat(createRange(from + incr, to, incr, _max - 1));
	}

	function compStr( a, b ) {
		return  ( (a = (a || '').toLowerCase()) < (b = (b || '').toLowerCase()) ? -1 : a > b ? +1 : 0 );
	}


	function StatsEntry( team ) {
		this.prototype = StatsEntry.prototype;
		this.Team      = team;
		this.GF        = 0;
		this.GC        = 0;
		this.Won       = 0;
		this.Lost      = 0;
		this.Draw      = 0;
		this.getPoints = function( ) { return this.Won * 3 + this.Draw; };
		this.getGDiff  = function( ) { return ( this.GF >= this.GC ? '+' : '' ) + (this.GF - this.GC); };
		this.toString  = function( long ) {
			if ( ! long ) {
				return  this.getPoints() +' pts, +'+ this.GF +',-'+ this.GC;
			}
			return  this.getPoints() +' pts '+ this.Won +','+ this.Draw +','
			       + this.Lost +' / '+ this.getGDiff() +' +'+ this.GF +',-'+ this.GC;
		};
	}

	function addCSS( ) {
		const  id  = 'xnj-css',
		       css = `body.full {
	background: #345;
	padding-top: 2em;
	color:  #ccc;
}
.navbar-fixed-top {
	position: absolute;
}
body.full .list-group a.list-group-item,
body.full .nav-tabs > li > a,
body.full .nav-tabs {
	border-color: #fff3;
}
body.full .list-group a.list-group-item,
body.full .nav-tabs > li > a {
	background: #0003;
	cursor: pointer;
}
body.full .nav-tabs > li > a:focus,
body.full .nav-tabs > li > a:hover,
body.full .nav-tabs > li.active > a {
	background: transparent;
	color:  #ccc;
	border-color: #fff6;
	border-bottom-color: #0006;
}

/** Tables */
body.full table.xnj-table,
body.full table.table {
	background: #fff2;
	margin: 0 auto 2em;
	width:  auto;
	border: solid 2px #fff1;
}
body.full table.xnj-table caption,
body.full table.table     caption {
	color: inherit;
}
body.full .xnj-table >tbody> tr:nth-child(odd),
body.full .table     >tbody> tr:nth-child(odd) {
	background: #0001;
}
tr[style="background-color:#ffe7e1;"] {
	background: #fff2  !important;
	font-style: italic;
}
x	tr[style="background-color:#ffe7e1;"]:nth-child(odd) {
	background: #0001  !important;
}
body.full .xnj-table tr>*,
body.full .table     tr>* {
	padding:  .25em .75em;
	border: solid #fff2;
	border-width: 1px 0;
}
body.full .table     td[colspan]:first-child:last-child,
body.full .xnj-table th,
body.full .table     th {
	text-align: center;
	background: #0003;
	padding:  .5em 1em;

	background: #424e59;
	position: sticky;
	top:  -1px;
}
body.full .table tbody td {
	padding:  .5em 2em;
}
body.full .xnj-table tbody th,
body.full .table     tbody th {
	top:  calc(2.5em - 1px);
}

.xnj-positions td:not(:nth-child(2)) {
	text-align: right;
}

.xnj-summary td:nth-child(-n+3) {
	text-align: center;
}
.xnj-summary td:nth-child(7),
.xnj-summary td:nth-child(4) {
	text-align: right;
}

/** "Favorite" teams */
table.table td[data-fav] {
	text-align: left;
}
x	body.full table.xnj-table tr.xnj-has-fav,
body.full table.table     tr.xnj-has-fav {
	background: #abc2;
}
table.table td[data-fav] a::before {
    content:  '\\2610';
    margin-left: -2.5ex;
    float: left;
	line-height:  .75;
	font-weight:  800;
	font-size:  150%;
}
table.table td[data-fav="1"] a::before {
    content: '\\2611';
}

.xnj-fav.xnj-home::before,
.xnj-fav.xnj-away::after {
	content:  attr(title);
	font-weight:  400;
	font-size:  smaller;
	margin: 0 1ex 0 -1ex;
	float:  left;
	color:  #ddd;
}
.xnj-fav.xnj-away::after {
	margin: 0 -1ex 0 1ex;
	float:  right;
}

body.full a,
td.xnj-fav {
	font-weight:  600;
	color:  #bde;
}
.body-full table.table >tbody> tr.xnj-has-fav {
	background-color: #9cf3;
	color:  #bde;
}

/** Scores & results */
.xnj-score {
	text-align: center;
}

.xnj-won {
	font-weight:  800;
	color:  #eee;
}
.xnj-lost {
	font-weight:  200;
}
.xnj-draw {
	font-style: italic;
}

img[style="width:30px;height:30px;"] {
	max-height: 1.5em;
	width:  auto  !important;
	opacity:  .25;
}

/** Annoying elements */
body.full .list-group-header { background:#0006!important; color:inherit!important; }
body.full .list-group.panel {
	background: transparent;
	opacity:  .5;
}
.whiteTextOverride,
.fondo,
.img-responsive-footer,
.navbar-header,
img.banner {
	display:  none;
}`;
		$('style#'+ id, document.head).remove();
		$('<style type="text/css"></style>').attr('id', id).html(css)
			.appendTo(document.head);
	}
}(jQuery));