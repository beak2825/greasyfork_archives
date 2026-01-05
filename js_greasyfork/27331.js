// ==UserScript==
// @name        Get chapter links
// @namespace   dtm
// @include     https://novelki.pl/projekty/*
// @version     1
// @grant       none
// @description Dodaje przycisk do skopiowania linkow do rozdzalow
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/27331/Get%20chapter%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/27331/Get%20chapter%20links.meta.js
// ==/UserScript==

function getHref(item){
  return $(item).prop('href');
}

function copyToClipboard(){
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.setAttribute("id", "dummy_id");
      document.getElementById("dummy_id").value=$.map(slicedLinks, getHref).join('\r\n');
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    }


var links = [];
var maxLinksPerPage = 50;
var slicedLinks = [];
var button;
var input;

var tmp = [];

function onlyUnique(value, index, self) {
  if (tmp.indexOf(value.prop('href')) < 0){
    tmp.push(value.prop('href'));
    return true;
  }
  else{
    return false;
  }
}

function findLinks() {
  $tempsA = []
  tmp = [];
  $('table.chapters tr td:first-child a').each(function () {
    $tempsA.push($(this));
  });
  links = $tempsA.filter(onlyUnique).reverse();
}

function changeTitle(title){
  button.prop('title', title);
}

function getText(item) {
  return $(item).text();
}

function linksPageNumberChanged(){
  var pageNumber = input.val()
  if(isNaN(pageNumber) || pageNumber <= 0){
    slicedLinks = links;
    changeTitle('Nieprawidłowy input\r\n Wszystkie linki \n Ilość:' + slicedLinks.length)
  } else {
    var startPosition = (pageNumber-1)*maxLinksPerPage;
    if(startPosition >= links.length){
      slicedLinks = links;
      changeTitle('Strona za duża, brak linków' 
                  + ' \r\nLiczba stron: ' + links.length/maxLinksPerPage 
                  + ' \r\nLinków na stronie: ' + maxLinksPerPage 
                  + " \r\nWszystkich linków: " + links.length)
    } else {
      slicedLinks = links.slice((pageNumber-1)*maxLinksPerPage, pageNumber*maxLinksPerPage);
      changeTitle($.map(slicedLinks, getText).join('<|>'));
    }
  }
}

function getChaptersLinks(){
  var pageNumber = $('#links-page-number').val()
  if(isNaN(pageNumber) || pageNumber <= 0){
    copyToClipboard();
  } else {
    var startPosition = (pageNumber-1)*maxLinksPerPage;
    if(startPosition >= links.length){
      alert('Nie ma takiej strony');
    } else {
      copyToClipboard(); 
    }
  }
}

function addInputsToPage(){
  var $tc = $('table.chapters').get(1);
  $('<input id="links-page-number" />').insertBefore($tc);
  $('<button id="getLinks" type="button" >Pobierz linki</button>').insertBefore($tc);
  button = $('button#getLinks');
  input = $('input#links-page-number');
  button.click(getChaptersLinks);
  input.keyup(linksPageNumberChanged);
}

$(document).ready(function () {
  console.log('test');
  findLinks();
  addInputsToPage();
  linksPageNumberChanged();
  $(document).tooltip({
    open: function (event, ui) {
        ui.tooltip.css("min-width", "800px");
    }
   });
});
