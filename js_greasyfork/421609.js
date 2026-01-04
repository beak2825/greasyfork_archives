// ==UserScript==
// @name            flaggy
// @description     generates avatars with deterministic pseudorandomness
// @match           https://www.metaculus.com/*
// @grant           GM_addStyle
// @version         1.0
// @author          casens
// @namespace https://greasyfork.org/users/673939
// @downloadURL https://update.greasyfork.org/scripts/421609/flaggy.user.js
// @updateURL https://update.greasyfork.org/scripts/421609/flaggy.meta.js
// ==/UserScript==

const svgNameSpace = 'http://www.w3.org/2000/svg';

function bigChungus(input) {
	//
	//                   DO NOT ROLL YOUR OWN CRYPTO
	//
	//               DO NOT USE THIS FOR ANYTHING IMPORTANT
	//
	// the sum of the 4 components is less than 9 * 10 ** 15, aka BigInt.
	// you can't do precise modulus on BigInts!
	// the sum is always greater than 10**12, so 9_999_999_967 is a prime less
	// than that.
	//
	// this function has slightly different output in chrome v firefox
	//
	const num = Math.floor(input);
	const val = Math.floor( ( ((5 ** (1 / 3)) ** (52 + (num % 13)))
													+ ((2 ** (1 / 2)) ** (54 + (num % 47)))
													+ ((3 ** (1 / 7)) ** (115 + (num % 109)))
													+	((7 ** (1 / 23)) ** (194 + (num % 223)))
													) % 9999999967
												);
	return val;
}

function createSvg() {
	const svg = document.createElementNS(svgNameSpace, 'svg');
	svg.setAttribute('version', '1.1');
	svg.setAttribute('baseProfile', 'full');
	return svg;
}

function setBg(seed, color) {
	const svg = createSvg();
	const determiner = (seed % 101) / 101
	svg.isCircle = false;
	const dimensions = [];
	if (determiner < .3) {
		dimensions.push(50);
		dimensions.push(50);
	} else if (determiner < .43) {
		dimensions.push(59);
		dimensions.push(42);
	} else if (determiner < .56) {
		dimensions.push(42);
		dimensions.push(59);
	} else if (determiner < .69) {
		dimensions.push(67);
		dimensions.push(37);
	} else {
		dimensions.push(56);
		dimensions.push(56);
		svg.style.borderRadius = '28px';
		svg.isCircle = true;
	}
	svg.setAttribute('width', dimensions[0]);
	svg.setAttribute('height', dimensions[1]);
	const bgLayer = drawRect(dimensions[0], dimensions[1], color);
	bgLayer.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
	svg.appendChild(bgLayer);
	return svg;
}

function drawCircle(radius, inputColor) {
	const circle = document.createElementNS(svgNameSpace, 'circle');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	circle.setAttribute('r', radius);
	circle.setAttribute('fill', color);
	return circle;
}

function drawLine(start, finish, thickness, inputColor) {
	const line = document.createElementNS(svgNameSpace, 'line');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	line.setAttribute('x1', start[0]);
	line.setAttribute('y1', start[1]);
	line.setAttribute('x2', finish[0]);
	line.setAttribute('y2', finish[1]);
	line.setAttribute('stroke-width', thickness);
	line.setAttribute('stroke', color);
	return line;
}

function drawRect(width, height, inputColor) {
	const rect = document.createElementNS(svgNameSpace, 'rect');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	rect.setAttribute('x', -width / 2);
	rect.setAttribute('y', -height / 2);
	rect.setAttribute('width', width);
	rect.setAttribute('height', height);
	rect.setAttribute('fill', color);
	return rect;
}

function drawRhombus(axisX, axisY, inputColor) {
	const rhom = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	const points = [
		`0,${-axisY / 2}`,
		`${axisX / 2},0`,
		`0,${axisY / 2}`,
		`${-axisX / 2},0`
	];
	rhom.setAttribute('points', points.join(' '));
	rhom.setAttribute('fill', color);
	return rhom;
}

