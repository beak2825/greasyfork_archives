// ==UserScript==
// @name         RedLeaves Torrent Helper
// @author       beer
// @version      0.0.6
// @description  Assist with checking torrents.
// @require      https://cdn.staticfile.org/jquery/1.7.1/jquery.min.js
// @match        https://leaves.red/details.php?id=*
// @match        https://leaves.red/offers.php?id=*
// @icon         https://leaves.red/favicon.ico
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
// @downloadURL https://update.greasyfork.org/scripts/455090/RedLeaves%20Torrent%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/455090/RedLeaves%20Torrent%20Helper.meta.js
// ==/UserScript==
(() => {
    var torrent = {
        id: "",
        title: "",
        subtitle: "",
        freeleech_status: "",
        freeleech_left_time: "",
        check_status: "",
        download_url: "",
        torrent_name: "",
        uploader: "",
        uploader_class: "",
        upload_time: "",
        size: "",
        category: "",
        media: "",
        encode: "",
        audio_encode: "",
        resolution: "",
        process: "",
        report_url: "",
        claimed: 0,
        claim_limit: 0,
        claim_detail_url: "",
        torrent_link: "",
        $subtitles: [],
        $media_info: "",
        media_infos: {},
        media_infos_valid: false,
        bd_infos: {},
        bd_infos_valid: false,
        $imdb_info: null,
        $description: null,
        other_versions: [],
        opened: 0,
        clicked: 0,
        downloaded: 0,
        seeder: 0,
        leecher: 0,
        tags: {
            official: false,
            buy_it_myself: false,
            forward_forbidden: false,
            first_release: false,
            diy: false,
            chinese_audio: false,
            chinese_subtitle: false,
            scraped: false,
            hdr: false,
            cantonese_audio: false,
            dovi: false,
            original: false,
            fill_request: false,
            for_children: false,
            asmr: false,
            multi_cast: false,
            ai: false,
            speech: false,
            nobonus: false
        },
        filelist: [],
        file_ext_list: [],
        screenshots: [],
        year: "",
        movieAkaName: "",
        movieName: "",
        poster: ""
    };

    var getAudioCodecFromTitle = (title) => {
        if (!title) {
            return "";
        }
        title = title.replace(/:|-|\s/g, "");
        if (title.match(/atmos/i)) {
            return "atmos";
        } else if (title.match(/dtshdma/i)) {
            return "dtshdma";
        } else if (title.match(/dtsx/i) && !title.match(/dtsx2/i)) {
            return "dtsx";
        } else if (title.match(/dts/i)) {
            return "dts";
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
        }
        return "";
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
        torrent.media_infos_valid = true;
        torrent.media_infos = {
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
        const height = parseInt(getMediaValueByKey("Height", mediaInfo).replace(/\s/g, ""));
        const width = parseInt(getMediaValueByKey("Width", mediaInfo).replace(/\s/g, ""));
        const ScanType = getMediaValueByKey("Scan type", mediaInfo);
        const Standard = getMediaValueByKey("Standard", mediaInfo);
        if (Standard == 'NTSC') { // dvd原盘才判断这个
            return 'NTSC';
        } else if (height >= 2160 && 2872 - 10 <= width && width <= 4096 + 10) {
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
        } else if (height >= 576 && 766 - 10 <= width && width <= 1024 + 10 && ScanType === "Progressive") {
            return '576p';
        } else if (height >= 576 && 766 - 10 <= width && width <= 1024 + 10 && ScanType == "MBAFF") {
            return '576i';
        } else if (height >= 576 && 766 - 10 <= width && width <= 1024 + 10 && ScanType == "Interlaced") {
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
        } else if (width <= 1024 + 10 && height <= 576 + 10 && height >= 480 + 10 && ScanType === "Progressive") {
            return '576p';
        } else if (width <= 1024 + 10 && height <= 576 + 10 && height >= 480 + 10 && ScanType == "MBAFF") {
            return '576i';
        } else if (width <= 1024 + 10 && height <= 576 + 10 && height >= 480 + 10 && ScanType == "Interlaced") {
            return '576i';
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
        else {
            mediaTags.chinese_audio = false;
        }
        if (languageArray.includes("Cantonese") || languageArray2.toString().match("Cantonese")) {
            mediaTags.cantonese_audio = true;
        }
        else {
            mediaTags.cantonese_audio = false;
        }
        if (hasChineseSubtitle) {
            mediaTags.chinese_subtitle = true;
        }
        else {
            mediaTags.chinese_subtitle = false;
        }
        if (hdrFormat) {
            if (hdrFormat.match(/HDR10\+/i)) {
                mediaTags.hdr10_plus = true;
                mediaTags.hdr = false;
            } else if (hdrFormat.match(/HDR/i)) {
                mediaTags.hdr10_plus = false;
                mediaTags.hdr = true;
            }
        }
        else {
            mediaTags.hdr10_plus = false;
            mediaTags.hdr = false;
        }
        if (isDV) {
            mediaTags.dolby_vision = true;
        }
        else {
            mediaTags.dolby_vision = false;
        }
        if (audioCodec.match(/dtsx|atmos/ig)) {
            mediaTags.dts_x = true;
            mediaTags.dolby_atmos = false;
        } else if (audioCodec.match(/atmos/ig)) {
            mediaTags.dts_x = false;
            mediaTags.dolby_atmos = true;
        }
        else {
            mediaTags.dts_x = false;
            mediaTags.dolby_atmos = false;
        }
        return mediaTags;
    };
    var getVideoCodecByMediaInfo = (mainVideo, generalPart, secondVideo, videoType) => {
        const generalFormat = getMediaValueByKey("Format", generalPart);
        const videoFormat = getMediaValueByKey("Format", mainVideo);
        const videoFormatVersion = getMediaValueByKey("Format version", mainVideo);
        const videoCodeId = getMediaValueByKey("Codec ID", mainVideo);
        const hdrFormat = getMediaValueByKey("HDR format", mainVideo);
        const isDV = hdrFormat.match(/Dolby\s*Vision/i) || secondVideo.length > 0 && getMediaValueByKey("HDR format", secondVideo[0]).match(/Dolby\s*Vision/i);
        const isEncoded = !!getMediaValueByKey("Encoding settings", mainVideo);
        let videoCodec = "";
        if (videoFormat === "MPEG Video" && videoFormatVersion === "Version 2") {
            videoCodec = "mpeg2";
        } else if (videoCodeId.match(/xvid/i)) {
            videoCodec = "xvid";
        } else if (videoFormat.match(/HEVC/i) && !isEncoded) {
            videoCodec = "hevc";
        } else if (videoFormat.match(/HEVC/i) && isEncoded) {
            videoCodec = "x265";
        } else if (videoFormat.match(/AVC/i) && isEncoded) {
            videoCodec = "x264";
        } else if (videoFormat.match(/AVC/i) && !isEncoded) {
            videoCodec = "h264";
        } else if (videoFormat.match(/VC-1/i)) {
            videoCodec = "vc1";
        } else if (videoFormat.match(/VP9/i)) {
            videoCodec = "vp9";
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
        } else if (audioFormat.match(/MLP FBA/i) && !commercialName.match(/Dolby Atmos/i)) {
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
        torrent.bd_infos = {
            fileSize,
            videoCodec,
            subtitles: subtitleLanguageArray,
            audioCodec,
            resolution,
            mediaTags
        };
        torrent.bd_infos_valid = true;
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
    var getBDInfoOrMediaInfo = (content) => {
        if (content.match(/Disc\s?Size|\.mpls/i)) {
            return true;
        }
        if (content.match(/(Unique\s*ID)|(Codec\s*ID)|(Stream\s*size)/i)) {
            return false;
        }
        else {
            return false;
        }
    };

    torrent.id = window.location.href.match(/id=(\d+)/g)[0].split('=')[1];
    torrent.filelist_url = 'https://leaves.red/viewfilelist.php?id=' + torrent.id;

    let $top = $('#top');
    torrent.$title_node = $top;
    torrent.title = $top[0].childNodes[0].nodeValue.trim();

    let $freeleech_status_node = $top.find('.twouphalfdown,.free,.twoupfree,.twoup,.halfdown,.thirtypercent');
    if($freeleech_status_node.length) {
        torrent.freeleech_status = $freeleech_status_node.attr('class');
        torrent.freeleech_left_time = $top.find('[title^=20]').text();
    }
    else {
        torrent.freeleech_status = 'normal';
    }

    if($top.find('[title="通过"]').length) {
        torrent.check_status = 'checked';
    }
    else if($top.find('[title="未审"]').length) {
        torrent.check_status = 'uncheck';
    }
    else {
        torrent.check_status = 'forbid';
    }

    let $table = $('a[href^=download]').closest('table');
    torrent.seeder = $table.find('#peercount>b:eq(0)').text().match(/\d+/g)[0];
    torrent.leecher = $table.find('#peercount>b:eq(1)').text().match(/\d+/g)[0];
    $table.find('tr').each(function () {
        let rowhead = $(this).find('td.rowhead').text().trim();
        let $rowfollow = $(this).find('td.rowfollow');
        switch(rowhead) {
            case '下载':
                torrent.download_url = $rowfollow.find('a:first').attr('href');
                torrent.torrent_name = $rowfollow.find('a:first').text();
                torrent.uploader = $rowfollow.find('a.Uploader_Name').text();
                torrent.uploader_class = $rowfollow.find('b.Uploader_Name').text();
                torrent.upload_time = $rowfollow.find('span[title^=20]').text();
                break;
            case '副标题':
                torrent.subtitle = $rowfollow.text();
                break;
            case '基本信息': {
                let nodes = $rowfollow[0].childNodes;
                for(let i = 0; i < nodes.length; i+=2) {
                    switch(nodes[i].innerText.trim()) {
                        case '大小：': torrent.size = nodes[i+1].nodeValue.trim(); break;
                        case '类型:': torrent.category = nodes[i+1].nodeValue.trim(); break;
                        case '媒介:': torrent.media = nodes[i+1].nodeValue.trim(); break;
                        case '编码:': torrent.encode = nodes[i+1].nodeValue.trim(); break;
                        case '音频编码:': torrent.audio_encode = nodes[i+1].nodeValue.trim(); break;
                        case '分辨率:': torrent.resolution = nodes[i+1].nodeValue.trim(); break;
                        case '处理:': torrent.process = nodes[i+1].nodeValue.trim(); break;
                    }
                }
                break;
            }
            case '行为':
                torrent.report_url = $rowfollow.find('a[title="举报该种子违反了规则"]').attr('href');
                break;
            case '认领种子':
                torrent.claimed = $rowfollow.find('b:first').text();
                torrent.claim_limit = $rowfollow.find('b:eq(1)').text();
                torrent.claim_detail_url = $rowfollow.find('a').attr('href');
                break;
            case '种子链接':
                torrent.torrent_link = $rowfollow.find('a').attr('href');
                break;
            case '字幕':
                $rowfollow.find('tbody:first').find('tr').each(function () {
                    if($(this).text() != '该种子暂无字幕') {
                        torrent.$subtitles.push($(this));
                    }
                });
                break;
            case 'MediaInfo':
                torrent.$media_info = $rowfollow;
                if(getBDInfoOrMediaInfo($rowfollow.text())) {
                    getInfoFromBDInfo($rowfollow.text());
                }
                else {
                    getInfoFromMediaInfo($rowfollow.find('.nexus-media-info-raw .spoiler-content').text());
                }
                break;
            case '简介':
                torrent.$description = $rowfollow.find('#kdescr');
                break;
            case 'IMDb信息':
                torrent.$imdb_info = $rowfollow;
                break;
            case '其它版本':
                $rowfollow.find('a[href^="https://leaves.red/details.php?id="]').each(function () {
                    torrent.other_versions.push($(this).attr('href'));
                });
                break;
            case '热度表':
                torrent.opened = $rowfollow.find('td:eq(0)')[0].childNodes[1].nodeValue.trim();
                torrent.clicked = $rowfollow.find('td:eq(1)')[0].childNodes[1].nodeValue.trim();
                torrent.downloaded = $rowfollow.find('td:eq(2)').find('a b').text();
                break;
            case '标签':
                $rowfollow.find('span').each(function () {
                    switch($(this).text()) {
                        case '官方': torrent.tags.official = true; break;
                        case '自购': torrent.tags.buy_it_myself = true; break;
                        case '禁转': torrent.tags.forward_forbidden = true; break;
                        case '首发': torrent.tags.first_release = true; break;
                        case 'DIY': torrent.tags.diy = true; break;
                        case '国语': torrent.tags.chinese_audio = true; break;
                        case '中字': torrent.tags.chinese_subtitle = true; break;
                        case '已刮削':torrent.tags.scraped = true; break;
                        case 'HDR': torrent.tags.hdr = true; break;
                        case '粤语': torrent.tags.cantonese_audio = true; break;
                        case 'DoVi': torrent.tags.dovi = true; break;
                        case '原创': torrent.tags.original = true; break;
                        case '应求': torrent.tags.fill_request = true; break;
                        case '儿童': torrent.tags.for_children = true; break;
                        case 'ASMR': torrent.tags.asmr = true; break;
                        case '多播': torrent.tags.multi_cast = true; break;
                        case 'AI': torrent.tags.ai = true; break;
                        case '演讲': torrent.tags.speech = true; break;
                        case '零魔': torrent.tags.nobonus = true; break;
                    }
                });
                break;
        }
    });

    // 获取文件列表
    async function getFileList(url) {
        let prom = new Promise( function(resolve, reject) {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    resolve(response);
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
        let XMLResponse = await prom;
        let response = XMLResponse.response;
        $(response).find('.rowfollow').each(function () {
            if($(this).index() == 0) {
                torrent.filelist.push($(this).text());
            }
        });
    }

    // 获取文件后缀名
    function get_file_ext(filename) {
        let fields = filename.split('.');
        if(fields.lenght == 1) {
            return "";
        }
        else {
            return fields[fields.length-1].toLowerCase();
        }
    }

    // 时间转换分钟数
    function time_parse(timestr) {
        let year_find = timestr.match(/\d+年/g);
        let month_find = timestr.match(/\d+月/g);
        let day_find = timestr.match(/\d+天/g);
        let hour_find = timestr.match(/\d+时/g);
        let minute_find = timestr.match(/\d+分/g);
        let year = year_find? parseInt(year_find[0].substr(0, year_find[0].length-1)) : 0;
        let month = month_find? parseInt(month_find[0].substr(0, month_find[0].length-1)) : 0;
        let day = day_find? parseInt(day_find[0].substr(0, day_find[0].length-1)) : 0;
        let hour = hour_find? parseInt(hour_find[0].substr(0, hour_find[0].length-1)) : 0;
        let minute = minute_find? parseInt(minute_find[0].substr(0, minute_find[0].length-1)) : 0;
        return ((year * 365 + month *30 + day) * 24 + hour) * 60 + minute;
    }

    // 获取可能重复项
    async function getSearchTable() {}

    async function waitInfoLoad() {
        await Promise.all([getFileList(torrent.filelist_url), getSearchTable()]);
        for(let i = 0; i < torrent.filelist.length; i++) {
            let ext = get_file_ext(torrent.filelist[i]);
            if(torrent.file_ext_list.indexOf(ext) == -1) {
                torrent.file_ext_list.push(ext);
            }
        }
    }

// RedLeaves 种子信息检查

    // 检查结果样式
    GM_addStyle(`
#checkerContainer {
  background-color: rgb(237, 171, 119);
  width: 940px;
  border: 1px solid;
}
#checkerDiv {

}
.tipRed {
  color: rgb(150, 30, 30);
  display: block;
}
.tipGreen {
  color: green;
  display: none;
}
.tipYellow {
  color: rgb(184, 134, 11);
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

    async function check() {
        let checkerContainer = document.createElement('div');
        checkerContainer.id = 'checkerContainer';
        torrent.$title_node.after(checkerContainer);

        let checkerDiv = document.createElement('div');
        checkerDiv.id = 'checkerDiv';
        document.getElementById('checkerContainer').appendChild(checkerDiv);
        let tipRed = 0, tipGreen = 0, tipYellow = 0, tipAll = 0, tipInfo = [];

        // 检查规则
        let normal_categories = ['Movies (电影)', 'Documentaries (纪实)', 'Animations (动画)', 'TV Series (剧集)', 'TV Shows (电视节目)', 'Music Videos (音乐录影带)', 'Sports (竞技体育)', 'Misc (杂项/软件/其他)', 'HQ Audio (高清音频/音乐)'];
        let special_categories = ['奇幻玄幻 (Xuanhuan/Fantasy)', '武侠仙侠 (Wuxia/Xianxia)', '科幻末日 (SciFi)', '合集大包(Package)', '都市娱乐 (Urban/Metropolis)', '历史军事 (History/Military)', '灵异悬疑 (Mystery/Supernatural)', '游戏竞技 (Game/Sports)', '轻小说 (Light Novel)', '二次元 (ACGN)', '言情小说 (Romance)', '文学出版 (Literature/Published)', '电台节目 (Radio Shows)', '相声评书 (Crosstalk)', '外语读物 (Non-Chinese)', '耽美百合 (LGBT-related)', '学习考试 (Edu/Exam)', '传统戏曲 (Traditional Opera)'];

        // 1 普通种子
        if(normal_categories.indexOf(torrent.category) != -1) {
            //1.1 允许的资源类型
            if((torrent.category != 'Misc (杂项/软件/其他)') && (torrent.category != 'HQ Audio (高清音频/音乐)')) {
                if((torrent.file_ext_list.indexOf('rm') != -1) || (torrent.file_ext_list.indexOf('rmvb') != -1) || (torrent.file_ext_list.indexOf('flv') != -1)) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1 RealVideo编码的视频或flv格式视频"});
                }
                else {
                    let allowed_media = ['Blu-ray', 'HD DVD', 'Remux', 'HDTV', 'Encode', 'WEB-DL'];
                    let allowed_resolution = ['720p', '1080p', '1080i', 'SD', '4K', '8K'];
                    if(allowed_media.indexOf(torrent.media) == -1) {
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1 不允许的资源类型 - 不允许的媒介"});
                    }
                    else if((torrent.media == 'Encode') || (torrent.media == 'WEB-DL')) {
                        if(allowed_resolution.indexOf(torrent.resolution) == -1) {
                            tipRed += 1;
                            tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1  - 不允许的分辨率"});
                        }
                        else if((torrent.resolution == 'SD') && (torrent.title.match(/CAM|TC|TS|SCR|DVDSCR|R5|R5.Line|HalfCD/i))) {
                            tipRed += 1;
                            tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1 标清但是质量较差的视频文件"});
                        }
                        else {
                            tipGreen += 1;
                            console.log("检查通过: 1.1 允许的资源类型");
                        }
                    }
                    else {
                        tipGreen += 1;
                        console.log("检查通过: 1.1 允许的资源类型");
                    }
                }
            }
            else if(torrent.category == 'HQ Audio (高清音频/音乐)') {
                if(torrent.media == '') {
                    tipYellow += 1;
                    tipInfo.push({ class:'tipYellow', color: 'yellow', info: "错误: 1.0 音频编码不明"});
                }
                tipAll += 1;
                if((torrent.media == '') || (torrent.media == 'Lossy')) {
                    if((torrent.file_ext_list.indexOf('mp3') != -1) || (torrent.file_ext_list.indexOf('wav') != -1)) {
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1 有损WAV或有损MP3"});
                    }
                    else if(torrent.audio_encode == 'FLAC') {
                        tipGreen += 1;
                        console.log("检查通过: 1.1 允许的资源类型");
                    }
                    else {
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1 不允许的资源类型"});
                    }
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 1.1 允许的资源类型");
                }
            }
            else {
                tipGreen += 1;
                console.log("检查通过: 1.1 允许的资源类型");
            }
            tipAll += 1;

            // 1.2 基于mediainfo或bdinfo的检查
            if(torrent.media_infos_valid || torrent.bd_infos_valid) {
                tipGreen += 1;
                console.log("检查通过: 1.2.0 mediainfo或bdinfo存在");
                let infos = {
                    video_encode: '',
                    audio_encode: '',
                    resolution: '',
                    chinese_audio: false,
                    cantonese_audio: false,
                    chinese_subtitle: false,
                    hdr: false,
                    dovi: false
                }
                let mediainfo2tag_videoencode = {
                    'x264'  : 'H.264',
                    'h264'  : 'H.264',
                    'hevc'  : 'H.265',
                    'x265'  : 'H.265',
                    'vc1'   : 'VC-1',
                    'mpeg2' : 'MPEG-4',
                    'mpeg-2': 'MPEG-4',
                    'mpeg4' : 'MPEG-4',
                    'xvid'  : 'Xvid',
                    'vp9'   : 'VP-9',
                    'avc'   : 'H.264',
                    'mvc'   : 'H.264'
                }
                let mediainfo2tag_audioencode = {
                    'aac'    : 'AAC',
                    'flac'   : 'FLAC',
                    'dtsx'   : 'DTS',
                    'dtshdma': 'DTS-HD',
                    'dts'    : 'DTS',
                    'mp2'    : 'MP3',
                    'truehd' : 'TruHD',
                    'ac3'    : 'AC-3',
                    'dd'     : 'AC-3',
                    'dd+'    : 'AC-3',
                    'eac3'   : 'AC-3',
                    'atoms'  : 'Other',
                    'lpcm'   : 'Other',
                    'pcm'    : 'Other'
                }
                let mediainfo2tag_resolution = {
                    '1080p'    : '1080p',
                    '2160p'   : '4K',
                    '1080i'   : '1080i',
                    '720p': '720p',
                    'NTSC'    : 'SD',
                    '4320p'    : '8K'
                }
                if(torrent.media_infos_valid) {
                    infos.video_encode = mediainfo2tag_videoencode[torrent.media_infos.videoCodec];
                    infos.audio_encode = mediainfo2tag_audioencode[torrent.media_infos.audioCodec];
                    infos.resolution = mediainfo2tag_resolution[torrent.media_infos.resolution];
                    infos.chinese_audio = torrent.media_infos.mediaTags.chinese_audio;
                    infos.cantonese_audio = torrent.media_infos.mediaTags.cantonese_audio;
                    infos.chinese_subtitle = torrent.media_infos.mediaTags.chinese_subtitle;
                    infos.hdr = torrent.media_infos.mediaTags.hdr || torrent.media_infos.mediaTags.hdr10_plus;
                    infos.dovi = torrent.media_infos.mediaTags.dolby_atmos || torrent.media_infos.mediaTags.dolby_vision;
                }
                else {
                    infos.video_encode = mediainfo2tag_videoencode[torrent.bd_infos.videoCodec];
                    infos.audio_encode = mediainfo2tag_audioencode[torrent.bd_infos.audioCodec];
                    infos.resolution = mediainfo2tag_resolution[torrent.bd_infos.resolution];
                    infos.chinese_audio = torrent.bd_infos.mediaTags.chinese_audio;
                    infos.cantonese_audio = torrent.bd_infos.mediaTags.cantonese_audio;
                    infos.chinese_subtitle = torrent.bd_infos.mediaTags.chinese_subtitle;
                    infos.hdr = torrent.bd_infos.mediaTags.hdr || torrent.bd_infos.mediaTags.hdr10_plus;
                    infos.dovi = torrent.bd_infos.mediaTags.dolby_atmos || torrent.bd_infos.mediaTags.dolby_vision;
                }
                // 1.2.1 编码与mediainfo一致
                if(infos.video_encode != torrent.encode) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.2.1 编码与mediainfo不一致"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 1.2.1 编码与mediainfo一致");
                }
                tipAll += 1;

                // 1.2.2 音频编码与mediainfo一致
                if(infos.audio_encode != torrent.audio_encode) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.2.2 音频编码与mediainfo不一致"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 1.2.2 音频编码与mediainfo一致");
                }
                tipAll += 1;

                // 1.2.3 分辨率与mediainfo一致
                if(infos.resolution != torrent.resolution) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.2.3 分辨率与mediainfo不一致"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 1.2.3 分辨率与mediainfo一致");
                }
                tipAll += 1;

                function tag_check(id, tag_name, media_info_tag, torrent_tag, ) {
                    if(media_info_tag) {
                        if(torrent_tag) {
                            tipGreen += 1;
                            console.log('检查通过: ' + id + ' ' + tag_name + '标签与mediainfo一致');
                        }
                        else {
                            tipRed += 1;
                            tipInfo.push({ class:'tipRed', color: 'red', info: '错误: ' + id + ' mediainfo显示应有' + tag_name + '标签'});
                        }
                    }
                    else {
                        if(torrent_tag) {
                            tipRed += 1;
                            tipInfo.push({ class:'tipRed', color: 'red', info: '错误: ' + id + ' mediainfo显示不应有' + tag_name + '标签'});
                        }
                        else {
                            tipGreen += 1;
                            console.log('检查通过: ' + id + ' ' + tag_name + '标签与mediainfo一致');
                        }
                    }
                }

                // 1.2.4 国语标签与mediainfo一致
                tag_check('1.2.4', '国语', infos.chinese_audio, torrent.tags.chinese_audio);
                tipAll += 1;

                // 1.2.5 粤语标签与mediainfo一致
                tag_check('1.2.5', '粤语', infos.cantonese_audio, torrent.tags.cantonese_audio);
                tipAll += 1;

                // 1.2.6 中字标签与mediainfo一致
                tag_check('1.2.6', '中字', infos.chinese_subtitle, torrent.tags.chinese_subtitle);
                tipAll += 1;

                // 1.2.7 HDR标签与mediainfo一致
                tag_check('1.2.7', 'HDR', infos.hdr, torrent.tags.hdr);
                tipAll += 1;

                // 1.2.8 DoVi标签与mediainfo一致
                tag_check('1.2.8', 'DoVi', infos.dovi, torrent.tags.dovi);
                tipAll += 1;
                if(torrent.bd_infos_valid) {
                    // 1.2.9 bdinfo存在，媒介应为Blu-ray
                    if(torrent.media != 'Blu-ray') {
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.2.9 bdinfo存在，媒介应为Blu-ray"});
                    }
                    else {
                        tipGreen += 1;
                        console.log("检查通过: 1.2.9 bdinfo存在，媒介应为Blu-ray");
                    }
                    tipAll += 1;
                }
            }
            else {
                tipYellow += 1;
                tipInfo.push({ class:'tipYellow', color: 'yellow', info: "错误: 1.2.0 缺少mediainfo和bdinfo"});
            }
            tipAll += 1;

            // 1.3 种子信息
            // 1.3.1 标题
            let media_dict = {
                'Blu-ray': '(Blu-ray|Bluray)',
                'Remux': 'Remux',
                'HDTV': 'HDTV',
                'HD DVD': 'DVD',
                'Encode': 'Encode',
                'WEB-DL': '(WEB-DL|WEBDL)'
            }
            let video_encode_dict = {
                'H.264': '(H\.264|AVC|H264|x264)',
                'H.265': '(H\.265|HEVC|H265|x265)',
                'VC-1': 'VC-1',
                'MPEG-4': '(MPEG2|MPEG-2)'
            }
            let resolution_dict = {
                '720p': '720p',
                '1080p': '1080p',
                '1080i': '1080i',
                'SD': '(480p|576p)',
                '4K': '(2160p|4K)',
                '8K': '(4320p|8K)'
            }

            if((torrent.category == 'Movies (电影)') || (torrent.category == 'Documentaries (纪实)') || (torrent.category == 'Animations (动画)')) {
                let re = new RegExp('.+' + resolution_dict[torrent.resolution] + '.*' + media_dict[torrent.media] + '.*' + video_encode_dict[torrent.encode] + '.*-.+', 'i');
                if(!re.test(torrent.title)) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.3.1 标题错误, 应为" + re});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 1.3.1 标题");
                }
                tipAll += 1;
            }
            else if(torrent.category == 'TV Series (剧集)') {
                let re = new RegExp('.+S\\d+.*' + resolution_dict[torrent.resolution] + '.*' + media_dict[torrent.media] + '.*' + video_encode_dict[torrent.encode] + '.*-.+', 'i');
                if(!re.test(torrent.title)) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.3.1 标题错误, 应为" + re});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 1.3.1 标题");
                }
                tipAll += 1;
            }
            else if(torrent.category == 'HQ Audio (高清音频/音乐)') {
                let re = new RegExp('.+-.+' + torrent.audio_encode, 'i');
                if(!re.test(torrent.title)) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.3.1 标题错误, 应为" + re});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 1.3.1 标题");
                }
                tipAll += 1;
            }

            // 1.4 副标题
            if(torrent.subtitle.match(/求种|续种/g)) {
                tipRed += 1;
                tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.4 副标题包含求种、续种请求"});
            }
            else {
                tipGreen += 1;
                console.log("检查通过: 1.4 副标题");
            }
            tipAll += 1;

            // 1.5 IMDB信息
            if((torrent.category == 'Movies (电影)') || (torrent.category == 'TV Series (剧集)')) {
                if(!torrent.$imdb_info && (torrent.$description.text().indexOf('www.imdb.com/title/t') == -1)) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.5 缺少IMDB信息"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 1.5 缺少IMDB信息");
                }
                tipAll += 1;
            }

            // 1.6 简介
            if((torrent.category == 'Movies (电影)') || (torrent.category == 'TV Series (剧集)') || (torrent.category == 'Animations (动画)')) {
                if(torrent.$description.find('img').length == 0) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.6 电影、电视剧、动漫必须包含海报、横幅或BD/HDDVD/DVD封面"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 1.6 简介");
                }
                tipAll += 1;
            }
            else if(torrent.category == 'HQ Audio (高清音频/音乐)') {
                if(torrent.$description.find('img').length == 0) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.6.1 音乐必须包含专辑封面"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 1.6.1 音乐必须包含专辑封面");
                }
                if(!torrent.$description.text().match(/专辑列表|曲目列表|list/i)) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.6.2 音乐必须包含曲目列表"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 1.6.2 音乐必须包含曲目列表");
                }
                tipAll += 1;
            }

            // 1.7 应在发布后24小时内做种
            let time_in_minutes = time_parse(torrent.upload_time);
            if(time_in_minutes > 24*60) {
                if(torrent.seeder == 0) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.7 超过24小时未做种或已断种"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 1.7 应在发布后24小时内做种");
                }
                tipAll += 1;
            }
        }
        else if(special_categories.indexOf(torrent.category) != -1) {
            // 2.1 标题应该至少包括5部分
            //书名-作家-配音演员-连载/完结-年份-音频格式码率-制作组
            let valid_title = true;
            let fields = torrent.title.split('-');
            if(fields.length < 5) {
                valid_title = false;
                tipRed += 1;
                tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.1.1 标题应该至少包括5部分 【严重错误，停止检查】"});
                tipAll += 1;
            }
            else {
                tipGreen += 1;
                console.log("检查通过: 2.1.1 标题应该包括5部分");
                tipAll += 1;

                let format_code_rate = '';
                torrent.name = fields[0].trim();
                torrent.author = fields[1].trim();
                torrent.cast = fields[2].trim();
                torrent.end = fields[3].trim();
                torrent.year = 0;
                torrent.group = '';
                if(fields.length == 7) {
                    torrent.year = fields[4].trim();
                    format_code_rate = fields[5].trim();
                    torrent.group = fields[6].trim();
                }
                else if(fields.length == 6) {
                    if(fields[4].match(/^\d+$/g)) {
                        torrent.year = fields[4].trim();
                    format_code_rate = fields[5].trim();
                    }
                    else {
                        format_code_rate = fields[4].trim();
                        torrent.group = fields[5].trim();
                    }
                }
                else {
                    format_code_rate = fields[4].trim();
                }
                let fcr_fields = format_code_rate.split(' ');
                if(fcr_fields.length != 2) {
                    valid_title = false;
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.1.2 标题应该包括音频格式、码率"});
                }
                else {
                    torrent.audio_format = fcr_fields[0];
                    torrent.code_rate = fcr_fields[1];
                }
            }
            if(valid_title) {
                // 2.2 副标题
                if(torrent.end == '完结') {
                    if(torrent.subtitle.match(/^全\s*\d+\s*集\s*-.*/g)) {
                        tipGreen += 1;
                        console.log("检查通过: 2.2 副标题");
                    }
                    else {
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.2 副标题格式错误"});
                    }
                }
                else {
                    if(torrent.subtitle.match(/^第\s*\d+\s*-\s*\d+\s*集\s*-.*/g)) {
                        tipGreen += 1;
                        console.log("检查通过: 2.2 副标题");
                    }
                    else {
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.2 副标题格式错误"});
                    }
                }
                tipAll += 1;
            }

            // 2.3 必须包含资源文件夹发布 &&  TODO
            // 2.4 文件夹名：书名.作家.配音演员.年份.音频格式.音频码率-制作组
            if(valid_title) {
                let torrent_name = torrent.torrent_name.substr(5, torrent.torrent_name.length - 13);
                let fields = torrent_name.split('.');
                if(fields.length < 5) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.1 副标题格式错误"});
                    tipAll += 1;
                }
                else {
                    let folder_name_valid = true;
                    if(fields[0].trim() != torrent.name) {
                        folder_name_valid = false;
                    }
                    if(torrent.author != fields[1].trim()) {
                        folder_name_valid = false;
                    }
                    if(torrent.cast != fields[2].trim()) {
                        folder_name_valid = false;
                    }
                    if(fields.length == 6) {
                        if(torrent.year != fields[3].trim()) {
                            folder_name_valid = false;
                        }
                        if(torrent.audio_format != fields[4].trim()) {
                            folder_name_valid = false;
                        }
                        let code_rate = fields[5].split('-')[0];
                        if(torrent.code_rate != code_rate) {
                            folder_name_valid = false;
                        }
                    }
                    else {
                        if(torrent.audio_format != fields[3].trim()) {
                            folder_name_valid = false;
                        }
                        let code_rate = fields[4].split('-')[0];
                        if(torrent.code_rate != code_rate) {
                            folder_name_valid = false;
                        }
                    }
                    if(folder_name_valid) {
                        tipGreen += 1;
                        console.log("检查通过: 2.4 文件夹名");
                    }
                    else {
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.4 文件夹名格式错误"});
                    }
                }
                tipAll += 1;
            }
            // 2.5 必须包含第一集的MediaInfo，且为英文模式
            if(!torrent.$media_info || !torrent.$media_info.text().match(/General/g)) {
                tipRed += 1;
                tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.5 必须包含第一集的MediaInfo，且为英文模式"});
            }
            else {
                tipGreen += 1;
                console.log("检查通过: 2.5 必须包含第一集的MediaInfo，且为英文模式");
            }
            tipAll += 1;
            // 2.6 必须包含书籍封面且位于描述最前方     TODO:（合集除外，如无封面不得包含任何图片）
            if(!torrent.$description.children(':first').text().indexOf('本资源为网友收集发布于Red Leaves') != -1) {
                if(!torrent.$description.children(':eq(1)').is('img')) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.6 必须包含书籍封面且位于描述最前方"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过: 2.6 必须包含书籍封面且位于描述最前方");
                }
            }
            else if(!torrent.$description.children(':first').is('img')) {
                tipRed += 1;
                tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.6 必须包含书籍封面且位于描述最前方"});
            }
            else {
                tipGreen += 1;
                console.log("检查通过: 2.6 必须包含书籍封面且位于描述最前方");
            }
            tipAll += 1;

            // 2.7 书籍简介必须填写(仅针对合集检查） TODO
            // 2.8 如果是合集必须列出包含的书目 TODO
            // 2.9 禁止低于30kbps的资源，除非2014年之前发布
            if(valid_title) {
                if(torrent.code_rate.match(/mbps/i)) {
                    tipGreen += 1;
                    console.log("检查通过: 2.9 禁止低于30kbps的资源，除非2014年之前发布");
                }
                else if(torrent.code_rate.match(/kbps/i)) {
                    let code_rate = torrent.code_rate.match(/\d+/g)[0];
                    if(code_rate >= 30) {
                        tipGreen += 1;
                        console.log("检查通过: 2.9 禁止低于30kbps的资源，除非2014年之前发布");
                    }
                    else {
                        if(!torrent.year || torrent.year > 2014) {
                            tipRed += 1;
                            tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.9 禁止低于30kbps的资源，除非2014年之前发布"});
                        }
                        else {
                            tipGreen += 1;
                            console.log("检查通过: 2.9 禁止低于30kbps的资源，除非2014年之前发布");
                        }
                    }
                }
                else {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.9 禁止低于30kbps的资源，除非2014年之前发布"});
                }
                tipAll += 1;
            }
        }
        else {
            tipRed += 1;
            tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 0 未知的资源类型"});
            tipAll += 1;
        }

        // 统计数字点击事件
        function clickRed() {
            let redArr = document.getElementsByClassName('tipRed');
            for (let i = 0; i < redArr.length; i++) {
                if (redArr[i].style.display == 'none') {
                    redArr[i].style.display = 'block';
                } else {
                    redArr[i].style.display = 'none';
                }
            }
        }

        function clickYellow() {
            let yellowArr = document.getElementsByClassName('tipYellow');
            for (let i = 0; i < yellowArr.length; i++) {
                if (yellowArr[i].style.display == 'none') {
                    yellowArr[i].style.display = 'block';
                } else {
                    yellowArr[i].style.display = 'none';
                }
            }
        }

/*        function clickGreen() {
            let greenArr = document.getElementsByClassName('tipGreen');
            for (let i = 0; i < greenArr.length; i++) {
                if (greenArr[i].style.display == 'block') {
                    greenArr[i].style.display = 'none';
                } else {
                    greenArr[i].style.display = 'block';
                }
            }
        }*/

        // 统计数字
        if(tipRed) {
            checkerContainer.innerHTML = '<div id="checkerClick"><h1 class="tipNum">检查结果：<font color="red">错误</font></h1></div>';
            checkerContainer.style.border = 'red';
        }
        else if(tipYellow) {
            checkerContainer.innerHTML = '<div id="checkerClick"><h1 class="tipNum">检查结果：<font color="yellow">警告</font></h1></div>';
            checkerContainer.style.border = 'yellow';
        }
        else {
            checkerContainer.innerHTML = '<div id="checkerClick"><h1 class="tipNum">检查结果：<font color="green">通过</font></h1></div>';
            checkerContainer.style.border = 'green';
        }
        let checkerNum = document.createElement('div');
        checkerNum.id = 'checkerNum';
        document.getElementById('checkerClick').appendChild(checkerNum);
        var checkLog = '<h1 class="tipNum">总计: <span style="color:blue;">' + tipAll +
            '</span> &nbsp; <span id="clickRed" style="cursor:pointer;">错误: <span style="color:red;">' + tipRed +
            '</span></span> &nbsp; <span id="clickYellow" style="cursor:pointer;">警告: <span style="color:yellow;">' + tipYellow +
            '</span></span> &nbsp; <span id="clickGreen" style="cursor:pointer;">通过: <span style="color:green;">' + tipGreen + '</span></span></h1>';
        for(let i = 0; i < tipInfo.length; i++) {
            checkLog += '<h1 class="' + tipInfo[i].class + '"><font  color="' + tipInfo[i].color + '">' + tipInfo[i].info + '</font></h1>';
        }
        checkerNum.innerHTML = checkLog;
        document.getElementById('clickRed').onclick = clickRed;
        document.getElementById('clickYellow').onclick = clickYellow;
        //document.getElementById('clickGreen').onclick = clickGreen;
        // if(torrent.searchTable) {
        //     $(checkerContainer).after(torrent.searchTable);
        //     torrent.searchTable.after($('<br>'));
        // }
    }

    async function checkGo() {
        await waitInfoLoad();
        console.log(torrent);
        await check();
    }
    checkGo();

})();