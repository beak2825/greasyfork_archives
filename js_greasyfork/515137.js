// ==UserScript==
// @name         Edge-nuity Megascript
// @version      2.3
// @description  Completes through instructional, summary, and warm-up sections by guessing answers (they don’t impact grades). You can begin activities while the instructor is speaking, when theres an activity, a "Search clipboard" button appears for quick access to answers during quizzes (will search your copied text on brainly and auto-redirect) And much more (read desc).
// @author       TTT
// @license MIT
// @include *://*nuity.com*/*
// @include https://brainly.com/*
// @grant        none
// @namespace https://www.tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/515137/Edge-nuity%20Megascript.user.js
// @updateURL https://update.greasyfork.org/scripts/515137/Edge-nuity%20Megascript.meta.js
// ==/UserScript==
function redirectToStudent() {
    const currentHref = window.location.href; 
 
    const newHref = currentHref.replace("core.learn", "student");
 
    window.location.href = newHref;
}
 
if (window.location.href.includes("core.learn") && window.location.href.includes("/EdgeAuth/lti/goodbye")) {
 
    setInterval(redirectToStudent, 1000);
}
 
function clickVisibleElementWithClass() {
    const elements = document.getElementsByClassName('btn btn-primary modal-dialog-button');
 
    for (let i = 0; i < elements.length; i++) {
        const targetElement = elements[i];
        const computedStyle = window.getComputedStyle(targetElement);
        const boundingRect = targetElement.getBoundingClientRect();
 
        const isVisible =
            computedStyle.opacity !== '0' &&
            computedStyle.visibility !== 'hidden' &&
            computedStyle.display !== 'none' &&
            boundingRect.width > 0 &&
            boundingRect.height > 0;
 
        if (isVisible) {
            const simulatedClickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            targetElement.dispatchEvent(simulatedClickEvent);
            console.log('Clicked a visible button!');
            addBeforeUnloadListener(); 
            break;
        }
    }
}
 
setInterval(clickVisibleElementWithClass, 1000);
 
const checkElementVisibility = (element) => {
    const boundingRect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    return (
        computedStyle.opacity !== '0' &&
        computedStyle.visibility !== 'hidden' &&
        computedStyle.display !== 'none' &&
        boundingRect.width > 0 &&
        boundingRect.height > 0
    );
};
 
const checkForTimerStayElement = () => {
    const targetElement = document.getElementById('timerStay');
 
    if (targetElement && checkElementVisibility(targetElement)) {
        const simulatedClickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        targetElement.dispatchEvent(simulatedClickEvent);
        console.log('Clicked timerStay element!');
        addBeforeUnloadListener(); 
    }
};
 
if (window.top === window.self) {
    const intervalId = setInterval(checkForTimerStayElement, 100);
}
 
const addBeforeUnloadListener = () => {
    window.onbeforeunload = function (event) {
        const message = 'Are you sure you want to leave this page?';
        event.returnValue = message; 
        return message; 
    };
};
let videoElement = null;
let alertTriggered = false;
let alertScheduled = false;
 
const callback = function(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      videoElement = document.getElementById("home_video_js");
      if (videoElement) {
        startCheckingVideo();
 
        observer.disconnect();
      }
    }
  }
};
 
const config = {
  attributes: false,
  childList: true,
  subtree: true
};
 
const targetNode = document.body;
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
 
