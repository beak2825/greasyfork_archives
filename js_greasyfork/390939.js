// ==UserScript==
// @name           Paris-Normandie
// @author         Osef
// @version        1.0
// @namespace      ParisNormandie
// @description    Full article
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @include        https://www.paris-normandie.fr*
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/390939/Paris-Normandie.user.js
// @updateURL https://update.greasyfork.org/scripts/390939/Paris-Normandie.meta.js
// ==/UserScript==

//****************************************************************
//		C h e c k   u p d a t e
//	Source code : https://greasyfork.org/fr/scripts/1939-allocine-zap : Merci
//****************************************************************
var AZ_today = new Date();
var BD_currentVersion, i_cV;
var AZ_today_YYYYMMDD = parseInt(AZ_today.getFullYear()*10000+AZ_today.getMonth()*100+AZ_today.getDate());
if (!GM_getValue('BD_Version')) GM_setValue('BD_Version', 0);
if (!GM_getValue('BD_date')) GM_setValue('BD_date', 0);
if (!GM_getValue('BD_paramVuSup')) GM_setValue('BD_paramVuSup', 0);
function check_BD_version(evt){
    GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://greasyfork.org/scripts/390939/code/390939.meta.js',
		onload: function(responseDetails){
			try{
				BD_currentVersion = responseDetails.responseText.match(/\@version\s+(\d+\.\d+\.?\d?)/)[1];
				BD_currentVersion = BD_currentVersion.replace(/\./g,'');
				for (i_cV = BD_currentVersion.length; i_cV < 4; i_cV++) BD_currentVersion +=0;
				BD_currentVersion = parseInt(BD_currentVersion);
				if(GM_getValue('BD_Version') === 0) {
                    GM_setValue('BD_Version', BD_currentVersion);
                }
				if (GM_getValue('BD_Version') < BD_currentVersion){
                    GM_setValue('BD_Version', BD_currentVersion);
                    GM_openInTab('https://greasyfork.org/scripts/390939/code/390939.user.js');
				}
			}
			catch(Err) {}
		}
	});
}
if(AZ_today_YYYYMMDD>GM_getValue('BD_date')){//test verification version à la premiere connexion de chaque jour
    check_BD_version();
    GM_setValue('BD_date',AZ_today_YYYYMMDD);
}
//****************************************************************
//		F I N  C h e c k   u p d a t e
//****************************************************************

setInterval(function(){
    $(".full_contents").css("overflow","");
    $(".full_contents").css("height","");
    $(".contenu_web").replaceWith("");
    $("#poool-widget").remove();
    $(".BeOpinionWidget").remove();
}, 2000);