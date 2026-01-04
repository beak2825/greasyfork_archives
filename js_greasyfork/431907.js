// ==UserScript==
// @name         PTer Torrent Checker
// @author       Mlxg, ccf2012
// @thanks       根据EasyUpload PT一键转种脚本修改，特此感谢birdplane大佬！感谢贝壳大佬、明日大佬的帮助！感谢各位helper提供的反馈！感谢euphony大佬帮助整理bdinfo参数信息！
// @version      0.2.1
// @description  Assist with checking torrents.
// @require      https://cdn.staticfile.org/jquery/1.7.1/jquery.min.js
// @match        https://pterclub.com/details.php?id=*
// @match        https://pterclub.com/offers.php?id=*
// @match        https://pterclub.com/torrents.php*
// @match        https://pterclub.com/officialgroup*
// @icon         https://pterclub.com/favicon.ico
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @namespace https://greasyfork.org/users/812132
// @downloadURL https://update.greasyfork.org/scripts/431907/PTer%20Torrent%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/431907/PTer%20Torrent%20Checker.meta.js
// ==/UserScript==
var __assign = Object.assign;
var PT_SITE = {
    PTer: {
        url: "https://pterclub.com",
        host: "pterclub.com",
        siteType: "NexusPHP",
        icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="11px" height="11px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">  <image id="image0" width="20" height="20" x="0" y="0"    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACu1BMVEUAAAD////Cl3f/sZv/88f/NgD/z6j/VAD/AAD/++v/NwCGe33/rGgAAAX/6dgABBr/zqgTL1vxCACLblsAAAwAEzYAAgiZgmoCAwX9AAAFBAb7q3IEAAADAgL217wFAAD//////////////f///f////9IPkDRiEj/mTr/lTr/lTr9mz3InGrZlFv9tXP/3r0AAAAkGh27YRL7gBBsUTKpVBb/exP/j0D/xJIAAAE5KiX1ewT5eQLpfhxhSzbOagv/lU3/7dkAAAArIBqFUSWNUh9+TCOtXxv5fgy0aimFTh6OUh6NWzJROCbneA3/gCf/yp0EAAABAAIAABQAABUNDB2YVhz7hiDCpYoAAAAAABIAAAsTFBmlXRv/fBX/vYQbGB+4ZRb/iCT/+eUBDx6PVSH/fhz/wowAAAAwJyP0jjnTuKXvx6kABUtfOybTcBP/hTD/1K0AAAJONCH8fwaPXCikcUz/unz/rnPpjT/dcg7/cQn/lUf///8AABVqQSL5gQ1iSCy1XhL/eAr+cgr+dgf+fSb/zKQAChyFTyHndw9bQi/TbwvrdgrrfC77rXUUFhumXBrFbhBhQCy8bByuYRWxYhiuYBunXh+OXDSai38AAAAsIB+kXQ9dRzqogmIjHRstKCgOFyoAAyAAAAk9KyPShTM1O0gAAAtWOSP+nksAAwxxRyPtcxv7pmwDAgNALB5zRyZnPh2WYzz82LoEAAABAAEAAAUAAAP/dwD/dAH/cwH/cgDTdRX2fAT+eAD/eAD+dwD4eAP0ewX2egT/eQD/bwb9ewH/egD/dAD/fQD/dgD+fgH/dQD/fAD/cwD+fgPUcRP+cwP/ewDpdgr+ewLzeQX+fAD+eQD9bwP7fQT/fwD/fQH+fQT0ewb/fgHBZxP/fgLYcRD/egfufAv+dgznew3ndwb///9+450wAAAAuXRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkNDA4HASCOq6ipq2FhZxcCh/r8yuT4vjQVtf7+99b3tRYnq8fCyvH70sLBpNv981gIHBsXafLnTRYYH6n1/HOC/NEhafX3Xw+pui4IB5D+zSYdxv7PwHBdj+36egIw3P3c8Pf2/LIaUO773Pfrlx9y+/Tj9e3hyJdGBwOR87dgNikaBw+xuyEkz4ZA6PVdQ6WmqX0YBw0LDAI5k3AAAAABYktHRAH/Ai3eAAAAB3RJTUUH5QQKBzAvYbh7GgAAAUJJREFUGNNjYMAGGBkVFJWgQFlFlZERJMikpq6hqQUGmto6unr6zCwMDAaGRjt37dq9e/euXXuMTUzNzC1YGRksrfbus7bZf+DgocNHbO3sjx5zcGRjcHJ2cXVzP37Uw9PL28fX78RJ/wB2hsCg4JDQsFOnwyMio6JjYs+cjYvnANllkJB47nxSMicDQ0rqhbNp6VwgwYzMi+cuZWXncOfm5V8+X1DIAxTjLSq+cqKktKy8orLq6oHqmlo+oCB/Xf21Aw2NTc0trddv3GxrFwDpFuzovHW0q7vn9p2793r7+oXAfmKYMPH+uUmTp0ydNn3GzFnCYCGR2XMenHs4d978BQsXLRaFhojYkqWPTjxetlycESmYJFasfHLi6SpJZDEGqdVrnj1fu04aWUxGdv2GjZs2b5FDEZTfum37jtkMBAEAezt4kKiqYGgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDQtMTBUMDc6NDg6NDYrMDA6MDBMncp9AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTA0LTEwVDA3OjQ4OjQ2KzAwOjAwPcBywQAAAABJRU5ErkJggg==" /></svg>',
        asSource: true,
        asTarget: true,
        uploadPath: "/upload.php",
        seedDomSelector: "#top~table:first>tbody>tr:nth-child(5)",
        search: {
            path: "/torrents.php",
            imdbOptionKey: "4",
            nameOptionKey: "0",
            params: {
                incldead: "0",
                search_area: "{optionKey}",
                search: "{imdb}",
                sort: "5",
                type: "desc"
            },
            result: {
                list: "#torrenttable>tbody>tr",
                url: '.torrentname td a[href*="details.php?id="]',
                name: '.torrentname td a[href*="details.php?id="]',
                size: "td:nth-child(5)"
            }
        },
        name: {
            selector: "#name"
        },
        subtitle: {
            selector: 'input[name="small_descr"]'
        },
        description: {
            selector: "#descr"
        },
        imdb: {
            selector: 'input[name="url"][type="text"]'
        },
        douban: {
            selector: 'input[name="douban"]'
        },
        anonymous: {
            selector: 'input[name="uplver"]'
        },
        tags: {
            chinese_audio: "#guoyu",
            diy: "#diy",
            cantonese_audio: "#yueyu",
            chinese_subtitle: "#zhongzi"
        },
        category: {
            selector: "#browsecat",
            map: {
                movie: "401",
                tv: "404",
                tvPack: "404",
                documentary: "402",
                concert: "406",
                sport: "407",
                cartoon: "403",
                variety: "405"
            }
        },
        videoType: {
            selector: 'select[name="source_sel"]',
            map: {
                uhdbluray: "1",
                bluray: "2",
                remux: "3",
                encode: "6",
                web: "5",
                hdtv: "4",
                dvd: "7",
                dvdrip: "7",
                other: "15"
            }
        },
        area: {
            selector: 'select[name="team_sel"]',
            map: {
                CN: "1",
                US: "4",
                EU: "4",
                HK: "2",
                TW: "3",
                JP: "6",
                KR: "5",
                IND: "7",
                OT: "8"
            }
        }
    },
};
var TORRENT_INFO;

function initTorrentInfo(){
    TORRENT_INFO = {
        title: "",
        subtitle: "",
        description: "",
        originalDescription: "",
        year: "",
        category: "",
        videoType: "",
        format: "",
        source: "",
        videoCodec: "",
        audioCodec: "",
        resolution: "",
        area: "",
        doubanUrl: "",
        doubanInfo: "",
        doubanInfos: {},
        imdbUrl: "",
        tags: {
            diy: false,
            chinese_audio: false,
            cantonese_audio: false,
            chinese_subtitle: false,
            dolby_atoms: false,
            dts_x: false,
            hdr: false,
            dolby_vision: false,
            buyitmyself: false
        },
        otherTags: {},
        mediaInfo: "",
        mediaInfos: {},
        bdInfo: "",
        bdInfos: {},
        screenshots: [],
        comparisons: [],
        movieAkaName: "",
        movieName: "",
        sourceSite: "",
        sourceSiteType: "",
        size: "",
        isForbidden: false,
        poster: "",
        metaInfos: {},
        metaTags: "",
        BIArea: "",
        url: "",
        filelistUrl: "",
        downloadInfo: "",
        test: "",
        isTagBuyMySelf: false,
        isTagDiy: false,
        isTagInternal: false,
    };
}


var EUROPE_LIST = ["Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "UK", "Vatican City"];

var CURRENT_SITE_INFO = PT_SITE.PTer;
var CURRENT_SITE_NAME = 'PTer';

var getPreciseCategory = (torrentInfo, category) => {
    var _a, _b;
    const { description, title, subtitle, doubanInfo } = torrentInfo;
    const movieGenre = (_b = (_a = (description + doubanInfo).match(/(类\s+别)\s+(.+)?/)) == null ? void 0 : _a[2]) != null ? _b : "";
    if (category === "movie") {
        if (movieGenre.match(/动画/)) {
            category = "cartoon";
        } else if (movieGenre.match(/纪录/)) {
            category = "documentary";
        }
    } else if (category == null ? void 0 : category.match(/tv/)) {
        if (movieGenre.match(/动画/)) {
            category = "cartoon";
        } else if (movieGenre.match(/纪录/)) {
            category = "documentary";
        } else {
            category = "tvplay";
        }
        // else if (title.match(/(s0?\d{1,2})?e(p)?\d{1,2}/i) || (subtitle == null ? void 0 : subtitle.match(/第[^\s]集/))) {
        //   category = "tvplay";
        // } else {
        //   category = "tvPack";
        // }
    }
    return category;
};

var getUrlParam = (key) => {
    const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    const regArray = location.search.substr(1).match(reg);
    if (regArray) {
        return unescape(regArray[2]);
    }
    return "";
};
var getAudioCodecFromTitle = (title) => {
    if (!title) {
        return "";
    }
    title = title.replace(/:|-|\s/g, "");
    if (title.match(/dtshdma/i)) {
        return "dtshdma";
    } else if (title.match(/dtsx/i) && !title.match(/dtsx2/i)) {
        return "dtsx";
    } else if (title.match(/dts/i)) {
        return "dts";
    } else if (title.match(/atmos/i)) {
        return "atmos";
    } else if (title.match(/truehd/i)) {
        return "truehd";
    } else if (title.match(/lpcm/i)) {
        return "lpcm";
    } else if (title.match(/flac/i)) {
        return "flac";
    } else if (title.match(/aac/i)) {
        return "aac";
    } else if (title.match(/DD\+|DDP|DolbyDigitalPlus/i) && !title.match(/DDPT/i)) {
        return "dd+";
    } else if (title.match(/DD|DolbyDigital/i)) {
        return "dd";
    } else if (title.match(/eac3/i)) {
        return "eac3";
    } else if (title.match(/ac3/i)) {
        return "ac3";
    } else if (title.match(/pcm/i)) {
        return "pcm";
    } else if (title.match(/mp2/i)) {
        return "mp2";
    } else if (title.match(/mpa2/ig)) {
        return "mpa2";
    } else if (title.match(/atmos/i)) {
        return "atmos";
    }
    return "";
};
var getVideoCodecFromTitle = (title, videoType = "") => {
    title = title.replace(/\.|-/g, "");
    if (videoType == 'uhd' || videoType == 'remux' || videoType == 'uhdbluray' || videoType == 'bluray') {
        if (title.match(/avc/ig)) {
            return 'avc';
        } else if (title.match(/hevc/ig)) {
            return 'hevc';
        }
    } else {
        if (title.match(/x264/ig)) {
            return 'x264';
        } else if (title.match(/av1/ig)) {
            return 'av1';
        } else if (title.match(/vp9/ig)) {
            return 'vp9';
        } else if (title.match(/h264|avc/ig)) {
            return 'h264';
        } else if (title.match(/x265/ig)) {
            return 'x265';
        } else if (title.match(/h265|hevc/ig)) {
            return 'hevc';
        }
    }
    if (title.match(/vc-?1/i)) {
        return "vc-1";
    } else if (title.match(/mpeg-?2/i)) {
        return "mpeg-2";
    }
    return '';
};

var getFilterImages = (bbcode) => {
    if (!bbcode) {
        return [];
    }
    let allImages = bbcode.match(/(\[url=(http(s)*:\/{2}.+?)\])?\[img\](.+?)\[\/img](\[url\])?/g);
    if (allImages && allImages.length > 0) {
        allImages = allImages.map((img) => {
            if (img.match(/\[url=.+?\]/)) {
                return img + "[/url]";
            }
            return img;
        });
        return allImages.filter((item) => {
            return !item.match(/MoreScreens|PTer\.png|trans\.gif|PTerREMUX\.png|PTerWEB\.png|CS\.png|Ourbits_info|GDJT|douban|logo|(2019\/03\/28\/5c9cb8f8216d7\.png)|_front|(info_01\.png)|(screens\.png)|(04\/6b\/Ggp5ReQb_o)|(ce\/e7\/KCmGFMOB_o)/);
        });
    }
    return [];
};

var getScreenshotsFromBBCode = (bbcode) => {
    const allImages = getFilterImages(bbcode);
    if (allImages && allImages.length > 0) {
        return getOriginalImgUrl(allImages);
    }
    return "";
};

var getOriginalImgUrl = (imgArray) => {
    return imgArray.map((item) => {
        var _a, _b, _c, _d, _e, _f;
        let imgUrl = item;
        if (item.match(/\[url=http(s)*:.+/)) {
            imgUrl = (_a = item.match(/=(([^\]])+)/)) == null ? void 0 : _a[1];
            if (item.match(/img\.pterclub\.com/)) {
                imgUrl = (_b = item.match(/img\](([^[])+)/)) == null ? void 0 : _b[1];
                imgUrl = imgUrl.replace(/\.th/g, "");
            } else if (item.match(/https:\/\/imgbox\.com/)) {
                imgUrl = (_c = item.match(/img\](([^[])+)/)) == null ? void 0 : _c[1];
                imgUrl = imgUrl.replace(/thumbs(\d)/, "images$1").replace(/_t(\.png)/, "_o.png");
            } else if (!imgUrl.match(/\.(jpg|png|gif|bmp)$/)) {
                imgUrl = (_d = item.match(/img\](([^[])+)/)) == null ? void 0 : _d[1];
            } else if (item.match(/https:\/\/pixhost\.to/)) {
                const hostNumber = (_e = item.match(/img\]https:\/\/t(\d+)\./)) == null ? void 0 : _e[1];
                imgUrl = imgUrl.replace(/(pixhost\.to)\/show/, `img${hostNumber}.$1/images`);
            }
        } else if (item.match(/\[img\]/)) {
            imgUrl = (_f = item.match(/img\](([^[])+)/)) == null ? void 0 : _f[1];
        }
        return imgUrl;
    });
};

