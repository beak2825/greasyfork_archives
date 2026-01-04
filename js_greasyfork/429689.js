// ==UserScript==
// @name        Arcalive Night Restaurant Secretary
// @namespace   Violentmonkey Scripts
// @match       https://arca.live/b/*
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @version     1.0.1.13
// @author      -
// @description 심야식당 이용 보조 유틸
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/429689/Arcalive%20Night%20Restaurant%20Secretary.user.js
// @updateURL https://update.greasyfork.org/scripts/429689/Arcalive%20Night%20Restaurant%20Secretary.meta.js
// ==/UserScript==

// onload init
let loaded = false
window.addEventListener('load', e => {
  if (!loaded) {
    loaded = true
    registerMenuCommand();
    asideMake();
    contentStretch();
    easyFroalaInsertImageTrigger()
    autoWriteEditor();
    arcaconLinkInit();
    clipboardPasteToBase64Init();
    userInfoViewInit();
    imageSaveContextMenuInit();
  }
});

// 배열 자르기, 페이지네이션
Array.prototype.division = function(n) {
  var arr = this;
  var len = arr.length;
  var cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
  var tmp = [];
  for (var i = 0; i < cnt; i++) {
    tmp.push(arr.splice(0, n));
  }
  return tmp;
}

// 바이트값 정리 함수
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '-';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 키 시뮬레이트
function simulateKey(keyCode, type, modifiers) {
  var evtName = (typeof(type) === "string") ? "key" + type : "keydown";
  var modifier = (typeof(modifiers) === "object") ? modifier : {};

  var event = document.createEvent("HTMLEvents");
  event.initEvent(evtName, true, false);
  event.keyCode = keyCode;

  for (var i in modifiers) {
    event[i] = modifiers[i];
  }

  document.dispatchEvent(event);
}

// froalaeditor 이미지 삽입 감지 (미완성)
async function easyFroalaInsertImageTrigger() {
  if (location.href.includes("/write") || location.href.includes("/edit")) {
    const editorTextarea = document.querySelector("#content")
    let oldMatch = 0
    while (true) {
      await sleep(100)
      let newMatch = editorTextarea.value.match(/src="\/\/ac\.namu\.la/g)
      if (newMatch && oldMatch !== newMatch.length) {
        oldMatch = newMatch.length
        editorTextarea.setAttribute("style", "height: 0; opacity: 0;")
        editorTextarea.focus()
      } else if (newMatch === null) {
        oldMatch = 0
      }
    }
  }
}

// fetch 함수
function doFetch(url, options = {
  method: 'GET',
  responseType: 'document'
}, silent = false) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url: url,
      method: options.method,
      responseType: options.responseType,
      headers: options.headers,
      data: options.data,
      onload: result => {
        console.debug(result)
        if (result.status == 200) {
          resolve(result.response);
        } else {
          if (!silent) {
            console.log(result)
            alert("불러오기 에러 발생 : " + url)
            reject(result.status);
          } else {
            console.debug(result)
            reject(result.status);
          }
        }
      }
    });
  });
}

