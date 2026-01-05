// ==UserScript==
// @author       @leoncastro
// @namespace    https://github.com/leoncastro
// @license      MIT License; http://opensource.org/licenses/MIT
// @name         facebook-mod-helper
// @version      0.04
// @description  Facebook moderation helper
// @icon         http://icons.iconarchive.com/icons/paomedia/small-n-flat/64/social-facebook-icon.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @include      https://www.facebook.com/*
// @include      /^(https?:)?\/\/([^\.\/]+\.)?facebook\.com\/*.*/
// @compatible   firefox+greasemonkey
// @compatible   chrome+tampermonkey
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/23731/facebook-mod-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/23731/facebook-mod-helper.meta.js
// ==/UserScript==
//
(function() {

 // @part-name         @iconset
 // @part-webpage      http://www.iconarchive.com/show/small-n-flat-icons-by-paomedia.1.html
 // @part-author       https://github.com/paomedia
 // @part-license      Public Domain; http://creativecommons.org/publicdomain/zero/1.0/
 // @part-image        http://icons.iconarchive.com/icons/paomedia/small-n-flat/64/social-facebook-icon.png
 // @part-image        http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/shield-icon.png
 // @part-image        http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/shield-error-icon.png
 // @part-image        http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/shield-warning-icon.png
 // @part-image        http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/sign-sync-icon.png
 // @part-image        http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/sign-down-icon.png
 // @part-image        http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/sign-up-icon.png
 // @part-image        http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/sign-right-icon.png
 // @part-image        http://icons.iconarchive.com/icons/paomedia/small-n-flat/16/sign-error-icon.png
 // @part-image        http://icons.iconarchive.com/icons/paomedia/small-n-flat/16/sign-warning-icon.png

 // @part-name         @filesaver
 // @part-webpage      https://github.com/eligrey/FileSaver.js
 // @part-author       https://github.com/eligrey
 // @part-license      MIT License; https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 // @part-file         https://github.com/eligrey/FileSaver.js/blob/master/FileSaver.min.js
 // @part-content      :
 /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
 var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,i=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},a=/constructor/i.test(e.HTMLElement),f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},d="application/octet-stream",s=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,s)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(i){u(i)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,s){if(!s){t=p(t)}var v=this,w=t.type,m=w===d,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&a)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;i(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define([],function(){return saveAs})}
 //

 // @part-name         @filereader
 // @part-website      http://stackoverflow.com/questions/3582671/how-to-open-a-local-disk-file-with-javascript
 // @part-author       http://github.com/moretti
 // @part-license      CC-BY-SA; https://creativecommons.org/licenses/by-sa/3.0/legalcode
 //

 $('head').append(`
<style>
.fbmod-mnu{background-clip:content-box;background-origin:content-box;padding:0 3px 3px 0;width:24px;height:24px;cursor:pointer}
.fbmod-pad{margin:0;padding:4px 3px 0}
.fbmod-mnu-menu{background-image:url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/shield-icon.png')}
.fbmod-mnu-menu.hide{-moz-filter:brightness(150%) invert(1) hue-rotate(205deg);-webkit-filter:brightness(150%) invert(1) hue-rotate(205deg);filter:brightness(150%) invert(1) hue-rotate(205deg)}
.fbmod-mnu-menu.show{-moz-filter:brightness(150%);-webkit-filter:brightness(150%);filter:brightness(150%)}
.fbmod-dlg-menu{width:24px;background-color:#fff;z-index:100;border:1px solid rgba(100, 100, 100, .4);box-shadow: 0 3px 8px rgba(0, 0, 0, .25);}
.fbmod-mnu-menu.hide+.fbmod-dlg-menu{display:none}
.fbmod-mnu-menu.show+.fbmod-dlg-menu{display:block}
.fbmod-nub{right:2px}
.fbmod-mnu-perm{background-image:url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/shield-error-icon.png')}
.fbmod-mnu-temp{background-image:url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/shield-warning-icon.png')}
.fbmod-mnu-wipe{background-image:url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/sign-sync-icon.png')}
.fbmod-mnu-save{background-image:url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/sign-down-icon.png')}
.fbmod-mnu-load{background-image:url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/sign-up-icon.png')}
.fbmod-mnu-join{background-image:url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/sign-right-icon.png')}

.fbmod-ico{float:left;width:16px;height:16px}
.fbmod-ico-stop{background-image:url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/16/sign-error-icon.png')}
.fbmod-ico-warn{background-image:url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/16/sign-warning-icon.png')}
.fbmod-red-permaban{color:#ff0000!important}
.fbmod-red-temporal{color:#ffa500!important}
</style>
`);
 mainAddMenu();
 function mainAddMenu()
 {
  $('._cy6').eq(1).append(`
<div class='_4kny'>
 <div class='_4962'>
  <div class='fbmod-pad'>
   <div class='fbmod-mnu fbmod-mnu-menu hide'></div>
   <div class='__tw fbmod-dlg-menu'>
    <div class='beeperNub fbmod-nub'></div>
   </div>
   <div style='display:none'><input type='file' id='fbmod-dlg-file'/></div>
  </div>
 </div>
</div>
`);
  $('.fbmod-mnu-menu').click(function(e){
   if($(this).hasClass('hide'))
    $(this).removeClass('hide').addClass('show');
   else
    $(this).removeClass('show').addClass('hide');
  });
  [
   ['fbmod-mnu-perm', uiMnuOnPerm],
   ['fbmod-mnu-temp', uiMnuOnTemp],
   ['fbmod-mnu-wipe', uiMnuOnWipe],
   ['fbmod-mnu-save', uiMnuOnSave],
   ['fbmod-mnu-load', uiMnuOnLoad],
   ['fbmod-mnu-join', uiMnuOnJoin],
  ].forEach(function(o){
   $('.fbmod-dlg-menu').append('<div class="fbmod-mnu ' + o[0] + '"></div>');
   $('.' + o[0]).click(function(e){
    (o[1])();
   });
  });
 }
 function uiMnuOnPerm()
 {
  var url = prompt('permaban', 'url');
  if(url)
  {
   url = fbUrlUserName(url);
   if(url)
   {
    var a = lsGetList();
    if(!a.permaban[url])
    {
     doSetPermaban(a, url);
     doDelTemporal(a, url);
     lsSetList(a);
    }
   }
  }
  uiMnuHide();
 }
 function uiMnuOnTemp()
 {
  var url = prompt('temporal', 'url');
  if(url)
  {
   url = fbUrlUserName(url);
   if(url)
   {
    var a = lsGetList();
    if(!a.permaban[url])
    {
     doSetTemporal(a, url);
     lsSetList(a);
    }
   }
  }
  uiMnuHide();
 }
 function uiMnuOnWipe()
 {
  lsSetList(doVoid());
  uiMnuHide();
 }
 function uiMnuOnSave()
 {
  fsSaveFile(doString(lsGetList()));
  uiMnuHide();
 }
 function uiMnuOnLoad()
 {
  fsLoadFile(function(text){lsSetList(doObject(text)||doVoid())});
  uiMnuHide();
 }
 function uiMnuOnJoin()
 {
  fsLoadFile(function(text){lsSetList($.extend(true,lsGetList(),doObject(text)||doVoid()))});
  uiMnuHide();
 }
 function uiMnuHide(){$('.fbmod-mnu-menu').removeClass('show').addClass('hide')}

 function doVoid(){return{permaban:{},temporal:{}}}
 function doSetPermaban(o,u)
 {
  o.permaban[u] = { mod: fbAdminName(), dat: Date.now(), url: u };
 }
 function doSetTemporal(o,u)
 {
  if(o.temporal[u])
  {
   o.temporal[u] = { mod: o.temporal[u].mod, dat: o.temporal[u].dat, url: u, num: o.temporal[u].num + 1 };
  }
  else
  {
   o.temporal[u] = { mod: fbAdminName(), dat: Date.now(), url: u, num: 1 };
  }
 }
 function doDelPermaban(o,u){if(o.permaban[u])delete o.permaban[u]}
 function doDelTemporal(o,u){if(o.temporal[u])delete o.temporal[u]}
 function doObject(str){return window.JSON.parse(str)}
 function doString(obj){return window.JSON.stringify(obj)}
 
 function lsGetList()
 {
  return doObject(window.localStorage.getItem('fbmod'))||doVoid();
 }
 function lsSetList(obj)
 {
  window.localStorage.setItem('fbmod', doString(obj));
  mainMarkAll();
 }

 function fsSaveFile(text)
 {
  // <@fileloader>
  var file = new File([text], "facebook-ban-list.txt", {type: "text/plain;charset=utf-8"});
  saveAs(file);
  // </@fileloader>
 }
 function fsLoadFile(callback)
 {
  // <@filereader>
  document.getElementById('fbmod-dlg-file').addEventListener('change', function(e){
   var file = e.target.files[0];
   if (!file)
    return;
   var reader = new FileReader();
   reader.onload = function(e){
    var contents = e.target.result;
    callback(contents);
   };
   reader.readAsText(file);
   this.value = null;
  }, false);
  // </@filereader>
  $('#fbmod-dlg-file').click();
 }

 function fbAdminName()
 {
  return fbUrlUserName($('a._2s25').attr('href'));
 }
 function fbUrlUserName(url)
 {
  var r = /(?:https?:)?\/\/(?:[^\.\/]+\.)?facebook\.com(\/profile.php\?id=[0-9]+|\/[^\?]+)/i;
  return url.match(r)?url.match(r)[1]:0;
 }

 lsSetList(lsGetList());

 $(window).scroll(mainMarkAll);
 function mainMarkAll()
 {
  setTimeout(baseMarkAll,300);
 }
 function baseMarkAll()
 {
  $('a[href*="facebook"]').map(mainMarkOne)
 }
 function mainMarkOne(i,o)
 {
  if(!fbUrlUserName(o.href) || o.href.indexOf('/pages/') != -1)
   return;
  if($.trim($(o).text()) == '')
   return;
  setTimeout(function(){baseMarkOne(o)},300);
 }
 function baseMarkOne(o)
 {
  var $o = $(o);
  var a = lsGetList();
  var b = fbUrlUserName(o.href);
  if( b && a.permaban[b] )
  {
   if( !$o.next().hasClass('fbmod-ico') )
   {
    var s = '<div class="fbmod-ico fbmod-ico-stop" data-fmod="' + b + '" title="';
    s = s + (new Date(a.permaban[b].dat)).toLocaleDateString() + a.permaban[b].mod;
    s = s + '"></div>';
    $o.addClass('fbmod-red-permaban').after(s);
    $('.fbmod-ico-stop[data-fmod="' + b + '"]').click(function(e){
     $('.fbmod-ico-stop[data-fmod="' + b + '"]').remove();
     var a = lsGetList();
     if(a.permaban[b])
     {
      doDelPermaban(a, b);
      lsSetList(a);
     }
    });
   }
  }
  else if( b && a.temporal[b] )
  {
   if( !$o.next().hasClass('fbmod-ico') )
   {
    var s = '<div class="fbmod-ico fbmod-ico-warn" data-fmod="' + b + '" title="';
    s = s + (new Date(a.temporal[b].dat)).toLocaleDateString() + a.temporal[b].mod + ' (' + a.temporal[b].num + ')';
    s = s + '"></div>';
    $o.addClass('fbmod-red-temporal').after(s);
    $('.fbmod-ico-warn[data-fmod="' + b + '"]').click(function(e){
     $('.fbmod-ico-warn[data-fmod="' + b + '"]').remove();
     var a = lsGetList();
     if(a.temporal[b])
     {
      doDelTemporal(a, b);
      lsSetList(a);
     }
    });
   }
  }
  else
  {
   $o.removeClass('fbmod-red-temporal').removeClass('fbmod-red-permaban');
   if( $o.next().hasClass('fbmod-ico') )
    $o.next().remove();
  }
 }
})();
