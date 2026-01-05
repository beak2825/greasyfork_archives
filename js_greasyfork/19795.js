// ==UserScript==
// @name          Qr Code pour Sortie OVS
// @name:en       Qr Code from event on OnVaSortir! (French Urbeez)
// @version       0.5.0
// @author        Anthony Orger
// @namespace     http://maj.pc.free.fr/
// @description   Affiche un Qr code d'évènement pour la sortie consultée sur onvasortir.com
// @description:en   Displays a QR Code for the current event on onvasortir.com (French Urbeez)
// @include       *.onvasortir.com*
// @exclude       */vue_sortie_perso.php*
// @downloadURL https://update.greasyfork.org/scripts/19795/Qr%20Code%20pour%20Sortie%20OVS.user.js
// @updateURL https://update.greasyfork.org/scripts/19795/Qr%20Code%20pour%20Sortie%20OVS.meta.js
// ==/UserScript==

// @aboutversion  correction bug caractère spécial "&" // bug fix on "&".
// @thanks        Script inspiré par "Display Canonical Urls" de Chris Roos // based on "Display Canonical Urls" by Chris Roos

// @warning Ne fonctionne pas sur certaines pages.

function extractEventDate(dateLink) {
  var arrayOfStrings = dateLink.split('&');
  var dateDEBUT = '';
  var aaaa='';
  var mm='';
  var jj='';
  for (var i=0; i < arrayOfStrings.length; i++){
    aaaa += (arrayOfStrings[i].indexOf('y')>-1) ? arrayOfStrings[i].substr(-4):'';
    mm += (arrayOfStrings[i].indexOf('m')>-1) ? arrayOfStrings[i].substr(-2):'';
    jj += (arrayOfStrings[i].indexOf('d')>-1) ? arrayOfStrings[i].substr(-2):'';
  }
  dateDEBUT = dateDEBUT.concat(aaaa,mm,jj);
  return dateDEBUT;
}

function extractEventTitle() {
  var head                  = document.getElementsByTagName('head')[0];
  var headElements          = head.getElementsByTagName('title');
  var eventTitleElements = [];
  var enventTitle = 'Sortie OVS';

  for (var i = 0; i < headElements.length; i++) {
       var newElement = headElements[i];
       eventTitleElements.push(newElement);
  }
  if (eventTitleElements.length > 0)    enventTitle = eventTitleElements[0].text;

  return enventTitle;
}

/*******************************************************/
//Début du script
//script beginning
/*******************************************************/
//console.log("Start script for URL \'"+document.URL+"\'");

  var i;
  var dateDEBUT = [];
  var heureDEBUT = [];
  var lieuRDV = [];
  var codePostal = [];

  var lnk=document.getElementsByTagName('a');
  var href;
  var urlroot = document.URL.split('.'); // https://ville
  var hroot=urlroot[0]+".onvasortir.com/vue_sortie_day.php"; //"https://paris.onvasortir.com/vue_sortie_day.php?Pseudo"
  var hrdv ="http://maps.google.fr/maps"; //"?q=adresse-donne-par-mp-ou-sms-en-matinee-metro-valmy"
  var hzip =urlroot[0]+".onvasortir.com/vue_sortie_filtre.php"; var fzip = "f_ou2"; //"https://paris.onvasortir.com/vue_sortie_filtre.php?f_ou2=69009"
  var harray = [];

  for(i=0;i<lnk.length;i++){
    href=lnk[i].href;
    harray = href.split('?');
//on cherche une date de sortie et pas d'anniversaire ou autre, donc sans "#"
    if(href.indexOf('?')>-1 && href.indexOf('#')<0){
      harray = href.split('?');
      if (harray[0]==hroot){
        dateDEBUT.push(extractEventDate(harray[1]));
      }
//recherche du lieu : adresse, code postal
      if (harray[0]==hrdv){
          var adrs = lnk[i].innerHTML.replace('\r','').replace('\n','').replace('<br>',', ');
          while(adrs.indexOf('<br>')>-1 || adrs.indexOf('\r')>-1 || adrs.indexOf('\n')>-1 || adrs.indexOf(', ,')>-1)
          {
           adrs = adrs.replace('\r','').replace('\n','').replace('<br>',', ').replace(', ,',',');
          }
        if (adrs.endsWith(', ')) adrs = adrs.substr(0,adrs.length-2);
        lieuRDV.push(adrs);
      }
      if (harray[0]==hzip && harray[1].split('=')[0]==fzip){
        codePostal.push(lnk[i].innerHTML.replace("<b>",'').replace("</b>",''));
//console.log('codePostal='+codePostal[0]);
      }
      if (lieuRDV.length>0 && dateDEBUT.length>0 && codePostal.length>0) break;
    }
  }

