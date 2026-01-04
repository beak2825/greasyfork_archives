// ==UserScript==
// @name         ✨TvTime✨
// @namespace    http://tampermonkey.net/
// @version      1.7.2
// @description  TvTime à changer son site pour le moment cette ce script va être temporèrement imcomplet en attendant de trouver oui solution durable. Trouver vos séries, manga, documentaire, émission... depuis tvtime.com: (⟳) vérifie si vos saisons sont completes, 🔍 pour trouver votre serie. Un Bouton [Réglage] sauvegardera vos préférence au file des mise à jours*. Compatible JDownloader*. NOTE debug: réautoriser les Fénêtres contextuelles/redirection si plusieurs fenêtres ne s'ouvre plus*.    *=voir images
// @license      MIT
// @author       DEV314R
// @match        https://www.tvtime.com/fr
// @match        https://www.tvtime.com/fr/*
// @match        https://www.tvtime.com/*/to-watch
// @match        https://dl-protect.link/*
// @match        https://app.tvtime.com/discover/search
// @include      *.zone-telechargement.*
// @icon         https://external-content.duckduckgo.com/ip3/www.tvtime.com.ico
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM.setClipboard
// @grant        window.close
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/458839/%E2%9C%A8TvTime%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/458839/%E2%9C%A8TvTime%E2%9C%A8.meta.js
// ==/UserScript==

const choixServeurOptions=['1fichier','Fikper','Rapidgator','Turbobit','Nitroflare','Netu','Vidoza','Doodstream'];

const variables=[
{name:'juste',label:'Series complètes: ',defaultValue:'activer'},
{name:'jour',label:'Jour après sortie: ',defaultValue:'0'},
{ name: 'hébergeur', label: "Choix d'hébergeur: ", defaultValue: choixServeurOptions[1] },
{ name: 'Temp', label: 'Temp (en ms) par ouverture de lien: ', defaultValue: '8000' },
{ name: 'JDownloader', label: 'Liens vers JDownloader: ', defaultValue: 'désactiver' },
{ name: 'ConfirmerRecherche', label: 'Recherche rapide: ', defaultValue: 'désactiver' }
];

const juste=GM_getValue('juste', variables.find(v => v.name === 'juste').defaultValue);
const jour=GM_getValue('jour', variables.find(v => v.name === 'jour').defaultValue);
const hébergeur=GM_getValue('hébergeur', variables.find(v => v.name === 'hébergeur').defaultValue);
const Temp=GM_getValue('Temp', variables.find(v => v.name === 'Temp').defaultValue);
const JDownloader=GM_getValue('JDownloader', variables.find(v => v.name === 'JDownloader').defaultValue);
const ConfirmerRecherche=GM_getValue('ConfirmerRecherche', variables.find(v => v.name === 'ConfirmerRecherche').defaultValue);


