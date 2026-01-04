// ==UserScript==
// @name        Загрузчик внешней ссылки для fbreader.org
// @namespace   Violentmonkey Scripts
// @match       https://books.fbreader.org/catalog
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      Йетанозер
// @license     MIT
// @description Добавляет обработку параметра bookLink для каталога fbreader и кнопку для скачивания-выгрузки содержимого ссылки в хранилище FB
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/448385/%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%20%D0%B2%D0%BD%D0%B5%D1%88%D0%BD%D0%B5%D0%B9%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20fbreaderorg.user.js
// @updateURL https://update.greasyfork.org/scripts/448385/%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%20%D0%B2%D0%BD%D0%B5%D1%88%D0%BD%D0%B5%D0%B9%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20fbreaderorg.meta.js
// ==/UserScript==


// GM_xmlhttpRequest
function Request(url, opt={}) {
	Object.assign(opt, {
		url,
		timeout: 2000,
		//responseType: 'json'
	})

	return new Promise((resolve, reject) => {
		opt.onerror = opt.ontimeout = reject
		opt.onloadend = resolve

		GM_xmlhttpRequest(opt)
	})
}

// https://stackoverflow.com/a/15724300
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function getLink() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('bookLink');
}

function mainButton() {
  return document.querySelector('#toolbar-button-test');
}

async function doShit() {
  const url = getLink();
  if (!url) {
    return;
  }
  mainButton().innerHTML = 'Скачиваем книгу...';
  let blob;
  try {
    blob = await Request(url, {responseType: 'blob'}).then(rsp => rsp.response);
  } catch {
    mainButton().innerHTML = 'Не удалось скачать файл, перезагрузить?';
    return;
  }
  mainButton().innerHTML = 'Скачано, загружаем...';
  const formData = new FormData();
  formData.append('0', blob);
  const response = await fetch('https://books.fbreader.org/app/book.upload', {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    }
  });
  const jsonResponse = await response.json();
  console.log(jsonResponse);
  switch (jsonResponse[0].result.code) { // Скрипт умеет только в одну книгу, соре
    case 'ALREADY_UPLOADED':
      console.log(jsonResponse[0].result.error);
      mainButton().innerHTML = 'Ошибка, файл загружен ранее.';
      break;
    case undefined:
      mainButton().innerHTML = 'Загружено!';
      break;
    default:
      mainButton().innerHTML = 'Неизвестная ошибка, подробности в консоли.'
  }
  mainButton().classList.add("disabled");
}

const buttonTmpl = `
  <div class="fb-toolbar-button-container">
    <span id="toolbar-button-test" class="btn btn-fbn fb-toolbar-button">
      <span class="fb-button-icon fb-icon-add-books"></span>
      Загрузить книгу по запросу
    </span>
  </div>
`;

if (getLink()) {
document
  .querySelector('#toolbar > div')
  .insertAdjacentHTML('beforeend', buttonTmpl);
mainButton().onclick = doShit;
} else {
  console.log('No link, autouplader exiting!');
}
