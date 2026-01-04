// ==UserScript==
// @name         Kinopoisk folder exporter with pagination
// @name:ru      Кинопоиск экспорт папки в CSV и JSON
// @namespace    https://github.com/oklookat/kp2imdb
// @version      1.17
// @description  Export movies and series from Kinopoisk folder to CSV with pagination.
// @description:ru Экспорт фильмов и сериалов из папки Кинопоиска в CSV с пагинацией.
// @author       CgPT & Vladimir0202
// @match        https://www.kinopoisk.ru/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541843/Kinopoisk%20folder%20exporter%20with%20pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/541843/Kinopoisk%20folder%20exporter%20with%20pagination.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let movies = [];
  let visitedPages = new Set();
  let processing = false;
  let profileId = "";
  let currentPageNumber = 1;

  function addButton() {
    const profileFilmsList = document.getElementsByClassName("profileFilmsList");

    if (profileFilmsList.length === 0) {
      console.error("KP EXPORT: profileFilmsList not found");
      return;
    }

    const expButtCSV = document.createElement("div");
    expButtCSV.className = "KPX_exportButton";
    expButtCSV.style.height = "20px";
    expButtCSV.style.width = "200px";
    expButtCSV.style.backgroundColor = "orange";
    expButtCSV.style.borderRadius = "3px";
    expButtCSV.style.display = "flex";
    expButtCSV.style.justifyContent = "center";
    expButtCSV.style.alignItems = "center";
    expButtCSV.style.cursor = "pointer";
    expButtCSV.style.color = "white";
    expButtCSV.style.fontSize = "12px";
    expButtCSV.textContent = "Экспорт фильмов (CSV)";

    expButtCSV.onmouseover = () => {
      expButtCSV.style.backgroundColor = "darkorange";
    };

    expButtCSV.onmouseout = () => {
      expButtCSV.style.backgroundColor = "orange";
    };

    expButtCSV.onclick = () => {
      if (!processing) {
        processing = true;
        console.log("Starting export to CSV...");
        showProgress("Starting export to CSV...");
        profileId = getProfileId();
        startProcessing(convertToCSV, "kp_movies_" + new Date().getTime() + ".csv", "text/csv");
      }
    };

    const expButtJSON = document.createElement("div");
    expButtJSON.className = "KPX_exportButton";
    expButtJSON.style.height = "20px";
    expButtJSON.style.width = "200px";
    expButtJSON.style.backgroundColor = "blue";
    expButtJSON.style.borderRadius = "3px";
    expButtJSON.style.display = "flex";
    expButtJSON.style.justifyContent = "center";
    expButtJSON.style.alignItems = "center";
    expButtJSON.style.cursor = "pointer";
    expButtJSON.style.color = "white";
    expButtJSON.style.fontSize = "12px";
    expButtJSON.textContent = "Экспорт фильмов (JSON)";

    expButtJSON.onmouseover = () => {
      expButtJSON.style.backgroundColor = "darkblue";
    };

    expButtJSON.onmouseout = () => {
      expButtJSON.style.backgroundColor = "blue";
    };

    expButtJSON.onclick = () => {
      if (!processing) {
        processing = true;
        console.log("Starting export to JSON...");
        showProgress("Starting export to JSON...");
        profileId = getProfileId();
        startProcessing(convertToJSON, "kp_movies_" + new Date().getTime() + ".json", "application/json");
      }
    };

    profileFilmsList[0].parentNode.insertBefore(expButtCSV, profileFilmsList[0]);
    profileFilmsList[0].parentNode.insertBefore(expButtJSON, profileFilmsList[0]);
  }

  function getProfileId() {
    const profileUrl = window.location.href;
    const match = profileUrl.match(/user\/(\d+)\//);
    return match ? match[1] : "";
  }

  async function startProcessing(converter, filename, fileType) {
    while (true) {
      console.log(`Processing page ${currentPageNumber}`);
      showProgress(`Processing page ${currentPageNumber}`);

      const success = await processCurrentPage();
      if (!success) break;

      const hasMorePages = await goToNextPage();
      if (!hasMorePages) break;

      currentPageNumber++;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const content = converter(movies);
    showProgress("Export complete. Downloading file...");
    console.log("Export complete. Downloading file...");
    download(content, filename, fileType);
    processing = false;
  }

  async function goToNextPage() {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const nextPageUrl = `/user/${profileId}/votes/list/vs/vote/page/${currentPageNumber + 1}/#list`;
    console.log(`Attempting to navigate to next page: ${nextPageUrl}`);

    return new Promise((resolve, reject) => {
      iframe.onload = () => {
        try {
          const doc = iframe.contentDocument;
          if (doc) {
            const profileFilmsList = doc.querySelector('.profileFilmsList');
            if (profileFilmsList) {
              const newContent = profileFilmsList.innerHTML;
              document.querySelector('.profileFilmsList').innerHTML = newContent;
              showProgress(`Processing page ${currentPageNumber + 1}`);
              resolve(true);
            } else {
              console.error(`No .profileFilmsList found on page ${nextPageUrl}`);
              resolve(false);
            }
          } else {
            console.error('Error accessing iframe contentDocument.');
            resolve(false);
          }
        } catch (error) {
          console.error('Error during iframe load:', error);
          resolve(false);
        } finally {
          document.body.removeChild(iframe);
        }
      };

      iframe.onerror = () => {
        console.error('Error loading next page.');
        document.body.removeChild(iframe);
        reject(false);
      };

      iframe.src = nextPageUrl;
    });
  }

  async function processCurrentPage() {
    return new Promise((resolve) => {
      const items = document.querySelectorAll(".profileFilmsList .item");
      if (items.length === 0) {
        console.error('No items found on the page.');
        resolve(false);
        return;
      }
      const pageMovies = Array.from(items).map(item => {
        const movie = {};

        const nameRusElement = item.getElementsByClassName("nameRus")[0];
        movie.nameRus = nameRusElement ? nameRusElement.innerHTML.replace(/&nbsp;/g, ' ').replace(/<\/?[^>]+(>|$)/g, "").trim() : "";

        const nameEngElement = item.getElementsByClassName("nameEng")[0];
        movie.nameEng = nameEngElement ? nameEngElement.textContent.trim() : "";

        const ratingElement = item.getElementsByClassName("vote")[0];
        movie.rating = ratingElement ? ratingElement.textContent.trim() : "";

        //const ratingElement = item.querySelector('.vote_widget .rateNow');
        //movie.rating = ratingElement ? ratingElement.getAttribute('vote') : "";

        const dateElement = item.getElementsByClassName("date")[0];
        movie.dateAdded = dateElement ? dateElement.textContent.trim() : "";

        const linkElement = item.querySelector("a[href*='/film/'], a[href*='/series/']");
        movie.id = linkElement ? linkElement.getAttribute("href").match(/\/(film|series)\/(\d+)\//)?.[2] : "";

        return movie;
      });

      movies = movies.concat(pageMovies);
      console.log(`Found ${pageMovies.length} movies on this page.`);
      showProgress(`Found ${pageMovies.length} movies on page ${currentPageNumber}`);
      resolve(true);
    });
  }

  function convertToCSV(data) {
    const headers = ["Const", "Your Rating", "Date Rated", "Title", "Original Title"];
    const csvRows = [
      headers.join(";"),
      ...data.map(movie => [
        movie.id,
        movie.rating,
        formatDate(movie.dateAdded),
        movie.nameRus,
        movie.nameEng
      ].join(";"))
    ];

    return csvRows.join("\n");
  }

  function convertToJSON(data) {
    const jsonMovies = data.map(movie => ({
      id: movie.id,
      name: movie.nameRus,
      alt_name: movie.nameEng,
      date_added: formatDate(movie.dateAdded),
      rating: movie.rating
    }));

    return JSON.stringify(jsonMovies, null, 2);
  }

  function formatDate(dateString) {
    const [datePart, timePart] = dateString.split(', ');
    const [day, month, year] = datePart.split('.');
    return `${year}-${month}-${day}`;
  }

  function download(data, filename, type) {
    var file = new Blob([data], { type: type });

    if (window.navigator.msSaveOrOpenBlob)
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }

  function showProgress(message) {
    let progressDiv = document.getElementById("KPX_progress");

    if (!progressDiv) {
      progressDiv = document.createElement("div");
      progressDiv.id = "KPX_progress";
      progressDiv.style.position = "fixed";
      progressDiv.style.top = "10px";
      progressDiv.style.right = "10px";
      progressDiv.style.backgroundColor = "green";
      progressDiv.style.color = "white";
      progressDiv.style.padding = "10px";
      progressDiv.style.borderRadius = "5px";
      progressDiv.style.zIndex = "9999";
      document.body.appendChild(progressDiv);
    }

    progressDiv.textContent = message;
  }

  window.addEventListener("load", addButton);
})();
