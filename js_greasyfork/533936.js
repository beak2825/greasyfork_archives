// ==UserScript==
// @name         Script for Katya
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Automatically create problems for blocked
// @author       Konstantin Evseev
// @include      *://dispatcher.dostavista.ru/dispatcher/orders/view/*
// @include      *://dispatcher.dostavista.ru/dispatcher/problems/add/0/order_id*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dostavista.ru
// @grant        none
// @license      MIT
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/533936/Script%20for%20Katya.user.js
// @updateURL https://update.greasyfork.org/scripts/533936/Script%20for%20Katya.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let assigneeId = parseInt(localStorage.getItem('assignee_id'));

  // Список проблем
  const problems = [
    {
      id: 530,
      name: 'Прочее (отключение по API)',
      category: 'Monitoring',
      status: 10,
      assignee: 0,
      comment: 'Блокировка за частые отмены по API, до объяснительной'
    },
  ];
  // Проверка текущего URL для выполнения нужных действий
  const currentUrl = window.location.href;

  if (currentUrl.includes('dispatcher/orders/view')) {
    // Страница заказа — создание UI для выбора проблемы
    createProblemUI();
  } else if (currentUrl.includes('dispatcher/problems/add/0/order_id/')) {
    // Страница создания проблемы — предзаполнение данных
    prefillProblemForm();
  }

  // Функция для создания интерфейса выбора проблемы
  function createProblemUI() {
    let order_id;

    // Извлечение order_id из URL
    const match = /\d+/.exec(document.URL);
    if (match) {
      order_id = +match[0];
    } else {
      console.error('Order ID not found in URL');
      return;
    }

    let courier_id;

    // Попытка извлечь courier_id
    try {
      const courier = document.querySelector('.courier-block');
      const courier_block = courier.getElementsByTagName('div')[0];
      courier_id = courier_block.getElementsByTagName('a')[0].href;
      courier_id = +/\d+/.exec(courier_id);
    } catch (err) {
      courier_id = null;
      console.error('Courier ID extraction error:', err.message);
    }

    localStorage.setItem('courier_id', courier_id);

    const generalView = document.querySelector(
      '.heading-section > .additional > .autocomplete'
    );
    if (!generalView) return;

    // Создание интерфейса
    const container = document.createElement('div');
    container.style.cssText =
      'margin-top: 20px; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;';

    const title = document.createElement('h3');
    title.textContent = 'Блокировка курьеров по API';
    title.style.cssText = 'margin-bottom: 10px; font-size: 16px;';

    const problemSelectContainer = document.createElement('div');
    problemSelectContainer.style.cssText =
      'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;';

    const problemSelect = document.createElement('select');
    problemSelect.style.cssText =
      'width: 70%; padding: 8px; border: 1px solid #ccc; border-radius: 5px; font-size: 14px;';

    // Группируем проблемы по категориям
    const groupedOptions = problems.reduce((acc, problem) => {
      if (!acc[problem.category]) acc[problem.category] = [];
      acc[problem.category].push(problem);
      return acc;
    }, {});

    let optionsHTML = `<option value="">Выберите тип проблемы</option>`;
    for (const category in groupedOptions) {
      optionsHTML += `<optgroup label="${category}">`;
      groupedOptions[category].forEach((problem) => {
        optionsHTML += `<option value="${problem.id}">${problem.name}</option>`;
      });
      optionsHTML += `</optgroup>`;
    }

    problemSelect.innerHTML = optionsHTML;

    const settingsButton = document.createElement('button');
    settingsButton.textContent = '⚙️';
    settingsButton.style.cssText =
      'padding: 8px 12px; background: #ddd; color: black; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-left: 10px;';

    settingsButton.addEventListener('click', function () {
      const newAssigneeId = prompt('Введите ID ответственного:', assigneeId);
      if (newAssigneeId) {
        assigneeId = newAssigneeId;
        localStorage.setItem('assignee_id', assigneeId);
        alert(`Ответственный установлен на ID: ${assigneeId}`);
      }
    });

    const createProblemButton = document.createElement('button');
    createProblemButton.textContent = 'Создать';
    createProblemButton.style.cssText =
      'padding: 8px 12px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-left: 10px;';

    createProblemButton.addEventListener('click', function () {
      const selectedProblemId = problemSelect.value;
      if (!selectedProblemId) {
        alert('Выберите тип проблемы.');
        return;
      }

      const problem = problems.find((p) => p.id == selectedProblemId);
      if (!problem) {
        console.error('Не удалось найти выбранную проблему');
        return;
      }

      // Сохранение данных в LocalStorage
      localStorage.setItem(
        'selectedProblem',
        JSON.stringify({
          id: problem.id,
          name: problem.name,
          assignee: problem.assignee,
          comment: problem.comment,
          status: problem.status
        })
      );

      // Переход на страницу создания проблемы
      const returl = encodeURIComponent(
        `/dispatcher/orders/problems/${order_id}`
      ); // Кодируем строку returl

      const newUrl = `/dispatcher/problems/add/0/order_id/${order_id}/returl/${returl}`;
      window.location.href = newUrl;
    });

    problemSelectContainer.appendChild(problemSelect);
    problemSelectContainer.appendChild(settingsButton);
    problemSelectContainer.appendChild(createProblemButton);

    container.appendChild(title);
    container.appendChild(problemSelectContainer);

    generalView.appendChild(container);
  }

  // Функция для предзаполнения формы на странице создания проблемы
  function prefillProblemForm() {
    const problemData = localStorage.getItem('selectedProblem');
    if (!problemData) {
      console.warn('Нет данных о проблеме в localStorage.');
      return;
    }

    const problem = JSON.parse(problemData);
    if (!problem || typeof problem !== 'object') {
      console.error('Некорректные данные проблемы в localStorage.');
      return;
    }

    // Элементы формы
    const problemTypeInput = document.querySelector('select[name="type_id"]');
    const commentInput = document.querySelector('textarea[name="comment"]');
    const courierIdSelect = document.querySelector('#courier_id');
    const statusIdSelect = document.querySelector('#status_id');
    const dispatcherIdSelect = document.querySelector('#dispatcher_id');
    const causerIdSelect = document.querySelector(
      '#causer_id-optgroup-courier'
    );

    // Значения из localStorage
    const courierId = parseInt(localStorage.getItem('courier_id'));
    const localAssigneeId = parseInt(localStorage.getItem('assignee_id'));

    if (isNaN(courierId)) {
      console.warn('Courier ID не найден или некорректен.');
    } else {
      const courierOption = courierIdSelect.querySelector(
        `option[value='${courierId}']`
      );
      if (courierOption) {
        courierOption.setAttribute('selected', 'selected');
      } else {
        console.warn(`Опция с Courier ID ${courierId} не найдена.`);
      }
    }

    const statusOption = statusIdSelect.querySelector(
      `option[value='${problem.status}']`
    );
    if (statusOption) {
      statusOption.setAttribute('selected', 'selected');
    } else {
      console.warn(`Опция с Status ID ${problem.status} не найдена.`);
    }

    const problemTypeOption = problemTypeInput.querySelector(
      `option[value='${problem.id}']`
    );
    if (problemTypeOption) {
      problemTypeOption.setAttribute('selected', 'selected');
    } else {
      console.warn(`Опция с TypeProblem ID ${problem.id} не найдена.`);
    }

    if (commentInput) {
      commentInput.value = problem.comment || ''; // Если комментарий есть, устанавливаем его, если нет — оставляем пустым
    } else {
      console.error('Поле ввода комментария не найдено.');
    }

    if (problem.assignee === 1 && !isNaN(localAssigneeId)) {
      const assigneeOption = dispatcherIdSelect.querySelector(
        `option[value='${localAssigneeId}']`
      );
      if (assigneeOption) {
        assigneeOption.setAttribute('selected', 'selected');
      } else {
        console.warn(`Опция с Assignee ID ${localAssigneeId} не найдена.`);
      }
    } else if (problem.assignee === 2) {
      const bankProblemOption = dispatcherIdSelect.querySelector(
        `option[value='1810087']`
      );
      if (bankProblemOption) {
        bankProblemOption.setAttribute('selected', 'selected');
      } else {
        console.warn('Опция с Bank Problem ID (1810087) не найдена.');
      }
    }

    const causerOption = causerIdSelect.querySelector(
      `option[value='${courierId}']`
    );
    if (causerOption) {
      causerOption.setAttribute('selected', 'selected');
    } else {
      console.warn(`Опция с Causer ID ${courierId} не найдена.`);
    }

    // Удаление данных из localStorage
    localStorage.removeItem('selectedProblem');
    localStorage.removeItem('courier_id');
  }
})();