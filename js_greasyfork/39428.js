// ==UserScript==
// @name         bv7_jpeg_encoder_b
// @namespace    bv7
// @version      0.1
// @description  array -> jpeg
// @author       bv7
// ==/UserScript==

// include      file:///D:/projects/JSProjects/bv7bbc/bv7_bbc_dark/bv_dev_canvas*.html
// require      https://greasyfork.org/scripts/38665-bv7-jpeg2array-b/code/bv7_jpeg2array_b.user.js
// require      https://greasyfork.org/scripts/39257-bv7-canvas-b/code/bv7_canvas_b.js
// require      https://raw.githubusercontent.com/owencm/javascript-jpeg-encoder/master/jpeg_encoder_basic.js
// run-at       document-idle
// grant        GM_xmlhttpRequest

class JpegEncoder {
	constructor() {
		this.zigZag = [
			0x00, 0x01, 0x05, 0x06, 0x0E, 0x0F, 0x1B, 0x1C,
			0x02, 0x04, 0x07, 0x0D, 0x10, 0x1A, 0x1D, 0x2A,
			0x03, 0x08, 0x0C, 0x11, 0x19, 0x1E, 0x29, 0x2B,
			0x09, 0x0B, 0x12, 0x18, 0x1F, 0x28, 0x2C, 0x35,
			0x0A, 0x13, 0x17, 0x20, 0x27, 0x2D, 0x34, 0x36,
			0x14, 0x16, 0x21, 0x26, 0x2E, 0x33, 0x37, 0x3C,
			0x15, 0x22, 0x25, 0x2F, 0x32, 0x38, 0x3B, 0x3D,
			0x23, 0x24, 0x30, 0x31, 0x39, 0x3A, 0x3E, 0x3F
		];
		this.std_dc_luminance_nrcodes = [
			0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01,
			0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
		];
		this.std_dc_luminance_values  = [
			0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
			0x08, 0x09, 0x0A, 0x0B
		];
		this.std_ac_luminance_nrcodes = [
			0x00, 0x02, 0x01, 0x03, 0x03, 0x02, 0x04, 0x03,
			0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7D
		];
		this.std_ac_luminance_values  = [
			0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12,
			0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
			0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1, 0x08,
			0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0,
			0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0A, 0x16,
			0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28,
			0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
			0x3A, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
			0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
			0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
			0x6A, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
			0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
			0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98,
			0x99, 0x9A, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7,
			0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6,
			0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5,
			0xC6, 0xC7, 0xC8, 0xC9, 0xCA, 0xD2, 0xD3, 0xD4,
			0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2,
			0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA,
			0xF1, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xF7, 0xF8,
			0xF9, 0xFA
		];
		this.std_dc_chrominance_nrcodes = [
			0x00, 0x03, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
			0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00
		];
		this.std_dc_chrominance_values = [
			0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
			0x08, 0x09, 0x0A, 0x0B
		];
		this.std_ac_chrominance_nrcodes = [
			0x00, 0x02, 0x01, 0x02, 0x04, 0x04, 0x03, 0x04,
			0x07, 0x05, 0x04, 0x04, 0x00, 0x01, 0x02, 0x77
		];
		this.std_ac_chrominance_values = [
			0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21,
			0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71,
			0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91,
			0xA1, 0xB1, 0xC1, 0x09, 0x23, 0x33, 0x52, 0xF0,
			0x15, 0x62, 0x72, 0xD1, 0x0A, 0x16, 0x24, 0x34,
			0xE1, 0x25, 0xF1, 0x17, 0x18, 0x19, 0x1A, 0x26,
			0x27, 0x28, 0x29, 0x2A, 0x35, 0x36, 0x37, 0x38,
			0x39, 0x3A, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48,
			0x49, 0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58,
			0x59, 0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68,
			0x69, 0x6A, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78,
			0x79, 0x7A, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
			0x88, 0x89, 0x8A, 0x92, 0x93, 0x94, 0x95, 0x96,
			0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3, 0xA4, 0xA5,
			0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4,
			0xB5, 0xB6, 0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3,
			0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9, 0xCA, 0xD2,
			0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA,
			0xE2, 0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9,
			0xEA, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xF7, 0xF8,
			0xF9, 0xFA
		];
		this.YDC_HT          = new Uint8Array(0x0B);
		this.UVDC_HT         = new Uint8Array(0x0B);
		this.YAC_HT          = new  Int8Array(0xFA);
		this.UVAC_HT         = new  Int8Array(0xFA);
		this.YDC_HT2         = new Uint8Array(0x0B);
		this.UVDC_HT2        = new Uint8Array(0x0B);
		this.YAC_HT2         = new Uint8Array(0xFA);
		this.UVAC_HT2        = new Uint8Array(0xFA);
		this.YTable          = new  Uint8Array(0x40  );
		this.UVTable         = new  Uint8Array(0x40  );
		this.fdtbl_Y         = [];
		this.fdtbl_UV        = new Float32Array(0x08);
		this.outputfDCTQuant = new Uint16Array(0x40  );
		this.DU              = new  Int16Array(0x40  );
		this.category        = new  Uint8Array(0xFFFE);
		this.bitcode         = new Uint16Array(0xFFFE);
		this.RGB_YUV_TABLE   = new Uint32Array(0x0800);
		this.YDU             = new  Int16Array(0x40  );
		this.UDU             = new  Int16Array(0x40  );
		this.VDU             = new  Int16Array(0x40  );
		this.initHuffmanTbl();
		this.initCategoryNumber();
		this.initRGBYUVTable();
	}
	// IO functions
	writeBits(value, posval) {
		while (posval >= 0) {
			if (value & (1 << posval)) this.bytenew |= (1 << this.bytepos);
			posval--;
			this.bytepos--;
			if (this.bytepos < 0) {
				this.writeByte(this.bytenew);
				if (this.bytenew == 0xFF) this.writeByte(0x00);
				this.bytepos = 7;
				this.bytenew = 0;
			}
		}
	}
	writeByte(value) {
		this.byteout.push(String.fromCharCode(value)); // write char directly instead of converting later
	}
	writeWord(value) {
		this.writeByte((value >> 8) & 0xFF);
        this.writeByte((value     ) & 0xFF);
    }
    writeAPP0() {
    	this.writeWord(0xFFE0); // marker
    	this.writeWord(0x0010); // length
    	this.writeByte(0x4A  ); // J
    	this.writeByte(0x46  ); // F
    	this.writeByte(0x49  ); // I
    	this.writeByte(0x46  ); // F
    	this.writeByte(0x00  ); // = "JFIF",'\0'
    	this.writeByte(0x01  ); // versionhi
    	this.writeByte(0x01  ); // versionlo
    	this.writeByte(0x00  ); // xyunits
    	this.writeWord(0x0001); // xdensity
    	this.writeWord(0x0001); // ydensity
    	this.writeByte(0x00  ); // thumbnwidth
    	this.writeByte(0x00  ); // thumbnheight
    }
	writeDQT() {
		this.writeWord(0xFFDB); // marker
		this.writeWord(0x0084); // length
		this.writeByte(0x00  );
		this.YTable.forEach((v) => this.writeByte(v));
        this.writeByte(0x01  );
        this.UVTable.forEach((v) => this.writeByte(v));
    }
	writeSOF0(width, height) {
		this.writeWord(0xFFC0); // marker
		this.writeWord(0x0011); // length, truecolor YUV JPG
		this.writeByte(0x08  ); // precision
		this.writeWord(height);
		this.writeWord(width );
		this.writeByte(0x03  ); // nrofcomponents
		this.writeByte(0x01  ); // IdY
		this.writeByte(0x11  ); // HVY
		this.writeByte(0x00  ); // QTY
		this.writeByte(0x02  ); // IdU
		this.writeByte(0x11  ); // HVU
		this.writeByte(0x01  ); // QTU
		this.writeByte(0x03  ); // IdV
		this.writeByte(0x11  ); // HVV
		this.writeByte(0x01  ); // QTV
	}
	writeDHT() {
		this.writeWord(0xFFC4); // marker
		this.writeWord(0x01A2); // length
		this.writeByte(0x00  ); // HTYDCinfo
		this.std_dc_luminance_nrcodes.forEach((v) => this.writeByte(v));
		this.std_dc_luminance_values.forEach((v) => this.writeByte(v));
		this.writeByte(0x10  ); // HTYACinfo
		this.std_ac_luminance_nrcodes.forEach((v) => this.writeByte(v));
		this.std_ac_luminance_values.forEach((v) => this.writeByte(v));
		this.writeByte(0x01  ); // HTUDCinfo
		this.std_dc_chrominance_nrcodes.forEach((v) => this.writeByte(v));
		this.std_dc_chrominance_values.forEach((v) => this.writeByte(v));
		this.writeByte(0x11  ); // HTUACinfo
		this.std_ac_chrominance_nrcodes.forEach((v) => this.writeByte(v));
		this.std_ac_chrominance_values.forEach((v) => this.writeByte(v));
	}
	writeSOS() {
		this.writeWord(0xFFDA); // marker
		this.writeWord(0x000C); // length
		this.writeByte(0x03  ); // nrofcomponents
		this.writeByte(0x01  ); // IdY
		this.writeByte(0x00  ); // HTY
		this.writeByte(0x02  ); // IdU
		this.writeByte(0x11  ); // HTU
		this.writeByte(0x03  ); // IdV
		this.writeByte(0x11  ); // HTV
		this.writeByte(0x00  ); // Ss
		this.writeByte(0x3F  ); // Se
		this.writeByte(0x00  ); // Bf
	}
	computeHuffmanTbl(nrcodes, std_table, HT, HT2) {
		let a, j;
		let codevalue    = 0;
		let pos_in_table = 0;
		nrcodes.forEach((nrcodesK, k) => {
			for (j = 0; j < nrcodesK; j++) {
				HT[a = std_table[pos_in_table++]] = codevalue++;
				HT2[a                           ] = k;
			}
			codevalue *= 2;
		});
	}
	initHuffmanTbl() {
		this.computeHuffmanTbl(this.std_dc_luminance_nrcodes  , this.std_dc_luminance_values  , this.YDC_HT , this.YDC_HT2 );
		this.computeHuffmanTbl(this.std_dc_chrominance_nrcodes, this.std_dc_chrominance_values, this.UVDC_HT, this.UVDC_HT2);
		this.computeHuffmanTbl(this.std_ac_luminance_nrcodes  , this.std_ac_luminance_values  , this.YAC_HT , this.YAC_HT2 );
		this.computeHuffmanTbl(this.std_ac_chrominance_nrcodes, this.std_ac_chrominance_values, this.UVAC_HT, this.UVAC_HT2);
	}
	initCategoryNumber() {
		let cat, nr, nrlower, nrupper, nrn;
		for (cat = 0, nrlower = 1, nrupper = 2; cat < 15; cat++, nrlower = nrupper, nrupper <<= 1) {
			for (nr = nrlower, nrn = nrlower - 1; nr < nrupper; nr++, nrn--) { //Positive & Negative numbers
				this.category[0x7FFF + nr] = this.category[0x7FFF - nr] = cat;
				this.bitcode[ 0x7FFF + nr] = nr;
				this.bitcode[ 0x7FFF - nr] = nrn;
			}
		}
	}
	initRGBYUVTable() {
		for(let i = 0x0000; i < 0x0100; i++) {
			this.RGB_YUV_TABLE[i         ] =   0x004C8B * i           ;
			this.RGB_YUV_TABLE[i + 0x0100] =   0x009646 * i           ;
			this.RGB_YUV_TABLE[i + 0x0200] =   0x001D2F * i + 0x008000;
			this.RGB_YUV_TABLE[i + 0x0300] = - 0x002B33 * i           ;
			this.RGB_YUV_TABLE[i + 0x0400] = - 0x0054CD * i           ;
			this.RGB_YUV_TABLE[i + 0x0500] =   0x008000 * i + 0x807FFF;
			this.RGB_YUV_TABLE[i + 0x0600] = - 0x006B2F * i           ;
			this.RGB_YUV_TABLE[i + 0x0700] = - 0x0014D1 * i           ;
		}
	}
	initQuantTables(sf) {
		let i, t;
		let row;
		let col;
		[
			0x10, 0x0B, 0x0A, 0x10, 0x18, 0x28, 0x33, 0x3D,
			0x0C, 0x0C, 0x0E, 0x13, 0x1A, 0x3A, 0x3C, 0x37,
			0x0E, 0x0D, 0x10, 0x18, 0x28, 0x39, 0x45, 0x38,
			0x0E, 0x11, 0x16, 0x1D, 0x33, 0x57, 0x50, 0x3E,
			0x12, 0x16, 0x25, 0x38, 0x44, 0x6D, 0x67, 0x4D,
			0x18, 0x23, 0x37, 0x40, 0x51, 0x68, 0x71, 0x5C,
			0x31, 0x40, 0x4E, 0x57, 0x67, 0x79, 0x78, 0x65,
			0x48, 0x5C, 0x5F, 0x62, 0x70, 0x64, 0x67, 0x63
		].forEach((v, i) => this.YTable[this.zigZag[i]] = (t = 0 | ((v * sf + 50) / 100)) < 1 ? 1 : t > 0xFF ? 0xFF : t);
		[
			0x11, 0x12, 0x18, 0x2F, 0x63, 0x63, 0x63, 0x63,
			0x12, 0x15, 0x1A, 0x42, 0x63, 0x63, 0x63, 0x63,
			0x18, 0x1A, 0x38, 0x63, 0x63, 0x63, 0x63, 0x63,
			0x2F, 0x42, 0x63, 0x63, 0x63, 0x63, 0x63, 0x63,
			0x63, 0x63, 0x63, 0x63, 0x63, 0x63, 0x63, 0x63,
			0x63, 0x63, 0x63, 0x63, 0x63, 0x63, 0x63, 0x63,
			0x63, 0x63, 0x63, 0x63, 0x63, 0x63, 0x63, 0x63,
			0x63, 0x63, 0x63, 0x63, 0x63, 0x63, 0x63, 0x63
		].forEach((v, i) => this.UVTable[this.zigZag[i]] = (t = 0 | ((v * sf + 50) / 100)) < 1 ? 1 : t > 0xFF ? 0xFF : t);
		let aasf = [
			1.0, 1.387039845, 1.306562965, 1.175875602,
			1.0, 0.785694958, 0.541196100, 0.275899379
		];
		for (i = 0, row = 0; row < 8; row++) for (col = 0; col < 8; col++, i++) {
			this.fdtbl_Y[i]  = 1.0 / (this.YTable [this.zigZag[i]] * aasf[row] * aasf[col] * 8.0);
			this.fdtbl_UV[i] = 1.0 / (this.UVTable[this.zigZag[i]] * aasf[row] * aasf[col] * 8.0);
		}
    }
	fDCTQuant(data, fdtbl) { // DCT & quantization core
		let d0, d1, d2, d3, d4, d5, d6, d7;
		let t0, t1, t2, t3, t4, t5, t6, t7;
		// Pass 1: process rows.
		let i, p;
		for (i = p = 0; i < 8; ++i, p += 8) { // advance pointer to next row
			d0 = data[p    ];
			d1 = data[p + 1];
			d2 = data[p + 2];
			d3 = data[p + 3];
			d4 = data[p + 4];
			d5 = data[p + 5];
			d6 = data[p + 6];
			d7 = data[p + 7];
			t0 = d0 + d7;
			t7 = d0 - d7;
			t1 = d1 + d6;
			t6 = d1 - d6;
			t2 = d2 + d5;
			t5 = d2 - d5;
			t3 = d3 + d4;
			t4 = d3 - d4;
			// Even part
			d0          = t0 + t3;    // phase 2
			d1          = t1 + t2;
			d2          = t1 - t2;
			d3          = t0 - t3;
			data[p    ] = d0 + d1;    // phase 3
			data[p + 4] = d0 - d1;
			d0          = (d2 + d3) * 0.707106781; // c4
			data[p + 2] = d3 + d0;    // phase 5
			data[p + 6] = d3 - d0;
			// Odd part
			d0 = t4 + t5;             // phase 2
			d1 = t5 + t6;
			d2 = t6 + t7;
			// The rotator is modified from fig 4-8 to avoid extra negations.
			d3          = 0.382683433 * (d0 - d2); // c6
			t2          = 0.541196100 * d0 + d3;   // c2-c6
			t4          = 1.306562965 * d2 + d3;   // c2+c6
			t3          = 0.707106781 * d1     ;   // c4
			d1          = t7 + t3;    // phase 5
			d3          = t7 - t3;
			data[p + 1] = d1 + t4;    // phase 6
			data[p + 3] = d3 - t2;
			data[p + 5] = d3 + t2;
			data[p + 7] = d1 - t4;
		}
		// Pass 2: process columns.
		for (i = p = 0; i < 8; ++i, p++) { // advance pointer to next column
			d0 = data[p       ];
			d1 = data[p + 0x08];
			d2 = data[p + 0x10];
			d3 = data[p + 0x18];
			d4 = data[p + 0x20];
			d5 = data[p + 0x28];
			d6 = data[p + 0x30];
			d7 = data[p + 0x38];
			t0 = d0 + d7;
			t1 = d1 + d6;
			t2 = d2 + d5;
			t3 = d3 + d4;
			t4 = d3 - d4;
			t5 = d2 - d5;
			t6 = d1 - d6;
			t7 = d0 - d7;
			// Even part
			d0             = t0 + t3; // phase 2
			d1             = t1 + t2;
			d2             = t1 - t2;
			d3             = t0 - t3;
			data[p       ] = d0 + d1; // phase 3
			data[p + 0x20] = d0 - d1;
			d0             = (d2 + d3) * 0.707106781; // c4
			data[p + 0x10] = d3 + d0; // phase 5
			data[p + 0x30] = d3 - d0;
			// Odd part
			d0 = t4 + t5;             // phase 2
			d1 = t5 + t6;
			d2 = t6 + t7;
			// The rotator is modified from fig 4-8 to avoid extra negations.
			d3             = 0.382683433 * (d0 - d2); // c6
			t2             = 0.541196100 * d0 + d3;   // c2-c6
			t4             = 1.306562965 * d2 + d3;   // c2+c6
			t3             = 0.707106781 * d1;        // c4
			d1             = t7 + t3; // phase 5
			d3             = t7 - t3;
			data[p + 0x08] = d1 + t4; // phase 6
			data[p + 0x18] = d3 - t2;
			data[p + 0x28] = d3 + t2;
			data[p + 0x38] = d1 - t4;
		}
		// Quantize/descale the coefficients
		// Apply the quantization and scaling factor & Round to nearest integer
		for (i = 0; i < 64; ++i) this.outputfDCTQuant[i] = ((d0 = data[i] * fdtbl[i]) > 0.0) ? ((d0 + 0.5)|0) : ((d0 - 0.5)|0); //outputfDCTQuant[i] = fround(d0);
		return this.outputfDCTQuant;
	}
	processDU(CDU, fdtbl, DC, HTDC, HTAC, HTDC2, HTAC2) {
		let pos, i, a;
		let EOB        = HTAC[0x00];
		let EOB2       = HTAC2[0x00];
		let M16zeroes  = HTAC[0xF0];
		let M16zeroes2 = HTAC2[0xF0];
		let DU_DCT     = this.fDCTQuant(CDU, fdtbl);
		//ZigZag reorder
		for (i = 0; i < 64; ++i) this.DU[this.zigZag[i]] = DU_DCT[i];
		let Diff = this.DU[0] - DC;
		DC = this.DU[0];
		//Encode DC
		if (Diff == 0) this.writeBits(HTDC[0], HTDC2[0]); // Diff might be 0
		else {
			pos = 0x7FFF + Diff;
			this.writeBits(HTDC[a = this.category[pos] + 1], HTDC2[a]);
			this.writeBits(this.bitcode[pos], this.category[pos]);
		}
		//Encode ACs
		let end0pos = 0x3F; // was const... which is crazy
		while (end0pos > 0 && this.DU[end0pos] == 0) end0pos--;
		if (end0pos == 0) this.writeBits(EOB, EOB2); //end0pos = first element in reverse order !=0
		else {
			let lng, startpos, nrzeroes, nrmarker;
			end0pos++;
			for (i = 1; i < end0pos; i++) {
				startpos = i;
				while (this.DU[i] == 0 && i < end0pos) ++i;
				nrzeroes = i - startpos;
				if (nrzeroes > 0x0F) {
					lng = nrzeroes >> 4;
					for (nrmarker = 0; nrmarker < lng; ++nrmarker) this.writeBits(M16zeroes, M16zeroes2);
					nrzeroes = nrzeroes & 0x0F;
				}
				this.writeBits(HTAC[a = (nrzeroes << 4) + this.category[pos = 0x7FFF + this.DU[i]] + 1], HTAC2[a]);
				this.writeBits(this.bitcode[pos], this.category[pos]);
			}
			if (end0pos != 0x40) this.writeBits(EOB, EOB2);
		}
		return DC;
	}
	encode(imageData, quality = 0.92) { // image data object
		this.byteout = []; // Initialize bit writer
		this.bytenew = 0;
		this.bytepos = 7;
		let newSf = Math.floor(quality < 0.5 ? 50 / quality : 200 * (1 - quality));
		if ((typeof this.sf) == 'undefined' || newSf !== this.sf) this.initQuantTables(this.sf = newSf);
		// Add JPEG headers
		this.writeWord(0xFFD8); // SOI
		this.writeAPP0();
		this.writeDQT();
		this.writeSOF0(imageData.width, imageData.height);
		this.writeDHT();
		this.writeSOS();
		let y1, y2, y3, pY3, pY1;
		let x1, x2, x3, pX3, pX1;
		let r, g, b;
		let pos;
		let quadWidth = imageData.width *  4;
		let width32   = imageData.width * 32;
		// Encode 8x8 macroblocks
		let DCY = 0;
		let DCU = 0;
		let DCV = 0;
		for (y1 = 0, pY1 = 0; y1 < imageData.height; y1 += 8, pY1 += width32) {
			for (x1 = 0, pX1 = pY1; x1 < imageData.width; x1 += 8, pX1 += 32) {
				for (y2 = pos = 0, y3 = y1, pY3 = pX1; y2 < 8; y2++, y3++, pY3 += quadWidth) {
					for (x2 = 0, x3 = x1, pX3 = pY3; x2 < 8; x2++, x3++, pos++) {
						if (y3 < imageData.height && x3 < imageData.width) {
							r = imageData.data[pX3++];
							g = imageData.data[pX3++];
							b = imageData.data[pX3++];
							pX3++;
						} else r = g = b = 0; // padding
						this.YDU[pos] = ((this.RGB_YUV_TABLE[r         ] + this.RGB_YUV_TABLE[g + 0x0100] + this.RGB_YUV_TABLE[b + 0x0200]) >> 16) - 0x80;
						this.UDU[pos] = ((this.RGB_YUV_TABLE[r + 0x0300] + this.RGB_YUV_TABLE[g + 0x0400] + this.RGB_YUV_TABLE[b + 0x0500]) >> 16) - 0x80;
						this.VDU[pos] = ((this.RGB_YUV_TABLE[r + 0x0500] + this.RGB_YUV_TABLE[g + 0x0600] + this.RGB_YUV_TABLE[b + 0x0700]) >> 16) - 0x80;
					}
				}
				DCY = this.processDU(this.YDU, this.fdtbl_Y , DCY,  this.YDC_HT,  this.YAC_HT,  this.YDC_HT2,  this.YAC_HT2);
				DCU = this.processDU(this.UDU, this.fdtbl_UV, DCU, this.UVDC_HT, this.UVAC_HT, this.UVDC_HT2, this.UVAC_HT2);
				DCV = this.processDU(this.VDU, this.fdtbl_UV, DCV, this.UVDC_HT, this.UVAC_HT, this.UVDC_HT2, this.UVAC_HT2);
			}
		}
		////////////////////////////////////////////////////////////////
		// Do the bit alignment of the EOI marker
		if (this.bytepos >= 0) this.writeBits((1 << (this.bytepos + 1)) - 1, this.bytepos);
		this.writeWord(0xFFD9); //EOI
		let res = 'data:image/jpeg;base64,' + btoa(this.byteout.join(''));
		this.byteout = [];
		return res;
	}
}
/*
let canvas = new Canvas();
canvas.width = 500;
canvas.height = 500;
canvas.getContext('2d').drawImage(document.getElementById('img1'), -20, 20, 600, 500, 20, -10, 300, 400, () => {
	let jpegEncoder = new JpegEncoder();
	let b64 = jpegEncoder.encode(canvas.context.imageData);
	console.log('JpegEncode:', b64);
	console.log('canvas.context.imageData =', canvas.context.imageData);
	document.getElementById('imgBase64').src = b64;
});
document.body.appendChild(canvas.domCanvas);
*/