function drawTriangle(sideLength, inputColor) {
	const triangle = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	const pt1 = `0,${sideLength / (3 ** 0.5)}`;
	const pt2 = `${sideLength / 2},${-(sideLength / (2 * (3 ** 0.5)))}`;
	const pt3 = `${-(sideLength / 2)},${-(sideLength / (2 * (3 ** 0.5)))}`;
	triangle.setAttribute('points', pt1 + ' ' + pt2 + ' ' + pt3);
	triangle.setAttribute('fill', color);
	return triangle;
}

function drawPent(sideLength, inputColor) {
	const pent = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	const points = [
		`0,${-sideLength * 0.85}`,
		`${sideLength * 0.81},${-sideLength * 0.26}`,
		`${sideLength / 2},${sideLength * 0.69}`,
		`${-sideLength / 2},${sideLength * 0.69}`,
		`${-sideLength * 0.81},${-sideLength * 0.26}`
	];
	pent.setAttribute('points', points.join(' '));
	pent.setAttribute('fill', color);
	return pent;
}

function drawStar(sideLength, inputColor) {
	const pent = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	// sideLength in this case refers to distance from star-end to neighboring
	// (non-connected) end.  aka, the length of one point edge plus a central
	// pentagon edge.  aka, one point edge * 1.618
	const points = [
		`0,${-sideLength * 0.85}`,
		`${sideLength / 2},${sideLength * 0.69}`,
		`${-sideLength * 0.81},${-sideLength * 0.26}`,
		`${sideLength * 0.81},${-sideLength * 0.26}`,
		`${-sideLength / 2},${sideLength * 0.69}`
	];
	pent.setAttribute('points', points.join(' '));
	pent.setAttribute('fill', color);
	return pent;
}

function drawHex(sideLength, inputColor) {
	const hex = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	const points = [
		`${-sideLength / 2},${-sideLength * (3 ** 0.5) / 2}`,
		`${sideLength / 2},${-sideLength * (3 ** 0.5) / 2}`,
		`${sideLength}, 0`,
		`${sideLength / 2},${sideLength * (3 ** 0.5) / 2}`,
		`${-sideLength / 2},${sideLength * (3 ** 0.5) / 2}`,
		`${-sideLength}, 0`
	];
	hex.setAttribute('points', points.join(' '));
	hex.setAttribute('fill', color);
	return hex;
}

function selectLightness(seed, numOfSelections) {
	const colors = ['color'];
	let colorCount = 1;
	// sometimes this loop will run with no effect.  it's not count i up to num
	for (let i = 0; colors.length < numOfSelections; i++) {
		const determiner = (bigChungus(seed + 4312774567655 + i) % 241) / 241
		if ((determiner < .16) && (!colors.includes('black'))) {
			colors.push('black');
		} else if ((determiner < .30) && (!colors.includes('white'))) {
			colors.push('white');
		} else if ((determiner < .42) && (!colors.includes('gray'))) {
			colors.push('gray');
		} else if (determiner < (1 - (colorCount * .18))) {
			// colorCount decreases the chances of multiple colors being selected
			colorCount++;
			colors.push('color');
		}
		if (i > 49) { break; }
	}
	// * chef's kiss *
	const shuffleDeterminer = seed % 6;
	const shuffledColors = [];
	shuffledColors.push(colors.splice((shuffleDeterminer % 3), 1)[0]);
	shuffledColors.push(colors.splice((shuffleDeterminer % 2), 1)[0]);
	shuffledColors.push(colors[0]);
	return shuffledColors;
}

