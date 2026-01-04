// AMQ Window Script
// This code is fetched automatically
// Do not attempt to add it to tampermonkey

if (typeof Listener === "undefined") return;
windowSetup();

class AMQWindow {
    constructor(data) {
        this.id = data.id === undefined ? "" : data.id;
        this.title = data.title === undefined ? "Window" : data.title;
        this.resizable = data.resizable === undefined ? false : data.resizable;
        this.draggable = data.draggable === undefined ? false : data.draggable;
        this.width = data.width === undefined ? 200 : data.width;
        this.height = data.height === undefined ? 300 : data.height;
        this.minWidth = data.minWidth === undefined ? 200 : data.minWidth;
        this.minHeight = data.minHeight === undefined ? 300: data.minHeight;
        this.position = data.position === undefined ? {x: 0, y: 0} : data.position;
        this.closeHandler = data.closeHandler === undefined ? function () {} : data.closeHandler;
        this.zIndex = data.zIndex === undefined ? 1060 : data.zIndex;
        this.resizers = null;
        this.panels = [];

        this.window = $("<div></div>")
            .addClass("customWindow")
            .addClass(data.class === undefined ? "" : data.class)
            .attr("id", this.id)
            .css("position", "absolute")
            .css("z-index", this.zIndex.toString())
            .offset({
                top: this.position.y !== undefined ? this.position.y : 0,
                left: this.position.x !== undefined ? this.position.x : 0
            })
            .height(this.height)
            .width(this.width)

        this.content = $(`<div class="customWindowContent"></div>`);

        this.header = $("<div></div>")
            .addClass("modal-header customWindowHeader")
            .addClass(this.draggable === true ? "draggableWindow" : "")
            .append($(`<div class="close" type="button"><span aria-hidden="true">×</span></div>`)
                .click(() => {
                    this.close(this.closeHandler);
                })
            )
            .append($("<h2></h2>")
                .addClass("modal-title")
                .text(this.title)
            )

        this.body = $(`<div class="modal-body customWindowBody"></div>`)
            .addClass(this.resizable === true ? "resizableWindow" : "")
            .height(this.height - 75);

        if (this.resizable === true) {
            this.resizers = $(
                `<div class="windowResizers">
                    <div class="windowResizer top-left"></div>
                    <div class="windowResizer top-right"></div>
                    <div class="windowResizer bottom-left"></div>
                    <div class="windowResizer bottom-right"></div>
                </div>`
            );
        }

        this.content.append(this.header);
        this.content.append(this.body);
        if (this.resizers !== null) {
            this.window.append(this.resizers);
            let tmp = this;
            let startWidth = 0;
            let startHeight = 0;
            let startX = 0;
            let startY = 0;
            let startMouseX = 0;
            let startMouseY = 0;
            this.resizers.find(".windowResizer").each(function (index, resizer) {
                $(resizer).mousedown(function (event) {
                    tmp.window.css("user-select", "none");
                    startWidth = tmp.window.width();
                    startHeight = tmp.window.height();
                    startX = tmp.window.position().left;
                    startY = tmp.window.position().top;
                    startMouseX = event.originalEvent.clientX;
                    startMouseY = event.originalEvent.clientY;
                    let curResizer = $(this);
                    $(document.documentElement).mousemove(function (event) {
                        if (curResizer.hasClass("bottom-right")) {
                            let newWidth = startWidth + (event.originalEvent.clientX - startMouseX);
                            let newHeight = startHeight + (event.originalEvent.clientY - startMouseY);
                            if (newWidth > tmp.minWidth) {
                                tmp.window.width(newWidth);
                            }
                            if (newHeight > tmp.minHeight) {
                                tmp.body.height(newHeight - 103);
                                tmp.window.height(newHeight);
                            }
                        }
                        if (curResizer.hasClass("bottom-left")) {
                            let newWidth = startWidth - (event.originalEvent.clientX - startMouseX);
                            let newHeight = startHeight + (event.originalEvent.clientY - startMouseY);
                            let newLeft = startX + (event.originalEvent.clientX - startMouseX);
                            if (newWidth > tmp.minWidth) {
                                tmp.window.width(newWidth);
                                tmp.window.css("left", newLeft + "px");
                            }
                            if (newHeight > tmp.minHeight) {
                                tmp.body.height(newHeight - 103);
                                tmp.window.height(newHeight);
                            }
                        }
                        if (curResizer.hasClass("top-right")) {
                            let newWidth = startWidth + (event.originalEvent.clientX - startMouseX);
                            let newHeight = startHeight - (event.originalEvent.clientY - startMouseY);
                            let newTop = startY + (event.originalEvent.clientY - startMouseY);
                            if (newWidth > tmp.minWidth) {
                                tmp.window.width(newWidth);
                            }
                            if (newHeight > tmp.minHeight) {
                                tmp.window.css("top", newTop + "px");
                                tmp.body.height(newHeight - 103);
                                tmp.window.height(newHeight);
                            }
                        }
                        if (curResizer.hasClass("top-left")) {
                            let newWidth = startWidth - (event.originalEvent.clientX - startMouseX);
                            let newHeight = startHeight - (event.originalEvent.clientY - startMouseY);
                            let newLeft = startX + (event.originalEvent.clientX - startMouseX);
                            let newTop = startY + (event.originalEvent.clientY - startMouseY);
                            if (newWidth > tmp.minWidth) {
                                tmp.window.width(newWidth);
                                tmp.window.css("left", newLeft + "px");
                            }
                            if (newHeight > tmp.minHeight) {
                                tmp.window.css("top", newTop + "px");
                                tmp.body.height(newHeight - 103);
                                tmp.window.height(newHeight);
                            }
                        }
                    });
                    $(document.documentElement).mouseup(function (event) {
                        $(document.documentElement).off("mousemove");
                        $(document.documentElement).off("mouseup");
                        tmp.window.css("user-select", "text");
                    });
                });
            });
        }
        if (this.draggable === true) {
            this.window.draggable({
                handle: this.header,
                containment: "#gameContainer"
            });
        }

        this.window.append(this.content);
        $("#gameContainer").append(this.window);
    }

