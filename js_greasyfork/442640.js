// ==UserScript==
// @name           Sploop.io [Visual Extension]
// @name:ru        Sploop.io [Визуальное расширение]
// @description    New visuals elements [Tracers, HitBoxes, HP indicator, Setting menu]
// @description:ru Новые визуальные элементы [Tracers, HitBoxes, HP indicator, Setting menu]
// @namespace      https://greasyfork.org/ru/users/759782-nudo
// @version        2.1
// @author         Nudo#3310
// @match          *://sploop.io/*
// @require        http://code.jquery.com/jquery-3.3.1.min.js
// @require        https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/442640/Sploopio%20%5BVisual%20Extension%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/442640/Sploopio%20%5BVisual%20Extension%5D.meta.js
// ==/UserScript==

class Visuals {
    constructor() {
        this.text = {
            color: {
                all: "#fff",
                rainbow: false
            },
            visible: 1
        }
        this.tracers = {
            active: true,
            disttag: true,
            dashline: false,
            color: {
                entity: "#cc5151",
                ally: "#a4cc4f",
                rainbow: false
            },
            size: 1,
            visible: 1
        }
        this.hitboxes = {
            active: false,
            dashline: false,
            color: {
                all: "#5174cd",
                rainbow: false
            },
            size: 1,
            visible: 1
        }
        this.rainbow = {
            old: Date.now(),
            hue: 0,
            power: 3,
            time: 10
        }
        this.offset = [0, Date.now()]
    }
    rainbowColor() {
        if (!this.rainbow.old || Date.now() - this.rainbow.old >= this.rainbow.time) {
            this.rainbow.hue += this.rainbow.power * Math.random()
            this.rainbow.old = Date.now()
        }
        visuals.rb = `hsl(${this.rainbow.hue}, 100%, 50%)`
    }
    drawText(text, x, y) {
        Context.save()
        Context.font = '18px "Baloo Paaji"'
        Context.lineWidth = 8
        Context.strokeStyle = "#3d3f42"
        Context.globalAlpha = this.text.visible
        Context.textAlign = 'center'
        Context.fillStyle = this.text.color.rainbow ? visuals.rb : this.text.color.all
        Context.strokeText(text, x, y)
        Context.fillText(text, x, y)
        Context.restore()
    }
    updateOffset() {
        if (!this.offset[1] || Date.now() - this.offset[1] >= 10) {
            this.offset[0]++
            this.offset[1] = Date.now()
        }
    }
    dashLine() {
        Context.setLineDash([18, 6, 6, 6])
        Context.lineDashOffset = -visuals.offset[0]
    }
}

let visuals = new Visuals()

class Tracers {
    constructor() {
        this.allAlly = []
        this.allEntity = []
        this.localPlayer = {
            active: false,
            x: 0,
            y: 0
        }
    }
    drawDistTag(x, y, dist) {
        if (!visuals.tracers.disttag) return
        Context.save()
        Context.font = '18px "Baloo Paaji"'
        Context.lineWidth = 8
        Context.strokeStyle = "#3d3f42"
        Context.globalAlpha = visuals.text.visible
        Context.fillStyle = visuals.text.color.rainbow ? visuals.rb : visuals.text.color.all
        Context.strokeText(dist, x, y)
        Context.fillText(dist, x, y)
        Context.restore()
    }
    draw(x, y, x2, y2, color) {
        if (!visuals.tracers.active) return
        Context.save()
        Context.lineCap = "round"
        Context.lineWidth = visuals.tracers.size
        Context.globalAlpha = visuals.tracers.visible
        Context.beginPath()
        if (visuals.tracers.dashline) visuals.dashLine()
        Context.strokeStyle = color
        Context.moveTo(x, y)
        Context.lineTo(x2, y2)
        Context.stroke()
        Context.restore()
    }
}

let tracers = new Tracers()

class HitBoxes {
    static draw(x, y, width, height) {
        if (!visuals.hitboxes.active) return
        Context.save()
        Context.lineWidth = visuals.hitboxes.size
        Context.globalAlpha = visuals.hitboxes.visible
        if (visuals.hitboxes.dashline) visuals.dashLine()
        Context.strokeStyle = visuals.hitboxes.color.rainbow ? visuals.rb : visuals.hitboxes.color.all
        Context.strokeRect(x, y, width, height)
        Context.restore()
    }
}

let Context;

let { clearRect, fillRect, fillText, drawImage } = CanvasRenderingContext2D.prototype

CanvasRenderingContext2D.prototype.clearRect = function(x, y, width, height) {
    if (this.canvas.id === "game-canvas") {
        Context = this.canvas.getContext("2d")
        visuals.rainbowColor()
        tracers.allEntity = []
        tracers.allAlly = []
    }
    return clearRect.apply(this, arguments);
}

