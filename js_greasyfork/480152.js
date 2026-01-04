// ==UserScript==
// @name         yLoader | YouTube Downloader & MP3 Converter
// @namespace    http://yloader.ws/
// @description  Worlds most advanced YouTube Downloader
// @author       yLoader.ws
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @version      0.6
// @downloadURL https://update.greasyfork.org/scripts/480152/yLoader%20%7C%20YouTube%20Downloader%20%20MP3%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/480152/yLoader%20%7C%20YouTube%20Downloader%20%20MP3%20Converter.meta.js
// ==/UserScript==

const buttons = ["MP3", "▼"];

const cssText = `

    .dropdown-menu {
        position: absolute;
        top: 40px;
        width: 145px;
        background-color: #e02f2f;
        padding: 0;
        z-index: 9999;
        border-radius: 20px;
    }

	.dropdown-menu-short {
        position: absolute;
        top: 54px;
        width: 145px;
        background-color: #e02f2f;
        padding: 0;
        z-index: 9999;
        border-radius: 20px;
		right: 0px;
    }

    .dropdown-item {
        border: solid #ac0101;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        padding: 9px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        color: white;
        font-size: var(--ytd-tab-system-font-size, 1.2rem);
        font-weight: var(--ytd-tab-system-font-weight, 500);
        letter-spacing: var(--ytd-tab-system-letter-spacing, .007px);
        text-align: center;
        user-select: none;
		display: flex;
		
    }

	.dropdown-item-icon{
		background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
		width: 14px;
		height: 14px;
		margin-right: 8px;
		margin-top: 1px;
	}

	.dropdown-item-text{
		height: 14px;
		font-weight: bold;
		color: white;
		font-size: 14px;
		margin-top: -1px;
	}

    .dropdown-item-top{
        border-radius: 20px 20px 0px 0px;
        border-width: 2px 2px 1px 2px;
    }

    .dropdown-item-bottom{
        border-radius: 0px 0px 20px 20px;
        border-width: 1px 2px 2px 2px;
    }

	.dropdown-item-top-short{
        border-radius: 20px 20px 0px 0px;
        border-width: 2px 2px 1px 2px;
    }

	.dropdown-item-middle-short{
        border-radius: 0px;
        border-width: 1px 2px 1px 2px;
    }

    .dropdown-item-bottom-short{
        border-radius: 0px 0px 20px 20px;
        border-width: 1px 2px 2px 2px;
    }

    .dropdown-item:hover {
        background-color: #eb4747;
    }

    .download-button {
        border: solid #ac0101;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        display: flex;
        flex-direction: row;
        cursor: pointer;
        background-color: #e02f2f;
        color: white;
        padding: var(--yt-button-padding);
        padding-top: 8px;
        margin: auto var(--ytd-subscribe-button-margin, 0px);
        white-space: nowrap;
        max-height: 36px;
        font-size: var(--ytd-tab-system-font-size, 1.2rem);
        font-weight: var(--ytd-tab-system-font-weight, 500);
        letter-spacing: var(--ytd-tab-system-letter-spacing, .007px);
        text-transform: var(--ytd-tab-system-text-transform, uppercase);
        transition: background-color 0.1s ease-out 20ms;
        user-select: none;
    }
    .left-button{
        border-radius: 20px 0px 0px 20px;
        border-width: 2px 1px 2px 2px;
        padding-right: 14px;
    }
    .right-button{
        border-radius: 0px 20px 20px 0px;
        border-width: 2px 2px 2px 1px;
        padding-right: 10px;
        padding-left: 10px;
		background-position: center;
        background-repeat: no-repeat;
        background-size: 40%;
		height: 36px;
		width: 38px;
    }
    .download-button:hover{
        background-color: #eb4747;
    }
    .download-button-text {
        --yt-formatted-string-deemphasize_-_display: initial;
        --yt-formatted-string-deemphasize-color: var(--yt-spec-text-secondary);
        --yt-formatted-string-deemphasize_-_margin-left: 4px;
		font-weight: bold;
    }
	.download-button-icon {
		background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
		width: 14px;
		height: 14px;
		margin-top: 1px;
	}
    .download-button-container {
        display: flex;
        flex-direction: row;
		position: relative;
    }
    .download-button-container-shorts {
        display: flex;
        flex-direction: column;
		position: relative;
    }
    .download-playlist-button {
        margin-right: 8px;
        margin-left: 0px;
    }
    .download-playlist-button-text {
        color: #E4E4E4;
    }
    .download-button-shorts {
        border: solid #ac0101;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        border-width: 2px;
        border-radius: 30px;
        height: 48px;
        width: 48px;
        text-align: center;
        line-height: 48px;
        cursor: pointer;
        background-color: #e02f2f;
        color: white;
        white-space: nowrap;
        font-size: 13px;
        font-weight: var(--ytd-tab-system-font-weight, 500);
        letter-spacing: var(--ytd-tab-system-letter-spacing, .007px);
        text-transform: var(--ytd-tab-system-text-transform, uppercase);
        transition: background-color 0.3s ease;
		background-position: center;
        background-repeat: no-repeat;
        background-size: 60%;
    }
    .download-button-shorts:hover{
        background-color: #eb4747;
    }
`;

