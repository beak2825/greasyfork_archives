// ==UserScript==
// @name        玛莎多拉虎穴反和谐
// @version      0.1
// @description     直接替换掉原来的r18mask图片
// @match        http://toranoana.masadora.jp/*
//@require        http://code.jquery.com/jquery-1.11.0.min.js
// @namespace https://greasyfork.org/users/139007
// @downloadURL https://update.greasyfork.org/scripts/31234/%E7%8E%9B%E8%8E%8E%E5%A4%9A%E6%8B%89%E8%99%8E%E7%A9%B4%E5%8F%8D%E5%92%8C%E8%B0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/31234/%E7%8E%9B%E8%8E%8E%E5%A4%9A%E6%8B%89%E8%99%8E%E7%A9%B4%E5%8F%8D%E5%92%8C%E8%B0%90.meta.js
// ==/UserScript==

$(setInterval(function(){
        var a=$("img[src*='r18-mask.jpg']");
        //alert(a.parent().attr("href"));
        a.each(function(){
            var str=$(this).parent().attr("href");
            var patt_article=/article\/.*_popup[0-9]\.html/;
            var patt_menu=/article\/.*\/[0-9]+\.htm/;

            
            if(patt_article.test(str)){
                //alert("article");
                result=String(patt_article.exec(str));
                result=result.replace(/article/,"http://img.toranoana.jp/popup_img18");
                result=result.replace(/_popup/,"-");
                result=result.replace(/.html/,"p.jpg");
                //alert(result);
                $(this).attr("src",result);
            }
            else if(patt_menu.test(str)){
                //alert("menu");
                result=String(patt_menu.exec(str));
                //alert(result);
                result=result.replace(/article/,"http://img.toranoana.jp/popup_img18");
                result=result.replace(/\.htm/,"-1p.jpg");
                $(this).attr("src",result);
                //alert(result);
            }
        });

    //alert("script over");
},200));