// Si la date est introuvable, il est inutile de continuer.
//console.log('dateDEBUT[0]='+dateDEBUT[0]);
if(dateDEBUT[0]){
/**/
var dvs=document.getElementsByTagName('div');
  var klass='';
  var kName="corpsComplement300";
  var karray = [];
  var ktext = '';
  var k;
  var GO = [];
  var goarray = [];
  var Gref = "profil_read.php?";

  for(i=0;i<dvs.length;i++){
    klass=dvs[i].className;
    if (klass != kName) continue; //si la classe n'est pas "corpsComplement300", on passe à la suivante.
    ktext = dvs[i].innerHTML; // on récupère le contenu de la <div/>

    //on cherche une heure sur le modème "18:30" ou " 6:30 (pm)"
    if(ktext.indexOf(':')>-1 && ktext.indexOf('#')<0 && ktext.indexOf(',')<0 && ktext.indexOf('=')<0){
      ktext = ktext.replace('(',':');
      ktext = ktext.replace(')',' ');
      karray = ktext.split(':');
      for (k=0; k<karray.length; k++){
          karray[k]= karray[k].trim();
      }
      if (karray.length>2){
        if (karray[2].toLowerCase()=="pm") {
           // k = parseInt(karray[0],10);
           // k += 12;
           karray[0] = parseInt(karray[0],10)+12;
        }
      }
      if (karray[0].length<2){
          karray[0] = '0'+karray[0];
      }
      heureDEBUT.push(karray[0]);
      heureDEBUT.push(karray[1]);
      continue;
    }

    //on cherche le Gentil Organisateur (ou la Gentille Organisatrice) dont le pseudo est précédé de Gref
    if(ktext.indexOf(Gref)>-1){
        var priref=dvs[i].getElementsByTagName('a');
		var secref = priref[0].getElementsByTagName('font');
		for(var r=0;r<secref.length;r++){
           GO.push(secref[r].innerHTML);
		}
      //recherche du numéro de téléphone
       if(ktext.indexOf("Tel :")>-1){
// /!\ bug 0.4.7 : champ libre, il faut un masque pour tester la présence d'un n° valide et déterminer la longeur de chaine
// voir exemple : http://lyon.onvasortir.com/eveil-corporel-auto-massage-nuque-4796931.html
          GO.push(' - '+"Tel: "+ktext.substring(ktext.indexOf("Tel :")+10));
        }
		continue;
    }
//console.log("heureDEBUT.length="+heureDEBUT.length+";GO.length="+GO.length);
    if (heureDEBUT.length>-1 && GO.length>-1) break;
  }
/**/

//Construction du QR Code
//Building QR Code
    //définition des élements du QR Code
    //QR Code elements
//  var TITRE = SUMMARY : On abrège "OnVaSortir!" en "OVS" entre parenthèses
    var TITRE = extractEventTitle().replace('- OnVaSortir!','(OVS')+')'; //SUMMARY

//  var DEBUT = DTSTART : "aaaammjjThhmm00B";
    var DEBUT = dateDEBUT[0]+"T"+heureDEBUT[0]+heureDEBUT[1]+"00B"; // TIMEZONE: "00Z" for UTC; "00B" for GMT+2 (Paris, Brussels)

//  var FIN   = DTEND : "aaaaMMjjThhmm00B";
    var FIN   = dateDEBUT[0]+"T"+"23"+"59"+"00B";

//  var LIEU  = "LOCATION: Adresse - District";
    var LIEU  = '';
    if (lieuRDV.length>-1)  LIEU += lieuRDV[0];
    if (codePostal.length>-1 && lieuRDV[0] && lieuRDV[0].toUpperCase().includes(codePostal[0].toUpperCase())!==true ){
        LIEU += ' - '+codePostal[0];
    }
    else if (codePostal.length>-1) LIEU += ' - '+codePostal[0];
    if (LIEU === '')  LIEU += "Région de "+TITRE.substring(TITRE.indexOf('/ OVS')+5);
//console.log("lieu= "+LIEU);
//  var RESUME= "DESCRIPTION";
    var RESUME = "Sortie OVS organisée par ";
    for(var o=0;o<GO.length;o++)
    {
        RESUME += GO[o];
    }
// Ajout du lien vers la page de la sortie : "lienOVS"
    var lienOVS = document.location.href;
    if (lienOVS.indexOf('#')>-1) lienOVS = lienOVS.substring(0,lienOVS.indexOf('#')) ;
    RESUME += ' - '+lienOVS;

// Préparation du QR Code
    var s = 205; // dimensions du QR Code
    var evnmt = "BEGIN:VEVENT"+"%0D%0A"+"SUMMARY:"+encodeURI(TITRE)+"%0D%0A"+"DTSTART:"+DEBUT+"%0D%0A"+"DTEND:"+FIN+"%0D%0A"+"LOCATION:"+encodeURI(LIEU)+"%0D%0A"+"DESCRIPTION:"+encodeURI(RESUME)+"%0D%0A"+"END:VEVENT" ;
    evnmt = evnmt.replace('&','et'); //Bug caractère spécial
//console.log(evnmt);

//Appel de l'API Google
//Request to Google API
    var qrcode = "https://chart.apis.google.com/chart?cht=qr&chs="+s+"x"+s+"&chl="+evnmt;
//console.log(qrcode);
    //Construction de l'élément à afficher
    //Building display element
    var canonicalUrlContainer            = document.createElement('div');
    canonicalUrlContainer.style.position = 'fixed';
    canonicalUrlContainer.style.left     = '5px';
    canonicalUrlContainer.style.top      = '5px';
    canonicalUrlContainer.style.zIndex   = '999';
    canonicalUrlContainer.style.padding  = '2px';
    canonicalUrlContainer.style.font     = '9px arial';
    canonicalUrlContainer.style.border   = '1px solid';

    canonicalUrlContainer.style.backgroundColor = 'yellow';
    canonicalUrlContainer.style.borderColor     = 'red';
    canonicalUrlContainer.style.color           = 'blue';
    var anchor = document.createElement('img');
    anchor.src = qrcode;
    anchor.style.color = 'blue';
    anchor.appendChild(document.createTextNode(TITRE));
    canonicalUrlContainer.appendChild(anchor);

    document.body.appendChild(canonicalUrlContainer);
}