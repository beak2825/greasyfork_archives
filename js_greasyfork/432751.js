// ==UserScript==
// @name         luxs
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  bx24 online workers
// @author       You
// @match        https://b24-bcqmkr.bitrix24.ua/crm/deal/details/*
// @require  https://code.jquery.com/jquery-3.4.1.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432751/luxs.user.js
// @updateURL https://update.greasyfork.org/scripts/432751/luxs.meta.js
// ==/UserScript==
  function calc_sum() {
  var   sh=$('[name="UF_CRM_60B253AFE682F"]').val()/100;
                              var  wh=$('[name="UF_CRM_60B253AFED408"]').val()/100;
      var sq=parseFloat(sh*wh).toFixed(2);

      if ($('[name="UF_CRM_60B29880866D1"]').val()==116) {
      $('[name="OPPORTUNITY"]').val(parseFloat(sq*189).toFixed(2));
          $('.ui-ctl-w75').val(parseFloat(sq*189).toFixed(2));
      }
       if ($('[name="UF_CRM_60B29880866D1"]').val()==118) {
      $('[name="OPPORTUNITY"]').val(parseFloat(sq*229).toFixed(2));
          $('.ui-ctl-w75').val(parseFloat(sq*229).toFixed(2));
      }
       if ($('[name="UF_CRM_60B29880866D1"]').val()==120) {
      $('[name="OPPORTUNITY"]').val(parseFloat(sq*279).toFixed(2));
          $('.ui-ctl-w75').val(parseFloat(sq*279).toFixed(2));
      }
         if ($('[name="UF_CRM_60B29880866D1"]').val()==122) {
      $('[name="OPPORTUNITY"]').val(parseFloat(sq*289).toFixed(2));
          $('.ui-ctl-w75').val(parseFloat(sq*289).toFixed(2));
      }
  if ($('[name="UF_CRM_60B29880866D1"]').val()==124) {
      $('[name="OPPORTUNITY"]').val(parseFloat(sq*299).toFixed(2));
          $('.ui-ctl-w75').val(parseFloat(sq*299).toFixed(2));
      }
        if ($('[name="UF_CRM_60B29880866D1"]').val()==126) {
      $('[name="OPPORTUNITY"]').val(parseFloat(sq*299).toFixed(2));
          $('.ui-ctl-w75').val(parseFloat(sq*299).toFixed(2));
      }
       if ($('[name="UF_CRM_60B29880866D1"]').val()==128) {
      $('[name="OPPORTUNITY"]').val(parseFloat(sq*319).toFixed(2));
          $('.ui-ctl-w75').val(parseFloat(sq*319).toFixed(2));
      }
      if ($('[name="UF_CRM_60B29880866D1"]').val()==130) {
      $('[name="OPPORTUNITY"]').val(parseFloat(sq*289).toFixed(2));
          $('.ui-ctl-w75').val(parseFloat(sq*289).toFixed(2));
      }
        if ($('[name="UF_CRM_60B29880866D1"]').val()==132) {
      $('[name="OPPORTUNITY"]').val(parseFloat(sq*239).toFixed(2));
          $('.ui-ctl-w75').val(parseFloat(sq*239).toFixed(2));
      }
  }
(function() {
    'use strict';
  var link = window.document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://luxoboi.com.ua/5.css?v1';
document.getElementsByTagName("HEAD")[0].appendChild(link);
$('body').on('click','.upload-file-name', function(event) {
                    console.log('jj');
                   event.preventDefault();
                     $('.upload-file-name').fancybox();
                    $(".upload-file-name").fancybox().click();
                    event.preventDefault();
                });
     $('body').on('click','.webform-field-upload-icon', function(event) {
                                  console.log('jj');
                                 event.preventDefault();
                                   $('.upload-file-name').fancybox();
                                  $(".upload-file-name").fancybox().click();
                                  event.preventDefault();
                              });
     $('body').on('change','[name="UF_CRM_60B29880866D1"]', function () {
    calc_sum();
 });
      $('body').on('keyup','[name="UF_CRM_60B253AFE682F"], [name="UF_CRM_60B253AFED408"]', function(event) {

                             var   sh=$('[name="UF_CRM_60B253AFE682F"]').val()/100;
                              var  wh=$('[name="UF_CRM_60B253AFED408"]').val()/100;

    $('[name="UF_CRM_1632215512"]').val(parseFloat(sh*wh).toFixed(2));

calc_sum();

                              });

})();

window.onload = function(){ var elem = document.querySelector('.ui-entity-editor-header-edit-lnk');
  // добавим класс к элементу
  elem.click();
var observer = new MutationObserver(function(mutations) {
    if ($('[name="UF_CRM_60B24FEF47312"]').length) {
        var tf=$('[name="UF_CRM_60B24FEF47312"]').val();
 var sil= "window.open('"+tf+"')";
$('[data-cid="UF_CRM_60B24FEF47312"] .ui-entity-editor-block-title').append('<button onclick="'+sil+'">Открыть ссылку</button>');
var   sh=$('[name="UF_CRM_60B253AFE682F"]').val()/100;
                              var  wh=$('[name="UF_CRM_60B253AFED408"]').val()/100;

    $('[name="UF_CRM_1632215512"]').val(parseFloat(sh*wh).toFixed(2));

        observer.disconnect();
        //We can disconnect observer once the element exist if we dont want observe more changes in the DOM
    }
});

// Start observing
observer.observe(document.body, { //document.body is node target to observe
    childList: true, //This is a must have for the observer with subtree
    subtree: true //Set to true if changes must also be observed in descendants.
});



                          }
