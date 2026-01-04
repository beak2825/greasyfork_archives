// ==UserScript==
// @name         ChatGPT Neon Dominance
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pure UI transformation into dark neon supremacy
// @author       Jaelis
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @downloadURL https://update.greasyfork.org/scripts/539166/ChatGPT%20Neon%20Dominance.user.js
// @updateURL https://update.greasyfork.org/scripts/539166/ChatGPT%20Neon%20Dominance.meta.js
// ==/UserScript==

(function () {
  'use strict'

  GM_addStyle(`
    :root {
      --neon-base: hsl(276, 100%, 50%);
      --neon-glow: hsl(276, 100%, 70%);
      --neon-shadow: hsla(276, 100%, 50%, 0.3);
      --deep-void: #05010a;
      --abyss: #0a0514;
      --void-edge: #1a0a2a;
      --text-primary: #f0e6ff;
      --text-secondary: #d4b8ff;
    }

    body, #__next, .dark, .layout {
      background: var(--deep-void) !important;
      color: var(--text-primary) !important;
    }

    nav, .flex-col.items-center {
      background: linear-gradient(to bottom, var(--void-edge), var(--abyss)) !important;
      border-right: 1px solid var(--neon-base) !important;
    }

    .group.w-full, .group:hover {
      background: var(--abyss) !important;
      border: 1px solid var(--void-edge) !important;
    }

    .markdown, .markdown.prose {
      background: var(--void-edge) !important;
      border: 1px solid var(--neon-base) !important;
      box-shadow: 0 0 15px var(--neon-shadow) !important;
      border-radius: 12px !important;
      padding: 1.25rem !important;
      margin: 0.75rem 0 !important;
      position: relative;
      opacity: 0;
      transform: translateY(10px) scale(0.98);
      animation: messageAppear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    @keyframes messageAppear {
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .group:hover .markdown {
      border-color: var(--neon-glow) !important;
      box-shadow: 0 0 25px var(--neon-shadow) !important;
    }

    .form-control, .form-control:focus {
      background: var(--void-edge) !important;
      border: 2px solid var(--neon-base) !important;
      box-shadow: 0 0 20px var(--neon-shadow) !important;
      color: var(--text-primary) !important;
      transition: all 0.3s ease !important;
      border-radius: 12px !important;
    }

    .form-control:focus {
      animation: inputPulse 2s infinite;
      border-color: var(--neon-glow) !important;
    }

    @keyframes inputPulse {
      0%, 100% { box-shadow: 0 0 20px var(--neon-shadow); }
      50% { box-shadow: 0 0 35px var(--neon-shadow); }
    }

    button, .btn {
      background: linear-gradient(145deg, var(--void-edge), var(--neon-base)) !important;
      border: none !important;
      color: white !important;
      border-radius: 8px !important;
      transition: all 0.2s ease !important;
      position: relative;
      overflow: hidden;
    }

    button:hover, .btn:hover {
      background: linear-gradient(145deg, var(--neon-base), var(--neon-glow)) !important;
      transform: translateY(-2px);
      box-shadow: 0 5px 25px var(--neon-shadow) !important;
    }

    button:active, .btn:active {
      transform: translateY(0);
    }

    button::after, .btn::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
      transform: scale(0);
      opacity: 0;
      transition: transform 0.5s, opacity 0.5s;
    }

    button:hover::after, .btn:hover::after {
      transform: scale(1);
      opacity: 1;
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: var(--abyss);
    }

    ::-webkit-scrollbar-thumb {
      background: var(--neon-base);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--neon-glow);
    }

    ::selection {
      background: var(--neon-base);
      color: white;
    }

    .result-streaming > div:last-child::after {
      background-color: var(--neon-glow) !important;
      box-shadow: 0 0 10px var(--neon-glow) !important;
    }

    select, .select {
      background: var(--void-edge) !important;
      border: 1px solid var(--neon-base) !important;
      color: var(--text-primary) !important;
      border-radius: 6px !important;
    }

    .flex.p-3.items-center.gap-3:hover {
      background: var(--void-edge) !important;
      border-left: 3px solid var(--neon-base) !important;
    }

    @keyframes neonRipple {
      0% {
        box-shadow: 0 0 0 0 var(--neon-shadow);
        opacity: 1;
      }
      100% {
        box-shadow: 0 0 0 20px transparent;
        opacity: 0;
      }
    }

    .markdown.prose:last-child {
      position: relative;
      overflow: hidden;
    }

    .markdown.prose:last-child::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, var(--neon-shadow) 0%, transparent 70%);
      opacity: 0;
      pointer-events: none;
    }

    .markdown.prose:last-child.animate-ripple::before {
      animation: neonRipple 1s ease-out;
    }
  `)

  function enhanceResponseEffects() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.querySelector && node.querySelector('.markdown.prose')) {
            const message = node.querySelector('.markdown.prose:last-child')
            if (message) {
              message.classList.add('animate-ripple')
              setTimeout(() => {
                message.classList.remove('animate-ripple')
              }, 1000)
            }
          }
        })
      })
    })

    const targetNode = document.querySelector('#__next') || document.body
    if (targetNode) {
      observer.observe(targetNode, { childList: true, subtree: true })
    }
  }

  let lastTypingTime = 0
  function setupDynamicInputEffects() {
    const input = document.querySelector('textarea')
    if (input) {
      input.addEventListener('input', (e) => {
        const now = Date.now()
        const speed = now - lastTypingTime
        lastTypingTime = now

        const intensity = Math.min(1, 300 / Math.max(50, speed))
        input.style.boxShadow = `0 0 ${15 + intensity * 20}px hsla(276, 100%, 50%, ${0.3 + intensity * 0.2})`
      })
    }
  }

  function init() {
    enhanceResponseEffects()
    setupDynamicInputEffects()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  const observeUrlChanges = () => {
    let lastUrl = location.href
    new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href
        init()
      }
    }).observe(document, { subtree: true, childList: true })
  }

  observeUrlChanges()
})()