    setId(newId) {
        this.id = newId;
        this.window.attr("id", this.id);
    }

    addClass(newClass) {
        this.window.addClass(newClass);
    }

    removeClass(removedClass) {
        this.window.removeClass(removedClass);
    }

    setWidth(newWidth) {
        this.width = newWidth;
        this.window.width(this.width);
    }

    setTitle(newTitle) {
        this.title = newTitle;
        this.header.find(".modal-title").text(newTitle);
    }

    setZIndex(newZIndex) {
        this.zIndex = newZIndex;
        this.window.css("z-index", this.zIndex.toString());
    }

    isVisible() {
        return this.window.is(":visible");
    }

    clear() {
        this.body.children().remove();
    }

    open() {
        this.window.show();
    }

    open(handler) {
        this.window.show();
        if (handler !== undefined) {
            handler();
        }
    }

    close() {
        this.window.hide();
    }

    close(handler) {
        this.window.hide();
        if (handler !== undefined) {
            handler();
        }
    }

    addPanel(data) {
        let newPanel = new AMQWindowPanel(data);
        this.panels.push(newPanel);
        this.body.append(newPanel.panel);
    }
}

class AMQWindowPanel {
    constructor(data) {
        this.id = data.id === undefined ? "" : data.id;
        this.width = data.width === undefined ? 200 : data.width;
        this.height = data.height === undefined ? 300 : data.height;
        this.position = data.position === undefined ? {x: 0, y: 0} : data.position;
        this.scrollable = data.scrollable === undefined ? {x: false, y: false} : data.scrollable;
        this.panels = [];

        this.panel = $("<div></div>")
            .addClass("customWindowPanel")
            .addClass(data.class === undefined ? "" : data.class)
            .attr("id", this.id)
            .css("position", "absolute")

        this.updateWidth();
        this.updateHeight();
        this.updatePosition();
        this.updateScrollable();
    }

    setId(newId) {
        this.id = newId;
        this.panel.attr("id", this.id);
    }

    addClass(newClass) {
        this.panel.addClass(newClass);
    }

    removeClass(removedClass) {
        this.panel.removeClass(removedClass);
    }

    setWidth(newWidth) {
        this.width = newWidth;
        this.updateWidth();
    }

