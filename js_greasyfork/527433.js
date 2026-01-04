// ==UserScript==
// @name        MyAnimeList(MAL) — русское описание аниме
// @namespace   https://github.com/njko39/MAL-RU-Enhancements
// @match       https://myanimelist.net/anime/*
// @match       https://myanimelist.net/anime.php?id=*
// @icon        https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @version     1.6
// @author      njko39
// @copyright   2025, njko39 (https://github.com/njko39/MAL-RU-Enhancements)
// @description Добавляет русское описание аниме с Шикимори или GitHub на страницу аниме на MAL
// @homepageURL https://github.com/njko39/MAL-RU-Enhancements
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/527433/MyAnimeList%28MAL%29%20%E2%80%94%20%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%BE%D0%B5%20%D0%BE%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B0%D0%BD%D0%B8%D0%BC%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/527433/MyAnimeList%28MAL%29%20%E2%80%94%20%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%BE%D0%B5%20%D0%BE%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B0%D0%BD%D0%B8%D0%BC%D0%B5.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author mwehehe
// ==/OpenUserJS==

/*
    Эта часть скрипта заменяет описание и название через API.
*/

// Function to create the tab HTML
function createTabHtml(newDescription, originalDescription, showSource, shikimoriUrl) {
  const sourceHtml = showSource ? `
    <div class="source">
      Источник: <a href="https://shikimori.one${shikimoriUrl}" target="_blank">Шикимори</a>
    </div>
  ` : '';

  return `
    <div class="block">
      <div class="tab-button-container">
        <button class="tablinks" onclick="openTab(event, 'newDescription')">RUS</button>
        <button class="tablinks" onclick="openTab(event, 'originalDescription')">ENG</button>
      </div>

      <div id="newDescription" class="tabcontent">
        ${newDescription || ''}
        ${sourceHtml}
      </div>

      <div id="originalDescription" class="tabcontent" style="display:none;">
        ${originalDescription}
      </div>
    </div>
  `;
}

// Function to replace special tags with links
function processContentLinks(description) {
  if (typeof description !== 'string' || description === '') {
    return '';
  }

  // Process [character] tags
  const characterRegex = /\[character=(\d+)\](.*?)\[\/character\]/g;
  let processedDescription = description.replace(characterRegex, (_, id, text) => {
    return `<a href="https://myanimelist.net/character/${id}" target="_blank">${text}</a>`;
  });

  // Process [anime] tags
  const animeRegex = /\[anime=(\d+)\](.*?)\[\/anime\]/g;
  processedDescription = processedDescription.replace(animeRegex, (_, id, text) => {
    return `<a href="https://myanimelist.net/anime/${id}" target="_blank">${text}</a>`;
  });

  // Process [person] tags
  const personRegex = /\[person=(\d+)\](.*?)\[\/person\]/g;
  processedDescription = processedDescription.replace(personRegex, (_, id, text) => {
    return `<a href="https://myanimelist.net/people/${id}" target="_blank">${text}</a>`;
  });

  return processedDescription;
}

// Function to fetch from GitHub
async function fetchFromGithub(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const text = await response.text();
    return text.trim();
  } catch (error) {
    console.log('Error fetching from GitHub:', error);
    return null;
  }
}

// Function to fetch title from GitHub
async function fetchGithubTitle(animeId) {
  const titleUrl = `https://raw.githubusercontent.com/njko39/MAL-RU-Enhancements/main/assets/anime/${animeId}/title.md`;
  return await fetchFromGithub(titleUrl);
}

// Function to fetch description from GitHub
async function fetchGithubDescription(animeId) {
  const descriptionUrl = `https://raw.githubusercontent.com/njko39/MAL-RU-Enhancements/main/assets/anime/${animeId}/description.md`;
  return await fetchFromGithub(descriptionUrl);
}

