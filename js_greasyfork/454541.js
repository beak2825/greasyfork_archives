// ==UserScript==
// @name        CourseList formatter - mai.ru
// @namespace   Violentmonkey Scripts
// @match       https://lms.mai.ru/
// @grant       none
// @version     1.2
// @author      -
// @license MIT
// @description 09.03.2022, 00:18:00
// @downloadURL https://update.greasyfork.org/scripts/454541/CourseList%20formatter%20-%20mairu.user.js
// @updateURL https://update.greasyfork.org/scripts/454541/CourseList%20formatter%20-%20mairu.meta.js
// ==/UserScript==

let courseList = document.querySelector("div.course-list");

let courses = Array.from(
  courseList.children,
  node => ({
    title: node.querySelector("h4.card-title").firstChild.innerHTML,
    courseId: node.getAttribute("data-courseid")
  })
).sort(function(a, b) {
  if (a.title < b.title) {
    return -1;
  } else if (a.title === b.title) {
    return 0;
  } else {
    return 1;
  }
});

let newList = document.createElement("ol");

for (const curr of courses) {
    let newNode = document.createElement("a");
    newNode.href = `https://lms.mai.ru/course/view.php?id=${curr.courseId}`;
    newNode.innerHTML = curr.title;
    let li = document.createElement("li");
    li.appendChild(newNode);
    newList.appendChild(li);
}

courseList.replaceWith(newList);
document.getElementById("frontpage-course-list").firstChild.remove();
document.getElementsByClassName("skip-block skip")[0].remove();
document.getElementsByClassName("icon fa slicon-question text-info fa-fw")[0].remove()
document.getElementsByClassName("btn btn-secondary")[0].remove();
document.getElementsByClassName("btn btn-link p-0")[0].remove();

let shortSearchBox = document.getElementById("shortsearchbox");
shortSearchBox.addEventListener("input", ev => {
  let val = ev.target.value.toLowerCase();
  for (const el of newList.children) {
    el.style.display = el.innerHTML.toLowerCase().includes(val) ? "list-item": "none";
  }
})
// shortSearchBox.type = "button";
shortSearchBox.value = "";
shortSearchBox.focus();