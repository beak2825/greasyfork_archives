// ==UserScript==
// @name        ExportPDF
// @namespace   Violentmonkey Scripts
// @match       *://www.doc88.com/*
// @match       http://localhost:8080/
// @match       https://www.docin.com/*
// @match       https://book.sciencereading.cn/shop/book/Booksimple/*
// @grant       none
// @version     2.0
// @author      louiesun
// @license     GPL-3.0-or-later
// @description 2024/2/25 21:45:23
// @downloadURL https://update.greasyfork.org/scripts/488618/ExportPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/488618/ExportPDF.meta.js
// ==/UserScript==

/*

// @require     file:///D:/APPS/PDFexport/lib/blob-stream.js
// @require     file:///D:/APPS/PDFexport/lib/FileSaver.min.js
// @require     file:///D:/APPS/PDFexport/lib/pdfkit.standalone.js
*/
//不能跑！！ 测试请引用下方js can't run, please require the js above
//笑死 完完全全是个图片
/*
 * # 下载文库PDF
报废了。
## 技术背景
经过浏览器开发者模式发现，均采用`HTMLcanvas`渲染。

发现Github项目[Canvas2PDF](https://github.com/joshua-gould/canvas2pdf)。

同时，其`README.md`：
> Canvas2PDF exports your HTML canvas as PDF using JavaScript. Note that this library generates actual PDF drawing calls to create a PDF with vector graphics, unlike some alternate libraries which rasterize your canvas and place it as an image in your PDF.

说明不是截屏。

那么这里就只需要重载canvasctx实现为`PDFcanvas`即可。

## 劫持经验分享
API比较多，需要面对`native code`，如果不想重编译V8引擎就找到替代函数或对象并使用。

基本上需要改掉`document.createElement`,`element.innerHTML`，可能有其它的，遇到再说，就看有没有没有经过userjs“审查”的DOM元素创建。

## 另外
如果`svg`元素实现，直接导出矢量。
如果`div`套套，就导出div。

只有`canvas`是需要拦截的。

## 这将是一个折磨
cao，doc88从来没有传输过矢量内容，就过来一张图片。寄了。只能OCR。
但是我劫持了canvas。




> Written with [StackEdit+](https://stackedit.net/).
*/

//      https://github.com/devongovett/pdfkit/releases/download/v0.14.0/pdfkit.standalone.js
//      https://github.com/devongovett/blob-stream/releases/download/v0.1.3/blob-stream.js
//      https://github.com/eligrey/FileSaver.js/blob/master/dist/FileSaver.min.js    can't be required

/*
 *
 *  A canvas to PDF converter. Uses a mock canvas context to build a PDF document.
 *
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Author:
 *  Joshua Gould
 *
 *  Copyright (c) 2017 Joshua Gould
 */

function hex(v) {
    return v < 0x10
        ? "0" + Math.max(0, v).toString(16)
        : Math.min(255, v).toString(16);
}

function hslToHex(h, s, l, a) {
    h = (h % 360) + (h < 0) * 360;
    s = isNaN(h) || isNaN(s) ? 0 : s;
    const m2 = l + (l < 0.5 ? l : 1 - l) * s;
    const m1 = 2 * l - m2;
    return rgbToHex(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        a,
    );
}

function hsl2rgb(h, m1, m2) {
    return (
        (h < 60
            ? m1 + ((m2 - m1) * h) / 60
            : h < 180
                ? m2
                : h < 240
                    ? m1 + ((m2 - m1) * (240 - h)) / 60
                    : m1) * 255
    );
}

const reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

const rgbToHex = function (r, g, b, a) {
    return { c: "#" + hex(r) + hex(g) + hex(b), a: a };
};

