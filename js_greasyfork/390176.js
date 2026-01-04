// ==UserScript==
// @name           Kindle Downloader
// @namespace      http://userscripts.org/users/mizuho
// @description    Download a Book in Kindle Cloud Reader
// @copyright      2019 by Mizuho (Mio)
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20240707072217
// @downloadURL https://update.greasyfork.org/scripts/390176/Kindle%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/390176/Kindle%20Downloader.meta.js
// ==/UserScript==

(function()
{
    var asin = "";
    var clientVersion = 0; //KindleVersion.getVersionNumber().toString();
    var contentVersion = "";
    var formatVersion = "";
    var kindleSessionId = "";
    var token = "";
    var sessionId = "";
    var title = "none";
    var pages= Array();

    function resolveAfter() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('resolved');
            }, 100);
        });
    }

    function deferredAddZip(url) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                eval(xmlhttp.responseText);
            } else if (xmlhttp.status == 400) {
                console.log('There was an error 400');
            }
        };
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
    }

    async function BookDownload(isSample) {
        var zip = new JSZip();
        var deferreds = [];
        var bFailed = false;
        title = title.replace(/\*/g, "＊").replace(/"/g, "＂").replace(/\|/g, "｜").replace(/\\/g, "＼").replace(/\//g, "／").replace(/!/g, "！").replace(/\?/g, "？").replace(/&/g, "＆").replace(/\^/g, "＾").replace(/:/g, "：").replace(/%/g, "％");

        SetResult("Downloading...", "", "right", "msg");

        // find every checked item
        for(var page in pages) {
            $.ajax({
                type: "GET",
                url: "https://read.amazon.co.jp/service/web/reader/getFileUrl?asin=" + asin + "&contentVersion=" + contentVersion + "&formatVersion=" + formatVersion + "&clientVersion=" + clientVersion + "&kindleSessionId=" + kindleSessionId + "&resourceIds=" + pages[page] + (isSample ? "&isSample=true" : ""),
                dataType: "json",
                async: false,
                beforeSend: function (e) {
                    e.setRequestHeader("X-ADP-Session-Token", token);
                },
                success: function (e) {
                    e.resourceUrls.forEach(function (resource) {
                        //console.log(resource.id);
                        var filename = title + "_" + resource.id + ".jpg";

                        var deferred = $.Deferred();

                        window['loadResource' + resource.id] = function (e) {
                            zip.file(filename, e.data.replace(/^data:[^,]+,/, ""), {
                                base64: true
                            });

                            deferred.resolve(e.data);
                        };

                        deferredAddZip(resource.signedUrl);
                        deferreds.push(deferred.promise());
                    });
                },
                error: function (e, i, r) {
                    bFailed = true;
                }
            });
            const result = await resolveAfter();
        }

        // when everything has been downloaded, we can trigger the dl
        $.when.apply($, deferreds).done(function () {
            zip.generateAsync({ type: "blob" })
            .then(function (blob) {
                // use content
                saveAs(blob, title + ".zip");
            });

            if(bFailed) {
                SetResult("error getFileUrl", "", "right", "msg");
            }
            else {
                console.log("done !");
                SetResult("Done!!", "", "right", "msg");
            }
        }).fail(function(err) {
            console.log(err);
            SetResult("error save zip", "", "right", "msg");
        });
        return false;
    };

    function GetAsin(url) {
        var asin = /[?&][Aa][Ss][Ii][Nn]=([^?]+)/gm.exec(url);
        if (asin !== null) {
            return asin[1];
        }

        var lastbook = window.localStorage["last_app_activity"];
        if(lastbook !== undefined) {
            asin = JSON.parse(lastbook);
            if(asin.asin !== undefined)
                return asin.asin;
        }
        return "";
    }

    function DownloadAmazonKindle(url) {
        var resourceIds = 0;
        var manifestUrl = "";
        var metadataUrl = "";
        var isSample = false;

        // get asin
        asin = GetAsin(url);
        if (asin === "") {
            SetResult("error GetAsin", "", "right", "msg");
            return;
        }

        (async () => {
            SetResult("Processing...", "", "right", "msg");

            const getVersion = async function() {
                return new Promise(res => {
                    let find=false;
                    let scripts = document.getElementsByTagName("script");
                    for(var script of scripts) {
                        let url = script.getAttribute("src");
                        if(url !== null && script.getAttribute("crossorigin") !== null) {
                            if(/amazon\./gi.test(url) == false) {
                                continue;
                            }
                            let xmlhttp = new XMLHttpRequest();
                            xmlhttp.onreadystatechange = function () {
                                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                                    let version = /CLIENT_VERSION="(\d+)";/g.exec(xmlhttp.responseText);
                                    if (version !== null) {
                                        clientVersion = Number(version[1]);
                                    }
                                    let devicetype = /READER_DEVICE_ID="(\w+)"/g.exec(xmlhttp.responseText);
                                    if (devicetype !== null) {
                                        deviceType = devicetype[1];
                                    }
                                    if (clientVersion > 0 && deviceType !== "") find = true;
                                } else if (xmlhttp.status == 400) {
                                    console.log('There was an error 400');
                                    //res(false);
                                }
                            };
                            xmlhttp.open("GET", url, false);
                            xmlhttp.send();
                        }
                        if (find) break;
                    }
                    res(find);
                });
            };

            if(await getVersion() == false) {
                var errmsg = "error getVersion";
                console.log(errmsg);
                SetResult(errmsg, "", "right", "msg");
                return;
            }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
            const getCookie = function(e) {
                var t = document.cookie.match("(^|;) ?" + e + "=([^;]*)(;|$)");
                return (t ? t[2] : null);
            };
            sessionId = getCookie("session-id");
            if(sessionId === null) {
                var errmsg = "error getCookie";
                console.log(errmsg);
                SetResult(errmsg, "", "right", "msg");
                return;
            }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
            const getToken = async function() {
                return new Promise(res => {
                    let url = `https://read.amazon.co.jp/service/mobile/register/getDeviceToken?serialNumber=${deviceType}&deviceType=${deviceType}`;
                    let xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                            let device = JSON.parse(xmlhttp.responseText);
                            if (device.deviceSessionToken !== undefined) {
                                token = device.deviceSessionToken;
                            }
                            res(token !== "");
                        } else if (xmlhttp.status == 400) {
                            console.log('There was an error 400');
                            res(false);
                        }
                    };
                    xmlhttp.open("GET", url, true);
                    xmlhttp.setRequestHeader("x-amzn-sessionid", sessionId);
                    xmlhttp.send();
                });
            };

            if(await getToken() == false) {
                var errmsg = "error getToken";
                console.log(errmsg);
                SetResult(errmsg, "", "right", "msg");
                return;
            }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
            const getData = async function() {
                return new Promise(res => {
                    $.ajax({
                        type: "GET",
                        url: "https://read.amazon.co.jp/service/web/reader/startReading?asin=" + asin + "&clientVersion=" + clientVersion,
                        dataType: "json",
                        async: false,
                        beforeSend: function(e) {
                            e.setRequestHeader("X-ADP-Session-Token", token);
                        },
                        success: function(e) {
                            contentVersion = e.contentVersion;
                            formatVersion = e.formatVersion;
                            kindleSessionId = e.kindleSessionId;
                            manifestUrl = e.manifestUrl;
                            metadataUrl = e.metadataUrl;
                            isSample = e.isSample;
                            res(true);
                        },
                        error: function(e, i, r) {
                            res(false);
                        }
                    });
                });
            };

            if(await getData() == false) {
                var errmsg = "error getData";
                console.log(errmsg);
                SetResult(errmsg, "", "right", "msg");
                return;
            }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
            const getMeta = async function() {
                return new Promise(res => {
                    window.loadMetadata = function(e) {
                        title = e.title;
                        res(true);
                    };

                    let xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                            eval(xmlhttp.responseText);
                        } else if (xmlhttp.status == 400) {
                            console.log('There was an error 400');
                            res(false);
                        }
                    };
                    xmlhttp.open("GET", metadataUrl, true);
                    xmlhttp.send();
                });
            };

            if(await getMeta() == false) {
                var errmsg = "error getMeta";
                console.log(errmsg);
                SetResult(errmsg, "", "right", "msg");
                return;
            }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
            const getManifest = async function() {
                return new Promise(res => {
                    window.loadManifest = function(e) {
                        for(let i in e.resourceManifest) {
                            if (e.resourceManifest[i].type.includes('image'))
                                pages.push(i);
                        }
                        res(true);
                    };

                    let xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                            eval(xmlhttp.responseText);
                        } else if (xmlhttp.status == 400) {
                            console.log('There was an error 400');
                            res(false);
                        }
                    };
                    xmlhttp.open("GET", manifestUrl, true);
                    xmlhttp.send();
                });
            };

            if(await getManifest() == false) {
                var errmsg = "error getManifest";
                console.log(errmsg);
                SetResult(errmsg, "", "right", "msg");
                return;
            }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
            BookDownload(isSample);
        })();
    }

    function start() {
        var bWait = false;
        if(typeof(JSZip) == 'undefined') {
            var jscript = document.createElement('script');
            jscript.src = 'https://stuk.github.io/jszip/dist/jszip.js';
            document.body.appendChild(jscript);
            bWait = true;
        }

        if(typeof(saveAs) == 'undefined') {
            var jscript = document.createElement('script');
            jscript.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js';
            document.body.appendChild(jscript);
            bWait = true;
        }

        if(bWait) {
            setTimeout(start, 100);
            return;
        }

        var domain = window.location.host;
        var url = document.location.href;
        var extractFunc = null;
        if (/read.amazon/gi.test(domain))
            extractFunc = DownloadAmazonKindle;

        extractFunc(url);
    }

    function CreateTable(col, row, color = "") {
        if (color === "")
            color = "white";

        var row_dom = document.createElement('div');
        row_dom.setAttribute('id', row);
        row_dom.setAttribute('style', 'color:' + color + ';font:12px Meiryo;');

        var col_dom = document.getElementById(col);
        if(col_dom === null) {
            col_dom = document.createElement('div');
            col_dom.setAttribute('id', col);
            col_dom.setAttribute('style', 'display:table-cell;padding:0px 10px 0px 10px; vertical-align:middle;');

            var table_dom = document.getElementById('resulttable');
            if(table_dom === null)
                CreateLayout();
            table_dom = document.getElementById('resulttable');
            if(table_dom !== null)
                table_dom.appendChild(col_dom);
        }

        col_dom.appendChild(row_dom);
    }

    function CreateLayout(color) {
        var trends_dom = document.getElementById('extractresult');
        if (trends_dom !== null)
            trends_dom.outerHTML = "";
        trends_dom = document.createElement('div');
        trends_dom.setAttribute('id', 'extractresult');
        var title_dom = document.createElement('strong');
        title_dom.innerHTML = [
            '<div style="display: block; text-align:center; width: 100%; padding: 0px; margin: auto; vertical-align: middle; border-spacing: 0px"><div id="resulttable" style="display: inline-table;">',
            '</div></div>'
        ].join(' ');

        trends_dom.appendChild(title_dom);
        trends_dom.style.cssText = [
            'background: rgba(55, 55, 55, 0.5);',
            'color: #fff;',
            'padding: 0px;',
            'position: fixed;',
            'z-index:102400;',
            'width:100%;',
            'font: 12px Meiryo;',
            'vertical-align: middle;',
        ].join(' ');
        document.body.style.cssText = 'position: relative; margin-top: 0px';
        document.body.insertBefore(trends_dom, document.body.firstElementChild);
    }

    function SetResult(name, value, col_id, row_id, color = "") {
        var elem = document.getElementById(row_id);
        if (elem === null)
            CreateTable(col_id, row_id, color);

        elem = document.getElementById(row_id);
        if (elem !== null) {
            elem.setAttribute('value', value);
            elem.innerHTML = name;
        }
    }

    start();
})();