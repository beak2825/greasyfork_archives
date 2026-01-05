// ==UserScript==
// @name        CURIT check soggetto per delete
// @description Check se il soggetto è presente come responsabile, occupante, proprietario o intestatario di un impianto. In caso affermativo impedisce la cancellazione e ritorna l'elenco degli impianti
// @namespace   http://zawardo.it
// @include     http://prmilano.curit.it/curit-prmi/anagrafica-riferimento/soggetti/cancella.action
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @version     1
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/3889/CURIT%20check%20soggetto%20per%20delete.user.js
// @updateURL https://update.greasyfork.org/scripts/3889/CURIT%20check%20soggetto%20per%20delete.meta.js
// ==/UserScript==

if(unsafeWindow.console){
   var GM_log = unsafeWindow.console.log;
}

var soggetto=$("#elimina_soggetto_codice").val();
//console.log(soggetto);
$("form").submit(function (e) {
      e.preventDefault();
      GM_xmlhttpRequest({
			  method: "GET",
			  url: "http://ambiente2.provincia.mi.it/energia/portale/webservice_CURIT_enancher/checkSoggetto/"+soggetto,
			  onload: function(response) {
			    var rispostaJson=jQuery.parseJSON(response.responseText);
			    //console.log(rispostaJson);
			    var nImpianti=rispostaJson.impianti.length;
			    if (nImpianti>0) {
						var elenco="";
						var i=1;
						$.each( rispostaJson.impianti, function( key, value ) {
							elenco+=value;
							if (i<nImpianti) elenco += ", ";
							i++;
						});
						alert("Impossibile eliminare il soggetto, risulta utilizzato da "+nImpianti+" impianti: "+elenco);
					} else {
						$("form").unbind('submit').submit();
					}
			  }
			});
});
