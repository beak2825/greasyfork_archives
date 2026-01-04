// ==UserScript==
// @name         AILYZE Filter Script
// @namespace    tampermonkey.org
// @version      1.0
// @description  Filter AILYZE website elements
// @match        https://www.ailyze.com/ailyze/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486272/AILYZE%20Filter%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/486272/AILYZE%20Filter%20Script.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Localizar o elemento de upload de arquivo
  var uploadInput = document.querySelector('input[type="file"]');

  // Verificar se o elemento foi encontrado
  if (uploadInput) {
    // Fazer algo com o elemento de upload
    // ...
  }

  // Localizar o elemento select com id "id_analysis_type"
  var analysisTypeSelect = document.querySelector('select#id_analysis_type');

  // Verificar se o elemento foi encontrado
  if (analysisTypeSelect) {
    // Fazer algo com o elemento select
    // ...
  }

  // Localizar o elemento select com id "id_summary_type"
  var summaryTypeSelect = document.querySelector('select#id_summary_type');

  // Verificar se o elemento foi encontrado
  if (summaryTypeSelect) {
    // Fazer algo com o elemento select
    // ...
  }

  // Localizar o elemento de instruções opcionais
  var optionalInstructionsInput = document.querySelector('textarea#id_optional_instructions');

  // Verificar se o elemento foi encontrado
  if (optionalInstructionsInput) {
    // Fazer algo com o elemento de instruções opcionais
    // ...
  }

  // Localizar o elemento select com id "id_language"
  var languageSelect = document.querySelector('select#id_language');

  // Verificar se o elemento foi encontrado
  if (languageSelect) {
    // Fazer algo com o elemento select
    // ...
  }

  // Localizar o elemento select com id "id_response_length"
  var responseLengthSelect = document.querySelector('select#id_response_length');

  // Verificar se o elemento foi encontrado
  if (responseLengthSelect) {
    // Fazer algo com o elemento select
    // ...
  }

  // Localizar o elemento de instruções de resposta desejada
  var responseInstructionsInput = document.querySelector('textarea#id_response_instructions');

  // Verificar se o elemento foi encontrado
  if (responseInstructionsInput) {
    // Fazer algo com o elemento de instruções de resposta desejada
    // ...
  }

  // Outras localizações e tratamentos de erros podem ser adicionados conforme necessário

})();