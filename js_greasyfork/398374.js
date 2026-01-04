// ==UserScript==
// @name         Flytech Portal Editor Enhancement
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Special TinyMCE editor mod to edit Bootstrap 4 enabled content
// @author       Alrick
// @match        https://portal.flytechnology.ua/admin/shop/products/*/edit/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398374/Flytech%20Portal%20Editor%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/398374/Flytech%20Portal%20Editor%20Enhancement.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    $( document ).ready(function() {
      console.log( "TinyMCE enhancer starting!" );
    });

    var myCheck = setInterval(checkTinymce, 1000 );
    function checkTinymce(){
      var setOnce = 0;
      if ( typeof( tinymce )!='undefined' ) {
          clearInterval(myCheck);
          var editor = tinymce.get('id');
          editor.off('Remove');
          if ( typeof( editor )!='undefined' ) {
              if ( setOnce==0 ) {
                  var old_global_settings = tinymce.settings;
                  var settings = editor.settings;
                  //var editor_settings = editor.settings;
                  //editor_settings.selector = '.js-editor';

                  ////////////external plugin trial
                  var externalPlugins = settings.external_plugins;
                  var plugins = settings.plugins;
                  var toolbar = settings.toolbar;
                  var content_css = settings.content_css;

                  toolbar = [" undo redo | styleselect | fontsizeselect fontselect  forecolor backcolor charmap | link media image responsivefilemanager | code",
                             "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |  table | removeformat searchreplace"];
                  //load external plugin
                  externalPlugins['N1ED'] = 'https://flytechnology.ua/tinymce/plugins/N1ED/plugin.min.js';
                  externalPlugins['BootstrapEditor'] = 'https://flytechnology.ua/tinymce/plugins/BootstrapEditor/plugin.min.js';
                  plugins += " fullscreen N1ED BootstrapEditor";

                  //settings.content_css = content_css + ", https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css";
                  settings.external_plugins = externalPlugins;
                  settings.plugins = plugins;
                  settings.toolbar = toolbar;
                  settings.apiKey = "DEMODFLT";
                  settings.selector = '#id';
                  //console.log( settings );
                  /////////////////
                  //add new settings to tinymce
                  settings.media_live_embeds=false;
                  tinymce.settings = settings;
                  setOnce = 1;
              }
              //tinymce.EditorManager.execCommand('mceRemoveEditor', false, editor.id);
              //tinymce.EditorManager.execCommand('mceAddEditor', false, 'id');
              //tinymce.EditorManager.execCommand('mceAddEditor', false, 'js-editor');
              //tinymce.EditorManager.editors = [];

              tinymce.remove('#id');
              setTimeout(function () {tinymce.init(settings)}, 10);
              tinymce.settings = old_global_settings;

          };
      }
    }
})(jQuery);