// ==UserScript==
// @name         WeComics AP Features
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      1.0.8
// @description  Implements various features and fixes for WeComics
// @author       Quin15
// @match        https://m.wecomics.com/comic/index*
// @icon         https://www.google.com/s2/favicons?domain=wecomics.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/425495/WeComics%20AP%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/425495/WeComics%20AP%20Features.meta.js
// ==/UserScript==

if (document.body.innerText.indexOf('error_code":1001') > -1) {
    location.href = "https://m.wecomics.com/comic/index/id/" + window.location.search.replace('?id=', '') + window.location.search;
}

fetch("https://m.wecomics.com/h5/comic/detail/id/" + location.search.split('=')[1].split('&')[0] + "?plain=1",
      {"body": null,"method": "GET"
      }).then((response) => {
    response.json().then((data) => {
        data.data.chapter_list.reverse();
        unsafeWindow.data = data;

        var searchAP = document.createElement('div');
        searchAP.style = "float:left;width:100px;height:50px;background:#ff8c75;border-radius:4px;cursor:pointer;box-shadow:rgb(255 140 117 / 60%) 0rem 0.425rem 0.425rem 0rem;margin-top:15px;"
        searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin:10px 0px 0px 10px;"><p style="font-size:14px;text-align:center;padding:11px;color:#fff">Search On AP</p>`;
        document.querySelector('.comic-detail').appendChild(searchAP)
        searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + document.querySelector('.comic-detail .comic-info h2').innerText), "")});

        var coverImg = document.createElement('div');
        coverImg.style = "float:left;width:100px;height:50px;background:#ff8c75;border-radius:4px;cursor:pointer;box-shadow:rgb(255 140 117 / 60%) 0rem 0.425rem 0.425rem 0rem;margin:15px 0px 0px 10px;"
        coverImg.innerHTML = `<img src="` + data.data.comic.cover_v_url + `" style="float:left;height:30px;margin:10px 0px 0px 10px;"><p style="font-size:14px;text-align:center;padding:3px;color:#fff">Open Cover Image</p>`;
        document.querySelector('.comic-detail').appendChild(coverImg)
        coverImg.addEventListener("click", function() {open(data.data.comic.cover_v_url, "")});

        var checkElems = function() {if (document.querySelectorAll('.chapter-box .chapter-list .chapter-item')[16]) {setTimeout(addListeners, 1000)} else {setTimeout(checkElems, 100);}};
        checkElems();
    });
});

var addListeners = function() {
    document.querySelector('.show-num').remove();
    document.querySelector('.comic-detail .comic-info h2').style.userSelect = "text";
    document.querySelector('.comic-detail .comic-info h2').nextElementSibling.style.userSelect = "text";
    document.querySelector('.comic-detail').style = "overflow:hidden;padding-bottom:20px;"
    document.querySelector('.comic-detail .contents p').style = "user-select:text;overflow:visible;text-overflow:unset;-webkit-line-clamp:unset;height:auto;";
    document.querySelector('.chapter a').addEventListener("click", function() {populateTitles()});
    document.querySelectorAll('.chapter a')[1].addEventListener("click", function() {populateTitles()});
    document.querySelectorAll('.chapter-list .chapter-item')[16].addEventListener("click", function() {populateTitles()});

    if (location.href.indexOf('index?id') > -1) {
        window.history.replaceState({}, "", "https://m.wecomics.com/comic/index/id/" + window.location.search.replace('?id=', '') + window.location.search);
    };

    populateTitles();
}

unsafeWindow.populateTitles = function() {
    setTimeout(function() {
        var textNodes = document.querySelectorAll('.chapter-box .chapter-list .chapter-item');
        for (var i = 0; i < textNodes.length; i++) {
            var chapNum = parseInt(textNodes[i].firstElementChild.innerText);
            if (!isNaN(chapNum)) {
                textNodes[i].setAttribute("title", unsafeWindow.data.data.chapter_list[chapNum-1].publish_date + "   " + unsafeWindow.data.data.chapter_list[chapNum-1].title);
            }
        }
    }, 200);
}
