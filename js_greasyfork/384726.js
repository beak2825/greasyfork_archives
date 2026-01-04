// ==UserScript==
// @name     Qualig cesi
// @description Rempli et envoi automatiquement les fiches de qualig
// @version  1.0.1
// @match    https://qualigonline.cesi.fr/*
// @grant    none
// @namespace https://greasyfork.org/users/297795
// @downloadURL https://update.greasyfork.org/scripts/384726/Qualig%20cesi.user.js
// @updateURL https://update.greasyfork.org/scripts/384726/Qualig%20cesi.meta.js
// ==/UserScript==

window.onload = function() {
    'use strict';
  
      for (let i=1; i<10; i++) {
      try {
          document.getElementById('99Choix' + i).checked = true
      } catch {
      }
    }
  
    let array = ['ListValeurRubriqueEvaluation_3__CommentaireRubrique',
              'ListValeurRubriqueEvaluation_7__CommentaireRubrique',
              'ListValeurRubriqueEvaluation_9__CommentaireRubrique',
              'ListValeurRubriqueEvaluation_10__CommentaireRubrique',
              'ListValeurRubriqueEvaluation_11__CommentaireRubrique']
    
    array.forEach((e) => {
      document.getElementById(e).value = "Bib Boup! I'm a bot!"
    })
    
    document.getElementById('Submit1').click()
}