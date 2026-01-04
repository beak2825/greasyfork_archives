// ==UserScript==
// @name     make fsm vote better β
// @description   FSM自治委员会投票优化
// @namespace  http://tampermonkey.net/
// @version   2024-05-10
// @author    fsm@orance-@leihou-@bf1793
// @match    https://fsm.name/Votes/details?voteId=*
// @icon     data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant    none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/494518/make%20fsm%20vote%20better%20%CE%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/494518/make%20fsm%20vote%20better%20%CE%B2.meta.js
// ==/UserScript==



(function() {

  const currentUrl = window.location.href;

  const voteId = currentUrl.match(/voteId=(\d+)/)[1];



  // 获取两个按钮的XPath

  const xpathNextButton1 = '//*[@id="app"]/div/section/main/div/div[2]/div[2]/div/div[2]/form/div[2]/button[1]/span';

  const xpathNextButton2 = '//*[@id="app"]/div/section/main/div/div[2]/div[2]/div/div[2]/form/div[2]/button[2]/span';


  // 添加上一题下一题按钮

  const prevButton = document.createElement('button');

  prevButton.textContent = '上一题';

  prevButton.style.position = 'fixed';

  prevButton.style.top = '10px';

  prevButton.style.right = '70px';

  prevButton.addEventListener('click', function() {

    const prevVoteId = parseInt(voteId) - 1;

    window.location.href = `https://fsm.name/Votes/details?voteId=${prevVoteId}`;

  });



  const nextButton = document.createElement('button');

  nextButton.textContent = '下一题';

  nextButton.style.position = 'fixed';

  nextButton.style.top = '10px';

  nextButton.style.right = '10px';

  nextButton.addEventListener('click', function() {

    const nextVoteId = parseInt(voteId) + 1;

    window.location.href = `https://fsm.name/Votes/details?voteId=${nextVoteId}`;

  });



  document.body.appendChild(prevButton);

  document.body.appendChild(nextButton);


  // 点击按钮后的处理函数

  function handleButtonClick() {

    console.log("按钮点击事件触发，2秒后跳转到下一题");

    const nextVoteId = parseInt(voteId) + 1;

    console.log("下一题的投票ID:", nextVoteId);

    window.location.href = `https://fsm.name/Votes/details?voteId=${nextVoteId}`;

  }


  // 上方向键对应xpathNextButton1，下方向键对应xpathNextButton2

  // 右方向键跳转到下一题，左方向键跳转上一题

  document.addEventListener('keydown', function(e) {
      const prevVoteId = parseInt(voteId) - 1;
      const nextVoteId = parseInt(voteId) + 1;

    switch(e.key) {

      case 'ArrowUp':

        document.evaluate(xpathNextButton1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();

        showPopup('建议保留');

        setTimeout(hidePopup, 500);

        break;

      case 'ArrowDown':

        document.evaluate(xpathNextButton2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();

        showPopup('同意删除');

        setTimeout(hidePopup, 500);

        break;

      case 'ArrowRight':

        window.location.href = `https://fsm.name/Votes/details?voteId=${nextVoteId}`;

        break;

      case 'ArrowLeft':

        window.location.href = `https://fsm.name/Votes/details?voteId=${prevVoteId}`;

        break;

    }

  });



  // 监视页面变化，直到按钮元素出现后再绑定点击事件

  const observer = new MutationObserver(function(mutationsList, observer) {

    const nextButton1 = document.evaluate(xpathNextButton1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    const nextButton2 = document.evaluate(xpathNextButton2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (nextButton1 && nextButton2) {

      console.log("找到投票按钮，开始绑定点击事件");

      nextButton1.addEventListener('click', function() {

        setTimeout(handleButtonClick, 2000);

      });

      nextButton2.addEventListener('click', function() {

        setTimeout(handleButtonClick, 2000);

      });

      observer.disconnect();

    }

  });



  observer.observe(document.documentElement, {

    childList: true,

    subtree: true

  });


// 弹窗显示

  function showPopup(message) {

    const popup = document.createElement('div');

    popup.className = 'popup'; // 添加类名

    popup.style.position = 'fixed';

    popup.style.top = '50%';

    popup.style.left = '50%';

    popup.style.transform = 'translate(-50%, -50%)';

    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';

    popup.style.color = '#fff';

    popup.style.padding = '10px 20px';

    popup.style.borderRadius = '5px';

    popup.style.zIndex = '9999';

    popup.textContent = message;

    document.body.appendChild(popup);

  }



  // 弹窗隐藏

  function hidePopup() {

    const popup = document.querySelector('.popup');

    if (popup) {

      popup.remove();

    }

  }

})();
