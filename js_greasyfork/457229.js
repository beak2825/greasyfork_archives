// ==UserScript==
// @namespace Onge's Neocities Feed Enhancer
// @description a simple script that enhances the neocities feed.
// @name Onge's Neocities Feed Enhancer
// @author      Ongezell
// @homepage  https://ongezell.com/
// @include https://neocities.org/
// @include https://neocities.org/site/*
// @include https://neocities.org/?activity=mine
// @include https://neocities.org/activity
// @require http://code.jquery.com/jquery-3.6.0.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-zoom/1.7.21/jquery.zoom.min.js
// @grant GM_addStyle
// @version     1.5.2
// @downloadURL https://update.greasyfork.org/scripts/457229/Onge%27s%20Neocities%20Feed%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/457229/Onge%27s%20Neocities%20Feed%20Enhancer.meta.js
// ==/UserScript==


$(document).ready(function() {


  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    .spoiler-button {
      display: block;
      margin: 0 auto;
      text-align: center;
      background-color: black;
      border: none;
      padding: 10px 20px;
    }
    .spoiler-button::before {
      content: "Spoiler";
      font-size: 10px;
      display: block;
      margin: 0 auto;
      text-align: center;
      border: none;
      color: white;
    }
    .spoiler-button:hover {
      background-color: grey;
    }

  `;

  document.head.appendChild(style);

$('a:not(.comments a)').each(function() {
  var element = $(this)
  var href = element.attr('href')
  if (href && /\.(png|jpg|gif|webp)$/i.test(href)) {
    element.replaceWith('<div class="imgus" style="text-align: center; padding: 0 10%;"><img  style="text-align: center; padding: 0 10%;" src="' + href + '"></img></div><span class="hidden">' + element.text() + '</span>')
  }
})


document.body.innerHTML = document.body.innerHTML.replace(/\(spoiler\)/g, '<button class="spoiler-button"></button><div class="spoiler-content" style="display: none;"><span class="hidden">(spoiler)</span>');

document.body.innerHTML = document.body.innerHTML.replace(/\(spoiler_\)/g, '</div><span class="hidden">(spoiler_)</span>');


$(document).ready(function() {

  $('.spoiler-button').click(function() {
    $('.spoiler-content').toggle();
  });
});




  document.body.innerHTML = document.body.innerHTML.replace(/\(br\)/g, '<br><span class="hidden">(br)</span>');

  document.body.innerHTML = document.body.innerHTML.replace(/\(p\)/g, '<p><span class="hidden">(p)</span>');

   document.body.innerHTML = document.body.innerHTML.replace(/\(p_\)/g, '</p><span class="hidden">(p_)</span>');

  document.body.innerHTML = document.body.innerHTML.replace(/\(h1\)/g, '<h1><span class="hidden">(h1)</span>');

  document.body.innerHTML = document.body.innerHTML.replace(/\(h1_\)/g, '</h1><span class="hidden">(h1_)</span>');

  document.body.innerHTML = document.body.innerHTML.replace(/\(center\)/g, '<div style="text-align: center;"><span class="hidden">(center)</span>');

  document.body.innerHTML = document.body.innerHTML.replace(/\(center_\)/g, '</div><span class="hidden">(center_)</span>');

  document.body.innerHTML = document.body.innerHTML.replace(/\(style=([^)]+)\)/g, '<span style="$1"><span class="hidden">(style=$1)</span>');
  
  document.body.innerHTML = document.body.innerHTML.replace(/\(style_\)/g, '</span><span class="hidden">(style_)</span>');





   $('.imgus').zoom({
    on: 'click',
  });
});

