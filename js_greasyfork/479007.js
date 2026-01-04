// ==UserScript==
// @name         Idle Infinity - AutomaticDungeon
// @namespace
// @version      1.2
// @description  Idle Infinity
// @author       小黄不会擦屁股
// @license      MIT
// @grant        GM_addStyle
// @match        https://www.idleinfinity.cn/Map/Dungeon*
// @match        https://www.idleinfinity.cn/Battle/InDungeon*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// @namespace https://greasyfork.org/users/1202891
// @downloadURL https://update.greasyfork.org/scripts/479007/Idle%20Infinity%20-%20AutomaticDungeon.user.js
// @updateURL https://update.greasyfork.org/scripts/479007/Idle%20Infinity%20-%20AutomaticDungeon.meta.js
// ==/UserScript==
var index = 0;
var lag = getRandomInt(2000, 3000);
var unfinished;
var stop=1;
const dataStore = getStore("AutomaticDungeon", { finished: [] });
$(document).ready(function(){
    if(location.href.indexOf('/Map/Dungeon')!=-1){
        //console.log("页面加载完毕，开始脚本");
        addResetButton();
        addStopButton();
        addStartButton();
        //console.log("添加按钮");
        drawMap();
        setTimeout(function() {processNextElement();}, lag);
        //console.log("开始脚本");
    }
});



setInterval(checkForVictory(), lag); // 每5秒执行一次检测

function drawMap() {
    unfinished=[];
    //boss优先
    var boss = $(".panel-body.dungeon-container.hidden-xsm .block").filter(function() {return $(this).hasClass("boss");});
    if(boss.length!=0)
    {
        unfinished.push(boss.first().attr("id"));
        return;
    }
    //打怪优先
    //var monster = $(".panel-body.dungeon-container.hidden-xsm .block").filter(function() {return $(this).hasClass("monster");});
    //if(monster.length!=0)
    //{
    //   monster.each(function() {
    //       unfinished.push($(this).attr("id"));
    //    });
    //    return;
    //}
    //寻址
    var public = $(".panel-body.dungeon-container.hidden-xsm .block").filter(function() {return $(this).hasClass("public");});
    public.each(function() {
        var id=parseInt($(this).attr("id"));
        var top=id-20;
        var left=id-1;
        var right=id+1;
        var bottom=id+20;
        if(!$(this).hasClass("top") && $("#"+top).hasClass("mask"))
        {
            unfinished.push(id);
            //console.log("top"+id);
            return false;
        }else if(!$(this).hasClass("left") && $("#"+left).hasClass("mask") && (id%20!=0))
        {
            unfinished.push(id);
            //console.log("left"+id);
            return false;
        }else if(!$("#"+right).hasClass("left") && $("#"+right).hasClass("mask") && (id%20!=19))
        {
            unfinished.push(id);
            //console.log("right"+id);
            return false;
        }else if(!$("#"+bottom).hasClass("top") && $("#"+bottom).hasClass("mask"))
        {
            unfinished.push(id);
            //console.log("buttom"+id);
            return false;
        }
    });
    //console.log(unfinished)
}

function processNextElement() {
    if(stop ==1){
        if (unfinished.length!=0) {
            //var targetblock = $("#"+unfinished[0]);
            //console.log("共有"+unfinished.length+"个坐标待打，当前第"+index+"个，当前"+"移动至坐标"+targetblock.attr("id"));
            $("#"+unfinished[0]).trigger("mousedown");
            drawMap();
        }else if($(".physical.boss-left").text().includes("0"))
        {
            console.log("秘境结束");
            stop =0;
        }
        lag = getRandomInt(2000, 3000);
        setTimeout(function() {processNextElement();}, lag);
    }else{console.log("检测到停止");}
}

function getStore(key, defualt) {
    return Object.assign({}, defualt, {
        load() {
            const saved = JSON.parse(localStorage.getItem(key) || "{}")
            for (const [key, val] of Object.entries(saved)) {
                this[key] = val
            }
        },
        save() {
            localStorage.setItem(key, JSON.stringify(this))
        },
    })
}

function checkForVictory() {
    if(location.href.indexOf('/Battle/InDungeon')!=-1){
        var queryString = window.location.search;
        var params = new URLSearchParams(queryString);
        var idValue = params.get("id");
        var firstChild = $(".panel.panel-inverse .panel-body .turn").first();
        var content = firstChild.find("div").first().text();

        if (content == "战斗胜利！"||content == "战斗失败……") {
            console.log(content);
            window.location.href = "/Map/Dungeon?id="+idValue;
        }else
        {
            console.log("等待结果");
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);  // 向上取整，确保不会小于最小值
    max = Math.floor(max); // 向下取整，确保不会大于最大值
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createElementByHTML(html) {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    return template.content.firstChild
}

function addStartButton() {
    // 网页上增加配置标记的功能
    const configNode = createElementByHTML(`
            <a class="btn btn-xs btn-success" href="#" role="button">小黄开工</a>
  `)
    document.querySelector(".panel-heading > .pull-right").prepend(configNode)
    for (const node of configNode.querySelectorAll("input")) {
        node.addEventListener('change', (event) => {
            const node = event.target
            console.log(`on change ${node.name}`)
            configStore.tips[node.name] = node.checked
            configStore.save()
        })
    }

    $(".btn.btn-xs.btn-success").click(function() {
        setTimeout(function() {processNextElement();}, lag);
        stop=1;
        console.log('开始秘境');
    });
}

function addStopButton() {
    // 网页上增加配置标记的功能
    const configNode = createElementByHTML(`
            <a class="btn btn-xs btn-primary" href="#" role="button">小黄停工</a>
  `)
    document.querySelector(".panel-heading > .pull-right").prepend(configNode)
    for (const node of configNode.querySelectorAll("input")) {
        node.addEventListener('change', (event) => {
            const node = event.target
            console.log(`on change ${node.name}`)
            configStore.tips[node.name] = node.checked
            configStore.save()
        })
    }
    $(".btn.btn-xs.btn-primary").click(function() {
        stop = 0;
        console.log('停止秘境');
    });
}

function addResetButton() {
    // 网页上增加配置标记的功能
    const configNode = createElementByHTML(`
            <a class="btn btn-xs btn-default" href="#" role="button">小黄重置</a>
  `)
    document.querySelector(".panel-heading > .pull-right").prepend(configNode)
    for (const node of configNode.querySelectorAll("input")) {
        node.addEventListener('change', (event) => {
            const node = event.target
            console.log(`on change ${node.name}`)
            configStore.tips[node.name] = node.checked
            configStore.save()
        })
    }
    $(".btn.btn-xs.btn-default").click(function() {
        localStorage.removeItem("AutomaticDungeon");
        console.log('重置计数');
    });
}