var getDoubanPosterFromBBCode = (bbcode) => {
    let allImages = bbcode.match(/(\[url=(http(s)*:\/{2}.+?)\])?\[img\](.+?)\[\/img](\[url\])?/g);
    if (allImages && allImages.length > 0) {
        if (allImages[0].match(/douban/ig)) {
            return allImages[0].replace(/\[img\]/ig, '').replace(/\[\/img\]/ig, '');
        }
    }
    return "";
}
var getSourceFromTitle = (title) => {
    if (title.match(/(uhd|2160|4k).*(blu(-)?ray|remux)/i)) {
        return "uhddiscs";
    } else if (title.match(/blu(-)?ray|remux/i)) {
        return "bd discs";
    } else if (title.match(/hdtv/i)) {
        return "hdtv";
    } else if (title.match(/web(-(rip|dl))+/i)) {
        return "web";
    } else if (title.match(/hddvd/i)) {
        return "hddvd";
    } else if (title.match(/dvd/i)) {
        return "dvd";
    } else if (title.match(/vhs/i)) {
        return "vhs";
    }
    return "other";
};

var getAreaCode = (area) => {
    const europeList = EUROPE_LIST;
    if (area) {
        if (area.match(/USA|US|美国|美國|英美|欧美|英国|UK|GBR|United Kingdom|United States/i)) {
            return "Western";
        } else if (area.match(/Japan|日本|JP/i)) {
            return "JPN";
        } else if (area.match(/Korea|韩国|KR/i)) {
            return "KOR";
        } else if (area.match(/India|印度\b|IND/i)) {
            return "IND"
        } else if (area.match(/Taiwan|台湾|TW/i)) {
            return "TWN";
        } else if (area.match(/Hong\s?Kong|香港|HK/i)) {
            return "HKG";
        } else if (area.match(/CN|China|大陆|中|内地|Mainland/i)) {
            return "CHN";
        }
    }
    return "Other";
};

var getSize = (size) => {
    if (!size) {
        return "";
    }
    if (size.match(/T/i)) {
        return parseFloat(size) * 1024 * 1024 * 1024 * 1024 || 0;
    } else if (size.match(/G/i)) {
        return parseFloat(size) * 1024 * 1024 * 1024 || 0;
    } else if (size.match(/M/i)) {
        return parseFloat(size) * 1024 * 1024 || 0;
    } else if (size.match(/K/i)) {
        return parseFloat(size) * 1024 || 0;
    }
    return "";
};

var getInfoFromMediaInfo = (mediaInfo) => {
    var _a, _b, _c;
    if (!mediaInfo) {
        return false;
    }

    const mediaArray = mediaInfo.split(/\n\s*\n/).filter((item) => !!item.trim());
    const [generalPart, videoPart] = mediaArray;
    const secondVideoPart = mediaArray.filter((item) => item.startsWith("Video #2"));
    const [audioPart, ...otherAudioPart] = mediaArray.filter((item) => item.startsWith("Audio"));
    const textPart = mediaArray.filter((item) => item.startsWith("Text"));
    const completeName = getMediaValueByKey("Complete name", generalPart);
    const format = (_c = (_b = (_a = completeName == null ? void 0 : completeName.match(/\.(\w+)$/i)) == null ? void 0 : _a[1]) == null ? void 0 : _b.toLowerCase()) != null ? _c : "";
    const fileName = completeName.replace(/\.\w+$/i, "");
    const fileSize = getSize(getMediaValueByKey("File size", generalPart));
    const { videoCodec, hdrFormat, isDV } = getVideoCodecByMediaInfo(videoPart, generalPart, secondVideoPart);
    const { audioCodec, channelName, languageArray, languageArray2 } = getAudioCodecByMediaInfo(audioPart, otherAudioPart);
    const subtitleLanguageArray = textPart.map((item) => {
        // if (getMediaValueByKey("title", item)) {
        //   return getMediaValueByKey("title", item);
        // }
        return getMediaValueByKey("Language", item);
    });
    const mediaTags = getMediaTags(audioCodec, channelName, languageArray, languageArray2, subtitleLanguageArray, hdrFormat, isDV);
    const resolution = getResolution(videoPart);
    TORRENT_INFO.mediaInfos = {
        fileName,
        fileSize,
        format,
        subtitles: subtitleLanguageArray,
        videoCodec,
        audioCodec,
        resolution,
        mediaTags,
        audioPart,
        videoPart,
        generalPart,
        secondVideoPart
    };
    return {
        fileName,
        fileSize,
        format,
        subtitles: subtitleLanguageArray,
        videoCodec,
        audioCodec,
        resolution,
        mediaTags
    };
};

var getMediaValueByKey = (key, mediaInfo) => {
    if (!mediaInfo) {
        return "";
    }
    const keyRegStr = key.replace(/\s/, "\\s*").replace(/(\(|\))/g, "\\$1");
    const reg = new RegExp(`${keyRegStr}\\s*:\\s([^\\n]+)`, "i");
    return mediaInfo.match(reg) ? mediaInfo.match(reg)[1] : "";
};
var getResolution = (mediaInfo) => {
    let height = parseInt(getMediaValueByKey("Height", mediaInfo).replace(/\s/g, ""));
    let width = parseInt(getMediaValueByKey("Width", mediaInfo).replace(/\s/g, ""));
    if (height > width){
        let temp = height;
        height = width;
        width = temp;
    }
    const ScanType = getMediaValueByKey("Scan type", mediaInfo);
    const Standard = getMediaValueByKey("Standard", mediaInfo);
    if (height >= 2160 && 2872 - 10 <= width && width <= 4096 + 10) {
        return '2160p';
    } else if (height >= 1440 && 1915 - 10 <= width && width <= 2560 + 10) {
        return '1440p';
    } else if (height >= 1080 && 1436 - 10 <= width && width <= 1920 + 10 && ScanType === "Progressive") {
        return '1080p';
    } else if (height >= 1080 && 1436 - 10 <= width && width <= 1920 + 10 && ScanType == "MBAFF") {
        return '1080i';
    } else if (height >= 1080 && 1436 - 10 <= width && width <= 1920 + 10 && ScanType == "Interlaced") {
        return '1080i';
    } else if (height >= 720 && 957 - 10 <= width && width <= 1280 + 10 && ScanType === "Progressive") {
        return '720p';
    } else if (height >= 720 && 957 - 10 <= width && width <= 1280 + 10 && ScanType == "MBAFF") {
        return '720i';
    } else if (height >= 720 && 957 - 10 <= width && width <= 1280 + 10 && ScanType == "Interlaced") {
        return '720i';
    } else if (height >= 576 && 726 - 10 <= width && width <= 1024 + 10 && ScanType === "Progressive") {
        return '576p';
    } else if (height >= 576 && 726 - 10 <= width && width <= 1024 + 10 && ScanType == "MBAFF") {
        return '576i';
    } else if (height >= 576 && 726 - 10 <= width && width <= 1024 + 10 && ScanType == "Interlaced") {
        return '576i';
    } else if (height >= 480 && 640 - 10 <= width && width <= 854 + 10 && ScanType === "Progressive") {
        return '480p';
    } else if (height >= 480 && 640 - 10 <= width && width <= 854 + 10 && ScanType == "MBAFF") {
        return '480i';
    } else if (height >= 480 && 640 - 10 <= width && width <= 854 + 10 && ScanType == "Interlaced") {
        return '480i';
    } else if (width <= 854 + 10 && height <= 480 + 10 && ScanType === "Progressive") {
        return '480p';
    } else if (width <= 854 + 10 && height <= 480 + 10 && ScanType == "MBAFF") {
        return '480i';
    } else if (width <= 854 + 10 && height <= 480 + 10 && ScanType == "Interlaced") {
        return '480i';
    } else if (width <= 1024 + 10 && height <= 576 + 10 && height >= 540 + 10 && ScanType === "Progressive") {
        return '576p';
    } else if (width <= 1024 + 10 && height <= 576 + 10 && height >= 540 + 10 && ScanType == "MBAFF") {
        return '576i';
    } else if (width <= 1024 + 10 && height <= 576 + 10 && height >= 540 + 10 && ScanType == "Interlaced") {
        return '576i';
    } else if (width <= 1024 + 10 && height <= 576 + 10 && height >= 480 + 10 ) {
        return '540p';
    } else if (width <= 1280 + 10 && height <= 720 + 10 && height >= 576 + 10 && ScanType === "Progressive") {
        return '720p';
    } else if (width <= 1280 + 10 && height <= 720 + 10 && height >= 576 + 10 && ScanType == "MBAFF") {
        return '720i';
    } else if (width <= 1280 + 10 && height <= 720 + 10 && height >= 576 + 10 && ScanType == "Interlaced") {
        return '720i';
    } else if (width <= 1920 + 10 && height <= 1080 + 10 && height >= 720 + 10 && ScanType === "Progressive") {
        return '1080p';
    } else if (width <= 1920 + 10 && height <= 1080 + 10 && height >= 720 + 10 && ScanType == "MBAFF") {
        return '1080i';
    } else if (width <= 1920 + 10 && height <= 1080 + 10 && height >= 720 + 10 && ScanType == "Interlaced") {
        return '1080i';
    } else if (width <= 2560 + 10 && height <= 1440 + 10 && height >= 1080 + 10) {
        return '1440p';
    } else if (width <= 4096 + 10 && height <= 2160 + 10 && height >= 1440 + 10) {
        return '2160p';
    } else if (width <= 1920 + 10 && height <= 1080 + 10 && height >= 720 + 10 ) {
        return '1080p';
    } else if (width <= 1280 + 10 && height <= 720 + 10 && height >= 576 + 10 ) {
        return '720p';
    } else if (width <= 1024 + 10 && height <= 576 + 10 && height >= 480 + 10 ) {
        return '576p';
    }
    else if (Standard == 'NTSC') { // dvd原盘才判断这个
        return 'NTSC';
    } 
    else {
        return '';
    }
};
var getMediaTags = (audioCodec, channelName, languageArray, languageArray2, subtitleLanguageArray, hdrFormat, isDV) => {
    const hasChineseAudio = languageArray.includes("Chinese");
    const hasChineseSubtitle = subtitleLanguageArray.includes("Chinese");
    const mediaTags = {};
    if (hasChineseAudio) {
        mediaTags.chinese_audio = true;
    }
    if (languageArray.includes("Cantonese") || languageArray2.toString().match("Cantonese")) {
        mediaTags.cantonese_audio = true;
    }
    if (hasChineseSubtitle) {
        mediaTags.chinese_subtitle = true;
    }
    if (hdrFormat) {
        if (hdrFormat.match(/HDR10\+/i)) {
            mediaTags.hdr10_plus = true;
        } else if (hdrFormat.match(/HDR/i)) {
            mediaTags.hdr = true;
        }
    }
    if (isDV) {
        mediaTags.dolby_vision = true;
    }
    if (audioCodec.match(/dtsx|atmos/ig)) {
        mediaTags.dts_x = true;
    } else if (audioCodec.match(/atmos/ig)) {
        mediaTags.dolby_atmos = true;
    }
    return mediaTags;
};
var getVideoCodecByMediaInfo = (mainVideo, generalPart, secondVideo, videoType) => {
    const generalFormat = getMediaValueByKey("Format", generalPart);
    const videoFormat = getMediaValueByKey("Format", mainVideo);
    const videoFormatVersion = getMediaValueByKey("Format version", mainVideo);
    const videoCodeId = getMediaValueByKey("Codec ID", mainVideo);
    const hdrFormat = getMediaValueByKey("HDR format", mainVideo);
    //   const isDV = hdrFormat.match(/Dolby\s*Vision/i) || secondVideo.length > 0 && getMediaValueByKey("HDR format", secondVideo[0]).match(/Dolby\s*Vision/i);
    const isDV = '暂无';
    const isEncoded = getMediaValueByKey("Encoding settings", mainVideo).match(/(x264|x265|av1)/i);
    // const isEncoded = !!getMediaValueByKey("Encoding settings", mainVideo);
    const writinglibrary = getMediaValueByKey("Writing library", mainVideo);
    let videoCodec = "";
    if (videoFormat === "MPEG Video" && videoFormatVersion === "Version 2") {
        videoCodec = "mpeg2";
    } else if (videoCodeId.match(/xvid/i)) {
        videoCodec = "xvid";
    } else if (videoFormat.match(/HEVC/i) && !isEncoded) {
        videoCodec = "hevc";
    } else if (videoFormat.match(/HEVC/i) && isEncoded) {
        videoCodec = "x265";
    } else if (videoFormat.match(/AV1/i) ) {
        videoCodec = "av1";
    } else if (videoFormat.match(/VP9/i) ) {
        videoCodec = "vp9";
    } else if ((videoFormat.match(/AVC/i) && isEncoded) || writinglibrary.match(/x264/i)) {
        videoCodec = "x264";
    } else if (videoFormat.match(/AVC/i) && !isEncoded) {
        videoCodec = "h264";
    } else if (videoFormat.match(/VC-1/i)) {
        videoCodec = "vc1";
    } else if (generalFormat === "MPEG-4") {
        videoCodec = "mpeg4";
    } else if (generalFormat === "DVD Video") {
        videoCodec = "mpeg2";
    }
    return {
        videoCodec,
        hdrFormat,
        isDV
    };
};
var getAudioCodecByMediaInfo = (mainAudio, otherAudio = []) => {
    const audioFormat = getMediaValueByKey("Format", mainAudio);
    const audioChannels = getMediaValueByKey("Channel(s)", mainAudio);
    const commercialName = getMediaValueByKey("Commercial name", mainAudio);
    const languageArray = [mainAudio, ...otherAudio].map((item) => {
        return getMediaValueByKey("Language", item);
    });
    const languageArray2 = [mainAudio, ...otherAudio].map((item) => {
        if (getMediaValueByKey("title", item)) {
            return getMediaValueByKey("title", item);
        }
        return getMediaValueByKey("Language", item);
    });
    let channelName = "";
    let audioCodec = "";
    const channelNumber = parseInt(audioChannels);
    if (channelNumber && channelNumber >= 6) {
        channelName = `${channelNumber - 1}.1`;
    } else {
        channelName = `${channelNumber}.0`;
    }
    if (audioFormat.match(/MLP FBA/i) && commercialName.match(/Dolby Atmos/i)) {
        audioCodec = "atmos";
    } else 
    if (audioFormat.match(/MLP FBA/i) && !commercialName.match(/Dolby Atmos/i)) {
        audioCodec = "truehd";
    } else if (audioFormat.match(/E-AC-3/i)) {
        audioCodec = "eac3";
    } else if (audioFormat.match(/AC-3/i) && commercialName.match(/Dolby Digital Plus/i)) {
        audioCodec = "dd+";
    } else if (audioFormat.match(/AC-3/i) && commercialName.match(/Dolby Digital/i)) {
        audioCodec = "dd";
    } else if (audioFormat.match(/AC-3/i)) {
        audioCodec = "ac3";
    } else if (audioFormat.match(/DTS XLL X/i)) {
        audioCodec = "dtsx";
    } else if (audioFormat.match(/DTS/i) && commercialName.match(/DTS-HD Master Audio/i)) {
        audioCodec = "dtshdma";
    } else if (audioFormat.match(/DTS/i)) {
        audioCodec = "dts";
    } else if (audioFormat.match(/FLAC/i)) {
        audioCodec = "flac";
    } else if (audioFormat.match(/AAC/i)) {
        audioCodec = "aac";
    } else if (audioFormat.match(/LPCM/i)) {
        audioCodec = "lpcm";
    } else if (audioFormat.match(/pcm/i)) {
        audioCodec = "pcm";
    } else if (audioFormat.match(/mpeg/i)) {
        audioCodec = "mp2";
    }
    return {
        audioCodec,
        channelName,
        languageArray,
        languageArray2
    };
};