function insertDiv() {
    let logoImage = document.querySelector('img.course-logo-bug[src="/images/logobug-edge-ex.png"][alt="Edge EX"]');
    if (logoImage && !document.getElementById('testDiv')) {
 
        const testDiv = document.createElement('div');
        testDiv.id = 'testDiv';
        testDiv.style.fontFamily = 'Atkinson Hyperlegible';
        testDiv.style.color = 'black';
        testDiv.style.margin = '10px';
        testDiv.style.width = 'calc(100% - 20px)';
        testDiv.style.maxWidth = '999px';
        testDiv.style.marginLeft = 'auto';
        testDiv.style.marginRight = 'auto';
        testDiv.style.position = 'fixed';
        testDiv.style.top = '50%';
        testDiv.style.left = '50%';
        testDiv.style.transform = 'translate(-50%, -50%)';
        testDiv.style.backgroundColor = 'aqua';
        testDiv.style.padding = '10px';
        testDiv.style.borderRadius = '5px';
        testDiv.style.zIndex = '2147483647';
 
        const firstItemContainer = document.createElement('div');
 
        const textSpan = document.createElement('span');
        textSpan.style.display = 'inline';
        textSpan.textContent = "Sadly, the script you downloaded (Edge-nuity Megascript) Does not support Edge-x classes, which you have one or more of. (Each marked by):";
 
        firstItemContainer.appendChild(textSpan);
 
        const imageContainer = document.createElement('span');
        imageContainer.style.display = 'inline';
        imageContainer.style.marginLeft = '10px';
 
        const imgElement1 = document.createElement('img');
        imgElement1.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAACSVBMVEUAAAAAAAAAAIAAAIAAAGYAAHEAAIAAAHQAAHcAAIAAAHkAAIAAAHkAAIAAAHoAAIAAAIAAAHsAAIAAAHsAAIAAAHwAAHwAAHkAAHwAAHkAAH0AAHoAAHoAAH0AAHsAAH0AAH0AAHsAAHsAAHwAAHoAAHsAAHwAAHsAAH0AAH0AAHsAAHwAAH0AAHsAAHwAAHwAAHwAAH0AAH0AAHwAAHsAAHwAAHsAAHwAAHwAAHwAAHwAAHwAAH0AAHwAAHsAAHwAAHwAAHsAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAH0AAHsAAHwAAHsAAHwAAHsAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwAAHwCAn0DA34EBH4FBX8GBn8NDYMQEIQREYUSEoUXF4gYGIgZGYkaGokhIY0jI44qKpIxMZU1NZc4OJk5OZk6Opo7O5o8PJs9PZtAQJ1DQ55ERJ9GRqBHR6BJSaFKSqJMTKNSUqZVVaheXqxmZrBnZ7FoaLFqarJsbLN3d7l6ert8fLyDg7+EhMCFhcCHh8GLi8OVlcmZmcudnc2fn86goM6hoc+ios+kpNCqqtOrq9StrdWvr9axsdezs9i2ttm3t9q6uty7u9zGxuLMzOXNzeXOzubS0ujU1OnV1enX1+rY2Ovm5vLt7fbw8Pfx8fjy8vjz8/n29vr39/v4+Pv5+fz6+vz9/f7+/v7///9aaBvrAAAAaXRSTlMAAQIEBQkKCw8QExQVGBkaHB0eHyIjJSYnKi0uMDM0NTc8PkhLTVJTWl5faWpub3uAg4uMmZqbnKSmp6ussba3vb7AwcPEx8jKy9TX29zd3t/g4ePl5+jp6uvv8PHy9PX29/j5+vv8/f5VPlHWAAAAAWJLR0TC/W++1AAAAixJREFUGBmNwYlDi3EcB+DvshZCh0hIEYlKhYjRnKEoSm6ion2Wlkju+0quotx3rsqR3BrZ9y/zvvu97/Zu7d32POQjZkbuso3bsGvz6rzM8QYKICK9AFrF2dGkIzxrK3xV5UaRPykl8GdHpoF8GWdboSM/kryZ8qGvZCxpRaxEIOXx5GG0ILD1UeQ2B8EUGEmRYkVQOSSEFyO4qgRyyUIoLCSL2IKQJJEkHaFZSJJVcKl/0N3j1nkSgr397U0Ie4YRxUB4zFp/rkBmf8PMLRDSiGZC6GUvjssA6l6z5D6EeURzIdxjb45LqHvFkn9nIBQRLYdgu/7wkaqXJf3NnSxx3oCi2khlcNvfIKkHcOADq5y34BZHO6Hq6GdZ3zGg4SMLzlZ4TKR9UBxnRReAg59Y5myDxmSqgOI8K94DqH3JsoFz0JhEm6Co7WYXx1XA9pyF32fhMY7WQGU7cVFyoRGwPWXVr9NQWU2UB48jLddcXrDs7meW/DwFRSnRLLg1/2WN2zjUx5IfRyGYiSbArYs17gBo/MKSDggZRIZiqJ6wRztkh78ycytcamKJKBuqpp4BFr61QWh69/2ZHS5LSBJdiZCkkiwXoSgMI9nI7QjBVBIyEZyZFIbFCKYsklQj1iGwimTyGFOOQPZOI624tdBXOZ28jVoBPaXJ5GtITjX8Mg8nPxIsGKwwhXQkLdgNrZqlqWGkb2ja/KJqyKwbFmXEUlDG0YlTEuNNNNh/Z1K0M41d9QQAAAAASUVORK5CYII=';
        imgElement1.alt = 'Embedded Image';
        imgElement1.style.maxHeight = '50px';
 
        imageContainer.appendChild(imgElement1);
 
        firstItemContainer.appendChild(imageContainer);
 
        testDiv.appendChild(firstItemContainer);
 
        const additionalInfoDiv = document.createElement('div');
        additionalInfoDiv.style.marginTop = '10px';
        additionalInfoDiv.textContent = "However, I'm gonna work on adding it as soon as possible, join ";
 
        const link = document.createElement('a');
        link.href = "https://discord.gg/6qJwkYSmrQ";
        link.target = "_blank";
        link.style.color = 'blue';
        link.style.textDecoration = 'underline';
        link.textContent = "HERE";
 
        additionalInfoDiv.appendChild(link);
        additionalInfoDiv.append(" and ping me \"@TallTacoTristan\" in any chat if you want to volunteer your own class, which I will complete for you in return.");
 
        testDiv.appendChild(additionalInfoDiv);
 
        const line3Div = document.createElement('div');
        line3Div.style.marginTop = '10px';
        line3Div.textContent = "If not, simply note: only normal classes are supported, any normal class is marked by:";
 
        const imageContainer2 = document.createElement('span');
        imageContainer2.style.display = 'inline';
        imageContainer2.style.marginLeft = '10px';
        const imgElement2 = document.createElement('img');
        imgElement2.src = 'data:image/png;base64,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';
        imgElement2.alt = 'Courseware Image';
        imgElement2.style.maxHeight = '50px';
 
        imageContainer2.appendChild(imgElement2);
        line3Div.appendChild(imageContainer2);
        testDiv.appendChild(line3Div);
 
        document.body.appendChild(testDiv);
    }
}
 
setInterval(function () {
    if (window.location.href.includes("student.") && window.location.href.includes(".com/")) {
        insertDiv();
    }
}, 1000);
 
 
function startCheckingVideo() {
  setInterval(() => {
    if (videoElement) {
      const currentTime = videoElement.currentTime;
      const duration = videoElement.duration;
 
      if (currentTime >= duration) {
        if (!alertScheduled) {
          alertScheduled = true;
          let checksCount = 0;
          let allChecksPassed = true;
 
          const intervalId = setInterval(() => {
            const homeVideoContainer = document.getElementById("home_video_container");
            if (homeVideoContainer && homeVideoContainer.parentNode.style.opacity == 1) {
              checksCount++;
            } else {
              allChecksPassed = false;
            }
 
            if (checksCount === 10) {
              clearInterval(intervalId);
              if (allChecksPassed) {
                new Notification("Reload!");
                alertTriggered = true;
              }
              alertScheduled = false;
            }
          }, 100);
        }
      } else {
        alertTriggered = false;
      }
    }
  }, 550);
}
 
 
(function() {
    'use strict';
 
    let completeCount = 0;
 
    const originalConsoleLog = console.log;
    console.log = function() {
        const message = Array.from(arguments).join(' ');
        if (message.includes('complete')) {
            completeCount++;
            if (completeCount === 2) {
                const goRightButton = document.querySelector('li.FrameRight a');
                if (goRightButton) {
                    goRightButton.click();
                    completeCount = 0;
                }
            }
        }
        originalConsoleLog.apply(console, arguments);
    };
})();
function checkAutoplay() {
    const autoplayCheckbox = document.getElementById('autoplayCheckbox');
 
    // Check if the checkbox exists before accessing its properties
    if (autoplayCheckbox && autoplayCheckbox.checked) {
        playVideo();
    }
}
if (window.top === window.self && window.location.href.includes('core.learn')) {
    setInterval(checkAutoplay, 1000);
}
 
