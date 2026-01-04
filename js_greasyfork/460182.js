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
// @grant       GM_getResourceURL
// @run-at      document-start
// @inject-into content
// @sandbox     DOM
// @connect     naurok.com.ua
// @icon        https://play-lh.googleusercontent.com/scIkpmsUJTfDbV39X0rb-AvxbgxOrpa9zIGJQqDHP1VbuBTmortXomSSWVZnpErwyA=w480-h960
// @homepageURL https://greasyfork.org/uk/scripts/461662-naurok-bypass-v2
// @resource    LOADING_IMAGE         https://media.tenor.com/MlCeUwzn2nEAAAAM/troll-lol.gif
// @resource    TEST_IMAGE_URL        https://cdn-icons-png.flaticon.com/512/190/190411.png
// @resource    TEST_UPDATE_IMAGE_URL https://cdn-icons-png.flaticon.com/512/1601/1601884.png
// @resource    ERROR_IMAGE_URL       https://media.tenor.com/hA1b1zIqnHkAAAAd/among-us.gif
// @downloadURL https://update.greasyfork.org/scripts/461662/Naurok%20Bypass%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/461662/Naurok%20Bypass%20v2.meta.js
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
//Used only if a direct request fails
const SESSION_PROXY = "https://eobzz8g6oxzrky0.m.pipedream.net/";

let ERROR_IMAGE_URL, LOADING_IMAGE, TEST_IMAGE_URL, TEST_UPDATE_IMAGE_URL;
if (window.GM_getResourceURL) {
  //Use GM resources if possible
  console.log("Using GM resources");
  LOADING_IMAGE         = GM_getResourceURL("LOADING_IMAGE",         true);
  TEST_IMAGE_URL        = GM_getResourceURL("TEST_IMAGE_URL",        true);
  TEST_UPDATE_IMAGE_URL = GM_getResourceURL("TEST_UPDATE_IMAGE_URL", true);
  ERROR_IMAGE_URL = GM_getResourceURL("ERROR_IMAGE_URL", true);
} else {
  console.log("Using URL resources");
  LOADING_IMAGE = "https://media.tenor.com/MlCeUwzn2nEAAAAM/troll-lol.gif";
  TEST_IMAGE_URL = "https://cdn-icons-png.flaticon.com/512/190/190411.png";
  TEST_UPDATE_IMAGE_URL = "https://cdn-icons-png.flaticon.com/512/1601/1601884.png";
  ERROR_IMAGE_URL = "https://media.tenor.com/hA1b1zIqnHkAAAAd/among-us.gif";
}

const ls_key = `cached-${document.location.pathname.replaceAll("/", "-").slice(1, -5).toLowerCase()}`;

