// ==UserScript==
// @name                WME Validator Localization for Brazil Rule disabler
// @name:pt-BR          Desabilitação de regras da Localização para o Brasil do WME Validator
// @version             1.0
// @description         This script disables rules inadvertedly enabled in WME Validator Localization for Brazil. This script reflects a personal view and do not act as campaign for or against any individual.
// @description:pt-br   Este script desabilita regra habilitada inadvertidamente no WME Validator Localization for Brazil. Este script reflete uma visão pessoal e não representa campanha a favor ou contra qualquer pessoa.
// @match               https://editor-beta.waze.com/*editor/*
// @match               https://www.waze.com/*editor/*
// @grant               none
// @run-at              document-start
// @author              biuick84
// @namespace https://greasyfork.org/users/12089
// @downloadURL https://update.greasyfork.org/scripts/14320/WME%20Validator%20Localization%20for%20Brazil%20Rule%20disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/14320/WME%20Validator%20Localization%20for%20Brazil%20Rule%20disabler.meta.js
// ==/UserScript==
//

window.WME_Validator_Brazil["29.enabled"] = false;