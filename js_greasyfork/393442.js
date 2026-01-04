// ==UserScript==
// @name         MaintenanceMunzeeCollector
// @namespace    munzee.com
// @version      0.5
// @description  If you have a munzee in a maintenance mode, this script will collect quickly
// @author       CzPeet
// @match        https://www.munzee.com/m/*/maintenance*
// @match        https://www.munzee.com/m/*/deploys/*/type/*
// @update       https://greasyfork.org/hu/scripts/393442-maintenancemunzeecollector
// @downloadURL https://update.greasyfork.org/scripts/393442/MaintenanceMunzeeCollector.user.js
// @updateURL https://update.greasyfork.org/scripts/393442/MaintenanceMunzeeCollector.meta.js
// ==/UserScript==

function GetMunzeeCode(URL)
{
    var xmlHttp = null;
    var code = "";

    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlHttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlHttp.onreadystatechange=function()
    {
        if (xmlHttp.readyState==4 && xmlHttp.status==200)
        {
            if (xmlHttp.responseText.indexOf("Barcode Value") > 0)
            {
                code = xmlHttp.responseText.substring(xmlHttp.responseText.indexOf("Barcode Value")+19);
                code = code.trim();
                code = code.slice(0,code.indexOf(" "));
            }
        }
    }
    xmlHttp.open("GET", URL, false );
    xmlHttp.send();

    return code;
}

var sections = document. getElementsByTagName("section");
for (var sID=0; sID<sections.length; sID++)
{
    //Get the QR code
    var munzeeName = sections[sID].children[0].children[1].outerText;
    var href = sections[sID].children[0].children[1].href;
    href = (href[href.length-1] == "/") ? href.substring(0, href.length - 1) : href;
    var munzeeParts = href.split("/");
    var munzeeNumber = munzeeParts[munzeeParts.length-1];
    var QR_code = GetMunzeeCode((href+"/admin/print/").replace("http:","https:"));

    //Create
    var QR_Url = 'https://api.qrserver.com/v1/create-qr-code/?color=000000&qzone=2&size=400x400&data='+QR_code;
    var newRightDIV = document.createElement("DIV");
    var QR_Image = document.createElement("IMG");

    newRightDIV.setAttribute("class","pull-right");
    QR_Image.setAttribute("src",QR_Url);
    QR_Image.setAttribute("height","60");
    QR_Image.setAttribute("width","60");
    QR_Image.setAttribute("alt",munzeeNumber);
    //QR_Image.setAttribute("download",munzeeNumber+".png");
    //QR_Image.setAttribute("onclick","alert("+munzeeNumber+")");
    //QR_Image.setAttribute("oncontextmenu","return false;");


    newRightDIV.appendChild(QR_Image);
    sections[sID].appendChild(newRightDIV);
}