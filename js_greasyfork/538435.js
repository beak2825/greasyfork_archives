// ==UserScript==
// @name         KU LMS Enhanced Player
// @namespace    Violentmonkey Scripts
// @match        https://kucom.korea.ac.kr/em/*
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @version      1.5.1
// @author       EATSTEAK (Vanilla JS conversion by Gemini)
// @license      MIT License; https://opensource.org/licenses/MIT
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @require      https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js
// @description  Provides more feature for Video player of KU LMS.
// @downloadURL https://update.greasyfork.org/scripts/538435/KU%20LMS%20Enhanced%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/538435/KU%20LMS%20Enhanced%20Player.meta.js
// ==/UserScript==

// Variable for features.
const DEBUG = true;
const DOWNLOAD = true;
const NOTIFICATION = true;

// Inject bootstrap and custom stylesheet.
GM_addStyle(`
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');

#downloader-ext {
  background-color: rgba(0, 0, 0, 0.7);
}

#playlist {
  display: none;
  background-color: rgba(0, 0, 0, 0.7);
}

#playlist-view {
  display: flex;
  overflow-x: auto;
  max-height: 160px;
}

#playlist-view article {
  max-height: 100%;
  max-width: 160px;
  width: auto;
}

#playlist-view p {
  color: white;
}

#playlist-view img {
  max-height: 80%;
  max-width: 80%;
}

#playlist-options {
  display: flex;
}
`);

setInterval(async ()=>{
  const autoplay = await GM_getValue('autoplay', false);
  if (autoplay) {
    window.onbeforeunload = function(){};
  } else {
    window.onbeforeunload = function(){return true};
  }
}, 100);

let currentVideo;

/**
 * GM_xmlhttpRequest를 fetch처럼 사용할 수 있게 해주는 Promise 기반 래퍼 함수입니다.
 * @param {string} url 요청할 URL
 * @param {object} options GM_xmlhttpRequest에 전달할 옵션 객체
 * @returns {Promise<object>} 응답 객체를 resolve하는 Promise
 */
function GM_fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const { method = "GET", headers, responseType, data } = options;
    GM_xmlhttpRequest({
      method,
      url,
      headers,
      responseType,
      data,
      onload: (response) => {
        if (response.status >= 200 && response.status < 300) {
          resolve(response);
        } else {
          reject(new Error(`Request failed with status ${response.status}: ${response.statusText}`));
        }
      },
      onerror: (response) => {
        reject(new Error(`Network error: ${response.statusText}`));
      },
      ontimeout: () => {
        reject(new Error('Request timed out.'));
      }
    });
  });
}


/*
 ********************
 * NOTIFICATIONS
 ********************
 */

function sendVideoNotification(type) {
  if (!NOTIFICATION) return;
  let text = '';
  let title = '';

  if (type === 'start') {
    title = '동영상 시작됨';
    text = currentVideo ? `${currentVideo.author} - ${currentVideo.title} 동영상이 시작되었습니다.` : '동영상이 시작되었습니다.';
  } else if (type === 'end') {
    title = '동영상 종료됨';
    text = currentVideo ? `${currentVideo.author} - ${currentVideo.title} 동영상이 종료되었습니다.` : '동영상이 종료되었습니다.';
  } else if (type === 'pause') {
    title = '동영상 중단됨';
    text = currentVideo ? `${currentVideo.author} - ${currentVideo.title} 동영상이 중단되었습니다. 종료되었을 수 있습니다.` : '동영상이 중단되었습니다.';
  }

  if (title && text) {
    GM_notification({ title, text });
  }
}



/*
 ********************
 * MUTATION OBSERVERS
 ********************
 */

// Check whether player is loaded and execute callback using MutationObserver.
function checkPlayerLoad(onLoad) {
  VM.observe(document.body, () => {
    // Check vc-content-meta-title(class of title) is exist.
    if (document.querySelector('.vc-content-meta-title')) {
      onLoad();
      return true; // Stop observing
    }
  });
}

// Check whether video is ended and execute callback using MutationObserver.
function checkVideoEnd(onEnd) {
  const target = document.querySelector('.player-restart-btn');
  if (target) {
    const observer = new MutationObserver(() => {
      onEnd();
      observer.disconnect();
    });
    observer.observe(target, { attributes: true, attributeFilter: ['style'] });
  }
}

// Watch whether dialog is popped or not.
function watchDialog(onPopup) {
  const target = document.getElementById('confirm-dialog');
  if (target) {
    const observer = new MutationObserver(() => {
      onPopup();
    });
    observer.observe(target, { attributes: true, attributeFilter: ['style'] });
  }
}

