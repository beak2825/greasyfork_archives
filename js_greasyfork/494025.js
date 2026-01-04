// ==UserScript==
// @name         Circle hitboxes - Sploop
// @namespace    http://tampermonkey.net/
// @version      2024-04-30
// @description  Accurate Circle Hitboxes For PvP in Sploop.io!
// @author       fizzixww
// @match        https://sploop.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494025/Circle%20hitboxes%20-%20Sploop.user.js
// @updateURL https://update.greasyfork.org/scripts/494025/Circle%20hitboxes%20-%20Sploop.meta.js
// ==/UserScript==
const hitbox_Circle_Colour = "#ff0000"; //Choose the colour of the hitboxes! (search Hex Colour Picker in google)

const Remove_weird_circle_above_animals = 0; //(not recommended) Set this to 1 to remove the weird looking circle above animals. however, you will not be able to see other players hitboxes if you do this.


//Code derived from Nudos visual extention.
(function() {
    class Visuals {
        constructor() {
            this.text = {
                color: {
                    all: "#fff",
                    rainbow: false
                },
                visible: 1
            };
            this.hi = {
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
            };
            this.hitboxes = {
                active: false,
                dashline: false,
                color: {
                    all: "#5174cd",
                    rainbow: false
                },
                size: 1,
                visible: 1
            };
            this.rainbow = {
                old: Date.now(),
                hue: 0,
                power: 3,
                time: 10
            };
            this.offset = [0, Date.now()];
        }

        rainbowColor() {
            if (!this.rainbow.old || Date.now() - this.rainbow.old >= this.rainbow.time) {
                this.rainbow.hue += this.rainbow.power * Math.random();
                this.rainbow.old = Date.now();
            }
            visuals.rb = `hsl(${this.rainbow.hue}, 100%, 50%)`;
        }

        drawText(text, x, y) {
            Context.save();
            Context.font = '18px "Baloo Paaji"';
            Context.lineWidth = 8;
            Context.strokeStyle = "#3d3f42";
            Context.globalAlpha = this.text.visible;
            Context.textAlign = 'center';
            Context.fillStyle = this.text.color.rainbow ? visuals.rb : this.text.color.all;
            Context.strokeText(text, x, y);
            Context.fillText(text, x, y);
            Context.restore();
        }

        updateOffset() {
            if (!this.offset[1] || Date.now() - this.offset[1] >= 10) {
                this.offset[0]++;
                this.offset[1] = Date.now();
            }
        }

        dashLine() {
            Context.setLineDash([18, 6, 6, 6]);
            Context.lineDashOffset = -visuals.offset[0];
        }
    }

    let visuals = new Visuals();

    class fizzBurger {
        constructor() {
            this.allAlly = [];
            this.allEntity = [];
            this.localPlayer = {
                active: false,
                positions: [],
                maxPositions: 50 //amount
            };
        }

        drawCircle(x, y, imgWidth, imgHeight, rotation, rad) {
            const radius = rad;
            const offset = -radius;
            const centerX = x + imgWidth / 2;
            const centerY = y + imgHeight / 2;
            const rotatedX = centerX + (radius + offset) * Math.cos(rotation);
            const rotatedY = centerY + (radius + offset) * Math.sin(rotation);
            Context.save();
            Context.beginPath();
            Context.arc(rotatedX, rotatedY, radius, 0, 2 * Math.PI);
            Context.lineWidth = 2;
            Context.strokeStyle = hitbox_Circle_Colour;
            Context.stroke();
            Context.restore();
        }
        updatePositions(x, y) {
            this.localPlayer.positions.push({
                x,
                y
            });

            if (this.localPlayer.positions.length > this.localPlayer.maxPositions) {
                this.localPlayer.positions.shift();
            }
        }

        drawAllCircles() {
            this.allEntity.forEach(({
                x,
                y,
                imgWidth,
                imgHeight,
                rotation
            }) => {
                this.drawCircle(x, y, imgWidth, imgHeight, rotation);
            });
        }
    }

    let QuickQuix = new fizzBurger();

    let Context;

    let {
        clearRect,
        fillRect,
        fillText,
        drawImage
    } = CanvasRenderingContext2D.prototype;

    CanvasRenderingContext2D.prototype.clearRect = function(x, y, width, height) {
        if (this.canvas.id === "game-canvas") {
            Context = this.canvas.getContext("2d");
        }
        return clearRect.apply(this, arguments);
    };

    CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
        if (document.getElementById("homepage").style.display == "none") {
            visuals.updateOffset();
            if (this.fillStyle == "#a4cc4f") {}
        } else {
            QuickQuix.localPlayer.active = false;
        }
        return fillRect.apply(this, arguments);
    };

    const imageRadii = {
        "https://sploop.io/img/entity/tree.png?v=1923912": 90,
        "https://sploop.io/img/entity/rock.png?v=1923912": 75,
        "https://sploop.io/img/entity/cherry_tree.png?v=1923912": 90,
        "https://sploop.io/img/entity/gold.png?v=1923912": 76,
        "https://sploop.io/img/entity/hard_spike.png?v=1923912": 45,
        "https://sploop.io/img/entity/spike.png?v=1923912": 45,
        "https://sploop.io/img/entity/wall.png?v=1923912": 45,
        "https://sploop.io/img/entity/platform.png?v=1923912": 60,
        "https://sploop.io/img/entity/boost.png?v=1923912": 40,
        "https://sploop.io/img/entity/lootbox.png?v=1923912": 40,
        "https://sploop.io/img/entity/windmill_base.png?v=1923912": 45,
        "https://sploop.io/img/entity/windmill_top.png?v=1923912": 54,
        "https://sploop.io/img/entity/bed.png?v=1923912": 50,
        "https://sploop.io/img/entity/castle_spike.png?v=1923912": 42,
        "https://sploop.io/img/entity/tornado.png?v=1923912": 220,
        "https://sploop.io/img/entity/cactus.png?v=1923912": 50,
        "https://sploop.io/img/entity/bush.png?v=1923912": 50,
        "https://sploop.io/img/entity/roof.png?v=1923912": 50,
        "https://sploop.io/img/entity/chest.png?v=1923912": 45,
        "https://sploop.io/img/entity/turret_base.png?v=1923912": 45,
        "https://sploop.io/img/entity/cow.png?v=1923912": 90,
        "https://sploop.io/img/entity/trap.png?v=1923912": 40,
        "https://sploop.io/img/entity/wood_farm.png?v=1923912": 80,
        "https://sploop.io/img/entity/shark.png?v=1923912": 90,
        "https://sploop.io/img/entity/castle_wall.png?v=1923912": 59,
        "https://sploop.io/img/entity/wolf.png?v=1923912": 50,
        "https://sploop.io/img/entity/berry_farm.png?v=1923912": 50,
        "https://sploop.io/img/entity/gcow.png?v=1923912": 90,
        "https://sploop.io/img/entity/palm_tree.png?v=1923912": 90,
        "https://sploop.io/img/entity/cave_stone0.png?v=1923912": 92,
        "https://sploop.io/img/entity/cave_stone1.png?v=1923912": 92,
        "https://sploop.io/img/entity/cave_stone2.png?v=1923912": 58,
        "https://sploop.io/img/entity/fireball.png?v=1923912": 100,
        "https://sploop.io/img/entity/ice0.png?v=1923912": 92,
        "https://sploop.io/img/entity/ice1.png?v=1923912": 20,
        "https://sploop.io/img/entity/teleporter.png?v=1923912": 35,
        "https://sploop.io/img/entity/duck.png?v=1923912": 20,
        "https://sploop.io/img/entity/mammoth_body.png?v=1923912": 90,
        "https://sploop.io/img/entity/dragon_2_body.png?v=1923912": 100,
        "https://sploop.io/img/entity/wood_farm_cherry.png?v=1923912": 80,
        "https://sploop.io/img/entity/wood_farm.png?v=1923912": 80,
        "https://sploop.io/img/entity/ruby.png?v=1923912": 100,
        "https://sploop.io/img/skins/body0.png?v=1923912": 35,
        "https://sploop.io/img/skins/body1.png?v=1923912": 35,
        "https://sploop.io/img/skins/body2.png?v=1923912": 35,
        "https://sploop.io/img/skins/body3.png?v=1923912": 35,
        "https://sploop.io/img/skins/body4.png?v=1923912": 35,
        "https://sploop.io/img/skins/body5.png?v=1923912": 35,
        "https://sploop.io/img/skins/body6.png?v=1923912": 35,
        "https://sploop.io/img/skins/body7.png?v=1923912": 35,
        "https://sploop.io/img/skins/body8.png?v=1923912": 35,
        "https://sploop.io/img/skins/body9.png?v=1923912": 35,
        "https://sploop.io/img/skins/body10.png?v=1923912": 35,
        "https://sploop.io/img/skins/body11.png?v=1923912": 35,
        "https://sploop.io/img/skins/body12.png?v=1923912": 35,
        "https://sploop.io/img/skins/body13.png?v=1923912": 35,
        "https://sploop.io/img/skins/body14.png?v=1923912": 35,
        "https://sploop.io/img/skins/body15.png?v=1923912": 35,
        "https://sploop.io/img/skins/body16.png?v=1923912": 35,
        "https://sploop.io/img/skins/body17.png?v=1923912": 35,
        "https://sploop.io/img/skins/body18.png?v=1923912": 35,
        "https://sploop.io/img/skins/body19.png?v=1923912": 35,
        "https://sploop.io/img/skins/body20.png?v=1923912": 35,
        "https://sploop.io/img/skins/body21.png?v=1923912": 35,
        "https://sploop.io/img/skins/body22.png?v=1923912": 35,
        "https://sploop.io/img/skins/body23.png?v=1923912": 35,
        "https://sploop.io/img/skins/body24.png?v=1923912": 35,
        "https://sploop.io/img/skins/body25.png?v=1923912": 35,
        "https://sploop.io/img/skins/body26.png?v=1923912": 35,
        "https://sploop.io/img/skins/body27.png?v=1923912": 35,
        "https://sploop.io/img/skins/body28.png?v=1923912": 35,
        "https://sploop.io/img/skins/body29.png?v=1923912": 35,
        "https://sploop.io/img/skins/body30.png?v=1923912": 35,
        "https://sploop.io/img/skins/body31.png?v=1923912": 35,
        "https://sploop.io/img/skins/body32.png?v=1923912": 35,
        "https://sploop.io/img/skins/body33.png?v=1923912": 35,
        "https://sploop.io/img/skins/body34.png?v=1923912": 35,
        "https://sploop.io/img/skins/body35.png?v=1923912": 35,
        "https://sploop.io/img/skins/body36.png?v=1923912": 35,
        "https://sploop.io/img/skins/body37.png?v=1923912": 35,
        "https://sploop.io/img/skins/body38.png?v=1923912": 35,
        "https://sploop.io/img/skins/body39.png?v=1923912": 35,
        "https://sploop.io/img/skins/body40.png?v=1923912": 35,
        "https://sploop.io/img/skins/body41.png?v=1923912": 35,
        "https://sploop.io/img/skins/body42.png?v=1923912": 35,
        "https://sploop.io/img/skins/body43.png?v=1923912": 35,
        "https://sploop.io/img/skins/body44.png?v=1923912": 35,
        "https://sploop.io/img/skins/body45.png?v=1923912": 35,
        "https://sploop.io/img/skins/body46.png?v=1923912": 35,
        "https://sploop.io/img/skins/body47.png?v=1923912": 35,
        "https://sploop.io/img/skins/body48.png?v=1923912": 35,
        "https://sploop.io/img/skins/body49.png?v=1923912": 35,
        "https://sploop.io/img/skins/body50.png?v=1923912": 35,
        "https://sploop.io/img/skins/body51.png?v=1923912": 35,
        "https://sploop.io/img/skins/body52.png?v=1923912": 35,
        "https://sploop.io/img/skins/body53.png?v=1923912": 35,
        "https://sploop.io/img/skins/body54.png?v=1923912": 35,
        "https://sploop.io/img/skins/body55.png?v=1923912": 35,
        "https://sploop.io/img/skins/body56.png?v=1923912": 35,
        "https://sploop.io/img/skins/body57.png?v=1923912": 35,
        "https://sploop.io/img/skins/body58.png?v=1923912": 35,
        "https://sploop.io/img/skins/body59.png?v=1923912": 35,
        "https://sploop.io/img/skins/body60.png?v=1923912": 35,
        "https://sploop.io/img/skins/body61.png?v=1923912": 35,
        "https://sploop.io/img/skins/body62.png?v=1923912": 35,
        "https://sploop.io/img/skins/body63.png?v=1923912": 35,
        "https://sploop.io/img/skins/body64.png?v=1923912": 35,
        "https://sploop.io/img/skins/body65.png?v=1923912": 35,
        "https://sploop.io/img/skins/body66.png?v=1923912": 35,
        "https://sploop.io/img/skins/body67.png?v=1923912": 35,
        "https://sploop.io/img/skins/body68.png?v=1923912": 35,
        "https://sploop.io/img/skins/body69.png?v=1923912": 35,
        "https://sploop.io/img/skins/body70.png?v=1923912": 35,
        "https://sploop.io/img/skins/body71.png?v=1923912": 35,
        "https://sploop.io/img/skins/body72.png?v=1923912": 35,
        "https://sploop.io/img/skins/body73.png?v=1923912": 35,
        "https://sploop.io/img/skins/body74.png?v=1923912": 35,
        "https://sploop.io/img/skins/body75.png?v=1923912": 35,
        "https://sploop.io/img/skins/body76.png?v=1923912": 35,
        "https://sploop.io/img/skins/body77.png?v=1923912": 35,
        "https://sploop.io/img/skins/body78.png?v=1923912": 35,
        "https://sploop.io/img/skins/body79.png?v=1923912": 35,
        "https://sploop.io/img/skins/body80.png?v=1923912": 35,
        "https://sploop.io/img/skins/body81.png?v=1923912": 35,
        "https://sploop.io/img/skins/body82.png?v=1923912": 35,
        "https://sploop.io/img/skins/body83.png?v=1923912": 35,
        "https://sploop.io/img/skins/body84.png?v=1923912": 35,
        "https://sploop.io/img/skins/body85.png?v=1923912": 35,
        "https://sploop.io/img/skins/body86.png?v=1923912": 35,
        "https://sploop.io/img/skins/body87.png?v=1923912": 35,
        "https://sploop.io/img/skins/body88.png?v=1923912": 35,
        "https://sploop.io/img/skins/body89.png?v=1923912": 35,
        "https://sploop.io/img/skins/body90.png?v=1923912": 35,
        "https://sploop.io/img/skins/body91.png?v=1923912": 35,
        "https://sploop.io/img/skins/body92.png?v=1923912": 35,
        "https://sploop.io/img/skins/body93.png?v=1923912": 35,
        "https://sploop.io/img/skins/body94.png?v=1923912": 35,
        "https://sploop.io/img/skins/body95.png?v=1923912": 35,
        //more bodies added incase of future skins dont worry I didnt type them all out thanks for caring
        "https://sploop.io/img/skins/body96.png?v=1923912": 35,
        "https://sploop.io/img/skins/body97.png?v=1923912": 35,
        "https://sploop.io/img/skins/body98.png?v=1923912": 35,
        "https://sploop.io/img/skins/body99.png?v=1923912": 35,
        "https://sploop.io/img/skins/body100.png?v=1923912": 35,
        "https://sploop.io/img/skins/body101.png?v=1923912": 35,
        "https://sploop.io/img/skins/body102.png?v=1923912": 35,
        "https://sploop.io/img/skins/body103.png?v=1923912": 35,
        "https://sploop.io/img/skins/body104.png?v=1923912": 35,
        "https://sploop.io/img/skins/body105.png?v=1923912": 35,
        "https://sploop.io/img/skins/body106.png?v=1923912": 35,
        "https://sploop.io/img/skins/body107.png?v=1923912": 35,
        "https://sploop.io/img/skins/body108.png?v=1923912": 35,
        "https://sploop.io/img/skins/body109.png?v=1923912": 35,
        "https://sploop.io/img/skins/body110.png?v=1923912": 35,
        "https://sploop.io/img/skins/body111.png?v=1923912": 35,
        "https://sploop.io/img/skins/body112.png?v=1923912": 35,
        "https://sploop.io/img/skins/body113.png?v=1923912": 35,
        "https://sploop.io/img/skins/body114.png?v=1923912": 35,
        "https://sploop.io/img/skins/body115.png?v=1923912": 35,
        "https://sploop.io/img/skins/body116.png?v=1923912": 35,
        "https://sploop.io/img/skins/body117.png?v=1923912": 35,
        "https://sploop.io/img/skins/body118.png?v=1923912": 35,
        "https://sploop.io/img/skins/body119.png?v=1923912": 35,
        "https://sploop.io/img/skins/body120.png?v=1923912": 35,
        "https://sploop.io/img/skins/body121.png?v=1923912": 35,
        "https://sploop.io/img/skins/body122.png?v=1923912": 35,
        "https://sploop.io/img/skins/body123.png?v=1923912": 35,
        "https://sploop.io/img/skins/body124.png?v=1923912": 35,
        "https://sploop.io/img/skins/body125.png?v=1923912": 35,
        "https://sploop.io/img/skins/body126.png?v=1923912": 35,
        "https://sploop.io/img/skins/body127.png?v=1923912": 35,
        "https://sploop.io/img/skins/body128.png?v=1923912": 35,
        "https://sploop.io/img/skins/body129.png?v=1923912": 35,
        "https://sploop.io/img/skins/body130.png?v=1923912": 35,
        "https://sploop.io/img/skins/body131.png?v=1923912": 35,
        "https://sploop.io/img/skins/body132.png?v=1923912": 35,
        "https://sploop.io/img/skins/body133.png?v=1923912": 35,
        "https://sploop.io/img/skins/body134.png?v=1923912": 35,
        "https://sploop.io/img/skins/body135.png?v=1923912": 35,
        "https://sploop.io/img/skins/body136.png?v=1923912": 35,
        "https://sploop.io/img/skins/body137.png?v=1923912": 35,
        "https://sploop.io/img/skins/body138.png?v=1923912": 35,
        "https://sploop.io/img/skins/body139.png?v=1923912": 35,
        "https://sploop.io/img/skins/body140.png?v=1923912": 35,
        "https://sploop.io/img/skins/body141.png?v=1923912": 35,
        "https://sploop.io/img/skins/body142.png?v=1923912": 35,
        "https://sploop.io/img/skins/body143.png?v=1923912": 35,
        "https://sploop.io/img/skins/body144.png?v=1923912": 35,
        "https://sploop.io/img/skins/body145.png?v=1923912": 35,
        "https://sploop.io/img/skins/body146.png?v=1923912": 35,
        "https://sploop.io/img/skins/body147.png?v=1923912": 35,
        "https://sploop.io/img/skins/body148.png?v=1923912": 35,
        "https://sploop.io/img/skins/body149.png?v=1923912": 35,
        "https://sploop.io/img/skins/body150.png?v=1923912": 35,
    };
    CanvasRenderingContext2D.prototype.drawImage = function(img, ...args) {
        if (this.canvas.id === "game-canvas") {
            const imageURL = img.src;
            const radius = imageRadii[imageURL] || 0.0;

            if (imageURL in imageRadii) {
                const x = args[0];
                const y = args[1];
                const width = args[2];
                const height = args[3];
                const rotation = args[4] || 0;

                drawImage.apply(this, [img, ...args]);
                QuickQuix.drawCircle(x, y, width, height, rotation, radius);
                return;
            }
        }
        return drawImage.apply(this, [img, ...args]);
    };
})();