function selectHues(inputColors, seed) {
	// only guanateed to pass when you have less than 4 hues to select.
	// (you could get more if you narrowed the hue contrast.
	// current min contrast val = 75)
	const colors = [];
	const hues = [];
	for (let index = 0; index < inputColors.length; index++) {
		if        (inputColors[index] === 'white') {
			colors.push([0, 0, 100]);
		} else if (inputColors[index] === 'black') {
			colors.push([0, 0, 0]);
		} else if (inputColors[index] === 'gray') {
			colors.push([0, 0, 25 + (bigChungus(seed + (69 * index)) % 47)]);
		} else {
			// colors, presumably
			// if no hues exist yet
			if (hues[0] === undefined) {
				let val = (bigChungus(seed + index) % 360);
				hues.push(val);
			} else {
				// generate new hue with minimum hue contrast
				const huesNeeded = hues.length + 1;
				for (let salt = 0; hues.length < huesNeeded; salt++) {
					const hue = bigChungus(seed + (index * 10000) + salt) % 360;
					let hueAllowed = true;
					const minContrast = 75;
					hues.forEach((oldHue) => {
						if (   ( (hue > (oldHue - minContrast      )  )
									 &&(hue < (oldHue + minContrast      )  )  )
								 ||( (hue > (oldHue - minContrast + 360)  )
									 &&(hue < (oldHue + minContrast + 360)  )  )
								 ||( (hue > (oldHue - minContrast - 360)  )
									 &&(hue < (oldHue + minContrast - 360)  )  )
							 ) {
							hueAllowed = false;
						}
					});
					if (hueAllowed) {
						hues.push(hue);
					}
					if (salt > 99) {
						colors[index][0] = hue;
						hues.push(699);
						console.log('hue selection broke somehow');
						break;
					}
				}
			}
			const saturation = 100 - (bigChungus(seed + (500 * index)) % 53);
			const lightness = 25 + (bigChungus(seed + (8888 * index)) % 47);
			colors.push([ hues[hues.length - 1], saturation, lightness ]);
		}
	}
	let salt = 0;
	// lightness contrast
	for (let i = 0; i + 1 < colors.length; i++) {
		if (colors[i][2] == 0
			||colors[i][2] == 100
			||colors[i + 1][2] == 0
			||colors[i + 1][2] == 100 ) {
			// do nothing
		} else if (Math.abs(colors[i][2] - colors[i + 1][2]) < 29) {
			colors[i + 1][2] = 19 + (bigChungus(seed + 3861533478814 + salt) % 63);
			i--;
		}
		salt++;
	}
	return colors;
}

function selectColors(seed) {
	const lightVals = selectLightness(seed, 3);
	const colors = selectHues(lightVals, seed);
	return colors;
}

