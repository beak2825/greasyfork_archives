// ==UserScript==
// @name         Feasibly Use the Web
// @namespace    http://github.com/Echoinbyte/
// @version      3.0
// @description  A highly performant, beautiful, and dynamic heading navigation menu with virtualization.
// @author       Echoinbyte
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540246/Feasibly%20Use%20the%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/540246/Feasibly%20Use%20the%20Web.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- Configuration ---
  const CONFIG = {
    debounceDelay: 750,
    virtualization: {
      itemHeight: 38,
      buffer: 8,
    },
    colors: {
      menuBackground: "rgba(30, 41, 59, 0.85)",
      menuBorder: "#475569",
      menuText: "#e2e8f0",
      menuTextSecondary: "#94a3b8",
      menuHover: "rgba(51, 65, 85, 0.9)",
      menuActive: "#1e293b",
      focusOutline: "#60a5fa",
      shadow: "rgba(0, 0, 0, 0.3)",
      accent: "#60a5fa",
      scrollbar: "#475569",
      scrollbarHover: "#64748b",
    },
  };

  // --- Core Logic: Manages state, data, and page observation ---
  const CoreLogic = {
    headings: [],
    filteredHeadings: [],
    mutationObserver: null,
    scrollObserver: null,
    updateTimeout: null,
    currentUrl: window.location.href,

    init() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.run());
      } else {
        this.run();
      }
    },

    run() {
      UIManager.init(this);
      this.discoverAndUpdateHeadings();
      this.setupObservers();
      this.setupEventListeners();
    },

    discoverAndUpdateHeadings(force = false) {
      const newHeadings = this.collectHeadings();
      const hasChanged =
        force ||
        this.headings.length !== newHeadings.length ||
        JSON.stringify(this.headings.map((h) => h.id)) !==
          JSON.stringify(newHeadings.map((h) => h.id));

      if (hasChanged) {
        this.headings = newHeadings;
        this.filteredHeadings = newHeadings;
        UIManager.render(this.filteredHeadings);
        this.observeVisibleHeadings();
      }
    },

    collectHeadings() {
      const headingNodes = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const headings = [];
      const counters = [0, 0, 0, 0, 0, 0];

      headingNodes.forEach((node, index) => {
        if (!node.textContent.trim() || node.closest("#feasible-heading-nav")) {
          return;
        }

        // TODO: Add support for custom heading selectors
        if (
          !node.id ||
          document.querySelector(
            `[id="${node.id}"]:not([data-heading-processed])`
          ) !== node
        ) {
          const baseId =
            "feasible-h-" +
            (node.textContent
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, "")
              .replace(/\s+/g, "-")
              .substring(0, 50) || index);

          let finalId = baseId;
          let counter = 2;
          while (
            document.getElementById(finalId) &&
            document.getElementById(finalId) !== node
          ) {
            finalId = `${baseId}-${counter++}`;
          }
          node.id = finalId;
        }

        node.setAttribute("data-heading-processed", "true");

        const level = parseInt(node.tagName.substring(1));

        // TODO: Add support for nested numbering schemes
        for (let i = 0; i < level - 1; i++) {
          if (counters[i] === 0) {
            counters[i] = 1;
          }
        }

        counters[level - 1]++;

        for (let i = level; i < 6; i++) {
          counters[i] = 0;
        }

        const numberLabel = counters
          .slice(0, level)
          .filter((c) => c > 0)
          .join(".");

        headings.push({
          id: node.id,
          text: node.textContent.trim(),
          level: level,
          number: numberLabel,
          element: node,
        });
      });
      return headings;
    },

    setupObservers() {
      this.mutationObserver = new MutationObserver(() => this.scheduleUpdate());
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    },

    observeVisibleHeadings() {
      if (this.scrollObserver) this.scrollObserver.disconnect();
      if (this.headings.length === 0) return;

      this.scrollObserver = new IntersectionObserver(
        (entries) => {
          // Find the most relevant heading to highlight
          let topMostEntry = null;
          let topMostPosition = Infinity;

          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const rect = entry.boundingClientRect;
              // Prioritize headings that are closer to the top of the viewport
              if (rect.top < topMostPosition && rect.top >= 0) {
                topMostPosition = rect.top;
                topMostEntry = entry;
              }
            }
          });

          // Only update the active link if we found a valid entry
          if (topMostEntry) {
            UIManager.updateActiveLink(topMostEntry.target.id);
          }
        },
        { rootMargin: "0px 0px -80% 0px", threshold: 0.1 }
      );

      this.headings.forEach((h) => this.scrollObserver.observe(h.element));
    },

    scheduleUpdate() {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(() => {
        if (window.location.href !== this.currentUrl) {
          this.currentUrl = window.location.href;
          this.discoverAndUpdateHeadings(true); // Force update on URL change
        } else {
          this.discoverAndUpdateHeadings();
        }
      }, CONFIG.debounceDelay);
    },

    setupEventListeners() {
      const schedule = () => this.scheduleUpdate();
      window.addEventListener("popstate", schedule);
      window.addEventListener("hashchange", schedule);

      // TODO: Add support for custom keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        if (e.altKey && e.key.toLowerCase() === "h") {
          e.preventDefault();
          if (UIManager.elements.nav) {
            if (
              !UIManager.isCollapsed &&
              UIManager.core.filteredHeadings.length > 0
            ) {
              UIManager.elements.list.focus();
              UIManager.virtualScroll.focusedIndex = 0;
              UIManager.ensureIndexIsVisible(0);
              UIManager.updateVirtualScroll();
            } else {
              UIManager.elements.nav.focus();
            }
          }
        }

        if (e.altKey && e.key.toLowerCase() === "n") {
          e.preventDefault();
          if (UIManager.elements.filterInput && !UIManager.isCollapsed) {
            UIManager.elements.filterInput.focus();
          }
        }

        if (e.altKey && e.key.toLowerCase() === "t") {
          e.preventDefault();
          if (UIManager.elements.toggleBtn) {
            UIManager.elements.toggleBtn.click();
          }
        }
      });

      const originalPushState = history.pushState;
      history.pushState = function (...args) {
        originalPushState.apply(history, args);
        schedule();
      };
      const originalReplaceState = history.replaceState;
      history.replaceState = function (...args) {
        originalReplaceState.apply(history, args);
        schedule();
      };
    },

    filterHeadings(query) {
      const lowerQuery = query.toLowerCase();
      this.filteredHeadings = this.headings.filter((h) =>
        h.text.toLowerCase().includes(lowerQuery)
      );
      UIManager.render(this.filteredHeadings);
    },
  };

  // --- UI Manager: Manages all DOM elements and interactions ---
  const UIManager = {
    core: null,
    elements: {},
    isCollapsed: false,
    dragState: { isDragging: false, x: 0, y: 0, initialX: 0, initialY: 0 },
    virtualScroll: { scrollTop: 0, focusedIndex: -1 },

    init(coreInstance) {
      this.core = coreInstance;
      this.isCollapsed =
        localStorage.getItem("feasible-nav-collapsed") === "true";
      this.createStyles();
      this.createContainer();
      this.setupCoreEventListeners();
      this.applyInitialState();
      this.applyPersistedState();
    },

    render(headings) {
      this.virtualScroll.itemCount = headings.length;
      this.elements.listSizer.style.height = `${
        headings.length * CONFIG.virtualization.itemHeight
      }px`;
      this.updateVirtualScroll();
    },

    getStyleSheet(colors) {
      return `
        #feasible-heading-nav {
          position: fixed !important; top: 20px; right: 20px; width: 320px; max-height: 85vh;
          background: ${colors.menuBackground}; border: 1px solid ${colors.menuBorder};
          border-radius: 12px; box-shadow: 0 8px 32px ${colors.shadow};
          z-index: 999999 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow: hidden; transition: width 0.3s ease, min-width 0.3s ease; backdrop-filter: blur(10px);
          user-select: none; pointer-events: auto !important; display: flex; flex-direction: column;
          color: ${colors.menuText};
        }
        .feasible-header {
          padding: 12px 16px; border-bottom: 1px solid ${colors.menuBorder}; display: flex;
          justify-content: space-between; align-items: center; cursor: grab; flex-shrink: 0;
        }
        .feasible-title-container { display: flex; align-items: center; gap: 8px; overflow: hidden; }
        .feasible-title-icon { font-size: 20px; user-select: none; }
        .feasible-title { margin: 0; font-size: 16px; font-weight: 600; color: ${colors.menuText}; white-space: nowrap; }
        .feasible-header button {
          color: ${colors.menuTextSecondary};
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          line-height: 1;
        }
        .feasible-filter-input {
            width: calc(100% - 32px); padding: 8px 12px; margin: 8px 16px; border-radius: 6px; border: 1px solid ${colors.menuBorder};
            background-color: ${colors.menuBackground}; color: ${colors.menuText}; font-size: 13px; transition: border-color 0.2s ease;
            box-sizing: border-box; flex-shrink: 0;
        }
        .feasible-filter-input:focus { border-color: ${colors.accent}; outline: none; }
        .feasible-content { flex-grow: 1; overflow-y: auto; scroll-behavior: smooth; position: relative; }
        .feasible-content::-webkit-scrollbar { width: 8px; }
        .feasible-content::-webkit-scrollbar-track { background: transparent; }
        .feasible-content::-webkit-scrollbar-thumb { background: ${colors.scrollbar}; border-radius: 4px; }
        .feasible-content::-webkit-scrollbar-thumb:hover { background: ${colors.scrollbarHover}; }
        .feasible-list { list-style: none; margin: 0; padding: 0; position: relative; }
        .feasible-list-item {
          position: absolute; top: 0; left: 0; width: 100%; height: ${CONFIG.virtualization.itemHeight}px;
          display: flex; align-items: center; padding: 0 16px;
          color: ${colors.menuText}; text-decoration: none;
          transition: background-color 0.2s ease, border 0.2s ease; border: 1px solid transparent;
          cursor: pointer; box-sizing: border-box;
        }
        .feasible-list-item.active { background-color: ${colors.menuActive}; font-weight: 600; }
        .feasible-list-item.focused { border-color: ${colors.focusOutline}; }
        .feasible-list-item:hover { background-color: ${colors.menuHover}; }
        .item-number {
          font-size: 11px; font-weight: bold; text-align: center; line-height: 18px;
          border-radius: 4px; margin-right: 10px; color: white; padding: 0 6px;
        }
        .item-text { flex: 1; min-width: 0; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; font-size: 13px; }
      `;
    },

    createStyles() {
      this.elements.style = document.createElement("style");
      this.elements.style.textContent = this.getStyleSheet(CONFIG.colors);
      document.head.appendChild(this.elements.style);
    },

    createContainer() {
      const nav = document.createElement("nav");
      nav.id = "feasible-heading-nav";
      nav.setAttribute("tabindex", "1"); // Make it first in tab order
      nav.setAttribute("role", "navigation");
      nav.setAttribute("aria-label", "Page headings navigation");
      this.elements.nav = nav;

      const header = this.createHeader();
      const filter = this.createFilterInput();
      const content = this.createContentArea();

      nav.appendChild(header);
      nav.appendChild(filter);
      nav.appendChild(content);
      document.body.appendChild(nav);
    },

    createHeader() {
      const header = document.createElement("div");
      header.className = "feasible-header";
      this.elements.header = header;

      const titleContainer = document.createElement("div");
      titleContainer.className = "feasible-title-container";
      titleContainer.innerHTML = `<span class="feasible-title-icon">🧭</span><h2 class="feasible-title">Feasibley Navigate</h2>`;
      this.elements.titleContainer = titleContainer;

      const toggleBtn = document.createElement("button");
      toggleBtn.setAttribute("aria-label", "Collapse navigation");
      toggleBtn.setAttribute("tabindex", "2");
      toggleBtn.setAttribute("title", "Toggle navigation (Alt+T)");
      toggleBtn.style.cssText = `background: transparent; border: none; font-size: 24px; cursor: pointer; padding: 0 4px;`;
      this.elements.toggleBtn = toggleBtn;

      header.appendChild(titleContainer);
      header.appendChild(toggleBtn);
      return header;
    },

    createFilterInput() {
      const filterInput = document.createElement("input");
      filterInput.type = "text";
      filterInput.placeholder = "Navigate to...";
      filterInput.className = "feasible-filter-input";
      filterInput.setAttribute("tabindex", "3");
      filterInput.setAttribute("aria-label", "Filter headings");
      filterInput.setAttribute("title", "Search headings (Alt+N)");
      this.elements.filterInput = filterInput;
      return filterInput;
    },

    createContentArea() {
      const content = document.createElement("div");
      content.className = "feasible-content";
      this.elements.content = content;

      const listSizer = document.createElement("div");
      listSizer.style.cssText =
        "position: relative; width: 100%; height: 0; z-index: 0;";
      this.elements.listSizer = listSizer;

      const list = document.createElement("ul");
      list.className = "feasible-list";
      list.setAttribute("role", "menu");
      list.setAttribute("tabindex", "4");
      list.setAttribute("aria-label", "Headings list");
      list.setAttribute("title", "Navigate headings (Alt+H)");
      this.elements.list = list;

      listSizer.appendChild(list);
      content.appendChild(listSizer);
      return content;
    },

    updateVirtualScroll() {
      const { content, list } = this.elements;
      const { itemHeight, buffer } = CONFIG.virtualization;
      const itemCount = this.core.filteredHeadings.length;

      const startIndex = Math.max(
        0,
        Math.floor(this.virtualScroll.scrollTop / itemHeight) - buffer
      );
      const endIndex = Math.min(
        itemCount,
        Math.ceil(
          (this.virtualScroll.scrollTop + content.clientHeight) / itemHeight
        ) + buffer
      );

      const visibleItems = this.core.filteredHeadings.slice(
        startIndex,
        endIndex
      );

      list.innerHTML = ""; // Clear for simplicity, advanced recycling is more complex

      visibleItems.forEach((heading, i) => {
        const index = startIndex + i;
        const top = index * itemHeight;
        const li = this.createListItem(heading);
        li.style.transform = `translateY(${top}px)`;

        if (index === this.virtualScroll.focusedIndex) {
          li.classList.add("focused");
          li.setAttribute("aria-selected", "true");
        } else {
          li.setAttribute("aria-selected", "false");
        }

        list.appendChild(li);
      });
    },

    createListItem(heading) {
      const li = document.createElement("li");
      li.className = "feasible-list-item";
      li.dataset.id = heading.id;
      li.setAttribute("role", "menuitem");
      li.setAttribute("tabindex", "-1");
      li.setAttribute("title", `${heading.text} (Level ${heading.level})`);

      const level = heading.level;
      const indent = (level - 1) * 15;
      li.style.paddingLeft = `${16 + indent}px`;

      const colors = [
        "#3182ce",
        "#38a169",
        "#d69e2e",
        "#e53e3e",
        "#805ad5",
        "#dd6b20",
      ];
      const color = colors[level - 1] || colors[5];

      li.innerHTML = `
            <span class="item-number" style="background-color: ${color};">${heading.number}</span>
            <span class="item-text">${heading.text}</span>
        `;
      return li;
    },

    setupCoreEventListeners() {
      // Dragging
      this.elements.header.addEventListener("mousedown", (e) => {
        if (e.target.tagName === "BUTTON") return;
        e.preventDefault();
        this.dragState.isDragging = true;
        this.dragState.initialX = e.clientX - this.dragState.x;
        this.dragState.initialY = e.clientY - this.dragState.y;
        this.elements.header.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
      });
      document.addEventListener("mousemove", (e) => {
        if (!this.dragState.isDragging) return;
        this.dragState.x = e.clientX - this.dragState.initialX;
        this.dragState.y = e.clientY - this.dragState.initialY;
        this.elements.nav.style.transform = `translate(${this.dragState.x}px, ${this.dragState.y}px)`;
      });
      document.addEventListener("mouseup", () => {
        if (this.dragState.isDragging) {
          this.dragState.isDragging = false;
          this.elements.header.style.cursor = "grab";
          document.body.style.userSelect = "";
          localStorage.setItem(
            "feasible-nav-position",
            JSON.stringify({ x: this.dragState.x, y: this.dragState.y })
          );
        }
      });

      // Collapse
      this.elements.toggleBtn.addEventListener("click", () => {
        this.isCollapsed = !this.isCollapsed;
        localStorage.setItem("feasible-nav-collapsed", this.isCollapsed);
        this.applyCollapseState();
      });

      // Main navigation keyboard controls
      this.elements.nav.addEventListener("keydown", (e) => {
        const { key } = e;

        // Handle Escape key to focus the navigation
        if (key === "Escape") {
          e.preventDefault();
          this.elements.nav.focus();
          return;
        }

        // Handle arrow keys to navigate to list when on nav
        if (key === "ArrowDown" && this.core.filteredHeadings.length > 0) {
          e.preventDefault();
          this.elements.list.focus();
          if (this.virtualScroll.focusedIndex === -1) {
            this.virtualScroll.focusedIndex = 0;
            this.ensureIndexIsVisible(0);
            this.updateVirtualScroll();
          }
          return;
        }
      });

      // Toggle button keyboard controls
      this.elements.toggleBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.elements.toggleBtn.click();
        }
      });

      // TODO: Add support for custom filter shortcuts
      this.elements.filterInput.addEventListener("keydown", (e) => {
        if (e.key === "Tab" && !e.shiftKey) {
          return;
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          this.elements.list.focus();
          if (
            this.virtualScroll.focusedIndex === -1 &&
            this.core.filteredHeadings.length > 0
          ) {
            this.virtualScroll.focusedIndex = 0;
            this.ensureIndexIsVisible(0);
            this.updateVirtualScroll();
          }
        }

        if (e.key === "Enter") {
          e.preventDefault();
          if (this.core.filteredHeadings.length > 0) {
            const firstHeading = this.core.filteredHeadings[0];
            const targetElement = document.getElementById(firstHeading.id);
            if (targetElement) {
              this.updateActiveLink(firstHeading.id);
              this.scrollToAndHighlight(targetElement);
            }
          }
        }

        if (e.key === "Escape") {
          e.preventDefault();
          this.elements.filterInput.value = "";
          this.core.filterHeadings("");
          this.elements.nav.focus();
        }
      });

      // Virtual Scroll
      this.elements.content.addEventListener(
        "scroll",
        (e) => {
          this.virtualScroll.scrollTop = e.target.scrollTop;
          requestAnimationFrame(() => this.updateVirtualScroll());
        },
        { passive: true }
      );

      // Filter
      this.elements.filterInput.addEventListener("input", (e) => {
        this.core.filterHeadings(e.target.value);
      });

      // Keyboard navigation for headings list
      this.elements.list.addEventListener("keydown", (e) => {
        const { key } = e;
        const allowedKeys = [
          "ArrowUp",
          "ArrowDown",
          "Enter",
          " ",
          "Home",
          "End",
          "PageUp",
          "PageDown",
          "Escape",
          "Tab",
        ];

        if (!allowedKeys.includes(key)) return;

        e.preventDefault();
        const count = this.core.filteredHeadings.length;
        if (count === 0) return;

        let { focusedIndex } = this.virtualScroll;

        // Initialize focused index if not set
        if (focusedIndex === -1) {
          focusedIndex = 0;
        }

        switch (key) {
          case "ArrowDown":
            focusedIndex = (focusedIndex + 1) % count;
            break;
          case "ArrowUp":
            focusedIndex = (focusedIndex - 1 + count) % count;
            break;
          case "Home":
            focusedIndex = 0;
            break;
          case "End":
            focusedIndex = count - 1;
            break;
          case "PageDown":
            focusedIndex = Math.min(count - 1, focusedIndex + 5);
            break;
          case "PageUp":
            focusedIndex = Math.max(0, focusedIndex - 5);
            break;
          case "Enter":
          case " ":
            if (focusedIndex !== -1) {
              const heading = this.core.filteredHeadings[focusedIndex];
              const targetElement = document.getElementById(heading.id);
              if (targetElement) {
                this.updateActiveLink(heading.id);
                this.scrollToAndHighlight(targetElement);
              }
            }
            return;
          case "Escape":
            this.elements.nav.focus();
            return;
          case "Tab":
            if (e.shiftKey) {
              this.elements.filterInput.focus();
            } else {
              // Allow tab to leave the navigation
              this.elements.nav.blur();
            }
            return;
        }

        this.virtualScroll.focusedIndex = focusedIndex;
        this.ensureIndexIsVisible(focusedIndex);
        this.updateVirtualScroll();
      });

      // Event Delegation for list items
      this.elements.list.addEventListener("click", (e) => {
        const item = e.target.closest(".feasible-list-item");
        if (!item) return;
        const targetId = item.dataset.id;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          // Immediately update the active link to provide instant feedback
          this.updateActiveLink(targetId);
          this.scrollToAndHighlight(targetElement);
        }
      });
    },

    scrollToAndHighlight(element) {
      const originalStyles = {
        textDecoration: element.style.textDecoration,
        textDecorationColor: element.style.textDecorationColor,
        transition: element.style.transition,
      };

      element.style.transition = "text-decoration-color 2s ease-out";
      element.style.textDecoration = `underline solid ${CONFIG.colors.accent} 2px`;

      setTimeout(() => {
        element.style.textDecorationColor = "transparent";
      }, 200);

      setTimeout(() => {
        element.style.textDecoration = originalStyles.textDecoration;
        element.style.textDecorationColor = originalStyles.textDecorationColor;
        element.style.transition = originalStyles.transition;
      }, 2200);

      element.scrollIntoView({ behavior: "auto", block: "start" });

      const observer = new IntersectionObserver(
        (entries) => {
          observer.disconnect();
          const entry = entries[0];
          if (entry.isIntersecting && entry.boundingClientRect.top < 120) {
            const offset = 140 - entry.boundingClientRect.top;
            window.scrollBy({ top: -offset, behavior: "smooth" });
          }
        },
        { rootMargin: "0px 0px -90% 0px" }
      );

      observer.observe(element);
    },

    ensureIndexIsVisible(index) {
      const { content } = this.elements;
      const { itemHeight } = CONFIG.virtualization;
      const scrollTop = this.virtualScroll.scrollTop;
      const listHeight = content.clientHeight;

      const itemTop = index * itemHeight;
      const itemBottom = itemTop + itemHeight;

      if (itemTop < scrollTop) {
        content.scrollTop = itemTop;
      } else if (itemBottom > scrollTop + listHeight) {
        content.scrollTop = itemBottom - listHeight;
      }
    },

    applyPersistedState() {
      const savedPosition = localStorage.getItem("feasible-nav-position");
      if (savedPosition) {
        try {
          const { x, y } = JSON.parse(savedPosition);
          if (typeof x === "number" && typeof y === "number") {
            this.dragState.x = x;
            this.dragState.y = y;
            this.elements.nav.style.transform = `translate(${x}px, ${y}px)`;
          }
        } catch (e) {
          console.error("FeasibleNav: Could not parse saved position.", e);
          localStorage.removeItem("feasible-nav-position");
        }
      }
    },

    applyInitialState() {
      this.applyCollapseState();
    },

    applyCollapseState() {
      const { nav, titleContainer, content, toggleBtn, filterInput } =
        this.elements;
      if (this.isCollapsed) {
        titleContainer.style.display = "none";
        content.style.display = "none";
        filterInput.style.display = "none";
        toggleBtn.innerHTML = "＋";
        nav.style.width = "auto";
        nav.style.minWidth = "48px";
      } else {
        titleContainer.style.display = "flex";
        content.style.display = "block";
        filterInput.style.display = "block";
        toggleBtn.innerHTML = "−";
        nav.style.width = "320px";
      }
    },

    updateActiveLink(id) {
      this.elements.list
        .querySelectorAll(".feasible-list-item")
        .forEach((item) => {
          item.classList.toggle("active", item.dataset.id === id);
        });
    },
  };

  CoreLogic.init();
})();
