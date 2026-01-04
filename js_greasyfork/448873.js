// ==UserScript==
// @name         Missions test
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Essai de missions Shinos
// @author       Tanguy ce bg
// @match        *://*.shinobi.fr/*
// @icon         https://i.imgur.com/9nq6Rpp.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448873/Missions%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/448873/Missions%20test.meta.js
// ==/UserScript==

/////////////////////////////////////////////////////////////////////////////////////
//Hello à toi qui t'aventure dans ce code. Avant de continuer, je tiens à préciser//
//que celui-ci a été écrit par quelqu'un qui n'a aucune notion de JS. Non vraiment.//
//Ce code ci est mon tout premier. Pas même un hello world avant.//
//Bref, si toi qui va lire les lignes qui suivent sait déjà coder correctement, s'il te plaît ne me juge pas trop//
// Cheers, Tanguy//
////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////
////Ce code rajoute des missions au jeu Shinobi.fr////
/////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////
/////////////////////// ONGLET MISSIONS EN BAS A GAUCHE ////////////////////////
///////////////////////////////////////////////////////////////////////////////


let mission = document.getElementById('blocMission'),
    menu_mission = document.querySelector("#page > fieldset"),

    ext = document.createElement("fieldset"),
    ext_menu_mission = document.createElement("fieldset"),

    li1 = document.createElement("li"),
    li_menu_mission = document.createElement("li"),

    a1 = document.createElement("a"),
    a1_menu_mission = document.createElement("a");


if (mission === null) { return; }

  ext.className = "s-ext center";
  ext.innerHTML = `<legend>Mission++</legend>
<ul id="shino-ext">
`
  mission.parentNode.insertBefore(ext, mission.nextSibling);
  if(localStorage.getItem("MA1") != "0") {
  a1.innerHTML = `<b>Message Codé</b>`;
  a1.setAttribute('href', "https://www.shinobi.fr/index.php?page=menu-mission");
  li1.appendChild(a1);
  document.getElementById('shino-ext').appendChild(li1);
  }
  else{
        a1.textContent = "Aucune mission en cours";
  a1.setAttribute('href', "javascript:void(0);");
  li1.appendChild(a1);
  document.getElementById('shino-ext').appendChild(li1);
  }

  if(document.URL.indexOf("/index.php?page=menu-mission") >= 0) {
      ext_menu_mission.className = "Menu mission++";
      ext_menu_mission.innerHTML = `<legend>Mission++ en cours</legend>
<ul id="Mission-Actu">
`
      menu_mission.parentNode.insertBefore(ext_menu_mission, menu_mission.nextSibling);
      a1_menu_mission.innerHTML = `<b>Je dois encore coder tout ça</b>`
      li_menu_mission.appendChild(a1_menu_mission)

      document.getElementById("Mission-Actu").appendChild(li_menu_mission)
  }





/////////////////////////////////////////////////////////////////////////////////
///////////////////////////// MISSION RANG A ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

let missionA1 = document.querySelector("#page > fieldset:nth-child(3)"),
extM1 = document.createElement("fieldset"),
liM1 = document.createElement("li"),
button = document.createElement('button'),
MissionNum = 0;
extM1.className = "MissionA1";
extM1.innerHTML = `<legend>Mission 3: Message codé</legend>
<i>Nous venons de recevoir un message de l'un de nos plus vaillants shinobis en pleine mission top secrète. Malheureusement, nous avons perdus toutes formes de communications
avec lui et nos experts n'arrivent pas à le  déchiffrer. Un officier te retrouvera au QG pour te donner toutes les infos. Essaie de déchiffrer le message qu'il nous a laissé et de retrouver le shinobi.</i>
<ul id="MA1">`

if(document.querySelector("#etatmsg > div").innerHTML == 'Voici la liste des missions de rang A .') {

missionA1.parentNode.insertBefore(extM1, missionA1.nextSibling);

button.innerText = "Accepter la mission";
liM1.appendChild(button);
 document.getElementById('MA1').appendChild(liM1); }

