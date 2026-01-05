// ==UserScript==
// @name        NET PNB
// @namespace   ANAND KUMAR
// @include     https://netbanking.netpnb.com/*
// @version     1
// @description autopnb
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20238/NET%20PNB.user.js
// @updateURL https://update.greasyfork.org/scripts/20238/NET%20PNB.meta.js
// ==/UserScript==
if(document.URL.match('netbanking.netpnb.com/corp/ShoppingMallPaymentController')){window.location.assign('https://netbanking.netpnb.com/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=024&AuthenticationFG.USER_TYPE=1&AuthenticationFG.MENU_ID=CIMSHP&AuthenticationFG.CALL_MODE=2&CATEGORY_ID=400&RU=SapEEj%2BjMnHq0uIMlM2eqvJQs%2F3eKdXHUFiV3oU5rAaVA0a1cPUGPETaETj636P8&QS=%2F5B7Y7PPjoOYiT55Eir1ZFRdDMnTSVq8m4XmlZ6SV2P%2FkHtjs8%2BOg5iJPnkSKvVkbztDh6CT9b0CP%2FN3yRhomu0lzcfEZy2S4Xsq%2BZK4PdsffigHwYMDOh8D9LBv1Ws7%0D%0AreGpo1AvydnNxfOpDt4lVpd%2FsqjifRT92otY%2BOO7Dfv6JomN3wSKY0FdUcp0EcSQoxrU2DfUgOUqR5oMJqHS62ed%2F61bfOPDSbAJU1gTzN8%3D')}
if(document.getElementById('Image11838210')){
document.getElementById('AuthenticationFG.ACCESS_CODE').value="";//username
// sub();
}
document.getElementById('AuthenticationFG.USER_PRINCIPAL').value="";//password
document.getElementById("STU_VALIDATE_CREDENTIALS").click();
function sub()
{document.getElementById("VALIDATE_STU_CREDENTIALS1").click();}