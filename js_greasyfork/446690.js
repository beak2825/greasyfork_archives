// ==UserScript==
// @name         Show Pitchfork review score
// @namespace    xcsnowcity
// @version      0.1
// @description  Show all the scores on the albums list page when you scrolling instead of  in every review page, therefore you don't need to check and click every album url anymore.
// @author       xcsnowcity
// @supportURL   https://github.com/xcsnowcity/TamperMonkey-Pitchfork/issues
// @match        https://pitchfork.com/reviews/albums/
// @match        https://pitchfork.com/reviews/albums/?page=*
// @match        https://pitchfork.com/reviews/best/albums/
// @match        https://pitchfork.com/reviews/best/albums/?page=*
// @match        https://pitchfork.com/reviews/best/reissues/
// @match        https://pitchfork.com/reviews/best/reissues/?page=*
// @match        https://pitchfork.com/best/high-scoring-albums/
// @match        https://pitchfork.com/best/high-scoring-albums/?page=*
// @match        https://pitchfork.com/reviews/sunday/
// @match        https://pitchfork.com/reviews/sunday/?page=*
// @match        https://pitchfork.com/reviews/albums/?genre=*
// @icon         https://cdn.pitchfork.com/assets/misc/favicon-32.png
// @connect      self
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446690/Show%20Pitchfork%20review%20score.user.js
// @updateURL https://update.greasyfork.org/scripts/446690/Show%20Pitchfork%20review%20score.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const searchUrl =
    "https://pitchfork.com/api/v2/search/?types=reviews&hierarchy=sections%2Freviews%2Falbums%2Cchannels%2Freviews%2Falbums&sort=publishdate%20desc%2Cposition%20asc&size=12&start=";
  const bestNewSearchUrl =
    "https://pitchfork.com/api/v2/search/?types=reviews&hierarchy=sections%2Freviews%2Falbums%2Cchannels%2Freviews%2Falbums&sort=publishdate%20desc%2Cposition%20asc&isbestnewmusic=true&size=12&start=";
  const bestReSearchUrl =
    "https://pitchfork.com/api/v2/search/?types=reviews&hierarchy=sections%2Freviews%2Falbums%2Cchannels%2Freviews%2Falbums&sort=publishdate%20desc%2Cposition%20asc&isbestnewreissue=true&size=12&start=";
  const bestHighSearchUrl =
    "https://pitchfork.com/api/v2/search/?types=reviews&hierarchy=sections%2Freviews%2Falbums%2Cchannels%2Freviews%2Falbums&sort=publishdate%20desc%2Cposition%20asc&rating_from=8.0&size=12&start=";
  const sundaySearchUrl =
    "https://pitchfork.com/api/v2/search/?types=reviews&hierarchy=sections%2Freviews%2Falbums%2Cchannels%2Freviews%2Falbums&sort=publishdate%20desc&tags=sunday%20review&size=12&start=";
  const genreSearchUrlHead = "https://pitchfork.com/api/v2/search/?";
  const genreSearchUrlTail =
    "&types=reviews&hierarchy=sections%2Freviews%2Falbums%2Cchannels%2Freviews%2Falbums&sort=publishdate%20desc%2Cposition%20asc&size=12&start=";

  // utilities dom parser
  // function pageParser(responseText) {
  //   // responseText = responseText.replace(/s+src=/ig, ' data-src=');
  //   // responseText = responseText.replace(/<script[^>]*?>[\S\s]*?<\/script>/ig, '');
  //   return new DOMParser().parseFromString(responseText, "text/html");
  // }

  //use localStorage to store album info  --to-do
  // const albumArray=[];
  // const add = (albumName, scoreResult) => {
  //   albumArray.push({albumName,scoreResult})
  //   localStorage.setItem('album',JSON.stringify(albumArray));
  // };

  //get page number
  const getPageNumber = () => {
    const param = new URLSearchParams(document.location.search);
    const pageNumber = param.get("page");
    return pageNumber;
  };

  //show this album's score
  const showScore = (url, score) => {
    const item = document.querySelector(`a[href='${url}']`);
    if (item.querySelector(".score").innerText != "...") {
      return;
    }
    item
      .querySelector(".score")
      .setAttribute("style", "padding-left:7px;" + "color:red");
    item.querySelector(".score").innerText = `${score}`;
  };

  //get this album's name, artist and score
  const getScore = (url, itemUrl) => {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      responseType: "document",
      onload(response) {
        if (response.status === 200) {
          const html = response.response;
          const scoreResult = (
            html.querySelector(".Rating-kkunXa") ||
            html.querySelector(".score-circle")
          ).innerText;
          showScore(itemUrl, scoreResult);
        }
      },
      onerror(err) {
        console.log("error", err);
      },
    });

    // add(albumName, scoreResult);
  };

  // get this album's detail url
  const getAlbum = (url) => {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      headers: {
        Accept: "application/json",
      },
      onload(response) {
        if (response.status === 200) {
          const albumList = JSON.parse(response.response).results.list;
          for (const item of albumList) {
            const itemAlbum = document.querySelector(`a[href='${item.url}']`);
            if (itemAlbum.querySelector(".score")) {
              continue;
            } else {
              const scoreDiv = document.createElement("span");
              scoreDiv.className = "score";
              scoreDiv.setAttribute(
                "style",
                "padding-left:7px;" + "color:#9b9b9b"
              );
              scoreDiv.innerText = "...";
              itemAlbum.lastChild.lastChild.append(scoreDiv);
              getScore("https://pitchfork.com" + item.url, item.url);
            }
          }
        }
      },
      onerror(err) {
        console.log("error", err);
      },
    });
  };

  // send request based on url path
  const sendRequest = (itemNumber) => {
    let addUrl = "";
    switch (location.pathname) {
      case "/reviews/best/albums/":
        addUrl = bestNewSearchUrl + itemNumber;
        break;
      case "/reviews/albums/":
        const param = new URLSearchParams(location.search);
        if (param.has("genre")) {
          param.delete("page");
          addUrl = genreSearchUrlHead +  param.toString() + genreSearchUrlTail + itemNumber;
        } else {
          addUrl = searchUrl + itemNumber;
        }
        break;
      case "/reviews/best/reissues/":
        addUrl = bestReSearchUrl + itemNumber;
        break;
      case "/best/high-scoring-albums/":
        addUrl = bestHighSearchUrl + itemNumber;
        break;
      case "/reviews/sunday/":
        addUrl = sundaySearchUrl + itemNumber;
        break;
      default:
        break;
    }
    getAlbum(addUrl);
  };

  const lazyLoadPage = () => {
    const pageNumber = getPageNumber();
    let oldPageNumber = 0;
    if (!pageNumber) {
      return;
    } else if (pageNumber != oldPageNumber) {
      oldPageNumber = pageNumber;
      const itemNumber = oldPageNumber * 12 - 12;
      sendRequest(itemNumber);
    }
  };

  window.onload = () => {
    const pageNumber = getPageNumber();
    if (!pageNumber) {
      sendRequest(0);
    } else {
      const itemNumber = pageNumber * 12 - 12;
      sendRequest(itemNumber);
    }
  };

  window.addEventListener("scroll", lazyLoadPage);

})();