async function loadStuff() {
  //Clean up
  pre_display()

  //Get the hostname
  const hostname = window.location.hostname;
  console.log("Host:", hostname);

  //Get test path
  const base = document.location.href.slice(0, -5);
  console.log("Base URL:", base);

  //Load the homework creation page
  const set_text = await fetch(base + "/set").then(x => x.text());
  const set_document = document.createElement("html");
  set_document.innerHTML = set_text;
  console.log("Set document:", set_document);

  //Get form data and modify it
  const set_form = set_document.querySelector("#w0");
  const set_form_data = new FormData(set_form);
  set_form_data.set("Homework[deadline_day]", "9999-01-01");
  set_form_data.set("Homework[show_answer]", "1");
  console.log("Set form data:", set_form_data);

  //Start homework
  const homework_res = await fetch(set_form.action, {
    redirect: 'follow',
    method: 'POST',
    credentials: 'include',
    body: set_form_data,
  });

  //Get homework url and id
  const homework_url = homework_res.url;
  const homework_id = homework_url.split("/").at(-1);
  console.log("Homework url:", homework_url);

  //Get homework document object
  const homework_text = await homework_res.text();
  const homework_document = document.createElement("html");
  homework_document.innerHTML = homework_text;
  console.log("Homework document:", homework_document);

  //Get the CSRF token and create FormData from it
  const homework_csrf_param = homework_document.querySelector('meta[name="csrf-param"]').content;
  const homework_csrf_token = homework_document.querySelector('meta[name="csrf-token"]').content;
  const homework_csrf_form_data = new FormData();
  homework_csrf_form_data.set(homework_csrf_param, homework_csrf_token);
  console.log("CSRF param/token:", homework_csrf_param, homework_csrf_token);

  //Get join code
  const homework_code = homework_document.querySelector(".homework-code").textContent;
  console.log("Homework join code:", homework_code);

  //Load the join page
  const join_text = await fetch(`https://${hostname}/test/join?gamecode=${homework_code}`).then(res => res.text());
  const join_document = document.createElement('html');
  join_document.innerHTML = join_text;

  //Get form data and fill in the username
  const join_form = join_document.querySelector("#participate-form-code");
  const join_form_data = new FormData(join_form);
  const username = "[object Object]";
  join_form_data.set("JoinForm[name]", username); //troll naurok developers while we're at it lol

  //Start homework session
  const join_res = await fetch(join_form.action, {
    redirect: 'follow',
    method: 'POST',
    credentials: 'include',
    body: new URLSearchParams(join_form_data).toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  console.log("Joined with username", username)

  //Get test session address
  const test_session_url = join_res.url;
  console.log("Test session URL:", test_session_url);

  //Get the test session document
  const session_text = await fetch(test_session_url).then(res => res.text());
  const session_document = document.createElement("html");
  session_document.innerHTML = session_text;

  //Get session id
  const testik_elem = session_document.querySelector('[ng-app="testik"]');
  const ng_init = testik_elem.getAttribute("ng-init");
  const ng_init_numbers = ng_init.match(/[0-9]+/g);
  const session_id = ng_init_numbers[1] || 0;
  console.log("Session id", session_id);

  //Get session info
  let session_info = await fetch(`https://${hostname}/api2/test/sessions/${session_id}`, {
    credentials: "include",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
  }).then(x => x.json());
  console.log("Session info: ", session_info);

  //Work around weird issue
  if (session_info == false) {
    console.log("Oops, need to proxy the request");
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
    console.log("Session info (proxied):", session_info);
  }

  //Find the latest question
  const {latest_question, questions} = session_info;
  const question = latest_question ? questions.find(question => question.id == latest_question) : questions[0];
  console.log("Question:", question);

  //Get the answer id
  const answer_id = question.options[0].id.toString();
  console.log("Answer ID:", answer_id);

  //Answer the question
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
  console.log("Responded to the question");

  //End the session
  const end_sess_data = await fetch(`https://${hostname}/api2/test/sessions/end/${session_id}`, {
    "method": "PUT",
    "credentials": "include",
  }).then(res => res.json());
  const end_sess_uuid = end_sess_data.session.uuid;
  console.log("Session UUID:", end_sess_uuid);

  //Fetch the end page
  const test_end_text = await fetch(`https://${hostname}/test/complete/${end_sess_uuid}`, {
    redirect: 'follow'
  }).then(res => res.text());

  //Get the text end document
  const test_end_document = document.createElement("html");
  test_end_document.innerHTML = test_end_text;

  //Get the answers
  const answers = test_end_document.querySelector(".homework-stats");
  console.log("Answer element:", answers);

  //Display answers
  display_answers(answers);
  console.log("Answers displayed");

  //Stop homework
  await fetch(`https://${hostname}/test/homework/${homework_id}/stop`, {
    method: 'POST',
    credentials: 'include',
    body: homework_csrf_form_data,
  });
  console.log("Homework stopped");

  //Delete homework
  await fetch(`https://${hostname}/test/homework/${homework_id}/delete`, {
    method: 'POST',
    credentials: 'include',
    body: homework_csrf_form_data,
  });
  console.log("Homework deleted");

  console.log("DONE");

  return answers
};

function pre_display() {
  //Delete previously displayed
  Array.from(document.querySelectorAll(".question-view-item")).forEach(item => item.remove());

  //Clear the regular questions
  Array.from(document.querySelectorAll(".answer-sheet")).forEach(item => item.remove());
}

function display_answers(answers) {
  pre_display()

  //Add classes
  answers.classList.add("row");
  answers.classList.add("answer-sheet")

  //HACK: Remove "- your answer" text
  answers.innerHTML = answers.innerHTML.replaceAll("<em>— ваша відповідь</em>", "");

  //Add answers to the page
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

//Preload images
const images = []
{
  window._cow_taxes = images; //keep the reference alive
  images["loading"] = new Image();
  images["loading"].src = LOADING_IMAGE;
  images["test"] = new Image();
  images["test"].src = TEST_IMAGE_URL;
  images["update"] = new Image();
  images["update"].src = TEST_UPDATE_IMAGE_URL;
  images["error"] = new Image();
  images["error"].src = ERROR_IMAGE_URL;
}

function loadErrorHandler(err) {
  console.error(err);
  const btn = document.querySelector(".clicky-click");
  btn.querySelector("img").replaceWith(images.error);
  const label = btn.querySelector("span")
  label.textContent = "Помилка\n"+err.toString()+"\n";
  label.innerHTML = label.innerHTML.replaceAll("\n", "<br>");
  label.innerHTML += `
    FIX 1 - Натисни кнопку ще раз<br>
    FIX 2 - <a href='https://naurok.com.ua/test/join?gamecode=0' target="_blank">Відкрий і закрий цю сторінку</a><br>
    FIX 3 - <a href='https://naurok.com.ua/login' target="_blank">Увійди в аккаунт Наурок</a><br>
    FIX 4 - Спробуй ще раз через 5 хвилин
  `;
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

//Load cached answers
let is_cached = false;
let cached_element = null;
if ((window.GM_getValue ?? localStorage.getItem.bind(localStorage))(ls_key, null)) {
  console.log("Cached found:", ls_key);
  const elem = document.createElement("div");
  try {
    elem.innerHTML = (GM_getValue ?? localStorage.getItem.bind(localStorage))(ls_key, null);
    cached_element = elem.firstChild;
    is_cached = true;
    (cached_element.querySelector(".chicken-beef")?.classList.add("answer-sheet")) && console.warn("Cache contains chicken beef");
  } catch (e) {
    console.error("Cache invalid:", e);
    is_cached = false;
    cached_element = null;
  }
}

const MAIN = async () => {
  //Display cached stuff
  if (is_cached) {
    try {
      display_answers(cached_element);
      console.log("Cached answer displayed!")
    } catch(e) {
      console.error("Cache invalid:", e);
      is_cached = false;
      cached_element = null;
    }
  }

  //Add CSS
  {
    const style = `

      .answer-sheet {
        padding: 1.33rem;
      }

      /* style indicator colors*/
      .answer-sheet .homework-stat-option-value.incorect :is(.quiz,.multiquiz) {
        background: #cccccc !important;
        color: black !important;
      }
      .answer-sheet .homework-stat-option-value.correct :is(.quiz,.multiquiz) {
        background: #23c552 !important;
        color: black !important;
      }

      /* fix indicator offset */
      .answer-sheet .homework-stat-option-value :is(.quiz,.multiquiz) {
        top: .5rem !important;
      }

      /* Green bg on correct*/
      .answer-sheet .homework-stat-option-value.correct {
        background: linear-gradient(to bottom, rgba(0,0,0,0), #e3f7e9 15%, #e3f7e9 85%, rgba(0,0,0,0)) !important;
        border-radius: .25rem !important;
      }

      /* fix uneven p padding*/
      .answer-sheet .homework-stat-option-value p {
        margin: 0.5rem 0.25rem !important;
      }

      /* hide q ranking */
      .answer-sheet .question-label {
        display: none !important;
      }

      /* hide weird orange overlays */
      .answer-sheet .ql-cursor {
        display: none !important;
      }

      /* hide correctness indicators*/
      .answer-sheet .content-block.success,
      .answer-sheet .content-block.skipped,
      .answer-sheet .content-block.failed,
      .answer-sheet .content-block.partial {
        border-left: none !important;
      }

      /* style the main button */
      .clicky-click {
        display: flex;
        width: 100%;
        border-width: 0;
        font-family: inherit;
        font-size: inherit;
        font-style: inherit;
        font-weight: inherit;
        line-height: inherit;
        margin-bottom: 0 !important;
      }
      #cb_wrapper {
        display: blck;
        text-align: center;
      }
      #auto_load_cb {
        margin-right: .25rem;
      }
      #auto_load_cb ~ label {
        font-weight: unset;
      }

      /* Use flex to style our button */
      .test-action-button.clicky-click {
        display: flex !important;
        flex-direction: column !important;
        height: unset !important;
        gap: 10px !important;
      }
      .test-action-button.clicky-click * {
        position: unset !important;
      }

      /* This applies to ALL buttons (makes them a bit fancier because why not) */
      .test-action-button {
        transition: all .25s !important;
        border: 1px solid rgba(0,0,0,.1) !important;
        border-radius: 10px !important;
      }
      .test-action-button:hover {
        background: #f0f0f0 !important;
      }
      .test-action-button:hover > * {
        filter: drop-shadow(0px 0px 4px #dddddd);
      }
      .test-action-button > img {
        transition: transform .25s !important;
      }
      .test-action-button:not(:disabled):hover > img {
        transform: scale(0.9) rotate(-3deg);
      }

      /* todo: style auto load checkbox */
      #auto_load_cb {}

      /* fix scrolling */
      body {
        overflow: auto !important;
      }

      /* Remove ads */
      /* TODO: fix! hides answers too */
      /*.col-sm-8.col-md-9 {
        display: none !important;
      }*/

      /* Fix em coloring */
      .homework-stat-option-value em {
        color: inherit !important;
      }
    `;
    const style_elem = document.createElement("style");
    style_elem.textContent = style;
    document.head.appendChild(style_elem);
  }

  //Create answers button
  {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("test-action-button");
    button.classList.add("clicky-click");
    button.appendChild(images.test);
    const text_elem = document.createElement("span");
    text_elem.textContent = "Завантажити відповіді";
    button.appendChild(text_elem);
    if (is_cached) {
      button.querySelector('img').replaceWith(images.update);
      text_elem.textContent = "Оновити відповіді";
    }
    button.addEventListener("click", async () => {
      button.querySelector('img').replaceWith(images.loading);
      text_elem.textContent = "Завантаження...";
      button.disabled = true;
      if (await loadStuffAndWriteCacheWithErrorHandler()) {
        button.querySelector('img').replaceWith(images.update);
        text_elem.textContent = "Оновити відповіді";
      }
      button.disabled = false;
    });
    const buttons = document.querySelector(".single-test-actions");
    buttons.prepend(button);
  }

  //Create auto load toggle
  {
    //Create checkbox
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
      document.querySelector(".clicky-click").click();
    }
    //Add it
    const cb_wrapper = document.createElement("div");
    cb_wrapper.id = "cb_wrapper";
    const cb_label = document.createElement("label");
    cb_label.textContent = "Автоматично завантажувати відповіді";
    cb_label.setAttribute("for", auto_load_cb.id);
    cb_wrapper.appendChild(auto_load_cb);
    cb_wrapper.appendChild(cb_label);
    const afer_element = document.querySelector(".clicky-click");
    afer_element.parentNode.insertBefore(cb_wrapper, afer_element.nextSibling);
  }
};

// Run if loaded late
if ((document?.readyState == "interactive") || (document?.readyState == "complete")) {
  MAIN();
} else {
  document.addEventListener("DOMContentLoaded", MAIN);
}

}