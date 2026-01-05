// ==UserScript==
// @name        Apec.fr sans spam SSII
// @description Supprimme les annonces des SSII sur le site de l'Apec
// @namespace   http://userscripts.org/scripts/show/157778
// @include     http://*.apec.fr/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @version     1.6
// @require			http://code.jquery.com/jquery-2.1.0.js
// @downloadURL https://update.greasyfork.org/scripts/3873/Apecfr%20sans%20spam%20SSII.user.js
// @updateURL https://update.greasyfork.org/scripts/3873/Apecfr%20sans%20spam%20SSII.meta.js
// ==/UserScript==

var blockedBoites =  new Array(
/^MALTEM CONSULTING GROUP/i,
/^PROSERVIA/i,
/^6EME SENS TECHNOLOGY/i,
/^KENT$/i,
/^CLESYS/i,
/^THALES SERVICES/i,
/^INFORMATIS TECHNOLOGY SYSTEM/i,
/^MATEN/i,
/^INDETEC/i,
/^SOPRA GROUP/i,
/^ALTEN ITC/i,
/^ALTEN( +|$)/i,
/^GLOBAL TECHNOLOGIES/i,
/^AGH CONSULTING/i,
/^IBM/i,
/^Capgemini/i,
/^Atos Origin/i,
/^Logica/i,
/^HP$/i,
/^Accenture/i,
/^Sopra Group/i,
/^Steria/i,
/^CSC$/i,
/^Thales CIS/i,
/^GFI Informatique/i,
/^Bull/i,
/^Docapost/i,
/^Altran/i,
/^Alten/i,
/^Akka Technologies/i,
/^Neurones/i,
/^Open$/i,
/^Astek/i,
/^Spie Communications/i,
/^Devoteam/i,
/^Osiatis/i,
/^NextiraOne/i,
/^T-Systems/i,
/^SII$/i,
/^SCC$/i,
/^Dell/i,
/^Tessi$/i,
/^CS Communication & Systemes/i,
/^Euriware/i,
/^Assystem/i,
/^Adecco/i,
/^APX$/i,
/^Xerox/i,
/^Business & Decision/i,
/^SQLI/i,
/^Wipro/i,
/^Econocom/i,
/^Overlap Groupe/i,
/^Solucom/i,
/^Alti$/i,
/^Kurt Salmon/i,
/^Aubay/i,
/^NCR$/i,
/^Infotel/i,
/^Apside/i,
/^Beijaflore/i,
/^Telindus/i,
/^Tibco/i,
/^Micropole-Univers/i,
/^Ausy/i,
/^Team Partners Group/i,
/^Its Group/i,
/^Keyrus/i,
/^Unisys/i,
/^Fujitsu/i,
/^Consort NT/i,
/^Computacenter/i,
/^Aptus/i,
/^Sodifrance/i,
/^ESR$/i,
/^Cognitis Group/i,
/^Acti/i,
/^TCS$/i,
/^Wincor Nixdorf/i,
/^Groupe Helice/i,
/^Eurogiciel/i,
/^Segula Technologies/i,
/^SunGard Data Systems/i,
/^Feel Europe Groupe/i,
/^Ares$/i,
/^Viseo/i,
/^Proservia/i,
/^Viveris/i,
/^Solutions 30/i,
/^Vision IT/i,
/^Prodware/i,
/^Umanis/i,
/^Prosodie/i,
/^Maltem Consulting/i,
/^Aedian/i,
/^EffiTIC/i,
/^Safran Engineering Services/i,
/^Northgate IS/i,
/^Oresys/i,
/^Logware/i,
/^Oxya/i,
/^Infosys/i,
/^Degetel groupe/i,
/^Hardis/i,
/^Eryma/i,
/^Airial Conseil/i,
/^TRSB Groupe/i,
/^Groupe Cella/i,
/^Soft Computing/i,
/^Valtech/i,
/^AFD Technologies/i,
/^Neo-Soft/i,
/^Dimension Data/i,
/^Adneom/i,
/^EXPERT LINE/i,
/^NETXP/i,
/^ARTEMYS/i,
/^GROUPE ESR/i,
/^CYCLAD FRANCE/i,
/^ITEM SERVICES/i,
/^OBJECTWARE/i,
/^EXTIA$/i,
/^SIA PARTNERS$/i,
/^LCC FRANCE S\.A\.R\.L\.$/i,
/^IKOS$/i,
/^GROUPE ON-X$/i,
/^PANDA SERVICES$/i,
/^STRATHOM$/i,
/^INTITEK$/i,
/^DAVIDSON CONSULTING$/i,
/^ACTHOM CONSEIL ET INGENIERIE$/i,
/^IENA CONSULTING$/i,
/^SOGETI FRANCE$/i,
/^KAORI SAS$/i,
/^GENIOUS SYSTEMES$/i,
/^YSANCE$/i,
/^ABAKUS$/i,
/^HR TEAM$/i,
/^SAPIENS CONSULTING$/i,
/^SEXTANT SOLUTIONS INFORMATIQUES$/i,
/^INTRINSEC$/i,
/^AKKA I & S$/i,
/^METANEXT$/i,
/^THANIS$/i,
/^TO B SERVICES$/i,
/^SYNCHRONE$/i,
/^PROGELOG$/i,
/^OSIRES$/i,
/^BLUTE@MS TECHNOLOGY$/i,
/^ANSON MCCADE$/i,
/^PEARL IT CONSULTING$/i,
/^ANTARES IT$/i,
/^MGI CONSULTANTS$/i,
/^SAS EOLEN$/i,
/^OPEN WIDE$/i,
/^CHALLENGE2MEDIA \(C2M\)$/i,
/^GROUPAGORA$/i,
/^AVANGUARD$/i,
/^SILICOM$/i,
/^ALYOTECH ENGINEERING$/i,
/^LYBELIS$/i,
/^NEWRUN$/i,
/^ACCELITE$/i,
/^3S INFORMATIQUE$/i,
/^MATIS SI$/i,
/^FEDUCIA$/i,
/^QUICK SOURCE$/i,
/^TAIX SAS$/i,
/^INGCOM$/i,
/^SUNAPSIS$/i,
/^CLARITEAM SA$/i,
/^I-TRACING$/i,
/^SYNOPSIA INGENIERIE$/i,
/^INTEGRALE IP$/i,
/^ARISMORE$/i,
/^NEXTON CONSULTING$/i,
/^T-T CONSULTING$/i,
/^IDNA$/i,
/^HELPLINE$/i,
/^SGUI$/i,
/^FISH EYE TECHNOLOGIES$/i,
/^FHM SOLUTIONS FRANCE$/i,
/^AXONES$/i,
/^R2E CONSEIL$/i,
/^FINAXYS$/i,
/^ID2 GROUPE$/i,
/^DCS EASYWARE$/i,
/^SBP$/i,
/^CAT AMANIA$/i,
/^AMARIS$/i,
/^AFERSYS$/i,
/^SQUAD$/i,
/^MF CONSULTING$/i,
/^SAS MCNEXT$/i,
/^OPENBRIDGE$/i,
/^AVISTO$/i,
/^MODIS FRANCE$/i,
/^QUARTZ-INGENIERIE$/i,
/^PROTECTIC$/i,
/^INATIS$/i,
/^TREFLE INGENIERIE$/i,
/^AKKA I & S$/i,
/^QUANTIC ETUDES$/i,
/^SIPROJ$/i,
/^PARTENOR$/i,
/^ATOS INTEGRATION SAS$/i,
/^OMNILOG$/i,
/^TALEA$/i,
/^CELLA INFORMATIQUE$/i,
/^L' INFORMATIQUE COMMUNICANTE$/i,
/^DEGETEL GROUP$/i,
/^GREEN CONSEIL$/i,
/^NOUVELI$/i,
/^ADENIUM SAS$/i,
/^MATIS TECHNOLOGIES$/i,
/^ERES TECHNOLOGIE$/i,
/^COMTIS$/i,
/^IMPROVEUS$/i,
/^ABS TECHNOLOGIES$/i,
/^OZITEM$/i,
/^CORAUD$/i,
/^ALYOTECH$/i,
/^ON-X$/i,
/^GROUPE SOFT COMPANY$/i,
/^AXILEO$/i,
/^CTS$/i,
/^ATOS A2B/i,
/^INFOSPEC$/,
/^SPIE$/,
/^M PLANET$/,
/^AKEBIA$/,
/^PARITEL TELECOM$/,
/^CELAD$/,
/^ALYOTECH CONSULTING$/,
/^KP2I$/,
/^PHINEO$/,
/^ACIAL$/,
/^INVIVOO$/,
/^IBSI$/,
/^SAVANE$/,
/^ALTER SOLUTIONS$/,
/^FORSITEC$/,
/^STEEPCONSULT SA$/,
/^GALLAN CONSULTING$/,
/^AXEL IT$/,
/^SNAISO$/,
/^LEXSI$/,
/^FREE EXPERT$/,
/^UNIWARE GLOBAL SERVICES$/,
/^4ICOM$/,
/^ABASE SAS$/,
/^AMD CONSULTING$/,
/^CASTELIS$/,
/^ATHEOS$/,
/^GROUPE ELCIMAI$/,
/^AMD CONSEIL$/,
/^LOGFI$/,
/^EXPERIS IT$/,
/^DRIMS$/,
/^SIBIO$/,
/^CNS COMMUNICATIONS$/,
/^AKKA I & S$/,
/^FRAMEIP$/,
/^SMILE$/,
/^EXPECTRA$/,
/^INCKA$/,
/^INFACT FRANCE$/,
/^ODESYS$/,
/^CGI$/,
/^LINCOLN SA$/,
/^CONSULTAKE$/,
/^AVANISTA$/,
/^VITAM$/,
/^AMESYS$/,
/^NEOVITY$/,
/^TECHNO 5$/,
/^KEREVAL$/,
/^ELSYS DESIGN$/,
/^SOGETI HIGH TECH$/,
/^ALTER DEFENSE$/,
/^ORNESS$/,
/^IN SITU$/,
/^EXL GROUP$/,
/^SELESCOPE$/,
/^MALLYANCE$/,
/^CISIF$/,
/^LOGAXONE$/,
/^PRIME IT$/,
/^DIADEMYS$/,
/^STUDEC$/,
/^CLARANS CONSULTING$/,
/^DATA BASE FACTORY$/,
/^DGE INTERIM$/,
/^ETRALI$/,
/^QUANTIC$/,
/^DELETEC$/,
/^S'TEAM MANAGEMENT$/,
/^SOGETREL$/,
/^CONSORT FRANCE$/,
/^EVA GROUP$/,
/^COMPUTER FUTURES SOLUTIONS$/,
/^INTERDATA$/,
/^MANAGEMENT CONSEIL INGENIERIE$/,
/^KEY CONSULTING$/,
/^ATLANTIC INGENIERIE$/,
/^NETAPSYS CONSEIL$/,
/^GESER-BEST$/,
/^IT LINK SYSTEM$/,
/^IT LINK$/,
/^KACILEO$/,
/^NTT CORPORATE$/,
/^PRO IT CONSEIL$/,
/^TALEND S\.A\.$/,
/^ACT'M ADVISORS$/,
/^EPI ETUDES & PROJETS INDUSTRIELS$/,
/^BT SERVICES$/,
/^D-FI SERVICES$/,
/^NEO SOFT SERVICES$/,
/^SEA TPI$/,
/^VENEDIM$/,
/^SAFARI TECHNOLOGIES$/,
/^EUROPARTNER FRANCE$/,
/^HN SERVICES$/,
/^MANAGEMENT AND BUSINESS ASSOCIATES$/,
/^ESR - GROUPE OSIATIS$/,
/^KLEE$/,
/^SAVANE CONSULTING$/,
/^ARROW ECS$/,
/^DG CONSEILS$/,
/^CRISTAL SOLUTIONS$/,
/^2SB$/,
/^CONSEILS ET SYSTEMES INFORMATIQUES$/,
/^F. INICIATIVAS$/,
/^AMESYS CONSEIL$/,
/^ACCESS ETOILE$/,
/^INGIMA$/,
/^ACENSI SAS$/,
/^ABSYS CYBORG$/,
/^COGITEAM$/,
/^INFOG$/,
/^AKKA INGENIERIE PRODUIT$/,
/^MEILLEURE GESTION$/,
/^ELANZ$/,
/^CS SYSTEMES D'INFORMATION$/,
/^BAW$/,
/^SAS SOLLAN FRANCE$/
);