let missionA2 = document.querySelector("#page > fieldset.MissionA1"),
extM2 = document.createElement("fieldset"),
liM2 = document.createElement("li"),
buttonM2 = document.createElement('button'),
MissionNumM2 = 0;
extM2.className = "MissionA2";
extM2.innerHTML = `<legend>Mission 4: Examen Examen Shinobi: Seconde épreuve!</legend>
<i>Les shinobis ayant réussis la première épreuve sont conviés à la seconde épreuve!</i>
<ul id="MA2">`

if(document.querySelector("#etatmsg > div").innerHTML == 'Voici la liste des missions de rang A .') {

missionA2.parentNode.insertBefore(extM2, missionA2.nextSibling);

buttonM2.innerText = "Accepter la mission";
liM2.appendChild(buttonM2);
 document.getElementById('MA2').appendChild(liM2); }







///////////////////////////////////////////////////////////////////////////////////
///////////////////////////MISSION A/////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//////////////// MISSION A1: MESSAGE CODE/////////////

let liM11 = document.createElement("list"),
liM12 = document.createElement("list"),

    buttonMA11 = document.createElement("button"),
buttonMA12 = document.createElement("button"),


PNJ = document.querySelector("#page > fieldset.npc"),
    extMA1 = document.createElement("fieldset"),
    liLib = document.createElement("list"),
    buttonMA13 = document.createElement("button");
    extMA1.innerHTML = `<ul id="MissionA13">`

let buttonMA14 = document.createElement("button");