// 사이드바 추가
function asideMake() {

  const rightSidebar = document.querySelector(".right-sidebar")

  const sidebarItem = document.createElement('div')
  sidebarItem.setAttribute("class", "sidebar-item")
  sidebarItem.setAttribute("id", "smtranslation")

  const itemTitle = document.createElement('div')
  itemTitle.setAttribute("class", "item-title")
  itemTitle.innerText = "번역 소식"

  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.sm-translate-tab { padding-bottom: .25rem;border-bottom: 0 solid #00a495;margin:8.7%;cursor:pointer;transition-duration: 0.1s }';
  style.innerHTML += '.sm-translate-tab-activated { padding-bottom: .25rem;border-bottom: 2px solid #00a495;margin:8.7%;cursor:pointer;transition-duration: 0.1s }';
  style.innerHTML += '.sm-translate-arrow-left { margin: auto 5px;float:right;width: 0; height: 0; border-top: 5px solid transparent; border-bottom: 5px solid transparent; border-right: 7px solid black;cursor:pointer }';
  style.innerHTML += '.sm-translate-arrow-right { margin: auto 5px;float:right;width: 0; height: 0; border-top: 5px solid transparent; border-bottom: 5px solid transparent; border-left: 7px solid black;cursor:pointer }';
  document.getElementsByTagName('head')[0].appendChild(style);

  const smallTitle = document.createElement('div')
  smallTitle.setAttribute("style", "margin-bottom:12px")

  const linkList = document.createElement('div')
  linkList.setAttribute("class", "link-list clearfix")

  const arrowDiv = document.createElement('div')
  arrowDiv.setAttribute("class", "sm-translation-arrows")

  const arrowRight = document.createElement("div")
  arrowRight.setAttribute("class", "sm-translate-arrow-right")
  const arrowLeft = document.createElement("div")
  arrowLeft.setAttribute("class", "sm-translate-arrow-left")

  arrowDiv.appendChild(arrowRight)
  arrowDiv.appendChild(arrowLeft)

  const translating = document.createElement('span')
  translating.setAttribute("class", "sm-translate-tab-activated")
  translating.innerText = "번역중"
  translating.onclick = (e) => {
    activateTab(e)
    arrowDiv.setAttribute("style", "display: none")
    translatingPageNum = 0
    // 카테고리: 실황, 키워드: 번역 / 색인
    getTranslatePageFetch([
        `https://arca.live/b/simya?target=content&keyword=${srt}`,
        "https://arca.live/b/simya?category=실황&target=title&keyword=번역"
      ], linkList, arrowRight, arrowLeft)
      .then(t => {
        if (t) {
          arrowDiv.removeAttribute("style")
        }
      })
  }

  const notranslate = document.createElement('span')
  notranslate.setAttribute("class", "sm-translate-tab")
  notranslate.innerText = "미번역"
  notranslate.onclick = (e) => {
    activateTab(e)
    arrowDiv.setAttribute("style", "display: none")
    translatingPageNum = 0
    // 키워드: 번역요청
    getTranslatePageFetch([
        "https://arca.live/b/simya?target=title&keyword=번역요청"
      ], linkList, arrowRight, arrowLeft)
      .then(t => {
        if (t) {
          arrowDiv.removeAttribute("style")
        }
      })
  }

  const dotranslate = document.createElement('span')
  dotranslate.setAttribute("class", "sm-translate-tab")
  dotranslate.innerText = "찜하기"
  dotranslate.onclick = (e) => {
    activateTab(e)
    arrowDiv.setAttribute("style", "display: none")
    translatingPageNum = 0
    makeReservation(linkList, arrowRight, arrowLeft)
      .then(t => {
        arrowDiv.removeAttribute("style")
      })
  }

  smallTitle.appendChild(translating)
  smallTitle.appendChild(notranslate)
  smallTitle.appendChild(dotranslate)

  sidebarItem.appendChild(itemTitle)
  sidebarItem.appendChild(smallTitle)
  sidebarItem.appendChild(linkList)
  sidebarItem.appendChild(arrowDiv)

  rightSidebar.prepend(sidebarItem)

  translating.click()
}

// 사이드바 내용 채우기
function getTranslatePageFetch(urlList, element, arrowRight, arrowLeft, nonPage = false) {
  return new Promise(async (resolve, reject) => {
    if (typeof urlList === "string") {
      urlList = [urlList]
    }
    let articleMetaArray = [];
    let articleArray = [];
    for (let url of urlList) {
      await doFetch(url, {
        method: 'GET',
        responseType: 'document'
      }, true)
        .then(dom => {
          let articleList = dom.querySelector(".article-list").querySelectorAll(".vrow:not(.notice):not(.head)")

          articleList.forEach(a => {
            let article = new Object
            article.href = a.href.split("?")[0]
            let articleSplit = a.querySelector(".title").innerText.split(/(\[?.?번역요청.?\]|\(?.?번역요청.?\))/)
            article.title = articleSplit[2] || articleSplit[0]
            article.author = a.querySelector("span.vcol.col-author > span > span:nth-child(1)").innerText

            let articleSpan = document.createElement('span')
            articleSpan.setAttribute("class", "leaf-info float-right")
            articleSpan.style.margin = 'auto 0 auto 10px'
            articleSpan.innerText = article.author

            let articleA = document.createElement('a')
            articleA.setAttribute("href", article.href)
            articleA.setAttribute("target", "_blank")
            articleA.style.padding = '.15rem 0 .15rem 0'
            articleA.appendChild(articleSpan)
            articleA.append(article.title)

            articleArray.push(articleA)
          })
        })
    }

    if (nonPage) {
      articleMetaArray = [articleArray]
      if (articleArray.length > 10) {
        contentStretch()
      }
    } else {
      articleMetaArray = articleArray.division(10)
    }
    arrowRight.onclick = (e) => {
      translatingPage(element, articleMetaArray, 1)
    }
    arrowLeft.onclick = (e) => {
      translatingPage(element, articleMetaArray, -1)
    }
    translatingPage(element, articleMetaArray, 0)
    if (articleMetaArray[0].length > 0) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

// 본문 늘리기
function contentStretch() {
  const contentWrapper = document.querySelector(".root-container > .content-wrapper")
  contentWrapper.setAttribute("style", "padding-bottom: 200px")
}

// 페이지 이동
let translatingPageNum = 0

function translatingPage(element, arr, delta) {
  let tmpPage = translatingPageNum + delta
  let pageContent = arr[tmpPage]

  if (arr[0].length > 0 && arr[tmpPage]) {
    translatingPageNum = tmpPage
    element.innerHTML = ''
    pageContent.forEach(content => {
      element.appendChild(content)
    })
  }
}

// 번역찜
function makeReservation(element, arrowRight, arrowLeft) {
  return new Promise((resolve, reject) => {

    const inputGroup = document.createElement("div")
    inputGroup.setAttribute("class", "input-group input-group-sm mb-3")
    inputGroup.setAttribute("style", "border-radius: 5px;")

    const inputGroupPrepend = document.createElement("div")
    inputGroupPrepend.setAttribute("class", "input-group-prepend")

    const inputGroupButton = document.createElement("div")
    inputGroupButton.setAttribute("class", "btn btn-sm btn-arca")
    inputGroupButton.setAttribute("data-toggle", "dropdown")
    inputGroupButton.innerText = "플랫폼"

    inputGroupPrepend.appendChild(inputGroupButton)

    const inputGroupDropdown = document.createElement("div")
    inputGroupDropdown.setAttribute("class", "dropdown-menu")

    const inputCode = document.createElement("input")
    inputCode.setAttribute("class", "form-control")
    inputCode.setAttribute("placeholder", "플랫폼을 선택하세요")
    inputCode.setAttribute("type", "text")

    const dropdowns = ["dlsite", "hitomi", "e-hentai", "getchu", "fanza"]

    dropdowns.forEach(str => {
      const inputGroupDropdownMenu = document.createElement("div")
      inputGroupDropdownMenu.setAttribute("class", "dropdown-item")
      inputGroupDropdownMenu.setAttribute("style", "cursor:pointer")
      inputGroupDropdownMenu.onclick = function(e) {
        inputGroupButton.innerText = e.target.innerText
        switch (e.target.innerText) {
          case "dlsite":
            inputCode.setAttribute("placeholder", "작품 코드 또는 주소")
            break;
          case "hitomi":
            inputCode.setAttribute("placeholder", "자료 코드 또는 주소")
            break;
          case "e-hentai":
            inputCode.setAttribute("placeholder", "자료 주소")
            break;
          case "getchu":
          case "fanza":
            inputCode.setAttribute("placeholder", "작품 주소")
            break;
        }
      }
      inputGroupDropdownMenu.innerText = str
      inputGroupDropdown.appendChild(inputGroupDropdownMenu)
    })

    inputGroupPrepend.appendChild(inputGroupDropdown)
    inputGroup.appendChild(inputGroupPrepend)
    inputGroup.appendChild(inputCode)

    const checkboxDiv = document.createElement("div")

    const checkboxValues = [
      ["역자", "식자"],
      ["손번역", "기계번역", "이미지번역"],
      ["개인", "팀", "동료 모집"]
    ]

    easyCheckbox(checkboxDiv, checkboxValues, "sm-translation-reservation-checkbox")

    const inputDescription = document.createElement("textarea")
    inputDescription.setAttribute("class", "form-control")
    inputDescription.setAttribute("style", "border-color: #ccc;border-radius: 5px;margin-bottom:10px;resize:none;height:10rem")
    inputDescription.setAttribute("placeholder", "덧붙이는 글 (선택)")

    const submitButton = document.createElement("div")
    submitButton.setAttribute("class", "btn btn-sm btn-arca float-right")
    submitButton.setAttribute("style", "margin:5px")
    submitButton.innerText = "번역찜"
    submitButton.onclick = function(e) {
      const optionList = []
      let optionStr
      document.querySelectorAll(".sm-translation-reservation-checkbox").forEach(chkb => {
        if (chkb.checked) {
          optionList.push(chkb.value)
        }
      })
      if (optionList.length > 0) {
        optionStr = arr2str(optionList)
      } else {
        optionStr = "선택되지 않음"
      }
      doReservation(inputGroupButton.innerText, inputCode.value, element, arrowRight, arrowLeft)
        .then(async data => {
          const dataJSON = data[1]
          let title
          if (optionStr.includes("모집")) {
            title = `[번역찜] [모집] ${dataJSON.title[1]}`
          } else {
            title = `[번역찜] ${dataJSON.title[1]}`
          }
          if (title.length > 50) {
            title = title.substring(0, 49) + "…"
          }
          dataJSON.sm_translation_option = ["번역찜 옵션", optionStr]
          let content
          await makeTable(dataJSON, true).then(table => {
            content = (table.outerHTML + `<p><br></p><p>${inputDescription.value}</p>` + indexerHTML(data[2]))
          })
          const editorButton = document.createElement("div")
          editorButton.setAttribute("class", "btn btn-sm btn-arca float-right")
          editorButton.setAttribute("style", "margin:5px")
          editorButton.innerText = "에디터에서 수정"
          editorButton.onclick = function(e) {
            localStorage.setItem('sm_translation_tmp_title', title);
            localStorage.setItem('sm_translation_tmp_content', content.replace(/\n/g, "<br>"));
            location.href = "/b/simya/write/"
          }

          const directButton = document.createElement("div")
          directButton.setAttribute("class", "btn btn-sm btn-arca float-right")
          directButton.setAttribute("style", "margin:5px")
          directButton.innerText = "번역찜 제출"
          directButton.onclick = function(e) {
            submitReservation(title, content.replace(/\n/g, "<br>"))
          }

          element.appendChild(directButton)
          element.appendChild(editorButton)
          if (data[0]) {
            alert("번통사고 예방을 위해 목록을 확인해 주십시오")
          } else {
            submitButton.remove()
          }
        })
    }
    element.innerHTML = ''
    element.appendChild(inputGroup)
    element.appendChild(checkboxDiv)
    element.appendChild(inputDescription)
    element.appendChild(submitButton)
  })
}

// 체크박스 만들기
function easyCheckbox(element, valMetaList, className) {
  valMetaList.forEach(valList => {
    let checkbox
    let checkboxLabel
    let pTag = document.createElement("p")
    valList.forEach(val => {
      checkbox = document.createElement("input")
      checkbox.setAttribute("class", className)
      checkbox.setAttribute("type", "checkbox")
      checkbox.setAttribute("value", val)

      checkboxLabel = document.createElement("label")
      checkboxLabel.setAttribute("style", "margin:auto 5px")
      checkboxLabel.appendChild(checkbox)
      checkboxLabel.append(` ${val}`)
      pTag.appendChild(checkboxLabel)
    })
    element.appendChild(pTag)
  })
}

// 색인
const srt = "Q4VR D8W2 9H5K 0PFK 3JM7 GX0M"

function indexerHTML(str) {
  let a = `<p style="font-size:0;">${str} ${srt}</p>`
  return a
}

// 번역찜 하기
function doReservation(platform, code, element, arrowRight, arrowLeft) {
  return new Promise((resolve, reject) => {
    let ProcessedCode
    let parser
    ProcessedCode = code.split("?")[0]
    switch (platform) {
      case "dlsite":
        ProcessedCode = dlsiteAuto(code)
        parser = dlInfo
        break;
      case "hitomi":
        ProcessedCode = hitomiAuto(code)
        parser = hitomiInfo
        break;
      case "e-hentai":
        ProcessedCode = ehAuto(code)
        parser = ehInfo
        break;
      case "getchu":
        ProcessedCode = getchuAuto(code)
        parser = getchuInfo
        break;
      case "fanza":
        ProcessedCode = fanzaAuto(code)
        parser = fanzaInfo
        break;
      default:
        alert("플랫폼을 선택해 주십시오")
        break;
    }
    parser(ProcessedCode).then(obj => {
      let searchList = [
        `https://arca.live/b/simya?target=content&keyword=${ProcessedCode} ${srt}`,
        `https://arca.live/b/simya?category=번역&target=all&keyword=${obj.title[1]}`,
        `https://arca.live/b/simya?category=실황&target=all&keyword=${obj.title[1]} 번역`
      ]
      let numCode = ProcessedCode.match(/[A-Z]{2}\d+/g)
      if (numCode && numCode.length === 1) {
        searchList.push(`https://arca.live/b/simya?target=all&keyword=${numCode[0].replace(/[A-Z]{2}(\d+)/g, "$1")} 번역`)
      }
      getTranslatePageFetch(searchList, element, arrowRight, arrowLeft, true)
        .then(t => {
          resolve([t, obj, ProcessedCode])
        })
    })
  })
}

// 번역찜 글 제출
function submitReservation(title, content) {
  const url = "https://arca.live/b/simya/write"
  getWriteToken()
    .then(tokenList => {
      fetch(url, {
          method: 'POST',
          body: new URLSearchParams({
            '_csrf': tokenList[0],
            'token': tokenList[1],
            'contentType': 'html',
            'category': '실황',
            'title': String(title),
            'content': String(content)
          })
        })
        .then(response => {
          if (response.ok) {
            location.href = response.url
          } else {
            console.log(response)
            alert("번역찜 글이 제출 과정에서 오류가 발생했습니다.")
          }
        })
    })
}

// 에디터 자동 내용 채우기
async function autoWriteEditor() {
  if (location.href.includes("/write")) {
    const title = localStorage.getItem('sm_translation_tmp_title');
    const content = localStorage.getItem('sm_translation_tmp_content');
    if (title && content) {
      localStorage.removeItem('sm_translation_tmp_title')
      localStorage.removeItem('sm_translation_tmp_content')

      let titleBox = document.querySelector("#inputTitle")
      let editorBox = document.querySelector('.write-body .fr-element')
      while (titleBox === null || editorBox === null) {
        await sleep(10)
        titleBox = document.querySelector("#inputTitle")
        editorBox = document.querySelector('.write-body .fr-element')
      }
      titleBox.value = title
      editorBox.innerHTML = content
      document.querySelector("#category-실황").click()
    }
  }
}

// 글쓰기 토큰
function getWriteToken() {
  return new Promise((resolve, reject) => {
    if (location.href.includes("/write") || location.href.includes("/edit")) {
      const csrf = document.querySelector("input[name=_csrf]")
      const token = document.querySelector("input[name=token]")
      if (csrf && token) {
        resolve([csrf.value, token.value])
      }
    } else {
      let url = "https://arca.live/b/simya/write"
      doFetch(url)
        .then(html => {
          const csrf = html.querySelector("input[name=_csrf]")
          const token = html.querySelector("input[name=token]")
          if (csrf && token) {
            resolve([csrf.value, token.value])
          }
        })
    }
  })
}

// 이미지(Blob) 업로드 함수
function UploadImageFile(Blob, pretoken = null, original = false) {
  return new Promise(async (resolve, reject) => {
    var xhr = new XMLHttpRequest();
    var formData = new FormData();

    if (!document.querySelector("#article_write_form > input[name=token]")) {
      await getWriteToken()
        .then(tokenList => {
          pretoken = tokenList[1]
        })
    }

    formData.append('upload', Blob, Math.random().toString(36).substring(7) + '.jpg');
    formData.append('token', pretoken || document.querySelector("#article_write_form > input[name=token]").value);
    formData.append('saveExif', original);
    formData.append('saveFilename', false);

    xhr.onload = function() {
      responseJSON = JSON.parse(xhr.responseText)
      if (responseJSON.uploaded === true) {
        resolve(responseJSON.url)
      } else {
        alert("이미지 업로드 실패 : " + xhr.responseText)
        console.error(xhr.responseText);
      }
    }
    xhr.open("POST", "https://arca.live/b/upload");
    xhr.send(formData);
  });
}

// 탭 전환
function activateTab(e) {
  const tab = document.querySelector(".sm-translate-tab-activated")
  tab.setAttribute("class", "sm-translate-tab")
  e.target.setAttribute("class", "sm-translate-tab-activated")
}

// 배열을 문자열로 정리
function arr2str(arr, opt = ", ") {
  let idx = arr.indexOf("")
  while (idx > -1) {
    arr.splice(idx, 1)
    idx = arr.indexOf("")
  }
  return String(arr).replace(/"/g, '').replace('[', "").replace(']', "").replace(/,/g, opt)
}

// 문자열 정리
function strTrim(str) {
  return str.replace(/\n/g, '').replace(/^\s+|\s+$/g, '').replace(/ +/g, " ").trim()
}

// JSON을 글 양식을 표로
async function makeTable(obj, getTable = false) {
  if (location.href.includes("/write") || location.href.includes("/edit") || getTable) {
    const table = document.createElement("table")
    table.setAttribute("style", "width:100%")
    const tbody = document.createElement("tbody")

    for (let [key, value] of Object.entries(obj)) {
      if (value[1]) {
        const tr = document.createElement("tr")
        const tdA = document.createElement("td")
        tdA.setAttribute("style", "width: 20%; text-align: center;")
        tdA.innerText = value[0]
        const tdB = document.createElement("td")
        tdB.setAttribute("style", "width: 80%; text-align: center;")
        tdB.innerHTML = value[1]
        tr.appendChild(tdA)
        tr.appendChild(tdB)
        tbody.appendChild(tr)
      }
    }
    table.appendChild(tbody)

    if (!getTable) {
      let editorBox = document.querySelector('.write-body .fr-element')

      while (editorBox === null) {
        await sleep(10)
        editorBox = document.querySelector('.write-body .fr-element')
      }
      editorBox.appendChild(table)
    } else {
      return table
    }
  } else {
    return obj
  }
}

// dlsite api사용
function dlInfo(code, getTable = false) {
  return new Promise((resolve, reject) => {
    const url = `https://www.dlsite.com/maniax/api/=/product.json?workno=${code}&locale=ko-K`
    doFetch(url, {
        method: 'GET',
        responseType: 'application/json'
      })
      .then(result => {
        const dlJSON = JSON.parse(result)[0]
        if (dlJSON) {
          const dlProcessedJSON = Object()
          dlProcessedJSON.title = ["제목", dlJSON["work_name"]]
          doFetch(`https:${dlJSON["image_main"]["url"]}`, {
              method: "GET",
              responseType: "blob"
            })
            .then(blob => {
              UploadImageFile(blob)
                .then(imgsrc => {
                  dlProcessedJSON.image = ["이미지", `<img src='${imgsrc}' alt='이미지'>`]
                  dlProcessedJSON.work_type = ["분류", `${dlJSON["work_type"]} / ${dlJSON["work_type_string"]}`]
                  dlProcessedJSON.file_info = ["파일(용량)", `${dlJSON["file_type"]}(${formatBytes(dlJSON["contents_file_size"])})`]

                  if (dlJSON["creaters"]) {
                    dlProcessedJSON.creators = []
                    for (const [key, value] of Object.entries(dlJSON["creaters"])) {
                      let tmpArr = []
                      value.forEach(name => {
                        tmpArr.push(name.name)
                      })
                      dlProcessedJSON.creators.push(key + ': ' + arr2str(tmpArr, "|"))
                    }
                    dlProcessedJSON.creators = ["만든이", arr2str(dlProcessedJSON.creators, " / ").replace(/\|/g, ", ")]
                  }

                  dlProcessedJSON.maker = ["서클", dlJSON["maker_name"]]

                  if (dlJSON["author"]) {
                    dlProcessedJSON.authors = []
                    for (const [key, value] of Object.entries(dlJSON["author"])) {
                      dlProcessedJSON.authors.push(value.author_name)
                    }
                    dlProcessedJSON.authors = ["작가", arr2str(dlProcessedJSON.authors)]
                  }
                  resolve(dlProcessedJSON)

                  if (dlJSON["genres"]) {
                    dlProcessedJSON.genres = []
                    dlJSON["genres"].forEach(genre => {
                      dlProcessedJSON.genres.push(genre["name"])
                    })
                    dlProcessedJSON.genres = ["태그", arr2str(dlProcessedJSON.genres)]
                  }

                  if (dlJSON["trials"]) {
                    dlProcessedJSON.trial = ["체험판", `<a href='https:${dlJSON["trials"][0]["url"]}'>체험판 다운로드(${dlJSON["trials"][0]["file_size_unit"]})</a>`]
                  }
                  dlProcessedJSON.url = ["출처", `<a href='https://www.dlsite.com/maniax/work/=/product_id/${code}.html'>보러가기</a>`]

                  resolve(makeTable(dlProcessedJSON, getTable))
                })
            })
        } else {
          alert("유효하지 않은 코드입니다!")
        }
      })
  })
}

// dlsite 정보 채우기
function dlsiteAuto(code = null) {
  let result = code || window.prompt("dlsite 코드 또는 주소를 입력하세요")
  if (result && result.match(/[A-Z]{2}\d+/g)) {
    if (!code) {
      dlInfo(result.match(/[A-Z]{2}\d+/g)[0])
    } else {
      return result.match(/[A-Z]{2}\d+/g)[0]
    }
  } else {
    alert("dlsite 코드 또는 주소를 읽을 수 없습니다!")
  }
}

// hitomi api사용
function hitomiInfo(code, getTable = false) {
  return new Promise(async (resolve, reject) => {
    const url = `https://hitomi.la/galleries/${code}.html`
    await doFetch(url)
      .then(async html => {
        const redirect = html.querySelector("body > a")
        await doFetch(redirect.href, {headers: {
          origin: 'https://hitomi.la',
          referer: 'https://hitomi.la'
        }})
          .then(async html => {
          console.log(html)
            const hitomiProcessedJSON = Object()
            const infoBox = html.querySelector(".content")
            const author = html.querySelector(".gallery > h2 > ul")
            const authors = []
            author.querySelectorAll("li").forEach(tag => {
              authors.push(tag.innerText)
            })
            const imgUrl = infoBox.querySelector(".cover > a > picture > img").srcset.split(" 2x")[0]
            await doFetch(imgUrl, {
                method: 'GET',
                responseType: 'blob'
              })
              .then(blob => {
                UploadImageFile(blob)
                  .then(imgsrc => {
                    hitomiProcessedJSON.title = ["제목", infoBox.querySelector(".gallery > h1").innerText]
                    hitomiProcessedJSON.image = ["표지", `<img src='${imgsrc}' alt='표지'>`]
                    hitomiProcessedJSON.author = ["작가", arr2str(authors)]
                    infoBox.querySelector(".gallery-info > table > tbody").querySelectorAll("tr").forEach(tr => {
                      let rtd1 = tr.querySelector("td:nth-child(1)")
                      let rtd2 = tr.querySelector("td:nth-child(2)")
                      if (rtd1 && rtd2) {
                        let td1 = strTrim(rtd1.innerText)
                        let td2 = strTrim(rtd2.innerText)
                        switch (td1) {
                          case "Group":
                            hitomiProcessedJSON.group = ["그룹", td2]
                            break;
                          case "Type":
                            hitomiProcessedJSON.type = ["분류", td2]
                            break;
                          case "Language":
                            hitomiProcessedJSON.language = ["언어", td2]
                            break;
                          case "Series":
                            hitomiProcessedJSON.series = ["시리즈", td2]
                            break;
                          case "Characters":
                            let charList = []
                            tr.querySelectorAll("li").forEach(tag => {
                              charList.push(strTrim(tag.innerText))
                            })
                            hitomiProcessedJSON.characters = ["캐릭터", arr2str(charList)]
                            break;
                          case "Tags":
                            let tagList = []
                            tr.querySelectorAll("li").forEach(tag => {
                              tagList.push(strTrim(tag.innerText))
                            })
                            hitomiProcessedJSON.tags = ["태그", arr2str(tagList)]
                            break;
                        }
                      }
                    })
                    hitomiProcessedJSON.url = ["출처", `<a href='${url}'>보러가기</a>`]
                    resolve(makeTable(hitomiProcessedJSON, getTable))
                  })
              })
          })
      })
  })
}

// hitomi 정보 채우기
function hitomiAuto(code = null) {
  let result = code || window.prompt("hitomi 코드 또는 주소를 입력하세요");
  if (result && result.match(/\d+\.htm/)) {
    if (!code) {
      hitomiInfo(result.match(/\d+\.htm/)[0].replace(".htm", ""))
    } else {
      return result.match(/\d+\.htm/)[0].replace(".htm", "")
    }
  } else {
    if (result && result.match(/\d+/g) && result.match(/\d+/g).length === 1) {
      if (!code) {
        hitomiInfo(result.match(/\d+/g)[0])
      } else {
        return result.match(/\d+/g)[0]
      }
    } else {
      alert("hitomi 코드 또는 주소를 읽을 수 없습니다!")
    }
  }
}

// hitomi 작품 전체 가져오기
async function hitomiGetImage(code) {

  function subdomain_from_url(url, base) {
    var retval = 'b';
    if (base) {
      retval = base;
    }

    var number_of_frontends = 3;
    var b = 16;

    var r = /\/[0-9a-f]\/([0-9a-f]{2})\//;
    var m = r.exec(url);
    if (!m) {
      return 'a';
    }

    var g = parseInt(m[1], b);
    if (!isNaN(g)) {
      var o = 0;
      if (g < 0x80) {
        o = 1;
      }
      if (g < 0x40) {
        o = 2;
      }
      retval = String.fromCharCode(97 + o) + retval;
    }

    return retval;
  }

  function url_from_url(url, base) {
    return url.replace(/\/\/..?\.hitomi\.la\//, '//' + subdomain_from_url(url, base) + '.hitomi.la/');
  }

  function full_path_from_hash(hash) {
    if (hash.length < 3) {
      return hash;
    }
    return hash.replace(/^.*(..)(.)$/, '$2/$1/' + hash);
  }

  function url_from_hash(galleryid, image, dir, ext) {
    ext = ext || dir || image.name.split('.').pop();
    dir = dir || 'images';

    return 'https://a.hitomi.la/' + dir + '/' + full_path_from_hash(image.hash) + '.' + ext;
  }

  function url_from_url_from_hash(galleryid, image, dir, ext, base) {
    return url_from_url(url_from_hash(galleryid, image, dir, ext), base);
  }

  const ltnUrl = `https://ltn.hitomi.la/galleries/${code}.js`
  const reqReferer = `https://hitomi.la/reader/${code}.html`
  let editorBox
  editorBox = document.querySelector('.write-body .fr-element')
  while (editorBox === null) {
    await sleep(10)
    editorBox = document.querySelector('.write-body .fr-element')
  }

  await doFetch(ltnUrl, {
      method: 'GET',
      responseType: 'application/json',
      headers: {
        origin: 'https://hitomi.la',
        referer: 'https://hitomi.la'
      }
    })
    .then(async str => {
      const hitomiJSON = JSON.parse(str.replace("var galleryinfo = ", ""))

      let fileProgress = document.createElement("progress");
      fileProgress.setAttribute("value", "0")
      fileProgress.setAttribute("max", "1")
      fileProgress.setAttribute("style", "width:100%;")
      fileProgress.setAttribute("id", "sm-translation-hitomiAuto-fileProgress")

      const row = document.querySelector("#article_write_form > div.row > div")
      row.appendChild(fileProgress)
      let index = 0

      for (let dict of hitomiJSON.files) {
        let url = url_from_url_from_hash(code, dict)
        var tmpPromise = await doFetch(url, {
            method: "GET",
            responseType: 'blob',
            headers: {
              origin: 'https://hitomi.la',
              referer: reqReferer
            }
          })
          .then(async res => {
            var tmpPromise = await UploadImageFile(res).then(url => {
              let imgTag = document.createElement("img")
              imgTag.setAttribute("src", url)
              editorBox.appendChild(imgTag)
            })
          })
        index += 1
        fileProgress.value = index / hitomiJSON.files.length
      }
      fileProgress.remove()
    })
}

// hitomi 전체 가져오기
function hitomiFetch() {
  let result = window.prompt("hitomi코드를 입력하세요");
  if (result && result.match(/\d+\.htm/)) {
    hitomiGetImage(result.match(/\d+\.htm/)[0].replace(".htm", ""))
  } else {
    if (result && result.match(/\d+/g) && result.match(/\d+/g).length === 1) {
      hitomiGetImage(result.match(/\d+/g)[0])
    } else {
      alert("hitomi 코드 또는 주소를 읽을 수 없습니다!")
    }
  }
}

// e-hentai 정보 가져오기
function ehInfo(url, getTable = false) {
  return new Promise((resolve, reject) => {
    const apiUrl = "https://api.e-hentai.org/api.php"
    const gidlist = url.match(/\d+\/\w+/)[0].split("/")

    doFetch(apiUrl, {
        method: "POST",
        responseType: 'json',
        data: JSON.stringify({
          "method": "gdata",
          "gidlist": [gidlist],
          "namespace": 1
        })
      })
      .then(json => {
        const ehJSON = json.gmetadata[0]
        const ehProcessedJSON = Object()
        doFetch(ehJSON.thumb.replace("_l", "_250"), {
            method: 'GET',
            responseType: 'blob'
          })
          .then(blob => {
            UploadImageFile(blob)
              .then(imgsrc => {
                ehProcessedJSON.title = ["제목", ehJSON.title]
                ehProcessedJSON.thumb = ["표지", `<img src='${imgsrc}' alt='표지'>`]
                const ehTags = Object()
                ehTags.artist = []
                ehTags.group = []
                ehTags.character = []
                ehTags.language = []
                ehTags.male = []
                ehTags.female = []
                ehTags.tags = []
                ehJSON.tags.forEach(tag => {
                  let tagsl = tag.split(":")
                  switch (tagsl[0]) {
                    case "artist":
                      ehTags.artist.push(tagsl[1]);
                      break;
                    case "group":
                      ehTags.group.push(tagsl[1]);
                      break;
                    case "character":
                      ehTags.character.push(tagsl[1]);
                      break;
                    case "parody":
                      ehTags.character.push(tagsl[1]);
                      break;
                    case "language":
                      ehTags.language.push(tagsl[1]);
                      break;
                    case "male":
                      ehTags.male.push(tagsl[1] + " ♂");
                      break;
                    case "female":
                      ehTags.female.push(tagsl[1] + " ♀");
                      break;
                    default:
                      ehTags.tags.push(tagsl[1]);
                      break;
                  }
                })
                ehProcessedJSON.author = ["작가", arr2str(ehTags.artist)]
                ehProcessedJSON.group = ["그룹", arr2str(ehTags.group)]
                ehProcessedJSON.language = ["언어", arr2str(ehTags.language)]
                ehProcessedJSON.character = ["캐릭터", arr2str(ehTags.character)]
                ehProcessedJSON.tags = ["태그", arr2str(ehTags.tags.concat(ehTags.female.concat(ehTags.male)))]
                ehProcessedJSON.filecount = ["분량", `${ehJSON.filecount}장(${formatBytes(ehJSON.filesize)})`]
                ehProcessedJSON.url = ["출처", `<a href='${url}'>보러가기</a>`]
                resolve(makeTable(ehProcessedJSON, getTable))
              })
          })
      })
  })
}

// e-hentai 정보 채우기
function ehAuto(code = null) {
  let result = code || window.prompt("e-hentai 주소를 입력하세요");
  if (result && result.includes("e-hentai")) {
    if (!code) {
      ehInfo(result)
    } else {
      return result
    }
  }
}

// getchu 파싱
function getchuInfo(url, getTable = false) {
  return new Promise((resolve, reject) => {
    doFetch(url)
      .then(html => {
        const getchuProcessedJSON = Object()
        const infoBox = html.querySelector("#soft_table")
        getchuProcessedJSON.title = ["제목", strTrim(infoBox.querySelector("#soft-title").innerText)]
        const infoTable = infoBox.querySelectorAll("tbody > tr:nth-child(2) > th > table > tbody > tr")
        doFetch(`http://www.getchu.com/brandnew${infoBox.querySelector(".highslide").href.split("brandnew")[1]}`, {
            method: "GET",
            responseType: "blob",
            headers: {
              referer: url
            }
          })
          .then(async blob => {
            var tmpPromise = UploadImageFile(blob)
              .then(imgUrl => {
                getchuProcessedJSON.image = ["이미지", `<img src='${imgUrl}' alt="이미지">`]
                infoTable.forEach(tr => {
                  let infoTd = tr.querySelectorAll("td")
                  if (infoTd.length > 1) {
                    let td1 = strTrim(infoTd[0].innerText)
                    let td2 = strTrim(infoTd[1].innerText)

                    switch (td1) {
                      case "ブランド：":
                        getchuProcessedJSON.brand = ["브랜드", td2];
                        break;
                      case "定価：":
                        //getchuProcessedJSON.price = ["정가", td2];
                        break;
                      case "発売日：":
                        getchuProcessedJSON.o_date = ["발매일", td2];
                        break;
                      case "メディア：":
                        getchuProcessedJSON.media = ["미디어", td2];
                        break;
                      case "ジャンル：":
                        getchuProcessedJSON.genre = ["장르", dictionary(td2)];
                        break;
                      case "原画：":
                        getchuProcessedJSON.c_artist = ["원화", td2];
                        break;
                      case "シナリオ：":
                        getchuProcessedJSON.scenario = ["시나리오", td2];
                        break;
                      case "時間：":
                        getchuProcessedJSON.playtime = ["시간", td2];
                        break;
                      case "アーティスト：":
                        getchuProcessedJSON.artist = ["아티스트", td2];
                        break;
                      case "商品同梱特典：":
                        getchuProcessedJSON.special = ["상품 동봉 특전", td2];
                        break;
                      default:
                        break;
                    }
                  }
                })
                getchuProcessedJSON.url = ["출처", `<a href='${url}'>보러가기</a>`]
                resolve(makeTable(getchuProcessedJSON, getTable))
              })
          })
      })
  })
}

// getchu 정보 채우기
function getchuAuto(code = null) {
  let result = code || window.prompt("getchu 주소를 입력하세요");
  if (result) {
    if (!code) {
      getchuInfo(result)
    } else {
      return result
    }
  }
}

// fanza 파싱
function fanzaInfo(url, getTable = false) {
  return new Promise((resolve, reject) => {
    doFetch(url)
      .then(html => {
        const fanzaProcessedJSON = Object()
        if (url.includes("doujin")) {
          const infoBox = html.querySelector("div.l-areaMainColumn")
          doFetch(infoBox.querySelector("#fn-slides > li:nth-child(1) > a").href, {
              method: 'GET',
              responseType: 'blob'
            })
            .then(blob => {
              UploadImageFile(blob)
                .then(imgsrc => {
                  fanzaProcessedJSON.title = ["제목", strTrim(infoBox.querySelector("h1.productTitle__txt").innerText)]
                  fanzaProcessedJSON.image = ["이미지", `<img src='${imgsrc}' alt="이미지">`]
                  infoBox.querySelectorAll(".productAttribute-listItem > span").forEach(item => {
                    if (item.className.includes("productGenre")) {
                      let td1 = "분류"
                      let td2 = strTrim(item.innerText)
                      switch (td2) {
                        case "ボイス":
                          fanzaProcessedJSON.type = [td1, "보이스"];
                          break;
                        case "コミック":
                          fanzaProcessedJSON.type = [td1, "만화"];
                          break;
                        case "ＣＧ":
                          fanzaProcessedJSON.type = [td1, "CG"];
                          break;
                        case "ゲーム":
                          fanzaProcessedJSON.type = [td1, "게임"];
                          break;
                        case "コスプレ動画":
                          fanzaProcessedJSON.type = [td1, "코스프레 동영상"]
                          alert("실사 자료는 아카라이브 및 심야식당 규정에 어긋납니다.")
                          throw new Error("규정 위반 자료")
                      }
                    }
                  })
                  infoBox.querySelectorAll(".productInformation__item").forEach(child => {
                    let td1 = child.querySelector(".informationList__ttl").innerText
                    let td2
                    let tdd = child.querySelector(".informationList__txt")
                    if (tdd) {
                      td2 = tdd.innerText
                    }
                    switch (td1) {
                      case "シリーズ":
                        fanzaProcessedJSON.series = ["시리즈", td2]
                        break;
                      case "題材":
                        fanzaProcessedJSON.sanction = ["제재", dictionary(td2)]
                        break;
                      case "音声本数":
                        fanzaProcessedJSON.voice_count = ["음성 개수", td2]
                        break;
                      case "動画本数":
                        fanzaProcessedJSON.video_count = ["영상 개수", td2]
                        break;
                      case "ジャンル":
                        let tagList = []
                        infoBox.querySelectorAll(".genreTag__item").forEach(tag => {
                          tagList.push(dictionary(tag.innerText))
                        })
                        fanzaProcessedJSON.tags = ["태그", arr2str(tagList)]
                        break;
                      case "ファイル容量":
                        fanzaProcessedJSON.size = ["용량", td2]
                        break;
                    }
                  })
                  let sample = infoBox.querySelectorAll("div.sampleButton__item")
                  if (sample.length) {
                    const sampleUrlList = []
                    sample.forEach(tag => {
                      if (tag.querySelector(".sampleButton__btn") && tag.querySelector(".sampleButton__txt")) {
                        sampleUrlList.push(`<a href='${tag.querySelector(".sampleButton__btn").href}'>${tag.querySelector(".sampleButton__txt").innerText}</a>`)
                      }
                    })
                    fanzaProcessedJSON.sample = ["샘플", arr2str(sampleUrlList)]
                  }
                  fanzaProcessedJSON.url = ["출처", `<a href='${url}'>보러가기</a>`]
                  resolve(makeTable(fanzaProcessedJSON, getTable))
                })
            })
        }
        if (url.includes("dlsoft")) {
          const infoBox = html.querySelector("#mu > div.page-detail")
          doFetch(infoBox.querySelector("div.slider-area > ul > li:nth-child(1) > img").src, {
              method: 'GET',
              responseType: 'blob'
            })
            .then(blob => {
              UploadImageFile(blob)
                .then(imgsrc => {
                  fanzaProcessedJSON.title = ["제목", strTrim(infoBox.querySelector("#title").innerText)]
                  fanzaProcessedJSON.image = ["이미지", `<img src='${imgsrc}' alt="이미지">`]
                  if (infoBox.querySelector("tr.brand > td.content")) {
                    fanzaProcessedJSON.brand = ["브랜드", infoBox.querySelector("tr.brand > td.content").innerText]
                  }
                  infoBox.querySelector("div.container02").querySelectorAll("tr").forEach(tr => {
                    let rtd1 = tr.querySelector("td.type-left")
                    let rtd2 = tr.querySelector("td.type-right")
                    if (rtd1 && rtd2) {
                      let td1 = strTrim(rtd1.innerText)
                      let td2 = strTrim(rtd2.innerText)
                      switch (td1) {
                        case "シリーズ":
                          fanzaProcessedJSON.sanction = ["시리즈", td2]
                          break;
                        case "ゲームジャンル":
                          fanzaProcessedJSON.genre = ["게임 장르", dictionary(td2)]
                          break;
                        case "ボイス":
                          switch (td2) {
                            case "あり":
                            case "有り":
                              fanzaProcessedJSON.voice = ["음성", "있음"]
                              break;
                            case "なし":
                            case "無し":
                              fanzaProcessedJSON.voice = ["음성", "있음"]
                              break;
                            default:
                              fanzaProcessedJSON.voice = ["음성", td2]
                              break;
                          }
                          break;
                        case "原画":
                          fanzaProcessedJSON.c_artist = ["원화", td2]
                          break;
                        case "シナリオ":
                          fanzaProcessedJSON.scenario = ["시나리오", td2]
                          break;
                        case "ジャンル":
                          let tagList = []
                          tr.querySelectorAll("li").forEach(tag => {
                            tagList.push(dictionary(tag.innerText))
                          })
                          fanzaProcessedJSON.tags = ["태그", arr2str(tagList)]
                          break;
                      }
                    }
                  })
                  let sampleBx = infoBox.querySelector(".bx-detail-dlsample")
                  if (sampleBx) {
                    let sample = sampleBx.querySelectorAll("li")
                    const sampleUrlList = []
                    sample.forEach(tag => {
                      if (tag.querySelector("a") && tag.querySelector(".download-txt")) {
                        sampleUrlList.push(`<a href='${tag.querySelector("a").href}'>${tag.querySelector(".download-txt").innerText}</a>`)
                      }
                    })
                    fanzaProcessedJSON.sample = ["샘플", arr2str(sampleUrlList)]
                  }
                  fanzaProcessedJSON.url = ["출처", `<a href='${url}'>보러가기</a>`]
                  resolve(makeTable(fanzaProcessedJSON, getTable))
                })
            })
        }
        if (url.includes("book.")) {
          const infoBox = html.querySelector("div.m-boxDetailProduct")
          doFetch(infoBox.querySelector("span.m-boxDetailProduct__pack__item > a").href, {
              method: 'GET',
              responseType: 'blob'
            })
            .then(blob => {
              UploadImageFile(blob)
                .then(imgsrc => {
                  fanzaProcessedJSON.title = ["제목", strTrim(infoBox.querySelector("#title").innerText)]
                  fanzaProcessedJSON.image = ["이미지", `<img src='${imgsrc}' alt="이미지">`]
                  let index = 0
                  for (let list of infoBox.querySelectorAll(".m-boxDetailProductInfoMainList__description__list")) {
                    let tmpList = []
                    list.querySelectorAll("li").forEach(tag => {
                      tmpList.push(strTrim(tag.innerText))
                    })
                    if (index === 0) {
                      fanzaProcessedJSON.artist = ["작가", arr2str(tmpList)]
                    }
                    if (index === 1) {
                      fanzaProcessedJSON.series = ["시리즈", arr2str(tmpList)]
                    }
                    index += 1
                  }
                  fanzaProcessedJSON.summary = ["줄거리", infoBox.querySelector(".m-boxDetailProduct__info__story").innerText]
                  fanzaProcessedJSON.url = ["출처", `<a href='${url}'>보러가기</a>`]
                  resolve(makeTable(fanzaProcessedJSON, getTable))
                })
            })
        }
        if (url.includes("anime")) {
          const infoBox = html.querySelector("div.page-detail")
          doFetch(infoBox.querySelector("#sample-video > a").href, {
              method: 'GET',
              responseType: 'blob'
            })
            .then(blob => {
              UploadImageFile(blob)
                .then(imgsrc => {
                  fanzaProcessedJSON.title = ["제목", strTrim(infoBox.querySelector("#title").innerText)]
                  fanzaProcessedJSON.image = ["이미지", `<img src='${imgsrc}' alt="이미지">`]
                  infoBox.querySelector("table.mg-b20").querySelectorAll("tr").forEach(tag => {
                    let rtd1 = tag.querySelector("td:nth-child(1)")
                    let rtd2 = tag.querySelector("td:nth-child(2)")
                    if (rtd1 && rtd2) {
                      let td1 = strTrim(rtd1.innerText)
                      let td2 = strTrim(rtd2.innerText)
                      switch (td1) {
                        case "収録時間：":
                          fanzaProcessedJSON.playtime = ["러닝타임", td2]
                          break;
                        case "シリーズ：":
                          fanzaProcessedJSON.series = ["시리즈", td2]
                          break;
                        case "メーカー：":
                          fanzaProcessedJSON.maker = ["제조사", td2]
                          break;
                        case "レーベル：":
                          fanzaProcessedJSON.label = ["레이블", td2]
                          break;
                        case "ジャンル：":
                          fanzaProcessedJSON.genre = ["장르", dictionary(td2)]
                          break;
                        default:
                          break;
                      }
                    }
                  })
                  const sampleVideo = infoBox.querySelector("#detail-sample-movie > div > a.d-btn")
                  if (sampleVideo) {
                    sampleVideo.getAttribute("onclick").match(/\/digital.*\//)
                    fanzaProcessedJSON.sample = ["샘플", `<a href='https://www.dmm.co.jp${sampleVideo}'>샘플 영상 보기</a>`]
                  }
                  fanzaProcessedJSON.url = ["출처", `<a href='${url}'>보러가기</a>`]
                  resolve(makeTable(fanzaProcessedJSON, getTable))
                })
            })
        }
      })
  })
}

// fanza 정보 채우기
function fanzaAuto(code = null) {
  let result = code || window.prompt("fanza 주소를 입력하세요");
  if (result) {
    if (!code) {
      fanzaInfo(result)
    } else {
      return result
    }
  }
}

// pixiv 파싱 (미완성)
function pixivInfo(url) {
  doFetch(url)
    .then(html => {
      console.log(html)
    })
}

// blob을 이미지 객체로
const blobToImage = (blob) => {
  return new Promise(resolve => {
    const url = URL.createObjectURL(blob)
    let img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.src = url
  })
}

// 미방짤 제너레이터
function deviantTaste(optList, custom) {
  return new Promise((resolve, reject) => {
    doFetch("https://ac-p2.namu.la/20210518/be8da1e1ec2913b1560967e71d37276e8886d6b9ab40da3f9b16d51cbb1e848d.png?type=orig", {
        method: "GET",
        responseType: "blob"
      })
      .then(blob => {
        blobToImage(blob)
          .then(image => {
            const canvas = document.createElement("canvas")
            canvas.setAttribute("id", "sm-translation-image-process-canvas")
            canvas.setAttribute("width", "1200")
            canvas.setAttribute("height", "800")

            const ctx = canvas.getContext("2d")
            ctx.drawImage(image, 0, 0, 1200, 800)
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'red';
            optList.forEach(taste => {
              deviantTasteCanvasRect(ctx, taste)
            })
            if (custom) {
              ctx.font = "28pt 나눔고딕 extraBold";
              ctx.fillStyle = "white";
              ctx.fillText(custom, 130, 708);

              ctx.lineWidth = 5;
              ctx.strokeStyle = 'red';
              ctx.strokeRect(125, 670, 10 + ctx.measureText(custom).width, 53);

              ctx.lineWidth = 2.5;
              ctx.rotate(45 * Math.PI / 180);
              ctx.strokeStyle = 'white';
              ctx.strokeRect(555, 412, 16.5, 16.5);
            }
            canvas.toBlob(function(blob) {
              UploadImageFile(blob)
                .then(url => {
                  resolve(`<img src="${url}" alt="미방짤 : ${arr2str(optList)}">`)
                })
            }, "image/png")
          })
      })
  })
}

// 미방짤 표시 좌표
function deviantTasteCanvasRect(ctx, opt) {
  switch (opt) {
    case "게이":
      ctx.strokeRect(125, 355, 85, 50);
      break;
    case "보추":
      ctx.strokeRect(225, 355, 85, 50);
      break;
    case "후타":
      ctx.strokeRect(325, 355, 85, 50);
      break;
    case "청아":
      ctx.strokeRect(125, 407, 85, 50);
      break;
    case "중노년여성":
      ctx.strokeRect(225, 407, 332, 50);
      break;
    case "스캇":
      ctx.strokeRect(125, 460, 85, 50);
      break;
    case "방뇨":
      ctx.strokeRect(225, 460, 85, 50);
      break;
    case "수간":
      ctx.strokeRect(125, 513, 85, 50);
      break;
    case "충간":
      ctx.strokeRect(225, 513, 85, 50);
      break;
    case "이종간":
      ctx.strokeRect(325, 513, 120, 50);
      break;
    case "고어":
      ctx.strokeRect(125, 566, 85, 50);
      break;
    case "료나":
      ctx.strokeRect(225, 566, 85, 50);
      break;
    case "보어(식인)":
      ctx.strokeRect(325, 566, 183, 50);
      break;
    case "보태":
      ctx.strokeRect(125, 619, 85, 50);
      break;
    case "임신":
      ctx.strokeRect(225, 619, 85, 50);
      break;
    case "출산":
      ctx.strokeRect(325, 619, 85, 50);
      break;
  }
}

// 미방짤 제너레이터 v2
function deviantTasteV2(optList, none) {
  return new Promise((resolve, reject) => {
    doFetch("https://ac-p2.namu.la/20210807/4ff556913b2a6547c8d424442db74bb6a72cf910dae083b829e46040994bd021.png?type=orig", {
        method: "GET",
        responseType: "blob"
      })
      .then(blob => {
        blobToImage(blob)
          .then(image => {
            const canvas = document.createElement("canvas")
            canvas.setAttribute("id", "sm-translation-image-process-canvas")
            canvas.setAttribute("width", "1000")
            canvas.setAttribute("height", "665")

            const ctx = canvas.getContext("2d")
            ctx.drawImage(image, 0, 0, 1000, 665)
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'red';
            optList.forEach(taste => {
              deviantTasteCanvasRectV2(ctx, taste)
            })
            canvas.toBlob(function(blob) {
              UploadImageFile(blob)
                .then(url => {
                  resolve(`<img src="${url}" alt="미방짤 : ${arr2str(optList)}">`)
                })
            }, "image/png")
          })
      })
  })
}

// 미방짤 표시 좌표 v2
function deviantTasteCanvasRectV2(ctx, opt) {
  switch (opt) {
    case "게이":
      ctx.strokeRect(135, 273, 80, 50);
      break;
    case "보추":
      ctx.strokeRect(222, 273, 80, 50);
      break;
    case "후타":
      ctx.strokeRect(310, 273, 80, 50);
      break;
    case "청아":
      ctx.strokeRect(135, 325, 200, 50);
      break;
    case "중노년여성":
      ctx.strokeRect(343, 325, 115, 50);
      break;
    case "스캇":
      ctx.strokeRect(135, 383, 80, 50);
      break;
    case "방뇨":
      ctx.strokeRect(222, 383, 80, 50);
      break;
    case "수간":
      ctx.strokeRect(623, 270, 80, 50);
      break;
    case "충간":
      ctx.strokeRect(710, 270, 80, 50);
      break;
    case "이종간":
      ctx.strokeRect(797, 270, 116, 50);
      break;
    case "고어":
      ctx.strokeRect(623, 323, 80, 50);
      break;
    case "료나":
      ctx.strokeRect(710, 323, 80, 50);
      break;
    case "보어(식인)":
      ctx.strokeRect(797, 323, 80, 50);
      break;
    case "보태":
      ctx.strokeRect(623, 381, 80, 50);
      break;
    case "임신":
      ctx.strokeRect(710, 381, 80, 50);
      break;
    case "출산":
      ctx.strokeRect(797, 381, 80, 50);
      break;
  }
}

// 미방짤 제너레이터 v3
function deviantTasteV3(optList, none) {
  return new Promise((resolve, reject) => {
    resolve(`<img src="${deviantTasteDictionaryV3[optList[0]]}" alt="미방짤 : ${optList[0]}">`)
  })
}

deviantTasteDictionaryV3 = {
  '게이':'https://ac-p.namu.la/20210909s1/651903aefbd954eac8ab7093f6fb1974aa477ec07f4530a0ab0efe6b6b3b23f9.png',
  '보추':'https://ac-p.namu.la/20210909s1/f443778aac0c2efe6891c9a4a70ff9c79c4aa07d7bf11e9c10951cf6363eebfd.png',
  '후타':'https://ac2-p.namu.la/20210909s2/04d67121a4bc3cb224e24150835c13fa2a203fcba6332c75cf6619da99e39694.png',
  '청아':'https://ac-p.namu.la/20210909s1/e9eccb512840ead124fb3fabf2bf293cf41d669c74819e9196340cd1c351ee5e.png',
  '중노년여성':'https://ac2-p.namu.la/20210909s2/26496f0827eb9e5aec9febc8405273be530e43b6c47abba9fd4db056f2a6a1dc.png',
  '스캇':'https://ac-p.namu.la/20210909s1/b46b21623c9972d71cacc325b042cce5803854b2b374b29ffdf65d3a406598d7.png',
  '방뇨':'https://ac2-p.namu.la/20210909s2/674493f8a293ccba3aa7f50654357a6109fdf76d3d802af5f2ab28a9dca0e616.png',
  '수간':'https://ac-p.namu.la/20210909s1/9386bd44dc0e953f9ff4e55a640c24cc5ca09a2dfaa9a23b1447990b52a36e70.png',
  '충간':'https://ac2-p.namu.la/20210909s2/f437785af97cb79d3f190ea80c2af45af7fe3ee368e4095973f998b3b13f1310.png',
  '이종간':'https://ac-p.namu.la/20210909s1/4616e6f0839d60d04250f5e982e17222b28359d13893fcf84af6489cf78580a4.png',
  '고어':'https://ac2-p.namu.la/20210909s2/d302d617966c45a98de5f44cbf0fdfd9c45466cf3c06c32beef892310e6362ce.png',
  '료나':'https://ac2-p.namu.la/20210909s2/a387023dcd6c4e80a0aaeadd57ebdd970ca858510261dbb5b465b12e725eef04.png',
  '보어(식인)':'https://ac2-p.namu.la/20210909s2/dd1dba41aa7e1d54319bd37561025123a02d6472003fda36ce7b14b9541f732f.png',
  '임신':'https://ac-p.namu.la/20210909s1/eab0e5dc093aa4e9ee5b71158bc3459f3722f7a79b7efac094b4e8129dec0ca2.png',
  '보테':'https://ac-p.namu.la/20210909s1/ae03617f8bc99733c4200e519629a69cf2140b06150db07f8b52449ddbaf2ce8.png',
  '출산':'https://ac2-p.namu.la/20210909s2/2fcc8a2e97e1e917eeecb11a673db9a939b49fdd7c6b30f6f6b1c2255cf77e05.png'
}

// 미방짤 모달
function deviantTasteMenu() {
  let smtModalStyle = document.createElement("style")
  smtModalStyle.append(`
.smtmodal {
  display: none; 
  position: fixed; 
  z-index: 100; 
  padding-top: 100px; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  overflow: auto; 
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4); 
}

.smtmodal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 40%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s
}

@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0} 
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

.smtclose {
  color: white;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.smtclose:hover,
.smtclose:focus {
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.smtmodal-header {
  padding: 0 20px 45px 20px;
  background-color: lightgray;
  color: white;
}

.smtmodal-body {
  padding: 2px 30px;
}

.smtmodal-footer {
  padding: 0 0 45px 0;
  background-color: lightgray;
  color: white;
}

.sexy-color-fresh {
  background: #0fb8ad;  
  background: -webkit-linear-gradient(135deg, #0fb8ad 0%, #1fc8db 51%, #2cb5e8 75%); 
  background: -o-linear-gradient(135deg, #0fb8ad 0%, #1fc8db 51%, #2cb5e8 75%); 
  background: -moz-linear-gradient(135deg, #0fb8ad 0%, #1fc8db 51%, #2cb5e8 75%); 
  background: linear-gradientlinear-gradient(135deg, #0fb8ad 0%, #1fc8db 51%, #2cb5e8 75%); 
  background: linear-gradient(135deg, #0fb8ad 0%, #1fc8db 51%, #2cb5e8 75%);
}

`)
  let smtModal = document.createElement("div")
  smtModal.setAttribute("id", "sm-taste-modal")
  smtModal.setAttribute("class", "smtmodal")
  smtModal.innerHTML = `
    <div class="smtmodal-content">
      <div class="smtmodal-header sexy-color-fresh">
        <span id ="sm-taste-modal-close" class="smtclose">&times;</span>
      </div>
      <div id="sm-taste-modal-body" class="smtmodal-body clearfix">
        <h2 style="margin:30px 0">미방짤 메이커</h2>
      </div>
      <div class="smtmodal-footer sexy-color-fresh">
      </div>
    </div>`

  document.head.appendChild(smtModalStyle)
  document.body.appendChild(smtModal)

  let modal = document.getElementById("sm-taste-modal");
  let span = document.getElementById("sm-taste-modal-close")
  let body = document.getElementById("sm-taste-modal-body");

  let checkList = [
    ["게이", "보추", "후타"],
    ["청아", "중노년여성"],
    ["스캇", "방뇨"],
    ["수간", "충간", "이종간"],
    ["고어", "료나", "보어(식인)"],
    ["보태", "임신", "출산"]
  ]

  const customTaste = document.createElement("input")
  customTaste.setAttribute("id", "sm-taste-modal-cutom-input")
  customTaste.setAttribute("class", "form-control form-control-sm float-right")

  const customTasteLabel = document.createElement("p")
  customTasteLabel.innerText = "또다른 취향 태그"

  const customTasteP = document.createElement("p")
  customTasteP.setAttribute("class", "clearfix")
  customTasteP.setAttribute("style", "margin-bottom:20px")
  customTasteP.appendChild(customTaste)

  const confirmBtn = document.createElement("div")
  confirmBtn.setAttribute("id", "sm-taste-modal-confirm-btn")
  confirmBtn.setAttribute("class", "btn btn-arca float-right")
  confirmBtn.setAttribute("style", "margin-bottom:20px")
  confirmBtn.innerText = "미방짤 만들기"
  confirmBtn.onclick = function(e) {
    e.target.innerText = "파일 처리중..."
    const optionList = []
    document.querySelectorAll(".sm-taste-modal-taste-checkbox").forEach(chkb => {
      if (chkb.checked) {
        optionList.push(chkb.value)
      }
    })
    let deviantTasteversion
    
    if (optionList.length === 1) {
      deviantTasteversion = deviantTasteV3
    } else if (customTaste.value) {
      deviantTasteversion = deviantTaste
    } else {
      deviantTasteversion = deviantTasteV2
    }
    
    deviantTasteversion(optionList, customTaste.value)
      .then(img => {
        let editorBox = document.querySelector('.write-body .fr-element')
        editorBox.innerHTML = img + editorBox.innerHTML
        e.target.innerText = "미방짤 만들기"
        modal.style.display = "none"
      })
  }

  easyCheckbox(body, checkList, "sm-taste-modal-taste-checkbox")
  body.appendChild(customTasteLabel)
  body.appendChild(customTasteP)
  body.appendChild(confirmBtn)

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  modal.style.display = "block";
}


// 미방짤 init
function deviantTasteMenuInit() {
  let modal = document.getElementById("sm-taste-modal");
  if (modal === null && (location.href.includes("/write") || location.href.includes("/edit"))) {
    deviantTasteMenu()
  } else {
    if (modal !== null) {
      modal.style.display = "block"
    }
  }
}

// 파일 -> 어레이버퍼
function fileToArrayBuffer(myFile) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(myFile);
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) {
        var arrayBuffer = evt.target.result
        resolve(arrayBuffer)
      }
      reject(new Error("ArrayBuffer 변환 실패"));
    }
  })
}

// 어레이버퍼 덧셈 -> Uint8Array
function appendBufferToArray(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp;
};

// 이미지 첨부파일 제너레이터
function imagezipBind(image, file) {
  return new Promise((resolve, reject) => {
    fileToArrayBuffer(image)
      .then(imageBuffer => {
        fileToArrayBuffer(file)
          .then(fileBuffer => {
            let blob = new Blob([appendBufferToArray(imageBuffer, fileBuffer)])
            UploadImageFile(blob, null, true)
              .then(url => {
                resolve(`<img src="${url}" alt="이미지+파일">`)
              })
          }, "image/jpeg")
      })
  })
}

// 이미지 jpg 컨버터
function imageToJpgConvert() {
  let c = document.createElement("canvas")
  let ctx = c.getContext("2d");
  c.width = this.width;
  c.height = this.height;
  ctx.drawImage(this, 0, 0);
  c.toBlob(function(blob) {
    resolve(blob)
  }, "image/jpeg");
}

// 이미지 첨부파일 모달
function imagezipMaker() {
  let smiModalStyle = document.createElement("style")
  smiModalStyle.append(`
.smimodal {
  display: none; 
  position: fixed; 
  z-index: 100; 
  padding-top: 100px; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  overflow: auto; 
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4); 
}

.smimodal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 40%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s
}

@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0} 
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

.smiclose {
  color: white;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.smiclose:hover,
.smiclose:focus {
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.smimodal-header {
  padding: 0 20px 45px 20px;
  background-color: lightgray;
  color: white;
}

.smimodal-body {
  padding: 2px 30px;
}

.smimodal-footer {
  padding: 0 0 45px 0;
  background-color: lightgray;
  color: white;
}

.sexy-color-gold {
  background: linear-gradient(to right, gold 0%, goldenrod 100%);
}

`)
  let smiModal = document.createElement("div")
  smiModal.setAttribute("id", "sm-imagezip-modal")
  smiModal.setAttribute("class", "smimodal")
  smiModal.innerHTML = `
    <div class="smimodal-content">
      <div class="smimodal-header sexy-color-gold">
        <span id ="sm-imagezip-modal-close" class="smiclose">&times;</span>
      </div>
      <div id="sm-imagezip-modal-body" class="smimodal-body clearfix">
        <h2 style="margin:30px 0">이미지+파일 바인더</h2>
      </div>
      <div class="smimodal-footer sexy-color-gold">
      </div>
    </div>`

  document.head.appendChild(smiModalStyle)
  document.body.appendChild(smiModal)

  let modal = document.getElementById("sm-imagezip-modal");
  let span = document.getElementById("sm-imagezip-modal-close")
  let body = document.getElementById("sm-imagezip-modal-body");

  const imageFileH5 = document.createElement("h5")
  imageFileH5.setAttribute("style", "margin-bottom:20px")
  imageFileH5.innerText = "이미지 선택"

  const imageFileInput = document.createElement("input")
  imageFileInput.setAttribute("id", "sm-imagezip-modal-image-input")
  imageFileInput.setAttribute("type", "file")
  imageFileInput.setAttribute("style", "margin-bottom:20px")

  const imageUrl = document.createElement("input")
  imageUrl.setAttribute("id", "sm-imagezip-modal-url-input")
  imageUrl.setAttribute("class", "form-control form-control-sm float-right")

  const imageUrlLabel = document.createElement("p")
  imageUrlLabel.innerText = "또는 링크로 이미지 가져오기"

  const imageUrlP = document.createElement("p")
  imageUrlP.setAttribute("class", "clearfix")
  imageUrlP.setAttribute("style", "margin-bottom:20px")
  imageUrlP.appendChild(imageUrl)

  const fileH5 = document.createElement("h5")
  fileH5.innerText = "파일 추가"
  fileH5.setAttribute("style", "margin-bottom:20px")

  const fileInput = document.createElement("input")
  fileInput.setAttribute("id", "sm-imagezip-modal-file-input")
  fileInput.setAttribute("type", "file")
  fileInput.setAttribute("multiple", "")
  fileInput.setAttribute("style", "margin-bottom:20px")

  const webkitdirectoryH5 = document.createElement("h5")
  webkitdirectoryH5.innerText = "폴더 추가"
  webkitdirectoryH5.setAttribute("style", "margin-bottom:20px")

  const webkitdirectoryInput = document.createElement("input")
  webkitdirectoryInput.setAttribute("id", "sm-imagezip-modal-webkitdirectory-input")
  webkitdirectoryInput.setAttribute("type", "file")
  webkitdirectoryInput.setAttribute("webkitdirectory", "")
  webkitdirectoryInput.setAttribute("directory", "")
  webkitdirectoryInput.setAttribute("multiple", "")
  webkitdirectoryInput.setAttribute("style", "margin-bottom:20px")

  const confirmBtn = document.createElement("div")
  confirmBtn.setAttribute("id", "sm-imagezip-modal-confirm-btn")
  confirmBtn.setAttribute("class", "btn btn-arca float-right")
  confirmBtn.setAttribute("style", "margin:60px 0 20px 0")
  confirmBtn.innerText = "이미지+파일 합치기"
  confirmBtn.onclick = function(e) {
    new Promise((resolve, reject) => {
        e.target.innerText = "파일 처리중..."
        new Promise(async (resolve, reject) => {
          const fileList = fileInput.files
          const directoryList = webkitdirectoryInput.files
          const allFileList = [...fileList, ...directoryList]
          if (allFileList.length === 1 && directoryList.length === 0) {
            resolve(fileList[0])
          } else {
            const zip = new JSZip();
            for (let userFile of allFileList) {
              await fileToArrayBuffer(userFile).then(buffer => {
                let blob = new Blob([buffer])
                zip.file(userFile.webkitRelativePath || userFile.name, blob);
              })
            }
            e.target.innerText = "파일 압축중..."
            zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: {
                  level: 9
                }
              })
              .then(zipFile => {
                resolve(zipFile)
              })
          }
        }).then(resultFile => {
          e.target.innerText = "파일 업로드중..."
          if (imageFileInput.files[0]) {
            resolve(imagezipBind(imageFileInput.files[0], resultFile))
          } else {
            let imgSrc
            if (imageUrl.value) {
              imgSrc = imageUrl.value
            } else {
              imgSrc = "https://p-ac.namu.la/20210409/be7f73a4b81529309fb0777af0ef42972e8869d637f0fa5940ab8cf145edfc0e.png?type=orig"
            }
            doFetch(imgSrc, {
                method: "GET",
                responseType: "blob"
              })
              .then(blob => {
                resolve(imagezipBind(blob, resultFile))
              })
          }
        })
      })
      .then(img => {
        let editorBox = document.querySelector('.write-body .fr-element')
        editorBox.innerHTML = img + editorBox.innerHTML
        modal.style.display = "none"
      })
  }
  body.appendChild(imageFileH5)
  body.appendChild(imageFileInput)
  body.appendChild(imageUrlLabel)
  body.appendChild(imageUrlP)
  body.appendChild(fileH5)
  body.appendChild(fileInput)
  body.appendChild(webkitdirectoryH5)
  body.appendChild(webkitdirectoryInput)
  body.appendChild(confirmBtn)

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  modal.style.display = "block";
}

