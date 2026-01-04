// ==UserScript==
// @name         蓝奏云域名替换
// @namespace    https://greasyfork.org/zh-CN/users/6065-hatn
// @version      0.2.1
// @description  替换www为pan
// @icon         http://www.gravatar.com/avatar/10670da5cbd7779dcb70c28594abbe56?r=PG&s=92&default=identicon
// @author       hatn
// @copyright	 2020, hatn
// @include      *
// @run-at     	 document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/407131/%E8%93%9D%E5%A5%8F%E4%BA%91%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/407131/%E8%93%9D%E5%A5%8F%E4%BA%91%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==
let lzyObj = {
    cat: /https:\/\/www.lanzous.com\/\S+/gi,
    targetStr: "https://pan.",
    originStr: "https://www.",
	init () {
        let i = 0, s = this;
        let urlStr = location.href;
        if (s.cat.test(urlStr)) {
            let toUrl = urlStr.replace(s.originStr, s.targetStr);
            location.href = toUrl;
        }
        let maxTimes = 50;
        let timer = setInterval(() => {
            if (i >= maxTimes) {
                let jq_url = 'https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js';
                let jqDom = document.createElement('script');
                jqDom.type = 'text/javascript';
                jqDom.async = true;
                jqDom.src = jq_url;
                jqDom.onload = () => s.replace();
                document.body.appendChild(jqDom);
                return clearInterval(timer);
            }
            ++i;
            if (typeof jQuery == 'undefined') return;
            clearInterval(timer);
            return s.replace();
            //console.log(i, 'times');
        }, 100);
    },

    replace() {
        let s = this;
        let $check = $('a[href^="https://www.lanzous.com/"]');
        if ($check.length < 1) return console.log('Log: There is no match !');
        $check.each(function() {
            let $s = $(this);
            let originUrl = $s.attr('href');
            if (!s.cat.test(originUrl)) return true; // 只处理分享链接
            let innerHTML = this.innerHTML;
            // console.log(originUrl, innerHTML);
            let newUrl = originUrl.replace(s.originStr, s.targetStr);
            let newHTML = innerHTML.replace(s.originStr, s.targetStr);
            // console.log(newUrl, newHTML);
            $s.attr('href', newUrl);
            this.innerHTML = newHTML;
        });
    }
};

lzyObj.init();