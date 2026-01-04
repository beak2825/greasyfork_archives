// ==UserScript==
// @name         Nested Outline Headings
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds nesting functionality to outline headings, in addition to right click menu option to fold/unfold up to desired level.
// @match        *://docs.google.com/document/*
// @match        https://docs.google.com/document/d/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531424/Nested%20Outline%20Headings.user.js
// @updateURL https://update.greasyfork.org/scripts/531424/Nested%20Outline%20Headings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ----------------------------
    // Shared utility functions
    // ----------------------------

    // Returns the heading level from an outline item element.
    function getHeadingLevel(item) {
        const content = item.querySelector('.navigation-item-content');
        if (!content) return null;
        for (const cls of content.classList) {
            if (cls.startsWith('navigation-item-level-')) {
                return parseInt(cls.split('-').pop(), 10);
            }
        }
        return null;
    }

    // Returns the container that holds the headings (the updating-navigation-item-list)
    // for the currently selected chapter item (subtab).
    function getActiveHeadingsContainer() {
        // Find the chapter header that is marked as selected.
        const selectedHeader = document.querySelector('.chapter-item-label-and-buttons-container[aria-selected="true"]');
        if (selectedHeader) {
            // Locate the parent chapter item.
            const chapterItem = selectedHeader.closest('.chapter-item');
            if (chapterItem) {
                // Return its associated headings container.
                return chapterItem.querySelector('.updating-navigation-item-list');
            }
        }
        return null;
    }

    // Updates the inherited selection highlight in the outline.
    function updateInheritedSelection() {
        document.querySelectorAll('.navigation-item.inherited-selected').forEach(item => {
            item.classList.remove('inherited-selected');
        });
        const selected = document.querySelector('.navigation-item.location-indicator-highlight');
        if (!selected) return;
        if (!selected.classList.contains('folded')) return;
        const selectedLevel = getHeadingLevel(selected);
        if (selectedLevel === null) return;
        const headings = Array.from(document.querySelectorAll('.navigation-item'));
        const selectedIndex = headings.indexOf(selected);
        let parentCandidate = null;
        for (let i = selectedIndex - 1; i >= 0; i--) {
            const candidate = headings[i];
            const candidateLevel = getHeadingLevel(candidate);
            if (candidateLevel !== null && candidateLevel < selectedLevel && !candidate.classList.contains('folded')) {
                parentCandidate = candidate;
                break;
            }
        }
        if (parentCandidate) {
            parentCandidate.classList.add('inherited-selected');
        }
    }

    // (Legacy) This function still returns the container for top-level tabs.
    // It is kept here if needed for other purposes.
    function getActiveTabContainer() {
        const tabs = document.querySelectorAll('div.chapter-container[id^="chapter-container-"]');
        for (const tab of tabs) {
            const selected = tab.querySelector('.chapter-item-label-and-buttons-container[aria-selected="true"]');
            if (selected) return tab;
        }
        return null;
    }

    // ----------------------------
    // Integration: Folding function
    // ----------------------------
    // Global function to fold (collapse) the outline to a given level.
    // All headings with a level greater than or equal to targetLevel (within the active subtab's headings list)
    // will be folded.
    window.foldToLevel = function(targetLevel) {
        const headingsContainer = getActiveHeadingsContainer();
        const headings = headingsContainer ? headingsContainer.querySelectorAll('.navigation-item') : [];
        headings.forEach(item => {
            const level = getHeadingLevel(item);
            if (level === null) return;

            const toggle = item.querySelector('.custom-toggle-button');

            // If this heading is exactly one level above the target,
            // update its toggle button state only.
            if (level === targetLevel - 1) {
                if (toggle) {
                    // Mark the toggle as collapsed.
                    toggle.dataset.expanded = 'false';
                    const inner = toggle.querySelector('.chapterItemArrowContainer');
                    inner.setAttribute('aria-expanded', 'false');
                    inner.setAttribute('aria-label', 'Expand subheadings');
                    const icon = inner.querySelector('.material-symbols-outlined');
                    icon.style.display = 'inline-block';
                    icon.style.transformOrigin = 'center center';
                    icon.style.transform = 'rotate(-90deg)';
                    item.classList.add("toggle-on");
                }
                return;
            }

            // For all other headings, use the normal logic.
            const shouldExpand = level < targetLevel;
            if (shouldExpand) {
                item.classList.remove('folded');
                if (toggle) {
                    toggle.dataset.expanded = 'true';
                    const inner = toggle.querySelector('.chapterItemArrowContainer');
                    inner.setAttribute('aria-expanded', 'true');
                    inner.setAttribute('aria-label', 'Collapse subheadings');
                    const icon = inner.querySelector('.material-symbols-outlined');
                    icon.style.display = 'inline-block';
                    icon.style.transformOrigin = 'center center';
                    icon.style.transform = 'rotate(-45deg)';
                    item.classList.remove("toggle-on");
                } else {
                    item.classList.remove("toggle-on");
                }
                expandChildren(item, level);
            } else {
                item.classList.add('folded');
                if (toggle) {
                    toggle.dataset.expanded = 'false';
                    const inner = toggle.querySelector('.chapterItemArrowContainer');
                    inner.setAttribute('aria-expanded', 'false');
                    inner.setAttribute('aria-label', 'Expand subheadings');
                    const icon = inner.querySelector('.material-symbols-outlined');
                    icon.style.display = 'inline-block';
                    icon.style.transformOrigin = 'center center';
                    icon.style.transform = 'rotate(-90deg)';
                    item.classList.add("toggle-on");
                } else {
                    item.classList.remove("toggle-on");
                }
                collapseChildren(item, level);
            }
        });
        updateInheritedSelection();
    };

    // ----------------------------
    // "Show headings" menu (First Script)
    // ----------------------------
    function isCorrectMenu(menu) {
        const labels = menu.querySelectorAll('.goog-menuitem-label');
        return Array.from(labels).some(label => label.textContent.trim() === "Choose emoji");
    }

    function menuHasShowHeadings(menu) {
        const labels = menu.querySelectorAll('.goog-menuitem-label');
        return Array.from(labels).some(label => label.textContent.trim() === "Show headings");
    }

    // Dynamically update the submenu items.
    function updateSubmenu(submenu) {
        while (submenu.firstChild) {
            submenu.removeChild(submenu.firstChild);
        }
        // Use the headings only from the active subtab's headings container.
        const headingsContainer = getActiveHeadingsContainer();
        const headings = headingsContainer ? headingsContainer.querySelectorAll('.navigation-item') : [];
        let maxDisplayLevel = 0;
        headings.forEach(heading => {
            const rawLevel = getHeadingLevel(heading);
            if (rawLevel !== null) {
                const displayLevel = rawLevel + 1; // adjust to get the correct display level
                if (displayLevel > maxDisplayLevel) {
                    maxDisplayLevel = displayLevel;
                }
            }
        });
        if (maxDisplayLevel === 0) {
            const item = document.createElement('div');
            item.className = "goog-menuitem";
            item.style.userSelect = "none";
            item.style.fontStyle = "italic";
            item.style.color = "#9aa0a6";
            const contentDiv = document.createElement('div');
            contentDiv.className = "goog-menuitem-content";
            const innerDiv = document.createElement('div');
            innerDiv.textContent = "No headings";
            contentDiv.appendChild(innerDiv);
            item.appendChild(contentDiv);
            submenu.appendChild(item);
        } else {
            for (let i = 1; i <= maxDisplayLevel; i++) {
                const item = document.createElement('div');
                item.className = "goog-menuitem";
                item.setAttribute("role", "menuitem");
                item.style.userSelect = "none";

                const contentDiv = document.createElement('div');
                contentDiv.className = "goog-menuitem-content";

                const innerDiv = document.createElement('div');
                innerDiv.setAttribute("aria-label", `Level ${i}`);
                innerDiv.textContent = `Level ${i}`;

                contentDiv.appendChild(innerDiv);
                item.appendChild(contentDiv);

                item.addEventListener('mouseenter', function() {
                    item.classList.add('goog-menuitem-highlight');
                });
                item.addEventListener('mouseleave', function() {
                    item.classList.remove('goog-menuitem-highlight');
                });

                item.addEventListener('click', function(e) {
                    window.foldToLevel(i);
                    submenu.style.display = "none";
                });

                submenu.appendChild(item);
            }
        }
    }

    // Create an initially empty submenu.
    function createSubmenu() {
        const submenu = document.createElement('div');
        submenu.className = "goog-menu goog-menu-vertical docs-material shell-menu shell-tight-menu goog-menu-noaccel goog-menu-noicon";
        submenu.setAttribute("role", "menu");
        submenu.style.userSelect = "none";
        submenu.style.position = "absolute";
        submenu.style.display = "none";
        submenu.style.zIndex = 1003;
        submenu.style.background = "#fff";
        submenu.style.border = "1px solid transparent";
        submenu.style.borderRadius = "4px";
        submenu.style.boxShadow = "0 2px 6px 2px rgba(60,64,67,.15)";
        submenu.style.padding = "6px 0";
        submenu.style.fontSize = "13px";
        submenu.style.margin = "0";

        document.body.appendChild(submenu);
        return submenu;
    }

    // Create the "Show headings" menu option and attach the dynamic submenu.
    function createShowHeadingsOption() {
        const menuItem = document.createElement('div');
        menuItem.className = "goog-menuitem apps-menuitem goog-submenu";
        menuItem.setAttribute("role", "menuitem");
        menuItem.setAttribute("aria-haspopup", "true");
        menuItem.style.userSelect = "none";
        menuItem.dataset.showheadings = "true";

        const contentDiv = document.createElement('div');
        contentDiv.className = "goog-menuitem-content";
        contentDiv.style.userSelect = "none";

        const iconDiv = document.createElement('div');
        iconDiv.className = "docs-icon goog-inline-block goog-menuitem-icon";
        iconDiv.setAttribute("aria-hidden", "true");
        iconDiv.style.userSelect = "none";

        const innerIconDiv = document.createElement('div');
        innerIconDiv.className = "docs-icon-img-container docs-icon-img docs-icon-editors-ia-header-footer";
        innerIconDiv.style.userSelect = "none";
        iconDiv.appendChild(innerIconDiv);

        const labelSpan = document.createElement('span');
        labelSpan.className = "goog-menuitem-label";
        labelSpan.style.userSelect = "none";
        labelSpan.textContent = "Show headings";

        const arrowSpan = document.createElement('span');
        arrowSpan.className = "goog-submenu-arrow";
        arrowSpan.style.userSelect = "none";
        arrowSpan.textContent = "►";

        contentDiv.appendChild(iconDiv);
        contentDiv.appendChild(labelSpan);
        contentDiv.appendChild(arrowSpan);
        menuItem.appendChild(contentDiv);

        const submenu = createSubmenu();
        menuItem._submenu = submenu;

        menuItem.addEventListener('mouseenter', function() {
            menuItem.classList.add('goog-menuitem-highlight');
            updateSubmenu(submenu);
            const rect = menuItem.getBoundingClientRect();
            submenu.style.left = `${rect.right}px`;
            submenu.style.top = `${rect.top}px`;

            submenu.style.display = "block";
        });

        document.addEventListener('click', function(e) {
            if (submenu.style.display === "block" && !submenu.contains(e.target)) {
                submenu.style.display = "none";
                menuItem.classList.remove('goog-menuitem-highlight');
            }
        });

        return menuItem;
    }

    function processMenu(menu) {
        if (!isCorrectMenu(menu)) return;
        if (menuHasShowHeadings(menu)) return;

        const newMenuItem = createShowHeadingsOption();

        const firstSeparator = menu.querySelector('.apps-hoverable-menu-separator-container');
        if (firstSeparator) {
            let lastItem = null;
            let sibling = firstSeparator.nextElementSibling;
            while (sibling && !sibling.matches('.apps-hoverable-menu-separator-container')) {
                if (sibling.matches('.goog-menuitem')) {
                    lastItem = sibling;
                }
                sibling = sibling.nextElementSibling;
            }
            if (lastItem) {
                if (lastItem.nextElementSibling) {
                    menu.insertBefore(newMenuItem, lastItem.nextElementSibling);
                } else {
                    menu.appendChild(newMenuItem);
                }
            } else {
                if (firstSeparator.nextSibling) {
                    menu.insertBefore(newMenuItem, firstSeparator.nextSibling);
                } else {
                    menu.appendChild(newMenuItem);
                }
            }
        } else {
            menu.appendChild(newMenuItem);
        }

        if (!menu.dataset.showHeadingsListener) {
            menu.addEventListener('mouseenter', function(e) {
                const targetMenuItem = e.target.closest('.goog-menuitem');
                if (targetMenuItem && targetMenuItem.dataset.showheadings !== "true") {
                    newMenuItem._submenu.style.display = "none";
                    newMenuItem.classList.remove('goog-menuitem-highlight');
                }
            }, true);
            menu.dataset.showHeadingsListener = "true";
        }
    }

    const menuObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches && node.matches('.goog-menu.goog-menu-vertical.docs-material.goog-menu-noaccel')) {
                        processMenu(node);
                    } else {
                        const menus = node.querySelectorAll && node.querySelectorAll('.goog-menu.goog-menu-vertical.docs-material.goog-menu-noaccel');
                        if (menus && menus.length > 0) {
                            menus.forEach(menu => processMenu(menu));
                        }
                    }
                }
            });
        });
    });

    menuObserver.observe(document.body, {childList: true, subtree: true});

    // ----------------------------
    // Outline Sidebar Modifications (Second Script)
    // ----------------------------

    const materialLink = document.createElement('link');
    materialLink.rel = 'stylesheet';
    materialLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
    document.head.appendChild(materialLink);

    const style = document.createElement('style');
    style.textContent =
      `.custom-toggle-button {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        z-index: 3;
      }
      .custom-toggle-button .goog-flat-button {
        width: 22px !important;
        height: 22px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 50% !important;
      }
      .custom-toggle-button .material-symbols-outlined {
        color: #5f6368 !important;
      }
      .navigation-item-content-container {
        position: relative !important;
        overflow: visible !important;
        z-index: 0 !important;
      }
      .navigation-item-content {
        position: relative;
        z-index: 1;
      }
      .folded {
        opacity: 0;
        height: 0 !important;
        overflow: hidden;
        pointer-events: none;
        margin: 0 !important;
        padding: 0 !important;
      }
      .navigation-item.inherited-selected .navigation-item-content {
        color: #1967d2 !important;
        font-weight: 500 !important;
      }
      .navigation-item.inherited-selected .navigation-item-vertical-line-middle {
        background-color: #1967d2 !important;
      }
      .navigation-item.toggle-on .navigation-item-content-container::before {
        content: "";
        position: absolute !important;
        top: 50% !important;
        left: 5px !important;
        right: -5px !important;
        transform: translateY(-50%) !important;
        height: 80% !important;
        background-color: #f0f4f9 !important;
        border-radius: 5px !important;
        z-index: -1 !important;
      }
      .navigation-item-vertical-line {
        position: relative;
        z-index: 1;
      }`;
    document.head.appendChild(style);

    function stopEvent(e) {
      e.stopPropagation();
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    function createToggleButton(expanded = true) {
      const btn = document.createElement('div');
      btn.className = 'custom-toggle-button';
      btn.dataset.expanded = expanded ? 'true' : 'false';

      const inner = document.createElement('div');
      inner.className = 'goog-inline-block goog-flat-button chapterItemArrowContainer';
      inner.setAttribute('role', 'button');
      inner.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      inner.setAttribute('aria-label', expanded ? 'Collapse subheadings' : 'Expand subheadings');

      const icon = document.createElement('span');
      icon.className = 'material-symbols-outlined';
      icon.textContent = 'arrow_drop_down';
      icon.style.display = 'inline-block';
      icon.style.transition = 'transform 0.3s';
      icon.style.transformOrigin = 'center center';
      icon.style.transform = expanded ? 'rotate(-45deg)' : 'rotate(-90deg)';

      inner.appendChild(icon);
      btn.appendChild(inner);
      return btn;
    }

    function expandChildren(item, level) {
      let sibling = item.nextElementSibling;
      while (sibling) {
        const sibLevel = getHeadingLevel(sibling);
        if (sibLevel === null) {
          sibling = sibling.nextElementSibling;
          continue;
        }
        if (sibLevel <= level) break;
        if (sibLevel === level + 1) {
          sibling.classList.remove('folded');
          const childToggle = sibling.querySelector('.custom-toggle-button');
          if (childToggle && childToggle.dataset.expanded === 'true') {
            expandChildren(sibling, sibLevel);
          }
        }
        sibling = sibling.nextElementSibling;
      }
    }

    function collapseChildren(item, level) {
      let sibling = item.nextElementSibling;
      while (sibling) {
        const sibLevel = getHeadingLevel(sibling);
        if (sibLevel === null) {
          sibling = sibling.nextElementSibling;
          continue;
        }
        if (sibLevel <= level) break;
        sibling.classList.add('folded');
        sibling = sibling.nextElementSibling;
      }
    }

    // --------------------------------------------
    // New: Recursively toggle descendant headings
    // --------------------------------------------
    function simulateToggleForDescendants(parentHeading, parentOldState) {
      const parentLevel = getHeadingLevel(parentHeading);
      let sibling = parentHeading.nextElementSibling;
      while (sibling) {
          const sibLevel = getHeadingLevel(sibling);
          if (sibLevel === null) {
              sibling = sibling.nextElementSibling;
              continue;
          }
          if (sibLevel <= parentLevel) break;
          const childToggle = sibling.querySelector('.custom-toggle-button');
          if (childToggle && childToggle.dataset.expanded === parentOldState.toString()) {
              // Dispatch a normal click event (without ctrl) on the child's toggle button.
              childToggle.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: false }));
          }
          sibling = sibling.nextElementSibling;
      }
    }

    // Update addToggleButtons to operate only on headings in the active headings container.
    function addToggleButtons() {
      const headingsContainer = getActiveHeadingsContainer();
      if (!headingsContainer) return;
      const headings = headingsContainer.querySelectorAll('.navigation-item');
      headings.forEach(heading => {
        const container = heading.querySelector('.navigation-item-content-container');
        if (!container) return;
        container.style.position = 'relative';
        const level = getHeadingLevel(heading);
        if (level === null) return;

        let hasChildren = false;
        let sibling = heading.nextElementSibling;
        while (sibling) {
          const sibLevel = getHeadingLevel(sibling);
          if (sibLevel === null) {
            sibling = sibling.nextElementSibling;
            continue;
          }
          if (sibLevel > level) {
            hasChildren = true;
            break;
          } else break;
        }
        if (hasChildren && !container.querySelector('.custom-toggle-button')) {
          const toggleBtn = createToggleButton(true);
          const computedLeft = (-2 + level * 12) + "px";
          toggleBtn.style.left = computedLeft;

          container.insertBefore(toggleBtn, container.firstChild);
          ['mousedown', 'pointerdown', 'touchstart'].forEach(evt => {
            toggleBtn.addEventListener(evt, stopEvent, true);
          });
          toggleBtn.addEventListener('click', (e) => {
            stopEvent(e);
            // Store the parent heading's old toggle state.
            const parentOldState = toggleBtn.dataset.expanded === 'true';
            // Toggle the parent's state.
            toggleBtn.dataset.expanded = (!parentOldState).toString();
            const inner = toggleBtn.querySelector('.chapterItemArrowContainer');
            inner.setAttribute('aria-expanded', (!parentOldState).toString());
            inner.setAttribute('aria-label', !parentOldState ? 'Collapse subheadings' : 'Expand subheadings');
            const icon = inner.querySelector('.material-symbols-outlined');
            icon.style.display = 'inline-block';
            icon.style.transformOrigin = 'center center';
            if (!parentOldState) {
              icon.style.transform = 'rotate(-45deg)';
              heading.classList.remove("toggle-on");
              expandChildren(heading, level);
            } else {
              icon.style.transform = 'rotate(-90deg)';
              heading.classList.add("toggle-on");
              collapseChildren(heading, level);
            }
            updateInheritedSelection();
            // If ctrl key is pressed, simulate a click on all descendant toggles
            // that have the same state as the parent's old state.
            if (e.ctrlKey) {
              simulateToggleForDescendants(heading, parentOldState);
            }
          }, true);
        }
      });
    }

    // Update updateVerticalLineWidth to only update headings from the active headings container.
    function updateVerticalLineWidth() {
      const headingsContainer = getActiveHeadingsContainer();
      if (!headingsContainer) return;
      const navigationItems = headingsContainer.querySelectorAll('.navigation-item');
      navigationItems.forEach(item => {
        const verticalLine = item.querySelector('.navigation-item-vertical-line');
        if (verticalLine) {
          const width = verticalLine.offsetWidth;
          item.style.setProperty('--vertical-line-width', width + 'px');
        }
      });
    }

    function setupToggleVisibility() {
      function init() {
        const widget = document.querySelector('.outlines-widget');
        if (!widget) {
          setTimeout(init, 1000);
          return;
        }
        let hideTimer;
        widget.addEventListener('mouseenter', () => {
          if (hideTimer) clearTimeout(hideTimer);
          widget.querySelectorAll('.custom-toggle-button').forEach(btn => {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
          });
        });
        widget.addEventListener('mouseleave', () => {
          hideTimer = setTimeout(() => {
            widget.querySelectorAll('.custom-toggle-button').forEach(btn => {
              if (btn.dataset.expanded === 'true') {
                btn.style.opacity = '0';
                btn.style.pointerEvents = 'none';
              }
            });
          }, 3000);
        });
      }
      init();
    }

    let debounceTimer;
    function debounceUpdate() {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        addToggleButtons();
        updateInheritedSelection();
        updateVerticalLineWidth();
      }, 100);
    }

    const outlineObserver = new MutationObserver(debounceUpdate);
    outlineObserver.observe(document.body, { childList: true, subtree: true });

    // Initial outline setup.
    addToggleButtons();
    updateInheritedSelection();
    updateVerticalLineWidth();
    setupToggleVisibility();

    const readyObserver = new MutationObserver((mutations, obs) => {
      if (document.querySelector('#kix-outlines-widget-header-text-chaptered')) {
        obs.disconnect();
        addToggleButtons();
        updateInheritedSelection();
        updateVerticalLineWidth();
        setupToggleVisibility();
      }
    });
    readyObserver.observe(document.body, { childList: true, subtree: true });

    // ----------------------------
    // Adjust Chapter Overflow Menu Position
    // ----------------------------
    // This function continuously checks the position of the chapter overflow menu
    // and, if it is visible and its top is above the top of the navigation widget hat,
    // resets its top so that it is never displayed above the hat.
    function adjustChapterOverflowMenuPosition() {
        const menu = document.querySelector('div.chapter-overflow-menu');
        if (!menu) return;
        if (window.getComputedStyle(menu).display === 'none') return;
        const menuRect = menu.getBoundingClientRect();
        const hat = document.querySelector('.navigation-widget-hat');
        if (!hat) return;
        const hatRect = hat.getBoundingClientRect();
        if (menuRect.top < hatRect.top) {
            menu.style.top = `${hatRect.top}px`;
        }
    }
    setInterval(adjustChapterOverflowMenuPosition, 100);

})();
