// ==UserScript==
// @name         Plex IMDb Ratings & Links
// @namespace    https://gist.github.com/Acamol/b925fbaea3b45858023fe94898f9ea87
// @description  Adds IMDb ratings and direct links to IMDb pages for movies and TV shows in your Plex library.
// @author       Acamol
// @version      0.1.0
// @license      MIT
// @grant        GM.xmlHttpRequest
// @match        *://127.0.0.1:*/*
// @match        *://localhost:*/*
// @match        *://app.plex.tv/desktop/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plex.tv
// @connect      omdbapi.com
// @downloadURL https://update.greasyfork.org/scripts/527143/Plex%20IMDb%20Ratings%20%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/527143/Plex%20IMDb%20Ratings%20%20Links.meta.js
// ==/UserScript==


// put your OMDb API key here (get it by signing up at: https://omdbapi.com/. limited to 1,000 queries a day):
const apiKey = "<YOUR OMDb API KEY>";

// used to figure out if we already have a rating node
const nodeID = "imdb-rating";

// when enabled, shows console logs
const debug = false;

const log = (...args) => {
    if (debug) console.log("Plex IMDb Ratings & Links:", ...args);
};

// retrieves the existing rating node, used as a reference point for inserting the new IMDb rating
const getNeighborRatingNode = () => {
    // we don't know which of the ratings we have, if any
    const firstTry = document.querySelector("span[title^='TMDB']");
    if (firstTry) return firstTry;

    return document.querySelector("span[title^='Rotten Tomatoes']");
};

// retrieves the title of the current movie or show
const getTitle = () => {
    const titleNode = document.querySelector("h1[data-testid='metadata-title']");
    if (!titleNode) {
        return null;
    }

    const title = titleNode.textContent;
    log(`title is ${title}`);

    return title;
};

// retrieves the release year of the current movie or TV show
const getYear = () => {
    let year = document.querySelector("span[data-testid='metadata-line1']").textContent.split(/\s+/)[0];
    if (Number.isInteger(+year)) {
        log(`got year \"${year}\" from line 1, should be a movie or TV show page`);
        return year;
    }

    year = document.querySelector("span[data-testid='metadata-line2']").textContent.split(/\s+/)[2];
    log(`got year \"${year}\" from line 2, should be an episode`);
    return year;
};

// retrieves the IMDb rating and link of the current movie / episode / TV show
const getImdbInfo = async (title, year, showInfo) => {
    let queryTitle = title.replace(/\s/g, '+');
    let omdbQueryURL = (() => {
        if (showInfo) {
            // the year in this case is the release year of the episode, so better not adding it to the query
            return `https://omdbapi.com/?apikey=${apiKey}&t=${queryTitle}&episode=${showInfo.episode}&season=${showInfo.season}`;
        }

        return `https://omdbapi.com/?apikey=${apiKey}&t=${queryTitle}&y=${year}`
    })();

    log(`URL query is ${omdbQueryURL}`);

    const response = await GM.xmlHttpRequest({
        method: "GET",
        url: omdbQueryURL
    });

    const json = JSON.parse(response.responseText);
    if (json.Response === "False") {
        throw new Error(`Cannot find title \"${title}\"`);
    }

    const id = json.imdbID;
    const rating = json.imdbRating;
    log(`ID is ${id}, and rating is ${rating}`);

    return {id, rating}
};

// retrieves the season and episode of the current episode
const getSeasonAndEpisode = () => {
    const line = document.querySelector("span[data-testid='metadata-line1']")?.textContent;
    if (!line) {
        return null;
    }

    const groups = /Season (\d+)\s+Episode (\d+)/.exec(line);
    if (groups?.length == 3) {
        return {
            season: groups[1],
            episode: groups[2]
        };
    }

    return null;
};

