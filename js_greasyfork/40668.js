// ==UserScript==
// @name        知乎键盘快捷键
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.1
// @description  给知乎 Nweb 页面增加键盘快捷键，方便使用
// @author       Veg
// @include        *.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40668/%E7%9F%A5%E4%B9%8E%E9%94%AE%E7%9B%98%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/40668/%E7%9F%A5%E4%B9%8E%E9%94%AE%E7%9B%98%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==
(function() {
    setTimeout(function() {
        proc(document);
        amo(proc);
    }, 10);
    function proc(d) {
        var url = window.location.href;
        var tokens = url.substring(20);
        var token = tokens.split('/');
        //回答页快捷键
        if (token[1] == 'question') {
            var answer = document.querySelectorAll('div.AnswerItem');
            for (var i = 0, l = answer.length; i < l; i++) {
                var pq = answer[i].querySelector('p.p-serialNumber');
                if (pq == null) {
                    var p = document.createElement("p");
                    p.innerHTML = i + 1;
                    p.className = 'p-serialNumber';
                    answer[i].insertBefore(p, answer[i].firstChild);
                }
                answer[i].setAttribute('focuss', i);
                var tabindex = answer[i].getAttribute('tabindex');
                if (tabindex == null) {
                    answer[i].setAttribute('tabindex', '-1');
                    answer[i].addEventListener("keydown", shortcutKey, null);
                }
            }
        }

        if (token[1] !== 'question') {
            //非问答页快捷键
            var timeline = document.querySelectorAll('div.TopstoryItem,div.List-item');
            for (var i = 0, l = timeline.length; i < l; i++) {
                var pq = timeline[i].querySelector('p.p-serialNumber');
                if (pq == null) {
                    var p = document.createElement("p");
                    p.innerHTML = i + 1;
                    p.className = 'p-serialNumber';
                    timeline[i].insertBefore(p, timeline[i].firstChild);
                }
                timeline[i].setAttribute('focuss', i);
                var tabindex = timeline[i].getAttribute('tabindex');
                if (tabindex == null) {
                    timeline[i].setAttribute('tabindex', '-1');
                    timeline[i].addEventListener("keydown", shortcutKey, null);
                }
            }
        }

    }
    function amo(processFunction) {;
        var mcallback = function(records) {
            records.forEach(function(record) {
                if (record.type == 'childList' && record.addedNodes.length > 0) {
                    var newNodes = record.addedNodes;
                    for (var i = 0, len = newNodes.length; i < len; i++) {
                        if (newNodes[i].nodeType == 1) {
                            processFunction(newNodes[i]);
                        }
                    }
                }
            });
        };
        var mo = new MutationObserver(mcallback);
        mo.observe(document.body, {
            'childList': true,
            'subtree': true
        });
    }
})();

//导航和操作快捷键函数
function shortcutKey(k) {
    if (k.target == this) {
        if (k.keyCode == 13) {
            var name = this.innerText;
            navigator.clipboard.writeText(name);
        }
    }
    var focusElement = document.activeElement;
    var role = focusElement.getAttribute('role');
    if (role == 'textbox' || k.altKey || k.ctrlKey) return false;
    var feed = document.querySelectorAll('div[focuss]');
    var focussValue = this.getAttribute('focuss');
    var number = parseInt(focussValue);
    if (k.keyCode == 65) {
        if (focussValue !== null) {
            k.stopPropagation();
            feed[number + 1].focus();
        }
    }
    if (k.keyCode == 90) {
        if (focussValue !== null) {
            k.stopPropagation();
            feed[number - 1].focus();
        }
    }
    if (k.keyCode == 87) {
        if (this.querySelector('button.ContentItem-rightButton') == null) {
            this.querySelector('button.ContentItem-more').click();
            this.focus();
        } else {
            var x = this.querySelector('button.ContentItem-rightButton');
            x.focus();
            x.click();
            this.focus();
        }
    }
    if (k.keyCode == 86) {
        if (this.querySelector('button.VoteButton--up') == null) {
            this.querySelector('button.LikeButton').click();
            this.querySelector('button.LikeButton').focus();
        } else {
            this.querySelector('button.VoteButton--up').click();
            this.querySelector('button.VoteButton--up').focus();
        }
    }
    if (k.keyCode == 68) {
        this.querySelector('button.VoteButton--down').click();
        this.querySelector('button.VoteButton--down').focus();
    }
    var operation = this.querySelectorAll('button.Button--withLabel');
    if (k.keyCode == 67) {
        if (this.querySelector('div.Comments-container') == null) {
            operation[0].click();
        } else {
            operation[0].click();
            operation[0].focus();
        }
    }
    if (k.keyCode == 70) {
        operation[1].focus();
        operation[1].click();
    }
    if (k.keyCode == 83) {
        operation[2].focus();
        operation[2].click();
    }
    if (k.keyCode == 84) {
        operation[3].focus();
        operation[3].click();
    }

}

//导航快捷键在非内容区的功能
document.body.addEventListener("keydown",
function(k) {
    var focusElement = document.activeElement;
    var role = focusElement.getAttribute('role');
    var input = focusElement.tagName;
    if (role == 'textbox' || input == 'INPUT' || input == 'TEXTAREA' || role == 'combobox') return false;
    var content = document.querySelectorAll('div[focuss]');
    for (var i = 0, l = content.length; i < l; i++) {
        if (k.keyCode == 65) {
            content[0].focus();
        }
        if (k.keyCode == 90) {
            content[l - 1].focus();
        }
    }
    var downReason = document.querySelectorAll('div.VoteDownReasonMenu-reason');
    for (var i = 0; i < downReason.length; i++) {
        if (k.keyCode == 49) {
            downReason[0].click();
        }
        if (k.keyCode == 50) {
            downReason[1].click();
        }
        if (k.keyCode == 51) {
            downReason[2].click();
        }
        if (k.keyCode == 52) {
            downReason[3].click();
        }
    }
    globalShortcutKey(k);
},
null);

//全局快捷键函数
function globalShortcutKey(k) {
    if (k.keyCode == 113) {
        var x = document.querySelector("div.CommentItem"); {
            x.setAttribute("tabindex", "-1");
            x.focus();
        }
    }
    if (k.altKey && k.keyCode == 81) {
        var gb = document.querySelectorAll("button.ContentItem-action");
        for (var i = 0; i < gb.length; i++) {
            var gbName = gb[i].innerText;
            if (gbName == "收起评论" || gbName == "​收起评论") {
                gb[i].click();
                gb[i].focus();
            }
        }
    }
    if (k.altKey && k.keyCode == 49) {
        var f = document.querySelectorAll("a.QuestionMainAction,a.NumberBoard-item,a[href='/lives'],button.follow-button,button.NumberBoard-itemWrapper"); {
            f[0].focus();
        }
    }
    if (k.altKey && k.keyCode == 50) {
        document.querySelector("button.PaginationButton-prev").focus();
    }
    if (k.altKey && k.keyCode == 51) {
        document.querySelector("button.PaginationButton-next").focus();
    }
    if (k.altKey && k.keyCode == 52) {
        var gd = document.querySelector('a.zu-button-more'); {
            gd.setAttribute('tabindex', '0');
            gd.focus();
        }
    }
    if (k.ctrlKey && k.keyCode == 81) {
        document.querySelector('a[href="/watch"]').focus();
    }
    if (k.altKey && k.keyCode == 88) {
        document.querySelector('button.NumberBoard-item').focus();
        document.querySelector('button.QuestionHeader-edit').focus();
    }
}
