// ==UserScript==
// @name         Coursera Tools
// @namespace    https://luongtuananh.com/
// @version      1.0.2
// @description  The Best Coursera Tools
// @author       DemonDucky
// @match        https://www.coursera.org/*
// @match        https://coursera.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursera.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524750/Coursera%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/524750/Coursera%20Tools.meta.js
// ==/UserScript==
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype)
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i)
          ar[i] = from[i]
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from))
  }
function showToast(message, duration, type) {
  if (duration === void 0) {
    duration = 3000
  }
  if (type === void 0) {
    type = 'info'
  }
  // Ensure the container exists
  var toastContainer = document.getElementById('toast-container')
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    Object.assign(toastContainer.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '9999',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    })
    document.body.appendChild(toastContainer)
  }
  // Create a new toast
  var toast = document.createElement('div')
  Object.assign(toast.style, {
    padding: '10px 20px',
    borderRadius: '5px',
    background: type === 'info' ? '#007bff' : type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#6c757d',
    color: '#fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    opacity: '0',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    transform: 'translateY(20px)'
  })
  toast.textContent = message
  // Append the toast to the container
  toastContainer.appendChild(toast)
  // Animate the toast in
  requestAnimationFrame(function () {
    toast.style.opacity = '1'
    toast.style.transform = 'translateY(0)'
  })
  // Remove the toast after the specified duration
  setTimeout(function () {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(20px)'
    toast.addEventListener('transitionend', function () {
      toast.remove()
      if (!toastContainer.children.length) {
        toastContainer.remove()
      }
    })
  }, duration)
}
function handleAction(button, action) {
  return __awaiter(this, void 0, void 0, function () {
    var error_1
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          // Disable the button
          button.disabled = true
          button.style.opacity = '0.6'
          _a.label = 1
        case 1:
          _a.trys.push([1, 3, 4, 5])
          return [4 /*yield*/, action()] // Run the action
        case 2:
          _a.sent() // Run the action
          return [3 /*break*/, 5]
        case 3:
          error_1 = _a.sent()
          console.error('Action failed:', error_1)
          return [3 /*break*/, 5]
        case 4:
          // Re-enable the button
          button.disabled = false
          button.style.opacity = '1'
          return [7 /*endfinally*/]
        case 5:
          return [2 /*return*/]
      }
    })
  })
}
function createElement(tag, styles, textContent) {
  if (styles === void 0) {
    styles = {}
  }
  if (textContent === void 0) {
    textContent = ''
  }
  var element = document.createElement(tag)
  Object.assign(element.style, styles)
  element.textContent = textContent
  return element
}
function delay(ms) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [
        2 /*return*/,
        new Promise(function (resolve) {
          return setTimeout(resolve, ms)
        })
      ]
    })
  })
}
function finishSupplement(userId, courseId, itemId) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            fetch('https://www.coursera.org/api/onDemandSupplementCompletions.v1', {
              credentials: 'include',
              headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0',
                Accept: '*/*',
                'Accept-Language': 'en',
                'Content-Type': 'application/json; charset=utf-8',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                Priority: 'u=0'
              },
              body: JSON.stringify({ userId: userId, courseId: courseId, itemId: itemId }),
              method: 'POST',
              mode: 'cors'
            })
          ]
        case 1:
          return [2 /*return*/, _a.sent()]
      }
    })
  })
}
function finishLecture(userId, courseName, itemId) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            fetch(
              'https://www.coursera.org/api/opencourse.v1/user/'
                .concat(userId, '/course/')
                .concat(courseName, '/item/')
                .concat(itemId, '/lecture/videoEvents/ended?autoEnroll=false'),
              {
                credentials: 'include',
                headers: {
                  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0',
                  Accept: '*/*',
                  'Accept-Language': 'en',
                  'Content-Type': 'application/json; charset=utf-8',
                  'Sec-Fetch-Dest': 'empty',
                  'Sec-Fetch-Mode': 'cors',
                  'Sec-Fetch-Site': 'same-origin'
                },
                body: '{"contentRequestBody":{}}',
                method: 'POST',
                mode: 'cors'
              }
            )
          ]
        case 1:
          return [2 /*return*/, _a.sent()]
      }
    })
  })
}
function getItemId(item) {
  var _a
  var clickValue = JSON.parse(
    ((_a = item.querySelector('a')) === null || _a === void 0 ? void 0 : _a.dataset.clickValue) || '{}'
  )
  var splitted = clickValue === null || clickValue === void 0 ? void 0 : clickValue.href.split('/')
  return { id: splitted[splitted.length - 2], name: splitted[splitted.length - 1] }
}
function finishModule() {
  return __awaiter(this, void 0, void 0, function () {
    var lectures,
      supplements,
      all,
      firstClickValue,
      courseID,
      courseName,
      userID,
      _i,
      supplements_1,
      supplement,
      itemInfo,
      _a,
      lectures_1,
      lecture,
      itemInfo
    var _b, _c, _d, _e, _f, _g, _h
    return __generator(this, function (_j) {
      switch (_j.label) {
        case 0:
          lectures = Array.from(document.querySelectorAll('div[data-test$="lecture"]')).filter(function (item) {
            var _a, _b
            return !((_b = (_a = item.querySelector('title')) === null || _a === void 0 ? void 0 : _a.textContent) ===
              null || _b === void 0
              ? void 0
              : _b.includes('Completed'))
          })
          supplements = Array.from(document.querySelectorAll('div[data-test$="supplement"]')).filter(function (item) {
            var _a, _b
            return !((_b = (_a = item.querySelector('title')) === null || _a === void 0 ? void 0 : _a.textContent) ===
              null || _b === void 0
              ? void 0
              : _b.includes('Completed'))
          })
          all = __spreadArray(__spreadArray([], lectures, true), supplements, true)
          firstClickValue = JSON.parse(
            ((_b = all[0].querySelector('a')) === null || _b === void 0 ? void 0 : _b.dataset.clickValue) || '{}'
          )
          courseID = firstClickValue === null || firstClickValue === void 0 ? void 0 : firstClickValue.course_id
          courseName =
            firstClickValue === null || firstClickValue === void 0 ? void 0 : firstClickValue.href.split('/')[2]
          userID = Number(
            (_h =
              (_g =
                (_f =
                  (_e =
                    (_d = (_c = window.App) === null || _c === void 0 ? void 0 : _c.context) === null || _d === void 0
                      ? void 0
                      : _d.dispatcher) === null || _e === void 0
                    ? void 0
                    : _e.stores) === null || _f === void 0
                  ? void 0
                  : _f.ApplicationStore) === null || _g === void 0
                ? void 0
                : _g.userData) === null || _h === void 0
              ? void 0
              : _h.id
          )
          ;(_i = 0), (supplements_1 = supplements)
          _j.label = 1
        case 1:
          if (!(_i < supplements_1.length)) return [3 /*break*/, 5]
          supplement = supplements_1[_i]
          itemInfo = getItemId(supplement)
          // Await finishSupplement so that the loop waits for the current request to complete
          return [4 /*yield*/, finishSupplement(userID, courseID, itemInfo.id)]
        case 2:
          // Await finishSupplement so that the loop waits for the current request to complete
          _j.sent()
          showToast('Finished '.concat(itemInfo.name), 3000, 'success')
          return [4 /*yield*/, delay(200)]
        case 3:
          _j.sent()
          _j.label = 4
        case 4:
          _i++
          return [3 /*break*/, 1]
        case 5:
          ;(_a = 0), (lectures_1 = lectures)
          _j.label = 6
        case 6:
          if (!(_a < lectures_1.length)) return [3 /*break*/, 10]
          lecture = lectures_1[_a]
          itemInfo = getItemId(lecture)
          return [4 /*yield*/, finishLecture(userID.toString(), courseName, itemInfo.id)]
        case 7:
          _j.sent()
          showToast('Finished '.concat(itemInfo.name), 3000, 'success')
          return [4 /*yield*/, delay(200)]
        case 8:
          _j.sent()
          _j.label = 9
        case 9:
          _a++
          return [3 /*break*/, 6]
        case 10:
          window.location.reload()
          return [2 /*return*/]
      }
    })
  })
}
function callChatGPTAPI(questionText, answerOptions, isMultipleAnswer) {
  return __awaiter(this, void 0, void 0, function () {
    var apiKey, apiUrl, answerAmount, prompt, response, data, responseText, parsedResponse
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          apiKey = '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' // Replace with your OpenAI API key
          apiUrl = 'https://api.openai.com/v1/chat/completions'
          // Construct the prompt for ChatGPT
          console.log('questionText: '.concat(questionText))
          console.log('answerOptions: '.concat(answerOptions))
          console.log('isMultipleAnswer: '.concat(isMultipleAnswer))
          answerAmount = isMultipleAnswer ? 'there are multiple answers' : 'there is only a single answer'
          prompt = 'Question: '
            .concat(questionText, '\nOptions:\n')
            .concat(answerOptions.join('\n'), '\n\n')
            .concat(
              answerAmount,
              '\n\nGive me the correct answer(s) by returning a valid JSON string with an array of answer(s). Only give me the valid json, I don\'t need anything else like formatting,.. Example: ["Answer 1", "Answer 2"].'
            )
          return [
            4 /*yield*/,
            fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer '.concat(apiKey)
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini', // Use the appropriate model
                messages: [
                  {
                    role: 'user',
                    content: prompt
                  }
                ],
                temperature: 0.1 // Low temperature for more focused/precise answers
              })
            })
          ]
        case 1:
          response = _a.sent()
          return [4 /*yield*/, response.json()]
        case 2:
          data = _a.sent()
          responseText = data.choices[0].message.content.trim()
          console.log('responseText: ', responseText)
          // Parse the JSON response
          try {
            parsedResponse = JSON.parse(responseText)
            return [2 /*return*/, parsedResponse] // Return the array of correct answers
          } catch (error) {
            console.error('Failed to parse ChatGPT response:', error)
            return [2 /*return*/, []]
          }
          return [2 /*return*/]
      }
    })
  })
}
function clickCorrectAnswer(questionBlock, correctAnswers) {
  var _a
  var optionsContainer =
    (_a = questionBlock.nextElementSibling) === null || _a === void 0
      ? void 0
      : _a.querySelector('[role="group"], [role="radiogroup"]')
  if (optionsContainer) {
    var labels = optionsContainer.querySelectorAll('label')
    labels.forEach(function (label) {
      var _a
      var optionText =
        (_a = label === null || label === void 0 ? void 0 : label.querySelector('[data-testid="cml-viewer"]')) ===
          null || _a === void 0
          ? void 0
          : _a.innerText.trim()
      if (correctAnswers.includes(optionText)) {
        var input = label === null || label === void 0 ? void 0 : label.querySelector('input')
        if (input) {
          input.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
          input.click() // Simulate clicking the correct answer
        }
      }
    })
  }
}
function extractQuestionsAndAnswers() {
  var questions = []
  // Find all question blocks
  var questionBlocks = document.querySelectorAll('[data-testid="legend"]')
  questionBlocks.forEach(function (block) {
    var _a
    var questionData = {
      questionNumber: '',
      questionText: '',
      isMultipleAnswer: false,
      answerOptions: []
    }
    // Extract the question number
    var questionNumberElement = block.querySelector('h3')
    if (questionNumberElement) {
      questionData.questionNumber = questionNumberElement.innerText.trim()
    }
    // Extract the question text
    var questionTextElement = block.querySelector('[data-testid="cml-viewer"]')
    if (questionTextElement) {
      questionData.questionText = questionTextElement.innerText.trim()
    }
    // Extract the answer options
    var optionsContainer =
      (_a = block.nextElementSibling) === null || _a === void 0
        ? void 0
        : _a.querySelector('[role="group"], [role="radiogroup"]')
    if (optionsContainer) {
      // Check if the question is multiple answer (checkbox) or single answer (radio)
      var isMultipleAnswer = optionsContainer.querySelector('input[type="checkbox"]') !== null
      questionData.isMultipleAnswer = isMultipleAnswer
      // Extract all answer options
      optionsContainer.querySelectorAll('label').forEach(function (label) {
        var optionTextElement = label.querySelector('[data-testid="cml-viewer"]')
        if (optionTextElement) {
          var optionText = optionTextElement.innerText.trim()
          questionData.answerOptions.push(optionText)
        }
      })
    }
    // Add the question and answers to the list
    questions.push(questionData)
  })
  return questions
}
function findQuestionBlockByNumber(questionNumber) {
  var questionBlocks = Array.from(document.querySelectorAll('[data-testid="legend"]'))
  for (var _i = 0, questionBlocks_1 = questionBlocks; _i < questionBlocks_1.length; _i++) {
    var block = questionBlocks_1[_i]
    var questionNumberElement = block.querySelector('h3')
    if (questionNumberElement && questionNumberElement.innerText.trim() === questionNumber) {
      return block
    }
  }
  return null
}
function autoAnswerQuestions() {
  return __awaiter(this, void 0, void 0, function () {
    var questions,
      _i,
      questions_1,
      question,
      questionText,
      answerOptions,
      isMultipleAnswer,
      correctAnswers,
      questionBlock
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          questions = extractQuestionsAndAnswers() // Use the previous function to extract questions
          ;(_i = 0), (questions_1 = questions)
          _a.label = 1
        case 1:
          if (!(_i < questions_1.length)) return [3 /*break*/, 4]
          question = questions_1[_i]
          ;(questionText = question.questionText),
            (answerOptions = question.answerOptions),
            (isMultipleAnswer = question.isMultipleAnswer)
          return [4 /*yield*/, callChatGPTAPI(questionText, answerOptions, isMultipleAnswer)]
        case 2:
          correctAnswers = _a.sent()
          console.log('Question: '.concat(questionText, '\nCorrect Answers:'), correctAnswers)
          questionBlock = findQuestionBlockByNumber(question.questionNumber)
          if (questionBlock) {
            clickCorrectAnswer(questionBlock, correctAnswers)
          }
          _a.label = 3
        case 3:
          _i++
          return [3 /*break*/, 1]
        case 4:
          return [2 /*return*/]
      }
    })
  })
}

