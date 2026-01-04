// ==UserScript==
// @name         NamuWiki Arbitrator Board Utility
// @namespace    https://namu.wiki/w/사용자:Hoto_Cocoa
// @version      4
// @description  토론 참여 요청 경고 부여용 스크립트
// @match        https://board.namu.wiki/b/discuss/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      namu.wiki
// @connect      theseed.io
// @license      CC-BY-NC-SA-2.0-KR
// @downloadURL https://update.greasyfork.org/scripts/539046/NamuWiki%20Arbitrator%20Board%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/539046/NamuWiki%20Arbitrator%20Board%20Utility.meta.js
// ==/UserScript==

(async function () {
  'use strict'

  const DEBUG = new URL(location).searchParams.get('debug') === 'true'
  const API_DOMAIN = DEBUG ? 'theseed.io' : 'namu.wiki'
  const GROUP_NAME = DEBUG ? 'test' : '경고-토론 참여 요청'
  const API_URL = `https://${API_DOMAIN}/api/v0/aclgroup`

  GM_addStyle(`
    :root {
      --rtd-bg: #1f1f1f;
      --rtd-fg: #eee;
      --rtd-accent: #28aadd;
      --rtd-accent-hover: #2290bb;
      --rtd-warn: #d33;
      --rtd-radius: 8px;
      --rtd-transition: 0.2s ease-in-out;
      --rtd-z: 10000;
    }
    #rtd-button {
      margin-right: 8px;
      background: var(--rtd-accent);
      color: var(--rtd-fg);
      padding: 6px 12px;
      border: none;
      border-radius: var(--rtd-radius);
      cursor: pointer;
      font-weight: 500;
      transition: background var(--rtd-transition);
    }
    #rtd-button:hover {
      background: var(--rtd-accent-hover);
    }

    #rtd-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(2px);
      z-index: var(--rtd-z);
      transition: opacity var(--rtd-transition);
    }
    #rtd-overlay.visible {
      display: block;
      opacity: 1;
    }

    #rtd-modal {
      display: none;
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      width: 90%; max-width: 400px;
      background: var(--rtd-bg);
      color: var(--rtd-fg);
      padding: 24px;
      border-radius: var(--rtd-radius);
      box-shadow: 0 4px 16px rgba(0,0,0,0.7);
      z-index: calc(var(--rtd-z) + 1);
      font-size: 14px;
      opacity: 0;
      transition: transform var(--rtd-transition), opacity var(--rtd-transition);
    }
    #rtd-modal.visible {
      display: block;
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }

    #rtd-modal h3 {
      margin-top: 0;
      font-size: 1.2em;
      border-bottom: 1px solid #444;
      padding-bottom: 8px;
    }

    #rtd-modal label {
      display: block;
      margin: 12px 0 4px;
      font-weight: 500;
    }
    #rtd-modal input,
    #rtd-modal select {
      width: 100%;
      padding: 8px;
      border-radius: var(--rtd-radius);
      border: 1px solid #555;
      background: #2a2a2a;
      color: var(--rtd-fg);
      font-size: 0.95em;
      transition: border-color var(--rtd-transition);
    }
    #rtd-modal input:focus,
    #rtd-modal select:focus {
      outline: none;
      border-color: var(--rtd-accent);
      box-shadow: 0 0 0 2px rgba(40,170,221,0.3);
    }

    .rtd-button-group {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      gap: 8px;
    }
    .rtd-button-group button {
      flex: 0 0 auto;
      padding: 8px 16px;
      border: none;
      border-radius: var(--rtd-radius);
      font-weight: 500;
      cursor: pointer;
      transition: background var(--rtd-transition), transform var(--rtd-transition);
    }
    #rtd-submit {
      background: var(--rtd-accent);
      color: var(--rtd-fg);
    }
    #rtd-submit:hover {
      background: var(--rtd-accent-hover);
      transform: translateY(-1px);
    }
    #rtd-cancel {
      background: #555;
      color: var(--rtd-fg);
    }
    #rtd-cancel:hover {
      background: #666;
      transform: translateY(-1px);
    }

    @media (max-width: 480px) {
      #rtd-modal {
        width: 95%;
        padding: 16px;
      }
      .rtd-button-group {
        flex-direction: column-reverse;
        align-items: stretch;
      }
      .rtd-button-group button {
        width: 100%;
      }
    }
  `)

  const create = (tag, attrs = {}, ...children) => {
    const el = document.createElement(tag)
    Object.assign(el, attrs)
    children.forEach((c) => {
      if (typeof c === 'string') el.appendChild(document.createTextNode(c))
      else if (c) el.appendChild(c)
    })
    return el
  }

  const getToken = () => localStorage.getItem('acl_token') || ''
  const setToken = v => localStorage.setItem('acl_token', v)

  function buildButton() {
    return create('button', { id: 'rtd-button', title: '토론 참여 요청 경고 부여' }, '토론 참여 요청')
  }

  function buildOverlay() {
    const ov = create('div', { id: 'rtd-overlay' })
    ov.addEventListener('click', () => toggleModal(false))
    document.body.appendChild(ov)
    return ov
  }

  function buildModal() {
    const tokenInput = create('input', {
      type: 'password', id: 'rtd-token', placeholder: 'API 토큰 입력', value: getToken(),
    })
    tokenInput.addEventListener('input', e => setToken(e.target.value))

    const typeSelect = create('select', { id: 'rtd-type' },
      create('option', { value: 'ip' }, 'IP'),
      create('option', { value: 'username' }, '사용자'),
    )

    const targetInput = create('input', {
      type: 'text', id: 'rtd-target', placeholder: '예: Hoto_Cocoa 또는 127.0.0.1',
    })

    const reasonInput = create('input', {
      type: 'text', id: 'rtd-reason', placeholder: '토론 링크 입력',
    })
    const articleBody = document.querySelector('div.article-body')
    if (articleBody) {
      const threadA = articleBody.querySelector('a[href^="https://namu.wiki/thread/"]')
      if (threadA) {
        const threadPath = threadA.href.match(/\/thread\/[A-Za-z]+/)[0]

        reasonInput.value = `https://namu.wiki${threadPath}`
      }
    }

    [targetInput, reasonInput].forEach((input) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          handleSubmit()
        }
      })
    })

    const submitBtn = create('button', { id: 'rtd-submit' }, '등록')
    const cancelBtn = create('button', { id: 'rtd-cancel' }, '취소')

    submitBtn.addEventListener('click', handleSubmit)
    cancelBtn.addEventListener('click', () => toggleModal(false))

    const btnGroup = create('div', { className: 'rtd-button-group' }, cancelBtn, submitBtn)

    const modal = create('div', { id: 'rtd-modal' },
      create('h3', {}, '토론 참여 요청 경고'),
      create('label', {}, '인증 토큰', tokenInput),
      create('label', {}, '대상 타입', typeSelect),
      create('label', {}, '대상', targetInput),
      create('label', {}, '주소', reasonInput),
      btnGroup,
    )

    document.body.appendChild(modal)
    return modal
  }

  function toggleModal(show) {
    overlay.classList.toggle('visible', show)
    modal.classList.toggle('visible', show)
  }

  function postACL({ token, mode, target, note }) {
    return new Promise((resolve) => {
      const params = new URLSearchParams({ group: GROUP_NAME, mode, [mode]: target, note: `${note} 토론 참여 바랍니다.`, expire: '0' })
      GM_xmlhttpRequest({
        method: 'POST',
        url: API_URL,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
        data: params.toString(),
        onload(res) {
          try {
            const json = JSON.parse(res.responseText)
            if (json.id) return resolve(`✅ 성공 (ID: ${json.id})`)
            if (json.status === 'aclgroup_already_exists') return resolve('⚠️ 이미 존재')
            return resolve(`❌ 실패: ${JSON.stringify(json)}`)
          }
          catch {
            return resolve(`❌ 파싱 오류: ${res.responseText}`)
          }
        },
        onerror(err) {
          resolve(`❌ 요청 오류: ${err.error}`)
        },
      })
    })
  }

  async function handleSubmit() {
    const token = document.getElementById('rtd-token').value.trim()
    const mode = document.getElementById('rtd-type').value
    const target = document.getElementById('rtd-target').value.trim()
    const note = document.getElementById('rtd-reason').value.trim()

    if (!token || !target || !note) {
      return alert('❗️ 필수: 인증 토큰과 대상, 주소를 입력해주세요.')
    }

    const result = await postACL({ token, mode, target, note })
    alert(result)
    toggleModal(false)
  }

  const button = buildButton()
  const overlay = buildOverlay()
  const modal = buildModal()

  button.addEventListener('click', () => toggleModal(true))

  function init() {
    const badge = document.querySelector('div.article-head span.badge')
    if (!badge || badge.textContent.trim() !== '중재 문의') return

    if (document.getElementById('rtd-button')) return
    const delBtn = [...document.querySelectorAll('a, button')]
      .find(el => el.textContent.trim() === '삭제')
    if (!delBtn) return console.warn('삭제 버튼을 찾을 수 없습니다.')
    delBtn.parentNode.insertBefore(button, delBtn)
  }

  new MutationObserver(init).observe(document.body, { childList: true, subtree: true })
  init()
})()
