// ==UserScript==
// @name         SnakeOnPipeline
// @namespace    Slay
// @version      2024-05-05.2
// @description  snake on pipeline lololol
// @author       Nooble
// @match        *://*/**/pipelines/*
// @grant        none
// @copyright 2024, Nooble (https://openuserjs.org/users/Nooble)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494091/SnakeOnPipeline.user.js
// @updateURL https://update.greasyfork.org/scripts/494091/SnakeOnPipeline.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const css =
    "#gameArea,#gameBackdrop{position:fixed;left:0;width:100vw;height:100vh;top:0}#snakeGrid,#tetrisGrid,#tetrisSide{height:50vw;min-height:400px;max-height:800px}#snakeGrid,#tetrisSide,.gameGrid{background-color:#000}#snakeGrid,#tetrisHeldGrid,#tetrisNextGrid,.gameGrid{display:grid}#tetrisHeld,#tetrisNextPieces{position:relative;aspect-ratio:1}body,html{min-height:100vh;min-width:100vw;margin:0;position:relative}#snakeOpenGameBtn{position:fixed;bottom:1rem;right:1rem}#tetrisOpenGameBtn{position:fixed;bottom:3rem;right:1rem}#gameArea{display:flex;flex-direction:row;justify-content:center;align-items:center}#tetrisHeld,#tetrisSide{flex-direction:column;display:flex;box-sizing:border-box}#gameBackdrop{background-color:rgba(0,0,0,.2);z-index:-1}#snakeGrid,.sideLabel{position:absolute;left:50%}#snakeGrid{top:50%;transform:translate(-50%,-50%);grid-template-columns:repeat(20,1fr);grid-template-columns:repeat(20,1fr);width:50vw;min-width:400px;max-width:800px}#tetrisGrid{grid-template-columns:repeat(10,1fr);width:25vw;min-width:200px;max-width:400px}#tetrisSide{width:15vw;min-width:120px;max-width:240px;border-left:1px solid #fff}#tetrisHeld{width:100%;border-bottom:1px solid #fff;justify-content:center;align-items:center}#tetrisNextPieces{width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center}.sideLabel{color:#fff;font-size:1rem;top:0;transform:translateX(-50%)}#tetrisGrid .tetrisCell{border:1px solid #333}.tetrisCell{aspect-ratio:1;box-sizing:border-box}";

  function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = cos * (x - cx) + sin * (y - cy) + cx,
      ny = cos * (y - cy) - sin * (x - cx) + cy;
    return [nx, ny];
  }

  function snake() {
    hideGameBtns();

    const Directions = {
      UP: 0,
      RIGHT: 1,
      DOWN: 2,
      LEFT: 3,
    };

    const snake = [
      { x: 10, y: 10 },
      { x: 10, y: 10 },
      { x: 10, y: 10 },
    ];

    const apples = [];

    let currentDirection = Directions.RIGHT;
    let newDirections = [];

    let currentSpeed = 200;
    let shouldIncreaseSpeed = false;

    let gameLoop;

    function cleanupGame() {
      console.log("Closing snake...");

      showGameBtns();

      const gameArea = document.getElementById("gameArea");
      gameArea.remove();

      window.removeEventListener("keydown", handleKeyDownEvent);
      window.removeEventListener("penalty", handlePenalty);
      window.removeEventListener("reward", handleReward);

      clearInterval(gameLoop);
    }

    function addGridCells() {
      const grid = document.getElementById("snakeGrid");

      for (let i = 0; i < 400; i++) {
        const cell = document.createElement("div");
        cell.classList.add("snakeCell");
        grid.appendChild(cell);
      }
    }

    function createGameArea() {
      console.log("Creating grid...");

      const gameArea = document.createElement("div");
      gameArea.id = "gameArea";
      gameArea.innerHTML = `
        <div id="gameBackdrop"></div>
        <div id="snakeGrid" class="gameGrid"></div>
      `;
      document.body.appendChild(gameArea);

      const backdrop = document.getElementById("gameBackdrop");
      backdrop.onclick = cleanupGame;

      addGridCells();
    }

    function updateGridUI() {
      const cells = document.querySelectorAll(".snakeCell");

      for (let i = 0; i < 400; i++) {
        const cell = cells[i];
        cell.style.backgroundColor = "black";
      }

      snake.forEach((segment) => {
        const index = segment.x + segment.y * 20;
        cells[index].style.backgroundColor = "green";
      });

      apples.forEach((apple) => {
        const index = apple.x + apple.y * 20;
        cells[index].style.backgroundColor = "red";
      });
    }

    function checkSnakeDied(position) {
      if (
        position.x < 0 ||
        position.x >= 20 ||
        position.y < 0 ||
        position.y >= 20
      ) {
        return true;
      }

      if (
        snake.some(
          (segment) => segment.x === position.x && segment.y === position.y
        )
      ) {
        return true;
      }

      return false;
    }

    function snakeDied() {
      console.log("Snake died...");

      clearInterval(gameLoop);
      gameLoop = undefined;
    }

    function generateApple() {
      if (snake.length + apples.length === 400) return;

      const newApple = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
      };

      if (
        snake.some(
          (segment) => segment.x === newApple.x && segment.y === newApple.y
        ) ||
        apples.some((apple) => apple.x === newApple.x && apple.y === newApple.y)
      ) {
        generateApple();
        return;
      }

      console.log("NEW APPLE", newApple);

      apples.push(newApple);
    }

    function update() {
      const currentHead = snake[snake.length - 1];

      if (newDirections.length > 0) {
        currentDirection = newDirections.shift();
      }

      let newPos;

      switch (currentDirection) {
        case Directions.UP:
          newPos = { x: currentHead.x, y: currentHead.y - 1 };
          break;
        case Directions.RIGHT:
          newPos = { x: currentHead.x + 1, y: currentHead.y };
          break;
        case Directions.DOWN:
          newPos = { x: currentHead.x, y: currentHead.y + 1 };
          break;
        case Directions.LEFT:
          newPos = { x: currentHead.x - 1, y: currentHead.y };
          break;
      }

      if (checkSnakeDied(newPos)) {
        snakeDied();
        return;
      }

      const appleIndex = apples.findIndex(
        (apple) => apple.x === newPos.x && apple.y === newPos.y
      );

      if (appleIndex !== -1) {
        apples.splice(appleIndex, 1);
        apples.length === 0 && generateApple();
        snake.unshift(snake[0]);
      }

      snake.push(newPos);
      snake.shift();

      updateGridUI();

      shouldIncreaseSpeed && increaseSpeed();
    }

    function increaseSpeed() {
      if (currentSpeed > 75) {
        console.log("Increasing speed...");

        currentSpeed -= 75;
        clearInterval(gameLoop);
        gameLoop = setInterval(update, currentSpeed);

        shouldIncreaseSpeed = false;
      }
    }

    function start() {
      console.log(gameLoop);
      if (gameLoop === undefined) gameLoop = setInterval(update, currentSpeed);
    }

    function canChangeDirection(currentDirection, newDirection) {
      return (
        (currentDirection === Directions.UP &&
          newDirection !== Directions.DOWN) ||
        (currentDirection === Directions.RIGHT &&
          newDirection !== Directions.LEFT) ||
        (currentDirection === Directions.DOWN &&
          newDirection !== Directions.UP) ||
        (currentDirection === Directions.LEFT &&
          newDirection !== Directions.RIGHT)
      );
    }

    function init() {
      console.log("Initializing Snake...");

      createGameArea();

      generateApple();

      updateGridUI();
    }

    function handleKeyDownEvent(event) {
      if (event.code === "Space") {
        start();
        return;
      }

      if (!gameLoop) return;

      switch (event.code) {
        case "ArrowUp":
          if (
            (newDirections.length === 0 &&
              canChangeDirection(currentDirection, Directions.UP)) ||
            (newDirections.length === 1 &&
              canChangeDirection(newDirections[0], Directions.UP))
          ) {
            newDirections.push(Directions.UP);
          }
          break;
        case "ArrowRight":
          if (
            (newDirections.length === 0 &&
              canChangeDirection(currentDirection, Directions.RIGHT)) ||
            (newDirections.length === 1 &&
              canChangeDirection(newDirections[0], Directions.RIGHT))
          ) {
            newDirections.push(Directions.RIGHT);
          }
          break;
        case "ArrowDown":
          if (
            (newDirections.length === 0 &&
              canChangeDirection(currentDirection, Directions.DOWN)) ||
            (newDirections.length === 1 &&
              canChangeDirection(newDirections[0], Directions.DOWN))
          ) {
            newDirections.push(Directions.DOWN);
          }
          break;
        case "ArrowLeft":
          if (
            (newDirections.length === 0 &&
              canChangeDirection(currentDirection, Directions.LEFT)) ||
            (newDirections.length === 1 &&
              canChangeDirection(newDirections[0], Directions.LEFT))
          ) {
            newDirections.push(Directions.LEFT);
          }
          break;
        case "Enter":
          shouldIncreaseSpeed = true;
          break;
      }
    }

    function handlePenalty() {
      shouldIncreaseSpeed = true;
    }

    function handleReward() {
      generateApple();

      updateGridUI();
    }

    window.addEventListener("keydown", handleKeyDownEvent);
    window.addEventListener("penalty", handlePenalty);
    window.addEventListener("reward", handleReward);

    init();
  }

  function tetris() {
    hideGameBtns();

    let gameLoop;

    const pieces = [
      {
        center: { x: 1.5, y: 0.5 },
        points: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 3, y: 0 },
        ],
        colour: "#00ffff",
        specialKick: true,
        rotation: 0,
        width: 4,
        height: 1,
        type: 0,
      },
      {
        center: { x: 1, y: 1 },
        points: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
        ],
        colour: "#0000ff",
        specialKick: false,
        rotation: 0,
        width: 3,
        height: 2,
        type: 1,
      },
      {
        center: { x: 1, y: 1 },
        points: [
          { x: 2, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
        ],
        colour: "#ffaa00",
        specialKick: false,
        rotation: 0,
        width: 3,
        height: 2,
        type: 2,
      },
      {
        center: { x: 0.5, y: 0.5 },
        points: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 0 },
        ],
        colour: "#ffff00",
        specialKick: false,
        rotation: 0,
        width: 2,
        height: 2,
        type: 3,
      },
      {
        center: { x: 1, y: 1 },
        points: [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
        ],
        colour: "#00ff00",
        specialKick: false,
        rotation: 0,
        width: 3,
        height: 2,
        type: 4,
      },
      {
        center: { x: 1, y: 1 },
        points: [
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
        ],
        colour: "#9900ff",
        specialKick: false,
        rotation: 0,
        width: 3,
        height: 2,
        type: 5,
      },
      {
        center: { x: 1, y: 1 },
        points: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
        ],
        colour: "#ff0000",
        specialKick: false,
        rotation: 0,
        width: 3,
        height: 2,
        type: 6,
      },
    ];

    const kickData = {
      "01": [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: +2 },
        { x: -1, y: +2 },
      ],
      10: [
        { x: 0, y: 0 },
        { x: +1, y: 0 },
        { x: +1, y: +1 },
        { x: 0, y: -2 },
        { x: +1, y: -2 },
      ],
      12: [
        { x: 0, y: 0 },
        { x: +1, y: 0 },
        { x: +1, y: +1 },
        { x: 0, y: -2 },
        { x: +1, y: -2 },
      ],
      21: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: +2 },
        { x: -1, y: +2 },
      ],
      23: [
        { x: 0, y: 0 },
        { x: +1, y: 0 },
        { x: +1, y: -1 },
        { x: 0, y: +2 },
        { x: +1, y: +2 },
      ],
      32: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: +1 },
        { x: 0, y: -2 },
        { x: -1, y: -2 },
      ],
      30: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: +1 },
        { x: 0, y: -2 },
        { x: -1, y: -2 },
      ],
      "03": [
        { x: 0, y: 0 },
        { x: +1, y: 0 },
        { x: +1, y: -1 },
        { x: 0, y: +2 },
        { x: +1, y: +2 },
      ],

      s01: [
        { x: 0, y: 0 },
        { x: -2, y: 0 },
        { x: +1, y: 0 },
        { x: -2, y: +1 },
        { x: +1, y: -2 },
      ],
      s10: [
        { x: 0, y: 0 },
        { x: +2, y: 0 },
        { x: -1, y: 0 },
        { x: +2, y: -1 },
        { x: -1, y: +2 },
      ],
      s12: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: +2, y: 0 },
        { x: -1, y: -2 },
        { x: +2, y: +1 },
      ],
      s21: [
        { x: 0, y: 0 },
        { x: +1, y: 0 },
        { x: -2, y: 0 },
        { x: +1, y: +2 },
        { x: -2, y: -1 },
      ],
      s23: [
        { x: 0, y: 0 },
        { x: +2, y: 0 },
        { x: -1, y: 0 },
        { x: +2, y: -1 },
        { x: -1, y: +2 },
      ],
      s32: [
        { x: 0, y: 0 },
        { x: -2, y: 0 },
        { x: +1, y: 0 },
        { x: -2, y: +1 },
        { x: +1, y: -2 },
      ],
      s30: [
        { x: 0, y: 0 },
        { x: +1, y: 0 },
        { x: -2, y: 0 },
        { x: +1, y: +2 },
        { x: -2, y: -1 },
      ],
      s03: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: +2, y: 0 },
        { x: -1, y: -1 },
        { x: +2, y: +1 },
      ],
    };

    let currentPiece = undefined;

    let nextPiece = JSON.parse(
      JSON.stringify(pieces[Math.floor(Math.random() * pieces.length)])
    );

    let heldPiece = undefined;

    let placedSinceHeld = true;

    const grid = [];

    for (let i = 0; i < 20; i++) {
      grid.push(new Array(10).fill(null));
    }

    function newPiece() {
      const newPiece = JSON.parse(JSON.stringify(nextPiece));

      newPiece.points.forEach((point) => {
        point.x += 3;
      });
      newPiece.center.x += 3;

      const didCollide = pointsCollideWithGrid(newPiece.points);

      if (didCollide) {
        clearInterval(gameLoop);
        gameLoop = undefined;
        return;
      }

      nextPiece = JSON.parse(
        JSON.stringify(pieces[Math.floor(Math.random() * pieces.length)])
      );

      currentPiece = newPiece;
    }

    function cleanupGame() {
      console.log("Closing tetris...");

      showGameBtns();

      const gameArea = document.getElementById("gameArea");
      gameArea.remove();

      window.removeEventListener("keydown", handleKeyDownEvent);
      window.removeEventListener("penalty", handlePenalty);
      window.removeEventListener("reward", handleReward);

      clearInterval(gameLoop);
    }

    function addGridCells() {
      const grid = document.getElementById("tetrisGrid");

      for (let i = 0; i < 200; i++) {
        const cell = document.createElement("div");
        cell.classList.add("tetrisCell");
        grid.appendChild(cell);
      }
    }

    function createGameArea() {
      console.log("Creating grid...");

      const gameArea = document.createElement("div");
      gameArea.id = "gameArea";
      gameArea.innerHTML = `
        <div id="gameBackdrop"></div>
        <div id="tetrisGrid" class="gameGrid"></div>
        <div id="tetrisSide">
          <div id="tetrisHeld">
            <div class="sideLabel">Held</div>
            <div id="tetrisHeldGrid"></div>
            </div>
          <div id="tetrisNextPieces">
            <div class="sideLabel">Next</div>
            <div id="tetrisNextGrid"></div>
          </div>
        </div>
      `;
      document.body.appendChild(gameArea);

      const backdrop = document.getElementById("gameBackdrop");
      backdrop.onclick = cleanupGame;

      addGridCells();
    }

    function updateGrid() {
      const cells = document.querySelectorAll(".tetrisCell");

      for (let i = 0; i < 200; i++) {
        const cell = cells[i];
        cell.style.backgroundColor = "black";
        cell.style.border = undefined;
      }

      currentPiece.points.forEach((point) => {
        if (point.x < 0 || point.x > 9 || point.y < 0 || point.y > 19) {
          return;
        }

        const index = point.x + point.y * 10;
        cells[index].style.backgroundColor = currentPiece.colour;
      });

      grid.forEach((row, y) => {
        row.forEach((colour, x) => {
          if (colour === null) return;

          const index = x + y * 10;
          cells[index].style.backgroundColor = colour;
        });
      });

      const heldGrid = document.getElementById("tetrisHeldGrid");
      heldGrid.innerHTML = "";

      if (heldPiece) {
        heldGrid.style.gridTemplateColumns = `repeat(${heldPiece.width}, 1fr)`;
        heldGrid.style.width = (heldPiece.width / 6) * 100 + "%";

        for (let i = 0; i < heldPiece.width * heldPiece.height; i++) {
          const cell = document.createElement("div");
          cell.classList.add("tetrisCell");
          heldGrid.appendChild(cell);
        }

        heldPiece.points.forEach((point) => {
          const index = point.x + point.y * heldPiece.width;
          heldGrid.children[index].style.backgroundColor = heldPiece.colour;
          heldGrid.children[index].style.border = "1px solid #333";
        });
      }

      const nextGrid = document.getElementById("tetrisNextGrid");
      nextGrid.innerHTML = "";

      if (nextPiece) {
        nextGrid.style.gridTemplateColumns = `repeat(${nextPiece.width}, 1fr)`;
        nextGrid.style.width = (nextPiece.width / 6) * 100 + "%";

        for (let i = 0; i < nextPiece.width * nextPiece.height; i++) {
          const cell = document.createElement("div");
          cell.classList.add("tetrisCell");
          nextGrid.appendChild(cell);
        }

        nextPiece.points.forEach((point) => {
          const index = point.x + point.y * nextPiece.width;
          nextGrid.children[index].style.backgroundColor = nextPiece.colour;
          nextGrid.children[index].style.border = "1px solid #333";
        });
      }
    }

    function init() {
      console.log("Initializing Tetris...");

      createGameArea();

      newPiece();

      updateGrid();
    }

    function update() {
      move(0, 1, true);

      updateGrid();
    }

    function start() {
      if (gameLoop === undefined) gameLoop = setInterval(update, 500);
    }

    function checkRowRemoval() {
      const fullRows = [];

      grid.forEach((row, y) => {
        if (row.every((cell) => cell !== null)) {
          fullRows.push(y);
        }
      });

      if (fullRows.length === 0) return;

      fullRows.forEach((row) => {
        grid.splice(row, 1);
        grid.unshift(new Array(10).fill(null));
      });

      updateGrid();
    }

    function currentPieceToGrid() {
      currentPiece.points.forEach((point) => {
        if (point.x < 0 || point.x > 9 || point.y < 0 || point.y > 19) {
          return;
        }

        grid[point.y][point.x] = currentPiece.colour;
      });

      const newPiece = JSON.parse(JSON.stringify(nextPiece));

      newPiece.points.forEach((point) => {
        point.x += 3;
      });
      newPiece.center.x += 3;

      const didCollide = pointsCollideWithGrid(newPiece.points);

      if (didCollide) {
        clearInterval(gameLoop);
        gameLoop = undefined;
        return;
      }

      currentPiece = newPiece;

      nextPiece = JSON.parse(
        JSON.stringify(pieces[Math.floor(Math.random() * pieces.length)])
      );

      placedSinceHeld = true;

      checkRowRemoval();

      updateGrid();
    }

    function move(x, y, auto = false) {
      const newPieces = currentPiece.points.map((point) => {
        return { x: point.x + x, y: point.y + y };
      });

      const didCollide = pointsCollideWithGrid(newPieces);

      if (didCollide && y === 0) {
        return false;
      }

      if (didCollide && y === 1) {
        currentPieceToGrid();
        return true;
      }

      currentPiece.points = newPieces;

      currentPiece.center.x += x;
      currentPiece.center.y += y;

      !auto && updateGrid();

      return false;
    }

    function pointsCollideWithGrid(points) {
      return points.some((point) => {
        if (point.x < 0 || point.x > 9 || point.y < 0 || point.y > 19) {
          return true;
        }

        return grid[point.y][point.x] !== null;
      });
    }

    function rotatePiece(dir) {
      const rotatedPoints = currentPiece.points.map((point) => {
        const [x, y] = rotate(
          currentPiece.center.x,
          currentPiece.center.y,
          point.x,
          point.y,
          dir ? -90 : 90
        );

        return { x: Math.round(x), y: Math.round(y) };
      });

      const initialRotation = currentPiece.rotation;

      if (dir) {
        currentPiece.rotation += 1;
        if (currentPiece.rotation > 3) {
          currentPiece.rotation = 0;
        }
      } else {
        currentPiece.rotation -= 1;
        if (currentPiece.rotation < 0) {
          currentPiece.rotation = 3;
        }
      }

      let testNum = 0;

      let isColliding = true;

      while (isColliding) {
        const kickType =
          (currentPiece.specialKick ? "s" : "") +
          initialRotation +
          currentPiece.rotation;

        const kickTest = kickData[kickType][testNum];

        const adjustedPoints = rotatedPoints.map((point) => {
          return { x: point.x + kickTest.x, y: point.y + kickTest.y };
        });

        if (pointsCollideWithGrid(adjustedPoints)) {
          testNum++;
          if (testNum === kickData.length) {
            currentPiece.rotation = initialRotation;
            return;
          }
          continue;
        }

        currentPiece.points = adjustedPoints;
        currentPiece.center.x += kickTest.x;
        currentPiece.center.y += kickTest.y;

        isColliding = false;
        break;
      }

      updateGrid();
    }

    function switchHeld() {
      if (!placedSinceHeld) return;

      placedSinceHeld = false;

      if (heldPiece) {
        const temp = JSON.parse(JSON.stringify(heldPiece));
        heldPiece = JSON.parse(JSON.stringify(pieces[currentPiece.type]));
        temp.points.forEach((point) => {
          point.x += 3;
        });
        temp.center.x += 3;

        const didCollide = pointsCollideWithGrid(temp.points);

        if (didCollide) {
          clearInterval(gameLoop);
          gameLoop = undefined;
          return;
        }

        currentPiece = temp;
      } else {
        heldPiece = JSON.parse(JSON.stringify(pieces[currentPiece.type]));
        newPiece();
      }

      updateGrid();
    }

    function handleKeyDownEvent(event) {
      if (event.code === "Enter") {
        start();
        return;
      }

      if (!gameLoop) return;

      switch (event.code) {
        case "ArrowUp":
          rotatePiece(1);
          break;
        case "ArrowRight":
          move(1, 0);
          break;
        case "ArrowDown":
          move(0, 1);
          break;
        case "ArrowLeft":
          move(-1, 0);
          break;
        case "Space":
          let didSetPiece = false;

          while (!didSetPiece) {
            didSetPiece = move(0, 1);
          }
          break;
        case "ShiftLeft":
          switchHeld();
          break;
        case "KeyZ":
          rotatePiece(0);
          break;
        case "KeyX":
          rotatePiece(1);
          break;
      }
    }

    function handlePenalty() {
      console.log("Penalty...");

      grid.shift();
      const row = new Array(10).fill("#444");
      row[Math.floor(Math.random() * 10)] = null;
      grid.push(row);

      currentPiece.points.forEach((point) => point.y--);
      currentPiece.center.y--;

      updateGrid();
    }

    function handleReward() {
      console.log("Reward...");

      grid.pop();
      grid.unshift(new Array(10).fill(null));

      updateGrid();
    }

    window.addEventListener("keydown", handleKeyDownEvent);
    window.addEventListener("penalty", handlePenalty);
    window.addEventListener("reward", handleReward);

    init();
  }

  function hideGameBtns() {
    const gameBtns = document.querySelectorAll(".gameBtns");
    gameBtns.forEach((btn) => (btn.style.display = "none"));
  }

  function showGameBtns() {
    const gameBtns = document.querySelectorAll(".gameBtns");
    gameBtns.forEach((btn) => (btn.style.display = "block"));
  }

  function createUI() {
    console.log("Creating UI...");

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const snakeOpenGameBtn = document.createElement("button");
    snakeOpenGameBtn.id = "snakeOpenGameBtn";
    snakeOpenGameBtn.className = "gameBtns";
    snakeOpenGameBtn.textContent = "Snake";
    snakeOpenGameBtn.onclick = snake;
    document.body.appendChild(snakeOpenGameBtn);

    const tetrisOpenGameBtn = document.createElement("button");
    tetrisOpenGameBtn.id = "tetrisOpenGameBtn";
    tetrisOpenGameBtn.className = "gameBtns";
    tetrisOpenGameBtn.textContent = "Tetris";
    tetrisOpenGameBtn.onclick = tetris;
    document.body.appendChild(tetrisOpenGameBtn);
  }

  function init() {
    console.log("Initializing...");

    createUI();
  }

  let success = 0;

  let fail = 0;

  window.addEventListener("load", () => {
    init();

    setInterval(() => {
      const icons = Array.from(
        document.querySelectorAll('span[data-testid="ci-icon"]')
      );

      let newSuccess = icons.filter(
        (icon) => icon.getAttribute("title") === "Passed"
      ).length;
      let newFail = icons.filter(
        (icon) => icon.getAttribute("title") === "Failed"
      ).length;

      if (newSuccess > success) {
        for (let i = 0; i < newSuccess - success; i++) {
          const rewardEvent = new Event("reward");
          window.dispatchEvent(rewardEvent);
        }

        success = newSuccess;
      }

      if (newFail > fail) {
        for (let i = 0; i < newFail - fail; i++) {
          const penaltyEvent = new Event("penalty");
          window.dispatchEvent(penaltyEvent);
        }

        fail = newFail;
      }
    }, 250);
  });
})();
