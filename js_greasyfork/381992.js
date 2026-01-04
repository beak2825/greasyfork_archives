// ==UserScript==
// @name         52pojie-helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1.填充验证码。2.填充评论。3.缩进右侧条。
// @author       nameldk
// @match        https://www.52pojie.cn/thread-*.html
// @match        https://www.52pojie.cn/forum.php?mod=viewthread*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381992/52pojie-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/381992/52pojie-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 填充验证码
     */
    function inputAns() {
        function getInput(){
            return document.querySelector('#seccodeqS0 input[name="secanswer"]');
        }

        function fill() {
            var input = getInput();
            var ans = document.querySelector('#seccodeqS0_menu');
            if (input && ans) {
                input.value = ans.innerText.replace(/.+答案：/,"");
            } else {
                console.warn('empty', input, ans);
            }
        }
        function bind() {
            var input = getInput();
            var a = document.querySelector('#seccodeqS0 a');
            if(a) {
                a.addEventListener('click', function(){
                    setTimeout(function(){
                        var input = getInput();
                        bind();
                        fill();
                        input.blur();
                    }, 500);
                });
            } else {
                console.warn('no a click');
            }
        }
        fill();
        bind();
    }

    /**
     * 填充评论
     */
    function inputComment(){
        var commentInput = document.querySelector('#fastpostmessage');
        var commentList = [];
        var list = document.querySelectorAll('td[id^="postmessage"]');

        function getOne() {
            return commentList[Math.random()*commentList.length|0];
        }

        function change(){
            commentInput.value = getOne() + getOne();
            commentInput.focus();
            commentInput.blur();
        }

        if (list) {
            var a = document.querySelector('#secqaa_qS0');
            if (a && a.parentNode) {
                var c = document.createElement('a');
                c.text='换评论';
                c.href='javascrit:;';
                c.onclick = function(){
                    change();
                };
                a.parentNode.appendChild(c);
            }

            var i = 0;
            for (var o of list){
                if ((i++) == 0) continue;
                commentList[commentList.length] = o.innerText.replace(/.+? 发表于 .+? .+?:.+?/,'').replace(/\s+/,'');
            }
            change();
        }
    }

    /**
     * 缩进右侧条
     */
    function indentBar() {
        var jz52top = document.querySelector('#jz52top');

        if (jz52top){
            jz52top.style.right = '-30px';
            jz52top.addEventListener('mouseover', function(){
                this.style.right = '0px';
            });
            jz52top.addEventListener('mouseout', function(){
                this.style.right = '-30px';
            });
        }

    }


    setTimeout(function(){
        indentBar();
        inputAns();
        inputComment();
    }, 1000);
})();
