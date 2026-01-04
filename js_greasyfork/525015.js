(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('svgpath')) :
    typeof define === 'function' && define.amd ? define(['svgpath'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.svgPathBbox = factory(global.SvgPath));
})(this, (SvgPath => {
    const CBEZIER_MINMAX_EPSILON = 0.00000001;
    const minmaxQ = A => {
        const min = Math.min(A[0], A[2]);
        const max = Math.max(A[0], A[2]);
        if (A[1] >= A[0] ? A[2] >= A[1] : A[2] <= A[1]) return [min, max];
        const E = (A[0] * A[2] - A[1] * A[1]) / (A[0] - 2 * A[1] + A[2]);
        return E < min ? [E, max] : [min, E];
    };
    const minmaxC = A => {
        const K = A[0] - 3 * A[1] + 3 * A[2] - A[3];
        if (Math.abs(K) < CBEZIER_MINMAX_EPSILON) {
            if (A[0] === A[3] && A[0] === A[1]) return [A[0], A[3]];
            return minmaxQ([
                A[0],
                -0.5 * A[0] + 1.5 * A[1],
                A[0] - 3 * A[1] + 3 * A[2],
            ]);
        }
        const T = -A[0] * A[2] + A[0] * A[3] - A[1] * A[2] - A[1] * A[3] + A[1] * A[1] + A[2] * A[2];
        if (T <= 0) return [Math.min(A[0], A[3]), Math.max(A[0], A[3])];

        const S = Math.sqrt(T)
        let min = Math.min(A[0], A[3]);
        let max = Math.max(A[0], A[3]);
        const L = A[0] - 2 * A[1] + A[2];
        for (let R = (L + S) / K, i = 1; i <= 2; R = (L - S) / K, i++) {
            if (R > 0 && R < 1) {
                const Q = A[0] * (1 - R) * (1 - R) * (1 - R) + A[1] * 3 * (1 - R) * (1 - R) * R + A[2] * 3 * (1 - R) * R * R + A[3] * R * R * R;
                if (Q < min) {
                    min = Q;
                }
                if (Q > max) {
                    max = Q;
                }
            }
        }
        return [min, max];
    };
    /**
    * Compute bounding boxes of SVG paths.
    * @param {String | typeof SvgPath} d SVG path for which their bounding box will be computed.
    * @returns {BBox}
    */
    const svgPathBbox = d => {
        const min = [Infinity, Infinity];
        const max = [-Infinity, -Infinity];
        SvgPath.from(d)
                .abs()
                .unarc()
                .unshort()
                .iterate((seg, _, x, y) => {
                    switch (seg[0]) {
                        case "M": {
                            if (min[0] > seg[1]) {
                                min[0] = seg[1];
                            }
                            if (min[1] > seg[2]) {
                                min[1] = seg[2];
                            }
                            if (max[0] < seg[1]) {
                                max[0] = seg[1];
                            }
                            if (max[1] < seg[2]) {
                                max[1] = seg[2];
                            }
                            break;
                        }
                        case "H": {
                            if (min[0] > seg[1]) {
                                min[0] = seg[1];
                            }
                            if (max[0] < seg[1]) {
                                max[0] = seg[1];
                            }
                            break;
                        }
                        case "V": {
                            if (min[1] > seg[1]) {
                                min[1] = seg[1];
                            }
                            if (max[1] < seg[1]) {
                                max[1] = seg[1];
                            }
                            break;
                        }
                        case "L": {
                            if (min[0] > seg[1]) {
                                min[0] = seg[1];
                            }
                            if (min[1] > seg[2]) {
                                min[1] = seg[2];
                            }
                            if (max[0] < seg[1]) {
                                max[0] = seg[1];
                            }
                            if (max[1] < seg[2]) {
                                max[1] = seg[2];
                            }
                            break;
                        }
                        case "C": {
                            const cxMinMax = minmaxC([x, seg[1], seg[3], seg[5]]);
                            if (min[0] > cxMinMax[0]) {
                                min[0] = cxMinMax[0];
                            }
                            if (max[0] < cxMinMax[1]) {
                                max[0] = cxMinMax[1];
                            }
                            const cyMinMax = minmaxC([y, seg[2], seg[4], seg[6]]);
                            if (min[1] > cyMinMax[0]) {
                                min[1] = cyMinMax[0];
                            }
                            if (max[1] < cyMinMax[1]) {
                                max[1] = cyMinMax[1];
                            }
                            break;
                        }
                        case "Q": {
                            const qxMinMax = minmaxQ([x, seg[1], seg[3]]);
                            if (min[0] > qxMinMax[0]) {
                                min[0] = qxMinMax[0];
                            }
                            if (max[0] < qxMinMax[1]) {
                                max[0] = qxMinMax[1];
                            }
                            const qyMinMax = minmaxQ([y, seg[2], seg[4]]);
                            if (min[1] > qyMinMax[0]) {
                                min[1] = qyMinMax[0];
                            }
                            if (max[1] < qyMinMax[1]) {
                                max[1] = qyMinMax[1];
                            }
                            break;
                        }
                    }
                }, true);
        return [min[0], min[1], max[0], max[1]];
    };
    return svgPathBbox;
}));