// ==UserScript==
// @name         比思论坛
// @namespace    https://leochan.me
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        *://hkpic.net/*
// @match        *://hkbisi.com/*
// @match        *://108.170.9.195/*
// @match        *://108.170.9.196/*
// @match        *://198.24.143.234/*
// @match        *://174.138.175.178/*
// @match        *://198.24.151.114/*
// @match        *://bi-si2.xyz/*
// @match        *://bi-si1.xyz/*
// @match        *://198.15.119.148/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389519/%E6%AF%94%E6%80%9D%E8%AE%BA%E5%9D%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/389519/%E6%AF%94%E6%80%9D%E8%AE%BA%E5%9D%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function gonow(){
        if(location.hostname!='198.15.119.148'){
            location.href = location.href.replace(location.hostname,'198.15.119.148');
        }
    }
    gonow();
    function replaceD( rexDomain ){
        var hrefs = document.querySelectorAll('a[href*="' + rexDomain + '"]'), newDomain = '198.15.119.148', length = hrefs.length;
        for(var i=0;i<length;i++){
            hrefs[i].href = hrefs[i].href.replace(rexDomain,newDomain);
        }
    }
    replaceD( 'hkpic.net' );
    replaceD( 'hkbisi.com' );
    replaceD( '108.170.9.195' );
    replaceD( '108.170.9.196' );
    replaceD( '198.24.143.234' );
    replaceD( '174.138.175.178' );
    replaceD( '198.24.151.114' );
    replaceD( 'bi-si1.xyz' );
    replaceD( 'bi-si2.xyz' );
    replaceD( '198.15.119.148' );
    function target(){
        var links = document.querySelectorAll('a.xst'), length = links.length;
        for( var k = 0; k < length; k++ ){
            links[k].setAttribute('target','_blank');
            links[k].removeAttribute('onclick');
        }
    }
    target();
    function orderby(){
        if(document.querySelectorAll('#filter_orderby_menu').length>0){
            var v = new URLSearchParams(window.location.search).get('orderby');
            if(!v||v==null||v!='dateline'){
                document.querySelectorAll('#filter_orderby_menu a')[1].click();
            }
        }
    }
    orderby();
    function auto_login(){
        var obj = document.getElementById('lsform');
        if( obj && obj != null ){
            document.getElementById('ls_cookietime').checked = true;
            obj.querySelectorAll('button[type="submit"]')[0].click();
        }
    }
    auto_login();
    function auto_load( st, e ){
        var objs = document.querySelectorAll( st ), length = objs.length;
        if( length > 0 ){
            for( var i = 0; i < length; i++ ){
                objs[i].dispatchEvent( new Event( e ) );
            }
        }
    }
    auto_load( 'img[onmouseover]', 'mouseover' );
})();