try {
   button.addEventListener("click", () => {localStorage.setItem("MA1", "1"); alert("Vous commencez la mission Message Codé. Rendez-vous dans la salle des récompenses pour obtenir plus d'informations"); document.location.href = 'https://www.shinobi.fr'})
   if(localStorage.getItem("MA1") == "1") {
       if(document.querySelector("#page > fieldset.npc > legend").innerHTML == 'Shinobi haut-gradé') {
           document.querySelector("#page > fieldset.npc > div > div > div.paroles").innerHTML = "Donc c'est à toi qu'on a chargé de retrouver Daimaru? C'est un ami à moi, on a fait l'académie ensemble. Je compte sur toi pour le retrouver rapidement. Il nous a fait parvenir un dernier message, ça nous aidera peut-être à retrouver sa trace. C'est écrit <b> P15L35M7 </b>, tu as une idée de ce que ça veut dire? <b> Pense bien à le noter quelque part, je ne te le rappelerai pas </b>. Je te conseil de passer <b> demander à sa femme qui vit près des bains si elle a une idée. </b>"
           PNJ.parentNode.insertBefore(extMA1, PNJ.nextSibling);
            buttonMA11.innerText = "Accepter et partir interroger sa femme";
            liLib.appendChild(buttonMA11);
            document.getElementById("MissionA13").appendChild(liLib);
           document.querySelector("#page > fieldset.npc > div > div > div.paroles").appendChild(liM11);
           buttonMA11.addEventListener("click", () => { localStorage.setItem("MA1", "2"); alert("Vous partez à la recherche de sa femme"); document.location.href = 'https://www.shinobi.fr'})

       }
   }
    if(localStorage.getItem("MA1") == "2") {
        if(document.querySelector("#blocLieuDescription > fieldset:nth-child(2) > legend").innerHTML == 'Vous êtes aux Bains publics') {
            buttonMA12.innerText = "Interroger la femme de Daimaru";
            liM12.appendChild(buttonMA12);
            document.querySelector("#page > div.game-actions > fieldset > div > ul").appendChild(liM12);

            buttonMA12.addEventListener("click", () => {localStorage.setItem("MA1", "3"); document.querySelector("#etat").innerHTML = `<fieldset class="npc">
<legend>Femme de Daimaru</legend>
<img src="https://i.imgur.com/mHHYqjX.png" width="60" height="74" alt="" border="0" style="float:left">
<div class="bulle_bas">
<div class="bulle_haut">
<div class="paroles_min_height"></div>
<div class="paroles">P15L35M7 ? Non je ne sais vraiment pas ce que cela peut vouloir dire.
Je sais que peu avant de partir en mission il attendait un colis urgent au <b> commerce </b>, tu peux peut-être aller te renseigner auprès des commerçants."
<br><br>
</div>
</div>
</div>
</fieldset>`
                                                       })
        }
    }
    if(localStorage.getItem("MA1") == "3") {
        if(document.querySelector("#page > fieldset.npc > legend").innerHTML == "Libraire") {
            PNJ.parentNode.insertBefore(extMA1, PNJ.nextSibling);
            buttonMA13.innerText = "Interroger le libraire";
            liLib.appendChild(buttonMA13);
            document.getElementById("MissionA13").appendChild(liLib);

            buttonMA13.addEventListener("click", () => {document.querySelector("#page > fieldset.npc > div > div > div.paroles").innerHTML = `Daimaru? Oui, il vient souvent ici! Il attends avec impatience la 3e édition du Yuukan News, c'est son journal favori. Il a envoyé des millier des lettres aux éditeurs pour qu'ils en reprennent l'écriture. Son favori c'était de loin le <b> Yuukan News #1 </b>. Peut-être que le message qu'il t'a laissé est en rapport à ça.`
                                                        localStorage.setItem("MA1", "4")})
                   }
    }
    if(localStorage.getItem("MA1") == "4") {
        if(document.querySelector("#page > fieldset.npc > legend").innerHTML == "Forgeron"){
            PNJ.parentNode.insertBefore(extMA1, PNJ.nextSibling);
            buttonMA14.innerText = "Interroger le forgeron";
            liLib.appendChild(buttonMA14);
            document.getElementById("MissionA13").appendChild(liLib);

            buttonMA14.addEventListener("click", () => {document.querySelector("#page > fieldset.npc > div > div > div.paroles").innerHTML = `T'es un ami de Daimaru? Ouais, c'est mon cousin. Sa couverture est tombée à l'eau pendant la mission et il s'est fait attaquer, il est vachement blessé. Il est venu se terrer chez moi le temps de récupérer et panser ses blessures. Je te le confie pour le ramener au village`
                                                        alert("Félicitations, vous avez retrouvé Daimaru. La mission est finie !")})
        }
    }




}catch{}


///////////MISSION A2: EXAMEN SHINOBI 2ND EPREUVE/////////////////

let buttonMA21 = document.createElement("button"),
    buttonMA22 = document.createElement("button"),
    buttonMA23 = document.createElement('button'),
    buttonMA24 = document.createElement("button"),
    buttonMA25 = document.createElement("button");



