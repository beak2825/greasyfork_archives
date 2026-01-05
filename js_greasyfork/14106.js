// ==UserScript==
// @name  [ js.hook.js ]
// @description javascript钩子; 劫持方法/伪造参数/篡改结果/还原劫持
// @namespace js.hook.js
// @version 0.0.4
// @author  vc1
// @downloadURL https://update.greasyfork.org/scripts/14106/%5B%20jshookjs%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/14106/%5B%20jshookjs%20%5D.meta.js
// ==/UserScript==
/*
 *
 *  [ js.hook.js ]
 *
 *  javascript钩子
 *
 *  * 劫持方法
 *  * 伪造参数
 *  * 篡改结果
 *  * 还原劫持
 *
 *  * 2016-10-31
 *  * vc1
 *
 */
(function(name, factory) {
    if (typeof define === "function" && define.amd) {
        define(name, factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        this[name] = factory();
    }
})('hook', function() {
    /*
     * 入口方法
     *
     * hook(alert) // 默认全局方法
     * hook(window, 'alert') // 指定方法所在对象
     * hook('window.tool.calc') // [推荐]字符串形式访问路径
     */
    function hook() {
        'use stric';
        if (this instanceof hook) return this;
        // hook('window.tool.calc')
        var fn_real, // 原始方法正身 - function calc() { ... }
            fn_name, // 被劫持的方法名 - 'calc'
            fn_object, // 被劫持的方法所在对象 - window.tool
            fn_object_name; // 所在对象名 - 'window.tool'

        var args = Array.prototype.slice.call(arguments),
            arg = args.pop();
        fn_object = args.pop() || root;
        fn_name = arg.name;
        if (typeof arg === 'string') {
            arg = arg.split('.');
            fn_name = arg.pop();
            fn_object_name = arg.join('.');
            fn_object = eval(fn_object_name || fn_object);
        }
        fn_real = fn_object[fn_name];

        if (!(fn_object && fn_name && fn_real)) {
            console.error(arguments);
            throw new Error('hook fail');
        }

        // 存储钩子信息
        var storage;
        if (fn_object_name) {
            storage = hook.prototype.storage[fn_object_name] =
                hook.prototype
                .storage[fn_object_name] || {};
        } else {
            fn_object.__hook__ || Object.defineProperties && Object.defineProperties(fn_object, {
                '__hook__': {
                    value: {},
                    enumerable: false,
                    configurable: true
                }
            });
            storage = fn_object.__hook__;
        }

        // 已经对此方法劫持过了，返回已有的钩子
        if (storage[fn_name]) {
            return storage[fn_name].exports;
        }

        var h = new hook();
        // 原始方法正身
        h.fn_real = fn_real;
        // 被劫持的方法名
        h.fn_name = fn_name;
        // 被劫持的方法所在对象，默认 window
        h.fn_object = fn_object;
        // 所在对象名称
        h.fn_object_name = fn_object_name;
        // 伪造传入参数
        h.fake_arg_fn = null;
        // 伪造返回结果
        h.fake_rst_fn = null;
        // 对外暴露的功能
        h.exports = {
            fake: bind(h.fake, h),
            fakeArg: bind(h.fakeArg, h),
            fakeArgFn: bind(h.fakeArgFn, h),
            fakeRst: bind(h.fakeRst, h),
            fakeRstFn: bind(h.fakeRstFn, h),
            off: bind(h.off, h),
            offArg: bind(h.offArg, h),
            offRst: bind(h.offRst, h),
            data: {
                fn_real: fn_real,
                fn_name: fn_name,
                fn_object_name: fn_object_name,
                fn_object: fn_object,
                fn_puppet: h.fn_puppet,
                fakeArgFn: h.fake_arg_fn,
                fakeRstFn: h.fake_rst_fn
            }
        };
        /*h.exports = {
            fake: h.fake.bind(h),
            fakeArg: h.fakeArg.bind(h),
            fakeRst: h.fakeRst.bind(h),
            off: h.off.bind(h),
            offArg: h.offArg.bind(h),
            offRst: h.offRst.bind(h),
            data: {
                fn_real: fn_real,
                fn_name: fn_name,
                fn_object_name: fn_object_name,
                fn_object: fn_object,
                get fn_puppet() {
                    return h.fn_puppet;
                },
                get fakeArgFn() {
                    return h.fakeArgFn;
                },
                get fakeRstFn() {
                    return h.fakeRstFn;
                }
            }
        };*/

        // 保存当前钩子
        storage[fn_name] = h;

        // 可以链式调用
        return h.exports;
    }

    hook.prototype.storage = {};
    var root = window || global,
        eval = root.eval;
    // 模拟Function.bind
    var bind = function(fn, scope) {
        return function() {
            return fn.apply(scope, arguments)
        }
    }

    /*
     * 替换原始方法
     *
     * 作用等于 temp=alert; alert=function(){// your function}
     *
     * fakeFn(arguments, data)
     * 接收到的参数列表, 原始方法信息, 对象实例或原对象, 执行时的作用域
     * flag为false，等于x=fn
     */
    hook.prototype.fake = function(fakeFn, flag) {
        var data = this.exports.data;
        var puppet = eval("(function " + this.fn_real.name +
            "() {" +
            "data.scope = this;" +
            (flag === false ?
                "return fakeFn.apply(this, arguments)" :
                "return fakeFn.call(this, arguments, data)"
            ) +
            "})");
        for (var prop in this.fn_real) {
            if (obj.hasOwnProperty(k)) {
                puppet[prop] = this.fn_real[prop];
            }
        }
        puppet.toLocaleString = puppet.toString = function() {
            return 'function () { [native code] }';
        };

        this.fn_puppet = this.exports.fn_puppet = puppet;
        this.fn_object[this.fn_name] = puppet;

        return this.exports;
    };

    /*
     * 在原方法前，劫持传入的参数
     *
     * fakeArg('直接替换为要传入的参数', '2', 3...)
     *
     */
    hook.prototype.fakeArg = function() {
        'use stric';
        this.__fakeArgRst__();
        this.fake_arg_fn = this.exports.data.fakeArgFn =
            __getFun__(
                arguments);
        return this.exports;
    };
    /*
     * fakeArgFn(function(原参数1, 2, 3...){
     *     return [修改后的参数1,2,3]
     *     // 无返回(undefinded)则使用原始参数
     *     // 清空传入参数可以返回一个空数组 return []
     * })
     *
     */
    hook.prototype.fakeArgFn = function(fn) {
        'use stric';
        this.__fakeArgRst__();
        this.fake_arg_fn = this.exports.data.fakeArgFn = fn;
        return this.exports;
    };

    /*
     * 在原方法后，劫持返回的数据
     *
     * fakeRst('直接替换为要返回的结果')
     *
     */
    hook.prototype.fakeRst = function(arg) {
        'use stric';
        this.__fakeArgRst__();
        this.fake_rst_fn = this.exports.data.fakeRstFn =
            __getFun__(
                arg);
        return this.exports;
    };
    /*
     * fakeRstFn(function(原返回值){
     *     return 修改后的返回值
     *     // 无返回(undefinded)则使用原始参数
     * })
     *
     */
    hook.prototype.fakeRstFn = function(fn) {
        'use stric';
        this.__fakeArgRst__();
        this.fake_rst_fn = this.exports.data.fakeRstFn = fn;
        return this.exports;
    };


    /*
     * 开启劫持arg/rst
     */
    hook.prototype.__fakeArgRst__ = function() {
        'use stric';
        if (typeof this.fn_puppet === 'function') return;
        var t = this;
        var fakeArgRstFn = function(args, data) {
            var faked_arg = data.fakeArgFn ? data.fakeArgFn
                .apply(this, args) || args : args;
            faked_arg = faked_arg === undefined ? args : faked_arg;
            typeof faked_arg !== 'string' && Array.prototype
                .slice.call(faked_arg).length === 0 && (faked_arg = [faked_arg]);
            var real_rst = data.fn_real.apply(this,
                faked_arg);
            var faked_rst = data.fakeRstFn ? data.fakeRstFn
                .call(this, real_rst) : real_rst;
            faked_rst = faked_rst === undefined ? real_rst : faked_rst;
            return faked_rst;
        };
        this.fake(fakeArgRstFn, true);
    };

    /*
     * 关闭劫持
     *
     * 传入参数为空：关闭前后所有劫持   hook(alert).off()
     * 传入字符串 "arg" 或 "rst"：关闭对应劫持   hook(alert).off('arg')
     * 传入方法：关闭对应劫持
     *
     * 前后劫持全部关闭后，还原被 hook 的方法
     */
    hook.prototype.off = function(filter) {
        'use stric';;
        (!filter || filter === 'arg') && (this.fake_arg_fn = this.exports
            .data.fakeArgFn =
            null);
        (!filter || filter === 'rst') && (this.fake_rst_fn = this.exports
            .data.fakeRstFn =
            null);

        if (!this.fake_arg_fn && !this.fake_rst_fn) {
            this.fn_object[this.fn_name] = this.fn_real;
            this.fn_puppet = undefined;
            //delete this.storage[this.fn_object_name][this.fn_name];
        }

        return this.exports;
    };

    /*
     * 关闭前面的参数劫持
     *
     */
    hook.prototype.offArg = function(filter) {
        'use stric';
        filter = filter || 'arg';
        this.off(filter);
        return this.exports;
    };

    /*
     * 关闭后面的结果劫持
     *
     */
    hook.prototype.offRst = function(filter) {
        'use stric';
        filter || 'rst';
        this.off(filter);
        return this.exports;
    };


    /*
     * 直接修改参数或返回结果
     */
    var __getFun__ = function(args) {
        'use stric';
        return /*typeof args[0] == 'function' ? args[0] :*/ function() {
            return args;
        };
    };

    return hook;
});




// 效果测试


/*



window.tool = {
    calc: function(msg, n) {
        console.warn('calc收到参数：' + msg + ', ' + n);
        var r = n * n;
        console.warn('calc结果：' + r);
        return r;
    }
}



console.clear();
console.info('一个计算器：');

console.group('原始方法：\ntool.calc');
console.log(tool.calc);
console.info('设置参数：' + '专注于计算平方的计算器' + ', ' + 42);
console.info('接收到的结果：' + tool.calc('专注于计算平方的计算器', 42));
console.groupEnd();
console.log('\n');


console.group("劫持后：\nhook('window.tool.calc').fakeArg('这个计算器坏了', -1).fakeRst(function(right){\n" +
"    console.info('fakeRst：计算器结果返回：' + right);\n " +
"    return '<(ˉ^ˉ)> 告诉你坏了'\n" +
"}")
hook('window.tool.calc').fakeArg('这个计算器坏了', -1).fakeRstFn(function(right){
    console.info('fakeRst：计算器返回的结果：' + right);
    return '<(ˉ^ˉ)> 告诉你坏了'
});
console.log(tool.calc);
console.info('设置参数：' + '专注于计算平方的计算器' + ', ' + 42);
console.info('接收到的结果：' + tool.calc('专注于计算平方的计算器', 42));
console.groupEnd();
console.log('\n');


console.group("还原后：\nhook('window.tool.calc').off();");
hook('window.tool.calc').off();
console.log(tool.calc);
console.info('设置参数：' + '专注于计算平方的计算器' + ', ' + 42);
console.info('接收到的结果：' + tool.calc('专注于计算平方的计算器', 42));
console.groupEnd();



*/



/*



function print(msg){
    document.write((msg||'<br>') + '<br>');
}

window.tool = {
    calc: function(msg, n) {
        print('calc收到参数：' + msg + ', ' + n);
        var r = n * n;
        print('calc结果：' + r);
        return r;
    }
}


print('一个计算器：');

print('原始方法：\ntool.calc');
print(tool.calc);
print('设置参数：' + '专注于计算平方的计算器' + ', ' + 42);
print('接收到的结果：' + tool.calc('专注于计算平方的计算器', 42));
print();
print('\n');


print("劫持后：\nhook('window.tool.calc').fakeArg('这个计算器坏了', -1).fakeRst(function(right){\n" +
"    print('fakeRst：计算器结果返回：' + right);\n " +
"    return '<(ˉ^ˉ)> 告诉你坏了'\n" +
"}");
hook('window.tool.calc').fakeArg('这个计算器坏了', -1).fakeRstFn(function(right){
    print('fakeRst：计算器返回的结果：' + right);
    return '<(ˉ^ˉ)> 告诉你坏了'
});
print(tool.calc);
print('设置参数：' + '专注于计算平方的计算器' + ', ' + 42);
print('接收到的结果：' + tool.calc('专注于计算平方的计算器', 42));
print();
print('\n');


print("还原后：\nhook('window.tool.calc').off();");
hook('window.tool.calc').off();
print(tool.calc);
print('设置参数：' + '专注于计算平方的计算器' + ', ' + 42);
print('接收到的结果：' + tool.calc('专注于计算平方的计算器', 42));
print();



*/