// 이미지 첨부파일 init
function imagezipMakerInit() {
  let modal = document.getElementById("sm-imagezip-modal");
  if (modal === null && (location.href.includes("/write") || location.href.includes("/edit"))) {
    imagezipMaker()
  } else {
    if (modal !== null) {
      modal.style.display = "block"
    }
  }
}

// 글 댓글 수 찾기 함수
function userInfoParse(url) {
  return new Promise((resolve, reject) => {
    doFetch(url, {
        method: 'GET',
        responseType: 'document'
      }, true)
      .then(html => {
        const infoBox = html.querySelector(".card-block")
        let filtered = Array.from(infoBox.children).filter(function(value, index, arr) {
          if (value.localName === "div") {
            return value
          }
        })
        const point = filtered.findIndex(function(e) {
          if (e.className === "clearfix") {
            return true
          }
        })
        const articleNum = point
        const replyNum = filtered.length - point - 1
        resolve(String(articleNum) + " / " + String(replyNum))
      })
      .catch(e => {
        resolve("삭제됨")
      })
  })
}

// 글 댓글 수 표시 함수
function userInfoView() {
  const smtTooltipStyle = document.createElement("style")
  smtTooltipStyle.append(`
.smttooltip {
  position: relative;
  display: inline-block;
}

.smttooltip .smttooltiptext {
  visibility: hidden;
  width: 60px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 50;
  bottom: 125%;
  left: 50%;
  margin-left: -30px;
  opacity: 0;
  transition: opacity 0.3s;
}

.smttooltip .smttooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.smttooltip:hover .smttooltiptext {
  visibility: visible;
  opacity: 1;
}`)
  document.head.appendChild(smtTooltipStyle)
  document.querySelectorAll("div.list-area").forEach(tag => {
    tag.setAttribute("style", "overflow:visible")
  })
  document.querySelectorAll("div.info-row").forEach(tag => {
    tag.setAttribute("style", "overflow:visible")
  })
  document.querySelector(".article-wrapper").querySelectorAll("span.user-info").forEach(tag => {
    const smtTooltip = document.createElement("span")
    smtTooltip.setAttribute("class", "smttooltiptext")
    smtTooltip.innerText = "　"

    tag.querySelector("a").classList.add("smttooltip")
    tag.querySelector("a").appendChild(smtTooltip)
    tag.querySelector("a").onmouseover = function(e) {
      if (e.target.href) {
        userInfoParse(e.target.href)
          .then(str => {
            smtTooltip.innerText = str
          })
      }
    }
  })
}