(function () {

  var rightbtn;

  if (window.location.href.startsWith("https://www.youtube.com")) {
    ("use strict");

    let dropdownVisible = false;
    let dropdownShortsVisible = false;
    let youtubeshorts = false;

    function disableDropdown() {
      document.getElementById("dropdown-menu").remove();
      document.querySelector(".left-button").style.borderRadius =
        "20px 0px 0px 20px";
      document.querySelector(".left-button").style.borderBottomWidth = "2px";
      document.querySelector(".right-button").style.borderRadius =
        "0px 20px 20px 0px";
      document.querySelector(".right-button").style.borderBottomWidth = "2px";
      dropdownVisible = false;

      var iconDownSvg =
        '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z" fill="#ffffff" class="fill-000000"></path></svg>';
      rightbtn.style.backgroundImage =
        'url("data:image/svg+xml,' + encodeURIComponent(iconDownSvg) + '")';
    }

    function disableShortsDropdown() {
      document.getElementById("dropdown-menu-short").remove();

      dropdownShortsVisible = false;
    }

    function run() {
      setTimeout(function () {
        if (window.location.href.includes("youtube.com/watch")) {
          document.getElementById("downloadshorts").remove();
          youtubeshorts = false;
        }
      }, 1000);
    }

    // playlist pages will try to add the buttons repeatedly
    let playlistButtonsAdded = false;

    function addButtons() {
      setTimeout(() => {
        // apply css
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = cssText;
        document.head.appendChild(style);

        // check for playlist and create appropriate query
        let query = "#analytics-button:not(.download-panel)";

        let inPlaylist = location.href.includes("/playlist");
        if (inPlaylist && !playlistButtonsAdded) {
          query += ", div.metadata-buttons-wrapper:not(.download-panel)";
          playlistButtonsAdded = true;
        }

        if (window.location.toString().includes("youtube.com/shorts/")) {
          // check for youtube shorts
          youtubeshorts = true;
          query = "#actions:not(.download-panel)";
        }

        document.addEventListener("click", function (event) {
          var dropdownMenu = document.getElementById("analytics-button");
          var targetElement = event.target;

          if (
            !dropdownMenu.contains(targetElement) &&
            youtubeshorts === false
          ) {
            disableDropdown();
            dropdownVisible = false;
          }
        });

        document.querySelectorAll(query).forEach((panel) => {
          const container = document.createElement("div");

          if (youtubeshorts) {
            container.classList.add("download-button-container-shorts");
            container.id = "downloadshorts";

            const button = document.createElement("div");
            button.classList.add("download-button-shorts");

            var iconDownloadSvg =
              '<svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512"><path d="M383.6 322.7 278.6 423c-5.8 6-13.7 9-22.4 9s-16.5-3-22.4-9L128.4 322.7c-12.5-11.9-12.5-31.3 0-43.2 12.5-11.9 32.7-11.9 45.2 0l50.4 48.2v-217c0-16.9 14.3-30.6 32-30.6s32 13.7 32 30.6v217l50.4-48.2c12.5-11.9 32.7-11.9 45.2 0s12.5 31.2 0 43.2z" fill="#ffffff" class="fill-000000"></path></svg>';

            var iconCloseSvg =
              '<svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512"><path d="M437.5 386.6 306.9 256l130.6-130.6c14.1-14.1 14.1-36.8 0-50.9-14.1-14.1-36.8-14.1-50.9 0L256 205.1 125.4 74.5c-14.1-14.1-36.8-14.1-50.9 0-14.1 14.1-14.1 36.8 0 50.9L205.1 256 74.5 386.6c-14.1 14.1-14.1 36.8 0 50.9 14.1 14.1 36.8 14.1 50.9 0L256 306.9l130.6 130.6c14.1 14.1 36.8 14.1 50.9 0 14-14.1 14-36.9 0-50.9z" fill="#ffffff" class="fill-000000"></path></svg>';

            button.style.backgroundImage =
              'url("data:image/svg+xml,' +
              encodeURIComponent(iconDownloadSvg) +
              '")';

            button.addEventListener("click", () => {
              if (dropdownShortsVisible) {
                disableShortsDropdown();
                button.style.backgroundImage =
                  'url("data:image/svg+xml,' +
                  encodeURIComponent(iconDownloadSvg) +
                  '")';

                button.style.backgroundSize = "60%";
              } else {
                button.style.backgroundImage =
                  'url("data:image/svg+xml,' +
                  encodeURIComponent(iconCloseSvg) +
                  '")';

                button.style.backgroundSize = "45%";

                const dropdownMenu = document.createElement("div");
                dropdownMenu.id = "dropdown-menu-short";
                dropdownMenu.classList.add("dropdown-menu-short");

                for (let j = 0; j < 3; j++) {
                  if (j == 0) {
                    const dropdownItem = document.createElement("div");
                    dropdownItem.classList.add("dropdown-item");
                    dropdownItem.classList.add("dropdown-item-top-short");

                    var iconCameraSvg =
                      '<svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512"><path d="M115.2 378C87 378 64 400.9 64 429s23 51 51.2 51h37.2c15.3 0 28.9-6.8 38.3-17.4.1-.1.3-.1.4-.2.6-.6 1-1.5 1.5-2.1 1.3-1.6 2.5-3.2 3.5-5 9.5-14.2 14-32.9 14-47.2V207.5c.8-14.2 11.2-25.7 25.1-28.9 1.7-.4 5.4-1.2 5.4-1.2L390.5 149c.7-.1 1.3-.2 2-.3.8-.1 1.5-.1 2.4-.1 12.1 0 21.1 9.5 21.1 21.2v131.4c0 25.5 2.9 31.9-40.5 31.9h-20.1c-28.3 0-51.2 22.9-51.2 51s22.9 51 51.2 51h37.2c18.2 0 34.1-9.4 43.2-23.6 0-.1.1 0 .2 0 9-12.2 11.9-30.6 11.9-55.3V53.4c0-11.7-9.9-21.2-22-21.2-.7 0-1.4.1-2 .1l-3.1.5L203.3 74c-13.8 3.7-26.3 16.9-27.3 31.4v250.5c0 13.9 2 22.2-47.7 22.2h-13.1z" fill="#ffffff" class="fill-000000"></path></svg>';

                    const dropdownItemIcon = document.createElement("div");
                    dropdownItemIcon.classList.add("dropdown-item-icon");
                    dropdownItemIcon.style.backgroundImage =
                      'url("data:image/svg+xml,' +
                      encodeURIComponent(iconCameraSvg) +
                      '")';

                    const dropdownItemText = document.createElement("div");
                    dropdownItemText.classList.add("dropdown-item-text");
                    dropdownItemText.innerHTML = "download MP3";

                    dropdownItem.addEventListener("click", () => {
                      let url = window.location.toString();
                      let videoId = url.split("/").pop();

                      window.open("https://yloader.ws/yturlmp3/" + videoId);

                      disableShortsDropdown();

                      button.style.backgroundImage =
                        'url("data:image/svg+xml,' +
                        encodeURIComponent(iconDownloadSvg) +
                        '")';

                      button.style.backgroundSize = "60%";
                    });

                    dropdownItem.appendChild(dropdownItemIcon);
                    dropdownItem.appendChild(dropdownItemText);
                    dropdownMenu.appendChild(dropdownItem);
                  } else if (j == 1) {
                    const dropdownItem = document.createElement("div");
                    dropdownItem.classList.add("dropdown-item");
                    dropdownItem.classList.add("dropdown-item-middle-short");

                    var iconCameraSvg =
                      '<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M0 3h10v10H0V3ZM12 6l3-3h1v10h-1l-3-3V6Z" fill="#ffffff" class="fill-030708"></path></svg>';

                    const dropdownItemIcon = document.createElement("div");
                    dropdownItemIcon.classList.add("dropdown-item-icon");
                    dropdownItemIcon.style.backgroundImage =
                      'url("data:image/svg+xml,' +
                      encodeURIComponent(iconCameraSvg) +
                      '")';

                    const dropdownItemText = document.createElement("div");
                    dropdownItemText.classList.add("dropdown-item-text");
                    dropdownItemText.innerHTML = "download MP4";

                    dropdownItem.addEventListener("click", () => {
                      let url = window.location.toString();
                      let videoId = url.split("/").pop();

                      window.open("https://yloader.ws/yturlmp4/" + videoId);

                      disableShortsDropdown();

                      button.style.backgroundImage =
                        'url("data:image/svg+xml,' +
                        encodeURIComponent(iconDownloadSvg) +
                        '")';

                      button.style.backgroundSize = "60%";
                    });

                    dropdownItem.appendChild(dropdownItemIcon);
                    dropdownItem.appendChild(dropdownItemText);
                    dropdownMenu.appendChild(dropdownItem);
                  } else if (j == 2) {
                    const dropdownItem = document.createElement("div");
                    dropdownItem.classList.add("dropdown-item");
                    dropdownItem.classList.add("dropdown-item-bottom-short");

                    var iconImageSvg =
                      '<svg viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24"><path d="M24 6c0-2.2-1.8-4-4-4H4C1.8 2 0 3.8 0 6v12c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V6zM6 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm16 12c0 1.1-.9 2-2 2H4.4c-.9 0-1.3-1.1-.7-1.7l3.6-3.6c.4-.4 1-.4 1.4 0l.6.6c.4.4 1 .4 1.4 0l6.6-6.6c.4-.4 1-.4 1.4 0l3 3c.2.2.3.4.3.7V18z" fill="#ffffff" class="fill-000000"></path></svg>';

                    const dropdownItemIcon = document.createElement("div");
                    dropdownItemIcon.classList.add("dropdown-item-icon");
                    dropdownItemIcon.style.backgroundImage =
                      'url("data:image/svg+xml,' +
                      encodeURIComponent(iconImageSvg) +
                      '")';

                    const dropdownItemText = document.createElement("div");
                    dropdownItemText.classList.add("dropdown-item-text");
                    dropdownItemText.innerHTML = "get Thumbnail";

                    dropdownItem.addEventListener("click", () => {
                      let url = window.location.toString();
                      let videoId = url.split("/").pop();

                      window.open(
                        "https://yloader.ws/ytthumbnail/" + videoId
                      );

                      disableShortsDropdown();

                      button.style.backgroundImage =
                        'url("data:image/svg+xml,' +
                        encodeURIComponent(iconDownloadSvg) +
                        '")';

                      button.style.backgroundSize = "60%";
                    });

                    dropdownItem.appendChild(dropdownItemIcon);
                    dropdownItem.appendChild(dropdownItemText);
                    dropdownMenu.appendChild(dropdownItem);
                  }
                }
                container.appendChild(dropdownMenu);
                dropdownShortsVisible = true;
              }
            });

            container.appendChild(button);
          } else {
            container.classList.add("download-button-container");
            for (let i = 0; i < buttons.length; i++) {
              const button = document.createElement("div");

              button.classList.add("download-button");
              if (inPlaylist) {
                button.classList.add("download-playlist-button");
              }

              const buttonText = document.createElement("span");
              buttonText.classList.add("download-button-text");

              if (i === 0) {
                button.id = "leftbtn";
                button.classList.add("left-button");

                buttonText.innerHTML = "MP3";
                button.title = "download MP3 from video";

                button.appendChild(buttonText);

                button.addEventListener("click", () => {
                  var videoId = new URL(window.location.href).searchParams.get(
                    "v"
                  );

                  window.open("https://yloader.ws/yturlmp3/" + videoId);

                  if (dropdownVisible) {
                    disableDropdown();
                  }
                });
              } else if (i === 1) {
                button.classList.add("right-button");
                var iconDownSvg =
                  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z" fill="#ffffff" class="fill-000000"></path></svg>';
                var iconUpSvg =
                  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z" fill="#ffffff" class="fill-000000"></path></svg>';

                button.style.backgroundImage =
                  'url("data:image/svg+xml,' +
                  encodeURIComponent(iconDownSvg) +
                  '")';

                button.title = "";

                button.addEventListener("click", () => {
                  if (dropdownVisible) {
                    disableDropdown();
                  } else {
                    
                    button.style.backgroundImage =
                      'url("data:image/svg+xml,' +
                      encodeURIComponent(iconUpSvg) +
                      '")';

                    const dropdownMenu = document.createElement("div");
                    dropdownMenu.id = "dropdown-menu";
                    dropdownMenu.classList.add("dropdown-menu");

                    for (let j = 0; j < buttons.length; j++) {
                      if (j == 0) {
                        const dropdownItem = document.createElement("div");
                        dropdownItem.classList.add("dropdown-item");
                        dropdownItem.classList.add("dropdown-item-top");

                        var iconCameraSvg =
                          '<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M0 3h10v10H0V3ZM12 6l3-3h1v10h-1l-3-3V6Z" fill="#ffffff" class="fill-030708"></path></svg>';

                        const dropdownItemIcon = document.createElement("div");
                        dropdownItemIcon.classList.add("dropdown-item-icon");
                        dropdownItemIcon.style.backgroundImage =
                          'url("data:image/svg+xml,' +
                          encodeURIComponent(iconCameraSvg) +
                          '")';

                        const dropdownItemText = document.createElement("div");
                        dropdownItemText.classList.add("dropdown-item-text");
                        dropdownItemText.innerHTML = "download MP4";

                        dropdownItem.addEventListener("click", () => {
                          var videoId = new URL(
                            window.location.href
                          ).searchParams.get("v");

                          window.open(
                            "https://yloader.ws/yturlmp4/" + videoId
                          );

                          disableDropdown();
                        });

                        dropdownItem.appendChild(dropdownItemIcon);
                        dropdownItem.appendChild(dropdownItemText);
                        dropdownMenu.appendChild(dropdownItem);
                      } else if (j == 1) {
                        const dropdownItem = document.createElement("div");
                        dropdownItem.classList.add("dropdown-item");
                        dropdownItem.classList.add("dropdown-item-bottom");

                        var iconImageSvg =
                          '<svg viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24"><path d="M24 6c0-2.2-1.8-4-4-4H4C1.8 2 0 3.8 0 6v12c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V6zM6 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm16 12c0 1.1-.9 2-2 2H4.4c-.9 0-1.3-1.1-.7-1.7l3.6-3.6c.4-.4 1-.4 1.4 0l.6.6c.4.4 1 .4 1.4 0l6.6-6.6c.4-.4 1-.4 1.4 0l3 3c.2.2.3.4.3.7V18z" fill="#ffffff" class="fill-000000"></path></svg>';

                        const dropdownItemIcon = document.createElement("div");
                        dropdownItemIcon.classList.add("dropdown-item-icon");
                        dropdownItemIcon.style.backgroundImage =
                          'url("data:image/svg+xml,' +
                          encodeURIComponent(iconImageSvg) +
                          '")';

                        const dropdownItemText = document.createElement("div");
                        dropdownItemText.classList.add("dropdown-item-text");
                        dropdownItemText.innerHTML = "get Thumbnail";

                        dropdownItem.addEventListener("click", () => {
                          var videoId = new URL(
                            window.location.href
                          ).searchParams.get("v");
                          window.open(
                            "https://yloader.ws/ytthumbnail/" + videoId
                          );
                          disableDropdown();
                          button.style.backgroundImage =
                            'url("data:image/svg+xml,' +
                            encodeURIComponent(iconDownSvg) +
                            '")';
                        });

                        dropdownItem.appendChild(dropdownItemIcon);
                        dropdownItem.appendChild(dropdownItemText);
                        dropdownMenu.appendChild(dropdownItem);
                      }
                    }
                    container.appendChild(dropdownMenu);
                    dropdownVisible = true;
                  }
                });
              }

              container.appendChild(button);
              rightbtn = button;
            }
          }

          panel.classList.add("download-panel");
          panel.insertBefore(container, panel.firstElementChild);
        });
      }, 200);
    }

    window.onload = function () {
      run();
      addButtons();

      window.addEventListener("yt-navigate-start", run, true);
      window.addEventListener("yt-navigate-start", addButtons);
      window.addEventListener("yt-navigate-finish", addButtons);
    };
  }
})();
