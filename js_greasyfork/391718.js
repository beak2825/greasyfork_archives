// ==UserScript==
// @name         Hungarian Players Leaderboard
// @namespace    munzeeHun
// @version      0.5
// @author       CzPeet
// @match        https://www.munzee.com/*
// @match        https://www.munzee.com/leaderboard/players/all/total?*
// @grant        none
// @description  Magyar játékosok ranglistája
// @update       https://greasyfork.org/en/scripts/391718-hungarian-players-leaderboard
// @downloadURL https://update.greasyfork.org/scripts/391718/Hungarian%20Players%20Leaderboard.user.js
// @updateURL https://update.greasyfork.org/scripts/391718/Hungarian%20Players%20Leaderboard.meta.js
// ==/UserScript==

//players
var p = "416c6570685269746140616c65786d657374657240616c6661626f6f74697340616e61323640616e6472657769644061726b616e6779616c4041747469734042616c617a7338304042616d6275737a6e61644042656e637573303540426761626f7240424d4d404272656b69404254616d617340437a506565744063736d61726b7573406461766964303340646965676f48554e4064697665726d61746540456e656640655469676572406661626975737a40666572693630406667797572696b61353535404669646940666c616d696e676f373840466f6e7465406675726b65737a656b404761746973353040676f6c79616b724067726569736c6967654067726f7a736131314068616c61737a6b6972616c794068616c696e6461617474696c614069676e6f747573383740497073696373404a616b616247796f726779406a616c736f406a616e616875406b616e6761303231406b616e79617a6f6c74616e406b61726f6c796e616779406b6174696b613539404b697362696b613834404b6f6c6f7332303032404b7069737469404b756c6373404c61637a793736404c616c6c79404c616c6c7978404c656c6f3032406c65766532303032404c6f70616b6f64f3404c75696c7569406d61726b6f7669637361406d6173656a75406d61746f404d616167696b61404d6178696d696c69656e406d656c69637369406d6968756c404d697369406d6f62696c697479404d5345404e65746b616c6f7a404e6f726265653937406e796d617465404f6c6c65653135406f6c793131404f726c696b4070656d65746572656d65746540506572646974696f6e4070657265737a405047544070697479756c696e6f40706f636f6b31343440506f7a416b6f40706f7a6f6c69314052656e6348756e5340726966694052756d6c69407361676162694073636875636b407365656c653235303140736f6c646965727a736f6c7440537061726b73373240737a616269363940737a616b69636140737a61626f3131303840737a656765646940737a696d61726940737a697065746940737a7568693535407461736b613139383140746d737a696c76696140546f676f40546f6d636163686540746f6d6d6f62696c405472657a6f726b6140547572746c6546616e407479756b616e796f40556a6373694056656e657a69614076696b74726f40766976737a694056756373694057686973706572496e54686557696e64407a6665726b65405a6f6c696b613735407a736f6d626f727065746f";
var a = "756133337a374075613734677940756131646437407561346d356540756135386c39407561313979694075613279306b4075613331336940756132766b7940756133616c7a4075613279756d4075613433796a40756133327a7440756135776b39407561343469674075616c38394075613370387040756132786f35407561327a65704075613332647840756134617a3840756134377a6c407561316a733740756138716a6e4075613378613240756134323165407561333176364075617275354075613462657940756133303278407561376637754075613332317040756174326140756132786838407561737a6140756133713764407561336f3367407561323165324075613139706f407561336d396f4075613278623640756132307473407561337371614075613434326b407561376d656d407561327830394075613465723840756134367667407561326b6d6d40756132767a6340756135326636407561357a7933407561346d6933407561323237794075613270637140756133356e634075613232323540756136776764407561376f61384075613462736d40756133316d6440756133637163407561336a366640756132753474407561323330354075613278716c407561316f71624075613562677a4075613565326540756134696b7040756136366569407561336a6165407561316c6d374075613366633340756138316771407561346930354075613231363740756132326c6b4075613530344075613339736740756135777930407561323730624075613469777340756135656c304075613439643140756132663638406e6f617661407561337a6e6e40756134327973407561363832644075613338756140756133337672407561336161354075616c623240756131776a6e4075613332663540756136696d7240756137333232407561366c306e407561627265407561336937774075613231366b4075613179706940756132786e744075613132726340756133726433406e6f6176614075616c39314075613336743340756137313178";
var players = getList(p);
var av = getList(a);

