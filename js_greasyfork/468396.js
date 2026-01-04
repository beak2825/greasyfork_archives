// ==UserScript==
// @name         TamperMonkeyRouter
// @name:zh-CN   TamperMonkey路由
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Router for TamperMonkey scripts
// @author       HowardZhangdqs
// @grant        none
// @license      WTFPL
// ==/UserScript==

(function () {
    'use strict';

    const Router = class Router {
        // static opt = {
        //     hashchange: false,

        // };

        // constructor(options = {}) {
        //     this.opt = Object.assign(this.opt, options || {});
        // }

        static getParamType(param) {
            const _t = typeof param
            return (_t == "object"
                ? Object.prototype.toString.call(param).slice(8, -1)
                : _t
            ).toLowerCase();
        }

        static is_match(src, input) {
            if (src.length == 0 && input.length == 0) return true;
            if (src[0] == "*" && src.length == 1) return true;
            if (src.length == 0 || input.length == 0) return false;

            if (src[0] == "?")
                return this.is_match(src.substring(1), input.substring(1));
            else
                if (src[0] == "*")
                    return this.is_match(src.substring(1), input) || this.is_match(src.substring(1), input.substring(1)) || this.is_match(src, input.substring(1));
                else
                    if (src[0] == input[0])
                        return this.is_match(src.substring(1), input.substring(1));
                    else return false;
        }

        router(path, callback) {
            const href = window.location.href;
            if (Router.getParamType(path) == "string") {
                if (Router.is_match(path, href)) (() => { callback(); })();
            } else if (Router.getParamType(path) == "regexp") {
                if (path.test(href)) (() => { callback(); })();
            } else {
                throw new Error("Invalid type `" + Router.getParamType(path) + "` of input");
            }
        }

    }

    window.TamperMonkeyRouter = new Router().router;
})();