// ==UserScript==
// @name         知乎看图脚本
// @namespace    https://github.com/cheezone
// @version      1.0
// @description  让我们愉快地看图吧
// @author       以茄之名
// @author:en    Chezz
// @homepage     https://www.zhihu.com/people/iCheez
// @match        https://www.zhihu.com/question/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/371548/%E7%9F%A5%E4%B9%8E%E7%9C%8B%E5%9B%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/371548/%E7%9F%A5%E4%B9%8E%E7%9C%8B%E5%9B%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css=`.Select-option:hover{background-color:rgb(246,246,246)}.Select-option{background-color:rgb(256,256,256)} `
    //按钮之间总是会粘结,特别恶心
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
    var appendChild = Node.prototype.appendChild;
    $(".RichText:has(figure)").parents('.AnswerItem').addClass('has-img');
    Node.prototype.appendChild = function() {
        if(this.classList&&this.classList.contains('RichContent')){
           if($(this).find('.RichText:has(figure)').length>0){
                $(this).parents('.AnswerItem').addClass('has-img');
            }else
                if($('body').hasClass('hiden-img')){
                    $(this).parents('.AnswerItem').hide();
//
                }
        }
        if(this.tabIndex==-1 && this.tagName=='DIV'){
            if(this.innerText=='默认排序'){
                console.error(this);
                var but=this.firstChild.cloneNode();
                but.id='show-image-only';
                if($('body').hasClass('hiden-img')){
                    but.innerText='恢复答案';
                    $('.Button.Select-button.Select-plainButton.Button--plain').text('默认排序')
                }else{
                    $('.Button.Select-button.Select-plainButton.Button--plain').text('只看有图')
                    but.innerText='只看有图的答案';
                }

                this.insertBefore(but,this.firstChild);
                but.addEventListener('click', function(event) {
                    if($('body').hasClass('hiden-img')){
                        $('.AnswerItem:not(.has-img)').show();
                        $('body').removeClass('hiden-img')

                    }else{

                        $('.AnswerItem:not(.has-img)').hide();
                        $('body').addClass('hiden-img')
                    }
                });

            }
        }
        return appendChild.apply(this, arguments);
    };
 
})();