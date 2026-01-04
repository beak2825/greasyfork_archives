(function () {
  class GM_Preview {
    $mask;
    $img;
    $index;
    $prev;
    $next;

    #srcList = [];
    #index = 0;
    #rotate = 0;
    #scale = 1;

    constructor() {
      this.#initStyle();
      this.#initElements();
      this.#initImg();
      this.#initActions();
      this.#initZoom();
      this.#initMove();
    }

    show(srcList, index) {
      this.#srcList = srcList;
      this.#index = index;
      this.#update();
      document.body.parentElement.classList.add("GM_Preview");
      window.addEventListener("keydown", (this.#onkeydown = this.onkeydown.bind(this)));
    }
    show_prev() {
      if (this.#index > 0) {
        this.#index -= 1;
        this.#update();
      }
    }
    show_next() {
      if (this.#index < this.#srcList.length - 1) {
        this.#index += 1;
        this.#update();
      }
    }
    #update() {
      this.resetTransform();
      this.$img.src = this.#srcList[this.#index];
      this.$index.textContent = `${this.#index + 1} / ${this.#srcList.length}`;
      this.$prev.classList.toggle("disabled", this.#index === 0);
      this.$next.classList.toggle("disabled", this.#index === this.#srcList.length - 1);
    }

    close() {
      document.body.parentElement.classList.remove("GM_Preview");
      window.removeEventListener("keydown", this.#onkeydown);
      this.$img.src = "#";
      this.resetTransform();
    }

    #onkeydown;
    onkeydown(e) {
      switch (e.code) {
        case "ArrowLeft":
          this.show_prev();
          break;
        case "ArrowRight":
          this.show_next();
          break;
        case "Escape":
          this.close();
          break;
      }
    }

    set rotate(v) {
      this.$img.style.rotate = `${(this.#rotate = v)}deg`;
    }
    get rotate() {
      return this.#rotate;
    }
    rotate_left() {
      this.rotate -= 90;
    }
    rotate_right() {
      this.rotate += 90;
    }

    set scale(v) {
      this.$img.style.scale = `${(this.#scale = v)}`;
    }
    get scale() {
      return this.#scale;
    }
    zoom_out() {
      this.scale *= 0.8;
    }
    zoom_in() {
      this.scale *= 1.2;
    }

    resetTransform() {
      this.rotate = 0;
      this.scale = 1;
      this.$img.style.top = "";
      this.$img.style.left = "";
    }

    #initImg() {
      this.$img.onload = () => {
        setTimeout(() => {
          const rect = this.$img.getBoundingClientRect();
          this.$img.style.top = `${rect.y}px`;
          this.$img.style.left = `${rect.x}px`;
        }, 400);
      };
    }

    #initActions() {
      this.$mask.onclick = (e) => {
        const action = e.target.dataset.action;
        if (action) this[action]();
      };
    }

    #initZoom() {
      this.$mask.onmousewheel = (e) => {
        if (e.deltaY < 0) this.zoom_in();
        else this.zoom_out();
      };
    }

    #initMove() {
      let cache = { px: 0, py: 0, ex: 0, ey: 0 };
      this.$mask.onmousedown = (e) => {
        cache = {
          ex: e.x,
          ey: e.y,
          px: parseInt(this.$img.style.left),
          py: parseInt(this.$img.style.top),
        };
        window.addEventListener("mousemove", onmousemove);
        window.addEventListener("mouseup", onmouseup);
      };
      const onmousemove = (e) => {
        this.$img.style.left = `${cache.px + e.x - cache.ex}px`;
        this.$img.style.top = `${cache.py + e.y - cache.ey}px`;
      };
      const onmouseup = () => {
        window.removeEventListener("mousemove", onmousemove);
        window.removeEventListener("mouseup", onmouseup);
      };
    }

    #initElements() {
      const div = document.createElement("div");
      div.id = "GM_Preview_Mask";
      div.innerHTML = `
        <img id="GM_Preview_Img">
        <span data-action="close">❌</span>
        <span data-action="show_prev">⮜</span>
        <span data-action="show_next">⮞</span>
        <div id="GM_Preview_Index"></div>
        <div id="GM_Preview_Actions">
          <span data-action="rotate_left">⤹</span>
          <span data-action="rotate_right">⤸</span>
          <span data-action="zoom_out">➖</span>
          <span data-action="zoom_in">➕</span>
        </div>
      `;
      document.body.appendChild(div);

      this.$mask = div;
      this.$img = div.querySelector("#GM_Preview_Img");
      this.$index = div.querySelector("#GM_Preview_Index");
      this.$prev = div.querySelector('[data-action="show_prev"]');
      this.$next = div.querySelector('[data-action="show_next"]');
    }

    #initStyle() {
      const style = document.createElement("style");
      style.innerHTML = `
        #GM_Preview_Mask {
          & * {
            user-select: none;
            -webkit-user-drag: none;
          }

          z-index: 1001;
          display: none;
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          overflow: hidden;
          cursor: grab;

          &:active {
            cursor: grabbing;
          }

          & #GM_Preview_Img {
            position: absolute;
            object-fit: contain;
            max-width: 100%;
            max-height: 100%;
            border: 0.5px solid #ccc;
            pointer-events: none;
            transition: rotate 0.3s, scale 0.3s;
          }

          & [data-action="close"] {
            position: absolute;
            right: 10px;
            top: 10px;
          }
          & [data-action="show_prev"] {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
          }
          & [data-action="show_next"] {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
          }

          & #GM_Preview_Index {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            bottom: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 16px;
            opacity: 0.5;
            pointer-events: none;
          }

          & #GM_Preview_Actions {
            position: absolute;
            right: 10px;
            bottom: 10px;
          }

          & [data-action] {
            border-radius: 4px;
            padding: 4px;
            cursor: pointer;
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            font-size: 16px;
            line-height: 16px;
            opacity: 0.5;
            transition: all 0.3s;
            display: inline-block;
            width: 32px;
            height: 32px;
            text-align: center;
            align-content: center;

            &:hover {
              opacity: 1;
            }

            &.disabled {
              pointer-events: none;
              opacity: 0.2;
            }
          }
        }

        html.GM_Preview {
          overflow: hidden;

          & #GM_Preview_Mask {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  window.GM_Preview = GM_Preview;
})();
