// ==UserScript==
// @name         Google Photos Auto Delete
// @namespace    https://github.com/tranphuquy19
// @version      1.0.1
// @description  Automatically delete multiple images from Google Photos. Source: https://gist.github.com/tranphuquy19/f8eeb02c7ca4b10f3baf02093eb80085
// @author       Quy (Christian) P. TRAN
// @match        https://photos.google.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529867/Google%20Photos%20Auto%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/529867/Google%20Photos%20Auto%20Delete.meta.js
// ==/UserScript==

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  window.trustedTypes.createPolicy('default', {
    createHTML: (string, sink) => string
  });
}

class AutoDeleter {
  constructor(config = {}) {
    this.config = {
      MAX_RETRIES: 3,
      SCROLL_STEP: 1000,
      DELAY: 2000,
      SELECTORS: {
        checkboxes: '.QcpS9c.ckGgle',
        trashIcon: 'button[aria-label="Move to trash"]',
        confirmButton: 'button'
      },
      ...config
    };
    this.isRunning = false;
    this.currentIteration = 0;
    this.totalIterations = 0;
  }

  async smoothScroll() {
    return new Promise((resolve) => {
      const scrollHeight = document.documentElement.scrollHeight;
      let currentPosition = window.pageYOffset;
      const scrollStep = Math.max(scrollHeight / 10, this.config.SCROLL_STEP);

      const scroll = () => {
        currentPosition += scrollStep;
        window.scrollTo(0, currentPosition);

        if (currentPosition < scrollHeight) {
          setTimeout(scroll, 100);
        } else {
          resolve();
        }
      };

      scroll();
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async findAndClick(selector, description) {
    const elements = selector === this.config.SELECTORS.confirmButton
      ? Array.from(document.querySelectorAll(selector)).filter(btn => btn.textContent === 'Move to trash')
      : document.querySelectorAll(selector);

    if (elements.length === 0) {
      console.log(`Not found: ${description}`);
      return false;
    }

    if (elements.length > 1) {
      elements.forEach(el => el.click());
    } else {
      elements[0].click();
    }

    return true;
  }

  async performSingleDeletion() {
    try {
      await this.smoothScroll();
      await this.delay(this.config.DELAY);

      const checkboxesClicked = await this.findAndClick(
        this.config.SELECTORS.checkboxes,
        'checkboxes'
      );
      if (!checkboxesClicked) return false;
      await this.delay(this.config.DELAY);

      const trashIconClicked = await this.findAndClick(
        this.config.SELECTORS.trashIcon,
        'trash icon'
      );
      if (!trashIconClicked) return false;
      await this.delay(this.config.DELAY);

      const confirmButtonClicked = await this.findAndClick(
        this.config.SELECTORS.confirmButton,
        'confirm button'
      );
      if (!confirmButtonClicked) return false;

      return true;
    } catch (error) {
      console.error('Error during deletion:', error);
      return false;
    }
  }

  async start(times) {
    if (this.isRunning) {
      console.log('Already running!');
      return;
    }

    this.isRunning = true;
    this.currentIteration = 0;
    this.totalIterations = times;
    await this.runIteration();
  }

  stop() {
    this.isRunning = false;
    console.log('Stopping after current iteration...');
  }

  async runIteration(retryCount = 0) {
    if (!this.isRunning || this.currentIteration >= this.totalIterations) {
      this.isRunning = false;
      this.updateUI('complete');
      return;
    }

    if (retryCount >= this.config.MAX_RETRIES) {
      console.log(`Failed after ${this.config.MAX_RETRIES} retries, moving to next iteration`);
      this.currentIteration++;
      this.updateUI('running');
      await this.runIteration(0);
      return;
    }

    if (retryCount === 0) {
      this.currentIteration++;
      console.log(`Iteration ${this.currentIteration}/${this.totalIterations}`);
    } else {
      console.log(`Retry ${retryCount + 1} for iteration ${this.currentIteration}`);
    }

    const success = await this.performSingleDeletion();

    if (!success) {
      await this.delay(this.config.DELAY);
      await this.runIteration(retryCount + 1);
      return;
    }

    this.updateUI('running');
    await this.delay(this.config.DELAY);
    await this.runIteration(0);
  }

  updateUI(status) {
    const event = new CustomEvent('autoDeleterUpdate', {
      detail: {
        status,
        current: this.currentIteration,
        total: this.totalIterations
      }
    });
    window.dispatchEvent(event);
  }
}

class UIController {
  constructor() {
    this.autoDeleter = new AutoDeleter();
    this.setupUI();
    this.setupEventListeners();
    this.setupDraggable();
  }

  setupUI() {
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: '9999',
      width: '300px',
      fontFamily: 'Arial, sans-serif',
      cursor: 'move', // Thêm cursor move
      userSelect: 'none' // Prevent text selection while dragging
    });

    container.innerHTML = `
            <div id="dragHandle" style="
                padding: 10px;
                margin: -20px -20px 15px -20px;
                background: #f5f5f5;
                border-radius: 8px 8px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
            ">
                <h3 style="margin: 0; font-size: 16px;">Google Photos Auto Delete</h3>
                <div style="display: flex; gap: 10px;">
                    <button id="minimizeButton" style="
                        padding: 4px 8px;
                        background: #ddd;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    ">_</button>
                    <button id="closeButton" style="
                        padding: 4px 8px;
                        background: #ff4444;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    ">×</button>
                </div>
            </div>
            <div id="contentPanel">
                <input type="number" id="iterationCount" min="1" value="5"
                    style="width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px;">
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="startButton" style="
                        flex: 1;
                        padding: 8px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: background 0.3s;
                    ">Start</button>
                    <button id="stopButton" style="
                        flex: 1;
                        padding: 8px;
                        background: #f44336;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: background 0.3s;
                    " disabled>Stop</button>
                </div>
                <div style="
                    background: #f5f5f5;
                    padding: 10px;
                    border-radius: 4px;
                    font-size: 14px;
                ">
                    <div>Status: <span id="status">Ready</span></div>
                    <div>Progress: <span id="progress">0/0</span></div>
                </div>
            </div>
        `;

    document.body.appendChild(container);
    this.container = container;
  }

  setupDraggable() {
    const container = this.container;
    const dragHandle = container.querySelector('#dragHandle');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Lưu vị trí vào localStorage
    const savePosition = () => {
      const position = {
        x: xOffset,
        y: yOffset
      };
      localStorage.setItem('autoDeleterPosition', JSON.stringify(position));
    };

    // Khôi phục vị trí từ localStorage
    const loadPosition = () => {
      const savedPosition = localStorage.getItem('autoDeleterPosition');
      if (savedPosition) {
        const position = JSON.parse(savedPosition);
        xOffset = position.x;
        yOffset = position.y;
        setTranslate(xOffset, yOffset, container);
      }
    };

    const dragStart = (e) => {
      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }

      if (e.target === dragHandle || e.target.parentElement === dragHandle) {
        isDragging = true;
      }
    };

    const dragEnd = () => {
      isDragging = false;
      savePosition(); // Lưu vị trí khi kết thúc kéo
    };

    const drag = (e) => {
      if (isDragging) {
        e.preventDefault();

        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, container);
      }
    };

