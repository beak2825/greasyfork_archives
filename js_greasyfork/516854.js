// ==UserScript==
// @deri         Alura Destroyer
// @deri robot    https://cursos.alura.com.br/
// @marcos10pc       marcos10pc
// @match        https://cursos.alura.com.br/course/*/task/*
// @icon         https://i.imgur.com/gP1LZq9.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const actualUrl = window.location.href;
    const nextLessonButton = document.getElementsByClassName("bootcamp-next-button")[0];

    if (nextLessonButton) {
        const parts = actualUrl.split('/');
        const lessonName = parts[4];
        const lessonId = parts[6];

        fetch(`https://cursos.alura.com.br/course/${lessonName}/task/${lessonId}/mark-video`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': document.cookie
            }
        });

        setTimeout(() => nextLessonButton.click(), 4000);
    } else {
    }
})();