const fixColor = function (value) {
    let m;
    const format = (value + "").trim().toLowerCase();
    if ((m = reRgbInteger.exec(format))) {
        // rgb(255, 0, 0)
        return rgbToHex(m[1], m[2], m[3], 1);
    } else if ((m = reRgbPercent.exec(format))) {
        // // rgb(100%, 0%, 0%)
        return rgbToHex(
            (m[1] * 255) / 100,
            (m[2] * 255) / 100,
            (m[3] * 255) / 100,
            1,
        );
    } else if ((m = reRgbaInteger.exec(format))) {
        // // rgba(255, 0, 0, 0.5)
        return rgbToHex(m[1], m[2], m[3], m[4]);
    } else if ((m = reRgbaPercent.exec(format))) {
        // // rgb(100%, 0%, 0%, .2)
        return rgbToHex(
            (m[1] * 255) / 100,
            (m[2] * 255) / 100,
            (m[3] * 255) / 100,
            m[4],
        );
    } else if ((m = reHslPercent.exec(format))) {
        // // hsl(120, 50%, 50%)
        return hslToHex(m[1], m[2] / 100, m[3] / 100);
    } else if ((m = reHslaPercent.exec(format))) {
        return hslToHex(m[1], m[2] / 100, m[3] / 100, m[4]); // hsla(120, 50%, 50%, 1)
    } else {
        return { c: value, a: 1 };
    }
};
/**
 *
 * @param stream Stream to write the PDF to.
 * @param options Options passed to PDFDocument constructor.
 * @constructor
 */
