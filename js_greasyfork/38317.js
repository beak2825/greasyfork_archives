// ==UserScript==
// @name         xoa gia
// @version      2.8.9
// @description  make life easier
// @author       P
// @include      https://www3.chotot.com/*
// @exclude      https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=other_projects
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/110837
// @downloadURL https://update.greasyfork.org/scripts/38317/xoa%20gia.user.js
// @updateURL https://update.greasyfork.org/scripts/38317/xoa%20gia.meta.js
// ==/UserScript==


var soad= document.getElementsByName("price").length;
var soad2= document.getElementsByName("area").length;

var gia1,gia2,gia3,tt1,tt2,tt3;

switch(soad2)
{
    case 1:
        gia1=document.getElementsByName("price")[0].value;
        /* event listener */
        document.getElementsByName("category_group")[0].addEventListener('change', doThing1);
        /* function */
        function doThing1()
        {
            document.getElementsByName("price")[0].value=gia1;
        }
        break;
        //////////////////////////////////////////////////////////////
    case 2:
        gia1=document.getElementsByName("price")[0].value;
        gia2=document.getElementsByName("price")[1].value;
        /* event listener */
        document.getElementsByName("category_group")[0].addEventListener('change', doThing1);
        /* function */
        function doThing1()
        {
            document.getElementsByName("price")[0].value=gia1;
        }
        /* event listener */
        document.getElementsByName("category_group")[1].addEventListener('change', doThing2);
        /* function */
        function doThing2()
        {
            document.getElementsByName("price")[1].value=gia2;
        }
        break;
        /////////////////////////////////////////////////////////////
    case 3:
        gia1=document.getElementsByName("price")[0].value;
        gia2=document.getElementsByName("price")[1].value;
        gia3=document.getElementsByName("price")[2].value;
        /* event listener */
        document.getElementsByName("category_group")[0].addEventListener('change', doThing1);
        /* function */
        function doThing1()
        {
            document.getElementsByName("price")[0].value=gia1;
        }
        /* event listener */
        document.getElementsByName("category_group")[1].addEventListener('change', doThing2);
        /* function */
        function doThing2()
        {
            document.getElementsByName("price")[1].value=gia2;
        }
        /* event listener */
        document.getElementsByName("category_group")[2].addEventListener('change', doThing3);
        /* function */
        function doThing3()
        {
            document.getElementsByName("price")[2].value=gia3;
        }
        break;
}
switch(soad2)
{
    case 1:
        tt1=document.getElementsByName("area")[0].value;
        /* event listener */
        document.getElementsByName("category_group")[0].addEventListener('change', doThing4);
        /* function */
        function doThing4()
        {
            document.getElementsByName("area")[0].value=tt1;
        }
        break;
        //////////////////////////////////////////////////////////////
    case 2:
        tt1=document.getElementsByName("area")[0].value;
        tt2=document.getElementsByName("area")[1].value;
        /* event listener */
        document.getElementsByName("category_group")[0].addEventListener('change', doThing5);
        /* function */
        function doThing5()
        {
            document.getElementsByName("area")[0].value=tt1;
        }
        /* event listener */
        document.getElementsByName("category_group")[1].addEventListener('change', doThing2);
        /* function */
        function doThing2()
        {
            document.getElementsByName("area")[1].value=tt2;
        }
        break;
        /////////////////////////////////////////////////////////////
    case 3:
        tt1=document.getElementsByName("area")[0].value;
        tt2=document.getElementsByName("area")[1].value;
        tt3=document.getElementsByName("area")[2].value;
        /* event listener */
        document.getElementsByName("category_group")[0].addEventListener('change', doThing6);
        /* function */
        function doThing6()
        {
            document.getElementsByName("area")[0].value=tt1;
        }
        /* event listener */
        document.getElementsByName("category_group")[1].addEventListener('change', doThing2);
        /* function */
        function doThing2()
        {
            document.getElementsByName("area")[1].value=tt2;
        }
        /* event listener */
        document.getElementsByName("category_group")[2].addEventListener('change', doThing3);
        /* function */
        function doThing3()
        {
            document.getElementsByName("area")[2].value=tt3;
        }
        break;
}

var i=0;
while(i<soad)
{
    var gia_text= document.getElementsByName("price")[i].value;
    var gia_so = gia_text.replace(/\s/g, "");
    if(gia_so<=2000)
    {
        document.getElementsByName("price")[i].value="";
    }
    i++;
}


