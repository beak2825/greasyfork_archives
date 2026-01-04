// ==UserScript==
// @name         BlockchainCutiesEqToggle
// @version      0.3
// @description  a small script for Blockchain Cuties to toggle equipment on/off
// @author       VeRychard
// @match        https://blockchaincuties.co/pet/*
// @grant        none
// @namespace https://greasyfork.org/users/193828
// @downloadURL https://update.greasyfork.org/scripts/369917/BlockchainCutiesEqToggle.user.js
// @updateURL https://update.greasyfork.org/scripts/369917/BlockchainCutiesEqToggle.meta.js
// ==/UserScript==
// @require http://code.jquery.com/jquery-latest.js
(function() {
    'use strict';

  $(document).ready(function() {
      setTimeout(
      function()
        {
            $( ".pet_banner_icons" ).prepend( "<div id='eqToggle' class='pet_card-actions pet_like' style='padding: 0 11px; color:#fd8e8e; cursor:pointer; user-select:none;'>Eq. on/off</div>" );
            var cutieImg = $(".pet_banner_image").attr('src');
            var cutieNaked = cutieImg.replace(/\/\d+\//,'/4/');
            $("#eqToggle").click(function() {
                if($(this).hasClass("clicked")) {
                    $(".pet_banner_image").attr('src', cutieImg);
                    $(this).removeClass("clicked");
                    $(this).css("background", "#fff");
                } else {
                    $(".pet_banner_image").attr('src', cutieNaked);
                    $(this).addClass("clicked");
                    $(this).css("background", "#262626");
                }

            });
       }, 2500);
 });
})();