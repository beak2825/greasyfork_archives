// ==UserScript==
// @name        Flynder: simplify
// @namespace   http://vk.com/e_gold
// @description Simplify Flynder interface: unstick nav to save v-space, remove overlaping soc. buttons, etc
// @include     http://flynder.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25654/Flynder%3A%20simplify.user.js
// @updateURL https://update.greasyfork.org/scripts/25654/Flynder%3A%20simplify.meta.js
// ==/UserScript==

$(document).ready(function(){
  var mycss = "<style>"+
      ".navigation {position:absolute; !important}"+
      "</style>";
  $("body").append(mycss);//do not waste my precious v-space with your f**king sticky navbar
  $("div.header-bg").remove();
  //if web developer cannot place it correctly, REMOVE! SocButtons are for idiots. 
  $("ul#sticky_home_sidebar").remove();
  $("div.offer__overlay").remove();//stupid onHover for idiots
  $("a.expired").remove();//who needs to see expired deals (except marketing)?
  $("div#user-quotes").remove();//I have my own opinion. (again marketing)
  $("div.special").remove();//Duplication
  //for particular pages
  $("div.rte > p:last").remove();//remove stupid newsletter face
  $("div.rte > p:last").remove();//remove stupid newsletter face
  $("div.rte > p:last").remove();//remove stupid newsletter face
  $("div.rte > table:last").remove();//remove ad-table
  $("div.rte > h2:last").remove();//remove stupid newsletter face
  
})
