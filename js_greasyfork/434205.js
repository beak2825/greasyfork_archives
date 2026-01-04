// ==UserScript==
// @name         Membean Tracker
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  A powerful membean helper that uses a variety of tools to answer membean questions.
// @author       Squidtoon99 (https://squid.pink)
// @include        https://membean.com/training_sessions/*/user_state
// @include        https://membean.com/mywords/*
// @include        https://membean.com/training_sessions/new
// @icon         https://www.google.com/s2/favicons?domain=membean.com
// @grant        GM_xmlhttpRequest
// @connect      squid.pink
// @downloadURL https://update.greasyfork.org/scripts/434205/Membean%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/434205/Membean%20Tracker.meta.js
// ==/UserScript==
var cache = {};
var apiURL = "https://api.squid.pink";
var q;

const plugins = [
  autoSelectHTMLPlugin,
  questionPlugin,
  checkExampleSingleNode,
  checkExampleMultiNode,
  definitionOnHoverPlugin,
  autoNextPlugin,
];
const persistent_plugins = [storeCorrectAnswerPlugin, autoTypeNewWordPlugin];

const non_question_plugins = [
  autoAnswerTextInputPlugin,
  autoStartNewSessionPlugin,
];

setInterval(() => {
  // Checking if there is a new question
  var questions = document.getElementsByClassName("question");
  if (questions.length > 0) {
    var question = questions[0];
    var iter;
    if (question !== q) {
      q = question;
      cache.q = question;
      iter = plugins; // the plugins that only need to run when the question renders
      cache.answer = false;
    } else {
      iter = persistent_plugins; // the plugins that need to be constantly running
    }
    for (var z = 0; z < iter.length; z++) {
      iter[z]();
    }
    if (cache.answer == false) {
      var choices = document.getElementsByClassName("choice");
      setTimeout(() => {
        if (
          choices === document.getElementsByClassName("choice") &&
          document.getElementsByClassName("choice correct").length == 0
        ) {
          //console.log("autoclicking");
          //document.getElementsByClassName("choice")[0].click();
        }
      }, 500);
    }
  } else {
    for (var x = 0; x < non_question_plugins.length; x++) {
      non_question_plugins[x]();
    }
  }
  if (Math.floor(Math.random() * 1000) === 5) {
    location.reload();
    window.console.log("reloading");
  }
}, 500);

setInterval(() => {
  if (document.getElementsByClassName("take_a_break").length == 1) {
    console.log("taking a break");
    document.getElementById("Click_me_to_stop").click();
    setTimeout(
      () =>
        (window.location.href = "https://membean.com/training_sessions/new"),
      1000
    );
  }
}, 1000);

function answer(answer_num, reason) {
  var o = Object.values(document.getElementsByClassName("choice"))[answer_num];
  cache.answer = true;
  console.log(`Found correct answer (${answer_num}): [${reason}]`);
  o.className = "choice correct";
  setTimeout(() => o.click(), 8000); // set this timeout to how long you want to wait (ms) before answering questions
  //o.click();
}

function autoNextPlugin() {
  var c = document.getElementById("next-btn");
  if (c) {
    setTimeout(() => c.click(), 1000);
  }
}

function autoSelectHTMLPlugin() {
  // This plugin simply will select the choice answer html selector
  var c = document.getElementsByClassName("choice answer");
  if (c.length > 0) {
    c[0].click();
  }
}

function questionPlugin() {
  // This queries the api to see if there is a value stored
  var url = `${apiURL}/membean/${encodeURIComponent(q.textContent.trim())}`;
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
    onload: (rspObj) => {
      if (rspObj.status == 404) {
        // temp autoclicking
        var c = document.getElementsByClassName("choice");
        
        return;
      } else if (rspObj.status != 200) {
        reportAJAX_Error(rspObj);
        return;
      }
      let data = rspObj.response;
      console.log(data);
      if (data.answer) {
        var choices = document.getElementsByClassName("choice");
        for (var iter = 0; iter < choices.length; iter++) {
          if (choices[iter].textContent.trim() == data.answer.trim()) {
            answer(iter, "stored question");
          }
        }
        window.console.log(`[${q}] Answer: ${data.answer[0].answer}`);
      } else {
        window.console.log("No storage for this question");
      }
    },
    onabort: reportAJAX_Error,
    onerror: reportAJAX_Error,
    ontimeout: reportAJAX_Error,
  });
}