CanvasRenderingContext2D.prototype.drawImage = function(image, x, y, width, height, dx, dy, dwidth, dheight) {
    if (tracers.localPlayer.active && typeof image.src == 'string') {
        let ff = image.src.split("/")
        if (ff[4] == "skins"
            || ff[4] == "entity"
            && !ff[5].includes("inv_")
            && !ff[5].includes("map")
            && !ff[5].includes("resource")
            && !ff[5].includes("health")
            && !ff[5].includes("button")
            && !ff[5].includes("skull")) {
            HitBoxes.draw(x, y, width, height)
        }
    }
    return drawImage.apply(this, arguments);
}

CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
    if (document.getElementById("homepage").style.display == "none") {
        visuals.updateOffset()
        if (this.fillStyle == "#a4cc4f") {
            tracers.allAlly.push({
                x: x + 45,
                y: y - 70
            })
            tracers.localPlayer.active = true
            tracers.localPlayer.x = tracers.allAlly[0].x
            tracers.localPlayer.y = tracers.allAlly[0].y
            visuals.drawText(`HP: ${~~(width / 95 * 100)}%`, x + 45, y + 40)
            visuals.drawText(`VisualExtension`, tracers.localPlayer.x, tracers.localPlayer.y + 125)
            if (tracers.allAlly[1]) {
                tracers.allAlly.forEach(ally => {
                    if (ally.x != tracers.localPlayer.x) {
                        let color = (visuals.tracers.color.rainbow ? visuals.rb : visuals.tracers.color.ally)
                        tracers.draw(tracers.localPlayer.x, tracers.localPlayer.y, ally.x, ally.y, color)
                        tracers.drawDistTag((tracers.localPlayer.x + ally.x) / 2, (tracers.localPlayer.y + ally.y) / 2, ~~(Math.hypot(tracers.localPlayer.y - ally.y, tracers.localPlayer.x - ally.x)))
                    }
                })
            }
        }
        if (this.fillStyle == "#cc5151" && tracers.localPlayer.active) {
            visuals.drawText(`HP: ${~~(width / 95 * 100)}%`, x + 45, y + 40)
            tracers.allEntity.push({
                x: x + 45,
                y: y - 70
            })
            tracers.allEntity.forEach(enemy => {
                let color = (visuals.tracers.color.rainbow ? visuals.rb : visuals.tracers.color.entity)
                tracers.draw(tracers.localPlayer.x, tracers.localPlayer.y, enemy.x, enemy.y, color)
                tracers.drawDistTag((tracers.localPlayer.x + enemy.x) / 2, (tracers.localPlayer.y + enemy.y) / 2, ~~(Math.hypot(tracers.localPlayer.y - enemy.y, tracers.localPlayer.x - enemy.x)))
            })
        }
    } else {
        tracers.localPlayer.active = false
    }
    return fillRect.apply(this, arguments)
}

