// ==UserScript==
// @name           cmoa downloader
// @description    Download comics from cmoa
// @author         KUMA
// @require        http://code.jquery.com/jquery-3.1.0.min.js
// @include        *www.cmoa.jp/bib/speedreader/speed.html*
// @version        2.0
// @grant          none
// @run-at         document-end
// @namespace https://greasyfork.org/users/299057
// @downloadURL https://update.greasyfork.org/scripts/382855/cmoa%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/382855/cmoa%20downloader.meta.js
// ==/UserScript==


var kuma = setInterval(function(){
  if($('#content>div').length > 0){
    $('#content>div').each(function(){
      if($(this).find('button').length == 0){
        var content = $(this);
        var button = $('<button style="position:absolute;left:0;bottom:0;">下载</button>');
        button.appendTo(content);
        button.click(function(){
          var width = parseInt(content.find('.pt-img>div>img').attr('width'));
          var height = 0;
          content.find('.pt-img>div>img').each(function(){
            height += parseInt($(this).attr('height')) - 8;
          });
          height = height + 8;
          var canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          var y = 0;
          content.find('.pt-img>div>img').each(function(){
            canvas.getContext("2d").drawImage($(this)[0], 0, y);
            y += parseInt($(this).attr('height')) - 8;
          });
          var base64Img = canvas.toDataURL("image/jpeg");
          var fileName = parseInt(content.attr('id').replace('content-p', ''));
          if(fileName < 10){
            fileName = '00' + fileName;
          }else if(fileName < 100){
            fileName = '0' + fileName;
          }
          downloadFile(fileName + '.jpg', base64Img);
        });
      }
    });
  }
}, 500);
function base64Img2Blob(code){
  var parts = code.split(';base64,');
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);
  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], {type: contentType});
}
function downloadFile(fileName, content){
  var a = $('<a href="' + URL.createObjectURL(base64Img2Blob(content)) + '" download="' + fileName + '"></a>');
  a.prependTo('body');
  a[0].click();
  a.remove();
}