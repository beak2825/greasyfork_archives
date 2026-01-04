// ==UserScript==
// @name         HDNewsPics
// @namespace    HDNewsPics_AndrewWang
// @version      2.6.15
// @description  Remove Kpop news's useless query string to get best quality photos
// @author       AndrewWang
// @match        https://www.topstarnews.net/news/*
// @match        https://cds.topstarnews.net/news/*
// @match        https://ssl.pstatic.net/*
// @match        https://post-phinf.pstatic.net/*
// @match        https://img1.daumcdn.net/thumb/*
// @match        https://t1.daumcdn.net/cfile/*
// @match        https://*.uf.tistory.com/image/*
// @match        https://mimgnews.pstatic.net/*
// @match        https://vfan-phinf.pstatic.net/*
// @match        https://www.thebigdata.co.kr/*
// @match        https://static.kstyle.com/*
// @match        https://pbs.twimg.com/media/*
// @match        https://cdnimg.melon.co.kr/*
// @match        https://img-mdpr.freetls.fastly.net/*
// @match        https://mpost.tv/wp-content/uploads/*
// @match        https://newsimg.sedaily.com/*
// @match        https://tenasia.hankyung.com/webwp_kr/*
// @match        https://*.sbs.co.kr/img/*
// @match        https://static.wixstatic.com/media/*
// @match        https://www.koreanfakes.com/wp-content/uploads/*
// @match        https://yt3.ggpht.com/*
// @match        https://popwave.jp/wp-content/uploads/*
// @match        https://imgnews.pstatic.net/image/*
// @match        https://image.fnnews.com/resource/*
// @match        https://pbs.twimg.com/ad_img/*
// @match        https://media.giphy.com/media/*
// @match        https://enneagon1020.rf.gd/storage/cache/images/*
// @match        https://*.media.tumblr.com/*
// @match        https://cdn.kunstmatrix.com/*
// @match        https://cdn.livedoor.jp/kstyle/*
// @match        https://img.guildedcdn.com/*
// @match        https://media.gettyimages.com/photos/*
// @match        https://secureservercdn.net/160.153.138.105/5kb.36d.myftpupload.com/wp-content/uploads/*
// @match        https://*.imageporter.com/i/*
// @match        https://imgur.com/*
// @match        https://img.wkorea.com/*
// @match        https://livedoor.blogimg.jp/akb48images/imgs/*
// @match        https://d1tsg92bbnlhd6.cloudfront.net/*
// @match        https://*.doubanio.com/view/photo/*

// @match        https://kfakescom.files.wordpress.com/*
// @match        https://cfapfakes.com/wp-content/uploads/*
// @match        https://kfapfakes.com/wp-content/uploads/*
// @match        https://img.jvid.com/minify_image/*
// @match        https://idolfap.com/files/*
// @match        https://idolfake.org/files/*
// @match        https://cfake.com/medias/*

