// ==UserScript==
// @name         2ch tree post fork
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  делает треды древовидными, добавляет сворачивание веток и подсветку новых
// @author       You
// @match        http://2ch.hk/*/res/*
// @match        https://2ch.hk/*/res/*
// @match        http://2ch.life/*/res/*
// @match        https://2ch.life/*/res/*
// @grant        none
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528668/2ch%20tree%20post%20fork.user.js
// @updateURL https://update.greasyfork.org/scripts/528668/2ch%20tree%20post%20fork.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.time("tree script");

  // Вспомогательные функции

  // Добавляет CSS стили
  function addStyle(css) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Получает номер поста из элемента
  function getPostNumber(postElement) {
      if (!postElement) return null;
      const id = postElement.id; // "post-123456"
      return parseInt(id.replace("post-", ""));
  }
  
  // Перемещает пост и применяет стили
  function postMove(linkPost, isNewPost = false) {
    const nodePostCurr = linkPost.parentNode.parentNode;  // Текущий пост (обертка .post)
    const postNumber = linkPost.innerText.match(/\d+/);

    if (!postNumber) return; // Если не удалось извлечь номер, выходим

    const targetPostNumber = postNumber[0];

    // Проверяем, ссылка на OP, другой тред или несуществующий пост
    if (/OP|→/.test(linkPost.innerText)) {
      return;
    }
      
    const nodePostReply = document.querySelector(`#post-${targetPostNumber}`);
    if (!nodePostReply) {
        //console.warn(`Target post #${targetPostNumber} not found.`); // отладка, если пост не найден
        return;
    }

      // Добавляем класс, помечающий что в посте есть ответы (для сворачивания)
      if (!nodePostReply.classList.contains('has-replies')) {
          nodePostReply.classList.add('has-replies');

          // Добавляем кнопку сворачивания
          const collapseButton = document.createElement('span');
          collapseButton.classList.add('collapse-button');
          collapseButton.textContent = '[-]';
          collapseButton.title = "Свернуть/Развернуть ветку";
          
          // Добавляем обработчик сворачивания/разворачивания
          collapseButton.addEventListener('click', (event) => {
              event.stopPropagation(); // Предотвращаем всплытие, чтобы клик по кнопке не выделял пост
              const replies = nodePostReply.querySelectorAll(':scope > .post'); // :scope - только непосредственные дочерние .post
              replies.forEach(reply => {
                  reply.classList.toggle('collapsed');
              });
              collapseButton.textContent = collapseButton.textContent === '[-]' ? '[+]' : '[-]'; // Меняем текст кнопки
          });

          // Вставляем кнопку сворачивания перед .post__details
          const postDetails = nodePostReply.querySelector('.post__details');
          if (postDetails) {
             postDetails.parentNode.insertBefore(collapseButton, postDetails);
          }
          
      }

    nodePostReply.append(nodePostCurr); // Перемещаем


      // Подсветка новых постов
    if (isNewPost) {
      nodePostCurr.classList.add('new-post'); // Добавляем класс для новых
        // Убираем подсветку при клике (однократно)
      nodePostCurr.addEventListener("click", () => {
        nodePostCurr.classList.remove('new-post');
        nodePostCurr.style["border-left"] = "2px dashed"; // Добавляем dashed border при клике
      }, { once: true });
    }

  }
    

  // --- Основная логика ---

  // 1. Обработка существующих постов
  const initialLinks = document.querySelectorAll(`.post__message > :nth-child(1)[data-num]`);
  initialLinks.forEach(postMove);

  // 2. Наблюдение за новыми постами
  const threadContainer = document.querySelector(".thread");

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(addedNode => {
            // Проверяем, что добавленный узел - это пост (у него есть класс .post)
          if (addedNode.classList && addedNode.classList.contains('post')) {
              const newLink = addedNode.querySelector(`.post__message > :nth-child(1)[data-num]`);
              if (newLink) {
                  postMove(newLink, true);
              }
          }

        });
      }
    });
  });

    // 3. Запускаем наблюдение
  observer.observe(threadContainer, { childList: true });


    // 4. Стили
  addStyle(`
    .post .post_type_reply {
      border-left: 2px solid white; /* Исходный цвет границы */
      margin-left: 5px; /* небольшой отступ */
       padding-left: 5px;
    }
    .new-post {
      border-left-color: yellow !important; /* Подсветка новых постов */
    }

     .post.collapsed {
        display: none;
     }
     .collapse-button{
        cursor: pointer;
        margin-right: 5px;
        color: #888; /* Серый цвет */
     }
     .has-replies{
        position: relative; /* Для позиционирования кнопки */
     }


  `);


  console.timeEnd("tree script");
})();