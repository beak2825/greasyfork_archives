// ==UserScript==
// @name         TuSubtitulo.com Descarga Previa (Solo Usuarios)
// @namespace    TuSubtituloDownload
// @version      1.0
// @description  Permite descargar los subtitulos antes de ser aprobados (solo para usuarios registrados)
// @author       Elwyn
// @include      https://www.tusubtitulo.com/list.php?id=*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32052/TuSubtitulocom%20Descarga%20Previa%20%28Solo%20Usuarios%29.user.js
// @updateURL https://update.greasyfork.org/scripts/32052/TuSubtitulocom%20Descarga%20Previa%20%28Solo%20Usuarios%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

	SEQ_PER_PAGE = 3000;

	var subs = [];

	setTimeout( function(){
		$( '#sequence_list TBODY TR' ).each(function(index){
			var $this = $(this);
			var idx = $this.find( '.sequence-number' ).text();
			var time = $this.find( '.sequence-times' ).text().replace( /\s+/, ' --> ' );
			var text = $this.find( 'TD' ).last().text().replace( /[\r\n\t\f]+/, '\r\n' );
			subs[idx] = idx + '\r\n' + time + '\r\n' + text + '\r\n';
		}).promise().done( function(){
			var str = subs.join( '\r\n' );
			var uri = "data:application/octet-stream," + encodeURIComponent( str );
			$('#translation-title').append('<span><a href=' + uri + '" target="_blank">Descargar</a></span>');
			$('<span style="display:block; text-align:center; margin-top:15px !important; font-size:20px; border:1px solid #204a87; height:26px; line-height:24px; width:14em; margin:auto; background:#5788db;"><a href=' + uri + '" target="_blank" style="color:#fff !important; text-decoration: none !important;">Descargar Subtitulos</a></span>').insertBefore('#warning-open-hidden');
		});
	}, 3000);

})();