// ==UserScript==
// @name         danbooru.donmai.us - download this shit all!
// @namespace    https://danbooru.donmai.us/*
// @version      0.4.1
// @description  download images on page
// @author       SatanCry
// @match        https://danbooru.donmai.us/*

// @run-at document-body


// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js

// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_download
// @grant       GM_info
// @grant       GM_notification

// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @grant       GM.download
// @grant       GM.info
// @grant       GM.notification

// @connect https://danbooru.donmai.us/*
// @connect https://raikou1.donmai.us/*
// @downloadURL https://update.greasyfork.org/scripts/372637/danboorudonmaius%20-%20download%20this%20shit%20all%21.user.js
// @updateURL https://update.greasyfork.org/scripts/372637/danboorudonmaius%20-%20download%20this%20shit%20all%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var toLoad = 0;
    var loaded = 0;
    var retriveSimaphore = 2;
    var activeDownloads = {};
    var downloadQueue = {};
    var downloaded = {};

    var localErrorsCount = 0;
    const maxDonwloads = 8;
    const queueTimer = 250;

    function sleep(ms) {
        return new Promise(setTimeout(resolve, ms));
    }

    function objectSize(obj) {
        var counter = 0;
        for (var key in obj) {
            counter++;
        }

        return counter;
    }

    function activeDownloadsCount() {
        return objectSize(activeDownloads);
    }

    function _updateStatus(text) {
        $('span#downloadlStatusInformation').html(text);
    };

    function updateStatus() {
        var allDownloadadedText = '';
        if(toLoad == loaded)
            allDownloadadedText = '<span id=alldownloadedsucessfully style=color:green;>All downloaded successfully</span>';
        _updateStatus('loaded ' + loaded + '/' + toLoad + ' (' + ((loaded/toLoad)*100).toFixed(2) + '%) ' + allDownloadadedText);

        errorsCountUpdate();
    };

    async function pushArray(name, state) {
        var val = await GM.getValue(name, null);
        if(val !== null) {
            if(val.indexOf(state) == -1) {
                val.push(state);
                GM.setValue(name, val);
            }
        }
        else {
            GM.setValue(name, [state]);
        }
    };

    async function deleteFromArray(name, state) {
        var val = await GM.getValue(name, null);
        if(val !== null) {
            var id = val.indexOf(state);
            if(id > -1) {
                val.splice(id, 1);
                GM.setValue(name, val);
            }
        }
    };

    async function errorsCount(cb) {
        var val = await GM.getValue('errors', null);
        if(val === null) {
            cb(0);
        }
        else {
            cb(val.length);
        }
    };

    async function getErrors(cb) {
        var val = await GM.getValue('errors', null);
        if(val === null) {
            cb([]);
        }
        else {
            cb(val);
        }
    };

    function errorsCountUpdate() {
        errorsCount(function(count){
            if(count > 0)
                $('span#downloadfails').html('Fails ' + count);
            else
                $('span#downloadfails').html(' ');
        });
    };

    function getFromUrl(url, context, callback, errorcb) {
        GM.xmlHttpRequest({
            url: url,
            method: 'GET',
            context: context,
            onload: callback,
            onerror: errorcb,
        });
    };

    function findResourceOnPostUrl(url, readycb) {
        //toLoad++;
        updateStatus();
        function cb(xhr) {
            if(xhr.status != 200) {
                pushArray('errors', xhr.finalUrl );
                console.error('loading resource from ', xhr.finalUrl , ' failed');
                //GM.notification({text: 'loading resource from ' + xhr.finalUrl  + ' failed', title: 'error',}, function(){});
            }
            else {
                console.info('loading resource from ', xhr.finalUrl , ' OK');
                readycb(xhr);
            }
        };

        console.log('finding resource on ', url);
        getFromUrl(url, {}, cb);
    };


    function downloadPost(rel) {
        findResourceOnPostUrl(rel, /*async*/ function(xhr){
            var loadedDocument = $.parseHTML(xhr.responseText);
            window.debugloaded = loadedDocument;

            var h = "";
            if($("div#a-show a#image-resize-link", loadedDocument).attr("href"))
                h = $("div#a-show a#image-resize-link", loadedDocument).attr("href")
            else if ($("section#image-container img", loadedDocument).attr("src"))
                h = $("section#image-container img", loadedDocument).attr("src")
            else if ($('video').attr('src'))
                h = $('video').attr('src')
            else if ($('section#content p a:contains("Save this")', loadedDocument).attr('href'))
                h = $('section#content p a:contains("Save this")', loadedDocument).attr('href');

            if(h.length == 0) {
                pushArray('errors', xhr.finalUrl);
                console.error('loading resource from ', xhr.finalUrl , ' failed');
                //GM.notification({text: 'loading resource from ' + xhr.finalUrl  + ' failed', title: 'error',}, function(){});
                return;
            }

            var src = h;
            var download = src;
            download = download.substr(0, download.lastIndexOf(':'));
            download = download.substr(download.lastIndexOf('/'), download.length);
            console.info('downloading', src);

            var downloadTimeOut = 10;
            if(localErrorsCount >= 5) {
                downloadTimeOut = 3000;
            }


            setTimeout(function() {
                if(downloaded[src] != 1) {
                    activeDownloads[src] = 1;

                    //console.log(activeDownloads);

                    GM.download({url: src, name: h, abort: function(d){
                        pushArray('errors', xhr.finalUrl);
                        console.error('loading resource from ', xhr.finalUrl , ' failed');
                        GM.notification({text: 'loading resource from ' + xhr.finalUrl  + ' failed', title: 'error',}, function(){});
                    }, onerror : function(d, details) {
                        pushArray('errors', xhr.finalUrl);
                        console.error('loading resource from ', xhr.finalUrl , ' failed', d, details);
                        localErrorsCount++;
                        delete activeDownloads[src];
                        //GM.notification({text: 'loading resource from ' + xhr.finalUrl  + ' failed: ' + d, title: 'error',}, function(){});

                        /*console.info(`trying to load "${src}" by click`);

                var link = document.createElement('a');
                link.setAttribute('href',src);
                link.setAttribute('download',h);
                onload=link.click();

                loaded++;
                deleteFromArray('errors', xhr.finalUrl);
                updateStatus();*/


                    }, onload: function(d) {
                        loaded++;
                        deleteFromArray('errors', xhr.finalUrl);
                        delete activeDownloads[src];
                        downloaded[src] = 1;

                        updateStatus();
                    }, ontimeout: function(){
                        pushArray('errors', xhr.finalUrl);
                        console.error('loading resource from ', xhr.finalUrl , ' failed, timeout over', d, details);
                        localErrorsCount++;
                        delete activeDownloads[src];
                    }});
                }
        }, downloadTimeOut);

        }, function(xhr){
            //pushArray('errors', xhr.finalUrl);
            console.error('loading resource from ', xhr.finalUrl , ' failed');
            GM.notification({text: 'loading resource from ' + xhr.finalUrl  + ' failed', title: 'error',}, function(){});
        })
    };

    var actionManager = {

        clickToCloseAll : function() {
            window.opennedwindows.forEach(function(item, i, opennedwindows) {
                item.close();
            });

            window.opennedwindows = [];
        },

        clickDownloadAllProcessor : async function() {
            toLoad = 0;
            loaded = 0;
            window.opennedwindows = [];
            window.downloadurls = [];
            var toloadurls = [];
            await $("article a").each(function(){
                if($('input#downloadme', this)[0].checked == true) {
                    var rel = $(this).attr('href');
                    toloadurls.push(rel);
                }
            });

            toLoad = toloadurls.length;

            var timerId = setInterval(function(timerId){
                if(toloadurls.length > 0) {
                    if(activeDownloadsCount() < maxDonwloads) {
                        downloadPost(toloadurls.shift());
                    }
                }
                else
                   clearInterval(timerId);
            }, queueTimer, timerId);

        },

        uncheckallProcessor : function() {
            $("article a input.downloadinput").prop('checked', false);
        },

        checkallProcessor : function() {
            $("article a input.downloadinput").prop('checked', true);
        },

        retrieveFailsProcessor : function() {
            if(activeDownloadsCount() > 0)
                return;

            getErrors(function(errors){

                loaded = 0;
                toLoad = errors.length;

                var timerId = setInterval(function(timerId){
                    if(errors.length > 0) {
                        if(activeDownloadsCount() < maxDonwloads) {
                            downloadPost(errors.shift());
                        }
                    }
                    else
                        clearInterval(timerId);
                }, queueTimer, timerId);
            });
        },

        showFailsProcessor : function() {
            getErrors(function(errors){
                var newWindow = window.open();
                var doc = newWindow.document;
                errors.forEach(function(item, i, errors) {
                    doc.write(item + '<br>');
                });
            });
        },

        checkboxAutoDownloadProcessor : function() {
            var val = $("input#autonextdownloadCheckbox").prop('checked');
            GM.setValue('autodownload', val);
        },

        init : function(adv) {
            var button = "<br><button id=downloadallbutton>download this shit all</button>";
            var button3 = "<button id=uncheckallbutton>uncheck all</button>";
            var button4 = "<button id=checkallbutton>check all</button><br>";
            var checkbox1 = "autodownload <input id=autonextdownloadCheckbox type=checkbox></input><br>";
            var button5 = "<button id=showFailsButton>showfails</button><br>";
            var button6 = "<button id=retrievefailsButton>retrieve fails</button><br>";
            var statusInformationContainer = "<span id=downloadlStatusInformation>status</span><br><span style=color:red; id=downloadfails>0</span><br>";

            if($("menu#post-sections li.active").text() !== 'Comments') {
                var pdom = $("menu#post-sections li.active");
                var buttondom = pdom.append(button);
                $('button#downloadallbutton').on('click', this.clickDownloadAllProcessor);

                var buttondom3 = pdom.append(button3);
                $('button#uncheckallbutton').on('click', this.uncheckallProcessor);

                var buttondom4 = pdom.append(button4);
                $('button#checkallbutton').on('click', this.checkallProcessor);

                var checkbox1dom = pdom.append(checkbox1);
                $('input#autonextdownloadCheckbox').on('click', this.checkboxAutoDownloadProcessor);

                var buttondom5 = pdom.append(button5);
                $('button#showFailsButton').on('click', this.showFailsProcessor);

                var buttondom6 = pdom.append(button6);
                $('button#retrievefailsButton').on('click', this.retrieveFailsProcessor);

                if(adv == true) {
                    $('input#autonextdownloadCheckbox').prop('checked', true);
                }

                pdom.append(statusInformationContainer);


                $("article a").prepend('<input class=downloadinput id=downloadme type="checkbox" checked=checked>');

                $('article a input.downloadinput').css('z-index','0');


                if($("input#autonextdownloadCheckbox").prop('checked') == true) {
                    $('button#downloadallbutton').click();

                    function waitfordownloads() {
                        errorsCount(function(count) {
                            if((retriveSimaphore == 0) || (count == 0)) {
                                if(retriveSimaphore == 0)
                                    $('li.arrow a[data-shortcut="d right"]')[0].click();
                                //toLoad = loaded = 0;

                                if((toLoad == loaded) && ((activeDownloadsCount() == 0)) ) {
                                    retriveSimaphore = 5;
                                    if($('li.arrow a[data-shortcut="d right"]').length > 0)
                                        $('li.arrow a[data-shortcut="d right"]')[0].click();
                                    else {
                                        GM.notification({text: 'Download compete', title: 'Success',}, function(){});
                                        GM.setValue('autodownload', false);
                                    }
                                }
                                else
                                    setTimeout(waitfordownloads, 2500);
                            }
                            else {
                                if(activeDownloadsCount() == 0) {
                                    retriveSimaphore--;
                                    $('button#retrievefailsButton').click();
                                    setTimeout(waitfordownloads, 5000);
                                }
                                else {
                                    setTimeout(waitfordownloads, 2500);
                                }
                            }
                        });
                    };

                    setTimeout(waitfordownloads, 3500);

                }
            }
        },
    };



    (async function(){
        var adv = await GM.getValue('autodownload', false);
        actionManager.init(adv);
        errorsCountUpdate();
    })();
})();