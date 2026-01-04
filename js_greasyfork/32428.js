// ==UserScript==
// @name           Realdebrid Skript
// @namespace      g0t00
// @version        2017.8.18.4
// @author         g0t00
// @description    Modified by g0t00
// @include        http*
// @grant          GM_registerMenuCommand
// @grant          GM_openInTab
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_deleteValue
// @grant          GM_getResourceText
// @require        https://code.jquery.com/jquery-3.1.1.js
// @require        https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @resource       ui-css https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css
// @resource       css-file https://greasyfork.org/scripts/32429-realdebrid-skript-css/code/Realdebrid%20Skript%20CSS.user.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/32428/Realdebrid%20Skript.user.js
// @updateURL https://update.greasyfork.org/scripts/32428/Realdebrid%20Skript.meta.js
// ==/UserScript==
(($) => {
    'use strict';

    var re = RegExp('\\b(' + [
        '1fichier\\.com/',
        '2shared\\.com\\/file',
        'asfile\\.com/file',
        'bayfiles\\.net/file',
        'bitshare\\.com/(file|\\?f)',
        'crocko\\.com/[a-z0-9]+',
        'depfile\\.com/[a-z0-9]+',
        'dizzcloud\\.com/dl',
        'extmatrix\\.com/files',
        'filecloud\\.io\\/',
        'filefactory\\.com/file',
        'fileparadox.\\in/[a-z0-9]+/',
        'filepost\\.com/file',
        'filerio\\.in/[a-z0-9]+',
        'filesmonster\\.(biz|com)/download',
        'firedrive\\.com/file',
        'fp\\.io/[a-z0-9]+',
        'freakshare\\.com/file',
        'gigapeta\\.com/dl/',
        'hipfile.com/.+/.+html',
        'hitfile.net/.+/.+html',
        'jumbofiles\\.com/[a-z0-9]+',
        '(keep2s(hare)?|k2s)\\.cc/file/',
        'letitbit\\.net/download',
        'linksafe\\.me/d',
        'mediafire\\.com/?',
        'mediafire\\.com/download',
        'megashares\\.com/\\??d',
        'netload\\.in/datei',
        'oboom\\.com/.+\\.',
        '(rapidgator\\.net|rg\\.to)/file',
        'secureupload\\.eu',
        'sendspace\\.com/file',
        'share-online\\.biz/dl/',
        'shareflare.net/download/',
        'sockshare\\.com/file',
        'terafile.co/[^\\.]+(/|$)',
        'turbobit\\.net/.+html',
        'ul\\.to/',
        'unibytes\\.com/[a-z0-9]+',
        'uploadble\\.ch/file',
        'uploaded\\.(to|net)/file',
        'uploading\\.com/',
        'uptobox\\.com/[a-z0-9]+',
        'vip-file\\.com/download',
        'oboom\\.com/',
        'zippyshare\\.com/',
        'youtube\\.com/watch'
    ].join('|') + ')', 'i');
    $(() => {
        $('body').append('<style>' + GM_getResourceText('ui-css') + '</style>');
        $('body').append(`<style>' + GM_getResourceText('css-file')+ '</style>`);
    });
    function getKey() {
        var key = GM_getValue('apitoken');
        if (key) {
            return key;
        }
        key = prompt('Bitte API-Key eingeben, (von https://real-debrid.com/apitoken)');
        if (key) {
            return key;
        }
        alert('Keinen Key eingegeben. Bitte nochmals probieren!');
        return false;
    }
    function main() {
        if(re.test(location.href)) {
            window.setTimeout(insertBar, 1000);
        }
        if(location.href.indexOf('thepiratebay.org') > -1 || location.href.indexOf('eztv') > -1 || location.href.indexOf('showrss') > -1 ) {
            $('a').each(function() {
                var a = $(this);
                var href = $(this).attr('href');
                if (typeof href === 'string' && href.indexOf('magnet:') > -1) {
                    var button = $('<a class="magnet-button" style="font-size: 2em; cursor: pointer;">+</a>');
                    button.insertAfter(a);
                    button.click(event => {
                        event.preventDefault();
                        var key = GM_getValue('apitoken');
                        if (key) {
                            addMagnet(a.attr('href'), key);
                        } else {
                            key = prompt('Bitte API-Key eingeben, (von https://real-debrid.com/apitoken)');
                            if (key) {
                                addMagnet(a.attr('href'), key);
                            } else {
                                alert('Keinen Key eingegeben. Bitte nochmals probieren!');
                            }
                        }
                    });
                }
            });
            var key = getKey();
            if (key !== false) {
                var downloadListDialog = $('<div id="download-overview-dialog">').attr('title', 'Realdebrid Overview').appendTo('body').dialog({
                    position: {my: 'right top', at: 'right top', of: window},
                    width: 200
                });
                var updateList = () => {
                    getAjax('torrents', 'limit=10&filter=active', key, 'GET')
                        .then(resultObjects => {
                        downloadListDialog.html('');
                        var list = $('<ul class="download-overview">').appendTo(downloadListDialog);
                        resultObjects.forEach(resultObject => {
                            var li = $('<li>').appendTo(list);
                            var name = $('<div class="download-name">').appendTo(li).html(resultObject.filename).attr('title', resultObject.filename);
                            var status = $('<div class="download-status">').appendTo(li).html(resultObject.status);
                            if (resultObject.status === 'downloading') {
                                var progressBar = $('<div>').append('<div class="progress-label">' + resultObject.progress + '%</div>').appendTo(li).progressbar({value: resultObject.progress});
                            }
                            li.click(event => {
                                event.preventDefault();
                                var dialog;
                                getAjax('torrents/info/' + resultObject.id, '', key, 'GET')
                                    .then(resultObject => {
                                    dialog = $('<div>');
                                    dialog.appendTo('body').dialog({width: 800});
                                    return renderDialog(resultObject, dialog, key);
                                }).then(resultObject => {
                                    console.log('resultObject', resultObject);
                                    if (resultObject === false) {
                                        dialog.dialog('close');
                                    }
                                });
                            });
                        });
                        downloadListDialog.append('<p>Last update: ' + new Date().toLocaleString() + '</p>');

                    });
                };
                updateList();
                window.setInterval(updateList, 5000);
            }
        }
    }
    var style, inserted;
    function updateStyle() {
        if(!style) {
            style = document.createElement('style');
            style.id = 'adh-style';
            style.type = 'text/css';
            document.head.appendChild(style);
            inserted = true;
        }
        style.textContent = '#real-bar {position: fixed;' +
            'width: 100px;' +
            'height: 30px;' +
            'top: 1%;' +
            'left: 50%;' +
            'margin-left: -50px;' *
            'background: white;' +
            'border: 2px solid #9a9a9a;' +
            'border-radius: 6px;' +
            'box-shadow: 0 0 10px #9a9a9a;' +
            'z-index: 2000000006;}' +
            '#real-bar button {width: 100%; height: 30px; line-height: 30px; cursor: pointer}' +
            '#real-bar:hover { background-color: #c1c1ff;} .magnet-button {font-size: 3em;}';
    }
    function insertBar() {
        var bar = document.createElement('div');
        bar.id = 'real-bar';
        document.body.appendChild(bar);
        var button = document.createElement('button');
        button.textContent = 'Download';
        bar.appendChild(button);
        button.addEventListener('click', event => {
            event.preventDefault();
            var key = GM_getValue('apitoken');
            if (key) {
                downloadLink(window.location.href, key);
            } else {
                key = prompt('Bitte API-Key eingeben, (von https://real-debrid.com/apitoken)');
                if (key) {
                    downloadLink(window.location.href, key);
                } else {
                    alert('Keinen Key eingegeben. Bitte nochmals probieren!');
                }
            }
        });
        updateStyle();
    }
    function getAjax(uri, data, key, verb) {
        return new Promise((resolve, reject) => {
            var config = {
                method: verb,
                url: 'https://api.real-debrid.com/rest/1.0/' + uri + '?auth_token=' + key,
                onload:	 function(r) {
                    resolve(r);
                }, onerror: function(err) {
                    reject(err);
                }
            };
            if (verb === 'GET') {
                config.url += '&' + data;
            } else {
                config.data = data;
            }
            GM_xmlhttpRequest(config);
            console.log(config);
        }).then(result => {
            if (result.status >= 400 && result.status < 500) {
                throw new Error(result.responseText);
            }
            if (result.status == 204) {
                console.log(204);
                return;
            }
            var resultObject = JSON.parse(result.responseText);
            /* if (result.responseHeaders['x-total-count']) {
                resultObject.totalCount = result.responseHeaders['x-total-count'];
            };*/
            console.log(resultObject);
            if(resultObject.error) {
                if (resultObject.error == 'bad_token') {
                    alert('ungültiges Token. Bitte nochmal probieren.');
                    GM_deleteValue('apitoken');
                } else {
                    alert('unbekannter Fehler: ' + resultObject.error);
                }
                throw new Error(resultObject.error);
            } else {
                GM_setValue('apitoken', key);
                return resultObject;
            }
        });
    }
    function removeTorrent(id, key) {
        return getAjax('torrents/delete/' + id, '', key, 'DELETE');
    }
    function renderDialog(resultObject, dialog, key) {
        dialog.append('<h2>' + resultObject.original_filename + '</h2>');
        dialog.append('<h3>Status: ' + resultObject.status + '</h2>');
        var fileList = $('<ul>');
        resultObject.files.forEach(file => {
            var li = $('<li>' + file.path + '</li>');
            var input = $('<input type="checkbox">');
            input.attr('data-id', file.id);
            input.prop('checked', file.selected === 1);
            input.prop('disabled', resultObject.status !== 'waiting_files_selection');
            li.append(input);
            fileList.append(li);
        });
        dialog.append(fileList);
        if (resultObject.status === 'waiting_files_selection') {
            var submit = $('<button>load selected</button>');
            dialog.append(submit);
            var submitAll = $('<button>load all</button>');
            dialog.append(submitAll);
        }
        var links = $('<ul>').appendTo(dialog);
        resultObject.links.forEach(link => {
            var a = $('<a style="cursor: pointer">' + link + '</a>');
            a.click(event => {
                event.preventDefault();
                downloadLink(link, key);
            });
            links.append(a);
        });
        if (resultObject.status === 'downloading') {
            var progressbar = $('<div>').appendTo(dialog).append('<div class="progress-label">' + resultObject.progress + '%</div>');
            progressbar.progressbar({
                value: resultObject.progress
            });
            progressbar.append('<div style="position: absolute; left: 50%;">' + resultObject.progress + '%</div>');
        }
        dialog.append('<p>Last update: ' + new Date().toLocaleString() + '</p>');
        //dialog.append(JSON.stringify(resultObject));
        var remove = $('<button>Remove Torrent</button>').appendTo(dialog);
        if (resultObject.status !== 'waiting_files_selection' && (resultObject.status !== 'downloaded' || resultObject.links.length === 0)) {
            return new Promise(resolve => {
                var timeout = window.setTimeout(() => {
                    resolve();
                }, 1000);
                remove.click(event => {
                    event.preventDefault();
                    resolve(removeTorrent(resultObject.id, key)
                            .then(() => {
                        return false;
                    }));
                });
            }).then(() => {
                return getAjax('torrents/info/' + resultObject.id, '', key, 'GET');
            }).then(resultObjectNew => {
                dialog.html('');
                return renderDialog(resultObjectNew, dialog, key);
            });

        }

        return new Promise((resolve, reject) => {
            if (resultObject.status === 'waiting_files_selection') {
                submit.click(event => {
                    event.preventDefault();
                    var files = '';
                    dialog.find('li').each(function () {
                        var input = $(this).find('input');
                        if (input.prop('checked')) {
                            files += input.data('id') + ',';
                        }
                    });
                    files = files.substring(0, files.length - 1);
                    console.log(files, 'files');
                    resolve({id: resultObject.id, files: files});
                });
                submitAll.click(event => {
                    event.preventDefault();
                    var files = 'all';

                    resolve({id: resultObject.id, files: files});
                });

            }
            remove.click(event => {
                event.preventDefault();
                resolve(removeTorrent(resultObject.id, key)
                        .then(() => {
                    return false;
                }));
            });
        });
    }
    function addMagnet(magnet, key) {
        var dialog, id;
        //Promise.resolve()
        //getAjax('torrents/availableHosts', '', key, 'GET')
        //    .then(resultObject => {
        //    console.log(resultObject);
        getAjax('torrents/addMagnet', 'magnet=' + encodeURIComponent(magnet), key, 'POST')
            .then(resultObject => {
            id = resultObject.id;
            return getAjax('torrents/info/' + resultObject.id, '', key, 'GET');
        }).then(resultObject => {
            dialog = $('<div>');
            dialog.appendTo('body').dialog({width: 800});
            return renderDialog(resultObject, dialog, key);
        }).then(obj => {
            if (obj === false) {
                return false;
            }
            return getAjax('torrents/selectFiles/' + id, 'files=' + encodeURIComponent(obj.files), key, 'POST');
        }).then(obj => {
            if (obj === false) {
                return false;
            }
            return getAjax('torrents/info/' + id, '', key, 'GET');
        }).then(resultObject => {
            if (resultObject === false) {
                dialog.dialog('close');
            }
            dialog.html('');
            return renderDialog(resultObject, dialog, key);
        }).catch(err => {
            debugger;
            console.error(err);
        });
    }
    function downloadLink(link, key) {
        new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.real-debrid.com/rest/1.0/unrestrict/link?auth_token=' + key,
                data: 'link=' + encodeURIComponent(link),
                onload:	 function(r) {
                    resolve(r);
                }, onerror: function(err) {
                    reject(err);
                }
            });
        }).then(result => {
            var resultObject = JSON.parse(result.responseText);
            console.log(resultObject);
            if(resultObject.error) {
                if (resultObject.error == 'bad_token') {
                    alert('ungültiges Token. Bitte nochmal probieren.');
                    GM_deleteValue('apitoken');
                } else {
                    alert('unbekannter Fehler: ' + resultObject.error);
                }
            } else {
                GM_setValue('apitoken', key);
                GM_openInTab(resultObject.download, true);
            }
        }).catch(err => {
            debugger;
            console.error(err);
        });
    }
    window.setTimeout(main, 100);
    if(location.href.indexOf('showrss') > -1 ) {
        var key = GM_getValue('apitoken');
        var alreadyDownloaded = JSON.parse(GM_getValue('alreadyDownloaded', '[]'));
        let updateFeed = () => {
            $.get('https://showrss.info/timeline', function (data) {
                $(data).find(".user-timeline a").each(function (i) { // or "item" or whatever suits your feed
                    var el = $(this);
                    if (typeof el.attr('href') !== 'string' || el.attr('href').indexOf('magnet') == -1) {
                        return;
                   
                    }
                    var xt = /xt=([^&]+)&/.exec(el.attr('href'))[1];
                    console.log('xt', xt, el.text());
                    if (alreadyDownloaded.indexOf(xt) === -1) {
                        alreadyDownloaded.push(xt);
                        GM_setValue('alreadyDownloaded', JSON.stringify(alreadyDownloaded));
                        console.log(el.find('description').text());
                        var id;
                        getAjax('torrents/addMagnet', 'magnet=' + encodeURIComponent(el.attr('href')), key, 'POST')
                            .then(resultObject => {
                            id = resultObject.id;
                            return getAjax('torrents/info/' + resultObject.id, '', key, 'GET');
                        }).then(resultObject => {
                            var files = [];
                            resultObject.files.forEach(file => {
                                if (/\.(txt|nfo|)$/i.exec(file.path) == null) {
                                    files.push(file.id);
                                }
                            });
                            return getAjax('torrents/selectFiles/' + id, 'files=' + encodeURIComponent(files.join()), key, 'POST');
                        });
                        var interval = window.setInterval(() => {
                            getAjax('torrents/info/' + id, '', key, 'GET')
                                .then(resultObject => {
                                if (resultObject.status == 'downloaded') {
                                    resultObject.links.forEach(link => {
                                        downloadLink(link, key);
                                    });
                                    window.clearInterval(interval);
                                }
                            });
                        }, 1000);
                    }

                });
            });
        };
        updateFeed();
        window.setInterval(updateFeed, 10*1000);;

    }

})(jQuery);