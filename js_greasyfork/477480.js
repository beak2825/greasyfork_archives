// ==UserScript==
// @name             FloatingWindow
// @version          1.2
// @grant            GM_addStyle
// @grant            GM_getValue
// @grant            GM_setValue
// @description Adds FloatingWindow
// ==/UserScript==

GM_addStyle(`
.floatingWindowContainer {
  width:200px;
  position:fixed;
  opacity:0.5;
  z-index: 9999;
}
.floatingWindowTitleBar {
  background-color:#fff;
  font-weight:bold;
  text-align:center;
  cursor:pointer;
}
.floatingWindowContainer.active {
	opacity:1;
  z-index: 10000;
}
.floatingWindowBody{
  flex-wrap:wrap;
}

`);

class FloatingWindow {
  constructor(title,settings = {}) {
    this.settings = {
      position:settings?.position || {x:window.innerWidth*0.8,y:100},
      open: settings.hasOwnProperty("open") ? settings.open : true,
      bodyDisplay:settings?.bodyDisplay || "block"
    }
    this.container = document.createElement("div");
    this.container.className = "floatingWindowContainer";
    this.container.id = title.toLowerCase().replaceAll(/\W+/g,"_");
    this.windowPosition = GM_getValue(`${this.container.id}_position`,this.settings.position);
    this.container.style.left = `${this.windowPosition.x}px`;
    this.container.style.top = `${this.windowPosition.y}px`;
    this.titleBar = document.createElement("div");
    this.titleBar.className = "floatingWindowTitleBar";
    this.titleBar.appendChild(document.createTextNode(title));
    this.titleBar.addEventListener("pointerdown",(e)=>{this.pointerDownHandler(e);});
    document.addEventListener("pointermove",(e)=>{this.pointerMoveHandler(e);});
    document.addEventListener("pointerup",(e)=>{this.pointerUpHandler(e);});
    this.container.appendChild(this.titleBar);
    this.body = document.createElement("div");
    this.body.className = "floatingWindowBody";
    this.windowOpen = GM_getValue(`${this.container.id}_open`,this.settings.open);
    if (this.windowOpen) this.container.classList.add("active");
    this.body.style.display = this.windowOpen ? this.settings.bodyDisplay : "none";
    this.container.appendChild(this.body);
    document.body.appendChild(this.container);
    this.pointerValues = {
      newPosition:null,
      positionOffset:null,
      dragging:false
    };
  }
  toggleWindow() {
    this.windowOpen = !this.windowOpen;
    this.container.classList.toggle("active");
    GM_setValue(`${this.container.id}_open`,this.windowOpen);
    this.body.style.display = this.windowOpen ? this.settings.bodyDisplay : "none";
  }
  pointerDownHandler(e) {
    this.pointerValues.positionOffset = {
      x:e.clientX - this.windowPosition.x,
      y:e.clientY - this.windowPosition.y
    };
  }
  pointerMoveHandler(e) {
    if (this.pointerValues.positionOffset) {
      e.preventDefault()
      this.pointerValues.newPosition = {
        x:e.clientX - this.pointerValues.positionOffset.x,
        y:e.clientY - this.pointerValues.positionOffset.y
      };
      if (!this.pointerValues.dragging) {
        if (
          Math.abs(e.clientX - this.windowPosition.x) > 10 ||
          Math.abs(e.clientY - this.windowPosition.y) > 10
        ) this.pointerValues.dragging = true;
      } else {
        this.container.style.left = `${this.pointerValues.newPosition.x}px`;
        this.container.style.top = `${this.pointerValues.newPosition.y}px`;
      }
    }
  }
  pointerUpHandler(e) {
    if (this.pointerValues.positionOffset) {
      if (this.pointerValues.dragging) {
        this.pointerValues.newPosition = {
          x:e.clientX - this.pointerValues.positionOffset.x,
          y:e.clientY - this.pointerValues.positionOffset.y
        };
        this.container.style.left = `${this.pointerValues.newPosition.x}px`;
        this.container.style.top = `${this.pointerValues.newPosition.y}px`;
        this.windowPosition = this.pointerValues.newPosition;
        GM_setValue(`${this.container.id}_position`,this.windowPosition);
      } else {
        this.toggleWindow();
      }
      this.pointerValues.dragging = false;
      this.pointerValues.newPosition = this.pointerValues.positionOffset = null;
    }

  }
}