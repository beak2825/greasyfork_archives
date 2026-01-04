// ==UserScript==
// @name         SearXNGにGemini AIの回答を表示 ✨
// @name:ja      SearXNGにGemini AIの回答を表示 ✨
// @name:en      Show Gemini AI Answers in SearXNG ✨
// @name:zh-CN   在SearXNG中显示Gemini AI回答 ✨
// @name:zh-TW   在SearXNG中顯示Gemini AI回答 ✨
// @name:ko      SearXNG에서 Gemini AI 답변 표시 ✨
// @name:fr      Afficher les réponses Gemini AI dans SearXNG ✨
// @name:es      Mostrar respuestas de Gemini AI en SearXNG ✨
// @name:de      Gemini-AI-Antworten in SearXNG anzeigen ✨
// @name:pt-BR   Exibir respostas do Gemini AI no SearXNG ✨
// @name:ru      Показ ответов Gemini AI в SearXNG ✨
// @version      3.5.0
// @description         SearXNG検索結果にGoogle GeminiのAI回答を直接表示！APIキーはローカル保存、スタイリッシュなUIで回答を即確認。
// @description:en      Display Google Gemini AI answers directly in SearXNG search results! API key stored locally, fast and elegant UI.
// @description:zh-CN   在SearXNG搜索结果中直接显示Gemini AI的回答！API密钥本地保存，界面美观快速。
// @description:zh-TW   在SearXNG搜尋結果中直接顯示Gemini AI的回答！API金鑰本地儲存，介面美觀且快速。
// @description:ko      SearXNG 검색 결과에 Gemini AI 답변을 바로 표시! API 키는 로컬 저장, 세련된 UI로 빠르게 확인 가능.
// @description:fr      Affiche les réponses Gemini AI dans SearXNG. Clé API stockée localement, interface rapide et élégante.
// @description:es      Muestra respuestas de Gemini AI directamente en SearXNG. Clave API guardada localmente, interfaz elegante y rápida.
// @description:de      Zeigt Gemini AI-Antworten direkt in SearXNG an. API-Schlüssel wird lokal gespeichert, stilvolles UI.
// @description:pt-BR   Exibe respostas do Gemini AI diretamente no SearXNG! Chave API armazenada localmente, interface rápida e estilosa.
// @description:ru      Отображение ответов Gemini AI прямо в SearXNG! Ключ API хранится локально, стильный и быстрый интерфейс.
// @namespace    https://github.com/koyasi777/searxng-gemini-answer-injector
// @author       koyasi777
// @match        *://*/searx/search*
// @match        *://*/searxng/search*
// @match        *://searx.*/*
// @match        *://*.searx.*/*
// @match        https://search.charleseroop.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/koyasi777/searxng-gemini-answer-injector
// @supportURL   https://github.com/koyasi777/searxng-gemini-answer-injector/issues
// @icon         https://docs.searxng.org/_static/searxng-wordmark.svg
// @downloadURL https://update.greasyfork.org/scripts/533587/SearXNG%E3%81%ABGemini%20AI%E3%81%AE%E5%9B%9E%E7%AD%94%E3%82%92%E8%A1%A8%E7%A4%BA%20%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533587/SearXNG%E3%81%ABGemini%20AI%E3%81%AE%E5%9B%9E%E7%AD%94%E3%82%92%E8%A1%A8%E7%A4%BA%20%E2%9C%A8.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const log = (...args) => console.log('[SearxGemini]', ...args);

  // 🔽 <details> 自動展開処理（先に実行）
  function expandDetailsIfExists() {
    const idsToExpand = ['suggestions', 'engines_msg', 'search_url'];
    idsToExpand.forEach(id => {
      const container = document.getElementById(id);
      if (!container) return;
      const details = container.querySelector('details');
      if (details) details.open = true;
    });
  }

  // 🔄 MutationObserverを最初に仕掛ける（遅延読み込み対応）
  const observer = new MutationObserver(() => {
    expandDetailsIfExists();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  expandDetailsIfExists(); // 初回も実行しておく  

  const MODEL_NAME = 'gemini-2.0-flash';
  const GEMINI_API_URL_BASE = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent`;

  // 🔐 APIキーの取得・保存
  async function getApiKey(force = false) {
    if (force) localStorage.removeItem('GEMINI_API_KEY');
    let key = localStorage.getItem('GEMINI_API_KEY');
    if (!key) {
      alert(
        'Gemini APIキーを取得するには、以下のGoogle公式ページにアクセスしてください：\n\n' +
        'https://aistudio.google.com/app/apikey?hl=ja\n\n' +
        '取得したAPIキーを次の入力欄に貼り付けてください（ローカルに保存されます）'
      );
      key = prompt('Gemini APIキーを入力してください（ローカルに保存されます）');
      if (key) localStorage.setItem('GEMINI_API_KEY', key);
    }
    return key;
  }

  let GEMINI_API_KEY = await getApiKey();

  const query = document.querySelector('input[name="q"]')?.value?.trim();
  if (!query) return log('クエリ取得失敗');

  // const resultsDiv = document.querySelector('#results');
  // if (!resultsDiv) return log('結果DIVが見つかりません');
  const sidebarDiv = document.querySelector('#sidebar');
  if (!sidebarDiv || !sidebarDiv.firstChild) return log('sidebar DIVが見つかりません');

  const isDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

  const aiBox = document.createElement('div');
  aiBox.className = 'gemini-ai-box';
  aiBox.style.cssText = `
    padding: 1em;
    border-radius: 12px;
    margin-bottom: 1.2em;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    background: ${isDark() ? '#1e1e1e' : '#ffffff'};
    color: ${isDark() ? '#e0e0e0' : '#202124'};
    box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.05);
    transition: background 0.3s ease, color 0.3s ease;
  `;

  aiBox.innerHTML = `
    <div style="margin-bottom: 0.4em;">
      <span style="
        font-size: 0.75em;
        background: ${isDark() ? '#333' : '#f1f3f4'};
        color: ${isDark() ? '#aaa' : '#555'};
        padding: 0.25em 0.6em;
        border-radius: 6px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      ">Gemini AI</span>
    </div>
    <div id="gemini-answer-content">
      Gemini AIによる回答を取得中…
    </div>
  `;

  // resultsDiv.insertBefore(aiBox, resultsDiv.firstChild);
  sidebarDiv.insertBefore(aiBox, sidebarDiv.firstChild);

  function getCurrentLanguage() {
    const raw = document.getElementById("language")?.value?.trim().toLowerCase() || "ja";
    return (raw === "all" || raw === "auto") ? "ja" : raw;
  }

  async function fetchGeminiAnswer() {
    const contentEl = document.getElementById('gemini-answer-content');

    // ⬇️ 最終言語取得ロジック（auto/all → ja）
    const currentLang = getCurrentLanguage();

    // ⬇️ プロンプト組み立て（言語指示付き）
    const prompt = [
      `以下の検索クエリに対し、最新の正確な回答をHTML形式で出力してください（段落・改行・リンク含む）。`,
      `また、信頼できる出典URLを必ず1件以上含めてください。HTML本体だけを返してください。`,
      ``,
      `クエリ：「${query}」`,
      ``,
      `※ 出力の言語は「${currentLang}」にしてください。`
    ].join('\n');

    try {
      const response = await fetch(`${GEMINI_API_URL_BASE}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
        })
      });

      if (response.status === 401 || response.status === 403) {
        contentEl.innerHTML = `❗ APIキーが無効または期限切れです。再入力してください。`;
        GEMINI_API_KEY = await getApiKey(true); // 強制再入力
        return await fetchGeminiAnswer(); // 再試行
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        contentEl.innerHTML = `Gemini AIの回答を取得できませんでした。`;
        return log('API応答にテキストがありません:', data);
      }

      // コードブロック記法の除去（文中のものも含めて完全対応）
      const cleanedText = rawText
        .replace(/```html\s*/gi, '')
        .replace(/```/g, '');


      contentEl.innerHTML = cleanedText;
    } catch (err) {
      document.getElementById('gemini-answer-content').innerHTML = `Gemini APIエラー: ${err.message}`;
      log('API呼び出しエラー:', err);
    }
  }

  await fetchGeminiAnswer();

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }
})();
