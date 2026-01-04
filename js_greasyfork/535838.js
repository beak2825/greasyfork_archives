/**
 * @extends {HTMLElement}
 */
class InputNumber extends HTMLElement {
  #minus;
  #input;
  #plus;
  constructor() {
    super();
    this.min = 0.1;
    this.max = 300;
    this.step = 0.1;
    this.value = 1;

    this.#minus = document.createElement("button");
    this.#input = document.createElement("input");
    this.#plus = document.createElement("button");
    this.#minus.classList.add(
      "number-input__button",
      "number-input__button--minus"
    );
    this.#minus.type = "button";
    this.#input.classList.add("number-input__input");
    this.#plus.classList.add(
      "number-input__button",
      "number-input__button--plus"
    );
    this.#plus.type = "button";
    const shadowRoot = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
        .number-input__button {
            width: 32px;
            height: 34px;
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
        :host {
            box-sizing: border-box;
            display: inline-flex;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            overflow: hidden;
            transition: all 0.25s linear;
        }
        :host(:hover) {
            box-shadow: 0 0 0 1px #dbe6f1;
        }
        :host(:focus-within) {
            box-shadow: 0 0 0 1px #409effd9;
            transition: all 0.25s linear;
        }
        .number-input__input:disabled {
            background: #f5f7fa;
            cursor: not-allowed;
        }`;
    shadowRoot.append(style, this.#minus, this.#input, this.#plus);
  }
  connectedCallback() {
    this.init();
  }
  attributeChangedCallback() {
    // update value
  }
  init() {
    this.#input.value = this.value;
    this.updateButtonState();

    // 绑定事件
    this.#minus.addEventListener("click", () => this.changeValue(-this.step));
    this.#plus.addEventListener("click", () => this.changeValue(this.step));
    this.#input.addEventListener("change", () => this.validateInput());
    this.#input.addEventListener("keydown", (e) => this.handleKeydown(e));
  }
  changeValue(delta) {
    // 避免浮点运算不准确
    const newValue = (this.value * 10 + delta * 10) / 10;
    this.value = Math.max(this.min, Math.min(this.max, newValue));
    console.log(this.value);
    this.#input.value = Number.isInteger(this.value)
      ? this.value
      : this.value.toFixed(1);
    this.updateButtonState();
  }
  validateInput() {
    let value = parseFloat(this.#input.value);
    if (isNaN(value)) {
      value = this.min;
    }
    this.value = Math.max(this.min, Math.min(this.max, value));
    this.#input.value = Number.isInteger(this.value)
      ? this.value
      : this.value.toFixed(1);
    // GM_setValue("redirectInterval", this.#input.value);
    this.updateButtonState();
  }
  updateButtonState() {
    this.#minus.disabled = this.value <= this.min;
    this.#plus.disabled = this.value >= this.max;
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
customElements.define("input-number", InputNumber);
