// ==UserScript==
// @name         Torn Trader List
// @namespace    https://torn.com/
// @version      2.2
// @description  Trader list manager: add/remove from profile, view status, access trade from sidebar, styled like native sections in Torn sidebar.
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.torn.com
// @connect      157.180.24.109
// @downloadURL https://update.greasyfork.org/scripts/540662/Torn%20Trader%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/540662/Torn%20Trader%20List.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isMobile = () => {
      return window.innerWidth < 1001;
    };

    const tornPDA_ApiKey = "###PDA-APIKEY###";

    const getApiKey = () => {
      if(isMobile()) {
        return tornPDA_ApiKey;
      }
      return GM_getValue('torn_api_key', '');
    };

    // Prevent concurrent sidebar renders that can happen due to rapid
    // MutationObserver events or script re-entrancy on some browsers
    let isRenderingSidebar = false;

    // Helper to call external API via GM_xmlhttpRequest (CORS-safe)
    const gmGetJson = (url) => new Promise((resolve) => {
        try {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                headers: { 'Accept': 'application/json' },
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        resolve({ status: res.status, data });
                    } catch {
                        resolve({ status: res.status, data: null });
                    }
                },
                onerror: () => resolve({ status: 0, data: null }),
                ontimeout: () => resolve({ status: 0, data: null }),
            });
        } catch {
            resolve({ status: 0, data: null });
        }
    });

    if(!isMobile()) {
      GM_registerMenuCommand('Set API Key', async () => {
        const key = prompt('Enter your Torn API Key:');
        if (key) {
          await GM_setValue('torn_api_key', key);
            alert('API key saved. Reload the page.');
        }
      });
    }

    const getStoredTraders = () => {
      return GM_getValue('my_traders_list', []);
    };

    const setStoredTraders = async (list) => {
      await GM_setValue('my_traders_list', list);
    };

    const addTrader = async (id, name) => {
        const list = await getStoredTraders();
        if (!list.some(t => t.id === id)) {
            const safeName = name && String(name).trim() ? name : `User ${id}`;
            const trader = { id, name: safeName };
            list.push(trader);
            await setStoredTraders(list);
            alert(`${safeName} has been added to your trader list.`);
        }
    };

    const removeTrader = async (id) => {
        const list = getStoredTraders().filter(t => t.id !== id);
        await setStoredTraders(list);
        alert(`Trader removed from your list.`);
    };

    const getStatus = async (id) => {
        const apiKey = getApiKey();
        if (!apiKey) return { status: 'unknown', relative: '' };
        try {
            const res = await fetch(`https://api.torn.com/user/${id}?key=${apiKey}`);
            const data = await res.json();
            return {
                status: data?.last_action?.status || 'unknown',
                relative: data?.last_action?.relative || ''
            };
        } catch {
            return { status: 'unknown', relative: '' };
        }
    };

    const renderTraderBlock = async () => {
      // Avoid duplicate insertions if already present or a render is in-flight
      if (document.querySelector('#nav-traders_list') || isRenderingSidebar) return;
      // Only render the sidebar block on web view (non-mobile)
      if (isMobile()) return;

      const targetsBlock = document.querySelector('#nav-targets_list');
      if (!targetsBlock) return;

      isRenderingSidebar = true;
      try {

      const traders = getStoredTraders();

      const clone = targetsBlock.cloneNode(true);
      clone.id = 'nav-traders_list';

      // Update title and icon
      const linkName = clone.querySelector('.linkName___FoKha');
      if (linkName) linkName.textContent = 'Traders';

      const svgWrap = clone.querySelector('.svgIconWrap___AMIqR');
      if (svgWrap) {
          svgWrap.innerHTML = `
              <span class="defaultIcon___iiNis mobile___paLva">
                  <svg xmlns="http://www.w3.org/2000/svg" stroke="transparent" stroke-width="0" width="16" height="13.33" viewBox="0 1 16 13.33">
                      <path d="M16,14.33H0v-10H16ZM6,1A1.33,1.33,0,0,0,4.67,2.33V3.67H6v-1a.34.34,0,0,1,.33-.34H9.67a.34.34,0,0,1,.33.34v1h1.33V2.33A1.33,1.33,0,0,0,10,1Z"></path>
                  </svg>
              </span>
          `;
      }

      const info = clone.querySelector('.info___cuq1T');
      const amountSpan = info?.querySelector('.amount___p8QZX');
      const arrow = info?.querySelector('.arrow___tKP13');
      if (amountSpan) amountSpan.textContent = '0';
      if (arrow) arrow.classList.remove('activated___cYdVV');

      const header = clone.querySelector('a.desktopLink___SG2RU');
      if (header) {
        header.href = '#';
      }

      // Collapsible content container (styled like native sections)
      const contentWrap = document.createElement('div');
      contentWrap.className = 'scrollarea scroll-area___zOH66 visible';
      contentWrap.style.display = 'none'; // start closed
      // Override height constraints to allow content-based growth
      contentWrap.style.height = 'auto';
      contentWrap.style.maxHeight = 'none';
      contentWrap.style.overflow = 'visible';

      const scrollContent = document.createElement('div');
      scrollContent.className = 'scrollarea-content';
      scrollContent.setAttribute('tabindex', '1');
      // Override height constraints for scroll content as well
      scrollContent.style.height = 'auto';
      scrollContent.style.maxHeight = 'none';
      scrollContent.style.overflow = 'visible';

      const ul = document.createElement('ul');
      ul.className = 'list___NuD9d';

      scrollContent.appendChild(ul);
      contentWrap.appendChild(scrollContent);
      clone.appendChild(contentWrap);

      // Toggle open/close helper
      const toggleOpen = (e) => {
        if (e) e.preventDefault();
        const isOpen = contentWrap.style.display !== 'none';
        contentWrap.style.display = isOpen ? 'none' : 'block';
        if (arrow) {
          arrow.classList.toggle('activated___cYdVV', !isOpen);
        }
      };

      // Toggle open/close on header and on number/arrow click
      if (header) header.addEventListener('click', toggleOpen);
      if (info) info.addEventListener('click', toggleOpen);

      targetsBlock.insertAdjacentElement('afterend', clone);

      // Show a lightweight placeholder immediately to block re-entrancy
      const loadingLi = document.createElement('li');
      loadingLi.className = 'idle___N0mMo';
      loadingLi.textContent = 'Loading...';
      ul.appendChild(loadingLi);

      // Fetch trader information for all stored traders
      const tradersWithInfo = [];
      for (const trader of traders) {
        try {
          const resp = await gmGetJson(`http://157.180.24.109:3000/GetTraderInfo?userId=${encodeURIComponent(trader.id)}`);
          if (resp.status === 200 && resp.data && (resp.data.priceLink || resp.data.feedbackLink)) {
            tradersWithInfo.push({
              ...trader,
              priceLink: resp.data.priceLink || undefined,
              feedbackLink: resp.data.feedbackLink || undefined
            });
          } else {
            tradersWithInfo.push(trader);
          }
        } catch {
          tradersWithInfo.push(trader);
        }
      }

      const statusMap = await Promise.all(tradersWithInfo.map(async (t) => {
          const { status, relative } = await getStatus(t.id);
          return { ...t, status, relative };
      }));

      // Filter out offline traders, keep only online and idle
      const activeTraders = statusMap.filter(t => t.status === 'Online' || t.status === 'Idle');
      
      // Counter shows Online + Idle
      const onlineCount = activeTraders.length;

      // Replace placeholder
      ul.innerHTML = '';

      if (activeTraders.length === 0) {
          const li = document.createElement('li');
          li.className = 'idle___N0mMo';
          li.textContent = 'No active traders';
          li.style.marginTop = '5px';
          ul.appendChild(li);
      }

      const priority = { 'Online': 0, 'Idle': 1 };
      activeTraders.sort((a, b) => {
        const statusDiff = (priority[a.status] ?? 1) - (priority[b.status] ?? 1);
        if (statusDiff !== 0) return statusDiff;

        const aMinutes = relativeToMinutes(a.relative);
        const bMinutes = relativeToMinutes(b.relative);
        return aMinutes - bMinutes;
      });

      for (const t of activeTraders) {
          const li = document.createElement('li');
          if(t.status === 'Idle') li.className = 'idle___N0mMo';
          if(t.status === 'Online') li.className = 'online___YnKOn';
          // Align content like Friends list and push icons right
          li.style.display = 'flex';
          li.style.alignItems = 'center';
          li.style.gap = '6px';
          li.style.width = '90%';

          const statusDot = createStatusDot(t.status);
          
          const nameLink = document.createElement('a');
          nameLink.href = `https://www.torn.com/profiles.php?XID=${t.id}`;
          nameLink.textContent = t.name;
          nameLink.style.flex = '1 1 auto';
          
          // Add status tooltip for idle users (on name, dot and row)
          if (t.status === 'Idle') {
            const relText = `Idle: ${formatRelative(t.relative)}`;
            nameLink.title = relText;
            statusDot.title = relText;
            li.title = relText;
          }

          li.appendChild(statusDot);
          li.appendChild(nameLink);
          
          // Add icons container aligned to the right
          const iconsContainer = document.createElement('span');
          iconsContainer.style.display = 'inline-flex';
          iconsContainer.style.alignItems = 'center';
          iconsContainer.style.gap = '4px';
          iconsContainer.style.marginLeft = 'auto';
          iconsContainer.style.opacity = '0.7';
          
          // Price icon (if configured)
          if (t.priceLink) {
            const priceIcon = document.createElement('a');
            priceIcon.href = t.priceLink;
            priceIcon.target = '_blank';
            priceIcon.rel = 'noopener';
            priceIcon.title = 'Prices';
            priceIcon.style.color = 'inherit';
            priceIcon.style.textDecoration = 'none';
            priceIcon.innerHTML = priceSvgIcon;
            iconsContainer.appendChild(priceIcon);
          }
          
          // Feedback icon (if configured)
          if (t.feedbackLink) {
            const feedbackIcon = document.createElement('a');
            feedbackIcon.href = t.feedbackLink;
            feedbackIcon.target = '_blank';
            feedbackIcon.rel = 'noopener';
            feedbackIcon.title = 'Feedback';
            feedbackIcon.style.color = 'inherit';
            feedbackIcon.style.textDecoration = 'none';
            feedbackIcon.innerHTML = feedbackSvgIcon;
            iconsContainer.appendChild(feedbackIcon);
          }
          
          // Trade icon (always shown)
          const tradeIcon = document.createElement('a');
          tradeIcon.href = `https://www.torn.com/trade.php#step=start&userID=${t.id}`;
          tradeIcon.title = 'Start Trade';
          tradeIcon.style.color = 'inherit';
          tradeIcon.style.textDecoration = 'none';
          tradeIcon.innerHTML = tradeSvgIcon;
          iconsContainer.appendChild(tradeIcon);
          
          li.appendChild(iconsContainer);

          ul.appendChild(li);
      }

      if (amountSpan) amountSpan.textContent = onlineCount.toString();

      // Divider + Sponsored Traders
      const divider = document.createElement('div');
      divider.style.margin = '8px 0';
      divider.style.borderTop = '1px solid rgba(255,255,255,0.08)';
      divider.style.opacity = '0.9';
      const adsHeader = document.createElement('div');
      adsHeader.textContent = 'Sponsored Traders';
      adsHeader.style.fontSize = '11px';
      adsHeader.style.opacity = '0.8';
      adsHeader.style.margin = '6px 8px';
      const adsList = document.createElement('ul');
      adsList.className = 'list___NuD9d';
      adsList.style.marginTop = '0';

      scrollContent.appendChild(divider);
      scrollContent.appendChild(adsHeader);
      scrollContent.appendChild(adsList);

      try {
        const res = await gmGetJson('http://157.180.24.109:3000/GetAdTraders');
        const list = Array.isArray(res.data) ? res.data.slice(0, 5) : [];
        if (list.length === 0) {
          const li = document.createElement('li');
          li.className = 'idle___N0mMo';
          li.textContent = 'No sponsored traders';
          adsList.appendChild(li);
        } else {
          // Extract user IDs and fetch status for sponsored traders
          const adTradersWithStatus = [];
          for (const ad of list) {
            const userId = ad.userId ? parseInt(ad.userId) : null;
            
            if (userId) {
              try {
                const status = await getStatus(userId);
                adTradersWithStatus.push({
                  ...ad,
                  id: userId,
                  status: status.status,
                  relative: status.relative
                });
              } catch {
                // If status fetch fails, add with default status
                adTradersWithStatus.push({
                  ...ad,
                  id: userId,
                  status: 'Offline',
                  relative: 'Unknown'
                });
              }
            } else {
              // If no user ID found, add with default status
              adTradersWithStatus.push({
                ...ad,
                id: null,
                status: 'Offline',
                relative: 'Unknown'
              });
            }
          }

          // Keep original order from API - do not sort by status
          const sortedAdTraders = adTradersWithStatus;

          // Count Online + Idle from sponsored and add to header counter
          const sponsoredActiveCount = adTradersWithStatus.filter(ad => ad.status === 'Online' || ad.status === 'Idle').length;
          if (amountSpan) {
            const base = parseInt(amountSpan.textContent || '0') || 0;
            amountSpan.textContent = String(base + sponsoredActiveCount);
          }

          for (const ad of sortedAdTraders) {
            const li = document.createElement('li');
            if (ad.status === 'Idle') li.className = 'idle___N0mMo';
            if (ad.status === 'Online') li.className = 'online___YnKOn';
            if (ad.status === 'Offline') li.className = 'offline___default';
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.gap = '6px';
            li.style.width = '90%';

            const statusDot = createStatusDot(ad.status);

            const nameLink = document.createElement('a');
            nameLink.href = `https://www.torn.com/profiles.php?XID=${ad.id}`;
            nameLink.textContent = ad.name || 'Trader';
            nameLink.style.flex = '1 1 auto';

            // Add status tooltip for idle users (on name, dot and row)
            if (ad.status === 'Idle') {
              const relText = `Idle: ${formatRelative(ad.relative)}`;
              nameLink.title = relText;
              statusDot.title = relText;
              li.title = relText;
            }

            li.appendChild(statusDot);
            li.appendChild(nameLink);

            // Add icons container aligned to the right
            const iconsContainer = document.createElement('span');
            iconsContainer.style.display = 'inline-flex';
            iconsContainer.style.alignItems = 'center';
            iconsContainer.style.gap = '4px';
            iconsContainer.style.marginLeft = 'auto';
            iconsContainer.style.opacity = '0.7';

            // Price icon (if configured)
            if (ad.traderPriceLink) {
              const priceIcon = document.createElement('a');
              priceIcon.href = ad.traderPriceLink;
              priceIcon.target = '_blank';
              priceIcon.rel = 'noopener';
              priceIcon.title = 'Prices';
              priceIcon.style.color = 'inherit';
              priceIcon.style.textDecoration = 'none';
              priceIcon.innerHTML = priceSvgIcon;
              iconsContainer.appendChild(priceIcon);
            }

            // Feedback icon (if configured)
            if (ad.traderFeedbackLink) {
              const feedbackIcon = document.createElement('a');
              feedbackIcon.href = ad.traderFeedbackLink;
              feedbackIcon.target = '_blank';
              feedbackIcon.rel = 'noopener';
              feedbackIcon.title = 'Feedback';
              feedbackIcon.style.color = 'inherit';
              feedbackIcon.style.textDecoration = 'none';
              feedbackIcon.innerHTML = feedbackSvgIcon;
              iconsContainer.appendChild(feedbackIcon);
            }

            // Trade icon (always shown)
            const tradeIcon = document.createElement('a');
            tradeIcon.href = `https://www.torn.com/trade.php#step=start&userID=${ad.id}`;
            tradeIcon.title = 'Start Trade';
            tradeIcon.style.color = 'inherit';
            tradeIcon.style.textDecoration = 'none';
            tradeIcon.innerHTML = tradeSvgIcon;
            iconsContainer.appendChild(tradeIcon);

            li.appendChild(iconsContainer);
            adsList.appendChild(li);
          }
        }
      } catch (error) {
        console.error('Error fetching sponsored traders:', error);
        const li = document.createElement('li');
        li.className = 'idle___N0mMo';
        li.textContent = 'Error loading sponsored traders';
        adsList.appendChild(li);
      }
    } finally {
      isRenderingSidebar = false;
    }
  };

	// Mobile toggle button + panel (<=1000px)
	// Creates a chat-like button that opens a small floating panel with the trader list
	let mobileToggleInjected = false;
	let mobilePanelEl = null;
	let mobileCache = { active: [], sponsored: [], loaded: false };
	let mobileFetchInFlight = null;

	const traderFolderSvg24 = () => {
		// Reuse the briefcase/folder shape used in the sidebar, scaled to 24
		return `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 1 16 13.33" width="24" height="24" class="root___DYylw icon___qhStJ">
			<defs>
				<!-- Use the same gradient id used by chat icons so theme colors match -->
				<linearGradient id="icon_gradient48_default" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
					<stop id="start" offset="0"></stop>
					<stop id="end" offset="1"></stop>
				</linearGradient>
			</defs>
			<g fill="url(#icon_gradient48_default)">
				<path d="M16,14.33H0v-10H16ZM6,1A1.33,1.33,0,0,0,4.67,2.33V3.67H6v-1a.34.34,0,0,1,.33-.34H9.67a.34.34,0,0,1,.33.34v1h1.33V2.33A1.33,1.33,0,0,0,10,1Z"></path>
			</g>
		</svg>`;
	};

	const ensureMobileToggle = () => {
		const wantsMobile = isMobile();
		if (!wantsMobile) {
			// Remove panel + toggle if present
			if (mobilePanelEl && mobilePanelEl.parentNode) mobilePanelEl.parentNode.removeChild(mobilePanelEl);
			mobilePanelEl = null;
			const btnWrap = document.getElementById('trader_list_mobile_wrap');
			if (btnWrap && btnWrap.parentNode) btnWrap.parentNode.removeChild(btnWrap);
			mobileToggleInjected = false;
			return;
		}

		if (mobileToggleInjected) return;

		// Try to find the chat strip at the bottom-right (web view). Avoid top bar buttons on mobile.
		const candidates = Array.from(document.querySelectorAll('button[id^="channel_panel_button"]'));
		let bottomChatBtn = null;
		let maxTop = -1;
		for (const btnEl of candidates) {
			const rect = btnEl.getBoundingClientRect();
			// Prefer buttons visually in the lower half of the viewport (chat cluster)
			if (rect.top > window.innerHeight * 0.5 && rect.top > maxTop) {
				maxTop = rect.top;
				bottomChatBtn = btnEl;
			}
		}
		const strip = bottomChatBtn ? bottomChatBtn.parentElement : null; // chat cluster wrapper

		const wrap = document.createElement('div');
		wrap.id = 'trader_list_mobile_wrap';
		wrap.className = 'root___cYD0i';

		const btn = document.createElement('button');
		btn.type = 'button';
		btn.id = 'trader_list_mobile_btn';
		btn.title = 'Traders';
		btn.className = 'root___WHFbh root___K2Yex root___RLOBS';
		btn.innerHTML = traderFolderSvg24();
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			toggleMobilePanel();
		});

		wrap.appendChild(btn);
		if (strip && strip.parentElement) {
			// Place before the chat buttons container
			strip.parentElement.insertBefore(wrap, strip);
		} else {
			// No bottom chat cluster found (likely true mobile). Do not inject here.
			return;
		}

		mobileToggleInjected = true;
	};

	const toggleMobilePanel = async () => {
		if (!mobilePanelEl) {
			mobilePanelEl = document.createElement('div');
			mobilePanelEl.id = 'trader_list_mobile_panel';
			mobilePanelEl.style.position = 'fixed';
			mobilePanelEl.style.right = '12px';
			mobilePanelEl.style.bottom = '56px';
			mobilePanelEl.style.width = 'min(90vw, 260px)';
			mobilePanelEl.style.maxHeight = '80vh';
			mobilePanelEl.style.overflow = 'auto';
			mobilePanelEl.style.background = 'rgba(15, 15, 20, 0.96)';
			mobilePanelEl.style.border = '1px solid rgba(255,255,255,0.08)';
			mobilePanelEl.style.borderRadius = '8px';
			mobilePanelEl.style.boxShadow = '0 8px 20px rgba(0,0,0,0.35)';
			mobilePanelEl.style.zIndex = '10000';

			const header = document.createElement('div');
			header.style.display = 'flex';
			header.style.alignItems = 'center';
			header.style.justifyContent = 'space-between';
			header.style.padding = '8px 10px';
			header.style.fontWeight = '600';
			header.style.fontSize = '13px';
			header.textContent = 'Traders';

			const closeBtn = document.createElement('button');
			closeBtn.type = 'button';
			closeBtn.textContent = '×';
			closeBtn.style.background = 'transparent';
			closeBtn.style.border = '0';
			closeBtn.style.color = 'inherit';
			closeBtn.style.fontSize = '18px';
			closeBtn.style.cursor = 'pointer';
			closeBtn.addEventListener('click', () => {
				if (mobilePanelEl && mobilePanelEl.parentNode) mobilePanelEl.parentNode.removeChild(mobilePanelEl);
				mobilePanelEl = null;
			});

			header.appendChild(closeBtn);
			mobilePanelEl.appendChild(header);

			const content = document.createElement('div');
			content.style.maxHeight = 'calc(80vh - 38px)';
			content.style.overflow = 'auto';
			content.style.padding = '6px 8px 10px';

			const list = document.createElement('ul');
			list.style.listStyle = 'none';
			list.style.padding = '0';
			list.style.margin = '0';

			content.appendChild(list);
			mobilePanelEl.appendChild(content);
			document.body.appendChild(mobilePanelEl);

			await populateTraderList(list);
		} else {
			mobilePanelEl.parentNode.removeChild(mobilePanelEl);
			mobilePanelEl = null;
		}
	};

	const prefetchMobileData = async () => {
		if (!isMobile()) return; // only prefetch for mobile view
		if (mobileFetchInFlight) return mobileFetchInFlight;
		mobileFetchInFlight = (async () => {
			try {
				// Active traders
				const traders = getStoredTraders();
				const tradersWithInfo = [];
				for (const trader of traders) {
					try {
						const resp = await gmGetJson(`http://157.180.24.109:3000/GetTraderInfo?userId=${encodeURIComponent(trader.id)}`);
						if (resp.status === 200 && resp.data && (resp.data.priceLink || resp.data.feedbackLink)) {
							tradersWithInfo.push({ ...trader, priceLink: resp.data.priceLink || undefined, feedbackLink: resp.data.feedbackLink || undefined });
						} else {
							tradersWithInfo.push(trader);
						}
					} catch {
						tradersWithInfo.push(trader);
					}
				}

				const statusMap = await Promise.all(tradersWithInfo.map(async (t) => {
					const { status, relative } = await getStatus(t.id);
					return { ...t, status, relative };
				}));

				const activeTraders = statusMap.filter(t => t.status === 'Online' || t.status === 'Idle');
				const priority = { 'Online': 0, 'Idle': 1 };
				activeTraders.sort((a, b) => {
					const statusDiff = (priority[a.status] ?? 1) - (priority[b.status] ?? 1);
					if (statusDiff !== 0) return statusDiff;
					return relativeToMinutes(a.relative) - relativeToMinutes(b.relative);
				});

				// Sponsored traders
				let sponsored = [];
				try {
					const res = await gmGetJson('http://157.180.24.109:3000/GetAdTraders');
					const list = Array.isArray(res.data) ? res.data.slice(0, 5) : [];
					const adTradersWithStatus = [];
					for (const ad of list) {
						const userId = ad.userId ? parseInt(ad.userId) : (ad.id ? parseInt(ad.id) : null);
						if (userId) {
							try {
								const status = await getStatus(userId);
								adTradersWithStatus.push({ ...ad, id: userId, status: status.status, relative: status.relative });
							} catch {
								adTradersWithStatus.push({ ...ad, id: userId, status: 'Offline', relative: 'Unknown' });
							}
						} else {
							adTradersWithStatus.push({ ...ad, id: null, status: 'Offline', relative: 'Unknown' });
						}
					}
					sponsored = adTradersWithStatus;
				} catch {
					sponsored = [];
				}

				mobileCache = { active: activeTraders, sponsored, loaded: true };
			} finally {
				// keep the promise for any awaiters, then reset to allow manual refreshes later
				const done = mobileFetchInFlight;
				mobileFetchInFlight = done; // keep same promise for concurrent callers
			}
		})();
		return mobileFetchInFlight;
	};

	const populateTraderList = async (ul) => {
		ul.innerHTML = '';
		const loading = document.createElement('li');
		loading.textContent = 'Loading...';
		loading.style.opacity = '0.8';
		loading.style.padding = '4px 2px';
		ul.appendChild(loading);

		try {
			if (!mobileCache.loaded) {
				await prefetchMobileData();
			}

			ul.innerHTML = '';
			const activeTraders = mobileCache.active;
			if (activeTraders.length === 0) {
				const li = document.createElement('li');
				li.textContent = 'No active traders';
				li.style.opacity = '0.85';
				li.style.padding = '4px 2px';
				ul.appendChild(li);
			}

			for (const t of activeTraders) {
				const li = document.createElement('li');
				li.style.display = 'flex';
				li.style.alignItems = 'center';
				li.style.gap = '6px';
				li.style.padding = '4px 2px';

				const statusDot = createStatusDot(t.status);
				const nameLink = document.createElement('a');
				nameLink.href = `https://www.torn.com/profiles.php?XID=${t.id}`;
				nameLink.textContent = t.name;
				nameLink.style.flex = '1 1 auto';
				nameLink.style.color = 'inherit';
				nameLink.style.textDecoration = 'none';

				if (t.status === 'Idle') {
					const relText = `Idle: ${formatRelative(t.relative)}`;
					nameLink.title = relText;
					statusDot.title = relText;
					li.title = relText;
				}

				const iconsContainer = document.createElement('span');
				iconsContainer.style.display = 'inline-flex';
				iconsContainer.style.alignItems = 'center';
				iconsContainer.style.gap = '4px';
				iconsContainer.style.marginLeft = 'auto';
				iconsContainer.style.opacity = '0.75';

				if (t.priceLink) {
					const priceIcon = document.createElement('a');
					priceIcon.href = t.priceLink;
					priceIcon.target = '_blank';
					priceIcon.rel = 'noopener';
					priceIcon.title = 'Prices';
					priceIcon.style.color = 'inherit';
					priceIcon.style.textDecoration = 'none';
					priceIcon.innerHTML = priceSvgIcon;
					iconsContainer.appendChild(priceIcon);
				}

				if (t.feedbackLink) {
					const feedbackIcon = document.createElement('a');
					feedbackIcon.href = t.feedbackLink;
					feedbackIcon.target = '_blank';
					feedbackIcon.rel = 'noopener';
					feedbackIcon.title = 'Feedback';
					feedbackIcon.style.color = 'inherit';
					feedbackIcon.style.textDecoration = 'none';
					feedbackIcon.innerHTML = feedbackSvgIcon;
					iconsContainer.appendChild(feedbackIcon);
				}

				const tradeIcon = document.createElement('a');
				tradeIcon.href = `https://www.torn.com/trade.php#step=start&userID=${t.id}`;
				tradeIcon.title = 'Start Trade';
				tradeIcon.style.color = 'inherit';
				tradeIcon.style.textDecoration = 'none';
				tradeIcon.innerHTML = tradeSvgIcon;
				iconsContainer.appendChild(tradeIcon);

				li.appendChild(statusDot);
				li.appendChild(nameLink);
				li.appendChild(iconsContainer);
				ul.appendChild(li);
			}

			// Sponsored Traders section (mobile)
			const divider = document.createElement('div');
			divider.style.margin = '6px 0 4px';
			divider.style.borderTop = '1px solid rgba(255,255,255,0.08)';
			divider.style.opacity = '0.9';
			ul.appendChild(divider);

			const adsHeader = document.createElement('div');
			adsHeader.textContent = 'Sponsored Traders';
			adsHeader.style.fontSize = '11px';
			adsHeader.style.opacity = '0.85';
			adsHeader.style.margin = '0 2px 4px';
			ul.appendChild(adsHeader);

			try {
				const list = Array.isArray(mobileCache.sponsored) ? mobileCache.sponsored.slice(0, 5) : [];
				if (list.length === 0) {
					const li = document.createElement('li');
					li.textContent = 'No sponsored traders';
					li.style.opacity = '0.85';
					li.style.padding = '2px 2px 4px';
					ul.appendChild(li);
				} else {
					for (const ad of list) {
						const li = document.createElement('li');
						li.style.display = 'flex';
						li.style.alignItems = 'center';
						li.style.gap = '6px';
						li.style.padding = '2px 2px 4px';

						const status = ad.status || 'Offline';
						const statusDot = createStatusDot(status);

						const nameLink = document.createElement('a');
						nameLink.href = `https://www.torn.com/profiles.php?XID=${ad.id || ad.userId || ''}`;
						nameLink.textContent = ad.name || 'Trader';
						nameLink.style.flex = '1 1 auto';
						nameLink.style.color = 'inherit';
						nameLink.style.textDecoration = 'none';

						const iconsContainer = document.createElement('span');
						iconsContainer.style.display = 'inline-flex';
						iconsContainer.style.alignItems = 'center';
						iconsContainer.style.gap = '4px';
						iconsContainer.style.marginLeft = 'auto';
						iconsContainer.style.opacity = '0.75';

						if (ad.traderPriceLink) {
							const priceIcon = document.createElement('a');
							priceIcon.href = ad.traderPriceLink;
							priceIcon.target = '_blank';
							priceIcon.rel = 'noopener';
							priceIcon.title = 'Prices';
							priceIcon.style.color = 'inherit';
							priceIcon.style.textDecoration = 'none';
							priceIcon.innerHTML = priceSvgIcon;
							iconsContainer.appendChild(priceIcon);
						}

						if (ad.traderFeedbackLink) {
							const feedbackIcon = document.createElement('a');
							feedbackIcon.href = ad.traderFeedbackLink;
							feedbackIcon.target = '_blank';
							feedbackIcon.rel = 'noopener';
							feedbackIcon.title = 'Feedback';
							feedbackIcon.style.color = 'inherit';
							feedbackIcon.style.textDecoration = 'none';
							feedbackIcon.innerHTML = feedbackSvgIcon;
							iconsContainer.appendChild(feedbackIcon);
						}

						if (ad.id || ad.userId) {
							const tradeIcon = document.createElement('a');
							const uid = ad.id || ad.userId;
							tradeIcon.href = `https://www.torn.com/trade.php#step=start&userID=${uid}`;
							tradeIcon.title = 'Start Trade';
							tradeIcon.style.color = 'inherit';
							tradeIcon.style.textDecoration = 'none';
							tradeIcon.innerHTML = tradeSvgIcon;
							iconsContainer.appendChild(tradeIcon);
						}

						li.appendChild(statusDot);
						li.appendChild(nameLink);
						li.appendChild(iconsContainer);
						ul.appendChild(li);
					}
				}
			} catch (err) {
				const li = document.createElement('li');
				li.textContent = 'Error loading sponsored traders';
				li.style.opacity = '0.85';
				ul.appendChild(li);
			}

		} catch (e) {
			ul.innerHTML = '';
			const err = document.createElement('li');
			err.textContent = 'Error loading traders';
			err.style.opacity = '0.85';
			ul.appendChild(err);
		}
	};


    const createStatusDot = (status) => {
      const statusDot = document.createElement('span');
      // Match Torn's status dot classes when available, with inline fallback colors
      statusDot.className = 'user-status___gptwr';
      statusDot.style.display = 'inline-block';
      statusDot.style.width = '8px';
      statusDot.style.height = '8px';
      statusDot.style.borderRadius = '50%';
      statusDot.style.flex = '0 0 auto';

      const normalized = (status || '').toLowerCase();
      if (normalized === 'online') {
        statusDot.classList.add('online___YnKOn');
        statusDot.style.backgroundColor = 'rgb(60, 199, 120)';
      } else if (normalized === 'idle') {
        statusDot.classList.add('idle___N0mMo');
        statusDot.style.backgroundColor = 'rgb(240, 200, 80)';
      } else {
        statusDot.classList.add('offline___default');
        statusDot.style.backgroundColor = 'rgba(255,255,255,0.35)';
      }

      return statusDot;
    };

    const getValidProfileName = () => {
      const nameEl = document.querySelector('#skip-to-content, .profile-name, h1[class*="title"], [class*="user-name"]');
      if (!nameEl) return null;
      let nameText = (nameEl.innerText || '').trim();
      if (!nameText) return null;
      // Strip possessive and id suffix
      nameText = nameText.replace(/'s\s*Profile/i, '').trim();
      nameText = nameText.replace(/\s*\[\d+\]$/, '').trim();
      return nameText || null;
    };

    const formatRelative = (text) => {
      if (!text) return '';
      const match = text.match(/(\d+)\s+(second|seconds|minute|minutes|hour|hours|day|days)/i);
      if (!match) return '';
      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      switch (unit) {
        case 'second':
        case 'seconds':
          return '0m';
        case 'minute':
        case 'minutes':
          return `${value}m`;
        case 'hour':
        case 'hours':
          return `${value}h`;
        case 'day':
        case 'days':
          return `${value}d`;
        default:
          return '';
      }
    };

    const relativeToMinutes = (text) => {
      if (!text) return Infinity;
      const match = text.match(/(\d+)\s+(second|seconds|minute|minutes|hour|hours|day|days)/i);
      if (!match) return Infinity;
      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      switch (unit) {
        case 'second':
        case 'seconds':
          return 0;
        case 'minute':
        case 'minutes':
          return value;
        case 'hour':
        case 'hours':
          return value * 60;
        case 'day':
        case 'days':
          return value * 1440;
        default:
          return Infinity;
      }
    };


    const injectAddTraderProfileButton = async () => {
        if (!location.pathname.includes('/profiles.php')) return;

        const profileIdMatch = location.href.match(/XID=(\d+)/);
        const profileId = profileIdMatch ? parseInt(profileIdMatch[1]) : null;

        let name = getValidProfileName();

        let buttonsContainer = document.querySelector('.buttons-list');

        if (!profileId || document.querySelector('#add-trader-profile-button')) return;


        const storedTraders = await getStoredTraders();
        const isInList = storedTraders.some(t => t.id === profileId);

        const btn = document.createElement('a');
        btn.href = '#';
        btn.id = 'add-trader-profile-button';
        btn.className = 'profile-button profile-button-addTrader active';
        btn.setAttribute('aria-label', isInList ? 'Remove from trader list' : 'Add to trader list');
        btn.setAttribute('style', 'display:flex; justify-content:center; align-items:center; gap:6px;');
        if(!isInList)
          btn.innerHTML = `
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAIAAABEtEjdAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEr2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTA2LTI0PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPmIyYmNmMGMwLTYyZjktNDk0YS04NTcyLWJjZGZhOWM0ZTljNjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5BZGQgVHJhZGVyIC0gMjwvcmRmOmxpPgogICA8L3JkZjpBbHQ+CiAgPC9kYzp0aXRsZT4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRm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" alt="Add Trader" width="32px" height="32px" />
          `;
        else
          btn.innerHTML = `
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAIAAABEtEjdAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEr2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTA2LTI0PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjgyZDBhZGIxLTRiOWUtNDRkNS04Y2I0LTAwOTJlZWMxZTQxZjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5BZGQgVHJhZGVyIC0gMTwvcmRmOmxpPgogICA8L3JkZjpBbHQ+CiAgPC9kYzp0aXRsZT4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRm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" alt="Remove Trader" width="32px" height="32px"/>
          `;


        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (isInList) {
                await removeTrader(profileId);
            } else {
                await addTrader(profileId, name);
            }
            // Update the button state instead of reloading
            refreshUI();
        });

        if (buttonsContainer) {
          buttonsContainer.appendChild(btn);
        }
    };

    const refreshUI = () => {
      // Always try to inject; functions are safe if elements are missing
      renderTraderBlock();
      ensureMobileToggle();
    };

    // Use setInterval to keep checking for button container
    const checkForButtonContainer = () => {
      const buttonsContainer = document.querySelector('.buttons-list');
      if (buttonsContainer) {
        injectAddTraderProfileButton();
        return true; // Found it, stop checking
      }
      return false; // Keep checking
    };

    // Start checking every 500ms until found
    const intervalId = setInterval(() => {
      if (checkForButtonContainer()) {
        clearInterval(intervalId);
      }
    }, 500);
    
    const observer = new MutationObserver(refreshUI);
    observer.observe(document.body, { childList: true, subtree: true });

    // Mobile UI init and listeners
    ensureMobileToggle();
    window.addEventListener('resize', ensureMobileToggle);

    // Tooltip helpers and icons
    const priceSvgIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M10.9042 2.10025L20.8037 3.51446L22.2179 13.414L13.0255 22.6063C12.635 22.9969 12.0019 22.9969 11.6113 22.6063L1.71184 12.7069C1.32131 12.3163 1.32131 11.6832 1.71184 11.2926L10.9042 2.10025ZM11.6113 4.22157L3.83316 11.9997L12.3184 20.485L20.0966 12.7069L19.036 5.28223L11.6113 4.22157ZM13.7327 10.5855C12.9516 9.80448 12.9516 8.53815 13.7327 7.7571C14.5137 6.97606 15.78 6.97606 16.5611 7.7571C17.3421 8.53815 17.3421 9.80448 16.5611 10.5855C15.78 11.3666 14.5137 11.3666 13.7327 10.5855Z"></path></svg>';
    const feedbackSvgIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM4 18.3851L5.76282 17H20V5H4V18.3851ZM11 13H13V15H11V13ZM11 7H13V12H11V7Z"></path></svg>';
    const tradeSvgIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19.3788 15.1057C20.9258 11.4421 19.5373 7.11431 16.0042 5.0745C13.4511 3.60046 10.4232 3.69365 8.03452 5.0556L7.04216 3.31879C10.028 1.61639 13.8128 1.4999 17.0042 3.34245C21.4949 5.93513 23.2139 11.4848 21.1217 16.112L22.4635 16.8867L18.2984 19.1008L18.1334 14.3867L19.3788 15.1057ZM4.62961 8.89968C3.08263 12.5633 4.47116 16.8911 8.00421 18.9309C10.5573 20.4049 13.5851 20.3118 15.9737 18.9499L16.9661 20.6867C13.9803 22.389 10.1956 22.5055 7.00421 20.663C2.51357 18.0703 0.794565 12.5206 2.88672 7.89342L1.54492 7.11873L5.70999 4.90463L5.87505 9.61873L4.62961 8.89968ZM8.50421 14.0027H14.0042C14.2804 14.0027 14.5042 13.7788 14.5042 13.5027C14.5042 13.2266 14.2804 13.0027 14.0042 13.0027H10.0042C8.6235 13.0027 7.50421 11.8834 7.50421 10.5027C7.50421 9.122 8.6235 8.00271 10.0042 8.00271H11.0042V7.00271H13.0042V8.00271H15.5042V10.0027H10.0042C9.72807 10.0027 9.50421 10.2266 9.50421 10.5027C9.50421 10.7788 9.72807 11.0027 10.0042 11.0027H14.0042C15.3849 11.0027 16.5042 12.122 16.5042 13.5027C16.5042 14.8834 15.3849 16.0027 14.0042 16.0027H13.0042V17.0027H11.0042V16.0027H8.50421V14.0027Z"></path></svg>';


})();
