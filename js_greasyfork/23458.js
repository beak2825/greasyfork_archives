// sodexo.user.js
// version 0.1
// 2016-09-23
// Copyright (c) 2016, Alexandre Pinheiro
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
// --------------------------------------------------------------------
// ==UserScript==

// @version         1
// @name            Sodexo Preenchimento Automatico Cartão
// @author          Alexandre Pinheiro <alexandrehostand(at)gmail.com>
// @namespace       http://tampermonkey.net/
// @description     Preenche o número do cartão e o CPF na tela de login dos dados do Sodexo
//
// @include     	http://*sodexosaldocartao.com.br*/*
// @include         https://*sodexosaldocartao.com.br*/*

// @downloadURL https://update.greasyfork.org/scripts/23458/Sodexo%20Preenchimento%20Automatico%20Cart%C3%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/23458/Sodexo%20Preenchimento%20Automatico%20Cart%C3%A3o.meta.js
// ==/UserScript==
function fPreenche() {
   // Inserir os dados do cartão Sodexo e seu CPF
   var NUMCARD = '' , CPF   = '';

   try { 
      var inputs = document.getElementsByTagName('input') ;
      for (var i = 0; i < inputs.length ; i++) {
         if (inputs[i].name == 'cardNumber')    { inputs[i].value = NUMCARD ; }
         if (inputs[i].name == 'cpf')    { inputs[i].value = CPF   ; }
      }
   
   } catch (err) { 
      GM_log('fPreenche - Ocorreu um erro...' + err.description, 2) ;
   } 
}

(function() {
   try {      
      window.addEventListener('load', 
                              function() { fPreenche() ;} ,
                              true ) ;
   } catch(err) {
      GM_log('Ocorreu um erro...' + err.description, 2) ;
   }
})();