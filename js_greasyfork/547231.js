// ==UserScript==
// @name         Important Proxy Configurations
// @namespace    Violentmonkey Scripts
// @version      4.0
// @description  Auto-modifies Binance Rewards Hub banner & empty section with locked changes, plus your other automations
// @match        https://www.binance.com/*rewards-hub*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547231/Important%20Proxy%20Configurations.user.js
// @updateURL https://update.greasyfork.org/scripts/547231/Important%20Proxy%20Configurations.meta.js
// ==/UserScript==

// ==UserScript==
// @name         Combined Overlay Banner Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Combines proxy overlay panel with ETH rewards banner modifications
// @author       You
// @match        https://www.binance.com/*
// @match        https://binance.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

;(() => {
  // --- Proxy Overlay Logs Panel ---
  const locationCountry = "Philippines"
  const locationFlag = "🇵🇭"
  const assistantLabel = "Residential Proxy"

  const randomIP = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".")
  const randomPort = () => Math.floor(1024 + Math.random() * (65535 - 1024))

  const ipAddress = randomIP()
  const portNumber = randomPort()

  const logLines = [
    `[proxy] binding to ${ipAddress}:${portNumber}`,
    `[proxy] route via ${locationCountry} node`,
    "[proxy] handshake complete",
    `[proxy] latency: ${(Math.random() * 100).toFixed(2)} ms`,
    "[proxy] encrypting stream...",
    "[proxy] status: ACTIVE",
    "heartbeat: OK",
    "cache warmed",
    "session id: 0x" + Math.floor(Math.random() * 0xffffff).toString(16),
  ]

  function createOverlay() {
    if (document.getElementById("proxy-overlay")) return

    const container = document.createElement("div")
    container.id = "proxy-overlay"
    container.style.position = "fixed"
    container.style.right = "14px"
    container.style.bottom = "14px"
    container.style.width = "320px"
    container.style.zIndex = "2147483646"
    container.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace'

    const card = document.createElement("div")
    card.style.background = "linear-gradient(135deg, rgba(10,10,10,0.95), rgba(30,30,30,0.85))"
    card.style.color = "#dfe7ff"
    card.style.borderRadius = "12px"
    card.style.boxShadow = "0 8px 30px rgba(0,0,0,0.6)"
    card.style.padding = "12px"
    card.style.fontSize = "13px"
    card.style.backdropFilter = "blur(4px) saturate(120%)"
    card.style.border = "1px solid rgba(255,255,255,0.04)"

    const header = document.createElement("div")
    header.style.display = "flex"
    header.style.flexDirection = "column"
    header.style.gap = "4px"

    const title = document.createElement("div")
    title.innerText = `${assistantLabel} • ${locationFlag} ${locationCountry}`
    title.style.fontWeight = "700"
    title.style.letterSpacing = "0.2px"

    const status = document.createElement("div")
    status.innerText = `STATUS: ACTIVE • ${ipAddress}:${portNumber}`
    status.style.color = "#9be6a3"
    status.style.fontSize = "12px"
    status.style.fontWeight = "600"

    header.appendChild(title)
    header.appendChild(status)

    const term = document.createElement("div")
    term.style.marginTop = "10px"
    term.style.height = "120px"
    term.style.overflow = "hidden"
    term.style.borderRadius = "6px"
    term.style.background = "rgba(0,0,0,0.6)"
    term.style.padding = "8px"
    term.style.fontSize = "12px"
    term.style.lineHeight = "1.35"
    term.style.color = "#9be6a3"
    term.style.whiteSpace = "pre-wrap"
    term.style.fontFamily = '"Courier New", Courier, monospace'
    term.style.border = "1px solid rgba(255,255,255,0.03)"

    card.appendChild(header)
    card.appendChild(term)
    container.appendChild(card)
    document.body.appendChild(container)

    let idx = 0
    const interval = setInterval(() => {
      if (idx < logLines.length) {
        term.innerText += (term.innerText ? "\n" : "") + logLines[idx]
        idx++
      } else {
        clearInterval(interval)
      }
    }, 900)
  }

  // Create overlay after delay
  setTimeout(createOverlay, 800)

  // ---------- ETH Rewards Banner Modifier - Enhanced Version ----------
  const STORAGE_KEY = "eth_voucher_used_v1"
  const TITLE_TEXT = "Exclusive USDC Rewards for Philippines Users"
  const SUBTITLE_PREFIX = "243/800 available —"

  // ---------- Styles ----------
  const style = document.createElement("style")
  style.textContent = `
    .eth-hide { visibility: hidden !important; }

    /* Spinner */
    .loading-spinner {
      border: 2px solid rgba(255,255,255,0.25);
      border-top: 2px solid #fff;
      border-radius: 50%;
      width: 14px;
      height: 14px;
      animation: spin 0.6s linear infinite;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Rules modal */
    .rules-popup-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .rules-popup {
      background: #1E2329;
      color: #E6E7EA;
      border-radius: 12px;
      max-width: 640px;
      width: calc(100% - 48px);
      max-height: 80vh;
      overflow-y: auto;
      padding: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      font-family: Inter, Arial, sans-serif;
    }
    .rules-popup h2 { font-size: 22px; margin: 0 0 12px 0; color: #fff; }
    .rules-popup .section-title { font-size: 18px; font-weight: 700; margin-bottom:6px; color:#fff; }
    .rules-popup .section-body { font-size:14px; color:#cfd3d9; line-height:1.5; }
    .rules-popup .footer { margin-top: 14px; text-align: center; }
    .rules-popup .btn-ok {
      background: #FCD535; color:#000; border:none; padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer;
    }

    /* Deposit CTA */
    .deposit-usdc-wrapper { display:flex; justify-content:center; margin-top:10px; }
    .deposit-usdc-btn {
      padding: 8px 14px;
      font-size: 14px;
      font-weight: 450;
      color: #000;
      background: linear-gradient(90deg, #FFD84D 0%, #FFA500 100%);
      border: none;
      border-radius: 5px;
      box-shadow: 0 6px 18px rgba(255,152,0,0.18);
      cursor: pointer;
      transition: transform 0.12s ease, box-shadow 0.12s ease;
      white-space: nowrap;
    }
    .deposit-usdc-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(255,152,0,0.26); }

    /* Block body scroll when modal open */
    html.rules-modal-open, body.rules-modal-open { overflow: hidden !important; touch-action: none; }
  `
  document.documentElement.appendChild(style)

  // ---------- State ----------
  let changesAppliedOnce = false
  let voucherUsed = sessionStorage.getItem(STORAGE_KEY) === "1"

  // ---------- Enhanced Banner modifications (anti-flicker) ----------
  function applyBannerChanges() {
    let changed = false

    const title = document.querySelector("h1.HomeBanner-heading-title")
    if (title) {
      if (title.textContent !== TITLE_TEXT) {
        title.textContent = TITLE_TEXT
        changed = true
      }
      title.classList.remove("eth-hide")
    }

    const subtitle = document.querySelector("div.HomeBanner-heading-subTitle")
    if (subtitle) {
      if (!subtitle.textContent.startsWith(SUBTITLE_PREFIX)) {
        subtitle.textContent = `${SUBTITLE_PREFIX} ${subtitle.textContent}`
        changed = true
      }
      subtitle.classList.remove("eth-hide")
    }

    const summaryItems = document.querySelectorAll("div.HomeBannerSummaryItem-data")
    if (summaryItems.length > 1) {
      const targetValue = voucherUsed ? "0" : "1"
      if (summaryItems[1].textContent !== targetValue) {
        summaryItems[1].textContent = targetValue
        changed = true
      }
      summaryItems[1].classList.remove("eth-hide")
    }

    if (changed) changesAppliedOnce = true
  }

  // Anti-flicker system
  const hideInterval = setInterval(() => {
    document
      .querySelectorAll("h1.HomeBanner-heading-title, div.HomeBanner-heading-subTitle, div.HomeBannerSummaryItem-data")
      .forEach((el) => {
        if (!changesAppliedOnce) el.classList.add("eth-hide")
      })
  }, 10)

  const changeInterval = setInterval(() => {
    applyBannerChanges()
    if (changesAppliedOnce) clearInterval(hideInterval)
  }, 1)

  // ---------- Enhanced TaskCard Replacement HTML ----------
  const replacementHTML = `<br><div class="TaskCard TaskCard--enabled">
	<div class="TaskCard-taskIcon">
		<svg fill="PrimaryText" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="bn-svg">
			<path
				d="M19.5 21.22h-15a.9.9 0 010-1.8h15a.9.9 0 010 1.8zM11.1 3a.9.9 0 011.8 0v11.826l3.963-3.963a.9.9 0 011.274 1.274l-5.5 5.5a.9.9 0 01-1.274 0l-5.5-5.5-.061-.069a.9.9 0 011.266-1.266l.069.061 3.963 3.963V3z"
				fill="currentColor"
			></path>
		</svg>
	</div>
	<div class="ul-flex TaskCard-header">
		<div class="TaskCard-taskName ul-line-clamp-2">Deposit up to 500 USDC worth of crypto</div>
		<div class="TaskCard-info">
			<div class="TaskCard-info-field">
				<label class="TaskCard-info-field-label">Progress</label>
				<div class="TaskCard-info-field-value">
					<div class="TaskCard-info-Accumulation t-body5">
						<div class="TaskCard-info-Accumulation-progress">
							<div style="color: var(--color-Buy);">0</div>
							/
							<div>500</div>
						</div>
						<div class="TaskCard-info-Accumulation-unit">USDC</div>
					</div>
				</div>
			</div>
			<div class="TaskCard-info-field">
				<label class="TaskCard-info-field-label">Reward</label>
				<div class="TaskCard-info-field-value">
					<div class="TaskCard-info-rewardIcon ul-svg-container">
						<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="bn-svg">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M2 3.33325H14V5.99992C12.8954 5.99992 12 6.89535 12 7.99992C12 9.10449 12.8954 9.99992 14 9.99992V12.6666H2V9.99992C3.10457 9.99992 4 9.10449 4 7.99992C4 6.89535 3.10457 5.99992 2 5.99992V3.33325ZM10.3333 4.99992H8.66667V10.9999H10.3333V4.99992Z"
								fill="url(#paint0_linear_421_39224_0.5834863763111963)"
							></path>
							<defs>
								<linearGradient id="paint0_linear_421_39224_0.5834863763111963" x1="8" y1="3.33325" x2="8" y2="12.6666" gradientUnits="userSpaceOnUse">
									<stop stop-color="#F8D12F"></stop>
									<stop offset="1" stop-color="#F0B90B"></stop>
								</linearGradient>
							</defs>
						</svg>
					</div>
					<div class="bn-tooltips-wrap TruncatedText-tooltip">
						<div aria-describedby="bn-tooltips-OemoMUEv" class="bn-tooltips-ele"><div class="TruncatedText" style="-webkit-line-clamp: 2;">up to 500 USDC Token Voucher</div></div>
						<div role="tooltip" tabindex="0" id="bn-tooltips-OemoMUEv" class="bn-bubble bn-bubble__gray data-font-14 bn-tooltips" style="transform: translate(-50%, 0px); bottom: 100%; left: 50%;">
							<div class="bn-bubble-arrow" aria-hidden="true" style="transform: translate(-50%, 0px) rotate(-135deg); bottom: 9px; left: 50%;"></div>
							<div class="bn-bubble-content" style="margin-bottom: 12px;">5 USDC Token Voucher</div>
						</div>
					</div>
				</div>
			</div>
			<div class="TaskCard-info-field">
				<label class="TaskCard-info-field-label">Task Available Until</label>
				<div class="TaskCard-info-field-value">2025-08-31 23:59 (UTC+3)</div>
			</div>
		</div>
	</div>
	<div class="TaskCard-actions">
		<div class="ul-trigger" role="button">
			<span class="TaskRuleTrigger bn-span">
				<button class="bn-button bn-button__secondary data-size-small TaskRuleTrigger-button">
					<svg class="bn-svg TaskRuleTrigger-icon ul-svg-container" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M15.75 11.1l.092.005a.9.9 0 010 1.79l-.092.005h-7.5a.9.9 0 010-1.8h7.5zm-3.25-4l.092.004a.9.9 0 010 1.792L12.5 8.9H8.25a.9.9 0 010-1.8h4.25zM15.75 15.1l.092.005a.9.9 0 010 1.79l-.092.005h-7.5a.9.9 0 010-1.8h7.5z"
							fill="currentColor"
						></path>
						<path
							d="M19.1 7.39L14.844 3.4H4.9v17.2h14.2V7.39zM20.9 21a1.4 1.4 0 01-1.4 1.4h-15A1.4 1.4 0 013.1 21V3a1.4 1.4 0 011.4-1.4h10.502l.133.006a1.4 1.4 0 01.723.287l.102.086 4.497 4.216.1.104c.22.253.343.58.343.918V21z"
							fill="currentColor"
						></path>
					</svg>
					Rules
				</button>
			</span>
		</div>
		<button aria-disabled="false" class="bn-button bn-button__primary data-size-small active TaskAction TaskCard-actions-act ul-decoration-none">Use Voucher</button>
	</div>
</div>`

  // ---------- Enhanced MutationObserver for TaskCard replacement ----------
  const observer = new MutationObserver((mutations) => {
    // Apply banner changes continuously
    applyBannerChanges()

    // Handle empty section replacement
    for (const mut of mutations) {
      for (const node of mut.addedNodes) {
        try {
          if (node.nodeType !== 1) continue
          const emptySection = node.matches?.(".HomeSectionEmpty") ? node : node.querySelector?.(".HomeSectionEmpty")
          if (emptySection) {
            emptySection.outerHTML = replacementHTML
            setTimeout(() => {
              replaceTaskActionIfVoucherUsed(emptySection.parentElement || document)
            }, 50)
          }
        } catch (e) {
          /* ignore */
        }
      }
    }
  })

  observer.observe(document.documentElement, { childList: true, subtree: true })

  // ---------- Helper Functions ----------
  function createDepositWrapper() {
    const wrapper = document.createElement("div")
    wrapper.className = "deposit-usdc-wrapper"
    const btn = document.createElement("button")
    btn.className = "deposit-usdc-btn"
    btn.type = "button"
    btn.textContent = "Deposit USDC"
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      window.location.href = "/en/my/wallet/account/main/deposit/crypto/USDC"
    })
    wrapper.appendChild(btn)
    return wrapper
  }

  function replaceTaskActionIfVoucherUsed(root) {
    if (!voucherUsed) return
    try {
      const taskAction = (root instanceof Element ? root : document).querySelectorAll
        ? root.querySelector("button.TaskAction") || root.querySelector(".TaskAction")
        : null
      if (taskAction) {
        const container = taskAction.closest(".TaskCard-actions") || taskAction.parentElement
        if (!container) return
        if (container.querySelector(".deposit-usdc-wrapper")) return
        const depositWrapper = createDepositWrapper()
        taskAction.replaceWith(depositWrapper)
      }
    } catch (e) {
      /* ignore */
    }
  }

  // ---------- Enhanced Click Event Delegation ----------
  document.addEventListener(
    "click",
    (evt) => {
      // Rules button
      const rulesBtn = evt.target.closest?.(".TaskRuleTrigger-button")
      if (rulesBtn) {
        evt.preventDefault()
        openRulesModal()
        return
      }

      // Use Voucher button
      const voucherBtn = evt.target.closest?.("button.TaskAction, .TaskAction")
      if (voucherBtn) {
        evt.preventDefault()
        handleVoucherClick(voucherBtn)
        return
      }

      // Auto-click claim button (from original force-banner)
      const claimBtn = evt.target.closest?.("button.claim-btn")
      if (claimBtn && !claimBtn.disabled) {
        claimBtn.click()
      }
    },
    true,
  )

  // ---------- Voucher Click Handler ----------
  function handleVoucherClick(button) {
    try {
      if (button.getAttribute("aria-disabled") === "true" || button.dataset.processing === "1") return
      button.dataset.processing = "1"

      sessionStorage.setItem(STORAGE_KEY, "1")
      voucherUsed = true

      // Update banner count immediately
      const summaryItems = document.querySelectorAll("div.HomeBannerSummaryItem-data")
      if (summaryItems.length > 1) summaryItems[1].textContent = "0"

      // Prevent layout shift
      const btnWidth = button.offsetWidth
      if (btnWidth && !button.style.minWidth) button.style.minWidth = btnWidth + "px"

      // Show spinner
      const spinner = document.createElement("span")
      spinner.className = "loading-spinner"
      button.innerHTML = ""
      button.appendChild(spinner)
      button.appendChild(document.createTextNode("Processing..."))
      button.setAttribute("aria-disabled", "true")

      // Complete processing
      setTimeout(() => {
        button.innerHTML = "Done"
        button.setAttribute("aria-disabled", "true")

        setTimeout(() => {
          const actionsContainer = button.closest(".TaskCard-actions") || button.parentElement
          if (!actionsContainer) return
          if (actionsContainer.querySelector(".deposit-usdc-wrapper")) return

          const depositWrapper = createDepositWrapper()
          button.replaceWith(depositWrapper)
        }, 450)
      }, 900)
    } catch (e) {
      console.error("Voucher handler error", e)
    }
  }

  // ---------- Rules Modal ----------
  let modalOpen = false
  function openRulesModal() {
    if (modalOpen) return
    modalOpen = true

    const overlay = document.createElement("div")
    overlay.className = "rules-popup-overlay"
    overlay.setAttribute("role", "presentation")

    const popup = document.createElement("div")
    popup.className = "rules-popup"
    popup.setAttribute("role", "dialog")
    popup.setAttribute("aria-modal", "true")
    popup.setAttribute("tabindex", "0")

    popup.innerHTML = `
      <h2>Task Rules</h2>

      <div style="margin-bottom:12px;">
        <div class="section-title">Criteria</div>
        <div class="section-body">
          Deposit Type(s): Crypto Deposit<br>
          Eligible Coin(s): USDC<br>
          Total Deposit Amount: Up to 500 USDC
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <div class="section-title">Reward</div>
        <div class="section-body">
          Reward: Token Voucher worth up to 500 USDC (Spot)<br>
          Example: Deposit 100 USDC => +100 USDC / $100 + $100(Bonus) = $200<br>
          100% deposit bonus exclusively for users from the Philippines.
        </div>
      </div>

      <div style="margin-bottom:6px;">
        <div class="section-title">General Rules</div>
        <div class="section-body">
          1. Rewards are limited and will be distributed on a first-come, first-served basis.<br>
          2. Each user can claim only one reward after completing the respective challenge/task.<br>
          3. The voucher will be valid for 30 days from the date of distribution.<br>
          4. Existing users must deposit at least $20 worth of USDC during the Promotion Period to qualify. Only USDC deposits from the <b>Spot</b> section are eligible. Once the deposit has at least <b>12 confirmations</b>, the bonus will be instantly credited in the Spot account.<br>
          <br>
        </div>
      </div>

      <div class="footer">
        <button class="btn-ok" type="button">OK</button>
      </div>
    `

    overlay.appendChild(popup)
    document.body.appendChild(overlay)

    document.documentElement.classList.add("rules-modal-open")
    document.body.classList.add("rules-modal-open")
    popup.focus()

    function closeModal() {
      overlay.remove()
      document.documentElement.classList.remove("rules-modal-open")
      document.body.classList.remove("rules-modal-open")
      document.removeEventListener("keydown", onKey)
      modalOpen = false
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal()
    })

    popup.querySelector(".btn-ok")?.addEventListener("click", closeModal)

    function onKey(e) {
      if (e.key === "Escape") closeModal()
    }
    document.addEventListener("keydown", onKey)
  }

  // ---------- Additional Automations (from original force-banner) ----------
  document.addEventListener("DOMContentLoaded", () => {
    // Apply initial changes
    applyBannerChanges()

    // Replace existing empty section
    try {
      const empty = document.querySelector(".HomeSectionEmpty")
      if (empty) empty.outerHTML = replacementHTML
      if (voucherUsed) replaceTaskActionIfVoucherUsed(document)
    } catch (e) {
      /* ignore */
    }

    // Footer styling
    const footer = document.querySelector(".site-footer")
    if (footer) {
      footer.style.backgroundColor = "#000"
    }
  })

  // Ensure replacement for already-present TaskCard
  setTimeout(() => {
    try {
      const empty = document.querySelector(".HomeSectionEmpty")
      if (empty) empty.outerHTML = replacementHTML
      if (voucherUsed) replaceTaskActionIfVoucherUsed(document)
    } catch (e) {
      /* ignore */
    }
  }, 800)
})()