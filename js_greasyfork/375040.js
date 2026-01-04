// ==UserScript==
// @name         富聊审核脚本
// @namespace    http://tampermonkey.net/
// @version      18
// @description  try to make work easy
// @author       yinchengnuo
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375040/%E5%AF%8C%E8%81%8A%E5%AE%A1%E6%A0%B8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/375040/%E5%AF%8C%E8%81%8A%E5%AE%A1%E6%A0%B8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/* jshint -W097 */
/* 功能概述 */
/* 1 常规文字进审提醒 回车提交 */
/* 2 截屏UI优化 键盘操作 数量统计 推流无弹窗 可选的双击换一批/右键推流/隐藏按钮/图片尺寸 */
/* 3 重点流UI优化 批量叉掉无弹窗 可选的双击换一批 */
/* 4 坐等UI优化 悬浮按钮 可选的双击换一批 */
(function($) {
    (function($, window, document, undefined) {
        $(function() {
            //插件制作


            $.fn.Tdrag = function(opt) {
                var call = {
                    scope: null, //父级
                    grid: null, //网格
                    axis: "all", //上下或者左右
                    pos: false, //是否记住位置
                    handle: null, //手柄
                    moveClass: "tezml", //移动时不换位加的class
                    dragChange: false, //是否开启拖拽换位
                    changeMode: "point", //point & sort
                    cbStart: function() {}, //移动前的回调函数
                    cbMove: function() {}, //移动中的回调函数
                    cbEnd: function() {}, //移动结束时候的回调函数
                    random: false, //是否自动随机排序
                    randomInput: null, //点击随机排序的按钮
                    animation_options: { //运动时的参数
                        duration: 800, //每次运动的时间
                        easing: "ease-out" //移动时的特效，ease-out、ease-in、linear
                    },
                    disable: false, //禁止拖拽
                    disableInput: null //禁止拖拽的按钮
                };
                var dragfn = new Dragfn(this, opt);
                if (opt && $.isEmptyObject(opt) == false) {
                    dragfn.options = $.extend(call, opt);
                } else {
                    dragfn.options = call;
                }
                dragfn.firstRandom = true;
                var ele = dragfn.$element;
                dragfn.pack(ele, false);
                if (dragfn.options.randomInput != null) {
                    $(dragfn.options.randomInput).bind("click", function() {
                        dragfn.pack(ele, true);
                    })
                }
                //加载拓展jquery的函数
                dragfn.loadJqueryfn()
            };

            //依赖构造函数
            var Dragfn = function(ele, opt) {
                this.$element = ele;
                this.options = opt;
            };
            //构造函数方法
            Dragfn.prototype = {
                init: function(obj) {
                    var self = this;
                    self.ele = self.$element;
                    self.handle = $(obj); //手柄
                    self.options = self.options;
                    self.disable = self.options.disable;
                    self._start = false;
                    self._move = false;
                    self._end = false;
                    self.disX = 0;
                    self.disY = 0;
                    self.zIndex = 1000;
                    self.moving = false;
                    self.moves = "";


                    //父级
                    self.box = $.type(self.options.scope) === "string" ? self.options.scope : null;
                    //手柄
                    if (self.options.handle != null) {
                        self.handle = $(obj).find(self.options.handle);
                    }

                    //三个事件
                    self.handle.on("mousedown", function(ev) {
                        self.start(ev, obj);
                        obj.setCapture && obj.setCapture();
                        return false;
                    });
                    if (self.options.dragChange) {
                        $(obj).on("mousemove", function(ev) {
                            self.move(ev, obj);
                        });
                        $(obj).on("mouseup", function(ev) {
                            self.end(ev, obj);
                        });
                    } else {
                        $(document).on("mousemove", function(ev) {
                            self.move(ev, obj);
                        });
                        $(document).on("mouseup", function(ev) {
                            self.end(ev, obj);
                        });
                    }
                },
                //jquery调取函数时候用
                loadJqueryfn: function() {
                    var self = this;
                    $.extend({
                        //返回按照index排序的回调函数
                        sortBox: function(obj) {
                            var arr = [];
                            for (var s = 0; s < $(obj).length; s++) {
                                arr.push($(obj).eq(s));
                            }
                            for (var i = 0; i < arr.length; i++) {
                                for (var j = i + 1; j < arr.length; j++) {
                                    if (Number(arr[i].attr("index")) > Number(arr[j].attr("index"))) {
                                        var temp = arr[i];
                                        arr[i] = arr[j];
                                        arr[j] = temp;
                                    }
                                }
                            }
                            return arr
                        },
                        //随机排序函数
                        randomfn: function(obj) {
                            self.pack($(obj), true);
                        },
                        //开启拖拽
                        disable_open: function() {
                            self.disable = false;
                        },
                        //禁止拖拽
                        disable_cloose: function() {
                            self.disable = true;
                        }
                    });
                },
                toDisable: function() {
                    var self = this;
                    if (self.options.disableInput != null) {
                        $(self.options.disableInput).bind("click", function() {
                            if (self.disable == true) {
                                self.disable = false
                            } else {
                                self.disable = true
                            }
                        })
                    }
                },
                start: function(ev, obj) {
                    var self = this;
                    self.moved = obj;
                    if (self.disable == true) {
                        return false
                    }
                    self._start = true;
                    var oEvent = ev || event;
                    self.disX = oEvent.clientX - obj.offsetLeft;
                    self.disY = oEvent.clientY - obj.offsetTop;
                    $(obj).css("zIndex", self.zIndex++);
                    self.options.cbStart();
                },
                move: function(ev, obj) {
                    var self = this;
                    if (self._start != true) {
                        return false
                    }
                    if (obj != self.moved) {
                        return false
                    }
                    self._move = true;
                    var oEvent = ev || event;
                    var l = oEvent.clientX - self.disX;
                    var t = oEvent.clientY - self.disY;
                    //有父级限制
                    if (self.box != null) {
                        var rule = self.collTestBox(obj, self.box);
                        if (l > rule.lmax) {
                            l = rule.lmax;
                        } else if (l < rule.lmin) {
                            l = rule.lmin;
                        }
                        if (t > rule.tmax) {
                            t = rule.tmax;
                        } else if (t < rule.tmin) {
                            t = rule.tmin;
                        }
                    }
                    if (self.options.axis == "all") {
                        obj.style.left = self.grid(obj, l, t).left + 'px';
                        obj.style.top = self.grid(obj, l, t).top + 'px';
                    } else if (self.options.axis == "y") {
                        obj.style.top = self.grid(obj, l, t).top + 'px';
                    } else if (self.options.axis == "x") {
                        obj.style.left = self.grid(obj, l, t).left + 'px';
                    }
                    /* if(self.options.changeWhen=="move") {
                         if (self.options.changeMode == "sort") {
                             self.sortDrag(obj);
                         } else if (self.options.changeMode == "point") {
                             self.pointmoveDrag(obj);
                         }
                     }else{
                         self.moveAddClass(obj);
                     }*/
                    if (self.options.pos == true) {
                        self.moveAddClass(obj);
                    }
                    self.options.cbMove(obj, self);

                },
                end: function(ev, obj) {
                    var self = this;
                    if (self._start != true) {
                        return false
                    }
                    if (self.options.changeMode == "sort" && self.options.pos == true) {
                        self.sortDrag(obj);
                    } else if (self.options.changeMode == "point" && self.options.pos == true) {
                        self.pointDrag(obj);
                    }
                    if (self.options.pos == true) {
                        self.animation(obj, self.aPos[$(obj).attr("index")]);
                    }
                    self.options.cbEnd();
                    if (self.options.handle != null) {
                        $(obj).find(self.options.handle).unbind("onmousemove");
                        $(obj).find(self.options.handle).unbind("onmouseup");
                    } else {
                        $(obj).unbind("onmousemove");
                        $(obj).unbind("onmouseup");
                    }
                    obj.releaseCapture && obj.releaseCapture();
                    self._start = false;

                },
                //算父级的宽高
                collTestBox: function(obj, obj2) {
                    var self = this;
                    var l1 = 0;
                    var t1 = 0;
                    var l2 = $(obj2).innerWidth() - $(obj).outerWidth();
                    var t2 = $(obj2).innerHeight() - $(obj).outerHeight();
                    return {
                        lmin: l1, //取的l最小值
                        tmin: t1, //取的t最小值
                        lmax: l2, //取的l最大值
                        tmax: t2 //取的t最大值
                    }

                },
                //算父级宽高时候干掉margin
                grid: function(obj, l, t) { //cur:[width,height]
                    var self = this;
                    var json = {
                        left: l,
                        top: t
                    };
                    if ($.isArray(self.options.grid) && self.options.grid.length == 2) {
                        var gx = self.options.grid[0];
                        var gy = self.options.grid[1];
                        json.left = Math.floor((l + gx / 2) / gx) * gx;
                        json.top = Math.floor((t + gy / 2) / gy) * gy;
                        return json
                    } else if (self.options.grid == null) {
                        return json
                    } else {
                        console.log("grid参数传递格式错误");
                        return false
                    }
                },
                findNearest: function(obj) {
                    var self = this;
                    var iMin = new Date().getTime();
                    var iMinIndex = -1;
                    var ele = self.ele;
                    for (var i = 0; i < ele.length; i++) {
                        if (obj == ele[i]) {
                            continue;
                        }
                        if (self.collTest(obj, ele[i])) {
                            var dis = self.getDis(obj, ele[i]);
                            if (dis < iMin) {
                                iMin = dis;
                                iMinIndex = i;
                            }
                        }
                    }
                    if (iMinIndex == -1) {
                        return null;
                    } else {
                        return ele[iMinIndex];
                    }
                },
                getDis: function(obj, obj2) {
                    var self = this;
                    var l1 = obj.offsetLeft + obj.offsetWidth / 2;
                    var l2 = obj2.offsetLeft + obj2.offsetWidth / 2;

                    var t1 = obj.offsetTop + obj.offsetHeight / 2;
                    var t2 = obj2.offsetTop + obj2.offsetHeight / 2;

                    var a = l2 - l1;
                    var b = t1 - t2;

                    return Math.sqrt(a * a + b * b);
                },
                collTest: function(obj, obj2) {
                    var self = this;
                    var l1 = obj.offsetLeft;
                    var r1 = obj.offsetLeft + obj.offsetWidth;
                    var t1 = obj.offsetTop;
                    var b1 = obj.offsetTop + obj.offsetHeight;

                    var l2 = obj2.offsetLeft;
                    var r2 = obj2.offsetLeft + obj2.offsetWidth;
                    var t2 = obj2.offsetTop;
                    var b2 = obj2.offsetTop + obj2.offsetHeight;

                    if (r1 < l2 || r2 < l1 || t2 > b1 || b2 < t1) {
                        return false;
                    } else {
                        return true;
                    }
                },
                //初始布局转换
                pack: function(ele, click) {
                    var self = this;
                    self.toDisable();
                    if (self.options.pos == false) {
                        for (var i = 0; i < ele.length; i++) {
                            $(ele[i]).css("position", "fixed");
                            $(ele[i]).css("margin", "0");
                            self.init(ele[i]);
                        }
                    } else if (self.options.pos == true) {
                        var arr = [];
                        if (self.options.random || click) {
                            while (arr.length < ele.length) {
                                var n = self.rnd(0, ele.length);
                                if (!self.finInArr(arr, n)) { //没找到
                                    arr.push(n);
                                }
                            }
                        }
                        if (self.options.random == false || click != true) {
                            var n = 0;
                            while (arr.length < ele.length) {
                                arr.push(n);
                                n++
                            }
                        }

                        //如果是第二次以后随机列表，那就重新排序后再随机，因为我智商不够使，不会排了
                        if (self.firstRandom == false) {
                            var sortarr = [];
                            var n = 0;
                            while (sortarr.length < ele.length) {
                                sortarr.push(n);
                                n++
                            }
                            for (var i = 0; i < ele.length; i++) {
                                $(ele[i]).attr("index", sortarr[i]);
                                $(ele[i]).css("left", self.aPos[sortarr[i]].left);
                                $(ele[i]).css("top", self.aPos[sortarr[i]].top);
                            }
                        }

                        //布局转化
                        self.aPos = [];
                        if (self.firstRandom == false) {
                            //不是第一次
                            for (var j = 0; j < ele.length; j++) {
                                self.aPos[j] = {
                                    left: ele[$(ele).eq(j).attr("index")].offsetLeft,
                                    top: ele[$(ele).eq(j).attr("index")].offsetTop
                                };
                            }
                        } else {
                            //第一次
                            for (var j = 0; j < ele.length; j++) {
                                self.aPos[j] = { left: ele[j].offsetLeft, top: ele[j].offsetTop };
                            }
                        }
                        //第二个循环布局转化
                        for (var i = 0; i < ele.length; i++) {
                            $(ele[i]).attr("index", arr[i]);
                            $(ele[i]).css("left", self.aPos[arr[i]].left);
                            $(ele[i]).css("top", self.aPos[arr[i]].top);
                            $(ele[i]).css("position", "absolute");
                            $(ele[i]).css("margin", "0");
                            self.init(ele[i]);
                        }
                        self.firstRandom = false;
                    }
                },
                //移动时候加class
                moveAddClass: function(obj) {
                    var self = this;
                    var oNear = self.findNearest(obj);
                    $(self.$element).removeClass(self.options.moveClass);
                    if (oNear && $(oNear).hasClass(self.options.moveClass) == false) {
                        $(oNear).addClass(self.options.moveClass);
                    }

                },
                //给li排序
                sort: function() {
                    var self = this;
                    var arr_li = [];
                    for (var s = 0; s < self.$element.length; s++) {
                        arr_li.push(self.$element[s]);
                    }
                    for (var i = 0; i < arr_li.length; i++) {
                        for (var j = i + 1; j < arr_li.length; j++) {
                            if (Number($(arr_li[i]).attr("index")) > Number($(arr_li[j]).attr("index"))) {
                                var temp = arr_li[i];
                                arr_li[i] = arr_li[j];
                                arr_li[j] = temp;
                            }
                        }
                    }
                    return arr_li;
                },
                //点对点的方式换位
                pointDrag: function(obj) {
                    var self = this;
                    //先拍序
                    var oNear = self.findNearest(obj);
                    if (oNear) {
                        self.animation(obj, self.aPos[$(oNear).attr("index")]);
                        self.animation(oNear, self.aPos[$(obj).attr("index")]);
                        var tmp;
                        tmp = $(obj).attr("index");
                        $(obj).attr("index", $(oNear).attr("index"));
                        $(oNear).attr("index", tmp);
                        $(oNear).removeClass(self.options.moveClass);
                    } else if (self.options.changeWhen == "end") {
                        self.animation(obj, self.aPos[$(obj).attr("index")]);
                    }

                },
                //排序的方式换位
                sortDrag: function(obj) {
                    var self = this;
                    //先拍序
                    var arr_li = self.sort();
                    //换位置
                    var oNear = self.findNearest(obj);
                    if (oNear) {
                        if (Number($(oNear).attr("index")) > Number($(obj).attr("index"))) {
                            //前换后
                            var obj_tmp = Number($(obj).attr("index"));
                            $(obj).attr("index", Number($(oNear).attr("index")) + 1);
                            for (var i = obj_tmp; i < Number($(oNear).attr("index")) + 1; i++) {
                                self.animation(arr_li[i], self.aPos[i - 1]);
                                self.animation(obj, self.aPos[$(oNear).attr("index")]);
                                $(arr_li[i]).removeClass(self.options.moveClass);
                                $(arr_li[i]).attr("index", Number($(arr_li[i]).attr("index")) - 1);
                            }

                        } else if (Number($(obj).attr("index")) > Number($(oNear).attr("index"))) {
                            //后换前
                            var obj_tmp = Number($(obj).attr("index"));
                            $(obj).attr("index", $(oNear).attr("index"));
                            for (var i = Number($(oNear).attr("index")); i < obj_tmp; i++) {
                                self.animation(arr_li[i], self.aPos[i + 1]);
                                self.animation(obj, self.aPos[Number($(obj).attr("index"))]);
                                $(arr_li[i]).removeClass(self.options.moveClass);
                                $(arr_li[i]).attr("index", Number($(arr_li[i]).attr("index")) + 1);
                            }
                        }
                    } else {
                        self.animation(obj, self.aPos[$(obj).attr("index")]);
                    }

                },
                //运动函数(后期再加参数)
                animation: function(obj, json) {
                    var self = this;
                    //考虑默认值
                    var options = self.options.animation_options;
                    /*|| {};
                                   options.duration=self.options.animation_options.duration || 800;
                                   options.easing=options.easing.duration.easing || 'ease-out';*/
                    var self = this;
                    var count = Math.round(options.duration / 30);
                    var start = {};
                    var dis = {};
                    for (var name in json) {
                        start[name] = parseFloat(self.getStyle(obj, name));
                        if (isNaN(start[name])) {
                            switch (name) {
                                case 'left':
                                    start[name] = obj.offsetLeft;
                                    break;
                                case 'top':
                                    start[name] = obj.offsetTop;
                                    break;
                                case 'width':
                                    start[name] = obj.offsetWidth;
                                    break;
                                case 'height':
                                    start[name] = obj.offsetHeight;
                                    break;
                                case 'marginLeft':
                                    start[name] = obj.offsetLeft;
                                    break;
                                case 'borderWidth':
                                    start[name] = 0;
                                    break;
                                    //...
                            }
                        }
                        dis[name] = json[name] - start[name];
                    }

                    var n = 0;

                    clearInterval(obj.timer);
                    obj.timer = setInterval(function() {
                        n++;
                        for (var name in json) {
                            switch (options.easing) {
                                case 'linear':
                                    var a = n / count;
                                    var cur = start[name] + dis[name] * a;
                                    break;
                                case 'ease-in':
                                    var a = n / count;
                                    var cur = start[name] + dis[name] * a * a * a;
                                    break;
                                case 'ease-out':
                                    var a = 1 - n / count;
                                    var cur = start[name] + dis[name] * (1 - a * a * a);
                                    break;
                            }

                            if (name == 'opacity') {
                                obj.style.opacity = cur;
                                obj.style.filter = 'alpha(opacity:' + cur * 100 + ')';
                            } else {
                                obj.style[name] = cur + 'px';
                            }
                        }

                        if (n == count) {
                            clearInterval(obj.timer);
                            options.complete && options.complete();
                        }
                    }, 30);
                },
                getStyle: function(obj, name) {
                    return (obj.currentStyle || getComputedStyle(obj, false))[name];
                },
                //随机数
                rnd: function(n, m) {
                    return parseInt(Math.random() * (m - n) + n);
                },
                //在数组中找
                finInArr: function(arr, n) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] == n) { //存在
                            return true;
                        }
                    }
                    return false;
                }
            }
        })
    })($, window, document);
    //进审提醒功能
    const $refresherInsert = (bool, click) => {
        //插入自定刷新器
        $(
            '<div class="refresh" title="鼠标右键查看帮助" style="width: 70px; height: 17px; overflow: hidden; position: fixed; right: 0px; top: 0px; border: 1px solid black; border-radius: 8px; opacity: 0.5; font-size: 12px;"><button class="refresherLeft" style="font-size: 10px; box-sizing: border-box; width: 24px; height: 17px; padding: 0px; float: left; cursor: pointer;">O</button><input class="refresherCenter" maxlength="3" placeholder = "s" type="text" style="box-sizing: border-box; width: 22px; height: 17px; text-align: center; float: left; font-size: 10px;"></input><button class="refresherRight" style="font-size: 10px; box-sizing: border-box; width: 22px; height: 17px; padding: 0px; float: left; cursor: pointer;">F</button></div>'
        ).appendTo("body");
        const showTime = $(".refresherCenter");
        let timer = null;
        //定义自定刷新器点击事件
        $(".refresh").on("click", "button", function() {
            if (this.className === "refresherLeft") {
                clearInterval(timer);
                const time = parseInt(showTime.val());
                if (time && time >= 10) {
                    document.cookie = `time=${time};`;
                    let value = time;
                    timer = setInterval(() => {
                        value--;
                        showTime.val(value);
                        if (value === 0) {
                            if (click) {
                                click.click();
                                value = document.cookie.match(/time=\d+/g)[0].match(/\d+/g)[0]
                            } else {
                                location.reload();
                            }
                        }
                    }, 1000);
                } else {
                    alert("请输入大于等于10的纯数字");
                    showTime.val("10");
                }
            } else if (this.className === "refresherRight") {
                clearInterval(timer);
                showTime.val("");
                document.cookie = "time=0;";
            }
        });
        //使用说明
        $(".refresh").on("contextmenu", () => {
            alert(
                "    1 当前自动刷新器可在富聊后台审核系统的部分页面上使用，设定一个不小于10的数字作为自动刷新间隔。不建议过大。设定时间之后点击ON按钮，开始进入自动刷新模式。自动刷新器上面显示的数字就是距离下次页面刷新的时间。点击OFF按钮终止自动刷新。如果当前浏览器打开了多个页面都在使用当前自动刷新器，则对一个页面的刷新间隔修改会影响所有正在使用当前定时刷新器的刷新间隔。（既如果点击了某一个正在运行自的自动刷新器的OFF按钮，则所有正在使用当前定时刷新器的页面会在当前时间间隔结束时退出自动刷新模式。）\n    2 当前自动刷新器的存在主要是为了配合在常规和文字类部分模块审核时增加的进审提醒功能。当设定了固定的自动刷新时间，页面刷新后，如果有新的内容进审则当前选项卡的title会一直闪烁显示进审，提示当前页面有新内容进审。同时自动刷新不会停止。当点击了正在闪烁提醒的选项卡时，自动刷新自动停止，只有当当前进审内容提交之后，自动刷新模式才会重新开启，时间为之前设置的时间间隔。设置了进审提醒的模块有所有常规， 封面审核，私聊广告消息，敏感词报警处理。\n    3 在使用进审提醒时，一些有下级的模块（如头像审核中有“已认证”和“其他”两个下级模块）， 应当将这些下级模块都在浏览器的新选项卡打开，（视频介绍和敏感词报警的各四个下级模块也不例外），否则会影响提醒效果！"
            );
            return false;
        });
        //刷新后根据设定值继续刷新
        if (document.cookie.match(/time=\d+/g)) {
            const time = parseInt(
                document.cookie.match(/time=\d+/g)[0].match(/\d+/g)[0]
            );
            if (time) {
                let value = time;
                showTime.val(value);
                timer = setInterval(() => {
                    value--;
                    showTime.val(value);
                    if (value === 0) {
                        location.reload();
                    }
                }, 1000);
            }
        }
        //进审提醒，选定选项卡后停止刷新
        if (bool) {
            const title = $("title").html();
            let i = 0;
            setInterval(function() {
                if (i % 2 == 0) {
                    $("title").html(title);
                } else {
                    $("title").html("进审");
                }
                i++;
                if (document.hidden === false) {
                    clearInterval(timer);
                }
            }, 500);
        }
    };
    //设置直播截屏图片尺寸
    const setSize = width => {
        let bite = 1.8;
        $("img").filter(function(i, e) {
            if (e.width > 100) {
                e.style.width = width + "px";
                e.style.height = width * bite + "px";
            } else {
                e.style.float = "right";
                e.style.width = "10x";
            }
        });
    };
    //设置直播截屏按钮尺寸
    const setButtonSize = size => {
        $("table input:visible")
            .css({
                width: size / 3 + "px",
                padding: "0",
                margin: "0",
                float: "left"
            })
            .filter(function(i, e) {
                if (
                    e.value == "荐" ||
                    e.value == "拉黑" ||
                    e.value == "取荐" ||
                    e.value == "B级"
                ) {
                    e.style.display = "none";
                } else if (e.value == "推流" || e.value == "禁播") {
                    e.style.width = size / 3 + "px";
                    e.style.float = "right";
                }
            });
    };
    //设置直播截屏昵称尺寸
    const setTitleSize = size => {
        $("tbody tr:nth-child(2) td a")
            .css({
                display: "inline-block",
                width: size / 3 - 6 + "px",
                height: "12px",
                "line-height": "12px",
                overflow: "hidden"
            })
            .each(function(i, e) {
                $(e)
                    .parent()
                    .parent()
                    .parent()
                    .attr("title", $(e).html());
            });
    };
    //回车提交功能
    const enterLogin = btn => {
        $(document).one("keydown", function(e) {
            if (e.key === "Enter") {
                btn.click();
            }
        });
    };
    //取消动画功能
    const cancelAnimate = () => {
        $(":animated").stop(true, true);
    };
    //推流成功后取消推流弹窗记录审核记录
    const retoperateEmpasisUser = response => {
        var ret = eval("(" + response.responseText + ")");
        var roomid = ret.roomid;
        var userid = ret.userid;
        if (ret.res == 1) {
            $("#empasis_" + userid + "_" + roomid).val(1);
            $("#div_" + userid + "_" + roomid)
                .find("table input:button")
                .each(function(i, e) {
                    if (e.value == "推流") {
                        $(e)
                            .css("color", "red")
                            .val("已推");
                    }
                });
            $(".success").slideDown(66, () => {
                setTimeout(() => {
                    $(".success").slideUp(66);
                }, 222);
            });
        } else {
            alert("操作失败，请关闭插件联系成诺");
        }
    };
    //去掉兼容的Ajax对象
    const Ajax = {
        xmlhttp: function() {
            return new XMLHttpRequest();
        }
    };
    //Ajax的请求方法
    Ajax.Request = function() {
        if (arguments.length < 2) return;
        var para = {
            asynchronous: true,
            method: "GET",
            parameters: ""
        };
        for (var key in arguments[1]) {
            para[key] = arguments[1][key];
        }
        var _x = Ajax.xmlhttp();
        var _url = arguments[0];
        if (para["parameters"].length > 0) {
            para["parameters"] += "&_=";
        }
        if (para["method"].toUpperCase() == "GET") {
            _url += (_url.match(/\?/) ? "&" : "?") + para["parameters"];
        }
        _x.open(para["method"].toUpperCase(), _url, para["asynchronous"]);
        _x.onreadystatechange = function() {
            if (_x.readyState == 4) {
                if (_x.status == 200) para["onComplete"] ? para["onComplete"](_x) : "";
                else {
                    para["onError"] ? para["onError"](_x) : "";
                }
            }
        };
        if (para["method"].toUpperCase() == "POST")
            _x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        for (var ReqHeader in para["setRequestHeader"]) {
            _x.setRequestHeader(ReqHeader, para["setRequestHeader"][ReqHeader]);
        }
        _x.send(
            para["method"].toUpperCase() == "POST" ?
            para["postBody"] ?
            para["postBody"] :
            para["parameters"] :
            null
        );
        return _x;
    };
    //推流
    const addEmpasisUser = (roomid, userid) => {
        if (roomid == null || roomid <= 0) {
            alert("直播结束了");
            return;
        }
        if (userid == null || userid <= 0) {
            alert("直播结束了");
            return;
        }
        var arrs = "&roomid=" + roomid + "&userid=" + userid;
        var myAjax = new Ajax.Request(
            "videoLiveAuditAction!addEmpasisUser.action", {
                method: "post",
                parameters: arrs,
                onComplete: retoperateEmpasisUser,
                onError: error
            }
        );
    };
    //重写叉掉重点流的回调函数
    const retoperateListOne = response => {
        var ret = eval("(" + response.responseText + ")");
        //得到回执参数
        var oldrid = ret.roomid;
        var uid = ret.userid;
        var roomids = ret.roomids;
        if (ret.res != 1 || ret.list == null || ret.list.length == 0) {
            $("#div_" + uid + "_" + oldrid)
                .removeClass("marked")
                .hide();
            if (_Xlistturn < _Xlistnode.length) {
                $(".showNum").html(
                    "本批次剩余" + (_Xlistnode.length - _Xlistturn) + "个"
                );
                _Xlistnode[_Xlistturn].click();
                _Xlistturn++;
            } else if (_Xlistturn == _Xlistnode.length) {
                $(".showNum")
                    .html("")
                    .hide();
                $(".X")[0].onclick = X;
                _Xlistnode = [];
                _Xlistturn = 0;
            }
            $(".listNull").slideDown(66, () => {
                setTimeout(() => {
                    $(".listNull").slideUp(66);
                }, 222);
                $("table tr:nth-child(4) a").show();
            });
            return;
        }
        //新视频地址与新容器
        var stream_url = "";
        var stream_url1 = "";
        var stream_url2 = "";
        var nowuid = "";
        var nowroomid = "";
        var nowuid1 = "";
        var nowuid2 = "";
        //页面内容绑定
        var table = "";
        //循环列表
        for (var i = 0; i < ret.list.length; i++) {
            var obj = ret.list[i];
            //绑定视频数据
            nowuid = obj.userid;
            nowroomid = obj.roomid;
            nowuid1 = obj.userid1;
            nowuid2 = obj.userid2;
            stream_url = obj.stream_url;
            stream_url1 = obj.stream_url1;
            stream_url2 = obj.stream_url2;
            if (("," + roomids + ",").indexOf("," + obj.roomid + ",") > -1) {
                continue;
            }
            //去除释放的视频 房间号
            roomids = ("," + roomids + ",").replace("," + oldrid + ",", ",");
            //增加新的房间号
            roomids = roomids + obj.roomid;
            //去除第一个，号
            if (roomids.length > 0) {
                roomids = roomids.substring(1, roomids.length);
            }
            //singleRef(${obj.userid}, ${obj.roomid}, 1)
            table = `
            <table style="float: left; width: 153px; margin-right: 0px; margin-bottom: 0px; outline: none;" border="0" height="305px" cellspacing="1" cellpadding="0"  class="content" width="210px" border="0">
                <tr>
                    <td style="padding: 0px;">
                        <div id = "video_${obj.userid}_${obj.roomid}"></div>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0px;">
                        <a style="cursor: pointer; float: left; width: 60px; white-space: nowrap; overflow: hidden;" target="_blank" href="userAction!details.action?userid=${
                          obj.userid
                        }">${
        obj.name.length > 6 ? obj.name.substring(0, 6) : obj.name
      }</a>
                        <span>${
                          obj.CharmLevel > 0 && obj.CharmLevel > obj.VipLevel
                            ? "M" + obj.CharmLevel + " "
                            : "V" + obj.VipLevel + " "
                        }</span>
                        <font color="red">${obj.sex == 0 ? "女" : "男"}</font>
                        <span id="roomrs_${
                          obj.userid
                        }">${obj.roomrs.toString().fontcolor("blue")}人</span>
                        <span>${obj.live_channel == 1 ? "才" : ""}</span>
                    </td>
                </tr>
                <tr height="25px">
                    <td style="padding: 0px;">
                        <span id="cf_zd_${obj.userid}">
                            <a style="cursor:pointer;" onclick="refvideo(${
                              obj.userid
                            }, ${obj.roomid}, ${obj.stream_url})">
                                <img style="width:16px;height:16px;" src="/images/refresh.png" >
                            </a>
                            <img style="width:16px;height:16px;display:${
                              obj.live_p16 == 1 ? "inline-block" : "none"
                            }" src="/images/bottom.png" >
                            <img style="width:16px;height:16px;display:${
                              obj.live_p18 == 1 ? "inline-block" : "none"
                            }" src="/images/down.png" >
                            <img style="width:16px;height:16px;display:${
                              obj.isph == 1 ? "inline-block" : "none"
                            }" src="/images/link.png" >
                        </span>
                        <font color="red">${obj.remarkinfo}</font>
                        <a style="cursor:pointer;" onclick="addUserBlacklist(${
                          obj.userid
                        })" >拉黑</a>
                    </td>
                </tr>
                <tr align="center">
                    <td style="padding: 0px;">
                        <input type="hidden" id="live_down_${
                          obj.userid
                        }" name="live_down_${obj.userid}" value="${
        obj.live_down
      }"/>
                        <input type="hidden" id="live_alarm_${
                          obj.userid
                        }" name="live_alarm_${obj.userid}" value="${
        obj.live_alarm
      }"/>
                        <input type="hidden" id="live_banned_${
                          obj.userid
                        }" name="live_banned_${obj.userid}" value="${
        obj.live_banned
      }"/>
                        <input type="hidden" id="live_downall_${
                          obj.userid
                        }" name="live_downall_${obj.userid}" value="${
        obj.live_downall
      }"/>
                        <input type="button" class="btn_blue" onclick="javascript:showdiv(${
                          obj.userid
                        }, ${
        obj.roomid
      }, 1, 0)" value="警告" style="float: left; width: 43px; margin: 0px;">
                        <input type="button" class="btn_blue" onclick="javascript:showdiv(${
                          obj.userid
                        }, ${
        obj.roomid
      }, 2, 0)" value="下榜" style="float: left; width: 43px; margin: 0px;">
                        <input type="button" class="btn_blue" onclick="javascript:showdiv(${
                          obj.userid
                        }, ${
        obj.roomid
      }, 3, 0)" value="禁播" style="float: left; width: 43px; margin: 0px;">
                        <a style="cursor:pointer;float: left; display:${
                          obj.remarktype != 12 ? "inline-block" : "none"
                        }" >
                            <img style="width: 20px; height: 20px;" src="/images/close.png" >
                        </a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0px;">
                        <input type="checkbox" class="showche" id="che_${
                          obj.userid
                        }_${obj.roomid}" name="che_${obj.userid}_${
        obj.roomid
      }">待定
                    </td>
                </tr>
            </table>
            `;
            if (
                obj.userid1 != null &&
                obj.userid1 != "" &&
                obj.stream_url1 != null &&
                obj.stream_url1 != ""
            ) {
                table += `
                    <table style="float: left; width: 153px; margin-right: 0px; margin-bottom: 0px; outline: none;" border="0" height="305px" cellspacing="1" cellpadding="0"  class="content" width="210px" border="0">
                <tr>
                    <td style="padding: 0px;">
                        <div id = "video_${obj.userid1}_${obj.roomid}"></div>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0px;">
                        <a style="cursor: pointer; float: left; width: 60px; white-space: nowrap; overflow: hidden;" target="_blank" href="userAction!details.action?userid=${
                          obj.userid1
                        }">${
          obj.name1.length > 6 ? obj.name1.substring(0, 6) : obj.name1
        }</a>
                        <span>${
                          obj.CharmLevel1 > 0 && obj.CharmLevel1 > obj.VipLevel1
                            ? "M" + obj.CharmLevel1 + " "
                            : "V" + obj.VipLevel1 + " "
                        }</span>
                        <font color="red">${obj.sex1 == 0 ? "男" : "女"}</font>
                        <span>位置1</span>
                        <span id="roomrs_${
                          obj.userid
                        }">${obj.roomrs.toString().fontcolor("blue")}人</span>
                    </td>
                </tr>
                <tr height="25px">
                    <td style="padding: 0px;">
                        <a style="cursor:pointer;" onclick="refvideo(${
                          obj.userid1
                        }, ${obj.roomid}, ${obj.stream_url1})">
                            <img style="width:16px;height:16px;" src="/images/refresh.png" >
                        </a>
                        <font color="red">${obj.remarkinfo}</font>
                        <a style="cursor:pointer;" onclick="addUserBlacklist(${
                          obj.userid1
                        })" >拉黑</a>
                        <span style="color: red; display: ${
                          obj.live_channel == 1 ? "block" : "none"
                        }">才</span>
                        <span style="color: red; display: ${
                          obj.pk == 1 ? "block" : "none"
                        }">PK</span>
                    </td>
                </tr>
                <tr align="center">
                    <td style="padding: 0px;">
                        <input type="hidden" id="live_down_${
                          obj.userid1
                        }" name="live_down_${obj.userid1}" value="${
          obj.live_down1
        }"/>
                        <input type="hidden" id="live_alarm_${
                          obj.userid1
                        }" name="live_alarm_${obj.userid1}" value="${
          obj.live_alarm1
        }"/>
                        <input type="hidden" id="live_banned_${
                          obj.userid1
                        }" name="live_banned_${obj.userid1}" value="${
          obj.live_banned1
        }"/>
                        <input type="hidden" id="live_downall_${
                          obj.userid1
                        }" name="live_downall_${obj.userid1}" value="${
          obj.live_downall1
        }"/>
                        <input type="button" class="btn_blue" onclick="javascript:showdiv(${
                          obj.userid1
                        }, ${
          obj.roomid
        }, 1, 0)" value="警告" style="float: left; width: 43px; margin: 0px;">
                        <input type="button" class="btn_blue" onclick="javascript:showdiv(${
                          obj.userid1
                        }, ${
          obj.roomid
        }, 3, 0)" value="禁播" style="float: left; width: 43px; margin: 0px;">
                    </td>
                </tr>
            </table>
                `;
            }
            if (
                obj.userid2 != null &&
                obj.userid2 != "" &&
                obj.stream_url2 != null &&
                obj.stream_url2 != ""
            ) {
                table += `
                    <table style="float: left; width: 153px; margin-right: 0px; margin-bottom: 0px; outline: none;" border="0" height="305px" cellspacing="1" cellpadding="0"  class="content" width="210px" border="0">
                <tr>
                    <td style="padding: 0px;">
                        <div id = "video_${obj.userid2}_${obj.roomid}"></div>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0px;">
                        <a style="cursor: pointer; float: left; width: 60px; white-space: nowrap; overflow: hidden;" target="_blank" href="userAction!details.action?userid=${
                          obj.userid2
                        }">${
          obj.name2.length > 6 ? obj.name2.substring(0, 6) : obj.name2
        }</a>
                        <span>${
                          obj.CharmLevel1 > 0 && obj.CharmLevel1 > obj.VipLevel1
                            ? "M" + obj.CharmLevel1 + " "
                            : "V" + obj.VipLevel1 + " "
                        }</span>
                        <font color="red">${obj.sex2 == 0 ? "男" : "女"}</font>
                        <span>位置1</span>
                        <span id="roomrs_${
                          obj.userid
                        }">${obj.roomrs.toString().fontcolor("blue")}人</span>
                    </td>
                </tr>
                <tr height="25px">
                    <td style="padding: 0px;">
                        <a style="cursor:pointer;" onclick="refvideo(${
                          obj.userid2
                        }, ${obj.roomid}, ${obj.stream_url2})">
                            <img style="width:16px;height:16px;" src="/images/refresh.png" >
                        </a>
                        <font color="red">${obj.remarkinfo}</font>
                        <a style="cursor:pointer;" onclick="addUserBlacklist(${
                          obj.userid2
                        })" >拉黑</a>
                        <span style="color: red; display: ${
                          obj.live_channel == 1 ? "block" : "none"
                        }">才</span>
                        <span style="color: red; display: ${
                          obj.pk == 1 ? "block" : "none"
                        }">PK</span>
                    </td>
                </tr>
                <tr align="center">
                    <td style="padding: 0px;">
                        <input type="hidden" id="live_down_${
                          obj.userid2
                        }" name="live_down_${obj.userid2}" value="${
          obj.live_down1
        }"/>
                        <input type="hidden" id="live_alarm_${
                          obj.userid2
                        }" name="live_alarm_${obj.userid2}" value="${
          obj.live_alarm1
        }"/>
                        <input type="hidden" id="live_banned_${
                          obj.userid2
                        }" name="live_banned_${obj.userid2}" value="${
          obj.live_banned1
        }"/>
                        <input type="hidden" id="live_downall_${
                          obj.userid2
                        }" name="live_downall_${obj.userid2}" value="${
          obj.live_downall1
        }"/>
                        <input type="button" class="btn_blue" onclick="javascript:showdiv(${
                          obj.userid2
                        }, ${
          obj.roomid
        }, 1, 0)" value="警告" style="float: left; width: 43px; margin: 0px;">
                        <input type="button" class="btn_blue" onclick="javascript:showdiv(${
                          obj.userid2
                        }, ${
          obj.roomid
        }, 3, 0)" value="禁播" style="float: left; width: 43px; margin: 0px;">
                    </td>
                </tr>
            </table>
                `;
            }
            //获得页面所有绑定房间号
            $("#roomids").val(roomids);
            break;
        }
        //没有绑定到数据 返回空
        if (table == "" || table == null) {
            $("#div_" + uid + "_" + oldrid).hide();
            setTimeout(() => {
                $(".listNull").slideUp(66);
            }, 222);
            return;
        }
        //绑定数据
        $("#div_" + uid + "_" + oldrid)
            .html(table)
            .removeClass("marked")
            .css("outline", "none");
        $("#div_" + uid + "_" + oldrid).attr(
            "id",
            "div_" + nowuid + "_" + nowroomid
        );
        $("table tr:nth-child(4) a").show();
        if (_Xlistturn < _Xlistnode.length) {
            $(".showNum").html(
                "本批次剩余" + (_Xlistnode.length - _Xlistturn) + "个"
            );
            _Xlistnode[_Xlistturn].click();
            _Xlistturn++;
        } else if (_Xlistturn == _Xlistnode.length) {
            $(".showNum")
                .html("")
                .hide();
            $(".X")[0].onclick = X;
            _Xlistnode = [];
            _Xlistturn = 0;
        }
        //绑定视频数据
        if (
            nowuid != null &&
            nowuid != "" &&
            stream_url != "" &&
            stream_url != null
        ) {
            let player = new window.parent.qcVideo.Player(
                "video_" + nowuid + "_" + nowroomid, {
                    width: 153,
                    height: 270.81,
                    live_url: "" + stream_url + "",
                    volume: 0
                }
            );
        }
        if (
            nowuid1 != null &&
            nowuid1 != "" &&
            stream_url1 != "" &&
            stream_url1 != null
        ) {
            let player = new window.parent.qcVideo.Player(
                "video_" + nowuid1 + "_" + nowroomid, {
                    width: 153,
                    height: 270.81,
                    live_url: "" + stream_url1 + "",
                    volume: 0
                }
            );
        }
        if (
            nowuid2 != null &&
            nowuid2 != "" &&
            stream_url2 != "" &&
            stream_url2 != null
        ) {
            let player = new window.parent.qcVideo.Player(
                "video_" + nowuid2 + "_" + nowroomid, {
                    width: 153,
                    height: 270.81,
                    live_url: "" + stream_url2 + "",
                    volume: 0
                }
            );
        }
    };
    //叉
    const singleRef = (userid, roomid, type, mode) => {
        if (roomid.length <= 0 || userid.length <= 0) {
            return;
        }
        var roomids = $("#roomids").val();
        var arrs =
            "roomid=" +
            roomid +
            "&userid=" +
            userid +
            "&roomids=" +
            roomids +
            "&type=" +
            type;
        if (mode == 1) {
            new Ajax.Request(
                "videoLiveAuditAction!getvideoliveFlowAuditListSinglejson.action", {
                    method: "post",
                    parameters: arrs,
                    onComplete: retoperateListOne,
                    onError: error
                }
            );
        } else if (mode == 2) {
            new Ajax.Request(
                "videoLiveAuditAction!getvideoliveFlowAuditListSinglejson.action", {
                    method: "post",
                    parameters: arrs,
                    onComplete: retoperateListTwo,
                    onError: error
                }
            );
        }
    };
    //叉掉重点流后取消队列无人弹窗提示，取消队列有人时的渲染，定义当前批量叉数量，根据数量判断是否是最后一次请求成功，成功后刷新页面
    let _Xlistturn = 0;
    let _Xlistnode = [];
    const retoperateListTwo = response => {
        var ret = eval("(" + response.responseText + ")");
        var oldrid = ret.roomid;
        var uid = ret.userid;
        var roomids = ret.roomids;
        if (ret.res != 1 || ret.list == null || ret.list.length == 0) {
            $("#div_" + uid + "_" + oldrid)
                .removeClass("marked")
                .hide();
            _Xlistturn++;
            $(".showNum").html(
                "本批次剩余" + (_Xlistnode.length - _Xlistturn) + "个"
            );
            if (_Xlistnode.length == _Xlistturn) {
                $(".showNum").hide();
                _Xlistturn = 0;
                _Xlistnode = [];
                $(".X")[0].onclick = X;
            }
            $(".listNull").slideDown(66, () => {
                setTimeout(() => {
                    $(".listNull").slideUp(66);
                }, 222);
            });
            return;
        }
        _Xlistturn++;
        $(".showNum").html("本批次剩余" + (_Xlistnode.length - _Xlistturn) + "个");
        $("#div_" + uid + "_" + oldrid)
            .removeClass("marked")
            .hide();
        if (_Xlistnode.length == _Xlistturn) {
            $(".showNum")
                .css("width", "200px")
                .css("margin-left", "-100px")
                .html("加载等待中的直播队列");
            $(".btn_blue")
                .first()
                .click();
        }
    };
    var X = () => {
        $(".X")[0].onclick = null;
        if ($(".marked").length) {
            if ($("#modeOne").attr("checked")) {
                //模式一
                $(".marked tr:nth-child(4) td a").each((i, e) => {
                    _Xlistnode.push(e);
                });
                $(".showNum")
                    .html("本批次剩余" + _Xlistnode.length + "个")
                    .show();
                _Xlistnode[_Xlistturn].click();
                _Xlistturn++;
            } else if ($("#modeTwo").attr("checked")) {
                //模式二
                _Xlistnode = $(".marked tr:nth-child(4) td a");
                $(".showNum")
                    .html("本批次剩余" + _Xlistnode.length + "个")
                    .show();
                _Xlistnode.each(function(i, e) {
                    let data = this.parentNode.parentNode.parentNode.parentNode.parentNode.id.split(
                        "_"
                    );
                    singleRef(data[1], data[2], 1, 2);
                });
            } else {
                alert("请选择批量X模式！！！");
            }
        } else {
            $(".btn_blue")
                .first()
                .click();
        }
    };
    //重点流IU渲染
    const rander = (width, height) => {
        $("span").each(function(i, e) {
            if (e.innerHTML === "才艺") {
                e.innerHTML = "才";
            } else if (e.innerHTML === "PK") {
                e.innerHTML = "";
            }
        });
        setTimeout(() => {
            $("object")
                .attr("width", width)
                .attr("height", height);
            $("embed")
                .attr("width", width)
                .attr("height", height);
            $(".content td").css("padding", "0");
            $('div[id^="div"]:visible')
                .css("float", "none")
                .css("display", "inline-block")
                .css("min-height", "260px");
            $('.content_div>table div[id^="div"]>table').css("width", "153px");
            $(".content")
                .css("margin-right", "0px")
                .css("margin-bottom", "0px");
            $('.content_div>table div[id^="div"]>table tr:nth-child(4) td')
                .children(':visible:not("a")')
                .css("float", "left")
                .css("width", "43px")
                .css("margin", "0");
            $('.content_div>table div[id^="div"]>table tr:nth-child(2) a')
                .css("float", "left")
                .css("width", "60px")
                .css("white-space", "nowrap")
                .css("overflow", "hidden");
            $('.content_div>table div[id^="div"]>table tr:nth-child(4) td')
                .children("a")
                .css("float", "left");
            $('.content_div>table div[id^="div"]>table tr:nth-child(4) td img')
                .css("width", "20px")
                .css("height", "20px");
            $('.content_div>table div[id^="div"]>table tr:nth-child(4) a').attr(
                "onclick",
                ""
            );
        }, 300);
    };
    //小视频视频介绍弹出可拖动播放窗口
    const openRight = (src, right, speed) => {
            if ($('#rightVideo')[0]) {
                $('#rightVideo')[0].pause();
            }
            $('#rightWrapper').remove();
            $('body').append(`<div  id="rightWrapper" style="position:fixed; right: ${right}px; top: 12vh; width: 456px;border:2px solid #f40;"><span style="position: absolute;left:0;top:0;height:6vh;width:6vh;line-height:6vh;text-align:center;font-size:2.6vh;border-radius:50%;background:rgba(0, 0, 0, .6); color:#fff;">×${speed}</span><video id="rightVideo" src=${src} controls style="width: 100%;"></video><span id="rightClose" style="position:absolute;right:0;top:0;width:6vh;height:6vh;line-height:6vh;text-align:center;font-size:6vh;border-radius:50%;background:rgba(0, 0, 0, .6); color:#fff;cursor:pointer;">×</span></div>`);
            $('#rightVideo')[0].playbackRate = speed;
            $('#rightVideo')[0].play();
            $("#rightWrapper").Tdrag();
            $('#rightWrapper>video')[0].onended = () => {
                $('#rightWrapper>video')[0].pause();
                $('#rightWrapper').remove();
            };
            $('#rightClose').click(() => {
                $('#rightWrapper>video')[0].pause();
                $('#rightWrapper').remove();
            })
        }
    const videoLanguage = () => {
        videojs.addLanguage('zh-CN', {
            "You aborted the media playback": "直播结束了",
            "A network error caused the media download to fail part-way.": "直播结束了",
            "The media could not be loaded, either because the server or network failed or because the format is not supported.": "直播结束了",
            "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "直播结束了"
        }); //设置video.js语言
    }
        //部分（常规文字）页面进审提醒
    if (
        location.href.match(/userHeadPicAction!userHeadCheckWomanRenzhen/g) ||
        location.href.match(/userHeadPicAction!userHeadCheckAll/g) ||
        location.href.match(/auditUserAciton!photoNoneblogindex/g) ||
        location.href.match(/groupChatPicAction!listUntreated/g) ||
        location.href.match(/groupAction!auditindex/g) ||
        location.href.match(/videoLivePic!liveAutoReviewList/g) ||
        location.href.match(/userFilterwordAction!index/g) ||
        location.href.match(/videoFile!videoFileAuditList/g)
    ) {
        if (location.href.match(/videoFile!videoFileAuditList/g)) {
            $('input[value="拉黑"]').after('<input type="button" style="padding:2;vertical-align: top;margin-left: 8px;" class="btn_blue openright-now" value="×1.0" speed="1.0"><input type="button" style="padding:2;vertical-align: top;margin-left: 8px;" class="btn_blue openright-now" value="×1.5" speed="1.5"><input type="button" style="padding:2;vertical-align: top;margin-left: 8px;" class="btn_blue openright-now" value="×2.0" speed="2.0"><input type="button" style="padding:2;vertical-align: top;margin-left: 8px;" class="btn_blue openright-now" value="×2.5" speed="2.5"><input type="button" style="padding:2;vertical-align: top;margin-left: 8px;" class="btn_blue openright-now" value="×3.0" speed="3.0">');
            $('.openright-now').click((e) => {
                openRight($(e.target).parent().find('a').eq(1).attr('href') ? $(e.target).parent().find('a').eq(1).attr('href') : $(e.target).parent().parent().prev().find('video').eq(0).attr('src'), 123, $(e.target).attr('speed'))
            })
        }
        enterLogin(
            $('a[title="提交"]').first().length ?
            $('a[title="提交"]').first() :
            $('a[title="操 作"]').first()
        );
        $("img").length > 2 ? $refresherInsert(true) : $refresherInsert();
    } else if (location.href.match(/videoLivePic!getHotLiveVideoList/g)) {
        $("img").length > 0 ? $refresherInsert(true) : $refresherInsert();
        //小视频
    } else if (location.href.match(/smallVideoAudit!getAuditList/g)) {
        enterLogin($('a[title="提交"]').first());
        $(".box").length > 0 ? $refresherInsert(true) : $refresherInsert();
        $('.box p:nth-child(7)').html('<input type="button" style="padding:2;vertical-align: top;margin-left: 8px;" class="btn_blue openright-now" value="×1.0" speed="1.0"><input type="button" style="padding:2;vertical-align: top;margin-left: 8px;" class="btn_blue openright-now" value="×1.5" speed="1.5"><input type="button" style="padding:2;vertical-align: top;margin-left: 8px;" class="btn_blue openright-now" value="×2.0" speed="2.0"><input type="button" style="padding:2;vertical-align: top;margin-left: 8px;" class="btn_blue openright-now" value="×2.5" speed="2.5"><input type="button" style="padding:2;vertical-align: top;margin-left: 8px;" class="btn_blue openright-now" value="×3.0" speed="3.0">')
        $('.openright-now').click((e) => {
                openRight($(e.target).parent().parent().find('video').eq(0).attr('src'), 678, $(e.target).attr('speed'))
            })
            //小视频已通过
    } else if (location.href.match(/smallVideoAudit!getPassList/g) || location.href.match(/smallVideoAudit!getUnPassList/g)) {
        $('tr video').parent().parent().find('td:nth-child(6)').append('<br><input type="button" style="padding:2;vertical-align: top;margin: 8px;" class="btn_blue openright-now" value="×1.0" speed="1.0"><input type="button" style="padding:2;vertical-align: top;margin: 8px;" class="btn_blue openright-now" value="×1.5" speed="1.5"><input type="button" style="padding:2;vertical-align: top;margin: 8px;" class="btn_blue openright-now" value="×2.0" speed="2.0"><input type="button" style="padding:2;vertical-align: top;margin: 8px;" class="btn_blue openright-now" value="×2.5" speed="2.5"><input type="button" style="padding:2;vertical-align: top;margin: 8px;" class="btn_blue openright-now" value="×3.0" speed="3.0">')
        $('.openright-now').click((e) => {
                openRight($(e.target).parent().parent().find('video').eq(0).attr('src'), 456, $(e.target).attr('speed'));
            })
            //私聊广告消息进审提醒
    } else if (location.href.match(/imMsgAction!toAuditList/g)) {
        setTimeout(() => {
            if (
                $(".pag")[0].offsetHeight > 51 ||
                $(".pag")[1].offsetHeight > 51 ||
                $(".pag")[2].offsetHeight > 51
            ) {
                $refresherInsert(true);
                $(".content_div input:button").click(() => {
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                });
            } else {
                $refresherInsert();
            }
        }, 500);
        //直播截屏审核
    } else if (
        location.href.match(/videoLiveAuditAction!videoliveScreenAuditList/g)
    ) {
        //提交londing动画
        $(
            '<div class="loading" style="display: none; cursor: pointer; width: 300px; height: 40px; background: #f40; border-radius: 8px; opacity: 0.8; color: #fff; position: fixed; left: 50%; top: 50%; margin-left: -150px; margin-top: -20px; line-height: 40px; text-align: center; font-size: 28px;">提交中，请稍后</div>'
        ).appendTo("body");
        //控制面板写入
        $(
            '<div class="mytool"style="float:right; margin: 8px 0px;font-size: 12px; position: absolute; right: 160px; bottom: 0px;"><span class="how" style="font-size: 8px; color: blue; cursor: pointer; ">如何使用？</span><span class="btn_blue C">点击所有图片</span><span style="font-weight:bold;"> 当前页面停留时间：</span><span class="keepTime" style="color:red; min-width: 16px; display:inline-block;font-weight:bold;text-align:right;">0</span><span> 秒 </span><span style="font-weight:bold;"> 刷新次数：</span><span class="refreshTimes" style="color:red;display:inline-block;font-weight:bold;text-align:right;">0</span><span> 次 </span><span style="font-weight:bold;"> 已审核：</span><span class="total" style="color:red;display:inline-block;font-weight:bold;text-align:right;">0</span><span> 张 </span><label for="autInput" style="font-weight:bold; cursor: pointer; ">图片尺寸：</label><input id="autInput" type="input" style="width:22px; height:16px; font-size: 12px; cursor: pointer; "><span>（px）</span><label for="rightPush" style="font-weight:bold; cursor: pointer; "> 右键推流：</label><input id="rightPush" type="checkbox" style="vertical-align: middle; cursor: pointer; width: 12px; height: 12px;">&nbsp&nbsp<label for="hdButton" style="font-weight:bold; cursor: pointer; "> 隐藏按钮：</label><input id="hdButton" type="checkbox" style="vertical-align: middle; cursor: pointer; width: 12px; height: 12px;">&nbsp&nbsp<label for="dbClick" style="font-weight:bold; cursor: pointer; ">双击页面换一批：</label><input id="dbClick" type="checkbox" style="vertical-align: middle; cursor: pointer; width: 12px; height: 12px;"></div>'
        ).appendTo(".toolbar:last");
        $(
            '<div class="success" style="display: none; cursor: pointer; width: 200px; height: 40px; background: #f40; border-radius: 8px; opacity: 0.8; color: #fff; position: fixed; left: 50%; top: 72px; margin-left: -150px; line-height: 40px; text-align: center; font-size: 28px;">推流成功</div>'
        ).appendTo("body");
        //弹出使用说明
        $(".how").click(function() {
            alert(
                "    1 图片尺寸设置即直播截屏宽度设置，设置不同的宽度会按照图片原有比例对应设置图片高度。。可根据个人喜好和电脑屏幕宽高设置，设置自定义宽度须先点击自定义按钮，随后进行设置。设置值为大于等于130小于等于25的纯阿拉伯数字。\n    2当前脚本对截屏审核界面做了比较大的改动，为了尽可能多的展示图片内容。隐藏掉了 拉黑 推荐 按钮，并且将用户昵称，才艺，PK中，接收方，发起方这些文字信息做了简短处理。但是如果想查看完整的用户昵称信息，只需要将鼠标悬停在经过处理的昵称上就可以了。\n    4 双击页面换一批为，当选中开启后，在页面的任意地方双击会触发 换一批 按钮的单击执行。默认为关闭！\n 以上所有效果均为在当前页面设置，在提交 换一批 之后的所有此页面上生效。关闭当前选项卡之后所有设置的参数会被清空，再次打开请重新设置！\n    5 当鼠标移动到需要处罚的用户时，可以触发快捷键。鼠标移出时失效Q警告，W下榜E禁播R推流T换一批，同时键盘回车可以换一批，鼠标右键也可以推流\n    6  隐藏按钮为当选中后用户界面的处罚按钮都会会被隐藏。此时，你可以选择用键盘操作处罚或者将鼠标移到要处罚的用户点击鼠标中键显示按钮！"
            );
        });
        $(".C").click(() => {
            $("img").click();
        });
        //定义参数变量
        let keepTime = 0,
            size,
            db,
            hd,
            refreshTimes = 0,
            demon = 0,
            total = 0,
            rp;
        //当前页面停留时间开始计时
        setInterval(() => {
            $(".keepTime").html(keepTime);
            keepTime++;
            if (keepTime === 9999) {
                $(".btn_blue")
                    .first()
                    .click();
            }
        }, 1000);
        $(".toolbar .btn_blue:not('.C')").click(function() {
            $(".toolbar .btn_blue").hide();
            $(".loading").css("display", "block");
            let i = 0;
            setInterval(() => {
                if (i % 4 == 0) {
                    $(".loading").html("提交中，请稍后");
                } else if (i % 4 == 1) {
                    $(".loading").html(". 提交中，请稍后 .");
                } else if (i % 4 == 2) {
                    $(".loading").html(". . 提交中，请稍后 . .");
                } else if (i % 4 == 3) {
                    $(".loading").html(". . . 提交中，请稍后 . . .");
                }
                i++;
            }, 200);
            //记录审核刷新次数和已审核
            document.cookie = `refreshTimes=${parseInt(
        document.cookie.match(/refreshTimes=\d+/g)[0].match(/\d+/g)[0]
      ) + 1};`;
            document.cookie = `total=${parseInt(
        document.cookie.match(/total=\d+/g)[0].match(/\d+/g)[0]
      ) + $(".content_div table").length};`;
        });
        //页面加载完成后对图片进行重新渲染
        document.onreadystatechange = () => {
            if (document.readyState == "complete") {
                //取消出发弹窗动画
                $(".close").hide();
                $(".showpic tbody tr:nth-child(3) input:visible").click(function() {
                    setTimeout(() => {
                        cancelAnimate();
                        var target = this.parentNode.parentNode.parentNode.parentNode;
                        var offset = $(target).offset();
                        if (
                            offset.left + target.offsetWidth + 300 >
                            document.body.offsetWidth
                        ) {
                            $(".showbox:visible")[0].style.left = offset.left - 300 + "px";
                            $(".showbox:visible")[0].style.top = offset.top + "px";
                        } else {
                            $(".showbox:visible")[0].style.left =
                                offset.left + target.offsetWidth + "px";
                            $(".showbox:visible")[0].style.top = offset.top + "px";
                        }
                        $(".showbox:visible").on("click", "input", function(e) {
                            cancelAnimate();
                        });
                    }, 10);
                });
                //根据设定参数添加相应功能
                if (
                    document.cookie.match(/size=\d+/g) &&
                    document.cookie.match(/db=\d/g) &&
                    document.cookie.match(/hd=\d/g) &&
                    document.cookie.match(/refreshTimes=\d+/g) &&
                    document.cookie.match(/total=\d+/g) &&
                    document.cookie.match(/rp=\d/g)
                ) {
                    size = parseInt(
                        document.cookie.match(/size=\d+;/g)[0].match(/\d+/g)[0]
                    );
                    db = parseInt(document.cookie.match(/db=\d/g)[0].match(/\d/g)[0]);
                    hd = parseInt(document.cookie.match(/hd=\d/g)[0].match(/\d/g)[0]);
                    rp = parseInt(document.cookie.match(/rp=\d/g)[0].match(/\d/g)[0]);
                    refreshTimes = parseInt(
                        document.cookie.match(/refreshTimes=\d+/g)[0].match(/\d+/g)[0]
                    );
                    total = parseInt(
                        document.cookie.match(/total=\d+/g)[0].match(/\d+/g)[0]
                    );
                    $(".refreshTimes").html(refreshTimes); //刷新次数
                    $(".total").html(total); //已审核
                    setSize(size); //设置图片尺寸
                    setButtonSize(size); //设置按钮尺寸
                    setTitleSize(size); //设置昵称
                    $("#autInput").val(size);
                    if (db) {
                        //是否双击换一批
                        $("#dbClick").attr("checked", true);
                        $(document).one("dblclick", () => {
                            $(".btn_blue")
                                .first()
                                .click();
                        });
                    }
                    if (hd) {
                        //是否隐藏按钮
                        $("#hdButton").attr("checked", true);
                        $("table input:visible")
                            .add(".showpic tbody tr:nth-child(3)")
                            .addClass("hidebtn")
                            .hide();
                    }
                    if (rp) {
                        //是否鼠标右键推流
                        $("#rightPush").attr("checked", true);
                    }
                    //首次开启截屏审核的默认样式
                } else {
                    document.cookie = "size=131;";
                    document.cookie = "db=0;";
                    document.cookie = "hd=0;";
                    document.cookie = "rp=0;";
                    document.cookie = "refreshTimes=0;";
                    document.cookie = "demon=0;";
                    document.cookie = "total=0;";
                    $("#autInput").val(131);
                    setSize(131);
                    setButtonSize(130);
                    setTitleSize(130);
                }
                //控制面板事件处理
                $(".mytool").on("click", "input", function(e) {
                    if (this.id === "dbClick") {
                        if ($(this).is(":checked")) {
                            document.cookie = "db=1;";
                        } else {
                            document.cookie = "db=0;";
                        }
                    } else if (this.id === "hdButton") {
                        if ($(this).is(":checked")) {
                            document.cookie = "hd=1;";
                        } else {
                            document.cookie = "hd=0;";
                        }
                    } else if (this.id === "rightPush") {
                        if ($(this).is(":checked")) {
                            document.cookie = "rp=1;";
                        } else {
                            document.cookie = "rp=0;";
                        }
                    }
                });
                //自定义图片尺寸处理
                $("#autInput").mousedown(function() {
                    this.value = "";
                });
                $("#autInput")
                    .prev()
                    .mousedown(function() {
                        $("#autInput").val("");
                    });
                $("#autInput").blur(function() {
                    const value = parseInt(this.value);
                    if (value < 130) {
                        document.cookie = "size=130;";
                        this.value = 130;
                        alert("设定宽度过小，已经为你设置为130px");
                    } else if (parseInt(this.value.trim()) > 250) {
                        document.cookie = "size=250;";
                        this.value = 250;
                        alert("设定宽度过大，已经为你设置为250px");
                    } else if (value >= 130 && value <= 250) {
                        document.cookie = `size=${value};`;
                        this.value = value;
                    } else {
                        this.value = size;
                        alert("请输入设定宽度");
                    }
                });
                window.scrollTo(0, 72); //页面自动滚动
                $("body").css("-webkit-user-select", "none"); //页面内文字不可选
                $(".showpic")
                    .each(function(i, e) {
                        $(e).css({
                            //设定截屏容器最小宽高，修复空白bug
                            margin: "0px 3px",
                            float: "none",
                            display: "inline-block",
                            "margin-right": "-4px",
                            "min-height": "250px",
                            position: "relative",
                            overflow: "hidden"
                        });
                        if ($(e).find('span:contains("PK")').length) {
                            var oldImg = $(this)
                                .find("img")
                                .first();
                            let src = oldImg[0].src;
                            let style = oldImg.attr("style");
                            let id = oldImg.attr("id");
                            let onclick = oldImg.attr("onclick");
                            let onload = oldImg.attr("onload");
                            oldImg.attr("id", id + "-remove");
                            var newBox = $(
                                `<div class="newBox" style="width: ${size * 2 +
                  3}px; height: ${size *
                  1.8}px; position: absolute; left: 0px; top: 0px; overflow: hidden; "></div>`
                            ).appendTo(this);
                            var newImg = $("<img>")
                                .attr("id", id)
                                .attr("src", src)
                                .attr("style", style)
                                .attr("onclick", onclick)
                                .attr("onload", onload)
                                .css("width", `${size * 2 + 3}px`)
                                .css("height", `${size * 4.19847328}px`)
                                .css("position", "absolute")
                                .css("top", `${size * -1.08396946}px`)
                                .css("left", "0px")
                                .appendTo(newBox);
                            var atten = $(
                                '<div class="atten" style="width: 100%; height: 16px; position: absolute; left: 0px; bottom: 0px; z-index: 0; color: #fff; text-align: center; background-color: #f40;font-weight: bold; font-size; 14px;">< PK中 ></div>'
                            ).appendTo(newBox);
                        }
                    })
                    .children("table")
                    .css({
                        width: "130px",
                        margin: "0",
                        height: "250px",
                        padding: "0px"
                    });
                //去掉性别
                $("tbody tr:nth-child(2) td font").each(function(i, e) {
                    e.style.display = "none";
                });
                //简短用户文字信息
                $("span").each(function(i, e) {
                    if (e.innerHTML === "才艺") {
                        e.innerHTML = "";
                    } else if (e.innerHTML === "PK") {
                        e.style.display = "none";
                        e.parentNode.className = "pk";
                    } else if (e.innerHTML === "已推流") {
                        e.innerHTML = "已推";
                        e.style.float = "right";
                        e.style.marginRight = "10px";
                    }
                });
                //键盘操作处理和推流
                function enter(that) {
                    that.tabIndex = 0;
                    that.focus();
                    that.parentNode.style.outline = "blue solid 2px";
                    if (
                        $(that).siblings("table").length === 0 ||
                        $(that).find(".pk").length
                    ) {
                        if ($(that).find("tr:nth-child(2) input:button").length) {
                            $(that)
                                .find("input:button")
                                .first()
                                .attr("onclick", "");
                            let data = that.parentNode.id.split("_");
                            $(that).find("input:button")[0].onclick = function() {
                                addEmpasisUser(data[2], data[1]);
                            };
                        }
                    }
                    $(that)
                        .find("tr:nth-child(3) input:button:visible")
                        .hover(
                            function() {
                                $(this)
                                    .css("color", "blue")
                                    .css("font-size", "14px")
                                    .css("padding", "0px");
                            },
                            function() {
                                $(this)
                                    .css("color", "#000")
                                    .css("font-size", "12px")
                                    .css("padding", "0 10px");
                            }
                        );
                    that.onkeydown = function(e) {
                        if (e.code == "KeyQ") {
                            $(that)
                                .find(".btn_blue")
                                .filter(function(i, e) {
                                    if (e.value == "警告") {
                                        $(e).click();
                                    }
                                });
                        } else if (e.code == "KeyW") {
                            $(that)
                                .find(".btn_blue")
                                .filter(function(i, e) {
                                    if (e.value == "下榜") {
                                        $(e).click();
                                    }
                                });
                        } else if (e.code == "KeyE") {
                            $(that)
                                .find(".btn_blue")
                                .filter(function(i, e) {
                                    if (e.value == "禁播") {
                                        $(e).click();
                                    }
                                });
                        } else if (e.code == "KeyR") {
                            $(that)
                                .find(".btn_blue")
                                .filter(function(i, e) {
                                    if (e.value == "推流") {
                                        $(e).click();
                                    }
                                });
                        } else if (e.code == "KeyT") {
                            that.onkeydown = null;
                            $(".btn_blue")
                                .first()
                                .click();
                        }
                    };
                    if (rp) {
                        that.oncontextmenu = () => {
                            $(that)
                                .find(".btn_blue")
                                .filter(function(i, e) {
                                    if (e.value == "推流") {
                                        $(e).click();
                                    }
                                });
                            return false;
                        };
                    }
                    that.onmousedown = e => {
                        if (e.button == 1) {
                            if (hd) {
                                let newheight =
                                    parseInt(
                                        $(that)
                                        .find("img")
                                        .first()
                                        .css("height")
                                    ) - 23;
                                $(that)
                                    .find("img")
                                    .first()
                                    .css("height", newheight + "px");
                                $(that)
                                    .find(".hidebtn")
                                    .show();
                                that.onmousedown = null;
                                return false;
                            }
                        }
                    };
                }

                function out(that) {
                    that.tabIndex = 9999;
                    that.blur();
                    that.parentNode.style.outline = "none";
                    that.onkeydown = null;
                    that.oncontextmenu = null;
                    that.onmousedown = null;
                }
                $(".content_div").on("mouseover", "table", function(e) {
                    var that = this;
                    enter(that, 1);
                });
                $(".content_div").on("mouseleave", "table", function(e) {
                    var that = this;
                    out(that, 1);
                });
                $(".content_div").on("mouseover", 'div[class="newBox"]', function(e) {
                    var that = $(this)
                        .parent()
                        .children("table:first")[0];
                    enter(that, 0);
                    if (
                        $(that).siblings("table").length === 0 ||
                        $(that).find(".pk").length
                    ) {
                        if ($(that).find("tr:nth-child(2) input:button").length) {
                            let data = that.parentNode.id.split("_");
                            $(that)
                                .find("input:button")
                                .first()
                                .attr("onclick", "")
                                .click(function() {
                                    addEmpasisUser(data[2], data[1]);
                                });
                        }
                    }
                    if (rp) {
                        this.oncontextmenu = () => {
                            $(this.parentNode)
                                .find("tr:nth-child(2):first input:button")
                                .filter(function(i, e) {
                                    if (e.value == "推流") {
                                        $(e).click();
                                    }
                                });
                            return false;
                        };
                    }
                    this.onmousedown = e => {
                        if (e.button == 1) {
                            if (hd) {
                                let newheight =
                                    parseInt(
                                        $(this.parentNode)
                                        .find(".newBox")
                                        .css("height")
                                    ) - 26;
                                $(this.parentNode)
                                    .find(".newBox")
                                    .css("height", newheight + "px");
                                $(this.parentNode).find("img")[0].style.height =
                                    newheight + "px";
                                $(this.parentNode).find("img")[1].style.height =
                                    newheight + "px";
                                $(this.parentNode)
                                    .find(".hidebtn")
                                    .show();
                                this.onmousedown = null;
                                return false;
                            }
                        }
                    };
                });
                $(".content_div").on("mouseleave", 'div[class="newBox"]', function(e) {
                    var that = $(this)
                        .parent()
                        .children("table:first")[0];
                    out(that, 0);
                });
                //压缩表格行高
                $(".showpic tbody tr:nth-child(1)").css("height", "190px");
                $(".showpic tbody tr:nth-child(2)").css("height", "10px");
                $(".showpic tbody tr:nth-child(3)").css("height", "10px");
                $(".showpic tbody tr:nth-child(4)").css("height", "10px");
                $(".showpic tbody tr td").css("padding", "0px");
            }
        };

        //一对一坐等
    } else if (location.href.match(/videoLivePic!getSingleVideoLiveAuditList/g)) {
        let width = 132;
        let height = width * 1.77;
        $(
            '<div class="mytool"style="float:right; margin: 8px 0px;font-size: 12px; position: absolute; right: 0px; top: 4px;"><span class="how" style="font-size: 8px; color: blue; cursor: pointer; ">如何使用？</span><span style="font-weight:bold;"> 当前页面停留时间:</span><span class="keepTime" style="color:red; min-width: 12px; display:inline-block;font-weight:bold;text-align:right;">0</span><span> s </span>&nbsp&nbsp<label for="dbClick" style="font-weight:bold; cursor: pointer; ">双击页面换一批：</label><input id="dbClick" type="checkbox" style="vertical-align: middle; cursor: pointer; width: 12px; height: 12px;">&nbsp&nbsp&nbsp&nbsp</div>'
        ).appendTo("body");
        $(
            '<div class="loading" style="display: none; cursor: pointer; width: 300px; height: 40px; background: #f40; border-radius: 8px; opacity: 0.6; color: #fff; position: fixed; left: 50%; top: 50%; margin-left: -150px; margin-top: -20px; line-height: 40px; text-align: center; font-size: 28px;">提交中，请稍后</div>'
        ).appendTo("body");
        let keepTime = 0;
        setInterval(() => {
            $(".keepTime").html(keepTime);
            keepTime++;
        }, 1000);
        enterLogin($(".btn_blue").first());
        $("body").css("-webkit-user-select", "none");
        $("font").each(function(i, e) {
            if (e.innerHTML == "男") {
                $(e)
                    .css("color", "blue")
                    .parent()
                    .css("background", "#f40");
            }
        });
        setTimeout(() => {
            if (document.cookie.match(/dbY=\d/g)) {
                db = parseInt(document.cookie.match(/dbY=\d/g)[0].match(/\d/g)[0]);
                if (db) {
                    $("#dbClick").attr("checked", true);
                    $(document).one("dblclick", () => {
                        $(".btn_blue")
                            .first()
                            .click();
                    });
                }
            } else {
                document.cookie = "dbY=0;";
            }
            $("object")
                .attr("width", width)
                .attr("height", height);
            $("embed")
                .attr("width", width)
                .attr("height", height);
            $('div[id^="video"]').css("position", "relative");
            $('div[id^="div"]')
                .css("float", "none")
                .css("display", "inline-block")
                .css("min-height", "260px");
            $('.content_div>div>table div[id^="div"]>table').css("width", "130px");
            $(".content")
                .css("margin-right", "0px")
                .css("margin-bottom", "0px");
            $(".content_div>div>table").on("mouseenter", "table", function() {
                $(this)
                    .find('div[id^="video"]')
                    .append(
                        '<div class= "hoverbutton" style="opacity: 0.8; position: absolute; right: 0; top:0; width:132px; height: 18px;"><button class ="warn" style="width: 44px; height: 20px; background-color: #2ae; color: #fff; box-sizing: border-box; cursor: pointer; border: 1px solid blue; border-radius: 8px;" type="button">警告</button><button style="width: 44px; height: 20px; background-color: #000; color: #fff; box-sizing: border-box; cursor: pointer; border: 1px solid #ccc; border-radius: 8px;" type="button" class ="black">拉黑</button><button style="width: 44px; height: 20px; background-color: #f0f; color: #fff; box-sizing: border-box; cursor: pointer; border: 1px solid #f40; border-radius: 8px;" type="button" class="sex">色情</button></div>'
                    );
                $(".warn").hover(
                    function() {
                        $(this)
                            .css("color", "#2ae")
                            .css("background-color", "#fff");
                    },
                    function() {
                        $(this)
                            .css("color", "#fff")
                            .css("background-color", "#2ae");
                    }
                );
                $(".black").hover(
                    function() {
                        $(this)
                            .css("color", "black")
                            .css("background-color", "#fff");
                    },
                    function() {
                        $(this)
                            .css("color", "#fff")
                            .css("background-color", "black");
                    }
                );
                $(".sex").hover(
                    function() {
                        $(this)
                            .css("color", "#f0f")
                            .css("background-color", "#fff");
                    },
                    function() {
                        $(this)
                            .css("color", "#fff")
                            .css("background-color", "#f0f");
                    }
                );
                $(".warn").click(function() {
                    $(this)
                        .parent()
                        .parent()
                        .parent()
                        .parent()
                        .parent()
                        .find("input:button:nth-child(1)")
                        .click();
                });
                $(".black").click(function() {
                    $(this)
                        .parent()
                        .parent()
                        .parent()
                        .parent()
                        .parent()
                        .find("input:button:nth-child(2)")
                        .click();
                });
                $(".sex").click(function() {
                    $(this)
                        .parent()
                        .parent()
                        .parent()
                        .parent()
                        .parent()
                        .find("input:button:nth-child(3)")
                        .click();
                });
            });
            $(".content_div>div>table").on("mouseleave", "table", function() {
                $(".hoverbutton").hide();
                this.oncontextmenu = null;
            });
            $(
                '.content_div>div>table div[id^="div"]>table tbody tr:nth-child(2) td a:nth-child(2)'
            ).hide();
            $(
                '.content_div>div>table div[id^="div"]>table tbody tr:nth-child(3)'
            ).hide();
            $(
                '.content_div>div>table:nth-child(2) div[id^="div"]>table tr:nth-child(4)'
            ).hide();
            $(".mytool").on("click", "input", function(e) {
                if (this.id === "dbClick") {
                    if ($(this).is(":checked")) {
                        document.cookie = "dbY=1;";
                    } else {
                        document.cookie = "dbY=0;";
                    }
                }
            });
            $(".how").click(function() {
                alert("参考直播截屏审核插件使用方法");
            });
        }, 666);
        $(".toolbar .btn_blue")
            .first()
            .click(function() {
                $(".loading").css("display", "block");
                let i = 0;
                setInterval(() => {
                    if (i % 4 == 0) {
                        $(".loading").html("提交中，请稍后");
                    } else if (i % 4 == 1) {
                        $(".loading").html(". 提交中，请稍后 .");
                    } else if (i % 4 == 2) {
                        $(".loading").html(". . 提交中，请稍后 . .");
                    } else if (i % 4 == 3) {
                        $(".loading").html(". . . 提交中，请稍后 . . .");
                    }
                    i++;
                }, 200);
            });
        //重点流
    } else if (
        location.href.match(/videoLiveAuditAction!videoliveFlowAuditList/g)
    ) {
        let width = 153; //设置重点流UI
        let height = width * 1.77;
        rander(width, height);
        $("body").css("-webkit-user-select", "none");
        $(
            '<div class="mytool"style="float:right; margin: 8px 0px;font-size: 12px; position: absolute; right: 0px; top: 4px;"><span style="font-size: 8px; color: red; cursor: pointer; "></span><span class="how" style="font-size: 8px; color: blue; cursor: pointer; ">如何使用？</span><input type="button" class="btn_blue X" value="批量X">&nbsp&nbsp<label for="modeOne" style="font-weight:bold; cursor: pointer; "> [模式一] </label><input id="modeOne" type="radio" name="mode" style="vertical-align: middle; cursor: pointer; width: 12px; height: 12px;"><label for="modeTwo" style="font-weight:bold; cursor: pointer; "> [模式二] </label><input id="modeTwo" type="radio" name="mode" style="vertical-align: middle; cursor: pointer; width: 12px; height: 12px;">&nbsp&nbsp&nbsp&nbsp<label for="dbClick" style="font-weight:bold; cursor: pointer; "> 双击页面换一批：</label><input id="dbClick" type="checkbox" style="vertical-align: middle; cursor: pointer; width: 12px; height: 12px;">&nbsp&nbsp&nbsp&nbsp</div>'
        ).appendTo("body");
        $(
            '<div class="listNull" style="display: none; cursor: pointer; width: 300px; height: 40px; background: #f40; border-radius: 8px; opacity: 0.8; color: #fff; position: fixed; left: 50%; top: 72px; margin-left: -150px; line-height: 40px; text-align: center; font-size: 28px;">直播队列无等待人数!</div>'
        ).appendTo("body");
        $(
            '<div class="loading" style="display: none; cursor: pointer; width: 300px; height: 40px; background: #f40; border-radius: 8px; opacity: 0.6; color: #fff; position: fixed; left: 50%; top: 50%; z-index: 3;margin-left: -150px; margin-top: -20px; line-height: 40px; text-align: center; font-size: 28px;">加载中，请稍后</div>'
        ).appendTo("body");
        $(
            '<div class="showNum" style="display: none; cursor: pointer; width: 120px; height: 38px; background: #f40; border-radius: 8px; opacity: 0.8; color: #fff; position: fixed; left: 50%; margin-left: -60px; top: 0; line-height: 20px; vertical-align: top;line-height: 40px; text-align: center; font-size: 16px;">本批次剩余5个</div>'
        ).appendTo("body");
        let db, mode;
        if (document.cookie.match(/mode=\d/g)) {
            mode = parseInt(document.cookie.match(/mode=\d/g)[0].match(/\d/g)[0]);
            if (mode == 1) {
                $("#modeOne").attr("checked", "checked");
            } else if (mode == 2) {
                $("#modeTwo").attr("checked", "checked");
            }
        }
        if (document.cookie.match(/dbZ=\d/g)) {
            db = parseInt(document.cookie.match(/dbZ=\d/g)[0].match(/\d/g)[0]);
            if (db) {
                //是否双击换一批
                $("#dbClick").attr("checked", true);
                $(document).one("dblclick", () => {
                    $(".btn_blue")
                        .first()
                        .click();
                });
            }
        } else {
            document.cookie = "dbZ=0;";
        }
        $(".mytool").on("click", "input", function(e) {
            if (this.id === "dbClick") {
                if ($(this).is(":checked")) {
                    document.cookie = "dbZ=1";
                } else {
                    document.cookie = "dbZ=0";
                }
            }
        });
        $("#modeOne").click(function() {
            document.cookie = "mode=1";
        });
        $("#modeTwo").click(function() {
            document.cookie = "mode=2";
        }); //使用说明
        $(".how").click(function() {
            alert(
                "    鼠标右键标记/取消标记需要叉掉的用户。选好后点击右上角 批量X 即可，如果没有标记需要批量叉掉的用户，点击 批量叉 等同于点击 换一批 按钮  \n     ps: 批量叉掉功能是通过插件重写了原来网页的部分回调函数，复制并简化了公司自定义的ajax对象使得我们可以通过插件与服务器通信提交各种审核数据，因此在功能上与逻辑上和以前没有本质区别。同时因为都涉及到网络通信接受发送，所以从点击叉掉到服务器接收到请求都是需要一定时间的，尤其是选择批量叉掉的数量较多时。因此，对于如何批量叉掉就有了两种解决方案，也就是模式一和模式二。这两种模式的基本逻辑基本一致，都是通过插件代码逻辑遍历当前批次用户并逐个向服务器发送数据并接受响应，而且在直播队列无等待人数时的表现行为一致，都时提示无等待人数。区别就在于直播队列有等待人数时，各自的表现为：\n     [模式一]：当当前批次开始遍历时（当选中了几个用户后点击批量叉掉时），后一个要发送的用户数据会在前一个发送的用户数据得到响应并判断响应数据中是否有正在等待的用户信息（如果有则将正在等待的用户插入到页面的相应位置，否则提示当前直播队列无等待人数）后才会发送。因此模式一可以理解为同步的，第一个叉掉后判断有无等待用户，有的话就插入页面，没有就提示无等待。然后才开始叉掉第二个，以此类推。\n    优点：和单个叉掉的表现行为一致，符合审核习惯，易于接受和理解。\n    缺点：需要逐个判断读取插入等操作，阻塞效果明显，速度慢（批次单个平均时间约1.3秒）\n     [模式二]当当前批次开始遍历时（当选中了几个用户后点击批量叉掉时），后一个要发送的用户数据不会关注前一个发送的用户数据的任何响应，所以模式二当点击批量叉按钮式，当前批次的用户数据几乎是同时发送出去的，之后等待这批次的响应逐个从服务器返回，如果其中一个响应数据中显示有正在等待的用户，那么程序会在接收到的响应数量等于当前批次叉掉的数量时刷新页面，将等待用户在刷新后的页面上展示。\n    优点：点击批量叉后程序只关注数据的发送和接受响应的数量，把将等待用户渲染到页面的工作留给刷新后的页面，速度快（批次单个平均时间约0.6秒）。\n    缺点： 与原来的审核习惯不符。批量叉掉后刷新出的极个别用户界面不带叉（原因未知），但是插件对此进行了修复，当鼠标移入到没有叉的用户时，插件会自动为你创建一个可用的叉！！！"
            );
        });
        //批量叉掉,根据标记确定边框颜色
        $(".content_div>table").on("mouseenter", "table", function() {
            if (
                $(this)
                .parent()
                .hasClass("marked")
            ) {
                this.parentNode.style.outline = "#f40 solid 2px";
            } else {
                this.parentNode.style.outline = "blue solid 2px";
            }
            this.oncontextmenu = function() {
                return false;
            };
            let data = this.parentNode.id.split("_");
            if ($(this).find("tr:nth-child(4) a").length) {
                $(this).find("tr:nth-child(4) a")[0].onclick = function() {
                    singleRef(data[1], data[2], 1, 1);
                    $("table tr:nth-child(4) a").hide();
                };
            } else {
                $(this)
                    .find("tr:nth-child(4) td")
                    .append(
                        `<a class="newX" style="cursor:pointer; float: right;"><img style="width: 20px; height: 20px;" src="/images/close.png" ></a>`
                    );
                $(".newX").click(function() {
                    singleRef(data[1], data[2], 1, 1);
                });
            }
            this.onmousedown = function(e) {
                if (e.buttons == 2) {
                    if (
                        $(this)
                        .parent()
                        .hasClass("marked")
                    ) {
                        $(this)
                            .parent()
                            .removeClass("marked");
                        this.parentNode.style.outline = "blue solid 2px";
                    } else {
                        if ($(this).find("tr:nth-child(4) td a").length) {
                            $(this)
                                .parent()
                                .addClass("marked");
                            this.parentNode.style.outline = "#f40 solid 2px";
                        }
                    }
                }
            };
            $(this)
                .find("input:button:visible")
                .hover(
                    function() {
                        $(this)
                            .css("color", "blue")
                            .css("font-size", "14px")
                            .css("padding", "0px");
                    },
                    function() {
                        $(this)
                            .css("color", "#000")
                            .css("font-size", "12px")
                            .css("padding", "0 10px");
                    }
                );
        });
        $(".content_div>table").on("mouseleave", "table", function() {
            if (
                $(this)
                .parent()
                .hasClass("marked")
            ) {
                this.parentNode.style.outline = "#f40 solid 2px";
            } else {
                this.parentNode.style.outline = "none";
            }
        });
        $(".X")[0].onclick = X;
        $(".toolbar .btn_blue")
            .first()
            .click(function() {
                $(".loading").css("display", "block");
                let i = 0;
                setInterval(() => {
                    if (i % 4 == 0) {
                        $(".loading").html("加载中，请稍后");
                    } else if (i % 4 == 1) {
                        $(".loading").html(". 加载中，请稍后 .");
                    } else if (i % 4 == 2) {
                        $(".loading").html(". . 加载中，请稍后 . .");
                    } else if (i % 4 == 3) {
                        $(".loading").html(". . . 加载中，请稍后 . . .");
                    }
                    i++;
                }, 200);
            });
        //直播流
    } else if (location.href.match(/videoLivePic!getPopuLiveVideoListAudit/g)) {
        let width = 154;
        let height = width * 1.77;
        window.scrollTo(0, 10); //页面自动滚动
        setTimeout(() => {
            $("object")
                .attr("width", width)
                .attr("height", height);
            $("embed")
                .attr("width", width)
                .attr("height", height);
            $(".content td").css("padding", "0");
            $('.content_div div[id^="div"]>table')
                .css("width", "130px")
                .css("margin", "0")
                .css("margin-left", "1.5px");
            $('.content_div div[id^="div"]>table').each(function(i, e) {
                if ($(e).find('img[src="/images/down.png"]').length > 0) {
                    $(e)
                        .find("tr:nth-child(2) td")
                        .append(
                            '<img style="width:14px;height:14px;" src="/images/down.png">'
                        );
                } else if ($(e).find('img[src="/images/link.png"]').length > 0) {
                    $(e)
                        .find("tr:nth-child(2) td")
                        .append(
                            '<img style="width:14px;height:14px;" src="/images/link.png">'
                        );
                }
            });
            //////////////////////////////////////////////////
            setButtonSize(150);
            $("span").each(function(i, e) {
                if (e.innerHTML === "&nbsp;才艺&nbsp;") {
                    e.innerHTML = "";
                } else if (e.innerHTML === "&nbsp;PK中&nbsp;") {
                    e.innerHTML = "";
                } else if (e.innerHTML === "&nbsp;接收方&nbsp;") {
                    e.innerHTML = "接";
                } else if (e.innerHTML === "&nbsp;发起方&nbsp;") {
                    e.innerHTML = "发";
                }
            });
            $('.content_div  div[id^="div"] table tr:nth-child(3)').css(
                "display",
                "none"
            );
            $('.content_div  div[id^="div"] table tr:nth-child(4) a').css(
                "display",
                "none"
            );
        }, 300);

        $(
            '<div class="mytool"style="float:right; margin: 8px 0px;font-size: 12px; position: absolute; right: 0px; top: 4px;"><span class="how" style="font-size: 8px; color: blue; cursor: pointer; ">如何使用？</span><span style="font-weight:bold;"> 当前页面停留时间:</span><span class="keepTime" style="color:red; min-width: 12px; display:inline-block;font-weight:bold;text-align:right;">0</span><span> s </span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>'
        ).appendTo("body");
        $(
            '<div class="loading" style="display: none; cursor: pointer; width: 300px; height: 40px; background: #f40; border-radius: 8px; opacity: 0.6; color: #fff; position: fixed; left: 50%; top: 50%; margin-left: -150px; margin-top: -20px; line-height: 40px; text-align: center; font-size: 28px;">加载中，请稍后</div>'
        ).appendTo("body");
        let keepTime = 0;
        setInterval(() => {
            $(".keepTime").html(keepTime);
            keepTime++;
        }, 1000);
        let arrlist = [];
        let getobj = {};

        getobj["name"] = document.cookie.match(/username=\w+/)[0].split("=")[1];
        $('div[id^="div"] table a').each(function(i, e) {
            if (i % 3 == 0) {
                getobj[
                    `${e.innerHTML.trim()}`
                ] = e.parentNode.parentNode.parentNode.parentNode.parentNode.id.split(
                    "_"
                )[1];
            }
        });
        //////////////////////////
        $("input:submit")
            .first()
            .click(function() {
                getobj["time"] = +new Date();
                getobj["action"] = "change";
                getobj["keeptime"] = keepTime;
                $.get("http://39.96.73.206:8888/post", getobj);
                this.style.display = "none";
                this.nextSibling.nextSibling.style.display = "none";
                $(".loading").css("display", "block");
                let i = 0;
                setInterval(() => {
                    if (i % 4 == 0) {
                        $(".loading").html("加载中，请稍后");
                    } else if (i % 4 == 1) {
                        $(".loading").html(". 加载中，请稍后 .");
                    } else if (i % 4 == 2) {
                        $(".loading").html(". . 加载中，请稍后 . .");
                    } else if (i % 4 == 3) {
                        $(".loading").html(". . . 加载中，请稍后 . . .");
                    }
                    i++;
                }, 200);
            });
        $("input:button")
            .first()
            .click(function() {
                getobj["time"] = +new Date();
                getobj["action"] = "close";
                getobj["keeptime"] = keepTime;
                $.get("http://39.96.73.206:8888/post", getobj);
            });
        //总榜
    } else if (location.href.match(/videoLivePic!getPopuLiveVideoList.action/g)) {
        let width = 154;
        let height = width * 1.77;
        setTimeout(() => {
            $("span").each(function(i, e) {
                if (e.innerHTML === "才艺") {
                    e.innerHTML = "才";
                } else if (e.innerHTML === "PK") {
                    e.innerHTML = "";
                }
            });
            $("object")
                .attr("width", width)
                .attr("height", height);
            $("embed")
                .attr("width", width)
                .attr("height", height);
            $(".content td").css("padding", "0");
            $('.content_div div[id^="div"]>table')
                .css("width", "130px")
                .css("margin", "0")
                .css("margin-left", "1.5px");
            $('.content_div div[id^="div"]>table tr:nth-child(2) a')
                .css("float", "left")
                .css("width", "60px")
                .css("white-space", "nowrap")
                .css("overflow", "hidden")
                .each(function(i, e) {
                    $(e)
                        .parent()
                        .parent()
                        .parent()
                        .attr("title", $(e).html());
                });
            $('.content_div  div[id^="div"] table tr:nth-child(3) td input:visible')
                .css("float", "left")
                .css("width", "50px")
                .css("margin", "0");
        }, 300);
        //pk
    } else if (location.href.match(/videoLiveAuditAction!videolivePKFlowList/g)) {
        window.qcVideo = null
        $('<div id="video-wrapper" style="display: none; position: absolute; z-index:999;  width: 1350px; height: 950px; left: 0; top: 40px; background: #ccc; overflow: hidden;"><video id="video" autoplay preload="auto" style="position: absolute; width: 100%; top: -310px;"></video><span id="close-video" style="position: absolute; width: 100px; height: 100px; text-align: center; line-height: 85px; border-radius: 50%; background-color: rgba(0, 0, 0, .6); font-size: 100px; color: #fff; right: 0; z-index: 1000;">×</span></wrapper>').appendTo('body')
        $('<link href="https://unpkg.com/video.js/dist/video-js.css" rel="stylesheet"><script src="https://unpkg.com/video.js/dist/video.min.js"></script><script src="https://cdn.bootcss.com/videojs-contrib-hls/5.15.0/videojs-contrib-hls.min.js"></script><script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>').appendTo('head');
        $('<style>.vjs-control-bar{position: absolute;bottom: 0; !important; width: 300px; text-align: center; justify-content: center; color: #fff; background-color: transparent; z-index: 99; height: 20px;}.vjs-live-display,.vjs-seek-to-live-control,.vjs-play-control{display: none;}</style>').appendTo('head')
        const urls = $('head').html().match(/\/\/pili-live-rtmp.hzwangjiao.com\/fuliao-live\/\d+/g)
        let index = 0
        $('#close-video').click(() => {
            $('#video-wrapper').hide()
            videojs('video').pause()
            videojs('live' + index).play()
        })
        $("span").each(function(i, e) {
            if (e.innerHTML === "才艺") {
                e.innerHTML = "";
            }
        });
        $('.content_div table').css('margin', '0').css('height', 'auto')
        $('.content_div div table').attr('width', '300px')
        $('.content_div div[id^="div"]').attr('style', '').css('float', 'left').css('height', 'auto').css('border', '2px solid blue')
        $('.content_div td table').css('width', '149.9px').css('float', 'left')
        $('.content_div td').css('padding', '0')
        $('.content_div table input').css('margin', '0').css('float', 'left').css('width', '45px')
        $('.content_div table tr').css('height', 'auto')
            //$('div[id^="video"]').html('')
        $('.content_div div[id^="video"]').css('position', 'relative').css('height', '211px').css('overflow', 'hidden').each((i, e) => {
            let str = `
                      <span class="sound" style="width: 60px; height: 20px; position: absolute; left: 0; bottom: 10px; text-algin: center;cursor: pointer;z-index: 1; color: #fff; border: 1px solid black; border-radius: 8px; background-color: rgba(0, 0, 0, .6)">声音/静音</span>
                      <span class="full" style="width: 60px; height: 20px; position: absolute; right: 0;bottom: 10px; text-algin: center; cursor: pointer; z-index: 1; color: #fff; border: 1px solid black; border-radius: 8px; background-color: rgba(0, 0, 0, .6)">全屏</span>
                      <div style="width: 300px; height: 400px; position: absolute; overflow: hidden; top: -137px;">
                          <video id="live${i}" controls muted autoplay preload="auto" style="width: 100%;"></video>
                      </div>
                      `
            $(e).html(str)
        })
        const vueTest = setInterval(() => {
            if (window.videojs) {
                $('.content_div video').each((i, e) => {
                    let src = 'http:' + urls[i] + '.m3u8'
                    videojs('live' + i, {}, function onPlayerReady() {
                        this.src({ src, type: "application/x-mpegURL" })
                    })
                })
                $('.sound').click((e) => {
                    if ($(e.target).parent().find('.vjs-mute-control .vjs-control-text').first().html() === 'Unmute') {
                        e.target.style.backgroundColor = 'rgba(255, 0, 0, .6)'
                        $(e.target).parent().find('.vjs-mute-control').first().click();
                    } else {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, .6)'
                        $(e.target).parent().find('.vjs-mute-control').first().click();
                    }
                })
                $('.full').each((i, e) => {
                    ((i, e) => {
                        $(e).click((e) => {
                            $('#video-wrapper').show()
                            videojs('live' + i).pause()
                            index = i
                            videojs('video', {}, function onPlayerReady() {
                                this.src({ src: 'http:' + urls[i] + '.m3u8', type: "application/x-mpegURL" })
                            })
                        })
                    })(i, e)
                })
                clearInterval(vueTest)
            }
        }, 100)

    } else if (location.href.match(/main.ftlNNN/g)) {
        let $ = null
        let name = null
        let root = null
        const s = document.createElement('script')
        document.head.appendChild(s)
        s.src = 'http://cdn.staticfile.org/jquery/3.4.1/jquery.min.js'
        s.onload = function() {
            $ = window.$
            name = $('.end').text().split('|')[0].trim()
            root = name === '尹成诺' || name === '潘李晓' || name === '周晗雨' || name === '张亚洲' || name === '曹锋华' || name === '荣翔' || name === '翟雄飞'
            console.log(root)
            $('.left_E').prepend('<p class="showRules" style="height: 25px; margin-bottom: 5px; text-align: center; line-height: 25px; font-size: 20px; font-weight: bold;background-color:rgba(0,0,0,.4);cursor:pointer;">审核规则</p>')
            $('<style>#app{position:absolute;right:0;top:0;width:calc(100% - 215px);height:100vh;z-index:-1;background-color:rgba(255,255,255,.9);}textarea,button{margin:0!important;}.rulesLeft{width:215px!important;height:100vh;overflow:auto;box-sizing:border-box;border-right:1px solid #ccc;float:left;}.rulesRight{width:calc(100% - 215px);height:100%;float:right;}.el-button{width:100%;height:40px;}.el-tree-node__content{height:40px!important;}.editText{position:absolute;right:0;top:0;padding:0 20px;line-height:40px;color:blue;user-select:none;}.el-breadcrumb{font-size: 40px!important;}</style><link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">').appendTo('head');
            $(`
                <div id="app">
                    <span class="hideRules" style="position:absolute;right:0;top:0;width:40px;height:40px;line-height:40px;text-align:center;font-size:60px;cursor:pointer;">×</span>
                    <div class="rulesLeft">
                        <el-input
                            placeholder="输入关键字检索规则"
                            v-model="filterText">
                        </el-input>
                        <hr style="border-top:3px double #ccc;">
                        <el-tree
                            class="filter-tree"
                            node-key="id"
                            :data="data2"
                            :props="defaultProps"
                            accordion
                            :filter-node-method="filterNode"
                            highlight-current
                            @node-click="clickTree"
                            ref="tree2">
                        </el-tree>
                        <hr style="border-top:3px double #ccc;">
                        <el-button type="success" @click="clickAddRuleName" icon="el-icon-document">更新日志</el-button>
                        <div v-if="root">
                            <hr style="border-top:3px double #ccc;">
                            <el-input v-model="ruleNameInput" placeholder="请输入名称"></el-input>
                            <el-button type="primary" @click="clickChangeRuleName" icon="el-icon-edit">修改名称</i></el-button>
                            <hr style="border-top:3px double #ccc;">
                            <el-input v-model="sonNameInput" placeholder="请输入子类名称"></el-input>
                            <el-button type="success" @click="clickAddRuleName" icon="el-icon-circle-plus-outline">添加子类</el-button>
                            <hr style="border-top:3px double #ccc;">
                            <el-button type="danger" @click="clickDelRuleName" icon="el-icon-delete" disabled>删除条目</el-button>
                            <hr style="border-top:3px double #ccc;">
                            <el-button type="success" @click="clickAddRuleName" icon="el-icon-circle-plus-outline">提交本次修改</el-button>
                            <el-input
                                type="textarea"
                                autosize
                                placeholder="请输入本次修改备注"
                                v-model="updataText">
                            </el-input>
                        </div>
                    </div>
                    <div class="rulesRight">
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item v-for="(item, index) in nameArr" :key="index">{{item}}</el-breadcrumb-item>
                        </el-breadcrumb>
                        <hr style="border-top:3px double #ccc;">
                        <h1>场景描述：</h1>
                        <hr style="border-top:3px double #ccc;">
                        <el-input
                            v-model="nowRule.des">
                        </el-input>
                        <hr style="border-top:3px double #ccc;">
                        <h1>处罚措施：</h1>
                        <hr style="border-top:3px double #ccc;">
                        <el-input
                            v-model="nowRule.do">
                        </el-input>
                        <hr style="border-top:3px double #ccc;">
                        <h1>示例图片：</h1>
                        <hr style="border-top:3px double #ccc;">
                        <div style="height: 666px;display:flex;">
                            <img style="height: 333px;" v-for="(item, index) in nowRule.pic" :src="item" :key="index">
                        <div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
                <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
                <script src="https://unpkg.com/element-ui/lib/index.js"></script>
                <script>
                    $.ajax({
                        url: 'http://39.96.73.206/rules',
                        success (data) {
                            window.rules = JSON.parse(data)
                        }
                    })
                    const VueChecker = setInterval(() => {
                        if (window.Vue && window.ELEMENT) {
                            new window.Vue({
                                el: '#app',
                                data: {
                                    name: '${name}',
                                    root: ${root},
                                    nowRule: {},
                                    nameArr: [],
                                    filterText: '',
                                    ruleNameInput: '',
                                    ruleNameId: '',
                                    sonNameInput: '',
                                    updataText: '',
                                    data2: window.rules,
                                    defaultProps: {
                                        children: 'children',
                                        label: 'label'
                                    }
                                },
                                watch: {
                                    filterText(val) {
                                        this.$refs.tree2.filter(val);
                                    }
                                },
                                methods: {
                                    filterNode(value, data) {
                                        if (!value) return true;
                                        return data.label.indexOf(value) !== -1;
                                    },
                                    filterTree () {
                                        let temp = window.rules;
                                        this.ruleNameId.split('-').forEach((e, i, arr) => {
                                            if (temp.children) {
                                                temp = temp.children[e]
                                            } else {
                                                temp = temp[e]
                                            }
                                        })
                                        return temp

                                    },
                                    clickTree (obj, node, tree, e) {
                                        this.ruleNameInput = obj.label
                                        this.ruleNameId = obj.id
                                        this.nowRule = obj
                                        let nameArr = []
                                        let temp = window.rules;
                                        this.$refs.tree2.getCurrentKey().split('-').forEach((e, i, arr) => {
                                            if (temp.children) {
                                                temp = temp.children[e]
                                            } else {
                                                temp = temp[e]
                                            }
                                            nameArr.push(temp.label)
                                        })
                                        this.nameArr = nameArr
console.log(this.$refs.tree2.getCurrentKey())
                                    },
                                    clickChangeRuleName () {
                                        let temp = this.filterTree()
                                        temp.label = this.ruleNameInput
                                    },
                                    clickAddRuleName () {
                                        if (this.sonNameInput.trim()) {
                                            if (this.ruleNameId) {
                                                let temp = this.filterTree()
                                                if (temp.children) {
                                                    this.$refs.tree2.updateKeyChildren(this.$refs.tree2.getCurrentKey(), [...temp.children, { id: this.ruleNameId + '-' + temp.children.length + '', label: this.sonNameInput }])
                                                } else {
                                                    this.$refs.tree2.updateKeyChildren(this.$refs.tree2.getCurrentKey(), [{  id: this.ruleNameId + '-0', label: this.sonNameInput }])
                                                }
                                                this.sonNameInput = ''
                                            } else {
                                                window.rules.push({ id: window.rules.length + '', label: this.sonNameInput })
                                                this.sonNameInput = ''
                                            }
                                        } else {
                                            alert('请输入要添加的子类的名称')
                                        }
                                    },
                                    clickDelRuleName () {
                                        if (this.ruleNameId) {
                                            if (window.confirm("确定要删除这个规则嘛？删除后不可恢复哦！")) {
                                                if (this.ruleNameId.split('-').length === 1) {
                                                    window.rules.splice(+this.ruleNameId.split('-')[0], 1)
                                                } else {
                                                    let temp = window.rules;
                                                    let arr = this.ruleNameId.split('-')
                                                    let index = arr.pop()
                                                    arr.forEach((e, i, arr) => {
                                                        if (temp.children) {
                                                            temp = temp.children[e]
                                                        } else {
                                                            temp = temp[e]
                                                        }
                                                    })
                                                    temp.children.splice(index, 1)
                                                }
                                                this.ruleNameId = ''
                                            }
                                        } else {
                                            alert('请选择要删除的规则')
                                        }
                                    }
                                }
							 })
                            clearInterval(VueChecker)
                        }
                    }, 12)
                </script>
            `).appendTo('body')
            $('.showRules').on('click', () => {
                $('#app').css('z-index', 1).on('click', (e) => {
                    if (e.target.className == 'hideRules') {
                        $('#app').css('z-index', -1)
                    }
                })
            })
        }
    } else if (location.href.match(/videoFile!videoFilePassList/g)) {
        $('tr td div:nth-child(3)').append('<input type="button" style="padding:2;vertical-align: top;margin-top: 60px;margin-left: 8px;" class="btn_blue openright-now" value="×1.0" speed="1.0"><input type="button" style="padding:2;vertical-align: top;margin-top: 60px;margin-left: 8px;" class="btn_blue openright-now" value="×1.5" speed="1.5"><input type="button" style="padding:2;vertical-align: top;margin-top: 60px;margin-left: 8px;" class="btn_blue openright-now" value="×2.0" speed="2.0"><input type="button" style="padding:2;vertical-align: top;margin-top: 60px;margin-left: 8px;" class="btn_blue openright-now" value="×2.5" speed="2.5"><input type="button" style="padding:2;vertical-align: top;margin-top: 60px;margin-left: 8px;" class="btn_blue openright-now" value="×3.0" speed="3.0">')
        $('tr td div:nth-child(4)').append('<input type="button" style="padding:2;vertical-align: top;margin-top: 60px;margin-left: 8px;" class="btn_blue openright-last" value="×1.0" speed="1.0"><input type="button" style="padding:2;vertical-align: top;margin-top: 60px;margin-left: 8px;" class="btn_blue openright-last" value="×1.5" speed="1.5"><input type="button" style="padding:2;vertical-align: top;margin-top: 60px;margin-left: 8px;" class="btn_blue openright-last" value="×2.0" speed="2.0"><input type="button" style="padding:2;vertical-align: top;margin-top: 60px;margin-left: 8px;" class="btn_blue openright-last" value="×2.5" speed="2.5"><input type="button" style="padding:2;vertical-align: top;margin-top: 60px;margin-left: 8px;" class="btn_blue openright-last" value="×3.0" speed="3.0">')
        $('.openright-now').click((e) => {
            openRight($(e.target).parent().prev().prev().find('video').eq(0).attr('src'), 234, $(e.target).attr('speed'));
        })
        $('.openright-last').click((e) => {
            openRight($(e.target).parent().find('video').eq(0).attr('src'), 234, $(e.target).attr('speed'));
        })
    } else if (location.href.match(/videoFile!videoFileUnpassList/g)) {
        $('tr video').parent().parent().find('td:nth-child(8)').append('<br><input type="button" style="padding:2;vertical-align: top;margin: 8px;" class="btn_blue openright-now" value="×1.0" speed="1.0"><input type="button" style="padding:2;vertical-align: top;margin: 8px;" class="btn_blue openright-now" value="×1.5" speed="1.5"><input type="button" style="padding:2;vertical-align: top;margin: 8px;" class="btn_blue openright-now" value="×2.0" speed="2.0"><input type="button" style="padding:2;vertical-align: top;margin: 8px;" class="btn_blue openright-now" value="×2.5" speed="2.5"><input type="button" style="padding:2;vertical-align: top;margin: 8px;" class="btn_blue openright-now" value="×3.0" speed="3.0">')
        $('.openright-now').click((e) => {
            openRight($(e.target).parent().parent().find('video').eq(0).attr('src'), 456, $(e.target).attr('speed'));
        })
    } else if (location.href.match(/\/live\/normal\/stream\/audit/g) || location.href.match(/\/live\/foucs\/stream\/audit/g)) {
        //$('body').html('');

        $(`<script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
           <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
           <script src="https://unpkg.com/element-ui/lib/index.js"></script>
           <script src="https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js"></script>
           <script src="https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js"></script>
           <style>.item:nth-child(22) { margin-right: 300px!important; }</style>
         `).appendTo('head');

        $('#superviceTime').prev().dblclick(() => {
            $refresherInsert(null, $('#commitreflash'));
        });
        $('#pageSize').val(29)
        $(`<script src="https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js"></script><style>.video_class{ height:260px!important;background:#000; }.back_to_top,#choose,#Pagination {display:none!important;}.item { margin: 0!important;width:157px!important;} .container{ width: 100%!important; }.ended{ width:100%;height:123px;line-height:123px;text-align:center;font-size:20px; }</style>`).appendTo('head'); //插入flv.js
        $('<div class="test" style="postion: fixed;left:50%;top:100px;width:300px;margin-left:-100px;height:auto;background:#fff;"></div>').appendTo('body');
        $('#pageSize').blur((e) => {
            if(+e.target.value.trim() > 29) {
                e.target.value = 29;
            }
        })
        $('.test').Tdrag();
        let urls = [];
        let players = [];
        let fullVideo = null;
        const hosts = ['http://pili-live-rtmp.hzwangjiao.com/', 'http://pili-live-rtmp.bingo28.cn/', 'http://pili-live-rtmp.shelinkme.cn/', 'http://pili-live-rtmp.gamepk8.cn/', 'http://pili-live-rtmp.xingketech.com/'];
        const rander = urls => {
            $('object').each((i, e) => {
                urls.push($(e).parent().next().children().first().attr('onclick').split('"')[5]);
                const id = $(e).parent().next().find('span').first().attr('onclick').split('"')[1];
                $(e).parent().next().prepend(`<button class="floatBTN" title="挂起此直播窗口" style="padding:0 8px;display:inline-block;height:22px; line-height:22px;font-size:12px;">F</button><a href="http://nb.floa.vip/video/live/screen/audited?user_id=${id}" target="_blank;"><button class="toUserpic" title="打开截屏页面" style="padding:0 8px;display:inline-block;height:22px; line-height:22px;font-size:12px;">P</button>`);
                //<a href="http://mv6rsdbvj8.floa.vip/userAction!details.action?userid=${id}" target="_blank"><button class="toUserindex" title="打开用户信息页面（老后台）" style="padding:0 8px;display:inline-block;height:22px; line-height:22px;font-size:12px;">U</button></a>
                $(e).replaceWith(`<video id="video${i}" data="${i}" style="width: 160px; max-height: 260px;" muted controls autoplay preload="auto"></video>`);
            });
            $('span').not('.test span').each((i, e) => {
                if (e.innerHTML === '交友房嘉宾') {
                    $(e).parent().prev().css('padding', '40px 0px').find('video').css('max-height', '183px')
                } else if (e.innerHTML === 'PK') {
                    $(e).parent().prev().css('padding', '25px 0px')
                } else if (e.innerHTML === '交友房主播') {
                    $(e).parent().prev().css('padding', '55px 0px')
                }
            })
            $('.floatBTN').click((e) => {
                if (fullVideo) {
                    fullVideo.destroy()
                }
                $('.test').html('');
                $(e.target).parent().parent().clone(true).removeClass('item').addClass('floatVideo').css('width','300px').css('border','2px solid #f40').css('height','auto').find('.video_class').removeClass('video_class').css('padding', '0').parent().appendTo('.test');
                $('<span id="rightClose" style="position:absolute;right:0;top:0;width:6vh;height:6vh;line-height:6vh;text-align:center;font-size:6vh;border-radius:50%;background:rgba(0, 0, 0, .6); color:#fff;cursor:pointer;">×</span>').appendTo('.test');
                $('#rightClose').click(() => {
                    $('.test').html('');
                })
                $('.test video').css('max-height', '999px');
                $('.test .floatBTN').remove();
                const video = $('.test video')[0];
                video.onended = () => {
                    $(video).replaceWith('<span class="ended">直播结束了</span>')
                }
                const flv = flvjs.createPlayer({
                    type: 'flv',
                    url: $(e.target).attr('url'),
                    isLive: true,
                }, {
                    fixAudioTimestampGap: false,
                    enableStashBuffer: false,
                });
                flv.attachMediaElement(video);
                flv.load();
                flv.play();
                flv.muted = false;
                fullVideo = flv;
            })
            let hostIndex = 0;
            urls.forEach((e, i) => {
                if ((i % 6 === 0) && i !== 0) {
                    hostIndex ++;
                }
                const video = document.getElementById(`video${i}`);
                video.onended = () => {
                    $(video).replaceWith('<span class="ended">直播结束了</span>')
                }
                $(video).parent().next().find('.floatBTN').attr('url', hosts[4] + e.split('hzwangjiao.com/')[1] + '.flv')
                const flv = flvjs.createPlayer({
                    type: 'flv',
                    url: hosts[hostIndex] + e.split('hzwangjiao.com/')[1] + '.flv',
                    isLive: true,
                }, {
                    fixAudioTimestampGap: false,
                    enableStashBuffer: false,
                });
                flv.attachMediaElement(video);
                flv.load();
                flv.play();
                players.push(flv);
                $(video).click((e) => {
                    e.stopPropagation();
                });
            })
        }
        const videoJsTest = setInterval(() => { //检测flv.js是否执行完毕
            if (window.flvjs && $('.video_class object').length) { //执行完
                rander(urls);
                clearInterval(videoJsTest) //取消测试video.js
            }
        }, 23);
        $('#commitreflash').add('#commitclose').click(() => {
            hostIndex = 0;
            players.forEach((e) => {
                e.destroy();
            })
            players = [];
            const freshTest = setInterval(() => { //检测是否刷新完毕
                if ($('object').length) { //执行完
                    urls = [];
                    rander(urls);
                    clearInterval(freshTest) //取消测试video.js
                }
            }, 23);
        })
    } else if (location.href.match(/\/sit\/wait\/stream\/audit/g)) {
        $refresherInsert(null, $('button').eq(3));
    }
})(window.parent.$);