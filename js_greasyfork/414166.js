// ==UserScript==
// @name         0hn0求解器
// @namespace    https://greasyfork.org/users/471937
// @version      0.1
// @description  根据游戏规则与回溯法自动求解0h n0盘面
// @author       油油
// @match        0hn0.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/414166/0hn0%E6%B1%82%E8%A7%A3%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/414166/0hn0%E6%B1%82%E8%A7%A3%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var n
    var new_tile
    var init_tiles, counted_tiles
    var Game = window.Game

    const OFFSET = [[1, 0], [0, 1], [-1, 0], [0, -1]]

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
    add_tool('重置', () => {
        init_tiles.forEach(t => t.value = -1)
        counted_tiles.forEach(t => t.unmark())
    })
    add_tool('执行一层', game_action(brute_once))
    add_tool('求解', game_action(brute_solve))
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
        init_tiles = Game.grid.emptyTiles
        counted_tiles = Game.grid.tiles.filter(x => x.value > 0)
    }

    function count_data(tile) {
        var raw = []
        var line,
            flag_empty, cnt
        for (var dir = 0; dir < 4; dir++) {
            line = []
            flag_empty = false
            cnt = 0
            for (var step = 1; ; step++) {
                var new_tile = _step(tile, dir, step)

                if (!new_tile || new_tile.value == 0) { // wall
                    switch_status()
                    break
                }
                if (flag_empty == (new_tile.value == -1)) cnt++
                else switch_status()
            }
            raw.push(line)
        }

        var res = {
            tile: tile,
            raw: raw,
            cap: raw.map(_sum),
        }
        res.curr = _sum(raw.map(x => x[0]))
        res.cap_sum = _sum(res.cap)
        return res

        function switch_status() {
            line.push(cnt)
            cnt = 1
            flag_empty = !flag_empty
        }
    }

    function check_tile(tile) {
        var dir,
            data = count_data(tile)
        if (data.curr > tile.value) { // error
            tile.mark()
            return false
        }
        if (data.curr == tile.value) {
            if (data.curr == data.cap_sum) return false // finished

            // rule 1
            for (dir = 0; dir < 4; dir++) {
                var new_tile = _step(tile, dir, data.raw[dir][0] + 1)
                if (new_tile) new_tile.value = 0
            }
            return true
        }

        // rule 2
        for (dir = 0; dir < 4; dir++) {
            var left = tile.value - (data.cap_sum - data.cap[dir])
            if (left > 0) {
                var filled = false
                while (left > 0) {
                    new_tile = _step(tile, dir, left)
                    if (new_tile && new_tile.value == -1) {
                        new_tile.value = -2
                        filled = true
                    }
                    left--
                }
                if (filled) return true
            }
        }

        // rule 3
        for (dir = 0; dir < 4; dir++) {
            var line = data.raw[dir]
            if (line.length < 3 || line[1] != 1) continue
            if (data.curr + line[2] >= tile.value) {
                new_tile = _step(tile, dir, line[0] + 1)
                new_tile.value = 0
                return true
            }
        }
    }

    function brute_once() {
        var res = counted_tiles.map(check_tile)
            .reduce((x, y) => (x | y))

        // rule 4
        Game.grid.emptyTiles.forEach(tile => {
            var tmp = 0
            for (var dir = 0; dir < 4; dir++) {
                new_tile = _step(tile, dir, 1)
                tmp += !(new_tile && new_tile.value)
            }
            if (tmp == 4) {
                tile.value = 0
                res = true
            }
        })

        return res
    }

    function brute_solve() {
        while (brute_once());
    }

    function _step(tile, dir, step) {
        var new_x = tile.x + OFFSET[dir][0] * step,
            new_y = tile.y + OFFSET[dir][1] * step
        return Game.grid.tile(new_x, new_y)
    }

    function _sum(array) {
        var res = 0
        for (var x of array) res += x
        return res
    }
})();