if(location.href.search(/www.tvtime.com/gi)>-1){GM_addStyle(`
section{padding:0;margin:0}
html,.alt-block,#content,section,.row,.body-inner,ul.dropdown-menu,.scrollable,.right{color:#ddd!important;background:#000!important;}
.credits > p,.social,#get-the-app{display:none;}
#home {color:#ddd;background:#fbd737;}
h3,.label,.expand-icon{color:#fbd737!important;}
.label :hover,[data-toggle] :hover{color:#000!important;background:#fbd737;}
.rank-sticker{color:#000!important;}
span,h2{color:#fff!important;}
#profile,#to-watch,.main-block{color:#ddd;background:#222;}
h1,h2 a{color:#ddd!important;}
.posters-list>li .poster-details .secondary-link{color:#888}
.dropdown{background:#1a1a1a!important;}
#episode-details.episode.episode-header.banner.change-episode-link{
	width: 43%;
border: 0.1vw solid #fbd737!important;}
#actor-discussion .filters, #profile-discussion .filters, #profile-shows #favorite-shows .progress, #profile-shows #favorite-shows h3, #profile-shows .labels h4, #profile-shows .posters-list>li .poster-details h3 {
display: block;color: #7cdb62!important;}
.odd *{background:#212121!important;}
`)}
if(location.href.search(/\.zone-telechargement\./gi)>-1){GM_addStyle(`
body,#header,b,.top-title,[class*="content"],.blockbox,ul li,[style] a,div.message_box.berrors,.container,.s_mid,.s_left,.top-year,.imdbRating,.cover_global,.maincont,.blocks{color:#dfdfdf!important;background:#000!important;border-color:#000;}
button,img,[src]{color:#000!important;background:#eee!important;}
.quote,[name="search"]{color:#bbb!important;background:#333!important;}
div,p,table,td,blockquote,li,ul{padding-top:0!important;margin-top:0!important;margin-bottom: 0!important;}
#header,#sidebar-right > div:last-child,#dle-content > div.blockbox > div.blockcontent > div:not(.upload-infos){display: none!important;}
a[href*='-vostfr-720p.html'],a[href*='-vostfr-1080p.html'],a[href*='/vostfr/'],a[href*='-vostfr.html'],[class*="prez"],[title*="Télécharger "],[title*="Regarder "]{display:none!important}
`)}

