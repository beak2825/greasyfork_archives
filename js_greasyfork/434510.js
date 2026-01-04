// ==UserScript==
// @name         绅士之庭辅助脚本
// @version      0.7
// @description  gmgard web helper
// @author       Number17831
// @match        https://gmgard.com/*
// @grant        none
// @namespace http://tampermonkey.net/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/434510/%E7%BB%85%E5%A3%AB%E4%B9%8B%E5%BA%AD%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434510/%E7%BB%85%E5%A3%AB%E4%B9%8B%E5%BA%AD%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    function DeleteUselessStrInTitileText(text) {
        // delete useless str in title
        return text
            .replace("[自购]", "")
            .replace("(同人音声)", "")
            .replace("[秒传]", "")
            .replace(/\s*:\s*/g, "：")
            .replace(/\[\d*(\.\d*)?G\]/g, "") // remove file size indicator like `[2.2G]`
            .replace(/\s*\/\s*/g, " ")
            .replace(/\s*&\s*/g, " ")
        ;

    }


    function fallBackCopyTextToClipboard(text) {
        let textArea = document.createElement("textarea");
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        textArea.style.width = '2em';
        textArea.style.height = '2em';

        textArea.style.padding = 0;

        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        textArea.style.background = 'transparent';

        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            let successful = document.execCommand('copy');
            let msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
            // alert("复制成功");
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }
    function copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }
    function ShowCopiedMsgInBtn(btn) {
        let oriTxt = btn.textContent;
        btn.textContent = "已成功复制";
        setTimeout(() => {
            btn.textContent = oriTxt;
        }, 1000 * 2);
    }

    function FindAndAddCopyBtn(queryStr){
        let targets = document.querySelectorAll(queryStr);

        for (let i = 0; i < targets.length; ++i){
            let target = targets[i];
            let button = document.createElement("button");
            button.append("复制文字");
            button.className = "btn btn-info btn-large";
            button.onclick = () => {
                if (target) {
                    fallBackCopyTextToClipboard(target.textContent.trim());
                    ShowCopiedMsgInBtn(button);
                } else {
                    alert("没有找到标题");
                }
            }
            target.parentNode.insertBefore(button, target.nextSibling);
        }
    }

    function FindAndAddBDLinkBtn(){
        let queryStr = "dd";
        let targets = document.querySelectorAll(queryStr);

        for (let target of targets){
            let spans = target.querySelector("span");
            if (spans === null) continue;
            if (spans.length === 0) continue;

            try {
                let a = target.querySelector("a");
                let s = target.querySelector("span span");

                let button = document.createElement("button");
                let btnText = "链接：" + a.href + "\n提取码：" + s.textContent;
                button.append(btnText);
                button.style.height = "60px";
                button.style.width = "100%";
                button.className = "btn btn-info btn-large";
                button.onclick = () => {
                    fallBackCopyTextToClipboard(btnText);
                    ShowCopiedMsgInBtn(button);
                }
                target.parentNode.insertBefore(button, target.nextSibling);
                let observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type == "attributes") {
                            if (a.href.includes("pan")) {
                                btnText = "链接：" + a.href + "\n提取码：" + s.textContent;
                                button.textContent = btnText;
                            } }
                    });
                });
                let event = new MouseEvent('mouseover', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                let keepFire = () => {
                    let intervalID = -1;
                    intervalID = setInterval(()=>{
                        a.dispatchEvent(event);
                        if (a.href.includes("pan")) {
                            console.log("interval success, clear out");
                            clearInterval(intervalID);
                        }
                    }, 600);
                };
                setTimeout(keepFire, 500);
                observer.observe(a, {attributes: true,});
            } catch (e) {
                console.log("get baidu link fail", e);
            }
        }
    }

    function FindAndAddTitleCopyBtn() {
        const selectString = "div.detaillayout h2";
        let button = document.createElement("button");
        button.append("复制标题文字");
        button.className = "btn btn-info btn-large";
        button.onclick = () => {
            let titleH2 = document.querySelector(selectString);

            if (titleH2) {
                let text = titleH2.textContent.trim();
                text = DeleteUselessStrInTitileText(text);
                fallBackCopyTextToClipboard(text);
                ShowCopiedMsgInBtn(button);
            } else {
                alert("没有找到标题");
            }
        }
        let titleH = document.querySelector(selectString);
        titleH.parentNode.insertBefore(button, titleH.nextSibling);


        let tags = document.querySelector("#tag-div");
        tags.parentNode.insertBefore(button, tags.previousSibling);
    }

    function FindBDQuickLink() {
        let regex = /[\w\d]+#[\w\d]+#\d+#.*/g; // expression here

        let possible_elms = $("p, span").filter(function () {
            return regex.test(this.innerHTML);
        });

        let visited = {};
        for (let elm of possible_elms) {
            for (let bdquick_text of elm.textContent.match(regex)) {
                bdquick_text = bdquick_text.trim()
                console.log("bdquick_text", bdquick_text, visited[bdquick_text]);
                if (visited[bdquick_text]) continue;

                visited[bdquick_text] = true;
                let name = bdquick_text.match(/[\w\d]+#[\w\d]+#\d+#(.*)/)[1]
                let button = document.createElement("a");
                button.append("一键秒传：" + name);
                button.href = "https://pan.baidu.com/#bdlink=" + btoa(encodeURIComponent(bdquick_text));
                button.className = "btn btn-info btn-large";
                button.target = "_blank";
                button.rel = "noreferrer nofollow noopener";
                elm.parentNode.insertBefore(document.createElement("br"), null); // append
                elm.parentNode.insertBefore(button, null); // append
            }
        }
    }

    FindBDQuickLink();
    FindAndAddCopyBtn(".label.label-inverse");
    FindAndAddTitleCopyBtn();
    FindAndAddBDLinkBtn();
})();