// ==UserScript==
// @name         Research Project discrimination
// @description  Submits the HIT once you click on a radio button.
// @version      1
// @author       mordea
// @include      https://s3.amazonaws.com/mturk_bulk/*
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @namespace https://greasyfork.org/users/11379
// @downloadURL https://update.greasyfork.org/scripts/20201/Research%20Project%20discrimination.user.js
// @updateURL https://update.greasyfork.org/scripts/20201/Research%20Project%20discrimination.meta.js
// ==/UserScript==

var content = document.body.textContent || document.body.innerText;
var hasText = content.indexOf("This task is to judge whether a sentence mentions a specific type of discrimination")!==-1;
if(hasText){
   setTimeout(function(){
       $('input[type=radio]').on('change', function() {
       $(this).closest("Form").submit();
       });
   });
}