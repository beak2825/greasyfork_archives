// ==UserScript==
// @name         Udemy Skip Video
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  This script automates the process of skipping videos on Udemy
// @author       entyd1004
// @match        https://*.udemy.com/course/*
// @icon         https://frontends.udemycdn.com/frontends-homepage/staticx/udemy/images/v8/favicon-32x32.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527453/Udemy%20Skip%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/527453/Udemy%20Skip%20Video.meta.js
// ==/UserScript==

function skipToLast5Second() {
    const video = document.querySelector("video");
    if (video) {
        video.currentTime = video.duration - 5;
    }
}

async function skipAllVideos() {
    const sections = document.querySelector('#ct-sidebar-scroll-container > div > div').childNodes;
    for (const section of sections) {
        await sectionCollapse(section, true)
        const lessons = section.childNodes[2].childNodes[0].childNodes[0].childNodes
        for (const lesson of lessons) {
            if (lesson.querySelector('input').checked != true) {
                const hasIconVideo = Array.from(lesson.querySelectorAll('svg > use')).some(use => use.getAttribute('xlink:href') === '#icon-video');
                if (hasIconVideo) {
                    let lessonButton = lesson.querySelector('button[type="button"]')
                    lessonButton.click();
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    skipToLast5Second();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                const hasIconArticle = Array.from(lesson.querySelectorAll('svg > use')).some(use => use.getAttribute('xlink:href') === '#icon-article');
                if (hasIconArticle) {
                    let lessonButton = lesson.querySelector('button[type="button"]')
                    lessonButton.click();
                    await new Promise(resolve => setTimeout(resolve, 25000));
                }
            }
        }
        await sectionCollapse(section, false)
    }
}

function awaitToElement(element) {
    return new Promise((resolve) => {
        let nIntervId = setInterval(() => {
            const isReady = document.querySelectorAll(element).length != 0;
            if (isReady) {
                resolve();
                clearInterval(nIntervId);
            }
        }, 100);
    });
}

function sectionCollapse(section, action) {
    return new Promise(async (resolve) => {
        const sectionButtonCollapse = section.querySelector('button[type="button"]')
        const isChecked = section.querySelector('span[data-checked]').getAttribute('data-checked') === 'checked'
        if (isChecked != action) {
            sectionButtonCollapse.click()
            if (action) {
                await awaitToElement('ul.ud-unstyled-list')
            }
        }
        resolve()
    });
}

async function actionSection(section, action) {
    await sectionCollapse(section, true)
    const lessons = section.childNodes[2].childNodes[0].childNodes[0].childNodes;
    for (const lesson of lessons) {
        if (lesson.querySelector('input').checked != action) {
            const hasIconVideo = Array.from(lesson.querySelectorAll('svg > use')).some(use => use.getAttribute('xlink:href') === '#icon-video');
            if (hasIconVideo) {
                let lessonButton = lesson.querySelector('button[type="button"]')
                lessonButton.click();
                await new Promise(resolve => setTimeout(resolve, 5000));
                skipToLast5Second();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const hasIconArticle = Array.from(lesson.querySelectorAll('svg > use')).some(use => use.getAttribute('xlink:href') === '#icon-article');
            if (hasIconArticle) {
                let lessonButton = lesson.querySelector('button[type="button"]')
                lessonButton.click();
                await new Promise(resolve => setTimeout(resolve, 25000));
            }
        }

    }
    await sectionCollapse(section, false)
}

async function actionCourse(sections, action) {
    for (const section of sections) {
        await actionSection(section, action)
    }
}

const isPageLoaded = async () => awaitToElement('div[data-purpose="curriculum-section-container"]');

async function main() {
    await isPageLoaded();
    const sections = document.querySelector('#ct-sidebar-scroll-container > div > div').childNodes;
    const courseActions = document.querySelector('section[data-purpose="sidebar"]').childNodes[0];

    let completeCourseBtn = document.createElement("div");
    completeCourseBtn.tabIndex = 0;
    completeCourseBtn.role = "button";
    completeCourseBtn.className = "item-link ud-btn ud-btn-small ud-btn-primary ud-heading-sm";
    completeCourseBtn.innerHTML = '<span>Complete</span>';

    completeCourseBtn.onclick = () => skipToLast5Second();
    courseActions.appendChild(completeCourseBtn);

    let completeAllCourseBtn = document.createElement("div");
    completeAllCourseBtn.tabIndex = 0;
    completeAllCourseBtn.role = "button";
    completeAllCourseBtn.className = "item-link ud-btn ud-btn-small ud-btn-primary ud-heading-sm";
    completeAllCourseBtn.innerHTML = '<span>Complete All</span>';

    completeAllCourseBtn.onclick = () => skipAllVideos();
    courseActions.appendChild(completeAllCourseBtn);


    for (const section of sections) {
        let completeSectionBtn = document.createElement("div");
        completeSectionBtn.tabIndex = 0
        completeSectionBtn.role = "button"
        completeSectionBtn.className = "item-link ud-btn ud-btn-small ud-btn-primary ud-heading-sm";
        completeSectionBtn.innerHTML = '<span>Complete Section</span>'
        completeSectionBtn.style.margin = '5px'
        completeSectionBtn.onclick = () => { actionSection(section, true) }

        section.appendChild(completeSectionBtn)
    }
}

main();