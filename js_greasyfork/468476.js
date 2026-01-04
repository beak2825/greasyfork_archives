// ==UserScript==
// @name        花纹灰背景优化-0612
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match       http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468476/%E8%8A%B1%E7%BA%B9%E7%81%B0%E8%83%8C%E6%99%AF%E4%BC%98%E5%8C%96-0612.user.js
// @updateURL https://update.greasyfork.org/scripts/468476/%E8%8A%B1%E7%BA%B9%E7%81%B0%E8%83%8C%E6%99%AF%E4%BC%98%E5%8C%96-0612.meta.js
// ==/UserScript==
(function() {

    var Gr1 = 240; //RGB中的R值...当网页的背景颜色的rgb值分别大于Gr1,Gg1,Gb1时此脚本将把颜色改成目标颜色color
    var Gg1 = 240; //RGB中的G值
    var Gb1 = 240; //RGB中的B值
    var color = "rgba(255,255,255,0.4) " //改变后的背景颜色 #ccecc8 rgba(206,234,202,0.25)  #F2F2F2
    //**********以下代码用户无需修改***********//
    var Gr, Gg, Gb; //全局变量记录当前标签的rgb值,用于比较
    //以下函数用于分解获取的"rgb(255, 255, 255)"格式的rgb

    function FGrgb(Grgb) {
        Grgb = Grgb.replace(/[rgba\(\)]/g, '');
        var kaisi = Grgb.split(",");
        if (kaisi < 3) return;
        Gr = parseInt(kaisi[0]);
        Gg = parseInt(kaisi[1]);
        Gb = parseInt(kaisi[2]);
        //alert(Gr+"|"+Gb+"|"+Gg);
    }


    var Lcolor = ""; //用于记录网页中获取的背景颜色
    //获取并修改body的背景颜色.


    try {
        Lcolor = document.defaultView.getComputedStyle(document.body, "").getPropertyValue("background-Color");
    } catch (e) {
        return;
    }

    FGrgb(Lcolor);

    if ((Gr > Gr1 && Gg > Gg1 && Gb > Gb1) || Lcolor == "transparent" || Gr == 0 && Gg == 0 && Gb == 0) //transparent表示透明
    {
        document.body.style.backgroundColor = color;
    }

    changeAllElementsColor();

    fixAutoPage();


    function changeAllElementsColor() {
        //获取并修改所有标签的背景颜色
        var alltags = document.getElementsByTagName("*");
        var len = alltags.length;
        for (var i = 0; i < len; i++) {

            if (alltags[i].style.backgroundColor == color) {
                continue;
            }

            Lcolor = document.defaultView.getComputedStyle(alltags[i], "").getPropertyValue("background-Color");
            FGrgb(Lcolor);
            if (Gr > Gr1 && Gg > Gg1 && Gb > Gb1) {
                alltags[i].style.backgroundColor = color;
            }
        }
    }

    function fixAutoPage() {
        var _bodyHeight = document.body.clientHeight;
        // 创建观察者对象
        var observer = new window.MutationObserver(function(mutations) {
            if (mutations[0].addedNodes) {
                if (document.body.clientHeight > _bodyHeight) {

                    // console.log("--------addedNodes---------");

                    setTimeout(function() {
                        changeAllElementsColor();
                    }, 200);

                    _bodyHeight = document.body.clientHeight;
                }
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

})();



  /* 一些样式 */
  const style = document.createElement('style');
  style.innerHTML =`
html,body,div.Card.TopstoryItem.TopstoryItem-isRecommend,div.Card.TopstoryItem.TopstoryItem-isFollow{
background:url( https://s1.ax1x.com/2020/10/08/0ws8XT.png) fixed  !important;blur(5px)); // https://www.weistang.com/template/default/images/background.png https://s1.ax1x.com/2020/10/08/0ws8XT.png
  }
  .header,p,.article{
    background-color: rgba(255,255,255,.3)!important;
	 background-attachment: fixed!important;
    backdrop-filter:saturate(150%) blur(20px)!important;//saturate(180%) blur(20px)
}
  `;
  document.head.appendChild(style);