// ==UserScript==
// @name         gerrit一键审批代码
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  在合入代码的时候需要手动+2，这个脚本实现点击按钮即可一键+2、post和submit
// @author       袁龙辉
// @match        https://gerrit.zte.com.cn/*
// @match        https://gitlab.zte.com.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAbCAYAAACJISRoAAAABHNCSVQICAgIfAhkiAAAAQtJREFUSInt1c1Kw0AUhuFTF8kFTJnAFFwKYrHQUjE0Fq2iOxG8Bn/vQ8SbEMX+oLhQ9+raXom9g0lI8roQBDdmFi0q5FsOfOdZDIdTAZAZZ27WQImUyC8ju3v7Ug1q0tva+fZ+dn4h1aAmYacreZ7/PISCPL+8orRBacPbeAyAtZaFxTpKG27v7otGUIgAbGxuo7Th4OgEgMFwhNKGVjskTdPpIA+PTyhtCMw875MJ671PtD8YudTdkCzLWFmNUNpweHyK0oZGs02SJNNDAG76w6+/UdpweXXtWnVH4jim3mihtGFpuYm11hlx3hPP86S7FomISNQJxfd91+ofWcZ/g1SgPL8lUiIF+QCIeCJE+P0wYgAAAABJRU5ErkJggg==
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/492626/gerrit%E4%B8%80%E9%94%AE%E5%AE%A1%E6%89%B9%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/492626/gerrit%E4%B8%80%E9%94%AE%E5%AE%A1%E6%89%B9%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    window.onpopstate = function () {
        main()
    };
    function main() {
        var regex_gerrit = /gerrit\.zte\.com\.cn\/#\/c\/\d+\/\d+\//;
        var regex_gitlab = /gitlab\.zte\.com\.cn\:446\/person\/#\/c\/\d{5}\//
        if (regex_gerrit.test(location.href) || regex_gitlab.test(location.href)) {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 审批代码弹窗
                            if (node.tagName === 'DIV' && node.className === 'com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-replyBox') {
                                console.log('进来了,1')
                                addApproveBtn()
                            }
                            // 评论弹窗
                            if (node.tagName === 'TEXTAREA' && node.className === 'com-google-gerrit-client-diff-DraftBox_BinderImpl_GenCss_style-editArea') {
                                console.log('进来了,2')
                                let siblings = Array.prototype.filter.call(node.parentNode.children, function(child) {
                                    return child !== node && child.classList.contains('ylh-coment-btn');
                                });
                                if (siblings.length > 0) return
                                addCommentBtn(node)
                            }
                        }
                    });
                });
            });
            var config = { childList: true, subtree: true };
            var target = document;
            observer.observe(target, config);
        }
    }
    main()

    function addApproveBtn() {
        if (document.getElementById('approveButton')) return
        var postBtn = document.querySelector('button[title="Post reply (Shortcut: Ctrl-Enter)"]');
        var btn = document.createElement('button')
        btn.id = 'approveButton'
        btn.innerText = '一键审批通过'
        btn.onclick = function () {
            const textArea = document.querySelector('.gwt-TextArea')
            if (!textArea.value) {
                const result = window.confirm("审批结果未填哟，是否自动填充“代码无明显问题，审批通过，可以合入”并审批通过？");
                if (result) {
                    textArea.value = '代码无明显问题，审批通过，可以合入'
                }
                else return
            }
            var codeReview = getTargetRadio(1, 5, 'Code-Review')
            codeReview?.click()
            var verified = getTargetRadio(2, 5, 'Verified')
            verified?.click()
            var workflow = getTargetRadio(3, 4, 'Workflow')
            workflow?.click()
            postBtn.click()
            setTimeout(()=> {
                const submitBtn = document.querySelector('.com-google-gerrit-client-change-Actions_BinderImpl_GenCss_style-submit');
                submitBtn.textContent && submitBtn.click()
            }, 1000)
        }
        postBtn.parentNode.insertBefore(btn, postBtn.nextSibling);
    }

    function addComment(saveBtn) {
        const textArea = document.querySelector('.com-google-gerrit-client-diff-DraftBox_BinderImpl_GenCss_style-editArea')
        textArea.value = textArea.value + ' 没有发现明显问题，ok'
        GM_setClipboard(textArea.value)
        saveBtn.click()
    }

    function addCommentBtn(node) {
        var saveBtn = document.querySelector('button[title="Save this draft comment');
        var btn = document.createElement('button')
        btn.innerText = '补全+save'
        btn.className = 'ylh-coment-btn'
        btn.style.width = '70px'
        btn.style.height = '20px'
        btn.style.fontSize = '12px'
        var ctrlTime = 0
        var spaceTime = 1
        // ctrl + 空格
        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey) {
                ctrlTime = event.timeStamp
            }
            if(event.code === 'Space') {
                spaceTime = event.timeStamp
            }
            if(ctrlTime === spaceTime){
                addComment(saveBtn)
                ctrlTime = 0
                spaceTime = 1
            }
        });
        btn.onclick = () => addComment(saveBtn)
        node.parentNode.insertBefore(btn, node.nextSibling);
    }

    function getTargetRadio(tr, td, name) {
        const targetTbody = document.querySelector('.com-google-gerrit-client-change-Resources-Style-section tbody');
        const thirdTr = targetTbody?.querySelectorAll('tr')[tr];
        const fifthTd = thirdTr?.querySelectorAll('td')[td];
        const targetSpan = fifthTd?.querySelector('span');
        return targetSpan?.querySelector(`input[name="${name}"]`);
    }
})();