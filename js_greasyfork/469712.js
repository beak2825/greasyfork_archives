// ==UserScript==
// @name            赛尔号启航Pc Jealous自用
// @name:en         赛尔号启航Pc Jealous自用
// @namespace       赛尔号启航Pc Jealous自用
// @version         1.00
// @description     赛尔号启航Pc 自用.
// @description:en  helpersaiier
// @include         http://s.61.com/*
// @author          Jealous复制粘贴作者的自用
// @match           http://s.61.com/*,https://img.2125.com/*
// @run-at          document-start
// @grant           none
// @license         GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/469712/%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%90%AF%E8%88%AAPc%20Jealous%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/469712/%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%90%AF%E8%88%AAPc%20Jealous%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==
(function () {
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
    var doneBattleMsg = ""
    var 捕捉ok = false
    var catchCount = 0
    var 捕捉情况 = ""
    // fixMsg()
    // 创建一个 div
    var topWindow = window.top;
    //判断顶层body
    if (topWindow == window) {
        var div = document.createElement("div");
        div.id = "cardPage";
        div.style.position = "fixed";
        div.style.left = "0";
        div.style.top = "100px";
        div.style.width = "250px";
        div.style.height = "300px";
        div.style.backgroundColor = "lightblue";



        var div1 = document.createElement("div");
        div1.style.position = "fixed";
        div1.style.left = "0";
        div1.style.top = "60px";
        // div1.style.width = "px";
        div1.style.height = "10%";

        // 创建一个按钮
        var tosmall = document.createElement("button");
        tosmall.innerHTML = "缩小";
        tosmall.style.display = "block";
        // tosmall.style.margin = "10px auto";
        tosmall.style.width = "45px";
        tosmall.style.height = "30px";
        // 在点击按钮时输出日志到文本框中
        tosmall.onclick = function () {
            if (tosmall.innerHTML == "缩小") {
                tosmall.innerHTML = "展开"
                document.getElementById("cardPage").style.display = "none"
            } else {
                tosmall.innerHTML = "缩小"
                document.getElementById("cardPage").style.display = "block"

            }
        };


        div1.appendChild(tosmall)



        var button0 = document.createElement("h3");
        button0.innerHTML = "⚡启航护肝小助手1.8.8⚡\n  ";
        button0.style.display = "block";
        button0.style.margin = "1px auto";
        button0.style.marginTop = "5px"
        button0.style.width = "200px";
        // button0.style.height = "30px";
        button0.style.fontSize = "16px";
        button0.style.fontWeight = "bold"
        button0.style.textAlign = "center";
        div.appendChild(button0);


        var supportTxt = document.createElement("p");
        supportTxt.innerHTML = "Jealous自用的哦！！！";
        supportTxt.style.display = "block";
        // supportTxt.style.marginLeft = "10px";
        supportTxt.style.width = "250px";
        // supportTxt.style.fontSize = "17px";
        supportTxt.style.fontWeight = "bold"
        supportTxt.style.textAlign = "center";
        supportTxt.style.float = "left";
        supportTxt.style.margin = "0px"
        div.appendChild(supportTxt);

        var supportTxt1 = document.createElement("p");
        supportTxt1.innerHTML = "支持手机端和PC端";
        supportTxt1.style.display = "block";
        supportTxt1.style.width = "250px";
        // supportTxt1.style.height = "15px";
        supportTxt1.style.fontSize = "10px";
        supportTxt1.style.margin = "0px"
        // supportTxt1.style.fontWeight = "bold"
        supportTxt1.style.textAlign = "center";
        supportTxt1.style.float = "left";
        div.appendChild(supportTxt1);

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
                showNotice("Jealous真棒啊！")
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
            if (skillID == "") {
                showToast("请调换首发精灵技能！");
                return
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
                        writeLog("捕捉成功:" + 捕捉情况.pet.nick + " 天赋: " + 捕捉情况.pet.talent)
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



        socketPrototype.createMsg = function (t, e) {
            originalCreateMsg.call(this, t, e);
            var s = this._tmpBytesArray[this._tmpBytesArray.length - 1];
            var raw = s.raw;
            var cmd = s.header.cmd;
            CmdArr.push({ [cmd]: raw });
            // console.log("=======");
            // console.log('接收cmd:', cmd);
            // console.log('raw:', raw);
            try {
                if ((raw.indexOf("skills") != -1) && (raw.indexOf("subCmd") != -1) && (raw.indexOf("pet") != -1)) {
                    skillID = JSON.parse(raw).pet.skills[0];
                    // writeLog("技能刷新完毕:" + JSON.parse(raw).pet.nick)
                }
                if (raw.indexOf("defaultTeam") != -1) {
                    myTeam = JSON.parse(raw).value;
                    console.log(myTeam);
                    writeLog("顺利获取精灵配置信息！")
                }
                if ((cmd == "1120") && (raw.indexOf("starMedal") != -1)) {
                    StartJson = JSON.parse(raw);
                }

                if (cmd == "1049") {
                    bossStatus = true;
                }
                if (cmd == "1044") {
                    捕捉ok = true;
                }
                if (cmd == "288") {
                    changePet = JSON.parse(raw);
                }
                if (cmd == "1056") {
                    console.log("本回合结束")
                    nextRound = true;
                    PetMsgDetail = JSON.parse(raw);
                }
                if (cmd == "769" || cmd == "513") {
                    捕捉情况 = JSON.parse(raw);
                }
                if (cmd == "1109") {
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
            var count0 = getCountByItemId(100191);
            var count1 = getCountByItemId(100193);
            if (count0 >= 1 && count1 >= 1) {
                CountC++
                writeLog("双子阿尔法星轮盘第" + CountC + "次")
                await wait(200)
                await sendMsg(8997, {
                    "levelId": 6,
                    "prizePool": 1
                })
            } else {
                writeLog("双子阿尔法星轮盘清空!")
                break
            }
        }


        CountC = 0
        //暗影星轮盘     每次消耗 2个
        while (1) {
            var count = getCountByItemId(100313);
            if (count >= 2) {
                CountC++
                writeLog("暗影星轮盘第" + CountC + "次")
                await wait(200)
                await sendMsg(8997, {
                    "levelId": 8,
                    "prizePool": 1
                })
            } else {
                writeLog("暗影星轮盘清空!")
                break
            }
        }








    }


    async function getResource() {
        if (rewrite == 0) {
            showToast("请先开启监听！宝贝")
            return
        }
        for (let index = 0; index < 4; index++) {
            await wait(200)
            //皮皮星第一层
            await sendMsg(9147, { id: 1 })  //矿石
            await sendMsg(279, {})
        }
        writeLog("皮皮星第一层采集完成！！")

        for (let index = 0; index < 4; index++) {
            await wait(200)
            //海星第一层
            await sendMsg(9147, { id: 5 })    //甲烷
            await sendMsg(279, {})
        }
        writeLog("海星第一层甲烷采集完成！！")

        for (let index = 0; index < 4; index++) {
            await wait(200)
            //海星第一层
            await sendMsg(9147, { id: 34 }) //金石
            await sendMsg(279, {})
        }
        writeLog("海星第一层金石采集完成！！")

        for (let index = 0; index < 4; index++) {
            await wait(200)
            //海星第二层
            await sendMsg(9147, { id: 3 })
            await sendMsg(279, {})
        }
        writeLog("海星第一层矿石采集完成！！")



        for (let index = 0; index < 4; index++) {
            await wait(200)
            //火星第一层
            await sendMsg(9147, { id: 2 })
            await sendMsg(279, {})
        }
        writeLog("火星第一层矿石采集完成！！")


        for (let index = 0; index < 4; index++) {
            await wait(200)
            //火星第二层
            await sendMsg(9147, { id: 6 })
            await sendMsg(279, {})
        }
        writeLog("火星第一层甲烷采集完成！！")


        for (let index = 0; index < 4; index++) {
            await wait(200)
            //喷泉星第二层
            await sendMsg(9147, { id: 7 })
            await sendMsg(279, {})
        }
        writeLog("喷泉星第二层采集完成！！")


        for (let index = 0; index < 4; index++) {
            await wait(200)
            //喷泉星第二层
            await sendMsg(9147, { id: 8 })
            await sendMsg(279, {})
        }
        writeLog("喷泉星第二层采集完成！！")



        for (let index = 0; index < 4; index++) {
            await wait(200)
            //机械星
            await sendMsg(9147, { id: 10 })
            await sendMsg(279, {})
        }
        writeLog("机械星采集完成！！")
    }
    // Your code here...
})();