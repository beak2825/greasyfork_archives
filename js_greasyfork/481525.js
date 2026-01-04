// ==UserScript==
// @name        12306余票监控 - 12306.cn
// @namespace   Violentmonkey Scripts
// @match       https://kyfw.12306.cn/otn/leftTicket/init*
// @grant       none
// @version     1.0
// @author      -
// @description 2023/12/6 15:26:09
//  @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481525/12306%E4%BD%99%E7%A5%A8%E7%9B%91%E6%8E%A7%20-%2012306cn.user.js
// @updateURL https://update.greasyfork.org/scripts/481525/12306%E4%BD%99%E7%A5%A8%E7%9B%91%E6%8E%A7%20-%2012306cn.meta.js
// ==/UserScript==


(function() {

    let monitoringEnabled = false;
    let monitorInterval;

    'use strict';

    // Create a floating UI for user input
    const floatingUI = document.createElement('div');
    floatingUI.style.position = 'fixed';
    floatingUI.style.top = '280px';
    floatingUI.style.right = '20px';
    floatingUI.style.padding = '10px';
    floatingUI.style.background = 'rgb(255 252 211 / 88%)';
    floatingUI.style.border = '1px solid #ccc';
    floatingUI.style.zIndex='100000';
    floatingUI.innerHTML = `
        <h2><b>余票监控</b></h2>
        <label for="trainNumbers"><b>车次:</b></label>
        <input type="text" id="trainNumbers" placeholder="输入车次（多个车次可以逗号分隔）" value="G1">
        <br>（多个车次可以逗号分隔）<br >
        <label for="intervalSeconds"><b>刷新间隔</b>（秒）:</label>
        <input type="number" id="intervalSeconds" value="60">
        <br>
        <label for="seatTypes"><b>监控席别</b></label>
        <br>
        <input type="checkbox" id="businessSeat" value="商务座"  class='monitoredSeatTypes'>
        <label for="businessSeat">商务座</label>
        <br>
        <input type="checkbox" id="firstSeat" value="一等座"  class='monitoredSeatTypes'>
        <label for="firstSeat">一等座</label>
        <br>
        <input type="checkbox" id="secondSeat" value="二等座" class='monitoredSeatTypes' checked>
        <label for="secondSeat">二等座</label>
        <br>
        <input type="checkbox" id="supersoftSleeper" value="高级软卧" class='monitoredSeatTypes' >
        <label for="softSleeper">高级软卧</label>
        <br>
        <input type="checkbox" id="softSleeper" value="软卧" class='monitoredSeatTypes' >
        <label for="softSleeper">软卧</label>
        <br>
        <input type="checkbox" id="EMUSleeper" value="动卧" class='monitoredSeatTypes' >
        <label for="softSleeper">动卧</label>
        <br>
        <input type="checkbox" id="hardSleeper" value="硬卧" class='monitoredSeatTypes'  checked >
        <label for="hardSleeper">硬卧</label>
        <br>
        <input type="checkbox" id="hardSeat" value="硬座" class='monitoredSeatTypes' >
        <label for="hardSeat">硬座</label>
        <br>
        <input type="checkbox" id="softSeat" value="软座" class='monitoredSeatTypes' >
        <label for="softSeat">软座</label>
        <br>
        <input type="checkbox" id="noSeat" value="无座" class='monitoredSeatTypes' >
        <label for="softSeat">无座</label>
        <br>
        <!-- Add other seat checkboxes as per your requirement -->
        <label for="threshold"><b>告警阈值（≤多少张时告警）:</b></label>
        <input type="number" id="threshold" value="15">
<br><input type="checkbox" id="sound-toggle" checked>
    <label for="sound-toggle">开启语音</label>
        <br><p style='font-size: 16px'>
          <label for="toggleMonitoring"><b>开始监控:</b></label>
          <input type="checkbox" id="toggleMonitoring"></p>
    `;
    document.body.appendChild(floatingUI);


    // Function to get monitored train numbers and seat types from UI
// Function to get monitored train numbers and seat types from UI
function getMonitoredInfo() {
    const trainNumbersInput = document.getElementById('trainNumbers').value;
    const selectedSeatTypesInputs = document.querySelectorAll('.monitoredSeatTypes:checked');

    const separators = /[;,，、\s]+/; // 正则表达式匹配多种分隔符


    const trainNumbers = trainNumbersInput.split(separators).map(item => item.trim());
    const selectedSeatTypes = Array.from(selectedSeatTypesInputs).map(input => input.value);
  //  alert(trainNumbers+selectedSeatTypes);
    return { trainNumbers, selectedSeatTypes };
}

// Example usage:
// const { trainNumbers, selectedSeatTypes } = getMonitoredInfo();
// console.log('Train Numbers:', trainNumbers);
// console.log('Selected Seat Types:', selectedSeatTypes);


// Function to fetch page elements and their content

  // Function to get aria-label values from all elements
function getAllAriaLabelValues() {
    const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');
    const ariaLabelValues = [];

    elementsWithAriaLabel.forEach(element => {
        const ariaLabelValue = element.getAttribute('aria-label');
        ariaLabelValues.push(ariaLabelValue);
    });

    return ariaLabelValues;
}

// Call the function to get aria-label values


// Log the array of aria-label values
// console.log(allAriaLabelValues);


  // Function to filter out the desired format from aria-label values
function filterAriaLabelValues(ariaLabelValues) {
    const filteredValues = [];

    ariaLabelValues.forEach(value => {
        const regexPattern = /(.+)次列车，(.+)票价(\d+)元，余票(有|无|候补|\d+)/;
        const matches = value.match(regexPattern);

        if (matches) {
            const trainInfo = matches[1];
            const seatInfo = matches[2];
            const availableSeats = matches[4];
            filteredValues.push(`${trainInfo},${seatInfo},${availableSeats}`);
         // alert(trainInfo+seatInfo+availableSeats);
        }
    });

    return filteredValues;
}

// Assuming you have obtained the allAriaLabelValues array
// Call the function to filter out desired format


// Log the filtered values
//console.log(filteredAriaLabelValues);

let alertBoxes = 0;



// Function to display an alert message using a styled DOM element
function displayAlertMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = `${122 + alertBoxes * 100}px`; // 调整每个警告框的垂直位置
    alertDiv.style.left = '50%';
      alertDiv.style.height = '40px';
      alertDiv.style.width = '120px';
    alertDiv.style.transform = 'translate(-50%, -50%)';
    alertDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.75)';
    alertDiv.style.padding = '20px';
    alertDiv.style.color = '#fff';
    alertDiv.style.borderRadius = '10px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.textAlign = 'center';
    alertDiv.style.fontWeight = 'bold';
    alertDiv.style.fontSize = '18px';
    alertDiv.style.width = '320px'; // 调整警告框的宽度
    alertDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    document.body.appendChild(alertDiv);


    // 增加已创建的警告框数量
    alertBoxes++;

    // Automatically remove the alert after a certain time
    setTimeout(() => {
        alertDiv.remove();
        alertBoxes--; // 移除警告框后减少数量
    }, 5000); // Remove the alert after 5 seconds (adjust as needed)
}





