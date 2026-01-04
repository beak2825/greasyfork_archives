// ==UserScript==
// @name         Quick DVD
// @namespace    sportshead.dev
// @version      0.6
// @description  Helps you to quickly use all your nerve copying DVDs
// @author       sportzpikachu [2413105]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523720/Quick%20DVD.user.js
// @updateURL https://update.greasyfork.org/scripts/523720/Quick%20DVD.meta.js
// ==/UserScript==
/* global $ isMobileMedia */
(() => {
    const GENRES = [
        "",
        "Action",
        "Comedy",
        "Drama",
        "Fantasy",
        "Horror",
        "Romance",
        "Thriller",
        "Sci-Fi",
    ];
    const MODES = ["SEQ", "LST"]; // in case new algorithms for calculating the genre

    let observer;

    const oldFetch = window.fetch;
    const newFetch = async (...args) => {
        const res = await oldFetch(...args);

        if (
            window.location.hash === "#/bootlegging" &&
            args[0]?.includes("crimesData")
        ) {
            try {
                const copy = res.clone();

                const obj = await res.json();

                const cds = { ...obj.DB.generalInfo.CDs };
                obj.DB.crimesByType[0].additionalInfo.currentQueue.forEach(
                    (c) => cds[c]++,
                );

                let least = cds[1];
                let genre = 1;

                for (let i = 2; i < 9; i++) {
                    if (cds[i] < least) {
                        least = cds[i];
                        genre = i;
                    }
                }

                console.log(cds, least, genre);
                localStorage.quickdvdLeast = genre;
                if (localStorage.quickdvdMode === "LST") {
                    $("#quickdvd_i").text(
                        isMobileMedia()
                            ? GENRES[genre].charAt(0)
                            : GENRES[genre],
                    );
                }
                return copy;
            } catch (e) {
                console.error(e);
            }
        }
        return res;
    };

    function attach() {
        localStorage.quickdvd ??= 1;
        localStorage.quickdvdLeast ??= 0;
        localStorage.quickdvdMode ??= "SEQ";
        $('.crimeOptionSection___hslpu:contains("Copy DVDs")').html(
            `<a id="quickdvd" style="cursor: pointer; color: var(--default-blue-color);">${getHTML()}</a><span>&nbsp;&nbsp;-&nbsp;&nbsp;</span></span><a id="quickdvdMode" style="cursor:pointer; color: var(--default-orange-color)">${
                isMobileMedia() ? "Mode" : "Switch mode"
            }</a>`,
        );
        $("#quickdvd").on("click", () => {
            newFetch(
                `https://www.torn.com/loader.php?sid=crimesData&step=attempt&value1=${
                    {
                        SEQ: localStorage.quickdvd,
                        LST: localStorage.quickdvdLeast,
                    }[localStorage.quickdvdMode]
                }&typeID=2&crimeID=8&rfcv=${
                    document.cookie
                        .split("; ")
                        .map((c) => c.split("="))
                        .find(([k]) => k === "rfc_v")?.[1]
                }`,
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                    },
                },
            );
            if (localStorage.quickdvdMode === "SEQ") {
                if (++localStorage.quickdvd > 8) {
                    localStorage.quickdvd = 1;
                }
                $("#quickdvd_i").text(GENRES[localStorage.quickdvd]);
            }
        });
        $("#quickdvdMode").on("click", () => {
            localStorage.quickdvdMode =
                MODES[
                    (MODES.indexOf(localStorage.quickdvdMode) + 1) %
                        MODES.length
                ];
            $("#quickdvd").html(getHTML());
        });
    }
    function getHTML() {
        if (isMobileMedia()) {
            const genre =
                GENRES[
                    {
                        SEQ: localStorage.quickdvd,
                        LST: localStorage.quickdvdLeast,
                    }[localStorage.quickdvdMode]
                ];
            return `Copy ${localStorage.quickdvdMode} (${genre.charAt(0)})`;
        } else {
            if (localStorage.quickdvdMode === "SEQ") {
                return `Copy in sequence (<span id="quickdvd_i">${
                    GENRES[localStorage.quickdvd]
                }</span>)`;
            } else if (localStorage.quickdvdMode === "LST") {
                return `Copy least stocked (<span id="quickdvd_i">${
                    GENRES[localStorage.quickdvdLeast]
                }</span>)`;
            }
        }
    }

    function inject() {
        if ($('.crimeOptionSection___hslpu:contains("Copy DVDs")').length) {
            attach();
        } else {
            observer = new MutationObserver(() => {
                if (
                    $('.crimeOptionSection___hslpu:contains("Copy DVDs")')
                        .length
                ) {
                    observer.disconnect();
                    attach();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    }

    function hashHandler() {
        if (window.location.hash === "#/bootlegging") {
            window.fetch = newFetch;
            inject();
        } else {
            observer?.disconnect?.();
            window.fetch = oldFetch;
        }
    }
    window.addEventListener("hashchange", hashHandler);
    if (window.location.hash === "#/bootlegging") {
        window.fetch = newFetch;
        inject();
    }

    window.addEventListener("storage", function (e) {
        if (e.key === "quickdvd") {
            $("#quickdvd_i").text(GENRES[localStorage.quickdvd]);
        } else if (e.key === "quickdvdMode") {
            $("#quickdvd").html(getHTML());
        } else if (e.key === "quickdvdLeast") {
            $("#quickdvd_i").text(GENRES[localStorage.quickdvdLeast]);
        }
    });
})();