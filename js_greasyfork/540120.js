// ==UserScript==
// @name         GitHub Interview Question Generator
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  AI 활용 면접 질문 생성기
// @author       chocolatestain
// @match        https://github.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      generativelanguage.googleapis.com
// @connect      api.github.com
// @license      MIT
// @icon         https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png
// @downloadURL https://update.greasyfork.org/scripts/540120/GitHub%20Interview%20Question%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/540120/GitHub%20Interview%20Question%20Generator.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const GEMINI_API_KEY_ID = 'GEMINI_API_KEY';
  const GITHUB_TOKEN_ID = 'GITHUB_TOKEN';

  const GITHUB_STYLES = `
    @keyframes generateButtonPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }

    @keyframes generateSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes generateModalFadeIn {
      0% { opacity: 0; transform: translate(-50%, -60%); }
      100% { opacity: 1; transform: translate(-50%, -50%); }
    }

    @keyframes generateOverlayFadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    .generate-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 6px 16px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      user-select: none;
      border: 1px solid;
      border-radius: 6px;
      appearance: none;
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.3, 0, 0.5, 1);
      position: relative;
      overflow: hidden;
    }

    .generate-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .generate-btn:hover::before {
      left: 100%;
    }

    /* Light theme styles */
    .generate-btn {
      color: #24292f;
      background-color: #f6f8fa;
      border-color: rgba(27,31,36,0.15);
      box-shadow: 0 1px 0 rgba(27,31,36,0.04), inset 0 1px 0 rgba(255,255,255,0.25);
    }

    .generate-btn:hover:not(:disabled) {
      background-color: #f3f4f6;
      border-color: rgba(27,31,36,0.15);
      box-shadow: 0 1px 0 rgba(27,31,36,0.1), inset 0 1px 0 rgba(255,255,255,0.03);
      transform: translateY(-1px);
    }

    .generate-btn:active:not(:disabled) {
      background-color: #ebecf0;
      border-color: rgba(27,31,36,0.15);
      transform: translateY(0);
      box-shadow: inset 0 1px 0 rgba(27,31,36,0.1);
    }

    /* Dark theme styles */
    [data-color-mode="dark"] .generate-btn,
    [data-theme="dark"] .generate-btn,
    html[data-color-mode="dark"] .generate-btn {
      color: #f0f6fc;
      background-color: #21262d;
      border-color: rgba(240,246,252,0.1);
      box-shadow: 0 0 transparent, 0 0 transparent;
    }

    [data-color-mode="dark"] .generate-btn:hover:not(:disabled),
    [data-theme="dark"] .generate-btn:hover:not(:disabled),
    html[data-color-mode="dark"] .generate-btn:hover:not(:disabled) {
      background-color: #30363d;
      border-color: rgba(240,246,252,0.15);
      transform: translateY(-1px);
    }

    [data-color-mode="dark"] .generate-btn:active:not(:disabled),
    [data-theme="dark"] .generate-btn:active:not(:disabled),
    html[data-color-mode="dark"] .generate-btn:active:not(:disabled) {
      background-color: #282e33;
      transform: translateY(0);
    }

    .generate-btn:disabled {
      cursor: not-allowed;
      opacity: 0.6;
      transform: none !important;
    }

    .generate-btn.loading {
      animation: generateButtonPulse 2s infinite;
    }

    .generate-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: generateSpin 1s linear infinite;
    }

    .generate-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    /* 모달 */
    .generate-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 999;
      animation: generateOverlayFadeIn 0.3s ease-out;
    }

.generate-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #222831 !important;
  border: 1px solid #444950 !important;
  border-radius: 12px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.18);
  max-width: min(95vw, 1600px);
  width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  animation: generateModalFadeIn 0.3s ease-out;
  color: white !important;
}
.generate-modal-header {
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #444950 !important;
  background: #222831 !important;
  color: white !important;
}

.generate-modal-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 600;
  color: white !important;
  display: flex;
  align-items: center;
  gap: 12px;
}

.generate-modal-content {
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
  background: #222831 !important;
  color: white !important;
}

.generate-category {
  margin-bottom: 32px;
  padding: 20px;
  background: #222831 !important;
  border: 1px solid #444950 !important;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: white !important;
}

    .generate-category:hover {
      border-color: var(--color-border-default, #d0d7de);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }


.generate-category-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: white !important;
  display: flex;
  align-items: center;
  gap: 8px;
}

    .generate-category-badge {
      background: var(--color-accent-emphasis, #0969da);
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

.generate-questions-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.generate-question-item {
  margin-bottom: 12px;
  padding: 12px 16px;
  background: #393e46 !important;
  border: 1px solid #444950 !important;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.6;
  color: white !important;
  transition: all 0.2s ease;
  position: relative;
}

.generate-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #cccccc !important;
  padding: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.generate-close-btn:hover {
  background: #444950 !important;
  color: white !important;
}

.generate-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #393e46 !important;
  color: white !important;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
  z-index: 1001;
  animation: generateModalFadeIn 0.3s ease-out;
  font-size: 14px;
  font-weight: 500;
}
  `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = GITHUB_STYLES;
  document.head.appendChild(styleSheet);