// @run-at       document-idle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/484587/HDNewsPics.user.js
// @updateURL https://update.greasyfork.org/scripts/484587/HDNewsPics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration object mapping URL patterns to handler functions
    const urlHandlers = [
        { pattern: /ssl\.pstatic\.net[\S]*\?/, handler: removeQueryString },
        { pattern: /post-phinf\.pstatic\.net[\S]*\?/, handler: removeQueryString },
        { pattern: /mimgnews\.pstatic\.net[\S]*\?/, handler: removeQueryString },
        { pattern: /vfan-phinf\.pstatic\.net[\S]*\?/, handler: removeQueryString },
        { pattern: /img-mdpr\.freetls\.fastly\.net[\S]*\?/, handler: setQuality },
        { pattern: /imgnews\.pstatic\.net\/image\/[\S]*\?/, handler: removeQueryString },
        { pattern: /d1tsg92bbnlhd6\.cloudfront\.net\/[\S]*\/([\S]*\/)([\S]*)/, handler: fans },
        { pattern: /cdnimg\.melon\.co\.kr[\S]*/, handler: switchOrg_melon },
        { pattern: /[www|cds]\.topstarnews\.net\/news\/[photo|thumbnail][\S]*/, handler: switchOrg_topstar },
        { pattern: /img1\.daumcdn\.net\/thumb/, handler: switchOrg1 },
        { pattern: /t1\.daumcdn\.net\/cfile\//, handler: switchOrg2 },
        { pattern: /uf\.tistory\.com\/image\//, handler: switchOrg3 },
        { pattern: /img2\.sbs\.co\.kr\/img\//, handler: switchOrg4 },
        { pattern: /mpost\.tv\/wp-content\/uploads\//, handler: removeSize },
        { pattern: /tenasia\.hankyung\.com\/webwp_kr\//, handler: removeSize },
        { pattern: /popwave\.jp\/wp-content\/uploads\//, handler: removeSize },
        { pattern: /newsimg\.sedaily\.com\//, handler: removeSize2 },
        { pattern: /static\.wixstatic\.com\/media\//, handler: removeSize3 },
        { pattern: /image\.fnnews\.com\/resource\//, handler: removeSize4 },
        { pattern: /yt3\.ggpht\.com\//, handler: bigSize },
        { pattern: /static\.kstyle\.com\//, handler: removeR580 },
        { pattern: /www\.thebigdata\.co\.kr\/view/, handler: getImg },
        { pattern: /pbs\.twimg\.com\//, handler: twitter },
        { pattern: /media\.tumblr\.com\//, handler: tumblr },
        { pattern: /https:\/\/media\.giphy\.com\/media\//, handler: giphyUrl },
        { pattern: /enneagon1020\.rf\.gd\/storage\/cache\/images\//, handler: toxlarge },
        { pattern: /cdn\.kunstmatrix\.com\/[0-9]+\/[0-9]+\/[\S]+\/(?:small|thumb|medium)-[^\.]*\.(?:jpe?g|png)/, handler: tolarge },
        { pattern: /cdn\.livedoor\.jp\/kstyle\/\S+\.jpg\/r\.580x0/, handler: removeR580 },
        { pattern: /img\.guildedcdn\.com\/(?:MediaChannelUpload|ContentMedia)\/\S+-\S+\.(?:jpe?g|png|gif|webp)/, handler: guidedImg },
        { pattern: /media\.gettyimages\.com\/photos\//, handler: gettyimages },
        { pattern: /secureservercdn\.net\/160\.153\.138\.105\/5kb\.36d\.myftpupload\.com\/wp-content\/uploads\//, handler: removeSize },
        { pattern: /img[0-9]{1,3}\.imageporter\.com\/i\//, handler: removeThumb },
        { pattern: /https:\/\/imgur\.com\/[0-9a-z]{7,10}/i, handler: imgur },
        { pattern: /img\.wkorea\.com\//, handler: removeSize },
        { pattern: /livedoor\.blogimg\.jp\/akb48images\/imgs/, handler: removeSize5 },
        { pattern: /img\.jvid\.com\/minify_image\//, handler: jvid },
        { pattern: /cfake\.com\/medias\/thumbs\//, handler: switchPhoto },
        { pattern: /kfakescom\.files\.wordpress\.com[\S]*\?/, handler: removeQueryString },
        { pattern: /idolfap\.com\/files\/thumb\//, handler: switchPath },
        { pattern: /idolfake\.org\/files\/thumb\//, handler: switchPath },
        { pattern: /cfapfakes\.com\/wp-content\/uploads\//, handler: removeSize },
        { pattern: /kfapfakes\.com\/wp-content\/uploads\//, handler: removeSize },
        { pattern: /www\.koreanfakes\.com\/wp-content\/uploads/, handler: removeSize },
        { pattern: /doubanio\.com\/view\/photo\/m\//, handler: doubanio }
    ];

    // Main execution
    const currentUrl = window.location.href;
    try {
        for (const { pattern, handler } of urlHandlers) {
            if (pattern.test(currentUrl)) {
                handler(currentUrl);
                break; // Assuming only one handler per URL
            }
        }
    } catch (err) {
        console.log(err);
    }

    // Utility functions for common operations
    function replaceInUrl(url, pattern, replacement, condition = true) {
        if (condition && pattern.test(url)) {
            const newUrl = url.replace(pattern, replacement);
            window.location.replace(newUrl);
        }
    }

    function replaceStringInUrl(url, searchString, replacement, condition = true) {
        if (condition && url.indexOf(searchString) !== -1) {
            const newUrl = url.replace(searchString, replacement);
            window.location.replace(newUrl);
        }
    }

    function removeSuffix(url, suffix, condition = true) {
        if (condition && url.indexOf(suffix) !== -1) {
            const newUrl = url.slice(0, url.lastIndexOf(suffix));
            window.location.replace(newUrl);
        }
    }

    // Consolidated size removal functions
    function removeSizeSuffix(url, pattern) {
        if (pattern.test(url)) {
            const newUrl = url.replace(pattern, '.');
            window.location.replace(newUrl);
        }
    }

    function removeSize(url) {
        removeSizeSuffix(url, /-[0-9]{3,4}x[0-9]{3,4}\./);
    }

    function removeThumb(url) {
        removeSizeSuffix(url, /_t\./i);
    }

    function removeSize2(url) {
        replaceStringInUrl(url, '_s.', '.');
    }

    function removeSize4(url) {
        replaceStringInUrl(url, '_l.', '.');
    }

    function removeSize5(url) {
        replaceStringInUrl(url, '-s.', '.');
    }

    function removeSize3(url) {
        removeSuffix(url, '/v1/');
    }

    function removeR580(url) {
        removeSuffix(url, '/r.580x0');
    }

    // Consolidated path switching functions
    function switchPathSegment(url, fromPath, toPath, additionalReplacements = []) {
        if (url.indexOf(fromPath) !== -1) {
            let newUrl = url.replace(fromPath, toPath);
            additionalReplacements.forEach(([pattern, replacement]) => {
                newUrl = newUrl.replace(pattern, replacement);
            });
            window.location.replace(newUrl);
        }
    }

    function switchPath(url) {
        switchPathSegment(url, '/thumb/', '/src/', [[/-thumb\./, '.']]);
    }

    function switchPhoto(url) {
        if (url.indexOf('/thumbs/') !== -1) {
            const newUrl = `${url.slice(0, url.indexOf('/thumbs/'))}/photos${url.slice(url.indexOf('/thumbs/') + 7)}`;
            window.location.replace(newUrl);
        }
    }

    function switchOrg_topstar(url) {
        if (!/_org\./.test(url)) {
            let newUrl = url;
            if (/\/thumbnail\//.test(url)) {
                newUrl = newUrl.replace(/\/thumbnail\//, '/photo/');
                newUrl = newUrl.replace(/_v150\./, '_org.');
            } else {
                newUrl = newUrl.replace(/_[a-zA-Z0-9\-]*\./, '_org.');
            }
            window.location.replace(newUrl);
        }
    }

    function switchOrg_melon(url) {
        if (!/_org\./.test(url) || /\/melon\/(?:resize\/[0-9]{1,3}\/)?quality\/[0-9]{1,3}\/optimize/.test(url)) {
            let newUrl = url.replace(/\/melon\/(?:resize\/[0-9]{1,3}\/)?quality\/[0-9]{1,3}\/optimize/, '');
            newUrl = newUrl.replace(/_[0-9]{1,5}\./, '_org.');
            window.location.replace(newUrl);
        }
    }

    function switchOrg1(url) {
        if (url.indexOf('thumb') !== -1) {
            let newUrl;
            if (url.indexOf('fname') !== -1) {
                newUrl = decodeURIComponent(url.slice(url.lastIndexOf('fname=') + 6));
            } else {
                const targetId = url.slice(url.lastIndexOf('%2F') + 3);
                newUrl = `http://cfile4.uf.tistory.com/original/${targetId}`;
            }
            window.location.replace(newUrl);
        }
    }

    function switchOrg2(url) {
        if (url.indexOf('?original') === -1) {
            const newUrl = `${url}?original`;
            window.location.replace(newUrl);
        }
    }

    function switchOrg3(url) {
        if (url.indexOf('/original/') === -1) {
            const newUrl = url.replace(/\/image\//, '/original/');
            window.location.replace(newUrl);
        }
    }

    function switchOrg4(url) {
        if (url.indexOf('_w') !== -1) {
            const newUrl = url.replace(/_w\./, '_ori.');
            window.location.replace(newUrl);
        }
    }

    function removeQueryString(url) {
        const newUrl = url.slice(0, url.indexOf('?'));
        window.location.replace(newUrl);
    }

    function doubanio(url) {
        let newUrl = url.replace(/photo\/m\/public/, 'photo/l/public');
        newUrl = newUrl.replace(/\.jpg/, '.webp');
        window.location.replace(newUrl);
    }

    function setQuality(url) {
        const qualityParam = url.slice(url.indexOf('?'));
        if (qualityParam !== '?quality=100') {
            const baseUrl = url.slice(0, url.indexOf('?'));
            window.location.replace(`${baseUrl}?quality=100`);
        }
    }

    function fans(url) {
        const match = url.match(/d1tsg92bbnlhd6\.cloudfront\.net\/[\S]*\/([\S]*\/)([\S]*)/);
        if (match) {
            const newUrl = url.replace(match[1], '');
            window.location.replace(newUrl);
        }
    }

    function bigSize(url) {
        if (url.indexOf('=s8192') === -1) {
            const newUrl = `${url.slice(0, url.lastIndexOf('=s'))}=s8192`;
            window.location.replace(newUrl);
        }
    }

    function getImg() {
        const imgElement = document.getElementsByClassName("article_con_img")[0];
        if (imgElement && imgElement.childNodes[0] && imgElement.childNodes[0].childNodes[0]) {
            const imgSrc = imgElement.childNodes[0].childNodes[0].src;
            window.location.replace(imgSrc);
        }
    }

    function twitter(url) {
        if (url.indexOf('orig') === -1) {
            let newUrl = url;
            if (url.indexOf('?format') !== -1) {
                newUrl = newUrl.replace(/&name=[0-9a-zA-Z]+/, '&name=orig');
            } else {
                if (url.lastIndexOf(':') !== 5 && url.indexOf('orig') === -1) {
                    newUrl = `${newUrl.slice(0, newUrl.lastIndexOf(':'))}:orig`;
                } else {
                    newUrl = `${newUrl}:orig`;
                }
            }
            window.location.replace(newUrl);
        }
    }

    function tumblr(url) {
        if (url.indexOf('s3600x3600') === -1 && url.indexOf('_1280.') === -1) {
            let newUrl = url.replace(/s[0-9]{3,4}x[0-9]{3,4}/g, 's3600x3600');
            newUrl = newUrl.replace(/_[0-9]{3,4}\./g, '_1280.');
            window.location.replace(newUrl);
        }
    }

    function giphyUrl(url) {
        if (!/source\.gif/.test(url)) {
            const newUrl = `${url.slice(0, url.lastIndexOf('/'))}/source.gif`;
            window.location.replace(newUrl);
        }
    }

    function toxlarge(url) {
        if (/,medium\.2x/.test(url)) {
            const newUrl = url.replace(',medium.2x', ',xlarge.2x');
            window.location.replace(newUrl);
        }
    }

    function tolarge(url) {
        if (/cdn\.kunstmatrix\.com\/[0-9]+\/[0-9]+\/[\S]+\/(?:small|thumb|medium)-[^\.]*\.(?:jpe?g|png)/.test(url)) {
            const newUrl = url.replace(/(?:small|thumb|medium)-/, 'large-');
            window.location.replace(newUrl);
        }
    }

    function guidedImg(url) {
        let newUrl = url;
        let shouldReplace = false;
        if (/-Full\.(?:jpe?g|png|gif|webp)/.test(url) === false) {
            newUrl = newUrl.replace(/-\S+\./, '-Full.');
            shouldReplace = true;
        }
        if (/\?\S+/.test(url) === true) {
            newUrl = newUrl.replace(/\?\S+/, '');
            shouldReplace = true;
        }
        if (shouldReplace) {
            window.location.replace(newUrl);
        }
    }

    function gettyimages(url) {
        if (!/s=2048x2048/.test(url)) {
            const newUrl = url.slice(0, url.indexOf('?') + 1) + 's=2048x2048';
            window.location.replace(newUrl);
        }
    }

    function imgur(url) {
        if (/https:\/\/imgur\.com\/[0-9a-z]{7,10}/i.test(url)) {
            const ext = url.match(/\.(?:jpe?g|png|gif)/i) ? '' : '.jpg';
            const newUrl = url.replace(/imgur/, 'i.imgur') + ext;
            window.location.replace(newUrl);
        }
    }

    function jvid(url) {
        if (!/\/minify_image\/1600\//i.test(url)) {
            const newUrl = url.replace(/\/minify_image\/[0-9]{2,4}\//, '/minify_image/1600/1/');
            window.location.replace(newUrl);
        }
    }
})();