var getInfoFromBDInfo = (bdInfo) => {
    var _a, _b, _c, _d;
    if (!bdInfo) {
        return "";
    }
    const splitArray = bdInfo.split("Disc Title");
    if (splitArray.length > 2) {
        bdInfo = splitArray[1];
    }
    const videoMatch = bdInfo.match(/VIDEO:(\s|Codec|Bitrate|Description|Language|-)*((.|\n)*)AUDIO:/i);
    const hasFileInfo = bdInfo.match(/FILES:/i);
    const subtitleReg = new RegExp(`SUBTITLE(S)*:(\\s|Codec|Bitrate|Description|Language|-)*((.|\\n)*)${hasFileInfo ? "FILES:" : ""}`, "i");
    const subtitleMatch = bdInfo.match(subtitleReg);
    const audioReg = new RegExp(`AUDIO:(\\s|Codec|Bitrate|Description|Language|-)*((.|\\n)*)${subtitleMatch ? "(SUBTITLE(S)?)" : hasFileInfo ? "FILES:" : ""}`, "i");
    const audioMatch = bdInfo.match(audioReg);
    const fileSize = (_b = (_a = bdInfo.match(/Disc\s*Size:\s*((\d|,| )+)bytes/)) == null ? void 0 : _a[1]) == null ? void 0 : _b.replace(/,/g, "");
    const quickSummaryStyle = !bdInfo.match(/PLAYLIST REPORT/i);
    const videoPart = splitBDMediaInfo(videoMatch, 2);
    if (videoPart) {
        for (let i = videoPart.length - 1; i >= 0; i--) {
            if (!videoPart[i].match(/video/ig)) {
                videoPart.splice(i, 1);
            }
        }
    }
    const [mainVideo = "", otherVideo = ""] = videoPart;
    const videoCodec = getVideoCodecByBDInfo(mainVideo);
    const hdrFormat = (_c = mainVideo.match(/\/\s*HDR(\d)*(\+)*\s*\//i)) == null ? void 0 : _c[0];
    const isDV = !!otherVideo.match(/\/\s*Dolby\s*Vision\s*/i);
    const audioPart = splitBDMediaInfo(audioMatch, 0);
    if (audioPart) {
        for (let i = audioPart.length - 1; i >= 0; i--) {
            if (!audioPart[i].match(/Audio/g)) {
                audioPart.splice(i, 1);
            }
        }
    }
    const subtitlePart = splitBDMediaInfo(subtitleMatch, 0);
    const resolution = (_d = mainVideo.match(/\d{3,4}(p|i)/)) == null ? void 0 : _d[0];
    const { audioCodec = "", channelName = "", languageArray = [] } = getBDAudioInfo(audioPart, quickSummaryStyle);
    const languageArray2 = languageArray;
    const subtitleLanguageArray = subtitlePart.map((item) => {
        var _a2, _b2;
        const quickStyleMatch = (_a2 = item.match(/(\w+)\s*\//)) == null ? void 0 : _a2[1];
        const normalMatch = (_b2 = item.match(/Graphics\s*(\w+)\s*(\d|\.)+\s*kbps/i)) == null ? void 0 : _b2[1];
        const language = quickSummaryStyle ? quickStyleMatch : normalMatch;
        return language;
    });
    const mediaTags = getMediaTags(audioCodec, channelName, languageArray, languageArray2, subtitleLanguageArray, hdrFormat, isDV);
    TORRENT_INFO.bdInfos = {
        fileSize,
        videoCodec,
        subtitles: subtitleLanguageArray,
        audioCodec,
        resolution,
        mediaTags
    };
    return {
        fileSize,
        videoCodec,
        subtitles: subtitleLanguageArray,
        audioCodec,
        resolution,
        mediaTags
    };
};
var getVideoCodecByBDInfo = (mainVideo) => {
    if (mainVideo) {
        if (mainVideo.match(/vc\-1/ig)) {
            return 'vc-1';
        } else if (mainVideo.match(/mpeg\-2/ig)) {
            return 'mpeg-2';
        } else if (mainVideo.match(/mpeg\-4\savc/ig)) {
            return 'avc';
        } else if (mainVideo.match(/mpeg\-4\smvc/ig)) {
            return 'mvc';
        } else if (mainVideo.match(/mpeg\-h\shevc/ig)) {
            return 'hevc';
        }
        else {
            return '';
        }
    }
};
var splitBDMediaInfo = (matchArray, matchIndex) => {
    var _a, _b;
    return (_b = (_a = matchArray == null ? void 0 : matchArray[matchIndex]) == null ? void 0 : _a.split("\n").filter((item) => !!item)) != null ? _b : [];
};
var getBDAudioInfo = (audioPart, quickSummaryStyle) => {
    var _a, _b;
    if (audioPart.length < 1) {
        return {};
    }
    const sortArray = audioPart.sort((a, b) => {
        var _a2, _b2;
        const firstBitrate = parseInt((_a2 = a.match(/\/\s*(\d+)\s*kbps/i)) == null ? void 0 : _a2[1]);
        const lastBitrate = parseInt((_b2 = b.match(/\/\s*(\d+)\s*kbps/i)) == null ? void 0 : _b2[1]);
        return lastBitrate - firstBitrate;
    });
    const [mainAudio, secondAudio] = sortArray;
    const mainAudioCodec = getAudioCodecFromTitle(mainAudio);
    const secondAudioCodec = getAudioCodecFromTitle(secondAudio);
    let audioCodec = mainAudioCodec;
    let channelName = (_a = mainAudio.match(/\d\.\d/)) == null ? void 0 : _a[0];
    if (mainAudioCodec === "lpcm" && ["dtshdma", "truehd"].includes(secondAudioCodec)) {
        audioCodec = secondAudioCodec;
        channelName = (_b = mainAudio.match(/\d\.\d/)) == null ? void 0 : _b[0];
    }
    const languageArray = sortArray.map((item) => {
        var _a2, _b2;
        const quickStyleMatch = (_a2 = item.match(/(\w+)\s*\//)) == null ? void 0 : _a2[1];
        const normalMatch = (_b2 = item.match(/Audio\s*(\w+)\s*\d+\s*kbps/)) == null ? void 0 : _b2[1];
        const language = quickSummaryStyle ? quickStyleMatch : normalMatch;
        return language;
    });
    return {
        audioCodec,
        channelName,
        languageArray
    };
};
var wrappingBBCodeTag = ({ pre, post, tracker }, preTag, poTag) => {
    const isPre = typeof pre !== "undefined" && pre !== null;
    const isPost = typeof post !== "undefined" && post !== null;
    if (isPre) {
        pre.unshift(preTag);
    }
    if (isPost) {
        post.push(poTag);
    }
};
var getFilterBBCode = (content) => {
    if (content) {
        const bbCodes = htmlToBBCode(content);
        // return bbCodes.replace(/\[quote\]((.|\n)*?)\[\/quote\]/g, function (match, p1) {
        //     if (p1 && p1.match(/温馨提示|郑重|PT站|网上搜集|本种子|商业盈利|商业用途|带宽|寬帶|法律责任|Quote:|正版|商用|注明|后果|负责/)) {
        //         return "";
        //     }
        //     return match;
        // });
        return bbCodes;
    }
};
var rgb2hex = (rgb) => {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return rgb && rgb.length === 4 ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : "";
};
var ensureProperColor = (color) => {
    if (/rgba?/.test(color))
        return rgb2hex(color);
    return color;
};
var htmlToBBCode = (node) => {
    const bbCodes = [];
    const pre = [];
    const post = [];
    const pp = wrappingBBCodeTag.bind(null, { pre, post });
    switch (node.nodeType) {
        case 1: {
            switch (node.tagName.toUpperCase()) {
                case "SCRIPT": {
                    return "";
                }
                case "UL": {
                    pp(null, null);
                    break;
                }
                case "OL": {
                    pp("[list=1]", "[/list]");
                    break;
                }
                case "LI": {
                    const { className } = node;
                    if (CURRENT_SITE_INFO.siteType === "UNIT3D" && className) {
                        return `[quote]${node.textContent.trim()}[/quote]`;
                    } else {
                        pp("[*]", "\n");
                        break;
                    }
                }
                case "B": {
                    pp("[b]", "[/b]");
                    break;
                }
                case "U": {
                    pp("[u]", "[/u]");
                    break;
                }
                case "I": {
                    pp("[i]", "[/i]");
                    break;
                }
                case "DIV": {
                    const { className } = node;
                    if (className === "codemain") {
                        if (node.firstChild && node.firstChild.tagName === "PRE") {
                            pp("");
                            break;
                        } else {
                            node.innerHTML = node.innerHTML.replace(/&nbsp;/g, " ");
                            return `
[quote]${node.textContent}[/quote]`;
                        }
                    } else {
                        pp("\n", "\n");
                        break;
                    }
                }
                case "P": {
                    pp("\n");
                    break;
                }
                case "BR": {
                    if (CURRENT_SITE_INFO.siteType === "NexusPHP") {
                        pp("");
                    } else {
                        pp("\n");
                    }
                    break;
                }
                case "SPAN": {
                    pp(null, null);
                    break;
                }
                case "BLOCKQUOTE":
                case "PRE":
                case "FIELDSET": {
                    pp("[quote]", "[/quote]");
                    break;
                }
                case "CENTER": {
                    pp("[center]", "[/center]");
                    break;
                }
                case "TD": {
                    return "";
                }
                case "IMG": {
                    let imgUrl = "";
                    const { src, title } = node;
                    const dataSrc = node.getAttribute("data-src") || node.getAttribute("data-echo");
                    if (title === ":m:") {
                        return ":m:";
                    }
                    if (dataSrc) {
                        imgUrl = dataSrc.match(/(http(s)?:)?\/\//) ? dataSrc : location.origin + "/" + dataSrc;
                    } else if (src && !src.match(/ico_\w+.gif|jinzhuan|thumbsup|kralimarko/)) {
                        imgUrl = src;
                    } else {
                        return "";
                    }
                    return `[img]${imgUrl}[/img]`;
                }
                case "FONT": {
                    const { color: color2, size } = node;
                    if (color2) {
                        pp(`[color=${ensureProperColor(color2)}]`, "[/color]");
                    }
                    if (size) {
                        pp(`[size=${size}]`, "[/size]");
                    }
                    break;
                }
                case "A": {
                    const { href, textContent } = node;
                    if (href && href.length > 0) {
                        if (href.match(/javascript:void/) || textContent === "show" && CURRENT_SITE_NAME === "HDT") {
                            return "";
                        } else {
                            pp(`[url=${href}]`, "[/url]");
                        }
                    }
                    break;
                }
                case "H1": {
                    pp('[b][size="7"]', "[/size][/b]\n");
                    break;
                }
                case "H2": {
                    pp('[b][size="6"]', "[/size][/b]\n");
                    break;
                }
                case "H3": {
                    pp('[b][size="5"]', "[/size][/b]\n");
                    break;
                }
                case "H4": {
                    pp('[b][size="4"]', "[/size][/b]\n");
                    break;
                }
            }
            const { textAlign, fontWeight, fontStyle, textDecoration, color } = node.style;
            if (textAlign) {
                switch (textAlign.toUpperCase()) {
                    case "LEFT": {
                        pp("[left]", "[/left]");
                        break;
                    }
                    case "RIGHT": {
                        pp("[right]", "[/right]");
                        break;
                    }
                    case "CENTER": {
                        pp("[center]", "[/center]");
                        break;
                    }
                }
            }
            if (fontWeight === "bold" || ~~fontWeight >= 600) {
                pp("[b]", "[/b]");
            }
            if (fontStyle === "italic")
                pp("[i]", "[/i]");
            if (textDecoration === "underline")
                pp("[u]", "[/u]");
            if (color && color.trim() !== "")
                pp(`[color=${ensureProperColor(color)}]`, "[/color]");
            break;
        }
        case 3: {
            if (node.textContent.trim().match(/^(引用|Quote|代码|代碼|Show|Hide|Hidden text|Hidden content|\[show\]|\[Show\])/)) {
                return "";
            }
            return node.textContent;
        }
        default:
            return null;
    }
    node.childNodes.forEach((node2, i) => {
        const code = htmlToBBCode(node2);
        if (code) {
            bbCodes.push(code);
        }
    });
    return pre.concat(bbCodes).concat(post).join("");
};
var getTagsFromSubtitle = (title) => {
    const tags = {};
    if (title.match(/diy/i)) {
        tags.diy = true;
    }
    if (title.match(/国配|国语|普通话|国粤/i) && !title.match(/多国语言/)) {
        tags.chinese_audio = true;
    }
    if (title.match(/Atmos|杜比全景声/i)) {
        tags.dolby_atoms = true;
    }
    if (title.match(/HDR/i)) {
        if (title.match(/HDR10\+/i)) {
            tags.hdr10_plus = true;
        } else {
            tags.hdr = true;
        }
    }
    if (title.match(/DoVi|(Dolby\s*Vision)|杜比视界/i)) {
        tags.dolby_vision = true;
    }
    if (title.match(/粤/i)) {
        tags.cantonese_audio = true;
    }
    if (title.match(/简繁|繁简|繁体|简体|中字|中英|中文/i)) {
        tags.chinese_subtitle = true;
    }
    if (title.match(/Criterion|CC标准/i)) {
        tags.the_criterion_collection = true;
    }
    return tags;
};
var getBDInfoOrMediaInfo = (bbcode) => {
    var _a, _b, _c;
    const quoteList = (_a = bbcode == null ? void 0 : bbcode.match(/\[quote\](.|\n)+?\[\/quote\]/g)) != null ? _a : [];
    let bdinfo = "";
    let mediaInfo = "";
    quoteList.forEach((quote) => {
        const quoteContent = quote.replace(/\[\/?quote\]/g, "").replace(/\u200D/g, "");
        if (quoteContent.match(/Disc\s?Size|\.mpls/i)) {
            bdinfo += quoteContent;
        }
        if (quoteContent.match(/(Unique\s*ID)|(Codec\s*ID)|(Stream\s*size)/i)) {
            mediaInfo += quoteContent;
        }
    });
    if (!bdinfo) {
        bdinfo = (_c = (_b = bbcode.match(/Disc\s+(Info|Title|Label)[^[]+/i)) == null ? void 0 : _b[0]) != null ? _c : "";
    }
    return {
        bdinfo,
        mediaInfo
    };
};


var nexusphp_default = async (docHtml) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    // let title = formatTorrentTitle((_b = (_a = $("#top").text().split(/\s{3,}/)) == null ? void 0 : _a[0]) == null ? void 0 : _b.trim());
    let sourceTitle = $('#top', docHtml).html();
    let title;
    if (sourceTitle.match(/\<b\>/ig)) {
        title = sourceTitle.slice(0, sourceTitle.indexOf('<b>')).replace(/\.(?!(\d+))/ig, " ").replace(/\.(?=\d{4}|48|57|72|2k|4k|7.1|6.1|5.1|4.1|2.0|1.0)/ig, " ").replace(/\&nbsp\;/ig, '').trim();
    } else {
        title = sourceTitle;
    }
    // let title = sourceTitle.slice(0, sourceTitle.indexOf('<b>')).replace(/\.(?!(\d+))/ig, " ").replace(/\.(?=\d{4}|48|57|72|2k|4k|7.1|6.1|5.1|4.1|2.0|1.0)/ig, " ").replace(/\&nbsp\;/ig, '').trim();
    let downloadInfo = $("td.rowhead:contains('\u4e0b\u8f7d')", docHtml).next().html();
    TORRENT_INFO.downloadInfo = downloadInfo;
    let metaInfo = $("td.rowhead:contains('\u57FA\u672C\u4FE1\u606F'), td.rowhead:contains('\u57FA\u672C\u8CC7\u8A0A')", docHtml).next().text().replace(/：/g, ":");
    let metaTags = $("td.rowhead:contains('\u7c7b\u522b\u4e0e\u6807\u7b7e')", docHtml).next().html();
    TORRENT_INFO.metaTags = metaTags;
    let imdbUrl = $("td.rowhead:contains('\u0049\u004d\u0044\u0062\u94fe\u63a5')", docHtml).next()[0].innerText;
    let doubanUrl = $("td.rowhead:contains('\u8c46\u74e3\u94fe\u63a5')", docHtml).next()[0].innerText;
    let subtitle = $("td.rowhead:contains('\u526F\u6807\u9898'), td.rowhead:contains('\u526F\u6A19\u984C')", docHtml).next().text();
    let siteImdbUrl = $("#kimdb>a", docHtml).attr("href");
    TORRENT_INFO.url = window.location.href;
    let descriptionBBCode;

    if (TORRENT_INFO.url.match(/offers/ig)) {
        let hideDescription = $(docHtml).createElement('div');
        hideDescription.innerHTML = $("td.rowhead:contains('\u7b80\u4ecb')", docHtml).next()[0].innerHTML;
        hideDescription.id = 'hideDescription';
        hideDescription.style.display = 'none';
        $(docHtml).getElementById('footer').appendChild(hideDescription);
        descriptionBBCode = htmlToBBCode($("#hideDescription", docHtml)[0]);
    } else {
        descriptionBBCode = getFilterBBCode($("#kdescr", docHtml)[0]);
    }

    // if (CURRENT_SITE_NAME === "PTer") {
    // if ($("#descrcopyandpaster")[0]) {
    //     descriptionBBCode = (_g = $("#descrcopyandpaster").val()) == null ? void 0 : _g.replace(/hide(=(MediaInfo|BDInfo))?\]/ig, "quote]");
    // } else {
    // descriptionBBCode = getFilterBBCode($("#kdescr")[0]);
    // }
    // }
    const year = title.match(/(19|20)\d{2}/g);
    const { category, videoType, videoCodec, audioCodec, resolution, processing, size } = getMetaInfo(metaInfo);
    TORRENT_INFO.metaInfos = { category, videoType, videoCodec, audioCodec, resolution, processing, size };
    TORRENT_INFO.metaInfos.processing = getAreaCode(processing);
    TORRENT_INFO.sourceSite = CURRENT_SITE_NAME;
    TORRENT_INFO.sourceSiteType = CURRENT_SITE_INFO.siteType;
    // const doubanUrl = (_m = descriptionBBCode.match(/https:\/\/((movie|book)\.)?douban.com\/subject\/\d+/)) == null ? void 0 : _m[0];
    if (doubanUrl) {
        TORRENT_INFO.doubanUrl = doubanUrl;
    }
    // const imdbUrl = (_n = descriptionBBCode.match(/http(s)?:\/\/www.imdb.com\/title\/tt\d+/)) == null ? void 0 : _n[0];
    if (imdbUrl) {
        TORRENT_INFO.imdbUrl = imdbUrl;
    } else if (siteImdbUrl) {
        TORRENT_INFO.imdbUrl = siteImdbUrl.match(/www.imdb.com\/title/) ? siteImdbUrl : "";
    }
    TORRENT_INFO.year = year ? year.pop() : "";
    TORRENT_INFO.title = title;
    TORRENT_INFO.subtitle = subtitle;
    TORRENT_INFO.description = descriptionBBCode;
    const originalName = (_p = (_o = descriptionBBCode.match(/(片\s+名)\s+(.+)?/)) == null ? void 0 : _o[2]) != null ? _p : "";
    const translateName = (_r = (_q = descriptionBBCode.match(/(译\s+名)\s+(.+)/)) == null ? void 0 : _q[2]) != null ? _r : "";
    if (!originalName.match(/[\u4e00-\u9fa5]+/)) {
        TORRENT_INFO.movieName = originalName;
    } else {
        TORRENT_INFO.movieName = (_u = (_t = (_s = translateName.match(/(\w|\s){2,}/)) == null ? void 0 : _s[0]) == null ? void 0 : _t.trim()) != null ? _u : "";
    }
    const fullInformation = $("#top", docHtml).text() + subtitle + descriptionBBCode;
    const isForbidden = fullInformation.match(/独占|禁转|严禁转载|谢绝转载|exclusive/);
    TORRENT_INFO.isForbidden = !!isForbidden;

    let BIArea = (_v = descriptionBBCode.match(/(产\s+地|產\s+地|国\s+家|地\s+区)】?\s*(.+)/)) == null ? void 0 : _v[2];
    let BIAreaArr;
    if (BIArea) {
        if (BIArea.match(/[\/,，]/ig)) {
            BIAreaArr = BIArea.split(/[\/,，]/);
            BIArea = BIAreaArr[0];
        }
    }
    if (BIArea) {
        TORRENT_INFO.BIArea = getAreaCode(BIArea);
    } else {
        console.log('未在简介获取到地区信息');
    }

    if (!processing || processing.match(/raw|encode/)) {
        const areaMatch = (_v = descriptionBBCode.match(/(产\s+地|国\s+家)】?\s*(.+)/)) == null ? void 0 : _v[2];
        if (areaMatch) {
            TORRENT_INFO.area = getAreaCode(areaMatch);

        }
    } else {
        TORRENT_INFO.area = getAreaCode(processing);
    }

    const specificCategory = getPreciseCategory(TORRENT_INFO, getCategory2(category || descriptionBBCode));
    TORRENT_INFO.category = specificCategory;
    TORRENT_INFO.videoType = getVideoType5(videoType || TORRENT_INFO.title);
    TORRENT_INFO.source = getSourceFromTitle(TORRENT_INFO.title);
    TORRENT_INFO.size = size ? getSize(size) : "";
    TORRENT_INFO.screenshots = getScreenshotsFromBBCode(descriptionBBCode);
    TORRENT_INFO.poster = getDoubanPosterFromBBCode(descriptionBBCode);
    const tags = getTagsFromSubtitle(TORRENT_INFO.subtitle);
    const pageTags = getTagsFromPage();
    TORRENT_INFO.tags = __assign(__assign({}, tags), pageTags);
    TORRENT_INFO.videoCodec = getVideoCodecFromTitle(TORRENT_INFO.title || videoCodec, TORRENT_INFO.videoType);
    TORRENT_INFO.resolution = getResolution3(resolution || TORRENT_INFO.title);
    TORRENT_INFO.audioCodec = getAudioCodecFromTitle(audioCodec || TORRENT_INFO.title);
    const isBluray = TORRENT_INFO.videoType.match(/(bluray|uhddiscs|bddiscs)/i);
    const { bdinfo, mediaInfo } = getBDInfoOrMediaInfo(descriptionBBCode);
    const mediaInfoOrBDInfo = isBluray ? bdinfo : TORRENT_INFO.mediaInfo || mediaInfo;
    if (mediaInfoOrBDInfo) {
        TORRENT_INFO.mediaInfo = mediaInfoOrBDInfo;
        const getInfoFunc = isBluray ? getInfoFromBDInfo : getInfoFromMediaInfo;
        const { videoCodec: videoCodec2, audioCodec: audioCodec2, resolution: resolution2, mediaTags } = getInfoFunc(mediaInfoOrBDInfo);
        if (videoCodec2 !== "" && audioCodec2 !== "" && resolution2 !== "") {
            TORRENT_INFO.videoCodec = videoCodec2;
            TORRENT_INFO.audioCodec = audioCodec2;
            TORRENT_INFO.resolution = resolution2;
            TORRENT_INFO.tags = __assign(__assign({}, TORRENT_INFO.tags), mediaTags);
        }
    }
    if (CURRENT_SITE_INFO === "TCCF") {
        TORRENT_INFO.format = getFormat3(videoType);
    } else {
        TORRENT_INFO.format = getFormat3($("#top", docHtml).text() + subtitle);
    }
    if (CURRENT_SITE_NAME === "HaresClub") {
        TORRENT_INFO.mediaInfo = $("#kfmedia", docHtml).text();
    }
    // TORRENT_INFO.isTitleMatchPter = TORRENT_INFO.title.match(/[@-]\s?(PTer)/i);
    TORRENT_INFO.isTagBuyMySelf = TORRENT_INFO.metaTags.match(/tag_buyitmyself/ig);
    TORRENT_INFO.isTagDiy = TORRENT_INFO.metaTags.match(/tag_doityourself/ig);
    TORRENT_INFO.isTagInternal = TORRENT_INFO.metaTags.match(/tag_internal=yes/ig)
};

var getMetaInfo = (metaInfo) => {
    let resolutionKey = "分辨率|解析度|格式";
    let videoTypeKey = "媒介|来源|质量";
    const category = getMetaValue("类型|分类|類別", metaInfo);
    let videoType = getMetaValue(videoTypeKey, metaInfo);
    const videoCodec = getMetaValue("编码|編碼", metaInfo);
    const audioCodec = getMetaValue("音频|音频编码", metaInfo);
    const resolution = getMetaValue(resolutionKey, metaInfo);
    const processing = getMetaValue("处理|處理|地区", metaInfo);
    const size = getMetaValue("大小", metaInfo);
    if (videoType.match(/ultrahd/ig)) {
        videoType = 'uhdbluray';
    }
    return {
        category,
        videoType,
        videoCodec,
        audioCodec,
        resolution,
        processing,
        size
    };
};
var getMetaValue = (key, metaInfo) => {
    var _a;
    let regStr = `(${key}):\\s?([^\u4E00-\u9FA5]+)?`;
    if (key.match(/大小/)) {
        regStr = `(${key}):\\s?((\\d|\\.)+\\s+(G|M|T|K)(i)?B)`;
    }
    if (CURRENT_SITE_NAME === "PTer" && key.match(/类型|地区/)) {
        regStr = `(${key}):\\s?([^\\s]+)?`;
    }
    const reg = new RegExp(regStr);
    const matchValue = (_a = metaInfo.match(reg, "i")) == null ? void 0 : _a[2];
    if (matchValue) {
        return matchValue.replace(/\s/g, "").trim().toLowerCase();
    }
};
var getVideoType5 = (videoType) => {
    if (!videoType) {
        return "";
    }

    videoType = videoType.replace(/[.-]/g, "").toLowerCase();
    if (videoType.match(/remux/ig)) {
        return "remux";
    } else if (videoType.match(/webdl|webrip/ig)) {
        return "web-dl";
    } else if (videoType.match(/hdtv/ig)) {
        return "hdtv";
    } else if (videoType.match(/encode|x264|x265|av1|h264|h265|hevc|bdrip|brrip|hdrip|dvdrip|压制/ig)) {
        return "encode";
    } else if (videoType.match(/dvdr/ig)) {
        return "dvdrip";
    } else if (videoType.match(/dvd/ig)) {
        return "dvddiscs";
    } else if (videoType.match(/uhd|ultrahd|2160p/ig)  && !videoType.match(/x264|x265|av1|h264|h265/ig)) {
        return "uhddiscs";
    } else if (videoType.match(/blu|bd/ig)) {
        return "bddiscs";
    }
    return "";
};
var getCategory2 = (category) => {
    if (!category) {
        return "";
    }
    category = category.replace(/[.-]/g, "").toLowerCase();
    if (category.match(/movie|bd|ultra|电影/ig)) {
        return "movie";
    } else if (category.match(/综艺|TV\sShow/ig)) {
        return "tvshow";
    } else if (category.match(/anime|动(画|漫)/ig)) {
        return "anime";
    } else if (category.match(/音乐短片|mv/ig)) {
        return "mv";
    } else if (category.match(/音乐|music/ig)) {
        return "music";
    } else if (category.match(/documentary|纪录片/ig)) {
        return "documentary";
    } else if (category.match(/舞台演出|Stage\sPerformance/ig)) {
        return "stage";
    } else if (category.match(/sport|体育/ig)) {
        return "sport";
    } else if (category.match(/tv\splay|电视剧/ig)) {
        return "tvplay";
    }
    return "";
};
var getResolution3 = (resolution) => {
    resolution = resolution === void 0 ? "" : resolution.toLowerCase();
    if (resolution.match(/4k|2160(p)?|UHD/ig)) {
        return "2160p";
    } else if (resolution.match(/1440(p)?/ig)) {
        return "1440p";
    } else if (resolution.match(/1080(p){1}/ig)) {
        return "1080p";
    } else if (resolution.match(/1080(i){1}/ig)) {
        return "1080i";
    } else if (resolution.match(/720(p)?/ig)) {
        return "720p";
    } else if (resolution.match(/576(p)?/ig)) {
        return "576p";
    } else if (resolution.match(/540(p)?/ig)) {
        return "540p";
    } else if (resolution.match(/480(p)?/ig)) {
        return "480p";
    } else if (resolution.match(/sd/ig)) {
        return "sd";
    } else if (resolution.match(/NTSC/ig)) {
        return "NTSC";
    } else if (resolution.match(/PAL/ig)) {
        return "PAL";
    }
    return resolution;
};
var getFormat3 = (data) => {
    if (data.match(/pdf/i)) {
        return "pdf";
    } else if (data.match(/EPUB/i)) {
        return "epub";
    } else if (data.match(/MOBI/i)) {
        return "mobi";
    } else if (data.match(/mp3/i)) {
        return "mp3";
    } else if (data.match(/mp4/i)) {
        return "mp4";
    } else if (data.match(/txt/i)) {
        return "txt";
    } else if (data.match(/azw3/i)) {
        return "azw3";
    } else if (data.match(/镜像/i)) {
        return "iso";
    }
    return "other";
};


var getTagsFromPage = (docHtml) => {
    // 貌似原作者已经放弃这个方法取tag了，暂且留着
    // debugger;
    let tags = {};
    if (CURRENT_SITE_NAME === "PTer") {
        // const tagImgs = $("td.rowhead:contains('\u7C7B\u522B\u4E0E\u6807\u7B7E')").next().find("img");
        var tagImgs = $("td.rowhead:contains('\u7C7B\u522B\u4E0E\u6807\u7B7E')", docHtml).next().find("a");
        var links = [];
        var s1 = '';
        for (var i=0; i<tagImgs.length; i++) {
            s1 = tagImgs[i].text;
            if (s1.trim()){
                links.push(s1);
            }
            else {
                links.push(tagImgs[i].firstElementChild.alt);
            }
        }



        // const links = Array.from(tagImgs.map(function () {
        //     tstr = $(this).text;
        //     tstr = tstr.trim()
        //     return (title) ? title : $(this).firstElementChild.attr("alt");
        //     // return $(this).attr("src").replace(/(lang\/chs\/)|(\.gif)/g, "");
        // }));
        if (links.includes("pter-zz")) {
            tags.chinese_subtitle = true;
        }
        if (links.includes("chs_tag-gy")) {
            tags.chinese_audio = true;
        }
        if (links.includes("pter-yy")) {
            tags.cantonese_audio = true;
        }
        if (links.includes("DIY原盘")) {
            tags.diy = true;
        }
        if (links.includes("官方")) {
            tags.pter_official = true;
        }
        if (links.includes("自购")) {
            tags.buyitmyself = true;
        }
    } else {
        const tagText = $("td.rowhead:contains('\u6807\u7B7E')", docHtml).next().text();
        tags = getTagsFromSubtitle(tagText);
    }
    return tags;
};

function compareCodec(codec1, codec2) {
    if (['h264', 'avc'].includes(codec1) && ['h264', 'avc'].includes(codec2)) {
        return true;
    }  else if (['hevc', 'x265'].includes(codec1) && ['hevc', 'x265'].includes(codec2)) {
        return true;        
    }
    else {
        return (codec1 === codec2);
    }
}


var TIP_LIST = [];

// 1.1 根据资源类型，检查资源标题年份是否缺失
function checkTitleYear(){
    let doubanYear;
    try {
        doubanYear = TORRENT_INFO.description.match(/年\s*代\s*\d{4}/ig)[0].match(/\d{4}/ig)[0];
    }
    catch (err) {
        console.log('缺少豆瓣信息');
    }

    if (['movie','tvshow','music','documentary','cartoon','concert','sport'].includes(TORRENT_INFO.category)) {
        if (TORRENT_INFO.year.length !== 0) {
            TIP_LIST.push({id:'titleYearTip', msg:'1.1 主标题检测：主标题年份检查通过', class:'tipGreen'})
        } else {
            TIP_LIST.push({id:'titleYearTip', msg:'1.1 主标题检测：主标题缺少年份，年份应为 ' + doubanYear + ' 。未通过', class:'tipRed'})
        }
    } else {
        TIP_LIST.push({id:'titleYearTip', msg:'1.1 主标题检测：其他类型资源，主标题年份检查跳过', class:'tipGreen'})
    }
}

// 1.2 根据资源类型，检查资源主标题不能含有中字
function checkTitleChars(){
    let regChinese = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    if (regChinese.test(TORRENT_INFO.title)) {
        if (TORRENT_INFO.category == 'movie' || TORRENT_INFO.category == 'tvshow' || TORRENT_INFO.category == 'tvplay' || TORRENT_INFO.category == 'anime' || TORRENT_INFO.category == 'documentary' || TORRENT_INFO.category == 'mv' || TORRENT_INFO.category == 'stage' || TORRENT_INFO.category == 'sport') {
            if (TORRENT_INFO.title.match(/U2娘/ig)) {
                TIP_LIST.push({id:'titleChineseTip', msg:'1.2 主标题检测：主标题无中文检查通过', class:'tipGreen'})
            } else {
                TIP_LIST.push({id:'titleChineseTip', msg:'1.2 主标题检测：主标题有中文需要删除。未通过', class:'tipRed'})
            }
        } else {
            TIP_LIST.push({id:'titleChineseTip', msg:'1.2 主标题检测：其他类型资源，主标题有中文。待检查', class:'tipYellow'})
        }
    } else {
        TIP_LIST.push({id:'titleChineseTip', msg:'1.2 主标题检测：主标题无中文检查通过', class:'tipGreen'})
    }
}

function checkBDInfoParse(){
    let BDorMediaInfo;
    let titleVideoType = getVideoType5(TORRENT_INFO.title);
    if (Object.keys(TORRENT_INFO.bdInfos).length !== 0) {
        BDorMediaInfo = TORRENT_INFO.bdInfos;
    } else if (['bluray', 'uhdbluray'].includes(titleVideoType)) {
        TIP_LIST.push({id:'BIBdinfoTip', msg:'2 BDinfo 检测：未正确获取 BDinfo。待检查', class:'tipYellow'})
    } else if (Object.keys(TORRENT_INFO.mediaInfos).length !== 0) {
        BDorMediaInfo = TORRENT_INFO.mediaInfos;
    } else if (['bluray', 'uhdbluray', 'uhddiscs'].includes(titleVideoType)) {
        TIP_LIST.push({id:'BIBdinfoTip', msg:'2 BDinfo 检测：未正确获取 BDinfo。待检查', class:'tipYellow'})
    } else {
        TIP_LIST.push({id:'BIBdinfoTip', msg:'2 BDinfo 或 Mediainfo 检测：无法获取 Mediainfo 或 BDinfo。不通过', class:'tipRed'})
        // TIP_LIST.push({id:'BIBdinfoTip', msg:'2 BDinfo 或 Mediainfo 检测：正确获取 Mediainfo 或 BDinfo。通过', class:'tipGreen'})
        BDorMediaInfo = '';
    }
    return BDorMediaInfo;
}

// 1.3 检查资源BDinfo或Mediainfo中的分辨与标题分辨率是否相符
function checkTitleResolution(BDorMediaInfo){
    if (BDorMediaInfo.resolution) {
        if (BDorMediaInfo.resolution.length === 0 && TORRENT_INFO.mediaInfo.length !== 0) {
            BDorMediaInfo.resolution = getResolution(TORRENT_INFO.mediaInfo);
        }
    } else {
        TIP_LIST.push({id:'BIBdinfoTip', msg:'1.3 主标题检测：未获取到 BDinfo 或 Mediainfo 中的分辨率', class:'tipYellow'})
    }

    let ScanType1 = getMediaValueByKey("Scan type", TORRENT_INFO.mediaInfo);
    let titleResolution = getResolution3(TORRENT_INFO.title);
    if (titleResolution.length === 0) {
        TIP_LIST.push({id:'titleResolutionTip', msg:'1.3 主标题检测：主标题缺少分辨率，分辨率应为 ' + BDorMediaInfo.resolution + ' 。未通过', class:'tipRed'})
    } else if (titleResolution == BDorMediaInfo.resolution) {
        TIP_LIST.push({id:'titleResolutionTip', msg:'1.3 主标题检测：主标题分辨率检查通过', class:'tipGreen'})
    } else if (titleResolution == '4k' && BDorMediaInfo.resolution == '2160p') {
        TIP_LIST.push({id:'titleResolutionTip', msg:'1.3 主标题检测：主标题分辨率检查通过', class:'tipGreen'})
    } else if (ScanType1 == '') {
        if (titleResolution.match(/2160/ig)) {
            if (titleResolution.match(/p/ig)) {
                TIP_LIST.push({id:'titleResolutionTip', msg:'1.3 主标题检测：主标题分辨率检查通过', class:'tipGreen'})
            } else {
                TIP_LIST.push({id:'titleResolutionTip', msg:'1.3 主标题检测：主标题分辨率检查未通过', class:'tipRed'})
            }
        } else if (TORRENT_INFO.videoType == 'web-dl') {
            if (titleResolution.match(/p/ig)) {
                TIP_LIST.push({id:'titleResolutionTip', msg:'1.3 主标题检测：web-dl组，主标题分辨率检查通过', class:'tipGreen'})
            } else {
                TIP_LIST.push({id:'titleResolutionTip', msg:'1.3 主标题检测：主标题分辨率检查未通过', class:'tipRed'})
            }
        } else if (TORRENT_INFO.videoType == 'hdtv') {
            if (titleResolution.match(/i/ig)) {
                TIP_LIST.push({id:'titleResolutionTip', msg:'1.3 主标题检测：hdtv组，主标题分辨率检查通过', class:'tipGreen'})
            } else {
                TIP_LIST.push({id:'titleResolutionTip', msg:'1.3 主标题检测：主标题分辨率检查未通过', class:'tipRed'})
            }
        }
    } else {
        if (BDorMediaInfo.resolution.length != 0) {
            TIP_LIST.push({id:'titleResolutionTip', msg:'1.3 主标题检测：主标题分辨率与 Bdinfo 或 Mediainfo 不符，分辨率应为 ' + BDorMediaInfo.resolution + ' 。未通过', class:'tipRed'})
        } else {
            TIP_LIST.push({id:'titleResolutionTip', msg:'1.3 主标题检测：主标题分辨率与 Bdinfo 或 Mediainfo 不符，分辨率应为 ' + BDorMediaInfo.resolution + ' 。未通过', class:'tipYellow'})
        }
    }
}

// 1.4 检查资源Mediainfo或BDinfo中的视频/音频编码与标题中的视频/音频编码是否相符
function checkTitleCodec(BDorMediaInfo){
    if (BDorMediaInfo.audioCodec.length === 0 && TORRENT_INFO.mediaInfo.length !== 0) {
        BDorMediaInfo.audioCodec = getAudioCodecByMediaInfo(TORRENT_INFO.mediaInfos.audioPart);
    }
    let titleAudioCodec = getAudioCodecFromTitle(TORRENT_INFO.title);
    if (TORRENT_INFO.videoType == 'dvddiscs') {
        TIP_LIST.push({id:'titleAudioCodecTip', msg:'1.4.1 主标题检测：DVD类型，主标题音轨编码信息检查跳过', class:'tipGreen'})
    } else if (titleAudioCodec.length === 0) {
        TIP_LIST.push({id:'titleAudioCodecTip', msg:'1.4.1 主标题检测：主标题缺少音轨编码信息，需要补充。未通过', class:'tipRed'})
    } else if (titleAudioCodec == BDorMediaInfo.audioCodec) {
        TIP_LIST.push({id:'titleAudioCodecTip', msg:'1.4.1 主标题检测：主标题音轨编码信息检查通过', class:'tipGreen'})
    } else if (titleAudioCodec == 'dd' || titleAudioCodec == 'ac3') {
        if (BDorMediaInfo.audioCodec == 'dd' || BDorMediaInfo.audioCodec == 'ac3') {
            TIP_LIST.push({id:'titleAudioCodecTip', msg:'1.4.1 主标题检测：主标题音轨编码信息检查通过', class:'tipGreen'})
        }
    } else if (titleAudioCodec == 'dd+' || titleAudioCodec == 'eac3') {
        if (BDorMediaInfo.audioCodec == 'dd+' || BDorMediaInfo.audioCodec == 'eac3') {
            TIP_LIST.push({id:'titleAudioCodecTip', msg:'1.4.1 主标题检测：主标题音轨编码信息检查通过', class:'tipGreen'})
        }
    } else if (titleAudioCodec == 'pcm' || titleAudioCodec == 'lpcm') {
        if (BDorMediaInfo.audioCodec == 'pcm' || BDorMediaInfo.audioCodec == 'lpcm') {
            TIP_LIST.push({id:'titleAudioCodecTip', msg:'1.4.1 主标题检测：主标题音轨编码信息检查通过', class:'tipGreen'})
        }
    } else if (titleAudioCodec == 'mp2' || titleAudioCodec == 'mpa2') {
        if (BDorMediaInfo.audioCodec == 'mp2') {
            TIP_LIST.push({id:'titleAudioCodecTip', msg:'1.4.1 主标题检测：主标题音轨编码信息检查通过', class:'tipGreen'})
        }
    } else {
        if (BDorMediaInfo.audioCodec.length != 0) {
            TIP_LIST.push({id:'titleAudioCodecTip', msg:'1.4.1 主标题检测：主标题音轨编码信息与 Bdinfo 或 Mediainfo 不符，音轨编码信息应为 ' + BDorMediaInfo.audioCodec + ' 。未通过', class:'tipRed'})
        } else {
            TIP_LIST.push({id:'titleAudioCodecTip', msg:'1.4.1 主标题检测：主标题音轨编码信息待检查', class:'tipYellow'})
        }
    }
    // 1.4.2 检查视频编码
    if (BDorMediaInfo.videoCodec) {
        if (BDorMediaInfo.videoCodec.length === 0 && TORRENT_INFO.mediaInfo.length !== 0) {
            BDorMediaInfo.videoCodec = getVideoCodecByMediaInfo(TORRENT_INFO.mediaInfo.videoPart, TORRENT_INFO.mediaInfo.generalPart, TORRENT_INFO.mediaInfo.secondVideoPart);
        }
    } else {
        TIP_LIST.push({id:'titleVideoCodecTip', msg:'1.4.2 主标题检测：未获取到 BDinfo 或 Mediaifo 中的视频编码', class:'tipYellow'})
    }
    let titleVideoCodec = getVideoCodecFromTitle(TORRENT_INFO.title, TORRENT_INFO.videoType);
    if (TORRENT_INFO.videoType == 'dvddiscs') {
        TIP_LIST.push({id:'titleVideoCodecTip', msg:'1.4.2 主标题检测：DVD类型，主标题视频编码信息检查跳过', class:'tipGreen'})
    } else if (titleVideoCodec.length === 0) {
        TIP_LIST.push({id:'titleVideoCodecTip', msg:'1.4.2 主标题检测：主标题缺少视频编码信息，需要补充。未通过', class:'tipRed'})
    } else if (compareCodec(titleVideoCodec, BDorMediaInfo.videoCodec)) {
        TIP_LIST.push({id:'titleVideoCodecTip', msg:'1.4.2 主标题检测：主标题视频编码信息检查通过', class:'tipGreen'})
    } else {
        if (BDorMediaInfo.videoCodec) {
            if (TORRENT_INFO.videoType.match(/remux|bluray/ig)) {
                if (BDorMediaInfo.videoCodec == 'x264' || BDorMediaInfo.videoCodec == 'h264') {
                    if (titleVideoCodec == 'h264' || titleVideoCodec == 'avc') {
                        TIP_LIST.push({id:'titleVideoCodecTip', msg:'1.4.2 主标题检测：官组作品，主标题视频编码信息检查通过', class:'tipGreen'})
                    }
                }
            } else {
                TIP_LIST.push({id:'titleVideoCodecTip', msg:'1.4.2 主标题检测：主标题视频编码信息与 Bdinfo 或 Mediainfo 不符，视频编码信息应为 ' + BDorMediaInfo.videoCodec + ' 。未通过', class:'tipRed'})
            }
        } else {
            TIP_LIST.push({id:'titleVideoCodecTip', msg:'1.4.2 主标题检测：主标题视频编码信息待检测', class:'tipYellow'})
        }
    }
}

// 6.2 国语粤语标签
function checkTagLangCnHk(BDorMediaInfo){
    if (BDorMediaInfo.mediaTags) {
        if ((JSON.stringify(BDorMediaInfo.mediaTags).match('chinese_audio') && TORRENT_INFO.metaTags.match('chs_tag-gy')) || (!JSON.stringify(BDorMediaInfo.mediaTags).match('chinese_audio') && !TORRENT_INFO.metaTags.match('chs_tag-gy'))) {
            if ((JSON.stringify(BDorMediaInfo.mediaTags).match('cantonese_audio') && TORRENT_INFO.metaTags.match('chs_tag-yy')) || (!JSON.stringify(BDorMediaInfo.mediaTags).match('cantonese_audio') && !TORRENT_INFO.metaTags.match('chs_tag-yy'))) {
                TIP_LIST.push({id:'metaLangTagTip', msg:'6.2 类别与标签检测：国语粤语标签选择正确。通过', class:'tipGreen'})
            } else if (TORRENT_INFO.BIArea == 'HKG') {
                TIP_LIST.push({id:'metaLangTagTip', msg:'6.2 类别与标签检测：粤语标签已勾选，但mediainfo中未识别到粤语标签，鉴于地区为香港，请注意确认。', class:'tipYellow'})
            } else {
                if (TORRENT_INFO.metaTags.match('chs_tag-yy')) {
                    TIP_LIST.push({id:'metaLangTagTip', msg:'6.2 类别与标签检测：粤语标签已勾选。未通过', class:'tipRed'})
                } else {
                    TIP_LIST.push({id:'metaLangTagTip', msg:'6.2 类别与标签检测：粤语标签未勾选。未通过', class:'tipRed'})
                }
            }
        } else {
            if (TORRENT_INFO.BIArea == 'CHN') {
                TIP_LIST.push({id:'metaLangTagTip', msg:'6.2 类别与标签检测：国语标签已勾选，但mediainfo中未识别到国语标签，鉴于地区为大陆，请注意确认。', class:'tipYellow'})
            } else {
                if (TORRENT_INFO.metaTags.match('chs_tag-gy')) {
                    TIP_LIST.push({id:'metaLangTagTip', msg:'6.2 类别与标签检测：国语标签已勾选。未通过', class:'tipRed'})
                } else {
                    TIP_LIST.push({id:'metaLangTagTip', msg:'6.2 类别与标签检测：国语标签未勾选。未通过', class:'tipRed'})
                }
            }
        }
    }
}

// 6.3 字幕标签
function checkTagSub(BDorMediaInfo){
    if (BDorMediaInfo.subtitles.length != 0) {
        if ((BDorMediaInfo.subtitles.toString().match(/chinese/ig) && TORRENT_INFO.metaTags.match(/tag_chinesesub/ig)) || (!BDorMediaInfo.subtitles.toString().match(/chinese/ig) && !TORRENT_INFO.metaTags.match(/tag_chinesesub/ig))) {
            TIP_LIST.push({id:'metaSubTagTip', msg:'6.3 类别与标签检测：中字标签选择正确。通过', class:'tipGreen'})
        } else {
            TIP_LIST.push({id:'metaSubTagTip', msg:'6.3 类别与标签检测：中字标签选择错误。未通过', class:'tipYellow'})
        }
    } else if (TORRENT_INFO.metaTags.match(/tag_chinesesub/ig)) {
        if (TORRENT_INFO.BIArea == 'CHN') {
            TIP_LIST.push({id:'metaSubTagTip', msg:'6.3 类别与标签检测：中字标签已勾选，但mediainfo中未识别到中字标签，鉴于地区为大陆，请注意确认。', class:'tipYellow'})
        } else if (TORRENT_INFO.BIArea == 'HKG') {
            TIP_LIST.push({id:'metaSubTagTip', msg:'6.3 类别与标签检测：中字标签已勾选，但mediainfo中未识别到中字标签，鉴于地区为香港，请注意确认。', class:'tipYellow'})
        } else {
            TIP_LIST.push({id:'metaSubTagTip', msg:'6.3 类别与标签检测：中字标签选择错误。未通过', class:'tipYellow'})
        }
    } else {
        TIP_LIST.push({id:'metaSubTagTip', msg:'6.3 类别与标签检测：中字标签选择正确。通过', class:'tipGreen'})
    }
}



// 1.4.1 检查音乐类型音频编码
function checkMusicCodec(){
    if (TORRENT_INFO.category == 'music') {
        let titleMusicAudioCodec = getAudioCodecFromTitle(TORRENT_INFO.title);
        if (titleMusicAudioCodec.length === 0) {
            TIP_LIST.push({id:'titleMusicAudioCodecTip', msg:'1.4.1 主标题检测：主标题缺少音轨编码信息，需要补充。未通过', class:'tipRed'})
        } else {
            TIP_LIST.push({id:'titleMusicAudioCodecTip', msg:'1.4.1 主标题检测：主标题音轨编码信息正确。通过', class:'tipGreen'})
        }
    }
}

// 1.5 检查主标题中除视频编码及音频编码外，多余的点需要删除
function checkTitleDotNum(){
    let titleDotNum;
    if (!TORRENT_INFO.title.match(/\./ig)) {
        titleDotNum = 0;
    } else {
        titleDotNum = TORRENT_INFO.title.match(/\./ig).length;
    }
    if (titleDotNum != 0) {
        if (['movie','tvshow','tvplay','anime','documentary','mv','stage','sport'].includes(TORRENT_INFO.category) ) {
            if (TORRENT_INFO.title.match(/5\.1|7\.1|2\.0|h\.264|h\.265/ig)) {
                if (titleDotNum == 1) {
                    if (TORRENT_INFO.title.match(/5\.1|7\.1|2\.0|h\.264|h\.265/ig).length == 1) {
                        TIP_LIST.push({id:'titleDotNumTip', msg:'1.5 主标题检测：主标题中没有多余的点需要删除。通过', class:'tipGreen'});
                    } else {
                        TIP_LIST.push({id:'titleDotNumTip', msg:'1.5 主标题检测：主标题中有多余的点需要删除。未通过', class:'tipRed'});
                    }
                } else if (titleDotNum == 2) {
                    if (TORRENT_INFO.title.match(/h\.264|h\.265/ig)) {
                        if (TORRENT_INFO.title.match(/5\.1|7\.1|2\.0/ig).length == 1 && TORRENT_INFO.title.match(/h\.264|h\.265/ig).length == 1) {
                            TIP_LIST.push({id:'titleDotNumTip', msg:'1.5 主标题检测：主标题中没有多余的点需要删除。通过', class:'tipGreen'});
                        }
                    }
                    else {
                        TIP_LIST.push({id:'titleDotNumTip', msg:'1.5 主标题检测：主标题中有多余的点需要删除。未通过', class:'tipRed'});
                    }
                } else {
                    TIP_LIST.push({id:'titleDotNumTip', msg:'1.5 主标题检测：主标题中有多余的点需要删除。未通过', class:'tipRed'});
                }
            } else {
                TIP_LIST.push({id:'titleDotNumTip', msg:'1.5 主标题检测：其他类型，主标题中多余的点需要检查。待检查', class:'tipYellow'});
            }
        }
        else {
            TIP_LIST.push({id:'titleDotNumTip', msg:'1.5 主标题检测：其他类型，主标题中多余的点需要检查。待检查', class:'tipYellow'});
        }
    } else {
        TIP_LIST.push({id:'titleDotNumTip', msg:'1.5 主标题检测：主标题中没有多余的点需要删除。通过', class:'tipGreen'});
    }
}

//1.6 检查主标题中的除了26个英文字幕及.’之外的无关字符
function checkTitleLetters(){
    if (TORRENT_INFO.title.replace(/[A-Za-z0-9\.-\s\+\@]+/ig, '').length != 0) {
        TIP_LIST.push({id:'titleExtraTip', msg:'1.6 主标题检测：主标题中含有括号或者其他非常见符号。待检查', class:'tipYellow'});
    } else {
        TIP_LIST.push({id:'titleExtraTip', msg:'1.6 主标题检测：主标题中不含有括号或者其他非常见符号。通过', class:'tipGreen'});
    }
}

//1.7 BDMV BDISO BDBOX 替换为Blu-ray，DVDISO替换为DVD
function checkTitleBDType() {
    if (!TORRENT_INFO.title.match(/BDMV|BDISO|BDBOX/ig)) {
    } else {
        TIP_LIST.push({id:'titleBDTypeTip', msg:'1.7 主标题检测：主标题需要修正为Blu-ray。未通过', class:'tipRed'});
    }
    if (!TORRENT_INFO.title.match(/DVDISO/ig)) {
    } else {
        TIP_LIST.push({id:'titleBDTypeTip', msg:'1.7 主标题检测：主标题需要修正为DVD。未通过', class:'tipRed'});
    }
}

// 2.3 检查简介中海报是否缺失
function checkBIPost(){
    let description1 = TORRENT_INFO.description.replace(/\[quote[\s\S]+?\[\/quote\]/g, '')
    let strStart = description1.indexOf("[img]");
    if (TORRENT_INFO.description.match(/doubanio\.com|images\.static-bluray\.com|media-amazon\.com|ssl\-images\-amazon\.com/ig)) {
        TIP_LIST.push({id:'BIPosterTip', msg:'2.3 海报检测：通过', class:'tipGreen'});
    } else if (strStart < 0 || strStart > 120) {
        TIP_LIST.push({id:'BIPosterTip', msg:'2.3 海报检测：海报缺失。未通过', class:'tipYellow'});
    } else {
        TIP_LIST.push({id:'BIPosterTip', msg:'2.3 海报检测：通过', class:'tipGreen'});
    }
}

// 4.检查质量
// 4.1 修正标题含有Remux，WEB-DL，WEBRip，DVDRip，HDTV、x264，x265，H264，H265等，质量勾选blu-ray和UHD类。（字母不区分大小写）
function checkVideoType(){
    if (['movie','tvshow','tvplay','anime','documentary', 'mv','stage','sport'].includes(TORRENT_INFO.category)) {
        let titleVideoType = getVideoType5(TORRENT_INFO.title);
        if (titleVideoType.replace('-', '') == TORRENT_INFO.metaInfos.videoType.replace('-', '')) {
            TIP_LIST.push({id:'metaVideoTypeTip', msg:'4.1 基本信息--质量选择检测：通过', class:'tipGreen'});
        } else {
            TIP_LIST.push({id:'metaVideoTypeTip', msg:'4.1 基本信息--质量选择检测：质量应为 ' + titleVideoType + '。未通过', class:'tipRed'});
        }
    }
}

// 5.检查地区
// 5.1 根据豆瓣和imdb检查修正资源产地
function checkArea(){
    if (['movie','tvshow','tvplay','anime','documentary', 'stage','sport'].includes(TORRENT_INFO.category)) {
        if (TORRENT_INFO.BIArea == TORRENT_INFO.metaInfos.processing) {
            TIP_LIST.push({id:'metaAreaTip', msg:'5.1 基本信息--地区选择检测：通过', class:'tipGreen'});
        } else if (TORRENT_INFO.BIArea == 'Other' && TORRENT_INFO.metaInfos.processing == 'Western') {
            TIP_LIST.push({id:'metaAreaTip', msg:'5.1 基本信息--地区选择检测：通过', class:'tipGreen'});
        } else {
            TIP_LIST.push({id:'metaAreaTip', msg:'5.1 基本信息--地区选择检测：地区应为 ' + TORRENT_INFO.BIArea + '。未通过', class:'tipRed'});
        }
    }
}

// 6.检查标签
// 6.1 官方标签
function checkOfficialTag() {
    let isTitleMatchPter = TORRENT_INFO.title.match(/[@-]\s?(PTer)/i)
    // let isTagInternal = TORRENT_INFO.metaTags.match(/tag_internal=yes/ig)
    if (isTitleMatchPter && TORRENT_INFO.isTagInternal) {
        TIP_LIST.push({id:'metaOfficialTagTip', msg:'6.1 官方标签选择检测：官组作品，勾选官方标签。通过', class:'tipGreen'});
    } else if (!isTitleMatchPter && !TORRENT_INFO.isTagInternal) {
        TIP_LIST.push({id:'metaOfficialTagTip', msg:'6.1 官方标签选择检测：非官组作品，未勾选官方标签。通过', class:'tipGreen'});
    } else if (!isTitleMatchPter && TORRENT_INFO.isTagInternal) {
        TIP_LIST.push({id:'metaOfficialTagTip', msg:'6.1 官方标签选择检测：非官组作品，勾选官方标签。未通过', class:'tipRed'});
    } else if (isTitleMatchPter && !TORRENT_INFO.isTagInternal) {
        TIP_LIST.push({id:'metaOfficialTagTip', msg:'6.1 官方标签选择检测：官组作品，未勾选官方标签。未通过', class:'tipRed'});
    } 
}

// 6.4 DIY标签
function checkDiyTag() {
    let isTitleMatchDiy = TORRENT_INFO.title.match(/diy/ig)
    // let isTagDiy = TORRENT_INFO.metaTags.match(/tag_doityourself/ig)
    if (isTitleMatchDiy && TORRENT_INFO.isTagDiy) {
        TIP_LIST.push({id:'metaDiyTagTip', msg:'6.4 DIY 标签选择检测：DIY作品，已勾选DIY标签。通过', class:'tipGreen'});
    } else if (!isTitleMatchDiy && !TORRENT_INFO.isTagDiy) {
        TIP_LIST.push({id:'metaDiyTagTip', msg:'6.4 DIY 标签选择检测：非DIY作品，未勾选DIY标签。通过', class:'tipGreen'});
    } else if (isTitleMatchDiy && !TORRENT_INFO.isTagDiy) {
        TIP_LIST.push({id:'metaDiyTagTip', msg:'6.4 DIY 标签选择检测：DIY作品，未勾选DIY标签。未通过', class:'tipYellow'});
    } else {
        TIP_LIST.push({id:'metaDiyTagTip', msg:'6.4 DIY 标签选择检测：非DIY作品，勾选DIY标签。未通过', class:'tipYellow'});
    }
}

// 6.5 FLAC标签
function checkFLAC() {
    if (['movie','tvplay','anime','tvshow','mv','stage','documentary', 'sport'].includes(TORRENT_INFO.category)) {
        if (TORRENT_INFO.metaTags.match(/flac/ig) || TORRENT_INFO.metaTags.match(/wav/ig)) {
            TIP_LIST.push({id:'metaDiyTagTip', msg:'6.5 FLAC/WAV 标签选择检测：此为视频类资源，FLAC/WAV 仅限音乐文件使用。未通过', class:'tipRed'});
        } else {
            TIP_LIST.push({id:'metaDiyTagTip', msg:'6.5 FLAC/WAV 标签选择检测：视频类资源，未勾选 FLAC 或 WAV 标签。通过', class:'tipGreen'});
        }
    }
}

// 7.检查官组logo
// 7 官组 logo 检测：非官组作品，跳过检测。
function checkOfficialLogo() {
    let isTitleMatchPter = TORRENT_INFO.title.match(/[@-]\s?(PTer)/i)
    // let isTagBuyMySelf = TORRENT_INFO.metaTags.match(/tag_buyitmyself/ig)
    let titlePterNum = TORRENT_INFO.title.indexOf('PTer');
    if (isTitleMatchPter && !TORRENT_INFO.description.match(/PTer\w{0,5}.png/ig)) {
        if (TORRENT_INFO.isTagBuyMySelf) {
            TIP_LIST.push({id:'officialLogoTip', msg:'7 官组 logo 检测：官组作品，官组 logo 正确匹配。通过', class:'tipGreen'});
        }
        else if (['uhd', 'uhdbluray', 'bluray', 'bddiscs', 'uhddiscs'].includes(TORRENT_INFO.videoType)) {
            TIP_LIST.push({id:'officialLogoTip', msg:'7 官组 logo 检测：官组作品，官组 logo 正确匹配。通过', class:'tipGreen'});
        } else {
            TIP_LIST.push({id:'officialLogoTip', msg:'7 官组 logo 检测：官组作品，缺少官组 logo，应为 ' + TORRENT_INFO.title.substring(titlePterNum) + ' 组。未通过', class:'tipRed'});
        }
    } else if (isTitleMatchPter && TORRENT_INFO.description.match(/PTer\w{0,5}.png/ig)) {
        if (TORRENT_INFO.videoType == 'remux' && TORRENT_INFO.description.match(/PTerREMUX/ig)) {
            TIP_LIST.push({id:'officialLogoTip', msg:'7 官组 logo 检测：官组作品，官组 logo 正确匹配。通过', class:'tipGreen'});
        } else if (TORRENT_INFO.isTagDiy && TORRENT_INFO.description.match(/PTerDIY\.png/ig)){
            TIP_LIST.push({id:'officialLogoTip', msg:'7 官组DIY logo 检测：官组DIY作品，官组 logo 正确匹配。通过', class:'tipGreen'});
        }
        else if (TORRENT_INFO.title.substring(titlePterNum) != TORRENT_INFO.description.match(/PTer\w{0,5}.png/ig)[0].replace(/.png/ig, '')) {
            TIP_LIST.push({id:'officialLogoTip', msg:'7 官组 logo 检测：官组 logo 与后缀不匹配，应为 ' + TORRENT_INFO.title.substring(titlePterNum) + ' 组。未通过', class:'tipRed'});
        } else {
            TIP_LIST.push({id:'officialLogoTip', msg:'7 官组 logo 检测：官组作品，官组 logo 正确匹配。通过', class:'tipGreen'});
        }
        // } else if (!TORRENT_INFO.title.match(/pter/ig) && !TORRENT_INFO.description.match(/PTer\w{0,5}.png/ig)) {
    } else if (!isTitleMatchPter) {
        TIP_LIST.push({id:'officialLogoTip', msg:'7 官组 logo 检测：非官组作品，跳过检测。', class:'tipGreen'});
    }
}

// 8.其他类
// 8.1 检查资源imdb和豆瓣缺失
function checkDoubanIMDbUrl() {
    if (TORRENT_INFO.category != 'mv') {
        if (!TORRENT_INFO.doubanUrl) {
            if (!TORRENT_INFO.imdbUrl) {
                TIP_LIST.push({id:'doubanAndImdbUrlTip', msg:'8.1 豆瓣和 Imdb 链接检测：两个都缺失。未通过', class:'tipYellow'});
            } else {
                TIP_LIST.push({id:'doubanAndImdbUrlTip', msg:'8.1 豆瓣和 Imdb 链接检测：豆瓣链接缺失。未通过', class:'tipYellow'});
            }
        } else {
            if (!TORRENT_INFO.imdbUrl) {
                TIP_LIST.push({id:'doubanAndImdbUrlTip', msg:'8.1 豆瓣和 Imdb 链接检测：Imdb 链接缺失。未通过', class:'tipYellow'});
            } else {
                TIP_LIST.push({id:'doubanAndImdbUrlTip', msg:'8.1 豆瓣和 Imdb 链接检测：两个都存在。通过', class:'tipGreen'});
            }
        }
    }
}

// 8.3 根据体积大小和文件后缀，判断种子是否重复
function checkTorrentDuplicate() {

}

// 8.4 记录逾期未修改不合规资源数量及发布者id
function checkCommentElements(docHtml){
    if (TORRENT_INFO.downloadInfo.match(/已通过审核/ig)) {
        TIP_LIST.push({id:'commentElementsTip', msg:'8.4 资源已合格。通过', class:'tipGreen'});
        return;
    } 
    var commentLines = $("#outer > table.main > tbody > tr > td > table > tbody > tr > td.text", docHtml);
    for (let i =0; i< commentLines.length; i++) {
        if (commentLines[i].textContent.indexOf("请参考站内类似资源，修正以下问题") >0 ){
            var s = $(commentLines[i]).find("td:nth-child(1) > span:nth-child(4)");
            if (s.attr('title').match(/\d{4}-d{2}.*/)) {
                var commentTime = new Date(s.attr('title'));
                const now = new Date();
                const twoDaysAgo = new Date(now - 1000 * 60 * 60 * 24 * 2);
                if (commentTime < twoDaysAgo) {
                    TIP_LIST.push({id:'commentElementsTip', msg:'8.4 未在规定时间内修改资源请记录发布者id。未通过', class:'tipRed'});
                }
    
            }
        }
    
    }

    // else if (docHtml.getElementsByClassName('text').length != 0) {
    //     let commentElements = docHtml.getElementsByClassName('text')[0].innerHTML.split('\n<div');
    //     for (let i = 0; i < commentElements.length; i++) {
    //         if (commentElements[i].match(/楼主请参考站内类似资源\，修正以下问题\：/ig)) {
    //             let commentTime = commentElements[i].match(/\<span\stitle\=\"\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}\"\>.{0,}\<\/span\>/ig)[0].replace(/\<span\stitle\=\"\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}\"\>/ig, '').replace(/\<\/span\>/ig, '');
    //             if (commentTime.match(/年|月/ig) || commentTime.replace(/天.{0,}/ig, '') * 1 >= 3) {
    //                 TIP_LIST.push({id:'commentElementsTip', msg:'8.4 未在规定时间内修改资源请记录发布者id。未通过', class:'tipRed'});
    //             }
    //         }
    //     }
    //     // if (commentElementsTip.className != 'tipRed') {
    //     //     commentElementsTip.innerText = '8.4 已在规定时间内修改资源。通过';
    //     //     commentElementsTip.className = 'tipGreen';
    //     //     tipAll += 1;
    //     //     tipGreen += 1;
    //     // }
    // }
}

// 8.5 剧集集数检查
function checkSeriesNum() {
    let seriesNumArr, subtitleSeriesNumArr;
    let seriesNumTipNum = 0;
    if (TORRENT_INFO.title.match(/E\d{2}(\-(E)?\d{2})?/ig)) {
        seriesNumArr = TORRENT_INFO.title.match(/E\d{2}(\-(E)?\d{2})?/ig)[0].match(/\d{2}/ig);
    }
    if (TORRENT_INFO.subtitle.match(/第\d{2}(\-\d{2})?集/ig)) {
        subtitleSeriesNumArr = TORRENT_INFO.subtitle.match(/第\d{2}(\-\d{2})?集/ig)[0].match(/\d{2}/ig);
    }
    if (seriesNumArr && subtitleSeriesNumArr) {
        if (seriesNumArr.length == subtitleSeriesNumArr.length) {
            for (let i = 0; i < seriesNumArr.length; i++) {
                if (seriesNumArr[i] == subtitleSeriesNumArr[i]) {
                } else {
                    seriesNumTipNum += 1;
                }
            }
        } else {
            seriesNumTipNum += 1;
        }
    }
    if (seriesNumTipNum == 0) {
        TIP_LIST.push({id:'seriesNumTip', msg:'8.5 剧集集数检查。通过', class:'tipGreen'});
    } else {
        TIP_LIST.push({id:'seriesNumTip', msg:'8.5 剧集集数检查。未通过', class:'tipRed'});
    }
}

const getBannedResource = async () => {
    let html = await $.get('https://pterclub.com/forums.php?action=viewtopic&topicid=375&page=p2128#pid2128');
    let dataTemp1 = html.split('以下影视作品')[1].split('<s>')[0];
    return dataTemp1;
  };

// 8.6 禁发识别
const asyncCheckBanedResource = async () => {
    if (BAN_LIST_HTML) {
        let dataTemp2Arr = BAN_LIST_HTML.split('<img');
        let titleForeverArr = dataTemp2Arr[0].split('<br')[0].split('、');
        for (let i = 0; i < titleForeverArr.length; i++) {
            titleForeverArr[i] = titleForeverArr[i].replace(/\（(.+?)\）/ig, '').replace(/\<(.+?)\>/ig, '');
        }
        for (let i = 1; i < dataTemp2Arr.length; i++) {
            dataTemp2Arr[i] = dataTemp2Arr[i].replace(/\d{4}年度第(.{2})批重点作品版权保护预警名单/, '');
            if (dataTemp2Arr[i].match(/\<b\>(.+?)\<\/b\>/ig)) {
                dataTemp2Arr[i] = dataTemp2Arr[i].match(/\<b\>(.+?)\<\/b\>/ig)[0].replace('<b>', '').replace('</b>', '');
            }
            dataTemp2Arr[i] = dataTemp2Arr[i].replace('class="listicon listitem" src="pic/trans.gif" alt="list" /> ', '').replace('<br />', '').replace('\r\n', '').replace('<br />', '').replace('\r\n', '').replace('<b>', '').replace('</b>', '').replace('<br />', '').replace('\r\n', '').replace(' ', '');
        }
        let titleBanArr = [];
        for (let i = 0; i < titleForeverArr.length + dataTemp2Arr.length - 1; i++) {
            if (i < titleForeverArr.length) {
                titleBanArr[i] = titleForeverArr[i];
            } else {
                titleBanArr[i] = dataTemp2Arr[i - titleForeverArr.length + 1];
            }
        }
        let titleBanNum = 0;
        let titleBanStr;
        for (let i = 0; i < titleBanArr.length; i++) {
            if (titleBanArr[i] != '') {
                if (TORRENT_INFO.subtitle.match(titleBanArr[i])) {
                    titleBanNum += 1;
                    titleBanStr = titleBanArr[i];
                    console.log(titleBanArr[i]);
                }
            }
        }
        if (titleBanNum != 0) {
            TIP_LIST.push({id:'titleBanTip', msg:'8.6 禁发资源：' + titleBanStr + '。未通过', class:'tipRed'});
        } else {
            TIP_LIST.push({id:'titleBanTip', msg:'8.6 禁发资源检查。通过', class:'tipGreen'});
        }
    }
}

// 8.8 黑名单小组
function checkBannedGroup(){
    if (TORRENT_INFO.title.match(/-FGT/ig)) {
        TIP_LIST.push({id:'teamBanGroup', msg:'8.8 黑名单小组：未通过', class:'tipRed'});
    } else {
        TIP_LIST.push({id:'teamBanGroup', msg:'8.8 黑名单小组：通过', class:'tipGreen'});
    }
}


function fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest(__assign(__assign({
            method: "GET",
            url,
            responseType: "json"
        }, options), {
            onload: (res) => {
                const { statusText, status, response } = res;
                if (status !== 200) {
                    reject(new Error(statusText || status));
                } else {
                    resolve(response);
                }
            },
            ontimeout: () => {
                reject(new Error("timeout"));
            },
            onerror: (error) => {
                reject(error);
            }
        }));
    });
}

// 8.2 Torrent文件检查，取得Torrent文件列表
function fetchTorrentFileList(){
    TORRENT_INFO.filelistUrl = TORRENT_INFO.url.replace('details', 'viewfilelist');
    const filelist = fetch(TORRENT_INFO.filelistUrl, {
        responseType: "text"
    });
    return filelist;
}


const getTorrentFilelist = async () => {
    let filelisturl = TORRENT_INFO.url.replace('details', 'viewfilelist');
    let filelist = await $.get(filelisturl);
    return filelist;
  };

// 8.2 Torrent文件检查，检查文件中是否包含无关文件
function checkTorrentFiles(filelist){
    if (filelist) {
        let filelistArr = filelist.split('<tr>');
        let errorFileNum = 0;
        let fileTypes = [];
        if (['uhd', 'uhdbluray', 'bluray', 'bddiscs', 'uhddiscs'].includes(TORRENT_INFO.videoType)) {
            for (let i = 2; i < filelistArr.length; i++) {
                let fileTemp = filelistArr[i];
                let num1 = fileTemp.indexOf('>');
                fileTemp = fileTemp.slice(num1 + 1);
                let num2 = fileTemp.indexOf('</');
                fileTemp = fileTemp.slice(0, num2);
                let fileLastDotNum = fileTemp.lastIndexOf('.');
                let fileType = fileTemp.slice(fileLastDotNum);
                // if (fileType.match(/\.mkv|\.mp4|\.nfo|\.txt|\.srt/ig)) {
                //     errorFileNum += 1;
                //     fileTypes.push(fileType);
                // } else {
                // }
                if (filelistArr[i].match(/\/dbmv\/stream|\/dbmv\/clipinf|\/dbmv\/playlist|\/bdmv\/backup\/clipinf|\/bdmv\/backup\/playlist/ig)) {
                    if (fileType.match(/\.clpi|\.mpls|\.m2ts/ig)) {
                    } else {
                        errorFileNum += 1;
                        fileTypes.push(fileType);
                    }
                }

            }
        } else if (TORRENT_INFO.videoType == 'dvddiscs') {
            for (let i = 2; i < filelistArr.length; i++) {
                let num1 = filelistArr[i].indexOf('>');
                filelistArr[i] = filelistArr[i].slice(num1 + 1);
                let num2 = filelistArr[i].indexOf('</');
                filelistArr[i] = filelistArr[i].slice(0, num2);
                let fileLastDotNum = filelistArr[i].lastIndexOf('.');
                let fileType = filelistArr[i].slice(fileLastDotNum);
                if (fileType.match(/\.vob|\.iso|\.ifo|\.bup/ig)) {
                } else {
                    errorFileNum += 1;
                    fileTypes.push(fileType);
                }
            }
        } else {
            for (let i = 2; i < filelistArr.length; i++) {
                let num1 = filelistArr[i].indexOf('>');
                filelistArr[i] = filelistArr[i].slice(num1 + 1);
                let num2 = filelistArr[i].indexOf('</');
                filelistArr[i] = filelistArr[i].slice(0, num2);
                let fileLastDotNum = filelistArr[i].lastIndexOf('.');
                let fileType = filelistArr[i].slice(fileLastDotNum);
                if (fileType.match(/\.mkv|\.mp4|\.vob|\.m2ts|\.ts|\.avi|\.mov/ig)) {
                } else {
                    errorFileNum += 1;
                    fileTypes.push(fileType);
                }
            }
        }
        function fileConsole(arr) {
            let str = '';
            let arrTemp = [];
            for (let i = 0; i < arr.length; i++) {
                if (arrTemp.indexOf(arr[i]) == -1) {
                    arrTemp.push(arr[i]);
                }
            }
            for (let i = 0; i < arrTemp.length; i++) {
                str += arrTemp[i] + ' ';
            }
            return str;
        }
        if (errorFileNum == 0) {
            TIP_LIST.push({id:'filelistTip', msg:'8.2 Torrent文件检查：未发现异常文件。通过', class:'tipGreen'})
        } else if (TORRENT_INFO.title.match(/-CMCT|-FRDS|-CHD|-WIKI|-HDH|-LHD|-DIY@LeagueHD|-Ourbits|-MTeam|-DBTV|-HDChina|-PuTao|-BMDru|VCB-Studio|Snow-Raws|-Pter|-EPiC|-TLF/ig)) {
            TIP_LIST.push({id:'filelistTip', msg:'8.2 Torrent文件检查：发现异常文件 ' + fileConsole(fileTypes) + ' ，但在白名单小组内。通过', class:'tipGreen'})
        } else {
            TIP_LIST.push({id:'filelistTip', msg:'8.2 Torrent文件检查：发现异常文件 ' + fileConsole(fileTypes) + ' ，不在白名单小组内。未通过', class:'tipRed'})
        }
    };
}

// 8.2 Torrent文件检查，音乐类型
function checkMusicTorrentFile(filelist) {
    if (TORRENT_INFO.category == 'music') {
        // const filelist = fetch(TORRENT_INFO.filelistUrl, {
        //     responseType: "text"
        // });
        if (filelist) {
            let filelistArr = data.split('<tr>');
            let errorFileNum = 0;
            let fileTypes = [];
            for (let i = 2; i < filelistArr.length; i++) {
                let num1 = filelistArr[i].indexOf('>');
                filelistArr[i] = filelistArr[i].slice(num1 + 1);
                let num2 = filelistArr[i].indexOf('</');
                filelistArr[i] = filelistArr[i].slice(0, num2);
                let fileLastDotNum = filelistArr[i].lastIndexOf('.');
                let fileType = filelistArr[i].slice(fileLastDotNum);
                if (fileType.match(/\.mp3|\.flac|\.ape|\.wav|\.wma|\.aac|\.ogg/ig)) {
                } else {
                    errorFileNum += 1;
                    fileTypes.push(fileType);
                }
            }
            function fileConsole(arr) {
                let str = '';
                let arrTemp = [];
                for (let i = 0; i < arr.length; i++) {
                    if (arrTemp.indexOf(arr[i]) == -1) {
                        arrTemp.push(arr[i]);
                    }
                }
                for (let i = 0; i < arrTemp.length; i++) {
                    str += arrTemp[i] + ' ';
                }
                return str;
            }
            if (errorFileNum == 0) {
                TIP_LIST.push({id:'musicFilelistTip', msg:'8.2 Torrent文件检查：未发现异常文件。通过', class:'tipGreen'});
            } else {
                TIP_LIST.push({id:'musicFilelistTip', msg:'8.2 Torrent文件检查：发现异常文件 ' + fileConsole(fileTypes) +'。未通过', class:'tipRed'});
            }
        };
    }
}

// 8.7 显示豆瓣和 imdb 评分 PTer Helper Helper 功能
function getRating() {
    PERFECTPOST = 'perfect';
    GOODPOST = 'good';
    PENDINGPOST = 'pending';
    FINISHEDPOST = 'finished';
    BADPOST = 'bbad';
    MYNAME = 'my_name';
 
    function ergodicData(dom) {
        let xDOM = $("#" + dom + " input");
        let formdata = new FormData();
        for (var i = 0; i < xDOM.length; i++) {
            var a = xDOM.eq(i).attr('name');
 
            if (xDOM.eq(i).val() === "") {
                console.log('qaq');
            } else if (xDOM.eq(i).attr('type') !== 'checkbox' || xDOM.eq(i).attr('checked')) { formdata.append(a, xDOM.eq(i).val()) }
        }
        xDOM = $("#" + dom + " select");
        for (i = 0; i < xDOM.length; i++) {
            a = xDOM.eq(i).attr('name');
            let b = xDOM.eq(i).children("[selected='selected']");
            formdata.append(a, b.val())
        }
        return formdata;
    }
}

function addStyle(){
    GM_addStyle(`
    #checkerContainer {
        background-color: rgb(184, 176, 176);
    }
    #checkerDiv {
        
    }
    .tipRed {
        color: red;
        font-size: 16px;
        font-weight: bold;
        display: block;
    }
    .tipGreen {
        color: green;
        font-size: 14px;
        display: block;
    }
    .tipYellow {
        color: yellow;
        font-size: 16px;
        font-weight: bold;
        display: block;
    }
    .tipNum {
        color: white;
    }
    .button {
        background-color: white;
        border: none;
        margin: 4px 2px;
    }
    `);
}

function checkMediaInfoBDInfo(){
    if (['movie', 'tvshow', 'tvplay', 'anime', 'documentary', 'stage', 'sport'].includes(TORRENT_INFO.category)) {
    // if (['movie', 'tvshow', 'tvplay', 'anime', 'documentary', 'mv', 'stage', 'sport'].includes(TORRENT_INFO.category)) {
        let BDorMediaInfo = checkBDInfoParse();
        if (BDorMediaInfo) {
            // 1.3 检查资源BDinfo或Mediainfo中的分辨与标题分辨率是否相符
            checkTitleResolution(BDorMediaInfo);
            // 1.4 检查资源Mediainfo或BDinfo中的视频/音频编码与标题中的视频/音频编码是否相符
            checkTitleCodec(BDorMediaInfo);
            // 6.2 国语粤语标签
            checkTagLangCnHk(BDorMediaInfo);
            // 6.3 字幕标签
            checkTagSub(BDorMediaInfo);
        }
        else {

        }
    }
}

const asyncCheckTorrentFilelist = async () => {
    if (!TORRENT_INFO.url.match(/offers/ig)) {
        let filelist = await getTorrentFilelist();
        if (filelist){
            // 8.2 Torrent文件检查，检查文件中是否包含无关文件
            checkTorrentFiles(filelist);
            // 8.2 Torrent文件检查，音乐类型
            checkMusicTorrentFile(filelist);    
        }
    }
}

async function checkIndex(docHtml){
    // var getTorrentInfo5;
    // if (!CURRENT_SITE_INFO) {
    //     getTorrentInfo5 = null;
    //     return null;
    // } else if (CURRENT_SITE_INFO.siteType === "NexusPHP") {
    //     getTorrentInfo5 = nexusphp_default(docHtml);
    // }
    TIP_LIST = [];
    initTorrentInfo();
    var getTorrentInfo5 = nexusphp_default(docHtml);

    // var source_default = getTorrentInfo5;
    
    // // src/index.js
    // var paramsMatchArray = location.hash && location.hash.match(/(^|#)torrentInfo=([^#]*)(#|$)/);
    // var torrentParams = paramsMatchArray && paramsMatchArray.length > 0 ? paramsMatchArray[2] : null;
    // if (CURRENT_SITE_NAME) {
    //     if (CURRENT_SITE_INFO.asTarget) {
    //         if (torrentParams) {
    //             torrentParams = JSON.parse(decodeURIComponent(torrentParams));
    //         }
    //     }
    //     if (CURRENT_SITE_INFO.asSource && !location.href.match(/upload/ig) && !(CURRENT_SITE_INFO.search && location.pathname.match(CURRENT_SITE_INFO.search.path) && (getUrlParam("imdb") || getUrlParam("name")))) {
    //         // source_default().then(() => {
    //         //     console.log(TORRENT_INFO);
    //         // });
    //     }
    // }  
    // addStyle();
    
    checkTitleYear();
    checkTitleChars();

    checkMediaInfoBDInfo();

    // 1.4.1 检查音乐类型音频编码
    if (TORRENT_INFO.category == 'music') {
        checkMusicCodec();
    }
    // 1.5 检查主标题中除视频编码及音频编码外，多余的点需要删除
    checkTitleDotNum();
    //1.6 检查主标题中的除了26个英文字幕及.’之外的无关字符
    checkTitleLetters();
    //1.7 BDMV BDISO BDBOX 替换为Blu-ray，DVDISO替换为DVD
    checkTitleBDType();
    // 2.3 检查简介中海报是否缺失
    checkBIPost();
    // 4.1 修正标题含有Remux，WEB-DL，WEBRip，DVDRip，HDTV、x264，x265，H264，H265等，质量勾选blu-ray和UHD类。（字母不区分大小写）
    checkVideoType();
    // 5.1 根据豆瓣和imdb检查修正资源产地
    checkArea();
    // 6.1 官方标签
    checkOfficialTag();
    // 6.4 DIY标签
    checkDiyTag();
    // 6.5 FLAC标签
    checkFLAC();
    // 7 官组 logo 检测：非官组作品，跳过检测。
    checkOfficialLogo();
    // 8.1 检查资源imdb和豆瓣缺失
    checkDoubanIMDbUrl();

    if (!TORRENT_INFO.url.match(/offers/ig)) {
        //TODO: 8.3 根据体积大小和文件后缀，判断种子是否重复
        checkTorrentDuplicate();
        // 8.4 记录逾期未修改不合规资源数量及发布者id
        checkCommentElements(docHtml);
        // 8.2 Torrent文件检查，检查文件中是否包含无关文件
        // 8.2 Torrent文件检查，音乐类型
        await asyncCheckTorrentFilelist()
    }
    // 8.5 剧集集数检查
    checkSeriesNum();
    // 8.6 禁发识别
    asyncCheckBanedResource();

    // 8.8 黑名单小组
    checkBannedGroup();
}


let checkerDiv;

function clickRedYellow() {
    checkerDiv.innerHTML = '';;
    var tipRed = TIP_LIST.filter(item => item.class == 'tipRed');
    const list = document.createElement('ul'); 
    tipRed.forEach(tip => {
        const listItem = document.createElement('li'); // 为每个 tip 创建一个 li 元素
        listItem.className = "tipRed";
        listItem.textContent = tip.msg; // 将 tip 中的文本赋值给 li 元素
        list.appendChild(listItem); // 将 li 元素添加到 ul 元素中
    });
    var tipYellow = TIP_LIST.filter(item => item.class == 'tipYellow');
    tipYellow.forEach(tip => {
        const listItem = document.createElement('li'); 
        listItem.className = "tipYellow";
        listItem.textContent = tip.msg; 
        list.appendChild(listItem); 
    });
    
    checkerDiv.appendChild(list);
}


function clickRed() {
    checkerDiv.innerHTML = '';;
    var tipRed = TIP_LIST.filter(item => item.class == 'tipRed');
    const list = document.createElement('ul'); 
    tipRed.forEach(tip => {
        const listItem = document.createElement('li'); // 为每个 tip 创建一个 li 元素
        listItem.className = "tipRed";
        listItem.textContent = tip.msg; // 将 tip 中的文本赋值给 li 元素
        list.appendChild(listItem); // 将 li 元素添加到 ul 元素中
      });
      checkerDiv.appendChild(list);
}

function clickYellow() {
    checkerDiv.innerHTML = '';;
    var tipYellow = TIP_LIST.filter(item => item.class == 'tipYellow');
    const list = document.createElement('ul'); 
    tipYellow.forEach(tip => {
        const listItem = document.createElement('li'); 
        listItem.className = "tipYellow";
        listItem.textContent = tip.msg; 
        list.appendChild(listItem); 
      });
      checkerDiv.appendChild(list);
}

function clickGreen() {
    checkerDiv.innerHTML = '';;
    var tipGreen = TIP_LIST.filter(item => item.class == 'tipGreen');
    const list = document.createElement('ul'); 
    tipGreen.forEach(tip => {
        const listItem = document.createElement('li'); 
        listItem.className = "tipGreen";
        listItem.textContent = tip.msg; 
        list.appendChild(listItem); 
      });
    checkerDiv.appendChild(list);
}

function showResultDiv(docHtml){
    addStyle();
    let checkerContainer = docHtml.createElement('div');
    checkerContainer.id = 'checkerContainer';
    docHtml.getElementById('top').after(checkerContainer);
    checkerContainer.innerHTML = '<div id="checkerClick"><h1 class="tipNum">检查结果</h1></div>';
    checkerDiv = document.createElement('div');
    checkerDiv.id = 'checkerDiv';
    document.getElementById('checkerContainer').appendChild(checkerDiv);

    let checkerNum = docHtml.createElement('div');
    checkerNum.id = 'checkerNum';
    docHtml.getElementById('checkerClick').appendChild(checkerNum);
    
    var tipRed = TIP_LIST.filter(item => item.class == 'tipRed');
    var tipYellow = TIP_LIST.filter(item => item.class == 'tipYellow');
    var tipGreen = TIP_LIST.filter(item => item.class == 'tipGreen');

    checkerNum.innerHTML = '<h1 class="tipNum">总计: ' + '<span style="color:blue;">' +  TIP_LIST.length +
        '</span> <span id="clickRed" style="cursor:pointer;">错误: ' + '<span style="color:red;">' + tipRed.length+
        '</span></span> <span id="clickYellow" style="cursor:pointer;">警告: ' + '<span style="color:yellow;">' + tipYellow.length +
        '</span></span> <span id="clickGreen" style="cursor:pointer;">通过: ' + '<span style="color:green;">' + tipGreen.length + '</span></span></h1>';
    document.getElementById('clickRed').onclick = clickRed;
    document.getElementById('clickYellow').onclick = clickYellow;
    document.getElementById('clickGreen').onclick = clickGreen;

    clickRedYellow();
}

var BAN_LIST_HTML = '';
const asyncCheckInDetailPage = async (docHtml) => {
    if (BAN_LIST_HTML.length < 1){
        BAN_LIST_HTML = await getBannedResource();
    }
    await checkIndex(docHtml);
    console.log(TIP_LIST);
    showResultDiv(docHtml);
}


var asyncBatchCheck = async (listHtml) => {
    $("#process-log").text("处理中...");
    let torlist = $(listHtml).find("#torrenttable > tbody > tr");
    let checkCount = 0;
    let checkRedCount = 0;
    for (let index = 1; index < torlist.length; ++index) {

        if ($(torlist[index]).is(":visible")) {
            let element = torlist[index];
            let item = $(element).find(" table > tbody > tr > td > div > div:nth-child(1) > a");
            let eleChecked = $(element).find("table > tbody > tr > td:nth-child(5) > div > a > img");
            if (item.length > 0 && $(eleChecked).attr('title')=='还没有审核'){
                let detailhtml = await $.get(item[0].href);
                checkIndex(detailhtml);
                console.log(TIP_LIST);
                var tipRed = TIP_LIST.filter(item => item.class === 'tipRed');
                var tipYellow = TIP_LIST.filter(item => item.class === 'tipYellow');
                if (tipRed.length > 0){
                    $(element).css("background-color", "rgb(248 113 113)");
                    checkRedCount++;
                }
                else if (tipYellow.length > 0){
                    $(element).css("background-color", "rgb(253 230 138)");
                }
                else {
                    $(element).css("background-color", "rgb(167 243 208)");
                }
                checkCount++;
            }
            //await sleep(200);
        }
    }
    $("#process-log").text("检查数量：" + checkCount + " 有错："+checkRedCount);
}

function onClickBatchCheck(html) {
    asyncBatchCheck(html);
}

function addFilterPanel() {
  var torTable = $("#torrenttable");
  if (torTable.length <= 0) {
    return;
  }

  var donwnloadPanel = `
  <table align='center'> <tr>
    <td style='width: 270px; border: none;'>
    </td>
    <td style='width: 160px; border: none;'>
          <button type="button" id="btn-batch-check" style="margin-top: 5px;margin-bottom: 5px;margin-left: 5px;">
          种审一键检查
          </button>
    </td>
    <td style='width: 90px; border: none;'> <div id="process-log" style="margin-left: 5px;"></div> </td>

  </tr>
  </table>
`;
  torTable.before(donwnloadPanel);
}


(function () {
    "use strict";
    if (window.location.href.match(/(details.php|offer.php)/)){
        asyncCheckInDetailPage(document);
    } 
    else if (window.location.href.match(/(officialgroup.php|torrents.php)/))
    {
      addFilterPanel();
      $("#btn-batch-check").click(function () {
        onClickBatchCheck(document);
      });
    }
})();