// ==UserScript==
// @name         Smart CZOJ
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  让网站变得更加美观
// @author       cyx2009
// @match        *://47.103.114.172/*
// @match        *://czoj.com.cn/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459708/Smart%20CZOJ.user.js
// @updateURL https://update.greasyfork.org/scripts/459708/Smart%20CZOJ.meta.js
// ==/UserScript==
(function() {
    'use strict';
    /*点击特效*/
    if(!document.location.href.includes('/p'))
    {
        window.onload = (() => {
            //定义点击出现文字类
            function ClickFrontShow() {
                //定义所需文字和颜色
                this.fron = ['复杂度', '枚举', '模拟', '递归 & 分治', '贪心', '排序',
                    '前缀和 & 差分', '二分', '倍增', '构造',
                    'DFS（搜索）', 'BFS（搜索）', '双向搜索', '启发式搜索', 'A*',
                    '迭代加深搜索', 'IDA*', '回溯法', 'Dancing Links',
                    'Alpha-Beta 剪枝',
                    '记忆化搜索', '背包 DP', '区间 DP', 'DAG 上的 DP', '树形 DP',
                    '状压 DP', '数位 DP', '插头 DP', '计数 DP', '动态 DP',
                    '概率 DP',
                    '字符串匹配', '字符串哈希', '字典树 (Trie)', '前缀函数与 KMP 算法',
                    'Boyer-Moore 算法', 'Z 函数（扩展 KMP）', '自动机',
                    'AC 自动机', '后缀数组 (SA)', '后缀自动机 (SAM)', '后缀平衡树',
                    '广义后缀自动机', '后缀树', 'Manacher', '回文树', '序列自动机',
                    '最小表示法', 'Lyndon 分解', 'Main-Lorentz 算法',
                    '符号', '进位制', '位运算', '二进制集合操作', '平衡三进制', '高精度计算',
                    '快速幂', '置换和排列', '弧度制与坐标系', '复数', '数论',
                    '多项式与生成函数', '组合数学', '线性代数', '线性规划', '群论', '概率论',
                    '博弈论', '牛顿迭代法', '数值积分', '傅里叶-莫茨金消元法', '序理论',
                    '杨氏矩阵', 'Schreier–Sims 算法',
                    'Berlekamp-Massey 算法',
                    '栈', '队列', '链表', '哈希表', '并查集', '堆', '块状数据结构',
                    '单调栈', '单调队列', 'ST 表', '树状数组', '线段树', '李超线段树',
                    '区间最值操作 & 区间历史最值', '划分树', '二叉搜索树 & 平衡树', '跳表',
                    '可持久化数据结构', '树套树', 'K-D Tree', '动态树', '析合树',
                    'PQ 树', '手指树', '霍夫曼树',
                    '图论相关概念', '图的存储', 'DFS（图论）', 'BFS（图论）', '树上问题',
                    '矩阵树定理', '有向无环图', '拓扑排序', '最小生成树', '斯坦纳树',
                    '最小树形图', '最小直径生成树', '最短路', '拆点', '差分约束', 'k 短路',
                    '同余最短路', '连通性相关', '2-SAT', '欧拉图', '哈密顿图', '二分图',
                    '最小环', '平面图', '图的着色', '网络流', 'Stoer-Wagner 算法',
                    '图的匹配', 'Prufer 序列', 'LGV 引理', '弦图', '最大团搜索算法',
                    '二维计算几何基础', '三维计算几何基础', '距离', 'Pick 定理', '三角剖分',
                    '凸包', '扫描线', '旋转卡壳', '半平面交', '平面最近点对', '随机增量法',
                    '反演变换', '计算几何杂项',
                    '离散化', '双指针', '离线算法', '分数规划', '随机化', '悬线法',
                    '计算理论基础', '字节顺序', '约瑟夫问题', '格雷码', '表达式求值',
                    '在一台机器上规划任务', '主元素问题', 'Garsia-Wachs 算法',
                    '15-puzzle', 'Kahan 求和', '珂朵莉树/颜色段均摊',
                    'RMQ', '并查集应用', '括号序列', '线段树与离线询问'
                ];
                this.colo = ['#FF69B4', '#ff6651', 'orange', '#FF00FF',
                    '#00FF7F', '#00BFFF', '#BA55D3'
                ];
                //获取body元素
                this.elBody = document.getElementsByTagName("body")[0];
                //初始化randomNum
                this.randomNum = null;
                //初始化字体inde
                this.finde = 0;
                //初始化className
                this.cls = 0;
            }

            //定义初始化
            ClickFrontShow.prototype.init = function(frontArray,
                colorArray) {
                //自定义颜色和字体
                this.fron = frontArray || this.fron;
                this.colo = colorArray || this.colo;

                this.listenMouse();
            }

            //创建文字 
            ClickFrontShow.prototype.createFront = function(classname) {
                var self = this;
                let ospan = document.createElement('span');
                //设置样式
                let cssText =
                    // "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed;";
                    // "position:absolute; cursor: default; transform: translate(-50%,-50%); font-weight: bold; opacity: 1; z-index: 1000; transition: 1s;width: 100%; height: 100%;pointer-events: none;";
                    // "position:absolute; width: 40px; height: 20px; cursor: default; transform: translate(-50%,-50%); font-weight: bold; opacity: 1; z-index: 1000; transition: 1s;";
                    "position:fixed; width: 40px; height: 20px; cursor: default; transform: translate(-50%,-50%); font-weight: bold; opacity: 1; z-index: 1000; transition: 1s;";
                //随机字体和颜色
                let randomFront = self.fron[Math.round(Math
                    .random() * (self.fron.length - 1))];
                let randomColor = self.colo[Math.round(Math
                    .random() * (self.colo.length - 1))];
                //字体下标增1
                self.finde = (self.finde + 1) % self.fron.length;
                //向body中添加元素
                self.elBody.appendChild(ospan);
                //绑定一个classname
                ospan.className = String(classname);
                //添加样式
                ospan.style.cssText = cssText +
                    "-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;"
                ospan.style.color = randomColor;
                ospan.innerHTML = randomFront;
            }


            //监听鼠标点击
            ClickFrontShow.prototype.listenMouse = function() {
                var self = this;

                //鼠标点击事件
                document.onclick = function(e) {
                    //避免classname值重复导致出现bug
                    if (self.cls === 20) {
                        self.cls = 0;
                    } else {
                        self.cls += 1;
                    }
                    //创建文字
                    self.createFront(self.cls);
                    let el = document.getElementsByClassName(
                        self.cls)[0];

                    //鼠标点击位置

                    el.style.left = e.clientX + 'px';
                    el.style.top = e.clientY + 'px';
                    // alert('x: '+el.style.left+' y: '+el.style.top);

                    //过时改变
                    setTimeout(function() {
                        el.style.opacity = 0;
                        el.style.top = el.offsetTop -
                            100 + 'px';
                    }, 100);
                    //过时清除
                    setTimeout(function() {
                        self.elBody.removeChild(el);
                    }, 2000);
                }
            }
            //实例化
            var frontShow = new ClickFrontShow();
            //用户可在此传递参数，默认第一个参数是字体数组；
            //第二个参数是颜色数组，必须是数组类型！
            frontShow.init();
        })();
    }
    
    /*背景线条*/
    (() => {
        function e(e, n, t) {
            return e.getAttribute(n) || t
        }

        function n() {
            l = i.width = window.innerWidth || document.documentElement
                .clientWidth || document.body.clientWidth, u = i
                .height = window.innerHeight || document.documentElement
                .clientHeight || document.body.clientHeight
        }

        function c() {
            var t, o, i, a, m;
            r.clearRect(0, 0, l, u), s.forEach(function(e, n) {
                for (e.x += e.xa, e.y += e.ya, e.xa *= e.x >
                    l || e.x < 0 ? -1 : 1, e.ya *= e.y > u || e
                    .y < 0 ? -1 : 1, r.fillRect(e.x - .5, e.y -
                        .5, 1, 1), o = n + 1; o < d.length; o++)
                    null !== (t = d[o]).x && null !== t.y && (
                        i = e.x - t.x, a = e.y - t.y, (m = i *
                            i + a * a) < t.max && (t === y &&
                            m >= t.max / 2 && (e.x -= .03 * i, e
                                .y -= .03 * a), m = (t.max -
                                m) / t.max, r.beginPath(), r
                            .lineWidth = m / 2, r.strokeStyle =
                            "rgba(" + x.c + "," + (.2 + m) +
                            ")", r.moveTo(e.x, e.y), r.lineTo(t
                                .x, t.y), r.stroke()))
            }), w(c)
        }
        var l, u, d, t, o, i = document.createElement("canvas"),
            x = (t = (o = document.getElementsByTagName("script"))
                .length, o = o[t - 1], {
                    l: t,
                    z: e(o, "zIndex", -1),
                    o: e(o, "opacity", .5),
                    c: e(o, "color", "0,0,0"),
                    n: e(o, "count", 99)
                }),
            a = "c_n" + x.l,
            r = i.getContext("2d"),
            w = window.requestAnimationFrame || window
            .webkitRequestAnimationFrame || window
            .mozRequestAnimationFrame || window
            .oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(e) {
                window.setTimeout(e, 1e3 / 45)
            },
            m = Math.random,
            y = {
                x: null,
                y: null,
                max: 2e4
            };
        i.id = a, i.style.cssText =
            "position:fixed;top:0;left:0;z-index:" + x.z + ";opacity:" +
            x.o, document.getElementsByClassName("main")[0].appendChild(
                i), n(), window.onresize = n, window.onmousemove =
            function(e) {
                e = e || window.event, y.x = e.clientX, y.y = e.clientY
            }, window.onmouseout = function() {
                y.x = null, y.y = null
            };
        for (var s = [], h = 0; x.n > h; h++) {
            var f = m() * l,
                g = m() * u,
                p = 2 * m() - 1,
                v = 2 * m() - 1;
            s.push({
                x: f,
                y: g,
                xa: p,
                ya: v,
                max: 6e3
            })
        }
        d = s.concat([y]), setTimeout(function() {
            c()
        }, 100)
    })();
    /*卡片圆角*/
    const a = document.createElement('style');
    a.innerHTML = `.section{border-radius:30px}`;
    document.head.append(a);

})();