function playVideo() {
    var playButton = window.frames[0].document.getElementById("uid1_play");
    if (playButton != undefined) {
        setTimeout(function() {
            if (playButton.className == "play") {
                playButton.children[0].click();
            }
        }, 1000);
    }
}
 
    function showColumn() {
        try {
            window.frames[0].frames[0].document.getElementsByClassName("right-column")[0].children[0].style.display = "block";
        } catch (TypeError) {}
 
        try {
            window.frames[0].frames[0].document.getElementsByClassName("left-column")[0].children[0].style.display = "block";
        } catch (TypeError) {}
    }
if (window.top === window.self) {
    setInterval(showColumn, 1000);}
 
 
function clearLocalStorage() {
    try {
        localStorage.clear();
    } catch (error) {}
}
 
function removeElementsByClassName(className) {
    var elements = document.getElementsByClassName(className);
    Array.prototype.forEach.call(elements, function(element) {
        try {
            element.parentNode.removeChild(element);
        } catch (error) {}
    });
}
 
function handleOnload() {
    var classNamesToRemove = [
        "brn-expanded-bottom-banner",
        "brn-brainly-plus-box",
        "brn-fullscreen-toplayer",
        "sg-overlay sg-overlay--dark"
    ];
    classNamesToRemove.forEach(function(className) {
        removeElementsByClassName(className);
    });
}
 
if (window.location.href.includes("brainly.com")) {
    clearLocalStorage();
    handleOnload();
}
 
function redirectToFirstSearchItem() {
    if (window.location.href.startsWith('https://brainly.com/app/ask')) {
        const searchItem = document.querySelector('[data-testid="search-item-facade-wrapper"]');
        if (searchItem) {
            const anchorElement = searchItem.querySelector('a');
            if (anchorElement) {
                const href = anchorElement.getAttribute('href');
                const fullUrl = `https://brainly.com${href}`;
                window.location.href = fullUrl;
                clearInterval(interval);
            }
        }
    }
}
const interval = setInterval(redirectToFirstSearchItem, 1000);
 
 
 
function checkElement() {
    const element = document.querySelector('[data-testid="answer_box"][data-test="locked_answer"]');
 
    if (element && document.location.href.includes("brainly.com/question")) {
        location.reload();
    }
}if (window.top === window.self) {
setInterval(checkElement, 750);}
 
 
 
function extractTextFromIframe() {
  var iframeDocument = window.frames[0].document;

  var targetElements = iframeDocument.getElementsByClassName("Assessment_Main_Body_Content_Question");

  var visibleElements = Array.from(targetElements).filter(function(element) {
    return element.style.display !== "none" && element.id.includes("q_");
  });

  if (visibleElements.length > 0) {
    var finalTextOutput = [];

    var regex = />([^<]+)</g;
    var regexSpecial = /»([^«]+)«/g;
    var regexCleanUp = /[\n\r]+|<[^>]*>| | /g;

    visibleElements.forEach(function(targetElement) {
      var elementText = "";

      let matches;
      while ((matches = regex.exec(targetElement.innerHTML)) !== null) {
        var extractedText = matches[1].trim();
        if (extractedText && !/(class|src|align|style)=/i.test(extractedText)) {
          elementText += extractedText + " ";
        }
      }

      while ((matches = regexSpecial.exec(targetElement.innerHTML)) !== null) {
        var extractedText = matches[1].trim();
        if (extractedText && !/(class|src|align|style)=/i.test(extractedText)) {
          elementText += extractedText + " ";
        }
      }

      var imgElements = targetElement.getElementsByTagName("img");
      Array.from(imgElements).forEach(function(img) {
        if (img.alt) {
          elementText += img.alt.trim() + " ";
        }
      });

      elementText = elementText.replace(regexCleanUp, ' ').trim();
      elementText = elementText.replace(/\u00A0/g, ' ');

      if (elementText) {
        finalTextOutput.push(elementText);
      }
    });

    // Using the Clipboard API to copy text
    const textToCopy = finalTextOutput.join("\n").replace(/\s+/g, ' ');

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log('Text copied to clipboard');

        // Optional: Trigger the search clipboard button if it exists
        setTimeout(function() {
          var buttons = Array.from(document.getElementsByTagName('button'));
          var searchClipboardButton = buttons.find(button => button.innerText === "Search Clipboard");
          if (searchClipboardButton) {
            searchClipboardButton.click();
          } else {
            alert("Make sure the Search Clipboard button is checked in the options pane.");
          }
        }, 101);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }
}
 
const activityTitleElement = document.getElementById("activity-title");
 
if (activityTitleElement) {
    const activityTitleText = activityTitleElement.textContent || activityTitleElement.innerText;
 
    function handleAssessment() {
        setTimeout(() => {
            extractTextFromIframe();
        }, 250);
 
        const iframe = window.frames[0];
        const iframeDocument = iframe.document;
 
        const targetElements = iframeDocument.getElementsByClassName("Assessment_Main_Body_Content_Question");
 
        const visibleElements = Array.from(targetElements).filter(function(element) {
            return element.style.display !== "none" && element.id.includes("q_");
        });
 
    }
 
    function handleAssignment() {
        const nestedIframeDocument = window.frames[0].frames[0].document;
        const contentElements = nestedIframeDocument.getElementsByClassName("content");
        const altElements = nestedIframeDocument.querySelectorAll('[alt]');
        let contentText = '';
 
        if (contentElements.length > 0) {
            contentText = Array.from(contentElements)
                .map(element => element.innerText)
                .join('\n');
        }
 
        const altValues = Array.from(altElements)
            .map(element => element.getAttribute('alt'))
            .join('\n');
 
        const combinedText = contentText + (contentText && altValues ? '\n' : '') + altValues;
 
        if (combinedText) {
            navigator.clipboard.writeText(combinedText)
                .then(() => {
                    console.log('Content copied to clipboard!');
 
                    setTimeout(() => {
                        clickSearchClipboard();
                    }, 100);
                });
        }
    }
 
    document.addEventListener('keydown', function(event) {
        if (event.key === '3') {
            if (activityTitleText.includes("Test") || activityTitleText.includes("Exam") || activityTitleText.includes("Quiz")) {
                handleAssessment();
            } else if (activityTitleText.includes("Assignment")) {
                handleAssignment();
            }
        }
    });
}
 
