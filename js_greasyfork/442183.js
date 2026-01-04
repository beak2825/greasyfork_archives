// ==UserScript==
// @name        Huawei AppGallery APK download
// @namespace   appgallery_apk
// @description Add download APK links to application pages
// @icon        https://appgallery.huawei.com/static/agweb/img/ic_navigation_appmarket.png
// @include     https://appgallery.huawei.com/*
// @include     https://appgallery.cloud.huawei.com/*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/442183/Huawei%20AppGallery%20APK%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/442183/Huawei%20AppGallery%20APK%20download.meta.js
// ==/UserScript==

const isHash = '#/app/', isApp = '/app/';
var AppID = '';

if (document.location.pathname == '/' && document.location.hash.slice(0, isHash.length) == isHash) AppID = document.location.hash.slice(isHash.length)
  else if (document.location.pathname.slice(0, isApp.length) == isApp) AppID = document.location.pathname.slice(isApp.length);

if (AppID.length > 0)
{
  var TrimPos = AppID.search(/[\#\&\?\/]/);
  if (TrimPos < 0) TrimPos = Number.MAX_VALUE;
  AppID = AppID.slice(0, TrimPos);
  window.addEventListener('load', async function () {
    for (let i = 0; i < 100; i++)
    {
      var divtipcol = document.getElementsByClassName('tip_item');
      if (divtipcol.length != 0 && divtipcol[0].innerHTML != null) break;
      await sleep(100);
    };
    if (divtipcol.length > 0)
    {
      var divtip = divtipcol[0];
      var tipitem = divtip.cloneNode(true);
      tipitem.firstChild.remove();
      var apklink = document.createElement('a');
      apklink.href='https://appgallery.cloud.huawei.com/appdl/' + AppID;
      apklink.text = 'Download APK';
      tipitem.insertBefore(apklink, tipitem.firstChild);
      divtip.insertBefore(tipitem, divtip.firstChild);
    };
  });
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};