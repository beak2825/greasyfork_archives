    // ==UserScript==
    // @name         lgx-tools
    // @namespace    http://tampermonkey.net/
    // @version      0.2.4.2
    // @description  允许删除页面的元素，往页面上放置项目
    // @author       lgx
    // @match        *://*/*
    // @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
    // @grant        none
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461021/lgx-tools.user.js
// @updateURL https://update.greasyfork.org/scripts/461021/lgx-tools.meta.js
    // ==/UserScript==
    // noinspection SpellCheckingInspection

    (function() {
        'use strict';

        if (!document.body) return
        document.head.appendChild(document.createElement('style'));
        document.head.lastChild.innerHTML = '.lgx-front-hover-block{position:fixed;background:#09f3;border:dashed 1px ' +
            '#06f9;transition:all .3s cubic-bezier(.68,-0.55,.27,1.55);z-index:2147483647}.lgx-front-hover-block>div-l' +
            'gx{position:absolute;border:1px dashed #f11a;background:#f553;transition:inherit}.lgx-front-hover-block>d' +
            'iv-lgx:hover{background:#f556}.lgx-ctrl-block-container{width:60px;height:60px;position:fixed;left:-30px;' +
            'bottom:-30px;border-radius:50%;z-index:2147483647}.lgx-ctrl-block{width:6px;height:6px;position:fixed;bac' +
            'kground:red;bottom:-6px;left:-6px;z-index:2147483647;cursor:pointer;transition:all .5s}.lgx-ctrl-block-co' +
            'ntainer:hover>.lgx-ctrl-block{left:18px;bottom:18px;rotate:765deg}@keyframes k{0%{left:-6px;bottom:-6px;r' +
            'otate:0}25%{left:0;bottom:0;rotate:191.25deg}50%{left:6px;bottom:6px;rotate:382.5deg}75%{left:12px;bottom' +
            ':12px;rotate:573.75deg}100%{left:18px;bottom:18px;rotate:765deg}}.lgx-front-hover-no-transition,.lgx-fron' +
            't-hover-no-transition>*{transition:none !important}@keyframes shake{0%{transform:translateX(0)}10%{transf' +
            'orm:translateX(-10px)}20%{transform:translateX(10px)}35%{transform:translateX(-10px)}55%{transform:transl' +
            'ateX(10px)}70%{transform:translateX(-10px)}100%{transform:translateX(0)}}.lgx-float-div{position:fixed;op' +
            'acity:.5;border:none;cursor:grab;z-index:2147483647;user-select:none}.lgx-float-div>.lgx-resize{content:"' +
            '";display:block;position:absolute}.lgx-float-div>*{user-select:none}.lgx-float-div>.lgx-col-resize{width:' +
            '6px;height:calc(100% - 6px);right:-3px;top:0;cursor:col-resize}.lgx-float-div>.lgx-row-resize{width:calc(' +
            '100% - 6px);height:6px;left:0;bottom:-3px;cursor:row-resize}.lgx-float-div>.lgx-nwse-resize{width:12px;he' +
            'ight:12px;right:-6px;bottom:-6px;cursor:nwse-resize}.lgx-float-div>.lgx-float-item{box-shadow:0 0 5px #00' +
            '05;width:100%;height:100%;display:block;font-size:14px}.lgx-floating-menu{transition:all .1s;width:100px;' +
            'padding:5px;opacity:.5;border-radius:5px;box-shadow:2px 2px 5px #0005;position:fixed;z-index:2147483647;b' +
            'ackground-color:#fff;user-select:none}.lgx-floating-menu ul{padding:0;margin:0;list-style:none}.lgx-float' +
            'ing-menu li:hover{background-color:#f2f2f2}.lgx-removed{display:none !important}.lgx-front-hover-block>sp' +
            'an{white-space:nowrap;border-radius:0 0 5px 0;padding:2px 6px;background-color:#fffc}.lgx-front-hover-blo' +
            'ck>span>span{color:#fff;text-shadow:0 0 2px #555,1px 0 5px #000;font-weight:bold}.selected-span{color:#fc' +
            'c !important;text-shadow:0 0 2px #500,1px 0 5px #500 !important}'

        const styleElement = document.createElement('style')
        document.head.appendChild(styleElement)
        let el, k = !1, x = 0, y = 0
        const that = document.createElement("div-lgx")
        const ctrl = document.createElement('div-lgx')
        const ctrlContainer = document.createElement('div-lgx')
        let removedElements = [], removedIndex = 0
        ctrlContainer.appendChild(ctrl);
        document.body.appendChild(ctrlContainer);

        ctrl.classList.add('lgx-ctrl-block');
        that.classList.add('lgx-front-hover-block');
        ctrlContainer.classList.add('lgx-ctrl-block-container');
        function mouseMoveHandler(ev) {
            if (ev.target?.classList.contains('undeletable')) {
                clearTimeout(mouseMoveHandler.timeout0)
                return
            }
            // if (el === (ev.target?.mock || ev.target)) return
            el = ev.target?.mock || ev.target

            that.classList[ ev.shiftKey ? 'add' : 'remove' ]('lgx-front-hover-no-transition')
            const fun1 = () => {
                for (const {style: s, l0, t0} of that.querySelectorAll('div-lgx')) {
                    [s.left, s.top, s.width, s.height] = [l0, t0, 0, 0].map(j => j.px)
                }
                const fun2 = () => {
                    const {left: l0, top: t0, height: h, width: w} =
                    el?.getBoundingClientRect() ?? {left: 0, top: 0, height: 0, width: 0}, s = that.style, arr = []
                    const fun3 = () => {
                        if (!el) return;
                        that.innerHTML = `<span><span>${el.tagName.toLocaleLowerCase()}</span>` + (el.id ? `<span>#${el.id}</span>` : '')
                            + (el.classList.length ? [...el.classList].map(i => `<span>.${i}</span>`).join('') : '') + '</span>'
                        that.selectedItem = -1
                        that.querySelectorAll('span').forEach(i => {
                            i.classList.add('undeletable');
                            i.addEventListener('click', ev => ev.stopPropagation());
                        });
                        that.items = [...that.querySelectorAll('span>span')]
                        for (const i of el?.children ?? []) {
                            if (i === that || i === ctrl) continue
                            const {left: l, top: t, right: r, bottom: b, height: h, width: w} = i.getBoundingClientRect()
                            const [dh, dw] = [document.documentElement.clientHeight, document.documentElement.clientWidth]
                            if (b < 0 || t > dh || l > dw || r < 0) continue
                            const d = document.createElement('div-lgx');
                            [d.mock, d.l0, d.t0, d.l, d.t, d.w, d.h] =
                                [i, l + w / 2 - l0, t + h / 2 - t0, l - l0, t - t0, w - 2, h - 2]
                            d.style = `left:${d.l0}px;top:${d.t0}px;width:0;height:0;z-index:-1`
                            that.appendChild(d)
                            arr.push(d)
                        }
                        const fun4 = () => {
                            for (const d of arr) {
                                [d.style.left, d.style.top, d.style.height, d.style.width] =
                                    [d.l, d.t, d.h, d.w].map(i => i.px)
                            }
                        }
                        ev.shiftKey ? fun4() : setTimeout(fun4, 30)
                    }
                    [s.left, s.top, s.height, s.width] = [l0, t0, h - 2, w - 2].map(i => i.px)
                    that.innerHTML = ''
                    if (ev.shiftKey) {
                        fun3()
                    } else {
                        clearTimeout(that.timeout)
                        that.timeout = setTimeout(fun3, 300)
                    }
                }

                if (ev.shiftKey) {
                    fun2()
                } else {
                    clearTimeout(mouseMoveHandler.timeout)
                    mouseMoveHandler.timeout = setTimeout(fun2, 300)
                }
            }
            if (ev.shiftKey) {
                fun1()
            } else {
                clearTimeout(mouseMoveHandler.timeout0)
                mouseMoveHandler.timeout0 = setTimeout(fun1, ev.target?.mock ? 500 : 0)
            }
        }

        ctrl.onclick = () => {
            k = !k
            ctrl.style.background = k ? 'green' : 'red'
            if (k) {
                document.body?.addEventListener('mousemove', mouseMoveHandler)
                that.style.left = x + 'px'
                that.style.top = y + 'px'
                that.style.width = '0px'
                that.style.height = '0px'
                that.innerHTML = ''
                document.body?.insertBefore(that, ctrlContainer)
                setTimeout(mouseMoveHandler, 20, new Event('mousemove'))
            } else {
                el = void 0
                that.remove()
                try { document.body?.removeEventListener('mousemove', mouseMoveHandler) } catch {}
            }
        }

        ctrl.addEventListener('contextmenu', ev => { ev.preventDefault(); console.clear() });

        window.addEventListener('mousemove', ev => {
            [x, y] = [ev.x, ev.y]
        })

        window.addEventListener('keydown', ev => {
            if (ev.key === 'Control') {
                that.style.display = 'none'
            }
        })

        window.addEventListener('keyup', ev => {
            if (ev.key === 'Control') {
                that.style.display = 'block'
            }
        })

        window.addEventListener('click', ev => {
            if (el?.classList.contains('undeletable')) return
            if (!ev.ctrlKey && k && el) {
                if (that.selectedItem === -1) {
                    el.classList.add('lgx-removed')
                    if (removedIndex < removedElements.length) {
                        removedElements = removedElements.slice(0, removedIndex)
                    }
                    removedElements.push([el])
                } else {
                    const els = [...document.querySelectorAll(that.items[that.selectedItem].innerText)]
                    els.forEach(el => el !== ctrl && el !== that && el.classList.add('lgx-removed'))
                    removedElements.push(els)
                }
                removedIndex++
            }
            that.style.left = x + 'px'
            that.style.top = y + 'px'
            that.style.width = '0px'
            that.style.height = '0px'
            that.innerHTML = ''
        })

        that.addEventListener('wheel', ev => {
            if (el === ctrl || el === document.body) return
            if (((that.lastWheel + 200) || 0) > +new Date()) return;
            that.lastWheel = +new Date();
            if (!ev.ctrlKey && k && el) {
                ev.preventDefault()
                if (ev.deltaY > 0) {
                    that.items[that.selectedItem++]?.classList.toggle('selected-span')
                    that.selectedItem = (that.selectedItem + 1) % (that.items.length + 1) - 1
                    that.items[that.selectedItem]?.classList.toggle('selected-span')
                }
                if (ev.deltaY < 0) {
                    that.items[that.selectedItem--]?.classList.toggle('selected-span')
                    that.selectedItem = (that.selectedItem + that.items.length + 2) % (that.items.length + 1) - 1
                    that.items[that.selectedItem]?.classList.toggle('selected-span')
                }
            }
        })

        ctrl.addEventListener('wheel', ev => {
            ev.preventDefault()
            if (((ctrl.lastWheel + 200) || 0) > +new Date()) return;
            ctrl.lastWheel = +new Date();
            if (ev.deltaY > 0 && removedIndex < removedElements.length) {
                removedElements[removedIndex++].forEach(i=>i.classList.add('lgx-removed'))
            }
            if (ev.deltaY < 0 && removedIndex > 0) {
                removedElements[--removedIndex].forEach(i=>i.classList.remove('lgx-removed'))
            }
        });

        // !--- img dropping handler ---! //

        ['drop', 'dragleave', 'dragover', 'dragenter'].forEach(
            i => document.addEventListener(i, e => e.preventDefault())
        )

        const floatingContainer = document.createElement('div-lgx')
        document.body.insertBefore(floatingContainer, ctrlContainer)

        Array( Number, String ).forEach(
            i => Object.defineProperty(i.prototype, 'px', {
                get() { return this + 'px' }
            })
        )

        Object.defineProperties(HTMLElement.prototype, {
            timeout: { value: 0, writable: true },
            width:  { get() { return parseFloat(this.style.width ) || this.clientWidth } },
            height: { get() { return parseFloat(this.style.height) || this.clientHeight } },
            left:   { get() { return parseFloat(this.style. left ) || window.innerWidth - parseFloat(this.style.width) - parseFloat(this.style.right) || this.offsetLeft } },
            right:  { get() { return parseFloat(this.style.right ) || window.innerWidth - parseFloat(this.style.width) - parseFloat(this.style.left) || window.innerWidth - this.clientWidth - this.offsetLeft } },
            top:    { get() { return parseFloat(this. style. top ) || window.innerHeight - parseFloat(this.style.height) - parseFloat(this.style.bottom) || this.offsetTop } },
            bottom: { get() { return parseFloat(this.style.bottom) || window.innerHeight - parseFloat(this.style.height) - parseFloat(this.style.top) || window.innerHeight - this.offsetTop - this.clientHeight } },
            item:   { get() {
                    const value = this.querySelector('.lgx-float-item')
                    Object.defineProperty(this, 'item', { value })
                    return value
                }, configurable: true },
            makeScaleable: {
                value() {
                    let x, y, delta
                    Object.defineProperties(this, {
                        // The method 'makeScaleable' is a once-call-method, once it has been called, it will be removed.
                        makeScaleable: { value: void 0 },
                        // scalingCoef: scaling coefficient
                        // The pointer closer to the center of this div element, the coefficient bigger.
                        scalingCoef: {
                            get() {
                                const d = Math.sqrt(
                                    Math.pow(x - this.left - this.width / 2, 2)
                                    + Math.pow(y - this.top - this.height / 2, 2)
                                )
                                const h = this.height, w = this.width
                                const r = Math.sqrt(h ** 2 + w ** 2) / 2
                                const v = (1 - d / r) * .2
                                return { x: w * v * delta, y: h * v * delta }
                            }
                        },
                        // pperc: the percentage of the location of the pointer in this div element
                        // e.g. coordinate of the pointer in this div is (2, 3), and the size of this div is (5, 6),
                        //      then the percentage (pperc) is { left: 2 / 5, right: 3 / 5, top: 1 / 2, bottom: 1 / 2 }
                        pperc: {
                            get() {
                                const l = (x - this.left) / this.width,
                                    t = (y - this.top) / this.height
                                return { left: l, right: 1 - l, top: t, bottom: 1 - t }
                            }
                        }
                    })
                    this.onwheel = ev => {
                        [ x, y, delta ] = [ ev.x, ev.y, -ev.deltaY / 114 ]
                        ev.preventDefault()
                        const coef = this.scalingCoef, pperc = this.pperc
                        const nw = this.width + coef.x, nh = this.height + coef.y
                        if (Math.max(nw, nh) > 3000 || Math.min(nw, nh) < 20) {
                            if (!this.onwheel.flag) {
                                this.onwheel.flag = true
                                this.item.style.animation = 'shake .2s forwards'
                                setTimeout(() => {
                                    this.item.style.animation = ''
                                    this.onwheel.flag = false
                                }, 250)
                            }
                            return
                        }
                        clearTimeout(this.onwheel.timeout)
                        if (!this.onwheel.running) {
                            this.onwheel.running = true
                            this.transition = this.style.transition
                            this.style.transition = 'all .1s'
                        }
                        this.style[ this.style.left ? 'left' : 'right' ] = limit(
                            this.style.left ? x - pperc.left * (this.width + coef.x) : window.innerWidth - x - pperc.right * (this.width + coef.x),
                            this.scope?.left ?? 0, this.scope?.right ?? window.innerWidth - this.width).toFixed(2) + 'px'
                        this.style[ this.style.top ? 'top' : 'bottom' ] = limit(
                            this.style.top ? y - pperc.top * (this.height + coef.y) : window.innerHeight - y - pperc.bottom * (this.height + coef.y),
                            this.scope?.top ?? 0, this.scope?.bottom ?? window.innerHeight - this.height).toFixed(2) + 'px'
                        this.style.width = (this.width + coef.x).toFixed(2) + 'px'
                        this.style.height = (this.height + coef.y).toFixed(2) + 'px'
                        this.onwheel.timeout = setTimeout(() => {
                            this.onwheel.running = false
                            this.style.transition = this.transition
                            this.transition = ''
                        }, 100)
                    }
                    this.ondblclick = ev => {
                        [ x, y, delta ] = [ ev.x, ev.y, 0 ]
                        clearTimeout(this.onwheel?.timeout)
                        if (this.onwheel && !this.onwheel.running) {
                            this.onwheel.running = true
                            this.transition = this.style.transition
                            this.style.transition = 'all .1s'
                        }
                        const pperc = this.pperc
                        this.style[ this.style.left ? 'left' : 'right' ] = limit(
                            this.style.left ? x - pperc.left * this.originalWidth : window.innerWidth - x - pperc.right * this.originalWidth,
                            this.scope?.left ?? 0, this.scope?.right ?? window.innerWidth - this.width).toFixed(2) + 'px'
                        this.style[ this.style.top ? 'top' : 'bottom' ] = limit(
                            this.style.top ? y - pperc.top * this.originalHeight : window.innerHeight - y - pperc.bottom * this.originalHeight,
                            this.scope?.top ?? 0, this.scope?.bottom ?? window.innerHeight - this.height).toFixed(2) + 'px'
                        this.style.width = this.originalWidth + 'px'
                        this.style.height = this.originalHeight + 'px'
                        this.onwheel && (this.onwheel.timeout = setTimeout(() => {
                            this.onwheel.running = false
                            this.style.transition = this.transition
                            this.transition = ''
                        }, 100))
                    }
                },
                configurable: true
            },
            makeResizeable: {
                value() {
                    // The method 'makeResizeable' is a once-call-method, once it has been called, it will be removed.
                    Object.defineProperty(this, 'makeResizeable', { value: void 0 })
                    const [ rowResizeBar, colResizeBar, nwseResizeBlock ] = [ document.createElement('div-lgx'),
                        document.createElement('div-lgx'), document.createElement('div-lgx') ]
                    rowResizeBar.className = 'lgx-resize lgx-row-resize'
                    colResizeBar.className = 'lgx-resize lgx-col-resize'
                    nwseResizeBlock.className = 'lgx-resize lgx-nwse-resize'
                    this.append(rowResizeBar, colResizeBar, nwseResizeBlock)

                    Object.defineProperties(this, {
                        originalHeight: { value: this.clientHeight },
                        originalWidth: { value: this.clientWidth }
                    })

                    rowResizeBar.onmousedown = e => {
                        ev.stopPropagation()
                        if (rowResizeBar.ondblclick.flag || e.button !== 0 || this.onwheel?.running) return
                        rowResizeBar.onmousedown.flag = true
                        const height = this.clientHeight, s = this.style, t = 'transform'
                        // 是否上下翻转
                        rowResizeBar.onmousedown.reversed = (s[t] === 'scaleY(-1)' || s[t] === 'scale(-1)') && (s.scale || 1) > 0

                        const rowResize = ev => {
                            let h = height + (rowResizeBar.onmousedown.reversed ? e.y - ev.y : ev.y - e.y)

                            if (rowResizeBar.onmousedown.reversed ? h > 0 : h < 0) {
                                if (this.style.bottom === '') {
                                    s[t] = s[t] === 'scaleX(-1)' ? 'scale(-1)' : 'scaleY(-1)'
                                    this.style.bottom = window.innerHeight - this.offsetTop + 'px'
                                    this.style.top = ''
                                }
                            } else {
                                if (this.style.top === '') {
                                    s[t] = s[t] === 'scale(-1)' ? 'scaleX(-1)' : s[t] === 'scaleY(-1)' ? '' : s[t]
                                    this.style.top = this.offsetTop + this.clientHeight + 'px'
                                    this.style.bottom = ''
                                }
                            }

                            if (h > 2) {
                                this.style.height = h + 'px'
                            } else if (h >= -2) {
                                this.style.height = '2px'
                            } else {
                                this.style.height = -h + 'px'
                            }
                        }, rowRes_ = e => {
                            if (e.button !== 0) return
                            styleElement.innerHTML = ''
                            const t = this.style.transform
                            rowResizeBar.onmousedown.flag = false
                            nwseResizeBlock.style.cursor = t === 'scaleX(-1)' || t === 'scaleY(-1)' ? 'nesw-resize' : ''
                            try {
                                window.removeEventListener('mousemove', rowResize)
                                window.removeEventListener('mouseup', rowRes_)
                            } catch {}
                        }
                        styleElement.innerHTML = '*{cursor:row-resize !important}'
                        window.addEventListener('mousemove', rowResize)
                        window.addEventListener('mouseup', rowRes_)
                    }
                    rowResizeBar.oncontextmenu = ev => {
                        ev.stopPropagation()
                        ev.preventDefault()
                        if (rowResizeBar.oncontextmenu.flag || rowResizeBar.onmousedown.flag || this.onwheel?.running) return
                        rowResizeBar.oncontextmenu.flag = true

                        const oldT = this.style.transition
                        if (!ev.transition) {
                            this.style.transition = 'height .1s ease-out, top .1s ease-out, bottom .1s ease-out'
                        }
                        setTimeout(() => {
                            this.style.transition = oldT
                            rowResizeBar.oncontextmenu.flag = false
                        }, 100)

                        this.style.height = this.originalHeight + 'px'
                        this.style[ this.style.top ? 'top' : 'bottom' ] =
                            limit(this.style.top ? this.offsetTop : window.innerHeight - this.clientHeight - this.offsetTop,
                                this.scope?.top ?? 0, this.scope?.bottom ?? window.innerHeight - this.clientHeight) + 'px'
                    }
                    rowResizeBar.ondblclick = ev => {
                        ev.stopPropagation()
                        if (rowResizeBar.ondblclick.flag || this.onwheel?.running) return
                        rowResizeBar.ondblclick.flag = true
                        const oldT = this.style.transition
                        if (!ev.transition) {
                            this.style.transition = 'height .1s ease-out, top .1s ease-out, bottom .1s ease-out'
                        }
                        setTimeout(() => {
                            this.style.transition = oldT
                            rowResizeBar.ondblclick.flag = false
                        }, 100)

                        const h = this.style.transform === 'scaleY(-1)' || this.style.transform === 'scale(-1)'
                            ? this.offsetTop + this.clientHeight : window.innerHeight - this.offsetTop
                        this.style.height = h + 'px'
                        this.style[ this.style.top ? 'top' : 'bottom' ] =
                            limit(this.style.top ? this.offsetTop : window.innerHeight - this.clientHeight - this.offsetTop,
                                this.scope?.top ?? 0, this.scope?.bottom ?? window.innerHeight - this.clientHeight) + 'px'
                    }

                    colResizeBar.onmousedown = e => {
                        e.stopPropagation()
                        if (colResizeBar.ondblclick.flag || e.button !== 0 || this.onwheel?.running) return
                        colResizeBar.onmousedown.flag = true
                        const width = this.clientWidth, s = this.style, t = 'transform'
                        // 是否左右翻转
                        colResizeBar.onmousedown.reversed = (s[t] === 'scaleX(-1)' || s[t] === 'scale(-1)') && (s.scale || 1) > 0

                        const colResize = ev => {
                            let w = width + (colResizeBar.onmousedown.reversed ? e.x - ev.x : ev.x - e.x)

                            if (colResizeBar.onmousedown.reversed ? w > 0 : w < 0) {
                                if (this.style.right === '') {
                                    s[t] = s[t] === 'scaleY(-1)' ? 'scale(-1)' : 'scaleX(-1)'
                                    this.style.right = window.innerWidth - this.offsetLeft + 'px'
                                    this.style.left = ''
                                }
                            } else {
                                if (this.style.left === '') {
                                    s[t] = s[t] === 'scale(-1)' ? 'scaleY(-1)' : s[t] === 'scaleX(-1)' ? '' : s[t]
                                    this.style.left = this.offsetLeft + this.clientWidth + 'px'
                                    this.style.right = ''
                                }
                            }

                            if (w > 2) {
                                this.style.width = w + 'px'
                            } else if (w >= -2) {
                                this.style.width = '2px'
                            } else {
                                this.style.width = -w + 'px'
                            }

                        }, colRes_ = e => {
                            if (e.button !== 0) return
                            styleElement.innerHTML = ''
                            const t = this.style.transform
                            colResizeBar.onmousedown.flag = false
                            nwseResizeBlock.style.cursor = t === 'scaleX(-1)' || t === 'scaleY(-1)' ? 'nesw-resize' : ''
                            try {
                                window.removeEventListener('mousemove', colResize)
                                window.removeEventListener('mouseup', colRes_)
                            } catch {}
                        }
                        styleElement.innerHTML = '*{cursor:col-resize !important}'
                        window.addEventListener('mousemove', colResize)
                        window.addEventListener('mouseup', colRes_)
                    }
                    colResizeBar.oncontextmenu = ev => {
                        ev.stopPropagation()
                        ev.preventDefault()
                        if (colResizeBar.oncontextmenu.flag || colResizeBar.onmousedown.flag || this.onwheel?.running) return
                        colResizeBar.oncontextmenu.flag = true

                        const oldT = this.style.transition
                        if (!ev.transition) {
                            this.style.transition = 'width .1s ease-out, left .1s ease-out, right .1s ease-out'
                        }
                        setTimeout(() => {
                            this.style.transition = oldT
                            colResizeBar.oncontextmenu.flag = false
                        }, 100)

                        this.style.width = this.originalWidth + 'px'
                        this.style[ this.style.left ? 'left' : 'right' ] =
                            limit(this.style.left ? this.offsetLeft : window.innerWidth - this.clientWidth - this.offsetLeft,
                                this.scope?.left ?? 0, this.scope?.right ?? window.innerWidth - this.clientWidth) + 'px'
                    }
                    colResizeBar.ondblclick = ev => {
                        ev.stopPropagation()
                        if (colResizeBar.ondblclick.flag || this.onwheel?.running) return
                        colResizeBar.ondblclick.flag = true
                        const oldT = this.style.transition
                        if (!ev.transition) {
                            this.style.transition = 'width .1s ease-out, left .1s ease-out, right .1s ease-out'
                        }
                        setTimeout(() => {
                            this.style.transition = oldT
                            colResizeBar.ondblclick.flag = false
                        }, 100)

                        const w = this.style.transform === 'scaleX(-1)' || this.style.transform === 'scale(-1)'
                            ? this.offsetLeft + this.clientWidth : window.innerWidth - this.offsetLeft
                        this.style.width = w + 'px'
                        this.style[ this.style.left ? 'left' : 'right' ] =
                            limit(this.style.left ? this.offsetLeft : window.innerWidth - this.clientWidth - this.offsetLeft,
                                this.scope?.left ?? 0, this.scope?.right ?? window.innerWidth - this.clientWidth) + 'px'
                    }

                    nwseResizeBlock.onmousedown = e => {
                        rowResizeBar.onmousedown(e)
                        colResizeBar.onmousedown(e)
                        const nwseResize = () => {
                            const t = this.style.transform
                            styleElement.innerHTML = t === 'scaleX(-1)' || t === 'scaleY(-1)'
                                ? '*{cursor:nesw-resize !important}' : '*{cursor:nwse-resize !important}'
                        }, nwseRes_ = () => {
                            styleElement.innerHTML = ''
                            try {
                                window.removeEventListener('mousemove', nwseResize)
                                window.removeEventListener('mouseup', nwseRes_)
                            } catch {}
                        }
                        nwseResize()
                        window.addEventListener('mousemove', nwseResize)
                        window.addEventListener('mouseup', nwseRes_)
                    }
                    nwseResizeBlock.oncontextmenu = e => {
                        const oldT = this.style.transition
                        e.transition = true
                        this.style.transition = 'all .1s ease-out'
                        rowResizeBar.oncontextmenu(e)
                        colResizeBar.oncontextmenu(e)
                        setTimeout(() => {
                            this.style.transition = oldT
                        }, 100)
                    }
                    nwseResizeBlock.ondblclick = e => {
                        const oldT = this.style.transition
                        e.transition = true
                        this.style.transition = 'all .1s ease-out'
                        rowResizeBar.ondblclick(e)
                        colResizeBar.ondblclick(e)
                        setTimeout(() => {
                            this.style.transition = oldT
                        }, 100)
                    }
                },
                configurable: true
            },
            makeMoveable: {
                value(scope) {
                    let dx = 0, dy = 0
                    scope = scope || new Scope({ left: 0, right: () => window.innerWidth - this.width, top: 0, bottom: () => window.innerHeight - this.height });
                    this.scope = scope
                    Object.defineProperty(this, 'makeMoveable', { value: void 0 })
                    const mousemoveF = e => {
                        this.style[ this.style.left ? 'left' : 'right' ] = limit(this.style.left ? dx + e.x : window.innerWidth - e.x - dx - this.clientWidth, scope.left, scope.right) + 'px'
                        this.style[ this.style.top ? 'top' : 'bottom' ] = limit(this.style.top ? dy + e.y : window.innerHeight - e.y - dy - this.clientHeight, scope.top, scope.bottom) + 'px'
                    }, mouseupF = () => {
                        this.style.cursor = 'grab'
                        styleElement.innerHTML = ''
                        try {
                            window.removeEventListener('mousemove', mousemoveF)
                        } catch {}
                    }
                    this.onmousedown = ev => {
                        this.parentElement.appendChild(this)
                        if (ev.buttons !== 1) return
                        styleElement.innerHTML = '*{cursor:grabbing !important}';
                        [ dx, dy ] = [ this.offsetLeft - ev.x, this.offsetTop - ev.y ]
                        this.style.cursor = 'grabbing'
                        window.addEventListener('mousemove', mousemoveF)
                        window.addEventListener('mouseup', mouseupF, { once: true })
                    }
                    this.oncontextmenu = e => {
                        e.preventDefault()
                        this.oncontextmenu = e => e.preventDefault()
                        mouseupF()
                        this.style.transition = 'all .2s cubic-bezier(.68,-0.55,.5,.5)'
                        this.style.scale = (this.style.scale || 1) / 2 + ''
                        this.style.opacity = '0'
                        setTimeout(() => this.remove(), 250)
                    }
                },
                configurable: true
            }
        })

        class Scope {
            constructor(o) {
                const props = {}, mapper = { 'function': 'get', 'number': 'value' };
                [ 'left', 'right', 'top', 'bottom' ].forEach(i => Object.keys(mapper)
                    .includes(typeof o?.[i]) && (props[i] = { [ mapper[typeof o[i]] ]: o[i] }))
                Object.defineProperties(this, props)
            }
        }

        // noinspection JSUnusedGlobalSymbols
        class ItemCreater {

            image(x, y, data) {
                const img = document.createElement('img'),
                    div = document.createElement('div-lgx')
                img.classList.add('lgx-float-item')
                div.classList.add('lgx-float-div')
                div.appendChild(img)

                let w, h
                img.draggable = false
                console.log(data)
                img.src = typeof data === 'string' ? data : URL.createObjectURL(data)
                img.onload = () => {
                    // init
                    [w, h] = [img.width, img.height];
                    [div.style.left, div.style.top, div.style.width, div.style.height] =
                        [x - w / 4 + 'px', y - h / 4 + 'px', w / 2 + 'px', h / 2 + 'px']
                    div.style.transition = 'all .3s cubic-bezier(.5,.5,.27,1.55)'
                    setTimeout(() => {
                        [div.style.width, div.style.height] = [w + 'px', h + 'px']
                        div.style.left = limit(0, x - w / 2, window.innerWidth - w) + 'px'
                        div.style.top = limit(0, y - h / 2, window.innerHeight - h) + 'px'
                        div.style.opacity = '1'
                    }, 50)
                    // add event handler
                    setTimeout(() => {
                        const scope = new Scope({
                            left:   () => -div.width / 2,
                            top:    () => -div.height / 2,
                            right:  () => window.innerWidth - div.width / 2,
                            bottom: () => window.innerHeight - div.height / 2
                        })
                        div.style.transition = ''
                        div.makeScaleable()
                        div.makeResizeable()
                        div.makeMoveable(scope)
                    }, 400)
                }
                return div
            }

            audio() {

            }

            video() {

            }

            text() {

            }

            file() {

            }

            link(x, y, url) {
                console.log(url)
            }

            contentmenu(x, y, handlers) {
                const menu = document.createElement('div-lgx');
                Object.defineProperty(menu, 'close', {
                    value(ev) {
                        function targetInMenu(target) {
                            if (!target) return false;
                            if (target === menu) return true;
                            return targetInMenu(target.parentElement);
                        }
                        if (targetInMenu(ev?.target) && this !== menu) return false;

                        [ [ menu, 'click' ], [ window, 'mousedown' ], [ window, 'keydown' ] ].forEach(ls => {
                            try { ls[0].removeEventListener(ls[1], menu.close) } catch {} });
                        menu.style.opacity = '.5';
                        menu.style.top = y + 20 + 'px';
                        setTimeout(() => menu.remove(), 100);
                        return true;
                    }
                });
                menu.className = 'lgx-floating-menu';
                menu.style = `left:${x + 110 > window.innerWidth ? x - 110 : x}px;top:${y - 20}px`;
                setTimeout(() => {
                    menu.style.opacity = '1';
                    menu.style.top = y + 'px';
                }, 100);
                menu.innerHTML = '<ul>' + Object.keys(handlers).map(h => h !== '未知类型' ? `<li>${h}</li>` :
                    `<li title="由于同源策略禁止读取该文件所在地址的远程资源，无法得知该文件的类型">${h}</li>`).join('') + '</ul>';
                [ ...menu.children[0].children ].forEach(c => (c.onclick = handlers[c.innerText]));
                menu.addEventListener("click", menu.close);
                window.addEventListener("mousedown", menu.close);
                window.addEventListener("keydown", menu.close);
                floatingContainer.appendChild(menu);
            }

        }

        const creater = new ItemCreater

        Object.defineProperty(DataTransfer.prototype, 'toElements', {
            value({ x, y }) {
                const retArr = []
                if (this.files.length) {
                    if (this.files.length > 20) {
                        return Promise.reject('There are too many files (> 20)')
                    }
                    for (const f of this.files) {
                        console.log(f.name, f.type, URL.createObjectURL(f))
                        const item = creater[f.type.substring(0, f.type.indexOf('/'))]?.(x, y, f)
                        item && retArr.push(item)
                    }
                    return Promise.resolve(retArr)
                } else {
                    return new Promise(resolve => {

                        function getWebFileType(url) {
                            if (!url) return null;
                            return new Promise((res, rej) => {
                                try {
                                    const req = new XMLHttpRequest();
                                    req.open('GET', url, false);
                                    req.send(null);
                                    res(req.getResponseHeader('content-type'));
                                } catch {
                                    // inference file type image
                                    const img = new Image();
                                    img.src = url;
                                    img.crossorigin = "Anonymous";
                                    img.style = 'position:absolute;left:99999px;top:999999px';
                                    img.onerror = () => { rej(); img.remove() };
                                    img.onload = () => { res('image/'); img.remove() };
                                    document.body.appendChild(img);
                                }
                            });
                        }

                        let contentTypeStart;
                        const that = this,
                              url = that.getData("application/x-moz-file-promise-url").replace('http:', 'https:')
                        || that.getData("text/x-moz-url-data").replace('http:', 'https:');
                        // console.log(that.types.reduce((a, b) => (a[b] = that.getData(b)) ?? a, {}));
                        function handleFile() {
                            console.log('handle file', contentTypeStart);
                            const elem = creater[contentTypeStart]?.(x, y, url);
                            resolve(elem ? [ elem ] : []);
                        }

                        function handleLink() {
                            console.log('handle link')
                            console.log(that)
                            const url = that.getData("text/x-moz-url-data").replace('http:', 'https:'),
                                elem = creater.link(x, y, url)
                            resolve(elem ? [ elem ] : []);
                        }

                        getWebFileType(url).then(contentType => {

                            contentTypeStart = contentType?.substring(0, contentType.indexOf('/')) ?? 'file';
                            const flagFile = this.types.includes("application/x-moz-file-promise-url"),
                                  flagLink = that.types.includes("text/x-moz-url-data"),
                                  type = { 'image': '图片', 'audio': '音频', 'vedio': '视频', 'text': '文本' }[contentTypeStart]
                            || '未知类型';

                            if (flagFile && flagLink) {
                                handleFile();
                                return;
                                creater.contentmenu(x, y, { [type]: handleFile, '链接': handleLink });
                            } else if (flagFile) {
                                handleFile();
                            } else {
                                handleLink();
                            }
                        });
                    });

                }
            },
        })

        window.addEventListener('drop', ev => {
            ev.preventDefault()
            ev.dataTransfer.toElements(ev).then(
                elements => elements.forEach(el => floatingContainer.appendChild(el)))
        })

        window.addEventListener('resize', () => {
            for (const div of floatingContainer.children) {
                div.style[ div.style.left ? 'left' : 'right' ] =
                    limit(div.style.left ? div.offsetLeft : window.innerWidth - div.clientWidth - div.offsetLeft,
                        div.scope?.left ?? 0, div.scope?.right ?? window.innerWidth - div.clientWidth) + 'px'
                div.style[ div.style.top ? 'top' : 'bottom' ] =
                    limit(div.style.top ? div.offsetTop : window.innerHeight - div.clientHeight - div.offsetTop,
                        div.scope?.top ?? 0, div.scope?.bottom ?? window.innerHeight - div.clientHeight) + 'px'
            }
        })

        function limit(value, min, max) {
            return Math.min(Math.max(value, min), max)
        }

        let flagI = 1;
        setInterval(() => {
            if (document.body.lastChild !== ctrlContainer) {
                document.body.appendChild(ctrlContainer);
                document.body.insertBefore(floatingContainer, ctrlContainer)
                if (k) {
                    document.body.insertBefore(that, ctrlContainer)
                }
                flagI = Math.max(100, flagI + 1)
            }
        }, 10000 / flagI)
        const lgxBlocks = [ ctrl, that, ctrlContainer, floatingContainer, document.body ];
        lgxBlocks.forEach(i => i.classList.add('undeletable'));

    })();
