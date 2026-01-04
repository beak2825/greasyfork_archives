// ==UserScript==
// @name         推特敏感词过滤（告别黄推）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  上班看twitter时，最怕突然出现的黄推被同事或者老板发现，自动去黄，告别尴尬，当然在没人的时候，你可以把黄推给显示出来[laught]
// @author       ￥whz￥
// @match        https://twitter.com/*/status/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant      GM_registerMenuCommand
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      GM_addElement
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/474822/%E6%8E%A8%E7%89%B9%E6%95%8F%E6%84%9F%E8%AF%8D%E8%BF%87%E6%BB%A4%EF%BC%88%E5%91%8A%E5%88%AB%E9%BB%84%E6%8E%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/474822/%E6%8E%A8%E7%89%B9%E6%95%8F%E6%84%9F%E8%AF%8D%E8%BF%87%E6%BB%A4%EF%BC%88%E5%91%8A%E5%88%AB%E9%BB%84%E6%8E%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let hideBtn = true
    const default_sensitive_words = ['上床','同城可约','附近可约','线下可约','有约的吗','人妻','裸聊','小飞机','不授课']
    var sensitive_words = []
    const removeTweet = article => {
        article.classList.add('sensitive_hide');
        const div = article.parentElement.parentElement;
        div.style.background = "red";
        if (hideBtn){
            div.style.display = "none";
        }
    }

    const showTweet = article => {
        // console.log("showTweet: %O", article)
        article.classList.remove('sensitive_hide');
        const div = article.parentElement.parentElement;
        div.style.background = "";
        div.style.display = "";
    }

    const checkUserSensitiveWords = () => {
        // 用户有输入，就添加过滤条件
        sensitive_words = default_sensitive_words
        if(GM_getValue('user_sensitive_words')){
            var user_sensitive_words = GM_getValue('user_sensitive_words').trim().split(' ')
            sensitive_words = default_sensitive_words.concat(user_sensitive_words)
        }
    }

    const isSensitiveText = i => {
        var hidden = false //默认返回false，不隐藏
        try {
            const tweetContents = i.querySelectorAll('div[data-testid="tweetText"] span');
            // console.log('article content length', tweetContents.length,tweetContents)

            for(let j = 0; j<=tweetContents.length-1; j++){
                let content = tweetContents[j].innerText
                if (content){
                    var reg = new RegExp(`${sensitive_words.join('|')}`,'g')
                    if (reg.test(content)) {
                        console.log('违规内容：',content)
                        hidden = true
                    }else{
                        // console.log('\n内容：',content)
                    }
                }
            }

        } catch (e) {}

        return hidden;
    }

    const findTweetsForRemove = () => {
        checkUserSensitiveWords()
        const articles = document.querySelectorAll('main article[data-testid="tweet"]')
        // console.log('article list length', articles.length)
        articles.forEach(i => {
            if (isSensitiveText(i)) {
                removeTweet(i);
            }else{
                showTweet(i);
            }
        });
    }

    const startObserver = () => {
        const targetNode = document.documentElement || document.body;
        // findTweetsForRemove();
        // 这里观察到body有数据之后，就开始审查元素
        const config = { childList: true, subtree: true, attribute:false };
        const observer = new MutationObserver((mutationsList, observer) => {
            console.log("===observer=====start===")
             findTweetsForRemove();
           //  mutationsList.forEach((mutation) => {
           //      switch (mutation.type) {
           //          case "childList":
           //              /* 从树上添加或移除一个或更多的子节点；参见 mutation.addedNodes 与
           // mutation.removedNodes */
           //              console.log("===observer=====")
           //              findTweetsForRemove();
           //              break;
           //          case "attributes":
           //              /* mutation.target 中某节点的一个属性值被更改；该属性名称在 mutation.attributeName 中，
           // 该属性之前的值为 mutation.oldValue */
           //              break;
           //      }
           //  });
        });
        observer.observe(targetNode, config);
    }

    const menu_command_id_1 = GM_registerMenuCommand("Show/Hide sensitive tweets", function( MouseEvent) {
        hideBtn = !hideBtn;
        alert("sensitive tweers will be " + (hideBtn ? "hidden" : "shown (with red background)"));
        document.querySelectorAll('.sensitive_hide').forEach(i => {
            i.parentElement.parentElement.style.display = (hideBtn ? "none" : "");
        });
    }, {
        accessKey: "a",
        autoClose: true
    });
    const menu_command_id_2 = GM_registerMenuCommand("Setting sensitive words", function( MouseEvent) {

        var old_user_sensitive_words = GM_getValue('user_sensitive_words') ? GM_getValue('user_sensitive_words') : ''
        var words = prompt('Type sensitive words here, separate word by space', old_user_sensitive_words)
        // let reg = /\w+\s/g
        // if(reg.test(words)){
        //     alert('input text is invalid，please type it again')
        //     return
        // }
        GM_setValue('user_sensitive_words', words.trim())
        findTweetsForRemove()

    });


    setTimeout(() => {
        startObserver();
    }, 6000);
})();