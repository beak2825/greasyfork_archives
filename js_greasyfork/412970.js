// ==UserScript==
// @name         mud脚本
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  脚本
// @author       髹影凌风
// @match        http://xo.zjmud.cn:210/*
// @grant        none
// @note          version-0.2:优化了不瞎飞，但是要手动设置掌门人名字和id
// @note          version-0.3:添加了自动答题
// @note          version-0.4:优化了答题bug，并加入了自动抢红包
// @note          version-0.5:全新优化架构，比之前的更高效，若自动逃跑了不会继续运行，点击师门任务就自动运行，偶尔遇到飞任务一下地没有目标就会卡怪，手动再点一次师门任务即可。
// @downloadURL https://update.greasyfork.org/scripts/412970/mud%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/412970/mud%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //可设置的全局变量
    var setting = {
        master_id: 'xuanci',//设置掌门人的id
        master_name: '玄慈大师',//设置掌门人中文名
        robot: 'exert powerup;exert heal;exert recover;',//机器人指令，以分号';'分组，最多5个指令,若关闭自动运行机器人输入off
    };

    //插入style
    document.getElementsByTagName('head')[0].innerHTML +=
        '<style type="text/css">' +
        /*悬浮窗口总体DIV squ-side*/
        '#squ-side{width:250px;height:auto;margin:0px;position:fixed;background:blue;z-index:999999;overflow:hidden;top:40%;left:-220px;' +
        /*具体负的值根据为*/
        '-webkit-transition: .5s ease-in-out;-moz-transition: .5s ease-in-out;-o-transition: .5s ease-in-out;}' +

        /*悬浮窗口内容DIV squ-sidec*/
        '.squ-sidec{float:left;width:210px;border:2px solid #ccc;box-shadow:0px 5px 5px #565656;-webkit-box-shadow:0px 5px 5px #565656;-moz-box-shadow:0px 5px 5px #565656;-o-box-shadow:0px 5px 5px #565656;}' +
        /*鼠标触发渐显效果*/
        '#squ-side:hover{left:0px;}' +
        '#squ-side:hover .squ-sideb .b{opacity:0;filter:alpha(opacity=0);}' +
        '</style>'

    //制作悬浮按钮
    var div = document.createElement('div');
    div.innerHTML = '<!--侧栏漂浮开始-->' +
        '<div id="squ-side">' +
        '<div class="squ-sidec">' +
        '<button id="JSLock" >启动脚本</button>' +
        '</div>' +
        '</div>' +
        '<!--侧栏漂浮结束-->';
    document.getElementsByTagName('body')[0].appendChild(div);

    //启动脚本
    //绑定按钮
    document.querySelector('button[id="JSLock"]').onclick = SwitchJS;

    var a, b, c;//计时器全局变量

    //按钮触发脚本
    function SwitchJS() {

        //开启脚本
        if (document.querySelector('button[id="JSLock"]').innerText == '启动脚本') {
            //改变按钮为关闭按钮
            document.querySelector('button[id="JSLock"]').innerText = '关闭脚本';


            //300ms的定时监视器
            a = setInterval(function () {
                outspan_loop();//消息窗口
            }, 300);

            //2s的定时监视器
            b = setInterval(function () {
                if (outspan != '你的动作还没有完成，不能移动。\n' && outspan != '你猛吹一声口哨，从空中招来一只白雕。\n' && outspan != '你现在正在飞行中！\n') {//如果在飞就不进行
                    hudong_loop();//互动窗口
                }
            }, 2000);

            //1.5s的定时监视器
            c = setInterval(function () {
                console.log('action:' + action);
                console.log('kill_name:"' + kill_name + '"');
                if (outspan != '你的动作还没有完成，不能移动。\n' && outspan != '你猛吹一声口哨，从空中招来一只白雕。\n' && outspan != '你现在正在飞行中！\n') {//如果在飞就不进行
                    person_loop();//当前人\物列表
                }
            }, 1000);

            //设置机器人
            if (setting.robot != 'off') {
                minling('set sign5 ' + setting.robot);
                //启动机器人
                minling('set sign1 1');
                robotinfo = 'on';//机器人状态开启
            }
        }

        //关闭脚本
        else {
            clearInterval(a);//清除消息窗口定时器
            clearInterval(b);//清除互动窗口定时器
            clearInterval(c);//清除人\物列表定时器
            clearInterval(diyu);//清除地狱地图监视器

            //初始化
            outspan = '';//消息字符串

            kill_text = '';//师门任务窗口第二行字符串
            kill_id = '';//从kill_text截取的目标id
            kill_name = '';//从kill_text截取的目标中文，用于判断当地是否有此人
            action = 'none';//用来存储下一步的动作
            answerbool = false;//默认没答过题状态
            answer = '';//答案字符串

            //改变按钮为启动按钮
            document.querySelector('button[id="JSLock"]').innerText = '启动脚本';

            //关闭机器人
            minling('unset sign1');
            robotinfo = 'off';//机器人状态关闭

        }
    }

    //阻塞器，暂停整个js的
    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime) {
                return;
            }
        }
    };

    //判断当前地点该人物是否存在
    function person(name) {
        //循环查询直到有此人则返回true，否则返回false
        content = document.getElementById('obj').childNodes;
        for (let i = 0; i < content.length; i++) {
            if (content[i].innerText == name) {
                return true;
            }
        };
        return false;
    };

    //命令函数
    function minling(code) { sock.emit('stream', code + '\n') };

    var luckymoney;//红包计时器
    var outspan = '';//消息字符串
    var robotinfo = 'off';//机器人默认关闭状态
    var diyu;//地狱地图计时器
    var killinfo = 'none';//默认无目标生死状态

    //各种消息触发事件
    function outspan_loop() {
        //获取消息窗口最后一条信息

        let outspannew = document.querySelector("div[id='out']").lastChild.innerText;
        console.log('"' + outspan + '"');
        if (outspannew != outspan) {
            outspan = outspannew;
            console.count(outspan + '出现次数:')
            //各种信息应对事件
            switch (outspan) {
                case '你运功完毕，吐出一口瘀血，脸色看起来好多了。\n':
                    action = 'none'//初始化行动
                    if (!person(kill_name) && killinfo == 'live') {//如果目标没死且不在就飞怪
                        action = 'follow';
                        minling('fly shimen');
                        console.log('运功完毕，当前没有目标就飞任务')
                    }
                    break;

                case '你猛吹一声口哨，从空中招来一只白雕。\n':
                    break;

                case '系统的红包倒计时：2\n':
                    //每200ms的定时点击'打开'按钮抢红包且唯一
                    luckymoney = setInterval(function () {
                        //找到红包并点击
                        document.querySelector("input[value='打开']").click();
                    }, 50);//200毫秒
                    break;

                case '你已经拆过这个红包了！\n':
                    luckymoney = clearInterval(luckymoney);//清除抢红包计时事件
                    break;

                case '现在没有人发红包或者本轮红包已抢光！\n':
                    luckymoney = clearInterval(luckymoney);//清除抢红包计时事件
                    break;

                case '你已经没有多余力气战斗了。\n':

                    minling('use huxin dan');//使用护心丹快速回血
                    setTimeout(minling('exert heal'), 1000);//延迟1s回气血上限
                    setTimeout(minling('exert recover'), 5000);//延迟5s回血                    
                    action = "recover";

                    break;

                case '你的任务目标逃跑了，重新寻找一下吧！\n':
                    action = 'follow';//跟踪逃跑目标
                    if (!person(kill_name)) {//目标不在就飞怪
                        minling('fly shimen');//任务传送
                    }
                    break;

                case '回答错误！\n':
                    answerbool = false;//表示未答对状态
                    break;

                case '都做了鬼了还这么不老实？！\n':
                    //关闭机器人
                    if (robotinfo == 'on') {//若未关闭机器人
                        minling('unset sign1');
                        robotinfo = 'off';
                        if (action == 'follow') {//如果玩家一进服就是死亡状态，那么action最终会变成follow状态
                            action = 'mengpotang';
                        }
                        //设置1s的启动地狱地图监视器
                        diyu = setInterval(function () {
                            diyu_exits_loop()
                        }, 1000)

                    };

                    personinfo = 'dead';
                    break;

                case '你已经在地府中了却前尘再无牵挂，去孟婆亭领碗孟婆汤，去奈何桥尽头拨开迷雾投胎转世吧。\n':
                    action = 'mengpotang';//去找孟婆
                    break;

                case '你一仰脖子，咕嘟咕嘟地将醧忘汤一饮而尽。。。。。。\n':
                    action = 'naiheqiao'//去奈何桥
                    break;

                case '找不到师门任务npc,无法传送！\n':
                    if (killinfo != 'dead' && action == 'follow') {//这里的follow是从运功疗伤结束后的follow,killinfo是目标信息，
                        //设action为取消任务
                        action = 'cancelquest';
                        //传送到师傅面前
                        minling('fly master');
                    }
                    break;
            };
        };
    };

    var hudongspan = 'none';//互动字符串
    var kill_text = '';//师门任务窗口第二行字符串
    var kill_id = '';//从kill_text截取的目标id
    var kill_name = '';//从kill_text截取的目标中文，用于判断当地是否有此人
    var action = 'none';//用来存储下一步的动作
    var answerbool = false;//默认没答过题状态
    var answer = '';//答案字符串

    //正则匹配变量
    //匹配拼音小写
    const l_letters = /[a-z]/g;
    //匹配计算等式
    const calculate = /[(\d+){1,2}|(\+|\-)]/g; //加减法匹配;

    //处理互动窗口的方法
    function hudong_loop() {

        if (personinfo == 'none' || action == 'none' || kill_name == 'none') {
            minling('quest');
        }

        //传送到掌门人面前
        if (action == 'getquest') {
            if (!person(setting.master_name)) {
                minling('fly master');
            }
        }

        //获取互动窗口第一个子节点的文本
        hudongspan = document.querySelector("div[id='hudong']").firstChild.innerText || 'none';

        if (hudongspan == 'none') {
            minling('quest');//若互动窗口为空，则启动任务
        }

        console.log(hudongspan);
        console.log(hudongspan.substring(0, 3));
        //各种窗口应对事件
        switch (hudongspan.substring(0, 3)) {

            case '任务环'://当窗口是任务窗口时

                answerbool = false;//表示重新回到未答字母\数字题的状态

                //获取任务窗口第二子节点的字符串
                kill_text = document.querySelector("div[id='hudong']").childNodes[2].innerText;
                console.log('kill_text="' + kill_text + '"');

                //确认击杀目标拼音
                kill_id = kill_text.substring(kill_text.indexOf('(') + 1, kill_text.indexOf(')')) || 'none';
                console.log('kill_id="' + kill_id + '"');

                //确认击杀目标中文
                kill_name = kill_text.substring(kill_text.indexOf('死') + 1, kill_text.indexOf('(')) || 'none';
                console.log('kill_name="' + kill_name + '"');

                if (action == 'none' && personinfo != 'dead') {//如果行动为空，且主角未死亡时做下面步骤

                    if (kill_text == '你当前没有领取任务！') {//如果没任务则去领师门任务
                        //设置动作
                        if (kill_name == 'none' && action == 'none') {
                            action = 'getquest';//设置动作为领取师门任务
                            //传送到掌门人面前
                            if (!person(setting.master_name)) {
                                minling('fly master');
                            }
                        }
                    }
                    else if (l_letters.test(kill_id) && action == 'none' && kill_id != 'none') {//如果获取来的kill_id满足全是小写字母的匹配条件
                        action = 'follow';//动作为跟踪怪
                        //飞去任务目标所在地点
                        minling('fly shimen');
                        return;//跳过下面的判断
                    } else {
                        console.log("kill_id满足小写判断:" + l_letters.test(kill_id));
                        minling('quest');//所有条件都不满足则重新打开任务窗口
                    };
                }
                break;


            case '请输入'://遇到回答问题的窗口
                console.log('遇到回答问题窗口');

                //判断是否答过题
                if (answerbool) { return; };//答过则退出
                //请输入( 3 + 1 = ？)的答案：
                //请输入BAEJC中的第5 个字母(大小写均可)：
                //获取判断字母\数字问题的关键词
                switch (hudongspan.substr(-6, 6)) {//从字符串倒数第6个字符向右提取6个字符
                    case '小写均可)：'://字母问题
                        //获取答字母的索引数
                        var q_q = hudongspan.substring(11, 12);
                        //获取问题字母
                        var q_content = hudongspan.substring(3, 8);

                        answer = q_content[q_q - 1];
                        console.log(answer);

                        //回答完重新进入kill行动
                        action = 'kill';

                        answerbool = true;//表示已答状态
                        //回答问题
                        minling('veri ' + answer);
                        break;
                    case '？)的答案：': //数字问题
                        //获取等式为字符串
                        var question_content = (hudongspan.match(calculate).join(""));
                        console.log(question_content);

                        answer = eval(question_content);
                        console.log(answer);

                        //回答完重新进入kill行动
                        action = 'kill';

                        answerbool = true;//表示已答状态
                        //回答问题
                        minling('veri ' + answer);
                        break;
                };
                break;
        };

    };

    var content;// 人、物列表
    var dofind;//寻找延时器
    //var aftercancel;//计时器
    var personinfo = 'live'//默认主角活着的状态

    //处理当前有此人的应对方法
    function person_loop() {
        //获取当前所在人\物品的名单数组
        content = document.getElementById('obj').childNodes;

        for (let i = 0; i < content.length; i++) {
            let person_name = content[i].innerText;
            console.log('当前人物有：' + person_name);
            switch (person_name) {
                case setting.master_name://如果此地有掌门人
                    //找掌门人做不同事件
                    switch (action) {
                        case 'getquest'://领取任务
                            console.log('准备领取任务');
                            //延迟1秒领任务
                            setTimeout(minling('quest ' + setting.master_id), 1000);
                            action = 'none';//初始化动作
                            kill_name = 'none';//初始化目标名字
                            break;

                        case 'cancelquest'://取消任务
                            console.log('准备取消任务');
                            minling('quest cancel');

                            action = 'getquest';//准备获取任务
                            break;

                        case 'none'://打开任务
                            minling('quest');
                    };
                    break;

                case kill_name: //如果此地有目标

                    killinfo = 'live';//发现目标并标志为存活状态
                    //先跟踪后杀
                    switch (action) {

                        case 'follow':
                            action = 'kill';//切换为准备击杀状态
                            minling('follow ' + kill_id);//开始跟踪
                            break;

                        case 'kill':
                            action = 'wait';//切换为确认目标死亡状态
                            minling('kill ' + kill_id);//开始击杀
                            break;

                        /*case 'wait':
                            if (outspan != '你决定开始跟随' + kill_name + '一起行动。\n') {
                                action = 'follow';
                            }
                            break;*/
                        case 'none'://action没行动就打开任务查看
                            minling('quest');
                            break;

                    };
                    break;

                case kill_name + '的尸体'://如果此地有目标的尸体

                    killinfo = 'dead';//发现目标尸体则定为目标死亡状态

                    action = 'none';
                    kill_name = 'none';
                    //延迟2秒确认信函
                    setTimeout(minling('accept quest'), 2000);

                    break;

                /*case '白无常':

                    break;*/

                case '孟婆':
                    switch (action) {
                        case 'mengpotang':
                            minling('ask meng about 孟婆汤');
                            break;
                    }
                    break;

                case '迷雾':
                    if (action == 'naiheqiao') {
                        minling('dash mist');//进入迷雾
                        action = 'none';//回到无动作状态
                        setTimeout(minling('ex'))
                        clearInterval(diyu)//关闭地狱地图监视器
                    }
                    break;

                //物品列表

                case '拔丝山药':
                    minling('get shanyao');
                    break;
                case '珊瑚白菜':
                    minling('get baicai');
                    break;
                case '清水葫芦':
                    minling('get hulu');
                    break;
                case '夹心荸荠':
                    minling('get biji');
                    break;
                case '琉璃茄子':
                    minling('get qiezi');
                    break;
                case '烧饭僧'://有烧饭僧的地方可以装水
                    minling('fill hulu');
                    break;

                //没有以上条内容就fly shimen,先判断有没有目标再设
                default:
                    if (action == 'follow' || action == 'kill' || action == 'wait') {
                        dofind = setTimeout(function () {
                            if (!person(kill_name) && personinfo != 'dead' && outspan != '找不到师门任务npc,无法传送！\n') {
                                clearTimeout(dofind);//清理之前的延时器
                                minling('fly shimen');
                            };
                        }, 2000);
                    };
            };
        };

    };

    var exits = 'none'//地点字符串

    //地狱地点导航的方法
    function diyu_exits_loop() {
        console.log("当前地点：" + exits);
        //获取当前所在地点
        exits = document.querySelector("div[id='exits']").childNodes[0].childNodes[0].childNodes[1].childNodes[1].innerText;
        //各种地点应对事件
        switch (exits) {
            case '鬼门关':
                minling('south');//往南走冥府大道
                break;
            case '冥府大道':
                minling('south');//往南走冥府大道、阎罗殿
                break;
            case '地藏殿':
                minling('south');//往南走背阴山
                break;
            case '背阴山':
                minling('south');//往南走山道
                break;
            case '山道':
                minling('south');//往南走地狱门
                break;
            case '地狱门':
                minling('south');//往南走吊筋狱
                break;
            case '吊筋狱':
                minling('south');//往南走幽枉狱
                break;
            case '幽枉狱':
                minling('south');//往南走火坑狱
                break;
            case '火坑狱':
                minling('south');//往南走酆都狱
                break;
            case '酆都狱':
                minling('south');//往南走拔舌狱
                break;
            case '拔舌狱':
                minling('south');//往南走剥皮狱
                break;
            case '剥皮狱':
                minling('south');//往南走磨捱狱
                break;
            case '磨捱狱':
                minling('south');//往南走椎捣狱
                break;
            case '椎捣狱':
                minling('south');//往南走车崩狱
                break;
            case '车崩狱':
                minling('south');//往南走寒冰狱
                break;
            case '寒冰狱':
                minling('south');//往南走脱壳狱
                break;
            case '脱壳狱':
                minling('south');//往南走抽肠狱
                break;
            case '抽肠狱':
                minling('south');//往南走油锅狱
                break;
            case '油锅狱':
                minling('south');//往南走黑暗狱
                break;
            case '黑暗狱':
                minling('south');//往南走刀山狱
                break;
            case '刀山狱':
                minling('south');//往南走血池狱
                break;
            case '血池狱':
                minling('south');//往南走阿鼻狱
                break;
            case '阿鼻狱':
                minling('south');//往南走秤杆狱
                break;
            case '秤杆狱':
                minling('south');//往南走平安道
                break;
            case '平安道':
                if (action == 'mengpotang') {
                    minling('northeast')//往东北方向走孟婆亭
                }
                if (action == 'naiheqiao') {//喝过孟婆汤
                    minling('south');//往南走奈何桥
                }
                break;
            case '孟婆亭':
                if (action == 'naiheqiao') {
                    minling('southwest')//往西南方向走平安道
                };
                break;



        };
    };

})();