// ==UserScript==
// @name         debug
// @namespace    https://github.com/yeomanye
// @version      0.1.1
// @include      *://*
// @description  用于调试的脚本库
// @author       Ming Ye
// ==/UserScript==

(function(context) {
    var defaultEnable = true;

    /**
     * 创建分组调试函数的函数
     * @param  {string} namespace 命名空间
     * @param styleStr
     * @param  {string} type      日志类型
     * @param  {bool} enable 调试模式
     */
    function consoleFactory(namespace, styleStr, type, enable) {
        var empty = () => {},
            log;
        type = type || 'log';
        enable = enable || defaultEnable;
        var prevTime;
        /**
         * 创建的分组打印日志
         * @param  {bool} enable 是否启用日志
         */
        log = function() {
            if (log.enable) {
                var argArr = Array.prototype.slice.apply(arguments);

                var caller;
                try {
                    caller = arguments.callee.caller.name;
                } catch (e) {}
                caller = caller || '_caller'; //赋予默认值
                var prefix = '%c' + namespace + '： %c——' + caller + '—— %c';
                var cur = Date.now();
                prevTime = prevTime || cur;
                var diff = cur - prevTime;
                prevTime = cur;

                createArgs(prefix, diff, styleStr, argArr);


                //添加命名空间样式
                // argArr.splice(1,0,styleStr);
                console[type].apply(null, argArr);
            }
        };
        log.enable = enable;

        /**
         * 打印对象
         * @param  {string} desc 对象描述
         * @param  {object} obj  对象数据
         */
        log.logObj = function(desc, obj) {
            if (log.enable) {
                var argArr = [].slice.call(arguments);
                var desc = argArr.shift();
                argArr.unshift('color:green');
                var caller;
                try {
                    caller = arguments.callee.caller.name;
                } catch (e) {}
                caller = caller || 'caller_';
                argArr.unshift(`${caller}：%c[${desc}]`);

                console[type].apply(console, argArr);
            }
        };
        /**
         * 强调打印，用于结论等重要场合
         * @param  {string} desc 打印内容
         * @param bgColor
         */
        log.em = function(desc, bgColor) {
            if (log.enable) {
                var caller;
                try {
                    caller = arguments.callee.caller.name;
                } catch (e) {}
                caller = caller || '_caller';
                bgColor = bgColor || 'green';
                console[type](`%c${caller}：${desc}`, `font-size:18px;background-color:${bgColor};color:white;padding:4px`);
            }
        };
        return log;
    }

    function createArgs(prefix, diff, styleStr, argArr) {
        var formatStr = prefix;
        for (var i = 0, len = argArr.length; i < len; i++) {
            var arg = argArr[i];
            var argType = typeof arg;
            switch (argType) {
                case 'string':
                    formatStr += '%s ';
                    break;
                case 'number':
                    formatStr += '%d ';
                    break;
                case 'object':
                    formatStr += '%o ';
                    break;
            }
        }
        formatStr += '%c +' + diff + 'ms';
        argArr.splice(0, 0, formatStr, styleStr, 'font-weight:bold;', 'color:black;');
        argArr.push(styleStr);
    }

    // 当参数为true时开启调试
    var debugTrue = function(enable) {
        enable = (enable === undefined) ? myDebugger.enable : defaultEnable;
        if (enable) debugger;
    }

    var myDebugger = {
        consoleFactory: consoleFactory,
        debugTrue: debugTrue,
        enable: defaultEnable
    };

    context.myDebugger = myDebugger;

})(window);