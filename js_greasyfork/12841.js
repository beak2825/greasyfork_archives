// ==UserScript==
// @name        Pokébip
// @namespace   Pokebip
// @description Changement de style de Pokébip
// @include     http://www.pokebip.com/pokemon/*
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @version     3
// @author      Reap
// @downloadURL https://update.greasyfork.org/scripts/12841/Pok%C3%A9bip.user.js
// @updateURL https://update.greasyfork.org/scripts/12841/Pok%C3%A9bip.meta.js
// ==/UserScript==

function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}

var $j = jQuery.noConflict();

var newSkin = true;
if($j('#cadre_barre').length) newSkin = false;
var borderColor;
var isPokedex = false;

if(!newSkin) {
  addStyleSheet('@import "http://www.pokebip.com/pokemon/skins/design/em.css";');
  $j('.page').attr('id', 'page').css('width', 'auto');
  $j('.titre').attr('id', 'page-titre').css('width', 'auto').css('border', 'none');
  if($j('.colonnes-site-accueil').length || $j('.colonnes-site').length) {
    backgroundColor = '#d4cfdf';
    borderColor = '#423b5d';
    aHoverColor = '#757089';
    if($j('.colonnes-site-accueil').length) {
      $j('.colonnes-site-accueil').attr('id', 'page-contenu').css('width', '100%').css('border', 'none').css('margin', '0');
      $j('.contenu-accueil').css('width', '800px');
      $j('.contenu-accueil').children('h1').prevAll().remove();
    } else {
      $j('.colonnes-site').attr('id', 'page-contenu').css('width', '100%').css('border', 'none').css('margin', '0');
      $j('.contenu').css('width', '990px');
    }
    $j('#menug').children('#menu_jeuxvideo').prevAll().remove();
    $j('#page').next('div').remove();
  } else if($j('.colonnes-pokedex').length) {
    isPokedex = true;
    borderColor = '#093d5b';
    aHoverColor = '#618295';
    backgroundColor = '#abc7d7';
    $j('.colonnes-pokedex').attr('id', 'page-contenu').css('width', '100%').css('border', 'none').css('margin', '0');
    $j('.contenu-dex').css('width', '990px');
    $j('#pokeliste').css('backgroundColor', backgroundColor);
  }
  $j('#page').prepend('<div id="page-barre-liens"></div>');
}

var isForum = false;
if($j('#phpbb').length) isForum = true;

var barreLiens = '<div id="page-barre-liens-content"><a href="http://www.pokebip.com/index.php"><img alt="Pokébip" src="http://www.pokebip.com/skins/commun/images/icone-pokebip.png"></a>' + 
    '<a href="http://www.pokebip.com/pokedex/index.php"><img src="http://www.pokebip.com/skins/commun/images/icone-pokedex.png"> <span>Pokédex</span></a>'+
    '<a href="http://www.pokebip.com/index.php?phppage=membres/index"><img src="http://www.pokebip.com/skins/commun/images/icone-em.png"> <span>Espace Membre</span></a>'+
    '<a href="http://www.pokebip.com/fora"><img src="http://www.pokebip.com/skins/commun/images/icone-forum.png"> <span>Forum</span></a>';

if(isForum) {
  $j('#page-titre').html('<img src="https://www.pictuploader.com/images/19314968005601c4572b0a8.png" alt="Pokébip - Forum" />');
  borderColor = '#1d4260';
  $j('#page').css('border', 'none').css('box-shadow', '0px 1px 3px '+borderColor);
  backgroundColor = '#8195a6';
  $j('body').css('padding-bottom', '20px');
} else {
  if(newSkin) {
    borderColor = '#6f1c1c';
    barreLiens += '<div id="page-barre-liens-compte">'+$j('#page-barre-compte').html()+'</div>';
    backgroundColor = '#ffe097';
  } else {
    $j('#page-barre-liens').css('background-color', borderColor);
    if(!isPokedex) barreLiens += '<div id="page-barre-liens-compte">'+$j('.barre-compte').html()+'</div>';
    else barreLiens += '<div id="page-barre-liens-compte">'+$j('.barre-recherche').html()+'</div>';
  }
  //$j('#page').css('max-width', '1200px').css('border', '1px solid '+borderColor);
  $j('#page').css('max-width', '1200px').css('border', 'none').css('box-shadow', '0px 1px 3px '+borderColor);
  $j('#page-barre-compte').remove();
  $j('#cadre_barre').remove();
  $j('#navigation').css('background-image', 'linear-gradient(to bottom, #ffdb89, #ffffea)');
}
 $j('body').css('background-color', backgroundColor);
barreLiens += '</div>';

$j('#page-contenu').css('padding', '5px').css('margin-bottom', '0');
$j('#page-footer').css('padding', '10px');
$j('#page-barre-liens').html(barreLiens);
$j('#page-barre-liens a').css('padding', '0 10px').css('height', '35px').css('line-height', '35px');
if(newSkin) $j('#page-barre-liens a:first img').css('margin-bottom', '2px');
else  $j('#page-barre-liens a:first img').css('margin-top', '6px');
$j('#page-barre-liens-content').css('width', '1200px').css('margin', 'auto').css('text-align', 'left');
if(isPokedex) $j('#page-barre-liens').css('overflow', 'visible');
if(!isForum) {
  $j('body').css('padding-bottom', '20px');
  $j('#page-barre-liens-content').css('position', 'relative');
  $j('#page-barre-liens-compte').css('position', 'absolute').css('right', '0').css('top', '0').css('color', 'white');
  $j('#page-barre-liens-compte a').css('font-size', 'medium').css('vertical-align', 'middle').css('padding', '0 5px');
  $j('.alerte-mp').css('display', 'inline-block').css('border-radius', '50px').css('margin', '0')
  .css('width', '15px').css('height', '15px').css('line-height', '15px').css('background-color', 'white')
  .css('text-align', 'center').css('color', '#6f1c1c').css('font-weight', 'bold').css('padding', '0');
  if(!newSkin) {
    $j('#page-barre-liens').on('mouseover', 'a', function() {
      $j(this).css('background-color', aHoverColor);
    });
    $j('#page-barre-liens').on('mouseout', 'a', function() {
      $j(this).css('background-color', 'transparent');
    });
  }
  if($j('input[name=ami]').length) $j('input[name=ami]').parent('form').css('text-align', 'center').css('margin-bottom', '10px').css('margin-top', '10px');
  $j('.accueil-amis-conteneur').nextAll('br').remove();
}

$j('.accueil-actualite').css('width', '250px');
$j('body').on('DOMNodeInserted', '#chat-conteneur', function () {
  $j(this).css('max-width', '1100px');
});
$j('#topic_selection').css('text-align', 'center');
if($j('.galimg_parent').length) $j('.galimg').css('width', '250px');
$j('div.desc_image a').wrap('<div class="image_container"></div>');
$j('div.desc_image, .image_container, div.desc_image a').css('height', '300px');
$j('div.desc_image a').css('display', 'inline-block').css('line-height', 'normal');
$j('div.image_container').css('display', 'inline-block').css('line-height', '300px');
$j('img.desc_image').css('max-height', '280px');
$j('.desc_image_next, .desc_image_prev').css('top', '130px');