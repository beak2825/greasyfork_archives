// ==UserScript==
// @name         Auto Farm Map Coins
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto farm map coins
// @author       You
// @match        *://agma.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498524/Auto%20Farm%20Map%20Coins.user.js
// @updateURL https://update.greasyfork.org/scripts/498524/Auto%20Farm%20Map%20Coins.meta.js
// ==/UserScript==
let send;
const osend = WebSocket.prototype.send
WebSocket.prototype.send = function() {
	send = (...args) => osend.call(this, ...args)
	return osend.apply(this, arguments)
}
const afterloaded= ()=>{
	let curserTimeout;
	function curserMsg(e, t, r) {
		"green" == t && (t = "rgb(0, 192, 0)"),
			"red" == t && (t = "rgb(255, 0, 0)"),
			"gray" == t && (t = "rgb(153, 153, 153)"),
			clearTimeout(curserTimeout),
			$("#curser").text(e).show().css("color", t),
			0 !== r && (curserTimeout = setTimeout(() => $("#curser").fadeOut(400), r ?? 4e3));
	}
	var checkbox = document.createElement("input");
	(checkbox.type = "checkbox"), (checkbox.id = "autocoins"), (checkbox.name = "myCheckbox");
	var label = document.createElement("label");
	(label.textContent = "Auto Coins"), label.setAttribute("for", "autocoins");
	$("#roleSettings").append(checkbox),
		$("#roleSettings").append(label),
		$("#roleSettings").append("<br>"),
		$("#settingTab3,.rab-radius").click(() => {
			$("#roleSettings").css("display", "block");
			document.getElementById("autocoins").disabled = false;
			setInterval(() => {
				if (document.getElementById("autocoins").disabled = true) {
					document.getElementById("autocoins").disabled = false;
					$("#roleSettings").css("display", "block");
				}
			}, 0);
		});
	checkbox.addEventListener("change", function() {
		checkbox.checked ?
			(console.log("Checkbox is checked. Set to true."), curserMsg("Auto Coins turned ON", "green")) :
			(console.log("Checkbox is not checked. Set to false."), curserMsg("Auto Coins turned OFF", "green"));
	});

	function moveUp() {
		const t = {
			clientX: window.innerWidth / 2,
			clientY: -1e7
		};
		$("canvas").trigger($.Event("mousemove", t));
	}

	function moveDown() {
		$("canvas").trigger($.Event("mousemove", {
			clientX: window.innerWidth / 2,
			clientY: 1e7
		}));
	}

	function moveRight() {
		const t = {
			clientX: 1e7,
			clientY: window.innerHeight / 2
		};
		$("canvas").trigger($.Event("mousemove", t));
	}

	function moveLeft() {
		$("canvas").trigger($.Event("mousemove", {
			clientX: -1e7,
			clientY: window.innerHeight / 2
		}));
	}
	const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));
	async function move() {
		moveLeft(),
			await sleep(8e3),
			moveUp(),
			await sleep(5e3),
			moveRight(),
			await sleep(8e3),
			moveDown(),
			await sleep(5e3);
	}
	let xd, xd1, xd2, xd3;
	const split = () => {
		if ("block" != $("#advert").css("display") && "block" != $("#overlays").css("display")) {
			send(new Uint8Array([17]))
		};
	};
	checkbox.addEventListener("change", function() {
		if (this.checked) {
			setFixedZoom(true);
			coinsamount = 0;
			xd = setInterval(() => {
				"block" == $("#advert").css("display") && $("#advertContinue").click(), "block" == $("#overlays").css("display") && setNick($('#nick').val());;
			}, 1e3);
			xd2 = setInterval(() => {
				move();
			}, 27e3);
			xd1 = setInterval(() => {
				split();
			}, 200);
			xd3 = setInterval(async () => {
				if (JSON.parse(document.getElementById("cellsAmount").innerHTML) <= 4 && asd) {
					split();
					await sleep(60);
					split();
					await sleep(60)
                    					if (JSON.parse(document.getElementById("cellsAmount").innerHTML) <= 6 && "block" != $("#advert").css("display") && "block" != $("#overlays").css("display") && asd) {
                                   setTimeout(()=>{
						rspwn($('#nick').val());

                    },3000)
                                   }
				}
			}, 60)
			setTimeout(move, 500);
		} else {
			clearInterval(xd)
			clearInterval(xd1)
			clearInterval(xd2)
			clearInterval(xd3)
		}
	})

	function mousein(x, y) {
		$("canvas").trigger($.Event("mousemove", {
			clientX: x,
			clientY: y
		}));
	}
	var regex = /ects\/9.(png|lo)/;
	let ordrawimage = CanvasRenderingContext2D.prototype.drawImage,
		coinsamount = 0,
		asd = true,
		timer,
		timer1,existed=false,
        positions=[],counter=0;
	CanvasRenderingContext2D.prototype.drawImage = async function(){
		if (this.canvas.id === 'canvas') {
            if (checkbox.checked) {
			if (regex.test(arguments[0].src)) {

					let matrix = this.getTransform();
                    if (coinsamount >= 500){
                        send(new Uint8Array([17]))
                        await sleep(60)
                        send(new Uint8Array([17]))
                        coinsamount = 0}
					setTimeout(()=>{coinsamount += 1},1);
					timer = Date.now();
					let x1 = matrix.e,
						y1 = matrix.f;
					asd = false;
					clearInterval(xd1);
                   /* for(let i=0;i<positions.length;i++){
                    if(positions[i].x==x1&&positions[i].y==y1){
                        existed = true;
                        break;
                    }
                        else{existed=false}
                    }
                    if(!existed)positions.push({x:x1,y:y1})
					mousein(positions[counter].x, positions[counter].y)*/
                    mousein(x1,y1)

			} else {
				let timer1 = Date.now();
				if ((timer1 - timer) > 100) {
					timer = undefined;
					setTimeout(()=>{asd = true},400)
					xd1 = setInterval(() => {
						split();
					}, 200);
				}
			}
                }
		}
		ordrawimage.apply(this, arguments)
	}
};
if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(afterloaded, 0)
}else{
    document.addEventListener("DOMContentLoaded", afterloaded)
};