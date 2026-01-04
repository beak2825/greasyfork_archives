// ==UserScript==
// @name        Duolingo extended lesson info
// @namespace   neobrain
// @description See what grammar/vocabulary/objectives a lesson is going to teach you
// @match       https://*.duolingo.com/*
// @grant       GM.xmlHttpRequest
// @connect     schools.duolingo.com
// @author      neobrain
// @license     MIT
// @version     1.6
// @downloadURL https://update.greasyfork.org/scripts/476484/Duolingo%20extended%20lesson%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/476484/Duolingo%20extended%20lesson%20info.meta.js
// ==/UserScript==

let activeLesson = null;

let pathData = null;
let schoolsData = null;

// Root skill path element
let skillPathElem = null;

function* iterateAllUnits() {
  if (pathData.currentCourse.path.length) {
    yield* pathData.currentCourse.path.entries();
    return;
  }

  for (const section of pathData.currentCourse.pathSectioned) {
    for (const unit of section.units) {
      yield [unit.unitIndex, unit];
    }
  }
}

function getUnitData(unit) {
  let unitData = pathData.currentCourse.path[unit];
  if (unitData) {
    return unitData;
  }
  for (const [unitIndex, sectionUnit] of iterateAllUnits()) {
    if (unitIndex == unit) {
      return sectionUnit;
    }
  }

  return null;
}

function fetchLessonData(unit, lesson) {
  let unitData = getUnitData(unit);
  let lessonId = unitData.levels[lesson].id;
  for (let lesson of schoolsData.path) {
    for (let level of lesson.levels) {
      if (level.id == lessonId) {
        return [unitData, level];
      }
    }
  }
}

// Returns pair of index + total number of levels with the given name
function getIndexOfLevel(unit, level) {
  let unitData = getUnitData(unit);
  let levelName = unitData.levels[level].debugName;
  let count = 0;
  let index = -1;
  for (let [unitIndex, unit2] of iterateAllUnits()) {
    for (let [levelIndex, level2] of unit2.levels.entries()) {
      if (level2.debugName == levelName) {
        if (parseInt(unitIndex) === parseInt(unit) && parseInt(levelIndex) === parseInt(level)) {
          index = count;
        }
        count++;
      }
    }
  }
  return [index, count];
}

let open1 = true;
let open2 = true;
let open3 = true;

