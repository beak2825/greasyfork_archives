// ==UserScript==
// @match       <all_urls> 
// @description Read your favorite ebook at work, with less chance to get fired.
// @name        sneaky_read.js
// @run-at      document-idle
// @version     0.0.1
// @namespace https://greasyfork.org/users/237261
// @downloadURL https://update.greasyfork.org/scripts/405179/sneaky_readjs.user.js
// @updateURL https://update.greasyfork.org/scripts/405179/sneaky_readjs.meta.js
// ==/UserScript==

console.log("[Sneaky Read Online]");

class DisplayManager {
    constructor(content) {
        this.lines = content.split("\n");
        this.lineIDX = 0;
        this.lineCount = this.lines.length;
        this.initForThisLine();
        this.display();
    }
    initForThisLine() {
        this.charIDX = 0;
        this.charCount = this.lines[this.lineIDX].length;
    }
    nextLine() {
        if (this.lineIDX < this.lineCount - 1) {
            ++this.lineIDX;
            this.initForThisLine();
            this.display();
        }
    }
    previousLine() {
        if (this.lineIDX > 0) {
            --this.lineIDX;
            this.initForThisLine();
            this.display();
        }
    }
    left() {
        if (this.charIDX > 0) {
            --this.charIDX;
            this.display();
        }
    }
    right() {
        if (this.charIDX < this.charCount - 1) {
            ++this.charIDX;
            this.display();
        }
    }
    display() {
        document.title = this.lines[this.lineIDX].slice(this.charIDX, this.charCount);
    }
}

const getLoader = () => {
    const loader = document.createElement("input");
    loader.type = "file";
    loader.style = "display:none";
    const onLoad = async e => {
        const [file] = e.target.files;
        const content = await file.text();
        const displayManager = new DisplayManager(content);
        const sneakyReadDisplayControl = e => {
            switch (e.code) {
                case "KeyS":
                case "KeyJ":
                case "ArrowDown":
                    displayManager.nextLine();
                    break;
                case "KeyW":
                case "KeyK":
                case "ArrowUp":
                    displayManager.previousLine();
                    break;
                case "KeyA":
                case "KeyH":
                case "ArrowLeft":
                    displayManager.left();
                    break;
                case "KeyD":
                case "KeyL":
                case "ArrowRight":
                    displayManager.right();
                    break;
                default:
                    break;
            }
        };
        if (!document.body.sneakyReadIsConfigured) {
            document.body.addEventListener("keydown", sneakyReadDisplayControl);
            document.body.sneakyReadIsConfigured = true;
        }
    };
    loader.addEventListener("change", onLoad);
    return loader;
};

const getButton = loader => {
    const button = document.createElement("button");
    button.textContent = "sneaky read";
    button.style.cssText = "position: fixed; margin: 3px; bottom: 0; left: 0; z-index: 99999; background-color: transparent; color: lightyellow; width: 100px; height: 100px; border-radius: 50px; font-size: 20px; display: flex; justify-content: center; align-items: center; border: 1px solid transparent;";
    button.onmouseover = (e) =>
        e.target.style.background = "salmon";
    button.onmouseout = (e) =>
        e.target.style.background = "transparent";
    button.addEventListener("click", _ => loader.click());
    return button;
};

const render = doms => {
    const fragment = document.createDocumentFragment();
    doms.map(dom => fragment.appendChild(dom));
    document.body.appendChild(fragment);
};

const init = async () => {
    const loader = getLoader();
    const button = getButton(loader);
    render([loader, button]);
};

init().catch(console.debug);