function selectLayer(seed, dimensions, colors, colorCount, isCircle) {
	const sortedLengths = dimensions.slice().sort();
	if (isCircle) {sortedLengths[0] *= 0.8}
	const layerGroup = document.createElementNS(svgNameSpace, 'g');
	layerGroup.noEmblem = false;
	const rotGroup = document.createElementNS(svgNameSpace, 'g');
	const rotGroupTop = document.createElementNS(svgNameSpace, 'g');
	layerGroup.append(rotGroup);
	layerGroup.append(rotGroupTop);
	layerGroup.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
	const diagThickness = (dimensions[0] * dimensions[1]) / ((dimensions[0] ** 2) + (dimensions[1] ** 2)) ** 0.5;
	const bandThickness = (seed % 69877) / 69877;
	const rotDeterminer = (seed % 81353) / 81353;
	const posDeterminer = (seed % 28711) / 28711;
	const doubleBandsDet = (seed % 2137) / 2137;
	const determiner = (seed % 1009) / 1009;
	if        (determiner < .15) {
		//console.log('half horizontal bands');
		const layer = drawRect(dimensions[0], dimensions[1] / 2, colors[1]);
		layer.setAttribute('transform', `translate(0, ${-dimensions[1] / 4})`);
		layerGroup.appendChild(layer);
		if (colorCount > 1) {
			//console.log('three horizontal bands');
			layer.setAttribute('transform', `translate(0, ${-dimensions[1] / 12})`);
			const layerTop = drawRect(dimensions[0], dimensions[1] / 3, colors[2]);
			layerTop.setAttribute('transform', `translate(0, ${-dimensions[1] / 3})`);
			layerGroup.appendChild(layerTop);
		}
	} else if (determiner < .30) {
		//console.log('half vertical band');
		const layer = drawRect(dimensions[0] / 2, dimensions[1], colors[1]);
		layer.setAttribute('transform', `translate(${-dimensions[0] / 4})`);
		layerGroup.appendChild(layer);
		if (colorCount > 1) {
			//console.log('three vertical bands');
			layer.setAttribute('transform', `translate(${-dimensions[0] / 12})`);
			const layerTop = drawRect(dimensions[0] / 3, dimensions[1], colors[2]);
			layerTop.setAttribute('transform', `translate(${-dimensions[0] / 3})`);
			layerGroup.appendChild(layerTop);
		}
	} else if (determiner < .45) {
		//console.log('half diagonal');
		layerGroup.setAttribute('transform', `translate(0)`);
		const layer = drawLine([-dimensions[0] / 2, dimensions[1]], [dimensions[0], -dimensions[1] / 2], diagThickness, colors[1]);
		layerGroup.appendChild(layer);
		if (colorCount > 1) {
			//console.log('three diag bands');
			const layerTop = drawLine([-dimensions[0] / 2, dimensions[1]], [dimensions[0], -dimensions[1] / 2], diagThickness, colors[2]);
			layer.setAttribute('transform', `translate(${dimensions[0] / 6}, ${dimensions[1] / 6})`);
			layerTop.setAttribute('transform', `translate(${-dimensions[0] / 6}, ${-dimensions[1] / 6})`);
			if (isCircle) {
				layer.setAttribute('transform', `translate(${dimensions[0] * 3 / 24}, ${dimensions[1] * 3 / 24})`);
				layerTop.setAttribute('transform', `translate(${-dimensions[0] * 3 / 24}, ${-dimensions[1] * 3 / 24})`);
			}
			layerGroup.appendChild(layerTop);
		}
	} else if (determiner < .60) {
		//console.log('half other diagonal');
		layerGroup.setAttribute('transform', `translate(0)`);
		const layer = drawLine([0, -dimensions[1] / 2], [dimensions[0] * 3 / 2, dimensions[1]], diagThickness, colors[1]);
		layerGroup.appendChild(layer);
		if (colorCount > 1) {
			//console.log('three diag bands');
			const layerTop = drawLine([0, -dimensions[1] / 2], [dimensions[0] * 3 / 2, dimensions[1]], diagThickness, colors[2]);
			layer.setAttribute('transform', `translate(${-dimensions[0] / 6}, ${dimensions[1] / 6})`);
			layerTop.setAttribute('transform', `translate(${dimensions[0] / 6}, ${-dimensions[1] / 6})`);
			layerGroup.appendChild(layerTop);
			if (isCircle) {
				layer.setAttribute('transform', `translate(${-dimensions[0] * 3 / 24}, ${dimensions[1] * 3 / 24})`);
				layerTop.setAttribute('transform', `translate(${dimensions[0] * 3 / 24}, ${-dimensions[1] * 3 / 24})`);
			}
		}
	} else if (determiner < .90) {
		//console.log('radial rays');
		if (posDeterminer < .66 && dimensions[0] !== dimensions[1]) {
			// offset for nordic style cross
			layerGroup.noEmblem = true;
			if (!isCircle) {
				layerGroup.setAttribute('transform', `translate(${sortedLengths[0]/2},${sortedLengths[0]/2})`);
			}
		}
		const baseRay = [[0, 0], [0, -sortedLengths[1]]];
		let rayCount = 2 + ((seed % 577) % 6)
		if (rayCount === 7) {rayCount++}
		const rayThickness = 4 + ((bandThickness * 26) * (sortedLengths[0] / sortedLengths[1]) / (rayCount ** 0.7))
		if (rayCount === 2) {
			const ray1 = drawLine(baseRay[0], baseRay[1], rayThickness, colors[1]);
			const ray2 = ray1.cloneNode()
		  ray2.setAttribute('transform', `rotate(180)`);
			if (doubleBandsDet < .4) {
				const bgRay1 = drawLine(baseRay[0], baseRay[1], rayThickness * 1.23, colors[0]);
				const trimRay1 = drawLine(baseRay[0], baseRay[1], rayThickness * 1.42, colors[1]);
				const bgRay2 = bgRay1.cloneNode()
				const trimRay2 = trimRay1.cloneNode()
				bgRay2.setAttribute('transform', `rotate(180)`);
				trimRay2.setAttribute('transform', `rotate(180)`);
				rotGroup.appendChild(trimRay1);
				rotGroup.appendChild(trimRay2);
				rotGroup.appendChild(bgRay1);
				rotGroup.appendChild(bgRay2);
			}
			rotGroupTop.appendChild(ray1);
			rotGroupTop.appendChild(ray2);
			layerGroup.setAttribute('transform', `translate(${dimensions[0] / 2},${dimensions[1] / 2})`);
		} else if ((doubleBandsDet < .7) && (colorCount > 1)) {
			// overlapping colors 
			for (let i = 0; i < rayCount; i++) {
				ray1 = drawLine(baseRay[0], baseRay[1], rayThickness, colors[1]);
				ray1.setAttribute('transform', `rotate(${i * 360 / rayCount})`);
				let thicknessRatio = .5
				if (doubleBandsDet < .35) {
					thicknessRatio = .354
				}
				ray2 = drawLine(baseRay[0], baseRay[1], rayThickness * thicknessRatio, colors[2]);
				ray2.setAttribute('transform', `rotate(${i * 360 / rayCount})`);
				rotGroup.appendChild(ray1);
				rotGroupTop.appendChild(ray2);
			}
		} else if (rayCount % 2 == 0) {
			// alternating color rays
			for (let i = 0; i < rayCount; i++) {
				let colorSwitch = 1
				if (colorCount > 1 && rayCount > 5) {
					colorSwitch = 1 + (i % 2)
				} 
				ray = drawLine(baseRay[0], baseRay[1], rayThickness, colors[colorSwitch]);
				ray.setAttribute('transform', `rotate(${i * 360 / rayCount})`);
				if (i % 2 === 0) {
					rotGroup.appendChild(ray);
				} else {
					rotGroupTop.appendChild(ray);
				}
			}
		} else {
			// monocolor rays
			for (let i = 0; i < rayCount; i++) {
				ray = drawLine(baseRay[0], baseRay[1], rayThickness, colors[1]);
				ray.setAttribute('transform', `rotate(${i * 360 / rayCount})`);
				rotGroup.appendChild(ray);
			}
		}
		let degrees = 0
		if (rotDeterminer < .4) {
			degrees += 180 / rayCount
		}
		if ((rotDeterminer * 100) % 10 < 5) {
			degrees += 360 / rayCount
		}
		if ((rotDeterminer * 1000) % 10 < 4) {
			degrees += 90
		}
		if ((rayCount === 2) && ((rotDeterminer * 10000) % 10 < 5)) {
			degrees += 45
		}
		//console.log('deg', degrees);
		rotGroup.setAttribute('transform', `rotate(${degrees})`);
		rotGroupTop.setAttribute('transform', `rotate(${degrees})`);
	} else {
		// out of 1009
		//console.log('diagonal bands and crosses');
		layerGroup.setAttribute('transform', 'translate(0)');
		let thicknessRatio = .5
		if (doubleBandsDet < .5) {
			thicknessRatio = .354
		}
		const miniDeterminer = (seed % 643) / 643
		if (miniDeterminer < .30) {
			// diagonal nw to se
			const layer1 = drawLine([0, 0], [dimensions[0], dimensions[1]], 3 + bandThickness * 20, colors[1]);
			layerGroup.appendChild(layer1);
			if (colorCount > 1) {
				const layer2 = drawLine([0, 0], [dimensions[0], dimensions[1]], 3 + bandThickness * thicknessRatio * 20, colors[2]);
				layerGroup.appendChild(layer2);
			}
		} else if (miniDeterminer < .60) {
			//diagonal ne to sw
			const layer1 = drawLine([0, dimensions[1]], [dimensions[0], 0], 3 + bandThickness * 20, colors[1]);
			layerGroup.appendChild(layer1);
			if (colorCount > 1) {
				const layer2 = drawLine([0, dimensions[1]], [dimensions[0], 0], 3 + bandThickness * thicknessRatio * 20, colors[2]);
				layerGroup.appendChild(layer2);
			}
		} else {
			// cross
			const layer1 = drawLine([0, 0], [dimensions[0], dimensions[1]], (bandThickness * 16) + 3, colors[1]);
			const layer2 = drawLine([0, dimensions[1]], [dimensions[0], 0], (bandThickness * 16) + 3, colors[1]);
			layerGroup.appendChild(layer2);
			layerGroup.appendChild(layer1);
			if (colorCount > 1) {
				const layer3 = drawLine([0, 0], [dimensions[0], dimensions[1]], (bandThickness * thicknessRatio * 16) + 3, colors[2]);
				const layer4 = drawLine([0, dimensions[1]], [dimensions[0], 0], (bandThickness * thicknessRatio * 16) + 3, colors[2]);
				layerGroup.appendChild(layer3);
				layerGroup.appendChild(layer4);
			}
		}
	}
	if ((seed % 52391 ) / 52391 > .83) {layerGroup.noEmblem = true}
	return layerGroup;
}