const PdfContext = function (stream, options) {
    if (stream == null) {
        throw new Error("Stream must be provided.");
    }

    const doc = new PDFDocument(options);
    this.stream = doc.pipe(stream);
    let fontValue = "10px Helvetica";
    let textAlign = "left";
    let textBaseline = "alphabetic";
    let lineHeight = doc.currentLineHeight(false);
    let font = fontValue;

    const fontRegex =
        /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\'\"\sa-z]+?)\s*$/i;
    const defaultFontData = {
        style: "normal",
        size: 10,
        family: "Helvetica",
        weight: "normal",
    };
    const parseFont = function () {
        const fontPart = fontRegex.exec(font);
        if (fontPart === null) {
            return defaultFontData;
        }
        const data = {
            style: fontPart[1] || "normal",
            size: parseInt(fontPart[4]) || 10,
            family: fontPart[6] || "Helvetica",
            weight: fontPart[3] || "normal",
        };
        return data;
    };

    Object.defineProperty(this, "fillStyle", {
        get: function () {
            return doc.fillColor();
        },
        set: function (value) {
            const color = fixColor(value);
            doc.fillColor(color.c, color.a);
        },
    });
    Object.defineProperty(this, "strokeStyle", {
        get: function () {
            return doc.strokeColor();
        },
        set: function (value) {
            const color = fixColor(value);
            doc.strokeColor(color.c, color.a);
        },
    });
    Object.defineProperty(this, "lineWidth", {
        get: function () {
            return doc.lineWidth();
        },
        set: function (value) {
            doc.lineWidth(value);
        },
    });

    Object.defineProperty(this, "lineCap", {
        get: function () {
            return doc.lineCap();
        },
        set: function (value) {
            doc.lineCap(value);
        },
    });
    Object.defineProperty(this, "lineJoin", {
        get: function () {
            return doc.lineJoin();
        },
        set: function (value) {
            doc.lineJoin(value);
        },
    });

    Object.defineProperty(this, "globalAlpha", {
        get: function () {
            return doc.opacity();
        },
        set: function (value) {
            value >= 0.0 && value <= 1.0 && doc.opacity(value);
        },
    });

    Object.defineProperty(this, "font", {
        get: function () {
            return fontValue;
        },
        set: function (value) {
            fontValue = value;
            const parsedFont = parseFont(value);
            doc.fontSize(parsedFont.size);
            doc.font(parsedFont.family);
            lineHeight = doc.currentLineHeight(false);
        },
    });

    this.end = function () {
        doc.end();
    };

    this.save = function () {
        doc.save();
    };

    this.restore = function () {
        doc.restore();
    };

    this.scale = function (x, y) {
        doc.scale(x, y);
    };

    this.rotate = function (angle) {
        const degrees = (angle * 180) / Math.PI;
        doc.rotate(degrees);
    };

    this.translate = function (x, y) {
        doc.translate(x, y);
    };

    this.transform = function (a, b, c, d, e, f) {
        doc.transform(a, b, c, d, e, f);
    };

    this.beginPath = function () {
        // no-op
    };

    this.moveTo = function (x, y) {
        doc.moveTo(x, y);
    };

    this.closePath = function () {
        doc.closePath();
    };

    this.lineTo = function (x, y) {
        doc.lineTo(x, y);
    };

    this.stroke = function () {
        doc.stroke();
    };

    this.fill = function () {
        doc.fill();
    };

    this.rect = function (x, y, width, height) {
        doc.rect(x, y, width, height);
    };

    this.fillRect = function (x, y, width, height) {
        doc.rect(x, y, width, height);
        doc.fill();
    };

    this.strokeRect = function (x, y, width, height) {
        doc.rect(x, y, width, height);
        doc.stroke();
    };

    /**
     * "Clears" a canvas by just drawing a white rectangle in the current group.
     */
    this.clearRect = function (x, y, width, height) {
        const oldFill = doc.fillColor();
        doc.fillColor("white");
        doc.rect(x, y, width, height);
        doc.fill();
        doc.fillColor(oldFill);
    };

    this.arc = function (x, y, r, a0, a1, ccw) {
        const pi = Math.PI,
            tau = 2 * pi,
            epsilon = 1e-6,
            tauEpsilon = tau - epsilon;
        (x = +x), (y = +y), (r = +r);
        let dx = r * Math.cos(a0),
            dy = r * Math.sin(a0),
            x0 = x + dx,
            y0 = y + dy,
            cw = 1 ^ ccw,
            da = ccw ? a0 - a1 : a1 - a0;

        // Is the radius negative? Error.
        if (r < 0) {
            throw new Error("negative radius: " + r);
        }
        let cmd = "";
        // Is this path empty? Move to (x0,y0).

        cmd += "M" + x0 + "," + y0;

        // // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
        // else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
        //   cmd += 'L' + x0 + ',' + y0;
        // }

        // Is this arc empty? We’re done.
        if (!r) {
            return;
        }

        // Does the angle go the wrong way? Flip the direction.
        if (da < 0) {
            da = (da % tau) + tau;
        }

        // Is this a complete circle? Draw two arcs to complete the circle.
        if (da > tauEpsilon) {
            cmd +=
                "A" +
                r +
                "," +
                r +
                ",0,1," +
                cw +
                "," +
                (x - dx) +
                "," +
                (y - dy) +
                "A" +
                r +
                "," +
                r +
                ",0,1," +
                cw +
                "," +
                x0 +
                "," +
                y0;
        }

        // Is this arc non-empty? Draw an arc!
        else if (da > epsilon) {
            cmd +=
                "A" +
                r +
                "," +
                r +
                ",0," +
                +(da >= pi) +
                "," +
                cw +
                "," +
                (x + r * Math.cos(a1)) +
                "," +
                (y + r * Math.sin(a1));
        }
        doc.path(cmd);
    };

    this.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
        doc.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    };

    this.quadraticCurveTo = function (cpx, cpy, x, y) {
        doc.quadraticCurveTo(cpx, cpy, x, y);
    };
    this.createLinearGradient = function (x1, y1, x2, y2) {
        const gradient = doc.linearGradient(x1, y1, x2, y2);
        gradient.addColorStop = function (offset, color) {
            const fixedColor = fixColor(color);
            gradient.stop(offset, fixedColor.c, fixedColor.a);
        };
        return gradient;
    };

    this.createRadialGradient = function (x0, y0, r0, x1, y1, r1) {
        const gradient = doc.radialGradient(x0, y0, r0, x1, y1, r1);
        gradient.addColorStop = function (offset, color) {
            const fixedColor = fixColor(color);
            gradient.stop(offset, fixedColor.c, fixedColor.a);
        };
        return gradient;
    };

    this.adjustTextX = function (text, x) {
        if (textAlign !== "start" || textAlign !== "left") {
            const width = doc.widthOfString(text);
            if (textAlign === "right" || textAlign === "end") {
                x -= width;
            } else if (textAlign === "center") {
                x -= width / 2;
            }
        }
        return x;
    };

    this.adjustTextY = function (text, y) {
        // baseline is top by default
        if (textBaseline === "bottom") {
            y -= lineHeight;
        } else if (textBaseline === "middle") {
            y -= lineHeight / 2;
        } else if (textBaseline === "alphabetic") {
            y -= lineHeight / 2 + 1;
        }
        return y;
    };

    this.fillText = function (text, x, y) {
        x = this.adjustTextX(text, x);
        y = this.adjustTextY(text, y);
        doc.text(text, x, y, {
            lineBreak: false,
            stroke: false,
            fill: true,
        });
    };

    this.strokeText = function (text, x, y) {
        x = this.adjustTextX(text, x);
        y = this.adjustTextY(text, y);
        doc.text(text, x, y, { lineBreak: false, stroke: true, fill: false });
    };

    this.measureText = function (text) {
        text = "" + text;
        const width = doc.widthOfString(text);
        return { width: width, height: lineHeight };
    };

    this.clip = function () {
        doc.clip();
    };

    this.drawImage = function (image) {
        const args = Array.prototype.slice.call(arguments);
        image = args[0];
        let dx,
            dy,
            dw,
            dh,
            sx = 0,
            sy = 0,
            sw,
            sh;
        if (args.length === 3) {
            dx = args[1];
            dy = args[2];
            sw = image.width;
            sh = image.height;
            dw = sw;
            dh = sh;
        } else if (args.length === 5) {
            dx = args[1];
            dy = args[2];
            dw = args[3];
            dh = args[4];
            sw = image.width;
            sh = image.height;
        } else if (args.length === 9) {
            sx = args[1];
            sy = args[2];
            sw = args[3];
            sh = args[4];
            dx = args[5];
            dy = args[6];
            dw = args[7];
            dh = args[8];
        } else {
            throw new Error(
                "Invalid number of arguments passed to drawImage: " + arguments.length,
            );
        }

        if (image.nodeName === "IMG") {
            const canvas = document.createElement("tcanvas");
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext("2d").drawImage(image, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            doc.image(dataURL, dx, dy, { width: dw, height: dh });
        } else {
            doc.image(image, dx, dy, { width: dw, height: dh });
        }
    };

    this.setTransform = function (a, b, c, d, e, f) {
        const ctm = doc._ctm;
        const height = doc.page.height;
        const [a1, b1, c1, d1, e1, f1] = ctm;
        const determinant = a1 * d1 - b1 * c1;
        const inverse = [
            d1 / determinant,
            -b1 / determinant,
            -c1 / determinant,
            a1 / determinant,
            (c1 * f1 - d1 * e1) / determinant,
            (b1 * e1 - a1 * f1) / determinant,
        ];
        doc.transform(
            inverse[0],
            inverse[1],
            inverse[2],
            inverse[3],
            inverse[4],
            inverse[5],
        );
        doc.translate(0, height);
        doc.scale(1, -1);
        doc.transform(a, b, c, d, e, f);
    };

    /**
     * Not yet implemented
     */
    this.createPattern = function (image, repetition) {
        console.log("createPattern not implemented");
    };

    this.setLineDash = function (dashArray) {
        console.log("setLineDash not implemented");
    };

    this.drawFocusIfNeeded = function () {
        console.log("drawFocusIfNeeded not implemented");
    };

    this.createImageData = function () {
        console.log("drawFocusRing not implemented");
    };

    this.getImageData = function () {
        console.log("getImageData not implemented");
    };

    this.putImageData = function () {
        console.log("putImageData not implemented");
    };

    this.globalCompositeOperation = function () {
        console.log("globalCompositeOperation not implemented");
    };

    this.arcTo = function (x1, y1, x2, y2, radius) {
        console.log("arcTo not implemented");
    };
};


