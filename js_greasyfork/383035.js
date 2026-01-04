// ==UserScript==
// @name         CSW-Expand-tag-abbreviations
// @namespace    local crowdsurfwork
// @version      0.3
// @description  Expand tag abbreviations, aaa => [APPLAUSE], etc
// @include      https://ops.cielo24.com/mediatool/transcription/jobs/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383035/CSW-Expand-tag-abbreviations.user.js
// @updateURL https://update.greasyfork.org/scripts/383035/CSW-Expand-tag-abbreviations.meta.js
// ==/UserScript==

(function()
 {
     'use strict';

     let initialized = false;

     let tag_expansions = {
         aaa: '[APPLAUSE] ',
         bbb: '[BLANK_AUDIO] ',
         ccc: '[COUGH] ',
         fff: '[FOREIGN] ',
         iii: '[INAUDIBLE] ',
         lll: '[LAUGH] ',
         mmm: '[MUSIC] ',
         nnn: '[NOISE] ',
         sss: '[SOUND] ',
         ttt: '[CROSSTALK] ',
         uuu: '[UNKNOWN] ',
         xxx: '[BLEEP] ',
     };


     let expansion_length = 0;

     function expand_tags(match, offset, string)
     {
         let expansion = tag_expansions[match];
         if (expansion)
         {
             expansion_length = expansion.length;
             return expansion;
         }

         return match;
     }

     function tag_expander(pte)
     {
         let cursor_pos = pte.selectionStart;
         let new_value = pte.value.replace(/\b\w\w\w\b/g, expand_tags);
         if (new_value != pte.value)
         {
             pte.value = new_value;
             pte.selectionStart = cursor_pos + expansion_length - 3;
             pte.selectionEnd = cursor_pos + expansion_length - 3;
         }
     }

     function install_tag_expander()
     {
         let pte = document.getElementById('plaintext_edit');
         if (!pte) return false;

         pte.addEventListener(
             'input',
             () => tag_expander(pte)
         );

         //console.log('installed tag_expander');
         return true;
     }

     function script_init()
     {
         if (initialized) return true;

         try
         {
             initialized = install_tag_expander();
         }
         catch (exception)
         {
         }

         return initialized;
     }

     if (!script_init())
     {
         document.addEventListener('readystatechange', (event) => script_init());
     }
 })();
