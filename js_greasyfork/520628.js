// ==UserScript==
// @name         WoD 战斗设置增强
// @namespace    https://www.christophero.xyz
// @description  增强设置页面操作
// @author       DotIN13
// @include      https://*.wannaexpresso.com/wod/spiel/hero/skillconf*
// @include      http*://*.world-of-dungeons.*/wod/spiel/hero/skillconf*
// @grant        none
// @modifier     Christophero
// @version      2023.04.02.1
// @downloadURL https://update.greasyfork.org/scripts/520628/WoD%20%E6%88%98%E6%96%97%E8%AE%BE%E7%BD%AE%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/520628/WoD%20%E6%88%98%E6%96%97%E8%AE%BE%E7%BD%AE%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  const btnStyle =
    "color: white; background-color: #191919; width: 24px; height: 24px; padding: 0; text-align: center; font-weight: bold;border: 1px solid #8b8b8b;";

  WodUiActionList.prototype.insertAction = function (action, index) {
    this.list.insertItem(new WodUiActionListItem(action), index);
  };

  function moveTo(index) {
    if (index) {
      assert(
        index >= 0,
        "WodUiList.moveTo(index), IndexOutOfBoundsException: index < 0"
      );
      assert(
        index <= this.items.length,
        "WodUiList.moveTo(index), IndexOutOfBoundsException: index >= itemCount"
      );
    }

    if (index >= 0 && this.items.length > 1) {
      // Elemente im DOM tauschen.
      if (index == this.selectedIndex) return;
      const selectedItem = this.items[this.selectedIndex];
      this.listTd.removeChild(selectedItem);
      if (index < this.items.length) {
        const aboveItem = this.items[index];
        this.listTd.insertChild(selectedItem, aboveItem);
      } else {
        this.listTd.appendChild(selectedItem);
      }

      let tempArr = this.items.splice(this.selectedIndex, 1);
      this.items.splice(index, 0, ...tempArr);

      this.setSelectedIndex(index == this.items.length ? index - 1 : index);
    }
  }

  WodUiList.prototype.moveTo = moveTo;
  WodUiPositionList.prototype.moveTo = moveTo;

  /**
   * 创建一个按钮
   * @param {string} innerHTML
   * @param {string} title
   * @param {function} callback
   */
  function createBtn(innerHTML, title, iconUrl, callback) {
    const button = document.createElement("button");
    button.innerHTML = innerHTML;
    button.title = title;
    button.setAttribute(
      "style",
      `${btnStyle}background: url(${iconUrl}),linear-gradient(180deg, #535353, transparent); background-size: contain;`
    );
    button.addEventListener("click", callback);
    return button;
  }

  // 地城添加
  addActionBtns(THE_ORDERS.dungeon.level.preroundActionList);
  addActionBtns(THE_ORDERS.dungeon.level.roundActionList);
  addPositionBtns(THE_ORDERS.dungeon.level.preroundActionList.positionList);
  addPositionBtns(THE_ORDERS.dungeon.level.roundActionList.positionList);
  // 决斗添加
  addActionBtns(THE_ORDERS.duel.level.preroundActionList);
  addActionBtns(THE_ORDERS.duel.level.roundActionList);
  addPositionBtns(THE_ORDERS.duel.level.preroundActionList.positionList);
  addPositionBtns(THE_ORDERS.duel.level.roundActionList.positionList);

  function parseNum(numStr) {
    let num = 1;
    try {
      num = parseInt(numStr);
    } catch (ex) {
      num = 1;
    }
    if (isNaN(num) || num < 0) {
      num = 1;
    }
    return num;
  }

  function addActionBtns(actionList) {
    let list = actionList.list;
    // 添加置顶按钮
    const headerButton = createBtn(
      "",
      "将选中条目移至顶部",
      "https://christophero.xyz/imgs/top.png",
      function (e) {
        e.preventDefault();
        list.moveTo(0);
        actionList.rebuildModel();
      }
    );
    // 添加置底按钮
    const footerButton = createBtn(
      "",
      "将选中条目移至底部",
      "https://christophero.xyz/imgs/bottom.png",
      function (e) {
        e.preventDefault();
        list.moveTo(actionList.actions.length);
        actionList.rebuildModel();
      }
    );
    // 添加禁用其他按钮
    const disableOthersButton = createBtn(
      "限",
      "仅启用选中条目",
      "",
      function (e) {
        e.preventDefault();
        const selectedItem = list.getSelectedItem();
        if (!selectedItem) return;
        for (let item of list.items) {
          item.setEnabled(item === selectedItem);
        }
        actionList.rebuildModel();
      }
    );
    // 添加启用所有按钮
    const allButton = createBtn(
      "",
      "启用所有条目",
      "https://christophero.xyz/imgs/select-all.png",
      function (e) {
        e.preventDefault();
        for (let item of list.items) {
          item.setEnabled(true);
        }
        actionList.rebuildModel();
      }
    );

    const insertButton = createBtn(
      "",
      "复制选中条目并插入下方",
      "https://christophero.xyz/imgs/append.png",
      function (e) {
        e.preventDefault();
        const src = actionList.getSelectedAction();

        if (typeof src != undefined) {
          const dst = new WodAction();
          dst.copyFrom(src);
          if (dst.skill && dst.skill.name === "干等着") {
            let times = prompt("请输入干等次数", 1);
            if (times == null) return;
            times = parseNum(times);
            if (actionList.actions.length + times > 200) {
              alert("插入循环后动作超出200条，禁止插入！");
              return;
            }
            for (let i = 0; i < times; i++) {
              actionList.insertAction(dst, list.getSelectedIndex());
            }
            actionList.rebuildModel();
            list.setSelectedIndex(list.getSelectedIndex() + times);
          } else {
            actionList.insertAction(dst, list.getSelectedIndex());
            actionList.rebuildModel();
            list.setSelectedIndex(list.getSelectedIndex() + 1);
          }
        }
      }
    );

    const clearButton = createBtn(
      "",
      "清空条目",
      "https://christophero.xyz/imgs/clear.png",
      function (e) {
        e.preventDefault();
        list.removeAllItems();
        actionList.addAction(new WodAction());
        list.setSelectedIndex(0);
        actionList.rebuildModel();
      }
    );

    const cycleButton = createBtn("循", "重复环节", "", function (e) {
      e.preventDefault();
      const src = actionList.getSelectedAction();

      if (typeof src != undefined) {
        let cycleRange = prompt("请输入循环长度(包含当前选中行动)", 1);
        if (cycleRange == null) return;
        cycleRange = parseNum(cycleRange);
        let cycleTimes = prompt("请输入额外循环次数(不算原始行动)", 1);
        if (cycleTimes == null) return;
        cycleTimes = parseNum(cycleTimes);
        const actions = actionList.actions;
        let selectedIndex = list.getSelectedIndex();
        // 判断区间是否超出行动数组限界，超出则循环节到结束
        let overlimit = selectedIndex + cycleRange > actions.length;
        if (overlimit) {
          cycleRange = actions.length - selectedIndex;
        }
        if (actions.length + cycleTimes * cycleRange > 200) {
          alert("插入循环后动作超出200条，禁止插入！");
          return;
        }
        // 确定插入起始点并插入指定循环节
        let startIndex = overlimit
          ? actions.length
          : selectedIndex + cycleRange;
        let offset = 0;
        for (let loop = 0; loop < cycleTimes; loop++) {
          for (let index = selectedIndex; index < startIndex; index++) {
            const dst = new WodAction();
            dst.copyFrom(actions[index]);
            actionList.insertAction(dst, startIndex + offset);
            offset++;
          }
        }
        // 重新渲染行动并变更当前选定行动
        actionList.rebuildModel();
        list.setSelectedIndex(
          list.getSelectedIndex() + offset + cycleRange - 1
        );
      }
    });

    let element = list.buttonTd.element ? list.buttonTd.element : list.buttonTd;

    element.appendChild(headerButton);
    element.appendChild(footerButton);
    element.appendChild(disableOthersButton);
    element.appendChild(allButton);
    element.appendChild(clearButton);
    element.appendChild(cycleButton);
    element.appendChild(insertButton);

    // Make buttons sticky
    const stickyButtons = document.createElement("div");
    while (element.childNodes.length) {
      stickyButtons.appendChild(element.firstChild);
    }
    element.appendChild(stickyButtons);
    stickyButtons.setAttribute("style", "position: sticky; top: 0;");
    list.buttonTd = stickyButtons;

    // Make modBox sticky
    actionList.modBox.element.setAttribute(
      "style",
      "width: 300px; padding-bottom: 10px; float: right; position: sticky; top: 0;"
    );
  }

  function addPositionBtns(positionList) {
    // 添加置顶按钮
    const headerButton = createBtn(
      "",
      "将选中条目移至顶部",
      "https://christophero.xyz/imgs/top.png",
      function (e) {
        e.preventDefault();
        positionList.moveTo(0);
        positionList.rebuildPositions();
        positionList.firePositionsChangeEvent();
      }
    );
    // 添加置底按钮
    const footerButton = createBtn(
      "",
      "将选中条目移至底部",
      "https://christophero.xyz/imgs/bottom.png",
      function (e) {
        e.preventDefault();
        positionList.moveTo(positionList.items.length);
        positionList.rebuildPositions();
        positionList.firePositionsChangeEvent();
      }
    );
    // 添加禁用其他按钮
    const disableOthersButton = createBtn(
      "限",
      "仅启用选中条目",
      "",
      function (e) {
        e.preventDefault();
        const selectedItem = positionList.getSelectedItem();
        if (!selectedItem) return;
        for (let item of positionList.items) {
          item.setEnabled(item === selectedItem);
        }
        positionList.rebuildPositions();
        positionList.firePositionsChangeEvent();
      }
    );
    // 添加启用所有按钮
    const allButton = createBtn(
      "",
      "启用所有条目",
      "https://christophero.xyz/imgs/select-all.png",
      function (e) {
        e.preventDefault();
        for (let item of positionList.items) {
          item.setEnabled(true);
        }
        positionList.rebuildPositions();
        positionList.firePositionsChangeEvent();
      }
    );
    // 添加翻转按钮
    const reverseButton = createBtn(
      "",
      "翻转条目",
      "https://christophero.xyz/imgs/reverse.png",
      function (e) {
        e.preventDefault();
        positionList.setPositions(positionList.positions.reverse());
        positionList.rebuildPositions();
        positionList.firePositionsChangeEvent();
      }
    );

    let element = positionList.buttonTd.element
      ? positionList.buttonTd.element
      : positionList.buttonTd;

    element.appendChild(headerButton);
    element.appendChild(footerButton);
    element.appendChild(disableOthersButton);
    element.appendChild(allButton);
    element.appendChild(reverseButton);
  }
})();