function storeCorrectAnswerPlugin() {
  // stores the correct answer whenever html is updated
  var formatter = document.getElementsByClassName(
    "single-column-layout with-image"
  );
  var correct = document.getElementsByClassName("choice correct");
  if (correct.length > 0) {
    var e = correct[0];
    if (cache.e === e) {
      return;
    }
    cache.e = e;
    var data;
    if (formatter.length == 1) {
      // Images suck why membean why
      var img = formatter[0].children[1];
      data = { question: img.src, answer: e.textContent };
    } else {
      // Not an image question just a standard one
      data = {
        question: cache.q.textContent.trim(),
        answer: e.textContent.trim(),
      };
    }
    if (data.question.includes("Try again!")) {
      return;
    }
    GM_xmlhttpRequest({
      method: "POST",
      url: `${apiURL}/membean/`,
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
      onload: (rspObj) => {
        if (rspObj.status == 201) {
          window.console.log("Stored answer for: " + data.question);
        } else {
          console.log(rspObj);
        }
      },
      onabort: reportAJAX_Error,
      onerror: reportAJAX_Error,
      ontimeout: reportAJAX_Error,
    });
  }
}

function checkExampleSingleNode() {
  // In case they italize a word we think it's the word that's the answer and then make it look "correct"
  var nodes = cache.q.children;
  if (nodes.length == 2 && nodes[1].nodeName === "EM") {
    var word = nodes[1].textContent;
    if (
      word[word.length - 1] === "s" &&
      !"aeious".split("").includes(word[word.length - 2])
    ) {
      word = word.slice(0, word.length - 1);
    }
    if (word.replaceAll("_", "").trim() === "") {
      return;
    }
    console.log(`Question about ${word}`);
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://membean.com/mywords/${word}`,
      responseType: "json",
      onload: (rspObj) => {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(rspObj.responseText, "text/html");

        var canswer = htmlDoc.getElementsByClassName("choice answer")[0];

        if (!canswer) {
          return;
        }

        var choices = document.getElementsByClassName("choice");
        var choicesParsed = {};
        for (var i = 0; i < choices.length; i++) {
          if (choices[i].textContent === canswer.textContent) {
            answer(i, "singleNode example");
            return;
          } else {
            choicesParsed[i] = levenshtein(
              choices[i].textContent,
              canswer.textContent
            ); // parsing the most probable answer
          }
        }
        let bestChoice = Object.keys(choicesParsed).reduce((a, b) =>
          choicesParsed[a] > choicesParsed[b] ? a : b
        );
        if (
          choicesParsed[bestChoice] >= 10 ||
          bestChoice == Object.keys(bestChoice).length - 1
        ) {
          return; // Not a good enough result
        }
        answer(bestChoice, "single node best example");
      },
      onabort: reportAJAX_Error,
      onerror: reportAJAX_Error,
      ontimeout: reportAJAX_Error,
    });
  } else if (nodes.length === 3 && nodes[1].nodeName === "EM") {
    word =
      document.getElementsByClassName("question")[0].children[2].textContent;
    console.log("stupid question about roots: " + word);
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://membean.com/mywords/${word}`,
      responseType: "json",
      onload: (rspObj) => {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(rspObj.responseText, "text/html");

        var defData = {};
        Object.values(
          htmlDoc.getElementById("word-structure").children[1].children[0]
            .children[0].children
        ).forEach((key) => {
          defData[key.children[0].textContent.trim()] =
            key.children[2].textContent.trim();
        });
        for (let [key, value] of Object.entries(defData)) {
          if (nodes[1].textContent.trim() === key.trim()) {
            console.log(
              `checking ${key}: ${value} ? ${nodes[1].textContent.trim()}`
            );
            var choices = document.getElementsByClassName("choice");
            for (let [index] of Object.keys(choices)) {
              var answerChoice = choices[index];
              var choiceNodes = answerChoice.textContent.trim().split(", ");
              if (choiceNodes.some((k) => value.includes(k))) {
                answer(index, "root structure");
                return;
              }
            }
          }
        }
      },
      onabort: reportAJAX_Error,
      onerror: reportAJAX_Error,
      ontimeout: reportAJAX_Error,
    });
  }
}

