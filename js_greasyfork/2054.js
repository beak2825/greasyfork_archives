// ==UserScript==
// @name           Change Background Color
// @namespace      Change Background Color
// @description    A brief description of your script
// @author         RGB
// @include        *.*
// @version        1.1
// @downloadURL https://update.greasyfork.org/scripts/2054/Change%20Background%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/2054/Change%20Background%20Color.meta.js
// ==/UserScript==
/*这是一个可以真正改变网页背景颜色的js脚本,这个脚本只改变网页中背景为白色(你也可以定义其他颜色)的部分
 */


(function() {
    // your page initialization code here
    // the DOM will be available here

    var Gr1 = 240; //RGB中的R值...当网页的背景颜色的rgb值分别大于Gr1,Gg1,Gb1时此脚本将把颜色改成目标颜色color
    var Gg1 = 240; //RGB中的G值
    var Gb1 = 240; //RGB中的B值
    var color = "#CDC9C9" //改变后的背景颜色,默认值为网上那个所谓的眼科专家说的对眼睛最好的颜色
    // var color = "#bed6c1"

    //**********以下代码用户无需修改***********//
    var Gr, Gg, Gb; //全局变量记录当前标签的rgb值,用于比较

    //以下函数用于分解获取的"rgb(255, 255, 255)"格式的rgb
    function FGrgb(Grgb) {

        var kaisi = Grgb.indexOf(",");
        Gr = parseInt(Grgb.slice(4, kaisi));

        var kaisi1 = Grgb.indexOf(",", kaisi + 1);
        Gg = parseInt(Grgb.slice(kaisi + 1, kaisi1));

        Gb = parseInt(Grgb.slice(kaisi1 + 1, Grgb.length - 1));

        //alert(Gr+"|"+Gb+"|"+Gg);
    }


    var Lcolor = ""; //用于记录网页中获取的背景颜色
    //获取并修改body的背景颜色.
    Lcolor = document.defaultView.getComputedStyle(document.body, "").getPropertyValue("background-Color");
    FGrgb(Lcolor);

    if ((Gr > Gr1 && Gg > Gg1 && Gb > Gb1) || Lcolor == "transparent") //transparent表示透明
    {
        document.body.style.backgroundColor = color;
    }

    //获取并修改所有标签的背景颜色
    var alltags = document.getElementsByTagName("*");

    for (let x in alltags) {
        try {
            Lcolor = document.defaultView.getComputedStyle(alltags[x], "").getPropertyValue("background-Color");
        } catch (err) {
            //console.log(x);
            //console.log(alltags[x]);
        }
        FGrgb(Lcolor);
        if (Gr > Gr1 && Gg > Gg1 && Gb > Gb1) {
            alltags[x].style.backgroundColor = color;
        }
    }
})();