// ==UserScript==
// @name         UET-Graduate-Course-List
// @namespace    https://github.com/duongoku/
// @version      1.7
// @description  Script for calculating courses related stuff
// @author       duongoku
// @license      GPL-3.0-or-later
// @match        https://daotao.uet.vnu.edu.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uet.vnu.edu.vn
// @downloadURL https://update.greasyfork.org/scripts/447161/UET-Graduate-Course-List.user.js
// @updateURL https://update.greasyfork.org/scripts/447161/UET-Graduate-Course-List.meta.js
// ==/UserScript==

function get_log_element() {
    let log_element = document.getElementById("console-log");
    if (log_element == null) {
        log_element = document.createElement("span");
        log_element.style = "color: white; display: block; font-size: 0.75rem;";
        log_element.id = "console-log";
    }
    return log_element;
}

function clear_log() {
    let log_element = get_log_element();
    log_element.innerHTML = "";
}

function log(log_string) {
    let log_element = get_log_element();
    log_element.innerHTML += `${log_string}<br>`;
}

function parseScore(score) {
    score = parseFloat(String(score));
    if (score >= 9) {
        return `A+`;
    } else if (score >= 8.5) {
        return `A`;
    } else if (score >= 8) {
        return `B+`;
    } else if (score >= 7) {
        return `B`;
    } else if (score >= 6.5) {
        return `C+`;
    } else if (score >= 5.5) {
        return `C`;
    } else if (score >= 5) {
        return `D+`;
    } else if (score >= 4) {
        return `D`;
    }
    return "F";
}

function get_optional_courses(courses) {
    const excluded_opt_courses = [
        `MAT1101`,
        `ELT2029`,
        `INT3102`,
        `INT3103`,
        `BSA2002`,
        `INT3131`,
        `INT3132`,
    ];

    let optional_courses = courses.filter(
        (x) => x.children[3].innerText.trim().toLowerCase() == `tự chọn`
    );

    optional_courses = optional_courses.filter(
        (x) =>
            !excluded_opt_courses.includes(
                x.children[1].innerText.trim().toUpperCase()
            )
    );

    return optional_courses;
}

function run() {
    if (
        !window.location
            .toString()
            .startsWith(`https://daotao.uet.vnu.edu.vn/graduates/`)
    ) {
        return;
    }

    if (
        document
            .querySelector(".text-muted")
            .innerText.toString()
            .trim()
            .toLowerCase() !=
        `các học phần sinh viên đã tích lũy trong ctđt đang xét`
    ) {
        return;
    }

    document.querySelector(`.container-fluid`).appendChild(get_log_element());
    clear_log();

    const excluded_courses = [`FLF1108`, `FLF1107`];
    const pick_one_in_many = [[`BSA2002`, `INT3102`, `INT3103`], [`ELT2029`, `MAT1101`]];

    const score_to_gpa = {
        "A+": 4.0,
        A: 3.7,
        "B+": 3.5,
        B: 3.0,
        "C+": 2.5,
        C: 2.0,
        "D+": 1.5,
        D: 1.0,
        F: 0.0,
    };

    let courses = Array.from(document.querySelector("tbody").children);

    for (let i = 0; i < pick_one_in_many.length; i++) {
        let many_courses = courses.filter(
            (x) =>
                pick_one_in_many[i].includes(
                    x.children[1].innerText.trim().toUpperCase()
                )
        );
        let max_score = -1;
        let max_course = null;
        for (let j = 0; j < many_courses.length; j++) {
            let score = parseFloat(many_courses[j].children[5].innerText.trim());
            if (score > max_score) {
                max_score = score;
                max_course = many_courses[j];
            }
        }
        courses = courses.filter((x) => !many_courses.includes(x));
        courses.push(max_course);
    }

    courses = courses.filter(
        (x) =>
            !excluded_courses.includes(
                x.children[1].innerText.trim().toUpperCase()
            )
    );

    let optional_courses = get_optional_courses(courses);

    optional_courses = optional_courses.sort(
        (x, y) =>
            parseFloat(y.children[5].innerText) -
            parseFloat(x.children[5].innerText)
    );
    let courses_tobe_removed = [];
    if (optional_courses.length > 10) {
        courses_tobe_removed = optional_courses.slice(10);
    }

    courses = courses.filter((x) => !courses_tobe_removed.includes(x));

    optional_courses = get_optional_courses(courses);

    console.log(optional_courses);

    let total_credits = courses.reduce(
        (acc, cur) => acc + parseFloat(cur.children[4].innerText),
        0
    );
    let cp = courses.reduce(
        (acc, cur) =>
            acc +
            score_to_gpa[parseScore(cur.children[5].innerText)] *
            parseFloat(cur.children[4].innerText),
        0
    );
    let cpa = Math.round((cp * 100) / total_credits) / 100;

    let max_cp = courses.reduce((acc, cur) => {
        let score = parseScore(cur.children[5].innerText);
        let credit = parseFloat(cur.children[4].innerText);
        if (optional_courses.includes(cur)) {
            return acc + score_to_gpa[`A+`] * credit;
        }
        return acc + score_to_gpa[score] * credit;
    }, 0);
    console.log(`Max CP: ${max_cp}`);
    let max_cpa = Math.round((max_cp * 100) / total_credits) / 100;

    log(`Total accumulated credits: ${total_credits}`);
    log(`CPA: ${cpa}`);
    log(`Max CPA (With the same amount of credits): ${max_cpa}`);
    log(`Optional course count: ${optional_courses.length}`);
    log(
        `Total optional courses credit: ${optional_courses.reduce(
            (acc, cur) => acc + parseFloat(cur.children[4].innerText),
            0
        )}/30 credits needed`
    );
    log(`Optional course list:`);
    optional_courses = optional_courses.sort(
        (x, y) =>
            parseFloat(x.children[5].innerText) -
            parseFloat(y.children[5].innerText)
    );
    optional_courses.forEach((x) => {
        log(
            `Score: ${x.children[5].innerText}(${parseScore(
                x.children[5].innerText
            )}) | Course ${x.children[1].innerText}: ${x.children[2].innerText
            } | ${x.children[4].innerText} credits`
        );
    });
}

// Rerun every 1.5 seconds before starting the script
setInterval(run, 1500);