// Main function
async function replaceDescriptionTextAndTitle() {
  const currentPageUrl = window.location.href;
  const urlParts = currentPageUrl.split('/');

  // Find the index of "anime" in the URL parts
  const animeIndex = urlParts.indexOf('anime');

  let animeId = null;

  if (animeIndex === -1) {
    // "anime" not found in path, check if the URL contains "/anime.php?"
    const parser = document.createElement('a');
    parser.href = currentPageUrl;

    // Check if the URL path includes "/anime.php"
    if (parser.pathname.includes('/anime.php')) {
      const searchParams = new URLSearchParams(parser.search);
      if (searchParams.has('id')) {
        animeId = searchParams.get('id');
        // Verify if it's a valid number
        if (isNaN(animeId)) {
          console.log('Anime ID not found');
          return;
        }
      } else {
        console.log('Anime section not found in URL');
        return;
      }
    } else {
      console.log('Anime section not found in URL');
      return;
    }
  } else {
    // "anime" found in path, extract ID as before
    const animeIdPart = urlParts[animeIndex + 1];
    animeId = animeIdPart.replace(/\D/g, '');
    if (!animeId) {
      console.log('Anime ID not found');
      return;
    }
  }

  console.log('Anime ID:', animeId);

  const shikimoriApiUrl = `https://shikimori.one/api/animes/${animeId}`;

  try {
    const response = await fetch(shikimoriApiUrl);

    // Fetch title and description separately
    let shikimoriTitle = null;
    let shikimoriDescription = null;
    let shikimoriUrl = '';

    if (response.ok) {
      const dataResponse = await response.json();
      shikimoriTitle = dataResponse.russian;
      shikimoriDescription = dataResponse.description;
      shikimoriUrl = dataResponse.url || `/${animeId}`;

      // Determine if the description came from Shikimori (not null)
      const cameFromShikimoriDescription = shikimoriDescription !== null;

      // Try GitHub if needed
      const githubTitle = shikimoriTitle ? null : await fetchGithubTitle(animeId);
      const githubDescription = cameFromShikimoriDescription ? null : await fetchGithubDescription(animeId);

      // Combine data
      const data = {
        russian: shikimoriTitle || githubTitle,
        description: shikimoriDescription || githubDescription,
        url: shikimoriUrl
      };

      // Pass the source visibility flag (only when Shikimori provided a description)
      processAndDisplayData(data, animeId, cameFromShikimoriDescription, shikimoriUrl);
    } else {
      // If Shikimori API returns 404, try GitHub for title and description
      const githubTitle = await fetchGithubTitle(animeId);
      const githubDescription = await fetchGithubDescription(animeId);

      // Combine data
      const data = {
        russian: githubTitle,
        description: githubDescription,
        url: `/${animeId}`
      };

      // Pass the source visibility flag (false since we didn't use Shikimori)
      processAndDisplayData(data, animeId, false, `/${animeId}`);
    }
  } catch (error) {
    console.log('Error:', error);
    const descElement = document.querySelector('p[itemprop="description"]');
    if (descElement) {
      descElement.textContent = 'Error fetching description: ' + error;
    }
  }
}

// Function to add specific CSS when title is replaced
function addTitleCSS() {
  // Remove existing styles with the same ID to prevent duplication
  const existingStyle = document.getElementById('titleCSS');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create new style element
  const style = document.createElement('style');
  style.id = 'titleCSS';
  style.textContent = `
    .h1.edit-info div.h1-title h1 {
      display: inline-block !important;
    }
  `;
  document.head.appendChild(style);
}

