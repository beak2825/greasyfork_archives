// ==UserScript==
// @name         wjx report editor
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Edit your wjx.cn reports
// @license      MIT
// @author       tddschn
// @match        https://www.wjx.cn/report/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wjx.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444897/wjx%20report%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/444897/wjx%20report%20editor.meta.js
// ==/UserScript==

function addCountColumn() {
  // alert("lol");
  let questions = document.querySelectorAll(".title-item");
  // check if localstorage key exists
  var questionObjects = getQuestionObjects(questions);

  // iterate over questions
  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    let title = getQuestionTitle(question);
    let questionObject = questionObjects[title];
    let choices = question.querySelectorAll("tr");
    if (choices.length > 0) {
      headerRowAddColumn(choices);
      // let newTdPercentage = document.createElement("td");
      // newTdPercentage.innerHTML = "Pct";
      // header.appendChild(newTdPercentage);

      let totalRow = choices[choices.length - 1];
      let totalCount = totalRow.querySelectorAll("td > b")[1];
      // iterate over choices from 1
      for (let j = 1; j < choices.length - 1; j++) {
        let { choice, newCountInput } = bodyAddColAndInput(choices, j);
        let [description, count] = choice.querySelectorAll("td");
        let descText = description.innerHTML;
        newCountInput.value =
          questionObject[descText] === "0" ? "" : questionObject[descText];

        // add oninput event listener to newCountInput
        newCountInput.addEventListener(
          "input",
          onNewCount(
            newCountInput,
            count,
            questionObject,
            descText,
            choices,
            totalCount
          )
        );
        // dispatch input event on newCountInput
        newCountInput.dispatchEvent(new Event("input"));
      }
    } else {
      // remove the question
      question.remove();
    }
  }

  function onNewCount(
    newCountInput,
    count,
    questionObject,
    descText,
    choices,
    totalCount
  ) {
    return function () {
      let newCount = newCountInput.value || "0";
      count.innerHTML = newCount;
      questionObject[descText] = newCount;
      window.localStorage.setItem("questions", JSON.stringify(questionObjects));
      // calculate the sum of this column
      let sum = updateSum(choices, totalCount);
      for (let j = 1; j < choices.length - 1; j = j + 1) {
        updatePercentages(choices, j, sum);
      }
    };
  }
}

function getQuestionObjects(questions) {
  if (window.localStorage.getItem("questions")) {
    // if it does, get the value
    var questionObjects = JSON.parse(window.localStorage.getItem("questions"));
    // and add the new column
  } else {
    // if it doesn't, create an empty array
    createQuestionObjects(questions);
    var questionObjects = JSON.parse(window.localStorage.getItem("questions"));
  }
  return questionObjects;
}

function updateSum(choices, totalCount) {
  let sum = 0;
  for (let j = 1; j < choices.length - 1; j++) {
    let choice = choices[j];
    let tds = choice.querySelectorAll("td");
    let count = tds[1];
    sum += parseInt(count.innerHTML);
  }
  totalCount.innerHTML = String(sum);
  return sum;
}

function updatePercentages(choices, j, sum) {
  let [, count, proportion] = choices[j].querySelectorAll("td");
  let newPercentage = (parseInt(count.innerHTML) / sum) * 100 || 0;
  // save 2 digits after decimal
  // @ts-ignore
  newPercentage = newPercentage.toFixed(2);

  // @ts-ignore
  proportion.setAttribute("percent", newPercentage);
  // let divs = proportion.querySelectorAll("div");
  // let divs be the direct div children of proportion
  let divs = proportion.children;
  let [bar, label, _] = divs;
  try {
    let barDiv = bar.children[0];
    // @ts-ignore
    barDiv.style.width = `${newPercentage}%`;
    label.innerHTML = ` ${newPercentage}% `;
  } catch (err) {
    // console.log(divs);
    void 0;
  }
}

