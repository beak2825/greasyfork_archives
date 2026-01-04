// ==UserScript==
// @name         GitHub Contributions Snake
// @namespace    http://tampermonkey.net/
// @version      2024-07-19
// @description  turn github contribs to snake game
// @author       GV3Dev
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504199/GitHub%20Contributions%20Snake.user.js
// @updateURL https://update.greasyfork.org/scripts/504199/GitHub%20Contributions%20Snake.meta.js
// ==/UserScript==

class SnakeElem {
    constructor() {
        this.body = [{x: 0, y: 0}];
        this.length = 1;
        this.foodEaten = 0;
        this.direction = "right";
    }

    createSnake(cells, columns) {
        for (let i = 0; i < this.length; i++) {
            const pos = this.body[i];
            makeGreen(cells[pos.y * columns + pos.x], 4);
        }
    }

    move(direction, cells, columns, rows, food) {
        const head = { ...this.body[0] };

        switch (direction) {
            case "left":
                if (this.direction !== "right") this.direction = "left";
                break;
            case "right":
                if (this.direction !== "left") this.direction = "right";
                break;
            case "down":
                if (this.direction !== "up") this.direction = "down";
                break;
            case "up":
                if (this.direction !== "down") this.direction = "up";
                break;
        }

        switch (this.direction) {
            case "left":
                head.x = (head.x - 1 + columns) % columns;
                break;
            case "right":
                head.x = (head.x + 1) % columns;
                break;
            case "down":
                head.y = (head.y + 1) % rows;
                break;
            case "up":
                head.y = (head.y - 1 + rows) % rows;
                break;
        }

        this.body.unshift(head);

        if (head.x === food.position.x && head.y === food.position.y) {
            this.foodEaten++;
            this.length += 2;
            food.getEaten(cells, this, columns, rows);
        } else {
            const tail = this.body.pop();
            cells[tail.y * columns + tail.x].setAttribute("data-level", "0");
        }

        this.createSnake(cells, columns);
    }
}

class FoodElem {
    constructor() {
        this.position = null;
    }

    getEaten(cells, snake, columns, rows) {
        cells[this.position.y * columns + this.position.x].style.backgroundColor = "#161b22";
        this.createFood(cells, columns, rows, snake);
    }

    createFood(cells, columns, rows, snake) {
        let randCell;
        let x, y;
        do {
            randCell = Math.floor(Math.random() * cells.length);
            y = Math.floor(randCell / columns);
            x = randCell % columns;
        } while (cells[randCell].getAttribute("data-level") !== "0" || snake.body.some(part => part.x === x && part.y === y));

        cells[y * columns + x].style.backgroundColor = "red";
        this.position = {x, y};
    }
}

const main = () => {
    const keepCheck = setInterval(() => {
        const contribBoard = document.querySelector(".js-yearly-contributions");
        if (contribBoard !== null) {
            clearInterval(keepCheck);
            let cells = contribBoard.querySelectorAll(`.ContributionCalendar-day`);
            let columns = contribBoard.querySelector(`.js-calendar-graph-table tbody`).firstElementChild.children.length;
            let rows = Math.floor(cells.length / columns+1);
            cleanGrid();
            const snake = new SnakeElem();
            const food = new FoodElem();
            food.createFood(cells, columns, rows, snake);
            snake.createSnake(cells, columns);
            appendControls(snake, cells, columns, rows, food);
        }
    }, 100);
}

const appendControls = (snake, cells, columns, rows, food) => {
    window.addEventListener("keydown", (evt) => {
        if (["ArrowUp", "ArrowRight", "ArrowLeft", "ArrowDown"].includes(evt.code)) {
            evt.preventDefault();
        }
        if (evt.code === "ArrowUp") {
            snake.move("up", cells, columns, rows, food);
        } else if (evt.code === "ArrowRight") {
            snake.move("right", cells, columns, rows, food);
        } else if (evt.code === "ArrowLeft") {
            snake.move("left", cells, columns, rows, food);
        } else if (evt.code === "ArrowDown") {
            snake.move("down", cells, columns, rows, food);
        }
    });
}

function makeGreen(elem, level) {
    elem.setAttribute("data-level", `${level}`);
}

function cleanGrid() {
    const contribBoard = document.querySelector(".js-yearly-contributions");
    let cells = contribBoard.querySelectorAll(`.ContributionCalendar-day`);
    cells.forEach((cell) => { cell.setAttribute("data-level", "0"); });
}

main();
