// ==UserScript==
// @name        네이버 카페 이미지 다운로드
// @version     1.1
// @description 네이버 카페 게시글 페이지에 있는 이미지를 작가명/글제목을 파일명으로 원본 크기로 다운로드 할 수 있는 버튼을 추가합니다.
// @author      devms
// @match       https://cafe.naver.com/*
// @grant       GM_download
// @license     MIT
// @namespace https://greasyfork.org/users/1261313
// @downloadURL https://update.greasyfork.org/scripts/487326/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/487326/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var authorNickname = "";
    var categoryText = ""
    var title;

    const interval = setInterval(() => { // 바로 검색하면 안되던데 이유를 모르겠음
        const button = document.querySelector('.nickname');
        if (button) {
        // 'nickname' 클래스를 가진 element 처리
        clearInterval(interval);
        console.log('닉네임 버튼 발견:', button.textContent);
        authorNickname = button.textContent;
        authorNickname = authorNickname.replace(/^\s+|\s+$/g, ''); // 앞 뒤 공백제거
        title = document.querySelector('.title_text').textContent.replace(/^\s+|\s+$/g, '');
        const categoryTextElement = document.querySelector('.category_text');
        if (categoryTextElement) {
            categoryText = categoryTextElement.textContent;
        }
        const images = document.querySelectorAll('.se-image-resource');
        for (const image of images) {
          addImageDownloadButton(image);
        }
      }
    }, 100);

    // 이미지에 다운로드 버튼 추가 함수
    function addImageDownloadButton(image) {
      const imageElement = image.parentNode;
      const downloadButton = document.createElement('button');

      downloadButton.textContent = '다운로드';
      downloadButton.style.backgroundColor = '#000';
      downloadButton.style.color = '#fff';
      downloadButton.style.padding = '5px 10px';
      downloadButton.style.borderRadius = '5px';
      downloadButton.style.cursor = 'pointer';

      // 이미지 URL 가져오기
      const imageUrl = image.src.replace(/\?type=(.*)/, ''); // ?type=머시기 지우면 원본 사이즈됨

      // 파일명 생성하기
      var matching = image.src.substring(image.src.lastIndexOf('/') + 1).split('?')[0]
      const filename = `[${authorNickname}] ${title} ${categoryText}_${matching}`;

      downloadButton.addEventListener("click", () => {
          //event.preventDefault(); // X
          downloadButton.disabled = true;
          downloadButton.innerHTML = "downloading"
          console.log("download URL : ", imageUrl);
          GM_download({
              url: imageUrl,
              name: filename
          })
      });
      imageElement.closest('.se-component.se-image.se-l-default').appendChild(downloadButton); // 복합 클래스 선택하는법
      //imageElement.parentNode.parentNode.parentNode.parentNode.parentNode.appendChild(downloadButton);
    }
  })();