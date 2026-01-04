// ==UserScript==
// @license      MIT
// @name         Get all downloadable content from MIT OpenCourseWare
// @match        https://ocw.mit.edu/courses/*
// @description  Get a button to download all the content from a course and lot to console
// @version 0.0.1.20221203155027
// @namespace https://greasyfork.org/users/941655
// @downloadURL https://update.greasyfork.org/scripts/455944/Get%20all%20downloadable%20content%20from%20MIT%20OpenCourseWare.user.js
// @updateURL https://update.greasyfork.org/scripts/455944/Get%20all%20downloadable%20content%20from%20MIT%20OpenCourseWare.meta.js
// ==/UserScript==

var res = [];

const mainButton = document.createElement("button");
mainButton.innerText = "Get all links";
mainButton.style.marginLeft = "auto";

console.log("Script loaded");

const parseLecture = async (linkElement) => {
  const page = new DOMParser().parseFromString(
    await (await fetch(linkElement.getAttribute("href"))).text(),
    "text/html"
  );
  return {
    title: `${linkElement.parentElement.getAttribute(
      "data-title"
    )}${linkElement.textContent.trim()}`,
    link: page
      .querySelector("a.download-file")
      .getAttribute("href"),
  };
}

const getLecture = async (lectureElement, name) => {
  const linkElements = lectureElement.querySelectorAll("a");
  const lectureTasks = [];

  linkElements.forEach((linkElement) => {
    lectureTasks.push(parseLecture(linkElement));
  });

  return { links: await Promise.all(lectureTasks), name };
}



const main = async () => {
  console.log("Starting...");

  const tasks = [];
  let idx = 1;
  for (const lectureElement of document.querySelectorAll(".card-body tbody tr")) {
    const name = `${idx++}. ${lectureElement.querySelector("a").textContent.trim()}`;
    tasks.push(getLecture(lectureElement, name));
  }

  res = await Promise.all(tasks);
  console.log("Done!");
  console.table(res);
}

mainButton.onclick = main;

document.addEventListener("readystatechange", () => {
  console.log("Adding button...");
  document.querySelector(".course-banner-content").appendChild(mainButton);
});