var blockedDesc =  new Array(
/\bConseil en Technologies\b/i,
/\bconseil et l'ingénierie\b/i,
/\bConseil en informatique\b/i,
/\bcabinets? de conseil\b/i,
/\bcabinets? indépendant de conseil\b/i,
/\bSociétés? d'Ingénierie\b/i,
/\bsociétés? de services?\b/i,
/\bSociétés? de conseil\b/i,
//\bsociété de Conseil en informatique\b/i,
//\bsociété de conseil et d'ingénierie informatique\b/i,
//\bSociété de Conseil et de Service en Ingénierie Informatique\b/i,
//\bSociété de Services? en Ingénierie Informatique\b/i,
/\bEntreprises? de Services? du Numérique\b/i,
/\bESN\b/i,
//\bintégrateur de solutions\b/i,
/\bintégrateur d'infrastructure\b/i,
/\bintegrateur Grands Comptes\b/i,
//\best un integrateur\b/i,
/\bSSII\b/i,
/[ée]diteurs? (français )?(de )?logiciels?\b/i,
/[ée]diteurs? (de )?progiciels et \b/i,
/[ée]diteurs? (de )?solutions\b/i,
/\bintégrateurs? de solutions applicatives\b/i,
/\bintégrateur spécialisé\b/i,
/\bintégrateur de solutions\b/i,
/\bspécialisée? dans l'intégration\b/i,
/\bfournisseur de services managés\b/i,
/\b[ée]ntreprise de Services du Numérique\b/i,
/\b[ée]ntreprise Intégrateur\b/i,
/\b[ée]diteur de solutions\b/i,
/\bde services numériques\b/i,
/\bdéploie pour ses clients\b/i,
/\bleaders français sur le marché des télécoms\b/i,
/\bFort de ses [0-9]+ consultant\b/i,
//\ben tant qu'équipementier et intégrateur\b/i,
/\bdes? grandes entreprises\b/i,
/\bnous délivrons des projets\b/i,
/\bdéploie pour ses clients des solutions d'optimisation IT\b/i,
/\bpartenaire incontournable [^.]+ systèmes d'informations\b/i,
/\bSolutions de Sécurité Informatique\b/i,
/\baccompagnons nos clients dans la gestion de leurs systèmes d informations\b/i,
/\bleaders incontestés dans les services en informatique\b/i,
/\bConseil en Technologies\b/i,
/\bNos équipes accompagnent les acteurs des secteurs\b/i,
/\baccompagne un client\b/i,
/\bmode projet auprès de nos clients\b/i,
/\bprestation de service\b/i,
/\baccompagner? les grands comptes\b/i,
/\baccompagner? les grandes entreprises\b/i,
/\baccompagner? nos clients\b/i
);


