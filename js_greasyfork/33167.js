// ==UserScript==
// @name Black list de leiloeiro
// @namespace tequila_j-script
// @version    0.6.1
// @description  Chuta spammers para o fim da lista de leilão na ludopedia (ludopedia.com.br)
// @match      https://ludopedia.com.br/listas?v=leiloes*
// @match      https://*.ludopedia.com.br/listas?v=leiloes*
// @grant    GM_addStyle 
// @run-at document-ready
// @downloadURL https://update.greasyfork.org/scripts/33167/Black%20list%20de%20leiloeiro.user.js
// @updateURL https://update.greasyfork.org/scripts/33167/Black%20list%20de%20leiloeiro.meta.js
// ==/UserScript==



(function () {
	'use strict';
	/*jshint multistr: true */

	function blacklistTable(nameSet) {
		var $tbody = $("#tbllistas > tbody");
		var $rows = $tbody.find("tr");
		var removed = [];

		$rows.each(function () {
			var $this = $(this);
			var $criador = $(this).find("td:last");
			var $criadorText = $criador.text();
			if (nameSet.indexOf($criadorText) > -1) {
				var detached = $this.detach();
				detached.addClass('removed');
				detached.appendTo($tbody);
				removed.push(detached);
			}
		});
		return removed;
	}


	GM_addStyle(`
	table tbody tr.empty-row-separator td {
		height: 10px !important;
		padding: 10px;
		border: 2px solid black;
	}

	table tbody tr.empty-row-separator {
		height: 10px ;
		background-color: black ;
		border: 2px solid black;
		padding: 10px;
	}

	table tbody tr.removed {
		height: 10px ;
		background-color: lightgray !important ;
		font-size: small;
	}

	table tbody tr.removed a.btn-link{
		height: 10px ;
		background-color: lightgray !important ;
		font-size: x-small;
	}

	`
	);

	function appendInTable(list) {
		if (list.length == 0) return true;
		
		var $tablebody = $("<table class='removed table table-striped'><body></body></table>");
		
		list.forEach(function(element) {
			$tablebody.append(element);
		});

		var $pagination = $("#tbllistas").next('div');
		$tablebody.insertAfter($pagination);

	}

	//var users = getList();

	var site = "https://arro.neocities.org/ludopedia_lista_negra.html";
	var yql = "select * from htmlstring where url='" + site + "' AND xpath='//ul'";
	var resturl = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(yql) + "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	var users = [];
	$.get( resturl)
	.done(function( data ) {
		var result = data.query.results.result;
		var node = $.parseHTML(result);
		$(node).find("li").each(function () {
			users.push($(this).text());
		});
		console.log(users);
	})
	.fail(function (jqXHR, textStatus, error) {
		console.log("Text status: " + textStatus);
		console.log("Post error: " + error);
		console.log("Erro buscando: " + resturl);
		users = ['Carlos Henrique','birds of fire','infinity'];
    })
	  .always(function() {
		console.log( "finished" );
		console.log(users);
		var removed = blacklistTable(users);
		appendInTable(removed);
	  });
	
	;

	console.log("#done Black list de leiloeiro");


})();




