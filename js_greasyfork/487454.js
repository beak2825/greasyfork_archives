// ==UserScript==
// @name            赛尔号启航Pc
// @name:en         赛尔号启航Pc
// @namespace       赛尔号启航Pc
// @version         3.1.0
// @description     赛尔号启航Pc.
// @description:en  helpersaiier
// @include         http://s.61.com/*
// @require         https://greasyfork.org/scripts/372672-everything-hook/code/Everything-Hook.js?version=881251
// @author          2942332601QQ
// @match           https://s.61.com/*
// @run-at          document-start
// @grant           none
// @license         GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/487454/%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%90%AF%E8%88%AAPc.user.js
// @updateURL https://update.greasyfork.org/scripts/487454/%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%90%AF%E8%88%AAPc.meta.js
// ==/UserScript==
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        // 获取目标iframe元素
        const iframe = document.querySelector('iframe');

        // 修改iframe的sandbox属性，允许跨域访问
        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
    });


    'use strict';
    //去除左侧小贴士
    var targetClass = 'age-tip';
    var targetClass1 = 'years'
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.classList && node.classList.contains(targetClass)) {
                    node.style.display = 'none';
                }
                if (node.classList && node.classList.contains(targetClass1)) {
                    node.style.display = 'none';
                }
            });
        });
    });
    // 监听整个文档的变化
    observer.observe(document, { childList: true, subtree: true });
    var bossStatus = false
    var doneRound = false
    var tttt
    var SelfUid = ""
    var skillID = ""   //获取首发精灵skillID
    var skillStarId = ""
    var myTeam = []  //获取精灵配置信息
    var myTeamDone = 0
    var StartJson = ""  //存储迷航当前进度id
    var rewrite = 0
    var CmdArr = []
    var changePet = ""
    var nextRound = false
    var 战斗资源加载完毕
    var PetMsgDetail = ""
    var skillSecondId = ""
    var doneBattleMsg = ""
    var 捕捉ok = false
    var catchCount = 0
    var 捕捉情况 = ""
    var floorContent = ""
    var ptfloorContent = ""
    var Buff = ""

    var logicDoneRound = false


    var roundContent = ""

    // fixMsg()
    // 创建一个 div
    var topWindow = window.top;
    //判断顶层body
    if (topWindow == window) {
        if (window.location.href.indexOf("http://s.61.com/home") != -1) {
            window.location.href = "https://s.61.com/home/"
        }
        // if (window.location.href.indexOf("http://s.61.com/home/") != -1) {
        //     window.location.href = "https://s.61.com/home/"
        // }
        var div = document.createElement("div");
        div.style.zIndex = 999996;
        div.id = "cardPage";
        div.style.position = "fixed";
        div.style.left = "50px";
        div.style.top = "40px";
        div.style.width = "250px";
        div.style.height = "80%";
        div.style.backgroundColor = "lightblue";



        var div1 = document.createElement("div");
        div1.style.position = "fixed";
        div1.style.left = "30px";
        div1.style.top = "90%";
        div1.style.zIndex = 999996;
        // div1.style.width = "10px";
        div1.style.height = "20px";

        // 创建一个按钮
        var tosmall = document.createElement("button");
        tosmall.innerHTML = "缩";
        tosmall.style.display = "block";
        // tosmall.style.margin = "10px auto";
        tosmall.style.width = "25px";
        tosmall.style.height = "20px";
        // 在点击按钮时输出日志到文本框中
        tosmall.onclick = function () {
            if (tosmall.innerHTML == "缩") {
                tosmall.innerHTML = "展"
                document.getElementById("cardPage").style.display = "none"
            } else {
                tosmall.innerHTML = "缩"
                document.getElementById("cardPage").style.display = "block"
            }
        };


        div1.appendChild(tosmall)



        var button0 = document.createElement("h3");
        button0.innerHTML = "⚡启航护肝小助手3.1.0⚡\n  ";
        button0.style.display = "block";
        button0.style.margin = "1px auto";
        button0.style.marginTop = "5px"
        button0.style.width = "250px";
        // button0.style.height = "30px";
        button0.style.fontSize = "16px";
        button0.style.fontWeight = "bold"
        button0.style.textAlign = "center";
        div.appendChild(button0);


        var supportTxt = document.createElement("p");
        supportTxt.innerHTML = "❤群283260916【永久免费】❤";
        supportTxt.style.display = "block";
        // supportTxt.style.marginLeft = "10px";
        supportTxt.style.width = "250px";
        // supportTxt.style.fontSize = "17px";
        supportTxt.style.fontWeight = "bold"
        supportTxt.style.textAlign = "center";
        supportTxt.style.float = "left";
        supportTxt.style.margin = "0px"
        div.appendChild(supportTxt);


        // 创建单选按钮1
        var radio1 = document.createElement('input');
        radio1.type = 'radio';
        radio1.name = 'option';
        radio1.value = '4001';
        radio1.style.marginLeft = "10px";

        // 创建标签1
        var label1 = document.createElement('label');
        label1.innerHTML = '初级胶囊';
        label1.style.fontSize = "10px";
        // 创建单选按钮2
        var radio2 = document.createElement('input');
        radio2.type = 'radio';
        radio2.name = 'option';
        radio2.value = '4002';
        // 创建标签2
        var label2 = document.createElement('label');
        label2.innerHTML = '中级胶囊';
        label2.style.fontSize = "10px";
        // 创建单选按钮3
        var radio3 = document.createElement('input');
        radio3.type = 'radio';
        radio3.name = 'option';
        radio3.value = '4003';
        // 创建标签3
        var label3 = document.createElement('label');
        label3.innerHTML = '高级胶囊';
        label3.style.fontSize = "10px";
        // 添加单选按钮和标签到div
        div.appendChild(radio1);
        div.appendChild(label1);

        div.appendChild(radio2);
        div.appendChild(label2);

        div.appendChild(radio3);
        div.appendChild(label3);

        // // 设置单选按钮样式
        // radio1.style.display = 'block';
        // radio2.style.display = 'block';
        // radio3.style.display = 'block';
        // // 添加其他样式设置...

        // // 设置标签样式
        // label1.style.display = 'block';
        // label2.style.display = 'block';
        // label3.style.display = 'block';
        // 添加其他样式设置...



        var produceLogPanel = 0
        var tttt
        // 创建一个按钮
        var button1 = document.createElement("button");
        button1.innerHTML = "开启";
        button1.style.margin = "4px";
        button1.style.width = "45px";
        button1.style.height = "30px";
        // 在点击按钮时输出日志到文本框中
        button1.onclick = function () {
            if (rewrite == 0) {
                try {
                    var userI = document.querySelector("iframe").contentWindow.UserManager.getInstance()

                } catch (e) {
                    var userI = UserManager.getInstance()
                }
                if (userI.userInfo == undefined) {
                    showToast("请先登入游戏再点击开启监听！！")
                    return
                }
                rewrite = 1
                fixMsg()
                showToast("顺利开启监听，宝贝")
                showNotice("V3.1.0\n新增PVP 巅峰狂野模式 竞技 乱斗 挂机 ")
                if (produceLogPanel == 0) {
                    produceLogPanel = 1
                    produceLog()
                }
                button1.innerHTML = "关闭";
            } else if (rewrite == 1) {
                rewrite = 0
                backMSg()
                showToast("顺利关闭，内存得到部分释放")
                button1.innerHTML = "开启";
            }

        };
        div.appendChild(button1);



        var button5 = document.createElement("button");
        button5.innerHTML = "迷航";
        button5.style.margin = "4px";
        button5.style.width = "45px";
        button5.style.height = "30px";
        button5.style.marginLeft = "10px"
        // 在点击按钮时输出日志到文本框中
        button5.onclick = async function () {
            await starTrek()
        };
        div.appendChild(button5);





        // 创建一个按钮
        var button = document.createElement("button");
        button.innerHTML = "资源";
        button.style.margin = "4px";
        button.style.width = "45px";
        button.style.height = "30px";
        // 在点击按钮时输出日志到文本框中
        button.onclick = async function () {
            if (rewrite == 0) {
                showToast("请先开启监听！宝贝");
                return
            }
            try {
                let firTime = UserManager.getInstance().userInfo.defaultTeam[0]
                skillID = PetManager.getInstance().getPetInfoByGetTime(firTime).skills[0];
            } catch (e) {
                let firTime = document.querySelector("iframe").contentWindow.UserManager.getInstance().userInfo.defaultTeam[0]
                skillID = document.querySelector("iframe").contentWindow.PetManager.getInstance().getPetInfoByGetTime(firTime).skills[0];
            }

            writeLog("皮皮星第一层")
            while (true) {
                //查询轮盘
                await sendMsg(1176, { planetId: 1 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["1"] == undefined) {
                    writeLog("皮皮星①第1次奖励!")
                }
                else if (reward["1"] < 10) {
                    writeLog("皮皮星①第" + reward["1"] + "次奖励!")
                } else {
                    writeLog("皮皮星①完成！")
                    CmdArr = []
                    break
                }

                await getObjs(20001, 109, 1)
                await wait(200)
                CmdArr = []
            }
            await wait(200)

            writeLog("皮皮第二层")
            while (true) {
                //查询轮盘
                await sendMsg(1176, { planetId: 1 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["2"] == undefined) {
                    writeLog("皮皮星②第1次奖励!")
                }
                else if (reward["2"] < 10) {
                    writeLog("皮皮星②第" + reward["2"] + "次奖励!")
                } else {
                    writeLog("皮皮星②完成!")
                    CmdArr = []
                    break
                }
                await wait(200)

                await getObjs(20002, 87, 2)
                CmdArr = []
            }
            await wait(200)
            writeLog("皮皮第三层")
            while (true) {
                //查询轮盘
                await sendMsg(1176, { planetId: 1 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })

                if (reward["3"] < 5) {
                    let oneC = isNaN(parseInt(reward["3"])) ? 0 : parseInt(reward["3"])
                    let twoC = isNaN(parseInt(reward["4"])) ? 0 : parseInt(reward["4"])
                    writeLog("皮皮星③第" + (oneC + twoC) + "次奖励!")
                    await getObjs(20003, 29, 3)

                } else if (reward["4"] < 5) {
                    let oneC = isNaN(parseInt(reward["3"])) ? 0 : parseInt(reward["3"])
                    let twoC = isNaN(parseInt(reward["4"])) ? 0 : parseInt(reward["4"])
                    writeLog("皮皮星③第" + (oneC + twoC) + "次奖励!")

                    await getObjs(20003, 29, 4)
                } else if (reward["3"] == undefined) {
                    await getObjs(20003, 29, 3)
                } else if (reward["4"] == undefined) {
                    await getObjs(20003, 29, 4)
                } else {
                    writeLog("皮皮星③完成!")
                    CmdArr = []
                    await wait(200)
                    break
                }

                CmdArr = []
            }

            await wait(200)
            writeLog("水星第一层")
            while (true) {
                CmdArr = []
                //查询轮盘
                await sendMsg(1176, { planetId: 2 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["9"] == undefined) {
                    writeLog("水星①第1次奖励!")
                } else if (reward["9"] < 20) {
                    writeLog("水星①第" + reward["9"] + "次奖励!")
                } else {
                    writeLog("水星①完成!")
                    CmdArr = []
                    break
                }
                await wait(200)

                await getObjs(20004, 31, 9)
                CmdArr = []
            }

            await wait(200)
            writeLog("水星第二层")
            while (true) {
                CmdArr = []
                //查询轮盘
                await sendMsg(1176, { planetId: 2 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["10"] == undefined) {
                    writeLog("水星②第1次奖励!")
                } else if (reward["10"] < 10) {
                    writeLog("水星②第" + reward["10"] + "次奖励!")
                } else {
                    writeLog("水星②完成!")
                    CmdArr = []
                    break
                }
                await wait(200)
                await getObjs(20005, 31, 10)
                CmdArr = []
            }
            await wait(200)
            writeLog("水星第三层")
            while (true) {
                CmdArr = []
                //查询轮盘
                await sendMsg(1176, { planetId: 2 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })

                if (reward["11"] == undefined) {
                    writeLog("水星③第1次奖励!")
                }

                else if (reward["11"] < 3) {
                    writeLog("水星③第" + reward["11"] + "次奖励!")
                } else {
                    writeLog("水星③完成!")
                    CmdArr = []
                    break
                }

                await getObjs(20006, 31, 11)
                CmdArr = []
                await wait(200)
            }


            await wait(200)
            writeLog("火星第一层")
            while (true) {
                CmdArr = []
                //查询轮盘
                await sendMsg(1176, { planetId: 3 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["12"] == undefined) {
                    writeLog("火星①第1次奖励!")
                } else if (reward["12"] < 10) {
                    writeLog("火星①第" + reward["12"] + "次奖励!")
                } else {
                    writeLog("火星①完成!")
                    CmdArr = []
                    break
                }
                await wait(200)
                await getObjs(20007, 9, 12)
                CmdArr = []
            }


            await wait(200)
            writeLog("火星第二层")
            while (true) {
                CmdArr = []
                //查询轮盘
                await sendMsg(1176, { planetId: 3 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["13"] == undefined) {
                    writeLog("火星②第1次奖励!")
                } else if (reward["13"] < 20) {
                    writeLog("火星②第" + reward["13"] + "次奖励!")
                } else {
                    writeLog("火星②完成!")
                    CmdArr = []
                    break
                }
                await wait(200)

                await getObjs(20008, 9, 13)
                CmdArr = []
            }


            await wait(200)
            writeLog("火星第三层")
            while (true) {
                CmdArr = []
                //查询轮盘
                await sendMsg(1176, { planetId: 3 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["14"] == undefined) {
                    writeLog("火星③第1次奖励!")
                } else if (reward["14"] < 3) {
                    writeLog("火星③第" + reward["14"] + "次奖励!")
                } else {
                    writeLog("火星③第1次奖励!")
                    CmdArr = []
                    break
                }
                await wait(200)

                await getObjs(20009, 9, 14)
                CmdArr = []
            }


            await wait(200)
            writeLog("云霄星第一层")
            while (true) {
                CmdArr = []
                //查询轮盘
                await sendMsg(1176, { planetId: 5 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["33"] == undefined) {
                    writeLog("云霄星①第1次奖励!")
                } else if (reward["33"] < 20) {
                    writeLog("云霄星①第" + reward["33"] + "次奖励!")
                } else {
                    writeLog("云霄星完成!")
                    CmdArr = []
                    break
                }
                await wait(200)
                await getObjs(20015, 10, 33)
                CmdArr = []
            }


            await wait(200)
            writeLog("云霄星第二层")
            while (true) {
                CmdArr = []
                //查询轮盘
                await sendMsg(1176, { planetId: 5 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["34"] == undefined) {
                    writeLog("云霄星②第1次奖励!")
                } else if (reward["34"] < 10) {
                    writeLog("云霄星②第" + reward["34"] + "次奖励!")
                } else {
                    writeLog("云霄星②完成!")
                    CmdArr = []
                    break
                }
                await wait(200)
                await getObjs(20016, 9, 34)
                CmdArr = []
            }



            await wait(200)
            writeLog("云霄星第三层")
            while (true) {
                CmdArr = []
                //查询轮盘
                await sendMsg(1176, { planetId: 5 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["35"] == undefined) {
                    writeLog("云霄星③第1次奖励!")
                } else if (reward["35"] < 5) {
                    writeLog("云霄星③第" + reward["35"] + "次奖励!")
                } else {
                    writeLog("云霄星③完成!")
                    CmdArr = []
                    break
                }
                await wait(200)

                await getObjs(20017, 10, 35)
                CmdArr = []
            }





            await wait(200)
            writeLog("喷泉星第一层")
            while (true) {
                CmdArr = []
                //查询轮盘
                await sendMsg(1176, { planetId: 6 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["179"] == undefined) {
                    writeLog("喷泉星①第1次奖励!")
                } else if (reward["179"] < 10) {
                    writeLog("喷泉星①第" + reward["179"] + "次奖励!")
                } else {
                    writeLog("喷泉星①完成!")
                    CmdArr = []
                    break
                }

                await getObjs(20018, 9, 179)
                await wait(200)

                CmdArr = []
            }



            await wait(200)
            writeLog("喷泉星第二层")
            while (true) {
                CmdArr = []
                //查询轮盘
                await sendMsg(1176, { planetId: 6 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["60"] == undefined) {
                    writeLog("喷泉星②第1次奖励!")
                } else if (reward["60"] < 10) {
                    writeLog("喷泉星②第" + reward["60"] + "次奖励!")
                } else {
                    writeLog("喷泉星②完成!")
                    CmdArr = []
                    break
                }
                await getObjs(20020, 9, 60)
                CmdArr = []
                await wait(200)
            }



            await wait(200)
            writeLog("暗影星第一层")
            while (true) {
                CmdArr = []
                //查询轮盘
                await sendMsg(1176, { planetId: 8 })
                let reward = ""
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 1176) {
                        reward = JSON.parse(item["1176"]).reward
                    }
                })
                if (reward["66"] == undefined) {
                    writeLog("暗影星①第一次奖励!")
                } else if (reward["66"] < 20) {
                    writeLog("暗影星①第" + reward["66"] + "次奖励!")
                } else {
                    writeLog("暗影星①完成!")
                    CmdArr = []
                    break
                }
                await getObjs(20026, 43, 66)
                await wait(200)

                CmdArr = []
            }
            console.log("刷资源")
        };
        div.appendChild(button);

        var ziyuan2 = document.createElement("button");
        ziyuan2.innerHTML = "资源2";
        ziyuan2.style.margin = "4px";
        ziyuan2.style.width = "50px";
        ziyuan2.style.height = "30px";
        // 在点击按钮时输出日志到文本框中
        ziyuan2.onclick = async function () {
            if (rewrite == 0) {
                showToast("请先开启监听！宝贝")
                return
            }
            await fightan()
        };
        div.appendChild(ziyuan2)



        var button3 = document.createElement("button");
        button3.innerHTML = "打怪";
        button3.style.margin = "4px";
        button3.style.width = "45px";
        button3.style.height = "30px";
        // 在点击按钮时输出日志到文本框中
        button3.onclick = async function () {
            if (rewrite == 0) {
                showToast("请先开启监听！宝贝")
                return
            }
            await fightQiu()
        };
        div.appendChild(button3);






        // 创建一个按钮
        var button2 = document.createElement("button");
        button2.innerHTML = "雇佣";
        button2.style.margin = "4px";
        button2.style.width = "45px";
        button2.style.height = "30px";
        // 在点击按钮时输出日志到文本框中
        button2.onclick = async function () {
            if (rewrite == 0) {
                showToast("请先开启监听！宝贝")
                return
            }
            SelfUid = 雇佣Uid.value
            console.log(SelfUid)
            let nowSkillId = skillID


            while (1) {
                CmdArr = []
                await sendMsg(10042, {
                    "friendPageNo": 1,
                    "friendPageSize": 1000,
                    "teamPageNo": 1,
                    "teamPageSize": 1000
                })
                let HireArr = []
                CmdArr.forEach(item => {
                    if (parseInt(Object.keys(item)[0]) == 10042) {
                        let teamHireList = JSON.parse(item["10042"]).teamHireList
                        teamHireList.forEach(item0 => {
                            if (item0.userId == parseInt(SelfUid)) {
                                console.log(item0)
                                HireArr.push(item0)
                            }
                        })
                    }
                })

                let doneGet = 0
                for (let index = 0; index < HireArr.length; index++) {
                    if (HireArr[index].petHireTimes < 10) {
                        doneGet = 1
                        writeLog("" + HireArr[index].roleNick + "的第" + (index + 1) + "只精灵,雇佣次数:" + HireArr[index].petHireTimes)
                        let newTeamList = []

                        for (let index = 0; index < myTeam.length; index++) {
                            if (myTeam[index].indexOf("_") != -1) {
                                break
                            } else {
                                newTeamList.push(myTeam[index])
                            }
                        }

                        newTeamList.push(SelfUid + "_" + HireArr[index].type + "_" + HireArr[index].pos)



                        CmdArr = []
                        await sendMsg(10043, {
                            "type": HireArr[index].type,
                            "pos": HireArr[index].pos,
                            "targetUid": parseInt(SelfUid)
                        })
                        let goalPet
                        //取出雇佣目标精灵信息
                        CmdArr.forEach(item => {
                            if (parseInt(Object.keys(item)[0]) == 10043) {
                                goalPet = JSON.parse(item["10043"]).pet
                            }
                        })

                        console.log({
                            "levelId": 36,
                            "hirePetList": newTeamList,
                            "attachBattleSkill": [
                                {
                                    "petId": goalPet.petId,
                                    "level": goalPet.level,
                                    "skillList": goalPet.skills,
                                    "getTime": HireArr[index].getTime,
                                    "otherUid": parseInt(SelfUid),
                                    "type": HireArr[index].type
                                }
                            ]
                        })
                        //开始进入草系关卡
                        await sendMsg(4881, {
                            "levelId": 1,
                            "hirePetList": newTeamList,
                            "attachBattleSkill": [
                                {
                                    "petId": goalPet.petId,
                                    "level": goalPet.level,
                                    "skillList": goalPet.skills,
                                    "getTime": HireArr[index].getTime,
                                    "otherUid": parseInt(SelfUid),
                                    "type": HireArr[index].type
                                }
                            ]
                        })


                        await sendMsg(1042, {
                            "groupId": "",
                            "battleType": 0
                        })


                        await sendMsg(1045, {
                            "data": null,
                            "groupId": "",
                            "opType": 5
                        });
                        CmdArr = []

                        await sendMsg(1057, {
                            "groupId": "",
                        });
                        CmdArr = []


                        await sendMsg(1045, {
                            opType: 1,
                            data: {
                                skillID: nowSkillId,
                            },
                            groupId: "",
                        });
                        CmdArr = []
                        writeLog("本次雇佣完毕")
                        console.log("打完了！")
                        await wait(100)
                        break
                    }

                }
                if (doneGet == 0) {
                    writeLog("雇佣完毕！！")
                    return
                }
            }




        };
        div.appendChild(button2);



        var button3 = document.createElement("button");
        button3.innerHTML = "采集";
        button3.style.margin = "4px";
        button3.style.width = "45px";
        button3.style.height = "30px";
        button3.style.marginLeft = "10px"
        // 在点击按钮时输出日志到文本框中
        button3.onclick = async function () {
            await getResource()
        };
        div.appendChild(button3);



        var button4 = document.createElement("button");
        button4.innerHTML = "轮盘";
        button4.style.margin = "4px";
        button4.style.width = "45px";
        button4.style.height = "30px";

        // 在点击按钮时输出日志到文本框中
        button4.onclick = async function () {
            await goPrize()
        };
        div.appendChild(button4);



        var button9 = document.createElement("button");
        button9.innerHTML = "捕捉";
        button9.style.margin = "4px";
        button9.style.width = "45px";
        button9.style.height = "30px";
        // 在点击按钮时输出日志到文本框中
        button9.onclick = async function () {
            if (rewrite == 0) {
                showToast("请先开启监听！宝贝")
                return
            }
            catchCount = 0
            let opt = getSelectedOptions()
            if (opt.length == 0) {
                showToast("请先选择使用胶囊种类！！")
                return
            }
            if (isNaN(catchC.value)) {
                showToast("请输入捕捉次数！！")
                return
            }
            while (1) {
                await catchPet()
                if (catchCount >= catchC.value) {
                    writeLog("捕捉结束")
                    break
                }
            }



        };
        div.appendChild(button9);




        // var stopStatus = false
        var battleFloor = document.createElement("button");
        battleFloor.innerHTML = "教皇";
        battleFloor.style.margin = "4px";
        battleFloor.style.width = "45px";
        battleFloor.style.height = "30px";
        // 在点击按钮时输出日志到文本框中
        battleFloor.onclick = async function () {
            if (rewrite == 0) {
                showToast("请先开启监听！宝贝")
                return
            }
            await battleF()
        };
        div.appendChild(battleFloor);

        var ptbattleFloor = document.createElement("button");
        ptbattleFloor.innerHTML = "阶梯";
        ptbattleFloor.style.margin = "4px";
        ptbattleFloor.style.width = "45px";
        ptbattleFloor.style.height = "30px";
        // 在点击按钮时输出日志到文本框中
        ptbattleFloor.onclick = async function () {
            if (rewrite == 0) {
                showToast("请先开启监听！宝贝")
                return
            }
            await ptbattleF()
        };
        div.appendChild(ptbattleFloor);


        var actionPvpBtn = document.createElement("button");
        actionPvpBtn.innerHTML = "PVP";
        actionPvpBtn.style.margin = "4px";
        actionPvpBtn.style.width = "45px";
        actionPvpBtn.style.height = "30px";
        // 在点击按钮时输出日志到文本框中
        actionPvpBtn.onclick = async function () {
            if (rewrite == 0) {
                showToast("请先开启监听！宝贝")
                return
            }
            if (getSelectedOptionsPVP() == "dianfeng") {
                await dianfeng()
            }
            if (getSelectedOptionsPVP() == "luandou") {
                await luandou()
            }

            if (getSelectedOptionsPVP() == "jingji") {
                await jingji()
            }


        };
        div.appendChild(actionPvpBtn);

        // 创建单选按钮1
        var radio1 = document.createElement('input');
        radio1.type = 'radio';
        radio1.name = 'optionPVP';
        radio1.value = 'luandou';
        radio1.style.marginLeft = "10px";
        // 创建标签1
        var label1 = document.createElement('label');
        label1.innerHTML = '乱斗';
        label1.style.fontSize = "10px";
        // 创建单选按钮2
        var radio2 = document.createElement('input');
        radio2.type = 'radio';
        radio2.name = 'optionPVP';
        radio2.value = 'dianfeng';
        // 创建标签2
        var label2 = document.createElement('label');
        label2.innerHTML = '巅峰';
        label2.style.fontSize = "10px";
        // 创建单选按钮3
        var radio3 = document.createElement('input');
        radio3.type = 'radio';
        radio3.name = 'optionPVP';
        radio3.value = 'jingji';
        // 创建标签3
        var label3 = document.createElement('label');
        label3.innerHTML = '竞技';
        label3.style.fontSize = "10px";
        // 添加单选按钮和标签到div
        div.appendChild(document.createElement('br'));
        div.appendChild(radio1);
        div.appendChild(label1);
        div.appendChild(radio2);
        div.appendChild(label2);
        div.appendChild(radio3);
        div.appendChild(label3);





        div.appendChild(document.createElement("br"));
        var 雇佣Uid = document.createElement("input");
        雇佣Uid.style.marginLeft = "10px"
        雇佣Uid.id = '雇佣Uid';
        雇佣Uid.placeholder = "输入雇佣uid"
        雇佣Uid.style.width = "100px"
        div.appendChild(雇佣Uid);

        var catchC = document.createElement("input");
        catchC.style.marginLeft = "10px"
        catchC.id = 'catchC';
        catchC.placeholder = "输入捕捉次数"
        catchC.style.width = "100px"
        div.appendChild(catchC);

        // 创建一个文本框用于输出日志
        var logTextArea = document.createElement("textarea");
        logTextArea.id = 'logId';
        logTextArea.style.resize = 'none';
        logTextArea.readOnly = 'readOnly';
        logTextArea.style.display = "block";
        logTextArea.style.width = "90%";
        logTextArea.style.height = "70px";
        logTextArea.style.margin = "10px auto";
        logTextArea.scrollTop = logTextArea.scrollHeight;
        logTextArea.placeholder = "禁止贩卖！如果被欺诈，请在群里联系开发者！"
        div.appendChild(logTextArea);




        setTimeout(() => {
            // 将 div 添加到页面中
            let bdTag = document.getElementsByTagName("html")[0]
            bdTag.appendChild(div1);
            bdTag.appendChild(div);
        }, 5000)






    }
    // 创建 MutationObserver 实例
    const observer1 = new MutationObserver((mutationsList) => {
        // 监听到内容变化时的回调函数
        logTextArea.scrollTop = logTextArea.scrollHeight;
    });

    // 配置 MutationObserver 监听的内容变化类型
    const config = { childList: true, subtree: true };

    // 开始监听 logTextArea 内容的变化
    if (logTextArea) {
        observer1.observe(logTextArea, config);
    } else {
        console.error("yhyh未监听到内容");
    }






    async function sendSkillAndCatch(nowSkillId) {
        await sendMsg(1042, {
            "groupId": "",
            "battleType": 0
        })
        await wait(100)

        await sendMsg(1045, {
            "opType": 5,
            "data": null,
            "groupId": ""
        })



        await wait(100)
        await sendMsg(1057, {
            "groupId": ""
        })

        await sendMsg(1045, {
            "opType": 1,
            "data": {
                "skillID": nowSkillId
            },
            "groupId": ""
        })



        while (1) {
            if (nextRound == true) {
                console.log("$$$$$$$$$$$$$$本回合结束$$$$$$$$$$$$$$")
                nextRound = false
                break
            } else {
                await wait(50)
            }
        }




        await sendMsg(1057, {
            "groupId": ""
        })
        await sendMsg(1045, {
            "opType": 3,
            "data": {
                "itemID": 4001
            },
            "groupId": ""
        })

        await wait(300)







    }

    function produceLog() {
        try {
            tttt = new WatchChatList;
            tttt.skinName = "WatchChatListSkin";
            tttt.strMsg = ""
            tttt.y = 100;
            RES.loadConfig("resource/ui/battle.json", "resource/ui/").then(() => {
                MFC.rootLayer.addChild(tttt)
                tttt.$doRemoveChild(0)
                tttt.$doRemoveChild(3)
                tttt.$doRemoveChild(2)
                tttt.$doRemoveChild(0)
                tttt.$doRemoveChild(1)
                tttt.$doRemoveChild(2)
            })
        } catch (e) {
            let WatchChatList = document.querySelector("iframe").contentWindow.WatchChatList
            tttt = new WatchChatList;
            tttt.skinName = "WatchChatListSkin";
            tttt.strMsg = ""
            tttt.y = 100;
            document.querySelector("iframe").contentWindow.RES.loadConfig("resource/ui/battle.json", "resource/ui/").then(() => {
                document.querySelector("iframe").contentWindow.MFC.rootLayer.addChild(tttt)
                tttt.$doRemoveChild(0)
                tttt.$doRemoveChild(3)
                tttt.$doRemoveChild(2)
                tttt.$doRemoveChild(0)
                tttt.$doRemoveChild(1)
                tttt.$doRemoveChild(2)
            })
        }

    }
    function newLogOutput() {
        logTextArea.scrollTop = logTextArea.scrollHeight;
    }
    function writeLog(logStr) {
        logTextArea.value += logStr + "\n";
        newLogOutput();
        //第二代版本
        // try {
        //     tttt.strMsg = "<font color='#bbff00'>[护肝助手]</font><font color='#FFFFFF'>" + logStr + "</font>\n" + tttt.strMsg
        //     tttt.txtMsg.textFlow = (new egret.HtmlTextParser).parser(tttt.strMsg)
        // } catch (e) {
        //     tttt.strMsg = "<font color='#bbff00'>[护肝助手]</font><font color='#FFFFFF'>" + logStr + "</font>\n" + tttt.strMsg
        //     let TextParser = document.querySelector("iframe").contentWindow.egret.HtmlTextParser
        //     tttt.txtMsg.textFlow = (new TextParser).parser(tttt.strMsg)
        // }
    }



    async function fightQiu() {
        for (let index = 1; index <= 120; index++) {
            var FirgetTime
            var Pet
            try {
                FirgetTime = document.querySelector("iframe").contentWindow.UserManager.getInstance().userInfo.defaultTeam[0]
                Pet = document.querySelector("iframe").contentWindow.PetManager.getInstance().getPetInfoByGetTime(FirgetTime)
            } catch (e) {
                FirgetTime = UserManager.getInstance().userInfo.defaultTeam[0]
                Pet = PetManager.getInstance().getPetInfoByGetTime(FirgetTime)
            }


            writeLog(Pet.nick + "进入战斗")
            //17  进入战斗
            await sendMsg(1172, {
                "levelId": 2,
                "battleType": 3
            })
            while (1) {
                if (bossStatus == true) {

                    bossStatus = false
                    break
                }
                await wait(100)
            }
            await sendSkillToSuccess(Pet.skills[0])
            writeLog("第" + index + "战斗顺利!")
        }




    }

    async function sendSkillToSuccess(nowSkillId) {
        await sendMsg(1042, {
            "groupId": "",
            "battleType": 0
        })
        await wait(100)

        await sendMsg(1045, {
            "opType": 5,
            "data": null,
            "groupId": ""
        })
        doneRound = false
        let CountBattle = 0
        while (1) {
            await wait(100)
            await sendMsg(1057, {
                "groupId": ""
            })
            CountBattle++
            writeLog("释放第" + CountBattle + "次技能")
            await sendMsg(1045, {
                "opType": 1,
                "data": {
                    "skillID": nowSkillId
                },
                "groupId": ""
            })

            let oldTime = new Date().getTime()
            while (1) {
                if ((new Date().getTime() - oldTime) / 1000 < 2) {
                    if (doneRound == true) {
                        doneRound = false
                        await wait(50)
                        return
                    } else {
                        await wait(50)
                    }
                } else {
                    break
                }
            }


            await wait(50)
        }

    }


    function showToast(txtMsg) {
        try {
            document.querySelector("iframe").contentWindow.MFC.bubbleAlert.showAlert(txtMsg)
        } catch (e) {
            MFC.bubbleAlert.showAlert(txtMsg)
        }

    }

    function showNotice(txtMsg) {
        try {
            document.querySelector("iframe").contentWindow.MFC.alert.showSimpleTxt(txtMsg)   //普通提示
        } catch (e) {
            MFC.alert.showSimpleTxt(txtMsg)   //普通提示
        }
    }

    async function getObjs(mapId, viewId, levelId) {
        await sendMsg(279, {})
        CmdArr = []

        await sendMsg(4354, { mapId: mapId, viewId: viewId })
        CmdArr = []


        await sendMsg(1172, {
            "levelId": levelId,
            "battleType": 3
        });
        CmdArr = []


        await sendMsg(1045, {
            "data": "",
            "groupId": "",
            "battleType": 5
        });
        CmdArr = []

        await sendMsg(1057, {
            "groupId": "",
        });
        CmdArr = []


        await sendMsg(1045, {
            opType: 1,
            data: {
                skillID: skillID,
            },
            groupId: "",
        });
        CmdArr = []



        console.log("打完了！")
    }


    function sendMsg(nowCmd, nowBody) {
        return new Promise((resolve) => {
            if (document.querySelector("iframe").contentWindow.GlobalSocket == undefined) {
                GlobalSocket.PROTOCOL_SOCKET.send(
                    nowCmd,
                    nowBody
                );
            } else {
                document.querySelector("iframe").contentWindow.GlobalSocket.PROTOCOL_SOCKET.send(
                    nowCmd,
                    nowBody
                );
            }


            // if(stopStatus == true){
            //     writeLog("顺利停止！")
            //     stopStatus = false
            //     let p = 0/0
            // }


            console.log({ "指令": nowCmd, "发送体": nowBody });

            async function checkCmd() {
                while (true) {
                    await new Promise((resolve) => setTimeout(resolve, 1));

                    let keysArr = []
                    CmdArr.forEach(item => {
                        keysArr.push(parseInt(Object.keys(item)[0]))
                    })
                    if (keysArr.indexOf(nowCmd) != -1) {
                        console.info("接收到了信息！" + nowCmd)

                        resolve();
                        break;
                    }
                }
            }

            checkCmd().then(resolve);
        });
    }



    function getSelectedOptionsPVP() {
        var radios = document.getElementsByName('optionPVP');
        var selectedOptions = [];
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                selectedOptions.push(radios[i].value);
            }
        }
        return selectedOptions;
    }

    function getSelectedOptions() {
        var radios = document.getElementsByName('option');
        var selectedOptions = [];
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                selectedOptions.push(radios[i].value);
            }
        }
        return selectedOptions;
    }
    function getRandomIndex(array) {
        var randomIndex = Math.floor(Math.random() * array.length);
        return randomIndex;
    }



    async function catchPet() {
        let opt = getSelectedOptions()[0]
        try {
            var cap = document.querySelector("iframe").contentWindow.ItemManager.getInstance().getItemNumById(opt)
        } catch (e) {
            var cap = ItemManager.getInstance().getItemNumById(opt)
        }
        let nowStr = opt == "4001" ? "普通" : opt == "4002" ? "中级" : opt == "4003" ? "高级" : "";
        writeLog(`目前${nowStr}胶囊剩余数量:` + cap);
        try {
            let randomIndex = getRandomIndex(document.querySelector("iframe").contentWindow.MFC.mapManager._bossManager.bossDataList)
            var levelId = document.querySelector("iframe").contentWindow.MFC.mapManager._bossManager.bossDataList[randomIndex].id


        } catch (e) {
            let randomIndex = getRandomIndex(MFC.mapManager._bossManager.bossDataList)
            var levelId = MFC.mapManager._bossManager.bossDataList[randomIndex].id

        }
        await sendMsg(1172, {
            "levelId": levelId,
            "battleType": 3
        })
        while (1) {
            if (bossStatus == true) {
                bossStatus = false
                break
            }
            await wait(100)
        }


        //首发技能
        var Pet
        var FirgetTime
        try {
            FirgetTime = document.querySelector("iframe").contentWindow.UserManager.getInstance().userInfo.defaultTeam[0]
            Pet = document.querySelector("iframe").contentWindow.PetManager.getInstance().getPetInfoByGetTime(FirgetTime)
        } catch (e) {
            FirgetTime = UserManager.getInstance().userInfo.defaultTeam[0]
            Pet = PetManager.getInstance().getPetInfoByGetTime(FirgetTime)
        }
        await sendSkillAndCatch(Pet.skills[0], parseInt(opt))
    }


    async function sendSkillAndCatch(nowSkillId, capID) {
        await sendMsg(1042, {
            "groupId": "",
            "battleType": 0
        })
        await wait(100)
        await sendMsg(1045, {
            "opType": 5,
            "data": null,
            "groupId": ""
        })
        await wait(100)
        while (1) {
            if (nextRound == true) {
                console.log("$$$$$$$$$$$$$$本回合结束$$$$$$$$$$$$$$")
                writeLog("顺利进入对局！")
                nextRound = false
                break
            } else {
                await wait(50)
            }
        }
        await wait(100)

        while (1) {
            await sendMsg(1057, {
                "groupId": ""
            })

            await sendMsg(1045, {
                "opType": 1,
                "data": {
                    "skillID": nowSkillId
                },
                "groupId": ""
            })

            while (1) {
                if (nextRound == true) {
                    console.log("$$$$$$$$$$$$$$本回合结束$$$$$$$$$$$$$$")
                    writeLog("继续释放技能！")
                    nextRound = false
                    break
                } else {
                    await wait(50)
                }
            }
            //等待1s  等待288结算的出现
            let oldTime = new Date().getTime()
            while (1) {
                if ((new Date().getTime() - oldTime) / 1000 < 2) {
                    if (doneRound == true) {
                        console.log("##############战斗结束##############")
                        doneRound = false
                        await wait(50)
                        return
                    } else {
                        await wait(50)
                    }
                } else {
                    break
                }
            }


            var haveHp = PetMsgDetail.result.playerInfos[1].petInfos[0].crtHp
            writeLog("野怪还剩余hp：" + haveHp)
            if (haveHp <= 1) {
                writeLog("开始捕捉！")
                await wait(1000)
                await sendMsg(1057, {
                    "groupId": ""
                })
                await wait(1000)
                break
            }
        }
        // doneRound = false;
        let useC = 0
        // nextRound = false
        changePet = ""
        while (1) {
            useC++
            writeLog("丢出第" + useC + "次胶囊捕捉~")
            await sendMsg(1045, {
                "opType": 3,
                "data": {
                    "itemID": capID
                },
                "groupId": ""
            })
            if (useC >= 5) {
                writeLog("5次还没捕捉到，跑路了")
                await sendMsg(8201, {})
                await sendMsg(8209, {})
                //逃跑
                await sendMsg(303, {})
                return

            }

            // while (1) {
            //     if (changePet != "") {
            //         if (JSON.stringify(changePet).indexOf("getTime") != -1) {
            //             writeLog("捕捉成功:" + changePet.changePetList[0].nick + " 天赋: " + changePet.changePetList[0].talent)
            //             await wait(2000)
            //             return
            //         } else {
            //             writeLog("捕捉失败")
            //             await wait(1000)
            //             break
            //         }
            //     } else {
            //         await wait(1000)
            //     }
            // }
            // changePet = ""
            await wait(200)
            while (1) {
                if (nextRound == true) {
                    console.log("$$$$$$$$$$$$$$捕捉，本回合结束$$$$$$$$$$$$$$")
                    nextRound = false
                    break
                } else {
                    await wait(100)
                    console.log("等待捕捉回合结束")
                }
            }
            while (1) {
                if (捕捉情况 != "") {
                    if (JSON.stringify(捕捉情况).indexOf("getTime") != -1) {
                        catchCount++
                        await wait(2000)
                        return
                    } else {
                        writeLog("捕捉失败")
                        await wait(1000)
                        break
                    }
                } else {
                    await wait(1000)
                }
            }
            捕捉情况 = ""

            //等待1s  等待288结算的出现
            let oldTime = new Date().getTime()
            while (1) {
                if ((new Date().getTime() - oldTime) / 1000 < 2) {
                    if (doneRound == true) {
                        console.log("##############战斗结束##############")
                        doneRound = false
                        await wait(50)
                        return
                    } else {
                        await wait(50)
                    }
                } else {
                    break
                }
            }

            await wait(200)
            await sendMsg(1057, {
                "groupId": ""
            })
            await wait(200)

            // await sendMsg(1057, {
            //     "groupId": ""
            // })

        }

    }

    async function ptbattleF() {
        if (rewrite == 0) {
            showToast("请先开启监听！宝贝")
            return
        }
        showNotice("1.艾尔伊洛带幻化利刃增幅技能放一号位\n2.蒙多带光闪击增幅技能放二号位\n3.奥斯卡带圣灵击放三号位")
        //首次读取层数
        await sendMsg(1184,
            {}
        )
        while (1) {
            await wait(100)
            await sendMsg(1184,
                {}
            )
            writeLog("当前层数:" + (parseInt(ptfloorContent.fragments.split("_")[1]) - 11))
            if (parseInt(ptfloorContent.fragments.split("_")[1]) >= 42) {
                writeLog("顺利通关！，脚本结束")
                await wait(200)
                break
            }
            if (parseInt(ptfloorContent.fragments.split("_")[1]) < 22) {
                await sendMsg(1184,
                    {}
                )
                writeLog("当前层数:" + ptfloorContent.fragments.split("_")[1])
                await sendMsg(1185,
                    {
                        "idList": [
                            0
                        ]
                    })
                while (1) {
                    if (bossStatus == true) {
                        console.log("顺利加载战斗资源")
                        bossStatus = false
                        break
                    } else {
                        await wait(50)
                    }
                }
                await sendMsg(1042, {
                    "groupId": "",
                    "battleType": 0
                })
                await sendMsg(1045, {
                    "opType": 5,
                    "data": null,
                    "groupId": ""
                })
                await sendMsg(1057, {
                    "groupId": "",
                });
                writeLog(`释放幻化利刃`)
                await sendMsg(1045, {
                    "opType": 1,
                    "data": {
                        "skillID": 100377
                        //10864
                        //100377
                    },
                    "groupId": ""
                })
                await wait(100)
                await sendMsg(8201, {})
                await sendMsg(8209, {})
                //逃跑
                await sendMsg(303, {})
                await wait(50)
                //顺利释放一次
                console.log("顺利释放一次")
            }
            if (parseInt(ptfloorContent.fragments.split("_")[1]) >= 22) {
                var Ha = ""
                if (Buff == true) {
                    Ha = true

                }
                if (Ha == true) {
                    writeLog("重生逃跑")
                    await sendMsg(1185,
                        {
                            "idList": [
                                2
                            ]
                        })
                    while (1) {
                        if (bossStatus == true) {
                            console.log("顺利加载战斗资源")
                            bossStatus = false
                            break
                        } else {
                            await wait(50)
                        }
                    }
                    await sendMsg(1042, {
                        "groupId": "",
                        "battleType": 0
                    })
                    await sendMsg(1045, {
                        "opType": 5,
                        "data": null,
                        "groupId": ""
                    })
                    await sendMsg(1057, {
                        "groupId": "",
                    })
                    writeLog(`释放圣灵击`)
                    await sendMsg(1045, {
                        "opType": 1,
                        "data": {
                            "skillID": 14861
                            //100436
                            //14861
                        },
                        "groupId": ""
                    })
                    await sendMsg(8201, {})
                    await sendMsg(8209, {})
                    //逃跑
                    await sendMsg(303, {})
                    await wait(50)
                    Ha = ""
                    //顺利释放一次
                    console.log("顺利释放一次")
                }
                else {
                    await sendMsg(1184,
                        {}
                    )
                    await sendMsg(1185,
                        {
                            "idList": [
                                1
                            ]
                        })
                    while (1) {
                        if (bossStatus == true) {
                            console.log("顺利加载战斗资源")
                            bossStatus = false
                            break
                        } else {
                            await wait(50)
                        }
                    }
                    await sendMsg(1042, {
                        "groupId": "",
                        "battleType": 0
                    })
                    await sendMsg(1045, {
                        "opType": 5,
                        "data": null,
                        "groupId": ""
                    })
                    await sendMsg(1057, {
                        "groupId": "",
                    });
                    writeLog(`释放光闪击`)
                    await sendMsg(1045, {
                        "opType": 1,
                        "data": {
                            "skillID": 100023
                        },
                        "groupId": ""
                    })
                    await wait(100)
                    await sendMsg(8201, {})
                    await sendMsg(8209, {})
                    //逃跑
                    await sendMsg(303, {})
                    await wait(50)
                    //顺利释放一次
                    console.log("顺利释放一次")
                }
            }
        }
    }

    async function battleF() {
        var doneKing = 0
        while (1) {
            await sendMsg(12496,
                {
                    "type": 2,
                    "petList": [],
                    "idList": [],
                    "saveType": 0
                }
            )
            while (1) {
                if (floorContent != "") {
                    if (doneKing == 1 && (floorContent.fragments.split("_")[1] == 0)) {
                        writeLog("顺利击毙教皇！，脚本结束")
                        return
                    }
                    if (floorContent.fragments.split("_")[1] == "15") {
                        writeLog("当前层数:13,到教皇了")
                        doneKing = 1
                    } else {
                        writeLog("当前层数:" + floorContent.fragments.split("_")[1])
                    }
                    floorContent = ""
                    break
                } else {
                    await wait(200)
                }
            }
            floorContent = ""
            if (doneKing == 0) {
                await sendMsg(12496,
                    {
                        "type": 3,
                        "petList": [],
                        "idList": [
                            0
                        ],
                        "saveType": 0
                    }
                )
            } else {
                await sendMsg(12496,
                    {
                        "type": 3,
                        "petList": [],
                        "idList": [
                            1
                        ],
                        "saveType": 0
                    }
                )
            }

            writeLog("开始进入战斗")
            while (1) {
                if (bossStatus == true) {
                    console.log("顺利加载战斗资源")
                    bossStatus = false
                    break
                } else {
                    await wait(50)
                }
            }


            await sendMsg(1042, {
                "groupId": "",
                "battleType": 0
            })


            await sendMsg(1045, {
                "opType": 5,
                "data": null,
                "groupId": ""
            })
            await sendMsg(1057, {
                "groupId": "",
            });


            if (doneKing == 0) {
                writeLog(`释放蒙多光闪击`)
                await sendMsg(1045, {
                    "opType": 1,
                    "data": {
                        "skillID": 100023
                    },
                    "groupId": ""
                })
            } else {
                writeLog(`释放雷伊雷神天明闪`)
                await sendMsg(1045, {
                    "opType": 1,
                    "data": {
                        "skillID": 10825
                    },
                    "groupId": ""
                })
            }


            await wait(100)
            await sendMsg(8201, {})


            await sendMsg(8209, {})
            //逃跑
            await sendMsg(303, {})


            await wait(300)

            //顺利释放一次
            console.log("顺利释放一次")

            // while (1) {
            //     if (floorContent != "") {
            //         // writeLog("当前层数:" + floorContent.fragments.split("_")[1])
            //         floorContent = ""
            //         break
            //     }else {
            //         await wait(50)
            //     }
            // }
        }
    }



    async function jingji(){
        let PvpC = 0
        while (1) {
            while (1) {
                await wait(100)
                var allTouchs = getTouchs("_source", "arena_img_go_png")
                if (allTouchs) {
                    touchBtn(allTouchs[2])
                    await wait(1000)
                    writeLog("前往竞技")
                }
                var allTouchs = getTouchs("_source", "arena_06_png")
                if (allTouchs) {
                    //到达匹配界面
                    writeLog("到达竞技界面")
                    break
                } else {
                    try {
                        document.querySelector("iframe").contentWindow.MFC.moduleManager.openModule(249)
                    } catch (error) {
                        MFC.moduleManager.openModule(249)
                    }
                    await wait(300)
                }
                var allTouchs = getTouchs("_source", "arena_top_fight_img_btn_pipei_png")
                if (allTouchs) {
                    var nowUis = await findUIs("_source", "arena_top_fight_img_close_png")
                    writeLog("关闭巅峰窗口")
                    touchBtn(nowUis[0])
                    await wait(300)
                }
                var allTouchs = getTouchs("_source", "arena_77_png")
                if (allTouchs) {
                    var nowUis = await findUIs("_source", "close_button_nor_png")
                    writeLog("关闭乱斗窗口")
                    touchBtn(nowUis[0].$parent)
                    await wait(300)
                }
            }
            writeLog("点击竞技匹配")
            await wait(800)
            var nowUis = await findUIs("_source", "arena_06_png")
            await wait(800)
            writeLog("响应竞技匹配")
            touchBtn(nowUis[0].$parent)

            var nowUis = await findUIs("_source", "toolbar_auto_battle_off_png")
            writeLog("开始自动战斗")
            await wait(800)
            touchBtn(nowUis[0])
            logicDoneRound = false
            while (1) {
                await wait(200)
                if (logicDoneRound) {
                    break
                }
                try {
                    if (roundContent.result.roundNum >= 10) {
                        writeLog("到达十回合 发起投降")
                        //! !!发起投降
                        try {
                            document.querySelector("iframe").contentWindow.MFC.battleManager.surrenderPvp({
                                "type": 10,
                                "cmd": null,
                                "mapID": 1001
                            })
                        } catch (e) {
                            MFC.battleManager.surrenderPvp({
                                "type": 10,
                                "cmd": null,
                                "mapID": 1001
                            })
                        }
                        break
                    }
                } catch (e) {
                }
            }
            writeLog("竞技战斗结束")
            PvpC++
            writeLog("PVP 竞技: " + PvpC + "次")
            while (1) {
                await wait(900)
                let clickx1 = nnnn.touch.stage.$screen.stage.$stageWidth / 3
                let clicky1 = nnnn.touch.stage.$screen.stage.$stageHeight / 3
                nnnn.touch.onTouchBegin(clickx1, clicky1, 0); nnnn.touch.onTouchEnd(clickx1, clicky1, 0);
                var allTouchs = getTouchs("_source", "button_yellow_up_100_png")
                if (allTouchs) {
                    writeLog("升段提示,点击确认")
                    touchBtn(allTouchs[0])
                    await wait(1200)
                }
                var allTouchs = getTouchs("_source", "arena_06_png")
                if (allTouchs) {
                    break
                }
            }

        }
    }

    async function luandou() {
        let PvpC = 0
        while (1) {
            while (1) {
                await wait(100)
                var allTouchs = getTouchs("_source", "arena_img_go_png")
                if (allTouchs) {
                    touchBtn(allTouchs[0])
                    await wait(1000)
                    writeLog("前往乱斗")
                }
                var allTouchs = getTouchs("_source", "arena_77_png")
                if (allTouchs) {
                    //到达匹配界面
                    writeLog("到达乱斗界面")
                    break
                } else {
                    try {
                        document.querySelector("iframe").contentWindow.MFC.moduleManager.openModule(249)
                    } catch (error) {
                        MFC.moduleManager.openModule(249)
                    }
                    await wait(300)
                }
                var allTouchs = getTouchs("_source", "arena_top_fight_img_btn_pipei_png")
                if (allTouchs) {
                    var nowUis = await findUIs("_source", "arena_top_fight_img_close_png")
                    writeLog("关闭巅峰窗口")
                    touchBtn(nowUis[0])
                    await wait(300)
                }
                var allTouchs = getTouchs("_source", "arena_06_png")
                if (allTouchs) {
                    var nowUis = await findUIs("_source", "close_button_nor_png")
                    writeLog("关闭竞技窗口")
                    touchBtn(nowUis[0].$parent)
                    await wait(300)
                }
            }
            writeLog("点击乱斗匹配")
            await wait(800)
            var nowUis = await findUIs("_source", "arena_77_png")
            await wait(800)
            writeLog("响应乱斗匹配")
            touchBtn(nowUis[0].$parent)

            var nowUis = await findUIs("_source", "toolbar_auto_battle_off_png")
            writeLog("开始自动战斗")
            await wait(800)
            touchBtn(nowUis[0])
            logicDoneRound = false
            while (1) {
                await wait(200)
                if (logicDoneRound) {
                    break
                }
                try {
                    if (roundContent.result.roundNum >= 10) {
                        writeLog("到达十回合 发起投降")
                        //! !!发起投降
                        try {
                            document.querySelector("iframe").contentWindow.MFC.battleManager.surrenderPvp({
                                "type": 10,
                                "cmd": null,
                                "mapID": 1001
                            })
                        } catch (e) {
                            MFC.battleManager.surrenderPvp({
                                "type": 10,
                                "cmd": null,
                                "mapID": 1001
                            })
                        }
                        break
                    }
                } catch (e) {
                }
            }
            writeLog("大乱斗战斗结束")
            PvpC++
            writeLog("PVP 乱斗: " + PvpC + "次")
            while (1) {
                await wait(900)
                let clickx1 = nnnn.touch.stage.$screen.stage.$stageWidth / 3
                let clicky1 = nnnn.touch.stage.$screen.stage.$stageHeight / 3
                nnnn.touch.onTouchBegin(clickx1, clicky1, 0); nnnn.touch.onTouchEnd(clickx1, clicky1, 0);
                var allTouchs = getTouchs("_source", "button_yellow_up_100_png")
                if (allTouchs) {
                    writeLog("升段提示,点击确认")
                    touchBtn(allTouchs[0])
                    await wait(1200)
                }
                var allTouchs = getTouchs("_source", "arena_77_png")
                if (allTouchs) {
                    break
                }
            }

        }
    }





    async function dianfeng() {
        let PvpC = 0
        while (1) {
            while (1) {
                await wait(100)
                var allTouchs = getTouchs("_source", "arena_img_go_png")
                if (allTouchs) {
                    touchBtn(allTouchs[1])
                    await wait(1000)
                    writeLog("前往巅峰")
                }
                var allTouchs = getTouchs("_source", "arena_top_fight_img_btn_pipei_png")
                if (allTouchs) {
                    //到达匹配界面
                    writeLog("到达匹配界面")
                    break
                } else {
                    try {
                        document.querySelector("iframe").contentWindow.MFC.moduleManager.openModule(249)
                    } catch (error) {
                        MFC.moduleManager.openModule(249)
                    }
                    await wait(300)
                }
                var allTouchs = getTouchs("_source", "arena_77_png")
                if (allTouchs) {
                    var nowUis = await findUIs("_source", "close_button_nor_png")
                    showAllMsg("关闭乱斗窗口")
                    touchBtn(nowUis[0].$parent)
                    await wait(300)
                }
                var allTouchs = getTouchs("_source", "arena_06_png")
                if (allTouchs) {
                    var nowUis = await findUIs("_source", "close_button_nor_png")
                    showAllMsg("关闭竞技窗口")
                    touchBtn(nowUis[0].$parent)
                    await wait(300)
                }
            }

            var nowUis = await findUIs("_groupName", "rbg_top_switch")
            writeLog("点击狂野模式")
            touchBtn(nowUis[2])
            await wait(800)
            var nowUis = await findUIs("_source", "arena_top_fight_img_btn_pipei_png")
            await wait(800)
            touchBtn(nowUis[0])
            var nowUis = await findUIs("_source", "toolbar_auto_battle_off_png")
            writeLog("开始自动战斗")
            await wait(800)
            touchBtn(nowUis[0])
            writeLog("等待战斗结束")
            logicDoneRound = false
            while (1) {
                await wait(200)
                if (logicDoneRound) {
                    break
                }
                try {
                    if (roundContent.result.roundNum >= 10) {
                        writeLog("到达十回合 发起投降")
                        //! !!发起投降
                        try {
                            document.querySelector("iframe").contentWindow.MFC.battleManager.surrenderPvp({
                                "type": 10,
                                "cmd": null,
                                "mapID": 1001
                            })
                        } catch (e) {
                            MFC.battleManager.surrenderPvp({
                                "type": 10,
                                "cmd": null,
                                "mapID": 1001
                            })
                        }
                        break
                    }
                } catch (e) {
                }
            }
            writeLog("巅峰战斗结束")
            PvpC++
            writeLog("PVP 巅峰: " + PvpC + "次")
            await wait(1400)
            while (1) {
                await wait(900)
                let clickx1 = nnnn.touch.stage.$screen.stage.$stageWidth / 2
                let clicky1 = nnnn.touch.stage.$screen.stage.$stageHeight / 2
                nnnn.touch.onTouchBegin(clickx1, clicky1, 0); nnnn.touch.onTouchEnd(clickx1, clicky1, 0);
                var allTouchs = getTouchs("_source", "button_yellow_up_100_png")
                if (allTouchs) {
                    writeLog("升段提示,点击确认")
                    touchBtn(allTouchs[0])
                    await wait(1200)
                }
                var allTouchs = getTouchs("_source", "arena_top_fight_img_btn_pipei_png")
                if (allTouchs) {
                    break
                }
            }
        }
    }


    async function findUIs(attr, pngStr) {
        while (1) {
            await wait(100)
            var allTouchs = getTouchs(attr, pngStr)
            if (allTouchs) {
                return allTouchs
            }
        }
    }



    function getTouchs(attr, btnName) {
        var uiObjects = [];
        function findUIObjects(container) {
            var children = container.$children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                try {
                    if (child instanceof document.querySelector("iframe").contentWindow.egret.DisplayObjectContainer) {
                        uiObjects.push(child);
                        findUIObjects(child);
                    } else {
                        // 这里可以根据需要判断其他类型的UI对象，将其加入uiObjects数组中
                    }
                } catch (error) {
                    if (child instanceof egret.DisplayObjectContainer) {
                        uiObjects.push(child);
                        findUIObjects(child);
                    } else {
                        // 这里可以根据需要判断其他类型的UI对象，将其加入uiObjects数组中
                    }
                }
            }
        }
        // 假设this.stage为舞台对象
        findUIObjects(sta);
        //!遍历所有 uiObjects
        var goalUis = []
        for (let index = 0; index < uiObjects.length; index++) {
            let element = uiObjects[index];
            if (element.$children) {
                let nowC = element.$children
                nowC.forEach((item) => {
                    try {
                        if (item[attr + ""]) {
                            if (item[attr + ""] == btnName) {
                                goalUis.push(item)
                            }
                        }
                    } catch (error) {
                    }
                })
            }
        }
        if (goalUis.length == 0) {
            return false
        }
        return goalUis
    }


    function touchBtn(goalUi) {
        try {
            document.querySelector("iframe").contentWindow.egret.TouchEvent.dispatchTouchEvent(goalUi, document.querySelector("iframe").contentWindow.egret.TouchEvent.TOUCH_BEGIN, !0, !0, 111, 111, 0, !0)
            document.querySelector("iframe").contentWindow.egret.TouchEvent.dispatchTouchEvent(goalUi, document.querySelector("iframe").contentWindow.egret.TouchEvent.TOUCH_TAP, !0, !0, 111, 111, 0, !0)
            document.querySelector("iframe").contentWindow.egret.TouchEvent.dispatchTouchEvent(goalUi, document.querySelector("iframe").contentWindow.egret.TouchEvent.TOUCH_END, !0, !0, 111, 111, 0, !0)
        } catch (e) {
            egret.TouchEvent.dispatchTouchEvent(goalUi, egret.TouchEvent.TOUCH_BEGIN, !0, !0, 111, 111, 0, !0)
            egret.TouchEvent.dispatchTouchEvent(goalUi, egret.TouchEvent.TOUCH_TAP, !0, !0, 111, 111, 0, !0)
            egret.TouchEvent.dispatchTouchEvent(goalUi, egret.TouchEvent.TOUCH_END, !0, !0, 111, 111, 0, !0)
        }
    }


    function fixMsg() {
        // 保存原函数
        var originalCreateMsg;
        try {
            var socketPrototype = document.querySelector("iframe").contentWindow.SocketSeqMsgs.prototype;
            if (socketPrototype.createMsg === undefined) {
                originalCreateMsg = SocketSeqMsgs.prototype.createMsg;
                socketPrototype = SocketSeqMsgs.prototype;
            } else {
                originalCreateMsg = socketPrototype.createMsg;
            }
        } catch (e) {
            originalCreateMsg = SocketSeqMsgs.prototype.createMsg;
            socketPrototype = SocketSeqMsgs.prototype;
        }







        try {
            var originalGetLocation
            var WebTouchPrototype = document.querySelector("iframe").contentWindow.egret.web.WebTouchHandler.prototype
            originalGetLocation = WebTouchPrototype.getLocation;
            WebTouchPrototype.getLocation = function (nowT) {
                window.globalThis.nnnn = this
                // 在这里可以修改constructor函数的执行过程，加入你自己的逻辑
                var result = originalGetLocation.call(this, nowT); // 调用原始的 getLocation 函数，并获取返回值
                return result; // 返回原始 getLocation 函数的返回值
            };
        } catch (e) {
            var originalGetLocation
            var WebTouchPrototype = egret.web.WebTouchHandler.prototype
            originalGetLocation = WebTouchPrototype.getLocation;
            WebTouchPrototype.getLocation = function (nowT) {
                window.global.nnnn = this
                // 在这里可以修改constructor函数的执行过程，加入你自己的逻辑
                var result = originalGetLocation.call(this, nowT); // 调用原始的 getLocation 函数，并获取返回值
                return result; // 返回原始 getLocation 函数的返回值
            };
        }







        var originalCreateMsg;
        try {
            var originalTarget
            var sysTouchPrototype = document.querySelector("iframe").contentWindow.egret.sys.TouchHandler.prototype
            originalTarget = sysTouchPrototype.findTarget;
            sysTouchPrototype.findTarget = function (t, e) {
                window.globalThis.sta = this.stage
                // 在这里可以修改constructor函数的执行过程，加入你自己的逻辑
                var result = originalTarget.call(this, t, e); // 调用原始的 getLocation 函数，并获取返回值
                return result; // 返回原始 getLocation 函数的返回值
            };
        } catch (e) {
            var originalTarget
            var sysTouchPrototype = egret.sys.TouchHandler.prototype
            originalTarget = sysTouchPrototype.findTarget;
            sysTouchPrototype.findTarget = function (t, e) {
                window.global.sta = this.stage
                // 在这里可以修改constructor函数的执行过程，加入你自己的逻辑
                var result = originalTarget.call(this, t, e); // 调用原始的 getLocation 函数，并获取返回值
                return result; // 返回原始 getLocation 函数的返回值
            };
        }


        socketPrototype.createMsg = function (t, e) {
            originalCreateMsg.call(this, t, e);
            var s = this._tmpBytesArray[this._tmpBytesArray.length - 1];
            var raw = s.raw;
            var cmd = parseInt((s.header.cmd + "").trim());
            CmdArr.push({ [cmd]: raw });
            // console.log("=======");
            // console.log('接收cmd:', cmd);
            // console.log('raw:', raw);
            try {
                if (cmd == 1056) {
                    roundContent = JSON.parse(raw);
                    console.log("本回合结束")
                    nextRound = true;
                    PetMsgDetail = JSON.parse(raw);
                    let result = JSON.parse(raw).result.result
                    // 0未结束战斗 1我方获胜 2对方获胜
                    battleResult = result
                    console.error("对战结果:" + battleResult)
                    if (result) {
                        logicDoneRound = true
                    } else {
                        logicDoneRound = false
                    }
                }
                if (cmd == 1049) {
                    console.log("顺利加载进入战斗！")
                    bossStatus = true;
                }
                if (raw.indexOf("defaultTeam") != -1) {
                    myTeam = JSON.parse(raw).value;
                    console.log(myTeam);
                    // writeLog("顺利获取精灵配置信息！")
                }
                if ((cmd == 1120) && (raw.indexOf("starMedal") != -1)) {
                    StartJson = JSON.parse(raw);
                }

                if (cmd == 12501) {
                    let arr = JSON.parse(raw).map
                    writeLog("蟠桃情况~")
                    arr.forEach(item => {
                        writeLog(item)
                    })
                }

                if (cmd == 12496 && (raw.indexOf("fragments") != -1)) {
                    floorContent = JSON.parse(raw);
                    if (raw.indexOf("10825") != -1) {
                        skillSecondId = 10825
                    }
                    if (raw.indexOf("100484") != -1) {
                        skillSecondId = 100484
                    }
                    if (raw.indexOf("12776") != -1) {
                        skillSecondId = 12776
                    }
                }


                if (cmd == 1056) {
                    const idValues = JSON.parse(raw).result.affects.map((item) => {
                        return item && item.id ? item.id : null;
                    });
                    const Number = 143;
                    if (idValues.includes(Number)) {
                        Buff = true;
                    }
                }
                if (cmd == 1184) {
                    ptfloorContent = JSON.parse(raw);
                    Buff = "";
                }

                if (cmd == 1044) {
                    捕捉ok = true;
                }
                if (cmd == 288) {
                    changePet = JSON.parse(raw);
                }

                if (cmd == 769 || cmd == 513) {
                    // if (JSON.parse(raw).subCmd == 1) {
                    // console.log(JSON.parse(raw))
                    捕捉情况 = JSON.parse(raw);
                    // }
                    if (JSON.parse(raw).subCmd == 1) {
                        writeLog("捕捉成功:" + JSON.parse(raw).pet.nick + " 天赋: " + JSON.parse(raw).pet.talent)
                    }
                }
                if (cmd == 1109) {
                    console.log("战斗结束")
                    doneRound = true;
                    doneBattleMsg = JSON.parse(raw);

                }
            } catch (e) { }

            // console.log("=======");
        };






        // //重写图鉴监听方法
        // var PetView
        // if (document.querySelector("iframe").contentWindow.SocketSeqMsgs == undefined) {
        //     PetView = petIllustrated.PetIllustrated.prototype.updatePetAttrView;
        //     // 重写updatePetAttrView方法
        //     petIllustrated.PetIllustrated.prototype.updatePetAttrView = function (e) {
        //         console.log(e)
        //         // 执行原有的createMsg方法e
        //         PetView.call(this, e);

        //     }
        // } else {
        //     PetView = document.querySelector("iframe").contentWindow.petIllustrated.PetIllustrated.prototype.updatePetAttrView;
        //     // 重写updatePetAttrView方法
        //     document.querySelector("iframe").contentWindow.petIllustrated.PetIllustrated.prototype.updatePetAttrView = function (e) {
        //         console.log(e)
        //         // 执行原有的createMsg方法e
        //         PetView.call(this, e);

        //     }
        // }

    }



    function backMSg() {
        // 保存原函数
        if (document.querySelector("iframe").contentWindow.SocketSeqMsgs == undefined) {
            var originalCreateMsg = SocketSeqMsgs.prototype.createMsg;
            SocketSeqMsgs.prototype.createMsg = function (t, e) {
                // 执行原有的createMsg方法
                originalCreateMsg.call(this, t, e);

            }
        } else {
            var originalCreateMsg = document.querySelector("iframe").contentWindow.SocketSeqMsgs.prototype.createMsg;
            document.querySelector("iframe").contentWindow.SocketSeqMsgs.prototype.createMsg = function (t, e) {
                // 执行原有的createMsg方法
                originalCreateMsg.call(this, t, e);

            }
        }

    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    };

    function getCountByItemId(itemID) {
        let count
        try {
            count = ItemManager.getInstance().getItemNumById(itemID);
        } catch (e) {
            count = document.querySelector("iframe").contentWindow.ItemManager.getInstance().getItemNumById(itemID);
        }
        return count
    }


    function checkPet(skillList) {
        for (let index = 0; index < skillList.length; index++) {
            if (skillList[index].id == 100023) {
                skillStarId = "100023"
                return
            }
            if (skillList[index].id == 11022) {
                return
            }
        }
        skillStarId = skillList[0].id
    }


    //迷航
    async function starTrek() {
        if (rewrite == 0) {
            showToast("请先开启监听！宝贝")
            return
        }
        showNotice("如有不能正常运行。\n1.请确保魔焰和蒙多放到一号二号位置喔~~\n2.请确定魔焰猩猩是否带了绝命，蒙多是否带了光闪击\n3.请确保蒙多具有瞬杀特性\n4.只需要带这两只精灵即可")
        //首次读取技能
        await sendMsg(1120, {
            "type": 0
        })
        checkPet(StartJson.petList[0].useSkills)
        checkPet(StartJson.petList[1].useSkills)

        while (1) {
            await wait(100)
            await sendMsg(1120, {
                "type": 0
            })
            writeLog(`迷航进度: 第${parseInt(StartJson.levelId) + 1}关卡`)
            if (parseInt(StartJson.levelId) >= 15) {
                writeLog(`完成迷航，进行领取`)
                await wait(200)
                await sendMsg(1223, {})
                break
            }
            if ((parseInt(StartJson.levelId) + 1) > 8) {
                let skillList = StartJson.petList[0].useSkills
                for (let index = 0; index < skillList.length; index++) {
                    if (skillList[index].id == 11022) {
                        writeLog(`首发为蒙多，继续！`)
                        await sendMsg(1122, {
                            "petList": [
                                StartJson.petList[1].getTime,
                                StartJson.petList[0].getTime,
                                0,
                                0,
                                0,
                                0
                            ],
                            "attachBattleSkill": []
                        })
                        await sendMsg(1120, {
                            "type": 0
                        })
                    }

                }
            }

            //前8关卡
            if ((parseInt(StartJson.levelId) + 1) <= 8) {
                let skillList = StartJson.petList[0].useSkills
                for (let index = 0; index < skillList.length; index++) {
                    if (skillList[index].id == skillStarId) {
                        writeLog(`首发为魔焰，继续！`)
                        await sendMsg(1122, {
                            "petList": [
                                StartJson.petList[1].getTime,
                                StartJson.petList[0].getTime,
                                0,
                                0,
                                0,
                                0
                            ],
                            "attachBattleSkill": []
                        })
                        await sendMsg(1120, {
                            "type": 0
                        })
                    }
                }
            }

            //2.进入迷航关卡


            await sendMsg(1121, {
                "getTimeList": [
                    StartJson.petList[0].getTime,
                    StartJson.petList[1].getTime,
                    0,
                    0,
                    0,
                    0
                ]
            })
            while (1) {
                if (bossStatus == true) {

                    console.log("顺利加载战斗资源")
                    bossStatus = false
                    break
                } else {
                    await wait(50)
                }
            }


            await sendMsg(1042, {
                "groupId": "",
                "battleType": 0
            })


            await sendMsg(1045, {
                "opType": 5,
                "data": null,
                "groupId": ""
            })
            await sendMsg(1057, {
                "groupId": "",
            });


            if (parseInt(StartJson.levelId) + 1 <= 8) {
                writeLog(`释放绝命火焰`)
                await sendMsg(1045, {
                    "opType": 1,
                    "data": {
                        "skillID": 11022
                    },
                    "groupId": ""
                })

            } else {
                writeLog(`释放蒙多光闪击`)
                await sendMsg(1045, {
                    "opType": 1,
                    "data": {
                        "skillID": skillStarId
                    },
                    "groupId": ""
                })
            }
            await wait(100)




            await sendMsg(8201, {})


            await sendMsg(8209, {})
            //逃跑
            await sendMsg(303, {})


            await wait(50)

            //顺利释放一次
            console.log("顺利释放一次")
        }

    }





    //轮盘
    async function goPrize() {
        if (rewrite == 0) {
            showToast("请先开启监听！宝贝")
            return
        }
        //皮皮星轮盘     每次消耗5个
        let CountC = 0
        while (1) {
            var count = getCountByItemId(100014)  //获取物品id对应数量   光合能量
            if (count >= 5) {
                CountC++
                writeLog("皮皮星轮盘第" + CountC + "次")
                await wait(200)
                await sendMsg(8997, {
                    "levelId": 1,
                    "prizePool": 1
                })
            } else {
                writeLog("皮皮星轮盘清空!")
                break
            }
        }

        CountC = 0
        //海洋星2级轮盘    每次消耗2个  和  1个    1个
        while (1) {
            var count0 = getCountByItemId(100015);    //甲烷
            var count1 = getCountByItemId(100016);;    //青晶石
            var count2 = getCountByItemId(100017);    //黑曜石
            if (count0 >= 2 && count1 >= 1 && count2 >= 1) {
                CountC++
                writeLog("海洋星2级轮盘第" + CountC + "次")
                await wait(200)
                await sendMsg(8997, {
                    "levelId": 2,
                    "prizePool": 2
                })
            } else {
                writeLog("海洋星2级轮盘清空!")
                break
            }
        }


        CountC = 0
        //海洋星1级轮盘    每次消耗2个  和  1个
        while (1) {
            var count0 = getCountByItemId(100015);    //甲烷
            var count1 = getCountByItemId(100016);    //青晶石
            if (count0 >= 2 && count1 >= 1) {
                CountC++
                writeLog("海洋星1级轮盘第" + CountC + "次")
                await wait(200)
                await sendMsg(8997, {
                    "levelId": 2,
                    "prizePool": 1
                })
            } else {
                writeLog("海洋星1级轮盘清空!")
                break
            }
        }


        CountC = 0
        //火山星1轮盘    每次消耗1个  和  2个
        while (1) {
            var count0 = getCountByItemId(100029);    //甲烷
            var count1 = getCountByItemId(100030);    //青晶石
            if (count0 >= 1 && count1 >= 2) {
                CountC++
                writeLog("火山星1级轮盘第" + CountC + "次")
                await wait(200)
                await sendMsg(8997, {
                    "levelId": 3,
                    "prizePool": 1
                })
            } else {
                writeLog("火山星1级轮盘清空!")
                break
            }
        }


        CountC = 0
        //火山星2轮盘     每次消耗 1个
        while (1) {
            var count = getCountByItemId(100031);
            if (count >= 1) {
                CountC++
                writeLog("火山星2级轮盘第" + CountC + "次")
                await wait(200)
                await sendMsg(8997, {
                    "levelId": 3,
                    "prizePool": 2
                })
            } else {
                writeLog("火山星2级轮盘清空!")
                break
            }
        }


        CountC = 0
        //云霄1轮盘     每次消耗2个
        while (1) {
            var count = getCountByItemId(100076);     //空气结晶
            if (count >= 2) {
                CountC++
                writeLog("云霄星1级轮盘第" + CountC + "次")
                await wait(200)
                await sendMsg(8997, {
                    "levelId": 5,
                    "prizePool": 1
                })
            } else {
                writeLog("云霄星1级轮盘清空!")
                break
            }
        }


        CountC = 0
        //云霄2轮盘     每次消耗2个 1个
        while (1) {
            var count0 = getCountByItemId(100077);    //不息云壤
            var count1 = getCountByItemId(100078);   //幻影之羽
            if (count0 >= 2 && count1 >= 1) {
                CountC++
                writeLog("云霄星2级轮盘第" + CountC + "次")

                await wait(200)
                await sendMsg(8997, {
                    "levelId": 5,
                    "prizePool": 2
                })
            } else {
                writeLog("云霄星2级轮盘清空!")
                break
            }
        }


        CountC = 0
        //双子阿尔法星     每次消耗1个 1个
        while (1) {
            count0 = getCountByItemId(100191);
            count1 = getCountByItemId(100193);
            if (count0 >= 1 && count1 >= 1) {
                CountC++
                writeLog("双子阿尔法星1级轮盘第" + CountC + "次")
                await wait(200)
                await sendMsg(8997, {
                    "levelId": 6,
                    "prizePool": 1
                })
            } else {
                writeLog("双子阿尔法星1级轮盘清空!")
                break
            }
        }
        CountC = 0
        while (1) {
            count = getCountByItemId(100195);
            if (count >= 1) {
                CountC++
                writeLog("双子阿尔法星2级轮盘第" + CountC + "次")
                await wait(200)
                await sendMsg(8997, {
                    "levelId": 6,
                    "prizePool": 2
                })
            } else {
                writeLog("双子阿尔法星2级轮盘清空!")
                break
            }
        }



        CountC = 0
        //暗影星轮盘     每次消耗 2个
        while (1) {
            count = getCountByItemId(100313);
            if (count >= 2) {
                CountC++
                writeLog("暗影星1级轮盘第" + CountC + "次")
                await wait(200)
                await sendMsg(8997, {
                    "levelId": 8,
                    "prizePool": 1
                })
            } else {
                writeLog("暗影星1级轮盘清空!")
                break
            }
        }
        CountC = 0
        while (1) {
            count = getCountByItemId(100315);
            if (count >= 1) {
                CountC++
                writeLog("暗影星2级轮盘第" + CountC + "次")
                await wait(200)
                await sendMsg(8997, {
                    "levelId": 8,
                    "prizePool": 2
                })
            } else {
                writeLog("暗影星2级轮盘清空!")
                break
            }
        }








    }

    async function fightan() {
        if (rewrite == 0) {
            showToast("请先开启监听！宝贝");
            return
        }
        for (let g = 1; g <= 2; g++) {
            if (g == 2) {
                try {
                    var ziyuan1 = document.querySelector("iframe").contentWindow.ItemManager.getInstance().getItemNumById(100314)
                } catch (e) {
                    ziyuan1 = ItemManager.getInstance().getItemNumById(100314)
                }
                if (parseInt(ziyuan1) < 3) {
                    showToast("没有材料打不了！！")
                }
                else {
                    var FirgetTime
                    var Pet
                    try {
                        FirgetTime = document.querySelector("iframe").contentWindow.UserManager.getInstance().userInfo.defaultTeam[0]
                        Pet = document.querySelector("iframe").contentWindow.PetManager.getInstance().getPetInfoByGetTime(FirgetTime)
                    } catch (e) {
                        FirgetTime = UserManager.getInstance().userInfo.defaultTeam[0]
                        Pet = PetManager.getInstance().getPetInfoByGetTime(FirgetTime)
                    }
                    while (true) {
                        //查询轮盘
                        await sendMsg(1176, { planetId: 8 })
                        let reward = ""
                        CmdArr.forEach(item => {
                            if (parseInt(Object.keys(item)[0]) == 1176) {
                                reward = JSON.parse(item["1176"]).reward
                            }
                        })
                        if (reward["233"] < 3 || reward["233"] == undefined) {
                            await sendMsg(1172, {
                                "levelId": 233,
                                "battleType": 3
                            })
                            while (1) {
                                if (bossStatus == true) {
                                    bossStatus = false
                                    break
                                }
                                await wait(100)
                            }
                            await sendSkillToSuccess(Pet.skills[0])
                            writeLog("拜伦号" + (reward["233"] + 1) + "次奖励!")
                        } else {
                            writeLog("拜伦号②完成！")
                            CmdArr = []
                            break
                        }
                    }
                    await wait(200)
                }
            }
            if (g == 1) {
                try {
                    var ziyuan2 = document.querySelector("iframe").contentWindow.ItemManager.getInstance().getItemNumById(100194)
                } catch (e) {
                    ziyuan2 = ItemManager.getInstance().getItemNumById(100194)
                }
                if (parseInt(ziyuan2) < 3) {
                    showToast("没有材料打不了！！")
                }
                else {
                    try {
                        FirgetTime = document.querySelector("iframe").contentWindow.UserManager.getInstance().userInfo.defaultTeam[0]
                        Pet = document.querySelector("iframe").contentWindow.PetManager.getInstance().getPetInfoByGetTime(FirgetTime)
                    } catch (e) {
                        FirgetTime = UserManager.getInstance().userInfo.defaultTeam[0]
                        Pet = PetManager.getInstance().getPetInfoByGetTime(FirgetTime)
                    }
                    while (true) {
                        //查询轮盘
                        await sendMsg(1176, { planetId: 6 })
                        let reward = ""
                        CmdArr.forEach(item => {
                            if (parseInt(Object.keys(item)[0]) == 1176) {
                                reward = JSON.parse(item["1176"]).reward
                            }
                        })
                        if (reward["178"] < 3 || reward["178"] == undefined) {
                            await sendMsg(1172, {
                                "levelId": 178,
                                "battleType": 3
                            })
                            while (1) {
                                if (bossStatus == true) {
                                    bossStatus = false
                                    break
                                }
                                await wait(100)
                            }
                            await sendSkillToSuccess(Pet.skills[0])
                            writeLog("双子阿尔法星②" + (reward["178"] + 1) + "次奖励!")
                        } else {
                            writeLog("双子阿尔法星②完成！")
                            CmdArr = []
                            break
                        }
                    }
                    await wait(200)
                }
            }
        }
    }
    async function getResource() {
        if (rewrite == 0) {
            showToast("请先开启监听！宝贝")
            return
        }
        for (let index = 0; index <= 4; index++) {
            await wait(200)
            await sendMsg(9147, { id: 1 })  //黄晶矿
        }
        for (let index = 0; index <= 4; index++) {
            await wait(200)
            await sendMsg(9147, { id: 2 })  //黄晶矿
        }
        for (let index = 0; index <= 4; index++) {
            await wait(200)
            await sendMsg(9147, { id: 3 })  //黄晶矿
        }
        writeLog("黄晶矿采集完成！！")
        for (let index = 0; index <= 9; index++) {
            await wait(200)
            await sendMsg(9147, { id: 34 }) //砂金石
        }
        writeLog("砂金石采集完成！！")
        for (let index = 0; index <= 1; index++) {
            await wait(200)
            await sendMsg(9147, { id: 4 })    //甲烷燃气
        }
        for (let index = 0; index <= 1; index++) {
            await wait(200)
            await sendMsg(9147, { id: 5 })    //甲烷燃气
        }
        for (let index = 0; index <= 1; index++) {
            await wait(200)
            await sendMsg(9147, { id: 6 })    //甲烷燃气
        }
        writeLog("甲烷燃气采集完成！！")
        for (let index = 0; index <= 2; index++) {
            await wait(200)
            await sendMsg(9147, { id: 7 })
        }
        writeLog("蘑菇结晶采集完成！！")
        for (let index = 0; index <= 0; index++) {
            await wait(200)
            await sendMsg(9147, { id: 8 })
        }
        writeLog("豆豆果实采集完成！！")
        for (let index = 0; index <= 0; index++) {
            await wait(200)
            await sendMsg(9147, { id: 9 })
        }
        writeLog("纳格晶体采集完成！！")
        for (let index = 0; index <= 1; index++) {
            await wait(200)
            await sendMsg(9147, { id: 10 })
        }
        writeLog("电能石采集完成！！")
    }
    // Your code here...
})();

if (window.performance) window.performance.now = Date.now;

(function () {
    'use strict';
    // 延迟执行的函数
    function delayedFunction() {
        !function (t, e) { "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).$hookTimer = e() }(this, (function () {
            "use strict"; function t(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function e(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } function n(t, n, r) { return n && e(t.prototype, n), r && e(t, r), t } function r(t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t } function o(t, e) { return (o = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t })(t, e) } function i(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && o(t, e) } function a(t) { return (a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) } function u(t, e) { return !e || "object" !== a(e) && "function" != typeof e ? r(t) : e } function c(t) { return (c = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) })(t) } function l(t, e, n) { return e in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t } var s, f, h, d = 1e3; function y() { return d++ } function p() { return null == s && (s = "undefined" == typeof unsafeWindow ? window : unsafeWindow), s } function v() { var t = p().parent !== p(); try { t = t && "FRAMESET" !== p().parent.document.body.tagName } catch (t) { } return t } function g(t) { var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1 / 0, n = Array.prototype.flat || function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1 / 0; if (t < 1) return this; var e = [], r = t - 1; return this.forEach((function (t) { t instanceof Array ? e = e.concat(n.call(t, r)) : e.push(t) })), e }; return n.call(t, e) } function m(t, e) { (null == e || e > t.length) && (e = t.length); for (var n = 0, r = new Array(e); n < e; n++)r[n] = t[n]; return r } function b(t, e) { if (t) { if ("string" == typeof t) return m(t, e); var n = Object.prototype.toString.call(t).slice(8, -1); return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? m(t, e) : void 0 } } function w(t, e) { return function (t) { if (Array.isArray(t)) return t }(t) || function (t, e) { var n = t && ("undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"]); if (null != n) { var r, o, i = [], a = !0, u = !1; try { for (n = n.call(t); !(a = (r = n.next()).done) && (i.push(r.value), !e || i.length !== e); a = !0); } catch (t) { u = !0, o = t } finally { try { a || null == n.return || n.return() } finally { if (u) throw o } } return i } }(t, e) || b(t, e) || function () { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") }() } function k(t, e) { var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"]; if (!n) { if (Array.isArray(t) || (n = function (t, e) { if (!t) return; if ("string" == typeof t) return x(t, e); var n = Object.prototype.toString.call(t).slice(8, -1); "Object" === n && t.constructor && (n = t.constructor.name); if ("Map" === n || "Set" === n) return Array.from(t); if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return x(t, e) }(t)) || e && t && "number" == typeof t.length) { n && (t = n); var r = 0, o = function () { }; return { s: o, n: function () { return r >= t.length ? { done: !0 } : { done: !1, value: t[r++] } }, e: function (t) { throw t }, f: o } } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") } var i, a = !0, u = !1; return { s: function () { n = n.call(t) }, n: function () { var t = n.next(); return a = t.done, t }, e: function (t) { u = !0, i = t }, f: function () { try { a || null == n.return || n.return() } finally { if (u) throw i } } } } function x(t, e) { (null == e || e > t.length) && (e = t.length); for (var n = 0, r = new Array(e); n < e; n++)r[n] = t[n]; return r } function O() { return null == h && (h = "undefined" == typeof unsafeWindow ? window : unsafeWindow), h } function R() { var t = O().parent !== O(); try { t = t && "FRAMESET" !== O().parent.document.body.tagName } catch (t) { } return t } !function (t) { t.BOOLEAN = "boolean", t.STRING = "string", t.NUMBER = "number", t.SHORTCUT = "shortcut", t.LONG_STRING = "long_string", t.DATE = "date", t.COLOR = "color", t.ARRAY = "array", t.PICKLIST = "picklist", t.DUELING_PICKLIST = "dueling_picklist" }(f || (f = {})); var M = "__hooks_load_module", _ = Object.getOwnPropertyNames.bind(Object), A = Object.getPrototypeOf.bind(Object); function S(t) { var e, n = {}, r = k(_(t)); try { for (r.s(); !(e = r.n()).done;) { var o = e.value; n[o] = t[o] } } catch (t) { r.e(t) } finally { r.f() } return n } var C = [[Array.prototype], [Object, !1]].map((function (t) { var e = w(t, 1)[0]; return [e, S(e)] })); function T(t) { var e, n = k(C); try { for (n.s(); !(e = n.n()).done;) { var r = w(e.value, 2), o = r[0], i = r[1]; if (t === o) return i } } catch (t) { n.e(t) } finally { n.f() } return t } function I(t, e) { return function (t, e) { var n = T(arguments.length > 2 && void 0 !== arguments[2] && !arguments[2] ? t : A(t)), r = n[e]; return "function" == typeof r ? r.bind(t) : n[e] }(e.conditions || [], "reduce")((function (e, n) { return e || Object.entries(n).every((function (e) { var n = w(e, 2), r = n[0], o = n[1]; return t[r] === o })) }), !1) } var E = {}; try { E.addStyle = GM_addStyle } catch (t) { } try { E.addElement = GM_addElement } catch (t) { } try { E.deleteValue = GM_deleteValue } catch (t) { } try { E.listValues = GM_listValues } catch (t) { } try { E.getValue = GM_getValue } catch (t) { } try { E.setValue = GM_setValue } catch (t) { } try { E.addValueChangeListener = GM_addValueChangeListener } catch (t) { } try { E.removeValueChangeListener = GM_removeValueChangeListener } catch (t) { } try { E.xmlhttpRequest = GM_xmlhttpRequest } catch (t) { } try { E.registerMenuCommand = GM_registerMenuCommand } catch (t) { } try { E.unregisterMenuCommand = GM_unregisterMenuCommand } catch (t) { } try { E.download = GM_download } catch (t) { } try { E.log = GM_log } catch (t) { } try { E.openInTab = GM_openInTab } catch (t) { } try { E.setClipboard = GM_setClipboard } catch (t) { } try { E.info = GM_info } catch (t) { } try { E.getResourceText = GM_getResourceText } catch (t) { } try { E.getResourceURL = GM_getResourceURL } catch (t) { } try { E.getTab = GM_getTab } catch (t) { } try { E.getTabs = GM_getTabs } catch (t) { } try { E.saveTab = GM_saveTab } catch (t) { } try { E.notification = GM_notification } catch (t) { } var j = window, D = new Proxy({}, { get: function (t, e) { var n = ["GM", e].join("_"); return j[n] ? j[n] : E[e] ? E[e] : j.GM && j.GM[e] ? j.GM[e] : void 0 } }), P = function () { if (!R()) { for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)e[n] = arguments[n]; var r; if (e.unshift("[TimerHook]"), "function" == typeof D.log) D.log(e.join(" ")); else (r = console).log.apply(r, e) } }, N = function () { if (!R()) { for (var t, e = arguments.length, n = new Array(e), r = 0; r < e; r++)n[r] = arguments[r]; n.unshift("[TimerHook]"), (t = console).warn.apply(t, n) } }, L = function () { function e() { t(this, e), l(this, "host", void 0), l(this, "isActive", !1), l(this, "isMountHost", !1) } return n(e, [{ key: "mountHost", value: function (t) { this.host = t, this.isMountHost = !0, this.onMounted() } }, { key: "activate", value: function () { this.isActive = !0, this.init() } }, { key: "deactivate", value: function () { this.isActive = !1, this.onDestroy() } }, { key: "moduleName", get: function () { } }, { key: "priority", get: function () { return 50 } }, { key: "autoActivate", get: function () { return !0 } }, { key: "isCoreModule", get: function () { return !1 } }, { key: "isOnlyOuterIframe", get: function () { return !1 } }, { key: "getDependencyModule", value: function (t) { if (null != this.host) { var e = this.host.getModule(t); return e && e.moduleIdentityName ? e : void 0 } } }, { key: "init", value: function () { } }, { key: "onMounted", value: function () { } }, { key: "onDestroy", value: function () { } }, { key: "declareConfigs", value: function () { return [] } }, { key: "setConfig", value: function (t, e) { var n = this.getDependencyModule("configs"); n && n.available() || N("Config module not found, can't set configs values."), n.setValue(this.moduleIdentityName, t, e) } }, { key: "getConfig", value: function (t) { var e, n = this.getDependencyModule("configs"), r = (this.declareConfigs().find((function (e) { return e.key === t })) || {}).default; return n && n.available() && null !== (e = n.getValue(this.moduleIdentityName, t)) && void 0 !== e ? e : r } }, { key: "window", get: function () { return this.host ? this.host.getWindow() : O() } }, { key: "document", get: function () { return this.window.document } }]), e }(); function B(t, e, n) { return (B = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) { var r = function (t, e) { for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = c(t));); return t }(t, e); if (r) { var o = Object.getOwnPropertyDescriptor(r, e); return o.get ? o.get.call(n) : o.value } })(t, e, n || t) } function V(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = c(t); if (e) { var o = c(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } var U = function (e) { i(a, e); var o = V(a); function a() { var e; t(this, a); for (var n = arguments.length, i = new Array(n), u = 0; u < n; u++)i[u] = arguments[u]; return l(r(e = o.call.apply(o, [this].concat(i))), "rate", 1), l(r(e), "host", void 0), e } return n(a, [{ key: "onRateChange", value: function (t) { this.rate = t } }, { key: "mountHost", value: function (t) { B(c(a.prototype), "mountHost", this).call(this, t), this.rate = t.rate } }]), a }(L); function G(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = c(t); if (e) { var o = c(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } var H = function (e) { i(a, e); var o = G(a); function a() { var e; t(this, a); for (var n = arguments.length, i = new Array(n), u = 0; u < n; u++)i[u] = arguments[u]; return l(r(e = o.call.apply(o, [this].concat(i))), "isDOMLoaded", !1), l(r(e), "waitDomLoadedCallback", void 0), e } return n(a, [{ key: "onMounted", value: function () { var t = this; B(c(a.prototype), "onMounted", this).call(this), this.document.addEventListener("readystatechange", (function () { "interactive" !== t.document.readyState && "complete" !== t.document.readyState || (t.isDOMLoaded = !0, "function" == typeof t.waitDomLoadedCallback && t.waitDomLoadedCallback(void 0)) })) } }, { key: "waitDomLoaded", value: function () { var t, e, n, r = this; return this.isDOMLoaded || null !== (t = this.document) && void 0 !== t && null !== (e = t.body) && void 0 !== e && null !== (n = e.childNodes) && void 0 !== n && n.length ? Promise.resolve() : new Promise((function (t) { r.waitDomLoadedCallback = t })) } }, { key: "applyStyle", value: function (t) { var e = this.style(), n = this.document.createElement("style"); if (n.setAttribute("type", "text/css"), n.styleSheet) n.styleSheet.cssText = e; else { var r = this.document.createTextNode(e); n.appendChild(r) } t.appendChild(n) } }, { key: "applyElement", value: function () { var t = this.element(); return this.document.body.appendChild(t), t } }, { key: "onUiRateChange", value: function (t) { } }, { key: "onRateChange", value: function (t) { var e = this.rate !== t; B(c(a.prototype), "onRateChange", this).call(this, t), e && this.onUiRateChange(t) } }, { key: "init", value: function () { var t = this; P("Started to loading '".concat(this.moduleIdentityName, "' component...")), this.waitDomLoaded().then((function () { t.applyStyle(t.applyElement()), P("UI component '".concat(t.moduleIdentityName, "' loaded.")) })) } }]), a }(U); function W(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = c(t); if (e) { var o = c(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } var q = "hook_timer__change_rate", F = function (e) { i(a, e); var o = W(a); function a() { var e; t(this, a); for (var n = arguments.length, i = new Array(n), u = 0; u < n; u++)i[u] = arguments[u]; return l(r(e = o.call.apply(o, [this].concat(i))), "rate", 1), l(r(e), "state", "preparing"), l(r(e), "setIntervalOrigin", void 0), l(r(e), "clearIntervalOrigin", void 0), l(r(e), "inTimeCheckId", void 0), e } return n(a, [{ key: "setSpeed", value: function (t) { var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]; if (0 === t && (t = this.defaultRate), t && (t !== this.rate || e) && t > 0 && (this.rate = t, this.onRateChanged(t)), null == t) { var n = prompt("输入欲改变计时器变化倍率（当前：" + this.rate + "）"); n && this.setSpeed(parseFloat(n)) } } }, { key: "speedDown", value: function (t) { null == t && (t = this.getConfig("decrementRate")), this.setSpeed(this.rate - t) } }, { key: "speedUp", value: function (t) { null == t && (t = this.getConfig("incrementRate")), this.setSpeed(this.rate + t) } }, { key: "speedDivide", value: function (t) { null == t && (t = this.getConfig("divideRate")), this.setSpeed(this.rate / (t || 1)) } }, { key: "speedMultiply", value: function (t) { null == t && (t = this.getConfig("multiplyRate")), this.setSpeed(this.rate * (t || 1)) } }, { key: "onRateChanged", value: function (t) { P("Timer speed rate changed to:", t), this.sentChangesToIframe(), this.getAllActivateModules().filter((function (t) { return t.onRateChange })).forEach((function (e) { e.onRateChange(t) })) } }, { key: "beginInTimeCheck", value: function () { var t = this; this.keptInTime && (this.inTimeCheckId = this.setIntervalOrigin.call(this.getWindow(), (function () { t.rate && 1 !== t.rate && t.setSpeed(t.rate, !0) }), this.keptInterval)) } }, { key: "catchOriginMethod", value: function () { this.setIntervalOrigin = this.getWindow().setInterval, this.clearIntervalOrigin = this.getWindow().clearInterval } }, { key: "keptInTime", get: function () { return this.getConfig("keptInTime") } }, { key: "keptInterval", get: function () { return this.getConfig("keptInterval") } }, { key: "defaultRate", get: function () { return this.getConfig("defaultRate") } }, { key: "bootstrap", value: function () { "preparing" === this.state && (this.catchOriginMethod(), this.listenParentEvent(), this.launchModules(this.getAllModules()), this.setSpeed(this.defaultRate), this.beginInTimeCheck(), this.waitForModulesLoad(), this.state = "started") } }, { key: "launchModules", value: function (t) { var e = this; t.filter((function (t) { return t.autoActivate })).forEach((function (t) { var n = t.moduleIdentityName; e.deactivateModules.includes(n) && !t.isCoreModule || e.activateModule(n) })) } }, { key: "registerModules", value: function (t) { var e = this; return t.filter((function (t) { var n = t.moduleIdentityName; return n && e.registerModule(t, t.isOnlyOuterIframe), n })) } }, { key: "waitForModulesLoad", value: function () { var t = this, e = this.getWindow().___hooks_preModules || []; e.length > 0 && this.launchModules(this.registerModules(e)), this.getWindow()[M] = 1, this.getWindow().addEventListener(M, (function (e) { e.detail && e.detail.moduleIdentityName && t.launchModules(t.registerModules([e.detail])) })) } }, { key: "exportOuter", value: function () { var t = this; this.getWindow()._OxA ? (this.getWindow().$hookTimer = this, this.getWindow()._OxA = this) : Object.defineProperty(this.getWindow(), "_OxA", { get: function () { return 1 }, set: function (e) { "_OxA" === e && (t.getWindow().$hookTimer = t) } }) } }, { key: "listenParentEvent", value: function () { var t = this; v() && this.getWindow().addEventListener("message", (function (e) { var n = e.data; (n.type || "") === q && t.setSpeed(n.rate || 0) })) } }, { key: "deactivateModules", get: function () { return this.getConfig("deactivateModules") } }, { key: "sentChangesToIframe", value: function () { var t = this.getWindow().document, e = t.querySelectorAll("iframe") || [], n = t.querySelectorAll("frame"); if (e.length) for (var r = 0; r < e.length; r++)e[r].contentWindow.postMessage({ type: q, rate: this.rate }, "*"); if (n.length) for (var o = 0; o < n.length; o++)n[o].contentWindow.postMessage({ type: q, rate: this.rate }, "*") } }, { key: "declareConfigs", value: function () { return [{ key: "multiplyRate", type: f.NUMBER, default: 2 }, { key: "divideRate", type: f.NUMBER, default: 2 }, { key: "decrementRate", type: f.NUMBER, default: 2 }, { key: "incrementRate", type: f.NUMBER, default: 2 }, { key: "defaultRate", type: f.NUMBER, default: 1 }, { key: "keptInTime", type: f.BOOLEAN, default: !0 }, { key: "keptInterval", type: f.NUMBER, default: 4e3 }, { key: "deactivateModules", type: f.ARRAY, values: this.getAllModules().map((function (t) { return { key: t.moduleIdentityName } })), default: [] }] } }, { key: "setConfig", value: function (t, e) { var n = this.getModule("configs"); n && n.available() || N("Config module not found, can't set configs values."), n.setValue("host", t, e) } }, { key: "getConfig", value: function (t) { var e, n = this.getModule("configs"), r = (this.declareConfigs().find((function (e) { return e.key === t })) || {}).default; return n && n.available() && null !== (e = n.getValue("host", t)) && void 0 !== e ? e : r } }]), a }(function () { function e() { t(this, e), l(this, "modules", {}) } return n(e, [{ key: "activateModule", value: function (t) { var e = this.getModule(t); e ? (e.activate(), P("Module - '".concat(t, "' activated"))) : N("Activate module failed, ".concat(t, " is not found")) } }, { key: "deactivateModule", value: function (t) { var e = this.getModule(t); e || N("Deactivate module failed, '".concat(t, "' is not found")), e.deactivate() } }, { key: "getModule", value: function (t) { return this.modules[t] } }, { key: "registerModule", value: function (t) { var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]; e && v() || (this.modules[t.moduleIdentityName] = t, t.mountHost(this)) } }, { key: "getAllActivateModules", value: function () { return Object.values(this.modules).filter((function (t) { return t.isActive })) } }, { key: "getAllModules", value: function () { return Object.values(this.modules) } }, { key: "getWindow", value: function () { return p() } }]), e }()); var z = function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") }; function Y(t, e) { return t(e = { exports: {} }, e.exports), e.exports } var $ = Y((function (t) { function e(n, r) { return t.exports = e = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t }, e(n, r) } t.exports = e })); var K = function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && $(t, e) }, J = Y((function (t) { function e(n) { return "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? t.exports = e = function (t) { return typeof t } : t.exports = e = function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t }, e(n) } t.exports = e })); var Q = function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }; var X = function (t, e) { return !e || "object" !== J(e) && "function" != typeof e ? Q(t) : e }, Z = Y((function (t) { function e(n) { return t.exports = e = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) }, e(n) } t.exports = e })); var tt = function (t, e) { (null == e || e > t.length) && (e = t.length); for (var n = 0, r = new Array(e); n < e; n++)r[n] = t[n]; return r }; var et = function (t) { if (Array.isArray(t)) return tt(t) }; var nt = function (t) { if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t) }; var rt = function (t, e) { if (t) { if ("string" == typeof t) return tt(t, e); var n = Object.prototype.toString.call(t).slice(8, -1); return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? tt(t, e) : void 0 } }; var ot = function () { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") }; var it = function (t) { return et(t) || nt(t) || rt(t) || ot() }; function at(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } var ut = function (t, e, n) { return e && at(t.prototype, e), n && at(t, n), t }; var ct = function (t, e) { for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = Z(t));); return t }, lt = Y((function (t) { function e(n, r, o) { return "undefined" != typeof Reflect && Reflect.get ? t.exports = e = Reflect.get : t.exports = e = function (t, e, n) { var r = ct(t, e); if (r) { var o = Object.getOwnPropertyDescriptor(r, e); return o.get ? o.get.call(n) : o.value } }, e(n, r, o || n) } t.exports = e })); var st = function (t) { return -1 !== Function.toString.call(t).indexOf("[native code]") }; var ft = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } }, ht = Y((function (t) { function e(n, r, o) { return ft() ? t.exports = e = Reflect.construct : t.exports = e = function (t, e, n) { var r = [null]; r.push.apply(r, e); var o = new (Function.bind.apply(t, r)); return n && $(o, n.prototype), o }, e.apply(null, arguments) } t.exports = e })), dt = Y((function (t) { function e(n) { var r = "function" == typeof Map ? new Map : void 0; return t.exports = e = function (t) { if (null === t || !st(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, e) } function e() { return ht(t, arguments, Z(this).constructor) } return e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }), $(e, t) }, e(n) } t.exports = e })); function yt(t, e) { var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "initAssign", r = Object.getPrototypeOf(e); return Object.setPrototypeOf(t, r), "function" == typeof r[n] && r[n].call(t, e), t } function pt(t) { return Number(Math.random().toString().substr(3, t) + Date.now()).toString(36) } function vt(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = Z(t); if (e) { var o = Z(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return X(this, n) } } !function (t, e) { t(e = { exports: {} }, e.exports) }((function (t) { function e(n) { return "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? t.exports = e = function (t) { return typeof t } : t.exports = e = function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t }, e(n) } t.exports = e })); var gt = { instanceType: function (t) { K(n, t); var e = vt(n); function n() { return z(this, n), e.apply(this, arguments) } return ut(n, [{ key: "initAssign", value: function (t) { this.id = pt(7), function (t, e, n, r) { e && void 0 !== e[n] ? t[n] = e[n] : "function" == typeof r && (t[n] = r()) }(this, t, "uniqueId", (function () { return pt(7) })) } }, { key: "bind", value: function (t) { var e, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : []; return yt((e = lt(Z(n.prototype), "bind", this)).call.apply(e, [this, t].concat(it(r))), this) } }, { key: "before", value: function (t) { var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]; return this.surround({ before: t, adaptAsync: e }) } }, { key: "after", value: function (t) { var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]; return this.surround({ after: t, adaptAsync: e }) } }, { key: "surround", value: function (t) { var e = t.before, n = void 0 === e ? void 0 : e, r = t.after, o = void 0 === r ? void 0 : r, i = t.onError, a = void 0 === i ? void 0 : i, u = t.adaptAsync, c = void 0 !== u && u, l = this; return "function" != typeof l ? l : yt((function () { for (var t = this, e = arguments.length, r = new Array(e), i = 0; i < e; i++)r[i] = arguments[i]; var u = {}, s = { origin: l, args: r, trans: u }, f = "function" == typeof a; try { var h, d, y = !1; return "function" == typeof n && (h = n.call(this, Object.assign({}, s, { preventDefault: function () { y = !0 } })), y) ? h : (d = h instanceof Promise && c ? h.then((function () { return l.apply(t, r) })) : l.apply(this, r), "function" == typeof o && (d = d instanceof Promise && c ? d.then((function (e) { return o.call(t, Object.assign({}, s, { lastValue: e })) })) : o.call(this, Object.assign({}, s, { lastValue: d }))), d instanceof Promise && c && f ? d.catch((function (e) { var n = !1, r = ""; return Promise.resolve(a.call(t, Object.assign({}, s, { error: e, resolve: function (t) { r = t, n = !0 } }))).then((function (t) { if (!n) throw e; return r || t })) })) : d) } catch (t) { if (!f) throw t; var p = !1, v = "", g = function (t) { v = t, p = !0 }, m = a.call(this, Object.assign({}, s, { error: t, resolve: g })); if (!p) throw t; return v || m } }), this) } }, { key: "then", value: function (t) { var e = this; return yt((function () { for (var n = arguments.length, r = new Array(n), o = 0; o < n; o++)r[o] = arguments[o]; var i = e.apply(this, r); return Promise.resolve(i).then(t) }), this) } }, { key: "catch", value: function (t) { var e = this; return yt((function () { var n; try { for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++)o[i] = arguments[i]; if ((n = e.apply(this, o)) instanceof Promise) return n.catch(t) } catch (e) { n = t.call(this, e) } return n }), this) } }, { key: "finally", value: function (t) { var e = this; return yt((function () { var n = function () { try { t.call(this) } catch (t) { } }; try { for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++)o[i] = arguments[i]; var a = e.apply(this, o); return a instanceof Promise ? "function" == typeof a.finally ? a.finally((function () { return n() })) : a.catch((function (t) { return t })).then((function (t) { if (n(), t instanceof Error) throw t })) : (n(), a) } catch (t) { throw n(), t } }), this) } }, { key: "register", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; return this.registerClass((function (e) { var n = function (t) { K(n, t); var e = vt(n); function n() { return z(this, n), e.apply(this, arguments) } return n }(e); return Object.assign(n.prototype, t), n })) } }, { key: "registerClass", value: function (t) { var e = t(this.constructor), n = this.bind(this); if (Object.setPrototypeOf(n, e.prototype), "function" != typeof e || !(n instanceof this.constructor)) throw new Error("Registered class must extend FunctionInstance"); return n } }]), n }(dt(Function)) }; function mt(t, e) { var n = function () { for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)n[r] = arguments[r]; return (t || function () { }).apply(this, n) }; return function (t, e) { var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "initAssign", r = e.prototype; Object.setPrototypeOf(t, r), "function" == typeof r[n] && r[n].call(t) }(n, (e = Object.assign({}, gt, e)).instanceType), n } var bt, wt = { protect: !1, syncDesc: !0, native: !1 }, kt = Object.defineProperty, xt = Object.defineProperties; function Ot(t, e, n) { var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}, o = t[e]; if ("function" == typeof o) { var i = Object.assign({}, wt, r), a = i.native, u = n(a ? o : mt(o)); t[e] = a ? u : function () { for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)e[n] = arguments[n]; try { return u.apply(this, e) } catch (t) { return console.warn("[Hook JS]", "Hooks  running lost once."), o.apply(this, e) } }; var c = i.protect, l = i.syncDesc; c && At(t, e), l && St(o, t[e]) } } function Rt(t, e, n, r) { var o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {}; return Ot(t, e, (function (t) { return t[n](r) }), o) } function Mt(t, e, n) { var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}; return Rt(t, e, "before", n, r) } function _t(t, e, n) { var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}; return Ot(t, e, n, Object.assign({}, r, { native: !0 })) } function At(t, e) { kt.call(Object, t, e, { writable: !1 }) } function St(t, e) { xt.call(Object, e, { toString: { enumerable: !1, writable: !0, value: function () { return t.toString() } }, toLocaleString: { enumerable: !1, writable: !0, value: function () { return t.toLocaleString() } } }) } function Ct(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = c(t); if (e) { var o = c(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } !function (t) { t.TIMEOUT = "timeout", t.INTERVAL = "interval" }(bt || (bt = {})); var Tt = function (e) { i(a, e); var o = Ct(a); function a() { var e; t(this, a); for (var n = arguments.length, i = new Array(n), u = 0; u < n; u++)i[u] = arguments[u]; return l(r(e = o.call.apply(o, [this].concat(i))), "percentage", void 0), l(r(e), "interval", {}), l(r(e), "timeout", {}), l(r(e), "setIntervalOrigin", void 0), l(r(e), "setTimeoutOrigin", void 0), l(r(e), "clearIntervalOrigin", void 0), l(r(e), "clearTimeoutOrigin", void 0), e } return n(a, [{ key: "onMounted", value: function () { B(c(a.prototype), "onMounted", this).call(this), this.setIntervalOrigin = this.window.setInterval, this.setTimeoutOrigin = this.window.setTimeout, this.clearIntervalOrigin = this.window.clearInterval, this.clearTimeoutOrigin = this.window.clearTimeout } }, { key: "init", value: function () { var t = this; this.percentage = 1 / this.rate, _t(this.window, "setInterval", (function (e) { return t.getHookedTimerFunction(bt.INTERVAL, e) })), _t(this.window, "setTimeout", (function (e) { return t.getHookedTimerFunction(bt.TIMEOUT, e) })), Mt(this.window, "clearInterval", (function (e) { var n = e.args; t.redirectNewestId(n) })), Mt(this.window, "clearTimeout", (function (e) { var n = e.args; t.redirectNewestId(n) })) } }, { key: "onRateChange", value: function (t) { var e = this; B(c(a.prototype), "onRateChange", this).call(this, t), this.percentage = 1 / t, Object.values(this.interval).forEach((function (t) { t.args[1] = Math.floor((t.originMS || 1) * e.percentage), e.clearIntervalOrigin.call(e.window, t.nowId), t.nowId = e.setIntervalOrigin.apply(e.window, t.args) })), Object.values(this.timeout).forEach((function (t) { var n = Date.now(), r = t.exceptNextFireTime, o = t.oldPercentage, i = r - n; i < 0 && (i = 0); var a = Math.floor(e.percentage / o * i); t.args[1] = a, t.exceptNextFireTime = n + a, t.oldPercentage = e.percentage, e.clearTimeoutOrigin.call(e.window, t.nowId), t.nowId = e.setTimeoutOrigin.apply(e.window, t.args) })) } }, { key: "notifyExec", value: function (t) { var e = this; t && Object.values(this.timeout).filter((function (e) { return e.uniqueId === t })).forEach((function (t) { e.clearTimeoutOrigin.call(e.window, t.nowId), delete e.timeout[t.originId] })) } }, { key: "redirectNewestId", value: function (t) { var e = t[0]; this.interval[e] && (t[0] = this.interval[e].nowId, delete this.interval[e]), this.timeout[e] && (t[0] = this.timeout[e].nowId, delete this.timeout[e]) } }, { key: "getHookedTimerFunction", value: function (t, e) { var n = t, r = this; return function () { for (var t = arguments.length, o = new Array(t), i = 0; i < t; i++)o[i] = arguments[i]; var a = y(), u = o[0]; "string" == typeof u && (r.window.__timer = { notifyExec: r.notifyExec.bind(r) }, u += ";__timer.notifyExec(" + a + ")", o[0] = u), "function" == typeof u && (o[0] = function () { var t = u.apply(this, arguments); return r.notifyExec(a), t }); var c = o[1]; o[1] *= r.percentage; var l = e.apply(r.window, o); return r[n][l] = { args: o, originMS: c, originId: l, nowId: l, uniqueId: a, oldPercentage: r.percentage, exceptNextFireTime: Date.now() + c }, l } } }, { key: "moduleIdentityName", get: function () { return "timer" } }]), a }(U); function It(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = c(t); if (e) { var o = c(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } var Et, jt = function (e) { i(a, e); var o = It(a); function a() { var e; t(this, a); for (var n = arguments.length, i = new Array(n), u = 0; u < n; u++)i[u] = arguments[u]; return l(r(e = o.call.apply(o, [this].concat(i))), "DateOrigin", void 0), l(r(e), "DateModified", void 0), l(r(e), "rate", 1), l(r(e), "lastDatetime", void 0), l(r(e), "lastMDatetime", void 0), e } return n(a, [{ key: "onMounted", value: function () { B(c(a.prototype), "onMounted", this).call(this), this.lastDatetime = Date.now(), this.lastMDatetime = Date.now(), this.DateOrigin = this.window.Date, this.DateModified = this.window.Date } }, { key: "init", value: function () { this.hookedDate() } }, { key: "onRateChange", value: function (t) { this.DateModified && (this.lastMDatetime = this.DateModified.now(), this.lastDatetime = this.DateOrigin.now()), B(c(a.prototype), "onRateChange", this).call(this, t) } }, { key: "hookedDate", value: function () { var e = this, n = this; _t(this.window, "Date", (function (e) { var r = function (e) { i(o, e); var r = It(o); function o() { t(this, o); for (var e = arguments.length, i = new Array(e), a = 0; a < e; a++)i[a] = arguments[a]; if (0 === i.length) { var u = n.DateOrigin.now(), c = u - n.lastDatetime, l = c * n.rate; i.push(n.lastMDatetime + l) } return r.call.apply(r, [this].concat(i)) } return o }(e); return r = r.bind(new r) })), this.DateModified = this.window.Date, _t(this.DateModified, "now", (function () { return function () { return (new e.DateModified).getTime() } })) } }, { key: "moduleIdentityName", get: function () { return "dateTimer" } }]), a }(U); function Dt(t, e) { var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"]; if (!n) { if (Array.isArray(t) || (n = function (t, e) { if (!t) return; if ("string" == typeof t) return Pt(t, e); var n = Object.prototype.toString.call(t).slice(8, -1); "Object" === n && t.constructor && (n = t.constructor.name); if ("Map" === n || "Set" === n) return Array.from(t); if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Pt(t, e) }(t)) || e && t && "number" == typeof t.length) { n && (t = n); var r = 0, o = function () { }; return { s: o, n: function () { return r >= t.length ? { done: !0 } : { done: !1, value: t[r++] } }, e: function (t) { throw t }, f: o } } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") } var i, a = !0, u = !1; return { s: function () { n = n.call(t) }, n: function () { var t = n.next(); return a = t.done, t }, e: function (t) { u = !0, i = t }, f: function () { try { a || null == n.return || n.return() } finally { if (u) throw i } } } } function Pt(t, e) { (null == e || e > t.length) && (e = t.length); for (var n = 0, r = new Array(e); n < e; n++)r[n] = t[n]; return r } function Nt(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = c(t); if (e) { var o = c(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } !function (t) { t.CTRL = "ctrl", t.META = "meta", t.CMD = "meta", t.SHIFT = "shift", t.ALT = "alt" }(Et || (Et = {})); var Lt = function (e) { i(o, e); var r = Nt(o); function o() { return t(this, o), r.apply(this, arguments) } return n(o, [{ key: "init", value: function () { var t = this, e = this.shortcutList; this.window.addEventListener("keydown", (function (n) { var r, o = Dt(e); try { for (o.s(); !(r = o.n()).done;) { var i = r.value; I(n, i) && (n.preventDefault(), n.stopPropagation(), i.operator(t.host)) } } catch (t) { o.e(t) } finally { o.f() } })) } }, { key: "shortcutList", get: function () { var t = this; return [["shortcutExpressions.+", function (t) { return t.speedUp() }], ["shortcutExpressions.-", function (t) { return t.speedDown() }], ["shortcutExpressions.*", function (t) { return t.speedMultiply() }], ["shortcutExpressions./", function (t) { return t.speedDivide() }], ["shortcutExpressions.reset", function (t) { return t.setSpeed(1) }], ["shortcutExpressions.custom", function (t) { return t.setSpeed() }]].map((function (e) { var n = w(e, 2), r = n[0], o = n[1]; return { expressions: t.getConfig(r), operator: o } })).map((function (t) { return e = t, "string" == typeof (n = Object.assign({}, e, { conditions: [] })).expressions && (n.expressions = n.expressions.split(";")), n.expressions && n.expressions instanceof Array && (n.conditions = n.expressions.map((function (t) { return function (t) { var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "+", n = t.split(e).map((function (t) { return t.trim() })).filter((function (t) { return t })), r = { code: n.pop() || "UNKNOWN_KEY" }; return n.forEach((function (t) { r[t + "Key"] = !0 })), r }(t) }))), n; var e, n })) } }, { key: "moduleIdentityName", get: function () { return "shortcutKey" } }, { key: "declareConfigs", value: function () { return [{ type: f.ARRAY, itemType: f.SHORTCUT, key: "shortcutExpressions.+", default: ["ctrl + Equal", "meta + Equal", "ctrl + Period", "meta + Period"] }, { type: f.ARRAY, itemType: f.SHORTCUT, key: "shortcutExpressions.-", default: ["ctrl + Minus", "meta + Minus", "ctrl + Comma", "meta + Comma"] }, { type: f.ARRAY, itemType: f.SHORTCUT, key: "shortcutExpressions.*", default: ["alt + Equal", "alt + Period"] }, { type: f.ARRAY, itemType: f.SHORTCUT, key: "shortcutExpressions./", default: ["alt + Minus", "alt + Comma"] }, { type: f.ARRAY, itemType: f.SHORTCUT, key: "shortcutExpressions.reset", default: ["ctrl + Digit0", "meta + Digit0", "alt + Digit0"] }, { type: f.ARRAY, itemType: f.SHORTCUT, key: "shortcutExpressions.custom", default: ["ctrl + Digit9", "meta + Digit9"] }] } }]), o }(U); function Bt(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = c(t); if (e) { var o = c(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } function Vt(t, e) { var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"]; if (!n) { if (Array.isArray(t) || (n = function (t, e) { if (!t) return; if ("string" == typeof t) return Ut(t, e); var n = Object.prototype.toString.call(t).slice(8, -1); "Object" === n && t.constructor && (n = t.constructor.name); if ("Map" === n || "Set" === n) return Array.from(t); if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Ut(t, e) }(t)) || e && t && "number" == typeof t.length) { n && (t = n); var r = 0, o = function () { }; return { s: o, n: function () { return r >= t.length ? { done: !0 } : { done: !1, value: t[r++] } }, e: function (t) { throw t }, f: o } } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") } var i, a = !0, u = !1; return { s: function () { n = n.call(t) }, n: function () { var t = n.next(); return a = t.done, t }, e: function (t) { u = !0, i = t }, f: function () { try { a || null == n.return || n.return() } finally { if (u) throw i } } } } function Ut(t, e) { (null == e || e > t.length) && (e = t.length); for (var n = 0, r = new Array(e); n < e; n++)r[n] = t[n]; return r } function Gt(t) { var e, n = {}, r = Vt(Object.entries(t).filter((function (t) { var e = w(t, 1)[0]; return !["target", "key"].includes(e) }))); try { for (r.s(); !(e = r.n()).done;) { var o = w(e.value, 2), i = o[0], a = o[1]; n[i] = a } } catch (t) { r.e(t) } finally { r.f() } return n } var Ht = function (e) { i(a, e); var o = Bt(a); function a() { var e; t(this, a); for (var n = arguments.length, i = new Array(n), u = 0; u < n; u++)i[u] = arguments[u]; return l(r(e = o.call.apply(o, [this].concat(i))), "defines", []), l(r(e), "definePropertiesOrigin", void 0), l(r(e), "definePropertyOrigin", void 0), e } return n(a, [{ key: "onMounted", value: function () { B(c(a.prototype), "onMounted", this).call(this), this.definePropertiesOrigin = this.window.Object.defineProperties, this.definePropertyOrigin = this.window.Object.defineProperty } }, { key: "isCoreModule", get: function () { return !0 } }, { key: "init", value: function () { var t = this; Mt(this.window.Object, "defineProperties", (function (e) { var n, r = e.args, o = w(r, 2), i = o[0], a = o[1], u = Object.entries(a).map((function (e) { var n = w(e, 2), o = n[0], a = n[1], u = Object.assign({ target: i, key: o }, a); return t.hookDefine(u) ? (r[0] = u.target, [u.key, Gt(u)]) : [!1] })).filter((function (t) { return w(t, 1)[0] })); r[1] = (n = {}, u.forEach((function (t) { n[null == t[0] ? "" : t[0]] = t[1] })), n) })), Mt(this.window.Object, "defineProperty", (function (e) { var n = e.args, r = e.preventDefault, o = w(n, 3), i = o[0], a = o[1], u = o[2], c = Object.assign({ target: i, key: a }, u); t.hookDefine(c) ? (n[0] = c.target, n[1] = c.key, n[2] = Gt(c)) : r() })) } }, { key: "hookDefine", value: function (t) { var e, n = Vt(this.defines); try { for (n.s(); !(e = n.n()).done;) { if ((0, e.value)(t)) return !1 } } catch (t) { n.e(t) } finally { n.f() } return !0 } }, { key: "applyDefineRole", value: function (t) { this.defines.push(t) } }, { key: "moduleIdentityName", get: function () { return "definition" } }]), a }(L); function Wt(t) { return function (t) { if (Array.isArray(t)) return m(t) }(t) || function (t) { if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"]) return Array.from(t) }(t) || b(t) || function () { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") }() } function qt(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = c(t); if (e) { var o = c(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } var Ft = function (e) { i(a, e); var o = qt(a); function a() { var e; t(this, a); for (var n = arguments.length, i = new Array(n), u = 0; u < n; u++)i[u] = arguments[u]; return l(r(e = o.call.apply(o, [this].concat(i))), "extraElements", []), e } return n(a, [{ key: "init", value: function () { var t = this; !function (t, e, n) { Rt(t, e, "after", n, arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}) }(this.window.Element.prototype, "attachShadow", (function (e) { var n = e.lastValue; return t.extraElements.push(n), n })) } }, { key: "querySelectorAll", value: function (t) { return g(this.extraElements.map((function (e) { return Wt(e.querySelectorAll(t)) }))) } }, { key: "moduleIdentityName", get: function () { return "shadowDOM" } }, { key: "isCoreModule", get: function () { return !0 } }]), a }(L); function zt(t, e) { var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"]; if (!n) { if (Array.isArray(t) || (n = function (t, e) { if (!t) return; if ("string" == typeof t) return Yt(t, e); var n = Object.prototype.toString.call(t).slice(8, -1); "Object" === n && t.constructor && (n = t.constructor.name); if ("Map" === n || "Set" === n) return Array.from(t); if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Yt(t, e) }(t)) || e && t && "number" == typeof t.length) { n && (t = n); var r = 0, o = function () { }; return { s: o, n: function () { return r >= t.length ? { done: !0 } : { done: !1, value: t[r++] } }, e: function (t) { throw t }, f: o } } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") } var i, a = !0, u = !1; return { s: function () { n = n.call(t) }, n: function () { var t = n.next(); return a = t.done, t }, e: function (t) { u = !0, i = t }, f: function () { try { a || null == n.return || n.return() } finally { if (u) throw i } } } } function Yt(t, e) { (null == e || e > t.length) && (e = t.length); for (var n = 0, r = new Array(e); n < e; n++)r[n] = t[n]; return r } function $t(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = c(t); if (e) { var o = c(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } var Kt = function (e) { i(o, e); var r = $t(o); function o() { return t(this, o), r.apply(this, arguments) } return n(o, [{ key: "onRateChange", value: function (t) { B(c(o.prototype), "onRateChange", this).call(this, t); var e, n = zt(this.allVideoElements); try { for (n.s(); !(e = n.n()).done;) { var r = e.value; this.changePlaybackRate(r, t) } } catch (t) { n.e(t) } finally { n.f() } } }, { key: "init", value: function () { this.preventPlaybackRateLock() } }, { key: "changePlaybackRate", value: function (t, e) { e = e >= 16 ? 16 : e <= .065 ? .065 : e, this.unlockPlaybackRate(t), t.playbackRate = e, 1 !== e && this.lockPlaybackRate(t) } }, { key: "lockPlaybackRate", value: function (t) { var e = (this.definitionModule || {}).definePropertyOrigin; (void 0 === e ? Object.defineProperty : e).call(Object, t, "playbackRate", { configurable: !0, get: function () { return 1 }, set: function () { } }) } }, { key: "unlockPlaybackRate", value: function (t) { delete t.playbackRate, delete t.playbackRate, delete t.playbackRate } }, { key: "definitionModule", get: function () { return this.getDependencyModule("definition") } }, { key: "preventPlaybackRateLock", value: function () { var t = this.definitionModule; t ? t.applyDefineRole((function (t) { if (t.target instanceof HTMLVideoElement && "playbackRate" === t.key) return N("已阻止对该网站视频视频倍率的锁定"), !0 })) : N("`Video Speed Module`, dependency: `definition` module is required.") } }, { key: "allVideoElements", get: function () { var t = this.getDependencyModule("shadowDOM"); return t || N("`Video Speed Module`, dependency: `shadowDOM` module is required."), [].concat(Wt(t ? t.querySelectorAll("video") : []), Wt(this.document.querySelectorAll("video"))) } }, { key: "moduleIdentityName", get: function () { return "videoSpeed" } }]), o }(U); function Jt(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = c(t); if (e) { var o = c(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } var Qt = function (e) { i(o, e); var r = Jt(o); function o(e) { var n, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "__CM"; return t(this, o), (n = r.call(this)).storage = e, n.prefix = i, n } return n(o, [{ key: "isCoreModule", get: function () { return !0 } }, { key: "openPage", value: function (t) { "function" == typeof D.openInTab ? D.openInTab(t, { active: !0 }) : this.window.open(t) } }, { key: "init", value: function () { var t = this; B(c(o.prototype), "init", this).call(this), "function" == typeof D.registerMenuCommand && (D.registerMenuCommand("主页", (function () { t.openPage("https://timer.palerock.cn") })), D.registerMenuCommand("打开配置页面", (function () { t.openPage("https://timer.palerock.cn/configuration") }))) } }, { key: "getAllConfigs", value: function () { var t = this; return this.getDeclaredConfigurations().map((function (e) { var n = t.getValue(e.namespace, e.key); return Object.assign({}, e, { value: null != n ? n : e.default }) })) } }, { key: "getDeclaredConfigurations", value: function () { return g([this.host.declareConfigs().map((function (t) { return Object.assign({}, t, { namespace: "host" }) }))].concat(Wt(this.host.getAllActivateModules().map((function (t) { return t.declareConfigs().map((function (e) { return Object.assign({}, e, { namespace: t.moduleIdentityName, modelName: t.moduleName }) })) }))))) } }, { key: "moduleIdentityName", get: function () { return "configs" } }, { key: "saveAllConfigs", value: function (t) { var e = this; t.forEach((function (t) { var n; e.setValue(t.namespace, t.key, null !== (n = t.value) && void 0 !== n ? n : t.default) })) } }, { key: "getValue", value: function (t, e) { if (this.available()) return this.storage.get([this.prefix, t, e].join("_")) } }, { key: "setValue", value: function (t, e, n) { this.available() && this.storage.set([this.prefix, t, e].join("_"), n) } }, { key: "available", value: function () { return !!this.storage && this.storage.available() } }, { key: "resetAll", value: function () { var t = this; this.storage.list().filter((function (e) { return e.startsWith(t.prefix) })).forEach((function (e) { t.storage.remove(e) })) } }]), o }(L), Xt = function () { function e() { t(this, e), l(this, "isAvailable", void 0) } return n(e, [{ key: "get", value: function (t) { return D.getValue(t) } }, { key: "list", value: function () { return D.listValues() } }, { key: "remove", value: function (t) { D.deleteValue(t) } }, { key: "set", value: function (t, e) { D.setValue(t, e) } }, { key: "available", value: function () { return null == this.isAvailable && (this.isAvailable = [a(D.setValue), a(D.getValue), a(D.listValues), a(D.deleteValue)].every((function (t) { return "function" === t }))), this.isAvailable } }]), e }(); function Zt(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, r = c(t); if (e) { var o = c(this).constructor; n = Reflect.construct(r, arguments, o) } else n = r.apply(this, arguments); return u(this, n) } } var te = function (e) { i(a, e); var o = Zt(a); function a() { var e; t(this, a); for (var n = arguments.length, i = new Array(n), u = 0; u < n; u++)i[u] = arguments[u]; return l(r(e = o.call.apply(o, [this].concat(i))), "nodeElement", void 0), l(r(e), "clickMapper", { "_item-input": function (t) { t.setSpeed() }, "_item-x2": function (t) { t.speedUp() }, "_item-x-2": function (t) { t.speedDown() }, "_item-xx2": function (t) { t.speedMultiply() }, "_item-xx-2": function (t) { t.speedDivide() }, "_item-reset": function (t) { t.setSpeed(0) } }), l(r(e), "setTimeoutOrigin", setTimeout), e } return n(a, [{ key: "moduleIdentityName", get: function () { return "legacyUi" } }, { key: "displayNum", get: function () { return (this.rate.toString().split(".")[1] || "").length > 2 ? this.rate.toFixed(2) : this.rate.toString() } }, { key: "showSuspendedBall", get: function () { return this.getConfig("showSuspendedBall") } }, { key: "deeplyColor", get: function () { return this.getConfig("deeplyColor") } }, { key: "genElement", value: function () { var t = this.document.createElement("div"); t.innerHTML = (this.showSuspendedBall ? '<div class="_th-container" >\n    <div class="_th-click-hover _item-input">\n        x' + this.displayNum + '\n    </div>\n    <div class="_th-item _item-x2">&gt;</div>\n    <div class="_th-item _item-x-2">&lt;</div>\n    <div class="_th-item _item-xx2">&gt;&gt;</div>\n    <div class="_th-item _item-xx-2">&lt;&lt;</div>\n    <div class="_th-item _item-reset">O</div>\n</div>\n' : "") + '<div class="_th_cover-all-show-times _th_hidden">\n    <div class="_th_times">x' + this.displayNum + "</div>\n</div>"; var e = this; return Object.keys(this.clickMapper).forEach((function (n) { var r = e.clickMapper[n], o = t.getElementsByClassName(n)[0]; o && (o.onclick = function () { r(e.host, e.rate) }) })), t } }, { key: "element", value: function () { return this.nodeElement || (this.nodeElement = this.genElement()), this.nodeElement } }, { key: "style", value: function () { var t = this.position, e = this.positionOffset, n = "right" === t ? "left" : "right", r = "left" === t; return "\n        ._th-container ._th-item {\n            margin-bottom: 3px;\n            position: relative;\n            width: 0;\n            height: 0;\n            cursor: pointer;\n            opacity: .3;\n            background-color: aquamarine;\n            border-radius: 100%;\n            text-align: center;\n            line-height: 30px;\n            -webkit-transition: all .35s;\n            -o-transition: all .35s;\n            transition: all .35s;\n            ".concat(n, ": 30px;\n        }\n\n        ._th-container ._th-item, ._th-container ._th-click-hover, ._th_cover-all-show-times ._th_times {\n            -webkit-box-shadow: ").concat(this.deeplyColor ? "4px 5px 10px 6px #b2b2b2" : "-3px 4px 12px -5px black", ";\n            box-shadow: ").concat(this.deeplyColor ? "4px 5px 10px 6px #b2b2b2" : "-3px 4px 12px -5px black", ";\n        }\n\n        ._th-container:hover ._th-item._item-x2 {\n            margin-").concat(t, ": 18px;\n            width: 40px;\n            height: 40px;\n            line-height: 40px\n        }\n\n        ._th-container:hover ._th-item._item-x-2 {\n            margin-").concat(t, ": 17px;\n            width: 38px;\n            height: 38px;\n            line-height: 38px\n        }\n\n        ._th-container:hover ._th-item._item-xx2 {\n            width: 36px;\n            height: 36px;\n            margin-").concat(t, ": 16px;\n            line-height: 36px\n        }\n\n        ._th-container:hover ._th-item._item-xx-2 {\n            width: 32px;\n            height: 32px;\n            line-height: 32px;\n            margin-").concat(t, ": 14px\n        }\n\n        ._th-container:hover ._th-item._item-reset {\n            width: 30px;\n            line-height: 30px;\n            height: 30px;\n            margin-").concat(t, ": 10px\n        }\n\n        ._th-click-hover {\n            position: relative;\n            -webkit-transition: all .5s;\n            -o-transition: all .5s;\n            transition: all .5s;\n            height: 45px;\n            width: 45px;\n            cursor: pointer;\n            opacity: .6;\n            border-radius: 100%;\n            background-color: aquamarine;\n            text-align: center;\n            line-height: 45px;\n            ").concat(n, ": 0\n        }\n\n        ._th-container:hover {\n            ").concat(t, ": -5px\n        }\n\n        ._th-container {\n            font-size: 12px;\n            -webkit-transition: all .5s;\n            -o-transition: all .5s;\n            transition: all .5s;\n            ").concat(t, ": -30px;\n            top: ").concat(e, ";\n            position: fixed;\n            -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n            z-index: 999996;\n            -webkit-user-select: none;\n            -moz-user-select: none;\n            -ms-user-select: none;\n            user-select: none;\n            display: flex;\n            width: 58px;\n            -ms-flex-wrap: wrap;\n                flex-wrap: wrap;\n            -webkit-box-orient: horizontal;\n            -webkit-box-direction: ").concat(r ? "normal" : "reverse", ";\n            -ms-flex-direction: ").concat(r ? "row" : "row-reverse", ";\n                    flex-direction: ").concat(r ? "row" : "row-reverse", ";\n        }\n\n        ._th-container ._th-item:hover {\n            opacity: .8;\n            background-color: #5fb492;\n            color: aliceblue\n        }\n\n        ._th-container ._th-item:active {\n            opacity: .9;\n            background-color: #1b3a26;\n            color: aliceblue\n        }\n\n        ._th-container:hover ._th-click-hover {\n            opacity: .8\n        }\n\n        ._th-container:hover ._th-item {\n            opacity: .6;\n            ").concat(n, ": 0\n        }\n\n        ._th-container ._th-click-hover:hover {\n            opacity: .8;\n            background-color: #5fb492;\n            color: aliceblue\n        }\n\n        ._th_cover-all-show-times {\n            position: fixed;\n            top: 0;\n            ").concat(n, ": 0;\n            width: 100%;\n            height: 100%;\n            z-index: 999996;\n            opacity: 1;\n            font-weight: 900;\n            font-size: 30px;\n            color: #4f4f4f;\n            background-color: rgba(0, 0, 0, 0.1)\n        }\n\n        ._th_cover-all-show-times._th_hidden {\n            z-index: -99999;\n            opacity: 0;\n            -webkit-transition: 1s all;\n            -o-transition: 1s all;\n            transition: 1s all\n        }\n\n        ._th_cover-all-show-times ._th_times {\n            width: 300px;\n            height: 300px;\n            border-radius: 50%;\n            background-color: rgba(127, 255, 212, 0.51);\n            text-align: center;\n            line-height: 300px;\n            position: absolute;\n            top: 50%;\n            ").concat(n, ": 50%;\n            margin-top: -150px;\n            margin-").concat(n, ": -150px\n        }\n        ") } }, { key: "onUiRateChange", value: function (t) { if (B(c(a.prototype), "onUiRateChange", this).call(this, t), this.nodeElement) { var e = this.nodeElement.querySelector("._th-click-hover") || {}, n = this.nodeElement.querySelector("._th_times") || {}, r = this.displayNum; e.innerHTML = "x" + r, n.innerHTML = "x" + r; var o = this.nodeElement.querySelector("._th_cover-all-show-times") || {}; o.className = "_th_cover-all-show-times", this.setTimeoutOrigin.bind(this.window)((function () { o.className = "_th_cover-all-show-times _th_hidden" }), 100) } } }, { key: "position", get: function () { return this.getConfig("position") } }, { key: "positionOffset", get: function () { return this.getConfig("positionOffset") } }, { key: "declareConfigs", value: function () { return [{ key: "position", type: f.STRING, default: "left" }, { key: "positionOffset", type: f.STRING, default: "20%" }, { key: "showSuspendedBall", type: f.BOOLEAN, default: !0, title: "Show Suspended Ball" }, { key: "deeplyColor", type: f.BOOLEAN, default: !0, title: "Deeply Color" }] } }]), a }(H), ee = new F; return ee.exportOuter(), ee.registerModule(new Qt(new Xt)), ee.registerModule(new Ht), ee.registerModule(new Ft), ee.registerModule(new Tt), ee.registerModule(new jt), ee.registerModule(new Kt), ee.registerModule(new Lt, !0), ee.registerModule(new te, !0), ee.bootstrap(), ee
        })); if (window.performance) window.performance.now = Date.now;

        // 在这里编写希望延迟执行的代码
        console.log("这段代码将在5秒后执行！");
    }

    // 设置延迟时间（毫秒）
    var delayMilliseconds = 5000; // 5秒

    // 使用setTimeout来延迟执行函数
    setTimeout(delayedFunction, delayMilliseconds);

})();