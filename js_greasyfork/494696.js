// ==UserScript==
// @name         Kemono image download (Kemono 下载工具) self edited
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Files 내 이미지 다운로드만 지원됩니다
// @author       modified by myself
// @match        *://*.kemono.su/*
// @match        *://*.kemono.party/*
// @match        *://kemono.su/*
// @match        *://kemono.party/*
// @connect      *
// @license      GNU General Public License v3.0 or later
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/494696/Kemono%20image%20download%20%28Kemono%20%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7%29%20self%20edited.user.js
// @updateURL https://update.greasyfork.org/scripts/494696/Kemono%20image%20download%20%28Kemono%20%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7%29%20self%20edited.meta.js
// ==/UserScript==

GM_addStyle(".ad-container {display: none;}");
GM_addStyle(".root--ujvuu {display: none;}");

// 파일 이름 지정 규칙을 다운로드합니다:
// 포함 내용: 작성자 | 메인 제목 | 부제목(소스) | 페이지 번호 | 총 페이지 수(부제목은 보통 (Pixiv 팬박스) (Patreon))
// 예시 제목: 예란 1 파트 3 (루프) (Patreon) 여기서 (Patreon)은 부제입니다.
// 1 -> 페이지 번호. 형식 예시: 1.jpg
// 2 -> 페이지_번호. 형식 예시: 1_20.jpg
// 3 -> 메인 제목 페이지_번호_오브_페이지. 형식 예: 옐란 1편 3부 (루프) 1_20.jpg
// 4 -> 메인 타이틀 부제 (소스) 페이지 번호_총_페이지. 형식 예시: 옐란 1편 3부 (루프) (Patreon) 1_20.jpg
// 5 -> [저자] 메인 제목 부제목(출처) [페이지_총계]. 형식 예시: [Abcde] 옐란 1편 3부 (루프) (Patreon) [1_20].jpg

const nameRule = 5

function script() {
  const host = location.host
  const path = location.pathname
  const regular = {
    "/": homePage, // 首页
    "/artists": artistsPage, // 画师列表
    "/(\\w+)/user/(\\d+)": userPage, // 画师详情
    "/(\\w+)/user/(\\d+)/post/(\\d+)": postPage, // 作品页
  };
  Object.keys(regular).some((pattern) => {
    if (new RegExp(`^${pattern}$`).test(path)) {
      regular[pattern]();
      return true;
    }
  })
}
script()