// 글 댓글 수 표시 init
function userInfoViewInit() {
  if (location.href.match(/\/b\/.*\/\d+/) && !location.href.includes("/edit") && window.innerWidth > 580) {
    userInfoView()
  }
}

// 클래스 변경 감지
function addClassNameListener(element, callback) {
  var lastClassName = element.className;
  window.setInterval(function() {
    var className = element.className;
    if (className !== lastClassName) {
      callback();
      lastClassName = className;
    }
  }, 10);
}

// 아카콘 링크하기
function arcaconLink() {
  const arcaconSrc = new Set()
  let arcaconId
  document.querySelector(".emoticons").querySelectorAll("img").forEach(tag => {
    arcaconSrc.add(tag.src)
    if (tag.getAttribute("data-emoticonid")) {
      arcaconId = tag.getAttribute("data-emoticonid")
    }
  })
  const editorBox = document.querySelector("#article_write_form > div.write-body > div > div.fr-wrapper > div")
  editorBox.querySelectorAll("img").forEach(tag => {
    if (arcaconSrc.has(tag.src) && arcaconId !== "0" && !tag.closest("a")) {
      const cloneImg = tag.cloneNode(true)
      const aTag = document.createElement("a")
      aTag.appendChild(cloneImg)
      aTag.href = `https://arca.live/e/${arcaconId}`
      tag.replaceWith(aTag)
    }
  })
}

