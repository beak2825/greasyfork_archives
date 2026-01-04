// ==UserScript==
// @name         Shin WaniKani Leech Trainer
// @namespace    http://tampermonkey.net/
// @version      3.6.1
// @description  Study and quiz yourself on your leeches!
// @author       Ross Hendry (rhendry@gmail.com)
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @source       https://github.com/chooban/wk-leeches-go
// @license      MIT
// @homepage     https://greasyfork.org/en/scripts/372086-shin-wanikani-leech-trainer
// @include      *preview.wanikani.com*
// @run-at       document-end
// @require      https://unpkg.com/wanakana@5.0.2/wanakana.min.js
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372086/Shin%20WaniKani%20Leech%20Trainer.user.js
// @updateURL https://update.greasyfork.org/scripts/372086/Shin%20WaniKani%20Leech%20Trainer.meta.js
// ==/UserScript==

function appStore() {
  // Hook into App Store
  (function appStore() {
    try {
      $('.app-store-menu-item').remove();
      $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")'));
      window.appStoreRegistry = window.appStoreRegistry || {};
      window.appStoreRegistry[GM_info.script.uuid] = GM_info;
      localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry);
    } catch (e) { }
  })();
}

// It's crap to include test code in production, but it's a workaround
// for now to stop me pushing out stuff pointing to localhost.
const { name } = GM_info.script
console.log('Script name is', name)
const config = {
  BASE_URL: name.startsWith('Local')
    ? 'https://leeches.local/api'
    : 'https://leeches.rosshendry.com',
  KEY_API_KEY: 'wkApiKeyV2',
  KEY_LEECH_CACHE: 'wkLeechCache',
  KEY_LEECHES_TRAINED: 'wkLeechesTrained',
}

{
  config
}

function shake(elem) {
  var dist = '25px';
  var speed = 75;
  var right = { padding: '0 ' + dist + ' 0 0' }, left = { padding: '0 0 0 ' + dist }, center = { padding: "0 0 0 0" };

  elem.animate(left, speed / 2).animate(right, speed)
    .animate(left, speed).animate(right, speed)
    .animate(left, speed).animate(center, speed / 2);
}


{ shake }

// Jaro-Winkler Distance
function jw_distance(a, c) {
  var h, b, d, k, e, g, f, l, n, m, p;
  if (a.length > c.length) {
    c = [c, a];
    a = c[0];
    c = c[1];
  }
  k = ~~Math.max(0, c.length / 2 - 1);
  e = [];
  g = [];
  b = n = 0;
  for (p = a.length; n < p; b = ++n) {
    for (h = a[b], l = Math.max(0, b - k), f = Math.min(b + k + 1, c.length), d = m = l; l <= f ? m < f : m > f; d = l <= f ? ++m : --m) {
      if (g[d] === undefined && h === c[d]) {
        e[b] = h;
        g[d] = c[d];
        break;
      }
    }
  }
  e = e.join("");
  g = g.join("");
  d = e.length;
  if (d) {
    b = f = k = 0;
    for (l = e.length; f < l; b = ++f) {
      h = e[b];
      if (h !== g[b]) k++;
    }
    b = g = e = 0;
    for (f = a.length; g < f; b = ++g) {
      if (h = a[b], h === c[b])
        e++;
      else
        break;
    }
    a = (d / a.length + d / c.length + (d - ~~(k / 2)) / d) / 3;
    a += 0.1 * Math.min(e, 4) * (1 - a);
  } else {
    a = 0;
  }
  return a;
}

{ jw_distance }

const CORRECT = 'correct'
const INCORRECT = 'incorrect'
const TRY_AGAIN = 'try_again'


class Question {
  constructor(data) {
    this.name = data.name
    this.type = data.type
    this.trainingType = data.train_type
    this.correctAnswers = data.correct_answers
    this.tryAgainAnswers = data.try_again_answers
    this.key = data.type + "/" + data.name
    this.isSimilar = data.is_similar
    this.originalLeech = data
  }