function selectEmblem(seed, dimensions, color, bgIsCircle) {
	let smallestSide = dimensions[0];
	if (dimensions[0] > dimensions[1]) { smallestSide = dimensions[1]; }
	emblemSide = smallestSide
	if (bgIsCircle) { emblemSide *= 0.82; }
	emblemSide *= 0.91;
	const sizeDeterminer = (seed % 30529) / 30529
	const sizeVariance = 3.2
	const sizeLimit = 2.1
	emblemSide *= 1 + ((((sizeDeterminer - .5) / sizeVariance) ** 3) / (sizeLimit * (sizeVariance ** 3)))
	const rotateDeterminer = (seed % 74897) / 74897
	const determiner = (seed % 997) / 997
	const layerGroup = document.createElementNS(svgNameSpace, 'g');
	let emblem;
	if        (determiner < .16) {
		//console.log('circle');
		emblem = drawCircle((emblemSide * 0.28), color);
	} else if (determiner < .23) {
		//console.log('hex');
		emblem = drawHex((emblemSide * 0.3), color);
		let degrees = 0;
		if (rotateDeterminer > .5) {degrees = 30}
		emblem.setAttribute('transform', `rotate(${degrees})`);
	} else if (determiner < .31) {
		//console.log('pent');
		emblem = drawPent((emblemSide * 0.39), color);
		let degrees = 0;
		if (rotateDeterminer > .5) {degrees = 36}
		emblem.setAttribute('transform', `rotate(${degrees})`);
	} else if (determiner < .41) {
		//console.log('rhomb root 3');
		emblem = drawRhombus((emblemSide * 0.43), (emblemSide * 0.74), color);
		let degrees = 0;
		if (rotateDeterminer > .5) {degrees = 90}
		emblem.setAttribute('transform', `rotate(${degrees})`);
	} else if (determiner < .51) {
		//console.log('rhomb root 2');
		emblem = drawRhombus((emblemSide * 0.47), (emblemSide * 0.67), color);
		let degrees = 0;
		if (rotateDeterminer > .5) {degrees = 90}
		emblem.setAttribute('transform', `rotate(${degrees})`);
	} else if (determiner < .71) {
		//console.log('star');
		emblem = drawStar((emblemSide * 0.44), color);
		let degrees = 0;
		if (rotateDeterminer > .5) {degrees = 36}
		if (rotateDeterminer * 19 > 13) {degrees += 90}
		emblem.setAttribute('transform', `rotate(${degrees})`);
	} else if (determiner < .83) {
		//console.log('square');
		emblem = drawRect((emblemSide * 0.56), (emblemSide * 0.56), color);
		let degrees = 0;
		if (rotateDeterminer > .5) {degrees = 45}
		emblem.setAttribute('transform', `rotate(${degrees})`);
	} else {
		//console.log('triangle');
		emblem = drawTriangle((emblemSide * 0.65), color);
		let degrees = 0;
		if (rotateDeterminer > .5) {degrees = 60}
		if (rotateDeterminer * 19 > 12) {degrees += 90}
		emblem.setAttribute('transform', `rotate(${degrees})`);
	}
	const outlineDeterminer = (seed % 66883) / 66883
	if (outlineDeterminer < .35) {
		emblem.setAttribute('stroke', `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`);
		emblem.setAttribute('stroke-width', (smallestSide * 0.04));
		emblem.setAttribute('fill-opacity', 0);
	}
	layerGroup.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
	layerGroup.appendChild(emblem);
	return layerGroup; 
}

