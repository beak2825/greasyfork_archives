// ==UserScript==
// @name         Yui-chan 🌸
// @namespace    https://twitter.com/ImCatLord
// @version      0.6
// @description  Script para facilitar la descarga desde AnimeFLV.net
// @author       ImCatLord
// @icon         https://i.imgur.com/WDgT7rKs.png
// @match        *.animeflv.net/anime/*
// @match        *.animeflv.net/ver/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416931/Yui-chan%20%F0%9F%8C%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/416931/Yui-chan%20%F0%9F%8C%B8.meta.js
// ==/UserScript==

(function() {

	const $ = window.jQuery;
	const yui = {
		url: `${window.location.protocol}//${window.location.hostname}`,
		uri: location.href
			.substring(`${window.location.protocol}//${window.location.hostname}/`.length)
			.split('/')
	};

	if(yui.uri[0] == 'ver') {
		$('.vhslh2b').remove();
		$('.CpCnC').find('br').remove();
		$('.CpCnC').prepend(`
			<section class="WdgtCn">
				<div class="Top">
					<div class="Title">Yui-chan 🌸</div>
					<small>Click para copiar al portapapeles</small>
				</div>
				<div id="yuiLinks"></div>
			</section>
		`);
		$('a.fa-download').each(function() {
			$('#yuiLinks').append(`
				<button type="button" class="btn btn-default btn-lg btn-block" onclick="navigator.clipboard.writeText('${ $(this).attr('href') }')">
					${ $(this).parent().parent().find('td:first-child').text() }
				</button>
			`);
		});
	}

	if(yui.uri[0] == 'anime') {
		$('body').prepend(`
			<div class="modal fade" id="yuiModal" tabindex="-1" role="dialog">
				<div class="modal-dialog modal-lg" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
								<span aria-hidden="true">&times;</span>
							</button>
							<h4 class="modal-title" id="yuiModalTitulo">
								Titulo
							</h4>
						</div>
						<div class="modal-body" id="yuiModalContenido">
							Contenido
						</div>
					</div>
				</div>
			</div>
		`);
		$('main.Main').prepend(`
			<section class="WdgtCn">
				<div class="Top">
					<div class="Title">Yui-chan 🌸</div>
				</div>
				<button class="yuiBtnAnime btn btn-primary" data-srv="streamtape" type="button" style="background-color:#01bcf3;border:0;height:34px;margin-bottom:20px;">
					Cargar por Stape
				</button>
				<button class="yuiBtnAnime btn btn-primary" data-srv="mega" type="button" style="background-color:#01bcf3;border:0;height:34px;margin-bottom:20px;">
					Cargar por Mega
				</button>
				<button class="yuiBtnAnime btn btn-primary" data-srv="zippyshare" type="button" style="background-color:#01bcf3;border:0;height:34px;margin-bottom:20px;">
					Cargar por Zippyshare
				</button>
			</section>
		`);
		$('.yuiBtnAnime').click(function() {
			let yuiSv = $(this).data('srv');
			let yuiRe = new RegExp(yuiSv);
			$('#yuiModalTitulo').text(`${anime_info[0]} (${yuiSv}) — ${anime_info [1]}`);
			$('#yuiModalContenido').html('<ul id="yuiModalUl"></ul>');
			episodes.sort(function(a, b) {
				return b[0] < a[0] ? 1 : -1;
			});
			$(episodes).each(function(i, ep) {
				$('ul#yuiModalUl').append(`
					<li data-link="${yui.url}/ver/${ep[1]}/${anime_info[2]}-${ep[0]}">
						<pre style="display: inline">Ep.${ep[0] < 10 ? '0' : ''}${ep[0]} — </pre>
						<pre style="display: inline" class="yuiLink">Cargando...</pre>
					</li>
				`);
			});
			$('#yuiModal').modal('show');
			$('ul#yuiModalUl li').each(function(i, li) {
				$.ajax({
					url: $(li).data('link'),
					type: 'GET',
					dataType: 'html'
				})
				.done(function(html) {
					$(li).removeAttr('data-link');
					$(html).find('a.fa-download').each(function() {
						let dl = $(this).attr('href');
						if(dl.match(yuiRe)) {
							$(li).find('.yuiLink').html(dl);
						}
					});
				});
			});
		});
	}

})();
