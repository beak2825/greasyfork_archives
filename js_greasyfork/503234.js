function _newArrowCheck(n, r) {
  if (n !== r) throw new TypeError("Cannot instantiate an arrow function");
}
// ==UserScript==
// @name         Addon + for Bodega Bot
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Adds functionality to Bodega Bot Users with improved window stability
// @author       Bort
// @license      Bort
// @icon         https://media1.giphy.com/avatars/FeedMe1219/aBrdzB77IQ5c.gif
// @match        https://tinychat.com/room/*
// @match        https://tinychat.com/*
// @exclude      https://tinychat.com/settings/*
// @exclude      https://tinychat.com/subscription/*
// @exclude      https://tinychat.com/promote/*
// @exclude      https://tinychat.com/coins/*
// @exclude      https://tinychat.com/gifts*
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/503234/Addon%20%2B%20for%20Bodega%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/503234/Addon%20%2B%20for%20Bodega%20Bot.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Create container for the floating button
  var _this = this;
  var container = document.createElement("div");
  container.style.position = "fixed";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.top = "0";
  container.style.left = "0";
  container.style.zIndex = "9999";
  container.style.pointerEvents = "none";
  document.body.appendChild(container);

  // Create main floating button
  var mainButton = document.createElement("button");
  mainButton.className = "floating-button";
  mainButton.innerText = "⚙️";
  mainButton.title = "Open Settings";
  mainButton.style.position = "fixed";
  mainButton.style.bottom = "20px";
  mainButton.style.left = "20px";
  mainButton.style.width = "40px";
  mainButton.style.height = "40px";
  mainButton.style.backgroundColor = "rgb(0 0 0 / 20%)";
  mainButton.style.color = "white";
  mainButton.style.border = "none";
  mainButton.style.borderRadius = "50%";
  mainButton.style.cursor = "pointer";
  mainButton.style.transition = "all 0.3s";
  mainButton.style.zIndex = "10000";
  mainButton.style.fontSize = "20px";
  mainButton.style.display = "flex";
  mainButton.style.alignItems = "center";
  mainButton.style.justifyContent = "center";
  mainButton.style.pointerEvents = "auto";
  container.appendChild(mainButton);

  // Create container for additional buttons
  var additionalButtons = document.createElement("div");
  additionalButtons.className = "additional-buttons";
  additionalButtons.style.display = "none";
  additionalButtons.style.flexDirection = "column";
  additionalButtons.style.position = "fixed";
  additionalButtons.style.left = "20px";
  additionalButtons.style.bottom = "70px";
  additionalButtons.style.zIndex = "10001";
  additionalButtons.style.pointerEvents = "auto";
  container.appendChild(additionalButtons);

  // Array of additional button configurations
  var buttonConfigs = [
    {
      label: "📸",
      action: takeScreenshot,
      title: "Take Screenshot"
    },
    {
      label: "📺",
      action: toggleGroupTube,
      title: "Toggle GroupTube"
    },
    {
      label: "🔎",
      action: function action() {
        _newArrowCheck(this, _this);
        return resizeGroupTube(1.1);
      }.bind(this),
      title: "Increase GroupTube Size"
    },
    {
      label: "🔍",
      action: function action() {
        _newArrowCheck(this, _this);
        return resizeGroupTube(0.9);
      }.bind(this),
      title: "Decrease GroupTube Size"
    },
    {
      label: "♻️",
      action: reloadGroupTube,
      title: "Reload GroupTube"
    },
    {
      label: "🛠",
      action: showCommands,
      title: "Show Commands"
    },
    {
      label: "🎮",
      action: toggleGameWindow,
      title: "Toggle Game Window"
    }
  ];

  // Create additional buttons
  buttonConfigs.forEach(
    function (config) {
      var _this2 = this;
      _newArrowCheck(this, _this);
      var button = document.createElement("button");
      button.className = "additional-button";
      button.innerText = config.label;
      button.title = config.title;
      button.style.backgroundColor = "rgb(0 0 0 / 20%)";
      button.style.color = "white";
      button.style.border = "none";
      button.style.margin = "5px";
      button.style.padding = "10px";
      button.style.borderRadius = "5px";
      button.style.cursor = "pointer";
      button.style.transition = "all 0.3s";
      button.style.width = "40px";
      button.style.height = "40px";
      button.style.fontSize = "16px";
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      additionalButtons.appendChild(button);

      // Add click event listener
      button.addEventListener(
        "click",
        function () {
          var _this3 = this;
          _newArrowCheck(this, _this2);
          config.action();
          // Provide visual feedback
          var originalColor = button.style.backgroundColor;
          button.style.backgroundColor = "rgb(0 0 0 / 20%)";
          setTimeout(
            function () {
              _newArrowCheck(this, _this3);
              button.style.backgroundColor = originalColor;
            }.bind(this),
            200
          );
        }.bind(this)
      );

      // Hover effect for additional buttons
      button.addEventListener(
        "mouseover",
        function () {
          _newArrowCheck(this, _this2);
          button.style.backgroundColor = "rgb(0 0 0 / 30%)";
        }.bind(this)
      );
      button.addEventListener(
        "mouseout",
        function () {
          _newArrowCheck(this, _this2);
          button.style.backgroundColor = "rgb(0 0 0 / 20%)";
        }.bind(this)
      );
    }.bind(this)
  );

  // Toggle additional buttons display on main button click
  mainButton.addEventListener(
    "click",
    function () {
      _newArrowCheck(this, _this);
      var isExpanded = additionalButtons.style.display === "flex";
      additionalButtons.style.display = isExpanded ? "none" : "flex";
      mainButton.style.transform = isExpanded
        ? "rotate(0deg)"
        : "rotate(180deg)";
    }.bind(this)
  );

  // Allow dragging of the main button
  var isDraggingMain = false;
  var mainOffsetX, mainOffsetY;
  mainButton.addEventListener(
    "mousedown",
    function (e) {
      _newArrowCheck(this, _this);
      isDraggingMain = true;
      mainOffsetX = e.clientX - mainButton.getBoundingClientRect().left;
      mainOffsetY = e.clientY - mainButton.getBoundingClientRect().top;
    }.bind(this)
  );
  document.addEventListener(
    "mousemove",
    function (e) {
      _newArrowCheck(this, _this);
      if (isDraggingMain) {
        var x = e.clientX - mainOffsetX;
        var y = e.clientY - mainOffsetY;
        var maxX = window.innerWidth - mainButton.offsetWidth;
        var maxY = window.innerHeight - mainButton.offsetHeight;
        mainButton.style.left = Math.max(0, Math.min(x, maxX)) + "px";
        mainButton.style.bottom =
          Math.max(
            0,
            Math.min(window.innerHeight - y - mainButton.offsetHeight, maxY)
          ) + "px";
        additionalButtons.style.left = mainButton.style.left;
        additionalButtons.style.bottom =
          parseInt(mainButton.style.bottom) +
          mainButton.offsetHeight +
          10 +
          "px";
      }
    }.bind(this)
  );
  document.addEventListener(
    "mouseup",
    function () {
      _newArrowCheck(this, _this);
      isDraggingMain = false;
    }.bind(this)
  );

  // Screenshot functionality
  function takeScreenshot() {
    var _this4 = this;
    html2canvas(document.body).then(
      function (canvas) {
        _newArrowCheck(this, _this4);
        var link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = canvas.toDataURL();
        link.click();
        alert("Screenshot saved!");
      }.bind(this)
    );
  }
  // GroupTube functionality
  var groupTubeWindow = null;
  var groupTubePosition = {
    x: 0,
    y: 0
  };
  var groupTubeSize = {
    width: "80%",
    height: "80%"
  };
  function toggleGroupTube() {
    var _this5 = this;
    if (groupTubeWindow) {
      groupTubeWindow.style.display =
        groupTubeWindow.style.display === "none" ? "block" : "none";
      return;
    }
    groupTubeWindow = document.createElement("div");
    groupTubeWindow.style.position = "fixed";
    groupTubeWindow.style.top = groupTubePosition.y + "px";
    groupTubeWindow.style.left = groupTubePosition.x + "px";
    groupTubeWindow.style.width = groupTubeSize.width;
    groupTubeWindow.style.height = groupTubeSize.height;
    groupTubeWindow.style.backgroundColor = "#222";
    groupTubeWindow.style.border = "2px solid rgb(0 0 0 / 20%)";
    groupTubeWindow.style.borderRadius = "10px";
    groupTubeWindow.style.zIndex = "10002";
    groupTubeWindow.style.overflow = "hidden";
    groupTubeWindow.style.pointerEvents = "auto";
    var iframe = document.createElement("iframe");
    iframe.src =
      "https://group.tube/group/70d02ed5-df92-424b-bdcd-d0c60f8ad574?join";
    iframe.style.width = "100%";
    iframe.style.height = "calc(100% - 30px)";
    iframe.style.border = "none";
    iframe.style.pointerEvents = "auto";
    groupTubeWindow.appendChild(iframe);
    var closeButton = document.createElement("button");
    closeButton.innerText = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "1px";
    closeButton.style.right = "1px";
    closeButton.style.backgroundColor = "rgb(0 0 0 / 20%)";
    closeButton.style.border = "none";
    closeButton.style.color = "#fff";
    closeButton.style.fontSize = "14px";
    closeButton.style.cursor = "pointer";
    closeButton.style.padding = "5px 10px";
    closeButton.style.borderRadius = "5px";
    closeButton.onclick = function () {
      _newArrowCheck(this, _this5);
      return (groupTubeWindow.style.display = "none");
    }.bind(this);
    groupTubeWindow.appendChild(closeButton);
    container.appendChild(groupTubeWindow);

    // Add drag functionality to GroupTube window
    var dragHandle = document.createElement("div");
    dragHandle.style.position = "absolute";
    dragHandle.style.top = "0";
    dragHandle.style.left = "0";
    dragHandle.style.width = "calc(100% - 30px)";
    dragHandle.style.height = "30px";
    dragHandle.style.cursor = "move";
    groupTubeWindow.appendChild(dragHandle);

    // Add resize functionality to GroupTube window
    var resizeHandle = document.createElement("div");
    resizeHandle.style.position = "absolute";
    resizeHandle.style.bottom = "0";
    resizeHandle.style.right = "0";
    resizeHandle.style.width = "20px";
    resizeHandle.style.height = "20px";
    resizeHandle.style.cursor = "se-resize";
    resizeHandle.style.backgroundColor = "rgb(0 0 0 / 20%)";
    groupTubeWindow.appendChild(resizeHandle);
    dragHandle.addEventListener("mousedown", initDrag, false);
    resizeHandle.addEventListener("mousedown", initResize, false);
    window.addEventListener("mousemove", doDragResize, false);
    window.addEventListener("mouseup", stopDragResize, false);
    var isDragging = false;
    var isResizing = false;
    var startX, startY, startWidth, startHeight;
    function initDrag(e) {
      isDragging = true;
      startX = e.clientX - groupTubeWindow.offsetLeft;
      startY = e.clientY - groupTubeWindow.offsetTop;
    }
    function initResize(e) {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(
        document.defaultView.getComputedStyle(groupTubeWindow).width,
        10
      );
      startHeight = parseInt(
        document.defaultView.getComputedStyle(groupTubeWindow).height,
        10
      );
    }
    function doDragResize(e) {
      if (isDragging) {
        var newX = e.clientX - startX;
        var newY = e.clientY - startY;
        newX = Math.max(
          0,
          Math.min(newX, window.innerWidth - groupTubeWindow.offsetWidth)
        );
        newY = Math.max(
          0,
          Math.min(newY, window.innerHeight - groupTubeWindow.offsetHeight)
        );
        groupTubeWindow.style.left = newX + "px";
        groupTubeWindow.style.top = newY + "px";
        groupTubePosition = {
          x: newX,
          y: newY
        };
      }
      if (isResizing) {
        var newWidth = startWidth + e.clientX - startX;
        var newHeight = startHeight + e.clientY - startY;
        newWidth = Math.max(
          200,
          Math.min(newWidth, window.innerWidth - groupTubeWindow.offsetLeft)
        );
        newHeight = Math.max(
          200,
          Math.min(newHeight, window.innerHeight - groupTubeWindow.offsetTop)
        );
        groupTubeWindow.style.width = newWidth + "px";
        groupTubeWindow.style.height = newHeight + "px";
        groupTubeSize = {
          width: newWidth + "px",
          height: newHeight + "px"
        };
      }
    }
    function stopDragResize() {
      isDragging = false;
      isResizing = false;
    }
  }
  function resizeGroupTube(factor) {
    if (groupTubeWindow) {
      var currentWidth = groupTubeWindow.offsetWidth;
      var currentHeight = groupTubeWindow.offsetHeight;
      var newWidth = currentWidth * factor;
      var newHeight = currentHeight * factor;
      newWidth = Math.max(
        200,
        Math.min(newWidth, window.innerWidth - groupTubeWindow.offsetLeft)
      );
      newHeight = Math.max(
        200,
        Math.min(newHeight, window.innerHeight - groupTubeWindow.offsetTop)
      );
      groupTubeWindow.style.width = newWidth + "px";
      groupTubeWindow.style.height = newHeight + "px";
      groupTubeSize = {
        width: newWidth + "px",
        height: newHeight + "px"
      };
    }
  }
  function reloadGroupTube() {
    if (groupTubeWindow) {
      var iframe = groupTubeWindow.querySelector("iframe");
      if (iframe) {
        iframe.src = iframe.src;
      }
    }
  }

  // Game Window functionality
  var gameWindow = null;
  var gameWindowPosition = {
    x: 0,
    y: 0
  };
  var gameWindowSize = {
    width: "80%",
    height: "80%"
  };
  function toggleGameWindow() {
    var _this6 = this;
    if (gameWindow) {
      gameWindow.style.display =
        gameWindow.style.display === "none" ? "block" : "none";
      return;
    }
    gameWindow = document.createElement("div");
    gameWindow.id = "gameWindow";
    gameWindow.style.position = "fixed";
    gameWindow.style.top = gameWindowPosition.y + "px";
    gameWindow.style.left = gameWindowPosition.x + "px";
    gameWindow.style.width = gameWindowSize.width;
    gameWindow.style.height = gameWindowSize.height;
    gameWindow.style.backgroundColor = "#222";
    gameWindow.style.border = "2px solid rgb(0 0 0 / 20%)";
    gameWindow.style.borderRadius = "10px";
    gameWindow.style.zIndex = "10002";
    gameWindow.style.overflow = "hidden";
    gameWindow.style.pointerEvents = "auto";
    var styleElement = document.createElement("style");
    styleElement.textContent =
      "\n            #gameWindow::-webkit-scrollbar {\n                width: 12px;\n            }\n            #gameWindow::-webkit-scrollbar-track {\n                background: #1a1a1a;\n            }\n            #gameWindow::-webkit-scrollbar-thumb {\n                background-color: #333;\n                border-radius: 6px;\n                border: 3px solid #1a1a1a;\n            }\n        ";
    document.head.appendChild(styleElement);
    var urlBar = document.createElement("input");
    urlBar.type = "text";
    urlBar.placeholder = "Enter game URL";
    urlBar.style.width = "calc(80% - 100px)";
    urlBar.style.padding = "5px";
    urlBar.style.margin = "5px";
    urlBar.value = "https://www.miniplay.com/multiplayer";
    var loadButton = document.createElement("button");
    loadButton.innerText = "Load";
    loadButton.style.width = "calc(20% - 10px)";
    loadButton.style.padding = "5px";
    loadButton.style.margin = "5px";
    var iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "calc(100% - 50px)";
    iframe.style.border = "none";
    iframe.style.marginTop = "10px";
    iframe.src = "https://www.miniplay.com/multiplayer";
    loadButton.onclick = function () {
      iframe.src = urlBar.value;
    };
    var closeButton = document.createElement("button");
    closeButton.innerText = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "1px";
    closeButton.style.right = "1px";
    closeButton.style.backgroundColor = "rgb(0 0 0 / 20%)";
    closeButton.style.border = "none";
    closeButton.style.color = "#fff";
    closeButton.style.fontSize = "14px";
    closeButton.style.cursor = "pointer";
    closeButton.style.padding = "5px 10px";
    closeButton.style.borderRadius = "5px";
    closeButton.onclick = function () {
      _newArrowCheck(this, _this6);
      return (gameWindow.style.display = "none");
    }.bind(this);
    gameWindow.appendChild(urlBar);
    gameWindow.appendChild(loadButton);
    gameWindow.appendChild(iframe);
    gameWindow.appendChild(closeButton);
    container.appendChild(gameWindow);

    // Add drag functionality to Game window
    var dragHandle = document.createElement("div");
    dragHandle.style.position = "absolute";
    dragHandle.style.top = "0";
    dragHandle.style.left = "0";
    dragHandle.style.width = "calc(100% - 30px)";
    dragHandle.style.height = "30px";
    dragHandle.style.cursor = "move";
    gameWindow.appendChild(dragHandle);

    // Add resize functionality to Game window
    var resizeHandle = document.createElement("div");
    resizeHandle.style.position = "absolute";
    resizeHandle.style.bottom = "0";
    resizeHandle.style.right = "0";
    resizeHandle.style.width = "20px";
    resizeHandle.style.height = "20px";
    resizeHandle.style.cursor = "se-resize";
    resizeHandle.style.backgroundColor = "rgb(0 0 0 / 20%)";
    gameWindow.appendChild(resizeHandle);
    dragHandle.addEventListener("mousedown", initGameDrag, false);
    resizeHandle.addEventListener("mousedown", initGameResize, false);
    window.addEventListener("mousemove", doGameDragResize, false);
    window.addEventListener("mouseup", stopGameDragResize, false);
    var isGameDragging = false;
    var isGameResizing = false;
    var gameStartX, gameStartY, gameStartWidth, gameStartHeight;
    function initGameDrag(e) {
      isGameDragging = true;
      gameStartX = e.clientX - gameWindow.offsetLeft;
      gameStartY = e.clientY - gameWindow.offsetTop;
    }
    function initGameResize(e) {
      isGameResizing = true;
      gameStartX = e.clientX;
      gameStartY = e.clientY;
      gameStartWidth = parseInt(
        document.defaultView.getComputedStyle(gameWindow).width,
        10
      );
      gameStartHeight = parseInt(
        document.defaultView.getComputedStyle(gameWindow).height,
        10
      );
    }
    function doGameDragResize(e) {
      if (isGameDragging) {
        var newX = e.clientX - gameStartX;
        var newY = e.clientY - gameStartY;
        newX = Math.max(
          0,
          Math.min(newX, window.innerWidth - gameWindow.offsetWidth)
        );
        newY = Math.max(
          0,
          Math.min(newY, window.innerHeight - gameWindow.offsetHeight)
        );
        gameWindow.style.left = newX + "px";
        gameWindow.style.top = newY + "px";
        gameWindowPosition = {
          x: newX,
          y: newY
        };
      }
      if (isGameResizing) {
        var newWidth = gameStartWidth + e.clientX - gameStartX;
        var newHeight = gameStartHeight + e.clientY - gameStartY;
        newWidth = Math.max(
          200,
          Math.min(newWidth, window.innerWidth - gameWindow.offsetLeft)
        );
        newHeight = Math.max(
          200,
          Math.min(newHeight, window.innerHeight - gameWindow.offsetTop)
        );
        gameWindow.style.width = newWidth + "px";
        gameWindow.style.height = newHeight + "px";
        gameWindowSize = {
          width: newWidth + "px",
          height: newHeight + "px"
        };
      }
    }
    function stopGameDragResize() {
      isGameDragging = false;
      isGameResizing = false;
    }
  }
  // Command functionality
  var commands = {
    "Owner Commands": [
      "!raid tc link",
      "!camsweep 5 - 30",
      "!closeall",
      "!kickall",
      "!version",
      "!whoisbot",
      "!bot",
      "!autokick (be careful!)",
      "!autoban (be careful!)"
    ],
    "Main Toggles": [
      "!greenroomtoggle",
      "!publiccommandtoggle",
      "!bottoggle",
      "!votetoggle",
      "!greetmodetoggle",
      "!imgurtoggle",
      "!raidtoggle",
      "!avatartoggle",
      "!notificationtoggle",
      "!popuptoggle",
      "!soundmetertoggle",
      "!timestamptoggle",
      "!remindertoggle"
    ],
    "User Management": [
      "!autokick (be careful!)",
      "!autoban (be careful!)",
      "!userban user",
      "!nickban nick",
      "!userkick user",
      "!nickkick nick",
      "!userclose user",
      "!nickclose nick"
    ],
    "Green Room": [
      "!greenroomlist",
      "!greenroomlistclear",
      "!greenroomadd user",
      "!greenroomremove #",
      "!greenroomignorelist",
      "!greenroomignorelistclear",
      "!greenroomignoreadd user",
      "!greenroomignoreremove #"
    ],
    "YouTube Controls": [
      "!ytapi apikey",
      "!ytbypass link (no playlists)",
      "!yt link | keyword",
      "!ytskip",
      "!ytclear",
      "!ytlink",
      "!ytkeyword",
      "!ytqueue"
    ],
    "Ban Management": [
      "!userbanlist",
      "!userbanlistclear",
      "!userbanadd user",
      "!userbanremove #",
      "!nickbanlist",
      "!nickbanlistclear",
      "!nickbanadd nick",
      "!nickbanremove #",
      "!bankeywordlist",
      "!bankeywordlistclear",
      "!bankeywordadd keyword | phrase",
      "!bankeywordremove #"
    ],
    "Kick Management": [
      "!userkicklist",
      "!userkicklistclear",
      "!userkickadd user",
      "!userkickremove #",
      "!nickkicklist",
      "!nickkicklistclear",
      "!nickkickadd nick",
      "!nickkickremove #",
      "!kickkeywordlist",
      "!kickkeywordlistclear",
      "!kickkeywordadd keyword | phrase",
      "!kickkeywordremove #"
    ],
    "Operator Management": [
      "!oplist",
      "!oplistclear",
      "!opadd user | -all",
      "!opremove #",
      "!optoggle"
    ],
    "Moderator Management": [
      "!modlist",
      "!modlistclear",
      "!modadd user",
      "!modremove #"
    ],
    "Jr. Moderator Commands": [
      "!userban user",
      "!nickban nick",
      "!userkick user",
      "!nickkick nick",
      "!userclose user",
      "!nickclose nick"
    ],
    "List Management": [
      "!lists",
      "!listsclear",
      "!userlist",
      "!mentionlist",
      "!mentionlistclear",
      "!mentionadd keyword",
      "!mentionremove #",
      "!ignorelist",
      "!ignorelistclear",
      "!ignoreadd user",
      "!ignoreremove #",
      "!hiddencameralist",
      "!hiddencameralistclear",
      "!hiddencameraadd user",
      "!hiddencameraremove #",
      "!greetlist",
      "!greetlistclear",
      "!greetadd user | -all",
      "!greetremove #",
      "!ttslist",
      "!ttslistclear",
      "!ttsadd user | -all | -event",
      "!ttsremove #",
      "!highlightlist",
      "!highlightlistclear",
      "!highlightadd user",
      "!highlightremove #",
      "!reminderlist",
      "!reminderlistclear",
      "!reminderadd user",
      "!reminderremove #",
      "!safelist",
      "!safelistclear",
      "!safeadd user",
      "!saferemove #"
    ],
    "Settings and Utilities": [
      "!fps 1 - 60",
      "!clr",
      "!clrall",
      "!settings",
      "!share"
    ],
    "Fun Commands": [
      "!coin",
      "!advice",
      "!8ball question",
      "!roll #",
      "!chuck",
      "!dad",
      "!vote user"
    ],
    "Trivia Game": [
      "!gameview",
      "!trivia",
      "!triviahelp",
      "!triviahost",
      "!triviaskip",
      "!triviaend",
      "!triviascore",
      "!triviaplayerlist",
      "!triviaplayerlistclear",
      "!triviaadd question answer",
      "!triviaremove #",
      "!triviaplayeradd player",
      "!triviaplayerremove player"
    ],
    "Fish Game": [
      "!gameview",
      "!fish",
      "!fishhelp",
      "!fishhost",
      "!fishupgrade",
      "!fishstop",
      "!fishstats",
      "!fishinventory",
      "!fishequip bait | rod",
      "!fishevent",
      "!fishleaderboard"
    ]
  };
  var commandWindow = null;
  var commandWindowPosition = {
    x: "50%",
    y: "50%"
  };
  var commandWindowSize = {
    width: "90%",
    height: "80%"
  };
  function showCommands() {
    var _this7 = this;
    if (commandWindow) {
      commandWindow.style.display =
        commandWindow.style.display === "none" ? "block" : "none";
      return;
    }
    commandWindow = document.createElement("div");
    commandWindow.style.position = "fixed";
    commandWindow.style.top = commandWindowPosition.y;
    commandWindow.style.left = commandWindowPosition.x;
    commandWindow.style.transform = "translate(-50%, -50%)";
    commandWindow.style.width = commandWindowSize.width;
    commandWindow.style.height = commandWindowSize.height;
    commandWindow.style.maxWidth = "800px";
    commandWindow.style.maxHeight = "600px";
    commandWindow.style.overflowY = "auto";
    commandWindow.style.backgroundColor = "rgba(34, 34, 34, 0.9)";
    commandWindow.style.color = "#fff";
    commandWindow.style.padding = "20px";
    commandWindow.style.borderRadius = "10px";
    commandWindow.style.zIndex = "10002";
    commandWindow.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    commandWindow.style.pointerEvents = "auto";
    // Add custom scrollbar styles
    commandWindow.style.scrollbarWidth = "thin";
    commandWindow.style.scrollbarColor =
      "rgba(85, 85, 85, 0.5) rgba(34, 34, 34, 0.3)";

    // For Webkit browsers (Chrome, Safari)
    var styleElement = document.createElement("style");
    styleElement.textContent =
      "\n            #commandWindow::-webkit-scrollbar {\n                width: 8px;\n            }\n            #commandWindow::-webkit-scrollbar-track {\n                background: rgba(34, 34, 34, 0.3);\n            }\n            #commandWindow::-webkit-scrollbar-thumb {\n                background-color: rgba(85, 85, 85, 0.5);\n                border-radius: 4px;\n            }\n        ";
    document.head.appendChild(styleElement);
    commandWindow.id = "commandWindow";
    var closeButton = document.createElement("button");
    closeButton.innerText = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.border = "none";
    closeButton.style.color = "#fff";
    closeButton.style.fontSize = "20px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function () {
      _newArrowCheck(this, _this7);
      return (commandWindow.style.display = "none");
    }.bind(this);
    commandWindow.appendChild(closeButton);
    for (
      var _i = 0, _Object$entries = Object.entries(commands);
      _i < _Object$entries.length;
      _i++
    ) {
      var _Object$entries$_i = _Object$entries[_i],
        category = _Object$entries$_i[0],
        categoryCommands = _Object$entries$_i[1];
      var categoryTitle = document.createElement("h3");
      categoryTitle.innerText = category;
      categoryTitle.style.marginTop = "20px";
      categoryTitle.style.marginBottom = "10px";
      categoryTitle.style.fontSize = "18px";
      categoryTitle.style.color = "#007bff";
      commandWindow.appendChild(categoryTitle);
      categoryCommands.forEach(
        function (command) {
          var _this8 = this;
          _newArrowCheck(this, _this7);
          var commandButton = document.createElement("button");
          commandButton.innerText = command;
          commandButton.style.display = "block";
          commandButton.style.width = "100%";
          commandButton.style.padding = "10px";
          commandButton.style.marginBottom = "5px";
          commandButton.style.backgroundColor = "rgba(68, 68, 68, 0.8)";
          commandButton.style.border = "none";
          commandButton.style.color = "#fff";
          commandButton.style.textAlign = "left";
          commandButton.style.cursor = "pointer";
          commandButton.style.borderRadius = "5px";
          commandButton.style.transition = "all 0.3s";
          commandButton.style.fontSize = "14px";
          commandButton.addEventListener(
            "mouseover",
            function () {
              _newArrowCheck(this, _this8);
              commandButton.style.backgroundColor = "rgba(85, 85, 85, 0.8)";
            }.bind(this)
          );
          commandButton.addEventListener(
            "mouseout",
            function () {
              _newArrowCheck(this, _this8);
              commandButton.style.backgroundColor = "rgba(68, 68, 68, 0.8)";
            }.bind(this)
          );
          commandButton.onclick = function () {
            var _this9 = this;
            _newArrowCheck(this, _this8);
            GM_setClipboard(command);
            commandButton.style.backgroundColor = "rgba(0, 123, 255, 0.8)";
            commandButton.innerText = "Copied!";
            setTimeout(
              function () {
                _newArrowCheck(this, _this9);
                commandButton.style.backgroundColor = "rgba(68, 68, 68, 0.8)";
                commandButton.innerText = command;
              }.bind(this),
              1000
            );
          }.bind(this);
          commandWindow.appendChild(commandButton);
        }.bind(this)
      );
    }
    container.appendChild(commandWindow);

    // Make command window draggable and resizable
    var isDraggingCmd = false;
    var isResizingCmd = false;
    var cmdStartX, cmdStartY, cmdStartWidth, cmdStartHeight;
    var cmdDragHandle = document.createElement("div");
    cmdDragHandle.style.position = "absolute";
    cmdDragHandle.style.top = "0";
    cmdDragHandle.style.left = "0";
    cmdDragHandle.style.width = "calc(100% - 30px)";
    cmdDragHandle.style.height = "30px";
    cmdDragHandle.style.cursor = "move";
    cmdDragHandle.style.backgroundColor = "rgb(0 0 0 / 1%)";
    commandWindow.insertBefore(cmdDragHandle, commandWindow.firstChild);
    var cmdResizeHandle = document.createElement("div");
    cmdResizeHandle.style.position = "absolute";
    cmdResizeHandle.style.bottom = "0";
    cmdResizeHandle.style.right = "0";
    cmdResizeHandle.style.width = "20px";
    cmdResizeHandle.style.height = "20px";
    cmdResizeHandle.style.cursor = "se-resize";
    cmdResizeHandle.style.backgroundColor = "rgb(0 0 0 / 20%)";
    commandWindow.appendChild(cmdResizeHandle);
    cmdDragHandle.addEventListener("mousedown", initCmdDrag, false);
    cmdResizeHandle.addEventListener("mousedown", initCmdResize, false);
    window.addEventListener("mousemove", doCmdDragResize, false);
    window.addEventListener("mouseup", stopCmdDragResize, false);
    function initCmdDrag(e) {
      isDraggingCmd = true;
      cmdStartX = e.clientX - commandWindow.offsetLeft;
      cmdStartY = e.clientY - commandWindow.offsetTop;
    }
    function initCmdResize(e) {
      isResizingCmd = true;
      cmdStartX = e.clientX;
      cmdStartY = e.clientY;
      cmdStartWidth = parseInt(
        document.defaultView.getComputedStyle(commandWindow).width,
        10
      );
      cmdStartHeight = parseInt(
        document.defaultView.getComputedStyle(commandWindow).height,
        10
      );
    }
    function doCmdDragResize(e) {
      if (isDraggingCmd) {
        var newX = e.clientX - cmdStartX;
        var newY = e.clientY - cmdStartY;
        newX = Math.max(
          0,
          Math.min(newX, window.innerWidth - commandWindow.offsetWidth)
        );
        newY = Math.max(
          0,
          Math.min(newY, window.innerHeight - commandWindow.offsetHeight)
        );
        commandWindow.style.left = newX + "px";
        commandWindow.style.top = newY + "px";
        commandWindow.style.transform = "none";
        commandWindowPosition = {
          x: newX + "px",
          y: newY + "px"
        };
      }
      if (isResizingCmd) {
        var newWidth = cmdStartWidth + e.clientX - cmdStartX;
        var newHeight = cmdStartHeight + e.clientY - cmdStartY;
        newWidth = Math.max(
          200,
          Math.min(newWidth, window.innerWidth - commandWindow.offsetLeft)
        );
        newHeight = Math.max(
          200,
          Math.min(newHeight, window.innerHeight - commandWindow.offsetTop)
        );
        commandWindow.style.width = newWidth + "px";
        commandWindow.style.height = newHeight + "px";
        commandWindow.style.maxWidth = "none";
        commandWindow.style.maxHeight = "none";
        commandWindowSize = {
          width: newWidth + "px",
          height: newHeight + "px"
        };
      }
    }
    function stopCmdDragResize() {
      isDraggingCmd = false;
      isResizingCmd = false;
    }
  }

  // Ensure the window stays within bounds when the browser is resized
  window.addEventListener("resize", adjustWindowPositions);
  function adjustWindowPositions() {
    if (commandWindow) {
      var rect = commandWindow.getBoundingClientRect();
      var newX = rect.left;
      var newY = rect.top;
      var newWidth = rect.width;
      var newHeight = rect.height;
      if (rect.right > window.innerWidth) {
        newX = window.innerWidth - newWidth;
      }
      if (rect.bottom > window.innerHeight) {
        newY = window.innerHeight - newHeight;
      }
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      commandWindow.style.left = newX + "px";
      commandWindow.style.top = newY + "px";
      commandWindow.style.width = newWidth + "px";
      commandWindow.style.height = newHeight + "px";
      commandWindow.style.transform = "none";
      commandWindowPosition = {
        x: newX + "px",
        y: newY + "px"
      };
      commandWindowSize = {
        width: newWidth + "px",
        height: newHeight + "px"
      };
    }
    if (groupTubeWindow) {
      var rect = groupTubeWindow.getBoundingClientRect();
      var newX = rect.left;
      var newY = rect.top;
      var newWidth = rect.width;
      var newHeight = rect.height;
      if (rect.right > window.innerWidth) {
        newX = window.innerWidth - newWidth;
      }
      if (rect.bottom > window.innerHeight) {
        newY = window.innerHeight - newHeight;
      }
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      groupTubeWindow.style.left = newX + "px";
      groupTubeWindow.style.top = newY + "px";
      groupTubeWindow.style.width = newWidth + "px";
      groupTubeWindow.style.height = newHeight + "px";
      groupTubePosition = {
        x: newX,
        y: newY
      };
      groupTubeSize = {
        width: newWidth + "px",
        height: newHeight + "px"
      };
    }
    if (gameWindow) {
      var rect = gameWindow.getBoundingClientRect();
      var newX = rect.left;
      var newY = rect.top;
      var newWidth = rect.width;
      var newHeight = rect.height;
      if (rect.right > window.innerWidth) {
        newX = window.innerWidth - newWidth;
      }
      if (rect.bottom > window.innerHeight) {
        newY = window.innerHeight - newHeight;
      }
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      gameWindow.style.left = newX + "px";
      gameWindow.style.top = newY + "px";
      gameWindow.style.width = newWidth + "px";
      gameWindow.style.height = newHeight + "px";
      gameWindowPosition = {
        x: newX,
        y: newY
      };
      gameWindowSize = {
        width: newWidth + "px",
        height: newHeight + "px"
      };
    }
  }
})();