function checkExampleMultiNode() {
  // In case they italize a word we think it's the word that's the answer and then make it look "correct"
  var words = document.getElementsByClassName("choice-word");
  if (
    !Object.values(words).every((word) => {
      word.textContent.trim().indexOf(" ") >= 2 ||
        word.textContent.trim() == "I'm not sure";
    })
  ) {
    // all of them are words without spaces
    //window.console.log("multi-node answers are words");
    var bestChoices = {};
    for (let iter = 0; iter < words.length; iter++) {
      let word = words[iter].textContent.trim();

      GM_xmlhttpRequest({
        method: "GET",
        url: `https://membean.com/mywords/${word}`,
        responseType: "json",
        onload: (rspObj) => {
          var parser = new DOMParser();
          var htmlDoc = parser.parseFromString(
            rspObj.responseText,
            "text/html"
          );

          var canswer = htmlDoc.getElementsByClassName("choice answer")[0];
          if (canswer) {
            var choices = document.getElementsByClassName("choice");
            var choicesParsed = {};
            for (var i = 0; i < choices.length; i++) {
              if (choices[i].textContent === canswer.textContent) {
                answer(i, "multi node answer");
                return;
              } else {
                choicesParsed[i] = levenshtein(
                  choices[i].textContent,
                  canswer.textContent
                ); // parsing the most probable answer
              }
            }
            let bestChoice = Object.keys(choicesParsed).reduce((a, b) =>
              choicesParsed[a] > choicesParsed[b] ? a : b
            );
            if (choicesParsed[bestChoice] >= 20) {
              return; // Not a good enough result
            }
            answer(bestChoice, "best choice parsed for multi node");
          }
        },
        onabort: reportAJAX_Error,
        onerror: reportAJAX_Error,
        ontimeout: reportAJAX_Error,
      });
    }
  }
}

function cdnStoragePlugin() {
  var formatter = document.getElementsByClassName(
    "single-column-layout with-image"
  );
  if (formatter.length == 1) {
    var img = formatter[0].children[1];
    if (img.alt == "constellation question") {
      // It is a constellation question - tesseract can't parse so I'm kinda fcked for now
      var src = img.src;
      GM_xmlhttpRequest({
        method: "GET",
        url: `${apiURL}/membean/${encodeURIComponent(src)}`,
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "json",
        onload: (rspObj) => {
          (rspObj) => {
            if (rspObj.status != 200) {
              reportAJAX_Error(rspObj);
              return;
            }
            let data = rspObj.response;
            console.log(data);
            if (data.answer) {
              var choices = document.getElementsByClassName("choice");
              for (var iter = 0; iter < choices.length; iter++) {
                if (choices[iter].textContent.trim() == data.answer.trim()) {
                  answer(iter, "stored question");
                }
              }
              window.console.log(
                `[${q}] Answer: ${rspObj.response.answer[0].answer}`
              );
            }
          };
        },
        onabort: reportAJAX_Error,
        onerror: reportAJAX_Error,
        ontimeout: reportAJAX_Error,
      });
    }
  }
}

