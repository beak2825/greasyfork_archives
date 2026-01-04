(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SvgPath = factory());
})(this, (() => {
    const epsilon = 0.0000000001;
    const torad = Math.PI / 180;
    class Ellipse {
        constructor(rx, ry, ax) {
            if (!(this instanceof Ellipse)) return new Ellipse(rx, ry, ax);
            this.rx = rx;
            this.ry = ry;
            this.ax = ax;
        }
        transform(m) {
            const c = Math.cos(this.ax * torad);
            const s = Math.sin(this.ax * torad);
            const ma = [
                this.rx * (m[0] * c + m[2] * s),
                this.rx * (m[1] * c + m[3] * s),
                this.ry * (-m[0] * s + m[2] * c),
                this.ry * (-m[1] * s + m[3] * c)
            ];
            const J = ma[0] * ma[0] + ma[2] * ma[2];
            const K = ma[1] * ma[1] + ma[3] * ma[3];
            let D = (
                (ma[0] - ma[3]) *
                (ma[0] - ma[3]) +
                (ma[2] + ma[1]) *
                (ma[2] + ma[1])
            ) * (
                (ma[0] + ma[3]) *
                (ma[0] + ma[3]) +
                (ma[2] - ma[1]) *
                (ma[2] - ma[1])
            );
            const JK = (J + K) / 2;
            if (D < epsilon * JK) {
                this.rx = this.ry = Math.sqrt(JK);
                this.ax = 0;
                return this;
            }
            const L = ma[0] * ma[1] + ma[2] * ma[3];
            D = Math.sqrt(D);
            const l1 = JK + D / 2;
            const l2 = JK - D / 2;
            this.ax = (Math.abs(L) < epsilon && Math.abs(l1 - K) < epsilon)
                ? 90
                : Math.atan(
                    Math.abs(L) > Math.abs(l1 - K)
                    ? (l1 - J) / L
                    : L / (l1 - K)
                ) * 180 / Math.PI;
            if (this.ax >= 0) {
                this.rx = Math.sqrt(l1);
                this.ry = Math.sqrt(l2);
            } else {
                this.ax += 90;
                this.rx = Math.sqrt(l2);
                this.ry = Math.sqrt(l1);
            }
            return this;
        }
        isDegenerate() {
            return (this.rx < epsilon * this.ry || this.ry < epsilon * this.rx);
        }
    }
    const TAU = Math.PI * 2;
    const unit_vector_angle = (ux, uy, vx, vy) => {
        const sign = (ux * vy - uy * vx < 0) ? -1 : 1;
        let dot  = ux * vx + uy * vy;
        if (dot >  1.0) { dot =  1.0; }
        if (dot < -1) { dot = -1; }
        return sign * Math.acos(dot);
    };
    const get_arc_center = (x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi) => {
        const x1p =  cos_phi*(x1-x2)/2 + sin_phi*(y1-y2)/2;
        const y1p = -sin_phi*(x1-x2)/2 + cos_phi*(y1-y2)/2;
        const rx_sq  =  rx * rx;
        const ry_sq  =  ry * ry;
        const x1p_sq = x1p * x1p;
        const y1p_sq = y1p * y1p;
        let radicant = (rx_sq * ry_sq) - (rx_sq * y1p_sq) - (ry_sq * x1p_sq);
        if (radicant < 0) {
            radicant = 0;
        }
        radicant /=   (rx_sq * y1p_sq) + (ry_sq * x1p_sq);
        radicant = Math.sqrt(radicant) * (fa === fs ? -1 : 1);
        const cxp = radicant *  rx/ry * y1p;
        const cyp = radicant * -ry/rx * x1p;
        const cx = cos_phi*cxp - sin_phi*cyp + (x1+x2)/2;
        const cy = sin_phi*cxp + cos_phi*cyp + (y1+y2)/2;
        const v1x =  (x1p - cxp) / rx;
        const v1y =  (y1p - cyp) / ry;
        const v2x = (-x1p - cxp) / rx;
        const v2y = (-y1p - cyp) / ry;
        const theta1 = unit_vector_angle(1, 0, v1x, v1y);
        let delta_theta = unit_vector_angle(v1x, v1y, v2x, v2y);
        if (fs === 0 && delta_theta > 0) {
            delta_theta -= TAU;
        }
        if (fs === 1 && delta_theta < 0) {
            delta_theta += TAU;
        }
        return [ cx, cy, theta1, delta_theta ];
    };
    const approximate_unit_arc = (theta1, delta_theta) => {
        const alpha = 4/3 * Math.tan(delta_theta/4);
        const x1 = Math.cos(theta1);
        const y1 = Math.sin(theta1);
        const x2 = Math.cos(theta1 + delta_theta);
        const y2 = Math.sin(theta1 + delta_theta);
        return [ x1, y1, x1 - y1*alpha, y1 + x1*alpha, x2 + y2*alpha, y2 - x2*alpha, x2, y2 ];
    };
    const a2c = (x1, y1, x2, y2, fa, fs, rx, ry, phi) => {
        const sin_phi = Math.sin(phi * TAU / 360);
        const cos_phi = Math.cos(phi * TAU / 360);
        const x1p =  cos_phi*(x1-x2)/2 + sin_phi*(y1-y2)/2;
        const y1p = -sin_phi*(x1-x2)/2 + cos_phi*(y1-y2)/2;
        if (x1p === 0 && y1p === 0) return [];
        if (rx === 0 || ry === 0) return [];
        rx = Math.abs(rx);
        ry = Math.abs(ry);
        const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }
        const cc = get_arc_center(x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi);
        const result = [];
        let theta1 = cc[2];
        let delta_theta = cc[3];
        const segments = Math.max(Math.ceil(Math.abs(delta_theta) / (TAU / 4)), 1);
        delta_theta /= segments;
        for (let i = 0; i < segments; i++) {
            result.push(approximate_unit_arc(theta1, delta_theta));
            theta1 += delta_theta;
        }
        return result.map(curve => {
            for (let i = 0; i < curve.length; i += 2) {
                let x = curve[i + 0];
                let y = curve[i + 1];
                x *= rx;
                y *= ry;
                const xp = cos_phi*x - sin_phi*y;
                const yp = sin_phi*x + cos_phi*y;
                curve[i + 0] = xp + cc[0];
                curve[i + 1] = yp + cc[1];
            }
            return curve;
        });
    };
    const combine = (m1, m2) => {
        return [
            m1[0] * m2[0] + m1[2] * m2[1],
            m1[1] * m2[0] + m1[3] * m2[1],
            m1[0] * m2[2] + m1[2] * m2[3],
            m1[1] * m2[2] + m1[3] * m2[3],
            m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
            m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
        ];
    };
    class Matrix {
        constructor() {
            if (!(this instanceof Matrix)) return new Matrix();
            this.queue = [];
            this.cache = null;
        }
        matrix(m) {
            if (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0) return this;
            this.cache = null;
            this.queue.push(m);
            return this;
        }
        translate(tx, ty) {
            if (tx !== 0 || ty !== 0) {
                this.cache = null;
                this.queue.push([1, 0, 0, 1, tx, ty]);
            }
            return this;
        }
        scale(sx, sy) {
            if (sx !== 1 || sy !== 1) {
                this.cache = null;
                this.queue.push([sx, 0, 0, sy, 0, 0]);
            }
            return this;
        }
        rotate(angle, rx, ry) {
            if (angle !== 0) {
                this.translate(rx, ry);
                const rad = angle * Math.PI / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                this.queue.push([cos, sin, -sin, cos, 0, 0]);
                this.cache = null;
                this.translate(-rx, -ry);
            }
            return this;
        }
        skewX(angle) {
            if (angle !== 0) {
                this.cache = null;
                this.queue.push([1, 0, Math.tan(angle * Math.PI / 180), 1, 0, 0]);
            }
            return this;
        }
        skewY(angle) {
            if (angle !== 0) {
                this.cache = null;
                this.queue.push([1, Math.tan(angle * Math.PI / 180), 0, 1, 0, 0]);
            }
            return this;
        }
        toArray() {
            if (this.cache) return this.cache;
            if (!this.queue.length) {
                this.cache = [1, 0, 0, 1, 0, 0];
                return this.cache;
            }
            this.cache = this.queue[0];
            if (this.queue.length === 1) {
                return this.cache;
            }
            for (let i = 1; i < this.queue.length; i++) {
                this.cache = combine(this.cache, this.queue[i]);
            }
            return this.cache;
        }
        calc(x, y, isRelative) {
            if (!this.queue.length) return [x, y];
            if (!this.cache) {
                this.cache = this.toArray();
            }
            const m = this.cache;
            return [
                x * m[0] + y * m[2] + (isRelative ? 0 : m[4]),
                x * m[1] + y * m[3] + (isRelative ? 0 : m[5])
            ];
        }
    }
    const paramCounts = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 };
    const SPECIAL_SPACES = [
        0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
        0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF
    ];
    const isSpace = ch => (
        (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) ||
        (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
        (ch >= 0x1680 && SPECIAL_SPACES.indexOf(ch) >= 0)
    );
    const isCommand = code => {
        switch (code | 0x20) {
            case 0x6D:
            case 0x7A:
            case 0x6C:
            case 0x68:
            case 0x76:
            case 0x63:
            case 0x73:
            case 0x71:
            case 0x74:
            case 0x61:
            case 0x72:
                return true;
        }
        return false;
    };
    const isArc = code => (code | 0x20) === 0x61;
    const isDigit = code => (code >= 48 && code <= 57);
    const isDigitStart = code => (
        (code >= 48 && code <= 57) ||
        code === 0x2B ||
        code === 0x2D ||
        code === 0x2E
    );
    class State {
        constructor(path) {
            this.index = 0;
            this.path = path;
            this.max = path.length;
            this.result = [];
            this.param = 0.0;
            this.err = '';
            this.segmentStart = 0;
            this.data = [];
        }
    }
    const skipSpaces = state => {
        while (state.index < state.max && isSpace(state.path.charCodeAt(state.index))) state.index++;
    };
    const scanFlag = state => {
        const ch = state.path.charCodeAt(state.index);
        if (ch === 0x30) {
            state.param = 0;
            state.index++;
            return;
        }
        if (ch === 0x31) {
            state.param = 1;
            state.index++;
            return;
        }
        state.err = `SvgPath: arc flag can be 0 or 1 only (at pos ${  state.index  })`;
    };
    const scanParam = state => {
        const start = state.index;
        let index = start;
        const max = state.max;
        let zeroFirst = false;
        let hasCeiling = false;
        let hasDecimal = false;
        let hasDot = false;
        let ch;
        if (index >= max) {
            state.err = `SvgPath: missed param (at pos ${  index  })`;
            return;
        }
        ch = state.path.charCodeAt(index);
        if (ch === 0x2B || ch === 0x2D) {
            index++;
            ch = (index < max) ? state.path.charCodeAt(index) : 0;
        }
        if (!isDigit(ch) && ch !== 0x2E) {
            state.err = `SvgPath: param should start with 0..9 or \`.\` (at pos ${  index  })`;
            return;
        }
        if (ch !== 0x2E) {
            zeroFirst = (ch === 0x30);
            index++;
            ch = (index < max) ? state.path.charCodeAt(index) : 0;
            if (zeroFirst && index < max) {
                if (ch && isDigit(ch)) {
                    state.err = `SvgPath: numbers started with \`0\` such as \`09\` are illegal (at pos ${  start  })`;
                    return;
                }
            }
            while (index < max && isDigit(state.path.charCodeAt(index))) {
                index++;
                hasCeiling = true;
            }
            ch = (index < max) ? state.path.charCodeAt(index) : 0;
        }
        if (ch === 0x2E) {
            hasDot = true;
            index++;
            while (isDigit(state.path.charCodeAt(index))) {
                index++;
                hasDecimal = true;
            }
            ch = (index < max) ? state.path.charCodeAt(index) : 0;
        }
        if (ch === 0x65 || ch === 0x45) {
            if (hasDot && !hasCeiling && !hasDecimal) {
                state.err = `SvgPath: invalid float exponent (at pos ${  index  })`;
                return;
            }
            index++;
            ch = (index < max) ? state.path.charCodeAt(index) : 0;
            if (ch === 0x2B || ch === 0x2D) index++;
            if (index < max && isDigit(state.path.charCodeAt(index))) {
                while (index < max && isDigit(state.path.charCodeAt(index))) index++;
            } else {
                state.err = `SvgPath: invalid float exponent (at pos ${  index  })`;
                return;
            }
        }
        state.index = index;
        state.param = parseFloat(state.path.slice(start, index)) + 0.0;
    };
    const finalizeSegment = state => {
        let cmd   = state.path[state.segmentStart];
        let cmdLC = cmd.toLowerCase();
        let params = state.data;
        if (cmdLC === 'm' && params.length > 2) {
            state.result.push([ cmd, params[0], params[1] ]);
            params = params.slice(2);
            cmdLC = 'l';
            cmd = (cmd === 'm') ? 'l' : 'L';
        }
        if (cmdLC === 'r') state.result.push([ cmd ].concat(params));
        else {
            while (params.length >= paramCounts[cmdLC]) {
                state.result.push([ cmd ].concat(params.splice(0, paramCounts[cmdLC])));
                if (!paramCounts[cmdLC]) break;
            }
        }
    };
    const scanSegment = state => {
        const max = state.max;
        state.segmentStart = state.index;
        const cmdCode = state.path.charCodeAt(state.index);
        const is_arc = isArc(cmdCode);
        if (!isCommand(cmdCode)) {
            state.err = `SvgPath: bad command ${  state.path[state.index]  } (at pos ${  state.index  })`;
            return;
        }
        const need_params = paramCounts[state.path[state.index].toLowerCase()];
        state.index++;
        skipSpaces(state);
        state.data = [];
        if (!need_params) {
            finalizeSegment(state);
            return;
        }
        let comma_found = false;
        for (;;) {
            for (let i = need_params; i > 0; i--) {
                if (is_arc && (i === 3 || i === 4)) scanFlag(state);
                else scanParam(state);
                if (state.err.length) {
                    finalizeSegment(state);
                    return;
                }
                state.data.push(state.param);
                skipSpaces(state);
                comma_found = false;
                if (state.index < max && state.path.charCodeAt(state.index) === 0x2C) {
                    state.index++;
                    skipSpaces(state);
                    comma_found = true;
                }
            }
            if (comma_found) continue;
            if (state.index >= state.max) break;
            if (!isDigitStart(state.path.charCodeAt(state.index))) break;
        }
        finalizeSegment(state);
    };
    const pathParse = svgPath => {
        const state = new State(svgPath);
        const max = state.max;
        skipSpaces(state);
        while (state.index < max && !state.err.length) scanSegment(state);
        if (state.result.length) {
            if ('mM'.indexOf(state.result[0][0]) < 0) {
                state.err = 'SvgPath: string should start with `M` or `m`';
                state.result = [];
            } else {
                state.result[0][0] = 'M';
            }
        }
        return {
            err: state.err,
            segments: state.result
        };
    };
    const operations = {
        matrix: true,
        scale: true,
        rotate: true,
        translate: true,
        skewX: true,
        skewY: true
    };
    const CMD_SPLIT_RE = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/;
    const PARAMS_SPLIT_RE = /[\s,]+/;
    const transformParse = transformString => {
        const matrix = new Matrix();
        let cmd;
        let params;
        transformString.split(CMD_SPLIT_RE).forEach(item => {
            if (!item.length) return;
            if (typeof operations[item] !== 'undefined') {
                cmd = item;
                return;
            }
            params = item.split(PARAMS_SPLIT_RE).map(i => +i || 0);
            switch (cmd) {
                case 'matrix':
                    if (params.length === 6) matrix.matrix(params);
                    return;
                case 'scale':
                    if (params.length === 1) matrix.scale(params[0], params[0]);
                    else if (params.length === 2) matrix.scale(params[0], params[1]);
                    return;
                case 'rotate':
                    if (params.length === 1) matrix.rotate(params[0], 0, 0);
                    else if (params.length === 3) matrix.rotate(params[0], params[1], params[2]);
                    return;
                case 'translate':
                    if (params.length === 1) matrix.translate(params[0], 0);
                    else if (params.length === 2) matrix.translate(params[0], params[1]);
                    return;
                case 'skewX':
                    if (params.length === 1) matrix.skewX(params[0]);
                    return;
                case 'skewY':
                    if (params.length === 1) matrix.skewY(params[0]);
                    return;
            }
        });
        return matrix;
    };
    class SvgPath {
        constructor(path) {
            if (!(this instanceof SvgPath)) return new SvgPath(path);
            const pstate = pathParse(path);
            this.segments = pstate.segments;
            this.err = pstate.err;
            this.__stack = [];
        }
        static from(src) {
            if (typeof src === 'string') return new SvgPath(src);
            if (src instanceof SvgPath) {
                const s = new SvgPath('');
                s.err = src.err;
                s.segments = src.segments.map(sgm => sgm.slice());
                s.__stack = src.__stack.map(m => new Matrix().matrix(m.toArray()));
                return s;
            }
            throw new Error(`SvgPath.from: invalid param type ${  src}`);
        }
        __matrix(m) {
            const self = this;
            if (!m.queue.length) return;
            this.iterate((s, index, x, y) => {
                let p;
                let result;
                let name;
                let isRelative;
                switch (s[0]) {
                    case 'v':
                        p = m.calc(0, s[1], true);
                        result = (p[0] === 0) ? ['v', p[1]] : ['l', p[0], p[1]];
                        break;
                    case 'V':
                        p = m.calc(x, s[1], false);
                        result = (p[0] === m.calc(x, y, false)[0]) ? ['V', p[1]] : ['L', p[0], p[1]];
                        break;
                    case 'h':
                        p = m.calc(s[1], 0, true);
                        result = (p[1] === 0) ? ['h', p[0]] : ['l', p[0], p[1]];
                        break;
                    case 'H':
                        p = m.calc(s[1], y, false);
                        result = (p[1] === m.calc(x, y, false)[1]) ? ['H', p[0]] : ['L', p[0], p[1]];
                        break;
                    case 'a':
                    case 'A': {
                        /*if ((s[0] === 'A' && s[6] === x && s[7] === y) ||
                                (s[0] === 'a' && s[6] === 0 && s[7] === 0)) {
                            return [];
                        }*/
                        const ma = m.toArray();
                        const e = new Ellipse(s[1], s[2], s[3]).transform(ma);
                        if (ma[0] * ma[3] - ma[1] * ma[2] < 0) {
                            s[5] = s[5] ? '0' : '1';
                        }
                        p = m.calc(s[6], s[7], s[0] === 'a');
                        if (
                            (s[0] === 'A' && s[6] === x && s[7] === y) ||
                            (s[0] === 'a' && s[6] === 0 && s[7] === 0)
                        ) {
                            result = [s[0] === 'a' ? 'l' : 'L', p[0], p[1]];
                            break;
                        }
                        result = e.isDegenerate() ? [s[0] === 'a' ? 'l' : 'L', p[0], p[1]] : [s[0], e.rx, e.ry, e.ax, s[4], s[5], p[0], p[1]];
                        break;
                    }
                    case 'm':
                        isRelative = index > 0;
                        p = m.calc(s[1], s[2], isRelative);
                        result = ['m', p[0], p[1]];
                        break;
                    default:
                        name = s[0];
                        result = [name];
                        isRelative = (name.toLowerCase() === name);
                        for (let i = 1; i < s.length; i += 2) {
                            p = m.calc(s[i], s[i + 1], isRelative);
                            result.push(p[0], p[1]);
                        }
                }
                self.segments[index] = result;
            }, true);
        }
        __evaluateStack() {
            if (!this.__stack.length) return;
            if (this.__stack.length === 1) {
                this.__matrix(this.__stack[0]);
                this.__stack = [];
                return;
            }
            const m = new Matrix();
            let i = this.__stack.length;
            while (--i >= 0) m.matrix(this.__stack[i].toArray());
            this.__matrix(m);
            this.__stack = [];
        }
        toString() {
            let result = '';
            let prevCmd = '';
            let cmdSkipped = false;
            this.__evaluateStack();
            for (let i = 0, len = this.segments.length; i < len; i++) {
                const segment = this.segments[i];
                const cmd = segment[0];
                if (cmd !== prevCmd || cmd === 'm' || cmd === 'M') {
                    if (cmd === 'm' && prevCmd === 'z') result += ' ';
                    result += cmd;
                    cmdSkipped = false;
                } else {
                    cmdSkipped = true;
                }
                for (let pos = 1; pos < segment.length; pos++) {
                    const val = segment[pos];
                    if (pos === 1) {
                        if (cmdSkipped && val >= 0) result += ' ';
                    } else if (val >= 0) result += ' ';
                    result += val;
                }
                prevCmd = cmd;
            }
            return result;
        }
        translate(x, y) {
            this.__stack.push(new Matrix().translate(x, y || 0));
            return this;
        }
        scale(sx, sy) {
            this.__stack.push(new Matrix().scale(sx, (!sy && (sy !== 0)) ? sx : sy));
            return this;
        }
        rotate(angle, rx, ry) {
            this.__stack.push(new Matrix().rotate(angle, rx || 0, ry || 0));
            return this;
        }
        skewX(degrees) {
            this.__stack.push(new Matrix().skewX(degrees));
            return this;
        }
        skewY(degrees) {
            this.__stack.push(new Matrix().skewY(degrees));
            return this;
        }
        matrix(m) {
            this.__stack.push(new Matrix().matrix(m));
            return this;
        }
        transform(transformString) {
            if (!transformString.trim()) return this;
            this.__stack.push(transformParse(transformString));
            return this;
        }
        round(d) {
            let contourStartDeltaX = 0;
            let contourStartDeltaY = 0;
            let deltaX = 0;
            let deltaY = 0;
            let l;
            d = d || 0;
            this.__evaluateStack();
            this.segments.forEach(s => {
                const isRelative = (s[0].toLowerCase() === s[0]);
                switch (s[0]) {
                    case 'H':
                    case 'h':
                        if (isRelative) { s[1] += deltaX; }
                        deltaX = s[1] - s[1].toFixed(d);
                        s[1] = +s[1].toFixed(d);
                        return;
                    case 'V':
                    case 'v':
                        if (isRelative) { s[1] += deltaY; }
                        deltaY = s[1] - s[1].toFixed(d);
                        s[1] = +s[1].toFixed(d);
                        return;
                    case 'Z':
                    case 'z':
                        deltaX = contourStartDeltaX;
                        deltaY = contourStartDeltaY;
                        return;
                    case 'M':
                    case 'm':
                        if (isRelative) {
                            s[1] += deltaX;
                            s[2] += deltaY;
                        }
                        deltaX = s[1] - s[1].toFixed(d);
                        deltaY = s[2] - s[2].toFixed(d);
                        contourStartDeltaX = deltaX;
                        contourStartDeltaY = deltaY;
                        s[1] = +s[1].toFixed(d);
                        s[2] = +s[2].toFixed(d);
                        return;
                    case 'A':
                    case 'a':
                        if (isRelative) {
                            s[6] += deltaX;
                            s[7] += deltaY;
                        }
                        deltaX = s[6] - s[6].toFixed(d);
                        deltaY = s[7] - s[7].toFixed(d);
                        s[1] = +s[1].toFixed(d);
                        s[2] = +s[2].toFixed(d);
                        s[3] = +s[3].toFixed(d + 2);
                        s[6] = +s[6].toFixed(d);
                        s[7] = +s[7].toFixed(d);
                        return;
                    default:
                        l = s.length;
                        if (isRelative) {
                            s[l - 2] += deltaX;
                            s[l - 1] += deltaY;
                        }
                        deltaX = s[l - 2] - s[l - 2].toFixed(d);
                        deltaY = s[l - 1] - s[l - 1].toFixed(d);
                        s.forEach((val, i) => {
                            if (!i) return;
                            s[i] = +s[i].toFixed(d);
                        });
                        return;
                }
            });
            return this;
        }
        iterate(iterator, keepLazyStack) {
            const segments = this.segments;
            const replacements = {};
            let needReplace = false;
            let lastX = 0;
            let lastY = 0;
            let countourStartX = 0;
            let countourStartY = 0;
            if (!keepLazyStack) this.__evaluateStack();
            segments.forEach((s, index) => {
                const res = iterator(s, index, lastX, lastY);
                if (Array.isArray(res)) {
                    replacements[index] = res;
                    needReplace = true;
                }
                const isRelative = (s[0] === s[0].toLowerCase());
                switch (s[0]) {
                    case 'm':
                    case 'M':
                        lastX = s[1] + (isRelative ? lastX : 0);
                        lastY = s[2] + (isRelative ? lastY : 0);
                        countourStartX = lastX;
                        countourStartY = lastY;
                        return;
                    case 'h':
                    case 'H':
                        lastX = s[1] + (isRelative ? lastX : 0);
                        return;
                    case 'v':
                    case 'V':
                        lastY = s[1] + (isRelative ? lastY : 0);
                        return;
                    case 'z':
                    case 'Z':
                        lastX = countourStartX;
                        lastY = countourStartY;
                        return;
                    default:
                        lastX = s[s.length - 2] + (isRelative ? lastX : 0);
                        lastY = s[s.length - 1] + (isRelative ? lastY : 0);
                }
            });
            if (!needReplace) return this;
            const newSegments = [];
            for (let i = 0; i < segments.length; i++) {
                if (typeof replacements[i] !== 'undefined') {
                    for (let j = 0; j < replacements[i].length; j++) {
                        newSegments.push(replacements[i][j]);
                    }
                } else {
                    newSegments.push(segments[i]);
                }
            }
            this.segments = newSegments;
            return this;
        }
        abs() {
            this.iterate((s, index, x, y) => {
                const name = s[0];
                const nameUC = name.toUpperCase();
                if (name === nameUC) return;
                s[0] = nameUC;
                switch (name) {
                    case 'v':
                        s[1] += y;
                        return;
                    case 'a':
                        s[6] += x;
                        s[7] += y;
                        return;
                    default:
                        for (let i = 1; i < s.length; i++) {
                            s[i] += i % 2 ? x : y;
                        }
                }
            }, true);
            return this;
        }
        rel() {
            this.iterate((s, index, x, y) => {
                const name = s[0];
                const nameLC = name.toLowerCase();
                if (name === nameLC) return;
                if (index === 0 && name === 'M') return;
                s[0] = nameLC;
                switch (name) {
                    case 'V':
                        s[1] -= y;
                        return;
                    case 'A':
                        s[6] -= x;
                        s[7] -= y;
                        return;
                    default:
                        for (let i = 1; i < s.length; i++) {
                            s[i] -= i % 2 ? x : y;
                        }
                }
            }, true);
            return this;
        }
        unarc() {
            this.iterate((s, index, x, y) => {
                let nextX;
                let nextY;
                const result = [];
                const name = s[0];
                if (name !== 'A' && name !== 'a') return null;
                if (name === 'a') {
                    nextX = x + s[6];
                    nextY = y + s[7];
                } else {
                    nextX = s[6];
                    nextY = s[7];
                }
                const new_segments = a2c(x, y, nextX, nextY, s[4], s[5], s[1], s[2], s[3]);
                if (new_segments.length === 0) return [[s[0] === 'a' ? 'l' : 'L', s[6], s[7]]];
                new_segments.forEach(s => result.push(['C', s[2], s[3], s[4], s[5], s[6], s[7]]));
                return result;
            });
            return this;
        }
        unshort() {
            const segments = this.segments;
            let prevControlX;
            let prevControlY;
            let prevSegment;
            let curControlX;
            let curControlY;
            this.iterate((s, idx, x, y) => {
                const name = s[0];
                const nameUC = name.toUpperCase();
                let isRelative;
                if (!idx) return;
                if (nameUC === 'T') {
                    isRelative = (name === 't');
                    prevSegment = segments[idx - 1];
                    if (prevSegment[0] === 'Q') {
                        prevControlX = prevSegment[1] - x;
                        prevControlY = prevSegment[2] - y;
                    } else if (prevSegment[0] === 'q') {
                        prevControlX = prevSegment[1] - prevSegment[3];
                        prevControlY = prevSegment[2] - prevSegment[4];
                    } else {
                        prevControlX = 0;
                        prevControlY = 0;
                    }
                    curControlX = -prevControlX;
                    curControlY = -prevControlY;
                    if (!isRelative) {
                        curControlX += x;
                        curControlY += y;
                    }
                    segments[idx] = [
                        isRelative ? 'q' : 'Q',
                        curControlX, curControlY,
                        s[1], s[2]
                    ];
                } else if (nameUC === 'S') {
                    isRelative = (name === 's');
                    prevSegment = segments[idx - 1];
                    if (prevSegment[0] === 'C') {
                        prevControlX = prevSegment[3] - x;
                        prevControlY = prevSegment[4] - y;
                    } else if (prevSegment[0] === 'c') {
                        prevControlX = prevSegment[3] - prevSegment[5];
                        prevControlY = prevSegment[4] - prevSegment[6];
                    } else {
                        prevControlX = 0;
                        prevControlY = 0;
                    }
                    curControlX = -prevControlX;
                    curControlY = -prevControlY;
                    if (!isRelative) {
                        curControlX += x;
                        curControlY += y;
                    }
                    segments[idx] = [
                        isRelative ? 'c' : 'C',
                        curControlX, curControlY,
                        s[1], s[2], s[3], s[4]
                    ];
                }
            });
            return this;
        }
    }
    return SvgPath;
}));