const ProxyContext = function (HTMLctx) {
    if (HTMLctx == null) {
        throw new Error("Origin Canvas must be provided.");
    }
    let PDFctx=new PdfContext(blobStream());

    Object.defineProperty(this, "font", {
        get: function () {
          return HTMLctx.font;
        },
        set: function (value) {
          HTMLctx.font=value;
          PDFctx.font=value;
        },
    });
    Object.defineProperty(this, "textAlign", {
        get: function () {
          return HTMLctx.textAlign;
        },
        set: function (value) {
          HTMLctx.fontValue=value;
          PDFctx.fontValue=value;
        },
    });
    Object.defineProperty(this, "textBaseline", {
        get: function () {
          return HTMLctx.textBaseline;
        },
        set: function (value) {
          HTMLctx.fontValue=value;
          PDFctx.fontValue=value;
        },
    });
    Object.defineProperty(this, "fontRegex", {
        get: function () {
          return HTMLctx.fontRegex;
        },
        set: function (value) {
          HTMLctx.fontRegex=value;
          PDFctx.fontRegex=value;
        },
    });
    Object.defineProperty(this, "fillStyle", {
        get: function () {
          return HTMLctx.fillStyle;
        },
        set: function (value) {
          HTMLctx.fillStyle=value;
          PDFctx.fillStyle=value;
        },
    });
    Object.defineProperty(this, "strokeStyle", {
        get: function () {
          return HTMLctx.strokeStyle;
        },
        set: function (value) {
          HTMLctx.strokeStyle=value;
          PDFctx.strokeStyle=value;
        },
    });
    Object.defineProperty(this, "lineWidth", {
        get: function () {
          return HTMLctx.lineWidth;
        },
        set: function (value) {
          HTMLctx.lineWidth=value;
          PDFctx.lineWidth=value;
        },
    });

    Object.defineProperty(this, "lineCap", {
        get: function () {
          return HTMLctx.lineCap;
        },
        set: function (value) {
          HTMLctx.lineCap=value;
          PDFctx.lineCap=value;
        },
    });
    Object.defineProperty(this, "lineJoin", {
        get: function () {
          return HTMLctx.lineJoin;
        },
        set: function (value) {
          HTMLctx.lineJoin=value;
          PDFctx.lineJoin=value;
        },
    });

    Object.defineProperty(this, "globalAlpha", {
        get: function () {
          return HTMLctx.globalAlpha;
        },
        set: function (value) {
          HTMLctx.globalAlpha=value;
          PDFctx.globalAlpha=value;
        },
    });


    this.end = function (...arvs) {
      return PDFctx.end(...arvs);
    };
    this.save = function (...arvs) {
      PDFctx.save(...arvs);
      return HTMLctx.save(...arvs);
    };
    this.restore = function (...arvs) {
      PDFctx.restore(...arvs);
      return HTMLctx.restore(...arvs);
    };
    this.scale = function (...arvs) {
      PDFctx.scale(...arvs);
      return HTMLctx.scale(...arvs);
    };
    this.rotate = function (...arvs) {
      PDFctx.rotate(...arvs);
      return HTMLctx.rotate(...arvs);
    };

    this.translate = function (...arvs) {
      PDFctx.translate(...arvs);
      return HTMLctx.translate(...arvs);
    };

    this.transform = function (...arvs) {
      PDFctx.transform(...arvs);
      return HTMLctx.transform(...arvs);
    };

    this.beginPath = function (...arvs) {
      PDFctx.beginPath(...arvs);
      return HTMLctx.beginPath(...arvs);
    };

    this.moveTo = function (...arvs) {
      PDFctx.moveTo(...arvs);
      return HTMLctx.moveTo(...arvs);
    };

    this.closePath = function (...arvs) {
      PDFctx.closePath(...arvs);
      return HTMLctx.closePath(...arvs);
    };

    this.lineTo = function (...arvs) {
      PDFctx.lineTo(...arvs);
      return HTMLctx.lineTo(...arvs);
    };

    this.stroke = function (...arvs) {
      PDFctx.stroke(...arvs);
      return HTMLctx.stroke(...arvs);
    };

    this.fill = function (...arvs) {
      PDFctx.fill(...arvs);
      return HTMLctx.fill(...arvs);
    };

    this.rect = function (...arvs) {
      PDFctx.rect(...arvs);
      return HTMLctx.rect(...arvs);
    };

    this.fillRect = function (...arvs) {
      PDFctx.fillRect(...arvs);
      return HTMLctx.fillRect(...arvs);
    };

    this.strokeRect = function (...arvs) {
      PDFctx.strokeRect(...arvs);
      return HTMLctx.strokeRect(...arvs);
    };

    /**
     * "Clears" a canvas by just drawing a white rectangle in the current group.
     */
    this.clearRect = function (...arvs) {
      PDFctx.clearRect(...arvs);
      return HTMLctx.clearRect(...arvs);
    };

    this.arc = function (...arvs) {
      PDFctx.arc(...arvs);
      return HTMLctx.arc(...arvs);
    };

    this.bezierCurveTo = function (...arvs) {
      PDFctx.bezierCurveTo(...arvs);
      return HTMLctx.bezierCurveTo(...arvs);
    };

    this.quadraticCurveTo = function (...arvs) {
      PDFctx.quadraticCurveTo(...arvs);
      return HTMLctx.quadraticCurveTo(...arvs);
    };
    this.createLinearGradient = function (...arvs) {
      PDFctx.createLinearGradient(...arvs);
      return HTMLctx.createLinearGradient(...arvs);
    };

    this.createRadialGradient = function (...arvs) {
      PDFctx.createRadialGradient(...arvs);
      return HTML.createRadialGradient(...arvs);
    };

    this.adjustTextX = function (...arvs) {
      return PDFctx.adjustTextX(...arvs);
    };

    this.adjustTextY = function (...arvs) {
      return PDFctx.adjustTextY(...arvs);
    };

    this.fillText = function (...arvs) {
      PDFctx.fillText(...arvs);
      return HTMLctx.fillText(...arvs);
    };

    this.strokeText = function (...arvs) {
      PDFctx.strokeText(...arvs);
      return HTMLctx.strokeText(...arvs);
    };

    this.clip = function (...arvs) {
      PDFctx.clip(...arvs);
      return HTMLctx.clip(...arvs);
    };

    this.drawImage = function (...arvs) {
      PDFctx.drawImage(...arvs);
      return HTMLctx.drawImage(...arvs);
    };

    this.setTransform = function (...arvs) {
      PDFctx.setTransform(...arvs);
      return HTMLctx.setTransform(...arvs);
    };

    this.ExportPDF = function(...arvs)
    {
      PDFctx.stream.on('finish', function (...arvs) {
      var blob = PDFctx.stream.toBlob(...arvs);
      saveAs(...arvs);
      });
      PDFctx.end(...arvs);
      console.log(...arvs);
      //backgroud un completed https://segmentfault.com/a/1190000016819776
    }

    /**
     * Not yet implemented
     */
    this.createPattern = function (...arvs) {
      return HTMLctx.createImageData(...arvs);
    };

    this.setLineDash = function (...arvs) {
      return HTMLctx.createImageData(...arvs);
    };

    this.drawFocusIfNeeded = function (...arvs) {
      PDFctx.drawFocusIfNeeded(...arvs);
      return HTMLctx.drawFocusIfNeeded(...arvs);
    };

    this.createImageData = function (...arvs) {
      PDFctx.createImageData(...arvs);
      return HTMLctx.createImageData(...arvs);
    };

    this.getImageData = function (...arvs) {
      PDFctx.getImageData(...arvs);
      return HTMLctx.getImageData(...arvs);
    };

    this.putImageData = function (...arvs) {
      PDFctx.putImageData(...arvs);
      return HTMLctx.putImageData(...arvs);
    };

    this.globalCompositeOperation = function (...arvs) {
      PDFctx.globalCompositeOperation(...arvs);
      return HTMLctx.globalCompositeOperation(...arvs);
    };

    this.arcTo = function (...arvs) {
      PDFctx.globalCompositeOperation(...arvs);
      return HTMLctx.globalCompositeOperation(...arvs);
    };
};

