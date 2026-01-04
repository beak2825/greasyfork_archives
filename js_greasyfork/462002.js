// ==UserScript==
// @name            [뉴스픽] 쿠팡 파트너스 배너 제거기
// @namespace       https://github.com/No-Eul
// @version         1.0.2
// @description     쿠팡 파트너스로 등록된 게시물을 쿠팡 사이트 접속 없이 볼 수 있게 합니다.
// @author          NoEul
// @license         MIT License
// @source          https://github.com/No-Eul/scripts
// @supportURL      https://github.com/No-Eul/scripts/issues
// @match           *://m.newspic.kr/*
// @match           *://newspic.kr/*
// @icon            http://newspic.kr/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/462002/%5B%EB%89%B4%EC%8A%A4%ED%94%BD%5D%20%EC%BF%A0%ED%8C%A1%20%ED%8C%8C%ED%8A%B8%EB%84%88%EC%8A%A4%20%EB%B0%B0%EB%84%88%20%EC%A0%9C%EA%B1%B0%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/462002/%5B%EB%89%B4%EC%8A%A4%ED%94%BD%5D%20%EC%BF%A0%ED%8C%A1%20%ED%8C%8C%ED%8A%B8%EB%84%88%EC%8A%A4%20%EB%B0%B0%EB%84%88%20%EC%A0%9C%EA%B1%B0%EA%B8%B0.meta.js
// ==/UserScript==

/*
 * MIT License
 *
 * Copyright (c) 2023 No-Eul
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(() => {
	let content = document.getElementById("bo_v_atc");
	content.querySelectorAll("div.continue_reading, div.continue_coupang").forEach($ => $.remove());
	content.classList.remove("omit_wrap");
	content.style.removeProperty("max-height");
})();