  checkAnswer(answer) {
    if (!answer || answer.length === 0) {
      return INCORRECT
    }
    if (this.trainingType === 'reading') {
      // Were we given kana?
      const isKana = wanakana.isKana(answer)
      if (!isKana) {
        return TRY_AGAIN
      }
      // Since we know it's kana, check to see if it's correct
      return this.correctAnswers.includes(answer) ? CORRECT : INCORRECT
    }

    // It's a meaning question
    const closeEnoughMatch = function (givenAnswer, answer) {
      return jw_distance(answer.toLowerCase(), givenAnswer.toLowerCase()) > 0.9;
    }

    if (this.correctAnswers.filter(closeEnoughMatch.bind(this, answer)).length > 0) {
      return CORRECT
    } else if (this.tryAgainAnswers.filter(closeEnoughMatch.bind(this, answer)).length > 0) {
      return TRY_AGAIN
    } else {
      return INCORRECT
    }
  }
}

{ Question }

class Quiz {
  constructor(leechItems) {
    this.lessons = leechItems.filter(l => l.name !== undefined && l.name.length > 0)
    this.questions = this.makeQuestions(this.lessons)
    this.correctAnswers = []
    this.incorrectAnswers = []
    this.nthQuestion = 0
  }

  makeQuestions(lessons, repetitions = 3) {
    if (!lessons || lessons.length == 0) {
      throw new Error("Cannot make a quiz with no questions")
    }
    let questions = lessons.map(function(lesson) {
      if (!lesson.is_similar) {
        return new Question(lesson)
      }
    }).filter(Boolean)

    let similars = lessons.map(function(lesson) {
      if (lesson.is_similar) {
        return new Question(lesson)
      }
    }).filter(Boolean)

    var i, temp, n = repetitions;
    var questionSets = [];

    // Make up n batches of the questions
    for (i = 0; i < n; i++) {
      questionSets.push([...questions]);
    }

    for (i = 0; i < similars.length; i++) {
      var j = Math.floor(Math.random() * n);
      questionSets[j].push(similars[i]);
    }

    var previousKey = undefined;
    for (i = 0; i < n; i++) {
      var set = shuffle(questionSets[i]);

      if (set[0].key === previousKey) {
        temp = set[0]; 
        set[0] = set[set.length - 1]; 
        set[set.length - 1] = temp;
      }

      previousKey = set[set.length - 1].key;
    }

    return [].concat.apply([], questionSets);
  }

  items() {
    return this.lessons.length
  }

  similars() {
    return this.lessons.filter(function(lesson) {
      return lesson.is_similar
    })
  }

  currentQuestion() {
    return this.questions[this.nthQuestion]
  }

  lastQuestion() {
    return this.questions[this.nthQuestion - 1]
  }

  advanceQuestion(answerStatus) {
    if (answerStatus === CORRECT) {
      this.correctAnswers.push(this.questions[this.nthQuestion])
      this.nthQuestion += 1
    } else if (answerStatus === INCORRECT) {
      this.incorrectAnswers.push(this.questions[this.nthQuestion])
    }

    return answerStatus
  }

  percentComplete() {
    return (this.correctAnswers.length / this.questions.length) * 100
  }

  length() {
    return this.questions.length
  }

  /**
   * Checks the provided answer against the current question.
   * There are shades of grey in determining if the answer is correct or not,
   * so this isn't a boolean return
   *
   * @param {string} answer
   * @returns {string} One of CORRECT, INCORRECT, or TRY_AGAIN.
   */
  submitAnswer(answer) {
    const q = this.currentQuestion()

    return this.advanceQuestion(q.checkAnswer(answer))
  }

  /**
   * Returns an array of the lessons which have been successfully trained.
   */
  trained() {
    const trained = []
    const self = this
    this.correctAnswers.forEach(function(leech) {
      if (!trained.find(function(l) { return l.key == leech.key; })
        && !self.incorrectAnswers.find(function(l) { return l.key == leech.key; })
      ) {
        trained.push(leech);
      }
    });

    return trained.map(function(l) {
      return l.originalLeech
    })
  }
}

function shuffle(array) {
  var i = array.length, j, temp;
  if (i === 0) return array;
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i]; array[i] = array[j]; array[j] = temp;
  }
  return array;
}

{ Quiz, CORRECT, INCORRECT, TRY_AGAIN }

