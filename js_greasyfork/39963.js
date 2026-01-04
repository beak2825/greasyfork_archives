// ==UserScript==
// @name         牛盘
// @namespace    https://leochan.me
// @version      1.0.0
// @description  牛盘牛牛牛
// @author       Leo
// @match        *://www.88pan.cc/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/39963/%E7%89%9B%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/39963/%E7%89%9B%E7%9B%98.meta.js
// ==/UserScript==
function parse_url( url ){
  var match = url.match(/^(http|https|ftp)?(?:[\:\/]*)([a-z0-9\.-]*)(?:\:([0-9]+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/i), ret = {};
  ret.protocol = '';
  ret.host = match[2];
  ret.port = '';
  ret.path = '';
  ret.query = '';
  ret.fragment = '';
  if( match[1] )
    ret.protocol = match[1];
  if( match[3] )
    ret.port = match[3];
  if( match[4] )
    ret.path = match[4];
  if( match[5] )
    ret.query = match[5];
  if( match[6] )
    ret.fragment = match[6];
  return ret;
}
function load_down_address(file_id,base){
	$.ajax({
		type : 'post',
		url : base + 'ajax.php',
		data : 'action=load_down_addr2&file_id='+file_id,
		dataType : 'text',
		success:function(msg){
			var arr = msg.split('|');
			if(arr[0] == 'true'){
				$('.logo').append(arr[1]);
			}else{
				$('.logo').html(msg);
			}
		},
		error:function(){
		}
	});
}
(function() {
  'use strict';
  window.onload = function(){
    sessionStorage.setItem("hassession", 1);
    var urls = parse_url( window.location.href ), fidno;
    urls.path = urls.path.toLowerCase();
    if( urls.path.indexOf( 'down' ) !== -1 ){
      fidno = urls.path.replace( '/down-', '' );
    }else{
      fidno = urls.path.replace( '/file-', '' );
    }
    fidno = parseInt( fidno.replace( '.html', '' ) );
    setTimeout( function(){
      load_down_address( fidno, urls.protocol + '://' + urls.host + urls.port + '/' );
    }, 2000 );
  };
})();