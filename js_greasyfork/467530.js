// ==UserScript==
// @name         CheckCibCard
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  CheckCibCardFromMobilisWebsiteWithCaptchaSolver
// @author       MeGa
// @match        https://acs.satim.dz/*
// @match        https://epay.poste.dz/*
// @match        https://epay.poste.dz/payment*
// @match        https://e-paiement.mobilis.dz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poste.dz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467530/CheckCibCard.user.js
// @updateURL https://update.greasyfork.org/scripts/467530/CheckCibCard.meta.js
// ==/UserScript==
   /* respecte the following Orde r*/
/*                  f_name l_name/cardNumber/Cvv/EXpDate(** /20**)/numberPhone                  */
var url=window.location.href;
var Acceuil=url.indexOf("accueil"),
    Form=url.indexOf("form"),
    Payment=url.indexOf("payment");




/************************************************ Acceuil****************************************************/
if(Acceuil !== -1)
{//alert('');
/*NumberPhone*/
   setTimeout(function(){document.getElementById('msisdn').value="0675924004";},1000);
/*SolveCaptcha*/
/*****
var myImage = document.querySelector("#captcha");

Tesseract.recognize(myImage).then(function(result) {

    console.log(result.text);
    if (result.text.indexOf('\n') !== -1) {
        document.getElementById("code_captha").value=(result.text.substring(0, result.text.indexOf('\n')));
    } else {
        document.getElementById("code_captha").value=(result.text);
    };

});
*****/

    /*Continue when captcha solved*/
    document.querySelector("#code_captha").select();
document.getElementById("code_captha").value='';var Continue=setInterval(function () {if(document.getElementById("code_captha").value.length == 5){document.querySelector("#btnenvoyer").click();clearInterval(Continue);}
    },1000);

};
/*Reload if captcha rated*/
setInterval(function(){window.location.reload();},31*1000)
/************************************************ Form****************************************************/
if(Form !== -1)
{
    var Back=setInterval(function () {if((document.body.outerHTML.indexOf("Le code que vous avez introduit est incorrect")|| (document.body.outerHTML.indexOf("Le numéro de téléphone que vous") !== -1)) !== -1){window.location.href="https://e-paiement.mobilis.dz/accueil";clearInterval(Back);}
    },1000);
    /*Accept the condition*/
    document.getElementById('conditions_generales').click();
 /*Select 100 da*/
var centDinars=setInterval(function () {if(document.querySelector("#Button1")!== null){document.querySelector("#Button1").click();clearInterval(centDinars);}
    },1000);
    /*Choose dahabia*/
    setTimeout(function(){document.querySelector("#bntnenvoyer2 > img").click();},1000);

}
/************************************************ Payment****************************************************/
if(Payment !== -1)
{
    document.querySelector("#paymentDataTable > tbody > tr:nth-child(3)").hidden = true;
    document.querySelector("#paymentDataTable > tbody > tr:nth-child(4)").hidden = true;
    document.querySelector("#paymentDataTable > tbody > tr:nth-child(6)").hidden = true;
    document.querySelector("#paymentDataTable > tbody > tr:nth-child(5) > td.form_label1 > span").outerText="CIB"
    document.querySelector("#iTEXT").style.backgroundColor = "#B0E0E6";
 document.querySelector("#iTEXT").placeholder="Veuillez coller les coordonées de la carte ICI";
document.getElementById('iCVC').type="text";
var waiterForCibInfo= setInterval(function(){
if(document.querySelector("#iTEXT").value.indexOf('/')!== -1
  ) {
    var XXX=document.querySelector("#iTEXT").value;
    var firstSlach=XXX.indexOf("/");
    var Name=XXX.substring("0", firstSlach);
    var Rest=XXX.substring(firstSlach);
    var code=XXX.substring(firstSlach+1, firstSlach+17);
    var Rest2=XXX.substring(firstSlach+18);
    var CVV= Rest2.substring("0", "3");
    var Rest3= Rest2.substring("4");
    var Month= Rest3.substring("0", "2");
    var Year= Rest3.substring("3", "7");
    document.querySelector("#iPAN").value=code;
    document.querySelector("#month").value=Month;
    document.querySelector("#year").value=Year;
    document.querySelector("#iTEXT").value=Name;
    document.querySelector("#iCVC").value=CVV;
    alert("Cliquez sur l'une des touches directionnelles ◄ ► ↕");
    document.querySelector("#iTEXT").select();
    document.querySelector("#iTEXT").focus();
    document.querySelector("#buttonPayment").click();
    setInterval(function(){document.querySelector("#buttonPayment").click()},3000);
    clearInterval(waiterForCibInfo);
}
},1000);
   
};
/*********************************************************************Reparation**********************************************************/
/*Return to acceuil when Le code que vous avez introduit est incorrect*/
var Back2=setInterval(function () {
    if((document.body.outerHTML.indexOf("Le code que vous avez introduit est incorrect") || (document.body.outerHTML.indexOf("Le numéro de téléphone que vous") !== -1)) !== -1)
    {window.location.href="https://e-paiement.mobilis.dz/accueil";clearInterval(Back2);}
    },1000);
 /*ButtonAcceuil*/
