// ==UserScript==
// @name         PTP - Add & Filter All Releases
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  add releases from other trackers
// @author       passthepopcorn_cc
// @match        https://passthepopcorn.me/torrents.php?id=*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/483165/PTP%20-%20Add%20%20Filter%20All%20Releases.user.js
// @updateURL https://update.greasyfork.org/scripts/483165/PTP%20-%20Add%20%20Filter%20All%20Releases.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////                                   USER OPTIONS                     ////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const trackers = [/*"BHD", */"BLU", "Aither", "RFX", "OE",/* "CG",*/ "FL",/* "HDB", "KG",*/ "PTP"]; // if you dont want to get results from some of these trackers, remove them. it will make the code run faster

    const BLU_API_TOKEN =
        ""; // optional, if you use your BLU api key,
    // code will run faster. Find your api key here: https:/blutopia.cc/users/YOUR_USERNAME_HERE/settings/security

    const AITHER_API_TOKEN =
        ""; // optional, if you use your Aither api key,
    // code will run faster. Find your api key here: https:/aither.cc/users/YOUR_USERNAME_HERE/apikeys

    const RFX_API_TOKEN =
        ""; // optional, if you use your RFX api key,
    // code will run faster. Find your api key here: https:/reelflix.xyz/users/YOUR_USERNAME_HERE/apikeys

    const OE_API_TOKEN =
        ""; // optional, if you use your OE api key,
    // code will run faster. Find your api key here: https:/onlyencodes.cc/users/YOUR_USERNAME_HERE/apikeys

    const hide_blank_links = true; // false = will also create blank [PL] [RP] links ||| true = will only show [DL] link

    const show_tracker_icon = true; // false = will show default green checked icon ||| true = will show tracker logo instead of checked icon

    const hide_dead_external_torrents = false; // true = won't display dead external torrents

    const open_in_new_tab = true; // false : when you click external torrent, it will open the page in new tab. ||| true : it will replace current tab.

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let discounts = [
        "Freeleech",
        "75% Freeleech",
        "50% Freeleech",
        "25% Freeleech",
        "Refundable",
        "Rewind",
        "Rescuable",
        "No discount",
    ];
    let qualities = ["SD", "480p", "576p", "720p", "1080p", "2160p"];

    let filters = {
        trackers: trackers.map((e) => {
            return { name: e, status: "default" };
        }),

        discounts: discounts.map((e) => {
            return { name: e, status: "default" };
        }),

        qualities: qualities.map((e) => {
            return { name: e, status: "default" };
        }),
    };

    let doms = [];

    const dom_get_quality = (text) => {
        if (text.includes("720p")) return "720p";
        else if (text.includes("1080p")) return "1080p";
        else if (text.includes("2160p")) return "2160p";
        else if (text.includes("576p")) return "576p";
        else if (text.includes("480p")) return "480p";
        else return "SD";
    };

    const get_default_doms = () => {
        [...document.querySelectorAll("tr.group_torrent_header")].forEach(
            (d, i) => {
                let tracker = "PTP";
                let dom_path = d;
                let quality = dom_get_quality(d.textContent);
                let discount = "No discount";
                let info_text = d.textContent;
                let seeders = parseInt(
                    d.querySelector("td:nth-child(4)").textContent.replace(",", "")
                );
                let leechers = parseInt(
                    d.querySelector("td:nth-child(5)").textContent.replace(",", "")
                );
                let snatchers = parseInt(
                    d.querySelector("td:nth-child(3)").textContent.replace(",", "")
                );

                let size = d.querySelector("td:nth-child(2)").textContent.trim();

                if (size.includes("GiB"))
                    size = (parseFloat(size.split(" ")[0]) * 1024).toFixed(2);
                else if (size.includes("MiB"))
                    size = parseFloat(size.split(" ")[0]).toFixed(2);
                else size = 1;

                let dom_id = "ptp_" + i;

                d.className += " " + dom_id; // required for re-render, nice fix

                doms.push({
                    tracker,
                    dom_path,
                    quality,
                    discount,
                    info_text,
                    seeders,
                    leechers,
                    snatchers,
                    dom_id,
                    size,
                });
            }
        );
    };

    get_default_doms();

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    const get_discount_text = (div, tracker) => {
        if (tracker === "HDB") {
            if (div.querySelector("b > a").title.includes("50% Free Leech"))
                return "50% Freeleech";
            else if (div.querySelector("b > a").title.includes("25% Free Leech"))
                return "25% Freeleech";
            else if (div.querySelector("b > a").title.includes("Neutral Leech"))
                return "Neutral Leech";
            else if (div.querySelector("b > a").title.includes("100% FL"))
                return "Freeleech";
        } else if (tracker === "BHD") {
            if (div.querySelector("i.fa-peace") != null)
                return "Freeleech"; // limited FL, with 1.0 upload cap.
            else if (div.querySelector("i.fa-popcorn") != null)
                return "Rewind"; // limited FL, until there are enough seeders?
            else if (div.querySelector("i.text-refund") != null) return "Refundable";
            else if (div.querySelector("i.fa-life-ring") != null)
                return "Rescuable"; // limited FL, until there are enough seeders=
            else {
                // eğer fl varsa

                let discount = [...div.querySelectorAll("i.fa-star")].find((i) => {
                    return (
                        i.getAttribute("title") != null &&
                        i.getAttribute("title").includes("Free")
                    );
                });

                //[...div.querySelectorAll("i.fa-star")].forEach(a => console.log(a));

                if (discount === undefined) return "No discount";
                else {
                    let discount_value = discount.getAttribute("title").split(" ")[0]; // returns 50%
                    if (discount_value === "100%") return "Freeleech";
                    else return discount_value + " Freeleech";
                }
            }
        } else if (tracker === "BLU") {
            if (BLU_API_TOKEN != "") return true; // objede bu özellik zaten var,apiden geldi
        } else if (tracker === "Aither") {
            if (AITHER_API_TOKEN != "") return true; // objede bu özellik zaten var,apiden geldi
        } else if (tracker === "RFX") {
            if (RFX_API_TOKEN != "") return true; // objede bu özellik zaten var,apiden geldi
        } else if (tracker === "OE") {
            if (OE_API_TOKEN != "") return true; // objede bu özellik zaten var,apiden geldi
        } else if (tracker === "FL") {
            if (
                [...div.querySelectorAll("img")].find((e) => e.alt === "FreeLeech") !=
                undefined
            )
                return "Freeleech";
        } else if (tracker === "CG") {
            if (
                [...div.querySelectorAll("img")].find((e) => e.alt === "100% bonus") !=
                undefined
            )
                return "Freeleech";
        }

        return "No discount";
    };

    const get_tracker_icon = (tracker) => {
        if      (tracker === "BHD")     return "https://beyond-hd.me/favicon.ico";
        else if (tracker === "ANT")     return "https://anthelion.me/favicon.ico";
        else if (tracker === "BLU")     return "https://blutopia.cc/favicon.ico";
        else if (tracker === "Aither")  return "https://aither.cc/favicon.ico";
        else if (tracker === "RFX")     return "https://reelflix.xyz/favicon.ico";
        else if (tracker === "OE")      return "https://onlyencodes.cc/favicon.ico";
        else if (tracker === "CG")      return "https://cinemageddon.net/favicon.ico";
        else if (tracker === "FL")      return "https://filelist.io/favicon.ico";
        else if (tracker === "PHD")     return "https://privatehd.to/images/privatehd-favicon.png";
        else if (tracker === "CinemaZ") return "https://cinemaz.to/images/cinemaz-favicon.png";
        else if (tracker === "HDB")     return "https://hdbits.org/pic/favicon/favicon.ico";
        else if (tracker === "KG")      return "https://karagarga.in/favicon.ico";
    };

    const use_api_instead = (tracker) => {
      if (
        (tracker === "BLU"    && BLU_API_TOKEN    != "") ||
        (tracker === "Aither" && AITHER_API_TOKEN != "") ||
        (tracker === "RFX"    && RFX_API_TOKEN    != "") ||
        (tracker === "OE"     && OE_API_TOKEN     != "")
      )
           return true;
      else return false;
    };

    const get_torrent_objs = (tracker, html) => {
        let torrent_objs = [];

        if (tracker === "HDB") {
            html
                .querySelector("#torrent-list > tbody")
                .querySelectorAll("tr")
                .forEach((d) => {
                    let torrent_obj = {};

                    let size = d.querySelectorAll("td")[5].textContent;

                    if (size.includes("GiB")) {
                        size = parseInt(parseFloat(size.split("GiB")[0]) * 1024); // MB
                    } else if (size.includes("MiB"))
                        size = parseInt(parseFloat(size.split("MiB")[0]));

                    torrent_obj.size = size;
                    torrent_obj.info_text = d.querySelector(
                        "td:nth-child(3) > b > a"
                    ).textContent;
                    torrent_obj.site = "HDB";
                    torrent_obj.download_link = d
                        .querySelector(".js-download")
                        .href.replace("passthepopcorn.me", "hdbits.org");
                    torrent_obj.snatch = parseInt(
                        d.querySelector("td:nth-child(7)").textContent
                    );
                    torrent_obj.seed = parseInt(
                        d.querySelector("td:nth-child(8)").textContent
                    );
                    torrent_obj.leech = parseInt(
                        d.querySelector("td:nth-child(9)").textContent
                    );
                    torrent_obj.torrent_page = [...d.querySelectorAll("a")]
                        .find((a) => a.href.includes("/details.php?id="))
                        .href.replace("passthepopcorn.me", "hdbits.org");
                    torrent_obj.status =
                        d.querySelectorAll("span.tag_seeding").length > 0
                            ? "seeding"
                            : "default";
                    torrent_obj.discount = get_discount_text(d, tracker);

                    torrent_objs.push(torrent_obj);
                });
        } else if (tracker === "BHD") {
            [
                ...html
                    .querySelector(".table-new")
                    .querySelectorAll("tr.bhd-sub-header-compact"),
            ]
                .filter((e) => !["Extras", "Specials"].includes(e.textContent.trim()))
                .forEach((d) => {
                    let torrent_obj = {};
                    let size = [...d.querySelectorAll("td")]
                        .find(
                            (e) =>
                                e.textContent.includes(" GiB") ||
                                e.textContent.includes(" MiB")
                        )
                        .textContent.trim();

                    if (size.includes("GiB")) {
                        size = parseInt(parseFloat(size.split(" ")[0]) * 1024); // MB
                    } else if (size.includes("MiB"))
                        size = parseInt(parseFloat(size.split(" ")[0]));

                    torrent_obj.size = size;
                    torrent_obj.info_text = d
                        .querySelector("a.text-compact")
                        .textContent.trim();
                    torrent_obj.site = "BHD";

                    torrent_obj.snatch = d
                        .querySelector("a.torrent-completes")
                        .textContent.trim();
                    torrent_obj.seed = d
                        .querySelector("a.torrent-seeders")
                        .textContent.trim();
                    torrent_obj.leech = d
                        .querySelector("a.torrent-leechers")
                        .textContent.trim();
                    torrent_obj.download_link = [...d.querySelectorAll("a")].find(
                        (a) => {
                            return a.title === "Download Torrent";
                        }
                    ).href;

                    torrent_obj.torrent_page = d.querySelector("a").href;

                    torrent_obj.status =
                        d.querySelectorAll("i.fa-seedling").length > 0
                            ? "seeding"
                            : "default";
                    torrent_obj.discount = get_discount_text(d, tracker);

                    torrent_objs.push(torrent_obj);
                });
        } else if (tracker === "FL") {
            html.querySelectorAll(".torrentrow").forEach((d) => {
                let torrent_obj = {};

                let size = [...d.querySelectorAll("font")].find((d) => {
                    return (
                        d.textContent.includes("[") === false &&
                        (d.textContent.includes("GB") || d.textContent.includes("MB"))
                    );
                }).textContent;

                if (size.includes("GB")) {
                    size = parseInt(parseFloat(size.split("GB")[0]) * 1024); // MB
                } else if (size.includes("MB"))
                    size = parseInt(parseFloat(size.split("MB")[0]));

                torrent_obj.size = size;
                torrent_obj.info_text = [...d.querySelectorAll("a")]
                    .find((a) => a.href.includes("details.php?id="))
                    .title.replace(/\./g, " ");
                torrent_obj.site = "FL";
                torrent_obj.snatch = parseInt(
                    d.querySelector("div:nth-child(8)").textContent.replace(/,/g, "")
                );
                torrent_obj.seed = parseInt(
                    d.querySelector("div:nth-child(9)").textContent.replace(/,/g, "")
                );
                torrent_obj.leech = parseInt(
                    d.querySelector("div:nth-child(10)").textContent.replace(/,/g, "")
                );
                torrent_obj.download_link = [...d.querySelectorAll("a")]
                    .find((a) => a.href.includes("download.php?id="))
                    .href.replace("passthepopcorn.me", "filelist.io");

                torrent_obj.torrent_page = [...d.querySelectorAll("a")]
                    .find((a) => a.href.includes("/details.php?id="))
                    .href.replace("passthepopcorn.me", "filelist.io");

                torrent_obj.status = "default";
                torrent_obj.discount = get_discount_text(d, tracker);

                torrent_objs.push(torrent_obj);
            });
        } else if (
            tracker === "BLU" ||
            tracker === "Aither" ||
            tracker === "RFX" ||
            tracker === "OE"
        ) {
            html
                .querySelector("#torrent-list-table > tbody")
                .querySelectorAll("tr")
                .forEach((d) => {
                    let torrent_obj = {};

                    let size = d
                        .querySelector(".torrent-listings-size")
                        .textContent.trim();

                    if (size.includes("GiB")) {
                        size = parseInt(parseFloat(size.split(" ")[0]) * 1024); // MB
                    } else if (size.includes("MiB"))
                        size = parseInt(parseFloat(size.split(" ")[0]));

                    torrent_obj.size = size;
                    torrent_obj.info_text = d
                        .querySelector(".torrent-listings-name")
                        .textContent.trim();
                    torrent_obj.site = tracker;
                    torrent_obj.snatch = parseInt(
                        d
                            .querySelector("td.torrent-listings-completed")
                            .textContent.trim()
                    );
                    torrent_obj.seed = parseInt(
                        d.querySelector("td.torrent-listings-seeders").textContent.trim()
                    );
                    torrent_obj.leech = parseInt(
                        d.querySelector("td.torrent-listings-leechers").textContent.trim()
                    );
                    torrent_obj.download_link = d
                        .querySelector(".torrent-listings-download")
                        .querySelector("a").href;
                    torrent_obj.torrent_page = d.querySelector("a.view-torrent").href;
                    torrent_obj.discount = get_discount_text(d, tracker);

                    torrent_objs.push(torrent_obj);
                });
        } else if (tracker === "CG") {
            let ar1 = [...html.querySelectorAll("tr.prim")];
            let ar2 = [...html.querySelectorAll("tr.sec")];
            let ar3 = [...html.querySelectorAll("tr.torrenttable_usersnatched")];

            let combined_arr = ar1.concat(ar2).concat(ar3);

            combined_arr.forEach((d) => {
                let torrent_obj = {};

                let size = d.querySelector("td:nth-child(5)").textContent;

                if (size.includes("GB")) {
                    size = parseInt(parseFloat(size.split(" ")[0]) * 1024); // MB
                } else if (size.includes("MB"))
                    size = parseInt(parseFloat(size.split(" ")[0]));
                else size = 1; // must be kiloBytes, so lets assume 1mb.

                torrent_obj.size = size;
                torrent_obj.info_text = d
                    .querySelectorAll("td")[1]
                    .querySelector("b")
                    .textContent.trim();
                torrent_obj.site = "CG";

                torrent_obj.snatch = parseInt(
                    d.querySelector("td:nth-child(6)").textContent
                );
                torrent_obj.seed = parseInt(
                    d.querySelector("td:nth-child(7)").textContent
                );
                torrent_obj.leech = parseInt(
                    d.querySelector("td:nth-child(8)").textContent
                );
                torrent_obj.download_link = [...d.querySelectorAll("a")]
                    .find((a) => a.href.includes("download.php?id="))
                    .href.replace("passthepopcorn.me", "cinemageddon.net");

                torrent_obj.torrent_page = [...d.querySelectorAll("a")]
                    .find((a) => a.href.includes("/details.php?id="))
                    .href.replace("passthepopcorn.me", "cinemageddon.net");

                torrent_obj.status = d.className.includes("torrenttable_usersnatched")
                    ? "seeding"
                    : "default";
                torrent_obj.discount = get_discount_text(d, tracker);
                torrent_objs.push(torrent_obj);
            });
        } else if (tracker === "KG") {
            html
                .querySelector("#browse > tbody")
                .querySelectorAll("tr")
                .forEach((d) => {
                    try {
                        let torrent_obj = {};

                        let size = d
                            .querySelector("td:nth-child(11)")
                            .textContent.replace(",", "");

                        if (size.includes("GB")) {
                            size = parseInt(parseFloat(size.split("GB")[0]) * 1024); // MB
                        } else if (size.includes("MB"))
                            size = parseInt(parseFloat(size.split("MB")[0]));
                        else size = 1; // must be kiloBytes, so lets assume 1mb.

                        torrent_obj.size = size;
                        torrent_obj.info_text = d
                            .querySelectorAll("td")[1]
                            .querySelector("a")
                            .textContent.trim();
                        torrent_obj.site = "KG";

                        torrent_obj.snatch = parseInt(
                            d.querySelector("td:nth-child(12)").textContent
                        );
                        torrent_obj.seed = parseInt(
                            d.querySelector("td:nth-child(13)").textContent
                        );
                        torrent_obj.leech = parseInt(
                            d.querySelector("td:nth-child(14)").textContent
                        );
                        torrent_obj.download_link = [...d.querySelectorAll("a")]
                            .find((a) => a.href.includes("/down.php/"))
                            .href.replace("passthepopcorn.me", "karagarga.in");
                        torrent_obj.torrent_page = [...d.querySelectorAll("a")]
                            .find((a) => a.href.includes("/details.php?id="))
                            .href.replace("passthepopcorn.me", "karagarga.in");

                        torrent_obj.status = d.className.includes("snatchedrow")
                            ? "seeding"
                            : "default";
                        torrent_obj.discount = get_discount_text(d, tracker);
                        torrent_objs.push(torrent_obj);
                    } catch (e) { }
                });
        }

        torrent_objs = torrent_objs.map((e) => {
            return { ...e, quality: get_torrent_quality(e) };
        });

        return torrent_objs;
    };

    const is_movie_exist = (tracker, html) => {
        // true or false

        if (tracker === "PTP") {
            if (html.querySelector("#no_results_message > div") === null) return true;
            else return false;
        } else if (tracker === "HDB") {
            if (
                html.querySelector("#resultsarea").textContent.includes("Nothing here!")
            )
                return false;
            else return true;
        } else if (tracker === "BHD") {
            if (html.querySelectorAll(".bhd-meta-box").length === 0) return false;
            else return true;
        } else if (tracker === "BLU" || tracker === "Aither" || tracker === "RFX" || tracker === "OE") {
            if (html.querySelector(".torrent-listings-no-result") === null)
                return true;
            else return false;
        } else if (tracker === "AvistaZ") {
            if (html.querySelector("#content-area > div.block > p") === null)
                return true;
            else return false;
        } else if (tracker === "PHD") {
            if (html.querySelector("#content-area > div.block > p") === null)
                return true;
            else return false;
        } else if (tracker === "CinemaZ") {
            if (html.querySelector("#content-area > div.block > p") === null)
                return true;
            else return false;
        } else if (tracker === "FL") {
            if (html.querySelectorAll(".torrentrow").length === 0) return false;
            else return true;
        } else if (tracker === "CG") {
            let ar1 = [...html.querySelectorAll("tr.prim")];
            let ar2 = [...html.querySelectorAll("tr.even")];
            let ar3 = [...html.querySelectorAll("tr.torrenttable_usersnatched")];

            let combined_arr = ar1.concat(ar2).concat(ar3);

            if (combined_arr.length > 0) return true; // farklı bu dikkat !
            else return false;
        } else if (tracker === "KG") {
            if (html.querySelector("tr.oddrow") === null)
                return false; // farklı bu dikkat !
            else return true;
        }
    };

    const fetch_tracker = async (tracker, imdb_id) => {
        return new Promise((resolve, reject) => {
            let query_url = "";
            let api_query_url = "";

            if (tracker === "PTP") {
                query_url = "https://passthepopcorn.me/torrents.php?imdb=" + imdb_id;
            } else if (tracker === "HDB") {
                //query_url = "https://hdbits.org/browse.php?c3=1&c1=1&c2=1&tagsearchtype=or&imdb=" + mov.imdb_id + "&sort=size&h=8&d=DESC"
                query_url =
                    "https://hdbits.org/browse.php?c3=1&c8=1&c1=1&c4=1&c5=1&c2=1&c7=1&descriptions=0&season_packs=0&from=&to=&imdbgt=0&imdblt=10&imdb=" +
                    imdb_id +
                    "&sort=size&h=8&d=DESC";
            } else if (tracker === "BHD") {
                query_url =
                    "https://beyond-hd.me/library/movies?activity=&q=" + imdb_id;
            } else if (tracker === "BLU") {
                query_url =
                    "https://blutopia.cc/torrents?perPage=25&imdbId=" +
                    imdb_id +
                    "&sortField=size";
                api_query_url =
                    "https://blutopia.cc/api/torrents/filter?imdbId=" +
                    imdb_id.split("tt")[1] +
                    "&categories[0]=1&api_token=" +
                    BLU_API_TOKEN;
            } else if (tracker === "Aither") {
                query_url =
                    "https://aither.cc/torrents?perPage=25&imdbId=" +
                    imdb_id +
                    "&sortField=size";
                api_query_url =
                    "https://aither.cc/api/torrents/filter?imdbId=" +
                    imdb_id.split("tt")[1] +
                    "&categories[0]=1&api_token=" +
                    AITHER_API_TOKEN;
            } else if (tracker === "RFX") {
                query_url =
                    "https://reelflix.xyz/torrents?perPage=25&imdbId=" +
                    imdb_id +
                    "&sortField=size";
                api_query_url =
                    "https://reelflix.xyz/api/torrents/filter?imdbId=" +
                    imdb_id.split("tt")[1] +
                    "&categories[0]=1&api_token=" +
                    RFX_API_TOKEN;
            } else if (tracker === "OE") {
                query_url =
                    "https://onlyencodes.cc/torrents?perPage=25&imdbId=" +
                    imdb_id +
                    "&sortField=size";
                api_query_url =
                    "https://onlyencodes.cc/api/torrents/filter?imdbId=" +
                    imdb_id.split("tt")[1] +
                    "&categories[0]=1&api_token=" +
                    OE_API_TOKEN;
            } else if (tracker === "AvistaZ") {
                query_url = "https://avistaz.to/movies?search=&imdb=" + imdb_id;
            } else if (tracker === "PHD") {
                query_url = "https://privatehd.to/movies?search=&imdb=tt" + imdb_id;
            } else if (tracker === "CinemaZ") {
                query_url = "https://cinemaz.to/movies?search=&imdb=tt" + imdb_id;
            } else if (tracker === "FL") {
                query_url =
                    "https://filelist.io/browse.php?search=" +
                    imdb_id +
                    "&cat=0&searchin=1&sort=3";
            } else if (tracker === "CG") {
                query_url =
                    "https://cinemageddon.net/browse.php?search=" +
                    imdb_id +
                    "&orderby=size&dir=DESC";
            } else if (tracker === "KG") {
                query_url =
                    "https://karagarga.in/browse.php?sort=size&search=" +
                    imdb_id +
                    "&search_type=imdb&d=DESC";
            }

            //query_url = "https://filelist.io/download.php?id="

            if (use_api_instead(tracker) === false) {
                GM_xmlhttpRequest({
                    url: query_url,
                    method: "GET",
                    timeout: 10000,
                    onload: function (response) {
                        if (response.status == 200) {
                            const parser = new DOMParser();
                            const result = parser.parseFromString(
                                response.responseText,
                                "text/html"
                            ).body; /******* THIS IS THE HTML FILE *******/

                            //console.log(result)

                            let movie_exist = is_movie_exist(tracker, result);

                            if (movie_exist === false) {
                                resolve([]);
                            } else {
                                // movie exist (not sure about exact size yet)

                                resolve(get_torrent_objs(tracker, result)); // torrent objs doner, sorted by size.
                            }
                        } else {
                            console.log(" Error: HTTP " + response.status + " Error.");
                        }
                    },
                    onerror: function () {
                        console.log("Error: Request Error.");
                    },
                    onabort: function () {
                        console.log("Error: Request is aborted.");
                    },
                    ontimeout: function () {
                        console.log("Error: Request timed out.");
                    },
                });
            } else {
                fetch(api_query_url)
                    .then((res) => {
                        res.json().then((data) => {
                            resolve(get_api_torrent_objects(tracker, data));
                        });
                    })
                    .catch(function () {
                        resolve([]);
                    });
            }
        });
    };

    const get_blu_discount = (text) => {
        if (text === "0%") return "No discount";
        else if (text === "100%") return "Freeleech";
        else return text + " Freeleech";
    };

    const get_api_torrent_objects = (tracker, json) => {
        let torrent_objs = [];

        if (
            tracker === "BLU" ||
            tracker === "Aither" ||
            tracker === "RFX" ||
            tracker === "OE"
        ) {
            torrent_objs = json.data.map((element) => {
                return {
                    size: parseInt(element.attributes.size / (1024 * 1024)),
                    info_text: element.attributes.name,
                    tracker: tracker,
                    site: tracker,
                    snatch: element.attributes.times_completed,
                    seed: element.attributes.seeders,
                    leech: element.attributes.leechers,
                    download_link: element.attributes.download_link,
                    torrent_page: element.attributes.details_link,
                    discount: element.attributes.freeleech, // birazdan değişcek. bu sadece değişik bi text
                };
            });
        }

        torrent_objs = torrent_objs.map((e) => {
            return {
                ...e,
                quality: get_torrent_quality(e),
                discount: get_blu_discount(e.discount),
            };
        });

        return torrent_objs;
    };

    const get_filtered_torrents = (quality) => {
        let all_trs = [...document.querySelectorAll("tr.group_torrent")];
        let filtered_torrents = [];

        if (quality === "SD") {
            let first_idx = all_trs.findIndex((a) =>
                a.textContent.includes("Standard Definition")
            );
            let sliced = all_trs.slice(first_idx + 1, all_trs.length);

            let last_idx = sliced.findIndex((a) => a.className === "group_torrent");
            if (last_idx === -1) last_idx = all_trs.length;
            filtered_torrents = sliced.slice(0, last_idx);
        } else if (quality === "HD") {
            let first_idx = all_trs.findIndex(
                (a) =>
                    a.textContent.includes("High Definition") &&
                    !a.textContent.includes("Ultra High Definition")
            );
            let sliced = all_trs.slice(first_idx + 1, all_trs.length);

            let last_idx = sliced.findIndex((a) => a.className === "group_torrent");
            if (last_idx === -1) last_idx = all_trs.length;
            filtered_torrents = sliced.slice(0, last_idx);
        } else if (quality === "UHD") {
            let first_idx = all_trs.findIndex((a) =>
                a.textContent.includes("Ultra High Definition")
            );
            let sliced = all_trs.slice(first_idx + 1, all_trs.length);

            let last_idx = sliced.findIndex((a) => a.className === "group_torrent");
            if (last_idx === -1) last_idx = all_trs.length;
            filtered_torrents = sliced.slice(0, last_idx);
        }

        // part 2 !

        let group_torrent_objs = [];

        filtered_torrents.forEach((t) => {
            try {
                let size_text = [...t.querySelectorAll("span")].find((s) =>
                    s.title.includes(" bytes")
                ).title;
                let size = Math.floor(
                    parseInt(size_text.split(" bytes")[0].replace(/,/g, "")) / 1024 / 1024
                );
                let dom_path = t;

                group_torrent_objs.push({ dom_path, size });
            } catch (e) { }
        });

        return group_torrent_objs;
    };

    const get_torrent_quality = (torrent) => {
        // return "UHD"

        let text = torrent.info_text.toLowerCase();

        if (text.includes("2160p")) return "UHD";
        else if (
            text.includes("1080p") ||
            text.includes("720p") ||
            text.includes("1080i") ||
            text.includes("720i")
        )
            return "HD";
        else return "SD";
    };

    const get_ref_div = (torrent, ptp_torrent_group) => {
        let my_size = torrent.size;

        try {
            // dont add after this div, add it after the hidden div !
            let div = ptp_torrent_group.find((e) => e.size < my_size).dom_path;
            let selector_id = "torrent_" + div.id.split("header_")[1];
            return document.getElementById(selector_id);
        } catch (e) {
            return false; // boyut çok küçük, grubun en başına koy.
        }
    };

    const get_ptp_format_size = (size) => {
        if (size > 1024) {
            // GiB format
            return (size / 1024).toFixed(2) + " GiB";
        } else {
            // MiB format
            return size.toFixed(2) + " MiB";
        }
    };

    const add_as_first = (div, quality) => {
        // 2gblik 1080pyi grubun en üstüne koyar.

        let all_trs = [...document.querySelectorAll("tr.group_torrent")];
        let first_idx;

        if (quality === "SD") {
            first_idx = all_trs.findIndex((a) =>
                a.textContent.includes("Standard Definition")
            );
        } else if (quality === "HD") {
            first_idx = all_trs.findIndex(
                (a) =>
                    a.textContent.includes("High Definition") &&
                    !a.textContent.includes("Ultra High Definition")
            );
        } else if (quality === "UHD") {
            first_idx = all_trs.findIndex((a) =>
                a.textContent.includes("Ultra High Definition")
            );
        }

        insertAfter(div, all_trs[first_idx]);
    };

    const get_codec = (lower, torrent) => {
        if (lower.includes("x264") || lower.includes("x.264")) return "x264 / ";
        else if (lower.includes("h264") || lower.includes("h.264"))
            return "H.264 / ";
        else if (lower.includes("x265") || lower.includes("x.265"))
            return "x265 / ";
        else if (lower.includes("h265") || lower.includes("h.265"))
            return "H.265 / ";
        else if (lower.includes("xvid") || lower.includes("x.vid"))
            return "XviD / ";
        else if (lower.includes("divx") || lower.includes("div.x"))
            return "DivX / ";
        else if (
            lower.includes("dvd5") ||
            lower.includes("dvd-5") ||
            lower.includes("dvd 5")
        )
            return "DVD5 / ";
        else if (
            lower.includes("dvd9") ||
            lower.includes("dvd-9") ||
            lower.includes("dvd 9")
        )
            return "DVD9 / ";
        else if (lower.includes("bd25") || lower.includes("bd-25"))
            return "BD25 / ";
        else if (lower.includes("bd50") || lower.includes("bd-50"))
            return "BD50 / ";
        else if (lower.includes("bd66") || lower.includes("bd-66"))
            return "BD66 / ";
        else if (lower.includes("bd100") || lower.includes("bd-100"))
            return "BD100 / ";

        return ""; // skip this info
    };

    const get_container = (lower, torrent) => {
        if (lower.includes("avi")) return "AVI / ";
        else if (lower.includes("mpg")) return "MPG / ";
        else if (lower.includes("mkv")) return "MKV / ";
        else if (lower.includes("mp4")) return "MP4 / ";
        else if (lower.includes("vob")) return "VOB / ";
        else if (lower.includes("iso")) return "ISO / ";
        else if (lower.includes("m2ts")) return "m2ts / ";

        return ""; // skip this info
    };

    const get_source = (lower, torrent) => {
        if (lower.includes("/cam")) return "CAM / ";
        else if (lower.includes("/ts")) return "TS / ";
        else if (lower.includes("/r5")) return "R5 / ";
        else if (lower.includes("vhs")) return "VHS / ";
        else if (lower.includes("web")) return "WEB / ";
        else if (lower.includes("dvd")) return "DVD / ";
        else if (lower.includes("hdtv") || lower.includes("hd-tv"))
            return "HDTV / ";
        else if (lower.includes("tv")) return "TV / ";
        else if (lower.includes("hddvd") || lower.includes("hd-dvd"))
            return "HD-DVD / ";
        else if (
            lower.includes("bluray") ||
            lower.includes("blu-ray") ||
            lower.includes("blu.ray") ||
            lower.includes("blu ray")
        )
            return "Blu-ray / ";

        return ""; // skip this info
    };

    const get_res = (lower, torrent) => {
        if (lower.includes("ntsc")) return "NTSC / ";
        else if (lower.includes("pal")) return "PAL / ";
        else if (lower.includes("480p")) return "480p / ";
        else if (lower.includes("576p")) return "576p / ";
        else if (lower.includes("720p")) return "720p / ";
        else if (lower.includes("1080i")) return "1080i / ";
        else if (lower.includes("1080p")) return "1080p / ";
        else if (lower.includes("2160p")) return "2160p / ";

        return ""; // skip this info
    };

    const get_simplified_title = (info_text, torrent) => {
        let lower = info_text.toLowerCase();

        // required infos : codec (x264 vs) / container (mkv,mp4) / source (dvd,web,bluray) / res (1080p,720,SD,1024x768 etc) / Bonus (with commentary,remux, XYZ edition)
        let codec = get_codec(lower, torrent);
        let container = get_container(lower, torrent);
        let source = get_source(lower, torrent);
        let res = get_res(lower, torrent);

        let combined_text = codec + container + source + res;

        if (combined_text === "") return info_text;
        else return combined_text;
    };

    const get_discount_color = (discount) => {
        if (discount === "Freeleech") return "#8ef6e4";
        else if (discount === "50% Freeleech") return "#f7d584";
        else if (discount === "25% Freeleech") return "#00AB43";
        else return "#EF85FF";
    };

    const add_external_torrents = (external_torrents) => {
        let sd_ptp_torrents = get_filtered_torrents("SD").sort((a, b) =>
            a.size < b.size ? 1 : -1
        );
        let hd_ptp_torrents = get_filtered_torrents("HD").sort((a, b) =>
            a.size < b.size ? 1 : -1
        );
        let uhd_ptp_torrents = get_filtered_torrents("UHD").sort((a, b) =>
            a.size < b.size ? 1 : -1
        );

        create_needed_groups(external_torrents);

        external_torrents.forEach((torrent, i) => {
            let seeders = parseInt(torrent.seed);
            if (hide_dead_external_torrents && parseInt(seeders) === 0) return;

            let group_torrents;
            let ref_div;
            let tracker = torrent.site;
            let dom_id = tracker + "_" + i;

            if (torrent.quality === "UHD") {
                ref_div = get_ref_div(torrent, uhd_ptp_torrents);
                group_torrents = uhd_ptp_torrents; // needed just in case ref returns false/if its smallest
            } else if (torrent.quality === "HD") {
                ref_div = get_ref_div(torrent, hd_ptp_torrents);
                group_torrents = hd_ptp_torrents;
            } else {
                ref_div = get_ref_div(torrent, sd_ptp_torrents);
                group_torrents = sd_ptp_torrents;
            }

            let cln = line_example.cloneNode(true);

            cln.querySelector(".torrent-info-link").textContent =
                `[${torrent.site}] ` + torrent.info_text;

            // torrent.discount != "" ? cln.querySelector(".torrent-info-link").textContent += " / " + torrent.discount : false
            torrent.discount != "No discount"
                ? (cln.querySelector(".torrent-info-link").innerHTML +=
                    ` / <span style='opacity:0.62;color:${get_discount_color(
                        torrent.discount
                    )};'>` +
                    torrent.discount +
                    "</span>")
                : false;

            //cln.querySelector(".torrent-info-link").textContent = torrent.info_text;
            if (torrent.status === "seeding")
                cln.querySelector(".torrent-info-link").className +=
                    " torrent-info-link--user-seeding";

            //cln.querySelector(".torrent-info-link").textContent = `[${torrent.site}] ` + get_simplified_title(torrent.info_text);

            [
                ...cln
                    .querySelector(".basic-movie-list__torrent__action")
                    .querySelectorAll("a"),
            ].find((a) => a.textContent === "DL").href = torrent.download_link;
            cln.querySelector(".size-span").textContent = get_ptp_format_size(
                torrent.size
            );
            cln.querySelector("td:nth-child(3)").textContent = torrent.snatch; // snatch
            cln.querySelector("td:nth-child(4)").textContent = torrent.seed; // seed
            cln.querySelector("td:nth-child(5)").textContent = torrent.leech; // leech

            cln.querySelector(".link_3").href = torrent.torrent_page;
            cln.className += " " + dom_id;

            if (open_in_new_tab) cln.querySelector(".link_3").target = "_blank";

            if (show_tracker_icon) {
                cln.querySelector("img").src = get_tracker_icon(torrent.site);
                cln.querySelector("img").title = torrent.site;
            }

            if (ref_div != false) insertAfter(cln, ref_div);
            else {
                add_as_first(cln, torrent.quality);
            }

            // doms listesine ekle şimdi, sonraki filtrelemeler için

            let dom_path = cln;
            let quality = dom_get_quality(torrent.info_text);
            let discount = torrent.discount;
            let info_text = torrent.info_text;
            let leechers = parseInt(torrent.leech);
            let snatchers = parseInt(torrent.snatch);
            let size = torrent.size;

            doms.push({
                tracker,
                dom_path,
                quality,
                discount,
                info_text,
                seeders,
                leechers,
                snatchers,
                dom_id,
                size,
            });
        });

        let reduced_trackers = get_reduced_trackers(doms);
        let reduced_discounts = get_reduced_discounts(doms);
        let reduced_qualities = get_reduced_qualities(doms);

        add_filters_div(reduced_trackers, reduced_discounts, reduced_qualities);
        disable_highlight();
        add_sort_listeners();
    };

    const insert_group = (quality, header_div) => {
        let all_trs = [
            ...document
                .querySelector("#torrent-table > tbody")
                .querySelectorAll("tr.group_torrent"),
        ];
        let tbody = document.querySelector("#torrent-table > tbody");

        if (quality === "HD") {
            let idx = -2; // add_after_this_index

            for (let i = 0; i < all_trs.length; i++) {
                if (
                    all_trs[i].textContent.includes("Other") ||
                    all_trs[i].textContent.includes("Ultra High Definition")
                ) {
                    idx = i - 1;
                    break;
                }
            }

            if (idx === -2) {
                tbody.appendChild(header_div); // nothing to stop me
            } else {
                insertAfter(header_div, all_trs[idx]);
            }
        } else if (quality === "UHD") {
            let idx = -2; // add_after_this_index

            for (let i = 0; i < all_trs.length; i++) {
                if (all_trs[i].textContent.includes("Other")) {
                    idx = i - 1;
                    break;
                }
            }

            if (idx === -2) {
                tbody.appendChild(header_div); // nothing to stop me
            } else {
                insertAfter(header_div, all_trs[idx]);
            }
        }
    };

    const create_needed_groups = (torrents) => {
        let all_trs = [
            ...document
                .querySelector("#torrent-table > tbody")
                .querySelectorAll("tr.group_torrent"),
        ];
        let tbody = document.querySelector("#torrent-table > tbody");

        if (
            torrents.find((e) => e.quality === "SD") != undefined &&
            all_trs.find((d) => d.textContent.includes("Standard Definition")) ===
            undefined
        ) {
            group_header_example.querySelector(
                ".basic-movie-list__torrent-edition__sub"
            ).textContent = "Standard Definition";
            tbody.insertBefore(
                group_header_example,
                document.querySelector("#torrent-table > tbody").firstChild
            );
        }

        if (
            torrents.find((e) => e.quality === "HD") != undefined &&
            all_trs.find(
                (d) =>
                    d.textContent.includes("High Definition") &&
                    !d.textContent.includes("Ultra High Definition")
            ) === undefined
        ) {
            group_header_example.querySelector(
                ".basic-movie-list__torrent-edition__sub"
            ).textContent = "High Definition";
            insert_group("HD", group_header_example);
        }

        if (
            torrents.find((e) => e.quality === "UHD") != undefined &&
            all_trs.find((d) => d.textContent.includes("Ultra High Definition")) ===
            undefined
        ) {
            group_header_example.querySelector(
                ".basic-movie-list__torrent-edition__sub"
            ).textContent = "Ultra High Definition";
            insert_group("UHD", group_header_example);
        }
    };

    const fix_doms = () => {
        doms.forEach((d) => {
            d.dom_path = [...document.querySelectorAll(".group_torrent")].find(
                (e) => e.className.split(" ").find((c) => c === d.dom_id) != undefined
            );
        });
    };

    const filter_torrents = () => {
        doms.forEach((e, i) => {
            let tracker_constraint = false;

            let inc_value = undefined;
            let exc_value = undefined; // başlangıc değeri bu mu olmalı yoksa null mu ?

            let status = filters.trackers.find((d) => d.name === e.tracker).status;

            if (status === "include") inc_value = true;
            else if (status === "exclude") exc_value = true;

            if (inc_value === true) tracker_constraint = true;
            else if (exc_value === true)
                tracker_constraint = false; // aslında bu satır gereksiz.
            else {
                // neutralde , siyah
                tracker_constraint = true;
                if (filters.trackers.filter((e) => e.status === "include").length > 0)
                    tracker_constraint = false;
            }

            if (tracker_constraint === false) {
                e.dom_path.style.display = "none";
                return;
            }

            ////////////////////

            let discount_constraint = false;

            let inc_value_2 = undefined;
            let exc_value_2 = undefined; // başlangıc değeri bu mu olmalı yoksa null mu ?

            let status_2 = filters.discounts.find(
                (d) => d.name === e.discount
            ).status;

            if (status_2 === "include") inc_value_2 = true;
            else if (status_2 === "exclude") exc_value_2 = true;

            if (inc_value_2 === true) discount_constraint = true;
            else if (exc_value_2 === true)
                discount_constraint = false; // aslında bu satır gereksiz.
            else {
                // neutralde , siyah
                discount_constraint = true;
                if (filters.discounts.filter((e) => e.status === "include").length > 0)
                    discount_constraint = false;
            }

            if (discount_constraint === false) {
                e.dom_path.style.display = "none";
                return;
            }

            /////////////////////////////////

            let quality_constraint = false;

            let inc_value_3 = undefined;
            let exc_value_3 = undefined; // başlangıc değeri bu mu olmalı yoksa null mu ?

            let status_3 = filters.qualities.find((d) => d.name === e.quality).status;

            if (status_3 === "include") inc_value_3 = true;
            else if (status_3 === "exclude") exc_value_3 = true;

            if (inc_value_3 === true) quality_constraint = true;
            else if (exc_value_3 === true)
                quality_constraint = false; // aslında bu satır gereksiz.
            else {
                // neutralde , siyah
                quality_constraint = true;
                if (filters.qualities.filter((e) => e.status === "include").length > 0)
                    quality_constraint = false;
            }

            if (quality_constraint === false) {
                e.dom_path.style.display = "none";
                return;
            }

            //////////////////////

            let text_constraint = true;

            let must_include_words = document
                .querySelector(".torrent-search")
                .value.split(" ")
                .map((w) => w.toLowerCase());

            for (let word of must_include_words) {
                if (e.info_text.toLowerCase().includes(word) === false) {
                    text_constraint = false;
                    break;
                }
            }

            if (text_constraint === false) {
                e.dom_path.style.display = "none";
                return;
            }

            // congrats !
            e.dom_path.style.display = "table-row";
        });
    };

    const update_filter_box_status = (object_key, value, dom_path) => {
        // object_key = tracker/quality/discount || value = BHD, HDB, 50% Freeleech, 720p etc...

        let all_values = ["default", "include", "exclude"];

        let current_value = null;

        if (object_key === "trackers") {
            let current_status = filters.trackers.find(
                (e) => e.name === value
            ).status;

            if (current_status === "default") {
                filters.trackers.find((e) => e.name === value).status = "include";
                dom_path.style.background = "#40E0D0";
                dom_path.style.color = "#111";
            } else if (current_status === "include") {
                filters.trackers.find((e) => e.name === value).status = "exclude";

                dom_path.style.background = "#920000";
                dom_path.style.color = "#eee";
            } else {
                filters.trackers.find((e) => e.name === value).status = "default";
                dom_path.style.background = "";
                dom_path.style.opacity = 1;
            }
        } else if (object_key === "discounts") {
            let current_status = filters.discounts.find(
                (e) => e.name === value
            ).status;

            if (current_status === "default") {
                filters.discounts.find((e) => e.name === value).status = "include";
                dom_path.style.background = "#40E0D0";
                dom_path.style.color = "#111";
            } else if (current_status === "include") {
                filters.discounts.find((e) => e.name === value).status = "exclude";
                dom_path.style.background = "#920000";
                dom_path.style.color = "#eee";
            } else {
                filters.discounts.find((e) => e.name === value).status = "default";
                dom_path.style.background = "";
                dom_path.style.opacity = 1;
            }
        } else if (object_key === "qualities") {
            let current_status = filters.qualities.find(
                (e) => e.name === value
            ).status;

            if (current_status === "default") {
                filters.qualities.find((e) => e.name === value).status = "include";
                dom_path.style.background = "#40E0D0";
                dom_path.style.color = "#111";
            } else if (current_status === "include") {
                filters.qualities.find((e) => e.name === value).status = "exclude";
                dom_path.style.background = "#920000";
                dom_path.style.color = "#eee";
            } else {
                filters.qualities.find((e) => e.name === value).status = "default";
                dom_path.style.background = "";
                dom_path.style.opacity = 1;
            }
        }

        filter_torrents(); // big update
    };

    const fix_ptp_names = () => {
        document.querySelectorAll("tr.group_torrent").forEach((d) => {
            if (d.className != "group_torrent") {
                d.querySelector("a.torrent-info-link").textContent =
                    "[PTP] " + d.querySelector("a.torrent-info-link").textContent;
            }
        });
    };

    const add_filters_div = (trackers, discounts, qualities) => {
        let addBeforeThis = document.querySelector(".main-column");

        let div = document.createElement("div");
        div.className = "filter-container";
        div.style.width = "100%";
        div.style.boxSizing = "border-box";
        div.style.border = "1px solid #303030";
        div.style.margin = "10px 0";
        div.style.padding = "12px";

        let filterByTracker = document.createElement("div");
        let label = document.createElement("span");
        label.textContent = "Tracker: ";
        label.style.cursor = "default";
        label.style.width = "70px";
        label.style.display = "inline-block";
        filterByTracker.appendChild(label);

        filterByTracker.style.margin = "4px 0";

        trackers.forEach((tracker_name) => {
            let div = document.createElement("div");
            div.className = "filter-box";
            div.textContent = tracker_name;
            div.style.padding = "2px 4px";
            div.style.margin = "3px";
            div.style.color = "#eee";
            div.style.display = "inline-block";
            div.style.cursor = "pointer";
            div.style.width = "auto";
            div.style.border = "1px dashed #606060";
            div.style.fontSize = "13px";
            div.style.textAlign = "center";

            div.addEventListener("click", () => {
                update_filter_box_status("trackers", tracker_name, div);
            });

            filterByTracker.appendChild(div);
        });

        div.appendChild(filterByTracker);

        let additional_settings = document.createElement("div"); // discounts
        let label_2 = document.createElement("span");
        label_2.textContent = "Discount: ";
        label_2.style.cursor = "default";
        label_2.style.width = "70px";
        label_2.style.display = "inline-block";
        additional_settings.appendChild(label_2);

        discounts.forEach((discount_name) => {
            let only_discount = document.createElement("div");
            only_discount.className = "filter-box";
            only_discount.textContent = discount_name;
            only_discount.style.padding = "2px 4px";
            only_discount.style.margin = "3px";
            only_discount.style.color = "#eee";
            only_discount.style.display = "inline-block";
            only_discount.style.cursor = "pointer";
            only_discount.style.border = "1px dashed #606060";
            only_discount.style.fontSize = "13px";

            only_discount.addEventListener("click", () => {
                update_filter_box_status("discounts", discount_name, only_discount);
            });

            additional_settings.appendChild(only_discount);
        });

        div.appendChild(additional_settings);

        ///////

        let filterByQuality = document.createElement("div");
        let label_3 = document.createElement("span");
        label_3.textContent = "Quality: ";
        label_3.style.cursor = "default";
        label_3.style.width = "70px";
        label_3.style.display = "inline-block";
        filterByQuality.appendChild(label_3);

        filterByQuality.style.margin = "4px 0";

        qualities.forEach((quality_name) => {
            let quality = document.createElement("div");
            quality.className = "filter-box";
            quality.textContent = quality_name;
            quality.style.padding = "2px 4px";
            quality.style.margin = "3px";
            quality.style.color = "#eee";
            quality.style.display = "inline-block";
            quality.style.cursor = "pointer";
            quality.style.border = "1px dashed #606060";
            quality.style.fontSize = "13px";
            quality.style.width = "49px";
            quality.style.textAlign = "center";

            quality.addEventListener("click", () => {
                update_filter_box_status("qualities", quality_name, quality);
            });

            filterByQuality.appendChild(quality);
        });

        div.appendChild(filterByQuality);

        /////////////////////

        let filterByText = document.createElement("div");
        filterByText.style.margin = "11px 0 0";

        let label_4 = document.createElement("span");
        label_4.textContent = "Search: ";
        label_4.style.cursor = "default";
        label_4.style.width = "70px";
        label_4.style.display = "inline-block";

        filterByText.appendChild(label_4);

        let input = document.createElement("input");
        input.className = "torrent-search";
        input.type = "text";
        input.style.marginTop = "4px";
        input.style.marginRight = "6px";
        input.style.display = "inline-block";
        input.style.background = "#303030";
        input.style.outline = "none";
        input.style.color = "#eee";
        input.style.fontWeight = "bold";
        input.style.fontSize = "14px";
        input.spellcheck = false;
        input.placeholder = "Search torrents...";
        input.style.padding = "7px 5px";
        input.style.width = "250px";

        input.addEventListener("input", (e) => {
            filter_torrents();
        });

        filterByText.appendChild(input);

        // reset btn

        let rst = document.createElement("div");
        rst.textContent = "Reset";

        rst.style.padding = "4px 8px";
        rst.style.margin = "0px 4px";
        rst.style.color = "#eee";
        rst.style.display = "inline-block";
        rst.style.cursor = "pointer";
        rst.style.border = "1px dashed #606060";
        rst.style.fontSize = "15px";
        rst.style.textAlign = "center";

        rst.addEventListener("click", () => {
            document.querySelector(".torrent-search").value = "";

            filters = {
                trackers: trackers.map((e) => {
                    return { name: e, status: "default" };
                }),

                discounts: discounts.map((e) => {
                    return { name: e, status: "default" };
                }),

                qualities: qualities.map((e) => {
                    return { name: e, status: "default" };
                }),
            };

            filter_torrents();

            document.querySelectorAll(".filter-box").forEach((d) => {
                d.style.background = "";
                d.style.color = "#eee";
            });
        });

        filterByText.appendChild(rst);

        // back to original view btn

        let original_view_btn = document.createElement("div");
        original_view_btn.textContent = "Original view";

        original_view_btn.style.padding = "4px 8px";
        original_view_btn.style.margin = "0px 4px";
        original_view_btn.style.color = "#eee";
        original_view_btn.style.display = "inline-block";
        original_view_btn.style.cursor = "pointer";
        original_view_btn.style.border = "1px dashed #606060";
        original_view_btn.style.fontSize = "15px";
        original_view_btn.style.textAlign = "center";

        original_view_btn.addEventListener("click", () => {
            document.querySelector(".torrent-search").value = "";

            filters = {
                trackers: trackers.map((e) => {
                    return { name: e, status: "default" };
                }),

                discounts: discounts.map((e) => {
                    return { name: e, status: "default" };
                }),

                qualities: qualities.map((e) => {
                    return { name: e, status: "default" };
                }),
            };

            document.querySelectorAll(".filter-box").forEach((d) => {
                d.style.background = "";
                d.style.color = "#eee";
            });

            document.querySelector("table.torrent_table").innerHTML =
                original_table.innerHTML;

            add_sort_listeners();

            // originala tekrar döndükten sonra sorun şu:
            // doms dediğin şeydeki domlar, şu an ekranda yok !!!!
            // öyle bir şey yap ki, domstakilerim dom_pathi şu an ekrandakiler olsun !!
            // one million IQ solution:

            fix_doms();

            disable_highlight();
        });

        filterByText.appendChild(original_view_btn)

        let imdb_id;
        try {
            imdb_id = `tt${document.getElementById("imdb-title-link").href.split("/tt")[1].split("/")[0]}`;
        } catch (e) {
            // replaced by ratings box script...
            imdb_id = `tt${[...document.querySelectorAll(".rating")].find((a) => a.href.includes("imdb.com")).href.split("/tt")[1].split("/")[0]}`
        }
        let imdbLbl = document.createElement("div");
        imdbLbl.textContent = `IMDB: ${imdb_id}`;
        filterByText.appendChild(imdbLbl);

        div.appendChild(filterByText);

        addBeforeThis.insertBefore(div, addBeforeThis.firstChild);

        // done.
    };

    const get_example_div = () => {
        let tr = document.createElement("tr");
        tr.className = "group_torrent group_torrent_header";
        tr["data-releasename"] = "release_name_here";

        let td = document.createElement("td");
        td.style.width = "596px";

        let span = document.createElement("span");
        span.className = "basic-movie-list__torrent__action";
        span.style.marginLeft = "12px";
        span.textContent = "[";

        let a = document.createElement("a");
        a.href = "#";
        a.className = "link_1";
        a.textContent = "DL";
        a.title = "Download";

        span.appendChild(a);
        span.innerHTML += "]"; //////////// kekwait

        let a2 = document.createElement("a");
        a2.href = "#";
        a2.className = "link_2";
        a2.style.marginRight = "4px";

        let img = document.createElement("img");
        img.style.width = "12px";
        img.style.height = "12px";
        img.src = "static/common/check.png";
        img.alt = "☑";
        img.title = "Tracker title";

        a2.appendChild(img);

        let a3 = document.createElement("a");
        a3.href = "link_3";
        a3.className = "torrent-info-link link_3";
        a3.textContent = "INFO_TEXT_HERE";

        td.appendChild(span);
        td.appendChild(a2);
        td.appendChild(a3);

        let td2 = document.createElement("td");
        td2.className = "nobr";
        td2.style.width = "63px";

        let span2 = document.createElement("span");
        span2.className = "size-span";
        span2.style.float = "left";
        span2.textContent = "TORRENT_SIZE_HERE";
        td2.appendChild(span2);

        let td3 = document.createElement("td");
        td3.style.width = "31px";

        let td4 = document.createElement("td");
        td3.style.width = "21px";

        let td5 = document.createElement("td");
        td3.style.width = "10px";

        tr.appendChild(td);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        return tr;
    };

    const disable_highlight = () => {
        document.querySelector(".filter-container").addEventListener(
            "mousedown",
            function (event) {
                if (event.detail > 1) {
                    event.preventDefault();
                    // of course, you still do not know what you prevent here...
                    // You could also check event.ctrlKey/event.shiftKey/event.altKey
                    // to not prevent something useful.
                }
            },
            false
        );

        document.querySelector("table.torrent_table > thead").addEventListener(
            "mousedown",
            function (event) {
                if (event.detail > 1) {
                    event.preventDefault();
                    // of course, you still do not know what you prevent here...
                    // You could also check event.ctrlKey/event.shiftKey/event.altKey
                    // to not prevent something useful.
                }
            },
            false
        );
    };

    const get_sorted_qualities = (qualities) => {
        let arr = [];

        qualities.forEach((q) => {
            if (q === "SD") arr.push({ value: 0, name: q });
            else if (q === "480p") arr.push({ value: 1, name: q });
            else if (q === "576p") arr.push({ value: 2, name: q });
            else if (q === "720p") arr.push({ value: 3, name: q });
            else if (q === "1080p") arr.push({ value: 4, name: q });
            else if (q === "2160p") arr.push({ value: 5, name: q });
        });

        return arr.sort((a, b) => (a.value > b.value ? 1 : -1)).map((e) => e.name);
    };

    const get_sorted_discounts = (discounts) => {
        // let discounts = ["Freeleech", "75% Freeleech", "50% Freeleech", "25% Freeleech", "Refundable", "Rewind", "Rescuable", "No discount"]

        let arr = [];

        discounts.forEach((q) => {
            if (q === "No discount") arr.push({ value: 0, name: q });
            else if (q === "Rescuable") arr.push({ value: 1, name: q });
            else if (q === "Rewind") arr.push({ value: 2, name: q });
            else if (q === "Refundable") arr.push({ value: 3, name: q });
            else if (q === "25% Freeleech") arr.push({ value: 4, name: q });
            else if (q === "50% Freeleech") arr.push({ value: 5, name: q });
            else if (q === "75% Freeleech") arr.push({ value: 6, name: q });
            else if (q === "Freeleech") arr.push({ value: 7, name: q });
        });

        return arr.sort((a, b) => (a.value < b.value ? 1 : -1)).map((e) => e.name);
    };

    const get_reduced_trackers = (doms) => {
        let lst = []; // default

        doms.forEach((t) => {
            if (lst.includes(t.tracker) === false) lst.push(t.tracker);
        });

        return lst.sort((a, b) => (a > b ? 1 : -1));
    };

    const get_reduced_discounts = (doms) => {
        let lst = [];

        doms.forEach((t) => {
            if (lst.includes(t.discount) === false) lst.push(t.discount);
        });

        return get_sorted_discounts(lst);
    };

    const get_reduced_qualities = (doms) => {
        // qualities

        let lst = [];

        qualities.forEach((q) => {
            for (let i = 0; i < doms.length; i++) {
                if (
                    doms[i].info_text.toLowerCase().includes(q.toLowerCase()) &&
                    q != "SD" &&
                    !lst.includes(q)
                ) {
                    lst.push(q);
                    break;
                }
            }
        });

        return get_sorted_qualities(lst.concat(["SD"]));
    };

    let seed_desc = true;
    let leech_desc = true;
    let snatch_desc = true;
    let size_desc = true;

    const add_sort_listeners = () => {
        let seed_th = [
            ...document.querySelector("table.torrent_table").querySelectorAll("th"),
        ]
            .filter((e) => e.querySelector("img") != null)
            .find((t) => t.querySelector("img").src.includes("seeders.png"));

        seed_th.style.cursor = "pointer";
        seed_th.addEventListener("click", () => {
            if (seed_desc)
                doms = doms.sort((a, b) =>
                    parseInt(a.seeders) < parseInt(b.seeders) ? 1 : -1
                );
            else
                doms = doms.sort((a, b) =>
                    parseInt(a.seeders) > parseInt(b.seeders) ? 1 : -1
                );

            seed_desc = !seed_desc;

            document.querySelectorAll(".group_torrent").forEach((d) => d.remove());

            doms.forEach((d) =>
                document
                    .querySelector("table.torrent_table > tbody")
                    .appendChild(d.dom_path)
            );
        });

        /////////////////////////////////////

        let leech_th = [
            ...document
                .querySelector("table.torrent_table")
                .querySelectorAll("th.sign"),
        ]
            .filter((e) => e.querySelector("img") != null)
            .find((t) => t.querySelector("img").src.includes("leechers.png"));

        leech_th.style.cursor = "pointer";
        leech_th.addEventListener("click", () => {
            if (leech_desc)
                doms = doms.sort((a, b) =>
                    parseInt(a.leechers) < parseInt(b.leechers) ? 1 : -1
                );
            else
                doms = doms.sort((a, b) =>
                    parseInt(a.leechers) > parseInt(b.leechers) ? 1 : -1
                );

            leech_desc = !leech_desc;

            document.querySelectorAll(".group_torrent").forEach((d) => d.remove());

            doms.forEach((d) =>
                document
                    .querySelector("table.torrent_table > tbody")
                    .appendChild(d.dom_path)
            );
        });

        ////////////////////////////

        let snatch_th = [
            ...document.querySelector("table.torrent_table").querySelectorAll("th"),
        ]
            .filter((e) => e.querySelector("img") != null)
            .find((t) => t.querySelector("img").src.includes("snatched.png"));

        snatch_th.style.cursor = "pointer";
        snatch_th.addEventListener("click", () => {
            if (snatch_desc)
                doms = doms.sort((a, b) =>
                    parseInt(a.snatchers) < parseInt(b.snatchers) ? 1 : -1
                );
            else
                doms = doms.sort((a, b) =>
                    parseInt(a.snatchers) > parseInt(b.snatchers) ? 1 : -1
                );

            snatch_desc = !snatch_desc;

            document.querySelectorAll(".group_torrent").forEach((d) => d.remove());

            doms.forEach((d) =>
                document
                    .querySelector("table.torrent_table > tbody")
                    .appendChild(d.dom_path)
            );
        });

        /////////////////////////////////

        let size_th = [
            ...document.querySelector("table.torrent_table").querySelectorAll("th"),
        ].find((e) => e.textContent === "Size");

        size_th.style.cursor = "pointer";
        size_th.addEventListener("click", () => {
            if (size_desc)
                doms = doms.sort((a, b) =>
                    parseInt(a.size) < parseInt(b.size) ? 1 : -1
                );
            else
                doms = doms.sort((a, b) =>
                    parseInt(a.size) > parseInt(b.size) ? 1 : -1
                );

            size_desc = !size_desc;

            document.querySelectorAll(".group_torrent").forEach((d) => d.remove());

            doms.forEach((d) =>
                document
                    .querySelector("table.torrent_table > tbody")
                    .appendChild(d.dom_path)
            );
        });
    };

    let line_example = get_example_div();
    let group_header_example = document
        .querySelector("tr.group_torrent")
        .cloneNode(true);
    let original_table;

    const mainFunc = async () => {
        fix_ptp_names();

        let imdb_id;

        try {
            imdb_id =
                "tt" +
                document
                    .getElementById("imdb-title-link")
                    .href.split("/tt")[1]
                    .split("/")[0];
        } catch (e) {
            // replaced by ratings box script...
            imdb_id =
                "tt" +
                [...document.querySelectorAll(".rating")]
                    .find((a) => a.href.includes("imdb.com"))
                    .href.split("/tt")[1]
                    .split("/")[0];
        }

        let promises = [];

        trackers.forEach((t) => promises.push(fetch_tracker(t, imdb_id)));

        Promise.all(promises).then((torrents_lists) => {
            var all_torrents = [].concat
                .apply([], torrents_lists)
                .sort((a, b) => (a.size < b.size ? 1 : -1));

            //console.log(all_torrents)

            add_external_torrents(all_torrents);

            document
                .querySelectorAll(".basic-movie-list__torrent__action")
                .forEach((d) => {
                    d.style.marginLeft = "12px";
                }); // style fix

            original_table = document
                .querySelector("table.torrent_table")
                .cloneNode(true);

            localStorage.setItem("play_now_flag", "true"); // yy
        });
    };

    mainFunc();
})();