// 아카콘 링크된 주소 글에서 바꾸기
async function arcaconLinkInArticle() {
  await sleep(1000)
  document.querySelector(".article-content").childNodes.forEach(tag => {
    try {
      let ta = tag.querySelectorAll("a")
    ta.forEach(pta => {
      if (pta) {
        const taa = pta.querySelector("a")
        if (taa) {
          taa.href = pta.href
        }
      }
    })
    } catch {
      // none
    }
  })
}

// 아카콘 링크하기 init
async function arcaconLinkInit() {
  if (location.href.includes("/write") || location.href.includes("/edit")) {
    let arcaconButton = document.querySelector(".btn-namlacon")
    while (arcaconButton === null) {
      await sleep(10)
      arcaconButton = document.querySelector(".btn-namlacon")
    }
    arcaconButton.onclick = function(e) {
      let arcaconPopup = document.querySelector(".write-body").querySelector(".fr-popup")
      addClassNameListener(arcaconPopup, arcaconLink)
    }
  } else if (location.href.match(/b\/.*?\/\d+/)) {
    arcaconLinkInArticle()
  }
}

// 클립보드 base64
async function clipboardPasteToBase64() {
  let editorBox = document.querySelector('.write-body .fr-element')
  while (editorBox === null) {
    await sleep(10)
    editorBox = document.querySelector('.write-body .fr-element')
  }
  editorBox.addEventListener('paste', (e) => {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    let paste = (e.clipboardData || window.clipboardData).getData('text');
    let matched = false
    const matchUrl = [
      "mega.nz",
      "drive.google.com",
      "photos.google.com",
      "ecchi.iwara.tv"
    ]
    matchUrl.forEach(url => {
      if(paste.includes(url)) {
        matched = true
      }
    })
    if (matched && paste.match(regex)) {
      paste = btoa(paste)
      const selection = window.getSelection();
      if (!selection.rangeCount) return false;
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(paste));

      e.preventDefault();
    }
  });
}

