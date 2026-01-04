
// ==UserScript==
// @name        Gitlab Kanban Board
// @namespace   Violentmonkey Scripts
// @description This is a userscript.
// @match       http*://*gitlab*/*/-/boards/*
// @version     0.0.5
// @author      Rodolphe Pelloux-Prayer
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@1,npm/@violentmonkey/ui@0.5
// @license     MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/427683/Gitlab%20Kanban%20Board.user.js
// @updateURL https://update.greasyfork.org/scripts/427683/Gitlab%20Kanban%20Board.meta.js
// ==/UserScript==

(function () {
'use strict';

function columnHeader(title, nbOfTasks, wipLimit, toTrack) {
  return VM.createElement(VM.Fragment, null, VM.createElement("div", {
    style: "background-color:rgb(250,250,250); text-align: center; font-size: 1.5rem"
  }, VM.createElement("span", {
    style: "display: inline-block"
  }, title), VM.createElement("span", {
    style: "float: right; "
  }, VM.createElement("span", {
    class: "tasks-count"
  }, nbOfTasks), "/", wipLimit, VM.createElement("span", {
    style: "font-size: 1rem; margin-left: .5rem",
    class: "to-track"
  }, toTrack > 0 ? `(+${toTrack})` : ""))));
}

class Column {
  constructor(issueList) {
    this.issueLists = [];
    this.title = void 0;
    this._wipLimit = 0;
    this.nbTasks = 0;
    this.toTrack = 0;
    this._nbTasksElement = void 0;
    this._toTrackElement = void 0;
    this._element = void 0;
    this.title = issueList.columnTitle;
    this.issueLists.push(issueList);
    this._element = document.createElement("div");

    this._element.classList.add("gl-display-inline-block", "gl-h-full");

    this._element.style.paddingRight = "8px";
    this._element.style.paddingLeft = "8px";
  }

  addIssueList(board) {
    const lastIssueList = this.issueLists[this.issueLists.length - 1];

    if (board.columnTitle != lastIssueList.columnTitle || board.position != lastIssueList.position && board.position != lastIssueList.position + 1) {
      throw new Error("Invalid board for this column");
    }

    this.issueLists.push(board);
  }

  async updateTaskCount() {
    this.nbTasks = 0;

    for (const il of this.issueLists) {
      const [nbTasks, nbToTrack] = await il.getItemsCount();
      this.nbTasks += nbTasks;
      this.toTrack += nbToTrack;
    }

    if (this.title) {
      this._nbTasksElement.innerHTML = `${this.nbTasks}`;
      this._toTrackElement.innerHTML = `(+${this.toTrack})`;
      this.updateBg();
    }
  }

  get wipLimit() {
    if (this._wipLimit == 0) {
      this._wipLimit = this.issueLists.reduce((acc, b) => acc + b.wipLimit, 0);
    }

    return this._wipLimit;
  }

  async prepareColumnDisplay() {
    document.querySelector("[data-qa-selector='boards_list'] div").appendChild(this._element);

    for (const issueList of this.issueLists) {
      this._element.appendChild(issueList.element);

      issueList.removePadding();
      issueList.prepare();

      issueList.onNbTasksChanged = async () => {
        await this.updateTaskCount();
      };
    }

    if (this.title) {
      const headerDiv = columnHeader(this.title, this.nbTasks, this.wipLimit, this.toTrack);

      this._element.prepend(headerDiv);

      this._nbTasksElement = this._element.getElementsByClassName("tasks-count")[0];
      this._toTrackElement = this._element.getElementsByClassName("to-track")[0];
      await this.updateTaskCount();
    }
  }

  updateBg() {
    let color = "";

    if (this.nbTasks > this.wipLimit) {
      color = "#fdd4cd";
    } else if (this.nbTasks == this.wipLimit) {
      color = "#cdcdcd";
    }

    for (const issueList of this.issueLists) {
      issueList.setBgColor(color);
    }
  }

}

class IssueList {
  constructor(data) {
    this.id = void 0;
    this.position = void 0;
    this.columnTitle = null;
    this.wipLimit = 0;
    this.status = null;
    this.nbTasks = 0;
    this._element = null;
    this._columnItemsCount = null;
    this.onNbTasksChanged = void 0;
    this.id = data["id"];
    this.position = data["position"];

    if (data["label"]) {
      const labelDescription = data["label"]["description"];
      this.parseDescription(labelDescription);
    }
  }

  parseDescription(description) {
    const re_content = /\((.+)\)/;

    if (description !== null) {
      const result = re_content.exec(description);

      for (const data of result[1].split(",")) {
        const [key, value] = data.split(":");

        switch (key.trim()) {
          case "wiplimit":
            this.wipLimit = +value.trim();
            break;

          case "column":
            this.columnTitle = value.trim();
            break;

          case "status":
            this.status = value.trim();
            break;
        }
      }

      if (this.wipLimit < 0 || this.status !== null && this.columnTitle !== null && this.wipLimit === null) {
        this.wipLimit = 0;
      }
    }
  }

  get isInAColumn() {
    return this.columnTitle !== null;
  }

  get element() {
    if (this._element == null) {
      this._element = document.querySelector(`[data-id='${this.id}']`);
    }

    return this._element;
  }

  prepare() {
    VM.observe(this.element, () => {
      const node = this.element.querySelector("[data-testid='board-items-count']");

      if (node) {
        this.onNbTasksChanged();
        return false;
      }
    });
  }

  async getItemsCount() {
    if (this.wipLimit == 0) {
      return [0, 0];
    }

    await new Promise(r => setTimeout(r, 50));
    const count = +this.element.querySelector("[data-testid='board-items-count']").textContent;
    const toTrack = Array.from(this.element.querySelectorAll(".gl-label-text")).filter(e => "to track" == e.textContent.trim()).length;
    return [count - toTrack, toTrack];
  }

  addHeader(wipLimit, add) {
    const header = this.element.querySelector(".board-header");
    header.style.marginBottom = "30px";

    if (add) {
      // header.append(columnHeader(wipLimit));
      this._columnItemsCount = header.querySelector("[data-testid='column-items-count']");
    }
  }

  updateHeader(itemsCount) {
    this._columnItemsCount.textContent = `${itemsCount}`;
  }

  removePadding() {
    this.element.style.paddingRight = "0";
    this.element.style.paddingLeft = "0";
    this.element.style.marginLeft = "-1px";
  }

  setBgColor(color) {
    if (this.wipLimit != 0) {
      const el = this.element.querySelector(".board-list-component");
      el.style.backgroundColor = color;
    }
  }

}

let boardId = null;
const columns = [];
VM.observe(document.body, () => {
  const node = document.getElementById("board-app");

  if (node) {
    boardId = Number(node.getAttribute("data-board-id"));
    return true;
  }
});

async function kanbanBoard() {
  while (boardId == null) {
    await new Promise(r => setTimeout(r, 2500));
  }

  const resp = await fetch(`${document.location.origin}/-/boards/${boardId}/lists`);
  const boardList = await resp.json();
  const subColumnList = boardList.map(b => new IssueList(b));

  for (const issueList of subColumnList) {
    if (columns.length == 0) {
      columns.push(new Column(issueList));
    } else {
      const previousColumn = columns[columns.length - 1];

      try {
        previousColumn.addIssueList(issueList);
      } catch (error) {
        columns.push(new Column(issueList));
      }
    }
  }

  if (columns.length > 1) {
    for (const column of columns) {
      await column.prepareColumnDisplay();
    }
  }
}

kanbanBoard();

}());