let BtnToAcceuil = document.createElement("Score");
BtnToAcceuil.innerHTML = 'Acceuil Mobilis';
BtnToAcceuil.setAttribute('id', 'Time');
BtnToAcceuil.style.cursor = "pointer";
BtnToAcceuil.setAttribute("title", 'Click too see go to acceuil ');
BtnToAcceuil.style.position = 'absolute';
BtnToAcceuil.style.width = (BtnToAcceuil.innerHTML.length * 15) + 'px'; // setting the width to 200px
BtnToAcceuil.style.height = '35px'; // setting the height to 200px
BtnToAcceuil.style.left = '0px';
BtnToAcceuil.style.top = '110px';
BtnToAcceuil.style.background = '#696969'; // setting the background color to teal
BtnToAcceuil.style.borderRadius = '25px';
BtnToAcceuil.style.border = '3px solid lightblue';
BtnToAcceuil.style.color = 'black'; // setting the color to white
BtnToAcceuil.style.fontSize = '25px'; // setting the font size to 20px
BtnToAcceuil.style.fontWeight = "bold";
BtnToAcceuil.style.textAlign = ('center');
BtnToAcceuil.style.verticalAlign = "bottom";
BtnToAcceuil.onclick = function() {window.location.href="https://e-paiement.mobilis.dz/accueil"
	BtnToAcceuil.style.background = '#7CFC00';
};
document.body.appendChild(BtnToAcceuil);

/*Window confirme*/
window.confirm=function() {};

/*Animation*/
    // Création de l'élément de phrase
const phraseElement = document.createElement('div');
phraseElement.style.position = 'fixed';
phraseElement.style.top = '50%';
phraseElement.style.left = '50%';
phraseElement.style.zIndex = "3000";
phraseElement.style.transformStyle = 'preserve-3d';
phraseElement.style.transform = 'translate(-50%, -50%)';
phraseElement.style.fontSize = '47px';
phraseElement.style.color = '#FF8C00';
const textes = ["Vous perdez votre temps a faire des taches répététives ?", "STIRED Vous offre la solution", "STIRED est une entreprise spécialisée dans l'automatisation des taches , Notament l'automatisation des WebSites et le WEB scrapping ."];
let currentIndex = 0;
phraseElement.textContent = textes[currentIndex];

// Ajout de l'élément de phrase au corps de la page
document.body.appendChild(phraseElement);
/**/
// Fonction pour faire disparaître le texte actuel
function disparition() {
  phraseElement.style.opacity = '0';
}

// Fonction pour faire apparaître le texte suivant
function apparition() {
  currentIndex = (currentIndex + 1) % textes.length;
  phraseElement.textContent = textes[currentIndex];
  phraseElement.style.opacity = '1';
}

// Fonction d'animation
function animate() {
  // Faire disparaître le texte actuel après 2 secondes
  setTimeout(disparition, 5000);

  // Faire apparaître le texte suivant après 2.5 secondes
  setTimeout(apparition, 5500);

  // Demander une nouvelle animation
  setTimeout(animate, 7000);
}

// Lancer l'animation
animate();
// Fonction d'animation
function animate2() {
  // Calcul de la rotation en fonction du temps
  const time = Date.now() * 0.0005;
  const xRotation = Math.sin(time) * 0.5;
  const yRotation = Math.cos(time) * 0.5;

  // Appliquer la rotation à l'élément de phrase
  phraseElement.style.transform = `translate(-50%, -50%) rotateX(${xRotation}rad) rotateY(${yRotation}rad)`;

  // Demander une nouvelle animation
  requestAnimationFrame(animate2);
}

// Lancer l'animation
animate2();



// ==UserScript==
// @name         MOBILISCAPTCHASolver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://e-paiement.mobilis.dz/accueil
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v1.0.14/dist/tesseract.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mobilis.dz
// @grant        none
// ==/UserScript==

var myImage = document.querySelector("#captcha");

Tesseract.recognize(myImage).then(function(result) {

    console.log(result.text);
    if (result.text.indexOf('\n') !== -1) {
        document.getElementById("code_captha").value=(result.text.substring(0, result.text.indexOf('\n'))).replaceAll(' ', '');
    } else {
        document.getElementById("code_captha").value=(result.text).replaceAll(' ', '');
    };

});