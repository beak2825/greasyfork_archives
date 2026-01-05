// ==UserScript==
// @name         WaniKani Links
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds links to info pages during reviews.  Jisho and WaniKani.  Click the review item for a popup.
// @author       You
// @match        https://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24370/WaniKani%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/24370/WaniKani%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';
// Hook into App Store
    //try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}
    addStyle('#divLinks {' +
             '  display: none;' +
             '  position: absolute;' +
             '  z-index: 10;' +
             '  background: #c7c2c2;' +
             '  border: black 1px solid;' +
             '}' +
             '#divLinks a {' +
             '  padding: 5px;' +
             '  display: inline;' +
             '}' +
             '#divLinks a:after {' +
             '  content:"\\a";' +
             '  white-space: pre;' +
             '  padding: 5px;' +
             '}');
    $.jStorage.listenKeyChange('currentItem', function (key, action) {
        choiceBox($.jStorage.get('currentItem'));
        $('.radicals [lang="ja"]').click(
            function(event){
                showLinks(event);
            }
        ).css('cursor','pointer');
        $('.kanji [lang="ja"]').click(
            function(event){
                showLinks(event);
            }
        ).css('cursor','pointer');
        $('.vocabulary [lang="ja"]').click(
            function(event){
                showLinks(event);
            }
        ).css('cursor','pointer');
    });
}());

function choiceBox(data){
    $('#divLinks').remove();
    var divLinks = $("<div>", {
        id: 'divLinks',
        title: 'Links',
    });
    if (data.voc !== undefined) {
        $("<a>", {
            text: "WaniKani",
            title: "WaniKani",
            href: "https://www.wanikani.com/vocabulary/" + data.voc,
            target: "_blank",
            click: function(){hideLinks();}
        }).appendTo(divLinks);
        $("<a>", {
            text: "Jisho",
            title: "Jisho",
            href: "http://jisho.org/search/" + data.voc,
            target: "_blank",
            click: function(){hideLinks();}
        }).appendTo(divLinks);
    } else if (data.kan !== undefined) {
        $("<a>", {
            text: "WaniKani",
            title: "WaniKani",
            href: "https://www.wanikani.com/kanji/" + data.kan,
            target: "_blank",
            click: function(){hideLinks();}
        }).appendTo(divLinks);
        $("<a>", {
            text: "Jisho",
            title: "Jisho",
            href: "http://jisho.org/search/" + data.kan,
            target: "_blank",
            click: function(){hideLinks();}
        }).appendTo(divLinks);
    } else if (data.rad !== undefined) {
        $("<a>", {
            text: "WaniKani",
            title: "WaniKani",
            href: "https://www.wanikani.com/radicals/" + data.rad,
            target: "_blank",
            click: function(){hideLinks();}
        }).appendTo(divLinks);
    }
    $('body').append(divLinks);
}

function showLinks(event){
    $('#divLinks').css('display','block').css('left',event.pageX).css('top',event.pageY);
}

function hideLinks(){
    $('#divLinks').css('display','none');
}

//-------------------------------------------------------------------
// Add a <style> section to the document.
//-------------------------------------------------------------------
function addStyle(aCss) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (head) {
        style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = aCss;
        head.appendChild(style);
        return style;
    }
    return null;
}