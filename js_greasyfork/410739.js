// ==UserScript==
// @name         Gimy VOD Scapper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scraps Gimy TV drama into a zipped folder that can be scanned by Kodi when decompressed.
// @author       lacek
// @match        *://www.gimyvod.com/video/*
// @grant        unsafeWindow
// @run-at       context-menu
// @require      https://greasyfork.org/scripts/408787-js-toast/code/js-toast.js?version=837479
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.2/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/410739/Gimy%20VOD%20Scapper.user.js
// @updateURL https://update.greasyfork.org/scripts/410739/Gimy%20VOD%20Scapper.meta.js
// ==/UserScript==

(function(iqwerty, JSZip, saveAs, $, cms) {
    const select_text = (query) => $(query).contents()[1].textContent;
    const get_uniqueid = () => cms.id;
    const get_year = () => $('.stui-content__detail > .data:first').contents().eq(11).text().trim();
    const get_title = () => $('.stui-content__detail > .title').text().replace(/線上看$/, '').replace(/粵語$/, '');
    const get_premiered = (year) => year + '-01-01';
    const get_episodes_a = () => $('.stui-content__playlist:first > li > a');
    const get_tvshow = () => {
        let title = get_title();
        let poster = location.protocol + '//' + location.host + $('.ff-img:first').attr('src');
        let episode = get_episodes_a().length;
        let year = get_year();
        let plot = $('.stui-content__desc').text().trim();
        let premiered = get_premiered(year);
        let uniqueid = get_uniqueid();
        let actors = $('.stui-content__detail > .data:nth-of-type(2) > a').map((i,e) => $(e).text()).get();

        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<tvshow>
    <title>${title}</title>
    <year>${year}</year>
    <plot>${plot}</plot>
    <thumb aspect="poster">${poster}</thumb>
    <episodeguide/>
    <premiered>${premiered}</premiered>
    <status></status>
    <watched>false</watched>
    <season></season>
    <episode>${episode}</episode>${actors.map(name => `
    <actor>
        <name>${name}</name>
    </actor>`).join('')}
    <uniqueid type="gimyvod" default="true">${uniqueid}</uniqueid>
</tvshow>`;
    };

    const get_episodedetails = () => {
        let uniqueid = get_uniqueid();
        let title = get_title();
        return get_episodes_a().map((i,e) => $(e).text()).get().map(suffix =>
                             `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<episodedetails>
    <title>${title + ' ' + suffix.trim()}</title>
    <uniqueid type="gimyvod" default="true">${uniqueid}</uniqueid>
</episodedetails>`);
    };

    const get_m3u8 = async () => {
        const p = get_episodes_a().map((i,e) => $(e).attr('href')).get().map(async url => {
            const html = await fetch(url).then(r => r.text());
            return JSON.parse(/var cms_player = ({.+});/.exec(html)[1]).url;
        });
        return Promise.all(p);
    };

    const download_as_zip = async () => {
        let title = get_title();
        let year = get_year();
        let details = get_episodedetails();
        let urls = await get_m3u8();
        let pad = (num) => String(num).padStart(String(details.length).length, '0');
        let name = title + '.' + year;
        let zip = new JSZip();
        let folder = zip.folder(name);
        folder.file('tvshow.nfo', get_tvshow());
        details.map((d, i) => {
            let name = title + '.E' + pad(i+1);
            folder.file(name + '.nfo', d);
            folder.file(name + '.strm', urls[i]);
        });
        let content = await zip.generateAsync({type:"blob"});
        saveAs(content, name + '.zip');
    };

    try {
        iqwerty.toast.toast('Preparing zip file...');
        download_as_zip();
    } catch (e) {
        iqwerty.toast.toast('Something went wrong, check console.');
        console.log(e);
    }
})(window.iqwerty, window.JSZip, window.saveAs, unsafeWindow.jQuery, unsafeWindow.cms);