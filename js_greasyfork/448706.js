// ==UserScript==
// @name         NPTEL-Save-Sourse-Content
// @match        https://onlinecourses.nptel.ac.in/*
// @grant        GM_setValue
// @license      MIT
// @description  Get all content downloads of any nptel course. \n Adds a button on the nav bar to run the script.
// @version      0.4.4
// @namespace    https://greasyfork.org/users/941655
// @downloadURL https://update.greasyfork.org/scripts/448706/NPTEL-Save-Sourse-Content.user.js
// @updateURL https://update.greasyfork.org/scripts/448706/NPTEL-Save-Sourse-Content.meta.js
// ==/UserScript==

const courseContentWeeks = [];
const DEBUG = false;

/** @typedef {'assignment'|'material'|'book'|'transcript'|'lecture'|'video'|'notes'} ITEM_TYPE */

/**
 * @typedef {Object} Course
 * @property {string} title
 * @property {ITEM_TYPE} type
 * @property {string} href
 * @property {string} data
 * @property {string} meta
 */

/**@type {ITEM_TYPE}*/
const DEBUG_TYPE = "notes";

/**@type {Map<ITEM_TYPE, Boolean>}*/
const allowedTypes = new Map([
  ["assignment", true],
  ["material", true],
  ["notes", true],
  ["book", true],
  ["transcript", true],
  ["lecture", true],
  ["video", false],
]);

/**
 * @param {Course} course
 */
