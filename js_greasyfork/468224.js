// ==UserScript==
// @name          네이버 카페 게시물 실제 아이디 클립보드 복사
// @namespace     네이버 카페 게시물 실제 아이디 클립보드 복사
// @grant         GM_setClipboard
// @match         *://*cafe.naver.com/*
// @exclude       *://cafe.naver.com/ca-fe/*
// @version       0.5
// @description   네이버 카페 게시물의 작성자 아이디를 버튼을 통해 클립보드로 복사하고, 복사된 아이디를 표시합니다. 닉네임 옆에 "(아이디)" 텍스트를 추가합니다. 블로그 가기 버튼과 블로그 구독 버튼을 추가하고 아이콘을 표시합니다.
// @icon          data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKUSURBVHgB7Zc9b9NQFIbfc+22aQTCCBWJzT+hLEgFIaW/oB0AQZamW5mg/yBdqRD0FxAWiMRAOpCFoUYCIrE0O0PCgFiQGjHko7Hv4dj5/mqckkRC8EiW7euj+77Hvvfca+Bfh3AOHn6/t2mYessgHSNoS5EGEcM/t9Ca956uZJPj+jIxATs/EjZz7QWDY9rXEvvUTIHAwbllgphLYfoMbSBRSNinrnesyLC6M1VyaPI7qouZTjvBdcL0G8pAorBja1U7AitL5CRXFbSzyBjKw6I6DT5BBy7uX32fD9N3KAN16EfEht24I5GXTCXb6EIZpnIH4klREiEJZcBjtama1wouootlLC9UhgdrPnhyJfsS0zJw5+tOTAzY/hiLLpVxKVKSgcYjxfdXso8xAWMNMJlWxKjg8vIJImZteAzDYSaZdu8cTMhYAyvGz/zFC7+2G0qDz+v1Ref5tUwRfys9ldD4GE8wwcYM0MR5+MdaujjaQC7OmD0pL1LexfVMUCkV5k9CVaNHrZv5GCDOyFRp1wZ57avqUzw5PwMuHXo3X8v44t2OKWzMz0ATXVlKtfUJq3M3gEjV6robMggZodbwiTFxguNNy4R629HSHxqPuqHAgIVpoyllVKNW9xxXppf00PcGpKYfYhYQ9yQlK/le/cabYL/QY0B2OhnMCA4+Lzuyh1x3b71Kts30B6pcvCCNNqYEuSJ4O+2Meq4GG/Q2pkfqLPGGXh/uWtqR/cYB/hDZORc96L1xcSP/C4zPD1JSLbZwTnHZuq73r3zDGFmI/NIp7sZmMCiOfFhxn/F/Rl/urhqe+UxCY2eF+aNcEQ7ctc4In46BFrn7tiK1IXM41p7XTCX5I/rmr3ZupJpvrfH/mYTfRefs0vcTSpcAAAAASUVORK5CYII=
// @author        mickey90427 <mickey90427@naver.com>
// @downloadURL https://update.greasyfork.org/scripts/468224/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EA%B2%8C%EC%8B%9C%EB%AC%BC%20%EC%8B%A4%EC%A0%9C%20%EC%95%84%EC%9D%B4%EB%94%94%20%ED%81%B4%EB%A6%BD%EB%B3%B4%EB%93%9C%20%EB%B3%B5%EC%82%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/468224/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EA%B2%8C%EC%8B%9C%EB%AC%BC%20%EC%8B%A4%EC%A0%9C%20%EC%95%84%EC%9D%B4%EB%94%94%20%ED%81%B4%EB%A6%BD%EB%B3%B4%EB%93%9C%20%EB%B3%B5%EC%82%AC.meta.js
// ==/UserScript==