var HTMLElememtNameList=['modernizr','link','meta','style','script','noscript','template','body','section','nav','article','aside','h1','h2','h3','h4','h5','h6','header','footer','address','main','p','hr','pre','blockquote','ol','ul','li','dl','dt','dd','figure','figcaption','div','a','em','strong','small','s','cite','q','dfn','abbr','data','time','code','var','samp','kbd','sub','i','b','u','mark','ruby','rt','rp','bdi','bdo','span','br','wbr','ins','del','img','iframe','embed','object','param','video','audio','source','track','canvas','map','area','svg','math','table','caption','colgroup','col','tbody','thead','tfoot','tr','td','th','form','fieldset','legend','label','input','button','select','datalist','optgroup','option','textarea','keygen','output','progress','meter','details','summary','menuitem','menu'];
var HTMLElementList=new Array(HTMLElememtNameList.length);

document.ElementList=HTMLElementList;

function ElementInit()
{
  for(let i=0; i<HTMLElememtNameList.length; i++)
    HTMLElementList[i]=document.createElement(HTMLElememtNameList[i]);
}
ElementInit();

/*
var PDFcanvasElement = Object.create(HTMLCanvasElement.prototype);
PDFcanvasElement.createdCallback = function()
{

};
var PDFcanvasImage = window.registerElement('pdf-canvas', { prototype: HTMLElementList, extends: 'canvas' });
*/

