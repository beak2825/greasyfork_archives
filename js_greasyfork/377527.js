// ==UserScript==
// @name         Keybindings for Inkarnate
// @description  Adds keybindings to all mapping function in https://inkarnate.com/
// @namespace    azzurite
// @version      1.2.0
// @locale       en
// @author       azzurite
// @match        https://inkarnate.com/maps
// @run-at       document-idle
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377527/Keybindings%20for%20Inkarnate.user.js
// @updateURL https://update.greasyfork.org/scripts/377527/Keybindings%20for%20Inkarnate.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const keybinds = {
        sculpt: {
            mode: {
                add: 'a',
                subtract: 's'
            },
            shape: {
                circle: 'c',
                block: 'b',
                hex: 'h'
            },
            size: {
                more: 'ArrowRight',
                less: 'ArrowLeft',
                moreMore: 'ArrowUp',
                lessLess: 'ArrowDown'
            }
        },
        brush: {
            chooseTexture: {
                open: 'q'
            },
            layer: {
                fg: 'f',
                bg: 'g'
            },
            shape: {
                circle: 'c',
                block: 'b',
                hex: 'h'
            },
            size: {
                more: 'ArrowRight',
                less: 'ArrowLeft',
                moreMore: 'ArrowUp',
                lessLess: 'ArrowDown'
            },
            softness: {
                more: 'o',
                less: 'i',
                moreMore: 'p',
                lessLess: 'u'
            },
            opacity: {
                moreMore: 'l',
                lessLess: 'k'
            }
        },
        object: {
            mode: {
                place: 'q',
                select: 'w'
            },
            layer: {
                fg: 'f',
                bg: 'g'
            },
            chooseObject: {
                open: 'e'
            },
            scale: {
                value: {
                    more: 'o',
                    less: 'i',
                    moreMore: 'p',
                    lessLess: 'u'
                }
            },
        },
        pattern: {
            mode: {
                place: 'q',
                select: 'w'
            },
            choosePattern: {
                open: 'e'
            },
            scale: {
                more: 'o',
                less: 'i',
                moreMore: 'p',
                lessLess: 'u'
            },
            cycleSelection: {
                cycle: 'c'
            }
        },
        text: {
            mode: {
                place: 'q',
                select: 'w'
            },
            size: {
                more: 'o',
                less: 'i',
                moreMore: 'p',
                lessLess: 'u'
            },
            bold: {
                toggle: 'b'
            }
        },
        note: {
            mode: {
                place: 'q',
                select: 'w'
            },
        },
        grid: {
            type: {
                hex: 'h',
                square: 's'
            },
            opacity: {
                more: 'o',
                less: 'i',
                moreMore: 'p',
                lessLess: 'u'
            },
            size: {
                more: 'ArrowRight',
                less: 'ArrowLeft',
                moreMore: 'ArrowUp',
                lessLess: 'ArrowDown'
            },
            width: {
                more: 'l',
                less: 'k'
            }
        },
        global: {
            tools: {
                sculpt: '1',
                brush: '2',
                object: '3',
                pattern: '4',
                text: '5',
                note: '6',
                grid: '7',
                zoom: '8'
            },
            zoom: {
                upleft: 103, // these are key codes for the numpad
                up: 104,
                upright: 105,
                right: 102,
                downright: 99,
                down: 98,
                downleft: 97,
                left: 100,
                zoomIn: 107,
                zoomOut: 109,
                reset: 101
            },
            delete: 'Delete'
        }
    };

    // from https://stackoverflow.com/a/53739792/1805439
    function flattenObject(ob) {
        var toReturn = {};

        for (var i in ob) {
            if (!ob.hasOwnProperty(i)) continue;

            if ((typeof ob[i]) == 'object' && ob[i] !== null) {
                var flatObject = flattenObject(ob[i]);
                for (var x in flatObject) {
                    if (!flatObject.hasOwnProperty(x)) continue;

                    toReturn[i + '.' + x] = flatObject[x];
                }
            } else {
                toReturn[i] = ob[i];
            }
        }
        return toReturn;
    }

    // inkarnate has jquery + angular
    let $ = window.jQuery;
    let angular = window.angular;

    const defaultSteps = {
        more: 1,
        less: -1,
        moreMore: 5,
        lessLess: -5
    };
    let configs = {
        sculpt: {
            size: {
                type: 'number',
                min: 3,
                max: 128
            }
        },
        brush: {
            chooseTexture: {
                type: 'button',
                selector: '#brush-texture-popup'
            },
            size: {
                type: 'number',
                min: 1,
                max: 128
            },
            softness: {
                type: 'number',
                min: 0,
                max: 1,
                more: 0.01,
                less: -0.01,
                moreMore: 0.05,
                lessLess: -0.05,
                decimalPlaces: 2
            },
            opacity: {
                type: 'number',
                min: 0,
                max: 1,
                more: 0.01,
                less: -0.01,
                moreMore: 0.05,
                lessLess: -0.05,
                decimalPlaces: 2
            }
        },
        object: {
            chooseObject: {
                type: 'button',
                selector: '#object-popup'
            },
            scale: {
                value: {
                    type: 'number',
                    min: 0.15,
                    max: 2,
                    more: 0.01,
                    less: -0.01,
                    moreMore: 0.05,
                    lessLess: -0.05,
                    decimalPlaces: 2
                }
            },
        },
        pattern: {
            choosePattern: {
                type: 'button',
                selector: '#pattern-popup'
            },
            scale: {
                type: 'number',
                alternateProperty: 'object.globalScale',
                min: 0.15,
                max: 2,
                more: 0.01,
                less: -0.01,
                moreMore: 0.05,
                lessLess: -0.05,
                decimalPlaces: 2
            },
            cycleSelection: {
                type: 'cycleSelection'
            }
        },
        text: {
            size: {
                type: 'number',
                min: 5,
                max: 128
            },
            bold: {
                type: 'toggle'
            },
            color: {
                type: 'button',
                selector: 'button.color-picker'
            },
            shadow: {
                type: 'button',
                selector: '#text-shadow-popup'
            }
        },
        grid: {
            opacity: {
                type: 'number',
                min: 0,
                max: 1,
                more: 0.01,
                less: -0.01,
                moreMore: 0.05,
                lessLess: -0.05,
                decimalPlaces: 2
            },
            size: {
                type: 'number',
                min: 16,
                max: 256
            },
            width: {
                type: 'number',
                min: 1,
                max: 5,
                more: 0.5,
                less: -0.5
            }
        },
    }

    function getScope() {
        return angular.element(document.getElementById('map-builder-view')).scope();
    }

    function getByPath(obj, path, separator = '.') {
        var parts = path.split('.');
        return parts.reduce((prev, curr) => prev && prev[curr], obj)
    }

    function setByPath(obj, path, value) {
        var parts = path.split('.');
        parts.reduce(function(prev, cur, idx) {
            if (idx == parts.length - 1) {
                prev[cur] = value;
            } else {
                return prev[cur] || {};
            }
        }, obj);
    }

    function changeScope(func) {
        let scope = getScope();
        scope.$apply(() => {
            func(scope);
        });
    }

    function getCurrentTool() {
        return getScope().tool;
    }

    function clampNumber(config, num) {
        const min = config.min || 0;
        const max = config.max || 128;
        return Math.min(Math.max(min, num), max);
    }

    function roundNumber(config, num) {
        const decimalPlaces = config.decimalPlaces || 1;
        const multiplier = Math.pow(10, decimalPlaces);
        return Math.round(num * multiplier) / multiplier;
    }

    function getStep(config, stepName) {
        return config[stepName] || defaultSteps[stepName];
    }

    let originalSelection = [];
    let curIdx = -1;
    function cycleSelection() {
        let scopeSelection = getScope().selected;

        if (scopeSelection.length <= 1 && curIdx === -1) {
            return;
        }

        if (curIdx === -1) {
            curIdx = 0;
            originalSelection = scopeSelection;
            changeScope(s => {
                s.selected = [originalSelection[curIdx]];
            });
            return;
        }

        if (originalSelection[curIdx] === scopeSelection[0]) {
            if (++curIdx >= originalSelection.length) {
                curIdx = -1;
                changeScope(s => {
                    s.selected = originalSelection;
                });
            } else {
                changeScope(s => {
                    s.selected = [originalSelection[curIdx]];
                });
            }
        } else {
            // user selected something different
            curIdx = -1;
            originalSelection = [];
            cycleSelection();
        }
    }

    function handleKeyForTool(tool, key) {
        const binds = keybinds[tool];

        const flatBinds = flattenObject(binds);
        for (const [path, bind] of Object.entries(flatBinds)) {
            if (key !== bind) {
                continue;
            }

            const pathArr = path.split('.');
            let propPath = tool + '.' + pathArr.slice(0, pathArr.length - 1).join('.');
            const val = pathArr[pathArr.length - 1];

            //console.log(`Found bind: ${propPath} with value ${val}`);

            const config = getByPath(configs, propPath) || {};
            if (config.alternateProperty) {
                propPath = config.alternateProperty;
            }
            switch (config.type) {
                case 'cycleSelection': {
                    cycleSelection();
                    break;
                }
                case 'toggle': {
                    changeScope(scope => {
                        const oldVal = getByPath(scope, propPath);
                        setByPath(scope, propPath, !oldVal);
                    });
                    break;
                }
                case 'button': {
                    //console.log(`Clicking button ${config.selector}`);
                    $(config.selector).click();
                    break;
                }
                case 'number': {
                    changeScope(scope => {
                        const oldVal = getByPath(scope, propPath);
                        const step = getStep(config, val);
                        const newVal = oldVal + step;
                        const newValClamped = clampNumber(config, newVal);
                        const rounded = roundNumber(config, newValClamped);
                        //console.log(`Set ${propPath} to ${rounded}`);
                        setByPath(scope, propPath, rounded);
                    });
                    break;
                }
                default:
                case 'select': {
                    changeScope(scope => {
                        setByPath(scope, propPath, val);
                    });
                    break;
                }
            }
        }
    }

    function handleZoom(action, altKey) {
        function move(direction, amount) {
            changeScope(s => { s.zoom.translate[direction] += amount * (altKey ? 3 : 1); });
        }
        function zoom(amount) {
            changeScope(s => {
                const newScale = s.zoom.scale * amount;
                s.zoom.scale = clampNumber({min: 1, max: 5}, roundNumber({decimalPlaces: 2}, newScale));
            });
        }

        const actions = {
            upleft: () => { move('y', 10); move('x', 10); },
            up: move.bind(null, 'y', 10),
            upright: () => { move('y', 10); move('x', -10); },
            right: move.bind(null, 'x', -10),
            downright: () => { move('y', -10); move('x', -10); },
            down: move.bind(null, 'y', -10),
            downleft: () => { move('y', -10); move('x', 10); },
            left: move.bind(null, 'x', 10),
            zoomIn: zoom.bind(null, 1.05),
            zoomOut: zoom.bind(null, 0.95),
            reset: () => {
                changeScope(s => {
                    s.zoom.scale = 1;
                    s.zoom.translate.x = 0;
                    s.zoom.translate.y = 0;
                });
            }
        };

        actions[action]();
    }

    function keyHandler(e) {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        if (keybinds.global.delete === e.key) {
            changeScope(s => {
                if (s.radialMenuActions().includes('delete')) {
                    s.performRadialMenuAction('delete');
                }
            });
            return
        }

        const isZoomKey = Object.values(keybinds.global.zoom).includes(e.keyCode);
        if (isZoomKey) {
            const [zoomAction, _] = Object.entries(keybinds.global.zoom).find(elem => elem[1] === e.keyCode);
            handleZoom(zoomAction, e.altKey);
            return;
        }
        const isToolKey = Object.values(keybinds.global.tools).includes(e.key);
        if (isToolKey) {
            const [tool, _] = Object.entries(keybinds.global.tools).find(elem => elem[1] === e.key);
            changeScope(scope => scope.selectTool(tool));
            return;
        }

        // console.log(`Keypress: ${e.key}`);
        let cur = getCurrentTool();
        // console.log(`Cur tool: ${cur}`);
        if (!keybinds[cur]) {
            // console.log(`No Keybinds for tool "${getCurrentTool()}" configured.`);
            return;
        }

        handleKeyForTool(cur, e.key);
    }


    $(document).keydown(keyHandler);
})();