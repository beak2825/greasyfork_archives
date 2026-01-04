// ==UserScript==
// @name        Naurok Bypass v2
// @author      griffi-gh
// @namespace   griffi-gh
// @description Fetches answers to *all* Naurok quizes
// @version     8.1
// @license     MIT
// @match       *://naurok.com.ua/test/*.html
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-start
// @inject-into content
// @sandbox     DOM
// @connect     naurok.com.ua
// @icon        https://play-lh.googleusercontent.com/scIkpmsUJTfDbV39X0rb-AvxbgxOrpa9zIGJQqDHP1VbuBTmortXomSSWVZnpErwyA=w480-h960
// @homepageURL https://greasyfork.org/uk/scripts/461662-naurok-bypass-v2
// @downloadURL https://update.greasyfork.org/scripts/529677/Naurok%20Bypass%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/529677/Naurok%20Bypass%20v2.meta.js
// ==/UserScript==

"use strict"; {

console.log("Naurok Bypass v2");

// Check if already loaded
if (window._BNAUROK2 != null) {
  console.error("already loaded");
  return;
} else {
  window._BNAUROK2 = true;
}

//Required to work around the false session issue
const SESSION_PROXY = "https://eobzz8g6oxzrky0.m.pipedream.net/";

const ls_key = `cached-${document.location.pathname.replaceAll("/", "-").slice(1, -5).toLowerCase()}`;

async function loadStuff() {
  pre_display();
  const hostname = window.location.hostname;
  const base = document.location.href.slice(0, -5);
  
  const set_text = await fetch(base + "/set").then(x => x.text());
  const set_document = document.createElement("html");
  set_document.innerHTML = set_text;
  
  const set_form = set_document.querySelector("#w0");
  const set_form_data = new FormData(set_form);
  set_form_data.set("Homework[deadline_day]", "9999-01-01");
  set_form_data.set("Homework[show_answer]", "1");
  
  const homework_res = await fetch(set_form.action, {
    redirect: 'follow',
    method: 'POST',
    credentials: 'include',
    body: set_form_data,
  });

  const homework_url = homework_res.url;
  const homework_id = homework_url.split("/").at(-1);
  const homework_text = await homework_res.text();
  const homework_document = document.createElement("html");
  homework_document.innerHTML = homework_text;
  
  const homework_csrf_param = homework_document.querySelector('meta[name="csrf-param"]').content;
  const homework_csrf_token = homework_document.querySelector('meta[name="csrf-token"]').content;
  const homework_csrf_form_data = new FormData();
  homework_csrf_form_data.set(homework_csrf_param, homework_csrf_token);
  
  const homework_code = homework_document.querySelector(".homework-code").textContent;
  const join_text = await fetch(`https://${hostname}/test/join?gamecode=${homework_code}`).then(res => res.text());
  const join_document = document.createElement('html');
  join_document.innerHTML = join_text;
  
  const join_form = join_document.querySelector("#participate-form-code");
  const join_form_data = new FormData(join_form);
  const username = "[object Object]";
  join_form_data.set("JoinForm[name]", username);
  
  const join_res = await fetch(join_form.action, {
    redirect: 'follow',
    method: 'POST',
    credentials: 'include',
    body: new URLSearchParams(join_form_data).toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  
  const test_session_url = join_res.url;
  const session_text = await fetch(test_session_url).then(res => res.text());
  const session_document = document.createElement("html");
  session_document.innerHTML = session_text;
  
  const testik_elem = session_document.querySelector('[ng-app="testik"]');
  const ng_init = testik_elem.getAttribute("ng-init");
  const ng_init_numbers = ng_init.match(/[0-9]+/g);
  const session_id = ng_init_numbers[1] || 0;
  
  let session_info = await fetch(`https://${hostname}/api2/test/sessions/${session_id}`, {
    credentials: "include",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
  }).then(x => x.json());
  
  if (session_info == false) {
    session_info = await fetch(SESSION_PROXY, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session: session_id
      })
    }).then(x => x.json());
  }
  
  const {latest_question, questions} = session_info;
  const question = latest_question ? questions.find(question => question.id == latest_question) : questions[0];
  const answer_id = question.options[0].id.toString();
  
  await fetch(`https://${hostname}/api2/test/responses/answer`, {
    method: "PUT",
    credentials: "include",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "session_id": session_id,
      "answer": [answer_id],
      "question_id": question.id,
      "show_answer": 1,
      "type": "quiz",
      "point": question.point.toString(),
      "homeworkType": question.type,
      "homework": true
    }),
  });
  
  const end_sess_data = await fetch(`https://${hostname}/api2/test/sessions/end/${session_id}`, {
    "method": "PUT",
    "credentials": "include",
  }).then(res => res.json());
  const end_sess_uuid = end_sess_data.session.uuid;
  
  const test_end_text = await fetch(`https://${hostname}/test/complete/${end_sess_uuid}`, {
    redirect: 'follow'
  }).then(res => res.text());
  
  const test_end_document = document.createElement("html");
  test_end_document.innerHTML = test_end_text;
  const answers = test_end_document.querySelector(".homework-stats");
  display_answers(answers);
  
  await fetch(`https://${hostname}/test/homework/${homework_id}/stop`, {
    method: 'POST',
    credentials: 'include',
    body: homework_csrf_form_data,
  });
  
  await fetch(`https://${hostname}/test/homework/${homework_id}/delete`, {
    method: 'POST',
    credentials: 'include',
    body: homework_csrf_form_data,
  });
  
  return answers;
};

