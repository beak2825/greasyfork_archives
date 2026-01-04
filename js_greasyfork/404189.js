// ==UserScript==
// @name        Better Gallections
// @version     4.0.1
// @description Do horizontal folders bother you? What about those huge titles and wasted space?
// @author      Valognir (https://www.deviantart.com/valognir)
// @namespace   https://greasyfork.org/en/scripts/404189-better-gallections
// @grant       GM_addStyle
// @run-at      document-start

// @match       https://www.deviantart.com/*
// @exclude     https://www.deviantart.com/_nsfgfb/?realEstateId=*

// @downloadURL https://update.greasyfork.org/scripts/427723/Better%20Gallections.user.js
// @updateURL https://update.greasyfork.org/scripts/427723/Better%20Gallections.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var folderlinks;
    var folderscontainer;

    function changeLayout() {
        folderscontainer = folderlinks[0].parentNode.parentNode;
        folderscontainer.style.width = '250px';
        folderscontainer.style.height = 'calc(100vh - 140px)';
        folderscontainer.style.maxHeight = 'calc(100vh - 121px)';
        folderscontainer.style.overflow = 'hidden scroll';
        folderscontainer.style.scrollbarWidth = 'thin';
        folderscontainer.style.scrollbarColor = 'rgba(155, 155, 155, 0.5) transparent';
        folderscontainer.style.display = 'inline-block';
        folderscontainer.style.verticalAlign = 'top';

        var folderssection = folderscontainer.parentNode;
        folderssection.style.width = '250px';
        folderssection.style.margin = '-39px 0 0 -290px';
        folderssection.style.padding = '0 8px 0 0';
        folderssection.style.overflow = 'hidden';
        folderssection.style.float = 'left';
        folderssection.style.height = 'auto';
        folderssection.style.position = 'sticky';
        folderssection.style.top = '130px';

        if (folderssection.parentNode.id === 'content') {
            folderssection.parentNode.parentNode.removeAttribute("style");
        }

        var contentcontainer = folderssection.parentNode;
        contentcontainer.style.width = 'calc(100% - 290px)';
        contentcontainer.style.minHeight = '100vh';
        contentcontainer.style.marginLeft = '290px';

        var lrbuttons = folderssection.querySelectorAll('button[aria-hidden="true"]');
        lrbuttons.forEach(function(element) {
            element.style.display = 'none'
        });

        folderlinks.forEach(function(element) {

            if (element.querySelector('span:last-child')) {
                if (element.querySelector('span:last-child').textContent.trim() === "0 deviations") {
                    element.style.opacity = '0.5';
                }
            }

            var folder = element.parentNode;
            folder.style.margin = '0 0 16px';
            folder.style.overflow = 'hidden';

            if (!element.classList.contains('BGclickerAttached')) {

                element.classList.add('BGclickerAttached');
                element.addEventListener("click", function() {
                    window.scrollTo(0, 335);
                });
            }

            if (element.querySelector('img')) { // Thumbnail
                var folderimg = element.querySelector('img');
                folderimg.style.height = '227px';
            } else if (element.querySelector('section')) { // Text
                folderimg = element.querySelector('section');
                folderimg.style.height = '210px';
                folderimg.style.paddingTop = '30px';
                folderimg.style.justifyContent = 'flex-start';
            } else if (element.querySelector('div > div > div[style]')) { // Empty
                folderimg = element.querySelector('div > div > div[style]');
                folderimg.style.height = '227px';
            }
            if (folderimg) {
                folderimg.style.width = '248px';
                var folderimgcontainer = folderimg.parentNode;
                folderimgcontainer.style.width = '248px';
                folderimgcontainer.style.height = '210px';
                folderimgcontainer.style.borderRadius = '4px';
            }

            var foldertitle = element.firstElementChild.lastElementChild;
            foldertitle.style.margin = '-60px 0 0 0';
            foldertitle.style.textShadow = `0 0 5px ${bgcolor}`;
            var bgcolor = getComputedStyle(foldertitle).getPropertyValue('--g-bg-secondary');
            foldertitle.firstElementChild.style.padding = '4px 10px';
            foldertitle.firstElementChild.style.background = `linear-gradient(132deg, ${bgcolor} 0%, ${bgcolor}40 70%, transparent 88%)`;
            element.firstElementChild.style.padding = '0';

            var ughlit = element.querySelector('section[data-type="nano"]');
            if (ughlit) {
                console.log("AAAAA");
                ughlit.style.paddingTop = "0px";
                ughlit.querySelector('div:last-child>div:last-child').style.fontSize = '14px';
                ughlit.querySelector('div:last-child>div:last-child').style.marginTop = '15px';
                ughlit.querySelector('div:last-child>div:last-child').style.display = "-webkit-box";
                ughlit.querySelector('div:last-child>div:last-child').style.webkitBoxOrient = "vertical";
                ughlit.querySelector('div:last-child>div:last-child').style.webkitLineClamp = "2";
                ughlit.querySelector('div:last-child>div:last-child').style.textOverflow = 'ellipsis';
                ughlit.querySelector('div:first-child').style.flex = 'unset';
                ughlit.querySelector('div:first-child').style.height = '50px';
                ughlit.querySelector('div:first-child h3').style.fontSize = '20px';
            }
        });
    }

    function waitForFolders() {
        folderlinks = document.querySelectorAll('section>a[href*="/gallery/"], section>a[href*="/favourites/"], section>a[href*="/private-collections/"]');
        if (folderlinks.length > 0) {
            changeLayout();
        } else {
            setTimeout(waitForFolders, 100);
        }
    }

    function onmutation(mutations) {
        checkForGallection();
    }

    function checkForGallection() {
        if (window.location.pathname.includes("/gallery") || window.location.pathname.includes("/favourites") || window.location.pathname.includes("/private-collections")) {
            waitForFolders();
        }
    }

    checkForGallection();
    document.addEventListener("click", () => {
        setTimeout(() => {
            checkForGallection();
        }, 100);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {

            setTimeout(() => {
                checkForGallection();
            }, 100);
        }
    });

    window.addEventListener('popstate', function (event) {
        setTimeout(() => {
            checkForGallection();
        }, 100);
    });

    window.addEventListener('popstate', function (event) {
        setTimeout(() => {
            checkForGallection();
        }, 100);
    });
})();