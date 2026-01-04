const createNumberInput = function () {
  // 创建宿主元素
  const container = document.createElement("div");
  container.id = "numberInputWidget";
  // 创建 shadowRoot
  const shadowRoot = container.attachShadow({ mode: "open" });
  shadowRoot.innerHTML = `<style>
        .number-input {
            display: inline-flex;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            overflow: hidden;
        }

        .number-input__button {
            width: 32px;
            height: 32px;
            background: #f5f7fa;
            border: none;
            outline: none;
            cursor: pointer;
            position: relative;
            transition: background 0.3s;
        }

        .number-input__button:hover {
            background: #e4e7ed;
        }

        .number-input__button:disabled {
            cursor: not-allowed;
            color: #c0c4cc;
            background: #f5f7fa;
        }

        .number-input__button::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 2px;
            background: #606266;
        }

        .number-input__button--plus::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 2px;
            height: 10px;
            background: #606266;
        }

        .number-input__input {
            width: 60px;
            height: 32px;
            border: none;
            border-left: 1px solid #dcdfe6;
            border-right: 1px solid #dcdfe6;
            text-align: center;
            outline: none;
            font-size: 14px;
            color: #606266;
        }

        .number-input__input:focus {
            border-color: #409eff;
        }

        .number-input__input:disabled {
            background: #f5f7fa;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <div class="number-input" data-min="0" data-max="10" data-step="1" data-value="1">
        <button class="number-input__button number-input__button--minus" type="button"></button>
        <input type="text" class="number-input__input" value="1">
        <button class="number-input__button number-input__button--plus" type="button"></button>
    </div>`;
  class NumberInput {
    constructor(container) {
      this.container = container;
      this.input = container.querySelector(".number-input__input");
      this.min = parseFloat(container.dataset.min) || 1;
      this.max = parseFloat(container.dataset.max) || Infinity;
      this.step = parseFloat(container.dataset.step) || 1;
      this.value = parseFloat(GM_getValue("redirectInterval", 3)) || this.min;

      this.init();
    }

    init() {
      this.input.value = this.value;
      this.updateButtonState();

      // 绑定事件
      this.container
        .querySelector(".number-input__button--minus")
        .addEventListener("click", () => this.changeValue(-this.step));
      this.container
        .querySelector(".number-input__button--plus")
        .addEventListener("click", () => this.changeValue(this.step));
      this.input.addEventListener("change", () => this.validateInput());
      this.input.addEventListener("keydown", (e) => this.handleKeydown(e));
    }

    changeValue(delta) {
      const newValue = this.value + delta;
      this.value = Math.max(this.min, Math.min(this.max, newValue));
      this.input.value = Number.isInteger(this.value)
        ? this.value
        : this.value.toFixed(1);
      GM_setValue("redirectInterval", this.input.value);
      this.updateButtonState();
    }

    validateInput() {
      let value = parseFloat(this.input.value);
      if (isNaN(value)) {
        value = this.min;
      }
      this.value = Math.max(this.min, Math.min(this.max, value));
      this.input.value = Number.isInteger(this.value)
        ? this.value
        : this.value.toFixed(1);
      GM_setValue("redirectInterval", this.input.value);
      this.updateButtonState();
    }

    updateButtonState() {
      const minusBtn = this.container.querySelector(
        ".number-input__button--minus"
      );
      const plusBtn = this.container.querySelector(
        ".number-input__button--plus"
      );

      minusBtn.disabled = this.value <= this.min;
      plusBtn.disabled = this.value >= this.max;
    }

    handleKeydown(e) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        this.changeValue(this.step);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        this.changeValue(-this.step);
      }
    }
  }

  // 初始化所有数字输入框
  shadowRoot.querySelectorAll(".number-input").forEach((container) => {
    new NumberInput(container);
  });
  return container;
};
