// ==UserScript==
// @name         百度翻译Anki制卡助手
// @namespace    http://juexe.cn
// @version      0.4
// @description  百度翻译XAnki快速制卡助手
// @author       Juexe
// @match        https://fanyi.baidu.com/*
// @grant        none
// @note         2020.09.07-v0.4 支持静默添加模式；Toast操作提示。
// @note         2020.05.10-v0.3 可自定义tag关键词；优化tag点击监听事件；增加记忆技巧。
// @note         2020.04.24-v0.2 添加简明释义
// @note         2020.04.13-v0.1 初始版本
// @downloadURL https://update.greasyfork.org/scripts/400615/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91Anki%E5%88%B6%E5%8D%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/400615/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91Anki%E5%88%B6%E5%8D%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let config = {
        'apiAddress': 'http://localhost:8765',
        'deckName': '1.1 英语生词',
        'modelName': '英语生词',
        'frontName': '例句',
        'backName': '翻译',
        'backNoteName': '背面备注',
        'apiKey': 'juexe',
        'autoClose': false,
        'keywordStyleL': '<u>',
        'keywordStyleR': '</u>',
        'silentMode': true //静默添加卡片,否则弹出添加对话框
    };
    let anki_status = false;
    let word_brief = '';

    console.log('百度翻译Anki助手正在运行……');

    initAnki();

    /**
     * 尝试 Anki 连接
     * @desc 成功连接到anki才进行后续注入动作
     */
    function initAnki() {
        sendToAnki({
            "action": "deckNames",
            "version": 6
        }).then(function(data) {
            anki_status = true;
            console.log('连接 AnkiConnect 成功');
            injectCss();
            waitReady(2000);
        }).catch(function(err) {
            anki_status = false;
            console.log('连接 AnkiConnect 失败', err);
        })
    }

    /**
     * 等待关键位置加载完成
     * @param interval 检查频率（毫秒）
     */
    function waitReady(interval = 1000) {
        if (document.querySelector('.anki-send') != null) {
            console.log('重复操作 waitReady()');
            return;
        }
        let hd = setInterval(function() {
            let flag = document.querySelector('.double-sample ol li .sample-source');
            // console.log('find result', flag);
            if (flag != null) {
                // console.log('found!');
                clearInterval(hd);
                inject();
                injectTagButton();
                addTagItemClicker();
            }
        }, interval);
    }

    /**
     * 在关键位置注入插件按钮
     */
    function inject() {
        if (document.querySelector('.anki-send') != null) {
            console.log('重复操作 inject()');
            return;
        }
        console.log('百度翻译Anki助手已载入。');
        dealBriefInfo();
        let samples = document.querySelectorAll('.double-sample ol li');
        samples.forEach(function(sample) {
            let inDom = document.createElement('a');
            inDom.className = 'anki-send';
            inDom.setAttribute('href', 'javascript:void(0)');
            inDom.innerText = '🚀';
            inDom.onclick = function() {
                getSentence(this);
            };
            sample.querySelector('div:last-child').prepend(inDom);
        });
    }

    /**
     * 注入标签按钮
     */
    function injectTagButton() {
        if (document.querySelector('.tag-add-btn') != null) {
            console.log('重复操作 injectTagButton()');
            return;
        }
        let inDom = document.createElement('button');
        inDom.className = 'tag-add-btn';
        inDom.setAttribute('href', 'javascript:void(0)');
        inDom.innerText = '🎨';
        inDom.onclick = function(ev) {
            let key = prompt('输入关键词');
            if (key) {
                console.log('自定义关键词', key);
                let tagDom = document.createElement('span');
                tagDom.className = 'sample-tagitem';
                tagDom.innerText = key;

                document.querySelector('.sample-tagnav').append(tagDom);
            }
            ev.stopPropagation();
            return false;
        };
        document.querySelector('.section-header').prepend(inDom);
    }

    /**
     * 获取单词简明释义
     */
    function dealBriefInfo() {
        let infoLines = document.querySelectorAll('.dictionary-comment p');
        word_brief = '';
        infoLines.forEach(function(p) {
            word_brief += p.innerText.replace('\n', '') + '<br>';
        });
        let momory_skill = document.querySelector('.momory-skill');
        if (momory_skill) {
            word_brief += '[记忆] ' + momory_skill.innerText;
        }
    }

    /*
     * 按钮动作：获取句子信息
     */
    function getSentence(dom) {
        // console.log('dom', dom);

        let sentenceDom = dom.parentNode.querySelector('a~.sample-source');
        let sentence = sentenceDom.innerText;
        let keywords = sentenceDom.querySelectorAll('.high-light');
        let boldText = '';
        keywords.forEach(function(keyword) {
            boldText += keyword.innerText;
        });
        boldText = boldText.trim();
        // console.log('highlight', boldText);
        if (sentence.indexOf(boldText) > -1)
            sentence = sentence.replace(boldText, config.keywordStyleL + boldText + config.keywordStyleR);
        sentence = sentence.trim();
        if (sentence.charAt(sentence.length - 1) !== '.')
            sentence += '.';
        // console.log('sentence', sentence);

        let trans = dom.parentNode.querySelector('a~.sample-target').innerText;
        // console.log('trans', trans);

        let resource = dom.parentNode.querySelector('a~.sample-resource').innerText;
        // console.log('resource', resource);

        if(config.silentMode){
            addNoteSilent(sentence, trans, resource);
        }else{
            addCard(sentence, trans, resource);
        }
    }

    /**
     * 添加卡片
     * @param front
     * @param backend
     * @param chapter
     */
    function addCard(front, backend, chapter = 'Anki 助手') {
        sendToAnki({
            "action": "guiAddCards",
            "version": 6,
            "params": {
                "note": {
                    "deckName": config['deckName'],
                    "modelName": config['modelName'],
                    "fields": {
                        [config.frontName]: front,
                        [config.backName]: backend,
                        [config.backNoteName]: word_brief
                    },
                    "options": {
                        "closeAfterAdding": config.autoClose
                    },
                    "tags": []
                }
            }
        }).then(function(data) {}).catch(function(err) {
            anki_status = false;
            alert('连接 AnkiConnect 失败');
            console.log(err);
        })
    }


    /**
     * 添加卡片
     * @param front
     * @param backend
     * @param chapter
     */
    function addNoteSilent(front, backend, chapter = 'Anki 助手') {
        sendToAnki({
            "action": "addNote",
            "version": 6,
            "params": {
                "note": {
                    "deckName": config['deckName'],
                    "modelName": config['modelName'],
                    "fields": {
                        [config.frontName]: front,
                        [config.backName]: backend,
                        [config.backNoteName]: word_brief
                    },
                    "options": {
                        "allowDuplicate": false,
                        "duplicateScope": "deck"
                    },
                    "tags": []
                }
            }
        }).then(function(data) {
            Toast("添加成功!", 1000);
        }).catch(function(err) {
            anki_status = false;
            alert('连接 AnkiConnect 失败');
            console.log(err);
        });
    }

    /**
     * 封装 fetch 实现 post 请求
     * @param req
     * @returns {Promise<fetch>}
     */
    function sendToAnki(req) {
        req['key'] = config.apiKey;
        return new Promise((resolve, reject) => fetch(config.apiAddress, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(req),
            })
            .then(res => res.json())
            .then(data => {
                let erro = data['error'];
                if (erro != null) {
                    alert('Anki助手请求失败：' + erro);
                    console.log(erro);
                } else {
                    resolve(data);
                }
            })
            .catch(err => reject(err))
        )
    }

    // 监听 url 发生变化
    let refreshTimeout;
    window.addEventListener('hashchange', function() {
        if (anki_status === true) {
            // console.log('url change');
            clearTimeout(refreshTimeout);
            refreshTimeout = setTimeout(waitReady, 3000);
        }
    }, false);

    // 释义标签点击触发
    function addTagItemClicker() {
        let tagnav = document.querySelector(".sample-tagnav");
        // 补充缺失的tagnav
        if (!tagnav) {
            tagnav = document.createElement('div');
            tagnav.className = 'sample-tagnav';
            document.querySelector('.sample-wrap').prepend(tagnav);
            let tag1 = document.createElement('span');
            tag1.className = 'sample-tagitem sample-all sample-current';
            tag1.innerText = '全部';
            tagnav.prepend(tag1);
            console.log('自动补全 tagnav');
        }
        tagnav.onclick = function(ev) {
            setTimeout(inject, 1000);
        };
    }

    // css
    function injectCss() {
        var dom = document.createElement('style'),
            dom_body = document.getElementsByTagName("body")[0];
        dom.innerHTML += '.anki-send{display:block; position:absolute; left:4px;}';
        dom_body.appendChild(dom);
    }

    // 简单Toast
    function Toast(msg,duration=3000){
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
    }
})();