//following function draws a second circle using healthbar so that player hitbox can be seen above hat.

(function() {
    class xXSploopyTailXx {
        constructor() {
            this.text = {
                color: {
                    all: "#fff"
                },
                visible: 1
            };
            this.rainbow = {};
            this.offset = [0, Date.now()];
        }

        xXsploopyColorsXx() {
            if (!this.rainbow.old || Date.now() - this.rainbow.old >= this.rainbow.time) {
                this.rainbow.hue += this.rainbow.power * Math.random();
                this.rainbow.old = Date.now();
            }
            xXsploopyTextXx.rb = `hsl(${this.rainbow.hue}, 100%, 50%)`;
        }

        xXsploopyOffsetXx() {
            if (!this.offset[1] || Date.now() - this.offset[1] >= 10) {
                this.offset[0]++;
                this.offset[1] = Date.now();
            }
        }
    }

    let xXsploopyTextXx = new xXSploopyTailXx();

    class xXSploopyLooperXx {
        constructor() {
            this.localPlayer = {
                position: {
                    x: 0,
                    y: 0
                },
                maxPositions: 50
            };
        }

        drawXxSplooptailXx(x, y) {
            const radius = 35;

            Context.save();
            Context.beginPath();
            Context.arc(x, y, radius, 0, 2 * Math.PI);
            Context.lineWidth = 2;
            Context.strokeStyle = hitbox_Circle_Colour;
            Context.stroke();
            Context.restore();
        }

        updateXxSploopyPositionXx(x, y) {
            this.localPlayer.position = {
                x,
                y
            };
        }

        drawXxSploopyCircleXx() {
            const {
                x,
                y
            } = this.localPlayer.position;
            this.drawXxSplooptailXx(x, y);
        }
    }

    let xXsploopyLooperXx = new xXSploopyLooperXx();

    let Context;

    let {
        clearRect,
        fillRect
    } = CanvasRenderingContext2D.prototype;

    CanvasRenderingContext2D.prototype.clearRect = function(x, y, width, height) {
        if (this.canvas.id === "game-canvas") {
            Context = this.canvas.getContext("2d");
            xXsploopyTextXx.xXsploopyColorsXx();
        }
        return clearRect.apply(this, arguments);
    };

    CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
        if (document.getElementById("homepage").style.display == "none") {
            xXsploopyTextXx.xXsploopyOffsetXx();
            if (this.fillStyle == "#a4cc4f") {
                xXsploopyLooperXx.updateXxSploopyPositionXx(x + 48, y - 70);
                xXsploopyLooperXx.drawXxSploopyCircleXx();
            }
            if (this.fillStyle == "#cc5151" && Remove_weird_circle_above_animals === 0) {
                xXsploopyLooperXx.updateXxSploopyPositionXx(x + 48, y - 70);
                xXsploopyLooperXx.drawXxSploopyCircleXx();
            }
        }
        return fillRect.apply(this, arguments);
    };
})();