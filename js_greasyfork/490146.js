(function (global, factory) {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    factory(global.pathDataParser = {});
})(this, (function (exports) { 'use strict';

    const COMMAND = 0;
    const NUMBER = 1;
    const EOD = 2;
    const PARAMS = {A: 7, a: 7, C: 6, c: 6, H: 1, h: 1, L: 2, l: 2, M: 2, m: 2, Q: 4, q: 4, S: 4, s: 4, T: 2, t: 2, V: 1, v: 1, Z: 0, z: 0};
    function tokenize(d) {
        const tokens = new Array();
        while (d !== "") {
            if (d.match(/^([ \t\r\n,]+)/)) {
                d = d.substr(RegExp.$1.length);
            } else if (d.match(/^([aAcChHlLmMqQsStTvVzZ])/)) {
                tokens[tokens.length] = {type: COMMAND, text: RegExp.$1};
                d = d.substr(RegExp.$1.length);
            } else if (d.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) {
                tokens[tokens.length] = {type: NUMBER, text: `${parseFloat(RegExp.$1)}`};
                d = d.substr(RegExp.$1.length);
            } else {
                return [];
            }
        }
        tokens[tokens.length] = {type: EOD, text: ""};
        return tokens;
    }
    function isType(token, type) {
        return token.type === type;
    }
    function parsePath(d) {
        const segments = [];
        const tokens = tokenize(d);
        let mode = "BOD";
        let index = 0;
        let token = tokens[index];
        while (!isType(token, EOD)) {
            let paramsCount = 0;
            const params = [];
            if (mode === "BOD") {
                if (token.text === "M" || token.text === "m") {
                    index++;
                    paramsCount = PARAMS[token.text];
                    mode = token.text;
                } else {
                    return parsePath("M0,0" + d);
                }
            } else if (isType(token, NUMBER)) {
                paramsCount = PARAMS[mode];
            } else {
                index++;
                paramsCount = PARAMS[token.text];
                mode = token.text;
            }
            if (index + paramsCount < tokens.length) {
                for (let i = index; i < index + paramsCount; i++) {
                    const numbeToken = tokens[i];
                    if (isType(numbeToken, NUMBER)) {
                        params[params.length] = +numbeToken.text;
                    } else {
                        throw new Error("Param not a number: " + mode + "," + numbeToken.text);
                    }
                }
                if (typeof PARAMS[mode] === "number") {
                    const segment = {key: mode, data: params};
                    segments.push(segment);
                    index += paramsCount;
                    token = tokens[index];
                    if (mode === "M")
                        mode = "L";
                    if (mode === "m")
                        mode = "l";
                } else {
                    throw new Error("Bad segment: " + mode);
                }
            } else {
                throw new Error("Path data ended short");
            }
        }
        return segments;
    }
    function serialize(segments) {
        const tokens = [];
        for (const {key, data} of segments) {
            tokens.push(key);
            switch (key) {
                case "C":
                case "c":
                    tokens.push(data[0], `${data[1]},`, data[2], `${data[3]},`, data[4], data[5]);
                    break;
                case "S":
                case "s":
                case "Q":
                case "q":
                    tokens.push(data[0], `${data[1]},`, data[2], data[3]);
                    break;
                default:
                    tokens.push(...data);
                    break;
            }
        }
        return tokens.join(" ");
    }
    function absolutize(segments) {
        let cx = 0, cy = 0;
        let subx = 0, suby = 0;
        const out = [];
        for (const {key, data} of segments) {
            switch (key) {
                case "M":
                    out.push({key: "M", data: [...data]});
                    [cx, cy] = data;
                    [subx, suby] = data;
                    break;
                case "m":
                    cx += data[0];
                    cy += data[1];
                    out.push({key: "M", data: [cx, cy]});
                    subx = cx;
                    suby = cy;
                    break;
                case "L":
                    out.push({key: "L", data: [...data]});
                    [cx, cy] = data;
                    break;
                case "l":
                    cx += data[0];
                    cy += data[1];
                    out.push({key: "L", data: [cx, cy]});
                    break;
                case "C":
                    out.push({key: "C", data: [...data]});
                    cx = data[4];
                    cy = data[5];
                    break;
                case "c": {
                    const newdata = data.map((d, i) => i % 2 ? d + cy : d + cx);
                    out.push({key: "C", data: newdata});
                    cx = newdata[4];
                    cy = newdata[5];
                    break;
                }
                case "Q":
                    out.push({key: "Q", data: [...data]});
                    cx = data[2];
                    cy = data[3];
                    break;
                case "q": {
                    const newdata = data.map((d, i) => i % 2 ? d + cy : d + cx);
                    out.push({key: "Q", data: newdata});
                    cx = newdata[2];
                    cy = newdata[3];
                    break;
                }
                case "A":
                    out.push({key: "A", data: [...data]});
                    cx = data[5];
                    cy = data[6];
                    break;
                case "a":
                    cx += data[5];
                    cy += data[6];
                    out.push({key: "A", data: [data[0], data[1], data[2], data[3], data[4], cx, cy]});
                    break;
                case "H":
                    out.push({key: "H", data: [...data]});
                    cx = data[0];
                    break;
                case "h":
                    cx += data[0];
                    out.push({key: "H", data: [cx]});
                    break;
                case "V":
                    out.push({key: "V", data: [...data]});
                    cy = data[0];
                    break;
                case "v":
                    cy += data[0];
                    out.push({key: "V", data: [cy]});
                    break;
                case "S":
                    out.push({key: "S", data: [...data]});
                    cx = data[2];
                    cy = data[3];
                    break;
                case "s": {
                    const newdata = data.map((d, i) => i % 2 ? d + cy : d + cx);
                    out.push({key: "S", data: newdata});
                    cx = newdata[2];
                    cy = newdata[3];
                    break;
                }
                case "T":
                    out.push({key: "T", data: [...data]});
                    cx = data[0];
                    cy = data[1];
                    break;
                case "t":
                    cx += data[0];
                    cy += data[1];
                    out.push({key: "T", data: [cx, cy]});
                    break;
                case "Z":
                case "z":
                    out.push({key: "Z", data: []});
                    cx = subx;
                    cy = suby;
                    break;
            }
        }
        return out;
    }
    function normalize(segments) {
        const out = [];
        let lastType = "";
        let cx = 0, cy = 0;
        let subx = 0, suby = 0;
        let lcx = 0, lcy = 0;
        for (const {key, data} of segments) {
            switch (key) {
                case "M":
                    out.push({key: "M", data: [...data]});
                    [cx, cy] = data;
                    [subx, suby] = data;
                    break;
                case "C":
                    out.push({key: "C", data: [...data]});
                    cx = data[4];
                    cy = data[5];
                    lcx = data[2];
                    lcy = data[3];
                    break;
                case "L":
                    out.push({key: "L", data: [...data]});
                    [cx, cy] = data;
                    break;
                case "H":
                    cx = data[0];
                    out.push({key: "L", data: [cx, cy]});
                    break;
                case "V":
                    cy = data[0];
                    out.push({key: "L", data: [cx, cy]});
                    break;
                case "S": {
                    let cx1 = 0, cy1 = 0;
                    if (lastType === "C" || lastType === "S") {
                        cx1 = cx + (cx - lcx);
                        cy1 = cy + (cy - lcy);
                    } else {
                        cx1 = cx;
                        cy1 = cy;
                    }
                    out.push({key: "C", data: [cx1, cy1, ...data]});
                    lcx = data[0];
                    lcy = data[1];
                    cx = data[2];
                    cy = data[3];
                    break;
                }
                case "T": {
                    const [x, y] = data;
                    let x1 = 0, y1 = 0;
                    if (lastType === "Q" || lastType === "T") {
                        x1 = cx + (cx - lcx);
                        y1 = cy + (cy - lcy);
                    } else {
                        x1 = cx;
                        y1 = cy;
                    }
                    const cx1 = cx + 2 * (x1 - cx) / 3;
                    const cy1 = cy + 2 * (y1 - cy) / 3;
                    const cx2 = x + 2 * (x1 - x) / 3;
                    const cy2 = y + 2 * (y1 - y) / 3;
                    out.push({key: "C", data: [cx1, cy1, cx2, cy2, x, y]});
                    lcx = x1;
                    lcy = y1;
                    cx = x;
                    cy = y;
                    break;
                }
                case "Q": {
                    const [x1, y1, x, y] = data;
                    const cx1 = cx + 2 * (x1 - cx) / 3;
                    const cy1 = cy + 2 * (y1 - cy) / 3;
                    const cx2 = x + 2 * (x1 - x) / 3;
                    const cy2 = y + 2 * (y1 - y) / 3;
                    out.push({key: "C", data: [cx1, cy1, cx2, cy2, x, y]});
                    lcx = x1;
                    lcy = y1;
                    cx = x;
                    cy = y;
                    break;
                }
                case "A": {
                    const r1 = Math.abs(data[0]);
                    const r2 = Math.abs(data[1]);
                    const angle = data[2];
                    const largeArcFlag = data[3];
                    const sweepFlag = data[4];
                    const x = data[5];
                    const y = data[6];
                    if (r1 === 0 || r2 === 0) {
                        out.push({key: "C", data: [cx, cy, x, y, x, y]});
                        cx = x;
                        cy = y;
                    } else {
                        if (cx !== x || cy !== y) {
                            const curves = arcToCubicCurves(cx, cy, x, y, r1, r2, angle, largeArcFlag, sweepFlag);
                            curves.forEach(function(curve) {
                                out.push({key: "C", data: curve});
                            });
                            cx = x;
                            cy = y;
                        }
                    }
                    break;
                }
                case "Z":
                    out.push({key: "Z", data: []});
                    cx = subx;
                    cy = suby;
                    break;
            }
            lastType = key;
        }
        return out;
    }
    function degToRad(degrees) {
        return Math.PI * degrees / 180;
    }
    function rotate(x, y, angleRad) {
        const X = x * Math.cos(angleRad) - y * Math.sin(angleRad);
        const Y = x * Math.sin(angleRad) + y * Math.cos(angleRad);
        return [X, Y];
    }
    function arcToCubicCurves(x1, y1, x2, y2, r1, r2, angle, largeArcFlag, sweepFlag, recursive) {
        const angleRad = degToRad(angle);
        let params = [];
        let f1 = 0, f2 = 0, cx = 0, cy = 0;
        if (recursive) {
            [f1, f2, cx, cy] = recursive;
        } else {
            [x1, y1] = rotate(x1, y1, -angleRad);
            [x2, y2] = rotate(x2, y2, -angleRad);
            const x = (x1 - x2) / 2;
            const y = (y1 - y2) / 2;
            let h = x * x / (r1 * r1) + y * y / (r2 * r2);
            if (h > 1) {
                h = Math.sqrt(h);
                r1 = h * r1;
                r2 = h * r2;
            }
            const sign = largeArcFlag === sweepFlag ? -1 : 1;
            const r1Pow = r1 * r1;
            const r2Pow = r2 * r2;
            const left = r1Pow * r2Pow - r1Pow * y * y - r2Pow * x * x;
            const right = r1Pow * y * y + r2Pow * x * x;
            const k = sign * Math.sqrt(Math.abs(left / right));
            cx = k * r1 * y / r2 + (x1 + x2) / 2;
            cy = k * -r2 * x / r1 + (y1 + y2) / 2;
            f1 = Math.asin(parseFloat(((y1 - cy) / r2).toFixed(9)));
            f2 = Math.asin(parseFloat(((y2 - cy) / r2).toFixed(9)));
            if (x1 < cx) {
                f1 = Math.PI - f1;
            }
            if (x2 < cx) {
                f2 = Math.PI - f2;
            }
            if (f1 < 0) {
                f1 = Math.PI * 2 + f1;
            }
            if (f2 < 0) {
                f2 = Math.PI * 2 + f2;
            }
            if (sweepFlag && f1 > f2) {
                f1 = f1 - Math.PI * 2;
            }
            if (!sweepFlag && f2 > f1) {
                f2 = f2 - Math.PI * 2;
            }
        }
        let df = f2 - f1;
        if (Math.abs(df) > Math.PI * 120 / 180) {
            const f2old = f2;
            const x2old = x2;
            const y2old = y2;
            if (sweepFlag && f2 > f1) {
                f2 = f1 + Math.PI * 120 / 180 * 1;
            } else {
                f2 = f1 + Math.PI * 120 / 180 * -1;
            }
            x2 = cx + r1 * Math.cos(f2);
            y2 = cy + r2 * Math.sin(f2);
            params = arcToCubicCurves(x2, y2, x2old, y2old, r1, r2, angle, 0, sweepFlag, [f2, f2old, cx, cy]);
        }
        df = f2 - f1;
        const c1 = Math.cos(f1);
        const s1 = Math.sin(f1);
        const c2 = Math.cos(f2);
        const s2 = Math.sin(f2);
        const t = Math.tan(df / 4);
        const hx = 4 / 3 * r1 * t;
        const hy = 4 / 3 * r2 * t;
        const m1 = [x1, y1];
        const m2 = [x1 + hx * s1, y1 - hy * c1];
        const m3 = [x2 + hx * s2, y2 - hy * c2];
        const m4 = [x2, y2];
        m2[0] = 2 * m1[0] - m2[0];
        m2[1] = 2 * m1[1] - m2[1];
        if (recursive) {
            return [m2, m3, m4].concat(params);
        } else {
            params = [m2, m3, m4].concat(params);
            const curves = [];
            for (let i = 0; i < params.length; i += 3) {
                const r12 = rotate(params[i][0], params[i][1], angleRad);
                const r22 = rotate(params[i + 1][0], params[i + 1][1], angleRad);
                const r3 = rotate(params[i + 2][0], params[i + 2][1], angleRad);
                curves.push([r12[0], r12[1], r22[0], r22[1], r3[0], r3[1]]);
            }
            return curves;
        }
    }
    exports.absolutize = absolutize;
    exports.normalize = normalize;
    exports.parsePath = parsePath;
    exports.serialize = serialize;
}));