let Menu = `
<div class="menu-holder flex-c">
  <div class="menu-wrapper">
    <div class="menu-container">
      <div class="menu-title flex-c text-shadowed-4">
        <span>VisualExtension</span>
      </div>
      <div class="menu-content scrollbar text-shadowed-3">
        <ul class="tracers-content">
          <li class="subcontent-subtitle" style="font-size: 18px;">Tracer</li>
          <li class="setting-box">
            <div class="name-box">Active</div>
            <div class="action-box"><div class="control-group"><label class="control control-checkbox" style="display:unset;padding-top:4px;"><input type="checkbox" id="tracer-active" checked><div class="control_indicator"></div></label></div></div>
          </li>
          <li class="setting-box">
            <div class="name-box">RainbowColor</div>
            <div class="action-box"><div class="control-group"><label class="control control-checkbox" style="display:unset;padding-top:4px;"><input type="checkbox" id="tracer-rainbow"><div class="control_indicator"></div></label></div></div>
          </li>
          <li class="setting-box" title="When there are a lot of tracers, it's a lower your FPS!">
            <div class="name-box">DashLine</div>
            <div class="action-box"><div class="control-group"><label class="control control-checkbox" style="display:unset;padding-top:4px;"><input type="checkbox" id="tracer-dashline"><div class="control_indicator"></div></label></div></div>
          </li>
          <li class="setting-box">
            <div class="name-box">DistTag</div>
            <div class="action-box"><div class="control-group"><label class="control control-checkbox" style="display:unset;padding-top:4px;"><input type="checkbox" id="tracer-disttag" checked><div class="control_indicator"></div></label></div></div>
          </li>
          <li class="setting-box">
            <div class="name-box">AllyColor</div>
            <div class="action-box"><input type="color" id="tracers-ally-color" value="#a4cc4f"></div>
          </li>
          <li class="setting-box">
            <div class="name-box">EntityColor</div>
            <div class="action-box"><input type="color" id="tracers-entity-color" value="#cc5151"></div>
          </li>
          <li class="setting-box">
            <div class="name-box">Size</div>
            <div class="action-box">
              <div class="range-wrapper"><input type="range" class="pointer" id="tracers-size" value="1" min="1" step="any" max="10"><div class="range-value flex-c text-shadowed-3" id="tracers-size-value">1</div></div>
            </div>
          </li>
          <li class="setting-box">
            <div class="name-box">Visible</div>
            <div class="action-box">
              <div class="range-wrapper"><input type="range" class="pointer" id="tracers-visible" value="1" min="0" step="any" max="1"><div class="range-value flex-c text-shadowed-3" id="tracers-visible-value">1</div></div>
            </div>
          </li>
        </ul>
        <ul class="text-content">
          <li class="subcontent-subtitle" style="font-size: 18px;">Text</li>
          <li class="setting-box">
            <div class="name-box">RainbowColor</div>
            <div class="action-box"><div class="control-group"><label class="control control-checkbox" style="display:unset;padding-top:4px;"><input type="checkbox" id="text-rainbow"><div class="control_indicator"></div></label></div></div>
          </li>
          <li class="setting-box">
            <div class="name-box">Color</div>
            <div class="action-box"><input type="color" id="text-all-color" value="#ffffff"></div>
          </li>
          <li class="setting-box">
            <div class="name-box">Visible</div>
            <div class="action-box">
              <div class="range-wrapper"><input type="range" class="pointer" id="text-visible" value="1" min="0" step="any" max="1"><div class="range-value flex-c text-shadowed-3" id="text-visible-value">1</div></div>
            </div>
          </li>
        </ul>
        <ul class="hitboxes-content">
          <li class="subcontent-subtitle" style="font-size: 18px;">HitBox</li>
          <li class="setting-box">
            <div class="name-box">Active</div>
            <div class="action-box"><div class="control-group"><label class="control control-checkbox" style="display:unset;padding-top:4px;"><input type="checkbox" id="hitbox-active"><div class="control_indicator"></div></label></div></div>
          </li>
          <li class="setting-box">
            <div class="name-box">RainbowColor</div>
            <div class="action-box"><div class="control-group"><label class="control control-checkbox" style="display:unset;padding-top:4px;"><input type="checkbox" id="hitbox-rainbow"><div class="control_indicator"></div></label></div></div>
          </li>
          <li class="setting-box" title="When there are a lot of hitboxes, it's a lower your FPS!">
            <div class="name-box">DashLine</div>
            <div class="action-box"><div class="control-group"><label class="control control-checkbox" style="display:unset;padding-top:4px;"><input type="checkbox" id="hitbox-dashline"><div class="control_indicator"></div></label></div></div>
          </li>
          <li class="setting-box">
            <div class="name-box">Color</div>
            <div class="action-box"><input type="color" id="hitbox-all-color" value="#5174cd"></div>
          </li>
          <li class="setting-box">
            <div class="name-box">Size</div>
            <div class="action-box">
              <div class="range-wrapper"><input type="range" class="pointer" id="hitbox-size" value="1" min="1" step="any" max="10"><div class="range-value flex-c text-shadowed-3" id="hitbox-size-value">1</div></div>
            </div>
          </li>
          <li class="setting-box">
            <div class="name-box">Visible</div>
            <div class="action-box">
              <div class="range-wrapper"><input type="range" class="pointer" id="hitbox-visible" value="1" min="0" step="any" max="1"><div class="range-value flex-c text-shadowed-3" id="hitbox-visible-value">1</div></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
<style>
.range-value {
  width: 26px;
  margin-left: 5px;
  margin-right: -5px;
}
.range-wrapper {
  display: flex;
  margin-right: 5px;
  align-items: center;
}
.name-box {
  dont-size: 16px;
}
.setting-box {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-left: 3px;
  padding-right: 3px;
}
.tracers-content, .text-content, .hitboxes-content {
  margin-left: 5px;
}
.menu-content {
  display: flex;
  flex-direction: column;
  width: 214px;
  height: 265px;
  background: rgb(20 20 20 / 30%);
  border-radius: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
  border: 3px solid #141414;
  box-shadow: inset 0 5px 0 rgb(20 20 20 / 40%);
  margin-left: 3px;
}
.menu-title span {
  font-size: 20px;
  color: #f0ece0;
}
.menu-title {
  width: 100%;
  height: 40px;
}
.menu-container {
  position: relative;
  left: -215px;
  display: flex;
  flex-direction: column;
}
.menu-wrapper {
  width: 40px;
  height: 325px;
  background: rgba(40, 45, 34, 0.6);
  border-radius: 0 15px 15px 0;
  border: 5px solid #141414;
  border-left: none;
  box-shadow: none;
  opacity: .5;
  transition: .5s all;
}
.menu-wrapper:hover {
  box-shadow: inset 0 4px 0 #4e5645, inset 0 -4px 0 #384825, 0px 2px 0 5px rgb(20 20 20 / 30%), 0px 0px 0 15px rgb(20 20 20 / 10%);
}
.menu-holder {
  position: absolute;
  top: 0;
  height: 100%;
}
.flex-c {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-sb-c {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
input[type="color"] {
  -webkit-appearance: none;
  border: none;
  background: none;
  width: 20px;
  height: 20px;
  border: 4px solid #141414;
  border-radius: 50%;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}
input[type=color]::-moz-focus-inner {
  border: none;
  padding: 0;
  border-radius: 50%;
}
input[type=color]::-moz-color-swatch {
  border: none;
  border-radius: 50%;
}
input[type="range"] {
  -webkit-appearance: none;
  width: 80px;
  height: 12px;
  background: rgba(40, 45, 34, 0.6);;
  border: 3px solid #141414;
  outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
  -webkit-appearance: none;
  width: 20px;
  border-radius: 4px;
  height: 20px;
  background: #f0ece0;
  border: 4px solid #141414;
  position: relative;
  z-index: 3;
}
</style>
`

