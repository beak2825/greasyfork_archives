// ==UserScript==
// @name        monad_2048
// @namespace   monad_2048
// @match       https://2048.monad.xyz/*
// @grant       none
// @version     1.1
// @author      DSperson
// @description 2025/2/19 上午9:04:58
// @user_url  https://x.com/asd576895195
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/536361/monad_2048.user.js
// @updateURL https://update.greasyfork.org/scripts/536361/monad_2048.meta.js
// ==/UserScript==


// == AI自动2048==
// 设置自动进行的最大游戏局数
let MAX_GAMES = 1;          // <<< 修改这里设置自动玩的局数
let LOOKAHEAD_DEPTH = 2;     // <<< 修改这里设置高分等级，推荐2~4
let START_TIME = 20;

setTimeout(() => {
    (function() {
    const dirs = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
    let started = false;
    let gameCount = 0; // 当前已完成的局数

    // 更慢的人类化操作延迟（毫秒）
    function randDelay(min = 800, max = 1400) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function parsePosition(styleStr) {
        let top = styleStr.match(/top:\s*calc\((\d+)%/);
        let left = styleStr.match(/left:\s*calc\((\d+)%/);
        return {
            row: top ? Math.round(parseInt(top[1]) / 25) : 0,
            col: left ? Math.round(parseInt(left[1]) / 25) : 0
        };
    }

    function getGrid() {
        let grid = Array.from({length:4}, ()=>Array(4).fill(0));
        document.querySelectorAll('.absolute.rounded-md').forEach(div => {
            let style = div.getAttribute('style') || '';
            let numSpan = div.querySelector('span');
            let num = numSpan ? parseInt(numSpan.textContent.trim()) : 0;
            if (!num) return;
            let {row, col} = parsePosition(style);
            if (row >= 0 && row < 4 && col >= 0 && col < 4)
                grid[row][col] = num;
        });
        return grid;
    }

    function move(grid, dir) {
        let arr = grid.map(r => r.slice());
        let moved = false, score = 0;
        function slide(line) {
            let r = line.filter(v => v);
            for(let i=0;i<r.length-1;i++) {
                if(r[i]===r[i+1]) {
                    r[i] *= 2; score += r[i];
                    r[i+1]=0; i++;
                }
            }
            return r.filter(v => v).concat(Array(4).fill(0)).slice(0,4);
        }
        if(dir===0) { // up
            for(let c=0;c<4;c++) {
                let col = slide([arr[0][c],arr[1][c],arr[2][c],arr[3][c]]);
                for(let r=0;r<4;r++) { if(arr[r][c]!=col[r]) moved=true; arr[r][c]=col[r]; }
            }
        } else if(dir===1) { // right
            for(let r=0;r<4;r++) {
                let row = slide([arr[r][3],arr[r][2],arr[r][1],arr[r][0]]).reverse();
                for(let c=0;c<4;c++) { if(arr[r][c]!=row[c]) moved=true; arr[r][c]=row[c]; }
            }
        } else if(dir===2) { // down
            for(let c=0;c<4;c++) {
                let col = slide([arr[3][c],arr[2][c],arr[1][c],arr[0][c]]).reverse();
                for(let r=0;r<4;r++) { if(arr[r][c]!=col[r]) moved=true; arr[r][c]=col[r]; }
            }
        } else if(dir===3) { // left
            for(let r=0;r<4;r++) {
                let row = slide(arr[r]);
                for(let c=0;c<4;c++) { if(arr[r][c]!=row[c]) moved=true; arr[r][c]=row[c]; }
            }
        }
        return {grid: arr, moved, score};
    }

    // 高级评分函数（多维权重！）
    function scoreBoard(grid) {
        let empty = 0, merge = 0, monoRow = 0, monoCol = 0, penalty = 0;
        let max = 0, maxCorner = 0, smooth = 0, sum = 0;
        // 角落最大
        const corners = [grid[0][0], grid[0][3], grid[3][0], grid[3][3]];
        maxCorner = Math.max(...corners);
        // 最大块在左下角优先
        max = 0;
        let maxPos = [0,0];
        for(let r=0;r<4;r++) for(let c=0;c<4;c++) {
            let val = grid[r][c];
            if(val>max) { max=val; maxPos=[r,c]; }
            if(val===0) empty++;
            sum += val;
            // 平滑性（差值绝对值之和，越小越好）
            if(c<3) smooth -= Math.abs(val - grid[r][c+1]);
            if(r<3) smooth -= Math.abs(val - grid[r+1][c]);
            if(val && c<3 && grid[r][c]===grid[r][c+1]) merge++;
            if(val && r<3 && grid[r][c]===grid[r+1][c]) merge++;
        }
        // 蛇形单调性（强制让大数沿左下角~左上角或左下角~右下角排布）
        // 可以调整monoRow/Col权重
        for(let r=0;r<4;r++)
            for(let c=0;c<3;c++)
                if(grid[r][c]>=grid[r][c+1]) monoRow++;
        for(let c=0;c<4;c++)
            for(let r=0;r<3;r++)
                if(grid[r][c]>=grid[r+1][c]) monoCol++;
        // 惩罚大数分散（最大块不在角落）
        if((maxPos[0]===0 && maxPos[1]===0) || (maxPos[0]===0 && maxPos[1]===3) || (maxPos[0]===3 && maxPos[1]===0) || (maxPos[0]===3 && maxPos[1]===3)){
            penalty = 0;
        } else {
            penalty = -max*0.3; // 最大块不在角落，减分
        }
        // 评分权重可调
        return empty*100 + merge*10 + (monoRow+monoCol)*4 + maxCorner*10 + smooth*1.5 + penalty;
    }

    function canMove(grid, dir) {
        return move(grid, dir).moved;
    }

    // lookaheadN步的决策（递归实现）
    function bestMoveLookahead(grid, depth) {
        function recur(g, d) {
            if(d === 0) return scoreBoard(g);
            let maxScore = -Infinity;
            for(let dir=0; dir<4; dir++) {
                if(canMove(g, dir)) {
                    let {grid: next} = move(g, dir);
                    let s = recur(next, d-1);
                    if(s > maxScore) maxScore = s;
                }
            }
            if(maxScore === -Infinity) return scoreBoard(g); // 无路可走
            return maxScore;
        }
        let bestDir = -1, bestScore = -Infinity;
        for(let dir=0; dir<4; dir++) {
            if(canMove(grid, dir)) {
                let {grid: g1} = move(grid, dir);
                let s = recur(g1, depth-1);
                if(s > bestScore) {
                    bestScore = s;
                    bestDir = dir;
                }
            }
        }
        return bestDir;
    }

    // 检查是否需要点击New Game或Play Again
    function checkAndStartOrRestart() {
        // 检查是否“Game Over!”
        let isGameOver = !!Array.from(document.querySelectorAll('h2, .font-bold')).find(
            el => el.textContent && el.textContent.toLowerCase().includes('game over')
        );
        // Play Again按钮
        let playAgainBtn = Array.from(document.querySelectorAll('button')).find(b =>
            b.textContent && b.textContent.toLowerCase().includes('play again')
        );
        // New Game按钮
        let newGameBtn = Array.from(document.querySelectorAll('button')).find(b =>
            b.textContent && b.textContent.toLowerCase().includes('new game')
        );
        // 
        let balance = Array.from(document.querySelectorAll('p')).find(b =>
            b.textContent && b.textContent.toLowerCase().includes('fund via game faucet')
        );
        // 刚启动自动点一次New Game（且只点一次）
        if (!started && newGameBtn) {
            setTimeout(() => {
                newGameBtn.click();
                started = true;
            }, 300 + randDelay());
            return true;
        }
        // 游戏结束时点Play Again（只在Game Over出现时点）
        if (started && isGameOver && playAgainBtn) {
            gameCount++;
            console.log(`第${gameCount}局已结束，总局数上限：${MAX_GAMES}`);
            if(gameCount >= MAX_GAMES) {
                window.stop2048 = true;
                console.log("达到最大局数，自动停止！");
                return true;
            }
            setTimeout(() => playAgainBtn.click(), 300 + randDelay());
            return true;
        }
        if (balance) {
            window.stop2048 = true;
            return true;
        }
        return false;
    }

    window.stop2048 = false;
    function aiStep() {
        if(window.stop2048) { 
            console.log('2048 AI已终止');
            return; 
        }
        // 优先处理开局/重开
        if(checkAndStartOrRestart()) {
            setTimeout(aiStep, 700 + randDelay());
            return;
        }
        let grid = getGrid();
        let bestDir = bestMoveLookahead(grid, LOOKAHEAD_DEPTH); // 用户可自选lookahead深度
        if(bestDir === -1) { // 无法再动，等待下轮自动检测重开
            setTimeout(aiStep, 600 + randDelay());
            return;
        }
        window.dispatchEvent(new KeyboardEvent('keydown', {key: dirs[bestDir]}));
        setTimeout(aiStep, randDelay());
    }
    aiStep();
})();
}, START_TIME * 1000)

