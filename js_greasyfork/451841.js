// ==UserScript==
// @name         ieltscat 高亮功能
// @namespace    ieltscat.xdf.cn
// @version      1.0
// @description  将 ieltscat 的划词笔记改为划词高亮
// @author       Shouduo
// @match        https://ieltscat.xdf.cn/practice/detail/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAADD+v/F+f/F+f/D+v3F+f9JZnQ7rtk7iKI8dYopZX2YwsfJ+f3D+P/D+v3D+v/C+v/F+f/C+v/F+f/F+f+Ps7k+WWdutMyf4fOg4vRtn7Fojpp4lqG17PHD+//E9//F+f/E+P/D+f+Os7tdgYt0orSt6vSx7fm68v288/y99Pu17/ub0dxYcn6lztfH+f/E+P7D+v+DpqpqlqOo6fjA9//D+f/F+f/F+v3F+f/D+v/C9//F+f+/+f6GsLej0NTI+f+v3uJfhZGt6PfE+P/H+f/C+fzF+v3C+P/D+v/E+P7E+P7D+v3D+v/D+v9je4G36/F1l51Mn3/A9/zF+f/D+v/D+v/E+P7D+v/D+f/F+f/C+f7E+P/H+P/D+f+s3uSEp6tKa2c/pmOI27vE+P/F+f/B+f7F+f/C+f/D+P/D+v3F+f/D+v/C+fzF+f/F+f9uiI9Lc2g9p2RMvXpsy56s7eTH+P/D+v3F+v3E+P6PtLiZwMmjztfC+v/F+f+89Plsio9HamY7p2VNu3tLvHlQu31Sk3lzrp+SvcCl6t93l517oaOa3NCj1tKBxbROm3WVwchme4M6nV9Ou31Lu3tRuXiJqJn///79//9upIdChGGMl5XFxcuPl5ZOu31Pem/D9/+ZwMgvbEpJuHpLvHlMvHzHxsr//v60t7uYtKdMvXrFx8jx8fHw7/E2c1E0WExPaGzC+v8uRkRCn2hNu3tLvHl5qY3v8fGZmp5iqINQu3xro4aamqBge3IvdE8pZUNcf3s0U1BAnGkyelBMsXlNu3lMvXpBnms3c1RQu3xDnGsvaVBKsnM/nGlNXmek0NfD+f+BpatAYF8nQzYjST0+lGQ/k2kkQjcpS0BMvHxLsnUwak0ZGSUlMDTD+v3C+f7C+P/F+v3D+f/D+v+WwsmOtLkWGCIgNjQ+k2Y2f1cwYUsqYUgkQTiBpavF+f/H+P/D+v/F+f/E+P7F+P/G+v/E+fzF+f93l5w1dVJPam7E+P9wiZMtQEPD+f/C+v/F+v3D+P8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451841/ieltscat%20%E9%AB%98%E4%BA%AE%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/451841/ieltscat%20%E9%AB%98%E4%BA%AE%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // entrence of modification
    const start = () => {
        const functionMenu = document.getElementById('functionMenu');
        const noteTaking = functionMenu.getElementsByClassName('noteTaking')[0];
        const highlight = noteTaking.cloneNode();
        highlight.text = '高亮';
        highlight.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            highlightSelection();
            functionMenu.style.display = 'none';
        }
        noteTaking.remove();
        functionMenu.appendChild(highlight);
        // const addNoteBox = document.getElementById('addNoteBox');
        // addNoteBox.remove();
    };
    //
    const highlightSelection = () => {
        const userSelection = window.getSelection();
        const uesrRange = userSelection.getRangeAt(0);
        highlightRange(uesrRange);
        userSelection.removeRange(uesrRange);
    }
    //
    const highlightRange = (range) => {
        const newNode = document.createElement('span');
        newNode.setAttribute(
            'style',
            'background-color: yellow; display: inline;'
        );
        range.surroundContents(newNode);

    }
    // wait for dom ready
    const sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    };
    //
    sleep(1000).then(() => {
        start();
    })
})();