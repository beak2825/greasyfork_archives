// ==UserScript==
// @name         掘金日常操作
// @version      2.4.5
// @description  后台判断自动签到；抽奖；一键全赞，在 bug 收集页面自动收集
// @match        https://juejin.cn/**
// @run-at       document-end
// @icon         https://img2.baidu.com/it/u=4226010475,2406859093&fm=26&fmt=auto
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @namespace    https://greasyfork.org/users/823922
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/433714/%E6%8E%98%E9%87%91%E6%97%A5%E5%B8%B8%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/433714/%E6%8E%98%E9%87%91%E6%97%A5%E5%B8%B8%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==
{
    // aid 写死实测发现没大问题，有问题在自己换吧；uuid 不确定干嘛的，给个随机数拉到
    function createUUID() {
        return '7' + parseInt(Math.random() * (10 ** 9)) + '' + parseInt(Math.random() * (10 ** 9));
    }

    function userInfo() {
        return 'aid=2608&uuid=' + createUUID();
    }
    var run = (function() { // 用于处理，页面内点击时，异步刷新页面
        let clickTime;

        function once() {
            clearTimeout(clickTime);
            clickTime = setTimeout(() => {
                let sysDate = unsafeWindow.localStorage.juejinDayTask;
                if (sysDate == null || sysDate != currDate()) {
                    dayTask();
                }
                let $menu = $('.nav-list>.main-nav-list>ul');
                if ($('#ou-chi-mao').length > 0) return;
                // 当发现页面元素变化时，重写渲染，并绑定元素
                $menu.find('li:gt(4)').remove();
                $menu.find('li:last>a').attr({
                    'id': 'ou-chi-mao',
                    'href': 'javascript:void(0);',
                }).css({
                    'color': '#03f9',
                    // 'font-family': 'serif',
                    'font-weight': 'bolder'
                }).text('血统鉴定');
                // 通过 html 删除，再添加的方式，移除这个按钮上的绑定事件
                let html = $('#ou-chi-mao').parent().prop('outerHTML');
                $('#ou-chi-mao').parent().remove();
                $menu.append(html);
                $('#ou-chi-mao').click(function() {
                    choujiang();
                    console.log('false')
                    return false;
                })

            }, 500)

        };
        return {
            once: once,
        }
    })();

    // init
    unsafeWindow.$ = $;
    setTimeout(() => run.once(), 400);
    // 检查是否有未确认的中奖通知
    if ((unsafeWindow.localStorage.luckyGay || '') != '') {
        tipLuckyGay();
    }

    function choujiang() {
        console.log('调用抽奖函数');
        let obj = {};
        let flag = true;
        simpleDialog.open();
        new Promise((resolve, reject) => {
            call();

            function call() {
                fetch(`https://api.juejin.cn/growth_api/v1/lottery/draw?${userInfo()}`, httpConfig).then(resp => resp.json()).then(data => {
                    if (data.err_msg != 'success') {
                        resolve();
                        return;
                    }
                    let name = data.data.lottery_name;
                    console.log(name);
                    simpleDialog.addRecord(name)
                    obj[name] = obj[name] || 0;
                    obj[name] = obj[name] + 1;
                    setTimeout(() => call(), parseInt(Math.random() * 1500) + 300);
                    if (['矿石', 'Bug'].indexOf(data.data.lottery_name.replace(/[0-9]/g, '')) == -1) {
                        unsafeWindow.localStorage.luckyGay += ('\n' + name);
                    }
                })
            }
        }).then(data => {
            let keys = Object.keys(obj);
            simpleDialog.empty();
            let msg = keys.length > 0 ? keys.map(k => k + ': ' + obj[k]).join('<br>') : '抽奖次数不足！';
            simpleDialog.addRecord(msg);
            simpleDialog.close();
        })
        return false;
    }

    async function dayTask() {
        console.log('调用日活函数')
        // return false;
        let msgs = [];
        let freeLottery = true;
        let bigLottery = false; // 超级大奖
        // 签到
        await fetch(
            `https://api.juejin.cn/growth_api/v1/check_in?${userInfo()}&_signature=_02B4Z6wo00101q966EAAAIDCL3gSAGCq5SKvfuzAAMrJs3JkiZSLejXKJy5lR-3Rot9hYdZVnmHKrdQPh0MmwDCQsjT9tEIN0G3uIK8RsU7pcEznZ9.oqqfseed8PMV.rul6lxG-dkqFtwsq61`,
            httpConfig).then(resp => resp.json()).then(data => {
            if (data.err_msg == 'success') {
                msgs.push('签到成功！');
            } else {
                freeLottery = false;
                msgs.push(data.err_msg);
                unsafeWindow.localStorage.juejinDayTask = currDate();
            }
            console.log(data);
        });
        if (!freeLottery) return false; // 没有免费抽奖就退出
        await fetch(`https://api.juejin.cn/growth_api/v1/lottery/draw?${userInfo()}`, httpConfig).then(resp => resp.json()).then(data => {
            if (data.err_msg == 'success') {
                msgs.push(`获得奖品 ${data.data.lottery_name}`);
            }
            if (['矿石', 'Bug'].indexOf(data.data.lottery_name.replace(/[0-9]/g, '')) == -1) { // 特地标记中奖了！
                bigLottery = true;
                unsafeWindow.localStorage.luckyGay = `获得奖品 ${data.data.lottery_name}`;
            }
            console.log(data);
        });
        await fetch(`https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky?${userInfo()}`, httpConfig).then(resp => resp.json()).then(data => {
            console.log('沾点蚊子腿的幸运值 ' + data.dip_value)
        });
        simpleDialog.open();
        simpleDialog.addRecord(msgs.join('<br>'));
        simpleDialog.close(1200);
        if (bigLottery) {
            tipLuckyGay();
        }
    }

    function tipLuckyGay() {
        // 缓存写入中奖信息，等手动确认了再清空
        if (confirm('请确认已经知道中奖！\n\n' + unsafeWindow.localStorage.luckyGay)) {
            unsafeWindow.localStorage.removeItem('luckyGay')
        }
    }

    function currDate() {
        let date = new Date();
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
    }
    var httpConfig = {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
        "referrer": "https://juejin.cn/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    };

    var simpleDialog = (function() { // 简易的弹窗效果
        return {
            open: () => {
                let html =
                    `<div id="lotteryResultDialog" style="position: absolute;z-index: 9999;width: 200px;height: 200px;left: calc(50vw - 100px);top: calc(30vh - 100px);
                           border-radius: 5px;padding: 10px;overflow: hidden;box-shadow:  0 0 7px 1px #f00a;background: #fffa;">
                           <div style="overflow: auto;width: 240px;height: 200px;"></div>
                        </div>
                        `;
                $('body').append(html);
            },
            addRecord: (msg) => {
                let html = `<div style="padding: 5px;font-size: 16px;display:none">${msg}</div>`;
                $('#lotteryResultDialog>div').prepend(html);
                $('#lotteryResultDialog>div>div:first').show(100).css({
                        'color': 'red'
                    })
                    .siblings().css({
                        'color': '#000'
                    })
            },
            close: (time = 1200) => {
                setTimeout(() => $('#lotteryResultDialog').slideUp(300, function() {
                    $('#lotteryResultDialog').remove()
                }), time)
            },
            empty: () => {
                $('#lotteryResultDialog>div').empty();
            }
        }
    })();
    unsafeWindow.simpleDialog = simpleDialog;
    // ------------------------------- 点赞 -------------------------------------------
    function myFetch(url, config) {
        return fetch(url, {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://juejin.cn/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": config.body,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(r => r.json());
    }
    // 文章获取
    function articleFetch(cursor) {
        return myFetch("https://api.juejin.cn/content_api/v1/article/query_list?" + userInfo(), {
            'body': JSON.stringify({
                user_id: getUserId(),
                sort_type: 2,
                cursor: cursor
            })
        });
    }
    // 点赞安排
    function diggFetch(articleId) {
        return myFetch("https://api.juejin.cn/interact_api/v1/digg/save?" + userInfo(), {
            'body': JSON.stringify({
                item_id: articleId,
                item_type: 2,
                client_type: 2608
            })
        });
    }

    // 判断文章的数量
    let arr = [];
    // 文章到底，或者连续 10 篇以点赞，就不继续遍历了
    function call(cursor = '0') {
        if (getUserId() == '') {
            alert('请到用户的主页，再执行此操作！')
            return false;
        }
        // console.log(cursor)
        articleFetch(cursor).then(d => {
            let temp = d.data.filter(n => !n.user_interact.is_digg).map(n => n.article_info.article_id);
            arr.push(...temp);
            if (d.count != parseInt(d.cursor) && temp.length > 0) {
                setTimeout(() => call(d.cursor), 100);
            } else {
                let msg = `共 ${arr.length} 篇文章点赞完成！`;

                function temp1() {
                    new Promise((resolve, reject) => {
                        if (arr.length == 0) {
                            reject();
                        } else {
                            resolve();
                        }
                    }).then(() => {
                        setTimeout(() => {
                            diggFetch(arr.pop());
                            temp1();
                        }, parseInt(Math.random() * 300) + 30)
                    }).catch(() => {
                        alert(msg);
                    })
                }
                temp1();

            }
        })
    }

    function getUserId() {
        let url = unsafeWindow.location.href;
        if (url.indexOf('https://juejin.cn/user/') == -1) {
            return '';
        } else {
            return url.split('/')[4];
        }
    }

    function collectBugs() {
        for (let i = 1; i < 4; i++) {
            let time = setTimeout(() => $('[src="//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/timedGeneration.fa59c66.png"]').click(), i * 1500)
            console.log(time)
        }
    }

    {
        bugsTimeCount = 10;
        let collectBugsTime = setInterval(() => {
            if (bugsTimeCount-- < 0) {
                clearInterval(collectBugsTime);
            }
            if ('https://juejin.cn/user/center/bugfix?enter_from=bugFix_bar' == unsafeWindow.location.href) {
                collectBugs();
                clearInterval(collectBugsTime);
            }
        }, 2000)
    }
    GM.registerMenuCommand('一键全赞', call)
    GM.registerMenuCommand(collectBugs)
}
