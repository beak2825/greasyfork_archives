// ==UserScript==
// @name         Xbox-Now Enhanced Filters
// @namespace    https://jlcareglio.github.io/
// @version      3.6.1
// @description  Enhanced Xbox-Now Filters with advanced pillbox UI for a seamless and intuitive experience
// @author       Jesús Lautaro Careglio Albornoz
// @source       https://gist.githubusercontent.com/JLCareglio/1e4b0838bdf31e21ed749cfcd89a3a47/raw/01_Xbox-Now-Enhanced-Filters.user.js
// @match        *://*.xbox-now.com/*
// @license      MIT
// @compatible   firefox
// @compatible   chrome
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @compatible   brave
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xbox-now.com
// @grant        none
// @supportURL   https://gist.github.com/JLCareglio/1e4b0838bdf31e21ed749cfcd89a3a47
// @require      https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4
// @downloadURL https://update.greasyfork.org/scripts/547362/Xbox-Now%20Enhanced%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/547362/Xbox-Now%20Enhanced%20Filters.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    .collapse { visibility: visible !important; }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out;
    }
    @keyframes highlight-fade {
      from { background-color: #dcfce7; }
      to { background-color: #e5e7eb; }
    }
    .animate-highlight {
      animation: highlight-fade 1.5s ease-out forwards;
    }
  `;
  document.head.appendChild(style);

  const hideSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8/10 h-8/10"><path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" /><path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" /><path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" /></svg>';
  const showSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8/10 h-8/10"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" /></svg>';
  const filterSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8/10 h-8/10"><path fill-rule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clip-rule="evenodd" /></svg>';
  const minimizeSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-9 h-9"><path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" /></svg>';
  const cancelSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-9 h-9"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>';

  const defaultFilters = {
    includeTags: { enabled: true, tags: ["PC", "GAME PASS"] },
    excludeTags: { enabled: false, tags: [] },
    hiddenGames: { enabled: true, games: [] },
  };

  const processStoredFilters = () => {
    const storedFilters = localStorage.getItem("filters");
    if (!storedFilters) return defaultFilters;

    try {
      const parsed = JSON.parse(storedFilters);
      ["includeTags", "excludeTags", "hiddenGames"].forEach((key) => {
        if (parsed[key] && parsed[key].enabled !== undefined) {
          if (Array.isArray(parsed[key].tags))
            parsed[key].tags = parsed[key].tags.filter(
              (tag) => typeof tag === "string"
            );
          else if (parsed[key].games)
            parsed[key].games = parsed[key].games.filter(
              (game) => typeof game === "string"
            );
        } else parsed[key] = { ...defaultFilters[key] };
      });
      return parsed;
    } catch (e) {
      console.error("Error al procesar los filtros guardados:", e);
      return { ...defaultFilters };
    }
  };

  const filters = processStoredFilters();

  function filterGames() {
    document
      .querySelectorAll(".box-body.comparison-table-entry")
      .forEach((gameEntry) => {
        const storeButton = gameEntry.querySelector("a.btn");
        if (!storeButton) return;

        const labels = gameEntry.querySelectorAll(".label");
        const hasTags = (tags) =>
          Array.from(labels).some((label) =>
            tags.some((tag) =>
              label.textContent.toUpperCase().includes(tag.toUpperCase())
            )
          );

        const isIncluded =
          !filters.includeTags.enabled ||
          filters.includeTags.tags.length === 0 ||
          hasTags(filters.includeTags.tags);

        const isExcluded =
          filters.excludeTags.enabled &&
          filters.excludeTags.tags.length > 0 &&
          hasTags(filters.excludeTags.tags);

        const isHidden =
          filters.hiddenGames.enabled &&
          filters.hiddenGames.games.includes(storeButton.title);

        const shouldBeVisible = isIncluded && !isExcluded && !isHidden;
        gameEntry.style.display = shouldBeVisible ? "" : "none";
      });
  }

  document
    .querySelectorAll(".box-body.comparison-table-entry")
    .forEach((gameEntry) => {
      const storeButton = gameEntry.querySelector("a.btn");
      const btnHide = document.createElement("button");
      const btnConfig = document.createElement("button");
      const btnContainer = document.createElement("div");
      const gameName = storeButton.title;
      const isHidden = filters.hiddenGames.games.includes(gameName);
      btnHide.innerHTML = isHidden ? showSVG : hideSVG;
      btnHide.className =
        "flex-1 flex items-center justify-center h-full p-0 m-0 hover:bg-[#8d0040]";
      btnConfig.innerHTML = filterSVG;
      btnConfig.className =
        "flex-1 flex items-center justify-center h-full p-0 m-0 hover:bg-[#8d0040]";
      btnContainer.className =
        "text-white bg-[#a6004c] border border-[#8d0040] mt-2 flex h-[34px] w-full overflow-hidden [&>button:not(:last-child)]:border-r [&>button:not(:last-child)]:border-r-white";
      btnContainer.appendChild(btnHide);
      btnContainer.appendChild(btnConfig);
      storeButton.parentNode.appendChild(btnContainer);

      btnHide.addEventListener("click", () => {
        const gameName = storeButton.title;
        const gameIndex = filters.hiddenGames.games.indexOf(gameName);

        if (gameIndex > -1) {
          filters.hiddenGames.games.splice(gameIndex, 1);
          btnHide.innerHTML = hideSVG;
        } else {
          filters.hiddenGames.games.push(gameName);
          btnHide.innerHTML = showSVG;
        }

        localStorage.setItem("filters", JSON.stringify(filters));

        const hiddenGamesTextarea =
          document.getElementById("hiddenGames-values");
        if (hiddenGamesTextarea) {
          hiddenGamesTextarea.value = filters.hiddenGames.games
            .map(escapeCommas)
            .join(",");
          hiddenGamesTextarea.dispatchEvent(new CustomEvent("renderpills"));
        }

        filterGames();
      });

      btnConfig.addEventListener("click", () => {
        const modal = document.getElementById("medium-modal");
        modal.classList.remove("hidden");
      });
    });

  function createFilterSection(id, title, description, placeholder) {
    const values = filters[id].tags || filters[id].games || [];
    const textareaValue = Array.isArray(values) ? values.join(", ") : "";

    return `
      <div class="bg-white rounded-xl shadow-sm p-4 border border-slate-200/80">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 cursor-pointer" onclick="document.getElementById('${id}-enabled').click()">
            <h4 class="text-base font-semibold text-slate-800">${title}</h4>
          </div>
          <label class="relative inline-flex items-center cursor-pointer mb-0!">
            <input type="checkbox" id="${id}-enabled" class="sr-only peer" ${
      filters[id].enabled ? "checked" : ""
    }>
            <div class="w-15 h-9 bg-slate-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#a6004c]/30 peer-checked:after:translate-x-5.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.3px] after:left-[2.3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-[#a6004c]"></div>
          </label>
        </div>
        <p class="text-sm text-slate-500 mt-1 mb-3 font-normal">${description}</p>
        
        <div id="${id}-pills-container" class="w-full p-2.5 border border-slate-300 rounded-lg min-h-24 text-sm bg-slate-50 focus-within:ring-2 focus-within:ring-[#a6004c]/50 focus-within:border-[#a6004c] transition flex flex-wrap gap-2 items-start content-start overflow-y-auto">
          <!-- Pills will be generated here -->
        </div>

        <textarea 
          id="${id}-values" 
          class="w-full p-2.5 border border-slate-300 rounded-lg h-24 text-sm bg-slate-50 focus:ring-2 focus:ring-[#a6004c]/50 focus:border-[#a6004c] transition hidden"
          placeholder="${placeholder}"
        >${textareaValue}</textarea>
      </div>
    `;
  }

  function initializePillInputs() {
    ["includeTags", "excludeTags", "hiddenGames"].forEach((id) => {
      const pillsContainer = document.getElementById(`${id}-pills-container`);
      const textarea = document.getElementById(`${id}-values`);
      let isEditing = false;
      let lastAdded = [];
      let renderPills;

      const toTextareaView = () => {
        if (isEditing) return;
        pillsContainer.classList.add("hidden");
        textarea.classList.remove("hidden");
        if (
          textarea.value.trim().length > 0 &&
          !textarea.value.trim().endsWith(",")
        )
          textarea.value += ", ";

        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
      };

      const createPill = (value) => {
        const pill = document.createElement("span");
        pill.className =
          "inline-flex items-center bg-slate-200 text-slate-800 text-sm font-medium rounded-full overflow-hidden animate-fade-in";
        pill.onclick = (e) => e.stopPropagation();

        if (lastAdded.includes(value)) pill.classList.add("animate-highlight");

        const pillText = document.createElement("span");
        pillText.textContent = value;
        pillText.className =
          "cursor-pointer pl-2.5 pr-2 py-1 hover:bg-slate-300/60 transition-colors";
        pillText.onclick = (e) => {
          e.stopPropagation();
          editPill(pill);
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className =
          "px-1.5 py-1 border-l border-slate-400/20 text-slate-500 hover:text-[#a6004c] hover:bg-slate-300/60 transition-colors self-stretch flex items-center";
        deleteBtn.innerHTML = cancelSVG.replace("w-9 h-9", "w-4 h-4");
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          const currentValues = textarea.value.split(",").map((v) => v.trim());
          const index = currentValues.indexOf(value);
          if (index > -1) {
            currentValues.splice(index, 1);
            textarea.value = currentValues.join(", ");
          }
          renderPills();
        };

        pill.appendChild(pillText);
        pill.appendChild(deleteBtn);
        return pill;
      };

      const editPill = (pill) => {
        isEditing = true;
        const pillText = pill.querySelector("span");
        const deleteBtn = pill.querySelector("button");
        const currentValue = pillText.textContent;

        const input = document.createElement("input");
        input.type = "text";
        input.value = currentValue;
        input.className =
          "bg-transparent focus:outline-none w-auto py-1 pl-2.5 pr-2";
        input.style.width = `${currentValue.length + 3}ch`;
        input.onclick = (e) => e.stopPropagation();

        pillText.classList.add("hidden");
        deleteBtn.classList.add("hidden");
        pill.insertBefore(input, deleteBtn);

        input.focus();

        const saveChanges = () => {
          isEditing = false;
          const newValue = input.value.trim().toUpperCase();
          const currentValues = textarea.value.split(",").map((v) => v.trim());
          const index = currentValues.indexOf(currentValue);

          if (newValue && newValue !== currentValue) {
            if (index > -1) {
              currentValues[index] = newValue;
              textarea.value = currentValues.join(", ");
            }
          } else if (!newValue) {
            if (index > -1) {
              currentValues.splice(index, 1);
              textarea.value = currentValues.join(", ");
            }
          }
          renderPills();
        };

        input.onblur = saveChanges;
        input.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            saveChanges();
          } else if (e.key === "Escape") {
            e.preventDefault();
            renderPills();
            isEditing = false;
          }
        };
      };

      const escapeCommas = (str) => str.replace(/,/g, "\\,");
      const unescapeCommas = (str) => str.replace(/\\,/g, ",");
      const splitByUnescapedCommas = (str) => {
        return str
          .split(/(?<!\\),/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
          .map((s) => s.replace(/\\,/g, ","));
      };

      const addValues = (inputValue) => {
        const normalizedInput = inputValue.replace(/\s*,\s*/g, ",");
        const newValues = splitByUnescapedCommas(normalizedInput)
          .map((v) => v.trim())
          .filter((v) => v);

        if (newValues.length > 0) {
          const currentValues = textarea.value
            ? splitByUnescapedCommas(textarea.value)
            : [];

          lastAdded = newValues.filter(
            (v) => !currentValues.some((cv) => cv === v)
          );

          const combined = [...new Set([...currentValues, ...newValues])];
          textarea.value = combined.map(escapeCommas).join(",");
        }
        renderPills();
      };

      const createAddInput = () => {
        const addInput = document.createElement("input");
        addInput.type = "text";
        addInput.placeholder = "+ Add";
        addInput.className =
          "bg-transparent focus:outline-none text-sm p-1 w-20 animate-fade-in";
        addInput.onclick = (e) => e.stopPropagation();

        addInput.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addValues(addInput.value);
          }
        };

        addInput.onpaste = (e) => {
          e.preventDefault();
          const pasteData = (e.clipboardData || window.clipboardData).getData(
            "text"
          );
          addValues(pasteData);
        };

        return addInput;
      };

      renderPills = () => {
        let values = textarea.value.trim()
          ? splitByUnescapedCommas(textarea.value)
          : [];

        const uniqueValues = [...new Set(values)];
        const itemsToSort = uniqueValues.map((value) => ({
          original: value,
          normalized: value.toUpperCase(),
        }));

        itemsToSort.sort((a, b) => a.normalized.localeCompare(b.normalized));
        values = itemsToSort.map((item) => item.original);
        textarea.value = values.map(escapeCommas).join(",");

        pillsContainer.innerHTML = "";
        let firstNewPill = null;
        values.forEach((value) => {
          const pill = createPill(value);
          pillsContainer.appendChild(pill);
          if (lastAdded.some((added) => added === value) && !firstNewPill) {
            firstNewPill = pill;
          }
        });

        if (firstNewPill) firstNewPill.querySelector("span").focus();

        lastAdded = [];

        const addInput = createAddInput();
        pillsContainer.appendChild(addInput);

        textarea.classList.add("hidden");
        pillsContainer.classList.remove("hidden");
      };

      pillsContainer.addEventListener("click", toTextareaView);
      textarea.addEventListener("blur", renderPills);
      textarea.addEventListener("renderpills", renderPills);
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const beforeValues = textarea.value.trim()
            ? splitByUnescapedCommas(textarea.value).map((v) => v.trim())
            : [];

          renderPills();

          const afterValues = textarea.value.trim()
            ? splitByUnescapedCommas(textarea.value).map((v) => v.trim())
            : [];

          lastAdded = afterValues.filter((v) => !beforeValues.includes(v));
        }
      });

      renderPills();
    });
  }

  const modalHTML = `
    <div id="medium-modal" class="fixed inset-0 z-1031 hidden">
      <div class="min-h-screen w-full flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" data-modal-hide>
        <div class="w-full max-w-2xl bg-slate-100 rounded-2xl shadow-2xl flex flex-col max-h-[77vh] overflow-hidden border border-slate-200/80">
          <div class="relative p-5 border-b border-slate-200/80">
            <h3 class="text-lg font-semibold text-slate-800 text-center">Enhanced Filter Settings</h3>
            <div class="absolute top-3.5 right-3.5 flex gap-1">
              <button type="button" class="p-2 text-slate-500 hover:text-[#a6004c] transition-colors rounded-full hover:bg-slate-200/70" data-modal-hide aria-label="Minimize Filter Settings">
                ${minimizeSVG}
              </button>
              <button type="button" class="p-2 text-slate-500 hover:text-[#a6004c] transition-colors rounded-full hover:bg-slate-200/70" data-discard-filters data-modal-hide aria-label="Discard Changes">
                ${cancelSVG}
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto p-4 bg-slate-50">
            <div class="space-y-4">
              ${createFilterSection(
                "includeTags",
                "Include Games with Tags",
                "Only show games that have at least one of these tags.",
                "Examples: PC, GAME PASS, XSX Optimized, etc."
              )}
              ${createFilterSection(
                "excludeTags",
                "Exclude Games with Tags",
                "Hide games that have any of these tags.",
                "Examples: Preorder, EA, GAME PASS, etc"
              )}
              ${createFilterSection(
                "hiddenGames",
                "Hidden Games",
                "Games that will remain hidden from view.",
                "Examples: EA SPORTS, F1, NBA, etc."
              )}
            </div>
          </div>
          <div class="flex justify-center gap-3 p-4 bg-slate-100 border-t border-slate-200/80">
            <button id="cancel-filters" type="button" data-discard-filters data-modal-hide class="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-200 rounded-lg transition-colors">
              Discard
            </button>
            <button id="apply-filters" type="button" class="px-5 py-2.5 text-sm font-medium text-white! bg-[#a6004c] hover:bg-[#8d0040] focus:ring-4 focus:outline-none focus:ring-[#a6004c]/50 rounded-lg transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  initializePillInputs();

  const splitByUnescapedCommas = (str) => {
    if (!str) return [];
    return str
      .split(/(?<!\\),/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => s.replace(/\\,/g, ","));
  };

  const escapeCommas = (str) => str.replace(/,/g, "\\,");

  function restoreInitialFilters() {
    let initialFilters = JSON.parse(JSON.stringify(filters));
    ["includeTags", "excludeTags", "hiddenGames"].forEach((id) => {
      const filter = initialFilters[id];
      document.getElementById(`${id}-enabled`).checked = filter.enabled;
      const textarea = document.getElementById(`${id}-values`);
      const values = filter.tags || filter.games || [];
      textarea.value = values.map(escapeCommas).join(",");
      textarea.dispatchEvent(new CustomEvent("renderpills"));
    });
  }

  document.querySelectorAll("[data-modal-hide]").forEach((element) => {
    element.addEventListener("click", (e) => {
      if (
        e.target === element ||
        e.target.tagName === "svg" ||
        e.target.tagName === "path"
      ) {
        e.preventDefault();
        document.getElementById("medium-modal").classList.add("hidden");
      }
    });
  });

  document.querySelectorAll("[data-discard-filters]").forEach((element) => {
    element.addEventListener("click", (e) => {
      if (
        e.target === element ||
        e.target.tagName === "svg" ||
        e.target.tagName === "path"
      ) {
        e.preventDefault();
        restoreInitialFilters();
      }
    });
  });

  document.getElementById("apply-filters")?.addEventListener("click", () => {
    ["includeTags", "excludeTags", "hiddenGames"].forEach((id) => {
      const enabled = document.getElementById(`${id}-enabled`).checked;
      const textarea = document.getElementById(`${id}-values`);
      const values = splitByUnescapedCommas(textarea.value);

      filters[id] = {
        enabled,
        [id === "hiddenGames" ? "games" : "tags"]: values,
      };
    });

    localStorage.setItem("filters", JSON.stringify(filters));
    document.getElementById("medium-modal").classList.add("hidden");
    filterGames();
  });

  filterGames();

  const filterButton = document.querySelector('a[href="#filterCollapse"]');
  if (!filterButton) return;
  const originalRow = filterButton.closest(".row");
  if (!originalRow) return;
  const originalText = filterButton.querySelector("span").textContent.trim();

  const col = originalRow.querySelector(".col-md-6");
  if (col) col.classList.replace("col-md-6", "col-md-3");

  const newRow = document.createElement("div");
  newRow.className = "col-md-3 col-xs-12 input-group px-[15px]! pb-[15px]!";

  const icon = document.createElement("div");
  icon.className = "input-group-addon w-[38px]!";
  icon.innerHTML = filterSVG;
  icon.firstElementChild.setAttribute("class", "w-full h-full");

  const link = document.createElement("a");
  link.style.cssText =
    "padding-bottom: 5px; text-align: left; cursor: pointer;";
  link.className = "btn btn-white btn-block btn-flat";
  link.innerHTML = `<span>${originalText} +</span>`;
  link.addEventListener("click", () => {
    const modal = document.getElementById("medium-modal");
    ["includeTags", "excludeTags", "hiddenGames"].forEach((id) => {
      const filter = filters[id];
      const values = id === "hiddenGames" ? filter.games : filter.tags;
      const textarea = document.getElementById(`${id}-values`);
      if (textarea) {
        textarea.value = values.map(escapeCommas).join(",");
        textarea.dispatchEvent(new CustomEvent("renderpills"));
      }
    });
    modal.classList.remove("hidden");
  });

  newRow.appendChild(icon);
  newRow.appendChild(link);
  originalRow.appendChild(newRow);
})();
