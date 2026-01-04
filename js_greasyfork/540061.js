// ==UserScript==
// @name          OC Role Assistant
// @namespace     http://tampermonkey.net/
// @version       1.4.0.7
// @license       MIT
// @description   Highlights best role based off target CPR's
// @author        Cypher-[2641265], help/ideas from Renger [3125174]
// @match         https://www.torn.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant         GM_xmlhttpRequest
// @connect       pastebin.com
// @downloadURL https://update.greasyfork.org/scripts/540061/OC%20Role%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/540061/OC%20Role%20Assistant.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Configuration settings
  const CONFIG = {
    SCENARIOS_CACHE_DURATION: 2000, // 2 seconds
    NAVIGATION_CACHE_DURATION: 5000, // 5 seconds
    USER_STATE_CACHE_DURATION: 1000, // 1 second
    DEBOUNCE_DELAY: 150, // 150ms debounce
    INTERVAL_CHECK: 30000 // Check every 30 seconds
  };

  // Fallback values
  const fallbackMinCPR = { 9: 64, 8: 63, 7: 70, 6: 50, 5: 50};
  const fallbackMaxCount = { 9: 2, 8: 7, 7: 6 }; // Fallback max scenario counts

  // Will be populated from Pastebin/cache
  let maxCounts;
  
  // Priority-based data structure
  let priorityData;
  let roleToPriority = {};

  // Current user info - will be populated when needed
  let currentUser = null;

  // User role state cache - will be populated when needed
  let userRoleState = null;

  // Helper function to get max count for a level with fallback
  function getMaxCount(level) {
    if (maxCounts && maxCounts[level.toString()]) {
      return maxCounts[level.toString()];
    }
    return fallbackMaxCount[level] || 0;
  }

  // Helper function to get role data from priority structure
  function getRoleData(crimeName, roleName) {
    const key = `${crimeName}|${roleName}`;
    return roleToPriority[key] || null;
  }

  // Helper function to convert priority data to lookup table
  function buildRoleToPriorityLookup(priorities) {
    const lookup = {};
    Object.keys(priorities).forEach(priority => {
      priorities[priority].forEach(role => {
        const key = `${role.scenario}|${role.role}`;
        lookup[key] = {
          priority: parseInt(priority),
          minCPR: role.minCPR,
          level: role.level
        };
      });
    });
    return lookup;
  }

  // Helper function to get role priority and minCPR (consolidates fallback logic)
  function getRoleConfig(crimeName, roleName, level) {
    let roleData = getRoleData(crimeName, roleName);
    let minCPR, priority;

    if (roleData) {
      minCPR = roleData.minCPR;
      priority = roleData.priority;
    } else {
      // Fallback for unknown roles: use level-based minimum CPR and priority 999
      if (level === 9) {
        minCPR = fallbackMinCPR[9];
        priority = 999;
      } else if (level === 8) {
        minCPR = fallbackMinCPR[8];
        priority = 999;
      } else if (level === 7) {
        minCPR = fallbackMinCPR[7];
        priority = 999;
      } else if (level === 6) {
        minCPR = fallbackMinCPR[6] || 50;
        priority = 999;
      } else if (level === 5) {
        minCPR = fallbackMinCPR[5] || 50;
        priority = 999;
      } else {
        minCPR = 0;
        priority = 999;
      }
    }

    return { minCPR, priority };
  }

  // Cache for expensive DOM queries
  let cachedScenarios = null;
  let scenariosCacheTime = 0;

  // Function to get scenarios with caching
  function getCachedScenarios() {
    const now = Date.now();
    if (cachedScenarios && (now - scenariosCacheTime) < CONFIG.SCENARIOS_CACHE_DURATION) {
      return cachedScenarios;
    }

    cachedScenarios = document.querySelectorAll('div[class^="wrapper___"][data-oc-id]');
    scenariosCacheTime = now;
    return cachedScenarios;
  }

  // Function to get current user information
  function getCurrentUser() {
    if (currentUser) return currentUser;

    try {
      // Method 1: Try to get from torn-user hidden input (most reliable)
      const tornUserInput = document.getElementById('torn-user');
      if (tornUserInput && tornUserInput.value) {
        try {
          const userData = JSON.parse(tornUserInput.value);
          currentUser = {
            id: userData.id,
            name: userData.playername || userData.username,
            avatar: userData.avatar
          };
          return currentUser;
        } catch (parseError) {
          // Continue to fallback methods
        }
      }

      // Method 2: Try to extract from profile link in settings menu
      const profileLink = document.querySelector('.settings-menu .link a[href*="/profiles.php?XID="]');
      if (profileLink) {
        const href = profileLink.getAttribute('href');
        const xidMatch = href.match(/XID=(\d+)/);
        if (xidMatch) {
          currentUser = {
            id: xidMatch[1],
            name: null
          };
          return currentUser;
        }
      }

      // Method 3: Try to extract from avatar image src
      const avatarImg = document.querySelector('.mini-avatar-image');
      if (avatarImg) {
        const src = avatarImg.getAttribute('src');
        if (src) {
          const idMatch = src.match(/-(\d+)\.gif$/);
          if (idMatch) {
            currentUser = {
              id: idMatch[1],
              name: null
            };
            return currentUser;
          }
        }
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  // Helper function to check if a role is in active planning state
  function isRoleInPlanning(role) {
    const slotIcon = role.querySelector('.slotIcon___VVnQy');
    if (!slotIcon) return false;

    const planningDiv = slotIcon.querySelector('.planning___CjB09');
    if (!planningDiv) return false;

    const style = planningDiv.getAttribute('style');
    if (!style) return false;

    // Check if the conic-gradient does not equal 0deg
    const gradientMatch = style.match(/var\(--oc-clock-planning-bg\)\s*(\d+(?:\.\d+)?)deg/);
    if (gradientMatch) {
      const degreeValue = parseFloat(gradientMatch[1]);
      return degreeValue > 0;
    }

    return false;
  }

  // Helper function to get user's role state (cached)
  function getUserRoleState() {
    const now = Date.now();
    if (userRoleState && (now - userRoleState.lastChecked) < CONFIG.USER_STATE_CACHE_DURATION) {
      return userRoleState;
    }

    const user = getCurrentUser();
    const newState = {
      hasRole: false,
      role: null,
      isPlanning: false,
      hasMissingItems: false,
      lastChecked: now
    };

    if (!user || !user.name) {
      userRoleState = newState;
      return userRoleState;
    }

    // Find user's role
    getCachedScenarios().forEach(scenario => {
      scenario.querySelectorAll('div[class^="wrapper___Lpz_D"]').forEach(role => {
        const badge = role.querySelector('.badge___E7fuw');
        if (badge && badge.textContent.trim() === user.name) {
          newState.hasRole = true;
          newState.role = role;
          newState.isPlanning = isRoleInPlanning(role);

          // Check if role is inactive (missing items)
          const slotIcon = role.querySelector('.slotIcon___VVnQy');
          if (slotIcon) {
            // Check for inactive class (primary method)
            const hasInactiveClass = slotIcon.querySelector('.inactive___Dpqh0');

            // Check for specific missing items SVG pattern (backup method)
            const missingItemsSvg = slotIcon.querySelector('svg path[fill="#ff794c"]');
            let isMissingItemsIcon = false;

            if (missingItemsSvg) {
              const pathData = missingItemsSvg.getAttribute('d');
              // Missing items icon has this specific pattern with circle and diagonal lines
              if (pathData && pathData.includes('M5,0a5,5,0,1,0,5,5A5,5,0,0,0,5,0Z')) {
                isMissingItemsIcon = true;
              }
            }

            if (hasInactiveClass || isMissingItemsIcon) {
              newState.hasMissingItems = true;
            }
          }
        }
      });
    });

    userRoleState = newState;
    return userRoleState;
  }

  // Helper function to check if user is planning
  function isUserPlanning() {
    return getUserRoleState().isPlanning;
  }

  // Helper function to check if user has missing items
  function doesUserHaveMissingItems() {
    return getUserRoleState().hasMissingItems;
  }

  // Cache for navigation links
  let cachedNavigationLinks = null;
  let navigationCacheTime = 0;

  // Helper function to get navigation links for highlighting
  function getNavigationLinks() {
    const now = Date.now();
    if (cachedNavigationLinks && (now - navigationCacheTime) < CONFIG.NAVIGATION_CACHE_DURATION) {
      return cachedNavigationLinks;
    }

    cachedNavigationLinks = {
      // Desktop navigation links
      desktopCrimesLink: document.querySelector('a.desktopLink___SG2RU[href*="factions.php?step=your"][href*="crimes"]'),

      // Mobile navigation links
      mobileCrimesLink: document.querySelector('a.mobileLink___xTgRa[href*="factions.php?step=your"][href*="crimes"]'),

      // Fallback "My Faction" links
      myFactionLinks: Array.from(document.querySelectorAll('a.desktopLink___SG2RU, a.mobileLink___SG2RU'))
        .filter(a => a.textContent.trim().toLowerCase() === "my faction"),

      // Crimes tab link
      crimesTabLink: document.querySelector('a.ui-tabs-anchor[href="#faction-crimes"]')
    };

    navigationCacheTime = now;
    return cachedNavigationLinks;
  }

  // Helper function to apply highlighting to navigation elements
  function highlightNavigationElements(cssClass) {
    const links = getNavigationLinks();

    // Highlight primary navigation links
    if (links.desktopCrimesLink) {
      links.desktopCrimesLink.classList.add(cssClass);
    }

    if (links.mobileCrimesLink) {
      links.mobileCrimesLink.classList.add(cssClass);
    }

    // Use fallback if primary links not found
    if (!links.desktopCrimesLink && !links.mobileCrimesLink && links.myFactionLinks.length > 0) {
      links.myFactionLinks.forEach(link => link.classList.add(cssClass));
    }

    // Highlight crimes tab
    if (links.crimesTabLink) {
      links.crimesTabLink.classList.add(cssClass);
    }
  }

  function startHighlighting() {
    let hasScrolled = false;
    let highlightTimeout = null; // Debounce timeout for highlighting
    let isHighlighting = false; // Flag to prevent overlapping highlights

    // Check if we're on the recruiting tab
    function isOnRecruitingPage() {
      const buttonsContainer = document.querySelector('.buttonsContainer___aClaa');
      if (!buttonsContainer) return false;

      const recruitingButton = Array.from(buttonsContainer.querySelectorAll('.button___cwmLf'))
        .find(button => {
          const tabName = button.querySelector('.tabName___DdwH3');
          return tabName && tabName.textContent.trim().toLowerCase() === 'recruiting';
        });

      return recruitingButton && recruitingButton.classList.contains('active___ImR61');
    }

    // Inject styles once
    injectStyles();

    // Inject required CSS styles once
    function injectStyles() {
      if (!document.getElementById("oc-assistant-styles")) {
        const style = document.createElement("style");
        style.id = "oc-assistant-styles";
        style.textContent = `
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 12px 4px #00ffee; }
            50% { box-shadow: 0 0 18px 8px #00ffee; }
            100% { box-shadow: 0 0 12px 4px #00ffee; }
          }
          .pulsing-glow {
            animation: pulseGlow 1.5s infinite;
            border-radius: 8px;
          }
          .oc-highlight {
            background: #4e8c1a !important;
            color: #fff !important;
            border-radius: 4px;
            padding: 0 4px;
            transition: background 0.3s, color 0.3s;
            text-shadow: 0 1px 2px #222;
          }
          .oc-missing-items-highlight {
            background: #ff4444 !important;
            color: #fff !important;
            border-radius: 4px;
            padding: 0 4px;
            transition: background 0.3s, color 0.3s;
            text-shadow: 0 1px 2px #222;
          }
        `;
        document.head.appendChild(style);
      }
    }

    // Function to check for missing items (inactive roles for current user)
    function checkForMissingItems() {
      const user = getCurrentUser();
      if (!user || !user.name) return;

      // Check if we're on crimes page (recruiting or planning)
      const urlParams = new URLSearchParams(window.location.search);
      const step = urlParams.get('step');
      const hash = window.location.hash;
      const isCrimesPage = step === 'your' && (hash.includes('tab=crimes') || hash.includes('faction-crimes'));

      // Use helper function to check if user has missing items
      const hasMissingItems = isCrimesPage ? doesUserHaveMissingItems() : false;

      if (isCrimesPage) {
        // On OC page, update localStorage based on missing items
        if (hasMissingItems) {
          localStorage.setItem('oc_missing_items', '1');
          highlightNavigationForMissingItems();
        } else {
          localStorage.removeItem('oc_missing_items');
          removeRedHighlighting();
        }
      } else {
        // Not on OC page, use localStorage to determine highlighting
        if (localStorage.getItem('oc_missing_items') === '1') {
          highlightNavigationForMissingItems();
        } else {
          removeRedHighlighting();
        }
      }
    }

    // Function to highlight the Crimes tab and "Organized Crimes" navigation button in red
    function highlightNavigationForMissingItems() {
      highlightNavigationElements('oc-missing-items-highlight');
    }

    // Function to remove red highlighting for missing items
    function removeRedHighlighting() {
      document.querySelectorAll('.oc-missing-items-highlight')
        .forEach(el => el.classList.remove('oc-missing-items-highlight'));
    }

    // Consolidated function to find and highlight best role (checks user priorities first)
    function highlightBestRole() {
      // Prevent overlapping highlight operations
      if (isHighlighting) return false;
      isHighlighting = true;

      try {
        // Only highlight roles if we're on the recruiting page
        if (!isOnRecruitingPage()) {
          return false;
        }

        // Cache user state once at the beginning to avoid circular dependencies
        const userState = getUserRoleState();
        const userHasMissingItems = userState.hasMissingItems;
        const userIsPlanning = userState.isPlanning;

        let bestRole = null;

        // PRIORITY 1: Check if user has missing items - highlight their inactive role
        if (userHasMissingItems) {
          if (userState.role) {
            bestRole = userState.role;
          }
        }

        // PRIORITY 2: Check if user is planning - highlight their planning role
        if (!bestRole && userIsPlanning) {
          if (userState.role) {
            bestRole = userState.role;
          }
        }

        // PRIORITY 3: If user has no role issues, use scenario-based logic
        if (!bestRole) {
          bestRole = findBestScenarioRole(userHasMissingItems, userIsPlanning);
        }

        if (bestRole) {
          bestRole.classList.add("pulsing-glow");
          if (!hasScrolled) {
            bestRole.scrollIntoView({ behavior: "smooth", block: "center" });
            hasScrolled = true;
          }
          return true;
        }
        return false;
      } finally {
        isHighlighting = false;
      }
    }

    // Debounced highlight function to prevent flicker
    function debouncedHighlight() {
      if (highlightTimeout) {
        clearTimeout(highlightTimeout);
      }

      // Set a new timeout
      highlightTimeout = setTimeout(() => {
        highlightBestRole();
        highlightTimeout = null;
      }, CONFIG.DEBOUNCE_DELAY); // 150ms debounce
    }

    // Function to find best role using role priority-based logic
    function findBestScenarioRole(userHasMissingItems, userIsPlanning) {
      let bestRole = null;

      // Get all priority levels and sort them (lowest number = highest priority)
      const priorityLevels = priorityData ? Object.keys(priorityData).map(p => parseInt(p)).sort((a, b) => a - b) : [];
      
      // Go through each priority group in order
      for (const priority of priorityLevels) {
        if (bestRole) break;

        const priorityGroup = priorityData[priority.toString()];
        if (!priorityGroup) continue;

        // For this priority group, find all qualifying roles across all scenarios
        const qualifyingRoles = [];

        // Check each role definition in this priority group
        for (const roleConfig of priorityGroup) {
          const { scenario: scenarioName, role: roleName, minCPR } = roleConfig;

          // Find all scenarios that match this scenario name
          getCachedScenarios().forEach((scenario) => {
            const currentScenarioName = getCrimeName(scenario);
            if (currentScenarioName !== scenarioName) return;

            const isPaused = !!scenario.querySelector(".phase___LcbAX .paused___oWz6S");
            const noRolesFilled = hasNoRolesFilled(scenario);

            // Find the specific role in this scenario
            const roleElement = findRoleInScenario(scenario, roleName);
            if (!roleElement) return;

            // Check if role is available and get its info
            const roleInfo = extractRoleInfo(roleElement, getCurrentUser(), userHasMissingItems, userIsPlanning);
            if (!roleInfo) return;

            const { chance } = roleInfo;
            if (chance < minCPR) return; // Doesn't meet minimum CPR

            // Calculate stalling metrics for this scenario
            let stallingScore = calculateStallingScore(scenario, isPaused, noRolesFilled);

            qualifyingRoles.push({
              roleElement,
              chance,
              priority,
              minCPR,
              stallingScore,
              isPaused,
              noRolesFilled,
              scenarioName,
              roleName
            });
          });
        }

        if (qualifyingRoles.length === 0) continue;

        // Sort qualifying roles by:
        // 1. Paused scenarios first (stallingScore includes this)
        // 2. Empty scenarios second
        // 3. Closest to stalling third
        // 4. Highest CPR within the group
        qualifyingRoles.sort((a, b) => {
          // First priority: stalling score (lower = more urgent)
          if (a.stallingScore !== b.stallingScore) {
            return a.stallingScore - b.stallingScore;
          }
          // Second priority: highest CPR
          return b.chance - a.chance;
        });

        // Take the best role from this priority group
        bestRole = qualifyingRoles[0].roleElement;
        break; // Found our role, don't check lower priority groups
      }

      // FALLBACK: Level-based priorities for unknown roles (priority 999)
      if (!bestRole) {
        bestRole = findFallbackRole(userHasMissingItems, userIsPlanning);
      }

      return bestRole;
    }

    // Helper function to find a specific role in a scenario
    function findRoleInScenario(scenario, roleName) {
      const roles = scenario.querySelectorAll('div[class^="wrapper___Lpz_D"]');
      for (const role of roles) {
        const roleNameEl = role.querySelector('span[class^="title___"]');
        const currentRoleName = roleNameEl ? roleNameEl.textContent.trim() : "";
        if (currentRoleName === roleName) {
          return role;
        }
      }
      return null;
    }

    // Helper function to calculate stalling score (lower = more urgent)
    function calculateStallingScore(scenario, isPaused, noRolesFilled) {
      // Paused scenarios are highest priority
      if (isPaused) return 0;

      // Empty scenarios are second priority
      if (noRolesFilled) return 1;

      // For active scenarios, calculate time buffer
      let zeroDegCount = 0;
      const roles = scenario.querySelectorAll('div[class^="wrapper___Lpz_D"]');
      roles.forEach(role => {
        const slotIcon = role.querySelector('.slotIcon___VVnQy');
        if (
          slotIcon &&
          !slotIcon.querySelector('.planning___CjB09') &&
          !slotIcon.querySelector('.inactive___Dpqh0') &&
          slotIcon.querySelector('svg')
        ) {
          zeroDegCount++;
        }
      });

      // Get time remaining
      const clockStr = scenario.querySelector('.title___pB5FU span[aria-hidden="true"]')?.textContent.trim() || "";
      const [days, hours, minutes, seconds] = clockStr.split(':').map(Number);
      const totalSeconds = (((days * 24 + hours) * 60 + minutes) * 60) + seconds;
      const minSeconds = zeroDegCount * 24 * 60 * 60;
      const buffer = totalSeconds - minSeconds;

      // Return buffer as score (lower buffer = higher priority)
      // Add 2 to ensure active scenarios come after paused (0) and empty (1)
      return 2 + Math.max(0, buffer);
    }

    // Fallback function for unknown roles (maintains existing level-based logic)
    function findFallbackRole(userHasMissingItems, userIsPlanning) {
      let bestRole = null;

      // Helper function to search scenarios with early exit when role found
      function searchAndExit(type, priorityFilter) {
        if (bestRole) return;
        searchScenarios(type, priorityFilter);
      }

      // Level-based priorities for unknown roles (priority 999)
      // Level 9 unknown roles
      searchAndExit("paused", (role) => role.priority === 999 && role.level === 9);
      if (!bestRole && countTotalScenarios((l) => l === 9) <= getMaxCount(9)) {
        searchAndExit("empty", (role) => role.priority === 999 && role.level === 9);
      }
      searchAndExit("clock", (role) => role.priority === 999 && role.level === 9);
      searchAndExit("chance", (role) => role.priority === 999 && role.level === 9);

      // Level 8 unknown roles
      if (!bestRole) {
        searchAndExit("paused", (role) => role.priority === 999 && role.level === 8);
        if (!bestRole && countTotalScenarios((l) => l === 8) <= getMaxCount(8)) {
          searchAndExit("empty", (role) => role.priority === 999 && role.level === 8);
        }
        searchAndExit("clock", (role) => role.priority === 999 && role.level === 8);
        searchAndExit("chance", (role) => role.priority === 999 && role.level === 8);
      }

      // Level 7 unknown roles
      if (!bestRole) {
        searchAndExit("paused", (role) => role.priority === 999 && role.level === 7);
        searchAndExit("empty", (role) => role.priority === 999 && role.level === 7);
        searchAndExit("clock", (role) => role.priority === 999 && role.level === 7);
        searchAndExit("chance", (role) => role.priority === 999 && role.level === 7);
      }

      // Below Level 7 unknown roles
      if (!bestRole) {
        searchAndExit("paused", (role) => role.priority === 999 && role.level < 7);
        searchAndExit("empty", (role) => role.priority === 999 && role.level < 7);
        searchAndExit("clock", (role) => role.priority === 999 && role.level < 7);
        searchAndExit("chance", (role) => role.priority === 999 && role.level < 7);
      }

      return bestRole;

      // Helper function to search scenarios and set bestRole when found
      function searchScenarios(type, priorityFilter) {
        if (bestRole) return;

        const user = getCurrentUser(); // Get user info for role checking

        if (type === "clock") {
          let scenarios = [];
          getCachedScenarios().forEach((scenario) => {
              const isPaused = !!scenario.querySelector(".phase___LcbAX .paused___oWz6S");
              const noRolesFilled = hasNoRolesFilled(scenario);
              if (noRolesFilled || isPaused) return;

              const levelEl = scenario.querySelector('span[class^="levelValue___"]');
              if (!levelEl) return;
              const level = parseInt(levelEl.textContent.trim());

              const crimeName = getCrimeName(scenario);
              if (!crimeName) return;

              let zeroDegCount = 0;
              const roles = scenario.querySelectorAll('div[class^="wrapper___Lpz_D"]');
              roles.forEach(role => {
                const slotIcon = role.querySelector('.slotIcon___VVnQy');
                if (
                  slotIcon &&
                  !slotIcon.querySelector('.planning___CjB09') &&
                  !slotIcon.querySelector('.inactive___Dpqh0') &&
                  slotIcon.querySelector('svg')
                ) {
                  zeroDegCount++;
                }
              });

              scenarios.push({
                scenario,
                zeroDegCount,
                level,
                crimeName,
                roles
              });
            });

          if (scenarios.length === 0) return;

          let closestToStall = null;
          let minBuffer = Infinity;

          scenarios.forEach(s => {
            const clockStr = s.scenario.querySelector('.title___pB5FU span[aria-hidden="true"]')?.textContent.trim() || "";
            const [days, hours, minutes, seconds] = clockStr.split(':').map(Number);
            const totalSeconds = (((days * 24 + hours) * 60 + minutes) * 60) + seconds;
            const minSeconds = s.zeroDegCount * 24 * 60 * 60;
            const buffer = totalSeconds - minSeconds;

            if (buffer < minBuffer) {
              minBuffer = buffer;
              closestToStall = s;
            }
          });

          let chosenScenario = closestToStall;
          if (!chosenScenario) return;

          const availableRoles = [];
          chosenScenario.roles.forEach(role => {
            const roleInfo = extractRoleInfo(role, user, userHasMissingItems, userIsPlanning);
            if (!roleInfo) return;

            const { roleName, chance } = roleInfo;
            const { minCPR, priority } = getRoleConfig(chosenScenario.crimeName, roleName, chosenScenario.level);

            // Check if this role matches the priority filter
            const roleObj = { priority, level: chosenScenario.level };
            if (!priorityFilter(roleObj)) return;

            if (chance < minCPR) return;

            availableRoles.push({ role, priority, chance });
          });

          availableRoles.sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            return b.chance - a.chance;
          });

          if (availableRoles.length > 0 && !bestRole) {
            bestRole = availableRoles[0].role;
          }
          return;
        }

        // Handle non-clock scenarios
        getCachedScenarios().forEach((scenario) => {
            if (bestRole) return; // Early exit if we found a role

            const isPaused = !!scenario.querySelector(".phase___LcbAX .paused___oWz6S");
            const noRolesFilled = hasNoRolesFilled(scenario);

            if (
              (type === "paused" && !isPaused) ||
              (type === "empty" && (!noRolesFilled || isPaused)) ||
              (type === "clock" && (noRolesFilled || isPaused)) ||
              (type === "chance" && (noRolesFilled || isPaused))
            ) {
              return;
            }

            const levelEl = scenario.querySelector('span[class^="levelValue___"]');
            if (!levelEl) return;
            const level = parseInt(levelEl.textContent.trim());

            const crimeName = getCrimeName(scenario);
            if (!crimeName) return;

            const availableRoles = [];
            scenario
              .querySelectorAll('div[class^="wrapper___Lpz_D"]')
              .forEach((role) => {
                const roleInfo = extractRoleInfo(role, user, userHasMissingItems, userIsPlanning);
                if (!roleInfo) return;

                const { roleName, chance } = roleInfo;
                const { minCPR, priority } = getRoleConfig(crimeName, roleName, level);

                // Check if this role matches the priority filter
                const roleObj = { priority, level };
                if (!priorityFilter(roleObj)) return;

                if (chance < minCPR) return;
                availableRoles.push({ role, priority, chance });
              });

            availableRoles.sort((a, b) => {
              if (a.priority !== b.priority) return a.priority - b.priority;
              return b.chance - a.chance;
            });

            if (availableRoles.length > 0 && !bestRole) {
              bestRole = availableRoles[0].role;
            }
          });
      }
    }

    function highlightOCMenuIfNeeded() {
      const ocStatusIcon = Array.from(document.querySelectorAll('.status-icons___gPkXF a[aria-label]'))
        .find(a => a.getAttribute('aria-label').toLowerCase().includes('organized crime'));

      if (!ocStatusIcon) {
        highlightNavigationElements('oc-highlight');
      } else {
        document.querySelectorAll('.oc-highlight').forEach(el => el.classList.remove('oc-highlight'));
      }
    }

    highlightOCMenuIfNeeded();
    const ocMenuObserver = new MutationObserver(highlightOCMenuIfNeeded);
    ocMenuObserver.observe(document.body, { childList: true, subtree: true });

    const observer = new MutationObserver((mutations) => {
      // Only process if there are meaningful changes
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const target = mutation.target;
          if (target.classList && (target.classList.contains('pulsing-glow') ||
              target.parentElement?.classList.contains('pulsing-glow'))) {
            return;
          }

          if (target.matches && (
            target.matches('div[class^="wrapper___"]') ||
            target.closest('div[class^="wrapper___"]') ||
            target.matches('.badge___E7fuw') ||
            target.closest('.badge___E7fuw')
          )) {
            shouldUpdate = true;
          }
        }
      });

      if (!shouldUpdate) return;

      // Clear caches when DOM changes
      cachedScenarios = null;
      cachedNavigationLinks = null;

      document.querySelectorAll(".pulsing-glow")
        .forEach(el => el.classList.remove("pulsing-glow"));

      checkForMissingItems();

      if (isOnRecruitingPage()) {
        debouncedHighlight();
      }
    });

    const ocContainer =
      document.querySelector("#faction-main-container") || document.body;
    observer.observe(ocContainer, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });

    // Initial highlighting with single delay to ensure DOM is ready
    setTimeout(() => {
      if (isOnRecruitingPage()) {
        highlightBestRole();
      }
    }, 300);

    // Check for missing items immediately when script loads
    checkForMissingItems();

    const intervalId = setInterval(() => {
      if (isOnRecruitingPage()) {
        highlightBestRole();
      }

      checkForMissingItems();
    }, 30000);
  }

  // Helper function to extract role information from DOM element
  function extractRoleInfo(role, user, userHasMissingItems, userIsPlanning) {
    const badge = role.querySelector(".badge___E7fuw");
    const isOccupied = badge && badge.textContent.trim() !== user?.name;

    // If it's the user's role, check if it has missing items or is in planning
    if (badge && badge.textContent.trim() === user?.name) {
      if (userHasMissingItems || userIsPlanning) {
        return null; // Skip this role
      }
    } else if (isOccupied) {
      return null; // Skip occupied roles
    }

    const roleNameEl = role.querySelector('span[class^="title___"]');
    const roleName = roleNameEl ? roleNameEl.textContent.trim() : "";
    const chanceEl = role.querySelector('div[class^="successChance___"]');
    if (!chanceEl) return null;
    
    let chance = chanceEl.textContent.trim().replace('%', '');
    chance = parseFloat(chance);

    return { role, roleName, chance };
  }

  // Helper functions for role selection
  function getCrimeName(scenario) {
    const titleEl = scenario.querySelector('p.panelTitle___aoGuV');
    return titleEl ? titleEl.textContent.trim() : null;
  }

  function hasNoRolesFilled(scenario) {
    return !scenario.querySelector('div[class^="wrapper___Lpz_D"] .badge___E7fuw');
  }

  function countTotalScenarios(levelCheck) {
    let count = 0;
    getCachedScenarios().forEach((scenario) => {
        const levelEl = scenario.querySelector('span[class^="levelValue___"]');
        if (!levelEl) return;
        const level = parseInt(levelEl.textContent.trim());
        if (levelCheck(level)) count++;
      });
    return count;
  }

  // Check if we have cached data from within the last 6 hours
  function loadMinCPRConfig() {
    const cachedData = localStorage.getItem("oc-pastebin-config");
    const cacheTimestamp = localStorage.getItem("oc-pastebin-timestamp");

    if (cachedData && cacheTimestamp) {
      const sixHours = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
      const cacheAge = Date.now() - parseInt(cacheTimestamp);

      if (cacheAge < sixHours) {
        try {
          const cachedConfig = JSON.parse(cachedData);

          if (cachedConfig.priorities) {
            // Priority-based structure
            priorityData = cachedConfig.priorities;
            maxCounts = cachedConfig.maxCount || null;
            
            // Convert to lookup table for fast access
            roleToPriority = buildRoleToPriorityLookup(priorityData);
          }

          startHighlighting();
          return;
        } catch (e) {
          // Invalid cached data, proceed to fetch from Pastebin
        }
      } else {
        // Cached data expired
      }
    } else {
      // No cached data found
    }

    // Fetch from Pastebin
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://pastebin.com/raw/bw6sQZcc",
      onload: function(response) {
        try {
          const newConfig = JSON.parse(response.responseText);

          if (newConfig.priorities) {
            // Priority-based structure
            priorityData = newConfig.priorities;
            maxCounts = newConfig.maxCount || null;
            
            // Convert to lookup table for fast access
            roleToPriority = buildRoleToPriorityLookup(priorityData);
          }

          localStorage.setItem("oc-pastebin-config", response.responseText);
          localStorage.setItem("oc-pastebin-timestamp", Date.now().toString());
        } catch (e) {
          console.log("[OC Assistant] Error parsing Pastebin JSON:", e);
          console.log("[OC Assistant] Raw response:", response.responseText);
        }
        startHighlighting();
      },
      onerror: function(error) {
        console.log("[OC Assistant] Error fetching from Pastebin:", error);
        startHighlighting();
      }
    });
  }

  // Load the configuration
  loadMinCPRConfig();

})();