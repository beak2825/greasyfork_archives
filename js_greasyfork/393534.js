// ==UserScript==
// @name         Redacted :: Import JSON to Upload Form
// @namespace    https://greasyfork.org/en/scripts/393534-redacted-import-json-to-upload-form
// @version      0.9.8
// @description  Adds buttons to attach and parse a .json file from NWCD or OPS to fill in the upload form.
// @author       newstarshipsmell
// @include      /https://redacted\.sh/upload\.php/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOTSURBVFhH7ZdbSJNhHMY/TTfCusjMtCiaMjFdXmQwL2wX4YgowguDEsGEKIjCSJC8yc4SeeguKI2oC7uolZrK1kkJs1Ir0dKmlkWGh06C0Zmn//9l73pbn+sru3TwY9vzPv/nfeb3bh9qADSDjxgil6gk7hOvCR5mxog24gSRTURNTED7E2JvAwVSCBchNzPKZcKut7HESIGThAg0m81YsyYLpaWVaGpqx8DAKMbHv+P9+2/o7x/B9et3UVJyAk5npvDKOaKKfJoewQrMJvgTICwsDNnZ2/HkySu8ffvFEH19w9iypUAt0kjMoTVNJViBWgIxMbGoqWnG6OhHQXt7HwoKDiM9fS1iYxeIciaTGfPmRSM1dSW2bSvEjRsdfr/Hcw+LFi2RJTxEOOmaZLICfMhog4Vobe3B0NAEentHkJOzQ2zIa3/C4cgUZXmWny2WOLl2ljRNolfASSA83ASXqxmDg+NoaelFQsJSGWCYqKhof4bH04GIiAi5tok0jdEr4CawdWsRvN431P4ZrNZkOfjXREbOxbVrD0VWYWGZ1G/Se40JLLCaoOs5nzZ+ju7uEWRkbJRD/8yyZXZ0dQ2js3MIixf7L0UO5f9WoJpAbu4edNwfQmVlA0JCQuTAlDh4sEpk7io4JrU6ev9LgRm8EBoaStftHh2+F0hLWyfNUyYpKVVkut3d9K0xSX2mWiCVRavVhqbmp6ipe2j4xBvlzNkmkW2zOaS2Wi2Qz6LTuRnuq17k51dI038jL2+fyM7K2i21Q2oBcf237yxHXX0PHKtypEkXE1FC9BMDvtes6XklK1asF9mFRSel1qAW6GSx5KgLFy91ISFxuTTpcoR4E8BeQs8rsViSRHZFRb3UvGoBcWu12zeQMVEaJoU/eWAB1vS8Kpydlu7/an9QC3zziYb41wKBqAWEYLEko/jAedQ3PEZb20u6zb7D2Ngn/4BE7xIUE4E+uueLec5pvfMCpRWXEB9v86+rBT6yULz/AqrPP0CjuzdoAXkI+QAGO4RqgbuUx7nl5Q1y/dNvf4FTVXcMFTCKXgHOl+vTBaYLTBeYLqAW6GPB6C+hUfQKKL+Eg2qB0yzGxSVj775q1F55NFkBB3GMaCGGic8++DVrvMYe4VcLtNweRFmZC/HWFJl1Ti1gJjp8C5Nxi71GYK8ypwf/dz1LeAMGjxPtxFdCHeBAm+oNBnt9M2oGZ3L28Z9eaD8A1I4FiHzaEHoAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393534/Redacted%20%3A%3A%20Import%20JSON%20to%20Upload%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/393534/Redacted%20%3A%3A%20Import%20JSON%20to%20Upload%20Form.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sourceWebsites = ['NWCD', 'OPS'];
    var sourceWebsiteDomains = ['notwhat.cd', 'orpheus.network'];
    var sourceWebsite, sourceWebsiteIndex;
    var JSONReleaseTypes = {
        'NWCD': {
            '1': 'Album',
            '3': 'Soundtrack',
            '5': 'EP',
            '6': 'Anthology',
            '7': 'Compilation',
            '9': 'Single',
            '11': 'Live album',
            '13': 'Remix',
            '14': 'Bootleg',
            '15': 'Interview',
            '16': 'Mixtape',
            '17': 'Sampler',
            '21': 'Unknown',
            '22': 'Demo',
            '23': 'DJ Mix',
            '24': 'Concert Recording'
        },
        'OPS': {
            '1': 'Album',
            '3': 'Soundtrack',
            '5': 'EP',
            '6': 'Anthology',
            '7': 'Compilation',
            '9': 'Single',
            '11': 'Live album',
            '13': 'Remix',
            '14': 'Bootleg',
            '15': 'Interview',
            '16': 'Mixtape',
            '17': 'DJ Mix',
            '18': 'Concert recording',
            '21': 'Unknown'
        }
    };

    var addFormat = /(\?|&)groupid=/.test(location.href) ? true : false;
    var uploadRequest = /(\?|&)requestid=/.test(location.href) ? true : false;

    var ChooseTypeDropdown = document.getElementById('categories');

    var ChooseJSONTR = document.createElement('tr');

    var ChooseJSONTD = document.createElement('td');
    ChooseJSONTD.classList.add('label');
    ChooseJSONTD.textContent = 'JSON file:';

    var ChooseJSONBtnTD = document.createElement('td');

    var ChooseJSONBtn = document.createElement('input');
    ChooseJSONBtn.id = 'json';
    ChooseJSONBtn.type = 'file';
    ChooseJSONBtn.name = 'json_input';
    ChooseJSONBtn.accept = '.application/json,.json';

    ChooseJSONTR.appendChild(ChooseJSONTD);
    ChooseJSONTR.appendChild(ChooseJSONBtnTD);
    ChooseJSONBtnTD.appendChild(ChooseJSONBtn);
    ChooseTypeDropdown.parentNode.parentNode.parentNode.insertBefore(ChooseJSONTR, ChooseTypeDropdown.parentNode.parentNode);

    ChooseJSONBtn.addEventListener('change', function (evt) {
        var file = document.getElementById('json').files[0];

        if (file) {
            sourceWebsiteIndex = /NWCD .+\.json/.test(file.name) ? 0 : (/.+(\.opsnet| \[orpheus\.network\])\.json/.test(file.name) ? 1 : -1);
            sourceWebsite = sourceWebsiteIndex > -1 && sourceWebsiteIndex < sourceWebsites.length ? sourceWebsites[sourceWebsiteIndex] : "N/A";

            if (sourceWebsite == 'N/A') {
                alert('The userscript failed to parse a supported website from the json filename! Aborting...')
                return;

            } else {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (evt) {
                    var releaseJSON = JSON.parse(evt.target.result);

                    var categories = ['Music', 'Applications', 'E-Books', 'Audiobooks', 'E-Learning Videos', 'Comedy', 'Comics'];
                    var category = document.getElementById('categories');
                    var categoryJSON = parseInt(releaseJSON.response.group.categoryId);
                    var categoryNameJSON = releaseJSON.response.group.categoryName;
                    var categoryIndex = categories.indexOf(categoryNameJSON);

                    if (categoryIndex > -1) {
                        if (categoryIndex != 0) {
                            alert('Currently only Music category torrents are supported. Aborting...');
                            return;
                        } else {
                            category.selectedIndex = categories.indexOf(categoryNameJSON);
                        }
                    } else {
                        alert('The category name indicated in the JSON (' + categoryNameJSON + ') is not one of the available category types! Aborting...');
                        return;
                    }

                    switch(categoryIndex) {
                        case 0:
                            if (!addFormat) {
                                if (!uploadRequest) {
                                    var artists = [];
                                    var artistRoles = [
                                        {'name': 'artists', 'index': 0},
                                        {'name': 'with', 'index': 1},
                                        {'name': 'composers', 'index': 2},
                                        {'name': 'conductor', 'index': 3},
                                        {'name': 'dj', 'index': 4},
                                        {'name': 'remixedBy', 'index': 5},
                                        {'name': 'producer', 'index': 6},
                                    ];
                                    var artistsJSON = releaseJSON.response.group.musicInfo;

                                    for (var i = 0, len = artistRoles.length; i < len; i++) {
                                        if (artistsJSON[artistRoles[i].name].length == 0) continue;
                                        for (var j = 0, lenj = artistsJSON[artistRoles[i].name].length; j < lenj; j++) {
                                            artists.push({'name': artistsJSON[artistRoles[i].name][j].name, 'index': artistRoles[i].index});
                                        }
                                    }

                                    if (artists.length > 0) {
                                        var artistInputs = [];
                                        artistInputs.length = artists.length;
                                        for (i = 0, len = artists.length; i < len; i++) {
                                            if (i > 0) window.eval('AddArtistField();');
                                            artistInputs[i] = document.getElementById('artist' + (i > 0 ? '_' + i : ''));
                                            artistInputs[i].value = artists[i].name;
                                            var roles = document.querySelectorAll('td#artistfields > #importance');
                                            roles[i].selectedIndex = artists[i].index;
                                        }
                                    } else {
                                        alert('No artists are included in the JSON!');
                                    }
                                }

                                var albumTitle = document.getElementById('title');
                                var albumTitleJSON = releaseJSON.response.group.name;

                                if (albumTitleJSON != '') {
                                    albumTitle.value = albumTitleJSON;
                                } else {
                                    alert('No album title is included in the JSON!');
                                }

                                var initialYear = document.getElementById('year');
                                var initialYearJSON = releaseJSON.response.group.year;

                                if (initialYearJSON != '') {
                                    initialYear.value = initialYearJSON;
                                } else {
                                    alert('No initial year is included in the JSON!');
                                }

                                var releaseType = document.getElementById('releasetype');
                                var releaseTypes = [];
                                for (i = 0, len = releaseType.options.length; i < len; i++) {
                                    releaseTypes.push(releaseType.options[i].textContent.toLowerCase());
                                }

                                var releaseTypeIndexJSON = parseInt(releaseJSON.response.group.releaseType);
                                var releaseTypeNameJSON = JSONReleaseTypes[sourceWebsite][releaseTypeIndexJSON];
                                var releaseTypeIndex = releaseTypes.indexOf(releaseTypeNameJSON.toLowerCase());

                                if (releaseTypeIndex > -1) {
                                    releaseType.selectedIndex = releaseTypeIndex;
                                } else {
                                    alert('The release type indicated in the JSON (' + releaseTypeNameJSON + ' [' + releaseTypeIndexJSON + ']) ' +
                                          'is not one of the available release types!\n\nManually select the appropriate release type.');
                                }
                            }

                            var editionYear = document.getElementById('remaster_year');
                            var editionTitle = document.getElementById('remaster_title');
                            var editionLabel = document.getElementById('remaster_record_label');
                            var editionCatNo = document.getElementById('remaster_catalogue_number');
                            var edition = releaseJSON.response.torrent.remastered;

                            if (edition) {
                                var editionYearJSON = releaseJSON.response.torrent.remasterYear;
                                var editionTitleJSON = releaseJSON.response.torrent.remasterTitle;
                                var editionLabelJSON = releaseJSON.response.torrent.remasterRecordLabel;
                                var editionCatNoJSON = releaseJSON.response.torrent.remasterCatalogueNumber;
                            } else {
                                editionYearJSON = initialYearJSON ? initialYearJSON : releaseJSON.response.group.year;
                                editionTitleJSON = '';
                                editionLabelJSON = releaseJSON.response.group.recordLabel;
                                editionCatNoJSON = releaseJSON.response.group.catalogueNumber;
                            }

                            if (editionYearJSON == '') {
                                alert('No edition year is included in the JSON!');
                            }

                            editionYear.value = editionYearJSON;
                            editionTitle.value = editionTitleJSON;
                            editionLabel.value = editionLabelJSON;
                            editionCatNo.value = editionCatNoJSON;

                            var scene = document.getElementById('scene');
                            var sceneJSON = releaseJSON.response.torrent.scene;
                            if (sceneJSON) scene.checked = true;

                            var format = document.getElementById('format');
                            var formats = [];
                            for (i = 0, len = format.options.length; i < len; i++) {
                                formats.push(format.options[i].textContent.toLowerCase());
                            }

                            var formatJSON = releaseJSON.response.torrent.format;
                            var formatIndex = formats.indexOf(formatJSON.toLowerCase());

                            if (formatIndex > -1) {
                                format.selectedIndex = formatIndex;
                            } else {
                                alert('The format indicated in the JSON (' + formatJSON + ') ' +
                                      'is not one of the available formats!\n\nManually select the appropriate formats.');
                            }

                            var bitrate = document.getElementById('bitrate');
                            var bitrates = [];
                            for (i = 0, len = bitrate.options.length; i < len; i++) {
                                bitrates.push(bitrate.options[i].textContent.toLowerCase());
                            }
                            var otherBitrate = document.getElementById('other_bitrate');
                            var otherBitrateVBR = document.getElementById('vbr');

                            var bitrateJSON = releaseJSON.response.torrent.encoding;
                            var bitrateIndex = bitrates.indexOf(bitrateJSON.toLowerCase());

                            if (bitrateIndex > -1) {
                                bitrate.selectedIndex = bitrateIndex;
                            } else {
                                bitrate.selectedIndex = bitrates.indexOf('other');
                                document.getElementById('other_bitrate_span').classList.remove('hidden');
                                otherBitrate.value = bitrateJSON.replace(/ \(VBR\)$/i, '');
                                otherBitrateVBR.checked = /.+ \(VBR\)$/i.test(bitrateJSON);
                            }

                            var media = document.getElementById('media');
                            var medias = [];
                            for (i = 0, len = media.options.length; i < len; i++) {
                                medias.push(media.options[i].textContent.toLowerCase());
                            }

                            var mediaJSON = releaseJSON.response.torrent.media;
                            var mediaIndex = medias.indexOf(mediaJSON.toLowerCase());

                            if (mediaIndex > -1) {
                                media.selectedIndex = mediaIndex;
                            } else {
                                alert('The media indicated in the JSON (' + mediaJSON + ') ' +
                                      'is not one of the available media!\n\nManually select the appropriate media.');
                            }

                            if (formats[formatIndex] == 'flac' && bitrates[bitrateIndex] == 'lossless' && medias[mediaIndex] == 'cd') {
                                var hasLogJSON = releaseJSON.response.torrent.hasLog;
                                var logs = document.getElementById('upload_logs');
                                if (hasLogJSON) logs.classList.remove('hidden');
                            }


                            if (!addFormat) {
                                var tags = document.getElementById('tags');
                                var tagsJSON = releaseJSON.response.group.tags;
                                var tagList = '';

                                if (tagsJSON.length > 0) {
                                    for (i = 0, len = tagsJSON.length; i < len; i++) {
                                        tagList += (i > 0 ? ', ' : '') + tagsJSON[i];
                                    }
                                }

                                tags.value = tagList;

                                var image = document.getElementById('image');
                                var imageJSON = releaseJSON.response.group.wikiImage;
                                image.value = imageJSON;

                                var albumDesc = document.getElementById('album_desc');
                                var albumDescJSON = releaseJSON.response.group.wikiBBcode ? releaseJSON.response.group.wikiBBcode : releaseJSON.response.group.wikiBody;

                                if (albumDescJSON != '') {
                                    if (!releaseJSON.response.group.wikiBBcode) {
                                        albumDescJSON = albumDescJSON.replace(/<br \/>/g, '');
                                        albumDescJSON = albumDescJSON.replace(/&amp;/g, '&');
                                        albumDescJSON = albumDescJSON.replace(/&lt;/g, '<');
                                        albumDescJSON = albumDescJSON.replace(/&gt;/g, '>');
                                        albumDescJSON = albumDescJSON.replace(/&quot;/g, '"');
                                        albumDescJSON = albumDescJSON.replace(/&apos;/g, '\'');
                                        albumDescJSON = albumDescJSON.replace(/&#39;/g, '\'');
                                        albumDescJSON = albumDescJSON.replace(/<a href="artist\.php\?artistname=.+?">(.+?)<\/a>/g, '[artist]$1[/artist]');
                                        albumDescJSON = albumDescJSON.replace(/<a href="user\.php\?action=search&amp;search=.+?">(.+?)<\/a>/g, '[user]$1[/user]');
                                        albumDescJSON = albumDescJSON.replace(/<a .+?>(https?:\/\/.+?)<\/a>/g, '$1');
                                        albumDescJSON = albumDescJSON.replace(/<a .*?href="(https?:\/\/.+?)".*?>(.+?)<\/a>/g, '[url=$1]$2[/url]');
                                        albumDescJSON = albumDescJSON.replace(/<span class="size(\d+)">(.+?)<\/span>/g, '[size=$1]$2[/size]');
                                        albumDescJSON = albumDescJSON.replace(/<span style="font-style: italic;">(.+?)<\/span>/g, '[i]$1[/i]');
                                        albumDescJSON = albumDescJSON.replace(/<span style="text-decoration: underline;">(.+?)<\/span>/g, '[u]$1[/u]');
                                        albumDescJSON = albumDescJSON.replace(/<span style="text-decoration: line-through;">(.+?)<\/span>/g, '[s]$1[/s]');
                                        albumDescJSON = albumDescJSON.replace(/<span style="color: (.+?);">(.+?)<\/span>/g, '[color=$1]$2[/color]');
                                        albumDescJSON = albumDescJSON.replace(/<div style="text-align: (.+?);">(.+?)<\/div>/g, '[align=$1]$2[/align]');
                                        albumDescJSON = albumDescJSON.replace(
                                            /<img class="scale_image" onclick="lightbox.init\(this, \$\(this\)\.width\(\)\);" alt="(.+?)" src=".+?">/g,
                                            '[img]$1[/img]');
                                        albumDescJSON = albumDescJSON.replace(
                                            /<a href="#" onclick="QuoteJump\(event, '(\d+)'\); return false;"><strong class="quoteheader">(.+?)<\/strong> wrote: <\/a><blockquote>(.+?)<\/blockquote>/g,
                                            '[quote=$2|$1]$3[/quote]');
                                        albumDescJSON = albumDescJSON.replace(/<strong class="quoteheader">(.+?)<\/strong> wrote: <blockquote>(.+?)<\/blockquote>/g,
                                                                              '[quote=$1]$2[/quote]');
                                        albumDescJSON = albumDescJSON.replace(/<blockquote>(.+?)<\/blockquote>/g, '[quote]$1[/quote]');
                                        albumDescJSON = albumDescJSON.replace(/<strong>(.+?)<\/strong>: <a href="javascript:void\(0\);" onclick="BBCode\.spoiler\(this\);">Show<\/a><blockquote class="hidden spoiler">(.+?)<\/blockquote>/g,
                                                                              '[hide=$1]$2[/hide]');
                                        albumDescJSON = albumDescJSON.replace(/<strong>Hidden text<\/strong>: <a href="javascript:void\(0\);" onclick="BBCode\.spoiler\(this\);">Show<\/a><blockquote class="hidden spoiler">(.+?)<\/blockquote>/g,
                                                                              '[hide]$1[/hide]');
                                        albumDescJSON = albumDescJSON.replace(/<strong class="important_text">(.+?)<\/strong>/g, '[important]$1[/important]');
                                        albumDescJSON = albumDescJSON.replace(/<(pre|code)>(.+?)<\/\1>/g, '[$1]$2[/$1]');
                                        albumDescJSON = albumDescJSON.replace(/<(\/)?strong>/g, '[$1b]');
                                    }

                                    albumDesc.value = albumDescJSON;
                                    document.querySelector('input.button_preview_0').click();
                                } else {
                                    alert('No album description is included in the JSON!');
                                }
                            }

                            var relDesc = document.getElementById('release_desc');
                            var relDescJSON = releaseJSON.response.torrent.description;
                            var groupIDJSON = releaseJSON.response.group.id;
                            var torrentIDJSON = releaseJSON.response.torrent.id;
                            relDescJSON += (relDescJSON ? '\n\n' : '') + 'Cross-posted from ' + sourceWebsite + ': https://';
                            relDescJSON += sourceWebsiteDomains[sourceWebsiteIndex] + '/torrents.php?id=' + groupIDJSON + '&torrentid=' + torrentIDJSON;
                            sourceWebsiteDomains = ['notwhat.cd', 'orpheus.network'];
                            relDesc.value = relDescJSON;
                            document.querySelector('input.button_preview_1').click();

                            break;

                        case 1:
                            break;

                        case 2:
                            break;

                        case 3:
                            break;

                        case 4:
                            break;

                        case 5:
                            break;

                        case 6:
                            break;

                        default:
                    }

                }
                reader.onerror = function (evt) {
                    alert('There was an error reading the file.');
                }
            }

        } else {
            alert('No JSON file has been chosen!');
        }
    });
})();