try {
   buttonM2.addEventListener("click", () => {localStorage.setItem("MA2", "1"); localStorage.setItem("MA1", "0"); alert("Vous commencez la mission Examen Shinobi. Rendez-vous dans la salle des récompenses pour obtenir plus d'informations"); document.location.href = 'https://www.shinobi.fr'})
   if(localStorage.getItem("MA2") == "1") {
       if(document.querySelector("#page > fieldset.npc > legend").innerHTML == 'Shinobi haut-gradé') {
           document.querySelector("#page > fieldset.npc > div > div > div.paroles").innerHTML = `Les suzerains des différents comtés de yuukan m'ont laissé un mot pour vous. Il semblerait qu'il indique le vrai lieux de début de l'épreuve.Celui-ci lis: <br>
Rivières, forêts et déserts, <br>
Eternellements en guerre. <br>
Siècles de combats on menés sans <br>
Trèves à de nombreuses morts inutiles <br>
Ainsi cet examen a été créé <br>
Unifier les villages, un moment seulement faire table <br>
Rase du passé. Ensemble, compétitionner, pour enfin <br>
Atteindre le rang de Kage. <br>
Nul besoin d'attendre, allez. Partez. <br>
Traversez le monde, vers la 2nd étape de cette épreuvre. <br>`
           PNJ.parentNode.insertBefore(extMA1, PNJ.nextSibling);
            buttonMA21.innerText = "Se mettre en route";
            liLib.appendChild(buttonMA21);
            document.getElementById("MissionA13").appendChild(liLib);
           document.querySelector("#page > fieldset.npc > div > div > div.paroles").appendChild(liM11);
           buttonMA21.addEventListener("click", () => { localStorage.setItem("MA2", "2"); alert("Vous vous dirigez vers le lieu de départ de la seconde épreuve"); document.location.href = 'https://www.shinobi.fr'})


       }
   }
    if(localStorage.getItem("MA2") == "2") {
        if(document.querySelector("#page > fieldset.npc > legend").innerHTML == "Restaurateur") {
            document.querySelector("#page > fieldset.npc > div > div > div.paroles").innerHTML = `Qu'est-ce que je vous sers? Ah, vous êtes là pour l'examen? Dans la salle du fond messieurs dame!... En effet, cette arrière salle est une sorte de hangar gigantesque. On se croirais dans un souterrain n'est-ce pas?
                                                                                                  Qui s'imaginerais que le lieu où sont rassemblés des milliers de candidats à l'examens soit ce petit restaurant ! Patientez un peu, l'examinateur arrivera d'ici quelques instants`
            PNJ.parentNode.insertBefore(extMA1, PNJ.nextSibling);
            buttonMA22.innerText = "Entrer dans la salle et attendre";
            liLib.appendChild(buttonMA22);
            document.getElementById("MissionA13").appendChild(liLib);
            buttonMA22.addEventListener("click", () => { localStorage.setItem("MA2", "3"); alert("Vous entrez dans le hangar et attendez patiemment"); document.location.href = "https://www.shinobi.fr/index.php?page=restaurant"})


        }
    }
    if(localStorage.getItem("MA2") == "3") {
        if(document.querySelector("#page > fieldset.npc > legend").innerHTML == "Restaurateur") {
            document.querySelector("#page > fieldset.npc").innerHTML = `<fieldset class="npc">
<legend>Anko</legend>
<img src="https://i.imgur.com/mHHYqjX.png" width="60" height="74" alt="" border="0" style="float:left">
<div class="bulle_bas">
<div class="bulle_haut">
<div class="paroles_min_height"></div>
<div class="paroles">Le temps de l'acceuil est terminé. Je vois que plus de la moitié d'entre vous n'a déjà pas réussie à trouver ce hangar. Tant pis pour eux, ils retenteront l'année prochaine.
La seconde étape peut maintenant réellement commencer. Celle-ci, comme vous l'avez peut-être deviné, portera sur votre capacité de discernement et de raisonnement.
Une énigme amenant à une autre, chacune offrant la localisation du lieu où vous devez vous rendre. Voici la première: <br>
<b>Un shinobi a acheté un kunai avant-hier, et un hier. Si lundi matin il décide de se lever chaque jours et d'aller acheter chez le marchand
le nombre de Kunai total qu'il a plus le nombre de kunais qu'il a acheté le jour d'avant. Le mardi de la semaine qui vient, après son passage chez le marchand,
il se rend compte qu'il est ruiné et pars chasser du bison pour remplir sa bourse. Il lance 29 kunais mais ne parvient à en attraper aucun.
Combien de Kunais lui reste-t-il? </b> Si vous avez la réponse, allez sur la case indiquée, la suite de l'épreuve vous sera dévoilée.

<br><br>
</div>
</div>
</div>
</fieldset>`
            PNJ.parentNode.insertBefore(extMA1, PNJ.nextSibling);
            buttonMA22.innerText = "Sortir du hangar et se diriger vers le lieu suivant";
            liLib.appendChild(buttonMA22);
            document.getElementById("MissionA13").appendChild(liLib);
            buttonMA22.addEventListener("click", () => { localStorage.setItem("MA2", "4"); alert("Vous sortez du hangar"); document.location.href = "https://www.shinobi.fr"})
        }
    }
    if(localStorage.getItem("MA2") == "4") {
        if(document.querySelector("#blocMondeLieu > legend").innerHTML == "Vous êtes à l'entrée du village Ukabu") {
            document.querySelector("#etatmsg").innerHTML = `Taillé au kunai sur l'un des poteaux du pont, vous parvenez à lire l'inscription <b> Rsxkhrsd cd Snqhjzd </b>. Pensez à le noter, il semblerait qu'un puissant ninjutsu la fera s'éffacer lorsque vous
vous mettrez en route vers votre prochaine destination`
            buttonMA23.innerText = "Se mettre en route";
            liM12.appendChild(buttonMA23);
            document.querySelector("#monde > fieldset.game-actions").appendChild(liM12);
            buttonMA23.addEventListener("click", () => { localStorage.setItem("MA2", "5"); alert("Vous partez vers le prochain lieu d'épreuve"); document.location.href = "https://www.shinobi.fr"})


        }
    }
    if(localStorage.getItem("MA2") == "5") {
        if(document.querySelector("#page > fieldset.npc > div > div > div.paroles").innerHTML == "Bienvenue, je suis le styliste de Torikae. Si vous voulez renouveler votre garde-robe, vous avez trouvé le bon endroit ! L'apparence d'un shinobi est importante. Veuillez la soigner !") {
            document.querySelector("#page > fieldset.npc > div > div > div.paroles").innerHTML = `L'énigme..? Ah oui! Voilà le document qu'on m'a passé! il est écrit: <br>
"Saurez<font style="color:#f9f9f9";> M </font>Vous<font style="color:#f9f9f9";> O </font>Outrepasser<font style="color:#f9f9f9";> U </font>Ce<font style="color:#f9f9f9";> L </font>Puissant<font style="color:#f9f9f9";> I </font>Genjutsu<font style="color:#f9f9f9";> N </font>?" `
            PNJ.parentNode.insertBefore(extMA1, PNJ.nextSibling);
            buttonMA24.innerText = "Être fière d'avoir percé le Genjutsu et partir vers le dernier lieu";
            liLib.appendChild(buttonMA24);
            document.getElementById("MissionA13").appendChild(liLib);
            buttonMA24.addEventListener("click", () => { localStorage.setItem("MA2", "6"); document.location.href = "https://www.shinobi.fr/"})
        }
    }
    if(localStorage.getItem("MA2") == "6") {
        if(document.querySelector("#blocLieuDescription > fieldset:nth-child(2) > legend").innerHTML == "Vous êtes au moulin") {
            document.querySelector("#etat").innerHTML = `<fieldset class="npc">
<legend>Anko</legend>
<img src="https://i.imgur.com/mHHYqjX.png" width="60" height="74" alt="" border="0" style="float:left">
<div class="bulle_bas">
<div class="bulle_haut">
<div class="paroles_min_height"></div>
<div class="paroles">Félicitations c'était la dernière épreuve de ce test! Tu peux rentrer au village pour continuer d'autres missions."
<br><br>
</div>
</div>
</div>
</fieldset>`
            buttonMA25.innerText = "Terminer la mission";
            liM12.appendChild(buttonMA25);
            document.querySelector("#page > div.game-actions > fieldset > div > ul").appendChild(liM12);
            buttonMA25.addEventListener("click", () => { localStorage.setItem("MA2", "0"); alert('Félicitations vous avez fini la mission "Examen Shinobi: Seconde épreuve"'); document.location.href = "https://www.shinobi.fr"})


        }
    }




} catch{}





