// ==UserScript==
// @name         PuzzleRushGoal
// @namespace    https://www.twitch.tv/SimpleVar
// @version      0.2
// @description  Adds an editable goal label for the run, and also shows how many mistakes happened so far, and also hides the profile pic for more space to see streak progress
// @author       SimpleVar
// @match        https://www.chess.com/puzzles
// @match        https://www.chess.com/puzzles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454024/PuzzleRushGoal.user.js
// @updateURL https://update.greasyfork.org/scripts/454024/PuzzleRushGoal.meta.js
// ==/UserScript==

(() => {
    setInterval(update, 100)

    function createX(isGray) {
        const x = document.createElement('span')
        x.classList.add('streak-icon-large')
        x.classList.add('streak-icon-square-x' + (isGray ? '-gray' : ''))
        x.classList.add('streak-icon-component')
        return x
    }
    function update() {
        if (!location.pathname?.endsWith('/rush')) return
        const solved = document.querySelector('.sidebar-play-solved')
        if (!solved) return
        if (!solved._sv_hide_pfp) {
            solved._sv_hide_pfp = true
            document.querySelector('.sidebar-play-content').style.padding = '0'
            document.querySelector('.sidebar-play-content .sidebar-play-avatar').style.display = 'none'
        }
        if (!solved._sv_goal) {
            const p = document.createElement('div')
            p.style.display = 'flex'
            p.style.cursor = 'pointer'
            solved.parentElement.insertBefore(p, solved)
            solved.remove()
            p.appendChild(solved)
            const goal = solved._sv_goal = document.createElement('div')
            p.append(goal)
            goal.classList.add('sidebar-play-solved')
            goal.setAttribute('contenteditable', 'true')
            goal.textContent = localStorage.getItem('_sv_goal') ?? '∕100'
            p.addEventListener('click', e => {
                goal.focus()
            }, {passive: true})
            goal.addEventListener('blur', e => {
                localStorage.setItem('_sv_goal', e.target.textContent = e.target.textContent)
            }, {passive: true})
        }
        if (!solved._sv_mistakes) {
            const _m = solved._sv_mistakes = document.createElement('div')
            _m._sv_n = 0
            _m.style.display = 'flex'
            _m.style.gap = '8px'
            solved.parentElement.parentElement.insertBefore(_m, solved.parentElement.nextElementSibling)
            for (let i = 0; i < 3; i++) {
                solved._sv_mistakes.append(createX(true))
            }
        }
        if (!solved._sv_streak) solved._sv_streak = document.querySelector('.sidebar-play-streak')
        let len = 0
        for (const c of solved._sv_streak.children) {
            if (c.classList.contains('streak-indicator-incorrect')) len++
        }
        const m = solved._sv_mistakes
        if (m._sv_n === len) return
        m._sv_n = len
        for (let i = 0; i < len; i++) {
            m.children[i].classList.add('streak-icon-square-x')
            m.children[i].classList.remove('streak-icon-square-x-gray')
        }
        for (let i = len; i < 3; i++) {
            m.children[i].classList.add('streak-icon-square-x-gray')
            m.children[i].classList.remove('streak-icon-square-x')
        }
    }
})()