// ==UserScript==
// @name         ZJU Course Review
// @namespace    http://grs.zju.edu.cn/
// @version      0.1
// @description  Automatically submit course reviews.
// @author       Charles Weng
// @match        http://grs.zju.edu.cn/py/page/student/jxzlpj.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27375/ZJU%20Course%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/27375/ZJU%20Course%20Review.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = 'Auto Submit';
    btn.style.cssText = 'margin: 0 20px; padding: 2px 10px; transform: translateY(-3px)';
    btn.onclick = () =>
        setTimeout(() => {
            $('.left.fl input[type=hidden]').val(4);
            $('input[value=5]').click();
            Post.form("save", "studentForm", function(message){
                if (message) {
                    alert(message);
                } else {
                    window.location = "grkcgl.htm";
                }
                return false;
			});
        });
    $('.mt5.mb10').append(btn);
})();