// Helper function to process and display data
function processAndDisplayData(data, animeId, cameFromShikimori, shikimoriUrl) {
  let description = data.description;
  const russianName = data.russian;

  const shikimoriPageUrl = shikimoriUrl || `/${animeId}`;

  // Handle title update separately
  if (russianName) {
    const titleElement = document.querySelector('h1.title-name.h1_bold_none strong');
    const englishTitleElement = document.querySelector('p.title-english.title-inherit');
    if (titleElement) {
      const originalTitle = titleElement.textContent;
      titleElement.textContent = russianName;
      if (englishTitleElement) {
        englishTitleElement.textContent = originalTitle;
      } else {
        const newEnglishTitleElement = document.createElement('p');
        newEnglishTitleElement.className = 'title-english title-inherit';
        newEnglishTitleElement.textContent = originalTitle;
        titleElement.parentNode.appendChild(newEnglishTitleElement);
      }
    }

    // Add the CSS after title replacement
    addTitleCSS();
  }

  // Process description
  let processedDescription = '';
  if (typeof description === 'string' && description !== '') {
    processedDescription = processContentLinks(description);
  } else {
    processedDescription = `У аниме пока что нет описания на русском. Вы можете предложить его на <a href="https://shikimori.one${shikimoriPageUrl}" target="_blank">Шикимори</a> или через телеграм бота <a href="https://t.me/MalRuSuggestionBot" target="_blank">@MalRuSuggestionBot</a>, и оно появится здесь. <a href="https://github.com/njko39/MAL-RU-Enhancements/" target="_blank">Страница скрипта на GitHub</a>.`;
  }

  // Add tab CSS
  const style = document.createElement('style');
style.textContent = `
  .block {
    padding-bottom: 1.5em;
  }
  .tab-button-container {
    margin-bottom: 1.5em;
  }

  /* ВАЖНО: сохраняет \n и пустые строки из GitHub */
  .tabcontent {
    white-space: pre-wrap;       /* переносы строк + перенос по словам */
    overflow-wrap: anywhere;     /* чтобы длинные строки не ломали верстку */
  }

  .source {
    text-align: right;
    font-size: 0.8em;
    color: #666;
    margin-top: 1em;
  }
  .source a {
    color: #999;
    text-decoration: none;
  }
  .source a:hover {
    text-decoration: underline;
  }

  #newDescription {
  font-size: 1.1em; /* размер русского описания */
}
`;

  document.documentElement.appendChild(style);

  // Add tab JavaScript
  const script = document.createElement('script');
  script.textContent = `
    function openTab(evt, tabName) {
      const tabcontent = document.getElementsByClassName("tabcontent");
      for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      const tablinks = document.getElementsByClassName("tablinks");
      for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(tabName).style.display = "block";
      evt.currentTarget.className += " active";
    }
  `;
  document.body.appendChild(script);

  // Create tab for descriptions
  const descElement = document.querySelector('p[itemprop="description"]');
  if (!descElement) {
    console.log('Description element not found');
    return;
  }

  const originalDescription = descElement.innerHTML;

  // Create tab HTML with appropriate source visibility
  const tabHtml = createTabHtml(processedDescription, originalDescription, cameFromShikimori, shikimoriPageUrl);

  descElement.outerHTML = tabHtml;
  document.getElementsByClassName("tablinks")[0].click();
}

// Run the function when the page loads
window.addEventListener('load', replaceDescriptionTextAndTitle);

/*
    В этой части статичный перевод, который не зависит от API.
*/

function replaceText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = node.textContent
      .replace(/Favorites/g, "В избранном")
      .replace(/Members/g, "В списках")
      .replace(/Popularity/g, "Популярность")
      .replace(/Ranked/g, "Топ")
      .replace(/Score/g, "Оценка")
      .replace(/Rating/g, "Рейтинг")
      .replace(/Duration/g, "Длительность")
      .replace(/Source/g, "Первоисточник")
      .replace(/Studios/g, "Студии")
      .replace(/Licensors/g, "Лицензировано")
      .replace(/Producers/g, "Продюсеры")
      .replace(/Broadcast/g, "Показ")
      .replace(/Premiered/g, "Премьера")
      .replace(/Aired/g, "Дата")
      .replace(/Status/g, "Статус")
      .replace(/Episodes/g, "Эпизоды")
      .replace(/Type/g, "Тип")
      .replace(/Genres/g, "Жанры")
      .replace(/Themes/g, "Темы");
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      replaceText(child);
    }
  }
}

// Process .spaceit_pad elements for original translations
const spaceitElements = document.querySelectorAll('.spaceit_pad');
spaceitElements.forEach(element => {
  replaceText(element);
});

// Process #menu_left div for "Anime" and "Manga" translations
function replaceMenuText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = node.textContent
      .replace(/Anime/g, "Аниме")
      .replace(/Manga/g, "Манга");
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      replaceMenuText(child);
    }
  }
}

const menuLeft = document.querySelector('#menu_left');
if (menuLeft) {
  replaceMenuText(menuLeft);
}

// Process .stats-block divs for specific translations
function replaceStatsText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = node.textContent
      .replace(/Spring/g, "Весна")
      .replace(/Winter/g, "Зима")
      .replace(/Fall/g, "Осень")
      .replace(/Summer/g, "Лето")
      .replace(/Ranked/g, "Топ")
      .replace(/Popularity/g, "Популярность")
      .replace(/Members/g, "В списках");
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      replaceStatsText(child);
    }
  }
}

