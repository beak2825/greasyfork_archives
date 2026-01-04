// ==UserScript==
// @name        Pixiv UI Compactor
// @name:ru     Pixiv Компактный интерфейс
// @description Hides popular works panel from Pixiv search page, narrows elements and removes unnecessary spaces to make the header ~2 times smaller so you can view the images without scrolling.
// @description:ru Скрывает промо блок, громоздкие элементы и убирает пробелы на странице поиска по тегам Pixiv, чтобы картинки отображались как можно ближе к хедеру.
// @namespace   puic
// @include     https://www.pixiv.net/*
// @version     1.07
// @license     MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438106/Pixiv%20UI%20Compactor.user.js
// @updateURL https://update.greasyfork.org/scripts/438106/Pixiv%20UI%20Compactor.meta.js
// ==/UserScript==

// Header spacing
GM_addStyle (`
    .expahI{
        display: none !important;
    }`);

// Spacing
GM_addStyle (`
    .wJpxo{
        display: none !important;
    }`);
	
// Tags belt
GM_addStyle (`
    .dztvKv{
        display: none !important;
    }`);

// Popular works
GM_addStyle (`
    .dhOsiK {
        display: none !important;
    }`);
GM_addStyle (`
    .dFLqqk {
        display: none !important;
    }`);

// Categories
GM_addStyle (`
    .bduUXU {
        padding-bottom: 0 !important;
    }`);
GM_addStyle (`
    .ioZtRi {
        height: 30 !important;
    }`);
	
// Search options
GM_addStyle (`
    .laRMNP{
        margin-top: 0px !important;
		margin-bottom: 10px !important;
    }`);

// Hide sort by popularity button
GM_addStyle (`
    .ddAFpR{
        display: none !important;
    }`);

// Main containers
GM_addStyle (`
    .buukZm{
        padding-top: 0px !important;
		padding-bottom: 0px !important;
    }`);
	
// Images thumbnails gap
GM_addStyle (`
    .jtpclu{
        margin-top: 0px !important;
		background-color: rgba(0, 0, 0, 0.0) !important;
		border-radius: 12px !important;
    }`);
GM_addStyle (`
    .bZOnOL{
        padding-left: 0px !important;
    }`);
GM_addStyle (`
    .kghgsn{
        font-size: 12px !important;
    }`);
GM_addStyle (`
    .krFoBL{
        gap: 12px 20px !important;
    }`);	