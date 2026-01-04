// ==UserScript==
// @name         pick ur noa lesson
// @namespace    http://tampermonkey.net/
// @version      Alpha-v1
// @description  Make ur own noa dance acadamy schedule.
// @author       yachang
// @match        https://www.noadance.com/schedule_search/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493350/pick%20ur%20noa%20lesson.user.js
// @updateURL https://update.greasyfork.org/scripts/493350/pick%20ur%20noa%20lesson.meta.js
// ==/UserScript==

async function main() {
  //Nodes
  const searchbox = document.querySelector(".searchbox");
  const firstUl = searchbox.querySelector("ul");
  const genreCheckboxes = searchbox
    .querySelector(".genre")
    .querySelectorAll('input[type="checkbox"]');
  const locationCheckboxes = firstUl.querySelectorAll('input[type="checkbox"]');
  const searchBtn = searchbox.querySelector(".conf").querySelector("button");
  const targetNode = document.getElementById("js-container");

  const title = document.createElement("p");
  title.textContent = "enjoy ur dance^^";
  title.setAttribute(
    "style",
    "color: rgb(52, 206, 202);text-align: center;font-size: x-large;font-weight: 800;background: #efefef;padding-top: 20px;"
  );
  targetNode.parentNode.insertBefore(title, targetNode);

  var chosenLessons;
  try {
    //chosen lessons
    const storedString0 = await GM.getValue("chosenLessons", null);
    const storedSelectedValues0 = storedString0
      ? JSON.parse(storedString0)
      : undefined;
    chosenLessons = storedSelectedValues0 ? storedSelectedValues0 : [];
  } catch (error) {
    alert(error);
  }

  var selectedValues;
  var selectedValuesLast;
  try {
    //customized search values
    const storedString = await GM.getValue("selectedValues", null);
    const storedSelectedValues = storedString
      ? JSON.parse(storedString)
      : undefined;
    selectedValues = storedSelectedValues
      ? storedSelectedValues
      : {
          levels: [],
          fromTime: "",
          toTime: "",
          workdayOnly: false,
          locations: [],
          genres: [],
          chosenLessonOnly: false,
        };
  } catch (error) {
    alert(error);
  }

  //others
  var mutationCount = 0;
  const config = { childList: true, subtree: true };

  addStyle();
  createSelectAllNode();
  createLevelsNode();
  createTimeNode();
  createBtnsNode();

  searchBtn.addEventListener("click", () => {
    if (
      selectedValuesLast &&
      arraysAreEqual(selectedValues.locations, selectedValuesLast.locations) &&
      arraysAreEqual(selectedValues.genres, selectedValuesLast.genres)
    ) {
      handleMutation();
    }
  });

  const observer = new MutationObserver(handleMutation);
  observer.observe(targetNode, config);

  function createLevelsNode() {
    const levelHTML = `<p>LEVEL</p>
      <ul id='level'>
        <li>
          <input type="checkbox" id="超入門" value="超入門">
          <label for="超入門">超入門</label>
        </li>
        <li>
          <input type="checkbox" id="入門" value="入門">
          <label for="入門">入門</label>
        </li>
        <li>
          <input type="checkbox" id="初級" value="初級">
          <label for="初級">初級</label>
        </li>
        <li>
          <input type="checkbox" id="中級" value="中級">
          <label for="中級">中級</label>
        </li>
      </ul>`;

    //create levels selector
    firstUl.parentNode.insertAdjacentHTML("afterbegin", levelHTML);
    const levelsEl = searchbox.querySelector("#level");
    const levelcheckboxes = levelsEl.querySelectorAll('input[type="checkbox"]');
    levelcheckboxes.forEach((checkbox) => {
      //init stored levels
      if (selectedValues.levels.length > 0) {
        selectedValues.levels.forEach((selectedLevel) => {
          if (checkbox.value === selectedLevel) {
            checkbox.checked = true;
          }
        });
      }
      //remember the chosen levels
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          selectedValues.levels.push(checkbox.value);
        } else {
          const index = selectedValues.levels.indexOf(checkbox.value);
          if (index !== -1) {
            selectedValues.levels.splice(index, 1);
          }
        }
      });
    });
  }

  function createTimeNode() {
    const timeSelectHTML = `
    <div style="
    padding: 10px 0 35px 0;
">
     <p>TIME SPAN</p>
     <input type="time" id="fromTime" placeholder="From" min="00:00" max="23:59" required style="
    display: unset;
    background-color: #34ceca;
    border: none;
">
<span>~</span>
     <input type="time" id="toTime" placeholder="To" min="00:00" max="23:59" required style="
    display: unset;
    background-color: #34ceca;
    border: none;
">
<input type="checkbox" id="timeType" value="wd">
<label for="timeType">workday only</label>
    </div>`;

    //create time selector
    firstUl.parentNode.insertAdjacentHTML("afterbegin", timeSelectHTML);
    const fromTimeInput = document.querySelector("#fromTime");
    const toTimeInput = document.querySelector("#toTime");
    const workdayOnly = searchbox.querySelector("#timeType");
    //init stored time selector
    if (selectedValues.fromTime) {
      fromTimeInput.value = selectedValues.fromTime;
    }
    if (selectedValues.toTime) {
      toTimeInput.value = selectedValues.toTime;
    }
    workdayOnly.checked = selectedValues.workdayOnly;
    // remember the selected time limit
    fromTimeInput.addEventListener("change", () => {
      selectedValues.fromTime = fromTimeInput.value;
    });
    toTimeInput.addEventListener("change", () => {
      selectedValues.toTime = toTimeInput.value;
    });
    workdayOnly.addEventListener("change", () => {
      selectedValues.workdayOnly = workdayOnly.checked;
    });
  }

  function createSelectAllNode() {
    //create select all location btn
    const selectAllButton = document.createElement("button");
    selectAllButton.textContent = "Select All";
    selectAllButton.style.marginBottom = "5px";
    selectAllButton.style.backgroundColor = "#34ceca";
    selectAllButton.style.padding = "5px";
    firstUl.parentNode.insertBefore(selectAllButton, firstUl);
    const locationCheckboxes = firstUl.querySelectorAll(
      'input[type="checkbox"]'
    );
    // 点击按钮时选中所有复选框
    selectAllButton.addEventListener("click", () => {
      locationCheckboxes.forEach((checkbox) => {
        if (!checkbox.checked) {
          checkbox.click();
        }
      });
    });
  }

  function createBtnsNode() {
    const ExecuteBtns = `<div style="display: flex;justify-content: center;align-items: baseline;">
    <button id="saveBtn" style="padding: 5px;background-color: rgb(52, 206, 202);margin-right: 20px;">
      Save this?
    </button>
    <button id="deleteBtn" style="padding: 5px;background-color: rgb(52, 206, 202);margin-right: 20px;">
      Delete this?
    </button>
    <input type="checkbox" id="displayBtn" value="displayBtn" style="padding: 5px;">
    <label for="displayBtn">display chosen lessons only?</label>
  </div>`;

    //create execute btns
    document
      .querySelector(".schedule-foot")
      .insertAdjacentHTML("beforebegin", ExecuteBtns);

    const saveBtn = document.getElementById("saveBtn");
    const deleteBtn = document.getElementById("deleteBtn");
    const displayBtn = document.getElementById("displayBtn");

    displayBtn.checked = selectedValues.chosenLessonOnly;

    //save this chosen status to local
    saveBtn.addEventListener("click", async () => {
      //remember chosen locations
      locationCheckboxes.forEach((checkbox) => {
        if (
          checkbox.checked &&
          !selectedValues.locations.includes(checkbox.id)
        ) {
          selectedValues.locations.push(checkbox.id);
        } else if (
          !checkbox.checked &&
          selectedValues.locations.includes(checkbox.id)
        ) {
          const index = selectedValues.locations.indexOf(checkbox.id);
          if (index !== -1) {
            selectedValues.locations.splice(index, 1);
          }
        }
      });
      //remember chosen genres
      genreCheckboxes.forEach((checkbox) => {
        if (checkbox.checked && !selectedValues.genres.includes(checkbox.id)) {
          selectedValues.genres.push(checkbox.id);
        } else if (
          !checkbox.checked &&
          selectedValues.genres.includes(checkbox.id)
        ) {
          const index = selectedValues.genres.indexOf(checkbox.id);
          if (index !== -1) {
            selectedValues.genres.splice(index, 1);
          }
        }
      });
      //remember displayBtn value
      selectedValues.chosenLessonOnly = displayBtn.checked;

      try {
        //store selectedValues to local
        const jsonSelectedValues = JSON.stringify(selectedValues);
        await GM.setValue("selectedValues", jsonSelectedValues);

        //chosenLessons
        const jsonChosenLessons = JSON.stringify(chosenLessons);
        await GM.setValue("chosenLessons", jsonChosenLessons);
        alert("saved");
      } catch (error) {
        alert(error);
      }
    });

    deleteBtn.addEventListener("click", async () => {
      try {
        await GM.deleteValue("selectedValues");
        await GM.deleteValue("chosenLessons");
        alert("deleted");
      } catch (error) {
        alert(error);
      }
    });

    displayBtn.addEventListener("change", () => {
      if (displayBtn.checked) {
        const unChosenLessons = document.querySelectorAll(".unchosenLesson");
        unChosenLessons.forEach((unChosenLesson) => {
          unChosenLesson.classList.add("dontShowThis");
          targetNode.scrollIntoView();
        });
      } else {
        const dontShowThis = document.querySelectorAll(".dontShowThis");
        dontShowThis.forEach((a) => {
          a.classList.remove("dontShowThis");
        });
      }
    });
  }

  async function addStyle() {
    const customizedCSS = `
  .unmatchCustomizedLimits {
      display:none!important;
      visibility:hidden;
      min-height:0;
  }

  .unchosenLesson{
  }

  .dontShowThis {
      display:none!important;
      visibility:hidden;
      min-height:0;
  }
  `;

    try {
      await GM.addStyle(customizedCSS);
    } catch (error) {
      alert(error);
    }
  }

  function initOriginSearch() {
    //init locations & genres
    var locationInit = false;
    var genreInit = false;
    if (selectedValues.locations.length > 0) {
      locationCheckboxes.forEach((checkbox) => {
        if (
          selectedValues.locations.includes(checkbox.id) &&
          !checkbox.checked
        ) {
          checkbox.click();
        }
      });
      locationInit = true;
    }

    if (selectedValues.genres.length > 0) {
      genreCheckboxes.forEach((checkbox) => {
        if (!selectedValues.genres.includes(checkbox.id) && checkbox.checked) {
          checkbox.click();
        }
      });
      genreInit = true;
    }

    if (locationInit || genreInit) {
      searchBtn.click();
      console.log("initOriginSearch");
    }
  }

  function customizedSearch(classBox) {
    //hide unchosen level lessons && unmatch times lessons
    const level = classBox.querySelector(".rec_level_name").innerText;

    const timeRange = classBox.querySelector(".lessontime").innerText;
    const [startTime, endTime] = splitTimeRange(timeRange);
    const workdayOnly = searchbox.querySelector("#timeType");
    const weekday =
      classBox.parentNode.parentNode.parentNode.parentNode.querySelector(
        "h2"
      ).innerText;

    if (
      selectedValues.levels.length > 0 &&
      !selectedValues.levels.includes(level)
    ) {
      classBox.classList.add("unmatchCustomizedLimits");
    } else if (
      (!workdayOnly.checked ||
        (workdayOnly.checked && weekday !== "SAT" && weekday !== "SUN")) &&
      ((selectedValues.fromTime &&
        compareTimes(selectedValues.fromTime, startTime)) ||
        (selectedValues.toTime && compareTimes(endTime, selectedValues.toTime)))
    ) {
      classBox.classList.add("unmatchCustomizedLimits");
    } else {
      classBox.classList.remove("unmatchCustomizedLimits");
    }
  }

  function createChooseBoxes(classBox) {
    const lesson = {
      time: escapeHtml(classBox.querySelector(".lessontime").innerText),
      name: escapeHtml(classBox.querySelector(".nickname").innerText),
      genre: escapeHtml(classBox.querySelector(".genre_sub_name").innerText),
      level: escapeHtml(classBox.querySelector(".rec_level_name").innerText),
      address: escapeHtml(
        classBox.querySelector(".info").querySelector("a").querySelector("span")
          .innerText
      ),
    };
    const id = `${lesson.time}${lesson.name}${lesson.genre}${lesson.level}${lesson.address}`;
    const radiosHTML = `<div class="chooseUrBox">
    <input type="radio" class="chooseUr" name="Choose${id}" id="mainChoose${id}" value="main">
    <label for="mainChoose${id}">main</label>
    <input type="radio" class="chooseUr" name="Choose${id}" id="optChoose${id}" value="opt">
    <label for="optChoose${id}">opt</label>
        </div>`;
    const radiosHTML1 = `
    <input type="radio" class="chooseUr" name="Choose${id}" id="mainChoose${id}" value="main">
    <label for="mainChoose${id}">main</label>
    <input type="radio" class="chooseUr" name="Choose${id}" id="optChoose${id}" value="opt">
    <label for="optChoose${id}">opt</label>
       `;
    observer.disconnect();
    if (!classBox.querySelector(".chooseUrBox")) {
      classBox.insertAdjacentHTML("beforeend", radiosHTML);
    } else {
      classBox.querySelector(".chooseUrBox").innerHTML = radiosHTML1;
    }
    observer.observe(targetNode, config);
  }

  function handleMutation() {
    mutationCount++;
    console.log(mutationCount);
    console.log(selectedValues);
    console.log(chosenLessons);
    if (mutationCount === 1) {
      initOriginSearch();
    }
    selectedValuesLast = selectedValues;

    const displayBtn = document.getElementById("displayBtn");
    if (displayBtn.checked === true && mutationCount > 2) {
      //init displayBtn
      displayBtn.checked = false;
      const dontShowThis = document.querySelectorAll(".dontShowThis");
      dontShowThis.forEach((a) => {
        a.classList.remove("dontShowThis");
      });
    }

    //init lessons
    const classBoxes = document.querySelectorAll(".class-box");
    classBoxes.forEach((classBox) => {
      classBox.classList.add("unchosenLesson");
      classBox.style.backgroundColor = "#fff";
      createChooseBoxes(classBox);
      customizedSearch(classBox);

      //init and rememer ur chosen lessons
      const chooseBoxes = classBox.querySelectorAll(".chooseUr");
      chooseBoxes &&
        chooseBoxes.forEach((radio) => {
          const classBox = radio.parentNode.parentNode;

          //init chosen lessons
          if (chosenLessons.length > 0) {
            if (chosenLessons.includes(radio.id)) {
              classBox.classList.remove("unchosenLesson");
              classBox.classList.remove("unmatchCustomizedLimits");
              radio.checked = true;
              if (radio.value === "main") {
                classBox.style.backgroundColor = "rgba(52, 206, 180, 0.6)";
              } else if (radio.value === "opt") {
                classBox.style.backgroundColor = "rgba(52, 206, 180, 0.2)";
              }
              console.log("init chosen success");
            }
          }

          //only work when click the circle
          radio.addEventListener("mousedown", function (event) {
            const lessonid = radio.id;
            // unchecked
            if (this.checked) {
              const handleMouseUp = () => {
                setTimeout(() => {
                  radio.checked = false;
                  classBox.style.backgroundColor = "#fff";
                  classBox.classList.add("unchosenLesson");
                  //delete from chosen lessons
                  const index = chosenLessons.indexOf(lessonid);
                  if (index !== -1) {
                    chosenLessons.splice(index, 1);
                  }
                }, 5);
                radio.removeEventListener("mouseup", handleMouseUp);
              };
              radio.addEventListener("mouseup", handleMouseUp);
            }
          });

          radio.addEventListener("change", function (event) {
            const lessonid = radio.id;
            if (this.checked) {
              //checked
              if (radio.value === "main") {
                classBox.style.backgroundColor = "rgba(52, 206, 180, 0.6)";
              } else {
                classBox.style.backgroundColor = "rgba(52, 206, 180, 0.2)";
              }
              classBox.classList.remove("unchosenLesson");
              //add to chosen lessons
              if (!chosenLessons.includes(lessonid)) {
                chosenLessons.push(lessonid);
                if (radio.value === "main") {
                  const index = chosenLessons.indexOf("opt" + radio.name);
                  if (index !== -1) {
                    chosenLessons.splice(index, 1);
                  }
                } else {
                  const index = chosenLessons.indexOf("main" + radio.name);
                  if (index !== -1) {
                    chosenLessons.splice(index, 1);
                  }
                }
              }
            }
            console.log(chosenLessons);
          });
        });
    });
  }

  function splitTimeRange(timeRange) {
    // 使用正则表达式匹配时间范围中的开始时间和结束时间
    var regex = /(\d{2}:\d{2})～(\d{2}:\d{2})/;
    var matches = timeRange.match(regex);

    // 如果匹配成功
    if (matches && matches.length === 3) {
      var startTime = matches[1]; // 开始时间
      var endTime = matches[2]; // 结束时间
      return [startTime, endTime];
    } else {
      // 如果匹配失败，返回空数组或者null，表示无效的时间范围字符串
      return null;
    }
  }
  function compareTimes(time1, time2) {
    //if time1 late than time2 return true
    // 分割时间字符串以获取小时和分钟
    var time1Parts = time1.split(":");
    var time2Parts = time2.split(":");

    // 将小时和分钟转换为整数
    var hour1 = parseInt(time1Parts[0], 10);
    var minute1 = parseInt(time1Parts[1], 10);
    var hour2 = parseInt(time2Parts[0], 10);
    var minute2 = parseInt(time2Parts[1], 10);

    // 比较小时
    if (hour1 < hour2) {
      return false;
    } else if (hour1 > hour2) {
      return true;
    } else {
      // 如果小时相同，则比较分钟
      if (minute1 < minute2) {
        return false;
      } else if (minute1 > minute2) {
        return true;
      } else {
        // 如果分钟也相同，则时间相同
        return true;
      }
    }
  }
  function arraysAreEqual(arr1, arr2) {
    // 如果数组长度不同，直接返回 false
    if (arr1.length !== arr2.length) {
      return false;
    }

    // 对数组进行排序
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    // 比较排序后的数组是否相等
    for (let i = 0; i < sortedArr1.length; i++) {
      // 如果元素不相等，返回 false
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }

    // 如果所有元素都相等，则返回 true
    return true;
  }
  function escapeHtml(str) {
    return str.replace(/[&<>"'\/]/g, function (match) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
      }[match];
    });
  }
}

main();
