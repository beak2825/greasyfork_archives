// ==UserScript==
// @name         8.ButtonsReparations
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  ForceHiddenClick
// @author       MeGa
// @match        https://algeria.blsspainglobal.com/DZA/blsAppointment/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blsspainglobal.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477626/8ButtonsReparations.user.js
// @updateURL https://update.greasyfork.org/scripts/477626/8ButtonsReparations.meta.js
// ==/UserScript==


var NbrButton=12;//Buttons

var TimeBetweenSkip=3;//sec

/*Remove Ex Buttons*/
// Crée un conteneur div pour les boutons
var buttonContainer = document.createElement('div');
buttonContainer.style.position = 'fixed';
buttonContainer.style.top = '50%'; // Centre verticalement au milieu de l'écran
buttonContainer.style.transform = 'translateY(-50%)'; // Pour centrer correctement
buttonContainer.style.display = 'flex';
buttonContainer.style.opacity = "0.7";
buttonContainer.style.flexDirection = 'column';
buttonContainer.style.alignItems = 'center';

// Définissez manuellement les noms des boutons
var buttonNames = ["Submit", "I agree", "SubmiteFormulaire", "SkipAll", "RemoveReload", "Skip3", "Skip4", "Skip5", "VerifyApplicant", "Selfie", "payConfirm", "ShowPublicCaptcha"];

// Définissez manuellement les fonctions pour chaque bouton
var buttonFunctions = [
  function() {
      $('#btnSubmit').click()
    console.log("Submited");
  },
  function() {
     $('#termsDiv > div.card-body > div > div.mt-4 > button.btn.btn-success.ml-4.p-2').click()
    console.log("Agreed");
  },
  function() {
   // Sélectionnez tous les éléments de la page
const elements = document.querySelectorAll('*');

// Parcourez tous les éléments
elements.forEach(element => {
  // Vérifiez si l'élément a un attribut "onclick" avec la valeur spécifique
  const onclickAttributeValue = element.getAttribute('onclick');
  if (onclickAttributeValue && onclickAttributeValue.includes('return OnApplicationSubmit(event)')) {
    // Si l'attribut onclick contient la valeur recherchée, affichez l'élément dans la console
    element.click();
  }
});

   console.log("Formulaire Submited");
  },
     function() {
  for (let i = 1; i <= 9; i++) {
    setTimeout(function() {
      clickElementWithIndex(i);
      console.log("Skiped" + i);
    }, TimeBetweenSkip * i * 1000);
  }
  },
     function() {
   document.getElementById('ReloadCallandar').remove();;
     console.log("buttonreload removed");
  },
     function() {
   clickElementWithIndex(3);
     console.log("Skiped3");
  },
     function() {
   clickElementWithIndex(4);
     console.log("Skiped4");
  },
     function() {
   clickElementWithIndex(5);
     console.log("Skiped5");
  },
     function() {
   $('#btnVerifyApplicant').click()
     console.log("Verify Applicant");
  },
     function() {
   document.getElementById("Selfie").click();
     console.log("Selfie");
  },
     function() {
var payConfirm = document.getElementById("payConfirm");
payConfirm.removeAttribute("disabled");
payConfirm.click();
     console.log("Pay confirme clicked");
  },
     function() {
         /*Provisoir selection date & time & send email verification code*/
                         var appointmentCategoryElement = $('[id^="AppointmentDate"]:visible');
var appointmentTimeCategoryElement = $('#AppointmentSlot' +(appointmentCategoryElement[0].id.replace(/\D/g, '')));
         if(/*appointmentTimeCategoryElement.val()==''*/true){appointmentCategoryElement.val('2023-10-18'); appointmentTimeCategoryElement.val('08:00-08:30');}
   $('#btnVerifyAppointment').show();
   $('#btnVerifyAppointment').click();
     console.log("Show PublicCaptcha");
  }
];

// Crée 10 boutons avec les noms et fonctions définis et les ajoute au conteneur
for (var i = 0; i < NbrButton; i++) {
  var button = document.createElement('button');
  var buttonName = buttonNames[i]; // Utilisez le nom défini
  var buttonFunction = buttonFunctions[i]; // Utilisez la fonction définie

  button.textContent = buttonName;
  button.style.margin = '5px';
  button.style.padding = '8px';
  button.style.border = 'none';
  button.style.backgroundColor = 'rgb(125, 93, 28)';
  button.style.color = 'white';
  button.style.cursor = 'pointer';
  button.style.borderRadius = '5px';

  // Attribution de la fonction personnalisée au clic du bouton
  button.addEventListener('click', buttonFunction);

  // Ajoute le bouton au conteneur
  buttonContainer.appendChild(button);
}

// Ajoute le conteneur au corps du document
document.body.appendChild(buttonContainer);

/*Skip Function Declaration*/
function clickElementWithIndex(index) {
  const elements = document.querySelectorAll('.btn.btn-default');
  elements.forEach(element => {
    const onclickAttributeValue = element.getAttribute('onclick');
    if (onclickAttributeValue && (onclickAttributeValue.indexOf("OnVasSkip") !==-1) && (onclickAttributeValue.indexOf(",'"+index+"'") !==-1)) {
      console.log(element);
      element.click();
    }
  });
};