const statsBlocks = document.querySelectorAll('.stats-block.po-r.clearfix');
statsBlocks.forEach(block => {
  replaceStatsText(block);
});

// Update the .fl-l.score div's attributes
function updateScoreAttributes() {
  const scoreDivs = document.querySelectorAll('.fl-l.score');
  scoreDivs.forEach(div => {
    div.setAttribute('data-title', 'Рейтинг');
    const userValue = div.getAttribute('data-user');
    if (userValue) {
      if (userValue === '- user') {
        div.setAttribute('data-user', 'Нет оценок');
      } else {
        div.setAttribute('data-user', userValue.replace(/users$/, 'оценок'));
      }
    }
  });
}

updateScoreAttributes();

// Process .user-status-block div for specific translations and adjust select width
function replaceUserStatusText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = node.textContent
      .replace(/Appalling/g, "Провал")
      .replace(/Horrible/g, "Ужасно")
      .replace(/Very Bad/g, "Очень плохо")
      .replace(/Bad/g, "Плохо")
      .replace(/Average/g, "Нормально")
      .replace(/Fine/g, "Неплохо")
      .replace(/Very Good/g, "Очень хорошо")
      .replace(/Good/g, "Хорошо")
      .replace(/Great/g, "Отлично")
      .replace(/Masterpiece/g, "Шедевр")
      .replace(/Select/g, "Оценить")
      .replace(/Dropped/g, "Брошено")
      .replace(/On-Hold/g, "Отложено")
      .replace(/Watching/g, "Смотрю")
      .replace(/Plan to Watch/g, "Запланировано")
      .replace(/Completed/g, "Просмотрено")
      .replace(/Episodes:/g, "Эпизоды:");
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      replaceUserStatusText(child);
    }

    const selectElement = node.querySelector('select#myinfo_status');
    if (selectElement) {
      selectElement.style.width = '111px'; // Adjusted width for better text fit
    }
  }
}

const userStatusBlocks = document.querySelectorAll(
  '.user-status-block.js-user-status-block.fn-grey6.clearfix.al.mt8.po-r'
);
userStatusBlocks.forEach(block => {
  replaceUserStatusText(block);
});

// New function to handle translations in #addtolist element
function replaceAddToListText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = node.textContent
      .replace(/Appalling/g, "Провал")
      .replace(/Horrible/g, "Ужасно")
      .replace(/Very Bad/g, "Очень плохо")
      .replace(/Bad/g, "Плохо")
      .replace(/Average/g, "Нормально")
      .replace(/Fine/g, "Неплохо")
      .replace(/Very Good/g, "Очень хорошо")
      .replace(/Good/g, "Хорошо")
      .replace(/Great/g, "Отлично")
      .replace(/Masterpiece/g, "Шедевр")
      .replace(/Select/g, "Нет")
      .replace(/Dropped/g, "Брошено")
      .replace(/On-Hold/g, "Отложено")
      .replace(/Watching/g, "Смотрю")
      .replace(/Plan to Watch/g, "Запланировано")
      .replace(/Completed/g, "Просмотрено")
      .replace(/Status:/g, "Статус:")
      .replace(/Eps Seen:/g, "Прогресс:")
      .replace(/Your Score:/g, "Оценка:")
      .replace(/Edit Details/g, "Редактировать");
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      replaceAddToListText(child);
    }

    // Target the specific input button and change its value
    const updateButton = node.querySelector('input[name="myinfo_submit"]');
    if (updateButton && updateButton.classList.contains('js-anime-update-button')) {
      updateButton.value = "Обновить";
    }
  }
}

// Process #addtolist div
const addToListElement = document.getElementById('addtolist');
if (addToListElement) {
  replaceAddToListText(addToListElement);
}

// New functionality to replace text in .notice_open_public
function replaceNoticeText() {
  const noticeSpans = document.querySelectorAll('.notice_open_public');
  noticeSpans.forEach(span => {
    // Replace all text content in the span
    span.textContent = '* Ваш список публичный по умолчанию.';
  });
}

// Run the new functionality
replaceNoticeText();
