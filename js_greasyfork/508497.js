// ==UserScript==
// @name         GDC Vault downloader
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  extract stream file and convert to mp4
// @author       Askhento
// @match        https://*gdcvault.blazestreaming.com/*
// @match        https://*gdcvault.com/play/*
// @match        https://*.gdcvault.com/play/*
// @icon         data:image/gif;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAAAAAABIAAAA5wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAOcAAABIAAAA5AAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA5AAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP9gYGD/7+/v////////////YGBg/2BgYP///////////7+/v/8QEBD/gICA////////////39/f/wAAAP8AAAD/7+/v/8/Pz/8QEBD/z8/P/5+fn///////cHBw/yAgIP/Pz8//v7+///////+fn5//ICAg/1BQUP8AAAD/AAAA//////9gYGD/YGBg/7+/v/+fn5///////wAAAP8AAAD/gICA////////////QEBA/wAAAP8AAAD/AAAA/wAAAP/v7+//r6+v/xAQEP8gICD/UFBQ//////9AQED/QEBA/9/f3/+vr6///////5+fn/8QEBD/QEBA/wAAAP8AAAD/QEBA/+/v7////////////4CAgP////////////////+/v7//EBAQ/2BgYP/v7+////////////8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAOcAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAOcAAAA/AAAAyQAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAMkAAAA/AAAJVgAAAAAAAB/nAABhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACAABnIAAAAAAAAFQgAABydg==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508497/GDC%20Vault%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/508497/GDC%20Vault%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //console.log("loc = " + window.self.location.href);
    // check if we are inside iframe
    if (window.top === window.self) {

        /*
        userscript should match main page and iframe with video element
        some years have different player????


        */
        function M3U8() {
            var _this = this; // access root scope

            this.ie = navigator.appVersion.toString().indexOf(".NET") > 0;
            this.ios = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);


            this.start = function(m3u8, options) {

                if (!options)
                    options = {};

                var callbacks = {
                    progress: null,
                    finished: null,
                    error: null,
                    aborted: null
                }

                var recur; // the recursive download instance to later be initialized. Scoped here so callbakcs can access and manage it.

                function handleCb(key, payload) {
                    if (key && callbacks[key])
                        callbacks[key](payload);
                }

                if (_this.ios)
                    return handleCb("error", "Downloading on IOS is not supported.");

                var startObj = {
                    on: function(str, cb) {
                        switch (str) {
                            case "progress": {
                                callbacks.progress = cb;
                                break;
                            }
                            case "finished": {
                                callbacks.finished = cb;
                                break;
                            }
                            case "error": {
                                callbacks.error = cb;
                                break;
                            }
                            case "aborted": {
                                callbacks.aborted = cb;
                                break;
                            }
                        }

                        return startObj;
                    },
                    abort: function() {
                        ;
                        recur && (recur.aborted = function() {
                            handleCb("aborted");
                        });
                    }
                }

                var download = new Promise(function(resolve, reject) {
                    var url = new URL(m3u8);

                    var req = fetch(m3u8)
                    .then(function(d) {
                        return d.text();
                    })
                    .then(function(d) {

                        const segmentReg = /^(?!#)(.+)\.(.+)$/gm;
                        const segments = d.match(segmentReg);

                        var mapped = map(segments, function(v, i) {
                            let temp_url = new URL(v, url) // absolute url
                            return temp_url.href
                        });

                        if (!mapped.length) {
                            reject("Invalid m3u8 playlist");
                            return handleCb("error", "Invalid m3u8 playlist");
                        }

                        recur = new RecurseDownload(mapped, function(data) {

                            var blob = new Blob(data, {
                                type: "octet/stream"
                            });

                            handleCb("progress", {
                                status: "Processing..."
                            });

                            if (!options.returnBlob) {
                                if (_this.ios) {
                                    // handle ios?
                                } else if (_this.ie) {
                                    handleCb("progress", {
                                        status: "Sending video to Internet Explorer... this may take a while depending on your device's performance."
                                    });
                                    window.navigator.msSaveBlob(blob, (options && options.filename) || "video.mp4");
                                } else {
                                    handleCb("progress", {
                                        status: "Sending video to browser..."
                                    });
                                    var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
                                    a.href = URL.createObjectURL(blob);
                                    a.download = (options && options.filename) || "video.mp4";
                                    a.style.display = "none";
                                    document.body.appendChild(a); // Firefox fix
                                    a.click();
                                    handleCb("finished", {
                                        status: "Successfully downloaded video",
                                        data: blob
                                    });
                                    resolve(blob);
                                }
                            } else {
                                handleCb("finished", {
                                    status: "Successfully downloaded video",
                                    data: blob
                                });
                                resolve(blob)
                            }


                        }, 0, []);

                        recur.onprogress = function(obj) {
                            handleCb("progress", obj);
                        }

                    })
                    .catch(function(err) {
                        handleCb("error", "Something went wrong when downloading m3u8 playlist: " + err);
                    });
                });

                return startObj;

            }

            function RecurseDownload(arr, cb, i, data) { // recursively download asynchronously 2 at the time
                var _this = this;

                this.aborted = false;

                recurseDownload(arr, cb, i, data);

                function recurseDownload(arr, cb, i, data) {
                    var req = Promise.all([fetch(arr[i]), arr[i + 1] ? fetch(arr[i + 1]) : Promise.resolve()]) // HTTP protocol dictates only TWO requests can be simultaneously performed
                    .then(function(d) {
                        return map(filter(d, function(v) {
                            return v && v.blob;
                        }), function(v) {
                            return v.blob();
                        });
                    })
                    .then(function(d) {
                        return Promise.all(d);
                    })
                    .then(function(d) {

                        var blobs = map(d, function(v, j) {
                            return new Promise(function(resolve, reject) {
                                var reader = new FileReader();

                                var read = reader.readAsArrayBuffer(new Blob([v], {
                                    type: "octet/stream"
                                })); // IE can't read Blob.arrayBuffer :(

                                reader.addEventListener("loadend", function(event) { // event listener, my old friend we meet again... I cenrtainly haven't missed you in place of promise

                                    resolve(reader.result);;
                                    (_this.onprogress && _this.onprogress({
                                        segment: i + j + 1,
                                        total: arr.length,
                                        percentage: Math.floor((i + j + 1) / arr.length * 100),
                                        downloaded: formatNumber(+reduce(map(data, function(v) {
                                            return v.byteLength;
                                        }), function(t, c) {
                                            return t + c;
                                        }, 0)),
                                        status: "Downloading..."
                                    }));
                                });
                            });
                        });

                        Promise.all(blobs).then(function(d) {
                            for (var n = 0; n < d.length; n++) { // polymorphism
                                data.push(d[n]);
                            }

                            var increment = arr[i + 2] ? 2 : 1; // look ahead to see if we can perform 2 requests at the same time again

                            if (_this.aborted) {
                                data = null; // purge data... client side calling of garbage collector isn't possible. I know about opera and ie's garbage collectors but they're not ideal.
                                _this.aborted();
                                return; // exit promise
                            } else if (arr[i + increment]) {

                                setTimeout(function() {
                                    recurseDownload(arr, cb, i + increment, data);
                                }, _this.ie ? 500 : 0);
                            } else {
                                cb(data);
                            }
                        });

                    })
                    .catch(function(err) {
                        ;
                        _this.onerror && _this.onerror("Something went wrong when downloading ts file, nr. " + i + ": " + err);
                    });
                }

            }

            function filter(arr, condition) {
                var result = [];
                for (var i = 0; i < arr.length; i++) {
                    if (condition(arr[i], i)) {
                        result.push(arr[i]);
                    }
                }
                return result;
            }

            function map(arr, condition) {
                var result = arr.slice(0);
                for (var i = 0; i < arr.length; i++) {
                    result[i] = condition(arr[i], i);
                }
                return result;
            }

            function reduce(arr, condition, start) {
                var result = start;
                arr.forEach(function(v, i) {
                    var res = +condition(result, v, i);
                    result = res;
                });
                return result;
            }



            function formatNumber(n) {

                var ranges = [{
                    divider: 1e18,
                    suffix: "EB"
                },
                              {
                                  divider: 1e15,
                                  suffix: "PB"
                              },
                              {
                                  divider: 1e12,
                                  suffix: "TB"
                              },
                              {
                                  divider: 1e9,
                                  suffix: "GB"
                              },
                              {
                                  divider: 1e6,
                                  suffix: "MB"
                              },
                              {
                                  divider: 1e3,
                                  suffix: "kB"
                              }
                             ]
                for (var i = 0; i < ranges.length; i++) {
                    if (n >= ranges[i].divider) {
                        var res = (n / ranges[i].divider).toString()

                        return res.toString().split(".")[0] + ranges[i].suffix;
                    }
                }
                return n.toString();
            }
        }





        let url;
        console.log("GDC Vault downloader  injected!");
        // Here we are at the top window and we setup our message event listener
        window.addEventListener("message", async function(event) {
            const text = await (await fetch(event.data.videoURL)).text();
            const streamPath = text.split("\n").at(-2);
            url = event.data.videoURL.replace("index.m3u8", streamPath);
        }, false);






        function createBtn(name)
        {
            const btn = document.createElement("button")
            btn.innerText = name;
            btn.style.zIndex = "1000"
            btn.style.width = "100px";
            btn.style.height = "50px";
            btn.style.overflow = "visible"
            btn.style.top = "20px";
            btn.style.left =  "20px";
            btn.style.position = "absolute"
            playerContainer.appendChild(btn)
            return btn;
        }


        const videoElem = document.getElementById("my-video_html5_api");
        const playerContainer = document.getElementById("container");

        const downBtn = createBtn("");
        let loading = false;


        const m3u8 = new M3U8();

        function setDown()
        {
            downBtn.innerText = "Download";

            downBtn.onclick =  () => {

                console.log("start! with url : " + url);
                loading = true;

                const download = m3u8.start(url);

                download.on("progress", progress => {
                    //console.log(progress); // See Classes > M3U8.events.progress
                    downBtn.innerText = "Loading : " + progress.percentage + "%";

                }).on("finished", finished => {
                    downBtn.innerText = "Finished!";
                    console.log(finished); // See Classes > M3U8.events.finished
                    setResetClick();
                }).on("error", message => {
                    downBtn.innerText = "Error";
                    console.error(message); // See Classes > M3U8.events.error
                    setResetClick();
                }).on("aborted", () => {
                    downBtn.innerText = "Aborted";
                    console.log("Download aborted");
                    setResetClick();
                });

                function setResetClick()
                {
                    downBtn.onclick = () => {
                        setDown();

                    }
                }


                downBtn.onclick = () => {
                    download.abort();
                }

            }
        }

        setDown();

    }
    else
    {
        console.log("GDC Vault downloader iframe injected!");
        // Here we get inside the iframes.
        // We can address and check each iframe url with document.domain
        window.top.postMessage({
            videoURL : PLAYBACK_URL //.replace("index", "index_2")
        }, "*");
    }

})();
