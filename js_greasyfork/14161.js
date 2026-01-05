// ==UserScript==
// @name        Caliente.mx
// @namespace   Caliente.mx
// @description Descarga todos los registros mostrados en "mi cuenta" de la página de caliente
// @include     https://sports.caliente.mx/web_nr?key=account.go_account
// @include     https://sports.caliente.mx/web_nr?bet_result=&page_num=*
// @include     https://sports.caliente.mx/web_nr?key=account.go_bets_history*
// @version  2
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_deleteValue
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/14161/Calientemx.user.js
// @updateURL https://update.greasyfork.org/scripts/14161/Calientemx.meta.js
// ==/UserScript==

var list = $( ".colour-code" )[0];
var inProcess = GM_getValue( "inProcess", false );
var formatedFullPage = GM_getValue( "formatedFullPage", "" );

var newLi = document.createElement( "li" );
var newLiCurrent = document.createElement( "li" );
newLi.className = "bet-won";
newLiCurrent.className = "bet-won";

if( inProcess ){
  
  newLi.appendChild( document.createTextNode( "Espera..." )  );
  newLiCurrent.appendChild( document.createTextNode( "Espera..." )  );
  formatedFullPage += getFormatedPage();
  GM_setValue( "formatedFullPage", formatedFullPage );
  
  var nextButtons = $( ".next" );
  if( nextButtons.length == 0 ){
    finishProcess( newLi, formatedFullPage );
  } else {
    window.location.href = nextButtons[1].href;
  }
  
} else {
  
  newLi.appendChild( document.createTextNode( "Descargar" )  );
  newLiCurrent.appendChild( document.createTextNode( "Descargar actual" )  );
  newLi.onclick = function(){
  
    GM_setValue( "inProcess", true );
    formatedFullPage = "Fecha de la apuesta\tNúmero de apuesta\tTipo de apuesta\tApuesta\tMonto de apuesta\tMomios\tIngreso\tEstado" +
        "Fecha y hora del evento\tDescripción del evento\tApuesta\tSeleccion\tGanancia posible\tResultado\n";  
    formatedFullPage += getFormatedPage();
    GM_setValue( "formatedFullPage", formatedFullPage );
    
    var nextButtons = $( ".next" );
    
    if( nextButtons.length == 0 ){
      finishProcess( newLi, formatedFullPage );
    } else {
      window.location.href = nextButtons[1].href;
    }
    
  };
  
  newLiCurrent.onclick = function(){
    formatedFullPage += getFormatedPage();
    finishProcess( newLiCurrent, formatedFullPage );
    
  }
}

list.appendChild( newLi );
list.appendChild( newLiCurrent );

function finishProcess( newLi, formatedFullPage ){
  
  newLi.appendChild( document.createTextNode( "TERMINADO" )  );
  GM_setValue( "inProcess", false );
  GM_deleteValue( "formatedFullPage" );
  var header = $( ".header-ctrls" )[0];
  var textarea = document.createElement( "textarea" );
  textarea.rows = "10";
  textarea.cols = "80";
  textarea.appendChild( document.createTextNode( formatedFullPage ) );
  header.appendChild( textarea );
  
  
  
}

function getFormatedPage(){
  
  var formatedPage = "";
  var trs = document.getElementsByTagName( "tr" );
  
  for( var i = 1; i < trs.length; i = i+1 ){
  
    var expId = i+1;
    var trexp = trs[expId];
    var tr = trs[i];
    
    var tds = tr.getElementsByTagName( "td" );
       
    if( tds.length != 8 ){
      continue;
    }
    
    formatedPage += tds[0].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\t";
    formatedPage += tds[1].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\t";
    formatedPage += tds[2].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\t";
    formatedPage += tds[3].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\t";
    formatedPage += tds[4].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\t";
    formatedPage += tds[5].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\t";
    formatedPage += tds[6].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\t";
    
    tds = trexp.getElementsByTagName( "td" );
    
    formatedPage += tds[1].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\t";
    formatedPage += tds[2].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\t";
    formatedPage += tds[3].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\t";
    formatedPage += tds[4].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\t";
    formatedPage += tds[5].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\t";
    formatedPage += tds[6].textContent.replace(new RegExp("\n", 'g'), " " ).trim() + "\n";
      
  }
  
  return formatedPage;
  
}