function clickSearchClipboard() {
    const buttons = Array.from(document.querySelectorAll('button'));
    const buttonToClick = buttons.find(button => button.innerText === 'Search Clipboard');
    if (buttonToClick) {
        buttonToClick.click();
    } else {
        alert("Make sure the Search Clipboard button is checked in the options pane.");
    }
}
 
function addKeyListener() {
    const frame = window.frames[0];
    const initialButtonCheck = document.getElementById('searchActionButton');
 
    if (!window.location.href.includes("nuity")) {
        return;
    }
 
    if (frame && !frame.keyListenerAdded) {
        frame.keyListenerAdded = true;
 
        frame.document.addEventListener('keydown', function(event) {
            if (event.key === '3') {
                const activityTitleText = document.getElementById('activity-title')?.textContent || '';
 
                if (activityTitleText.includes("Assignment")) {
                    handleAssignment();
                }
 
                if (activityTitleText.includes("Test") || activityTitleText.includes("Exam") || activityTitleText.includes("Quiz")) {
                    handleAssessment();
                }
 
                if (initialButtonCheck) {
                    initialButtonCheck.click();
                }
            }
        });
    }
}
 
if (window.location.href.includes('core.learn')) {
 
setInterval(addKeyListener, 1000);
}
 
function checkForButton() {
  const iframeDocument = window.frames[0].document;
  const audioEntryButton = iframeDocument.getElementById('btnEntryAudio');
 
  if (audioEntryButton) {
    const existingButton = iframeDocument.getElementById('searchActionButton');
 
    if (!existingButton) {
      const searchActionButton = iframeDocument.createElement('button');
      searchActionButton.innerText = "Search question";
      searchActionButton.id = "searchActionButton";
 
      searchActionButton.style.webkitTextSizeAdjust = "100%";
      searchActionButton.style.borderSpacing = "0";
      searchActionButton.style.borderCollapse = "collapse";
      searchActionButton.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
      searchActionButton.style.display = "inline-block";
      searchActionButton.style.boxSizing = "border-box";
      searchActionButton.style.height = "28px";
      searchActionButton.style.border = "1px solid #8d8e8f";
      searchActionButton.style.color = "#ffffff";
      searchActionButton.style.fontSize = "13px";
      searchActionButton.style.lineHeight = "28px";
      searchActionButton.style.fontWeight = "bold";
      searchActionButton.style.textDecoration = "none";
      searchActionButton.style.webkitFontSmoothing = "antialiased";
      searchActionButton.style.whiteSpace = "nowrap";
      searchActionButton.style.textShadow = "0 0 5px rgba(255, 255, 255, 0.6)";
      searchActionButton.style.zoom = "1";
      searchActionButton.style.webkitBorderRadius = "3px";
      searchActionButton.style.backgroundColor = "#1a1a1a";
      searchActionButton.style.backgroundPosition = "center bottom";
      searchActionButton.style.backgroundSize = "100% 100%";
      searchActionButton.style.boxShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)";
      searchActionButton.style.cursor = "pointer";
      searchActionButton.style.userSelect = "none";
      searchActionButton.style.position = "relative";
      searchActionButton.style.padding = "0 40px";
      searchActionButton.style.textAlign = "center";
      searchActionButton.style.margin = "0 10px";
 
      audioEntryButton.parentElement.appendChild(searchActionButton);
 
      searchActionButton.style.position = "absolute";
      searchActionButton.style.left = "50%";
      searchActionButton.style.transform = "translateX(-50%)";
 
      const bottomTrayElements = iframeDocument.querySelectorAll('[class*="bottom-tray"]');
      bottomTrayElements.forEach(trayElement => {
        trayElement.style.position = 'relative';
        const buttonClone = searchActionButton.cloneNode(true);
        trayElement.appendChild(buttonClone);
        buttonClone.style.position = "absolute";
        buttonClone.style.left = "50%";
        buttonClone.style.transform = "translateX(-50%)";
      });
    }
  }
}
if (window.top === window.self && window.location.href.includes('core.learn')) {
const buttonCheckInterval = setInterval(checkForButton, 500);
}
 
 
const observerConfig = {
    attributes: false,
    childList: true,
    subtree: true
};
 
const mutationCallback = function(mutations, observerInstance) {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            const detectedElements = document.querySelectorAll('.mark-return');
            if (detectedElements.length > 0) {
                appendSearchButton(detectedElements[0].parentNode);
            }
        }
    }
};
 
const appendSearchButton = function(parentContainer) {
    const existingButton = document.getElementById('uniqueSearchButtonId');
    if (existingButton) return;
 
    const searchActionButton = document.createElement('button');
    searchActionButton.innerText = "Search question";
    searchActionButton.id = "uniqueSearchButtonId";
 
    searchActionButton.style.webkitTextSizeAdjust = "100%";
    searchActionButton.style.borderSpacing = "0";
    searchActionButton.style.borderCollapse = "collapse";
    searchActionButton.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
    searchActionButton.style.display = "inline-block";
    searchActionButton.style.boxSizing = "border-box";
    searchActionButton.style.height = "28px";
    searchActionButton.style.border = "1px solid #8d8e8f";
    searchActionButton.style.color = "#ffffff";
    searchActionButton.style.fontSize = "13px";
    searchActionButton.style.lineHeight = "28px";
    searchActionButton.style.fontWeight = "bold";
    searchActionButton.style.textDecoration = "none";
    searchActionButton.style.webkitFontSmoothing = "antialiased";
    searchActionButton.style.whiteSpace = "nowrap";
    searchActionButton.style.textShadow = "0 0 5px rgba(255, 255, 255, 0.6)";
    searchActionButton.style.zoom = "1";
    searchActionButton.style.webkitBorderRadius = "3px";
    searchActionButton.style.backgroundColor = "#1a1a1a";
    searchActionButton.style.backgroundPosition = "center bottom";
    searchActionButton.style.backgroundSize = "100% 100%";
    searchActionButton.style.boxShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)";
    searchActionButton.style.cursor = "pointer";
    searchActionButton.style.userSelect = "none";
 
    searchActionButton.style.position = "absolute";
    searchActionButton.style.left = "35%";
    searchActionButton.style.top = "50%";
    searchActionButton.style.transform = "translate(-70%, -50%)";
 
    parentContainer.style.position = "relative";
    parentContainer.appendChild(searchActionButton);
};
 
