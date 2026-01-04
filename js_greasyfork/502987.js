// ==UserScript==
// @name         Statut && Notifs
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Script d'implémentation d'alertes sonores pour permettre un afk
// @author       Nero
// @match        https://www.dreadcast.net/Main
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dreadcast.net
// @grant        none
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/502987/Statut%20%20Notifs.user.js
// @updateURL https://update.greasyfork.org/scripts/502987/Statut%20%20Notifs.meta.js
// ==/UserScript==

const notif = new Audio('https://universal-soundbank.com/sounds/1021.mp3');
const fulln = new Audio('https://universal-soundbank.com/sounds/2784.mp3');
const cmbt = new Audio('https://universal-soundbank.com/sounds/2333.mp3');
const lowlife = new Audio('https://lasonotheque.org/UPLOAD/wav/1930.wav');

let statut = "";
let critical = false;
let alreadyRing = false;

function check(){
   let t = document.getElementsByClassName("action inlineBlock");
   let stats = checkHealth();
   if(stats[0]>20){critical = false;}// Ajuster la variable de contrôle si au dessus de 20%

   // Contrôle de l'action en cours || Usage de alreadyRing pour éviter de faire sonner à répétition
   if (t[0].textContent.includes("Vous êtes en train de vous reposer")){
      if(statut != "zzz"){
          alreadyRing = false;
      }
      if(stats[1] == 100 && alreadyRing == false){
          fulln.play();
          alreadyRing = true;
      }
      statut = "zzz";
   }
   else if (t[0].textContent.includes("Vous vous cachez")){
       if(statut != "niark"){
          alreadyRing = false;
      }
       if (stats[1] < 10){
           notif.play();
           alreadyRing = true;
       }
       statut = "niark";
   }
   else if (t[0].textContent.includes("Vous récoltez")){
       if(statut != "farm"){
          alreadyRing = false;
      }
       if (stats[1] < 10){
           notif.play();
           alreadyRing = true;
       }
       statut = "farm";
   }
   else if (t[0].textContent.includes("Vous scrutez les environs")){
       if(statut != "eye"){
          alreadyRing = false;
      }
      if (stats[1] < 10){
          notif.play();
          alreadyRing = true;
      }
      statut = "eye";
   }
    else if (t[0].textContent.includes("Vous travaillez")){
       if(statut != "work"){
          alreadyRing = false;
      }
       if (stats[1] < 10){
           notif.play();
           alreadyRing = true;
       }
       statut = "work";
   }
   else if (t[0].textContent.includes("Vous êtes en train de fouiller la zone")){
       if(statut != "fouille"){
          openBag();
          alreadyRing = false;
       }
       if (stats[1] < 10){
           notif.play();
           alreadyRing = true;
       }
       let neuvos = getNeuvos();
       neuvos.forEach((element)=>{
           if(element.content == "2000" && element.extract_ok() && element.statut=="activé"){// On notifie et on extraie le batonnet
               fulln.play();
               for(let i=0;i<3;i++){
                   element.action.click();
               }
           }
           else if(element.content == "2000" && !element.extract_ok() && element.statut=="activé"){// On notifie et on éteint le neuvopack
               fulln.play();
               element.action.click();
           }
       });
       statut = "fouille";
       // Déclencher l'alerte neuvopack plein
   }
   else if(t[0].textContent.includes("Vous vous battez")){
      if (statut != "fight"){
          cmbt.play();
          statut = "fight";
      }
       // Déclencher l'alerte lowlife
      if(statut[0]<20 && critical==false){
          lowlife.play();
          setTimeout(()=>{lowlife.pause();lowlife.load('https://lasonotheque.org/UPLOAD/wav/1930.wav');},3000);
          critical = true; // Passer critical en true, ne se redéclenchera pas avant que le personnage ait redépassé les 20% et revienne en dessous
      }
   }
   else if(t[0].textContent.includes("Vous ne faites rien de particulier")){
      statut = ""
   }
   else{ // Catégorie other => Réparation/Soin/DestructionMeubles
       statut = "other"
   }
};

function click(x){
    x.click();
}

function checkHealth(){ // Absorption et renvoi des pv et pf
    let stats = document.getElementsByClassName("bigInfo");
    let h = stats[0].childNodes
    let hact = h[0].textContent;
    let hmax = h[2].textContent;
    let f = stats[1].childNodes
    let fact = f[0].textContent;
    let fmax = f[2].textContent;
    return [hact.toInt()/hmax.toInt()*100,fact.toInt()/fmax.toInt()*100]
}

function openBag(){ // Ouverture des trois containers !!! Indispensable pour le check up des objets
   for(let i = 7;i<10;i++){
       let actif = false;
       let path = ".zone_case"+i.toString();
       let test = document.querySelector(path);
       let t1 = test.childNodes[1].childNodes;
       for(let attr in t1[1].classList){
           if(attr == "active"){
               actif = true;
           }
       }
       if(actif == true){
           continue;
       }
       let t2 = t1[1].childNodes[7];
       t2.click();
   }

}

class Neuvopack{
   id;
   etat;
   statut;
   content;
   action;

   constructor(content){// Retravailler l'extraction d'infos sur le neuvopack => Passer par un accès héritage plutôt que de la sélection imprécise
      let act = content.parentNode.parentNode.parentNode.childNodes;
      act.forEach((element)=>{
          if(element.localName === "img"){
              this.action = element;
          }
      });
      content = content.childNodes;
      this.id = content[21].textContent;
      this.etat = content[9].childNodes[1].textContent;
      if(content[5].childNodes[1].className.includes("hidden")){
          this.statut = content[5].childNodes[3].textContent
      }
      else if(content[5].childNodes[3].className.includes("hidden")){
          this.statut = content[5].childNodes[1].textContent
      }

      this.content = content[11].childNodes[1].textContent;

   }

   extract_ok(){
       if(parseInt(this.etat) === 1){
           return false
       }
       return true
   }
}

function getNeuvos(){
   let boxes = document.querySelectorAll(".infoBox_content");
   let neuvo = [];
   boxes.forEach((element)=>{
     let n = element.childNodes[1];
     if(n.childNodes[3].textContent == "Neuvopack." || n.childNodes[3].textContent == "Neuvopack"){
        neuvo.push(new Neuvopack(n));
     }
   });
   return neuvo;
}

setTimeout(15000); // Délai d'attente pour le chargement des fonctionnalités de DC
setInterval(check,3000); // Initialisation de la routine d'inspection