function definitionOnHoverPlugin() {
  // In case they italize a word we think it's the word that's the answer and then make it look "correct"
  var words = document.getElementsByClassName("choice-word");
  if (
    !Object.values(words).every((word) => {
      word.textContent.trim().indexOf(" ") >= 2 ||
        word.textContent.trim() == "I'm not sure";
    })
  ) {
    // all of them are words without spaces
    //window.console.log("answers are sentences");
    for (let iter = 0; iter < words.length; iter++) {
      let word = words[iter].textContent.trim();
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://membean.com/mywords/${word}`,
        responseType: "json",
        onload: (rspObj) => {
          var parser = new DOMParser();
          var htmlDoc = parser.parseFromString(
            rspObj.responseText,
            "text/html"
          );

          var definition = htmlDoc.getElementsByClassName("def-text");
          if (definition.length > 0) {
            words[iter].title = definition[0].textContent.trim();

            // Checking here for filler questions like 1 + _ = 3 and the def we get is 1 + 2 = 3
            var processed_question = cache.q.textContent
              .replace("_", word)
              .replaceAll("_", "")
              .trim();
            var sentences = Object.values(
              htmlDoc
                .getElementById("context-paragraph")
                .textContent.split(". ")
            ).map((val) => val.trim() + ".");
            sentences.push(definition[0].textContent.trim());
            for (var s_iter = 0; s_iter < sentences.length; s_iter++) {
              var similarity = levenshtein(
                sentences[s_iter],
                processed_question.trim()
              );
              if (similarity < 40) {
                window.console.log(
                  `Similarity: ${similarity}: ${definition[0].textContent.trim()} / ${processed_question.trim()}`
                );
                answer(iter, `best similarity for def hover: ${similarity}`);
              } else {
                //window.console.log(
                //     `Invalid Hint-Def: ${similarity} - ${sentences[s_iter]} != ${processed_question.trim()}`
                // );
              }
            }
            //window.console.log(`Set title for ${word}`);
          }
        },
        onabort: reportAJAX_Error,
        onerror: reportAJAX_Error,
        ontimeout: reportAJAX_Error,
      });
    }
  } else {
    //window.console.log("answers are words");
    var hint_nodes = cache.q.children;
    if (cache.hint_nodes !== hint_nodes) {
      cache.hint_nodes = hint_nodes;
      if (hint_nodes.length == 2 && hint_nodes[1].nodeName === "EM") {
        var word = hint_nodes[1].textContent;
        if (
          word[word.length - 1] === "s" &&
          !"aeious".split("").includes(word[word.length - 2])
        ) {
          word = word.slice(0, word.length - 1);
        }
        window.console.log("Italicised word " + word);
        GM_xmlhttpRequest({
          method: "GET",
          url: `https://membean.com/mywords/${word}`,
          responseType: "json",
          onload: (rspObj) => {
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(
              rspObj.responseText,
              "text/html"
            );

            var def = htmlDoc.getElementsByClassName("def-text");

            if (def.length > 0) {
              var processed_question = cache.q.textContent
                .replace("_", word)
                .replaceAll("_", "");
              var sentences = Object.values(
                htmlDoc
                  .getElementById("context-paragraph")
                  .textContent.split(". ")
              ).map((val) => val.trim() + ".");
              sentences.push(def[0].textContent.trim());
              for (var iter = 0; iter < sentences.length; iter++) {
                var similarity = levenshtein(
                  sentences[iter],
                  processed_question.trim()
                );
                if (similarity < 30) {
                  window.console.log(
                    `Similarity: ${similarity}: ${definition[0].textContent.trim()} / ${processed_question.trim()}`
                  );
                  answer(iter, "best similarity for multi def hover");

                  return;
                } else {
                  //window.console.log(
                  //              `Invalid Hint-Def: ${similarity} - ${
                  //  sentences[iter]
                  //                      } != ${processed_question.trim()}`
                  //   );
                }
              }
              cache.q.title = def[0].textContent.trim();
            } else {
              window.console.log("No def");
            }
          },
          onabort: reportAJAX_Error,
          onerror: reportAJAX_Error,
          ontimeout: reportAJAX_Error,
        });
      }
    }
  }
}

function autoTypeNewWordPlugin() {
  var letters = document.getElementsByClassName("rest-letters");
  if (letters.length >= 1) {
    var word = document.getElementById("pronounce-sound");
    if (word) {
      var text = word.attributes[3].value.split("-")[1];
      setTimeout(() => (document.getElementById("choice").value = text), 1000);
    }
  }
}

function autoAnswerTextInputPlugin() {
  var valid = document.getElementsByClassName("single-column-layout cloze");

  if (valid.length > 0) {
    var v = valid[0];
    if (v === cache.v) {
      return;
    }
    cache.v = v;
    console.log("typing question");
    //setTimeout(() => document.getElementById("notsure").click(), 600);
  }
}

function autoStartNewSessionPlugin() {
  var valid = document.getElementsByClassName("button-to");
  if (valid.length > 0) {
    Object.values(valid).reverse()[0].children[0].click();
  }
}

function processJSON_Response(rspObj) {
  if (rspObj.status != 200) {
    reportAJAX_Error(rspObj);
  } else {
    window.console.log(rspObj.responseText);
  }
}

function reportAJAX_Error(rspObj) {
  console.log(rspObj);
  window.console.log(
    `TM scrpt (membean-tracker) => Error ${rspObj.status}!  ${rspObj.statusText} (${rspObj.url})`
  );
}

const levenshtein = function (a, b) {
  // difference between strings for helping w/ similar membean answers
  if (a.length == 0) return b.length;
  if (b.length == 0) return a.length;

  // swap to save some memory O(min(a,b)) instead of O(a)
  if (a.length > b.length) {
    var tmp = a;
    a = b;
    b = tmp;
  }

  var row = [];
  // init the row
  for (var i = 0; i <= a.length; i++) {
    row[i] = i;
  }

  // fill in the rest
  for (var z = 1; z <= b.length; z++) {
    var prev = z;
    for (var j = 1; j <= a.length; j++) {
      var val;
      if (b.charAt(z - 1) == a.charAt(j - 1)) {
        val = row[j - 1]; // match
      } else {
        val = Math.min(
          row[j - 1] + 1, // substitution
          prev + 1, // insertion
          row[j] + 1
        ); // deletion
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[a.length] = prev;
  }

  return row[a.length];
};