const targetElement = document.body;
 
const observerInstance = new MutationObserver(mutationCallback);
 
observerInstance.observe(targetElement, observerConfig);
 
(function() {
    function checkAndAddListener() {
        const frame = window.frames[0];
 
        if (frame && frame.document) {
            const button = frame.document.getElementById("searchActionButton");
 
            if (button) {
                if (!button.dataset.listenerAdded) {
                    button.addEventListener('click', handleAssignment);
                    button.dataset.listenerAdded = true;
                    console.log("Listener added to the button within the iframe.");
                }
            }
        }
    }
if (window.top === window.self && window.location.href.includes('core.learn')) {
    setInterval(checkAndAddListener, 500);}
})();
 
if (window.top === window.self) {
function monitorFrameForButton() {
    const frame = window.frames[0];
 
    const checkInterval = setInterval(() => {
        if (frame && frame.document) {
            const button = frame.document.getElementById('uniqueSearchButtonId');
            if (button) {
                if (!frame.hasListenerAdded) {
                    button.addEventListener('click', handleAssessment);
                    frame.hasListenerAdded = true;
                    console.log('Listener added to the button.');
 
                    clearInterval(checkInterval);
                }
            }
        }
    }, 100);
}
 
monitorFrameForButton();
}
 
let buttonsClicked = false;
 
function updateTextareaAndClickButtonsOnce() {
    try {
        const frame = window.frames[0];
        const innerFrame = frame ? frame.frames[0] : null;
 
        if (innerFrame) {
            const iframeDoc = innerFrame.document;
 
            if (iframeDoc.readyState === 'complete') {
                const textarea = iframeDoc.querySelector('.QuestionTextArea');
 
                // Check if textarea is empty before updating
                if (textarea && textarea.value.trim() === '') {
                    const answerChoices = iframeDoc.querySelectorAll('.answer-choice-label');
 
                    let allText = '';
 
                    answerChoices.forEach(choice => {
                        allText += choice.textContent.trim() + '\n';
                    });
 
                    // Update the textarea
                    textarea.value = allText.trim();
 
                    // Call the API check after 1 second
                    setTimeout(() => {
                        window.frames[0].API.Frame.check();
                    }, 1000);
 
                    const buttons = iframeDoc.querySelectorAll('.answer-choice-button');
 
                    buttons.forEach(button => {
                        if (button) {
                            button.click();
                        }
                    });
 
                    const doneButtons = iframeDoc.querySelectorAll('.done-start');
                    setTimeout(() => {
                        doneButtons.forEach(doneButton => {
                            if (doneButton) {
                                doneButton.click();
                            }
                        });
 
                        const retryButtons = iframeDoc.querySelectorAll('.done-retry');
                        setTimeout(() => {
                            retryButtons.forEach(retryButton => {
                                if (retryButton) {
                                    retryButton.click();
                                }
                            });
                        }, 400);
                    }, 200);
                }
            }
        }
    } catch (error) {
        console.error("An error occurred:", error); // Optional: Log the error to the console
    }
}
 
function checkUpdateTextareaAndClickButtonsOnce() {
    const isAutoWritingChecked = document.getElementById('autoWritingCheckbox').checked;
 
    if (isAutoWritingChecked) {
        updateTextareaAndClickButtonsOnce();
    }
}
 
if (window.top === window.self && window.location.href.includes('core.learn')) {
    setInterval(checkUpdateTextareaAndClickButtonsOnce, 1000);
}
 
function checkOpacity() {
    if (frames[0] && frames[0].document) {
        var homeVideoContainer = frames[0].document.getElementById("home_video_container");
        if (homeVideoContainer && homeVideoContainer.parentNode.style.opacity == 1) {
        } else {
            try {
                if (document.getElementById("activity-title").innerText == "Assignment") {}
                if (["Instruction", "Summary", "Warm-Up"].includes(document.getElementById("activity-title").innerText)) {
                    try {
                        window.options = window.frames[0].frames[0].document.getElementsByClassName("answer-choice-button");
                        window.options[Math.floor(Math.random() * window.options.length)].click();
                    } catch (TypeError) {}
                    try {
                        window.frames[0].API.Frame.check();
                    } catch (TypeError) {}
                }
            } catch (TypeError) {}
        }
    }
}
 
function checkcheckOpacity() {
    const isGuessingChecked = document.getElementById('guessingCheckbox').checked;
    if (isGuessingChecked) {
        checkOpacity();
    }
}
if (window.top === window.self && window.location.href.includes('core.learn')) {
setInterval(checkcheckOpacity, 1000);
}
 
function clickOnFootnavWhenGradebarVisible() {
    // Function to check if an element is visible
    function isElementVisible(element) {
        return !!(element && element.offsetWidth && element.offsetHeight);
    }

    // Select the gradebar element
    var gradeBar = document.querySelector('.gradebar');

    // Check if gradeBar is visible and its innerText includes "completed"
    if (isElementVisible(gradeBar) && gradeBar.innerText.includes('completed')) {
        // Select the element to click
        var footNav = document.querySelector('.footnav.goRight');

        // Check if the footNav element exists
        if (footNav) {
            footNav.click(); // Simulate a click on the footNav element
        }
    }
}

function clickOnFootnavWhenGradebarVisible() {
    // Function to check if an element is visible
    function isElementVisible(element) {
        return !!(element && element.offsetWidth && element.offsetHeight);
    }

    // Select the gradebar element
    var gradeBar = document.querySelector('.gradebar');

    // Check if gradeBar is visible and its innerText includes "completed"
    if (isElementVisible(gradeBar) && gradeBar.innerText.includes('completed')) {
        // Select the element to click
        var footNav = document.querySelector('.footnav.goRight');

        // Check if the footNav element exists
        if (footNav) {
            footNav.click(); // Simulate a click on the footNav element
        }
    }
}