document.addEventListener('DOMContentLoaded',()=>{
 if(location.href.search(/.zone-telechargement./gi)>-1){

const site="www.zone-telechargement.boats/?p=series&search="

function createInput(variable) {
        const container = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = variable.label;

        let input;

        if (variable.name === 'jour' || variable.name === 'Temp') {
            input = document.createElement('input');
            input.type = 'text';
            input.value = GM_getValue(variable.name, variable.defaultValue);
            input.addEventListener('input', function() {
                input.value = input.value.replace(/\D/g, ''); // Retirer tous les caractères non numériques
                GM_setValue(variable.name, input.value);
            });
        } else if (variable.name === 'hébergeur') {
            input = document.createElement('select');
            for (const option of choixServeurOptions) {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                input.appendChild(optionElement);
            }

            input.value = GM_getValue(variable.name, variable.defaultValue);
            input.addEventListener('change', function() {
                GM_setValue(variable.name, input.value);
            });
        } else {
            input = document.createElement('select');
            const options = ['activer', 'désactiver'];
            for (const option of options) {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                input.appendChild(optionElement);
            }

            input.value = GM_getValue(variable.name, variable.defaultValue);
            input.addEventListener('change', function() {
                GM_setValue(variable.name, input.value);
            });
        }

        container.appendChild(label);
        container.appendChild(input);

        return container;
    }

  function createSettingsButton() {
        const button = document.createElement('button');
        button.textContent = 'Réglages';
        button.style.position = 'fixed';
        button.style.bottom = '0.1em';
        button.style.left = '0.1em';
					   button.style.color = '#000';
					   button.style.backgroundColor = '#ffd700';
					   button.style.zIndex = "1000";
        button.addEventListener('click', function() {
            const settingsPopup = document.createElement('div');
            settingsPopup.style.position = 'fixed';
            settingsPopup.style.bottom = '0';
            settingsPopup.style.left = '0';
            settingsPopup.style.padding = '0.4em';
									   settingsPopup.style.color = '#000';
            settingsPopup.style.backgroundColor = '#ffd700';
            settingsPopup.style.zIndex = "1000";

            for (const variable of variables) {
                settingsPopup.appendChild(createInput(variable));
            }

            const closeButton = document.createElement('span');
            closeButton.textContent = '❌';
            closeButton.style.position = 'absolute';
            closeButton.style.bottom = '8em';//11.9em
            closeButton.style.left = '28.19em';//28.07em
            closeButton.style.cursor = 'pointer';
									   closeButton.style.padding = '0.2em';
									   closeButton.style.backgroundColor = '#000';
            closeButton.addEventListener('click', function() {
                document.body.removeChild(settingsPopup);
            });
            settingsPopup.appendChild(closeButton);

            document.body.appendChild(settingsPopup);
        });

        document.querySelector('.menuico > ul').appendChild(button);
    }
createSettingsButton();


 let ed;
  const cl=document.querySelectorAll('[class*="shows_title"]');//.episode-details.poster-details > a
  for(let g=0;g<cl.length;g++) {
   const s=cl[g];
				if(ConfirmerRecherche=='activer'){
				ed=s.innerText.replace(/ 🔍|\(.+\)/gi, '+')+s.previousElementSibling.querySelector('a').innerText.replace(/S(\d+)E\d+/, (match, saison) => ` - Saison ${parseInt(saison, 10)}`)
				}else{
				ed=s.innerText.replace(/ 🔍|\(.+\)/gi, '+')//.replace(/[,:].*[^.,:]+/g, "").replace(/[,:!]/g, "")
				}
   s.parentNode.parentNode.querySelector(":not(.show-all)").innerHTML+=`<a style="border: 0.2em ridge #ffd700; border-radius: 20%; z-index:99999;" target="_blank" href="https://${site}${ed}">🔍</a>`;
  }

const OnEvent = (doc) => {
  return {
    on: (type, selector, callback) => {
      doc.addEventListener(type, (event) => {
        if (!event.target.matches(selector)) return;
        callback.call(event.target, event);
      }, false);
    }
  };
};

OnEvent(document).on('click', '#rech', () => {re();});

		// Sélectionnez tous les éléments a qui correspondent aux sélecteurs donnés
const a = document.querySelectorAll(".episode-details.poster-details > a[href],#all-shows > section > ul> li > div > div > h2 >a");
let k = 0;

// Fonction pour effectuer la recherche pour un numéro donné
async function recherche(num) {
  const s = a[num];
  const url = s.href;
  const dd = s;
  const da = new Date().valueOf();

  // Créez une nouvelle instance de XMLHttpRequest
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "document";

  // Attendez le chargement de la réponse
  xhr.onload = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Récupérez la date de sortie de l'épisode
      const response = xhr.responseXML.querySelector('.season-content.active > ul > li:last-child > div > div > a > .episode-air-date');
      const db = new Date(response.textContent.match(/\d\d\d\d-\d\d-\d\d/gi)[0]).valueOf();

      if (da >= (db + (jour * 86400000))) {
        dd.innerText += '✅';
      } else {
        if (juste == 'activer') {
          dd.parentNode.parentNode.parentNode.removeChild(dd.parentNode.parentNode);
        }
        dd.innerText += '❌';
        dd.innerHTML += ('<br> ' + ((db - da) / 86400000).toFixed(0) + ' jours restants avant sortie complète');
      }
      dd.innerText += response.innerText;

      // Récupérez le nombre d'épisodes
      const EpisodeMax = xhr.responseXML.querySelectorAll('[itemprop="season"].season-content.active > ul > li').length;
      dd.innerHTML += ('<br>nombre d\'épisode: ' + EpisodeMax);
    }
  };
  xhr.send();
}

// Fonction re optimisée
function re() {
  const i = document.querySelector("#rech");
  const cl = a.length;
  if (k < cl) {
    // Utilisation de setTimeout pour créer un délai de 10 millisecondes entre les itérations
    setTimeout(async () => {
      await recherche(k);
      k++;
      re(); // Appel récursif pour la prochaine itération
    }, 10);
    i.value = "⌛";
    i.style.background = "#000";
  } else if (k === cl) {
    i.value = "👌";
    i.removeAttribute("id");
  }
}


if(location.href.search(/www.tvtime.com\/.+\/show\//gi)>-1){
const d1=new Date().valueOf();
const d2=new Date(document.querySelector(".season-content.active > ul > li:last-child > div > div > a>.episode-air-date").textContent.match(/\d\d\d\d-\d\d-\d\d/gi)[0]).valueOf();
const e=document.querySelectorAll(".episode-nb-label");

const ep=document.querySelectorAll('.watched-btn.active:last-child');const dep=ep[ep.length-1].parentNode.parentNode.parentNode.querySelector('.episode-nb-label').innerText

const r=	document.title.replace(/TV Time - |\(.+\)/gi, "")+'S'+document.querySelector("#dSeasons").innerText.match(/\d+/)[0]+"E"+dep+'/'+e[e.length-1].innerText
  if(d1>=d2){
document.title="✅"+r
   } else {
document.title="❌"+r
    document.querySelector('.col-sm-2.actions > .row > .active.watched-btn.col-sm-offset-4.col-sm-6 > .icon-tvst-watch').scrollIntoView();
   }
   if(location.href.search(/www.tvtime.com\/.+\/show\/\d+/gi) > -1) {
    const dn=document.querySelector("#top-banner > div > div.info-zone > div > div > h1");
    dn.innerHTML+=('<a style="outline:0.1em ridge #ffd700;outline-radius:20%;" href="https://'+site+dn.innerText.replace(/ 🔍|\(.+\)/gi, "")+'" target="_blank">🔍</a>');
  }
  }else{
   document.querySelector('[alt="TV Time Logo"]').insertAdjacentHTML('beforebegin', '<input id="rech" type="button" value="⟳" style="color:#000;background:#ffd700;border: 0.1em solid #ffd700; border-radius:50%;width:2.3em;height:2.3em;"></input><br>'); /*'#home-link'*/
  }


 }else if(location.href.search(/dl-protect.+\//gi)>-1){

  GM_addStyle(`body,.urls{color:#ddd;background:#000!important;}
#subButton{color:#000;transform: scale(1.5);}
.navbar,.amigo,footer{display:none!important;}`)
if (JDownloader=='activer'){
	setTimeout(()=>{
if (document.querySelector('iframe[src*="https://challenges.cloudflare.com"]')){
 document.title="⏳"+document.title
 document.querySelector("#subButton").click()
                 document.title="🖱️"+document.title
 setTimeout(()=>{document.querySelector('[rel="external nofollow"]').click()},100)
 document.addEventListener("visibilitychange", fcliq);
	document.querySelector('html,iframe').addEventListener("mouseenter", fcliq);
 function fcliq(){
  document.title="🤖"+document.title
  setTimeout(()=>{document.querySelector("#subButton").click()},100)}
 var erreur=document.querySelector("#protected-container > div:nth-child(2) > div > ul > li > a");if(erreur.innerText.search(/invalide/gi)>-1){erreur.click()}
}},4000)
if (!document.querySelector('iframe[src*="https://challenges.cloudflare.com"]')){
var lien=document.querySelector("#protected-container > div > div > ul > li > a[href]").href
GM.setClipboard(lien)
document.title="🧠"+document.title
 var erreu=document.querySelector("#protected-container > div:nth-child(2) > div > ul > li > a");if(erreu.innerText.search(/invalide/gi)>-1){erreu.click()
}else{
setTimeout(function f(){window.close(document.URL)},2000)
}
}
}else{
 document.title="⏳"+document.title
 setTimeout(()=>{document.querySelector("#subButton").click()
                 document.title="🖱️"+document.title
                },3000)
 setTimeout(()=>{document.querySelector('[rel="external nofollow"]').click()},100)
 document.addEventListener("visibilitychange", fcliq);
	document.querySelector('html,iframe').addEventListener("mouseenter", fcliq);//document.addEventListener("mouseenter", fcliq);
 function fcliq(){
  document.title="🤖"+document.title
  setTimeout(()=>{document.querySelector("#subButton").click()},100)}
 var erreur=document.querySelector("#protected-container > div:nth-child(2) > div > ul > li > a");if(erreur.innerText.search(/invalide/gi)>-1){erreur.click()}

}

}

if(location.href.search(/series|mangas/gi)>-1){
//extractContent:
// Sélectionnez tous les liens URL et les éléments cibles
const urlElements = document.querySelectorAll("#dle-content > div:nth-child(n+4) > div:nth-child(4) div div a[href]");
const targetElements = document.querySelectorAll("#dle-content > div:nth-child(n+4) > div:nth-child(4) div div a[href]");
// Utilisez Promise.all avec map pour effectuer les requêtes en parallèle
Promise.all(Array.from(urlElements).map(async (urlElement, i) => {
  const url = urlElement.href;
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Extraction du contenu
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const sourceElement = doc.querySelector("#dle-content > div.base > div > div.corps > div:nth-child(1) > div:nth-child(4)");

    // Extraction du numéro de l'épisode le plus récent
    const postinfoText = doc.querySelector("center > .postinfo").innerText;
    const dernierepisodeP2 = Math.max(...(postinfoText.match(/\d+/g) || []));

    // Renvoi du contenu extrait
    let innerText = sourceElement.innerText.match(/\d+ Episodes/gi);

    if (innerText !== null && parseInt(dernierepisodeP2) >= parseInt(innerText[0].match(/\d+/g)[0])) {
      // L'épisode est le plus récent, on ajoute un message de mise à jour
      innerText = "✅ Complet " + parseInt(dernierepisodeP2);
    } else if (innerText == null) {
      innerText = "❗␀ " + innerText;
    } else {
      // L'épisode est incomplet, on retire l'élément parent de targetElements
      targetElements[i].parentElement.parentElement.parentElement.parentElement.remove();
    }

    return {
      targetElement: targetElements[i],
      innerText: innerText
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return {
      targetElement: targetElements[i],
      innerText: "Erreur"
    };
  }
})).then(results => {
  results.forEach(result => {
    result.targetElement.innerHTML += "<br>" + result.innerText;
  });
});

}

 if(location.href.search(/(serie|manga)&id/gi)>-1){
  var t= document.querySelector("#dle-content > div.base > div > div.corps > div:nth-child(1) > div:nth-child(3)")
  var d1=document.querySelector("#dle-content > div.base > div > div.corps > div:nth-child(1) > div:nth-child(4)").textContent.match(/\d+(?=\sEpisode)/gi)[0]
  var dm=document.querySelector("center > .postinfo").innerText.match(/\d+/gi)
  let match= dm.includes(d1)
  t.textContent=(match?"✅":"❌")+t.textContent;
  if (t.textContent.startsWith("✅")){
//ajouterBoutonTOUTDL:
  var elements = document.querySelectorAll('.postinfo div[style*="font-weight:bold;"]');
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var nom = element.innerText.trim();
    element.insertAdjacentHTML('afterbegin', '<a class="tdl-button" style="border: 0.2em ridge #ffd700;padding:0.2em;margin:0.2em;cursor:pointer;"> TOUT DL ' + nom + '</a>');
		}


const buttons = document.querySelectorAll('.tdl-button');

var nombretotalepisode = parseInt(document.querySelector("#dle-content > div.base > div > div.corps > div:nth-child(1) > div:nth-child(4)").textContent.match(/\d+(?=\sEpisode)/gi));
let ts=document.title.replace(/Télécharger/gi,'').replace(/ - Saison /gi,' S');

function openLinksBetween(startButton, endButton) {
  const links = document.querySelectorAll('.postinfo a');
  const startIndex = Array.from(links).indexOf(startButton);
  const endIndex = Array.from(links).indexOf(endButton);
  const linksToOpen = Array.from(links).slice(startIndex + 1, endIndex);

  function openLinksWithDelay(index) {
    if (index < linksToOpen.length) {
      window.open(linksToOpen[index].href, '_blank');
      setTimeout(() => {
        openLinksWithDelay(index + 1);
      }, Temp);
      document.title = (index + 1) + '/' + nombretotalepisode + ts;
    }
  }

  openLinksWithDelay(0);
}

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const nextButton = buttons[index + 1] || null;
    openLinksBetween(button, nextButton);
  });
});
//
		}
 }
