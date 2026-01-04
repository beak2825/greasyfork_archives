// ==UserScript==
// @name         Brainly Peak Tool
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds Link to question on branily for PEAK GetFuelED
// @author       Julian Sanchez
// @match        https://learnx-svc.k12.com/learnx-svc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395760/Brainly%20Peak%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/395760/Brainly%20Peak%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
       let elems = ($$('.k12_viewer_live_edit_content_wrapper').length > 0) ?  $$('.k12_viewer_live_edit_content_wrapper') : ($$('.k12_advancedEditor_text').length > 0) ? $$('.k12_advancedEditor_text') :( $$('.k12_adveditor_wrapper').length > 0) ? $$('.k12_adveditor_wrapper'): $$('.lrn_stimulus_content.lrn_clearfix')>0 ? $$('.lrn_stimulus_content.lrn_clearfix'): null
  elems.forEach(x =>   x.onclick = () =>  window.open(`https://brainly.com/app/ask?q=$${x.innerHTML.replace(/<[^>]*>?/gm, '')}`))
    }, 100)
    // Your code here...
})();