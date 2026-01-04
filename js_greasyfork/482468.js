// ==UserScript==
// @name        GreasyFork Code: Monaco Editor
// @namespace   Violentmonkey Scripts
// @match       https://greasyfork.org/*
// @match       https://sleazyfork.org/*
// @grant       none
// @version     0.1.20
// @author      CY Fung
// @description 12/17/2023, 2:31:22 PM
// @run-at document-start
// @unwrap
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/482468/GreasyFork%20Code%3A%20Monaco%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/482468/GreasyFork%20Code%3A%20Monaco%20Editor.meta.js
// ==/UserScript==

// localStorage.darkMode = 'true'
// localStorage.autoMonacoEditor = 'true'

(() => {

  const vsPath = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.49.0/min/vs";

  const editorOptions = {
    automaticLayout: true,
    foldingStrategy: 'indentation',
    lineNumbers: 'on',
    readOnly: false,
    minimap: {
      enabled: false,
    },
    cursorStyle: 'line',
    scrollBeyondLastLine: false,
    showUnused: true,
    showDeprecated: true,
    


    scrollbar: { alwaysConsumeMouseWheel: false },

    unicodeHighlight: {
      ambiguousCharacters: false,
    },

    // https://code.visualstudio.com/docs/editing/intellisense

    // Controls whether suggestions should be accepted on commit characters. For example, in JavaScript, the semi-colon (`;`) can be a commit character that accepts a suggestion and types that character.
    acceptSuggestionOnCommitCharacter: true,

    // Controls if suggestions should be accepted on 'Enter' - in addition to 'Tab'. Helps to avoid ambiguity between inserting new lines or accepting suggestions. The value 'smart' means only accept a suggestion with Enter when it makes a textual change
    acceptSuggestionOnEnter: "on",

    // Controls the delay in ms after which quick suggestions will show up.
    quickSuggestionsDelay: 10,

    // Controls if suggestions should automatically show up when typing trigger characters
    suggestOnTriggerCharacters: true,

    // Controls if pressing tab inserts the best suggestion and if tab cycles through other suggestions
    tabCompletion: "off",

    // Controls whether sorting favours words that appear close to the cursor
    suggest: {
      localityBonus: true,
      preview: true,
    },

    // Controls how suggestions are pre-selected when showing the suggest list
    suggestSelection: "first",

    // Enable word based suggestions
    wordBasedSuggestions: "matchingDocuments",

    // Enable parameter hints
    parameterHints: {
      enabled: true,
    },

    fastScrollSensitivity: 10,
    smoothScrolling: true,
    inlineSuggest: {
      enabled: true,
    },
    guides: {
      indentation: true,
    },
    renderLineHighlightOnlyWhenFocus: true,
    snippetSuggestions: "top",

    cursorBlinking: "phase",
    cursorSmoothCaretAnimation: "off",

    autoIndent: "advanced",
    wrappingIndent: "indent",
    wordSegmenterLocales: ["ja", "zh-CN", "zh-Hant-TW"],

    renderLineHighlight: "gutter",
    renderWhitespace: "selection",
    renderControlCharacters: true,
    dragAndDrop: false,
    emptySelectionClipboard: false,
    copyWithSyntaxHighlighting: false,
    bracketPairColorization: {
      enabled: true,
    },
    mouseWheelZoom: true,
    links: true,
    accessibilitySupport: "off",
    largeFileOptimizations: true,
  };

  const compilerOptions = {
    allowNonTsExtensions: true,
    checkJs: true,
    noImplicitAny: true,

    allowJs: true,
    noUnusedLocals: false,
    noFallthroughCasesInSwitch: false,
    noImplicitThis: false,

  };

  const cssText01 = `
  .monaco-editor-container{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      display: none;
  }
  [monaco-editor-status="1"] .monaco-editor-container{
    display: block;
  }
  [monaco-editor-status="1"] .monaco-controlled-textarea{
    display: none;
  }
  [monaco-editor-status="2"] .monaco-editor-container{
    display: none;
  }
  [monaco-editor-status="2"] .monaco-controlled-textarea{
    display: block;
  }
  `;

  const elmSet = {};

  HTMLInputElement.prototype.addEventListener177 = HTMLInputElement.prototype.addEventListener;
  HTMLInputElement.prototype.addEventListener = function () {
    if (arguments.length === 2 && arguments[0] === 'change' && (arguments[1] || 0).name === 'handleChange') {
      const rawF = arguments[1];
      if (this.id === 'enable-source-editor-code') {
        arguments[1] = function handleChange(e) {
          if (typeof ((e || 0).target || 0).checked === 'boolean' && document.getElementById('ace-editor')) return rawF.apply(this, arguments);
        }
      }
    }
    return this.addEventListener177.apply(this, arguments);
  }

  function loadResource(type, url) {
    if (type === 'css') {
      return new Promise(resolve => {
        var link = document.createElement('link');
        var onload = function () {
          link.removeEventListener('load', onload, false);
          resolve();
        }
        link.addEventListener('load', onload, false);
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
      });
    } else if (type === 'js') {
      return new Promise(resolve => {
        var script = document.createElement('script');
        var onload = function () {
          script.removeEventListener('load', onload, false);
          resolve();
        }
        script.addEventListener('load', onload, false);
        script.src = url;
        document.head.appendChild(script);
      })
    }
  }

  function onChange817(e) {

    const target = (e || 0).target || null;

    if (!target) return;

    let monacoStatus = target.getAttribute('monaco-status')
    if (monacoStatus) {

      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();

      const textAreaParent = elmSet.textAreaParent;
      const textArea = elmSet.textArea;
      const editor = elmSet.editor;

      // console.log(monacoStatus)
      if (monacoStatus === '1') {
        // elmSet.container.replaceWith(elmSet.textArea);



        textAreaParent.setAttribute('monaco-editor-status', '2')
        target.setAttribute('monaco-status', monacoStatus = '2')
        if (textArea.style.display) textArea.style.display = '';
        return;

      } else if (monacoStatus === '2') {

        // elmSet.textArea.replaceWith(elmSet.container);

        const currentCode = editor.getValue();
        const currentText = textArea.value;
        if (currentCode !== currentText) {
          editor.setValue(currentText);
        }

        textAreaParent.setAttribute('monaco-editor-status', '1')
        target.setAttribute('monaco-status', monacoStatus = '1')
        if (textArea.style.display) textArea.style.display = '';
        return;
      } else {
        return;
      }

    }

    const codeId = target.getAttribute('data-related-editor') || '';
    if (!codeId) return;

    const textArea = document.getElementById(codeId);

    if (!textArea) return;

    const codeLang = target.getAttribute('data-editor-language'); // 'javascript', 'css'

    if (!codeLang) return;

    if (document.getElementById('ace-editor')) return;

    target.setAttribute('monaco-status', '1');


    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();


    // Setting up Monaco Editor requirements
    let require = {
      paths: {
        vs: vsPath,
      },
    };

    window.require = (window.require || {});
    window.require.paths = (window.require.paths || {});
    Object.assign(window.require.paths, require.paths);


    const addCssText = (id, text) => {
      if (document.getElementById(id)) return;
      const style = document.createElement('style');
      style.id = id;
      style.textContent = text;
      document.head.appendChild(style);

    }


    (async function () {

      // Dynamically load CSS and JS
      await loadResource('css', `${vsPath}/editor/editor.main.css`);
      await loadResource('js', `${vsPath}/loader.js`);
      await loadResource('js', `${vsPath}/editor/editor.main.nls.js`);
      await loadResource('js', `${vsPath}/editor/editor.main.js`);

      addCssText('rmbnctzOOksi', cssText01);

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions(Object.assign({
        target: monaco.languages.typescript.ScriptTarget.ES2018,
      }, compilerOptions));

      const container = document.createElement('div');
      container.className = 'monaco-editor-container';
      container.style.height = textArea.getBoundingClientRect().height + 'px';
      // textArea.replaceWith(container);
      textArea.classList.add('monaco-controlled-textarea');
      const textAreaParent = elmSet.textAreaParent = textArea.parentNode;
      textAreaParent.setAttribute('monaco-editor-status', '1');
      textAreaParent.insertBefore(container, textArea.nextSibling);

      elmSet.textArea = textArea;
      elmSet.container = container;

      if (textArea.style.display) textArea.style.display = '';

      const monacoLangs = {
        'javascript': 'javascript',
        'css': 'css',
      };

      const monacoLang = monacoLangs[codeLang];


      const editor = monaco.editor.create(container, Object.assign({
        value: textArea.value,
        language: monacoLang
      }, editorOptions));

      elmSet.editor = editor;

      if (document.documentElement.hasAttribute('dark')) monaco.editor.setTheme("vs-dark");

      editor.onDidChangeModelContent(e => {
        elmSet.textArea.value = editor.getValue()
      });


      // console.log(monaco, monaco.onDidChangeModelContent)

      //   window.editor.getModel().onDidChangeContent((event) => {
      //   render();
      // });

      //   editor.setTheme

      //   onDidChangeContent is attached to a model, and will only apply to that model
      // onDidChangeModelContent



    })();


  }

  function preloadResources() {

    const cssResources = [
      `${vsPath}/editor/editor.main.css`,
    ];
    const jsResources = [
      `${vsPath}/loader.js`,
      `${vsPath}/editor/editor.main.nls.js`,
      `${vsPath}/editor/editor.main.js`,
    ];
    const template = document.createElement('template');
    const frag = template.content;

    for (const url of cssResources) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'style');
      link.setAttribute('href', url);
      frag.appendChild(link);
    }
    for (const url of jsResources) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'script');
      link.setAttribute('href', url);
      frag.appendChild(link);
    }
    document.head.appendChild(frag);
  }

  let resolveOnLoad = null;
  const promiseOnLoad = new Promise((resolve) => {
    resolveOnLoad = resolve;
  });
  window.addEventListener("load", resolveOnLoad, { once: true });

  const showEditorOnLoad = async (checkerbox) => {
    await Promise.race([promiseOnLoad.then(() => { }), new Promise(resolve => setTimeout(resolve, document.readyState === "complete" ? 500 : 2000))]);

    await new Promise(resolve => {
      new IntersectionObserver((mutations, observer) => {
        observer.takeRecords();
        observer.disconnect();
        setTimeout(resolve, 1);
      }).observe(document.documentElement);
    });

    if (checkerbox.checked === false && checkerbox.isConnected) checkerbox.click();
    else if (checkerbox.checked === true && document.getElementById('ace-editor') && checkerbox.isConnected) {

      Promise.resolve().then(() => checkerbox.click()).then(() => checkerbox.click())
    }
  }

  function onReady() {
    window.removeEventListener("DOMContentLoaded", onReady, false);

    if (location.pathname.includes('/script')) {
      preloadResources();
    }

    // if (localStorage.darkMode === 'true') document.documentElement.setAttribute('dark', '')

    const checkerbox = document.querySelector('input#enable-source-editor-code[name="enable-source-editor-code"]');

    if (checkerbox) {
      checkerbox.addEventListener('change', onChange817, { once: false, capture: true, passive: false });
      if (localStorage.autoMonacoEditor === 'true') {
        showEditorOnLoad(checkerbox);
      }
    }



  }


  Promise.resolve().then(() => {

    if (document.readyState !== 'loading') {
      onReady();
    } else {
      window.addEventListener("DOMContentLoaded", onReady, false);
    }

  });

})();