// 클립보드 base64 init
function clipboardPasteToBase64Init() {
  if (location.href.includes("/write") || location.href.includes("/edit")) {
    clipboardPasteToBase64()
  }
}

// 이미지 다른 확장자로 저장 컨텍스트 메뉴
function imageSaveContextMenu() {
  const contextmenuStyle = document.createElement("style")
  contextmenuStyle.append(`
  .smc-menu {
  display: none;
  position: absolute;
  width: 200px;
  margin: 0;
  padding: 0;
  background: #FFFFFF;
  list-style: none;
  box-shadow:
    0 15px 35px rgba(50,50,90,0.1),
    0 5px 15px rgba(0,0,0,0.07);
  overflow: hidden;
  z-index: 1400;
}

.smc-menu-option {
  border-left: 3px solid transparent;
  transition: ease .2s;
  display: block;
  padding: 10px;
  color: #737373;
  text-decoration: none;
  transition: ease .2s;
}

.smc-menu-option:hover {
  background: #00a495c4;
  border-left: 3px solid #00a495db;
  color: #FFFFFF;
  cursor:pointer
}`)
  document.head.appendChild(contextmenuStyle)

  const contextmenuUl = document.createElement("ul")
  contextmenuUl.setAttribute("class", "smc-menu")

  const contextmenuOptionList = [
    "커스텀",
    "rar",
    "7z",
    "zip"
  ]
  contextmenuOptionList.forEach(opt => {
    const contextmenuOption = document.createElement("li")
    contextmenuOption.innerText = `${opt} 확장자로 저장`
    contextmenuOption.setAttribute("class", "smc-menu-option")
    contextmenuOption.onclick = function(e) {
      if (e.target.innerText.includes("커스텀")) {
        opt = prompt("확장자를 입력하세요");
      }
      const url = imageSaveContextMenuTargetImage
      doFetch(url, {
          method: "GET",
          responseType: "blob"
        })
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob)
          const tempLink = document.createElement("a")
          tempLink.href = blobUrl;
          tempLink.download = `${url.split("/")[url.split("/").length-1].split(".")[0]}.${opt}`
          tempLink.click()
          URL.revokeObjectURL(blobUrl);
          e.target.innerText = `${opt} 확장자로 저장`
        })
    }
    contextmenuUl.appendChild(contextmenuOption)
  })
  document.body.appendChild(contextmenuUl)
  imageSaveContextMenuOpen(contextmenuUl)
}

