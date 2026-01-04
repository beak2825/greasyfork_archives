// ==UserScript==
// @name         Risu Linguaporta Tool
// @namespace    https://github.com/TwoSquirrels
// @version      0.4
// @description  cheat
// @author       TwoSquirrels
// @license      CC-BY-NC-4.0
// @match        https://w1.linguaporta.jp/user/seibido/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linguaporta.jp
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/511743/Risu%20Linguaporta%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/511743/Risu%20Linguaporta%20Tool.meta.js
// ==/UserScript==

// 指定したミリ秒待つ Promise 関数
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function sorting() {
  const japanese = document.getElementById("qu02").innerText;
  const problem = `sorting.${encodeURIComponent(japanese)}`;
  console.log({ japanese, problem });

  if (unsafeWindow.Segments) {
    // 問題画面

    // 問題に関するデータを取得
    const words = [
      ...unsafeWindow.Segments.toSorted((a, b) => a[1] - b[1]).map(([text, tag]) => text),
      ...[...document.getElementsByClassName("qu03_true")].map((elm) => elm.innerText.trim()).filter((w) => w),
    ];
    const hint = document
      .getElementById("answer_info")
      ?.innerHTML.trim()
      .replaceAll('<font color="#ff0000"><sub>↑</sub></font>', "*")
      .replace(
        /<span style="color:#ff0000;text-decoration :line-through;"><span style="color:#000000;">.*<\/span><\/span>/g,
        "",
      )
      .replace(/\s+/g, " ");
    const english = await GM.getValue(problem, null);

    // AI に投げる用のプロンプト
    const prompt = document.createElement("textarea");
    if (document.getElementById("answer_info")) prompt.textContent = "Wrong answer. Fix the answer and try again.\n\n";
    prompt.textContent += `Please answer the English translation sorting questions below with a description. (Please reply "Description:" and "English:".)

Japanese: ${japanese}

Words: ${words
      .toSorted()
      .map((s) => JSON.stringify(s))
      .join(", ")}
Note: Do not change uppercase or lowercase letters or symbols. For example, words with a period must come at the end.`;
    if (hint) prompt.textContent += '\n\nHint: Part of the answer looks like this: Replace "*" with any word.\n' + hint;
    prompt.readonly = true;
    prompt.rows = 10;
    prompt.onclick = () => {
      prompt.select();
      document.execCommand("copy");
    };

    // 解答フォーム
    const form = document.createElement("form");
    const formInput = document.createElement("input");
    const formButton = document.createElement("button");
    formInput.type = "text";
    formInput.style.width = "50%";
    if (english) formInput.value = english;
    formInput.oninput = () => {
      // フォームに入力されている単語をハイライトする
      for (const card of document.getElementsByClassName("CardStyle")) {
        const isFilled = formInput.value.includes(card.innerText.trim());
        card.style.backgroundColor = isFilled ? "#FFFFFF" : null;
        card.style.boxShadow = isFilled ? null : "#111122AA 2px 2px 4px";
      }
    };
    formButton.innerText = "Submit";
    form.onsubmit = () => {
      const guess = formInput.value.trim();
      // 解答がヒントに適合するかを確認
      if (
        hint &&
        !new RegExp(
          "^" +
            hint
              .split("*")
              .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
              .join(".+") +
            "$",
        ).test(guess)
      ) {
        unsafeWindow.alert("Error: Hint に不適合です。");
        prompt.textContent = prompt.textContent.replace(
          /^(Wrong answer\..*\n)?/,
          "This answer doesn't fit the hint format. Fix the answer and try again.\n",
        );
        return false;
      }
      // DFS で番号を復元
      const dfs = [[]];
      while (dfs.length) {
        const cur = dfs.pop();
        const curWords = cur.map((idx) => words[idx]);
        console.log(JSON.stringify({ dfs, cur, curWords }));
        for (let i = 0; i < words.length; i++) {
          if (cur.includes(i)) continue;
          const nxt = [...cur, i];
          const nxtStr = [...curWords, words[i]].join(" ");
          if (!guess.startsWith(nxtStr)) continue;
          if (nxtStr === guess) {
            // 解答を提出する
            unsafeWindow.CompileString(nxt.filter((idx) => idx < unsafeWindow.Segments.length).map((idx) => 1 + idx));
            return false;
          }
          dfs.push(nxt);
        }
      }
      unsafeWindow.alert("Error: 選択肢に不適合です。");
      prompt.textContent = prompt.textContent.replace(
        /^(Wrong answer\..*\n)?/,
        "This answer cannot be created by rearranging the words. Fix the answer and try again.\n",
      );
      return false;
    };
    form.append(formInput, formButton);

    // 英訳表示
    const translated = document.createElement("div");
    translated.innerText = "Google 翻訳: (translating...)";
    translated.style.margin = "0 0 1em";

    // HTML に要素を追加
    const tool = document.createElement("div");
    tool.append(translated, prompt, form);
    tool.id = "sorting-tool";
    tool.style.margin = "1em 0 1em";
    tool.style.padding = "1em";
    tool.style.backgroundColor = "#55FFAA55";
    document.getElementById("problem-area").after(tool);

    // Google 翻訳
    try {
      const res = await fetch(
        `https://script.google.com/macros/s/AKfycbzEZw6zYUzho3wsI_hUpB3Lq0_1xmrMbj7_7ecwY2BjL93ILXLA/exec?text=${encodeURIComponent(japanese)}&source=ja&target=en`,
        {
          method: "GET",
          headers: { "Content-Type": "text/plain" },
          cache: "no-store",
        },
      ).then((res) => res.json());
      if (res.code !== 200) throw new Error(res.error);
      translated.innerText = translated.innerText.replaceAll("(translating...)", res.text);
      if (!formInput.value) {
        formInput.value = res.text;
        formInput.oninput();
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    // 解答画面

    const english = [...document.getElementById("question_area").childNodes]
      .filter((node) => node instanceof Text)
      .map((node) => node.wholeText.trim())
      .find((text) => text.length >= 3);

    await GM.setValue(problem, english);
    console.log({ [problem]: english });
  }
}

async function movie() {
  const form = document.ExpForm;
  const video = form.querySelector("video > source")?.src;
  const problem = `movie.${encodeURIComponent(video)}`;
  console.log({ video, problem });

  if (!document.getElementById("commentary")) {
    // 問題画面

    const commentary = await GM.getValue(problem, null);
    console.log({ [problem]: commentary });

    // 答えがあれば自動入力
    if (typeof commentary === "string") {
      for (const elm of form.elements) {
        if (elm.type !== "checkbox") continue;
        elm.checked = commentary
          .toUpperCase()
          .match(new RegExp(`\\b${elm.value.toUpperCase().replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")}\\b`));
      }
    }

    // 次の問題に行くボタンがあるとき、正解を見るボタンを追加
    if (document.querySelector("input.button-next-problem")) {
      document.getElementById("ans_submit").parentNode.innerHTML +=
        `<input type="button" value="正解を見る" class="button button-trans problem-view-answer" onclick="document.viewAnswer.submit();">`;
    }
  } else {
    // 解答画面

    const commentary = document.getElementById("commentary").innerText;

    await GM.setValue(problem, commentary);
    console.log({ [problem]: commentary });
  }
}

setTimeout(() => {
  "use strict";

  // テキスト選択禁止を解除
  document.body.onselectstart = null;

  if (document.querySelector(".page-title > small").innerText.match(/並び替え/)) sorting();
  if (document.querySelector(".page-title > small").innerText.match(/多肢選択（チェックボックス）/)) movie();
}, 500);
