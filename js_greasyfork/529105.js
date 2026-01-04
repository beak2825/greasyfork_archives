// ==UserScript==
// @name        BTN - Embed trailer
// @author      Perilune/darisk
// @namespace   https://github.com/soranosita
// @version     2.1
// @description Embed trailer on series page
// @match       https://broadcasthe.net/series.php*
// @match       https://broadcasthe.net/user.php*action=edit*
// @icon        https://broadcasthe.net/favicon.ico
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/529105/BTN%20-%20Embed%20trailer.user.js
// @updateURL https://update.greasyfork.org/scripts/529105/BTN%20-%20Embed%20trailer.meta.js
// ==/UserScript==

let overlay, videoContainer, formContainer;

GM_addStyle(`
#overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1002;
  opacity: 0;
  transition: opacity 0.5s;
}
#video-container, #form-container {
  display: none;
  position: fixed;
  z-index: 1004;
}
#video-container {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 853px;
  height: 505px;
  z-index: 1003;
}
#video-frame {
  width: 100%;
  height: 100%;
}
`);

function addTrailerSettings() {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    const settingsBox = document.createElement("div");
    settingsBox.className = "box";
    settingsBox.innerHTML = `
    <div class="head"><strong>Trailer Settings</strong></div>
    <ul class="stats nobullet">
      <li><label><input type="radio" name="trailerPlacement" value="aboveTorrent"> Top</label></li>
      <li><label><input type="radio" name="trailerPlacement" value="aboveRequests"> Bottom</label></li>
      <li><label><input type="checkbox" name="trailerDefaultHidden"> Hidden by default</label></li>
    </ul>
  `;

    sidebar.appendChild(settingsBox);

    const savedPlacement = GM_getValue("trailerPlacement", "aboveRequests");
    document.querySelector(`input[value="${savedPlacement}"]`).checked = true;

    const trailerDefaultHidden = GM_getValue("trailerDefaultHidden", false);
    document.querySelector('input[name="trailerDefaultHidden"]').checked = trailerDefaultHidden;

    settingsBox.addEventListener("change", (e) => {
        if (e.target.name === "trailerPlacement") {
            GM_setValue("trailerPlacement", e.target.value);
            location.reload();
        } else if (e.target.name === "trailerDefaultHidden") {
            GM_setValue("trailerDefaultHidden", e.target.checked);
        }
    });
}

addTrailerSettings();

if (location.pathname === "/series.php") {
    fixBigTrailer();
}

function closeOverlay() {
    overlay.style.opacity = 0;
    setTimeout(() => {
        overlay.style.display = "none";
        videoContainer.style.display = "none";
        formContainer.style.display = "none";
        videoContainer.innerHTML = "";
    }, 10);
}

function clickHandler() {
    overlay.style.display = "block";
    setTimeout(() => (overlay.style.opacity = 1), 10);

    const param = document.querySelector("param[name='movie']");
    if (param) {
        if (!videoContainer.firstChild) {
            const rawURL = param.value;
            const embedURL = normalizeYouTubeURL(rawURL, true);

            const iframe = document.createElement("iframe");
            iframe.id = "video-frame";
            iframe.src = embedURL;
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = "strict-origin-when-cross-origin";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

            // Delay to ensure stable initialization
            setTimeout(() => {
                videoContainer.appendChild(iframe);
                videoContainer.style.display = "block";
            }, 200);
        }
    } else {
        const seriesId = document.querySelector("input[name='seriesid']").value;
        formContainer.innerHTML = `
      <div class="close" id="addouter">
        <div id="addtrailer" class="box">
          <div class="head">Add Trailer</div>
          <ul class="nobullet">
            <li>No trailer has been added for this show. You can add one by inserting its URL.</li>
            <li>Accepted formats:
              <br> http://www.youtube.com/watch?v=XXXXXXXXXXX
              <br> http://www.youtube.com/v/XXXXXXXXXXX
            </li>
            <li>
              <form action="series.php" method="post">
                <input type="hidden" name="action" value="add_youtube">
                <input type="hidden" name="seriesid" value="${seriesId}">
                <input type="text" name="youtube" size="20">
                <input type="submit" value="+">
                <br><button type="button" id="close">Close</button>
              </form>
            </li>
          </ul>
        </div>
      </div>`;
        formContainer.style.display = "block";
        formContainer.querySelector("#close").addEventListener("click", closeOverlay);
    }

    overlay.addEventListener("click", closeOverlay);
}

