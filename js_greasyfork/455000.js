// ==UserScript==
// @name            HDRezka Download
// @name:uk         HDRezka Завантажувальник
// @namespace       https://greasyfork.org/scripts/455000-hdrezka-download
// @version         0.3
// @description     download movies from rezka.ag with one simple button
// @description:uk  завантажуйте фільми з rezka.ag однією кнопкою
// @author          Prevter
// @match           https://rezka.ag/*
// @match           https://hdrezka.ag/*
// @match           https://hdrezka.co/*
// @match           https://hdrezka.re/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=rezka.ag
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/455000/HDRezka%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/455000/HDRezka%20Download.meta.js
// ==/UserScript==

const buttonCSS = {
    background: "#2d2d2d",
    color: "#fff",
    cursor: "pointer",
    display: "inline-block",
    fontSize: "13px",
    margin: "0 2px 2px 0",
    padding: "8px",
    textAlign: "left",
};

const progressCSS = {
    marginLeft: "4px",
};

const customCSS = `progress {
    --color:
        linear-gradient(#fff8,#fff0),
        #31c6f7;
    --background: lightgrey;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    width: 200px;
    height: 1em;
    border-radius: 10em;
    background: var(--background);
    overflow: none;
}
progress::-webkit-progress-bar {
    border-radius: 10em;
    background: var(--background);
}
progress[value]::-webkit-progress-value {
    border-radius: 10em;
    background: var(--color);
}
progress[value]::-moz-progress-bar {
    border-radius: 10em;
    background: var(--color);
}`;