let imageSaveContextMenuTargetImage

// 이미지 다른 확장자로 저장 컨텍스트 메뉴 열기
function imageSaveContextMenuOpen(menu) {
  let menuVisible = false;
  const toggleMenu = command => {
    menu.style.display = command === "show" ? "block" : "none";
    menuVisible = !menuVisible;
  };
  const setPosition = ({
    top,
    left
  }) => {
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    toggleMenu("show");
  };
  
  const allPtag = document.querySelector(".article-content").querySelectorAll("p")
  const allAtag = document.querySelector(".article-content").querySelectorAll("a")
  const allImgtag = document.querySelector(".article-content").querySelectorAll("img")
  const allTag = Array.from(new Set([...allPtag, ...allAtag, ...allImgtag]))
  allTag.forEach(pretag => {
    document.addEventListener("click", e => {
      if (menuVisible && e.target.className !== "smc-menu-option") {
        toggleMenu("hide")
      } else if (e.target.className === "smc-menu-option") {
        e.target.innerText = "다운로드 중..."
      }
    });
    pretag.addEventListener("contextmenu", e => {
      let tag = pretag.querySelector("a") || pretag.closest("a") || pretag
      pretag.querySelectorAll("img").forEach(multiTag => {
        if (multiTag === e.target) {
          tag = e.target.closest("a")
        }
      })
      console.log(tag)
      if (tag && tag.href.includes("?type=orig")) {
        e.preventDefault();
        const origin = {
          left: e.pageX - 200,
          top: e.pageY - 172
        };
        imageSaveContextMenuTargetImage = tag.href
        setPosition(origin);
        return false;
      }
    });
  })
}

// 이미지 다른 확장자로 저장 컨텍스트 메뉴 init
function imageSaveContextMenuInit() {
  if (location.href.match(/\/b\/.*?\/\d+/) && !location.href.includes("/edit")) {
    imageSaveContextMenu()
  }
}


// MEGA 링크 암호화
function MEGAencryptCore(e, t, n) {
  function r(e) {
    for (var t = window.atob(e.replace(/_/g, "/").replace(/-/g, "+")), n = t.length, r = new Uint8Array(n), a = 0; a < n; a++) r[a] = t.charCodeAt(a);
    return r
  }
  let a, i;
  e.includes("/folder/") ? (a = 0, i = 16) : e.includes("/file/") && (a = 1, i = 32);
  let l = e.match(/mega.nz\/.*\/(.*)#(.*)/),
    o = l[1],
    c = l[2],
    s = new TextEncoder("utf-8").encode(t),
    g = crypto.getRandomValues(new Uint8Array(32));
  crypto.subtle.importKey("raw", s, "PBKDF2", !1, ["deriveBits"]).then(function(e) {
    var t = {
      name: "PBKDF2",
      hash: "SHA-512",
      salt: g,
      iterations: 1e5
    };
    return crypto.subtle.deriveBits(t, e, 512)
  }).then(function(e) {
    let t = new Uint8Array(e),
      l = new Uint8Array(t.buffer, 0, i),
      s = r(c),
      h = new Uint8Array(t.buffer, 32, 32),
      u = new Uint8Array(l.length);
    for (var y = 0; y < u.length; y++) u[y] = l[y] ^ s[y];
    let f = r(o),
      w = 2 + f.length + g.length + u.length,
      A = new Uint8Array(w);
    A[0] = 2, A[1] = a, A.set(f, 2), A.set(g, 8), A.set(u, 40), async function(e, t) {
      const n = e,
        r = t,
        a = await crypto.subtle.importKey("raw", n, {
          name: "HMAC",
          hash: "SHA-256"
        }, !0, ["sign"]),
        i = await crypto.subtle.sign("HMAC", a, r);
      return new Uint8Array(i)
    }(h, A).then(function(e) {
      let t = new Uint8Array(A.length + e.length);
      t.set(A, 0), t.set(e, A.length);
      let r = function(e) {
        for (var t = "", n = e.byteLength, r = 0; r < n; r++) t += String.fromCharCode(e[r]);
        return window.btoa(t).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "")
      }(t);
      n("https://mega.nz/#P!" + r)
    })
  })
}


// MEGA 링크 암호화 모달
function MEGAencrypt() {
  let smmModalStyle = document.createElement("style")
  smmModalStyle.append(`
.smmmodal {
  display: none; 
  position: fixed; 
  z-index: 100; 
  padding-top: 100px; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  overflow: auto; 
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4); 
}

.smmmodal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 40%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s
}

@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0} 
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

.smmclose {
  color: white;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.smmclose:hover,
.smmclose:focus {
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.smmmodal-header {
  padding: 0 20px 45px 20px;
  background-color: lightgray;
  color: white;
}

.smmmodal-body {
  padding: 2px 30px;
}

.smmmodal-footer {
  padding: 0 0 45px 0;
  background-color: lightgray;
  color: white;
}

.sexy-color-red {
  background: linear-gradient(to right, red 0%, crimson 100%);
}

`)
  let smmModal = document.createElement("div")
  smmModal.setAttribute("id", "sm-mega-modal")
  smmModal.setAttribute("class", "smmmodal")
  smmModal.innerHTML = `
    <div class="smmmodal-content">
      <div class="smmmodal-header sexy-color-red">
        <span id ="sm-mega-modal-close" class="smmclose">&times;</span>
      </div>
      <div id="sm-mega-modal-body" class="smmmodal-body clearfix">
        <h2 style="margin:30px 0">MEGA 링크 암호화</h2>
      </div>
      <div class="smmmodal-footer sexy-color-red">
      </div>
    </div>`

  document.head.appendChild(smmModalStyle)
  document.body.appendChild(smmModal)

  let modal = document.getElementById("sm-mega-modal");
  let span = document.getElementById("sm-mega-modal-close")
  let body = document.getElementById("sm-mega-modal-body");

  const getLinkH5 = document.createElement("h5")
  getLinkH5.setAttribute("style", "margin-bottom:20px")
  getLinkH5.innerText = "공유 링크 입력"

  const getLinkInput = document.createElement("input")
  getLinkInput.setAttribute("id", "sm-mega-modal-url-input")
  getLinkInput.setAttribute("class", "form-control form-control-sm float-right")
  getLinkInput.setAttribute("style", "margin-bottom:20px")
  
  const getPasswordH5 = document.createElement("h5")
  getPasswordH5.setAttribute("style", "margin-bottom:20px")
  getPasswordH5.innerText = "비밀번호 입력 (빈칸일 시 국룰 적용)"

  const getPasswordInput = document.createElement("input")
  getPasswordInput.setAttribute("id", "sm-mega-modal-password-input")
  getPasswordInput.setAttribute("class", "form-control form-control-sm")
  
  const outputLinkTextarea = document.createElement("div")
  outputLinkTextarea.setAttribute("id", "sm-mega-modal-url-output")
  outputLinkTextarea.setAttribute("class", "clearfix")
  outputLinkTextarea.setAttribute("style", "margin-bottom:20px;padding:5px;border:1px solid #bbb;word-break: break-all")
  outputLinkTextarea.innerText = "..."
  
  const confirmBtn = document.createElement("div")
  confirmBtn.setAttribute("id", "sm-mega-modal-confirm-btn")
  confirmBtn.setAttribute("class", "btn btn-arca float-right")
  confirmBtn.setAttribute("style", "margin:20px 0 20px 0")
  confirmBtn.innerText = "암호화"
  confirmBtn.onclick = function(e) {
    let link = getLinkInput.value
    let pw = getPasswordInput.value
    if (!pw) {
      pw = "smpeople"
    }
    if (link) {
      MEGAencryptCore(link, pw, function(l) {
        outputLinkTextarea.innerText = l
      })
    }
  }
  
  body.appendChild(getLinkH5)
  body.appendChild(getLinkInput)
  body.appendChild(getPasswordH5)
  body.appendChild(getPasswordInput)
  body.appendChild(confirmBtn)
  body.appendChild(outputLinkTextarea)

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  modal.style.display = "block";
}

// 이미지 첨부파일 init
function MEGAencryptInit() {
  let modal = document.getElementById("sm-mega-modal");
  if (modal === null && (location.href.includes("/write") || location.href.includes("/edit"))) {
    MEGAencrypt()
  } else {
    if (modal !== null) {
      modal.style.display = "block"
    }
  }
}


// 메뉴 커맨드
function registerMenuCommand() {
  GM_registerMenuCommand("< 미방짤 만들기 >", deviantTasteMenuInit, "T");
  GM_registerMenuCommand("< 이미지+파일 합치기 >", imagezipMakerInit, "Z");
  GM_registerMenuCommand("< MEGA 링크 암호화 >", MEGAencryptInit, "M");
  GM_registerMenuCommand("DLsite 정보 채우기", dlsiteAuto, "D");
  GM_registerMenuCommand("hitomi 정보 채우기", hitomiAuto, "H");
  GM_registerMenuCommand("hitomi 전체 가져오기", hitomiFetch, "I");
  GM_registerMenuCommand("e-hentai 정보 채우기", ehAuto, "E");
  GM_registerMenuCommand("getchu 정보 채우기", getchuAuto, "G");
  GM_registerMenuCommand("fanza 정보 채우기", fanzaAuto, "F");
};

// 기다리기 함수
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 사전 from https://arca.live/b/smpeople/30169768, 일부 수정 및 추가함
function dictionary(str) {
  let trList = []
  str.split(/[\s\t\r\n\v\f\/・]/).forEach(tok => {
    tok = strTrim(tok)
    trList.push(J2Kdictionary[tok] || tok)
  })
  return arr2str(Array.from(new Set(trList)))
}