function pre_display() {
  Array.from(document.querySelectorAll(".question-view-item")).forEach(item => item.remove());
  Array.from(document.querySelectorAll(".answer-sheet")).forEach(item => item.remove());
}

function display_answers(answers) {
  pre_display();
  answers.classList.add("row");
  answers.classList.add("answer-sheet");
  answers.innerHTML = answers.innerHTML.replaceAll("<em>— ваша відповідь</em>", "");
  const afer_element = document.querySelector(".block-head");
  afer_element.parentNode.insertBefore(answers, afer_element.nextSibling);
};

async function loadStuffWriteCache() {
  const answers = await loadStuff();
  const elem = document.createElement("div");
  display_answers(elem);
  elem.appendChild(answers.cloneNode(true));
  (window.GM_setValue ?? localStorage.setItem.bind(localStorage))(ls_key, elem.innerHTML);
}

function loadErrorHandler(err) {
  console.error(err);
  const btn = document.querySelector(".clicky-click");
  btn.title = `Помилка: ${err.toString()}\nСпробуйте:\n1. Натиснути кнопку ще раз\n2. Відкрити і закрити сторінку https://naurok.com.ua/test/join?gamecode=0\n3. Увійти в аккаунт Наурок https://naurok.com.ua/login\n4. Спробувати ще раз через 5 хвилин`;
}

async function loadStuffAndWriteCacheWithErrorHandler() {
  try {
    await loadStuffWriteCache();
    return true;
  } catch(err) {
    loadErrorHandler(err);
    return false;
  }
}

let is_cached = false;
let cached_element = null;
if ((window.GM_getValue ?? localStorage.getItem.bind(localStorage))(ls_key, null)) {
  const elem = document.createElement("div");
  try {
    elem.innerHTML = (GM_getValue ?? localStorage.getItem.bind(localStorage))(ls_key, null);
    cached_element = elem.firstChild;
    is_cached = true;
  } catch (e) {
    console.error("Cache invalid:", e);
    is_cached = false;
    cached_element = null;
  }
}

const MAIN = async () => {
  if (is_cached) {
    try {
      display_answers(cached_element);
    } catch(e) {
      console.error("Cache invalid:", e);
      is_cached = false;
      cached_element = null;
    }
  }

  const style = `
    .answer-sheet {
      padding: 1.33rem;
    }
    .answer-sheet .homework-stat-option-value.incorect :is(.quiz,.multiquiz) {
      background: #cccccc !important;
      color: black !important;
    }
    .answer-sheet .homework-stat-option-value.correct :is(.quiz,.multiquiz) {
      background: #23c552 !important;
      color: black !important;
    }
    .answer-sheet .homework-stat-option-value :is(.quiz,.multiquiz) {
      top: .5rem !important;
    }
    .answer-sheet .homework-stat-option-value.correct {
      background: linear-gradient(to bottom, rgba(0,0,0,0), #e3f7e9 15%, #e3f7e9 85%, rgba(0,0,0,0)) !important;
      border-radius: .25rem !important;
    }
    .answer-sheet .homework-stat-option-value p {
      margin: 0.5rem 0.25rem !important;
    }
    .answer-sheet .question-label {
      display: none !important;
    }
    .answer-sheet .ql-cursor {
      display: none !important;
    }
    .answer-sheet .content-block.success,
    .answer-sheet .content-block.skipped,
    .answer-sheet .content-block.failed,
    .answer-sheet .content-block.partial {
      border-left: none !important;
    }
    .clicky-click {
      background: #808080;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.25s;
      width: 100px;
      height: 40px;
    }
    .clicky-click:hover {
      background: #666666;
    }
    .clicky-click:disabled {
      background: #999999;
      cursor: not-allowed;
    }
    #cb_wrapper {
      display: block;
      text-align: center;
      margin-top: 10px;
    }
    #auto_load_cb {
      margin-right: .25rem;
    }
    body {
      overflow: auto !important;
    }
    .homework-stat-option-value em {
      color: inherit !important;
    }
  `;
  
  const style_elem = document.createElement("style");
  style_elem.textContent = style;
  document.head.appendChild(style_elem);

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("clicky-click");
  
  button.addEventListener("click", async () => {
    button.disabled = true;
    await loadStuffAndWriteCacheWithErrorHandler();
    button.disabled = false;
  });
  
  const buttons = document.querySelector(".single-test-actions");
  buttons.prepend(button);

  const auto_load_cb = document.createElement("input");
  auto_load_cb.id = "auto_load_cb";
  auto_load_cb.type = "checkbox";
  const save_state = () => {
    (window.GM_setValue || localStorage.setItem.bind(localStorage))("auto-load", auto_load_cb.checked ? "1" : "0");
  }
  auto_load_cb.checked = ((window.GM_getValue || localStorage.getItem.bind(localStorage))("auto-load") || "0") == "1";
  save_state();
  auto_load_cb.addEventListener("change", save_state);
  if (!is_cached && auto_load_cb.checked) {
    button.click();
  }
  
  const cb_wrapper = document.createElement("div");
  cb_wrapper.id = "cb_wrapper";
  const cb_label = document.createElement("label");
  cb_label.textContent = "Автоматично завантажувати відповіді";
  cb_label.setAttribute("for", auto_load_cb.id);
  cb_wrapper.appendChild(auto_load_cb);
  cb_wrapper.appendChild(cb_label);
  const afer_element = document.querySelector(".clicky-click");
  afer_element.parentNode.insertBefore(cb_wrapper, afer_element.nextSibling);
};

if ((document?.readyState == "interactive") || (document?.readyState == "complete")) {
  MAIN();
} else {
  document.addEventListener("DOMContentLoaded", MAIN);
}

}