(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global));
})(this, (exports => {
    class Svg {
        constructor({
            size,
            shape,
            margin,
            border,
            foreground,
            background
        }={}) {
            this.size = size;
            this.shape = shape;
            this.border = border ? ({}).toString.call(border) === '[object String]' ? {
                width: 1,
                color: border
            } : border : border;
            this.margin = margin;
            this.foreground = this.color(...foreground);
            this.background = this.color(...background);
            this.rectangles = [];

            const baseMargin = Math.floor(size * this.margin);
            this.pixel = Math.floor((size - (baseMargin * 2)) / 5);
        }
        color(r, g, b, a=1) {
            return [r, g, b, a].reduce((acc,channel,idx) => {
                if (idx === 3) {
                    if (channel < 1) {
                        acc += Math.round(channel * 255).toString(16).padStart(2, '0');
                    }
                } else {
                    acc += channel.toString(16).padStart(2, '0');
                }
                return acc
            }, '#')
        }
        getDump() {
            const [fg, bg, stroke, pixel] = [
                this.foreground,
                this.background,
                this.size * 0.005,
                this.pixel
            ];

            // https://github.com/ygoe/qrcode-generator/blob/5bb2d93e10/js/qrcode.js#L531-L662
            const pointEquals = function (a, b) {
                return a[0] === b[0] && a[1] === b[1];
            };

            // Mark all four edges of each square in clockwise drawing direction
            const edges = [];
            this.rectangles.forEach(({color, x: x0, y: y0}) => {
                if (color !== bg) {
                    const x1 = x0 + this.pixel;
                    const y1 = y0 + this.pixel;
                    edges.push([[x0, y0], [x1, y0]]);   // top edge (to right)
                    edges.push([[x1, y0], [x1, y1]]);   // right edge (down)
                    edges.push([[x1, y1], [x0, y1]]);   // bottom edge (to left)
                    edges.push([[x0, y1], [x0, y0]]);   // left edge (up)
                }
            });
            // Edges that exist in both directions cancel each other (connecting the rectangles)
            for (let i = edges.length - 1; i >= 0; i--) {
                for (let j = i - 1; j >= 0; j--) {
                    if (pointEquals(edges[i][0], edges[j][1]) &&
                        pointEquals(edges[i][1], edges[j][0])) {
                        // First remove index i, it's greater than j
                        edges.splice(i, 1);
                        edges.splice(j, 1);
                        i--;
                        break;
                    }
                }
            }

            let polygons = [];
            while (edges.length > 0) {
                // Pick a random edge and follow its connected edges to form a path (remove used edges)
                // If there are multiple connected edges, pick the first
                // Stop when the starting point of this path is reached
                let polygon = [];
                polygons.push(polygon);
                let edge = edges.splice(0, 1)[0];
                polygon.push(edge[0]);
                polygon.push(edge[1]);
                do {
                    let foundEdge = false;
                    for (let i = 0; i < edges.length; i++) {
                        if (pointEquals(edges[i][0], edge[1])) {
                            // Found an edge that starts at the last edge's end
                            foundEdge = true;
                            edge = edges.splice(i, 1)[0];
                            let p1 = polygon[polygon.length - 2];   // polygon's second-last point
                            let p2 = polygon[polygon.length - 1];   // polygon's current end
                            let p3 = edge[1];   // new point
                            // Extend polygon end if it's continuing in the same direction
                            if (p1[0] === p2[0] &&   // polygon ends vertical
                                p2[0] === p3[0]) {   // new point is vertical, too
                                polygon[polygon.length - 1][1] = p3[1];
                            }
                            else if (p1[1] === p2[1] &&   // polygon ends horizontal
                                p2[1] === p3[1]) {   // new point is horizontal, too
                                polygon[polygon.length - 1][0] = p3[0];
                            }
                            else {
                                polygon.push(p3);   // new direction
                            }
                            break;
                        }
                    }
                    if (!foundEdge)
                        throw new Error("no next edge found at", edge[1]);
                }
                while (!pointEquals(polygon[polygon.length - 1], polygon[0]));

                // Move polygon's start and end point into a corner
                if (polygon[0][0] === polygon[1][0] &&
                    polygon[polygon.length - 2][0] === polygon[polygon.length - 1][0]) {
                    // start/end is along a vertical line
                    polygon.length--;
                    polygon[0][1] = polygon[polygon.length - 1][1];
                }
                else if (polygon[0][1] === polygon[1][1] &&
                    polygon[polygon.length - 2][1] === polygon[polygon.length - 1][1]) {
                    // start/end is along a horizontal line
                    polygon.length--;
                    polygon[0][0] = polygon[polygon.length - 1][0];
                }
            }
            // Repeat until there are no more unused edges

            // If two paths touch in at least one point, pick such a point and include one path in the other's sequence of points
            for (let i = 0; i < polygons.length; i++) {
                const polygon = polygons[i];
                for (let j = 0; j < polygon.length; j++) {
                    const point = polygon[j];
                    for (let k = i + 1; k < polygons.length; k++) {
                        const polygon2 = polygons[k];
                        for (let l = 0; l < polygon2.length - 1; l++) {   // exclude end point (same as start)
                            const point2 = polygon2[l];
                            if (pointEquals(point, point2)) {
                                // Embed polygon2 into polygon
                                if (l > 0) {
                                    // Touching point is not other polygon's start/end
                                    polygon.splice.apply(polygon, [j + 1, 0].concat(
                                        polygon2.slice(1, l + 1)));
                                }
                                polygon.splice.apply(polygon, [j + 1, 0].concat(
                                    polygon2.slice(l + 1)));
                                polygons.splice(k, 1);
                                k--;
                                break;
                            }
                        }
                    }
                }
            }

            // Generate SVG path data
            let d = "";
            for (let i = 0; i < polygons.length; i++) {
                const polygon = polygons[i];
                d += "M" + polygon[0][0] + "," + polygon[0][1];
                for (let j = 1; j < polygon.length; j++) {
                    if (polygon[j][0] === polygon[j - 1][0])
                        d += "v" + (polygon[j][1] - polygon[j - 1][1]);
                    else
                        d += "h" + (polygon[j][0] - polygon[j - 1][0]);
                }
                d += "z";
            }
            let base;
            switch (this.shape) {
                case 'rect': {
                    const borderWidth = (this.border ? this.border.width : 0);
                    const origin = this.border ? borderWidth / 2 : 0;
                    const width = this.size - borderWidth;
                    base = `<path fill='${bg}' d='M${origin} ${origin}h${width}v${width}H${origin}z'${this.border ? ` stroke-width='${this.border.width}' stroke='${this.border.color}'` : ''}/>`;
                    break;
                }
                case 'circle': {
                    const borderWidth = (this.border ? this.border.width : 0);
                    const width = (this.size / 2);
                    base = `<circle cx='${width}' cy='${width}' r='${width - borderWidth}' fill='${bg}'${this.border ? ` stroke-width='${this.border.width}' stroke='${this.border.color}'` : ''}/>`;
                    break;
                }
                default: {
                    throw new Error(`shape must be rect or circle. ${this.shape} is not allowed`);
                }
            }

            return `<svg xmlns='http://www.w3.org/2000/svg' width='${this.size}' height='${this.size}'>${base}<path d='${d}' fill='${fg}' stroke='${fg}' stroke-width='${stroke}' width='${pixel}' height='${pixel}'/></svg>`
        }
        getBase64() {
            return btoa(this.getDump());
        }
    }

    class Identicon {
        constructor(hash, options) {
            if (typeof (hash) !== 'string' || hash.length < 15) {
                throw 'A hash of at least 15 characters is required.';
            }

            this.defaults = {
                background: [240, 240, 240, 1],
                margin: 0.08,
                size: 64,
                saturation: 0.7,
                brightness: 0.5,
                shape: 'rect',
                border: false
            };

            this.options = typeof (options) === 'object' ? options : this.defaults;

            // backward compatibility with old constructor (hash, size, margin)
            if (typeof (arguments[1]) === 'number') { this.options.size = arguments[1]; }
            if (arguments[2]) { this.options.margin = arguments[2]; }

            this.hash = hash;
            this.background = this.options.background || this.defaults.background;
            this.size = this.options.size || this.defaults.size;
            this.shape = this.options.shape || this.defaults.shape;
            this.border = this.options.border !== undefined ? this.options.border : this.defaults.border;
            this.margin = this.options.margin !== undefined ? this.options.margin : this.defaults.margin;

            // foreground defaults to last 7 chars as hue at 70% saturation, 50% brightness
            const hue = parseInt(this.hash.substring(this.hash.length - 7), 16) / 0xfffffff;
            const saturation = this.options.saturation || this.defaults.saturation;
            const brightness = this.options.brightness || this.defaults.brightness;
            this.foreground = this.options.foreground || this.hsl2rgb(hue, saturation, brightness).map(Math.round);
        }
        image() {
            return new Svg({
                size: this.size,
                shape: this.shape,
                margin: this.margin,
                border: this.border,
                foreground: this.foreground,
                background: this.background
            })
        }
        render() {
            const image = this.image();
            const size = this.size;
            const pixel = image.pixel;
            const margin = Math.floor((size - pixel * 5) / 2);
            const bg = image.color.apply(image, this.background);
            const fg = image.color.apply(image, this.foreground);

            // the first 15 characters of the hash control the pixels (even/odd)
            // they are drawn down the middle first, then mirrored outwards
            for (let i = 0; i < 15; i++) {
                const color = parseInt(this.hash.charAt(i), 16) % 2 ? bg : fg;
                if (i < 5) {
                    this.rectangle({
                        x: 2 * pixel + margin,
                        y: i * pixel + margin,
                        w: pixel,
                        h: pixel,
                        color,
                        image
                    });
                } else if (i < 10) {
                    const y = (i - 5) * pixel + margin;
                    this.rectangle({
                        x: 1 * pixel + margin,
                        y,
                        w: pixel,
                        h: pixel,
                        color,
                        image
                    });
                    this.rectangle({
                        x: 3 * pixel + margin,
                        y,
                        w: pixel,
                        h: pixel,
                        color,
                        image
                    });
                } else if (i < 15) {
                    const y = (i - 10) * pixel + margin;
                    this.rectangle({
                        x: 0 * pixel + margin,
                        y,
                        w: pixel,
                        h: pixel,
                        color,
                        image
                    });
                    this.rectangle({
                        x: 4 * pixel + margin,
                        y,
                        w: pixel,
                        h: pixel,
                        color,
                        image
                    });
                }
            }

            return image;
        }
        rectangle({ x, y, w, h, color, image }={}) {
            image.rectangles.push({ x, y, w, h, color });
        }
        // adapted from: https://gist.github.com/aemkei/1325937
        hsl2rgb(h, s, b) {
            h *= 6;
            s = [
                b += s *= b < .5 ? b : 1 - b,
                b - h % 1 * s * 2,
                b -= s *= 2,
                b,
                b + h % 1 * s,
                b + s
            ];

            return [
                s[~~h % 6] * 255, // red
                s[(h | 16) % 6] * 255, // green
                s[(h | 8) % 6] * 255 // blue
            ];
        }
        toURI() {
            return `data:image/svg+xml;base64,${this.render().getBase64()}`
        }
        toString(raw) {
            if (raw) return this.render().getDump();
            else return this.render().getBase64();
        }
    }

    exports.Identicon = Identicon;
}));