//Menu
var listElements = ["Tegnap","Ma","Múlt Hét","Aktuális Hét","Múlt Hónap","Aktuális Hónap","Összes"];
var listRanges = [];

var topMenu = document.getElementsByClassName("nav navbar-nav navbar-right");

for (var i = 0; i<topMenu[0].children.length; i++)
{
    if (topMenu[0].children[i].innerHTML.includes("Leaderboards"))
    {
        var new_HR_LI_Item = document.createElement("HR");

        var new_Main_LI_Item = document.createElement("LI");
        new_Main_LI_Item.setAttribute("class", "dropdown-submenu");

        var new_A_Item = document.createElement("A");
        new_A_Item.href = "#";
        new_A_Item.innerText = "Magyarok";

        var new_Main_UL_Item = document.createElement("UL");
        new_Main_UL_Item.setAttribute("class", "dropdown-menu");
        new_Main_UL_Item.setAttribute("style", "top: 0");

        for (var l = 0; l<listElements.length; l++)
        {
            new_Main_UL_Item.appendChild(addNewElement(l,listElements[l]));
        }

        new_Main_LI_Item.appendChild(new_A_Item);
        new_Main_LI_Item.appendChild(new_Main_UL_Item);

        topMenu[0].children[i].children[1].insertBefore(new_HR_LI_Item,topMenu[0].children[i].children[1].children[1]);
        topMenu[0].children[i].children[1].insertBefore(new_Main_LI_Item,topMenu[0].children[i].children[1].children[1]);
    }
}

function addNewElement(id,txt)
{
    var new_LI_Item = document.createElement("LI");

    var new_A_Item = document.createElement("A");
    new_A_Item.href = "https://www.munzee.com/leaderboard/players/all/total?"+l;
    new_A_Item.innerText = txt;

    new_LI_Item.appendChild(new_A_Item);

    return new_LI_Item;
}

//Spec oldal
if (document.URL.includes("?"))
{
    var pageID = document.URL.split("?")[1];

    //Clean page
    var oldTables = document.getElementsByClassName("col-lg-4 col-xs-12");
    for (var t=oldTables.length-1; t>=0; t--)
    {
        oldTables[t].remove();
    }
    document.getElementById("dropdownMenu1").remove();
    document.body.innerHTML = document.body.innerHTML.replace("Category: All Points","Magyar Játékosok");

    //calc timeRanges
    addYesterdayRange();
    addTodayRange();
    addWeekRanges();
    addLastMonthRange();
    addCurrentMonthRange();
    addTotal();

    //create table
    createTable(pageID);
}

function formatDate(d)
{
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2)
    {
        month = '0' + month;
    }
    if (day.length < 2)
    {
        day = '0' + day;
    }

    return [year, month, day].join('-');
}

function addYesterdayRange()
{
    var d = new Date();
    d.setDate(d.getDate() - 1);
    listRanges.push(formatDate(d) + "#" + formatDate(d));
}

function addTodayRange()
{
    var d = new Date();
    listRanges.push(formatDate(d) + "#" + formatDate(d));
}

function addWeekRanges()
{
    var scw = new Date();
    var ecw = new Date();
    var slw = new Date();
    var elw = new Date();

    var d = scw.getDay();
    scw.setDate(scw.getDate()-(d-1));
    ecw.setDate(ecw.getDate()-(d-1)+6);

    slw.setDate(slw.getDate()-(d-1)-7);
    elw.setDate(elw.getDate()-(d-1)-7+6);

    listRanges.push(formatDate(slw) + "#" + formatDate(elw));
    listRanges.push(formatDate(scw) + "#" + formatDate(ecw));
}

function addLastMonthRange()
{
    var sd = new Date();
    sd.setDate(1);
    sd.setMonth(sd.getMonth()-1);

    var ed = new Date();
    ed.setDate(1);
    ed.setDate(ed.getDate()-1);

    listRanges.push(formatDate(sd) + "#" + formatDate(ed));
}

function addCurrentMonthRange()
{
    var sd = new Date();
    sd.setDate(1);
    var ed = new Date();
    ed.setDate(1);
    ed.setMonth(ed.getMonth()+1);
    ed.setDate(ed.getDate()-1);

    listRanges.push(formatDate(sd) + "#" + formatDate(ed));
}

