// ==UserScript==
// @name         Canvas Dashboard Grades
// @namespace    https://xela.codes
// @version      2025-01-07
// @description  Modern alternative to the Canvas Dashboard Grades extension.
// @author       Alex
// @match        https://*.instructure.com/
// @icon         https://lh3.googleusercontent.com/kA8gaN8ouFmWN-A224OZoB7mR_YpqQuWqeMUcuATLT1DBVecjfD5arRhIvl0rQ17-LoeVump_yWWVmjKKmjc1kQDKbE=s60
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/523088/Canvas%20Dashboard%20Grades.user.js
// @updateURL https://update.greasyfork.org/scripts/523088/Canvas%20Dashboard%20Grades.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  const enrolledCourses = await fetch(
    location.protocol +
      "//" +
      location.host +
      location.pathname +
      "api/v1/courses?include[]=total_scores&per_page=100&enrollment_state=active",
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  ).then((res) => res.json());

  function doGrades() {
    enrolledCourses.forEach((course) => {
      /** course card header element */
      const courseCard = document.querySelector(
          `.ic-DashboardCard a[href="/courses/${course.id}"]`
        )?.parentElement,
        hero = courseCard?.querySelector(".ic-DashboardCard__header_hero"),
        /** course enrollment information (contains grade) */
        enrollment = course.enrollments?.slice(-1)[0];
      if (!courseCard || !hero || !enrollment)
        return console.error(`Failed to add grade for course ${course.name}.`);

      // use the course color for text
      const color = hero.style?.backgroundColor || "inherit";

      const title = document.createElement("span");
      title.classList.add("cdg-grade");
      title.style.color = color;
      title.style.background = "white";
      title.style.borderRadius = "99999px";
      title.style.opacity = "1";
      title.style.padding = "0.2rem 0.5rem";
      title.style.fontSize = title.style.lineHeight = "14px";
      title.style.display = "inline-block";
      title.style.position = "absolute";
      title.style.top = title.style.left = "0.35rem";
      title.style.fontWeight = "bold";
      title.innerText =
        // the enrollment contains the current grade
        enrollment.computed_current_score == null ? "N/A" : `${enrollment.computed_current_score}%`;
      courseCard.appendChild(title);

      // update the color if changed
      const observer = new MutationObserver((list) => {
        if (!title.parentElement) return;
        list.forEach((mut) => {
          if (mut.type == "attributes" && mut.attributeName == "style")
            title.style.color = hero.style.backgroundColor || "inherit";
        });
      });

      observer.observe(hero, { attributes: true });
    });
  }
  doGrades();

  // sometimes the page gets re-rendered, removing the grades
  // so we check every so often to make sure they're still there
  if (enrolledCourses?.length)
    setInterval(() => {
      if (!document.querySelector(".cdg-grade")) doGrades();
    }, 66);
})();
