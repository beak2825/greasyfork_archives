// ==UserScript==
// @name         sbns
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  try to take over the world!
// @author       You
// @match        http://joucks.cn:3344/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394173/sbns.user.js
// @updateURL https://update.greasyfork.org/scripts/394173/sbns.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.$
     const user = document.querySelector('.hxx')
    user.style.color = 'gray'
    user.innerHTML = ''

    //生成按钮
    const btn = document.createElement('div');
    btn.className = 'tool'
    const btnList = [
        '<button onclick="批量交任务()" title="一键提交任务，共用材料的任务可能导致实际完成数量低于可完成的数量">📜</button>',
        '<button onclick="自动帮派任务()" title="自动做帮派任务，直到材料不足">🚮</button>',
        '<input type="checkbox" onclick="单刷()" id="single-brush">⚔️</input>'
    ]
    btn.innerHTML = btnList.join(' ')
    user.appendChild(btn);

    //生成副本多选
    const fb = document.createElement('div');
    fb.className = 'fb row'
    所有副本().then(res=>{
        const list = res.data.combatList
        fb.innerHTML = list.map(item=>{
            return `<div class="col-md-6 loginfo" style="text-align:left;color:${item.type === 1?'burlywood':''}"><input type="checkbox" name="fb" value="${item._id}"><span>${item.name}</span></div>`
        }).join('')
        if(!res.data.combatList){
            fb.innerHTML = '加载副本失败，请刷新'
        }
        user.insertBefore(fb,btn);
        //本地化勾选的回显
        const checked = JSON.parse(localStorage.getItem('checkedfb')||'[]')
        checked.forEach(item=>{
            const checkbox = document.querySelectorAll('.fb div input')
            checkbox.forEach(check=>{
                if(item === check.value){
                    check.checked = true}
            })
        })
    })

    //以上是初始化脚本dom


    //以下暴露的方法

    //分解
    function fenjie (ueqid) {
        $.post("/api/breakDownEquipmentFunc", { id: ueqid }, function (res) {
            window.addLogFunc(res.msg, "msg")
        })
    }
    //物品id
    //不翻背包是原则，因为卡，只在当前背包页搜索指定名称的道具。
    function 物品id (str){
        if(!str){
            window.addLogFunc('你要找什么呢？')
            return
        }
        let result = ''
        document.querySelectorAll('#goods-list .goods-block').forEach(el=>{
            if(el.children[0].title.includes(str)){
                result = el.id.split('-').pop()
                console.log(result)
            }
        })
        return result
    }
    window.物品id = 物品id

    //卖武器 低于传入数字攻击力的都卖掉
    //type是武器类型，物品右上角那个字
    //col是行数，例如物理攻击在第二行 就写1
    //num是对比的数值，低于的都会被卖掉
    function sellzb(type,col,num){
        if(!type){
            console.warn('例子：武器第一个参数传入`武`')
            return
        }
        if(!num){
            console.warn('例子:（武，700）,低于700的将会分解')
            return
        }
        var 重要属性 = {
            武:'1',
            头:'1',
            腰:'1',
            饰:'2',
            靴:'3',
            甲:'1',
        }
        var dom = document.querySelectorAll('#goods-list .goods-block')
        var 没用得装备 = []
        dom.forEach((el,index)=>{
            if(el.children[1].innerHTML.indexOf(type)>=0 ){
                const column = col === '' || col === null ? 重要属性[type] :col
                if(!el.children[2])return // 避免某些道具写了甲||武这些字
                const 装备属性内容 = el.children[2].innerText.split('佩戴等级').pop()
                if(装备属性内容.match(/\d+/g)[column]<num){
                    //console.log(el.children[2].innerText.match(/\d+/g))
                    没用得装备.push({
                        id:el.id.split('-').pop()
                    })
                }
            }
        })
        console.log(没用得装备)
        if(没用得装备.length<1)return

        const 请求参数 = {
            sell_json: JSON.stringify(没用得装备),
            sell_type: 'make'
        }
        // 利用合成爆炸来销毁多余装备，而且可以批量 美滋滋
        $.post("/api/makeGoods", 请求参数, function (res) {
            window.getUserGoods();
            setTimeout(()=>{
                sellzb(type,col,num)
            },800)
        })
    }
    window.sellzb = sellzb

    //打副本
    function dafuben(combatsid){
        return new Promise((resolve,reject)=>{
            if(!combatsid)return
            $.post('/api/startPeril', {
                cbmid: combatsid
            }, function(res) {
                if(res.data){
                    if(res.data.round_num){
                        //var time = res.data.round_num <3 ? 3 : res.data.round_num
                        //setTimeout(()=>{
                        //    dafuben(combatsid)
                        //},res.data.end_combatsid_at * 1001)
                    }
                    if(res.data.users.length){
                        window.addLogFunc(`<p>${res.data.users[0].goods.map(i=>i.name).join(',')}</p>`)
                    }
                    resolve(res)
                }else{
                    window.addLogFunc("少侠，您正在奋力战斗中~", "msg")
                    reject(res)
                }
            }).error(e=>{
                window.addLogFunc('糟糕服务器出了问题','msg')
                reject(e)
            })
        })
    }
    window.dafuben = dafuben

    //买东西 设定单价，名称？
    //name功能没写，暂时只支持单价去买
    function buy(price,name){
        if(!price){
            console.warn('输入单价喔，总价/数量`')
            return
        }
        var dom = document.querySelectorAll('#transaction #transaction-palyer .my-sell-goods-block')
        var 符合要求的物品集合 = []
        dom.forEach((el,index)=>{
            const 物品数量 = el.children[0].innerText.split('x')[1]
            const 物品总价 = parseInt(el.children[物品数量?1:2].children[0].innerText)
            let 可以购买吗 = 物品总价 <= price
            if(物品数量){
                可以购买吗 = 物品总价 / 物品数量 <= price
                可以购买吗 && 符合要求的物品集合.push({
                    id:el.children[1].children[1].onclick.toString().match(/'([0-9a-z]+)'/g)[0].replace(/'/g,''),
                    msg:`${物品总价}买到${el.children[0].innerText}`
                })
                return
            }
            可以购买吗 && 符合要求的物品集合.push({
                id:el.children[2].children[1].onclick.toString().match(/'([0-9a-z]+)'/g)[0].replace(/'/g,''),
                msg:`${物品总价}买到${el.children[0].innerText}`
            })
        })
        console.log(符合要求的物品集合)
        const bySellGoodsFunc = window.bySellGoodsFunc
        符合要求的物品集合.forEach((el,index)=>{
            setTimeout(()=>{
                bySellGoodsFunc(el.id)
                console.log(el.msg)
            },index * 400)
        })
    }
    window.buy = buy

    //使用道具 为了不调用分页
    function usedj (ugid, divId, countId) {
        $.post('/api/useGoodsToUser', { ugid: ugid }, function (res) {
            console.log('使用成功')
        })
    }
    window.usedj = usedj

    function 所有副本(){
        return new Promise((resolve,reject)=>{
            $.get("/api/getCombatBeMonster", function (res) {
                if(res.data){
                    console.log('请求所有副本',res)
                    return resolve(res)
                }
            }).error(e=>{
                setTimeout(()=>{
                    window.addLogFunc('副本加载不成功，刷新重试','msg')
                },300)
            })
        })
    }
    window.所有副本 = 所有副本

    //整个方法自调用，可以实时获取当前已选和自动开关
    let index = 0 //开始索引
    let lose = 0 // 记录失败次数
    let 达到次数的副本 = [] //不用注释了吧
    let 副本定时器 = null //用来清空定时器的引用
    function 单刷(flag){
        //获取已选的副本
        const checkList = document.querySelectorAll('.fb div input')
        const checked = []
        checkList.forEach(item=>{
            //在这过滤上限本。
            //有个坏处，上限不主动勾掉的话，都要在请求后才知道状态绕过。也就是要亏3s
            //有个好处，刷新给你把上限本勾选去掉了
            if(item.checked && !达到次数的副本.includes(item.value)){
                checked.push(item.value)
            }
        })
        //已选择本地化
        localStorage.setItem('checkedfb',JSON.stringify(checked))

        //判断开关
        const toggle = document.getElementById('single-brush').checked
        toggle && !flag && window.addLogFunc('自动打怪已部署','msg')
        if(toggle){
            if(!checked.length){
                window.addLogFunc('忘了选或者已选的副本都达到上限','msg')
                window.addLogFunc('自动打怪被迫关闭','msg')
                document.getElementById('single-brush').checked = false
                return
            }
        }else{
            !flag && window.addLogFunc(`自动打怪已关闭，共打${index}次，失败${lose}次`, "msg")
            //清空定时器
            clearTimeout(副本定时器)
            //重置计数
            index = 0
            lose = 0
            //关闭的生命周期，你可以在这调用其它脚本。
            return
        }
        //开始战斗了
        const 副本id = checked[index % checked.length]
        dafuben(副本id).then((res)=>{
            index++
            if(res.data.win === 2){
                lose++
            }
            clearTimeout(副本定时器)
            副本定时器 = setTimeout(()=>{
                if(!toggle)return
                单刷(true)
            },res.data.end_combatsid_at * 1001)
        }).catch(e=>{
            console.log(e)
            if(e.msg && e.msg.includes('上限')){
                达到次数的副本.push(副本id)
                window.addLogFunc('有副本达到上限','msg')
            }
            window.addLogFunc('别慌，过3秒恢复','msg')
            clearTimeout(副本定时器)
            副本定时器 = setTimeout(()=>{
                if(!toggle)return
                单刷(true)
            },3000)
            console.log(e)
        })

    }
    window.单刷 = 单刷

    function 用户的任务(){
        return new Promise((resolve,reject)=>{
            $.get('/api/getUserTask', function (res) {
                if (res.code == 200) {
                } else {
                    window.addLogFunc(res.msg, "msg")
                }
                resolve(res)
            }).error(e=>{
                window.addLogFunc('糟糕服务器出了问题','msg')
                reject(e)
            })
        })
    }
    window.用户的任务 = 用户的任务

    function 任务状态(arr){
        if(!arr || !Array.isArray(arr))return false
        return arr.every(good=>good.have_count >= good.need_count)
    }

    let 交任务定时器 = null
    function 批量交任务(){
        用户的任务().then((res)=>{
            console.log('res',res)
            if(res.data.length){
                let 可以提交的任务 = []
                res.data.forEach((item,index)=>{
                    const 物品齐全 = 任务状态(item.needGoods)
                    if(物品齐全){
                        console.log(item)
                        可以提交的任务.push(item.utid)
                    }
                })
                clearTimeout(交任务定时器)
                let index = 0
                交任务定时器 = setInterval(()=>{
                    if(index>=(可以提交的任务.length)){
                        clearInterval(交任务定时器)
                        window.addLogFunc(`共${res.data.length}个任务，完成${可以提交的任务.length}个任务`,'msg')
                    }else{
                        window.payUserTask(可以提交的任务[index])
                    }
                    index++
                },200)
            }else{
                window.addLogFunc('<p style="color:green">任务统统做完了</p>')
            }
        }).catch(err=>{
            console.log('err',err)
        })
    }
    window.批量交任务 = 批量交任务

    //整个方法自调用，根据帮派任务做完和交任务道具结束
    let 帮派定时器 = null
    function 自动帮派任务(id){
        if(id){
            console.log('id',id)
            clearTimeout(帮派定时器)
            window.payUserTask(id)
            帮派定时器 = setTimeout(()=>{
                自动帮派任务()
            },250)
            return
        }
        $.get("/api/getFationTask", function (res) {
            //res.data.task_count
            if(res.data){
                window.addLogFunc(`<p>成功领取帮派任务~</p>`)
            }else{
                window.addLogFunc(`<p>已存在帮派任务~</p>`)
            }
            用户的任务().then((res)=>{
                eachUserTask(res.data) // 重渲染任务列表
                const {utid, needGoods } = (res.data && res.data[0] && res.data[0]) || {}
                const 物品齐全 = 任务状态(needGoods)
                console.log(物品齐全,needGoods,utid)
                if(物品齐全){
                    utid && 自动帮派任务(utid)
                }else{
                    window.addLogFunc(`<p style="color:green">材料都用完了，请过段时间再点~</p>`)
                }
            }).catch(err=>{
                clearTimeout(帮派定时器)
                window.addLogFunc('别慌，接口和其它操作太快触发503，过3秒恢复','msg')
                帮派定时器 = setTimeout(()=>{
                    自动帮派任务()
                },1000)
                console.log('err',err)
            })
        })
    }
    window.自动帮派任务 = 自动帮派任务






// 官方代码
    function eachUserTask(data) {
        $("#user-task").html("")
        for (const item of data) {
            var needGoods = "";
            for (const goods of item.needGoods) {
                needGoods += `<br>【` + goods.name + `】  ` + goods.have_count + `/` + goods.need_count
            }
            var giveGoods = "";
            if (item.task) {
                for (const goods of item.task.give_goods) {
                    giveGoods += `<br>【` + goods.name + `】`
                }
                if (item.task.contribution_num && item.task.contribution_num > 0) {
                    giveGoods += `<br>帮贡 ` + item.task.contribution_num
                }
                if (item.task.repair_num && item.task.repair_num > 0) {
                    giveGoods += `<br>修为点 ` + item.task.repair_num
                }
                if (item.task.game_gold && item.task.game_gold > 0) {
                    giveGoods += `<br>金叶 ` + item.task.game_gold
                }
                if (item.task.game_silver && item.task.game_silver > 0) {
                    giveGoods += `<br>银叶 ` + item.task.game_silver
                }
                if (item.task.game_copper && item.task.game_copper > 0) {
                    giveGoods += `<br>竹叶 ` + item.task.game_copper
                }
                var typestr = ""
                var closeTask = ""
                if (item.task.task_type && item.task.task_type == 4) {
                    typestr += "<span style='color:burlywood;'>帮派</span>-"
                    closeTask = `&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" onclick="colseUserTask('` + item.utid + `')"  >放弃</a>`
                } else if (item.task.task_type && item.task.task_type == 5) {
                    typestr += "<span style='color:burlywood;'>帮派</span>-"
                    closeTask = `&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" onclick="colseUserTask('` + item.utid + `')"  >放弃</a>`
                } else if (item.task.task_type && item.task.task_type == 3) {
                    typestr += "<span style='color:burlywood;'>副本</span>-"
                } else if (item.task.task_type && item.task.task_type == 1) {
                    typestr += "<span style='color:burlywood;'>主线</span>-"
                } else if (item.task.task_type && item.task.task_type == 2) {
                    typestr += "<span style='color:burlywood;'>支线</span>-"
                }
            }

            var needStr = ""
            var giveStr = ""
            if (needGoods) {
                needStr = `所需物品:` + needGoods
            }
            if (giveGoods) {
                giveStr = `任务奖励:` + giveGoods
            }
            var scenesName = ""
            if (item.scenes) {
                scenesName = "场景挑战:" + item.scenes.name + "<br>挑战次数:" + item.scenes_count + "/" + item.task.scenes_count + "<br>"
            }

            var p = `<p class="user-task-info">
                       ${typestr}${item.task.name}
                        <span style="float:right;">
                          ${closeTask}
                          <a href="javascript:;" onclick="payUserTask('${item.utid}')"  >完成</a>
                        </span>
                       <span class="prompt-box">
                            ${item.task.info}
                            ${scenesName}
                            <br>
                            ${needStr}
                            <br>
                            ${giveStr}
                       </span>
                    </p>`
            $("#user-task").append(p)
        }
    }
    window.eachUserTask = eachUserTask


























    // Your code here...
})();