// ==UserScript==
// @name         Aides Administratives LaMiete
// @namespace    http://tampermonkey.net/
// @version      0.3.8
// @description  Aides aux démarches administratives a l'aide d'indication complémentaire au sites suivies de @match:
// @author       DEV314R
// @match        https://wwwd.caf.fr/wps/myportal/caffr/moncompte/tableaudebord/*
// @match        https://wwwd.caf.fr/wps/myportal/caffr/moncompte/tableaudebord
// @match        https://wwwd.caf.fr/wps/myportal/caffr/moncompte/contactermacaf
// @match        https://wwwd.caf.fr/wps/myportal/caffr/moncompte/estimervosdroits/laideaulogement
// @match        https://connect.caf.fr/connexionappli/dist/*
// @match        https://assure.ameli.fr/PortailAS/appmanager/PortailAS/assure?_nfpb=true&_pageLabel=as_accueil_page
// @match        https://assure.ameli.fr/PortailAS/appmanager/PortailAS/assure?_nfpb=true&_pageLabel=as_login_page
// @match        fc.assure.ameli.fr/FRCO-app/login
// @match        https://www.ameli.fr/assure
// @match        https://www.ameli.fr/*/assure
// @match        https://assure.ameli.fr/PortailAS/appmanager/PortailAS/assure?_somtc=true
// @match        https://assure.ameli.fr/PortailAS/appmanager/PortailAS/assure?_nfpb=true&_pageLabel=as_accueil_page&_somtc=true
// @match        https://assure.ameli.fr/PortailAS/appmanager/PortailAS/assure?_nfpb=true&_pageLabel=as_info_perso_page
// @match        https://www.impots.gouv.fr/accueil
// @match        cfspart.impots.gouv.fr/enp/ensu/accueilensupres.do
// @match        https://cfspart.impots.gouv.fr/enp/ensu/interdeclarations.do
// @match        https://ants.gouv.fr/contactez-nous/particulier
// @match        https://moncompte.ants.gouv.fr/mon_espace
// @match        https://www.lassuranceretraite.fr/portail-info/home.html
// @match        https://www.lassuranceretraite.fr/portail-info/*
// @match        sngikw.axshare.com
// @match        vk1vmf.axshare.com
// @match        anm4sw.axshare.com
// @match        zkqd1b.axshare.com
// @match        821ab2.axshare.com
// @match        1qutnp.axshare.com
// @match        6jm2fz.axshare.com
// @match        tsnxyn.axshare.com
// @icon         https://external-content.duckduckgo.com/ip3/lamiete.com.ico
// @run-at       document-end
// @license      CC BY NC (DEV314R,LaMieteDevelopement)
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454887/Aides%20Administratives%20LaMiete.user.js
// @updateURL https://update.greasyfork.org/scripts/454887/Aides%20Administratives%20LaMiete.meta.js
// ==/UserScript==
//https://www.economie.gouv.fr/apie/propriete-intellectuelle-publications/contenus-sous-licences-libres
//https://franceconnect.gouv.fr/nos-services