///////////

 if(location.href.search(/(serie|manga)&id/gi)>-1){
  var siteT="https://app.tvtime.com/discover/search"
  var noms=document.querySelector("#dle-content > div.base > div > div.corps > div:nth-child(1) > div:nth-child(3)").innerText.replace(/✅|❌/gi,'')
  document.querySelector("#dle-content > div.base > div > div.corps > div:nth-child(1) > div:nth-child(3)").insertAdjacentHTML('beforeend', '<a id="314" style="border: 0.2em ridge #ffd700; color:ffd700; background:#000; margin-left:0.6em;" target="_blank" href="'+siteT+'">TV Time🔍</a><br>')
	GM_deleteValue("tempo")
	GM_setValue('tempo',noms);
 }else if (location.href.search(/app.tvtime.com\/discover\/search/gi)>-1){
//		console.log( GM_getValue('tempo',""))
setTimeout(()=>{
			const recherche=document.querySelector("body > flutter-view > flt-text-editing-host > form > input.flt-text-editing.transparentTextEditing")
			recherche.value = GM_getValue('tempo','');
	setTimeout(()=>{GM_deleteValue('tempo')},1000)
		},4000)

 }

function site(href){return location.href.search(href)>-1}

if (ConfirmerRecherche=='activer'){
if(location.href.search(/zone-telechargement.+(&search|search=)/gi)>-1){retirerNonConformes("#story",".cover_infos_title",3).then(function2);

setTimeout(()=>{
   document.title="⏳❔"+document.title
   if( ( document.querySelector("#dle-content > div:nth-child(4)").innerText.match(/Aucune fiches trouvées/gi)||document.querySelectorAll(".cover_global").length==0 ) && location.href.search(/series/gi)>-1){
    window.open(location.href.replace(/series&search/gi,"mangas&search"), "_self");
   }else if( ( document.querySelector("#dle-content > div:nth-child(4)").innerText.match(/Aucune fiches trouvé/gi)||document.querySelectorAll(".cover_global").length==0 ) && location.href.search(/mangas/gi)>-1){
    window.open(location.href.replace(/mangas&search/gi,"autres-videos&search"), "_self");
   }else if( ( document.querySelector("#dle-content > div:nth-child(4)").innerText.match(/Aucune fiches trouvé/gi)||document.querySelectorAll(".cover_global").length==0 ) && location.href.search(/autres-videos/gi)>-1){
    document.title="🤷"+document.title
				document.querySelector(".centersideinn").innerText="🤷❔Pas trouver"
/*document.querySelector("body").innerText="Pas trouver fermeture dans 5 Seconde"
setTimeout(function f(){window.close(document.URL)},5000)*/

   }},3000)
}

function retirerNonConformes(element,tableau,profondeur) {
return new Promise(resolve=>{
var ele =document.querySelector(element)
var text=ele.value
var eleconvertiregex=new RegExp(text,"gi");
var tableaux=document.querySelectorAll(tableau)
for(var j=0;j<tableaux.length;j++){
if((tableaux[j].innerText.search(eleconvertiregex))>-1){
}else{
var s=tableaux[j];
for(var i=0;i<profondeur;i++){
s=s.parentNode;
}
s.parentNode.removeChild(s);
}}
resolve();
});
}

function function2(){
var elem4=document.querySelectorAll("#dle-content > div.cover_global:nth-child(n+5)")
if(elem4.length===1){document.querySelector("#dle-content > div.cover_global:nth-child(5) a").click()
}
}

if(location.href.search(/zone-telechargement.+((serie|manga)&id=|search=)/gi)>-1){
//removeLessImportant:
  var arr = document.querySelectorAll("#dle-content > div:nth-child(n+5) > div:nth-child(4) > div > div > span > span > b");
  let best;
  for (let i = 0; i < arr.length; i++) {
   if (arr[i].textContent.includes("4K")) {
    best = arr[i];
    break;
   } else if (arr[i].textContent.includes("(VF HD)")) {
    if (!best || best.textContent.includes("(VF)")) {
     best = arr[i];
    }
   } else if (arr[i].textContent.includes("(VF)")) {
    if (!best) {
     best = arr[i];
    }
   }
  }
  for (let i = 0; i < arr.length; i++) {
   if (arr[i] !== best) {
    var s=arr[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
    s.parentNode.removeChild(s);
   }}
}

if(location.href.search(/(serie|manga|film)&id/gi)>-1){clickOnElement2("#dle-content > div.base > div > div.corps > div:nth-child(1) > div:nth-child(4)",/vf|720p|HDRIP|BDRIP/gi,"#dle-content > div.base > div > div.corps > div:nth-child(1) > div.otherversions > a > span > span > b",/\(VF HD\)|1080p/gi)}
function clickOnElement2(element1,txt1, element2,txt2) {
if(document.querySelector(element1).innerText.search(txt1)>-1 && document.querySelector(element2).innerText.search(txt2)>-1) {
document.querySelector(element2).click();}
}

}

//if(site(/&search|\?search=|mangas&(page|genre)/gi)){retirer(4,/ VOSTFR |\(VOSTFR HD\)|\(VOSTFR\)|\(Coréen\)|\(Polonais\)|\(Espagnol\)|\(Anglais\)|\(Japonais\)|HDCAM|\(VO\)|^(HDRiP MD|TS( MD)?)$/gi,"span,a,b");}
function retirer(profondeur,filtre,cible){
var ref=filtre;
var cl=document.querySelectorAll(cible);
for(var k=0;k<cl.length;k++){
var match=false;
if(Array.isArray(ref)){
for(var u=0;u<ref.length;u++){
if(cl[k].innerText.match(ref[u])){
match=true;
break;
}}
}else{
match=cl[k].innerText.match(ref);
}
if(match){
var s=cl[k];
for(var i=0;i<profondeur;i++){
s=s.parentNode;}
s.parentNode.removeChild(s);
}}}


const heb = new RegExp(hébergeur, "gi");
if(location.href.search(/.zone-telechargement.+p=(films|ebooks)/gi)>-1){

async function getExternalLinkFromInternalLink() {
  try {
    const internalLinks = document.querySelectorAll("div.cover_infos_title > a");
    const externalLinks = [];

    // Loop through each internal link
    for (const internalLink of internalLinks) {
      const href = internalLink.href;
      let externalLink = null;

      // Ajout du bouton et de l'événement de clic pour ouvrir le lien externe dans un nouvel onglet
      const button = document.createElement('nav');
      button.textContent = '🔗'+hébergeur;
      button.style.position = 'absolute';
      button.style.left = '58%';
      button.style.top = '8%';
      button.style.transform = 'scale(1.25)'
      button.style.opacity = '0.75';
      button.style.cursor = 'pointer';
      button.style.background = '#ffd700';
      button.style.color = '#000';
      button.style.outline = '0.1em solid #000';
      button.style.zIndex = '9999';
      internalLink.parentNode.parentNode.parentNode.appendChild(button);

      button.addEventListener('click', async () => {
        if (!externalLink) {
          const response = await fetch(href);
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération du contenu du lien interne.');
          }

          const textContent = await response.text();
          const elements = new DOMParser().parseFromString(textContent, 'text/html').querySelectorAll("center > div.postinfo > b > div");
          const regex = heb;

          // Loop through elements to find the external link matching the regex
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.innerText.match(regex)) {
              externalLink = element.parentElement.nextElementSibling.firstChild.href;
              break;
            }
          }
        }

        if (externalLink) {
          window.open(externalLink, '_blank');
        } else {
          console.log('Impossible de récupérer le lien externe.');
        }
      });

      externalLinks.push(button);
    }

    return externalLinks; // Returning an array of external link buttons
  } catch (error) {
    console.error('Une erreur est survenue :', error);
    return null;
  }
}

// Appel de la fonction et récupération du tableau de boutons de liens externes
getExternalLinkFromInternalLink()
  .then((externalLinks) => {
    if (externalLinks) {
      console.log('Boutons de liens externes créés :', externalLinks);
    } else {
      console.log('Impossible de récupérer les liens externes.');
    }
  });


}

})
