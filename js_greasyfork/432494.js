// ==UserScript==
// @name rpg.kr 편의기능 애드온
// @namespace Script Runner Pro
// @description 게임 플레이에 필요한 편의기능을 구현한 스크립트입니다.
// @match https://rpg.kr/
// @grant none
// @version 0.1.0
// @downloadURL https://update.greasyfork.org/scripts/432494/rpgkr%20%ED%8E%B8%EC%9D%98%EA%B8%B0%EB%8A%A5%20%EC%95%A0%EB%93%9C%EC%98%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/432494/rpgkr%20%ED%8E%B8%EC%9D%98%EA%B8%B0%EB%8A%A5%20%EC%95%A0%EB%93%9C%EC%98%A8.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(_ => {
  const frame = window.frames.mainFrame;

  frame.onload = function() {
    const doc = frame.contentDocument;
    const main = doc.getElementById("main");

    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        contentChanged();
      });
    });

    observer.observe(main, {
      childList: true
    });

    // 게임 메뉴를 선택할 때마다 호출되는 함수입니다.
    const contentChanged = () => {

      // 전투 알리미 값을 읽어서 전투/탐사에 최대치를 자동으로 입력합니다.
      const alimi = doc.getElementById("alimiWkpDisp");

      const rept = doc.getElementById("rept");
      const rInp = doc.getElementById("rInp");

      const alimiChanged = () => {
        if(rept) {
          rept.value = alimi.textContent;
        }

        if(rInp) {
          rInp.value = parseInt(parseInt(alimi.textContent)/20);
        }
      }

      const alimiObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          alimiChanged();
        });
      });

      if(alimi) {
        alimiObserver.observe(alimi, {
          childList: true
        });
        alimiChanged();
      }

      //엔터키 눌렀을 때 form의 submit(전투 실행)을 방지합니다.
      const form = doc.forms.rform;
      if(form) form.onkeydown = (event) => {
        switch(event.key) {
          case 'Enter':
            event.preventDefault();
            break;
        }
      };
    };

    //키보드 입력에 따른 기능을 처리합니다.
    const clickElement = (text, isSpecial) => {
      const xpaths = isSpecial ? [(code) => `//font[text() = '${code}']`,] :
      [
        (code) => `//a[text() = '${code}']`,
        (code) => `//input[@value = '${code}']`,
        (code) => `//div[text() = '${code}' and @class='button']`,
      ];

      xpaths.some(xpath => {
        var element = doc.evaluate(xpath(text), doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if(element) {
          element.click();
          return true;
        }
      });
      return false;
    }

    const onKeyUp = (event) => {
      //input창에서 값을 입력중일 때는 기능 실행하지 않음.
      const activeElement = doc.activeElement.tagName.toLowerCase();
      if(activeElement == "input" && event.key != 'Enter') return;

      switch(event.key) {
        case 'Enter':
          var buttons = ["전투", "탐사", "로그인"];
          buttons.some(button => {
            if(clickElement(button)) return;
          });
          break;
        case 'Backspace':
          clickElement("돌아가기");
          break;
        case 'ArrowLeft':
          clickElement("◁");
          break;
        case 'ArrowRight':
          clickElement("▷");
          break;
        case '`':
          clickElement("개요");
          break;
        case '1':
          clickElement("상세");
          break;
        case '2':
          clickElement("훈련");
          break;
        case '3':
          clickElement("능력");
          break;
        case '4':
          clickElement("가방");
          break;
        case '5':
          clickElement("장비");
          break;
        case '6':
          clickElement("전투", true);
          break;
        case '7':
          clickElement("협동");
          break;
        case '8':
          clickElement("결투");
          break;
        case '9':
          clickElement("제전");
          break;
        case '0':
          clickElement("세력");
          break;
        case '-':
          clickElement("마을");
          break;
        case '=':
          clickElement("도감");
          break;
        case '\\':
          clickElement("업적");
          break;
      }
    }

    doc.addEventListener('keyup', onKeyUp);
  }
})();