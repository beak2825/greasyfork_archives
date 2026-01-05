// ==UserScript==
// @name         IGXE自动搜索挂刀
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Lance.Liu
// @match        http://www.igxe.cn/category*
// @match        http://www.igxe.cn/productlist*
// @match        http://www.igxe.cn/search*
// @match        http://www.igxe.cn/product/activity*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20940/IGXE%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E6%8C%82%E5%88%80.user.js
// @updateURL https://update.greasyfork.org/scripts/20940/IGXE%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E6%8C%82%E5%88%80.meta.js
// ==/UserScript==


item=document.getElementsByClassName('mod-hotEquipment');
bestprice=1;
var bestitem;
target=0.9;
var url = document.documentURI;
if(item.length>0)
{
    for (var m = 0; m < item.length; m++)
    {
        block= item[m].getElementsByClassName('mod-hotEquipment-bd')[0];
        s2=item[m].getElementsByClassName('s2');
        var rtag = /(<b>)(.*)(<\/b>)/;
        //alert('ok');
        if (url.indexOf("www.igxe.cn/product/activity") > -1)
        {
            rtag = /(<b>￥)(.*)(<\/b>)/;
        }
        steamPrice=rtag.exec(s2[0].innerHTML)[2];

        s3=item[m].getElementsByClassName('s3');
        // <strong>190.00</strong>
        var rtag = /(<strong>)(.*)(<\/strong>)/;
                if (url.indexOf("www.igxe.cn/product/activity") > -1)
        {
             rtag = /(<strong>￥)(.*)(<\/strong>)/;
        }
        igxePrice=rtag.exec(s3[0].innerHTML)[2];

        discount=Math.round(Number(igxePrice)/Number(steamPrice)*1.15*1000)/1000;

        if(discount<target)
        {
            block.innerHTML=block.innerHTML+"<div style='color:red'><strong>DISCOUNT: "+discount+"</strong></div>";
            item[m].setAttribute("style","background-color:black");
            if(bestprice>discount)
            {
                bestprice=discount;
                bestitem=item[m];
            }

        }
        else
        {
            block.innerHTML=block.innerHTML+"<div>DISCOUNT: "+discount+"</div>";
        }
    }
    if(bestprice==1)
    {
        ran=Math.round((Math.random()+0.5)*3000)/1000;
        alert('No suitable item, go to next page.');
        setTimeout( function(){
            next=document.getElementsByClassName('next')[0];
           // next=document.getElementsByClassName('prev')[0];
         //   next.click();
        }, ran*1000 );

    }
    else
    {
       // bestitem.focus(); 
       // bestitem=document.getElementsByClassName('mod-hotEquipment')[6];
       // alert(bestitem.innerHTML);
       // scrollTo(0,500);
       // bestitem.scrollIntoView(true);
        alert('THE BEST DISCOUNT:'+bestprice);
    }
}