// ==UserScript==
// @name         秀人集竖屏浏览
// @version      0.0.3.2
// @description  秀人集画廊页读取所有图片
// @author       lin
// @match        *://*.123783.xyz/*/*.html
// @match        *://xr9.uunn.bf/*/*.html
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @namespace    greasyfork
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494883/%E7%A7%80%E4%BA%BA%E9%9B%86%E7%AB%96%E5%B1%8F%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/494883/%E7%A7%80%E4%BA%BA%E9%9B%86%E7%AB%96%E5%B1%8F%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==
(function () {
    let max = $(".page a")[$(".page a").length - 2].text * 1 - 1;
    let title = $("h1").text();
    $("h1").text("start");
    let imgs = [];
    let cont = null;
    let temp = $(".content img");
    for(let j = 0; j < temp.length; j++) {
        imgs.push(temp[j].src)
    }
    let url = window.location.href.split(".html")[0];
    let goX = function(a, b, c, d) {
        console.log(c + "-" + d);
        $("h1").text(c + "-" + d);
        //document.title = c + "-" + d;
        $.get(url + "_" + c + ".html", function(e) {
            let jj = $(e);
            let jjj = jj.find(".content img");
            for(let j = 0; j < jjj.length; j++) {
                b.push(jjj[j].src)
            }
            if(c < d) {
                c++;
                goX(a, b, c, d)
            } else {
                console.log("end");
                //document.title = title;
                $("body").empty();
                cont = $("<div style='text-aign:center;margin:auto;width:100%;'></div>");
                $("body").append(cont);
                b.forEach(function(e) {
                    cont.append($("<img style='width:100%;' src='" + e + "' >"))
                });
                cont.append($("<br>"));
            }
        })
    }
    goX(url, imgs, 1, max);
})();