(function () {
  // 버튼 클릭 시 아이디 복사 함수
  function copyWriterId() {
    const writerId = this.getAttribute('data-writer-id');
    GM_setClipboard(writerId);
    showCopiedText(writerId);
  }

  // '블로그 가기' 버튼 클릭 시 블로그로 이동하는 함수
  function goToBlog() {
    const writerId = this.getAttribute('data-writer-id');
    const blogUrl = `https://blog.naver.com/${writerId}`;
    window.open(blogUrl, '_blank');
  }

  // '블로그 구독' 버튼 클릭 시 블로그 구독 주소를 열어주는 함수
  function subscribeToBlog() {
    const writerId = this.getAttribute('data-writer-id');
    const rssUrl = `https://rss.blog.naver.com/${writerId}.xml`;
    window.open(rssUrl, '_blank');
  }

  // 이메일 복사 함수
  function copyWriterEmail() {
    const writerId = this.getAttribute('data-writer-id');
    const email = `${writerId}@naver.com`;
    GM_setClipboard(email);
    showCopiedText(email);
  }

  // 복사된 아이디 표시 함수
  function showCopiedText(writerId) {
    const textElement = document.createElement('div');
    textElement.className = 'copied-text';
    textElement.textContent = `복사됨 : ${writerId}`;
    document.querySelector('.article_info').appendChild(textElement);
    setTimeout(() => {
      textElement.remove();
    }, 1000);
  }

  // MutationObserver 콜백 함수
  function observeMutation(mutations) {
    mutations.forEach((mutation) => {
      // 노드 추가일 경우
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        const addedNode = mutation.addedNodes[0];
        // 추가된 노드가 작성자 정보 버튼을 포함하고 있는지 확인
        if (addedNode.querySelector('.article_header')) {
          const writerInfoButton = addedNode.querySelector('[id^="writerInfo"]');
          const writerId = writerInfoButton.id.replace("writerInfo", "");

          // 버튼 추가
          const nickLevelElement = addedNode.querySelector('.nick_level');

          const button = document.createElement('button');
          button.className = 'copy-button';
          button.innerHTML = `
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M14 5H4v16h16V9h-2v10H6V7h8z"/>
            </svg>
            아이디 복사
          `;
          button.setAttribute('data-writer-id', writerId);
          button.addEventListener('click', copyWriterId);

          const emailButton = document.createElement('button');
          emailButton.className = 'email-button';
          emailButton.innerHTML = `
            <svg class="email-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-1.414 2L12 10.586 5.414 6H18.586zM4 18V8.414l7 5.657 7-5.657V18H4z"/>
            </svg>
            이메일 복사
          `;
          emailButton.setAttribute('data-writer-id', writerId);
          emailButton.addEventListener('click', copyWriterEmail);

          const blogButton = document.createElement('button');
          blogButton.className = 'blog-button';
          blogButton.innerHTML = `
            <svg class="blog-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M14 5H4v16h16V9h-2v10H6V7h8z"/>
            </svg>
            블로그 가기
          `;
          blogButton.setAttribute('data-writer-id', writerId);
          blogButton.addEventListener('click', goToBlog);

          const subscribeButton = document.createElement('button');
          subscribeButton.className = 'subscribe-button';
          subscribeButton.innerHTML = `
            <svg class="rss-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M7 17.68A4.008 4.008 0 0 1 4 14c0-1.69 1.06-3.12 2.55-3.68a3 3 0 1 1 3.9 0A4.008 4.008 0 0 1 20 14c0 2.21-1.79 4-4 4H8a4.004 4.004 0 0 1-1-7.32zM8 18h8a2.996 2.996 0 0 0 2.95-3.555L19 14c0-1.654-1.346-3-3-3h-1V6a6 6 0 1 0-2 0v5H8c-1.654 0-3 1.346-3 3s1.346 3 3 3zm0-2v2h8v-2H8z"/>
            </svg>
            블로그 구독
          `;
          subscribeButton.setAttribute('data-writer-id', writerId);
          subscribeButton.addEventListener('click', subscribeToBlog);

          // 버튼을 담을 컨테이너 추가
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'button-container';
          buttonContainer.appendChild(button);
          buttonContainer.appendChild(emailButton);
          buttonContainer.appendChild(blogButton);
          buttonContainer.appendChild(subscribeButton);

          nickLevelElement.insertAdjacentElement('afterend', buttonContainer);

          // 닉네임 수정
          const nicknameButton = addedNode.querySelector('.nickname');
          const nicknameText = nicknameButton.textContent.trim();
          nicknameButton.textContent = `${nicknameText} (${writerId})`;

          // 스타일 수정
          buttonContainer.style.marginLeft = '0px';
          nicknameButton.style.marginRight = '0px';
          nicknameButton.style.paddingRight = '0px';
        }
      }
    });
  }

  // 스타일 추가
  const style = document.createElement('style');
  style.textContent = `
    .copy-button, .email-button, .blog-button, .subscribe-button {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 4px;
      color: #fff;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;
      margin: 0 2px;
    }

    .copy-button {
      background-color: #4CAF50;
    }

    .copy-button:hover {
      background-color: #45A049;
    }

    .email-button {
      background-color: #2196F3;
    }

    .email-button:hover {
      background-color: #1E88E5;
    }

    .blog-button {
      background-color: #FF9800;
    }

    .blog-button:hover {
      background-color: #F57C00;
    }

    .subscribe-button {
      background-color: #FF5722;
    }

    .subscribe-button:hover {
      background-color: #F4511E;
    }

    .copy-icon, .email-icon, .blog-icon, .rss-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
      margin-right: 4px;
    }

    .copied-text {
      margin-top: 8px;
      font-size: 12px;
      color: #666;
    }
  `;

  document.head.appendChild(style);

  // MutationObserver 생성
  const observer = new MutationObserver(observeMutation);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
