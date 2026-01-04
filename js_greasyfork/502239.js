// ==UserScript==
// @name         Download Youtube Custom Emojis
// @namespace    https://greasyfork.org/en/scripts/502239-download-youtube-custom-emojis
// @version      0.9
// @description  Add a button to download emojis and badges!
// @author       ATPPP3
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502239/Download%20Youtube%20Custom%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/502239/Download%20Youtube%20Custom%20Emojis.meta.js
// ==/UserScript==


(function () {
    function dlBadges(name, elems) {
        downloadImages(getImagesForNotMembership(elems, false), name, 'Badge');
    }

    //Download emojis
    function dlEmojis(name, elems) {
        downloadImages(getImagesForNotMembership(elems, false), name, 'Emoji');
    }

    function dlBadgesMem(name, elems) {
        downloadImages(getImagesForMembershipBadges(elems, false), name, 'Badge');
    }

    //Download emojis
    function dlEmojisMem(name, elems) {
        downloadImages(getImagesForMembershipEmojis(elems, false), name, 'Emoji');
    }

    function notMembership() {
        console.log("nonMembership");
        let Channel = document.querySelectorAll('#page-header h1 > span')[0].textContent;
        let PerksContainer = document.querySelectorAll('#perks_section #perks ytd-sponsorships-perk-renderer #container #images-line');
        let Badges = PerksContainer[0]; //Badges element selector
        let Emojis = PerksContainer[1]; //Emojis element selector

        if (!Badges || !Emojis) return;
        //download button style
        let btnStyle = "margin-bottom:5px; border-radius: 15px; background-color: #3ea6ff; color: #000000; font-size: 16px; border: none; height: 32px; cursor: pointer;";

        //Insert Download Button
        Badges.insertAdjacentHTML("beforebegin", "<button id=\"badges-dl\" style=\"" + btnStyle + "\">Download</button>");
        Emojis.insertAdjacentHTML("beforebegin", "<button id=\"emojis-dl\" style=\"" + btnStyle + "\">Download</button>");

        //Handle Button Click
        document.getElementById('badges-dl').addEventListener('click', dlBadges.bind(null, Channel, Badges));
        document.getElementById('emojis-dl').addEventListener('click', dlEmojis.bind(null, Channel, Emojis));
    }

    function isMembership() {
        console.log("isMembership");
        let Channel = document.querySelectorAll('#page-header h1 > span')[0].textContent;
        let Badges = document.querySelectorAll('#container .badge-container .badge-icon'); //Badges element selector
        let Emojis = document.querySelectorAll('#container #images-line')[0].getElementsByTagName('img') //Emojis element selector

        //download button style
        let btnStyle = "margin-bottom:5px; border-radius: 15px; background-color: #3ea6ff; color: #000000; font-size: 16px; border: none; height: 32px; cursor: pointer;";

        //Insert Download Button
        document.querySelectorAll('#container .badge-container')[0].insertAdjacentHTML("afterend", "<button id=\"badges-dl\" style=\"" + btnStyle + "\">Download</button>")
        document.querySelectorAll('#container #images-line')[0].insertAdjacentHTML("beforebegin", "<button id=\"emojis-dl\" style=\"" + btnStyle + "\">Download</button>")

        //Handle Button Click
        document.getElementById('badges-dl').addEventListener('click', dlBadgesMem.bind(null, Channel, Badges));
        document.getElementById('emojis-dl').addEventListener('click', dlEmojisMem.bind(null, Channel, Emojis));
    }


    setInterval(function () {
        console.log("started")
        try {
            //Check if membership join button clicked
            let PerksPopupHidden = document.querySelectorAll('ytd-popup-container > tp-yt-paper-dialog')[0].getAttribute('aria-hidden');
            if (PerksPopupHidden) {
                document.getElementById('badges-dl').remove();
                document.getElementById('emojis-dl').remove();
                return;
            }
        } catch (err) {
            try {
                let PerksButtonStatus = !!document.querySelectorAll('#contents .expand-collapse-button button[aria-label="Show perks info"]')[0];
                if (PerksButtonStatus) {
                    document.getElementById('badges-dl').remove();
                    document.getElementById('emojis-dl').remove();
                    return;
                }
            } catch (err) {
                return;
            }
        }


        console.log("check end");
        //Create a download Button if not exists
        let perksShowed = !!0;
        if (!document.getElementById('badges-dl') && !document.getElementById('emojis-dl')) {
            let membership = document.querySelectorAll('#tabsContent .yt-tab-shape-wiz[tab-identifier="TAB_ID_SPONSORSHIPS"]');
            if (membership) {
                perksShowed = !!document.querySelectorAll('#contents .expand-collapse-button button[aria-label="Hide perks info"]')[0];
            }

            if (perksShowed) {
                isMembership();
            } else {
                notMembership();
            }
        }
    }, 1000);


    //get all emojis/badges image url
    const getImagesForNotMembership = (el, includeDuplicates = false) => {
        console.log("getImg non");
        let eles = [...el.getElementsByTagName('img')];
        let srcs = eles.map(img =>img.getAttribute('src'));
        let images = [...srcs].map(src=>src.split('=')[0]);
        return includeDuplicates ? images : [...new Set(images)];
    };
    //get all emojis/badges image url
    const getImagesForMembershipBadges = (el, includeDuplicates = false) => {
        console.log("get badges ismem");
        let Badges = [...el].map(el => el.getElementsByTagName('img')[0]).map(img => img.getAttribute('src').split('=')[0]);
        return includeDuplicates ? Badges : [...new Set(Badges)];
    };
    const getImagesForMembershipEmojis = (el, includeDuplicates = false) => {
        console.log("get emojis ismem");
        let Emojis = [...el].map(el => el.getAttribute('src').split('=')[0]); //Emojis element selector
        return includeDuplicates ? Emojis : [...new Set(Emojis)];
    };

    function downloadImages(urls, name, type) {
        let filename = name + '.zip';
        try{
            JSZipDownload(urls, filename, type);
        }catch(err){
            let delay = 100;
            let target = document.querySelectorAll('ytd-popup-container > tp-yt-paper-dialog')[0];
            if(!target){target = document.body;}
            downloadImagesWithDelay(urls, name, type, delay, target);
        }

    }

    function JSZipDownload(urls, filename, type) {
        console.log("jszip");
        let zip = new JSZip();

        let interval = 500;

        urls.forEach(function (url, i) {
            const name = `${type}_${i}.png`;
            JSZipUtils.getBinaryContent(url, function (err, data) {
                if (err) {
                    throw err; // or handle the error
                }
                zip.file(name, data, {binary: true});
                if (i === urls.length - 1) {
                    setTimeout(() => {
                        zip.generateAsync({type: 'blob'}).then(function (content) {
                            saveAs(content, filename);
                        })
                    }, interval);
                } else {
                    clearInterval(interval); // Stop interval when done
                }
            })
        })

    }
    function backupDownloadImage(url, filename, target) {
        return fetch(url)
            .then(response => response.blob())
            .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            target.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            target.removeChild(a);
        })
            .catch(() => console.error('An error occurred while downloading the image.'));
    }

    function downloadImagesWithDelay(urls, name, type, delay, target) {
        let index = 0;

        function downloadNext() {
            if (index < urls.length) {
                const url = urls[index];
                const filename = `${name}_${type}_${index + 1}.png`;
                backupDownloadImage(url, filename, target);
                index++;
                setTimeout(downloadNext, delay); // Schedule next download
            }
        }

        downloadNext(); // Start the process
    }


})();

