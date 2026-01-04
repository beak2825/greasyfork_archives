// ==UserScript==
// @name         明日方舟抽卡记录
// @namespace    congeal_Plumecongeal_Plume
// @license      GPL-3.0-or-later
// @version      0.1
// @description  在明日方舟官方抽卡记录页面上增加历史记录
// @author       congeal_Plume
// @match        https://ak.hypergryph.com/user/inquiryGacha
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net

// @require      https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.common.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        GM.addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/478845/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E6%8A%BD%E5%8D%A1%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/478845/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E6%8A%BD%E5%8D%A1%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var mainData={}
    // 设置token
    GM.registerMenuCommand("设置token", function(){
        GM.getValue("token").then(function(value) {
            let oldToken = value
            let newToken = prompt("请您输入token",oldToken)
            if(newToken){
                GM.setValue("token", newToken).then(function() {
                    console.log('token已存储');
                }).catch(function(error) {
                    console.error('token存储时出错：', error);
                });
            }
        }).catch(function(error) {
            console.error('获取储存的token出错：', error);
        });
    });

    // 添加按钮
    let newDom = $(`<div id="QueryHistoryDom"></div>`).css({display: "none"})
    $("body").append(newDom)
    let showBtn = $(`<button id="showQueryHistory">查询历史记录</button>`).css({position:"fixed",top:"80px",right:"10px",zIndex:"9999"})
    $("body").append(showBtn)
    let newBtn = $(`<button id="queryHistory">更新数据</button>`).css({position:"absolute",top:"10px",left:"10px",zIndex:"9999"})
    $("#QueryHistoryDom").append(newBtn)
    $("#QueryHistoryDom").append($(`<div id="dataContainer">`))

    $("body").on("click", "#queryHistory", function() {
        console.log(123)
        if(!mainData.disposalData){
            alert("请等待历史数据加载完成")
        }else{
            GM.getValue("token").then(function(value) {
                getData(value,1);
            }).catch(function(error) {
                console.error('获取token时出错：', error);
            });
        }
    })
    // 显示dom
    $("body").on("click", "#showQueryHistory", function() {
        $("#QueryHistoryDom").toggle(300)
        console.log(mainData)
    })
    var token
    var data=[]
    // 获取抽奖记录
    function getData(token,page) {
        $.get(
            `https://ak.hypergryph.com/user/api/inquiry/gacha`,
            {
                page: page,
                token: token,
                channelId: 1,
            },
            function (res) {
                console.log(res)
                if(res.code==0){
                    if (res.data.list.length !== 0) {
                        $.merge(data, res.data.list);
                        getData(token,page + 1);
                    } else {
                        processingData(data)
                    }
                }else{
                    alert(`${res.msg}，请检查token`)
                }
            }
        );
    }
    // 调整数据格式
    function processingData(data) {
        var newDataSource = [];
        //let goodRole = [];
        //let noGood = 0;
        $.each(data, function (tIndex, tItem) {
            $.each(tItem.chars, function (index, item) {
                if(mainData.disposalData.length == 0){
                    newDataSource.push({
                        time: tItem.ts,
                        pool: tItem.pool,
                        rarity: item.rarity,
                        name: item.name,
                        isNew: item.isNew,
                    });
                }else if(tItem.ts > mainData.disposalData[0].time){
                    newDataSource.push({
                        time: tItem.ts,
                        pool: tItem.pool,
                        rarity: item.rarity,
                        name: item.name,
                        isNew: item.isNew,
                    });
                }
            });
        });
        mainData.disposalData = $.merge(newDataSource,mainData.disposalData)
        GM.setValue("queryHistory", mainData.disposalData).then(function() {
            console.log('抽奖记录已存储');
        }).catch(function(error) {
            console.error('抽奖记录存储时出错：', error);
        });
        comData()
    }

    // 获取缓存数据
    mainData.typeNum={2:0,3:0,4:0,5:0}
    GM.getValue("queryHistory").then(function(value) {
        mainData.disposalData = value||[]
        comData()
        console.log('获取已储存的抽奖数据',mainData.disposalData);
    }).catch(function(error) {
        console.error('获取已储存的抽奖数据时出错：', error);
    });


    // 整理数据
    function comData(){
        mainData.startNum={2:0,3:0,4:0,5:0,}
        mainData.cardPoolBox={}
        $.each(mainData.disposalData.toReversed(),function(index,item){
            mainData.typeNum[item.rarity] = mainData.typeNum[item.rarity] + 1
            mainData.startNum[item.rarity] = mainData.startNum[item.rarity]+1
            if(!mainData.cardPoolBox[item.pool]){
                mainData.cardPoolBox[item.pool]={goodRole:[],noGood:0,sum:0}
            }
            mainData.cardPoolBox[item.pool].sum = ++mainData.cardPoolBox[item.pool].sum
            if (item.rarity !== 5) {
                mainData.cardPoolBox[item.pool].noGood = ++mainData.cardPoolBox[item.pool].noGood
                //noGood = ++noGood;
            } else {
                mainData.cardPoolBox[item.pool].noGood = ++mainData.cardPoolBox[item.pool].noGood
                mainData.cardPoolBox[item.pool].goodRole.push({
                    time: item.time,
                    pool: item.pool,
                    rarity: item.rarity,
                    name: item.name,
                    isNew: item.isNew,
                    num: mainData.cardPoolBox[item.pool].noGood,
                });
                mainData.cardPoolBox[item.pool].noGood = 0;
            }
        })
        addPieChart("pieChartBox")
    }


    // 时间戳转化
    function timestampTurn(timestamp) {
        var timestamp = timestamp * 1000; // 将秒转化为毫秒
        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2); // 月份从0开始，因此需要加1
        var day = ("0" + date.getDate()).slice(-2);
        var hours = ("0" + date.getHours()).slice(-2);
        var minutes = ("0" + date.getMinutes()).slice(-2);
        var seconds = ("0" + date.getSeconds()).slice(-2);
        var formattedDate = year + "年" + month + "月" + day + "日  " + hours + ":" + minutes + ":" + seconds;

        return formattedDate
    }
    // 饼状图设置 添加下方数据
    function addPieChart(domId){
        $("#dataContainer").empty()
        let pieChartDom = $(`<div id="${domId}"></div>`).css({width:"400px",height:"300px",background: "white"})
        $("#dataContainer").append(pieChartDom)
        var myChart = echarts.init(document.getElementById(domId));
        var piexhartOption = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                left: 'center'
            },
            series: [
                {
                    type: 'pie',
                    radius: '80%',
                    top: "40",
                    data: [
                        { value: mainData.typeNum[2], name: '3星角色' },
                        { value: mainData.typeNum[3], name: '4星角色' },
                        { value: mainData.typeNum[4], name: '5星角色' },
                        { value: mainData.typeNum[5], name: '6星角色' },
                    ]
                }
            ]
        };
        myChart.setOption(piexhartOption);
        // 添加下方数据
        let textContainer = $(`<div class="textContainer"></div>`)
        textContainer.append($(`<div>一共<font color="#2563eb">${mainData.disposalData.length}</font>抽</div>`))
        //textContainer.append($(`<div>一共<font color="#2563eb">${mainData.typeNum}</font></div>`))
        var colorBox={2:"#000000",3:"#a231ff",4:"#cc7a00",5:"#ee5700"}
        let textBoxOne = $(`<div></div>`)
        $.each(mainData.typeNum,function(index,item){
            textBoxOne.prepend($(`<div style="color:${colorBox[index]}">${parseInt(index)+1}星:${item}[${(item/mainData.disposalData.length*100).toFixed(2)}%]</div>`))
        })
        textContainer.append(textBoxOne)

        // 随机颜色
        var nameColor={}
        function randomColor() {
            let colorBoxTwo=["#3498db","#f1c40f","#9b59b6","#1abc9c","#FF5733","#66CDAA","#6A5ACD","#FFD700","#2E8B57","#FF4500","#87CEEB","#DDA0DD"]
            const randomIndex = Math.floor(Math.random() * colorBoxTwo.length);
            const randomColor = colorBoxTwo[randomIndex];
            return randomColor;
        }
        // 创建文字信息
        let textBoxTwo = $(`<div class="poolBox"></div>`)
        let goodRoleSum = 0
        $.each(mainData.cardPoolBox,function(index,item){
            let newDom = $(`<div></div>`)
            newDom.append($(`<div><font color="#ee5700">${index}</font>卡池记录：一共<font color="#2563eb">${item.sum}</font>抽 累计<font color="#16a34a">${item.noGood}</font>抽未出6星</div>`))
            newDom.append($(`<span>6星历史记录：</span>`))
            $.each(item.goodRole,function(index,item){
                goodRoleSum = goodRoleSum + item.num
                if(!nameColor[item.name]){
                    nameColor[item.name] = randomColor()
                }
                newDom.append($(`<span title="${timestampTurn(item.time)}" style="color:${nameColor[item.name]};cursor: alias;">${item.name}[${item.num}] </span>`))
            })
            if(!item.goodRole.length){
                newDom.append($(`<span>本期没有抽到6星</span>`))
            }
            textBoxTwo.prepend(newDom)

        })
        textContainer.append(textBoxTwo)

        let textBoxThree = $(`<div>6星平均出货次数为：<font color="#16a34a">${(goodRoleSum/mainData.startNum[5]).toFixed(2)}</font></div>`)
        textContainer.append(textBoxThree)

        $("#dataContainer").append(textContainer)

    }

    var css=`
    #QueryHistoryDom {
	display: flex;
	justify-content: center;
	align-items: center;
    flex-direction: column;
	width: 80vw;
	height: 80vh;
	position: absolute;
	top: 0;
	right: 0;
	background: white;
	z-index: 9999;
	border: solid;
    overflow-y: auto;
    }
    #dataContainer {
    max-height: 100%;
    margin: 60px 0;
    }
    .textContainer>div{
    margin-bottom:6px;
    }
    .poolBox>div{
    margin-bottom:2px;
    }
    `
    GM.addStyle(css)

    // Your code here...
})();