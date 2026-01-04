// ==UserScript==
// @name         财报
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  财报小工具
// @author       ahl
// @include      *://fr.p5w.net/report/*
// @include      *://zsl.p5w.net/report/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=p5w.net
// @grant        none
// @license     GPL License
// @downloadURL https://update.greasyfork.org/scripts/442280/%E8%B4%A2%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/442280/%E8%B4%A2%E6%8A%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...

    console.log('程序执行');
    // iframe 中不运行
    if (window.top != window.self) {
        return;
    }
    var srtList = [];
    var paragraphList = [];
    var nextList = ['报告显示', '关键指标', '经营活动现金流方面', '盈利能力方面', '运营能力方面', '偿债能力方面', '成长能力方面', '股东户数情况', '主营构成方面', '研发投入方面', '更多详情'];
    var stepList = ['销售毛利率', '营业利润占营业总收入', '营业成本占营业收入', '流动比率', '速动比率', '归属母公司股东的净利润', '十大股东情况方面']
    var currentSrt = '';
    createhView();
    createSrtEl();
    optimizationStyle();

    function createhView() {

        let tpl_pageone = document.getElementById('tpl_pageone').innerHTML;
        tpl_pageone += `
        <div class="section" data-anchor="endpage">
            <img height="100%" src="https://ae01.alicdn.com/kf/H5fadb461dd0c46e2be9a411bf7d9ac29g.png" alt="片尾图片-时报.png" />
        </div>`;
        document.getElementById('tpl_pageone').innerHTML = tpl_pageone;

        // 主元素
        var div = document.createElement('div');
        div.id = 'ahl-view-box';
        div.style =
            'position: fixed; z-index: 999999; top: 0; right: 0; padding: 5px; font-size: 12px; text-align: center; list-style-type: none; background-color: #fff;background-clip: padding-box;border-radius: 2px;outline: none; box-shadow: 0 3px 6px -4px rgba(0,0,0,.12),0 6px 16px 0 rgba(0,0,0,.08),0 9px 28px 8px rgba(0,0,0,.05); -webkit-transform: translateZ(0);';
        document.body.insertAdjacentElement('afterBegin', div);

        let textarea = document.createElement('textarea');
        textarea.id = 'ahl-paragraph-textarea';
        textarea.className = 'textarea';
        textarea.placeholder = '文案';
        textarea.style =
            'display: block; height: 180px; width: 260px; font-size: 12px; list-style-type: none; background-color: #fff;background-clip: padding-box;border-radius: 2px;outline: none; border: 1px solid #eee;';
        div.appendChild(textarea);

        let a = document.createElement('a');
        a.href = 'javascript:;';
        a.style =
            ' position: relative; max-width: 120px; display: inline-block;background: #D0EEFF;border: 1px solid #99D3F5;border-radius: 4px; padding: 4px 12px;color: #1E88C7;text-decoration: none;text-indent: 0;line-height: 20px;';

        div.appendChild(a);

        let span = document.createElement('span');
        span.id = 'srt-title-input-lable';
        span.innerText = '选取字幕文件';
        a.appendChild(span);

        let input = document.createElement('input');
        input.id = 'ahl-srt-input';
        input.type = 'file';
        input.accept = '.srt, .json';
        input.style = ' position: absolute; font-size: 16px; right: 0; top: 0; left: 0;opacity: 0;';
        input.onchange = function (event) {
            let files = this.files || [];
            if (!files.length) return;
            let file = files[0];
            let reader = new FileReader();
            reader.onloadend = function (event) {
                if (file.name.endsWith('srt')) {
                    const srtResult = parseSrt(reader.result);
                    srtList = srtResult.subtitles;
                } else {
                    let srtText = getJianyingSrt(reader.result);
                    const srtResult = parseSrt(srtText);
                    srtList = srtResult.subtitles;
                }
            };
            reader.readAsText(file);
        };
        a.appendChild(input);

        let startA = document.createElement('a');
        startA.id = 'ahl-srt-start';
        startA.href = 'javascript:;';
        startA.innerText = '开始';
        startA.style = 'display: inline-block; margin-left:20px; padding: 4px 8px;text-decoration: none; cursor: pointer; color: #333;background: rgb(208, 238, 255);border: 1px solid rgb(153, 211, 245); border-radius: 4px; padding: 4px 12px;';
        startA.onclick = function () {
            start();
        };
        div.appendChild(startA);

        var helpDiv = document.createElement('div');
        helpDiv.id = 'ahl-help';
        let space = 10;
        helpDiv.style =
            `
            position: fixed; 
            border: 1px solid #fff;
            left: 0;
            right: 0;
            bottom: ${space/2}px;
            top: ${space/2}px;
            width: ${(window.innerHeight - space)*16/9}px;
            z-index: 10000;
            margin: 0 auto;
            -webkit-transform: translateZ(0);
            `;
        document.body.insertAdjacentElement('afterBegin', helpDiv);
        window.onresize = function() {
            helpDiv.style.width = `${(window.innerHeight - space)*16/9}px`;
        }
    }

    function start() {
        document.getElementById('ahl-help').style.display = 'none';
        parseParagraph();
        calibration();
        countDown(5)
    }

    function countDown(timer) {
        $.fn.fullpage.moveTo(1);
        $('.section').each(function(){
            $(this).find('.parent_hd>ul li').eq(0).trigger('click');
        });
        setTimeout(() => {
            document.getElementById('ahl-srt-start').innerText = `开始${timer}`;
            if (timer == 0) {
                document.getElementById('ahl-view-box').style.display = 'none';
                startShowSrt();
            } else {
                countDown(--timer);
            }
        }, 1000);
    }


    // 获取文案原文数组
    function parseParagraph() {
        paragraphList = [];
        let textareaEl = document.getElementById('ahl-paragraph-textarea');
        var paragraph = textareaEl.value;
        paragraph.split(/[!\?：,，。；\n]+/).forEach((v) => {// 根据标点符号或空格切割成多个单词，转小写，计数
            if (v == "") return;
            console.log(v);
            paragraphList.push(v);
        });
    }

    // 校准字幕
    function calibration() {
        let index = 0, newSrtList = [];
        for (let srtI = 0; srtI < srtList.length; srtI++) {
            const srt = srtList[srtI];
            if (index > paragraphList.length) {
                return;
            }
            let paragraph = paragraphList[index];
            srt.subtitle = srt.subtitle.replace(/百分之/g, '%');
            while (srt.subtitle.length >= getSmmIndex(paragraph, true) && srt.subtitle.length >= paragraph.length + getSmmIndex(paragraphList[index + 1], false)) {
                ++index;
                paragraph += paragraphList[index];
            }
            while (srt.subtitle.length < getSmmIndex(paragraph, false) && (srtI < srtList.length - 1 && srt.subtitle.length + srtList[srtI + 1].subtitle.length < getSmmIndex(paragraph, true))) {
                srt.subtitle += srtList[srtI + 1].subtitle;
                srt.endTime = srtList[srtI + 1].endTime;
                console.error(srt.subtitle);
                ++srtI;
            }
            console.log('subtitle', srt.subtitle);
            console.log('paragraph', paragraph);
            srt.subtitle = paragraph;
            newSrtList.push(srt);
            ++index;
        }
        srtList = newSrtList;
    }

    function getSmmIndex(str, jia) {
        if (jia) {
            return Math.floor(str.length + str.length / 4)
        } else {
            return Math.floor(str.length - str.length / 4)
        }
    }

    /**
     * 解析字幕文件
     * @param {*} srt 字幕字符串
     * @param {*} opts {report: 是否打印}
     * @returns
     */
    function parseSrt(srt, opts) {
        var options = Object.assign({ report: true }, opts)
        const subtitles = []
        const textSubtitles = srt.split(/\n\n/).filter(x => x) // 每条字幕的信息，包含了序号，时间，字幕内容
        try {
            for (let i = 0; i < textSubtitles.length; i++) {
                const textSubtitle = textSubtitles[i].split('\n').filter(x => x.trim())
                if (options.report) {
                    console.log(`第${i + 1}条字幕:`, textSubtitle)
                }
                if (textSubtitle.length >= 2) {
                    const sequence = textSubtitle[0]
                    const startTime = toSecond(textSubtitle[1].split(/\s*-->\s*/)[0].trim())
                    const endTime = toSecond(textSubtitle[1].split(/\s*-->\s*/)[1].trim())
                    let subtitleEn = ''
                    let subtitle = ''

                    for (var j = 2; j < textSubtitle.length; j++) {
                        if (/[\u4e00-\u9fa5]/g.test(textSubtitle[j])) {
                            subtitle += textSubtitle[j];
                        } else {
                            subtitleEn += textSubtitle[j];
                        }
                    }

                    const t = {
                        sequence: +sequence,
                        startTime: parseInt(startTime * 1000),
                        endTime: parseInt(endTime * 1000),
                        subtitleEn: subtitleEn.trim(),
                        subtitle: subtitle.trim()
                    }
                    subtitles.push(t)
                }
            }

            const { endTime: e = 0 } = subtitles[subtitles.length - 1]
            const minutes = parseInt(e / 60)
            const seconds = parseInt(e % 60)
            console.log({ subtitles, minutes, seconds, duration: e })
            return { subtitles, minutes, seconds, duration: e }
        } catch (err) {
            console.log(err)
            return null
        }
    }

    /**
     * 把字符串格式的字幕时间转换为浮点数
     * @param  string t 字符串格式的时间
     * @return 浮点数格式的时间
     */
    function toSecond(t) {
        var s = 0.0
        if (t) {
            return t.split(':').reduce((s, cur) => {
                s += s * 60 + parseFloat(cur.replace(',', '.'))
                return s
            }, 0.0)
        }
        return s
    }


    function startShowSrt() {
        var speed = 10,
            counter = 1,
            srtNum = 0,
            start = new Date().getTime();

        function instance() {
            var real = (counter * speed),
                ideal = (new Date().getTime() - start);
            counter++;
            var diff = (ideal - real);
            if (showSrt(srtNum, ideal)) {
                srtNum += 1;
                if (srtNum >= srtList.length) {
                    endShow();
                    return;
                }
            }
            window.setTimeout(function () { instance(); }, (speed - diff)); // 通过系统时间进行修复
        };
        window.setTimeout(function () { instance(); }, speed);
    }

    function endShow() {
        setTimeout(() => {
            document.getElementById('ahl_srt_el').innerText = '';
            document.getElementById('ahl-srt-start').innerText = `重新开始`;
            document.getElementById('ahl-view-box').style.display = 'block';
            document.getElementById('ahl-help').style.display = 'block';
        }, 2000);
    }

    // 字幕
    function createSrtEl() {
        // 主元素
        let div = document.createElement('div');
        div.id = 'ahl_srt_el';
        // mix-blend-mode: difference;
        div.style =
            'position: fixed; z-index: 999999; bottom: 20px; left: 0px; right: 0px; padding: 5px; font-size: 42px; text-align: center; color: #fff; ';
        document.body.insertAdjacentElement('afterBegin', div);
    }

    function showSrt(srtNum, ideal) {
        let srt = srtList[srtNum];
        if (ideal > srt.startTime - 2) {
            console.error('start>' + ideal);
            currentSrt = srt.subtitle;
            keywordEvent(currentSrt);

            console.error(srt);
            if (currentSrt.indexOf('更多详情') != -1 || currentSrt.indexOf('谢谢') != -1) {
                return true;
            }

            // setTimeout(() => {
            document.getElementById('ahl_srt_el').innerText = currentSrt;
            // }, 5);
            return true;
        } else if (currentSrt != '' && srtNum > 0 && ideal > srtList[srtNum - 1].endTime + 2) {
            console.error('end>' + ideal);
            currentSrt = '';
            document.getElementById('ahl_srt_el').innerText = currentSrt;
        }
        return false;
    }

    function keywordEvent(subtitle) {
        nextList.forEach(str => {
            if (subtitle.indexOf(str) != -1) {
                console.log('keydown down');
                $.fn.fullpage.moveSectionDown();
                return;
            }
        });
        stepList.forEach(str => {
            if (subtitle.indexOf(str) != -1) {
                console.log('keydown right');
                nextStep();
            }
        });
    }

    function nextStep() {
        var $index = _curPageDom.find('.parent_hd>ul li.on').index();
        var $len = _curPageDom.find('.parent_hd>ul li').length;
        var _index = 0

        if ($index === $len - 1) {
            _index = 0
        } else {
            _index = $index + 1
        }
        _curPageDom.find('.parent_hd>ul li').eq(_index).trigger('click')
    }

    /************************* 样式优化 ************************/

    function optimizationStyle() {
        console.log('开始优化样式');
        addStyle(
            `
            #menu, .shareit, .copybox {
                display: none !important;
            }`,
            'ahl-optimization-style'
        );
    }

    // 添加样式
    function addStyle(css, className, addToTarget, isReload, initType) {
        /**
         * addToTarget这里不要使用head标签,head标签的css会在html载入时加载，
         * html加载后似乎不会再次加载，body会自动加载
         * **/
        let addTo = document.querySelector(addToTarget);
        if (typeof addToTarget == 'undefined') addTo = document.head || document.body || document.documentElement || document;
        isReload = isReload || false; // 默认是非加载型
        initType = initType || 'text/css';
        // 如果没有目标节点(则直接加) || 有目标节点且找到了节点(进行新增)
        if (typeof addToTarget == 'undefined' || (typeof addToTarget != 'undefined' && document.querySelector(addToTarget) != null)) {
            // clearInterval(tout);
            // 如果true 强行覆盖，不管有没有--先删除
            // 如果false，不覆盖，但是如果有的话，要退出，不存在则新增--无需删除
            if (isReload === true) {
                safeRemove('.' + className);
            } else if (isReload === false && document.querySelector('.' + className) != null) {
                // 节点存在 && 不准备覆盖
                return true;
            }
            let cssNode = document.createElement('style');
            if (className != null) cssNode.className = className;
            cssNode.setAttribute('type', initType);
            cssNode.innerHTML = css;
            try {
                addTo.appendChild(cssNode);
            } catch (e) {
                console.log(e.message);
            }
            return true;
        }
    }

    // 删除元素
    function safeRemove(cssSelector_OR_NEWfunction) {
        if (typeof cssSelector_OR_NEWfunction == 'string') {
            try {
                let removeNodes = document.querySelectorAll(cssSelector_OR_NEWfunction);
                for (let i = 0; i < removeNodes.length; i++) removeNodes[i].remove();
            } catch (e) { }
        } else if (typeof cssSelector_OR_NEWfunction == 'function') {
            try {
                cssSelector_OR_NEWfunction();
            } catch (e) { }
        } else {
            console.log('未知命令：' + cssSelector_OR_NEWfunction);
        }
    }

    // windows下选 draft_content.json 文件，macOS下选 draft_info.json 文件。 其基本原则就是选文件最大的.json文件
    function getJianyingSrt(draftStr) {
        let srtStr = '';
        try {
            let txtJson = JSON.parse(draftStr);
            let srtMap = getSrtMap(txtJson);
            console.log(srtMap);
            let srtList = getSrtList(txtJson.tracks, srtMap);
            console.log(srtStr);

            srtList.forEach((e => {
                let n = "\n";
                srtStr += parseInt(e.index) + 1 + n + e.start + " --\x3e " + e.end + n + e.content + n + n
            }))
        } catch (error) {
            alert("未选择文件或解析错误")
        }
        return srtStr;
    }



    function getSrtMap(txtJson) {
        let srtMap = {};
        let materials = txtJson.materials;
        let texts = materials.texts;
        for (let e in texts) {
            let t = texts[e].content.replace(/<[^>]+>/g, "");
            t = t.replace(/^\[|\]$/g, "");
            srtMap[texts[e].id] = {
                content: t,
                index: e,
            };
        }
        return srtMap;
    }

    function getSrtList(tracks, srtMap) {
        let srtList = [];
        let segments = [];
        if (tracks && tracks.length) {
            tracks.forEach((e) => {
                if ("text" == e.type || "sticker" == e.type) {
                    segments = segments.concat(e.segments);
                }
            });
        }
        segments.forEach((e) => {
            let t = srtMap[e.material_id];
            if (t) {
                t.start = dateFormart(e.target_timerange.start);
                t.end = dateFormart(
                    e.target_timerange.start + e.target_timerange.duration
                );
            }
            srtList.push(t);
        });
        return srtList;
    }

    function dateFormart(e) {
        let t = (e = Math.floor(e / 1e3)) % 1e3,
            n = (e = Math.floor(e / 1e3)) % 60,
            l = (e = Math.floor(e / 60)) % 60,
            o = srtPad((e = Math.floor(e / 60)), 2);
        l = srtPad(l, 2);
        n = srtPad(n, 2);
        t = srtPad(t, 3);
        return o + ":" + l + ":" + n + "," + t;
    }
    function srtPad(e, t) {
        return e.toString().padStart(t, "0");
    }

})();