// ==UserScript==
// @name          포켓 클리커 매크로 & 클리커
// @namespace     포켓 클리커 매크로 & 클리커
// @match         *://www.pokeclicker.com/
// @version       0.1
// @description   https://www.pokeclicker.com/ 자동 클릭
// @icon          data:image/jpeg;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/319hf99fYX/fX2F/319hf8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////99fYX/fX2F/319hf8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////////////////wAAAP8AAAD/fX2F/319hf99fYX/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////8AAAD/AAAA/wAAAP99fYX/fX2F/wAAAP8AAAD/AAAA/319hf8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/HBT//xwU//8AAAD//////319hf8AAAD/Dgim/w4Ipv8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAD/HBT//xwU//8cFP//HBT//wAAAP8AAAD/Dgim/w4Ipv8OCKb/Dgim/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAA/xwU//8cFP//HBT//xwU/44cFP//HBT//xwU//8cFP//Dgim/w4Ipv8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/HBT//xwU/47/////HBT/jhwU//8cFP//HBT//w4Ipv8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/xwU//8cFP//HBT/jhwU//8OCKb/Dgim/w4Ipv8OCKb/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/xwU//8OCKb/Dgim/w4Ipv8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAPw/AADwDwAA4AcAAOAHAADAAwAAwAMAAMADAADAAwAA4AcAAOAHAADwDwAA/D8AAP//AAD//wAA//8AAA==
// @author        mickey90427 <mickey90427@naver.com>
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/534732/%ED%8F%AC%EC%BC%93%20%ED%81%B4%EB%A6%AC%EC%BB%A4%20%EB%A7%A4%ED%81%AC%EB%A1%9C%20%20%ED%81%B4%EB%A6%AC%EC%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/534732/%ED%8F%AC%EC%BC%93%20%ED%81%B4%EB%A6%AC%EC%BB%A4%20%EB%A7%A4%ED%81%AC%EB%A1%9C%20%20%ED%81%B4%EB%A6%AC%EC%BB%A4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let clicking = false;
  let frameId = null;

  // 토글 버튼 생성
  const toggleBtn = document.createElement('button');
  toggleBtn.innerText = '오토클릭 OFF';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.left = '10px';
  toggleBtn.style.bottom = '10px';
  toggleBtn.style.zIndex = 9999;
  toggleBtn.style.padding = '10px';
  toggleBtn.style.backgroundColor = '#800';
  toggleBtn.style.color = '#fff';
  toggleBtn.style.border = 'none';
  toggleBtn.style.borderRadius = '5px';
  toggleBtn.style.cursor = 'pointer';
  document.body.appendChild(toggleBtn);

  function clickLoop() {
    if (!clicking) return;

    const target = document.querySelector('img.enemy');
    if (target) target.click();

    frameId = requestAnimationFrame(clickLoop);
  }

  toggleBtn.addEventListener('click', () => {
    clicking = !clicking;
    toggleBtn.innerText = clicking ? '오토클릭 ON' : '오토클릭 OFF';
    toggleBtn.style.backgroundColor = clicking ? '#080' : '#800';

    if (clicking) {
      clickLoop();
    } else {
      cancelAnimationFrame(frameId);
    }
  });
})();
