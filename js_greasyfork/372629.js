// ==UserScript==
// @name         Wanikani Anki Mode
// @namespace    ckarisch
// @version      1.10.4
// @description  Anki mode for Wanikani
// @author       Christof Karisch
// @match        https://www.wanikani.com/review/session*
// @match        http://www.wanikani.com/review/session*
// @grant        none
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/372629/Wanikani%20Anki%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/372629/Wanikani%20Anki%20Mode.meta.js
// ==/UserScript==

//Original author: Oleg Grishin <og402@nyu.edu>, Mempo (edited the original script)
(function(global) {
  'use strict';

  //===================================================================
  // Initialization of the Wanikani Open Framework.
  //-------------------------------------------------------------------
  var script_name = 'Wanikani Anki Mode';
  var wkof_version_needed = '1.0.27';
  if (!window.wkof) {
    if (confirm(script_name + ' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'))
      window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
    return;
  }
  if (wkof.version.compare_to(wkof_version_needed) === 'older') {
    if (confirm(script_name + ' requires Wanikani Open Framework version ' + wkof_version_needed + '.\nDo you want to be forwarded to the update page?'))
      window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
    return;
  }

  wkof.include('ItemData, Settings');
  wkof.ready('document,ItemData,Settings').then(startup);
  //===================================================================

  console.log('/// Start of Wanikani Anki Mode');
  let buttonOffsetTopTimeout;

  // Save the original evaluator
  var originalChecker = answerChecker.evaluate;

  var checkerYes = function(itemType, correctValue) {
    return {
      accurate: !0,
      passed: !0
    };
  }

  var checkerNo = function(itemType, correctValue) {
    return {
      accurate: !0,
      passed: 0
    };
  }

  var activated = false;
  var answerShown = false;

  //AUTOSTART
  var autostart = false;


  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  var observer = new MutationObserver(function(mutations, observer) {
    $("#user-response").blur();
  });

  //========================================================================
  // Startup
  //-------------------------------------------------------------------
  function startup() {
    wkof.load_css("https://raw.githubusercontent.com/ckarisch/wk-anki-mode/master/styles.css", true);


    addButtons();
    addAnswerOverlay();
    autostartFeature();
    bindHotkeys();
    bindMove();
  }


  var WKANKIMODE_toggle = function() {

    if (activated) {
      if (autostart) {
        //DISABLE ANKI MODE
        $("#WKANKIMODE_anki").text("Anki Mode Off");
        $("#answer-form form button").prop("disabled", false);
        $("#user-response").off("focus");
        $("#user-response").focus();

        answerChecker.evaluate = originalChecker;
        observer.disconnect();

        localStorage.setItem("WKANKI_autostart", false);
        activated = false;
        autostart = false;
        $("#WKANKIMODE_anki_answer").addClass("hidden");
        console.log("back to #1");


      } else {
        //ENABLE AUTOSTART
        activated = true;
        autostart = true;
        localStorage.setItem("WKANKI_autostart", true);

        $("#WKANKIMODE_anki").text("Anki Mode Auto Start");

        // start observer to force blur
        observer.observe(document.getElementById("answer-form"), {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: false
        });

        $("#WKANKIMODE_anki_answer").removeClass("hidden");
      }

    } else {
      //ENABLE ANKI MODE
      $("#WKANKIMODE_anki").text("Anki Mode On");
      $("#answer-form form button").prop("disabled", true);
      $("#user-response").on("focus", function() {
        $("#user-response").blur();
      });
      activated = true;
      autostart = false;
      // start observer to force blur
      observer.observe(document.getElementById("answer-form"), {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: false
      });

      $("#WKANKIMODE_anki_answer").removeClass("hidden");
    }

  }

  var WKANKIMODE_showAnswer = function() {
    if (!$("#answer-form form fieldset").hasClass("correct") &&
      !$("#answer-form form fieldset").hasClass("incorrect") &&
      !answerShown) {
      var i = 0;
      var answerArray = [];
      var answerArraySyn = [];
      var currentItem = $.jStorage.get("currentItem");
      var questionType = $.jStorage.get("questionType");

      if (questionType === "meaning") {
        answerArray = currentItem.en;
        answerArraySyn = currentItem.syn;
        $("#user-response").val(answerArray[0]);
        $("#WKANKIMODE_anki_answer").val(answerArray.join(", ") +
          (answerArraySyn.length > 0 ? " (" + answerArraySyn.join(", ") + ")" : ""));
      } else { //READING QUESTION
        if (currentItem.voc) {
          for (i = 0; i < (currentItem.kana.length); i++) {
            answerArray.push(currentItem.kana[i]);
          }
        } else if (currentItem.emph == 'kunyomi') {
          for (i = 0; i < (currentItem.kun.length); i++) {
            answerArray.push(currentItem.kun[i]);
          }
        } else if (currentItem.emph == 'nanori') {
          for (i = 0; i < (currentItem.nanori.length); i++) {
            answerArray.push(currentItem.nanori[i]);
          }
        } else {
          for (i = 0; i < (currentItem.on.length); i++) {
            answerArray.push(currentItem.on[i]);
          }
        }
        $("#user-response").val(answerArray[0]);
        $("#WKANKIMODE_anki_answer").val(answerArray.join(", "));
      }
      answerShown = true;
    }
  };

  var WKANKIMODE_answerYes = function() {
    if (answerShown) {
      answerChecker.evaluate = checkerYes;
      $("#answer-form form button").click();
      answerShown = false;
      answerChecker.evaluate = originalChecker;
      return;
    }

    // if answer is shown, press '1' one more time to go to next
    if ($("#answer-form form fieldset").hasClass("correct") ||
      $("#answer-form form fieldset").hasClass("incorrect")) {
      $("#answer-form form button").click();
      $("#WKANKIMODE_anki_answer").val("");
    }

  };

  var WKANKIMODE_answerNo = function() {
    if (answerShown) {
      answerChecker.evaluate = checkerNo;
      $("#answer-form form button").click();
      answerShown = false;
      answerChecker.evaluate = originalChecker;
      return;
    }

    if ($("#answer-form form fieldset").hasClass("correct") ||
      $("#answer-form form fieldset").hasClass("incorrect")) {
      $("#answer-form form button").click();
      $("#WKANKIMODE_anki_answer").val("");
    }

  };

  var addButtons = function() {
    //CHECK AUTOSTART
    autostart = localStorage.getItem('WKANKI_autostart') === "true" ? true : false;

    let buttonTop = "margin-top: " + (localStorage.getItem("buttonOffsetTop") ? localStorage.getItem("buttonOffsetTop") + "px;" : "calc(50% - 63px);");

    $("<div />", {
        id: "WKANKIMODE_anki",
        title: "Anki Mode",
      })
      .text("Anki Mode Off")
      .addClass("WKANKIMODE_button")
      .on("click", WKANKIMODE_toggle)
      .prependTo("footer");


    $("<div />", {
        id: "WKANKIMODE_anki_buttongroup",
      })
      .prependTo(".pure-u-1");

    $("<div />", {
        id: "WKANKIMODE_anki_incorrect",
        title: "No",
        style: buttonTop,
      })
      .text("Don't know")
      .addClass("WKANKIMODE_button incorrect")
      .on("click", WKANKIMODE_answerNo)
      .prependTo("#WKANKIMODE_anki_buttongroup");

    $("<div />", {
        id: "WKANKIMODE_anki_show",
        title: "Show",
        style: buttonTop,
      })
      .text("Show")
      .addClass("WKANKIMODE_button show")
      .on("click", WKANKIMODE_showAnswer)
      .prependTo("#WKANKIMODE_anki_buttongroup");

    $("<div />", {
        id: "WKANKIMODE_anki_correct",
        title: "Yes",
        style: buttonTop,
      })
      .text("Know")
      .addClass("WKANKIMODE_button correct")
      .on("click", WKANKIMODE_answerYes)
      .prependTo("#WKANKIMODE_anki_buttongroup");

    $("#WKANKIMODE_anki_buttongroup div").each(function() {
      $(this).css("margin-top", localStorage.getItem("buttonOffsetTop"));
    });
  };



  var addAnswerOverlay = function() {
    $("<input />", {
        id: "WKANKIMODE_anki_answer",
        type: "text",
        readonly: "readonly",
      })
      .addClass("WKANKIMODE_answer")
      .appendTo("#answer-form fieldset");
  };

  var autostartFeature = function() {
    console.log("///////////// AUTOSTART: " + autostart);
    if (autostart) {
      $("#WKANKIMODE_anki").text("Anki Mode Auto Start");
      $("#answer-form form button").prop("disabled", true);
      $("#user-response").on("focus", function() {
        $("#user-response").blur();
      });
      activated = true;
      // start observer to force blur
      observer.observe(document.getElementById("answer-form"), {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: false
      });
    }
  }

  var bindHotkeys = function() {
    $(document).on("keydown.reviewScreen", function(event) {
      if ($("#reviews").is(":visible") && !$("*:focus").is("textarea, input")) {
        switch (event.keyCode) {
          case 32:
            event.stopPropagation();
            event.preventDefault();
            if (activated)
              WKANKIMODE_showAnswer();
            break;
          case 49:
            event.stopPropagation();
            event.preventDefault();
            if (activated)
              WKANKIMODE_answerYes();
            break;
          case 50:
            event.stopPropagation();
            event.preventDefault();
            if (activated)
              WKANKIMODE_answerNo();
            break;
        }
      }
    });
  };

  let getPoint = function(event) {
    let point = {};
    if (event.changedTouches) {
      point.y = event.changedTouches[0].pageY;
      point.x = event.changedTouches[0].pageX;
    } else {
      point.y = event.clientY;
      point.x = event.clientX;
    }
    return point;
  }

  var bindMove = function() {
    let thumb = document.querySelector('#WKANKIMODE_anki_buttongroup');
    let divs = $('#WKANKIMODE_anki_buttongroup div');
    //console.log(localStorage.getItem("buttonOffsetTop"));


    let touchfunction = function(event) {
      let point = getPoint(event);

      //event.preventDefault(); // prevent selection start (browser action)

      let shiftY = point.y - divs.get(0).getBoundingClientRect().top;
      // shiftY not needed, the thumb moves only horizontally

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onMouseMove);
      document.addEventListener('touchend', onMouseUp);

      function onMouseMove(event) {
        let point = getPoint(event);

        let newTop = point.y - shiftY - thumb.getBoundingClientRect().top;

        // the pointer is out of slider => lock the thumb within the bounaries
        if (newTop < 0) {
          newTop = 0;
        }
        let bottomEdge = thumb.offsetHeight - divs.get(0).offsetHeight;
        if (newTop > bottomEdge) {
          newTop = bottomEdge;
        }

        divs.each(function() {
          $(this).css("margin-top", newTop);
        });
        clearTimeout(buttonOffsetTopTimeout);
        buttonOffsetTopTimeout = setTimeout(function() {
          localStorage.setItem("buttonOffsetTop", newTop);
        }, 300);

      }

      function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('touchend', onMouseUp);
        document.removeEventListener('touchmove', onMouseMove);
      }

    };

    thumb.onmousedown = touchfunction;
    thumb.ontouchstart = touchfunction;

    thumb.ondragstart = function() {
      return false;
    };
  };
})(window);