var whiteDesc =  new Array(
/\brecrutement\b/,
/\bDirection des systèmes\b/,
/\bDSI\b/,
/\brecrute pour son client\b/
);



var blockedTitle =  new Array(
/\bconsultant\b/i
);

// Variables de titre

var theParent = document.getElementById('content');
var theKids = theParent.children;
var initTitle = theKids[0].innerHTML;

//var a = [];
//GM_setValue("customBoites", JSON.stringify(a));

// manage cookie
// GM_deleteValue("customBoites");

if(GM_getValue("customBoites")) {
	var customBoites = JSON.parse(GM_getValue("customBoites"));
} else {
	var customBoites = new Array();
}
//blockedBoites=blockedBoites.concat(customBoites);


function addtoGM(e) {
				console.log(e);
		var boitez=e.target.innerHTML;
		
	if(confirm("Ne plus afficher les annonces de "+boitez+" ?")) {

		customBoites.push(boitez);
		GM_setValue("customBoites", JSON.stringify(customBoites));
		console.log(GM_getValue("customBoites"));
		
		//var up=e.target.parentNode.parentNode.parentNode;
		//	up.parentNode.removeChild(up);
		
		ReplaceContentInContainer(".boxContent.offre");
	
		var rightBoite = document.createElement('div');
		rightBoite.innerHTML = boitez;
		rightBoite.addEventListener("click", removefromGM, false);
		rightPan.appendChild(rightBoite);
	
	}
}

