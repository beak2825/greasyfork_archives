// ==UserScript==
// @name        Paidverts MOD
// @namespace   ns
// @description   Easier paidverts.com
// @include     /^http(s)?:\/\/(.+\.)?paidverts\.com\/member\/paid_ads_interaction_\d+.+$/
// @include     /^http(s)?:\/\/(.+\.)?paidverts\.com\/member\/paid_ads_view_\d+.+$/
// @include     /^http(s)?:\/\/(.+\.)?paidverts\.com\/member\/activation_ad\..+$/
// @include     /^http(s)?:\/\/(.+\.)?paidverts\.com\/member\/paid_ads\..+$/
// @version     0.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/10875/Paidverts%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/10875/Paidverts%20MOD.meta.js
// ==/UserScript==



var nonRegexFilterInclude=[ "*://*.paidverts.com/member/paid_ads_interaction_*", "*://*.paidverts.com/member/paid_ads_view_*", "*://*.paidverts.com/member/activation_ad.*", "*://*.paidverts.com/member/paid_ads.*"];
var uriPixel="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

(
 function() {
  var css = "";
  css += [
   ".menu_right_one {z-index: 1;}",
   ".ads_pagination {visibility: unset !important;}",
   "#t-1 {height: auto !important;}",
   "#view_ad + br {display: none;}",
   "input[class$='_submit'] { margin: 0px 4px 0px 4px !important; }",
   ".tElement:not(:first-of-type) { display :none; }",
   ".tElement > div:not(:nth-child(2)) {visibility: hidden}",
   "input[name='text'] {display: none !important;}",
   "#contener {visibility: hidden;}",
   ".top_bar {height: 91px !important; min-height:91px !important;}",
   ".frame_bar {margin-top: 91px !important; height: calc(100% - 91px) !important;}",
   "k:empty + div {display: none;}",
   "#tips {font-size: 18px !important; opacity: 0.375 !important; margin-left: 15px !important; text-shadow:-1px -1px 0px #FFF, 0px -1px 0px #FFF, 1px -1px 0px #FFF, -1px  0px 0px #FFF, 1px  0px 0px #FFF, -1px  1px 0px #FFF, 0px  1px 0px #FFF, 1px  1px 0px #FFF, -2px -2px 0px #FFF, -1px -2px 0px #FFF, 0px -2px 0px #FFF, 1px -2px 0px #FFF, 2px -2px 0px #FFF, 2px -1px 0px #FFF, 2px  0px 0px #FFF, 2px  1px 0px #FFF, 2px  2px 0px #FFF, 1px  2px 0px #FFF, 0px  2px 0px #FFF, -1px  2px 0px #FFF, -2px  2px 0px #FFF, -2px  1px 0px #FFF, -2px  0px 0px #FFF, -2px -1px 0px #FFF !important;}",
   "#tips > a, #tips > br {display: none !important;}",
   "#games > :nth-child(2) {display: none !important;}",
   "#games > :first-child > :last-child {display: none !important;}",
   "#games > :last-child > :first-child {display: none !important;}"
  ].join("\n");
  if (typeof GM_addStyle != "undefined") GM_addStyle(css);
  else if (typeof PRO_addStyle != "undefined") PRO_addStyle(css);
  else if (typeof addStyle != "undefined") addStyle(css);
  else {
   var node = document.createElement("style");
   node.type = "text/css";
   node.appendChild(document.createTextNode(css));
   var heads = document.getElementsByTagName("head");
   if (heads.length > 0) heads[0].appendChild(node); 
   else document.documentElement.appendChild(node); // no head yet, stick it whereever
  }
 }
)();

windowOpen=window.open;
window.open=function() {
 var rtn=windowOpen(arguments[0],arguments[1],arguments[2],arguments[3]);
 if ((rtn == null) && arguments[0].match(/^http(s)?:\/\/(.+\.)?paidverts\.com\/member\/paid_ads_view_\d+.+$/)) {
  document.querySelector("#new_ad").style.display="none";
  document.querySelector("#view_ad").style.display="";
 }
}

var noSpace=String.fromCharCode(173), lenClassListSubmit, moCash, mC;