async function getApiKey() {
  let key = await GM_getValue(GEMINI_API_KEY_ID);
  if (!key) {
    // 최초 입력 시 안내 포함된 커스텀 프롬프트
    showApiKeyModal('', async (enteredKey) => {
      if (enteredKey && enteredKey.length >= 10) {
        await GM_setValue(GEMINI_API_KEY_ID, enteredKey);
      }
    });
    // 입력이 끝날 때까지 대기
    return new Promise(resolve => {
      const interval = setInterval(async () => {
        const stored = await GM_getValue(GEMINI_API_KEY_ID);
        if (stored) {
          clearInterval(interval);
          resolve(stored);
        }
      }, 300);
    });
  }
  return key;
}


GM_registerMenuCommand('Gemini API 키 설정', async () => {
  let oldKey = await GM_getValue(GEMINI_API_KEY_ID) || '';
  showApiKeyModal(oldKey, async (enteredKey) => {
    if (enteredKey && enteredKey.length >= 10) {
      await GM_setValue(GEMINI_API_KEY_ID, enteredKey);
      showToast('API 키가 저장되었습니다.');
    }
  });
});


function showApiKeyModal(currentValue, onSave) {

  document.querySelectorAll('.generate-modal-overlay, .generate-modal').forEach(e => e.remove());

  const overlay = document.createElement('div');
  overlay.className = 'generate-modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'generate-modal';
  modal.style.maxWidth = '400px';
  modal.style.paddingBottom = '24px';

  const header = document.createElement('div');
  header.className = 'generate-modal-header';

  const title = document.createElement('h2');
  title.className = 'generate-modal-title';
  title.textContent = 'Gemini API 키 설정';

  const closeButton = document.createElement('button');
  closeButton.className = 'generate-close-btn';
  closeButton.innerHTML = '×';
  closeButton.onclick = () => { modal.remove(); overlay.remove(); };

  header.appendChild(title);
  header.appendChild(closeButton);

  modal.appendChild(header);

  const content = document.createElement('div');
  content.className = 'generate-modal-content';
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.gap = '16px';

  const label = document.createElement('label');
  label.textContent = 'Gemini API 키 입력';
  label.style.marginBottom = '8px';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentValue;
  input.style.width = '100%';
  input.style.padding = '8px';
  input.style.borderRadius = '6px';
  input.style.border = '1px solid #d0d7de';
  input.autofocus = true;

  const link = document.createElement('a');
  link.href = 'https://aistudio.google.com/app/apikey?hl=ko';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.color = '#0969da';
  link.style.fontSize = '14px';
  link.style.marginTop = '8px';
  link.textContent = '→ Gemini API 키 발급 방법 안내';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = '저장';
  saveBtn.className = 'generate-btn';
  saveBtn.style.marginTop = '8px';
  saveBtn.onclick = () => {
    modal.remove(); overlay.remove();
    if (typeof onSave === 'function') onSave(input.value.trim());
  };

  content.appendChild(label);
  content.appendChild(input);
  content.appendChild(link);
  content.appendChild(saveBtn);

  modal.appendChild(content);
  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  input.focus();
  input.select();
}

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'generate-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