// Function to trigger alert for specific train and seat type
function triggerAlertForTrainAndSeat(filteredValues, monitoredTrains, monitoredSeatTypes, threshold) {
    monitoredTrains.forEach(train => {
        monitoredSeatTypes.forEach(seat => {
            filteredValues.forEach(value => {
                const valueParts = value.split(',');
                const trainInfo = valueParts[0];
                const seatInfo = valueParts[1];
                const availableSeats = valueParts[2];




                if (train === trainInfo && seat === seatInfo && parseInt(availableSeats) <= threshold) {

                     var alerttext= `注意: ${train} - ${seat} 余票仅剩 ${availableSeats} 张！`;




    const soundToggle = document.getElementById('sound-toggle');

                  if (soundToggle.checked) {
                  // Create a new speech synthesis utterance
                      const speech = new SpeechSynthesisUtterance();

                      // Set the text that will be spoken
                      speech.text = alerttext;

                      // Use the speech synthesis API to speak the alert message
                      window.speechSynthesis.speak(speech);

}

                  //    window.speechSynthesis.speak(alerttext);

                    displayAlertMessage(alerttext);
                    // You can add sound alert here
                }
            });
        });
    });
}

// Example of monitored trains, seat types, and threshold
// const monitoredTrains = ['Z162次列车', 'K268次列车']; // Replace with user input
// const monitoredSeatTypes = ['硬卧', '硬座']; // Replace with user input
// const threshold = 15; // Replace with user input

