(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Levenshtein = factory());
})(this, (function () { 'use strict';
    const peq = new Uint32Array(0x10000);
    const myers_32 = (a, b) => {
        const n = a.length;
        const m = b.length;
        const lst = 1 << (n - 1);
        let pv = -1;
        let mv = 0;
        let sc = n;
        let i = n;
        while (i--) {
            peq[a.charCodeAt(i)] |= 1 << i;
        }
        for (i = 0; i < m; i++) {
            let eq = peq[b.charCodeAt(i)];
            const xv = eq | mv;
            eq |= ((eq & pv) + pv) ^ pv;
            mv |= ~(eq | pv);
            pv &= eq;
            if (mv & lst) sc++;
            if (pv & lst) sc--;
            mv = (mv << 1) | 1;
            pv = (pv << 1) | ~(xv | mv);
            mv &= xv;
        }
        i = n;
        while (i--) {
            peq[a.charCodeAt(i)] = 0;
        }
        return sc;
    };
    const myers_x = (b, a) => {
        const n = a.length;
        const m = b.length;
        const mhc = [];
        const phc = [];
        const hsize = Math.ceil(n / 32);
        const vsize = Math.ceil(m / 32);
        for (let i = 0; i < hsize; i++) {
            phc[i] = -1;
            mhc[i] = 0;
        }
        let j = 0;
        for (; j < vsize - 1; j++) {
            let mv = 0;
            let pv = -1;
            const start = j * 32;
            const vlen = Math.min(32, m) + start;
            for (let k = start; k < vlen; k++) {
                peq[b.charCodeAt(k)] |= 1 << k;
            }
            for (let i = 0; i < n; i++) {
                const eq = peq[a.charCodeAt(i)];
                const pb = (phc[(i / 32) | 0] >>> i) & 1;
                const mb = (mhc[(i / 32) | 0] >>> i) & 1;
                const xv = eq | mv;
                const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
                let ph = mv | ~(xh | pv);
                let mh = pv & xh;
                if ((ph >>> 31) ^ pb) {
                    phc[(i / 32) | 0] ^= 1 << i;
                }
                if ((mh >>> 31) ^ mb) {
                    mhc[(i / 32) | 0] ^= 1 << i;
                }
                ph = (ph << 1) | pb;
                mh = (mh << 1) | mb;
                pv = mh | ~(xv | ph);
                mv = ph & xv;
            }
            for (let k = start; k < vlen; k++) {
                peq[b.charCodeAt(k)] = 0;
            }
        }
        let mv = 0;
        let pv = -1;
        const start = j * 32;
        const vlen = Math.min(32, m - start) + start;
        for (let k = start; k < vlen; k++) {
            peq[b.charCodeAt(k)] |= 1 << k;
        }
        let score = m;
        for (let i = 0; i < n; i++) {
            const eq = peq[a.charCodeAt(i)];
            const pb = (phc[(i / 32) | 0] >>> i) & 1;
            const mb = (mhc[(i / 32) | 0] >>> i) & 1;
            const xv = eq | mv;
            const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
            let ph = mv | ~(xh | pv);
            let mh = pv & xh;
            score += (ph >>> (m - 1)) & 1;
            score -= (mh >>> (m - 1)) & 1;
            if ((ph >>> 31) ^ pb) {
                phc[(i / 32) | 0] ^= 1 << i;
            }
            if ((mh >>> 31) ^ mb) {
                mhc[(i / 32) | 0] ^= 1 << i;
            }
            ph = (ph << 1) | pb;
            mh = (mh << 1) | mb;
            pv = mh | ~(xv | ph);
            mv = ph & xv;
        }
        for (let k = start; k < vlen; k++) {
            peq[b.charCodeAt(k)] = 0;
        }
        return score;
    };
    const distance = (a, b) => {
        if (a.length < b.length) {
            const tmp = b;
            b = a;
            a = tmp;
        }
        if (b.length === 0) return a.length;
        if (a.length <= 32) return myers_32(a, b);
        return myers_x(a, b);
    };
    const collator = Intl.Collator("generic", { sensitivity: "base" });
    const prevRow = [];
    const str2Char = [];
    const Levenshtein = {
        get(str1, str2, options={useCollator:false}) {
            const useCollator = (options && collator && options.useCollator);
            if (useCollator) {
                const str1Len = str1.length;
                const str2Len = str2.length;
                if (str1Len === 0) return str2Len;
                if (str2Len === 0) return str1Len;
                for (i=0; i<str2Len; ++i) {
                    prevRow[i] = i;
                    str2Char[i] = str2.charCodeAt(i);
                }
                prevRow[str2Len] = str2Len;
                var strCmp;
                for (let i = 0; i < str1Len; ++i) {
                    let nextCol = i + 1;
                    for (let j = 0; j < str2Len; ++j) {
                        let curCol = nextCol;
                        strCmp = 0 === collator.compare(str1.charAt(i), String.fromCharCode(str2Char[j]));
                        nextCol = prevRow[j] + (strCmp ? 0 : 1);
                        let tmp = curCol + 1;
                        if (nextCol > tmp) {
                            nextCol = tmp;
                        }
                        tmp = prevRow[j + 1] + 1;
                        if (nextCol > tmp) {
                            nextCol = tmp;
                        }
                        prevRow[j] = curCol;
                    }
                    prevRow[j] = nextCol;
                }
                return nextCol;
            }
            return distance(str1, str2);
        }
    };
    return Levenshtein;
}));