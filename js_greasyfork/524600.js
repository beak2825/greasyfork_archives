// ==UserScript==
// @name            多领国阻止血量减少
// @name:en         DuoLingo Prevent Remove Heart
// @name:vi         DuoLingo Ngăn Chặn Mất Tim
// @name:fr         DuoLingo Empêcher la Perte de Cœurs
// @name:es         DuoLingo Evitar la Pérdida de Corazones
// @name:de         DuoLingo Verhindern des Herzverlusts
// @name:it         DuoLingo Impedire la Perdita di Cuori
// @name:ja         DuoLingo ハート減少防止
// @name:ko         DuoLingo 하트 감소 방지
// @name:ru         DuoLingo Предотвращение Потери Сердец
// @namespace       https://space.bilibili.com/1569275826
// @match           *://*.duolingo.com/*
// @match           *://*.duolingo.cn/*
// @version         0.0.6
// @description     阻止 多领国 网站在学习过程中因错误减少用户的血量，通过拦截并阻止相关的“remove-heart”请求。
// @description:en  Prevent the Duolingo website from reducing the number of hearts for users during the learning process by intercepting and blocking related "remove-heart" request.
// @description:vi  Ngăn chặn trang web Duolingo giảm số lượng trái tim của người dùng trong quá trình học tập bằng cách chặn các yêu cầu "remove-heart" liên quan.
// @description:fr  Empêchez le site Web de Duolingo de réduire le nombre de cœurs des utilisateurs pendant le processus d'apprentissage en interceptant et en bloquant les requêtes "remove-heart" associées.
// @description:es  Evita que el sitio web de Duolingo reduzca la cantidad de corazones de los usuarios durante el proceso de aprendizaje al interceptar y bloquear las solicitudes "remove-heart" relacionadas.
// @description:de  Verhindern Sie, dass die Duolingo-Website die Anzahl der Herzen der Benutzer während des Lernprozesses verringert, indem Sie verwandte "remove-heart"-Anfragen abfangen und blockieren.
// @description:it  Impedisci al sito web di Duolingo di ridurre il numero di cuori degli utenti durante il processo di apprendimento intercettando e bloccando le richieste "remove-heart" correlate.
// @description:ja  Duolingoのウェブサイトが学習プロセス中にユーザーのハートを減らすのを防ぐため、"remove-heart"リクエストを傍受してブロックします。
// @description:ko  Duolingo 웹사이트가 학습 과정에서 사용자의 하트를 줄이는 것을 방지하기 위해 관련 "remove-heart" 요청을 가로채고 차단합니다.
// @description:ru  Предотвратите уменьшение количества сердец у пользователей на сайте Duolingo в процессе обучения, перехватывая и блокируя связанные запросы "remove-heart".
// @author          深海云霁
// @license         MIT
// @icon            data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/524600/%E5%A4%9A%E9%A2%86%E5%9B%BD%E9%98%BB%E6%AD%A2%E8%A1%80%E9%87%8F%E5%87%8F%E5%B0%91.user.js
// @updateURL https://update.greasyfork.org/scripts/524600/%E5%A4%9A%E9%A2%86%E5%9B%BD%E9%98%BB%E6%AD%A2%E8%A1%80%E9%87%8F%E5%87%8F%E5%B0%91.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 获取用户 UUID
  function getUUID() {
    const match = document.cookie.match(
      new RegExp("(^| )logged_out_uuid=([^;]+)")
    );
    return match ? match[2] : undefined;
  }

  // 获取用户血量 (后端)
  async function getUserHeartFromBackend() {
    const uuid = getUUID();
    const url = `/2017-06-30/users/${uuid}?fields=health&_=${Date.now()}`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  }

  // 获取用户血量 (前端)
  function getUserHeartFromFrontend() {
    const spanElement =
      document.querySelector(".xb7v_") || document.querySelector("._1ceMn");
    return spanElement?.textContent ? +spanElement.textContent : undefined;
  }

  // 检查血量是否一致
  async function checkHeartConsistency() {
    const backendHearts = await getUserHeartFromBackend();
    const frontendHearts = getUserHeartFromFrontend();

    if (
      frontendHearts !== undefined &&
      backendHearts?.health?.hearts !== frontendHearts &&
      window.confirm(
        navigator.language.toUpperCase() === "ZH-CN"
          ? "检测到血量不一致，是否刷新页面？"
          : "Detected inconsistent health, refresh the page?"
      )
    ) {
      window.location.reload();
    }
  }

  // 阻止 remove-heart 请求
  function blockRemoveHeart() {
    const originalFetch = window.fetch;

    window.fetch = function (...args) {
      const [url] = args;
      if (typeof url === "string" && url.includes("remove-heart")) {
        return Promise.resolve(new Response(null, { status: 200 }));
      }
      return originalFetch.apply(this, args);
    };
  }

  // 监听 pathname 变化
  function watchPathname() {
    const originalPushState = history.pushState;
    let isLearning = false;

    history.pushState = function (state, title, url) {
      originalPushState.apply(history, arguments);

      if (url.startsWith("/lesson")) {
        isLearning = true;
      } else if (isLearning) {
        isLearning = false;
        checkHeartConsistency();
      }
    };
  }

  // 初始化
  function init() {
    blockRemoveHeart();
    watchPathname();
  }

  init();
})();
