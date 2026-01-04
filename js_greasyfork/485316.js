// ==UserScript==
// @name         AmazonSupBot
// @namespace    https://t.me/ermutka
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2880px-Amazon_logo.svg.png
// @version      2.1
// @description  Get information about sup!
// @match        https://www.amazon.com/message-us*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/485316/AmazonSupBot.user.js
// @updateURL https://update.greasyfork.org/scripts/485316/AmazonSupBot.meta.js
// ==/UserScript==

(function() {
  'use strict';
    function checkSupportConnection() {
        const supportMessage = document.querySelector('.AgentAvatar__agentInitial___2K5jw');
        if (supportMessage) {
            checkSupportDataBase();
        } else {
            // Support hasn't connected, wait and check again
            setTimeout(checkSupportConnection, 1000);  // Adjust the delay as needed
        }
    }


   function checkSupportDataBase(){
    const support = document.querySelector('.SystemMessage__messageBody___3zi_y').textContent;
    const supportName = support.split(' has joined')[0];
    const supportName1 = support.split(' has joined')[0].replace(/\s+/g, '_');
    console.log(supportName1);

    const messageContainerDiv = document.createElement('div');
    messageContainerDiv.className = 'Message__message___1YUAv Message__agentVariant___2NLqJ Message__firstOfGroup___2HSh- Message__lastOfGroup___3j-No Message__animated___KeDYU';

    var displayName = document.createElement('span');
    displayName.className = 'Message__messageDisplayName___1U_jv';
    displayName.textContent = 'AmazonSupBot';

    var messageBody = document.createElement('div');
    messageBody.className = 'Message__messageBody___3G5M0';

    var contentWrapper = document.createElement('div');
    contentWrapper.className = 'Message__contentWrapper___C8jyb';

    var textContent = document.createElement('span');
    textContent.className = 'Message__textContent___ugH_K';
    textContent.textContent = 'Информация про ' + supportName + ':\n';

    var data = "table_name=" + encodeURIComponent(supportName1);
    var url = "http://ivanovte3.fvds.ru/creat.php";
    GM_xmlhttpRequest({
        method: "POST",
        url: url,
        data: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
          textContent.textContent += response.responseText;
          console.log(response.responseText);
        },
        onerror: function(error) {
            console.error(error);
        }
    });


    contentWrapper.appendChild(textContent);
    messageBody.appendChild(contentWrapper);
    messageContainerDiv.appendChild(displayName);
    messageContainerDiv.appendChild(messageBody);

    const systemMessageContainer = document.querySelector('.SystemMessage__systemMessage___3u5N2');

    if (systemMessageContainer && systemMessageContainer.parentNode) {
      if (systemMessageContainer.nextSibling) {
        systemMessageContainer.parentNode.insertBefore(messageContainerDiv, systemMessageContainer.nextSibling);
      } else {
        systemMessageContainer.parentNode.appendChild(messageContainerDiv);
    }
  }
    var targetElement = document.querySelector('.EndChatButton__endChatButton___3kL2s');
    if (targetElement) {
        var buttonHTML1 = '<div class="EndChatButton__endChatButton___3kL2s"><button id="feedbackButton1">Дал</button></div>';
        var buttonHTML2 = '<div class="EndChatButton__endChatButton___3kL2s"><button id="feedbackButton2">Дал после заказа</button></div>';
        var buttonHTML3 = '<div class="EndChatButton__endChatButton___3kL2s"><button id="feedbackButton3">Не дал</button></div>';
        targetElement.insertAdjacentHTML('afterend', buttonHTML1);
        targetElement.insertAdjacentHTML('afterend', buttonHTML2);
        targetElement.insertAdjacentHTML('afterend', buttonHTML3);
    }
    function feedback1() {
    var give = "Дал";
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();
    var data = year + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');
    var postData = "table_name=" + encodeURIComponent(supportName1) +
                   "&give=" + encodeURIComponent(give) +
                   "&data=" + encodeURIComponent(data);
    var phpScriptURL = "http://ivanovte3.fvds.ru/input.php";
    GM_xmlhttpRequest({
        method: "POST",
        url: phpScriptURL,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: postData,
        onload: function(response) {
            var responseData = response.responseText;
            alert(responseData);
            console.log(responseData);
        }
    });
}
    function feedback2() {
    var give = "Дал после заказа";
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();
    var data = year + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');
    var postData = "table_name=" + encodeURIComponent(supportName1) +
                   "&give=" + encodeURIComponent(give) +
                   "&data=" + encodeURIComponent(data);
    var phpScriptURL = "http://ivanovte3.fvds.ru/input.php";
    GM_xmlhttpRequest({
        method: "POST",
        url: phpScriptURL,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: postData,
        onload: function(response) {
            var responseData = response.responseText;
            alert(responseData);
            console.log(responseData);
        }
    });
    }
    function feedback3() {
    var give = "Не дал";
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();
    var data = year + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');
    var postData = "table_name=" + encodeURIComponent(supportName1) +
                   "&give=" + encodeURIComponent(give) +
                   "&data=" + encodeURIComponent(data);
    var phpScriptURL = "http://ivanovte3.fvds.ru/input.php";
    GM_xmlhttpRequest({
        method: "POST",
        url: phpScriptURL,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: postData,
        onload: function(response) {
            var responseData = response.responseText;
            alert(responseData);
            console.log(responseData);
        }
    });
    }

    document.getElementById('feedbackButton1').addEventListener('click', feedback1);
    document.getElementById('feedbackButton2').addEventListener('click', feedback2);
    document.getElementById('feedbackButton3').addEventListener('click', feedback3);
   }


    checkSupportConnection();

})();