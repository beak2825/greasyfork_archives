(function () {
  function addStyle(style) {
    const $style = document.createElement("style");
    document.head.appendChild($style);
    $style.innerHTML = style;
  }

  class GM_Gallery {
    #storageKey = "gallery_mode";
    #gallery_mode = false;
    #gallery;

    constructor({ getGallery }) {
      this.#gallery_mode = localStorage.getItem(this.#storageKey) === "on";

      if (this.#gallery_mode) {
        this.#gallery = getGallery();
        this.#initHead();
        this.#initBody();
        this.#initProgress();
        this.#initPreview();
        this.#initStyle();
      }

      this.#initSwitch();
    }

    #initHead() {
      // head只保留title，保存页面时不会下载一堆乱七八糟的css和js
      document.head.innerHTML = `<title>${document.title}</title>`;
    }

    #initBody() {
      document.body.innerHTML = `
        <!-- 图片列表 -->
        <div id="gallery">
          ${this.#gallery
            .map((src, index) => {
              return `
                <span class="item" data-index="${index}">
                  <img src="${src}" onload="window.onImgLoaded()">
                  <div style="text-align: center;">${index + 1}</div>
                </span>
              `;
            })
            .join("")}
        </div>

        <!-- 加载进度 -->
        <div id="progress">0/${this.#gallery.length}</div>

        <!-- 大图预览 -->
        <div id="mask">
          <img id="preview">
          <span data-action="close">❌</span>
          <span data-action="show_prev">⮜</span>
          <span data-action="show_next">⮞</span>
          <div id="index"></div>
          <div id="actions">
            <span data-action="rotate_left">⤹</span>
            <span data-action="rotate_right">⤸</span>
            <span data-action="zoom_out">➖</span>
            <span data-action="zoom_in">➕</span>
          </div>
        </div>
      `;

      document.body.parentElement.scrollTop = 0;
    }

    #initProgress() {
      const $progress = document.querySelector("#progress");
      let loaded = 0;

      document.querySelectorAll("#gallery img").forEach(($img) => {
        $img.onload = () => {
          $progress.innerHTML = `${++loaded} / ${this.#gallery.length}`;
        };
      });
    }

    #initPreview() {
      const gallery = this.#gallery;
      const $mask = document.querySelector("#mask");
      const $preview = document.querySelector("#preview");
      const $index = document.querySelector("#index");
      const $prev = document.querySelector('[data-action="show_prev"]');
      const $next = document.querySelector('[data-action="show_next"]');

      const preview = {
        _rotate: 0,
        set rotate(v) {
          $preview.style.rotate = `${(this._rotate = v)}deg`;
        },
        get rotate() {
          return this._rotate;
        },
        rotate_left() {
          this.rotate -= 90;
        },
        rotate_right() {
          this.rotate += 90;
        },

        _scale: 1,
        set scale(v) {
          $preview.style.scale = `${(this._scale = v)}`;
        },
        get scale() {
          return this._scale;
        },
        zoom_out() {
          this.scale *= 0.8;
        },
        zoom_in() {
          this.scale *= 1.2;
        },

        _index: 0,
        set index(v) {
          this.reset();
          this._index = v;
          $preview.src = gallery[v];
          $index.textContent = `${v + 1} / ${gallery.length}`;
          $mask.scrollTop = 0;
          $prev.classList.toggle("disabled", v === 0);
          $next.classList.toggle("disabled", v === gallery.length - 1);
        },
        get index() {
          return this._index;
        },
        show_prev() {
          if (this.index > 0) {
            this.index -= 1;
          }
        },
        show_next() {
          if (this.index < gallery.length - 1) {
            this.index += 1;
          }
        },

        reset() {
          this.rotate = 0;
          this.scale = 1;
          $preview.style.top = "";
          $preview.style.left = "";
        },

        close() {
          document.body.parentElement.classList.remove("is-preview");
          window.removeEventListener("keydown", onkeydown);
          $preview.src = "#";
          this.reset();
        },
      };

      $preview.onload = () => {
        setTimeout(() => {
          const rect = $preview.getBoundingClientRect();
          $preview.style.top = `${rect.y}px`;
          $preview.style.left = `${rect.x}px`;
        }, 400);
      };

      $mask.onmousewheel = (e) => {
        if (e.deltaY < 0) preview.zoom_in();
        else preview.zoom_out();
      };

      $mask.onclick = (e) => {
        const action = e.target.dataset.action;
        if (action) preview[action]?.();
      };

      function onkeydown(e) {
        switch (e.code) {
          case "ArrowLeft":
            preview.show_prev();
            break;
          case "ArrowRight":
            preview.show_next();
            break;
          case "Escape":
            preview.close();
            break;
        }
      }

      let cache = { px: 0, py: 0, ex: 0, ey: 0 };
      $mask.onmousedown = (e) => {
        cache = {
          ex: e.x,
          ey: e.y,
          px: parseInt($preview.style.left),
          py: parseInt($preview.style.top),
        };
        window.addEventListener("mousemove", onmousemove);
        window.addEventListener("mouseup", onmouseup);
      };
      function onmousemove(e) {
        $preview.style.left = `${cache.px + e.x - cache.ex}px`;
        $preview.style.top = `${cache.py + e.y - cache.ey}px`;
      }
      function onmouseup() {
        window.removeEventListener("mousemove", onmousemove);
        window.removeEventListener("mouseup", onmouseup);
      }

      document.querySelector("#gallery").onclick = (e) => {
        if (e.target.dataset.index) {
          document.body.parentElement.classList.add("is-preview");
          window.addEventListener("keydown", onkeydown);
          const index = parseInt(e.target.dataset.index);
          preview.index = index;
        }
      };
    }

    #initSwitch() {
      const $switch = document.createElement("div");
      document.body.appendChild($switch);
      $switch.textContent = `画廊模式：${this.#gallery_mode ? "开" : "关"}`;
      $switch.id = `gallery_mode_switch`;
      $switch.onclick = () => {
        if (this.#gallery_mode) localStorage.removeItem(this.#storageKey);
        else localStorage.setItem(this.#storageKey, "on");
        location.reload();
      };

      addStyle(`
        #gallery_mode_switch {
          z-index: 1000;
          position: fixed;
          right: 10px;
          top: 10px;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.8);
          color: #fff;
          font-size: 16px;
          user-select: none;
          opacity: 0.5;
          transition: all 0.3s;

          &:hover {
            opacity: 1;
          }
        }
      `);
    }

    #initStyle() {
      addStyle(`
        * {
          user-select: none;
          -webkit-user-drag: none;
        }

        #gallery {
          display: flex;
          flex-flow: row wrap;
          gap: 10px;
          padding: 50px 0;

          & .item {
            align-self: flex-end;
            cursor: pointer;

            & * {
              pointer-events: none;
            }

            & img {
              width: 100px;
              min-width: 100px;
              min-height: 100px;
              object-fit: contain;
              background-color: #ccc;
              transition: all 0.1s;
              border: 0.5px solid #ccc;
            }

            &:hover img {
              opacity: 0.5;
            }
          }
        }

        #progress, #index {
          position: fixed;
          left: 10px;
          bottom: 10px;
          background-color: rgba(0, 0, 0, 0.8);
          color: #fff;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 16px;
          opacity: 0.5;
          pointer-events: none;
        }

        #mask {
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

          & #preview {
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
            top: 50%
          }
          & [data-action="show_next"] {
            position: absolute;
            right: 10px;
            top: 50%
          }
          
          #index {
            left: 50%;
            transform: translateX(-50%);
          }

          & #actions {
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
            
            & * {
              pointer-events: none;
            }

            &:hover {
              opacity: 1;
            }

            &.disabled {
              pointer-events: none;
              opacity: 0.2;
            }
          }
        }

        html.is-preview {
          overflow: hidden;

          & :is(#progress, #gallery_mode_switch) {
            display: none;
          }

          & #mask {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `);
    }
  }

  window.GM_Gallery = GM_Gallery;
})();
