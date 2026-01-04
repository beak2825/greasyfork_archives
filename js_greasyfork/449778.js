// ==UserScript==
// @name         网页抖音 手柄控制
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  利用web端gamepad接口，使用手柄模拟网页互动行为，可用于刷网页抖音视频
// @author       xue
// @match        https://www.douyin.com/*
// @match     http*://www.baidu.com/*
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/449778/%E7%BD%91%E9%A1%B5%E6%8A%96%E9%9F%B3%20%E6%89%8B%E6%9F%84%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/449778/%E7%BD%91%E9%A1%B5%E6%8A%96%E9%9F%B3%20%E6%89%8B%E6%9F%84%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==
;;;
( ()=>{
class GamepadController extends EventTarget {
  static Keydown = "keydown";
  static Pressed = "pressed";
  static AxisMove = "axisMove";

  constructor() {
    super();
    this.buttonStates = {};
    this.init();
  }

  init() {
    window.addEventListener("gamepadconnected",(event) => {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        event.gamepad.index,event.gamepad.id,event.gamepad.buttons.length,event.gamepad.axes.length);
    });

    window.addEventListener("gamepaddisconnected",(event) => {
      console.log("Gamepad disconnected from index %d: %s",event.gamepad.index,event.gamepad.id);
    });

    this.updateGamepadStatus();
  }

  updateGamepadStatus() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];

      if (gamepad) {
        // Check button states
        for (let j = 0; j < gamepad.buttons.length; j++) {
          const button = gamepad.buttons[j];

          if (button.pressed) {
            // Handle button press
            if (!this.buttonStates[gamepad.index]?.[j]) {
              // Button keydown event
              this.dispatchEvent(new CustomEvent(GamepadController.Keydown,{
                detail: [gamepad.index,j,button.value]
              }));

              if (!this.buttonStates[gamepad.index]) {
                this.buttonStates[gamepad.index] = [];
              }
              this.buttonStates[gamepad.index][j] = true;
            }

            // Button pressed event
            this.dispatchEvent(new CustomEvent(GamepadController.Pressed,{
              detail: [gamepad.index,j,button.value]
            }));
          } else {
            // Button released
            if (!this.buttonStates[gamepad.index]) {
              this.buttonStates[gamepad.index] = [];
            }
            this.buttonStates[gamepad.index][j] = false;
          }
        }

        // Check axis movements
        for (let k = 0; k < gamepad.axes.length; k++) {
          this.dispatchEvent(new CustomEvent(GamepadController.AxisMove,{
            detail: [gamepad.index,k,gamepad.axes[k]]
          }));
        }
      }
    }

    requestAnimationFrame(() => this.updateGamepadStatus());
  }
}

function dispatchKeyDownEvent(key) {
  const keyboardEvent = new KeyboardEvent("keydown",{
    key: key,
    code: `Key${key.toUpperCase()}`,
    keyCode: key.toUpperCase().charCodeAt(0),
    charCode: 0,
    bubbles: true,
    cancelable: true,
    composed: true
  });

  document.dispatchEvent(keyboardEvent);
}

let commentContainer = null;

function scrollComments(axisValue) {
  if (commentContainer && document.contains(commentContainer)) {
    let scale = 0

    if(axisValue<=0.2){
        scale = 1
    } else if (0.2 < axisValue && axisValue <= 0.4) {
      scale = 2
    } else if (0.4 < axisValue && axisValue <= 0.6) {
      scale = 3
    } else if (0.6 < axisValue && axisValue <= 0.8) {
      scale = 4
    } else {
      scale = 5
    }

    commentContainer.scrollBy(0,scale * axisValue);
  } else {
    commentContainer = document.querySelector(".comment-mainContent");
  }
}

// Create gamepad controller instance
const gamepadController = new GamepadController();

console.log("Gamepad controller initialized",gamepadController);

// Add event listeners
gamepadController.addEventListener(GamepadController.Pressed,({ detail }) => {
  const [gamepadIndex,buttonIndex,value] = detail;
  console.log(`Button ${buttonIndex} pressed on gamepad ${gamepadIndex} with value ${value}`);
});

gamepadController.addEventListener(GamepadController.Keydown,({ detail }) => {
  const [gamepadIndex,buttonIndex,value] = detail;
  console.log(`Button ${buttonIndex} keydown on gamepad ${gamepadIndex} with value ${value}`);

  switch (buttonIndex) {
    case 12: // Up
      console.log("上");
      dispatchKeyDownEvent("w");
      break;
    case 13: // Down
      console.log("下");
      dispatchKeyDownEvent("s");
      break;
    case 14: // Left
      console.log("左");
      dispatchKeyDownEvent("a");
      break;
    case 15: // Right
      console.log("右");
      dispatchKeyDownEvent("d");
      break;
    case 4: // Other button
      dispatchKeyDownEvent("x");
      break;
  }
});

gamepadController.addEventListener(GamepadController.AxisMove,({ detail }) => {
  const [gamepadIndex,axisIndex,value] = detail;

  if (Math.abs(value) < 0.1) return;

  console.log(`Axis ${axisIndex} moved on gamepad ${gamepadIndex} with value ${value}`);

  // Only handle axis 1 (typically left joystick vertical movement)
  if (axisIndex === 1) {
    scrollComments(value);
  }
});
})()
;