// Assuming you have obtained the filteredAriaLabelValues array
// Call the function to trigger alerts for specific train and seat type
//triggerAlertForTrainAndSeat(filteredAriaLabelValues, monitoredTrains, monitoredSeatTypes, threshold);




  // Function to fetch elements with aria-label and their content
function fetchPageContent() {
    const ticketRows = document.querySelectorAll('.ticket-info');
    const content = [];

    ticketRows.forEach(row => {
        const elementsWithAriaLabel = row.querySelectorAll('[aria-label]');
        elementsWithAriaLabel.forEach(element => {
            const ariaLabelValue = element.getAttribute('aria-label');

        });
    });

    return content;
}



    // Function to start monitoring
    function startMonitoring() {
        if (!monitoringEnabled && document.getElementById('trainNumbers').value.trim() !== '') {
            monitoringEnabled = true;
            monitorInterval = setInterval(() => {
                const { trainNumbers, selectedSeatTypes } = getMonitoredInfo()
                const allAriaLabelValues = getAllAriaLabelValues();
                const filteredAriaLabelValues = filterAriaLabelValues(allAriaLabelValues);
//alert(filteredAriaLabelValues);

                triggerAlertForTrainAndSeat(filteredAriaLabelValues, trainNumbers, selectedSeatTypes, document.getElementById('threshold').value);

// 获取当前焦点元素
// const currentFocusedElement = document.activeElement;

  document.getElementById('query_ticket').click();
// 将焦点设置回之前的位置
//if (currentFocusedElement && typeof currentFocusedElement.focus === 'function') {  currentFocusedElement.focus();   }




setTimeout(() => {
  // 获取要滚动到的车次元素（这里假设有一个包含特定类名的元素）
  const trainElement = document.querySelectorAll('.number'); // 这里根据实际情况来选择元素
 //alert(JSON.stringify(trainElement));
  // 如果找到了要滚动到的车次元素，则滚动到该元素位置

      trainElement.forEach(element => {

  if (element.text==trainNumbers[0]) {
  // alert(element.text);

          let count = 0;

      blinkblink=element.parentElement.parentElement.parentElement;
      const blinkIntervalId = setInterval(() => {
        if (count % 2 === 0) {
          blinkblink.style.backgroundColor = 'yellow'; // 修改背景色
          blinkblink.style.opacity = '0.5'; // 修改透明度
        } else {
          blinkblink.style.backgroundColor = ''; // 恢复背景色
          blinkblink.style.opacity = '1'; // 恢复透明度
        }
        count++;

        // 控制闪烁次数
        if (count >= 6) { // 控制闪烁次数
          clearInterval(blinkIntervalId);
          blinkblink.style.backgroundColor = ''; // 结束闪烁后恢复背景色
          blinkblink.style.opacity = '1'; // 结束闪烁后恢复透明度
        }
      }, 200); // 控制闪烁频率，这里设置为300毫秒




    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
    });



}, 1000); // 1秒后执行滚动操作，可以根据需要调整延迟时间





            }, parseInt(document.getElementById('intervalSeconds').value) * 1000);
        }
    }

    // Function to stop monitoring
    function stopMonitoring() {
        if (monitoringEnabled) {
            monitoringEnabled = false;
            clearInterval(monitorInterval);
        }
    }

    // Event listener for toggle monitoring checkbox
    document.getElementById('toggleMonitoring').addEventListener('change', function() {
        if (this.checked) {
            startMonitoring();
        } else {
            stopMonitoring();
        }
    });

  floatingUI.addEventListener('change', function(event) {

      const toggleMonitoring = document.getElementById('toggleMonitoring');

    // 如果声音开关被选中，重新加载用户输入内容
    if (toggleMonitoring.checked) {
      startMonitoring();
        } else {
            stopMonitoring();
        }
});


})();