// Check at least one video is playing.
function checkVideoPlaying(onStop) {
  const interval = setInterval(() => {
    const videoElems = Array.from(document.querySelectorAll('video'));
    const isSomePlaying = videoElems.some((vid) => isVideoPlaying(vid));
    if (!isSomePlaying) {
      clearInterval(interval);
      onStop();
    }
  }, 1000);
}

function isVideoPlaying(video) {
  // From https://stackoverflow.com/a/31196707
  return !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
}

/*
 *****************
 * VIDEO METADATA UTILS
 *****************
 */

// Retrive video data from id.
async function retriveVideoData(contentId) {
    try {
        const response = await GM_fetch('https://kucom.korea.ac.kr/viewer/ssplayer/uniplayer_support/content.php?content_id=' + contentId, {
            responseType: 'document' // 'xml' is a valid type, 'document' is safer for parsing
        });
        return response.responseXML;
    } catch (error) {
        console.error("Error fetching video data:", error);
        return null;
    }
}

/*
 ***************
 * DEBUG
 ***************
 */
function prepareDebug(id) {
  const debugBtn = document.createElement('button');
  debugBtn.className = 'btn btn-warning btn-sm mx-1';
  debugBtn.textContent = 'XML 데이터 열람';

  document.getElementById("downloader-ext").appendChild(debugBtn);

  debugBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = 'https://kucom.korea.ac.kr/viewer/ssplayer/uniplayer_support/content.php?content_id=' + id;
    link.target = '_blank';
    link.click();
    link.remove();
  });
}

/*
 ********************
 * COPY URL
 ********************
 */
async function copyURL() {
  await navigator.clipboard.writeText(location.href);
  alert("복사되었습니다");
}

/*
 ***************
 * DOWNLOAD
 ***************
 */

function prepareDownload({ title, author, videoUris }) {
  if (!videoUris || videoUris.length === 0) {
    console.warn("다운로드할 미디어를 찾을 수 없습니다.");
    return;
  }

  const downloaderExt = document.getElementById("downloader-ext");

  if (videoUris.length === 1) {
    // --- 단일 미디어 파일 처리 ---
    const videoUri = videoUris[0];
    const videoTitle = `${author} - ${title}.mp4`;
    const downloadBtnText = '다운로드';

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn btn-secondary btn-sm mx-1';
    downloadBtn.textContent = downloadBtnText;
    downloaderExt.appendChild(downloadBtn);

    downloadBtn.addEventListener('click', () => {
      GM_xmlhttpRequest({
        method: "GET",
        url: videoUri,
        headers: { "referer": "https://kucom.korea.ac.kr/" },
        responseType: "blob",
        onprogress: (event) => {
          if (event.lengthComputable) {
            const percent = ((event.loaded / event.total) * 100).toFixed(2);
            downloadBtn.textContent = `${downloadBtnText} 중 (${percent}%)`;
          } else {
            downloadBtn.textContent = `${downloadBtnText} 중`;
          }
          downloadBtn.disabled = true;
        },
        onerror: (event) => {
          console.error("다운로드 오류:", event.error);
          downloadBtn.textContent = `${downloadBtnText} (오류!)`;
          downloadBtn.disabled = false;
        },
        ontimeout: () => {
          console.error('다운로드 시간 초과!');
          downloadBtn.textContent = `${downloadBtnText} (시간 초과)`;
          downloadBtn.disabled = false;
        },
        onload: (response) => {
          const blob = response.response;
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = videoTitle;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(link.href);

          downloadBtn.textContent = `${downloadBtnText} 완료`;
          downloadBtn.disabled = false;
        }
      });
    });
  } else {
    // --- 다중 미디어 파일 처리 ---
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';
    dropdown.style.display = 'inline';

    dropdown.innerHTML = `
      <button class="btn btn-secondary btn-sm dropdown-toggle mx-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        다운로드(${videoUris.length})
      </button>
      <ul class="dropdown-menu" aria-labelledby="downloadMenu"></ul>
    `;
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');

    videoUris.forEach((videoUri, idx) => {
      const videoTitle = `${author} - ${title} (${idx + 1}).mp4`;
      const downloadBtnText = `파일 #${idx + 1}`;

      const listItem = document.createElement('li');
      const linkElement = document.createElement('a');
      linkElement.className = 'dropdown-item';
      linkElement.href = '#';
      linkElement.textContent = downloadBtnText;
      listItem.appendChild(linkElement);
      dropdownMenu.appendChild(listItem);

      listItem.addEventListener('click', (e) => {
        e.preventDefault();

        GM_xmlhttpRequest({
          method: "GET",
          url: videoUri,
          headers: { "referer": "https://kucom.korea.ac.kr/" },
          responseType: "blob",
          onprogress: (event) => {
            if (event.lengthComputable) {
              const percent = ((event.loaded / event.total) * 100).toFixed(2);
              linkElement.textContent = `${downloadBtnText} 중 (${percent}%)`;
            } else {
              linkElement.textContent = `${downloadBtnText} 중`;
            }
          },
          onerror: (event) => {
            console.error("다운로드 오류:", event.error);
            linkElement.textContent = `${downloadBtnText} (오류!)`;
          },
          ontimeout: () => {
            console.error('다운로드 시간 초과!');
            linkElement.textContent = `${downloadBtnText} (시간 초과)`;
          },
          onload: (response) => {
            const blob = response.response;
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = videoTitle;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
            linkElement.textContent = `${downloadBtnText} 완료`;
          }
        });
      });
    });

    downloaderExt.appendChild(dropdown);
  }
}


