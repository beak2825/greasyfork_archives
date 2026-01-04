// ==UserScript==
// @name         [dev][draft] simulador banamex (updated)
// @namespace    http://dev.rsalazar.name/js
// @version      0.2.0
// @description  try to take over the world!
// @author       rsalazar
// @match        https://www.banamex.com/es/personas/creditos/tabla-amortizacion.html?*
// @run-at       document-idle
// @grant        none
// @require      https://greasyfork.org/scripts/414845-debug-listeners/code/%5Bdebug%5D%20listeners.js?version=873002
// @downloadURL https://update.greasyfork.org/scripts/416894/%5Bdev%5D%5Bdraft%5D%20simulador%20banamex%20%28updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416894/%5Bdev%5D%5Bdraft%5D%20simulador%20banamex%20%28updated%29.meta.js
// ==/UserScript==
// +require      https://code.jquery.com/jquery-3.5.1.slim.min.js

(function() {
	'use strict';
	const  _name_ = GM_info.script.name,
	       log    = console.log.bind(console);

	console.log(`> User script [${_name_}]`);
	try {
		const  getAll  = ( ( sel,ctx ) => Array.from((ctx || document).querySelectorAll(sel)) ),
			   get     = ( ( sel,ctx ) => (ctx || document).querySelector(sel) ),
			   credito = window.credito,
			   plazo   = credito.plazo * 12,
			   tasa    = credito.tasaInteresAnual / 1200,
			   tabla   = credito.tablaAmortizacion,
			   round2  = val => Math.ceil(100 * val) / 100,
			   money   = val => '$'+ round2(val),
			   dec2    = val => round2( typeof val === 'string' ? +(val || '').replace(/[^-\d.]+/g,'') : val ),
		       payment = input => input && dec2(input.closest('td').previousElementSibling.textContent),
		       initial = Object.assign(tabla.map( pmt => Object.assign({ }, pmt) ), { plazo, tasa });
		addStyle();
		credito.initial = initial;

		let  timer = setInterval( _ => {
			const  th = get('#headersTable th:nth-child(11)');
			if ( th ) {
				clearInterval(timer), timer = 0;

				th.innerHTML = '<button id="js-calc" class="js-inj btn">CAPTURA</button> o <button id="js-reset" class="js-inj btn">LIMPIA</button> '+ th.textContent;
				th.children[ 0 ].addEventListener('click', recalc);
				th.children[ 1 ].addEventListener('click', function( ev ) {
					getAll('input[data-periodo]').forEach( inp => updateTable(inp, initial[ inp.dataset.periodo - 1 ]) );
				});
				getAll('input[data-periodo]')
					.forEach( inp => Object.assign(inp.closest('tr').dataset, { periodo: inp.dataset.periodo, mes: inp.dataset.mes = inp.dataset.periodo % 12 || 12 }) );

				removeBlurHandlers();
				log('* initialized -', credito, initial);
			}
		}, 125);


		function  recalc( ) {
			console.clear();
			const  values  = (prompt('Captura: <Mensualidad deseada>  <Aportación patronal>  <Pago extra anual>', '-10,000 4,000 -20,000') || '').trim().split(/\s+/),
			       mensual = dec2(values[ 0 ]),
			       patro   = dec2(values[ 1 ]),
			       anual   = dec2(values[ 2 ]);
			log('* Datos de cálculo:\n\t- Mensualidad: ', mensual, '\n\t- Patronal:', patro, '\n\t- Anual:', anual);
			if ( ! mensual && ! patro && ! anual )
				return  console.log('* Nothing to calculate');

			for ( let  i = 0, all = getAll('input[data-periodo]');  i < all.length;  ) {
				const  input = all[ i ++ ];

				if ( input && ! ~~input.value ) {
					const  m     = input.dataset.periodo - 1,
					       // mes   = tabla[ m - 1 ],
						   // bim   = ( i %  2 ? 0 : patro ),
						   // anl   = ( i % 12 ? 0 : anual ),
					       pago  = calcMonth(m, mensual, patro, anual) ;//initial[ input.dataset.periodo - 1 ] ,//getPay(input),
						   // men   = Math.max(0, Math.round(100 * (mensual - pago)) / 100),
						   // sum   = dec2(pago + men + bim + anl),
						   // pre   = dec2(sum - pago);
					log('\t- ', m, pago.pagoTotal, '=', pago.pagoCredito, '+', pago._extras +'\t('+ [ mensual, pago.aportacionesPatronales, pago._bonoAnual ].join(' + ') +')');
					updateTable(input, pago);
					// log('\t- ', i, sum, '=', pago, '+', pre +'\t('+ [ men, bim, anl ].join(' + ') +')');

					// input.value = pre;
					// input.dispatchEvent(new Event( 'focusout' ));
					// jQuery(input).val(pre).blur();
				}
			}
		}

		function calcMonth( idx, mensual, patronal, anual ) {
			const  data = tabla[ idx ];
			idx > 0 && (data.deuda = tabla[ idx - 1 ].deudaRestante);
			patronal = ( idx %  2 ==  0 ? 0 : patronal );
			anual    = ( idx % 12 != 11 ? 0 : anual    );

			data.pagoInteres    = tasa * data.deuda,
			data.pagoCredito    = pmt(data.deuda, tasa, plazo - idx);
			data.pagoCapital    = data.pagoCredito - data.pagoInteres;
			data.seguroVida     = data.deuda * 0.0005;
			data.pagoTotal      = data.pagoCredito + data.seguroVida + data.seguroDano;
			data.deudaRestante  = data.deuda - data.pagoCapital;
			data._bonoAnual     = anual;

			data.aportacionesPatronales = ( data.deudaRestante <= 0 ? 0 : Math.min(data.deudaRestante, patronal) );
			data.deudaRestante -= data.aportacionesPatronales;

			data.prepago        = ( anual < 0 ? -anual : (anual + ( mensual < 0 ? -mensual - data.pagoTotal : mensual )) );
			data.prepago        = ( data.deudaRestante <= 0 ? 0 : Math.min(data.deudaRestante, Math.max(0, data.prepago)) );

			data._extras        = data.prepago + data.aportacionesPatronales;
			data.pagoTotal      = data.pagoTotal     + data.prepago;
			data.deudaRestante  = data.deudaRestante - data.prepago;

			return  data;
		}

		function updateTable( input, data ) {
			const  idx  = input.dataset.periodo - 1,
			       cell = input.closest('td'),
			       col  = cell.cellIndex,
			       row  = cell.parentElement;
			input.value = round2(data.prepago);
			row.cells[ col - 4 ].textContent = money(data.seguroVida);
			row.cells[ col - 1 ].textContent = money(data.pagoTotal);
			row.cells[ col + 1 ].textContent = money(data.deudaRestante);
			row.dataset.saldo = + !!data.deudaRestante;
		}

		// function pmt( pv, rate, npmt, fv, bop ) {
		// 	// fv = fv || 0,  bop = (1 - ~~bop) * rate;
		// 	// return  (pv + ((pv + fv) / (Math.pow(1 + rate, npmt) - 1))) * (-rate / (1 + bop));
		// 	return  (pv + ((pv + (fv || 0)) / (Math.pow(1 + rate, npmt) - 1))) * (-rate / (1 + (1 - ~~bop) * rate));
		// }
		function pmt( pv, rate, n ) {
			return  pv * _pmt(rate, n);
		}
		function _pmt( rate, npmt, bop ) {
			const  i = Math.pow(1 + rate, npmt),
				   r = 1000 * i * rate / (i - 1);
			bop == 1 && (r /= 1 + rate);
			return  Math.ceil(100 * r) / 100000;
		}

		function round( value, decs ) {
			const  mult = Math.pow(10, decs);
			return  Math.ceil(mult * value) / mult;
		}

		function removeBlurHandlers( target ) {
			const  handlers = ((target || document).getListeners().blur || []).slice(0);
			handlers.forEach( eh => eh.target.removeEventListener(eh.type, eh.handler, eh.options) );
			return  handlers;
		}

		function addStyle( ) {
			document.head.innerHTML += `<style>
	@media (min-width: 1440px) {
		.cbx-wrapper {
			min-width: 76.39vw;
			width: auto;
		}
	}
	tr[data-saldo="0"] {
		display:  none;
	}
	tr[data-mes="12"] > td {
		background: #0001;
	}
</style>`;
		}

	}
	catch( err ) {
		console.warn(`*** User script [${_name_}] error:`, err);
	}
	finally {
		console.log(`< User script [${_name_}]`);
	}


	function  $( sel,cont ){ return (cont || document.body).querySelector(sel); }
	function $$( sel,cont ){ return Array.from((cont || document.body).querySelectorAll(sel)); }
	function empty( expr, extend ){ return undefined === expr || expr === null || extend && 0 == expr; }
	function test( expr, path, actn ){ return empty(expr) ? expr : path && path.length ? test(expr[ path.shift() ], path, actn)
	                                          : actn.call(this, expr); }
})();