const getContent = async (course) => {
  let ret = null;
  let meta = null;

  switch (course.type) {
    case "assignment":
    case "material":
      {
        const body = await (await fetch(course.href)).text();
        const dom = new DOMParser().parseFromString(body, "text/html");
        ret = dom.querySelector('.gcb-lesson-content a[target]')
          ?.getAttribute("href");
        if (!ret) {
          ret = dom.querySelector(
            'iframe[src^="https://drive"], iframe[src^="https://docs.google.com"]',
          )?.getAttribute("src");
          !ret && DEBUG && console.log("[Error] No link found");
        }
      }
      break;

    case "transcript":
    case "lecture":
    case "book":
    case "notes":
      {
        const body = await (await fetch(course.href)).text();
        const dom = new DOMParser().parseFromString(body, "text/html");
        const a = dom.querySelector(".gcb-lesson-content a[target]");
        if (a) {
          course.title = a.parentElement.textContent || course.type;
          ret = a.href;
        } else DEBUG && console.log("[Error] No link found");
      }
      break;

    case "video":
      {
        const body = await (await fetch(course.href)).text();
        const videoId = body.match(/loadIFramePlayer\(['"](.+)['"],/)?.[1];
        const dom = new DOMParser().parseFromString(body, "text/html");
        meta = dom.querySelector("div.gcb-lesson-content > span")?.innerText;
        !videoId && DEBUG && console.log("[Error] No link found");
        ret = `https://www.youtube.com/watch?v=${videoId}`;
      }
      break;
    default:
      DEBUG && console.log("UNIMPLEMENTED type", course);
      break;
  }

  DEBUG && console.log(course.title);
  return { ...course, data: ret, meta };
};

/**
 * @param {ITEM_TYPE} type
 * @param {Array} week
 * @param {Object} content
 */
const appendContent = (type, week, content) => {
  if (DEBUG) {
    if (type === DEBUG_TYPE) {
      week.push(content);
    }
  } else if (allowedTypes.get(type)) {
    week.push(content);
  }
};

const fetchContent = async () => {
  const nodes = document.querySelectorAll(
    "div[id^=unit_navbar] > ul[id^=subunit_navbar]",
  );

  nodes.forEach((el) => {
    const week = [];
    const tags = el.querySelectorAll("li > div > a");
    tags.forEach((tag) => {
      const thing = tag.textContent.toLowerCase();
      /**@type {ITEM_TYPE}*/
      let type;
      if (thing.includes("solution")) {
        type = "assignment";
        appendContent(type, week, {
          href: tag.getAttribute("href"),
          title: tag.textContent,
          type,
        });
      } else if (thing.includes("lecture notes")) {
        type = "notes";
        appendContent(type, week, {
          href: tag.getAttribute("href"),
          title: tag.textContent,
          type,
        });
      } else if (thing.includes("course material")) {
        type = "material";
        appendContent(type, week, {
          href: tag.getAttribute("href"),
          title: tag.textContent,
          type,
        });
      } else if (thing.includes("book")) {
        type = "book";
        appendContent(type, week, {
          href: tag.getAttribute("href"),
          title: tag.textContent,
          type,
        });
      } else if (thing.includes("transcript")) {
        type = "transcript";
        appendContent(type, week, {
          href: tag.getAttribute("href"),
          title: tag.textContent,
          type,
        });
      } else if (thing.includes("lecture material")) {
        type = "lecture";
        appendContent(type, week, {
          href: tag.getAttribute("href"),
          title: tag.textContent,
          type,
        });
      } else if (
        thing.match(/lec(ture)? ?\d+ ?:/) !== null ||
        thing.match(/part \d/) !== null
      ) {
        type = "video";
        appendContent(type, week, {
          href: tag.getAttribute("href"),
          title: tag.textContent,
          type,
        });
      } else {
        // DEBUG && console.log("UNKNOWN thing", thing);
      }
    });
    week.length && courseContentWeeks.push(week);
  });

  await courseContents();
};

const courseContents = async () => {
  const promises = [];
  const total = courseContentWeeks.flat().length;

  for (let weekIdx = 0; weekIdx < courseContentWeeks.length; ++weekIdx) {
    for (let i = 0; i < courseContentWeeks[weekIdx].length; ++i) {
      promises.push(updateContent(weekIdx, i, total));
    }
  }

  await Promise.all(promises);
};

const updateContent = async (weekIdx, i, total) => {
  const el = courseContentWeeks[weekIdx][i];
  courseContentWeeks[weekIdx][i] = await getContent(el);
  incrementProgress(total);
};

/**
 * Builds a table from the given objects.
 * @param {Array<String>} labels
 * @param {Array} objects
 * @param {HTMLElement} container
 */
function buildTable(labels, objects, container) {
  container.querySelector("table")?.remove();

  const table = document.createElement("table");
  table.style.textAlign = "center";
  table.style.width = "100%";

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const theadTr = document.createElement("tr");

  for (let i = 0; i < labels.length; ++i) {
    const theadTh = document.createElement("th");
    theadTh.innerHTML = labels[i].toUpperCase();
    theadTr.appendChild(theadTh);
  }
  thead.appendChild(theadTr);
  table.appendChild(thead);

  for (let j = 0; j < objects.length; ++j) {
    const tbodyTr = document.createElement("tr");
    for (let k = 0; k < labels.length; ++k) {
      const tbodyTd = document.createElement("td");
      tbodyTd.style.padding = "10px";
      if (objects[j][labels[k]]?.startsWith("http")) {
        const a = document.createElement("a");
        a.href = objects[j][labels[k]];
        a.target = "_blank";
        a.innerHTML = "Open Link";
        if (objects[j]["meta"]) {
          const p = document.createElement("p");
          p.innerHTML = objects[j]["meta"];
          tbodyTd.appendChild(p);
        }
        tbodyTd.appendChild(a);
      } else {
        tbodyTd.innerHTML = objects[j][labels[k]];
      }
      tbodyTr.appendChild(tbodyTd);
    }
    tbody.appendChild(tbodyTr);
  }
  table.appendChild(tbody);

  container.prepend(table);
}

const nav = document.querySelector(".gcb-aux");
const button = document.createElement("button");

const progressDiv = document.createElement("div");
progressDiv.appendChild(document.createTextNode("Please wait..."));
const progress = document.createElement("span");
progressDiv.appendChild(progress);

const itemListDiv = document.createElement("div");
Array.from(allowedTypes.keys()).forEach((item) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = item;
  checkbox.checked = allowedTypes.get(item);
  checkbox.addEventListener("change", () => {
    allowedTypes.set(item, checkbox.checked);
  });

  const label = document.createElement("label");
  label.htmlFor = item;
  label.textContent = item;

  itemListDiv.appendChild(checkbox);
  itemListDiv.appendChild(label);
  itemListDiv.appendChild(document.createElement("br"));
});

const setProgress = (val) => {
  progress.innerText = `${val.toPrecision(2)}%`;
};

const incrementProgress = (total) => {
  const val = parseFloat(progress.innerText.replace("%", ""));
  setProgress(val + 100 / total);
};

button.innerHTML = "Run Script";
progressDiv.style.display = "none";

button.onclick = async () => {
  console.log("scriptMain");
  setProgress(0);
  courseContentWeeks.length = 0;

  progressDiv.style.display = "block";
  await fetchContent();
  progressDiv.style.display = "none";

  console.table(courseContentWeeks.flat());
  buildTable(
    ["title", "type", "data"],
    courseContentWeeks.flat(),
    document.getElementById("gcb-main-body"),
  );

  console.log(courseContentWeeks);
};

nav.appendChild(button);
nav.appendChild(progressDiv);
nav.appendChild(itemListDiv);

(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.clear();
})();
