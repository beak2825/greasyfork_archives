// ==UserScript==
// @name         bv7_jpeg2array_b
// @namespace    bv7
// @version      0.7
// @description  jpeg -> array
// @author       bv7
// @include      file:///D:/projects/JSProjects/bv7bbc/bv7_bbc_dark/bv_dev_canvas*.html
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

class BaseImage {
	constructor() {
		this._src   = null;
		this.onload = (() => '');
	}
	load() {
		GM_xmlhttpRequest({
			method          : 'GET',
			url             : this._src,
			overrideMimeType: 'text/plain; charset=x-user-defined',
			onload          : (v) => {
				//let t = new Date();
				let data = new Uint8Array(v.responseText.length);
				data.forEach((val, i) => data[i] = v.responseText.charCodeAt(i));
				this.parse(data);
				this.onload();
				//console.log('Parse image for', ((new Date()) - t), 'ms');
			}
		});		
	}
	get src() {return this._src;}
	set src(v) {
		if (this._src !== v) {
			this._src = v;
			this.load();
		}
    }
	drawCanvas(canvas, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight) {
		let context = canvas.getContext('2d');
		let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		this.copyToImageData(imageData);
		context.putImageData(imageData, 0, 0);
		
	}
}


class JpegImage extends BaseImage {
	parse(data) {
		this.jfif  = null;
		this.adobe = null;
		const dctZigZag = new Int32Array([
			 0,
			 1,  8,
			16,  9,  2,
			 3, 10, 17, 24,
			32, 25, 18, 11, 4,
			 5, 12, 19, 26, 33, 40,
			48, 41, 34, 27, 20, 13,  6,
			 7, 14, 21, 28, 35, 42, 49, 56,
			57, 50, 43, 36, 29, 22, 15,
			23, 30, 37, 44, 51, 58,
			59, 52, 45, 38, 31,
			39, 46, 53, 60,
			61, 54, 47,
			55, 62,
			63
		]);
		const dctCos1    = 4017; // cos(  pi/16)
		const dctSin1    =  799; // sin(  pi/16)
		const dctCos3    = 3406; // cos(3*pi/16)
		const dctSin3    = 2276; // sin(3*pi/16)
		const dctCos6    = 1567; // cos(6*pi/16)
		const dctSin6    = 3784; // sin(6*pi/16)
		const dctSqrt2   = 5793; // sqrt(2)
		const dctSqrt1d2 = 2896; // sqrt(2) / 2
		let frame;
		let resetInterval;
		let quantizationTables = [];
		let frames             = [];
		let huffmanTablesAC    = [];
		let huffmanTablesDC    = [];
		let offset             = 0;
		//let readUint8  = () => data[offset++];
		let readUint16 = () => ((data[offset++] << 8) | data[offset++]);
		let readDataBlock = () => {
			let length = readUint16() - 2;
			let value = data.slice(offset, offset + length - 2);
			offset += length;
			return value;
		};
		let buildHuffmanTable = (codeLengths, values) => {
			let length = codeLengths.length;
			while (length > 0 && !codeLengths[length - 1]) length--;
			let p = {children: [], index: 0};
			let code = [p];
			let i, j, k, q, codeLength;
			for (i = 0, k = 0; i < length; i++) {
				codeLength = codeLengths[i];
				for (j = 0; j < codeLength; j++, k++) {
					p = code.pop();
					p.children[p.index] = values[k];
					while (p.index > 0) p = code.pop();
					p.index++;
					code.push(p);
					while (code.length <= i) {
						code.push(q = {children: [], index: 0});
						p.children[p.index] = q.children;
						p = q;
					}
				}
				if (i + 1 < length) { // p here points to last code
					code.push(q = {children: [], index: 0});
					p.children[p.index] = q.children;
					p = q;
				}
			}
			return code[0].children;
		};
		let buildComponentData = (component) => {
			let lines          = [];
			let samplesPerLine = component.blocksPerLine << 3;
			let R              = new Int32Array(64);
			let r              = new Uint8Array(64);
			// A port of poppler's IDCT method which in turn is taken from:
			//   Christoph Loeffler, Adriaan Ligtenberg, George S. Moschytz,
			//   "Practical Fast 1-D DCT Algorithms with 11 Multiplications",
			//   IEEE Intl. Conf. on Acoustics, Speech & Signal Processing, 1989,
			//   988-991.
			let quantizeAndInverse = (zz, dataOut, dataIn) => {
				let v, u, i;
				let v0, v1, v2, v3, v4, v5, v6, v7;
				let u0, u1, u2, u3, u4, u5, u6, u7;
				// dequant
				for (i = 0; i < 64; i++) dataIn[i] = zz[i] * component.quantizationTable[i];
				for (i = 0; i < 64; i += 8) {
					v0 = dataIn[i    ];
					v1 = dataIn[i + 1];
					v2 = dataIn[i + 2];
					v3 = dataIn[i + 3];
					v4 = dataIn[i + 4];
					v5 = dataIn[i + 5];
					v6 = dataIn[i + 6];
					v7 = dataIn[i + 7];
					// check for all-zero AC coefficients
					if (
						v1 == 0 &&
						v2 == 0 &&
						v3 == 0 &&
						v4 == 0 &&
						v5 == 0 &&
						v6 == 0 &&
						v7 == 0
					) dataIn[i    ] =
						dataIn[i + 1] =
						dataIn[i + 2] =
						dataIn[i + 3] =
						dataIn[i + 4] =
						dataIn[i + 5] =
						dataIn[i + 6] =
						dataIn[i + 7] = (dctSqrt2 * v0 + 512) >> 10;
					else {
						// stage 4
						u0 = (dctSqrt2 * v0 + 128) >> 8;
						u1 = (dctSqrt2 * v4 + 128) >> 8;
						u4 = (dctSqrt1d2 * (v1 - v7) + 128) >> 8;
						u5 = v3 << 4;
						u6 = v5 << 4;
						u7 = (dctSqrt1d2 * (v1 + v7) + 128) >> 8;
						// stage 3
						v0 = (u0 + u1 + 1) >> 1;
						v1 = (u0 - u1 + 1) >> 1;
						u2 = (v2 * dctCos6 - v6 * dctSin6 + 128) >> 8;
						v3 = (v2 * dctSin6 + v6 * dctCos6 + 128) >> 8;
						v4 = (u4 + u6 + 1) >> 1;
						v5 = (u7 - u5 + 1) >> 1;
						u3 = (u4 - u6 + 1) >> 1;
						v7 = (u7 + u5 + 1) >> 1;
						// stage 2
						u0 = (v0 + v3 + 1) >> 1;
						u1 = (v1 + u2 + 1) >> 1;
						v2 = (v1 - u2 + 1) >> 1;
						v6 = (v0 - v3 + 1) >> 1;
						u4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
						u5 = (v5 * dctCos1 - u3 * dctSin1 + 2048) >> 12;
						u6 = (v5 * dctSin1 + u3 * dctCos1 + 2048) >> 12;
						u7 = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
						// stage 1
						dataIn[i    ] = u0 + u7;
						dataIn[i + 1] = u1 + u6;
						dataIn[i + 2] = v2 + u5;
						dataIn[i + 3] = v6 + u4;
						dataIn[i + 4] = v6 - u4;
						dataIn[i + 5] = v2 - u5;
						dataIn[i + 6] = u1 - u6;
						dataIn[i + 7] = u0 - u7;
					}
				}
				// inverse DCT on columns
				for (i = 0; i < 8; ++i) {
					v0 = dataIn[i     ];
					v1 = dataIn[i +  8];
					v2 = dataIn[i + 16];
					v3 = dataIn[i + 24];
					v4 = dataIn[i + 32];
					v5 = dataIn[i + 40];
					v6 = dataIn[i + 48];
					v7 = dataIn[i + 56];
					// check for all-zero AC coefficients
					if (
						v1 == 0 &&
						v2 == 0 &&
						v3 == 0 &&
						v4 == 0 &&
						v5 == 0 &&
						v6 == 0 &&
						v7 == 0
					) dataIn[i] =
						dataIn[i +  8] =
						dataIn[i + 16] =
						dataIn[i + 24] =
						dataIn[i + 32] =
						dataIn[i + 40] =
						dataIn[i + 48] =
						dataIn[i + 56] = (dctSqrt2 * v0 + 8192) >> 14;
					else {
						// stage 4
						u0 = (dctSqrt2 * v0 + 2048) >> 12;
						u1 = (dctSqrt2 * v4 + 2048) >> 12;
						u4 = (dctSqrt1d2 * (v1 - v7) + 2048) >> 12;
						u7 = (dctSqrt1d2 * (v1 + v7) + 2048) >> 12;
						// stage 3
						v0 = (u0 + u1 + 1) >> 1;
						v1 = (u0 - u1 + 1) >> 1;
						u2 = (v2 * dctCos6 - v6 * dctSin6 + 2048) >> 12;
						u5 = (v2 * dctSin6 + v6 * dctCos6 + 2048) >> 12;
						v4 = (u4 + v5 + 1) >> 1;
						u6 = (u7 - v3 + 1) >> 1;
						u3 = (u4 - v5 + 1) >> 1;
						v7 = (u7 + v3 + 1) >> 1;
						// stage 2
						u0 = (v0 + u5 + 1) >> 1;
						u1 = (v1 + u2 + 1) >> 1;
						v2 = (v1 - u2 + 1) >> 1;
						v6 = (v0 - u5 + 1) >> 1;
						u4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
						v3 = (u6 * dctCos1 - u3 * dctSin1 + 2048) >> 12;
						v5 = (u6 * dctSin1 + u3 * dctCos1 + 2048) >> 12;
						u7 = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
						// stage 1
						dataIn[i     ] = u0 + u7;
						dataIn[i +  8] = u1 + v5;
						dataIn[i + 16] = v2 + v3;
						dataIn[i + 24] = v6 + u4;
						dataIn[i + 32] = v6 - u4;
						dataIn[i + 40] = v2 - v3;
						dataIn[i + 48] = u1 - v5;
						dataIn[i + 56] = u0 - u7;
					}
				}
				// convert to 8-bit integers
				let sample;
				for (i = 0; i < 64; i++) {
					sample = 128 + ((dataIn[i] + 8) >> 4);
					dataOut[i] = sample < 0 ? 0 : sample > 0xFF ? 0xFF : sample;
				}
			};
			let scanLine, j, sample, line, samleI, scanLineJ;
			let blockRow;
			let blockCol;
			for (blockRow = 0; blockRow < component.blocksPerColumn; blockRow++) {
				scanLine = blockRow << 3;
				lines.push(new Uint8Array(samplesPerLine));
				lines.push(new Uint8Array(samplesPerLine));
				lines.push(new Uint8Array(samplesPerLine));
				lines.push(new Uint8Array(samplesPerLine));
				lines.push(new Uint8Array(samplesPerLine));
				lines.push(new Uint8Array(samplesPerLine));
				lines.push(new Uint8Array(samplesPerLine));
				lines.push(new Uint8Array(samplesPerLine));
				for (blockCol = 0; blockCol < component.blocksPerLine; blockCol++) {
					quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);
					sample = blockCol << 3;
					for (j = 0, offset = 0, scanLineJ = scanLine; j < 8; j++) {
						line = lines[scanLineJ++];
						samleI = sample;
						line[samleI++] = r[offset++];
						line[samleI++] = r[offset++];
						line[samleI++] = r[offset++];
						line[samleI++] = r[offset++];
						line[samleI++] = r[offset++];
						line[samleI++] = r[offset++];
						line[samleI++] = r[offset++];
						line[samleI++] = r[offset++];
					}
				}
			}
			return lines;
		}
		let prepareComponents = (frame) => {
			let component, i, j, row;
			let blocksPerLineForMcu;
			let blocksPerColumnForMcu;
			frame.maxH = 0;
			frame.maxV = 0;
			frame.componentsOrder.forEach((v) => {
				component = frame.components[v];
				if (frame.maxH < component.h) frame.maxH = component.h;
				if (frame.maxV < component.v) frame.maxV = component.v;
			});
			frame.mcusPerLine   = Math.ceil(frame.samplesPerLine / 8 / frame.maxH);
			frame.mcusPerColumn = Math.ceil(frame.scanLines      / 8 / frame.maxV);
			frame.componentsOrder.forEach((v) => {
				component = frame.components[v];
	            component.blocksPerLine   = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / frame.maxH);
	            component.blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines      / 8) * component.v / frame.maxV);
				component.blocks          = [];
				blocksPerLineForMcu       = frame.mcusPerLine   * component.h;
				blocksPerColumnForMcu     = frame.mcusPerColumn * component.v;
				for (i = 0; i < blocksPerColumnForMcu; i++) {
					row = [];
					for (j = 0; j < blocksPerLineForMcu; j++) row.push(new Int32Array(64));
					component.blocks.push(row);
	            }
			});
		};
		let decodeScan = (components, resetInterval, spectralStart, spectralEnd, successivePrev, successive) => {
			let bitsData  = 0;
			let bitsCount = 0;
			let readBit = () => {
				if (bitsCount > 0) bitsCount--;
				else {
					bitsData = data[offset++];
					if (bitsData == 0xFF) {
						let nextByte = data[offset++];
						if (nextByte) throw new Error('Unexpected marker: ' + ((bitsData << 8) | nextByte).toString(16));
						// unstuff 0
					}
					bitsCount = 7;
				}
				return (bitsData >> bitsCount) & 1;
			};
			let decodeHuffman = (tree) => {
				let node = tree;
				let bit;
				while ((bit = readBit()) !== null) if (typeof (node = node[bit]) === 'number') return node;
				else if (typeof node !== 'object') throw new Error('Invalid huffman sequence');
				return null;
			};
			let receive = (length) => {
				let bit;
				let n = 0;
				while ((length--) > 0) if ((bit = readBit()) === null) return;
				else n = (n << 1) | bit;
				return n;
			};
			let receiveAndExtend = (length) => {
				let n = receive(length);
				return (n >= 1 << (length - 1)) ? n : (n + (-1 << length) + 1);
			};
			let decodeBaseline = (component, zz) => {
				let rs, s, r;
				let t = decodeHuffman(component.huffmanTableDC);
				let diff = t === 0 ? 0 : receiveAndExtend(t);
				zz[0] = (component.pred += diff);
				let k = 1;
				while (k < 64) {
					r  = (rs = decodeHuffman(component.huffmanTableAC)) >> 4;
					if ((s  = rs & 15) === 0) {
						if (r < 15) break;
						else {
							k += 16;
							continue;
						}
					} else {
						zz[dctZigZag[k += r]] = receiveAndExtend(s);
						k++;
					}
				}
			}
			let decodeDCFirst = (component, zz) => {
				let t = decodeHuffman(component.huffmanTableDC);
				zz[0] = (component.pred += t === 0 ? 0 : (receiveAndExtend(t) << successive));
			}
			let decodeDCSuccessive = (component, zz) => zz[0] |= readBit() << successive;
			let eobrun = 0;
			let decodeACFirst = (component, zz) => {
				if (eobrun > 0) eobrun--;
				else {
					let rs, s, r;
					let k = spectralStart;
					while (k <= spectralEnd) {
						r  = (rs = decodeHuffman(component.huffmanTableAC)) >> 4;
						if ((s  = rs & 15) === 0) {
							if (r < 15) {
								eobrun = receive(r) + (1 << r) - 1;
								break;
							} else k += 16;
						} else {
							zz[dctZigZag[k += r]] = receiveAndExtend(s) * (1 << successive);
							k++;
						}
					}
				}
			};
			let successiveACState     = 0;
			let successiveACNextValue = 0;
			let decodeACSuccessive = (component, zz) => {
				let z, direction, rs, s;
				let k = spectralStart;
				let r = 0;
				while(k <= spectralEnd) {
					direction = zz[z = dctZigZag[k]] < 0 ? -1 : 1;
					switch (successiveACState) {
						case 0: // initial state
							r = (rs = decodeHuffman(component.huffmanTableAC)) >> 4;
							if ((s  = rs & 15) === 0) {
								if (r < 15) {
									eobrun            = receive(r) + (1 << r);
									successiveACState = 4;
								} else {
									r = 16;
									successiveACState = 1;
								}
							} else if (s !== 1) throw new Error('Invalid ACn encoding');
							else {
								successiveACNextValue = receiveAndExtend(s);
								successiveACState     = r ? 2 : 3;
							}
							continue;
						case 1: // skipping r zero items
						case 2:
							if (zz[z]) zz[z] += (readBit() << successive) * direction;
							else if ((--r) === 0) successiveACState = successiveACState == 2 ? 3 : 0;
							break;
						case 3: // set value for a zero item
							if (zz[z]) zz[z] += (readBit() << successive) * direction;
							else {
								zz[z]             = successiveACNextValue << successive;
								successiveACState = 0;
							}
							break;
						case 4: // eob
							if (zz[z]) zz[z] += (readBit() << successive) * direction;
							break;
					}
					k++;
				}
				if (successiveACState === 4) {
					eobrun--;
					if (eobrun === 0) successiveACState = 0;
				}
			};
			let decodeMcu = (component, decode, mcu, row, col) => decode(
				component,
				component.blocks[((mcu / frame.mcusPerLine) | 0) * component.v + row][(mcu % frame.mcusPerLine) * component.h + col]
			);
			let decodeBlock = (component, decode, mcu) => decode(
				component,
				component.blocks[(mcu / component.blocksPerLine) | 0][mcu % component.blocksPerLine]
			);
			let decodeFn = frame.progressive ? (
				spectralStart === 0 ? (
					successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive
				) : (
					successivePrev === 0 ? decodeACFirst : decodeACSuccessive
				)
			) : decodeBaseline;
			let mcu         = 0;
			let mcuExpected = (components.length == 1) ? (
				components[0].blocksPerLine * components[0].blocksPerColumn
			) : (
				frame.mcusPerLine * frame.mcusPerColumn
			);
			if (!resetInterval) resetInterval = mcuExpected;
			let component, n, i, j, k, marker;
			while (mcu < mcuExpected) {
				// reset interval stuff
				components.forEach((v) => v.pred = 0);
				eobrun = 0;
				if (components.length == 1) {
					component = components[0];
					for (n = 0; n < resetInterval; n++, mcu++) decodeBlock(component, decodeFn, mcu);
				} else for (n = 0; n < resetInterval; n++) {
					for (i = 0; i < components.length; i++) {
						component = components[i];
						for (j = 0; j < component.v; j++) for (k = 0; k < component.h; k++) decodeMcu(component, decodeFn, mcu, j, k);
					}
					if ((++mcu) === mcuExpected) break; // If we've reached our expected MCU's, stop decoding
				}
				// find marker
				bitsCount = 0;
				marker    = readUint16();
				if (marker < 0xFFD0 || marker > 0xFFD7) { // !RSTx
					offset -= 2;
					if (marker < 0xFF00) throw new Error('Marker was not found');
					break;
				}
			}
		};
		let fileMarker = readUint16();
		if (fileMarker != 0xFFD8) throw new Error('SOI not found'); // SOI (Start of Image)
		//let length;
		while ((fileMarker = readUint16()) != 0xFFD9) { // EOI (End of image)
			switch(fileMarker) {
				case 0xFF00: break;
				case 0xFFE0: // APP0 (Application Specific)
				case 0xFFE1: // APP1
				case 0xFFE2: // APP2
				case 0xFFE3: // APP3
				case 0xFFE4: // APP4
				case 0xFFE5: // APP5
				case 0xFFE6: // APP6
				case 0xFFE7: // APP7
				case 0xFFE8: // APP8
				case 0xFFE9: // APP9
				case 0xFFEA: // APP10
				case 0xFFEB: // APP11
				case 0xFFEC: // APP12
				case 0xFFED: // APP13
				case 0xFFEE: // APP14
				case 0xFFEF: // APP15
				case 0xFFFE: // COM (Comment)
					let appData = readDataBlock();
					switch(fileMarker){
						case 0xFFE0:
							if (
								appData[0] === 0x4A &&
								appData[1] === 0x46 &&
								appData[2] === 0x49 &&
								appData[3] === 0x46 &&
								appData[4] === 0
							) this.jfif = { // 'JFIF\x00'
								version     : { major: appData[5], minor: appData[6] },
								densityUnits: appData[7],
								xDensity    : (appData[8 ] << 8) | appData[9 ],
								yDensity    : (appData[10] << 8) | appData[11],
								thumbWidth  : appData[12],
								thumbHeight : appData[13],
								thumbData   : appData.slice(14, 14 + 3 * appData[12] * appData[13] + 1)
							};
							break;
						// TODO APP1 - Exif
						case 0xFFEE:
							if (
								appData[0] === 0x41 &&
								appData[1] === 0x64 &&
								appData[2] === 0x6F &&
								appData[3] === 0x62 &&
								appData[4] === 0x65 &&
								appData[5] === 0
							) this.adobe = { // 'Adobe\x00'
								version      : appData[6],
								flags0       : (appData[7] << 8) | appData[8],
								flags1       : (appData[9] << 8) | appData[10],
								transformCode: appData[11]
							};
							break;
					}
					break;
				case 0xFFDB: // DQT (Define Quantization Tables)
					let quantizationTableSpec, tableData;
					let quantizationTablesLength = readUint16();
					let quantizationTablesEnd = quantizationTablesLength + offset - 2;
					while (offset < quantizationTablesEnd) {
						quantizationTableSpec = data[offset++];
						tableData = new Int32Array(64);
						switch(quantizationTableSpec >> 4){
							case 0: // 8 bit values
								tableData.forEach((v, i) => tableData[dctZigZag[i]] = data[offset++]);
								break;
							case 1: //16 bit
								tableData.forEach((v, i) => tableData[dctZigZag[i]] = readUint16());
								break;
							default:
								throw new Error('DQT: invalid table spec: ' + (quantizationTableSpec >> 4));
						}
						quantizationTables[quantizationTableSpec & 15] = tableData;
					}
					break;
				case 0xFFC0: // SOF0 (Start of Frame, Baseline DCT)
				case 0xFFC1: // SOF1 (Start of Frame, Extended DCT)
				case 0xFFC2: // SOF2 (Start of Frame, Progressive DCT)
					let b;
					readUint16(); // skip data length
					frame = {
						extended       : fileMarker === 0xFFC1,
						progressive    : fileMarker === 0xFFC2,
						precision      : data[offset++],
						scanLines      : readUint16(),
						samplesPerLine : readUint16(),
						components     : {},
						componentsOrder: new Uint8Array(data[offset++])
					};
					frame.componentsOrder.forEach((v, i) => {
						frame.components[frame.componentsOrder[i] = data[offset++]] = {
							h              : (b = data[offset++]) >> 4,
							v              : b & 15,
							quantizationIdx: data[offset++]
						};
					});
					prepareComponents(frame);
					frames.push(frame);
					break;
				case 0xFFC4: // DHT (Define Huffman Tables)
					let huffmanLength = readUint16() - 2;
					while (huffmanLength > 0) {
						let huffmanTableSpec = data[offset++];
						let codeLengths      = new Uint8Array(16);
						let codeLengthSum    = 0;
						codeLengths.forEach((v, i) => codeLengthSum += (codeLengths[i] = data[offset++]));
						let huffmanValues = new Uint8Array(codeLengthSum);
						huffmanValues.forEach((v, i) => huffmanValues[i] = data[offset++]);
						huffmanLength -= 1 + codeLengths.length + huffmanValues.length;
						((huffmanTableSpec >> 4) === 0 ? huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
					}
					break;
				case 0xFFDD: // DRI (Define Restart Interval)
					readUint16(); // skip data length
					resetInterval = readUint16();
					break;
				case 0xFFDA: // SOS (Start of Scan)
					readUint16(); // scanLength
					let components = [];
					for (let selectorsCount = data[offset++]; selectorsCount > 0; selectorsCount--) {
						let component = frame.components[data[offset++]];
						let tableSpec = data[offset++];
						component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
						component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
						components.push(component);
					}
					let spectralStart = data[offset++];
					let spectralEnd   = data[offset++];
					let successiveApproximation = data[offset++];
					decodeScan(
						components,
						resetInterval,
						spectralStart,
						spectralEnd,
						successiveApproximation >> 4,
						successiveApproximation & 15
					);
					break;
				case 0xFFFF: // Fill bytes
					if (data[offset] !== 0xFF) offset--; // Avoid skipping a valid marker.
					break;
				default:
					// could be incorrect encoding -- last 0xFF byte of the previous
					// block was eaten by the encoder
					if (data[offset - 3] == data[offset - 2] && data[offset - 2] >= 0xC0 && d1 <= 0xFE) {
						offset -= 3;
						break;
					}
					else throw new Error('Unknown JPEG marker ' + fileMarker.toString(16));
			}
		}
		if (frames.length != 1) throw new Error("Only single frame JPEGs supported");
		// set each frame's components quantization table
		let j;
		frames.forEach((v) => {
			for (j in v.components) {
				v.components[j].quantizationTable = quantizationTables[v.components[j].quantizationIdx];
				delete v.components[j].quantizationIdx;
			}
		});
		this.width      = frame.samplesPerLine;
		this.height     = frame.scanLines;
		this.components = [];
		frame.componentsOrder.forEach((v) => {
			let component = frame.components[v];
			this.components.push({
				lines : buildComponentData(component),
				scaleX: component.h / frame.maxH,
				scaleY: component.v / frame.maxV
			});
		});
	}
	clampTo8bit(a) {
		return a < 0 ? 0 : a > 255 ? 255 : a;
	}
	getData(width, height) {
		let scaleX = this.width  / width ;
		let scaleY = this.height / height;
		let data   = new Uint8Array(width * height * this.components.length);
		let offset = 0;
		// The default transform for three components is true
		// The adobe transform marker overrides any previous setting
		let colorTransform = (this.adobe && this.adobe.transformCode) ||
			(typeof this.colorTransform === 'undefined') ||
			!!this.colorTransform;
		let y, x;
		let component0Line, component1Line, component2Line, component3Line;
		let component0    , component1    , component2    , component3    ;
		let c0            , c1            , c2            , c3            ;
		switch (this.components.length) {
			case 1:
				component0 = this.components[0];
				for (y = 0; y < height; y++) {
					component0Line = component0.lines[0 | (y * component0.scaleY * scaleY)];
					for (x = 0; x < width; x++) data[offset++] = component0Line[0 | (x * component0.scaleX * scaleX)]; // Y
				}
				break;
			case 2:
				component0 = this.components[0];
				component1 = this.components[1];
				for (y = 0; y < height; y++) {
					component0Line = component0.lines[0 | (y * component0.scaleY * scaleY)];
					component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
					for (x = 0; x < width; x++) {
						data[offset++] = component0Line[0 | (x * component0.scaleX * scaleX)]; // Y
						data[offset++] = component1Line[0 | (x * component1.scaleX * scaleX)]; // Y
					}
				}
				break;
			case 3:
				component0 = this.components[0];
				component1 = this.components[1];
				component2 = this.components[2];
				for (y = 0; y < height; y++) {
					component0Line = component0.lines[0 | (y * component0.scaleY * scaleY)];
					component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
					component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
					for (x = 0; x < width; x++) {
						c0 = component0Line[0 | (x * component0.scaleX * scaleX)]; // R / Y
						c1 = component1Line[0 | (x * component1.scaleX * scaleX)]; // G / Cb
						c2 = component2Line[0 | (x * component2.scaleX * scaleX)]; // B / Cr
						if (colorTransform) {
							data[offset++] = this.clampTo8bit(c0 + 1.402 * (c2 - 128));                               // R
							data[offset++] = this.clampTo8bit(c0 - 0.3441363 * (c1 - 128) - 0.71413636 * (c2 - 128)); // G
							data[offset++] = this.clampTo8bit(c0 + 1.772 * (c1 - 128));                               // B
						} else {
							data[offset++] = c0; // R
							data[offset++] = c1; // G
							data[offset++] = c2; // B
						}
					}
				}
				break;
			case 4:
				if (this.adobe) { // PDF might compress two component data in custom colorspace
					component0 = this.components[0];
					component1 = this.components[1];
					component2 = this.components[2];
					component3 = this.components[3];
					for (y = 0; y < height; y++) {
						component0Line = component0.lines[0 | (y * component0.scaleY * scaleY)];
						component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
						component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
						component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
						for (x = 0; x < width; x++) {
							c0 = component0Line[0 | (x * component0.scaleX * scaleX)]; // C  / Y
							c1 = component1Line[0 | (x * component1.scaleX * scaleX)]; // M  / Cb
							c2 = component2Line[0 | (x * component2.scaleX * scaleX)]; // Ye / Cr
							c3 = component3Line[0 | (x * component3.scaleX * scaleX)]; // K  / K
							if (colorTransform) {
								data[offset++] = this.clampTo8bit(c0 + 1.402 * (c2 - 128));                               // C
								data[offset++] = this.clampTo8bit(c0 - 0.3441363 * (c1 - 128) - 0.71413636 * (c2 - 128)); // M
								data[offset++] = this.clampTo8bit(c0 + 1.772 * (c1 - 128));                               // Ye
							} else {
								data[offset++] = 255 - c0; // C
								data[offset++] = 255 - c1; // M
								data[offset++] = 255 - c2; // Ye
							}
							data[offset++] = 255 - c3;     // K
						}
					}
				}
				else throw new Error('Unsupported color mode (4 components)');
				break;
			default:
				throw new Error('Unsupported color mode');
		}
		return data;
    }
	copyToImageData(imageData) {
		let scaleX = this.width  / imageData.width ;
		let scaleY = this.height / imageData.height;
		let offset = 0;
		let j      = 0;
		// The default transform for three components is true
		// The adobe transform marker overrides any previous setting
		let colorTransform = (this.adobe && this.adobe.transformCode) ||
			(typeof this.colorTransform === 'undefined') ||
			!!this.colorTransform;
		let y, x;
		let component0Line, component1Line, component2Line, component3Line;
		let component0    , component1    , component2    , component3    ;
		let c0            , c1            , c2            , c3            ;
		switch (this.components.length) {
			case 1:
				component0 = this.components[0];
				for (y = 0; y < imageData.height; y++) {
					component0Line = component0.lines[0 | (y * component0.scaleY * scaleY)];
					for (x = 0; x < imageData.width; x++) {
						imageData.data[j++] =
						imageData.data[j++] =
						imageData.data[j++] = component0Line[0 | (x * component0.scaleX * scaleX)]; // Y
						imageData.data[j++] = 255;
					}
				}
				break;
			case 3:
				component0 = this.components[0];
				component1 = this.components[1];
				component2 = this.components[2];
				for (y = 0; y < imageData.height; y++) {
					component0Line = component0.lines[0 | (y * component0.scaleY * scaleY)];
					component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
					component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
					for (x = 0; x < imageData.width; x++) {
						c0 = component0Line[0 | (x * component0.scaleX * scaleX)]; // R / Y
						c1 = component1Line[0 | (x * component1.scaleX * scaleX)]; // G / Cb
						c2 = component2Line[0 | (x * component2.scaleX * scaleX)]; // B / Cr
						if (colorTransform) {
							imageData.data[j++] = this.clampTo8bit(c0 + 1.402 * (c2 - 128));                               // R
							imageData.data[j++] = this.clampTo8bit(c0 - 0.3441363 * (c1 - 128) - 0.71413636 * (c2 - 128)); // G
							imageData.data[j++] = this.clampTo8bit(c0 + 1.772 * (c1 - 128));                               // B
						} else {
							imageData.data[j++] = c0; // R
							imageData.data[j++] = c1; // G
							imageData.data[j++] = c2; // B
						}
						imageData.data[j++] = 255;
					}
				}
				break;
			case 4:
				if (this.adobe) { // PDF might compress two component data in custom colorspace
					component0 = this.components[0];
					component1 = this.components[1];
					component2 = this.components[2];
					component3 = this.components[3];
					for (y = 0; y < imageData.height; y++) {
						component0Line = component0.lines[0 | (y * component0.scaleY * scaleY)];
						component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
						component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
						component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
						for (x = 0; x < imageData.width; x++) {
							c0 = component0Line[0 | (x * component0.scaleX * scaleX)]; // C  / Y
							c1 = component1Line[0 | (x * component1.scaleX * scaleX)]; // M  / Cb
							c2 = component2Line[0 | (x * component2.scaleX * scaleX)]; // Ye / Cr
							c3 = component3Line[0 | (x * component3.scaleX * scaleX)]; // K  / K
							if (colorTransform) {
								imageData.data[j++] = 0 | ((255 - this.clampTo8bit(c0 + 1.402     * (c2 - 128)                          )) * c3 / 255); // R
								imageData.data[j++] = 0 | ((255 - this.clampTo8bit(c0 - 0.3441363 * (c1 - 128) - 0.71413636 * (c2 - 128))) * c3 / 255); // G
								imageData.data[j++] = 0 | ((255 - this.clampTo8bit(c0 + 1.772     * (c1 - 128)                          )) * c3 / 255); // B
							} else {
								imageData.data[j++] = 0 | (c0 * c3 / 255); // R
								imageData.data[j++] = 0 | (c1 * c3 / 255); // G
								imageData.data[j++] = 0 | (c2 * c3 / 255); // B
							}
							imageData.data[j++] = 255;
						}
					}
				} else throw new Error('Unsupported color mode (4 components)');
				break;
			default:
				throw new Error('Unsupported color mode');
		}
		return imageData;
    }
}

/*
let jpeg = new JpegImage();
jpeg.onload = function() {
	this.drawCanvas(document.getElementById('canvas'), 10, 10, 400, 500, 50, 50);
	console.log('jpeg =', this);
};
jpeg.src = document.getElementById('img1').src;
*/