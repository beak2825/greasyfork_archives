(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.layout = factory());
})(this, (() => {
    const binpack = (() => {
        class GrowingPacker {
            constructor() { }
            fit(blocks) {
                var n, node, block, len = blocks.length, fit;
                var width = len > 0 ? blocks[0].width : 0;
                var height = len > 0 ? blocks[0].height : 0;
                this.root = { x: 0, y: 0, width: width, height: height };
                for (n = 0; n < len; n++) {
                    block = blocks[n];
                    if (node = this.findNode(this.root, block.width, block.height)) {
                        fit = this.splitNode(node, block.width, block.height);
                        block.x = fit.x;
                        block.y = fit.y;
                    }
                    else {
                        fit = this.growNode(block.width, block.height);
                        block.x = fit.x;
                        block.y = fit.y;
                    }
                }
            }
            findNode(root, width, height) {
                if (root.used)
                    return this.findNode(root.right, width, height) || this.findNode(root.down, width, height);
                else if ((width <= root.width) && (height <= root.height))
                    return root;
                else
                    return null;
            }
            splitNode(node, width, height) {
                node.used = true;
                node.down = { x: node.x, y: node.y + height, width: node.width, height: node.height - height };
                node.right = { x: node.x + width, y: node.y, width: node.width - width, height: height };
                return node;
            }
            growNode(width, height) {
                var canGrowDown = (width <= this.root.width);
                var canGrowRight = (height <= this.root.height);
                var shouldGrowRight = canGrowRight && (this.root.height >= (this.root.width + width)); // attempt to keep square-ish by growing right when height is much greater than width
                var shouldGrowDown = canGrowDown && (this.root.width >= (this.root.height + height)); // attempt to keep square-ish by growing down  when width  is much greater than height
                if (shouldGrowRight)
                    return this.growRight(width, height);
                else if (shouldGrowDown)
                    return this.growDown(width, height);
                else if (canGrowRight)
                    return this.growRight(width, height);
                else if (canGrowDown)
                    return this.growDown(width, height);
                else
                    return null; // need to ensure sensible root starting size to avoid this happening
            }
            growRight(width, height) {
                this.root = {
                    used: true,
                    x: 0,
                    y: 0,
                    width: this.root.width + width,
                    height: this.root.height,
                    down: this.root,
                    right: { x: this.root.width, y: 0, width: width, height: this.root.height }
                };
                var node;
                if (node = this.findNode(this.root, width, height))
                    return this.splitNode(node, width, height);
                else
                    return null;
            }
            growDown(width, height) {
                this.root = {
                    used: true,
                    x: 0,
                    y: 0,
                    width: this.root.width,
                    height: this.root.height + height,
                    down: { x: 0, y: this.root.height, width: this.root.width, height: height },
                    right: this.root
                };
                var node;
                if (node = this.findNode(this.root, width, height))
                    return this.splitNode(node, width, height);
                else
                    return null;
            }
        }
        return (items, options) => {
            options = options || {};
            var packer = new GrowingPacker();
            var inPlace = options.inPlace || false;
            var newItems = items.map(item => inPlace ? item : { width: item.width, height: item.height, item: item });
            newItems = newItems.toSorted((a, b) => (b.width * b.height) - (a.width * a.height));
            packer.fit(newItems);
            const ret = {
                width: newItems.reduce((curr, item) => Math.max(curr, item.x + item.width), 0),
                height: newItems.reduce((curr, item) => Math.max(curr, item.y + item.height), 0)
            };
            if (!inPlace) {
                ret.items = newItems;
            }
            return ret;
        };
    })();
    const algorithms = {
        'top-down': {
            sort: items => items.toSorted((a, b) => a.height - b.height),
            placeItems: items => {
                let y = 0;
                items.forEach(item => {
                    item.x = 0;
                    item.y = y;
                    y += item.height;
                });
                return items;
            }
        },
        'left-right': {
            sort: items => items.toSorted((a, b) => a.width - b.width),
            placeItems: items => {
                var x = 0;
                items.forEach(item => {
                    item.x = x;
                    item.y = 0;
                    x += item.width;
                });
                return items;
            }
        },
        diagonal: {
            sort: items => items.toSorted((a, b) => {
                const aDiag = Math.sqrt(Math.pow(a.height, 2) + Math.pow(a.width, 2));
                const bDiag = Math.sqrt(Math.pow(b.height, 2) + Math.pow(b.width, 2));
                return aDiag - bDiag;
            }),
            placeItems: items => {
                let x = 0;
                let y = 0;
                items.forEach(item => {
                    item.x = x;
                    item.y = y;
                    x += item.width;
                    y += item.height;
                });
            }
        },
        'alt-diagonal': {
            sort: items => items.toSorted((a, b) => {
                const aDiag = Math.sqrt(Math.pow(a.height, 2) + Math.pow(a.width, 2));
                const bDiag = Math.sqrt(Math.pow(b.height, 2) + Math.pow(b.width, 2));
                return aDiag - bDiag;
            }),
            placeItems: items => {
                let x = 0;
                let y = 0;
                items.forEach(item => {
                    item.x = x - item.width;
                    item.y = y;
                    x += item.width;
                    y += item.height;
                });
            }
        },
        'binary-tree': {
            sort: items => items,
            placeItems: items => {
                binpack(items, {inPlace: true});
                return items
            }
        }
    };
    class PackingSmith {
        constructor(algorithm, options) {
            this.items = [];
            this.algorithm = algorithm;
            options = options || {};
            var sort = options.sort !== undefined ? options.sort : true;
            this.sort = sort;
        }
        addItem(item) {
            this.items.push(item);
        }
        normalizeCoordinates() {
            var items = this.items;
            var minX = Infinity;
            var minY = Infinity;
            items.forEach(item => {
                var coords = item;
                minX = Math.min(minX, coords.x);
                minY = Math.min(minY, coords.y);
            });
            items.forEach(item => {
                var coords = item;
                coords.x -= minX;
                coords.y -= minY;
            });
        }
        getStats() {
            const { x, y } = this.items.reduce((acc, item) => {
                acc.x.min.push(item.x);
                acc.y.min.push(item.y);
                acc.x.max.push(item.x + item.width);
                acc.y.max.push(item.y + item.height);
                return acc;
            }, {
                x: { min: [], max: [] },
                y: { min: [], max: [] }
            });
            return {
                minX: Math.max(...x.min),
                maxX: Math.max(...x.max),
                maxY: Math.max(...y.max),
                minY: Math.max(...y.min)
            }
        }
        getItems() {
            return this.items;
        }
        processItems() {
            var items = this.items;
            if (this.sort) {
                items = this.algorithm.sort(items);
            }
            items = this.algorithm.placeItems(items);
            this.items = items;
            return items;
        }
        exportItems() {
            this.processItems();
            this.normalizeCoordinates();
            return this.items;
        }
        export() {
            var items = this.exportItems();
            var stats = this.getStats();
            var retObj = {
                'height': stats.maxY,
                'width': stats.maxX,
                'items': items
            };
            return retObj;
        }
    }
    function Layout(algorithmName, options) {
        var algorithm = algorithmName || 'top-down';
        if (typeof algorithm === 'string') {
            algorithm = algorithms[algorithmName];
        }
        var retSmith = new PackingSmith(algorithm, options);
        return retSmith;
    }
    Layout.PackingSmith = PackingSmith;
    function addAlgorithm(name, algorithm) {
        algorithms[name] = algorithm;
    }
    Layout.addAlgorithm = addAlgorithm;
    Layout.algorithms = algorithms;
    return Layout;
}));