// ==UserScript==
// @name         k_to_y_tool
// @namespace    http://tampermonkey.net/
// @version      0.1.1.4.1
// @description  try to take over the world!
// @author       You
// @match        https://tw.promo.yahoo.com/
// @include      /tw.promo.yahoo.com
// @include      /.facebook.com/share.php
// @include      /www.facebook.com/login.php?
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386198/k_to_y_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/386198/k_to_y_tool.meta.js
// ==/UserScript==
var backUrl, backHost

function a(){
    var loc = window.location.href;
    //alert('location.href: '+window.location.href);
    //if (loc.match("facebook.*\\u=")) {
    if (loc.match("facebook.*")) {
        //alert('location.href: '+location.search);
        history.go(-1);
        //window.location.href = window.location.href.replace(/share.php?u=/);
    };
}
//alert('location.href: '+location.search);
//
//var backHost

    //console.log('backUrl: '+backUrl);
    //console.log('backHost: '+backHost);

function xpath(query) {
    return document.evaluate(query, document, null,
                             XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}


function anchorclick(node)
{
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window,
                       0, 0, 0, 0, 0, false, false, false, false, 0, null);
    var allowDefault = node.dispatchEvent(evt);
}

a()

//var xpath2 = "/html/body/div/div/div[3]/div";
//var result = document.evaluate(xpath2, document, null, XPathResult.ANY_TYPE, null);
//var node = result.iterateNext();
//var nodeTxt = node.textContent;
//var myWin = window.open('','','width=400,height=400');
//myWin.document.write (nodeTxt);
//alert(nodeTxt);

//var nodeTxt = $("body > div > div > div.prize-content > div").text();
//alert ('nodeTxt' + '\n' + '123');
//var myWin = window.open('','','width=400,height=400');
//myWin.document.write (nodeTxt + '\n' + "123");


var btnITagstart =xpath("//a[@class='start breath ']");
if ( btnITagstart.snapshotLength > 0)
{
    var thisDivstart =  btnITagstart.snapshotItem(0);
    setTimeout(function(){
            anchorclick(thisDivstart);
    }, 3000);
}


var btnITags =xpath("//a[@class='over-stage-btn']");
//var btnITags =xpath("//a[@class='share ']");
if ( btnITags.snapshotLength > 0)
{
    //backUrl = location.href;
    //backHost = location.host;
    //console.log('backUrl: '+backUrl);
    //console.log('backHost: '+backHost);

    var thisDiv =  btnITags.snapshotItem(0);

    setTimeout(function(){anchorclick(thisDiv);}, 1000);
     //setTimeout(function(){window.location = "http://www.google.com.tw";}, 5000 );
    //window.location
    //setTimeout( window.location = "http://www.google.com.tw"  , 30000);

}

var btnITagsb =xpath("//a[@class='start  disable']");
if ( btnITagsb.snapshotLength > 0)
{
    var btnITagsc =xpath("//a[@class='clear-link act-btn btn-prize']");
    if ( btnITagsc.snapshotLength > 0)
    {
        var thisDivc =  btnITagsc.snapshotItem(0);
        setTimeout(function(){
            anchorclick(thisDivc);
        }, 3000);
    }
}

//prize-back-home

var btnITagBackH =xpath("//a[@class='prize-back-home']");
if ( btnITagBackH.snapshotLength > 0)
{
    //var xpath2 = "/html/body/div/div/div[3]/div";
    //var result = document.evaluate(xpath2, document, null, XPathResult.ANY_TYPE, null);
   //=================================
      var item = document.getElementsByClassName("prize-item");
    //console.log(item);


    var map = Array.prototype.map;
    var strtmp =""
    map.call(item, obj=> strtmp +=obj.outerText.replace(/[\n\r]/g,'_')+ '\n');

    alert(strtmp);
    //===================================
    //var myWin = window.open('','','width=400,height=400');
    //myWin.document.write (strtmp);

    //var btnITagLs =xpath("//a[@class='prize-date']");
    //console.log( btnITagLs.text );
// 抽取指定元素1
    //body > div > div > div.prize-content > div
    //var tt = $("body > div > div > div.prize-content > div > div:nth-child(1)");
//var tt = xpath("/html/body/div/div/div[3]/div");
// 抽取元素长度
//console.log( tt.text );
    //console.log(tt.textContent);

// 遍历
//titles.forEach(function (title, index) {
//    console.log("title: " + title.toString())
//});

    //table = div.getElementsByTagName('table')[1],
    //tr = table.getElementsByTagName('tr')[0],
    //td = tr.getElementsByTagName('td')[1];
   //alert(div.innerHTML);


    //var i,origLength;
	//origLength = document.all.length;
	//document.write('document.all.length='+origLength+"<br />");
	//for (i = 0; i < origLength; i++)
	//{
	//document.write("document.all["+i+"]="+document.all[i].tagName+"<br />");
	//}


    //var div = document.getElementBy('Content')
    //    var result =xpath("//a[@class='prize-list']");
    //result.forEach(function(element) {
    //    console.log(element);
    //});


    //var node = result.iterateNext();
    //var nodeTxt = node.textContent;

    //var nodeTxt1 = $("body > div > div > div.prize-content > div > div:nth-child(1)").text();
    //var nodeTxt2= $("body > div > div > div.prize-content > div > div:nth-child(2)").text();
    //var nodeTxt3 = $("body > div > div > div.prize-content > div > div:nth-child(3)").text();
    //var nodeTxt4 = $("body > div > div > div.prize-content > div > div:nth-child(4)").text();
    //var nodeTxt5 = $("body > div > div > div.prize-content > div > div:nth-child(5)").text();
    //alert (nodeTxt1 + '\n \n' + nodeTxt2 + '\n \n' + nodeTxt3 + '\n \n' + nodeTxt4 + '\n \n' + nodeTxt5 + '\n \n' );
}