var mC_action=function(_action) {
 try {switch (_action){
   case "scroll": mC=document.querySelector("#main_content"); mC.scrollIntoView(true); break;
   case "show": try {mC.parentElement.parentElement.style.visibility="visible";} catch(undefined) {}; break;
 }} catch(undefined) {}
}

var hideErrorImages=function() {
 try { [].forEach.call(document.querySelectorAll("a[target='_blank'] > img"), function(elem,item,arr) {
  //elem.onerror=function() { elem.setAttribute("src", "uriPixel"); }
  //elem.onerror=function() { this.classList.add("error"); }
  //elem.setAttribute("onerror", "javascript:this.setAttribute('class', 'error');");
  //elem.setAttribute("onerror", "javascript:this.src='" + uriPixel + "'");
  //elem.setAttribute("onerror", "javascript:this.src=" + uriPixel);
  //elem.setAttribute("onerror", "this.src='" + uriPixel + "'");
  //elem.setAttribute("onerror", "this.src=" + uriPixel);
  //elem.onerror=function() { elem.classList.add("error"); }
 }); } catch(undefined) {}
}

var format_AdView=function() { // --- AD VIEW ---
 //try {
  console.log(document.querySelectorAll("#adcopy_response"));
  document.querySelector("#adcopy_response").focus();
 //} catch(undefined) {}
 window.onkeypress=function(e) {
  var eC=e.charCode;
  if (document.activeElement.id != "adcopy_response") switch(eC) { // captcha textinput not focused
   case 32:
    try { document.querySelector("input[value='Confirm']").click(); return false; } catch(undefined) {};
    break;
   default:
    console.log(eC); return false;
  } else {
   //try { window.top.document.querySelector("#adcopy_response").focus(); } catch(undefined) {}
   //document.querySelector("#adcopy_response").value=String.fromCharCode(eC);
  }
 };
 if (!document.querySelectorAll("#seconds").length) { document.querySelector("#captcha").style.display="none"; return; }
 moCash=new MutationObserver(function(mr) { mr.forEach(function(m) { console.log(m); }); });
 moCash.observe(document.querySelector("#earned"), {childList: false, attributes: true, subtree: false, characterData: false});
 
}

var format_AdList=function() { // --- AD LIST ---
 var nextAd, stopHere=true, pN=document.referrer, pN=pN.substring(pN.lastIndexOf("/")+1,pN.lastIndexOf("."));
 try {
  nextAd=document.querySelectorAll(".notify_yellow");
  nextAd=nextAd[nextAd.length-1];
  nextAd=nextAd.parentElement.nextElementSibling.querySelector("#info").nextElementSibling;
 } catch(undefined) { nextAd=document.querySelector("#view-1"); }
 if (pN != "activation_ad") { nextAd=document.querySelector("#view-1"); }
 if (stopHere) { mC_action("show"); }
 
 window.onkeypress=function(e) {
  if (e.charCode == 32)  {
   try {
    stopHere=false;
    nextAd.click();
   } catch(undefined) { stopHere=true; };
   window.onkeypress=function() {return false;}
   return false;
  }
 };
}

