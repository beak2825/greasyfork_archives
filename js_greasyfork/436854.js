// ==UserScript==
// @name        SSU LMS Enhanced Player
// @namespace   Violentmonkey Scripts
// @match       https://commons.ssu.ac.kr/em/*
// @grant       GM_download
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_notification
// @version     1.3.0
// @author      EATSTEAK
// @license     MIT License; https://opensource.org/licenses/MIT
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @require https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js
// @require https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js
// @description Provides more feature for Video player of SSU LMS.
// @downloadURL https://update.greasyfork.org/scripts/436854/SSU%20LMS%20Enhanced%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/436854/SSU%20LMS%20Enhanced%20Player.meta.js
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

let currentVideo;


/*
 ********************
 * NOTIFICATIONS
 ********************
*/

function sendVideoNotification(type) {
  if(!NOTIFICATION) return;
  if(type === 'start') {
    let text = '동영상이 시작되었습니다.';
    if(currentVideo) {
      text = `${currentVideo.author} - ${currentVideo.title} 동영상이 시작되었습니다.`;
    }
    GM_notification({
      title: '동영상 시작됨',
      text
    });
  } else if(type === 'end') {
    let text = '동영상이 종료되었습니다.';
    if(currentVideo) {
      text = `${currentVideo.author} - ${currentVideo.title} 동영상이 종료되었습니다.`;
    }
    GM_notification({
      title: '동영상 종료됨',
      text
    });
  } else if(type === 'pause') {
    let text = '동영상이 중단되었습니다.';
    if(currentVideo) {
      text = `${currentVideo.author} - ${currentVideo.title} 동영상이 중단되었습니다. 종료되었을 수 있습니다.`;
    }
    GM_notification({
      title: '동영상 중단됨',
      text
    })
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
    if($('.vc-content-meta-title').length) {
      onLoad();
      return true;
    }
  });
}

// Check whether video is ended and execute callback using MutationObserver.
function checkVideoEnd(onEnd) {
  const observer = new MutationObserver((mutations) => {
    onEnd();
    observer.disconnect();
  });
  const target = document.getElementsByClassName('player-restart-btn');
  if(target.length) {
    observer.observe(target[0], { attributes: true, attributeFilter: ['style'] });
  }
}

// Watch whether dialog is popped or not.
function watchDialog(onPopup) {
  const observer = new MutationObserver((mutations) => {
    onPopup();
  });
  const target = document.getElementById('confirm-dialog');
  if(target) {
    observer.observe(target, { attributes: true, attributeFilter: ['style'] });
  }
}

