// ==UserScript==
// @name        TW-DB.RechercheItems
// @version     1
// @author      Pete McLure
// @include     http://tw-db.info/*
// @include     https://tw-db.info/*
// @grant       none
// @description rétablit la fonction de recherche d'item
// @namespace https://greasyfork.org/users/15102
// @downloadURL https://update.greasyfork.org/scripts/12310/TW-DBRechercheItems.user.js
// @updateURL https://update.greasyfork.org/scripts/12310/TW-DBRechercheItems.meta.js
// ==/UserScript==


if ($('#section_name').html()=='Produits'){
  $('input[onkeyup="Items.search(this);"]').removeAttr("onkeyup").attr('id','newSearch').keyup(function(){
    var pattern = new RegExp(this.value, 'i');
    Items.recherche(pattern);
  });
}

Items.recherche = function(item){
  $("#itemsDiv img").each(function(){
    if(this.attributes['onmouseover'].value.match(item)){
      $(this).parent().parent().show();
    } else {
      $(this).parent().parent().hide();
    }
  });
};