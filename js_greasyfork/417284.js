/* ----------------------------------------------------------------------------

 Online Moodle/Elearning/KMOOC test help
 Greasyfork: <https://greasyfork.org/en/scripts/38999-moodle-elearning-kmooc-test-help>
 GitLab: <https://gitlab.com/MrFry/moodle-test-userscript>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program. If not, see <https://www.gnu.org/licenses/>.

 ------------------------------------------------------------------------- */
// ==UserScript==
// @name         Moodle/Elearning/KMOOC test help
// @version      2.0.1.21
// @description  Online Moodle/Elearning/KMOOC test help
// @author       MrFry
// @match        https://szelearning.sze.hu/*
// @match        https://elearning.uni-obuda.hu/kmooc/*
// @match        https://mooc.unideb.hu/*
// @match        https://itc.semmelweis.hu/moodle/*
// @match        https://qmining.frylabs.net/*
// @match        http://qmining.frylabs.net/*

// @noframes
// @run-at       document-start
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @license      GNU General Public License v3.0 or later
// @supportURL   qmining.frylabs.net
// @contributionURL qmining.frylabs.net
// @namespace    https://qmining.frylabs.net
// @downloadURL https://update.greasyfork.org/scripts/417284/MoodleElearningKMOOC%20test%20help.user.js
// @updateURL https://update.greasyfork.org/scripts/417284/MoodleElearningKMOOC%20test%20help.meta.js
// ==/UserScript==
//
// TODO:
// grabboxes test on quiz page

