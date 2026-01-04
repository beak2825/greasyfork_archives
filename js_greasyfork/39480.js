// ==UserScript==
// @name         bv7_canvas
// @namespace    bv7
// @version      0.3
// @description  canvas
// @author       bv7
// @require      https://greasyfork.org/scripts/39476-bv7-jpeg-encoder/code/bv7_jpeg_encoder.js
// @require      https://greasyfork.org/scripts/39479-bv7-jpeg2array/code/bv7_jpeg2array.js
// ==/UserScript==

class Canvas {
	constructor() {
		this.domCanvas = document.createElement('canvas');
		this.jpegEncoder = new JpegEncoder();
	}
	set width(v) {
		this.domCanvas.width = v;
		this.onresize();
	}
	set height(v) {
		this.domCanvas.height = v;
		this.onresize();
	}
	get width () {
		return this.domCanvas.width;
	}
	get height() {
		return this.domCanvas.height;
	}
	onresize() {
	}
	getContext(_id) {
		switch (_id) {
			case '2d':
				this.context = new class {
					constructor(canvas) {
						this.canvas     = canvas;
						this.domContext = this.canvas.domCanvas.getContext('2d');
						this.imageData  = this.domContext.getImageData(0, 0, this.canvas.domCanvas.width, this.canvas.domCanvas.height);
					}
					drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, then) {
						let myImage;
						let draw = () => {
							if (dWidth && sWidth && dHeight && sHeight) {
								let syStep  = sHeight / dHeight;
								let sxStep  = sWidth  / dWidth;
								let dyStep  = dHeight / sHeight;
								let dxStep  = dWidth  / sWidth ;
								let syStart = Math.max(0, sy, sy - dy / dyStep);
								let sxStart = Math.max(0, sx, sx - dx / dxStep);
								let syEnd   = Math.min(myImage.height, sy + sHeight, sy + (this.imageData.height - dy) / dyStep);
								let sxEnd   = Math.min(myImage.width , sx + sWidth , sx + (this.imageData.width  - dx) / dxStep);
								let dyStart = dy + (syStart - sy) * dyStep;
								let dxStart = dx + (sxStart - sx) * dxStep;
								let dyEnd   = dy + (syEnd   - sy) * dyStep;
								let dxEnd   = dx + (sxEnd   - sx) * dxStep;
								let sh1 = Math.max(1, syStep);
								let sw1 = Math.max(1, sxStep);
								let dh1 = Math.max(1, dyStep);
								let dw1 = Math.max(1, dxStep);
								let siPerLine, siStartLine, siStart;
								let diPerLine, diStartLine, diStart;
								let sy1, sy1Next, sy2Start, sy2End;
								let sx1, sx1Next, sx2Start, sx2End;
								let dy1, dy1Next, dy2Start, dy2End;
								let dx1, dx1Next, dx2Start, dx2End;
								let s2count;
								let r, g, b, a;
								siPerLine = myImage.imageData.width * 4;
								diPerLine =    this.imageData.width * 4;
								sy2Start  = Math.round(sy1 = syStart);
								dy2Start  = Math.round(dy1 = dyStart);
								while (sy1 < syEnd) {
									sy2End   = Math.round(sy1Next = sy1 + sh1);
									dy2End   = Math.round(dy1Next = dy1 + dh1);
									sx2Start = Math.round(sx1 = sxStart);
									dx2Start = Math.round(dx1 = dxStart);
									siStartLine = sy2Start * siPerLine;
									diStartLine = dy2Start * diPerLine;
									while (sx1 < sxEnd) {
										sx2End  = Math.round(sx1Next = sx1 + sw1);
										dx2End  = Math.round(dx1Next = dx1 + dw1);
										siStart = siStartLine + sx2Start * 4;
										diStart = diStartLine + dx2Start * 4;
										s2count = (sy2End - sy2Start) * (sx2End - sx2Start);
										r = g = b = a = 0;
										for (let sy2 = sy2Start; sy2 < sy2End; sy2++, siStart += siPerLine) for (let sx2 = sx2Start, si = siStart; sx2 < sx2End; sx2++) {
											r += myImage.imageData.data[si++];
											g += myImage.imageData.data[si++];
											b += myImage.imageData.data[si++];
											a += myImage.imageData.data[si++];
										}
										for (let dy2 = dy2Start; dy2 < dy2End; dy2++, diStart += diPerLine) for (let dx2 = dx2Start, di = diStart; dx2 < dx2End; dx2++) {
											this.imageData.data[di++] = (r - r % s2count) / s2count;
											this.imageData.data[di++] = (g - g % s2count) / s2count;
											this.imageData.data[di++] = (b - b % s2count) / s2count;
											this.imageData.data[di++] = (a - a % s2count) / s2count;
										}
										sx1      = sx1Next;
										dx1      = dx1Next;
										sx2Start = sx2End;
										dx2Start = dx2End;
									}
									sy1      = sy1Next;
									dy1      = dy1Next;
									sy2Start = sy2End;
									dy2Start = dy2End;
								}
								this.domContext.putImageData(this.imageData, 0, 0);
							}
							if (then) then();
						};
						if (Canvas.images.some((v) => (myImage = v).src == image.src)) 
							draw();
						else {
							myImage = new JpegImage();
							myImage.onload = () => {
								myImage.imageData = this.domContext.createImageData(myImage.width, myImage.height);
								myImage.copyToImageData(myImage.imageData);
								Canvas.images.push(myImage);
								draw();
							};
							myImage.src = image.src;
						}
					};
				} (this);
				break;
		}
		return this.context;
	}
	toDataUrl(type = 'image/png', encoderOptions = 0.92) {
		let r;
		switch (type) {
			case 'image/jpeg':
				r = this.jpegEncoder.encode(this.context.imageData, encoderOptions);
				break;
			default:
				r = '';
		}
		return r;
	}
}
Canvas.images = [];
