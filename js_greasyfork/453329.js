// ==UserScript==
// @name         coofoUtils-comicInfo
// @namespace    https://github.com/coofo/someScript
// @version      0.0.2
// @license      MIT License
// @description  comicInfo扩展包
// @author       coofo
// @downloadURL  https://github.com/coofo/someScript/raw/main/tampermonkey/coofoUtils-comicInfo.user.js
// @supportURL   https://github.com/coofo/someScript/issues
// ==/UserScript==

(function () {
    'use strict';
    window.coofoUtils.comicInfoUtils = {
        create: function (info) {
            let p = ['Series', 'Title', 'Number', 'Count', 'Volume', 'Summary', 'Notes', 'Year', 'Month', 'Day',
                'Writer', 'Penciller', 'Inker', 'Colorist', 'Letterer', 'CoverArtist', 'Editor', 'Translator',
                'Publisher', 'Imprint', 'Genre', 'Tags', 'Web', 'Format', 'BlackAndWhite', 'Manga', 'Characters',
                'Teams', 'Locations', 'ScanInformation', 'StoryArc', 'StoryArcNumber', 'SeriesGroup', 'AgeRating',
                'CommunityRating', 'PageCount', 'LanguageISO', 'LocalizedSeries'];
            let xml = "<?xml version='1.0' encoding='utf-8'?>\n";
            xml += '<ComicInfo>\n';

            for (let i = 0; i < p.length; i++) {
                let name = p[i];
                let value = info[name];
                if (value !== undefined && value !== null && value.length > 0) {
                    if (typeof value === 'object') {
                        value = value.join(',');
                    }
                    xml += `  <${name}>${coofoUtils.commonUtils.xss.htmlEscape(value)}</${name}>\n`;
                }
            }

            xml += '</ComicInfo>';
            return xml;
        }
    };
})();