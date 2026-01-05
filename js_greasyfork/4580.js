// ==UserScript==
// @name           GOM TV Video Download Link
// @namespace      http://www.mathemaniac.org
// @description    Adds a download link to GOM TV videos.
// @include        http://www.gomtv.net/classic/vod/*
// @include        http://www.gomtv.net/videos/*
// @include        http://www.gomtv.net/classics2/vod/*
// @include        http://www.gomtv.net/gsi/vod/*
// @version 0.0.1.20140827095723
// @downloadURL https://update.greasyfork.org/scripts/4580/GOM%20TV%20Video%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/4580/GOM%20TV%20Video%20Download%20Link.meta.js
// ==/UserScript==

var videoId = document.documentElement.innerHTML.match(/\.swf\?link=(\d+)/)[1];

var vodInfo = document.getElementById('VodInfo');
var downloadLi = document.createElement('li');
var downloadLink = document.createElement('a');
downloadLink.href = "http://flvdn.gomtv.net/viewer/"+videoId+".flv";
downloadLink.appendChild(document.createTextNode('Download'));
downloadLi.appendChild(downloadLink);
vodInfo.appendChild(downloadLi);