var format_Interaction=function() { // --- AD INTERACTION ---
 var moIntercaction, btnSubmit=document.querySelector("input[type='submit']"); //var btnGreySubmit=btnSubmit.className;
 [].forEach.call(document.querySelectorAll("input[name='text']"), function(elem,item,arr) {
  elem.parentElement.parentElement.classList.add("tElement");
  if (item) document.querySelector("#t-1").innerHTML+="<BR>"+elem.previousElementSibling.innerHTML;
 });
 
 // main_content.lastElementChild.childNodes
 // main_content.lastElementChild.childNodes[0].textContent
 
 moInteraction=new MutationObserver(function(mr) { mr.forEach(function(m,i,arr) {
  if (i == arr.length-1) {
   //if (btnSubmit.className != btnGreySubmit) {
    //btnSubmit.className=btnGreySubmit;
    btnSubmit.click();
    
    mC_action("show");
    window.onkeypress=function(e) {
     if (e.charCode == 32)  {
      try { document.querySelector("#new_ad").click(); } catch(undefined) {};
      window.onkeypress=function() {return false;}
      return false;
     }
    };
    moInteraction.disconnect();
   //}
  }
 }); });
 moInteraction.observe(btnSubmit, {childList: false, attributes: true, subtree: false, characterData: false, attributeFilter:["class"]});
 
 var refBR=document.querySelector("#new_ad + br");
 //var nextAd=document.createElement("INPUT"); nextAd.classList.add("button_green_submit"); nextAd.setAttribute("type","button"); nextAd.value="View next ad";
 try { document.querySelector("#new_ad").parentElement.previousElementSibling.previousSibling.remove(); } catch(undefined) {}
 document.querySelector("#main_content > div:last-of-type").firstChild.remove();
 //refBR.parentElement.insertBefore(nextAd, refBR);
 try { refBR.parentElement.insertBefore(document.querySelector("#swap_ad"),refBR); } catch(undefined) {}
 
 //lenClassListSubmit=btnSubmit.classList.length;
 [].forEach.call(document.querySelectorAll("[id^='copy-']"), function(elem,item,arr) { elem.click(); });
}

console.log(GM_info.scriptMetaStr);

window.onload=function() {
 //hideErrorImages();
 //window.top.focus(); //document.body.focus();
 if (document.querySelectorAll(".error-headline").length) return; // In case of security-check
 else {
  mC_action("scroll");
  var pN=document.location.pathname.replace(/\d+/,noSpace); pN=pN.substring(pN.lastIndexOf("/")+1, pN.lastIndexOf("."));
  switch(pN) {
   case "activation_ad": format_Interaction(); break;
   case "paid_ads": format_AdList(); break;
   case "paid_ads_interaction_" + noSpace: format_Interaction();; break;
   case "paid_ads_view_" + noSpace: format_AdView(); break;
  }
 }
}

// NOTA no pilla foco window.top por el recaptcha de Google

// CAMBIO: La idea de colocar un nuevo boton en el Interaction fue buena, pero no contempla la posibilidad
//         de que PV este configurado en Polaco. Eliminar boton, y colocar un simbolo al boton original
//         para el caso que tenga que hacer la nueva funcion. Colocar la nueva funcion en [Shift] + [Space]

// Solucionar el tema del foco del campo de texto de SolveMedia

// Solucionar el problema del foco del campo de texto de Google reCaptcha

// Agregar al final de los Paid Ads un Support Ad, que al hacerle click lo que haga sea abrir
//       un anuncio de Adf.ly en el mismo marco y que apunte a /member/paid_ads.html o window.location.href
//       y que guarde una cookie para evitar su aparicion hasta pasadas 24 horas. Revisar el Referrer
//       y en caso de ser el link de Adf.ly mostrar un mensaje de agradecimiento.

// Agregar un boton a los Interactions que al pincharlo haga lo mismo que el espacio (Nombre: Next). NOTA>
//       Ya agregado, ahora debe indicar en el titulo si el anuncio siguiente es de BAP o Normal.
//       Bastaria con observar window.location.pathname NOTA: Podria mirar el numero de BAP Ads restantes
//       antes de la visita pero prefiero descartarlo porque en el caso de no ser de BAP igual haria
//       un anuncio si quedan normales. NOTA: Agregar una variable global booleana que indique si el anincio
//       viendose es de BAP, hacer uso de ella en el switch de window.onload

// Hacer Captcha de solveMedia deslizante, colocarle un indicador de haber pulsado INTRO
//       recojer al pulsar INTRO, devolver al cambiar resultado, en cuyo caso en indicador habria que poner a FALSE
//       auto-confirmar la respuesta en caso de estar el indicador a TRUE en el momento de acabar el contador

// Usar COOKIE para saber si se pulso espacio para salir del ultimo Interaction,
//             y en tal caso pasar al siguiente anuncio en la lista,
//             teniendo en cuenta si fue un anuncio de BAPs o d dinero.

// Cambiar los botones del adView para que almacenen el contador de cuenta atras (y luego lo ganado), o un boton que abra la web en una tab aparte