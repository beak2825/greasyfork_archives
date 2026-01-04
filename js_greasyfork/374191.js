// ==UserScript==
// @name        JAVLib tag助手
// @namespace   JAVLib tag助手
// @description 鼠标悬停在javLibrary图片上时显示该视频类型。

// @include     http*://www.p26y.com/*
// @include     http*://www.k25m.com/*
// @include     http*://www.javlibrary.com/*
// @include     http*://www.k25m.com/*
// @include     http*://avmoo.online/*


// @version     1.141
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/374191/JAVLib%20tag%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/374191/JAVLib%20tag%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

"use strict";
let videos = document.querySelector(".videos");
let showTags = true
function removeBeforeFirstSpace(str) {
    return str.split(' ').slice(1).join(' ');
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWithRetry(url, attempts, delayDuration) {
    for (let i = 0; i < attempts; i++) {
        try {
            // Your request logic here
            await delay(delayDuration);
            return; // Success, exit loop
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i < attempts - 1) {
                await delay(delayDuration); // Wait before retrying
            } else {
                throw error; // Max attempts reached, throw error
            }
        }
    }
}

async function getInformation() {
    const videoPage = document; // Refers to the whole current HTML document
    const url = window.location.href
    const genres = Array.from(videoPage.querySelectorAll("#video_genres .genre")).map(genre => genre.innerText);
    const code = videoPage.querySelector("#video_id .text").innerText;
    const director = videoPage.querySelector("#video_director .text").innerText;
    const company = videoPage.querySelector("#video_maker .text").innerText;
    const actors = Array.from(videoPage.querySelectorAll(".cast .star")).map(star => star.innerText);
    const title_jp = removeBeforeFirstSpace(videoPage.querySelector(".post-title.text").innerText);
    const release_date = videoPage.querySelector("#video_date .text").innerText;
    const poster = videoPage.querySelector("#video_jacket_img").src;
    // Make a POST request using jQuery's $.ajax
    $.ajax({
        type: "POST",
        url: "https://www.mingren.life/av/general",
        contentType: "application/json", // Set the content type to application/json
        dataType: "json",
        data: JSON.stringify([{
            url,
            genres,
            code,
            director,
            company,
            actors,
            title_jp,
            title_en: "",
            release_date,
            poster
        }]),
        success: function(result) {
            console.log("Request succeeded:", result);
        },
        error: function(err) {
            console.error("Request failed:", err);
        }
    });
}

var good = ["监禁", "轮奸", "凌辱", "轮奸", "SM", "拘束", "调教", "强奸", "肛交"]
var get_eng_title = function(url, data) {
    let en_url = (url.replace("/cn/", "/en/"))
}

function hasCommonElement(array1, array2) {
    const set1 = new Set(array1);
    return array2.some(element => set1.has(element));
}

function applyTags(videoElement, genres) {
    // Logic to apply tags to the video element
    const tags = genres.join(', ');
    videoElement.setAttribute("data-toggle", "tooltip");
    videoElement.setAttribute("title", tags);
    if (hasCommonElement(genres, good)) {
        videoElement.style.color = "#e3a807"; // Example styling, adjust as necessary
    }
}

var display_not_on_server = function(element){
    var buttonText = $("<span>").text("未更新").css("background-color", "pink"); // Create a span for the text and set the background color to pink
    var firstDiv = $(element).children("div").first(); // Get the first div child of the element
    firstDiv.append(" ").append(buttonText); // Append the span to the first div child
};

var addInformation = function(result) {
    console.log(result)
    let subtitle = result.DownloadMovies[0].subtitle
    let downloaded = true
    let mosic = result.DownloadMovies[0].mosic
    let error = result.DownloadMovies[0].error
    let torrent = result.DownloadMovies[0].torrent_name
    let dataTable = $("#video_info")[0]
    let innerHtml = `<div id="" class="item">
<table>
<tbody><tr>
	<td class="header" ${error ? 'style="color: red"' : ""}>种子:</td>
	<td class="text"><span id="cast36486" class="cast"><span class="star"><a rel="tag">${torrent}</a></span></td>
	<td class="icon"></td>
</tr>
</tbody></table>
<table>
<tbody><tr>?
	<td class="header" >马赛克:</td>
	<td class="text"><span id="cast36486" class="cast"><span class="star"><a rel="tag">${mosic ? "有" : "无"}</a></span></td>
	<td class="icon"></td>
</tr>
</tbody></table>

</div>
<div id="" class="item">
<table>
<tbody><tr>
	<td class="header">字幕:</td>
	<td class="text"><span id="cast36486" class="cast"><span class="star"><a rel="tag">${subtitle ? "有" : "无"}</a></span></td>
	<td class="icon"></td>
</tr>
</tbody></table>
</div>`
    const d = document.createElement("div")
    d.innerHTML = innerHtml
    dataTable.appendChild(d)
    let title = $(".post-title")[0]
    let title_cn = document.createElement("div")
    title_cn.innerHTML = title.innerHTML
    title_cn.innerText = result.title_cn
    $("#video_title")[0].appendChild(title_cn)
}

const promises = [];
if (videos) {
    // if this is a list page
    $('.video').each((index, video) => {
        // Extract the code as before
        const code = ($(video).find("a")[0].title.split(" ")[0]).replace(/-/g, '');
        // Create a new promise for each AJAX request and add it to the promises array
        const promise = new Promise((resolve, reject) => {
            $.ajax({
                url: `https://www.mingren.life/av/${code}`,
                success: (result) => {
                    if (!result) {
                        // Handle no result scenario
                    } else if (result.DownloadMovies && result.DownloadMovies.length > 0) {
                        if (result.DownloadMovies[0].subtitle) {
                            $(video).css("background-color", "pink");
                        } else {
                            $(video).css("background-color", "#c6eb34");
                        }
                    }
                    resolve({ result, video });
                },
                error: (error) => {
                    // Reject the promise in case of an error
                    reject(error);
                }
            });
        });

        promises.push(promise);
    });

    // Use Promise.all to handle all the promises together
    Promise.all(promises).then(async (results) => {
        // Process each movie that need to add to db
        var new_movies = results.filter(({result, video}) => !(result))
        var old_movies = results.filter(({result, video}) => !!(result))

        // for new movies, we need to extract all info and eng subtitles. However, set a 3 sec limit
        for (const {video} of new_movies) {
            // Assuming get_tags is properly defined to handle the video element
            display_not_on_server($(video).find("a")[0]);
        }
        // for all movies, we need to extract tags only if when showTags is true
        results.forEach(({result, video}) => {
            if (showTags && result && result.MovieGenres) {
                // Assuming result.genres is an array of genre tags for the movie
                applyTags($(video).find("a")[0], result.MovieGenres.map(genre => genre.Genres.name))
                // for old movies, we want to check result[i].DownloadMovies[0].error is false
                if (result.DownloadMovies.length > 0 && result.DownloadMovies[0].error) {
                    $(video).css("background-color", "red");
                }
            }

        });


    }).catch(error => {
        // Handle any error that occurred during any of the ajax calls
        console.error("An error occurred: ", error);
    });
} else {
    // this is a single page
    let code = document.querySelector("#video_id .text").innerText
    let downloaded = false
    $.ajax({
        url: `https://www.mingren.life/av/${code}`,
        success: (result) => {
            if (! result) {
                getInformation()
            } else if (result.DownloadMovies.length > 0) {
                addInformation(result)
            }
        },
        error: (error) => {
            // Reject the promise in case of an error
            reject(error);
        }
    });
}



