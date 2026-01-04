// ==UserScript==
// @name         自动抽卡，抽到所有角色齐全！
// @namespace    https://www.qs5.org/?userscript-zhuque-gamingGenshinCharacterAllYes
// @version      2024-07-16-03
// @description  自动抽卡，抽齐或碎片够了以后自动使用碎片兑换。
// @author       ImDong <www@qs5.org>
// @match        https://zhuque.in/gaming/genshin/character/draw
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhuque.in
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500787/%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%8D%A1%EF%BC%8C%E6%8A%BD%E5%88%B0%E6%89%80%E6%9C%89%E8%A7%92%E8%89%B2%E9%BD%90%E5%85%A8%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/500787/%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%8D%A1%EF%BC%8C%E6%8A%BD%E5%88%B0%E6%89%80%E6%9C%89%E8%A7%92%E8%89%B2%E9%BD%90%E5%85%A8%EF%BC%81.meta.js
// ==/UserScript==

(function (diamond, not_characters) {
    // 抽卡 十连抽
    function drawGenshinCharacter(count) {
        return fetch('/api/gaming/drawGenshinCharacter', {
            headers: {
                'X-Csrf-Token': window.csrfToken,
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({
                count: count, // 次数改这里
                type: 0
            })
        }).then(e => e.json());
    }

    // 计算兑换需要多少碎片
    function needDiamond(not_characters) {
        let diamond = 0;
        for (let i = 0; i < not_characters.length; i++) {
            if (!not_characters[i]) {
                continue;
            }
            switch (not_characters[i].rank) {
                case 4:
                    diamond += 30
                    break;

                case 5:
                    diamond += 200
                    break;
            }
        }

        return diamond
    }

    // 兑换角色
    function exchangeGenshinCharacter(id) {
        return fetch('/api/gaming/exchangeGenshinCharacter', {
            headers: {
                'X-Csrf-Token': window.csrfToken,
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({
                id: id,
            })
        }).then(e => e.json());
    }

    // 获取角色列表
    function listGenshinCharacter() {
        return fetch('/api/gaming/listGenshinCharacter', {
            headers: {
                'X-Csrf-Token': window.csrfToken,
            }
        }).then(e => e.json());
    }

    // 要不要开始下一抽呢？
    function nextRoll() {
        // 如果已经够了就直接兑换否则先抽一次
        if (diamond >= needDiamond(not_characters)) {
            // 取出一个角色
            let item = not_characters.pop()
            if (!item) {
                console.log("齐活！")
                return;
            }

            console.log('兑换角色', item.name)
            exchangeGenshinCharacter(item.id)

            // 下一次
            setTimeout(nextRoll, 500)
        }

        // 否则还是抽卡吧
        console.log('开始抽卡...')
        drawGenshinCharacter(10).then(e => {
            // 成功才继续
            if (e.status != 200) {
                console.log("抽卡失败", e.code)
                return;
            }

            // 遍历抽卡结果 更新抽到的角色与碎片数
            e.data.result.forEach(item => {
                // 不能产生碎片
                if (item.type != 'character' || item.rank < 4) {
                    return;
                }

                // 记录结果
                if (!!not_characters[item.character]) {
                    console.log("抽中未拥有角色", not_characters[item.character].name)
                    delete not_characters[item.character]
                } else {
                    // 换成碎片
                    switch (item.rank) {
                        case 4:
                            diamond += 5;
                            console.log("抽中4星角色，已兑换碎片 5，当前总碎片", diamond)
                            break;

                        case 5:
                            diamond += 35;
                            console.log("抽中5星角色，已兑换碎片 35，当前总碎片", diamond)
                            break;
                    }
                }
            })

            // 开始下一次
            setTimeout(nextRoll, 500)
        })
    }

    // 开始整活
    function start() {
        // 先获取当前状态
        listGenshinCharacter().then(e => {
            if (e.status != 200) {
                console.log('请求出错')
                return
            }

            // 更新碎片数
            diamond = e.data.diamond;

            // 缺少的角色
            e.data.characters.forEach(item => {
                if (Object.keys(item.info).length > 0) {
                    return
                }

                not_characters[item.id] = item
            });

            console.log("当前碎片", diamond, "缺少角色", not_characters, "目标碎片", needDiamond(not_characters))

            // 要不要roll
            nextRoll()
        })
    }

    // 暴露到全局
    window.zhuque_gamingGenshinCharacterAllYes = start;

    console.log("输入 window.zhuque_gamingGenshinCharacterAllYes() 开始抽卡，兑换角色。")
})(0, []);
