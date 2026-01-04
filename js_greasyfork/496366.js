// ==UserScript==
// @name         인천대학교 LMS 로그인 스크립트
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  인천대학교 LMS에 자동으로 로그인
// @match        https://cyber.inu.ac.kr/login.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496366/%EC%9D%B8%EC%B2%9C%EB%8C%80%ED%95%99%EA%B5%90%20LMS%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/496366/%EC%9D%B8%EC%B2%9C%EB%8C%80%ED%95%99%EA%B5%90%20LMS%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 쿠키를 설정하는 함수
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // 쿠키를 가져오는 함수
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // URL에서 오류 코드 가져오기
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // 로그인 정보 쿠키에서 가져오기
    var username = getCookie('autoLoginUsername');
    var password = getCookie('autoLoginPassword');

    // URL에서 오류 코드 확인
    var errorCode = getUrlParameter('errorcode');

    // 입력 필드가 준비될 때까지 대기
    function waitForElement(selector, callback) {
        var element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(function() {
                waitForElement(selector, callback);
            }, 100);
        }
    }

    // 오류 코드가 존재하거나 쿠키가 없으면 로그인 정보 재발급
    if (errorCode || !username || !password) {
        alert("로그인 오류가 발생했거나 로그인 정보가 없습니다. 새로운 로그인 정보를 입력하세요.");
        username = prompt("아이디를 입력하세요:", "");
        password = prompt("비밀번호를 입력하세요:", "");

        // 입력받은 정보를 쿠키에 저장
        setCookie('autoLoginUsername', username, 7); // 7일 동안 유효
        setCookie('autoLoginPassword', password, 7); // 7일 동안 유효
    }

    // 페이지 로드 후 실행될 함수
    function login() {
        waitForElement('#input-username', function(usernameInput) {
            waitForElement('#input-password', function(passwordInput) {
                waitForElement('input[name="loginbutton"]', function(loginButton) {
                    console.log("usernameInput:", usernameInput);
                    console.log("passwordInput:", passwordInput);
                    console.log("loginButton:", loginButton);

                    // input-username과 input-password 요소가 존재하는지 확인
                    if (usernameInput && passwordInput) {
                        // 로그인 정보 입력
                        usernameInput.value = username;
                        passwordInput.value = password;

                        // 로그인 버튼 클릭
                        if (loginButton) {
                            loginButton.click();
                        } else {
                        }
                    } else {
                    }
                });
            });
        });
    }

    // 페이지 로드 후 실행
    window.addEventListener('load', function() {
        login();
    });

})();
