// ==UserScript==
// @name         TCube AI + 高级算法优化
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.0
// @description  增强AI：迭代加深搜索、置换表、Alpha-Beta剪枝、启发式评估
// @match        https://tcube-game.netlify.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533568/TCube%20AI%20%2B%20%E9%AB%98%E7%BA%A7%E7%AE%97%E6%B3%95%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/533568/TCube%20AI%20%2B%20%E9%AB%98%E7%BA%A7%E7%AE%97%E6%B3%95%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 配置参数
  const CONFIG = {
    // 基础深度 - 动态调整
    MAX_DEPTH_BASE: 6,
    // 最大迭代深度
    MAX_ITERATION_DEPTH: 9,
    // 时间限制 (ms)
    TIME_LIMIT: 1000,
    // 终局阶段额外深度
    ENDGAME_DEPTH_BONUS: 2,
    // 调试开关
    DEBUG: true,
    // 思考间隔 (ms)
    THINK_INTERVAL: 1200,
    // 位置权值（中心>角落>边）
    POSITION_VALUES: [
          [4, 2, 4],
          [2, 6, 2],
          [4, 2, 4]
      ],
    // 置换表大小控制
    MAX_TABLE_SIZE: 10000
  };

  // 状态变量
  let cachedPlayer = null;
  let moveCount = 0;
  let gameStarted = false;
  let lastBoardState = null;

  // 置换表
  const transpositionTable = new Map();
  // 计数器
  let tableHits = 0;
  let nodesExplored = 0;
  let pruneCount = 0;

  // 启动AI思考
  setInterval(runAI, CONFIG.THINK_INTERVAL);

  // 主AI函数
  async function runAI() {
    try {
      // 获取房间和游戏状态
      const roomId = document.getElementById("roomInput")?.value;
      const status = document.getElementById("status")?.textContent;
      const app = window.firebase?.app();
      if (!roomId || !app) return;

      // 读取数据库
      const snap = await app.database().ref(`rooms/${roomId}`).once("value");
      const data = snap.val() || {};
      const turn = data.turn;
      const boardData = data.board || {};
      const O_hist = data.O_history || [];
      const X_hist = data.X_history || [];

      // 棋盘状态变化检测
      const currentBoardHash = JSON.stringify(boardData);
      const boardChanged = currentBoardHash !== lastBoardState;
      lastBoardState = currentBoardHash;

      if (boardChanged) {
        moveCount++;
        if (CONFIG.DEBUG) console.log(`[AI Debug] 检测到新一步，当前第${moveCount}步`);

        // 清理置换表
        if (transpositionTable.size > CONFIG.MAX_TABLE_SIZE) {
          if (CONFIG.DEBUG) console.log(`[AI Debug] 清理置换表，当前大小: ${transpositionTable.size}`);
          transpositionTable.clear();
        }
      }

      // 玩家身份识别与缓存
      if (!cachedPlayer) {
        if (status.includes("你是玩家 O")) cachedPlayer = "O";
        else if (status.includes("你是玩家 X")) cachedPlayer = "X";
        else if (status.includes("你的回合")) cachedPlayer = turn;

        if (cachedPlayer) {
          gameStarted = true;
          if (CONFIG.DEBUG) console.log(`[AI Debug] 身份确认：玩家 ${cachedPlayer}`);
        }
      }

      // 非己方回合，退出
      if (!gameStarted || cachedPlayer !== turn) return;

      const opponent = cachedPlayer === "O" ? "X" : "O";

      // 构建棋盘二维数组
      const board = Array.from({ length: 3 }, () => Array(3).fill(null));
      for (let key in boardData) {
        const [r, c] = key.split(",").map(Number);
        board[r][c] = boardData[key];
      }

      // 计算棋盘空位数
      const emptyCount = 9 - Object.keys(boardData).length;

      // 调试：输出当前棋盘
      if (CONFIG.DEBUG) {
        const boardRep = board.map(row =>
          `[${row.map(c => c || " ").join("|")}]`
        ).join("\n");
        console.log(`[AI Debug] 当前棋盘:\n${boardRep}`);
        console.log(`[AI Debug] 历史记录: O=${O_hist.join(",")}, X=${X_hist.join(",")}`);
      }

      // 构建我方与对方历史
      const myHistory = cachedPlayer === "O" ? [...O_hist] : [...X_hist];
      const opHistory = cachedPlayer === "O" ? [...X_hist] : [...O_hist];

      // 重置统计计数器
      nodesExplored = 0;
      pruneCount = 0;
      tableHits = 0;

      // 使用迭代加深搜索
      const startTime = Date.now();

      // 动态调整最大搜索深度
      const maxDepth = Math.min(
        CONFIG.MAX_ITERATION_DEPTH,
        emptyCount + 2 + (emptyCount < 4 ? CONFIG.ENDGAME_DEPTH_BONUS : 0)
      );

      if (CONFIG.DEBUG) {
        console.log(`[AI Debug] 开始迭代加深搜索，最大深度: ${maxDepth}`);
      }

      // 执行迭代加深搜索
      const result = iterativeDeepeningSearch(
        board,
        myHistory,
        opHistory,
        cachedPlayer,
        opponent,
        maxDepth,
        CONFIG.TIME_LIMIT
      );

      const elapsedTime = Date.now() - startTime;

      if (CONFIG.DEBUG && result.move) {
        const [r, c] = result.move;
        const scoreType = result.score > 0 ? "必胜" : (result.score < 0 ? "劣势" : "均势");
        console.log(
          `[AI Debug] ✅ 推荐落子: (${r},${c}) 评分: ${result.score.toFixed(2)} (${scoreType}), ` +
          `搜索深度: ${result.depth}, 耗时: ${elapsedTime}ms`
        );
        console.log(`[AI Debug] 统计: 节点 ${nodesExplored}, 剪枝 ${pruneCount}, 置换表命中 ${tableHits}`);
      }

      // 显示建议标记到界面
      showSuggestion(result.move);
    } catch (e) {
      console.error("[AI] 错误:", e);
    }
  }

  // 迭代加深搜索 - 在时间限制内尽可能深入搜索
  function iterativeDeepeningSearch(board, myHistory, opHistory, player, opponent, maxDepth, timeLimit) {
    let bestMove = null;
    let bestScore = -Infinity;
    let currentDepth = 1;
    let lastCompleteDepth = 0;
    const startTime = Date.now();

    // 快速检查成胜机会和防守点
    const winningMove = checkWinningMove(board, player, myHistory);
    if (winningMove) {
      if (CONFIG.DEBUG) console.log("[AI Debug] 发现制胜点: " + winningMove.join(","));
      return {
        move: winningMove,
        score: 1,
        depth: 1
      };
    }

    const blockingMove = checkWinningMove(board, opponent, opHistory);
    if (blockingMove) {
      if (CONFIG.DEBUG) console.log("[AI Debug] 发现防守点: " + blockingMove.join(","));
      return {
        move: blockingMove,
        score: 0.5,
        depth: 1
      };
    }

    // 持续迭代加深搜索
    while (currentDepth <= maxDepth) {
      if (CONFIG.DEBUG) console.log(`[AI Debug] 搜索深度: ${currentDepth}`);

      const moves = generateMoves(board);
      let alphaUpdated = false;

      // 对移动进行启发式排序（中心 > 角落 > 边）以提高剪枝效率
      moves.sort((a, b) => {
        return CONFIG.POSITION_VALUES[b[0]][b[1]] - CONFIG.POSITION_VALUES[a[0]][a[1]];
      });

      // 如果有上一轮最佳移动，则优先评估它
      if (bestMove) {
        const bestMoveIndex = moves.findIndex(m => m[0] === bestMove[0] && m[1] === bestMove[1]);
        if (bestMoveIndex !== -1) {
          const [move] = moves.splice(bestMoveIndex, 1);
          moves.unshift(move);
        }
      }

      // 当前深度的alpha-beta窗口
      let alpha = -Infinity;
      let beta = Infinity;
      let localBestMove = null;
      let localBestScore = -Infinity;

      // 评估每个移动
      for (const [r, c] of moves) {
        // 超出时间限制，中断本轮搜索
        if (Date.now() - startTime > timeLimit) {
          if (CONFIG.DEBUG) console.log(`[AI Debug] 搜索中断，超出时间限制 ${timeLimit}ms`);
          break;
        }

        // 复制棋盘和历史记录
        const newBoard = board.map(row => [...row]);
        const newMyHistory = [...myHistory];

        // 应用移动和滑动窗口逻辑
        newMyHistory.push(`${r},${c}`);
        if (newMyHistory.length > 3) {
          const [oldR, oldC] = newMyHistory.shift().split(",").map(Number);
          newBoard[oldR][oldC] = null;
        }
        newBoard[r][c] = player;

        // Alpha-Beta搜索
        const score = minimax(
          newBoard,
          newMyHistory,
          opHistory,
          opponent,
          player,
          currentDepth - 1,
          -beta,
          -alpha,
          false
        );

        // 更新局部最佳结果
        if (score > localBestScore) {
          localBestScore = score;
          localBestMove = [r, c];

          // 更新alpha值
          if (score > alpha) {
            alpha = score;
            alphaUpdated = true;
          }
        }
      }

      // 只有在本轮搜索完整完成时，才更新全局最佳结果
      if (Date.now() - startTime <= timeLimit || !bestMove) {
        bestMove = localBestMove;
        bestScore = localBestScore;
        lastCompleteDepth = currentDepth;

        if (CONFIG.DEBUG) {
          console.log(`[AI Debug] 深度 ${currentDepth} 完成，当前最佳: (${bestMove?.[0]},${bestMove?.[1]}) 分数: ${bestScore.toFixed(2)}`);
        }
      } else {
        // 如果时间已超，但没完成当前深度的搜索，则使用上一个完整深度的结果
        if (CONFIG.DEBUG) {
          console.log(`[AI Debug] 深度 ${currentDepth} 未完成，使用深度 ${lastCompleteDepth} 的结果`);
        }
        break;
      }

      // 如果发现必胜或必败，提前退出
      if (bestScore >= 0.99 || bestScore <= -0.99) {
        if (CONFIG.DEBUG) console.log(`[AI Debug] 发现确定结果，提前结束搜索`);
        break;
      }

      // 继续下一轮深度
      currentDepth++;
    }

    return {
      move: bestMove,
      score: bestScore,
      depth: lastCompleteDepth
    };
  }

  // 生成局面哈希键 - 用于置换表
  function generateHashKey(board, myHistory, opHistory) {
    // 将棋盘状态序列化为字符串
    const boardStr = board.map(row => row.map(cell => cell || '.').join('')).join('');
    // 将历史记录序列化
    const myHistStr = myHistory.join(',');
    const opHistStr = opHistory.join(',');
    // 组合成唯一键
    return `${boardStr}|${myHistStr}|${opHistStr}`;
  }

  // Minimax搜索 + Alpha-Beta剪枝 + 置换表
  function minimax(board, myHistory, opHistory, currentPlayer, myPlayer, depth, alpha, beta, isMaximizer) {
    nodesExplored++;

    // 终止条件：游戏结束或达到搜索深度
    const winState = checkWinState(board);
    if (winState !== null || depth === 0) {
      return evaluateBoard(board, myPlayer, winState, depth);
    }

    // 生成局面哈希键
    const hashKey = generateHashKey(board, myHistory, opHistory);

    // 检查置换表
    if (transpositionTable.has(hashKey)) {
      const entry = transpositionTable.get(hashKey);
      if (entry.depth >= depth) {
        tableHits++;
        return entry.score;
      }
    }

    // 收集空位
    const moves = generateMoves(board);

    if (isMaximizer) {
      // 我方回合，找最大值
      let maxEval = -Infinity;
      for (const [r, c] of moves) {
        // 复制状态
        const newBoard = board.map(row => [...row]);
        const newMyHistory = [...myHistory];

        // 应用移动和滑动窗口
        newMyHistory.push(`${r},${c}`);
        if (newMyHistory.length > 3) {
          const [oldR, oldC] = newMyHistory.shift().split(",").map(Number);
          newBoard[oldR][oldC] = null;
        }
        newBoard[r][c] = myPlayer;

        // 递归评估
        const evalScore = minimax(
          newBoard,
          newMyHistory,
          opHistory,
          opponent(myPlayer),
          myPlayer,
          depth - 1,
          alpha,
          beta,
          false
        );

        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);

        // Alpha-Beta剪枝
        if (beta <= alpha) {
          pruneCount++;
          break;
        }
      }

      // 存储结果到置换表
      transpositionTable.set(hashKey, { score: maxEval, depth });

      return maxEval;
    } else {
      // 对方回合，找最小值
      let minEval = Infinity;
      for (const [r, c] of moves) {
        // 复制状态
        const newBoard = board.map(row => [...row]);
        const newOpHistory = [...opHistory];

        // 应用移动和滑动窗口
        newOpHistory.push(`${r},${c}`);
        if (newOpHistory.length > 3) {
          const [oldR, oldC] = newOpHistory.shift().split(",").map(Number);
          newBoard[oldR][oldC] = null;
        }
        newBoard[r][c] = currentPlayer;

        // 递归评估
        const evalScore = minimax(
          newBoard,
          myHistory,
          newOpHistory,
          opponent(currentPlayer),
          myPlayer,
          depth - 1,
          alpha,
          beta,
          true
        );

        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);

        // Alpha-Beta剪枝
        if (beta <= alpha) {
          pruneCount++;
          break;
        }
      }

      // 存储结果到置换表
      transpositionTable.set(hashKey, { score: minEval, depth });

      return minEval;
    }
  }

  // 获取对手
  function opponent(player) {
    return player === "O" ? "X" : "O";
  }

  // 生成所有可能的移动
  function generateMoves(board) {
    const moves = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!board[i][j]) {
          moves.push([i, j]);
        }
      }
    }
    return moves;
  }

  // 检查是否有即时获胜的移动
  function checkWinningMove(board, player, history) {
    // 历史记录长度决定是否要移除老棋子
    const needRemove = history.length >= 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j]) continue;

        // 试着在这里下一步
        const testBoard = board.map(row => [...row]);
        testBoard[i][j] = player;

        // 如果需要移除最早的一步
        if (needRemove) {
          const oldPosStr = history[0];
          if (oldPosStr) {
            const [oldR, oldC] = oldPosStr.split(",").map(Number);
            if (!isNaN(oldR) && !isNaN(oldC)) {
              testBoard[oldR][oldC] = null;
            }
          }
        }

        // 检查是否获胜
        if (isWin(testBoard, player)) {
          return [i, j];
        }
      }
    }
    return null;
  }

  // 评估棋盘状态分数
  function evaluateBoard(board, player, winState, depth) {
    const opponent = player === "X" ? "O" : "X";

    // 胜负已分
    if (winState === player) return 1 + depth * 0.01; // 尽快获胜
    if (winState === opponent) return -1 - depth * 0.01; // 尽量延缓失败
    if (winState === "draw") return 0;

    // 启发式评估
    let score = 0;

    // 评估行列和对角线的潜在威胁
    const lines = [
      // 行
      [[0,0], [0,1], [0,2]],
      [[1,0], [1,1], [1,2]],
      [[2,0], [2,1], [2,2]],
      // 列
      [[0,0], [1,0], [2,0]],
      [[0,1], [1,1], [2,1]],
      [[0,2], [1,2], [2,2]],
      // 对角线
      [[0,0], [1,1], [2,2]],
      [[0,2], [1,1], [2,0]]
    ];

    // 评估每条线
    for (const line of lines) {
      let myCount = 0;
      let opCount = 0;
      let emptyCount = 0;

      for (const [r, c] of line) {
        if (board[r][c] === player) myCount++;
        else if (board[r][c] === opponent) opCount++;
        else emptyCount++;
      }

      // 两子一空，有机会连线
      if (myCount === 2 && emptyCount === 1) score += 0.4;
      // 对手两子一空，有威胁
      if (opCount === 2 && emptyCount === 1) score -= 0.35;
      // 控制中心点
      if (myCount === 1 && emptyCount === 2 && line.some(([r,c]) => r === 1 && c === 1 && board[r][c] === player)) {
        score += 0.2;
      }
    }

    // 评估棋子位置
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === player) {
          score += CONFIG.POSITION_VALUES[i][j] * 0.02;
        } else if (board[i][j] === opponent) {
          score -= CONFIG.POSITION_VALUES[i][j] * 0.02;
        }
      }
    }

    return score;
  }

  // 检查游戏状态
  function checkWinState(board) {
    // 检查玩家O胜利
    if (isWin(board, "O")) return "O";
    // 检查玩家X胜利
    if (isWin(board, "X")) return "X";

    // 检查平局（全部填满）
    let hasEmpty = false;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!board[i][j]) {
          hasEmpty = true;
          break;
        }
      }
    }

    return hasEmpty ? null : "draw";
  }

  // 判断胜利条件
  function isWin(board, player) {
    const lines = [
      // 行
      [[0,0], [0,1], [0,2]],
      [[1,0], [1,1], [1,2]],
      [[2,0], [2,1], [2,2]],
      // 列
      [[0,0], [1,0], [2,0]],
      [[0,1], [1,1], [2,1]],
      [[0,2], [1,2], [2,2]],
      // 对角线
      [[0,0], [1,1], [2,2]],
      [[0,2], [1,1], [2,0]]
    ];

    // 检查每一条线
    return lines.some(line =>
      line.every(([r, c]) => board[r][c] === player)
    );
  }

  // 显示落子建议UI
  function showSuggestion(move) {
    // 清除旧的建议标记
    document.querySelectorAll(".ai-suggestion").forEach(e => e.remove());

    // 显示新建议
    if (move) {
      const [r, c] = move;
      const board = document.getElementById("board");
      if (!board) return;

      const cell = board.rows[r]?.cells[c];
      if (!cell) return;

      const mark = document.createElement("div");
      mark.textContent = "🟡";
      mark.className = "ai-suggestion";

      Object.assign(mark.style, {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        fontSize: "24px",
        pointerEvents: "none",
        zIndex: 9999
      });

      // 将标记添加到单元格
      cell.style.position = cell.style.position || "relative";
      cell.style.overflow = "visible";
      cell.appendChild(mark);
    }
  }
})();