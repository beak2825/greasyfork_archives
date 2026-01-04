// ==UserScript==
// @name         Atak relacyjny
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Atakuje graczy na wybrany przycisk z uwzględnieniem preferenecji relacji oraz odległości
// @author       Sinisinis
// @match        https://*.margonem.pl/
// @match        https://*.margonem.com/
// @exclude      https://www.margonem.pl/
// @exclude      https://forum.margonem.pl/
// @exclude      https://pomoc.margonem.pl/
// @exclude      https://addons2.margonem.pl/
// @exclude      https://serwery.margonem.pl/
// @exclude      https://margonem.com/
// @exclude      https://forum.margonem.com/
// @exclude      https://serwery.margonem.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506084/Atak%20relacyjny.user.js
// @updateURL https://update.greasyfork.org/scripts/506084/Atak%20relacyjny.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  const showUI = true; // Ustaw na false, aby ukryć UI

  const defaultKey = "H";
  const defaultPosition = { top: "5px", left: "315px" };
  const defaultEnabled = true;
  const defaultPriorityOrder = [
    "Wróg",
    "Wróg klanu",
    "Wróg frakcji",
    "Neutralny",
    "Przyjaciel frakcji",
    "Przyjaciel klanu",
    "Klan",
    "Przyjaciel",
  ];
  const defaultEnabledRel = [
    "true",
    "true",
    "true",
    "true",
    "true",
    "true",
    "true",
    "true",
  ];

  let attackKey = localStorage.getItem("attackKey") || defaultKey;
  let menuPosition =
    JSON.parse(localStorage.getItem("menuPosition")) || defaultPosition;
  let isEnabled =
    JSON.parse(localStorage.getItem("isEnabled")) || defaultEnabled;
  let priorityOrder =
    JSON.parse(localStorage.getItem("priorityOrder")) || defaultPriorityOrder;
  let enabledRel =
    JSON.parse(localStorage.getItem("enabledRel")) || defaultEnabledRel;

  const relationMapping = {
    Neutralny: 1,
    Przyjaciel: 2,
    Wróg: 3,
    Klan: 4,
    "Przyjaciel klanu": 5,
    "Wróg klanu": 6,
    "Przyjaciel frakcji": 7,
    "Wróg frakcji": 8,
  };

  if (showUI) {
    let sizeToggle = true; // Zmienna do kontrolowania widoku (początkowo mały kwadrat)

    const createMenu = () => {
      const menu = document.createElement("div");
      menu.className = "menu";
      menu.style.cssText = `
        position: fixed; top: ${menuPosition.top}; left: ${menuPosition.left};
        background-color: #0e1015;
        color: white; border: 1px solid gray; border-radius: 7.5px;
        font-family: 'Poppins', sans-serif; z-index: 1000;
        width: fit-content;
        height: fit-content;
        overflow: hidden;
      `;

      const toggleButton = document.createElement("button");
      toggleButton.className = "toggle-button";
      toggleButton.addEventListener(
        "mouseover",
        () => (toggleButton.style.color = "#cecece")
      );
      toggleButton.addEventListener(
        "mouseout",
        () => (toggleButton.style.color = "gray")
      );
      toggleButton.addEventListener("click", () => {
        sizeToggle = !sizeToggle;
        updateMenuSize();
      });

      const menuContent = document.createElement("div");
      menuContent.id = "menuContent";
      menuContent.style.cssText = `
        text-align: center; display: flex; flex-direction: column;
        align-items: center;
        width: 100%;
        cursor: default;
      `;

      const createPriorityList = () => {
        const relations = priorityOrder || [
          "Wróg",
          "Wróg klanu",
          "Wróg frakcji",
          "Neutralny",
          "Przyjaciel frakcji",
          "Przyjaciel klanu",
          "Klan",
          "Przyjaciel",
        ];

        const relationListItems = relations
          .map(
            (priority, index) => `
            <li id="priority${index}" class="priority-item" draggable="true">
              ${priority}
            </li>
          `
          )
          .join("");

        const statusCircles = relations
          .map(
            (priority, index) => `
            <li class="status-item">
              <div class="status-circle" id="statusCircle${index}" style="background-color: ${
              enabledRel[index] === "true" ? "#4CAF50" : "#f44336"
            };"/>
            </li>
          `
          )
          .join("");

        return { relationListItems, statusCircles };
      };

      const { relationListItems, statusCircles } = createPriorityList();

      menuContent.innerHTML = `
        <div class="toggle-container">
          <label for="toggleEnable">
            Włącz/wyłącz:
            &nbsp;&nbsp;
            <span class="switch">
              <input type="checkbox" id="toggleEnable" ${
                isEnabled ? "checked" : ""
              } />
              <span class="slider"></span>
            </span>
          </label>
        </div>

        <div style="margin: 10px 0;">
          <label for="keySelect" style="margin: 0;">Klawisz ataku: &nbsp;</label>
          <input type="text" id="keySelect" value="${attackKey}" maxlength="1" />
        </div>

        <div class="priority-list-container">
          <div>
            <label for="priorityList">Kolejność priorytetów:</label>
            <ul id="priorityList">
              ${relationListItems}
            </ul>
          </div>
          <div>
            <label>Stan:</label>
            <ul>
              ${statusCircles}
            </ul>
          </div>
        </div>

        <button id="saveAll">Zapisz</button>

        <div class="footer-text">
          <p>ver. 1.1 by Sinisinis</p>
        </div>
      `;

      const style = document.createElement("style");
      style.textContent = `
        /* Główny wrapper */
        .container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        /* Switch on/off */
        .toggle-container {
            margin: 10px 0;
        }

        .toggle-container label {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 34px;
            height: 20px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #555;
            border-radius: 15px;
            transition: background-color 0.4s, transform 0.4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 12px;
            width: 12px;
            border-radius: 50%;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: transform 0.4s;
        }

        input:checked + .slider {
            background-color: #4CAF50;
        }

        input:checked + .slider:before {
            transform: translateX(14px);
        }

        input:not(:checked) + .slider {
            background-color: #f44336;
        }

        /* Powiększanie i zmniejszanie UI */
        .toggle-button {
            background-color: transparent;
            border: none;
            cursor: pointer;
            transition: color 0.3s;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .menu.small .toggle-button {
            width: 24px;
            height: 24px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAApZJREFUSImtlD9oU1EUxn/nJm1NUgOtOjhWIgX1VaRWUERMrFr/berqIHRRXERwUbFOIjqIgrgKDoKLQrS2fXQoiiC2JAVbGgcHRSyiqK9pX5J7HNpq2iQ1sb3b+d53fx/n3HufsMylT9vDXmgmZgwxq7JR0JiIxFSJAb4sB+65TjfKXSBYwfLxvwOyA84eC31AfSWPCIPmf+DT/c4Giz5eCg6gykTNAV+TsWhBeAKy9l9eVTI1BeijE4FV9aGHwOZq/MZobQFe8/gthCMLU3kD5Mv5ra2hA891ukX03AJR6Il0pjtQRspsyUcK5n1VAT/7tuxFuVMCT6SveK5zFWH7YjjCGTmY8v55TbO9bS02qK+BdX/ZXA/vS1/0XOcqyuVFW76pyInGRGoAKj8QACaHWlfbGX1SAzxTMByLxlNj88KSIwrn6lqBlj+C0LME/IVvAh3ReHqsWCwZ0ZS75aSqnBJIh/JybTqo7RaSCDf/zHwRXFVuRwLN5yU+WHKbSgK8fucTwvrZrzoUFj00be2a0L53H8rAcwhnI4n0/UpTKO2g39mpwnMguiCEurXWFkaByJz1q7V6fPX+0cFK8LIBAJ7rtKP0AU1z0supBr8r4gfbUPPMop+tmGPRRGp8KThUOOTwdHZUlCPAjzlpV9ivS4ZygRE1mvBtQ0c18LIdeK5zCdWjM7bhwCrxNxWPa/6KVgMu28Evt+0CSg/Ijgbj94b87FtRuuY7UaSqn1zxCmb7tu4uGLs7ZwL3RAsu8A1oQknK4cwM8Gqq3+lSeCzGPqg1QLwB5wuzL3U4n7OdwXrTokiiMZG6USusUoAW1cO+CSSa4iPfVwIOs2eQKaq31RUK3SsFBzAGTis6MVdPGtGhlQz4DcxdDug2R3zkAAAAAElFTkSuQmCC');
        }

        .menu:not(.small) .toggle-button {
            position: absolute;
            top: 5px;
            right: 5px;
            color: white;
            font-size: 18px;
            font-weight: bold;
        }

        /* Priority item styles */
        .priority-item {
            background-color: #13151b;
            color: #d4d4d4;
            border: 1px solid #3c3f43;
            border-radius: 7.5px;
            padding: 10px 18px;
            margin: 10px 0;
            cursor: move;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: background-color 0.3s;
        }

        /* Input bindowania */
        #keySelect {
            text-transform: uppercase;
            width: 50px;
            text-align: center;
            padding: 7.5px 0;
            border: 1px solid #3c3f43;
            border-radius: 7.5px;
            background-color: #13151b;
            color: white;
            margin: 0;
        }

        /* Wrapper listy aktywności i stanów aktywności */
        .priority-list-container {
            display: flex;
            gap: 20px;
            margin: 10px 0;
        }

        .priority-list-container ul {
            list-style-type: none;
            padding: 0;
            margin: 10px 0;
            border-radius: 7.5px;
        }

        /* Lista relacji */
        .status-item {
            background-color: #13151b;
            border: 1px solid #3c3f43;
            border-radius: 7.5px;
            padding: 10.85px 10px;
            margin: 10px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: default;
        }

        /* Lista aktywności relacji */
        .status-circle {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            cursor: pointer;
        }

        /* Button zapisywania */
        #saveAll {
            margin-bottom: 10px;
            background-color: #b38d2d;
            color: #ffffff;
            font-size: 15px;
            padding: 10px 18px;
            border-radius: 7.5px;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        /* Stopka */
        .footer-text {
            color: #515a75;
        }
        `;
      document.head.appendChild(style);

      menu.appendChild(toggleButton);
      menu.appendChild(menuContent);
      document.body.appendChild(menu);

      return { menu, menuContent };
    };

    const { menu, menuContent } = createMenu();

    const updateMenuSize = () => {
      if (sizeToggle) {
        menu.classList.add("small");
        menu.style.padding = "10px";
        menu.style.cursor = "move";
        menuContent.style.display = "none";
      } else {
        menu.classList.remove("small");
        menu.style.padding = "10px 20px";
        menuContent.style.display = "flex";
      }

      const toggleButton = document.querySelector(".toggle-button");
      if (sizeToggle) {
        toggleButton.textContent = "";
      } else {
        toggleButton.textContent = "x";
      }
    };

    updateMenuSize();

    const toggleEnable = document.getElementById("toggleEnable");
    const saveAllButton = document.getElementById("saveAll");
    const priorityList = document.getElementById("priorityList");

    toggleEnable.addEventListener("change", () => {
      isEnabled = toggleEnable.checked;
      localStorage.setItem("isEnabled", JSON.stringify(isEnabled));
    });

    saveAllButton.addEventListener(
      "mouseover",
      () => (saveAllButton.style.backgroundColor = "#c99c2b")
    );

    saveAllButton.addEventListener(
      "mouseout",
      () => (saveAllButton.style.backgroundColor = "#b38d2d")
    );

    saveAllButton.style.cursor = "pointer";

    saveAllButton.addEventListener("click", () => {
      attackKey = document.getElementById("keySelect").value.toUpperCase();
      priorityOrder = Array.from(priorityList.children).map(
        (li) => li.textContent
      );
      enabledRel = Array.from(priorityList.children).map((_, index) => {
        const statusCircle = document.getElementById(`statusCircle${index}`);
        return statusCircle.style.backgroundColor === "rgb(76, 175, 80)"
          ? "true"
          : "false";
      });

      localStorage.setItem("attackKey", attackKey);
      localStorage.setItem("priorityOrder", JSON.stringify(priorityOrder));
      localStorage.setItem("enabledRel", JSON.stringify(enabledRel));
      console.log("Ustawienia zostały zapisane.");
    });

    let draggedItem = null;

    priorityList.addEventListener("dragstart", (e) => {
      if (e.target.tagName === "LI") {
        draggedItem = e.target;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", draggedItem.innerHTML);
        draggedItem.style.opacity = "0.5";
      }
    });

    priorityList.addEventListener("dragend", (e) => {
      if (draggedItem) {
        draggedItem.style.opacity = "1";
        draggedItem = null;
      }
    });

    priorityList.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    priorityList.addEventListener("drop", (e) => {
      e.preventDefault();
      if (draggedItem && e.target && e.target.tagName === "LI") {
        const allItems = Array.from(priorityList.children);
        const draggedIndex = allItems.indexOf(draggedItem);
        const targetIndex = allItems.indexOf(e.target);

        if (draggedIndex > targetIndex) {
          priorityList.insertBefore(draggedItem, e.target);
        } else {
          priorityList.insertBefore(draggedItem, e.target.nextSibling);
        }

        priorityOrder = Array.from(priorityList.children).map(
          (li) => li.textContent
        );
        enabledRel = Array.from(priorityList.children).map((_, index) => {
          const statusCircle = document.getElementById(`statusCircle${index}`);
          return statusCircle.style.backgroundColor === "rgb(76, 175, 80)"
            ? "true"
            : "false";
        });

        localStorage.setItem("priorityOrder", JSON.stringify(priorityOrder));
        localStorage.setItem("enabledRel", JSON.stringify(enabledRel));
      }
    });

    menuContent.addEventListener("click", (e) => {
      if (e.target.classList.contains("status-circle")) {
        const index = e.target.id.replace("statusCircle", "");
        const statusCircle = document.getElementById(`statusCircle${index}`);
        if (statusCircle.style.backgroundColor === "rgb(76, 175, 80)") {
          statusCircle.style.backgroundColor = "#f44336";
        } else {
          statusCircle.style.backgroundColor = "#4CAF50";
        }
        enabledRel[index] =
          statusCircle.style.backgroundColor === "#4CAF50" ? "true" : "false";
        localStorage.setItem("enabledRel", JSON.stringify(enabledRel));
      }
    });

    let isDragging = false;
    let offsetX, offsetY;

    const onMouseDown = (e) => {
      if (!menu.contains(e.target)) return;
      if (e.target.closest("#menuContent")) return;
      isDragging = true;
      const menuRect = menu.getBoundingClientRect();
      offsetX = e.clientX - menuRect.left;
      offsetY = e.clientY - menuRect.top;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;
        menu.style.left = `${newLeft}px`;
        menu.style.top = `${newTop}px`;
      }
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        const menuRect = menu.getBoundingClientRect();
        localStorage.setItem(
          "menuPosition",
          JSON.stringify({
            top: `${menuRect.top}px`,
            left: `${menuRect.left}px`,
          })
        );
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }
    };

    document.addEventListener("mousedown", onMouseDown);

    menuContent.addEventListener("mouseover", (e) => {
      if (e.target === toggleEnable || e.target === saveAllButton) {
        menu.style.cursor = "pointer";
      } else {
        menu.style.cursor = "move";
      }
    });

    menuContent.addEventListener("mouseout", (e) => {
      if (e.target === toggleEnable || e.target === saveAllButton) {
        menu.style.cursor = "default";
      } else {
        menu.style.cursor = "move";
      }
    });
  }

  function getOwnPosition() {
    try {
      const { id, nick, x: positionX, y: positionY } = Engine.hero.d ?? {};
      return { id, nick, positionX, positionY };
    } catch (error) {
      console.error("Błąd podczas pobierania swojej pozycji:", error);
      return null;
    }
  }

  // Funkcja zwracająca listę graczy w zasięgu wzroku
  function getNearbyPlayers() {
    try {
      console.log("Pobieranie najnowszych danych graczy...");
      return Object.values(Engine.others.check()).map(({ d }) => ({
        id: d.id,
        nick: d.nick,
        relation: d.relation,
        positionX: d.x,
        positionY: d.y,
      }));
    } catch (error) {
      console.error("Błąd podczas pobierania danych graczy:", error);
      return [];
    }
  }

  const calculateDistance = (x1, y1, x2, y2) =>
    Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  // Funkcja zwracająca kolejność relacji ustawioną przez użytkownika
  function getCustomPriorityOrder() {
    return priorityOrder
      .map((relation, index) => ({
        relation: relation.trim(),
        isEnabled: enabledRel[index] === "true",
      }))
      .filter(
        ({ relation, isEnabled }) => isEnabled && relationMapping[relation]
      )
      .map(({ relation }) => relationMapping[relation]);
  }

  function attackNearestPlayerWithPriority() {
    // Pobiera naszą pozycję
    const ownPosition = getOwnPosition();
    if (!ownPosition) {
      // Jeśli nie udało się pobrać pozycji gracza, wyświetla komunikat o błędzie i kończy funkcję
      return console.log("Nie udało się pobrać twojej pozycji.");
    }

    // Pobiera listę graczy w pobliżu
    const nearbyPlayers = getNearbyPlayers();
    // Pobiera listę priorytetów relacji ustawioną przez użytkownika
    const customPriorityOrder = getCustomPriorityOrder();
    console.log("Kolejność relacji ustawiona przez użytkownika (jako numery):", customPriorityOrder);

    // Filtruje graczy znajdujących się w zasięgu 4 kratek i pasujących priorytetów relacji
    const playersInRange = nearbyPlayers
      .map((player) => ({
        ...player,
        // Oblicza odległość od gracza
        distance: calculateDistance(
          ownPosition.positionX,
          ownPosition.positionY,
          player.positionX,
          player.positionY
        ),
      }))
      .filter(
        (player) =>
          player.distance <= 4 && customPriorityOrder.includes(player.relation)
      );

    // Jeśli nie ma graczy w zasięgu, wyświetla komunikat i zakończ funkcję
    if (playersInRange.length === 0) {
      return console.log("Nie ma graczy w zasięgu 4 kratek.");
    }

    // Sortuje graczy według priorytetu relacji i odległości
    playersInRange.sort((a, b) => {
      // Porównuje priorytety relacji graczy
      const priorityA = customPriorityOrder.indexOf(a.relation);
      const priorityB = customPriorityOrder.indexOf(b.relation);

      if (priorityA !== priorityB) {
        // Jeśli priorytety są różne, sortuje według priorytetu
        return priorityA - priorityB;
      }
      // Jeśli priorytety są takie same, sortuje według odległości
      return a.distance - b.distance;
    });

    // Wybiera najlepszego gracza do zaatakowania (najwyższy priorytet i najbliższy)
    const bestPlayer = playersInRange[0];
    if (bestPlayer) {
      // Wyświetla informacje o wybranym celu
      console.log(
        `Cel wybrany: ID=${bestPlayer.id}, Nick=${bestPlayer.nick}, Relacja=${bestPlayer.relation}`
      );
      // Wywołuje funkcję do ataku wybranego celu
      _g(`fight&a=attack&id=${bestPlayer.id}`);
    } else {
      // Jeśli nie znaleziono odpowiedniego celu, wyświetla komunikat
      console.log("Nie znaleziono odpowiedniego celu do ataku.");
    }
  }

  //Funkcja sprawdzająca czy został wciśnięty klawisz ataku i jeśli tak to wywołuje skrypt
  document.addEventListener("keyup", (ev) => {
    if (
      ev.key.toUpperCase() === attackKey &&
      !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) &&
      isEnabled
    ) {
      attackNearestPlayerWithPriority();
    }
  });
})();
