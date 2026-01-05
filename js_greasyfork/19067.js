// ==UserScript==
// @name       LTF :: Le Truc de Fang
// @version    1.1
// @description  list builder with t-raid.net for french servers
// @copyright  2014+, Fangstergangsta-Drazh - OoO-PGM
// @include        http://*.travian.*/build.php?gid=16&tt=99&action=showSlot*
// @include        http://t-raid.net/recherche-inactifs.php*
// @namespace https://greasyfork.org/users/40192
// @downloadURL https://update.greasyfork.org/scripts/19067/LTF%20%3A%3A%20Le%20Truc%20de%20Fang.user.js
// @updateURL https://update.greasyfork.org/scripts/19067/LTF%20%3A%3A%20Le%20Truc%20de%20Fang.meta.js
// ==/UserScript==
function strstr(haystack, needle, bool) 
{
    var pos = 0;
    
    haystack += '';
    pos = haystack.indexOf(needle);
    if (pos == -1) {
        return false;
    } else {
        if (bool) {
            return haystack.substr(0, pos);
        } else {
            return haystack.slice(pos);
        }
    }
}
function openWithPostData(coordx, coordy, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, key, lid)
{
    server = window.location.host;
    if (document.getElementById('t3').disabled != true && document.getElementById('t4').disabled == true)
    	var data = "a="+key+"&sort=distance&direction=asc&lid="+lid+"&x="+coordx+"&y="+coordy+"&target_id=&t1="+t1+"&t2="+t2+"&t3="+t3+"&t5="+t5+"&t6="+t6+"&t7="+t7+"&t8="+t8+"&t9="+t9+"&t10="+t10+"&action=addSlot&save=sauvegarder";
    else if (document.getElementById('t4').disabled != true && document.getElementById('t3').disabled == true)
        var data = "a="+key+"&sort=distance&direction=asc&lid="+lid+"&x="+coordx+"&y="+coordy+"&target_id=&t1="+t1+"&t2="+t2+"&t4="+t4+"&t5="+t5+"&t6="+t6+"&t7="+t7+"&t8="+t8+"&t9="+t9+"&t10="+t10+"&action=addSlot&save=sauvegarder";
    var url = "http://"+server+"/build.php?gid=16&tt=99";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && (xhttp.status == 200 || xhttp.status == 0)) {
            window.location.reload(true);
        }
    };
    data = encodeURI(data);
    
    xhttp.open("POST", url, false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
    xhttp.send(data);
    return xhttp.responseText;
    
}

if (document.location.href == "http://t-raid.net/recherche-inactifs.php#recherche")
{
    nb = 1;
    var div = document.body;
    var input2 = document.createElement("textarea");
    input2.name = "textcoords";
    input2.id = "textcoords";
    input2.cols = "90";
    input2.rows = "20";
    div.appendChild(input2);
    
    while (document.getElementsByTagName('table')[0].getElementsByTagName('tr')[nb].cells[4].innerHTML != "")
    {
        coo = document.getElementsByTagName('table')[0].getElementsByTagName('tr')[nb].cells[4].innerHTML;
        coo = coo.split('(');
        coo = coo[1].split(')');
        coo = coo[0];
        document.getElementById("textcoords").value += "["+coo+"]";
        
        nb++;    
    }
}

var div = document.getElementById("build");

var input3 = document.createElement("input");
input3.type = "button";
input3.name = "subcoords";
input3.id = "subcoords";
input3.value = "GO!!!";
div.appendChild(input3);


var input = document.createElement("textarea");
input.name = "coords";
input.id = "coords";
input.cols = "90";
input.rows = "20";
div.appendChild(input);

function subsub(){
    coord = document.getElementById('coords').value;
    t1 = document.getElementById('t1').value;
    t2 = document.getElementById('t2').value;
    t3 = document.getElementById('t3').value;
    t4 = document.getElementById('t4').value;
    t5 = document.getElementById('t5').value;
    t6 = document.getElementById('t6').value;
    t7 = document.getElementById('t7').value;
    t8 = document.getElementById('t8').value;
    t9 = document.getElementById('t9').value;
    t10 = document.getElementById('t10').value;
    key = document.getElementsByName("a")[0].value;
    lid = document.getElementsByName("lid")[0].value;
    test = strstr(coord, ']');
    test = strstr(test, '[');
    
    GM_setValue("coorddd", test);
    GM_setValue("t1", t1);
    GM_setValue("t2", t2);
    if (document.getElementById('t3').disabled != true && document.getElementById('t4').disabled == true)
    	GM_setValue("t3", t3);
    else if (document.getElementById('t4').disabled != true && document.getElementById('t3').disabled == true)
        GM_setValue("t4", t4);
    GM_setValue("t5", t5);
    GM_setValue("t6", t6);
    GM_setValue("t7", t7);
    GM_setValue("t8", t8);
    GM_setValue("t9", t9);
    GM_setValue("t10", t10);
    var result = coord.match(/\[(-?[0-9]+)\|(-?[0-9]+)\]/g);                        
    
    var res = /\[(-?[0-9]+)\|(-?[0-9]+)\]/.exec(result[0]);
    
    x = res[1];
    y = res[2];
    
    openWithPostData(x, y, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, key, lid);  
}

if (typeof(GM_getValue("coorddd", '0')) != 'undefined' || GM_getValue("coorddd", '0') != '' || GM_getValue("coorddd", '0') != '0' || GM_getValue("coorddd", '0') != 'false')
{
    document.getElementById('coords').value = GM_getValue("coorddd", '');
    document.getElementsByName('t1')[0].value = GM_getValue("t1", '0');
    document.getElementsByName('t2')[0].value = GM_getValue("t2", '0');
    if (document.getElementById('t3').disabled != true && document.getElementById('t4').disabled == true)
        document.getElementsByName('t3')[0].value = GM_getValue("t3", '0');
    else if (document.getElementById('t4').disabled != true && document.getElementById('t3').disabled == true)
        document.getElementsByName('t4')[0].value = GM_getValue("t4", '0');
    document.getElementsByName('t5')[0].value = GM_getValue("t5", '0');
    document.getElementsByName('t6')[0].value = GM_getValue("t6", '0');
    document.getElementsByName('t7')[0].value = GM_getValue("t7", '0');
    document.getElementsByName('t8')[0].value = GM_getValue("t8", '0');
    document.getElementsByName('t9')[0].value = GM_getValue("t9", '0');
    document.getElementsByName('t10')[0].value = GM_getValue("t10", '0');
    GM_deleteValue("coorddd");
    rand = Math.floor((Math.random()*2500+5000));
    setTimeout(subsub, rand);
}
document.getElementById('subcoords').onclick = subsub;
