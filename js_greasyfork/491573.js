// ==UserScript==
// @name         T2SCHOLA Efficient Layout
// @namespace    https://t2schola.titech.ac.jp/
// @version      0.1
// @description  コースを横並びにします．
// @author       hayatroid
// @match        https://t2schola.titech.ac.jp/my/courses.php
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491573/T2SCHOLA%20Efficient%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/491573/T2SCHOLA%20Efficient%20Layout.meta.js
// ==/UserScript==


const finishedQuarters = ["2023 / 1", "2023 / 2", "2023 / 3"]


const makeMoreEfficient = () => {
    // コースを横並びにする
    const container = document.querySelector("ul.edw-course-list-container");
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fit, minmax(120px, 1fr))";

    container.querySelectorAll("li.edw-course-list").forEach((courseList) => {
        // 左の余白を消す
        courseList.querySelectorAll(".edw-course-img-wrapper").forEach(e => e.remove());

        // "AAA.A000-00[20XX]" を消す
        courseList.querySelectorAll(".edw-card-design-hd > div > div.text-muted").forEach(e => e.remove());

        // "X out of X activities completed" を消す
        courseList.querySelectorAll(".edw-card-design-ft > div > span.small-info-regular").forEach(e => e.remove());

        // "X% Course Completed" を消す
        courseList.querySelectorAll(".edw-card-design-ft > div > div.progress-text").forEach(e => e.remove());

        // コース名を省略する
        const courseName = courseList.querySelector(".edw-card-design-hd > div > a.coursename")
        const courseNameAbbr = courseName.textContent.replace("コース名", "").replace(/\s\/\s.*/, "").replace(/【.*】/, "");
        courseName.textContent = courseNameAbbr;

        // コース名のスタイルを調整する
        courseName.style.fontSize = ".8rem";
        courseName.style.lineHeight = "1.5";
        courseName.style.padding = "8px 0";

        // 終了したクオーターのコースを薄くする
        const courseQuarter = courseList.querySelector(".edw-card-design-hd span.categoryname").textContent.trim();
        if (finishedQuarters.includes(courseQuarter)) {
            courseList.style.filter = "grayscale(1)";
            courseList.style.opacity = ".3";
        }
    });
};


(() => {
    // ".container-fluid" の変更を検知したら，"makeMoreEfficient" を呼び出す
    const observer = new MutationObserver(() => {
        if (document.querySelector("ul.edw-course-list-container") === null) return;
        makeMoreEfficient();
    });
    const container = document.querySelector(".container-fluid");
    observer.observe(container, {
        childList: true,
        subtree: true,
    });
})();
