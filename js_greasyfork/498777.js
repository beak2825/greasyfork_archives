// ==UserScript==
// @name         Préremplir formulaire avec query parameters
// @namespace    prefill_form.js
// @version      1.3
// @description  Préremplit un formulaire avec des données provenant de query parameters
// @match        https://procuration-front-populaire.fr/proposal*
// @match        https://procuration-front-populaire.fr/request*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498777/Pr%C3%A9remplir%20formulaire%20avec%20query%20parameters.user.js
// @updateURL https://update.greasyfork.org/scripts/498777/Pr%C3%A9remplir%20formulaire%20avec%20query%20parameters.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Fonction pour récupérer les query parameters depuis l'URL
  function getQueryParams() {
    var queryParams = {};
    var queryString = window.location.search.substring(1);
    var pairs = queryString.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      var key = decodeURIComponent(pair[0]);
      var value = decodeURIComponent(pair[1] || "");
      queryParams[key] = decodeURIComponent(value);
    }
    return queryParams;
  }

  // Fonction pour préremplir le formulaire avec les query parameters
  function prefillForm() {
    var queryParams = getQueryParams();

    // Remplir les champs du formulaire avec les données des query parameters
    if (queryParams.user_details_firstNames) {
      document.getElementById("user_details_firstNames").value =
        queryParams.user_details_firstNames;
    }
    if (queryParams.user_details_lastName) {
      document.getElementById("user_details_lastName").value =
        queryParams.user_details_lastName;
    }
    if (queryParams.user_details_email) {
      document.getElementById("user_details_email").value =
        queryParams.user_details_email;
    }
    if (queryParams.user_details_phone) {
      document.getElementById("user_details_phone").value =
        queryParams.user_details_phone;
    }
    if (queryParams.user_details_voterNumber) {
      document.getElementById("user_details_voterNumber").value =
        queryParams.user_details_voterNumber;
    }
    if (queryParams.user_details_birthdate_day) {
      document.getElementById("user_details_birthdate_day").value =
        queryParams.user_details_birthdate_day;
    }
    if (queryParams.user_details_birthdate_month) {
      document.getElementById("user_details_birthdate_month").value =
        queryParams.user_details_birthdate_month;
    }
    if (queryParams.user_details_birthdate_year) {
      document.getElementById("user_details_birthdate_year").value =
        queryParams.user_details_birthdate_year;
    }
    if (queryParams.user_details_electoralListCityName) {
      document.getElementById("user_details_electoralListCityName").value =
        queryParams.user_details_electoralListCityName;
    }
    if (queryParams.user_details_electoralListCityDepartment) {
      document.getElementById(
        "user_details_electoralListCityDepartment"
      ).value = queryParams.user_details_electoralListCityDepartment;
    }
    if (queryParams.user_details_votePlace) {
      document.getElementById("user_details_votePlace").value =
        queryParams.user_details_votePlace;
    }
    if (queryParams.user_details_address) {
      document.getElementById("user_details_address").value =
        queryParams.user_details_address;
    }
    if (queryParams.user_details_electionsDates_0) {
      document.getElementById("user_details_electionsDates_0").checked = false;
    }
    if (queryParams.user_details_electionsDates_1) {
      document.getElementById("user_details_electionsDates_1").checked = true;
    }
    if (queryParams.user_details_comment || queryParams.contact) {
      document.getElementById("user_details_comment").value =
        (queryParams.contact || "") +
        (queryParams.user_details_comment
          ? "\n " + queryParams.user_details_comment
          : "");
    }

    // Si nécessaire, simuler un clic sur le bouton de soumission
    // document.getElementById('boutonSoumettre').click();
  }

  // Appel de la fonction pour préremplir le formulaire lors du chargement de la page
  window.onload = prefillForm;
})();
