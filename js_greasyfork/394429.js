// ==UserScript==
// @name         Utility 10.0.0.10 Seviren
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       You
// @match        http://10.0.0.10/icrmcontratti/sevnew*
// @match        http://localhost/icallcrm/icrmcontratti/sevnew*
// @match        https://intranet.i-call.it:44327/icrmcontratti/sevnew*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @namespace    https://greasyfork.org/users/88678
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394429/Utility%20100010%20Seviren.user.js
// @updateURL https://update.greasyfork.org/scripts/394429/Utility%20100010%20Seviren.meta.js
// ==/UserScript==
function copyToClipboard(text) {
  var et = $('<textarea/>', {
    css: {
      opacity: '0',
      position: 'fixed'
    }
  });
  $('body').append(et);
  $(et) [0].value = text;
  $(et).focus().select();
  document.execCommand('copy');
  $(et).remove();
}
$(document).ready(function () {
    if($('.gridaction').length){
        $('td').on('contextmenu',function(ev){
            ev.preventDefault();
            $(this).parent('tr').find('a [title="Modifica"]').click();
        })
    }
  $('a [title="Modifica"]').on('click', function (event) {
    event.preventDefault();
    var targetlink = $(this).parent().attr('href');
    $('.modal-icl').remove();
    $('body').append('<div class="modal-icl"><div class="modal-cont-icl"></div></div>');
    $('.modal-cont-icl').html(' <iframe src="' + targetlink + '"></iframe> ');
  })
  $('body').on('click', '.modal-icl', function (e) {
    if (!$(e.target).parents('.modal-cont-icl').length && !$(e.target).hasClass('modal-cont-icl'))
    $('.modal-icl').remove()
  })
  $('td').on('click', function () {
      if($(this).hasClass('color-orange')){
          $(this).css('background-color','initial')
          $(this).removeClass('color-orange')
      }else{
          $(this).css('background-color', 'rgb(255, 165, 0)')
          $(this).addClass('color-orange')
      }
  })
  $('.globalelementdiv .elementlabel').on('dblclick', function () {
    copyToClipboard($(this).parent().find('input,select').val())
  })
    $('body').append('<style>.classGridRow{background:#ccc}.classGridRow:hover{background:#aaa!important}.classGridRowAlt{background-color:#a1d1ff!important}.classGridRowAlt:hover{background-color:#5af!important}.modal-icl{position:fixed;background:rgba(0,0,0,.3);width:100%;height:100%;top:0;left:0;display:flex;z-index:100}.modal-icl::before{content:" ";background-image:url(../images/icons2/close-icon.svg);background-size:100%;height:50px;width:50px;position:absolute;right:0;top:0;cursor:pointer}.modal-cont-icl{background:#fff;width:1024px;margin:auto;max-height:90%;border-radius:.3rem;border:1px solid rgba(0,0,0,.2);padding:10px;overflow:hidden}.col-2-txt{-webkit-column-count:2;-moz-column-count:2;column-count:2}.modal-cont-icl label{display:inline-table;width:100%}.modal-cont-icl label b{font-size:14px}.modal-cont-icl iframe{width:100%;min-height:500px;border:0}</style>')
})
