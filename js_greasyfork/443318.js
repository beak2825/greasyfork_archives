// ==UserScript==
// @name        element miner
// @namespace   Violentmonkey Scripts
// @match       *
// @include     *
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant       none
// @version     1.0
// @author      ec50n9
// @description 2022/4/11 20:00:18
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/443318/element%20miner.user.js
// @updateURL https://update.greasyfork.org/scripts/443318/element%20miner.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

// 道具
function Prop(crane, type = 'bomb') {
    this.crane = crane;
    this.countDown = 200;
    this.size = 32;
    this.deg = 0;
    this.color = 'red';
    this.zIndex = 0;
    this.WAGGLE_DEG = 15;
    this.SCORES = {
        bomb: -100,
        flower: 50,
        diamond: 100
    }
    this.TYPES = {
        bomb: '💣',
        flower: '🌹',
        diamond: '💎'
    };
    this.BOOM_TEXTS = {
        bomb: '💥BOOM!!!',
        flower: '❤️HEY!!!',
        diamond: '💰HOOO!!!!'
    }
    this.type = (type in this.TYPES) ? type : 'bomb';
    this.score = this.SCORES[this.type];
    this.text = this.TYPES[this.type];
    this.boomText = this.BOOM_TEXTS[this.type];
    this.element = $(`<div>${this.TYPES[this.type]}</div>`).css({
        'position': 'fixed',
        'left': `${crane.captured.element.offset().left + crane.captured.element.width() / 2}px`,
        'top': `${crane.captured.element.offset().top + crane.captured.element.height() / 2}px`,
        'white-space': 'nowrap',
        'color': this.color,
        'font-size': `${this.size}px`,
        'transform': `translate(-50%, -50%) rotate(${this.deg}deg)`,
        'z-index': this.zIndex
    });
}
Prop.prototype.appendTo = function (target) {
    target.prepend(this.element);
}

// 抓手
function Crane(left = 0, top = 0) {
    // 得分
    this.score = 0;
    this.porpList = [];
    // 位置
    this.position = {
        left,
        top
    };
    // 角度
    this.deg = -180;
    // 绳子
    this.rope = {
        width: 10,
        length: 50,
        step: 2,
        DEFAULT_STEP: 2,
        DEFAULT_LEN: 50,
        MIN_LEN: 0,
        MAX_LEN: 1000
    };
    // 钩子
    this.hock = {
        src: 'https://s3.bmp.ovh/imgs/2022/04/12/1c986b60d886b9dd.png',
        src_default: 'https://s3.bmp.ovh/imgs/2022/04/12/1c986b60d886b9dd.png',
        src_capture: 'https://s3.bmp.ovh/imgs/2022/04/12/fd3fdb4cf18eb9f2.png'
    }
    // 当前状态
    this.cur_status = 0;
    this.STATUS = {
        static: 0,
        elongating: 1,
        reducing: 2,
        inRecovery: 3
    };
    // 被捕获
    this.captured = {
        element: null,
        dis_left: 0,
        dis_top: 0
    };
    // 操作台
    this.ele_console = $('<div></div>').css({
        'position': 'fixed',
        'left': `${this.position.left}px`,
        'top': `${this.position.top}px`,
        // 'transform': 'translate(-50%, -50%)',
        'width': '10em',
        'height': '10em',
        'background-image': 'url(https://s3.bmp.ovh/imgs/2022/04/13/ebbf40101c3c1038.png)',
        'background-size': '100% auto',
        'overflow': 'visible',
        'z-index': '997'
    });
    // 操作台图片
    this.ele_console_img = $('<img src="https://s3.bmp.ovh/imgs/2022/04/13/3cf047c6fc4f1a33.png"/>').css({
    position: 'absolute', 
    bottom: '0',
    left: '20%',
    width: '60%',
    });
    this.ele_console.append(this.ele_console_img);
    // 抓手容器
    this.ele_hock_container = $('<div></div>').css({
        'margin-top': '90%',
        'transform-origin': 'top center',
        'transform': `rotate(${this.deg}deg)`,
        'z-index': '999'
    });
    this.ele_console.append(this.ele_hock_container);
    // 分数
    this.ele_score = $(`<div>${this.score}</div>`).css({
        'position': 'absolute',
        'top': '-1.5em',
        'font-size': '1em',
        'color': 'green',
        'white-space': 'nowrap'
    });
    this.ele_console.prepend(this.ele_score);
    // 绳子
    this.ele_rope = $('<div></div>').css({
        'width': `${this.rope.width}px`,
        'height': `${this.rope.length}px`,
        'margin': '0 auto',
        'background-image': 'url(https://s3.bmp.ovh/imgs/2022/04/13/65f0a51cebe9be16.png)',
        'background-size': '100% auto',
        'background-repeat': 'no-repeat repeat'
    });
    this.ele_hock_container.append(this.ele_rope);
    // 抓手
    this.ele_hock = $(`<div></div>`).css({
        'width': '4em',
        'height': '4em',
        'margin': '0 auto',
        'margin-top': '-4px'
    });
    this.ele_hock_img = $(`<img style="width:inherit; height:inherit; object-fit:contain;"
                            src="${this.hock.src}">`);
    this.ele_hock.append(this.ele_hock_img);
    this.ele_hock_container.append(this.ele_hock);
    // 点击事件
    let that = this;
    this.ele_console.click(function () {
        if (that.status == that.STATUS.elongating) {
            that.catch();
        } else {
            that.elongate();
        }
    });
}