$("body").append(Menu)

$(".menu-wrapper").mouseenter(() => {
    $(".menu-container").animate({left: "0px"}, 750)
    $(".menu-wrapper").animate({ width: "225px", opacity: "1" }, 250)
}).mouseleave(() => {
    $(".menu-container").animate({left: "-215px"}, 750)
    $(".menu-wrapper").animate({ width: "40px", opacity: ".5" }, 250)
})

$("#tracers-visible").on("input", () => {
    visuals.tracers.visible = $("#tracers-visible").val()
    let fn = String((parseInt(visuals.tracers.visible * 100)) / 100)
    $("#tracers-visible-value").text(fn.includes("0.0") ? "." + fn.split("0.")[1] : fn.includes("0.") ? fn.split("0")[1] : fn)
})

$("#text-visible").on("input", () => {
    visuals.text.visible = $("#text-visible").val()
    let fn = String((parseInt(visuals.text.visible * 100)) / 100)
    $("#text-visible-value").text(fn.includes("0.0") ? "." + fn.split("0.")[1] : fn.includes("0.") ? fn.split("0")[1] : fn)
})

$("#hitbox-visible").on("input", () => {
    visuals.hitboxes.visible = $("#hitbox-visible").val()
    let fn = String((parseInt(visuals.hitboxes.visible * 100)) / 100)
    $("#hitbox-visible-value").text(fn.includes("0.0") ? "." + fn.split("0.")[1] : fn.includes("0.") ? fn.split("0")[1] : fn)
})

$("#hitbox-size").on("input", () => {
    visuals.hitboxes.size = $("#hitbox-size").val()
    let fn = String((parseInt(visuals.hitboxes.size * 100)) / 100)
    $("#hitbox-size-value").text(fn.includes("0.0") ? "." + fn.split("0.")[1] : fn.includes("0.") ? fn.split("0")[1] : fn)
})

$("#tracers-size").on("input", () => {
    visuals.tracers.size = $("#tracers-size").val()
    let fn = String((parseInt(visuals.tracers.size * 100)) / 100)
    $("#tracers-size-value").text(fn.includes("0.0") ? "." + fn.split("0.")[1] : fn.includes("0.") ? fn.split("0")[1] : fn)
})

$("#tracers-ally-color").on("input", () => visuals.tracers.color.ally = $("#tracers-ally-color").val())

$("#tracers-entity-color").on("input", () => visuals.tracers.color.entity = $("#tracers-entity-color").val())

$("#tracer-rainbow").on("input", () => visuals.tracers.color.rainbow = !visuals.tracers.color.rainbow)

$("#tracer-disttag").on("input", () => visuals.tracers.disttag = !visuals.tracers.disttag, )

$("#tracer-dashline").on("input", () => visuals.tracers.dashline = !visuals.tracers.dashline)

$("#text-all-color").on("input", () => visuals.text.color.all = $("#text-all-color").val())

$("#text-rainbow").on("input", () => visuals.text.color.rainbow = !visuals.text.color.rainbow)

$("#hitbox-all-color").on("input", () => visuals.hitboxes.color.all = $("#hitbox-all-color").val())

$("#hitbox-rainbow").on("input", () => visuals.hitboxes.color.rainbow = !visuals.hitboxes.color.rainbow)

$("#hitbox-dashline").on("input", () => visuals.hitboxes.dashline = !visuals.hitboxes.dashline)

$("#hitbox-active").on("input", () => visuals.hitboxes.active = !visuals.hitboxes.active)

$("#tracer-active").on("input", () => visuals.tracers.active = !visuals.tracers.active)