function homePage () {
  // console.log('homepage');
}
function artistsPage () {
  // console.log('artistsPage');
}
function userPage () {
  // console.log('userPage');
}
function postPage () {
  GM_addStyle(".download-button {color: white; font-size: 16px; background-color: #3e3e44; padding: 3px 15px; border-radius: 5px; appearance: none; border: none; outline: none; transition: color 0.2s ease-in-out;}");
  GM_addStyle(".download-button:hover {color: #f8b696; transition: color 0.2s ease-in-out;}");
  GM_addStyle(".modify-h2 {display:flex; align-items: center; justify-content: space-between;}");

  // GET ARTIST {String} "name"
  let artist = ""
  artist = document.getElementsByClassName('post__user-name')[0].innerText
  // GET TITLES {Array} [mainTitle, subTitle]
  let titles = []
  let titleNode = document.getElementsByClassName('post__title')[0]
  titleNode = titleNode.getElementsByTagName('span')
  Array.from(titleNode).forEach(item => { titles.push(item.innerText) })
  // GET FILE URL LIST {Array} [Url, Url, ...]
  let fileList = []
  let filesNode = document.getElementsByClassName('post__thumbnail')
  Array.from(filesNode).forEach(file => {
    let href = file.querySelector('a').getAttribute('href')
    fileList.push(href)
  })
  console.log(fileList);
  // Modify-DOM
  let h2Node = document.getElementsByTagName("h2")
  Array.from(h2Node).forEach(element => {
    // Files
    if(element.innerHTML == "Files") {
      let fileTitle = createElement("h2", "Files")
      let fileBtn = createElement("button", "downloadAll", {
        id: "fileButton",
        class: "download-button",
        type: "button"
      })
      element.innerHTML = ""
      element.classList.add("modify-h2")
      element.appendChild(fileTitle)
      element.appendChild(fileBtn)

      fileBtn.addEventListener("click", function() {
        fileBtn.disabled = true
        fileBtn.innerHTML = "downloading"
        downloadingFiles(fileBtn, artist, titles, fileList)
      })
      let filesNode = document.getElementsByClassName('post__thumbnail')
      Array.from(filesNode).forEach((file, index) => {
        let href = file.querySelector('a').getAttribute('href')
        let fileName = createFileName(artist, titles, index + 1, fileList.length)

        // Create a download button for each image
        let downloadButton = createElement("button", "Download", {
          class: "download-button",
          type: "button",
        });

        downloadButton.addEventListener("click", function() {
            downloadButton.disabled = true;
            downloadButton.innerHTML = "downloading"
          downloadSingleFile(href, fileName, downloadButton);
        });

        let fileContainer = document.createElement("div");
        fileContainer.appendChild(downloadButton);
        fileContainer.appendChild(document.createTextNode(` - ${fileName}`));
        file.appendChild(fileContainer); // add button to bottom of image
      });
    }
  })
  let postDivNode = document.getElementsByClassName("post__files")
  //Array.from(postDivNode).forEach()
}
function createElement(tag, text, attributes = undefined) {
  let element = document.createElement(tag);
  element.innerHTML = text
  if (attributes) {
    for (let k in attributes) {
      element.setAttribute(k, attributes[k])
    }
  }
  return element
}
function createFileName(artist, titles, index, pages) {
  //console.log(artist, titles, index, pages);
  if (nameRule === 1) {
    return `${index}` // 1.jpg
  } else if (nameRule === 2) {
    return `${index}_${pages}` // 1_20.jpg
  } else if (nameRule === 3) {
    return `${titles[0]} ${index}_${pages}` // title 1_20.jpg
  } else if (nameRule === 4) {
    return `${titles[0]} ${titles[1]} ${index}_${pages}` // title (fanbox) 1_20.jpg
  } else if (nameRule === 5) {
    return `[${artist}] ${titles[0]} ${titles[1]} [${index}_${pages}]` // [artist] title (fanbox) [1_20].jpg
  }
}
function downloadingFiles(btn, artist, titles, fileList) {
  let totalQuest = fileList.length, success = 0, faild = 0
  fileList.forEach((url, index) => {
    let fileName = createFileName(artist, titles, index + 1, fileList.length)
    GM_download({
      url: url,
      name: fileName,
      onload: function() {
        console.log(`다운로드 ${index + 1}/${fileList.length} 완료`)
        totalQuest -= 1
        success += 1
        downloadingFilesFinished(btn, totalQuest, fileList.length, success, faild)
      },
      onerror: function(err) {
        console.error(`다운로드 ${index + 1}/${fileList.length} 실패 두 번째 시도 준비 중`, err)
        GM_download({
          url: url,
          name: fileName,
          onload: function() {
            console.log(`다운로드 ${index + 1}/${fileList.length} 완료 (두 번째 시도)`)
            totalQuest -= 1
            success += 1
            downloadingFilesFinished(btn, totalQuest, fileList.length, success, faild)
          },
          onerror: function(err) {
            console.log(`다운로드 ${index + 1}/${fileList.length} 실패 (두 번째 시도) 수동 다운로드를 시도해주세요`, err, {
              name: fileName,
              url: url
            })
            totalQuest -= 1
            faild += 1
            downloadingFilesFinished(btn, totalQuest, fileList.length, success, faild)
          }
        })
      }
    })
  })
}
function downloadSingleFile(url, fileName, btn) {
    //fileName = fileName.replace(/　/g,"_");
    fileName = fileName.replace(/\./g,"");
    GM_download({
      url: url,
      name: fileName,
      onload: function() {
        console.log(`다운로드 완료: ${fileName}`);
        alert(`다운로드 완료: ${fileName}`);
        btn.innerHTML = "Completed";
      },
      onerror: function(err) {
        console.error(`다운로드 실패: ${fileName}`, err);
        alert(`이미지 다운로드 실패: ${fileName}`);
      }
    });
  }
function downloadingFilesFinished(btn, totalQuest, total, success, faild) {
  if (totalQuest === 0) {
    btn.disabled = false
    btn.innerHTML = "downloadComplete"
    alert(`다운로드 완료, 총 ${total} 장, 성공 ${success} 장, 실패 ${faild} 장`)
  }
}
