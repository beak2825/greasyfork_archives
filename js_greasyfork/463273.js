// ==UserScript==
// @name         WD-40
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  浮动点击的元素（致敬清华源23年愚人节彩蛋）>_<
// @author       insorker
// @match        http://*/*
// @match        https://*/*
// @note         2023.04-09-V0.3.1 作为替换的空白元素不会发生WD-40效应
// @note         2023.04-09-V0.3.0 jQuery使用国内cdn
// @note         2023.04-05-V0.2.0 结构修改，不影响使用
// @note         2023.04-04-V0.1.0 堂堂完成！
// @grant        GM_addStyle
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js
// @downloadURL https://update.greasyfork.org/scripts/463273/WD-40.user.js
// @updateURL https://update.greasyfork.org/scripts/463273/WD-40.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class WDComponent {
        reposition(replaceElem, parentElem) {
            replaceElem.attr("WD-40-disable", "true");
            this.elem.replaceWith(replaceElem);
            parentElem.append(this.elem);
        }
    }

    class WDBox extends WDComponent {
        constructor(elem) {
            super();
            const offset = elem.offset();
            const width = elem.width();
            const height = elem.height();
            this.body = Matter.Bodies.rectangle(offset.left + width / 2, (offset === null || offset === void 0 ? void 0 : offset.top) + height / 2, width, height);
            this.elem = elem;
            // restyle element with absolute position
            this.elem.css({
                'position': 'absolute',
                'top': offset.top,
                'left': offset.left,
                'width': width,
                'height': height,
                'background': 'hsl(0, 0%, 96%)',
                'border-radius': '4px',
                'box-shadow': '0px 0px 10px rgba(0, 0, 0, 25%)'
            });
            // replace the original element with empty div
            // move the original element to body
            let replaceElem = $('<div></div>').css({
                'width': width,
                'height': height,
            });
            let parentElem = $('body');
            this.reposition(replaceElem, parentElem);
        }
        render() {
            const { x, y } = this.body.position;
            const angle = this.body.angle;
            this.elem.css({
                'top': `${y - this.elem.height() / 2}px`,
                'left': `${x - this.elem.width() / 2}px`,
                'transform': `rotate(${angle}rad)`
            });
        }
    }

    class WD40 {
        constructor(config) {
            this.engine = config.engine;
            this.selector = config.selector;
            this.boxes = [];
            this.setup();
        }
        setup() {
            let engine = this.engine;
            let boxes = this.boxes;
            $('body').on('click', this.selector, function (event) {
                event.stopPropagation();
                // prevent multiple click on same element
                for (let box of boxes) {
                    if (box.elem[0] == this) {
                        return;
                    }
                }
                if ($(this).attr("WD-40-disable")) {
                    return;
                }
                let box = new WDBox($(this));
                Matter.Body.applyForce(box.body, { x: event.pageX, y: event.pageY }, { x: Math.random() / 20, y: Math.random() / 20 });
                boxes.push(box);
                Matter.Composite.add(engine.world, [box.body]);
            });
        }
        render() {
            for (let box of this.boxes) {
                box.render();
            }
        }
    }

    // module aliases
    var Engine = Matter.Engine, Render = Matter.Render, Runner = Matter.Runner, Composite = Matter.Composite;
    // create an engine
    var engine = Engine.create();
    engine.gravity.y = -0.04;
    // create a renderer
    let render = Render.create({
        // element: document.body,
        engine: engine,
        options: {
            width: $(window).width(),
            height: $(window).height(),
        }
    });
    // create WDBox
    let wd40 = new WD40({
        engine: engine,
        selector: 'div, li, td'
    });
    let ground = Matter.Bodies.rectangle($(window).width() / 2, -50, $(window).width(), 100, { isStatic: true });
    // add all of the bodies to the world
    Composite.add(engine.world, [ground]);
    // run the renderer
    Render.run(render);
    // create runner
    var runner = Runner.create();
    // run the engine
    Runner.run(runner, engine);
    function step() {
        wd40.render();
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

})();