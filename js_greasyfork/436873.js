// ==UserScript==
// @name         QNA HIT Helper
// @namespace    http://tampermonkey.net/
// @version      0.5.4
// @description  Auto selects all correct radio buttons. Translates questions and answers.
// @author       lucassilvas1
// @match        http*://www.mturkcontent.com/dynamic/hit*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// jshint        esversion: 8
// @downloadURL https://update.greasyfork.org/scripts/436873/QNA%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/436873/QNA%20HIT%20Helper.meta.js
// ==/UserScript==

const qElements = document
  .getElementById("mturk_form")
  .getElementsByTagName("section");
if (qElements && document.querySelector(".panel.panel-primary")) main();

async function main() {
  "use strict";

  const toISO = {
    Spanish: "es",
    French: "fr",
    German: "de",
    Italian: "it",
    Japanese: "ja",
  };
  let language;
  let translated = false;

  async function getBearer() {
    const bearerStr = GM_getValue("bearer");
    let bearer = bearerStr ? JSON.parse(bearerStr) : null;
    if (bearer)
      if (new Date().getTime() < bearer.timeAdded + 540000) return bearer.token;
    try {
      const res = await fetch("https://edge.microsoft.com/translate/auth");
      if (res.ok) {
        const token = await res.text();
        console.log("TOKEN", token);
        GM_setValue(
          "bearer",
          JSON.stringify({ timeAdded: new Date().getTime(), token })
        );
        return token;
      }
    } catch (error) {
      console(error);
    }
  }

  async function translate() {
    const pElements = [...document.getElementsByTagName("p")];
    pElements.splice(pElements.length - 5);

    const textArr = pElements.map((p) => ({ Text: p.textContent }));

    const t = await fetchTranslations(textArr);
    if (t[0].translations[0].text) {
      pElements.forEach((p, i) => {
        p.dataset.alt = p.textContent;
        p.textContent = t[i].translations[0].text;
      });
      showOriginalButtons();
    }

    translated = true;
  }

  async function fetchTranslations(textArr) {
    const short = toISO[language];
    const res = await fetch(
      "https://api.cognitive.microsofttranslator.com/translate?to=en&api-version=3.0&includeSentenceLength=true" +
        (short ? "&from=" + short : ""),
      {
        method: "POST",
        headers: {
          authorization: "Bearer " + (await getBearer()),
          "content-type": "application/json",
        },
        body: JSON.stringify(textArr),
      }
    );

    if (res.status !== 200) console.log(res);

    return res.json();
  }

  async function shouldTranslate() {
    language = document
      .querySelector(".panel-body ul li")
      .textContent.split(" ")[5];
    const doNotTranslate = ["Portuguese", "answer"];
    if (doNotTranslate.includes(language)) return false;
    return GM_getValue("translate", true);
  }

  function createCheck(checked) {
    const checkbox = `<div style="position:fixed;
									  top: 0; right: 0;
									  background-color: rgb(30, 32, 33);
									  padding: 5px;
									  border-bottom-left-radius: 3px;
									  border: 1px solid rgb(200, 195, 188);
									  border-top: none;
									  border-right: none">
				<label style="margin: 0">
					<input id="translate" type="checkbox" value="true" style="margin: 0 3px 0 0; vertical-align: middle" ${
            checked ? "checked" : ""
          }>
					<span style="vertical-align: middle">Auto translate</span>
				</label>
			</div>`;

    document
      .querySelector(".row.col-xs-12.col-md-12")
      .insertAdjacentHTML("afterbegin", checkbox);
    return document.getElementById("translate");
  }

  function check() {
    const trapQuestionIndex = qElements.length - 2;

    for (let i = 0; i < qElements.length; i++) {
      const radios = qElements[i].querySelectorAll(".radio input");
      if (i === trapQuestionIndex) radios[1].checked = true;
      else radios[0].checked = true;
    }
  }

  function fullWidthRadios() {
    GM_addStyle(`
			.radio label {
				display: inline-block !important;
				width: 100% !important;
			}

			.show-original {
				float: right;
				margin-right: 5px;
				text-decoration: underline;
			}
		`);
  }

  function showOriginalButtons() {
    [...document.getElementsByTagName("fieldset")]
      .slice(0, -2)
      .forEach((pair) => {
        const link = `<a href="#" class="show-original">show original</a>`;
        pair.insertAdjacentHTML("afterbegin", link);
      });

    document.body.addEventListener("click", (e) => {
      const t = e.target;
      if (t.tagName === "A") {
        e.preventDefault();
        if (t.textContent === "show original")
          t.textContent = "show translated";
        else t.textContent = "show original";
        [...t.parentElement.children].forEach((el) => {
          if (el.tagName === "P") {
            const alt = el.dataset.alt;
            el.dataset.alt = el.textContent;
            el.textContent = alt;
          }
        });
      }
    });
  }

  check();
  fullWidthRadios();

  const should = await shouldTranslate();
  if (should) translate();

  const checkboxEl = createCheck(should);
  checkboxEl.addEventListener("change", (e) => {
    if (e.target.checked) {
      if (!translated) translate();
      GM_setValue("translate", true);
    } else GM_setValue("translate", false);
  });
}
