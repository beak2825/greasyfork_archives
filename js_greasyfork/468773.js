// ==UserScript==
// @name         my_reader
// @namespace    WJL
// @version      0.1
// @description  get my blog
// @author       WJL
// @match        http*://cn.bing.com/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.7.0.js
// @connect *
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468773/my_reader.user.js
// @updateURL https://update.greasyfork.org/scripts/468773/my_reader.meta.js
// ==/UserScript==

(function(){
  function initDom(){
    let readerDomStr=`
    <style>
      #content-search-input {
          width: 100px;
      }

      #reader-body {
          position: fixed;
          top: 0;
          right: 0;
          width: 20%;
      }

    #content-in-reading {
        width: auto;
    }

    #switch-btn {
        float: right;
    }
    </style>
    <div id="reader-body">
    <button id="switch-btn"></button>
    <div id="reader-content">
        <div id="controll-btn">
            <button id="start-btn">start</button>
            <button id="pause-btn">pause</button>
            <button id="stop-btn">stop</button>
            <button id="quick-btn">+ quick</button>
            <span id="current-rate"></span>
            <button id="slow-btn">- slow</button>
            <button id="set-time-btn">set time</button>
            <input id="time-interval-input" placeholder="set time interval"/><span>min</span>
            <div id="controll-index">
                <input id="content-search-input" type="text" placeholder="search content"/>
                <button id="previous-btn">prev</button>
                <button id="set-index-btn"></button>
                <button id="next-btn">next</button>
                <br />
                <button id="back-to-prev-btn">back to prev</button>
                <button id="go-to-next-btn">go to next</button>
            </div>
        </div>
        <div id="load-file"><input id="file" type="file"></div>
        <div id="content-in-reading"></div>
    </div>
    </div>`;
    let bodyElement = $("body");
    console.log("bodyElement==>",bodyElement);
    let readerDom = $(readerDomStr);
    bodyElement.append(readerDom);
  }
  function expensionLocalStorage() {
    function customSetItem(itemKey, itemContent) {
        if (typeof (itemKey) === "string") {
            GM_setValue(itemKey, JSON.stringify(itemContent));
        }
    }
    function customGetItem(itemKey) {
        if (typeof (itemKey) === "string") {
            try {
                return JSON.parse(GM_getValue(itemKey));
            } catch {
                return undefined;
            }
        }
    }
    window.customSetItem = customSetItem;
    window.customGetItem = customGetItem;
  }
  initDom();
  expensionLocalStorage();
  const NOVEL_IN_READING = "NOVEL_IN_READING";
  const NOVEL_READING_INDEX = "NOVEL_READING_INDEX";
  const NOVEL_INFODETAIL_SUFFIX = "_INFO_DETAIL";
  const NOVEL_SPEEK_RATE_STEP = 0.1;
  let quickBtn = $("#quick-btn");
  let slowBtn = $("#slow-btn");
  let controllIndex = $("#controll-index");
  let contentSearchInput = $("#content-search-input");
  let setIndexBtn = $("#set-index-btn");
  let previousBtn = $("#previous-btn");
  let nextBtn = $("#next-btn");
  var isAltKeyPressed = false;
  var isRKeyPressed = false;
  var isNKeyPressed = false;
  let setKeyStatusToDefaultTimer=undefined;
  function getSomeElement() {
      let fileInput = $("#file");
      let contentDispaly = $("#content-in-reading");
      let startBtn = $("#start-btn");
      let pauseBtn = $("#pause-btn");
      let stopBtn = $("#stop-btn");
      let currentRateDisplay = $("#current-rate");
      let backToPrecContentBtn = $("#back-to-prev-btn");
      let goToNextContentBtn = $("#go-to-next-btn");
      let switchBtn = $("#switch-btn");
      let readerContent = $("#reader-content");
      return {
          fileInput,
          contentDispaly,
          startBtn,
          pauseBtn,
          stopBtn,
          currentRateDisplay,
          backToPrecContentBtn,
          goToNextContentBtn,
          switchBtn,
          readerContent
      }
  }
  function getCurrentNovelInfoDetail() {
      try {
          const novelFileId = window.customGetItem(NOVEL_IN_READING);
          const contentList = window.customGetItem(novelFileId);
          const currentNovelInReadingInfoDetail = window.customGetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX);
          const indexOfContentInReading = currentNovelInReadingInfoDetail?.index || 0;
          const speekRate = currentNovelInReadingInfoDetail?.rate || 1;
          return {
              contentToSpeek: contentList[indexOfContentInReading] || "faild to get content",
              currentIndex: indexOfContentInReading,
              speekRate: speekRate
          };
      } catch (error) {
          return "faild to get content";
      }
  }
  function setCurrentNovelInfoDetail(partialDetail) {
      const novelFileId = window.customGetItem(NOVEL_IN_READING);
      const contentList = window.customGetItem(novelFileId);
      const currentNovelInReadingInfoDetail = window.customGetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX);
      window.customSetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX, {
          ...currentNovelInReadingInfoDetail,
          ...partialDetail
      });
  }
  function goNextContent() {
      try {
          const novelFileId = window.customGetItem(NOVEL_IN_READING);
          const contentList = window.customGetItem(novelFileId);
          const currentInfoDetail = window.customGetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX);
          const indexOfContentInReading = currentInfoDetail?.index || 0;
          window.customSetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX, { ...currentInfoDetail, index: indexOfContentInReading + 1 })
          const nextContent = contentList[indexOfContentInReading + 1];
          return nextContent;
      } catch (error) {
          return "faild to get content";
      }
  }
  function speek() {
      // get content
      let { contentToSpeek, speekRate } = getCurrentNovelInfoDetail();
      var utterance = new SpeechSynthesisUtterance(contentToSpeek);
      utterance.lang = "zh-CN";
      utterance.rate = speekRate;
      window.speechSynthesis.speak(utterance);

      utterance.onend = function () {
          // index + 1
          let nextContent = goNextContent();
          // set contentDisplay
          let contentDispaly = $("#content-in-reading");
          contentDispaly.text(nextContent);
          // speek again
          speek();
      };
  }
  function initReader(someElements) {
      // init the content display
      try {
          const novelFileId = window.customGetItem(NOVEL_IN_READING);
          const contentList = window.customGetItem(novelFileId);
          const indexOfContentInReading = window.customGetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX)?.index || 0;
          someElements.contentDispaly.text(contentList[indexOfContentInReading]);
          someElements.startBtn.on("click", function () {
              speek();
          });
          someElements.pauseBtn.on("click", function () {
              window.speechSynthesis.cancel();
          });
          someElements.stopBtn.on("click", function () {
              window.speechSynthesis.cancel();
              window.customSetItem(NOVEL_IN_READING, undefined);
          })
          someElements.currentRateDisplay.text(window.customGetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX)?.rate || 1);
          quickBtn.on("click", function () {
              window.speechSynthesis.cancel();
              let oldInfoDetail = window.customGetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX);
              window.customSetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX, {
                  ...oldInfoDetail,
                  rate: Math.round((oldInfoDetail?.rate < 1 ? 1 : oldInfoDetail?.rate + NOVEL_SPEEK_RATE_STEP) * 10) / 10
              });
              someElements.currentRateDisplay.text(window.customGetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX)?.rate || 1);
              speek();
          });
          slowBtn.on("click", function () {
              window.speechSynthesis.cancel();
              let oldInfoDetail = window.customGetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX);
              window.customSetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX, {
                  ...oldInfoDetail,
                  rate: Math.round((oldInfoDetail?.rate - NOVEL_SPEEK_RATE_STEP < 1 ? 1 : oldInfoDetail?.rate - NOVEL_SPEEK_RATE_STEP) * 10) / 10
              });
              someElements.currentRateDisplay.text(window.customGetItem(novelFileId + NOVEL_INFODETAIL_SUFFIX)?.rate || 1);
              speek();
          })
      } catch (error) {
          var utterance = new SpeechSynthesisUtterance("some error when ready to speek");
          window.speechSynthesis.speak(utterance);
      }
  }
  function searchContent() {
      try {
          const novelFileId = window.customGetItem(NOVEL_IN_READING);
          const contentList = window.customGetItem(novelFileId);
          const currentDetail = getCurrentNovelInfoDetail();
          let searchResult = [];
          let resultIndexToDispalty = 0;
          let contentToSearch = contentSearchInput.val();
          contentList.forEach((contentItem, contentIndex) => {
              if (contentItem.includes(contentToSearch)) {
                  searchResult.push({ content: contentItem, index: contentIndex });
              }
          })
          return searchResult;
      } catch (error) {
          alert("not find");
      }
  }
  function initSetTimer() {
      let timeInput = $("#time-interval-input");
      let setTimeBtn = $("#set-time-btn");
      setTimeBtn.on("click", function () {
          let timeInterval = timeInput.val();
          if (timeInterval) {
              setTimeout(() => {
                  window.speechSynthesis.cancel();
                  let tipMessage = new SpeechSynthesisUtterance(`……${Number(timeInterval)}分钟已到，请休息一下或刷新页面……`);
                  tipMessage.lang = "zh-CN";
                  window.speechSynthesis.speak(tipMessage);
              }, Number(timeInterval) * 60 * 1000);
              timeInput.val("set time successfully");
              setTimeout(() => {
                  timeInput.val("");
              }, 2000);
          }
      })
  }
  function initReaderContent(someElements) {
      let switchBtn = someElements.switchBtn;
      let readerContent = someElements.readerContent;
      readerContent.hide();
      switchBtn.text("!+!");
      switchBtn.on("click", function () {
          if (switchBtn.text() === "!+!") {
              switchBtn.text("!-!");
              readerContent.show();
          } else {
              switchBtn.text("!+!");
              readerContent.hide();
          }
      });
  }
  function initShortCutListener() {
    document.addEventListener('keydown', function (event) {
        if(setKeyStatusToDefaultTimer){
          clearTimeout(setKeyStatusToDefaultTimer);
        }
        setKeyStatusToDefaultTimer=setTimeout(() => {
            isAltKeyPressed = false;
            isRKeyPressed = false;
            isNKeyPressed = false;
          console.log("all key to default");
        }, 1000);
        if (event.altKey) {
            isAltKeyPressed = true;
          console.log("isAltKeyPressed==>",isAltKeyPressed);
        }
        if (event.key === 'r') {
            isRKeyPressed = true;
          console.log("isRKeyPressed==>",isRKeyPressed);
        }
        if ( event.key === 'n') {
            isNKeyPressed = true;
          console.log("isNKeyPressed==>",isNKeyPressed);
        }

        if (isAltKeyPressed && isRKeyPressed && isNKeyPressed) {
          console.log("all true");
          let switchBtn = $("#switch-btn");
            let visibale = switchBtn.is(':visible');
            if (visibale) {
                switchBtn.hide();
            } else {
                switchBtn.show();
            }
        }
    });

  }
    function startUp() {
        let someElements = getSomeElement();
        initReaderContent(someElements);
        initSetTimer();
        initShortCutListener();
        try {
            let hasNovelInReading = window.customGetItem(NOVEL_IN_READING) !== undefined && window.customGetItem(NOVEL_IN_READING) !== null;
            if (hasNovelInReading) {
                // hide the file input
                someElements.fileInput.hide();
                initReader(someElements);
            }
            else {
                controllIndex.hide();
                // select a novel and init some local stroage;
                someElements.fileInput.on("change", function () {
                    var file = $(this)[0].files[0];
                    let fileId = file.name + file.size.toString();
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var contents = e.target.result;
                        var contentList = contents.split("\r\n");
                        window.customSetItem(fileId, contentList);
                        window.customSetItem(NOVEL_IN_READING, fileId);
                        const initIndexForSelectedNovel = window.customGetItem(fileId + NOVEL_INFODETAIL_SUFFIX)?.index || 0;
                        const rate = window.customGetItem(fileId + NOVEL_INFODETAIL_SUFFIX)?.rate || 1;
                        window.customSetItem(fileId + NOVEL_INFODETAIL_SUFFIX, { index: initIndexForSelectedNovel, rate: rate });
                        initReader(someElements);
                        someElements.fileInput.hide();
                        controllIndex.show();
                    };
                    reader.readAsText(file);
                });
            }
            setIndexBtn.text("find index");
            let searchResult;
            let resultIndexToUse = 0;
            let toSetContentDetail;
            setIndexBtn.on("click", function () {
                window.speechSynthesis.cancel();
                if (setIndexBtn.text() === "find index") {
                    try {
                        searchResult = searchContent();
                        toSetContentDetail = searchResult[resultIndexToUse];
                        if (toSetContentDetail && toSetContentDetail.content) {
                            setIndexBtn.text("set index");
                            contentSearchInput.val(toSetContentDetail.content);
                            previousBtn.on("click", function () {
                                if (toSetContentDetail.index === searchResult[0].index) {
                                    return;
                                } else {
                                    resultIndexToUse -= 1;
                                    toSetContentDetail = searchResult[resultIndexToUse];
                                    contentSearchInput.val(toSetContentDetail.content);
                                }
                            })
                            nextBtn.on("click", function () {
                                if (toSetContentDetail.index === searchResult[searchResult.length - 1].index) {
                                    return;
                                } else {
                                    resultIndexToUse += 1;
                                    toSetContentDetail = searchResult[resultIndexToUse];
                                    contentSearchInput.val(toSetContentDetail.content);
                                }
                            });
                        }
                    } catch (error) {
                        alert(error.message);
                    }
                }
                else {
                    if (!!toSetContentDetail && toSetContentDetail?.index) {
                        try {
                            setCurrentNovelInfoDetail({ index: toSetContentDetail?.index });
                            speek();
                        } catch (error) {
                            alert(error.message);
                        }
                    }
                }
            })
            someElements.backToPrecContentBtn.on("click", function () {
                window.speechSynthesis.cancel();
                let currentDetail = getCurrentNovelInfoDetail();
                setCurrentNovelInfoDetail({ index: currentDetail.currentIndex - 1 });
                someElements.contentDispaly.text(getCurrentNovelInfoDetail().contentToSpeek);
                speek();
            });
            someElements.goToNextContentBtn.on("click", function () {
                window.speechSynthesis.cancel();
                let currentDetail = getCurrentNovelInfoDetail();
                setCurrentNovelInfoDetail({ index: currentDetail.currentIndex + 1 });
                someElements.contentDispaly.text(getCurrentNovelInfoDetail().contentToSpeek);
                speek();
            });


        } catch (error) {
            var utterance = new SpeechSynthesisUtterance("some error when init");
            window.speechSynthesis.speak(utterance);
        }

    }
  startUp();
})()