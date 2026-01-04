// ==UserScript==
// @name         Bilibilii增强
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  增强哔哩哔哩的使用体验，笔记滚动条，未登录时去除登录弹窗，合集可拖拽
// @author       xygod
// @match        *://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-menu
// @downloadURL https://update.greasyfork.org/scripts/515963/Bilibilii%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/515963/Bilibilii%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * @param {string} selector
     * @return {HTMLElement}
     * */
    function findDom(selector) {
        const startTime = new Date().getTime()
        return new Promise((resolve, reject) => {
            const id = setInterval(() => {
                const dom = document.querySelector(selector)
                if (dom) {
                    clearInterval(id)
                    resolve(dom)
                } else if (new Date().getTime() - startTime > 1000 * 30) {
                    clearInterval(id)
                    reject(`无法找到此dom元素: ${selector}`)
                }
            }, 200)
            }).catch(err=>console.trace(err))
    }

    /**
     * @param {string} selector
     * @return {HTMLElement[]}
     * */
    function findALLDom(selector) {
        const startTime = new Date().getTime()
        return new Promise((resolve, reject) => {
            const id = setInterval(() => {
                const doms = [...new Set(document.querySelectorAll(selector))]
                if (doms.length > 0) {
                    clearInterval(id)
                    resolve(doms)
                } else if (new Date().getTime() - startTime > 1000 * 30) {
                    clearInterval(id)
                    reject(`无法找到此dom元素: ${selector}`)
                }
            }, 200)
            }).catch(err=>console.trace(err))
    }

    function randomNum(start, end) {
        return Math.floor(Math.random() * (end - start + 1)) + start
    }


    function isNumber(v) {
        return typeof v === 'number' && isFinite(v);
    }

    showNoteScroll() //显示笔记的滚动条。
    openZimuMu() // 自动打开字幕。
    handleUnlogin() // 处理未登录状态下自动暂停视频弹出登录框的情况。
    handleSelectHeji() // 合集视频可以拖拽到新标签页
    // handleAddDanmu().then() // 自动添加在弹幕量少的视频里添加机器人弹幕好显的不那么冷清，现在有bug，暂不考虑完善，因为感觉也没必要有这个功能，不过既然写了那就保留这个代码吧。
    handleMinVideo() // 小窗的X按钮添加粉色背景，避免因白色视频帧导致的按钮不可见
    function showNoteScroll() {
        GM_addStyle(`
            .note-detail::-webkit-scrollbar {
                width: 18px !important;
            }
            .note-detail::-webkit-scrollbar-thumb {
                background: #d0cfcf !important;
            }
            .note-detail::-webkit-scrollbar-track {
                background: #5e5b5b !important;
            }
            .note-editor .editor-innter.ql-container .ql-editor::-webkit-scrollbar {
                width: 12px !important;
            }
            .resizable-component .ql-editor::-webkit-scrollbar-thumb {
                border-radius: 5px;
                background: #a9a9eb !important;
            }
            .note-list::-webkit-scrollbar {
                width: 12px !important;
            }
            .note-list::-webkit-scrollbar-thumb {
                background: #d8d0d0 !important;
            }
            .note-list::-webkit-scrollbar-track {
                background: #3d3c3cf2 !important;
            }
    `)
    }

    function openZimuMu() {
        const id = setInterval(() => {
            const zimuBtn = document.querySelector(".bpx-player-subtitle-panel-major-group")
            if (!zimuBtn) return
            const isOpenZiMu = zimuBtn.childNodes.length > 0
            if (isOpenZiMu) return
            document.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-subtitle .bpx-common-svg-icon").click()
            clearInterval(id)
        }, 1000)
        }

    function handleUnlogin() {
        let mask = null
        let id = 0
        let showed = false
        run()

        function run() {
            if (showed) return
            mask = document.querySelector(".bili-mini-mask")
            if (mask) {
                const globalVideo = document.querySelector("video")
                mask.style.display = "none"
                mask.style.opacity = "0"
                globalVideo.play()
                document.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-web").click()
                cancelAnimationFrame(id)
                mask.remove()
                showed = true
            }
            id = requestAnimationFrame(run)
        }
    }

    async function handleSelectHeji(){
        let doms = null
        let state = new URLSearchParams(location.href).keys().some(r=>r === "p") ? "xuanji" : "heji"
        if(state === "heji"){
            doms = await findALLDom(".pod-item.video-pod__item.simple")
        }else if (state === "xuanji"){
            doms = await findALLDom(".simple-base-item.video-pod__item.normal")
        }
        const items = [...new Set(doms)]
        items.forEach((r,i)=>{
            const a = document.createElement("a");
            a.addEventListener("click",function(e){
                e.preventDefault()
            })
            if(state === "heji"){
                a.href = `https://www.bilibili.com/video/${r.dataset.key}`
            }else if (state === "xuanji"){
                let params = []
                for(const param of new URLSearchParams(location.href)){
                    if(param[0]==="p"){
                        param[1] = i+1
                    }
                    params.push(param)
                }
                a.href = params.map(param=> param.join("=")).join("&")
            }
            a.innerHTML = r.innerHTML;
            a.className = r.className;
            r.parentNode.replaceChild(a, r);
        })
    }

   async function handleMinVideo(){
    GM_addStyle(`
    #bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-mini-warp > div.bpx-player-mini-close{
    background-color: #ffc6c6
    }
    `)
   }


    async function handleAddDanmu() {
        let canAdd = true
        ;(await findDom("video")).addEventListener("change", async function () {
            console.log("change")
            canAdd = await canAddDanmu()
        })
        const needAdd = await canAddDanmu()
        if (!needAdd) {
            console.log("弹幕已经够多了，不需要添加弹幕了")
            return
        }
        // 如果大于10秒一个弹幕，说明太冷清了，要填充弹幕
        console.log("开始填充弹幕。。。")
        await autoAddDanmu()

        async function canAddDanmu() {
            const second = await calculateSecond()
            const danmuCount = await calculateDanmuCount()
            const weight = second / danmuCount // 几秒一个弹幕
            const isStudy = await isStudyingVideo()
            return weight > 5 && !isStudy // 如果小于5秒一个弹幕或者是学习视频，那就不要添加假弹幕了
        }

        async function autoAddDanmu() {
            /**
             * @type {HTMLVideoElement}
             * **/
            const mainVideo = await findDom("video")
            mainVideo.addEventListener("change", async function () {
                console.log("change")
                canAdd = await canAddDanmu()
            })
            const danmuWrap = await findDom(".bpx-player-row-dm-wrap")
            let t = ""
            setInterval(() => {
                if (!canAdd || mainVideo.paused) {
                    console.log("不可以填充弹幕")
                    return
                }
                console.log("可以填充弹幕")
                const text = getDanmuText()
                t = text
                console.log(t.length * 0.3)
                const danmuDom = createDanmaku(text)
                danmuWrap.appendChild(danmuDom)
            }, (6 + t.length * 0.4) * 1000)

            function createDanmaku(text, option = {
                type: "roll", opacity: 1, fontSize: 25, color: "#ffffff",
            }) {
                // 创建主要的div元素
                const div = document.createElement('div');
                div.setAttribute('aria-live', 'polite');
                div.setAttribute('role', 'comment');
                div.className = `bili-danmaku-x-dm bili-danmaku-x-${option.type} bili-danmaku-x-high-top bili-danmaku-x-show`;
                div.style.cssText = `--opacity: ${option.opacity}; --fontSize: ${option.fontSize}px; --fontFamily: SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif; --fontWeight: normal; --color: ${option.color}; --textShadow: 1px 0 1px #000000,0 1px 1px #000000,0 -1px 1px #000000,-1px 0 1px #000000; --top: 4px;`;
                // 基本偏移量，屏幕宽度相关
                const baseOffset = 830; // 基础偏移量，可以根据实际屏幕宽度调整
                // 根据内容长度计算translateX和duration
                const textLength = text.length
                const maxDuration = 12; // 最大持续时间（秒）
                const translateX = -1 * (textLength * 25 + baseOffset);
                const duration = Math.min(maxDuration, 2 + textLength * 0.4);
                // 设置弹幕的 CSS 属性
                div.style.setProperty('--offset', `${baseOffset}px`);
                div.style.setProperty('--translateX', `${translateX}px`);
                div.style.setProperty('--duration', `${duration}s`);

                // 创建图标span
                const iconSpan = document.createElement('span');
                iconSpan.className = 'bili-danmaku-x-high-icon';
                iconSpan.style.cssText = 'width:25px;height:25px;';

                // 创建+1 em元素
                const plusEm = document.createElement('em');
                plusEm.className = 'bili-danmaku-x-high-plus';
                plusEm.style.fontSize = '12.5px';
                plusEm.textContent = '+1';

                // 创建动画span
                const animateSpan = document.createElement('span');
                animateSpan.className = 'bili-danmaku-x-high-icon-animate';

                // 创建文本span
                const textSpan = document.createElement('span');
                textSpan.className = 'bili-danmaku-x-high-text';
                textSpan.textContent = text;

                // 组装DOM结构
                const showIcon = Math.random() > 0.7
                showIcon ? iconSpan.appendChild(plusEm) : void 0;
                showIcon ? iconSpan.appendChild(animateSpan) : void 0;
                showIcon ? div.appendChild(iconSpan) : void 0;
                div.appendChild(textSpan);
                const id = setInterval(() => {
                    if (mainVideo.paused) return
                    const style = window.getComputedStyle(div);
                    const transform = style.transform;
                    // 提取 matrix 的 translateX 值
                    const matrixValues = transform.match(/matrix\(([^)]+)\)/);
                    console.log(matrixValues)
                    if (matrixValues) {
                        const matrix = matrixValues[1].split(', ');
                        console.log(div)
                        console.log("parseFloat(matrix[4])", parseFloat(matrix[4]))
                        console.log("translateX", translateX)
                        if (parseFloat(matrix[4]) <= translateX) {
                            clearInterval(id)
                            console.log("删除")
                            div.remove()
                        }
                    }

                }, duration * 1000)

                return div;
            }

            const words = ["人生不止眼前的苟且，还有诗和远方", "不要等待机会，而要创造机会", "成功不是将来才有的，而是从决定去做的那一刻起，持续累积而成", "当你感到痛苦时，就是你成长的时候", "没有人可以回到过去重新开始，但谁都可以从现在开始，书写一个全然不同的结局", "生命中最困难的时刻，不是没有人懂你，而是你不懂你自己", "不要轻易放弃，学会等待，因为你坚持多一秒，就可能会发生奇迹", "成功的秘诀是坚持目标不动摇", "没有退路的时候，正是潜力发挥最大的时候", "相信自己，你比想象中更强大", "每一个不曾起舞的日子，都是对生命的辜负", "当你的才华还撑不起你的野心时，你就应该静下心来学习", "不要让未来的你，讨厌现在的自己", "成功不是终点，失败也不是终结，最重要的是继续前进的勇气", "人生就像一杯茶，不会苦一辈子，但总会苦一阵子", "没有人陪你走一辈子，所以你要学会独立", "不要等待，时机永远不会恰到好处。行动吧，从现在开始", "生活不是等待暴风雨过去，而是学会在雨中跳舞", "成功的道路上并不拥挤，因为坚持的人不多", "当你觉得自己又丑又穷，一无是处时，别绝望，因为至少你的判断还是对的", "你要做自己的太阳，不断地温暖自己", "不要因为走得太远，忘了当初为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己", "每一个成功者都有一个开始。勇于开始，才能找到成功的路", "不要被昨天的失败打倒，要吸取教训，面向明天", "当你感到疲惫的时候，就是你即将突破的时候", "成功不是偶然的，而是日复一日累积的结果", "不要害怕失败，因为那只是成功之路上的一个踏脚石", "生命不在于活得长，而在于活得精彩", "不要总是羡慕别人的生活，努力活出自己的精彩", "成功的秘诀是坚持一个主要目标不动摇", "不要被现实束缚住想象力", "人生就是一场修行，修的是心智，历的是岁月", "不要等待机会，而要创造机会", "成功的道路上并不拥挤，因为坚持的人不多", "不要因为走得太远，而忘记了为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己", "每一个成功者都有一个开始。勇于开始，才能找到成功的路", "不要被昨天的失败打倒，要吸取教训，面向明天", "当你感到疲惫的时候，就是你即将突破的时候", "成功不是偶然的，而是日复一日累积的结果", "不要害怕失败，因为那只是成功之路上的一个踏脚石", "生命不在于活得长，而在于活得精彩", "不要总是羡慕别人的生活，努力活出自己的精彩", "成功的秘诀是坚持一个主要目标不动摇", "不要被现实束缚住想象力", "人生就是一场修行，修的是心智，历的是岁月", "不要等待机会，而要创造机会", "成功的道路上并不拥挤，因为坚持的人不多", "不要因为走得太远，而忘记了为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己", "每一个成功者都有一个开始。勇于开始，才能找到成功的路", "不要被昨天的失败打倒，要吸取教训，面向明天", "当你感到疲惫的时候，就是你即将突破的时候", "成功不是偶然的，而是日复一日累积的结果", "不要害怕失败，因为那只是成功之路上的一个踏脚石", "生命不在于活得长，而在于活得精彩", "不要总是羡慕别人的生活，努力活出自己的精彩", "成功的秘诀是坚持一个主要目标不动摇", "不要被现实束缚住想象力", "人生就是一场修行，修的是心智，历的是岁月", "不要等待机会，而要创造机会", "成功的道路上并不拥挤，因为坚持的人不多", "不要因为走得太远，而忘记了为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己", "每一个成功者都有一个开始。勇于开始，才能找到成功的路", "不要被昨天的失败打倒，要吸取教训，面向明天", "当你感到疲惫的时候，就是你即将突破的时候", "成功不是偶然的，而是日复一日累积的结果", "不要害怕失败，因为那只是成功之路上的一个踏脚石", "生命不在于活得长，而在于活得精彩", "不要总是羡慕别人的生活，努力活出自己的精彩", "成功的秘诀是坚持一个主要目标不动摇", "不要被现实束缚住想象力", "人生就是一场修行，修的是心智，历的是岁月", "不要等待机会，而要创造机会", "成功的道路上并不拥挤，因为坚持的人不多", "不要因为走得太远，而忘记了为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己", "每一个成功者都有一个开始。勇于开始，才能找到成功的路", "不要被昨天的失败打倒，要吸取教训，面向明天", "当你感到疲惫的时候，就是你即将突破的时候", "成功不是偶然的，而是日复一日累积的结果", "不要害怕失败，因为那只是成功之路上的一个踏脚石", "生命不在于活得长，而在于活得精彩", "不要总是羡慕别人的生活，努力活出自己的精彩", "成功的秘诀是坚持一个主要目标不动摇", "不要被现实束缚住想象力", "人生就是一场修行，修的是心智，历的是岁月", "不要等待机会，而要创造机会", "成功的道路上并不拥挤，因为坚持的人不多", "不要因为走得太远，而忘记了为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己", "每一个成功者都有一个开始。勇于开始，才能找到成功的路", "不要被昨天的失败打倒，要吸取教训，面向明天", "当你感到疲惫的时候，就是你即将突破的时候", "成功不是偶然的，而是日复一日累积的结果", "不要害怕失败，因为那只是成功之路上的一个踏脚石", "生命不在于活得长，而在于活得精彩", "不要总是羡慕别人的生活，努力活出自己的精彩", "成功的秘诀是坚持一个主要目标不动摇", "不要被现实束缚住想象力", "人生就是一场修行，修的是心智，历的是岁月", "不要等待机会，而要创造机会", "成功的道路上并不拥挤，因为坚持的人不多", "不要因为走得太远，而忘记了为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己", "每一个成功者都有一个开始。勇于开始，才能找到成功的路", "不要被昨天的失败打倒，要吸取教训，面向明天", "当你感到疲惫的时候，就是你即将突破的时候", "成功不是偶然的，而是日复一日累积的结果", "不要害怕失败，因为那只是成功之路上的一个踏脚石", "生命不在于活得长，而在于活得精彩", "不要总是羡慕别人的生活，努力活出自己的精彩", "成功的秘诀是坚持一个主要目标不动摇", "不要被现实束缚住想象力", "人生就是一场修行，修的是心智，历的是岁月", "不要等待机会，而要创造机会", "成功的道路上并不拥挤，因为坚持的人不多", "不要因为走得太远，而忘记了为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己", "每一个成功者都有一个开始。勇于开始，才能找到成功的路", "不要被昨天的失败打倒，要吸取教训，面向明天", "当你感到疲惫的时候，就是你即将突破的时候", "成功不是偶然的，而是日复一日累积的结果", "不要害怕失败，因为那只是成功之路上的一个踏脚石", "生命不在于活得长，而在于活得精彩", "不要总是羡慕别人的生活，努力活出自己的精彩", "成功的秘诀是坚持一个主要目标不动摇", "不要被现实束缚住想象力", "人生就是一场修行，修的是心智，历的是岁月", "不要等待机会，而要创造机会", "成功的道路上并不拥挤，因为坚持的人不多", "不要因为走得太远，而忘记了为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己", "每一个成功者都有一个开始。勇于开始，才能找到成功的路", "不要被昨天的失败打倒，要吸取教训，面向明天", "当你感到疲惫的时候，就是你即将突破的时候", "成功不是偶然的，而是日复一日累积的结果", "不要害怕失败，因为那只是成功之路上的一个踏脚石", "生命不在于活得长，而在于活得精彩", "不要总是羡慕别人的生活，努力活出自己的精彩", "成功的秘诀是坚持一个主要目标不动摇", "不要被现实束缚住想象力", "人生就是一场修行，修的是心智，历的是岁月", "不要等待机会，而要创造机会", "成功的道路上并不拥挤，因为坚持的人不多", "不要因为走得太远，而忘记了为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己", "每一个成功者都有一个开始。勇于开始，才能找到成功的路", "不要被昨天的失败打倒，要吸取教训，面向明天", "当你感到疲惫的时候，就是你即将突破的时候", "成功不是偶然的，而是日复一日累积的结果", "不要害怕失败，因为那只是成功之路上的一个踏脚石", "生命不在于活得长，而在于活得精彩", "不要总是羡慕别人的生活，努力活出自己的精彩", "成功的秘诀是坚持一个主要目标不动摇", "不要被现实束缚住想象力", "人生就是一场修行，修的是心智，历的是岁月", "不要等待机会，而要创造机会", "成功的道路上并不拥挤，因为坚持的人不多", "不要因为走得太远，而忘记了为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己", "每一个成功者都有一个开始。勇于开始，才能找到成功的路", "不要被昨天的失败打倒，要吸取教训，面向明天", "当你感到疲惫的时候，就是你即将突破的时候", "成功不是偶然的，而是日复一日累积的结果", "不要害怕失败，因为那只是成功之路上的一个踏脚石", "生命不在于活得长，而在于活得精彩", "不要总是羡慕别人的生活，努力活出自己的精彩", "成功的秘诀是坚持一个主要目标不动摇", "不要被现实束缚住想象力", "人生就是一场修行，修的是心智，历的是岁月", "不要等待机会，而要创造机会", "成功的道路上并不拥挤，因为坚持的人不多", "不要因为走得太远，而忘记了为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己", "每一个成功者都有一个开始。勇于开始，才能找到成功的路", "不要被昨天的失败打倒，要吸取教训，面向明天", "当你感到疲惫的时候，就是你即将突破的时候", "成功不是偶然的，而是日复一日累积的结果", "不要害怕失败，因为那只是成功之路上的一个踏脚石", "生命不在于活得长，而在于活得精彩", "不要总是羡慕别人的生活，努力活出自己的精彩", "成功的秘诀是坚持一个主要目标不动摇", "不要被现实束缚住想象力", "人生就是一场修行，修的是心智，历的是岁月", "不要等待机会，而要创造机会", "成功的道路上并不拥挤，因为坚持的人不多", "不要因为走得太远，而忘记了为什么出发", "生活中没有白走的路，每一步都算数", "你的选择是做或不做，但不做就永远不会有机会", "不要总是等待别人来安慰你，要学会自己治愈自己", "人生就像骑自行车。想保持平衡就得往前走", "没有人能够回到过去重新开始，但谁都可以从现在开始，书写一个全新的结局", "不要为已消逝之年华叹息，须正视欲匆匆溜走的时光", "当你改变不了环境时，就改变自己", "不要等待完美时机，因为它永远不会来临", "成功的关键在于相信自己有成功的能力", "不要因为别人的否定而放弃自己的梦想", "人生最大的挑战是超越自己"]

            function getDanmuText() {
                return words[randomNum(0, words.length - 1)]
            }
        }

        async function calculateSecond() {
            const timeStr = (await findDom(".bpx-player-ctrl-time-duration")).textContent
            return timeStr.split(":").reduce((acc, currentValue, currentIndex, array) => acc + Math.pow(60, (array.length - 1 - currentIndex)) * +currentValue, 0)
        }

        async function calculateDanmuCount() {
            const name2Count = {"万": 10000, "百万": 1000000, "亿": 100000000}
            const danmuStr = (await findDom(".dm-text")).textContent
            const danmuCount = isNumber(+danmuStr) ? +danmuStr : +danmuStr.slice(0, -1) * name2Count[danmuStr.slice(-1)]
            return danmuCount
        }

        async function isStudyingVideo() {
            const studyTags = [// Academic subjects
                "学习", "教育", "考试", "高考", "中考", "考研", "四六级", "数学", "语文", "英语", "物理", "化学", "生物", "历史", "地理", "政治", "高数", "线代", "概率论", "统计学",

                // Professional skills
                "编程", "计算机", "IT", "软件开发", "前端", "后端", "人工智能", "设计", "建筑", "医学", "金融", "经济", "会计", "法律",

                // Knowledge sharing
                "知识分享", "经验分享", "干货", "教程", "讲座", "公开课", "学习方法", "考试技巧", "职业规划", "求职", "考证",

                // Skills development
                "技能培训", "职业技能", "自我提升", "能力培养", "实用技巧", "专业课", "考试辅导", "学习笔记",

                // Academic levels
                "大学课程", "研究生", "博士", "硕士", "本科", "高中", "初中", "小学", "幼教"];
            const tags = await findALLDom(".tag-link")
            return tags.some(r => studyTags.includes(r.textContent))
        }
    }

})();