// New function to generate random text
function generateRandomText(minLength = 50, maxLength = 100) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let result = '';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

// New function to auto-complete rubric
function autoCompleteRubric() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Select highest point options for radio groups using click()
            const radioGroups = document.querySelectorAll('.cds-formGroup-groupWrapper[role="radiogroup"]');

            radioGroups.forEach(group => {
                const radios = group.querySelectorAll('input[type="radio"]');
                let highestPoints = -1;
                let highestRadio = null;

                radios.forEach(radio => {
                    const label = radio.closest('label');
                    const pointsText = label.querySelector('.css-1rlln5c span').textContent;
                    const points = parseInt(pointsText.match(/\d+/)[0]);

                    if (points > highestPoints) {
                        highestPoints = points;
                        highestRadio = radio;
                    }
                });

                if (highestRadio) {
                    highestRadio.click(); // Use click() instead of setting checked
                }
            });

            // Fill all textareas with random text
            const textareas = document.querySelectorAll('textarea[data-testid="peer-review-multi-line-input-field"]');

            textareas.forEach(textarea => {
                textarea.value = generateRandomText();
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            });

            showToast('Rubric completed with highest points and random text', 3000, 'success');
            return [2 /*return*/];
        });
    });
}

;(function () {
  'use strict'
  // Utility function to create an element with specific styles
  // Create the button
  var button = createElement(
    'button',
    {
      position: 'fixed',
      top: '40px',
      fontWeight: 'bold',
      right: '40px',
      width: '50px',
      height: '50px',
      backgroundColor: '#000000',
      padding: '6px',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: '9999'
    },
    'Tools'
  )
  document.body.appendChild(button)
  // Create the dropdown menu
  var dropdown = createElement('div', {
    position: 'fixed',
    top: '100px',
    right: '40px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    display: 'none', // Hidden by default
    zIndex: '9999'
  })
  document.body.appendChild(dropdown)
  // Define menu items with their actions
  var menuItems = [
    { text: 'Finish Module', action: finishModule },
    { text: 'Auto Answer Questions', action: autoAnswerQuestions },
    { text: 'Auto Complete Rubric', action: autoCompleteRubric }
  ]
  // Add items to the dropdown
  menuItems.forEach(function (item, index) {
    var menuItem = createElement(
      'div',
      {
        padding: '10px',
        cursor: 'pointer',
        borderBottom: index < menuItems.length - 1 ? '1px solid #eee' : 'none',
        color: '#333',
        backgroundColor: '#fff'
      },
      item.text
    )
    menuItem.addEventListener('click', function () {
      handleAction(button, item.action)
      dropdown.style.display = 'none' // Hide dropdown after action
    })
    menuItem.addEventListener('mouseover', function () {
      menuItem.style.backgroundColor = '#f0f0f0'
    })
    menuItem.addEventListener('mouseout', function () {
      menuItem.style.backgroundColor = '#fff'
    })
    dropdown.appendChild(menuItem)
  })
  // Toggle dropdown visibility on button click
  button.addEventListener('click', function () {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none'
  })
  // Hide dropdown when clicking outside
  document.addEventListener('click', function (e) {
    if (!button.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none'
    }
  })
})()
