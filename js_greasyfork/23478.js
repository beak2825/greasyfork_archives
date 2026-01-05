// ==UserScript==
// @name         Teams Tag Comment [GTP]
// @namespace    https://realitygaming.fr/
// @version      1.0
// @description  Script permettant d'ajouter un tag sur chaque commentaire et de citer l'auteur de celui-ci.
// @author       Rivals GTP
// @match        https://realitygaming.fr/teams/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23478/Teams%20Tag%20Comment%20%5BGTP%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/23478/Teams%20Tag%20Comment%20%5BGTP%5D.meta.js
// ==/UserScript==

$(document).ready(function(){
    $("<style type='text/css'> .tagComment { color: #9e9e9e; } .tagComment:hover { -webkit-transform: rotate(400deg); -ms-transform: rotate(400deg); transform: rotate(400deg); -webkit-transform: rotate(400deg); -moz-transform: rotate(400deg); -ms-transform: rotate(400deg); -o-transform: rotate(400deg); transition: all 0.35s; -webkit-transition: all 0.35s; -moz-transition: all 0.35s; -ms-transition: all 0.35s; -o-transition: all 0.35s; cursor: pointer; color: #3C7C95; } </style>").appendTo("head");
    $('.messageContent .username[dir=auto]').before('<i class="fa fa-tag tagComment" aria-hidden="true"></i>');

    var tagComment = $('.tagComment');

    tagComment.click(function(){
      var authorCommentUsername = $(this).parent().children()[1].text;
      var postComment = $('textarea[placeholder="Poster un commentaire..."]');

      if(postComment.val() !== '') {
        postComment.val(postComment.val() + '@' + authorCommentUsername + ' ');
        postComment.focus();
      }

      else {
        postComment.val('@' + authorCommentUsername + ' ');
        postComment.focus();
      }
   });

});