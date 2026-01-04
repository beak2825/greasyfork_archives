// ==UserScript==
// @name         SikDang Template Loader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       6173~
// @match        https://arca.live/b/*/write
// @icon         https://www.google.com/s2/favicons?domain=arca.live
// @grant        none
// @description  2021. 7. 10. 오전 3:20:30
// @downloadURL https://update.greasyfork.org/scripts/429136/SikDang%20Template%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/429136/SikDang%20Template%20Loader.meta.js
// ==/UserScript==

// 고정 탬플릿

const TEMPLATE = {

  '요청': 'https://arca.live/b/smpeople/29695511',

  '미번': 'https://arca.live/b/smpeople/29696978',

  '번역': 'https://arca.live/b/smpeople/29697375'

};

 

// 고정 탬플릿 fetch로 불러오기

const fetchTemplate = async (category) => {

  // 커스텀 양식 불러오기

  let currentTemplate = localStorage.getItem("ARCA_CUSTOM_FORM_FOR_PATH_" + location.pathname + "_AND_FOR_CATEGORY_" + category)

  if(currentTemplate) return currentTemplate

  // 기본 양식 불러오기

  if(!TEMPLATE[category]) return '';

  return await fetch(TEMPLATE[category])

    .then(res => res.text())

    .then(html => new DOMParser().parseFromString(html, 'text/html'))

    .then(dom => dom.querySelector("div.fr-view.article-content > table").outerHTML); // 해당 게시글에서 table만 불러오기

}



// 탬플릿 불러오기

const loadTemplate = async (category) => {

  const template = await fetchTemplate(category);

  const editorBox = document.querySelector('.write-body .fr-element');

  let formDiv = editorBox.querySelector("#smpeople-article-form")

  if (!template && formDiv) {

    editorBox.removeChild(formDiv);

  } else {

    if (!formDiv) {

      let formElement = document.createElement("div");

      formElement.setAttribute("id", "smpeople-article-form")

      editorBox.appendChild(formElement)

      formDiv = editorBox.querySelector("#smpeople-article-form")

    }

  formDiv.innerHTML = template;

  }

};



// 탬플릿 붙여넣기

const attachTemplate = () => {

  const tabs = document.querySelectorAll('.sub-row span');

  tabs.forEach(tab => {

    const button = tab.querySelector('input');

    const label = tab.querySelector('label');

    

    if(button && label) {

      button.addEventListener('click', e => {

        loadTemplate(label.innerText);

      });

    }

  });

}



// onload시 한번 실행

let loaded = false

window.addEventListener('load', e => {

  if(!loaded) {

    attachTemplate();

    customForm();

    loaded = true

  }

});



// 커스텀 양식 함수

function customForm() {

  // 커스텀 양식 저장

  let makeFormBtn = document.createElement("div")

  makeFormBtn.setAttribute("class", "btn btn-arca")

  makeFormBtn.setAttribute("id", "makeFormBtn")

  makeFormBtn.setAttribute("style", "margin:0 5px")

  makeFormBtn.append("양식 저장")

  makeFormBtn.onclick = function() {

    let doCustom = confirm("본 게시글을 양식으로 저장하시겠습니까?\n현재 선택된 탭에 본 게시글이 양식으로 설정되며,\n기존 양식을 덮어쓰게 됩니다.")

    if (doCustom) {

      checkRadio("category").then((category) => {

        let customForm = document.querySelector('.write-body .fr-element').innerHTML

        localStorage.setItem("ARCA_CUSTOM_FORM_FOR_PATH_" + location.pathname + "_AND_FOR_CATEGORY_" + category, String(customForm))

      })

    }

  }

  // 커스텀 양식 삭제

  let deleteFormBtn = document.createElement("div")

  deleteFormBtn.setAttribute("class", "btn btn-arca")

  deleteFormBtn.setAttribute("id", "deleteFormBtn")

  deleteFormBtn.setAttribute("style", "margin:0 5px")

  deleteFormBtn.append("양식 삭제")

  deleteFormBtn.onclick = function() {

    let doCustom = confirm("현재 선택된 탭에 설정된 양식을 삭제하시겠습니까?\n단, 기본 양식은 삭제되지 않습니다.")

    if (doCustom) {

      checkRadio("category").then((category) => {

        localStorage.removeItem("ARCA_CUSTOM_FORM_FOR_PATH_" + location.pathname + "_AND_FOR_CATEGORY_" + category)

      })

    }

  }

  // 글머리 div에 버튼 추가

  let articleRow = document.querySelector("#article_write_form > div:nth-child(5)")

  articleRow.appendChild(makeFormBtn)

  articleRow.appendChild(deleteFormBtn)

  

}



// 라디오버튼 체크 함수

function checkRadio(name) {

  return new Promise((resolve, reject) => {

    var radios = document.getElementsByName(name);

    for (let i = 0, length = radios.length; i < length; i++) {

      if (radios[i].checked) {

        resolve(radios[i].value)

      }

    }

  })

}