setInterval(function() {
    const autoAdvanceCheckbox = document.getElementById('autoAdvanceCheckbox'); // Check for checkbox existence
    if (autoAdvanceCheckbox && autoAdvanceCheckbox.checked) { // Only proceed if checkbox exists and is checked
        if (frames[0] && frames[0].document) { // Check if frames[0] and its document exist
            const homeVideoContainer = frames[0].document.getElementById("home_video_container"); // Access the home video container
            if (homeVideoContainer && homeVideoContainer.parentNode && homeVideoContainer.parentNode.style.opacity == 1) {
                // Do nothing if the container is visible
            } else {
                // Call the function to click foot navigation and go to the next frame
                clickFootnavAndNextFrame();
                clickOnFootnavWhenGradebarVisible();
            }
        }
    }
}, 1000); // Executes every 1000 milliseconds (1 second)
 
setInterval(function() {
    var element = document.getElementById("invis-o-div");
    if (element) {
        element.remove();
    }
}, 1000);
if (window.top === window.self && window.location.href.includes('core.learn')) {
 
setInterval(() => {
    const checkBox = document.getElementById('autoShowCheckbox'); // Check for existence in each interval.
 
    if (checkBox && checkBox.checked) { // Use the presence check before accessing 'checked'.
        updateDisplay();
        clickShowButtons();
    }
}, 1000);
}
 
function updateDisplay() {
    const outerFrame = window.frames[0];
    if (outerFrame && outerFrame.frames && outerFrame.frames[0]) {
        const elements = outerFrame.frames[0].document.getElementsByClassName("uibtn mathButton");
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].innerText.includes("Show")) {
                elements[i].style.display = "block";
            }
        }
    }
}
 
 
function clickShowButtons() {
    const outerFrame = window.frames[0];
    if (outerFrame && outerFrame.frames && outerFrame.frames[0]) {
        const elements = outerFrame.frames[0].document.getElementsByClassName("uibtn mathButton");
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].innerText.includes("Show")) {
                elements[i].click();
            }
        }
    }
}
 
function clickFootnavAndNextFrame() {
    try {
        document.getElementsByClassName("footnav goRight")[0].click();
    } catch (TypeError) {}
 
    try {
        window.frames[0].API.FrameChain.nextFrame();
    } catch (TypeError) {}
}
 
 
 
var clipboardButton;
 
function createClipboardSearchButton() {
    try {
        var iframe = document.querySelector("iframe");
        if (iframe) {
            var rect = iframe.getBoundingClientRect();
            var iframeTop = rect.top + window.scrollY;
            var iframeRight = rect.right + window.scrollX;
 
            var buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'fixed';
            buttonContainer.style.top = (iframeTop + 10) + 'px';
            buttonContainer.style.left = (iframeRight - 150) + 'px';
            buttonContainer.style.zIndex = '9999';
            document.body.appendChild(buttonContainer);
 
            clipboardButton = document.createElement('button');
            clipboardButton.innerText = 'Search Clipboard';
            buttonContainer.appendChild(clipboardButton);
        }
    } catch (error) {
        console.error('Error accessing the first iframe:', error);
    }
}
 
function checkClipboardSearchButton() {
    const isClipboardChecked = document.getElementById('searchClipboardCheckbox').checked;
 
    if (isClipboardChecked) {
        if (!clipboardButton) {
            createClipboardSearchButton();
        }
    } else {
        if (clipboardButton) {
            clipboardButton.parentElement.removeChild(clipboardButton);
            clipboardButton = null;
        }
    }
}
if (window.top === window.self && window.location.href.includes('core.learn')) {
setInterval(checkClipboardSearchButton, 1000);}
 
 
document.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON' && event.target.innerText.includes('Clipboard')) {
        navigator.clipboard.readText().then(function(clipboardText) {
            if (clipboardText) {
                var isBrainlyChecked = document.getElementById('searchInBrainlyCheckbox').checked;
                var searchUrl = 'https://brainly.com/app/ask?entry=top&q=' + encodeURIComponent(clipboardText);
 
                if (isBrainlyChecked) {
                    var brainlyIframe = document.getElementById('brainly-chat-iframe');
                    if (brainlyIframe) {
                        brainlyIframe.src = searchUrl;
                    }
                } else {
                    window.open(searchUrl, '_blank');
                }
            }
        }).catch(function(err) {
            console.error('Failed to read clipboard contents: ', err);
        });
    }
});
 
function addDeepaiIframes() {
    const wrapElement = document.getElementById('wrap');
 
    if (!document.getElementById('deepai-chat-iframe')) {
        const deepaiIframe = document.createElement('iframe');
        deepaiIframe.id = 'deepai-chat-iframe';
        deepaiIframe.src = 'https://deepai.org/chat';
 
        deepaiIframe.style.width = '25%';
        deepaiIframe.style.height = '100vh';
        deepaiIframe.style.border = 'none';
        deepaiIframe.style.position = 'absolute';
        deepaiIframe.style.top = '0';
        deepaiIframe.style.right = '0';
        deepaiIframe.style.zIndex = '20000';
        wrapElement.style.position = 'relative';
        deepaiIframe.style.opacity = '0';
        deepaiIframe.style.transition = 'opacity 0.5s';
        deepaiIframe.sandbox = 'allow-same-origin allow-scripts';
 
        document.body.appendChild(deepaiIframe);
    }
}
 
function addBrainlyIframes() {
    const wrapElement = document.getElementById('wrap');
 
    if (!document.getElementById('brainly-chat-iframe')) {
        const brainlyIframe = document.createElement('iframe');
        brainlyIframe.id = 'brainly-chat-iframe';
        brainlyIframe.src = 'https://brainly.com/search';
 
        brainlyIframe.style.width = '25%';
        brainlyIframe.style.height = '100vh';
        brainlyIframe.style.border = 'none';
        brainlyIframe.style.position = 'absolute';
        brainlyIframe.style.top = '0';
        brainlyIframe.style.left = '0';
        brainlyIframe.style.zIndex = '20000';
        wrapElement.style.position = 'relative';
        brainlyIframe.style.opacity = '0';
        brainlyIframe.style.transition = 'opacity 0.5s';
        brainlyIframe.sandbox = 'allow-same-origin allow-scripts';
 
        document.body.appendChild(brainlyIframe);
    }
}
 
