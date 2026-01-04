// ==UserScript==
// @name Pawoo min drawer
// @author       夕月夜凪
// @description:ja Pawoo(というかMastdon)のトゥートドロワーを折り畳めるようにします。
// @version      1.0.3.1
// @grant none
// @match https://pawoo.net/web/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @license       MIT License
// @namespace https://greasyfork.org/users/249870
// @description Pawoo(というかMastdon)のトゥートドロワーを折り畳めるようにします。
// @downloadURL https://update.greasyfork.org/scripts/378254/Pawoo%20min%20drawer.user.js
// @updateURL https://update.greasyfork.org/scripts/378254/Pawoo%20min%20drawer.meta.js
// ==/UserScript==

$(window).on('load', function () {
  var $columnsArea = $('.columns-area');

  if (!$columnsArea.children('.drawer-min').length) {
    var styleText = ".columns-area > input#drawer-toggle:not(:checked) ~ .drawer{  display: none;}";
    var style = document.createElement('style');
    style.innerText = styleText;
    document.head.appendChild(style);
    var chkBox = '<input id="drawer-toggle" type="checkbox" style="display:none;"/>';
    var minDrawer = '<div class="drawer-min" style="width:50px;"></div>';
    $columnsArea.prepend(minDrawer);
    $columnsArea.prepend(chkBox);
    var permalink = $('.navigation-bar > .permalink')[0].cloneNode(true);
    permalink.style = "display:block;margin:10px 5px;";
    $('.drawer-min').prepend(permalink);
    $(this).off('DOMSubtreeModified propertychange');
    var tootButton = document.createElement('button');
    tootButton.style = "color: #444b5d;background: #707b97;border: 0;border-radius: 5px;cursor: pointer;font-size: 16px;padding: 0 10px;height: 35px;margin-left: 7px;";
    tootButton.innerHTML = '<i class="fa fa-pencil"></i>';

    tootButton.onclick = function () {
      var x = $('#drawer-toggle');
      x.prop('checked', !x.prop('checked'));
      if(!!x.prop('checked')){
        $('textarea.autosuggest-textarea__textarea').focus();
      }
    };

    $('.drawer-min').append(tootButton);
    
    $('textarea.autosuggest-textarea__textarea').keydown(function(e){
      if(e.ctrlKey && e.keyCode === 13){
        var x = $('#drawer-toggle');
        x.prop('checked', false);
      }
    });

    $(document).keydown(function(e){
      if(e.keyCode === 27){
        var x = $('#drawer-toggle');
        x.prop('checked', false);
        $('textarea.autosuggest-textarea__textarea').val("");
      }
    });

    $('.compose-form__publish-button-wrapper > button.button').on('click',function(){
      var x = $('#drawer-toggle');
      x.prop('checked', false);
    });
    
    document.addEventListener('dragenter',function(e){
      e.preventDefault();
      if(e.dataTransfer.types.includes('Files')){
        var x = $('#drawer-toggle');
        x.prop('checked', true);
      }
    });
  }
});