// Create a class for the element
/*class PDFcanvasElement extends HTMLCanvasElement {
  createdCallback() {
    this.PROXYcontext=new ProxyContext(this.getContext("2d"));
    this.getContext=function()
    {
       return this.PROXYcontext;
    };
  }
}*/
/*
const { createElement: originalCreateElement } = document;
document.createElement = function createElement(...args) {
  // function fetch() { [native code] }
  console.log("ele call intercepted:", ...args);
  return originalCreateElement(...args);
};
*/

//customElements.define("pdf-canvas", PDFcanvasElement, { extends: "canvas" });

/*let MYcreateElement=deepClone(document.createElement);*/

function SpecialCare(elem,tagName)
{
  if(tagName=="canvas")
          {
            elem.PROXYcontext=new ProxyContext(elem.getContext("2d"));
            elem.getContext=function()
            {
              return this.PROXYcontext;
            };
            console.log(elem);
          }
      Object.defineProperty(elem, "innerHTML", {
          set: function (str) {
            var telem=HTMLElementList[HTMLElememtNameList.indexOf(tagName)].cloneNode();
            telem.innerHTML=str;

            //process the special cares.
            let child=telem.firstChild;
            while(child)
            {
              //console.log(child.nodeName);
              SpecialCare(child,child.nodeName.toLowerCase());
              child=child.nextSibling;
            }

            while (this.firstChild) {
              this.removeChild(elem.lastChild);
            }
            this.appendChild(telem);
            //console.log(str);
          },
    });
}

document.createElement = function (tagName, className, parent) {
    //console.log(tagName,className,parent);
    tagName=tagName.toLowerCase();
    var elem,agent=0;

    //check the element create by this user js
    if(tagName == "tcanvas")
    {
      agent=1,tagName="canvas";
    }
    else if(tagName == "tdiv")
    {
      agent=1,tagName="div";
    }

    //create
    if(HTMLElememtNameList.indexOf(tagName)>-1){
        elem=HTMLElementList[HTMLElememtNameList.indexOf(tagName)].cloneNode();

    }
    else
    {
      alert("PDFexporter Error! New element registered by the page. To be finished. ");
      console.log(tagName);
      elem=_documentcreateElement(tagName);
    }

    //spcial care
    if(agent==0)
    {
      SpecialCare(elem,tagName);
    }

    if (className) {
      elem.className = className || '';
    }
    if (parent) {
       parent.appendChild(elem);
    }
    //console.log(elem);
    return elem;
}
//
// you may need https://github.com/lisonge/Disable-CSP

//HTMLCanvasElement.prototype.createdCallback=(){};



