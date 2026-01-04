// ==UserScript==
// @name         8muses Downloader
// @description  Download from 8muses.com
// @namespace    redturtle
// @author       redturtle
// @icon         https://comics.8muses.com/favicon.ico
// @version      1.3
// @match        https://comics.8muses.com/comics/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @noframes
// @connect      self
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/388824/8muses%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/388824/8muses%20Downloader.meta.js
// ==/UserScript==

$(document).ready(function () {
    var l2 = 0;
    $('.c-tile.t-hover').each(function () {
        if ($(this).children().length == 2) {
            l2 += 1;
        }
    });
    if (l2 != 0) {
        var downBtn = $('<button/>', {
            text: 'DOWNLOAD',
        });
        var downBtnParent = $('<div></div>').append(downBtn);
        $(downBtnParent).css('margin', '20px');
        $('.a-image').before(downBtnParent);
        var downloading = false;
        var downloaded = false;
        var images = [];
        var zip = new JSZip();
        var title = '';
        $($('ol')[0]).children().each(function (i, li) {
            if (i != 0) {
                title += li.children[0].text + ' - ';
            }
        });
        title = title.substr(0, title.length - 3);
        $(downBtn).css('background-color', '#2a518e');
        $(downBtn).css('color', '#ffffff');
        $(downBtn).css('font-weight', 'bold');
        $(downBtn).css('font-size', '12pt');
        $(downBtn).css('border', 0);
        $(downBtn).css('width', '100%');
        $(downBtn).css('height', '40px');
        $(downBtn).click(function (event) {
            if (!downloading && !downloaded) {
                $(this).html('DOWNLOADING');
                $(downBtn).css('background-color', '#dbba00');
                downloading = true;
                var idx = 0;
                $('.c-tile.t-hover').each(function () {
                    if ($(this).children().length == 2) {
                        var imageSrc = $($($(this).children()[0]).children()[0]).attr('data-src').replace('th', 'fl');
                        images[idx] = 'https://comics.8muses.com' + imageSrc;
                        idx += 1;
                    }
                });
                var downCount = 0;
                var pad = '0000';
                var incomplete = false;
                $(images).each(function (i, url) {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'arraybuffer',
                        onload: function (response) {
                            var fileName = pad.substr(0, pad.length - (i + 1).toString().length) + (i + 1) + url.substr(url.length - 4);
                            zip.file(fileName, response.response);
                            downCount += 1;
                            if (downCount == images.length) {
                                $(downBtn).html(downCount + '/' + images.length + ' DONE');
                                zip.generateAsync({
                                    type: 'blob'
                                }).then(function (blob) {
                                    saveAs(blob, title + '.zip');
                                });
                                $(downBtn).html(incomplete ? 'INCOMPLETE' : 'DOWNLOADED');
                                $(downBtn).css('background-color', incomplete ? '#a30101' : '#216d28');
                                downloaded = true;
                            }
                            else {
                                $(downBtn).html(downCount + '/' + images.length + ' DONE');
                            }
                        },
                        onerror: function (response) {
                            $(downBtn).css('background-color', '#a30101');
                            incomplete = true;
                            console.log('error: image ' + (i + 1));
                            downCount += 1;
                            if (downCount + 1 == images.length) {
                                $(downBtn).html(downCount + '/' + images.length + ' DONE');
                                zip.generateAsync({
                                    type: 'blob'
                                }).then(function (blob) {
                                    saveAs(blob, title + '.zip');
                                });
                                $(downBtn).html(incomplete ? 'INCOMPLETE' : 'DOWNLOADED');
                                $(downBtn).css('background-color', incomplete ? '#a30101' : '#216d28');
                                downloaded = true;
                            }
                            else {
                                $(downBtn).html(downCount + '/' + images.length + ' DONE');
                            }
                        },
                        onabort: function (response) {
                            $(downBtn).css('background-color', '#a30101');
                            incomplete = true;
                            console.log('abort: image ' + (i + 1));
                            downCount += 1;
                            if (downCount + 1 == images.length) {
                                $(downBtn).html(downCount + '/' + images.length + ' DONE');
                                zip.generateAsync({
                                    type: 'blob'
                                }).then(function (blob) {
                                    saveAs(blob, title + '.zip');
                                });
                                $(downBtn).html(incomplete ? 'INCOMPLETE' : 'DOWNLOADED');
                                $(downBtn).css('background-color', incomplete ? '#a30101' : '#216d28');
                                downloaded = true;
                            }
                            else {
                                $(downBtn).html(downCount + '/' + images.length + ' DONE');
                            }
                        },
                        ontimeout: function (response) {
                            $(downBtn).css('background-color', '#a30101');
                            incomplete = true;
                            console.log('timeout: image ' + (i + 1));
                            downCount += 1;
                            if (downCount + 1 == images.length) {
                                $(downBtn).html(downCount + '/' + images.length + ' DONE');
                                zip.generateAsync({
                                    type: 'blob'
                                }).then(function (blob) {
                                    saveAs(blob, title + '.zip');
                                });
                                $(downBtn).html(incomplete ? 'INCOMPLETE' : 'DOWNLOADED');
                                $(downBtn).css('background-color', incomplete ? '#a30101' : '#216d28');
                                downloaded = true;
                            }
                            else {
                                $(downBtn).html(downCount + '/' + images.length + ' DONE');
                            }
                        }
                    });
                });
            }
            else if (downloaded) {
                zip.generateAsync({
                    type: 'blob'
                }).then(function (blob) {
                    saveAs(blob, title + '.zip');
                });
            }
        });
    }
});