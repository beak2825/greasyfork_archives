// ==UserScript==
// @name         A Simple Web Navigation Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.5.5
// @description  You can quickly access the previous and next episodes, perform smooth scrolling up or down, and even enable or disable full-screen mode. This script is designed to enhance the reading experience of web content in a more convenient and customizable.
// @match        https://westmanga.me/*
// @match        https://komikcast03.com/*
// @match        https://aquareader.net/*
// @match        https://www.webtoons.com/*
// @match        https://kiryuu03.com/*
// @match        https://mangaku.lat/*
// @match        https://manhwatop.com/*
// @match        https://komiku.org/*
// @match        https://www.mikoroku.com/*
// @match        https://mangadex.org/chapter/*
// @match        https://mangatoto.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476625/A%20Simple%20Web%20Navigation%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/476625/A%20Simple%20Web%20Navigation%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isFullscreen = false;
    var activeElement;

    let scrollingUp = false; // Is "W" key held down?
    let scrollingDown = false; // Is "S" key held down?
    let momentumUp = 0; // Momentum for scrolling up
    let momentumDown = 0; // Momentum for scrolling down
    const maxMomentum = 80; // Maximum scroll speed
    const momentumDecay = 0.0; // Rate of momentum decay
    let scrollInterval; // Reference to the scroll loop

    const HOSTS = {
        'westmanga.me': {
            next: 'div.max-w-screen-xl:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button:nth-child(2)',
            prev: 'div.max-w-screen-xl:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)'
        },
        'komikcast03.com': {
            next: '.nextprev a[rel="next"]',
            prev: '.nextprev a[rel="prev"]'
        },
        'www.webtoons.com': {
      	    next: '.paginate .pg_next',
	          prev: '.paginate .pg_prev'
		    },
        'aquareader.net': {
            next: 'a.btn.next_page',
            prev: 'a.btn.prev_page'
        },
        'kiryuu03.com': {
            next: 'a.justify-center:nth-child(3)',
            prev: 'a.px-4:nth-child(1)'
        },
        'mangaku.lat': {
            prev: 'button.glho.glkp_1:-soup-contains("PREV")',
            next: 'button.glho.glkn_1:-soup-contains("NEXT")'
        },
        'manhwatop.com': {
            prev: '.prev_page',
            next: '.next_page'
        },
        'komiku.org': {
            prev: 'div.nxpr > a.rl:first-of-type',
            next: 'div.nxpr > a.rl:last-of-type'
        },
        'mangadex.org': {
            prev: '',
            next: ''
        },
        'mangatoto.com': {
            prev: 'a.btn.btn-sm.btn-outline.btn-primary:nth-of-type(1)',
            next: 'a.btn.btn-sm.btn-outline.btn-primary:nth-of-type(2)'
        },
        'www.mikoroku.com': {
            prev: 'a[rel="prev"][type="button"]',
            next: 'a[rel="next"][type="button"]'
        }
    };

    let btnNext, btnPrev;
    let host = window.location.host;
    if (HOSTS[host]) {
        btnNext = HOSTS[host].next;
        btnPrev = HOSTS[host].prev;
    }

    const zoomLevel = () => {
        return document.body.style.zoom || 1;
    }

    // Function to start scrolling (up or down)
    function startScrolling(direction) {
        if ((direction === "up" && !scrollingUp) || (direction === "down" && !scrollingDown)) {
            if (direction === "up") scrollingUp = true;
            if (direction === "down") scrollingDown = true;

            clearInterval(scrollInterval); // Clear any existing scroll loop

            // Momentum-based scrolling loop
            scrollInterval = setInterval(() => {
                // Increase momentum if scrolling in a direction
                if (scrollingUp) {
                    momentumUp = Math.min(momentumUp + 8, maxMomentum);
                } else {
                    momentumUp *= momentumDecay; // Decay momentum if "W" is released
                }

                if (scrollingDown) {
                    momentumDown = Math.min(momentumDown + 8, maxMomentum);
                } else {
                    momentumDown *= momentumDecay; // Decay momentum if "S" is released
                }

                // Stop the interval if both momentums are negligible
                if (momentumUp < 1 && momentumDown < 1) {
                    clearInterval(scrollInterval);
                    return;
                }

                // Perform the scroll action
                const netMomentum = momentumDown - momentumUp; // Net scrolling direction
                $('html, body').scrollTop($(window).scrollTop() + netMomentum);
            }, 30); // Adjust interval for smooth updates
        }
    }

    // Function to stop scrolling (up or down)
    function stopScrolling(direction) {
        if (direction === "up") scrollingUp = false;
        if (direction === "down") scrollingDown = false;
    }

    // Event listener for "keydown"
    $(document).on('keydown', function (e) {
        if ((e.key === "w" || e.key === "W") && !scrollingUp && !e.ctrlKey && !e.altKey && e.key !== 'Tab') {
			// Periksa elemen yang sedang dalam fokus
            activeElement = document.activeElement;
			if (!(activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'))) {
                // Pengguna tidak sedang mengetik
				e.preventDefault(); // Prevent default behavior
				startScrolling("up"); // Start scrolling up
			}
        }
        if ((e.key === "s" || e.key === "S") && !scrollingDown && !e.ctrlKey && !e.altKey && e.key !== 'Tab') {
			// Periksa elemen yang sedang dalam fokus
            activeElement = document.activeElement;
			if (!(activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'))) {
                // Pengguna tidak sedang mengetik
				e.preventDefault(); // Prevent default behavior
				startScrolling("down"); // Start scrolling down
			}
        }
    });

    // Event listener for "keyup"
    $(document).on('keyup', function (e) {
        if ((e.key === "w" || e.key === "W") && !e.ctrlKey && !e.altKey && e.key !== 'Tab') {
			// Periksa elemen yang sedang dalam fokus
            activeElement = document.activeElement;
			if (!(activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'))) {
                // Pengguna tidak sedang mengetik
				e.preventDefault(); // Prevent default behavior
				stopScrolling("up"); // Stop scrolling up
			}
        }
        if ((e.key === "s" || e.key === "S") && !e.ctrlKey && !e.altKey && e.key !== 'Tab') {
			// Periksa elemen yang sedang dalam fokus
            activeElement = document.activeElement;
			if (!(activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'))) {
                // Pengguna tidak sedang mengetik
				e.preventDefault(); // Prevent default behavior
				stopScrolling("down"); // Stop scrolling down
			}
        }
    });

    document.addEventListener('keydown', function(event) {
        if ((event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') && !event.ctrlKey && !event.altKey && event.key !== 'Tab') {
            let prevButton = document.querySelector(btnPrev);
            if (prevButton) {
                // Periksa elemen yang sedang dalam fokus
                activeElement = document.activeElement;
                if (!(activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'))) {
                // Pengguna tidak sedang mengetik
                    prevButton.click();
                }
            }
        } else if ((event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') && !event.ctrlKey && !event.altKey && event.key !== 'Tab') {
            let nextButton = document.querySelector(btnNext);
            if (nextButton) {
                // Periksa elemen yang sedang dalam fokus
                activeElement = document.activeElement;
                if (!(activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'))) {
                    // Pengguna tidak sedang mengetik
                    nextButton.click();
                }
            }
        } else if ((event.key === 'f' || event.key === 'F') && !event.ctrlKey && !event.altKey && event.key !== 'Tab') {
            // Periksa elemen yang sedang dalam fokus
            activeElement = document.activeElement;
            if (!(activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'))) {
                // Pengguna tidak sedang mengetik, masuk ke mode fullscreen
                event.preventDefault();
                toggleFullscreen(); // Fungsi Anda untuk masuk/keluar dari mode fullscreen
            }
        } else if ((event.key === 'q' || event.key === 'Q') && !event.ctrlKey && !event.altKey && event.key !== 'Tab') {
            var allChapterButton;
            if (window.location.host === 'westmanga.me') {
                allChapterButton = document.querySelector('.text-primary');
            } else if (window.location.host === 'www.webtoons.com') {
                allChapterButton = document.querySelector('.subj_info .subj');
            } else if (window.location.host === 'kiryuu03.com') {
		allChapterButton = document.querySelector('button.ring-offset-accent');
            } else if (window.location.host === 'komikcast03.com') {
                allChapterButton = document.querySelector('div.allc a');
            } else if (window.location.host === 'manhwatop.com') {
                allChapterButton = document.querySelector('ol.breadcrumb li:nth-child(2) a');
            } else if (window.location.host === 'www.mikoroku.com') {
                allChapterButton = document.querySelector('a[rel="home"][type="button"]');
            } else if (window.location.host === 'mangatoto.com') {
                allChapterButton = document.querySelector('h3.text-xl.font-bold.space-x-2 > a.link-pri.link-hover');
            } else if (window.location.host === 'aquareader.net') {
                allChapterButton = document.querySelector('.breadcrumb > li:nth-child(2) > a:nth-child(1)');
            } else if (window.location.host === 'komiku.org') {
                allChapterButton = document.querySelector('#Description > a:nth-child(3)');
            }
            if (allChapterButton) {
                // Periksa elemen yang sedang dalam fokus
                activeElement = document.activeElement;
                if (!(activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'))) {
                    // Pengguna tidak sedang mengetik
                    allChapterButton.click();
                }
            }
        }
    });

    function toggleFullscreen() {
        if (!isFullscreen) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
        isFullscreen = !isFullscreen;
    }

    function enterFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }

    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
})();
