// ==UserScript==
// @name         유튜브 추첨기
// @namespace    핫식스 존나 맛있다
// @version      0.4
// @description  핫식스
// @author       핫식스
// @match        https://www.youtube.com/live_chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467884/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EC%B6%94%EC%B2%A8%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/467884/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EC%B6%94%EC%B2%A8%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
    console.log("로딩중..."); //로딩

    var userList = [];

    //옵저버
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            var added = mutation.addedNodes[0];
            if (added?.tagName == 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER') {
                var userData = {};
                userData.img = added.querySelector("yt-img-shadow img").src;
                userData.name = added.querySelector("yt-live-chat-author-chip").innerText;

                if (
                    userList.filter((e) => e.img == userData.img && e.name == userData.name)
                        .length == 0
                ) {
                    userList.push(userData);
                    modal.querySelector('#rouletteParticipant ul').innerHTML += `<li style="display:flex;flex-direction:row;align-items:center" id="unSelected"><img src="${userData.img}">${userData.name}</li>`;
                }
            }

        });
    });
    var config = {
        childList: true,
    };


    //모달창
    var modal = document.createElement('div');
    document.querySelector('body').style = '100vh';
    modal.style.cssText = 'width:100%;height:100%;background-color:white;top:0px;left:0px;position:absolute;display:none;font-size:15px;overflow-y:auto';
    modal.innerHTML = `
    <style>
    #rouletteControl button{
        color:black;
        border:1px solid red;
    }
    </style>
    
    <div id="rouletteControl" style="text-align:center">
          <button id="gatherBtn">시작</button>
          <button id="raffleBtn">추첨</button>
          <button id="closeModal">닫기</button>
      </div>
      <div id="rouletteResult" style="display:flex;flex-direction:column;align-items:center">
          <h2>당첨자</h2>
          <span style="height:35px"></span>
      </div>
      <div id="rouletteParticipant" style="display:flex;flex-direction:column;align-items:center">
          <h2>참가자</h2>
          <ul style="list-style-type: none;padding-left:0;">
  
          </ul>
      </div>`;
    var gatherBtn = modal.querySelector('#gatherBtn');
    var raffleBtn = modal.querySelector('#raffleBtn');
    var closeBtn = modal.querySelector('#closeModal');
    gatherBtn.addEventListener("click", function () {
        if (this.innerText == "시작") {
            userList = [];
            modal.querySelector('#rouletteParticipant ul').innerHTML = '';
            modal.querySelector('#rouletteResult span').innerHTML = '';
            var target = document.querySelectorAll("#items")[1];
            observer.observe(target, config);
            this.innerText = "중지";
            raffleBtn.disabled = true;
        } else {
            observer.disconnect();
            this.innerText = "시작";
            raffleBtn.disabled = false;
        }
    });

    raffleBtn.addEventListener("click", function () {
        if (userList.length !== 0) {
            var rand = Math.floor(Math.random() * userList.length);
            var pre = -1;
            modal.querySelector('#rouletteResult span').style.color = 'black';
            raffleBtn.disabled = true;

            if(userList.length == 1){
                modal.querySelector('#rouletteResult span').style.color = 'red';
                modal.querySelector('#rouletteResult span').innerHTML = `<div style="display:flex;flex-direction:row;align-items:center"><img src="${userList[rand].img}">${userList[rand].name}</div>`;
                modal.querySelectorAll('li#unSelected')[rand].style.opacity = '30%';
                modal.querySelectorAll('li#unSelected')[rand].setAttribute('id', 'selected');
                userList.splice(rand, 1);
                raffleBtn.disabled = false;
            }
            else{
                for (i = 0; i < 20; i++) {
                    (function (x) {
                        setTimeout(function () {
                            var random = Math.floor(Math.random() * userList.length);
                            while (random == pre) {
                                random = Math.floor(Math.random() * userList.length);
                            }
                            pre=random;
                            modal.querySelector('#rouletteResult span').innerHTML = `<div style="display:flex;flex-direction:row;align-items:center"><img src="${userList[random].img}">${userList[random].name}</div>`;
                        }, 100 * x);
                    })(i);
                }
    
                setTimeout(function () {
                    modal.querySelector('#rouletteResult span').style.color = 'red';
                    modal.querySelector('#rouletteResult span').innerHTML = `<div style="display:flex;flex-direction:row;align-items:center"><img src="${userList[rand].img}">${userList[rand].name}</div>`;
                    modal.querySelectorAll('li#unSelected')[rand].style.opacity = '30%';
                    modal.querySelectorAll('li#unSelected')[rand].setAttribute('id', 'selected');
                    userList.splice(rand, 1);
                    raffleBtn.disabled = false;
                }, 2000)
            }
        }
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = 'none';
    })

    document.querySelector('body').appendChild(modal);


    //모달창 열기
    var toggle = document.createElement('button');
    toggle.innerText = '추첨 열기';
    toggle.addEventListener('click', function () {
        modal.style.display = 'block'
    });
    document.querySelector("#primary-content").appendChild(toggle);
    /*
    document.querySelector("yt-live-chat-header-renderer").style.height = "200px";
    document.querySelector("#primary-content").appendChild(roulette);
    */
    console.log("로딩 완료");
})();