/*
 ***************
 * PLAYLIST
 ***************
 */

async function preparePlaylistView(selfData) {
  const playlistSection = document.createElement('section');
  playlistSection.className = 'py-1';
  playlistSection.id = 'playlist';

  playlistSection.innerHTML = `
    <section class="p-1" id="playlist-view"></section>
    <section id="playlist-options">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="autoplay">
        <label class="form-check-label text-white" for="autoplay">자동 재생</label>
      </div>
    </section>
  `;

  document.getElementById("content-metadata").appendChild(playlistSection);

  const autoPlayCheckboxInput = playlistSection.querySelector('#autoplay');
  autoPlayCheckboxInput.addEventListener('click', async () => {
    await toggleAutoplay();
    await reconstructPlaylist(selfData);
  });

  await reconstructPlaylist(selfData);
}

async function reconstructPlaylist(selfData) {
  const playlist = JSON.parse(await GM_getValue('playlist', "[]"));
  const autoplay = await GM_getValue('autoplay', false);
  const playlistView = document.getElementById('playlist-view');
  const autoplayCheckbox = document.getElementById('autoplay');

  if (!playlistView || !autoplayCheckbox) return;

  playlistView.innerHTML = "";
  autoplayCheckbox.checked = autoplay;
  autoplayCheckbox.value = autoplay;

  playlist.forEach((item) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <article class="px-1" style="cursor: pointer;">
        <section style="display: flex;">
          <img class="mx-auto" src="${item.thumbnail}" />
          <button type="button" class="btn-close btn-close-white" aria-label="닫기"></button>
        </section>
        <p>${item.title}</p>
      </article>
    `.trim();
    const playlistItem = tempDiv.firstChild;

    playlistItem.addEventListener('click', async () => {
      await removeFromPlaylist(item.id);
      await reconstructPlaylist(selfData);
    });
    playlistView.appendChild(playlistItem);
  });

  if (!playlist.find((item) => item.id === selfData.id)) {
    const addToPlaylistBtn = document.createElement('button');
    addToPlaylistBtn.className = 'btn btn-info mx-1 mb-2';
    addToPlaylistBtn.textContent = '대기열에 추가';

    addToPlaylistBtn.addEventListener('click', async () => {
      await addToPlaylist(selfData.id, selfData.title, selfData.thumbnail, selfData.uri);
      await reconstructPlaylist(selfData);
    });
    playlistView.appendChild(addToPlaylistBtn);
  }
}

async function removeFromPlaylist(id) {
  const playlist = JSON.parse(await GM_getValue('playlist', "[]"));
  const removedList = playlist.filter((item) => item.id !== id);
  await GM_setValue('playlist', JSON.stringify(removedList));
}

async function addToPlaylist(id, title, thumbnail, uri) {
  const playlist = JSON.parse(await GM_getValue('playlist', "[]"));
  await GM_setValue('playlist', JSON.stringify([...playlist, { id, title, thumbnail, uri }]));
}

/*
 *************
 * AUTOPLAY
 *************
 */

async function toggleAutoplay() {
  const autoplay = await GM_getValue('autoplay', false);
  await GM_setValue('autoplay', !autoplay);
}

async function prepareNextVideo() {
    document.getElementById('countdown-next')?.remove();
    document.getElementById('disable-autoplay-next')?.remove();
    document.getElementById('play-next')?.remove();

  const playlist = JSON.parse(await GM_getValue('playlist', "[]"));
  const autoplay = await GM_getValue('autoplay', false);

  if (playlist.length > 0) {
    const nextVideo = playlist[0];
    if (autoplay) {
      countNextAutoplay(nextVideo);
    } else {
      injectNextButton(nextVideo);
    }
  }
}

function countNextAutoplay(nextVideo) {
  console.log(nextVideo.uri);
  const playerCenter = document.querySelector('.player-center-control-wrapper');
  if (!playerCenter) return;

  const countdownSection = document.createElement('section');
  countdownSection.className = 'text-white';
  countdownSection.id = 'countdown-next';
  countdownSection.textContent = '5초 후 다음 동영상으로 이동합니다...';

  const disableSection = document.createElement('section');
  disableSection.id = 'disable-autoplay-next';
  const cancelButton = document.createElement('button');
  cancelButton.className = 'btn btn-danger btn-sm';
  cancelButton.textContent = '취소';
  disableSection.appendChild(cancelButton);

  let isCancelled = false;
  cancelButton.addEventListener('click', () => {
    isCancelled = true;
  });

  playerCenter.appendChild(countdownSection);
  playerCenter.appendChild(disableSection);

  let count = 4;
  const interval = setInterval(async () => {
    if (isCancelled) {
      await toggleAutoplay();
      clearInterval(interval);
      await prepareNextVideo();
      return;
    }
    if (count === 0) {
      clearInterval(interval);
      await removeFromPlaylist(nextVideo.id);
      window.location.href = nextVideo.uri;
    }
    countdownSection.textContent = `${count}초 후 다음 동영상으로 이동합니다...`;
    count -= 1;
  }, 1000);
}

function injectNextButton(nextVideo) {
  console.log(nextVideo.uri);
  const playerCenter = document.querySelector('.player-center-control-wrapper');
  if (!playerCenter) return;
  
  const nextBtnContainer = document.createElement('section');
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-primary';
  nextBtn.id = 'play-next';
  nextBtn.textContent = '다음 동영상 재생';
  
  nextBtn.addEventListener('click', async () => {
    await removeFromPlaylist(nextVideo.id);
    window.location.href = nextVideo.uri;
  });

  nextBtnContainer.appendChild(nextBtn);
  playerCenter.appendChild(nextBtnContainer);
}

function countAutoplay() {
  const btnWrapper = document.querySelector('.vc-front-screen-btn-wrapper');
  if(!btnWrapper) return;

  const countdownSection = document.createElement('section');
  countdownSection.className = 'text-white';
  countdownSection.id = 'countdown';
  countdownSection.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  countdownSection.textContent = '3초 후 동영상을 재생합니다...';

  const disableSection = document.createElement('section');
  disableSection.id = 'disable-autoplay';
  const cancelButton = document.createElement('button');
  cancelButton.className = 'btn btn-danger btn-sm';
  cancelButton.textContent = '취소';
  disableSection.appendChild(cancelButton);

  let isCancelled = false;
  cancelButton.addEventListener('click', () => {
    isCancelled = true;
  });
  
  btnWrapper.appendChild(countdownSection);
  btnWrapper.appendChild(disableSection);

  let count = 2;
  const interval = setInterval(async () => {
    if (isCancelled) {
      await toggleAutoplay();
      clearInterval(interval);
      countdownSection.remove();
      disableSection.remove();
      return;
    }
    if (count === 0) {
      clearInterval(interval);
      document.querySelector('.vc-front-screen-play-btn')?.click();
      checkVideoPlaying(() => {
        sendVideoNotification('pause');
      });
      sendVideoNotification('start');
    }
    countdownSection.textContent = `${count}초 후 동영상을 재생합니다...`;
    count -= 1;
  }, 1000);
}

function countAutoConfirm() {
  const okBtn = document.querySelector('#confirm-dialog .confirm-ok-btn');
  const dialog = document.getElementById('confirm-dialog');
  if (!okBtn || !dialog) return;

  okBtn.textContent = '확인 (3)';
  let count = 2;
  const interval = setInterval(() => {
    if (dialog.style.display === 'none') {
      clearInterval(interval);
      return;
    }
    if (count === 0) {
      clearInterval(interval);
      okBtn.click();
    }
    okBtn.textContent = `확인 (${count})`;
    count -= 1;
  }, 1000);
}


// Main execution logic
checkPlayerLoad(async () => {
  // Find id from html attribute.
  const id = document.documentElement.id.replace("-page", "");
  
  // Create extension section and inject below metadata section.
  const extSection = document.createElement('section');
  extSection.className = 'py-1';
  extSection.id = 'downloader-ext';
  document.getElementById("content-metadata").appendChild(extSection);

  // Auto trigger play button if autoplay is enabled.
  if (await GM_getValue('autoplay', false)) {
    countAutoplay();
  }

  // Watch alert dialog for autoplay support.
  watchDialog(async () => {
    const dialog = document.getElementById('confirm-dialog');
    if (dialog && dialog.style.display !== 'none') {
      if (await GM_getValue('autoplay', false)) {
        countAutoConfirm();
      }
    }
  });

  // Check when the video ends.
  checkVideoEnd(async () => {
    await prepareNextVideo();
    sendVideoNotification('end');
  });

  // Create debug button if debug mode is enabled.
  if (DEBUG) prepareDebug(id);

  // Create "Open in new tab" button.
  const openInNewTabBtn = document.createElement('a');
  openInNewTabBtn.className = 'btn btn-primary btn-sm mx-1';
  openInNewTabBtn.role = 'button';
  openInNewTabBtn.href = window.location.href;
  openInNewTabBtn.target = '_blank';
  openInNewTabBtn.textContent = '새 탭에서 열기';
  extSection.appendChild(openInNewTabBtn);
  
  // Create "Open in new tab (no attendance)" button if applicable.
  const cleanUrl = window.location.origin + window.location.pathname;
  if (cleanUrl !== window.location.href) {
    const noAttendanceBtn = document.createElement('a');
    noAttendanceBtn.className = 'btn btn-primary btn-sm mx-1';
    noAttendanceBtn.role = 'button';
    noAttendanceBtn.href = cleanUrl;
    noAttendanceBtn.target = '_blank';
    noAttendanceBtn.textContent = '새 탭(출석X)';
    extSection.appendChild(noAttendanceBtn);
  }

  // Retrieve video data and set up UI.
  const xml = await retriveVideoData(id);
  if (xml) {
    const contentData = xml.querySelector('content_metadata');
    const title = contentData?.querySelector('title')?.textContent.trim() || 'Untitled';
    const author = contentData?.querySelector('author name')?.textContent.trim() || 'Unknown';
    const thumbnail = xml.querySelector('content_thumbnail_uri')?.textContent.trim() || '';
    const uri = window.location.href;

    currentVideo = { title, author, uri };
    
    // ==================  MODIFIED LOGIC START ==================
    let uniqueVideoUris = [];

    // 1. Try to find URIs from the old XML structure first.
    const oldStructureUris = [...xml.querySelectorAll('main_media html5 media_uri')].map(node => node.textContent.trim());

    if (oldStructureUris.length > 0) {
        console.log("Old XML structure detected.");
        uniqueVideoUris = [...new Set(oldStructureUris)];
    } else {
        // 2. If not found, try the new structure (template + filename).
        console.log("New XML structure detected. Constructing URIs.");
        const baseUriTemplate = xml.querySelector('service_root media media_uri[target="all"]')?.textContent.trim();
        const mediaFileNodes = xml.querySelectorAll('content_playing_info story main_media');

        if (baseUriTemplate && mediaFileNodes.length > 0) {
            const constructedUris = [...mediaFileNodes].map(node => {
                const fileName = node.textContent.trim();
                return baseUriTemplate.replace('[MEDIA_FILE]', fileName);
            });
            uniqueVideoUris = [...new Set(constructedUris)]; // Remove potential duplicates.
        }
    }
    // ==================  MODIFIED LOGIC END ==================

    console.log("찾은 비디오 URI:", uniqueVideoUris);

    // Prepare playlist UI.
    await preparePlaylistView({ id, title, thumbnail, uri });

    const playlistBtn = document.createElement('button');
    playlistBtn.className = 'btn btn-success btn-sm mx-1';
    playlistBtn.textContent = '대기열 보기';
    extSection.appendChild(playlistBtn);
    
    playlistBtn.addEventListener('click', async () => {
        const playlistElement = document.getElementById('playlist');
        if (playlistElement.style.display === 'none') {
            await reconstructPlaylist({ id, title, thumbnail, uri });
            playlistElement.style.display = 'block';
            playlistBtn.textContent = '대기열 숨기기';
            playlistBtn.className = 'btn btn-danger btn-sm mx-1';
        } else {
            playlistElement.style.display = 'none';
            playlistBtn.textContent = '대기열 보기';
            playlistBtn.className = 'btn btn-success btn-sm mx-1';
        }
    });

    // Prepare download buttons using the found URIs.
    if (uniqueVideoUris.length > 0) {
      prepareDownload({ title, author, videoUris: uniqueVideoUris });
    } else {
      console.warn("No video URIs could be found in either XML structure.");
    }
  }
});