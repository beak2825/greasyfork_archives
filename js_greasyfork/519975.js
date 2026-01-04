// ==UserScript==
// @name         Auto Minesweeper Solver
// @namespace    http://tampermonkey.net/
// @version      3.2.5
// @description  Auto Solve Puzzles!
// @author       Rosaya
// @include      *.puzzle-minesweeper.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=puzzle-minesweeper.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519975/Auto%20Minesweeper%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/519975/Auto%20Minesweeper%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var content = document.getElementById('game').innerHTML;
    var tmp = document.getElementsByClassName('cell selectable  cell-off')[0];

    if(tmp)
    {
        var len = content.length;
        var n = 0, cur = 0, cnt = 0, ql = 0, qr = -1, delay = 0;
        const arr = [], mn = [0], mx = [0], vis = [0], ii = [0], e = [[0]], el = [0], q = [];
        for(let i = 0; i + 6 < len; i ++){
            if(content[i] == 't' && content[i + 1] == 'e' && content[i + 2] == ';' && content[i + 3] == '"' && content[i + 4] == '>'){
                arr[n] = content[i + 5];
                n ++;
            }
        }
        n = Math.floor(Math.sqrt(n));
        const board = Array.from(Array(n + 2), () => new Array(n + 2));
        for(let i = 0; i <= n + 1; i++){
            board[0][i] = board[i][0] = board[i][n + 1] = board[n + 1][i] = 0;
        }
        for(let i = 1; i <= n; i ++){
            for(let j = 1; j <= n; j ++){
                let id = (i - 1) * n + j - 1;
                if(arr[id] == '<'){
                    board[i][j] = ++ cur;
                }
                else{
                    board[i][j] = - Number(arr[id]);
                }
            }
        }

        var num = 0, U = 0;
        var adj = [];
        var bid = [];
        const mp = new Map();

        function create(pid){
            let cc = 0;
            adj = [];

            for(let i = 0; i < num; i++){
                if(pid >> i & 1){
                    adj[cc ++] = bid[i];
                }
            }

            adj.sort(function(a, b){
                return a - b;
            });

            if(mp.has(adj.toString()) == false){
                mp.set(adj.toString(), ++ cnt);
                mn[cnt] = 0;
                mx[cnt] = cc;
                vis[cnt] = 0;
                e[cnt] = [];
                el[cnt] = 0;
                return cnt;
            }

            return mp.get(adj.toString());
        }

        function make(x, y){
            num = 0;

            for(let i = -1; i <= 1; i ++){
                for(let j = -1; j <= 1; j ++){
                    if(board[x + i][y + j] > 0){
                        bid[num ++] = board[x + i][y + j];
                    }
                }
            }

            U = (1 << num) - 1;

            for(let i = 1; i <= U; i ++){
                ii[i] = create(i);

                for(let j = (i - 1) & i; j > 0; j = (j - 1) & i){
                    let k = i - j;

                    if(ii[j] > ii[k]){
                        continue;
                    }

                    e[ii[i]][el[ii[i]] ++] = [ii[j], ii[k], ii[i]];
                    e[ii[j]][el[ii[j]] ++] = [ii[j], ii[k], ii[i]];
                    e[ii[k]][el[ii[k]] ++] = [ii[j], ii[k], ii[i]];
                }
            }

            if(U > 0 && vis[ii[U]] == false){
                mn[ii[U]] = - board[x][y];
                mx[ii[U]] = - board[x][y];
                q[++ qr] = ii[U];
                vis[ii[U]] = true;
            }
        }

        for(let i = 1; i <= n; i ++){
            for(let j = 1; j <= n; j ++){
                if(board[i][j] <= 0){
                    make(i,j);
                }
            }
        }

        while(ql <= qr){
            let u = q[ql ++];
            vis[u] = false;

            for(let i = 0; i < el[u]; i ++){
                let j = e[u][i];
                if(u == j[0] || u == j[1]){
                    let v = j[0] + j[1] - u;
                    let w = j[2];

                    if(mn[w] < mn[u] + mn[v]){
                        mn[w] = mn[u] + mn[v];
                        if(vis[w] == false){
                            q[++ qr] = w;
                            vis[w] = true;
                        }
                    }

                    if(mx[w] > mx[u] + mx[v]){
                        mx[w] = mx[u] + mx[v];
                        if(vis[w] == false){
                            q[++ qr] = w;
                            vis[w] = true;
                        }
                    }

                    if(mn[v] < mn[w] - mx[u]){
                        mn[v] = mn[w] - mx[u];
                        if(vis[v] == false){
                            q[++ qr] = v;
                            vis[v] = true;
                        }
                    }

                    if(mx[v] > mx[w] - mn[u]){
                        mx[v] = mx[w] - mn[u];
                        if(vis[v] == false){
                            q[++ qr] = v;
                            vis[v] = true;
                        }
                    }
                }
                else{
                    let v = j[0];
                    let w = j[1];

                    if(mn[v] < mn[u] - mx[w]){
                        mn[v] = mn[u] - mx[w];
                        if(vis[v] == false){
                            q[++ qr] = v;
                            vis[v] = true;
                        }
                    }

                    if(mx[v] > mx[u] - mn[w]){
                        mx[v] = mx[u] - mn[w];
                        if(vis[v] == false){
                            q[++ qr] = v;
                            vis[v] = true;
                        }
                    }

                    if(mn[w] < mn[u] - mx[v]){
                        mn[w] = mn[u] - mx[v];
                        if(vis[w] == false){
                            q[++ qr] = w;
                            vis[w] = true;
                        }
                    }

                    if(mx[w] > mx[u] - mn[v]){
                        mx[w] = mx[u] - mn[v];
                        if(vis[w] == false){
                            q[++ qr] = w;
                            vis[w] = true;
                        }
                    }
                }
            }
        }

        tmp.focus();
        function pressKey(Temp, keyChar, keyCode){
            delay += 10;
            setTimeout(() => {
                var event = document.createEvent('Event')
                event.initEvent('keydown', true, false)
                event = Object.assign(event, {
                    ctrlKey: false,
                    metaKey: false,
                    altKey: false,
                    which: Temp,
                    keyCode: Temp,
                    key: keyChar,
                    code: keyCode
                })
                tmp.dispatchEvent(event)
            }, delay);
            delay += 10;
            setTimeout(() => {
                var event = document.createEvent('Event')
                event.initEvent('keyup', true, false)
                event = Object.assign(event, {
                    ctrlKey: false,
                    metaKey: false,
                    altKey: false,
                    which: Temp,
                    keyCode: Temp,
                    key: keyChar,
                    code: keyCode
                })
                tmp.dispatchEvent(event)
            }, delay);
        }

        pressKey(39, 'ArrowRight', 'ArrowRight');
        for(let i = 1; i <= n; i ++){
            if(i & 1){
                for(let j = 1; j <= n; j ++){
                    if(board[i][j] > 0){
                        adj = [board[i][j]];
                        if(mn[mp.get(adj.toString())] == 1){
                            pressKey(32, ' ', 'Space');
                            pressKey(16, 'Shift', '');
                        }
                        else{
                            pressKey(16, 'Shift', '');
                            pressKey(32, ' ', 'Space');
                        }
                    }

                    if(j < n){
                        pressKey(39, 'ArrowRight', 'ArrowRight');
                    }
                }
            }
            else{
                for(let j = n; j > 0; j --){
                    if(board[i][j] > 0){
                        adj = [board[i][j]];
                        if(mn[mp.get(adj.toString())] == 1){
                            pressKey(32, ' ', 'Space');
                            pressKey(16, 'Shift', '');
                        }
                        else{
                            pressKey(16, 'Shift', '');
                            pressKey(32, ' ', 'Space');
                        }
                    }

                    if(j > 1){
                        pressKey(37, 'ArrowLeft', 'ArrowLeft');
                    }
                }
            }

            if(i < n){
                pressKey(40, 'ArrowDown', 'ArrowDown');
            }
        }
        pressKey(13, 'Enter', 'Enter');
    }
    else
    {
        var btn = document.getElementById('btnNew');
        if(btn){
            btn.accessKey = 'n';
            // btn.click();
        }
    }
})();