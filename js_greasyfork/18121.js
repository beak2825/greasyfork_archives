// ==UserScript==
// @name        HH_main
// @namespace   HH
// @description показ рекомендаций для поиска в HeadHunter 
// @include     https://hh.ru/search/resume?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18121/HH_main.user.js
// @updateURL https://update.greasyfork.org/scripts/18121/HH_main.meta.js
// ==/UserScript==
var run = function() {
   var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
   $ = win.$;

   //console.log('HH main start');

   var css = "background-color: lightgray;border: 1px solid;border-radius: 8px;cursor: pointer;float: right;font-weight: bold;padding: 8px;";
   
   $("div.resumesearch__result").after("<div id=hh_resume style='" + css + "'>Получить Рекомендации</div>");
   
   $("#hh_resume").click(function(){
	   
	   var td = $("td.output__main-cell");
	   
	   for(var i=0; i< td.length; i++) {
			var el = $("div.output__info", td.eq(i) );
		   
			var href = $("a.HH-VisitedResume-Href", td.eq(i) ).attr('href');
			var id = getID_from_url( href );

			el.after("<div style='float:right;max-width: 40%;' id='hh_" + id + "'>---</div>");
			
			//console.log(id + "==" + href);
			getURL_data( "https://hh.ru" + href, function( rec, id ){
				//console.log( "........back....");
				//console.log( rec );

				html_rec = JSON.parse( rec )
				for(var i=0; i< html_rec.length; i++){
					//console.log( html_rec[i] );
				$("#hh_" +id).html( html_rec[i] ).css("background-color","lightyellow").css("padding","4px");
				}
				
				//console.log( id );
			});
			
			//break;
	   }
	   
	   //console.log('clock');
	   
	   
   });
   
    function getID_from_url( url )
	{
		var p1 = url.indexOf("?query");
		
		return url.substr(8, p1-8);
	}
   
	function getURL_data( url, callback )
	{
		$.get(url, function(data) {
	
			var el = $("div.resume__recommendation", data);
			//console.log( el);
			
			var out = new Array();
			for( var i=0; i<el.length; i++) {
				out[i] = el.html();
			}
			//console.log( out );
			
			var p1 = url.indexOf("?query");
			var id =  url.substr(13+8, p1-8-13);
			
			callback( JSON.stringify( out ), id );
		});

	}

   
   //var el = $("div.resume__recommendation");
   //console.log(el);
   
   //console.log('HH main end');
}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}