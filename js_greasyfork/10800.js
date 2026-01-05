// ==UserScript==
// @name           Forvo download (July 2015)
// @namespace      runkit.ru
// @description    Download audio from forvo.com, on search results page, adds a download link, on individual word page, replaces the "download" icon.
// @author         Modifications by Michael Elsdoerfer
// @include        http://www.forvo.com/*
// @include        http://*.forvo.com/*
// @version 0.0.1.20150705131822
// @downloadURL https://update.greasyfork.org/scripts/10800/Forvo%20download%20%28July%202015%29.user.js
// @updateURL https://update.greasyfork.org/scripts/10800/Forvo%20download%20%28July%202015%29.meta.js
// ==/UserScript==

run();

function run()
{
    res = xpath("//a[@class='play']");
    len = res.snapshotLength;

    if( len < 1 ) {
        return 0;
    }

    for (var i = 0; i < len; i++) {
        var objLink = res.snapshotItem(i);
        var strLink = getMp3Url(objLink);
        
        var downloadIcon = objLink.parentNode.querySelector('.download a');
        if (downloadIcon) {
           downloadIcon.setAttribute('href', strLink);
           downloadIcon.setAttribute('download', 'download');  // force download
        } else {
           // Assume we are on search results page
           var a = document.createElement("a");
            a.innerHTML = "download";
            a.setAttribute('href', strLink);
            a.setAttribute('download', 'download');
           objLink.parentNode.appendChild(a);
        }
    }

    return 0;
}

function getMp3Url(obj)
{    
    // Looks like this: 
    // Play(71450,'ODk3NTY2NS80NC84OTc1NjY1XzQ0XzMxMzA2MV8xLm1wMw==','ODk3NTY2NS80NC84OTc1NjY1XzQ0XzMxMzA2MV8xLm9nZw==');return false;
    var str = obj.getAttribute('onclick');

    // We get the second, third arguments to Play()
    var expr = new RegExp(",'(.+)','");
    var mp3 = expr.exec(str)[1];
    var ogg = expr.exec(str)[1];
    
    // Code from Forvo's Play() function to build the link
    _SERVER_HOST == _AUDIO_HTTP_HOST ? (
        mp3 = "http://" + _SERVER_HOST + "/player-mp3Handler.php?path=" + mp3, 
        ogg = "http://" + _SERVER_HOST + "/player-oggHandler.php?path=" + ogg
    ) : (
        mp3 = "http://" + _AUDIO_HTTP_HOST + "/mp3/" + base64_decode(mp3), 
        ogg = "http://" + _AUDIO_HTTP_HOST + "/ogg/" + base64_decode(ogg)
    );

    return mp3;
}

/**
 * Возращает первый результат xpath запроса query
 */
function xpathfirst(query, startingPoint){

    var res = xpath(query, startingPoint);

    if (res.snapshotLength == 0){return false;}

    return res.snapshotItem(0);
}
/**
 * Обертка для xpath запроса
 */
function xpath(query, startingPoint){

    if (startingPoint == null) {
        startingPoint = document;
    }
    var retVal = document.evaluate(query, startingPoint, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    return retVal;
}
/**
 * Обертка для getElementsByTagName
 */
function _gt(e){return document.getElementsByTagName(e);}
/**
 * Обертка для getElementsByTagName
 */
function _gi(e){return document.getElementById(e);}
/**
 * Возращает целое случайное число.
 */
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFormatDate(format){

    var cur_time = new Date();

    return cur_time.getHours() + ":" + cur_time.getMinutes() + ":" + cur_time.getSeconds();
}