/*RESSOURCE Général
HTML:
https://developer.mozilla.org/fr/docs/Learn/HTML/Cheatsheet
CSS:
https://hackr.io/blog/css-cheat-sheet
https://htmlcheatsheet.com/css/
JS:
https://htmlcheatsheet.com/js/
https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide
Regex:
https://regexr.com/
https://regex101.com/

//RESSOURCE à privilégier:
CSS:
https://www.w3schools.com/cssref/sel_after.php
https://www.w3schools.com/cssref/sel_before.php
https://www.geeksforgeeks.org/css-hover-selector/
https://www.w3schools.com/cssref/css_units.php
https://www.w3schools.com/css/css_font_size.asp
https://www.w3schools.com/CSS/css_font_style.asp
https://www.w3schools.com/cssref/pr_class_display.php
https://developer.mozilla.org/fr/docs/Web/CSS/display
https://www.geeksforgeeks.org/css-hover-selector/
https://developer.mozilla.org/fr/docs/Web/CSS/position
https://www.w3schools.com/Css/css_positioning.asp
https://developer.mozilla.org/fr/docs/Web/CSS/text-align
https://www.w3schools.com/css/css_border.asp
https://www.w3schools.com/css/css_outline.asp
https://www.w3schools.com/csS/css_padding.asp
https://www.w3schools.com/Css/css_margin.asp
https://www.w3schools.com/css/css3_variables.asp
https://www.w3schools.com/cssref/pr_class_cursor.php
https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale
https://developer.mozilla.org/fr/docs/Web/CSS/z-index
JS:
https://developer.mozilla.org/fr/docs/Web/API/Element/insertAdjacentElement
https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
HTML:
https://developer.mozilla.org/fr/docs/Web/HTML/Element/a

////////////////////////////////////////////////////////////
https://kit-inclusion.societenumerique.gouv.fr/
CAF, AMELI, IMPÔT, lassuranceretraite(carsat), étrangers en france,Pôle Emploi

https://loicgervais.fr/miroir-mon-site-miroir/
caf:
🎯➡️▶️➕Parcours d’un primo demandeur avec numéro de sécurité sociale:
🔗https://6jm2fz.axshare.com/#p=demande_presta
🎯➡️▶️➕Parcours d’un primo demandeur sans numéro de sécurité sociale:
🔗https://tsnxyn.axshare.com/#g=1&p=demande_presta


Pôle Emploi:( ajouter css mediatheque.pole-emploi.fr )
https://www.pole-emploi.fr/accueil/|https://authentification-candidat.pole-emploi.fr/connexion/*
⟳🔃S'actualiser sans déclarer d'événement:
🔗http://mediatheque.pole-emploi.fr/Simulateurs/S20HV064/pages/s20hv064seq010/html/index.html?id=0
⟳🔃S'actualiser en déclarant un événement:
🔗http://mediatheque.pole-emploi.fr/Simulateurs/S20HV066/pages/s20hv066seq010/html/index.html?id=0
⟳🔃Je déclare un changement de situation:
🔗http://mediatheque.pole-emploi.fr/Simulateurs/S20HV065/pages/s20hv065seq010/html/index.html?id=0
📎J’envoie un document à Pôle Emploi:
🔗https://mediatheque.pole-emploi.fr/Simulateurs/PECH_S18HV013_EnvoyerDocument/theme/intro.html
▶️➕Je m’inscris aux ateliers proposés par Pôle Emploi:
🔗http://mediatheque.pole-emploi.fr/Simulateurs/S20HV050/pages/s20hv050seq010/html/index.html?id=0


toutes border minimum 0.2em
toutes color:white;background:orange;
touts éméments d'une page a eu des modification dois avoir: border:orange

https://administration-etrangers-en-france.interieur.gouv.fr/particuliers/#/
*/
document.querySelector("head").insertAdjacentHTML('afterend',(`
<style type="text/css" >
:root{
--co: #f3f3f3;
--bg: #e5562a;
}

.table-style{display: none;}

.table-style{
border-collapse: collapse;
box-shadow: 0 5px 50em rgba(0, 0, 0, .2);
/*cursor: pointer;*/
margin: 0px auto;
border: 2px solid midnightblue;
}

thead tr{
background-color: midnightblue;
color: #fff;
text-align: left;
}

th,td{
padding: 0.1em 0.2em;
text-align: left;
}

tbody tr,td,th{
border: 1px solid #ddd;
}

/*tbody tr:nth-child(even){
    background-color: #d2332b;
}*/
</style>
`))

