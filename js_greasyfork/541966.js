(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-dom'), require('react-dom/client')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-dom', 'react-dom/client'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.leva = {}, global.React, global.ReactDOM, global.ReactDOM));
})(this, (function (exports, React5, $7SXl2$reactdom, client) { 'use strict';
    function _interopNamespaceDefault(e) {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n.default = e;
        return Object.freeze(n);
    }
    var React5__namespace = _interopNamespaceDefault(React5);
    var $7SXl2$reactdom__namespace = _interopNamespaceDefault($7SXl2$reactdom);
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __commonJS = (cb, mod) =>
        function __require() {
            return (
                mod ||
                    (0, cb[__getOwnPropNames(cb)[0]])(
                        (mod = { exports: {} }).exports,
                        mod
                    ),
                mod.exports
            );
        };
    var __export = (target, all) => {
        for (var name in all)
            __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
        if ((from && typeof from === 'object') || typeof from === 'function') {
            for (let key of __getOwnPropNames(from))
                if (!__hasOwnProp.call(to, key) && key !== except)
                    __defProp(to, key, {
                        get: () => from[key],
                        enumerable:
                            !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                    });
        }
        return to;
    };
    var __reExport = (target, mod, secondTarget) => (
        __copyProps(target, mod, 'default'),
        secondTarget
    );
    var __toESM = (mod, isNodeMode, target) => (
        (target = mod != null ? __create(__getProtoOf(mod)) : {}),
        __copyProps(
            !mod || !mod.__esModule
                ? __defProp(target, 'default', { value: mod, enumerable: true })
                : target,
            mod
        )
    );
    var require_maths_267f0992_cjs_dev = __commonJS({
        'node_modules/@use-gesture/core/dist/maths-267f0992.cjs.dev.js'(exports) {
            function clamp2(v4, min3, max3) {
                return Math.max(min3, Math.min(v4, max3));
            }
            var V3 = {
                toVector(v4, fallback) {
                    if (v4 === void 0) v4 = fallback;
                    return Array.isArray(v4) ? v4 : [v4, v4];
                },
                add(v1, v22) {
                    return [v1[0] + v22[0], v1[1] + v22[1]];
                },
                sub(v1, v22) {
                    return [v1[0] - v22[0], v1[1] - v22[1]];
                },
                addTo(v1, v22) {
                    v1[0] += v22[0];
                    v1[1] += v22[1];
                },
                subTo(v1, v22) {
                    v1[0] -= v22[0];
                    v1[1] -= v22[1];
                }
            };
            function rubberband(distance, dimension, constant) {
                if (dimension === 0 || Math.abs(dimension) === Infinity)
                    return Math.pow(distance, constant * 5);
                return (
                    (distance * dimension * constant) /
                    (dimension + constant * distance)
                );
            }
            function rubberbandIfOutOfBounds(
                position,
                min3,
                max3,
                constant = 0.15
            ) {
                if (constant === 0) return clamp2(position, min3, max3);
                if (position < min3)
                    return (
                        -rubberband(min3 - position, max3 - min3, constant) + min3
                    );
                if (position > max3)
                    return (
                        +rubberband(position - max3, max3 - min3, constant) + max3
                    );
                return position;
            }
            function computeRubberband(bounds, [Vx, Vy], [Rx, Ry]) {
                const [[X0, X1], [Y0, Y1]] = bounds;
                return [
                    rubberbandIfOutOfBounds(Vx, X0, X1, Rx),
                    rubberbandIfOutOfBounds(Vy, Y0, Y1, Ry)
                ];
            }
            exports.V = V3;
            exports.computeRubberband = computeRubberband;
            exports.rubberbandIfOutOfBounds = rubberbandIfOutOfBounds;
        }
    });
    var require_actions_6579bdef_cjs_dev = __commonJS({
        'node_modules/@use-gesture/core/dist/actions-6579bdef.cjs.dev.js'(exports) {
            var maths = require_maths_267f0992_cjs_dev();
            function _toPrimitive(input, hint) {
                if (typeof input !== 'object' || input === null) return input;
                var prim = input[Symbol.toPrimitive];
                if (prim !== void 0) {
                    var res = prim.call(input, hint);
                    if (typeof res !== 'object') return res;
                    throw new TypeError(
                        '@@toPrimitive must return a primitive value.'
                    );
                }
                return (hint === 'string' ? String : Number)(input);
            }
            function _toPropertyKey(arg) {
                var key = _toPrimitive(arg, 'string');
                return typeof key === 'symbol' ? key : String(key);
            }
            function _defineProperty4(obj, key, value) {
                key = _toPropertyKey(key);
                if (key in obj) {
                    Object.defineProperty(obj, key, {
                        value,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    obj[key] = value;
                }
                return obj;
            }
            function ownKeys4(e4, r4) {
                var t4 = Object.keys(e4);
                if (Object.getOwnPropertySymbols) {
                    var o4 = Object.getOwnPropertySymbols(e4);
                    (r4 &&
                        (o4 = o4.filter(function (r5) {
                            return Object.getOwnPropertyDescriptor(e4, r5)
                                .enumerable;
                        })),
                        t4.push.apply(t4, o4));
                }
                return t4;
            }
            function _objectSpread22(e4) {
                for (var r4 = 1; r4 < arguments.length; r4++) {
                    var t4 = null != arguments[r4] ? arguments[r4] : {};
                    r4 % 2
                        ? ownKeys4(Object(t4), true).forEach(function (r5) {
                              _defineProperty4(e4, r5, t4[r5]);
                          })
                        : Object.getOwnPropertyDescriptors
                          ? Object.defineProperties(
                                e4,
                                Object.getOwnPropertyDescriptors(t4)
                            )
                          : ownKeys4(Object(t4)).forEach(function (r5) {
                                Object.defineProperty(
                                    e4,
                                    r5,
                                    Object.getOwnPropertyDescriptor(t4, r5)
                                );
                            });
                }
                return e4;
            }
            var EVENT_TYPE_MAP = {
                pointer: { start: 'down', change: 'move', end: 'up' },
                mouse: { start: 'down', change: 'move', end: 'up' },
                touch: { start: 'start', change: 'move', end: 'end' },
                gesture: { start: 'start', change: 'change', end: 'end' }
            };
            function capitalize(string2) {
                if (!string2) return '';
                return string2[0].toUpperCase() + string2.slice(1);
            }
            var actionsWithoutCaptureSupported = ['enter', 'leave'];
            function hasCapture(capture = false, actionKey) {
                return (
                    capture && !actionsWithoutCaptureSupported.includes(actionKey)
                );
            }
            function toHandlerProp(device, action = '', capture = false) {
                const deviceProps = EVENT_TYPE_MAP[device];
                const actionKey = deviceProps
                    ? deviceProps[action] || action
                    : action;
                return (
                    'on' +
                    capitalize(device) +
                    capitalize(actionKey) +
                    (hasCapture(capture, actionKey) ? 'Capture' : '')
                );
            }
            var pointerCaptureEvents = ['gotpointercapture', 'lostpointercapture'];
            function parseProp(prop) {
                let eventKey = prop.substring(2).toLowerCase();
                const passive = !!~eventKey.indexOf('passive');
                if (passive) eventKey = eventKey.replace('passive', '');
                const captureKey = pointerCaptureEvents.includes(eventKey)
                    ? 'capturecapture'
                    : 'capture';
                const capture = !!~eventKey.indexOf(captureKey);
                if (capture) eventKey = eventKey.replace('capture', '');
                return { device: eventKey, capture, passive };
            }
            function toDomEventType(device, action = '') {
                const deviceProps = EVENT_TYPE_MAP[device];
                const actionKey = deviceProps
                    ? deviceProps[action] || action
                    : action;
                return device + actionKey;
            }
            function isTouch(event) {
                return 'touches' in event;
            }
            function getPointerType(event) {
                if (isTouch(event)) return 'touch';
                if ('pointerType' in event) return event.pointerType;
                return 'mouse';
            }
            function getCurrentTargetTouchList(event) {
                return Array.from(event.touches).filter((e4) => {
                    var _event$currentTarget, _event$currentTarget$;
                    return (
                        e4.target === event.currentTarget ||
                        ((_event$currentTarget = event.currentTarget) === null ||
                        _event$currentTarget === void 0 ||
                        (_event$currentTarget$ = _event$currentTarget.contains) ===
                            null ||
                        _event$currentTarget$ === void 0
                            ? void 0
                            : _event$currentTarget$.call(
                                  _event$currentTarget,
                                  e4.target
                              ))
                    );
                });
            }
            function getTouchList(event) {
                return event.type === 'touchend' || event.type === 'touchcancel'
                    ? event.changedTouches
                    : event.targetTouches;
            }
            function getValueEvent(event) {
                return isTouch(event) ? getTouchList(event)[0] : event;
            }
            function distanceAngle(P1, P2) {
                try {
                    const dx = P2.clientX - P1.clientX;
                    const dy = P2.clientY - P1.clientY;
                    const cx = (P2.clientX + P1.clientX) / 2;
                    const cy = (P2.clientY + P1.clientY) / 2;
                    const distance = Math.hypot(dx, dy);
                    const angle = -(Math.atan2(dx, dy) * 180) / Math.PI;
                    const origin = [cx, cy];
                    return { angle, distance, origin };
                } catch (_unused) {}
                return null;
            }
            function touchIds(event) {
                return getCurrentTargetTouchList(event).map(
                    (touch) => touch.identifier
                );
            }
            function touchDistanceAngle(event, ids) {
                const [P1, P2] = Array.from(event.touches).filter((touch) =>
                    ids.includes(touch.identifier)
                );
                return distanceAngle(P1, P2);
            }
            function pointerId(event) {
                const valueEvent = getValueEvent(event);
                return isTouch(event)
                    ? valueEvent.identifier
                    : valueEvent.pointerId;
            }
            function pointerValues(event) {
                const valueEvent = getValueEvent(event);
                return [valueEvent.clientX, valueEvent.clientY];
            }
            var LINE_HEIGHT = 40;
            var PAGE_HEIGHT = 800;
            function wheelValues(event) {
                let { deltaX, deltaY, deltaMode } = event;
                if (deltaMode === 1) {
                    deltaX *= LINE_HEIGHT;
                    deltaY *= LINE_HEIGHT;
                } else if (deltaMode === 2) {
                    deltaX *= PAGE_HEIGHT;
                    deltaY *= PAGE_HEIGHT;
                }
                return [deltaX, deltaY];
            }
            function scrollValues(event) {
                var _ref, _ref2;
                const { scrollX, scrollY, scrollLeft, scrollTop } =
                    event.currentTarget;
                return [
                    (_ref =
                        scrollX !== null && scrollX !== void 0
                            ? scrollX
                            : scrollLeft) !== null && _ref !== void 0
                        ? _ref
                        : 0,
                    (_ref2 =
                        scrollY !== null && scrollY !== void 0
                            ? scrollY
                            : scrollTop) !== null && _ref2 !== void 0
                        ? _ref2
                        : 0
                ];
            }
            function getEventDetails(event) {
                const payload = {};
                if ('buttons' in event) payload.buttons = event.buttons;
                if ('shiftKey' in event) {
                    const { shiftKey, altKey, metaKey, ctrlKey } = event;
                    Object.assign(payload, { shiftKey, altKey, metaKey, ctrlKey });
                }
                return payload;
            }
            function call(v4, ...args) {
                if (typeof v4 === 'function') {
                    return v4(...args);
                } else {
                    return v4;
                }
            }
            function noop2() {}
            function chain(...fns) {
                if (fns.length === 0) return noop2;
                if (fns.length === 1) return fns[0];
                return function () {
                    let result;
                    for (const fn of fns) {
                        result = fn.apply(this, arguments) || result;
                    }
                    return result;
                };
            }
            function assignDefault(value, fallback) {
                return Object.assign({}, fallback, value || {});
            }
            var BEFORE_LAST_KINEMATICS_DELAY = 32;
            var Engine = class {
                constructor(ctrl, args, key) {
                    this.ctrl = ctrl;
                    this.args = args;
                    this.key = key;
                    if (!this.state) {
                        this.state = {};
                        this.computeValues([0, 0]);
                        this.computeInitial();
                        if (this.init) this.init();
                        this.reset();
                    }
                }
                get state() {
                    return this.ctrl.state[this.key];
                }
                set state(state) {
                    this.ctrl.state[this.key] = state;
                }
                get shared() {
                    return this.ctrl.state.shared;
                }
                get eventStore() {
                    return this.ctrl.gestureEventStores[this.key];
                }
                get timeoutStore() {
                    return this.ctrl.gestureTimeoutStores[this.key];
                }
                get config() {
                    return this.ctrl.config[this.key];
                }
                get sharedConfig() {
                    return this.ctrl.config.shared;
                }
                get handler() {
                    return this.ctrl.handlers[this.key];
                }
                reset() {
                    const { state, shared, ingKey, args } = this;
                    shared[ingKey] =
                        state._active =
                        state.active =
                        state._blocked =
                        state._force =
                            false;
                    state._step = [false, false];
                    state.intentional = false;
                    state._movement = [0, 0];
                    state._distance = [0, 0];
                    state._direction = [0, 0];
                    state._delta = [0, 0];
                    state._bounds = [
                        [-Infinity, Infinity],
                        [-Infinity, Infinity]
                    ];
                    state.args = args;
                    state.axis = void 0;
                    state.memo = void 0;
                    state.elapsedTime = state.timeDelta = 0;
                    state.direction = [0, 0];
                    state.distance = [0, 0];
                    state.overflow = [0, 0];
                    state._movementBound = [false, false];
                    state.velocity = [0, 0];
                    state.movement = [0, 0];
                    state.delta = [0, 0];
                    state.timeStamp = 0;
                }
                start(event) {
                    const state = this.state;
                    const config = this.config;
                    if (!state._active) {
                        this.reset();
                        this.computeInitial();
                        state._active = true;
                        state.target = event.target;
                        state.currentTarget = event.currentTarget;
                        state.lastOffset = config.from
                            ? call(config.from, state)
                            : state.offset;
                        state.offset = state.lastOffset;
                        state.startTime = state.timeStamp = event.timeStamp;
                    }
                }
                computeValues(values) {
                    const state = this.state;
                    state._values = values;
                    state.values = this.config.transform(values);
                }
                computeInitial() {
                    const state = this.state;
                    state._initial = state._values;
                    state.initial = state.values;
                }
                compute(event) {
                    const { state, config, shared } = this;
                    state.args = this.args;
                    let dt = 0;
                    if (event) {
                        state.event = event;
                        if (config.preventDefault && event.cancelable)
                            state.event.preventDefault();
                        state.type = event.type;
                        shared.touches =
                            this.ctrl.pointerIds.size || this.ctrl.touchIds.size;
                        shared.locked = !!document.pointerLockElement;
                        Object.assign(shared, getEventDetails(event));
                        shared.down = shared.pressed =
                            shared.buttons % 2 === 1 || shared.touches > 0;
                        dt = event.timeStamp - state.timeStamp;
                        state.timeStamp = event.timeStamp;
                        state.elapsedTime = state.timeStamp - state.startTime;
                    }
                    if (state._active) {
                        const _absoluteDelta = state._delta.map(Math.abs);
                        maths.V.addTo(state._distance, _absoluteDelta);
                    }
                    if (this.axisIntent) this.axisIntent(event);
                    const [_m0, _m1] = state._movement;
                    const [t0, t1] = config.threshold;
                    const { _step, values } = state;
                    if (config.hasCustomTransform) {
                        if (_step[0] === false)
                            _step[0] = Math.abs(_m0) >= t0 && values[0];
                        if (_step[1] === false)
                            _step[1] = Math.abs(_m1) >= t1 && values[1];
                    } else {
                        if (_step[0] === false)
                            _step[0] = Math.abs(_m0) >= t0 && Math.sign(_m0) * t0;
                        if (_step[1] === false)
                            _step[1] = Math.abs(_m1) >= t1 && Math.sign(_m1) * t1;
                    }
                    state.intentional = _step[0] !== false || _step[1] !== false;
                    if (!state.intentional) return;
                    const movement = [0, 0];
                    if (config.hasCustomTransform) {
                        const [v0, v1] = values;
                        movement[0] = _step[0] !== false ? v0 - _step[0] : 0;
                        movement[1] = _step[1] !== false ? v1 - _step[1] : 0;
                    } else {
                        movement[0] = _step[0] !== false ? _m0 - _step[0] : 0;
                        movement[1] = _step[1] !== false ? _m1 - _step[1] : 0;
                    }
                    if (this.restrictToAxis && !state._blocked)
                        this.restrictToAxis(movement);
                    const previousOffset = state.offset;
                    const gestureIsActive =
                        (state._active && !state._blocked) || state.active;
                    if (gestureIsActive) {
                        state.first = state._active && !state.active;
                        state.last = !state._active && state.active;
                        state.active = shared[this.ingKey] = state._active;
                        if (event) {
                            if (state.first) {
                                if ('bounds' in config)
                                    state._bounds = call(config.bounds, state);
                                if (this.setup) this.setup();
                            }
                            state.movement = movement;
                            this.computeOffset();
                        }
                    }
                    const [ox, oy] = state.offset;
                    const [[x0, x1], [y0, y1]] = state._bounds;
                    state.overflow = [
                        ox < x0 ? -1 : ox > x1 ? 1 : 0,
                        oy < y0 ? -1 : oy > y1 ? 1 : 0
                    ];
                    state._movementBound[0] = state.overflow[0]
                        ? state._movementBound[0] === false
                            ? state._movement[0]
                            : state._movementBound[0]
                        : false;
                    state._movementBound[1] = state.overflow[1]
                        ? state._movementBound[1] === false
                            ? state._movement[1]
                            : state._movementBound[1]
                        : false;
                    const rubberband = state._active
                        ? config.rubberband || [0, 0]
                        : [0, 0];
                    state.offset = maths.computeRubberband(
                        state._bounds,
                        state.offset,
                        rubberband
                    );
                    state.delta = maths.V.sub(state.offset, previousOffset);
                    this.computeMovement();
                    if (
                        gestureIsActive &&
                        (!state.last || dt > BEFORE_LAST_KINEMATICS_DELAY)
                    ) {
                        state.delta = maths.V.sub(state.offset, previousOffset);
                        const absoluteDelta = state.delta.map(Math.abs);
                        maths.V.addTo(state.distance, absoluteDelta);
                        state.direction = state.delta.map(Math.sign);
                        state._direction = state._delta.map(Math.sign);
                        if (!state.first && dt > 0) {
                            state.velocity = [
                                absoluteDelta[0] / dt,
                                absoluteDelta[1] / dt
                            ];
                            state.timeDelta = dt;
                        }
                    }
                }
                emit() {
                    const state = this.state;
                    const shared = this.shared;
                    const config = this.config;
                    if (!state._active) this.clean();
                    if (
                        (state._blocked || !state.intentional) &&
                        !state._force &&
                        !config.triggerAllEvents
                    )
                        return;
                    const memo = this.handler(
                        _objectSpread22(
                            _objectSpread22(_objectSpread22({}, shared), state),
                            {},
                            { [this.aliasKey]: state.values }
                        )
                    );
                    if (memo !== void 0) state.memo = memo;
                }
                clean() {
                    this.eventStore.clean();
                    this.timeoutStore.clean();
                }
            };
            function selectAxis([dx, dy], threshold) {
                const absDx = Math.abs(dx);
                const absDy = Math.abs(dy);
                if (absDx > absDy && absDx > threshold) {
                    return 'x';
                }
                if (absDy > absDx && absDy > threshold) {
                    return 'y';
                }
                return void 0;
            }
            var CoordinatesEngine = class extends Engine {
                constructor(...args) {
                    super(...args);
                    _defineProperty4(this, 'aliasKey', 'xy');
                }
                reset() {
                    super.reset();
                    this.state.axis = void 0;
                }
                init() {
                    this.state.offset = [0, 0];
                    this.state.lastOffset = [0, 0];
                }
                computeOffset() {
                    this.state.offset = maths.V.add(
                        this.state.lastOffset,
                        this.state.movement
                    );
                }
                computeMovement() {
                    this.state.movement = maths.V.sub(
                        this.state.offset,
                        this.state.lastOffset
                    );
                }
                axisIntent(event) {
                    const state = this.state;
                    const config = this.config;
                    if (!state.axis && event) {
                        const threshold =
                            typeof config.axisThreshold === 'object'
                                ? config.axisThreshold[getPointerType(event)]
                                : config.axisThreshold;
                        state.axis = selectAxis(state._movement, threshold);
                    }
                    state._blocked =
                        ((config.lockDirection || !!config.axis) && !state.axis) ||
                        (!!config.axis && config.axis !== state.axis);
                }
                restrictToAxis(v4) {
                    if (this.config.axis || this.config.lockDirection) {
                        switch (this.state.axis) {
                            case 'x':
                                v4[1] = 0;
                                break;
                            case 'y':
                                v4[0] = 0;
                                break;
                        }
                    }
                }
            };
            var identity = (v4) => v4;
            var DEFAULT_RUBBERBAND = 0.15;
            var commonConfigResolver = {
                enabled(value = true) {
                    return value;
                },
                eventOptions(value, _k, config) {
                    return _objectSpread22(
                        _objectSpread22({}, config.shared.eventOptions),
                        value
                    );
                },
                preventDefault(value = false) {
                    return value;
                },
                triggerAllEvents(value = false) {
                    return value;
                },
                rubberband(value = 0) {
                    switch (value) {
                        case true:
                            return [DEFAULT_RUBBERBAND, DEFAULT_RUBBERBAND];
                        case false:
                            return [0, 0];
                        default:
                            return maths.V.toVector(value);
                    }
                },
                from(value) {
                    if (typeof value === 'function') return value;
                    if (value != null) return maths.V.toVector(value);
                },
                transform(value, _k, config) {
                    const transform = value || config.shared.transform;
                    this.hasCustomTransform = !!transform;
                    {
                        const originalTransform = transform || identity;
                        return (v4) => {
                            const r4 = originalTransform(v4);
                            if (!isFinite(r4[0]) || !isFinite(r4[1])) {
                                console.warn(
                                    `[@use-gesture]: config.transform() must produce a valid result, but it was: [${r4[0]},${[1]}]`
                                );
                            }
                            return r4;
                        };
                    }
                },
                threshold(value) {
                    return maths.V.toVector(value, 0);
                }
            };
            {
                Object.assign(commonConfigResolver, {
                    domTarget(value) {
                        if (value !== void 0) {
                            throw Error(
                                `[@use-gesture]: \`domTarget\` option has been renamed to \`target\`.`
                            );
                        }
                        return NaN;
                    },
                    lockDirection(value) {
                        if (value !== void 0) {
                            throw Error(
                                `[@use-gesture]: \`lockDirection\` option has been merged with \`axis\`. Use it as in \`{ axis: 'lock' }\``
                            );
                        }
                        return NaN;
                    },
                    initial(value) {
                        if (value !== void 0) {
                            throw Error(
                                `[@use-gesture]: \`initial\` option has been renamed to \`from\`.`
                            );
                        }
                        return NaN;
                    }
                });
            }
            var DEFAULT_AXIS_THRESHOLD = 0;
            var coordinatesConfigResolver = _objectSpread22(
                _objectSpread22({}, commonConfigResolver),
                {},
                {
                    axis(_v, _k, { axis }) {
                        this.lockDirection = axis === 'lock';
                        if (!this.lockDirection) return axis;
                    },
                    axisThreshold(value = DEFAULT_AXIS_THRESHOLD) {
                        return value;
                    },
                    bounds(value = {}) {
                        if (typeof value === 'function') {
                            return (state) =>
                                coordinatesConfigResolver.bounds(value(state));
                        }
                        if ('current' in value) {
                            return () => value.current;
                        }
                        if (
                            typeof HTMLElement === 'function' &&
                            value instanceof HTMLElement
                        ) {
                            return value;
                        }
                        const {
                            left = -Infinity,
                            right = Infinity,
                            top = -Infinity,
                            bottom = Infinity
                        } = value;
                        return [
                            [left, right],
                            [top, bottom]
                        ];
                    }
                }
            );
            var KEYS_DELTA_MAP = {
                ArrowRight: (displacement, factor = 1) => [
                    displacement * factor,
                    0
                ],
                ArrowLeft: (displacement, factor = 1) => [
                    -1 * displacement * factor,
                    0
                ],
                ArrowUp: (displacement, factor = 1) => [
                    0,
                    -1 * displacement * factor
                ],
                ArrowDown: (displacement, factor = 1) => [0, displacement * factor]
            };
            var DragEngine = class extends CoordinatesEngine {
                constructor(...args) {
                    super(...args);
                    _defineProperty4(this, 'ingKey', 'dragging');
                }
                reset() {
                    super.reset();
                    const state = this.state;
                    state._pointerId = void 0;
                    state._pointerActive = false;
                    state._keyboardActive = false;
                    state._preventScroll = false;
                    state._delayed = false;
                    state.swipe = [0, 0];
                    state.tap = false;
                    state.canceled = false;
                    state.cancel = this.cancel.bind(this);
                }
                setup() {
                    const state = this.state;
                    if (state._bounds instanceof HTMLElement) {
                        const boundRect = state._bounds.getBoundingClientRect();
                        const targetRect =
                            state.currentTarget.getBoundingClientRect();
                        const _bounds = {
                            left:
                                boundRect.left - targetRect.left + state.offset[0],
                            right:
                                boundRect.right -
                                targetRect.right +
                                state.offset[0],
                            top: boundRect.top - targetRect.top + state.offset[1],
                            bottom:
                                boundRect.bottom -
                                targetRect.bottom +
                                state.offset[1]
                        };
                        state._bounds = coordinatesConfigResolver.bounds(_bounds);
                    }
                }
                cancel() {
                    const state = this.state;
                    if (state.canceled) return;
                    state.canceled = true;
                    state._active = false;
                    setTimeout(() => {
                        this.compute();
                        this.emit();
                    }, 0);
                }
                setActive() {
                    this.state._active =
                        this.state._pointerActive || this.state._keyboardActive;
                }
                clean() {
                    this.pointerClean();
                    this.state._pointerActive = false;
                    this.state._keyboardActive = false;
                    super.clean();
                }
                pointerDown(event) {
                    const config = this.config;
                    const state = this.state;
                    if (
                        event.buttons != null &&
                        (Array.isArray(config.pointerButtons)
                            ? !config.pointerButtons.includes(event.buttons)
                            : config.pointerButtons !== -1 &&
                              config.pointerButtons !== event.buttons)
                    )
                        return;
                    const ctrlIds = this.ctrl.setEventIds(event);
                    if (config.pointerCapture) {
                        event.target.setPointerCapture(event.pointerId);
                    }
                    if (ctrlIds && ctrlIds.size > 1 && state._pointerActive) return;
                    this.start(event);
                    this.setupPointer(event);
                    state._pointerId = pointerId(event);
                    state._pointerActive = true;
                    this.computeValues(pointerValues(event));
                    this.computeInitial();
                    if (
                        config.preventScrollAxis &&
                        getPointerType(event) !== 'mouse'
                    ) {
                        state._active = false;
                        this.setupScrollPrevention(event);
                    } else if (config.delay > 0) {
                        this.setupDelayTrigger(event);
                        if (config.triggerAllEvents) {
                            this.compute(event);
                            this.emit();
                        }
                    } else {
                        this.startPointerDrag(event);
                    }
                }
                startPointerDrag(event) {
                    const state = this.state;
                    state._active = true;
                    state._preventScroll = true;
                    state._delayed = false;
                    this.compute(event);
                    this.emit();
                }
                pointerMove(event) {
                    const state = this.state;
                    const config = this.config;
                    if (!state._pointerActive) return;
                    const id = pointerId(event);
                    if (state._pointerId !== void 0 && id !== state._pointerId)
                        return;
                    const _values = pointerValues(event);
                    if (document.pointerLockElement === event.target) {
                        state._delta = [event.movementX, event.movementY];
                    } else {
                        state._delta = maths.V.sub(_values, state._values);
                        this.computeValues(_values);
                    }
                    maths.V.addTo(state._movement, state._delta);
                    this.compute(event);
                    if (state._delayed && state.intentional) {
                        this.timeoutStore.remove('dragDelay');
                        state.active = false;
                        this.startPointerDrag(event);
                        return;
                    }
                    if (config.preventScrollAxis && !state._preventScroll) {
                        if (state.axis) {
                            if (
                                state.axis === config.preventScrollAxis ||
                                config.preventScrollAxis === 'xy'
                            ) {
                                state._active = false;
                                this.clean();
                                return;
                            } else {
                                this.timeoutStore.remove('startPointerDrag');
                                this.startPointerDrag(event);
                                return;
                            }
                        } else {
                            return;
                        }
                    }
                    this.emit();
                }
                pointerUp(event) {
                    this.ctrl.setEventIds(event);
                    try {
                        if (
                            this.config.pointerCapture &&
                            event.target.hasPointerCapture(event.pointerId)
                        ) {
                            event.target.releasePointerCapture(event.pointerId);
                        }
                    } catch (_unused) {
                        {
                            console.warn(`[@use-gesture]: If you see this message, it's likely that you're using an outdated version of \`@react-three/fiber\`. 
Please upgrade to the latest version.`);
                        }
                    }
                    const state = this.state;
                    const config = this.config;
                    if (!state._active || !state._pointerActive) return;
                    const id = pointerId(event);
                    if (state._pointerId !== void 0 && id !== state._pointerId)
                        return;
                    this.state._pointerActive = false;
                    this.setActive();
                    this.compute(event);
                    const [dx, dy] = state._distance;
                    state.tap =
                        dx <= config.tapsThreshold && dy <= config.tapsThreshold;
                    if (state.tap && config.filterTaps) {
                        state._force = true;
                    } else {
                        const [_dx, _dy] = state._delta;
                        const [_mx, _my] = state._movement;
                        const [svx, svy] = config.swipe.velocity;
                        const [sx, sy] = config.swipe.distance;
                        const sdt = config.swipe.duration;
                        if (state.elapsedTime < sdt) {
                            const _vx = Math.abs(_dx / state.timeDelta);
                            const _vy = Math.abs(_dy / state.timeDelta);
                            if (_vx > svx && Math.abs(_mx) > sx)
                                state.swipe[0] = Math.sign(_dx);
                            if (_vy > svy && Math.abs(_my) > sy)
                                state.swipe[1] = Math.sign(_dy);
                        }
                    }
                    this.emit();
                }
                pointerClick(event) {
                    if (!this.state.tap && event.detail > 0) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
                setupPointer(event) {
                    const config = this.config;
                    const device = config.device;
                    {
                        try {
                            if (
                                device === 'pointer' &&
                                config.preventScrollDelay === void 0
                            ) {
                                const currentTarget =
                                    'uv' in event
                                        ? event.sourceEvent.currentTarget
                                        : event.currentTarget;
                                const style =
                                    window.getComputedStyle(currentTarget);
                                if (style.touchAction === 'auto') {
                                    console.warn(
                                        `[@use-gesture]: The drag target has its \`touch-action\` style property set to \`auto\`. It is recommended to add \`touch-action: 'none'\` so that the drag gesture behaves correctly on touch-enabled devices. For more information read this: https://use-gesture.netlify.app/docs/extras/#touch-action.
This message will only show in development mode. It won't appear in production. If this is intended, you can ignore it.`,
                                        currentTarget
                                    );
                                }
                            }
                        } catch (_unused2) {}
                    }
                    if (config.pointerLock) {
                        event.currentTarget.requestPointerLock();
                    }
                    if (!config.pointerCapture) {
                        this.eventStore.add(
                            this.sharedConfig.window,
                            device,
                            'change',
                            this.pointerMove.bind(this)
                        );
                        this.eventStore.add(
                            this.sharedConfig.window,
                            device,
                            'end',
                            this.pointerUp.bind(this)
                        );
                        this.eventStore.add(
                            this.sharedConfig.window,
                            device,
                            'cancel',
                            this.pointerUp.bind(this)
                        );
                    }
                }
                pointerClean() {
                    if (
                        this.config.pointerLock &&
                        document.pointerLockElement === this.state.currentTarget
                    ) {
                        document.exitPointerLock();
                    }
                }
                preventScroll(event) {
                    if (this.state._preventScroll && event.cancelable) {
                        event.preventDefault();
                    }
                }
                setupScrollPrevention(event) {
                    this.state._preventScroll = false;
                    persistEvent(event);
                    const remove = this.eventStore.add(
                        this.sharedConfig.window,
                        'touch',
                        'change',
                        this.preventScroll.bind(this),
                        { passive: false }
                    );
                    this.eventStore.add(
                        this.sharedConfig.window,
                        'touch',
                        'end',
                        remove
                    );
                    this.eventStore.add(
                        this.sharedConfig.window,
                        'touch',
                        'cancel',
                        remove
                    );
                    this.timeoutStore.add(
                        'startPointerDrag',
                        this.startPointerDrag.bind(this),
                        this.config.preventScrollDelay,
                        event
                    );
                }
                setupDelayTrigger(event) {
                    this.state._delayed = true;
                    this.timeoutStore.add(
                        'dragDelay',
                        () => {
                            this.state._step = [0, 0];
                            this.startPointerDrag(event);
                        },
                        this.config.delay
                    );
                }
                keyDown(event) {
                    const deltaFn = KEYS_DELTA_MAP[event.key];
                    if (deltaFn) {
                        const state = this.state;
                        const factor = event.shiftKey ? 10 : event.altKey ? 0.1 : 1;
                        this.start(event);
                        state._delta = deltaFn(
                            this.config.keyboardDisplacement,
                            factor
                        );
                        state._keyboardActive = true;
                        maths.V.addTo(state._movement, state._delta);
                        this.compute(event);
                        this.emit();
                    }
                }
                keyUp(event) {
                    if (!(event.key in KEYS_DELTA_MAP)) return;
                    this.state._keyboardActive = false;
                    this.setActive();
                    this.compute(event);
                    this.emit();
                }
                bind(bindFunction) {
                    const device = this.config.device;
                    bindFunction(device, 'start', this.pointerDown.bind(this));
                    if (this.config.pointerCapture) {
                        bindFunction(device, 'change', this.pointerMove.bind(this));
                        bindFunction(device, 'end', this.pointerUp.bind(this));
                        bindFunction(device, 'cancel', this.pointerUp.bind(this));
                        bindFunction(
                            'lostPointerCapture',
                            '',
                            this.pointerUp.bind(this)
                        );
                    }
                    if (this.config.keys) {
                        bindFunction('key', 'down', this.keyDown.bind(this));
                        bindFunction('key', 'up', this.keyUp.bind(this));
                    }
                    if (this.config.filterTaps) {
                        bindFunction('click', '', this.pointerClick.bind(this), {
                            capture: true,
                            passive: false
                        });
                    }
                }
            };
            function persistEvent(event) {
                'persist' in event &&
                    typeof event.persist === 'function' &&
                    event.persist();
            }
            var isBrowser =
                typeof window !== 'undefined' &&
                window.document &&
                window.document.createElement;
            function supportsTouchEvents() {
                return isBrowser && 'ontouchstart' in window;
            }
            function isTouchScreen() {
                return (
                    supportsTouchEvents() ||
                    (isBrowser && window.navigator.maxTouchPoints > 1)
                );
            }
            function supportsPointerEvents() {
                return isBrowser && 'onpointerdown' in window;
            }
            function supportsPointerLock() {
                return isBrowser && 'exitPointerLock' in window.document;
            }
            function supportsGestureEvents() {
                try {
                    return 'constructor' in GestureEvent;
                } catch (e4) {
                    return false;
                }
            }
            var SUPPORT = {
                isBrowser,
                gesture: supportsGestureEvents(),
                touch: supportsTouchEvents(),
                touchscreen: isTouchScreen(),
                pointer: supportsPointerEvents(),
                pointerLock: supportsPointerLock()
            };
            var DEFAULT_PREVENT_SCROLL_DELAY = 250;
            var DEFAULT_DRAG_DELAY = 180;
            var DEFAULT_SWIPE_VELOCITY = 0.5;
            var DEFAULT_SWIPE_DISTANCE = 50;
            var DEFAULT_SWIPE_DURATION = 250;
            var DEFAULT_KEYBOARD_DISPLACEMENT = 10;
            var DEFAULT_DRAG_AXIS_THRESHOLD = { mouse: 0, touch: 0, pen: 8 };
            var dragConfigResolver = _objectSpread22(
                _objectSpread22({}, coordinatesConfigResolver),
                {},
                {
                    device(
                        _v,
                        _k,
                        {
                            pointer: {
                                touch = false,
                                lock = false,
                                mouse = false
                            } = {}
                        }
                    ) {
                        this.pointerLock = lock && SUPPORT.pointerLock;
                        if (SUPPORT.touch && touch) return 'touch';
                        if (this.pointerLock) return 'mouse';
                        if (SUPPORT.pointer && !mouse) return 'pointer';
                        if (SUPPORT.touch) return 'touch';
                        return 'mouse';
                    },
                    preventScrollAxis(value, _k, { preventScroll }) {
                        this.preventScrollDelay =
                            typeof preventScroll === 'number'
                                ? preventScroll
                                : preventScroll ||
                                    (preventScroll === void 0 && value)
                                  ? DEFAULT_PREVENT_SCROLL_DELAY
                                  : void 0;
                        if (!SUPPORT.touchscreen || preventScroll === false)
                            return void 0;
                        return value
                            ? value
                            : preventScroll !== void 0
                              ? 'y'
                              : void 0;
                    },
                    pointerCapture(
                        _v,
                        _k,
                        {
                            pointer: {
                                capture = true,
                                buttons = 1,
                                keys = true
                            } = {}
                        }
                    ) {
                        this.pointerButtons = buttons;
                        this.keys = keys;
                        return (
                            !this.pointerLock &&
                            this.device === 'pointer' &&
                            capture
                        );
                    },
                    threshold(
                        value,
                        _k,
                        { filterTaps = false, tapsThreshold = 3, axis = void 0 }
                    ) {
                        const threshold = maths.V.toVector(
                            value,
                            filterTaps ? tapsThreshold : axis ? 1 : 0
                        );
                        this.filterTaps = filterTaps;
                        this.tapsThreshold = tapsThreshold;
                        return threshold;
                    },
                    swipe({
                        velocity = DEFAULT_SWIPE_VELOCITY,
                        distance = DEFAULT_SWIPE_DISTANCE,
                        duration = DEFAULT_SWIPE_DURATION
                    } = {}) {
                        return {
                            velocity: this.transform(maths.V.toVector(velocity)),
                            distance: this.transform(maths.V.toVector(distance)),
                            duration
                        };
                    },
                    delay(value = 0) {
                        switch (value) {
                            case true:
                                return DEFAULT_DRAG_DELAY;
                            case false:
                                return 0;
                            default:
                                return value;
                        }
                    },
                    axisThreshold(value) {
                        if (!value) return DEFAULT_DRAG_AXIS_THRESHOLD;
                        return _objectSpread22(
                            _objectSpread22({}, DEFAULT_DRAG_AXIS_THRESHOLD),
                            value
                        );
                    },
                    keyboardDisplacement(value = DEFAULT_KEYBOARD_DISPLACEMENT) {
                        return value;
                    }
                }
            );
            {
                Object.assign(dragConfigResolver, {
                    useTouch(value) {
                        if (value !== void 0) {
                            throw Error(
                                `[@use-gesture]: \`useTouch\` option has been renamed to \`pointer.touch\`. Use it as in \`{ pointer: { touch: true } }\`.`
                            );
                        }
                        return NaN;
                    },
                    experimental_preventWindowScrollY(value) {
                        if (value !== void 0) {
                            throw Error(
                                `[@use-gesture]: \`experimental_preventWindowScrollY\` option has been renamed to \`preventScroll\`.`
                            );
                        }
                        return NaN;
                    },
                    swipeVelocity(value) {
                        if (value !== void 0) {
                            throw Error(
                                `[@use-gesture]: \`swipeVelocity\` option has been renamed to \`swipe.velocity\`. Use it as in \`{ swipe: { velocity: 0.5 } }\`.`
                            );
                        }
                        return NaN;
                    },
                    swipeDistance(value) {
                        if (value !== void 0) {
                            throw Error(
                                `[@use-gesture]: \`swipeDistance\` option has been renamed to \`swipe.distance\`. Use it as in \`{ swipe: { distance: 50 } }\`.`
                            );
                        }
                        return NaN;
                    },
                    swipeDuration(value) {
                        if (value !== void 0) {
                            throw Error(
                                `[@use-gesture]: \`swipeDuration\` option has been renamed to \`swipe.duration\`. Use it as in \`{ swipe: { duration: 250 } }\`.`
                            );
                        }
                        return NaN;
                    }
                });
            }
            function clampStateInternalMovementToBounds(state) {
                const [ox, oy] = state.overflow;
                const [dx, dy] = state._delta;
                const [dirx, diry] = state._direction;
                if (
                    (ox < 0 && dx > 0 && dirx < 0) ||
                    (ox > 0 && dx < 0 && dirx > 0)
                ) {
                    state._movement[0] = state._movementBound[0];
                }
                if (
                    (oy < 0 && dy > 0 && diry < 0) ||
                    (oy > 0 && dy < 0 && diry > 0)
                ) {
                    state._movement[1] = state._movementBound[1];
                }
            }
            var SCALE_ANGLE_RATIO_INTENT_DEG = 30;
            var PINCH_WHEEL_RATIO = 100;
            var PinchEngine = class extends Engine {
                constructor(...args) {
                    super(...args);
                    _defineProperty4(this, 'ingKey', 'pinching');
                    _defineProperty4(this, 'aliasKey', 'da');
                }
                init() {
                    this.state.offset = [1, 0];
                    this.state.lastOffset = [1, 0];
                    this.state._pointerEvents = new Map();
                }
                reset() {
                    super.reset();
                    const state = this.state;
                    state._touchIds = [];
                    state.canceled = false;
                    state.cancel = this.cancel.bind(this);
                    state.turns = 0;
                }
                computeOffset() {
                    const { type, movement, lastOffset } = this.state;
                    if (type === 'wheel') {
                        this.state.offset = maths.V.add(movement, lastOffset);
                    } else {
                        this.state.offset = [
                            (1 + movement[0]) * lastOffset[0],
                            movement[1] + lastOffset[1]
                        ];
                    }
                }
                computeMovement() {
                    const { offset: offset2, lastOffset } = this.state;
                    this.state.movement = [
                        offset2[0] / lastOffset[0],
                        offset2[1] - lastOffset[1]
                    ];
                }
                axisIntent() {
                    const state = this.state;
                    const [_m0, _m1] = state._movement;
                    if (!state.axis) {
                        const axisMovementDifference =
                            Math.abs(_m0) * SCALE_ANGLE_RATIO_INTENT_DEG -
                            Math.abs(_m1);
                        if (axisMovementDifference < 0) state.axis = 'angle';
                        else if (axisMovementDifference > 0) state.axis = 'scale';
                    }
                }
                restrictToAxis(v4) {
                    if (this.config.lockDirection) {
                        if (this.state.axis === 'scale') v4[1] = 0;
                        else if (this.state.axis === 'angle') v4[0] = 0;
                    }
                }
                cancel() {
                    const state = this.state;
                    if (state.canceled) return;
                    setTimeout(() => {
                        state.canceled = true;
                        state._active = false;
                        this.compute();
                        this.emit();
                    }, 0);
                }
                touchStart(event) {
                    this.ctrl.setEventIds(event);
                    const state = this.state;
                    const ctrlTouchIds = this.ctrl.touchIds;
                    if (state._active) {
                        if (state._touchIds.every((id) => ctrlTouchIds.has(id)))
                            return;
                    }
                    if (ctrlTouchIds.size < 2) return;
                    this.start(event);
                    state._touchIds = Array.from(ctrlTouchIds).slice(0, 2);
                    const payload = touchDistanceAngle(event, state._touchIds);
                    if (!payload) return;
                    this.pinchStart(event, payload);
                }
                pointerStart(event) {
                    if (event.buttons != null && event.buttons % 2 !== 1) return;
                    this.ctrl.setEventIds(event);
                    event.target.setPointerCapture(event.pointerId);
                    const state = this.state;
                    const _pointerEvents = state._pointerEvents;
                    const ctrlPointerIds = this.ctrl.pointerIds;
                    if (state._active) {
                        if (
                            Array.from(_pointerEvents.keys()).every((id) =>
                                ctrlPointerIds.has(id)
                            )
                        )
                            return;
                    }
                    if (_pointerEvents.size < 2) {
                        _pointerEvents.set(event.pointerId, event);
                    }
                    if (state._pointerEvents.size < 2) return;
                    this.start(event);
                    const payload = distanceAngle(
                        ...Array.from(_pointerEvents.values())
                    );
                    if (!payload) return;
                    this.pinchStart(event, payload);
                }
                pinchStart(event, payload) {
                    const state = this.state;
                    state.origin = payload.origin;
                    this.computeValues([payload.distance, payload.angle]);
                    this.computeInitial();
                    this.compute(event);
                    this.emit();
                }
                touchMove(event) {
                    if (!this.state._active) return;
                    const payload = touchDistanceAngle(event, this.state._touchIds);
                    if (!payload) return;
                    this.pinchMove(event, payload);
                }
                pointerMove(event) {
                    const _pointerEvents = this.state._pointerEvents;
                    if (_pointerEvents.has(event.pointerId)) {
                        _pointerEvents.set(event.pointerId, event);
                    }
                    if (!this.state._active) return;
                    const payload = distanceAngle(
                        ...Array.from(_pointerEvents.values())
                    );
                    if (!payload) return;
                    this.pinchMove(event, payload);
                }
                pinchMove(event, payload) {
                    const state = this.state;
                    const prev_a = state._values[1];
                    const delta_a = payload.angle - prev_a;
                    let delta_turns = 0;
                    if (Math.abs(delta_a) > 270) delta_turns += Math.sign(delta_a);
                    this.computeValues([
                        payload.distance,
                        payload.angle - 360 * delta_turns
                    ]);
                    state.origin = payload.origin;
                    state.turns = delta_turns;
                    state._movement = [
                        state._values[0] / state._initial[0] - 1,
                        state._values[1] - state._initial[1]
                    ];
                    this.compute(event);
                    this.emit();
                }
                touchEnd(event) {
                    this.ctrl.setEventIds(event);
                    if (!this.state._active) return;
                    if (
                        this.state._touchIds.some(
                            (id) => !this.ctrl.touchIds.has(id)
                        )
                    ) {
                        this.state._active = false;
                        this.compute(event);
                        this.emit();
                    }
                }
                pointerEnd(event) {
                    const state = this.state;
                    this.ctrl.setEventIds(event);
                    try {
                        event.target.releasePointerCapture(event.pointerId);
                    } catch (_unused) {}
                    if (state._pointerEvents.has(event.pointerId)) {
                        state._pointerEvents.delete(event.pointerId);
                    }
                    if (!state._active) return;
                    if (state._pointerEvents.size < 2) {
                        state._active = false;
                        this.compute(event);
                        this.emit();
                    }
                }
                gestureStart(event) {
                    if (event.cancelable) event.preventDefault();
                    const state = this.state;
                    if (state._active) return;
                    this.start(event);
                    this.computeValues([event.scale, event.rotation]);
                    state.origin = [event.clientX, event.clientY];
                    this.compute(event);
                    this.emit();
                }
                gestureMove(event) {
                    if (event.cancelable) event.preventDefault();
                    if (!this.state._active) return;
                    const state = this.state;
                    this.computeValues([event.scale, event.rotation]);
                    state.origin = [event.clientX, event.clientY];
                    const _previousMovement = state._movement;
                    state._movement = [event.scale - 1, event.rotation];
                    state._delta = maths.V.sub(state._movement, _previousMovement);
                    this.compute(event);
                    this.emit();
                }
                gestureEnd(event) {
                    if (!this.state._active) return;
                    this.state._active = false;
                    this.compute(event);
                    this.emit();
                }
                wheel(event) {
                    const modifierKey = this.config.modifierKey;
                    if (
                        modifierKey &&
                        (Array.isArray(modifierKey)
                            ? !modifierKey.find((k4) => event[k4])
                            : !event[modifierKey])
                    )
                        return;
                    if (!this.state._active) this.wheelStart(event);
                    else this.wheelChange(event);
                    this.timeoutStore.add('wheelEnd', this.wheelEnd.bind(this));
                }
                wheelStart(event) {
                    this.start(event);
                    this.wheelChange(event);
                }
                wheelChange(event) {
                    const isR3f = 'uv' in event;
                    if (!isR3f) {
                        if (event.cancelable) {
                            event.preventDefault();
                        }
                        if (!event.defaultPrevented) {
                            console.warn(`[@use-gesture]: To properly support zoom on trackpads, try using the \`target\` option.
This message will only appear in development mode.`);
                        }
                    }
                    const state = this.state;
                    state._delta = [
                        (-wheelValues(event)[1] / PINCH_WHEEL_RATIO) *
                            state.offset[0],
                        0
                    ];
                    maths.V.addTo(state._movement, state._delta);
                    clampStateInternalMovementToBounds(state);
                    this.state.origin = [event.clientX, event.clientY];
                    this.compute(event);
                    this.emit();
                }
                wheelEnd() {
                    if (!this.state._active) return;
                    this.state._active = false;
                    this.compute();
                    this.emit();
                }
                bind(bindFunction) {
                    const device = this.config.device;
                    if (!!device) {
                        bindFunction(
                            device,
                            'start',
                            this[device + 'Start'].bind(this)
                        );
                        bindFunction(
                            device,
                            'change',
                            this[device + 'Move'].bind(this)
                        );
                        bindFunction(
                            device,
                            'end',
                            this[device + 'End'].bind(this)
                        );
                        bindFunction(
                            device,
                            'cancel',
                            this[device + 'End'].bind(this)
                        );
                        bindFunction(
                            'lostPointerCapture',
                            '',
                            this[device + 'End'].bind(this)
                        );
                    }
                    if (this.config.pinchOnWheel) {
                        bindFunction('wheel', '', this.wheel.bind(this), {
                            passive: false
                        });
                    }
                }
            };
            var pinchConfigResolver = _objectSpread22(
                _objectSpread22({}, commonConfigResolver),
                {},
                {
                    device(_v, _k, { shared, pointer: { touch = false } = {} }) {
                        const sharedConfig = shared;
                        if (
                            sharedConfig.target &&
                            !SUPPORT.touch &&
                            SUPPORT.gesture
                        )
                            return 'gesture';
                        if (SUPPORT.touch && touch) return 'touch';
                        if (SUPPORT.touchscreen) {
                            if (SUPPORT.pointer) return 'pointer';
                            if (SUPPORT.touch) return 'touch';
                        }
                    },
                    bounds(_v, _k, { scaleBounds = {}, angleBounds = {} }) {
                        const _scaleBounds = (state) => {
                            const D2 = assignDefault(call(scaleBounds, state), {
                                min: -Infinity,
                                max: Infinity
                            });
                            return [D2.min, D2.max];
                        };
                        const _angleBounds = (state) => {
                            const A2 = assignDefault(call(angleBounds, state), {
                                min: -Infinity,
                                max: Infinity
                            });
                            return [A2.min, A2.max];
                        };
                        if (
                            typeof scaleBounds !== 'function' &&
                            typeof angleBounds !== 'function'
                        )
                            return [_scaleBounds(), _angleBounds()];
                        return (state) => [
                            _scaleBounds(state),
                            _angleBounds(state)
                        ];
                    },
                    threshold(value, _k, config) {
                        this.lockDirection = config.axis === 'lock';
                        const threshold = maths.V.toVector(
                            value,
                            this.lockDirection ? [0.1, 3] : 0
                        );
                        return threshold;
                    },
                    modifierKey(value) {
                        if (value === void 0) return 'ctrlKey';
                        return value;
                    },
                    pinchOnWheel(value = true) {
                        return value;
                    }
                }
            );
            var MoveEngine = class extends CoordinatesEngine {
                constructor(...args) {
                    super(...args);
                    _defineProperty4(this, 'ingKey', 'moving');
                }
                move(event) {
                    if (this.config.mouseOnly && event.pointerType !== 'mouse')
                        return;
                    if (!this.state._active) this.moveStart(event);
                    else this.moveChange(event);
                    this.timeoutStore.add('moveEnd', this.moveEnd.bind(this));
                }
                moveStart(event) {
                    this.start(event);
                    this.computeValues(pointerValues(event));
                    this.compute(event);
                    this.computeInitial();
                    this.emit();
                }
                moveChange(event) {
                    if (!this.state._active) return;
                    const values = pointerValues(event);
                    const state = this.state;
                    state._delta = maths.V.sub(values, state._values);
                    maths.V.addTo(state._movement, state._delta);
                    this.computeValues(values);
                    this.compute(event);
                    this.emit();
                }
                moveEnd(event) {
                    if (!this.state._active) return;
                    this.state._active = false;
                    this.compute(event);
                    this.emit();
                }
                bind(bindFunction) {
                    bindFunction('pointer', 'change', this.move.bind(this));
                    bindFunction('pointer', 'leave', this.moveEnd.bind(this));
                }
            };
            var moveConfigResolver = _objectSpread22(
                _objectSpread22({}, coordinatesConfigResolver),
                {},
                { mouseOnly: (value = true) => value }
            );
            var ScrollEngine = class extends CoordinatesEngine {
                constructor(...args) {
                    super(...args);
                    _defineProperty4(this, 'ingKey', 'scrolling');
                }
                scroll(event) {
                    if (!this.state._active) this.start(event);
                    this.scrollChange(event);
                    this.timeoutStore.add('scrollEnd', this.scrollEnd.bind(this));
                }
                scrollChange(event) {
                    if (event.cancelable) event.preventDefault();
                    const state = this.state;
                    const values = scrollValues(event);
                    state._delta = maths.V.sub(values, state._values);
                    maths.V.addTo(state._movement, state._delta);
                    this.computeValues(values);
                    this.compute(event);
                    this.emit();
                }
                scrollEnd() {
                    if (!this.state._active) return;
                    this.state._active = false;
                    this.compute();
                    this.emit();
                }
                bind(bindFunction) {
                    bindFunction('scroll', '', this.scroll.bind(this));
                }
            };
            var scrollConfigResolver = coordinatesConfigResolver;
            var WheelEngine = class extends CoordinatesEngine {
                constructor(...args) {
                    super(...args);
                    _defineProperty4(this, 'ingKey', 'wheeling');
                }
                wheel(event) {
                    if (!this.state._active) this.start(event);
                    this.wheelChange(event);
                    this.timeoutStore.add('wheelEnd', this.wheelEnd.bind(this));
                }
                wheelChange(event) {
                    const state = this.state;
                    state._delta = wheelValues(event);
                    maths.V.addTo(state._movement, state._delta);
                    clampStateInternalMovementToBounds(state);
                    this.compute(event);
                    this.emit();
                }
                wheelEnd() {
                    if (!this.state._active) return;
                    this.state._active = false;
                    this.compute();
                    this.emit();
                }
                bind(bindFunction) {
                    bindFunction('wheel', '', this.wheel.bind(this));
                }
            };
            var wheelConfigResolver = coordinatesConfigResolver;
            var HoverEngine = class extends CoordinatesEngine {
                constructor(...args) {
                    super(...args);
                    _defineProperty4(this, 'ingKey', 'hovering');
                }
                enter(event) {
                    if (this.config.mouseOnly && event.pointerType !== 'mouse')
                        return;
                    this.start(event);
                    this.computeValues(pointerValues(event));
                    this.compute(event);
                    this.emit();
                }
                leave(event) {
                    if (this.config.mouseOnly && event.pointerType !== 'mouse')
                        return;
                    const state = this.state;
                    if (!state._active) return;
                    state._active = false;
                    const values = pointerValues(event);
                    state._movement = state._delta = maths.V.sub(
                        values,
                        state._values
                    );
                    this.computeValues(values);
                    this.compute(event);
                    state.delta = state.movement;
                    this.emit();
                }
                bind(bindFunction) {
                    bindFunction('pointer', 'enter', this.enter.bind(this));
                    bindFunction('pointer', 'leave', this.leave.bind(this));
                }
            };
            var hoverConfigResolver = _objectSpread22(
                _objectSpread22({}, coordinatesConfigResolver),
                {},
                { mouseOnly: (value = true) => value }
            );
            var EngineMap = new Map();
            var ConfigResolverMap = new Map();
            function registerAction2(action) {
                EngineMap.set(action.key, action.engine);
                ConfigResolverMap.set(action.key, action.resolver);
            }
            var dragAction2 = {
                key: 'drag',
                engine: DragEngine,
                resolver: dragConfigResolver
            };
            var hoverAction2 = {
                key: 'hover',
                engine: HoverEngine,
                resolver: hoverConfigResolver
            };
            var moveAction2 = {
                key: 'move',
                engine: MoveEngine,
                resolver: moveConfigResolver
            };
            var pinchAction2 = {
                key: 'pinch',
                engine: PinchEngine,
                resolver: pinchConfigResolver
            };
            var scrollAction2 = {
                key: 'scroll',
                engine: ScrollEngine,
                resolver: scrollConfigResolver
            };
            var wheelAction2 = {
                key: 'wheel',
                engine: WheelEngine,
                resolver: wheelConfigResolver
            };
            exports.ConfigResolverMap = ConfigResolverMap;
            exports.EngineMap = EngineMap;
            exports.SUPPORT = SUPPORT;
            exports._defineProperty = _defineProperty4;
            exports._objectSpread2 = _objectSpread22;
            exports.chain = chain;
            exports.dragAction = dragAction2;
            exports.hoverAction = hoverAction2;
            exports.isTouch = isTouch;
            exports.moveAction = moveAction2;
            exports.parseProp = parseProp;
            exports.pinchAction = pinchAction2;
            exports.registerAction = registerAction2;
            exports.scrollAction = scrollAction2;
            exports.toDomEventType = toDomEventType;
            exports.toHandlerProp = toHandlerProp;
            exports.touchIds = touchIds;
            exports.wheelAction = wheelAction2;
        }
    });
    var require_use_gesture_core_actions_cjs_dev = __commonJS({
        'node_modules/@use-gesture/core/actions/dist/use-gesture-core-actions.cjs.dev.js'(
            exports
        ) {
            Object.defineProperty(exports, '__esModule', { value: true });
            var actions_dist_useGestureCoreActions =
                require_actions_6579bdef_cjs_dev();
            require_maths_267f0992_cjs_dev();
            exports.ConfigResolverMap =
                actions_dist_useGestureCoreActions.ConfigResolverMap;
            exports.EngineMap = actions_dist_useGestureCoreActions.EngineMap;
            exports.dragAction = actions_dist_useGestureCoreActions.dragAction;
            exports.hoverAction = actions_dist_useGestureCoreActions.hoverAction;
            exports.moveAction = actions_dist_useGestureCoreActions.moveAction;
            exports.pinchAction = actions_dist_useGestureCoreActions.pinchAction;
            exports.registerAction =
                actions_dist_useGestureCoreActions.registerAction;
            exports.scrollAction = actions_dist_useGestureCoreActions.scrollAction;
            exports.wheelAction = actions_dist_useGestureCoreActions.wheelAction;
        }
    });
    var require_use_gesture_core_actions_cjs = __commonJS({
        'node_modules/@use-gesture/core/actions/dist/use-gesture-core-actions.cjs.js'(
            exports,
            module
        ) {
            {
                module.exports = require_use_gesture_core_actions_cjs_dev();
            }
        }
    });
    var require_use_gesture_core_cjs_dev = __commonJS({
        'node_modules/@use-gesture/core/dist/use-gesture-core.cjs.dev.js'(exports) {
            Object.defineProperty(exports, '__esModule', { value: true });
            var actions_dist_useGestureCoreActions =
                require_actions_6579bdef_cjs_dev();
            require_maths_267f0992_cjs_dev();
            function _objectWithoutPropertiesLoose3(source, excluded) {
                if (source == null) return {};
                var target = {};
                var sourceKeys = Object.keys(source);
                var key, i4;
                for (i4 = 0; i4 < sourceKeys.length; i4++) {
                    key = sourceKeys[i4];
                    if (excluded.indexOf(key) >= 0) continue;
                    target[key] = source[key];
                }
                return target;
            }
            function _objectWithoutProperties3(source, excluded) {
                if (source == null) return {};
                var target = _objectWithoutPropertiesLoose3(source, excluded);
                var key, i4;
                if (Object.getOwnPropertySymbols) {
                    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
                    for (i4 = 0; i4 < sourceSymbolKeys.length; i4++) {
                        key = sourceSymbolKeys[i4];
                        if (excluded.indexOf(key) >= 0) continue;
                        if (
                            !Object.prototype.propertyIsEnumerable.call(source, key)
                        )
                            continue;
                        target[key] = source[key];
                    }
                }
                return target;
            }
            var sharedConfigResolver = {
                target(value) {
                    if (value) {
                        return () => ('current' in value ? value.current : value);
                    }
                    return void 0;
                },
                enabled(value = true) {
                    return value;
                },
                window(
                    value = actions_dist_useGestureCoreActions.SUPPORT.isBrowser
                        ? window
                        : void 0
                ) {
                    return value;
                },
                eventOptions({ passive = true, capture = false } = {}) {
                    return { passive, capture };
                },
                transform(value) {
                    return value;
                }
            };
            var _excluded6 = [
                'target',
                'eventOptions',
                'window',
                'enabled',
                'transform'
            ];
            function resolveWith(config = {}, resolvers) {
                const result = {};
                for (const [key, resolver] of Object.entries(resolvers)) {
                    switch (typeof resolver) {
                        case 'function':
                            {
                                const r4 = resolver.call(
                                    result,
                                    config[key],
                                    key,
                                    config
                                );
                                if (!Number.isNaN(r4)) result[key] = r4;
                            }
                            break;
                        case 'object':
                            result[key] = resolveWith(config[key], resolver);
                            break;
                        case 'boolean':
                            if (resolver) result[key] = config[key];
                            break;
                    }
                }
                return result;
            }
            function parse2(newConfig, gestureKey, _config = {}) {
                const _ref = newConfig,
                    {
                        target,
                        eventOptions,
                        window: window2,
                        enabled,
                        transform
                    } = _ref,
                    rest2 = _objectWithoutProperties3(_ref, _excluded6);
                _config.shared = resolveWith(
                    { target, eventOptions, window: window2, enabled, transform },
                    sharedConfigResolver
                );
                if (gestureKey) {
                    const resolver =
                        actions_dist_useGestureCoreActions.ConfigResolverMap.get(
                            gestureKey
                        );
                    _config[gestureKey] = resolveWith(
                        actions_dist_useGestureCoreActions._objectSpread2(
                            { shared: _config.shared },
                            rest2
                        ),
                        resolver
                    );
                } else {
                    for (const key in rest2) {
                        const resolver =
                            actions_dist_useGestureCoreActions.ConfigResolverMap.get(
                                key
                            );
                        if (resolver) {
                            _config[key] = resolveWith(
                                actions_dist_useGestureCoreActions._objectSpread2(
                                    { shared: _config.shared },
                                    rest2[key]
                                ),
                                resolver
                            );
                        } else {
                            if (
                                ![
                                    'drag',
                                    'pinch',
                                    'scroll',
                                    'wheel',
                                    'move',
                                    'hover'
                                ].includes(key)
                            ) {
                                if (key === 'domTarget') {
                                    throw Error(
                                        `[@use-gesture]: \`domTarget\` option has been renamed to \`target\`.`
                                    );
                                }
                                console.warn(
                                    `[@use-gesture]: Unknown config key \`${key}\` was used. Please read the documentation for further information.`
                                );
                            }
                        }
                    }
                }
                return _config;
            }
            var EventStore = class {
                constructor(ctrl, gestureKey) {
                    actions_dist_useGestureCoreActions._defineProperty(
                        this,
                        '_listeners',
                        new Set()
                    );
                    this._ctrl = ctrl;
                    this._gestureKey = gestureKey;
                }
                add(element, device, action, handler, options) {
                    const listeners = this._listeners;
                    const type = actions_dist_useGestureCoreActions.toDomEventType(
                        device,
                        action
                    );
                    const _options = this._gestureKey
                        ? this._ctrl.config[this._gestureKey].eventOptions
                        : {};
                    const eventOptions =
                        actions_dist_useGestureCoreActions._objectSpread2(
                            actions_dist_useGestureCoreActions._objectSpread2(
                                {},
                                _options
                            ),
                            options
                        );
                    element.addEventListener(type, handler, eventOptions);
                    const remove = () => {
                        element.removeEventListener(type, handler, eventOptions);
                        listeners.delete(remove);
                    };
                    listeners.add(remove);
                    return remove;
                }
                clean() {
                    this._listeners.forEach((remove) => remove());
                    this._listeners.clear();
                }
            };
            var TimeoutStore = class {
                constructor() {
                    actions_dist_useGestureCoreActions._defineProperty(
                        this,
                        '_timeouts',
                        new Map()
                    );
                }
                add(key, callback, ms = 140, ...args) {
                    this.remove(key);
                    this._timeouts.set(
                        key,
                        window.setTimeout(callback, ms, ...args)
                    );
                }
                remove(key) {
                    const timeout = this._timeouts.get(key);
                    if (timeout) window.clearTimeout(timeout);
                }
                clean() {
                    this._timeouts.forEach(
                        (timeout) => void window.clearTimeout(timeout)
                    );
                    this._timeouts.clear();
                }
            };
            var Controller2 = class {
                constructor(handlers) {
                    actions_dist_useGestureCoreActions._defineProperty(
                        this,
                        'gestures',
                        new Set()
                    );
                    actions_dist_useGestureCoreActions._defineProperty(
                        this,
                        '_targetEventStore',
                        new EventStore(this)
                    );
                    actions_dist_useGestureCoreActions._defineProperty(
                        this,
                        'gestureEventStores',
                        {}
                    );
                    actions_dist_useGestureCoreActions._defineProperty(
                        this,
                        'gestureTimeoutStores',
                        {}
                    );
                    actions_dist_useGestureCoreActions._defineProperty(
                        this,
                        'handlers',
                        {}
                    );
                    actions_dist_useGestureCoreActions._defineProperty(
                        this,
                        'config',
                        {}
                    );
                    actions_dist_useGestureCoreActions._defineProperty(
                        this,
                        'pointerIds',
                        new Set()
                    );
                    actions_dist_useGestureCoreActions._defineProperty(
                        this,
                        'touchIds',
                        new Set()
                    );
                    actions_dist_useGestureCoreActions._defineProperty(
                        this,
                        'state',
                        {
                            shared: {
                                shiftKey: false,
                                metaKey: false,
                                ctrlKey: false,
                                altKey: false
                            }
                        }
                    );
                    resolveGestures(this, handlers);
                }
                setEventIds(event) {
                    if (actions_dist_useGestureCoreActions.isTouch(event)) {
                        this.touchIds = new Set(
                            actions_dist_useGestureCoreActions.touchIds(event)
                        );
                        return this.touchIds;
                    } else if ('pointerId' in event) {
                        if (
                            event.type === 'pointerup' ||
                            event.type === 'pointercancel'
                        )
                            this.pointerIds.delete(event.pointerId);
                        else if (event.type === 'pointerdown')
                            this.pointerIds.add(event.pointerId);
                        return this.pointerIds;
                    }
                }
                applyHandlers(handlers, nativeHandlers) {
                    this.handlers = handlers;
                    this.nativeHandlers = nativeHandlers;
                }
                applyConfig(config, gestureKey) {
                    this.config = parse2(config, gestureKey, this.config);
                }
                clean() {
                    this._targetEventStore.clean();
                    for (const key of this.gestures) {
                        this.gestureEventStores[key].clean();
                        this.gestureTimeoutStores[key].clean();
                    }
                }
                effect() {
                    if (this.config.shared.target) this.bind();
                    return () => this._targetEventStore.clean();
                }
                bind(...args) {
                    const sharedConfig = this.config.shared;
                    const props3 = {};
                    let target;
                    if (sharedConfig.target) {
                        target = sharedConfig.target();
                        if (!target) return;
                    }
                    if (sharedConfig.enabled) {
                        for (const gestureKey of this.gestures) {
                            const gestureConfig = this.config[gestureKey];
                            const bindFunction = bindToProps(
                                props3,
                                gestureConfig.eventOptions,
                                !!target
                            );
                            if (gestureConfig.enabled) {
                                const Engine =
                                    actions_dist_useGestureCoreActions.EngineMap.get(
                                        gestureKey
                                    );
                                new Engine(this, args, gestureKey).bind(
                                    bindFunction
                                );
                            }
                        }
                        const nativeBindFunction = bindToProps(
                            props3,
                            sharedConfig.eventOptions,
                            !!target
                        );
                        for (const eventKey in this.nativeHandlers) {
                            nativeBindFunction(
                                eventKey,
                                '',
                                (event) =>
                                    this.nativeHandlers[eventKey](
                                        actions_dist_useGestureCoreActions._objectSpread2(
                                            actions_dist_useGestureCoreActions._objectSpread2(
                                                {},
                                                this.state.shared
                                            ),
                                            {},
                                            { event, args }
                                        )
                                    ),
                                void 0,
                                true
                            );
                        }
                    }
                    for (const handlerProp in props3) {
                        props3[handlerProp] =
                            actions_dist_useGestureCoreActions.chain(
                                ...props3[handlerProp]
                            );
                    }
                    if (!target) return props3;
                    for (const handlerProp in props3) {
                        const { device, capture, passive } =
                            actions_dist_useGestureCoreActions.parseProp(
                                handlerProp
                            );
                        this._targetEventStore.add(
                            target,
                            device,
                            '',
                            props3[handlerProp],
                            { capture, passive }
                        );
                    }
                }
            };
            function setupGesture(ctrl, gestureKey) {
                ctrl.gestures.add(gestureKey);
                ctrl.gestureEventStores[gestureKey] = new EventStore(
                    ctrl,
                    gestureKey
                );
                ctrl.gestureTimeoutStores[gestureKey] = new TimeoutStore();
            }
            function resolveGestures(ctrl, internalHandlers) {
                if (internalHandlers.drag) setupGesture(ctrl, 'drag');
                if (internalHandlers.wheel) setupGesture(ctrl, 'wheel');
                if (internalHandlers.scroll) setupGesture(ctrl, 'scroll');
                if (internalHandlers.move) setupGesture(ctrl, 'move');
                if (internalHandlers.pinch) setupGesture(ctrl, 'pinch');
                if (internalHandlers.hover) setupGesture(ctrl, 'hover');
            }
            var bindToProps =
                (props3, eventOptions, withPassiveOption) =>
                (device, action, handler, options = {}, isNative = false) => {
                    var _options$capture, _options$passive;
                    const capture =
                        (_options$capture = options.capture) !== null &&
                        _options$capture !== void 0
                            ? _options$capture
                            : eventOptions.capture;
                    const passive =
                        (_options$passive = options.passive) !== null &&
                        _options$passive !== void 0
                            ? _options$passive
                            : eventOptions.passive;
                    let handlerProp = isNative
                        ? device
                        : actions_dist_useGestureCoreActions.toHandlerProp(
                              device,
                              action,
                              capture
                          );
                    if (withPassiveOption && passive) handlerProp += 'Passive';
                    props3[handlerProp] = props3[handlerProp] || [];
                    props3[handlerProp].push(handler);
                };
            var RE_NOT_NATIVE = /^on(Drag|Wheel|Scroll|Move|Pinch|Hover)/;
            function sortHandlers(_handlers) {
                const native = {};
                const handlers = {};
                const actions = new Set();
                for (let key in _handlers) {
                    if (RE_NOT_NATIVE.test(key)) {
                        actions.add(RegExp.lastMatch);
                        handlers[key] = _handlers[key];
                    } else {
                        native[key] = _handlers[key];
                    }
                }
                return [handlers, native, actions];
            }
            function registerGesture(
                actions,
                handlers,
                handlerKey,
                key,
                internalHandlers,
                config
            ) {
                if (!actions.has(handlerKey)) return;
                if (!actions_dist_useGestureCoreActions.EngineMap.has(key)) {
                    {
                        console.warn(`[@use-gesture]: You've created a custom handler that that uses the \`${key}\` gesture but isn't properly configured.
Please add \`${key}Action\` when creating your handler.`);
                    }
                    return;
                }
                const startKey = handlerKey + 'Start';
                const endKey = handlerKey + 'End';
                const fn = (state) => {
                    let memo = void 0;
                    if (state.first && startKey in handlers)
                        handlers[startKey](state);
                    if (handlerKey in handlers) memo = handlers[handlerKey](state);
                    if (state.last && endKey in handlers) handlers[endKey](state);
                    return memo;
                };
                internalHandlers[key] = fn;
                config[key] = config[key] || {};
            }
            function parseMergedHandlers2(mergedHandlers, mergedConfig) {
                const [handlers, nativeHandlers, actions] =
                    sortHandlers(mergedHandlers);
                const internalHandlers = {};
                registerGesture(
                    actions,
                    handlers,
                    'onDrag',
                    'drag',
                    internalHandlers,
                    mergedConfig
                );
                registerGesture(
                    actions,
                    handlers,
                    'onWheel',
                    'wheel',
                    internalHandlers,
                    mergedConfig
                );
                registerGesture(
                    actions,
                    handlers,
                    'onScroll',
                    'scroll',
                    internalHandlers,
                    mergedConfig
                );
                registerGesture(
                    actions,
                    handlers,
                    'onPinch',
                    'pinch',
                    internalHandlers,
                    mergedConfig
                );
                registerGesture(
                    actions,
                    handlers,
                    'onMove',
                    'move',
                    internalHandlers,
                    mergedConfig
                );
                registerGesture(
                    actions,
                    handlers,
                    'onHover',
                    'hover',
                    internalHandlers,
                    mergedConfig
                );
                return {
                    handlers: internalHandlers,
                    config: mergedConfig,
                    nativeHandlers
                };
            }
            exports.Controller = Controller2;
            exports.parseMergedHandlers = parseMergedHandlers2;
        }
    });
    var require_use_gesture_core_cjs = __commonJS({
        'node_modules/@use-gesture/core/dist/use-gesture-core.cjs.js'(
            exports,
            module
        ) {
            {
                module.exports = require_use_gesture_core_cjs_dev();
            }
        }
    });
    var require_use_gesture_core_utils_cjs_dev = __commonJS({
        'node_modules/@use-gesture/core/utils/dist/use-gesture-core-utils.cjs.dev.js'(
            exports
        ) {
            Object.defineProperty(exports, '__esModule', { value: true });
            var maths = require_maths_267f0992_cjs_dev();
            exports.rubberbandIfOutOfBounds = maths.rubberbandIfOutOfBounds;
        }
    });
    var require_use_gesture_core_utils_cjs = __commonJS({
        'node_modules/@use-gesture/core/utils/dist/use-gesture-core-utils.cjs.js'(
            exports,
            module
        ) {
            {
                module.exports = require_use_gesture_core_utils_cjs_dev();
            }
        }
    });
    var require_use_gesture_core_types_cjs_dev = __commonJS({
        'node_modules/@use-gesture/core/types/dist/use-gesture-core-types.cjs.dev.js'() {
        }
    });
    var require_use_gesture_core_types_cjs = __commonJS({
        'node_modules/@use-gesture/core/types/dist/use-gesture-core-types.cjs.js'(
            exports,
            module
        ) {
            {
                module.exports = require_use_gesture_core_types_cjs_dev();
            }
        }
    });
    var require_react_is_development = __commonJS({
        'node_modules/react-is/cjs/react-is.development.js'(exports) {
            {
                (function () {
                    var hasSymbol = typeof Symbol === 'function' && Symbol.for;
                    var REACT_ELEMENT_TYPE = hasSymbol
                        ? Symbol.for('react.element')
                        : 60103;
                    var REACT_PORTAL_TYPE = hasSymbol
                        ? Symbol.for('react.portal')
                        : 60106;
                    var REACT_FRAGMENT_TYPE = hasSymbol
                        ? Symbol.for('react.fragment')
                        : 60107;
                    var REACT_STRICT_MODE_TYPE = hasSymbol
                        ? Symbol.for('react.strict_mode')
                        : 60108;
                    var REACT_PROFILER_TYPE = hasSymbol
                        ? Symbol.for('react.profiler')
                        : 60114;
                    var REACT_PROVIDER_TYPE = hasSymbol
                        ? Symbol.for('react.provider')
                        : 60109;
                    var REACT_CONTEXT_TYPE = hasSymbol
                        ? Symbol.for('react.context')
                        : 60110;
                    var REACT_ASYNC_MODE_TYPE = hasSymbol
                        ? Symbol.for('react.async_mode')
                        : 60111;
                    var REACT_CONCURRENT_MODE_TYPE = hasSymbol
                        ? Symbol.for('react.concurrent_mode')
                        : 60111;
                    var REACT_FORWARD_REF_TYPE = hasSymbol
                        ? Symbol.for('react.forward_ref')
                        : 60112;
                    var REACT_SUSPENSE_TYPE = hasSymbol
                        ? Symbol.for('react.suspense')
                        : 60113;
                    var REACT_SUSPENSE_LIST_TYPE = hasSymbol
                        ? Symbol.for('react.suspense_list')
                        : 60120;
                    var REACT_MEMO_TYPE = hasSymbol
                        ? Symbol.for('react.memo')
                        : 60115;
                    var REACT_LAZY_TYPE = hasSymbol
                        ? Symbol.for('react.lazy')
                        : 60116;
                    var REACT_BLOCK_TYPE = hasSymbol
                        ? Symbol.for('react.block')
                        : 60121;
                    var REACT_FUNDAMENTAL_TYPE = hasSymbol
                        ? Symbol.for('react.fundamental')
                        : 60117;
                    var REACT_RESPONDER_TYPE = hasSymbol
                        ? Symbol.for('react.responder')
                        : 60118;
                    var REACT_SCOPE_TYPE = hasSymbol
                        ? Symbol.for('react.scope')
                        : 60119;
                    function isValidElementType(type) {
                        return (
                            typeof type === 'string' ||
                            typeof type === 'function' ||
                            type === REACT_FRAGMENT_TYPE ||
                            type === REACT_CONCURRENT_MODE_TYPE ||
                            type === REACT_PROFILER_TYPE ||
                            type === REACT_STRICT_MODE_TYPE ||
                            type === REACT_SUSPENSE_TYPE ||
                            type === REACT_SUSPENSE_LIST_TYPE ||
                            (typeof type === 'object' &&
                                type !== null &&
                                (type.$$typeof === REACT_LAZY_TYPE ||
                                    type.$$typeof === REACT_MEMO_TYPE ||
                                    type.$$typeof === REACT_PROVIDER_TYPE ||
                                    type.$$typeof === REACT_CONTEXT_TYPE ||
                                    type.$$typeof === REACT_FORWARD_REF_TYPE ||
                                    type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
                                    type.$$typeof === REACT_RESPONDER_TYPE ||
                                    type.$$typeof === REACT_SCOPE_TYPE ||
                                    type.$$typeof === REACT_BLOCK_TYPE))
                        );
                    }
                    function typeOf(object) {
                        if (typeof object === 'object' && object !== null) {
                            var $$typeof = object.$$typeof;
                            switch ($$typeof) {
                                case REACT_ELEMENT_TYPE:
                                    var type = object.type;
                                    switch (type) {
                                        case REACT_ASYNC_MODE_TYPE:
                                        case REACT_CONCURRENT_MODE_TYPE:
                                        case REACT_FRAGMENT_TYPE:
                                        case REACT_PROFILER_TYPE:
                                        case REACT_STRICT_MODE_TYPE:
                                        case REACT_SUSPENSE_TYPE:
                                            return type;
                                        default:
                                            var $$typeofType =
                                                type && type.$$typeof;
                                            switch ($$typeofType) {
                                                case REACT_CONTEXT_TYPE:
                                                case REACT_FORWARD_REF_TYPE:
                                                case REACT_LAZY_TYPE:
                                                case REACT_MEMO_TYPE:
                                                case REACT_PROVIDER_TYPE:
                                                    return $$typeofType;
                                                default:
                                                    return $$typeof;
                                            }
                                    }
                                case REACT_PORTAL_TYPE:
                                    return $$typeof;
                            }
                        }
                        return void 0;
                    }
                    var AsyncMode = REACT_ASYNC_MODE_TYPE;
                    var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
                    var ContextConsumer = REACT_CONTEXT_TYPE;
                    var ContextProvider = REACT_PROVIDER_TYPE;
                    var Element = REACT_ELEMENT_TYPE;
                    var ForwardRef = REACT_FORWARD_REF_TYPE;
                    var Fragment2 = REACT_FRAGMENT_TYPE;
                    var Lazy = REACT_LAZY_TYPE;
                    var Memo = REACT_MEMO_TYPE;
                    var Portal2 = REACT_PORTAL_TYPE;
                    var Profiler = REACT_PROFILER_TYPE;
                    var StrictMode = REACT_STRICT_MODE_TYPE;
                    var Suspense = REACT_SUSPENSE_TYPE;
                    var hasWarnedAboutDeprecatedIsAsyncMode = false;
                    function isAsyncMode(object) {
                        {
                            if (!hasWarnedAboutDeprecatedIsAsyncMode) {
                                hasWarnedAboutDeprecatedIsAsyncMode = true;
                                console['warn'](
                                    'The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.'
                                );
                            }
                        }
                        return (
                            isConcurrentMode(object) ||
                            typeOf(object) === REACT_ASYNC_MODE_TYPE
                        );
                    }
                    function isConcurrentMode(object) {
                        return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
                    }
                    function isContextConsumer(object) {
                        return typeOf(object) === REACT_CONTEXT_TYPE;
                    }
                    function isContextProvider(object) {
                        return typeOf(object) === REACT_PROVIDER_TYPE;
                    }
                    function isElement2(object) {
                        return (
                            typeof object === 'object' &&
                            object !== null &&
                            object.$$typeof === REACT_ELEMENT_TYPE
                        );
                    }
                    function isForwardRef(object) {
                        return typeOf(object) === REACT_FORWARD_REF_TYPE;
                    }
                    function isFragment(object) {
                        return typeOf(object) === REACT_FRAGMENT_TYPE;
                    }
                    function isLazy(object) {
                        return typeOf(object) === REACT_LAZY_TYPE;
                    }
                    function isMemo(object) {
                        return typeOf(object) === REACT_MEMO_TYPE;
                    }
                    function isPortal(object) {
                        return typeOf(object) === REACT_PORTAL_TYPE;
                    }
                    function isProfiler(object) {
                        return typeOf(object) === REACT_PROFILER_TYPE;
                    }
                    function isStrictMode(object) {
                        return typeOf(object) === REACT_STRICT_MODE_TYPE;
                    }
                    function isSuspense(object) {
                        return typeOf(object) === REACT_SUSPENSE_TYPE;
                    }
                    exports.AsyncMode = AsyncMode;
                    exports.ConcurrentMode = ConcurrentMode;
                    exports.ContextConsumer = ContextConsumer;
                    exports.ContextProvider = ContextProvider;
                    exports.Element = Element;
                    exports.ForwardRef = ForwardRef;
                    exports.Fragment = Fragment2;
                    exports.Lazy = Lazy;
                    exports.Memo = Memo;
                    exports.Portal = Portal2;
                    exports.Profiler = Profiler;
                    exports.StrictMode = StrictMode;
                    exports.Suspense = Suspense;
                    exports.isAsyncMode = isAsyncMode;
                    exports.isConcurrentMode = isConcurrentMode;
                    exports.isContextConsumer = isContextConsumer;
                    exports.isContextProvider = isContextProvider;
                    exports.isElement = isElement2;
                    exports.isForwardRef = isForwardRef;
                    exports.isFragment = isFragment;
                    exports.isLazy = isLazy;
                    exports.isMemo = isMemo;
                    exports.isPortal = isPortal;
                    exports.isProfiler = isProfiler;
                    exports.isStrictMode = isStrictMode;
                    exports.isSuspense = isSuspense;
                    exports.isValidElementType = isValidElementType;
                    exports.typeOf = typeOf;
                })();
            }
        }
    });
    var require_react_is = __commonJS({
        'node_modules/react-is/index.js'(exports, module) {
            {
                module.exports = require_react_is_development();
            }
        }
    });
    var require_object_assign = __commonJS({
        'node_modules/object-assign/index.js'(exports, module) {
            var getOwnPropertySymbols = Object.getOwnPropertySymbols;
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var propIsEnumerable = Object.prototype.propertyIsEnumerable;
            function toObject(val) {
                if (val === null || val === void 0) {
                    throw new TypeError(
                        'Object.assign cannot be called with null or undefined'
                    );
                }
                return Object(val);
            }
            function shouldUseNative() {
                try {
                    if (!Object.assign) {
                        return false;
                    }
                    var test1 = new String('abc');
                    test1[5] = 'de';
                    if (Object.getOwnPropertyNames(test1)[0] === '5') {
                        return false;
                    }
                    var test2 = {};
                    for (var i4 = 0; i4 < 10; i4++) {
                        test2['_' + String.fromCharCode(i4)] = i4;
                    }
                    var order2 = Object.getOwnPropertyNames(test2).map(
                        function (n4) {
                            return test2[n4];
                        }
                    );
                    if (order2.join('') !== '0123456789') {
                        return false;
                    }
                    var test3 = {};
                    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
                        test3[letter] = letter;
                    });
                    if (
                        Object.keys(Object.assign({}, test3)).join('') !==
                        'abcdefghijklmnopqrst'
                    ) {
                        return false;
                    }
                    return true;
                } catch (err) {
                    return false;
                }
            }
            module.exports = shouldUseNative()
                ? Object.assign
                : function (target, source) {
                      var from;
                      var to = toObject(target);
                      var symbols;
                      for (var s4 = 1; s4 < arguments.length; s4++) {
                          from = Object(arguments[s4]);
                          for (var key in from) {
                              if (hasOwnProperty.call(from, key)) {
                                  to[key] = from[key];
                              }
                          }
                          if (getOwnPropertySymbols) {
                              symbols = getOwnPropertySymbols(from);
                              for (var i4 = 0; i4 < symbols.length; i4++) {
                                  if (propIsEnumerable.call(from, symbols[i4])) {
                                      to[symbols[i4]] = from[symbols[i4]];
                                  }
                              }
                          }
                      }
                      return to;
                  };
        }
    });
    var require_ReactPropTypesSecret = __commonJS({
        'node_modules/prop-types/lib/ReactPropTypesSecret.js'(exports, module) {
            var ReactPropTypesSecret =
                'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
            module.exports = ReactPropTypesSecret;
        }
    });
    var require_has = __commonJS({
        'node_modules/prop-types/lib/has.js'(exports, module) {
            module.exports = Function.call.bind(Object.prototype.hasOwnProperty);
        }
    });
    var require_checkPropTypes = __commonJS({
        'node_modules/prop-types/checkPropTypes.js'(exports, module) {
            var printWarning = function () {};
            {
                ReactPropTypesSecret = require_ReactPropTypesSecret();
                loggedTypeFailures = {};
                has2 = require_has();
                printWarning = function (text) {
                    var message = 'Warning: ' + text;
                    if (typeof console !== 'undefined') {
                        console.error(message);
                    }
                    try {
                        throw new Error(message);
                    } catch (x3) {}
                };
            }
            var ReactPropTypesSecret;
            var loggedTypeFailures;
            var has2;
            function checkPropTypes(
                typeSpecs,
                values,
                location2,
                componentName,
                getStack
            ) {
                {
                    for (var typeSpecName in typeSpecs) {
                        if (has2(typeSpecs, typeSpecName)) {
                            var error;
                            try {
                                if (typeof typeSpecs[typeSpecName] !== 'function') {
                                    var err = Error(
                                        (componentName || 'React class') +
                                            ': ' +
                                            location2 +
                                            ' type `' +
                                            typeSpecName +
                                            '` is invalid; it must be a function, usually from the `prop-types` package, but received `' +
                                            typeof typeSpecs[typeSpecName] +
                                            '`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
                                    );
                                    err.name = 'Invariant Violation';
                                    throw err;
                                }
                                error = typeSpecs[typeSpecName](
                                    values,
                                    typeSpecName,
                                    componentName,
                                    location2,
                                    null,
                                    ReactPropTypesSecret
                                );
                            } catch (ex) {
                                error = ex;
                            }
                            if (error && !(error instanceof Error)) {
                                printWarning(
                                    (componentName || 'React class') +
                                        ': type specification of ' +
                                        location2 +
                                        ' `' +
                                        typeSpecName +
                                        '` is invalid; the type checker function must return `null` or an `Error` but returned a ' +
                                        typeof error +
                                        '. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).'
                                );
                            }
                            if (
                                error instanceof Error &&
                                !(error.message in loggedTypeFailures)
                            ) {
                                loggedTypeFailures[error.message] = true;
                                var stack = getStack ? getStack() : '';
                                printWarning(
                                    'Failed ' +
                                        location2 +
                                        ' type: ' +
                                        error.message +
                                        (stack != null ? stack : '')
                                );
                            }
                        }
                    }
                }
            }
            checkPropTypes.resetWarningCache = function () {
                {
                    loggedTypeFailures = {};
                }
            };
            module.exports = checkPropTypes;
        }
    });
    var require_factoryWithTypeCheckers = __commonJS({
        'node_modules/prop-types/factoryWithTypeCheckers.js'(exports, module) {
            var ReactIs = require_react_is();
            var assign = require_object_assign();
            var ReactPropTypesSecret = require_ReactPropTypesSecret();
            var has2 = require_has();
            var checkPropTypes = require_checkPropTypes();
            var printWarning = function () {};
            {
                printWarning = function (text) {
                    var message = 'Warning: ' + text;
                    if (typeof console !== 'undefined') {
                        console.error(message);
                    }
                    try {
                        throw new Error(message);
                    } catch (x3) {}
                };
            }
            function emptyFunctionThatReturnsNull() {
                return null;
            }
            module.exports = function (isValidElement, throwOnDirectAccess) {
                var ITERATOR_SYMBOL =
                    typeof Symbol === 'function' && Symbol.iterator;
                var FAUX_ITERATOR_SYMBOL = '@@iterator';
                function getIteratorFn(maybeIterable) {
                    var iteratorFn =
                        maybeIterable &&
                        ((ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL]) ||
                            maybeIterable[FAUX_ITERATOR_SYMBOL]);
                    if (typeof iteratorFn === 'function') {
                        return iteratorFn;
                    }
                }
                var ANONYMOUS = '<<anonymous>>';
                var ReactPropTypes = {
                    array: createPrimitiveTypeChecker('array'),
                    bigint: createPrimitiveTypeChecker('bigint'),
                    bool: createPrimitiveTypeChecker('boolean'),
                    func: createPrimitiveTypeChecker('function'),
                    number: createPrimitiveTypeChecker('number'),
                    object: createPrimitiveTypeChecker('object'),
                    string: createPrimitiveTypeChecker('string'),
                    symbol: createPrimitiveTypeChecker('symbol'),
                    any: createAnyTypeChecker(),
                    arrayOf: createArrayOfTypeChecker,
                    element: createElementTypeChecker(),
                    elementType: createElementTypeTypeChecker(),
                    instanceOf: createInstanceTypeChecker,
                    node: createNodeChecker(),
                    objectOf: createObjectOfTypeChecker,
                    oneOf: createEnumTypeChecker,
                    oneOfType: createUnionTypeChecker,
                    shape: createShapeTypeChecker,
                    exact: createStrictShapeTypeChecker
                };
                function is(x3, y4) {
                    if (x3 === y4) {
                        return x3 !== 0 || 1 / x3 === 1 / y4;
                    } else {
                        return x3 !== x3 && y4 !== y4;
                    }
                }
                function PropTypeError(message, data) {
                    this.message = message;
                    this.data = data && typeof data === 'object' ? data : {};
                    this.stack = '';
                }
                PropTypeError.prototype = Error.prototype;
                function createChainableTypeChecker(validate) {
                    {
                        var manualPropTypeCallCache = {};
                        var manualPropTypeWarningCount = 0;
                    }
                    function checkType(
                        isRequired,
                        props3,
                        propName,
                        componentName,
                        location2,
                        propFullName,
                        secret
                    ) {
                        componentName = componentName || ANONYMOUS;
                        propFullName = propFullName || propName;
                        if (secret !== ReactPropTypesSecret) {
                            if (throwOnDirectAccess) {
                                var err = new Error(
                                    'Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types'
                                );
                                err.name = 'Invariant Violation';
                                throw err;
                            } else if (typeof console !== 'undefined') {
                                var cacheKey = componentName + ':' + propName;
                                if (
                                    !manualPropTypeCallCache[cacheKey] &&
                                    manualPropTypeWarningCount < 3
                                ) {
                                    printWarning(
                                        'You are manually calling a React.PropTypes validation function for the `' +
                                            propFullName +
                                            '` prop on `' +
                                            componentName +
                                            '`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details.'
                                    );
                                    manualPropTypeCallCache[cacheKey] = true;
                                    manualPropTypeWarningCount++;
                                }
                            }
                        }
                        if (props3[propName] == null) {
                            if (isRequired) {
                                if (props3[propName] === null) {
                                    return new PropTypeError(
                                        'The ' +
                                            location2 +
                                            ' `' +
                                            propFullName +
                                            '` is marked as required ' +
                                            ('in `' +
                                                componentName +
                                                '`, but its value is `null`.')
                                    );
                                }
                                return new PropTypeError(
                                    'The ' +
                                        location2 +
                                        ' `' +
                                        propFullName +
                                        '` is marked as required in ' +
                                        ('`' +
                                            componentName +
                                            '`, but its value is `undefined`.')
                                );
                            }
                            return null;
                        } else {
                            return validate(
                                props3,
                                propName,
                                componentName,
                                location2,
                                propFullName
                            );
                        }
                    }
                    var chainedCheckType = checkType.bind(null, false);
                    chainedCheckType.isRequired = checkType.bind(null, true);
                    return chainedCheckType;
                }
                function createPrimitiveTypeChecker(expectedType) {
                    function validate(
                        props3,
                        propName,
                        componentName,
                        location2,
                        propFullName,
                        secret
                    ) {
                        var propValue = props3[propName];
                        var propType = getPropType(propValue);
                        if (propType !== expectedType) {
                            var preciseType = getPreciseType(propValue);
                            return new PropTypeError(
                                'Invalid ' +
                                    location2 +
                                    ' `' +
                                    propFullName +
                                    '` of type ' +
                                    ('`' +
                                        preciseType +
                                        '` supplied to `' +
                                        componentName +
                                        '`, expected ') +
                                    ('`' + expectedType + '`.'),
                                { expectedType }
                            );
                        }
                        return null;
                    }
                    return createChainableTypeChecker(validate);
                }
                function createAnyTypeChecker() {
                    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
                }
                function createArrayOfTypeChecker(typeChecker) {
                    function validate(
                        props3,
                        propName,
                        componentName,
                        location2,
                        propFullName
                    ) {
                        if (typeof typeChecker !== 'function') {
                            return new PropTypeError(
                                'Property `' +
                                    propFullName +
                                    '` of component `' +
                                    componentName +
                                    '` has invalid PropType notation inside arrayOf.'
                            );
                        }
                        var propValue = props3[propName];
                        if (!Array.isArray(propValue)) {
                            var propType = getPropType(propValue);
                            return new PropTypeError(
                                'Invalid ' +
                                    location2 +
                                    ' `' +
                                    propFullName +
                                    '` of type ' +
                                    ('`' +
                                        propType +
                                        '` supplied to `' +
                                        componentName +
                                        '`, expected an array.')
                            );
                        }
                        for (var i4 = 0; i4 < propValue.length; i4++) {
                            var error = typeChecker(
                                propValue,
                                i4,
                                componentName,
                                location2,
                                propFullName + '[' + i4 + ']',
                                ReactPropTypesSecret
                            );
                            if (error instanceof Error) {
                                return error;
                            }
                        }
                        return null;
                    }
                    return createChainableTypeChecker(validate);
                }
                function createElementTypeChecker() {
                    function validate(
                        props3,
                        propName,
                        componentName,
                        location2,
                        propFullName
                    ) {
                        var propValue = props3[propName];
                        if (!isValidElement(propValue)) {
                            var propType = getPropType(propValue);
                            return new PropTypeError(
                                'Invalid ' +
                                    location2 +
                                    ' `' +
                                    propFullName +
                                    '` of type ' +
                                    ('`' +
                                        propType +
                                        '` supplied to `' +
                                        componentName +
                                        '`, expected a single ReactElement.')
                            );
                        }
                        return null;
                    }
                    return createChainableTypeChecker(validate);
                }
                function createElementTypeTypeChecker() {
                    function validate(
                        props3,
                        propName,
                        componentName,
                        location2,
                        propFullName
                    ) {
                        var propValue = props3[propName];
                        if (!ReactIs.isValidElementType(propValue)) {
                            var propType = getPropType(propValue);
                            return new PropTypeError(
                                'Invalid ' +
                                    location2 +
                                    ' `' +
                                    propFullName +
                                    '` of type ' +
                                    ('`' +
                                        propType +
                                        '` supplied to `' +
                                        componentName +
                                        '`, expected a single ReactElement type.')
                            );
                        }
                        return null;
                    }
                    return createChainableTypeChecker(validate);
                }
                function createInstanceTypeChecker(expectedClass) {
                    function validate(
                        props3,
                        propName,
                        componentName,
                        location2,
                        propFullName
                    ) {
                        if (!(props3[propName] instanceof expectedClass)) {
                            var expectedClassName = expectedClass.name || ANONYMOUS;
                            var actualClassName = getClassName(props3[propName]);
                            return new PropTypeError(
                                'Invalid ' +
                                    location2 +
                                    ' `' +
                                    propFullName +
                                    '` of type ' +
                                    ('`' +
                                        actualClassName +
                                        '` supplied to `' +
                                        componentName +
                                        '`, expected ') +
                                    ('instance of `' + expectedClassName + '`.')
                            );
                        }
                        return null;
                    }
                    return createChainableTypeChecker(validate);
                }
                function createEnumTypeChecker(expectedValues) {
                    if (!Array.isArray(expectedValues)) {
                        {
                            if (arguments.length > 1) {
                                printWarning(
                                    'Invalid arguments supplied to oneOf, expected an array, got ' +
                                        arguments.length +
                                        ' arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
                                );
                            } else {
                                printWarning(
                                    'Invalid argument supplied to oneOf, expected an array.'
                                );
                            }
                        }
                        return emptyFunctionThatReturnsNull;
                    }
                    function validate(
                        props3,
                        propName,
                        componentName,
                        location2,
                        propFullName
                    ) {
                        var propValue = props3[propName];
                        for (var i4 = 0; i4 < expectedValues.length; i4++) {
                            if (is(propValue, expectedValues[i4])) {
                                return null;
                            }
                        }
                        var valuesString = JSON.stringify(
                            expectedValues,
                            function replacer(key, value) {
                                var type = getPreciseType(value);
                                if (type === 'symbol') {
                                    return String(value);
                                }
                                return value;
                            }
                        );
                        return new PropTypeError(
                            'Invalid ' +
                                location2 +
                                ' `' +
                                propFullName +
                                '` of value `' +
                                String(propValue) +
                                '` ' +
                                ('supplied to `' +
                                    componentName +
                                    '`, expected one of ' +
                                    valuesString +
                                    '.')
                        );
                    }
                    return createChainableTypeChecker(validate);
                }
                function createObjectOfTypeChecker(typeChecker) {
                    function validate(
                        props3,
                        propName,
                        componentName,
                        location2,
                        propFullName
                    ) {
                        if (typeof typeChecker !== 'function') {
                            return new PropTypeError(
                                'Property `' +
                                    propFullName +
                                    '` of component `' +
                                    componentName +
                                    '` has invalid PropType notation inside objectOf.'
                            );
                        }
                        var propValue = props3[propName];
                        var propType = getPropType(propValue);
                        if (propType !== 'object') {
                            return new PropTypeError(
                                'Invalid ' +
                                    location2 +
                                    ' `' +
                                    propFullName +
                                    '` of type ' +
                                    ('`' +
                                        propType +
                                        '` supplied to `' +
                                        componentName +
                                        '`, expected an object.')
                            );
                        }
                        for (var key in propValue) {
                            if (has2(propValue, key)) {
                                var error = typeChecker(
                                    propValue,
                                    key,
                                    componentName,
                                    location2,
                                    propFullName + '.' + key,
                                    ReactPropTypesSecret
                                );
                                if (error instanceof Error) {
                                    return error;
                                }
                            }
                        }
                        return null;
                    }
                    return createChainableTypeChecker(validate);
                }
                function createUnionTypeChecker(arrayOfTypeCheckers) {
                    if (!Array.isArray(arrayOfTypeCheckers)) {
                        printWarning(
                                  'Invalid argument supplied to oneOfType, expected an instance of array.'
                              )
                            ;
                        return emptyFunctionThatReturnsNull;
                    }
                    for (var i4 = 0; i4 < arrayOfTypeCheckers.length; i4++) {
                        var checker = arrayOfTypeCheckers[i4];
                        if (typeof checker !== 'function') {
                            printWarning(
                                'Invalid argument supplied to oneOfType. Expected an array of check functions, but received ' +
                                    getPostfixForTypeWarning(checker) +
                                    ' at index ' +
                                    i4 +
                                    '.'
                            );
                            return emptyFunctionThatReturnsNull;
                        }
                    }
                    function validate(
                        props3,
                        propName,
                        componentName,
                        location2,
                        propFullName
                    ) {
                        var expectedTypes = [];
                        for (var i5 = 0; i5 < arrayOfTypeCheckers.length; i5++) {
                            var checker2 = arrayOfTypeCheckers[i5];
                            var checkerResult = checker2(
                                props3,
                                propName,
                                componentName,
                                location2,
                                propFullName,
                                ReactPropTypesSecret
                            );
                            if (checkerResult == null) {
                                return null;
                            }
                            if (
                                checkerResult.data &&
                                has2(checkerResult.data, 'expectedType')
                            ) {
                                expectedTypes.push(checkerResult.data.expectedType);
                            }
                        }
                        var expectedTypesMessage =
                            expectedTypes.length > 0
                                ? ', expected one of type [' +
                                  expectedTypes.join(', ') +
                                  ']'
                                : '';
                        return new PropTypeError(
                            'Invalid ' +
                                location2 +
                                ' `' +
                                propFullName +
                                '` supplied to ' +
                                ('`' +
                                    componentName +
                                    '`' +
                                    expectedTypesMessage +
                                    '.')
                        );
                    }
                    return createChainableTypeChecker(validate);
                }
                function createNodeChecker() {
                    function validate(
                        props3,
                        propName,
                        componentName,
                        location2,
                        propFullName
                    ) {
                        if (!isNode2(props3[propName])) {
                            return new PropTypeError(
                                'Invalid ' +
                                    location2 +
                                    ' `' +
                                    propFullName +
                                    '` supplied to ' +
                                    ('`' +
                                        componentName +
                                        '`, expected a ReactNode.')
                            );
                        }
                        return null;
                    }
                    return createChainableTypeChecker(validate);
                }
                function invalidValidatorError(
                    componentName,
                    location2,
                    propFullName,
                    key,
                    type
                ) {
                    return new PropTypeError(
                        (componentName || 'React class') +
                            ': ' +
                            location2 +
                            ' type `' +
                            propFullName +
                            '.' +
                            key +
                            '` is invalid; it must be a function, usually from the `prop-types` package, but received `' +
                            type +
                            '`.'
                    );
                }
                function createShapeTypeChecker(shapeTypes) {
                    function validate(
                        props3,
                        propName,
                        componentName,
                        location2,
                        propFullName
                    ) {
                        var propValue = props3[propName];
                        var propType = getPropType(propValue);
                        if (propType !== 'object') {
                            return new PropTypeError(
                                'Invalid ' +
                                    location2 +
                                    ' `' +
                                    propFullName +
                                    '` of type `' +
                                    propType +
                                    '` ' +
                                    ('supplied to `' +
                                        componentName +
                                        '`, expected `object`.')
                            );
                        }
                        for (var key in shapeTypes) {
                            var checker = shapeTypes[key];
                            if (typeof checker !== 'function') {
                                return invalidValidatorError(
                                    componentName,
                                    location2,
                                    propFullName,
                                    key,
                                    getPreciseType(checker)
                                );
                            }
                            var error = checker(
                                propValue,
                                key,
                                componentName,
                                location2,
                                propFullName + '.' + key,
                                ReactPropTypesSecret
                            );
                            if (error) {
                                return error;
                            }
                        }
                        return null;
                    }
                    return createChainableTypeChecker(validate);
                }
                function createStrictShapeTypeChecker(shapeTypes) {
                    function validate(
                        props3,
                        propName,
                        componentName,
                        location2,
                        propFullName
                    ) {
                        var propValue = props3[propName];
                        var propType = getPropType(propValue);
                        if (propType !== 'object') {
                            return new PropTypeError(
                                'Invalid ' +
                                    location2 +
                                    ' `' +
                                    propFullName +
                                    '` of type `' +
                                    propType +
                                    '` ' +
                                    ('supplied to `' +
                                        componentName +
                                        '`, expected `object`.')
                            );
                        }
                        var allKeys = assign({}, props3[propName], shapeTypes);
                        for (var key in allKeys) {
                            var checker = shapeTypes[key];
                            if (
                                has2(shapeTypes, key) &&
                                typeof checker !== 'function'
                            ) {
                                return invalidValidatorError(
                                    componentName,
                                    location2,
                                    propFullName,
                                    key,
                                    getPreciseType(checker)
                                );
                            }
                            if (!checker) {
                                return new PropTypeError(
                                    'Invalid ' +
                                        location2 +
                                        ' `' +
                                        propFullName +
                                        '` key `' +
                                        key +
                                        '` supplied to `' +
                                        componentName +
                                        '`.\nBad object: ' +
                                        JSON.stringify(
                                            props3[propName],
                                            null,
                                            '  '
                                        ) +
                                        '\nValid keys: ' +
                                        JSON.stringify(
                                            Object.keys(shapeTypes),
                                            null,
                                            '  '
                                        )
                                );
                            }
                            var error = checker(
                                propValue,
                                key,
                                componentName,
                                location2,
                                propFullName + '.' + key,
                                ReactPropTypesSecret
                            );
                            if (error) {
                                return error;
                            }
                        }
                        return null;
                    }
                    return createChainableTypeChecker(validate);
                }
                function isNode2(propValue) {
                    switch (typeof propValue) {
                        case 'number':
                        case 'string':
                        case 'undefined':
                            return true;
                        case 'boolean':
                            return !propValue;
                        case 'object':
                            if (Array.isArray(propValue)) {
                                return propValue.every(isNode2);
                            }
                            if (propValue === null || isValidElement(propValue)) {
                                return true;
                            }
                            var iteratorFn = getIteratorFn(propValue);
                            if (iteratorFn) {
                                var iterator = iteratorFn.call(propValue);
                                var step;
                                if (iteratorFn !== propValue.entries) {
                                    while (!(step = iterator.next()).done) {
                                        if (!isNode2(step.value)) {
                                            return false;
                                        }
                                    }
                                } else {
                                    while (!(step = iterator.next()).done) {
                                        var entry = step.value;
                                        if (entry) {
                                            if (!isNode2(entry[1])) {
                                                return false;
                                            }
                                        }
                                    }
                                }
                            } else {
                                return false;
                            }
                            return true;
                        default:
                            return false;
                    }
                }
                function isSymbol(propType, propValue) {
                    if (propType === 'symbol') {
                        return true;
                    }
                    if (!propValue) {
                        return false;
                    }
                    if (propValue['@@toStringTag'] === 'Symbol') {
                        return true;
                    }
                    if (
                        typeof Symbol === 'function' &&
                        propValue instanceof Symbol
                    ) {
                        return true;
                    }
                    return false;
                }
                function getPropType(propValue) {
                    var propType = typeof propValue;
                    if (Array.isArray(propValue)) {
                        return 'array';
                    }
                    if (propValue instanceof RegExp) {
                        return 'object';
                    }
                    if (isSymbol(propType, propValue)) {
                        return 'symbol';
                    }
                    return propType;
                }
                function getPreciseType(propValue) {
                    if (typeof propValue === 'undefined' || propValue === null) {
                        return '' + propValue;
                    }
                    var propType = getPropType(propValue);
                    if (propType === 'object') {
                        if (propValue instanceof Date) {
                            return 'date';
                        } else if (propValue instanceof RegExp) {
                            return 'regexp';
                        }
                    }
                    return propType;
                }
                function getPostfixForTypeWarning(value) {
                    var type = getPreciseType(value);
                    switch (type) {
                        case 'array':
                        case 'object':
                            return 'an ' + type;
                        case 'boolean':
                        case 'date':
                        case 'regexp':
                            return 'a ' + type;
                        default:
                            return type;
                    }
                }
                function getClassName(propValue) {
                    if (!propValue.constructor || !propValue.constructor.name) {
                        return ANONYMOUS;
                    }
                    return propValue.constructor.name;
                }
                ReactPropTypes.checkPropTypes = checkPropTypes;
                ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
                ReactPropTypes.PropTypes = ReactPropTypes;
                return ReactPropTypes;
            };
        }
    });
    var require_prop_types = __commonJS({
        'node_modules/prop-types/index.js'(exports, module) {
            {
                ReactIs = require_react_is();
                throwOnDirectAccess = true;
                module.exports = require_factoryWithTypeCheckers()(
                    ReactIs.isElement,
                    throwOnDirectAccess
                );
            }
            var ReactIs;
            var throwOnDirectAccess;
        }
    });
    var require_es = __commonJS({
        'node_modules/attr-accept/dist/es/index.js'(exports) {
            exports.__esModule = true;
            exports.default = function (file, acceptedFiles) {
                if (file && acceptedFiles) {
                    var acceptedFilesArray = Array.isArray(acceptedFiles)
                        ? acceptedFiles
                        : acceptedFiles.split(',');
                    if (acceptedFilesArray.length === 0) {
                        return true;
                    }
                    var fileName = file.name || '';
                    var mimeType = (file.type || '').toLowerCase();
                    var baseMimeType = mimeType.replace(/\/.*$/, '');
                    return acceptedFilesArray.some(function (type) {
                        var validType = type.trim().toLowerCase();
                        if (validType.charAt(0) === '.') {
                            return fileName.toLowerCase().endsWith(validType);
                        } else if (validType.endsWith('/*')) {
                            return baseMimeType === validType.replace(/\/.*$/, '');
                        }
                        return mimeType === validType;
                    });
                }
                return true;
            };
        }
    });
    var require_isobject = __commonJS({
        'node_modules/isobject/index.js'(exports, module) {
            module.exports = function isObject3(val) {
                return (
                    val != null &&
                    typeof val === 'object' &&
                    Array.isArray(val) === false
                );
            };
        }
    });
    var require_is_plain_object = __commonJS({
        'node_modules/is-plain-object/index.js'(exports, module) {
            var isObject3 = require_isobject();
            function isObjectObject(o4) {
                return (
                    isObject3(o4) === true &&
                    Object.prototype.toString.call(o4) === '[object Object]'
                );
            }
            module.exports = function isPlainObject(o4) {
                var ctor, prot;
                if (isObjectObject(o4) === false) return false;
                ctor = o4.constructor;
                if (typeof ctor !== 'function') return false;
                prot = ctor.prototype;
                if (isObjectObject(prot) === false) return false;
                if (prot.hasOwnProperty('isPrototypeOf') === false) {
                    return false;
                }
                return true;
            };
        }
    });
    var require_is_extendable = __commonJS({
        'node_modules/is-extendable/index.js'(exports, module) {
            var isPlainObject = require_is_plain_object();
            module.exports = function isExtendable(val) {
                return (
                    isPlainObject(val) ||
                    typeof val === 'function' ||
                    Array.isArray(val)
                );
            };
        }
    });
    var require_for_in = __commonJS({
        'node_modules/for-in/index.js'(exports, module) {
            module.exports = function forIn(obj, fn, thisArg) {
                for (var key in obj) {
                    if (fn.call(thisArg, obj[key], key, obj) === false) {
                        break;
                    }
                }
            };
        }
    });
    var require_mixin_deep = __commonJS({
        'node_modules/mixin-deep/index.js'(exports, module) {
            var isExtendable = require_is_extendable();
            var forIn = require_for_in();
            function mixinDeep(target, objects) {
                var len = arguments.length,
                    i4 = 0;
                while (++i4 < len) {
                    var obj = arguments[i4];
                    if (isObject3(obj)) {
                        forIn(obj, copy, target);
                    }
                }
                return target;
            }
            function copy(val, key) {
                if (!isValidKey(key)) {
                    return;
                }
                var obj = this[key];
                if (isObject3(val) && isObject3(obj)) {
                    mixinDeep(obj, val);
                } else {
                    this[key] = val;
                }
            }
            function isObject3(val) {
                return isExtendable(val) && !Array.isArray(val);
            }
            function isValidKey(key) {
                return (
                    key !== '__proto__' &&
                    key !== 'constructor' &&
                    key !== 'prototype'
                );
            }
            module.exports = mixinDeep;
        }
    });
    var require_get_value = __commonJS({
        'node_modules/get-value/index.js'(exports, module) {
            module.exports = function (obj, prop, a4, b4, c4) {
                if (!isObject3(obj) || !prop) {
                    return obj;
                }
                prop = toString(prop);
                if (a4) prop += '.' + toString(a4);
                if (b4) prop += '.' + toString(b4);
                if (c4) prop += '.' + toString(c4);
                if (prop in obj) {
                    return obj[prop];
                }
                var segs = prop.split('.');
                var len = segs.length;
                var i4 = -1;
                while (obj && ++i4 < len) {
                    var key = segs[i4];
                    while (key[key.length - 1] === '\\') {
                        key = key.slice(0, -1) + '.' + segs[++i4];
                    }
                    obj = obj[key];
                }
                return obj;
            };
            function isObject3(val) {
                return (
                    val !== null &&
                    (typeof val === 'object' || typeof val === 'function')
                );
            }
            function toString(val) {
                if (!val) return '';
                if (Array.isArray(val)) {
                    return val.join('.');
                }
                return val;
            }
        }
    });
    var require_extend_shallow = __commonJS({
        'node_modules/extend-shallow/index.js'(exports, module) {
            var isObject3 = require_is_extendable();
            module.exports = function extend(o4) {
                if (!isObject3(o4)) {
                    o4 = {};
                }
                var len = arguments.length;
                for (var i4 = 1; i4 < len; i4++) {
                    var obj = arguments[i4];
                    if (isObject3(obj)) {
                        assign(o4, obj);
                    }
                }
                return o4;
            };
            function assign(a4, b4) {
                for (var key in b4) {
                    if (hasOwn(b4, key)) {
                        a4[key] = b4[key];
                    }
                }
            }
            function hasOwn(obj, key) {
                return Object.prototype.hasOwnProperty.call(obj, key);
            }
        }
    });
    var require_split_string = __commonJS({
        'node_modules/split-string/index.js'(exports, module) {
            var extend = require_extend_shallow();
            module.exports = function (str, options, fn) {
                if (typeof str !== 'string') {
                    throw new TypeError('expected a string');
                }
                if (typeof options === 'function') {
                    fn = options;
                    options = null;
                }
                if (typeof options === 'string') {
                    options = { sep: options };
                }
                var opts = extend({ sep: '.' }, options);
                var quotes = opts.quotes || ['"', "'", '`'];
                var brackets;
                if (opts.brackets === true) {
                    brackets = { '<': '>', '(': ')', '[': ']', '{': '}' };
                } else if (opts.brackets) {
                    brackets = opts.brackets;
                }
                var tokens = [];
                var stack = [];
                var arr = [''];
                var sep = opts.sep;
                var len = str.length;
                var idx = -1;
                var closeIdx;
                function expected() {
                    if (brackets && stack.length) {
                        return brackets[stack[stack.length - 1]];
                    }
                }
                while (++idx < len) {
                    var ch = str[idx];
                    var next = str[idx + 1];
                    var tok = { val: ch, idx, arr, str };
                    tokens.push(tok);
                    if (ch === '\\') {
                        tok.val =
                            keepEscaping(opts, str, idx) === true
                                ? ch + next
                                : next;
                        tok.escaped = true;
                        if (typeof fn === 'function') {
                            fn(tok);
                        }
                        arr[arr.length - 1] += tok.val;
                        idx++;
                        continue;
                    }
                    if (brackets && brackets[ch]) {
                        stack.push(ch);
                        var e4 = expected();
                        var i4 = idx + 1;
                        if (str.indexOf(e4, i4 + 1) !== -1) {
                            while (stack.length && i4 < len) {
                                var s4 = str[++i4];
                                if (s4 === '\\') {
                                    s4++;
                                    continue;
                                }
                                if (quotes.indexOf(s4) !== -1) {
                                    i4 = getClosingQuote(str, s4, i4 + 1);
                                    continue;
                                }
                                e4 = expected();
                                if (
                                    stack.length &&
                                    str.indexOf(e4, i4 + 1) === -1
                                ) {
                                    break;
                                }
                                if (brackets[s4]) {
                                    stack.push(s4);
                                    continue;
                                }
                                if (e4 === s4) {
                                    stack.pop();
                                }
                            }
                        }
                        closeIdx = i4;
                        if (closeIdx === -1) {
                            arr[arr.length - 1] += ch;
                            continue;
                        }
                        ch = str.slice(idx, closeIdx + 1);
                        tok.val = ch;
                        tok.idx = idx = closeIdx;
                    }
                    if (quotes.indexOf(ch) !== -1) {
                        closeIdx = getClosingQuote(str, ch, idx + 1);
                        if (closeIdx === -1) {
                            arr[arr.length - 1] += ch;
                            continue;
                        }
                        if (keepQuotes(ch, opts) === true) {
                            ch = str.slice(idx, closeIdx + 1);
                        } else {
                            ch = str.slice(idx + 1, closeIdx);
                        }
                        tok.val = ch;
                        tok.idx = idx = closeIdx;
                    }
                    if (typeof fn === 'function') {
                        fn(tok, tokens);
                        ch = tok.val;
                        idx = tok.idx;
                    }
                    if (tok.val === sep && tok.split !== false) {
                        arr.push('');
                        continue;
                    }
                    arr[arr.length - 1] += tok.val;
                }
                return arr;
            };
            function getClosingQuote(str, ch, i4, brackets) {
                var idx = str.indexOf(ch, i4);
                if (str.charAt(idx - 1) === '\\') {
                    return getClosingQuote(str, ch, idx + 1);
                }
                return idx;
            }
            function keepQuotes(ch, opts) {
                if (opts.keepDoubleQuotes === true && ch === '"') return true;
                if (opts.keepSingleQuotes === true && ch === "'") return true;
                return opts.keepQuotes;
            }
            function keepEscaping(opts, str, idx) {
                if (typeof opts.keepEscaping === 'function') {
                    return opts.keepEscaping(str, idx);
                }
                return opts.keepEscaping === true || str[idx + 1] === '\\';
            }
        }
    });
    var require_set_value = __commonJS({
        'node_modules/set-value/index.js'(exports, module) {
            var split2 = require_split_string();
            var extend = require_extend_shallow();
            var isPlainObject = require_is_plain_object();
            var isObject3 = require_is_extendable();
            module.exports = function (obj, prop, val) {
                if (!isObject3(obj)) {
                    return obj;
                }
                if (Array.isArray(prop)) {
                    prop = [].concat.apply([], prop).join('.');
                }
                if (typeof prop !== 'string') {
                    return obj;
                }
                var keys = split2(prop, { sep: '.', brackets: true }).filter(
                    isValidKey
                );
                var len = keys.length;
                var idx = -1;
                var current = obj;
                while (++idx < len) {
                    var key = keys[idx];
                    if (idx !== len - 1) {
                        if (!isObject3(current[key])) {
                            current[key] = {};
                        }
                        current = current[key];
                        continue;
                    }
                    if (isPlainObject(current[key]) && isPlainObject(val)) {
                        current[key] = extend({}, current[key], val);
                    } else {
                        current[key] = val;
                    }
                }
                return obj;
            };
            function isValidKey(key) {
                return (
                    key !== '__proto__' &&
                    key !== 'constructor' &&
                    key !== 'prototype'
                );
            }
        }
    });
    var require_merge_value = __commonJS({
        'node_modules/merge-value/index.js'(exports, module) {
            var isObject3 = require_is_extendable();
            var merge2 = require_mixin_deep();
            var get = require_get_value();
            var set = require_set_value();
            module.exports = function mergeValue(obj, prop, value) {
                if (!isObject3(obj)) {
                    throw new TypeError('expected an object');
                }
                if (typeof prop !== 'string' || value == null) {
                    return merge2.apply(null, arguments);
                }
                if (typeof value === 'string') {
                    set(obj, prop, value);
                    return obj;
                }
                var current = get(obj, prop);
                if (isObject3(value) && isObject3(current)) {
                    value = merge2({}, current, value);
                }
                set(obj, prop, value);
                return obj;
            };
        }
    });
    function _extends() {
        return (
            (_extends = Object.assign
                ? Object.assign.bind()
                : function (n4) {
                      for (var e4 = 1; e4 < arguments.length; e4++) {
                          var t4 = arguments[e4];
                          for (var r4 in t4)
                              ({}).hasOwnProperty.call(t4, r4) && (n4[r4] = t4[r4]);
                      }
                      return n4;
                  }),
            _extends.apply(null, arguments)
        );
    }
    function $6ed0406888f73fc4$var$setRef(ref, value) {
        if (typeof ref === 'function') ref(value);
        else if (ref !== null && ref !== void 0) ref.current = value;
    }
    function $6ed0406888f73fc4$export$43e446d32b3d21af(...refs) {
        return (node) =>
            refs.forEach((ref) => $6ed0406888f73fc4$var$setRef(ref, node));
    }
    function $6ed0406888f73fc4$export$c7b2cbe3552a0d05(...refs) {
        return React5.useCallback(
            $6ed0406888f73fc4$export$43e446d32b3d21af(...refs),
            refs
        );
    }
    var $5e63c961fc1ce211$export$8c6ed5c666ac1360 = React5.forwardRef(
        (props3, forwardedRef) => {
            const { children, ...slotProps } = props3;
            const childrenArray = React5.Children.toArray(children);
            const slottable = childrenArray.find($5e63c961fc1ce211$var$isSlottable);
            if (slottable) {
                const newElement = slottable.props.children;
                const newChildren = childrenArray.map((child) => {
                    if (child === slottable) {
                        if (React5.Children.count(newElement) > 1)
                            return React5.Children.only(null);
                        return React5.isValidElement(newElement)
                            ? newElement.props.children
                            : null;
                    } else return child;
                });
                return React5.createElement(
                    $5e63c961fc1ce211$var$SlotClone,
                    _extends({}, slotProps, { ref: forwardedRef }),
                    React5.isValidElement(newElement)
                        ? React5.cloneElement(newElement, void 0, newChildren)
                        : null
                );
            }
            return React5.createElement(
                $5e63c961fc1ce211$var$SlotClone,
                _extends({}, slotProps, { ref: forwardedRef }),
                children
            );
        }
    );
    $5e63c961fc1ce211$export$8c6ed5c666ac1360.displayName = 'Slot';
    var $5e63c961fc1ce211$var$SlotClone = React5.forwardRef(
        (props3, forwardedRef) => {
            const { children, ...slotProps } = props3;
            if (React5.isValidElement(children))
                return React5.cloneElement(children, {
                    ...$5e63c961fc1ce211$var$mergeProps(slotProps, children.props),
                    ref: $6ed0406888f73fc4$export$43e446d32b3d21af(
                        forwardedRef,
                        children.ref
                    )
                });
            return React5.Children.count(children) > 1
                ? React5.Children.only(null)
                : null;
        }
    );
    $5e63c961fc1ce211$var$SlotClone.displayName = 'SlotClone';
    var $5e63c961fc1ce211$export$d9f1ccf0bdb05d45 = ({ children }) => {
        return React5.createElement(React5.Fragment, null, children);
    };
    function $5e63c961fc1ce211$var$isSlottable(child) {
        return (
            React5.isValidElement(child) &&
            child.type === $5e63c961fc1ce211$export$d9f1ccf0bdb05d45
        );
    }
    function $5e63c961fc1ce211$var$mergeProps(slotProps, childProps) {
        const overrideProps = { ...childProps };
        for (const propName in childProps) {
            const slotPropValue = slotProps[propName];
            const childPropValue = childProps[propName];
            const isHandler = /^on[A-Z]/.test(propName);
            if (isHandler) {
                if (slotPropValue && childPropValue)
                    overrideProps[propName] = (...args) => {
                        childPropValue(...args);
                        slotPropValue(...args);
                    };
                else if (slotPropValue) overrideProps[propName] = slotPropValue;
            } else if (propName === 'style')
                overrideProps[propName] = { ...slotPropValue, ...childPropValue };
            else if (propName === 'className')
                overrideProps[propName] = [slotPropValue, childPropValue]
                    .filter(Boolean)
                    .join(' ');
        }
        return { ...slotProps, ...overrideProps };
    }
    var $8927f6f2acc4f386$var$NODES = [
        'a',
        'button',
        'div',
        'form',
        'h2',
        'h3',
        'img',
        'input',
        'label',
        'li',
        'nav',
        'ol',
        'p',
        'span',
        'svg',
        'ul'
    ];
    var $8927f6f2acc4f386$export$250ffa63cdc0d034 =
        $8927f6f2acc4f386$var$NODES.reduce((primitive, node) => {
            const Node = React5.forwardRef((props3, forwardedRef) => {
                const { asChild, ...primitiveProps } = props3;
                const Comp = asChild
                    ? $5e63c961fc1ce211$export$8c6ed5c666ac1360
                    : node;
                React5.useEffect(() => {
                    window[Symbol.for('radix-ui')] = true;
                }, []);
                return React5.createElement(
                    Comp,
                    _extends({}, primitiveProps, { ref: forwardedRef })
                );
            });
            Node.displayName = `Primitive.${node}`;
            return { ...primitive, [node]: Node };
        }, {});
    function $8927f6f2acc4f386$export$6d1a0317bde7de7f(target, event) {
        if (target) $7SXl2$reactdom.flushSync(() => target.dispatchEvent(event));
    }
    var $f1701beae083dbae$export$602eac185826482c = React5.forwardRef(
        (props3, forwardedRef) => {
            var _globalThis$document;
            const {
                container = globalThis === null || globalThis === void 0
                    ? void 0
                    : (_globalThis$document = globalThis.document) === null ||
                        _globalThis$document === void 0
                      ? void 0
                      : _globalThis$document.body,
                ...portalProps
            } = props3;
            return container
                ? $7SXl2$reactdom.createPortal(
                      React5.createElement(
                          $8927f6f2acc4f386$export$250ffa63cdc0d034.div,
                          _extends({}, portalProps, { ref: forwardedRef })
                      ),
                      container
                  )
                : null;
        }
    );
    var $f1701beae083dbae$export$be92b6f5f03c0fe9 =
        $f1701beae083dbae$export$602eac185826482c;
    var has = Object.prototype.hasOwnProperty;
    function dequal(foo, bar) {
        var ctor, len;
        if (foo === bar) return true;
        if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
            if (ctor === Date) return foo.getTime() === bar.getTime();
            if (ctor === RegExp) return foo.toString() === bar.toString();
            if (ctor === Array) {
                if ((len = foo.length) === bar.length) {
                    while (len-- && dequal(foo[len], bar[len]));
                }
                return len === -1;
            }
            if (!ctor || typeof foo === 'object') {
                len = 0;
                for (ctor in foo) {
                    if (has.call(foo, ctor) && ++len && !has.call(bar, ctor))
                        return false;
                    if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor]))
                        return false;
                }
                return Object.keys(bar).length === len;
            }
        }
        return foo !== foo && bar !== bar;
    }
    function shallow(objA, objB) {
        if (Object.is(objA, objB)) {
            return true;
        }
        if (
            typeof objA !== 'object' ||
            objA === null ||
            typeof objB !== 'object' ||
            objB === null
        ) {
            return false;
        }
        const keysA = Object.keys(objA);
        if (keysA.length !== Object.keys(objB).length) {
            return false;
        }
        for (let i4 = 0; i4 < keysA.length; i4++) {
            if (
                !Object.prototype.hasOwnProperty.call(objB, keysA[i4]) ||
                !Object.is(objA[keysA[i4]], objB[keysA[i4]])
            ) {
                return false;
            }
        }
        return true;
    }
    var Rule = function Rule2(name, fn, args, modifiers) {
        this.name = name;
        this.fn = fn;
        this.args = args;
        this.modifiers = modifiers;
    };
    Rule.prototype._test = function _test(value) {
        var fn = this.fn;
        try {
            testAux(this.modifiers.slice(), fn, this)(value);
        } catch (ex) {
            fn = function () {
                return false;
            };
        }
        try {
            return testAux(this.modifiers.slice(), fn, this)(value);
        } catch (ex$1) {
            return false;
        }
    };
    Rule.prototype._check = function _check(value) {
        try {
            testAux(this.modifiers.slice(), this.fn, this)(value);
        } catch (ex) {
            if (
                testAux(
                    this.modifiers.slice(),
                    function (it) {
                        return it;
                    },
                    this
                )(false)
            ) {
                return;
            }
        }
        if (!testAux(this.modifiers.slice(), this.fn, this)(value)) {
            throw null;
        }
    };
    Rule.prototype._testAsync = function _testAsync(value) {
        var this$1$1 = this;
        return new Promise(function (resolve, reject) {
            testAsyncAux(
                this$1$1.modifiers.slice(),
                this$1$1.fn,
                this$1$1
            )(value)
                .then(function (valid) {
                    if (valid) {
                        resolve(value);
                    } else {
                        reject(null);
                    }
                })
                .catch(function (ex) {
                    return reject(ex);
                });
        });
    };
    function pickFn(fn, variant) {
        if (variant === void 0) variant = 'simple';
        return typeof fn === 'object' ? fn[variant] : fn;
    }
    function testAux(modifiers, fn, rule) {
        if (modifiers.length) {
            var modifier = modifiers.shift();
            var nextFn = testAux(modifiers, fn, rule);
            return modifier.perform(nextFn, rule);
        } else {
            return pickFn(fn);
        }
    }
    function testAsyncAux(modifiers, fn, rule) {
        if (modifiers.length) {
            var modifier = modifiers.shift();
            var nextFn = testAsyncAux(modifiers, fn, rule);
            return modifier.performAsync(nextFn, rule);
        } else {
            return function (value) {
                return Promise.resolve(pickFn(fn, 'async')(value));
            };
        }
    }
    var Modifier = function Modifier2(name, perform, performAsync) {
        this.name = name;
        this.perform = perform;
        this.performAsync = performAsync;
    };
    var ValidationError = (function (Error2) {
        function ValidationError2(rule, value, cause, target) {
            var remaining = [],
                len = arguments.length - 4;
            while (len-- > 0) remaining[len] = arguments[len + 4];
            Error2.call(this, remaining);
            if (Error2.captureStackTrace) {
                Error2.captureStackTrace(this, ValidationError2);
            }
            this.rule = rule;
            this.value = value;
            this.cause = cause;
            this.target = target;
        }
        if (Error2) ValidationError2.__proto__ = Error2;
        ValidationError2.prototype = Object.create(Error2 && Error2.prototype);
        ValidationError2.prototype.constructor = ValidationError2;
        return ValidationError2;
    })(Error);
    var Context = function Context2(chain, nextRuleModifiers) {
        if (chain === void 0) chain = [];
        if (nextRuleModifiers === void 0) nextRuleModifiers = [];
        this.chain = chain;
        this.nextRuleModifiers = nextRuleModifiers;
    };
    Context.prototype._applyRule = function _applyRule(ruleFn, name) {
        var this$1$1 = this;
        return function () {
            var args = [],
                len = arguments.length;
            while (len--) args[len] = arguments[len];
            this$1$1.chain.push(
                new Rule(
                    name,
                    ruleFn.apply(this$1$1, args),
                    args,
                    this$1$1.nextRuleModifiers
                )
            );
            this$1$1.nextRuleModifiers = [];
            return this$1$1;
        };
    };
    Context.prototype._applyModifier = function _applyModifier(modifier, name) {
        this.nextRuleModifiers.push(
            new Modifier(name, modifier.simple, modifier.async)
        );
        return this;
    };
    Context.prototype._clone = function _clone() {
        return new Context(this.chain.slice(), this.nextRuleModifiers.slice());
    };
    Context.prototype.test = function test(value) {
        return this.chain.every(function (rule) {
            return rule._test(value);
        });
    };
    Context.prototype.testAll = function testAll(value) {
        var err = [];
        this.chain.forEach(function (rule) {
            try {
                rule._check(value);
            } catch (ex) {
                err.push(new ValidationError(rule, value, ex));
            }
        });
        return err;
    };
    Context.prototype.check = function check(value) {
        this.chain.forEach(function (rule) {
            try {
                rule._check(value);
            } catch (ex) {
                throw new ValidationError(rule, value, ex);
            }
        });
    };
    Context.prototype.testAsync = function testAsync(value) {
        var this$1$1 = this;
        return new Promise(function (resolve, reject) {
            executeAsyncRules(value, this$1$1.chain.slice(), resolve, reject);
        });
    };
    function executeAsyncRules(value, rules, resolve, reject) {
        if (rules.length) {
            var rule = rules.shift();
            rule._testAsync(value).then(
                function () {
                    executeAsyncRules(value, rules, resolve, reject);
                },
                function (cause) {
                    reject(new ValidationError(rule, value, cause));
                }
            );
        } else {
            resolve(value);
        }
    }
    var consideredEmpty = function (value, considerTrimmedEmptyString) {
        if (
            considerTrimmedEmptyString &&
            typeof value === 'string' &&
            value.trim().length === 0
        ) {
            return true;
        }
        return value === void 0 || value === null;
    };
    function optional(validation, considerTrimmedEmptyString) {
        if (considerTrimmedEmptyString === void 0)
            considerTrimmedEmptyString = false;
        return {
            simple: function (value) {
                return (
                    consideredEmpty(value, considerTrimmedEmptyString) ||
                    validation.check(value) === void 0
                );
            },
            async: function (value) {
                return (
                    consideredEmpty(value, considerTrimmedEmptyString) ||
                    validation.testAsync(value)
                );
            }
        };
    }
    function v8n() {
        return typeof Proxy !== 'undefined'
            ? proxyContext(new Context())
            : proxylessContext(new Context());
    }
    var customRules = {};
    v8n.extend = function (newRules) {
        Object.assign(customRules, newRules);
    };
    v8n.clearCustomRules = function () {
        customRules = {};
    };
    function proxyContext(context) {
        return new Proxy(context, {
            get: function get(obj, prop) {
                if (prop in obj) {
                    return obj[prop];
                }
                var newContext = proxyContext(context._clone());
                if (prop in availableModifiers) {
                    return newContext._applyModifier(
                        availableModifiers[prop],
                        prop
                    );
                }
                if (prop in customRules) {
                    return newContext._applyRule(customRules[prop], prop);
                }
                if (prop in availableRules) {
                    return newContext._applyRule(availableRules[prop], prop);
                }
            }
        });
    }
    function proxylessContext(context) {
        var addRuleSet = function (ruleSet, targetContext) {
            Object.keys(ruleSet).forEach(function (prop) {
                targetContext[prop] = function () {
                    var args = [],
                        len = arguments.length;
                    while (len--) args[len] = arguments[len];
                    var newContext = proxylessContext(targetContext._clone());
                    var contextWithRuleApplied = newContext
                        ._applyRule(ruleSet[prop], prop)
                        .apply(void 0, args);
                    return contextWithRuleApplied;
                };
            });
            return targetContext;
        };
        var contextWithAvailableRules = addRuleSet(availableRules, context);
        var contextWithAllRules = addRuleSet(
            customRules,
            contextWithAvailableRules
        );
        Object.keys(availableModifiers).forEach(function (prop) {
            Object.defineProperty(contextWithAllRules, prop, {
                get: function () {
                    var newContext = proxylessContext(contextWithAllRules._clone());
                    return newContext._applyModifier(
                        availableModifiers[prop],
                        prop
                    );
                }
            });
        });
        return contextWithAllRules;
    }
    var availableModifiers = {
        not: {
            simple: function (fn) {
                return function (value) {
                    return !fn(value);
                };
            },
            async: function (fn) {
                return function (value) {
                    return Promise.resolve(fn(value))
                        .then(function (result) {
                            return !result;
                        })
                        .catch(function () {
                            return true;
                        });
                };
            }
        },
        some: {
            simple: function (fn) {
                return function (value) {
                    return split(value).some(function (item) {
                        try {
                            return fn(item);
                        } catch (ex) {
                            return false;
                        }
                    });
                };
            },
            async: function (fn) {
                return function (value) {
                    return Promise.all(
                        split(value).map(function (item) {
                            try {
                                return fn(item).catch(function () {
                                    return false;
                                });
                            } catch (ex) {
                                return false;
                            }
                        })
                    ).then(function (result) {
                        return result.some(Boolean);
                    });
                };
            }
        },
        every: {
            simple: function (fn) {
                return function (value) {
                    return value !== false && split(value).every(fn);
                };
            },
            async: function (fn) {
                return function (value) {
                    return Promise.all(split(value).map(fn)).then(
                        function (result) {
                            return result.every(Boolean);
                        }
                    );
                };
            }
        },
        strict: {
            simple: function (fn, rule) {
                return function (value) {
                    if (isSchemaRule(rule) && value && typeof value === 'object') {
                        return (
                            Object.keys(rule.args[0]).length ===
                                Object.keys(value).length && fn(value)
                        );
                    }
                    return fn(value);
                };
            },
            async: function (fn, rule) {
                return function (value) {
                    return Promise.resolve(fn(value))
                        .then(function (result) {
                            if (
                                isSchemaRule(rule) &&
                                value &&
                                typeof value === 'object'
                            ) {
                                return (
                                    Object.keys(rule.args[0]).length ===
                                        Object.keys(value).length && result
                                );
                            }
                            return result;
                        })
                        .catch(function () {
                            return false;
                        });
                };
            }
        }
    };
    function isSchemaRule(rule) {
        return (
            rule &&
            rule.name === 'schema' &&
            rule.args.length > 0 &&
            typeof rule.args[0] === 'object'
        );
    }
    function split(value) {
        if (typeof value === 'string') {
            return value.split('');
        }
        return value;
    }
    var availableRules = {
        equal: function (expected) {
            return function (value) {
                return value == expected;
            };
        },
        exact: function (expected) {
            return function (value) {
                return value === expected;
            };
        },
        number: function (allowInfinite) {
            if (allowInfinite === void 0) allowInfinite = true;
            return function (value) {
                return (
                    typeof value === 'number' && (allowInfinite || isFinite(value))
                );
            };
        },
        integer: function () {
            return function (value) {
                var isInteger = Number.isInteger || isIntegerPolyfill;
                return isInteger(value);
            };
        },
        numeric: function () {
            return function (value) {
                return !isNaN(parseFloat(value)) && isFinite(value);
            };
        },
        string: function () {
            return testType('string');
        },
        boolean: function () {
            return testType('boolean');
        },
        undefined: function () {
            return testType('undefined');
        },
        null: function () {
            return testType('null');
        },
        array: function () {
            return testType('array');
        },
        object: function () {
            return testType('object');
        },
        instanceOf: function (instance) {
            return function (value) {
                return value instanceof instance;
            };
        },
        pattern: function (expected) {
            return function (value) {
                return expected.test(value);
            };
        },
        lowercase: function () {
            return function (value) {
                return (
                    typeof value === 'boolean' ||
                    (value === value.toLowerCase() && value.trim() !== '')
                );
            };
        },
        uppercase: function () {
            return function (value) {
                return value === value.toUpperCase() && value.trim() !== '';
            };
        },
        vowel: function () {
            return function (value) {
                return /^[aeiou]+$/i.test(value);
            };
        },
        consonant: function () {
            return function (value) {
                return /^(?=[^aeiou])([a-z]+)$/i.test(value);
            };
        },
        first: function (expected) {
            return function (value) {
                return value[0] == expected;
            };
        },
        last: function (expected) {
            return function (value) {
                return value[value.length - 1] == expected;
            };
        },
        empty: function () {
            return function (value) {
                return value.length === 0;
            };
        },
        length: function (min3, max3) {
            return function (value) {
                return value.length >= min3 && value.length <= (max3 || min3);
            };
        },
        minLength: function (min3) {
            return function (value) {
                return value.length >= min3;
            };
        },
        maxLength: function (max3) {
            return function (value) {
                return value.length <= max3;
            };
        },
        negative: function () {
            return function (value) {
                return value < 0;
            };
        },
        positive: function () {
            return function (value) {
                return value >= 0;
            };
        },
        between: function (a4, b4) {
            return function (value) {
                return value >= a4 && value <= b4;
            };
        },
        range: function (a4, b4) {
            return function (value) {
                return value >= a4 && value <= b4;
            };
        },
        lessThan: function (n4) {
            return function (value) {
                return value < n4;
            };
        },
        lessThanOrEqual: function (n4) {
            return function (value) {
                return value <= n4;
            };
        },
        greaterThan: function (n4) {
            return function (value) {
                return value > n4;
            };
        },
        greaterThanOrEqual: function (n4) {
            return function (value) {
                return value >= n4;
            };
        },
        even: function () {
            return function (value) {
                return value % 2 === 0;
            };
        },
        odd: function () {
            return function (value) {
                return value % 2 !== 0;
            };
        },
        includes: function (expected) {
            return function (value) {
                return ~value.indexOf(expected);
            };
        },
        schema: function (schema3) {
            return testSchema(schema3);
        },
        passesAnyOf: function () {
            var validations = [],
                len = arguments.length;
            while (len--) validations[len] = arguments[len];
            return function (value) {
                return validations.some(function (validation) {
                    return validation.test(value);
                });
            };
        },
        optional
    };
    function testType(expected) {
        return function (value) {
            return (
                (Array.isArray(value) && expected === 'array') ||
                (value === null && expected === 'null') ||
                typeof value === expected
            );
        };
    }
    function isIntegerPolyfill(value) {
        return (
            typeof value === 'number' &&
            isFinite(value) &&
            Math.floor(value) === value
        );
    }
    function testSchema(schema3) {
        return {
            simple: function (value) {
                var causes = [];
                Object.keys(schema3).forEach(function (key) {
                    var nestedValidation = schema3[key];
                    try {
                        nestedValidation.check((value || {})[key]);
                    } catch (ex) {
                        ex.target = key;
                        causes.push(ex);
                    }
                });
                if (causes.length > 0) {
                    throw causes;
                }
                return true;
            },
            async: function (value) {
                var causes = [];
                var nested = Object.keys(schema3).map(function (key) {
                    var nestedValidation = schema3[key];
                    return nestedValidation
                        .testAsync((value || {})[key])
                        .catch(function (ex) {
                            ex.target = key;
                            causes.push(ex);
                        });
                });
                return Promise.all(nested).then(function () {
                    if (causes.length > 0) {
                        throw causes;
                    }
                    return true;
                });
            }
        };
    }
    var v8n_esm_default = v8n;
    var e = 'colors';
    var t = 'sizes';
    var r = 'space';
    var n = {
        gap: r,
        gridGap: r,
        columnGap: r,
        gridColumnGap: r,
        rowGap: r,
        gridRowGap: r,
        inset: r,
        insetBlock: r,
        insetBlockEnd: r,
        insetBlockStart: r,
        insetInline: r,
        insetInlineEnd: r,
        insetInlineStart: r,
        margin: r,
        marginTop: r,
        marginRight: r,
        marginBottom: r,
        marginLeft: r,
        marginBlock: r,
        marginBlockEnd: r,
        marginBlockStart: r,
        marginInline: r,
        marginInlineEnd: r,
        marginInlineStart: r,
        padding: r,
        paddingTop: r,
        paddingRight: r,
        paddingBottom: r,
        paddingLeft: r,
        paddingBlock: r,
        paddingBlockEnd: r,
        paddingBlockStart: r,
        paddingInline: r,
        paddingInlineEnd: r,
        paddingInlineStart: r,
        top: r,
        right: r,
        bottom: r,
        left: r,
        scrollMargin: r,
        scrollMarginTop: r,
        scrollMarginRight: r,
        scrollMarginBottom: r,
        scrollMarginLeft: r,
        scrollMarginX: r,
        scrollMarginY: r,
        scrollMarginBlock: r,
        scrollMarginBlockEnd: r,
        scrollMarginBlockStart: r,
        scrollMarginInline: r,
        scrollMarginInlineEnd: r,
        scrollMarginInlineStart: r,
        scrollPadding: r,
        scrollPaddingTop: r,
        scrollPaddingRight: r,
        scrollPaddingBottom: r,
        scrollPaddingLeft: r,
        scrollPaddingX: r,
        scrollPaddingY: r,
        scrollPaddingBlock: r,
        scrollPaddingBlockEnd: r,
        scrollPaddingBlockStart: r,
        scrollPaddingInline: r,
        scrollPaddingInlineEnd: r,
        scrollPaddingInlineStart: r,
        fontSize: 'fontSizes',
        background: e,
        backgroundColor: e,
        backgroundImage: e,
        borderImage: e,
        border: e,
        borderBlock: e,
        borderBlockEnd: e,
        borderBlockStart: e,
        borderBottom: e,
        borderBottomColor: e,
        borderColor: e,
        borderInline: e,
        borderInlineEnd: e,
        borderInlineStart: e,
        borderLeft: e,
        borderLeftColor: e,
        borderRight: e,
        borderRightColor: e,
        borderTop: e,
        borderTopColor: e,
        caretColor: e,
        color: e,
        columnRuleColor: e,
        fill: e,
        outline: e,
        outlineColor: e,
        stroke: e,
        textDecorationColor: e,
        fontFamily: 'fonts',
        fontWeight: 'fontWeights',
        lineHeight: 'lineHeights',
        letterSpacing: 'letterSpacings',
        blockSize: t,
        minBlockSize: t,
        maxBlockSize: t,
        inlineSize: t,
        minInlineSize: t,
        maxInlineSize: t,
        width: t,
        minWidth: t,
        maxWidth: t,
        height: t,
        minHeight: t,
        maxHeight: t,
        flexBasis: t,
        gridTemplateColumns: t,
        gridTemplateRows: t,
        borderWidth: 'borderWidths',
        borderTopWidth: 'borderWidths',
        borderRightWidth: 'borderWidths',
        borderBottomWidth: 'borderWidths',
        borderLeftWidth: 'borderWidths',
        borderStyle: 'borderStyles',
        borderTopStyle: 'borderStyles',
        borderRightStyle: 'borderStyles',
        borderBottomStyle: 'borderStyles',
        borderLeftStyle: 'borderStyles',
        borderRadius: 'radii',
        borderTopLeftRadius: 'radii',
        borderTopRightRadius: 'radii',
        borderBottomRightRadius: 'radii',
        borderBottomLeftRadius: 'radii',
        boxShadow: 'shadows',
        textShadow: 'shadows',
        transition: 'transitions',
        zIndex: 'zIndices'
    };
    var i = (e4, t4) =>
        'function' == typeof t4
            ? { '()': Function.prototype.toString.call(t4) }
            : t4;
    var o = () => {
        const e4 = Object.create(null);
        return (t4, r4, ...n4) => {
            const o4 = ((e5) => JSON.stringify(e5, i))(t4);
            return o4 in e4 ? e4[o4] : (e4[o4] = r4(t4, ...n4));
        };
    };
    var l = Symbol.for('sxs.internal');
    var s = (e4, t4) =>
        Object.defineProperties(e4, Object.getOwnPropertyDescriptors(t4));
    var a = (e4) => {
        for (const t4 in e4) return true;
        return false;
    };
    var { hasOwnProperty: c } = Object.prototype;
    var d = (e4) =>
        e4.includes('-')
            ? e4
            : e4.replace(/[A-Z]/g, (e5) => '-' + e5.toLowerCase());
    var g = /\s+(?![^()]*\))/;
    var p = (e4) => (t4) =>
        e4(...('string' == typeof t4 ? String(t4).split(g) : [t4]));
    var u = {
        appearance: (e4) => ({ WebkitAppearance: e4, appearance: e4 }),
        backfaceVisibility: (e4) => ({
            WebkitBackfaceVisibility: e4,
            backfaceVisibility: e4
        }),
        backdropFilter: (e4) => ({ WebkitBackdropFilter: e4, backdropFilter: e4 }),
        backgroundClip: (e4) => ({ WebkitBackgroundClip: e4, backgroundClip: e4 }),
        boxDecorationBreak: (e4) => ({
            WebkitBoxDecorationBreak: e4,
            boxDecorationBreak: e4
        }),
        clipPath: (e4) => ({ WebkitClipPath: e4, clipPath: e4 }),
        content: (e4) => ({
            content:
                e4.includes('"') ||
                e4.includes("'") ||
                /^([A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/.test(
                    e4
                )
                    ? e4
                    : `"${e4}"`
        }),
        hyphens: (e4) => ({ WebkitHyphens: e4, hyphens: e4 }),
        maskImage: (e4) => ({ WebkitMaskImage: e4, maskImage: e4 }),
        maskSize: (e4) => ({ WebkitMaskSize: e4, maskSize: e4 }),
        tabSize: (e4) => ({ MozTabSize: e4, tabSize: e4 }),
        textSizeAdjust: (e4) => ({ WebkitTextSizeAdjust: e4, textSizeAdjust: e4 }),
        userSelect: (e4) => ({ WebkitUserSelect: e4, userSelect: e4 }),
        marginBlock: p((e4, t4) => ({
            marginBlockStart: e4,
            marginBlockEnd: t4 || e4
        })),
        marginInline: p((e4, t4) => ({
            marginInlineStart: e4,
            marginInlineEnd: t4 || e4
        })),
        maxSize: p((e4, t4) => ({ maxBlockSize: e4, maxInlineSize: t4 || e4 })),
        minSize: p((e4, t4) => ({ minBlockSize: e4, minInlineSize: t4 || e4 })),
        paddingBlock: p((e4, t4) => ({
            paddingBlockStart: e4,
            paddingBlockEnd: t4 || e4
        })),
        paddingInline: p((e4, t4) => ({
            paddingInlineStart: e4,
            paddingInlineEnd: t4 || e4
        }))
    };
    var h = /([\d.]+)([^]*)/;
    var f = (e4, t4) =>
        e4.length
            ? e4.reduce(
                  (e5, r4) => (
                      e5.push(
                          ...t4.map((e6) =>
                              e6.includes('&')
                                  ? e6.replace(
                                        /&/g,
                                        /[ +>|~]/.test(r4) && /&.*&/.test(e6)
                                            ? `:is(${r4})`
                                            : r4
                                    )
                                  : r4 + ' ' + e6
                          )
                      ),
                      e5
                  ),
                  []
              )
            : t4;
    var m = (e4, t4) =>
        e4 in b && 'string' == typeof t4
            ? t4.replace(
                  /^((?:[^]*[^\w-])?)(fit-content|stretch)((?:[^\w-][^]*)?)$/,
                  (t5, r4, n4, i4) =>
                      r4 +
                      ('stretch' === n4
                          ? `-moz-available${i4};${d(e4)}:${r4}-webkit-fill-available`
                          : `-moz-fit-content${i4};${d(e4)}:${r4}fit-content`) +
                      i4
              )
            : String(t4);
    var b = {
        blockSize: 1,
        height: 1,
        inlineSize: 1,
        maxBlockSize: 1,
        maxHeight: 1,
        maxInlineSize: 1,
        maxWidth: 1,
        minBlockSize: 1,
        minHeight: 1,
        minInlineSize: 1,
        minWidth: 1,
        width: 1
    };
    var S = (e4) => (e4 ? e4 + '-' : '');
    var k = (e4, t4, r4) =>
        e4.replace(
            /([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g,
            (e5, n4, i4, o4, l4) =>
                ('$' == o4) == !!i4
                    ? e5
                    : (n4 || '--' == o4 ? 'calc(' : '') +
                      'var(--' +
                      ('$' === o4
                          ? S(t4) +
                            (l4.includes('$') ? '' : S(r4)) +
                            l4.replace(/\$/g, '-')
                          : l4) +
                      ')' +
                      (n4 || '--' == o4 ? '*' + (n4 || '') + (i4 || '1') + ')' : '')
        );
    var y = /\s*,\s*(?![^()]*\))/;
    var B = Object.prototype.toString;
    var $ = (e4, t4, r4, n4, i4) => {
        let o4, l4, s4;
        const a4 = (e5, t5, r5) => {
            let c4, g4;
            const p4 = (e6) => {
                for (c4 in e6) {
                    const R3 = 64 === c4.charCodeAt(0),
                        z2 = R3 && Array.isArray(e6[c4]) ? e6[c4] : [e6[c4]];
                    for (g4 of z2) {
                        const e7 = /[A-Z]/.test(($4 = c4))
                                ? $4
                                : $4.replace(/-[^]/g, (e8) => e8[1].toUpperCase()),
                            z3 =
                                'object' == typeof g4 &&
                                g4 &&
                                g4.toString === B &&
                                (!n4.utils[e7] || !t5.length);
                        if (e7 in n4.utils && !z3) {
                            const t6 = n4.utils[e7];
                            if (t6 !== l4) {
                                ((l4 = t6), p4(t6(g4)), (l4 = null));
                                continue;
                            }
                        } else if (e7 in u) {
                            const t6 = u[e7];
                            if (t6 !== s4) {
                                ((s4 = t6), p4(t6(g4)), (s4 = null));
                                continue;
                            }
                        }
                        if (
                            (R3 &&
                                ((b4 =
                                    c4.slice(1) in n4.media
                                        ? '@media ' + n4.media[c4.slice(1)]
                                        : c4),
                                (c4 = b4.replace(
                                    /\(\s*([\w-]+)\s*(=|<|<=|>|>=)\s*([\w-]+)\s*(?:(<|<=|>|>=)\s*([\w-]+)\s*)?\)/g,
                                    (e8, t6, r6, n5, i5, o5) => {
                                        const l5 = h.test(t6),
                                            s5 = 0.0625 * (l5 ? -1 : 1),
                                            [a5, c5] = l5 ? [n5, t6] : [t6, n5];
                                        return (
                                            '(' +
                                            ('=' === r6[0]
                                                ? ''
                                                : ('>' === r6[0]) === l5
                                                  ? 'max-'
                                                  : 'min-') +
                                            a5 +
                                            ':' +
                                            ('=' !== r6[0] && 1 === r6.length
                                                ? c5.replace(
                                                      h,
                                                      (e9, t7, n6) =>
                                                          Number(t7) +
                                                          s5 *
                                                              ('>' === r6
                                                                  ? 1
                                                                  : -1) +
                                                          n6
                                                  )
                                                : c5) +
                                            (i5
                                                ? ') and (' +
                                                  ('>' === i5[0]
                                                      ? 'min-'
                                                      : 'max-') +
                                                  a5 +
                                                  ':' +
                                                  (1 === i5.length
                                                      ? o5.replace(
                                                            h,
                                                            (e9, t7, r7) =>
                                                                Number(t7) +
                                                                s5 *
                                                                    ('>' === i5
                                                                        ? -1
                                                                        : 1) +
                                                                r7
                                                        )
                                                      : o5)
                                                : '') +
                                            ')'
                                        );
                                    }
                                ))),
                            z3)
                        ) {
                            const e8 = R3 ? r5.concat(c4) : [...r5],
                                n5 = R3 ? [...t5] : f(t5, c4.split(y));
                            (void 0 !== o4 && i4(x(...o4)),
                                (o4 = void 0),
                                a4(g4, n5, e8));
                        } else
                            (void 0 === o4 && (o4 = [[], t5, r5]),
                                (c4 =
                                    R3 || 36 !== c4.charCodeAt(0)
                                        ? c4
                                        : `--${S(n4.prefix)}${c4.slice(1).replace(/\$/g, '-')}`),
                                (g4 = z3
                                    ? g4
                                    : 'number' == typeof g4
                                      ? g4 && e7 in I
                                          ? String(g4) + 'px'
                                          : String(g4)
                                      : k(
                                            m(e7, null == g4 ? '' : g4),
                                            n4.prefix,
                                            n4.themeMap[e7]
                                        )),
                                o4[0].push(`${R3 ? `${c4} ` : `${d(c4)}:`}${g4}`));
                    }
                }
                var b4, $4;
            };
            (p4(e5), void 0 !== o4 && i4(x(...o4)), (o4 = void 0));
        };
        a4(e4, t4, r4);
    };
    var x = (e4, t4, r4) =>
        `${r4.map((e5) => `${e5}{`).join('')}${t4.length ? `${t4.join(',')}{` : ''}${e4.join(';')}${t4.length ? '}' : ''}${Array(r4.length ? r4.length + 1 : 0).join('}')}`;
    var I = {
        animationDelay: 1,
        animationDuration: 1,
        backgroundSize: 1,
        blockSize: 1,
        border: 1,
        borderBlock: 1,
        borderBlockEnd: 1,
        borderBlockEndWidth: 1,
        borderBlockStart: 1,
        borderBlockStartWidth: 1,
        borderBlockWidth: 1,
        borderBottom: 1,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,
        borderBottomWidth: 1,
        borderEndEndRadius: 1,
        borderEndStartRadius: 1,
        borderInlineEnd: 1,
        borderInlineEndWidth: 1,
        borderInlineStart: 1,
        borderInlineStartWidth: 1,
        borderInlineWidth: 1,
        borderLeft: 1,
        borderLeftWidth: 1,
        borderRadius: 1,
        borderRight: 1,
        borderRightWidth: 1,
        borderSpacing: 1,
        borderStartEndRadius: 1,
        borderStartStartRadius: 1,
        borderTop: 1,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        borderTopWidth: 1,
        borderWidth: 1,
        bottom: 1,
        columnGap: 1,
        columnRule: 1,
        columnRuleWidth: 1,
        columnWidth: 1,
        containIntrinsicSize: 1,
        flexBasis: 1,
        fontSize: 1,
        gap: 1,
        gridAutoColumns: 1,
        gridAutoRows: 1,
        gridTemplateColumns: 1,
        gridTemplateRows: 1,
        height: 1,
        inlineSize: 1,
        inset: 1,
        insetBlock: 1,
        insetBlockEnd: 1,
        insetBlockStart: 1,
        insetInline: 1,
        insetInlineEnd: 1,
        insetInlineStart: 1,
        left: 1,
        letterSpacing: 1,
        margin: 1,
        marginBlock: 1,
        marginBlockEnd: 1,
        marginBlockStart: 1,
        marginBottom: 1,
        marginInline: 1,
        marginInlineEnd: 1,
        marginInlineStart: 1,
        marginLeft: 1,
        marginRight: 1,
        marginTop: 1,
        maxBlockSize: 1,
        maxHeight: 1,
        maxInlineSize: 1,
        maxWidth: 1,
        minBlockSize: 1,
        minHeight: 1,
        minInlineSize: 1,
        minWidth: 1,
        offsetDistance: 1,
        offsetRotate: 1,
        outline: 1,
        outlineOffset: 1,
        outlineWidth: 1,
        overflowClipMargin: 1,
        padding: 1,
        paddingBlock: 1,
        paddingBlockEnd: 1,
        paddingBlockStart: 1,
        paddingBottom: 1,
        paddingInline: 1,
        paddingInlineEnd: 1,
        paddingInlineStart: 1,
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: 1,
        perspective: 1,
        right: 1,
        rowGap: 1,
        scrollMargin: 1,
        scrollMarginBlock: 1,
        scrollMarginBlockEnd: 1,
        scrollMarginBlockStart: 1,
        scrollMarginBottom: 1,
        scrollMarginInline: 1,
        scrollMarginInlineEnd: 1,
        scrollMarginInlineStart: 1,
        scrollMarginLeft: 1,
        scrollMarginRight: 1,
        scrollMarginTop: 1,
        scrollPadding: 1,
        scrollPaddingBlock: 1,
        scrollPaddingBlockEnd: 1,
        scrollPaddingBlockStart: 1,
        scrollPaddingBottom: 1,
        scrollPaddingInline: 1,
        scrollPaddingInlineEnd: 1,
        scrollPaddingInlineStart: 1,
        scrollPaddingLeft: 1,
        scrollPaddingRight: 1,
        scrollPaddingTop: 1,
        shapeMargin: 1,
        textDecoration: 1,
        textDecorationThickness: 1,
        textIndent: 1,
        textUnderlineOffset: 1,
        top: 1,
        transitionDelay: 1,
        transitionDuration: 1,
        verticalAlign: 1,
        width: 1,
        wordSpacing: 1
    };
    var R = (e4) => String.fromCharCode(e4 + (e4 > 25 ? 39 : 97));
    var z = (e4) =>
        ((e5) => {
            let t4,
                r4 = '';
            for (t4 = Math.abs(e5); t4 > 52; t4 = (t4 / 52) | 0)
                r4 = R(t4 % 52) + r4;
            return R(t4 % 52) + r4;
        })(
            ((e5, t4) => {
                let r4 = t4.length;
                for (; r4; ) e5 = (33 * e5) ^ t4.charCodeAt(--r4);
                return e5;
            })(5381, JSON.stringify(e4)) >>> 0
        );
    var W = [
        'themed',
        'global',
        'styled',
        'onevar',
        'resonevar',
        'allvar',
        'inline'
    ];
    var j = (e4) => {
        if (e4.href && !e4.href.startsWith(location.origin)) return false;
        try {
            return !!e4.cssRules;
        } catch (e5) {
            return false;
        }
    };
    var E = (e4) => {
        let t4;
        const r4 = () => {
                const { cssRules: e5 } = t4.sheet;
                return [].map
                    .call(e5, (r5, n5) => {
                        const { cssText: i4 } = r5;
                        let o4 = '';
                        if (i4.startsWith('--sxs')) return '';
                        if (
                            e5[n5 - 1] &&
                            (o4 = e5[n5 - 1].cssText).startsWith('--sxs')
                        ) {
                            if (!r5.cssRules.length) return '';
                            for (const e6 in t4.rules)
                                if (t4.rules[e6].group === r5)
                                    return `--sxs{--sxs:${[...t4.rules[e6].cache].join(' ')}}${i4}`;
                            return r5.cssRules.length ? `${o4}${i4}` : '';
                        }
                        return i4;
                    })
                    .join('');
            },
            n4 = () => {
                if (t4) {
                    const { rules: e5, sheet: r5 } = t4;
                    if (!r5.deleteRule) {
                        for (; 3 === Object(Object(r5.cssRules)[0]).type; )
                            r5.cssRules.splice(0, 1);
                        r5.cssRules = [];
                    }
                    for (const t5 in e5) delete e5[t5];
                }
                const i4 = Object(e4).styleSheets || [];
                for (const e5 of i4)
                    if (j(e5)) {
                        for (let i5 = 0, o5 = e5.cssRules; o5[i5]; ++i5) {
                            const l5 = Object(o5[i5]);
                            if (1 !== l5.type) continue;
                            const s4 = Object(o5[i5 + 1]);
                            if (4 !== s4.type) continue;
                            ++i5;
                            const { cssText: a4 } = l5;
                            if (!a4.startsWith('--sxs')) continue;
                            const c4 = a4.slice(14, -3).trim().split(/\s+/),
                                d4 = W[c4[0]];
                            d4 &&
                                (t4 ||
                                    (t4 = {
                                        sheet: e5,
                                        reset: n4,
                                        rules: {},
                                        toString: r4
                                    }),
                                (t4.rules[d4] = {
                                    group: s4,
                                    index: i5,
                                    cache: new Set(c4)
                                }));
                        }
                        if (t4) break;
                    }
                if (!t4) {
                    const i5 = (e5, t5) => ({
                        type: t5,
                        cssRules: [],
                        insertRule(e6, t6) {
                            this.cssRules.splice(
                                t6,
                                0,
                                i5(
                                    e6,
                                    { import: 3, undefined: 1 }[
                                        (e6.toLowerCase().match(/^@([a-z]+)/) ||
                                            [])[1]
                                    ] || 4
                                )
                            );
                        },
                        get cssText() {
                            return '@media{}' === e5
                                ? `@media{${[].map.call(this.cssRules, (e6) => e6.cssText).join('')}}`
                                : e5;
                        }
                    });
                    t4 = {
                        sheet: e4
                            ? (e4.head || e4).appendChild(
                                  document.createElement('style')
                              ).sheet
                            : i5('', 'text/css'),
                        rules: {},
                        reset: n4,
                        toString: r4
                    };
                }
                const { sheet: o4, rules: l4 } = t4;
                for (let e5 = W.length - 1; e5 >= 0; --e5) {
                    const t5 = W[e5];
                    if (!l4[t5]) {
                        const r5 = W[e5 + 1],
                            n5 = l4[r5] ? l4[r5].index : o4.cssRules.length;
                        (o4.insertRule('@media{}', n5),
                            o4.insertRule(`--sxs{--sxs:${e5}}`, n5),
                            (l4[t5] = {
                                group: o4.cssRules[n5 + 1],
                                index: n5,
                                cache: new Set([e5])
                            }));
                    }
                    v(l4[t5]);
                }
            };
        return (n4(), t4);
    };
    var v = (e4) => {
        const t4 = e4.group;
        let r4 = t4.cssRules.length;
        e4.apply = (e5) => {
            try {
                (t4.insertRule(e5, r4), ++r4);
            } catch (e6) {}
        };
    };
    var T = Symbol();
    var w = o();
    var M = (e4, t4) =>
        w(e4, () => (...r4) => {
            let n4 = { type: null, composers: new Set() };
            for (const t5 of r4)
                if (null != t5)
                    if (t5[l]) {
                        null == n4.type && (n4.type = t5[l].type);
                        for (const e5 of t5[l].composers) n4.composers.add(e5);
                    } else
                        t5.constructor !== Object || t5.$$typeof
                            ? null == n4.type && (n4.type = t5)
                            : n4.composers.add(C(t5, e4));
            return (
                null == n4.type && (n4.type = 'span'),
                n4.composers.size || n4.composers.add(['PJLV', {}, [], [], {}, []]),
                P(e4, n4, t4)
            );
        });
    var C = (
        { variants: e4, compoundVariants: t4, defaultVariants: r4, ...n4 },
        i4
    ) => {
        const o4 = `${S(i4.prefix)}c-${z(n4)}`,
            l4 = [],
            s4 = [],
            d4 = Object.create(null),
            g4 = [];
        for (const e5 in r4) d4[e5] = String(r4[e5]);
        if ('object' == typeof e4 && e4)
            for (const t5 in e4) {
                ((p4 = d4), (u4 = t5), c.call(p4, u4) || (d4[t5] = 'undefined'));
                const r5 = e4[t5];
                for (const e5 in r5) {
                    const n5 = { [t5]: String(e5) };
                    'undefined' === String(e5) && g4.push(t5);
                    const i5 = r5[e5],
                        o5 = [n5, i5, !a(i5)];
                    l4.push(o5);
                }
            }
        var p4, u4;
        if ('object' == typeof t4 && t4)
            for (const e5 of t4) {
                let { css: t5, ...r5 } = e5;
                t5 = ('object' == typeof t5 && t5) || {};
                for (const e6 in r5) r5[e6] = String(r5[e6]);
                const n5 = [r5, t5, !a(t5)];
                s4.push(n5);
            }
        return [o4, n4, l4, s4, d4, g4];
    };
    var P = (e4, t4, r4) => {
        const [n4, i4, o4, a4] = L(t4.composers),
            c4 =
                'function' == typeof t4.type || t4.type.$$typeof
                    ? ((e5) => {
                          function t5() {
                              for (let r5 = 0; r5 < t5[T].length; r5++) {
                                  const [n5, i5] = t5[T][r5];
                                  e5.rules[n5].apply(i5);
                              }
                              return ((t5[T] = []), null);
                          }
                          return (
                              (t5[T] = []),
                              (t5.rules = {}),
                              W.forEach(
                                  (e6) =>
                                      (t5.rules[e6] = {
                                          apply: (r5) => t5[T].push([e6, r5])
                                      })
                              ),
                              t5
                          );
                      })(r4)
                    : null,
            d4 = (c4 || r4).rules,
            g4 = `.${n4}${i4.length > 1 ? `:where(.${i4.slice(1).join('.')})` : ''}`,
            p4 = (l4) => {
                l4 = ('object' == typeof l4 && l4) || A;
                const { css: s4, ...p5 } = l4,
                    u4 = {};
                for (const e5 in o4)
                    if ((delete p5[e5], e5 in l4)) {
                        let t5 = l4[e5];
                        'object' == typeof t5 && t5
                            ? (u4[e5] = { '@initial': o4[e5], ...t5 })
                            : ((t5 = String(t5)),
                              (u4[e5] =
                                  'undefined' !== t5 || a4.has(e5) ? t5 : o4[e5]));
                    } else u4[e5] = o4[e5];
                const h4 = new Set([...i4]);
                for (const [n5, i5, o5, l5] of t4.composers) {
                    r4.rules.styled.cache.has(n5) ||
                        (r4.rules.styled.cache.add(n5),
                        $(i5, [`.${n5}`], [], e4, (e5) => {
                            d4.styled.apply(e5);
                        }));
                    const t5 = O(o5, u4, e4.media),
                        s5 = O(l5, u4, e4.media, true);
                    for (const i6 of t5)
                        if (void 0 !== i6)
                            for (const [t6, o6, l6] of i6) {
                                const i7 = `${n5}-${z(o6)}-${t6}`;
                                h4.add(i7);
                                const s6 = (
                                        l6 ? r4.rules.resonevar : r4.rules.onevar
                                    ).cache,
                                    a5 = l6 ? d4.resonevar : d4.onevar;
                                s6.has(i7) ||
                                    (s6.add(i7),
                                    $(o6, [`.${i7}`], [], e4, (e5) => {
                                        a5.apply(e5);
                                    }));
                            }
                    for (const t6 of s5)
                        if (void 0 !== t6)
                            for (const [i6, o6] of t6) {
                                const t7 = `${n5}-${z(o6)}-${i6}`;
                                (h4.add(t7),
                                    r4.rules.allvar.cache.has(t7) ||
                                        (r4.rules.allvar.cache.add(t7),
                                        $(o6, [`.${t7}`], [], e4, (e5) => {
                                            d4.allvar.apply(e5);
                                        })));
                            }
                }
                if ('object' == typeof s4 && s4) {
                    const t5 = `${n4}-i${z(s4)}-css`;
                    (h4.add(t5),
                        r4.rules.inline.cache.has(t5) ||
                            (r4.rules.inline.cache.add(t5),
                            $(s4, [`.${t5}`], [], e4, (e5) => {
                                d4.inline.apply(e5);
                            })));
                }
                for (const e5 of String(l4.className || '')
                    .trim()
                    .split(/\s+/))
                    e5 && h4.add(e5);
                const f4 = (p5.className = [...h4].join(' '));
                return {
                    type: t4.type,
                    className: f4,
                    selector: g4,
                    props: p5,
                    toString: () => f4,
                    deferredInjector: c4
                };
            };
        return s(p4, {
            className: n4,
            selector: g4,
            [l]: t4,
            toString: () => (r4.rules.styled.cache.has(n4) || p4(), n4)
        });
    };
    var L = (e4) => {
        let t4 = '';
        const r4 = [],
            n4 = {},
            i4 = [];
        for (const [o4, , , , l4, s4] of e4) {
            ('' === t4 && (t4 = o4), r4.push(o4), i4.push(...s4));
            for (const e5 in l4) {
                const t5 = l4[e5];
                (void 0 === n4[e5] || 'undefined' !== t5 || s4.includes(t5)) &&
                    (n4[e5] = t5);
            }
        }
        return [t4, r4, n4, new Set(i4)];
    };
    var O = (e4, t4, r4, n4) => {
        const i4 = [];
        e: for (let [o4, l4, s4] of e4) {
            if (s4) continue;
            let e5,
                a4 = 0,
                c4 = false;
            for (e5 in o4) {
                const n5 = o4[e5];
                let i5 = t4[e5];
                if (i5 !== n5) {
                    if ('object' != typeof i5 || !i5) continue e;
                    {
                        let e6,
                            t5,
                            o5 = 0;
                        for (const l5 in i5) {
                            if (n5 === String(i5[l5])) {
                                if ('@initial' !== l5) {
                                    const e7 = l5.slice(1);
                                    ((t5 = t5 || []).push(
                                        e7 in r4
                                            ? r4[e7]
                                            : l5.replace(/^@media ?/, '')
                                    ),
                                        (c4 = true));
                                }
                                ((a4 += o5), (e6 = true));
                            }
                            ++o5;
                        }
                        if (
                            (t5 &&
                                t5.length &&
                                (l4 = { ['@media ' + t5.join(', ')]: l4 }),
                            !e6)
                        )
                            continue e;
                    }
                }
            }
            (i4[a4] = i4[a4] || []).push([n4 ? 'cv' : `${e5}-${o4[e5]}`, l4, c4]);
        }
        return i4;
    };
    var A = {};
    var N = o();
    var D = (e4, t4) =>
        N(e4, () => (...r4) => {
            const n4 = () => {
                for (let n5 of r4) {
                    n5 = ('object' == typeof n5 && n5) || {};
                    let r5 = z(n5);
                    if (!t4.rules.global.cache.has(r5)) {
                        if ((t4.rules.global.cache.add(r5), '@import' in n5)) {
                            let e5 =
                                [].indexOf.call(
                                    t4.sheet.cssRules,
                                    t4.rules.themed.group
                                ) - 1;
                            for (let r6 of [].concat(n5['@import']))
                                ((r6 =
                                    r6.includes('"') || r6.includes("'")
                                        ? r6
                                        : `"${r6}"`),
                                    t4.sheet.insertRule(`@import ${r6};`, e5++));
                            delete n5['@import'];
                        }
                        $(n5, [], [], e4, (e5) => {
                            t4.rules.global.apply(e5);
                        });
                    }
                }
                return '';
            };
            return s(n4, { toString: n4 });
        });
    var H = o();
    var V = (e4, t4) =>
        H(e4, () => (r4) => {
            const n4 = `${S(e4.prefix)}k-${z(r4)}`,
                i4 = () => {
                    if (!t4.rules.global.cache.has(n4)) {
                        t4.rules.global.cache.add(n4);
                        const i5 = [];
                        $(r4, [], [], e4, (e5) => i5.push(e5));
                        const o4 = `@keyframes ${n4}{${i5.join('')}}`;
                        t4.rules.global.apply(o4);
                    }
                    return n4;
                };
            return s(i4, {
                get name() {
                    return i4();
                },
                toString: i4
            });
        });
    var G = class {
        constructor(e4, t4, r4, n4) {
            ((this.token = null == e4 ? '' : String(e4)),
                (this.value = null == t4 ? '' : String(t4)),
                (this.scale = null == r4 ? '' : String(r4)),
                (this.prefix = null == n4 ? '' : String(n4)));
        }
        get computedValue() {
            return 'var(' + this.variable + ')';
        }
        get variable() {
            return '--' + S(this.prefix) + S(this.scale) + this.token;
        }
        toString() {
            return this.computedValue;
        }
    };
    var F = o();
    var J = (e4, t4) =>
        F(e4, () => (r4, n4) => {
            n4 = ('object' == typeof r4 && r4) || Object(n4);
            const i4 = `.${(r4 = (r4 = 'string' == typeof r4 ? r4 : '') || `${S(e4.prefix)}t-${z(n4)}`)}`,
                o4 = {},
                l4 = [];
            for (const t5 in n4) {
                o4[t5] = {};
                for (const r5 in n4[t5]) {
                    const i5 = `--${S(e4.prefix)}${t5}-${r5}`,
                        s5 = k(String(n4[t5][r5]), e4.prefix, t5);
                    ((o4[t5][r5] = new G(r5, s5, t5, e4.prefix)),
                        l4.push(`${i5}:${s5}`));
                }
            }
            const s4 = () => {
                if (l4.length && !t4.rules.themed.cache.has(r4)) {
                    t4.rules.themed.cache.add(r4);
                    const i5 = `${n4 === e4.theme ? ':root,' : ''}.${r4}{${l4.join(';')}}`;
                    t4.rules.themed.apply(i5);
                }
                return r4;
            };
            return {
                ...o4,
                get className() {
                    return s4();
                },
                selector: i4,
                toString: s4
            };
        });
    var U = o();
    var Y = o();
    var q = (e4) => {
        const t4 = ((e5) => {
            let t5 = false;
            const r4 = U(e5, (e6) => {
                t5 = true;
                const r5 =
                        'prefix' in (e6 = ('object' == typeof e6 && e6) || {})
                            ? String(e6.prefix)
                            : '',
                    i4 = ('object' == typeof e6.media && e6.media) || {},
                    o4 =
                        'object' == typeof e6.root
                            ? e6.root || null
                            : globalThis.document || null,
                    l4 = ('object' == typeof e6.theme && e6.theme) || {},
                    s4 = {
                        prefix: r5,
                        media: i4,
                        theme: l4,
                        themeMap: ('object' == typeof e6.themeMap &&
                            e6.themeMap) || { ...n },
                        utils: ('object' == typeof e6.utils && e6.utils) || {}
                    },
                    a4 = E(o4),
                    c4 = {
                        css: M(s4, a4),
                        globalCss: D(s4, a4),
                        keyframes: V(s4, a4),
                        createTheme: J(s4, a4),
                        reset() {
                            (a4.reset(), c4.theme.toString());
                        },
                        theme: {},
                        sheet: a4,
                        config: s4,
                        prefix: r5,
                        getCssText: a4.toString,
                        toString: a4.toString
                    };
                return (String((c4.theme = c4.createTheme(l4))), c4);
            });
            return (t5 || r4.reset(), r4);
        })(e4);
        return (
            (t4.styled = (({ config: e5, sheet: t5 }) =>
                Y(e5, () => {
                    const r4 = M(e5, t5);
                    return (...e6) => {
                        const t6 = r4(...e6),
                            n4 = t6[l].type,
                            i4 = React5.forwardRef((e7, r5) => {
                                const i5 = (e7 && e7.as) || n4,
                                    { props: o4, deferredInjector: l4 } = t6(e7);
                                return (
                                    delete o4.as,
                                    (o4.ref = r5),
                                    l4
                                        ? React5.createElement(
                                              React5.Fragment,
                                              null,
                                              React5.createElement(i5, o4),
                                              React5.createElement(l4, null)
                                          )
                                        : React5.createElement(i5, o4)
                                );
                            });
                        return (
                            (i4.className = t6.className),
                            (i4.displayName = `Styled.${n4.displayName || n4.name || n4}`),
                            (i4.selector = t6.selector),
                            (i4.toString = () => t6.selector),
                            (i4[l] = t6[l]),
                            i4
                        );
                    };
                }))(t4)),
            t4
        );
    };
    var use_gesture_react_esm_exports = {};
    __export(use_gesture_react_esm_exports, {
        createUseGesture: () => createUseGesture,
        useDrag: () => useDrag,
        useGesture: () => useGesture,
        useHover: () => useHover,
        useMove: () => useMove,
        usePinch: () => usePinch,
        useScroll: () => useScroll,
        useWheel: () => useWheel
    });
    var import_actions = __toESM(require_use_gesture_core_actions_cjs());
    __reExport(
        use_gesture_react_esm_exports,
        __toESM(require_use_gesture_core_actions_cjs())
    );
    var import_core = __toESM(require_use_gesture_core_cjs());
    __reExport(
        use_gesture_react_esm_exports,
        __toESM(require_use_gesture_core_utils_cjs())
    );
    __reExport(
        use_gesture_react_esm_exports,
        __toESM(require_use_gesture_core_types_cjs())
    );
    function useRecognizers(handlers, config = {}, gestureKey, nativeHandlers) {
        const ctrl = React5.useMemo(() => new import_core.Controller(handlers), []);
        ctrl.applyHandlers(handlers, nativeHandlers);
        ctrl.applyConfig(config, gestureKey);
        React5.useEffect(ctrl.effect.bind(ctrl));
        React5.useEffect(() => {
            return ctrl.clean.bind(ctrl);
        }, []);
        if (config.target === void 0) {
            return ctrl.bind.bind(ctrl);
        }
        return void 0;
    }
    function useDrag(handler, config) {
        (0, import_actions.registerAction)(import_actions.dragAction);
        return useRecognizers({ drag: handler }, config || {}, 'drag');
    }
    function usePinch(handler, config) {
        (0, import_actions.registerAction)(import_actions.pinchAction);
        return useRecognizers({ pinch: handler }, config || {}, 'pinch');
    }
    function useWheel(handler, config) {
        (0, import_actions.registerAction)(import_actions.wheelAction);
        return useRecognizers({ wheel: handler }, config || {}, 'wheel');
    }
    function useScroll(handler, config) {
        (0, import_actions.registerAction)(import_actions.scrollAction);
        return useRecognizers({ scroll: handler }, config || {}, 'scroll');
    }
    function useMove(handler, config) {
        (0, import_actions.registerAction)(import_actions.moveAction);
        return useRecognizers({ move: handler }, config || {}, 'move');
    }
    function useHover(handler, config) {
        (0, import_actions.registerAction)(import_actions.hoverAction);
        return useRecognizers({ hover: handler }, config || {}, 'hover');
    }
    function createUseGesture(actions) {
        actions.forEach(import_actions.registerAction);
        return function useGesture2(_handlers, _config) {
            const { handlers, nativeHandlers, config } = (0, import_core.parseMergedHandlers)(_handlers, _config || {});
            return useRecognizers(handlers, config, void 0, nativeHandlers);
        };
    }
    function useGesture(handlers, config) {
        const hook = createUseGesture([
            import_actions.dragAction,
            import_actions.pinchAction,
            import_actions.scrollAction,
            import_actions.wheelAction,
            import_actions.moveAction,
            import_actions.hoverAction
        ]);
        return hook(handlers, config || {});
    }
    function $e42e1063c40fb3ef$export$b9ecd428b558ff10(
        originalEventHandler,
        ourEventHandler,
        { checkForDefaultPrevented = true } = {}
    ) {
        return function handleEvent(event) {
            originalEventHandler === null ||
                originalEventHandler === void 0 ||
                originalEventHandler(event);
            if (checkForDefaultPrevented === false || !event.defaultPrevented)
                return ourEventHandler === null || ourEventHandler === void 0
                    ? void 0
                    : ourEventHandler(event);
        };
    }
    function $c512c27ab02ef895$export$50c7b4e9d9f19c1(
        scopeName,
        createContextScopeDeps = []
    ) {
        let defaultContexts = [];
        function $c512c27ab02ef895$export$fd42f52fd3ae1109(
            rootComponentName,
            defaultContext
        ) {
            const BaseContext = React5.createContext(defaultContext);
            const index2 = defaultContexts.length;
            defaultContexts = [...defaultContexts, defaultContext];
            function Provider(props3) {
                const { scope, children, ...context } = props3;
                const Context3 =
                    (scope === null || scope === void 0
                        ? void 0
                        : scope[scopeName][index2]) || BaseContext;
                const value = React5.useMemo(() => context, Object.values(context));
                return React5.createElement(Context3.Provider, { value }, children);
            }
            function useContext2(consumerName, scope) {
                const Context3 =
                    (scope === null || scope === void 0
                        ? void 0
                        : scope[scopeName][index2]) || BaseContext;
                const context = React5.useContext(Context3);
                if (context) return context;
                if (defaultContext !== void 0) return defaultContext;
                throw new Error(
                    `\`${consumerName}\` must be used within \`${rootComponentName}\``
                );
            }
            Provider.displayName = rootComponentName + 'Provider';
            return [Provider, useContext2];
        }
        const createScope = () => {
            const scopeContexts = defaultContexts.map((defaultContext) => {
                return React5.createContext(defaultContext);
            });
            return function useScope(scope) {
                const contexts =
                    (scope === null || scope === void 0
                        ? void 0
                        : scope[scopeName]) || scopeContexts;
                return React5.useMemo(
                    () => ({
                        [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts }
                    }),
                    [scope, contexts]
                );
            };
        };
        createScope.scopeName = scopeName;
        return [
            $c512c27ab02ef895$export$fd42f52fd3ae1109,
            $c512c27ab02ef895$var$composeContextScopes(
                createScope,
                ...createContextScopeDeps
            )
        ];
    }
    function $c512c27ab02ef895$var$composeContextScopes(...scopes) {
        const baseScope = scopes[0];
        if (scopes.length === 1) return baseScope;
        const createScope1 = () => {
            const scopeHooks = scopes.map((createScope) => ({
                useScope: createScope(),
                scopeName: createScope.scopeName
            }));
            return function useComposedScopes(overrideScopes) {
                const nextScopes1 = scopeHooks.reduce(
                    (nextScopes, { useScope, scopeName }) => {
                        const scopeProps = useScope(overrideScopes);
                        const currentScope = scopeProps[`__scope${scopeName}`];
                        return { ...nextScopes, ...currentScope };
                    },
                    {}
                );
                return React5.useMemo(
                    () => ({ [`__scope${baseScope.scopeName}`]: nextScopes1 }),
                    [nextScopes1]
                );
            };
        };
        createScope1.scopeName = baseScope.scopeName;
        return createScope1;
    }
    function $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(callback) {
        const callbackRef = React5.useRef(callback);
        React5.useEffect(() => {
            callbackRef.current = callback;
        });
        return React5.useMemo(
            () =>
                (...args) => {
                    var _callbackRef$current;
                    return (_callbackRef$current = callbackRef.current) === null ||
                        _callbackRef$current === void 0
                        ? void 0
                        : _callbackRef$current.call(callbackRef, ...args);
                },
            []
        );
    }
    function $addc16e1bbe58fd0$export$3a72a57244d6e765(
        onEscapeKeyDownProp,
        ownerDocument = globalThis === null || globalThis === void 0
            ? void 0
            : globalThis.document
    ) {
        const onEscapeKeyDown =
            $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onEscapeKeyDownProp);
        React5.useEffect(() => {
            const handleKeyDown = (event) => {
                if (event.key === 'Escape') onEscapeKeyDown(event);
            };
            ownerDocument.addEventListener('keydown', handleKeyDown);
            return () =>
                ownerDocument.removeEventListener('keydown', handleKeyDown);
        }, [onEscapeKeyDown, ownerDocument]);
    }
    var $5cb92bef7577960e$var$CONTEXT_UPDATE = 'dismissableLayer.update';
    var $5cb92bef7577960e$var$POINTER_DOWN_OUTSIDE =
        'dismissableLayer.pointerDownOutside';
    var $5cb92bef7577960e$var$FOCUS_OUTSIDE = 'dismissableLayer.focusOutside';
    var $5cb92bef7577960e$var$originalBodyPointerEvents;
    var $5cb92bef7577960e$var$DismissableLayerContext = React5.createContext({
        layers: new Set(),
        layersWithOutsidePointerEventsDisabled: new Set(),
        branches: new Set()
    });
    var $5cb92bef7577960e$export$177fb62ff3ec1f22 = React5.forwardRef(
        (props3, forwardedRef) => {
            var _node$ownerDocument;
            const {
                disableOutsidePointerEvents = false,
                onEscapeKeyDown,
                onPointerDownOutside,
                onFocusOutside,
                onInteractOutside,
                onDismiss,
                ...layerProps
            } = props3;
            const context = React5.useContext(
                $5cb92bef7577960e$var$DismissableLayerContext
            );
            const [node1, setNode] = React5.useState(null);
            const ownerDocument =
                (_node$ownerDocument =
                    node1 === null || node1 === void 0
                        ? void 0
                        : node1.ownerDocument) !== null &&
                _node$ownerDocument !== void 0
                    ? _node$ownerDocument
                    : globalThis === null || globalThis === void 0
                      ? void 0
                      : globalThis.document;
            const [, force] = React5.useState({});
            const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(
                forwardedRef,
                (node) => setNode(node)
            );
            const layers = Array.from(context.layers);
            const [highestLayerWithOutsidePointerEventsDisabled] = [
                ...context.layersWithOutsidePointerEventsDisabled
            ].slice(-1);
            const highestLayerWithOutsidePointerEventsDisabledIndex =
                layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
            const index2 = node1 ? layers.indexOf(node1) : -1;
            const isBodyPointerEventsDisabled =
                context.layersWithOutsidePointerEventsDisabled.size > 0;
            const isPointerEventsEnabled =
                index2 >= highestLayerWithOutsidePointerEventsDisabledIndex;
            const pointerDownOutside = $5cb92bef7577960e$var$usePointerDownOutside(
                (event) => {
                    const target = event.target;
                    const isPointerDownOnBranch = [...context.branches].some(
                        (branch) => branch.contains(target)
                    );
                    if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
                    onPointerDownOutside === null ||
                        onPointerDownOutside === void 0 ||
                        onPointerDownOutside(event);
                    onInteractOutside === null ||
                        onInteractOutside === void 0 ||
                        onInteractOutside(event);
                    if (!event.defaultPrevented)
                        onDismiss === null || onDismiss === void 0 || onDismiss();
                },
                ownerDocument
            );
            const focusOutside = $5cb92bef7577960e$var$useFocusOutside((event) => {
                const target = event.target;
                const isFocusInBranch = [...context.branches].some((branch) =>
                    branch.contains(target)
                );
                if (isFocusInBranch) return;
                onFocusOutside === null ||
                    onFocusOutside === void 0 ||
                    onFocusOutside(event);
                onInteractOutside === null ||
                    onInteractOutside === void 0 ||
                    onInteractOutside(event);
                if (!event.defaultPrevented)
                    onDismiss === null || onDismiss === void 0 || onDismiss();
            }, ownerDocument);
            $addc16e1bbe58fd0$export$3a72a57244d6e765((event) => {
                const isHighestLayer = index2 === context.layers.size - 1;
                if (!isHighestLayer) return;
                onEscapeKeyDown === null ||
                    onEscapeKeyDown === void 0 ||
                    onEscapeKeyDown(event);
                if (!event.defaultPrevented && onDismiss) {
                    event.preventDefault();
                    onDismiss();
                }
            }, ownerDocument);
            React5.useEffect(() => {
                if (!node1) return;
                if (disableOutsidePointerEvents) {
                    if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
                        $5cb92bef7577960e$var$originalBodyPointerEvents =
                            ownerDocument.body.style.pointerEvents;
                        ownerDocument.body.style.pointerEvents = 'none';
                    }
                    context.layersWithOutsidePointerEventsDisabled.add(node1);
                }
                context.layers.add(node1);
                $5cb92bef7577960e$var$dispatchUpdate();
                return () => {
                    if (
                        disableOutsidePointerEvents &&
                        context.layersWithOutsidePointerEventsDisabled.size === 1
                    )
                        ownerDocument.body.style.pointerEvents =
                            $5cb92bef7577960e$var$originalBodyPointerEvents;
                };
            }, [node1, ownerDocument, disableOutsidePointerEvents, context]);
            React5.useEffect(() => {
                return () => {
                    if (!node1) return;
                    context.layers.delete(node1);
                    context.layersWithOutsidePointerEventsDisabled.delete(node1);
                    $5cb92bef7577960e$var$dispatchUpdate();
                };
            }, [node1, context]);
            React5.useEffect(() => {
                const handleUpdate = () => force({});
                document.addEventListener(
                    $5cb92bef7577960e$var$CONTEXT_UPDATE,
                    handleUpdate
                );
                return () =>
                    document.removeEventListener(
                        $5cb92bef7577960e$var$CONTEXT_UPDATE,
                        handleUpdate
                    );
            }, []);
            return React5.createElement(
                $8927f6f2acc4f386$export$250ffa63cdc0d034.div,
                _extends({}, layerProps, {
                    ref: composedRefs,
                    style: {
                        pointerEvents: isBodyPointerEventsDisabled
                            ? isPointerEventsEnabled
                                ? 'auto'
                                : 'none'
                            : void 0,
                        ...props3.style
                    },
                    onFocusCapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
                        props3.onFocusCapture,
                        focusOutside.onFocusCapture
                    ),
                    onBlurCapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
                        props3.onBlurCapture,
                        focusOutside.onBlurCapture
                    ),
                    onPointerDownCapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
                        props3.onPointerDownCapture,
                        pointerDownOutside.onPointerDownCapture
                    )
                })
            );
        }
    );
    function $5cb92bef7577960e$var$usePointerDownOutside(
        onPointerDownOutside,
        ownerDocument = globalThis === null || globalThis === void 0
            ? void 0
            : globalThis.document
    ) {
        const handlePointerDownOutside =
            $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onPointerDownOutside);
        const isPointerInsideReactTreeRef = React5.useRef(false);
        const handleClickRef = React5.useRef(() => {});
        React5.useEffect(() => {
            const handlePointerDown = (event) => {
                if (event.target && !isPointerInsideReactTreeRef.current) {
                    let handleAndDispatchPointerDownOutsideEvent = function () {
                        $5cb92bef7577960e$var$handleAndDispatchCustomEvent(
                            $5cb92bef7577960e$var$POINTER_DOWN_OUTSIDE,
                            handlePointerDownOutside,
                            eventDetail,
                            { discrete: true }
                        );
                    };
                    const eventDetail = { originalEvent: event };
                    if (event.pointerType === 'touch') {
                        ownerDocument.removeEventListener(
                            'click',
                            handleClickRef.current
                        );
                        handleClickRef.current =
                            handleAndDispatchPointerDownOutsideEvent;
                        ownerDocument.addEventListener(
                            'click',
                            handleClickRef.current,
                            { once: true }
                        );
                    } else handleAndDispatchPointerDownOutsideEvent();
                }
                isPointerInsideReactTreeRef.current = false;
            };
            const timerId = window.setTimeout(() => {
                ownerDocument.addEventListener('pointerdown', handlePointerDown);
            }, 0);
            return () => {
                window.clearTimeout(timerId);
                ownerDocument.removeEventListener('pointerdown', handlePointerDown);
                ownerDocument.removeEventListener('click', handleClickRef.current);
            };
        }, [ownerDocument, handlePointerDownOutside]);
        return {
            onPointerDownCapture: () => (isPointerInsideReactTreeRef.current = true)
        };
    }
    function $5cb92bef7577960e$var$useFocusOutside(
        onFocusOutside,
        ownerDocument = globalThis === null || globalThis === void 0
            ? void 0
            : globalThis.document
    ) {
        const handleFocusOutside =
            $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onFocusOutside);
        const isFocusInsideReactTreeRef = React5.useRef(false);
        React5.useEffect(() => {
            const handleFocus = (event) => {
                if (event.target && !isFocusInsideReactTreeRef.current) {
                    const eventDetail = { originalEvent: event };
                    $5cb92bef7577960e$var$handleAndDispatchCustomEvent(
                        $5cb92bef7577960e$var$FOCUS_OUTSIDE,
                        handleFocusOutside,
                        eventDetail,
                        { discrete: false }
                    );
                }
            };
            ownerDocument.addEventListener('focusin', handleFocus);
            return () => ownerDocument.removeEventListener('focusin', handleFocus);
        }, [ownerDocument, handleFocusOutside]);
        return {
            onFocusCapture: () => (isFocusInsideReactTreeRef.current = true),
            onBlurCapture: () => (isFocusInsideReactTreeRef.current = false)
        };
    }
    function $5cb92bef7577960e$var$dispatchUpdate() {
        const event = new CustomEvent($5cb92bef7577960e$var$CONTEXT_UPDATE);
        document.dispatchEvent(event);
    }
    function $5cb92bef7577960e$var$handleAndDispatchCustomEvent(
        name,
        handler,
        detail,
        { discrete }
    ) {
        const target = detail.originalEvent.target;
        const event = new CustomEvent(name, {
            bubbles: false,
            cancelable: true,
            detail
        });
        if (handler) target.addEventListener(name, handler, { once: true });
        if (discrete) $8927f6f2acc4f386$export$6d1a0317bde7de7f(target, event);
        else target.dispatchEvent(event);
    }
    var $9f79659886946c16$export$e5c5a5f917a5871c = Boolean(
        globalThis === null || globalThis === void 0 ? void 0 : globalThis.document
    )
        ? React5.useLayoutEffect
        : () => {};
    var $1746a345f3d73bb7$var$useReactId =
        React5__namespace['useId'.toString()] || (() => void 0);
    var $1746a345f3d73bb7$var$count = 0;
    function $1746a345f3d73bb7$export$f680877a34711e37(deterministicId) {
        const [id, setId] = React5__namespace.useState(
            $1746a345f3d73bb7$var$useReactId()
        );
        $9f79659886946c16$export$e5c5a5f917a5871c(() => {
            setId((reactId) =>
                    reactId !== null && reactId !== void 0
                        ? reactId
                        : String($1746a345f3d73bb7$var$count++)
                );
        }, [deterministicId]);
        return (id ? `radix-${id}` : '');
    }
    function getSide(placement) {
        return placement.split('-')[0];
    }
    function getAlignment(placement) {
        return placement.split('-')[1];
    }
    function getMainAxisFromPlacement(placement) {
        return ['top', 'bottom'].includes(getSide(placement)) ? 'x' : 'y';
    }
    function getLengthFromAxis(axis) {
        return axis === 'y' ? 'height' : 'width';
    }
    function computeCoordsFromPlacement(_ref, placement, rtl) {
        let { reference, floating } = _ref;
        const commonX = reference.x + reference.width / 2 - floating.width / 2;
        const commonY = reference.y + reference.height / 2 - floating.height / 2;
        const mainAxis = getMainAxisFromPlacement(placement);
        const length = getLengthFromAxis(mainAxis);
        const commonAlign = reference[length] / 2 - floating[length] / 2;
        const side = getSide(placement);
        const isVertical = mainAxis === 'x';
        let coords;
        switch (side) {
            case 'top':
                coords = { x: commonX, y: reference.y - floating.height };
                break;
            case 'bottom':
                coords = { x: commonX, y: reference.y + reference.height };
                break;
            case 'right':
                coords = { x: reference.x + reference.width, y: commonY };
                break;
            case 'left':
                coords = { x: reference.x - floating.width, y: commonY };
                break;
            default:
                coords = { x: reference.x, y: reference.y };
        }
        switch (getAlignment(placement)) {
            case 'start':
                coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
                break;
            case 'end':
                coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
                break;
        }
        return coords;
    }
    var computePosition = async (reference, floating, config) => {
        const {
            placement = 'bottom',
            strategy = 'absolute',
            middleware = [],
            platform: platform2
        } = config;
        const rtl = await (platform2.isRTL == null
            ? void 0
            : platform2.isRTL(floating));
        {
            if (platform2 == null) {
                console.error(
                    [
                        'Floating UI: `platform` property was not passed to config. If you',
                        'want to use Floating UI on the web, install @floating-ui/dom',
                        'instead of the /core package. Otherwise, you can create your own',
                        '`platform`: https://floating-ui.com/docs/platform'
                    ].join(' ')
                );
            }
            if (
                middleware.filter((_ref) => {
                    let { name } = _ref;
                    return name === 'autoPlacement' || name === 'flip';
                }).length > 1
            ) {
                throw new Error(
                    [
                        'Floating UI: duplicate `flip` and/or `autoPlacement`',
                        'middleware detected. This will lead to an infinite loop. Ensure only',
                        'one of either has been passed to the `middleware` array.'
                    ].join(' ')
                );
            }
        }
        let rects = await platform2.getElementRects({
            reference,
            floating,
            strategy
        });
        let { x: x3, y: y4 } = computeCoordsFromPlacement(rects, placement, rtl);
        let statefulPlacement = placement;
        let middlewareData = {};
        let resetCount = 0;
        for (let i4 = 0; i4 < middleware.length; i4++) {
            const { name, fn } = middleware[i4];
            const {
                x: nextX,
                y: nextY,
                data,
                reset
            } = await fn({
                x: x3,
                y: y4,
                initialPlacement: placement,
                placement: statefulPlacement,
                strategy,
                middlewareData,
                rects,
                platform: platform2,
                elements: { reference, floating }
            });
            x3 = nextX != null ? nextX : x3;
            y4 = nextY != null ? nextY : y4;
            middlewareData = {
                ...middlewareData,
                [name]: { ...middlewareData[name], ...data }
            };
            {
                if (resetCount > 50) {
                    console.warn(
                        [
                            'Floating UI: The middleware lifecycle appears to be running in an',
                            'infinite loop. This is usually caused by a `reset` continually',
                            'being returned without a break condition.'
                        ].join(' ')
                    );
                }
            }
            if (reset && resetCount <= 50) {
                resetCount++;
                if (typeof reset === 'object') {
                    if (reset.placement) {
                        statefulPlacement = reset.placement;
                    }
                    if (reset.rects) {
                        rects =
                            reset.rects === true
                                ? await platform2.getElementRects({
                                      reference,
                                      floating,
                                      strategy
                                  })
                                : reset.rects;
                    }
                    ({ x: x3, y: y4 } = computeCoordsFromPlacement(
                        rects,
                        statefulPlacement,
                        rtl
                    ));
                }
                i4 = -1;
                continue;
            }
        }
        return {
            x: x3,
            y: y4,
            placement: statefulPlacement,
            strategy,
            middlewareData
        };
    };
    function expandPaddingObject(padding) {
        return { top: 0, right: 0, bottom: 0, left: 0, ...padding };
    }
    function getSideObjectFromPadding(padding) {
        return typeof padding !== 'number'
            ? expandPaddingObject(padding)
            : { top: padding, right: padding, bottom: padding, left: padding };
    }
    function rectToClientRect(rect) {
        return {
            ...rect,
            top: rect.y,
            left: rect.x,
            right: rect.x + rect.width,
            bottom: rect.y + rect.height
        };
    }
    async function detectOverflow(middlewareArguments, options) {
        var _await$platform$isEle;
        if (options === void 0) {
            options = {};
        }
        const {
            x: x3,
            y: y4,
            platform: platform2,
            rects,
            elements,
            strategy
        } = middlewareArguments;
        const {
            boundary = 'clippingAncestors',
            rootBoundary = 'viewport',
            elementContext = 'floating',
            altBoundary = false,
            padding = 0
        } = options;
        const paddingObject = getSideObjectFromPadding(padding);
        const altContext = elementContext === 'floating' ? 'reference' : 'floating';
        const element = elements[altBoundary ? altContext : elementContext];
        const clippingClientRect = rectToClientRect(
            await platform2.getClippingRect({
                element: (
                    (_await$platform$isEle = await (platform2.isElement == null
                        ? void 0
                        : platform2.isElement(element))) != null
                        ? _await$platform$isEle
                        : true
                )
                    ? element
                    : element.contextElement ||
                      (await (platform2.getDocumentElement == null
                          ? void 0
                          : platform2.getDocumentElement(elements.floating))),
                boundary,
                rootBoundary,
                strategy
            })
        );
        const elementClientRect = rectToClientRect(
            platform2.convertOffsetParentRelativeRectToViewportRelativeRect
                ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect(
                      {
                          rect:
                              elementContext === 'floating'
                                  ? { ...rects.floating, x: x3, y: y4 }
                                  : rects.reference,
                          offsetParent: await (platform2.getOffsetParent == null
                              ? void 0
                              : platform2.getOffsetParent(elements.floating)),
                          strategy
                      }
                  )
                : rects[elementContext]
        );
        return {
            top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
            bottom:
                elementClientRect.bottom -
                clippingClientRect.bottom +
                paddingObject.bottom,
            left:
                clippingClientRect.left -
                elementClientRect.left +
                paddingObject.left,
            right:
                elementClientRect.right -
                clippingClientRect.right +
                paddingObject.right
        };
    }
    var min = Math.min;
    var max = Math.max;
    function within(min$1, value, max$1) {
        return max(min$1, min(value, max$1));
    }
    var arrow = (options) => ({
        name: 'arrow',
        options,
        async fn(middlewareArguments) {
            const { element, padding = 0 } = options != null ? options : {};
            const {
                x: x3,
                y: y4,
                placement,
                rects,
                platform: platform2
            } = middlewareArguments;
            if (element == null) {
                {
                    console.warn(
                        'Floating UI: No `element` was passed to the `arrow` middleware.'
                    );
                }
                return {};
            }
            const paddingObject = getSideObjectFromPadding(padding);
            const coords = { x: x3, y: y4 };
            const axis = getMainAxisFromPlacement(placement);
            const alignment = getAlignment(placement);
            const length = getLengthFromAxis(axis);
            const arrowDimensions = await platform2.getDimensions(element);
            const minProp = axis === 'y' ? 'top' : 'left';
            const maxProp = axis === 'y' ? 'bottom' : 'right';
            const endDiff =
                rects.reference[length] +
                rects.reference[axis] -
                coords[axis] -
                rects.floating[length];
            const startDiff = coords[axis] - rects.reference[axis];
            const arrowOffsetParent = await (platform2.getOffsetParent == null
                ? void 0
                : platform2.getOffsetParent(element));
            let clientSize = arrowOffsetParent
                ? axis === 'y'
                    ? arrowOffsetParent.clientHeight || 0
                    : arrowOffsetParent.clientWidth || 0
                : 0;
            if (clientSize === 0) {
                clientSize = rects.floating[length];
            }
            const centerToReference = endDiff / 2 - startDiff / 2;
            const min3 = paddingObject[minProp];
            const max3 =
                clientSize - arrowDimensions[length] - paddingObject[maxProp];
            const center =
                clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
            const offset2 = within(min3, center, max3);
            const alignmentPadding =
                alignment === 'start'
                    ? paddingObject[minProp]
                    : paddingObject[maxProp];
            const shouldAddOffset =
                alignmentPadding > 0 &&
                center !== offset2 &&
                rects.reference[length] <= rects.floating[length];
            const alignmentOffset = shouldAddOffset
                ? center < min3
                    ? min3 - center
                    : max3 - center
                : 0;
            return {
                [axis]: coords[axis] - alignmentOffset,
                data: { [axis]: offset2, centerOffset: center - offset2 }
            };
        }
    });
    var hash$1 = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
    function getOppositePlacement(placement) {
        return placement.replace(
            /left|right|bottom|top/g,
            (matched) => hash$1[matched]
        );
    }
    function getAlignmentSides(placement, rects, rtl) {
        if (rtl === void 0) {
            rtl = false;
        }
        const alignment = getAlignment(placement);
        const mainAxis = getMainAxisFromPlacement(placement);
        const length = getLengthFromAxis(mainAxis);
        let mainAlignmentSide =
            mainAxis === 'x'
                ? alignment === (rtl ? 'end' : 'start')
                    ? 'right'
                    : 'left'
                : alignment === 'start'
                  ? 'bottom'
                  : 'top';
        if (rects.reference[length] > rects.floating[length]) {
            mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
        }
        return {
            main: mainAlignmentSide,
            cross: getOppositePlacement(mainAlignmentSide)
        };
    }
    var hash = { start: 'end', end: 'start' };
    function getOppositeAlignmentPlacement(placement) {
        return placement.replace(/start|end/g, (matched) => hash[matched]);
    }
    var sides = ['top', 'right', 'bottom', 'left'];
    function getExpandedPlacements(placement) {
        const oppositePlacement = getOppositePlacement(placement);
        return [
            getOppositeAlignmentPlacement(placement),
            oppositePlacement,
            getOppositeAlignmentPlacement(oppositePlacement)
        ];
    }
    var flip = function (options) {
        if (options === void 0) {
            options = {};
        }
        return {
            name: 'flip',
            options,
            async fn(middlewareArguments) {
                var _middlewareData$flip;
                const {
                    placement,
                    middlewareData,
                    rects,
                    initialPlacement,
                    platform: platform2,
                    elements
                } = middlewareArguments;
                const {
                    mainAxis: checkMainAxis = true,
                    crossAxis: checkCrossAxis = true,
                    fallbackPlacements: specifiedFallbackPlacements,
                    fallbackStrategy = 'bestFit',
                    flipAlignment = true,
                    ...detectOverflowOptions
                } = options;
                const side = getSide(placement);
                const isBasePlacement = side === initialPlacement;
                const fallbackPlacements =
                    specifiedFallbackPlacements ||
                    (isBasePlacement || !flipAlignment
                        ? [getOppositePlacement(initialPlacement)]
                        : getExpandedPlacements(initialPlacement));
                const placements = [initialPlacement, ...fallbackPlacements];
                const overflow = await detectOverflow(
                    middlewareArguments,
                    detectOverflowOptions
                );
                const overflows = [];
                let overflowsData =
                    ((_middlewareData$flip = middlewareData.flip) == null
                        ? void 0
                        : _middlewareData$flip.overflows) || [];
                if (checkMainAxis) {
                    overflows.push(overflow[side]);
                }
                if (checkCrossAxis) {
                    const { main, cross } = getAlignmentSides(
                        placement,
                        rects,
                        await (platform2.isRTL == null
                            ? void 0
                            : platform2.isRTL(elements.floating))
                    );
                    overflows.push(overflow[main], overflow[cross]);
                }
                overflowsData = [...overflowsData, { placement, overflows }];
                if (!overflows.every((side2) => side2 <= 0)) {
                    var _middlewareData$flip$, _middlewareData$flip2;
                    const nextIndex =
                        ((_middlewareData$flip$ =
                            (_middlewareData$flip2 = middlewareData.flip) == null
                                ? void 0
                                : _middlewareData$flip2.index) != null
                            ? _middlewareData$flip$
                            : 0) + 1;
                    const nextPlacement = placements[nextIndex];
                    if (nextPlacement) {
                        return {
                            data: { index: nextIndex, overflows: overflowsData },
                            reset: { placement: nextPlacement }
                        };
                    }
                    let resetPlacement = 'bottom';
                    switch (fallbackStrategy) {
                        case 'bestFit': {
                            var _overflowsData$map$so;
                            const placement2 =
                                (_overflowsData$map$so = overflowsData
                                    .map((d4) => [
                                        d4,
                                        d4.overflows
                                            .filter((overflow2) => overflow2 > 0)
                                            .reduce(
                                                (acc, overflow2) => acc + overflow2,
                                                0
                                            )
                                    ])
                                    .sort((a4, b4) => a4[1] - b4[1])[0]) == null
                                    ? void 0
                                    : _overflowsData$map$so[0].placement;
                            if (placement2) {
                                resetPlacement = placement2;
                            }
                            break;
                        }
                        case 'initialPlacement':
                            resetPlacement = initialPlacement;
                            break;
                    }
                    if (placement !== resetPlacement) {
                        return { reset: { placement: resetPlacement } };
                    }
                }
                return {};
            }
        };
    };
    function getSideOffsets(overflow, rect) {
        return {
            top: overflow.top - rect.height,
            right: overflow.right - rect.width,
            bottom: overflow.bottom - rect.height,
            left: overflow.left - rect.width
        };
    }
    function isAnySideFullyClipped(overflow) {
        return sides.some((side) => overflow[side] >= 0);
    }
    var hide = function (_temp) {
        let { strategy = 'referenceHidden', ...detectOverflowOptions } =
            _temp === void 0 ? {} : _temp;
        return {
            name: 'hide',
            async fn(middlewareArguments) {
                const { rects } = middlewareArguments;
                switch (strategy) {
                    case 'referenceHidden': {
                        const overflow = await detectOverflow(middlewareArguments, {
                            ...detectOverflowOptions,
                            elementContext: 'reference'
                        });
                        const offsets = getSideOffsets(overflow, rects.reference);
                        return {
                            data: {
                                referenceHiddenOffsets: offsets,
                                referenceHidden: isAnySideFullyClipped(offsets)
                            }
                        };
                    }
                    case 'escaped': {
                        const overflow = await detectOverflow(middlewareArguments, {
                            ...detectOverflowOptions,
                            altBoundary: true
                        });
                        const offsets = getSideOffsets(overflow, rects.floating);
                        return {
                            data: {
                                escapedOffsets: offsets,
                                escaped: isAnySideFullyClipped(offsets)
                            }
                        };
                    }
                    default: {
                        return {};
                    }
                }
            }
        };
    };
    async function convertValueToCoords(middlewareArguments, value) {
        const { placement, platform: platform2, elements } = middlewareArguments;
        const rtl = await (platform2.isRTL == null
            ? void 0
            : platform2.isRTL(elements.floating));
        const side = getSide(placement);
        const alignment = getAlignment(placement);
        const isVertical = getMainAxisFromPlacement(placement) === 'x';
        const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
        const crossAxisMulti = rtl && isVertical ? -1 : 1;
        const rawValue =
            typeof value === 'function' ? value(middlewareArguments) : value;
        let { mainAxis, crossAxis, alignmentAxis } =
            typeof rawValue === 'number'
                ? { mainAxis: rawValue, crossAxis: 0, alignmentAxis: null }
                : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...rawValue };
        if (alignment && typeof alignmentAxis === 'number') {
            crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
        }
        return isVertical
            ? { x: crossAxis * crossAxisMulti, y: mainAxis * mainAxisMulti }
            : { x: mainAxis * mainAxisMulti, y: crossAxis * crossAxisMulti };
    }
    var offset = function (value) {
        if (value === void 0) {
            value = 0;
        }
        return {
            name: 'offset',
            options: value,
            async fn(middlewareArguments) {
                const { x: x3, y: y4 } = middlewareArguments;
                const diffCoords = await convertValueToCoords(
                    middlewareArguments,
                    value
                );
                return {
                    x: x3 + diffCoords.x,
                    y: y4 + diffCoords.y,
                    data: diffCoords
                };
            }
        };
    };
    function getCrossAxis(axis) {
        return axis === 'x' ? 'y' : 'x';
    }
    var shift = function (options) {
        if (options === void 0) {
            options = {};
        }
        return {
            name: 'shift',
            options,
            async fn(middlewareArguments) {
                const { x: x3, y: y4, placement } = middlewareArguments;
                const {
                    mainAxis: checkMainAxis = true,
                    crossAxis: checkCrossAxis = false,
                    limiter = {
                        fn: (_ref) => {
                            let { x: x4, y: y5 } = _ref;
                            return { x: x4, y: y5 };
                        }
                    },
                    ...detectOverflowOptions
                } = options;
                const coords = { x: x3, y: y4 };
                const overflow = await detectOverflow(
                    middlewareArguments,
                    detectOverflowOptions
                );
                const mainAxis = getMainAxisFromPlacement(getSide(placement));
                const crossAxis = getCrossAxis(mainAxis);
                let mainAxisCoord = coords[mainAxis];
                let crossAxisCoord = coords[crossAxis];
                if (checkMainAxis) {
                    const minSide = mainAxis === 'y' ? 'top' : 'left';
                    const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
                    const min3 = mainAxisCoord + overflow[minSide];
                    const max3 = mainAxisCoord - overflow[maxSide];
                    mainAxisCoord = within(min3, mainAxisCoord, max3);
                }
                if (checkCrossAxis) {
                    const minSide = crossAxis === 'y' ? 'top' : 'left';
                    const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
                    const min3 = crossAxisCoord + overflow[minSide];
                    const max3 = crossAxisCoord - overflow[maxSide];
                    crossAxisCoord = within(min3, crossAxisCoord, max3);
                }
                const limitedCoords = limiter.fn({
                    ...middlewareArguments,
                    [mainAxis]: mainAxisCoord,
                    [crossAxis]: crossAxisCoord
                });
                return {
                    ...limitedCoords,
                    data: { x: limitedCoords.x - x3, y: limitedCoords.y - y4 }
                };
            }
        };
    };
    var limitShift = function (options) {
        if (options === void 0) {
            options = {};
        }
        return {
            options,
            fn(middlewareArguments) {
                const {
                    x: x3,
                    y: y4,
                    placement,
                    rects,
                    middlewareData
                } = middlewareArguments;
                const {
                    offset: offset2 = 0,
                    mainAxis: checkMainAxis = true,
                    crossAxis: checkCrossAxis = true
                } = options;
                const coords = { x: x3, y: y4 };
                const mainAxis = getMainAxisFromPlacement(placement);
                const crossAxis = getCrossAxis(mainAxis);
                let mainAxisCoord = coords[mainAxis];
                let crossAxisCoord = coords[crossAxis];
                const rawOffset =
                    typeof offset2 === 'function'
                        ? offset2({ ...rects, placement })
                        : offset2;
                const computedOffset =
                    typeof rawOffset === 'number'
                        ? { mainAxis: rawOffset, crossAxis: 0 }
                        : { mainAxis: 0, crossAxis: 0, ...rawOffset };
                if (checkMainAxis) {
                    const len = mainAxis === 'y' ? 'height' : 'width';
                    const limitMin =
                        rects.reference[mainAxis] -
                        rects.floating[len] +
                        computedOffset.mainAxis;
                    const limitMax =
                        rects.reference[mainAxis] +
                        rects.reference[len] -
                        computedOffset.mainAxis;
                    if (mainAxisCoord < limitMin) {
                        mainAxisCoord = limitMin;
                    } else if (mainAxisCoord > limitMax) {
                        mainAxisCoord = limitMax;
                    }
                }
                if (checkCrossAxis) {
                    var _middlewareData$offse,
                        _middlewareData$offse2,
                        _middlewareData$offse3,
                        _middlewareData$offse4;
                    const len = mainAxis === 'y' ? 'width' : 'height';
                    const isOriginSide = ['top', 'left'].includes(
                        getSide(placement)
                    );
                    const limitMin =
                        rects.reference[crossAxis] -
                        rects.floating[len] +
                        (isOriginSide
                            ? (_middlewareData$offse =
                                  (_middlewareData$offse2 =
                                      middlewareData.offset) == null
                                      ? void 0
                                      : _middlewareData$offse2[crossAxis]) != null
                                ? _middlewareData$offse
                                : 0
                            : 0) +
                        (isOriginSide ? 0 : computedOffset.crossAxis);
                    const limitMax =
                        rects.reference[crossAxis] +
                        rects.reference[len] +
                        (isOriginSide
                            ? 0
                            : (_middlewareData$offse3 =
                                    (_middlewareData$offse4 =
                                        middlewareData.offset) == null
                                        ? void 0
                                        : _middlewareData$offse4[crossAxis]) != null
                              ? _middlewareData$offse3
                              : 0) -
                        (isOriginSide ? computedOffset.crossAxis : 0);
                    if (crossAxisCoord < limitMin) {
                        crossAxisCoord = limitMin;
                    } else if (crossAxisCoord > limitMax) {
                        crossAxisCoord = limitMax;
                    }
                }
                return { [mainAxis]: mainAxisCoord, [crossAxis]: crossAxisCoord };
            }
        };
    };
    var size = function (options) {
        if (options === void 0) {
            options = {};
        }
        return {
            name: 'size',
            options,
            async fn(middlewareArguments) {
                const {
                    placement,
                    rects,
                    platform: platform2,
                    elements
                } = middlewareArguments;
                const { apply, ...detectOverflowOptions } = options;
                const overflow = await detectOverflow(
                    middlewareArguments,
                    detectOverflowOptions
                );
                const side = getSide(placement);
                const alignment = getAlignment(placement);
                let heightSide;
                let widthSide;
                if (side === 'top' || side === 'bottom') {
                    heightSide = side;
                    widthSide =
                        alignment ===
                        ((await (platform2.isRTL == null
                            ? void 0
                            : platform2.isRTL(elements.floating)))
                            ? 'start'
                            : 'end')
                            ? 'left'
                            : 'right';
                } else {
                    widthSide = side;
                    heightSide = alignment === 'end' ? 'top' : 'bottom';
                }
                const xMin = max(overflow.left, 0);
                const xMax = max(overflow.right, 0);
                const yMin = max(overflow.top, 0);
                const yMax = max(overflow.bottom, 0);
                const dimensions = {
                    availableHeight:
                        rects.floating.height -
                        (['left', 'right'].includes(placement)
                            ? 2 *
                              (yMin !== 0 || yMax !== 0
                                  ? yMin + yMax
                                  : max(overflow.top, overflow.bottom))
                            : overflow[heightSide]),
                    availableWidth:
                        rects.floating.width -
                        (['top', 'bottom'].includes(placement)
                            ? 2 *
                              (xMin !== 0 || xMax !== 0
                                  ? xMin + xMax
                                  : max(overflow.left, overflow.right))
                            : overflow[widthSide])
                };
                const prevDimensions = await platform2.getDimensions(
                    elements.floating
                );
                apply == null
                    ? void 0
                    : apply({ ...middlewareArguments, ...dimensions });
                const nextDimensions = await platform2.getDimensions(
                    elements.floating
                );
                if (
                    prevDimensions.width !== nextDimensions.width ||
                    prevDimensions.height !== nextDimensions.height
                ) {
                    return { reset: { rects: true } };
                }
                return {};
            }
        };
    };
    function isWindow(value) {
        return (
            value &&
            value.document &&
            value.location &&
            value.alert &&
            value.setInterval
        );
    }
    function getWindow(node) {
        if (node == null) {
            return window;
        }
        if (!isWindow(node)) {
            const ownerDocument = node.ownerDocument;
            return ownerDocument ? ownerDocument.defaultView || window : window;
        }
        return node;
    }
    function getComputedStyle$1(element) {
        return getWindow(element).getComputedStyle(element);
    }
    function getNodeName(node) {
        return isWindow(node)
            ? ''
            : node
              ? (node.nodeName || '').toLowerCase()
              : '';
    }
    function getUAString() {
        const uaData = navigator.userAgentData;
        if (uaData != null && uaData.brands) {
            return uaData.brands
                .map((item) => item.brand + '/' + item.version)
                .join(' ');
        }
        return navigator.userAgent;
    }
    function isHTMLElement(value) {
        return value instanceof getWindow(value).HTMLElement;
    }
    function isElement(value) {
        return value instanceof getWindow(value).Element;
    }
    function isNode(value) {
        return value instanceof getWindow(value).Node;
    }
    function isShadowRoot(node) {
        if (typeof ShadowRoot === 'undefined') {
            return false;
        }
        const OwnElement = getWindow(node).ShadowRoot;
        return node instanceof OwnElement || node instanceof ShadowRoot;
    }
    function isOverflowElement(element) {
        const { overflow, overflowX, overflowY } = getComputedStyle$1(element);
        return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }
    function isTableElement(element) {
        return ['table', 'td', 'th'].includes(getNodeName(element));
    }
    function isContainingBlock(element) {
        const isFirefox = /firefox/i.test(getUAString());
        const css2 = getComputedStyle$1(element);
        return (
            css2.transform !== 'none' ||
            css2.perspective !== 'none' ||
            css2.contain === 'paint' ||
            ['transform', 'perspective'].includes(css2.willChange) ||
            (isFirefox && css2.willChange === 'filter') ||
            (isFirefox && (css2.filter ? css2.filter !== 'none' : false))
        );
    }
    function isLayoutViewport() {
        return !/^((?!chrome|android).)*safari/i.test(getUAString());
    }
    var min2 = Math.min;
    var max2 = Math.max;
    var round = Math.round;
    function getBoundingClientRect(element, includeScale, isFixedStrategy) {
        var _win$visualViewport$o,
            _win$visualViewport,
            _win$visualViewport$o2,
            _win$visualViewport2;
        if (includeScale === void 0) {
            includeScale = false;
        }
        if (isFixedStrategy === void 0) {
            isFixedStrategy = false;
        }
        const clientRect = element.getBoundingClientRect();
        let scaleX = 1;
        let scaleY = 1;
        if (includeScale && isHTMLElement(element)) {
            scaleX =
                element.offsetWidth > 0
                    ? round(clientRect.width) / element.offsetWidth || 1
                    : 1;
            scaleY =
                element.offsetHeight > 0
                    ? round(clientRect.height) / element.offsetHeight || 1
                    : 1;
        }
        const win = isElement(element) ? getWindow(element) : window;
        const addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
        const x3 =
            (clientRect.left +
                (addVisualOffsets
                    ? (_win$visualViewport$o =
                          (_win$visualViewport = win.visualViewport) == null
                              ? void 0
                              : _win$visualViewport.offsetLeft) != null
                        ? _win$visualViewport$o
                        : 0
                    : 0)) /
            scaleX;
        const y4 =
            (clientRect.top +
                (addVisualOffsets
                    ? (_win$visualViewport$o2 =
                          (_win$visualViewport2 = win.visualViewport) == null
                              ? void 0
                              : _win$visualViewport2.offsetTop) != null
                        ? _win$visualViewport$o2
                        : 0
                    : 0)) /
            scaleY;
        const width = clientRect.width / scaleX;
        const height = clientRect.height / scaleY;
        return {
            width,
            height,
            top: y4,
            right: x3 + width,
            bottom: y4 + height,
            left: x3,
            x: x3,
            y: y4
        };
    }
    function getDocumentElement(node) {
        return (
            (isNode(node) ? node.ownerDocument : node.document) || window.document
        ).documentElement;
    }
    function getNodeScroll(element) {
        if (isElement(element)) {
            return { scrollLeft: element.scrollLeft, scrollTop: element.scrollTop };
        }
        return { scrollLeft: element.pageXOffset, scrollTop: element.pageYOffset };
    }
    function getWindowScrollBarX(element) {
        return (
            getBoundingClientRect(getDocumentElement(element)).left +
            getNodeScroll(element).scrollLeft
        );
    }
    function isScaled(element) {
        const rect = getBoundingClientRect(element);
        return (
            round(rect.width) !== element.offsetWidth ||
            round(rect.height) !== element.offsetHeight
        );
    }
    function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
        const isOffsetParentAnElement = isHTMLElement(offsetParent);
        const documentElement = getDocumentElement(offsetParent);
        const rect = getBoundingClientRect(
            element,
            isOffsetParentAnElement && isScaled(offsetParent),
            strategy === 'fixed'
        );
        let scroll = { scrollLeft: 0, scrollTop: 0 };
        const offsets = { x: 0, y: 0 };
        if (
            isOffsetParentAnElement ||
            (!isOffsetParentAnElement && strategy !== 'fixed')
        ) {
            if (
                getNodeName(offsetParent) !== 'body' ||
                isOverflowElement(documentElement)
            ) {
                scroll = getNodeScroll(offsetParent);
            }
            if (isHTMLElement(offsetParent)) {
                const offsetRect = getBoundingClientRect(offsetParent, true);
                offsets.x = offsetRect.x + offsetParent.clientLeft;
                offsets.y = offsetRect.y + offsetParent.clientTop;
            } else if (documentElement) {
                offsets.x = getWindowScrollBarX(documentElement);
            }
        }
        return {
            x: rect.left + scroll.scrollLeft - offsets.x,
            y: rect.top + scroll.scrollTop - offsets.y,
            width: rect.width,
            height: rect.height
        };
    }
    function getParentNode(node) {
        if (getNodeName(node) === 'html') {
            return node;
        }
        return (
            node.assignedSlot ||
            node.parentNode ||
            (isShadowRoot(node) ? node.host : null) ||
            getDocumentElement(node)
        );
    }
    function getTrueOffsetParent(element) {
        if (
            !isHTMLElement(element) ||
            getComputedStyle(element).position === 'fixed'
        ) {
            return null;
        }
        return element.offsetParent;
    }
    function getContainingBlock(element) {
        let currentNode = getParentNode(element);
        if (isShadowRoot(currentNode)) {
            currentNode = currentNode.host;
        }
        while (
            isHTMLElement(currentNode) &&
            !['html', 'body'].includes(getNodeName(currentNode))
        ) {
            if (isContainingBlock(currentNode)) {
                return currentNode;
            } else {
                currentNode = currentNode.parentNode;
            }
        }
        return null;
    }
    function getOffsetParent(element) {
        const window2 = getWindow(element);
        let offsetParent = getTrueOffsetParent(element);
        while (
            offsetParent &&
            isTableElement(offsetParent) &&
            getComputedStyle(offsetParent).position === 'static'
        ) {
            offsetParent = getTrueOffsetParent(offsetParent);
        }
        if (
            offsetParent &&
            (getNodeName(offsetParent) === 'html' ||
                (getNodeName(offsetParent) === 'body' &&
                    getComputedStyle(offsetParent).position === 'static' &&
                    !isContainingBlock(offsetParent)))
        ) {
            return window2;
        }
        return offsetParent || getContainingBlock(element) || window2;
    }
    function getDimensions(element) {
        if (isHTMLElement(element)) {
            return { width: element.offsetWidth, height: element.offsetHeight };
        }
        const rect = getBoundingClientRect(element);
        return { width: rect.width, height: rect.height };
    }
    function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
        let { rect, offsetParent, strategy } = _ref;
        const isOffsetParentAnElement = isHTMLElement(offsetParent);
        const documentElement = getDocumentElement(offsetParent);
        if (offsetParent === documentElement) {
            return rect;
        }
        let scroll = { scrollLeft: 0, scrollTop: 0 };
        const offsets = { x: 0, y: 0 };
        if (
            isOffsetParentAnElement ||
            (!isOffsetParentAnElement && strategy !== 'fixed')
        ) {
            if (
                getNodeName(offsetParent) !== 'body' ||
                isOverflowElement(documentElement)
            ) {
                scroll = getNodeScroll(offsetParent);
            }
            if (isHTMLElement(offsetParent)) {
                const offsetRect = getBoundingClientRect(offsetParent, true);
                offsets.x = offsetRect.x + offsetParent.clientLeft;
                offsets.y = offsetRect.y + offsetParent.clientTop;
            }
        }
        return {
            ...rect,
            x: rect.x - scroll.scrollLeft + offsets.x,
            y: rect.y - scroll.scrollTop + offsets.y
        };
    }
    function getViewportRect(element, strategy) {
        const win = getWindow(element);
        const html = getDocumentElement(element);
        const visualViewport = win.visualViewport;
        let width = html.clientWidth;
        let height = html.clientHeight;
        let x3 = 0;
        let y4 = 0;
        if (visualViewport) {
            width = visualViewport.width;
            height = visualViewport.height;
            const layoutViewport = isLayoutViewport();
            if (layoutViewport || (!layoutViewport && strategy === 'fixed')) {
                x3 = visualViewport.offsetLeft;
                y4 = visualViewport.offsetTop;
            }
        }
        return { width, height, x: x3, y: y4 };
    }
    function getDocumentRect(element) {
        var _element$ownerDocumen;
        const html = getDocumentElement(element);
        const scroll = getNodeScroll(element);
        const body =
            (_element$ownerDocumen = element.ownerDocument) == null
                ? void 0
                : _element$ownerDocumen.body;
        const width = max2(
            html.scrollWidth,
            html.clientWidth,
            body ? body.scrollWidth : 0,
            body ? body.clientWidth : 0
        );
        const height = max2(
            html.scrollHeight,
            html.clientHeight,
            body ? body.scrollHeight : 0,
            body ? body.clientHeight : 0
        );
        let x3 = -scroll.scrollLeft + getWindowScrollBarX(element);
        const y4 = -scroll.scrollTop;
        if (getComputedStyle$1(body || html).direction === 'rtl') {
            x3 += max2(html.clientWidth, body ? body.clientWidth : 0) - width;
        }
        return { width, height, x: x3, y: y4 };
    }
    function getNearestOverflowAncestor(node) {
        const parentNode = getParentNode(node);
        if (['html', 'body', '#document'].includes(getNodeName(parentNode))) {
            return node.ownerDocument.body;
        }
        if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
            return parentNode;
        }
        return getNearestOverflowAncestor(parentNode);
    }
    function getOverflowAncestors(node, list) {
        var _node$ownerDocument;
        if (list === void 0) {
            list = [];
        }
        const scrollableAncestor = getNearestOverflowAncestor(node);
        const isBody =
            scrollableAncestor ===
            ((_node$ownerDocument = node.ownerDocument) == null
                ? void 0
                : _node$ownerDocument.body);
        const win = getWindow(scrollableAncestor);
        const target = isBody
            ? [win].concat(
                  win.visualViewport || [],
                  isOverflowElement(scrollableAncestor) ? scrollableAncestor : []
              )
            : scrollableAncestor;
        const updatedList = list.concat(target);
        return isBody
            ? updatedList
            : updatedList.concat(getOverflowAncestors(target));
    }
    function contains(parent, child) {
        const rootNode = child.getRootNode == null ? void 0 : child.getRootNode();
        if (parent.contains(child)) {
            return true;
        } else if (rootNode && isShadowRoot(rootNode)) {
            let next = child;
            do {
                if (next && parent === next) {
                    return true;
                }
                next = next.parentNode || next.host;
            } while (next);
        }
        return false;
    }
    function getInnerBoundingClientRect(element, strategy) {
        const clientRect = getBoundingClientRect(
            element,
            false,
            strategy === 'fixed'
        );
        const top = clientRect.top + element.clientTop;
        const left = clientRect.left + element.clientLeft;
        return {
            top,
            left,
            x: left,
            y: top,
            right: left + element.clientWidth,
            bottom: top + element.clientHeight,
            width: element.clientWidth,
            height: element.clientHeight
        };
    }
    function getClientRectFromClippingAncestor(element, clippingParent, strategy) {
        if (clippingParent === 'viewport') {
            return rectToClientRect(getViewportRect(element, strategy));
        }
        if (isElement(clippingParent)) {
            return getInnerBoundingClientRect(clippingParent, strategy);
        }
        return rectToClientRect(getDocumentRect(getDocumentElement(element)));
    }
    function getClippingAncestors(element) {
        const clippingAncestors = getOverflowAncestors(element);
        const canEscapeClipping = ['absolute', 'fixed'].includes(
            getComputedStyle$1(element).position
        );
        const clipperElement =
            canEscapeClipping && isHTMLElement(element)
                ? getOffsetParent(element)
                : element;
        if (!isElement(clipperElement)) {
            return [];
        }
        return clippingAncestors.filter(
            (clippingAncestors2) =>
                isElement(clippingAncestors2) &&
                contains(clippingAncestors2, clipperElement) &&
                getNodeName(clippingAncestors2) !== 'body'
        );
    }
    function getClippingRect(_ref) {
        let { element, boundary, rootBoundary, strategy } = _ref;
        const mainClippingAncestors =
            boundary === 'clippingAncestors'
                ? getClippingAncestors(element)
                : [].concat(boundary);
        const clippingAncestors = [...mainClippingAncestors, rootBoundary];
        const firstClippingAncestor = clippingAncestors[0];
        const clippingRect = clippingAncestors.reduce(
            (accRect, clippingAncestor) => {
                const rect = getClientRectFromClippingAncestor(
                    element,
                    clippingAncestor,
                    strategy
                );
                accRect.top = max2(rect.top, accRect.top);
                accRect.right = min2(rect.right, accRect.right);
                accRect.bottom = min2(rect.bottom, accRect.bottom);
                accRect.left = max2(rect.left, accRect.left);
                return accRect;
            },
            getClientRectFromClippingAncestor(
                element,
                firstClippingAncestor,
                strategy
            )
        );
        return {
            width: clippingRect.right - clippingRect.left,
            height: clippingRect.bottom - clippingRect.top,
            x: clippingRect.left,
            y: clippingRect.top
        };
    }
    var platform = {
        getClippingRect,
        convertOffsetParentRelativeRectToViewportRelativeRect,
        isElement,
        getDimensions,
        getOffsetParent,
        getDocumentElement,
        getElementRects: (_ref) => {
            let { reference, floating, strategy } = _ref;
            return {
                reference: getRectRelativeToOffsetParent(
                    reference,
                    getOffsetParent(floating),
                    strategy
                ),
                floating: { ...getDimensions(floating), x: 0, y: 0 }
            };
        },
        getClientRects: (element) => Array.from(element.getClientRects()),
        isRTL: (element) => getComputedStyle$1(element).direction === 'rtl'
    };
    function autoUpdate(reference, floating, update, options) {
        if (options === void 0) {
            options = {};
        }
        const {
            ancestorScroll: _ancestorScroll = true,
            ancestorResize: _ancestorResize = true,
            elementResize = true,
            animationFrame = false
        } = options;
        const ancestorScroll = _ancestorScroll && !animationFrame;
        const ancestorResize = _ancestorResize && !animationFrame;
        const ancestors =
            ancestorScroll || ancestorResize
                ? [
                      ...(isElement(reference)
                          ? getOverflowAncestors(reference)
                          : []),
                      ...getOverflowAncestors(floating)
                  ]
                : [];
        ancestors.forEach((ancestor) => {
            ancestorScroll &&
                ancestor.addEventListener('scroll', update, { passive: true });
            ancestorResize && ancestor.addEventListener('resize', update);
        });
        let observer = null;
        if (elementResize) {
            let initialUpdate = true;
            observer = new ResizeObserver(() => {
                if (!initialUpdate) {
                    update();
                }
                initialUpdate = false;
            });
            isElement(reference) && !animationFrame && observer.observe(reference);
            observer.observe(floating);
        }
        let frameId;
        let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
        if (animationFrame) {
            frameLoop();
        }
        function frameLoop() {
            const nextRefRect = getBoundingClientRect(reference);
            if (
                prevRefRect &&
                (nextRefRect.x !== prevRefRect.x ||
                    nextRefRect.y !== prevRefRect.y ||
                    nextRefRect.width !== prevRefRect.width ||
                    nextRefRect.height !== prevRefRect.height)
            ) {
                update();
            }
            prevRefRect = nextRefRect;
            frameId = requestAnimationFrame(frameLoop);
        }
        update();
        return () => {
            var _observer;
            ancestors.forEach((ancestor) => {
                ancestorScroll && ancestor.removeEventListener('scroll', update);
                ancestorResize && ancestor.removeEventListener('resize', update);
            });
            (_observer = observer) == null ? void 0 : _observer.disconnect();
            observer = null;
            if (animationFrame) {
                cancelAnimationFrame(frameId);
            }
        };
    }
    var computePosition2 = (reference, floating, options) =>
        computePosition(reference, floating, { platform, ...options });
    var index = typeof document !== 'undefined' ? React5.useLayoutEffect : React5.useEffect;
    function deepEqual(a4, b4) {
        if (a4 === b4) {
            return true;
        }
        if (typeof a4 !== typeof b4) {
            return false;
        }
        if (typeof a4 === 'function' && a4.toString() === b4.toString()) {
            return true;
        }
        let length, i4, keys;
        if (a4 && b4 && typeof a4 == 'object') {
            if (Array.isArray(a4)) {
                length = a4.length;
                if (length != b4.length) return false;
                for (i4 = length; i4-- !== 0; ) {
                    if (!deepEqual(a4[i4], b4[i4])) {
                        return false;
                    }
                }
                return true;
            }
            keys = Object.keys(a4);
            length = keys.length;
            if (length !== Object.keys(b4).length) {
                return false;
            }
            for (i4 = length; i4-- !== 0; ) {
                if (!Object.prototype.hasOwnProperty.call(b4, keys[i4])) {
                    return false;
                }
            }
            for (i4 = length; i4-- !== 0; ) {
                const key = keys[i4];
                if (key === '_owner' && a4.$$typeof) {
                    continue;
                }
                if (!deepEqual(a4[key], b4[key])) {
                    return false;
                }
            }
            return true;
        }
        return a4 !== a4 && b4 !== b4;
    }
    function useLatestRef(value) {
        const ref = React5__namespace.useRef(value);
        index(() => {
            ref.current = value;
        });
        return ref;
    }
    function useFloating(_temp) {
        let {
            middleware,
            placement = 'bottom',
            strategy = 'absolute',
            whileElementsMounted
        } = _temp === void 0 ? {} : _temp;
        const reference = React5__namespace.useRef(null);
        const floating = React5__namespace.useRef(null);
        const whileElementsMountedRef = useLatestRef(whileElementsMounted);
        const cleanupRef = React5__namespace.useRef(null);
        const [data, setData] = React5__namespace.useState({
            x: null,
            y: null,
            strategy,
            placement,
            middlewareData: {}
        });
        const [latestMiddleware, setLatestMiddleware] = React5__namespace.useState(middleware);
        if (
            !deepEqual(
                latestMiddleware == null
                    ? void 0
                    : latestMiddleware.map((_ref) => {
                          let { options } = _ref;
                          return options;
                      }),
                middleware == null
                    ? void 0
                    : middleware.map((_ref2) => {
                          let { options } = _ref2;
                          return options;
                      })
            )
        ) {
            setLatestMiddleware(middleware);
        }
        const update = React5__namespace.useCallback(() => {
            if (!reference.current || !floating.current) {
                return;
            }
            computePosition2(reference.current, floating.current, {
                middleware: latestMiddleware,
                placement,
                strategy
            }).then((data2) => {
                if (isMountedRef.current) {
                    $7SXl2$reactdom__namespace.flushSync(() => {
                        setData(data2);
                    });
                }
            });
        }, [latestMiddleware, placement, strategy]);
        index(() => {
            if (isMountedRef.current) {
                update();
            }
        }, [update]);
        const isMountedRef = React5__namespace.useRef(false);
        index(() => {
            isMountedRef.current = true;
            return () => {
                isMountedRef.current = false;
            };
        }, []);
        const runElementMountCallback = React5__namespace.useCallback(() => {
            if (typeof cleanupRef.current === 'function') {
                cleanupRef.current();
                cleanupRef.current = null;
            }
            if (reference.current && floating.current) {
                if (whileElementsMountedRef.current) {
                    const cleanupFn = whileElementsMountedRef.current(
                        reference.current,
                        floating.current,
                        update
                    );
                    cleanupRef.current = cleanupFn;
                } else {
                    update();
                }
            }
        }, [update, whileElementsMountedRef]);
        const setReference = React5__namespace.useCallback(
            (node) => {
                reference.current = node;
                runElementMountCallback();
            },
            [runElementMountCallback]
        );
        const setFloating = React5__namespace.useCallback(
            (node) => {
                floating.current = node;
                runElementMountCallback();
            },
            [runElementMountCallback]
        );
        const refs = React5__namespace.useMemo(() => ({ reference, floating }), []);
        return React5__namespace.useMemo(
            () => ({
                ...data,
                update,
                refs,
                reference: setReference,
                floating: setFloating
            }),
            [data, update, refs, setReference, setFloating]
        );
    }
    var arrow2 = (options) => {
        const { element, padding } = options;
        function isRef(value) {
            return Object.prototype.hasOwnProperty.call(value, 'current');
        }
        return {
            name: 'arrow',
            options,
            fn(args) {
                if (isRef(element)) {
                    if (element.current != null) {
                        return arrow({ element: element.current, padding }).fn(
                            args
                        );
                    }
                    return {};
                } else if (element) {
                    return arrow({ element, padding }).fn(args);
                }
                return {};
            }
        };
    };
    var $7e8f5cd07187803e$export$21b07c8f274aebd5 = React5.forwardRef(
        (props3, forwardedRef) => {
            const { children, width = 10, height = 5, ...arrowProps } = props3;
            return React5.createElement(
                $8927f6f2acc4f386$export$250ffa63cdc0d034.svg,
                _extends({}, arrowProps, {
                    ref: forwardedRef,
                    width,
                    height,
                    viewBox: '0 0 30 10',
                    preserveAspectRatio: 'none'
                }),
                props3.asChild
                    ? children
                    : React5.createElement('polygon', { points: '0,0 30,0 15,10' })
            );
        }
    );
    var $7e8f5cd07187803e$export$be92b6f5f03c0fe9 =
        $7e8f5cd07187803e$export$21b07c8f274aebd5;
    function $db6c3485150b8e66$export$1ab7ae714698c4b8(element) {
        const [size2, setSize] = React5.useState(void 0);
        $9f79659886946c16$export$e5c5a5f917a5871c(() => {
            if (element) {
                setSize({
                    width: element.offsetWidth,
                    height: element.offsetHeight
                });
                const resizeObserver = new ResizeObserver((entries) => {
                    if (!Array.isArray(entries)) return;
                    if (!entries.length) return;
                    const entry = entries[0];
                    let width;
                    let height;
                    if ('borderBoxSize' in entry) {
                        const borderSizeEntry = entry['borderBoxSize'];
                        const borderSize = Array.isArray(borderSizeEntry)
                            ? borderSizeEntry[0]
                            : borderSizeEntry;
                        width = borderSize['inlineSize'];
                        height = borderSize['blockSize'];
                    } else {
                        width = element.offsetWidth;
                        height = element.offsetHeight;
                    }
                    setSize({ width, height });
                });
                resizeObserver.observe(element, { box: 'border-box' });
                return () => resizeObserver.unobserve(element);
            } else setSize(void 0);
        }, [element]);
        return size2;
    }
    var $cf1ac5d9fe0e8206$var$POPPER_NAME = 'Popper';
    var [
        $cf1ac5d9fe0e8206$var$createPopperContext,
        $cf1ac5d9fe0e8206$export$722aac194ae923
    ] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($cf1ac5d9fe0e8206$var$POPPER_NAME);
    var [
        $cf1ac5d9fe0e8206$var$PopperProvider,
        $cf1ac5d9fe0e8206$var$usePopperContext
    ] = $cf1ac5d9fe0e8206$var$createPopperContext(
        $cf1ac5d9fe0e8206$var$POPPER_NAME
    );
    var $cf1ac5d9fe0e8206$export$badac9ada3a0bdf9 = (props3) => {
        const { __scopePopper, children } = props3;
        const [anchor, setAnchor] = React5.useState(null);
        return React5.createElement(
            $cf1ac5d9fe0e8206$var$PopperProvider,
            { scope: __scopePopper, anchor, onAnchorChange: setAnchor },
            children
        );
    };
    var $cf1ac5d9fe0e8206$var$ANCHOR_NAME = 'PopperAnchor';
    var $cf1ac5d9fe0e8206$export$ecd4e1ccab6ed6d = React5.forwardRef(
        (props3, forwardedRef) => {
            const { __scopePopper, virtualRef, ...anchorProps } = props3;
            const context = $cf1ac5d9fe0e8206$var$usePopperContext(
                $cf1ac5d9fe0e8206$var$ANCHOR_NAME,
                __scopePopper
            );
            const ref = React5.useRef(null);
            const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(
                forwardedRef,
                ref
            );
            React5.useEffect(() => {
                context.onAnchorChange(
                    (virtualRef === null || virtualRef === void 0
                        ? void 0
                        : virtualRef.current) || ref.current
                );
            });
            return virtualRef
                ? null
                : React5.createElement(
                      $8927f6f2acc4f386$export$250ffa63cdc0d034.div,
                      _extends({}, anchorProps, { ref: composedRefs })
                  );
        }
    );
    var $cf1ac5d9fe0e8206$var$CONTENT_NAME = 'PopperContent';
    var [
        $cf1ac5d9fe0e8206$var$PopperContentProvider,
        $cf1ac5d9fe0e8206$var$useContentContext
    ] = $cf1ac5d9fe0e8206$var$createPopperContext(
        $cf1ac5d9fe0e8206$var$CONTENT_NAME
    );
    var [
        $cf1ac5d9fe0e8206$var$PositionContextProvider,
        $cf1ac5d9fe0e8206$var$usePositionContext
    ] = $cf1ac5d9fe0e8206$var$createPopperContext(
        $cf1ac5d9fe0e8206$var$CONTENT_NAME,
        { hasParent: false, positionUpdateFns: new Set() }
    );
    var $cf1ac5d9fe0e8206$export$bc4ae5855d3c4fc = React5.forwardRef(
        (props3, forwardedRef) => {
            var _arrowSize$width,
                _arrowSize$height,
                _middlewareData$arrow,
                _middlewareData$arrow2,
                _middlewareData$arrow3,
                _middlewareData$hide,
                _middlewareData$trans,
                _middlewareData$trans2;
            const {
                __scopePopper,
                side = 'bottom',
                sideOffset = 0,
                align = 'center',
                alignOffset = 0,
                arrowPadding = 0,
                collisionBoundary = [],
                collisionPadding: collisionPaddingProp = 0,
                sticky = 'partial',
                hideWhenDetached = false,
                avoidCollisions = true,
                onPlaced,
                ...contentProps
            } = props3;
            const context = $cf1ac5d9fe0e8206$var$usePopperContext(
                $cf1ac5d9fe0e8206$var$CONTENT_NAME,
                __scopePopper
            );
            const [content, setContent] = React5.useState(null);
            const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(
                forwardedRef,
                (node) => setContent(node)
            );
            const [arrow3, setArrow] = React5.useState(null);
            const arrowSize = $db6c3485150b8e66$export$1ab7ae714698c4b8(arrow3);
            const arrowWidth =
                (_arrowSize$width =
                    arrowSize === null || arrowSize === void 0
                        ? void 0
                        : arrowSize.width) !== null && _arrowSize$width !== void 0
                    ? _arrowSize$width
                    : 0;
            const arrowHeight =
                (_arrowSize$height =
                    arrowSize === null || arrowSize === void 0
                        ? void 0
                        : arrowSize.height) !== null && _arrowSize$height !== void 0
                    ? _arrowSize$height
                    : 0;
            const desiredPlacement = side + (align !== 'center' ? '-' + align : '');
            const collisionPadding =
                typeof collisionPaddingProp === 'number'
                    ? collisionPaddingProp
                    : {
                          top: 0,
                          right: 0,
                          bottom: 0,
                          left: 0,
                          ...collisionPaddingProp
                      };
            const boundary = Array.isArray(collisionBoundary)
                ? collisionBoundary
                : [collisionBoundary];
            const hasExplicitBoundaries = boundary.length > 0;
            const detectOverflowOptions = {
                padding: collisionPadding,
                boundary: boundary.filter($cf1ac5d9fe0e8206$var$isNotNull),
                altBoundary: hasExplicitBoundaries
            };
            const {
                reference,
                floating,
                strategy,
                x: x3,
                y: y4,
                placement,
                middlewareData,
                update
            } = useFloating({
                strategy: 'fixed',
                placement: desiredPlacement,
                whileElementsMounted: autoUpdate,
                middleware: [
                    $cf1ac5d9fe0e8206$var$anchorCssProperties(),
                    offset({
                        mainAxis: sideOffset + arrowHeight,
                        alignmentAxis: alignOffset
                    }),
                    avoidCollisions
                        ? shift({
                              mainAxis: true,
                              crossAxis: false,
                              limiter: sticky === 'partial' ? limitShift() : void 0,
                              ...detectOverflowOptions
                          })
                        : void 0,
                    arrow3
                        ? arrow2({ element: arrow3, padding: arrowPadding })
                        : void 0,
                    avoidCollisions ? flip({ ...detectOverflowOptions }) : void 0,
                    size({
                        ...detectOverflowOptions,
                        apply: ({
                            elements,
                            availableWidth: width,
                            availableHeight: height
                        }) => {
                            elements.floating.style.setProperty(
                                '--radix-popper-available-width',
                                `${width}px`
                            );
                            elements.floating.style.setProperty(
                                '--radix-popper-available-height',
                                `${height}px`
                            );
                        }
                    }),
                    $cf1ac5d9fe0e8206$var$transformOrigin({
                        arrowWidth,
                        arrowHeight
                    }),
                    hideWhenDetached
                        ? hide({ strategy: 'referenceHidden' })
                        : void 0
                ].filter($cf1ac5d9fe0e8206$var$isDefined)
            });
            $9f79659886946c16$export$e5c5a5f917a5871c(() => {
                reference(context.anchor);
            }, [reference, context.anchor]);
            const isPlaced = x3 !== null && y4 !== null;
            const [placedSide, placedAlign] =
                $cf1ac5d9fe0e8206$var$getSideAndAlignFromPlacement(placement);
            const handlePlaced =
                $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onPlaced);
            $9f79659886946c16$export$e5c5a5f917a5871c(() => {
                if (isPlaced)
                    handlePlaced === null ||
                        handlePlaced === void 0 ||
                        handlePlaced();
            }, [isPlaced, handlePlaced]);
            const arrowX =
                (_middlewareData$arrow = middlewareData.arrow) === null ||
                _middlewareData$arrow === void 0
                    ? void 0
                    : _middlewareData$arrow.x;
            const arrowY =
                (_middlewareData$arrow2 = middlewareData.arrow) === null ||
                _middlewareData$arrow2 === void 0
                    ? void 0
                    : _middlewareData$arrow2.y;
            const cannotCenterArrow =
                ((_middlewareData$arrow3 = middlewareData.arrow) === null ||
                _middlewareData$arrow3 === void 0
                    ? void 0
                    : _middlewareData$arrow3.centerOffset) !== 0;
            const [contentZIndex, setContentZIndex] = React5.useState();
            $9f79659886946c16$export$e5c5a5f917a5871c(() => {
                if (content)
                    setContentZIndex(window.getComputedStyle(content).zIndex);
            }, [content]);
            const { hasParent, positionUpdateFns } =
                $cf1ac5d9fe0e8206$var$usePositionContext(
                    $cf1ac5d9fe0e8206$var$CONTENT_NAME,
                    __scopePopper
                );
            const isRoot = !hasParent;
            React5.useLayoutEffect(() => {
                if (!isRoot) {
                    positionUpdateFns.add(update);
                    return () => {
                        positionUpdateFns.delete(update);
                    };
                }
            }, [isRoot, positionUpdateFns, update]);
            $9f79659886946c16$export$e5c5a5f917a5871c(() => {
                if (isRoot && isPlaced)
                    Array.from(positionUpdateFns)
                        .reverse()
                        .forEach((fn) => requestAnimationFrame(fn));
            }, [isRoot, isPlaced, positionUpdateFns]);
            const commonProps = {
                'data-side': placedSide,
                'data-align': placedAlign,
                ...contentProps,
                ref: composedRefs,
                style: {
                    ...contentProps.style,
                    animation: !isPlaced ? 'none' : void 0,
                    opacity:
                        (_middlewareData$hide = middlewareData.hide) !== null &&
                        _middlewareData$hide !== void 0 &&
                        _middlewareData$hide.referenceHidden
                            ? 0
                            : void 0
                }
            };
            return React5.createElement(
                'div',
                {
                    ref: floating,
                    'data-radix-popper-content-wrapper': '',
                    style: {
                        position: strategy,
                        left: 0,
                        top: 0,
                        transform: isPlaced
                            ? `translate3d(${Math.round(x3)}px, ${Math.round(y4)}px, 0)`
                            : 'translate3d(0, -200%, 0)',
                        minWidth: 'max-content',
                        zIndex: contentZIndex,
                        ['--radix-popper-transform-origin']: [
                            (_middlewareData$trans =
                                middlewareData.transformOrigin) === null ||
                            _middlewareData$trans === void 0
                                ? void 0
                                : _middlewareData$trans.x,
                            (_middlewareData$trans2 =
                                middlewareData.transformOrigin) === null ||
                            _middlewareData$trans2 === void 0
                                ? void 0
                                : _middlewareData$trans2.y
                        ].join(' ')
                    },
                    dir: props3.dir
                },
                React5.createElement(
                    $cf1ac5d9fe0e8206$var$PopperContentProvider,
                    {
                        scope: __scopePopper,
                        placedSide,
                        onArrowChange: setArrow,
                        arrowX,
                        arrowY,
                        shouldHideArrow: cannotCenterArrow
                    },
                    isRoot
                        ? React5.createElement(
                              $cf1ac5d9fe0e8206$var$PositionContextProvider,
                              {
                                  scope: __scopePopper,
                                  hasParent: true,
                                  positionUpdateFns
                              },
                              React5.createElement(
                                  $8927f6f2acc4f386$export$250ffa63cdc0d034.div,
                                  commonProps
                              )
                          )
                        : React5.createElement(
                              $8927f6f2acc4f386$export$250ffa63cdc0d034.div,
                              commonProps
                          )
                )
            );
        }
    );
    var $cf1ac5d9fe0e8206$var$ARROW_NAME = 'PopperArrow';
    var $cf1ac5d9fe0e8206$var$OPPOSITE_SIDE = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
    };
    var $cf1ac5d9fe0e8206$export$79d62cd4e10a3fd0 = React5.forwardRef(
        function $cf1ac5d9fe0e8206$export$79d62cd4e10a3fd02(props3, forwardedRef) {
            const { __scopePopper, ...arrowProps } = props3;
            const contentContext = $cf1ac5d9fe0e8206$var$useContentContext(
                $cf1ac5d9fe0e8206$var$ARROW_NAME,
                __scopePopper
            );
            const baseSide =
                $cf1ac5d9fe0e8206$var$OPPOSITE_SIDE[contentContext.placedSide];
            return React5.createElement(
                'span',
                {
                    ref: contentContext.onArrowChange,
                    style: {
                        position: 'absolute',
                        left: contentContext.arrowX,
                        top: contentContext.arrowY,
                        [baseSide]: 0,
                        transformOrigin: {
                            top: '',
                            right: '0 0',
                            bottom: 'center 0',
                            left: '100% 0'
                        }[contentContext.placedSide],
                        transform: {
                            top: 'translateY(100%)',
                            right: 'translateY(50%) rotate(90deg) translateX(-50%)',
                            bottom: `rotate(180deg)`,
                            left: 'translateY(50%) rotate(-90deg) translateX(50%)'
                        }[contentContext.placedSide],
                        visibility: contentContext.shouldHideArrow
                            ? 'hidden'
                            : void 0
                    }
                },
                React5.createElement(
                    $7e8f5cd07187803e$export$be92b6f5f03c0fe9,
                    _extends({}, arrowProps, {
                        ref: forwardedRef,
                        style: { ...arrowProps.style, display: 'block' }
                    })
                )
            );
        }
    );
    function $cf1ac5d9fe0e8206$var$isDefined(value) {
        return value !== void 0;
    }
    function $cf1ac5d9fe0e8206$var$isNotNull(value) {
        return value !== null;
    }
    var $cf1ac5d9fe0e8206$var$anchorCssProperties = () => ({
        name: 'anchorCssProperties',
        fn(data) {
            const { rects, elements } = data;
            const { width, height } = rects.reference;
            elements.floating.style.setProperty(
                '--radix-popper-anchor-width',
                `${width}px`
            );
            elements.floating.style.setProperty(
                '--radix-popper-anchor-height',
                `${height}px`
            );
            return {};
        }
    });
    var $cf1ac5d9fe0e8206$var$transformOrigin = (options) => ({
        name: 'transformOrigin',
        options,
        fn(data) {
            var _middlewareData$arrow4,
                _middlewareData$arrow5,
                _middlewareData$arrow6,
                _middlewareData$arrow7,
                _middlewareData$arrow8;
            const { placement, rects, middlewareData } = data;
            const cannotCenterArrow =
                ((_middlewareData$arrow4 = middlewareData.arrow) === null ||
                _middlewareData$arrow4 === void 0
                    ? void 0
                    : _middlewareData$arrow4.centerOffset) !== 0;
            const isArrowHidden = cannotCenterArrow;
            const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
            const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
            const [placedSide, placedAlign] =
                $cf1ac5d9fe0e8206$var$getSideAndAlignFromPlacement(placement);
            const noArrowAlign = { start: '0%', center: '50%', end: '100%' }[
                placedAlign
            ];
            const arrowXCenter =
                ((_middlewareData$arrow5 =
                    (_middlewareData$arrow6 = middlewareData.arrow) === null ||
                    _middlewareData$arrow6 === void 0
                        ? void 0
                        : _middlewareData$arrow6.x) !== null &&
                _middlewareData$arrow5 !== void 0
                    ? _middlewareData$arrow5
                    : 0) +
                arrowWidth / 2;
            const arrowYCenter =
                ((_middlewareData$arrow7 =
                    (_middlewareData$arrow8 = middlewareData.arrow) === null ||
                    _middlewareData$arrow8 === void 0
                        ? void 0
                        : _middlewareData$arrow8.y) !== null &&
                _middlewareData$arrow7 !== void 0
                    ? _middlewareData$arrow7
                    : 0) +
                arrowHeight / 2;
            let x3 = '';
            let y4 = '';
            if (placedSide === 'bottom') {
                x3 = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
                y4 = `${-arrowHeight}px`;
            } else if (placedSide === 'top') {
                x3 = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
                y4 = `${rects.floating.height + arrowHeight}px`;
            } else if (placedSide === 'right') {
                x3 = `${-arrowHeight}px`;
                y4 = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
            } else if (placedSide === 'left') {
                x3 = `${rects.floating.width + arrowHeight}px`;
                y4 = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
            }
            return { data: { x: x3, y: y4 } };
        }
    });
    function $cf1ac5d9fe0e8206$var$getSideAndAlignFromPlacement(placement) {
        const [side, align = 'center'] = placement.split('-');
        return [side, align];
    }
    var $cf1ac5d9fe0e8206$export$be92b6f5f03c0fe9 =
        $cf1ac5d9fe0e8206$export$badac9ada3a0bdf9;
    var $cf1ac5d9fe0e8206$export$b688253958b8dfe7 =
        $cf1ac5d9fe0e8206$export$ecd4e1ccab6ed6d;
    var $cf1ac5d9fe0e8206$export$7c6e2c02157bb7d2 =
        $cf1ac5d9fe0e8206$export$bc4ae5855d3c4fc;
    var $cf1ac5d9fe0e8206$export$21b07c8f274aebd5 =
        $cf1ac5d9fe0e8206$export$79d62cd4e10a3fd0;
    function $fe963b355347cc68$export$3e6543de14f8614f(initialState2, machine) {
        return React5.useReducer((state, event) => {
            const nextState = machine[state][event];
            return nextState !== null && nextState !== void 0 ? nextState : state;
        }, initialState2);
    }
    var $921a889cee6df7e8$export$99c2b779aa4e8b8b = (props3) => {
        const { present, children } = props3;
        const presence = $921a889cee6df7e8$var$usePresence(present);
        const child =
            typeof children === 'function'
                ? children({ present: presence.isPresent })
                : React5.Children.only(children);
        const ref = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(
            presence.ref,
            child.ref
        );
        const forceMount = typeof children === 'function';
        return forceMount || presence.isPresent
            ? React5.cloneElement(child, { ref })
            : null;
    };
    $921a889cee6df7e8$export$99c2b779aa4e8b8b.displayName = 'Presence';
    function $921a889cee6df7e8$var$usePresence(present) {
        const [node1, setNode] = React5.useState();
        const stylesRef = React5.useRef({});
        const prevPresentRef = React5.useRef(present);
        const prevAnimationNameRef = React5.useRef('none');
        const initialState2 = present ? 'mounted' : 'unmounted';
        const [state, send] = $fe963b355347cc68$export$3e6543de14f8614f(
            initialState2,
            {
                mounted: {
                    UNMOUNT: 'unmounted',
                    ANIMATION_OUT: 'unmountSuspended'
                },
                unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' },
                unmounted: { MOUNT: 'mounted' }
            }
        );
        React5.useEffect(() => {
            const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(
                stylesRef.current
            );
            prevAnimationNameRef.current =
                state === 'mounted' ? currentAnimationName : 'none';
        }, [state]);
        $9f79659886946c16$export$e5c5a5f917a5871c(() => {
            const styles = stylesRef.current;
            const wasPresent = prevPresentRef.current;
            const hasPresentChanged = wasPresent !== present;
            if (hasPresentChanged) {
                const prevAnimationName = prevAnimationNameRef.current;
                const currentAnimationName =
                    $921a889cee6df7e8$var$getAnimationName(styles);
                if (present) send('MOUNT');
                else if (
                    currentAnimationName === 'none' ||
                    (styles === null || styles === void 0
                        ? void 0
                        : styles.display) === 'none'
                )
                    send('UNMOUNT');
                else {
                    const isAnimating = prevAnimationName !== currentAnimationName;
                    if (wasPresent && isAnimating) send('ANIMATION_OUT');
                    else send('UNMOUNT');
                }
                prevPresentRef.current = present;
            }
        }, [present, send]);
        $9f79659886946c16$export$e5c5a5f917a5871c(() => {
            if (node1) {
                const handleAnimationEnd = (event) => {
                    const currentAnimationName =
                        $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
                    const isCurrentAnimation = currentAnimationName.includes(
                        event.animationName
                    );
                    if (event.target === node1 && isCurrentAnimation)
                        $7SXl2$reactdom.flushSync(() => send('ANIMATION_END'));
                };
                const handleAnimationStart = (event) => {
                    if (event.target === node1)
                        prevAnimationNameRef.current =
                            $921a889cee6df7e8$var$getAnimationName(
                                stylesRef.current
                            );
                };
                node1.addEventListener('animationstart', handleAnimationStart);
                node1.addEventListener('animationcancel', handleAnimationEnd);
                node1.addEventListener('animationend', handleAnimationEnd);
                return () => {
                    node1.removeEventListener(
                        'animationstart',
                        handleAnimationStart
                    );
                    node1.removeEventListener(
                        'animationcancel',
                        handleAnimationEnd
                    );
                    node1.removeEventListener('animationend', handleAnimationEnd);
                };
            } else send('ANIMATION_END');
        }, [node1, send]);
        return {
            isPresent: ['mounted', 'unmountSuspended'].includes(state),
            ref: React5.useCallback((node) => {
                if (node) stylesRef.current = getComputedStyle(node);
                setNode(node);
            }, [])
        };
    }
    function $921a889cee6df7e8$var$getAnimationName(styles) {
        return (
            (styles === null || styles === void 0
                ? void 0
                : styles.animationName) || 'none'
        );
    }
    function $71cd76cc60e0454e$export$6f32135080cb4c3({
        prop,
        defaultProp,
        onChange = () => {}
    }) {
        const [uncontrolledProp, setUncontrolledProp] =
            $71cd76cc60e0454e$var$useUncontrolledState({ defaultProp, onChange });
        const isControlled = prop !== void 0;
        const value1 = isControlled ? prop : uncontrolledProp;
        const handleChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onChange);
        const setValue = React5.useCallback(
            (nextValue) => {
                if (isControlled) {
                    const setter = nextValue;
                    const value =
                        typeof nextValue === 'function' ? setter(prop) : nextValue;
                    if (value !== prop) handleChange(value);
                } else setUncontrolledProp(nextValue);
            },
            [isControlled, prop, setUncontrolledProp, handleChange]
        );
        return [value1, setValue];
    }
    function $71cd76cc60e0454e$var$useUncontrolledState({ defaultProp, onChange }) {
        const uncontrolledState = React5.useState(defaultProp);
        const [value] = uncontrolledState;
        const prevValueRef = React5.useRef(value);
        const handleChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onChange);
        React5.useEffect(() => {
            if (prevValueRef.current !== value) {
                handleChange(value);
                prevValueRef.current = value;
            }
        }, [value, prevValueRef, handleChange]);
        return uncontrolledState;
    }
    var $ea1ef594cf570d83$export$439d29a4e110a164 = React5.forwardRef(
        (props3, forwardedRef) => {
            return React5.createElement(
                $8927f6f2acc4f386$export$250ffa63cdc0d034.span,
                _extends({}, props3, {
                    ref: forwardedRef,
                    style: {
                        position: 'absolute',
                        border: 0,
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: -1,
                        overflow: 'hidden',
                        clip: 'rect(0, 0, 0, 0)',
                        whiteSpace: 'nowrap',
                        wordWrap: 'normal',
                        ...props3.style
                    }
                })
            );
        }
    );
    var $ea1ef594cf570d83$export$be92b6f5f03c0fe9 =
        $ea1ef594cf570d83$export$439d29a4e110a164;
    var [
        $a093c7e1ec25a057$var$createTooltipContext,
        $a093c7e1ec25a057$export$1c540a2224f0d865
    ] = $c512c27ab02ef895$export$50c7b4e9d9f19c1('Tooltip', [
        $cf1ac5d9fe0e8206$export$722aac194ae923
    ]);
    var $a093c7e1ec25a057$var$usePopperScope =
        $cf1ac5d9fe0e8206$export$722aac194ae923();
    var $a093c7e1ec25a057$var$PROVIDER_NAME = 'TooltipProvider';
    var $a093c7e1ec25a057$var$TOOLTIP_OPEN = 'tooltip.open';
    var [
        $a093c7e1ec25a057$var$TooltipProviderContextProvider,
        $a093c7e1ec25a057$var$useTooltipProviderContext
    ] = $a093c7e1ec25a057$var$createTooltipContext(
        $a093c7e1ec25a057$var$PROVIDER_NAME
    );
    var $a093c7e1ec25a057$var$TOOLTIP_NAME = 'Tooltip';
    var [
        $a093c7e1ec25a057$var$TooltipContextProvider,
        $a093c7e1ec25a057$var$useTooltipContext
    ] = $a093c7e1ec25a057$var$createTooltipContext(
        $a093c7e1ec25a057$var$TOOLTIP_NAME
    );
    var $a093c7e1ec25a057$export$28c660c63b792dea = (props3) => {
        const {
            __scopeTooltip,
            children,
            open: openProp,
            defaultOpen = false,
            onOpenChange,
            disableHoverableContent: disableHoverableContentProp,
            delayDuration: delayDurationProp
        } = props3;
        const providerContext = $a093c7e1ec25a057$var$useTooltipProviderContext(
            $a093c7e1ec25a057$var$TOOLTIP_NAME,
            props3.__scopeTooltip
        );
        const popperScope = $a093c7e1ec25a057$var$usePopperScope(__scopeTooltip);
        const [trigger, setTrigger] = React5.useState(null);
        const contentId = $1746a345f3d73bb7$export$f680877a34711e37();
        const openTimerRef = React5.useRef(0);
        const disableHoverableContent =
            disableHoverableContentProp !== null &&
            disableHoverableContentProp !== void 0
                ? disableHoverableContentProp
                : providerContext.disableHoverableContent;
        const delayDuration =
            delayDurationProp !== null && delayDurationProp !== void 0
                ? delayDurationProp
                : providerContext.delayDuration;
        const wasOpenDelayedRef = React5.useRef(false);
        const [open1 = false, setOpen] = $71cd76cc60e0454e$export$6f32135080cb4c3({
            prop: openProp,
            defaultProp: defaultOpen,
            onChange: (open) => {
                if (open) {
                    providerContext.onOpen();
                    document.dispatchEvent(
                        new CustomEvent($a093c7e1ec25a057$var$TOOLTIP_OPEN)
                    );
                } else providerContext.onClose();
                onOpenChange === null ||
                    onOpenChange === void 0 ||
                    onOpenChange(open);
            }
        });
        const stateAttribute = React5.useMemo(() => {
            return open1
                ? wasOpenDelayedRef.current
                    ? 'delayed-open'
                    : 'instant-open'
                : 'closed';
        }, [open1]);
        const handleOpen = React5.useCallback(() => {
            window.clearTimeout(openTimerRef.current);
            wasOpenDelayedRef.current = false;
            setOpen(true);
        }, [setOpen]);
        const handleClose = React5.useCallback(() => {
            window.clearTimeout(openTimerRef.current);
            setOpen(false);
        }, [setOpen]);
        const handleDelayedOpen = React5.useCallback(() => {
            window.clearTimeout(openTimerRef.current);
            openTimerRef.current = window.setTimeout(() => {
                wasOpenDelayedRef.current = true;
                setOpen(true);
            }, delayDuration);
        }, [delayDuration, setOpen]);
        React5.useEffect(() => {
            return () => window.clearTimeout(openTimerRef.current);
        }, []);
        return React5.createElement(
            $cf1ac5d9fe0e8206$export$be92b6f5f03c0fe9,
            popperScope,
            React5.createElement(
                $a093c7e1ec25a057$var$TooltipContextProvider,
                {
                    scope: __scopeTooltip,
                    contentId,
                    open: open1,
                    stateAttribute,
                    trigger,
                    onTriggerChange: setTrigger,
                    onTriggerEnter: React5.useCallback(() => {
                        if (providerContext.isOpenDelayed) handleDelayedOpen();
                        else handleOpen();
                    }, [
                        providerContext.isOpenDelayed,
                        handleDelayedOpen,
                        handleOpen
                    ]),
                    onTriggerLeave: React5.useCallback(() => {
                        if (disableHoverableContent) handleClose();
                        else window.clearTimeout(openTimerRef.current);
                    }, [handleClose, disableHoverableContent]),
                    onOpen: handleOpen,
                    onClose: handleClose,
                    disableHoverableContent
                },
                children
            )
        );
    };
    var $a093c7e1ec25a057$var$TRIGGER_NAME = 'TooltipTrigger';
    var $a093c7e1ec25a057$export$8c610744efcf8a1d = React5.forwardRef(
        (props3, forwardedRef) => {
            const { __scopeTooltip, ...triggerProps } = props3;
            const context = $a093c7e1ec25a057$var$useTooltipContext(
                $a093c7e1ec25a057$var$TRIGGER_NAME,
                __scopeTooltip
            );
            const providerContext = $a093c7e1ec25a057$var$useTooltipProviderContext(
                $a093c7e1ec25a057$var$TRIGGER_NAME,
                __scopeTooltip
            );
            const popperScope =
                $a093c7e1ec25a057$var$usePopperScope(__scopeTooltip);
            const ref = React5.useRef(null);
            const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(
                forwardedRef,
                ref,
                context.onTriggerChange
            );
            const isPointerDownRef = React5.useRef(false);
            const hasPointerMoveOpenedRef = React5.useRef(false);
            const handlePointerUp = React5.useCallback(
                () => (isPointerDownRef.current = false),
                []
            );
            React5.useEffect(() => {
                return () =>
                    document.removeEventListener('pointerup', handlePointerUp);
            }, [handlePointerUp]);
            return React5.createElement(
                $cf1ac5d9fe0e8206$export$b688253958b8dfe7,
                _extends({ asChild: true }, popperScope),
                React5.createElement(
                    $8927f6f2acc4f386$export$250ffa63cdc0d034.button,
                    _extends(
                        {
                            'aria-describedby': context.open
                                ? context.contentId
                                : void 0,
                            'data-state': context.stateAttribute
                        },
                        triggerProps,
                        {
                            ref: composedRefs,
                            onPointerMove:
                                $e42e1063c40fb3ef$export$b9ecd428b558ff10(
                                    props3.onPointerMove,
                                    (event) => {
                                        if (event.pointerType === 'touch') return;
                                        if (
                                            !hasPointerMoveOpenedRef.current &&
                                            !providerContext.isPointerInTransitRef
                                                .current
                                        ) {
                                            context.onTriggerEnter();
                                            hasPointerMoveOpenedRef.current = true;
                                        }
                                    }
                                ),
                            onPointerLeave:
                                $e42e1063c40fb3ef$export$b9ecd428b558ff10(
                                    props3.onPointerLeave,
                                    () => {
                                        context.onTriggerLeave();
                                        hasPointerMoveOpenedRef.current = false;
                                    }
                                ),
                            onPointerDown:
                                $e42e1063c40fb3ef$export$b9ecd428b558ff10(
                                    props3.onPointerDown,
                                    () => {
                                        isPointerDownRef.current = true;
                                        document.addEventListener(
                                            'pointerup',
                                            handlePointerUp,
                                            { once: true }
                                        );
                                    }
                                ),
                            onFocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
                                props3.onFocus,
                                () => {
                                    if (!isPointerDownRef.current) context.onOpen();
                                }
                            ),
                            onBlur: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
                                props3.onBlur,
                                context.onClose
                            ),
                            onClick: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
                                props3.onClick,
                                context.onClose
                            )
                        }
                    )
                )
            );
        }
    );
    var $a093c7e1ec25a057$var$PORTAL_NAME = 'TooltipPortal';
    var [
        $a093c7e1ec25a057$var$PortalProvider,
        $a093c7e1ec25a057$var$usePortalContext
    ] = $a093c7e1ec25a057$var$createTooltipContext(
        $a093c7e1ec25a057$var$PORTAL_NAME,
        { forceMount: void 0 }
    );
    var $a093c7e1ec25a057$var$CONTENT_NAME = 'TooltipContent';
    var $a093c7e1ec25a057$export$e9003e2be37ec060 = React5.forwardRef(
        (props3, forwardedRef) => {
            const portalContext = $a093c7e1ec25a057$var$usePortalContext(
                $a093c7e1ec25a057$var$CONTENT_NAME,
                props3.__scopeTooltip
            );
            const {
                forceMount = portalContext.forceMount,
                side = 'top',
                ...contentProps
            } = props3;
            const context = $a093c7e1ec25a057$var$useTooltipContext(
                $a093c7e1ec25a057$var$CONTENT_NAME,
                props3.__scopeTooltip
            );
            return React5.createElement(
                $921a889cee6df7e8$export$99c2b779aa4e8b8b,
                { present: forceMount || context.open },
                context.disableHoverableContent
                    ? React5.createElement(
                          $a093c7e1ec25a057$var$TooltipContentImpl,
                          _extends({ side }, contentProps, { ref: forwardedRef })
                      )
                    : React5.createElement(
                          $a093c7e1ec25a057$var$TooltipContentHoverable,
                          _extends({ side }, contentProps, { ref: forwardedRef })
                      )
            );
        }
    );
    var $a093c7e1ec25a057$var$TooltipContentHoverable = React5.forwardRef(
        (props3, forwardedRef) => {
            const context = $a093c7e1ec25a057$var$useTooltipContext(
                $a093c7e1ec25a057$var$CONTENT_NAME,
                props3.__scopeTooltip
            );
            const providerContext = $a093c7e1ec25a057$var$useTooltipProviderContext(
                $a093c7e1ec25a057$var$CONTENT_NAME,
                props3.__scopeTooltip
            );
            const ref = React5.useRef(null);
            const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(
                forwardedRef,
                ref
            );
            const [pointerGraceArea, setPointerGraceArea] = React5.useState(null);
            const { trigger, onClose } = context;
            const content = ref.current;
            const { onPointerInTransitChange } = providerContext;
            const handleRemoveGraceArea = React5.useCallback(() => {
                setPointerGraceArea(null);
                onPointerInTransitChange(false);
            }, [onPointerInTransitChange]);
            const handleCreateGraceArea = React5.useCallback(
                (event, hoverTarget) => {
                    const currentTarget = event.currentTarget;
                    const exitPoint = { x: event.clientX, y: event.clientY };
                    const exitSide = $a093c7e1ec25a057$var$getExitSideFromRect(
                        exitPoint,
                        currentTarget.getBoundingClientRect()
                    );
                    const bleed =
                        exitSide === 'right' || exitSide === 'bottom' ? -5 : 5;
                    const isXAxis = exitSide === 'right' || exitSide === 'left';
                    const startPoint = isXAxis
                        ? { x: event.clientX + bleed, y: event.clientY }
                        : { x: event.clientX, y: event.clientY + bleed };
                    const hoverTargetPoints =
                        $a093c7e1ec25a057$var$getPointsFromRect(
                            hoverTarget.getBoundingClientRect()
                        );
                    const graceArea = $a093c7e1ec25a057$var$getHull([
                        startPoint,
                        ...hoverTargetPoints
                    ]);
                    setPointerGraceArea(graceArea);
                    onPointerInTransitChange(true);
                },
                [onPointerInTransitChange]
            );
            React5.useEffect(() => {
                return () => handleRemoveGraceArea();
            }, [handleRemoveGraceArea]);
            React5.useEffect(() => {
                if (trigger && content) {
                    const handleTriggerLeave = (event) =>
                        handleCreateGraceArea(event, content);
                    const handleContentLeave = (event) =>
                        handleCreateGraceArea(event, trigger);
                    trigger.addEventListener('pointerleave', handleTriggerLeave);
                    content.addEventListener('pointerleave', handleContentLeave);
                    return () => {
                        trigger.removeEventListener(
                            'pointerleave',
                            handleTriggerLeave
                        );
                        content.removeEventListener(
                            'pointerleave',
                            handleContentLeave
                        );
                    };
                }
            }, [trigger, content, handleCreateGraceArea, handleRemoveGraceArea]);
            React5.useEffect(() => {
                if (pointerGraceArea) {
                    const handleTrackPointerGrace = (event) => {
                        const target = event.target;
                        const pointerPosition = {
                            x: event.clientX,
                            y: event.clientY
                        };
                        const hasEnteredTarget =
                            (trigger === null || trigger === void 0
                                ? void 0
                                : trigger.contains(target)) ||
                            (content === null || content === void 0
                                ? void 0
                                : content.contains(target));
                        const isPointerOutsideGraceArea =
                            !$a093c7e1ec25a057$var$isPointInPolygon(
                                pointerPosition,
                                pointerGraceArea
                            );
                        if (hasEnteredTarget) handleRemoveGraceArea();
                        else if (isPointerOutsideGraceArea) {
                            handleRemoveGraceArea();
                            onClose();
                        }
                    };
                    document.addEventListener(
                        'pointermove',
                        handleTrackPointerGrace
                    );
                    return () =>
                        document.removeEventListener(
                            'pointermove',
                            handleTrackPointerGrace
                        );
                }
            }, [
                trigger,
                content,
                pointerGraceArea,
                onClose,
                handleRemoveGraceArea
            ]);
            return React5.createElement(
                $a093c7e1ec25a057$var$TooltipContentImpl,
                _extends({}, props3, { ref: composedRefs })
            );
        }
    );
    var [
        $a093c7e1ec25a057$var$VisuallyHiddenContentContextProvider,
        $a093c7e1ec25a057$var$useVisuallyHiddenContentContext
    ] = $a093c7e1ec25a057$var$createTooltipContext(
        $a093c7e1ec25a057$var$TOOLTIP_NAME,
        { isInside: false }
    );
    var $a093c7e1ec25a057$var$TooltipContentImpl = React5.forwardRef(
        (props3, forwardedRef) => {
            const {
                __scopeTooltip,
                children,
                'aria-label': ariaLabel,
                onEscapeKeyDown,
                onPointerDownOutside,
                ...contentProps
            } = props3;
            const context = $a093c7e1ec25a057$var$useTooltipContext(
                $a093c7e1ec25a057$var$CONTENT_NAME,
                __scopeTooltip
            );
            const popperScope =
                $a093c7e1ec25a057$var$usePopperScope(__scopeTooltip);
            const { onClose } = context;
            React5.useEffect(() => {
                document.addEventListener(
                    $a093c7e1ec25a057$var$TOOLTIP_OPEN,
                    onClose
                );
                return () =>
                    document.removeEventListener(
                        $a093c7e1ec25a057$var$TOOLTIP_OPEN,
                        onClose
                    );
            }, [onClose]);
            React5.useEffect(() => {
                if (context.trigger) {
                    const handleScroll = (event) => {
                        const target = event.target;
                        if (
                            target !== null &&
                            target !== void 0 &&
                            target.contains(context.trigger)
                        )
                            onClose();
                    };
                    window.addEventListener('scroll', handleScroll, {
                        capture: true
                    });
                    return () =>
                        window.removeEventListener('scroll', handleScroll, {
                            capture: true
                        });
                }
            }, [context.trigger, onClose]);
            return React5.createElement(
                $5cb92bef7577960e$export$177fb62ff3ec1f22,
                {
                    asChild: true,
                    disableOutsidePointerEvents: false,
                    onEscapeKeyDown,
                    onPointerDownOutside,
                    onFocusOutside: (event) => event.preventDefault(),
                    onDismiss: onClose
                },
                React5.createElement(
                    $cf1ac5d9fe0e8206$export$7c6e2c02157bb7d2,
                    _extends(
                        { 'data-state': context.stateAttribute },
                        popperScope,
                        contentProps,
                        {
                            ref: forwardedRef,
                            style: {
                                ...contentProps.style,
                                '--radix-tooltip-content-transform-origin':
                                    'var(--radix-popper-transform-origin)',
                                '--radix-tooltip-content-available-width':
                                    'var(--radix-popper-available-width)',
                                '--radix-tooltip-content-available-height':
                                    'var(--radix-popper-available-height)',
                                '--radix-tooltip-trigger-width':
                                    'var(--radix-popper-anchor-width)',
                                '--radix-tooltip-trigger-height':
                                    'var(--radix-popper-anchor-height)'
                            }
                        }
                    ),
                    React5.createElement(
                        $5e63c961fc1ce211$export$d9f1ccf0bdb05d45,
                        null,
                        children
                    ),
                    React5.createElement(
                        $a093c7e1ec25a057$var$VisuallyHiddenContentContextProvider,
                        { scope: __scopeTooltip, isInside: true },
                        React5.createElement(
                            $ea1ef594cf570d83$export$be92b6f5f03c0fe9,
                            { id: context.contentId, role: 'tooltip' },
                            ariaLabel || children
                        )
                    )
                )
            );
        }
    );
    var $a093c7e1ec25a057$var$ARROW_NAME = 'TooltipArrow';
    var $a093c7e1ec25a057$export$c27ee0ad710f7559 = React5.forwardRef(
        (props3, forwardedRef) => {
            const { __scopeTooltip, ...arrowProps } = props3;
            const popperScope =
                $a093c7e1ec25a057$var$usePopperScope(__scopeTooltip);
            const visuallyHiddenContentContext =
                $a093c7e1ec25a057$var$useVisuallyHiddenContentContext(
                    $a093c7e1ec25a057$var$ARROW_NAME,
                    __scopeTooltip
                );
            return visuallyHiddenContentContext.isInside
                ? null
                : React5.createElement(
                      $cf1ac5d9fe0e8206$export$21b07c8f274aebd5,
                      _extends({}, popperScope, arrowProps, { ref: forwardedRef })
                  );
        }
    );
    function $a093c7e1ec25a057$var$getExitSideFromRect(point, rect) {
        const top = Math.abs(rect.top - point.y);
        const bottom = Math.abs(rect.bottom - point.y);
        const right = Math.abs(rect.right - point.x);
        const left = Math.abs(rect.left - point.x);
        switch (Math.min(top, bottom, right, left)) {
            case left:
                return 'left';
            case right:
                return 'right';
            case top:
                return 'top';
            case bottom:
                return 'bottom';
            default:
                return null;
        }
    }
    function $a093c7e1ec25a057$var$getPointsFromRect(rect) {
        const { top, right, bottom, left } = rect;
        return [
            { x: left, y: top },
            { x: right, y: top },
            { x: right, y: bottom },
            { x: left, y: bottom }
        ];
    }
    function $a093c7e1ec25a057$var$isPointInPolygon(point, polygon) {
        const { x: x3, y: y4 } = point;
        let inside = false;
        for (let i4 = 0, j3 = polygon.length - 1; i4 < polygon.length; j3 = i4++) {
            const xi = polygon[i4].x;
            const yi = polygon[i4].y;
            const xj = polygon[j3].x;
            const yj = polygon[j3].y;
            const intersect =
                yi > y4 !== yj > y4 &&
                x3 < ((xj - xi) * (y4 - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }
        return inside;
    }
    function $a093c7e1ec25a057$var$getHull(points) {
        const newPoints = points.slice();
        newPoints.sort((a4, b4) => {
            if (a4.x < b4.x) return -1;
            else if (a4.x > b4.x) return 1;
            else if (a4.y < b4.y) return -1;
            else if (a4.y > b4.y) return 1;
            else return 0;
        });
        return $a093c7e1ec25a057$var$getHullPresorted(newPoints);
    }
    function $a093c7e1ec25a057$var$getHullPresorted(points) {
        if (points.length <= 1) return points.slice();
        const upperHull = [];
        for (let i4 = 0; i4 < points.length; i4++) {
            const p4 = points[i4];
            while (upperHull.length >= 2) {
                const q3 = upperHull[upperHull.length - 1];
                const r4 = upperHull[upperHull.length - 2];
                if ((q3.x - r4.x) * (p4.y - r4.y) >= (q3.y - r4.y) * (p4.x - r4.x))
                    upperHull.pop();
                else break;
            }
            upperHull.push(p4);
        }
        upperHull.pop();
        const lowerHull = [];
        for (let i1 = points.length - 1; i1 >= 0; i1--) {
            const p4 = points[i1];
            while (lowerHull.length >= 2) {
                const q3 = lowerHull[lowerHull.length - 1];
                const r4 = lowerHull[lowerHull.length - 2];
                if ((q3.x - r4.x) * (p4.y - r4.y) >= (q3.y - r4.y) * (p4.x - r4.x))
                    lowerHull.pop();
                else break;
            }
            lowerHull.push(p4);
        }
        lowerHull.pop();
        if (
            upperHull.length === 1 &&
            lowerHull.length === 1 &&
            upperHull[0].x === lowerHull[0].x &&
            upperHull[0].y === lowerHull[0].y
        )
            return upperHull;
        else return upperHull.concat(lowerHull);
    }
    var $a093c7e1ec25a057$export$be92b6f5f03c0fe9 =
        $a093c7e1ec25a057$export$28c660c63b792dea;
    var $a093c7e1ec25a057$export$41fb9f06171c75f4 =
        $a093c7e1ec25a057$export$8c610744efcf8a1d;
    var $a093c7e1ec25a057$export$7c6e2c02157bb7d2 =
        $a093c7e1ec25a057$export$e9003e2be37ec060;
    var $a093c7e1ec25a057$export$21b07c8f274aebd5 =
        $a093c7e1ec25a057$export$c27ee0ad710f7559;
    function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i4;
        for (i4 = 0; i4 < sourceKeys.length; i4++) {
            key = sourceKeys[i4];
            if (excluded.indexOf(key) >= 0) continue;
            target[key] = source[key];
        }
        return target;
    }
    function _objectWithoutProperties(source, excluded) {
        if (source == null) return {};
        var target = _objectWithoutPropertiesLoose(source, excluded);
        var key, i4;
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for (i4 = 0; i4 < sourceSymbolKeys.length; i4++) {
                key = sourceSymbolKeys[i4];
                if (excluded.indexOf(key) >= 0) continue;
                if (!Object.prototype.propertyIsEnumerable.call(source, key))
                    continue;
                target[key] = source[key];
            }
        }
        return target;
    }
    var LevaErrors;
    (function (LevaErrors2) {
        LevaErrors2[(LevaErrors2['UNSUPPORTED_INPUT'] = 0)] = 'UNSUPPORTED_INPUT';
        LevaErrors2[(LevaErrors2['NO_COMPONENT_FOR_TYPE'] = 1)] =
            'NO_COMPONENT_FOR_TYPE';
        LevaErrors2[(LevaErrors2['UNKNOWN_INPUT'] = 2)] = 'UNKNOWN_INPUT';
        LevaErrors2[(LevaErrors2['DUPLICATE_KEYS'] = 3)] = 'DUPLICATE_KEYS';
        LevaErrors2[(LevaErrors2['ALREADY_REGISTERED_TYPE'] = 4)] =
            'ALREADY_REGISTERED_TYPE';
        LevaErrors2[(LevaErrors2['CLIPBOARD_ERROR'] = 5)] = 'CLIPBOARD_ERROR';
        LevaErrors2[(LevaErrors2['THEME_ERROR'] = 6)] = 'THEME_ERROR';
        LevaErrors2[(LevaErrors2['PATH_DOESNT_EXIST'] = 7)] = 'PATH_DOESNT_EXIST';
        LevaErrors2[(LevaErrors2['INPUT_TYPE_OVERRIDE'] = 8)] =
            'INPUT_TYPE_OVERRIDE';
        LevaErrors2[(LevaErrors2['EMPTY_KEY'] = 9)] = 'EMPTY_KEY';
    })(LevaErrors || (LevaErrors = {}));
    var ErrorList = {
        [LevaErrors.UNSUPPORTED_INPUT]: (type, path) => [
            `An input with type \`${type}\` input was found at path \`${path}\` but it's not supported yet.`
        ],
        [LevaErrors.NO_COMPONENT_FOR_TYPE]: (type, path) => [
            `Type \`${type}\` found at path \`${path}\` can't be displayed in panel because no component supports it yet.`
        ],
        [LevaErrors.UNKNOWN_INPUT]: (path, value) => [
            `input at path \`${path}\` is not recognized.`,
            value
        ],
        [LevaErrors.DUPLICATE_KEYS]: (key, path, prevPath) => [
            `Key \`${key}\` of path \`${path}\` already exists at path \`${prevPath}\`. Even nested keys need to be unique. Rename one of the keys.`
        ],
        [LevaErrors.ALREADY_REGISTERED_TYPE]: (type) => [
            `Type ${type} has already been registered. You can't register a component with the same type.`
        ],
        [LevaErrors.CLIPBOARD_ERROR]: (value) => [`Error copying the value`, value],
        [LevaErrors.THEME_ERROR]: (category, key) => [
            `Error accessing the theme \`${category}.${key}\` value.`
        ],
        [LevaErrors.PATH_DOESNT_EXIST]: (path) => [
            `Error getting the value at path \`${path}\`. There is probably an error in your \`render\` function.`
        ],
        [LevaErrors.PATH_DOESNT_EXIST]: (path) => [
            `Error accessing the value at path \`${path}\``
        ],
        [LevaErrors.INPUT_TYPE_OVERRIDE]: (path, type, wrongType) => [
            `Input at path \`${path}\` already exists with type: \`${type}\`. Its type cannot be overridden with type \`${wrongType}\`.`
        ],
        [LevaErrors.EMPTY_KEY]: () => [
            'Keys can not be empty, if you want to hide a label use whitespace.'
        ]
    };
    function _log(fn, errorType, ...args) {
        const [message, ...rest2] = ErrorList[errorType](...args);
        console[fn]('LEVA: ' + message, ...rest2);
    }
    var warn = _log.bind(null, 'warn');
    var log = _log.bind(null, 'log');
    var _excluded$a = ['value'];
    var _excluded2$4 = ['schema'];
    var _excluded3$1 = ['value'];
    var Schemas = [];
    var Plugins = {};
    function getValueType(_ref) {
        let { value } = _ref,
            settings = _objectWithoutProperties(_ref, _excluded$a);
        for (let checker of Schemas) {
            const type = checker(value, settings);
            if (type) return type;
        }
        return void 0;
    }
    function register(type, _ref2) {
        let { schema: schema3 } = _ref2,
            plugin2 = _objectWithoutProperties(_ref2, _excluded2$4);
        if (type in Plugins) {
            warn(LevaErrors.ALREADY_REGISTERED_TYPE, type);
            return;
        }
        Schemas.push((value, settings) => schema3(value, settings) && type);
        Plugins[type] = plugin2;
    }
    function createInternalPlugin(plugin2) {
        return plugin2;
    }
    function normalize$3(type, input, path, data) {
        const { normalize: _normalize } = Plugins[type];
        if (_normalize) return _normalize(input, path, data);
        if (typeof input !== 'object' || !('value' in input))
            return { value: input };
        const { value } = input,
            settings = _objectWithoutProperties(input, _excluded3$1);
        return { value, settings };
    }
    function sanitize$4(type, value, settings, prevValue, path, store) {
        const { sanitize: sanitize3 } = Plugins[type];
        if (sanitize3) return sanitize3(value, settings, prevValue, path, store);
        return value;
    }
    function format$2(type, value, settings) {
        const { format: format3 } = Plugins[type];
        if (format3) return format3(value, settings);
        return value;
    }
    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }
    function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            (enumerableOnly &&
                (symbols = symbols.filter(function (sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                })),
                keys.push.apply(keys, symbols));
        }
        return keys;
    }
    function _objectSpread2(target) {
        for (var i4 = 1; i4 < arguments.length; i4++) {
            var source = null != arguments[i4] ? arguments[i4] : {};
            i4 % 2
                ? ownKeys(Object(source), true).forEach(function (key) {
                      _defineProperty(target, key, source[key]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                        target,
                        Object.getOwnPropertyDescriptors(source)
                    )
                  : ownKeys(Object(source)).forEach(function (key) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(source, key)
                        );
                    });
        }
        return target;
    }
    var clamp = (x3, min3, max3) => (x3 > max3 ? max3 : x3 < min3 ? min3 : x3);
    var parseNumber = (v4) => {
        if (v4 === '' || typeof v4 === 'number') return v4;
        try {
            const _v = evaluate(v4);
            if (!isNaN(_v)) return _v;
        } catch (_unused) {}
        return parseFloat(v4);
    };
    var log10 = Math.log(10);
    function getStep(number3) {
        let n4 = Math.abs(+String(number3).replace('.', ''));
        if (n4 === 0) return 0.01;
        while (n4 !== 0 && n4 % 10 === 0) n4 /= 10;
        const significantDigits = Math.floor(Math.log(n4) / log10) + 1;
        const numberLog = Math.floor(Math.log10(Math.abs(number3)));
        const step = Math.pow(10, numberLog - significantDigits);
        return Math.max(step, 1e-3);
    }
    var range = (v4, min3, max3) => {
        if (max3 === min3) return 0;
        const _v = clamp(v4, min3, max3);
        return (_v - min3) / (max3 - min3);
    };
    var invertedRange = (p4, min3, max3) => p4 * (max3 - min3) + min3;
    var getUid = () => '_' + Math.random().toString(36).substr(2, 9);
    var parens = /\(([0-9+\-*/^ .]+)\)/;
    var exp = /(\d+(?:\.\d+)?) ?\^ ?(\d+(?:\.\d+)?)/;
    var mul = /(\d+(?:\.\d+)?) ?\* ?(\d+(?:\.\d+)?)/;
    var div = /(\d+(?:\.\d+)?) ?\/ ?(\d+(?:\.\d+)?)/;
    var add = /(\d+(?:\.\d+)?) ?\+ ?(\d+(?:\.\d+)?)/;
    var sub = /(\d+(?:\.\d+)?) ?- ?(\d+(?:\.\d+)?)/;
    function evaluate(expr) {
        if (isNaN(Number(expr))) {
            if (parens.test(expr)) {
                const newExpr = expr.replace(parens, (match, subExpr) =>
                    String(evaluate(subExpr))
                );
                return evaluate(newExpr);
            } else if (exp.test(expr)) {
                const newExpr = expr.replace(exp, (match, base, pow) =>
                    String(Math.pow(Number(base), Number(pow)))
                );
                return evaluate(newExpr);
            } else if (mul.test(expr)) {
                const newExpr = expr.replace(mul, (match, a4, b4) =>
                    String(Number(a4) * Number(b4))
                );
                return evaluate(newExpr);
            } else if (div.test(expr)) {
                const newExpr = expr.replace(div, (match, a4, b4) => {
                    if (b4 != 0) return String(Number(a4) / Number(b4));
                    else throw new Error('Division by zero');
                });
                return evaluate(newExpr);
            } else if (add.test(expr)) {
                const newExpr = expr.replace(add, (match, a4, b4) =>
                    String(Number(a4) + Number(b4))
                );
                return evaluate(newExpr);
            } else if (sub.test(expr)) {
                const newExpr = expr.replace(sub, (match, a4, b4) =>
                    String(Number(a4) - Number(b4))
                );
                return evaluate(newExpr);
            } else {
                return Number(expr);
            }
        }
        return Number(expr);
    }
    function pick(object, keys) {
        return keys.reduce((obj, key) => {
            if (!!object && object.hasOwnProperty(key)) {
                obj[key] = object[key];
            }
            return obj;
        }, {});
    }
    function omit(object, keys) {
        const obj = _objectSpread2({}, object);
        keys.forEach((k4) => k4 in object && delete obj[k4]);
        return obj;
    }
    function mapArrayToKeys(value, keys) {
        return value.reduce(
            (acc, v4, i4) => Object.assign(acc, { [keys[i4]]: v4 }),
            {}
        );
    }
    function isObject(variable) {
        return Object.prototype.toString.call(variable) === '[object Object]';
    }
    var isEmptyObject = (obj) => isObject(obj) && Object.keys(obj).length === 0;
    var SpecialInputs;
    (function (SpecialInputs2) {
        SpecialInputs2['BUTTON'] = 'BUTTON';
        SpecialInputs2['BUTTON_GROUP'] = 'BUTTON_GROUP';
        SpecialInputs2['MONITOR'] = 'MONITOR';
        SpecialInputs2['FOLDER'] = 'FOLDER';
    })(SpecialInputs || (SpecialInputs = {}));
    exports.LevaInputs = void 0;
    (function (LevaInputs2) {
        LevaInputs2['SELECT'] = 'SELECT';
        LevaInputs2['IMAGE'] = 'IMAGE';
        LevaInputs2['NUMBER'] = 'NUMBER';
        LevaInputs2['COLOR'] = 'COLOR';
        LevaInputs2['STRING'] = 'STRING';
        LevaInputs2['BOOLEAN'] = 'BOOLEAN';
        LevaInputs2['INTERVAL'] = 'INTERVAL';
        LevaInputs2['VECTOR3D'] = 'VECTOR3D';
        LevaInputs2['VECTOR2D'] = 'VECTOR2D';
    })(exports.LevaInputs || (exports.LevaInputs = {}));
    var _excluded$9 = ['type', '__customInput'];
    var _excluded2$3 = [
        'render',
        'label',
        'optional',
        'order',
        'disabled',
        'hint',
        'onChange',
        'onEditStart',
        'onEditEnd',
        'transient'
    ];
    var _excluded3 = ['type'];
    function parseOptions(_input, key, mergedOptions = {}, customType) {
        var _commonOptions$option, _commonOptions$disabl;
        if (typeof _input !== 'object' || Array.isArray(_input)) {
            return {
                type: customType,
                input: _input,
                options: _objectSpread2(
                    { key, label: key, optional: false, disabled: false, order: 0 },
                    mergedOptions
                )
            };
        }
        if ('__customInput' in _input) {
            const { type: _type, __customInput } = _input,
                options = _objectWithoutProperties(_input, _excluded$9);
            return parseOptions(__customInput, key, options, _type);
        }
        const {
                render,
                label,
                optional: optional2,
                order = 0,
                disabled,
                hint,
                onChange,
                onEditStart,
                onEditEnd,
                transient
            } = _input,
            inputWithType = _objectWithoutProperties(_input, _excluded2$3);
        const commonOptions = _objectSpread2(
            {
                render,
                key,
                label: label !== null && label !== void 0 ? label : key,
                hint,
                transient:
                    transient !== null && transient !== void 0
                        ? transient
                        : !!onChange,
                onEditStart,
                onEditEnd,
                disabled,
                optional: optional2,
                order
            },
            mergedOptions
        );
        let { type } = inputWithType,
            input = _objectWithoutProperties(inputWithType, _excluded3);
        type = customType !== null && customType !== void 0 ? customType : type;
        if (type in SpecialInputs) {
            return { type, input, options: commonOptions };
        }
        let computedInput;
        if (customType && isObject(input) && 'value' in input)
            computedInput = input.value;
        else computedInput = isEmptyObject(input) ? void 0 : input;
        return {
            type,
            input: computedInput,
            options: _objectSpread2(
                _objectSpread2({}, commonOptions),
                {},
                {
                    onChange,
                    optional:
                        (_commonOptions$option = commonOptions.optional) !== null &&
                        _commonOptions$option !== void 0
                            ? _commonOptions$option
                            : false,
                    disabled:
                        (_commonOptions$disabl = commonOptions.disabled) !== null &&
                        _commonOptions$disabl !== void 0
                            ? _commonOptions$disabl
                            : false
                }
            )
        };
    }
    function normalizeInput(_input, key, path, data) {
        const parsedInputAndOptions = parseOptions(_input, key);
        const { type, input: parsedInput, options } = parsedInputAndOptions;
        if (type) {
            if (type in SpecialInputs) return parsedInputAndOptions;
            return {
                type,
                input: normalize$3(type, parsedInput, path, data),
                options
            };
        }
        let inputType = getValueType(parsedInput);
        if (inputType)
            return {
                type: inputType,
                input: normalize$3(inputType, parsedInput, path, data),
                options
            };
        inputType = getValueType({ value: parsedInput });
        if (inputType)
            return {
                type: inputType,
                input: normalize$3(inputType, { value: parsedInput }, path, data),
                options
            };
        return false;
    }
    function updateInput(input, newValue, path, store, fromPanel) {
        const { value, type, settings } = input;
        input.value = sanitizeValue(
            { type, value, settings },
            newValue,
            path,
            store
        );
        input.fromPanel = fromPanel;
    }
    var ValueError = function ValueError2(message, value, error) {
        this.type = 'LEVA_ERROR';
        this.message = 'LEVA: ' + message;
        this.previousValue = value;
        this.error = error;
    };
    function sanitizeValue({ type, value, settings }, newValue, path, store) {
        const _newValue =
            type !== 'SELECT' && typeof newValue === 'function'
                ? newValue(value)
                : newValue;
        let sanitizedNewValue;
        try {
            sanitizedNewValue = sanitize$4(
                type,
                _newValue,
                settings,
                value,
                path,
                store
            );
        } catch (e4) {
            throw new ValueError(
                `The value \`${newValue}\` did not result in a correct value.`,
                value,
                e4
            );
        }
        if (dequal(sanitizedNewValue, value)) {
            return value;
        }
        return sanitizedNewValue;
    }
    var debounce = (callback, wait, immediate = false) => {
        let timeout = 0;
        return function () {
            const args = arguments;
            const callNow = immediate && !timeout;
            const next = () => callback.apply(this, args);
            window.clearTimeout(timeout);
            timeout = window.setTimeout(next, wait);
            if (callNow) next();
        };
    };
    var multiplyStep = (event) => (event.shiftKey ? 5 : event.altKey ? 1 / 5 : 1);
    var _excluded$8 = ['value'];
    var _excluded2$2 = ['min', 'max'];
    var schema$3 = (v4) => {
        if (typeof v4 === 'number') return true;
        if (typeof v4 === 'string') {
            const _v = parseFloat(v4);
            if (isNaN(_v)) return false;
            const suffix = v4.substring(('' + _v).length).trim();
            return suffix.length < 4;
        }
        return false;
    };
    var sanitize$3 = (
        v4,
        { min: _min = -Infinity, max: _max = Infinity, suffix }
    ) => {
        const _v = parseFloat(v4);
        if (v4 === '' || isNaN(_v)) throw Error('Invalid number');
        const f4 = clamp(_v, _min, _max);
        return suffix ? f4 + suffix : f4;
    };
    var format$1 = (v4, { pad: _pad = 0, suffix }) => {
        const f4 = parseFloat(v4).toFixed(_pad);
        return suffix ? f4 + suffix : f4;
    };
    var normalize$2 = (_ref) => {
        let { value } = _ref,
            settings = _objectWithoutProperties(_ref, _excluded$8);
        const { min: min3 = -Infinity, max: max3 = Infinity } = settings,
            _settings = _objectWithoutProperties(settings, _excluded2$2);
        let _value = parseFloat(value);
        const suffix =
            typeof value === 'string'
                ? value.substring(('' + _value).length)
                : void 0;
        _value = clamp(_value, min3, max3);
        let step = settings.step;
        if (!step) {
            if (Number.isFinite(min3)) {
                if (Number.isFinite(max3))
                    step = +(Math.abs(max3 - min3) / 100).toPrecision(1);
                else step = +(Math.abs(_value - min3) / 100).toPrecision(1);
            } else if (Number.isFinite(max3))
                step = +(Math.abs(max3 - _value) / 100).toPrecision(1);
        }
        const padStep = step ? getStep(step) * 10 : getStep(_value);
        step = step || padStep / 10;
        const pad = Math.round(clamp(Math.log10(1 / padStep), 0, 2));
        return {
            value: suffix ? _value + suffix : _value,
            settings: _objectSpread2(
                { initialValue: _value, step, pad, min: min3, max: max3, suffix },
                _settings
            )
        };
    };
    var sanitizeStep$1 = (v4, { step, initialValue }) => {
        const steps = Math.round((v4 - initialValue) / step);
        return initialValue + steps * step;
    };
    var props$3 = Object.freeze({
        __proto__: null,
        schema: schema$3,
        sanitize: sanitize$3,
        format: format$1,
        normalize: normalize$2,
        sanitizeStep: sanitizeStep$1
    });
    function _extends2() {
        _extends2 = Object.assign
            ? Object.assign.bind()
            : function (target) {
                  for (var i4 = 1; i4 < arguments.length; i4++) {
                      var source = arguments[i4];
                      for (var key in source) {
                          if (Object.prototype.hasOwnProperty.call(source, key)) {
                              target[key] = source[key];
                          }
                      }
                  }
                  return target;
              };
        return _extends2.apply(this, arguments);
    }
    var InputContext = React5.createContext({});
    function useInputContext() {
        return React5.useContext(InputContext);
    }
    var ThemeContext = React5.createContext(null);
    var StoreContext = React5.createContext(null);
    var PanelSettingsContext = React5.createContext(null);
    function useStoreContext() {
        return React5.useContext(StoreContext);
    }
    function usePanelSettingsContext() {
        return React5.useContext(PanelSettingsContext);
    }
    function LevaStoreProvider({ children, store }) {
        return React5.createElement(
            StoreContext.Provider,
            { value: store },
            children
        );
    }
    var getDefaultTheme = () => ({
        colors: {
            elevation1: '#292d39',
            elevation2: '#181c20',
            elevation3: '#373c4b',
            accent1: '#0066dc',
            accent2: '#007bff',
            accent3: '#3c93ff',
            highlight1: '#535760',
            highlight2: '#8c92a4',
            highlight3: '#fefefe',
            vivid1: '#ffcc00',
            folderWidgetColor: '$highlight2',
            folderTextColor: '$highlight3',
            toolTipBackground: '$highlight3',
            toolTipText: '$elevation2'
        },
        radii: { xs: '2px', sm: '3px', lg: '10px' },
        space: { xs: '3px', sm: '6px', md: '10px', rowGap: '7px', colGap: '7px' },
        fonts: {
            mono: `ui-monospace, SFMono-Regular, Menlo, 'Roboto Mono', monospace`,
            sans: `system-ui, sans-serif`
        },
        fontSizes: { root: '11px', toolTip: '$root' },
        sizes: {
            rootWidth: '280px',
            controlWidth: '160px',
            numberInputMinWidth: '38px',
            scrubberWidth: '8px',
            scrubberHeight: '16px',
            rowHeight: '24px',
            folderTitleHeight: '20px',
            checkboxSize: '16px',
            joystickWidth: '100px',
            joystickHeight: '100px',
            colorPickerWidth: '$controlWidth',
            colorPickerHeight: '100px',
            imagePreviewWidth: '$controlWidth',
            imagePreviewHeight: '100px',
            monitorHeight: '60px',
            titleBarHeight: '39px'
        },
        shadows: { level1: '0 0 9px 0 #00000088', level2: '0 4px 14px #00000033' },
        borderWidths: {
            root: '0px',
            input: '1px',
            focus: '1px',
            hover: '1px',
            active: '1px',
            folder: '1px'
        },
        fontWeights: { label: 'normal', folder: 'normal', button: 'normal' }
    });
    function createStateClass(value, options) {
        const [borderColor, bgColor] = value.split(' ');
        const css2 = {};
        if (borderColor !== 'none') {
            css2.boxShadow = `${options.inset ? 'inset ' : ''}0 0 0 $borderWidths${[options.key]} $colors${(borderColor !== 'default' && borderColor) || options.borderColor}`;
        }
        if (bgColor) {
            css2.backgroundColor = bgColor;
        }
        return css2;
    }
    var utils = {
        $inputStyle: () => (value) =>
            createStateClass(value, {
                key: '$input',
                borderColor: '$highlight1',
                inset: true
            }),
        $focusStyle: () => (value) =>
            createStateClass(value, { key: '$focus', borderColor: '$accent2' }),
        $hoverStyle: () => (value) =>
            createStateClass(value, {
                key: '$hover',
                borderColor: '$accent1',
                inset: true
            }),
        $activeStyle: () => (value) =>
            createStateClass(value, {
                key: '$active',
                borderColor: '$accent1',
                inset: true
            })
    };
    var { styled, css, createTheme, globalCss, keyframes } = q({
        prefix: 'leva',
        theme: getDefaultTheme(),
        utils: _objectSpread2(
            _objectSpread2({}, utils),
            {},
            {
                $flex: () => ({ display: 'flex', alignItems: 'center' }),
                $flexCenter: () => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }),
                $reset: () => ({
                    outline: 'none',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    color: 'inherit',
                    fontFamily: 'inherit',
                    border: 'none',
                    backgroundColor: 'transparent',
                    appearance: 'none'
                }),
                $draggable: () => ({
                    touchAction: 'none',
                    WebkitUserDrag: 'none',
                    userSelect: 'none'
                }),
                $focus: (value) => ({ '&:focus': utils.$focusStyle()(value) }),
                $focusWithin: (value) => ({
                    '&:focus-within': utils.$focusStyle()(value)
                }),
                $hover: (value) => ({ '&:hover': utils.$hoverStyle()(value) }),
                $active: (value) => ({ '&:active': utils.$activeStyle()(value) })
            }
        )
    });
    var globalStyles = globalCss({
        '.leva__panel__dragged': {
            WebkitUserDrag: 'none',
            userSelect: 'none',
            input: { userSelect: 'none' },
            '*': { cursor: 'ew-resize !important' }
        }
    });
    function mergeTheme(newTheme) {
        const defaultTheme = getDefaultTheme();
        if (!newTheme) return { theme: defaultTheme, className: '' };
        Object.keys(newTheme).forEach((key) => {
            Object.assign(defaultTheme[key], newTheme[key]);
        });
        const customTheme = createTheme(defaultTheme);
        return { theme: defaultTheme, className: customTheme.className };
    }
    function useTh(category, key) {
        const { theme } = React5.useContext(ThemeContext);
        if (!(category in theme) || !(key in theme[category])) {
            warn(LevaErrors.THEME_ERROR, category, key);
            return '';
        }
        let _key = key;
        while (true) {
            let value = theme[category][_key];
            if (typeof value === 'string' && value.charAt(0) === '$')
                _key = value.substr(1);
            else return value;
        }
    }
    var StyledInput = styled('input', {
        $reset: '',
        padding: '0 $sm',
        width: 0,
        minWidth: 0,
        flex: 1,
        height: '100%',
        variants: {
            levaType: { number: { textAlign: 'right' } },
            as: { textarea: { padding: '$sm' } }
        }
    });
    var InnerLabel = styled('div', {
        $draggable: '',
        height: '100%',
        $flexCenter: '',
        position: 'relative',
        padding: '0 $xs',
        fontSize: '0.8em',
        opacity: 0.8,
        cursor: 'default',
        touchAction: 'none',
        [`& + ${StyledInput}`]: { paddingLeft: 0 }
    });
    var InnerNumberLabel = styled(InnerLabel, {
        cursor: 'ew-resize',
        marginRight: '-$xs',
        textTransform: 'uppercase',
        opacity: 0.3,
        '&:hover': { opacity: 1 },
        variants: {
            dragging: { true: { backgroundColor: '$accent2', opacity: 1 } }
        }
    });
    var InputContainer = styled('div', {
        $flex: '',
        position: 'relative',
        borderRadius: '$sm',
        overflow: 'hidden',
        color: 'inherit',
        height: '$rowHeight',
        backgroundColor: '$elevation3',
        $inputStyle: '$elevation1',
        $hover: '',
        $focusWithin: '',
        variants: { textArea: { true: { height: 'auto' } } }
    });
    var _excluded$7 = [
        'innerLabel',
        'value',
        'onUpdate',
        'onChange',
        'onKeyDown',
        'type',
        'id',
        'inputType',
        'rows'
    ];
    var _excluded2$1 = ['onUpdate'];
    function ValueInput(_ref) {
        let {
                innerLabel,
                value,
                onUpdate,
                onChange,
                onKeyDown,
                type,
                id,
                inputType = 'text',
                rows = 0
            } = _ref,
            props3 = _objectWithoutProperties(_ref, _excluded$7);
        const {
            id: _id,
            emitOnEditStart,
            emitOnEditEnd,
            disabled
        } = useInputContext();
        const inputId = id || _id;
        const inputRef = React5.useRef(null);
        const isTextArea = rows > 0;
        const asType = isTextArea ? 'textarea' : 'input';
        const update = React5.useCallback(
            (fn) => (event) => {
                const _value = event.currentTarget.value;
                fn(_value);
            },
            []
        );
        React5.useEffect(() => {
            const ref = inputRef.current;
            const _onUpdate = update((value2) => {
                onUpdate(value2);
                emitOnEditEnd();
            });
            ref === null || ref === void 0
                ? void 0
                : ref.addEventListener('blur', _onUpdate);
            return () =>
                ref === null || ref === void 0
                    ? void 0
                    : ref.removeEventListener('blur', _onUpdate);
        }, [update, onUpdate, emitOnEditEnd]);
        const onKeyPress = React5.useCallback(
            (event) => {
                if (event.key === 'Enter') {
                    update(onUpdate)(event);
                }
            },
            [update, onUpdate]
        );
        const inputProps = Object.assign(
            { as: asType },
            isTextArea ? { rows } : {},
            props3
        );
        return React5.createElement(
            InputContainer,
            { textArea: isTextArea },
            innerLabel && typeof innerLabel === 'string'
                ? React5.createElement(InnerLabel, null, innerLabel)
                : innerLabel,
            React5.createElement(
                StyledInput,
                _extends2(
                    {
                        levaType: type,
                        ref: inputRef,
                        id: inputId,
                        type: inputType,
                        autoComplete: 'off',
                        spellCheck: 'false',
                        value,
                        onChange: update(onChange),
                        onFocus: () => emitOnEditStart(),
                        onKeyPress,
                        onKeyDown,
                        disabled
                    },
                    inputProps
                )
            )
        );
    }
    function NumberInput(_ref2) {
        let { onUpdate } = _ref2,
            props3 = _objectWithoutProperties(_ref2, _excluded2$1);
        const _onUpdate = React5.useCallback(
            (v4) => onUpdate(parseNumber(v4)),
            [onUpdate]
        );
        const onKeyDown = React5.useCallback(
            (event) => {
                const dir =
                    event.key === 'ArrowUp'
                        ? 1
                        : event.key === 'ArrowDown'
                          ? -1
                          : 0;
                if (dir) {
                    event.preventDefault();
                    const step = event.altKey ? 0.1 : event.shiftKey ? 10 : 1;
                    onUpdate((v4) => parseFloat(v4) + dir * step);
                }
            },
            [onUpdate]
        );
        return React5.createElement(
            ValueInput,
            _extends2({}, props3, {
                onUpdate: _onUpdate,
                onKeyDown,
                type: 'number'
            })
        );
    }
    var StyledFolder = styled('div', {});
    var StyledWrapper = styled('div', {
        position: 'relative',
        background: '$elevation2',
        transition: 'height 300ms ease',
        variants: {
            fill: { true: {}, false: {} },
            flat: { false: {}, true: {} },
            isRoot: {
                true: {},
                false: {
                    paddingLeft: '$md',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '$borderWidths$folder',
                        height: '100%',
                        backgroundColor: '$folderWidgetColor',
                        opacity: 0.4,
                        transform: 'translateX(-50%)'
                    }
                }
            }
        },
        compoundVariants: [
            {
                isRoot: true,
                fill: false,
                css: {
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 20px - $$titleBarHeight)'
                }
            },
            { isRoot: true, flat: false, css: { borderRadius: '$lg' } }
        ]
    });
    var StyledTitle = styled('div', {
        $flex: '',
        color: '$folderTextColor',
        userSelect: 'none',
        cursor: 'pointer',
        height: '$folderTitleHeight',
        fontWeight: '$folder',
        '> svg': {
            marginLeft: -4,
            marginRight: 4,
            cursor: 'pointer',
            fill: '$folderWidgetColor',
            opacity: 0.6
        },
        '&:hover > svg': { fill: '$folderWidgetColor' },
        [`&:hover + ${StyledWrapper}::after`]: { opacity: 0.6 },
        [`${StyledFolder}:hover > & + ${StyledWrapper}::after`]: { opacity: 0.6 },
        [`${StyledFolder}:hover > & > svg`]: { opacity: 1 }
    });
    var StyledContent = styled('div', {
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '100%',
        rowGap: '$rowGap',
        transition: 'opacity 250ms ease',
        variants: {
            toggled: {
                true: { opacity: 1, transitionDelay: '250ms' },
                false: { opacity: 0, transitionDelay: '0ms', pointerEvents: 'none' }
            },
            isRoot: {
                true: {
                    '& > div': { paddingLeft: '$md', paddingRight: '$md' },
                    '& > div:first-of-type': { paddingTop: '$sm' },
                    '& > div:last-of-type': { paddingBottom: '$sm' },
                    [`> ${StyledFolder}:not(:first-of-type)`]: {
                        paddingTop: '$sm',
                        marginTop: '$md',
                        borderTop: '$borderWidths$folder solid $colors$elevation1'
                    }
                }
            }
        }
    });
    var StyledRow = styled('div', {
        position: 'relative',
        zIndex: 100,
        display: 'grid',
        rowGap: '$rowGap',
        gridTemplateRows: 'minmax($sizes$rowHeight, max-content)',
        alignItems: 'center',
        color: '$highlight2',
        [`${StyledContent} > &`]: {
            '&:first-of-type': { marginTop: '$rowGap' },
            '&:last-of-type': { marginBottom: '$rowGap' }
        },
        variants: {
            disabled: {
                true: { pointerEvents: 'none' },
                false: { '&:hover,&:focus-within': { color: '$highlight3' } }
            }
        }
    });
    var StyledInputRow = styled(StyledRow, {
        gridTemplateColumns: 'auto $sizes$controlWidth',
        columnGap: '$colGap'
    });
    var CopyLabelContainer = styled('div', {
        $flex: '',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '& > div': { marginLeft: '$colGap', padding: '0 $xs', opacity: 0.4 },
        '& > div:hover': { opacity: 0.8 },
        '& > div > svg': {
            display: 'none',
            cursor: 'pointer',
            width: 13,
            minWidth: 13,
            height: 13,
            backgroundColor: '$elevation2'
        },
        '&:hover > div > svg': { display: 'block' },
        variants: {
            align: {
                top: { height: '100%', alignItems: 'flex-start', paddingTop: '$sm' }
            }
        }
    });
    var StyledOptionalToggle = styled('input', {
        $reset: '',
        height: 0,
        width: 0,
        opacity: 0,
        margin: 0,
        '& + label': {
            position: 'relative',
            $flexCenter: '',
            height: '100%',
            userSelect: 'none',
            cursor: 'pointer',
            paddingLeft: 2,
            paddingRight: '$sm',
            pointerEvents: 'auto'
        },
        '& + label:after': {
            content: '""',
            width: 6,
            height: 6,
            backgroundColor: '$elevation3',
            borderRadius: '50%',
            $activeStyle: ''
        },
        '&:focus + label:after': { $focusStyle: '' },
        '& + label:active:after': { backgroundColor: '$accent1', $focusStyle: '' },
        '&:checked + label:after': { backgroundColor: '$accent1' }
    });
    var StyledLabel = styled('label', {
        fontWeight: '$label',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        '& > svg': { display: 'block' }
    });
    var StyledInputWrapper$1 = styled('div', {
        opacity: 1,
        variants: {
            disabled: {
                true: {
                    opacity: 0.6,
                    pointerEvents: 'none',
                    [`& ${StyledLabel}`]: { pointerEvents: 'auto' }
                }
            }
        }
    });
    var Overlay = styled('div', {
        position: 'fixed',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 1e3,
        userSelect: 'none'
    });
    var StyledToolTipContent = styled('div', {
        background: '$toolTipBackground',
        fontFamily: '$sans',
        fontSize: '$toolTip',
        padding: '$xs $sm',
        color: '$toolTipText',
        borderRadius: '$xs',
        boxShadow: '$level2',
        maxWidth: 260
    });
    var ToolTipArrow = styled($a093c7e1ec25a057$export$21b07c8f274aebd5, {
        fill: '$toolTipBackground'
    });
    function Portal({ children }) {
        const { className } = React5.useContext(ThemeContext);
        return React5.createElement(
            $f1701beae083dbae$export$be92b6f5f03c0fe9,
            { className },
            children
        );
    }
    var _excluded$6 = ['align'];
    function OptionalToggle() {
        const { id, disable, disabled } = useInputContext();
        return React5.createElement(
            React5.Fragment,
            null,
            React5.createElement(StyledOptionalToggle, {
                id: id + '__disable',
                type: 'checkbox',
                checked: !disabled,
                onChange: () => disable(!disabled)
            }),
            React5.createElement('label', { htmlFor: id + '__disable' })
        );
    }
    function RawLabel(props3) {
        const { id, optional: optional2, hint } = useInputContext();
        const htmlFor = props3.htmlFor || (id ? { htmlFor: id } : null);
        const title =
            !hint && typeof props3.children === 'string'
                ? { title: props3.children }
                : null;
        return React5.createElement(
            React5.Fragment,
            null,
            optional2 && React5.createElement(OptionalToggle, null),
            hint !== void 0
                ? React5.createElement(
                      $a093c7e1ec25a057$export$be92b6f5f03c0fe9,
                      null,
                      React5.createElement(
                          $a093c7e1ec25a057$export$41fb9f06171c75f4,
                          { asChild: true },
                          React5.createElement(
                              StyledLabel,
                              _extends2({}, htmlFor, props3)
                          )
                      ),
                      React5.createElement(
                          $a093c7e1ec25a057$export$7c6e2c02157bb7d2,
                          { side: 'top', sideOffset: 2 },
                          React5.createElement(
                              StyledToolTipContent,
                              null,
                              hint,
                              React5.createElement(ToolTipArrow, null)
                          )
                      )
                  )
                : React5.createElement(
                      StyledLabel,
                      _extends2({}, htmlFor, title, props3)
                  )
        );
    }
    function Label(_ref) {
        let { align } = _ref,
            props3 = _objectWithoutProperties(_ref, _excluded$6);
        const { value, label, key, disabled } = useInputContext();
        const { hideCopyButton } = usePanelSettingsContext();
        const copyEnabled = !hideCopyButton && key !== void 0;
        const [copied, setCopied] = React5.useState(false);
        const handleClick = async () => {
            try {
                await navigator.clipboard.writeText(
                    JSON.stringify({
                        [key]: value !== null && value !== void 0 ? value : ''
                    })
                );
                setCopied(true);
            } catch (_unused) {
                warn(LevaErrors.CLIPBOARD_ERROR, { [key]: value });
            }
        };
        return React5.createElement(
            CopyLabelContainer,
            { align, onPointerLeave: () => setCopied(false) },
            React5.createElement(RawLabel, props3),
            copyEnabled &&
                !disabled &&
                React5.createElement(
                    'div',
                    {
                        title: `Click to copy ${typeof label === 'string' ? label : key} value`
                    },
                    !copied
                        ? React5.createElement(
                              'svg',
                              {
                                  onClick: handleClick,
                                  xmlns: 'http://www.w3.org/2000/svg',
                                  viewBox: '0 0 20 20',
                                  fill: 'currentColor'
                              },
                              React5.createElement('path', {
                                  d: 'M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z'
                              }),
                              React5.createElement('path', {
                                  d: 'M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z'
                              })
                          )
                        : React5.createElement(
                              'svg',
                              {
                                  xmlns: 'http://www.w3.org/2000/svg',
                                  viewBox: '0 0 20 20',
                                  fill: 'currentColor'
                              },
                              React5.createElement('path', {
                                  d: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9z'
                              }),
                              React5.createElement('path', {
                                  fillRule: 'evenodd',
                                  d: 'M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
                                  clipRule: 'evenodd'
                              })
                          )
                )
        );
    }
    var _excluded$5 = ['toggled'];
    var Svg = styled('svg', {
        fill: 'currentColor',
        transition: 'transform 350ms ease, fill 250ms ease'
    });
    function Chevron(_ref) {
        let { toggled } = _ref,
            props3 = _objectWithoutProperties(_ref, _excluded$5);
        return React5.createElement(
            Svg,
            _extends2(
                {
                    width: '9',
                    height: '5',
                    viewBox: '0 0 9 5',
                    xmlns: 'http://www.w3.org/2000/svg',
                    style: { transform: `rotate(${toggled ? 0 : -90}deg)` }
                },
                props3
            ),
            React5.createElement('path', {
                d: 'M3.8 4.4c.4.3 1 .3 1.4 0L8 1.7A1 1 0 007.4 0H1.6a1 1 0 00-.7 1.7l3 2.7z'
            })
        );
    }
    var _excluded$4 = ['input'];
    function Row(_ref) {
        let { input } = _ref,
            props3 = _objectWithoutProperties(_ref, _excluded$4);
        if (input) return React5.createElement(StyledInputRow, props3);
        return React5.createElement(StyledRow, props3);
    }
    function useInputSetters({ value, type, settings, setValue }) {
        const [displayValue, setDisplayValue] = React5.useState(
            format$2(type, value, settings)
        );
        const previousValueRef = React5.useRef(value);
        const settingsRef = React5.useRef(settings);
        settingsRef.current = settings;
        const setFormat = React5.useCallback(
            (v4) => setDisplayValue(format$2(type, v4, settingsRef.current)),
            [type]
        );
        const onUpdate = React5.useCallback(
            (updatedValue) => {
                try {
                    setValue(updatedValue);
                } catch (error) {
                    const { type: type2, previousValue } = error;
                    if (type2 !== 'LEVA_ERROR') throw error;
                    setFormat(previousValue);
                }
            },
            [setFormat, setValue]
        );
        React5.useEffect(() => {
            if (!dequal(value, previousValueRef.current)) {
                setFormat(value);
            }
            previousValueRef.current = value;
        }, [value, setFormat]);
        return { displayValue, onChange: setDisplayValue, onUpdate };
    }
    function useDrag2(handler, config) {
        const { emitOnEditStart, emitOnEditEnd } = useInputContext();
        return useDrag((state) => {
            if (state.first) {
                document.body.classList.add('leva__panel__dragged');
                emitOnEditStart === null || emitOnEditStart === void 0
                    ? void 0
                    : emitOnEditStart();
            }
            const result = handler(state);
            if (state.last) {
                document.body.classList.remove('leva__panel__dragged');
                emitOnEditEnd === null || emitOnEditEnd === void 0
                    ? void 0
                    : emitOnEditEnd();
            }
            return result;
        }, config);
    }
    function useCanvas2d(fn) {
        const canvas = React5.useRef(null);
        const ctx = React5.useRef(null);
        const hasFired = React5.useRef(false);
        React5.useEffect(() => {
            const handleCanvas = debounce(() => {
                canvas.current.width =
                    canvas.current.offsetWidth * window.devicePixelRatio;
                canvas.current.height =
                    canvas.current.offsetHeight * window.devicePixelRatio;
                fn(canvas.current, ctx.current);
            }, 250);
            window.addEventListener('resize', handleCanvas);
            if (!hasFired.current) {
                handleCanvas();
                hasFired.current = true;
            }
            return () => window.removeEventListener('resize', handleCanvas);
        }, [fn]);
        React5.useEffect(() => {
            ctx.current = canvas.current.getContext('2d');
        }, []);
        return [canvas, ctx];
    }
    function useTransform() {
        const ref = React5.useRef(null);
        const local = React5.useRef({ x: 0, y: 0 });
        const set = React5.useCallback((point) => {
            Object.assign(local.current, point);
            if (ref.current)
                ref.current.style.transform = `translate3d(${local.current.x}px, ${local.current.y}px, 0)`;
        }, []);
        return [ref, set];
    }
    var _excluded$3 = ['__refCount'];
    var getInputAtPath = (data, path) => {
        if (!data[path]) return null;
        const _data$path = data[path],
            input = _objectWithoutProperties(_data$path, _excluded$3);
        return input;
    };
    function useInput(path) {
        const store = useStoreContext();
        const [state, setState] = React5.useState(getInputAtPath(store.getData(), path));
        const set = React5.useCallback(
            (value) => store.setValueAtPath(path, value, true),
            [path, store]
        );
        const setSettings = React5.useCallback(
            (settings) => store.setSettingsAtPath(path, settings),
            [path, store]
        );
        const disable = React5.useCallback(
            (flag) => store.disableInputAtPath(path, flag),
            [path, store]
        );
        const emitOnEditStart = React5.useCallback(
            () => store.emitOnEditStart(path),
            [path, store]
        );
        const emitOnEditEnd = React5.useCallback(
            () => store.emitOnEditEnd(path),
            [path, store]
        );
        React5.useEffect(() => {
            setState(getInputAtPath(store.getData(), path));
            const unsub = store.useStore.subscribe(
                (s4) => getInputAtPath(s4.data, path),
                setState,
                { equalityFn: shallow }
            );
            return () => unsub();
        }, [store, path]);
        return [
            state,
            {
                set,
                setSettings,
                disable,
                storeId: store.storeId,
                emitOnEditStart,
                emitOnEditEnd
            }
        ];
    }
    var RangeGrid = styled('div', {
        variants: {
            hasRange: {
                true: {
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: 'auto $sizes$numberInputMinWidth',
                    columnGap: '$colGap',
                    alignItems: 'center'
                }
            }
        }
    });
    var Range = styled('div', {
        position: 'relative',
        width: '100%',
        height: 2,
        borderRadius: '$xs',
        backgroundColor: '$elevation1'
    });
    var Scrubber = styled('div', {
        position: 'absolute',
        width: '$scrubberWidth',
        height: '$scrubberHeight',
        borderRadius: '$xs',
        boxShadow: '0 0 0 2px $colors$elevation2',
        backgroundColor: '$accent2',
        cursor: 'pointer',
        $active: 'none $accent1',
        $hover: 'none $accent3',
        variants: {
            position: {
                left: {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    transform:
                        'translateX(calc(-0.5 * ($sizes$scrubberWidth + 4px)))'
                },
                right: {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    transform:
                        'translateX(calc(0.5 * ($sizes$scrubberWidth + 4px)))'
                }
            }
        }
    });
    var RangeWrapper = styled('div', {
        position: 'relative',
        $flex: '',
        height: '100%',
        cursor: 'pointer',
        touchAction: 'none'
    });
    var Indicator = styled('div', {
        position: 'absolute',
        height: '100%',
        backgroundColor: '$accent2'
    });
    function RangeSlider({
        value,
        min: min3,
        max: max3,
        onDrag,
        step,
        initialValue
    }) {
        const ref = React5.useRef(null);
        const scrubberRef = React5.useRef(null);
        const rangeWidth = React5.useRef(0);
        const scrubberWidth = useTh('sizes', 'scrubberWidth');
        const bind = useDrag2(
            ({ event, first, xy: [x3], movement: [mx], memo }) => {
                if (first) {
                    const { width, left } = ref.current.getBoundingClientRect();
                    rangeWidth.current = width - parseFloat(scrubberWidth);
                    const targetIsScrub =
                        (event === null || event === void 0
                            ? void 0
                            : event.target) === scrubberRef.current;
                    memo = targetIsScrub
                        ? value
                        : invertedRange((x3 - left) / width, min3, max3);
                }
                const newValue =
                    memo + invertedRange(mx / rangeWidth.current, 0, max3 - min3);
                onDrag(sanitizeStep$1(newValue, { step, initialValue }));
                return memo;
            }
        );
        const pos = range(value, min3, max3);
        return React5.createElement(
            RangeWrapper,
            _extends2({ ref }, bind()),
            React5.createElement(
                Range,
                null,
                React5.createElement(Indicator, {
                    style: { left: 0, right: `${(1 - pos) * 100}%` }
                })
            ),
            React5.createElement(Scrubber, {
                ref: scrubberRef,
                style: { left: `calc(${pos} * (100% - ${scrubberWidth}))` }
            })
        );
    }
    var DraggableLabel = React5.memo(
        ({ label, onUpdate, step, innerLabelTrim }) => {
            const [dragging, setDragging] = React5.useState(false);
            const bind = useDrag2(
                ({
                    active,
                    delta: [dx],
                    event,
                    memo: _memo = 0,
                    first,
                    last,
                    target
                }) => {
                    if (first) {
                        const label2 = target;
                        label2.requestPointerLock();
                    }
                    if (last) {
                        document.exitPointerLock();
                    }
                    setDragging(active);
                    _memo += dx / 2;
                    if (Math.abs(_memo) >= 1) {
                        onUpdate(
                            (v4) =>
                                parseFloat(v4) +
                                Math.floor(_memo) * step * multiplyStep(event)
                        );
                        _memo = 0;
                    }
                    return _memo;
                }
            );
            return React5.createElement(
                InnerNumberLabel,
                _extends2(
                    { dragging, title: label.length > 1 ? label : '' },
                    bind()
                ),
                label.slice(0, innerLabelTrim)
            );
        }
    );
    function Number$1({
        label,
        id,
        displayValue,
        onUpdate,
        onChange,
        settings,
        innerLabelTrim = 1
    }) {
        const InnerLabel2 =
            innerLabelTrim > 0 &&
            React5.createElement(DraggableLabel, {
                label,
                step: settings.step,
                onUpdate,
                innerLabelTrim
            });
        return React5.createElement(NumberInput, {
            id,
            value: String(displayValue),
            onUpdate,
            onChange,
            innerLabel: InnerLabel2
        });
    }
    function NumberComponent() {
        const props3 = useInputContext();
        const { label, value, onUpdate, settings, id } = props3;
        const { min: min3, max: max3 } = settings;
        const hasRange = max3 !== Infinity && min3 !== -Infinity;
        return React5.createElement(
            Row,
            { input: true },
            React5.createElement(Label, null, label),
            React5.createElement(
                RangeGrid,
                { hasRange },
                hasRange &&
                    React5.createElement(
                        RangeSlider,
                        _extends2(
                            { value: parseFloat(value), onDrag: onUpdate },
                            settings
                        )
                    ),
                React5.createElement(
                    Number$1,
                    _extends2({}, props3, {
                        id,
                        label: 'value',
                        innerLabelTrim: hasRange ? 0 : 1
                    })
                )
            )
        );
    }
    var { sanitizeStep } = props$3;
    var rest = _objectWithoutProperties(props$3, ['sanitizeStep']);
    var number = createInternalPlugin(
        _objectSpread2({ component: NumberComponent }, rest)
    );
    var schema$2 = (_o, s4) =>
        v8n_esm_default()
            .schema({
                options: v8n_esm_default().passesAnyOf(
                    v8n_esm_default().object(),
                    v8n_esm_default().array()
                )
            })
            .test(s4);
    var sanitize$2 = (value, { values }) => {
        if (values.indexOf(value) < 0)
            throw Error(`Selected value doesn't match Select options`);
        return value;
    };
    var format = (value, { values }) => {
        return values.indexOf(value);
    };
    var normalize$1 = (input) => {
        let { value, options } = input;
        let keys;
        let values;
        if (Array.isArray(options)) {
            values = options;
            keys = options.map((o4) => String(o4));
        } else {
            values = Object.values(options);
            keys = Object.keys(options);
        }
        if (!('value' in input)) value = values[0];
        else if (!values.includes(value)) {
            keys.unshift(String(value));
            values.unshift(value);
        }
        if (!Object.values(options).includes(value)) options[String(value)] = value;
        return { value, settings: { keys, values } };
    };
    var props$2 = Object.freeze({
        __proto__: null,
        schema: schema$2,
        sanitize: sanitize$2,
        format,
        normalize: normalize$1
    });
    var SelectContainer = styled('div', {
        $flexCenter: '',
        position: 'relative',
        '> svg': { pointerEvents: 'none', position: 'absolute', right: '$md' }
    });
    var NativeSelect = styled('select', {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0
    });
    var PresentationalSelect = styled('div', {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '$rowHeight',
        backgroundColor: '$elevation3',
        borderRadius: '$sm',
        padding: '0 $sm',
        cursor: 'pointer',
        [`${NativeSelect}:focus + &`]: { $focusStyle: '' },
        [`${NativeSelect}:hover + &`]: { $hoverStyle: '' }
    });
    function Select({ displayValue, value, onUpdate, id, settings, disabled }) {
        const { keys, values } = settings;
        const lastDisplayedValue = React5.useRef();
        if (value === values[displayValue]) {
            lastDisplayedValue.current = keys[displayValue];
        }
        return React5.createElement(
            SelectContainer,
            null,
            React5.createElement(
                NativeSelect,
                {
                    id,
                    value: displayValue,
                    onChange: (e4) =>
                        onUpdate(values[Number(e4.currentTarget.value)]),
                    disabled
                },
                keys.map((key, index2) =>
                    React5.createElement('option', { key, value: index2 }, key)
                )
            ),
            React5.createElement(
                PresentationalSelect,
                null,
                lastDisplayedValue.current
            ),
            React5.createElement(Chevron, { toggled: true })
        );
    }
    function SelectComponent() {
        const { label, value, displayValue, onUpdate, id, disabled, settings } =
            useInputContext();
        return React5.createElement(
            Row,
            { input: true },
            React5.createElement(Label, null, label),
            React5.createElement(Select, {
                id,
                value,
                displayValue,
                onUpdate,
                settings,
                disabled
            })
        );
    }
    var select = createInternalPlugin(
        _objectSpread2({ component: SelectComponent }, props$2)
    );
    var schema$1 = (o4) => v8n_esm_default().string().test(o4);
    var sanitize$1 = (v4) => {
        if (typeof v4 !== 'string') throw Error(`Invalid string`);
        return v4;
    };
    var normalize = ({
        value,
        editable: _editable = true,
        rows: _rows = false
    }) => {
        return {
            value,
            settings: {
                editable: _editable,
                rows: typeof _rows === 'number' ? _rows : _rows ? 5 : 0
            }
        };
    };
    var props$1 = Object.freeze({
        __proto__: null,
        schema: schema$1,
        sanitize: sanitize$1,
        normalize
    });
    var _excluded$2 = ['displayValue', 'onUpdate', 'onChange', 'editable'];
    var NonEditableString = styled('div', { whiteSpace: 'pre-wrap' });
    function String$1(_ref) {
        let { displayValue, onUpdate, onChange, editable = true } = _ref,
            props3 = _objectWithoutProperties(_ref, _excluded$2);
        if (editable)
            return React5.createElement(
                ValueInput,
                _extends2({ value: displayValue, onUpdate, onChange }, props3)
            );
        return React5.createElement(NonEditableString, null, displayValue);
    }
    function StringComponent() {
        const { label, settings, displayValue, onUpdate, onChange } =
            useInputContext();
        return React5.createElement(
            Row,
            { input: true },
            React5.createElement(Label, null, label),
            React5.createElement(
                String$1,
                _extends2({ displayValue, onUpdate, onChange }, settings)
            )
        );
    }
    var string = createInternalPlugin(
        _objectSpread2({ component: StringComponent }, props$1)
    );
    var schema = (o4) => v8n_esm_default().boolean().test(o4);
    var sanitize = (v4) => {
        if (typeof v4 !== 'boolean') throw Error('Invalid boolean');
        return v4;
    };
    var props = Object.freeze({ __proto__: null, schema, sanitize });
    var StyledInputWrapper = styled('div', {
        position: 'relative',
        $flex: '',
        height: '$rowHeight',
        input: { $reset: '', height: 0, width: 0, opacity: 0, margin: 0 },
        label: {
            position: 'relative',
            $flexCenter: '',
            userSelect: 'none',
            cursor: 'pointer',
            height: '$checkboxSize',
            width: '$checkboxSize',
            backgroundColor: '$elevation3',
            borderRadius: '$sm',
            $hover: ''
        },
        'input:focus + label': { $focusStyle: '' },
        'input:focus:checked + label, input:checked + label:hover': {
            $hoverStyle: '$accent3'
        },
        'input + label:active': { backgroundColor: '$accent1' },
        'input:checked + label:active': { backgroundColor: '$accent1' },
        'label > svg': {
            display: 'none',
            width: '90%',
            height: '90%',
            stroke: '$highlight3'
        },
        'input:checked + label': { backgroundColor: '$accent2' },
        'input:checked + label > svg': { display: 'block' }
    });
    function Boolean2({ value, onUpdate, id, disabled }) {
        return React5.createElement(
            StyledInputWrapper,
            null,
            React5.createElement('input', {
                id,
                type: 'checkbox',
                checked: value,
                onChange: (e4) => onUpdate(e4.currentTarget.checked),
                disabled
            }),
            React5.createElement(
                'label',
                { htmlFor: id },
                React5.createElement(
                    'svg',
                    {
                        xmlns: 'http://www.w3.org/2000/svg',
                        fill: 'none',
                        viewBox: '0 0 24 24'
                    },
                    React5.createElement('path', {
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeWidth: 2,
                        d: 'M5 13l4 4L19 7'
                    })
                )
            )
        );
    }
    function BooleanComponent() {
        const { label, value, onUpdate, disabled, id } = useInputContext();
        return React5.createElement(
            Row,
            { input: true },
            React5.createElement(Label, null, label),
            React5.createElement(Boolean2, { value, onUpdate, id, disabled })
        );
    }
    var boolean = createInternalPlugin(
        _objectSpread2({ component: BooleanComponent }, props)
    );
    var _excluded$1 = ['locked'];
    function Coordinate({
        value,
        id,
        valueKey,
        settings,
        onUpdate,
        innerLabelTrim
    }) {
        const valueRef = React5.useRef(value[valueKey]);
        valueRef.current = value[valueKey];
        const setValue = React5.useCallback(
            (newValue) =>
                onUpdate({
                    [valueKey]: sanitizeValue(
                        { type: 'NUMBER', value: valueRef.current, settings },
                        newValue
                    )
                }),
            [onUpdate, settings, valueKey]
        );
        const number3 = useInputSetters({
            type: 'NUMBER',
            value: value[valueKey],
            settings,
            setValue
        });
        return React5.createElement(Number$1, {
            id,
            label: valueKey,
            value: value[valueKey],
            displayValue: number3.displayValue,
            onUpdate: number3.onUpdate,
            onChange: number3.onChange,
            settings,
            innerLabelTrim
        });
    }
    var Container = styled('div', {
        display: 'grid',
        columnGap: '$colGap',
        gridAutoFlow: 'column dense',
        alignItems: 'center',
        variants: {
            withLock: {
                true: {
                    gridTemplateColumns: '10px auto',
                    '> svg': { cursor: 'pointer' }
                }
            }
        }
    });
    function Lock(_ref) {
        let { locked } = _ref,
            props3 = _objectWithoutProperties(_ref, _excluded$1);
        return React5.createElement(
            'svg',
            _extends2(
                {
                    width: '10',
                    height: '10',
                    viewBox: '0 0 15 15',
                    fill: 'none',
                    xmlns: 'http://www.w3.org/2000/svg'
                },
                props3
            ),
            locked
                ? React5.createElement('path', {
                      d: 'M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z',
                      fill: 'currentColor',
                      fillRule: 'evenodd',
                      clipRule: 'evenodd'
                  })
                : React5.createElement('path', {
                      d: 'M9 3.63601C9 2.76044 9.24207 2.11211 9.64154 1.68623C10.0366 1.26502 10.6432 1 11.5014 1C12.4485 1 13.0839 1.30552 13.4722 1.80636C13.8031 2.23312 14 2.84313 14 3.63325H15C15 2.68242 14.7626 1.83856 14.2625 1.19361C13.6389 0.38943 12.6743 0 11.5014 0C10.4294 0 9.53523 0.337871 8.91218 1.0021C8.29351 1.66167 8 2.58135 8 3.63601V6H1C0.447715 6 0 6.44772 0 7V13C0 13.5523 0.447715 14 1 14H10C10.5523 14 11 13.5523 11 13V7C11 6.44772 10.5523 6 10 6H9V3.63601ZM1 7H10V13H1V7Z',
                      fill: 'currentColor',
                      fillRule: 'evenodd',
                      clipRule: 'evenodd'
                  })
        );
    }
    function Vector({ value, onUpdate, settings, innerLabelTrim }) {
        const { id, setSettings } = useInputContext();
        const { lock, locked } = settings;
        return React5.createElement(
            Container,
            { withLock: lock },
            lock &&
                React5.createElement(Lock, {
                    locked,
                    onClick: () => setSettings({ locked: !locked })
                }),
            Object.keys(value).map((key, i4) =>
                React5.createElement(Coordinate, {
                    id: i4 === 0 ? id : `${id}.${key}`,
                    key,
                    valueKey: key,
                    value,
                    settings: settings[key],
                    onUpdate,
                    innerLabelTrim
                })
            )
        );
    }
    var normalizeKeyedNumberSettings = (value, settings) => {
        const _settings = {};
        let maxStep = 0;
        let minPad = Infinity;
        Object.entries(value).forEach(([key, v4]) => {
            _settings[key] = normalize$2(
                _objectSpread2({ value: v4 }, settings[key])
            ).settings;
            maxStep = Math.max(maxStep, _settings[key].step);
            minPad = Math.min(minPad, _settings[key].pad);
        });
        for (let key in _settings) {
            const { step, min: min3, max: max3 } = settings[key] || {};
            if (!isFinite(step) && (!isFinite(min3) || !isFinite(max3))) {
                _settings[key].step = maxStep;
                _settings[key].pad = minPad;
            }
        }
        return _settings;
    };
    var _excluded = ['lock'];
    var _excluded2 = ['value'];
    function getVectorSchema(dimension) {
        const isVectorArray = v8n_esm_default()
            .array()
            .length(dimension)
            .every.number();
        const isVectorObject = (o4) => {
            if (!o4 || typeof o4 !== 'object') return false;
            const values = Object.values(o4);
            return (
                values.length === dimension && values.every((v4) => isFinite(v4))
            );
        };
        return (o4) => {
            return isVectorArray.test(o4) || isVectorObject(o4);
        };
    }
    function getVectorType(value) {
        return Array.isArray(value) ? 'array' : 'object';
    }
    function convert(value, format3, keys) {
        if (getVectorType(value) === format3) return value;
        return format3 === 'array'
            ? Object.values(value)
            : mapArrayToKeys(value, keys);
    }
    var sanitizeVector = (value, settings, previousValue) => {
        const _value = convert(value, 'object', settings.keys);
        for (let key in _value)
            _value[key] = sanitize$3(_value[key], settings[key]);
        const _valueKeys = Object.keys(_value);
        let newValue = {};
        if (_valueKeys.length === settings.keys.length) newValue = _value;
        else {
            const _previousValue = convert(previousValue, 'object', settings.keys);
            if (_valueKeys.length === 1 && settings.locked) {
                const lockedKey = _valueKeys[0];
                const lockedCoordinate = _value[lockedKey];
                const previousLockedCoordinate = _previousValue[lockedKey];
                const ratio =
                    previousLockedCoordinate !== 0
                        ? lockedCoordinate / previousLockedCoordinate
                        : 1;
                for (let key in _previousValue) {
                    if (key === lockedKey) newValue[lockedKey] = lockedCoordinate;
                    else newValue[key] = _previousValue[key] * ratio;
                }
            } else {
                newValue = _objectSpread2(
                    _objectSpread2({}, _previousValue),
                    _value
                );
            }
        }
        return convert(newValue, settings.format, settings.keys);
    };
    var formatVector = (value, settings) => convert(value, 'object', settings.keys);
    var isNumberSettings = (o4) =>
        !!o4 && ('step' in o4 || 'min' in o4 || 'max' in o4);
    function normalizeVector(value, settings, defaultKeys = []) {
        const { lock = false } = settings,
            _settings = _objectWithoutProperties(settings, _excluded);
        const format3 = Array.isArray(value) ? 'array' : 'object';
        const keys = format3 === 'object' ? Object.keys(value) : defaultKeys;
        const _value = convert(value, 'object', keys);
        const mergedSettings = isNumberSettings(_settings)
            ? keys.reduce((acc, k4) => Object.assign(acc, { [k4]: _settings }), {})
            : _settings;
        const numberSettings = normalizeKeyedNumberSettings(_value, mergedSettings);
        return {
            value: format3 === 'array' ? value : _value,
            settings: _objectSpread2(
                _objectSpread2({}, numberSettings),
                {},
                { format: format3, keys, lock, locked: false }
            )
        };
    }
    function getVectorPlugin(defaultKeys) {
        return {
            schema: getVectorSchema(defaultKeys.length),
            normalize: (_ref) => {
                let { value } = _ref,
                    settings = _objectWithoutProperties(_ref, _excluded2);
                return normalizeVector(value, settings, defaultKeys);
            },
            format: (value, settings) => formatVector(value, settings),
            sanitize: (value, settings, prevValue) =>
                sanitizeVector(value, settings, prevValue)
        };
    }
    var r2 = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) };
    var t2 = function (r4) {
        return 'string' == typeof r4 ? r4.length > 0 : 'number' == typeof r4;
    };
    var n2 = function (r4, t4, n4) {
        return (
            void 0 === t4 && (t4 = 0),
            void 0 === n4 && (n4 = Math.pow(10, t4)),
            Math.round(n4 * r4) / n4 + 0
        );
    };
    var e2 = function (r4, t4, n4) {
        return (
            void 0 === t4 && (t4 = 0),
            void 0 === n4 && (n4 = 1),
            r4 > n4 ? n4 : r4 > t4 ? r4 : t4
        );
    };
    var u2 = function (r4) {
        return (r4 = isFinite(r4) ? r4 % 360 : 0) > 0 ? r4 : r4 + 360;
    };
    var a2 = function (r4) {
        return {
            r: e2(r4.r, 0, 255),
            g: e2(r4.g, 0, 255),
            b: e2(r4.b, 0, 255),
            a: e2(r4.a)
        };
    };
    var o2 = function (r4) {
        return { r: n2(r4.r), g: n2(r4.g), b: n2(r4.b), a: n2(r4.a, 3) };
    };
    var i2 = /^#([0-9a-f]{3,8})$/i;
    var s2 = function (r4) {
        var t4 = r4.toString(16);
        return t4.length < 2 ? '0' + t4 : t4;
    };
    var h2 = function (r4) {
        var t4 = r4.r,
            n4 = r4.g,
            e4 = r4.b,
            u4 = r4.a,
            a4 = Math.max(t4, n4, e4),
            o4 = a4 - Math.min(t4, n4, e4),
            i4 = o4
                ? a4 === t4
                    ? (n4 - e4) / o4
                    : a4 === n4
                      ? 2 + (e4 - t4) / o4
                      : 4 + (t4 - n4) / o4
                : 0;
        return {
            h: 60 * (i4 < 0 ? i4 + 6 : i4),
            s: a4 ? (o4 / a4) * 100 : 0,
            v: (a4 / 255) * 100,
            a: u4
        };
    };
    var b2 = function (r4) {
        var t4 = r4.h,
            n4 = r4.s,
            e4 = r4.v,
            u4 = r4.a;
        ((t4 = (t4 / 360) * 6), (n4 /= 100), (e4 /= 100));
        var a4 = Math.floor(t4),
            o4 = e4 * (1 - n4),
            i4 = e4 * (1 - (t4 - a4) * n4),
            s4 = e4 * (1 - (1 - t4 + a4) * n4),
            h4 = a4 % 6;
        return {
            r: 255 * [e4, i4, o4, o4, s4, e4][h4],
            g: 255 * [s4, e4, e4, i4, o4, o4][h4],
            b: 255 * [o4, o4, s4, e4, e4, i4][h4],
            a: u4
        };
    };
    var g2 = function (r4) {
        return {
            h: u2(r4.h),
            s: e2(r4.s, 0, 100),
            l: e2(r4.l, 0, 100),
            a: e2(r4.a)
        };
    };
    var d2 = function (r4) {
        return { h: n2(r4.h), s: n2(r4.s), l: n2(r4.l), a: n2(r4.a, 3) };
    };
    var f2 = function (r4) {
        return b2(
            ((n4 = (t4 = r4).s),
            {
                h: t4.h,
                s:
                    (n4 *= ((e4 = t4.l) < 50 ? e4 : 100 - e4) / 100) > 0
                        ? ((2 * n4) / (e4 + n4)) * 100
                        : 0,
                v: e4 + n4,
                a: t4.a
            })
        );
        var t4, n4, e4;
    };
    var c2 = function (r4) {
        return {
            h: (t4 = h2(r4)).h,
            s:
                (u4 = ((200 - (n4 = t4.s)) * (e4 = t4.v)) / 100) > 0 && u4 < 200
                    ? ((n4 * e4) / 100 / (u4 <= 100 ? u4 : 200 - u4)) * 100
                    : 0,
            l: u4 / 2,
            a: t4.a
        };
        var t4, n4, e4, u4;
    };
    var l2 =
        /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
    var p2 =
        /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
    var v2 =
        /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
    var m2 =
        /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
    var y2 = {
        string: [
            [
                function (r4) {
                    var t4 = i2.exec(r4);
                    return t4
                        ? (r4 = t4[1]).length <= 4
                            ? {
                                  r: parseInt(r4[0] + r4[0], 16),
                                  g: parseInt(r4[1] + r4[1], 16),
                                  b: parseInt(r4[2] + r4[2], 16),
                                  a:
                                      4 === r4.length
                                          ? n2(parseInt(r4[3] + r4[3], 16) / 255, 2)
                                          : 1
                              }
                            : 6 === r4.length || 8 === r4.length
                              ? {
                                    r: parseInt(r4.substr(0, 2), 16),
                                    g: parseInt(r4.substr(2, 2), 16),
                                    b: parseInt(r4.substr(4, 2), 16),
                                    a:
                                        8 === r4.length
                                            ? n2(
                                                  parseInt(r4.substr(6, 2), 16) /
                                                      255,
                                                  2
                                              )
                                            : 1
                                }
                              : null
                        : null;
                },
                'hex'
            ],
            [
                function (r4) {
                    var t4 = v2.exec(r4) || m2.exec(r4);
                    return t4
                        ? t4[2] !== t4[4] || t4[4] !== t4[6]
                            ? null
                            : a2({
                                  r: Number(t4[1]) / (t4[2] ? 100 / 255 : 1),
                                  g: Number(t4[3]) / (t4[4] ? 100 / 255 : 1),
                                  b: Number(t4[5]) / (t4[6] ? 100 / 255 : 1),
                                  a:
                                      void 0 === t4[7]
                                          ? 1
                                          : Number(t4[7]) / (t4[8] ? 100 : 1)
                              })
                        : null;
                },
                'rgb'
            ],
            [
                function (t4) {
                    var n4 = l2.exec(t4) || p2.exec(t4);
                    if (!n4) return null;
                    var e4,
                        u4,
                        a4 = g2({
                            h:
                                ((e4 = n4[1]),
                                (u4 = n4[2]),
                                void 0 === u4 && (u4 = 'deg'),
                                Number(e4) * (r2[u4] || 1)),
                            s: Number(n4[3]),
                            l: Number(n4[4]),
                            a:
                                void 0 === n4[5]
                                    ? 1
                                    : Number(n4[5]) / (n4[6] ? 100 : 1)
                        });
                    return f2(a4);
                },
                'hsl'
            ]
        ],
        object: [
            [
                function (r4) {
                    var n4 = r4.r,
                        e4 = r4.g,
                        u4 = r4.b,
                        o4 = r4.a,
                        i4 = void 0 === o4 ? 1 : o4;
                    return t2(n4) && t2(e4) && t2(u4)
                        ? a2({
                              r: Number(n4),
                              g: Number(e4),
                              b: Number(u4),
                              a: Number(i4)
                          })
                        : null;
                },
                'rgb'
            ],
            [
                function (r4) {
                    var n4 = r4.h,
                        e4 = r4.s,
                        u4 = r4.l,
                        a4 = r4.a,
                        o4 = void 0 === a4 ? 1 : a4;
                    if (!t2(n4) || !t2(e4) || !t2(u4)) return null;
                    var i4 = g2({
                        h: Number(n4),
                        s: Number(e4),
                        l: Number(u4),
                        a: Number(o4)
                    });
                    return f2(i4);
                },
                'hsl'
            ],
            [
                function (r4) {
                    var n4 = r4.h,
                        a4 = r4.s,
                        o4 = r4.v,
                        i4 = r4.a,
                        s4 = void 0 === i4 ? 1 : i4;
                    if (!t2(n4) || !t2(a4) || !t2(o4)) return null;
                    var h4 = (function (r5) {
                        return {
                            h: u2(r5.h),
                            s: e2(r5.s, 0, 100),
                            v: e2(r5.v, 0, 100),
                            a: e2(r5.a)
                        };
                    })({
                        h: Number(n4),
                        s: Number(a4),
                        v: Number(o4),
                        a: Number(s4)
                    });
                    return b2(h4);
                },
                'hsv'
            ]
        ]
    };
    var N2 = function (r4, t4) {
        for (var n4 = 0; n4 < t4.length; n4++) {
            var e4 = t4[n4][0](r4);
            if (e4) return [e4, t4[n4][1]];
        }
        return [null, void 0];
    };
    var x2 = function (r4) {
        return 'string' == typeof r4
            ? N2(r4.trim(), y2.string)
            : 'object' == typeof r4 && null !== r4
              ? N2(r4, y2.object)
              : [null, void 0];
    };
    var I2 = function (r4) {
        return x2(r4)[1];
    };
    var M2 = function (r4, t4) {
        var n4 = c2(r4);
        return { h: n4.h, s: e2(n4.s + 100 * t4, 0, 100), l: n4.l, a: n4.a };
    };
    var H2 = function (r4) {
        return (299 * r4.r + 587 * r4.g + 114 * r4.b) / 1e3 / 255;
    };
    var $2 = function (r4, t4) {
        var n4 = c2(r4);
        return { h: n4.h, s: n4.s, l: e2(n4.l + 100 * t4, 0, 100), a: n4.a };
    };
    var j2 = (function () {
        function r4(r5) {
            ((this.parsed = x2(r5)[0]),
                (this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 }));
        }
        return (
            (r4.prototype.isValid = function () {
                return null !== this.parsed;
            }),
            (r4.prototype.brightness = function () {
                return n2(H2(this.rgba), 2);
            }),
            (r4.prototype.isDark = function () {
                return H2(this.rgba) < 0.5;
            }),
            (r4.prototype.isLight = function () {
                return H2(this.rgba) >= 0.5;
            }),
            (r4.prototype.toHex = function () {
                return (
                    (r5 = o2(this.rgba)),
                    (t4 = r5.r),
                    (e4 = r5.g),
                    (u4 = r5.b),
                    (i4 = (a4 = r5.a) < 1 ? s2(n2(255 * a4)) : ''),
                    '#' + s2(t4) + s2(e4) + s2(u4) + i4
                );
                var r5, t4, e4, u4, a4, i4;
            }),
            (r4.prototype.toRgb = function () {
                return o2(this.rgba);
            }),
            (r4.prototype.toRgbString = function () {
                return (
                    (r5 = o2(this.rgba)),
                    (t4 = r5.r),
                    (n4 = r5.g),
                    (e4 = r5.b),
                    (u4 = r5.a) < 1
                        ? 'rgba(' + t4 + ', ' + n4 + ', ' + e4 + ', ' + u4 + ')'
                        : 'rgb(' + t4 + ', ' + n4 + ', ' + e4 + ')'
                );
                var r5, t4, n4, e4, u4;
            }),
            (r4.prototype.toHsl = function () {
                return d2(c2(this.rgba));
            }),
            (r4.prototype.toHslString = function () {
                return (
                    (r5 = d2(c2(this.rgba))),
                    (t4 = r5.h),
                    (n4 = r5.s),
                    (e4 = r5.l),
                    (u4 = r5.a) < 1
                        ? 'hsla(' + t4 + ', ' + n4 + '%, ' + e4 + '%, ' + u4 + ')'
                        : 'hsl(' + t4 + ', ' + n4 + '%, ' + e4 + '%)'
                );
                var r5, t4, n4, e4, u4;
            }),
            (r4.prototype.toHsv = function () {
                return (
                    (r5 = h2(this.rgba)),
                    { h: n2(r5.h), s: n2(r5.s), v: n2(r5.v), a: n2(r5.a, 3) }
                );
                var r5;
            }),
            (r4.prototype.invert = function () {
                return w2({
                    r: 255 - (r5 = this.rgba).r,
                    g: 255 - r5.g,
                    b: 255 - r5.b,
                    a: r5.a
                });
                var r5;
            }),
            (r4.prototype.saturate = function (r5) {
                return (void 0 === r5 && (r5 = 0.1), w2(M2(this.rgba, r5)));
            }),
            (r4.prototype.desaturate = function (r5) {
                return (void 0 === r5 && (r5 = 0.1), w2(M2(this.rgba, -r5)));
            }),
            (r4.prototype.grayscale = function () {
                return w2(M2(this.rgba, -1));
            }),
            (r4.prototype.lighten = function (r5) {
                return (void 0 === r5 && (r5 = 0.1), w2($2(this.rgba, r5)));
            }),
            (r4.prototype.darken = function (r5) {
                return (void 0 === r5 && (r5 = 0.1), w2($2(this.rgba, -r5)));
            }),
            (r4.prototype.rotate = function (r5) {
                return (void 0 === r5 && (r5 = 15), this.hue(this.hue() + r5));
            }),
            (r4.prototype.alpha = function (r5) {
                return 'number' == typeof r5
                    ? w2({ r: (t4 = this.rgba).r, g: t4.g, b: t4.b, a: r5 })
                    : n2(this.rgba.a, 3);
                var t4;
            }),
            (r4.prototype.hue = function (r5) {
                var t4 = c2(this.rgba);
                return 'number' == typeof r5
                    ? w2({ h: r5, s: t4.s, l: t4.l, a: t4.a })
                    : n2(t4.h);
            }),
            (r4.prototype.isEqual = function (r5) {
                return this.toHex() === w2(r5).toHex();
            }),
            r4
        );
    })();
    var w2 = function (r4) {
        return r4 instanceof j2 ? r4 : new j2(r4);
    };
    var S2 = [];
    var k2 = function (r4) {
        r4.forEach(function (r5) {
            S2.indexOf(r5) < 0 && (r5(j2, y2), S2.push(r5));
        });
    };
    function names_default(e4, f4) {
        var a4 = {
                white: '#ffffff',
                bisque: '#ffe4c4',
                blue: '#0000ff',
                cadetblue: '#5f9ea0',
                chartreuse: '#7fff00',
                chocolate: '#d2691e',
                coral: '#ff7f50',
                antiquewhite: '#faebd7',
                aqua: '#00ffff',
                azure: '#f0ffff',
                whitesmoke: '#f5f5f5',
                papayawhip: '#ffefd5',
                plum: '#dda0dd',
                blanchedalmond: '#ffebcd',
                black: '#000000',
                gold: '#ffd700',
                goldenrod: '#daa520',
                gainsboro: '#dcdcdc',
                cornsilk: '#fff8dc',
                cornflowerblue: '#6495ed',
                burlywood: '#deb887',
                aquamarine: '#7fffd4',
                beige: '#f5f5dc',
                crimson: '#dc143c',
                cyan: '#00ffff',
                darkblue: '#00008b',
                darkcyan: '#008b8b',
                darkgoldenrod: '#b8860b',
                darkkhaki: '#bdb76b',
                darkgray: '#a9a9a9',
                darkgreen: '#006400',
                darkgrey: '#a9a9a9',
                peachpuff: '#ffdab9',
                darkmagenta: '#8b008b',
                darkred: '#8b0000',
                darkorchid: '#9932cc',
                darkorange: '#ff8c00',
                darkslateblue: '#483d8b',
                gray: '#808080',
                darkslategray: '#2f4f4f',
                darkslategrey: '#2f4f4f',
                deeppink: '#ff1493',
                deepskyblue: '#00bfff',
                wheat: '#f5deb3',
                firebrick: '#b22222',
                floralwhite: '#fffaf0',
                ghostwhite: '#f8f8ff',
                darkviolet: '#9400d3',
                magenta: '#ff00ff',
                green: '#008000',
                dodgerblue: '#1e90ff',
                grey: '#808080',
                honeydew: '#f0fff0',
                hotpink: '#ff69b4',
                blueviolet: '#8a2be2',
                forestgreen: '#228b22',
                lawngreen: '#7cfc00',
                indianred: '#cd5c5c',
                indigo: '#4b0082',
                fuchsia: '#ff00ff',
                brown: '#a52a2a',
                maroon: '#800000',
                mediumblue: '#0000cd',
                lightcoral: '#f08080',
                darkturquoise: '#00ced1',
                lightcyan: '#e0ffff',
                ivory: '#fffff0',
                lightyellow: '#ffffe0',
                lightsalmon: '#ffa07a',
                lightseagreen: '#20b2aa',
                linen: '#faf0e6',
                mediumaquamarine: '#66cdaa',
                lemonchiffon: '#fffacd',
                lime: '#00ff00',
                khaki: '#f0e68c',
                mediumseagreen: '#3cb371',
                limegreen: '#32cd32',
                mediumspringgreen: '#00fa9a',
                lightskyblue: '#87cefa',
                lightblue: '#add8e6',
                midnightblue: '#191970',
                lightpink: '#ffb6c1',
                mistyrose: '#ffe4e1',
                moccasin: '#ffe4b5',
                mintcream: '#f5fffa',
                lightslategray: '#778899',
                lightslategrey: '#778899',
                navajowhite: '#ffdead',
                navy: '#000080',
                mediumvioletred: '#c71585',
                powderblue: '#b0e0e6',
                palegoldenrod: '#eee8aa',
                oldlace: '#fdf5e6',
                paleturquoise: '#afeeee',
                mediumturquoise: '#48d1cc',
                mediumorchid: '#ba55d3',
                rebeccapurple: '#663399',
                lightsteelblue: '#b0c4de',
                mediumslateblue: '#7b68ee',
                thistle: '#d8bfd8',
                tan: '#d2b48c',
                orchid: '#da70d6',
                mediumpurple: '#9370db',
                purple: '#800080',
                pink: '#ffc0cb',
                skyblue: '#87ceeb',
                springgreen: '#00ff7f',
                palegreen: '#98fb98',
                red: '#ff0000',
                yellow: '#ffff00',
                slateblue: '#6a5acd',
                lavenderblush: '#fff0f5',
                peru: '#cd853f',
                palevioletred: '#db7093',
                violet: '#ee82ee',
                teal: '#008080',
                slategray: '#708090',
                slategrey: '#708090',
                aliceblue: '#f0f8ff',
                darkseagreen: '#8fbc8f',
                darkolivegreen: '#556b2f',
                greenyellow: '#adff2f',
                seagreen: '#2e8b57',
                seashell: '#fff5ee',
                tomato: '#ff6347',
                silver: '#c0c0c0',
                sienna: '#a0522d',
                lavender: '#e6e6fa',
                lightgreen: '#90ee90',
                orange: '#ffa500',
                orangered: '#ff4500',
                steelblue: '#4682b4',
                royalblue: '#4169e1',
                turquoise: '#40e0d0',
                yellowgreen: '#9acd32',
                salmon: '#fa8072',
                saddlebrown: '#8b4513',
                sandybrown: '#f4a460',
                rosybrown: '#bc8f8f',
                darksalmon: '#e9967a',
                lightgoldenrodyellow: '#fafad2',
                snow: '#fffafa',
                lightgrey: '#d3d3d3',
                lightgray: '#d3d3d3',
                dimgray: '#696969',
                dimgrey: '#696969',
                olivedrab: '#6b8e23',
                olive: '#808000'
            },
            r4 = {};
        for (var d4 in a4) r4[a4[d4]] = d4;
        var l4 = {};
        e4.prototype.toName = function (f5) {
            if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b))
                return 'transparent';
            var d5,
                i4,
                n4 = r4[this.toHex()];
            if (n4) return n4;
            if (null == f5 ? void 0 : f5.closest) {
                var o4 = this.toRgb(),
                    t4 = 1 / 0,
                    b4 = 'black';
                if (!l4.length) for (var c4 in a4) l4[c4] = new e4(a4[c4]).toRgb();
                for (var g4 in a4) {
                    var u4 =
                        ((d5 = o4),
                        (i4 = l4[g4]),
                        Math.pow(d5.r - i4.r, 2) +
                            Math.pow(d5.g - i4.g, 2) +
                            Math.pow(d5.b - i4.b, 2));
                    u4 < t4 && ((t4 = u4), (b4 = g4));
                }
                return b4;
            }
        };
        f4.string.push([
            function (f5) {
                var r5 = f5.toLowerCase(),
                    d5 = 'transparent' === r5 ? '#0000' : a4[r5];
                return d5 ? new e4(d5).toRgb() : null;
            },
            'name'
        ]);
    }
    function u3() {
        return (u3 =
            Object.assign ||
            function (e4) {
                for (var r4 = 1; r4 < arguments.length; r4++) {
                    var t4 = arguments[r4];
                    for (var n4 in t4)
                        Object.prototype.hasOwnProperty.call(t4, n4) &&
                            (e4[n4] = t4[n4]);
                }
                return e4;
            }).apply(this, arguments);
    }
    function c3(e4, r4) {
        if (null == e4) return {};
        var t4,
            n4,
            o4 = {},
            a4 = Object.keys(e4);
        for (n4 = 0; n4 < a4.length; n4++)
            r4.indexOf((t4 = a4[n4])) >= 0 || (o4[t4] = e4[t4]);
        return o4;
    }
    function i3(e4) {
        var t4 = React5.useRef(e4),
            n4 = React5.useRef(function (e5) {
                t4.current && t4.current(e5);
            });
        return ((t4.current = e4), n4.current);
    }
    var s3 = function (e4, r4, t4) {
        return (
            void 0 === r4 && (r4 = 0),
            void 0 === t4 && (t4 = 1),
            e4 > t4 ? t4 : e4 < r4 ? r4 : e4
        );
    };
    var f3 = function (e4) {
        return 'touches' in e4;
    };
    var v3 = function (e4) {
        return (e4 && e4.ownerDocument.defaultView) || self;
    };
    var d3 = function (e4, r4, t4) {
        var n4 = e4.getBoundingClientRect(),
            o4 = f3(r4)
                ? (function (e5, r5) {
                      for (var t5 = 0; t5 < e5.length; t5++)
                          if (e5[t5].identifier === r5) return e5[t5];
                      return e5[0];
                  })(r4.touches, t4)
                : r4;
        return {
            left: s3((o4.pageX - (n4.left + v3(e4).pageXOffset)) / n4.width),
            top: s3((o4.pageY - (n4.top + v3(e4).pageYOffset)) / n4.height)
        };
    };
    var h3 = function (e4) {
        !f3(e4) && e4.preventDefault();
    };
    var m3 = React5.memo(function (o4) {
        var a4 = o4.onMove,
            l4 = o4.onKey,
            s4 = c3(o4, ['onMove', 'onKey']),
            m4 = React5.useRef(null),
            g4 = i3(a4),
            p4 = i3(l4),
            b4 = React5.useRef(null),
            _2 = React5.useRef(false),
            x3 = React5.useMemo(
                function () {
                    var e4 = function (e5) {
                            (h3(e5),
                                (f3(e5) ? e5.touches.length > 0 : e5.buttons > 0) &&
                                m4.current
                                    ? g4(d3(m4.current, e5, b4.current))
                                    : t4(false));
                        },
                        r4 = function () {
                            return t4(false);
                        };
                    function t4(t5) {
                        var n4 = _2.current,
                            o5 = v3(m4.current),
                            a5 = t5 ? o5.addEventListener : o5.removeEventListener;
                        (a5(n4 ? 'touchmove' : 'mousemove', e4),
                            a5(n4 ? 'touchend' : 'mouseup', r4));
                    }
                    return [
                        function (e5) {
                            var r5 = e5.nativeEvent,
                                n4 = m4.current;
                            if (
                                n4 &&
                                (h3(r5),
                                !(function (e6, r6) {
                                    return r6 && !f3(e6);
                                })(r5, _2.current) && n4)
                            ) {
                                if (f3(r5)) {
                                    _2.current = true;
                                    var o5 = r5.changedTouches || [];
                                    o5.length && (b4.current = o5[0].identifier);
                                }
                                (n4.focus(), g4(d3(n4, r5, b4.current)), t4(true));
                            }
                        },
                        function (e5) {
                            var r5 = e5.which || e5.keyCode;
                            r5 < 37 ||
                                r5 > 40 ||
                                (e5.preventDefault(),
                                p4({
                                    left: 39 === r5 ? 0.05 : 37 === r5 ? -0.05 : 0,
                                    top: 40 === r5 ? 0.05 : 38 === r5 ? -0.05 : 0
                                }));
                        },
                        t4
                    ];
                },
                [p4, g4]
            ),
            C2 = x3[0],
            E2 = x3[1],
            H3 = x3[2];
        return (
            React5.useEffect(
                function () {
                    return H3;
                },
                [H3]
            ),
            React5.createElement(
                'div',
                u3({}, s4, {
                    onTouchStart: C2,
                    onMouseDown: C2,
                    className: 'react-colorful__interactive',
                    ref: m4,
                    onKeyDown: E2,
                    tabIndex: 0,
                    role: 'slider'
                })
            )
        );
    });
    var g3 = function (e4) {
        return e4.filter(Boolean).join(' ');
    };
    var p3 = function (r4) {
        var t4 = r4.color,
            n4 = r4.left,
            o4 = r4.top,
            a4 = void 0 === o4 ? 0.5 : o4,
            l4 = g3(['react-colorful__pointer', r4.className]);
        return React5.createElement(
            'div',
            { className: l4, style: { top: 100 * a4 + '%', left: 100 * n4 + '%' } },
            React5.createElement('div', {
                className: 'react-colorful__pointer-fill',
                style: { backgroundColor: t4 }
            })
        );
    };
    var b3 = function (e4, r4, t4) {
        return (
            void 0 === r4 && (r4 = 0),
            void 0 === t4 && (t4 = Math.pow(10, r4)),
            Math.round(t4 * e4) / t4
        );
    };
    var y3 = function (e4) {
        var r4 = e4.s,
            t4 = e4.v,
            n4 = e4.a,
            o4 = ((200 - r4) * t4) / 100;
        return {
            h: b3(e4.h),
            s: b3(
                o4 > 0 && o4 < 200
                    ? ((r4 * t4) / 100 / (o4 <= 100 ? o4 : 200 - o4)) * 100
                    : 0
            ),
            l: b3(o4 / 2),
            a: b3(n4, 2)
        };
    };
    var q2 = function (e4) {
        var r4 = y3(e4);
        return 'hsl(' + r4.h + ', ' + r4.s + '%, ' + r4.l + '%)';
    };
    var k3 = function (e4) {
        var r4 = y3(e4);
        return 'hsla(' + r4.h + ', ' + r4.s + '%, ' + r4.l + '%, ' + r4.a + ')';
    };
    var I3 = function (e4) {
        var r4 = e4.h,
            t4 = e4.s,
            n4 = e4.v,
            o4 = e4.a;
        ((r4 = (r4 / 360) * 6), (t4 /= 100), (n4 /= 100));
        var a4 = Math.floor(r4),
            l4 = n4 * (1 - t4),
            u4 = n4 * (1 - (r4 - a4) * t4),
            c4 = n4 * (1 - (1 - r4 + a4) * t4),
            i4 = a4 % 6;
        return {
            r: b3(255 * [n4, u4, l4, l4, c4, n4][i4]),
            g: b3(255 * [c4, n4, n4, u4, l4, l4][i4]),
            b: b3(255 * [l4, l4, c4, n4, n4, u4][i4]),
            a: b3(o4, 2)
        };
    };
    var L2 = function (e4) {
        var r4 = e4.r,
            t4 = e4.g,
            n4 = e4.b,
            o4 = e4.a,
            a4 = Math.max(r4, t4, n4),
            l4 = a4 - Math.min(r4, t4, n4),
            u4 = l4
                ? a4 === r4
                    ? (t4 - n4) / l4
                    : a4 === t4
                      ? 2 + (n4 - r4) / l4
                      : 4 + (r4 - t4) / l4
                : 0;
        return {
            h: b3(60 * (u4 < 0 ? u4 + 6 : u4)),
            s: b3(a4 ? (l4 / a4) * 100 : 0),
            v: b3((a4 / 255) * 100),
            a: o4
        };
    };
    var S3 = React5.memo(function (r4) {
        var t4 = r4.hue,
            n4 = r4.onChange,
            o4 = g3(['react-colorful__hue', r4.className]);
        return React5.createElement(
            'div',
            { className: o4 },
            React5.createElement(
                m3,
                {
                    onMove: function (e4) {
                        n4({ h: 360 * e4.left });
                    },
                    onKey: function (e4) {
                        n4({ h: s3(t4 + 360 * e4.left, 0, 360) });
                    },
                    'aria-label': 'Hue',
                    'aria-valuenow': b3(t4),
                    'aria-valuemax': '360',
                    'aria-valuemin': '0'
                },
                React5.createElement(p3, {
                    className: 'react-colorful__hue-pointer',
                    left: t4 / 360,
                    color: q2({ h: t4, s: 100, v: 100, a: 1 })
                })
            )
        );
    });
    var T2 = React5.memo(function (r4) {
        var t4 = r4.hsva,
            n4 = r4.onChange,
            o4 = { backgroundColor: q2({ h: t4.h, s: 100, v: 100, a: 1 }) };
        return React5.createElement(
            'div',
            { className: 'react-colorful__saturation', style: o4 },
            React5.createElement(
                m3,
                {
                    onMove: function (e4) {
                        n4({ s: 100 * e4.left, v: 100 - 100 * e4.top });
                    },
                    onKey: function (e4) {
                        n4({
                            s: s3(t4.s + 100 * e4.left, 0, 100),
                            v: s3(t4.v - 100 * e4.top, 0, 100)
                        });
                    },
                    'aria-label': 'Color',
                    'aria-valuetext':
                        'Saturation ' + b3(t4.s) + '%, Brightness ' + b3(t4.v) + '%'
                },
                React5.createElement(p3, {
                    className: 'react-colorful__saturation-pointer',
                    top: 1 - t4.v / 100,
                    left: t4.s / 100,
                    color: q2(t4)
                })
            )
        );
    });
    var F2 = function (e4, r4) {
        if (e4 === r4) return true;
        for (var t4 in e4) if (e4[t4] !== r4[t4]) return false;
        return true;
    };
    function Y2(e4, t4, l4) {
        var u4 = i3(l4),
            c4 = React5.useState(function () {
                return e4.toHsva(t4);
            }),
            s4 = c4[0],
            f4 = c4[1],
            v4 = React5.useRef({ color: t4, hsva: s4 });
        (React5.useEffect(
            function () {
                if (!e4.equal(t4, v4.current.color)) {
                    var r4 = e4.toHsva(t4);
                    ((v4.current = { hsva: r4, color: t4 }), f4(r4));
                }
            },
            [t4, e4]
        ),
            React5.useEffect(
                function () {
                    var r4;
                    F2(s4, v4.current.hsva) ||
                        e4.equal((r4 = e4.fromHsva(s4)), v4.current.color) ||
                        ((v4.current = { hsva: s4, color: r4 }), u4(r4));
                },
                [s4, e4, u4]
            ));
        var d4 = React5.useCallback(function (e5) {
            f4(function (r4) {
                return Object.assign({}, r4, e5);
            });
        }, []);
        return [s4, d4];
    }
    var V2 = 'undefined' != typeof window ? React5.useLayoutEffect : React5.useEffect;
    var $3 = function () {
        return (
            ('undefined' != typeof __webpack_nonce__ ? __webpack_nonce__ : void 0)
        );
    };
    var J2 = new Map();
    var Q = function (e4) {
        V2(function () {
            var r4 = e4.current ? e4.current.ownerDocument : document;
            if (void 0 !== r4 && !J2.has(r4)) {
                var t4 = r4.createElement('style');
                ((t4.innerHTML = `.react-colorful{position:relative;display:flex;flex-direction:column;width:200px;height:200px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.react-colorful__saturation{position:relative;flex-grow:1;border-color:transparent;border-bottom:12px solid #000;border-radius:8px 8px 0 0;background-image:linear-gradient(0deg,#000,transparent),linear-gradient(90deg,#fff,hsla(0,0%,100%,0))}.react-colorful__alpha-gradient,.react-colorful__pointer-fill{content:"";position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none;border-radius:inherit}.react-colorful__alpha-gradient,.react-colorful__saturation{box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}.react-colorful__alpha,.react-colorful__hue{position:relative;height:24px}.react-colorful__hue{background:linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)}.react-colorful__last-control{border-radius:0 0 8px 8px}.react-colorful__interactive{position:absolute;left:0;top:0;right:0;bottom:0;border-radius:inherit;outline:none;touch-action:none}.react-colorful__pointer{position:absolute;z-index:1;box-sizing:border-box;width:28px;height:28px;transform:translate(-50%,-50%);background-color:#fff;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.2)}.react-colorful__interactive:focus .react-colorful__pointer{transform:translate(-50%,-50%) scale(1.1)}.react-colorful__alpha,.react-colorful__alpha-pointer{background-color:#fff;background-image:url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>')}.react-colorful__saturation-pointer{z-index:3}.react-colorful__hue-pointer{z-index:2}`),
                    J2.set(r4, t4));
                var n4 = $3();
                (n4 && t4.setAttribute('nonce', n4), r4.head.appendChild(t4));
            }
        }, []);
    };
    var U2 = function (t4) {
        var n4 = t4.className,
            o4 = t4.colorModel,
            a4 = t4.color,
            l4 = void 0 === a4 ? o4.defaultColor : a4,
            i4 = t4.onChange,
            s4 = c3(t4, ['className', 'colorModel', 'color', 'onChange']),
            f4 = React5.useRef(null);
        Q(f4);
        var v4 = Y2(o4, l4, i4),
            d4 = v4[0],
            h4 = v4[1],
            m4 = g3(['react-colorful', n4]);
        return React5.createElement(
            'div',
            u3({}, s4, { ref: f4, className: m4 }),
            React5.createElement(T2, { hsva: d4, onChange: h4 }),
            React5.createElement(S3, {
                hue: d4.h,
                onChange: h4,
                className: 'react-colorful__last-control'
            })
        );
    };
    var ee = function (r4) {
        var t4 = r4.className,
            n4 = r4.hsva,
            o4 = r4.onChange,
            a4 = {
                backgroundImage:
                    'linear-gradient(90deg, ' +
                    k3(Object.assign({}, n4, { a: 0 })) +
                    ', ' +
                    k3(Object.assign({}, n4, { a: 1 })) +
                    ')'
            },
            l4 = g3(['react-colorful__alpha', t4]),
            u4 = b3(100 * n4.a);
        return React5.createElement(
            'div',
            { className: l4 },
            React5.createElement('div', {
                className: 'react-colorful__alpha-gradient',
                style: a4
            }),
            React5.createElement(
                m3,
                {
                    onMove: function (e4) {
                        o4({ a: e4.left });
                    },
                    onKey: function (e4) {
                        o4({ a: s3(n4.a + e4.left) });
                    },
                    'aria-label': 'Alpha',
                    'aria-valuetext': u4 + '%',
                    'aria-valuenow': u4,
                    'aria-valuemin': '0',
                    'aria-valuemax': '100'
                },
                React5.createElement(p3, {
                    className: 'react-colorful__alpha-pointer',
                    left: n4.a,
                    color: k3(n4)
                })
            )
        );
    };
    var re = function (t4) {
        var n4 = t4.className,
            o4 = t4.colorModel,
            a4 = t4.color,
            l4 = void 0 === a4 ? o4.defaultColor : a4,
            i4 = t4.onChange,
            s4 = c3(t4, ['className', 'colorModel', 'color', 'onChange']),
            f4 = React5.useRef(null);
        Q(f4);
        var v4 = Y2(o4, l4, i4),
            d4 = v4[0],
            h4 = v4[1],
            m4 = g3(['react-colorful', n4]);
        return React5.createElement(
            'div',
            u3({}, s4, { ref: f4, className: m4 }),
            React5.createElement(T2, { hsva: d4, onChange: h4 }),
            React5.createElement(S3, { hue: d4.h, onChange: h4 }),
            React5.createElement(ee, {
                hsva: d4,
                onChange: h4,
                className: 'react-colorful__last-control'
            })
        );
    };
    var xe = {
        defaultColor: { r: 0, g: 0, b: 0, a: 1 },
        toHsva: L2,
        fromHsva: I3,
        equal: F2
    };
    var Ce = function (r4) {
        return React5.createElement(re, u3({}, r4, { colorModel: xe }));
    };
    var Me = {
        defaultColor: { r: 0, g: 0, b: 0 },
        toHsva: function (e4) {
            return L2({ r: e4.r, g: e4.g, b: e4.b, a: 1 });
        },
        fromHsva: function (e4) {
            return { r: (r4 = I3(e4)).r, g: r4.g, b: r4.b };
            var r4;
        },
        equal: F2
    };
    var Ne = function (r4) {
        return React5.createElement(U2, u3({}, r4, { colorModel: Me }));
    };
    var import_prop_types = __toESM(require_prop_types());
    function __awaiter(thisArg, _arguments, P2, generator) {
        function adopt(value) {
            return value instanceof P2
                ? value
                : new P2(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P2 || (P2 = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e4) {
                    reject(e4);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e4) {
                    reject(e4);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _2 = {
                label: 0,
                sent: function () {
                    if (t4[0] & 1) throw t4[1];
                    return t4[1];
                },
                trys: [],
                ops: []
            },
            f4,
            y4,
            t4,
            g4 = Object.create(
                (typeof Iterator === 'function' ? Iterator : Object).prototype
            );
        return (
            (g4.next = verb(0)),
            (g4['throw'] = verb(1)),
            (g4['return'] = verb(2)),
            typeof Symbol === 'function' &&
                (g4[Symbol.iterator] = function () {
                    return this;
                }),
            g4
        );
        function verb(n4) {
            return function (v4) {
                return step([n4, v4]);
            };
        }
        function step(op) {
            if (f4) throw new TypeError('Generator is already executing.');
            while ((g4 && ((g4 = 0), op[0] && (_2 = 0)), _2))
                try {
                    if (
                        ((f4 = 1),
                        y4 &&
                            (t4 =
                                op[0] & 2
                                    ? y4['return']
                                    : op[0]
                                      ? y4['throw'] ||
                                        ((t4 = y4['return']) && t4.call(y4), 0)
                                      : y4.next) &&
                            !(t4 = t4.call(y4, op[1])).done)
                    )
                        return t4;
                    if (((y4 = 0), t4)) op = [op[0] & 2, t4.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t4 = op;
                            break;
                        case 4:
                            _2.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _2.label++;
                            y4 = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _2.ops.pop();
                            _2.trys.pop();
                            continue;
                        default:
                            if (
                                !((t4 = _2.trys),
                                (t4 = t4.length > 0 && t4[t4.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _2 = 0;
                                continue;
                            }
                            if (
                                op[0] === 3 &&
                                (!t4 || (op[1] > t4[0] && op[1] < t4[3]))
                            ) {
                                _2.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _2.label < t4[1]) {
                                _2.label = t4[1];
                                t4 = op;
                                break;
                            }
                            if (t4 && _2.label < t4[2]) {
                                _2.label = t4[2];
                                _2.ops.push(op);
                                break;
                            }
                            if (t4[2]) _2.ops.pop();
                            _2.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _2);
                } catch (e4) {
                    op = [6, e4];
                    y4 = 0;
                } finally {
                    f4 = t4 = 0;
                }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    function __read(o4, n4) {
        var m4 = typeof Symbol === 'function' && o4[Symbol.iterator];
        if (!m4) return o4;
        var i4 = m4.call(o4),
            r4,
            ar = [],
            e4;
        try {
            while ((n4 === void 0 || n4-- > 0) && !(r4 = i4.next()).done)
                ar.push(r4.value);
        } catch (error) {
            e4 = { error };
        } finally {
            try {
                if (r4 && !r4.done && (m4 = i4['return'])) m4.call(i4);
            } finally {
                if (e4) throw e4.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i4 = 0; i4 < arguments.length; i4++)
            ar = ar.concat(__read(arguments[i4]));
        return ar;
    }
    var COMMON_MIME_TYPES = new Map([
        ['aac', 'audio/aac'],
        ['abw', 'application/x-abiword'],
        ['arc', 'application/x-freearc'],
        ['avif', 'image/avif'],
        ['avi', 'video/x-msvideo'],
        ['azw', 'application/vnd.amazon.ebook'],
        ['bin', 'application/octet-stream'],
        ['bmp', 'image/bmp'],
        ['bz', 'application/x-bzip'],
        ['bz2', 'application/x-bzip2'],
        ['cda', 'application/x-cdf'],
        ['csh', 'application/x-csh'],
        ['css', 'text/css'],
        ['csv', 'text/csv'],
        ['doc', 'application/msword'],
        [
            'docx',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        ['eot', 'application/vnd.ms-fontobject'],
        ['epub', 'application/epub+zip'],
        ['gz', 'application/gzip'],
        ['gif', 'image/gif'],
        ['heic', 'image/heic'],
        ['heif', 'image/heif'],
        ['htm', 'text/html'],
        ['html', 'text/html'],
        ['ico', 'image/vnd.microsoft.icon'],
        ['ics', 'text/calendar'],
        ['jar', 'application/java-archive'],
        ['jpeg', 'image/jpeg'],
        ['jpg', 'image/jpeg'],
        ['js', 'text/javascript'],
        ['json', 'application/json'],
        ['jsonld', 'application/ld+json'],
        ['mid', 'audio/midi'],
        ['midi', 'audio/midi'],
        ['mjs', 'text/javascript'],
        ['mp3', 'audio/mpeg'],
        ['mp4', 'video/mp4'],
        ['mpeg', 'video/mpeg'],
        ['mpkg', 'application/vnd.apple.installer+xml'],
        ['odp', 'application/vnd.oasis.opendocument.presentation'],
        ['ods', 'application/vnd.oasis.opendocument.spreadsheet'],
        ['odt', 'application/vnd.oasis.opendocument.text'],
        ['oga', 'audio/ogg'],
        ['ogv', 'video/ogg'],
        ['ogx', 'application/ogg'],
        ['opus', 'audio/opus'],
        ['otf', 'font/otf'],
        ['png', 'image/png'],
        ['pdf', 'application/pdf'],
        ['php', 'application/x-httpd-php'],
        ['ppt', 'application/vnd.ms-powerpoint'],
        [
            'pptx',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ],
        ['rar', 'application/vnd.rar'],
        ['rtf', 'application/rtf'],
        ['sh', 'application/x-sh'],
        ['svg', 'image/svg+xml'],
        ['swf', 'application/x-shockwave-flash'],
        ['tar', 'application/x-tar'],
        ['tif', 'image/tiff'],
        ['tiff', 'image/tiff'],
        ['ts', 'video/mp2t'],
        ['ttf', 'font/ttf'],
        ['txt', 'text/plain'],
        ['vsd', 'application/vnd.visio'],
        ['wav', 'audio/wav'],
        ['weba', 'audio/webm'],
        ['webm', 'video/webm'],
        ['webp', 'image/webp'],
        ['woff', 'font/woff'],
        ['woff2', 'font/woff2'],
        ['xhtml', 'application/xhtml+xml'],
        ['xls', 'application/vnd.ms-excel'],
        [
            'xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ],
        ['xml', 'application/xml'],
        ['xul', 'application/vnd.mozilla.xul+xml'],
        ['zip', 'application/zip'],
        ['7z', 'application/x-7z-compressed'],
        ['mkv', 'video/x-matroska'],
        ['mov', 'video/quicktime'],
        ['msg', 'application/vnd.ms-outlook']
    ]);
    function toFileWithPath(file, path) {
        var f4 = withMimeType(file);
        if (typeof f4.path !== 'string') {
            var webkitRelativePath = file.webkitRelativePath;
            Object.defineProperty(f4, 'path', {
                value:
                    typeof path === 'string'
                        ? path
                        : typeof webkitRelativePath === 'string' &&
                            webkitRelativePath.length > 0
                          ? webkitRelativePath
                          : file.name,
                writable: false,
                configurable: false,
                enumerable: true
            });
        }
        return f4;
    }
    function withMimeType(file) {
        var name = file.name;
        var hasExtension = name && name.lastIndexOf('.') !== -1;
        if (hasExtension && !file.type) {
            var ext = name.split('.').pop().toLowerCase();
            var type = COMMON_MIME_TYPES.get(ext);
            if (type) {
                Object.defineProperty(file, 'type', {
                    value: type,
                    writable: false,
                    configurable: false,
                    enumerable: true
                });
            }
        }
        return file;
    }
    var FILES_TO_IGNORE = ['.DS_Store', 'Thumbs.db'];
    function fromEvent(evt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (isObject2(evt) && isDataTransfer(evt)) {
                    return [2, getDataTransferFiles(evt.dataTransfer, evt.type)];
                } else if (isChangeEvt(evt)) {
                    return [2, getInputFiles(evt)];
                } else if (
                    Array.isArray(evt) &&
                    evt.every(function (item) {
                        return (
                            'getFile' in item && typeof item.getFile === 'function'
                        );
                    })
                ) {
                    return [2, getFsHandleFiles(evt)];
                }
                return [2, []];
            });
        });
    }
    function isDataTransfer(value) {
        return isObject2(value.dataTransfer);
    }
    function isChangeEvt(value) {
        return isObject2(value) && isObject2(value.target);
    }
    function isObject2(v4) {
        return typeof v4 === 'object' && v4 !== null;
    }
    function getInputFiles(evt) {
        return fromList(evt.target.files).map(function (file) {
            return toFileWithPath(file);
        });
    }
    function getFsHandleFiles(handles) {
        return __awaiter(this, void 0, void 0, function () {
            var files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [
                            4,
                            Promise.all(
                                handles.map(function (h4) {
                                    return h4.getFile();
                                })
                            )
                        ];
                    case 1:
                        files = _a.sent();
                        return [
                            2,
                            files.map(function (file) {
                                return toFileWithPath(file);
                            })
                        ];
                }
            });
        });
    }
    function getDataTransferFiles(dt, type) {
        return __awaiter(this, void 0, void 0, function () {
            var items, files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (dt === null) {
                            return [2, []];
                        }
                        if (!dt.items) return [3, 2];
                        items = fromList(dt.items).filter(function (item) {
                            return item.kind === 'file';
                        });
                        if (type !== 'drop') {
                            return [2, items];
                        }
                        return [4, Promise.all(items.map(toFilePromises))];
                    case 1:
                        files = _a.sent();
                        return [2, noIgnoredFiles(flatten(files))];
                    case 2:
                        return [
                            2,
                            noIgnoredFiles(
                                fromList(dt.files).map(function (file) {
                                    return toFileWithPath(file);
                                })
                            )
                        ];
                }
            });
        });
    }
    function noIgnoredFiles(files) {
        return files.filter(function (file) {
            return FILES_TO_IGNORE.indexOf(file.name) === -1;
        });
    }
    function fromList(items) {
        if (items === null) {
            return [];
        }
        var files = [];
        for (var i4 = 0; i4 < items.length; i4++) {
            var file = items[i4];
            files.push(file);
        }
        return files;
    }
    function toFilePromises(item) {
        if (typeof item.webkitGetAsEntry !== 'function') {
            return fromDataTransferItem(item);
        }
        var entry = item.webkitGetAsEntry();
        if (entry && entry.isDirectory) {
            return fromDirEntry(entry);
        }
        return fromDataTransferItem(item);
    }
    function flatten(items) {
        return items.reduce(function (acc, files) {
            return __spread(acc, Array.isArray(files) ? flatten(files) : [files]);
        }, []);
    }
    function fromDataTransferItem(item) {
        var file = item.getAsFile();
        if (!file) {
            return Promise.reject(item + ' is not a File');
        }
        var fwp = toFileWithPath(file);
        return Promise.resolve(fwp);
    }
    function fromEntry(entry) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [
                    2,
                    entry.isDirectory ? fromDirEntry(entry) : fromFileEntry(entry)
                ];
            });
        });
    }
    function fromDirEntry(entry) {
        var reader = entry.createReader();
        return new Promise(function (resolve, reject) {
            var entries = [];
            function readEntries() {
                var _this = this;
                reader.readEntries(
                    function (batch) {
                        return __awaiter(_this, void 0, void 0, function () {
                            var files, err_1, items;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!batch.length) return [3, 5];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4, Promise.all(entries)];
                                    case 2:
                                        files = _a.sent();
                                        resolve(files);
                                        return [3, 4];
                                    case 3:
                                        err_1 = _a.sent();
                                        reject(err_1);
                                        return [3, 4];
                                    case 4:
                                        return [3, 6];
                                    case 5:
                                        items = Promise.all(batch.map(fromEntry));
                                        entries.push(items);
                                        readEntries();
                                        _a.label = 6;
                                    case 6:
                                        return [2];
                                }
                            });
                        });
                    },
                    function (err) {
                        reject(err);
                    }
                );
            }
            readEntries();
        });
    }
    function fromFileEntry(entry) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [
                    2,
                    new Promise(function (resolve, reject) {
                        entry.file(
                            function (file) {
                                var fwp = toFileWithPath(file, entry.fullPath);
                                resolve(fwp);
                            },
                            function (err) {
                                reject(err);
                            }
                        );
                    })
                ];
            });
        });
    }
    var import_attr_accept = __toESM(require_es());
    function ownKeys2(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            (enumerableOnly &&
                (symbols = symbols.filter(function (sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                })),
                keys.push.apply(keys, symbols));
        }
        return keys;
    }
    function _objectSpread(target) {
        for (var i4 = 1; i4 < arguments.length; i4++) {
            var source = null != arguments[i4] ? arguments[i4] : {};
            i4 % 2
                ? ownKeys2(Object(source), true).forEach(function (key) {
                      _defineProperty2(target, key, source[key]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                        target,
                        Object.getOwnPropertyDescriptors(source)
                    )
                  : ownKeys2(Object(source)).forEach(function (key) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(source, key)
                        );
                    });
        }
        return target;
    }
    function _defineProperty2(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }
    function _slicedToArray(arr, i4) {
        return (
            _arrayWithHoles(arr) ||
            _iterableToArrayLimit(arr, i4) ||
            _unsupportedIterableToArray(arr, i4) ||
            _nonIterableRest()
        );
    }
    function _nonIterableRest() {
        throw new TypeError(
            'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
        );
    }
    function _unsupportedIterableToArray(o4, minLen) {
        if (!o4) return;
        if (typeof o4 === 'string') return _arrayLikeToArray(o4, minLen);
        var n4 = Object.prototype.toString.call(o4).slice(8, -1);
        if (n4 === 'Object' && o4.constructor) n4 = o4.constructor.name;
        if (n4 === 'Map' || n4 === 'Set') return Array.from(o4);
        if (
            n4 === 'Arguments' ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n4)
        )
            return _arrayLikeToArray(o4, minLen);
    }
    function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i4 = 0, arr2 = new Array(len); i4 < len; i4++) {
            arr2[i4] = arr[i4];
        }
        return arr2;
    }
    function _iterableToArrayLimit(arr, i4) {
        var _i =
            arr == null
                ? null
                : (typeof Symbol !== 'undefined' && arr[Symbol.iterator]) ||
                  arr['@@iterator'];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i4 && _arr.length === i4) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i['return'] != null) _i['return']();
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }
    var FILE_INVALID_TYPE = 'file-invalid-type';
    var FILE_TOO_LARGE = 'file-too-large';
    var FILE_TOO_SMALL = 'file-too-small';
    var TOO_MANY_FILES = 'too-many-files';
    var getInvalidTypeRejectionErr = function getInvalidTypeRejectionErr2(accept) {
        accept = Array.isArray(accept) && accept.length === 1 ? accept[0] : accept;
        var messageSuffix = Array.isArray(accept)
            ? 'one of '.concat(accept.join(', '))
            : accept;
        return {
            code: FILE_INVALID_TYPE,
            message: 'File type must be '.concat(messageSuffix)
        };
    };
    var getTooLargeRejectionErr = function getTooLargeRejectionErr2(maxSize) {
        return {
            code: FILE_TOO_LARGE,
            message: 'File is larger than '
                .concat(maxSize, ' ')
                .concat(maxSize === 1 ? 'byte' : 'bytes')
        };
    };
    var getTooSmallRejectionErr = function getTooSmallRejectionErr2(minSize) {
        return {
            code: FILE_TOO_SMALL,
            message: 'File is smaller than '
                .concat(minSize, ' ')
                .concat(minSize === 1 ? 'byte' : 'bytes')
        };
    };
    var TOO_MANY_FILES_REJECTION = {
        code: TOO_MANY_FILES,
        message: 'Too many files'
    };
    function fileAccepted(file, accept) {
        var isAcceptable =
            file.type === 'application/x-moz-file' ||
            (0, import_attr_accept.default)(file, accept);
        return [
            isAcceptable,
            isAcceptable ? null : getInvalidTypeRejectionErr(accept)
        ];
    }
    function fileMatchSize(file, minSize, maxSize) {
        if (isDefined(file.size)) {
            if (isDefined(minSize) && isDefined(maxSize)) {
                if (file.size > maxSize)
                    return [false, getTooLargeRejectionErr(maxSize)];
                if (file.size < minSize)
                    return [false, getTooSmallRejectionErr(minSize)];
            } else if (isDefined(minSize) && file.size < minSize)
                return [false, getTooSmallRejectionErr(minSize)];
            else if (isDefined(maxSize) && file.size > maxSize)
                return [false, getTooLargeRejectionErr(maxSize)];
        }
        return [true, null];
    }
    function isDefined(value) {
        return value !== void 0 && value !== null;
    }
    function allFilesAccepted(_ref) {
        var files = _ref.files,
            accept = _ref.accept,
            minSize = _ref.minSize,
            maxSize = _ref.maxSize,
            multiple = _ref.multiple,
            maxFiles = _ref.maxFiles;
        if (
            (!multiple && files.length > 1) ||
            (multiple && maxFiles >= 1 && files.length > maxFiles)
        ) {
            return false;
        }
        return files.every(function (file) {
            var _fileAccepted = fileAccepted(file, accept),
                _fileAccepted2 = _slicedToArray(_fileAccepted, 1),
                accepted = _fileAccepted2[0];
            var _fileMatchSize = fileMatchSize(file, minSize, maxSize),
                _fileMatchSize2 = _slicedToArray(_fileMatchSize, 1),
                sizeMatch = _fileMatchSize2[0];
            return accepted && sizeMatch;
        });
    }
    function isPropagationStopped(event) {
        if (typeof event.isPropagationStopped === 'function') {
            return event.isPropagationStopped();
        } else if (typeof event.cancelBubble !== 'undefined') {
            return event.cancelBubble;
        }
        return false;
    }
    function isEvtWithFiles(event) {
        if (!event.dataTransfer) {
            return !!event.target && !!event.target.files;
        }
        return Array.prototype.some.call(event.dataTransfer.types, function (type) {
            return type === 'Files' || type === 'application/x-moz-file';
        });
    }
    function onDocumentDragOver(event) {
        event.preventDefault();
    }
    function isIe(userAgent) {
        return (
            userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1
        );
    }
    function isEdge(userAgent) {
        return userAgent.indexOf('Edge/') !== -1;
    }
    function isIeOrEdge() {
        var userAgent =
            arguments.length > 0 && arguments[0] !== void 0
                ? arguments[0]
                : window.navigator.userAgent;
        return isIe(userAgent) || isEdge(userAgent);
    }
    function composeEventHandlers() {
        for (
            var _len = arguments.length, fns = new Array(_len), _key = 0;
            _key < _len;
            _key++
        ) {
            fns[_key] = arguments[_key];
        }
        return function (event) {
            for (
                var _len2 = arguments.length,
                    args = new Array(_len2 > 1 ? _len2 - 1 : 0),
                    _key2 = 1;
                _key2 < _len2;
                _key2++
            ) {
                args[_key2 - 1] = arguments[_key2];
            }
            return fns.some(function (fn) {
                if (!isPropagationStopped(event) && fn) {
                    fn.apply(void 0, [event].concat(args));
                }
                return isPropagationStopped(event);
            });
        };
    }
    function canUseFileSystemAccessAPI() {
        return 'showOpenFilePicker' in window;
    }
    function filePickerOptionsTypes(accept) {
        accept = typeof accept === 'string' ? accept.split(',') : accept;
        return [
            {
                description: 'everything',
                accept: Array.isArray(accept)
                    ? accept
                          .filter(function (item) {
                              return (
                                  item === 'audio/*' ||
                                  item === 'video/*' ||
                                  item === 'image/*' ||
                                  item === 'text/*' ||
                                  /\w+\/[-+.\w]+/g.test(item)
                              );
                          })
                          .reduce(function (a4, b4) {
                              return _objectSpread(
                                  _objectSpread({}, a4),
                                  {},
                                  _defineProperty2({}, b4, [])
                              );
                          }, {})
                    : {}
            }
        ];
    }
    function isAbort(v4) {
        return (
            v4 instanceof DOMException &&
            (v4.name === 'AbortError' || v4.code === v4.ABORT_ERR)
        );
    }
    function isSecurityError(v4) {
        return (
            v4 instanceof DOMException &&
            (v4.name === 'SecurityError' || v4.code === v4.SECURITY_ERR)
        );
    }
    var _excluded4 = ['children'];
    var _excluded22 = ['open'];
    var _excluded32 = [
        'refKey',
        'role',
        'onKeyDown',
        'onFocus',
        'onBlur',
        'onClick',
        'onDragEnter',
        'onDragOver',
        'onDragLeave',
        'onDrop'
    ];
    var _excluded42 = ['refKey', 'onChange', 'onClick'];
    function _toConsumableArray(arr) {
        return (
            _arrayWithoutHoles(arr) ||
            _iterableToArray(arr) ||
            _unsupportedIterableToArray2(arr) ||
            _nonIterableSpread()
        );
    }
    function _nonIterableSpread() {
        throw new TypeError(
            'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
        );
    }
    function _iterableToArray(iter) {
        if (
            (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null) ||
            iter['@@iterator'] != null
        )
            return Array.from(iter);
    }
    function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray2(arr);
    }
    function _slicedToArray2(arr, i4) {
        return (
            _arrayWithHoles2(arr) ||
            _iterableToArrayLimit2(arr, i4) ||
            _unsupportedIterableToArray2(arr, i4) ||
            _nonIterableRest2()
        );
    }
    function _nonIterableRest2() {
        throw new TypeError(
            'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
        );
    }
    function _unsupportedIterableToArray2(o4, minLen) {
        if (!o4) return;
        if (typeof o4 === 'string') return _arrayLikeToArray2(o4, minLen);
        var n4 = Object.prototype.toString.call(o4).slice(8, -1);
        if (n4 === 'Object' && o4.constructor) n4 = o4.constructor.name;
        if (n4 === 'Map' || n4 === 'Set') return Array.from(o4);
        if (
            n4 === 'Arguments' ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n4)
        )
            return _arrayLikeToArray2(o4, minLen);
    }
    function _arrayLikeToArray2(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i4 = 0, arr2 = new Array(len); i4 < len; i4++) {
            arr2[i4] = arr[i4];
        }
        return arr2;
    }
    function _iterableToArrayLimit2(arr, i4) {
        var _i =
            arr == null
                ? null
                : (typeof Symbol !== 'undefined' && arr[Symbol.iterator]) ||
                  arr['@@iterator'];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i4 && _arr.length === i4) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i['return'] != null) _i['return']();
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    function _arrayWithHoles2(arr) {
        if (Array.isArray(arr)) return arr;
    }
    function ownKeys3(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            (enumerableOnly &&
                (symbols = symbols.filter(function (sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                })),
                keys.push.apply(keys, symbols));
        }
        return keys;
    }
    function _objectSpread3(target) {
        for (var i4 = 1; i4 < arguments.length; i4++) {
            var source = null != arguments[i4] ? arguments[i4] : {};
            i4 % 2
                ? ownKeys3(Object(source), true).forEach(function (key) {
                      _defineProperty3(target, key, source[key]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                        target,
                        Object.getOwnPropertyDescriptors(source)
                    )
                  : ownKeys3(Object(source)).forEach(function (key) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(source, key)
                        );
                    });
        }
        return target;
    }
    function _defineProperty3(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }
    function _objectWithoutProperties2(source, excluded) {
        if (source == null) return {};
        var target = _objectWithoutPropertiesLoose2(source, excluded);
        var key, i4;
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for (i4 = 0; i4 < sourceSymbolKeys.length; i4++) {
                key = sourceSymbolKeys[i4];
                if (excluded.indexOf(key) >= 0) continue;
                if (!Object.prototype.propertyIsEnumerable.call(source, key))
                    continue;
                target[key] = source[key];
            }
        }
        return target;
    }
    function _objectWithoutPropertiesLoose2(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i4;
        for (i4 = 0; i4 < sourceKeys.length; i4++) {
            key = sourceKeys[i4];
            if (excluded.indexOf(key) >= 0) continue;
            target[key] = source[key];
        }
        return target;
    }
    var Dropzone = React5.forwardRef(function (_ref, ref) {
        var children = _ref.children,
            params = _objectWithoutProperties2(_ref, _excluded4);
        var _useDropzone = useDropzone(params),
            open = _useDropzone.open,
            props3 = _objectWithoutProperties2(_useDropzone, _excluded22);
        React5.useImperativeHandle(
            ref,
            function () {
                return { open };
            },
            [open]
        );
        return React5.createElement(
            React5.Fragment,
            null,
            children(_objectSpread3(_objectSpread3({}, props3), {}, { open }))
        );
    });
    Dropzone.displayName = 'Dropzone';
    var defaultProps = {
        disabled: false,
        getFilesFromEvent: fromEvent,
        maxSize: Infinity,
        minSize: 0,
        multiple: true,
        maxFiles: 0,
        preventDropOnDocument: true,
        noClick: false,
        noKeyboard: false,
        noDrag: false,
        noDragEventsBubbling: false,
        validator: null,
        useFsAccessApi: true
    };
    Dropzone.defaultProps = defaultProps;
    Dropzone.propTypes = {
        children: import_prop_types.default.func,
        accept: import_prop_types.default.oneOfType([
            import_prop_types.default.string,
            import_prop_types.default.arrayOf(import_prop_types.default.string)
        ]),
        multiple: import_prop_types.default.bool,
        preventDropOnDocument: import_prop_types.default.bool,
        noClick: import_prop_types.default.bool,
        noKeyboard: import_prop_types.default.bool,
        noDrag: import_prop_types.default.bool,
        noDragEventsBubbling: import_prop_types.default.bool,
        minSize: import_prop_types.default.number,
        maxSize: import_prop_types.default.number,
        maxFiles: import_prop_types.default.number,
        disabled: import_prop_types.default.bool,
        getFilesFromEvent: import_prop_types.default.func,
        onFileDialogCancel: import_prop_types.default.func,
        onFileDialogOpen: import_prop_types.default.func,
        useFsAccessApi: import_prop_types.default.bool,
        onDragEnter: import_prop_types.default.func,
        onDragLeave: import_prop_types.default.func,
        onDragOver: import_prop_types.default.func,
        onDrop: import_prop_types.default.func,
        onDropAccepted: import_prop_types.default.func,
        onDropRejected: import_prop_types.default.func,
        validator: import_prop_types.default.func
    };
    var initialState = {
        isFocused: false,
        isFileDialogActive: false,
        isDragActive: false,
        isDragAccept: false,
        isDragReject: false,
        draggedFiles: [],
        acceptedFiles: [],
        fileRejections: []
    };
    function useDropzone() {
        var options =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        var _defaultProps$options = _objectSpread3(
                _objectSpread3({}, defaultProps),
                options
            ),
            accept = _defaultProps$options.accept,
            disabled = _defaultProps$options.disabled,
            getFilesFromEvent = _defaultProps$options.getFilesFromEvent,
            maxSize = _defaultProps$options.maxSize,
            minSize = _defaultProps$options.minSize,
            multiple = _defaultProps$options.multiple,
            maxFiles = _defaultProps$options.maxFiles,
            onDragEnter = _defaultProps$options.onDragEnter,
            onDragLeave = _defaultProps$options.onDragLeave,
            onDragOver = _defaultProps$options.onDragOver,
            onDrop = _defaultProps$options.onDrop,
            onDropAccepted = _defaultProps$options.onDropAccepted,
            onDropRejected = _defaultProps$options.onDropRejected,
            onFileDialogCancel = _defaultProps$options.onFileDialogCancel,
            onFileDialogOpen = _defaultProps$options.onFileDialogOpen,
            useFsAccessApi = _defaultProps$options.useFsAccessApi,
            preventDropOnDocument = _defaultProps$options.preventDropOnDocument,
            noClick = _defaultProps$options.noClick,
            noKeyboard = _defaultProps$options.noKeyboard,
            noDrag = _defaultProps$options.noDrag,
            noDragEventsBubbling = _defaultProps$options.noDragEventsBubbling,
            validator = _defaultProps$options.validator;
        var onFileDialogOpenCb = React5.useMemo(
            function () {
                return typeof onFileDialogOpen === 'function'
                    ? onFileDialogOpen
                    : noop;
            },
            [onFileDialogOpen]
        );
        var onFileDialogCancelCb = React5.useMemo(
            function () {
                return typeof onFileDialogCancel === 'function'
                    ? onFileDialogCancel
                    : noop;
            },
            [onFileDialogCancel]
        );
        var rootRef = React5.useRef(null);
        var inputRef = React5.useRef(null);
        var _useReducer = React5.useReducer(reducer, initialState),
            _useReducer2 = _slicedToArray2(_useReducer, 2),
            state = _useReducer2[0],
            dispatch = _useReducer2[1];
        var isFocused = state.isFocused,
            isFileDialogActive = state.isFileDialogActive,
            draggedFiles = state.draggedFiles;
        var fsAccessApiWorksRef = React5.useRef(
            typeof window !== 'undefined' &&
                window.isSecureContext &&
                useFsAccessApi &&
                canUseFileSystemAccessAPI()
        );
        var onWindowFocus = function onWindowFocus2() {
            if (!fsAccessApiWorksRef.current && isFileDialogActive) {
                setTimeout(function () {
                    if (inputRef.current) {
                        var files = inputRef.current.files;
                        if (!files.length) {
                            dispatch({ type: 'closeDialog' });
                            onFileDialogCancelCb();
                        }
                    }
                }, 300);
            }
        };
        React5.useEffect(
            function () {
                window.addEventListener('focus', onWindowFocus, false);
                return function () {
                    window.removeEventListener('focus', onWindowFocus, false);
                };
            },
            [
                inputRef,
                isFileDialogActive,
                onFileDialogCancelCb,
                fsAccessApiWorksRef
            ]
        );
        var dragTargetsRef = React5.useRef([]);
        var onDocumentDrop = function onDocumentDrop2(event) {
            if (rootRef.current && rootRef.current.contains(event.target)) {
                return;
            }
            event.preventDefault();
            dragTargetsRef.current = [];
        };
        React5.useEffect(
            function () {
                if (preventDropOnDocument) {
                    document.addEventListener(
                        'dragover',
                        onDocumentDragOver,
                        false
                    );
                    document.addEventListener('drop', onDocumentDrop, false);
                }
                return function () {
                    if (preventDropOnDocument) {
                        document.removeEventListener(
                            'dragover',
                            onDocumentDragOver
                        );
                        document.removeEventListener('drop', onDocumentDrop);
                    }
                };
            },
            [rootRef, preventDropOnDocument]
        );
        var onDragEnterCb = React5.useCallback(
            function (event) {
                event.preventDefault();
                event.persist();
                stopPropagation(event);
                dragTargetsRef.current = [].concat(
                    _toConsumableArray(dragTargetsRef.current),
                    [event.target]
                );
                if (isEvtWithFiles(event)) {
                    Promise.resolve(getFilesFromEvent(event)).then(
                        function (draggedFiles2) {
                            if (
                                isPropagationStopped(event) &&
                                !noDragEventsBubbling
                            ) {
                                return;
                            }
                            dispatch({
                                draggedFiles: draggedFiles2,
                                isDragActive: true,
                                type: 'setDraggedFiles'
                            });
                            if (onDragEnter) {
                                onDragEnter(event);
                            }
                        }
                    );
                }
            },
            [getFilesFromEvent, onDragEnter, noDragEventsBubbling]
        );
        var onDragOverCb = React5.useCallback(
            function (event) {
                event.preventDefault();
                event.persist();
                stopPropagation(event);
                var hasFiles = isEvtWithFiles(event);
                if (hasFiles && event.dataTransfer) {
                    try {
                        event.dataTransfer.dropEffect = 'copy';
                    } catch (_unused) {}
                }
                if (hasFiles && onDragOver) {
                    onDragOver(event);
                }
                return false;
            },
            [onDragOver, noDragEventsBubbling]
        );
        var onDragLeaveCb = React5.useCallback(
            function (event) {
                event.preventDefault();
                event.persist();
                stopPropagation(event);
                var targets = dragTargetsRef.current.filter(function (target) {
                    return rootRef.current && rootRef.current.contains(target);
                });
                var targetIdx = targets.indexOf(event.target);
                if (targetIdx !== -1) {
                    targets.splice(targetIdx, 1);
                }
                dragTargetsRef.current = targets;
                if (targets.length > 0) {
                    return;
                }
                dispatch({
                    isDragActive: false,
                    type: 'setDraggedFiles',
                    draggedFiles: []
                });
                if (isEvtWithFiles(event) && onDragLeave) {
                    onDragLeave(event);
                }
            },
            [rootRef, onDragLeave, noDragEventsBubbling]
        );
        var setFiles = React5.useCallback(
            function (files, event) {
                var acceptedFiles = [];
                var fileRejections = [];
                files.forEach(function (file) {
                    var _fileAccepted = fileAccepted(file, accept),
                        _fileAccepted2 = _slicedToArray2(_fileAccepted, 2),
                        accepted = _fileAccepted2[0],
                        acceptError = _fileAccepted2[1];
                    var _fileMatchSize = fileMatchSize(file, minSize, maxSize),
                        _fileMatchSize2 = _slicedToArray2(_fileMatchSize, 2),
                        sizeMatch = _fileMatchSize2[0],
                        sizeError = _fileMatchSize2[1];
                    var customErrors = validator ? validator(file) : null;
                    if (accepted && sizeMatch && !customErrors) {
                        acceptedFiles.push(file);
                    } else {
                        var errors = [acceptError, sizeError];
                        if (customErrors) {
                            errors = errors.concat(customErrors);
                        }
                        fileRejections.push({
                            file,
                            errors: errors.filter(function (e4) {
                                return e4;
                            })
                        });
                    }
                });
                if (
                    (!multiple && acceptedFiles.length > 1) ||
                    (multiple && maxFiles >= 1 && acceptedFiles.length > maxFiles)
                ) {
                    acceptedFiles.forEach(function (file) {
                        fileRejections.push({
                            file,
                            errors: [TOO_MANY_FILES_REJECTION]
                        });
                    });
                    acceptedFiles.splice(0);
                }
                dispatch({ acceptedFiles, fileRejections, type: 'setFiles' });
                if (onDrop) {
                    onDrop(acceptedFiles, fileRejections, event);
                }
                if (fileRejections.length > 0 && onDropRejected) {
                    onDropRejected(fileRejections, event);
                }
                if (acceptedFiles.length > 0 && onDropAccepted) {
                    onDropAccepted(acceptedFiles, event);
                }
            },
            [
                dispatch,
                multiple,
                accept,
                minSize,
                maxSize,
                maxFiles,
                onDrop,
                onDropAccepted,
                onDropRejected,
                validator
            ]
        );
        var onDropCb = React5.useCallback(
            function (event) {
                event.preventDefault();
                event.persist();
                stopPropagation(event);
                dragTargetsRef.current = [];
                if (isEvtWithFiles(event)) {
                    Promise.resolve(getFilesFromEvent(event)).then(
                        function (files) {
                            if (
                                isPropagationStopped(event) &&
                                !noDragEventsBubbling
                            ) {
                                return;
                            }
                            setFiles(files, event);
                        }
                    );
                }
                dispatch({ type: 'reset' });
            },
            [getFilesFromEvent, setFiles, noDragEventsBubbling]
        );
        var openFileDialog = React5.useCallback(
            function () {
                if (fsAccessApiWorksRef.current) {
                    dispatch({ type: 'openDialog' });
                    onFileDialogOpenCb();
                    var opts = { multiple, types: filePickerOptionsTypes(accept) };
                    window
                        .showOpenFilePicker(opts)
                        .then(function (handles) {
                            return getFilesFromEvent(handles);
                        })
                        .then(function (files) {
                            setFiles(files, null);
                            dispatch({ type: 'closeDialog' });
                        })
                        .catch(function (e4) {
                            if (isAbort(e4)) {
                                onFileDialogCancelCb(e4);
                                dispatch({ type: 'closeDialog' });
                            } else if (isSecurityError(e4)) {
                                fsAccessApiWorksRef.current = false;
                                if (inputRef.current) {
                                    inputRef.current.value = null;
                                    inputRef.current.click();
                                }
                            }
                        });
                    return;
                }
                if (inputRef.current) {
                    dispatch({ type: 'openDialog' });
                    onFileDialogOpenCb();
                    inputRef.current.value = null;
                    inputRef.current.click();
                }
            },
            [
                dispatch,
                onFileDialogOpenCb,
                onFileDialogCancelCb,
                useFsAccessApi,
                setFiles,
                accept,
                multiple
            ]
        );
        var onKeyDownCb = React5.useCallback(
            function (event) {
                if (
                    !rootRef.current ||
                    !rootRef.current.isEqualNode(event.target)
                ) {
                    return;
                }
                if (
                    event.key === ' ' ||
                    event.key === 'Enter' ||
                    event.keyCode === 32 ||
                    event.keyCode === 13
                ) {
                    event.preventDefault();
                    openFileDialog();
                }
            },
            [rootRef, openFileDialog]
        );
        var onFocusCb = React5.useCallback(function () {
            dispatch({ type: 'focus' });
        }, []);
        var onBlurCb = React5.useCallback(function () {
            dispatch({ type: 'blur' });
        }, []);
        var onClickCb = React5.useCallback(
            function () {
                if (noClick) {
                    return;
                }
                if (isIeOrEdge()) {
                    setTimeout(openFileDialog, 0);
                } else {
                    openFileDialog();
                }
            },
            [noClick, openFileDialog]
        );
        var composeHandler = function composeHandler2(fn) {
            return disabled ? null : fn;
        };
        var composeKeyboardHandler = function composeKeyboardHandler2(fn) {
            return noKeyboard ? null : composeHandler(fn);
        };
        var composeDragHandler = function composeDragHandler2(fn) {
            return noDrag ? null : composeHandler(fn);
        };
        var stopPropagation = function stopPropagation2(event) {
            if (noDragEventsBubbling) {
                event.stopPropagation();
            }
        };
        var getRootProps = React5.useMemo(
            function () {
                return function () {
                    var _ref2 =
                            arguments.length > 0 && arguments[0] !== void 0
                                ? arguments[0]
                                : {},
                        _ref2$refKey = _ref2.refKey,
                        refKey = _ref2$refKey === void 0 ? 'ref' : _ref2$refKey,
                        role = _ref2.role,
                        onKeyDown = _ref2.onKeyDown,
                        onFocus = _ref2.onFocus,
                        onBlur = _ref2.onBlur,
                        onClick = _ref2.onClick,
                        onDragEnter2 = _ref2.onDragEnter,
                        onDragOver2 = _ref2.onDragOver,
                        onDragLeave2 = _ref2.onDragLeave,
                        onDrop2 = _ref2.onDrop,
                        rest2 = _objectWithoutProperties2(_ref2, _excluded32);
                    return _objectSpread3(
                        _objectSpread3(
                            _defineProperty3(
                                {
                                    onKeyDown: composeKeyboardHandler(
                                        composeEventHandlers(onKeyDown, onKeyDownCb)
                                    ),
                                    onFocus: composeKeyboardHandler(
                                        composeEventHandlers(onFocus, onFocusCb)
                                    ),
                                    onBlur: composeKeyboardHandler(
                                        composeEventHandlers(onBlur, onBlurCb)
                                    ),
                                    onClick: composeHandler(
                                        composeEventHandlers(onClick, onClickCb)
                                    ),
                                    onDragEnter: composeDragHandler(
                                        composeEventHandlers(
                                            onDragEnter2,
                                            onDragEnterCb
                                        )
                                    ),
                                    onDragOver: composeDragHandler(
                                        composeEventHandlers(
                                            onDragOver2,
                                            onDragOverCb
                                        )
                                    ),
                                    onDragLeave: composeDragHandler(
                                        composeEventHandlers(
                                            onDragLeave2,
                                            onDragLeaveCb
                                        )
                                    ),
                                    onDrop: composeDragHandler(
                                        composeEventHandlers(onDrop2, onDropCb)
                                    ),
                                    role:
                                        typeof role === 'string' && role !== ''
                                            ? role
                                            : 'button'
                                },
                                refKey,
                                rootRef
                            ),
                            !disabled && !noKeyboard ? { tabIndex: 0 } : {}
                        ),
                        rest2
                    );
                };
            },
            [
                rootRef,
                onKeyDownCb,
                onFocusCb,
                onBlurCb,
                onClickCb,
                onDragEnterCb,
                onDragOverCb,
                onDragLeaveCb,
                onDropCb,
                noKeyboard,
                noDrag,
                disabled
            ]
        );
        var onInputElementClick = React5.useCallback(function (event) {
            event.stopPropagation();
        }, []);
        var getInputProps = React5.useMemo(
            function () {
                return function () {
                    var _ref3 =
                            arguments.length > 0 && arguments[0] !== void 0
                                ? arguments[0]
                                : {},
                        _ref3$refKey = _ref3.refKey,
                        refKey = _ref3$refKey === void 0 ? 'ref' : _ref3$refKey,
                        onChange = _ref3.onChange,
                        onClick = _ref3.onClick,
                        rest2 = _objectWithoutProperties2(_ref3, _excluded42);
                    var inputProps = _defineProperty3(
                        {
                            accept,
                            multiple,
                            type: 'file',
                            style: { display: 'none' },
                            onChange: composeHandler(
                                composeEventHandlers(onChange, onDropCb)
                            ),
                            onClick: composeHandler(
                                composeEventHandlers(onClick, onInputElementClick)
                            ),
                            tabIndex: -1
                        },
                        refKey,
                        inputRef
                    );
                    return _objectSpread3(_objectSpread3({}, inputProps), rest2);
                };
            },
            [inputRef, accept, multiple, onDropCb, disabled]
        );
        var fileCount = draggedFiles.length;
        var isDragAccept =
            fileCount > 0 &&
            allFilesAccepted({
                files: draggedFiles,
                accept,
                minSize,
                maxSize,
                multiple,
                maxFiles
            });
        var isDragReject = fileCount > 0 && !isDragAccept;
        return _objectSpread3(
            _objectSpread3({}, state),
            {},
            {
                isDragAccept,
                isDragReject,
                isFocused: isFocused && !disabled,
                getRootProps,
                getInputProps,
                rootRef,
                inputRef,
                open: composeHandler(openFileDialog)
            }
        );
    }
    function reducer(state, action) {
        switch (action.type) {
            case 'focus':
                return _objectSpread3(
                    _objectSpread3({}, state),
                    {},
                    { isFocused: true }
                );
            case 'blur':
                return _objectSpread3(
                    _objectSpread3({}, state),
                    {},
                    { isFocused: false }
                );
            case 'openDialog':
                return _objectSpread3(
                    _objectSpread3({}, initialState),
                    {},
                    { isFileDialogActive: true }
                );
            case 'closeDialog':
                return _objectSpread3(
                    _objectSpread3({}, state),
                    {},
                    { isFileDialogActive: false }
                );
            case 'setDraggedFiles':
                var isDragActive = action.isDragActive,
                    draggedFiles = action.draggedFiles;
                return _objectSpread3(
                    _objectSpread3({}, state),
                    {},
                    { draggedFiles, isDragActive }
                );
            case 'setFiles':
                return _objectSpread3(
                    _objectSpread3({}, state),
                    {},
                    {
                        acceptedFiles: action.acceptedFiles,
                        fileRejections: action.fileRejections
                    }
                );
            case 'reset':
                return _objectSpread3({}, initialState);
            default:
                return state;
        }
    }
    function noop() {}
    function createStore(createState) {
        let state;
        const listeners = new Set();
        const setState = (partial, replace) => {
            const nextState =
                typeof partial === 'function' ? partial(state) : partial;
            if (nextState !== state) {
                const previousState = state;
                state = replace ? nextState : Object.assign({}, state, nextState);
                listeners.forEach((listener) => listener(state, previousState));
            }
        };
        const getState = () => state;
        const subscribeWithSelector2 = (
            listener,
            selector = getState,
            equalityFn = Object.is
        ) => {
            console.warn(
                '[DEPRECATED] Please use `subscribeWithSelector` middleware'
            );
            let currentSlice = selector(state);
            function listenerToAdd() {
                const nextSlice = selector(state);
                if (!equalityFn(currentSlice, nextSlice)) {
                    const previousSlice = currentSlice;
                    listener((currentSlice = nextSlice), previousSlice);
                }
            }
            listeners.add(listenerToAdd);
            return () => listeners.delete(listenerToAdd);
        };
        const subscribe = (listener, selector, equalityFn) => {
            if (selector || equalityFn) {
                return subscribeWithSelector2(listener, selector, equalityFn);
            }
            listeners.add(listener);
            return () => listeners.delete(listener);
        };
        const destroy = () => listeners.clear();
        const api = { setState, getState, subscribe, destroy };
        state = createState(setState, getState, api);
        return api;
    }
    var isSSR =
        typeof window === 'undefined' ||
        !window.navigator ||
        /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
    var useIsomorphicLayoutEffect = isSSR ? React5.useEffect : React5.useLayoutEffect;
    function create(createState) {
        const api =
            typeof createState === 'function'
                ? createStore(createState)
                : createState;
        const useStore = (selector = api.getState, equalityFn = Object.is) => {
            const [, forceUpdate] = React5.useReducer((c4) => c4 + 1, 0);
            const state = api.getState();
            const stateRef = React5.useRef(state);
            const selectorRef = React5.useRef(selector);
            const equalityFnRef = React5.useRef(equalityFn);
            const erroredRef = React5.useRef(false);
            const currentSliceRef = React5.useRef();
            if (currentSliceRef.current === void 0) {
                currentSliceRef.current = selector(state);
            }
            let newStateSlice;
            let hasNewStateSlice = false;
            if (
                stateRef.current !== state ||
                selectorRef.current !== selector ||
                equalityFnRef.current !== equalityFn ||
                erroredRef.current
            ) {
                newStateSlice = selector(state);
                hasNewStateSlice = !equalityFn(
                    currentSliceRef.current,
                    newStateSlice
                );
            }
            useIsomorphicLayoutEffect(() => {
                if (hasNewStateSlice) {
                    currentSliceRef.current = newStateSlice;
                }
                stateRef.current = state;
                selectorRef.current = selector;
                equalityFnRef.current = equalityFn;
                erroredRef.current = false;
            });
            const stateBeforeSubscriptionRef = React5.useRef(state);
            useIsomorphicLayoutEffect(() => {
                const listener = () => {
                    try {
                        const nextState = api.getState();
                        const nextStateSlice = selectorRef.current(nextState);
                        if (
                            !equalityFnRef.current(
                                currentSliceRef.current,
                                nextStateSlice
                            )
                        ) {
                            stateRef.current = nextState;
                            currentSliceRef.current = nextStateSlice;
                            forceUpdate();
                        }
                    } catch (error) {
                        erroredRef.current = true;
                        forceUpdate();
                    }
                };
                const unsubscribe = api.subscribe(listener);
                if (api.getState() !== stateBeforeSubscriptionRef.current) {
                    listener();
                }
                return unsubscribe;
            }, []);
            const sliceToReturn = hasNewStateSlice
                ? newStateSlice
                : currentSliceRef.current;
            React5.useDebugValue(sliceToReturn);
            return sliceToReturn;
        };
        Object.assign(useStore, api);
        useStore[Symbol.iterator] = function () {
            console.warn(
                '[useStore, api] = create() is deprecated and will be removed in v4'
            );
            const items = [useStore, api];
            return {
                next() {
                    const done = items.length <= 0;
                    return { value: items.shift(), done };
                }
            };
        };
        return useStore;
    }
    var subscribeWithSelector = (fn) => (set, get, api) => {
        const origSubscribe = api.subscribe;
        api.subscribe = (selector, optListener, options) => {
            let listener = selector;
            if (optListener) {
                const equalityFn =
                    (options == null ? void 0 : options.equalityFn) || Object.is;
                let currentSlice = selector(api.getState());
                listener = (state) => {
                    const nextSlice = selector(state);
                    if (!equalityFn(currentSlice, nextSlice)) {
                        const previousSlice = currentSlice;
                        optListener((currentSlice = nextSlice), previousSlice);
                    }
                };
                if (options == null ? void 0 : options.fireImmediately) {
                    optListener(currentSlice, currentSlice);
                }
            }
            return origSubscribe(listener);
        };
        const initialState2 = fn(set, get, api);
        return initialState2;
    };
    var import_merge_value = __toESM(require_merge_value());
    var join = (...args) => args.filter(Boolean).join('.');
    function getKeyPath(path) {
        const dir = path.split('.');
        return [dir.pop(), dir.join('.') || void 0];
    }
    function getValuesForPaths(data, paths) {
        return Object.entries(pick(data, paths)).reduce(
            (acc, [, { value, disabled, key }]) => {
                acc[key] = disabled ? void 0 : value;
                return acc;
            },
            {}
        );
    }
    function useCompareMemoize(value, deep) {
        const ref = React5.useRef();
        const compare = dequal ;
        if (!compare(value, ref.current)) {
            ref.current = value;
        }
        return ref.current;
    }
    function useDeepMemo(fn, deps) {
        return React5.useMemo(fn, useCompareMemoize(deps));
    }
    function useToggle(toggled) {
        const wrapperRef = React5.useRef(null);
        const contentRef = React5.useRef(null);
        const firstRender = React5.useRef(true);
        React5.useLayoutEffect(() => {
            if (!toggled) {
                wrapperRef.current.style.height = '0px';
                wrapperRef.current.style.overflow = 'hidden';
            }
        }, []);
        React5.useEffect(() => {
            if (firstRender.current) {
                firstRender.current = false;
                return;
            }
            let timeout;
            const ref = wrapperRef.current;
            const fixHeight = () => {
                if (toggled) {
                    ref.style.removeProperty('height');
                    ref.style.removeProperty('overflow');
                    contentRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            };
            ref.addEventListener('transitionend', fixHeight, { once: true });
            const { height } = contentRef.current.getBoundingClientRect();
            ref.style.height = height + 'px';
            if (!toggled) {
                ref.style.overflow = 'hidden';
                timeout = window.setTimeout(() => (ref.style.height = '0px'), 50);
            }
            return () => {
                ref.removeEventListener('transitionend', fixHeight);
                clearTimeout(timeout);
            };
        }, [toggled]);
        return { wrapperRef, contentRef };
    }
    var useVisiblePaths = (store) => {
        const [paths, setPaths] = React5.useState(store.getVisiblePaths());
        React5.useEffect(() => {
            setPaths(store.getVisiblePaths());
            const unsub = store.useStore.subscribe(
                store.getVisiblePaths,
                setPaths,
                { equalityFn: shallow }
            );
            return () => unsub();
        }, [store]);
        return paths;
    };
    function useValuesForPath(store, paths, initialData) {
        const valuesForPath = store.useStore((s4) => {
            const data = _objectSpread2(_objectSpread2({}, initialData), s4.data);
            return getValuesForPaths(data, paths);
        }, shallow);
        return valuesForPath;
    }
    function usePopin(margin = 3) {
        const popinRef = React5.useRef(null);
        const wrapperRef = React5.useRef(null);
        const [shown, setShow] = React5.useState(false);
        const show = React5.useCallback(() => setShow(true), []);
        const hide2 = React5.useCallback(() => setShow(false), []);
        React5.useLayoutEffect(() => {
            if (shown) {
                const { bottom, top, left } =
                    popinRef.current.getBoundingClientRect();
                const { height } = wrapperRef.current.getBoundingClientRect();
                const direction =
                    bottom + height > window.innerHeight - 40 ? 'up' : 'down';
                wrapperRef.current.style.position = 'fixed';
                wrapperRef.current.style.zIndex = '10000';
                wrapperRef.current.style.left = left + 'px';
                if (direction === 'down')
                    wrapperRef.current.style.top = bottom + margin + 'px';
                else
                    wrapperRef.current.style.bottom =
                        window.innerHeight - top + margin + 'px';
            }
        }, [margin, shown]);
        return { popinRef, wrapperRef, shown, show, hide: hide2 };
    }
    k2([names_default]);
    var convertMap = { rgb: 'toRgb', hsl: 'toHsl', hsv: 'toHsv', hex: 'toHex' };
    v8n_esm_default.extend({ color: () => (value) => w2(value).isValid() });
    var schema$22 = (o4) => v8n_esm_default().color().test(o4);
    function convert2(color2, { format: format3, hasAlpha, isString }) {
        const convertFn =
            convertMap[format3] + (isString && format3 !== 'hex' ? 'String' : '');
        const result = color2[convertFn]();
        return typeof result === 'object' && !hasAlpha
            ? omit(result, ['a'])
            : result;
    }
    var sanitize$22 = (v4, settings) => {
        const color2 = w2(v4);
        if (!color2.isValid()) throw Error('Invalid color');
        return convert2(color2, settings);
    };
    var format$12 = (v4, settings) => {
        return convert2(
            w2(v4),
            _objectSpread2(
                _objectSpread2({}, settings),
                {},
                { isString: true, format: 'hex' }
            )
        );
    };
    var normalize$32 = ({ value }) => {
        const _f = I2(value);
        const format3 = _f === 'name' ? 'hex' : _f;
        const hasAlpha =
            typeof value === 'object'
                ? 'a' in value
                : (_f === 'hex' && value.length === 8) ||
                  /^(rgba)|(hsla)|(hsva)/.test(value);
        const settings = {
            format: format3,
            hasAlpha,
            isString: typeof value === 'string'
        };
        return { value: sanitize$22(value, settings), settings };
    };
    var props$22 = Object.freeze({
        __proto__: null,
        schema: schema$22,
        sanitize: sanitize$22,
        format: format$12,
        normalize: normalize$32
    });
    var ColorPreview = styled('div', {
        position: 'relative',
        boxSizing: 'border-box',
        borderRadius: '$sm',
        overflow: 'hidden',
        cursor: 'pointer',
        height: '$rowHeight',
        width: '$rowHeight',
        backgroundColor: '#fff',
        backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>')`,
        $inputStyle: '',
        $hover: '',
        zIndex: 1,
        variants: { active: { true: { $inputStyle: '$accent1' } } },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'currentColor',
            zIndex: 1
        }
    });
    var PickerContainer = styled('div', {
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '$sizes$rowHeight auto',
        columnGap: '$colGap',
        alignItems: 'center'
    });
    var PickerWrapper = styled('div', {
        width: '$colorPickerWidth',
        height: '$colorPickerHeight',
        '.react-colorful': {
            width: '100%',
            height: '100%',
            boxShadow: '$level2',
            cursor: 'crosshair'
        },
        '.react-colorful__saturation': { borderRadius: '$sm $sm 0 0' },
        '.react-colorful__alpha, .react-colorful__hue': { height: 10 },
        '.react-colorful__last-control': { borderRadius: '0 0 $sm $sm' },
        '.react-colorful__pointer': { height: 12, width: 12 }
    });
    function convertToRgb(value, format3) {
        return format3 !== 'rgb' ? w2(value).toRgb() : value;
    }
    function Color({ value, displayValue, settings, onUpdate }) {
        const { emitOnEditStart, emitOnEditEnd } = useInputContext();
        const { format: format3, hasAlpha } = settings;
        const { popinRef, wrapperRef, shown, show, hide: hide2 } = usePopin();
        const timer = React5.useRef(0);
        const [initialRgb, setInitialRgb] = React5.useState(() =>
            convertToRgb(value, format3)
        );
        const ColorPicker = hasAlpha ? Ce : Ne;
        const showPicker = () => {
            setInitialRgb(convertToRgb(value, format3));
            show();
            emitOnEditStart();
        };
        const hidePicker = () => {
            hide2();
            emitOnEditEnd();
            window.clearTimeout(timer.current);
        };
        const hideAfterDelay = () => {
            timer.current = window.setTimeout(hidePicker, 500);
        };
        React5.useEffect(() => {
            return () => window.clearTimeout(timer.current);
        }, []);
        return React5.createElement(
            React5.Fragment,
            null,
            React5.createElement(ColorPreview, {
                ref: popinRef,
                active: shown,
                onClick: () => showPicker(),
                style: { color: displayValue }
            }),
            shown &&
                React5.createElement(
                    Portal,
                    null,
                    React5.createElement(Overlay, { onPointerUp: hidePicker }),
                    React5.createElement(
                        PickerWrapper,
                        {
                            ref: wrapperRef,
                            onMouseEnter: () => window.clearTimeout(timer.current),
                            onMouseLeave: (e4) =>
                                e4.buttons === 0 && hideAfterDelay()
                        },
                        React5.createElement(ColorPicker, {
                            color: initialRgb,
                            onChange: onUpdate
                        })
                    )
                )
        );
    }
    function ColorComponent() {
        const { value, displayValue, label, onChange, onUpdate, settings } =
            useInputContext();
        return React5.createElement(
            Row,
            { input: true },
            React5.createElement(Label, null, label),
            React5.createElement(
                PickerContainer,
                null,
                React5.createElement(Color, {
                    value,
                    displayValue,
                    onChange,
                    onUpdate,
                    settings
                }),
                React5.createElement(ValueInput, {
                    value: displayValue,
                    onChange,
                    onUpdate
                })
            )
        );
    }
    var color = createInternalPlugin(
        _objectSpread2({ component: ColorComponent }, props$22)
    );
    function Vector3dComponent() {
        const { label, displayValue, onUpdate, settings } = useInputContext();
        return React5.createElement(
            Row,
            { input: true },
            React5.createElement(Label, null, label),
            React5.createElement(Vector, {
                value: displayValue,
                settings,
                onUpdate
            })
        );
    }
    var vector3d = createInternalPlugin(
        _objectSpread2(
            { component: Vector3dComponent },
            getVectorPlugin(['x', 'y', 'z'])
        )
    );
    var JoystickTrigger = styled('div', {
        $flexCenter: '',
        position: 'relative',
        backgroundColor: '$elevation3',
        borderRadius: '$sm',
        cursor: 'pointer',
        height: '$rowHeight',
        width: '$rowHeight',
        touchAction: 'none',
        $draggable: '',
        $hover: '',
        '&:active': { cursor: 'none' },
        '&::after': {
            content: '""',
            backgroundColor: '$accent2',
            height: 4,
            width: 4,
            borderRadius: 2
        }
    });
    var JoystickPlayground = styled('div', {
        $flexCenter: '',
        width: '$joystickWidth',
        height: '$joystickHeight',
        borderRadius: '$sm',
        boxShadow: '$level2',
        position: 'fixed',
        zIndex: 1e4,
        overflow: 'hidden',
        $draggable: '',
        transform: 'translate(-50%, -50%)',
        variants: {
            isOutOfBounds: {
                true: { backgroundColor: '$elevation1' },
                false: { backgroundColor: '$elevation3' }
            }
        },
        '> div': {
            position: 'absolute',
            $flexCenter: '',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '$highlight1',
            backgroundColor: '$elevation3',
            width: '80%',
            height: '80%',
            '&::after,&::before': {
                content: '""',
                position: 'absolute',
                zindex: 10,
                backgroundColor: '$highlight1'
            },
            '&::before': { width: '100%', height: 1 },
            '&::after': { height: '100%', width: 1 }
        },
        '> span': {
            position: 'relative',
            zindex: 100,
            width: 10,
            height: 10,
            backgroundColor: '$accent2',
            borderRadius: '50%'
        }
    });
    function Joystick({ value, settings, onUpdate }) {
        const timeout = React5.useRef();
        const outOfBoundsX = React5.useRef(0);
        const outOfBoundsY = React5.useRef(0);
        const stepMultiplier = React5.useRef(1);
        const [joystickShown, setShowJoystick] = React5.useState(false);
        const [isOutOfBounds, setIsOutOfBounds] = React5.useState(false);
        const [spanRef, set] = useTransform();
        const joystickeRef = React5.useRef(null);
        const playgroundRef = React5.useRef(null);
        React5.useLayoutEffect(() => {
            if (joystickShown) {
                const { top, left, width, height } =
                    joystickeRef.current.getBoundingClientRect();
                playgroundRef.current.style.left = left + width / 2 + 'px';
                playgroundRef.current.style.top = top + height / 2 + 'px';
            }
        }, [joystickShown]);
        const {
            keys: [v1, v22],
            joystick
        } = settings;
        const yFactor = joystick === 'invertY' ? 1 : -1;
        const {
            [v1]: { step: stepV1 },
            [v22]: { step: stepV2 }
        } = settings;
        const wpx = useTh('sizes', 'joystickWidth');
        const hpx = useTh('sizes', 'joystickHeight');
        const w3 = (parseFloat(wpx) * 0.8) / 2;
        const h4 = (parseFloat(hpx) * 0.8) / 2;
        const startOutOfBounds = React5.useCallback(() => {
            if (timeout.current) return;
            setIsOutOfBounds(true);
            if (outOfBoundsX.current) set({ x: outOfBoundsX.current * w3 });
            if (outOfBoundsY.current) set({ y: outOfBoundsY.current * -h4 });
            timeout.current = window.setInterval(() => {
                onUpdate((v4) => {
                    const incX =
                        stepV1 * outOfBoundsX.current * stepMultiplier.current;
                    const incY =
                        yFactor *
                        stepV2 *
                        outOfBoundsY.current *
                        stepMultiplier.current;
                    return Array.isArray(v4)
                        ? { [v1]: v4[0] + incX, [v22]: v4[1] + incY }
                        : { [v1]: v4[v1] + incX, [v22]: v4[v22] + incY };
                });
            }, 16);
        }, [w3, h4, onUpdate, set, stepV1, stepV2, v1, v22, yFactor]);
        const endOutOfBounds = React5.useCallback(() => {
            window.clearTimeout(timeout.current);
            timeout.current = void 0;
            setIsOutOfBounds(false);
        }, []);
        React5.useEffect(() => {
            function setStepMultiplier(event) {
                stepMultiplier.current = multiplyStep(event);
            }
            window.addEventListener('keydown', setStepMultiplier);
            window.addEventListener('keyup', setStepMultiplier);
            return () => {
                window.clearTimeout(timeout.current);
                window.removeEventListener('keydown', setStepMultiplier);
                window.removeEventListener('keyup', setStepMultiplier);
            };
        }, []);
        const bind = useDrag2(
            ({ first, active, delta: [dx, dy], movement: [mx, my] }) => {
                if (first) setShowJoystick(true);
                const _x = clamp(mx, -w3, w3);
                const _y = clamp(my, -h4, h4);
                outOfBoundsX.current =
                    Math.abs(mx) > Math.abs(_x) ? Math.sign(mx - _x) : 0;
                outOfBoundsY.current =
                    Math.abs(my) > Math.abs(_y) ? Math.sign(_y - my) : 0;
                let newX = value[v1];
                let newY = value[v22];
                if (active) {
                    if (!outOfBoundsX.current) {
                        newX += dx * stepV1 * stepMultiplier.current;
                        set({ x: _x });
                    }
                    if (!outOfBoundsY.current) {
                        newY -= yFactor * dy * stepV2 * stepMultiplier.current;
                        set({ y: _y });
                    }
                    if (outOfBoundsX.current || outOfBoundsY.current)
                        startOutOfBounds();
                    else endOutOfBounds();
                    onUpdate({ [v1]: newX, [v22]: newY });
                } else {
                    setShowJoystick(false);
                    outOfBoundsX.current = 0;
                    outOfBoundsY.current = 0;
                    set({ x: 0, y: 0 });
                    endOutOfBounds();
                }
            }
        );
        return React5.createElement(
            JoystickTrigger,
            _extends2({ ref: joystickeRef }, bind()),
            joystickShown &&
                React5.createElement(
                    Portal,
                    null,
                    React5.createElement(
                        JoystickPlayground,
                        { ref: playgroundRef, isOutOfBounds },
                        React5.createElement('div', null),
                        React5.createElement('span', { ref: spanRef })
                    )
                )
        );
    }
    var Container$1 = styled('div', {
        display: 'grid',
        columnGap: '$colGap',
        variants: {
            withJoystick: {
                true: { gridTemplateColumns: '$sizes$rowHeight auto' },
                false: { gridTemplateColumns: 'auto' }
            }
        }
    });
    function Vector2dComponent() {
        const { label, displayValue, onUpdate, settings } = useInputContext();
        return React5.createElement(
            Row,
            { input: true },
            React5.createElement(Label, null, label),
            React5.createElement(
                Container$1,
                { withJoystick: !!settings.joystick },
                settings.joystick &&
                    React5.createElement(Joystick, {
                        value: displayValue,
                        settings,
                        onUpdate
                    }),
                React5.createElement(Vector, {
                    value: displayValue,
                    settings,
                    onUpdate
                })
            )
        );
    }
    var _excluded$72 = ['joystick'];
    var plugin = getVectorPlugin(['x', 'y']);
    var normalize$22 = (_ref) => {
        let { joystick = true } = _ref,
            input = _objectWithoutProperties(_ref, _excluded$72);
        const { value, settings } = plugin.normalize(input);
        return {
            value,
            settings: _objectSpread2(_objectSpread2({}, settings), {}, { joystick })
        };
    };
    var vector2d = createInternalPlugin(
        _objectSpread2(
            _objectSpread2({ component: Vector2dComponent }, plugin),
            {},
            { normalize: normalize$22 }
        )
    );
    var sanitize$12 = (v4) => {
        if (v4 === void 0) return void 0;
        if (v4 instanceof File) {
            try {
                return URL.createObjectURL(v4);
            } catch (e4) {
                return void 0;
            }
        }
        if (typeof v4 === 'string' && v4.indexOf('blob:') === 0) return v4;
        throw Error(`Invalid image format [undefined | blob |\xA0File].`);
    };
    var schema$12 = (_o, s4) => typeof s4 === 'object' && 'image' in s4;
    var normalize$12 = ({ image: image2 }) => {
        return { value: image2 };
    };
    var props$12 = Object.freeze({
        __proto__: null,
        sanitize: sanitize$12,
        schema: schema$12,
        normalize: normalize$12
    });
    var ImageContainer = styled('div', {
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '$sizes$rowHeight auto 20px',
        columnGap: '$colGap',
        alignItems: 'center'
    });
    var DropZone = styled('div', {
        $flexCenter: '',
        overflow: 'hidden',
        height: '$rowHeight',
        background: '$elevation3',
        textAlign: 'center',
        color: 'inherit',
        borderRadius: '$sm',
        outline: 'none',
        userSelect: 'none',
        cursor: 'pointer',
        $inputStyle: '',
        $hover: '',
        $focusWithin: '',
        $active: '$accent1 $elevation1',
        variants: {
            isDragAccept: {
                true: { $inputStyle: '$accent1', backgroundColor: '$elevation1' }
            }
        }
    });
    var ImagePreview = styled('div', {
        boxSizing: 'border-box',
        borderRadius: '$sm',
        height: '$rowHeight',
        width: '$rowHeight',
        $inputStyle: '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        variants: {
            hasImage: { true: { cursor: 'pointer', $hover: '', $active: '' } }
        }
    });
    var ImageLargePreview = styled('div', {
        $flexCenter: '',
        width: '$imagePreviewWidth',
        height: '$imagePreviewHeight',
        borderRadius: '$sm',
        boxShadow: '$level2',
        pointerEvents: 'none',
        $inputStyle: '',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    });
    var Instructions = styled('div', {
        fontSize: '0.8em',
        height: '100%',
        padding: '$rowGap $md'
    });
    var Remove = styled('div', {
        $flexCenter: '',
        top: '0',
        right: '0',
        marginRight: '$sm',
        height: '100%',
        cursor: 'pointer',
        variants: {
            disabled: { true: { color: '$elevation3', cursor: 'default' } }
        },
        '&::after,&::before': {
            content: '""',
            position: 'absolute',
            height: 2,
            width: 10,
            borderRadius: 1,
            backgroundColor: 'currentColor'
        },
        '&::after': { transform: 'rotate(45deg)' },
        '&::before': { transform: 'rotate(-45deg)' }
    });
    function ImageComponent() {
        const { label, value, onUpdate, disabled } = useInputContext();
        const { popinRef, wrapperRef, shown, show, hide: hide2 } = usePopin();
        const onDrop = React5.useCallback(
            (acceptedFiles) => {
                if (acceptedFiles.length) onUpdate(acceptedFiles[0]);
            },
            [onUpdate]
        );
        const clear = React5.useCallback(
            (e4) => {
                e4.stopPropagation();
                onUpdate(void 0);
            },
            [onUpdate]
        );
        const { getRootProps, getInputProps, isDragAccept } = useDropzone({
            maxFiles: 1,
            accept: 'image/*',
            onDrop,
            disabled
        });
        return React5.createElement(
            Row,
            { input: true },
            React5.createElement(Label, null, label),
            React5.createElement(
                ImageContainer,
                null,
                React5.createElement(ImagePreview, {
                    ref: popinRef,
                    hasImage: !!value,
                    onPointerDown: () => !!value && show(),
                    onPointerUp: hide2,
                    style: { backgroundImage: value ? `url(${value})` : 'none' }
                }),
                shown &&
                    !!value &&
                    React5.createElement(
                        Portal,
                        null,
                        React5.createElement(Overlay, {
                            onPointerUp: hide2,
                            style: { cursor: 'pointer' }
                        }),
                        React5.createElement(ImageLargePreview, {
                            ref: wrapperRef,
                            style: { backgroundImage: `url(${value})` }
                        })
                    ),
                React5.createElement(
                    DropZone,
                    getRootProps({ isDragAccept }),
                    React5.createElement('input', getInputProps()),
                    React5.createElement(
                        Instructions,
                        null,
                        isDragAccept ? 'drop image' : 'click or drop'
                    )
                ),
                React5.createElement(Remove, { onClick: clear, disabled: !value })
            )
        );
    }
    var image = createInternalPlugin(
        _objectSpread2({ component: ImageComponent }, props$12)
    );
    var number2 = v8n_esm_default().number();
    var schema2 = (o4, s4) =>
        v8n_esm_default().array().length(2).every.number().test(o4) &&
        v8n_esm_default().schema({ min: number2, max: number2 }).test(s4);
    var format2 = (v4) => ({ min: v4[0], max: v4[1] });
    var sanitize2 = (value, { bounds: [MIN, MAX] }, prevValue) => {
        const _value = Array.isArray(value) ? format2(value) : value;
        const _newValue = { min: prevValue[0], max: prevValue[1] };
        const { min: min3, max: max3 } = _objectSpread2(
            _objectSpread2({}, _newValue),
            _value
        );
        return [
            clamp(Number(min3), MIN, Math.max(MIN, max3)),
            clamp(Number(max3), Math.min(MAX, min3), MAX)
        ];
    };
    var normalize2 = ({ value, min: min3, max: max3 }) => {
        const boundsSettings = { min: min3, max: max3 };
        const _settings = normalizeKeyedNumberSettings(format2(value), {
            min: boundsSettings,
            max: boundsSettings
        });
        const bounds = [min3, max3];
        const settings = _objectSpread2(
            _objectSpread2({}, _settings),
            {},
            { bounds }
        );
        const _value = sanitize2(format2(value), settings, value);
        return { value: _value, settings };
    };
    var props2 = Object.freeze({
        __proto__: null,
        schema: schema2,
        format: format2,
        sanitize: sanitize2,
        normalize: normalize2
    });
    var _excluded$62 = ['value', 'bounds', 'onDrag'];
    var _excluded2$12 = ['bounds'];
    var Container2 = styled('div', {
        display: 'grid',
        columnGap: '$colGap',
        gridTemplateColumns:
            'auto calc($sizes$numberInputMinWidth * 2 + $space$rowGap)'
    });
    function IntervalSlider(_ref) {
        let {
                value,
                bounds: [min3, max3],
                onDrag
            } = _ref,
            settings = _objectWithoutProperties(_ref, _excluded$62);
        const ref = React5.useRef(null);
        const minScrubberRef = React5.useRef(null);
        const maxScrubberRef = React5.useRef(null);
        const rangeWidth = React5.useRef(0);
        const scrubberWidth = useTh('sizes', 'scrubberWidth');
        const bind = useDrag2(
            ({ event, first, xy: [x3], movement: [mx], memo: _memo = {} }) => {
                if (first) {
                    const { width, left } = ref.current.getBoundingClientRect();
                    rangeWidth.current = width - parseFloat(scrubberWidth);
                    const targetIsScrub =
                        (event === null || event === void 0
                            ? void 0
                            : event.target) === minScrubberRef.current ||
                        (event === null || event === void 0
                            ? void 0
                            : event.target) === maxScrubberRef.current;
                    _memo.pos = invertedRange((x3 - left) / width, min3, max3);
                    const delta =
                        Math.abs(_memo.pos - value.min) -
                        Math.abs(_memo.pos - value.max);
                    _memo.key =
                        delta < 0 || (delta === 0 && _memo.pos <= value.min)
                            ? 'min'
                            : 'max';
                    if (targetIsScrub) _memo.pos = value[_memo.key];
                }
                const newValue =
                    _memo.pos +
                    invertedRange(mx / rangeWidth.current, 0, max3 - min3);
                onDrag({
                    [_memo.key]: sanitizeStep(newValue, settings[_memo.key])
                });
                return _memo;
            }
        );
        const minStyle = `calc(${range(value.min, min3, max3)} * (100% - ${scrubberWidth} - 8px) + 4px)`;
        const maxStyle = `calc(${1 - range(value.max, min3, max3)} * (100% - ${scrubberWidth} - 8px) + 4px)`;
        return React5.createElement(
            RangeWrapper,
            _extends2({ ref }, bind()),
            React5.createElement(
                Range,
                null,
                React5.createElement(Indicator, {
                    style: { left: minStyle, right: maxStyle }
                })
            ),
            React5.createElement(Scrubber, {
                position: 'left',
                ref: minScrubberRef,
                style: { left: minStyle }
            }),
            React5.createElement(Scrubber, {
                position: 'right',
                ref: maxScrubberRef,
                style: { right: maxStyle }
            })
        );
    }
    function IntervalComponent() {
        const { label, displayValue, onUpdate, settings } = useInputContext();
        const _settings = _objectWithoutProperties(settings, _excluded2$12);
        return React5.createElement(
            React5.Fragment,
            null,
            React5.createElement(
                Row,
                { input: true },
                React5.createElement(Label, null, label),
                React5.createElement(
                    Container2,
                    null,
                    React5.createElement(
                        IntervalSlider,
                        _extends2({ value: displayValue }, settings, {
                            onDrag: onUpdate
                        })
                    ),
                    React5.createElement(Vector, {
                        value: displayValue,
                        settings: _settings,
                        onUpdate,
                        innerLabelTrim: 0
                    })
                )
            )
        );
    }
    var interval = createInternalPlugin(
        _objectSpread2({ component: IntervalComponent }, props2)
    );
    var createEventEmitter = () => {
        const listenerMapping = new Map();
        return {
            on: (topic, listener) => {
                let listeners = listenerMapping.get(topic);
                if (listeners === void 0) {
                    listeners = new Set();
                    listenerMapping.set(topic, listeners);
                }
                listeners.add(listener);
            },
            off: (topic, listener) => {
                const listeners = listenerMapping.get(topic);
                if (listeners === void 0) {
                    return;
                }
                listeners.delete(listener);
                if (listeners.size === 0) {
                    listenerMapping.delete(topic);
                }
            },
            emit: (topic, ...args) => {
                const listeners = listenerMapping.get(topic);
                if (listeners === void 0) {
                    return;
                }
                for (const listener of listeners) {
                    listener(...args);
                }
            }
        };
    };
    var _excluded$52 = ['type', 'value'];
    var _excluded23 = ['onChange', 'transient', 'onEditStart', 'onEditEnd'];
    var Store = function Store2() {
        const store = create(subscribeWithSelector(() => ({ data: {} })));
        const eventEmitter = createEventEmitter();
        this.storeId = getUid();
        this.useStore = store;
        const folders = {};
        const orderedPaths = new Set();
        this.getVisiblePaths = () => {
            const data = this.getData();
            const paths = Object.keys(data);
            const hiddenFolders = [];
            Object.entries(folders).forEach(([path, settings]) => {
                if (
                    settings.render &&
                    paths.some((p4) => p4.indexOf(path) === 0) &&
                    !settings.render(this.get)
                )
                    hiddenFolders.push(path + '.');
            });
            const visiblePaths = [];
            orderedPaths.forEach((path) => {
                if (
                    path in data &&
                    data[path].__refCount > 0 &&
                    hiddenFolders.every((p4) => path.indexOf(p4) === -1) &&
                    (!data[path].render || data[path].render(this.get))
                ) {
                    visiblePaths.push(path);
                }
            });
            return visiblePaths;
        };
        this.setOrderedPaths = (newPaths) => {
            newPaths.forEach((p4) => orderedPaths.add(p4));
        };
        this.orderPaths = (paths) => {
            this.setOrderedPaths(paths);
            return paths;
        };
        this.disposePaths = (paths) => {
            store.setState((s4) => {
                const data = s4.data;
                paths.forEach((path) => {
                    if (path in data) {
                        const input = data[path];
                        input.__refCount--;
                        if (input.__refCount === 0 && input.type in SpecialInputs) {
                            delete data[path];
                        }
                    }
                });
                return { data };
            });
        };
        this.dispose = () => {
            store.setState(() => {
                return { data: {} };
            });
        };
        this.getFolderSettings = (path) => {
            return folders[path] || {};
        };
        this.getData = () => {
            return store.getState().data;
        };
        this.addData = (newData, override) => {
            store.setState((s4) => {
                const data = s4.data;
                Object.entries(newData).forEach(([path, newInputData]) => {
                    let input = data[path];
                    if (!!input) {
                        const { type, value } = newInputData,
                            rest2 = _objectWithoutProperties(
                                newInputData,
                                _excluded$52
                            );
                        if (type !== input.type) {
                            warn(LevaErrors.INPUT_TYPE_OVERRIDE, type);
                        } else {
                            if (input.__refCount === 0 || override) {
                                Object.assign(input, rest2);
                            }
                            input.__refCount++;
                        }
                    } else {
                        data[path] = _objectSpread2(
                            _objectSpread2({}, newInputData),
                            {},
                            { __refCount: 1 }
                        );
                    }
                });
                return { data };
            });
        };
        this.setValueAtPath = (path, value, fromPanel) => {
            store.setState((s4) => {
                const data = s4.data;
                updateInput(data[path], value, path, this, fromPanel);
                return { data };
            });
        };
        this.setSettingsAtPath = (path, settings) => {
            store.setState((s4) => {
                const data = s4.data;
                data[path].settings = _objectSpread2(
                    _objectSpread2({}, data[path].settings),
                    settings
                );
                return { data };
            });
        };
        this.disableInputAtPath = (path, flag) => {
            store.setState((s4) => {
                const data = s4.data;
                data[path].disabled = flag;
                return { data };
            });
        };
        this.set = (values, fromPanel) => {
            store.setState((s4) => {
                const data = s4.data;
                Object.entries(values).forEach(([path, value]) => {
                    try {
                        updateInput(data[path], value, void 0, void 0, fromPanel);
                    } catch (e4) {
                        {
                            console.warn(
                                `[This message will only show in development]: \`set\` for path ${path} has failed.`,
                                e4
                            );
                        }
                    }
                });
                return { data };
            });
        };
        this.getInput = (path) => {
            try {
                return this.getData()[path];
            } catch (e4) {
                warn(LevaErrors.PATH_DOESNT_EXIST, path);
            }
        };
        this.get = (path) => {
            var _this$getInput;
            return (_this$getInput = this.getInput(path)) === null ||
                _this$getInput === void 0
                ? void 0
                : _this$getInput.value;
        };
        this.emitOnEditStart = (path) => {
            eventEmitter.emit(
                `onEditStart:${path}`,
                this.get(path),
                path,
                _objectSpread2(
                    _objectSpread2({}, this.getInput(path)),
                    {},
                    { get: this.get }
                )
            );
        };
        this.emitOnEditEnd = (path) => {
            eventEmitter.emit(
                `onEditEnd:${path}`,
                this.get(path),
                path,
                _objectSpread2(
                    _objectSpread2({}, this.getInput(path)),
                    {},
                    { get: this.get }
                )
            );
        };
        this.subscribeToEditStart = (path, listener) => {
            const _path = `onEditStart:${path}`;
            eventEmitter.on(_path, listener);
            return () => eventEmitter.off(_path, listener);
        };
        this.subscribeToEditEnd = (path, listener) => {
            const _path = `onEditEnd:${path}`;
            eventEmitter.on(_path, listener);
            return () => eventEmitter.off(_path, listener);
        };
        const _getDataFromSchema = (schema3, rootPath, mappedPaths) => {
            const data = {};
            Object.entries(schema3).forEach(([key, rawInput]) => {
                if (key === '') return warn(LevaErrors.EMPTY_KEY);
                let newPath = join(rootPath, key);
                if (rawInput.type === SpecialInputs.FOLDER) {
                    const newData = _getDataFromSchema(
                        rawInput.schema,
                        newPath,
                        mappedPaths
                    );
                    Object.assign(data, newData);
                    if (!(newPath in folders)) folders[newPath] = rawInput.settings;
                } else if (key in mappedPaths) {
                    warn(
                        LevaErrors.DUPLICATE_KEYS,
                        key,
                        newPath,
                        mappedPaths[key].path
                    );
                } else {
                    const normalizedInput = normalizeInput(
                        rawInput,
                        key,
                        newPath,
                        data
                    );
                    if (normalizedInput) {
                        const { type, options, input } = normalizedInput;
                        const { onChange, transient, onEditStart, onEditEnd } =
                                options,
                            _options = _objectWithoutProperties(
                                options,
                                _excluded23
                            );
                        data[newPath] = _objectSpread2(
                            _objectSpread2(
                                _objectSpread2({ type }, _options),
                                input
                            ),
                            {},
                            { fromPanel: true }
                        );
                        mappedPaths[key] = {
                            path: newPath,
                            onChange,
                            transient,
                            onEditStart,
                            onEditEnd
                        };
                    } else {
                        warn(LevaErrors.UNKNOWN_INPUT, newPath, rawInput);
                    }
                }
            });
            return data;
        };
        this.getDataFromSchema = (schema3) => {
            const mappedPaths = {};
            const data = _getDataFromSchema(schema3, '', mappedPaths);
            return [data, mappedPaths];
        };
    };
    var levaStore = new Store();
    function useCreateStore() {
        return React5.useMemo(() => new Store(), []);
    }
    if (typeof window !== 'undefined') {
        window.__STORE = levaStore;
    }
    var defaultSettings$2 = { collapsed: false };
    function folder(schema3, settings) {
        return {
            type: SpecialInputs.FOLDER,
            schema: schema3,
            settings: _objectSpread2(
                _objectSpread2({}, defaultSettings$2),
                settings
            )
        };
    }
    var defaultSettings$1 = { disabled: false };
    function button(onClick, settings) {
        return {
            type: SpecialInputs.BUTTON,
            onClick,
            settings: _objectSpread2(
                _objectSpread2({}, defaultSettings$1),
                settings
            )
        };
    }
    function buttonGroup(opts) {
        return { type: SpecialInputs.BUTTON_GROUP, opts };
    }
    var defaultSettings = { graph: false, interval: 100 };
    function monitor(objectOrFn, settings) {
        return {
            type: SpecialInputs.MONITOR,
            objectOrFn,
            settings: _objectSpread2(_objectSpread2({}, defaultSettings), settings)
        };
    }
    var isInput = (v4) => '__levaInput' in v4;
    var buildTree = (paths, filter) => {
        const tree = {};
        const _filter = filter ? filter.toLowerCase() : null;
        paths.forEach((path) => {
            const [valueKey, folderPath] = getKeyPath(path);
            if (!_filter || valueKey.toLowerCase().indexOf(_filter) > -1) {
                (0, import_merge_value.default)(tree, folderPath, {
                    [valueKey]: { __levaInput: true, path }
                });
            }
        });
        return tree;
    };
    var _excluded$42 = [
        'type',
        'label',
        'path',
        'valueKey',
        'value',
        'settings',
        'setValue',
        'disabled'
    ];
    function ControlInput(_ref) {
        let { type, label, path, valueKey, value, settings, setValue, disabled } =
                _ref,
            rest2 = _objectWithoutProperties(_ref, _excluded$42);
        const { displayValue, onChange, onUpdate } = useInputSetters({
            type,
            value,
            settings,
            setValue
        });
        const Input = Plugins[type].component;
        if (!Input) {
            warn(LevaErrors.NO_COMPONENT_FOR_TYPE, type, path);
            return null;
        }
        return React5.createElement(
            InputContext.Provider,
            {
                value: _objectSpread2(
                    {
                        key: valueKey,
                        path,
                        id: '' + path,
                        label,
                        displayValue,
                        value,
                        onChange,
                        onUpdate,
                        settings,
                        setValue,
                        disabled
                    },
                    rest2
                )
            },
            React5.createElement(
                StyledInputWrapper$1,
                { disabled },
                React5.createElement(Input, null)
            )
        );
    }
    var StyledButton = styled('button', {
        display: 'block',
        $reset: '',
        fontWeight: '$button',
        height: '$rowHeight',
        borderStyle: 'none',
        borderRadius: '$sm',
        backgroundColor: '$elevation1',
        color: '$highlight1',
        '&:not(:disabled)': {
            color: '$highlight3',
            backgroundColor: '$accent2',
            cursor: 'pointer',
            $hover: '$accent3',
            $active: '$accent3 $accent1',
            $focus: ''
        }
    });
    function Button({ onClick, settings, label }) {
        const store = useStoreContext();
        return React5.createElement(
            Row,
            null,
            React5.createElement(
                StyledButton,
                { disabled: settings.disabled, onClick: () => onClick(store.get) },
                label
            )
        );
    }
    var StyledButtonGroup = styled('div', {
        $flex: '',
        justifyContent: 'flex-end',
        gap: '$colGap'
    });
    var StyledButtonGroupButton = styled('button', {
        $reset: '',
        cursor: 'pointer',
        borderRadius: '$xs',
        '&:hover': { backgroundColor: '$elevation3' }
    });
    var getOpts = ({ label: _label, opts: _opts }) => {
        let label =
            typeof _label === 'string'
                ? _label.trim() === ''
                    ? null
                    : _label
                : _label;
        let opts = _opts;
        if (typeof _opts.opts === 'object') {
            if (opts.label !== void 0) {
                label = _opts.label;
            }
            opts = _opts.opts;
        }
        return { label, opts };
    };
    function ButtonGroup(props3) {
        const { label, opts } = getOpts(props3);
        const store = useStoreContext();
        return React5.createElement(
            Row,
            { input: !!label },
            label && React5.createElement(Label, null, label),
            React5.createElement(
                StyledButtonGroup,
                null,
                Object.entries(opts).map(([label2, onClick]) =>
                    React5.createElement(
                        StyledButtonGroupButton,
                        { key: label2, onClick: () => onClick(store.get) },
                        label2
                    )
                )
            )
        );
    }
    var Canvas = styled('canvas', {
        height: '$monitorHeight',
        width: '100%',
        display: 'block',
        borderRadius: '$sm'
    });
    var POINTS = 100;
    function push(arr, val) {
        arr.push(val);
        if (arr.length > POINTS) arr.shift();
    }
    var MonitorCanvas = React5.forwardRef(function ({ initialValue }, ref) {
        const accentColor = useTh('colors', 'highlight3');
        const backgroundColor = useTh('colors', 'elevation2');
        const fillColor = useTh('colors', 'highlight1');
        const [gradientTop, gradientBottom] = React5.useMemo(() => {
            return [
                w2(fillColor).alpha(0.4).toRgbString(),
                w2(fillColor).alpha(0.1).toRgbString()
            ];
        }, [fillColor]);
        const points = React5.useRef([initialValue]);
        const min3 = React5.useRef(initialValue);
        const max3 = React5.useRef(initialValue);
        const raf = React5.useRef();
        const drawPlot = React5.useCallback(
            (_canvas, _ctx) => {
                if (!_canvas) return;
                const { width, height } = _canvas;
                const path = new Path2D();
                const interval2 = width / POINTS;
                const verticalPadding = height * 0.05;
                for (let i4 = 0; i4 < points.current.length; i4++) {
                    const p4 = range(
                        points.current[i4],
                        min3.current,
                        max3.current
                    );
                    const x3 = interval2 * i4;
                    const y4 =
                        height -
                        p4 * (height - verticalPadding * 2) -
                        verticalPadding;
                    path.lineTo(x3, y4);
                }
                _ctx.clearRect(0, 0, width, height);
                const gradientPath = new Path2D(path);
                gradientPath.lineTo(
                    interval2 * (points.current.length + 1),
                    height
                );
                gradientPath.lineTo(0, height);
                gradientPath.lineTo(0, 0);
                const gradient = _ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, gradientTop);
                gradient.addColorStop(1, gradientBottom);
                _ctx.fillStyle = gradient;
                _ctx.fill(gradientPath);
                _ctx.strokeStyle = backgroundColor;
                _ctx.lineJoin = 'round';
                _ctx.lineWidth = 14;
                _ctx.stroke(path);
                _ctx.strokeStyle = accentColor;
                _ctx.lineWidth = 2;
                _ctx.stroke(path);
            },
            [accentColor, backgroundColor, gradientTop, gradientBottom]
        );
        const [canvas, ctx] = useCanvas2d(drawPlot);
        React5.useImperativeHandle(
            ref,
            () => ({
                frame: (val) => {
                    if (min3.current === void 0 || val < min3.current)
                        min3.current = val;
                    if (max3.current === void 0 || val > max3.current)
                        max3.current = val;
                    push(points.current, val);
                    raf.current = requestAnimationFrame(() =>
                        drawPlot(canvas.current, ctx.current)
                    );
                }
            }),
            [canvas, ctx, drawPlot]
        );
        React5.useEffect(() => () => cancelAnimationFrame(raf.current), []);
        return React5.createElement(Canvas, { ref: canvas });
    });
    var parse = (val) =>
        Number.isFinite(val) ? val.toPrecision(2) : val.toString();
    var MonitorLog = React5.forwardRef(function ({ initialValue }, ref) {
        const [val, set] = React5.useState(parse(initialValue));
        React5.useImperativeHandle(ref, () => ({ frame: (v4) => set(parse(v4)) }), []);
        return React5.createElement('div', null, val);
    });
    function getValue(o4) {
        return typeof o4 === 'function' ? o4() : o4.current;
    }
    function Monitor({ label, objectOrFn, settings }) {
        const ref = React5.useRef();
        const initialValue = React5.useRef(getValue(objectOrFn));
        React5.useEffect(() => {
            const timeout = window.setInterval(() => {
                var _ref$current;
                if (document.hidden) return;
                (_ref$current = ref.current) === null || _ref$current === void 0
                    ? void 0
                    : _ref$current.frame(getValue(objectOrFn));
            }, settings.interval);
            return () => window.clearInterval(timeout);
        }, [objectOrFn, settings.interval]);
        return React5.createElement(
            Row,
            { input: true },
            React5.createElement(Label, { align: 'top' }, label),
            settings.graph
                ? React5.createElement(MonitorCanvas, {
                      ref,
                      initialValue: initialValue.current
                  })
                : React5.createElement(MonitorLog, {
                      ref,
                      initialValue: initialValue.current
                  })
        );
    }
    var _excluded$32 = ['type', 'label', 'key'];
    var specialComponents = {
        [SpecialInputs.BUTTON]: Button,
        [SpecialInputs.BUTTON_GROUP]: ButtonGroup,
        [SpecialInputs.MONITOR]: Monitor
    };
    var Control = React5.memo(({ path }) => {
        const [
            input,
            { set, setSettings, disable, storeId, emitOnEditStart, emitOnEditEnd }
        ] = useInput(path);
        if (!input) return null;
        const { type, label, key } = input,
            inputProps = _objectWithoutProperties(input, _excluded$32);
        if (type in SpecialInputs) {
            const SpecialInputForType = specialComponents[type];
            return React5.createElement(
                SpecialInputForType,
                _extends2({ label, path }, inputProps)
            );
        }
        if (!(type in Plugins)) {
            log(LevaErrors.UNSUPPORTED_INPUT, type, path);
            return null;
        }
        return React5.createElement(
            ControlInput,
            _extends2(
                {
                    key: storeId + path,
                    type,
                    label,
                    storeId,
                    path,
                    valueKey: key,
                    setValue: set,
                    setSettings,
                    disable,
                    emitOnEditStart,
                    emitOnEditEnd
                },
                inputProps
            )
        );
    });
    function FolderTitle({ toggle, toggled, name }) {
        return React5.createElement(
            StyledTitle,
            { onClick: () => toggle() },
            React5.createElement(Chevron, { toggled }),
            React5.createElement('div', null, name)
        );
    }
    var Folder = ({ name, path, tree }) => {
        const store = useStoreContext();
        const newPath = join(path, name);
        const { collapsed, color: color2 } = store.getFolderSettings(newPath);
        const [toggled, setToggle] = React5.useState(!collapsed);
        const folderRef = React5.useRef(null);
        const widgetColor = useTh('colors', 'folderWidgetColor');
        const textColor = useTh('colors', 'folderTextColor');
        React5.useLayoutEffect(() => {
            folderRef.current.style.setProperty(
                '--leva-colors-folderWidgetColor',
                color2 || widgetColor
            );
            folderRef.current.style.setProperty(
                '--leva-colors-folderTextColor',
                color2 || textColor
            );
        }, [color2, widgetColor, textColor]);
        return React5.createElement(
            StyledFolder,
            { ref: folderRef },
            React5.createElement(FolderTitle, {
                name,
                toggled,
                toggle: () => setToggle((t4) => !t4)
            }),
            React5.createElement(TreeWrapper, { parent: newPath, tree, toggled })
        );
    };
    var TreeWrapper = React5.memo(
        ({
            isRoot: _isRoot = false,
            fill: _fill = false,
            flat: _flat = false,
            parent,
            tree,
            toggled
        }) => {
            const { wrapperRef, contentRef } = useToggle(toggled);
            const store = useStoreContext();
            const getOrder = ([key, o4]) => {
                var _store$getInput;
                const order = isInput(o4)
                    ? (_store$getInput = store.getInput(o4.path)) === null ||
                      _store$getInput === void 0
                        ? void 0
                        : _store$getInput.order
                    : store.getFolderSettings(join(parent, key)).order;
                return order || 0;
            };
            const entries = Object.entries(tree).sort(
                (a4, b4) => getOrder(a4) - getOrder(b4)
            );
            return React5.createElement(
                StyledWrapper,
                { ref: wrapperRef, isRoot: _isRoot, fill: _fill, flat: _flat },
                React5.createElement(
                    StyledContent,
                    { ref: contentRef, isRoot: _isRoot, toggled },
                    entries.map(([key, value]) =>
                        isInput(value)
                            ? React5.createElement(Control, {
                                  key: value.path,
                                  valueKey: value.valueKey,
                                  path: value.path
                              })
                            : React5.createElement(Folder, {
                                  key,
                                  name: key,
                                  path: parent,
                                  tree: value
                              })
                    )
                )
            );
        }
    );
    var StyledRoot = styled('div', {
        position: 'relative',
        fontFamily: '$mono',
        fontSize: '$root',
        color: '$rootText',
        backgroundColor: '$elevation1',
        variants: {
            fill: {
                false: {
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    zIndex: 1e3,
                    width: '$rootWidth'
                },
                true: { position: 'relative', width: '100%' }
            },
            flat: { false: { borderRadius: '$lg', boxShadow: '$level1' } },
            oneLineLabels: {
                true: {
                    [`${StyledInputRow}`]: {
                        gridTemplateColumns: 'auto',
                        gridAutoColumns: 'minmax(max-content, 1fr)',
                        gridAutoRows: 'minmax($sizes$rowHeight), auto)',
                        rowGap: 0,
                        columnGap: 0,
                        marginTop: '$rowGap'
                    }
                }
            },
            hideTitleBar: {
                true: { $$titleBarHeight: '0px' },
                false: { $$titleBarHeight: '$sizes$titleBarHeight' }
            }
        },
        '&,*,*:after,*:before': { boxSizing: 'border-box' },
        '*::selection': { backgroundColor: '$accent2' }
    });
    var iconWidth = 40;
    var Icon = styled('i', {
        $flexCenter: '',
        width: iconWidth,
        userSelect: 'none',
        cursor: 'pointer',
        '> svg': {
            fill: '$highlight1',
            transition: 'transform 350ms ease, fill 250ms ease'
        },
        '&:hover > svg': { fill: '$highlight3' },
        variants: { active: { true: { '> svg': { fill: '$highlight2' } } } }
    });
    var StyledTitleWithFilter = styled('div', {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        height: '$titleBarHeight',
        variants: { mode: { drag: { cursor: 'grab' } } }
    });
    var FilterWrapper = styled('div', {
        $flex: '',
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        transition: 'height 250ms ease',
        color: '$highlight3',
        paddingLeft: '$md',
        [`> ${Icon}`]: { height: 30 },
        variants: { toggled: { true: { height: 30 }, false: { height: 0 } } }
    });
    var StyledFilterInput = styled('input', {
        $reset: '',
        flex: 1,
        position: 'relative',
        height: 30,
        width: '100%',
        backgroundColor: 'transparent',
        fontSize: '10px',
        borderRadius: '$root',
        '&:focus': {},
        '&::placeholder': { color: '$highlight2' }
    });
    var TitleContainer = styled('div', {
        touchAction: 'none',
        $flexCenter: '',
        flex: 1,
        '> svg': { fill: '$highlight1' },
        color: '$highlight1',
        variants: {
            drag: {
                true: {
                    $draggable: '',
                    '> svg': { transition: 'fill 250ms ease' },
                    '&:hover': { color: '$highlight3' },
                    '&:hover > svg': { fill: '$highlight3' }
                }
            },
            filterEnabled: { false: { paddingRight: iconWidth } }
        }
    });
    var FilterInput = React5.forwardRef(({ setFilter, toggle }, ref) => {
        const [value, set] = React5.useState('');
        const debouncedOnChange = React5.useMemo(
            () => debounce(setFilter, 250),
            [setFilter]
        );
        const clear = () => {
            setFilter('');
            set('');
        };
        const _onChange = (e4) => {
            const v4 = e4.currentTarget.value;
            toggle(true);
            set(v4);
        };
        React5.useEffect(() => {
            debouncedOnChange(value);
        }, [value, debouncedOnChange]);
        return React5.createElement(
            React5.Fragment,
            null,
            React5.createElement(StyledFilterInput, {
                ref,
                value,
                placeholder: '[Open filter with CMD+SHIFT+L]',
                onPointerDown: (e4) => e4.stopPropagation(),
                onChange: _onChange
            }),
            React5.createElement(
                Icon,
                {
                    onClick: () => clear(),
                    style: { visibility: value ? 'visible' : 'hidden' }
                },
                React5.createElement(
                    'svg',
                    {
                        xmlns: 'http://www.w3.org/2000/svg',
                        height: '14',
                        width: '14',
                        viewBox: '0 0 20 20',
                        fill: 'currentColor'
                    },
                    React5.createElement('path', {
                        fillRule: 'evenodd',
                        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
                        clipRule: 'evenodd'
                    })
                )
            )
        );
    });
    function TitleWithFilter({
        setFilter,
        onDrag,
        onDragStart,
        onDragEnd,
        toggle,
        toggled,
        title,
        drag,
        filterEnabled,
        from
    }) {
        const [filterShown, setShowFilter] = React5.useState(false);
        const inputRef = React5.useRef(null);
        React5.useEffect(() => {
            var _inputRef$current, _inputRef$current2;
            if (filterShown)
                (_inputRef$current = inputRef.current) === null ||
                _inputRef$current === void 0
                    ? void 0
                    : _inputRef$current.focus();
            else
                (_inputRef$current2 = inputRef.current) === null ||
                _inputRef$current2 === void 0
                    ? void 0
                    : _inputRef$current2.blur();
        }, [filterShown]);
        const bind = useDrag2(
            ({ offset: [x3, y4], first, last }) => {
                onDrag({ x: x3, y: y4 });
                if (first) {
                    onDragStart({ x: x3, y: y4 });
                }
                if (last) {
                    onDragEnd({ x: x3, y: y4 });
                }
            },
            {
                filterTaps: true,
                from: ({ offset: [x3, y4] }) => [
                    (from === null || from === void 0 ? void 0 : from.x) || x3,
                    (from === null || from === void 0 ? void 0 : from.y) || y4
                ]
            }
        );
        React5.useEffect(() => {
            const handleShortcut = (event) => {
                if (event.key === 'L' && event.shiftKey && event.metaKey) {
                    setShowFilter((f4) => !f4);
                }
            };
            window.addEventListener('keydown', handleShortcut);
            return () => window.removeEventListener('keydown', handleShortcut);
        }, []);
        return React5.createElement(
            React5.Fragment,
            null,
            React5.createElement(
                StyledTitleWithFilter,
                { mode: drag ? 'drag' : void 0 },
                React5.createElement(
                    Icon,
                    { active: !toggled, onClick: () => toggle() },
                    React5.createElement(Chevron, { toggled, width: 12, height: 8 })
                ),
                React5.createElement(
                    TitleContainer,
                    _extends2({}, drag ? bind() : {}, { drag, filterEnabled }),
                    title === void 0 && drag
                        ? React5.createElement(
                              'svg',
                              {
                                  width: '20',
                                  height: '10',
                                  viewBox: '0 0 28 14',
                                  xmlns: 'http://www.w3.org/2000/svg'
                              },
                              React5.createElement('circle', {
                                  cx: '2',
                                  cy: '2',
                                  r: '2'
                              }),
                              React5.createElement('circle', {
                                  cx: '14',
                                  cy: '2',
                                  r: '2'
                              }),
                              React5.createElement('circle', {
                                  cx: '26',
                                  cy: '2',
                                  r: '2'
                              }),
                              React5.createElement('circle', {
                                  cx: '2',
                                  cy: '12',
                                  r: '2'
                              }),
                              React5.createElement('circle', {
                                  cx: '14',
                                  cy: '12',
                                  r: '2'
                              }),
                              React5.createElement('circle', {
                                  cx: '26',
                                  cy: '12',
                                  r: '2'
                              })
                          )
                        : title
                ),
                filterEnabled &&
                    React5.createElement(
                        Icon,
                        {
                            active: filterShown,
                            onClick: () => setShowFilter((f4) => !f4)
                        },
                        React5.createElement(
                            'svg',
                            {
                                xmlns: 'http://www.w3.org/2000/svg',
                                height: '20',
                                viewBox: '0 0 20 20'
                            },
                            React5.createElement('path', {
                                d: 'M9 9a2 2 0 114 0 2 2 0 01-4 0z'
                            }),
                            React5.createElement('path', {
                                fillRule: 'evenodd',
                                d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z',
                                clipRule: 'evenodd'
                            })
                        )
                    )
            ),
            React5.createElement(
                FilterWrapper,
                { toggled: filterShown },
                React5.createElement(FilterInput, {
                    ref: inputRef,
                    setFilter,
                    toggle
                })
            )
        );
    }
    var _excluded$22 = ['store', 'hidden', 'theme', 'collapsed'];
    function LevaRoot(_ref) {
        let { store, hidden = false, theme, collapsed = false } = _ref,
            props3 = _objectWithoutProperties(_ref, _excluded$22);
        const themeContext = useDeepMemo(() => mergeTheme(theme), [theme]);
        const [toggled, setToggle] = React5.useState(!collapsed);
        const computedToggled =
            typeof collapsed === 'object' ? !collapsed.collapsed : toggled;
        const computedSetToggle = React5.useMemo(() => {
            if (typeof collapsed === 'object') {
                return (value) => {
                    if (typeof value === 'function') {
                        collapsed.onChange(!value(!collapsed.collapsed));
                    } else {
                        collapsed.onChange(!value);
                    }
                };
            }
            return setToggle;
        }, [collapsed]);
        if (!store || hidden) return null;
        return React5.createElement(
            ThemeContext.Provider,
            { value: themeContext },
            React5.createElement(
                LevaCore,
                _extends2({ store }, props3, {
                    toggled: computedToggled,
                    setToggle: computedSetToggle,
                    rootClass: themeContext.className
                })
            )
        );
    }
    var LevaCore = React5.memo(
        ({
            store,
            rootClass,
            fill: _fill = false,
            flat: _flat = false,
            neverHide: _neverHide = false,
            oneLineLabels: _oneLineLabels = false,
            titleBar: _titleBar = {
                title: void 0,
                drag: true,
                filter: true,
                position: void 0,
                onDrag: void 0,
                onDragStart: void 0,
                onDragEnd: void 0
            },
            hideCopyButton: _hideCopyButton = false,
            toggled,
            setToggle
        }) => {
            var _titleBar$drag, _titleBar$filter;
            const paths = useVisiblePaths(store);
            const [filter, setFilter] = React5.useState('');
            const tree = React5.useMemo(() => buildTree(paths, filter), [paths, filter]);
            const [rootRef, set] = useTransform();
            const shouldShow = _neverHide || paths.length > 0;
            const title =
                typeof _titleBar === 'object' ? _titleBar.title || void 0 : void 0;
            const drag =
                typeof _titleBar === 'object'
                    ? (_titleBar$drag = _titleBar.drag) !== null &&
                      _titleBar$drag !== void 0
                        ? _titleBar$drag
                        : true
                    : true;
            const filterEnabled =
                typeof _titleBar === 'object'
                    ? (_titleBar$filter = _titleBar.filter) !== null &&
                      _titleBar$filter !== void 0
                        ? _titleBar$filter
                        : true
                    : true;
            const position =
                typeof _titleBar === 'object'
                    ? _titleBar.position || void 0
                    : void 0;
            const onDrag =
                typeof _titleBar === 'object' ? _titleBar.onDrag || void 0 : void 0;
            const onDragStart =
                typeof _titleBar === 'object'
                    ? _titleBar.onDragStart || void 0
                    : void 0;
            const onDragEnd =
                typeof _titleBar === 'object'
                    ? _titleBar.onDragEnd || void 0
                    : void 0;
            React5.useEffect(() => {
                set({
                    x:
                        position === null || position === void 0
                            ? void 0
                            : position.x,
                    y:
                        position === null || position === void 0
                            ? void 0
                            : position.y
                });
            }, [position, set]);
            globalStyles();
            return React5.createElement(
                PanelSettingsContext.Provider,
                { value: { hideCopyButton: _hideCopyButton } },
                React5.createElement(
                    StyledRoot,
                    {
                        ref: rootRef,
                        className: rootClass,
                        fill: _fill,
                        flat: _flat,
                        oneLineLabels: _oneLineLabels,
                        hideTitleBar: !_titleBar,
                        style: { display: shouldShow ? 'block' : 'none' }
                    },
                    _titleBar &&
                        React5.createElement(TitleWithFilter, {
                            onDrag: (point) => {
                                set(point);
                                onDrag === null || onDrag === void 0
                                    ? void 0
                                    : onDrag(point);
                            },
                            onDragStart: (point) =>
                                onDragStart === null || onDragStart === void 0
                                    ? void 0
                                    : onDragStart(point),
                            onDragEnd: (point) =>
                                onDragEnd === null || onDragEnd === void 0
                                    ? void 0
                                    : onDragEnd(point),
                            setFilter,
                            toggle: (flag) =>
                                setToggle((t4) =>
                                    flag !== null && flag !== void 0 ? flag : !t4
                                ),
                            toggled,
                            title,
                            drag,
                            filterEnabled,
                            from: position
                        }),
                    shouldShow &&
                        React5.createElement(
                            StoreContext.Provider,
                            { value: store },
                            React5.createElement(TreeWrapper, {
                                isRoot: true,
                                fill: _fill,
                                flat: _flat,
                                tree,
                                toggled
                            })
                        )
                )
            );
        }
    );
    var _excluded$12 = ['isRoot'];
    var rootInitialized = false;
    var rootEl = null;
    function Leva(_ref) {
        let { isRoot = false } = _ref,
            props3 = _objectWithoutProperties(_ref, _excluded$12);
        React5.useEffect(() => {
            rootInitialized = true;
            if (!isRoot && rootEl) {
                rootEl.remove();
                rootEl = null;
            }
            return () => {
                if (!isRoot) rootInitialized = false;
            };
        }, [isRoot]);
        return React5.createElement(
            LevaRoot,
            _extends2({ store: levaStore }, props3)
        );
    }
    function useRenderRoot(isGlobalPanel) {
        React5.useEffect(() => {
            if (isGlobalPanel && !rootInitialized) {
                if (!rootEl) {
                    rootEl =
                        document.getElementById('leva__root') ||
                        Object.assign(document.createElement('div'), {
                            id: 'leva__root'
                        });
                    if (document.body) {
                        document.body.appendChild(rootEl);
                        client.createRoot(rootEl).render(
                            React5.createElement(Leva, { isRoot: true })
                        );
                    }
                }
                rootInitialized = true;
            }
        }, [isGlobalPanel]);
    }
    var _excluded5 = ['store'];
    function LevaPanel(_ref) {
        let { store } = _ref,
            props3 = _objectWithoutProperties(_ref, _excluded5);
        const parentStore = useStoreContext();
        const _store = store === void 0 ? parentStore : store;
        return React5.createElement(LevaRoot, _extends2({ store: _store }, props3));
    }
    function parseArgs(
        schemaOrFolderName,
        settingsOrDepsOrSchema,
        depsOrSettingsOrFolderSettings,
        depsOrSettings,
        depsOrUndefined
    ) {
        let schema3;
        let folderName = void 0;
        let folderSettings;
        let hookSettings;
        let deps;
        if (typeof schemaOrFolderName === 'string') {
            folderName = schemaOrFolderName;
            schema3 = settingsOrDepsOrSchema;
            if (Array.isArray(depsOrSettingsOrFolderSettings)) {
                deps = depsOrSettingsOrFolderSettings;
            } else {
                if (depsOrSettingsOrFolderSettings) {
                    if ('store' in depsOrSettingsOrFolderSettings) {
                        hookSettings = depsOrSettingsOrFolderSettings;
                        deps = depsOrSettings;
                    } else {
                        folderSettings = depsOrSettingsOrFolderSettings;
                        if (Array.isArray(depsOrSettings)) {
                            deps = depsOrSettings;
                        } else {
                            hookSettings = depsOrSettings;
                            deps = depsOrUndefined;
                        }
                    }
                }
            }
        } else {
            schema3 = schemaOrFolderName;
            if (Array.isArray(settingsOrDepsOrSchema)) {
                deps = settingsOrDepsOrSchema;
            } else {
                hookSettings = settingsOrDepsOrSchema;
                deps = depsOrSettingsOrFolderSettings;
            }
        }
        return {
            schema: schema3,
            folderName,
            folderSettings,
            hookSettings,
            deps: deps || []
        };
    }
    function useControls(
        schemaOrFolderName,
        settingsOrDepsOrSchema,
        depsOrSettingsOrFolderSettings,
        depsOrSettings,
        depsOrUndefined
    ) {
        const {
            folderName,
            schema: schema3,
            folderSettings,
            hookSettings,
            deps
        } = parseArgs(
            schemaOrFolderName,
            settingsOrDepsOrSchema,
            depsOrSettingsOrFolderSettings,
            depsOrSettings,
            depsOrUndefined
        );
        const schemaIsFunction = typeof schema3 === 'function';
        const depsChanged = React5.useRef(false);
        const firstRender = React5.useRef(true);
        const _schema = useDeepMemo(() => {
            depsChanged.current = true;
            const s4 = typeof schema3 === 'function' ? schema3() : schema3;
            return folderName ? { [folderName]: folder(s4, folderSettings) } : s4;
        }, deps);
        const isGlobalPanel = !(
            hookSettings !== null &&
            hookSettings !== void 0 &&
            hookSettings.store
        );
        useRenderRoot(isGlobalPanel);
        const [store] = React5.useState(
            () =>
                (hookSettings === null || hookSettings === void 0
                    ? void 0
                    : hookSettings.store) || levaStore
        );
        const [initialData, mappedPaths] = React5.useMemo(
            () => store.getDataFromSchema(_schema),
            [store, _schema]
        );
        const [
            allPaths,
            renderPaths,
            onChangePaths,
            onEditStartPaths,
            onEditEndPaths
        ] = React5.useMemo(() => {
            const allPaths2 = [];
            const renderPaths2 = [];
            const onChangePaths2 = {};
            const onEditStartPaths2 = {};
            const onEditEndPaths2 = {};
            Object.values(mappedPaths).forEach(
                ({ path, onChange, onEditStart, onEditEnd, transient }) => {
                    allPaths2.push(path);
                    if (!!onChange) {
                        onChangePaths2[path] = onChange;
                        if (!transient) {
                            renderPaths2.push(path);
                        }
                    } else {
                        renderPaths2.push(path);
                    }
                    if (onEditStart) {
                        onEditStartPaths2[path] = onEditStart;
                    }
                    if (onEditEnd) {
                        onEditEndPaths2[path] = onEditEnd;
                    }
                }
            );
            return [
                allPaths2,
                renderPaths2,
                onChangePaths2,
                onEditStartPaths2,
                onEditEndPaths2
            ];
        }, [mappedPaths]);
        const paths = React5.useMemo(() => store.orderPaths(allPaths), [allPaths, store]);
        const values = useValuesForPath(store, renderPaths, initialData);
        const set = React5.useCallback(
            (values2) => {
                const _values = Object.entries(values2).reduce(
                    (acc, [p4, v4]) =>
                        Object.assign(acc, { [mappedPaths[p4].path]: v4 }),
                    {}
                );
                store.set(_values, false);
            },
            [store, mappedPaths]
        );
        const get = React5.useCallback(
            (path) => store.get(mappedPaths[path].path),
            [store, mappedPaths]
        );
        React5.useEffect(() => {
            const shouldOverrideSettings =
                !firstRender.current && depsChanged.current;
            store.addData(initialData, shouldOverrideSettings);
            firstRender.current = false;
            depsChanged.current = false;
            return () => store.disposePaths(paths);
        }, [store, paths, initialData]);
        React5.useEffect(() => {
            const unsubscriptions = [];
            Object.entries(onChangePaths).forEach(([path, onChange]) => {
                onChange(
                    store.get(path),
                    path,
                    _objectSpread2(
                        { initial: true, get: store.get },
                        store.getInput(path)
                    )
                );
                const unsub = store.useStore.subscribe(
                    (s4) => {
                        const input = s4.data[path];
                        const value = input.disabled ? void 0 : input.value;
                        return [value, input];
                    },
                    ([value, input]) =>
                        onChange(
                            value,
                            path,
                            _objectSpread2(
                                { initial: false, get: store.get },
                                input
                            )
                        ),
                    { equalityFn: shallow }
                );
                unsubscriptions.push(unsub);
            });
            return () => unsubscriptions.forEach((unsub) => unsub());
        }, [store, onChangePaths]);
        React5.useEffect(() => {
            const unsubscriptions = [];
            Object.entries(onEditStartPaths).forEach(([path, onEditStart]) =>
                unsubscriptions.push(store.subscribeToEditStart(path, onEditStart))
            );
            Object.entries(onEditEndPaths).forEach(([path, onEditEnd]) =>
                unsubscriptions.push(store.subscribeToEditEnd(path, onEditEnd))
            );
            return () => unsubscriptions.forEach((unsub) => unsub());
        }, [onEditStartPaths, onEditEndPaths, store]);
        if (schemaIsFunction) return [values, set, get];
        return values;
    }
    register(exports.LevaInputs.SELECT, select);
    register(exports.LevaInputs.IMAGE, image);
    register(exports.LevaInputs.NUMBER, number);
    register(exports.LevaInputs.COLOR, color);
    register(exports.LevaInputs.STRING, string);
    register(exports.LevaInputs.BOOLEAN, boolean);
    register(exports.LevaInputs.INTERVAL, interval);
    register(exports.LevaInputs.VECTOR3D, vector3d);
    register(exports.LevaInputs.VECTOR2D, vector2d);
    exports.Leva = Leva;
    exports.LevaPanel = LevaPanel;
    exports.LevaStoreProvider = LevaStoreProvider;
    exports.button = button;
    exports.buttonGroup = buttonGroup;
    exports.folder = folder;
    exports.levaStore = levaStore;
    exports.monitor = monitor;
    exports.useControls = useControls;
    exports.useCreateStore = useCreateStore;
    exports.useStoreContext = useStoreContext;
}));