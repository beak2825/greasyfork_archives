/**
 * @extends {HTMLElement}
 */
class FloatButton extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      :host {
        /* 避免外部css的影响 */
        all: initial;
        font-size: normal;
        position: fixed;
        left: 5px;
        top: 20%;
        transform: translateY(-50%);
        z-index: 1000;
      }
      .float-button {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background:rgba(251, 114, 153, 0.75);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .float-button:hover {
        background: #fb7299;
        transform: scale(1.1);
      }
      .panel {
        position: absolute;
        display: flex;
        left: 50px;
        top: 0;
        gap: 9px;
        justify-content: center;
 
        flex-wrap: wrap;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        width: 200px;
        padding: 10px;
        opacity: 0;
        transform: translateX(-20px);
        transition: all 0.3s ease;
        pointer-events: none;
      }
      .panel.open {
        opacity: 1;
        transform: translateX(0);
        pointer-events: all;
      }
      .close {
        transform: rotate(180deg);
      }`;
    shadowRoot.innerHTML = `
    <button class="float-button">+</button>
      <div class="panel">
        <div class="input-group">
        <slot name="interval-faster">Widget Missing</slot>
        </div>
        <div class="input-group">
        <slot name="interval-slower">Widget Missing</slot>
        </div>
      </div>`;
    shadowRoot.append(style);
    const floatBtn = shadowRoot.querySelector(".float-button");
    const panel = shadowRoot.querySelector(".panel");

    floatBtn.addEventListener("click", () => {
      panel.classList.toggle("open");
      floatBtn.classList.toggle("close");
    });
  }
}
customElements.define("float-button", FloatButton);
