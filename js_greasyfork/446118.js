// ==UserScript==
// @name         基礎情報演習1B classroomリンク挿入
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ScombZの基礎情報演習１Bの科目ページにclassroommへのリンクを挿入します
// @author       @yudai1204
// @match        https://scombz.shibaura-it.ac.jp/lms/course?idnumber=202201SU0056281001
// @icon         https://scombz.shibaura-it.ac.jp/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446118/%E5%9F%BA%E7%A4%8E%E6%83%85%E5%A0%B1%E6%BC%94%E7%BF%921B%20classroom%E3%83%AA%E3%83%B3%E3%82%AF%E6%8C%BF%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/446118/%E5%9F%BA%E7%A4%8E%E6%83%85%E5%A0%B1%E6%BC%94%E7%BF%921B%20classroom%E3%83%AA%E3%83%B3%E3%82%AF%E6%8C%BF%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const link = "https://classroom.google.com/c/NTA1MjM2MjQ5NjAz"; //←ここにリンクを挿入
    const insertArea = document.querySelector(".course-header .contents-title");
    if(insertArea){
        insertArea.insertAdjacentHTML("afterEnd",`
        <div class="contents-title">
				<div class="contents-title-txt">
					<div class="course-view-title-txt">
						<span>Google Classroom</span>
					</div>
                </div><p>
                <a href="${link}" style="font-size:120%;margin-left:15px" target="_blank" rel="noopener noreferrer">${link}</a>
                </p>
			</div>
        `);
    }
})();