(function() {
  'use strict';

  const { KEY_API_KEY } = config;

  const quizHtml = `
    <div id="leech_quiz" class="kanji reading">
      <div class="quiz-progress"><div class="quiz-progress-bar"></div></div>
      <div class="qwrap">
        <div class="question"></div>
        <div class="help"></div>
      </div>
      <div class="qtype"></div>
      <div class="answer"><input type="text" value=""></div>
    </div>`;


  var quiz;
  var wanakanaIsBound;
  var quizInProgress = false;

  GM_registerMenuCommand("WaniKani Leech Trainer: Set API key", promptApiKey);
  GM_registerMenuCommand("WaniKani Leech Trainer: Set Leech Score", promptLeechScore);
  GM_registerMenuCommand("WaniKani Leech Trainer: Set Quiz Size", promptQuizSize);
  GM_registerMenuCommand("WaniKani Leech Trainer: Squash My Leeches", squashMyLeeches);
  GM_registerMenuCommand("WaniKani Leech Trainer: XXX! DELETE MY STATS", promptDelete);

  function squashMyLeeches() {
    var apiKey = GM_getValue(KEY_API_KEY) || ''
    var confirmation = window.prompt("Do you really want to squash all your leeches? Enter 'yes' to confirm", "no")
    if (confirmation === null || confirmation === "no") {
      ;
    } else if (typeof confirmation === 'string' && confirmation === 'yes') {
      ajaxRetry(config.BASE_URL + '/leeches/squash', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        method: 'POST'
      }).then(refreshLessons)
        .catch(function(error) {
          console.log(error)
          console.log("Failed to squash leeches")
        })
    }
  }

  function promptDelete() {
    var apiKey = GM_getValue(KEY_API_KEY) || ''
    ajaxRetry(config.BASE_URL + '/user', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
    }).then(() => {
      var confirmation = null
      confirmation = window.prompt("Do you really want to reset your stats? Enter 'yes' to confirm", "no")
      if (confirmation === null || confirmation === "no") {
        ;
      } else if (typeof confirmation === 'string' && confirmation === 'yes') {
        ajaxRetry(config.BASE_URL + '/leeches', {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          },
          method: 'DELETE'
        }).then(() => {
          refreshLessons()
        })
      }
    })
  }

  function promptApiKey() {
    var currentApiKey = GM_getValue(KEY_API_KEY) || ''
    var possibleApiKey = null
    while (true) {
      possibleApiKey = window.prompt("Please enter your API key", currentApiKey)
      if (typeof possibleApiKey === 'string' && possibleApiKey.length === 36) {
        GM_setValue(KEY_API_KEY, possibleApiKey)
        break
      } else if (possibleApiKey === null) {
        // User clicked cancel
        break
      } else {
        alert("That does not look like a valid key, please try again")
      }
    }
  }

  function promptLeechScore() {
    var apiKey = GM_getValue(KEY_API_KEY) || ''
    ajaxRetry(config.BASE_URL + '/user', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
    }).then((profile) => {
      let possibleNewScore = null
      while (true) {
        possibleNewScore = window.prompt("Please set your leech score", profile.leech_score)

        if (parseFloat(possibleNewScore) !== NaN && parseFloat(possibleNewScore) >= 1.0) {
          setProfileValue('leech_score', parseFloat(possibleNewScore))
          break
        } else if (possibleNewScore === null) {
          break
        } else {
          alert("Doesn't look right. Please try again")
        }
      }
    })
  }

  function promptQuizSize() {
    var apiKey = GM_getValue(KEY_API_KEY) || ''
    ajaxRetry(config.BASE_URL + '/user', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
    }).then((profile) => {
      let possibleNewQuizSize = null
      while (true) {
        possibleNewQuizSize = window.prompt("Please set your quiz size", profile.quiz_size)

        if (parseInt(possibleNewQuizSize) !== NaN && parseFloat(possibleNewQuizSize) >= 1.0) {
          setProfileValue('quiz_size', parseInt(possibleNewQuizSize))
          break
        } else if (possibleNewQuizSize === null) {
          break
        } else {
          alert("Doesn't look right. Please try again")
        }
      }
    })
  }

  function setProfileValue(key, score) {
    var apiKey = GM_getValue(KEY_API_KEY) || ''
    ajaxRetry(config.BASE_URL + '/user', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      method: 'PATCH',
      data: JSON.stringify({
        [key]: score
      })
    }).finally(refreshLessons)
      .catch(e => {
        console.error(e)
      })
  }

  function loading() {
    $('.sitemap__section__leeches').remove();
    var leechButton = `
      <li class="sitemap__section sitemap__section__leeches">
        <h2 class="sitemap__section-header sitemap__section-header--leeches" data-navigation-section-toggle="" data-expanded="false" role="button">
          <div class="spinner">
            <span lang="ja">蛭達</span>
            <span lang="en">Leeches</span>
          </div>
        </h2>
      </li>`

    var parentElement = $('.navigation .sitemap__section-header--vocabulary').parent()
    if (!parentElement.length) {
      console.log('Could not find the vocabulary button to attach to')
      return
    }

    var btnElement = $(leechButton)
    btnElement.insertAfter(parentElement)
  }

  function renderError(error) {
    $('.sitemap__section__leeches').remove();
    var leechButton = `
      <li class="sitemap__section sitemap__section__leeches">
        <h2 class="sitemap__section-header sitemap__section-header--leeches" data-navigation-section-toggle="" data-expanded="false" role="button">
          <span lang="ja">蛭達</span>
          <span lang="en">Leeches - Error!</span>
        </h2>
      </li>`

    var parentElement = $('.navigation .sitemap__section-header--vocabulary').parent()
    if (!parentElement.length) {
      console.log('Could not find the vocabulary button to attach to')
      return
    }

    var btnElement = $(leechButton)
    btnElement.click(function(event) {
      event.stopImmediatePropagation()
      window.alert(error)
    })
    btnElement.insertAfter(parentElement)
  }

  function renderButton(json) {
    if (quizInProgress) {
      return;
    }
    $('.sitemap__section__leeches').remove();
    var leechButton = `
      <li class="sitemap__section sitemap__section__leeches" data-controller="expandable-navigation" data-expandable-navigation-open-class="sitemap__section--open">
        <button class="sitemap__section-header sitemap__section-header--leeches" data-action="expandable-navigation#toggle" data-expandable-navigation-target="toggle" aria-expanded="true" type="button" aria-controls="sitemap__leeche" tabindex="0">
          <span lang="ja">蛭達</span>
          <span lang="en">Leeches</span>
        </button>
        <div id="sitemap__leeches" data-expandable-navigation-target="expandableChunk" class="sitemap__expandable-chunk sitemap__expandable-chunk--leeches" style="--chunk-height: 318px;">
          <div data-expandable-navigation-target="expandableChunkContent">
            <ul class="sitemap__pages sitemap__pages--leeches">
              <li class="sitemap__page sitemap__page--leech">
                You have <span class="leech-count">${json.stats.leech_count}</span> leeches
              </li>
              <li class="sitemap__page sitemap__page--leech">
                <button style="width: 100%;" class="leeches-start-quiz">Squash some leeches!</button>
              </li>
            </ul>
          </div>
        </div>
      </li>`

    var parentElement = $('.navigation .sitemap__section-header--vocabulary').parent()
    if (!parentElement.length) {
      console.log('Could not find the vocabulary button to attach to')
      return
    }

    var btnElement = $(leechButton)
    btnElement.click(function(event) {
      event.stopImmediatePropagation()
      var header = $(this).find('h2.sitemap__section-header')
      var sitemap = $(this).find('div.sitemap__expandable-chunk')
      var toggleTo = header.attr('data-expanded') === 'true' ? 'false' : 'true'

      header.attr('data-expanded', toggleTo)
      sitemap.attr('data-expanded', toggleTo)
    })
    btnElement.insertAfter(parentElement)

    if (json.lessons.length > 0) {
      quiz = new Quiz(json.lessons);
      $('.navigation .sitemap__section__leeches button.leeches-start-quiz').click(startQuiz);
    } else {
      $('.navigation .sitemap__section__leeches button.leeches-start-quiz').remove()
    }
  }

  function refreshLessons() {
    loading();
    getAPIKey()
      .then(function(apiKey) {
        ajaxRetry(config.BASE_URL + '/leeches/lesson', {
          timeout: 0,
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        })
          .then(renderButton)
          .catch(function(error) {
            console.log("Failed to retrieve lessons")
            console.log(error)
            renderError(error)
          })
      }).catch(function() {
        console.log("Failed to get API key");
      });
  }

  function startQuiz(e) {
    // The default action is to navigate to /, so let's not do that.
    e.preventDefault();

    if (quiz.length() === 0) return;

    quizInProgress = true;

    $('#leech_quiz, #leech_quiz_abort').remove();
    $('body').append('<div id="leech_quiz_abort"/>').append(quizHtml);
    $('.navbar, #search, .dashboard, footer').css('filter', 'blur(20px)');

    wanakanaIsBound = false;
    $('.quiz-progress-bar').animate({ width: quiz.percentComplete() + '%' }, 250);
    $('#leech_quiz').find('.answer input').on('keypress', onAnswerKeyPress);
    $('#leech_quiz_abort').click(closeQuiz);

    showNextQuestion();
  }

  function closeQuiz() {
    $('.navbar, #search, .dashboard, footer').css('filter', 'none');
    $('#leech_quiz, #leech_quiz_abort').remove();
    quizInProgress = false;
    refreshLessons();
  }

  function onAnswerKeyPress(e) {
    var code = e.originalEvent
      ? (e.originalEvent.charCode ? e.originalEvent.charCode : e.originalEvent.keyCode ? e.originalEvent.keyCode : 0)
      : (e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0);

    if ($('#leech_quiz').find('.help').is(':visible')) {
      $('#leech_quiz').find('.help').hide();
      $('#leech_quiz .answer input').val('').focus().select();
    } else if (code === 13) {
      var answerGiven = $('#leech_quiz .answer input').val().trim();
      // if (e.ctrlKey) answerGiven = quiz[0].correct_answers[0];
      if (answerGiven.length === 0) return;

      let question = quiz.currentQuestion()

      if (question.trainingType === 'reading') {
        answerGiven = wanakana.toHiragana(answerGiven).trim();
        if (answerGiven.indexOf("n") == answerGiven.length - 1) {
          answerGiven = answerGiven.substring(0, answerGiven.length - 1) + "ん";
        }
      }
      $('#leech_quiz .answer input').val(answerGiven);

      const result = quiz.submitAnswer(answerGiven);

      if (result === TRY_AGAIN) {
        shake($('#leech_quiz .answer input'));
      } else if (result === INCORRECT) {
        shake($('#leech_quiz .answer input'));
        $('#leech_quiz .answer input').select();

        let infoUrl = '<a href="/' + question.type + '/' + question.name + '" target="_blank">' + question.correctAnswers[0] + '</a>'

        $('#leech_quiz')
          .find('.help')
          .html(infoUrl)
          .attr('lang', (question.type === 'reading') ? 'ja' : 'en')
          .show();

      } else {
        $('#leech_quiz .answer input').addClass('correct').blur();
        setTimeout(showNextQuestion, 500);
      }
    } else {
      $('#leech_quiz').find('.help').hide();
    }
    $('.quiz-progress-bar').animate({ width: quiz.percentComplete() + '%' }, 250);
  }

  function finishQuiz() {
    $('.quiz-progress-bar').addClass('pulse');
    $('#leech_quiz_abort').css('z-index', 1031);

    var trainedLeeches = quiz.trained();

    var trained = trainedLeeches.reduce(function(acc, leech) {
      if (leech.is_similar) {
        acc.similars.push(leech)
      } else {
        acc.leeches.push(leech)
      }
      return acc
    }, { leeches: [], similars: [] })

    var msg = trained.leeches.length === 0
      ? "Sorry. No leeches trained."
      : trained.leeches.length + " leech" + (trained.leeches.length > 1 ? "es" : "") + " trained!";

    if (quiz.similars().length > 0 && trained.leeches.length > 0) {
      msg = msg.slice(0, msg.length - 1)
      msg += ", and spotted " + trained.similars.length + " similar item" + ((trained.similars.length > 1 || trained.similars.length == 0) ? "s" : "") + "!"
    }

    $('#leech_quiz').find('.help').html(msg).attr('lang', 'en').show();

    getAPIKey().then(function(apiKey) {
      ajaxRetry(config.BASE_URL + '/leeches/trained', {
        data: JSON.stringify({ trained: trained.leeches }),
        method: 'POST',
        timeout: 0,
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }).catch(function(e) {
        console.error("Failed to submit trained leeches")
        console.error(e)
      }).finally(function() {
        setTimeout(function() {
          closeQuiz();
        }, 2000)
      });
    })
  }

  function showNextQuestion() {
    if (quiz.percentComplete() === 100) {
      finishQuiz()
      return;
    }

    var item = quiz.currentQuestion();

    if (item.isSimilar) {
      console.log("This is a red herring similar one")
    }
    var questionType = 'char';
    var questionLanguage = 'ja';
    var questionText = item.name;
    var answerType = item.trainingType;
    var answerLanguage = 'ja';
    var itemType = item.type;
    var dialog = $('#leech_quiz')

    dialog.find('.question').attr('data-type', questionType).attr('lang', questionLanguage).html(questionText);
    var type_text = itemType + ' <strong>' + answerType + '</strong>';
    dialog.find('.qtype').removeClass('reading meaning').addClass(answerType).html(type_text);
    dialog.removeClass('kanji vocabulary').addClass(itemType);

    $('#leech_quiz .answer input').attr('lang', answerLanguage).removeClass('correct').val('').focus().select();

    if (answerType === 'reading') {
      if (!wanakanaIsBound) {
        wanakana.bind($('#leech_quiz .answer input')[0]);
        wanakanaIsBound = true;
      }
    } else {
      if (wanakanaIsBound) {
        wanakana.unbind($('#leech_quiz .answer input')[0]);
        wanakanaIsBound = false;
      }
    }
  }

  refreshLessons();

  //-------------------------------------------------------------------
  // Fetch a document from the server.
  //-------------------------------------------------------------------
  function ajaxRetry(url, options) {
    //console.log(url, retries, timeout);
    options = options || {};
    var retries = options.retries || 3;
    var timeout = options.timeout || 6000;
    var headers = options.headers || {};
    var method = options.method || 'GET';
    var data = options.data || undefined;
    var cache = options.cache || false;

    function action(resolve, reject) {
      $.ajax({
        url: url,
        method: method,
        timeout: timeout,
        headers: headers,
        data: data,
        cache: cache
      })
        .done(function(data, status) {
          if (status === 'success' || status === 'nocontent') {
            resolve(data);
          } else {
            debugger
            reject(data);
          }
        })
        .fail(function(xhr, status) {
          if ((status === 'error' || status === 'timeout') && --retries > 0) {
            action(resolve, reject);
            return
          }
          debugger
          reject(xhr.responseText);
        });
    }
    return new Promise(action);
  }

  function getAPIKey() {
    return new Promise(function(resolve, reject) {
      var apiKey = GM_getValue(KEY_API_KEY);
      if (typeof apiKey === 'string' && apiKey.length == 36) return resolve(apiKey);

      // status_div.html('Fetching API key...');
      ajaxRetry('/settings/personal_access_tokens').then(function(page) {

        // --[ SUCCESS ]----------------------
        // Make sure what we got is a web page.
        if (typeof page !== 'string') { return reject(); }

        // Extract the user name.
        page = $(page);

        // Extract the API key.
        var possibleApiKey = page.find('table#personal-access-tokens-list tbody tr:last-of-type code')[0].innerText;
        if (typeof possibleApiKey !== 'string' || possibleApiKey.length !== 36) {
          return reject(new Error('generate_apikey'));
        }

        GM_setValue(KEY_API_KEY, possibleApiKey);
        resolve(possibleApiKey);

      }, function() {
        // --[ FAIL ]-------------------------
        reject(new Error('Failed to fetch API key!'));
      });
    });
  }
})();

