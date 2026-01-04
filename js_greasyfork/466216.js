// ==UserScript==
// @name        Check upcoming releases
// @version     1.8
// @description Check upcoming releases by poster, sample images and video.
// @author   sprocket1201
// @match     https://ec.sod.co.jp/*
// @grant     GM.xmlHttpRequest
// @grant     GM_xmlhttpRequest
// @connect   dy43ylo5q3vt8.cloudfront.net
// @namespace https://greasyfork.org/users/734736
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/466216/Check%20upcoming%20releases.user.js
// @updateURL https://update.greasyfork.org/scripts/466216/Check%20upcoming%20releases.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // console.log("here");
    // Create a count to store the number of generated buttons
    var count = 0;
    var bypassCORS = false;

    // Define a function to create a floating button with the specified text content
    function createFloatingButton(html, buttonId = 'button-' + (count + 1)) {
        let container = null;
        if (count == 0) {
            // append floating div
            container = document.createElement('div');
            container.id = 'floating-container';
            container.setAttribute('style', 'position: fixed; left: 16px; bottom: 16px; z-index: 9999; ' +
                'display: flex; flex-direction: column; gap: 1rem;');
            document.body.appendChild(container);
        } else container = document.getElementById('floating-container');

        // Create the button element
        var button = document.createElement('button');
        button.innerHTML = html;
        button.setAttribute('style', 'background: transparent; border: none; -webkit-text-stroke: 1px black; ' +
            'text-shadow: 3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; ' +
            'color: white;');
        button.id = buttonId;

        // Add the new button to the map
        count++;

        // Insert the button into the document body
        container.appendChild(button);
    }

    const iconStyle = `position: absoluted; top: 0; right: 0; z-index: -1; font-size: 3rem;`;

    if (location.pathname == "/special/new_title_page/index.php") {
        // Create the 'save new prefix & id' button
        createFloatingButton('<i class="fa fa-save" style="' + iconStyle + '"></i>', 'save-new-prefix-id');
        // Add an event listener to the button
        document.getElementById('save-new-prefix-id').addEventListener('click', function (e) {
            function getAllIdPrefix() {
                let prefixs = JSON.parse(localStorage.getItem("id-prefix") || "{}");
                Array.from(document.querySelectorAll(".lineup img.lazy")).forEach(el => {
                    let src = el.getAttribute("data-src"),
                        prefix = src.split("/").at(-2).split("_")[0],
                        num = src.split("/").at(-2).split("_")[1];
                    if (!(prefix in prefixs)) prefixs[prefix] = Number(num);
                    else if (prefixs[prefix] < Number(num)) {
                        prefixs[prefix] = Number(num);
                    }
                });
                return prefixs;
            }
            localStorage.setItem("id-prefix", JSON.stringify(getAllIdPrefix()));

            // change to check mark
            let i = e.target,
                originalClass = i.getAttribute('class');
            i.setAttribute('class', 'fa fa-check');
            i.style.color = 'lime';
            setTimeout(() => { // reset
                i.setAttribute('class', originalClass);
                i.style.color = 'inherit';
            }, 1500);

        });

        let clearFn = () => document.querySelectorAll(".fadein01 > .main > ul.generated").forEach(node => node.remove()),
            checkFn = (i, month, prefix, num) => new Promise((rs, rj) => {
                let base = "https://dy43ylo5q3vt8.cloudfront.net/_pics/202302/stars_753/stars_753_s.jpg";
                let src = base.split("/");
                src.splice(-3);

                const limit = 50,
                    newNum = (Math.max(1, num + i - limit * 0.2) + "").padStart(3, "0");
                src = src.join("/") +
                    "/" + month + "/" + prefix + "_" + newNum +
                    "/" + prefix + "_" + newNum + "_s.jpg";

                checkImageExist(src).then(r => {
                    if (!r) rs(false);
                    var img = document.createElement("img");
                    img.src = src.replace('_s.jpg', '_l.jpg');
                    img.alt = prefix + '-' + newNum;
                    img.style.maxWidth = '100%';
                    let errorListener = e => {
                        img.src = img.src.replace('_l.jpg', '_s.jpg');
                        img.removeEventListener('error', errorListener);
                    };
                    img.addEventListener('error', errorListener);
                    rs(img);
                });
            }),
            outputFn = result => {
                let ul = document.createElement("ul");
                ul.classList.add("generated");
                ul.innerHTML = '<div class="lineup"></div>';
                let lineupEl = ul.querySelector(".lineup");
                result.filter(r => !!r).forEach(img => {
                    let li = document.createElement("li"),
                        titleEl = document.createElement("div");
                    li.title = img.alt;
                    li.innerHTML = '<div class="lineup_thm"><a href="javascript:void(0)"></a></div>';
                    titleEl.classList.add("name_box");
                    titleEl.innerHTML = '<p>' + img.alt + '</p>';
                    li.querySelector("a").appendChild(img);
                    li.querySelector("a").appendChild(titleEl);
                    lineupEl.appendChild(li);
                });
                const firstUl = document.querySelector(".fadein01 > .main > ul");
                firstUl.parentNode.insertBefore(ul, firstUl);
            };
        addCheckingBtn('check-poster', 'image', clearFn, checkFn, outputFn);
    }

    if (location.pathname == "/prime/videos/") {
        let clearFn = () => {
            let oldTargets = Array.from(document.querySelectorAll("#videos_samsbox > a"));
            oldTargets.pop();
            oldTargets.forEach(t => t.remove());
        },
            checkFn = (i, month, prefix, num) => new Promise((rs, rj) => {
                let base = "https://dy43ylo5q3vt8.cloudfront.net/_pics/202302/stars_753/stars_753_01_l.jpg";
                let src = base.split("/");
                src.splice(-3);

                const limit = 50,
                    newNum = (Math.max(1, num + i - limit * 0.2) + "").padStart(3, "0");
                src = src.join("/") +
                    "/" + month + "/" + prefix + "_" + newNum +
                    "/" + prefix + "_" + newNum + "_01_l.jpg";

                checkImageExist(src).then(r => {
                    if (!r) rs(false);
                    var img = document.createElement("img");
                    img.src = src;
                    img.alt = prefix + "_" + newNum + "_01";
                    rs(img);
                });
            }),
            outputFn = result => {
                result.filter(r => !!r).forEach(img => {
                    let a = document.createElement("a");
                    a.classList.add("click-to-load-more");
                    a.title = img.alt;
                    a.href = img.src;
                    a.appendChild(img);
                    document.getElementById("videos_samsbox").insertBefore(a, document.querySelector("#videos_samsbox .clear"));
                });
            };
        addCheckingBtn('check-sample-image', 'camera', clearFn, checkFn, outputFn);

        document.addEventListener("click", function (e) {
            const target = e.target.closest("a.click-to-load-more");
            if (target) {
                // generate more image
                for (let count = 2; count <= 20; count++) {
                    let src = target.querySelector("img").src.replace("_01_l.jpg", "_" + (count + "").padStart(2, "0") + "_l.jpg");
                    checkImageExist(src).then(r => {
                        if (!r) return;
                        var img = document.createElement("img");
                        img.src = src;
                        img.alt = src.split("/").at(-2) + "_" + (count + "").padStart(2, "0");
                        let a = document.createElement("a");
                        a.classList.add("generated-more");
                        a.title = img.alt;
                        a.href = img.src;
                        a.appendChild(img);
                        let lastEl = null;
                        let lastCount = count;
                        do {
                            lastEl = target.querySelector("[title='" + src.split("/").at(-2) + "_" + (--lastCount + "").padStart(2, "0") + "']");
                        } while (lastCount > 1);
                        if (!lastEl) {
                            lastEl = target.querySelector("[title='" + src.split("/").at(-2) + "_01']");
                        }
                        target.insertBefore(a, lastEl);
                    });
                }
                target.classList.remove("click-to-load-more");
                target.classList.add("generated");
            }
        });
    }

    if (location.pathname == "/prime/videos/sample.php") {
        let clearFn = () => document.getElementById("moviebox").innerHTML = document.querySelector("#moviebox video").outerHTML,
            checkFn = (i, month, prefix, num) => new Promise((rs, rj) => {
                let base = "https://dy43ylo5q3vt8.cloudfront.net/_sample/202302/stars_753/stars_753_sample.mp4";
                let src = base.split("/");
                src.splice(-3);

                const limit = 50,
                    newNum = (Math.max(1, num + i - limit * 0.2) + "").padStart(3, "0");
                src = src.join("/") +
                    "/" + month + "/" + prefix + "_" + newNum +
                    "/" + prefix + "_" + newNum + "_sample.mp4";

                checkVideoExists(src, { "Referer": "https://ec.sod.co.jp/" }).then(r => {
                    if (!r) { rs(false); }
                    else {
                        var button = document.createElement("button");
                        button.classList.add("click-to-watch");
                        button.setAttribute("data-url", src);

                        var img = document.createElement("img");
                        img.src = src.replace('_sample', '_pics').replace('_sample.mp4', '_l.jpg');
                        img.alt = prefix + '-' + newNum;
                        img.style.height = '150px';
                        let errorListener = e => {
                            img.setAttribute('src', img.src.replace('_l.jpg', '_s.jpg'));
                            img.removeEventListener('error', errorListener);
                        }
                        img.addEventListener('error', errorListener);
                        button.appendChild(img);
                        button.innerHTML += '<br>' + prefix + "-" + newNum;
                        rs(button);
                    }
                });
            }),
            outputFn = result => {
                let wrapper = document.createElement("div");
                wrapper.classList.add("generated");
                result.filter(r => !!r).forEach(videoBtn => {
                    wrapper.appendChild(videoBtn);
                });
                document.querySelector("#moviebox video").parentNode.appendChild(wrapper);
            };
        addCheckingBtn('check-sample-video', 'video-camera', clearFn, checkFn, outputFn);

        document.addEventListener("click", function (e) {
            const target = e.target.closest(".click-to-watch");
            if (target) {
                let clonedSource = document.querySelector("#moviebox video source").cloneNode();
                let clonedVideo = Array.from(document.querySelectorAll("#moviebox video")).at(-1).cloneNode();
                clonedVideo.appendChild(clonedSource);
                const wrappingElement = document.createElement('div');
                clonedVideo.replaceWith(wrappingElement);
                wrappingElement.appendChild(clonedVideo);
                let closeBtn = document.createElement("i");
                closeBtn.classList.add("fa", "fa-times");
                wrappingElement.appendChild(closeBtn);

                clonedVideo.setAttribute("title", target.innerHTML);
                Array.from(clonedVideo.querySelectorAll("source")).at(-1).setAttribute("src", target.getAttribute("data-url"))
                target.after(wrappingElement);
                target.remove();
            }

            const closeBtnTarget = e.target.closest(".fa-times");
            if (closeBtnTarget) {
                closeBtnTarget.parentNode.remove();
            }
        });

        // check if cors can be bypass
        let src = document.querySelector("#moviebox video source").src;
        sendHeadRequest(src, { "Referer": "https://ec.sod.co.jp/" }).then(r => bypassCORS = r);
    }

    function addCheckingBtn(id, icon, clearFn, checkFn, outputFn) {
        let month = getMonthString();
        createFloatingButton('<i class="fa fa-calendar" style="' + iconStyle + '"></i>', id + '-with-date');
        createFloatingButton('<i class="fa fa-' + icon + '" style="' + iconStyle + '"></i>', id);

        // Add an event listener to the button
        document.getElementById(id).addEventListener('click', e => performChecking(e.target, month));
        document.getElementById(id + '-with-date').addEventListener('click', function (e) {
            let m = prompt("Please enter the month wanted to be checked: ", month);
            if (m != null) performChecking(e.target, m);
        });

        async function performChecking(target, month) {
            clearFn();

            // change to spinner
            let originalClass = target.getAttribute('class');
            target.setAttribute('class', 'fa fa-spinner fa-spin');
            target.style.color = 'yellow';
            target.parentNode.setAttribute('disabled', 'true');

            let percentageIndicator = document.createElement('span');
            percentageIndicator.innerHTML = '0%';
            percentageIndicator.setAttribute('style', 'font-size: 1.5rem; position: absolute; margin-left: 16px;' +
                ' font-weight: bold; bottom: 0.75rem; font-family: inherit; min-width: 64px;');
            target.parentNode.appendChild(percentageIndicator);

            // doit
            const entries = Object.entries(JSON.parse(localStorage.getItem("id-prefix")));
            let count = 0;

            for await (let [prefix, num] of entries) {
                let result = await Promise.all(Array.from(Array(50)).map(async (v, i) => await checkFn(i, month, prefix, num)));
                outputFn(result);
                percentageIndicator.innerHTML = Math.ceil(++count / entries.length * 100) + '%';
            }

            target.setAttribute('class', originalClass);
            target.style.color = 'inherit';
            percentageIndicator.remove();

            // change to check mark
            target.setAttribute('class', 'fa fa-check');
            target.style.color = 'lime';
            setTimeout(() => { // reset
                target.setAttribute('class', originalClass);
                target.style.color = 'inherit';
            }, 1500);
        }
    }

    function getMonthString() {
        const currentDate = new Date();
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1);
        return `${nextMonth.getFullYear()}${(nextMonth.getMonth() + 1).toString().padStart(2, '0')}`;
    }

    function checkImageExist(src) {
        return new Promise((rs, rj) => {
            var img = document.createElement("img");
            let errorListener = e => {
                img.removeEventListener('error', errorListener);
                img.removeEventListener('load', loadListener);
                rs(false);
            },
                loadListener = e => {
                    img.removeEventListener('error', errorListener);
                    img.removeEventListener('load', loadListener);
                    rs(true);
                };
            img.addEventListener('error', errorListener);
            img.addEventListener('load', loadListener);
            img.src = src;
        });
    }

    function checkVideoExists(src, headers = {}) {
        if (!!bypassCORS) return sendHeadRequest(src, headers);
        return new Promise((rs, rj) => {
            var video = document.createElement('video');
            video.setAttribute('preload', 'none');
            let errorListener = e => {
                video.removeEventListener('error', errorListener);
                video.removeEventListener('load', loadListener);
                video.src = '';
                video.remove();
                rs(false);
            },
                loadListener = e => {
                    video.removeEventListener('error', errorListener);
                    video.removeEventListener('load', loadListener);
                    video.src = '';
                    video.remove();
                    rs(true);
                };
            video.addEventListener('error', errorListener);
            video.addEventListener('load', loadListener);
            video.src = src;
        });
    }

    function sendHeadRequest(href, headers = {}) {
        return new Promise((rs, rj) => {
            try {
                if (GM.xmlHttpRequest || GM_xmlhttpRequest) {
                    (GM.xmlHttpRequest || GM_xmlhttpRequest)({
                        method: "HEAD",
                        url: href,
                        headers,
                        onload: response => rs(response.status === 200)
                    });
                } else {
                    fetch(href, { method: 'HEAD' })
                        .then(response => rs(response.ok))
                        .catch(err => rs(false));
                }
            } catch (error) {
                rs(false)
            }
        });
    }
})();