(function (open) {
    const style = document.createElement('style');
    style.innerHTML = customCSS;
    document.getElementsByTagName('head')[0].appendChild(style);

    const convertToSpeed = (bytes, mbits) => {
        if (mbits) {
            bytes *= 8;
            if (bytes < 1024) return `${(bytes).toFixed(2)} b/s`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KiB/s`;
            if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MiB/s`;
            return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GiB/s`;
        }
        else {
            if (bytes < 1000) return `${(bytes).toFixed(2)} B/s`;
            if (bytes < 1000 * 1000) return `${(bytes / 1000).toFixed(2)} KB/s`;
            if (bytes < 1000 * 1000 * 1000) return `${(bytes / 1000 / 1000).toFixed(2)} MB/s`;
            return `${(bytes / 1000 / 1000 / 1000).toFixed(2)} GB/s`;
        }
    };

    let lastVideoURL = '';

    const filmName = $('.b-post__origtitle').text();

    const detectSourceChange = (current) => {
        return new Promise((resolve) => {
            let interval = setInterval(() => {
                if (current !== lastVideoURL) {
                    resolve();
                    clearInterval(interval);
                }
            }, 100);
        });
    }

    const getCurrentSeason = () => {
        return $('#simple-episodes-tabs').children('ul')[$('.b-simple_season__item.active').attr('data-tab_id') - 1].children;
    };

    const isSeries = () => {
        return $("#simple-episodes-tabs").length == 1;
    };

    const downloadCurrentEpisode = () => {
        if (lastVideoURL === "") {
            warningText.slideDown();
        } else {
            warningText.slideUp();
            window.open(lastVideoURL);
        }
    };

    const getOrCreateContainer = () => {
        let container = $('#downloader-container');
        if (container.length) return container;
        container = $("<div/>", {
            id: 'downloader-container'
        }).css({
            color: '#fff',
        });
        $("#user-network-issues").before(container);
        return container;
    };

    const beginDownload = (url, filename, onEnd) => {
        var blob;
        var xmlHTTP = new XMLHttpRequest();
        const speed = $("<span/>", {
            text: ""
        }).css({
            paddingRight: "4px",
        });
        const progressBar = $("<progress/>", {
            min: 0, max: 100
        }).css(progressCSS);
        const title = $("<span/>", {
            text: `${filename}: `,
        });
        const paragraph = $("<p/>");
        getOrCreateContainer().append(paragraph);
        paragraph.append(speed);
        paragraph.append(progressBar);
        progressBar.before(title);

        const cancelBtn = $("<button/>", {
            text: "X",
            click: () => {
                xmlHTTP.abort();
                paragraph.remove();
                if (onEnd) onEnd();
            }
        }).css(buttonCSS).css({
            fontSize: "10px",
            minWidth: "0",
            borderRadius: "8px",
        });
        paragraph.append(cancelBtn);

        var lastLoaded = 0;
        var lastTime = Date.now();

        xmlHTTP.open('GET', url, true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function (e) {
            blob = new Blob([this.response]);
        };
        xmlHTTP.onprogress = function (pr) {
            progressBar.val(pr.loaded / pr.total * 100);
            title.text(`${filename}: ${Math.round(pr.loaded / pr.total * 100)}%`);
            const now = Date.now();
            if (now - lastTime < 500) return;
            const speedValue = (pr.loaded - lastLoaded) / (now - lastTime) * 1000;
            speed.text(convertToSpeed(speedValue, showMbits));
            lastTime = now;
            lastLoaded = pr.loaded;
        };
        xmlHTTP.onloadend = function (e) {
            progressBar.removeAttr('value');
            title.text(`${filename}: Saving... `);
            cancelBtn.attr('disabled', 'disabled');
            cancelBtn.on('click', () => { });
            speed.remove();
            var tempEl = document.createElement("a");
            document.body.appendChild(tempEl);
            tempEl.style = "display: none";
            url = window.URL.createObjectURL(blob);
            tempEl.href = url;
            tempEl.download = filename;
            tempEl.click();
            setTimeout(() => {
                paragraph.remove();
            }, 5000);
            window.URL.revokeObjectURL(url);
            if (onEnd) onEnd();
        }
        return () => {
            xmlHTTP.send();
        };
    };

    const sleep = (time) => {
        return new Promise((resolve) => {
            setTimeout(() => { resolve(); }, time);
        });
    };

    const downloadCurrentSeason = async () => {
        const episodes = getCurrentSeason();
        let episodesURLs = [];
        const seasonNumber = $('.b-simple_season__item.active').attr('data-tab_id');

        const isOnFirst = episodes[0].classList.contains('active');
        if (isOnFirst) {
            episodesURLs.push(lastVideoURL);
        }

        for (var i = isOnFirst ? 1 : 0; i < episodes.length; i++) {
            const element = episodes[i];
            let videoSource = lastVideoURL;
            element.click();
            await detectSourceChange(videoSource);
            episodesURLs.push(lastVideoURL);
            await sleep(1500);
        }

        let downloadPool = [];
        const startNewDownload = () => {
            if (downloadPool.length) {
                downloadPool.shift()();
            }
        };

        for (i = 0; i < episodesURLs.length; i++) {
            const filename = `${filmName} - S${String(seasonNumber).padStart(2, '0')}E${String(i + 1).padStart(2, '0')}.mp4`;
            console.log('Downloading', filename, episodesURLs[i]);
            let downloader = beginDownload(episodesURLs[i], filename, startNewDownload);
            downloadPool.push(downloader);
        }

        downloadPool.splice(0, 3).forEach((download) => {
            download();
        });
    }

    const changeLastVideo = (new_link) => {
        let endIndex = new_link.search(/\.mp4/);
        lastVideoURL = new_link.substring(0, endIndex + 4);
    }

    const warningText = $("<p/>", {
        text: "Please start the video playback to capture the URL"
    }).css({ display: "none", color: "white" });

    const downloadButton = $('<button/>', {
        text: "Download current episode",
        click: downloadCurrentEpisode
    }).css(buttonCSS);

    var showMbits = false;

    const speedTypeButton = $('<button/>', {
        text: "MB/s"
    }).css(buttonCSS);
    speedTypeButton.click(() => {
        showMbits = !showMbits;
        speedTypeButton.text(showMbits ? "MiB/s" : "MB/s");
    });

    const downloadSeasonButton = $('<button/>', {
        text: "Download current season",
        click: downloadCurrentSeason
    }).css(buttonCSS);

    $("#user-network-issues").before(downloadButton);
    if (isSeries()) {
        downloadButton.after(downloadSeasonButton);
        downloadSeasonButton.after(speedTypeButton);
    }
    downloadButton.after(warningText);

    const regex = new RegExp('stream.voidboost.cc*');
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", () => {
            if (regex.test(this.responseURL)) {
                changeLastVideo(this.responseURL);
            }
        }, false);
        open.apply(this, arguments);
    };

})(XMLHttpRequest.prototype.open);