J2Kdictionary = {
  "萌え": "모에",
  "燃え": "열혈",
  "感動": "감동",
  "癒し": "힐링",
  "鬱": "우울",
  "淡白": "담백",
  "あっさり": "담백",
  "オールハッピー": "올해피",
  "着衣": "착의",
  "チラリズム": "치라리즘",
  "フェチ": "페티즘",
  "女性視点": "여성시점",
  "女主人公": "여주인공",
  "男主人公": "남주인공",
  "逆転無し": "역전없음",
  "マニアック": "마니악",
  "変態": "변태",
  "野外": "야외",
  "おさわり": "만지기",
  "きせかえ": "옷갈아입히기",
  "脚": "다리",
  "お尻": "엉덩이",
  "ヒップ": "엉덩이",
  "おっぱい": "가슴",
  "淫語": "음어",
  "汁": "체액대량",
  "液大量": "체액대량",
  "連続絶頂": "연속절정",
  "断面図": "단면도",
  "ドット": "도트",
  "ドット制作": "도트",
  "アニメ": "애니메이션",
  "総集編": "총집편",
  "バイノーラル": "바이노럴",
  "ダミヘ": "더미헤드폰",
  "催眠音声": "최면음성",
  "アンソロジー": "앤솔로지",
  "技術書": "기술서",
  "ツクール": "알만툴",
  "3D作品": "3D작품",
  "東方Project": "동방Project",
  "ピアス": "피어스",
  "装飾品": "장식품",
  "首輪": "목줄",
  "鎖": "사슬",
  "拘束具": "구속구",
  "ムチ": "채찍",
  "縄": "밧줄",
  "蝋燭": "촛농",
  "薬物": "약물",
  "ローション": "로션",
  "おむつ": "기저귀",
  "おもちゃ": "장난감",
  "道具": "도구",
  "異物": "이물질",
  "メガネ": "안경",
  "めがね": "안경",
  "靴下": "양말",
  "少女": "소녀",
  "ロリ": "로리",
  "ぷに": "뿌니",
  "少年": "소년",
  "ショタ": "쇼타",
  "年上": "연상",
  "妹": "여동생",
  "母親": "모친",
  "義妹": "의여동생",
  "娘": "딸",
  "義母": "의어머니",
  "実姉": "친누나/친언니",
  "義姉": "의누나/의언니",
  "おやじ": "아버지",
  "熟女": "숙녀",
  "人妻": "유부녀",
  "お姉さん": "누나/언니",
  "未亡人": "미망인",
  "既婚者": "기혼자",
  "幼なじみ": "소꿉친구",
  "双子": "쌍둥이",
  "姉妹": "자매",
  "保健医": "보건의",
  "女医": "여의사",
  "女教師": "여교사",
  "教師": "교사",
  "学生": "학생",
  "同級生": "동급생",
  "同僚": "동료",
  "先輩": "선배",
  "後輩": "후배",
  "お嬢様": "아가씨",
  "ギャル": "갸루",
  "ビッチ": "빗치",
  "天然": "천연",
  "主従": "주종",
  "主婦": "주부",
  "女王様": "여왕님",
  "お姫様": "공주님",
  "エルフ": "엘프",
  "妖精": "요정",
  "天使": "천사",
  "悪魔": "악마",
  "変身ヒロイン": "변신히로인",
  "魔法少女": "마법소녀",
  "魔法使い": "마법사",
  "魔女": "마녀",
  "男の娘": "오토코노코",
  "妖怪": "요괴",
  "擬人化": "의인화",
  "ヤンデレ": "얀데레",
  "人外娘": "인외",
  "モンスター娘": "몬스터소녀",
  "ロボット": "로봇",
  "アンドロイド": "안드로이드",
  "芸能人": "예능인",
  "アイドル": "아이돌",
  "モデル": "모델",
  "警察": "경찰",
  "刑事": "형사",
  "ヤクザ": "야쿠자",
  "裏社会": "야쿠자",
  "不良": "불량",
  "ヤンキー": "일진",
  "レスラー": "레슬러",
  "格闘家": "격투가",
  "幽霊": "유령",
  "ゾンビ": "좀비",
  "けもの": "짐승",
  "獣化": "동물화",
  "外国人": "외국인",
  "体育会系": "체육",
  "スポーツ選手": "스포츠선수",
  "ニューハーフ": "뉴하프",
  "戦士": "전사",
  "くノ一": "쿠노이치",
  "サキュバス": "서큐버스",
  "淫魔": "음마",
  "制服": "교복",
  "제복": "교복",
  "セーラー服": "세일러복",
  "体操着": "체조복",
  "水着": "수영복",
  "メイド": "메이드",
  "看護婦": "간호사",
  "ナース": "간호사",
  "巫女": "무녀",
  "軍服": "군복",
  "下着": "속옷",
  "パンツ": "팬티",
  "ゴスロリ": "고스로리",
  "コスプレ": "코스프레",
  "ボンデージ": "본디지",
  "ボンテージ": "본디지",
  "ブルマ": "브루마",
  "ミニスカ": "미니스커트",
  "着物": "기모노",
  "和服": "기모노",
  "エプロン": "앞치마",
  "ラバー": "고무재질",
  "レオタード": "레오타드",
  "シスター": "수녀",
  "ウェイトレス": "웨이트리스",
  "バニーガール": "바니걸",
  "버니걸": "바니걸",
  "スパッツ": "스판츠",
  "ニーソックス": "니삭스",
  "ストッキング": "스타킹",
  "スクール水着": "학교수영복",
  "スーツ": "정장",
  "ガーター": "가터",
  "女装": "여장",
  "学校": "학교",
  "学園": "학원",
  "学園もの": "학원",
  "オフィス": "오피스",
  "職場": "직장",
  "ラブコメ": "러브코메디",
  "耳かき": "귀청소",
  "屋外": "옥외",
  "ギャグ": "개그",
  "ラブラブ": "러브러브",
  "あまあま": "달콤달콤",
  "退廃": "퇴폐",
  "背徳": "배덕",
  "インモラル": "인모럴",
  "憑依": "빙의",
  "石化": "석화",
  "コメディ": "코메디",
  "日常": "일상",
  "生活": "생활",
  "時間停止": "시간정지",
  "ミリタリー": "밀리터리",
  "スポーツ": "스포츠",
  "格闘": "격투",
  "ほのぼの": "푸근함",
  "同棲": "동거",
  "恋人同士": "연인끼리",
  "初体験": "첫체험",
  "色仕掛け": "미인계",
  "女体化": "여체화",
  "性転換": "성전환",
  "浮気": "바람",
  "売春": "매춘",
  "援交": "원교",
  "風俗": "풍속",
  "ソープ": "소프",
  "シリアス": "시리어스",
  "ファンタジー": "판타지",
  "歴史": "역사",
  "時代物": "시대물",
  "ホラー": "호러",
  "キャットファイト": "캣파이트",
  "サスペンス": "서스펜스",
  "バイオレンス": "바이올런스",
  "ノンフィクション": "논픽션",
  "体験談": "체험담",
  "オカルト": "오컬트",
  "歳の差": "나이차",
  "魔法": "마법",
  "同居": "동거",
  "純愛": "순애",
  "戦場": "전장",
  "おもらし": "실금",
  "ハーレム": "할렘",
  "寝取られ": "NTR",
  "女子校生": "여고생",
  "百合": "백합",
  "ミステリー": "미스터리",
  "丸呑み": "통째삼키기",
  "のぞき": "엿보기",
  "電車": "전차",
  "寝取り": "NTL",
  "おねショタ": "오네쇼타",
  "睡眠姦": "수면간",
  "ツンデレ": "츤데레",
  "アヘ顔": "아헤가오",
  "ソフトエッチ": "소프트엣찌",
  "手コキ": "손으로",
  "足コキ": "발로",
  "ぶっかけ": "붓카케",
  "顔射": "안면사정",
  "中出し": "질내사정",
  "妊娠": "임신",
  "孕ませ": "임신",
  "パイズリ": "파이즈리",
  "レズ": "레즈",
  "女同士": "여자끼리",
  "ゲイ": "게이",
  "男同士": "남자끼리",
  "母乳": "모유",
  "搾乳": "착유",
  "出産": "출산",
  "産卵": "산란",
  "陵辱": "능욕",
  "オナニー": "자위",
  "オナサポ": "자위서포트",
  "緊縛": "묶기/긴박",
  "フェラ": "펠라",
  "フェラチオ": "펠라치오",
  "痴漢": "치한",
  "調教": "조교",
  "淫乱": "음란",
  "露出": "노출",
  "言葉責め": "언어고문/음어",
  "青姦": "야외플레이",
  "拘束": "구속",
  "奴隷": "노예",
  "浣腸": "관장",
  "羞恥": "수치",
  "辱め": "굴욕",
  "監禁": "감금",
  "焦らし": "애태우기",
  "くすぐり": "간지럼",
  "鬼畜": "귀축",
  "ノーマルプレイ": "노멀플레이",
  "放置プレイ": "방치플레이",
  "複数プレイ": "복수플레이",
  "乱交": "난교",
  "強制": "강제",
  "無理矢理": "강제",
  "レイプ": "레이프",
  "輪姦": "윤간",
  "和姦": "화간",
  "近親相姦": "근친상간",
  "逆レイプ": "역레이프",
  "盗撮": "도촬",
  "男性受け": "수비남",
  "催眠": "최면",
  "放尿": "방뇨",
  "おしっこ": "오줌",
  "アナル": "애널",
  "スカトロ": "스캇물",
  "尿道": "요도",
  "触手": "촉수",
  "獣姦": "수간",
  "機械姦": "기계간",
  "下克上": "하극상",
  "モブ姦": "몹캐릭간",
  "異種姦": "이종간",
  "悪堕ち": "타락",
  "洗脳": "세뇌",
  "ごっくん": "정액삼킴",
  "食ザー": "정액삼킴",
  "口内射精": "구내사정",
  "イラマチオ": "이라마치오",
  "スパンキング": "스파킹",
  "耳舐め": "귀햝기",
  "潮吹き": "시오후키",
  "ささやき": "속삭임",
  "拡張": "확장",
  "ボクっ娘": "보쿠코",
  "ショートカット": "짧은머리",
  "ロングヘア": "긴머리",
  "金髪": "금발",
  "黒髪": "흑발",
  "ポニーテール": "포니테일",
  "ツインテール": "트윈테일",
  "ネコミミ": "고양이귀",
  "獣耳": "짐승귀",
  "長身": "장신",
  "筋肉": "근육",
  "巨乳": "거유",
  "爆乳": "폭유",
  "つるぺた": "평평가슴",
  "貧乳": "빈유",
  "微乳": "미유",
  "複乳": "복유",
  "怪乳": "괴유",
  "超乳": "초유",
  "乳首": "유두",
  "乳輪": "유륜",
  "ぼて腹": "볼록배",
  "妊婦": "임산부",
  "スレンダー": "슬렌더",
  "ツルペタ": "평평한가슴",
  "パイパン": "음모없음",
  "陰毛": "음모",
  "腋毛": "겨드랑이털",
  "フタナリ": "후타나리",
  "ふたなり": "후타나리",
  "巨根": "거근",
  "童貞": "동정",
  "処女": "처녀",
  "巨大化": "거대화",
  "方言": "사투리",
  "無表情": "무표정",
  "褐色": "갈색피부",
  "日焼け": "갈색피부",
  "包茎": "포경",
  "ムチムチ": "쭉쭉빵빵",
  "太め": "통통한",
  "デブ": "뚱뚱한",
  "蟲姦": "충간",
  "腹パン": "배빵",
  "猟奇": "엽기",
  "人体改造": "인체개조",
  "拷問": "고문",
  "フィストファック": "Fistfuck",
  "ニプルファック": "Nipplefuck",
  "血液": "혈액",
  "スプラッター": "유혈",
  "狂気": "광기",
  "リョナ": "료나",
  "料理": "요리",
  "グルメ": "미식가",
  "評論": "평론",
  "シリーズもの": "시리즈물",
  "遠距離恋愛": "원거리연애",
  "家族": "가족",
  "ギャンブル": "도박",
  "劇画": "극화",
  "耽美": "탐미",
  "ティーンズラブ": "어린사랑",
  "伝奇": "전기",
  "ハードボイルド": "비장한",
  "パラレル": "평행세계",
  "パンチラ": "팬티보임",
  "ブラチラ": "브라보임",
  "ボーイズラブ": "BL",
  "恋愛": "연애",
  "委員長": "위원장",
  "叔父": "숙부",
  "義父": "시아버지",
  "ガテン系": "가텐계",
  "サラリーマン": "직장인",
  "爺": "할아버지",
  "実妹": "친동생",
  "秘書": "비서",
  "ヤリチン": "야리칭",
  "プレイボーイ": "플레이보이",
  "インテリ": "지식인",
  "おかっぱ": "단발",
  "タトゥー": "타투",
  "刺青": "문신",
  "ハード系": "하드계",
  "痴女": "치녀",
  "茶髪": "갈색머리",
  "ドジっ娘": "도짓코/덜렁이",
  "ぽっちゃり": "풍만",
  "三つ編み": "땋은머리",
  "ミニ系": "작은체형/어린",
  "ガードル": "거들",
  "カチューシャ": "머리띠",
  "しっぽ": "꼬리",
  "スタンガン": "전기충격",
  "スポユニ": "운동복/스포츠유니폼",
  "男装": "남장",
  "チャイナ": "차이나/중국풍",
  "道着": "도복",
  "ドラッグ": "마약",
  "バイブ": "바이브/진동",
  "白衣": "백의",
  "半ズボン": "반바지",
  "ブレザー": "재킷/블레이저",
  "ふんどし": "훈도시",
  "包帯": "붕대",
  "注射器": "주사기",
  "リボン": "리본",
  "ローター": "로터",
  "ローレグ": "로우레그컷/속옷",
  "ワイシャツ": "와이셔츠",
  "乙女受け": "처녀역할",
  "オヤジ受け": "아버지역할",
  "俺様攻め": "오레사마역할",
  "クール受け": "쿨플레이",
  "クール攻め": "쿨플레이",
  "クンニ": "쿤닐링구스/애무",
  "健気受け": "씩씩한",
  "誘い受け": "권유받은",
  "強気受け": "강하게받는",
  "ヘタレ攻め": "엉터리공격역할",
  "やんちゃ受け": "응석받이",
  "アクション": "액션",
  "アドベンチャー": "어드벤처",
  "クイズ": "퀴즈",
  "シミュレーション": "시뮬레이션",
  "シューティング": "슈팅",
  "その他ゲーム": "기타게임",
  "タイピング": "타이핑",
  "テーブルゲーム": "테이블게임",
  "デジタルノベル": "디지털노벨",
  "パズル": "퍼즐",
  "ロールプレイング": "롤플래잉",
  "オリジナル": "오리지널",
  "二次創作": "2차창작",
  "漫画": "만화",
  "アニメ": "애니메이션",
  "二次創作": "2차창작",
  "ゲーム系": "게임계열",
  "パロディ": "패러디",
  "その他": "기타",
  "成人向け": "성인용",
  "アクセサリー": "악세서리",
  "イラスト": "일러스트",
  "CG集": "CG집",
  "男無": "남자없음",
  "音声付き": "음성첨부",
  "女主人公のみ": "여주인공만",
  "擬人化": "의인화",
  "逆転無し": "역전없음",
  "作家複数": "여러작가",
  "残虐表現": "잔학표현",
  "新作": "신작",
  "準新作": "준신작",
  "旧作": "구작",
  "女性視点": "여성시점",
  "シリーズもの": "시리즈물",
  "全年齢向け": "전연령용",
  "断面図あり": "단면도있음",
  "デモ": "데모",
  "体験版あり": "체험판있음",
  "動画": "동영상",
  "アニメーション": "애니메이션",
  "ノベル": "노벨",
  "ベスト": "베스트",
  "総集編": "총집편",
  "男性向け": "남성용",
  "女性向け": "여성용",
  "DL版独占販売": "DL독점",
  "FANZA専売": "FANZA독점",
  "がんばろう同人！": "힘내자동인!",
  "ゲームCP": "게임CP"
}