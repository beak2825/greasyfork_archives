// ==UserScript==
// @name         AutoProblem Clients
// @namespace    http://tampermonkey.net/
// @version      0.3.13
// @description  Automatically create problems in the panel
// @author       makeka
// @include      *://dispatcher.dostavista.ru/dispatcher/orders/view/*
// @include      *://dispatcher.dostavista.ru/dispatcher/problems/add/0/order_id*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dostavista.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520605/AutoProblem%20Clients.user.js
// @updateURL https://update.greasyfork.org/scripts/520605/AutoProblem%20Clients.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let assigneeId = parseInt(localStorage.getItem('assignee_id'));

  // Список проблем
  const problems = [
    // Для категории Dostavista
    {
      id: 390,
      name: 'Контроль/Заказ на контроле',
      category: 'Dostavista',
      assignee: 0,
      status: 10
    },
    {
      id: 334,
      name: 'Клиент отказался от оплаты ложного вызова',
      category: 'Dostavista',
      assignee: 1,
      status: 1
    },
    {
      id: 335,
      name: 'Клиент отказался от оплаты заказа',
      category: 'Dostavista',
      assignee: 1,
      status: 1
    },
    {
      id: 301,
      name: 'Курьер дезинформировал диспетчера',
      category: 'Dostavista',
      assignee: 1,
      status: 1
    },
    {
      id: 439,
      name: 'Курьер не выполнил условия заказа',
      category: 'Dostavista',
      assignee: 0,
      status: 10
    },
    {
      id: 234,
      name: 'Курьер грубил/хамил/спорил с клиентом',
      category: 'Dostavista',
      assignee: 1,
      status: 1
    },
    {
      id: 385,
      name: 'Курьер закрыл адрес, не посетив его',
      category: 'Dostavista',
      assignee: 0,
      status: 10
    },

    // Для категории Enterprise
    {
      id: 456,
      name: 'Курьер закрыл адрес, не посетив его',
      category: 'Enterprise',
      assignee: 0,
      status: 10
    },
    {
      id: 461,
      name: 'Клиент попросил отключить курьера от сервиса',
      category: 'Enterprise',
      assignee: 1,
      status: 1
    },
    {
      id: 455,
      name: 'Жалоба на поведение/внешний вид курьера',
      category: 'Enterprise',
      assignee: 1,
      status: 1
    },
    {
      id: 463,
      name: 'Курьер дезинформировал диспетчера',
      category: 'Enterprise',
      assignee: 1,
      status: 1
    },
    {
      id: 454,
      name: 'Курьер опоздал на адрес',
      category: 'Enterprise',
      assignee: 0,
      status: 10
    },
    { id: 460, name: 'Прочее', category: 'Enterprise', assignee: 0, status: 1 },

    // Для категории Особые проблемы
    {
      id: 502,
      name: 'Фиктивное прибытие на адрес',
      category: 'Особые проблемы',
      assignee: 0,
      status: 10
    },
    {
      id: 501,
      name: 'Проверка на фрод',
      category: 'Особые проблемы',
      assignee: 1,
      status: 1
    },

    // Для категории Порча/утрата отправления
    {
      id: 229,
      name: 'Курьер повредил отправление',
      category: 'Порча/утрата отправления',
      assignee: 2,
      status: 1
    },
    {
      id: 433,
      name: 'Не вернул рюкзак',
      category: 'Порча/утрата отправления',
      assignee: 2,
      status: 1
    },
    {
      id: 243,
      name: 'Курьер утратил отправление',
      category: 'Порча/утрата отправления',
      assignee: 2,
      status: 1
    },
    {
      id: 259,
      name: 'Курьер пропал с отправлением',
      category: 'Порча/утрата отправления',
      assignee: 2,
      status: 1
    },
    {
      id: 346,
      name: 'Заказ забрал неустановленный курьер',
      category: 'Порча/утрата отправления',
      assignee: 2,
      status: 1
    }
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
    title.textContent = 'Проблемы и настройки';
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

    if (problemTypeInput) {
        problemTypeInput.value = problem.id;
        problemTypeInput.dispatchEvent(new Event('change'));
    } else {
        console.warn('Селект type_id не найден.');
    }

    if (commentInput) {
      commentInput.value = problem.comment || ''; // Если комментарий есть, устанавливаем его, если нет — оставляем пустым
    } else {
      console.error('Поле ввода комментария не найдено.');
    }

    if (dispatcherIdSelect) {
        let assigneeIdToSet = null;

        if (problem.assignee === 1 && !isNaN(localAssigneeId)) {
            assigneeIdToSet = localAssigneeId;
        } else if (problem.assignee === 2) {
            assigneeIdToSet = 1810087;
        }

        if (assigneeIdToSet !== null) {
            dispatcherIdSelect.value = assigneeIdToSet;
            dispatcherIdSelect.dispatchEvent(new Event('change'));
        }
    } else {
        console.warn('Селект dispatcher_id не найден.');
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
