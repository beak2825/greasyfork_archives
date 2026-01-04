// ==UserScript==
// @name         AI補助付きAtCoder
// @namespace    http://atcoder.jp/
// @version      2025-06-19
// @description  智神がコードを書きます
// @author       Yukkku
// @match        https://atcoder.jp/contests/*
// @icon         https://atcoder.jp/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539951/AI%E8%A3%9C%E5%8A%A9%E4%BB%98%E3%81%8DAtCoder.user.js
// @updateURL https://update.greasyfork.org/scripts/539951/AI%E8%A3%9C%E5%8A%A9%E4%BB%98%E3%81%8DAtCoder.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const button = Object.assign(document.createElement("button"), {
    innerText: "AI補助",
    className: "btn btn-default btn-sm",
  });
  document.querySelector(".editor-buttons").appendChild(button);
  button.onclick = async e => {
    e.preventDefault();
    const now = Date.now();
    if (new Date(startTime._i) <= now && now <= new Date(endTime._i)) {
      alert("コンテスト中のAIの使用は禁止されているよ!");
      return
    }
    const sleep = t => new Promise(r => setTimeout(r, t));
    const asciiChokudai = atob("ICAgICAgICAgICAgICAgICAgICAgICAgLwogICAgICAgICAgICAgICAgICAgICAgIC8gKC8vLi9cXFwpCiAgICAgICAgICAgICAgICAgICgvLy8vLy8vLy9cXFxcXFxcKQogICAgICAgICAgICAgICAgKC8vLy8vLy8vLy8vLy9cXFxcXFxcKQogICAgICAgICAgICAgICgvLy8vLy8vLy8vLy8vLyAgIFxcXFxcXCkKICAgICAgICAgICAgKC8vLy8vLy8vLy8vLy8vICAgICAgIFxcXFxcXCkKICAgICAgICAgICAoLy8vLy8vLy8vLy8vLyAgICAgICAgICAgXFxcXFwpCiAgICAgICAgICAgKC8vLy8vLy8vLy8vIC8gICAgICAgX18gIFxcXFxcXCkKICAgICAgICAgICgvLy8vLy8vLy8vLS0gICAgICBgKiogKmAgIFxcXFxcKQogICAgICAgICAgKC8vLy8vLy8gX19fXyAgICAgICAtLS0tPiAgXFxcXFwpCiAgICAgICAgICAoLy8vLy8vICAgIH4gICAgICAgICcnICAgICAgXFxcKQogICAgICAgICAgICgvLy8gICAgICAgIC8gICAgIFwgICAgICAgIFxcKQogICAgICAgICAgICAgXFwgICAgIC8gICBgLS0tJyAgICBcICAgICAvCiAgICAgICAgICAgICAgICggICAgXCA8PS0tLS0tLT1eKi8gICAgKQogICAgICAgICAgICAgICAgICggICAgIGBgJycnJydgICAgICAgKQogICAgICAgICAgICAgICAgICB8XCAgICAgICAgICAgICAgICAvfAogICAgICAgICAgICAgICAgICB8ICBgXCAgICAgICAgICAvJyAgfAogICAgICAgICAgICAgICAgICB8ICAgICBgYC0tLS0tJycgICAgIFwKICAgICAgICAgICAgICAgIC8jLyAgICAgICAgICAgICAgICAgICAgXCMjYFwKICAgICAgICAgICAgLyMjIyMvXCAgICAgICAgICAgICAgICAgICAvIFwjIyMjYFwKICAgICAgIC8jIyMjIyMjIy8gIFwgICAgICAgICAgICAgICAgLycgICBcIyMjIyMjIyNgXA==");
    const lineChokudai = asciiChokudai.split('\n');
    const speekChokudai = m => {
      const r = [...lineChokudai];
      r[7] += '      <  ' + m;
      return r;
    };
    const toggleButton = document.querySelector("button.btn-toggle-editor");
    const editor = document.querySelector("#plain-textarea");
    const getEditor = () => {
      toggleButton.click();
      toggleButton.click();
      return editor.value;
    };
    const setEditor = s => {
      toggleButton.click();
      editor.value = s;
      toggleButton.click();
      editor.value = s;
    };
    const s = getEditor();
    setEditor("\n" + s);
    await sleep(1000);
    setEditor("智\n" + s);
    await sleep(500);
    setEditor("智　神\n" + s);
    await sleep(500);
    setEditor("智　神　降\n" + s);
    await sleep(500);
    setEditor("智　神　降　臨\n" + s);
    await sleep(500);
    const g = ["智　神　降　臨", "", "", ...lineChokudai];
    for (let i = 1; i <= g.length; ++i) {
      await sleep(100);
      setEditor(g.slice(0, i).join("\n") + "\n" + s);
    }
    await sleep(1000);
    setEditor("#include <bits/stdc++.h>\n\n\n" + asciiChokudai + "\n" + s);
    await sleep(500);
    setEditor("#include <bits/stdc++.h>\nusing namespace std;\n\n" + asciiChokudai + "\n" + s);
    await sleep(500);
    setEditor("#include <bits/stdc++.h>\nusing namespace std;\n#include <atcoder/all>\n" + asciiChokudai + "\n" + s);
    await sleep(1000);
    const schokudai = speekChokudai("あとは頑張るのじゃぞ");
    for (let i = g.length - 1; i >= 0; --i) {
      await sleep(100);
      setEditor("#include <bits/stdc++.h>\nusing namespace std;\n#include <atcoder/all>\n" + schokudai.slice(0, i).join("\n") + "\n" + s);
    }
    setEditor("#include <bits/stdc++.h>\nusing namespace std;\n#include <atcoder/all>\n" + s);
  };
})();