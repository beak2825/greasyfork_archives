// ==UserScript==
// @name        iClicker Ball Buster 9999 DX
// @namespace   Violentmonkey Scripts
// @match       https://student.iclicker.com/
// @grant       none
// @version     2.420.69
// @author      Not Sabbulanefull and Loose Noodles
// @description 10/4/2023, 12:32:49 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/507225/iClicker%20Ball%20Buster%209999%20DX.user.js
// @updateURL https://update.greasyfork.org/scripts/507225/iClicker%20Ball%20Buster%209999%20DX.meta.js
// ==/UserScript==

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

async function getAuthorization(email, password) {
  const res = await fetch("https://api.iclicker.com/authproxy/login", {
    "method": "POST",
    "body": JSON.stringify({
      "email": email,
      "password": password,
    }),
    "headers": {
      "content-type": "application/vnd.reef.login-proxy-request-v1+json",
    },
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json["access_token"];
}

async function getCurrentActivityId(auth, courseId) {
  const res = await fetch(`https://activity-service.iclicker.com/v2/courses/${courseId}/class-sections?recordsPerPage=1&pageNumber=1&expandChild=activities`, {
    "headers": {
      "authorization": `Bearer ${auth}`,
      "content-type": "application/json",
    },
    "method": "GET",
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json[0]["activities"][0]["_id"];
}

async function getCurrentQuestion(auth, courseId, activityId) {
  const res = await fetch(`https://activity-service.iclicker.com/reporting/courses/${courseId}/activities/${activityId}/questions/view`, {
    "headers": {
      "authorization": `Bearer ${auth}`,
      "content-type": "application/json",
    },
    "method": "GET",
  });

  if (!res.ok) return null;

  const json = await res.json();
  const question = json["data"]["questions"].find(q => q.name === getCurrentQuestionName());

  if (!question) return null;

  return question;
}

async function getQuestionAndUserId(auth, courseId) {
  const res = await fetch(`https://activity-service.iclicker.com/v2/courses/${courseId}/class-sections?expandChild=activities&expandChild=questions&active=1`, {
    "headers": {
      "authorization": `Bearer ${auth}`,
      "content-type": "application/json",
    },
    "method": "GET",
  });

  if (!res.ok) return null;

  const json = await res.json();
  const userId = json[0]["userId"];
  const questionId = json[0]["activities"][0]["questions"][0]["_id"];

  return {
    userId,
    questionId,
  };
}

function clickSendBtn() {
  const buttons = document.querySelectorAll("button");
  const sendButton = Array.from(buttons).find((button) => button.textContent.trim() === "Send Answer");
  sendButton.click();
}

function showAnswers(questionType, responses, cheatPanel) {
  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];
    const responseListElement = document.createElement("li");
    let answer;
    if (questionType === "MULTIPLE_ANSWER") {
      answer = response.answers.toString();
    } else {
      answer = response.answer;
    }
    responseListElement.textContent = `${answer} - ${response.percentageOfTotalResponses}%`;
    cheatPanel.appendChild(responseListElement);
  }
}

async function newQuestionHandler(auth, courseId, activityId) {
  async function revealHiddenImg() {
    const question = await getCurrentQuestion(auth, courseId, activityId);

    if (!question) return;
    if (question["responseCount"] === 0) return;

    let imageURL = question["ImageURL"];
    let hiddenElem = document.querySelector(".hidden-by-instructor");
    let hiddenElemImg = hiddenElem.src;
    let toggle = false;

    if (hiddenElem !== null) {
      hiddenElem.addEventListener("click", () => {
        toggle = !toggle;
        if (toggle) hiddenElem.src = imageURL;
        else hiddenElem.src = hiddenElemImg;
      });
    }
  }

  async function updateCheatPanel() {
    const question = await getCurrentQuestion(auth, courseId, activityId);

    if (!question) return;
    if (question["responseCount"] === 0) return;  // This means nobody else has answered the question yet

    const wrapperElement = document.querySelector("#wrapper");

    // Create cheat panel if it has not been created already
    let cheatPanel = document.querySelector("#cheatPanel");
    if(!cheatPanel) {
      cheatPanel = document.createElement("ol");
      cheatPanel.setAttribute("id", "cheatPanel");
      wrapperElement.appendChild(cheatPanel);
    }

    // Clear the cheat panel
    cheatPanel.innerHTML = "";

    let mostPopular;
    let responses;

    if (question["answerType"] === "TARGET_ANSWER") {
      mostPopular = question["user_submitted_coordinates"][0]
    } else {
      responses = question["answerBuckets"]["allAnswers"];

      // Sort the class responses by response count (descending)
      responses.sort((rA, rB) => rB.count - rA.count);
      mostPopular = responses[0];
    }

    switch(question["answerType"]) {
      case "SINGLE_ANSWER": {
        showAnswers(question["answerType"], responses, cheatPanel);
        document.getElementById(`multiple-choice-${mostPopular.answer.toLowerCase()}`).click();
        break;
      }
      case "SHORT_ANSWER": {
        showAnswers(question["answerType"], responses, cheatPanel);

        const textarea = document.getElementById("shortAnswerInput");
        textarea.value = mostPopular.answer;

        const event = new Event("input");
        textarea.dispatchEvent(event);

        clickSendBtn();
        break;
      }
      case "NUMERIC_ANSWER": {
        showAnswers(question["answerType"], responses, cheatPanel);

        const textarea = document.getElementById("numericAnswerInput");
        textarea.value = mostPopular.answer;

        const event = new Event("input");
        textarea.dispatchEvent(event);

        clickSendBtn();
        break;
      }
      case "STEM_ANSWER": {
        showAnswers(question["answerType"], responses, cheatPanel);

        const textarea = document.getElementById("user-answer-math-field");
        textarea.value = mostPopular.answer;

        const event = new Event("input", { bubbles: true });
        textarea.dispatchEvent(event);

        clickSendBtn();
        break;
      }
      case "MULTIPLE_ANSWER": {
        showAnswers(question["answerType"], responses, cheatPanel);

        for (const answer of mostPopular.answers) {
          document.getElementById(`multiple-answer-${answer.toLowerCase()}`).click();
        }

        clickSendBtn();
        break;
      }
      case "TARGET_ANSWER": {
        const canvas = document.querySelector(".upper-canvas");
        const canvasWidth = canvas.getBoundingClientRect().width;
        const canvasHeight = canvas.getBoundingClientRect().height;
        const canvasX = canvas.getBoundingClientRect().x;
        const canvasY = canvas.getBoundingClientRect().y;
        const ctx = canvas.getContext("2d");
        const aspectRatio = canvasWidth/canvasHeight;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);  // Clear previous drawings

        const [x, y] = [mostPopular.x, mostPopular.y];

        ctx.beginPath();
        ctx.arc(x * canvasWidth, y * canvasHeight * aspectRatio, 5, 0, 2 * Math.PI);

        // Border
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        // Fill
        ctx.fillStyle = '#FF10F0';
        ctx.fill();

        // Click the mostPopular answer
        canvas.dispatchEvent(new MouseEvent("mousedown", {
          clientX: canvasX + x * canvasWidth,
          clientY: canvasY + y * canvasHeight * aspectRatio,
        }));

        clickSendBtn();
        break;
      }
      default: {
        console.error("FUCK ICLICKER");
        break;
      }
    }
  }

  // Initial update
  await updateCheatPanel();

  await revealHiddenImg();

  // You can change the delay until new update here (in milliseconds), the default is 5 seconds.
  // I would advise against going below 2 seconds, because you will spam iClicker's servers and they might notice that.
  return setInterval(async () => { await updateCheatPanel() }, 5000);
}

function getCourseId() {
  const courseIdRegex = /https:\/\/student\.iclicker\.com\/.*\/course\/(.*?)(\/|$)/;
  if (courseIdRegex.test(window.location.href))
    return courseIdRegex.exec(window.location.href)[1];
  else
    return null;
}


function getCurrentQuestionName() {
  return document.querySelector("h1").textContent.trim();
}

function autoJoinClass() {
  if (getCourseId()) {
    const joinBtn = waitForElm("#btnJoin").then(elm => {
      const observer = new MutationObserver(_ => {
        if (elm.disabled === false) {
          observer.disconnect();
          elm.click();
        }
      });

      observer.observe(document.querySelector("#btnJoin"), { attributes: true });
    })
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  // Enter your credentials here for the best experience
  // Don't worry, I won't steal them, probably ;)
  let email = "YOUR EMAIL HERE";
  let password = "YOUR PASSWORD HERE";
  let auth = sessionStorage.getItem("access_token") ?? await getAuthorization(email, password);

  while(!auth) {
    email = prompt("Please enter your email");
    password = prompt("Please enter your password");
    auth = await getAuthorization(email, password);
  }

  // Auto login using user credentials
  if (window.location.href === "https://student.iclicker.com/#/login") {
    const event = new Event("input");
    document.querySelector("#input-email").value = email;
    document.querySelector("#input-email").dispatchEvent(event);
    document.querySelector("#input-password").value = password;
    document.querySelector("#input-password").dispatchEvent(event);
    document.querySelector("#sign-in-button").click();
    console.log("Auto Login")
  }

  let courseId = getCourseId();
  let previousTitle = null;
  let updateCheatPanelInterval = null;

  autoJoinClass();
  window.navigation.addEventListener("navigate", async () => {
    // Wait for window.location.href to update
    await delay(1000);

    // On every new page load, hook the autoJoinClass handler
    // Also, change the courseId on every new page load
    courseId = getCourseId() ?? courseId;
    autoJoinClass();

    if (updateCheatPanelInterval) {
      clearInterval(updateCheatPanelInterval);
      updateCheatPanelInterval = null;
    }

    if (window.location.href.endsWith("poll")) {
      const activityId = await getCurrentActivityId(auth, courseId);
      updateCheatPanelInterval = await newQuestionHandler(auth, courseId, activityId);
    }
  })
})();