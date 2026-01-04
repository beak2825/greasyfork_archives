// ==UserScript==
// @name         算法
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @homepage     https://greasyfork.org/zh-CN/users/840688
// @description  算法包
// @author       *
// @match        https://*/*
// @match        http://*/*
// @license      AGPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478128/%E7%AE%97%E6%B3%95.user.js
// @updateURL https://update.greasyfork.org/scripts/478128/%E7%AE%97%E6%B3%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 大数精度位运算
    // const Bit = (function () {
    //     // 反码
    //     function ones_complement(a) {
    //         a = a.split("");
    //         for (let i = 1; i < a.length; i++) {
    //             if (a[0] !== a[i]) {
    //                 a[i] = "1";
    //             } else {
    //                 a[i] = "0";
    //             }
    //         }
    //         return a.join("");
    //     }
    //
    //     return {
    //         // 与
    //         and: function (a, b) {
    //             a = a.toString(2);
    //             b = b.toString(2);
    //             if (a[0] === "-") {
    //                 a = "1" + a.substring(1);
    //                 // 获取补码
    //                 a = (parseInt(ones_complement(a), 2) + 1).toString(2);
    //             } else a = "0" + a;
    //             if (b[0] === "-") {
    //                 b = "1" + b.substring(1);
    //                 // 获取补码
    //                 b = (parseInt(ones_complement(b), 2) + 1).toString(2);
    //             } else b = "0" + b;
    //             if (a.length > b.length) b = b[0] + b.substring(1).padStart(a.length - 1, b[0]);
    //             else a = a[0] + a.substring(1).padStart(b.length - 1, a[0]);
    //             a = a.split("");
    //             b = b.split("");
    //             for (let i = 0; i < a.length; i++) {
    //                 if (a[i] === "1" && b[i] === "1") {
    //                     a[i] = "1";
    //                 } else {
    //                     a[i] = "0";
    //                 }
    //             }
    //             if (a[0] === "1") {
    //                 a = ones_complement((parseInt(a.join(""), 2) - 1).toString(2));
    //                 a = "-" + a.substring(1);
    //             } else {
    //                 a = a.join("");
    //             }
    //             return parseInt(a, 2);
    //         },
    //         // 或
    //         or: function (a, b) {
    //             a = a.toString(2);
    //             b = b.toString(2);
    //             if (a[0] === "-") {
    //                 a = "1" + a.substring(1);
    //                 // 获取补码
    //                 a = (parseInt(ones_complement(a), 2) + 1).toString(2);
    //             } else a = "0" + a;
    //             if (b[0] === "-") {
    //                 b = "1" + b.substring(1);
    //                 // 获取补码
    //                 b = (parseInt(ones_complement(b), 2) + 1).toString(2);
    //             } else b = "0" + b;
    //             if (a.length > b.length) b = b[0] + b.substring(1).padStart(a.length - 1, b[0]);
    //             else a = a[0] + a.substring(1).padStart(b.length - 1, a[0]);
    //             a = a.split("");
    //             b = b.split("");
    //             for (let i = 0; i < a.length; i++) {
    //                 if (a[i] === "1" || b[i] === "1") {
    //                     a[i] = "1";
    //                 } else {
    //                     a[i] = "0";
    //                 }
    //             }
    //             if (a[0] === "1") {
    //                 a = ones_complement((parseInt(a.join(""), 2) - 1).toString(2));
    //                 a = "-" + a.substring(1);
    //             } else {
    //                 a = a.join("");
    //             }
    //             return parseInt(a, 2);
    //         },
    //         // 异或
    //         xor: function (a, b) {
    //             a = a.toString(2);
    //             b = b.toString(2);
    //             if (a[0] === "-") {
    //                 a = "1" + a.substring(1);
    //                 // 获取补码
    //                 a = (parseInt(ones_complement(a), 2) + 1).toString(2);
    //             } else a = "0" + a;
    //             if (b[0] === "-") {
    //                 b = "1" + b.substring(1);
    //                 // 获取补码
    //                 b = (parseInt(ones_complement(b), 2) + 1).toString(2);
    //             } else b = "0" + b;
    //             if (a.length > b.length) b = b[0] + b.substring(1).padStart(a.length - 1, b[0]);
    //             else a = a[0] + a.substring(1).padStart(b.length - 1, a[0]);
    //             a = a.split("");
    //             b = b.split("");
    //             for (let i = 0; i < a.length; i++) {
    //                 if (a[i] !== b[i]) {
    //                     a[i] = "1";
    //                 } else {
    //                     a[i] = "0";
    //                 }
    //             }
    //             if (a[0] === "1") {
    //                 a = ones_complement((parseInt(a.join(""), 2) - 1).toString(2));
    //                 a = "-" + a.substring(1);
    //             } else {
    //                 a = a.join("");
    //             }
    //             return parseInt(a, 2);
    //         },
    //         // 非
    //         not: function (a) {
    //             return -a - 1
    //         },
    //         // 左移
    //         shift: function (a, b) {
    //             a = a.toString(2);
    //             a = a.padEnd(a.length + b, "0");
    //             return parseInt(a, 2);
    //         },
    //         // 右移
    //         move: function (a, b) {
    //             a = a.toString(2);
    //             if (a[0] === "-") {
    //                 a = "1" + a.substring(1);
    //                 // 获取补码
    //                 a = (parseInt(ones_complement(a), 2) + 1).toString(2);
    //             } else a = "0" + a;
    //             b = Math.min(b, a.length - 1);
    //             a = a[0].padEnd(b + 1, a[0]) + a.substring(1, a.length - b);
    //             if (a[0] === "1") {
    //                 // 获取原码
    //                 a = ones_complement((parseInt(a, 2) - 1).toString(2));
    //                 a = "-" + a.substring(1);
    //             }
    //             return parseInt(a, 2);
    //         }
    //     }
    // })();

    // // 正则表达式剔除 注释 和 行首行尾空白符
    // string.replace(new RegExp("\"([^\\\\\"]*(\\\\.)?)*\"|'([^\\\\\']*(\\\\.)?)*'|`([^\\\\`]*(\\\\.)?)*`|\\/{2,}.*?[\r\n]|\\/\\*(\n|.)*?\\*\\/", "g"), function (text) {
    //     return new RegExp("^\\/{2,}").test(text) || new RegExp("^\\/\\*").test(text) ? "" : text;
    //     // 为了防止 代码行末端没有加分号压缩成一行而产生语法无效错误 的发生，这里保留换行符
    // }).replace(new RegExp("\\s*\n\\s+", "g"), "\n").replace(new RegExp("^\\s+|\\s+$"), "")

    // 深拷贝
    Object.clone = function (o, async = false) {
        // 存储已拷贝的旧对象属性的引用，和对应属性在新对象的引用
        const ps = [], properties = [];
        return copy(o);

        // 深拷贝对象
        function copy(o) {
            // 如果没有继承Object就返回原值
            if (!(o instanceof Object)) return o;
            // 如果是Date或RegExp无属性的构造，则新构造一个。(Date.prototype).constructor === Date && (Date.prototype) === (Date.prototype).constructor.prototype，Date.prototype是不能构造的
            else if ((o.constructor === Date || o.constructor === RegExp) && o !== o.constructor.prototype) return new o.constructor(o);
            else {
                // 如果对象是函数类型，就创建代理其内存的代理对象。如果对象继承自Array则创建[]，否则就是继承自Object创建{}。
                const object = Object.setPrototypeOf((typeof o === "function") ? (function () {
                    // @formatter:off
                    function Proxy() {return o.apply(this, arguments);}
                    // @formatter:on
                    delete Proxy["name"];
                    delete Proxy["length"];
                    Proxy["prototype"] = c("prototype");
                    return Proxy;
                })() : o instanceof Array ? [] : {}, o);
                const handle = function () {
                    clearTimeout(id);
                    // 函数和Array的部分属性是不可定义的，所以这里获取出来用于检测
                    const names = Object.getOwnPropertyNames(object);
                    // 遍历属性名 重新定义，如果可以定义属性就定义属性
                    for (const p of Object.getOwnPropertyNames(o)) if (names.indexOf(p) === -1) Object.defineProperty(object, p, (function () {
                        const {configurable, ...args} = Object.getOwnPropertyDescriptor(o, p);
                        if (args["value"] !== undefined) args["value"] = c(p);
                        return args;
                    })());
                    // 迭代一个对象的除Symbol以外的可枚举属性，包括继承的可枚举属性
                    // for (const p in o) if (ops.indexOf(p) === -1) object[p] = c(p);
                    // 获取对象Symbol属性 并 重新定义
                    for (const p of Object.getOwnPropertySymbols(o)) Object.defineProperty(object, p, (function () {
                        const {configurable, ...args} = Object.getOwnPropertyDescriptor(o, p);
                        if (args["value"] !== undefined) args["value"] = c(p);
                        return args;
                    })());
                };
                // 是否异步拷贝
                if (async) {
                    var id = setTimeout(handle);
                    return object;
                } else {
                    handle();
                    return object;
                }

                // 深拷贝属性
                function c(p) {
                    // 如果 该属性值没有被定义过，就进行深拷贝并存储这个引用
                    // 如果引用了已拥有的属性内存地址，则让object的p属性也指向指定位置
                    const index = ps.indexOf(o[p]);
                    if (index === -1) {
                        if (async) {
                            const object = copy(o[p]);
                            ps.push(o[p]);
                            properties.push(object);
                            return object;
                        } else {
                            ps.push(o[p]);
                            const object = copy(o[p]);
                            properties.push(object);
                            return object;
                        }
                    } else return properties[index];
                }
            }
        }
    };

    // 双向链表
    window.LinkedList = (function () {
        // 将 多个可迭代对象的对象 转换为链表的节点
        function objectsToNodes(...objects) {
            let next = undefined, prev = undefined, length = 0;
            for (const object of objects) for (const value of object) {
                const node = {value: value, next: undefined, prev: prev};
                if (next !== undefined) {
                    prev.next = node;
                    prev = node;
                } else next = prev = node;
                length++;
            }
            return {next, prev, length};
        }

        // 创建一个在每个实例中存储私有变量的对象
        const internal = Symbol("internal");

        // 创建一个长度位length的双链表
        function LinkedList(length = 0) {
            if (this instanceof LinkedList) {
                Object.defineProperty(this, internal, {
                    // 将多个可迭代对象转换为链表
                    value: {next: undefined, prev: undefined, length: 0},
                    writable: false,
                    enumerable: false
                });
                if (length > 0) {
                    this[internal].next = this[internal].prev = {value: undefined, next: undefined, prev: undefined};
                    this[internal].length = 1;
                    for (let i = 1; i < length; i++) {
                        this[internal].prev.next = {value: undefined, next: undefined, prev: this[internal].prev};
                        this[internal].prev = this[internal].prev.next;
                        this[internal].length++;
                    }
                }
                return this;
            } else return new LinkedList(length);
        }

        //  将多个可迭代对象，转换为链表
        LinkedList.from = function (...objects) {
            const object = Object.setPrototypeOf({}, LinkedList.prototype);
            Object.defineProperty(object, internal, {
                // 将多个可迭代对象转换为链表
                value: objectsToNodes(...objects),
                writable: false,
                enumerable: false
            });
            return object;
        };

        // 将多个值，合成为双链表
        LinkedList.of = function (...values) {
            const object = Object.setPrototypeOf({}, LinkedList.prototype);
            Object.defineProperty(object, internal, {
                // 将参数列表转换为链表
                value: objectsToNodes(values),
                writable: false,
                enumerable: false
            });
            return object;
        };

        // 链表属性 和 迭代器、增删改查 方法
        Object.defineProperties(LinkedList.prototype, {
            length: {
                enumerable: true, get: function () {
                    return this[internal].length;
                }
            }, first: {
                enumerable: true, get: function () {
                    return this[internal].next;
                }
            }, last: {
                get: function () {
                    return this[internal].prev;
                }
            },
            // 定义迭代器，使对象可以被迭代
            [Symbol.iterator]: {
                value: function () {
                    let handle = this[internal];
                    return {
                        next: function () {
                            if (handle.next !== undefined) {
                                handle = handle.next;
                                return {value: handle.value, done: false};
                            } else return {value: undefined, done: true};
                        }
                    }
                },
                enumerable: false
            },
            // 设置类型标签
            [Symbol.toStringTag]: {value: "LinkedList", writable: false, enumerable: false},
            // 返回链表转换得到的数组，改变数组并不会改变链表
            array: {
                enumerable: false, get: function () {
                    let handle = this[internal].next, array = [];
                    while (handle !== undefined) {
                        if (handle.value !== undefined) array.push(handle.value);
                        else array.length++;
                        handle = handle.next;
                    }
                    return array;
                }
            },
            // 从链表末尾添加添加一个或多个元素，并返回数组新的 length
            push: {
                enumerable: false, value: function (...values) {
                    if (values.length === 0) return this[internal].length;
                    const nodes = objectsToNodes(values);
                    if (this[internal].next !== undefined) {
                        this[internal].prev.next = nodes.next;
                        nodes.next.prev = this[internal].prev;
                        this[internal].prev = nodes.prev;
                    } else {
                        this[internal].next = nodes.next;
                        this[internal].prev = nodes.prev;
                    }
                    return this[internal].length += nodes.length;
                }
            },
            // 从链表中移除末尾n个元素并返回移除元素的数组，如果length未定义则移除末尾1个元素并返回移除元素
            pop: {
                enumerable: false, value: function (length = undefined) {
                    if (length === undefined) {
                        if (this[internal].prev !== undefined) {
                            const handle = this[internal].prev;
                            this[internal].prev = handle.prev;
                            if (handle.prev !== undefined) handle.prev.next = undefined;
                            else this[internal].next = undefined;
                            this[internal].length--;
                            return handle.value;
                        } else return undefined;
                    } else {
                        length = Math.floor(length);
                        let array;
                        if (this[internal].prev !== undefined) {
                            if (length > this[internal].length) length = this[internal].length;
                            else if (length <= 0) return [];
                            array = Array(length);
                            let handle = this[internal].prev;
                            for (let i = length - 1; i >= 0; i--) {
                                if (handle.value !== undefined) array[i] = handle.value;
                                handle = handle.prev;
                            }
                            this[internal].prev = handle;
                            if (handle !== undefined) handle.next = undefined;
                            else this[internal].next = undefined;
                            this[internal].length -= array.length;
                        }
                        return array;
                    }
                }
            },
            // 从链表前面添加添加一个或多个元素，并返回数组新的 length
            unshift: {
                enumerable: false, value: function (...values) {
                    if (values.length === 0) return this[internal].length;
                    const nodes = objectsToNodes(values);
                    if (this[internal].next !== undefined) {
                        this[internal].next.prev = nodes.prev;
                        nodes.prev.next = this[internal].next;
                        this[internal].next = nodes.next;
                    } else {
                        this[internal].next = nodes.next;
                        this[internal].prev = nodes.prev;
                    }
                    return this[internal].length += nodes.length;
                }
            },
            // 从链表中移除前面n个元素并返回移除元素的数组，如果length未定义则移除前面1个元素并返回移除元素
            shift: {
                enumerable: false, value: function (length = undefined) {
                    if (length === undefined) {
                        if (this[internal].next !== undefined) {
                            const handle = this[internal].next;
                            this[internal].next = handle.next;
                            if (handle.next !== undefined) handle.next.prev = undefined;
                            else this[internal].prev = undefined;
                            this[internal].length--;
                            return handle.value;
                        } else return undefined;
                    } else {
                        length = Math.floor(length);
                        let array;
                        if (this[internal].next !== undefined) {
                            if (length > this[internal].length) length = this[internal].length;
                            else if (length <= 0) return [];
                            array = Array(length);
                            let handle = this[internal].next;
                            for (let i = 0; i < length; i++) {
                                if (handle.value !== undefined) array[i] = handle.value;
                                handle = handle.next;
                            }
                            this[internal].next = handle;
                            if (handle !== undefined) handle.prev = undefined;
                            else this[internal].prev = undefined;
                            this[internal].length -= array.length;
                        }
                        return array;
                    }
                }
            },
            // 从链表指定位置添加一个或多个元素，并返回数组新的 length
            insert: {
                enumerable: false, value: function (index, ...values) {
                    index = Math.floor(index);
                    const handle = (function () {
                        if (isNaN(index)) return this[internal];
                        else if (index < 0) {
                            index = this[internal].length + index;
                            if (index < 0) return this[internal];
                        } else if (index > this[internal].length) return this[internal].prev;
                        // 就近遍历
                        if (index <= Math.ceil(this[internal].length / 2)) {
                            let handle = this[internal];
                            for (let i = 0; i < index; i++) handle = handle.next;
                            return handle;
                        } else {
                            let handle = this[internal].prev;
                            for (let i = this[internal].length; i > index; i--) handle = handle.prev;
                            return handle;
                        }
                    }).call(this);
                    // 添加值
                    if (values.length > 0) {
                        const nodes = objectsToNodes(values);
                        if (this[internal].next !== undefined) {
                            if (handle !== this[internal].prev) {
                                nodes.prev.next = handle.next;
                                handle.next.prev = nodes.prev;
                            } else this[internal].prev = nodes.prev;
                            handle.next = nodes.next;
                            if (handle !== this[internal]) nodes.next.prev = handle;
                        } else {
                            this[internal].next = nodes.next;
                            this[internal].prev = nodes.prev;
                        }
                        return this[internal].length += nodes.length;
                    }
                }
            },
            // 从链表指定位置截取n个值并在该位置添加值，返回一个Array
            splice: {
                // index（可选）指定了从哪个坐标开始(包含这个坐标)移除和添加内容；如果是负值则表示从数组末位开始的第几位（从 -1 计数，这意味着 -n 是倒数第 n 个元素并且等价于 LinkedList.length-n）；如果超出了数组的长度，则从数组末尾开始添加内容；如果负数的绝对值大于数组的长度 或 转换为数字为NaN，则表示开始位置为第 0 位
                // length（可选）表示要移除的数组元素的个数。如果 length 大于 index 之后的元素的总数，则从 index 后面的元素都将被删除（含第 index 位）。如果 length 被省略了，或者它的值大于等于 LinkedList.length-index (也就是说，如果它大于或者等于 index 之后的所有元素的数量)，那么 index 之后数组的所有元素都会被删除。如果 length 是 0 或 负数 或 转换为数字为NaN，则不移除元素。这种情况下，至少应添加一个新元素
                // ...values（可选）item1, item2, ... 要添加进数组的元素，从start 位置开始。如果不指定，则 splice() 将只删除数组元素
                // 返回值 由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组
                enumerable: false, value: function (index = 0, length = Infinity, ...values) {
                    index = Math.floor(index);
                    length = Math.floor(length);
                    if (isNaN(index)) index = 0;
                    else if (index < 0) {
                        index = this[internal].length + index;
                        if (index < 0) index = 0;
                    } else if (index > this[internal].length) index = this[internal].length;
                    const maxDeletionLength = this[internal].length - index;
                    if (length > maxDeletionLength) length = maxDeletionLength;
                    else if (length < 0) length = 0;
                    const array = Array(length);
                    // 就近遍历
                    let handle, flag;
                    if (index <= Math.ceil(this[internal].length / 2)) {
                        handle = this[internal];
                        for (let i = 0; i < index; i++) handle = handle.next;
                        // 记录下标的值
                        flag = handle;
                        for (let i = 0; i < length; i++) {
                            handle = handle.next;
                            if (handle.value !== undefined) array[i] = handle.value;
                        }
                    } else {
                        handle = this[internal].prev;
                        // 在删除前，删除后 的位置
                        length = index + length;
                        for (let i = this[internal].length; i > length; i--) handle = handle.prev
                        // handle停留在删除后的位置，并将flag遍历到删除前的下标的值
                        flag = handle;
                        for (let i = length; i > index; i--) {
                            if (flag.value !== undefined) array[i - index - 1] = flag.value;
                            flag = flag.prev;
                        }
                    }
                    // 移除值
                    if (flag !== handle) {
                        flag.next = handle.next;
                        if (handle.next !== undefined) {
                            if (flag !== this[internal]) handle.next.prev = flag;
                            else handle.next.prev = undefined;
                        } else {
                            if (flag !== this[internal]) this[internal].prev = flag;
                            else this[internal].prev = undefined;
                        }
                        this[internal].length -= array.length;
                    }
                    // 添加值
                    if (values.length > 0) {
                        const nodes = objectsToNodes(values);
                        if (this[internal].next !== undefined) {
                            if (flag !== this[internal].prev) {
                                nodes.prev.next = flag.next;
                                flag.next.prev = nodes.prev;
                            } else this[internal].prev = nodes.prev;
                            flag.next = nodes.next;
                            if (flag !== this[internal]) nodes.next.prev = flag;
                        } else {
                            this[internal].next = nodes.next;
                            this[internal].prev = nodes.prev;
                        }
                        this[internal].length += nodes.length;
                    }
                    return array;
                }
            },
            // 修改指定元素的值，返回修改前的值，若没有修改，则返回undefined；如果index={index:value,...}这样的形式，则返回对应下标修改前的map(object)对象。因为object会自动排序，所以这里不能用array
            set: {
                enumerable: false, value: function (index, value = undefined) {
                    if (value !== undefined && typeof index !== "object") {
                        if (isNaN(index)) return;
                        else if (index < 0) {
                            index = this[internal].length + index;
                            if (index < 0) return;
                        } else if (index > this[internal].length) return;
                        // 就近遍历
                        if (index <= Math.ceil(this[internal].length / 2)) {
                            let handle = this[internal].next;
                            for (let i = 0; i < index; i++) handle = handle.next;
                            const result = handle.value;
                            handle.value = value;
                            return result;
                        } else {
                            let handle = this[internal].prev;
                            for (let i = this[internal].length - 1; i > index; i--) handle = handle.prev;
                            const result = handle.value;
                            handle.value = value;
                            return result;
                        }
                    } else {
                        let i = 0, handle = this[internal].next, j = i, flag = handle;
                        const map = {};
                        for (let k in index) {
                            if (isNaN(k) || k > this[internal].length || k < 0) continue;
                            k = Math.floor(k);
                            if (Math.abs(k - i) > Math.abs(k - j)) {
                                i = j;
                                handle = flag;
                            }
                            if (Math.abs(k - i) <= k && Math.abs(k - i) <= Math.abs(k - this[internal].length)) {
                                if (k > i) for (; i < k; i++) handle = handle.next;
                                else for (; i > k; i--) handle = handle.prev;
                                map[k] = handle.value;
                                handle.value = index[k];
                            } else {
                                // 就近遍历
                                if (k <= Math.ceil(this[internal].length / 2)) {
                                    flag = this[internal].next;
                                    for (j = 0; j < k; j++) flag = flag.next
                                } else {
                                    flag = this[internal].prev;
                                    for (j = this[internal].length - 1; j > k; j--) flag = flag.prev;
                                }
                                map[k] = flag.value;
                                flag.value = index[k];
                            }
                        }
                        return map;
                    }
                }
            },
            // 获取指定下标元素值，如果只输入了一个index，则返回对应index元素值；如果输入多个index，根据输入的下标按顺序返回一个数组，如果指定没找到，则以数组对应位置以空位填充；如果无参数则返回空数组
            get: {
                enumerable: false, value: function (...index) {
                    if (index.length === 1) {
                        index = index[0];
                        if (isNaN(index)) return;
                        else if (index < 0) {
                            index = this[internal].length + index;
                            if (index < 0) return;
                        } else if (index > this[internal].length) return;
                        // 就近遍历、
                        if (index <= Math.ceil(this[internal].length / 2)) {
                            let handle = this[internal].next;
                            for (let i = 0; i < index; i++) handle = handle.next
                            return handle.value;
                        } else {
                            let handle = this[internal].prev;
                            for (let i = this[internal].length - 1; i > index; i--) handle = handle.prev;
                            return handle.value;
                        }
                    } else {
                        let i = 0, handle = this[internal].next, j = i, flag = handle;
                        const array = [];
                        for (let k in index) {
                            if (isNaN(k) || k > this[internal].length || k < 0) {
                                array.length++;
                                continue;
                            }
                            k = Math.floor(k);
                            if (Math.abs(k - i) > Math.abs(k - j)) {
                                i = j;
                                handle = flag;
                            }
                            if (Math.abs(k - i) <= k && Math.abs(k - i) <= Math.abs(k - this[internal].length)) {
                                if (k > i) for (; i < k; i++) handle = handle.next;
                                else for (; i > k; i--) handle = handle.prev;
                                if (handle.value !== undefined) array.push(handle.value);
                                else array.length++;
                            } else {
                                // 就近遍历
                                if (k <= Math.ceil(this[internal].length / 2)) {
                                    flag = this[internal].next;
                                    for (j = 0; j < k; j++) flag = flag.next
                                } else {
                                    flag = this[internal].prev;
                                    for (j = this[internal].length - 1; j > k; j--) flag = flag.prev;
                                }
                                if (flag.value !== undefined) array.push(flag.value);
                                else array.length++;
                            }
                        }
                        return array;
                    }
                }
            },
            // slice() 方法返回一个新的数组对象，这一对象是一个 [index,end) 范围的数组
            slice: {
                enumerable: false, value: function (index, end = this[internal].length) {
                    index = Math.floor(index);
                    end = Math.floor(end);
                    if (isNaN(index)) index = 0;
                    else if (index < 0) {
                        index = this[internal].length + index;
                        if (index < 0) index = 0;
                    } else if (index > this[internal].length) index = this[internal].length;
                    if (end > this[internal].length) end = this[internal].length;
                    else if (end < 0) end = 0;
                    const array = Array(end - index);
                    // 就近遍历
                    let handle;
                    if (index <= Math.ceil(this[internal].length / 2)) {
                        handle = this[internal].next;
                        for (let i = 0; i < index; i++) handle = handle.next;
                        for (let i = index; i < end; i++) {
                            if (handle.value !== undefined) array[i - index] = handle.value;
                            handle = handle.next;
                        }
                    } else {
                        handle = this[internal].prev;
                        for (let i = this[internal].length - 1; i > end; i--) handle = handle.prev;
                        for (let i = end - 1; i >= index; i--) {
                            if (handle.value !== undefined) array[i - index] = handle.value;
                            handle = handle.prev;
                        }
                    }
                    return array;
                }
            },
            // 返回从0开始遍历，第一个指定value的下标
            indexOf: {
                enumerable: false, value: function (value) {
                    let handle = this[internal].next, index = 0;
                    while (handle !== undefined) {
                        if (handle.value === value) return index;
                        handle = handle.next;
                        index++;
                    }
                }
            },
            // 返回从0开始遍历，第一个指定value的下标
            lastIndexOf: {
                enumerable: false, value: function (value) {
                    let handle = this[internal].prev, index = this[internal].length - 1;
                    while (handle !== undefined) {
                        if (handle.value === value) return index;
                        handle = handle.prev;
                        index--;
                    }
                }
            },
            // 将可迭代对象，添加到链表中
            concat: {
                enumerable: false, value: function (...objects) {
                    if (objects.length === 0) return this;
                    const nodes = objectsToNodes(...objects);
                    if (this[internal].next !== undefined) {
                        this[internal].prev.next = nodes.next;
                        nodes.next.prev = this[internal].prev;
                        this[internal].prev = nodes.prev;
                    } else {
                        this[internal].next = nodes.next;
                        this[internal].prev = nodes.prev;
                    }
                    this[internal].length += nodes.length;
                    return this;
                }
            },
            // 将每个元素toString并以指定分隔符连接成字符串
            join: {
                enumerable: false, value: function (separator = ",") {
                    if (this[internal].length > 0) {
                        let result = str(this[internal].next.value), handle = this[internal].next.next;
                        while (handle !== undefined) {
                            result += separator + str(handle.value);
                            handle = handle.next;
                        }
                        return result;

                        function str(o) {
                            if (o !== undefined && o !== null) return o.toString();
                            else return "";
                        }
                    } else return "";
                }
            }
        });
        return LinkedList;
    })();

    /**
     * 梅森旋转算法中用到的变量如下所示：
     * w：长度 生成的随机数的二进制长度
     * n：寄存器长度 参与旋转的随机数个数（旋转的深度）
     * m：周期参数，用作第三阶段的偏移量 旋转算法参与旋转的中间项
     * r：低位掩码/低位要提取的位数 内存界限值 2 的 r 次方 - 1 x⃗ (u)kx→k(u) 和 x⃗ (l)k+1x→k+1(l) 的切分位置
     * a：旋转矩阵的参数 旋转算法异或基数 矩阵 AA 的最后一行
     * f：初始化梅森旋转链所需参数 旋转链异或值膨化量
     * u,s,t,l: 整数参数，移位运算的移动距离
     * d,b,c: 比特遮罩
     * s,t：TGFSR的位移量
     * b,c：TGFSR的掩码
     * u,d,l：额外梅森旋转所需的掩码和位移量
     */
    window.MT = (function () {
        // 新方案定义私有变量。修复部分浏览器不支持 # 定义private私有变量
        const internal = Symbol("internal");

        // 旋转算法处理旋转链
        function generate() {
            for (let i = 0n; i < this[internal].n; i++) {
                const lower_mask = -(1n << this[internal].r);
                const upper_mask = ~lower_mask;
                const y = (this[internal].list[i] & upper_mask) + (this[internal].list[(i + 1n) % this[internal].n] & lower_mask);
                let yA = y >> 1n;
                if ((y % 2n) !== 0n) {
                    yA = yA ^ this[internal].a;
                }
                this[internal].list[i] = this[internal].list[(i + this[internal].m) % this[internal].n] ^ yA;
            }
        }

        function MT(seed = Date.now(), bit = 32) {
            if (this instanceof MT) {
                const args = {
                    // MT19937-32的参数列表如下：
                    32: {
                        n: 624n, m: 397n, r: 31n,
                        a: 0x9908B0DFn, f: 1812433253n,
                        u: 11n, d: 0xFFFFFFFFn,
                        s: 7n, b: 0x9D2C5680n,
                        t: 15n, c: 0xEFC60000n,
                        l: 18n
                    },
                    // MT19937-64的参数列表如下：
                    64: {
                        n: 312n, m: 156n, r: 31n,
                        a: 0xB5026F5AA96619E9n, f: 6364136223846793005n,
                        u: 29n, d: 0x5555555555555555n,
                        s: 17n, b: 0x71D67FFFEDA60000n,
                        t: 37n, c: 0xFFF7EEE000000000n,
                        l: 43n
                    }
                };
                if (typeof args[bit] === "undefined") throw new Error("未定义" + bit.toString() + "bit的参数");
                Object.defineProperty(this, internal, {
                    value: {
                        w: BigInt(bit), n: args[bit].n, m: args[bit].m, r: args[bit].r,
                        a: args[bit].a,
                        u: args[bit].u, d: args[bit].d,
                        s: args[bit].s, b: args[bit].b,
                        t: args[bit].t, c: args[bit].c,
                        l: args[bit].l,
                        index: 0n, list: [BigInt(seed)]
                    },
                    writable: false,
                    enumerable: false
                });
                // 对数组其他元素进行初始化
                for (let i = 1n; i < this[internal].n; i++) {
                    this[internal].list[i] = (args[bit].f * (this[internal].list[i - 1n] ^ (this[internal].list[i - 1n] >> (this[internal].w - 2n))) + i & (1n << this[internal].w) - 1n);
                }
                return this;
            } else return new MT(seed, bit);
        }

        Object.defineProperties(MT.prototype, {
            // 获取随机数
            next: {
                enumerable: false, value: function () {
                    if (this[internal].index === 0n) generate.call(this);
                    let y = this[internal].list[this[internal].index];
                    y = (y ^ ((y >> this[internal].u) & this[internal].d));
                    y = (y ^ ((y << this[internal].s) & this[internal].b));
                    y = (y ^ ((y << this[internal].s) & this[internal].b));
                    y = (y ^ ((y << this[internal].t) & this[internal].c));
                    y = (y ^ (y >> this[internal].l));
                    this[internal].index = (this[internal].index + 1n) % this[internal].n;
                    if (this[internal].w <= 53n) y = parseInt(y.toString());
                    return y;
                }
            }
        });

        return MT;
    })();