// 添加到
Crane.prototype.appendTo = function (target) {
    target.append(this.ele_console);
}
// 增加角度
Crane.prototype.addDeg = function (increment) {
    this.deg += increment;
    if (this.deg == 360) {
        this.deg = 0;
    } else if (this.deg > 360) {
        this.deg %= 360;
    } else if (this.deg < 0) {
        this.deg = 360 + this.deg % 360;
    }
}
// 设置分数
Crane.prototype.updateScore = function (increment) {
    let newScore = this.score + increment;
    if (newScore < 0) {
        this.score = 0;
    } else {
        this.score = newScore;
    }
}
// 静态
Crane.prototype.static = function () {
    this.status = this.STATUS.static;
}
// 伸长
Crane.prototype.elongate = function () {
    this.status = this.STATUS.elongating;
}
// 恢复
Crane.prototype.recovery = function () {
    this.status = this.STATUS.inRecovery;

    // 移除元素
    if (this.captured.element) {
        this.updateScore(10);
        this.captured.element.remove();
        this.captured.element = null;
    }

    // 恢复绳子伸长的步长
    this.rope.step = this.rope.DEFAULT_STEP;
}
// 捕捉
Crane.prototype.catch = function () {
    this.status = this.STATUS.reducing;

    let scrollLeft = $(document).scrollLeft();
    let scrollTop = $(document).scrollTop();

    let x = this.ele_hock.offset().left - scrollLeft + this.ele_hock.width() / 2,
        y = this.ele_hock.offset().top - scrollTop + this.ele_hock.height() / 2;

    let elements = document.elementsFromPoint(x, y);
    if (elements.length > 3) {
        this.captured.element = $(elements[3]);
        let tagName = this.captured.element[0].tagName.toLowerCase();
        // 忽略html元素
        if (tagName == 'html' || tagName == 'body') {
            this.captured.element = null;
            return;
        }
        // 计算上和左的距离
        this.captured.dis_left = this.ele_hock.offset().left - this.captured.element.offset().left + scrollLeft;
        this.captured.dis_top = this.ele_hock.offset().top - this.captured.element.offset().top + scrollTop;
        // 计算尺寸
        let size = this.captured.element.width() + this.captured.element.height();
        // this.rope.step = 1;
        // 初始化元素
        this.captured.element.css({
            'position': 'fixed',
            'left': `${this.captured.element.offset().left- $(document).scrollLeft()}px`,
            'top': `${this.captured.element.offset().top- $(document).scrollTop()}px`,
            'width': `${this.captured.element.width()}px`,
            'height': `${this.captured.element.height()}px`,
            'z-index': '995'
        });
        // 炸弹
        if (tagName == 'img') {
            let random = Math.random();
            let porp;
            if (random > .7) {
                porp = new Prop(this, 'bomb');
            } else if (random > .5) {
                porp = new Prop(this, 'flower');
            } else if (random > .3) {
                porp = new Prop(this, 'diamond');
            } else {
                porp = new Prop(this, 'bomb');
            }
            if (porp) {
                porp.appendTo(this.captured.element.parent());
            }
            this.porpList.push(porp);
        }
    }
}
// 更新
Crane.prototype.update = function () {
    // 爪子
    if (this.status == this.STATUS.elongating) {
        // 伸长
        if (this.rope.length < this.rope.MAX_LEN) {
            this.rope.length += this.rope.step;
        } else {
            this.catch();
        }
    } else if (this.status == this.STATUS.reducing) {
        // 收缩
        if (this.rope.length > this.rope.MIN_LEN) {
            this.rope.length -= this.rope.step;
        } else {
            this.recovery();
        }
    } else if (this.status == this.STATUS.inRecovery) {
        // 恢复
        if (this.rope.length > this.rope.DEFAULT_LEN) {
            this.rope.length -= 1;
        } else if (this.rope.length < this.rope.DEFAULT_LEN) {
            this.rope.length += 1;
        } else {
            this.static();
        }
    } else {
        this.addDeg(.5);
    }

    // 抓手状态
    if (this.captured.element) {
        // 抓着东西
        this.hock.src = this.hock.src_capture;
    } else {
        // 没有东西
        this.hock.src = this.hock.src_default;
    }

    // 道具
    for (let i in this.porpList) {
        let porp = this.porpList[i];
        if (porp.countDown > 0) {
            porp.countDown -= 1;
        } else if (porp.countDown > -64) {
            porp.size += 1;
            porp.countDown -= 1;
        } else if (porp.countDown == -64) {
            porp.deg = porp.WAGGLE_DEG;
            porp.text = porp.boomText;
            porp.zIndex = 999;
            porp.countDown -= 1;
            porp.crane.updateScore(porp.score);
        } else if (porp.countDown > -96) {
            if (porp.countDown % 8 == 0) {
                porp.deg = -porp.deg;
            }
            porp.countDown -= 1;
        } else {
            porp.element.remove();
            this.porpList.splice(i, 1);
        }
    }
}
// 绘制
Crane.prototype.draw = function () {
    // 分数
    this.ele_score.text('分数：' + this.score);
    // 旋转角度和长度
    this.ele_hock_container.css('transform', `rotate(${this.deg}deg)`);
    this.ele_rope.css({
        'width': `${this.rope.width}px`,
        'height': `${this.rope.length}px`
    });
    // 钩子图片
    this.ele_hock_img.attr('src', this.hock.src);
    // 拖动元素
    if (this.captured.element) {
        this.captured.element.css({
            'left': `${this.ele_hock.offset().left - this.captured.dis_left}px`,
            'top': `${this.ele_hock.offset().top - this.captured.dis_top}px`
        });
    }
    // 道具
    for (let porp of this.porpList) {
        porp.element.text(porp.text).css({
            'transform': `translate(-50%, -50%) rotate(${porp.deg}deg)`,
            'color': porp.color,
            'font-size': `${porp.size}px`,
            'z-index': porp.zIndex
        });
    }
}

// 休眠
async function sleep(delay) { return new Promise((resolve) => setTimeout(resolve, delay)); }
// 游戏循环
async function game_loop(cranes) {
    while (true) {
        for (let crane of cranes) {
            crane.update();
            crane.draw();
        }
        await sleep(10);
    }
}

$(function () {
    console.log('开始矿工之旅！！！');
    let crane = new Crane(400, 100);
    crane.appendTo($('body'));
    let cranes = [crane];

    game_loop(cranes);
});