// ==UserScript==
// @name        Aptoide Downloader APK (+ XML and JSON)
// @namespace   https://greasyfork.org/ru/users/27937-stein-borovets
// @version     1.1
// @description A basic script for download apk from Aptoide
// @author      Evgeniy Borovets
// @match       http://*.aptoide.com/*
// @match       http://*.store.aptoide.com/*
// @match       https://*.aptoide.com/*
// @match       https://*.store.aptoide.com/*
// @include     http://*.aptoide.com/*
// @include     http://*.store.aptoide.com/*
// @include     https://*.aptoide.com/*
// @include     https://*.store.aptoide.com/*
// @exclude     https://aptoide.com/*
// @exclude     https://www.aptoide.com/*
// @exclude     http://apps.store.aptoide.com/
// @exclude     https://ru.aptoide.com/*
// @exclude     https://*.*.aptoide.com/
// @exclude     https://*.ru.aptoide.com/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/37102/Aptoide%20Downloader%20APK%20%28%2B%20XML%20and%20JSON%29.user.js
// @updateURL https://update.greasyfork.org/scripts/37102/Aptoide%20Downloader%20APK%20%28%2B%20XML%20and%20JSON%29.meta.js
// ==/UserScript==

var current_location = window.location;

if(!current_location.toString().match(/http:\/\/m\./)){

mobile_site_add = "http://m."+window.location.toString().slice(7);

var mobile_site = function() {
        var b = document.getElementsByTagName('body')[0];
        var t = document.createElement('div');
        // t.innerHTML = '<font color=green size=2><a href="'+mobile_site_add+'" style=text-decoration:none><div>Get Download Link<br>From Mobile Site</div></a>';
        t.style.position = 'absolute';
        t.style.left = '10px';
        t.style.top = '10px';
        b.appendChild(t);

}

mobile_site();
}

var src = document.documentElement.innerHTML;
var md5 = "-"+src.match(/MD5\:<\/strong> [A-Za-z0-9]*/).toString().slice(14);

var arrayURL = current_location.toString().split('/');
var appName = "/"+arrayURL[arrayURL.length-4].replace(/\./g,'-').toLowerCase();
var buildVer = "-"+arrayURL[arrayURL.length-3]+'-';
var appId = arrayURL[arrayURL.length-2];

var urlStore = arrayURL[2].toString().split('.');
var folder = "/"+urlStore[1];

var domain = "http://pool.apk.aptoide.com";

var download = domain+folder+appName+buildVer+appId+md5+".apk";

var ins_FC = function() {
        var div = document.createElement('div');
        div.setAttribute('style', ';border:1px solid #ee712c;padding:5px;font-size:12px;font-weight: bold;');
        div.innerHTML += '<a href=' + 'https://www.aptoide.com/webservices/2/getApkInfo/id:' + appId +'/json' + '>JSON файл</a> / ';
        div.innerHTML += '<a href=' + 'https://www.aptoide.com/webservices/2/getApkInfo/id:' + appId +'/xml' + '>XML файл</a><br /><br />';
		div.innerHTML += '<a href=' + download + '>Загрузить</a>';
		document.body.insertBefore(div, document.body.firstChild);
}

var dl_button = function() {
        var b = document.getElementsByClassName('app_meta install_area')[0];
        var t = document.createElement('div');
        t.innerHTML = '<a href="'+download+'"><font size=2>&nbsp;<strong>Загрузить</strong></a>' ;
        //t.style.position = 'absolute';
        //t.style.left = '70px' ;
        //t.style.top = '-20px' ;
        b.insertBefore(t,b.childNodes[1]);
}

ins_FC();
dl_button();