// 파일 리스트 추출
  async function fetchFilesInCurrentDirectory() {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const owner = pathParts[0];
    const repo = pathParts[1];
    let path = '';
    let branch = 'main';

    // GitHub 토큰 가져오기 (이 부분을 추가해야 합니다)
    const token = await GM_getValue(GITHUB_TOKEN_ID);

    // /tree 에서는 브랜치 및 디렉토리 추출
    if (pathParts[2] === 'tree') {
      branch = pathParts[3];
      if (pathParts.length > 4) {
        path = pathParts.slice(4).join('/');
      }
    }

    const headers = token ? { 'Authorization': `token ${token}` } : {};
    const url = path
      ? `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
      : `https://api.github.com/repos/${owner}/${repo}/contents`;

    try {
      const contentsResponse = await fetch(url, { headers });
      if (!contentsResponse.ok) throw new Error('파일 목록을 가져올 수 없습니다.');
      const contents = await contentsResponse.json();
      // .file 만 추출
      const files = (contents || []).filter(f => f.type === 'file' && !f.name.startsWith('.')).slice(0, 5);

      // 파일 내용 일부 가져오기(최대 1000자)
      const fileContents = await Promise.all(
        files.map(async file => {
          try {
            const fileResponse = await fetch(file.url, { headers });
            if (!fileResponse.ok) return null;
            const fileData = await fileResponse.json();
            return { name: file.name, content: atob(fileData.content).slice(0, 1000) };
          } catch { return null; }
        })
      );

      return {
        owner, repo, branch, path,
        files: fileContents.filter(Boolean)
      };
    } catch (e) {
      alert('파일 조회 중 오류: ' + e.message);
      throw e;
    }
  }

  // 프롬프트 구성 (카테고리 자동 추출)
  function buildPrompt(repoInfo) {
    return `다음은 GitHub 레포지토리의 현재 디렉토리 정보입니다.
이 디렉토리에서 실제로 사용된 언어, 프레임워크, 라이브러리, 도구, 아키텍처, 개발 패턴 등을 파악하여,
각 카테고리별로 3~5개의 기술 면접 질문을 생성하세요.

- 실제로 코드, 설정 등에서 확인된 항목만 카테고리로 만드세요.
- 존재하지 않는 기술(예: 미사용 라이브러리, 언어 등)은 카테고리로 만들지 마세요.
- 각 질문은 실제 코드, 구현, 구조, 설정 등 구체적 근거를 기반으로 작성해야 하며,
- 각 카테고리별 질문 수는 3~5개로 제한하세요.
- 출력은 순수 JSON 배열만, 예시는 아래와 같습니다:

[
  {"title": "카테고리1", "questions": ["질문1", ...]},
  {"title": "카테고리2", "questions": ["질문1", ...]},
  ...
]

디렉토리 정보:
${JSON.stringify(repoInfo, null, 2)}
`;
  }

  // Gemini 호출 및 응답 파싱
  async function makeApiRequest(apiKey, prompt) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        timeout: 30000,
        onload: function(response) {
          try {
            console.log('[Gemini] HTTP status:', response.status);
            console.log('[Gemini] Raw response:', response.responseText);
            const data = JSON.parse(response.responseText);
            if (data.error) throw new Error(data.error.message || 'API 오류');
            if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0)
              throw new Error('API candidates 배열이 없습니다.');
            const candidate = data.candidates[0];
            const text = candidate.content.parts[0]?.text || '';
            // 코드블록 마크다운 제거, 시작~끝 괄호 추출
            let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            if (!cleanText.startsWith('[') && cleanText.includes('[')) {
              cleanText = cleanText.slice(cleanText.indexOf('['));
            }
            if (!cleanText.endsWith(']') && cleanText.lastIndexOf(']') > 0) {
              cleanText = cleanText.slice(0, cleanText.lastIndexOf(']') + 1);
            }
            console.log('[Gemini] Cleaned text for JSON.parse:', cleanText);
            let questions;
            try {
              questions = JSON.parse(cleanText);
            } catch (parseError) {
              console.error('[Gemini] JSON.parse 실패:', parseError);
              console.error('[Gemini] 파싱 실패 원본 cleanText:', cleanText);
              alert('[Gemini] API 응답이 JSON 형식이 아닙니다.\n\n----원본----\n' +
                cleanText + '\n\n----에러----\n' + parseError.message);
              throw new Error('API 응답이 JSON 형식이 아님');
            }
            if (!Array.isArray(questions)) throw new Error('응답이 배열이 아닙니다.');
            resolve(questions);
          } catch (error) {
            console.error('[Gemini] 최종 오류:', error);
            reject(error);
          }
        },
        onerror: function(e) {
          console.error('[Gemini] API 연결 실패:', e);
          reject(new Error('Gemini API 연결 실패'));
        },
        ontimeout: function() {
          console.error('[Gemini] API 요청 시간 초과');
          reject(new Error('Gemini API 요청 시간 초과'));
        }
      });
    });
  }

  // DOM 랜더링
 function showQuestions(questions) {
  const existingModal = document.querySelector('#generate-questions-modal');
  if (existingModal) existingModal.remove();

  const overlay = document.createElement('div');
  overlay.className = 'generate-modal-overlay';
  overlay.onclick = () => { modal.remove(); overlay.remove(); };

  const modal = document.createElement('div');
  modal.id = 'generate-questions-modal';
  modal.className = 'generate-modal';

  const header = document.createElement('div');
  header.className = 'generate-modal-header';

  const title = document.createElement('h2');
  title.className = 'generate-modal-title';
  title.innerHTML = `
    <svg class="generate-icon" viewBox="0 0 16 16">
      <path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"/>
    </svg>
    생성된 질문
  `;

  const closeButton = document.createElement('button');
  closeButton.className = 'generate-close-btn';
  closeButton.innerHTML = '×';
  closeButton.onclick = () => { modal.remove(); overlay.remove(); };

  header.appendChild(title);
  header.appendChild(closeButton);
  modal.appendChild(header);

  const content = document.createElement('div');
  content.className = 'generate-modal-content';

  questions.forEach((category, index) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'generate-category';

    const categoryTitle = document.createElement('h3');
    categoryTitle.className = 'generate-category-title';
    categoryTitle.textContent = category.title;

    categoryDiv.appendChild(categoryTitle);

    const questionsList = document.createElement('ul');
    questionsList.className = 'generate-questions-list';

    category.questions.forEach((question) => {
      const li = document.createElement('li');
      li.className = 'generate-question-item';
      li.textContent = question;
      questionsList.appendChild(li);
    });

    categoryDiv.appendChild(questionsList);
    content.appendChild(categoryDiv);
  });

  modal.appendChild(content);
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
}