function bodyAddColAndInput(choices, j) {
  let choice = choices[j];
  // if selector '.tddschn' matches anything
  if (choice.querySelector(".tddschn") !== null) {
    return { choice, newCountInput: choice.querySelector(".tddschn") };
  } else {
    let choiceTdCount = document.createElement("td");
    // let choiceTdPercentage = document.createElement("td");
    choice.appendChild(choiceTdCount);
    // choice.appendChild(choiceTdPercentage);
    // add a input field in choiceTdCount and save the value in a variable called newCount
    let newCountInput = document.createElement("input");
    newCountInput.type = "number";
    // add class "tddschn"
    newCountInput.classList.add("tddschn");
    // set width to 50px
    newCountInput.style.width = "40px";
    choiceTdCount.appendChild(newCountInput);
    return { choice, newCountInput };
  }
}

function headerRowAddColumn(choices) {
  let header = choices[0];
  // add a new td in header
  if (header.querySelector(".tddschn") !== null) {
    return;
  }
  let newTdCount = document.createElement("td");
  newTdCount.innerHTML = "Cnt";
  newTdCount.style.width = "60px";
  newTdCount.classList.add("tddschn");
  header.appendChild(newTdCount);
}

function getQuestionTitle(question) {
  let dd = question.querySelector("dd");
  // get text from dd, discarding non-text nodes
  let text = Array.from(dd.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE
  );
  // return the content of the first text node
  return text[0].textContent;
}

function createQuestionObjects(questions) {
  // create an object store for each question with titles as keys
  let objectStores = {};
  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    let title = getQuestionTitle(question);
    objectStores[title] = {};
  }
  // return objectStores;
  window.localStorage.setItem("questions", JSON.stringify(objectStores));
}

// add add import and export buttons on the page to import and export the questions in localstorage
function addButtons() {
  // add clearButton
  let clearButton = document.createElement("button");
  clearButton.innerHTML = "Clear";
  clearButton.addEventListener("click", clearQuestions);

  // add an choose file input that says "Import data"
  let importButton = document.createElement("input");
  importButton.type = "file";
  importButton.accept = "application/json";
  importButton.id = "importButton";
  // importButton.value = "Import data";
  importButton.style.margin = "10px";

  // do things when the file is selected
  importButton.addEventListener("change", function (event) {
    // get the file
    let file = event.target.files[0];
    // create a reader
    let reader = new FileReader();
    reader.readAsText(file);
    // when the reader is loaded, do things
    reader.addEventListener("load", function (event) {
      // get the file contents
      let contents = reader.result;
      // save to localstorage
      window.localStorage.setItem("questions", contents);
      addCountColumn();
    });
  });

  let exportButton = document.createElement("button");
  exportButton.innerHTML = "Export";
  exportButton.addEventListener("click", exportQuestions);

  let buttons = document.createElement("div");
  buttons.appendChild(clearButton);
  buttons.appendChild(importButton);
  buttons.appendChild(exportButton);
  buttons.style.cssText = "position: fixed; bottom: 0; right: 0;";
  document.body.appendChild(buttons);
}

function exportQuestions() {
  const questions = window.localStorage.getItem("questions");
  // download the question string with the file name "hmd-wjx-answers-data.json"
  let file = new File([questions], "hmd-wjx-answers-data.json", {
    type: "application/json",
  });
  let link = document.createElement("a");
  link.download = "hmd-wjx-answers-data.json";
  link.href = URL.createObjectURL(file);
  link.click();
}

function clearQuestions() {
  window.localStorage.clear();
  // location.reload();
  readQuestions();
}

function readQuestions() {
  document.querySelectorAll("input.tddschn").forEach((countInput) => {
    // @ts-ignore
    countInput.value = "";
    // dispatch input event on input
    countInput.dispatchEvent(new Event("input"));
  });
}

window.addEventListener("load", addCountColumn);
window.addEventListener("load", addButtons);