document.addEventListener('readystatechange',()=>{
/*CAF: */
if(location.href.search(/caf.fr\/wps\/.+\/tableaudebord/gi)>-1) {
//document.querySelector("#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(2)> a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf").innerHTML+=(`

document.querySelector("head").insertAdjacentHTML('afterend',(`<style type="text/css" >
#theme-header-menu-links > ul > li:nth-child(3) > a:hover + .table-style{
/*opacity:1;*/
/*visibility:visible;*/
display: block;
font-size: 1.1em;
color: var(--co);
background-color: var(--bg);
position:relative;
bottom: 0em;
left: 0em;
border: 0.2em solid #fff;
border-radius: 0.1em;
z-index: 100;
}

#profil-collapse > div:nth-child(1) > p:nth-child(7):after {
	display: block;
	content: "Comprend aussi: vos coordonnées bancaires";
	padding-left: 0!important;
	padding-right: 0!important;
	color: var(--co);
	background-color: var(--bg);
}

#accueil-moncompte-pave-2-cnaf > cnaf-contacter-macaf-moncompte > div > div.col-sm-12.hidden-xs > div::after {
	display: block;
	font-size: 1.2em!important;
	content: "✉ | @ | ✆ +🦻| Demander un rendez-vous |📍Trouver un point accueil Caf";
	padding-left: 0!important;
	padding-right: 0!important;
	color: var(--co);
	background-color: var(--bg);
}

#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(1) > a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf:hover + .table-style{
display: block;
font-size: 1.1em;
color: var(--co);
background-color: var(--bg);
	position:absolute;
	bottom: 4em;
	left: -12em;
	border: 0.2em solid #fff;
	border-radius: 0.1em;
	z-index: 100;
}


#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(2) > a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf:hover + .table-style{
/*opacity:1;*/
/*visibility:visible;*/
display: block;
font-size: 1.1em;
color: var(--co);
background-color: var(--bg);
position:absolute;
bottom: 4em;
left: -12em;
border: 0.2em solid #fff;
border-radius: 0.1em;
z-index: 100;
}

#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(3) > a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf:hover + .table-style{
/*opacity:1;*/
/*visibility:visible;*/
display: block;
font-size: 1.1em;
color: var(--co);
background-color: var(--bg);
position:absolute;
bottom: 4em;
left: -12em;
border: 0.2em solid #fff;
border-radius: 0.1em;
z-index: 100;
}
/*///////*/


#theme-header-menu-links > ul > li:nth-child(3) > a,#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(1) > a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf,#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(2) > a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf,#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(3) > a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf{border: 0.2em dotted var(--bg)!important
}
#theme-header-menu-links > ul > li:nth-child(3) > a:hover,#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(1) > a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf:hover,#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(2) > a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf:hover,#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(3) > a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf:hover{border: 0.2em solid var(--bg)!important
}
</style>`))

document.querySelector("#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(1) > a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf").insertAdjacentHTML('afterend',(`
<table class="table-style">
<thead>
 <tr>
  <th>Prime d'activité</th>
  <th>RSA (Revenu de Solidarité Active)</th>
                <th>🏠Logement</th>
                <th>PAJE (Prestation d'Accueil du Jeune Enfant)</th>
                <th>Aides sur mesdroitssociaux.gouv.fr</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
</table>`))

document.querySelector("#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(2)> a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf").insertAdjacentHTML('afterend',(`
<table class="table-style">
        <thead>
            <tr>
                <th>🏢Vie professionnelle:</th>
                <th>🚸Enfants:</th>
                <th>🏠Logement:</th>
                <th>🧑‍🤝‍🧑Couple:</th>
                <th>🙋Vie personnelle:</th>
           </tr>
        </thead>
        <tbody>
            <tr>
                <td>•Avoir trouvé du travail<br>•Être au chômage<br>•Travailler en france</td>
                <td>•Les grossesses<br>•Les acouchements<br>•Si un enfant poursuit des études<br>•Quand l'aîné des enfants a 20 ans, et d'autres</td>
                <td>•Amenagements<br>•Déménagements<br>•Héberger une personne<br>•Être en maison de retraite<br>•Ne pas pouvoir payer son loyer</td>
                <td>•Vivre en couple<br>•Se séparer<br>•Décés d'un des conjoints</td>
                <td>•Être en maladie de longue durée<br>•En accident du travail<br>•Changer de coordonnées(banque, téléphone, mail)</td>
            </tr>
        </tbody>
</table>`))

document.querySelector("#demarches-collapse > div > div.row.hidden-xs > ul > li:nth-child(3) > a.btn.btn-form-cnaf.btn-block.btn-secondaire-cnaf").insertAdjacentHTML('afterend',(`
<table class="table-style">
        <thead>
            <tr>
                <th>🙋Vie personnelle</th>
                <th>🏢Vie professionnelle:</th>
                <th>🏠Logement:</th>
                <th>♿Handicap:</th>
                <th>🩹Accident de vie:</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
</table>`))


document.querySelector("#theme-header-menu-links > ul > li:nth-child(3) > a").insertAdjacentHTML('afterend',(`
<table class="table-style">
        <thead>
            <tr>
                <th>Ma Situation</th>
                <th>Droits et prestations</th>
                <th>Mes démarches</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
 </table>`))

}

if(location.href.search(/wwwd.caf.fr\/.+\/laideaulogement#\/declaration/gi)>-1) {
document.querySelector("head").insertAdjacentHTML('afterend',(`
<style type="text/css">
[id*="ns"] > app-root > div > div > div > app-declaration > div > app-info-logement > div > div > ccd-boutons-radio:nth-child(3) > div > div > fieldset > div > div > div:nth-child(1) > label > span:after{
display: block;
content:"ou HLM";
color:var(--co);
background-color:var(--bg);
}
</style>`))
}

if(location.href.search(/caf.fr\/wps\/myportal\/caffr\/moncompte\/contactermacaf/gi)>-1) {
document.querySelector("head").insertAdjacentHTML('afterend',(`
<style type="text/css" >
#conteneur-contact-complet > div > div > div:nth-child(5):after{
display:block!important;
color:var(--co);
background-color:var(--bg);
position: relative!important;
content:"L’action sociale s’adresse aux familles avec enfants à charge dont le quotient familial est inférieur\
 à 800€ et se porte sur les accidents de vie tels qu'une séparation,un décès, impayés de loyer. L’assistante sociale peut être sollicitée au 04 72 68 38 13 pour un RDV les lundis, mardi et jeudi de 9h00 à 12h30, ou par email via l’espace allocataire « prendre un rdv »";
padding: 0.2em!important;
}
</style>`))
}


/*AMELI: */
if(location.href.search(/(assure.ameli.fr\/PortailAS\/appmanager\/PortailAS\/)(.+as_login_page|assure\?_somtc=true)/gi)>-1) {
document.querySelector("#connexioncompte_2nir_as").placeholder+=" à 13 chiffres"
document.querySelector("#connexioncompte_2nir_as").title+=" à 13 chiffres"
}
if(location.href.search(/fc.assure.ameli.fr\/FRCO-app\/login/gi)>-1) {
document.querySelector("#j_username").placeholder+=" à 13 chiffres";
document.querySelector("#j_username").title+=" à 13 chiffres";
}
if(location.href.search(/www.ameli.fr\/([A-Z]+\/)?assure/gi)>-1) {
document.querySelector("head").insertAdjacentHTML('afterend',(`
<style type="text/css">
#block-amelitelecommandeblock > div > nav > ul > li.moncompte:before{
color:var(--co);
background-color:var(--bg);
	content: "Se connecter: "
}
#block-amelitelecommandeblock > div > nav > ul > li.moncompte > div{
border: 0.25em solid var(--bg)!important;
}
</style>`))
}
if(location.href.search(/assure.ameli.fr\/PortailAS\/appmanager\/PortailAS\/assure\?_nfpb=true/gi)>-1) {
document.querySelector("head").insertAdjacentHTML('afterend',(`
<style type="text/css">
#menuDemarche,
#lienDemarchesAccueil > div > div > h2.lienDemarches > a{
border-bottom:var(--bg) double;
}

#idBlocProfil:before {
	display: block;
	content: "Modifier votre profil:";
	padding-left: 0!important;
	padding-right: 0!important;
	color: var(--co);
	background-color: var(--bg);
}
#idBlocProfil{border:var(--bg) solid}

#connexioncompte_2nir_as{border-right: var(--bg) dashed!important;}

#demandCodeConfidentiel_3demandeCodeConfidentielForm > div.blocformfond > div:nth-child(2) > div.r_ddc_envoi_mail:after{
display: block;
content: "Sinon appeler le 3646 ou aller au point d'accueil assurance maladie."!important;
color: var(--co);
background-color: var(--bg);
}
</style>`))
}

if(location.href.search(/assure.ameli.fr\/PortailAS\/appmanager\/PortailAS\/assure\?_nfpb=true&_pageLabel=as_info_perso_page/gi)>-1){
document.querySelector("#pageAssure > div:nth-child(6) > div.infoGauche").insertAdjacentHTML('afterend',(`
<table class="table-style">
<tbody>
 <tr>
  <td>
SI changement ou plus de médecin traitant, quelles sont les conséquences pour
l’usager ?<br>
L’assuré peut changer de MT quand il le souhaite, il doit obligatoirement le déclarer soit
par télétransmission via la carte vitale faite avec le nouveau Médecin traitant, soit enremplissant le formulaire suivant:
<a target="_blank" href="https://www.ameli.fr/rhone/medecin/recherche-formulaire?
text=&formulaire%5B%5D=formulaires_category_facet%3A335&email-honey.=">www.ameli.fr/rhone/medecin/</a><br>
En cas de départ à la retraite du médecin traitant et en l’absence de nouveau médecin
traitant, la Cpam du Rhône procède automatiquement à une mise à jour du dossier de
l’assuré pour que la personne ne soit pas pénalisée en matière de remboursement
pendant une année.
  </td>
 </tr>
</tbody>
</table>`))

document.querySelector("head").insertAdjacentHTML('afterend',(`<style type="text/css" >
#pageAssure > div:nth-child(6) > div.infoGauche/*:hover*/ + .table-style{
display: flex;
font-size: 1em;
color: var(--co);
background-color: var(--bg);
position:absolute;
bottom: 6em;
left: -20em;
border: 0.2em solid var(--bg);
height: auto;
width: 41em
}
#pageAssure > div:nth-child(6) > div.infoGauche{
border: 0.2em solid var(--bg);
}
</style>`))
}
/*option guider:
[Transmettre un document]
*/

/*IMPÔT: */
//représisser et démarquer Démarches sans ce connecter
if(location.href.search(/www.impots.gouv.fr\/accueil/gi)>-1) {
document.querySelector("#block-menuentete > div > ul > li:nth-child(1)").insertAdjacentHTML('afterend',(`
<button id="sansco" style="position:absolute;height:2.5em;top:1.3em;left:-10em;color:var(--co);background-color:var(--bg);transform:scale(1.2);">Démarches sans ce connecter</button>
`))
const link =document.querySelector("#sansco");
link.addEventListener('click',()=>{
document.querySelector("body > div.dialog-off-canvas-main-canvas > div.page > main > div > div > div > div > article > div.field.field--name-field-page-content.field--type-entity-reference-revisions.field--label-hidden.field__items > div:nth-child(3) > div > div > div > h2").scrollIntoView();
})

}

if(location.href.search(/cfspart.impots.gouv.fr\/enp\/ensu\/accueilensupres.do/gi)>-1) {
document.querySelector("#contenu > div > div.row.blocPrincipal > div.hidden-xs.hidden-sm.col-md-4.retraitPadding > div:nth-child(2)").insertAdjacentHTML('afterend',(`
<a style="display:block;position:absolute;color:var(--co);background:var(--bg);bottom:12.5em;" target="_blank" href="https://www.service-public.fr/particuliers/vosdroits/R62211" >Connaître la date limite pour faire votre déclaration de revenus (Simulateur) </a>
`))
document.querySelector("#contenu > div > div.hidden-xs.row.retraitPadding.questionContact").insertAdjacentHTML('afterend',(`
<table class="table-style">
<tbody>
 <tr>
  <td>
Comment faire pour mieux comprendre les termes des formulaires ?
Pour mieux comprendre le vocabulaire fiscal, un lexique des principaux termes employés a été
crée. Il est accessible dans la communauté en ligne « France service 69 » et peut être partagé.
Pour chaque formulaire, une notice est disponible sur impots.gouv.fr.
Pour la déclaration de revenu, une brochure pratique détaille, rubrique par rubrique tout le contenu
et les différents dispositifs: <a target="_blank" href="https://www.impots.gouv.fr/portail/node/9598">impots.gouv.fr</a>
  </td>
 </tr>
</tbody>
</table>`))
document.querySelector("head").insertAdjacentHTML('afterend',(`
<style type="text/css" >
#contenu > div > div.hidden-xs.row.retraitPadding.questionContact/*:hover*/ + .table-style{
display: block;
font-size: 1em;
color: var(--co);
background-color: var(--bg);
position:relative;
left: -21.4em;
border: 0.2em solid var(--bg);
height:auto;
width: 41em!important;
}
#pageAssure > div:nth-child(6) > div.infoGauche{
border: 0.2em solid var(--bg);
}
</style>`))

}

if(location.href.search(/cfspart.impots.gouv.fr\/enp\/ensu\/interdeclarations.do/gi)>-1) {
document.querySelector("body > div.container.general > div > div > ol > li:nth-child(2) > span").insertAdjacentHTML('afterend',(`
<a style="display:block;position:absolute;color:var(--co);background:var(--bg);right:0em;" target="_blank" href="https://www.service-public.fr/particuliers/vosdroits/R62211" >Connaître la date limite pour faire votre déclaration de revenus (Simulateur) </a>
`))
document.querySelector("#contenu > div > div.row.bloc.declarationLigne.retraitPadding > div.col-xs-9.col-sm-6.donnee > div.col-sm-12.sousDeclarationTexte > p").insertAdjacentHTML('afterend',(`
<p style="display:block;position:relative;color:var(--co);background:var(--bg);width:181%!important;">
<b style="font-size: 1.1em;">Que faire en cas d’erreur</b>, est-ce possible de modifier hors délai ?<br>
Si l’usager a fait sa déclaration en ligne: La déclaration peut être modifiée jusqu’à la date limite de
déclaration. Ensuite possibilité de corriger sa déclaration en ligne d’Août à mi-décembre.
Au-delà, possibilité de faire une réclamation/déclaration corrective jusqu’au 31 décembre N+2 (par
messagerie sécurisée ou courrier en adressant les justificatifs nécessaire (ex dépenses ouvrant droit
à réduction ou crédit d’impôt.<br>
Si l’usager a fait sa déclaration papier, possibilité de faire une réclamation/déclaration corrective
jusqu’au 31 décembre N+2 en adressant les justificatifs nécessaire (ex dépenses ouvrant droit à
réduction ou crédit d’impôt.
</p>
`))

}


})
/*ants.gouv.fr*/
if(location.href.search(/ants.gouv.fr\/contactez-nous\/particulier/gi)>-1) {
document.querySelector("head").insertAdjacentHTML('afterend',(`
<style type="text/css">
[id*=panelbh-content] > div > div > div > ul > li:nth-child(1) > strong:after{
font-size: 0.8em;
content:'Si vous avez eu message d\'erreur de type: L\'adresse électronique saisie ne correspond pas au compte ANTS existant.Consulter notre aide « pas-à-pas ».Et que par exemple vous vouler faire un renouvelement de carte d\'identitée...';
color: var(--co);
background-color: var(--bg);
}
div.Da-Accordion-Item:nth-of-type(2){
border: 0.2em dashed var(--bg)!important;
}

div.MuiExpansionPanelDetails-root > div > div > ul > li:nth-child(1) > ul > li{
border: 0.2em solid var(--bg);
}
<style>`))
}


if(location.href.search(/moncompte.ants.gouv.fr\/mon_espace/gi)>-1) {
document.querySelector("head").insertAdjacentHTML('afterend',(`
<style type="text/css">
[title="Carte Nationale d'Identité"]:after{
font-size: 1em;
content:" , Inclue aussi la Carte Nationale d'Identité";
color: var(--co);
background-color: var(--bg);
}

a.modal-trigger:after,a.start-dem-btn.main-btn{
border: 0.2em solid var(--bg)!important;
}
#new-procedure{
border-left:0.2em solid var(--bg);
border-top:0.2em solid var(--bg);
border-bottom:0.2em solid var(--bg);
}
[for="new-procedure"]{
border-right:0.2em solid var(--bg);
border-top:0.2em solid var(--bg);
border-bottom:0.2em solid var(--bg);
}

[id*=ember] > div.title-wrapper > span:before{
font-size: 1em;
content:"L\'immatriculation, Le permis de conduire, La carte d\'identité et le passeport➜";
white-space: pre-wrap;
color: var(--co);
background-color: var(--bg);
}
<style>`))
}


/*lassuranceretraite*/
if(location.href.search(/www.lassuranceretraite.fr\/portail-info\/.+(home)?.html/gi)>-1) {
document.querySelector("head").insertAdjacentHTML('afterbegin',(`
<style type="text/css">
#navbarDropdown-retraite > p > svg,li.lvl.col-xl.dropdown:nth-of-type(3),div.col-lg-3:nth-of-type(6){
border: 0.2em dashed #df0021;
}
[href="https://www.lassuranceretraite.fr/portail-info/home/retraite/mes-demarches/demander-aide-demarche.html"]:after{
color:var(--co);
background-color:var(--bg);
display:block;
content:"ASI et ASPA (Allocation de solidarité aux personnes âgées)";
}
[aria-label="Créer un compte"]{
border:0.2em solid var(--bg);
}
<style>`))

document.querySelector("#navbars2 > ul > li:nth-child(1) > a > span").insertAdjacentHTML('afterend',(`
<p style="display:block;position:absolute;color:var(--co);background:var(--bg);width:40%;height:auto;transform:translate(-8%,16%)!important;z-index:100;">
minimum 6 mois avant pour une demande de retraite<br>
(sinon risque de non revenue dans pour cause de délay administratif) et Il est recommander de créé votre compts 2-3ans à l'avance, ou l'aure de votre première fiche de paye,et créé un compt pour votre complémentaire retraite, garder bien toutes vos fiches de paye pour avoir tout vos droits.
</p>
`))
}
//simulateur et debug
setTimeout(()=>{
/*
document.querySelector("head").insertAdjacentHTML('afterend',(`
<a href="https://fjzxdv.axshare.com/#id=9frmwl&p=page_param_tres&g=1" target="_blank" class="button button1">Accéder à un simulateur CARSAT</a>
`))
*/


if(location.href.search(/connect.caf.fr\/connexionappli\/dist\//gi)>-1) {
document.querySelector("#theme-contenu-content-cnaf > div > app-root > div > div:nth-child(2) > div > app-login > div > div > h3").insertAdjacentHTML('afterend',(`
<a style="position:relative;color:var(--co);background:var(--bg);" target="_blank" href="https://anm4sw.axshare.com/" > ▶️🔗Parcours de l’allocataire sur le nouveau module de connexion </a>
`))
document.querySelector(".row.bloc-mode-connexion-cnaf > div:nth-child(5) > div > a.login-fc-link").insertAdjacentHTML('afterend',(`
<a style="display:block;position:relative;color:var(--co);background:var(--bg);" target="_blank" href="https://zkqd1b.axshare.com/" > ▶️🔗Parcours de l’allocataire lors d’une connexion via FranceConnect </a>
`))
document.querySelector("#theme-contenu-content-cnaf > div > app-root > div > div:nth-child(2) > div > app-login > div > div > div > form > div:nth-child(3)").insertAdjacentHTML('afterend',(`
<a style="position:relative;color:var(--co);background:var(--bg);" target="_blank" href="https://1qutnp.axshare.com/" > ▶️➕🔗Parcours du conjoint sans mot de passe et les parcours de création de compte conjoint sans mot de passe dossier ou enfant / personne à charge </a>
`))
document.querySelector(".row.bloc-mode-connexion-cnaf").insertAdjacentHTML('afterend',(`
<a style="position:relative;color:var(--co);background:var(--bg);" target="_blank" href="https://821ab2.axshare.com/" > ▶️🔗Parcours du conjoint avec le mot de passe du dossier </a>
`))
}
if(location.href.search(/caf.fr\/wps\/myportal\/caffr\/moncompte\/tableaudebord/gi)>-1) {
document.querySelector("#theme-contenu-content-cnaf > div.container > div > h1").insertAdjacentHTML('afterend',(`
<a style="position:absolute;color:var(--co);background:var(--bg);" target="_blank" href="https://sngikw.axshare.com/" > ⚠️Déclaration trimestrielle de ressources pour le RSA et  changement de coordonnées </a>
`))
document.querySelector("#theme-contenu-content-cnaf > div.container").insertAdjacentHTML('afterend',(`
<a style="position:relative;color:var(--co);background:var(--bg);" target="_blank" href="https://vk1vmf.axshare.com/" > ⚠️Déclaration trimestrielle de ressources pour la Prime d’activité et changement de situation professionnelle </a>
`))
}

},1000)

/*OPTIONS:
lien de redirection externe
lien de redirection interne

iframe

*/