function removefromGM(e) {
		console.log(e);
		var boitez=e.target.innerHTML;
		
	if(confirm("Réafficher les annonces de "+boitez+" ?\n(effet après rafraichissement de la page)")) {

		var idx = customBoites.indexOf(boitez);  // Find the index
		if(idx!=-1) customBoites.splice(idx, 1); // Remove from array
	
		GM_setValue("customBoites", JSON.stringify(customBoites));
		console.log(GM_getValue("customBoites"));
		
		var up=e.target;
			up.parentNode.removeChild(up);
		
	}
	
	
}

function ReplaceContentInContainer(selector) {
var count_replaced=0;
var nodeList = document.querySelectorAll(selector);
    $(selector).each(function(){ // Boite loop
        var jboite_h4 = $(this).find("h4").first();
        var boite_h4 = jboite_h4[0];
        if(boite_h4 && boite_h4.tagName == "H4") { // Get boite name (this = announce block, boite_h4 = company name & location, boite[1] = company name)
            var boite=stripTags(boite_h4.innerHTML).replace(/\s+/g," ").replace(/^ /,"").match(/^(.+) \- (.+)$/);
            if(boite === null && boite_h4.children[0]) {
                boite=new Array();
                boite[1]=boite_h4.children[0].innerHTML;

            } else { // Make boite clickable
                var logtxt = boite[1];
                boite_h4.innerHTML=boite_h4.innerHTML.replace(/<\/?([^>]+)>/ig,""); // strip tags
                var btn = document.createElement('h4');
                var btns1 = document.createElement('span');
                var btns2 = document.createElement('span');
                btns1.addEventListener("click", addtoGM, false);
                var tmp =boite;
                var tmp2=boite[2];
                btns1.innerHTML=tmp[1]; 
                btns2.innerHTML=" - "+tmp2; 
                btn.appendChild(btns1);
                btn.appendChild(btns2);
                $(btn).insertBefore(jboite_h4);
                jboite_h4.remove();
            }

            // Check & disable boite based on HARD-CODED company name
            var broken=false;
            for (var j=0, len=blockedBoites.length;j<len;j++) {
                if(boite[1].match(blockedBoites[j])) {
                    logtxt += " ... removed! (cause: hard-coded company blacklist)"; 
                    $(this).remove();
                    count_replaced++;
                    broken = true;
                    break;
                }
                    
            }
            
            // Check & disable boite based on USER-DEFINED company name
            if(!broken)
                for (var j=0, len=customBoites.length;j<len;j++) {
                    if(boite[1] == customBoites[j]) {
                        logtxt += " ... removed! (cause: user-defined company blacklist)";
                        $(this).remove();
                        count_replaced++;
                        broken = true;
                        break;
                    }
                }

            // Check & disable boite based on HARD-CODED description
            if(!broken) {
                var annDesc = $(this).find("div.intituleForHighlight").text();
                for (var j=0, len=blockedDesc.length;j<len;j++) {
                    if(annDesc.match(blockedDesc[j])) {
                        
                    var whitelisted = false;
                    for (var j=0, len=whiteDesc.length;j<len;j++) {
                        if(annDesc.match(whiteDesc[j])) {
                            whitelisted = true;
                        }
                    }
                    if(!whitelisted) {
                        logtxt += " ... removed! (cause: suspicious sentence in description)";
                        //$(this).remove();
                        $(this).css("opacity", 0.25);
                        count_replaced++;
                        broken = true;
                    }
                        break;
                    }
                }
            }

            // Check & disable boite based on HARD-CODED description
            if(!broken) {
                var annTitle = $(this).find("h3").text();
                for (var j=0, len=blockedTitle.length;j<len;j++) {
                    if(annTitle.match(blockedTitle[j])) {
                        logtxt += " ... removed! (cause: suspicious sentence in title)";
                        $(this).remove();
                        count_replaced++;
                        broken = true;
                        break;
                    }
                }
            }

            console.log(logtxt);

        }
    });

 // Afficher le nombre de résultats supprimés dans le titre de page

var deletednb = count_replaced;

theKids[0].innerHTML=initTitle.replace(" correspondent à votre recherche",", "+deletednb+" supprimée"+((deletednb>1)?"s":"")+" sur cette page");
  
return count_replaced;
}

function stripTags(stringz) {
  return stringz.replace(/<\/?[^>]+>/g, '');
}

 // Lancer la suppression des annonces

ReplaceContentInContainer(".boxContent.offre");


// Afficher la liste des entreprises bloquées par l'utilisteur

var rightPan = document.querySelectorAll(".box2Benday")[0];
var rightTitle = document.createElement('div');
rightTitle.innerHTML = "<b>Entreprises perso. exclues:</b><br>"
rightPan.appendChild(rightTitle);

	for (var i=0, len=customBoites.length;i<len;i++) {
		var rightBoite = document.createElement('div');
		rightBoite.innerHTML = customBoites[i];
		rightBoite.addEventListener("click", removefromGM, false);
		rightPan.appendChild(rightBoite);
	}