    const setTranslate = (xPos, yPos, el) => {
      el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    };

    // Mouse events
    dragHandle.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch events
    dragHandle.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);

    // Minimize/Maximize functionality
    const minimizeButton = container.querySelector('#minimizeButton');
    const contentPanel = container.querySelector('#contentPanel');
    let isMinimized = false;

    minimizeButton.addEventListener('click', () => {
      if (isMinimized) {
        contentPanel.style.display = 'block';
        minimizeButton.textContent = '_';
      } else {
        contentPanel.style.display = 'none';
        minimizeButton.textContent = '□';
      }
      isMinimized = !isMinimized;
    });

    // Close functionality
    const closeButton = container.querySelector('#closeButton');
    closeButton.addEventListener('click', () => {
      container.remove();
    });

    // Load saved position when initializing
    loadPosition();
  }

  setupEventListeners() {
    const startButton = this.container.querySelector('#startButton');
    const stopButton = this.container.querySelector('#stopButton');
    const iterationInput = this.container.querySelector('#iterationCount');

    startButton.addEventListener('click', () => {
      const count = parseInt(iterationInput.value);
      if (count > 0) {
        startButton.disabled = true;
        stopButton.disabled = false;
        this.autoDeleter.start(count);
      }
    });

    stopButton.addEventListener('click', () => {
      this.autoDeleter.stop();
      stopButton.disabled = true;
    });

    window.addEventListener('autoDeleterUpdate', (e) => {
      const statusElem = this.container.querySelector('#status');
      const progressElem = this.container.querySelector('#progress');
      const startButton = this.container.querySelector('#startButton');
      const stopButton = this.container.querySelector('#stopButton');

      progressElem.textContent = `${e.detail.current}/${e.detail.total}`;

      switch (e.detail.status) {
        case 'running':
          statusElem.textContent = 'Running';
          statusElem.style.color = '#4CAF50';
          break;
        case 'complete':
          statusElem.textContent = 'Complete';
          statusElem.style.color = '#2196F3';
          startButton.disabled = false;
          stopButton.disabled = true;
          break;
      }
    });
  }
}

// Initialize the UI
const controller = new UIController();

console.log(`
Google Photos Auto Delete Script
------------------------------
UI Controls have been added to the page.
You can:
1. Set the number of iterations
2. Click Start to begin
3. Click Stop to pause after current iteration
4. Monitor progress in the UI panel
`);