function normalizeYouTubeURL(url, autoplay = false) {
    try {
        const match = url.match(/(?:v=|\/v\/|embed\/)([A-Za-z0-9_-]{11})/);
        const id = match ? match[1] : null;
        if (!id) return url;

        const iframeUrl = new URL(`https://www.youtube.com/embed/${id}`);
        iframeUrl.searchParams.set('enablejsapi', '1');
        iframeUrl.searchParams.set('origin', 'https://www.youtube.com');
        iframeUrl.searchParams.set('autoplay', autoplay ? '1' : '0');
        iframeUrl.searchParams.set('widgetid', Math.floor(Math.random() * 1000000));

        return iframeUrl.toString();
    } catch (e) {
        console.warn("Invalid YouTube URL:", url, e);
        return url;
    }
}

function fixBigTrailer() {
    overlay = document.createElement("div");
    overlay.id = "overlay";

    videoContainer = document.createElement("div");
    videoContainer.id = "video-container";

    formContainer = document.createElement("div");
    formContainer.id = "form-container";

    overlay.append(videoContainer);
    document.body.append(overlay, formContainer);

    const oldBanner = document.querySelector("#playbutton").parentElement;
    const banner = oldBanner.cloneNode(true);
    oldBanner.replaceWith(banner);
    banner.addEventListener("click", clickHandler);

    function getYouTubeLink() {
        return (
            document.querySelector("object param[name='movie']")?.value ||
            document.querySelector("object embed[src*='youtube.com']")?.src
        );
    }

    function createYouTubeBox(videoURL) {
        const embedURL = normalizeYouTubeURL(videoURL, false);
        const tableHTML = `
      <table class="torrent_table" id="discog_table" width="100%">
        <tbody>
          <tr class="colhead_dark">
            <td width="70%" colspan="2">
              <strong>Trailer</strong>
              (<a href="#" class="toggle-trailer">show</a>)
            </td>
          </tr>
        </tbody>
        <tbody class="trailer-content" style="display: none;">
          <tr class="datatable_rowb nobr">
            <td colspan="2">
              <iframe width="100%" height="400" src="${embedURL}" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </td>
          </tr>
        </tbody>
      </table>`;

        const torrentTable = document.querySelector("table.torrent_table#discog_table");
        const requestsTable = document.querySelector("table.border");

        if (torrentTable && requestsTable) {
            const trailerPlacement = GM_getValue("trailerPlacement", "aboveTorrent");
            const container =
                  trailerPlacement === "aboveTorrent"
            ? torrentTable.parentNode
            : requestsTable.parentNode;

            container.insertBefore(createElementFromHTML(tableHTML),
                                   trailerPlacement === "aboveTorrent" ? torrentTable : requestsTable);

            const trailerDefaultHidden = GM_getValue("trailerDefaultHidden", false);
            const content = container.querySelector(".trailer-content");
            const toggleButton = container.querySelector(".toggle-trailer");

            if (trailerDefaultHidden) {
                content.style.display = "none";
                toggleButton.textContent = "show";
            } else {
                content.style.display = "table-row-group";
                toggleButton.textContent = "hide";
            }

            toggleButton.addEventListener("click", function (e) {
                e.preventDefault();
                if (content.style.display === "none") {
                    content.style.display = "table-row-group";
                    toggleButton.textContent = "hide";
                } else {
                    content.style.display = "none";
                    toggleButton.textContent = "show";
                }
            });
        }
    }

    function createElementFromHTML(htmlString) {
        const div = document.createElement("div");
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector("table.torrent_table#discog_table") && !document.querySelector(".border iframe")) {
            const videoURL = getYouTubeLink();
            if (videoURL) {
                createYouTubeBox(videoURL);
                observer.disconnect();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll(".box .head strong").forEach(header => {
        if (header.textContent.includes("Youtube Trailer")) {
            header.closest(".box").style.display = "none";
        }
    });
}
