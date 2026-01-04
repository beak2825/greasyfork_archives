// ==UserScript==
// @name S*xart customization
// @namespace Adults
// @homepage https://greasyfork.org/en/scripts/455360-s-xart-customization/code
// @description Add bottom pagination of Metart
// @icon https://cdnmansite.metartnetwork.com/static/logos/A4C247F3ED924A70846D2722FD8B50F3/sa@2x.png
// @run-at document-start
// @match *://www.sexart.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version 0.0.8
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455360/S%2Axart%20customization.user.js
// @updateURL https://update.greasyfork.org/scripts/455360/S%2Axart%20customization.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function(event) {
  if (!window.location.href.split('/')[3].includes('movies')) {
      getModelNames();
  }

  // (async () => {
  //   appendBirthYearAndAge();
  // })();

  var targetNode = document.documentElement || document.body;
  $(targetNode).prepend(`<script>
    function copyDownloadUrl(el) {
      var targets = [];
      var url = el.dataset.url;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 2 && xhr.responseURL && !targets.length) {
          targets.push(xhr.responseURL);
          console.log(xhr.responseURL);
          navigator.clipboard.writeText(xhr.responseURL);
          el.href = xhr.responseURL;
          el.textContent = 'Copied URL into clipboard';
          xhr.onreadystatechange = null;
        }
      }
      xhr.open("GET", url, true);
      xhr.send();
    }
  </script>`)
  var config = { attributes: true, childList: true, subtree: true };
  var count = 0;
  let mutationScheduled = false;
  var callback = function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
          var mutation = mutations[i];
          if (mutation.type === 'attributes' && window.location.href.split('/')[3].includes('erotic-films')) {
            appendDownloadButtons();
          }

          if ([...mutation.addedNodes].some(node => node.querySelector && node.querySelector(".age") &&!node.querySelector(".birth-info"))) {
              appendBirthYearAndAge();
          }
      }
  };
  var observer = new MutationObserver(callback);
  (targetNode instanceof Element || targetNode instanceof HTMLDocument) && observer.observe(targetNode, config);
});

function getModelNamesByFirstLetter(letter, page = 1) {
  $.ajax({
    url: `https://www.sexart.com/api/models?firstNameLetter=${letter}&order=NAME&direction=ASC&page=${page}`
  }).done(function (response) {
      if (response.models && response.models.length) {
        var names = localStorage.getItem('metart_female_models');
        names = names ? names.split(',') : [];
        response.models.forEach(function (model) {
            names.push(model.name);
        });
        localStorage.setItem('metart_female_models', names);

        if (letter === "Z") {
            hideUnwantedVideos();
        }

        getModelNamesByFirstLetter(letter, page + 1);
      }
  });
}

function getModelNames() {
    if (!localStorage.getItem('metart_female_models')) {
      [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].forEach(function (letter) {
          getModelNamesByFirstLetter(letter);
      });
    } else if (window.location.href.split('/')[3].includes('movies') && localStorage.getItem('metart_female_models')) {
      hideUnwantedVideos();
    }
}

function appendDownloadButtons() {
  $('.man-ui.card > .photo').each(function () {
    let thumbnailEl = $(this).find('img')[0];
    if (!thumbnailEl) return;
    let videoId = $(thumbnailEl).attr('src').split('/')[5];
    let downloadHdVideoUrl = `https://www.sexart.com/api/download-media/${videoId}/film/720p`;
    if (!$(this).parents('.detailed-card-wrapper').find('.download_displayed_video').length) {
      $(this).parents('.detailed-card-wrapper').find('.man-ui.badges')
        .append(`<br><a class='download_displayed_video' href="${downloadHdVideoUrl}"
                        target="_blank" style="font-size: 14px;">&lt;&lt;Download 720p&gt;&gt;</a>`);
      $(this).parents('.detailed-card-wrapper').find('.man-ui.badges')
        .append(`<br><button><a class='copy_download_url' style="background: border-box;" data-url="${downloadHdVideoUrl}" onclick="copyDownloadUrl(this)">Copy URL 720p</a></button>`);
      hideUnwantedVideos();
    }
  });


  if ($('.download_displayed_video').length && !$('#download_all_displayed_videos').length) {
    $('.options').prepend('<button id="download_all_displayed_videos" style="background: border-box;">Download All</button>')
    $('#download_all_displayed_videos').on('click', function () {
        $('.download_displayed_video:not(.unwanted_video)').each(function () {
            $(this)[0].click();
        });
    });
    getModelNames();
  }
}

function hideUnwantedVideos() {
  var femaleModels = localStorage.getItem('metart_female_models');
  if (femaleModels) {
      femaleModels = femaleModels.split(',');
      $('.man-ui.card').each(function () {
          var modelNames = $(this).find('a[title]');
          var femaleModelCnt = 0;
          modelNames.each(function (i, modelName) {
            if (femaleModels.indexOf($(modelName).text()) !== -1) {
                femaleModelCnt++;
            }
          });
          if (modelNames && (modelNames.length < 2 || femaleModelCnt === modelNames.length)) {
              $(this).css({'background': 'darkgray'});
              $(this).find('.download_displayed_video').addClass('unwanted_video');
          }
      });
  }
}


let isProcessing = false;
const modelCache = new Map();
async function fetchModelAge(modelName) {
    if (modelCache.has(modelName)) {
        return modelCache.get(modelName);
    }

    try {
        const response = await fetch(`https://www.sexart.com/api/model?name=${encodeURIComponent(modelName)}&after=0&order=DATE&direction=DESC`);
        const data = await response.json();
        const age = data.age || null;

        modelCache.set(modelName, age);
        return age;
    } catch (error) {
        console.error(`Error fetching data for ${modelName}:`, error);
        return null;
    }
}

async function appendBirthYearAndAge() {
    document.querySelectorAll(".age").forEach(async (ageElement) => {
        if (!ageElement.parentElement.querySelector(".birth-info")) {
          const modelName = ageElement.parentElement.parentElement.querySelector('a').text;
          age = modelCache.get(modelName);
          if (!age) {
             age = await fetchModelAge(modelName);
          }

          if (age) {
              const currentYear = new Date().getFullYear();
              const birthYear = currentYear - age;
              const infoElement = document.createElement("div");
              infoElement.classList.add('birth-info');
              infoElement.textContent = `Born: ${birthYear} (Current Age: ${age})`;
              infoElement.style.marginTop = "5px";
              ageElement.insertAdjacentElement("afterend", infoElement);
          }
        }
    });
}