    setHeight(newHeight) {
        this.height = newHeight;
        this.updateHeight();
    }

    updateWidth() {
        if (typeof this.width === "string") {
            this.panel.css("width", this.width);
        }
        else if (parseFloat(this.width) >= 0.0 && parseFloat(this.width) <= 1.0) {
            this.panel.css("width", (parseFloat(this.width) * 100) + "%");
        }
        else {
            this.panel.width(parseInt(this.width));
        }
    }

    updateHeight() {
        if (typeof this.height === "string") {
            this.panel.css("height", this.height);
        }
        else if (parseFloat(this.height) >= 0.0 && parseFloat(this.height) <= 1.0) {
            this.panel.css("height", (parseFloat(this.height) * 100) + "%");
        }
        else {
            this.panel.height(parseInt(this.height));
        }
    }

    setPositionX(newPositionX) {
        this.position.x = newPositionX;
        this.updatePosition();
    }

    setPositionY(newPositionY) {
        this.position.y = newPositionY;
        this.updatePosition();
    }

    setPosition(newPosition) {
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
        this.updatePosition();
    }

    updatePosition() {
        if (typeof this.position.x === "string") {
            this.panel.css("left", this.position.x);
        }
        else if (parseFloat(this.position.x) >= 0.0 && parseFloat(this.position.x) <= 1.0) {
            this.panel.css("left", (parseFloat(this.position.x) * 100) + "%");
        }
        else {
            this.panel.css("left", parseInt(this.position.x) + "px");
        }

        if (typeof this.position.y === "string") {
            this.panel.css("top", this.position.y);
        }
        else if (parseFloat(this.position.y) >= 0.0 && parseFloat(this.position.y) <= 1.0) {
            this.panel.css("top", (parseFloat(this.position.y) * 100) + "%");
        }
        else {
            this.panel.css("top", parseInt(this.position.y) + "px");
        }
    }

    setScrollableX(newScrollableX) {
        this.scrollable.x = newScrollableX;
        this.updateScrollable();
    }

    setScrollableY(newScrollableY) {
        this.scrollable.y = newScrollableY;
        this.updateScrollable();
    }

    updateScrollable() {
        this.panel.css("overflow-x", this.scrollable.x === true ? "auto" : "hidden");
        this.panel.css("overflow-y", this.scrollable.y === true ? "auto" : "hidden");
    }

    show() {
        this.panel.show();
    }

    show(handler) {
        this.show();
        handler();
    }

    hide() {
        this.panel.hide();
    }

    hide(handler) {
        this.hide();
        handler();
    }

    addPanel(data) {
        let newPanel = new AMQWindowPanel(data);
        this.panels.push(newPanel);
        this.panel.append(newPanel.panel);
    }

    clear() {
        this.panel.children().remove();
    }
}

function windowSetup() {
    if ($("#customWindowStyle").length) return;
    let style = document.createElement("style");
    style.type = "text/css";
    style.id = "customWindowStyle";
    style.appendChild(document.createTextNode(`
        .customWindow {
            overflow-y: hidden;
            top: 0px;
            left: 0px;
            margin: 0px;
            background-color: #424242;
            border: 1px solid rgba(27, 27, 27, 0.2);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
            user-select: text;
            display: none;
        }
        .draggableWindow {
            cursor: move;
        }
        .customWindowBody {
            width: 100%;
            overflow-y: auto;
        }
        .customWindowContent {
            width: 100%;
            position: absolute;
            top: 0px;
        }
        .customWindow .close {
            font-size: 32px;
        }
        .windowResizers {
            width: 100%;
            height: 100%;
        }
        .windowResizer {
            width: 10px;
            height: 10px;
            position: absolute;
            z-index: 100;
        }
        .windowResizer.top-left {
            top: 0px;
            left: 0px;
            cursor: nwse-resize;
        }
        .windowResizer.top-right {
            top: 0px;
            right: 0px;
            cursor: nesw-resize;
        }
        .windowResizer.bottom-left {
            bottom: 0px;
            left: 0px;
            cursor: nesw-resize;
        }
        .windowResizer.bottom-right {
            bottom: 0px;
            right: 0px;
            cursor: nwse-resize;
        }
    `));
    document.head.appendChild(style);
}