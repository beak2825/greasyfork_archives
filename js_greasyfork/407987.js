// ==UserScript==
// @name         Неоновая тема
// @author       Nimdac#0648
// @description  Неоновая тема для diep.io. Нажми G чтобы поменять количество слоев свечения (чем меньше слоев, тем меньше проседает FPS). Эта тема работает только в FFA, Maze и Sandbox.
// @version 	 1.4.11
// @match        *://diep.io/*
// @namespace	 https://greasyfork.org/users/668919
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407987/%D0%9D%D0%B5%D0%BE%D0%BD%D0%BE%D0%B2%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/407987/%D0%9D%D0%B5%D0%BE%D0%BD%D0%BE%D0%B2%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0.meta.js
// ==/UserScript==
(function() {

    
	if(localStorage.no_wasm != "true") localStorage.setItem("no_wasm", true), location.reload();

  	const

    fillColors = [

        { color: "#000001", cmd: ["net_replace_color 2", "net_replace_color 3"] },
        { color: "#000002", new: "#00c0ff" },
        { color: "#000100", cmd: ["net_replace_color 0", "net_replace_color 1", "net_replace_color 10"] },
        { color: "#000200", new: "#cf33ff" },
        { color: "#010000", cmd: ["net_replace_color 8", "net_replace_color 12", "net_replace_color 6"] },
        { color: "#000003", cmd: ["net_replace_color 4", "net_replace_color 9", "net_replace_color 15", "ren_health_fill_color"] },
        { color: "#000006", new: "#ff0080" },
      	{ color: "#010001", cmd: ["net_replace_color 11"] },
      	{ color: "#010100", cmd: ["net_replace_color 14"], new: "#030006" },
      	{ color: "#030000", cmd: ["net_replace_color 17"] },
      	{ color: "#020000", new: "#ffff33" },
        { color: "#000300", cmd: ["net_replace_color 7"] },
      	{ color: "#000101", cmd: ["net_replace_color 16"] },
        { color: "#060000", new: "#ffffff" },
      	{ color: "#010002", cmd: ["net_replace_color 5"] },
        { color: "#020004", new: "#ca80ff" }

    ],

    strokeColors = [

        { color: "#123456", cmd: ["ren_xp_bar_fill_color"] },
 		{ color: "#123321", cmd: ["ren_health_background_color"] },
 		{ color: "#010101", cmd: ["ren_score_bar_fill_color", "net_replace_color 13"] },
        { color: "#000200", new: "#cf33ff" },
      	{ color: "#321123", cmd: ["ren_bar_background_color"] },
        { color: "#000002", new: "#00c0ff" },
        { color: "#020000", new: "#ffff33" },
        { color: "#000003", new: "#ff0080" },
        { color: "#000006", new: "#ff0080" },
      	{ color: "#020002", new: "#ff33bb" },
      	{ color: "#020200", new: "#cf33ff" },
      	{ color: "#060000", new: "#ffffff" },
      	{ color: "#000600", new: "#00ff00" },
      	{ color: "#000202", new: "#ff8000" },
      	{ color: "#020004", new: "#ca80ff" }

    ],


    p = CanvasRenderingContext2D.prototype,

   	_fill = p.fill,
    _stroke = p.stroke,
    _fillText = p.fillText,
	_strokeText = p.strokeText,
   	_fillRect = p.fillRect,
    _setTransform = p.setTransform,
    _drawImage = p.drawImage,
   	_toString = Function.prototype.toString,

    darkenColor = (color, m) => {

      	m = m || 1;
  		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  		return result ? `rgb(${parseInt(result[1], 16) / (2.5*m)},${parseInt(result[2], 16) / (2.5*m)},${parseInt(result[3], 16) / (2.5*m)})` : null;

	};

  	strokeColors[1].new = darkenColor(strokeColors[7].new, 2);

   	const

  	UIColors = ["#987789", "#789987", "#4c3b44", "#3c4c43", "#ac92a0", "#93ad9f", "#795f6d", "#607a6c"],

  	fill = function() {

      	if(["#888888", "#eeeeee"].includes(this.fillStyle)) return;
      	if(this.fillStyle == "#000000") this.fillStyle = strokeColors[7].new;
      	if(this.fillStyle == "#4c4c4d") this.fillStyle = fillColors[1].new;
        if(this.fillStyle == "#4c4d4c") this.fillStyle = fillColors[3].new;
      	if(this.fillStyle == "#4c4c4e") this.fillStyle = fillColors[6].new;

      	if(UIColors.includes(this.fillStyle)) {

          	let

            i = UIColors.indexOf(this.fillStyle),
            color = [

           		strokeColors[3].new, strokeColors[7].new,
           		darkenColor(strokeColors[3].new), darkenColor(strokeColors[7].new),
           		strokeColors[3].new, strokeColors[7].new,
                strokeColors[3].new, strokeColors[7].new

           ][i];

          	if(i < UIColors.length - 4) {

              	this.strokeStyle = color;

              	this.save();
            	this.clip();
            	this.lineWidth *= 0.4;
            	_stroke.call(this);
              	this.restore();
            	return;

            }

          	this.fillStyle = color;

        }

      	for(let x of fillColors) {

          	if(x.color == this.fillStyle) {

              	this.fillStyle = (x.new || "#000000");
              	break;

            }

        }

      	if(this.fillStyle == "#030006") {

          	this.strokeStyle = strokeColors[3].new;

          	this.save();
          	this.clip();
          	this.lineWidth = c.height/100;
          	_stroke.call(this);
          	this.restore();

          	this.globalCompositeOperation = "lighten";

        }

      	_fill.call(this);

    },

   	stroke = function() {

      	if(!strokeColors.map(x => x.color).includes(this.strokeStyle)) return;
      	if(["#123456", "#321123", "#010101"].includes(this.strokeStyle)) return;

      	for(let x of strokeColors) {

          	if(x.color == this.strokeStyle) {

              	this.strokeStyle = (x.new || "#000000");
              	break;

            }

        }

      	_stroke.call(this);

    },

    regexpC = new RegExp(`^(${[

    	"Score: ([0-9]{1,3})(,[0-9]{1,3})?(,[0-9]{1,3})?",
      	"Scoreboard",
      	"diep\\.io",
      	"[0-9]+\\.[0-9] ms vultr-(amsterdam|miami|la|singapore|sydney)",
      	"[0-9]+\\.[0-9] FPS",
		"([0-9]+h )?([0-9]{1,2}m )?[0-9]{1,2}s",
      	"([0-9]{1,3})(,[0-9]{1,3})(,[0-9]{1,3})?",
      	"You were killed by:",
      	"\\(press enter to continue\\)",
      	"\\(they seem to prefer to keep an air of mystery about them\\)",
        "You've killed [^]+",
      	"Game mode"

    ].join("|")})$`),

    regexpR = new RegExp(`^(${[

		"\\[[0-8]\\]",
      	"Health Regen",
      	"Max Health",
      	"Body Damage",
      	"(Bullet|Drone) Speed",
      	"(Bullet|Drone) (Health|Penetration)",
      	"(Bullet|Drone) Damage",
      	"Drone Count",
      	"Reload",
      	"Movement Speed",
      	"More games"

    ].join("|")})$`),

   	fillText = function(text, ...args) {

      	if(regexpR.test(text)) return;

      	let i;

      	if(regexpC.test(text) || this.fillStyle ==  "#ffff90") this.fillStyle = strokeColors[7].new, i = 1;
        else this.fillStyle = strokeColors[3].new;

      	i ^= 1;

        if(/^[0-9]+(\.[0-9][km])?$/.test(text)) this.fillStyle = [strokeColors[3].new, strokeColors[7].new][i];

       	_fillText.apply(this, [text, ...args]);

   	},

    strokeText = () => {},

    fillRect = function (x, y, w, h) {

      	if(["#456654", "#321123", "#0000ff", "#f3f1a9", "#c1adb8", "#aec1b7", "#becdc5", "#cdbdc6", "#8b9a92", "#9a8a93", "#adadad", "#bdbdbd", "#8a8a8a", "#ff0000"].includes(this.fillStyle)) return;

      	_fillRect.apply(this, arguments);

    },

    setTransform = function (a, b, c, d, e, f) {

      	if(this.fillStyle == "#456654") return _fillRect.apply(ctx7, [e, f, a, d]);
      	if(["#8b9a92", "#9a8a93", "#8a8a8a"].includes(this.fillStyle)) {

          	this.shadowColor = "#ff0000";
          	this.shadowBlur = 1

        }

        _setTransform.apply(this, arguments);

    },

    drawImage = function (img) {

      	if(img.src == `https://static.diep.io/title.png`) img.src = `https://i.imgur.com/hTy66ES.png`;

      	_drawImage.apply(this, arguments);

    },

    toString = function() {

    	switch(this) {

          	case fill: return _toString.call(_fill);
            case stroke: return _toString.call(_stroke);
          	case fillText: return _toString.call(_fillText);
          	case strokeText: return _toString.call(_strokeText);
          	case fillRect: return _toString.call(_fillRect);
          	case toString: return _toString.call(_toString);

        }

        return _toString.call(this);

    };

    p.fill = fill;
    p.stroke = stroke;
    p.fillText = fillText;
    p.strokeText = strokeText;
  	p.fillRect = fillRect;
  	p.setTransform = setTransform,
    p.drawImage = drawImage,
    Function.prototype.toString = toString;


  	// // // //


  	let

	c = document.getElementById("canvas"),

    c2 = document.createElement("canvas"),
    ctx2 = c2.getContext("2d"),

    c3 = document.createElement("canvas"),
   	ctx3 = c3.getContext("2d"),

    c4 = document.createElement("canvas"),
    ctx4 = c4.getContext("2d"),

	c5 = document.createElement("canvas"),
   	ctx5 = c5.getContext("2d"),

    c6 = document.createElement("canvas"),
   	ctx6 = c6.getContext("2d"),

    c7 = document.createElement("canvas"),
    ctx7 = c7.getContext("2d"),


    t = document.getElementById("textInput"),

    body = document.getElementsByTagName("body")[0];


  	t.style.color = strokeColors[7].new;
	c.style["mix-blend-mode"] = "screen";

    c2.width = c.width;
    c2.height = c.height;
    c2.style.width = "100%";
    c2.style.height = "100%";
    c2.style.position = "absolute";
    c2.style.top = "0px";
    c2.style.left = "0px";
    c2.style.zIndex = -3;

   	ctx2.fillStyle = "#1a0626";
  	_fillRect.apply(ctx2, [0, 0, c.width, c.height]);

    c3.width = c.width;
    c3.height = c.height;
    c3.style.width = "100%";
    c3.style.height = "100%";
    c3.style.position = "absolute";
    c3.style.top = "0px";
    c3.style.left = "0px";
    c3.style.zIndex = -1;
    c3.style.filter = "blur(0.15vw)";
    c3.style["mix-blend-mode"] = "screen";

    c4.width = c.width;
    c4.height = c.height;
    c4.style.width = "100%";
    c4.style.height = "100%";
    c4.style.position = "absolute";
    c4.style.top = "0px";
    c4.style.left = "0px";
    c4.style.zIndex = -1;
    c4.style.filter = "blur(0.3vw)";
    c4.style["mix-blend-mode"] = "screen";

    c5.width = c.width;
    c5.height = c.height;
    c5.style.width = "100%";
    c5.style.height = "100%";
    c5.style.position = "absolute";
    c5.style.top = "0px";
    c5.style.left = "0px";
    c5.style.zIndex = -1;
    c5.style.filter = "blur(0.9vw)";
    c5.style["mix-blend-mode"] = "screen";

    c6.width = c.width;
    c6.height = c.height;
    c6.style.width = "100%";
    c6.style.height = "100%";
    c6.style.position = "absolute";
    c6.style.top = "0px";
    c6.style.left = "0px";
    c6.style.zIndex = -1;
    c6.style.filter = "blur(1.8vw)";
    c6.style["mix-blend-mode"] = "screen";

  	c7.width = c.width;
    c7.height = c.height;
    c7.style.width = "100%";
    c7.style.height = "100%";
    c7.style.position = "absolute";
    c7.style.top = "0px";
    c7.style.left = "0px";
    c7.style.zIndex = -2;

    ctx7.fillStyle = "#15051f";

  	body.appendChild(c2);
  	body.appendChild(c3);
  	body.appendChild(c4);
  	body.appendChild(c5);
  	body.appendChild(c6);
  	body.appendChild(c7);

    window.addEventListener("resize", () => {

        c2.width = c.width;
        c2.height = c.height;
        ctx2.fillStyle = "#1a0626";
  		_fillRect.apply(ctx2, [0, 0, c.width, c.height]);

        c3.width = c.width;
        c3.height = c.height;

        c4.width = c.width;
        c4.height = c.height;

        c5.width = c.width;
        c5.height = c.height;

        c6.width = c.width;
        c6.height = c.height;

       	c7.width = c.width;
        c7.height = c.height;
        ctx7.fillStyle = "#15051f";

    }, false);


	Object.defineProperty(window, "input", {

        set: x => {

            delete window.input
            window.input = x;

            [

                "ui_replace_colors" + " 0x987789 0x789987".repeat(4),
                "ren_fps true",
                "ren_changelog false",
                "ren_achievements false",
                "ren_background_solid_color true",
                "ren_background_color 0x000000",
                "ren_border_color_alpha 1",
                "ren_border_color 0x456654",
                "ren_minimap_border_color 0xcf33ff",
                "ren_minimap_background_color 0x321123",
                "ren_stroke_soft_color_intensity -1"

            ].forEach(x => input.execute(x));

            for(let x of fillColors.concat(strokeColors)) {

                if(!x.cmd) continue;
                x.cmd.forEach(cmd => input.execute(`${cmd} 0x${x.color.slice(1)}`));

            }

        },

        configurable: true,
        enumerable: true

    });

  	const

    contexts = [ctx3, ctx4, ctx5, ctx6],
    canvases = [c3, c4, c5, c6];

   	let mode = localStorage.diepNeonMode;
  	if (mode === undefined) {

      	mode = contexts.length-1;
      	localStorage.setItem("diepNeonMode", contexts.length-1);

    };

  	let loop;

  	const getLoop = (e, f) => {

    	if(e.code === "KeyG") {

        	!f && mode++;
          	if(mode > contexts.length) mode = 0;
          	localStorage.setItem("diepNeonMode", mode);

          	loop = () => {

              	contexts.slice(0, mode).forEach(ctx => ctx.drawImage(c, 0, 0));
				ctx7.clearRect(0,0, c.width*2, c.height*2);
				requestAnimationFrame(loop);

            }

            canvases.slice(0, mode).forEach(el => body.appendChild(el));
          	canvases.slice(mode, canvases.length).forEach(el => body.removeChild(el));

        }

    }

    getLoop({code: "KeyG"}, true);

   	document.addEventListener("keydown", getLoop);

  	loop();


})();