// 未经许可禁止抄袭算法，可以私用。
    window.Key = (function () {
        // 定义private私有变量
        const internal = Symbol("internal");

        // 自定义加密算法，以防数据包被破解。
        function Key(pwd) {
            if (this instanceof Key) {
                // num，密码偏移量
                // key，排列长度偏移量
                // charCode，防止内存频繁运动，定义在外部
                let key = 7n;
                if (typeof pwd === "string") {
                    for (let i = 0; i < pwd.length; i++) {
                        key = key * 31n + BigInt(pwd[i].charCodeAt(0));
                    }
                    key = key & 0xFFFFFFFFFFFFn;
                } else if ((typeof pwd).match(new RegExp("(number|'bigint')"))) {
                    // 如果密码是数值型就使用此方法作为 密码偏移量 和 排列长度偏移量=
                    key = (key * 31n + BigInt(Math.round(pwd))) & 0xFFFFFFFFFFFFn;
                } else {
                    // 如果类型不匹配就直接提出错误
                    console.error("Unsupported type '" + (typeof pwd) + "'. It only supports 'string' 'number' 'bigint'.");
                }
                // 让排列长度偏移量取第一个数字。加上密码转换成字符字符串的方式
                Object.defineProperty(this, internal, {
                    value: {pwd: key.toString(36)},
                    writable: false,
                    enumerable: false
                });
                return this;
            } else return new Key(pwd);
        }

        Object.defineProperties(Key.prototype, {
            encrypt: {
                enumerable: false, value: function (string, ...strings) {
                    function resolve(string) {
                        if (typeof string === "string" && string.length > 0) {
                            string = string.split("");
                            // 加密种子。
                            const MTSeed = new MT(string.length + parseInt(this[internal].pwd, 36));
                            let result = "";
                            // 打乱顺序并加密
                            for (let i = string.length; i > 0; i--) {
                                const rand = MTSeed.next();   // rand[0,2^32-1]
                                const k = string.splice(rand % i, 1)[0].charCodeAt(0) + rand;
                                result += rand % 2 === 0 ?
                                    String.fromCharCode(Math.floor(k / 0x10000)) + String.fromCharCode(Math.floor(k % 0x10000)) :
                                    String.fromCharCode(Math.floor(k % 0x10000)) + String.fromCharCode(Math.floor(k / 0x10000));
                            }
                            // 返回加密结果
                            return result;
                        } else if (string.constructor.name === "Array") {
                            for (let i = 0; i < string.length; i++) {
                                string[i] = resolve.call(this, string[i]);
                            }
                            return string;
                        } else {
                            // 如果加密字符串不存在就返回string
                            return string;
                        }
                    }

                    if (strings.length === 0) {
                        return resolve.call(this, string);
                    } else {
                        return resolve.call(this, [string].concat(strings));
                    }
                }
            },
            decrypt: {
                enumerable: false, value: function (string, ...strings) {
                    function resolve(string) {
                        if (typeof string === "string" && string.length > 0) {
                            // 加密种子。
                            const MTSeed = new MT(string.length / 2 + parseInt(this[internal].pwd, 36));
                            // 解密并恢复顺序
                            const result = [], map = [];
                            for (let i = 0; i < string.length; i += 2) {
                                const rand = MTSeed.next();   // rand[0,2^32-1]
                                let k = string.substring(i, i + 2);
                                k = rand % 2 === 0 ?
                                    k.charCodeAt(0) * 0x10000 + k.charCodeAt(1) :
                                    k.charCodeAt(1) * 0x10000 + k.charCodeAt(0);
                                map.push([rand % ((string.length - i) / 2), String.fromCharCode(k - rand)]);
                            }
                            for (const item of map.reverse()) result.splice(item[0], 0, item[1]);
                            // 返回加密结果
                            return result.join("");
                        } else if (string.constructor.name === "Array") {
                            for (let i = 0; i < string.length; i++) {
                                string[i] = resolve.call(this, string[i]);
                            }
                            return string;
                        } else {
                            // 如果解密字符串不存在就返回string
                            return string;
                        }
                    }

                    if (strings.length === 0) {
                        return resolve.call(this, string);
                    } else {
                        return resolve.call(this, [string].concat(strings));
                    }
                }
            }
        });

        const KEY = new Key("Tenfond");
        Object.defineProperty(Key, "encrypt", {
            value: function () {
                return KEY.encrypt.apply(KEY, arguments);
            },
            writable: false,
            enumerable: false,
            configurable: false
        });
        Object.defineProperty(Key, "decrypt", {
            value: function () {
                return KEY.decrypt.apply(KEY, arguments);
            },
            writable: false,
            enumerable: false,
            configurable: false
        });
        return Key;
    })();
})();