// ==UserScript==
// @name         KickBot v1
// @namespace    http://tampermonkey.net/
// @version      2025-08-16
// @description  Kicktools v1
// @author       0encrypt3d
// @match        https://kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546133/KickBot%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/546133/KickBot%20v1.meta.js
// ==/UserScript==

(function () {
  const SCRIPT_VERSION = "1.0"
  const STORED_VERSION_KEY = "kickToolsVersion"
  const originalFetch = window.fetch

  let chatroomId = null
  let channelId = null
  let isMinimized = false
  let isDragging = false
  let activeTab = "info"
  const dragOffset = { x: 0, y: 0 }

  window.bearerTokenGlobal = localStorage.getItem("bearerToken") || null

  const tokens = [
    "102883812|aqlqreg3KoFaeAXAPtqpVzbTDjAl4U2zp4TCKElS",
    "102992239|WyHct1mjAWsbArmEE9JrQlkEjHV3aevHWtyEA0k7",
    "104044538|YablToeFDKAw852J08kdmdGX2FecfNBhIanERXni",
    "105208030|odbkcDrx5N6gr1o6zcEFyzUQVkAl4p2Tjgrsk5Qy",
    "106462309|cZ2bO6nF0tgAsoNvboI11N47UfnP2Ynf1NyjZzhZ",
    "108546097|bfD5kMnkFomr0ta5SBg9GbNgfvnzrzEnZLoxhg6c",
    "108785201|lLhbbibbZf6sLMpMsyukYdhfmDmiBPUhMfbhl1pO",
    "110512420|AUiaRYgWDnE6x0qu7sQ8btUEE2NxL83XvB0eJWxK",
    "110545037|m9nV1hma1xTiVdPQNR8uZsbsRD180rffFJllgiLW",
    "110692403|IRcdL31IIqoeAwLSqI8gvOnH3V5mHOoeqIhSnhMc",
    "112410112|OBJNKBuwC89OxW5eduqfhDIDIcAc07dbWsB0UZNn",
    "113384819|t3OKPtxKyEwShuLvhQcBhbt4U92FXufvkQX51fnK",
    "115655128|c0G3Z5D4FB4CtJYkaoz7657XQiQMQd8KHz9BvGxG",
    "116363565|9lKuxzzP3fSXbEXpwdC6BgBNS3qLkcs3wN1eBW7u",
    "118119922|8RZWMshHTrD8WAexIVKVmKgto3xRpS1O9nyq8Aal",
  ]

  let tokenIndex = 0

  /** Crear panel con diseño estilo Kick.com y pestañas */
  function createPanel() {
    const panel = document.createElement("div")
    panel.id = "kick-tools-panel"

    Object.assign(panel.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: "9999",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
      color: "#ffffff",
      padding: "0",
      border: "1px solid #333",
      borderRadius: "16px",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: "14px",
      minWidth: "450px",
      maxWidth: "520px",
      boxShadow:
        "0 25px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(83, 252, 24, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      overflow: "hidden",
      cursor: "move",
      backdropFilter: "blur(25px)",
    })

    panel.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
        padding: 20px 24px;
        border-bottom: 1px solid rgba(83, 252, 24, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        position: relative;
        overflow: hidden;
      " id="panel-header">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #53fc18, #40d916, transparent);
          opacity: 0.8;
        "></div>
        <div style="
          font-weight: 700;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: #53fc18;
        ">
          <!-- Agrandé el logo de 24px a 40px -->
          <img src="https://kick.com/img/kick-logo.svg" alt="Kick" style="
            width: 130;
            height: 30px;
            filter: brightness(0) saturate(100%) invert(84%) sepia(95%) saturate(4841%) hue-rotate(75deg) brightness(101%) contrast(96%);
            drop-shadow: 0 0 10px rgba(83, 252, 24, 0.4);
          ">
          <span style="
            font-size: 11px;
            background: linear-gradient(135deg, #53fc18, #40d916);
            color: #000;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: 700;
            box-shadow: 0 2px 8px rgba(83, 252, 24, 0.3);
          ">v${SCRIPT_VERSION}</span>
        </div>
        <div style="
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.3s ease;
          color: #888;
          cursor: pointer;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        " id="minimize-btn">−</div>
      </div>

      <div style="
        display: flex;
        height: 420px;
      ">
        <!-- Quité los iconos de los botones y mejoré el diseño -->
        <div style="
          width: 100px;
          background: linear-gradient(180deg, #0a0a0a 0%, #151515 100%);
          border-right: 1px solid rgba(83, 252, 24, 0.1);
          display: flex;
          flex-direction: column;
          padding: 20px 0;
          gap: 12px;
        " id="sidebar">
          <div class="tab-btn" data-tab="info" style="
            padding: 16px 12px;
            text-align: center;
            cursor: pointer;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(135deg, #53fc18, #40d916);
            color: #000;
            margin: 0 12px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(83, 252, 24, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(83, 252, 24, 0.3);
          ">
            INFO
          </div>
          <div class="tab-btn" data-tab="channels" style="
            padding: 16px 12px;
            text-align: center;
            cursor: pointer;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(255, 255, 255, 0.08);
            color: #888;
            margin: 0 12px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
          ">
            CANALES
          </div>
          <div class="tab-btn" data-tab="spam" style="
            padding: 16px 12px;
            text-align: center;
            cursor: pointer;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(255, 255, 255, 0.08);
            color: #888;
            margin: 0 12px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
          ">
            SPAM
          </div>
          <div class="tab-btn" data-tab="multi" style="
            padding: 16px 12px;
            text-align: center;
            cursor: pointer;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(255, 255, 255, 0.08);
            color: #888;
            margin: 0 12px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
          ">
            MULTI
          </div>
          <div class="tab-btn" data-tab="v1" style="
            padding: 16px 12px;
            text-align: center;
            cursor: pointer;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(255, 255, 255, 0.08);
            color: #888;
            margin: 0 12px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
          ">
            V1
          </div>
        </div>

        <!-- Mejoré el área de contenido con mejor padding y efectos -->
        <div id="panel-content" style="
          flex: 1;
          padding: 24px;
          transition: all 0.4s ease;
          background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
          overflow-y: auto;
          position: relative;
        ">
          <div id="info-tab" class="tab-content">
            <div style="
              display: flex;
              flex-direction: column;
              gap: 20px;
            ">
              <div style="
                background: linear-gradient(135deg, rgba(83, 252, 24, 0.12) 0%, rgba(83, 252, 24, 0.06) 100%);
                padding: 20px;
                border-radius: 16px;
                border: 1px solid rgba(83, 252, 24, 0.25);
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(10px);
              ">
                <div style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 6px;
                  height: 100%;
                  background: linear-gradient(180deg, #53fc18, #40d916);
                  border-radius: 0 3px 3px 0;
                "></div>
                <div style="
                  font-size: 12px;
                  color: #53fc18;
                  margin-bottom: 10px;
                  text-transform: uppercase;
                  letter-spacing: 1.5px;
                  font-weight: 700;
                ">CHATROOM ID | FOR SPAM</div>
                <div style="
                  font-weight: 700;
                  font-family: 'SF Mono', Monaco, monospace;
                  font-size: 18px;
                  color: #fff;
                  text-shadow: 0 0 15px rgba(83, 252, 24, 0.4);
                " id="chatIdDisplay">Detectando...</div>
              </div>
              <div style="
                background: linear-gradient(135deg, rgba(83, 252, 24, 0.12) 0%, rgba(83, 252, 24, 0.06) 100%);
                padding: 20px;
                border-radius: 16px;
                border: 1px solid rgba(83, 252, 24, 0.25);
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(10px);
              ">
                <div style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 6px;
                  height: 100%;
                  background: linear-gradient(180deg, #53fc18, #40d916);
                  border-radius: 0 3px 3px 0;
                "></div>
                <div style="
                  font-size: 12px;
                  color: #53fc18;
                  margin-bottom: 10px;
                  text-transform: uppercase;
                  letter-spacing: 1.5px;
                  font-weight: 700;
                ">CHANNEL ID | FOR VIEWS</div>
                <div style="
                  font-weight: 700;
                  font-family: 'SF Mono', Monaco, monospace;
                  font-size: 18px;
                  color: #fff;
                  text-shadow: 0 0 15px rgba(83, 252, 24, 0.4);
                " id="channelIdDisplay">Detectando...</div>
              </div>
            </div>
          </div>

          <div id="channels-tab" class="tab-content" style="display: none;">
            <div style="margin-bottom: 16px;">
              <button id="refresh-channels" style="
                width: 100%;
                padding: 12px 16px;
                background: linear-gradient(135deg, #53fc18, #40d916);
                color: #000;
                border: none;
                border-radius: 8px;
                font-weight: 700;
                cursor: pointer;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(83, 252, 24, 0.3);
              ">🔄 Actualizar Canales</button>
            </div>
            <div id="channels-list" style="
              font-size: 13px;
              line-height: 1.5;
            ">Haz clic en "Actualizar Canales" para listar los canales seguidos...</div>
          </div>

          <div id="spam-tab" class="tab-content" style="display: none;">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <label style="
                  font-size: 11px;
                  color: #53fc18;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  font-weight: 600;
                  display: block;
                  margin-bottom: 8px;
                ">MENSAJE</label>
                <textarea id="messageInput" rows="3" style="
                  width: 100%;
                  background: rgba(255, 255, 255, 0.05);
                  border: 1px solid rgba(83, 252, 24, 0.2);
                  border-radius: 8px;
                  color: #fff;
                  padding: 12px;
                  font-family: inherit;
                  font-size: 14px;
                  resize: vertical;
                  transition: all 0.3s ease;
                " placeholder="Escribe tu mensaje aquí..."></textarea>
              </div>

              <div>
                <label style="
                  font-size: 11px;
                  color: #53fc18;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  font-weight: 600;
                  display: block;
                  margin-bottom: 8px;
                ">CANTIDAD</label>
                <input type="number" id="countInput" value="10" min="1" max="100" style="
                  width: 100%;
                  background: rgba(255, 255, 255, 0.05);
                  border: 1px solid rgba(83, 252, 24, 0.2);
                  border-radius: 8px;
                  color: #fff;
                  padding: 12px;
                  font-family: inherit;
                  font-size: 14px;
                  transition: all 0.3s ease;
                ">
              </div>

              <button id="startSpam" style="
                width: 100%;
                padding: 14px 16px;
                background: linear-gradient(135deg, #53fc18, #40d916);
                color: #000;
                border: none;
                border-radius: 8px;
                font-weight: 700;
                cursor: pointer;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(83, 252, 24, 0.3);
              ">🚀 ENVIAR MENSAJES</button>
            </div>
          </div>

          <div id="multi-tab" class="tab-content" style="display: none;">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div style="
                background: linear-gradient(135deg, rgba(83, 252, 24, 0.12) 0%, rgba(83, 252, 24, 0.06) 100%);
                padding: 16px;
                border-radius: 12px;
                border: 1px solid rgba(83, 252, 24, 0.25);
                margin-bottom: 8px;
              ">
                <div style="
                  font-size: 11px;
                  necesitas la version premiun
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  font-weight: 600;
                  margin-bottom: 8px;
                ">⚡ MULTSPAM - FREE VERSION</div>
                <div style="
                  font-size: 12px;
                  color: #ccc;
                  line-height: 1.4;
                ">Esta version es gratis ya que esta en beta, si deseas que los mensajes sean mas rapidos y muchos mas usuarios necesitas la version premiun.</div>
              </div>

              <div>
                <label style="
                  font-size: 11px;
                  color: #53fc18;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  font-weight: 600;
                  display: block;
                  margin-bottom: 8px;
                ">MENSAJE</label>
                <textarea id="multiMessageInput" rows="3" style="
                  width: 100%;
                  background: rgba(255, 255, 255, 0.05);
                  border: 1px solid rgba(83, 252, 24, 0.2);
                  border-radius: 8px;
                  color: #fff;
                  padding: 12px;
                  font-family: inherit;
                  font-size: 14px;
                  resize: vertical;
                  transition: all 0.3s ease;
                " placeholder="Escribe tu mensaje aquí..."></textarea>
              </div>

              <div>
                <label style="
                  font-size: 11px;
                  color: #53fc18;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  font-weight: 600;
                  display: block;
                  margin-bottom: 8px;
                ">CANTIDAD</label>
                <input type="number" id="multiCountInput" value="15" min="1" max="200" style="
                  width: 100%;
                  background: rgba(255, 255, 255, 0.05);
                  border: 1px solid rgba(83, 252, 24, 0.2);
                  border-radius: 8px;
                  color: #fff;
                  padding: 12px;
                  font-family: inherit;
                  font-size: 14px;
                  transition: all 0.3s ease;
                ">
              </div>

              <div style="
                background: rgba(0, 0, 0, 0.3);
                padding: 12px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 12px;
                color: #888;
              ">
                <div style="color: #53fc18; font-weight: 600; margin-bottom: 4px;"> | FREE VERSION</div>
              </div>

              <button id="startMultiSpam" style="
                width: 100%;
                padding: 14px 16px;
                background: linear-gradient(135deg, #53fc18, #40d916);
                color: #000;
                border: none;
                border-radius: 8px;
                font-weight: 700;
                cursor: pointer;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(83, 252, 24, 0.3);
              ">⚡ ENVIAR MULTISPAM</button>
            </div>
          </div>

          <div id="v1-tab" class="tab-content" style="display: none;">
            <div style="
              display: flex;
              flex-direction: column;
              gap: 20px;
              text-align: center;
            ">
              <div style="
                padding: 24px;
                border-radius: 16px;
                border: 1px solid rgba(83, 252, 24, 0.25);
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(10px);
              ">
                <div style="
                  position: absolute;
                  top: 0;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 80%;
                  height: 3px;
                  background: linear-gradient(90deg, transparent, #53fc18, #40d916, transparent);
                  border-radius: 0 0 3px 3px;
                "></div>

                <div style="
                  background: rgba(0, 0, 0, 0.3);
                  padding: 16px;
                  border-radius: 12px;
                  border: 1px solid rgba(83, 252, 24, 0.2);
                  margin-bottom: 16px;
                ">
                  <div style="
                    font-size: 11px;
                    color: #53fc18;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                  ">DISCORD</div>
                  <div style="
                    font-family: 'SF Mono', Monaco, monospace;
                    font-size: 14px;
                    color: #fff;
                    font-weight: 600;
                  ">0encrypt3d</div>
                </div>

                <a href="https://github.com/0encrypt3d" target="_blank" style="
                  display: inline-block;
                  width: 100%;
                  padding: 12px 16px;
                  background: linear-gradient(135deg, #53fc18, #40d916);
                  color: #000;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 700;
                  font-size: 13px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 12px rgba(83, 252, 24, 0.3);
                ">DISCORD</a>
              </div>

              <div style="
                font-size: 11px;
                color: #666;
                text-align: center;
                font-style: italic;
              ">
                Kick Tools v${SCRIPT_VERSION}<br> Desarrollado por 0encrypt3d
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    const style = document.createElement("style")
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 10px rgba(83, 252, 24, 0.4); }
        50% { box-shadow: 0 0 30px rgba(83, 252, 24, 0.8); }
      }
      #kick-tools-panel:hover {
        border-color: rgba(83, 252, 24, 0.6);
        box-shadow: 0 30px 100px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(83, 252, 24, 0.4);
        transform: translateY(-3px);
      }
      #minimize-btn:hover {
        color: #53fc18 !important;
        background: rgba(83, 252, 24, 0.15) !important;
        transform: scale(1.15);
        border-color: rgba(83, 252, 24, 0.3) !important;
      }
      .tab-btn:hover {
        background: linear-gradient(135deg, #53fc18, #40d916) !important;
        color: #000 !important;
        transform: translateX(6px) scale(1.02);
        box-shadow: 0 8px 25px rgba(83, 252, 24, 0.5) !important;
        border-color: rgba(83, 252, 24, 0.4) !important;
      }
      #panel-content::-webkit-scrollbar {
        width: 10px;
      }
      #panel-content::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.08);
        border-radius: 6px;
      }
      #panel-content::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #53fc18, #40d916);
        border-radius: 6px;
        border: 2px solid transparent;
        background-clip: content-box;
      }
      #refresh-channels:hover, #startSpam:hover, #startMultiSpam:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 10px 30px rgba(83, 252, 24, 0.5) !important;
      }
      #messageInput:focus, #countInput:focus, #multiMessageInput:focus, #multiCountInput:focus {
        border-color: #53fc18 !important;
        box-shadow: 0 0 0 3px rgba(83, 252, 24, 0.25) !important;
        outline: none;
      }
    `
    document.head.appendChild(style)

    setupEventListeners(panel)
    document.body.appendChild(panel)
  }

  function setupEventListeners(panel) {
    const header = panel.querySelector("#panel-header")
    const content = panel.querySelector("#panel-content")
    const minimizeBtn = panel.querySelector("#minimize-btn")
    const tabBtns = panel.querySelectorAll(".tab-btn")
    const refreshChannelsBtn = panel.querySelector("#refresh-channels")
    const startSpamBtn = panel.querySelector("#startSpam")
    const startMultiSpamBtn = panel.querySelector("#startMultiSpam")

    // Tab switching
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab
        switchTab(tab)
      })
    })

    // Dragging functionality
    header.addEventListener("mousedown", (e) => {
      if (e.target === minimizeBtn) return
      isDragging = true
      const rect = panel.getBoundingClientRect()
      dragOffset.x = e.clientX - rect.left
      dragOffset.y = e.clientY - rect.top
      panel.style.transition = "none"
      document.addEventListener("mousemove", handleDrag)
      document.addEventListener("mouseup", handleDragEnd)
    })

    // Minimize functionality
    minimizeBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      isMinimized = !isMinimized
      if (isMinimized) {
        content.style.height = "0"
        content.style.padding = "0 20px"
        content.style.opacity = "0"
        minimizeBtn.textContent = "+"
        minimizeBtn.style.transform = "rotate(45deg)"
      } else {
        content.style.height = "auto"
        content.style.padding = "24px"
        content.style.opacity = "1"
        minimizeBtn.textContent = "−"
        minimizeBtn.style.transform = "rotate(0deg)"
      }
    })

    // Refresh channels functionality
    refreshChannelsBtn.addEventListener("click", listarCanales)

    // Spam functionality
    startSpamBtn.addEventListener("click", async () => {
      const message = document.getElementById("messageInput").value.trim()
      const count = Number.parseInt(document.getElementById("countInput").value)

      if (!chatroomId) {
        alert("❌ Chatroom ID no detectado aún")
        return
      }

      if (!window.bearerTokenGlobal) {
        alert("❌ No se encontró Bearer Token en localStorage")
        return
      }

      if (!message) {
        alert("❌ Escribe un mensaje primero")
        return
      }

      startSpamBtn.textContent = "⏳ ENVIANDO..."
      startSpamBtn.disabled = true

      for (let i = 0; i < count; i++) {
        await sendMessage(chatroomId, message)
        await new Promise((resolve) => setTimeout(resolve, 100)) // Small delay between messages
      }

      startSpamBtn.textContent = "🚀 ENVIAR MENSAJES"
      startSpamBtn.disabled = false
    })

    // Multi-spam button event listener
    startMultiSpamBtn.addEventListener("click", async () => {
      const message = document.getElementById("multiMessageInput").value.trim()
      const count = Number.parseInt(document.getElementById("multiCountInput").value)

      if (!chatroomId) {
        alert("❌ Chatroom ID no detectado aún")
        return
      }

      if (!message) {
        alert("❌ Escribe un mensaje primero")
        return
      }

      startMultiSpamBtn.textContent = "⏳ ENVIANDO MULTISPAM..."
      startMultiSpamBtn.disabled = true

      for (let i = 0; i < count; i++) {
        const token = tokens[tokenIndex]
        tokenIndex = (tokenIndex + 1) % tokens.length // Rotate through tokens
        await sendMessageWithToken(chatroomId, message, token)
        await new Promise((resolve) => setTimeout(resolve, 0)) // Small delay between messages
      }

      startMultiSpamBtn.textContent = "⚡ ENVIAR MULTISPAM"
      startMultiSpamBtn.disabled = false
    })
  }

  function switchTab(tab) {
    activeTab = tab

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      if (btn.dataset.tab === tab) {
        btn.style.background = "linear-gradient(135deg, #53fc18, #40d916)"
        btn.style.color = "#000"
        btn.style.boxShadow = "0 6px 20px rgba(83, 252, 24, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
        btn.style.borderColor = "rgba(83, 252, 24, 0.3)"
      } else {
        btn.style.background = "rgba(255, 255, 255, 0.08)"
        btn.style.color = "#888"
        btn.style.boxShadow = "none"
        btn.style.borderColor = "rgba(255, 255, 255, 0.1)"
      }
    })

    // Show/hide tab content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.style.display = "none"
    })
    document.getElementById(`${tab}-tab`).style.display = "block"
  }

  async function listarCanales() {
    const channelsList = document.getElementById("channels-list")
    const canales = document.querySelectorAll("a[data-testid^='sidebar-following-channel']")

    if (canales.length === 0) {
      channelsList.innerHTML = "❌ No se detectaron canales en la barra lateral."
      return
    }

    channelsList.innerHTML =
      "<div style='color: #53fc18; font-weight: 600; margin-bottom: 8px;'>🔍 Cargando canales...</div>"

    let results = ""
    for (const a of canales) {
      const username = a.getAttribute("href")?.replace("/", "")
      if (username) {
        results += `<div style="margin-bottom: 6px; padding: 6px; background: #0f0f0f; border-radius: 4px; border-left: 2px solid #53fc18;">🔹 ${username} → <span style="color: #888;">Cargando...</span></div>`
        channelsList.innerHTML = results

        try {
          const res = await fetch(`https://kick.com/api/v2/channels/${username}`)
          const data = await res.json()

          if (data?.chatroom?.id) {
            results = results.replace(
              `${username} → <span style="color: #888;">Cargando...</span>`,
              `${username} → <span style="color: #53fc18; font-family: monospace;">${data.chatroom.id}</span>`,
            )
          } else {
            results = results.replace(
              `${username} → <span style="color: #888;">Cargando...</span>`,
              `${username} → <span style="color: #ff4444;">❌ No encontrado</span>`,
            )
          }
        } catch (err) {
          results = results.replace(
            `${username} → <span style="color: #888;">Cargando...</span>`,
            `${username} → <span style="color: #ff8800;">⚠️ Error</span>`,
          )
        }

        channelsList.innerHTML = results
        await new Promise((resolve) => setTimeout(resolve, 200)) // Small delay between requests
      }
    }
  }

  async function sendMessage(chatroomId, text) {
    const url = `https://kick.com/api/v2/messages/send/${chatroomId}`
    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${window.bearerTokenGlobal}`,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.4472.124 Safari/537.36",
    }

    const body = JSON.stringify({
      content: text,
      type: "message",
    })

    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
      })

      if (res.ok) {
        console.log(`✅ Mensaje enviado: ${text}`)
      } else {
        console.error(`❌ Error ${res.status}: ${await res.text()}`)
      }
    } catch (err) {
      console.error("❌ Error al enviar:", err)
    }
  }

  async function sendMessageWithToken(chatroomId, text, token) {
    const url = `https://kick.com/api/v2/messages/send/${chatroomId}`
    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.4472.124 Safari/537.36",
    }

    const body = JSON.stringify({
      content: text,
      type: "message",
    })

    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
      })

      if (res.ok) {
        console.log(`✅ Mensaje enviado con token: ${text}`)
      } else {
        console.error(`❌ Error ${res.status}: ${await res.text()}`)
      }
    } catch (err) {
      console.error("❌ Error al enviar:", err)
    }
  }

  /** Mostrar valores en el panel con animación */
  function updatePanel() {
    const chatEl = document.getElementById("chatIdDisplay")
    const channelEl = document.getElementById("channelIdDisplay")

    if (chatEl && chatroomId) {
      chatEl.style.opacity = "0.5"
      setTimeout(() => {
        chatEl.textContent = chatroomId
        chatEl.style.opacity = "1"
      }, 150)
    }

    if (channelEl && channelId) {
      channelEl.style.opacity = "0.5"
      setTimeout(() => {
        channelEl.textContent = channelId
        channelEl.style.opacity = "1"
      }, 150)
    }
  }

  /** Hook a fetch para detectar Chatroom ID */
  window.fetch = async function (...args) {
    const [resource, config] = args
    let url = ""
    if (typeof resource === "string") {
      url = resource
    } else if (resource instanceof Request) {
      url = resource.url
    }

    if (url.includes("/api/v2/channels/") && url.includes("/chatroom")) {
      const response = await originalFetch.apply(this, args)
      const clonedResponse = response.clone()
      try {
        const data = await clonedResponse.json()
        const newId = data.id
        if (newId && newId !== chatroomId) {
          chatroomId = newId
          updatePanel()
        }
      } catch (e) {
        console.error(`[Kick Tools] Error parseando chatroom: ${e.message}`)
      }
      return response
    }

    return originalFetch.apply(this, args)
  }

  /** Buscar Channel ID en scripts de la página */
  function extractChannelId() {
    document.querySelectorAll("script").forEach((script) => {
      const content = script.textContent
      if (content.includes("self.__next_f.push")) {
        const match = content.match(/\{\\"data\\":\{\\"id\\":(\d+),/)
        if (match && match[1]) {
          channelId = Number.parseInt(match[1])
          console.log("✅ Channel ID encontrado:", channelId)
          updatePanel()
        }
      }
    })
  }

  function handleDrag(e) {
    if (!isDragging) return
    const panel = document.getElementById("kick-tools-panel")
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    panel.style.left = newX + "px"
    panel.style.top = newY + "px"
    panel.style.right = "auto"
  }

  function handleDragEnd() {
    isDragging = false
    const panel = document.getElementById("kick-tools-panel")
    panel.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
    document.removeEventListener("mousemove", handleDrag)
    document.removeEventListener("mouseup", handleDragEnd)
  }

  /** Iniciar */
  window.addEventListener("load", () => {
    createPanel()
    extractChannelId()
    updatePanel()
  })
})()
