      // ==UserScript==
      // @name        彩色滑动特效
      // @namespace    http://tampermonkey.net/
      // @version      0.7
      // @description  连续按三次ctrl键,移动鼠标即可看到效果
      // @author       wuyupei
      // @match         *://*/*
      // @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
      // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429751/%E5%BD%A9%E8%89%B2%E6%BB%91%E5%8A%A8%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/429751/%E5%BD%A9%E8%89%B2%E6%BB%91%E5%8A%A8%E7%89%B9%E6%95%88.meta.js
      // ==/UserScript==

      (function () {
        const mydiv = document.createElement('div');
        mydiv.style.width = 100 + 'vw';
        mydiv.style.height = 100 + 'vh';
        mydiv.style.position = 'fixed';
        mydiv.style.top = 0 + 'px';
        mydiv.style.left = 0 + 'px';
        mydiv.style.right = 0 + 'px';
        mydiv.style.bottom = 0 + 'px';
        mydiv.style.pointerEvents = 'none';
        mydiv.style.zIndex = '999999999999';
        document.body.appendChild(mydiv);

        const canvas = document.createElement('canvas');
        canvas.className = 'canvas';
        canvas.setAttribute('width', window.innerWidth);
        canvas.setAttribute('height', window.innerHeight);
        canvas.style.position = 'absolute';
        canvas.style.top = 0 + 'px';
        canvas.style.left = 0 + 'px';
        canvas.style.right = 0 + 'px';
        canvas.style.bottom = 0 + 'px';
        canvas.style.zIndex = '2000';
        canvas.style.pointerEvents = 'none';
        mydiv.appendChild(canvas);

        var flag = false;
        var arr = [];
        const ctx = canvas.getContext('2d');

        // 关闭指令 双击ctrl
        const target = [17, 17];
        let index = 0;
        document.addEventListener('keydown', (e) => {
          console.log(e);
          if (e.keyCode == target[index]) {
            index++;
            if (index == target.length) {
              flag = !flag
              if (flag) {
                document.addEventListener('mousemove', begindrow);
              } else {
                document.removeEventListener('mousemove', begindrow);
              }
            }
          } else {
            index = 0;
          }
        });

        const startTimer = setInterval(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (var i = 0; i < arr.length; i++) {
            arr[i].render();
            arr[i].update();
            arr[i].remove();
          }
        }, 20);

        function begindrow(e) {
          new dot(e.clientX, e.clientY, 2, 0, -1);
          new dot(e.clientX, e.clientY, 2, 0, 1)
          // new dot(e.clientX, e.clientY, 2, 1, 0)
          // new dot(e.clientX, e.clientY, 2, -1, 0)
        }

        function getColor() {
          var colorarr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
          var color = '#';
          for (var i = 0; i < 6; i++) {
            color += colorarr[Math.floor(Math.random() * colorarr.length)];
          }
          return color;
        }

        class dot {
          constructor(x, y, r, dx, dy) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.dx = dx;
            this.dy = dy;
            this._x = x;
            this._y = y;
            this.color = getColor();
            arr.push(this);
          }
        }
        dot.prototype.render = function () {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
          ctx.fillStyle = this.color;
          ctx.fill();
        };

        dot.prototype.update = function () {
          this.x += this.dx;
          this.y += this.dy;
        };

        dot.prototype.remove = function () {
          if (
            this.x - this._x >= 25 ||
            this.x - this.x <= -25 ||
            this.y - this._y >= 25 ||
            this.y - this._y <= -25
          ) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        };
      })(document);