// Check at least one video is playing.
function checkVideoPlaying(onStop) {
  const interval = setInterval(() => {
    const videoElems = document.getElementsByTagName('video');
    const isSomePlaying = videoElems.some((vid) => isVideoPlaying(vid));
    if(!isSomePlaying) {
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
 ****************
 * VIDEO METADATA UTILS
 ****************
*/

// Retrive video data from id.
function retriveVideoData(contentId, onReceive) {
  $.ajax({
    url: 'https://commons.ssu.ac.kr/viewer/ssplayer/uniplayer_support/content.php?content_id=' + contentId,
    type: 'GET',
    dataType: 'xml',
    success: (xml) => {
      onReceive(xml);
    }
  });
}

/*
 ***************
 * DEBUG
 ***************
*/
function prepareDebug(id) {
  const debugBtn = $('<button class="btn btn-warning btn-sm mx-1">XML 데이터 열람</button>');
  $("#downloader-ext").append(debugBtn);
  $(debugBtn).on('click', () => {
    const link = document.createElement('a');
    link.href = 'https://commons.ssu.ac.kr/viewer/ssplayer/uniplayer_support/content.php?content_id=' + id;
    link.target = '_blank';
    link.click();
    link.remove();
  });
}

/*
 ***************
 * DOWNLOAD
 ***************
*/

function prepareDownload({ title, author, mainMedia, mediaUri, pseudoUri }) {
  // If media is exist
  if(mainMedia.length) {
    // If media is singular, create download button.
    if(mainMedia.length == 1) {
      const video = $(mainMedia).text();
      // Construct cdn uri. However, it's not used because of CO policy.
      const cdnVideoUri = mediaUri.replace('[MEDIA_FILE]', video);
      // Find SO(Same-Origin) media uri from pseudo uri in data.
      const soVideoUri = pseudoUri.replace('[MEDIA_FILE]', video);
      const videoTitle = author + ' - ' + title + '.mp4';
      const downloadBtnText = '다운로드';
      const downloadBtn = $("<button class='btn btn-secondary btn-sm mx-1'>" + downloadBtnText + "</button>");
      $("#downloader-ext").append(downloadBtn);
      $(downloadBtn).on('click', async () => {
        const altDownload = await GM_getValue('altDownload', false);
        if(!altDownload) {
          const link = document.createElement('a');
          link.href = soVideoUri;
          link.download = videoTitle;
          link.click();
          link.remove();
        } else {
          const href = window.location.href;
          const url = new URL(cdnVideoUri);
          GM_download({
            url: cdnVideoUri,
            name: videoTitle,
            headers: {
              Accept: 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
              Host: url.host,
              Referer: 'https://commons.ssu.ac.kr/',
              Range: 'bytes=0-'
            },
            onprogress: (event) => {
              const percent = Math.round(((event.loaded / event.total) * 100));
              $(downloadBtn).text(`${downloadBtnText} (${percent}%)`);
              $(downloadBtn).attr('disabled', true);
            },
            onerror: (event) => {
              console.error(event.error);
              $(downloadBtn).text(`${downloadBtnText} (오류!)`);
              $(downloadBtn).attr('disabled', false);
            },
            ontimeout: () => {
              console.error('Timeout!');
              $(downloadBtn).text(`${downloadBtnText} (시간 초과)`);
              $(downloadBtn).attr('disabled', false);
            },
            onload: () => {
              $(downloadBtn).text(downloadBtnText);
              $(downloadBtn).attr('disabled', false);
            }
          });
        }
      });
      // If media are plural, create download dropdown with all found media.
    } else {
      const dropdown = $('<div class="dropdown" style="display: inline;"></div>');
      $(dropdown).append('<button class="btn btn-secondary btn-sm dropdown-toggle mx-1" type="button" id="downloadMenu" data-bs-toggle="dropdown" aria-expanded="false">다운로드(' + mainMedia.length + ')</button>');
      const dropdownMenu = $('<ul class="dropdown-menu" aria-labelledby="downloadMenu"></ul>');
      $(mainMedia).each(function (idx) {
        const video = $(this).text();
        const cdnVideoUri = mediaUri.replace('[MEDIA_FILE]', video);
        const soVideoUri = pseudoUri.replace('[MEDIA_FILE]', video).replace('_pseudo', '');
        const videoTitle = author + ' - ' + title + '(' + (idx + 1) + ').mp4';
        const downloadBtnText = '#' + (idx + 1);
        const downloadBtn = $("<a class='dropdown-item'>" + downloadBtnText + "</a>");
        $(dropdownMenu).append(downloadBtn);
        $(downloadBtn).on('click', async () => {
          const altDownload = await GM_getValue('altDownload', false);
          if(!altDownload) {
            const link = document.createElement('a');
            console.log(soVideoUri);
            link.href = soVideoUri;
            link.download = videoTitle;
            link.target = '_blank';
            link.click();
            link.remove();
          } else {
            const href = window.location.href;
            const url = new URL(cdnVideoUri);
            GM_download({
              url: cdnVideoUri,
              name: videoTitle,
              headers: {
                Host: url.host,
                Referer: 'https://commons.ssu.ac.kr/',
                Range: 'bytes=0-'
              },
              onprogress: (event) => {
                const percent = Math.round(((event.loaded / event.total) * 100));
                $(downloadBtn).text(`${downloadBtnText} (${percent}%)`);
                $(downloadBtn).attr('disabled', true);
              },
              onerror: (event) => {
                console.error(event.error);
                $(downloadBtn).text(`${downloadBtnText} (오류!)`);
                $(downloadBtn).attr('disabled', false);
              },
              ontimeout: () => {
                console.error('Timeout!');
                $(downloadBtn).text(`${downloadBtnText} (시간 초과)`);
                $(downloadBtn).attr('disabled', false);
              },
              onload: () => {
                $(downloadBtn).text(downloadBtnText);
                $(downloadBtn).attr('disabled', false);
              }
            });
          }
        });
      });
      $(dropdown).append(dropdownMenu);
      $("#downloader-ext").append(dropdown);
    }
    (async () => {
      const altDownload = await GM_getValue('altDownload', false);
      const altDownloadCheckbox = $(`<div class="form-check-inline">
  <input class="form-check-input" type="checkbox" value="${altDownload}" id="altDownload">
  <label class="form-check-label text-white" for="flexCheckDefault">
    대체 다운로드 방법 사용
  </label>
</div>`);
      $('#downloader-ext').append(altDownloadCheckbox);
      $('#altDownload').change(async function () {
        GM_setValue('altDownload', this.checked);
      });
    })();
  }
}

/*
 ***************
 * PLAYLIST
 ***************
*/

// Prepare playlist view from data.
async function preparePlaylistView(selfData) {
  const playlistSection = $('<section class="py-1" id="playlist"></section>');
  const playlistViewSection = $('<section class="p-1" id="playlist-view"></section>');
  const playlistOptionsSection = $('<section id="playlist-options"></section>');
  const autoPlayCheckbox = $(`
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="autoplay">
  <label class="form-check-label text-white" for="autoplay">자동 재생</label>
</div>
`);
  $(autoPlayCheckbox).on('click', async () => {
    await toggleAutoplay();
    reconstructPlaylist(selfData);
  });
  $(playlistOptionsSection).append(autoPlayCheckbox);
  $(playlistSection).append(playlistViewSection);
  $(playlistSection).append(playlistOptionsSection);
  $("#content-metadata").append(playlistSection);
  await reconstructPlaylist(selfData);
}

// (Re)Construct playlist data.
async function reconstructPlaylist(selfData) {
  const playlist = JSON.parse(await GM_getValue('playlist', "[]"));
  const autoplay = await GM_getValue('autoplay', false);
  $("#playlist-view").html("");
  $("#autoplay").attr("checked", autoplay);
  $("#autoplay").attr("value", autoplay);
  playlist.forEach((item, idx) => {
    const playlistItem = $(`
<article class="px-1">
  <section style="display: flex;">
    <img class="mx-auto" src="${item.thumbnail}" />
    <button type="button" class="btn-close btn-close-white" aria-label="닫기"></button>
  </section>
  <p>${item.title}</p>
</article>
`);
    $(playlistItem).on('click', async () => {
      await removeFromPlaylist(item.id);
      reconstructPlaylist(selfData);
    });
    $("#playlist-view").append(playlistItem);
  });
  if(playlist.find((item) => item.id === selfData.id) === undefined) {
    const addToPlaylistBtn = $('<button class="btn btn-info mx-1 mb-2">대기열에 추가</button>');
    $(addToPlaylistBtn).on('click', async () => {
      await addToPlaylist(selfData.id, selfData.title, selfData.thumbnail, selfData.uri);
      reconstructPlaylist(selfData);
    });
    $('#playlist-view').append(addToPlaylistBtn);
  }
}

// Remove video from playlist.
async function removeFromPlaylist(id) {
  const playlist = JSON.parse(await GM_getValue('playlist', "[]"));
  const removedList = playlist.filter((item) => item.id !== id);
  GM_setValue('playlist', JSON.stringify(removedList));
}

// Add video to playlist.
async function addToPlaylist(id, title, thumbnail, uri) {
  const playlist = JSON.parse(await GM_getValue('playlist', "[]"));
  GM_setValue('playlist', JSON.stringify([...playlist, { id, title, thumbnail, uri }]));
}

/*
 ************
 * AUTOPLAY
 ************
*/

// Toggle autoplay function.
async function toggleAutoplay() {
  const autoplay = await GM_getValue('autoplay', false);
  await GM_setValue('autoplay', !autoplay);
}

// Prepare next video by autoplay status.
async function prepareNextVideo() {
  $('#countdown-next').remove();
  $('#disable-autoplay-next').remove();
  $('#play-next').remove();
  const playlist = JSON.parse(await GM_getValue('playlist', "[]"));
  const autoplay = await GM_getValue('autoplay', false);
  if(playlist.length > 0) {
    const nextVideo = playlist[0];
    if(autoplay) {
      countNextAutoplay(nextVideo);
    } else {
      injectNextButton(nextVideo);
    }
  }
}

// Countdown to next video.
function countNextAutoplay(nextVideo) {
  console.log(nextVideo.uri);
  const countdownSection = $('<section class="text-white" id="countdown-next">5초 후 다음 동영상으로 이동합니다...</section>');
  const disableSection = $('<section id="disable-autoplay-next"><button class="btn btn-danger btn-sm">취소</button></section>');
  let isCancelled = false;
  $(disableSection).on('click', () => {
    isCancelled = true;
  });
  $('.player-center-control-wrapper').append(countdownSection);
  $('.player-center-control-wrapper').append(disableSection);
  let count = 4;
  const interval = setInterval(async () => {
    if(isCancelled) {
      await toggleAutoplay();
      clearInterval(interval);
      prepareNextVideo();
      return;
    }
    if(count == 0) {
      clearInterval(interval);
      await removeFromPlaylist(nextVideo.id);
      window.location.href = nextVideo.uri;
    }
    $('#countdown-next').text(`${count}초 후 다음 동영상으로 이동합니다...`);
    count -= 1;
  }, 1000);
}

// Add button to next video.
function injectNextButton(nextVideo) {
  console.log(nextVideo.uri);
  const nextBtn = $('<section><button class="btn btn-primary" id="play-next">다음 동영상 재생</button></section>');
  $(nextBtn).on('click', async () => {
    await removeFromPlaylist(nextVideo.id);
    window.location.href = nextVideo.uri;
  });
  $('.player-center-control-wrapper').append(nextBtn);
}

// Countdown for automatic video start.
function countAutoplay() {
  const countdownSection = $('<section class="text-white" id="countdown" style="background-color: rgba(0, 0, 0, 0.7)">3초 후 동영상을 재생합니다...</section>');
  const disableSection = $('<section id="disable-autoplay"><button class="btn btn-danger btn-sm">취소</button></section>');
  let isCancelled = false;
  $(disableSection).on('click', () => {
    isCancelled = true;
  });
  $('.vc-front-screen-btn-wrapper').append(countdownSection);
  $('.vc-front-screen-btn-wrapper').append(disableSection);
  let count = 2;
  const interval = setInterval(async () => {
    if(isCancelled) {
      await toggleAutoplay();
      clearInterval(interval);
      $('#countdown').remove();
      $('#disable-autoplay').remove();
      return;
    }
    if(count == 0) {
      clearInterval(interval);
      $('.vc-front-screen-play-btn').trigger('click');
      checkVideoPlaying(() => {
        sendVideoNotification('paused');
      });
      sendVideoNotification('start');
    }
    $('#countdown').text(`${count}초 후 동영상을 재생합니다...`);
    count -= 1;
  }, 1000);
}

// Countdown for automatic dialog confirmation.
function countAutoConfirm() {
  const okBtn = $('#confirm-dialog .confirm-ok-btn');
  const dialog = $('#confirm-dialog');
  $(okBtn).text('확인 (3)');
  let count = 2;
  const interval = setInterval(async () => {
    if($(dialog).css('display') === 'none') {
      clearInterval(interval);
      return;
    }
    if(count == 0) {
      clearInterval(interval);
      $(okBtn).trigger('click');
    }
    $(okBtn).text(`확인 (${count})`);
    count -= 1;
  }, 1000);
}

// Do Injection when player is completely loaded.
checkPlayerLoad(() => {
  // Find id from html attribute.
  const id = $('html').attr("id").replace("-page", "");
  // Create extension section and inject below metadata section.
  const extSection = $('<section class="py-1" id="downloader-ext"></section>');
  $("#content-metadata").append(extSection);
  
  // Auto trigger play button after 3 seconds if autoplay is enabled.
  (async () => {
    const autoplay = await GM_getValue('autoplay', false);
    if(autoplay) countAutoplay();
  })();
  
  // Watch alert dialog for support autoplay.
  watchDialog(async () => {
    const dialog = $('#confirm-dialog');
    if(dialog.css('display') !== 'none') {
      const autoplay = await GM_getValue('autoplay', false);
      // Auto confirm dialog if autoplay is enabled.
      if(autoplay) {
        countAutoConfirm();
      }
    }
  });
  
  // Check whether video is ended.
  checkVideoEnd(() => {
    prepareNextVideo();
    sendVideoNotification('end');
  });
  
  // Create debug(Expose XML Data) button if debug mode is enabled.
  if(DEBUG) prepareDebug(id);
  
  // Create Open in new tab button.
  const openInNewTabBtn = $('<a class="btn btn-primary btn-sm mx-1" role="button" href="' + window.location.href + '" target="_blank">새 탭에서 열기</a>');
  $("#downloader-ext").append(openInNewTabBtn);
  
  // Try to receive video data from commons server.
  retriveVideoData(id, (xml) => {
    // Extract content metadata from data xml.
    const contentData = $(xml).find('content_metadata');
    const title = $(contentData).find('title').text();
    const author = $(contentData).find('author').find('name').text();
    const thumbnail = $(xml).find('content_thumbnail_uri').text();
    const uri = window.location.href;
    
    currentVideo = {
      title, author, uri
    };
    
    const mediaUri = $(xml).find('media_uri[method="progressive"][target="all"]').text();
    const pseudoUri = $(xml).find('media_uri[method="pseudo"]').text();
    // Find main media from data.
    const mainMedia = $(xml).find('main_media');
    
    // Load playlist data and construct playlist view.
    preparePlaylistView({ id, title, thumbnail, uri }).then(() => {
      
      // Create playlist view button.
      const playlistBtn = $('<button class="btn btn-success btn-sm mx-1">대기열 보기</button>');
      $('#downloader-ext').append(playlistBtn);
      $(playlistBtn).on('click', async () => {
        if($('#playlist').css('display') === 'none') {
          await reconstructPlaylist({ id, title, thumbnail, uri });
          $('#playlist').css('display', 'block');
          $(playlistBtn).text('대기열 숨기기');
          $(playlistBtn).attr('class', 'btn btn-danger btn-sm mx-1');
        } else {
          $('#playlist').css('display', 'none');
          $(playlistBtn).text('대기열 보기');
          $(playlistBtn).attr('class', 'btn btn-success btn-sm mx-1');
        }
      });
    });
    // Load Download Button.
    prepareDownload({ title, author, mediaUri, pseudoUri, mainMedia });
  });
});