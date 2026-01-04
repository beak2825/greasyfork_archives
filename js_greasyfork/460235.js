// ==UserScript==
// @name         sleep prediction
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Keep track of time spent on any website to predict sleeping time
// @icon         https://www.iconsdb.com/icons/preview/gray/clock-10-xxl.png
// @author       moony
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        window.onurlchange
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.2.0/dist/tf.min.js
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/460235/sleep%20prediction.user.js
// @updateURL https://update.greasyfork.org/scripts/460235/sleep%20prediction.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let sleepTimeDisplay = false; let sleepTimeDiv = document.createElement("div");
  let Index_lastTime_usec = 0; let MaxIndex_lastTime_usec; let counter = 0; let typeAlgorithme = GM_getValue("typeAlgorithme", null);
  var predictionSleep;
  let diffTime = 0; let minSleep = 6; let maxSleep = 24;
  let CurrentDate = new Date();
  let SleepingTimeArray = []; let WakeUpTimeArray = [];
  const tf = window.tf; let model = tf.sequential(); tf.setBackend('webgl'); let _TrainOnce = true;

  document.addEventListener("keypress", arrayTimeUpdate);
  document.addEventListener("mousemove", arrayTimeUpdate);
  document.addEventListener("mousedown", arrayTimeUpdate);

  function arrayTimeUpdate() {
     let wakeTimer = GM_getValue("wakeTimer", null);
     let oldDate = GM_getValue("oldDate", null);
     if (oldDate == null) { oldDate = CurrentDate.getTime(); GM_setValue("SleepingTimeArray", [8.1, 9.1, 10.1]); GM_setValue("WakeUpTimeArray", [16.1, 15.1, 14.1]); } //first time run
     CurrentDate = new Date();
     diffTime = CurrentDate.getTime() - oldDate;
     diffTime = diffTime/(1000*60*60);
     if (diffTime > minSleep && diffTime < maxSleep) {
         SleepingTimeArray = GM_getValue("SleepingTimeArray", null);
         WakeUpTimeArray = GM_getValue("WakeUpTimeArray", null);
         if (SleepingTimeArray == null) { SleepingTimeArray = [diffTime]; } //first time store
         else { SleepingTimeArray.push(diffTime); }
         if (WakeUpTimeArray == null) { WakeUpTimeArray = [wakeTimer]; }
         else { WakeUpTimeArray.push(wakeTimer); }
         GM_setValue("SleepingTimeArray", SleepingTimeArray);
         GM_setValue("WakeUpTimeArray", WakeUpTimeArray);
         wakeTimer = 0;
     }
     else if (diffTime <= minSleep) {
         if (wakeTimer == null) { wakeTimer = diffTime; }
         else { wakeTimer += diffTime; }
     }
     else { wakeTimer = 0; }
     GM_setValue("wakeTimer", wakeTimer);
     GM_setValue("oldDate", CurrentDate.getTime());
  }

  function predictSleep() {
      if ( typeAlgorithme == "Avg" ) { return predictSleepAvg(); } else { return predictSleepML(); }
  }

  function predictSleepML() {
    if (_TrainOnce)
    { _TrainOnce = false;
    let sleepingTimeArray = GM_getValue("SleepingTimeArray", null);
    let wakeUpTimeArray = GM_getValue("WakeUpTimeArray", null);
    let index = sleepingTimeArray.length - 1;
    while (index > -1) {
        sleepingTimeArray[index] = sleepingTimeArray[index] / maxSleep;
        wakeUpTimeArray[index] = wakeUpTimeArray[index] / maxSleep;
        index--;
    }
    sleepingTimeArray = tf.tensor2d(sleepingTimeArray, [sleepingTimeArray.length, 1]);
    wakeUpTimeArray = tf.tensor2d(wakeUpTimeArray, [wakeUpTimeArray.length, 1]);
    //const inputTensor = tf.stack([sleepingTimeArray, wakeUpTimeArray], 1).reshape([1, -1, 2]);
    //model.add(tf.layers.gru({units: 16, inputShape: [wakeUpTimeArray.length, 1]}));
    model.add(tf.layers.dense({ units: 128, inputShape: [1], activation: 'swish' })); // sigmoid, hardSigmoid, softplus, softsign, tanh, softmax, linear, relu, relu6, selu, elu, swish | https://www.tensorflow.org/js/tutorials/training/linear_regression
    model.add(tf.layers.dense({ units: 64, activation: 'softsign' }));
    model.add(tf.layers.dense({ units: 32, activation: 'selu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
    model.compile({loss: 'meanSquaredError', optimizer: 'adam'});
    model.fit(wakeUpTimeArray, sleepingTimeArray, {epochs: 50, batchSize: 32, optimizer: tf.train.adam(0.001), callbacks: {onEpochEnd: async(epoch, logs) => { let lossStr = logs.loss ? logs.loss.toFixed(4) : 'N/A'; console.log(`Epoch: ${epoch} - loss: ${lossStr}`);}}});
    // const modelJSON = model.toJSON(); const modelString = JSON.stringify(modelJSON); GM_setValue('model', modelString); // Save the model
    } // <train | predict>
       // const modelString = GM_getValue('model'); const modelJSON = JSON.parse(modelString); const loadedModel = tf.loadLayersModel(modelJSON); // Load the model

       const wakeTimer = GM_getValue("wakeTimer", 0) / maxSleep;
       let wake = [wakeTimer];
       wake = tf.tensor2d(wake, [wake.length, 1]);
       const predictionTensor = model.predict(wake);
       const prediction = predictionTensor.dataSync()[0] * maxSleep;
       tf.dispose(wake); // clean up: Memory management
      const predictionSleep = convertHours(prediction);
      return predictionSleep;
  }

     function predictSleepAvg() {
      SleepingTimeArray = GM_getValue("SleepingTimeArray", null); WakeUpTimeArray = GM_getValue("WakeUpTimeArray", null); //for read persistent storage
      let index = SleepingTimeArray.length - 1; let sum = 0; const nsleep = SleepingTimeArray.length; counter++
      while (index > -1) { sum += SleepingTimeArray[index]; index--; }
      const sleepAverage = sum / nsleep; sum = 0; index = WakeUpTimeArray.length - 1; const nwake = WakeUpTimeArray.length;
      while (index > -1) { sum += WakeUpTimeArray[index]; index--; }
      const wakeAverage = sum / nwake; const ratio = sleepAverage / wakeAverage; const wakeTimer = GM_getValue("wakeTimer", 0); const predict = ratio * wakeTimer;
      return convertHours(predict);
    }

    function convertHours(predict)
    {
      const hours = Math.floor(predict);
      let remainder = predict - hours;
      remainder = remainder * 60;
      const minutes = Math.floor(remainder);
      remainder = remainder - minutes;
      remainder = remainder * 60;
      const seconds = Math.floor(remainder);
      const predictionText = `${hours} hours, ${minutes} minutes and ${seconds} seconds.(${counter})`;
      return predictionText;
    }

    function displaySleepTime() {
     sleepTimeDisplay = true; GM_setValue("sleepTimeDisplay", sleepTimeDisplay);
     predictionSleep = predictSleep();
     let pos = GM_getValue("sleepTimeDivPos", { x: "50%", y: "50%" }); if (pos.x == "NaN" || pos.y == "NaN") pos = { x: "50%", y: "50%" };
     sleepTimeDiv.style.cssText = `left: ${pos.x}; top: ${pos.y}; background-color: rgba(0,0,0,0.5); color: white; position: fixed; transform: translate(-50%, -50%); font-size: 100%; border-radius: 5px; padding: 10px; text-align: center; z-index: 9999;`;
     sleepTimeDiv.innerHTML = `If you sleep now, you will WakeUp in: <span id='sleepTimeSpan'>${predictionSleep}</span>`;

     document.body.appendChild(sleepTimeDiv);
     let sleepTimeSpan = document.getElementById("sleepTimeSpan");
     sleepTimeSpan.style.marginRight = "30px";
     let closeButton = document.createElement("button");
     closeButton.style.cssText = `position: absolute; top: 5px; right: 5px; background-color: rgba(0,0,0,0.5); color: white; font-size: 100%; padding: 5px 10px; border-radius: 3px; box-shadow: 0px 0px 8px rgba(0,0,0,0.1); transition: all 0.2s ease-in-out;`;
     closeButton.innerHTML = "X";


  sleepTimeDiv.addEventListener("dragover", (event) => { event.preventDefault(); });
  sleepTimeDiv.addEventListener("drop", handleFileDrop);

  closeButton.addEventListener("click", function() { removeSleepTimeDisplay(); });

  closeButton.addEventListener("mouseover", function() {
    closeButton.style.backgroundColor = "rgba(0,0,0,0.2)";
    closeButton.style.color = "white";
  });

  closeButton.addEventListener("mouseout", function() {
    closeButton.style.backgroundColor = "rgba(0,0,0,0.5)";
    closeButton.style.color = "white";
  });
  sleepTimeDiv.addEventListener("mousedown", function(event) {
    let currentX = event.clientX - sleepTimeDiv.offsetLeft; let currentY = event.clientY - sleepTimeDiv.offsetTop;
    document.addEventListener("mouseup", function() {
    document.removeEventListener("mousemove", moveDiv);
    let pos = { x: sleepTimeDiv.style.left, y: sleepTimeDiv.style.top }; GM_setValue("sleepTimeDivPos", pos);
  });
  document.addEventListener("mousemove", moveDiv);
  function moveDiv(event) {
    sleepTimeDiv.style.left = event.clientX - currentX + "px";
    sleepTimeDiv.style.top = event.clientY - currentY + "px";
  }
});

  sleepTimeDiv.appendChild(closeButton);

  setInterval(function() {
   document.querySelector("#sleepTimeSpan") && (document.querySelector("#sleepTimeSpan").innerHTML = `${predictSleep()}`);
  }, 1000);
}

function removeSleepTimeDisplay() {
  if (sleepTimeDisplay) {
    sleepTimeDisplay = false; GM_setValue("sleepTimeDisplay", sleepTimeDisplay);
    const pos = { x: "50%", y: "50%" }; GM_setValue("sleepTimeDivPos", pos);
    sleepTimeDiv.remove();
  }
}

function handleFileDrop(event) { // get "BrowserHistory.json" browser history from https://takeout.google.com/
  event.preventDefault(); event.stopPropagation(); const reader = new FileReader(); reader.readAsArrayBuffer(event.dataTransfer.files[0]); reader.onload = () => { const data = JSON.parse(new TextDecoder().decode(reader.result)); MaxIndex_lastTime_usec = data['Browser History'].length;
  SleepingTimeArray = GM_getValue("SleepingTimeArray", null); WakeUpTimeArray = GM_getValue("WakeUpTimeArray", null); let lastTime_usec = 0; let wake = 0; let diff = 0; let hours = 0; let minValidSleep = 8; let maxValidSleep = 8; const minValidWakeUp = 10; const maxValidWakeUp = 30;
  data['Browser History'].forEach(item => {
      if (lastTime_usec == 0) { lastTime_usec = item.time_usec; }
      else { diff = lastTime_usec - item.time_usec; hours = diff / (1000 * 60 * 60);
          if (hours <= maxSleep && hours >= minSleep && wake >= minValidWakeUp && wake <= maxValidWakeUp) {
              if (hours > maxValidSleep) { maxValidSleep = hours; }
              else if (hours < minValidSleep) { minValidSleep = hours; }
              if (SleepingTimeArray == null) { SleepingTimeArray = [hours]; WakeUpTimeArray = [wake]; }
              else { SleepingTimeArray.push(hours); WakeUpTimeArray.push(wake); }
              wake = 0; Index_lastTime_usec++;
          }
          else if (hours < 6) { wake += hours; }
          else { wake = 0; }
          lastTime_usec = item.time_usec;
      }
      console.log(item.time_usec + " - " + Index_lastTime_usec + " \ " + MaxIndex_lastTime_usec); counter++;
  });
  console.log(SleepingTimeArray); console.log(WakeUpTimeArray);
  GM_setValue("SleepingTimeArray", SleepingTimeArray); GM_setValue("WakeUpTimeArray", WakeUpTimeArray);
}; }

if (window.onurlchange === null) { console.log("URL CHANGE");
    let sleepTimeDisplay = GM_getValue("sleepTimeDisplay", false);
    if (sleepTimeDisplay) { displaySleepTime(); } else { removeSleepTimeDisplay();}
    //window.addEventListener('urlchange', (info) => { console.log("newly created"); });
}

GM_registerMenuCommand("Sleep Time", () => { if (sleepTimeDisplay) { removeSleepTimeDisplay(); } else { displaySleepTime(); }});
GM_registerMenuCommand("switchAlgorithm", () => { typeAlgorithme = GM_getValue("typeAlgorithme", "ML"); if (typeAlgorithme == "ML") { typeAlgorithme = "Avg"; } else { typeAlgorithme = "ML"; } GM_setValue("typeAlgorithme", typeAlgorithme); console.log("Apply: typeAlgorithme = " + typeAlgorithme); });
GM_registerMenuCommand("showDelKey", () => { const keys = GM_listValues(); const data = keys.map(key => { const value = GM_getValue(key); return { key, value }; }); console.table(data); const confirmation = confirm(`Do you want to delete all ${keys.length} values show in console?`);
 if (confirmation) { keys.forEach(key => { GM_deleteValue(key); }); console.log(`${keys.length} values have been deleted.`); } else { console.log(`No values have been deleted.`); } });

})();