function addTotal()
{
    listRanges.push("total");
}

function getList(h)
{
    var str = '';
    for (var i = 0; i < h.length; i += 2)
    {
        str += String.fromCharCode(parseInt(h.substr(i, 2), 16));
    }

    return str.split('@');
}

function createTable(i)
{
    var usernamePlace = 0;
    var header = "";
    var message = "";

    switch (i)
    {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
            var timeRanges = listRanges[i].split('#');
            header = "https://api.munzee.com/leaderboard/players/";
            message = 'data={"start":"'+timeRanges[0]+'","end":"'+timeRanges[1]+'","limit":666}&access_token=2NDLKfmAb6dZo3neaR482BbNf22aqIZP8FnCO09e';
            usernamePlace = 5;
            break;
        case "6":
        default:
            header = "https://api.munzee.com/leaderboard/players/overall";
            message = 'data={"limit":666}&access_token=2NDLKfmAb6dZo3neaR482BbNf22aqIZP8FnCO09e';
            usernamePlace = 7;
            break;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', header, true);
    xhttp.setRequestHeader("Accept", "*/*");
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

    xhttp.onload = function ()
    {
        //console.log(xhttp.responseText);
        var listString = xhttp.responseText.replace('{"data":[{','');
        var listM = listString.split('},{');

        for (var row=listM.length-1; row>=0; row--)
        {
            if (players.indexOf(listM[row].split('"')[usernamePlace]) == -1)
            {
                listM.splice(row,1);
            }
            else
            {
                listM[row] += ";"+(row+1);
            }
        }

        var div1 = document.createElement("DIV");
        div1.setAttribute("class","col-lg-12 col-xs-12");
        var div2 = document.createElement("DIV");
        div2.setAttribute("class","panel");
        var div3 = document.createElement("DIV");
        div3.setAttribute("class","panel-heading");
        var div4 = document.createElement("DIV");
        div4.setAttribute("data-toggle","tooltip");
        div4.setAttribute("data-placement","bottom");
        div4.setAttribute("data-original-title",listRanges[i]);
        var text1 = document.createTextNode(listElements[i]);

        var table1 = document.createElement("TABLE");
        table1.setAttribute("class","table");
        var tbody1 = document.createElement("TBODY");
        table1.appendChild(tbody1);

        for (row=0;row<listM.length; row++)
        {
            addRowToTBody(listM[row],tbody1,i);
        }

        div4.appendChild(text1);
        div3.appendChild(div4);
        div2.appendChild(div3);
        div2.appendChild(table1);
        div1.appendChild(div2);

        document.getElementsByClassName("row tooltip-holder")[0].appendChild(div1);
    };

    xhttp.send(message);
}

function addRowToTBody(s,t,i)
{
    s = s.replace(/",/g,';').replace(/,"/g,';').replace(/:/g,';').replace(/"/g,'').split(";");
    var un = (i<6)?3:3;
    var sv = (i<6)?5:5;
    var ui = players.indexOf(s[un]);
    var r = (i<6)?8:7;

    var tr = document.createElement("TR");
    var td_R = document.createElement("TD");
    td_R.setAttribute("class","rank");
    var text1 = document.createTextNode(s[r]);
    td_R.appendChild(text1);
	tr.appendChild(td_R);

    var td_U = document.createElement("TD");
    td_U.setAttribute("class","username");
    var a1 = document.createElement("A");
    a1.setAttribute("href","/m/"+s[un]+"/");
    var img1 = document.createElement("IMG");
    img1.setAttribute("class","user-photo lblazy b-loaded");
    img1.setAttribute("src","https://munzee.global.ssl.fastly.net/images/avatars/"+av[ui]+".png");
    a1.appendChild(img1);
    td_U.appendChild(a1);
    var a2 = document.createElement("A");
    a2.setAttribute("class","user-anchor");
    a2.setAttribute("href","/m/"+s[un]+"/");
    var text2 = document.createTextNode(s[un]);
    a2.appendChild(text2);
    td_U.appendChild(a2);
    tr.appendChild(td_U);

    var td_P = document.createElement("TD");
    td_P.setAttribute("class","points");
    var text3 = document.createTextNode(s[sv]);
    td_P.appendChild(text3);
	tr.appendChild(td_P);

    t.appendChild(tr);
}