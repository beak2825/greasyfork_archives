// ==UserScript==
// @author      jvlflame
// @name        JAVLibrary - Highlight Owned Movies
// @version     0.0.4

// @include     https://*javlibrary.com/*/
// @include     *://*/movie/*
// @include     *://*/cn*
// @include     *://*/tw*
// @include     *://*/ja*
// @include     *://*/en*

// @description Highlight owned movies on JAVLibrary

// @namespace https://greasyfork.org/users/63118
// @downloadURL https://update.greasyfork.org/scripts/429241/JAVLibrary%20-%20Highlight%20Owned%20Movies.user.js
// @updateURL https://update.greasyfork.org/scripts/429241/JAVLibrary%20-%20Highlight%20Owned%20Movies.meta.js
// ==/UserScript==

let styles = `
    .owned {
      background: cornflowerblue;
      color: black;
    }
`;
let styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

var buttonDiv = document.createElement("div");
buttonDiv.innerHTML =
  '<button id="refresh-owned-btn" type="button">' +
  "Refresh Owned Movies</button>";
buttonDiv.setAttribute("class", "refreshowned category");
document.querySelector(".menul1").appendChild(buttonDiv);

//--- Activate the newly added button.
document
  .getElementById("refresh-owned-btn")
  .addEventListener("click", ButtonClickAction, false);

function ButtonClickAction(zEvent) {
  // Write owned movie list to localstorage so we don't have to
  // fetch the list on every page
  aggregateMovieList();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateDOM() {
  //const moviesOnCurrentPage = [];
  const moviesOnCurrentPage = document.querySelectorAll(".video");

  // We can parse the list more easily as an array
  if (localStorage.getItem("ownedMovies")) {
    const ownedMovies = localStorage.getItem("ownedMovies").split(",");
    try {
      for (let i = 0; i < moviesOnCurrentPage.length; i++) {
        if (
          ownedMovies.includes(
            moviesOnCurrentPage[i].children[0].attributes[0].value.split(
              "?v="
            )[1]
          )
        ) {
          moviesOnCurrentPage[i].children[0].children[0].classList.add("owned");
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

const movieList = [];

function setMoviesToLocalStorage(ownedMovies) {
  const ownedMovieList = ownedMovies.join(",");
  ownedMovies.forEach((movie) => {
    movieList.push(movie);
  });
  localStorage.setItem("ownedMovies", ownedMovieList);
}

function getOwnedMovieCount() {
  const movieCount = fetch(
    `https://www.javlibrary.com/en/userowned.php?list&mode=&u=${getCookie(
      "userid"
    )}&page=0`,
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "upgrade-insecure-requests": "1",
      },
      referrer: `https://www.javlibrary.com/en/userowned.php?list&mode=&u=${getCookie(
        "userid"
      )}`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )
    .then((res) => res.text())
    .then((html) => {
      // Initialize the DOM parser
      var parser = new DOMParser();

      // Parse the text
      var doc = parser.parseFromString(html, "text/html");

      return doc.querySelector(".boxtitle").innerHTML.split(": ")[1];
    });

  return movieCount;
}

function getOwnedMoviesByPage(pageNum) {
  const data = fetch(
    `https://www.javlibrary.com/en/userowned.php?list&mode=&u=${getCookie(
      "userid"
    )}&page=${pageNum}`,
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "sec-gpc": "1",
        "upgrade-insecure-requests": "1",
        cookie: `${document.cookie}`,
      },
      referrer: `https://www.javlibrary.com/en/userowned.php?list&mode=&u=${getCookie(
        "userid"
      )}`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
    }
  )
    .then((res) => res.text())
    .then((html) => {
      // Initialize the DOM parser
      var parser = new DOMParser();

      // Parse the text
      var doc = parser.parseFromString(html, "text/html");

      const vidsOnPage = doc.querySelectorAll(".video");
      const ownedMovies = [];
      for (let i = 0; i < vidsOnPage.length; i++) {
        const movieId = ownedMovies.push(
          vidsOnPage[i].children[1].attributes[0].value.split("?v=")[1]
        );
      }
      return ownedMovies;
    });

  return data;
}

function getOwnedMovies() {
  // fetch owned movies from the javlibrary owned movies list
  fetch("https://www.javlibrary.com/en/mv_owned_print.php", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      pragma: "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
    },
    referrer: "https://www.javlibrary.com/en/myaccount.php",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  })
    .then((res) => {
      // return the raw text
      return res.text();
    })
    .then((html) => {
      // Initialize the DOM parser
      var parser = new DOMParser();

      // Parse the text
      var doc = parser.parseFromString(html, "text/html");

      const ownedMovies = [];
      const titles = doc.querySelectorAll(".title");
      titles.forEach((title) => {
        if (title.innerHTML !== "Title") {
          ownedMovies.push(title.innerHTML.split(" ")[0].replace("\n", ""));
        }
      });
      return ownedMovies;
    })
    .then((movies) => {
      setMoviesToLocalStorage(movies);
    })
    .catch((err) =>
      window.alert(`Failed to fetch and/or set owned movie list ${err}`)
    );
}

async function aggregateMovieList() {
  console.time("Get owned movies");
  const movieList = [];
  const movieCount = await getOwnedMovieCount();
  const pageCount = await Math.ceil(movieCount / 20);

  for (let i = 0; i <= pageCount; i++) {
    document.getElementById(
      "refresh-owned-btn"
    ).innerHTML = `Please wait ${i} / ${pageCount} (Do not close this page)`;
    const movies = await getOwnedMoviesByPage(i);
    for (let j = 0; j < movies.length; j++) {
      if (movies[j] !== "") {
        movieList.push(movies[j]);
      }
    }
    await sleep(100);
  }

  setMoviesToLocalStorage(movieList);
  document.getElementById("refresh-owned-btn").innerHTML = "Completed!";
  console.timeEnd("Get owned movies");
}

updateDOM();
