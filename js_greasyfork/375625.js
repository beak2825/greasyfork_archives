// ==UserScript==
// @name         Zendesk help center MCE extended
// @namespace    http://seenaptic.com/
// @version      0.1
// @description  Enhanced the tiny MCE editor use in zendsesk
// @author       Charles Thumerelle
// @match        https://*.zendesk.com/knowledge/articles/*
// @grant        none
// @run-at       document-start
// @require      https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/375625/Zendesk%20help%20center%20MCE%20extended.user.js
// @updateURL https://update.greasyfork.org/scripts/375625/Zendesk%20help%20center%20MCE%20extended.meta.js
// ==/UserScript==

(function() {
  var observer = setMutationHandler(document, '.mce-container', function(nodes) {
      var tinyID = document.querySelector('textarea').getAttribute('id');
      var options = tinymce.get(tinyID);
      console.log(tinyID);
      console.log(options);
      tinymce.execCommand('mceRemoveEditor', false, tinyID);
      tinymce.settings.valid_elements = "*[*]"; //accept all HTML tags, like <i> with class or other data-attributes
      tinymce.settings.formats.highlight = {block : 'h1', attributes : {title : 'Header'}, styles : {color : 'red'}};
      tinymce.settings.block_formats += ";Heading 5=h5;Heading 6=h6;highlight=highlight";
      //tinymce.settings.plugins += " template";
      tinymce.settings.templates = [
          {
              title: "Editor Details",
              url: "editor_details.htm",
              description: "Adds Editors Name and Staff ID"
          }
      ];
      tinymce.settings.content_css = 'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css,https://fonts.googleapis.com/icon?family=Material+Icons',
      tinymce.settings.content_css_cors = true
      tinymce.settings.toolbar = "template styleselect zen-textsize bold italic zen-forecolor | numlist bullist zen-align | link zen-imagemanager zen-video table | zen-code";
      tinymce.settings.style_formats_merge = true,
      tinymce.settings.style_formats = [
          {title : 'Theme', items: [
              {title: 'Bold text', inline: 'b'},
              {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
              {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
              {title: 'Example 1', inline: 'span', classes: 'example1'},
              {title: 'Example 2', inline: 'span', classes: 'example2'},
              {title: 'Table styles'},
              {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
          ]}
      ];
      tinymce.settings.style_formats_autohide = true
      tinymce.execCommand('mceAddEditor', false, tinyID);
      return false;
  });
})();