addDeepaiIframes();
addBrainlyIframes();
 
function updateDeepaiIframeVisibility() {
    const deepaiIframe = document.getElementById('deepai-chat-iframe');
    const isAiChatChecked = document.getElementById('aiChatCheckbox').checked;
 
    if (deepaiIframe) {
        if (isAiChatChecked) {
            deepaiIframe.style.opacity = '1';
            deepaiIframe.style.display = 'block';
        } else {
            deepaiIframe.style.opacity = '0';
            setTimeout(() => deepaiIframe.style.display = 'none', 500);
        }
    }
}
 
function updateBrainlyIframeVisibility() {
    const brainlyIframe = document.getElementById('brainly-chat-iframe');
    const isBrainlyChecked = document.getElementById('searchInBrainlyCheckbox').checked;
 
    if (brainlyIframe) {
        if (isBrainlyChecked) {
            brainlyIframe.style.opacity = '1';
            brainlyIframe.style.display = 'block';
        } else {
            brainlyIframe.style.opacity = '0';
            setTimeout(() => brainlyIframe.style.display = 'none', 500);
        }
    }
}
 
if (window.top === window.self && window.location.href.includes('core.learn')) {
setInterval(() => {
    updateDeepaiIframeVisibility();
    updateBrainlyIframeVisibility();
}, 1000);
}
 
function createButtonAndPane() {
    if (document.querySelector('#tweaksButton')) return;
 
    const mainFootDiv = document.querySelector('.mainfoot');
 
    const toggleButton = document.createElement('button');
    toggleButton.id = 'tweaksButton';
    toggleButton.textContent = 'Toggle Options';
 
    toggleButton.style.border = "1px solid #5f5f5f";
    toggleButton.style.boxShadow = "inset 0 0 5px rgba(0, 0, 0, 0.6)";
    toggleButton.style.backgroundColor = "rgb(39, 39, 39)";
    toggleButton.style.color = "#f9a619";
    toggleButton.style.borderRadius = "3px";
    toggleButton.style.marginLeft = "40%";
    toggleButton.style.zIndex = "2";
    toggleButton.style.padding = '5px 10px';
 
    mainFootDiv.appendChild(toggleButton);
 
    if (!window.pane) {
        window.pane = document.createElement('div');
        window.pane.style.display = 'none';
        document.body.appendChild(window.pane);
 
        const popupMenu = document.createElement('div');
        popupMenu.className = 'popup-menu';
 
        const aiChatItem = createMenuItem('AI Chat', 'aiChatCheckbox');
        popupMenu.appendChild(aiChatItem);
 
        const searchInBrainlyItem = createMenuItem('Search in Brainly frame', 'searchInBrainlyCheckbox');
        popupMenu.appendChild(searchInBrainlyItem);
 
        const autoVocabItem = createMenuItem('Auto Vocab', 'autoVocabCheckbox');
        popupMenu.appendChild(autoVocabItem);
 
        const autoWritingItem = createMenuItem('Auto Writing', 'autoWritingCheckbox');
        popupMenu.appendChild(autoWritingItem);
 
        const autoplayItem = createMenuItem('Autoplay', 'autoplayCheckbox');
        popupMenu.appendChild(autoplayItem);
 
        const searchClipboardItem = createMenuItem('Search Clipboard Button', 'searchClipboardCheckbox');
        popupMenu.appendChild(searchClipboardItem);
 
        const guessingItem = createMenuItem('Guessing', 'guessingCheckbox');
        popupMenu.appendChild(guessingItem);
 
        // Add new menu items here
        const autoAdvanceItem = createMenuItem('AutoAdvance', 'autoAdvanceCheckbox');
        popupMenu.appendChild(autoAdvanceItem);
 
        // Add the new 'AutoShow' item
        const autoShowItem = createMenuItem('AutoShow', 'autoShowCheckbox');
        popupMenu.appendChild(autoShowItem);
 
        window.pane.appendChild(popupMenu);
 
        const footerText = document.createElement('div');
        footerText.style.marginTop = '20px';
        footerText.style.color = 'rgb(249, 166, 25)';
        footerText.style.textAlign = "center";
        footerText.textContent = "This was made by me, TallTacoTristan, as a way to make edge-nuity " +
            "classes MUCH easier and skip by the tedious bits but it took a long time, over " +
            "100 hours of just coding, to write over a thousand lines, it has many features, " +
            "the ones above are less than half, just the ones that need a toggle. " +
            "So please leave a good review on my page for all the time I spent to save yours, Thank you.";
 
        const discordMessage = document.createElement('div');
        discordMessage.textContent = "Join this discord if you have any issues, questions, or suggestions! Or simply to download the newest version which also includes a nicer gui, autoexam, autoassignment, and multitab, as well as more.";
        discordMessage.style.marginTop = '10px';
 
        const discordLink = document.createElement('a');
        discordLink.textContent = "https://discord.gg/6qJwkYSmrQ";
        discordLink.href = "https://discord.gg/6qJwkYSmrQ";
        discordLink.target = "_blank";
        discordLink.style.marginTop = '5px';
        discordLink.style.color = 'cyan';
        discordLink.style.textDecoration = 'underline';
 
        footerText.appendChild(discordMessage);
        footerText.appendChild(discordLink);
 
        window.pane.appendChild(footerText);
 
        loadCheckboxState('aiChat', 'aiChatCheckbox');
        loadCheckboxState('searchInBrainly', 'searchInBrainlyCheckbox');
        loadCheckboxState('autoVocab', 'autoVocabCheckbox');
        loadCheckboxState('autoWriting', 'autoWritingCheckbox');
        loadCheckboxState('autoplay', 'autoplayCheckbox');
        loadCheckboxState('searchClipboard', 'searchClipboardCheckbox');
        loadCheckboxState('guessing', 'guessingCheckbox');
 
        // Load new checkbox states
        loadCheckboxState('autoAssignment', 'autoAssignmentCheckbox');
        loadCheckboxState('autoShow', 'autoShowCheckbox'); // New
 
        makeDraggable(window.pane);
    }
 
    toggleButton.addEventListener('click', function() {
        console.log('Button clicked! Toggling pane visibility.');
 
        if (window.pane.style.display === 'none' || window.pane.style.display === '') {
            window.pane.style.width = "50%";
            window.pane.style.height = "auto";
            window.pane.style.position = "absolute";
            window.pane.style.marginTop = "20vh";
            window.pane.style.marginLeft = "25%";
            window.pane.style.border = "1px solid rgb(95, 95, 95)";
            window.pane.style.borderRadius = "3px";
            window.pane.style.backgroundColor = "rgb(39, 39, 39)";
            window.pane.style.overflow = "hidden";
            window.pane.style.color = "rgb(249, 166, 25)";
            window.pane.style.textAlign = "center";
            window.pane.style.overflowY = "scroll";
            window.pane.style.display = 'block';
 
            checkCheckboxState('aiChatCheckbox');
            checkCheckboxState('searchInBrainlyCheckbox');
            checkCheckboxState('autoVocabCheckbox');
            checkCheckboxState('autoWritingCheckbox');
            checkCheckboxState('autoplayCheckbox');
            checkCheckboxState('searchClipboardCheckbox');
            checkCheckboxState('guessingCheckbox');
            // Check new checkbox states
            checkCheckboxState('autoAdvanceCheckbox');
            checkCheckboxState('autoShowCheckbox'); // New
        } else {
            window.pane.style.display = 'none';
        }
    });
}
 
