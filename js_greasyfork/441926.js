// ==UserScript==
// @name         ATS Tweaks
// @namespace    www.abovetopsecret.com
// @description  Some tweaks and fixes for ATS
// @include      http*://www.abovetopsecret.com/forum/*
// @run-at       document-idle
// @author       ChaoticOrder
// @license      MIT
// @version      2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441926/ATS%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/441926/ATS%20Tweaks.meta.js
// ==/UserScript==

var img_start = '<img border="0" align="absmiddle" src="https://files.abovetopsecret.com/images/smilies/';
var img_user = '<img border="0" align="absmiddle" src="https://files.abovetopsecret.com/files/img/';
var img_omem = '<img border="0" align="absmiddle" src="https://files.abovetopsecret.com/images/member/';
var img_upld = '<img border="0" align="absmiddle" src="https://files.abovetopsecret.com/uploads/';

function replaceSmiley(class_name, new_html) {
  let i_html = '<i class="'+class_name+'"></i>';
  let div_html = '<div class="'+class_name+'"></div>';
  let spn_html = '<span class="'+class_name+'"></span>';
  let posts = document.getElementsByClassName('post');
  let smiles = document.getElementsByClassName('postsmilerow');
  for (let i=0; i < posts.length; i++) {
    let new_post = posts[i].innerHTML.replaceAll(div_html, new_html);
    posts[i].innerHTML = new_post.replaceAll(i_html, new_html);
  }
  for (let i=0; i < smiles.length; i++) {
    smiles[i].innerHTML = smiles[i].innerHTML.replace(spn_html, new_html);
  }
}

function doChanges() {

  // show hidden nested quotes
  let quotes = document.getElementsByTagName('blockquote');
  for (let i=0; i < quotes.length; i++) {
    quotes[i].style.display = 'block';
  }
  // prevent stars overflowing
  let topls = document.getElementsByClassName('posttopL');
  for (let i=0; i < topls.length; i++) {
    topls[i].style.width = 'auto';
    topls[i].style.whiteSpace = 'nowrap';
  }

  replaceSmiley('sm-happy', img_start+'smile.gif">');
  replaceSmiley('sm-unhappy', img_start+'sad.gif">');
  replaceSmiley('sm-grin', img_start+'biggrin.gif">');
  replaceSmiley('sm-wink', img_start+'wink.gif">');
  replaceSmiley('sm-cool', img_start+'cool.gif">');
  replaceSmiley('sm-angry', img_start+'mad.gif">');
  replaceSmiley('sm-surprised', img_start+'shocked.gif">');
  replaceSmiley('sm-tongue', img_start+'tongue.gif">');
  replaceSmiley('sm-up', img_start+'thumbup.gif">');
  replaceSmiley('sm-down', img_start+'thumbdown.gif">');
  replaceSmiley('sm-displeased', img_start+'puzzled.gif">');
  replaceSmiley('sm-laugh', img_start+'lol.gif">');
  replaceSmiley('sm-duh', img_start+'duh.gif">');
  replaceSmiley('sm-wow', img_start+'wow.gif">');
  replaceSmiley('sm-roll', img_start+'roll.gif">');
  replaceSmiley('sm-caution', img_start+'exclamation.gif">');
  replaceSmiley('sm-eyeroll', img_start+'rolleyes.gif">');
  replaceSmiley('sm-barf', img_start+'regan.gif">');
  replaceSmiley('sm-shock', img_start+'flaming.gif">');
  replaceSmiley('sm-ban', img_start+'ats2496_icon_banned.gif">');
  replaceSmiley('sm-saint', img_start+'ats2485_banana.gif">');
  replaceSmiley('sm-devil', img_user+'yn51ead11b.gif">');
  replaceSmiley('sm-how', img_user+'ly621de8f8.gif">');
  replaceSmiley('sm-cry', img_user+'qg5222955c.gif">');
  replaceSmiley('sm-hey', img_user+'yy52229f38.gif">');
  replaceSmiley('sm-beer', img_user+'nc52302f8c.gif">');
  replaceSmiley('sm-spam', img_user+'sy52229c00.gif">');
  replaceSmiley('sm-gomods', img_user+'yq52229be9.gif">');
  replaceSmiley('sm-bomb', img_user+'cl52229c21.gif">');
  replaceSmiley('sm-ham', img_user+'te503cd7ff.gif">');
  replaceSmiley('sm-stop', img_user+'yh52229f69.gif">');
  replaceSmiley('sm-medal', img_user+'ly522295ef.gif">');
  replaceSmiley('sm-meh', img_user+'xb52cd3775.gif">');
  replaceSmiley('sm-mnky', img_user+'ro5758839e.gif">');
  replaceSmiley('sm-question', img_user+'sp50c7bd6f.gif">');
  replaceSmiley('sm-idea', img_omem+'91341cbea5eb.gif">');
  replaceSmiley('sm-love', img_upld+'ats56743_hug.gif">');
}

doChanges();