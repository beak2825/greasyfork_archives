// ==UserScript==
$(document).ready(function () {
  'use strict';

  var rulesToEditors, whereIsLince, boldMarkupSet, italicMarkupSet,
      container, textareaBox, textareaBoxClone;

  boldMarkupSet = {
    name:lang['Negrita'],
    beforeInsert: markButtons.bold,
    action: 'bold',
    key: 'B',
    openWith: '[b]',
    closeWith: '[/b]',
    className: "mark-bold"
  };

  italicMarkupSet = {
    name:lang['Cursiva'],
    beforeInsert: markButtons.italic,
    action: 'italic',
    key: 'I',
    openWith: '[i]',
    closeWith: '[/i]',
    className: "mark-italic"
  };

  rulesToEditors = {

    post: function () {
      var markitcomment, cont_comm, addV6BbcodesCss, addFAIcons;

      cont_comm = $('.myComment-text-box .cont_comm');
      textareaBox = $('#body_comm');
      textareaBoxClone = $('#body_comm').clone();
      addV6BbcodesCss = function () {
        $('<link/>', {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css'
        }).appendTo('head');

        $('<style>', {
          type: 'text/css'
        }).html(
          '#cont_reply .markItUpHeader a.fa,' +
          '.cont_comm .markItUpHeader a.fa {' +
          '  font-size: 14px;' +
          '  height: 16px;' +
          '  margin-top: 6px;' +
          '  width: 18px;' +
          '  margin-right: 4px;' +
          '}'
        ).appendTo('head');
      };
      addFAIcons = function (container) {
        container
        .find('.markItUpButton.mark-bold > a')
        .html('')
        .addClass('fa fa-bold');

        container
        .find('.markItUpButton.mark-italic > a')
        .html('')
        .addClass('fa fa-italic');
      };

      // customize our comment box options
      settingsComment.markupSet.unshift(
        boldMarkupSet,
        italicMarkupSet
      );

      addV6BbcodesCss();
      textareaBox.parents('.markitcomment').remove();
      cont_comm.append(textareaBoxClone);

      // agregamos el plugin markitup
      //commentBoxClone.markItUpRemove();
      textareaBoxClone.markItUp(settingsComment);

      // add T! smileys feature
      textareaBoxClone.removeClass('emoji-loaded');
      textareaBoxClone.emoticons();

      textareaBoxClone.uberText({
        limit: 5000,
        show: -50,
        autogrow: true,
        lines: 4
      });

      addFAIcons(cont_comm);

      $('.answerCitar > a').on('click', function () {
        addFAIcons($('#cont_reply'));
      });
    },

    pm: function () {      
      container = $('#ffreply').length ? $('#ffreply') : $('#mynewMessage-text-box');
      textareaBox = $('#nbody_fastreply');
      textareaBoxClone = textareaBox.clone();

      textareaBox.parents('.nmarkitfastreply').remove();
      container.prepend(textareaBoxClone);

      nmySettings_fastreply.markupSet.unshift(
        boldMarkupSet,
        italicMarkupSet
      );

      textareaBoxClone.markItUp(nmySettings_fastreply);
      textareaBoxClone.removeClass('emoji-loaded');
      textareaBoxClone.emoticons();
    },

    comment_box: function () {
      container = $('.myComment-text-box .cont_comm');
      textareaBox = $('#body_comm');
      textareaBoxClone = textareaBox.clone();

      textareaBox.parents('.markitcomment').remove();
      container.append(textareaBoxClone);

      settingsComment.markupSet.unshift(
        boldMarkupSet,
        italicMarkupSet
      );

      textareaBoxClone.markItUp(settingsComment);
      textareaBoxClone.removeClass('emoji-loaded');
      textareaBoxClone.emoticons();
    }
  };

  whereIsLince = function () {
    if (global_data.postid !== '') {
      return 'post';
    } else if ($('#ffreply').length || $('#mynewMessage-text-box').length) {
      return 'pm';
    } else if ($('#tema-container').length ||
               $('#markItUpBody_comm').length) {
      return 'comment_box';
    }

    return null;

l;
  };

  if (whereIsLince()) {
    rulesToEditors[whereIsLince()]();
  } 
});
// @name        Botones de Negrita y Cursiva
// @namespace   chuhcorea
// @Author   @chuchorea
// @description Agrega los Botones de Negrita y Cursiva para comentar en Taringa!.
// @include     /^http:\/\/([w]{3}\.)?taringa.net[^$]*$/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12882/Botones%20de%20Negrita%20y%20Cursiva.user.js
// @updateURL https://update.greasyfork.org/scripts/12882/Botones%20de%20Negrita%20y%20Cursiva.meta.js
// ==/UserScript==