function makeDraggable(element) {
    let offsetX, offsetY;
 
    element.addEventListener('mousedown', function(e) {
        e.preventDefault();
        offsetX = e.clientX - element.getBoundingClientRect().left + element.offsetWidth / 2;
        offsetY = e.clientY - element.getBoundingClientRect().top + element.offsetHeight / 2;
        element.classList.add('dragging');
 
        document.addEventListener('mousemove', dragElement);
        document.addEventListener('mouseup', stopDragging);
    });
 
    function dragElement(e) {
        e.preventDefault();
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
 
        element.style.left = x + 'px';
        element.style.top = y + 'px';
    }
 
    function stopDragging() {
        element.classList.remove('dragging');
        document.removeEventListener('mousemove', dragElement);
        document.removeEventListener('mouseup', stopDragging);
    }
}
 
function createMenuItem(text, checkboxId) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item';
 
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
 
    const storedValue = localStorage.getItem(checkboxId);
    if (storedValue !== null) {
        checkbox.checked = (storedValue === 'true');
    }
 
    const label = document.createElement('label');
    label.innerText = text;
    label.setAttribute('for', checkboxId);
 
    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(label);
 
    checkbox.addEventListener('change', () => {
        console.log(`${text} checkbox is now ${checkbox.checked ? 'checked' : 'unchecked'}`);
        localStorage.setItem(checkboxId, checkbox.checked);
    });
 
    return itemDiv;
}
 
function loadCheckboxState(checkboxId) {
    const storedValue = localStorage.getItem(checkboxId);
    if (storedValue !== null) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.checked = (storedValue === 'true');
        }
    }
}
 
function checkCheckboxState(checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    const storedValue = localStorage.getItem(checkboxId);
 
    if (storedValue !== null && checkbox) {
        if (checkbox.checked !== (storedValue === 'true')) {
            checkbox.checked = (storedValue === 'true');
        }
    }
}
 
if (window.top === window.self && window.location.href.includes('core.learn')) {
    setInterval(createButtonAndPane, 1000);
}
 
 
 
var checkbox = document.getElementById('searchInBrainlyCheckbox');
 
 
 
 
 
let lastTitle = '';
 
function checkForAssignment() {
    const element = document.getElementById('activity-title');
    if (element) {
        const currentTitle = element.textContent || element.innerText;
 
        const excludedKeywords = [
            "Summary", "Warm-Up", "Instruction", "Quiz",
            "Assignment", "Unit Test",
            "Unit Review", "Cumulative Exam Review",
            "Vocab","Cumulative Exam"
        ];
 
        const containsExcludedKeyword = excludedKeywords.some(keyword => currentTitle.includes(keyword));
        const currentContainsAssignment = currentTitle.includes("Assignment");
 
        if (currentTitle !== lastTitle) {
            if (currentContainsAssignment || !containsExcludedKeyword) {
                new Notification("Done!");
            }
            lastTitle = currentTitle;
        }
    }
}if (window.top === window.self) {
setInterval(checkForAssignment, 1000);}
 
const isAutoVocabChecked = document.getElementById('autoVocabCheckbox').checked;
 
 
function clickSubmitIfVisible() {
    const submitButton = window.frames[0].document.querySelector('a[data-bind="visible:lastWord == currentWord(), click: submit"]');
    if (submitButton && submitButton.style.display !== 'none') {
        submitButton.click();
    }
}
 
function vocabCompleter() {
  if (document.getElementById("activity-title").innerText == "Vocabulary") {
       $("#stageFrame").contents().find(".uibtn.uibtn-blue.uibtn-arrow-next")[0].click()
    var i = 0;
    try{
    var txt = window.frames[0].document.getElementsByClassName("word-background")[0].value
    window.frames[0].document.getElementsByClassName("word-textbox")[0].value = txt;
    $("#stageFrame").contents().find(".word-textbox.word-normal")[0].dispatchEvent(new Event("keyup"));
 
    } catch{return;}
    var speed = 50;
         output += ("Vocab Completer, ")
        $("#stageFrame").contents().find(".playbutton.vocab-play")[0].click()
        $("#stageFrame").contents().find(".playbutton.vocab-play")[1].click()
        $("#stageFrame").contents().find(".uibtn.uibtn-blue.uibtn-arrow-next")[0].click()
    }
}
 
function checkAndExecuteFunctions() {
    const isAutoVocabChecked = document.getElementById('autoVocabCheckbox').checked;
    if (isAutoVocabChecked) {
        clickSubmitIfVisible();
        vocabCompleter();
    }
}
if (window.top === window.self && window.location.href.includes('core.learn')) {
setInterval(checkAndExecuteFunctions, 1000);
}