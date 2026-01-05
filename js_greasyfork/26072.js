// ==UserScript==
// @name v2ex显示图片 v2ex.com
// @description v2ex显示图片，将a链接的图片转为直接显示
// @include     https://www.v2ex.com/t/*
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @grant       aogg
// @version 1.2.3
// @namespace https://greasyfork.org/users/25818
// @downloadURL https://update.greasyfork.org/scripts/26072/v2ex%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87%20v2excom.user.js
// @updateURL https://update.greasyfork.org/scripts/26072/v2ex%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87%20v2excom.meta.js
// ==/UserScript==


var a = $('#Main .box>.cell a[rel="nofollow"]');
var a_img = a.filter('[href$=".jpg"],[href$=".JPG"],[href$=".png"],[href$=".PNG"],[href$=".gif"],[href$=".GIF"]');
a_img.each(function(i){ 
    if (0){
		this.innerHTML = '<img src="'+this.href+'" class="embedded_image" border="0" onerror="this.parentNode.innerHTML = this.src" />';
    }else{
        // 防盗链破解
        var url = this.href,
            frameid = 'frameimg' + Math.random(),
            imgRandom = 0?Math.random():'',
            e = $(this);
		var html = ('<script>var iframeImg'+i+' = \'<img width="100%" id="img" src="'+url+'?'+imgRandom+'" onerror="parent.document.getElementById(\\\''+frameid+'\\\').parentNode.innerHTML = \\\''+url+'\\\'; " />'+
          '<script>window.onload = function() { parent.document.getElementById("'+frameid+'").height = document.getElementById("img").height+"px"; document.body.style.margin=0; };<\'+\'/script>\';'+
          ';</script>');
        e.html(html);
      
      // 必须分开，先执行js
      var iframeHtml = '<iframe id="'+frameid+'" src="javascript:parent.iframeImg'+i+';" frameBorder="0" scrolling="no" width="100%"></iframe>';
      e.append(iframeHtml);
    }
});
console.log('转换为图片的数量：' + a_img.length);

	
function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}
	
	
console.log('完成');
	
