// ==UserScript==
// @name         优酷视频去广告
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.0
// @description  Remove ADs
// @match        https://v.youku.com/v_show/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/406932/%E4%BC%98%E9%85%B7%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/406932/%E4%BC%98%E9%85%B7%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    //破解清晰度
    window.onload = function () {
        var qpo = 0;
        $(".youku-film-player").children("video").bind('play', function () {
                if (qpo === 0) {
                    $(".quality-dashboard").children("div").not("div[data-val='download']").eq(1).click();
                    qpo = 1;
                };
            });
        $(".youku-layer-wuliao").hide();
        $(".js-hdr").children("span.youku_vip_pay_btn").removeClass("youku_vip_pay_btn disable");
        $(".quality-dashboard").children("div.youku_vip_pay_btn").removeClass("youku_vip_pay_btn disable");
        $(".quality-dashboard").children("div.login-canuse").removeClass("login-canuse");
    }
    //去广告
    const rules = [{
            //去倒计时
            url: /^(https:)?\/\/acs\.youku\.com\/h5\/mtop\.youku\.play\.ups\.appinfo\.get.+callback=mtopjsonp.+/, async callback(url) {
                const val = await (await fetch(url, { credentials: 'include' })).text();
                const cb = url.match(/mtopjsonp\d*/);
                if (!cb) return;
                const index = val.indexOf(cb[0]);
                if (index < 2) {
                    const json = JSON.parse(val.slice(index + cb[0].length + 1, -1));
                    delete json.data.data.ad;
                    createScript(`${cb[0]}(${JSON.stringify(json)})`);
                }
            }
    }
  ];
    
    const createScript = (text) => {
        const script = document.createElement('script');
        script.textContent = text;
        document.head.appendChild(script);
        script.remove();
    }
    Object.defineProperty(HTMLScriptElement.prototype, '_original', Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src'));
    Object.defineProperty(HTMLScriptElement.prototype, 'src', {
        get() {return this._original;}, 
        set(val) {
            const rule = rules.find(r => r.url.test(val));
            if (rule) {rule.callback(val);} else {this._original = val;}
        }
    });
})();
