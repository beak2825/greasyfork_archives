// ==UserScript==
// @name         vectorizer.ai
// @version      0.0.6
// @description  vectorizer.ai free download
// @icon         https://d1j8j7mb8gx2ao.cloudfront.net/p/assets/logos/vectorizer-ai-logo_1c2b7a3ae82c1def79ab4c0e9cc83bcc.svg

// @author       ml98
// @namespace    http://tampermonkey.net/
// @license      MIT

// @match        https://vectorizer.ai/images/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/497378/vectorizerai.user.js
// @updateURL https://update.greasyfork.org/scripts/497378/vectorizerai.meta.js
// ==/UserScript==

let state = 0;
let data = { width: 1, height: 1, curves: [], gap_fillers: [], style: {}, errors: 0 };

// todo: any other way to inject?
Object.defineProperty(Object.prototype, 'isReady', {
    get() {
        if(this.vectorInterfaces) {
            data.gap_fillers = this.vectorInterfaces
                .filter(i => i.color0.a > 0 && i.color1.a > 0)
                .map(i => ({ d: i.path.s, stroke: i.css }));
            create_download_button();
        }
        return this.__isReady;
    },
    set(isReady) {
        this.__isReady = isReady;
        return isReady;
    },
    configurable: true,
    enumerable: false,
});


function proxy_functions(object, apply = (f, _this, args) => f.apply(_this, args)) {
    const descriptors = Object.getOwnPropertyDescriptors(object);
    Object.keys(descriptors).filter(
        (name) => descriptors[name].value instanceof Function
    ).forEach((f) => {
        object[f] = new Proxy(object[f], { apply });
    });
}

function F(strings, ...values) {
    return strings[0] + values.map(
        (value, i) => value.toFixed(2).replace(/\.?0+$/,'') + strings[i+1]
    ).join('');
}

function path2svg(name, args) {
    switch (name) {
        case "moveTo": {
            let [x, y] = args;
            return F`M ${x} ${y}`;
        }
        case "lineTo": {
            let [x, y] = args;
            return F`L ${x} ${y}`;
        }
        case "ellipse": {
            let [cx, cy, rx, ry, rotation, theta1, theta2, ccw] = args;
            let dx = rx * Math.cos(theta2), dy = ry * Math.sin(theta2);
            let c = Math.cos(rotation), s = Math.sin(rotation);
            let ex= cx + c * dx - s * dy, ey = cy + s * dx + c * dy;
            let angle = rotation * (180 / Math.PI);
            let large_arc = (theta2 - theta1) % (2 * Math.PI) > Math.PI ? 1 : 0;
            let sweep = ccw ? 0 : 1;
            return F`A ${rx} ${ry} ${angle} ${large_arc} ${sweep} ${ex} ${ey}`;
        }
        case "bezierCurveTo": {
            let [cp1x, cp1y, cp2x, cp2y, x, y] = args;
            return F`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y}`;
        }
        case "quadraticCurveTo": {
            let [cpx, cpy, x, y] = args;
            return F`Q ${cpx} ${cpy} ${x} ${y}`;
        }
        case "closePath": {
            return `Z`;
        }
        default: {
            // throw new Error("unimplemented path", name);
            return `ERROR`;
        }
    }
}

proxy_functions(Path2D.prototype, (f, _this, args) => {
    _this.s ??= "";
    // _this.s += `${f.name}[${args.toString()}] `;
    _this.s += path2svg(f.name, args);
    return f.apply(_this, args);
});

proxy_functions(CanvasRenderingContext2D.prototype, (f, _this, args) => {
    if(_this.canvas.id) {
        // width, height
    }
    if(!_this.canvas.id) {
        switch(f.name) {
            case 'drawImage':
                if(state == 0) {
                    data.width = args[3];
                    data.height = args[4];
                    state = 1;
                }
                break;
            case 'clip':
                if(state == 1) {
                    // console.log(_this.lineWidth, _this.lineJoin);
                    data.curves = [];
                    data.errors = 0;
                    data.style = { lineWidth: _this.lineWidth, lineJoin: _this.lineJoin };
                    state = 2;
                }
                break;
            case 'fill':
                if(state == 2) {
                    // console.log(f.name, _this.fillStyle, args[0].s);
                    if(!args[0].s) {
                        data.errors++;
                        console.log('error: incomplete');
                        break;
                        // state = 1;
                    }
                    data.curves.push({fill: _this.fillStyle, d: args[0].s});
                }
                break;
            case 'stroke':
                if(state == 2) {
                    // console.log(f.name, _this.strokeStyle, args[0].s);
                    if(!args[0].s) {
                        data.errors++;
                        console.log('error: incomplete');
                        break;
                        // state = 1;
                    }
                    // data.curves.push({stroke: _this.strokeStyle, d: args[0].s});
                }
                break;
            case 'restore':
                if(state == 2) {
                    state = 1;
                    console.log(data);
                    update_download_button();
                }
                break;
        }
    }
    return f.apply(_this, args);
});

function svg_element(tag, attributes) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (let attr in attributes) {
        element.setAttribute(attr, attributes[attr]);
    }
    return element;
}

function create_svg() {
    const { width, height, curves, gap_fillers, style } = data;
    const svg = svg_element('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: `0 0 ${width} ${height}`,
        width,
        height,
    });

    let g = svg_element('g', {
        'stroke-width': 2,
        'fill': 'none',
        'stroke-linecap': 'butt',
    });
    svg.appendChild(g);

    gap_fillers.forEach(({d, stroke}) => {
        const element = svg_element('path', {d, stroke, 'vector-effect': 'non-scaling-stroke'});
        g.appendChild(element);
    });

    curves.forEach(({d, fill, stroke}) => {
        if(fill) {
            const element = svg_element('path', {d, fill});
            svg.appendChild(element);
        }
    });

    return svg;
}

let a = null;
function create_download_button() {
    if(a) return;

    const button = document.querySelector('#App-DownloadLink');
    a = button.cloneNode(true);
    a.style.borderRadius = 0;
    a.querySelector('.showPaid').style.display = 'inline';
    a.querySelector('.showFree').style.display = 'block';
    a.target = '_blank';
    a.download = 'result.svg';
    button.before(a);

    a.addEventListener('click', function(event) {
        const svg = create_svg();
        const content = new XMLSerializer().serializeToString(svg);
        const type = 'image/svg+xml';
        const url = URL.createObjectURL(new Blob([content], {type}));
        if(this.href) {
            URL.revokeObjectURL(this.href);
        }
        this.href = url;
    });
}

function update_download_button() {
    if(!a) return;

    if(data.errors) {
        a.querySelector('.showPaid').textContent = `[missing ${data.errors}]`;
        a.style.background = '#4876ff80';
    } else {
        a.querySelector('.showPaid').textContent = '[ok]';
        a.style.background = '#4876ff';
    }
}
