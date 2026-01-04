// ==UserScript==
// @name        VK Hide Wall (personal script)
// @description Remove social elements from VK
// @namespace   puic
// @include     https://vk.com
// @version     1.00
// @license     MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/440408/VK%20Hide%20Wall%20%28personal%20script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440408/VK%20Hide%20Wall%20%28personal%20script%29.meta.js
// ==/UserScript==
 
GM_addStyle (`
    .wall_module{
        display: none !important;
    }`);

GM_addStyle (`
    .people_module{
        display: none !important;
    }`);

GM_addStyle (`
    .submit_post_box{
        display: none !important;
    }`);

GM_addStyle (`
    .page_list_module{
        display: none !important;
    }`);

GM_addStyle (`
    .video_module{
        display: none !important;
    }`);

GM_addStyle (`
    .album_module{
        display: none !important;
    }`);

GM_addStyle (`
    .audios_module{
        display: none !important;
    }`);

GM_addStyle (`
    .OldBrowser{
        display: none !important;
    }`);

GM_addStyle (`
    .ads_ads_box{
        display: none !important;
    }`);
GM_addStyle (`
    .ads_ads_box2{
        display: none !important;
    }`);
GM_addStyle (`
    .ads_ads_box3{
        display: none !important;
    }`);