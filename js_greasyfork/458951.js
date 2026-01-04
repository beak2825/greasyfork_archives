// ==UserScript==
// @name         PageAutomator
// @description  Automate the actions on the page
// @version      1.0.4
// @author       aolko
// @match        *
// @namespace    https://greasyfork.org/ru/users/5008-aolko
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.5/mousetrap.min.js
// ==/UserScript==

function PageAutomator() {
    
    // Animate the cursor movement
    function animateCursor(x, y) {
    var startX = cursorX;
    var startY = cursorY;
    var distanceX = x - startX;
    var distanceY = y - startY;
    var startTime = null;
    
    function step(timeStamp) {
      if (!startTime) startTime = timeStamp;
      var progress = timeStamp - startTime;
      cursorX = startX + (distanceX * progress) / 200;
      cursorY = startY + (distanceY * progress) / 200;
      updateCursor(cursorX, cursorY);
      if (progress < 200) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
    }

    // Mouse events
    mouse: {
    
    this.hover = function (selector) {
      var element = document.querySelector(selector);
      element.dispatchEvent(new MouseEvent("mouseover"));
      return this;
    };
    
    this.click = function (selector, button = "left") {
      var element = document.querySelector(selector);
      if (!element) {
        console.log("Error: element not found");
        return this;
      }
      if (button === "left") {
        element.dispatchEvent(new MouseEvent("click"));
      } else if (button === "right") {
        element.dispatchEvent(new MouseEvent("contextmenu"));
      }
      return this;
    };
    
    this.scroll = function (amount) {
      window.scrollBy(0, amount);
      return this;
    };
    
    this.scrollTo = function (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      return this;
    };
    
    this.hold = function (selector, button) {
      var element = document.querySelector(selector);
      if (button === "left") {
        element.dispatchEvent(new MouseEvent("mousedown"));
      } else if (button === "right") {
        element.dispatchEvent(
          new MouseEvent("mousedown", {
            button: 2,
          })
        );
      }
      return this;
    };
    
    this.moveToPosition = function (x, y) {
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: x,
          clientY: y,
        })
      );
      
      return this;
    };
    this.moveToElement = function (selector) {
      var element = document.querySelector(selector);
      if(!element) {
         console.log("Error: element not found");
         return this;
      }
      var rect = element.getBoundingClientRect();
      var x = rect.left + window.pageXOffset + rect.width / 2;
      var y = rect.top + window.pageYOffset + rect.height / 2;
      window.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: x,
          clientY: y,
        })
      );
      
      return this;
    };
    
    this.getPosition = function () {
      var position = {
        x: 0,
        y: 0,
      };
      document.addEventListener("mousemove", function (event) {
        position.x = event.clientX;
        position.y = event.clientY;
      });
      return position;
      return this;
    };
    }
    
    // Keyboard events
    keyboard: {
    this.keyPress = function (key) {
      var event = new KeyboardEvent("keypress", {
        key: key,
      });
      document.dispatchEvent(event);
      return this;
    };
    
    this.keyUp = function (key) {
      var event = new KeyboardEvent("keyup", {
        key: key,
      });
      document.dispatchEvent(event);
      return this;
    };
    
    this.keyDown = function (key) {
      var event = new KeyboardEvent("keydown", {
        key: key,
      });
      document.dispatchEvent(event);
      return this;
    };
    
    this.holdKey = function (key, action) {
      var keys = {
        ctrl: 17,
        shift: 16,
        alt: 18,
        win: 91,
      };
      var event = new KeyboardEvent("keydown", {
        keyCode: keys[key],
        which: keys[key],
      });
      document.dispatchEvent(event);
      action();
      var event = new KeyboardEvent("keyup", {
        keyCode: keys[key],
        which: keys[key],
      });
      document.dispatchEvent(event);
      return this;
    };
    
    this.holdKeySequence = function (sequence, action) {
      Mousetrap.bind(
        sequence,
        function () {
          action();
          Mousetrap.unbind(sequence);
        },
        "keydown"
      );
      return this;
    };
    
    this.setKeyState = function (key, state) {
      if (key === "numlock") {
        var event = new KeyboardEvent("keydown", {
          key: "NumLock",
          code: "NumLock",
        });
        document.dispatchEvent(event);
      } else if (key === "scrolllock") {
        var event = new KeyboardEvent("keydown", {
          key: "ScrollLock",
          code: "ScrollLock",
        });
        document.dispatchEvent(event);
      } else if (key === "capslock") {
        var event = new KeyboardEvent("keydown", {
          key: "CapsLock",
          code: "CapsLock",
        });
        document.dispatchEvent(event);
      }
      return this;
    };
    }
    
    input: {
    // Block input
    this.blockInput = function () {
      document.addEventListener("keydown", function (event) {
        event.preventDefault();
      });
      document.addEventListener("mousedown", function (event) {
        event.preventDefault();
      });
      return this;
    };
    }
    
    timer: {
    // Timer events
    this.wait = function (ms) {
      var start = new Date().getTime();
      var end = start;
      while (end < start + ms) {
        end = new Date().getTime();
      }
      return this;
    };
    
    this.waitForElement = function (selector) {
      var element = document.querySelector(selector);
      while (!element) {
        element = document.querySelector(selector);
      }
      return this;
    };
    
    this.waitForMouse = function (cursor) {
      var currentCursor = document.body.style.cursor;
      while (currentCursor !== cursor) {
        currentCursor = document.body.style.cursor;
      }
      return this;
    };
    }
    
    // Conditionals
    this.ifElement = function (selector, condition, value) {
    var element = document.querySelector(selector);
    if (condition === "contains") {
      if (element.innerHTML.includes(value)) {
        return true;
      } else {
        return false;
      }
    } else if (condition === "does not contain") {
      if (!element.innerHTML.includes(value)) {
        return true;
      } else {
        return false;
      }
    } else if (condition === "is") {
      if (element.innerHTML === value) {
        return true;
      } else {
        return false;
      }
    } else if (condition === "is not") {
      if (element.innerHTML !== value) {
        return true;
      } else {
        return false;
      }
    }
    return this;
    };
    
    this.onElement = function(selector, callback) {
        var target = document.querySelector(selector);
        var observer = new MutationObserver(function(mutations) {
            callback.call(target);
            return this;
        });
        observer.observe(target, {attributes: true, childList: true, characterData: true});
        return this;
    };
    
    this.hasText = function(target, text) {
        return target.textContent.trim().includes(text);
    };
    
    this.hasElement = function(target, selector) {
        return target.querySelector(selector) !== null;
    };
    
    dialogs: {
    // Dialogs/Message Boxes
    this.showNotification = function (title, text) {
      var notification = new Notification(title, {
        body: text,
      });
      return this;
    };
    
    this.showDialog = function (title, text) {
      var dialog = document.createElement("dialog");
      var titleElement = document.createElement("strong");
      titleElement.innerHTML = title;
      var textElement = document.createElement("p");
      textElement.innerHTML = text;
      dialog.appendChild(titleElement);
      dialog.appendChild(textElement);
      document.body.appendChild(dialog);
      dialog.show();
      return this;
    };
    
    this.showCustomDialog = function (html) {
      var dialog = document.createElement("dialog");
      dialog.innerHTML = html;
      document.body.appendChild(dialog);
      dialog.show();
      return this;
    };
    }
    
    clipboard: {
    // Clipboard
    this.getClipboardText = function () {
      return navigator.clipboard.readText().then((text) => {
        return text;
      });
      return this;
    };
    
    this.setClipboardText = function (text) {
      navigator.clipboard.writeText(text);
      return this;
    };
    
    this.clearClipboard = function () {
      navigator.clipboard.writeText("");
      return this;
    };
    }
    router: {
    // function to handle different actions based on URL
    this.ifUrl = function(url, action) {
        if (url.startsWith("/") && window.location.pathname === url) {
            action();
        }else if (url === '/' && window.location.pathname === '/') {
            action();
        } else if (window.location.href === url) {
            action();
        }
    };
    // function to navigate to a specified URL
    this.navigate = function(url) {
        window.location.href = url;
    };
    // function to expose current URL
    currentUrl: {
      this.get_domain = function get_domain() {
          return window.location.hostname;
      };
      this.get_protocol =function get_protocol() {
          return window.location.protocol;
      };
      this.get_page = function get_page() {
          return window.location.pathname;
      };
      this.get_query = function get_query() {
          return window.location.search;
      };
    }
    }

}