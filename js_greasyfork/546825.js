// ==UserScript==
// @name           Direct Image Link E621/926 filelist
// @version        2025.08.23
// @description    Список имён
// @match          http*://e621.net/posts*
// @match          http*://e621.net/pool*
// @match          http*://e621.net/favorites*
// @match          http*://e926.net/posts*
// @match          http*://e926.net/pool*
// @match          http*://e926.net/favorites*
// @author         Rainbow-Spike
// @namespace      https://greasyfork.org/users/7568
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/546825/Direct%20Image%20Link%20E621926%20filelist.user.js
// @updateURL https://update.greasyfork.org/scripts/546825/Direct%20Image%20Link%20E621926%20filelist.meta.js
// ==/UserScript==

// Вставь свой список MD5-кодов уже закачанных файлов вместо образца | Insert your list of MD5 codes for already downloaded files instead of the sample

const downloadedMD5 = [
'00006e15e4429737c4141106825856e4', '00006e15e4429737c4141106825856e4', '00006e15e4429737c4141106825856e4', '00006e15e4429737c4141106825856e4',
];

localStorage . setItem ( "downloadedMD5", JSON . stringify ( downloadedMD5 ) );