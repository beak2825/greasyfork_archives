// ==UserScript==
// @name    Survey Test Helper
// @author  Elliot Kwan
// @version 2.35.9
// @grant   none
// @locale  en
// @description A tool to help with survey testing
// @include /^https?:\/\/.+\.(com|net)\/index\.php(\/survey\/.*|\?r=.+)/
// @include /^https?:\/\/.+\.(com|net)\/index\.php(\/[0-9]{6}.*|\?r=.+)/
// @include /^.*localhost.*\/index\.php(\/[0-9]{6}.*|\?r=.+)/
// @include /^.*localhost.*\/index\.php(\/survey\/.*|\?r=.+)/
// @include /^.*admin/expressions/sa/survey_logic_file/sid/[0-9]{6}(/lang/.+)*$/
// @namespace https://greasyfork.org/users/560069
// @downloadURL https://update.greasyfork.org/scripts/403172/Survey%20Test%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/403172/Survey%20Test%20Helper.meta.js
// ==/UserScript==

// Question type-specific classes; in element div.question-container
const QUESTION_CLASSES = {
  "list-radio": 1,
  "numeric": 2,
  "text-short": 3,
  "array-flexible-row": 4,
  "multiple-opt": 5,
  "list-dropdown": 6,
  "numeric-multi": 7,
  "text-long": 8,
  "multiple-short-txt": 9,
  "text-huge": 10,
  "boilerplate": 11,
};
const QUESTION_TYPE = {
  radio: 1,
  numericInput: 2,
  shortFreeText: 3,
  array: 4,
  multipleChoice: 5,
  dropdown: 6,
  multipleNumericInput: 7,
  longFreeText: 8,
  multipleShortFreeText: 9,
  textHuge: 10,
  textDisplay: 11,
};
const BUTTON_CODES = {
  right: 39,
  left: 37,
  up: 38,
  down: 40,
  spacebar: 32,
  enter: 13,
  esc: 27,
  insert: 45,
};
const Q_NUM_CONTEXT = {
  age: 1,
  year: 2,
  zipCode: 3,
  quantity: 4,
  percent: 5,
  yearRef: 6,
  yearAL: 7,
  scale: 8,
};
const Q_MC_CONTEXT = {
  two: 2,
  three: 3,
  four: 4,
  five: 5,
}
const STH_COMMANDS = [
  "avoid",
  "force",
];
const STH_ALERTCODE = {
  invalidAnswer: 1,
  hiddenOptionForced: 2,
  unexpectedNonMandatory: 3,
  duplicateAnswer: 4,
  duplicateText: 5,
  noOptionsAvailable: 6,
  missingScaleOption: 7,
  scaleTextMismatch: 8,
  numberOnlyTextValueMismatch: 9,
  questionTextKeywordNotFound: 10,
  answerTextConsistencyFail: 11,
  recontactQuestion: 12,
  maxLengthDetected: 13,
};
// Patterns that should be in both Q and A, if in Q
const QUESTION_TEXT_KEYWORDS = [
  "favor",
  "unfavor",
  "support",
  "oppose",
  "more likely",
  "less likely",
  "very likely",
  "unlikely",
  "strongly",
  "somewhat",
  "definitely",
  "probably",
  "concern",
  "agree",
  "disagree",
];
const ANSWER_TEXT_KEYWORDS = [  // Patterns in all A's if in one
  "favor",
  "likely",
];
const MAGNITUDE_KEYWORDS = [
  "more",
  "less",
];
const DK_REF_TEXT = [
  "don't know",
  "refused",
  "prefer not to",
];
const RECONTACT_KEYWORDS = [
  "your name",
  "your first name",
  "your first and last name",
  "phone number",
  "best phone number",
  "your email",
  "your e-mail",
  "email address",
  "e-mail address",
  "follow-up call",
  "follow-up email",
  "follow-up study",
  "follow-up research study",
  "follow-up interview",
  "contact you",
  "be re-contacted",
  "be recontacted",
  "be recontacting",
  "be re-contacting",
  "focus group",
  "contacted to participate",
  "invited to participate",
  "interested in receiving",
  "interested in participating",
  "your contact information",
  "being contacted",
  "be contacted",
  "may we share your",
  "can we share your",
  "gift",
  "incentive",
  "provide you with information",
];
const DEFAULT_ZIP = 90210;
const ERROR_BORDER_STYLE = "red dashed 3px";
const ACTIVE_NAME = "STH_active";
const ATTEMPTS_NAME = "STH_attempts";
const COMMAND_OBJ_NAME = "STH_commands";
const STH_HIDDEN = "STH_hidden";

class Alert {
  constructor(code = 0, message = "Unknown alert. Keep an eye out.") {
    this.code = code;
    this.message = message;
  }
}

const infoDisplayOpacity = 0.75;
let curDate = new Date();
let validAgeYear = curDate.getFullYear() - 18;

