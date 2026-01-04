// ==UserScript==
// @name         Steam Rep4Rep - Comment to Friends
// @name:pt      Steam Rep4Rep - Comentar em Amigos
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add the ability to comment on multiple friends' profiles at once on Steam friends page. Select friends with checkboxes and post comments in bulk with customizable delay between posts.
// @description:pt Adiciona a funcionalidade de comentar em múltiplos amigos na página de amigos do Steam. Selecione amigos com checkboxes e poste comentários em lote com delay personalizável entre posts.
// @author       bernardopg
// @icon         https://store.steampowered.com/favicon.ico
// @match        https://steamcommunity.com/*/friends
// @match        https://steamcommunity.com/*/friends/
// @match        https://steamcommunity.com/id/*/friends
// @match        https://steamcommunity.com/id/*/friends/
// @match        https://steamcommunity.com/profiles/*/friends
// @match        https://steamcommunity.com/profiles/*/friends/
// @grant        none
// @license      MIT
// @homepage     https://github.com/bernardopg/steam-rep4rep
// @supportURL   https://github.com/bernardopg/steam-rep4rep/issues
// @downloadURL https://update.greasyfork.org/scripts/540752/Steam%20Rep4Rep%20-%20Comment%20to%20Friends.user.js
// @updateURL https://update.greasyfork.org/scripts/540752/Steam%20Rep4Rep%20-%20Comment%20to%20Friends.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Sistema de internacionalização
  const translations = {
    en: {
      title: "Rep4Rep - Comment to Friends",
      commentPlaceholder: "Type your comment here...",
      selectAll: "Select All",
      deselectAll: "Deselect All",
      postComments: "Post Comments",
      selectFriendsAlert: "Please select at least one friend.",
      typeCommentAlert: "Please type a comment.",
      startingProcess: "Starting comment posting...",
      processing: "Processed",
      friends: "friends",
      processComplete: "Process completed!",
      successPosted: "Comment successfully posted to",
      errorPosting: "Error posting to",
      connectionFailed: "Connection failed for",
      unknownError: "Unknown error",
    },
    pt: {
      title: "Rep4Rep - Comentar em Amigos",
      commentPlaceholder: "Digite seu comentário aqui...",
      selectAll: "Selecionar Todos",
      deselectAll: "Desmarcar Todos",
      postComments: "Postar Comentários",
      selectFriendsAlert: "Por favor, selecione pelo menos um amigo.",
      typeCommentAlert: "Por favor, digite um comentário.",
      startingProcess: "Iniciando postagem de comentários...",
      processing: "Processados",
      friends: "amigos",
      processComplete: "Processo concluído!",
      successPosted: "Comentário postado com sucesso para",
      errorPosting: "Erro ao postar para",
      connectionFailed: "Falha na conexão para",
      unknownError: "Erro desconhecido",
    },
  };

  // Detecta o idioma baseado na URL ou configuração do Steam
  function detectLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("l");

    // Mapeia idiomas do Steam para nossos códigos
    const steamLangMap = {
      brazilian: "pt",
      portuguese: "pt",
      english: "en",
    };

    // Verifica URL, HTML lang ou padrão para inglês
    const htmlLang = document.documentElement.lang;
    const detectedLang =
      steamLangMap[urlLang] ||
      steamLangMap[htmlLang] ||
      (htmlLang && htmlLang.startsWith("pt") ? "pt" : "en");

    return translations[detectedLang] || translations.en;
  }

  const t = detectLanguage();

  // Aguarda o carregamento da página
  function waitForElement(selector, callback) {
    if (document.querySelector(selector)) {
      callback();
    } else {
      setTimeout(() => waitForElement(selector, callback), 500);
    }
  }

  // Adiciona estilos CSS
  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
            .rep4rep-container {
                background: #1b2838;
                border: 1px solid #3c3c41;
                border-radius: 4px;
                padding: 15px;
                margin: 15px 0;
                color: #c6d4df;
            }

            .rep4rep-textarea {
                width: 100%;
                height: 60px;
                background: #0e1419;
                border: 1px solid #3c3c41;
                border-radius: 3px;
                color: #c6d4df;
                padding: 8px;
                font-family: Arial, sans-serif;
                font-size: 13px;
                resize: vertical;
            }

            .rep4rep-button {
                background: linear-gradient(to bottom, #75b022 5%, #588a1b 95%);
                border: 1px solid #4b8f29;
                border-radius: 2px;
                color: #d2e885;
                padding: 8px 15px;
                cursor: pointer;
                font-size: 12px;
                text-decoration: none;
                display: inline-block;
                margin: 5px 5px 0 0;
            }

            .rep4rep-button:hover {
                background: linear-gradient(to bottom, #588a1b 5%, #75b022 95%);
            }

            .rep4rep-button:disabled {
                background: #3c3c41;
                border-color: #3c3c41;
                color: #898989;
                cursor: not-allowed;
            }

            .rep4rep-checkbox {
                margin-right: 8px;
                transform: scale(1.2);
            }

            .rep4rep-friend-item {
                padding: 5px;
                margin: 2px 0;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 3px;
                cursor: pointer;
                user-select: none;
            }

            .rep4rep-friend-item:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            .rep4rep-friend-item.selected {
                background: rgba(117, 176, 34, 0.2);
                border: 1px solid #75b022;
            }

            .rep4rep-log {
                margin-top: 15px;
                padding: 10px;
                background: #0e1419;
                border-radius: 3px;
                max-height: 200px;
                overflow-y: auto;
                font-size: 12px;
            }

            .rep4rep-controls {
                margin: 10px 0;
            }

            .rep4rep-title {
                color: #75b022;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
            }
        `;
    document.head.appendChild(style);
  }

  // Cria a interface principal
  function createInterface() {
    const container = document.createElement("div");
    container.className = "rep4rep-container";
    container.innerHTML = `
            <div class="rep4rep-title">${t.title}</div>
            <textarea class="rep4rep-textarea" id="rep4rep-comment" placeholder="${t.commentPlaceholder}"></textarea>
            <div class="rep4rep-controls">
                <button class="rep4rep-button" id="rep4rep-select-all">${t.selectAll}</button>
                <button class="rep4rep-button" id="rep4rep-deselect-all">${t.deselectAll}</button>
                <button class="rep4rep-button" id="rep4rep-post-comments">${t.postComments}</button>
            </div>
            <div id="rep4rep-log" class="rep4rep-log" style="display: none;"></div>
        `;

    return container;
  }

  // Adiciona checkboxes aos amigos
  function addCheckboxesToFriends() {
    const friends = document.querySelectorAll(
      ".friend_block_v2, .selectable_friend"
    );

    friends.forEach((friend, index) => {
      if (friend.querySelector(".rep4rep-checkbox")) return; // Já foi processado

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "rep4rep-checkbox";
      checkbox.id = `rep4rep-friend-${index}`;

      // Tenta pegar o SteamID do amigo
      const steamidAttr =
        friend.getAttribute("data-steamid") ||
        friend.querySelector("[data-steamid]")?.getAttribute("data-steamid");

      if (steamidAttr) {
        checkbox.setAttribute("data-steamid", steamidAttr);

        // Adiciona o checkbox no início do elemento do amigo
        friend.style.position = "relative";
        friend.style.paddingLeft = "25px";
        checkbox.style.position = "absolute";
        checkbox.style.left = "5px";
        checkbox.style.top = "5px";
        checkbox.style.zIndex = "10";

        friend.appendChild(checkbox);

        // Adiciona evento de clique para selecionar/deselecionar
        friend.addEventListener("click", (e) => {
          if (e.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
            friend.classList.toggle("rep4rep-selected", checkbox.checked);
          }
        });

        checkbox.addEventListener("change", () => {
          friend.classList.toggle("rep4rep-selected", checkbox.checked);
        });
      }
    });
  }

  // Função principal que inicializa o script
  function initialize() {
    addStyles();

    // Procura por onde inserir a interface
    const friendsContainer =
      document.querySelector(
        ".friends_content, .profile_friends, #friends_list"
      ) || document.querySelector(".responsive_page_content");

    if (friendsContainer) {
      const interfaceElement = createInterface();
      friendsContainer.insertBefore(
        interfaceElement,
        friendsContainer.firstChild
      );

      // Adiciona checkboxes aos amigos
      addCheckboxesToFriends();

      // Observer para detectar novos amigos carregados dinamicamente
      const observer = new MutationObserver(() => {
        addCheckboxesToFriends();
      });
      observer.observe(friendsContainer, { childList: true, subtree: true });

      // Event listeners
      document
        .getElementById("rep4rep-select-all")
        .addEventListener("click", () => {
          document.querySelectorAll(".rep4rep-checkbox").forEach((cb) => {
            cb.checked = true;
            cb.closest(".friend_block_v2, .selectable_friend").classList.add(
              "rep4rep-selected"
            );
          });
        });

      document
        .getElementById("rep4rep-deselect-all")
        .addEventListener("click", () => {
          document.querySelectorAll(".rep4rep-checkbox").forEach((cb) => {
            cb.checked = false;
            cb.closest(".friend_block_v2, .selectable_friend").classList.remove(
              "rep4rep-selected"
            );
          });
        });

      document
        .getElementById("rep4rep-post-comments")
        .addEventListener("click", postComments);
    }
  }

  // Função para postar comentários
  function postComments() {
    const selectedFriends = document.querySelectorAll(
      ".rep4rep-checkbox:checked"
    );
    const comment = document.getElementById("rep4rep-comment").value.trim();
    const logDiv = document.getElementById("rep4rep-log");

    if (selectedFriends.length === 0) {
      alert(t.selectFriendsAlert);
      return;
    }

    if (!comment) {
      alert(t.typeCommentAlert);
      return;
    }

    logDiv.style.display = "block";
    logDiv.innerHTML = `<div style="color: #75b022; font-weight: bold;">${t.startingProcess}</div>`;

    const total = selectedFriends.length;
    let processed = 0;

    selectedFriends.forEach((checkbox, index) => {
      const steamID = checkbox.getAttribute("data-steamid");

      setTimeout(() => {
        fetch(
          `https://steamcommunity.com/comment/Profile/post/${steamID}/-1/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              comment: comment,
              count: "6",
              sessionid: window.g_sessionID || "",
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            processed++;
            if (data.success) {
              logDiv.innerHTML += `<br><span style="color: #75b022;">✓ ${t.successPosted} ${steamID}</span>`;
            } else {
              logDiv.innerHTML += `<br><span style="color: #d94441;">✗ ${
                t.errorPosting
              } ${steamID}: ${data.error || t.unknownError}</span>`;
            }

            logDiv.innerHTML = logDiv.innerHTML.replace(
              new RegExp(t.startingProcess + ".*"),
              `${t.processing} ${processed}/${total} ${t.friends}...`
            );

            if (processed === total) {
              logDiv.innerHTML += `<br><div style="color: #75b022; font-weight: bold; margin-top: 10px;">${t.processComplete}</div>`;
            }

            logDiv.scrollTop = logDiv.scrollHeight;
          })
          .catch((error) => {
            processed++;
            logDiv.innerHTML += `<br><span style="color: #d94441;">✗ ${t.connectionFailed} ${steamID}</span>`;
            logDiv.scrollTop = logDiv.scrollHeight;
          });
      }, index * 6000); // 6 segundos de delay entre cada post
    });
  }

  // Inicia o script quando a página estiver carregada
  waitForElement("body", initialize);
})();
