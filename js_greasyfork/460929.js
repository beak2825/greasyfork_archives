// ==UserScript==
// @name          고급 볼륨 제어
// @namespace     고급 볼륨 제어
// @match       https://www.youtube.com/*
// @version       0.1
// @description   고급 볼륨 제어 버튼이 좌측 하단에 계속 따라다니며, 해당 버튼을 누르면 1~10까지 볼륨 조절이 가능하며 ↑방향키와 ↓방향키로도 볼륨 조절이 가능합니다
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAe1BMVEVHcEymAACFhYXkAAC/AADyAADTAAD/////Ly//AwPhBgbxAAAmAAD5AADxAADJAADVBATaDw+BAADTAgL/LCzWAADhCAjfGhr/KCjnAAD0AADOAAD/AAD/////9/f/7+//e3v/UFD/vr7/qan/PT3/39//kJD/Kir/zc0Q/tNHAAAAHHRSTlMALQOZg+HKD8j9S+wQ88ttWX4fO6+0imqYqbniBuNvagAAAZNJREFUWIXtlt1ygjAQhTdEaBOSQEQBNVGrrfX9n7ABRlvR/EhueuGZYRgg52MTluwCvPTSv1LCEKpo00jZtovF4n0sc69ta9k0Ja0QYsnIPpdrkeZEKdUdv6erhmvSn3ieCoHpXztWT4uotLz4Wfq8v1cz+FE+0a/UEMNqsl/l/QJM9w8hFDEAHDcDpQSDRMQA0jnMp37DXhxFAggFxG0P9+N0fqQSKuuw7TmAUEBpB2h99CJqRxoYgD5/eADYAzBBfDoBK5h5AHq3dwGWfoDWX455BAH09mgdlAUBHPMIBWh9eLyYGdSBgN3p4SARGoElgNAp2L9DGOD0bR0UAjjY7V0e+FLZnYhegEkh4vwjMZQugCuJLwBqfYEv+l4SKuuWdvC+XnU7UkRl7FTG7soVsKjCkiOAdUwApjKBjIlgbYprFQOQXYMQs4qsA9Dp/npokiYT6kubVk5LpqvfSIo8pBZfRbjA7KZVZYgWM7zMsk3O+V2f2nsI4TzdZNkSzwpa3drHfXOSvN3J3HR32y+9FKEfw10c+oXU9S4AAAAASUVORK5CYII
// @author        mickey90427 <mickey90427@naver.com>
// @downloadURL https://update.greasyfork.org/scripts/460929/%EA%B3%A0%EA%B8%89%20%EB%B3%BC%EB%A5%A8%20%EC%A0%9C%EC%96%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/460929/%EA%B3%A0%EA%B8%89%20%EB%B3%BC%EB%A5%A8%20%EC%A0%9C%EC%96%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 오디오 컨텍스트와 게인 노드를 생성합니다.
    var audioCtx = new AudioContext();
    var gainNode = audioCtx.createGain();
    var videoElement = document.querySelector("video");
    var mkttalk_source = audioCtx.createMediaElementSource(videoElement);
    mkttalk_source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 1;

    // 고급 볼륨 제어 버튼을 만듭니다.
    var volumeBtn = document.createElement("button");
    volumeBtn.setAttribute("style", "position: fixed; bottom: 10px; left: 10px; z-index: 9999;");
    volumeBtn.innerText = "고급 볼륨 제어";
    document.body.appendChild(volumeBtn);

    // 고급 볼륨 제어 박스를 만듭니다.
    var volumeBox = document.createElement("div");
    volumeBox.setAttribute("style", "position: fixed; bottom: 60px; left: 10px; width: 50px; height: 100px; padding: 10px; background-color: #fff; border: 1px solid #ccc; display: none; z-index: 9999;");
    volumeBox.innerHTML = '<label for="volume-input">볼륨:</label><input id="volume-input" type="number" min="1" max="10" value="1">방향키로 볼륨 조절 가능';
    document.body.appendChild(volumeBox);

    // 고급 볼륨 제어 버튼에 이벤트 리스너를 추가합니다.
    volumeBtn.addEventListener("click", function() {
        volumeBox.style.display = (volumeBox.style.display === "none") ? "block" : "none";
    });

    // 볼륨 입력 상자에 이벤트 리스너를 추가합니다.
    var volumeInput = document.getElementById("volume-input");
    volumeInput.addEventListener("change", function() {
        gainNode.gain.value = volumeInput.value;
    });

    // 전체 화면 모드일 시 고급 볼륨 제어 버튼을 숨깁니다.
    document.addEventListener("fullscreenchange", function() {
        if (document.fullscreenElement) {
            volumeBtn.style.display = "none";
        } else {
            volumeBtn.style.display = "block";
        }
    });
})();