(function(){
  const $style = document.createElement('style');

  $style.innerHTML = `#leech_quiz [lang="ja"] {
  font-family: "Meiryo", "Yu Gothic", "Hiragino Kaku Gothic Pro", "TakaoPGothic",
    "Yu Gothic", "ヒラギノ角ゴ Pro W3", "メイリオ", "Osaka", "MS PGothic",
    "ＭＳ Ｐゴシック", sans-serif;
}

#leech_quiz {
  position: absolute;
  z-index: 1028;
  width: 573px;
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 8px;
  border: 8px solid rgba(0, 0, 0, 0.85);
  font-size: 2em;
}

#leech_quiz * {
  text-align: center;
}

#leech_quiz .qwrap {
  height: 8em;
  position: relative;
  clear: both;
}

#leech_quiz.radicals .qwrap,
#leech_quiz.radicals .summary .que {
  background-color: #0af;
}

#leech_quiz.kanji .qwrap,
#leech_quiz.kanji .summary .que {
  background-color: #f0a;
}

#leech_quiz.vocabulary .qwrap,
#leech_quiz.vocabulary .summary .que {
  background-color: #a0f;
}

#leech_quiz .prev,
#leech_quiz .next {
  display: inline-block;
  width: 80px;
  color: #fff;
  line-height: 8em;
  cursor: pointer;
}

#leech_quiz .prev:hover {
  background-image: linear-gradient(
    to left,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.2)
  );
}

#leech_quiz .next:hover {
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.2)
  );
}

#leech_quiz .prev {
  float: left;
}

#leech_quiz .next {
  float: right;
}

#leech_quiz .topbar {
  font-size: 0.5em;
  line-height: 1em;
  color: rgba(255, 255, 255, 0.5);
}

#leech_quiz .settings {
  float: left;
  padding: 6px 8px;
  text-align: left;
  line-height: 1.5em;
}

#leech_quiz .settings span[class*="icon-"] {
  font-size: 1.3em;
  padding: 0 2px;
}

#leech_quiz .settings .ss_audio {
  padding-left: 0;
  padding-right: 4px;
}

#leech_quiz .settings .ss_typo {
  padding-left: 0px;
}

#leech_quiz .settings .ss_done {
  font-size: 1.25em;
}

#leech_quiz .settings .ss_pair {
  font-weight: bold;
}

#leech_quiz .settings span {
  cursor: pointer;
}

#leech_quiz .settings span:hover {
  color: rgba(255, 255, 204, 0.8);
}

#leech_quiz .settings span.active {
  color: #ffc;
}

#leech_quiz.help .settings .ss_help {
  color: #ffc;
}

#leech_quiz .stats_labels {
  text-align: right;
  font-family: monospace;
}

#leech_quiz .stats {
  float: right;
  text-align: right;
  color: rgba(255, 255, 255, 0.8);
  font-family: monospace;
  padding: 0 5px;
}

#leech_quiz .round {
  display: none;
  font-weight: bold;
  position: absolute;
  box-sizing: border-box;
  width: 60%;
  height: 75%;
  border-radius: 24px;
  border: 2px solid #000;
  background-color: #fff;
}

#leech_quiz.round .round {
  display: block;
}

#leech_quiz .question {
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  text-align: center;
  line-height: 1.1em;
  font-size: 1em;
  font-weight: bold;
  cursor: default;
}

#leech_quiz .question[data-type="char"] {
  font-size: 2em;
}

#leech_quiz .icon-audio:before {
  content: "\\f028";
}

#leech_quiz .question .icon-audio {
  font-size: 2.5em;
  cursor: pointer;
}

#leech_quiz.summary .question {
  display: none;
}

#leech_quiz .qtype {
  line-height: 2em;
  cursor: default;
  text-transform: capitalize;
}

#leech_quiz .qtype.reading {
  color: #fff;
  text-shadow: -1px -1px 0 #000;
  border-top: 1px solid #555;
  border-bottom: 1px solid #000;
  background-color: #2e2e2e;
  background-image: linear-gradient(to bottom, #3c3c3c, #1a1a1a);
  background-repeat: repeat-x;
}

#leech_quiz .qtype.meaning {
  color: #555;
  text-shadow: -1px -1px 0 rgba(255, 255, 255, 0.1);
  border-top: 1px solid #d5d5d5;
  border-bottom: 1px solid #c8c8c8;
  background-color: #e9e9e9;
  background-image: linear-gradient(to bottom, #eee, #e1e1e1);
  background-repeat: repeat-x;
}

#leech_quiz .help {
  display: none;
  position: absolute;
  top: 3%;
  left: 13%;
  width: 74%;
  box-sizing: border-box;
  border: 2px solid #000;
  border-radius: 15px;
  padding: 4px;
  color: #555;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 0.8em;
  line-height: 1.2em;
}

#leech_quiz.help .help {
  display: inherit;
}

#leech_quiz .answer {
  background-color: #ddd;
  padding: 8px;
}

#leech_quiz .answer input {
  width: 100%;
  background-color: #fff;
  height: 2em;
  margin: 0;
  border: 2px solid #000;
  padding: 0;
  box-sizing: border-box;
  border-radius: 0;
  font-size: 1em;
}

#leech_quiz .answer input.correct {
  color: #fff;
  background-color: #8c8;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
}

#leech_quiz .answer input.incorrect {
  color: #fff;
  background-color: #f03;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
}

#leech_quiz.loading .qwrap,
#leech_quiz.loading .answer {
  display: none;
}

#leech_quiz .summary {
  display: none;
  position: absolute;
  width: 74%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-weight: bold;
}

#leech_quiz.summary .summary {
  display: block;
}

#leech_quiz .summary h3 {
  background-image: linear-gradient(to bottom, #3c3c3c, #1a1a1a);
  background-repeat: repeat-x;
  border-top: 1px solid #777;
  border-bottom: 1px solid #000;
  margin: 0;
  box-sizing: border-box;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 0.8em;
  font-weight: bold;
  line-height: 40px;
}

#leech_quiz .summary .errors {
  position: absolute;
  top: 40px;
  bottom: 0px;
  width: 100%;
  margin: 0;
  overflow-y: auto;
  list-style-type: none;
}

#leech_quiz .summary li {
  margin: 4px 0 0 0;
  font-size: 0.6em;
  font-weight: bold;
  line-height: 1.4em;
}

#leech_quiz .summary .errors span {
  display: inline-block;
  padding: 2px 4px 0px 4px;
  border-radius: 4px;
  line-height: 1.1em;
  max-width: 50%;
  vertical-align: middle;
  cursor: pointer;
}

#leech_quiz .summary .ans {
  background-color: #fff;
  color: #000;
}

#leech_quiz .summary .wrong {
  color: #f22;
}

#leech_quiz .btn.requiz {
  position: absolute;
  top: 6px;
  right: 6px;
  padding-left: 6px;
  padding-right: 6px;
}

#leech_quiz_container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

#leech_quiz {
  position: fixed;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  top: 6em;
}

#leech_quiz .quiz-progress {
  margin-bottom: 8px;
  height: 8px;
  background-color: gray;
}

#leech_quiz .quiz-progress .quiz-progress-bar {
  height: 8px;
  background-color: white;
}

#leech_quiz .quiz-progress .quiz-progress-bar.pulse {
  animation: pulse 1.5s ease-in-out infinite alternate;
}

@keyframes pulse {
  0% {
    box-shadow: 0px 0px 5px white;
  }

  25% {
    box-shadow: 0px 0px 20px white;
  }

  75% {
    box-shadow: 0px 0px 20px white;
  }

  100% {
    box-shadow: 0px 0px 5px white;
  }
}

#leech_quiz_abort {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
}

@keyframes spinner {
  0% {
    transform: translate3d(-50%, -50%, 0) rotate(0deg);
  }
  100% {
    transform: translate3d(-50%, -50%, 0) rotate(360deg);
  }
}

.spinner {
  height: 100vh;
  opacity: 1;
  position: relative;
  transition: opacity linear 0.1s;
}

.spinner::before {
  animation: 2s linear infinite spinner;
  border: solid 3px #eee;
  border-bottom-color: #ef6565;
  border-radius: 50%;
  content: "";
  height: 20px;
  left: 50%;
  opacity: inherit;
  position: absolute;
  top: 47.5px;
  transform: translate3d(-50%, -50%, 0);
  transform-origin: center;
  width: 20px;
  will-change: transform;
}
`;
  document.body.appendChild($style);
})();