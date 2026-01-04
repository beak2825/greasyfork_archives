// ==UserScript==
// @name         Bitcointalk found Mastenode coin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Get all mn coins
// @author       Lxgn
// @match        https://bitcointalk.org/index.php?board=159*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370512/Bitcointalk%20found%20Mastenode%20coin.user.js
// @updateURL https://update.greasyfork.org/scripts/370512/Bitcointalk%20found%20Mastenode%20coin.meta.js
// ==/UserScript==

var len = 0;
var i = 0;
var x = '';
var y = '';
var z = '';
var t = '';
var t2 = '';
var t3 = '';
var pos = '';
var max_num = 0;
var next_page = '';

var next_page_timeout = Math.round(Math.random()*5000)+2000;
console.log('next_page: '+next_page_timeout);

window.onload = function()
{
    al_get_msg();
    get_nav_pages();
    //setInterval(go_to_nex_page,1000);
    setTimeout(go_to_nex_page,1000);
}

function go_to_nex_page()
{
    next_page_timeout -= 1000;
    console.log('timeout: '+next_page_timeout);
    if(next_page_timeout<0)
    {
        if(next_page!='')
        document.location.href = next_page;
        else
        {
            console.log('[stoped] This Last page');
            setTimeout(goto_one_page,3600*1000*3);
            //setTimeout(goto_one_page,5000);
        }
    }
    else
    setTimeout(go_to_nex_page,1000);
}
function goto_one_page()
{
    document.location.href = "https://bitcointalk.org/index.php?board=159.0";
}
function get_my_page()
{
t = document.location;
    t += '';
            pos = t.indexOf('?');

    t3 = t.substr(0,pos+1);
    t2 += t3;
                t = t.substr(pos+1);
//            console.log("[AL2] " + t);
            pos = t.indexOf('.');
    t3 = t.substr(0,pos+1);
    t2 += t3;
                t = t.substr(pos+1);
    console.log('t2='+t2);
    return t2;

}
function get_num(t)
{
    t += '';
    //alert(t);
            pos = t.indexOf('?');
            t = t.substr(pos+1);
//            console.log("[AL2] " + t);
            pos = t.indexOf('.');
            t = t.substr(pos+1);
//            console.log("[AL3] " + t);
    //alert(t);
    return t;
}
function get_nav_pages()
{
    var mypage = get_my_page();
    var flag = 1;
    var mynum = get_num(document.location);
    //alert(mynum);
    console.log('[AL_mynum]'+mynum);
    x = document.getElementsByTagName('a');
    len = x.length;
    console.log('[AL_x.len] '+len);
    for(i=0;i<len;i++)
    {
        y = x[i];

        if(y.className == 'navPages' && flag)
        {
            var num = y.innerText*1;
            if(isNaN(num))continue;
            //console.log("[AL_pages] " + num);
            //console.log("[AL] " + y.href);
            t = y.href;
            t = get_num(t);
            t *= 1;
            //console.log("[AL.t] " + t);
            if(t > mynum)
            {

                //console.log('this_num: '+num);


                if(num > max_num)max_num = num;
                console.log("[AL] next_page:  " + y.innerText +' '+ mypage+t);
                next_page = mypage+t;

                flag = 0;
            }
            //pos = t.indexOf('?');
            //t = t.substr(pos+1);
            //console.log("[AL2] " + t);
            //pos = t.indexOf('.');
            //t = t.substr(pos+1);
            //console.log("[AL3] " + t);
        }
    }
    console.log('max_num = '+max_num);
}

function al_get_msg()
{
    x = document.getElementById('al_div2');
    x.innerHTML = document.location;
    x = document.getElementsByTagName('span');
    z = document.getElementById('al_tarea');

    len = x.length;
    //alert(len);
    for(i=0;i<len;i++)
    {
        y = x[i];
        t = y.id;
        //if(t)alert(t);
        t2 = t.substr(0,4);

        if(t2=="msg_")
        {
            //alert(y.childNodes.length);
            t4 = y.childNodes[0];
            //alert(t4.href);
            t3 = y.innerText;
            z.value += t+'|'+t4.href+'|'+t3+'\n';

            //for (var i = 0; i < document.body.childNodes.length; i++)
            {
            //alert( document.body.childNodes[i] ); // Text, DIV, Text, UL, ..., SCRIPT
            }
        }
            ///alert(t);
    }
    al_aform.submit();
}
//alert('hello people');
x = document.getElementById('bodyarea');
//x.innerHTML = ''

    var aform = document.createElement("form");
        aform.setAttribute("action", "https://bitradio.liksagen.com/bitcointalk/");
        aform.setAttribute("method", "POST");
        aform.setAttribute("target", "al_ifrm");
        aform.setAttribute("id", "al_aform");
        aform.setAttribute("name", "al_aform");
        aform.style.width = "100%";
        aform.style.height = "480px";

    var tarea = document.createElement("textarea");
        tarea.setAttribute("id", "al_tarea");
        tarea.setAttribute("name", "al_tarea");
        tarea.style.width = "100%";
        tarea.style.height = "480px";

    var div = document.createElement("div");
        div.setAttribute("id", "al_div");
        div.setAttribute("name", "al_div");
        div.style.width = "100%";
        div.style.height = "480px";

    var div2 = document.createElement("div");
        div2.setAttribute("id", "al_div2");
        div2.setAttribute("name", "al_div2");
        div2.style.width = "100%";




    var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "https://bitradio.liksagen.com/bitcointalk");
        //ifrm.setAttribute("src", "about:blank");
        ifrm.setAttribute("id", "al_ifrm");
        ifrm.setAttribute("name", "al_ifrm");
        ifrm.style.width = "100%";
        ifrm.style.height = "480px";

    var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("id", "al_btn");
        btn.setAttribute("name", "al_btn");
        btn.setAttribute("value", "al_btn");


x.appendChild(btn);
x.appendChild(div2);
x.appendChild(aform);
aform.appendChild(tarea);
x.appendChild(div);
div.appendChild(ifrm);

x = document.getElementById('al_btn');
x.onclick = function()
{
    var y = document.getElementById('al_aform');
    //var txt = "<iframe src=https://bitradio.liksagen.com/></iframe>" ;
    y.submit();
    //alert(y.innerHTML);
    //y.src = "http://bitradio.liksagen.com/";
    //alert(y.src);
}
//x.value = 'xxx';
//x.click();