function selectFormat(seed, dimensions, colors, isCircle) {
	const determiner = (seed % 397) / 397
	const layerGroup = document.createElementNS(svgNameSpace, 'g');
	if (determiner < .35) {
		const layer = selectLayer(seed, dimensions, colors, 2, isCircle);
		layerGroup.appendChild(layer);
	} else if (determiner < .50) {
		// emblem with no bg layer
		const emblem = selectEmblem(seed, dimensions, colors[1], isCircle);
		layerGroup.appendChild(emblem);
	} else {
		// emblem plus mono layer
		const layer = selectLayer(seed, dimensions, colors, 1, isCircle);
		layerGroup.appendChild(layer);
		if (!layer.noEmblem) {
			const emblem = selectEmblem(seed, dimensions, colors[2], isCircle);
			layerGroup.appendChild(emblem);
		}
	}
	return layerGroup;
}

function createAvatar(inputID) {
	const seed = bigChungus(inputID);
	const colors = selectColors(seed);
	//console.log('these are the colors', colors);
	const svg = setBg(seed, colors[0]);
	const width = svg.width.baseVal.value;
	const height = svg.height.baseVal.value;
	const dimensions = [width, height];
	svg.appendChild(selectFormat(seed, dimensions, colors, svg.isCircle));
	return svg;
}

