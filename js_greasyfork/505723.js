// ==UserScript==
// @name         Toki Downloader
// @name:ko      토끼 다운로더
// @namespace    https://github.com/crossSiteKikyo/tokiDownloader
// @version      0.0.1
// @description  뉴토끼, 북토끼, 마나토끼에서 소설이나 웹툰을 다운로드하는 스크립트입니다. 직접 제작한것이 아닌, https://github.com/crossSiteKikyo/tokiDownloader의 소스코드를 유저스크립트로 바꾼 것입니다.
// @author       No Name
// @match        https://newtoki*.com/webtoon/*
// @match        https://booktoki350.com/novel/*
// @match        https://manatoki*.net/comic/*
// @include      /^https:\/\/newtoki[0-9]*\.com\/webtoon\/.*$/
// @include      /^https:\/\/booktoki[0-9]\.com\/novel\/.*$/
// @include      /^https:\/\/manatoki[0-9]*\.net\/comic\/.*$/
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.js
// @downloadURL https://update.greasyfork.org/scripts/505723/Toki%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/505723/Toki%20Downloader.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function loadScript(src) {
      return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          document.head.appendChild(script);
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      });
  }

  function sleep(num) {
      return new Promise(resolve=>{
          setTimeout(()=>resolve(), num);
      });
  }

  async function tokiDownload(startIndex, lastIndex) {
      try {
          let site = '뉴토끼'; // 예시
          let protocolDomain = 'https://newtoki350.com'; // 예시
          // 현재 url 체크
          const currentURL = document.URL;
          if (currentURL.match(/^https:\/\/booktoki[0-9]+.com\/novel\/[0-9]+/)) {
              site = "북토끼"; protocolDomain = currentURL.match(/^https:\/\/booktoki[0-9]+.com/)[0];
          }
          else if (currentURL.match(/^https:\/\/newtoki[0-9]+.com\/webtoon\/[0-9]+/)) {
              site = "뉴토끼"; protocolDomain = currentURL.match(/^https:\/\/newtoki[0-9]+.com/)[0];
          }
          else if (currentURL.match(/^https:\/\/manatoki[0-9]+.net\/comic\/[0-9]+/)) {
              site = "마나토끼"; protocolDomain = currentURL.match(/^https:\/\/manatoki[0-9]+.net/)[0];
          }
          else {
              throw Error('작품 리스트 화면에서 실행시켜주세요');
          }

          // JSZip 생성
          const zip = new JSZip();

          // 리스트들 가져오기
          let list = Array.from(document.querySelector('.list-body').querySelectorAll('li')).reverse();

          // 리스트 필터
          // startIndex가 있다면
          if (startIndex) {
              while(true) {
                  let num = parseInt(list[0].querySelector('.wr-num').innerText);
                  if (num < startIndex)
                      list.shift();
                  else
                      break;
              }
          }
          // lastIndex가 있다면
          if (lastIndex) {
             while(true) {
                 let num = parseInt(list.at(-1).querySelector('.wr-num').innerText);
                 if (lastIndex < num)
                     list.pop();
                 else
                     break;
             }
          }

          // 제목 가져오기 - 처음 제목과 마지막 제목을 제목에 넣는다.
          const firstName = list[0].querySelector('a').innerHTML.replace(/<span[\s\S]*?\/span>/g, '').trim();
          const lastName = list.at(-1).querySelector('a').innerHTML.replace(/<span[\s\S]*?\/span>/g, '').trim();
          const rootFolder = `${site}  ${firstName} ~ ${lastName}`;

          // iframe생성
          const iframe = document.createElement('iframe');
          iframe.width = 600;
          iframe.height = 600;
          document.querySelector('.content').prepend(iframe);
          const waitIframeLoad = (url) => {
              return new Promise((resolve)=>{
                  iframe.addEventListener('load', () => resolve());
                  iframe.src = url;
              });
          };

          // 북토끼 - 현재 회차의 리스트들을 다운한다.
          if (site == "북토끼") {
              for (let i=0; i<list.length; i++) {
                  console.clear();
                  console.log(`${i+1}/${list.length} 진행중`);

                  const num = list[i].querySelector('.wr-num').innerText.padStart(4, '0');
                  const fileName = list[i].querySelector('a').innerHTML.replace(/<span[\s\S]*?\/span>/g, '').trim();
                  const src = list[i].querySelector('a').href;
                  await waitIframeLoad(src);
                  await sleep(1000);
                  const iframeDocument = iframe.contentWindow.document;
                  // 소설 텍스트 추출
                  let textLists = iframeDocument.querySelector('#novel_content').querySelectorAll('div > div> p, div > div> div');
                  let fileContent = '';
                  for (let j=0; j<textLists.length; j++) {
                      fileContent += textLists[j].innerText;
                      fileContent += '\n'
                  }
                  // 이미지가 없다면 폴더를 만들지 않고 텍스트 파일 하나만 만든다.
                  zip.file(`${num} ${fileName}.txt`, fileContent);
              }
          }
          // 뉴토끼 또는 마나토끼
          else if  (site == "뉴토끼" || site == "마나토끼") {
              // 이미지를 fetch하고 zip에 추가하는 Promise
              const fetchAndAddToZip = (src, num, folderName, j, extension, listLen) => {
                  return new Promise((resolve)=>{
                      GM_xmlhttpRequest({
                          method: "GET",
                          url: src,
                          responseType: "blob",
                          onload: (response) => {
                              zip.folder(`${num} ${folderName}`).file(`${folderName} image${j.toString().padStart(4, '0')}${extension}`, response.response);
                              console.log(`${j+1}/${listLen}진행완료`);
                              resolve();
                          }
                      });
                  });
              };
              for (let i=0; i<list.length; i++) {
                  const num = list[i].querySelector('.wr-num').innerText.padStart(4, '0');
                  const folderName = list[i].querySelector('a').innerHTML.replace(/<span[\s\S]*?\/span>/g, '').trim();
                  const src = list[i].querySelector('a').href;
                  console.clear();
                  console.log(`${i+1}/${list.length} ${folderName} 진행중`);

                  await waitIframeLoad(src);
                  await sleep(1000);
                  const iframeDocument = iframe.contentWindow.document;
                  // 이미지 추출
                  let imgLists = iframeDocument.querySelectorAll('.view-padding div p:not([class]) > img');
                  if (imgLists.length === 0)
                      imgLists = iframeDocument.querySelectorAll('.view-padding div > img');
                  console.log(`이미지 ${imgLists.length}개 감지`);
                  let promiseList = [];
                  for (let j=0; j<imgLists.length; j++) {
                      let src = imgLists[j].outerHTML.match(/https[^"]+/)[0].replace(/https:\/\/[^/]+/, protocolDomain);
                      const extension = src.match(/\.[a-zA-Z]+$/)[0];
                      promiseList.push(fetchAndAddToZip(src, num, folderName, j, extension, imgLists.length));
                  }
                  await Promise.all(promiseList);
                  console.log(`${i+1}/${list.length} ${folderName} 완료`);
              }
          }

          // iframe제거
          iframe.remove();

          // 파일 생성후 다운로드
          console.log(`다운로드중입니다... 잠시 기다려주세요`);
          const content = await zip.generateAsync({ type: "blob" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(content);
          link.download = rootFolder; 
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(link.href);
          link.remove();
          console.log(`다운완료`);
      } catch (error) {
          alert(`tokiDownload 오류발생 \n` + error);
          console.error(error);
      }
  }


    GM_registerMenuCommand('전체 다운로드', () => tokiDownload());
    GM_registerMenuCommand('N번째 회차부터', () => {
        const startPageInput = prompt('몇번째 회차부터 저장할까요?', 1);
        tokiDownload(startPageInput);
    });
    GM_registerMenuCommand('N번째 회차부터 N번째 까지', () => {
        const startPageInput = prompt('몇번째 회차부터 저장할까요?', 1);
        const endPageInput = prompt('몇번째 회차까지 저장할까요?', 2);
        tokiDownload(startPageInput, endPageInput);
    });

})();