// TODO: test if this ; does not fuck up things (it seams it does not)
;(function() {
  // eslint-disable-line
  // GM functions, only to disable ESLINT errors
  /* eslint-disable  */
  const a = Main
  const usf = unsafeWindow
  function getVal(name) {
    return GM_getValue(name)
  }
  function setVal(name, val) {
    return GM_setValue(name, val)
  }
  function delVal(name) {
    return GM_deleteValue(name)
  }
  function openInTab(address, options) {
    GM_openInTab(address, options)
  }
  function xmlhttpRequest(opts) {
    GM_xmlhttpRequest(opts)
  }
  function info() {
    return GM_info
  }
  /* eslint-enable */

  var addEventListener // add event listener function
  let serverAdress = 'https://qmining.frylabs.net/'
  let apiAdress = 'https://api.frylabs.net/'
  const ircAddress = 'https://kiwiirc.com/nextclient/irc.sub.fm/#qmining'

  // forcing pages for testing. unless you test, do not set these to true!
  // only one of these should be true for testing
  setVal('ISDEVEL', false)
  const forceTestPage = false
  const forceResultPage = false
  const forceDefaultPage = false
  const logElementGetting = false
  const log = false
  const showErrors = false

  const motdShowCount = 3 /* Ammount of times to show motd */
  let infoExpireTime = 60 // Every n seconds basic info should be loaded from server
  var uid = 0
  var cid = 0
  var motd = ''
  var userSpecificMotd = ''
  var lastestVersion = ''
  var subjInfo

  // array, where elems are added to shadow-root, but its position should be at target.
  var updatableElements = [] // { elem: ..., target: ... }
  var elementUpdaterInterval = -1
  const overlayElemUpdateInterval = 2 // seconds

  if (getVal('ISDEVEL')) {
    console.log('Moodle script running in developement mode!')
    infoExpireTime = 1
    serverAdress = 'http://localhost:8080/'
    apiAdress = 'http://localhost:8080/'
  }

  const huTexts = {
    lastChangeLog: '',
    fatalError:
      'Fatál error. Check console (f12). Kattints az üzenetre az összes kérdés/válaszért manuális kereséshez!',
    consoleErrorInfo:
      'Itteni hibák 100% a moodle hiba. Kivéve, ha oda van írva hogy script error ;) Ha ilyesmi szerepel itt, akkor olvasd el a segítség szekciót! https://qmining.frylabs.net/manual?scriptcmd',
    freshStartWarning:
      '<h1>Moodle teszt userscript:<h1><h3>1.5.0 verzió: a script mostantól XMLHTTP kéréseket küld szerver fele! Erre a userscript futtató kiegészítőd is figyelmeztetni fog! Ha ez történik, a script rendes működése érdekében engedélyezd (Always allow domain)! Ha nem akarod, hogy ez történjen, akkor ne engedélyezd, vagy a menüben válaszd ki a "helyi fájl használata" opciót!</h3> <h3>Elküldött adatok: minden teszt után a kérdés-válasz páros. Fogadott adatok: Az összes eddig ismert kérdés. Érdemes help-et elolvasni!!!</h3><h5>Ez az ablak frissités után eltűnik. Ha nem, akkor a visza gombbal próbálkozz.</h5>',
    noResult:
      'Nincs találat :( Kattints az üzenetre az összes kérdés/válaszért manuális kereséshez!',
    videoHelp: 'Miután elindítottad: Play/pause: space. Seek: Bal/jobb nyíl.',
    menuButtonText: 'Kérdések Menu',
    couldntLoadDataPopupMenuText:
      'A kérdéseket nem lehetett beolvasni, ellenőrizd hogy elérhető-e a szerver',
    showGreetingOnEveryPage: 'Üdvözlő üzenet mutatása minden oldalon',
    close: 'Bezárás',
    help: 'Help',
    websiteBugreport: 'Weboldal / Bug report',
    contribute: 'Contribute',
    donate: 'Donate',
    retry: 'Újrapróbálás',
    ircButton: 'IRC',
    invalidPW: 'Hibás jelszó: ',
    search: 'Keresés ...',
    loading: 'Betöltés ...',
    login: 'Belépés',
    requestPWInsteadOfLogin: 'Jelszó igénylés',
    contributeTitle: 'Hozzájárulás a script és weboldal fejleszétéshez',
    newPWTitle: 'Új jelszó új felhasználónak',
    pwRequest: 'Új jelszó',
    noServer: 'Nem elérhető a szerver!',
    noUser: 'Nem vagy bejelentkezve!',
    noServerConsoleMessage: `Nem elérhető a szerver, vagy kis eséllyel kezeletlen hiba történt! Ha elérhető a weboldal, akkor ott meg bírod nézni a kérdéseket itt: ${serverAdress}legacy`,
  }

  var texts = huTexts

  // : question-classes {{{
  const specialChars = ['&', '\\+']

  const assert = val => {
    if (!val) {
      throw new Error('Assertion failed')
    }
  }

  class StringUtils {
    removeMultipleEnters(text) {
      let res = text.replace(/\t/g, '')

      while (res.includes('\n\n')) {
        res = res.replace('\n\n', '\n')
      }

      return res
    }

    RemoveStuff(value, removableStrings, toReplace) {
      removableStrings.forEach(x => {
        var regex = new RegExp(x, 'g')
        value = value.replace(regex, toReplace || '')
      })
      return value
    }

    SimplifyQuery(q) {
      assert(q)

      var result = q.replace(/\n/g, ' ').replace(/\s/g, ' ')
      return this.RemoveUnnecesarySpaces(result)
    }

    ShortenString(toShorten, ammount) {
      assert(toShorten)

      var result = ''
      var i = 0
      while (i < toShorten.length && i < ammount) {
        result += toShorten[i]
        i++
      }
      return result
    }

    ReplaceCharsWithSpace(val, char) {
      assert(val)
      assert(char)

      var toremove = this.NormalizeSpaces(val)

      var regex = new RegExp(char, 'g')
      toremove = toremove.replace(regex, ' ')

      return this.RemoveUnnecesarySpaces(toremove)
    }

    // removes whitespace from begining and and, and replaces multiple spaces with one space
    RemoveUnnecesarySpaces(toremove) {
      assert(toremove)

      toremove = this.NormalizeSpaces(toremove)
      while (toremove.includes('  ')) {
        toremove = toremove.replace(/ {2}/g, ' ')
      }
      return toremove.trim()
    }

    RemoveSpecialChars(value) {
      assert(value)

      return this.RemoveStuff(value, specialChars, ' ')
    }

    // if the value is empty, or whitespace
    EmptyOrWhiteSpace(value) {
      // replaces /n-s with "". then replaces spaces with "". if it equals "", then its empty, or only consists of white space
      if (value === undefined) {
        return true
      }
      return (
        value
          .replace(/\n/g, '')
          .replace(/ /g, '')
          .replace(/\s/g, ' ') === ''
      )
    }

    // damn nonbreaking space
    NormalizeSpaces(input) {
      assert(input)

      return input.replace(/\s/g, ' ')
    }

    SimplifyStack(stack) {
      return this.SimplifyQuery(stack)
    }
  }

  const SUtils = new StringUtils()

  // : }}}

  // : DOM getting stuff {{{
  // all dom getting stuff are in this sections, so on
  // moodle dom change, stuff breaks here

  //Stealth by An0 with love
  function StealthOverlay() {
    //call this before the document scripts
    const document = window.document

    const neverEqualPlaceholder = Symbol(`never equal`) //block probing for undefined values in the hooks
    let shadowRootHost = neverEqualPlaceholder
    let shadowRootNewHost = neverEqualPlaceholder

    const apply = Reflect.apply //save some things in case they get hooked (only for unsafe contexts)

    if (usf.Error.hasOwnProperty('stackTraceLimit')) {
      Reflect.defineProperty(usf.Error, 'stackTraceLimit', {
        value: undefined,
        writable: false,
        enumerable: false,
        configurable: false,
      })
    }

    const shadowGetHandler = {
      apply: (target, thisArg, argumentsList) =>
        apply(
          target,
          thisArg === shadowRootHost ? shadowRootNewHost : thisArg,
          argumentsList
        ),
    }

    const original_attachShadow = usf.Element.prototype.attachShadow
    const attachShadowProxy = new Proxy(original_attachShadow, shadowGetHandler)
    usf.Element.prototype.attachShadow = attachShadowProxy

    const getShadowRootProxy = new Proxy(
      Object.getOwnPropertyDescriptor(usf.Element.prototype, 'shadowRoot').get,
      shadowGetHandler
    )
    Object.defineProperty(usf.Element.prototype, 'shadowRoot', {
      get: getShadowRootProxy,
    })

    const getHostHandler = {
      apply: function() {
        let result = apply(...arguments)
        return result === shadowRootNewHost ? shadowRootHost : result
      },
    }
    const getHostProxy = new Proxy(
      Object.getOwnPropertyDescriptor(usf.ShadowRoot.prototype, 'host').get,
      getHostHandler
    )
    Object.defineProperty(usf.ShadowRoot.prototype, 'host', {
      get: getHostProxy,
    })

    const shadowRootSetInnerHtml = Object.getOwnPropertyDescriptor(
      ShadowRoot.prototype,
      'innerHTML'
    ).set
    const documentFragmentGetChildren = Object.getOwnPropertyDescriptor(
      DocumentFragment.prototype,
      'children'
    ).get
    const documentGetBody = Object.getOwnPropertyDescriptor(
      Document.prototype,
      'body'
    ).get
    const nodeAppendChild = Node.prototype.appendChild

    const overlay = document.createElement('div')
    overlay.style.cssText = 'position:absolute;left:0;top:0'

    const addOverlay = () => {
      shadowRootHost = apply(documentGetBody, document, [])
      const shadowRoot = apply(original_attachShadow, shadowRootHost, [
        { mode: 'closed' },
      ])
      apply(shadowRootSetInnerHtml, shadowRoot, [`<div><slot></slot></div>`])
      shadowRootNewHost = apply(documentFragmentGetChildren, shadowRoot, [])[0]
      apply(nodeAppendChild, shadowRoot, [overlay])
    }

    if (!document.body) {
      document.addEventListener('DOMContentLoaded', addOverlay)
    } else {
      addOverlay()
    }
    return overlay
  }

  const overlay = StealthOverlay()

  function appendBelowElement(el, toAppend) {
    const rect = el.getBoundingClientRect()
    const left = rect.left + window.scrollX
    const top = rect.top + window.scrollY

    SetStyle(toAppend, {
      position: 'absolute',
      zIndex: 999999,
      top: top + 'px',
      left: left + 'px',
    })

    overlay.appendChild(toAppend)
  }

  function createHoverOver(appendTo) {
    const overlayElement = document.createElement('div')
    overlay.append(overlayElement)

    updatableElements.push({ elem: overlayElement, target: appendTo })

    if (elementUpdaterInterval === -1) {
      elementUpdaterInterval = setInterval(() => {
        updatableElements.forEach(({ elem, target }) => {
          let currX, currY, currWidth, currHeight
          let { left, top, width, height } = target.getBoundingClientRect()
          left += window.scrollX
          top += window.scrollY

          SetStyle(elem, {
            pointerEvents: 'none',
            userSelect: 'none',
            position: 'absolute',
            zIndex: 999999,
            top: top + 'px',
            left: left + 'px',
            width: width + 'px',
            height: height - 10 + 'px',
          })
        })
      }, overlayElemUpdateInterval * 1000)
    }

    return overlayElement
  }

  class QuestionsPageModell {
    GetAllQuestionsDropdown() {
      if (logElementGetting) {
        Log('getting dropdown question')
      }
      let items = document
        .getElementById('responseform')
        .getElementsByTagName('p')[0].childNodes
      let r = ''
      items.forEach(item => {
        if (item.tagName === undefined) {
          r += item.nodeValue
        }
      })
      return r
    }

    GetAllQuestionsQtext() {
      if (logElementGetting) {
        Log('getting all questions qtext')
      }
      return document
        .getElementById('responseform')
        .getElementsByClassName('qtext') // getting questions
    }

    GetAllQuestionsP() {
      if (logElementGetting) {
        Log('getting all questions by tag p')
      }
      return document.getElementById('responseform').getElementsByTagName('p')
    }

    GetFormulationClearfix() {
      if (logElementGetting) {
        Log('getting formulation clearfix lol')
      }
      return document.getElementsByClassName('formulation clearfix')
    }

    GetAnswerOptions() {
      if (logElementGetting) {
        Log('getting all answer options')
      }
      return this.GetFormulationClearfix()[0].childNodes[3].innerText
    }

    GetQuestionImages() {
      if (logElementGetting) {
        Log('getting question images')
      }
      return this.GetFormulationClearfix()[0].getElementsByTagName('img')
    }

    // this function should return the question, posible answers, and image names
    GetQuestionFromTest() {
      var questions // the important questions
      var allQuestions // all questions
      try {
        allQuestions = this.GetAllQuestionsQtext() // getting questions
        if (allQuestions.length === 0) {
          var ddq = this.GetAllQuestionsDropdown()
          if (SUtils.EmptyOrWhiteSpace(ddq)) {
            var questionData = ''
            for (var j = 0; j < allQuestions.length; j++) {
              let subAllQuestions = allQuestions[j].childNodes
              for (let i = 0; i < subAllQuestions.length; i++) {
                if (
                  subAllQuestions[i].data !== undefined &&
                  !SUtils.EmptyOrWhiteSpace(subAllQuestions[i].data)
                ) {
                  questionData += subAllQuestions[i].data + ' ' // adding text to question data
                }
              }
            }
            questions = [questionData]
          } else {
            questions = [ddq]
          }
        } else {
          questions = []
          for (let i = 0; i < allQuestions.length; i++) {
            questions.push(allQuestions[i].innerText)
          }
        }
      } catch (e) {
        Exception(e, 'script error at getting question:')
      }
      var imgNodes = '' // the image nodes for questions
      try {
        imgNodes = this.GetQuestionImages() // getting question images, if there is any
        AddImageNamesToImages(imgNodes) // adding image names to images, so its easier to search for, or even guessing
      } catch (e) {
        Log(e)
        Log('Some error with images')
      }

      questions = questions.map(item => {
        if (item) {
          return SUtils.ReplaceCharsWithSpace(item, '\n')
        }
      })

      return {
        imgnodes: imgNodes,
        allQ: allQuestions,
        q: questions,
      }
    }
  }

  class ResultsPageModell {
    GetFormulationClearfix() {
      if (logElementGetting) {
        Log('getting formulation clearfix lol')
      }
      return document.getElementsByClassName('formulation clearfix')
    }

    GetGrade(i) {
      if (logElementGetting) {
        Log('getting grade')
      }
      const fcf = QPM.GetFormulationClearfix()[i]
      return fcf.parentNode.parentNode.childNodes[0].childNodes[2].innerText
    }

    DetermineQuestionType(nodes) {
      let qtype = ''
      let i = 0

      while (i < nodes.length && qtype === '') {
        let inps = nodes[i].getElementsByTagName('input')

        if (inps.length > 0) {
          qtype = inps[0].type
        }

        i++
      }

      return qtype
    }

    GetSelectAnswer(i) {
      if (logElementGetting) {
        Log('getting selected answer')
      }
      var t = document.getElementsByTagName('select')
      if (t.length > 0) {
        return t[i].options[t[i].selectedIndex].innerText
      }
    }

    GetCurrQuestion(i) {
      if (logElementGetting) {
        Log('getting curr questions by index: ' + i)
      }
      return document.getElementsByTagName('form')[0].childNodes[0].childNodes[
        i
      ].childNodes[1].childNodes[0].innerText
    }

    GetFormResult() {
      if (logElementGetting) {
        Log('getting form result')
      }
      var t = document.getElementsByTagName('form')[0].childNodes[0].childNodes
      if (t.length > 0 && t[0].tagName === undefined) {
        // debreceni moodle
        return document.getElementsByTagName('form')[1].childNodes[0].childNodes
      } else {
        return t
      }
    }

    getGeneralFeedback(i) {
      return document.getElementsByClassName('generalfeedback')[0]
    }

    GetAnswerNode(i) {
      if (logElementGetting) {
        Log('getting answer node')
      }

      var results = this.GetFormResult() // getting results element

      var r = results[i].getElementsByClassName('answer')[0].childNodes
      var ret = []
      for (var j = 0; j < r.length; j++) {
        if (
          r[j].tagName !== undefined &&
          r[j].tagName.toLowerCase() === 'div'
        ) {
          ret.push(r[j])
        }
      }

      let qtype = this.DetermineQuestionType(ret)

      return {
        nodes: ret,
        type: qtype,
      }
    }

    getTextAreaAnswer() {
      const a = document.getElementsByClassName('generalfeedback')
      if (a.length > 0) {
        return a[0].innerText
      }
    }

    GetCurrentAnswer(i) {
      if (logElementGetting) {
        Log('getting curr answer by index: ' + i)
      }
      var results = this.GetFormResult() // getting results element
      var t = results[i]
        .getElementsByClassName('formulation clearfix')[0]
        .getElementsByTagName('span')
      if (t.length > 2) {
        return t[1].innerHTML.split('<br>')[1]
      }
    }

    GetQText(i) {
      if (logElementGetting) {
        Log('getting qtext by index: ' + i)
      }
      var results = this.GetFormResult() // getting results element
      return results[i].getElementsByClassName('qtext')
    }

    GetDropboxes(i) {
      if (logElementGetting) {
        Log('getting dropboxes by index: ' + i)
      }
      var results = this.GetFormResult() // getting results element
      return results[i].getElementsByTagName('select')
    }

    GetAllAnswer(index) {
      if (logElementGetting) {
        Log('getting all answers, ind: ' + index)
      }
      return document.getElementsByClassName('answer')[index].childNodes
    }

    GetPossibleAnswers(i) {
      if (logElementGetting) {
        Log('getting possible answers')
      }
      var results = this.GetFormResult() // getting results element
      var items = results[i].getElementsByTagName('label')
      var r = []
      for (var j = 0; j < items.length; j++) {
        const TryGetCorrect = j => {
          var cn = items[j].parentNode.className
          if (cn.includes('correct')) {
            return cn.includes('correct') && !cn.includes('incorrect')
          }
        }
        r.push({
          value: items[j].innerText,
          iscorrect: TryGetCorrect(j),
        })
      }
      return r
    }

    GetAnswersFromGrabBox(i) {
      try {
        if (logElementGetting) {
          Log('testing if question is grab-box')
        }
        let results = this.GetFormResult() // getting results element
        let t = results[i].getElementsByClassName('dragitems')[0].childNodes
        if (t.length !== 1) {
          Log('grab box drag items group length is not 1!')
          Log(results[i].getElementsByClassName('dragitems')[0])
        }
        let placedItems = t[0].getElementsByClassName('placed')
        let res = []
        for (let i = 0; i < placedItems.length; i++) {
          let item = placedItems[i]
          res.push({
            text: item.innerText,
            left: item.style.left,
            top: item.style.top,
          })
        }
        return res
      } catch (e) {
        if (showErrors) {
          console.info(e)
        }
      }
    }

    GetRightAnswerIfCorrectShown(i) {
      if (logElementGetting) {
        Log('getting right answer if correct shown')
      }
      var results = this.GetFormResult() // getting results element
      return results[i].getElementsByClassName('rightanswer')
    }

    GetWrongAnswerIfCorrectNotShown(i) {
      if (logElementGetting) {
        Log('getting wrong answer if correct not shown')
      }
      var results = this.GetFormResult() // getting results element
      var n = results[i].getElementsByTagName('i')[0].parentNode
      if (n.className.includes('incorrect')) {
        return results[i].getElementsByTagName('i')[0].parentNode.innerText
      } else {
        return ''
      }
    }

    GetRightAnswerIfCorrectNotShown(i) {
      if (logElementGetting) {
        Log('Getting right answer if correct not shown')
      }
      var results = this.GetFormResult() // getting results element
      var n = results[i].getElementsByTagName('i')[0].parentNode
      if (
        n.className.includes('correct') &&
        !n.className.includes('incorrect')
      ) {
        return results[i].getElementsByTagName('i')[0].parentNode.innerText
      }
    }

    GetFormCFOfResult(result) {
      if (logElementGetting) {
        Log('getting formulation clearfix')
      }
      return result.getElementsByClassName('formulation clearfix')[0]
    }

    GetResultText(i) {
      if (logElementGetting) {
        Log('getting result text')
      }
      var results = this.GetFormResult() // getting results element
      return this.GetFormCFOfResult(results[i]).getElementsByTagName('p')
    }

    GetResultImage(i) {
      if (logElementGetting) {
        Log('getting result image')
      }
      var results = this.GetFormResult() // getting results element
      return this.GetFormCFOfResult(results[i]).getElementsByTagName('img')
    }

    // gets the question from the result page
    // i is the index of the question
    GetQuestionFromResult(i) {
      var temp = this.GetQText(i)
      var currQuestion = ''
      if (temp.length > 0) {
        currQuestion = temp[0].innerText // adding the question to curr question as .q
      } else {
        // this is black magic fuckery a bit
        if (this.GetDropboxes(i).length > 0) {
          var allNodes = this.GetResultText(i)
          currQuestion = ''
          for (var k = 0; k < allNodes.length; k++) {
            var allQuestions = this.GetResultText(i)[k].childNodes
            for (var j = 0; j < allQuestions.length; j++) {
              if (
                allQuestions[j].data !== undefined &&
                !SUtils.EmptyOrWhiteSpace(allQuestions[j].data)
              ) {
                currQuestion += allQuestions[j].data + ' '
              }
            }
          }
        } else {
          try {
            currQuestion = this.GetCurrQuestion(i)
          } catch (e) {
            currQuestion = 'REEEEEEEEEEEEEEEEEEEEE' // this shouldnt really happen sry guys
            Log('Unable to get question in GetQuestionFromResult')
          }
        }
      }
      return currQuestion
    }

    GetRightAnswerFromResult(i) {
      let res = this.GetRightAnswerFromResultv2(i)
      if (!res) {
        res = this.GetRightAnswerFromResultv1(i)
      }
      return res
    }

    // tries to get right answer from result page
    // i is the index of the question
    GetRightAnswerFromResultv1(i) {
      var fun = []

      // "húzza oda ..." skip
      fun.push(i => {
        let temp = RPM.GetAnswersFromGrabBox(i)
        return temp
          .map(x => {
            return x.text
          })
          .join(', ')
      })

      // the basic type of getting answers
      fun.push(i => {
        var temp = RPM.GetRightAnswerIfCorrectShown(i) // getting risht answer
        if (temp.length > 0) {
          return temp[0].innerText
        } // adding the answer to curr question as .a
      })

      // if there is dropdown list in the current question
      fun.push(i => {
        if (RPM.GetDropboxes(i).length > 0) {
          return RPM.GetCurrentAnswer(i)
        }
      })

      // if the correct answers are not shown, and the selected answer
      // is correct
      fun.push(i => {
        return RPM.GetRightAnswerIfCorrectNotShown(i)
      })

      // if there is dropbox in the question
      fun.push(i => {
        return RPM.GetSelectAnswer(i)
      })

      // if the correct answers are not shown, and the selected answer
      // is incorrect, and there are only 2 options
      fun.push(i => {
        var possibleAnswers = RPM.GetPossibleAnswers(i)
        if (possibleAnswers.length === 2) {
          for (var k = 0; k < possibleAnswers.length; k++) {
            if (possibleAnswers[k].iscorrect === undefined) {
              return possibleAnswers[k].value
            }
          }
        }
      })

      // if everything fails
      fun.push(i => {
        return undefined
      })

      var j = 0
      var currAnswer
      while (j < fun.length && SUtils.EmptyOrWhiteSpace(currAnswer)) {
        try {
          currAnswer = fun[j](i)
        } catch (e) {
          if (showErrors) {
            console.info(e)
          }
        }
        j++
      }

      return currAnswer
    }

    GuessCorrectIn2LengthAnswersByIncorrect(items) {
      const first = items[0]
      const second = items[1]
      if (first.className.includes('incorrect')) {
        return second.innerText
      }
      if (second.className.includes('incorrect')) {
        return first.innerText
      }
    }

    GuessCorrectIn2LengthAnswersByPoints(i, items) {
      const first = {
        elem: items[0],
        val: items[0].childNodes[0].checked,
        text: items[0].innerText,
      }
      const second = {
        elem: items[1],
        val: items[1].childNodes[0].checked,
        text: items[1].innerText,
      }

      const grade = RPM.GetGrade(i) // 1,00 közül 1,00 leosztályozva
      const grades = grade.split(' ').reduce((acc, text) => {
        if (text.includes(',')) {
          // FIXME: fancy regexp
          acc.push(parseInt(text))
        } else if (text.includes('.')) {
          // FIXME: fancy regexp
          acc.push(parseInt(text))
        }
        return acc
      }, [])

      if (grades[0] === 1) {
        if (first.val) {
          return first.text
        } else {
          return second.text
        }
      } else {
        if (!first.val) {
          return first.text
        } else {
          return second.text
        }
      }
    }

    // version 2 of getting right answer from result page
    // i is the index of the question
    GetRightAnswerFromResultv2(i) {
      try {
        var answerNodes = this.GetAnswerNode(i)
        let items = answerNodes.nodes
        const generalfeedback = this.getGeneralFeedback(i)

        if (generalfeedback) {
          return generalfeedback.innerText
        }

        if (answerNodes.type === 'checkbox') {
          return RPM.GetRightAnswerFromResultv1(i)
        }

        for (let j = 0; j < items.length; j++) {
          let cn = items[j].className
          if (cn.includes('correct') && !cn.includes('incorrect')) {
            return items[j].getElementsByTagName('label')[0].innerText
          }
        }
        if (items.length === 2) {
          const resByIncorrect = this.GuessCorrectIn2LengthAnswersByIncorrect(
            items
          )
          if (!resByIncorrect) {
            const resPoints = this.GuessCorrectIn2LengthAnswersByPoints(
              i,
              items
            )
            return resPoints
          }
          return resByIncorrect
        }
      } catch (e) {
        Log('error at new nodegetting, trying the oldschool way')
        if (showErrors) {
          console.info(e)
        }
      }
    }
  }

  class MiscPageModell {
    GetCurrentSubjectName() {
      if (logElementGetting) {
        Log('getting current subjects name')
      }
      return (
        document.getElementById('page-header').innerText.split('\n')[0] || ''
      )
    }

    GetVideo() {
      if (logElementGetting) {
        Log('getting video stuff')
      }
      return document.getElementsByTagName('video')[0]
    }

    GetVideoElement() {
      if (logElementGetting) {
        Log('getting video element')
      }
      return document.getElementById('videoElement').parentNode
    }

    GetInputType(answers, i) {
      if (logElementGetting) {
        Log('getting input type')
      }
      return answers[i].getElementsByTagName('input')[0].type
    }
  }

  var QPM = new QuestionsPageModell()
  var RPM = new ResultsPageModell()
  var MPM = new MiscPageModell()

  // : }}}

  // : Main function {{{
  let timerStarted = false

  // window.addEventListener("load", () => {})
  Main()

  function Main() {
    'use strict'
    console.log('Moodle / E-Learning script')
    console.time('main')
    timerStarted = true

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', Init)
    } else {
      Init()
    }
  }

  function AfterLoad() {
    const url = location.href // eslint-disable-line

    try {
      if (
        (url.includes('/quiz/') && url.includes('attempt.php')) ||
        forceTestPage
      ) {
        // if the current page is a test
        HandleQuiz()
      } else if (
        (url.includes('/quiz/') && url.includes('review.php')) ||
        forceResultPage
      ) {
        // if the current window is a test-s result
        HandleResults(url)
      } else if (
        (!url.includes('/quiz/') &&
          !url.includes('review.php') &&
          !url.includes('.pdf')) ||
        forceDefaultPage
      ) {
        // if the current window is any other window than a quiz or pdf.
        HandleUI(url)
      }
    } catch (e) {
      ShowMessage(
        {
          m: texts.fatalError,
          isSimple: true,
        },
        undefined,
        () => {
          OpenErrorPage(e)
        }
      )

      Exception(e, 'script error at main:')
    }
    if (url.includes('eduplayer')) {
      AddVideoHotkeys(url)
    } // adding video hotkeys
    Log(texts.consoleErrorInfo)

    if (timerStarted) {
      console.log('Moodle Test Script run time:')
      console.timeEnd('main')
      timerStarted = false
    }

    if (forceTestPage || forceResultPage || forceDefaultPage) {
      if (overlay.querySelector('#scriptMessage')) {
        overlay.querySelector('#scriptMessage').style.background = 'green'
      }
    }
  }
  // : }}}

  // : Main logic stuff {{{

  // : Loading {{{
  function HandleQminingSite(url) {
    try {
      const idInput = document.getElementById('cid')
      if (idInput) {
        idInput.value = getVal('clientId')
      }
    } catch (e) {
      console.info('Error filling client ID input', e)
    }
    try {
      const sideLinks = document.getElementById('sideBarLinks')
      if (!sideLinks) {
        return
      }
      Array.from(sideLinks.childNodes).forEach(link => {
        link.addEventListener('mousedown', () => {
          FillFeedbackCID(url, link)
        })
      })

      FillFeedbackCID(
        url,
        document
          .getElementById('sideBarLinks')
          .getElementsByClassName('active')[0]
      )
    } catch (e) {
      console.info('Error filling client ID input', e)
    }
  }

  function FillFeedbackCID(url, link) {
    try {
      if (link.id === 'feedback') {
        const cidSetInterval = setInterval(() => {
          const cid = document.getElementById('cid')
          if (cid) {
            cid.value = GetId() + '|' + info().script.version
            window.clearInterval(cidSetInterval)
          }
        }, 100)
      }
    } catch (e) {
      console.info('Error filling client ID input', e)
    }
  }

  function Init() {
    const url = location.href // eslint-disable-line

    if (url.includes(serverAdress.split('/')[2])) {
      HandleQminingSite(url)
      return
    }

    // if (false) {
    //     // eslint-disable-line
    //     setVal("version16", undefined);
    //     setVal("version15", undefined);
    //     setVal("firstRun", undefined);
    //     setVal("showQuestions", undefined);
    //     setVal("showSplash", undefined);
    // }
    // --------------------------------------------------------------------------------------
    // event listener fuckery
    // --------------------------------------------------------------------------------------
    try {
      // adding addeventlistener stuff, for the ability to add more event listeners for the same event
      addEventListener = (function() {
        if (document.addEventListener) {
          return function(element, event, handler) {
            element.addEventListener(event, handler, false)
          }
        } else {
          return function(element, event, handler) {
            element.attachEvent('on' + event, handler)
          }
        }
      })()
    } catch (e) {
      Exception(e, 'script error at addEventListener:')
    }
    VersionActions()
    if (!url.includes('.pdf')) {
      ShowMenu()
    }
    ConnectToServer(AfterLoad)
  }

  function Auth(pw) {
    SendXHRMessage('login', { pw: pw, script: true }).then(res => {
      if (res.result === 'success') {
        ConnectToServer(AfterLoad)
        ClearAllMessages()
        resetMenu()
      } else {
        SafeGetElementById('infoMainDiv', elem => {
          elem.innerText = texts.invalidPW + pw
        })
      }
    })
  }

  function resetMenu() {
    SafeGetElementById('menuButtonDiv', elem => {
      elem.style.backgroundColor = '#262626'
    })
    SafeGetElementById('ircButton', elem => {
      elem.style.display = 'none'
    })
    SafeGetElementById('retryButton', elem => {
      elem.style.display = 'none'
    })
    SafeGetElementById('loginDiv', elem => {
      elem.style.display = 'none'
    })
    SafeGetElementById('infoMainDiv', elem => {
      elem.innerText = texts.loading
    })
  }

  function ConnectToServer(cwith) {
    ClearAllMessages()
    GetXHRInfos()
      .then(inf => {
        if (inf.result === 'nouser') {
          NoUserAction()
          return
        }
        lastestVersion = inf.version
        motd = inf.motd
        userSpecificMotd = inf.userSpecificMotd
        subjInfo = inf.subjinfo
        uid = inf.uid
        cid = getVal('clientId')
        overlay.querySelector(
          '#infoMainDiv'
        ).innerText = `${subjInfo.subjects} tárgy, ${subjInfo.questions} kérdés. User ID: ${uid}`
        // FIXME: if cwith() throws an unhandled error it sais server is not avaible
        cwith()
      })
      .catch(() => {
        NoServerAction()
      })
  }

  function NoUserAction() {
    SafeGetElementById('menuButtonDiv', elem => {
      elem.style.backgroundColor = '#44cc00'
    })
    SafeGetElementById('infoMainDiv', elem => {
      elem.innerText = texts.noUser
      if (getVal('clientId')) {
        elem.innerText += ` (${getVal('clientId')})`
      }
    })
    SafeGetElementById('loginDiv', elem => {
      elem.style.display = ''
    })
  }

  function NoServerAction() {
    SafeGetElementById('menuButtonDiv', elem => {
      elem.style.backgroundColor = 'red'
    })
    SafeGetElementById('infoMainDiv', elem => {
      elem.innerText = texts.noServer
    })
    SafeGetElementById('ircButton', elem => {
      elem.style.display = ''
    })
    SafeGetElementById('retryButton', elem => {
      elem.style.display = ''
    })
    Log(texts.noServerConsoleMessage)
  }

  function VersionActions() {
    // FOR TESTING ONLY
    // setVal("version15", true);
    // setVal("firstRun", true);
    // setVal("version16", true);
    // throw "asd";

    FreshStart()
  }

  // : Version action functions {{{

  function FreshStart() {
    var firstRun = getVal('firstRun') // if the current run is the frst
    if (firstRun === undefined || firstRun === true) {
      setVal('firstRun', false)
      ShowHelp() // showing help

      document.write(texts.freshStartWarning)
      document.close()
      throw new Error('something, so this stuff stops')
    }
  }

  // : }}}

  // : UI handling {{{
  function HandleUI(url) {
    // FIXME: normal string building with localisation :/
    var newVersion = false // if the script is newer than last start

    try {
      newVersion = info().script.version !== getVal('lastVerson')
    } catch (e) {
      Log('Some weird error trying to set new verison')
    }

    let showMOTD = false
    if (!SUtils.EmptyOrWhiteSpace(motd)) {
      var prevmotd = getVal('motd')
      if (prevmotd !== motd) {
        showMOTD = true
        setVal('motdcount', motdShowCount)
        setVal('motd', motd)
      } else {
        var motdcount = getVal('motdcount')
        if (motdcount === undefined) {
          setVal('motdcount', motdShowCount)
          motdcount = motdShowCount
        }

        motdcount--
        if (motdcount > 0) {
          showMOTD = true
          setVal('motdcount', motdcount)
        }
      }
    }
    const showUserSpecificMOTD = !!userSpecificMotd

    let isNewVersionAvaible =
      lastestVersion !== undefined && info().script.version !== lastestVersion
    var greetMsg = '' // message to show at the end
    var timeout = null // the timeout. if null, it wont be hidden

    if (isNewVersionAvaible || newVersion || showMOTD || showUserSpecificMOTD) {
      greetMsg =
        'Moodle/Elearning/KMOOC segéd v. ' + info().script.version + '. '
    }
    if (isNewVersionAvaible) {
      timeout = 5
      greetMsg += 'Új verzió elérhető: ' + lastestVersion
      timeout = undefined
    }
    if (newVersion) {
      // --------------------------------------------------------------------------------------------------------------
      greetMsg +=
        'Verzió frissítve ' +
        info().script.version +
        '-re. Changelog:\n' +
        texts.lastChangeLog
      setVal('lastVerson', info().script.version) // setting lastVersion
    }
    if (showMOTD) {
      greetMsg += '\nMOTD:\n' + motd
      timeout = null
    }
    if (showUserSpecificMOTD) {
      greetMsg += '\nFelhasználó MOTD (ezt csak te látod):\n' + userSpecificMotd
      timeout = null
    }

    ShowMessage(
      {
        m: greetMsg,
        isSimple: true,
      },
      timeout
    ) // showing message. If "m" is empty it wont show it, thats how showSplash works.
  }

  // : }}}

  // : Answering stuffs {{{

  function HandleQuiz() {
    var q = QPM.GetQuestionFromTest()
    var questions = q.q
    var imgNodes = q.imgnodes
    // ------------------------------------------------------------------------------------------------------
    let promises = []
    questions.forEach(x => {
      let question = SUtils.EmptyOrWhiteSpace(x)
        ? ''
        : SUtils.RemoveUnnecesarySpaces(x) // simplifying question
      promises.push(
        GetXHRQuestionAnswer({
          q: question,
          data: GetImageDataFromImgNodes(imgNodes),
          subj: MPM.GetCurrentSubjectName(),
        })
      )
    })

    Promise.all(promises).then(res => {
      let answers = []

      res.forEach((result, j) => {
        var r = PrepareAnswers(result, j)
        if (r !== undefined) {
          answers.push(r)
        }
        HighLightAnswer(result, j) // highlights the answer for the current result
      })

      ShowAnswers(answers, q.q)
    })
  }

  function PrepareAnswers(result, j) {
    assert(result)

    if (result.length > 0) {
      var allMessages = [] // preparing all messages
      for (var k = 0; k < result.length; k++) {
        var msg = '' // the current message
        if (getVal('showQuestions') === undefined || getVal('showQuestions')) {
          msg += result[k].q.Q + '\n' // adding the question if yes
        }
        msg += result[k].q.A.replace(/, /g, '\n') // adding answer
        if (result[k].q.data.type === 'image') {
          msg +=
            '\n\nKépek fenti válaszok sorrendjében: ' +
            result[k].q.data.images.join(', ') // if it has image part, adding that too
        }
        if (
          result[k].detailedMatch &&
          result[k].detailedMatch.matchedSubjName
        ) {
          msg += '\n(Tárgy: ' + result[k].detailedMatch.matchedSubjName + ')'
        }
        allMessages.push({
          m: msg,
          p: result[k].match,
        })
      }
      return allMessages
    }
  }

  function ShowAnswers(answers, question) {
    assert(answers)

    if (answers.length > 0) {
      // if there are more than 0 answer
      ShowMessage(answers)
    } else {
      ShowMessage(
        {
          m: texts.noResult,
          isSimple: true,
        },
        undefined,
        function() {
          OpenErrorPage({
            message: 'No result found',
            question: Array.isArray(question)
              ? question[0].replace(/"/g, '').replace(/:/g, '')
              : question,
          })
        }
      )
    }
  }

  // : }}}

  // : Quiz saving {{{

  function HandleResults(url) {
    SaveQuiz(GetQuiz(), ShowSaveQuizDialog) // saves the quiz questions and answers
  }

  function ShowSaveQuizDialog(sendResult, sentData, newQuestions) {
    // FIXME: normal string building with localisation :/
    var msg = ''
    if (sendResult) {
      msg = 'Kérdések elküldve, katt az elküldött adatokért.'
      if (newQuestions > 0) {
        msg += ' ' + newQuestions + ' új kérdés'
      } else {
        msg += ' Nincs új kérdés'
      }
    } else {
      msg =
        'Szerver nem elérhető, vagy egyéb hiba kérdések elküldésénél! (F12 -> Console)'
    }
    // showing a message wit the click event, and the generated page
    ShowMessage(
      {
        m: msg,
        isSimple: true,
      },
      null,
      function() {
        let towrite = ''
        try {
          towrite += '</p>Elküldött adatok:</p> ' + JSON.stringify(sentData)
        } catch (e) {
          towrite += '</p>Elküldött adatok:</p> ' + sentData
        }
        document.write(towrite)
        document.close()
      }
    )
  }

  // this should get the image url from a result page
  // i is the index of the question
  // FIXME: move this to RPM class ??? and refactor this
  function GetImageFormResult(i) {
    try {
      var imgElements = RPM.GetResultImage(i) // trying to get image
      var imgURL = [] // image urls
      for (var j = 0; j < imgElements.length; j++) {
        if (!imgElements[j].src.includes('brokenfile')) {
          var filePart = imgElements[j].src.split('/') // splits the link by "/"
          filePart = filePart[filePart.length - 1] // the last one is the image name
          imgURL.push(decodeURI(SUtils.ShortenString(filePart, 30)))
        }
      }
      if (imgURL.length > 0) {
        return imgURL
      }
    } catch (e) {
      Log("Couldn't get images from result")
    }
  }

  function GetDataFormResult(i) {
    let data = { type: 'simple' }

    let img = GetImageFormResult(i)
    let grabbox = RPM.GetAnswersFromGrabBox(i)
    if (img) {
      data = {
        type: 'image',
        images: img,
      }
    }
    if (grabbox) {
      data = {
        type: 'grabbox',
        images: img,
        grabbox: grabbox,
      }
    }

    return data
  }

  // saves the current quiz. questionData contains the active subjects questions
  function SaveQuiz(quiz, next) {
    try {
      let sentData = {}
      if (quiz.length === 0) {
        throw new Error('quiz length is zero!')
      }
      try {
        try {
          sentData.subj = MPM.GetCurrentSubjectName()
        } catch (e) {
          sentData.subj = 'NOSUBJ'
          Log('unable to get subject name :c')
        }
        sentData.version = info().script.version
        sentData.id = GetId()
        sentData.quiz = quiz
        console.log('SENT DATA', sentData)
        SendXHRMessage('isAdding', sentData).then(res => {
          next(res.success, sentData, res.newQuestions)
        })
      } catch (e) {
        Exception(e, 'error at sending data to server.')
      }
    } catch (e) {
      Exception(e, 'script error at saving quiz')
    }
  }

  // getting quiz from finish page
  function GetQuiz() {
    try {
      var quiz = [] // final quiz stuff
      var results = RPM.GetFormResult() // getting results element
      for (var i = 0; i < results.length - 2; i++) {
        var question = {} // the current question
        // QUESTION --------------------------------------------------------------------------------------------------------------------
        question.Q = RPM.GetQuestionFromResult(i)
        // RIGHTANSWER ---------------------------------------------------------------------------------------------------------------------
        question.A = RPM.GetRightAnswerFromResult(i)
        // DATA ---------------------------------------------------------------------------------------------------------------------
        question.data = GetDataFormResult(i)

        if (question.A !== undefined) {
          quiz.push(question) // adding current question to quiz
        } else {
          Log(
            'error getting queston, no correct answer given, or its incorrect'
          )
          Log(question)
        }
      }
      return quiz
    } catch (e) {
      Exception(e, 'script error at quiz parsing:')
    }
  }

  // : }}}

  // : Helpers {{{

  function GetImageDataFromImgNodes(imgs) {
    var questionImages = [] // the array for the image names in question
    for (var i = 0; i < imgs.length; i++) {
      if (!imgs[i].src.includes('brokenfile')) {
        var filePart = imgs[i].src.split('/') // splits the link by "/"
        filePart = filePart[filePart.length - 1] // the last one is the image name
        questionImages.push(
          decodeURI(
            SUtils.RemoveUnnecesarySpaces(SUtils.ShortenString(filePart, 30))
          )
        ) // decodes uri codes, and removes exess spaces, and shortening it
      }
    }
    if (questionImages.length > 0) {
      return {
        type: 'image',
        images: questionImages,
      }
    } else {
      return {
        type: 'simple',
      }
    }
  }

  // adds image names to image nodes
  function AddImageNamesToImages(imgs) {
    for (var i = 0; i < imgs.length; i++) {
      if (!imgs[i].src.includes('brokenfile')) {
        // TODO: add this to shadowroot
        var filePart = imgs[i].src.split('/') // splits the link by "/"
        // console.log(imgs[i].src.split("base64,")[1])
        // TODO: base64
        filePart = filePart[filePart.length - 1] // the last one is the image name
        var appendTo = imgs[i].parentNode // it will be appended here
        var mainDiv = document.createElement('div')
        var fileName = SUtils.ShortenString(decodeURI(filePart), 15) // shortening name, couse it can be long as fuck
        var textNode = document.createTextNode('(' + fileName + ')')
        mainDiv.appendChild(textNode)
        appendBelowElement(appendTo, mainDiv)
      }
    }
  }

  // this function adds basic hotkeys for video controll.
  function AddVideoHotkeys(url) {
    var seekTime = 20
    document.addEventListener('keydown', function(e) {
      try {
        var video = MPM.GetVideo()
        var keyCode = e.keyCode // getting keycode
        if (keyCode === 32) {
          // if the keycode is 32 (space)
          e.preventDefault() // preventing default action (space scrolles down)
          if (video.paused && video.buffered.length > 0) {
            video.play()
          } else {
            video.pause()
          }
        }
        if (keyCode === 39) {
          // rigth : 39
          video.currentTime += seekTime
        }
        if (keyCode === 37) {
          // left : 37
          video.currentTime -= seekTime
        }
      } catch (err) {
        Log('Hotkey error.')
        Log(err.message)
      }
    })
    var toadd = MPM.GetVideoElement()
    var node = CreateNodeWithText(toadd, texts.videoHelp)
    node.style.margin = '5px 5px 5px 5px' // fancy margin
  }

  // removes stuff like " a. q1" -> "q1"
  function RemoveLetterMarking(inp) {
    let dotIndex = inp.indexOf('.')
    let doubledotIndex = inp.indexOf(':')
    let maxInd = 4 // inp.length * 0.2;

    if (dotIndex < maxInd) {
      return SUtils.RemoveUnnecesarySpaces(
        inp.substr(inp.indexOf('.') + 1, inp.length)
      )
    } else if (doubledotIndex < maxInd) {
      return SUtils.RemoveUnnecesarySpaces(
        inp.substr(inp.indexOf(':') + 1, inp.length)
      )
    } else {
      return inp
    }
  }

  // highlights the possible solutions to the current question
  function HighLightAnswer(results, currQuestionNumber) {
    try {
      if (results.length > 0) {
        var answers = RPM.GetAllAnswer(currQuestionNumber) // getting all answers
        var toColor = [] // the numberth in the array will be colored, and .length items will be colored
        var type = '' // type of the question. radio or ticbox or whatitscalled
        for (let i = 0; i < answers.length; i++) {
          // going thtough answers
          if (
            answers[i].tagName &&
            answers[i].tagName.toLowerCase() === 'div'
          ) {
            // if its not null and is "div"
            var correct = results[0].q.A.toLowerCase() // getting current correct answer from data
            var answer = answers[i].innerText.replace(/\n/g, '').toLowerCase() // getting current answer

            // removing stuff like "a."
            answer = RemoveLetterMarking(answer)

            if (
              SUtils.EmptyOrWhiteSpace(correct) ||
              SUtils.EmptyOrWhiteSpace(answer)
            ) {
              continue
            }

            if (
              SUtils.NormalizeSpaces(
                SUtils.RemoveUnnecesarySpaces(correct)
              ).includes(answer)
            ) {
              // if the correct answer includes the current answer
              toColor.push(i) // adding the index
              type = MPM.GetInputType(answers, i) // setting the type
            }
          }
        }
        if (results[0].match === 100) {
          // if the result is 100% correct
          if (type !== 'radio' || toColor.length === 1) {
            // FIXME why not radio
            for (let i = 0; i < toColor.length; i++) {
              // going through "toColor"
              let highlight = createHoverOver(answers[toColor[i]])
              Object.assign(highlight.style, {
                border: '4px solid rgba(100, 240, 100, 0.8)',
                borderRadius: '10px',
              })
            }
          }
        } // and coloring the correct index
      }
    } catch (e) {
      // catching errors. Sometimes there are random errors, wich i did not test, but they are rare, and does not break the main script.
      Log('script error at highlightin answer: ' + e.message)
    }
  }

  // : }}}

  function Log(value) {
    if (log) {
      console.log(value)
    }
  }

  function Exception(e, msg) {
    Log('------------------------------------------')
    Log(msg)
    Log(e.message)
    Log('------------------------------------------')
    Log(e.stack)
    Log('------------------------------------------')
  }

  // : }}}

  // : Minor UI stuff {{{
  function ClearAllMessages() {
    overlay.querySelectorAll('#scriptMessage').forEach(x => x.remove())
  }

  // shows a message with "msg" text, "matchPercent" tip and transp, and "timeout" time
  function ShowMessage(msgItem, timeout, funct) {
    // msgItem help:
    // [ [ {}{}{}{} ] [ {}{}{} ] ]
    // msgItem[] <- a questions stuff
    // msgItem[][] <- a questions relevant answers array
    // msgItem[][].p <- a questions precent
    // msgItem[][].m <- a questions message
    try {
      var defMargin = '0px 5px 0px 5px'
      var isSimpleMessage = false
      var simpleMessageText = ''
      if (msgItem.isSimple) {
        // parsing msgItem for easier use
        simpleMessageText = msgItem.m
        if (simpleMessageText === '') {
          // if msg is empty
          return
        }
        msgItem = [
          [
            {
              m: simpleMessageText,
            },
          ],
        ]
        isSimpleMessage = true
      }

      var appedtTo = overlay // will be appended here
      var width = window.innerWidth - window.innerWidth / 6 // with of the box
      var startFromTop = 25 // top distance

      var mainDiv = document.createElement('div') // the main divider, wich items will be attached to
      mainDiv.setAttribute('id', 'messageMainDiv')
      if (funct) {
        // if there is a function as parameter
        addEventListener(mainDiv, 'click', funct) // adding it as click
      }
      // lotsa crap style
      SetStyle(mainDiv, {
        position: 'fixed',
        zIndex: 999999,
        textAlign: 'center',
        width: width + 'px',
        padding: '0px',
        background: '#222d32',
        color: '#ffffff',
        border: '3px solid #99f',
        borderRadius: '5px',
        top: startFromTop + 'px',
        left: (window.innerWidth - width) / 2 + 'px',
        opacity: '1',
        cursor: 'move',
      })
      mainDiv.setAttribute('id', 'scriptMessage')
      // ------------------------------------------------------------------
      // moving msg
      // ------------------------------------------------------------------
      let isMouseDown = false
      let offset = [0, 0]
      let mousePosition
      mainDiv.addEventListener('mousedown', e => {
        isMouseDown = true
        offset = [mainDiv.offsetLeft - e.clientX, mainDiv.offsetTop - e.clientY]
      })
      mainDiv.addEventListener('mouseup', e => {
        isMouseDown = false
      })
      mainDiv.addEventListener('mousemove', e => {
        if (isMouseDown) {
          mousePosition = {
            x: e.clientX,
            y: e.clientY,
          }
          mainDiv.style.left = mousePosition.x + offset[0] + 'px'
          mainDiv.style.top = mousePosition.y + offset[1] + 'px'
        }
      })

      const xrow = document.createElement('div')
      SetStyle(xrow, {
        height: '20px',
        display: 'flex',
        justifyContent: 'flex-end',
      })
      mainDiv.appendChild(xrow)

      const xButton = CreateNodeWithText(xrow, '❌', 'div')
      SetStyle(xButton, {
        margin: '5px',
        cursor: 'pointer',
      })
      xButton.addEventListener('mousedown', e => {
        e.stopPropagation()
        mainDiv.parentNode.removeChild(mainDiv)
      })

      // ------------------------------------------------------------------
      var matchPercent = msgItem[0][0].p
      if (isSimpleMessage) {
        var simpleMessageParagrapg = document.createElement('p') // new paragraph
        simpleMessageParagrapg.style.margin = defMargin // fancy margin

        var mesageNode = document.createElement('p') // new paragraph
        mesageNode.innerHTML = simpleMessageText.replace(/\n/g, '</br>')
        simpleMessageParagrapg.appendChild(mesageNode)
        SetStyle(mesageNode, {
          margin: defMargin,
        })

        Array.from(mesageNode.getElementsByTagName('a')).forEach(anchorElem => {
          anchorElem.style.color = 'lightblue'
        })

        mainDiv.appendChild(simpleMessageParagrapg) // adding text box to main div
      } else {
        // if its a fucking complicated message
        // TABLE SETUP ------------------------------------------------------------------------------------------------------------
        var table = document.createElement('table')
        table.style.width = '100%'
        // ROWS -----------------------------------------------------------------------------------------------------
        var rowOne = table.insertRow() // previous suggestion, question text, and prev question
        var rowTwo = table.insertRow() // next question button
        var rowThree = table.insertRow() // next suggetsion button
        // CELLS -----------------------------------------------------------------------------------------------------
        // row one
        var numberTextCell = rowOne.insertCell()
        var questionCell = rowOne.insertCell() // QUESTION CELL
        questionCell.setAttribute('id', 'questionCell')
        questionCell.rowSpan = 3
        questionCell.style.width = '90%'
        var prevQuestionCell = rowOne.insertCell()
        // row two
        var percentTextCell = rowTwo.insertCell()
        var nextQuestionCell = rowTwo.insertCell()
        // row three
        var prevSuggestionCell = rowThree.insertCell()
        var nextSuggestionCell = rowThree.insertCell()
        // adding finally
        mainDiv.appendChild(table)
        // PERCENT TEXT SETUP -----------------------------------------------------------------------------------------------------
        var percentTextBox = CreateNodeWithText(percentTextCell, '')
        percentTextBox.setAttribute('id', 'percentTextBox')

        if (matchPercent) {
          // if match percent param is not null
          percentTextBox.innerText = matchPercent + '%'
        }
        // NUMBER SETUP -----------------------------------------------------------------------------------------------------
        var numberTextBox = CreateNodeWithText(numberTextCell, '1.')
        numberTextBox.setAttribute('id', 'numberTextBox')

        // ANSWER NODE SETUP -------------------------------------------------------------------------------------------------------------
        var questionTextElement = CreateNodeWithText(
          questionCell,
          'ur question goes here, mister OwO'
        )

        questionTextElement.addEventListener('mousedown', e => {
          e.stopPropagation()
        })

        SetStyle(questionTextElement, {
          cursor: 'auto',
        })

        questionTextElement.setAttribute('id', 'questionTextElement')

        // BUTTON SETUP -----------------------------------------------------------------------------------------------------------
        var currItem = 0
        var currRelevantQuestion = 0

        const GetRelevantQuestion = () => {
          // returns the currItemth questions currRelevantQuestionth relevant question
          return msgItem[currItem][currRelevantQuestion]
        }

        const ChangeCurrItemIndex = to => {
          currItem += to
          if (currItem < 0) {
            currItem = 0
          }
          if (currItem > msgItem.length - 1) {
            currItem = msgItem.length - 1
          }
          currRelevantQuestion = 0
        }

        const ChangeCurrRelevantQuestionIndex = to => {
          currRelevantQuestion += to
          if (currRelevantQuestion < 0) {
            currRelevantQuestion = 0
          }
          if (currRelevantQuestion > msgItem[currItem].length - 1) {
            currRelevantQuestion = msgItem[currItem].length - 1
          }
        }

        const SetQuestionText = () => {
          var relevantQuestion = GetRelevantQuestion()
          questionTextElement.innerText = SUtils.removeMultipleEnters(
            relevantQuestion.m
          )
          if (currItem === 0 && currRelevantQuestion === 0) {
            numberTextBox.innerText = currRelevantQuestion + 1 + '.'
          } else {
            numberTextBox.innerText =
              currItem + 1 + './' + (currRelevantQuestion + 1) + '.'
          }
          percentTextBox.innerText = relevantQuestion.p + '%'
        }

        const buttonStyle = {
          color: 'white',
          backgroundColor: 'transparent',
          margin: buttonMargin,
          border: 'none',
          fontSize: '30px',
          cursor: 'pointer',
          userSelect: 'none',
        }
        var buttonMargin = '2px 2px 2px 2px' // uniform button margin
        if (msgItem[currItem].length > 1) {
          // PREV SUGG BUTTON ------------------------------------------------------------------------------------------------------------
          var prevSuggButton = CreateNodeWithText(
            prevSuggestionCell,
            '⬅️',
            'div'
          )
          SetStyle(prevSuggButton, buttonStyle)

          prevSuggButton.addEventListener('mousedown', function(e) {
            e.stopPropagation()
            ChangeCurrRelevantQuestionIndex(-1)
            SetQuestionText()
          })
          // NEXT SUGG BUTTON ------------------------------------------------------------------------------------------------------------
          var nextSuggButton = CreateNodeWithText(
            nextSuggestionCell,
            '➡️',
            'div'
          )
          SetStyle(nextSuggButton, buttonStyle)

          nextSuggButton.addEventListener('mousedown', function(e) {
            e.stopPropagation()
            ChangeCurrRelevantQuestionIndex(1)
            SetQuestionText()
          })
        }
        // deciding if has multiple questions ------------------------------------------------------------------------------------------------
        if (msgItem.length === 1) {
          SetQuestionText()
        } else {
          // if there are multiple items to display
          // PREV QUESTION BUTTON ------------------------------------------------------------------------------------------------------------
          var prevButton = CreateNodeWithText(prevQuestionCell, '⬆️', 'div')
          SetStyle(prevButton, buttonStyle)

          // event listener
          prevButton.addEventListener('click', function() {
            ChangeCurrItemIndex(-1)
            SetQuestionText()
          })
          // NEXT QUESTION BUTTON ------------------------------------------------------------------------------------------------------------
          var nextButton = CreateNodeWithText(nextQuestionCell, '⬇️', 'div')
          SetStyle(nextButton, buttonStyle)

          // event listener
          nextButton.addEventListener('click', function() {
            ChangeCurrItemIndex(1)
            SetQuestionText()
          })
          SetQuestionText()
        }
      }
      appedtTo.appendChild(mainDiv) // THE FINAL APPEND

      // setting some events
      // addEventListener(window, 'scroll', function () {
      //   mainDiv.style.top = (pageYOffset + startFromTop) + 'px';
      // })
      addEventListener(window, 'resize', function() {
        mainDiv.style.left = (window.innerWidth - width) / 2 + 'px'
      })
      var timeOut
      if (timeout && timeout > 0) {
        // setting timeout if not zero or null
        timeOut = setTimeout(function() {
          mainDiv.parentNode.removeChild(mainDiv)
        }, timeout * 1000)
      }
      // middle click close event listener
      addEventListener(mainDiv, 'mousedown', function(e) {
        if (e.which === 2) {
          mainDiv.parentNode.removeChild(mainDiv)
          if (timeOut) {
            clearTimeout(timeOut)
          }
        }
      })
    } catch (e) {
      Exception(e, 'script error at showing message:')
    }
  }

  // shows a fancy menu
  function ShowMenu() {
    try {
      var appedtTo = overlay // will be appended here

      // mainDiv.style.left = (window.innerWidth - width) / 2 + 'px';

      var menuButtonDiv = document.createElement('div')
      menuButtonDiv.setAttribute('id', 'menuButtonDiv')
      SetStyle(menuButtonDiv, {
        width: '600px',
        // height: buttonHeight + 'px',
        top: window.innerHeight - 120 + 'px',
        left: '10px',
        zIndex: 999999,
        position: 'fixed',
        textAlign: 'center',
        padding: '0px',
        margin: '0px',
        background: '#262626',
        border: '3px solid #99f',
        borderRadius: '5px',
      })

      var tbl = document.createElement('table')
      tbl.style.margin = '5px 5px 5px 5px'
      tbl.style.textAlign = 'left'
      tbl.style.width = '98%'
      menuButtonDiv.appendChild(tbl)

      var buttonRow = tbl.insertRow()
      var buttonCell = buttonRow.insertCell()
      buttonCell.style.textAlign = 'center'

      let buttonStyle = {
        position: '',
        margin: '5px 5px 5px 5px',
        border: 'none',
        backgroundColor: '#222d32',
        color: '#ffffff',
        cursor: 'pointer',
      }
      // help button ----------------------------------------------------------------------------------------------------------------
      let helpButton = CreateNodeWithText(buttonCell, texts.help, 'button')
      SetStyle(helpButton, buttonStyle)

      helpButton.addEventListener('click', function() {
        ShowHelp()
      }) // adding clicktextNode

      // site link ----------------------------------------------------------------------------------------------------------------

      let contributeLink = CreateNodeWithText(
        buttonCell,
        texts.contribute,
        'button'
      )
      contributeLink.title = texts.contributeTitle
      SetStyle(contributeLink, buttonStyle)

      contributeLink.addEventListener('click', function() {
        openInTab(serverAdress + 'contribute?scriptMenu', {
          active: true,
        })
      })

      // pw request ----------------------------------------------------------------------------------------------------------------

      let pwRequest = CreateNodeWithText(buttonCell, texts.pwRequest, 'button')
      pwRequest.title = texts.newPWTitle
      SetStyle(pwRequest, buttonStyle)

      pwRequest.addEventListener('click', function() {
        openInTab(serverAdress + 'pwRequest', {
          active: true,
        })
      })

      // site link ----------------------------------------------------------------------------------------------------------------

      let siteLink = CreateNodeWithText(
        buttonCell,
        texts.websiteBugreport,
        'button'
      )
      SetStyle(siteLink, buttonStyle)

      siteLink.addEventListener('click', function() {
        openInTab(serverAdress + 'menuClick', {
          active: true,
        })
      })

      // donate link ----------------------------------------------------------------------------------------------------------------
      let donateLink = CreateNodeWithText(buttonCell, texts.donate, 'button')
      SetStyle(donateLink, buttonStyle)

      donateLink.addEventListener('click', function() {
        openInTab(serverAdress + 'donate?scriptMenu', {
          active: true,
        })
      })

      addEventListener(window, 'resize', function() {
        menuButtonDiv.style.top = window.innerHeight - 70 + 'px'
      })

      // INFO TABEL --------------------------------------------------------------------
      var itbl = document.createElement('table')
      SetStyle(itbl, {
        margin: '5px 5px 5px 5px',
        textAlign: 'left',
        width: '98%',
      })
      menuButtonDiv.appendChild(itbl)
      var ibuttonRow = tbl.insertRow()
      var ibuttonCell = ibuttonRow.insertCell()
      ibuttonCell.style.textAlign = 'center'

      // INFO DIV ---------------------------------------------------------------------------------
      let infoDiv = CreateNodeWithText(ibuttonCell, texts.loading, 'span')
      infoDiv.setAttribute('id', 'infoMainDiv')
      SetStyle(infoDiv, {
        color: '#ffffff',
        margin: '5px',
      })

      // login div ----------------------------------------------------------------------------------------------------------------
      const loginDiv = document.createElement('div')
      loginDiv.style.display = 'none'
      loginDiv.setAttribute('id', 'loginDiv')
      const loginButton = document.createElement('button')
      loginButton.innerText = texts.login
      const loginInput = document.createElement('input')
      loginInput.type = 'text'
      loginInput.style.width = '400px'
      loginInput.style.textAlign = 'center'
      const clientId = getVal('clientId')
      if (clientId && clientId.toString()[0] !== '0') {
        loginInput.value = clientId || ''
        loginButton.innerText = texts.requestPWInsteadOfLogin
      }
      loginDiv.appendChild(loginInput)
      loginDiv.appendChild(loginButton)

      SetStyle(loginButton, buttonStyle)

      loginInput.addEventListener('keyup', e => {
        if (e.target.value === clientId) {
          loginButton.innerText = texts.requestPWInsteadOfLogin
        } else if (e.target.value !== '') {
          loginButton.innerText = texts.login
        }
      })

      loginButton.addEventListener('click', function() {
        if (loginInput.value === clientId.toString()) {
          openInTab(serverAdress + 'getVeteranPw?cid=' + clientId, {
            active: true,
          })
        } else {
          Auth(loginInput.value)
        }
      })

      ibuttonCell.appendChild(loginDiv)

      // irc button ----------------------------------------------------------------------------------------------------------------
      let ircButton = CreateNodeWithText(ibuttonCell, texts.ircButton, 'button')
      SetStyle(ircButton, buttonStyle)
      ircButton.style.display = 'none'
      ircButton.setAttribute('id', 'ircButton')

      ircButton.addEventListener('click', function() {
        openInTab(ircAddress, {
          active: true,
        })
      })

      // retry button ----------------------------------------------------------------------------------------------------------------
      let retryButton = CreateNodeWithText(ibuttonCell, texts.retry, 'button')
      SetStyle(retryButton, buttonStyle)
      retryButton.style.display = 'none'
      retryButton.setAttribute('id', 'retryButton')

      retryButton.addEventListener('click', function() {
        menuButtonDiv.style.background = '#262626'
        infoDiv.innerText = texts.loading
        retryButton.style.display = 'none'
        ircButton.style.display = 'none'
        ConnectToServer(AfterLoad)
      })

      // window resize event listener ---------------------------------------
      addEventListener(window, 'resize', function() {
        menuButtonDiv.style.top = window.innerHeight - 70 + 'px'
      })

      // APPEND EVERYTHING
      appedtTo.appendChild(menuButtonDiv)
    } catch (e) {
      Exception(e, 'script error at showing menu:')
    }
  }

  // : }}}

  // : Generic utils {{{
  function GetId() {
    let currId = getVal('clientId')
    if (currId) {
      return currId
    } else {
      currId = new Date()
      currId = currId.getTime() + Math.floor(Math.random() * 1000000000000)
      currId = currId.toString().split('')
      currId.shift()
      currId = '0' + currId.join('')
      setVal('clientId', currId)
      return currId
    }
  }

  function SafeGetElementById(id, next) {
    let element = overlay.querySelector('#' + id)
    if (element) {
      next(element)
    } else {
      Log(`Unable to safe get element by id: ${id}`)
    }
  }

  function SetStyle(target, style) {
    Object.keys(style)
      .sort()
      .forEach(key => {
        target.style[key] = style[key]
      })
  }

  function CreateNodeWithText(to, text, type) {
    var paragraphElement = document.createElement(type || 'p') // new paragraph
    var textNode = document.createTextNode(text)
    paragraphElement.appendChild(textNode)
    to.appendChild(paragraphElement)
    return paragraphElement
  }

  function GetXHRInfos() {
    const now = new Date().getTime()
    const lastCheck = getVal('lastInfoCheckTime')
    if (!lastCheck) {
      setVal('lastInfoCheckTime', now)
    }

    let lastInfo = { result: 'noLastInfo' }
    try {
      lastInfo = JSON.parse(getVal('lastInfo'))
    } catch (e) {
      if (showErrors) {
        console.info(e)
      }
    }
    if (
      lastInfo.result !== 'success' ||
      now > lastCheck + infoExpireTime * 1000
    ) {
      return new Promise((resolve, reject) => {
        const url =
          apiAdress +
          'infos?version=true&motd=true&subjinfo=true&cversion=' +
          info().script.version +
          '&cid=' +
          GetId()

        xmlhttpRequest({
          method: 'GET',
          url: url,
          crossDomain: true,
          xhrFields: { withCredentials: true },
          headers: {
            'Content-Type': 'application/json',
          },
          onload: function(response) {
            try {
              setVal('lastInfoCheckTime', now)
              const res = JSON.parse(response.responseText)
              setVal('lastInfo', response.responseText)
              resolve(res)
            } catch (e) {
              Log('Errro paring JSON in GetXHRInfos')
              Log(response.responseText)
              Log(e)
              reject(e)
            }
          },
          onerror: e => {
            Log('Info get Error', e)
            reject(e)
          },
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        try {
          resolve(lastInfo)
        } catch (e) {
          Log('Errro paring JSON in GetXHRInfos, when using old data!')
          Log(e)
          reject(e)
        }
      })
    }
  }

  function GetXHRQuestionAnswer(question) {
    return new Promise((resolve, reject) => {
      let url = apiAdress + 'ask?'
      let params = []
      Object.keys(question).forEach(key => {
        let val = question[key]
        if (typeof val !== 'string') {
          val = JSON.stringify(val)
        }
        params.push(key + '=' + encodeURIComponent(val))
      })
      url +=
        params.join('&') +
        '&cversion=' +
        info().script.version +
        '&cid=' +
        GetId()

      xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
          try {
            let res = JSON.parse(response.responseText)
            // FIXME: check if res is a valid answer array
            // res.json({
            //   result: r,
            //   success: true
            // })
            // ERROR:
            // res.json({
            //   message: `Invalid question :(`,
            //   result: [],
            //   recievedData: JSON.stringify(req.query),
            //   success: false
            // })
            resolve(res.result)
          } catch (e) {
            reject(e)
          }
        },
        onerror: e => {
          Log('Errro paring JSON in GetXHRQuestionAnswer')
          Log(e)
          reject(e)
          reject(e)
        },
      })
    })
  }

  function SendXHRMessage(path, message) {
    // message = SUtils.RemoveSpecialChars(message) // TODO: check this
    if (typeof message === 'object') {
      message = JSON.stringify(message)
    }
    const url = apiAdress + path
    return new Promise((resolve, reject) => {
      xmlhttpRequest({
        method: 'POST',
        url: url,
        crossDomain: true,
        xhrFields: { withCredentials: true },
        data: message,
        headers: {
          'Content-Type': 'application/json',
        },
        onerror: function(e) {
          Log('Data send error', e)
          reject(e)
        },
        onload: resp => {
          try {
            const res = JSON.parse(resp.responseText)
            resolve(res)
          } catch (e) {
            Log('Error paring JSON in SendXHRMessage')
            Log(resp.responseText)
            Log(e)
            reject(e)
          }
        },
      })
    })
  }

  function OpenErrorPage(e) {
    const queries = []
    try {
      Object.keys(e).forEach(key => {
        if (e[key]) {
          queries.push(`${key}=${encodeURIComponent(e[key])}`)
        }
      })
      queries.push('version=' + encodeURIComponent(info().script.version))
      queries.push('uid=' + encodeURIComponent(uid))
      queries.push('cid=' + encodeURIComponent(cid))
    } catch (e) {
      Exception(e, 'error at setting error stack/msg link')
    }
    openInTab(serverAdress + 'lred?' + queries.join('&'), {
      active: true,
    })
  }

  // : }}}

  // : Help {{{

  // shows some neat help
  function ShowHelp() {
    openInTab(serverAdress + 'manual?scriptMenu', {
      active: true,
    })
  }

  // : }}}

  // I am not too proud to cry that He and he
  // Will never never go out of my mind.
  // All his bones crying, and poor in all but pain,

  // Being innocent, he dreaded that he died
  // Hating his God, but what he was was plain:
  // An old kind man brave in his burning pride.

  // The sticks of the house were his; his books he owned.
  // Even as a baby he had never cried;
  // Nor did he now, save to his secret wound.

  // Out of his eyes I saw the last light glide.
  // Here among the liught of the lording sky
  // An old man is with me where I go

  // Walking in the meadows of his son's eye
  // Too proud to cry, too frail to check the tears,
  // And caught between two nights, blindness and death.

  // O deepest wound of all that he should die
  // On that darkest day.
})() // eslint-disable-line