let SurveyTestHelper = {
  active: false,
  attempts: 0,
  hidden: false,
  questionCode: null,
  questionType: null,
  commands: null,
  commandsFound: false,
  infoElements: [],
  alertBorderElements: [],
  errorDeactivateOverride: false,
  errorAlertShown: false,
  alerts:[],
  initialize: function () {
    let questionTexts = [...document.querySelectorAll('tr.LEMquestion, tr.LEMsubq')];
    if (questionTexts.length > 0) {
      console.log("Initializing Duplicate Question Text Detector...");
      this.createDupeDetector(questionTexts);
    } else {
      console.log("Initializing Survey Test Helper...");

      this.addErrorAlertListener();
      this.commands = this.queryCommands();

      this.initStorage();

      this.initUI();

      // Iterate through all question containers
      let qContainers = document.querySelectorAll("div.question-container");
      if (qContainers.length) {
        qContainers.forEach(qContainer => {
          this.questionContainer = qContainer;  // Reference to current questions container for other functions to access
          this.questionType = this.getQuestionType(qContainer);
          this.questionCode = qContainer.querySelector("span#QNameNumData");
          this.questionCode = this.questionCode ? this.questionCode.dataset.code : "Main Survey Page";

          // Highlight potential errors
          this.checkMandatory();
          this.checkDuplicateText();
          this.checkScaleOptions();
          this.checkQuestionAnswerTextMatch();
          this.checkAnswerTextConsistency();
          this.checkNumberOnlyValue();
          this.checkRecontact();
          this.checkSFTMaxLengthValidity();

          this.initQuestionInfoDisplay();
        }, this);
      } else {
        this.questionCode = "Main Survey Page";
        this.initQuestionInfoDisplay();
      }

      // Attach handlers
      this.button.onclick = this.buttonActionHandler.bind(this);
      document.onkeydown = this.buttonActionHandler.bind(this);

      document.body.appendChild(this.uiContainer);

      if(document.querySelector("button#movenextbtn") && !this.hidden){
        document.querySelector("button#movenextbtn").disabled = false;
      }

      if (this.active) {
        this.enterDummyResponses();
        this.clickNextButton();
      }
    }
  },
  initUI: function () {
    this.uiContainer = document.createElement("div");
    this.alertDisplay = document.createElement("div");
    this.activeCheckbox = document.createElement("input");
    this.button = document.createElement("button");

    let chkBoxLabel = document.createElement("label");

    // Auto Run Toggle Label
    chkBoxLabel.innerHTML = "Auto Run Toggle:";
    chkBoxLabel.style["background-color"] = "rgba(255,255,255,0.7)";
    chkBoxLabel.style["border-radius"] = "5px";
    chkBoxLabel.style.padding = "0px 3px";
    chkBoxLabel.style.margin = "5px 0px";
    chkBoxLabel.style.cursor = "pointer";
    chkBoxLabel.style.display = "block";
    chkBoxLabel.appendChild(this.activeCheckbox);

    // Message Display
    this.alertDisplay.style["font-weight"] = "bold";
    this.alertDisplay.style["background-color"] = "rgba(255,255,255,0.75)";
    this.alertDisplay.style["transition-duration"] = "0.75s";
    this.alertDisplay.style.color = "#000000";
    this.alertDisplay.ontransitionend = function () {
      this.style.color = "#000000";
    };

    // Auto Run Toggle Checkbox
    this.activeCheckbox.type = "checkbox";
    this.activeCheckbox.style["margin-left"] = "10px";
    this.activeCheckbox.checked = this.active;
    this.activeCheckbox.onclick = this.toggleActive.bind(this);

    // Input and Continue Button
    this.button.style.display = "block";
    this.button.style.width = "100%";
    this.button.innerHTML = "Input and Continue";

    // Rounded background rectangle
    this.uiContainer.style.position = "fixed";
    this.uiContainer.style.padding = "7px";
    this.uiContainer.style.right = "0px";
    this.uiContainer.style.top = "75px";
    this.uiContainer.style["margin-right"] = this.hidden ? "-100%" : marginRightOffset.toString() + "px";
    this.uiContainer.style["transition-duration"] = "0.5s";
    this.uiContainer.style["z-index"] = 2001;
    this.uiContainer.style["background-color"] = "rgba(0,0,0,0.1)";
    this.uiContainer.style["border-radius"] = "10px";
    this.uiContainer.style["text-align"] = "center";

    this.uiContainer.append(chkBoxLabel, this.button, this.alertDisplay);
  },
  initQuestionInfoDisplay: function () {
    let qCodeDisplay = document.createElement("div");
    let mainSurveyPageLink = document.createElement("a");

    // The big orange button is a link to a relevant page in a new tab
    mainSurveyPageLink.target = "_blank";
    mainSurveyPageLink.appendChild(qCodeDisplay);

    switch (this.questionType) {
      case QUESTION_TYPE.radio:
        this.generateRadioInfoDisplay();
        break;
      case QUESTION_TYPE.array:
        this.generateArrayInfoDisplay();
        break;
      case QUESTION_TYPE.multipleChoice:
        this.generateMChoiceInfoDisplay();
        break;
      default:
        console.log("Question type for info display not found.");
    }

    // Big orange circle with question code
    qCodeDisplay.dataset.opacity = 0.95;

    qCodeDisplay.innerHTML = this.questionCode;
    qCodeDisplay.style.height = "40px";
    qCodeDisplay.style.display = "inline-block";
    qCodeDisplay.style.position = "absolute";
    qCodeDisplay.style.top = "-20px";
    qCodeDisplay.style.opacity = this.hidden ? 0 : qCodeDisplay.dataset.opacity;
    qCodeDisplay.style.padding = "10px";
    qCodeDisplay.style["border-radius"] = "20px";
    qCodeDisplay.style["font-weight"] = "bold";

    this.infoElements.push(qCodeDisplay);

    // Set generic style settings for each infoDisplay element
    this.infoElements.forEach(e => {
      e.style.color = "white";
      e.style["background-color"] = "orangered";
      e.style["font-weight"] = "bold";
      e.style["transition-duration"] = "0.5s";
    });

    // Position and further style big button if needed

    if (this.questionContainer) {
      // In question, attach the question code display to the top of the question container
      // Link the big orange button to the question edit page
      // sgqCode is of the format {SurveyID}X{GroupID}X{QuestionID + subquestioncode}
      let sgqCode = this.questionContainer ?
        this.questionContainer.querySelector('input,textarea')
        	.name.replace("MULTI","").replace("java","").split("X") :
        undefined;
    	let qID = this.questionContainer.id.replace("question","");
      mainSurveyPageLink.href = window.location.origin +
        "/index.php" + (window.location.search.startsWith("?r=") ? "?r=" : "/") +
        "admin/questions/sa/view/surveyid/" + sgqCode[0] +
        "/gid/" + sgqCode[1] +
        "/qid/" + qID;
      this.questionContainer.appendChild(mainSurveyPageLink);
    } else {
      // Not in question, attach the question code display to the top of the UI container
      // Link the big orange button to the main survey page
      mainSurveyPageLink.href = window.location.origin +
        "/index.php" + (window.location.search.startsWith("?r=") ? "?r=" : "/") +
        "admin/survey/sa/view/surveyid/" + window.location.pathname.match(/[0-9]{6}/)[0];
      this.uiContainer.prepend(mainSurveyPageLink);
      qCodeDisplay.style.position = "relative";
      qCodeDisplay.style.top = "0px";

      qCodeDisplay.style.color = "floralwhite";
      qCodeDisplay.style["background-color"] = "orange";
    }
  },
  initStorage: function () {
    let activity = localStorage.getItem(ACTIVE_NAME);
    let hiddenVal = localStorage.getItem(STH_HIDDEN);

    let prevQuestion = sessionStorage.getItem("STH_qcode") || "Start";
    let attempts = sessionStorage.getItem(ATTEMPTS_NAME);
    let cmdObjStr = sessionStorage.getItem(COMMAND_OBJ_NAME);

    sessionStorage.setItem("STH_qcode", this.questionCode);
    sessionStorage.setItem("STH_prev_qcode", prevQuestion);

    if (activity) {
      this.active = (activity === "1");
    } else {
      localStorage.setItem(ACTIVE_NAME, "0");
    }

    if (hiddenVal) {
      this.hidden = (hiddenVal === "1");
    } else {
      localStorage.setItem(STH_HIDDEN, "0");
    }

    if (prevQuestion === this.questionCode) {
      this.attempts = Number(attempts);
    } else {
      sessionStorage.removeItem(ATTEMPTS_NAME);
    }

    if (cmdObjStr) {
      if (this.commandsFound) {
        let cmdObj = JSON.parse(cmdObjStr);

        // If the current set of commands is missing something
        // from the stored commands, add them in
        for (const cmd in cmdObj) {
          for (const qCode in cmdObj[cmd]) {
            if (!this.commands[cmd]) {
              this.commands[cmd] = {};
            }
            if (!this.commands[cmd][qCode]) {
              this.commands[cmd][qCode] = cmdObj[cmd][qCode];
            }
          }
        }
        sessionStorage.setItem(COMMAND_OBJ_NAME, JSON.stringify(this.commands));
      } else {
        this.commands = JSON.parse(cmdObjStr);
      }
    } else {
      sessionStorage.setItem(COMMAND_OBJ_NAME, JSON.stringify(this.commands));
    }
  },
  addAlert: function (alert) {
    this.alerts.push(alert);

    this.displayAlerts();
  },
  addAlertBorderElements: function () {
    for (let i = 0; i < arguments.length; i++) {
      if (!this.alertBorderElements.includes(arguments[i])) {
        arguments[i].style.border = ERROR_BORDER_STYLE;
        this.alertBorderElements.push(arguments[i]);
      }
    }
  },
  addCautionElements: function () {
    let curElement, ogBgColour;

    for (let i = 0; i < arguments.length; i++) {
      if (!this.alertBorderElements.includes(arguments[i])) {
        curElement = arguments[i];

        curElement.style.transitionDuration = '0.5s';
        ogBgColour = curElement.style.backgroundColor;
        curElement.ontransitionend = () => {
          curElement.style.backgroundColor = ogBgColour;
          curElement.style.transitionDuration = 0;
        };
        window.setTimeout(() => {
          curElement.style.backgroundColor = "#FF0000";
        }, 100);
      }
    }

    this.addAlertBorderElements(...arguments);
  },
  displayAlerts: function () {
    window.setTimeout (function () {
      if (this.alerts.length > 0) {
        let codeShown = [];
        let alertString = [];
        this.alerts.forEach(a => {
          if (!codeShown.includes(a.code)) {
            codeShown.push(a.code);
            alertString.push(a.message);
          }

          this.alertDisplay.innerHTML = alertString.join("<br />");
        });

        this.alertDisplay.style.padding = "5px";
        this.alertDisplay.style["margin-top"] = "5px";
        this.alertDisplay.style.border = "1px solid black";
        this.alertDisplay.style.color = "#FF0000";
      }
    }.bind(this), 25);
  },
  clickNextButton: function () {
    let nextBtn = document.querySelector("#movenextbtn") || document.querySelector("#movesubmitbtn");

    if (!this.checkSFTMaxLengthValidity()) {
      return;
    }

    if (nextBtn) {
      nextBtn.click();
    } else {
      if (this.active) {
        this.clickPrevButton();
      }
    }
  },
  clickPrevButton: function () {
    let prevBtn = document.querySelector("#moveprevbtn");
    if (prevBtn) {
      prevBtn.click();
    }
  },
  setActive: function (val) {
    this.active = val;
    this.activeCheckbox.checked = val;
    console.log("Activity changed: ", val);

    this.setStorageActivity(val);
  },
  toggleActive: function () {
    this.setActive(!this.active);
  },
  setStorageActivity: function (activity) {
    localStorage.setItem(ACTIVE_NAME, activity ? "1" : "0");
  },
  toggleUI: function () {
    if (this.hidden) {
      this.showUI();
      this.showInfoElements();
      this.showAlertBorders();
    } else {
      this.hideUI();
      this.hideInfoElements();
      this.hideAlertBorders();
    }
    this.setStorageHidden(this.hidden);
  },
  setStorageHidden: function (val) {
    localStorage.setItem(STH_HIDDEN, val ? "1" : "0");
  },
  showUI: function () {
    this.uiContainer.style["margin-right"] = marginRightOffset.toString() + "px";
    this.hidden = false;
  },
  hideUI: function () {
    this.uiContainer.style["margin-right"] = "-" + (marginRightOffset + this.uiContainer.offsetWidth).toString() + "px";
    this.hidden = true;
  },
  showInfoElements: function () {
    this.infoElements.forEach(element => element.style.opacity = element.dataset.opacity);
  },
  hideInfoElements: function () {
    this.infoElements.forEach(element => element.style.opacity = 0);
  },
  showAlertBorders: function () {
    this.alertBorderElements.forEach(element => element.style["border-color"] = "rgba(255,0,0,1)");
  },
  hideAlertBorders: function () {
    this.alertBorderElements.forEach(element => element.style["border-color"] = "rgba(0,0,0,0)");
  },
  buttonActionHandler: function (e) {
    switch (e.type) {
      case "keydown":
        this.handleKeyDown(e.keyCode);
        break;
      case "click":
        this.enterDummyResponses();
        this.clickNextButton();
        break;
      default:
        console.log("buttonActionHandler: Did nothing.");
    }
  },
  handleKeyDown: function (keyCode) {
    if (this.hidden) {
      if (keyCode === BUTTON_CODES.esc) {
        this.toggleUI();
      }
    } else {
      switch (keyCode) {
        case BUTTON_CODES.right:
          this.enterDummyResponses(true);
          // Fallthrough
        case BUTTON_CODES.enter:
          this.clickNextButton();
          break;
        case BUTTON_CODES.left:
          this.clickPrevButton();
          break;
        case BUTTON_CODES.spacebar:
          this.activeCheckbox.blur();
          this.toggleActive();
          break;
        case BUTTON_CODES.insert:
          this.enterDummyResponses(true);
          break;
        case BUTTON_CODES.esc:
          this.toggleUI();
          break;
      }
    }
  },
  getQuestionType: function (container = this.questionContainer) {
    if (container) {
      let containerClasses = container.classList;
      for (const typeName in QUESTION_CLASSES) {
        if (containerClasses.contains(typeName)) {
          console.log(typeName + " detected.");
          return QUESTION_CLASSES[typeName];
        }
      }
    }
    return null;
  },
  getQuestionText: function (container = this.questionContainer) {
    if (container) {
      return container.querySelector("div.question-text").innerText;
    }
    return null;
  },
  getAnswerOptionTextElements: function () {
    switch (this.questionType) {
      case QUESTION_TYPE.radio:
        return this.questionContainer.querySelectorAll("div.answers-list > div.answer-item");
      case QUESTION_TYPE.dropdown:
        return this.questionContainer.querySelector("select.list-question-select");
      case QUESTION_TYPE.multipleChoice:
        return this.questionContainer.querySelectorAll("div.questions-list div.answer-item");
      case QUESTION_TYPE.array:
        return this.questionContainer.querySelectorAll("thead th.th-9");
      default:
        return null;
    }
  },
  getNumericContext: function () {
    // Return a context enumeration based on what the question text contains
    let questionText = this.getQuestionText().toLowerCase();
    let context = null;

    if (questionText.includes("percent")) {
      context = Q_NUM_CONTEXT.percent;
    }
    else if (questionText.includes(" age") || questionText.includes("how old")) {
      context = Q_NUM_CONTEXT.age;
    }
    else if (questionText.includes("postal ") || questionText.includes("zip ")) {
      context = Q_NUM_CONTEXT.zipCode;
    }
    else if (questionText.includes(" many")
      || questionText.includes(" much")
      || questionText.includes(" number")
      || questionText.includes("amount")) {
      context = Q_NUM_CONTEXT.quantity;
    }
    else if (questionText.includes("year") || questionText.includes(" born") ) {
      if (questionText.includes("9999")) {
        context = Q_NUM_CONTEXT.yearRef;
      } else if (questionText.includes("0000")) {
        context = Q_NUM_CONTEXT.yearAL;
      } else {
        context = Q_NUM_CONTEXT.year;
      }
    }
    else if (questionText.includes("a scale")) {
      context = Q_NUM_CONTEXT.scale;
    }
    return context;
  },
  getMCContext: function () {
    // Return a context enumeration based on what the question text contains
    let questionText = this.getQuestionText().toLowerCase();
    let context = null;

    if (questionText.includes("choos")
      || questionText.includes("select")
      || questionText.includes("pick")
      || questionText.includes("which ")
      || questionText.includes("what ")
      || questionText.includes(" up to")) {
      if (questionText.includes(" two") || questionText.includes(" 2")) {
        context = Q_MC_CONTEXT.two;
      } else if (questionText.includes(" three") || questionText.includes(" 3")) {
        context = Q_MC_CONTEXT.three;
      } else if (questionText.includes(" four") || questionText.includes(" 4")) {
        context = Q_MC_CONTEXT.four;
      } else if (questionText.includes(" five") || questionText.includes(" 5")) {
        context = Q_MC_CONTEXT.five;
      }
    }
    return context;
  },
  addErrorAlertListener: function () {
    const alertElement = document.querySelector("#bootstrap-alert-box-modal");
    const config = {
      attributes: true
    };
    let observer = new MutationObserver(this.alertFoundHandler.bind(this));
    observer.observe(alertElement, config);
  },
  alertFoundHandler: function (mutationList, observer) {
    mutationList.forEach(mutation => {
      if (mutation.attributeName === "style" && mutation.target.style.display !== "none") {
        this.addAlert(new Alert(STH_ALERTCODE.invalidAnswer, "Answer Invalid." +
          (this.active ? " Pausing run..." : ""))
        );
        if (!this.hidden) {
          mutation.target.querySelector("div.modal-footer > a.btn.btn-default").click();
        }
        if (!this.errorDeactivateOverride) {
          this.setActive(false);
        }
      }
    });
  },
  enterDummyResponses: function (overwrite = false) {
    let qContainers = document.querySelectorAll("div.question-container");
    if (qContainers.length) {
      qContainers.forEach(qContainer => {
        if (!isHidden(qContainer)) {
          this.questionContainer = qContainer;  // Reference to current questions container for other functions to access
          this.questionType = this.getQuestionType(qContainer);
          this.questionCode = qContainer.querySelector("span#QNameNumData");
          this.questionCode = this.questionCode ? this.questionCode.dataset.code : undefined;
          if (!this.isAnswered() || overwrite) {
          switch (this.questionType) {
            case QUESTION_TYPE.radio:
              this.inputRadio();
              break;
            case QUESTION_TYPE.numericInput:
              this.inputNumericValue();
              break;
            case QUESTION_TYPE.shortFreeText:
              this.inputSFTValue();
              break;
            case QUESTION_TYPE.array:
              this.inputArrayOptions();
              break;
            case QUESTION_TYPE.multipleChoice:
              this.inputMultipleChoiceOptions();
              break;
            case QUESTION_TYPE.dropdown:
              this.inputDropdown();
              break;
            case QUESTION_TYPE.longFreeText:
              this.inputLFTValue();
              break;
            case QUESTION_TYPE.multipleShortFreeText:
              this.inputMSFTValue();
              break;
            case QUESTION_TYPE.textHuge:
              this.inputHeatmap();
              break;
            case QUESTION_TYPE.multipleNumericInput:
              this.inputMultipleNumericValue();
              break;
            default:
              console.log("Handleable question type not found.");
            }
          }
        }
      }, this);
    }
  },
  clearResponses: function () {
    switch (this.questionType) {
      case QUESTION_TYPE.radio:
        this.clearRadio();
        break;
      case QUESTION_TYPE.multipleChoice:
        this.clearMChoice();
        break;
    }
  },
  inputRadio: function () {
    let ansInputList = this.questionContainer.querySelectorAll("div.answers-list > div.answer-item input.radio");
    let availableIndices = [];

    this.clearRadio();

    try {
      if (this.commands.force && this.commands.force[this.questionCode]) {
        let forcedVals = this.commands.force[this.questionCode];
        ansInputList.forEach((opt, i) => {
          if (forcedVals.includes(opt.value) && !isHidden(opt)) {
            availableIndices.push(i);
            if (isHidden(opt)) {
              throw {
                message: "ERROR: " + this.questionCode + " - option [" + opt.value +
                "] is hidden but is being used as a forced option.",
                code: STH_ALERTCODE.hiddenOptionForced,
              };
            }
          }
        });
      } else if (this.commands.avoid && this.commands.avoid[this.questionCode]) {
        let restrictedVals = this.commands.avoid[this.questionCode];
        ansInputList.forEach((opt, i) => {
          if (!(restrictedVals.includes(opt.value) || isHidden(opt))) {
            availableIndices.push(i);
          }
        });
      } else {
        ansInputList.forEach((opt, i) => {
          if (!isHidden(opt)) {
            availableIndices.push(i);
          }
        });
      }

      let selectedIndex;

      // List of options compiled, select one if available
      if (availableIndices.length > 0) {
        selectedIndex = availableIndices[roll(0, availableIndices.length)];
      } else {  // No options available
        throw {
          message: "ERROR: " + this.questionCode +
          " does not have any options available for selection.",
          code: STH_ALERTCODE.noOptionsAvailable,
        }
      }

      ansInputList.item(selectedIndex).checked = true;
      let otherOpt = ansInputList.item(selectedIndex).closest(".answer-item").querySelector("input.text");
      if (otherOpt) {
        let context = this.getNumericContext();
        switch (context) {
          case Q_NUM_CONTEXT.age:
          case Q_NUM_CONTEXT.percent:
            otherOpt.value = roll(18, 99);
            break;
          case Q_NUM_CONTEXT.year:
            otherOpt.value = roll(1910, validAgeYear);
            break;
          case Q_NUM_CONTEXT.zipCode:
            otherOpt.value = DEFAULT_ZIP;
            break;
          case Q_NUM_CONTEXT.quantity:
            otherOpt.value = roll(0, 20);
            break;
          case Q_NUM_CONTEXT.scale:
            otherOpt.value = roll(40, 100);
            break;
          default:  // Generic string response
            otherOpt.value = "Run at: " + getTimeStamp();
        }
      }
    }
    catch (e) {
      this.addAlert(new Alert(e.code, e.message));
    }
  },
  clearRadio: function () {
    let ansList = this.questionContainer.querySelectorAll("div.answers-list>div.answer-item");
    let ans;
    for (let i = 0; i < ansList.length; i++) {
      ans = ansList.item(i).querySelector("input.radio");
      if (ans.checked) {
        ans.checked = false;
        let otherOpt = ansList.item(i).querySelector("input.text");
        if (otherOpt) {
          otherOpt.value = "";
        }
        break;
      }
    }
  },
  inputNumericValue: function () {
    let inputVal = 0;
    let inputElement = this.questionContainer.querySelector("input.numeric");
    let context = this.getNumericContext();

    if (this.commands.force && this.commands.force[this.questionCode]) {
      // Select from one of the comma separated values, if it's a range it should have a '-' in it
      let forcedVal = this.commands.force[this.questionCode][roll(0, this.commands.force[this.questionCode].length)].split("-");
      if (forcedVal.length > 1) {
        forcedVal = roll(Number(forcedVal[0]), Number(forcedVal[1]) + 1);
        inputVal = forcedVal;
      } else {
        inputVal = forcedVal[0];
      }
    } else {
      switch (context) {
        case Q_NUM_CONTEXT.age:
        case Q_NUM_CONTEXT.percent:
          inputVal = "0" + generateNumericInput(18, 99).toString();
          break;
        case Q_NUM_CONTEXT.year:
          inputVal = generateNumericInput(1910, validAgeYear);
          break;
        case Q_NUM_CONTEXT.zipCode:
          inputVal = DEFAULT_ZIP;
          break;
        case Q_NUM_CONTEXT.yearRef:
          // Year except with a refused option
          inputVal = generateNumericInput(1910, validAgeYear, 9999);
          break;
        case Q_NUM_CONTEXT.yearAL:
          // Client-specific year w/ refused option
          inputVal = generateNumericInput(1910, validAgeYear, 0);
          break;
        default:  // Probably a quantity or something
          inputVal = roll(0, 20);
      }
    }

    inputElement.value = inputVal;
  },
  inputMultipleNumericValue: function () {
    let inputVal = 0;
    let inputElements = this.questionContainer.querySelectorAll("input.numeric");

    let forcedVal;
    let context = this.getNumericContext();
    for (let i = 0; i < inputElements.length; i++) {
      if (this.commands.force && this.commands.force[this.questionCode]) {
        // Select from one of the comma separated values, if it's a range it should have a '-' in it
        forcedVal = this.commands.force[this.questionCode][roll(0, this.commands.force[this.questionCode].length)].split("-");
        if (forcedVal.length > 1) {
          forcedVal = roll(Number(forcedVal[0]), Number(forcedVal[1]) + 1);
          inputVal = forcedVal;
        } else {
          inputVal = forcedVal[0];
        }
      } else {
        switch (context) {
          case Q_NUM_CONTEXT.age:
          case Q_NUM_CONTEXT.percent:
            inputVal = "0" + generateNumericInput(18, 99).toString();
            break;
          case Q_NUM_CONTEXT.year:
            inputVal = generateNumericInput(1910, validAgeYear);
            break;
          case Q_NUM_CONTEXT.zipCode:
            inputVal = DEFAULT_ZIP;
            break;
          case Q_NUM_CONTEXT.yearRef:
            // Year except with a refused option
            inputVal = generateNumericInput(1910, validAgeYear, 9999);
            break;
          case Q_NUM_CONTEXT.yearAL:
            // Client-specific year w/ refused option
            inputVal = generateNumericInput(1910, validAgeYear, 0);
            break;
          default:  // Probably a quantity or something
            inputVal = roll(0, 20);
        }
      }
      inputElements[i].value = inputVal;
    }
  },
  inputSFTValue: function () {
    let inputElement = this.questionContainer.querySelector("input.text");

    if (this.commands.force && this.commands.force[this.questionCode]) {
      let forcedVal = this.commands.force[this.questionCode][roll(0, this.commands.force[this.questionCode].length)];

      inputElement.value = forcedVal;
    } else if (inputElement.value.length === 0) {
      // Only set the value if there is nothing already in
      inputElement.value = "Run at: " + getTimeStamp();
    }
  },
  inputMSFTValue: function () {
    let inputElement = this.questionContainer.querySelectorAll("input.text");

    inputElement.forEach(e => {
      // Only set the value if there is nothing already in
      if (e.value.length === 0) {
        e.value = "Run at: " + getTimeStamp();
      }
    });
  },
  inputLFTValue: function () {
    let inputElement = this.questionContainer.querySelector("div.question-container textarea");

    if (this.commands.force && this.commands.force[this.questionCode]) {
      let forcedVal = this.commands.force[this.questionCode][roll(0, this.commands.force[this.questionCode].length)];

      inputElement.value = forcedVal;
    } else if (inputElement.value.length === 0) {
      // Only set the value if there is nothing already in
      inputElement.value = "Run at: " + getTimeStamp();
    }
  },
  inputArrayOptions: function () {
    let arrayTable = this.questionContainer.querySelector("table.questions-list");
    let rows = [...arrayTable.querySelectorAll(".answers-list")];
    let options, r;

    rows = rows.filter((row) => !isHidden(row));
    rows.forEach(row => {
      options = [...row.querySelectorAll("td>input.radio")];
      options = options.filter((opt) => !isHidden(opt));
      r = roll(0, options.length);

      options[r].checked = true;
    });
  },
  inputMultipleChoiceOptions: function () {
    let checkboxes = this.questionContainer.querySelectorAll("div.questions-list div.answer-item input.checkbox");
    let context = this.getMCContext();
    let numToCheck = roll(2, context ? context : Math.ceil(checkboxes.length / 3));
    let toBeChecked = [];
    let r = 0;
    let forced = false;
    let restrictedVals = [];
    let rollAttempts = 0;

    let qID = this.questionContainer.id.replace("question","");
    let subquestionCodes = [...this.questionContainer.querySelectorAll(
      "div.questions-list > div > div.answer-item"
    )].map(element => element.id.split(qID)[1]);

    // Clear the checkboxes before re-selecting them
    this.clearMChoice();

    try {
      if (this.commands.force && this.commands.force[this.questionCode]) {
        let forcedVals = this.commands.force[this.questionCode];
        for (let i = 0; i < subquestionCodes.length
          && toBeChecked.length < numToCheck
          && toBeChecked.length < forcedVals.length; i++) {
          // Check every option that is forced
          if (forcedVals.includes(subquestionCodes[i])) {
            checkboxes[i].checked = true;
            if (isHidden(checkboxes[i])) {
              throw "ERROR: " + this.questionCode + " - option " + subquestionCodes[i] +
                " is hidden but is being used as a forced option.";
            }
            toBeChecked.push(i);
          }
        }
        forced = true;
      }
    }
    catch (e) {
      this.addAlert(new Alert(STH_ALERTCODE.hiddenOptionForced, e));
    }
    if (!forced && this.commands.avoid && this.commands.avoid[this.questionCode]) {
      restrictedVals = this.commands.avoid[this.questionCode];
    }

    while (rollAttempts <= 10 && toBeChecked.length < numToCheck) {
      r = roll(0, checkboxes.length);
      if (!checkboxes[r].checked
        && checkboxes[r].closest("div.answer-item").style.display != "none"
        && !restrictedVals.includes(subquestionCodes[r])) {
        checkboxes[r].checked = true;
        if (checkboxes[r].classList.contains("other-checkbox")) {
          checkboxes[r].closest("div.answer-item").querySelector("input.text").value = "Run at: " + getTimeStamp();
        }
        toBeChecked.push(r);
      } else {
        // Infinite loop avoidance
        rollAttempts++;
      }
    }
  },
  clearMChoice: function () {
    let checkboxes = this.questionContainer.querySelectorAll("div.questions-list div.answer-item input.checkbox");

    checkboxes.forEach(chkbox => {
      if (chkbox.checked) {
        chkbox.click();
      }
      if (chkbox.classList.contains("other-checkbox")) {
        chkbox.closest("div.answer-item").querySelector("input.text").value = "";
      }
    });
  },
  inputDropdown: function () {
    let dropdownElements = this.questionContainer.querySelector("select.list-question-select");
    let r = roll(0, dropdownElements.length);
    let forced = false;

    if (this.commands.force && this.commands.force[this.questionCode]) {
      let forcedVal = this.commands.force[this.questionCode][roll(0, this.commands.force[this.questionCode].length)];
      for (let i = 0; i < dropdownElements.length; i++) {
        if (forcedVal === dropdownElements[i].value) {
          r = i;
          break;
        }
      }
      forced = true;
    } else {
      // Roll until we reach an option with a value
      while (!dropdownElements[r].value) {
        r = roll(0, dropdownElements.length);
      }
    }
    if (!forced && this.commands.avoid && this.commands.avoid[this.questionCode]) {
      let restrictedVals = this.commands.avoid[this.questionCode];
      while (!dropdownElements[r].value || restrictedVals.includes(dropdownElements[r].value)) {
        r = roll(0, dropdownElements.length);
      }
    }

    dropdownElements[r].selected = true;
  },
  inputHeatmap: function () {
    let range = document.createRange();
    let heatmap = this.questionContainer.querySelector("#contentHeatMap");
    let content = heatmap.childNodes[0];

    range.setStart(content, 0);
    range.setEnd(content, 1);

    window.getSelection().addRange(range);

    heatmap.dispatchEvent(new MouseEvent("mouseup",{
      view: window,
      bubbles: true,
      cancelable: true
    }));
  },
  queryCommands: function () {
    // commands are html tags with data attributes of the same name containing
    // question codes and answer codes in the form "QX,1,2,3|QX2,1,2,3"
    let commandList = document.querySelectorAll(STH_COMMANDS.join(","));
    let commandContainer = {};
    for (let x = 0; x < STH_COMMANDS.length; x++) {
      commandContainer[STH_COMMANDS[x]] = null;
    }

    if (commandList.length > 0) {
      commandList.forEach(cmd => {
        let tempCmd = {};
        let questionData = cmd.dataset[cmd.localName].split("|");

        for (let i = 0; i < questionData.length; i++) {
          let arrTemp = questionData[i].split(" ").join("").split(",");
          let qName = arrTemp.shift();

          tempCmd[qName] = arrTemp;
        }

        commandContainer[cmd.localName] = tempCmd;
      });
      this.commandsFound = true;
    }

    return commandContainer;
  },
  generateArrayInfoDisplay: function () {
    let rows = this.questionContainer.querySelectorAll("tbody > tr.answers-list");
    let headerCols = this.questionContainer.querySelectorAll("thead th.th-9");
    let firstRowCells = rows[0].querySelectorAll("td.answer-item > input");
    let qID = this.questionContainer.id.replace("question","");

    // Subquestion code display
    for (let i = 0; i < rows.length; i++) {
      let infoDiv = document.createElement("div");

      infoDiv.dataset.opacity = infoDisplayOpacity;

      infoDiv.innerHTML = rows[i].id.split(qID)[1];
      infoDiv.style.position = "absolute";
      infoDiv.style.right = "100%";
      infoDiv.style.padding = "3px 0.5em";
      infoDiv.style.color = "white";
      infoDiv.style.opacity = this.hidden ? 0 : infoDiv.dataset.opacity;
      infoDiv.style["background-color"] = "orangered";
      infoDiv.style["border-radius"] = "50% 0 0 10%";
      infoDiv.style["font-weight"] = "bold";
      infoDiv.style["transition-duration"] = "0.5s";

      rows[i].appendChild(infoDiv);

      this.infoElements.push(infoDiv);
    }

    let rowHeight = headerCols[0].offsetHeight.toString() + "px";
    // Answer option value display
    for (let j = 0; j < firstRowCells.length; j++) {
      let infoDiv = document.createElement("div");

      infoDiv.dataset.opacity = infoDisplayOpacity;

      infoDiv.innerHTML = firstRowCells[j].value;
      infoDiv.style.position = "absolute";
      infoDiv.style.top = "-" + rowHeight;
      infoDiv.style.left = "50%";
      infoDiv.style.padding = "3px 0.5em";
      infoDiv.style.opacity = this.hidden ? 0 : infoDiv.dataset.opacity;
      infoDiv.style["transform"] = "translate(-50%, -100%)";
      infoDiv.style["border-radius"] = "45% 45% 5px 5px";

      let infoDivContainer = document.createElement("div");
      infoDivContainer.style.position = "relative";

      infoDivContainer.appendChild(infoDiv);
      headerCols[j].appendChild(infoDivContainer);

      this.infoElements.push(infoDiv);
    }
  },
  generateRadioInfoDisplay: function () {
    let ansList = this.questionContainer.querySelectorAll("div.answers-list > div.answer-item input.radio");

    // Answer option value display
    for (let i = 0; i < ansList.length; i++) {
      let infoDiv = document.createElement("div");

      infoDiv.dataset.opacity = infoDisplayOpacity;
      infoDiv.innerHTML = ansList[i].value;
      infoDiv.style.position = "absolute";
      infoDiv.style.top = "-0.3em";
      infoDiv.style.opacity = this.hidden ? 0 : infoDiv.dataset.opacity;
      infoDiv.style.right = "100%";
      infoDiv.style.padding = "3px";
      infoDiv.style.hyphens = "none";
      infoDiv.style.height = "28px";
      infoDiv.style.width = "fit-content";
      infoDiv.style["min-width"] = "28px";
      infoDiv.style["text-align"] = "center";
      infoDiv.style["margin-right"] = "1em";
      infoDiv.style["border-radius"] = "30px";
      infoDiv.style["padding-top"] = "0.2em";

      ansList[i].closest("div.answer-item").appendChild(infoDiv);

      this.infoElements.push(infoDiv);
    }
  },
  generateMChoiceInfoDisplay: function () {
    let choiceList = this.questionContainer.querySelectorAll("div.questions-list > div > div.answer-item");
    let qID = this.questionContainer.id.replace("question","");

    for (let i = 0; i < choiceList.length; i++) {
      let infoDiv = document.createElement("div");

      infoDiv.dataset.opacity = infoDisplayOpacity;

      infoDiv.innerHTML = choiceList[i].id.split(qID)[1];
      infoDiv.style.position = "absolute";
      infoDiv.style.top = "-0.3em";
      infoDiv.style.opacity = this.hidden ? 0 : infoDiv.dataset.opacity;
      infoDiv.style.right = "100%";
      infoDiv.style.padding = "3px";
      infoDiv.style.hyphens = "none";
      infoDiv.style.height = "28px";
      infoDiv.style.width = "fit-content";
      infoDiv.style["min-width"] = "28px";
      infoDiv.style["text-align"] = "center";
      infoDiv.style["margin-right"] = "-0.5em";
      infoDiv.style["border-radius"] = "30px";
      infoDiv.style["padding-top"] = "0.2em";

      choiceList[i].appendChild(infoDiv);

      this.infoElements.push(infoDiv);
    }
  },
  checkMandatory: function () {
    if (this.questionType === QUESTION_TYPE.textDisplay) {
      return;
    }

    let mandatoryAsterisk = this.questionContainer.querySelector("div.question-text>span.text-danger.asterisk");

    if (this.getQuestionType() && !mandatoryAsterisk) {
      this.addCautionElements(this.questionContainer);
      this.addAlert(new Alert(STH_ALERTCODE.unexpectedNonMandatory,
        `WARNING: Non-mandatory question detected (<span style="color:darkred;">${this.questionCode}</span>).`));
    }
  },
  checkDuplicateText: function () {
    let textElements = this.getAnswerOptionTextElements();

    if (textElements) {
      for (let i = 0; i < textElements.length - 1; i++) {
        for (let i2 = i + 1; i2 < textElements.length; i2++) {
          if (textElements[i].innerText.trim().toLowerCase() == textElements[i2].innerText.trim().toLowerCase()) {
            this.addAlertBorderElements(textElements[i], textElements[i2]);

            this.addAlert(new Alert(STH_ALERTCODE.duplicateAnswer,
              `WARNING: Duplicate option text detected (<span style="color:darkred;">${this.questionCode}</span>).`));
          }
        }
      }
    }

    // Check array subquestion text as well
    if (this.questionType === QUESTION_TYPE.array) {
      textElements = this.questionContainer.querySelectorAll(".answertext");

      for (let i = 0; i < textElements.length - 1; i++) {
        for (let i2 = i + 1; i2 < textElements.length; i2++) {
          if (textElements[i].innerText.trim().toLowerCase() == textElements[i2].innerText.trim().toLowerCase()) {
            this.addAlertBorderElements(textElements[i], textElements[i2]);

            this.addAlert(new Alert(STH_ALERTCODE.duplicateText,
              `WARNING: Duplicate subquestion text detected (<span style="color:darkred;">${this.questionCode}</span>).`));
          }
        }
      }
    }
  },
  checkRecontact: function () {
    if (this.questionType === QUESTION_TYPE.textDisplay) {
      return;
    }

    let questionText = this.getQuestionText().toLowerCase();
    let detected = false;

    for (let i = 0; i < RECONTACT_KEYWORDS.length; i++) {
      if (questionText.includes(RECONTACT_KEYWORDS[i])) {
        detected = true;
        break;
      }
    };

    if (detected) {
      this.addCautionElements(this.questionContainer);
      this.addAlert(new Alert(STH_ALERTCODE.recontactQuestion,
        `WARNING: Re-contact question detected. If re-contact question, contact DeltaField.`));
    }
  },
  isAnswered: function () {
    let answerFound = false;
    switch (this.questionType) {
      case QUESTION_TYPE.radio:
      case QUESTION_TYPE.mChoice:
      case QUESTION_TYPE.array:
        if(this.questionContainer.querySelector('input:checked')) {
          answerFound = true;
        }
        break;
      case QUESTION_TYPE.numericInput:
      case QUESTION_TYPE.shortFreeText:
      case QUESTION_TYPE.longFreeText:
      case QUESTION_TYPE.multiShortFreeText:
        if (this.questionContainer.querySelector('input.text, textarea').value) {
          answerFound = true;
        }
        break;
      case QUESTION_TYPE.dropdown:
        if (this.questionContainer.querySelector('select').value) {
          answerFound = true;
        }
        break;
    }
    return answerFound;
  },
  checkScaleOptions: function () {
    if (this.getNumericContext() === Q_NUM_CONTEXT.scale &&
      (this.questionType === QUESTION_TYPE.radio || this.questionType === QUESTION_TYPE.array)) {
      let optionNumbers = [];
      let missingQTextNumbers = this.getQuestionText().match(/[0-9]+/g);
      let missing = [];
      let max = 0;
      this.getAnswerOptionTextElements().forEach(e => {
        let num = e.innerText.match(/[0-9]+/);
        if (num && num.length > 0) {
          optionNumbers.push(Number(num[0]));
        }
      });
      if (missingQTextNumbers) {
        missingQTextNumbers = missingQTextNumbers.map(n => Number(n)).filter(n => (n <= 10 && !optionNumbers.includes(n)));
        max = optionNumbers.at(-1) > missingQTextNumbers.at(-1) ?
          optionNumbers.at(-1) : missingQTextNumbers.at(-1);
      }
      max = max > 0 ? max : optionNumbers.at(-1);
      for (let i = 1; i < max + 1; i++) {
        if (!optionNumbers.includes(i)) {
          missing.push(i);
        }
      }
      if (missing.length > 0) {
        this.addAlert(new Alert(STH_ALERTCODE.missingScaleOption,
          `WARNING: Scale option${missing.length > 1 ? 's' : ''} missing (<span style="color:darkred;">${missing}</span>).`));
      }
      if (missingQTextNumbers && missingQTextNumbers.length > 0) {
        this.addAlert(new Alert(STH_ALERTCODE.scaleTextMismatch,
          `WARNING: Scale value${missingQTextNumbers.length > 1 ? 's' : ''} referenced in question text missing (<span style="color:darkred;">${missingQTextNumbers}</span>).`));
      }
    }
  },
  checkNumberOnlyValue: function () {
    let textElements = this.getAnswerOptionTextElements();
    let numOnly = /^[0-9]+$/;

    switch (this.questionType) {
      case QUESTION_TYPE.radio:
        textElements.forEach(e => {
          let text = e.innerText;
          let value = e.querySelector('input.radio').value;

          if (numOnly.test(text) && Number(text) !== Number(value)) {
            this.addAlertBorderElements(e);
            this.addAlert(new Alert(STH_ALERTCODE.numberOnlyTextValueMismatch,
              `WARNING: Numeric answer option does not match its code.`));
          }
        });
        break;
      case QUESTION_TYPE.array:
        let firstRowCells = this.questionContainer.querySelector("tbody > tr.answers-list")
          .querySelectorAll("td.answer-item > input");
        textElements.forEach((e, i) => {
          let text = e.innerText;
          let value = firstRowCells[i].value;
          if (numOnly.test(text) && Number(text) !== Number(value)) {
            this.addAlertBorderElements(e);
            this.addAlert(new Alert(STH_ALERTCODE.numberOnlyTextValueMismatch,
              `WARNING: Numeric answer option does not match its code.`));
          }
        });
        break;
    }
  },
  checkQuestionAnswerTextMatch: function () {
    let questionText = this.getQuestionText().toLowerCase();
    let qTextContainer = this.questionContainer.querySelector('.question-text > div.title');
    let textElements = this.getAnswerOptionTextElements();
    let keywords = [];

    if (!textElements) {
      return;
    }

    if (!qTextContainer) {
      qTextContainer = this.questionContainer.querySelector('.question-text');
    }

    QUESTION_TEXT_KEYWORDS.forEach((keyword) => {
      if (questionText.includes(keyword)) {
        keywords.push(keyword);
      }
    });

    let keywordsInAns = new Map();
    keywords.forEach((keyword) => {
      textElements.forEach((e) => {
        if (e.innerText.toLowerCase().includes(keyword)) {
          keywordsInAns.set(keyword, true);
        }
      });
    });

    let errorKeywords = [];
    keywords.forEach((keyword) => {
      if (!keywordsInAns.get(keyword)) {
        qTextContainer.innerHTML = qTextContainer.innerHTML.replaceAll(keyword, `<span class="sthError" style="border:${ERROR_BORDER_STYLE}">${keyword}</span>`);
        errorKeywords.push(keyword);
      }
    });
    if (errorKeywords.length > 0) {
      this.addAlert(new Alert(STH_ALERTCODE.questionTextKeywordNotFound,
        `WARNING: "<span style="color:darkred;">${errorKeywords.join(', ')}</span>" found in question text but not in answer options.`));
    }
    this.questionContainer.querySelectorAll("span.sthError").forEach((e) => {
      this.addAlertBorderElements(e);
    });
  },
  checkAnswerTextConsistency: function () {
    let textElements = this.getAnswerOptionTextElements();

    if (!textElements) {
      return;
    }

    let includedKeywords = new Map();
    let numAns = 0;
    // Find keywords that are included in the answer options and find the number of relevant answer options
    for (let i = 0; i < textElements.length; i++) {
      let iText = textElements[i].innerText.toLowerCase();
      let isDKRef = false;

      ANSWER_TEXT_KEYWORDS.forEach((keyword) => {
        if (iText.includes(keyword)) {
          includedKeywords.set(keyword, 0);
        }
      });

      for (let j = 0; j < DK_REF_TEXT.length; j++) {
        if (iText.includes(DK_REF_TEXT[j])) {
          isDKRef = true;
          break;
        }
      }
      if (!isDKRef) {
        numAns++;
      }
    }

    // Find keywords that are included in some, but not in all (excluding don't know/refused options)
    for (let i = 0; i < textElements.length; i++) {
      let iText = textElements[i].innerText.toLowerCase();

      includedKeywords.forEach((count, keyword) => {
        if (iText.includes(keyword)) {
          includedKeywords.set(keyword, count + 1);
        }
      });
    }

    let errorKeywords = [];
    includedKeywords.forEach((count, keyword) => {
      if (count !== numAns) {
        errorKeywords.push(keyword);
      }
    });

    if (errorKeywords.length > 0) {
      this.addAlert(new Alert(STH_ALERTCODE.answerTextConsistencyFail,
        `WARNING: "<span style="color:darkred;">${errorKeywords.join(', ')}</span>" found in an answer but may be missing in others.`)
      );
    }
    this.questionContainer.querySelectorAll("span.sthError").forEach((e) => {
      this.addAlertBorderElements(e);
    });
  },
  checkSFTMaxLengthValidity: function () {
    // Return true if valid, false otherwise
    const inputElement = this.questionContainer?.querySelector("input.text");

    if (inputElement && this.getQuestionType() === QUESTION_TYPE.shortFreeText && inputElement.maxLength >= 0) {
      this.addAlert(new Alert(STH_ALERTCODE.maxLengthDetected,
        `WARNING: Question input has a maxLength value of "<span style="color:darkred;">${inputElement.maxLength}</span>".`)
      );
      // Return value determines 'auto-next' pathing. TODO: Change if time permits
      return !(inputElement.value.length > inputElement.maxLength);
    }

    // Valid by default
    return true;
  },
  createDupeDetector: function (qtexts) {
    const firstSentenceSeparatorRegex = /[\n\.]/;
    questionTexts = qtexts.map(qrow => {
      return {
        code: qrow.children[1].querySelector('b').innerText.replace('*', ''),
        text: qrow.children[3].innerText.split(firstSentenceSeparatorRegex)[0].replaceAll(/[^a-zA-Z\d]/g, ''),
        ogText: qrow.children[3].innerText.split(firstSentenceSeparatorRegex)[0],
        type: qrow.children[1].innerText.split('\n').pop(),
        prevRow: qrow.previousElementSibling,
        nextRow: qrow.nextElementSibling,
        hidden: qrow.children[3].innerText.includes('hidden\t1'),
      };
    });
    // Remove precodes
    if (questionTexts[0].prevRow.classList.contains('LEMgroup') && questionTexts[0].prevRow.innerText.includes('Precodes')) {
      do {
        questionTexts.shift();
      } while (!questionTexts[0].prevRow.classList.contains('LEMgroup') && questionTexts.length > 0);
    }
    // Remove backpage
    for (let i = 0; i < questionTexts.length;) {
      if (questionTexts[i].prevRow.classList.contains('LEMgroup') && (questionTexts[i].prevRow.innerText.includes('ackpage') || questionTexts[i].prevRow.innerText.includes('rosstab'))) {
        questionTexts.pop();
      } else {
        i++;
      }
    }
    // Remove hidden questions
    for (let i = 0; i < questionTexts.length;) {
      if (questionTexts[i].hidden) {
        if (questionTexts[i].type.includes('[F]') || questionTexts[i].type.includes('[M]')) {
          let j = 0;
          while (questionTexts[i + j].nextRow.classList.contains('LEMsubq')) {
            j++;
          }
          questionTexts.splice(i, j + 1);
        } else {
          questionTexts.splice(i, 1);
        }
      } else {
        i++;
      }
    }
    // Remove other options
    questionTexts = questionTexts.filter(qtext => !qtext.code.endsWith('_other'));
    // Remove equations
    questionTexts = questionTexts.filter(qtext => !qtext.type.includes('[*]'));
    let dupes = [];
    while (questionTexts.length > 0) {
      qtext = questionTexts.shift();
      let foundDupe = questionTexts.find(text => text.text == qtext.text);
      if (foundDupe) {
        let handledDupe = dupes.find(text => text.text == foundDupe.text);
        if (handledDupe) {
          // Only append the code stuff if extra dupes are found
          handledDupe.code += `, ${foundDupe.code}`;
        } else {
          qtext.code += `, ${foundDupe.code}`;
          dupes.push(qtext);
        }
      }
    }

    dupes = dupes.filter(dupe => dupe.text.trim() !== '');

    if (dupes.length > 0) {
      const dupeDetectorUI = document.createElement('div');
      let ddHidden = false;
      const initialTop = '55px';
      dupeDetectorUI.innerHTML = `<b>Duplicate text found</b>:<ul>${dupes.reduce((acc, cur) => acc + `<li><b>${cur.code}</b>: ${cur.ogText}</li>`, '')}</ul>`;
      dupeDetectorUI.style.position = 'fixed';
      dupeDetectorUI.style.left = 'auto';
      dupeDetectorUI.style.right = '3em';
      dupeDetectorUI.style.top = initialTop;
      dupeDetectorUI.style['max-width'] = '70%';
      dupeDetectorUI.style['max-height'] = '40%';
      dupeDetectorUI.style['background-color'] = 'rgba(255,255,255)';
      dupeDetectorUI.style.padding = '3px';
      dupeDetectorUI.style['border-radius'] = '5px';
      dupeDetectorUI.style.overflow = 'visible scroll';
      dupeDetectorUI.style.zIndex = '9999';
      dupeDetectorUI.style['transition-duration'] = '0.5s';
      dupeDetectorUI.addEventListener('transitionend', () => {
        dupeDetectorUI.style['background-color'] = 'rgba(255,255,255,0.95)';
      });

      const hideBtn = document.createElement('button');
      hideBtn.style.position = 'fixed';
      hideBtn.innerText = '^';
      hideBtn.style.width = '70px';
      hideBtn.style.height = '30px';
      hideBtn.style.left = '50%';
      hideBtn.style.top = '0%';
      hideBtn.style.color = 'white';
      hideBtn.style['background-color'] = 'red';
      hideBtn.style['border-radius'] = '0 0 8px 8px';
      hideBtn.style.border = 'none';

      dupeDetectorUI.append(hideBtn);

      hideBtn.onclick = (e) => {
        if (!ddHidden) {
          hideBtn.innerText = 'v';
          dupeDetectorUI.style.top = '-100%';
        } else {
          hideBtn.innerText = '^';
          dupeDetectorUI.style.top = initialTop;
        }
        ddHidden = !ddHidden;
      };

      setTimeout(() => {
        dupeDetectorUI.style['background-color'] = 'red';
      }, 200);
      document.body.appendChild(dupeDetectorUI);
    }
  }
};

function roll (min, max) {
  return (Math.random() * (max - min) + min) | 0;
};

function generateNumericInput (min, max, refusedVal=-1) {
  let returnVal = 0;
  // 20% chance of returning refused option, if provided
  if (refusedVal > -1) {
    returnVal = (roll(0, 100) < 20) ? refusedVal : roll(min, max);
  } else {
    returnVal = roll(min, max);
  }
  return returnVal;
};

function getTimeStamp () {
  return String(curDate.getMonth() + 1).padStart(2, "0") + "-" +
    String(curDate.getDate()).padStart(2, "0") + " " +
    String(curDate.getHours()).padStart(2, "0") + ":" +
    String(curDate.getMinutes()).padStart(2, "0");
}

function isHidden(element) {
  return (element.offsetWidth === 0 || element.offsetHeight === 0 );
}

var marginRightOffset = 15;

// Delay initialization so that LS has a chance to properly manage its UI before we start
window.setTimeout(function () {
  SurveyTestHelper.initialize();
}, 10);
