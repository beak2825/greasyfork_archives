// ==UserScript==
// @name         羊了个羊_By_chunqiu
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  没有对分数进行修改，仅调整了难度
// @author       春秋，wechat：chunqiu031
// @match        https://play.ordz.games/inscription/478153addc6b0d79c1c10c2dcc8c93255cfa8c2e1a3dc3c84f07f0a61cd2648di0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469218/%E7%BE%8A%E4%BA%86%E4%B8%AA%E7%BE%8A_By_chunqiu.user.js
// @updateURL https://update.greasyfork.org/scripts/469218/%E7%BE%8A%E4%BA%86%E4%B8%AA%E7%BE%8A_By_chunqiu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var iframe = document.getElementById('gameFrame');
        console.log("尝试注入", iframe);
        if (iframe) {
            try {
                var iframeWindow = iframe.contentWindow;
                var iframeDocument = iframe.contentDocument || iframeWindow.document;

                var script = iframeDocument.createElement('script');
                script.textContent = `
                window.ggameScript = (function() {
                    'use strict';
                    // 配置项
                    const config = {
                        // 与卡片宽度一致
                        base: 40,
                        // 卡槽中最长卡片长度
                        selectMaxLength: 7,
                        // 卡槽设定多少个相同卡片就消掉
                        maxCount: 3,
                        // 动画时间 毫秒
                        animationTime: 250,
                        // 最大关数
                        maxLevel: 10,
                        // 行
                        row: 7,
                        // 列
                        col: 7
                    };
                
                    const data = {
                        level: 1,
                        cards: [],
                        select: new Map(),
                        containerInfo: null,
                        cardSlotInfo: null,
                        gameState: '',
                    };
                
                    let isShowEmail = false;
                
                    const gameData = {
                        score: 0,
                        playTime: 0,
                        eValue: '',
                        ac: '',
                        cCount: 0,
                        singleScore: 10,
                        //单次增加分数
                        dataUrl: ''
                    };
                    const gameUtils = {
                        updateScore() {
                            var valueDiv = document.getElementById("score");
                            let stringScore = String(gameData.score);
                            let scoreValue = '';
                            for (let i = 0; i < 5 - stringScore.length; i++) {
                                scoreValue += '0';
                            }
                            ;valueDiv.innerHTML = \`\${scoreValue}\${gameData.score}\`;
                        },
                        playTimeTimer: null,
                        startPlayTime() {
                            clearInterval(this.playTimeTimer);
                            this.playTimeTimer = setInterval(()=>{
                                gameData.playTime += 1;
                                this.formatTime(gameData.playTime);
                            }
                            , 1000);
                        },
                        formatTime(timestamp) {
                            let timeDom = document.querySelector('.header #time');
                            let minute = Math.floor(timestamp / 60);
                            let second = timestamp % 60;
                            timeDom.innerHTML = \`\${minute >= 10 ? minute : '0' + minute}:\${second >= 10 ? second : '0' + second}\`;
                        },
                        // 创建截图
                        _createScreenshot() {
                            var node = document.querySelector('#app .actual-region .header-content');
                            let _this = this;
                            domtoimage.toPng(node, {
                                quality: 1.0,
                                magnification: 0.5,
                                bgcolor: '#000'
                            }).then(function(dataUrl) {
                                // console.log('dataUrl=>>>', dataUrl);
                                if (dataUrl.indexOf('base64,')) {
                                    dataUrl = dataUrl.split('base64,')[1];
                                }
                                gameData.dataUrl = dataUrl || ''
                                // _this.setPassword(dataUrl || '');
                            })
                        },
                        setPassword(_p) {
                            let ac = window.btoa(\`\${gameData.eValue}-b-\${gameData.score}-b-\${gameData.cCount}-b-\${gameData.playTime}-b-\${gameData.uid}-b-\${this.getLocalTime(0)}-b-\${_p}-b-ordz-match-3322\`);
                            let b = (Math.random() + 1).toString(36).substring(2, 8);
                            let c = (Math.random() + 1).toString(36).substring(2, 6);
                            gameData.ac = ac = \`\${ac.slice(0, 8)}\${b}\${ac.slice(8, 13)}\${c}\${ac.slice(13)}\`;
                            // console.log('token=>>>',
                            //     \`\${gameData.eValue}-b-\${gameData.score}-b-\${gameData.cCount}-b-\${gameData.playTime}-b-\${this.getLocalTime(0)}-b-\${_p}-b-ordz-match-3322\`
                            // );
                            const winTokenDom = document.querySelector('.win-content .token-input');
                            winTokenDom.innerText = ac;
                            const replayTokenDom = document.querySelector('.replay-content .token-input');
                            replayTokenDom.innerText = ac;
                
                            try {
                                // 发送token
                                window.parent.postMessage({
                                    target: 'game-token',
                                    data: {
                                        value: ac
                                    }
                                }, '*');
                            } catch (error) {}
                            try {
                                // 发送邮箱
                                window.parent.postMessage({
                                    target: 'game-email',
                                    data: {
                                        value: gameData.eValue
                                    }
                                }, '*');
                            } catch (error) {}
                        },
                        // get utc0 timestamp
                        getUtcTime(len, i) {
                            var D = new Date();
                            if (len) {
                                D = new Date(len);
                            }
                            len = D.getTime();
                            var offset = D.getTimezoneOffset() * 60000;
                            var utcTime = len + offset;
                            let time = new Date(utcTime + 3600000 * i);
                            return time;
                        },
                        getLocalTime(i) {
                            let time = this.getUtcTime('', i);
                            let m = time.getMonth() + 1;
                            let d = time.getDate();
                            let str = \`\${time.getFullYear()}-\${m > 10 ? m : '0' + m}-\${d + 1 > 10 ? d : '0' + d}\`;
                            return str;
                        },
                        createUuid() {
                            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                let r = (Math.random() * 16) | 0
                                  , v = c == 'x' ? r : (r & 0x3) | 0x8;
                                return v.toString(16)
                            })
                        },
                        startUpdateState() {
                            // this.sendUpdateState();
                
                            clearInterval(window.stateTimer);
                            window.stateTimer = setInterval(()=>{
                                this.sendUpdateState();
                            }
                            , 1 * 1000);
                        },
                        sendUpdateState() {
                            let data = {
                                token: gameData.uid // uid: gameData.uid,
                                // score: gameData.score,
                                // foodCount: gameData.foodCount,
                                // playTime: gameData.playTime,
                            };
                            _ajax({
                                // url: 'https://aaa.com/aaa',
                                url: 'https://logs.ordz.games/1.json',
                                method: 'GET',
                                data: data,
                                customHeaders: {
                                    'Accept': 'application/json, text/plain, */*',
                                    'Content-Type': 'application/json'
                                }
                            }).then(res=>{}
                            )
                        },
                        copyF(value) {
                            const copyInput = document.querySelector('#copyI');
                            copyInput.value = value;
                            try {
                                navigator.clipboard.writeText(value);
                                let dom = document.querySelector('.message-tips');
                                dom.classList.add('show');
                                setTimeout(()=>{
                                    dom.classList.remove('show');
                                }
                                , 1 * 1000);
                            } catch (error) {
                                // console.error('error=>>', error)
                                copyInput.select();
                                try {
                                    document.execCommand('copy', true);
                                    let dom = document.querySelector('.message-tips');
                                    dom.classList.add('show');
                                    setTimeout(()=>{
                                        dom.classList.remove('show');
                                    }
                                    , 1 * 1000);
                                } catch (error) {}
                            }
                        }
                
                    };
                
                    gameData.uid = gameUtils.createUuid();
                
                    /**
                 * 卡片默认偏移值 随意设定
                 */
                    // const defaultOffsetValue = [0, 0, 10, -10, 20, -20];
                    const defaultOffsetValue = [0, 0, 20, -20];
                    const defaultOffsetValueLength = defaultOffsetValue.length;
                
                    /**
                 * 卡片默认生成3的倍数 不是3的倍数的则不可能通关
                 */
                    const defaultRounds = [3, 6, 9, 3, 6, 6, 6, 6, 6];
                
                    /**
                 * 容器样式
                 */
                    const setContainerStyle = ()=>{
                        const {base, row, col} = config;
                        return \`height: \${base * row}px; width: \${base * col}px\`;
                    }
                    ;
                
                    /**
                 * 设置卡片位置
                 */
                    const setCardStyle = ({x, y, display, clear})=>{
                        return \`transform: translateX(\${x}px) translateY(\${y}px); \${display ? 'visibility: hidden;' : ''}\`;
                    }
                    ;
                
                    /**
                 * 设置卡片动画
                 */
                    const setAnimation = ({id, clear, display})=>{
                        let isClear = '';
                        if (clear) {
                            isClear = \`animation: scaleDraw \${config.animationTime}ms;\`;
                        }
                        if (display) {
                            isClear += 'visibility: hidden;';
                        }
                        return isClear;
                    }
                    ;
                
                    /**
                 * 随机生成指定长度id
                 */
                    const randomCreateId = (length)=>{
                        return (Math.random() + new Date().getTime()).toString(32).slice(0, length);
                    }
                    ;
                
                    // 循环添加底部的dom
                    const addDomFn = ()=>{
                        for (let i = 0; i < 7; i++) {
                            let dom = document.createElement("div");
                            document.querySelector('.card-slot').appendChild(dom);
                        }
                    }
                    ;
                
                    setTimeout(()=>{
                        getDomInfo();
                        addDomFn();
                    },1000)
                
                    window.onload = ()=>{
                        getDomInfo();
                        addDomFn();
                
                        // try{
                        //   let windowHeight = document.documentElement.clientHeight;
                        //   if(windowHeight < 576){
                        //     let gameContent = document.querySelector('.match-container');
                        //     gameContent.style.transform = "scale(" + windowHeight / gameContent.clientHeight + ")";
                        //   }
                        // }catch(error){
                        //   console.error(error)
                        // }
                    }
                    ;
                
                    const getDomInfo = ()=>{
                        const containerDom = document.querySelector('.container');
                        data.containerInfo = containerDom.getBoundingClientRect();
                        const cardSlotDom = document.querySelector('.card-slot');
                        data.cardSlotInfo = cardSlotDom.getBoundingClientRect();
                    }
                    ;
                
                    /**
                 * 卡片默认图标
                 */
                    const allHashes = ["fd4ef2e00c928ad16741c16728f1f2884d55ef21ecd808aaefa73c8bd32c1498i0"];
                    const randomNumbers = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(x=>Math.floor(Math.random() * allHashes.length));
                    const hashIds = randomNumbers.map(x=>allHashes[x]);
                    const defaultIcons = hashIds.map(x=>"https://ordinals.com/content/".concat(x));
                    // 随机生成Icons
                    const randomIconsFn = ()=>{
                        if (data.level === 1) {
                            return defaultIcons.slice(0, 3);
                        } else {
                            // console.log(111, defaultIcons.sort(() => Math.random() - 0.5).slice(0, defaultIcons.length))
                            return defaultIcons.sort(()=>Math.random() - 0.5).slice(0, defaultIcons.length);
                        }
                    }
                    ;
                
                    /**
                 * 卡槽已存在卡片长度
                 */
                    const selectLength = ()=>{
                        let length = 0;
                        data.select.forEach((item)=>{
                            length += item.length;
                        }
                        );
                        return length;
                    }
                    ;
                
                    //  循环的Icvons函数
                    const cycleIconsFn = ()=>{
                        let IconsRandomArr = randomIconsFn();
                        for (const i in IconsRandomArr) {
                            // 随机3的倍数
                            const rounds = data.level == 1 ? 6 : defaultRounds[Math.floor(Math.random() * defaultRounds.length)];
                            for (let k = 0; k < rounds; k++) {
                                createCardInfo(IconsRandomArr[i]);
                            }
                        }
                        ;checkShading();
                        renderCard();
                    }
                    ;
                    const renderCard = ()=>{
                        const {base, row, col} = config;
                        const container = document.querySelector('.container');
                        container.style.height = base * row;
                        container.style.width = base * col;
                        let strHTML = '';
                
                        data.cards.forEach((item,index)=>{
                            strHTML += \`
                        <div style="\${setCardStyle(item)}" data-id="\${item.id}" class="card-wrap pixel-box \${item.not ? 'afterAndBefer' : ''} \${item.clear ? 'hide-border' : ''}" onclick="gameScript.clickCard(\${index})">
                            <div class="mask-box"></div>
                            <div class="card pixel-box-child \${item.not ? 'is-allow ' : ''}" style="\${setAnimation(item)}">
                                <img class="ordz-pfp"  style="background-image:url(\${item.icon})" />
                                <div class="footer-border"></div>
                            </div>
                        </div>
                        \`;
                        }
                        );
                        container.innerHTML = strHTML;
                    }
                    ;
                
                    const initGameMap = (options={})=>{
                        data.gameState = 'start';
                
                        if (options.type !== 'next') {
                            gameData.playTime = 0;
                            gameUtils.formatTime(0);
                            gameUtils.startPlayTime();
                
                            gameData.score = 0;
                            gameUtils.updateScore();
                        }
                
                        //重置单次增加的分数
                        gameData.singleScore = 10;
                
                        data.select.clear();
                        data.cards = [];
                
                        if (data.level === 1) {
                            // 循环的Icvons函数
                            cycleIconsFn();
                        } else {
                            // 循环次数越多，难度越大
                            for (let i = 0; i < 4; i++) {
                                // 循环的Icvons函数
                                cycleIconsFn();
                            }
                            // cycleIconsFn();
                        }
                        gameData.cCount = data.cards.length;
                        // console.log('data.cards=>', data.cards);
                    }
                    ;
                
                    /**
                 * 创建卡片属性
                 * id icon x y 。。。
                 */
                    const createCardInfo = (icon)=>{
                        let maxMove = 270 - config.base;
                        // 偏移
                        const offset = defaultOffsetValue[Math.floor(defaultOffsetValueLength * Math.random())];
                        // 随机8列 8行
                        const row = Math.floor(Math.random() * config.row);
                        const col = Math.floor(Math.random() * config.col);
                        let id = randomCreateId();
                        let x = row * config.base + offset;
                        let y = col * config.base + offset;
                        let cardIds = data.cards.map(item=>\`\${item.x},\${item.y}\`);
                        if (cardIds.includes(\`\${x},\${y}\`)) {
                            // console.log('发现一个', x, y, id)
                            y += 6;
                        }
                        // console.log(row, col, config.base, offset)
                
                        data.cards.push({
                            id,
                            icon,
                            x,
                            y,
                            // 控制遮罩层
                            not: true,
                            // 是否在卡槽中 0否 1是
                            status: 0,
                            // 是否清除
                            clear: false,
                            // 隐藏
                            display: false
                        });
                    }
                    ;
                
                    /**
                 * 是否能点击 是否有阴影
                 */
                    const checkShading = ()=>{
                        const cards = data.cards;
                        for (let i = 0; i < cards.length; i++) {
                            const cur = cards[i];
                            cur.not = true;
                            // 已消完卡片和在卡槽内的卡片跳过
                            if (cur.status !== 0 || cur.display)
                                continue;
                            const {x: x1, y: y1} = cur;
                            const x2 = x1 + config.base
                              , y2 = y1 + config.base;
                
                            for (let j = i + 1; j < cards.length; j++) {
                                const compare = cards[j];
                                // 已消完卡片和在卡槽内的卡片跳过
                                if (compare.status !== 0 || compare.display)
                                    continue;
                                const {x, y} = compare;
                                if (!(y + config.base <= y1 || y >= y2 || x + config.base <= x1 || x >= x2)) {
                                    cur.not = false;
                                    break;
                                }
                            }
                        }
                        ;
                    }
                    ;
                
                    /**
                 * 开始游戏
                 */
                    const handleStart = ()=>{
                        if (data.cards.length) {
                            // window.alert('游戏中');
                            return;
                        }
                        initGameMap({});
                    }
                    ;
                
                    /**
                 * 重置游戏
                 */
                    const handleReset = (options)=>{
                        // 清空已有的卡片
                        data.cards.length = 0;
                        data.select.clear();
                        initGameMap(options);
                    }
                    ;
                
                    /**
                 * 点击卡片
                 */
                    const clickCard = async(index)=>{
                        let item = data.cards[index];
                        // 卡槽中的卡片不允许点击
                        if (item.status === 1)
                            return;
                
                        const length = selectLength();
                        const {selectMaxLength} = config;
                        if (item.not && length < selectMaxLength) {
                            const cards = data.cards;
                            const currentCard = cards[index];
                            currentCard.status = 1;
                
                            // 刷新卡槽位置
                            await refreshCardPosition(currentCard);
                            // 刷新被遮挡卡片
                            checkShading();
                            renderCard();
                        }
                        ;
                        // 校验卡片卡槽卡片数量长度
                        setTimeout(()=>{
                            if (selectLength() >= config.selectMaxLength) {
                
                                data.gameState = 'fail';
                                // 关闭定时器
                                clearInterval(gameUtils.playTimeTimer);
                                clearInterval(window.stateTimer);
                                // 截图
                                gameUtils._createScreenshot();
                                setTimeout(function() {
                                    // 显示邮箱
                                    document.querySelector('.start-interface.email').classList.add('displayBlock');
                                    document.querySelector('.start-interface.email').classList.remove('displayNone');
                                    isShowEmail = true
                                }, 500);
                
                                // alert('游戏失败 重新开始');
                
                                // document.querySelector('.replay-content').classList.add('displayBlock');
                                // document.querySelector('.replay-content').classList.remove('displayNone');
                
                                // clearInterval(gameUtils.playTimeTimer);
                
                                // console.log('error')
                                // gameUtils._createScreenshot();
                
                                // 发送游戏状态
                                // window.submitPlayerRecord({
                                //     type: 'fail',
                                //     email: gameData.eValue,
                                //     score: gameData.score
                                // })
                            }
                        }
                        , config.animationTime * 2);
                    }
                    ;
                
                    /*
                 * 提交邮箱
                 */
                    const submitEmail = (type)=>{
                        // 邮箱赋值
                        const iptDom = document.querySelector('#ipt');
                        if (!!iptDom.value.trim()) {
                            gameData.eValue = iptDom.value.trim();
                            gameUtils.setPassword(gameData.dataUrl);
                
                            document.querySelector('.start-interface.email').classList.remove('displayBlock');
                            document.querySelector('.start-interface.email').classList.add('displayNone');
                
                            // 失败后提交邮箱 
                            if (data.gameState === 'fail') {
                
                                document.querySelector('.replay-content').classList.add('displayBlock');
                                document.querySelector('.replay-content').classList.remove('displayNone');
                
                                window.submitPlayerRecord({
                                    type: 'fail',
                                    email: gameData.eValue,
                                    score: gameData.score,
                                    token: gameData.uid
                                });
                
                                // 成功后提交邮箱
                            } else if (data.gameState === 'win') {
                
                                let winContentDom = document.querySelector('.win-content');
                                winContentDom.classList.add('displayBlock');
                                winContentDom.classList.remove('displayNone');
                
                                window.submitPlayerRecord({
                                    type: 'success',
                                    email: gameData.eValue,
                                    score: gameData.score,
                                    token: gameData.uid
                                });
                
                            }
                
                        }
                
                    }
                    ;
                
                    /**
                 * 刷新卡槽卡片位置
                 */
                    const refreshCardPosition = (item)=>{
                        const {x, y} = data.cardSlotInfo;
                        const {top, left} = data.containerInfo;
                
                        if (item) {
                            // 是否存在
                            const cards = data.select.get(item.icon);
                            if (cards) {
                                cards.push(item);
                                checkSelectQueue(cards);
                            } else {
                                data.select.set(item.icon, [item]);
                            }
                        }
                        // 重新刷新位置
                        let index = 0;
                        const poor = (x < left) ? -(left - x) : (x - left);
                        data.select.forEach((item)=>{
                            item.forEach((card)=>{
                                card.x = 18 + ((config.base + 6) * index) - 40 - 1;
                                card.y = 270 + 40 + 20 + 24;
                                index++;
                            }
                            );
                        }
                        );
                    }
                    ;
                
                    /**
                 * 校验卡槽中是否3个相同的存在
                 */
                    const checkSelectQueue = (cards)=>{
                        if (cards.length === config.maxCount) {
                            // 已经满足3个，可以消除一组
                            gameData.score += gameData.singleScore;
                            gameData.singleScore += 10;
                
                            gameUtils.updateScore();
                
                            cards.forEach((item)=>{
                                item.clear = true;
                            }
                            );
                
                            setTimeout(()=>{
                                // 删除卡槽中卡片
                                data.select.delete(cards[0].icon);
                                // 删除cards中的卡片 软删除 display代替
                                cards.forEach((item)=>{
                                    item.display = true;
                                }
                                );
                                renderCard();
                            }
                            , config.animationTime - 150);
                
                            setTimeout(()=>{
                                // 属性卡槽卡片位置
                                refreshCardPosition();
                                renderCard();
                                // 校验是否卡片列表是否还有未消除的卡片
                                const hasCards = data.cards.filter((item)=>!item.display);
                                const level = data.level + 1;
                                let remaining = 2 * 3;
                                //剩余组数
                
                                if (!hasCards.length && level < 3) {
                                    // 下一关
                                    data.level++;
                                    handleReset({
                                        type: 'next'
                                    });
                                }
                                // // 提前截图生成密码
                                // if (hasCards.length === remaining && level >= 3) {
                                //     gameUtils._createScreenshot();
                                // }
                                if (!hasCards.length && level >= 3) {
                
                                    // alert('恭喜 🎉🎉 游戏通关咯');
                                    data.gameState = 'win';
                                    clearInterval(gameUtils.playTimeTimer);
                                    clearInterval(window.stateTimer);
                                    // console.log('win')
                                    gameUtils._createScreenshot();
                                    setTimeout(function() {
                                        // 显示邮箱
                                        document.querySelector('.start-interface.email').classList.add('displayBlock');
                                        document.querySelector('.start-interface.email').classList.remove('displayNone');
                                        isShowEmail = true
                                    }, 500);
                
                                    // setTimeout(() => {
                                    //     let winContentDom = document.querySelector('.win-content');
                                    //     winContentDom.classList.add('displayBlock');
                                    //     winContentDom.classList.remove('displayNone');
                                    // }, 300)
                
                                    // 发送游戏状态
                                    // window.submitPlayerRecord({
                                    //     type: 'success',
                                    //     email: gameData.eValue,
                                    //     score: gameData.score
                                    // })
                                }
                            }
                            , config.animationTime + 100);
                        }
                    }
                    ;
                
                    const clickStart = ()=>{
                
                        let startContentDom = document.querySelector('.start-interface');
                        startContentDom.classList.add('displayNone');
                        startContentDom.classList.remove('displayBlock');
                
                        handleStart();
                
                        // 发送游戏状态
                        window.submitPlayerRecord({
                            type: 'start',
                            email: gameData.eValue,
                            token: gameData.uid
                        });
                        gameUtils.startUpdateState();
                
                        // const iptDom = document.querySelector('#ipt');
                        // if (!!iptDom.value.trim()) {
                        //     let startContentDom = document.querySelector('.start-interface');
                        //     startContentDom.classList.add('displayNone');
                        //     startContentDom.classList.remove('displayBlock');
                
                        //     gameData.eValue = iptDom.value.trim();
                        //     handleStart();
                
                        //     // 发送游戏状态
                        //     window.submitPlayerRecord({
                        //         type: 'start',
                        //         email: gameData.eValue,
                        //     })
                        // }
                    }
                    ;
                
                    // 重玩
                    const clickReStart = ()=>{
                
                        document.querySelector('.replay-content').classList.remove('displayBlock');
                        document.querySelector('.replay-content').classList.add('displayNone');
                
                        let replayContentDom = document.querySelector('.replay-content');
                        replayContentDom.classList.add('displayNone');
                        replayContentDom.classList.remove('displayblock');
                        data.level = 1;
                
                        isShowEmail = false;
                        gameData.dataUrl = '';
                
                        handleReset();
                
                        // 发送游戏状态
                        window.submitPlayerRecord({
                            type: 'start',
                            email: gameData.eValue,
                            token: gameData.uid
                        });
                        gameUtils.startUpdateState();
                    }
                    ;
                
                    document.onkeydown = function(e) {
                        let {keyCode} = e;
                        if (keyCode === 13 && !data.gameState) {
                            clickStart();
                            return;
                        } else if (keyCode === 13 && !!isShowEmail) {
                            submitEmail();
                            return;
                        }
                    }
                    ;
                
                    function copyValue(type) {
                        if (type === 'token') {
                            gameUtils.copyF(gameData.ac);
                        } else if (type === 'website') {
                            gameUtils.copyF('https://www.ordz.games');
                        }
                    }
                    ;
                    return {
                        clickCard,
                        clickStart,
                        submitEmail,
                        clickReStart,
                        copyValue,
                        initGameMap,
                    }
                }
                )();
                
                gameScript.initGameMap = window.ggameScript.initGameMap
                gameScript.clickReStart = window.ggameScript.clickReStart
                gameScript.copyValue = window.ggameScript.copyValue
                gameScript.clickStart = window.ggameScript.clickStart
                gameScript.clickCard = window.ggameScript.clickCard
                gameScript.submitEmail = window.ggameScript.submitEmail
                

                `;
                (iframeDocument.body || iframeDocument.head).appendChild(script);
                console.log("注入完成");
            } catch (e) {
                console.log('Cannot access iframe contents:', e);
            }
        }
        else {
            console.log("找不到iframe");
        }
    });
})();