function createAvatarContainer() {
	const div = document.createElement('div');
	div.classList.add('avatar-container-div');
	div.style.width = 0;
	div.style.height = 0;
	return div;
}

function styleRankingsTable(rankingsTable) {
	const rows = rankingsTable.children[0].rows;
	rows[0].insertCell(1).outerHTML = "<th>Avatar</th>";
	for (let i = 1; i < rows.length; i++) {
		if (i % 2 === 1) {
			rows[i].style.background = '#8883';
		}
		rows[i].style.height = '5em';
		let userID = rows[i].children[1].children[0].href.match(/\d+\/?/)[0];
		//console.log(rows[i].children[1].children[0].textContent); // username!!
		const avatar = createAvatar(userID);
		rows[i].insertCell(1).appendChild(avatar);
		//rows[i][1].classList.add('avatar-container');
	}
}

function styleComments(commentNodeList) {
	commentNodeList.forEach(commentNode => {
		let userID = commentNode.href.match(/\d+\/$/)[0];
		userID = userID.slice(0, (userID.length - 1));
		const div = createAvatarContainer();
		avatars.push(div);
		//console.log(commentNode.innerText); // that's the user's username >:3
		const avatar = createAvatar(userID);
		avatar.style.position = 'relative';
		avatar.style.right = `${avatar.width.baseVal.value + 16}px`;
		div.appendChild(avatar);
		const commentContainer= commentNode.parentElement.parentElement.parentElement;
		if ( commentContainer.querySelector('.comment__prediction') !== null) {
			movePrediction(commentContainer, avatar.width.baseVal.value);
		}
		commentNode.prepend(div);
	});
}

function movePrediction(commentContainer, distance) {
	const prediction = commentContainer.querySelector('.comment__prediction');
	prediction.style.left = `${-(distance - 16) / 16}em`;
}

//function clearAvatars() {
//	console.log('clearing avatars');
//	avatars = document.querySelectorAll('.avatar-container');
//	avatars.forEach(div => div.remove());
//}

//function addListeners() {
//	const loadMoreBtns = document.querySelectorAll('._load-more');
//	loadMoreBtns.forEach(btn => btn.addEventListener('click', () => {
//		document.addEventListener('readystatechange', event => { 
//			if (event.target.readyState === "complete") {
//				main();
//			}
//		});
//		clearAvatars();
//	}));
//}

function main() {
	const commentNodeList = document.querySelectorAll('.comment__author');
	if (commentNodeList.length > 0) {
		styleComments(commentNodeList);
	}
	// on contest page these get generated by an event, not pageload
	const rankingsTable = document.querySelector('.rankings-table');
	if (rankingsTable !== null) {
		styleRankingsTable(rankingsTable);
	}
	// author of question.  not sure how to do this:
	//const authorUsername = document.querySelector('[auth-name]');
}

const avatars = []

// necessary to wait for DOM to finish loading
document.addEventListener('readystatechange', event => { 
	if (event.target.readyState === "complete") {
		main();
		addListeners();
	}
});







