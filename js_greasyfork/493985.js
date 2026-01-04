// ==UserScript==
// @name        TM Free Tactics Filter 免费的战术过滤器
// @namespace   MMs
// @match      *trophymanager.com/tactics/
// @grant       none
// @version     1.0.2024050302
// @author      Maycon Miranda
// @description 免费的战术过滤器
// @downloadURL https://update.greasyfork.org/scripts/493985/TM%20Free%20Tactics%20Filter%20%E5%85%8D%E8%B4%B9%E7%9A%84%E6%88%98%E6%9C%AF%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/493985/TM%20Free%20Tactics%20Filter%20%E5%85%8D%E8%B4%B9%E7%9A%84%E6%88%98%E6%9C%AF%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

var getPro = '/buy-pro/';
$('a[href]='+getPro).removeAttr('tooltip');
$('a[href]='+getPro).removeAttr('href');