function addButton() {
  // Repo 메인 화면
  const borderGrid = document.querySelector('div.OverviewContent-module__Box_1--RhaEy');
  // /tree 디렉토리
  const filenameBox = document.querySelector('[data-testid="breadcrumbs-filename"]');
  // 이미 버튼이 있으면 중복 생성 방지
  if (document.querySelector('#generate-interview-btn')) return;

  let container = borderGrid;
  if (window.location.pathname.includes('/tree/')) {
    if (!filenameBox) {
      setTimeout(addButton, 500);
      return;
    }
    container = filenameBox;
  }
  if (!container) return;

  // 버튼 생성
  const btn = document.createElement('button');
  btn.id = 'generate-interview-btn';
  btn.className = 'generate-btn';
  btn.innerHTML = `
    <svg class="generate-icon" viewBox="0 0 16 16">
      <path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"/>
    </svg>
    질문 생성하기
  `;
  btn.style.marginLeft = '8px';
  btn.style.verticalAlign = 'middle';
  btn.onclick = async function() {
    btn.disabled = true;
    btn.classList.add('loading');
    btn.innerHTML = `
      <div class="generate-spinner"></div>
      질문 생성 중...
    `;
    try {
      const apiKey = await getApiKey();
      if (!apiKey) throw new Error('API Key 없음');
      const repoInfo = await fetchFilesInCurrentDirectory();
      const prompt = buildPrompt(repoInfo);
      const questions = await makeApiRequest(apiKey, prompt);
      showQuestions(questions);
    } catch (e) {
        if (e.message.includes('API')) {
            alert('API 오류: ' + e.message + '\n\nAPI 키가 올바른지 확인해주세요.');
        }else {
            alert('질문 생성 실패: ' + e.message);
        }
    } finally {
      btn.disabled = false;
      btn.classList.remove('loading');
      btn.innerHTML = `
        <svg class="generate-icon" viewBox="0 0 16 16">
          <path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"/>
        </svg>
        질문 생성하기
      `;
    }
  };

  // /tree : Copy path 버튼 바로 뒤에 삽입
  if (window.location.pathname.includes('/tree/')) {
    // Copy path 버튼 바로 뒤에 삽입
    const copyBtn = container.querySelector('button, [data-component="IconButton"]');
    if (copyBtn && copyBtn.nextSibling) {
      container.insertBefore(btn, copyBtn.nextSibling);
    } else {
      container.appendChild(btn);
    }
  } else {
    container.appendChild(btn);
  }
}

  // MutationObserver로 동적 버튼 유지
  let isObserving = false;
  function startObserving() {
    if (isObserving) return;
    const observer = new MutationObserver(() => {
      if (!document.querySelector('#generate-interview-btn')) addButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    isObserving = true;
  }

  // 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      startObserving();
      setTimeout(() => { if (!document.querySelector('#generate-interview-btn')) addButton(); }, 500);
    });
  } else {
    startObserving();
    setTimeout(() => { if (!document.querySelector('#generate-interview-btn')) addButton(); }, 500);
  }
})();
