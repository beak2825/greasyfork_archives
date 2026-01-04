// ==UserScript==
// @name         Pochta form 22
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  autocomplete recipient information 
// @author       Polyakov Andrey (andrey@polyakov.im)
// @match        https://www.pochta.ru/tracking
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39477/Pochta%20form%2022.user.js
// @updateURL https://update.greasyfork.org/scripts/39477/Pochta%20form%2022.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //
  var newRecipientInfo = {
    Recipient: '', // ФИО или наименование организации
    RecipientAddress: '', // Адрес (населенный пункт, улица, дом, квартира)
    RecipientIndex: '', // Индекс
    RecipientDocumentIssueDate: '', // Когда выдан
    RecipientDocumentIssuer: '', // Кем выдан
    RecipientDocumentNumber: '', // Номер
    RecipientDocumentSerie: '', // Серия
    RecipientDocumentType: 'Паспорт РФ', // Тип документа
    RecipientRegistrationAddress: '' // Адрес регистрации (не заполняется, если совпадает с адресом получателя)
  };

  var objToParams = function(obj) {
    var str = "";
    for (var key in obj) {
      if (str !== "") {
        str += "&";
      }
      str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str;
  };


  window.onload = function() {
    if (window.jQuery) {
      // jQuery is loaded
      jQuery('body').on('click', 'a', function(e) {
        var el = $(this);
        var href = $(this).attr('href');
        var params = JSON.parse('{"' + decodeURI(href).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        e.preventDefault();
        if (href.match(/^\/form\?type=F22/) && !href.match(/RecipientAddress/)) {
          var updatedParams = Object.assign(params, newRecipientInfo);
          window.open(objToParams(updatedParams), '_blank');
        }
      });
    } else {
      // jQuery is not loaded
      alert("Jquery не подргрузился, скорее всего сайт лежит");
    }
  };
})();
