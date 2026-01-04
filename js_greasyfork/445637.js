        // ==UserScript==
        // @name         good mood--何
        // @namespace    http://tampermonkey.net/
        // @author       华东交大-何江涛
        // @version      0.9
        // @description  功能：访问页面会弹出对自己的溢美之言。浏览器一直夸你。 可根据自己修改【姓名和性别】。
        // @include      *
        // @match        http://127.0.0.1:5500/%E6%96%B0%E5%BB%BA%E6%96%87%E6%9C%AC%E6%96%87%E6%A1%A3.html
        // @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
        // @grant        none
        // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445637/good%20mood--%E4%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/445637/good%20mood--%E4%BD%95.meta.js
        // ==/UserScript==

        ; (function () {

            //姓名，性别                      必改。
            let name = '何江涛 '
            let sex = '男'

            //弹框停留时间，单位秒            可改，时间单位：秒。
            let time = 1.6
            //弹窗大小                        可改，1.0表示1倍，2.0表示2倍大小。
            let size = 1.0

            // 弹框个数                       可改
            let num = 1

            //弹框出现的范围                  可改，范围：0-100。
            let left = 80
            let top = 40





            //字体
            let fontFamily = ['STXingkai','STXingkai', 'STXingkai', 'STXingkai', 'STXingkai', 'STHeiti', 'STKaiti', 'STSong','STFangsong',
                              'SimHei', 'SimSun', 'NSimSun', 'FangSong', 'KaiTi', 'STXinwei', 'STHupo', 'STCaiyun', 'FZYaoti', 'FZShuTi', 'YouYuan']

            let colors = [
                // ×(金)
                ['#f9d681', 'black'],
                // 金，红
                ['#f9d681', 'black'], ['#dc2c1f', '#ffffff'],


                // 暗白不明显，故注释 。
                //['#f7f7f7', '#black'],
            ]
            let colorsGril = [
                // 粉红 ， 红
                ['#fee6f3', '#e5717a'],['#dc2c1f', '#ffffff'],

                // ×(粉红)
                ['#fee6f3', '#e5717a'],

            ].concat(colors)
            let colorsBoy = [


                // ×(红)
                ['#dc2c1f', '#ffffff'],

            ].concat(colors)

            //所有
            let sentences = [
                'aaa要开心哦', 'aaa要开心哦',
                '你好鸭！', '我喜欢你！','认识aaa真好。',
            ]

            //女
            let sentencesGirl = [
                'aaa好美！！！', 'aaa好漂亮！！！！', '让我多看两眼aaa，太好看了吧',
                '小姐姐来了？', 'aaa有亿点点好看。',
                '为什么aaa这么好看？', 'aaa好美啊！！！', '小姐姐小姐姐！！',
                'aaa长得真漂亮！！！',
            ].concat(sentences)
            let sensitiveGirl = [
                'aaa,你怎么这么温柔呀？', 'aaa小姐姐！', 'aaa你好鸭！',
                'aaa，我喜欢你！',
            ]

            //男
            let sentencesBoy = [
                'aaa好帅！！！', 'aaa真帅！！！！', 'aaa有点小帅。',
                'aaa有点小厉害。', '帅哥来了？', '为什么你这么厉害？',
            ].concat(sentences)
            let sensitiveBoy = [
                'aaa哥哥！','aaa你好鸭！', 'aaa,为什么这么厉害？',
                'aaa，我喜欢你！',
            ]
            function random(max, min = 0) {
                return Math.round(Math.random() * (max - min) + min)
            }

            function randomArray(array, min = 0) {
                let randomArray = random(array.length - 1, min)
                return array[randomArray]
            }

            if (name === '何江涛 ') {
                name = '你'
            } else {
                sentencesGirl = sentencesGirl.concat(sensitiveGirl)
                sentencesBoy = sentencesBoy.concat(sensitiveBoy)
            }

            for (let i = 0; i < num; i++) {
                // 句子
                let sentence;
                // 颜色
                let color;
                if (sex === "女") {
                    sentence = randomArray(sentencesGirl).replace(/aaa/g, `${name}`);
                    color = randomArray(colorsGril)
                } else {
                    sentence = randomArray(sentencesBoy).replace(/aaa/g, `${name}`);
                    color = randomArray(colorsBoy)
                }
                let sentenceNum = sentence.length


                // 句子背景宽度
                let sentenceWidth = 0;
                if (sentenceNum < 10) {
                    sentenceWidth = sentenceNum * 30
                } else if (sentenceNum < 20) {
                    sentenceWidth = sentenceNum * 22
                } else {
                    sentenceWidth = sentenceNum * (21 - Math.log10(sentenceNum) * 0.5)
                }
                let windowWidth = document.documentElement.clientWidth * left / 100 || document.body.clientWidth * left / 100;


                let appear = Math.random() * 1000
                new Promise((a, b) => {
                    // 弹框出现的时间
                    setTimeout(() => { a(11) }, num === 1 ? 100 : appear)
                }).then(() => {
                    let l = document.createElement('p')
                    l.style.display
                    l.innerHTML = `<div style="
        position: absolute;
        height:${38*size}px;
        text-align: center;
        line-height: ${38*size}px;
        font-size: 17px;
        z-index: 999;

        background-color:${color[0]};
        color:${color[1]};

        font-family:${randomArray(fontFamily)};
        left: ${random(windowWidth - sentenceWidth)}px;top:${random(top - 2)}%;
        width:${sentenceWidth*size}px;
        border-radius:18px;

        ">${sentence}</div>`
                    document.body.insertBefore(l, null)
                    setTimeout(() => { l.style.display = 'none' }, num === 1 ? time * 1000 : time * 1000 + 500 - appear)

                    // 变量
                    // background-color: ${color[0]};
                    // color:${color[1]};

                    // font-family: 'STXingkai';
                    // ${randomArray(fontFamily)}

                    // width: 250px;
                    // ${sentenceWidth}

                    // left: 20%;
                    // ${random(windowWidth-sentenceWidth)}
                    // top: 20%;
                    // ${random(100)}

                    // border-radius: 2px;
                    // ${random(28,2)}

                })
            }

        })()