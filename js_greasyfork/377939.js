// ==UserScript==
// @name         Remove shitty AD
// @namespace    https://gist.github.com/GlobalEliteBhopMaster/e12828ec23ad6f06626a8b311e1d0456
// @version      0.3
// @description  Removes the ad!
// @author       You
// @match        smotretanime.ru/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/377939/Remove%20shitty%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/377939/Remove%20shitty%20AD.meta.js
// ==/UserScript==

function createCookie(name,value)
{
    document.cookie = name + "=" + value + "; path=/";
}

function removeCookie(name)
{
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

function getCookie(name)
{
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i < ca.length; i++)
  {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    return html;
}

function ready(fn) {
    //document.addEventListener('page:load', fn);

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function firstStart(ignoreCookie = false)
{
    window.localStorage.setItem('videojs-quality-2', '1080');

    var watchedPromoVideo = ignoreCookie ? null : getCookie('watchedPromoVideo');

    if (watchedPromoVideo === null)
    {
        createCookie('ads-blocked', '0');
    }
}

function setCookie(code)
{
    var req = GM_xmlhttpRequest({
        method: "GET",
        headers: { "Accept": "application/json" },
        url: "https://smotretanime.ru/translations/embedActivation?code=" + encodeURIComponent(code),
        onload: function(response) {
            var html = response.responseText;
            //console.log('resp: ' + html);

            var json = JSON.parse(html);

            console.log('cookieValue: ' + json.cookieValue);

            createCookie('watchedPromoVideo', json.cookieValue);

            setTimeout(() => window.location.reload(false), 500);
        }
    });
}

function checkAd()
{
    var serialized_html = DOMtoString(document);

    if (/<div class="seed-player-container videoseed-player-container">/.exec(serialized_html) !== null)
    {
        var pathname = window.location.pathname;
        if (pathname.search("/translations/embed/") != -1)
        {
            var watchedPromoVideo = getCookie('watchedPromoVideo');

            if (watchedPromoVideo === null)
            {
                var videoPlayer = document.querySelector('.video-js video, video.video-js');
                videoPlayer.click();

                document.querySelector('.subtitles').style.display = "none";
                document.querySelector('.text').innerHTML = null;

                var iframe = document.querySelector("iframe");
                if (iframe)
                {
                    iframe.remove();
                }

                var oActivate = unsafeWindow.playerGlobal.concatenate.activate;

                unsafeWindow.playerGlobal.concatenate.activate = (code) => {
                    console.log('code: ' + code);

                    GM_setValue("code", code);

                    oActivate(code);

                    var codeInterval = setInterval(() => {
                        if (unsafeWindow.playerGlobal.support.cookieValue)
                        {
                            clearInterval(codeInterval);
                            unsafeWindow.playerGlobal.support.skip();

                            var bind = Function.bind;
                            var unbind = bind.bind(bind);

                            function instantiate(constructor, args) {
                                return new (unbind(constructor, null).apply(null, args));
                            }

                            var oldDate = Date;
                            var oldDatePrototype = Date.prototype;

                            unsafeWindow.Date = function (Date) {
                                MyDate.prototype = Date.prototype;

                                function MyDate() {
                                    var date = instantiate(Date, arguments);
                                    date.setYear("2999");

                                    return date;
                                }

                                return MyDate;
                            }(Date);

                            var skipButton = document.querySelector('.skip-button');
                            skipButton.click();

                            unsafeWindow.Date = oldDate;
                            unsafeWindow.Date.prototype = oldDatePrototype;
                        }
                    }, 500);
                };
            }
        }
    }
}

function checkCode()
{
    var serialized_html = DOMtoString(document);

    if (/<div class="seed-player-container videoseed-player-container">/.exec(serialized_html) !== null)
    {
        var pathname = window.location.pathname;
        if (pathname.search("/translations/embed/") != -1)
        {
            var code = GM_getValue("code", null);

            if (code !== null)
            {
                var newBody = document.createElement("body");
                newBody.innerHTML = "<center><h1>Обходим говнорекламу...</h1></center><br><center><h2>Страница будет перезагружена несколько раз.</h2></center>";
                document.body.replaceWith(newBody);
                document.body.style.background = 'white';
                setCookie(code);
            }
        }
    }
}

firstStart();
window.onload = checkAd;
ready(checkCode);