// ==UserScript==
// @name         0hh1求解器
// @namespace    https://greasyfork.org/users/471937
// @version      0.1.1
// @description  根据游戏规则与回溯法自动求解0h h1盘面
// @author       油油
// @match        0hh1.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/414026/0hh1%E6%B1%82%E8%A7%A3%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/414026/0hh1%E6%B1%82%E8%A7%A3%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var n, t_col, t_row
    var i, j
    var init_tiles
    var Game = window.Game

    // 监控盘面开局状态
    var classObs = new MutationObserver(mus => {
        var updater = mus
            .map(mu => (mu.attributeName === "class" && mu.target))
            .reduce((x, y) => (x || y))
        if (!updater) return
        if (updater.classList.contains('hidden')) {
            show_panel(false)
        } else {
            show_panel(true)
            init()
        }
    })
    classObs.observe(document.querySelector('#board'), { attributes: true })

    // 添加工具栏
    var toolbar = document.createElement('div')
    Object.assign(toolbar.style, {
        position: 'absolute',
        zIndex: 1000,
    })
    document.body.appendChild(toolbar)
    add_tool('重置', () => init_tiles.forEach(t => t.value = 0))
    add_tool('执行一层', game_action(check_once))
    add_tool('执行至无简单规则', game_action(brute_once))
    add_tool('完成当前局面', game_action(backtracking))
    show_panel(false)

    function game_action(action) {
        return () => {
            action()
            Game.checkForLevelComplete()
        }
    }

    function add_tool(name, action) {
        var btn = document.createElement('button')
        btn.innerText = name
        btn.addEventListener('click', action)
        toolbar.appendChild(btn)
    }

    function show_panel(visible) {
        toolbar.style.display = visible ? 'flex' : 'none'
    }

    function init() {
        n = Game.grid.width
        t_col = []
        t_row = []
        for (i = 0; i < n; i++) {
            t_col.push([])
            t_row.push([])
        }
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                t_col[i][j] = t_row[j][i] = Game.grid.tile(i, j)
            }
        }
        init_tiles = Game.grid.emptyTiles
    }

    function check_line(l) {
        var flag = false
        var n1 = 0, n2 = 0
        for (i = 0; i < n; i++) {
            var val = l[i].value
            if (val == 1) n1++;
            else if (val == 2) n2++;
        }
        if (n1 == n / 2 || n2 == n / 2) {
            if (n1 < n / 2) {
                for (i = 0; i < n; i++) if (l[i].value == 0) l[i].value = 1
                flag = true
            }
            if (n2 < n / 2) {
                for (i = 0; i < n; i++) if (l[i].value == 0) l[i].value = 2
                flag = true
            }
        } else for (i = 0; i < n - 2; i++) {
            for (var loop = 0; loop < 3; loop++) {
                if (l[i + loop].value != 0) continue
                var l1 = (loop + 1) % 3,
                    l2 = (loop + 2) % 3
                if (
                    l[i + l1].value != 0 &&
                    l[i + l1].value == l[i + l2].value
                ) {
                    l[i + loop].value = 3 - l[i + l1].value
                    flag = true
                }
            }
        }
        return flag
    }

    function check_once() {
        var r1 = t_row.map(check_line),
            r2 = t_col.map(check_line),
            flag = 0
        for (var i = 0; i < n; i++) flag += r1[i] + r2[i]
        return flag
    }

    function brute_once() {
        while (check_once() > 0);
    }

    function backtracking() {
        brute_once()
        var cached = Game.grid.emptyTiles
        if (cached.length == 0) return Game.grid.isValid()

        for (var tester = 1; tester <= 2; tester++) {
            cached[0].value = tester
            var inner = backtracking()
            if (inner) return true
            else cached.forEach(x => x.value = 0)// reverse
        }
    }
})();