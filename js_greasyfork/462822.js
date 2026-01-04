// ==UserScript==
// @name         AutoTaskFramework
// @icon         data:image/png;base64,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
// @namespace    https://github.com/giveme0101/
// @version      3.5
// @description  自动任务框架
// @author       Kevin xiajun94@foxmail.com
// @match        *://*/*
// @run-at       document-idles
// @noframes
// ==/UserScript==

/** tool kit **/
if (typeof window.t2lKit === 'undefined') {
    window.t2lKit = {
        clog: function(leftText, rightText, endText) {
            let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            const opt = Object.assign({
                type: 'log',
                leftBGColor: '#555555',
                leftColor: '#ededed',
                rightBGColor: '#ffc107',
                rightColor: '#262318'
            }, options);
            console[opt.type]('%c' + leftText + '%c' + rightText + (endText ? '%c\n' + endText : ''), 'color: ' + opt.leftColor + ';background-color: ' + opt.leftBGColor + ';border-radius: 2px 0 0 2px;padding: 0 5px', 'color: ' + opt.rightColor + ';background-color: ' + opt.rightBGColor + ';border-radius: 0 2px 2px 0;padding: 0 5px;', '');
        },

        eleHide: function(ele, callback){
            let cnt = 1, scanInterval = setInterval(function(){
                const component = (typeof ele === "string" ? document.querySelector(ele) : ele);
                if (component || cnt++ >= 1000){
                    clearInterval(scanInterval);
                    component && (component.remove(), callback && callback());
                }
            }, 30);
        }
    }
}

/** auto task framework **/
if (typeof window.autoTask === 'undefined') {
    window.autoTask = {
        taskExec: function(_config) {

            const urlHost = window.location.host;
            const cfgHosts = _config.host, cfgTest = _config.test;

            let hostMatch = cfgHosts instanceof Array ? cfgHosts.some(ele => urlHost.indexOf(ele) > -1) : urlHost.indexOf(cfgHosts) > -1;
            if (!hostMatch) return;

            let testMatch = (typeof cfgTest) === 'boolean' ? cfgTest : cfgTest();
            if (!testMatch) return;

            t2lKit.clog("Auto Task™", "3.4", "plugin active [" + _config.name + "]: " + _config.desc);
            _config.action(_config.param);
        },

        run: function(configs){
            for (const idx in configs){
                try {
                    this.taskExec(configs[idx]);
                } catch(e){
                    console.error("Auto Task™ plugin [" + configs[idx].name + "] throw exception: " + e);
                }
            }
        }
    }
}
