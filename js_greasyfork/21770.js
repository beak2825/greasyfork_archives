// ==UserScript==
// @name           Set Background Color
// @namespace      SetBackgroundColor
// @description    A brief description of your script
// @author         RGB
// @include        *.*
// @version        2.1
// @downloadURL https://update.greasyfork.org/scripts/21770/Set%20Background%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/21770/Set%20Background%20Color.meta.js
// ==/UserScript==
/*这是一个可以真正改变网页背景颜色的js脚本,这个脚本只改变网页中背景为白色(你也可以定义其他颜色)的部分
*/

var Gr1=250;  //RGB中的R值...当网页的背景颜色的rgb值分别大于Gr1,Gg1,Gb1时此脚本将把颜色改成目标颜色color
var Gg1=250;  //RGB中的G值
var Gb1=250;  //RGB中的B值
var Gu0=250;  //лимит яркости
var color="#fafafa";  //改变后的背景颜色,默认值为网上那个所谓的眼科专家说的对眼睛最好的颜色

//**********以下代码用户无需修改***********//
var Gr,Gg,Gb,Ga;        //全局变量记录当前标签的rgb值,用于比较

        //以下函数用于分解获取的"rgb(255, 255, 255)"格式的rgb
        // или "rgba(255, 255, 255, 255)"
        function FGrgb(Grgb)
        {
            var hasAlfa = Grgb.indexOf("rgba") > -1;

            var kaisi=Grgb.indexOf(",");
            Gr=parseInt(Grgb.slice(hasAlfa ? 5 : 4,kaisi));

            var kaisi1=Grgb.indexOf(",",kaisi+1);
            Gg=parseInt(Grgb.slice(kaisi+1,kaisi1));

            var kaisi2 = Grgb.indexOf(",",kaisi1+1);
            Gb=parseInt(Grgb.slice(kaisi1+1,kaisi2));

            Ga=parseInt(Grgb.slice(kaisi2+1,Grgb.length-1));
        }


var Lcolor=""; //用于记录网页中获取的背景颜色
//获取并修改body的背景颜色.
Lcolor=document.defaultView.getComputedStyle(document.body, "").getPropertyValue("background-Color");
FGrgb(Lcolor);

if (((Gr+Gg+Gb)/3>Gu0) || Ga === 0 || Lcolor=="transparent") //transparent表示透明
{
        document.body.style.backgroundColor=color;
}

//获取并修改所有标签的背景颜色
var alltags = document.getElementsByTagName("*");

for (var x in alltags)
{
        Lcolor = document.defaultView.getComputedStyle(alltags[x], "").getPropertyValue("background-Color");
        FGrgb(Lcolor);
        if ((Gr+Gg+Gb)/3>Gu0)
        {
                alltags[x].style.backgroundColor = color;
        }
}