// ==UserScript==
// @name              github在线编辑/运行
// @namespace         http://tampermonkey.net/
// @version           1.0
// @description       github跳转github1s和gitpod
// @icon              data:image/x-icon;base64,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
// @author            w__yi
// @match             https://*.github.com/*/*
// @require           https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant             none
// @charset		      UTF-8
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/445560/github%E5%9C%A8%E7%BA%BF%E7%BC%96%E8%BE%91%E8%BF%90%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/445560/github%E5%9C%A8%E7%BA%BF%E7%BC%96%E8%BE%91%E8%BF%90%E8%A1%8C.meta.js
// ==/UserScript==

const util = (function () {

    function findTargetElement(targetContainer) {
        const body = window.document;
        let tabContainer;
        let tryTime = 0;
        const maxTryTime = 120;
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                tabContainer = body.querySelector(targetContainer);
                if (tabContainer) {
                    clearInterval(interval);
                    resolve(tabContainer);
                }
                if ((++tryTime) === maxTryTime) {
                    clearInterval(interval);
                    reject();
                }
            }, 500);
        });
    }

    return {
        findTargetEle: (targetEle) => findTargetElement(targetEle)
    }
})();

const _CONFIG_ = {
    matchData: {
        GitHub: /github/
    }
};

const consumer = (function () {

    class BaseConsumer {
        call() {
        }

        github1s() {
            let btn = document.createElement('button');
            btn.innerText = 'github1s'
            btn.className = 'btn btn-primary ml-2';
            btn.onclick = function () {
                window.open(`${"https://github1s.com" + window.location.pathname}`);
            };
            return btn;
        }

        gitpod() {
            let btn = document.createElement('button');
            btn.innerText = 'gitpod'
            btn.className = 'btn btn-primary ml-2';
            btn.onclick = function () {
                window.open(`${"https://gitpod.io/#" + window.location.href}`);
            };
            return btn;
        }
    }


    class GitHubConsumer extends BaseConsumer {
        call() {
            util.findTargetEle('.file-navigation')
                .then((container) => {
                    container.append(this.github1s());
                    container.append(this.gitpod());
                })
                .catch(e => console.warn("页面加载不成功！", e));
        }
    }

    return {
        callConsumer: (path) => {
            let mallCase = undefined;
            for (let pattern in _CONFIG_.matchData) {
                if (_CONFIG_.matchData[pattern].test(path)) {
                    mallCase = pattern;
                    break;
                }
            }
            if (mallCase === undefined) {
                return;
            }
            const targetConsumer = eval(`new ${mallCase}Consumer`);
            targetConsumer.call();
        }
    }

})();

(function () {
    consumer.callConsumer(window.location);
})();