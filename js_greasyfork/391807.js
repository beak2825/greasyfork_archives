// ==UserScript==
// @name           一拳动漫
// @namespace      HuYu
// @version        2019.11.01
// @description    一拳动漫。
// @author         HuYu
// @match          *://www.1manhua.net/*
// @require http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391807/%E4%B8%80%E6%8B%B3%E5%8A%A8%E6%BC%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/391807/%E4%B8%80%E6%8B%B3%E5%8A%A8%E6%BC%AB.meta.js
// ==/UserScript==

(function() {
	var newWindowHtmlOne = '<!DOCTYPE html PUBLIC"-//W3C//DTD XHTML 1.0 Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>整章观看</title><style type="text/css">.imgdiv{border:hidden;display:block}.imgdiv>img{vertical-align:text-bottom}.button{background:#eae0c2;background-image:-webkit-linear-gradient(top,#eae0c2,#ccc2a6);background-image:-moz-linear-gradient(top,#eae0c2,#ccc2a6);background-image:-ms-linear-gradient(top,#eae0c2,#ccc2a6);background-image:-o-linear-gradient(top,#eae0c2,#ccc2a6);background-image:linear-gradient(to bottom,#eae0c2,#ccc2a6);-webkit-border-radius:15;-moz-border-radius:15;border-radius:15px;text-shadow:0 1px 2px #fff;-webkit-box-shadow:0 1px 0 0 #1c1b18;-moz-box-shadow:0 1px 0 0 #1c1b18;box-shadow:0 1px 0 0 #1c1b18;font-family:Arial;color:#31312f;font-size:16px;padding:12px 30px 12px 30px;border:solid #333029 2px;text-decoration:none}.button:hover{color:#31312f;background:#ccc2a6;text-decoration:none}</style></head><body style="text-align:center"><div><div class="button">第<span>1</span>种</div><div class="button">第<span>2</span>种</div></div><div id="imgContainer"style="width:80%;margin:0 auto">';
    var newWindowHtmlTwo = '</div></body></html>';

    var bindClickFunc = function()
	{
		var itemAs = $(".cVolList .cVolUl .l_s");
		itemAs.click(function(e){
            e.preventDefault();
			var href = $(this).prop("href");
			var baseUrl = href;

			//获取原始页信息，解析总页数
			var originalHtmlString = getOriginalHtml(href);
			var originalHtml = $(originalHtmlString);
			var totalNumber = getTotalNumer(originalHtml);
            var hdDomain = getHdDomain(originalHtml);

			//获取页面的图片地址
			var srcArr = getImageSrcArr(totalNumber, baseUrl);

			var imageHtmlString = getImageHtmlString(srcArr, hdDomain);

			//打开一个窗口
			var newWindow=window.open('', '_blank');
			var newDocument = newWindow.document;

            newDocument.write(newWindowHtmlOne+imageHtmlString+newWindowHtmlTwo);
			newDocument.close();
            newWindow.focus();

            return false;
		});
	}

	/**
	 * 获取text原始页面
	 * @param  地址
	 * @return html
	 */
	var getOriginalHtml = function(hrefString){
		var htmlString = $.ajax({
			url: hrefString,
			type: "get",
  			async: false
 		}).responseText;

 		return htmlString;
	}

	/**
	 * 从html中获取总页数
	 * @param  html的页面
	 * @return 总页数
	 */
	var getTotalNumer = function(originalHtml){
		var totalNumber = $("#hdPageCount",originalHtml).val();
		return parseInt(totalNumber);
	}

    var getHdDomain = function(originalHtml){
		var hdDomainString = $("#hdDomain",originalHtml).val();
        var hdDomains = hdDomainString.split("|");
		return hdDomains[1];
	}

	/**
	 * 获取图片地址
	 * @param  {[type]} originalHtml [description]
	 * @return {[type]}              [description]
	 */
	var getImgSrc = function(originalHtml){
		var imgSrc = $("#hdNextImg",originalHtml).prev("img").prop("name");
		return imgSrc;
	}

	/**
	 * 获取图片地址数组
	 * @param  {[type]} totalNumber [description]
	 * @param  {[type]} baseUrl     [description]
	 * @param  {[type]} srcArr      [description]
	 * @return {[type]}             [description]
	 */
	var getImageSrcArr = function(totalNumber, baseUrl){
        var srcArr = new Array();
		for(var i = 1; i <= totalNumber; i++){
			var url = baseUrl.replace("1.html", i+".html");
			var originalHtmlString = getOriginalHtml(url);
			srcArr.push(getImgSrc($(originalHtmlString)));
    	}

    	return srcArr;
	}

	/**
	 * 构造image的div
	 * @param  {[type]} srcArr [description]
	 * @return {[type]}        [description]
	 */
	var getImageHtmlString = function(srcArr, hdDomain){
		var imageHtmlString = "";
		$.each( srcArr, function(i, n){
			imageHtmlString += "<div class=\"imgdiv\"><img src=\""+hdDomain+unsuan(n)+"\"></div>";
		});
		return imageHtmlString;
	}

    function unsuan(s) {
        var sw = "hhmmoo.com|hhssee.com|hhaauu.com|hheehh.com|hheess.com|125084.com|aaxxee.com|jojohh.com|aannhh.com|yiquanmh.com|1manhua.net";
        var su = location.hostname.toLowerCase();
        var b = false;
        for (var i = 0; i < sw.split("|").length; i++) {
            if (su.indexOf(sw.split("|")[i]) > -1) {
                b = true;
                break
            }
        }
        if (!b) return "";
        //x s的最后一位
        var x = s.substring(s.length - 1);
        var w = "abcdefghijklmnopqrstuvwxyz";
        //xi 字母中的排序
        var  xi = w.indexOf(x) + 1;
        var sk = s.substring(s.length - xi - 12, s.length - xi - 1);
        s = s.substring(0, s.length - xi - 12);
        var k = sk.substring(0, sk.length - 1);
        var f = sk.substring(sk.length - 1);
        for (i = 0; i < k.length; i++) {
            eval("s=s.replace(/" + k.substring(i, i + 1) + "/g,'" + i + "')")
        }
        var ss = s.split(f);
        s = "";
        for (i = 0; i < ss.length; i++) {
            s += String.fromCharCode(ss[i])
        }
        return s
    }

    bindClickFunc();
})();