// creates the IMDb icon next to the rating
const createImdbSvg = (neighborSVG) => {
    const svgNS = "http://www.w3.org/2000/svg";

    let svg = document.createElementNS(svgNS, "svg");
    svg.classList = neighborSVG.classList;
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "rkbrtb0 rkbrtb1 rkbrtb3 _1v25wbq6g");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("height", "48");
    svg.setAttribute("viewBox", "0 0 74 48");
    svg.setAttribute("width", "74");
    svg.setAttribute("xmlns", svgNS);

    const path1 = document.createElementNS(svgNS, "path");
    path1.setAttribute("clip-rule", "evenodd");
    path1.setAttribute("d", "M6 12.1248C6 10.399 7.38744 9 9.09981 9H64.9002C66.6122 9 68 10.3993 68 12.1248V35.8753C68 37.601 66.6126 39 64.9002 39H9.09981C7.38781 39 6 37.6008 6 35.8753V12.1248Z");
    path1.setAttribute("fill", "#E1BE00");
    path1.setAttribute("fill-rule", "evenodd");

    const path2 = document.createElementNS(svgNS, "path");
    path2.setAttribute("clip-rule", "evenodd");
    path2.setAttribute("d", "M54.1049 14.9226V20.8376C54.4818 20.4016 54.902 20.0763 55.3655 19.862C55.8292 19.6477 56.525 19.5397 57.068 19.5397C57.6936 19.5397 58.2358 19.6367 58.6955 19.8314C59.1556 20.0257 59.506 20.2983 59.7473 20.6489C59.9884 20.9997 60.1331 21.3432 60.1825 21.6792C60.2313 22.0152 60.256 22.7319 60.256 23.8298V28.9317C60.256 30.0222 60.1825 30.8338 60.0355 31.368C59.8881 31.9019 59.5429 32.3654 59 32.7574C58.4568 33.149 57.8125 33.3452 57.0655 33.3452C56.5301 33.3452 55.8375 33.2291 55.3736 32.9964C54.9097 32.7636 54.4855 32.4142 54.101 31.9484L53.8067 33.107H49.5542V14.9227L54.1049 14.9226ZM14.6312 33.1075H19.355V14.9231H14.6312V33.1075ZM27.0923 14.9226C27.2724 16.0235 27.461 17.3157 27.6585 18.7982L28.3354 23.4179L29.4294 14.9229H35.6V33.1073H31.4757L31.4607 20.8335L29.8087 33.1073H26.8618L25.1204 21.1004L25.1055 33.1073H20.9681V14.9229L27.0923 14.9226ZM40.74 14.923C43.0263 14.923 44.3418 15.028 45.1475 15.2374C45.9534 15.4465 46.5666 15.7903 46.9862 16.2689C47.4061 16.7474 47.6684 17.2802 47.7734 17.8668C47.8782 18.4537 47.9454 19.607 47.9454 21.3268V27.713C47.9454 29.343 47.8541 30.433 47.7005 30.9824C47.5466 31.5324 47.2787 31.9622 46.8966 32.2723C46.5139 32.5824 46.0419 32.7993 45.4796 32.9225C44.9171 33.0461 44.0702 33.1077 42.9386 33.1077H37.2154V14.9233L40.74 14.923ZM55.6978 28.6953C55.6978 29.5753 55.6541 30.1313 55.5668 30.3626C55.4793 30.5941 55.099 30.7105 54.8106 30.7105C54.5293 30.7105 54.3418 30.5988 54.2468 30.3748C54.1519 30.151 54.1048 29.64 54.1048 28.8411V24.0354C54.1048 23.2069 54.1465 22.6905 54.2298 22.4849C54.3132 22.2801 54.4953 22.1771 54.7763 22.1771C55.0643 22.1771 55.451 22.2941 55.5498 22.5292C55.6483 22.7643 55.6977 23.2664 55.6977 24.0348L55.6978 28.6953ZM42.987 18.196C43.1736 18.304 43.2933 18.4746 43.3453 18.7058C43.3974 18.9376 43.4239 19.4644 43.4239 20.2864V27.3364C43.4239 28.5471 43.3453 29.2883 43.1885 29.5611C43.0316 29.8343 42.6135 29.9704 41.9347 29.9704V18.0335C42.4493 18.0335 42.8003 18.0876 42.987 18.196Z");
    path2.setAttribute("fill", "black");
    path2.setAttribute("fill-rule", "evenodd");

    svg.appendChild(path1);
    svg.appendChild(path2);

    return svg;
};

// generates the IMDb rating node
const generateImdbNode = (neighborNode, imdbInfo) => {
    let link = document.createElement("a");
    link.id = nodeID;
    link.href = `https://www.imdb.com/title/${imdbInfo.id}`;
    link.target = "_blank";
    link.title = `IMDb Rating ${imdbInfo.rating}`; // adding the rating when hovering with the mouse over the rating, like with the other ratings displayed on Plex
    link.classList = neighborNode.classList;

    const svg = createImdbSvg(neighborNode.querySelector("svg"));

    let parentRating = neighborNode.querySelector("span");
    let ratingSpan = document.createElement("span");
    ratingSpan.classList = parentRating.classList;
    ratingSpan.textContent = imdbInfo.rating;

    link.appendChild(svg);
    link.appendChild(ratingSpan);

    let imdbSpan = document.createElement("span");
    imdbSpan.classList = neighborNode.classList;
    imdbSpan.appendChild(link);
    imdbSpan.style.marginRight = "10px";

    // put the whole link beside the neighbor
    neighborNode.parentNode.insertBefore(imdbSpan, neighborNode);
};

const repeat = async () => {
    // if we already added the rating - no need to do it again
    if (document.querySelector(`#${nodeID}`)) {
        return;
    }

    // keep trying until the title node gets rendered or we are in a TV show/movie page
    const title = getTitle();
    if (!title) {
        return;
    }

    // we're not necessarily on an episode page, so we'll use it only if it is
    const showInfo = getSeasonAndEpisode();
    const year = getYear();
    const imdbInfo = await getImdbInfo(title, year, showInfo);

    const neighbor = getNeighborRatingNode();
    if (!neighbor) {
        throw new Error("Cannot find a neighbor rating node");
    }

    generateImdbNode(neighbor, imdbInfo);
};

const main = async () => {
    try {
        // because this is a SPA, the DOM is updated when navigating between views.
        // so we keep looping to detect those changes to render the appropriate IMDb ratings
        await repeat();
    } catch (e) {
        log(e);
    } finally {
        setTimeout(main, 500);
    }
};

main()