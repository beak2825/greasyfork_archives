// ==UserScript==
// @name         CCTV Scapper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scraps CCTV programme into a zipped folder that can be scanned by Kodi when decompressed.
// @author       lacek
// @match        *://tv.cctv.com/*.shtml
// @grant        unsafeWindow
// @run-at       context-menu
// @require      https://greasyfork.org/scripts/408787-js-toast/code/js-toast.js?version=837479
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.2/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/408783/CCTV%20Scapper.user.js
// @updateURL https://update.greasyfork.org/scripts/408783/CCTV%20Scapper.meta.js
// ==/UserScript==

(function(iqwerty, JSZip, saveAs, $, plot, episode_data) {
    const select_text = (query) => $(query).contents()[1].textContent;
    const get_uniqueid = () => $('meta[name="contentid"]').attr('content');
    const get_year = () => select_text('.right > .text_mod > p:nth-child(6)');
    const get_title = () => $('.right > .text_mod > h3').text().replace(/^\s*《|》\s*$|（.+）\s*$/g, '');
    const to_http = (url) => url.replace(/^(http:|https:)?/, 'http:');
    const get_premiered = (year) => {
        let pad = (num) => String(num).padStart(2, '0');
        let date = select_text('.right > .text_mod > p:nth-child(10)');
        let match = date.match(/(\d{4})?[/-](\d{1,2})?[/-](\d{1,2})?/); // y/m/d, y-m-d
        let y, m, d;
        if (match !== null) {
            [, y, m, d] = match;
        }
        if (m === undefined) {
            match = date.match(/((\d{4})年)?((\d{1,2})月)?((\d{1,2})日)?/); // y年m月d日, y年m月, m月d日
            if (match !== null) {
                [, , y, , m, , d] = match;
            }
        }

        if (y === undefined) {
            if (!year) {
                return '';
            }
            y = year;
        }
        if (m === undefined) {
            return y;
        }
        if (d === undefined) {
            d = '01';
        }
        return [y, pad(m), pad(d)].join('-');
    };
    const get_tvshow = () => {
        let title = get_title();
        let poster = to_http($('.fpy_ind01 img').attr('src'));
        let episode = episode_data.length;
        let year = get_year();
        let premiered = get_premiered(year);
        let uniqueid = get_uniqueid();
        let actors = select_text('.right > .text_mod > p:nth-child(7)').split(/[、，,]/);

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
    <uniqueid type="cctv" default="true">${uniqueid}</uniqueid>
</tvshow>`;
    };

    // JSONP APIs:
    // Show: http://api.cntv.cn/NewVideoset/getVideoAlbumInfoByVideoId?serviceId=tvcctv&id={videoId}&cb={callback}
    // Episodes: http://api.cntv.cn/NewVideo/getVideoListByAlbumIdNew?serviceId=tvcctv&pub=1&mode=0&p=1&sort=asc&id={videoId}&n={numEpisodes}&cb={callback}
    const get_episodedetails = () => {
        let uniqueid = get_uniqueid();
        return episode_data.map(({brief, img, title}) =>
                             `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<episodedetails>
    <title>${title}</title>
    <plot>${brief.replace(/^(本集主要内容：)\s+/, '')}</plot>
    <thumb>${to_http(img)}</thumb>
    <uniqueid type="cctv" default="true">${uniqueid}</uniqueid>
</episodedetails>`);
    };

    const get_m3u8 = () => episode_data.map(({img}) => `http://hls.cntv.cdn20.com/asp/hls/main/0303000a/3/default/${img.split('/').pop().split('-')[0]}/main.m3u8`);

    const get_sh = () => {
        let title = get_title();
        let year = get_year();
        let details = get_episodedetails();
        let urls = get_m3u8();
        let pad = (num) => String(num).padStart(String(details.length).length, '0');
        return `#!/bin/sh
set -e
mkdir '${title}.${year}'
cd '${title}.${year}'
cat <<EOF > tvshow.nfo
${get_tvshow()}
EOF
${Array(details.length).fill().map((_, i) => `cat <<EOF > '${title}.E${pad(i+1)}.nfo'
${details[i]}
EOF
echo "${urls[i]}" > '${title}.E${pad(i+1)}.strm'`).join('\n')}
`;
    };

    const download_as_zip = async () => {
        let title = get_title();
        let year = get_year();
        let details = get_episodedetails();
        let urls = get_m3u8();
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
})(window.iqwerty, window.JSZip, window.saveAs, unsafeWindow.jQuery, unsafeWindow.brief, unsafeWindow.jsonData1);