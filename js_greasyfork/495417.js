// ==UserScript==
// @name         xVKTT
// @name:en xVKTT
// @license MIT
// @description  Удаление Рекламы, доп. информация о странице и многие другие улучшения!
// @description:en Removing Ads, additional information about the page and many other improvements!
// @author       xZeNice
// @version      29.04.2024
// @match        https://vk.com/*
// @match        https://id.vk.com/*
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @exclude      *://vk.com/notifier.php*
// @exclude      *://vk.com/*widget*.php*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495417/xVKTT.user.js
// @updateURL https://update.greasyfork.org/scripts/495417/xVKTT.meta.js
// ==/UserScript==

// xVKTT by [ Роман Афанасьев | xZeNice ]
// Скрипт делался по большей части под себя, испытывался в Yandex | Edge | Chrome
//Поддержка автора: https://www.donationalerts.com/r/xzenice

// xVKTT by [ Roman Afanasyev | xZeNice ]
// The script was made mostly for itself, tested in Yandex | Edge | Chrome
//Author's support: https://www.donationalerts.com/r/xzenice

// Создаем объект MutationObserver, который будет следить за изменениями в DOM-дереве
const observer = new MutationObserver(() => {
  // Ищем элемент с классом OwnerPageName, который соответствует имени пользователя на странице профиля
  const profilePage = document.querySelector('.OwnerPageName');

  // Если элемент не найден, прекращаем работу скрипта
  if (!profilePage) return;

  // Если элемент уже имеет класс display_additional_information_in_vk_profile, значит информация уже добавлена, прекращаем работу
  if (profilePage.classList.contains('display_additional_information_in_vk_profile')) return;

  // Создаем объект XMLHttpRequest для отправки запроса на текущую страницу
  const xhr = new XMLHttpRequest();
  // Открываем соединение с сервером, используя метод GET и текущий URL
  xhr.open('GET', window.location.href, false);
  // Отправляем запрос на сервер
  xhr.send();

  // Извлекаем ID профиля из HTML-кода страницы, если статус ответа 200 (успешный)
  const profileId = xhr.status === 200 ? xhr.responseText.match(/"ownerId":(\d+),"/i)?.[1] : null;
  // Если ID профиля не найден, прекращаем работу
  if (!profileId) return;

  // Добавляем класс display_additional_information_in_vk_profile к элементу OwnerPageName, чтобы предотвратить повторное добавление информации
  profilePage.classList.add('display_additional_information_in_vk_profile');

  // Создаем объект XMLHttpRequest для отправки запроса на foaf.php с ID профиля
  const requestVkFoaf = new XMLHttpRequest();
  // Определяем обработчик события загрузки данных
  requestVkFoaf.onload = () => {
    // Если статус ответа 200 (успешный), обрабатываем данные VK Foaf
    if (requestVkFoaf.status === 200) {
      // Парсим полученные данные VK Foaf с помощью функции parseVkFoaf
      const data = parseVkFoaf(requestVkFoaf.responseText);
      // Рендерим дополнительную информацию на странице с помощью функции renderAdditionalInfo
      renderAdditionalInfo(profilePage, data, profileId);
    }
  };

  // Открываем соединение с сервером, используя метод GET и URL foaf.php с ID профиля
  requestVkFoaf.open('GET', `/foaf.php?id=${profileId}`, true);
  // Отправляем запрос на сервер
  requestVkFoaf.send();
});

// Функция для парсинга данных VK Foaf и извлечения даты регистрации, последнего редактирования и последнего посещения
const parseVkFoaf = (foafString) => {
  return {
    vkRegDate: foafString.match(/ya:created dc:date="(.+)"/i)?.[1],
    vkLastProfileEditDate: foafString.match(/ya:modified dc:date="(.+)"/i)?.[1],
    vkLastSeenDate: foafString.match(/ya:lastLoggedIn dc:date="(.+)"/i)?.[1],
  };
};

// Функция для форматирования даты в удобный для пользователя формат
const formatProfileDate = (profileDate) => {
  // Если дата не задана, возвращаем пустую строку
  if (!profileDate) {
    return '';
  }
  // Создаем объект Date из строки даты
  const date = new Date(profileDate);
  // Получаем названия месяцев на английском и русском языках
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const russianMonthNames = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

  // Определяем язык страницы и выбираем соответствующее название месяца
  const monthName = language === 'ru' ? russianMonthNames[date.getMonth()] : monthNames[date.getMonth()];

  // Форматируем дату в соответствии с выбранным языком
  return `${date.getDate()} ${monthName} ${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
};

// Функция для рендеринга дополнительной информации на странице профиля
const renderAdditionalInfo = (profilePage, data, profileId) => {
  // Создаем контейнер для дополнительной информации
  const container = document.createElement('div');
  // Устанавливаем класс контейнера, чтобы его можно было стилизовать
  container.className = 'display_additional_information_in_vk_profile';

  // Если дата регистрации найдена, добавляем элемент с датой регистрации в контейнер
  if (data.vkRegDate) { container.appendChild(createInfoElement(labels.registration, formatProfileDate(new Date(data.vkRegDate)))); }
  // Если дата последнего редактирования найдена, добавляем элемент с датой последнего редактирования в контейнер
  if (data.vkLastProfileEditDate) { container.appendChild(createInfoElement(labels.lastEdit, formatProfileDate(new Date(data.vkLastProfileEditDate)))); }
  // Если дата последнего посещения найдена, добавляем элемент с датой последнего посещения в контейнер
  if (data.vkLastSeenDate) { container.appendChild(createInfoElement(labels.lastSeen, formatProfileDate(new Date(data.vkLastSeenDate)))); }
  // Добавляем элемент с ID страницы в контейнер
  container.appendChild(createInfoElement(labels.pageId, profileId));
  // Добавляем контейнер с информацией на страницу профиля
  profilePage.appendChild(container);
};

// Функция для создания элемента с информацией о профиле
const createInfoElement = (label, value) => {
  // Создаем новый элемент div
  const element = document.createElement('div');
  // Устанавливаем класс для стилизации
  element.className = 'clear_fix profile_info_row';
  // Устанавливаем размер шрифта
  element.style.fontSize = '0.75rem';
  // Устанавливаем HTML-код элемента
  element.innerHTML = `${label} ${value}`;
  // Возвращаем созданный элемент
  return element;
};

// Создаем объект с подписями для элементов
const labels = {
  registration: 'Registration:',
  lastEdit: 'Last Edit:',
  lastSeen: 'Last Seen:',
  pageId: 'Page ID:'
};

// Получаем язык страницы из атрибута lang элемента html
const language = document.documentElement.lang;

// Если язык страницы русский, меняем подписи на русский язык
if (language === 'ru') {
  labels.registration = 'Регистрация:';
  labels.lastEdit = 'Ред. стр.:';
  labels.lastSeen = 'Посл. вход:';
  labels.pageId = 'ID Страницы:';
}

// Начинаем наблюдение за изменениями в DOM-дереве
observer.observe(document.body, { childList: true, subtree: true }); // Информация о странице под именем
                                                                     // (Регистрация, Последнее редактирование страницы, Последний заход и ID)


// Функция для поддержания постоянного онлайн-статуса в VK
function stayOnline() {
  fetch('https://vk.com/al_im.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'act=a_enter&al=1',
  });
}

// Запускаем функцию stayOnline каждые 5 минут (350000 мс)
setInterval(stayOnline, 350000); // Вечный онлайн
                                 // (Работает до закрытия всех вкладок ВКонтакте)

// Объект PROXY для перехвата запросов, связанных с "печатает..."
const PROXY = {
  'vk.com': () => {
    // Переопределяем метод send объекта XMLHttpRequest
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = new Proxy(originalSend, {
      // Перехватываем вызов метода send
      apply(target, thisArg, args) {
        const [data] = args;
        // Проверяем, содержит ли данные "typing" или "audiomessage"
        if (/typing|audiomessage/.test(data)) return null;
        // Выполняем оригинальный метод send, если нет "typing" или "audiomessage"
        return Reflect.apply(target, thisArg, args);
      },
    });
  },
  'm.vk.com': () => {
    // Переопределяем функцию fetch
    const originalFetch = window.fetch;
    window.fetch = async (input, init = {}) => {
      // Клонируем объект input
      const clonedInput = input.clone();
      // Получаем данные из формы
      const formData = await clonedInput.formData();
      // Проверяем, есть ли в данных "typing"
      const isTyping = [...formData.values()].includes('typing');
      // Возвращаем пустое Promise, если есть "typing", иначе выполняем оригинальный fetch
      return isTyping ? new Promise(() => null) : originalFetch(input, init);
    };
  },
};

// Получаем хост текущей страницы
const { host } = location;
// Создаем новый скрипт
const script = document.createElement('script');
// Устанавливаем текст скрипта, который выполняет функцию из PROXY для текущего хоста
script.textContent = `(${PROXY[host].toString()})()`;
// Добавляем скрипт в заголовок страницы
document.head.appendChild(script);

// Скрытие "***** Печатает..." у пользователей
// (Работает если перейти в мессенджер, через список чатов который справа снизу — не работает)

// Регулярные выражения для исключения некоторых ссылок
const r0 = /(\/(share|intent\/tweet|submitlink|submit)([^?]*)\?|api\.addthis\.com\/oexchange|cms\/\?url=|downloads\.sourceforge\.net|translate\.google\.)/i; // exclude
const r1 = /[?&](url|r|p|z|to|u|go|goto|q|st\.link|link|href|redirect_url)=([^&]+)(&|$)/i;
const r2 = /(\/leech_out\.php\?.:|\/phpBB2\/goto\/|\/go\/\?)(.+)/i; // Dude Smart Leech (DLE), phpBB2
const r3 = /outgoing\.prod\.mozaws\.net\/v1\/([^/]+)\/(.+)/i; // addons.mozilla.org
const r4 = /([^:]+):([^:]+)(|$)/; // Disqus FIX

// Коды для декодирования
const impCodes = '%3B%2C%2F%3F%3A%40%26%3D%2B%24%23';
// Регулярное выражение для поиска кодов
const impRegex = new RegExp((impCodes.replace(/%/g,'|%').replace('|','')), 'gi');
// Декодированные коды
const impDecoded = decodeURIComponent(impCodes);
// Функция для замены кодов на декодированные значения
const impReplacer = (ch) => impDecoded[impCodes.indexOf(ch.toUpperCase())/3];
// Функция для декодирования важных символов
const decodeImportant = (text) => text.replace(impRegex, impReplacer);

// Обработчик события mouseenter для ссылок
const Handler = (e) => {
  // Получаем ссылку
  const link = e.target;
  // Получаем URL ссылки
  let url = link.href;
  // Ищем URL, если его нет в текущем элементе
  while (!url && link !== this) {
    link = link.parentNode;
    url = link.href;
  }
  // Удаляем обработчик события
  link.removeEventListener('mouseenter', Handler);
  // Проверяем URL
  if (!url || url.length < 5 || r0.test(url)) {
    return;
  }
  // Извлекаем целевой URL из ссылки
  let tourl = ((url.match(r1) || url.match(r2) || url.match(r3) || [])[2]);
  // Проверяем целевой URL
  if (!tourl) {
    return;
  }
  try {
    // Декодируем целевой URL
    tourl = decodeURIComponent(tourl);
    tourl = window.atob(tourl);
    tourl = decodeURIComponent(tourl);
    tourl = escape(tourl);
  } catch (err) {}
  // Декодируем важные символы
  tourl = decodeImportant(tourl);
  // Извлекаем протокол и хост из целевого URL
  tourl = ((tourl.match(r4)||[])[0]);
  // Проверяем, является ли целевой URL ссылкой HTTP или HTTPS
  if (tourl && tourl.match(/^http(|s):\/\//i)) {
    // Удаляем обработчик onclick ссылки
    link.removeAttribute('onclick');
    // Устанавливаем атрибут rel ссылки на noreferrer
    link.rel = 'noreferrer';
    // Устанавливаем новый URL ссылки
    link.href = tourl;
  }
};

// Функция для добавления обработчиков событий к ссылкам
const attachEvent = (e) => {
  // Ищем все ссылки, содержащие "/ " или "?" в href
  for (const link of e.querySelectorAll('a[href*="/"], a[href*="?"]')) {
    // Добавляем обработчик события mouseenter
    link.addEventListener('mouseenter', Handler);
  }
};

// Добавляем обработчики событий к ссылкам в текущем документе
attachEvent(document.body);

// Создаем наблюдателя за изменениями DOM
new MutationObserver((ms) => {
  // Перебираем изменения DOM
  for (const m of ms) {
    // Перебираем добавленные узлы
    for (const n of m.addedNodes) {
      // Проверяем, является ли узел элементом
      if (n.nodeType === Node.ELEMENT_NODE) {
        // Если узел - ссылка, добавляем обработчик события mouseenter
        if (n.href) {
          n.addEventListener('mouseenter', Handler);
        } else {
          // Иначе добавляем обработчики событий к ссылкам в узле
          attachEvent(n);
        }
      }
    }
  }
}).observe(document, {childList: true, subtree: true});

// Прямые ссылки, отключение "Подозрительная ссылка и т.п"

// Запускаем функцию каждые 5 мс для удаления ненужных элементов
setInterval(function () {
  // Селекторы для удаления элементов
  const selectorToRemove = [
    '#profile_redesigned > div > div > div > div.vkuiPopoutRoot.vkuiSplitLayout > div > div.ScrollStickyWrapper > div > section:nth-child(2)',
    '.page_block.apps_feedRightAppsBlock.apps_feedRightAppsBlock_single_app.apps_feedRightAppsBlock_single_app--',
    '#react_rootEcosystemAccountMenuEntry > div > div > div.EcosystemAccountButton_row__iVqJo',
    '#index_rcolumn > div:nth-child(2) > div > div > div.JoinForm__connectAgreement',
    '#top_profile_menu > a.top_profile_mrow.TopProfileItem--appearance',
    '#side_bar_inner > div.LegalRecommendationsLinkLeftMenuAuthorized',
    '#index_rcolumn > div:nth-child(2) > div > div > div > div',
    '#index_rcolumn > div.LegalRecommendationsLink',
    '#side_bar_inner > div.left_menu_nav_wrap',
    '.page_block.feed_friends_recomm',
    '.feed_groups_recomm_friends',
    '#friends_right_blocks_root',
    '#groups_invites_wrap',
    '._ads_block_data_w',
    '#feed_row-23_0_0',
    '#ads_left',
  ];
  // Находим элементы, соответствующие селекторам
  const elementsToRemove = document.querySelectorAll(selectorToRemove);
  // Удаляем найденные элементы
  elementsToRemove.forEach(element => element.remove());
}, 5);

// Удаление Рекламы / Всяких кнопок и т.п

// Селектор для элемента, который нужно размыть
const blurSelector = '#top_audio_player';
// Селектор для элемента, при наведении на который нужно снять размытие
const hoverSelector = blurSelector;

// Функция для включения/выключения размытия
function toggleBlur(add) {
  document.querySelector(blurSelector).style.filter = add ? 'blur(500px)' : 'none';
}

// Обработчик события mouseover
document.addEventListener('mouseover', (e) => {
  // Получаем целевой элемент
  const target = e.target;
  // Проверяем, является ли целевой элемент или его родительский элемент элементом, на который нужно наводить курсор
  const isHovered = target.matches(hoverSelector) || target.closest(hoverSelector);

  // Включаем/выключаем размытие в зависимости от того, наведен ли курсор на целевой элемент
  toggleBlur(!isHovered);
}); // Блюр музыки

// Находим элемент, который нужно переместить
const elementToMove = document.querySelector('#index_rcolumn');
// Если элемент найден, перемещаем его
if (elementToMove) {
  // Координаты и размеры элемента
  const [pixelsToMoveX, pixelsToMoveY, elementSizeX] = [0, 33, 350];
  // Устанавливаем позиционирование элемента
  elementToMove.style.position = 'relative';
  // Устанавливаем левое смещение элемента
  elementToMove.style.left = `${pixelsToMoveX}px`;
  // Устанавливаем верхнее смещение элемента
  elementToMove.style.top = `${pixelsToMoveY}px`;
  // Устанавливаем ширину элемента
  elementToMove.style.width = `${elementSizeX}px`;
} // Изменение местоположения окна Авторизации

// Находим элемент "Сохранить вход"
const element = document.querySelector('#index_login > div > form > div.VkIdCheckbox.VkIdCheckbox--save label .VkIdCheckbox__name');
// Если элемент найден, нажимаем на него
element?.click();
// Удаляем элемент "Сохранить вход" через 25 мс
setTimeout(() => {
  const elementToRemove = document.querySelector('#index_login > div > form > div.VkIdCheckbox.VkIdCheckbox--save');
  elementToRemove?.remove();
}, 25); // Нажатие на "Сохранить вход" и удаление этого элемента
        // (Чтобы не предлагало сохранить вход при Авторизации)

// Функция для получения объекта VK
function getVK(){
  // Проверяем, доступен ли объект VK
  if (!!window.vk){
    // Устанавливаем свойство audioAdsConfig объекта VK в null, чтобы отключить аудиорекламу
    window.vk.audioAdsConfig = null;

  } else {
    // Если объект VK недоступен, запускаем функцию getVK через 100 мс
    window.setTimeout(getVK, 100);
  }
}

// Запускаем функцию getVK после загрузки страницы
(function() {
  window.addEventListener('load', function() {
    window.setTimeout(getVK, 100);
  });
})();

// Отключение аудиорекламы