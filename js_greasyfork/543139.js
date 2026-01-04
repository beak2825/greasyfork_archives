// ==UserScript==
// @name			TransferLog Search & Balance
// @author			Neleus
// @namespace		Neleus
// @description	HWM TransferLog Search with balance calculation and warlog search
// @version			1.3
// @include				/^https?:\/\/(www|mirror|my)?\.?(heroeswm|lordswm)\.(ru|com)\/pl_transfers\.php.*/
// @include				/^https?:\/\/(www|mirror|my)?\.?(heroeswm|lordswm)\.(ru|com)\/pl_warlog\.php.*/
// @grant			none
// @run-at			document-end
// @license			GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/543139/TransferLog%20Search%20%20Balance.user.js
// @updateURL https://update.greasyfork.org/scripts/543139/TransferLog%20Search%20%20Balance.meta.js
// ==/UserScript==

(function () {
  // Определяем тип страницы
  const isWarlogPage = /pl_warlog\.php/.test(location.href);

  // Constants
  const SELECTORS = {
    CONTAINER_HEADER: "global_container_block_header global_a_hover",
    GLOBAL_HOVER: "global_a_hover",
  };

  const ELEMENT_IDS = {
    STOP: "stop",
    SEARCH_DIV: "transferSearchDiv",
    SEARCH_STATUS: "TSearch",
    CHECKBOX_LABEL: "HWM_transfer_search_checkbox_label",
    SHOW_BLOCK: "show_transfer_block",
  };

  const INPUT_IDS = {
    NICK: "TSearchNick",
    ART: "TSearchArt",
    ALL: "TSearchAll",
    PAGE_FROM: "TSearch_inp_page_from",
    PAGE_TO: "TSearch_inp_page_to",
  };

  const SEARCH_TYPES = {
    NICK: "Nick",
    FINE: "Fine",
    ART: "Art",
    ANY: "Any",
  };

  const DATE_TIME_PATTERN = "[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}";

  // Global variables
  const url = location.protocol + "//" + location.hostname + "/";
  const playerId = getPlayerId();
  const hiddenDiv = createHiddenDiv();
  let searchBalance = 0; // Общий баланс найденных операций
  let totalBalance = 0; // Общий баланс всех операций на странице

  // Initialize

  // Глобальная функция для остановки поиска
  window.stopSearch = function () {
    const stopButton = $(ELEMENT_IDS.STOP);
    if (stopButton) {
      stopButton.value = "1";
    }
  };

  const rootElement = findRootElement();

  if (isWarlogPage) {
    createWarlogSearchInterface(rootElement);
    setupWarlogEventListeners(rootElement);
  } else {
    applyInitialColoringAndBalance();
    createSearchInterface(rootElement);
    setupEventListeners(rootElement);
  }

  // Balance Processing Functions
  function makeColoredLine(line, gold, color) {
    return `<span style='background:rgba(${
      color === "green" ? "100,255,100,.1" : "255,100,100,.1"
    })'>${line}&nbsp; <b style='color:${color}'>${gold}</b></span>`;
  }

  function parseTransferLines(htmlContent) {
    const matches = [];
    const regex = /(&nbsp;&nbsp;.+?)<br>/g;
    let match;
    while ((match = regex.exec(htmlContent)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  }

  // Применяем раскраску и баланс при загрузке страницы (как в старом скрипте)
  function applyInitialColoringAndBalance() {
    const transferDiv = rootElement.getElementsByClassName("global_a_hover")[0];
    if (!transferDiv) return;

    const originalHTML = transferDiv.innerHTML;

    if (
      originalHTML.includes("<span style=") &&
      originalHTML.includes("Баланс золота:")
    ) {
      return;
    }

    const bodyHTML = document.body.innerHTML;
    const lines = parseTransferLines(bodyHTML);

    let html = "";
    totalBalance = 0;
    let processedCount = 0;

    for (let line of lines) {
      if (line.trim()) {
        const { processedLine, goldAmount } = processTransferBalance(line);
        html += processedLine + "<br>";
        totalBalance += goldAmount;
        processedCount++;
      }
    }

    if (lines.length > 0) {
      transferDiv.innerHTML = html;
      transferDiv.insertAdjacentHTML(
        "beforeend",
        `<br><b style='padding:20px'>Баланс золота: <span style='color:${
          totalBalance < 0 ? "red" : "green"
        }'>${totalBalance > 0 ? "+" : ""}${totalBalance.toLocaleString(
          "en-US"
        )}</span></b>`
      );
    }
  }

  function extractOriginalText(coloredLine) {
    if (!coloredLine || !coloredLine.includes("<span style=")) {
      return coloredLine;
    }

    return coloredLine
      .replace(/<span[^>]*>/g, "")
      .replace(/<\/span>/g, "")
      .replace(/<b[^>]*>.*?<\/b>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  }

  function cleanLineForParsing(line) {
    return line.replace(/<[^>]*>/g, "");
  }

  function extractGoldAmount(line, pattern, isNegative = false) {
    const cleanLine = cleanLineForParsing(line);
    const match = pattern.exec(cleanLine);
    if (match) {
      const amount = +match[1];
      return isNegative ? -amount : amount;
    }
    return 0;
  }

  function extractGoldWithCommission(
    line,
    goldPattern,
    commissionPattern,
    isNegative = false
  ) {
    const cleanLine = cleanLineForParsing(line);
    const goldMatch = goldPattern.exec(cleanLine);
    const commissionMatch = commissionPattern
      ? commissionPattern.exec(cleanLine)
      : null;

    if (goldMatch) {
      let amount = +goldMatch[1];
      if (commissionMatch) {
        amount -= +commissionMatch[1];
      }
      return isNegative ? -amount : amount;
    }
    return 0;
  }

  function processTransferBalance(line) {
    let gold = 0;
    let newline = line;

    try {
      // Обмен бриллиантов на золото: "10 бриллиантов обменяно на 50000 золота"
      if (/обменян/.test(line)) {
        gold = extractGoldAmount(line, /на (?:<b>)?(\d+)/);
        newline = makeColoredLine(line, "+" + gold, "green");
      }

      // Продажи и передачи с комиссией
      else if (/(?:Передан .+?за \d+ (?:Золото|золота)|Продан)/.test(line)) {
        gold = extractGoldWithCommission(
          line,
          /за (\d+) (?:золота|Золото)/,
          /комиссия:* (\d+)/
        );
        newline = makeColoredLine(line, "+" + gold, "green");
      }

      // Передача предмета с получением золота
      else if (/Передан предмет.*Получено: \d+ золота/.test(line)) {
        gold = extractGoldAmount(line, /Получено: (\d+) золота/);
        newline = makeColoredLine(line, "+" + gold, "green");
      }

      // Получение предмета и золота за ремонт
      else if (/Получен .+?на ремонт/.test(line)) {
        const cleanLine = cleanLineForParsing(line);
        const g = /ремонт: (\d+)/.exec(cleanLine)?.[1];
        const p = /(\d+)%/.exec(cleanLine)?.[1];
        if (g && p) {
          gold = Math.ceil(g / p) * (p - 100);
          newline = makeColoredLine(
            line,
            gold >= 0 ? "+" + gold : gold,
            gold >= 0 ? "green" : "red"
          );
        }
      }

      // Оплата за ремонт
      else if (/Оплачено за/.test(line)) {
        gold = extractGoldWithCommission(
          line,
          /ремонт: (\d+)/,
          /комиссия: (\d+)/,
          true
        );
        newline = makeColoredLine(line, gold, "red");
      }

      // Аренда артефакта
      else if (/Арендован/.test(line)) {
        gold = extractGoldWithCommission(
          line,
          /Стоимость: (\d+)/,
          /комиссия: (\d+)/,
          true
        );
        newline = makeColoredLine(line, gold, "red");
      }

      // Получение золота, заработок, обмен бриллиантов
      else if (
        /Получено \d+ (?:Золото|золота)\s+от|Взято|Заработано|бриллиант[ао]в? обменяно на \d+ золота/.test(
          line
        )
      ) {
        gold = extractGoldAmount(line, /(\d+) (?:Золото|золота)/);
        newline = makeColoredLine(line, "+" + gold, "green");
      }

      // Взят в ремонт
      else if (/Взят в ремонт/.test(line)) {
        gold = extractGoldAmount(line, /Заработано: (\d+)/);
        newline = makeColoredLine(line, "+" + gold, "green");
      }

      // Передача денег в клан
      else if (/Передано \d+ золота на счет клана/.test(line)) {
        gold = extractGoldAmount(line, /(\d+) золота/, true);
        newline = makeColoredLine(line, gold, "red");
      }

      // Передача золота игроку
      else if (/Передано \d+ (?:Золото|золота)\s+для/.test(line)) {
        gold = extractGoldWithCommission(
          line,
          /(\d+) (?:Золото|золота)/,
          /комиссия (\d+)/,
          true
        );
        newline = makeColoredLine(line, gold, "red");
      }

      // Покупки
      else if (
        /Получен (?:элемент|предмет).+?за \d+ (?:золота|Золото)|Куплен|Куплена? \d+ часть артефакта/.test(
          line
        )
      ) {
        gold = extractGoldAmount(line, /за (\d+) (?:золота|Золото)/, true);
        newline = makeColoredLine(line, gold, "red");
      }

      // Продажи частей артефакта
      else if (/Продано \d+ \(\d+ -> \d+\) частей артефакта/.test(line)) {
        gold = extractGoldWithCommission(
          line,
          /за (\d+) золота/,
          /комиссия: (\d+)/
        );
        newline = makeColoredLine(line, "+" + gold, "green");
      }

      // Продажи элементов
      else if (/Продан "[^"]+"(?: \d+ шт\.)? за \d+ золота/.test(line)) {
        gold = extractGoldWithCommission(
          line,
          /за (\d+) золота/,
          /комиссия: (\d+)/
        );
        newline = makeColoredLine(line, "+" + gold, "green");
      }

      // Возвраты с возвратом золота
      else if (/Неиспользовано|^Вернул/.test(line) && !/c ремонта/.test(line)) {
        gold = extractGoldAmount(line, /(?:золота|Возврат золота): (\d+)/);
        newline = makeColoredLine(line, "+" + gold, "green");
      }

      // Операции без влияния на баланс
      else if (
        /Забран предмет|Получен предмет(?!.+за \d+)|Передан предмет для|Возвращен предмет|Возвращено автоматически|Вернул c ремонта|Игрок (?:освобожден|помещен|разблокирован|заблокирован)/.test(
          line
        )
      ) {
        gold = 0;
        newline = line;
      }

      // Штрафы игрока
      else if (/Игрок оштрафован/.test(line)) {
        gold = extractGoldAmount(line, /на (\d+) золота/, true);
        newline = makeColoredLine(line, gold, "red");
      }
      // Остальные покупки и траты
      else if (/Оплачено \d+|Куплен|Внесено/.test(line)) {
        gold = extractGoldAmount(line, /(\d+) золота/, true);
        newline = makeColoredLine(line, gold, "red");
      }
    } catch (error) {}

    return { processedLine: newline, goldAmount: gold };
  }

  // Page Management Functions
  function getTotalPages(playerId, callback) {
    let callbackCalled = false;
    const safeCallback = (pages) => {
      if (!callbackCalled) {
        callbackCalled = true;
        callback(pages);
      }
    };

    const xhr = createXMLHttpRequest();
    try {
      xhr.open(
        "GET",
        `${url}pl_transfers.php?id=${playerId}&page=999999`,
        true
      );
      setRequestHeaders(xhr);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const responseDiv = document.createElement("div");
            responseDiv.innerHTML = xhr.responseText;

            const pagination = responseDiv.querySelector(".hwm_pagination");
            if (pagination) {
              const activeLink = pagination.querySelector("a.active");
              if (activeLink) {
                const totalPages = parseInt(activeLink.textContent.trim());
                safeCallback(totalPages);
                return;
              }

              const allLinks = pagination.querySelectorAll('a[href*="page="]');
              let maxPageNumber = 0;

              allLinks.forEach((link) => {
                const pageMatch = link.href.match(/page=(\d+)/);
                if (pageMatch) {
                  const pageNum = parseInt(pageMatch[1]);
                  maxPageNumber = Math.max(maxPageNumber, pageNum);
                }

                const linkText = parseInt(link.textContent.trim());
                if (!isNaN(linkText)) {
                  maxPageNumber = Math.max(maxPageNumber, linkText);
                }
              });

              const totalPages = maxPageNumber + 1;
              safeCallback(totalPages);
            } else {
              safeCallback(1);
            }
          } else {
            safeCallback(1);
          }
        }
      };

      xhr.send(null);
    } catch (error) {
      safeCallback(1);
    }
  }

  // Core Functions
  function makeRequest(requestUrl, callback, callbackData, firstPage) {
    const xhr = createXMLHttpRequest();
    try {
      xhr.open("GET", requestUrl, true);
      setRequestHeaders(xhr);
      xhr.onreadystatechange = function () {
        callback(xhr, callbackData, firstPage);
      };
      xhr.send(null);
    } catch (error) {
      alert("HWM_TransferSearch: " + error);
    }
  }

  function startSearch(playerId, rootElement, searchType) {
    createStopButton();

    const stopButton = $(ELEMENT_IDS.STOP);
    if (stopButton && stopButton.value === "1") {
      return;
    }

    if (stopButton) {
      stopButton.value = "0";
    }

    searchBalance = 0;

    const pageFrom = Math.max(
      1,
      Math.floor(getNumberFieldValue(INPUT_IDS.PAGE_FROM, 1))
    );
    let pageTo = getNumberFieldValue(INPUT_IDS.PAGE_TO, 0);

    hideSearchInterface();

    if (pageTo === 0) {
      displaySearchStatus(
        searchType,
        getSearchString(searchType),
        "?",
        pageFrom
      );
      const statusContainer = $(ELEMENT_IDS.SEARCH_STATUS);
      statusContainer.innerHTML +=
        "<br><i>Определяем общее количество страниц...</i>";

      getTotalPages(playerId, function (totalPages) {
        pageTo = totalPages;
        continueSearch(playerId, rootElement, searchType, pageFrom, pageTo);
      });
    } else {
      continueSearch(playerId, rootElement, searchType, pageFrom, pageTo);
    }
  }

  function getSearchString(searchType) {
    const inputMap = {
      [SEARCH_TYPES.NICK]: INPUT_IDS.NICK,
      [SEARCH_TYPES.FINE]: ELEMENT_IDS.CHECKBOX_LABEL,
      [SEARCH_TYPES.ART]: INPUT_IDS.ART,
      [SEARCH_TYPES.ANY]: INPUT_IDS.ALL,
    };

    const inputId = inputMap[searchType];
    if (!inputId) return "";

    const element = $(inputId);
    if (!element) {
      return "";
    }

    if (searchType === SEARCH_TYPES.FINE) {
      return element.checked ? "true" : "false";
    }

    return element.value.trim();
  }

  function continueSearch(playerId, rootElement, searchType, pageFrom, pageTo) {
    if (pageFrom > pageTo) {
      alert("Начальная страница не может быть больше конечной!");
      showSearchInterface();
      return;
    }

    performSearch(playerId, searchType, rootElement, pageTo, pageFrom);
  }

  function performSearch(
    playerId,
    searchType,
    rootElement,
    totalPages,
    firstPage
  ) {
    let regex, searchString;

    try {
      ({ regex, searchString } = createSearchRegex(searchType));
    } catch (error) {
      alert(error.message);
      showSearchInterface();
      return;
    }

    const playerNick = getPlayerNick(rootElement);

    clearAndSetupResults(rootElement, playerNick, playerId);
    searchBalance = 0;

    const matchesElement = $("matches");
    if (matchesElement) {
      matchesElement.innerHTML = "0";
    }

    displaySearchStatus(searchType, searchString, totalPages, firstPage);

    executePageSearch(
      firstPage,
      playerId,
      regex,
      totalPages,
      rootElement,
      searchType,
      searchString,
      firstPage,
      null
    );
  }

  function createSearchRegex(searchType) {
    const searchString = getSearchString(searchType);

    if (
      !searchString &&
      searchType !== SEARCH_TYPES.FINE &&
      searchString !== "false"
    ) {
      const errorMessages = {
        [SEARCH_TYPES.NICK]: "Введите ник для поиска",
        [SEARCH_TYPES.ART]: "Введите название артефакта для поиска",
        [SEARCH_TYPES.ANY]: "Введите текст для поиска",
      };
      throw new Error(
        errorMessages[searchType] || `Unknown search type: ${searchType}`
      );
    }

    const regexPatterns = {
      [SEARCH_TYPES.NICK]: `${DATE_TIME_PATTERN}: .*<b>${escapeRegexString(
        searchString
      )}</b></a>`,
      [SEARCH_TYPES.FINE]: `${DATE_TIME_PATTERN}: <b>Игрок${
        searchString === "true"
          ? " (?:оштрафован|освобожден|помещен|разблокирован|заблокирован)"
          : " оштрафован"
      }`,
      [SEARCH_TYPES.ART]: `${DATE_TIME_PATTERN}: .*предмет [\"'][^\"']*${escapeRegexString(
        searchString
      )}[^\"']*[\"']`,
      [SEARCH_TYPES.ANY]: `${DATE_TIME_PATTERN}: .*${escapeRegexString(
        searchString
      )}.*`,
    };

    const pattern = regexPatterns[searchType];
    if (!pattern) {
      throw new Error(`Unknown search type: ${searchType}`);
    }

    const flags = "i";
    const regex = new RegExp(pattern, flags);

    return { regex, searchString };
  }

  function executePageSearch(
    currentPage,
    playerId,
    regex,
    lastPage,
    rootElement,
    searchType,
    searchString,
    firstPage,
    currentPageDate
  ) {
    const stopButton = $(ELEMENT_IDS.STOP);
    if (stopButton && stopButton.value !== "1" && currentPage <= lastPage) {
      const searchArgs = {
        pg: currentPage,
        id: playerId,
        reg: regex,
        lastPg: lastPage,
        elem: rootElement,
        type: searchType,
        search_str: searchString,
        first_page: firstPage,
      };

      makeRequest(
        `${url}pl_transfers.php?id=${playerId}&page=${currentPage - 1}`,
        processPageResults,
        searchArgs
      );
    } else {
      displaySearchComplete(
        searchType,
        searchString,
        firstPage,
        currentPage - 1,
        currentPageDate
      );
    }
  }

  function processPageResults(xhr, searchArgs) {
    if (xhr.readyState === 4 && xhr.status === 200) {
      hiddenDiv.innerHTML = xhr.responseText;
      const transferContainer = hiddenDiv.getElementsByClassName(
        SELECTORS.CONTAINER_HEADER
      )[0].nextElementSibling;
      const transferElement = transferContainer.getElementsByClassName(
        SELECTORS.GLOBAL_HOVER
      )[0];

      if (!transferElement) return;

      const transferText = transferElement.innerHTML;
      const transfers = transferText.split("<br>");
      let firstTimeOnPage = null;
      const timeRegex = /&nbsp;&nbsp;(\d\d-\d\d-\d\d \d\d:\d\d):/;

      for (let i = 0; i < transfers.length; i++) {
        if (!firstTimeOnPage) {
          const timeMatch = timeRegex.exec(transfers[i]);
          if (timeMatch) firstTimeOnPage = timeMatch[1];
        }

        const originalText = extractOriginalText(transfers[i]);

        if (searchArgs.reg.test(originalText)) {
          const matchesElement = $("matches");
          if (matchesElement) {
            matchesElement.innerHTML = Number(matchesElement.innerHTML) + 1;
          }

          const result = processTransferBalance(transfers[i]);
          const displayLine = result.processedLine;
          const goldAmount = result.goldAmount;

          searchBalance += goldAmount;
          searchArgs.elem.innerHTML += displayLine;
          searchArgs.elem.appendChild(document.createElement("br"));
        }
      }

      if (firstTimeOnPage) {
        const currDateElement = $("curr_date");
        if (currDateElement) {
          currDateElement.innerHTML = firstTimeOnPage;
        }
      }
      updateSearchProgress(searchArgs.lastPg, searchArgs.first_page);
      updateSearchBalance();

      executePageSearch(
        searchArgs.pg + 1,
        searchArgs.id,
        searchArgs.reg,
        searchArgs.lastPg,
        searchArgs.elem,
        searchArgs.type,
        searchArgs.search_str,
        searchArgs.first_page,
        firstTimeOnPage
      );
    }
  }

  // UI Helper Functions
  function formatSearchTypeDisplay(searchType, searchString) {
    const typeFormatters = {
      [SEARCH_TYPES.NICK]: () => {
        return `по нику <a href="pl_info.php?nick=${searchString}" style="text-decoration: none;"><b>${searchString}</b></a>`;
      },
      [SEARCH_TYPES.FINE]: () =>
        searchString === "true" ? "штрафы, блок, тюрьма" : "штрафы",
      [SEARCH_TYPES.ART]: () => `по артефакту "${searchString}"`,
      [SEARCH_TYPES.ANY]: () => `по подстроке "${searchString}"`,
    };

    return typeFormatters[searchType]
      ? typeFormatters[searchType]()
      : searchType;
  }

  function displaySearchStatus(
    searchType,
    searchString,
    totalPages,
    firstPage
  ) {
    const formattedType = formatSearchTypeDisplay(searchType, searchString);

    const oldStatus = $(ELEMENT_IDS.SEARCH_STATUS);
    if (oldStatus) {
      oldStatus.remove();
    }

    const statusContainer = document.createElement("div");
    statusContainer.id = ELEMENT_IDS.SEARCH_STATUS;
    statusContainer.style.textAlign = "center";

    statusContainer.innerHTML = `
      Идёт поиск ${formattedType}... 
      (<a href="javascript: void(0);" id="cancel" onclick="stopSearch();">стоп</a>)
      <br />
      Просмотрено <text id="viewed">0</text> страничек из ${
        totalPages - firstPage + 1
      } 
      (с ${firstPage} по ${totalPages}): <text id="percent">0</text>%
      <br />
      Дата последней операции на текущей странице: <text id="curr_date"></text>
      <br />
      Найдено <text id="matches">0</text> записей. Баланс: <text id="current_balance">0</text>
    `;

    rootElement.appendChild(statusContainer);
    rootElement.appendChild(document.createElement("br"));
  }

  function displaySearchComplete(
    searchType,
    searchString,
    firstPage,
    lastPage,
    currentPageDate
  ) {
    const matches = $("matches").innerHTML;
    const formattedType = formatSearchTypeDisplay(searchType, searchString);
    const dateInfo = currentPageDate
      ? `<br/>Дата последней операции на странице ${lastPage}: ${currentPageDate}`
      : "";

    const formattedBalance = searchBalance.toLocaleString("en-US");
    const balanceColor = searchBalance < 0 ? "red" : "green";
    const balanceSign = searchBalance > 0 ? "+" : "";

    $(ELEMENT_IDS.SEARCH_STATUS).innerHTML = `
      Поиск ${formattedType} закончен!<br>
      Найдено ${matches} записей на страницах ${firstPage}-${lastPage}:${dateInfo}
      <br><br><b style='padding:20px'>Баланс найденных операций: 
      <span style='color:${balanceColor}'>${balanceSign}${formattedBalance}</span></b>
    `;
  }

  function updateSearchProgress(totalPages, firstPage) {
    const viewedElement = $("viewed");
    const percentElement = $("percent");

    if (viewedElement && percentElement) {
      viewedElement.innerHTML = Number(viewedElement.innerHTML) + 1;
      percentElement.innerHTML = Math.round(
        (viewedElement.innerHTML * 100) / (totalPages - firstPage + 1)
      );
    }
  }

  function updateSearchBalance() {
    const balanceElement = $("current_balance");
    if (balanceElement) {
      const formattedBalance = searchBalance.toLocaleString("en-US");
      const balanceColor = searchBalance < 0 ? "red" : "green";
      const balanceSign = searchBalance > 0 ? "+" : "";
      balanceElement.innerHTML = `<span style='color:${balanceColor}'>${balanceSign}${formattedBalance}</span>`;
    }
  }

  // UI Creation Functions
  function createSearchInterface(rootElement) {
    insertAfter(
      rootElement.getElementsByTagName("center")[0].firstChild,
      document.createElement("br")
    );

    const searchToggle = document.createElement("text");
    searchToggle.id = ELEMENT_IDS.SEARCH_STATUS;
    searchToggle.innerHTML = `&nbsp;(<a id="${ELEMENT_IDS.SHOW_BLOCK}" href="javascript: void(0);">Поиск по протоколу</a>)`;
    rootElement.getElementsByTagName("center")[0].appendChild(searchToggle);

    const searchContainer = createSearchForm();
    rootElement.getElementsByTagName("center")[0].appendChild(searchContainer);
  }

  function createSearchForm() {
    const container = document.createElement("div");
    container.id = ELEMENT_IDS.SEARCH_DIV;
    container.style.display = "none";

    container.innerHTML = `
      <table>
        <tr>
          <td>Поиск по нику:</td>
          <td><input type="text" id="${INPUT_IDS.NICK}" form="form_nick" /></td>
          <td>
            <form action="" style="padding:0;margin:0;border:0;" id="form_nick" onSubmit="return false;">
              <input type="submit" id="TSearchByNick" value="Поиск" />
            </form>
          </td>
        </tr>
        <tr>
          <td>Поиск штрафов:</td>
          <td title="Блок/Штраф/Тюрьма">
            <input type="checkbox" id="${ELEMENT_IDS.CHECKBOX_LABEL}" /> <label for="${ELEMENT_IDS.CHECKBOX_LABEL}">Блок/Штраф/Тюрьма</label>
          </td>
          <td><input type="submit" id="TSearchByFine" value="Поиск" /></td>
        </tr>
        <tr>
          <td>Поиск по артефакту:</td>
          <td><input type="text" id="${INPUT_IDS.ART}" form="form_art" /></td>
          <td>
            <form action="" style="padding:0;margin:0;border:0;" id="form_art" onSubmit="return false;">
              <input type="submit" id="TSearchByArt" value="Поиск" />
            </form>
          </td>
        </tr>
        <tr>
          <td>Общий Поиск:</td>
          <td><input type="text" id="${INPUT_IDS.ALL}" form="form_any" /></td>
          <td>
            <form action="" style="padding:0;margin:0;border:0;" id="form_any" onSubmit="return false;">
              <input type="submit" id="TSearchAny" value="Поиск" />
            </form>
          </td>
        </tr>

        <tr>
          <td>с страницы</td>
          <td title="Начать поиск с указанной страницы">
            <input type="text" id="${INPUT_IDS.PAGE_FROM}" value="1"/>
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>по страницу</td>
          <td title="Закончить поиск на указанной странице (0 = до конца)">
            <input type="text" id="${INPUT_IDS.PAGE_TO}" value="0" placeholder="0 = до конца"/>
          </td>
          <td>
            <button type="button" id="TSearch_get_total_pages" title="Определить общее количество страниц">
              Узнать всего
            </button>
          </td>
        </tr>
      </table>
    `;

    return container;
  }

  function setupEventListeners(rootElement) {
    if (rootElement._listenersAdded) {
      return;
    }

    const eventHandlers = {
      [ELEMENT_IDS.SHOW_BLOCK]: toggleSearchInterface,
      TSearchByNick: () =>
        startSearch(playerId, rootElement, SEARCH_TYPES.NICK),
      TSearchByFine: () =>
        startSearch(playerId, rootElement, SEARCH_TYPES.FINE),
      TSearchByArt: () => startSearch(playerId, rootElement, SEARCH_TYPES.ART),
      TSearchAny: () => startSearch(playerId, rootElement, SEARCH_TYPES.ANY),

      TSearch_get_total_pages: () => handleGetTotalPages(),
    };

    Object.entries(eventHandlers).forEach(([elementId, handler]) => {
      addClickHandler(elementId, handler);
    });

    rootElement._listenersAdded = true;
  }

  function handleGetTotalPages() {
    const button = $("TSearch_get_total_pages");
    const pageToField = $(INPUT_IDS.PAGE_TO);

    if (button.disabled) return;

    if (handleGetTotalPages.isRunning) {
      return;
    }

    handleGetTotalPages.isRunning = true;
    button.textContent = "Загрузка...";
    button.disabled = true;

    getTotalPages(playerId, function (totalPages) {
      pageToField.value = totalPages;
      button.textContent = "Узнать всего";
      button.disabled = false;
      handleGetTotalPages.isRunning = false;
    });
  }

  // Utility Functions
  function findRootElement() {
    return document.getElementsByClassName(SELECTORS.CONTAINER_HEADER)[0]
      .nextElementSibling;
  }

  function getPlayerNick(rootElement) {
    return rootElement.previousSibling.getElementsByTagName("a")[0].innerHTML;
  }

  function clearAndSetupResults(rootElement, playerNick, playerId) {
    const headerElement = rootElement.getElementsByClassName(
      SELECTORS.GLOBAL_HOVER
    )[0];

    headerElement.innerHTML = "";

    const titleContainer = document.createElement("div");
    titleContainer.style.textAlign = "center";
    titleContainer.innerHTML = "Поиск по протоколу передач игрока ";

    const playerLink = document.createElement("a");
    playerLink.href = `pl_info.php?id=${playerId}`;
    playerLink.style.textDecoration = "none";
    playerLink.innerHTML = playerNick;
    titleContainer.appendChild(playerLink);

    headerElement.appendChild(titleContainer);
    headerElement.appendChild(document.createElement("br"));
  }

  function createStopButton() {
    let stopButton = $(ELEMENT_IDS.STOP);

    if (!stopButton) {
      stopButton = document.createElement("input");
      stopButton.type = "hidden";
      stopButton.value = "0";
      stopButton.id = ELEMENT_IDS.STOP;
      document.getElementsByTagName("body")[0].appendChild(stopButton);
    }

    return stopButton;
  }

  function hideSearchInterface() {
    $(ELEMENT_IDS.SEARCH_DIV).style.display = "none";
    $(ELEMENT_IDS.SEARCH_STATUS).style.display = "none";
  }

  function showSearchInterface() {
    $(ELEMENT_IDS.SEARCH_DIV).style.display = "block";
    $(ELEMENT_IDS.SEARCH_STATUS).style.display = "block";
  }

  function createHiddenDiv() {
    const div = document.createElement("div");
    div.style.display = "none";
    div.id = "hwm_transfer_search_hidden";
    document.body.appendChild(div);
    return div;
  }

  function escapeRegexString(str) {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/\./g, "\\.")
      .replace(/\+/g, "\\+")
      .replace(/\*/g, "\\*")
      .replace(/\?/g, "\\?")
      .replace(/\$/g, "\\$")
      .replace(/\|/g, "\\|");
  }

  function toggleSearchInterface() {
    const searchDiv = $(ELEMENT_IDS.SEARCH_DIV);
    searchDiv.style.display =
      searchDiv.style.display === "none" ? "block" : "none";
  }

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function addClickHandler(elementId, handler) {
    const element = $(elementId);
    if (element && handler) {
      addEventHandler(element, "click", handler);
    }
  }

  function addEventHandler(element, eventType, handler) {
    if (element) {
      if (element.addEventListener) {
        element.addEventListener(eventType, handler, false);
      } else if (element.attachEvent) {
        element.attachEvent("on" + eventType, handler);
      } else {
        element["on" + eventType] = handler;
      }
    }
  }

  function getPlayerId() {
    const match = location.href.match(/\?(?:.*=.*&)*id=([0-9]*)(?:&.*=.*)*/);
    return match[1];
  }

  function $(elementId) {
    return document.getElementById(elementId);
  }

  function getNumberFieldValue(fieldId, defaultValue) {
    const element = $(fieldId);
    return element ? getValidNumber(element.value) : defaultValue || 0;
  }

  function getValidNumber(value) {
    const num = Number(value);
    const validNum = isNaN(num) ? 0 : num;
    return validNum < 0 ? 0 : validNum;
  }

  function createXMLHttpRequest() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } else {
      alert("Can't create XMLHttpRequest!");
      return null;
    }
  }

  function setRequestHeaders(xhr) {
    xhr.setRequestHeader("Content-type", "text/html; charset=windows-1251");
    if (xhr.overrideMimeType) {
      xhr.overrideMimeType("text/html; charset=windows-1251");
    }
  }

  // ==================== WARLOG SEARCH MODULE ====================

  function createWarlogSearchInterface(rootElement) {
    insertAfter(
      rootElement.getElementsByTagName("center")[0].firstChild,
      document.createElement("br")
    );

    const searchToggle = document.createElement("text");
    searchToggle.id = ELEMENT_IDS.SEARCH_STATUS;
    searchToggle.innerHTML = `&nbsp;(<a id="${ELEMENT_IDS.SHOW_BLOCK}" href="javascript: void(0);">Поиск по протоколу боёв</a>)`;
    rootElement.getElementsByTagName("center")[0].appendChild(searchToggle);

    const container = document.createElement("div");
    container.id = ELEMENT_IDS.SEARCH_DIV;
    container.style.display = "none";
    container.innerHTML = `
      <table>
        <tr>
          <td>Поиск по нику:</td>
          <td><input type="text" id="${INPUT_IDS.NICK}" form="form_nick" /></td>
          <td>
            <form action="" style="padding:0;margin:0;border:0;" id="form_nick" onSubmit="return false;">
              <input type="submit" id="WSearchByNick" value="Поиск" />
            </form>
          </td>
        </tr>
        <tr>
          <td>с страницы</td>
          <td><input type="text" id="${INPUT_IDS.PAGE_FROM}" value="1"/></td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>по страницу</td>
          <td><input type="text" id="${INPUT_IDS.PAGE_TO}" value="0" placeholder="0 = до конца"/></td>
          <td>
            <button type="button" id="WSearch_get_total_pages">Узнать всего</button>
          </td>
        </tr>
      </table>
    `;
    rootElement.getElementsByTagName("center")[0].appendChild(container);
  }

  function setupWarlogEventListeners(rootElement) {
    addClickHandler(ELEMENT_IDS.SHOW_BLOCK, toggleSearchInterface);
    addClickHandler("WSearchByNick", () =>
      startWarlogSearch(playerId, rootElement)
    );
    addClickHandler("WSearch_get_total_pages", handleWarlogGetTotalPages);
  }

  function handleWarlogGetTotalPages() {
    const button = $("WSearch_get_total_pages");
    const pageToField = $(INPUT_IDS.PAGE_TO);
    if (button.disabled) return;

    button.textContent = "Загрузка...";
    button.disabled = true;

    getWarlogTotalPages(playerId, function (totalPages) {
      pageToField.value = totalPages;
      button.textContent = "Узнать всего";
      button.disabled = false;
    });
  }

  function getWarlogTotalPages(playerId, callback) {
    fetch(`${url}pl_warlog.php?id=${playerId}&page=999999`)
      .then((response) => response.text())
      .then((html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        const active = div.querySelector(".hwm_pagination a.active");
        if (active) {
          callback(parseInt(active.textContent));
          return;
        }
        const links = div.querySelectorAll('.hwm_pagination a[href*="page="]');
        let max = 1;
        links.forEach((a) => {
          const m = a.href.match(/page=(\d+)/);
          if (m) max = Math.max(max, parseInt(m[1]) + 1);
        });
        callback(max);
      })
      .catch(() => callback(1));
  }

  function startWarlogSearch(playerId, rootElement) {
    const searchString = $(INPUT_IDS.NICK).value.trim();
    if (!searchString) {
      alert("Введите ник для поиска");
      return;
    }

    createStopButton();
    const stopButton = $(ELEMENT_IDS.STOP);
    if (stopButton) stopButton.value = "0";

    const pageFrom = Math.max(1, getNumberFieldValue(INPUT_IDS.PAGE_FROM, 1));
    let pageTo = getNumberFieldValue(INPUT_IDS.PAGE_TO, 0);

    hideSearchInterface();

    if (pageTo === 0) {
      displayWarlogSearchStatus(searchString, "?", pageFrom);
      $(ELEMENT_IDS.SEARCH_STATUS).innerHTML +=
        "<br><i>Определяем общее количество страниц...</i>";

      getWarlogTotalPages(playerId, function (totalPages) {
        pageTo = totalPages;
        executeWarlogSearch(
          playerId,
          rootElement,
          searchString,
          pageFrom,
          pageTo
        );
      });
    } else {
      executeWarlogSearch(
        playerId,
        rootElement,
        searchString,
        pageFrom,
        pageTo
      );
    }
  }

  function executeWarlogSearch(
    playerId,
    rootElement,
    searchString,
    pageFrom,
    pageTo
  ) {
    const searchNick = searchString.toLowerCase();
    const resultsElement = rootElement.getElementsByClassName(
      SELECTORS.GLOBAL_HOVER
    )[0];
    resultsElement.innerHTML = "";

    const titleContainer = document.createElement("div");
    titleContainer.style.textAlign = "center";
    titleContainer.innerHTML = `Поиск боёв с игроком <a href="pl_info.php?nick=${searchString}" style="text-decoration:none;"><b>${searchString}</b></a>`;
    resultsElement.appendChild(titleContainer);
    resultsElement.appendChild(document.createElement("br"));

    displayWarlogSearchStatus(searchString, pageTo, pageFrom);

    processWarlogPage(
      pageFrom,
      playerId,
      searchNick,
      pageTo,
      resultsElement,
      pageFrom
    );
  }

  function processWarlogPage(
    currentPage,
    playerId,
    searchNick,
    lastPage,
    resultsElement,
    firstPage
  ) {
    const stopButton = $(ELEMENT_IDS.STOP);
    if (stopButton && stopButton.value === "1") {
      displayWarlogComplete(searchNick, firstPage, currentPage - 1);
      return;
    }
    if (currentPage > lastPage) {
      displayWarlogComplete(searchNick, firstPage, lastPage);
      return;
    }

    // page=0 это первая страница, page=1 - вторая и т.д.
    const pageNum = currentPage - 1;
    const requestUrl = `${url}pl_warlog.php?id=${playerId}&page=${pageNum}`;

    // Используем тот же подход что и для передач - XMLHttpRequest + hiddenDiv
    const xhr = createXMLHttpRequest();
    xhr.open("GET", requestUrl, true);
    setRequestHeaders(xhr);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        hiddenDiv.innerHTML = xhr.responseText;

        const warlogContainer = hiddenDiv.getElementsByClassName(
          SELECTORS.CONTAINER_HEADER
        )[0];
        if (!warlogContainer) {
          updateWarlogProgress(lastPage, firstPage);
          processWarlogPage(
            currentPage + 1,
            playerId,
            searchNick,
            lastPage,
            resultsElement,
            firstPage
          );
          return;
        }

        const contentDiv =
          warlogContainer.nextElementSibling.getElementsByClassName(
            SELECTORS.GLOBAL_HOVER
          )[0];
        if (!contentDiv) {
          updateWarlogProgress(lastPage, firstPage);
          processWarlogPage(
            currentPage + 1,
            playerId,
            searchNick,
            lastPage,
            resultsElement,
            firstPage
          );
          return;
        }

        // Разбиваем содержимое на строки по <BR>
        const lines = contentDiv.innerHTML.split(/<br>/gi);
        for (const line of lines) {
          if (
            line.includes("warlog.php?warid=") &&
            hasNickInLine(line, searchNick)
          ) {
            const matchesEl = $("matches");
            if (matchesEl)
              matchesEl.innerHTML = Number(matchesEl.innerHTML) + 1;

            const div = document.createElement("div");
            div.style.background = "rgba(255,255,0,.3)";
            div.style.padding = "3px";
            div.style.margin = "2px 0";
            div.innerHTML = line;
            resultsElement.appendChild(div);
          }
        }

        updateWarlogProgress(lastPage, firstPage);
        processWarlogPage(
          currentPage + 1,
          playerId,
          searchNick,
          lastPage,
          resultsElement,
          firstPage
        );
      }
    };
    xhr.send(null);
  }

  function hasNickInLine(line, searchNick) {
    // Ники могут быть обёрнуты в <b>, <font> и другие теги
    // Пример: <a class=pi href="pl_info.php?id=123"><font color=red>Ник[21]</font></a>
    const regex = /pl_info\.php\?id=\d+[^>]*>([^<]*(?:<[^>]+>[^<]*)*)/gi;
    let match;
    while ((match = regex.exec(line)) !== null) {
      // Убираем все HTML теги и извлекаем чистый ник
      const nickWithTags = match[1];
      const cleanNick = nickWithTags
        .replace(/<[^>]*>/g, "")
        .replace(/\[\d+\]$/, "")
        .trim();
      if (cleanNick.toLowerCase().includes(searchNick)) {
        return true;
      }
    }
    return false;
  }

  function displayWarlogSearchStatus(searchString, totalPages, firstPage) {
    const oldStatus = $(ELEMENT_IDS.SEARCH_STATUS);
    if (oldStatus) oldStatus.remove();

    const statusContainer = document.createElement("div");
    statusContainer.id = ELEMENT_IDS.SEARCH_STATUS;
    statusContainer.style.textAlign = "center";
    statusContainer.innerHTML = `
      Идёт поиск по нику <a href="pl_info.php?nick=${searchString}" style="text-decoration:none;"><b>${searchString}</b></a>...
      (<a href="javascript:void(0);" onclick="stopSearch();">стоп</a>)
      <br/>
      Просмотрено <text id="viewed">0</text> страничек из ${
        totalPages - firstPage + 1
      }
      (с ${firstPage} по ${totalPages}): <text id="percent">0</text>%
      <br/>
      Найдено <text id="matches">0</text> боёв
    `;
    rootElement.appendChild(statusContainer);
    rootElement.appendChild(document.createElement("br"));
  }

  function updateWarlogProgress(totalPages, firstPage) {
    const viewedEl = $("viewed");
    const percentEl = $("percent");
    if (viewedEl && percentEl) {
      viewedEl.innerHTML = Number(viewedEl.innerHTML) + 1;
      percentEl.innerHTML = Math.round(
        (viewedEl.innerHTML * 100) / (totalPages - firstPage + 1)
      );
    }
  }

  function displayWarlogComplete(searchNick, firstPage, lastPage) {
    const matches = $("matches")?.innerHTML || "0";
    $(ELEMENT_IDS.SEARCH_STATUS).innerHTML = `
      Поиск по нику "<b>${searchNick}</b>" закончен!<br>
      Найдено <b style="color:${
        matches !== "0" ? "green" : "red"
      }">${matches}</b> боёв на страницах ${firstPage}-${lastPage}
    `;
  }
})();
