// ==UserScript==
// @name         教师研修视频自动播放
// @namespace    https://basic.smartedu.cn/
// @version      2025-02-20
// @author       'sudorm/*'
// @description  教师研修自动播放
// @match        https://basic.smartedu.cn/teacherTraining/*
// @require https://code.jquery.com/jquery-1.12.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525215/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/525215/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const twice = 3000;
  const checkTime = 500;
  let tagList;

  function createFloatingWindow() {
    const floatingWindow = document.createElement('div');
    floatingWindow.id = 'floating-window';
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.top = '20px';
    floatingWindow.style.right = '20px';
    floatingWindow.style.zIndex = '9999';
    floatingWindow.style.width = '350px';
    floatingWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    floatingWindow.style.color = '#fff';
    floatingWindow.style.borderRadius = '12px';
    floatingWindow.style.padding = '10px';
    floatingWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    floatingWindow.style.display = 'flex';
    floatingWindow.style.flexDirection = 'column';
    floatingWindow.style.justifyContent = 'space-between';

    const selectElement = document.createElement('select');
    selectElement.id = 'tag-select';
    selectElement.style.width = '100%';
    selectElement.style.padding = '8px';
    selectElement.style.backgroundColor = '#fff';
    selectElement.style.color = '#000';
    selectElement.style.border = '1px solid #ccc';
    selectElement.style.borderRadius = '6px';
    selectElement.style.marginBottom = '10px';

    const playButton = document.createElement('button');
    playButton.innerText = '播放视频';
    playButton.style.width = '100%';
    playButton.style.padding = '8px';
    playButton.style.backgroundColor = '#4CAF50';
    playButton.style.color = '#fff';
    playButton.style.border = 'none';
    playButton.style.borderRadius = '6px';
    playButton.style.cursor = 'pointer';

    const playAllButton = document.createElement('button');
    playAllButton.innerText = '播放全部视频';
    playAllButton.style.width = '100%';
    playAllButton.style.marginTop = '10px';
    playAllButton.style.padding = '8px';
    playAllButton.style.backgroundColor = '#4CAF50';
    playAllButton.style.color = '#fff';
    playAllButton.style.border = 'none';
    playAllButton.style.borderRadius = '6px';
    playAllButton.style.cursor = 'pointer';

    playButton.addEventListener('click', () => {
      console.log('Play button clicked');
      startVideoTagSequence();
    });
    playAllButton.addEventListener('click', () => {
      console.log('Play all button clicked');
      startVideoAllTagSequence();
    });

    floatingWindow.appendChild(selectElement);
    floatingWindow.appendChild(playButton);
    floatingWindow.appendChild(playAllButton);
    document.body.appendChild(floatingWindow);

  }

  function createTagOptions() {
    tagList = $('.fish-collapse-header')

    for (let i = 0; i < tagList.length; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.text = tagList[i].innerText;
      if (i === 0) {
        option.selected = true;
      }
      $('#tag-select').append(option);
    }

    $('#tag-select').on('click', () => {
      tagList[$('#tag-select').val()].click();
    });
  }

  createFloatingWindow();

  function startVideoTagSequence() {
    let videoInTag;
    let currentIndex = $('#tag-select').val();
    if (!tagList.eq(currentIndex).parent().hasClass('.fish-collapse-item-active')) {
      tagList.eq(currentIndex).click();
    }
    videoInTag = Array.from(tagList.eq(currentIndex).parent().find('.resource-item'));
    playVideo(videoInTag);
  }

  function startVideoAllTagSequence() {
    let videoInTags = [];
    for (let i = 0; i < tagList.length; i++) {
      if (!tagList.eq(i).parent().hasClass('fish-collapse-item-active')) {
        tagList.eq(i).click();
      }
      const v = tagList.eq(i).parent().find('.resource-item');
      for (let j = 0; j < v.length; j++) {
        videoInTags.push(v[j]);
      }
    }
    playVideo(videoInTags)
  }

  function playVideo(list, index = 0) {
    if (index >= list.length) {
      alert('所有视频已播放完成。');
      return;
    }

    $(list[index]).click();
    setTimeout(() => {
      $('video')[0].play();
      $('video')[0].addEventListener('ended', () => {
        if (index < list.length - 1) {
          playVideo(list, index + 1);
        }
      });
      setTimeout(() => {
        const button = $('.fish-btn')[0];
        if (button) {
          button.click();
        }
      }, twice);
    }, twice);
  }


  const intervalId = setInterval(() => {
    if ($('video').length === 1) {
      clearInterval(intervalId);
      createTagOptions();
    }
  }, checkTime);

})();