function onLoaded() {
  // Page DOM: Individual lessons have data-test="skill-path-level-4"; units have data-test="skill-path-unit-57"

  const setupUnitNodes = (skillPathUnitElem) => {
    for (let lessonElem of skillPathUnitElem.querySelectorAll("button[data-test^=\"skill-path-level-\"]")) {
      const callback = (mutationList) => {
        for (const mutation of mutationList) {
          if (!mutation.addedNodes.length) {
            continue;
          }

          let elem = mutation.addedNodes[0];
          let unitStr = skillPathUnitElem.dataset.test.slice(16);
          let levelStr = lessonElem.dataset.test.split(' ')[0].slice(17);
          let [unitData, lesson] = fetchLessonData(unitStr, levelStr);

          elem.children[0].style.width = "450px";
          elem.children[0].children[0].style.resize = "both";

          let inner = elem.getElementsByTagName("a")[0];
          if (!inner) {
              inner = elem.getElementsByTagName("button")[0];
          }
          inner = inner.previousSibling;
          inner.style.maxHeight = "300px";
          inner.style.overflow = "auto";
          inner.style.scrollbarColor = "var(--path-unit-foreground-color) var(--path-unit-background-color)";
          inner.style.scrollbarWidth = "thin";
          inner.style.overscrollBehavior = "contain";
          let [levelIndex, levelCount] = getIndexOfLevel(unitStr, levelStr);
          if (unitData.cefrLevel) {
              inner.innerHTML += " (" + unitData.cefrLevel + ")";
          }
          if (parseInt(levelCount) > 1) {
            inner.innerHTML += " " + "★".repeat(parseInt(levelIndex) + 1) + "☆".repeat(levelCount - levelIndex - 1);
          }
          if (lesson.learning_objectives.length) {
            let newhtml = "<details id=\"objectives_expand\" " + (open1 ? "open " : "") + "style=\"margin-top: 0.5em\"><summary><b>Learning objectives:</b></summary>";
            for (let objective of lesson.learning_objectives) {
              newhtml += "● " + objective + "<br>";
            }
            newhtml = newhtml.slice(0, -4);
            inner.innerHTML += newhtml;
          }
          if (lesson.grammar_info) {
            inner.innerHTML += "<details id=\"grammar_expand\" " + (open2 ? "open " : "") + "style=\"margin-top: 0.5em\"><summary><b>Grammar:</b></summary>● " + lesson.grammar_info.replaceAll("\n", "<br>● ") + "</details>";
          }
          if (lesson.lexemes_by_lesson && lesson.lexemes_by_lesson.length) {
            let newhtml = "<details id=\"lexemes_expand\" " + (open3 ? "open " : "") + "style=\"margin-top: 0.5em\"><summary><b>Vocabulary:</b></summary>";
            for (let [lessonIdx, wordList] of lesson.lexemes_by_lesson.entries()) {
              newhtml += "● <b>Lesson " + (parseInt(lessonIdx) + 1) + ":</b> ";
              let first = 1;
              for (let word of wordList) {
                if (!first) {
                  newhtml += ", ";
                }
                newhtml += word.surface_form;
                first = 0;
              }
              newhtml += "<br>";
            }
            newhtml = newhtml.slice(0, -4);
            newhtml += "</details>";
            inner.innerHTML += newhtml;
          }

          document.getElementById("objectives_expand").onclick = () => { open1 = !open1; };
          document.getElementById("grammar_expand").onclick = () => { open2 = !open2; };
          document.getElementById("lexemes_expand").onclick = () => { open3 = !open3; };
        }
      };
      const observer = new MutationObserver(callback);
      const config = { childList: true };
      observer.observe(lessonElem.parentElement.parentElement.parentElement, config);
    }
  };

  const onDocumentRootModified = () => {
    if (window.location.pathname != "/learn") {
      skillPathElem = null;
      return;
    }

    if (skillPathElem && skillPathElem.isConnected) {
      return;
    }
    skillPathElem = document.querySelector("div[data-test=\"skill-path\"]");
    if (!skillPathElem) {
      console.log("Could not find skill path element!");
      return;
    }

    const onUnitNodeRendered = (mutationList) => {
      for (const mutation of mutationList) {
        for (const node of mutation.addedNodes) {
          // TODO: Double check data-test
          setupUnitNodes(node);
        }
      }
    };
    const observer = new MutationObserver(onUnitNodeRendered);
    const config = { childList: true };
    observer.observe(skillPathElem, config);

    for (let skillPathUnitElem of skillPathElem.querySelectorAll("section[data-test^=\"skill-path-unit-\"]")) {
      setupUnitNodes(skillPathUnitElem);
    }
  };
  const observer = new MutationObserver(onDocumentRootModified);
  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);

  onDocumentRootModified();
}

function fetchNonAnonymous(url) {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
        method: "GET",
        anonymous: false,
        url: url,
        onload: async function(response) {
          let data;
          if (response.status == 200) {
            data = JSON.parse(response.response);
          } else {
            // Fall back to fetch API. Seems to be required for Greasemonkey
            data = await fetch(url);
            if (!data.ok) {
              reject(data.status);
            }
            data = await data.json();
          }

          resolve(data);
        },
        onerror: (err) => { reject(err); }
    });
  });
}

window.addEventListener('load', async () => {
  let userId = JSON.parse(localStorage.getItem("duo.state")).state.redux.user.id;
  let learningLanguage = JSON.parse(localStorage.getItem("duo.state")).state.redux.user.learningLanguage;
  let fromLanguage = JSON.parse(localStorage.getItem("duo.state")).state.redux.user.fromLanguage;

  pathData = fetch(window.location.origin + "/2017-06-30/users/" + userId + "?fields=currentCourse,joinedClassroomIds");

  let classroomData = await fetchNonAnonymous("https://schools.duolingo.com/api/1/observers/list_settings_classrooms")
      .catch((err) => { window.alert("Could not load classroom data from Duolingo for Schools!"); });

  let classroomId = null;
  for (let classroom of classroomData.classrooms) {
    if (classroom.learning_language_abbrev === learningLanguage &&
       classroom.from_language_abbrev === fromLanguage) {
      classroomId = classroom.classroom_id;
    }
  }
  if (classroomData.classrooms.length == 0) {
    window.alert("Please create and join a classroom on https://schools.duolingo.com to use this script.");
  }
  if (classroomId === null) {
    window.alert("No classroom found for language \"" + learningLanguage + "\" in \"" + fromLanguage + "\".\nPlease create and join a classroom for this combination of languages on https://schools.duolingo.com to use this script.");
  }

  pathData = await pathData;
  pathData = await pathData.json();

  schoolsData = await fetchNonAnonymous("https://schools.duolingo.com/api/2/classrooms/" + classroomId + "/course_content")
      .catch((err) => { window.alert("Could not load data from Duolingo for Schools!"); });
  onLoaded();
});
