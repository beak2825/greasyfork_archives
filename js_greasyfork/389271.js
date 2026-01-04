// ==UserScript==
// @name        jav_preview
// @version     0.1.3
// @include     *://*javbus.com/*
// @include     *://*javdb*/*
// @include     *://*javlibrary*/*
// @description 添加jav官方预览影片
// @grant       none
// @namespace https://sleazyfork.org/users/232476
// @downloadURL https://update.greasyfork.org/scripts/389271/jav_preview.user.js
// @updateURL https://update.greasyfork.org/scripts/389271/jav_preview.meta.js
// ==/UserScript==

// 根据网站域名判断视频插入位置
const domain = window.location.hostname;
var javbus_domains = ["www.javbus.com", "www.javbus.icu", "www.dmmsee.icu", "www.busjav.icu"];
var javlibrary_domains = ["www.javlibrary.com", "m34z.com"];
var javdb_domains = ["javdb.com"];

var $position;

if (javbus_domains.indexOf(domain) != -1) {
    $position = document.querySelector('#mag-submit-show');
} else if (javlibrary_domains.indexOf(domain) != -1) {
    $position = document.querySelector('#video_favorite_edit');
} else if (javdb_domains.indexOf(domain) != -1) {
    $position = document.querySelector('.video-meta-panel');
}


if (!$position) return;

// 根据avid构建预览链接
const avid = document.title.replace(/([^-]+)-([^ ]+) .*/, '$1-$2');
const [prefix, number] = avid.split('-');
const firstLetter = prefix.charAt(0).toLowerCase();
const firstThreeLetters = prefix.substring(0, 3).toLowerCase();
const formattedNumber = number.padStart(5, '0');

// 构建预览链接
const previewLink = `https://cc3001.dmm.co.jp/litevideo/freepv/${firstLetter}/${firstThreeLetters}/${prefix.toLowerCase()}${formattedNumber}/${prefix.toLowerCase()}${formattedNumber}hhb.mp4`;

// 插入视频预览
const html = `<video id="jav_preview" style="position:relative; width: 640px; height: 360px; margin: 10px 0;" controls muted>
                <source src="${previewLink}" type="video/mp4">
              </video>`;
$position.insertAdjacentHTML('afterend', html);