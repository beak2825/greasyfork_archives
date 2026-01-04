// ==UserScript==
// @name         FilterTeszt
// @namespace    Munzee
// @version      0.1
// @author       CzPeet
// @match        https://www.munzee.com/map*
// @description  XXX
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382545/FilterTeszt.user.js
// @updateURL https://update.greasyfork.org/scripts/382545/FilterTeszt.meta.js
// ==/UserScript==

function tesztfilter()
{
    funcAll("11");
    funcAll("15");
    funcAll("16");
    funcAll("17");
    funcAll("18");
    funcAll("19");
    funcAll("20");
    funcAll("21");
    funcAll("22");
    funcAll("23");
    funcAll("24");
    funcAll("25");
    funcAll("26");
    funcAll("27");
    funcAll("28");
    funcAll("29");
    funcAll("30");
    funcAll("31");
    funcAll("32");
    funcAll("33");
    funcAll("58");
    funcAll("60");
    funcAll("65");
    funcAll("72");
    funcAll("73");
    funcAll("74");
    funcAll("75");
    funcAll("77");
    funcAll("78");
    funcAll("81");
    funcAll("82");
    funcAll("83");
    funcAll("84");
    funcAll("85");
    funcAll("86");
    funcAll("87");
    funcAll("88");
    funcAll("89");
    funcAll("90");
    funcAll("91");
    funcAll("94");
    funcAll("110");
    funcAll("111");
    funcAll("112");
    //funcAll(114); - All Places - Onmagaban is jo
    funcAll("130");
    funcAll("131");
    funcAll("132");
    funcAll("133");
    funcAll("134");
    funcAll("135");
    funcAll("136");
    funcAll("137");
    funcAll("138");
    funcAll("139");
    funcAll("140");
}

function funcAll(fa)
{
    var ne = map.getBounds();
    var lng1 = ne._ne.lng;
    var lat1 = ne._ne.lat;
    var lng2 = ne._sw.lng;
    var lat2 = ne._sw.lat;


    var myXHTTP = new XMLHttpRequest();
    var msg = 'data={"filters":"1,2,3,4,5,6,7,8,9,14,35,36,37,38,39,42,48,49,50,53,55,61,64,66,67,68,70,80,92,95,97,99,102,106,109,129,'+fa+'","fields":"munzee_id,friendly_name,original_pin_image","total_limit":100,"points":{"';
    msg += 'box1":{"timestamp":0,"lat2":'+lat2+',"lng1":'+lng1+',"lng2":'+lng2+',"lat1":'+lat1+'}},"clan_id":850,"language":"EN"}&access_token=WcE0q3FJJ7uvRJYhf4gmHHzvSlsD5V8dv4SXk2sd';

    myXHTTP.open('POST', 'https://api.munzee.com/map/boundingbox/v3/', false);
    myXHTTP.setRequestHeader("Accept", "*/*");
    myXHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

    myXHTTP.onload = function ()
    {
        if (myXHTTP.responseText.indexOf("count\":0}") == -1)
        {
            console.log(myXHTTP.responseText);
        }
    };

    myXHTTP.send(msg);
    console.log("DONE - "+fa);
}

$(document).ajaxSuccess(tesztfilter);