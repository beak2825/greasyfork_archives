// ==UserScript==
// @name      		Found Cache on BML?
// @namespace  		
// @copyright       benebelter 
// @description    	Zeigt gefundene Caches einer Bookmarkliste an. Zuerst bitte einen Token generieren und im Script einfügen. Die Bookmarkliste nur bis max 50 Einträge pro Seite anzeigen lassen.
// @version		   	1.8
// @include        	https://www.geocaching.com/bookmarks/view.aspx?guid=*
// @include        	http://gsak.net/stats/gcoauth/GCoauth_live_callback_browser.php?oauth_verifier=*
// @grant       	GM_addStyle
// @grant       	GM_xmlhttpRequest
// @grant 			GM_getValue
// @grant 			GM_setValue
// @require 		http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/34800/Found%20Cache%20on%20BML.user.js
// @updateURL https://update.greasyfork.org/scripts/34800/Found%20Cache%20on%20BML.meta.js
// ==/UserScript==

   if(window.location.href.indexOf("http://gsak.net/stats/gcoauth/GCoauth_live_callback_browser.php?oauth_verifier=") > -1) {
   
		
		 
		 var arr = $('a[href^="gsak://%FF/token/"]') ;//gsak://%FF/token/
		 
		 
		 var decodedUri = encodeURIComponent(arr[0]);
		var gsaktoken = decodedUri.substr(29);
		 
		
		
		
		 GM_setValue('token',  decodeURIComponent(gsaktoken) );
	  
	  alert('Dein Accesstoken wurde gespeichert. Lade nun die Bookmarkliste neu.\n'+decodeURIComponent(gsaktoken) );
	}


 
 
 
var token = GM_getValue('token')   ;
 
$('#save').click(function() {
		 GM_setValue('token', $( "#token" ).val() );
});
    
 
 
GM_xmlhttpRequest({
     method: "GET",
     url: "https://api.groundspeak.com/LiveV6/geocaching.svc/GetAPILimits?format=json&accessToken="+token,
	 dataType: "json",
     onload: function(response) {
       var status = JSON.parse(response.responseText);
         //alert('1: '+status.Status.StatusCode); 
		 
		 if(status.Status.StatusCode != 0){
		 $('#ctl00_ContentBody_ListInfo_uxAbuseReport').html('<div id=tokeneingeben style="border:2px solid red; padding-left: 10px ;padding-top: 10px;padding-bottom: 10px "><h2>Bitte einen gültigen Accesstoken abrufen:</h2><br><a href="http://gsak.net/stats/gcoauth/GCoauth_live_browser.php" target=_blank><h1>Klick mich</h1></a><br><br>Dieser wird benötigt um die Informationen von Groundspeaks API zu laden.<!--<br><input style="width: 250px;"id=token type=text name=token value="'+GM_getValue('token')+'" Placeholder="Hier den Accesstoken eingeben"> <input id="save" value="Accesstoken speichern" onclick="myFunction()"  type=submit >--></div> ');
		 alert('Accesstoken-Fehler:\n'+status.Status.StatusMessage+ '\n\nBitte gib einen gültigen Accesstoken ein');
			}
 
				
				  
    }
  });
  
//////////////////////////////////////
 
//GCCodes von BML sammeln
var codes = [];
for (var i = 0; i < document.links.length; ++i)
if (document.links[i].text.substring(0, 2) == "GC") {
    codes.push(document.links[i].text );
	}
 
 
 if (codes.length > 50)
	 alert('Hinweis:\nDas Greasemonkey-Script funktioniert nur mit maximal 50 Caches pro Seite.')
 
/// VERBINDUNG API ////
 GM_xmlhttpRequest({
		dataType: "json",
		method: "GET",
		contentType: "application/json",
        async: false,
		url: "//gctools.lima-city.de/greasemonkey/bookmarkliste.php?gc="+codes+"&token="+token ,
		onload: function(response) {
			
			var codes = JSON.parse(response.responseText);
			
		 
			 
					 $.each( codes, function( key, value ) {
			 	   
							if (value.HasbeenFoundbyUser === true){
								
							//eigenes Founddate 
							var found_d 		= new Date(parseInt(value.FoundDate.substr(6)));
							var found_year 		= found_d.getFullYear();
							var found_monat 	= found_d.getUTCMonth()+1;  
							var found_tag 		= found_d.getUTCDate();
							
							
							var HasbeenFavoritedbyUser = '';
							if (value.HasbeenFavoritedbyUser === true){
							var HasbeenFavoritedbyUser = ' <span style="font-size: 1.6em">+</span> <img src="https://www.geocaching.com/images/icons/fave_fill_16.png" alt="Favoritenpunkt vergeben"> ';
							}
								
								
								$("td:contains("+ value.Code + ")").each(function(){ 
										$(this).next('td').andSelf().css('background-color', '#99ff99');
										$(this).next('td').next('td').css('background-color', '#99ff99');
																			 
										$(this).next('td').next('td').html('<center><img src="https://www.geocaching.com/images/icons/16/found.png">'+HasbeenFavoritedbyUser+'<br>'+found_tag+'.'+found_monat+'.'+found_year+'</center>');
								  });
							
							}
							
							
							
							var available = '';
							if (value.Available != true){
								var available = '<img src="https://www.geocaching.com/images/logtypes/22.png">';
							}
							
							var archived = '';
							if (value.Archived === true){
								var archived = '<img src="https://www.geocaching.com/images/logtypes/5.png"> ';
								var available = '';
							}
							
							
							 
							 
							var lf_d 		= new Date(parseInt(value.DateLastVisited.substr(6)));
							var lf_year 	= lf_d.getFullYear();
							var lf_monat 	= lf_d.getUTCMonth()+1;  
							var lf_tag 		= lf_d.getUTCDate();
							 
							 var diff_icon = '<img src="https://www.geocaching.com/images/stars/stars'+encodeURIComponent(value.Difficulty).replace(".", "_")   + '.gif">';
							 var terr_icon = '<img src="https://www.geocaching.com/images/stars/stars'+encodeURIComponent(value.Terrain).replace(".", "_")   + '.gif">';
							 
							 
							
							//alert(diffi);
							
							$("td:contains("+ value.Code + ")").next('td').html('<span  class="favorite-rank">'+value.FavoritePoints+'</span> <img src="https://www.geocaching.com/images/wpttypes/sm/'+ value.CacheType.GeocacheTypeId+ '.gif"> <span style="font-weight:bold; font-size: 1.3em;"><a href="http://coord.info/'+value.Code+'" target=_blank>'+value.Name + '</a></span> '+archived+available+'<br><span style="font-size: 1.1em;">D '+diff_icon + ' T '+terr_icon +' | Letzer Fund: ' + lf_tag+ '.' +lf_monat+ '.' +lf_year+ '</span>' );
							
					 	});
						
						
						 
		
		}
  }); 
    
