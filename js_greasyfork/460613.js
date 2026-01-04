// ==UserScript==
// @name         Smugmug Album Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Smugmug Album DownloaD
// @author       _John#1218
// @supportURL   https://github.com/JDipi/Smugmug-Album-Downloader/issues
// @match        https://*.smugmug.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smugmug.com
// @connect      https://photos.smugmug.com/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/460613/Smugmug%20Album%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/460613/Smugmug%20Album%20Downloader.meta.js
// ==/UserScript==

/***************** IMPORTANT!!! ********************
For this script to work properly, do the following:
  1) Go to your Tampermonkey dashboard
  2) Click settings
  3) Change the 1st option (Config Mode) to "Advanced"
  4) Scroll down to "Downloads BETA"
  5) Change "Download Mode" to "Browser API"
  6) Save and exit, accept the new "Manage Download"
     permission if prompted.
Doing this allows Tampermonkey to save the images to a
folder in your default download location, rather than
just spewing all the images out.
**************************************************/

$(document).ready(() => {
  $(`<button id="downloadAlb">Download Album</button>`).appendTo(
    ".sm-gallery-cover-title"
  );

GM_addStyle(/*css*/ `
  .sm-gallery-cover-title {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  #downloadAlb {
    height: 40px;
    border-radius: 10px;
  }
  #downloadAlb:hover {
    background-color: gray;
  }

  .downloadProgressContainer progress {
    width: 100%;
    margin: 5px 0px;
  }

  .downloadProgressContainer {
    position: fixed;
    border-radius: 10px;
    margin: 10px;
    z-index: 100;
    background: #2c2f33;
    width: fit-content;
    color: black;
    padding: 10px;
    font-weight: bold;
    width: fit-content;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 1)
  }

  #downloadProgress {
    display: flex;
    justify-content: space-between;
    color: #99aab5;
  }

  #errors > p {
    color: #ff7171;
    border: 1px solid #99aab5;
    margin: 2px 0px;
    border-radius: 5px;
    padding: 5px;
  }

  #errors a code {
    color: #9393ff;
    text-decoration: underline;
  }

  #errors {
    max-height: 270px;
    overflow: auto;
    width: 800px;
    margin: 0px 0px 5px 0px;
  }

  #close {
    background-color: #7289da;
    border-radius: 8px;
    padding: 5px;
    width: 70px;
    color: white;
    border: 1px solid #99aab5;
    cursor: pointer;
  }

  #close:hover {
    background-color: #55659f;
  }
`);

  $("#downloadAlb").on("click", function (e) {
    let url = $("link[rel=alternate][type*=rss+xml]").attr("href");

    let albumRegex = new RegExp(/\d*_[a-zA-Z\d]*/gm);
    let domainRegex = new RegExp(/\/\/(.*)(?=\.smugmug\.com)/gm);

    let albumId = url.match(albumRegex)[0].split("_")[0];
    let albumKey = url.match(albumRegex)[0].split("_")[1];
    let domain = window.location.href.match(domainRegex);
    let links = [];

    const settings = {
      async: true,
      crossDomain: true,
      url: `https:${domain}.smugmug.com/services/api/json/1.4.0?galleryType=album&albumId=${albumId}&albumKey=${albumKey}&PageNumber=2&imageId=0&returnModelList=true&PageSize=5000&method=rpc.gallery.getalbum`,
      method: "GET",
    };

    $.ajax(settings).done(function (response) {
      console.log(response);

      if (GM_info.downloadMode !== "browser") {
        alert(`Please change the Tampermonkey download mode to browser and read the important comment at the top of the script!!!`)
        return
      }

      if (
        !confirm(
          `You are about to download ${response.Pagination.TotalItems} images. Continue?`
        )
      )
        return;

      for (let image in response.Images) {
        let picID = response.Images[image].GalleryUrl.split("/").slice(-1)[0];

        let height = 0;
        let largestSize = "";
        let ext = "";

        // gets largest file of those available
        for (let size in response.Images[image].Sizes) {
          if (response.Images[image].Sizes[size].height > height) {
            height = response.Images[image].Sizes[size].height;
            largestSize = size;
            ext = response.Images[image].Sizes[size].ext;
          }
        }

        let url = `https://photos.smugmug.com/photos/${picID}/0/${largestSize}/${picID}-${largestSize}.${ext}`;
        links.push(url);
      }

      let done = 0;

      
      $("body").prepend(
        `<div class="downloadProgressContainer">
          <div id="downloadProgress">
            Downloading: [/${response.Pagination.TotalItems}]
          </div>
            <progress id="dp" value="" max="${response.Pagination.TotalItems}"></progress>
            <div id="errors"></div>
            <button id="close">Close</button>
        </div>`
      );

      $('#close').on('click', function(e) {
        links = []
        done = 0
        $('.downloadProgressContainer').remove()
      })

      // checks if the whole list has been run through and displays error / finished message
      const finish = () => {
        if (done == links.length) {
          $("#downloadProgress").text("Finished!");
          if ($('#errors').children().length) {
            $("#downloadProgress").text(`Finished with ${$('#errors').children().length} errors.`);
          }
        }
      }

      links.forEach((url, i) => {
        let name = response.Albums[0].Title + "/" + url.split("/").slice(-1)[0];
        GM_download({
          url,
          name,
          onload: (e) => {
            done += 1;
            $("#downloadProgress").text(
              `Downloading: [${done}/${response.Pagination.TotalItems}]`
            );
            $("progress#dp").attr("value", done)
            finish()
          },
          onerror: (e) => {
            done += 1
            $("#errors").append(
              `<p>Error: <code>${e.error}</code> for image [${i+1}/${response.Pagination.TotalItems}] 
                <a href="${url}" target="_blank">
                  <code>${name}</code>
                </a>
              </p>`
              );
              finish()
          },
          ontimeout: (e) => {
            done += 1
            $('#errors').append(
              `<p>The request for image [${i+1}/${response.Pagination.TotalItems}]
                <a href="${url}" target="_blank">
                  <code>${name}</code>
                </a>
              Timed out</p>`
            )
            finish()
          }
        });
      });
    });
  });
});
