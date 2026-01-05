// ==UserScript==
// @name          baidu-lite
// @namespace     http://userstyles.org
// @description	  优化百度搜索引擎的显示，去除无用的内容。
// @author        书记的马甲
// @include       http://baidu.com*
// @include       http://www.baidu.com*
// @homepage https://greasyfork.org/scripts/29581-baidu-lite/code/baidu-lite.user.js
// @include       https://www.baidu.com*
// @include       https://baidu.com*
// @run-at        document-end
// @require  https://greasyfork.org/scripts/29579-coffeescript/code/coffeescript.js?version=193297
// @require  https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @version       20170508.08
// @downloadURL https://update.greasyfork.org/scripts/29583/baidu-lite.user.js
// @updateURL https://update.greasyfork.org/scripts/29583/baidu-lite.meta.js
// ==/UserScript==


function evalCS(source) {
  // Compile source to Coffeescript (Array)
  var coffeescript = CoffeeScript.compile(source.toString()).split("\n");
  // Join and eval
  eval(coffeescript.join("\n"));
}

func = function() {
    if($('#__css__').length > 0){
        return;
    }
    var css = `
        #u_sp, #u, #s_btn_wr {
               display: none !important;
        }
#head_wrapper .s-p-top {
visibility: hidden;
}
    `;
	var node = document.createElement("style");
	node.type = "text/css";
    node.id = '__css__';
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
    
    $('.c-container').css('margin', '20px 0');
};


func();


// Script Source
// -------------
evalCS(`
w = window.screen.width
h = window.screen.height
url = "https://unsplash.it/#{w}/#{h}/?random"

$ ->
    # 搜索页面，不要使用，加速
    if location.href.indexOf('https://www.baidu.com/s') == -1
         $('#head').css('background', "url(#{url}) fixed center center no-repeat")

    setInterval(func, 100);
`);