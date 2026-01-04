// ==UserScript==
// @name     mantis-search-box
// @description this script will add new searchbox to the top of the page
// @name:fr mantis
// @description:fr ce script ajoutera un nouveau champ de recherche en haut de la page
// @version  1
// @include     https://mantis.*.com/my_view_page.php
// @license MIT

// @grant    none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.js


// @namespace https://greasyfork.org/users/851129
// @downloadURL https://update.greasyfork.org/scripts/436836/mantis-search-box.user.js
// @updateURL https://update.greasyfork.org/scripts/436836/mantis-search-box.meta.js
// ==/UserScript==



$(document).ready(function (){
  
  
  document.querySelectorAll('.login-info-left span')[0].innerText = "Super Admin"
  
  const autowidget = `<div class="ui-widget">
  <label for="tags">Super Admin Project Filter: </label>
  <input id="tags">
</div>`;
  
  document.querySelectorAll('.login-info-middle')[0].innerHTML = autowidget;
  
  
    var availableProects = {};
    var allProjectNames = [];
    [...document.querySelectorAll('[name="project_id"] option')].map(o=>{availableProects[o.innerText]=o.value; allProjectNames.push(o.innerText) });
  
    $( "#tags" ).autocomplete({
      source: allProjectNames
    });
  
  document.querySelector('#ui-id-1').style.backgroundColor = 'white';
  
  $('#tags').on('autocompleteselect', function (e, ui) {
        
        var projectkey =availableProects[ui.item.value];
        document.querySelectorAll('[name="project_id"] option[value="'+projectkey+'"]')[0].selected = true
    });
  
   var tables = [...document.querySelectorAll('table')];
   var maintable = tables[2];
  tables.splice(0,3);
   tables.map(o=>{
o.style.display = 'flex';
     o.style.justifyContent= "spaceBetween";
o.style.borderRadius = '.75rem';
o.style.background= 'white';
o.style.boxShadow= 'rgba(0, 0, 0, 0.2) 0px 0px 12px 0px';
o.style.border= '1px';
     
});
  
  
  


[...document.querySelectorAll('table tbody tr')].map(o=>{
o.style.borderRadius = '.75rem';
o.style.display = 'flex';
o.style.marginLeft= '5px';
o.style.marginRight='5px';
o.style.marginTop='5px';
o.style.marginBottom='5px';
  o.style.justifyContent= "space-between";
});
  
  
  document.querySelector('body').style.background = "linear-gradient(45deg, #11A49B, #B7EEB6)";
  
  
  
     
     [...document.querySelectorAll('input.button')].map(o=>{

o.style.transition= "background 400ms"
o.style.color= "#fff"
o.style.backgroundColor= "#6200ee"
o.style.padding= "1rem 2rem"
o.style.fontFamily= "'Roboto', sans-serif"
o.style.outline= "0"
o.style.border= "0"
o.style.borderRadius= "0.25rem"
o.style.boxShadow= "0 0 0.5rem rgba(0, 0, 0, 0.3)"
o.style.cursor= "pointer"
o.style.paddingTop= "0.5rem"
o.style.paddingRight= "1rem"
o.style.paddingBottom= "0.5rem"
o.style.paddingLeft= "1rem"

})
     
     

  
  
  

});